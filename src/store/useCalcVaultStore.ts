import { create } from 'zustand';
import { Message, PeerPresence } from '../types';
import { encryptText, decryptText } from '../utils/cryptoVault';

export type SocketConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface DecoyMessage {
  id: string;
  senderName: string;
  text: string;
  time: string;
  isSelf: boolean;
}

const DEFAULT_DECOY_MESSAGES: DecoyMessage[] = [
  { id: 'dec-1', senderName: 'Rohit (Class CR)', text: 'Bhai kal Discrete Mathematics ka assignment submit karna hai Unit 3 ka.', time: '10:14 AM', isSelf: false },
  { id: 'dec-2', senderName: 'You', text: 'Haan bhai, 4 questions bache hain mere. Sham tak complete ho jayega.', time: '10:16 AM', isSelf: true },
  { id: 'dec-3', senderName: 'Rohit (Class CR)', text: 'Theek hai, library me 4 baje milte hain. C++ lab file bhi sign karwani hai.', time: '10:18 AM', isSelf: false },
  { id: 'dec-4', senderName: 'Aman BCA', text: 'Sir ne bola DBMS practical viva next Monday se start hoga.', time: '11:02 AM', isSelf: false },
  { id: 'dec-5', senderName: 'You', text: 'Okay, thanks for the update bro!', time: '11:05 AM', isSelf: true }
];

const STORAGE_PREFIX = 'calcvault_messages_';
const QUEUE_PREFIX = 'calcvault_queue_';

function safeLoadMessages(roomId: string): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + roomId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load local messages:', e);
  }
  return [];
}

function safeSaveMessages(roomId: string, messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_PREFIX + roomId, JSON.stringify(messages));
  } catch (e) {
    console.warn('Failed to save local messages:', e);
  }
}

function safeLoadQueue(roomId: string): Message[] {
  try {
    const raw = localStorage.getItem(QUEUE_PREFIX + roomId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load queue:', e);
  }
  return [];
}

function safeSaveQueue(roomId: string, queue: Message[]) {
  try {
    localStorage.setItem(QUEUE_PREFIX + roomId, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to save queue:', e);
  }
}

interface CalcVaultState {
  // Real Chat State
  messages: Message[];
  activeRoomId: string;
  socketStatus: SocketConnectionStatus;
  onlineCount: number;
  peers: PeerPresence[];
  isPeerTyping: boolean;
  peerTypingName: string;

  // Spy-Grade Security States
  isDuressMode: boolean; // Fake Decoy Mode vs Real Mode
  decoyMessages: DecoyMessage[];
  isScreenBlurred: boolean; // Privacy shoulder-surfing shield
  e2eeEnabled: boolean; // AES-GCM 256-bit encryption active
  disappearingDuration: number; // 0 = Off, 60 = 1m, 3600 = 1h, 86400 = 24h
  panicWiping: boolean;
  panicCountdown: number;

  // Actions
  initRoom: (roomId: string) => void;
  setSocketStatus: (status: SocketConnectionStatus) => void;
  setOnlineCount: (count: number) => void;
  setPeers: (peers: PeerPresence[]) => void;
  setPeerTyping: (isTyping: boolean, name?: string) => void;

  // Message Operations
  addOptimisticMessage: (msg: Message) => void;
  markMessageSent: (messageId: string) => void;
  markMessageFailed: (messageId: string) => void;
  retryMessage: (messageId: string) => Message | undefined;
  receiveRemoteMessages: (incoming: Message[], currentUserId: string) => void;
  deleteMessage: (messageId: string) => void;
  clearAllMessages: () => void;
  checkDisappearingMessages: () => void;

  // Stealth Actions
  setDuressMode: (isDuress: boolean) => void;
  addDecoyMessage: (text: string) => void;
  setScreenBlurred: (blurred: boolean) => void;
  setE2eeEnabled: (enabled: boolean) => void;
  setDisappearingDuration: (seconds: number) => void;
  triggerPanicWipe: (onFinish?: () => void) => void;
  cancelPanicWipe: () => void;
}

export const useCalcVaultStore = create<CalcVaultState>((set, get) => ({
  messages: [],
  activeRoomId: 'direct',
  socketStatus: 'connecting',
  onlineCount: 1,
  peers: [],
  isPeerTyping: false,
  peerTypingName: '',

  isDuressMode: false,
  decoyMessages: DEFAULT_DECOY_MESSAGES,
  isScreenBlurred: false,
  e2eeEnabled: true,
  disappearingDuration: 0,
  panicWiping: false,
  panicCountdown: 2,

  initRoom: (roomId: string) => {
    const cleanRoom = roomId || 'direct';
    const loaded = safeLoadMessages(cleanRoom);
    set({
      activeRoomId: cleanRoom,
      messages: loaded,
      isDuressMode: false,
      isScreenBlurred: false,
      socketStatus: 'connecting',
    });
  },

  setSocketStatus: (socketStatus) => set({ socketStatus }),
  setOnlineCount: (onlineCount) => set({ onlineCount }),
  setPeers: (peers) => set({ peers }),
  setPeerTyping: (isPeerTyping, peerTypingName = '') => set({ isPeerTyping, peerTypingName }),

  addOptimisticMessage: (msg: Message) => {
    const roomId = get().activeRoomId;
    const optimistic: Message = {
      ...msg,
      status: 'pending',
      timestamp: msg.timestamp || Date.now(),
      roomId,
    };

    set((state) => {
      const updated = [...state.messages, optimistic];
      safeSaveMessages(roomId, updated);

      // Save to offline queue if disconnected
      if (state.socketStatus === 'disconnected') {
        const queue = safeLoadQueue(roomId);
        safeSaveQueue(roomId, [...queue, optimistic]);
      }

      return { messages: updated };
    });
  },

  markMessageSent: (messageId: string) => {
    const roomId = get().activeRoomId;
    set((state) => {
      const updated = state.messages.map((m) =>
        m.id === messageId ? { ...m, status: 'delivered' as const } : m
      );
      safeSaveMessages(roomId, updated);

      // Clean from offline queue
      const queue = safeLoadQueue(roomId).filter((m) => m.id !== messageId);
      safeSaveQueue(roomId, queue);

      return { messages: updated };
    });
  },

  markMessageFailed: (messageId: string) => {
    const roomId = get().activeRoomId;
    set((state) => {
      const updated = state.messages.map((m) =>
        m.id === messageId ? { ...m, status: 'failed' as const } : m
      );
      safeSaveMessages(roomId, updated);
      return { messages: updated };
    });
  },

  retryMessage: (messageId: string) => {
    const msg = get().messages.find((m) => m.id === messageId);
    if (!msg) return undefined;

    get().markMessageSent(messageId); // reset to pending then retry
    return msg;
  },

  receiveRemoteMessages: (incoming: Message[], currentUserId: string) => {
    const roomId = get().activeRoomId;
    set((state) => {
      const existingMap = new Map<string, Message>();
      state.messages.forEach((m) => existingMap.set(m.id, m));

      incoming.forEach((remote) => {
        if (!existingMap.has(remote.id)) {
          existingMap.set(remote.id, {
            ...remote,
            status: remote.senderId === currentUserId ? remote.status || 'delivered' : undefined,
          });
        }
      });

      const sorted = Array.from(existingMap.values()).sort((a, b) => a.timestamp - b.timestamp);
      safeSaveMessages(roomId, sorted);
      return { messages: sorted };
    });
  },

  deleteMessage: (messageId: string) => {
    const roomId = get().activeRoomId;
    set((state) => {
      const updated = state.messages.filter((m) => m.id !== messageId);
      safeSaveMessages(roomId, updated);
      return { messages: updated };
    });
  },

  clearAllMessages: () => {
    const roomId = get().activeRoomId;
    try {
      localStorage.removeItem(STORAGE_PREFIX + roomId);
      localStorage.removeItem(QUEUE_PREFIX + roomId);
    } catch {}
    set({ messages: [] });
  },

  checkDisappearingMessages: () => {
    const now = Date.now();
    const roomId = get().activeRoomId;
    set((state) => {
      const filtered = state.messages.filter((m) => {
        if (!m.vanishesAfter || m.vanishesAfter <= 0) return true;
        const expiresAt = m.timestamp + m.vanishesAfter * 1000;
        return now < expiresAt;
      });

      if (filtered.length !== state.messages.length) {
        safeSaveMessages(roomId, filtered);
        return { messages: filtered };
      }
      return state;
    });
  },

  setDuressMode: (isDuressMode: boolean) => set({ isDuressMode }),

  addDecoyMessage: (text: string) => {
    const newDecoy: DecoyMessage = {
      id: `dec-${Date.now()}`,
      senderName: 'You',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    set((state) => ({
      decoyMessages: [...state.decoyMessages, newDecoy],
    }));
  },

  setScreenBlurred: (isScreenBlurred: boolean) => set({ isScreenBlurred }),
  setE2eeEnabled: (e2eeEnabled: boolean) => set({ e2eeEnabled }),
  setDisappearingDuration: (disappearingDuration: number) => set({ disappearingDuration }),

  triggerPanicWipe: (onFinish?: () => void) => {
    set({ panicWiping: true, panicCountdown: 2 });

    const interval = window.setInterval(() => {
      set((state) => {
        if (!state.panicWiping) {
          window.clearInterval(interval);
          return state;
        }
        if (state.panicCountdown <= 1) {
          window.clearInterval(interval);
          // WIPE ALL LOCAL STORAGE OF CALCVAULT
          try {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k && (k.startsWith('calcvault_') || k.startsWith('calcvault_messages_') || k.startsWith('calcvault_queue_'))) {
                keysToRemove.push(k);
              }
            }
            keysToRemove.forEach((k) => localStorage.removeItem(k));
          } catch {}

          if (onFinish) onFinish();
          return {
            messages: [],
            decoyMessages: [],
            panicWiping: false,
            panicCountdown: 2,
            isDuressMode: false,
          };
        }
        return { panicCountdown: state.panicCountdown - 1 };
      });
    }, 1000);
  },

  cancelPanicWipe: () => {
    set({ panicWiping: false, panicCountdown: 2 });
  },
}));
