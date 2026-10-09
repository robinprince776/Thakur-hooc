import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Message, PeerPresence } from '../types';
import { playReceiveSound, playSendSound, triggerHaptic } from '../utils/sound';

interface UseDirectChatProps {
  peerId: string;
  peerName: string;
  roomId?: string;
  isActiveChat: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onRoomBurned?: () => void;
}

export function useDirectChat({
  peerId,
  peerName,
  roomId = 'direct',
  isActiveChat,
  soundEnabled,
  hapticsEnabled,
  onRoomBurned,
}: UseDirectChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [peers, setPeers] = useState<PeerPresence[]>([]);
  const [isPeerTyping, setIsPeerTyping] = useState<boolean>(false);
  const [peerTypingName, setPeerTypingName] = useState<string>('');

  const wsRef = useRef<WebSocket | null>(null);
  const lastBurnRef = useRef<number>(0);
  const typingTimerRef = useRef<number | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Clean up any old wipe timestamps from storage so all chat history is restored
  useEffect(() => {
    try {
      localStorage.removeItem(`calcvault_wiped_${roomId}`);
    } catch {}
  }, [roomId]);

  const filterExpired = useCallback((list: Message[]): Message[] => {
    const now = Date.now();
    const seen = new Set<string>();
    const result: Message[] = [];

    for (const m of list) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);

      // Filter out only expired vanishing messages
      if (m.vanishesAfter && m.vanishesAfter > 0) {
        if (now >= m.timestamp + m.vanishesAfter * 1000) continue;
      }
      result.push(m);
    }
    return result;
  }, []);

  // Fetch latest messages & presence from HTTP endpoint (Guaranteed fallback)
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/messages?roomId=${encodeURIComponent(roomId)}&peerId=${encodeURIComponent(peerId)}&peerName=${encodeURIComponent(peerName)}&inChat=${isActiveChat ? '1' : '0'}`
      );
      if (!res.ok) return;
      const data = await res.json();

      // Check if room was burned on server
      if (data.lastBurnTimestamp && data.lastBurnTimestamp > lastBurnRef.current) {
        lastBurnRef.current = data.lastBurnTimestamp;
        setMessages([]);
        if (hasInitializedRef.current && onRoomBurned) {
          onRoomBurned();
        }
      }

      if (Array.isArray(data.messages)) {
        setMessages((prev) => {
          const visibleMessages = filterExpired(data.messages);
          const prevIds = new Set(prev.map((m) => m.id));
          const newRemote = visibleMessages.filter(
            (m: Message) => !prevIds.has(m.id) && m.senderId !== peerId
          );

          // ONLY play sound & vibration if user is ACTIVELY in chat (STEALTH PROTECTION)
          if (newRemote.length > 0 && hasInitializedRef.current && isActiveChat) {
            if (soundEnabled) playReceiveSound();
            if (hapticsEnabled) triggerHaptic([30, 40]);
          }

          return visibleMessages;
        });
      }

      if (typeof data.onlineCount === 'number') {
        setOnlineCount(data.onlineCount);
      }
      if (Array.isArray(data.peers)) {
        setPeers(data.peers);
      }
      hasInitializedRef.current = true;
    } catch (e) {
      console.warn('Direct chat fetch error:', e);
    }
  }, [roomId, peerId, peerName, isActiveChat, soundEnabled, hapticsEnabled, onRoomBurned, filterExpired]);

  // Initial fetch and regular polling interval (every 1.5 seconds)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1500);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Periodic local tick to purge expired vanishing messages
  useEffect(() => {
    const expireInterval = setInterval(() => {
      setMessages((prev) => {
        const now = Date.now();
        const hasExpired = prev.some(
          (m) => m.vanishesAfter && m.vanishesAfter > 0 && now >= m.timestamp + m.vanishesAfter * 1000
        );
        if (!hasExpired) return prev;
        return prev.filter(
          (m) => !m.vanishesAfter || m.vanishesAfter <= 0 || now < m.timestamp + m.vanishesAfter * 1000
        );
      });
    }, 1000);

    return () => clearInterval(expireInterval);
  }, []);

  // Sync presence state to WebSocket whenever room, peer or inChat changes
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'presence_update',
          roomId,
          peerId,
          peerName,
          inChat: isActiveChat,
        })
      );
    }
  }, [isActiveChat, roomId, peerId, peerName]);

  // WebSocket Connection for instant real-time events
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: number | null = null;
    let isMounted = true;

    function connectWs() {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//${window.location.host}`);
        wsRef.current = ws;

        ws.onopen = () => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: 'join_room',
                roomId,
                peerId,
                peerName,
                inChat: isActiveChat,
              })
            );
          }
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'server_heartbeat') {
              return;
            }
            if (data.type === 'init') {
              if (Array.isArray(data.messages)) {
                setMessages(filterExpired(data.messages));
              }
              if (data.onlineCount) setOnlineCount(data.onlineCount);
              if (Array.isArray(data.peers)) setPeers(data.peers);
              if (data.lastBurnTimestamp) lastBurnRef.current = data.lastBurnTimestamp;
            } else if (data.type === 'new_message') {
              const msg: Message = data.message;
              if (msg.roomId && msg.roomId !== roomId) return;

              setMessages((prev) => {
                if (prev.some((m) => m.id === msg.id)) return prev;
                return [...prev, msg];
              });

              if (msg.senderId !== peerId && isActiveChat) {
                if (soundEnabled) playReceiveSound();
                if (hapticsEnabled) triggerHaptic([30, 40]);
              }
            } else if (data.type === 'peer_typing') {
              if (data.roomId && data.roomId !== roomId) return;
              if (data.senderId !== peerId) {
                setIsPeerTyping(data.isTyping);
                setPeerTypingName(data.senderName || 'Dost');
                if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                if (data.isTyping) {
                  typingTimerRef.current = window.setTimeout(() => {
                    setIsPeerTyping(false);
                  }, 2500);
                }
              }
            } else if (data.type === 'online_change') {
              if (data.onlineCount) setOnlineCount(data.onlineCount);
            } else if (data.type === 'presence_update') {
              if (data.roomId && data.roomId !== roomId) return;
              if (Array.isArray(data.peers)) {
                setPeers(data.peers);
              }
            } else if (data.type === 'room_burned') {
              if (data.roomId && data.roomId !== roomId) return;
              setMessages([]);
              lastBurnRef.current = data.timestamp || Date.now();
              if (onRoomBurned) onRoomBurned();
            } else if (data.type === 'message_burned') {
              setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
            }
          } catch (e) {
            console.error('WS parse error:', e);
          }
        };

        ws.onclose = () => {
          if (isMounted) {
            reconnectTimeout = window.setTimeout(connectWs, 3000);
          }
        };

        ws.onerror = () => {
          if (ws?.readyState === WebSocket.OPEN) ws.close();
        };
      } catch (err) {
        console.warn('WS not available, using HTTP polling', err);
      }
    }

    connectWs();

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (ws) ws.close();
    };
  }, [roomId, peerId, peerName, isActiveChat, soundEnabled, hapticsEnabled, onRoomBurned, filterExpired]);

  // Derive Friend Status
  const otherPeers = useMemo(() => peers.filter((p) => p.peerId !== peerId), [peers, peerId]);
  const activeFriend = otherPeers.find((p) => p.isOnline) || otherPeers[0];
  const isFriendOnline = Boolean(activeFriend?.isOnline);
  const isFriendInChat = Boolean(activeFriend?.inChat && activeFriend?.isOnline);
  const friendName = activeFriend?.peerName || peerTypingName || 'Friend';
  const friendLastSeen = activeFriend?.lastSeen || 0;

  // Send Text Message
  const sendMessage = useCallback(
    async (text: string, vanishesAfter?: number) => {
      if (!text.trim()) return false;

      const newMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: peerId,
        senderName: peerName,
        roomId,
        text: text.trim(),
        timestamp: Date.now(),
        vanishesAfter,
      };

      // Optimistic update (deduplicated)
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (soundEnabled && isActiveChat) playSendSound();
      if (hapticsEnabled && isActiveChat) triggerHaptic(15);

      // Send via WebSocket if open, else fallback to HTTP
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'message', ...newMsg }));
      } else {
        try {
          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMsg),
          });
        } catch (e) {
          console.error('HTTP send error:', e);
        }
      }

      return true;
    },
    [peerId, peerName, roomId, soundEnabled, hapticsEnabled, isActiveChat]
  );

  // Send Voice Audio Note
  const sendAudio = useCallback(
    async (audioDataUrl: string, duration?: number, vanishesAfter?: number) => {
      const newMsg: Message = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: peerId,
        senderName: peerName,
        roomId,
        audioData: audioDataUrl,
        audioDuration: duration,
        timestamp: Date.now(),
        vanishesAfter,
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (soundEnabled && isActiveChat) playSendSound();
      if (hapticsEnabled && isActiveChat) triggerHaptic(20);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'message', ...newMsg }));
      } else {
        try {
          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMsg),
          });
        } catch (e) {
          console.error('Audio HTTP send error:', e);
        }
      }

      return true;
    },
    [peerId, peerName, roomId, soundEnabled, hapticsEnabled, isActiveChat]
  );

  // Send Photo
  const sendImage = useCallback(
    async (imageDataUrl: string, vanishesAfter?: number) => {
      const newMsg: Message = {
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: peerId,
        senderName: peerName,
        roomId,
        imageData: imageDataUrl,
        timestamp: Date.now(),
        vanishesAfter,
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (soundEnabled && isActiveChat) playSendSound();
      if (hapticsEnabled && isActiveChat) triggerHaptic(20);

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'message', ...newMsg }));
      } else {
        try {
          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMsg),
          });
        } catch (e) {
          console.error('Image HTTP send error:', e);
        }
      }

      return true;
    },
    [peerId, peerName, roomId, soundEnabled, hapticsEnabled, isActiveChat]
  );

  // Send typing status
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'typing',
            senderId: peerId,
            senderName: peerName,
            roomId,
            isTyping,
          })
        );
      }
    },
    [peerId, peerName, roomId]
  );

  // Burn entire chat on server & both phones (Manual user action)
  const burnEntireChat = useCallback(async () => {
    setMessages([]);
    try {
      await fetch('/api/burn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ byName: peerName, roomId }),
      });
    } catch (e) {
      console.error('Burn error:', e);
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'burn_all',
          senderName: peerName,
          roomId,
        })
      );
    }
  }, [peerName, roomId]);

  // Burn single message
  const burnSingleMessage = useCallback(async (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    try {
      await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Delete message error:', e);
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'burn_message',
          messageId,
          roomId,
        })
      );
    }
  }, [roomId]);

  return {
    messages,
    onlineCount,
    isPeerTyping,
    peerTypingName,
    peers,
    friendStatus: {
      isOnline: isFriendOnline,
      inChat: isFriendInChat,
      name: friendName,
      lastSeen: friendLastSeen,
    },
    sendMessage,
    sendAudio,
    sendImage,
    sendTyping,
    burnEntireChat,
    burnSingleMessage,
    refreshMessages: fetchMessages,
  };
}
