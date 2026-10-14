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

const STORAGE_PREFIX = 'calcvault_messages_';

function loadStoredMessages(room: string): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + room);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load stored messages', e);
  }
  return [];
}

function saveStoredMessages(room: string, msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_PREFIX + room, JSON.stringify(msgs));
  } catch (e) {
    console.warn('Failed to save stored messages', e);
  }
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
  // Initialize messages directly from permanent localStorage
  const [messages, setMessages] = useState<Message[]>(() => loadStoredMessages(roomId));
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [peers, setPeers] = useState<PeerPresence[]>([]);
  const [isPeerTyping, setIsPeerTyping] = useState<boolean>(false);
  const [peerTypingName, setPeerTypingName] = useState<string>('');

  const wsRef = useRef<WebSocket | null>(null);
  const lastBurnRef = useRef<number>(0);
  const typingTimerRef = useRef<number | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Sync to localStorage on every messages state update
  useEffect(() => {
    saveStoredMessages(roomId, messages);
  }, [messages, roomId]);

  // When roomId changes, load messages for the new room
  useEffect(() => {
    setMessages(loadStoredMessages(roomId));
  }, [roomId]);

  // Merge messages: keep all existing, add new ones without duplicates, never auto-delete
  const mergeMessages = useCallback((incoming: Message[]) => {
    setMessages((prev) => {
      const existingMap = new Map<string, Message>();
      for (const m of prev) {
        existingMap.set(m.id, m);
      }
      for (const m of incoming) {
        if (!existingMap.has(m.id)) {
          existingMap.set(m.id, m);
        }
      }
      const sorted = Array.from(existingMap.values()).sort((a, b) => a.timestamp - b.timestamp);
      return sorted;
    });
  }, []);

  // Fetch latest messages & presence from HTTP endpoint
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/messages?roomId=${encodeURIComponent(roomId)}&peerId=${encodeURIComponent(peerId)}&peerName=${encodeURIComponent(peerName)}&inChat=${isActiveChat ? '1' : '0'}`
      );
      if (!res.ok) return;
      const data = await res.json();

      if (Array.isArray(data.messages)) {
        setMessages((prev) => {
          const prevIds = new Set(prev.map((m) => m.id));
          const newRemote = data.messages.filter(
            (m: Message) => !prevIds.has(m.id) && m.senderId !== peerId
          );

          if (newRemote.length > 0 && hasInitializedRef.current && isActiveChat) {
            if (soundEnabled) playReceiveSound();
            if (hapticsEnabled) triggerHaptic([30, 40]);
          }

          // Merge without losing any local messages
          const map = new Map<string, Message>();
          for (const m of prev) map.set(m.id, m);
          for (const m of data.messages) map.set(m.id, m);
          return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
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
  }, [roomId, peerId, peerName, isActiveChat, soundEnabled, hapticsEnabled]);

  // Initial fetch and regular polling interval (every 2.5 seconds)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Sync presence state to WebSocket
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
            if (data.type === 'server_heartbeat') return;

            if (data.type === 'init') {
              if (Array.isArray(data.messages)) {
                mergeMessages(data.messages);
              }
              if (data.onlineCount) setOnlineCount(data.onlineCount);
              if (Array.isArray(data.peers)) setPeers(data.peers);
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
              if (Array.isArray(data.peers)) setPeers(data.peers);
            } else if (data.type === 'message_burned') {
              setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
            }
          } catch (e) {
            console.error('WS parse error:', e);
          }
        };

        ws.onclose = () => {
          if (isMounted) {
            reconnectTimeout = window.setTimeout(connectWs, 3500);
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
  }, [roomId, peerId, peerName, isActiveChat, soundEnabled, hapticsEnabled, mergeMessages]);

  // Derive Friend Status
  const otherPeers = useMemo(() => peers.filter((p) => p.peerId !== peerId), [peers, peerId]);
  const activeFriend = otherPeers.find((p) => p.isOnline) || otherPeers[0];
  const isFriendOnline = Boolean(activeFriend?.isOnline);
  const isFriendInChat = Boolean(activeFriend?.inChat && activeFriend?.isOnline);
  const friendName = activeFriend?.peerName || peerTypingName || 'Friend';
  const friendLastSeen = activeFriend?.lastSeen || 0;

  // Send Text Message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return false;

      const newMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: peerId,
        senderName: peerName,
        roomId,
        text: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (soundEnabled && isActiveChat) playSendSound();
      if (hapticsEnabled && isActiveChat) triggerHaptic(15);

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
    async (audioDataUrl: string, duration?: number) => {
      const newMsg: Message = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: peerId,
        senderName: peerName,
        roomId,
        audioData: audioDataUrl,
        audioDuration: duration,
        timestamp: Date.now(),
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
    async (imageDataUrl: string) => {
      const newMsg: Message = {
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderId: peerId,
        senderName: peerName,
        roomId,
        imageData: imageDataUrl,
        timestamp: Date.now(),
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

  // Clear all messages (Manual action with user confirmation)
  const burnEntireChat = useCallback(async () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_PREFIX + roomId);
      await fetch('/api/burn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ byName: peerName, roomId }),
      });
    } catch (e) {
      console.error('Clear chat error:', e);
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

  // Delete single message (Manual action)
  const burnSingleMessage = useCallback(async (messageId: string) => {
    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== messageId);
      saveStoredMessages(roomId, filtered);
      return filtered;
    });

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
