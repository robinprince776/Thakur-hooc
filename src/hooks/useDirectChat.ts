import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Message, PeerPresence } from '../types';
import { playReceiveSound, playSendSound, triggerHaptic } from '../utils/sound';
import { useCalcVaultStore } from '../store/useCalcVaultStore';
import { encryptText, decryptText } from '../utils/cryptoVault';
import { compressImage } from '../utils/mediaOptimizer';

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
  const {
    messages,
    activeRoomId,
    socketStatus,
    onlineCount,
    peers,
    isPeerTyping,
    peerTypingName,
    isDuressMode,
    decoyMessages,
    isScreenBlurred,
    e2eeEnabled,
    disappearingDuration,
    panicWiping,
    panicCountdown,
    initRoom,
    setSocketStatus,
    setOnlineCount,
    setPeers,
    setPeerTyping,
    addOptimisticMessage,
    markMessageSent,
    markMessageFailed,
    receiveRemoteMessages,
    deleteMessage,
    clearAllMessages,
    checkDisappearingMessages,
    setDuressMode,
    addDecoyMessage,
    setScreenBlurred,
    setE2eeEnabled,
    setDisappearingDuration,
    triggerPanicWipe,
  } = useCalcVaultStore();

  const wsRef = useRef<WebSocket | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const hasInitializedRef = useRef<boolean>(false);
  const reconnectAttemptRef = useRef<number>(0);

  // Initialize Room when roomId changes
  useEffect(() => {
    initRoom(roomId);
  }, [roomId, initRoom]);

  // Periodic Disappearing message cleaner (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      checkDisappearingMessages();
    }, 5000);
    return () => clearInterval(timer);
  }, [checkDisappearingMessages]);

  // Anti-Shoulder Surfing / Screenshot protection: Blur screen on visibility change or window blur
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setScreenBlurred(true);
      }
    };

    const handleBlur = () => {
      setScreenBlurred(true);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [setScreenBlurred]);

  // Helper: Decrypt array of incoming messages
  const decryptIncoming = useCallback(
    async (rawList: Message[]): Promise<Message[]> => {
      if (!Array.isArray(rawList)) return [];
      const decrypted = await Promise.all(
        rawList.map(async (msg) => {
          if (msg.text && msg.text.startsWith('enc:aes-gcm:')) {
            const plain = await decryptText(msg.text, roomId);
            return { ...msg, text: plain, encrypted: true };
          }
          return msg;
        })
      );
      return decrypted;
    },
    [roomId]
  );

  // Flush queued messages when connection is re-established
  const flushOfflineQueue = useCallback(async () => {
    try {
      const raw = localStorage.getItem(`calcvault_queue_${roomId}`);
      if (!raw) return;
      const queue: Message[] = JSON.parse(raw);
      if (!Array.isArray(queue) || queue.length === 0) return;

      for (const msg of queue) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'message', ...msg }));
          markMessageSent(msg.id);
        } else {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(msg),
          });
          if (res.ok) {
            markMessageSent(msg.id);
          }
        }
      }
      localStorage.removeItem(`calcvault_queue_${roomId}`);
    } catch (e) {
      console.warn('Queue flush error:', e);
    }
  }, [roomId, markMessageSent]);

  // Fetch latest messages & presence from HTTP endpoint (Fallback & Initial Load)
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/messages?roomId=${encodeURIComponent(roomId)}&peerId=${encodeURIComponent(peerId)}&peerName=${encodeURIComponent(peerName)}&inChat=${isActiveChat ? '1' : '0'}`
      );
      if (!res.ok) {
        setSocketStatus('disconnected');
        return;
      }
      const data = await res.json();

      if (Array.isArray(data.messages)) {
        const decryptedList = await decryptIncoming(data.messages);
        const prevCount = messages.length;
        receiveRemoteMessages(decryptedList, peerId);

        // Notify sound if new remote message arrived
        if (hasInitializedRef.current && isActiveChat && decryptedList.length > prevCount) {
          const hasNewFromPeer = decryptedList.some(
            (m) => m.senderId !== peerId && Date.now() - m.timestamp < 4000
          );
          if (hasNewFromPeer) {
            if (soundEnabled) playReceiveSound();
            if (hapticsEnabled) triggerHaptic([30, 40]);
          }
        }
      }

      if (typeof data.onlineCount === 'number') {
        setOnlineCount(data.onlineCount);
      }
      if (Array.isArray(data.peers)) {
        setPeers(data.peers);
      }

      hasInitializedRef.current = true;
      if (socketStatus === 'disconnected') {
        setSocketStatus('connected');
        flushOfflineQueue();
      }
    } catch (e) {
      console.warn('Direct chat fetch error:', e);
      setSocketStatus('disconnected');
    }
  }, [
    roomId,
    peerId,
    peerName,
    isActiveChat,
    soundEnabled,
    hapticsEnabled,
    messages.length,
    decryptIncoming,
    receiveRemoteMessages,
    setOnlineCount,
    setPeers,
    setSocketStatus,
    socketStatus,
    flushOfflineQueue,
  ]);

  // Regular HTTP polling (every 3 seconds for rock-solid consistency)
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
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

  // WebSocket Connection with exponential backoff auto-reconnect
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: number | null = null;
    let isMounted = true;

    function connectWs() {
      try {
        setSocketStatus('connecting');
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(`${protocol}//${window.location.host}`);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          reconnectAttemptRef.current = 0;
          setSocketStatus('connected');
          flushOfflineQueue();

          ws?.send(
            JSON.stringify({
              type: 'join_room',
              roomId,
              peerId,
              peerName,
              inChat: isActiveChat,
            })
          );
        };

        ws.onmessage = async (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'server_heartbeat') return;

            if (data.type === 'init') {
              if (Array.isArray(data.messages)) {
                const dec = await decryptIncoming(data.messages);
                receiveRemoteMessages(dec, peerId);
              }
              if (data.onlineCount) setOnlineCount(data.onlineCount);
              if (Array.isArray(data.peers)) setPeers(data.peers);
            } else if (data.type === 'new_message') {
              const msg: Message = data.message;
              if (msg.roomId && msg.roomId !== roomId) return;

              let finalMsg = msg;
              if (msg.text && msg.text.startsWith('enc:aes-gcm:')) {
                const dec = await decryptText(msg.text, roomId);
                finalMsg = { ...msg, text: dec, encrypted: true };
              }

              receiveRemoteMessages([finalMsg], peerId);

              if (finalMsg.senderId !== peerId && isActiveChat) {
                if (soundEnabled) playReceiveSound();
                if (hapticsEnabled) triggerHaptic([30, 40]);
              }
            } else if (data.type === 'peer_typing') {
              if (data.roomId && data.roomId !== roomId) return;
              if (data.senderId !== peerId) {
                setPeerTyping(data.isTyping, data.senderName || 'Dost');
                if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                if (data.isTyping) {
                  typingTimerRef.current = window.setTimeout(() => {
                    setPeerTyping(false);
                  }, 2500);
                }
              }
            } else if (data.type === 'online_change') {
              if (data.onlineCount) setOnlineCount(data.onlineCount);
            } else if (data.type === 'presence_update') {
              if (data.roomId && data.roomId !== roomId) return;
              if (Array.isArray(data.peers)) setPeers(data.peers);
            } else if (data.type === 'message_burned') {
              deleteMessage(data.messageId);
            } else if (data.type === 'room_burned') {
              clearAllMessages();
              if (onRoomBurned) onRoomBurned();
            }
          } catch (e) {
            console.error('WS parse error:', e);
          }
        };

        ws.onclose = () => {
          if (isMounted) {
            setSocketStatus('disconnected');
            // Backoff reconnection
            const attempt = reconnectAttemptRef.current;
            const delay = Math.min(1000 * Math.pow(1.5, attempt), 10000);
            reconnectAttemptRef.current += 1;
            reconnectTimeout = window.setTimeout(connectWs, delay);
          }
        };

        ws.onerror = () => {
          if (ws?.readyState === WebSocket.OPEN) ws.close();
        };
      } catch (err) {
        console.warn('WS initialization error:', err);
        setSocketStatus('disconnected');
      }
    }

    connectWs();

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (ws) ws.close();
    };
  }, [
    roomId,
    peerId,
    peerName,
    isActiveChat,
    soundEnabled,
    hapticsEnabled,
    decryptIncoming,
    receiveRemoteMessages,
    deleteMessage,
    clearAllMessages,
    onRoomBurned,
    setOnlineCount,
    setPeers,
    setPeerTyping,
    setSocketStatus,
    flushOfflineQueue,
  ]);

  // Derive Friend Status
  const otherPeers = useMemo(() => peers.filter((p) => p.peerId !== peerId), [peers, peerId]);
  const activeFriend = otherPeers.find((p) => p.isOnline) || otherPeers[0];
  const isFriendOnline = Boolean(activeFriend?.isOnline);
  const isFriendInChat = Boolean(activeFriend?.inChat && activeFriend?.isOnline);
  const friendName = activeFriend?.peerName || peerTypingName || 'Friend';
  const friendLastSeen = activeFriend?.lastSeen || 0;

  // Send Text Message (with Optimistic UI & Web Crypto E2EE)
  const sendMessage = useCallback(
    async (text: string, vanishesAfterSeconds?: number) => {
      if (!text.trim()) return false;

      // In Decoy mode, don't send real network payload, just append decoy
      if (isDuressMode) {
        addDecoyMessage(text);
        if (soundEnabled && isActiveChat) playSendSound();
        if (hapticsEnabled && isActiveChat) triggerHaptic(15);
        return true;
      }

      const rawText = text.trim();
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const timestamp = Date.now();
      const vanishTimer = vanishesAfterSeconds ?? (disappearingDuration > 0 ? disappearingDuration : undefined);

      // 1. Instantly display in UI (Optimistic UI with pending clock status)
      const optimisticMsg: Message = {
        id: messageId,
        senderId: peerId,
        senderName: peerName,
        roomId,
        text: rawText,
        timestamp,
        vanishesAfter: vanishTimer,
        status: 'pending',
        encrypted: e2eeEnabled,
      };

      addOptimisticMessage(optimisticMsg);
      if (soundEnabled && isActiveChat) playSendSound();
      if (hapticsEnabled && isActiveChat) triggerHaptic(15);

      // 2. Encrypt text if E2EE enabled
      let payloadText = rawText;
      if (e2eeEnabled) {
        try {
          payloadText = await encryptText(rawText, roomId);
        } catch (e) {
          console.warn('Encryption failed, sending plain:', e);
        }
      }

      const networkMsg: Message = {
        ...optimisticMsg,
        text: payloadText,
      };

      // 3. Dispatch through WebSocket or HTTP
      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'message', ...networkMsg }));
          markMessageSent(messageId);
        } else {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(networkMsg),
          });

          if (!res.ok) {
            markMessageFailed(messageId);
            return false;
          }
          markMessageSent(messageId);
        }
      } catch (err) {
        console.error('Send message error:', err);
        markMessageFailed(messageId);
        return false;
      }

      return true;
    },
    [
      isDuressMode,
      addDecoyMessage,
      soundEnabled,
      isActiveChat,
      hapticsEnabled,
      disappearingDuration,
      peerId,
      peerName,
      roomId,
      e2eeEnabled,
      addOptimisticMessage,
      markMessageSent,
      markMessageFailed,
    ]
  );

  // Send Voice Audio Note (with single audio tracking & compression)
  const sendAudio = useCallback(
    async (audioDataUrl: string, duration?: number, vanishesAfterSeconds?: number) => {
      const messageId = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const timestamp = Date.now();
      const vanishTimer = vanishesAfterSeconds ?? (disappearingDuration > 0 ? disappearingDuration : undefined);

      const optimisticMsg: Message = {
        id: messageId,
        senderId: peerId,
        senderName: peerName,
        roomId,
        audioData: audioDataUrl,
        audioDuration: duration,
        timestamp,
        vanishesAfter: vanishTimer,
        status: 'pending',
      };

      addOptimisticMessage(optimisticMsg);
      if (soundEnabled && isActiveChat) playSendSound();
      if (hapticsEnabled && isActiveChat) triggerHaptic(20);

      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'message', ...optimisticMsg }));
          markMessageSent(messageId);
        } else {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(optimisticMsg),
          });
          if (!res.ok) {
            markMessageFailed(messageId);
            return false;
          }
          markMessageSent(messageId);
        }
      } catch (e) {
        console.error('Audio HTTP send error:', e);
        markMessageFailed(messageId);
        return false;
      }

      return true;
    },
    [
      peerId,
      peerName,
      roomId,
      disappearingDuration,
      addOptimisticMessage,
      soundEnabled,
      isActiveChat,
      hapticsEnabled,
      markMessageSent,
      markMessageFailed,
    ]
  );

  // Send Photo (with Client-Side Canvas Compression to Max 800px, 0.7 quality)
  const sendImage = useCallback(
    async (imageDataUrl: string, vanishesAfterSeconds?: number) => {
      const messageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const timestamp = Date.now();
      const vanishTimer = vanishesAfterSeconds ?? (disappearingDuration > 0 ? disappearingDuration : undefined);

      // Compress client-side before sending
      let compressedData = imageDataUrl;
      try {
        compressedData = await compressImage(imageDataUrl, 800, 800, 0.7);
      } catch (e) {
        console.warn('Image compression fallback:', e);
      }

      const optimisticMsg: Message = {
        id: messageId,
        senderId: peerId,
        senderName: peerName,
        roomId,
        imageData: compressedData,
        timestamp,
        vanishesAfter: vanishTimer,
        status: 'pending',
      };

      addOptimisticMessage(optimisticMsg);
      if (soundEnabled && isActiveChat) playSendSound();
      if (hapticsEnabled && isActiveChat) triggerHaptic(20);

      try {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'message', ...optimisticMsg }));
          markMessageSent(messageId);
        } else {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(optimisticMsg),
          });
          if (!res.ok) {
            markMessageFailed(messageId);
            return false;
          }
          markMessageSent(messageId);
        }
      } catch (e) {
        console.error('Image send error:', e);
        markMessageFailed(messageId);
        return false;
      }

      return true;
    },
    [
      peerId,
      peerName,
      roomId,
      disappearingDuration,
      addOptimisticMessage,
      soundEnabled,
      isActiveChat,
      hapticsEnabled,
      markMessageSent,
      markMessageFailed,
    ]
  );

  // Retry a failed message
  const retryFailedMessage = useCallback(
    async (messageId: string) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;

      if (msg.text) {
        await sendMessage(msg.text, msg.vanishesAfter);
        deleteMessage(messageId);
      } else if (msg.imageData) {
        await sendImage(msg.imageData, msg.vanishesAfter);
        deleteMessage(messageId);
      } else if (msg.audioData) {
        await sendAudio(msg.audioData, msg.audioDuration, msg.vanishesAfter);
        deleteMessage(messageId);
      }
    },
    [messages, sendMessage, sendImage, sendAudio, deleteMessage]
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
    clearAllMessages();
    try {
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
  }, [peerName, roomId, clearAllMessages]);

  // Delete single message (Manual action)
  const burnSingleMessage = useCallback(
    async (messageId: string) => {
      deleteMessage(messageId);

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
    },
    [roomId, deleteMessage]
  );

  return {
    messages,
    decoyMessages,
    isDuressMode,
    isScreenBlurred,
    socketStatus,
    onlineCount,
    isPeerTyping,
    peerTypingName,
    peers,
    e2eeEnabled,
    disappearingDuration,
    panicWiping,
    panicCountdown,
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
    retryFailedMessage,
    burnEntireChat,
    burnSingleMessage,
    refreshMessages: fetchMessages,
    setDuressMode,
    setScreenBlurred,
    setE2eeEnabled,
    setDisappearingDuration,
    triggerPanicWipe,
  };
}
