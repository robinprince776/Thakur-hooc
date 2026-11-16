import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message, UserSettings, NatureWallpaper } from '../types';
import { AudioPlayer } from './AudioPlayer';
import {
  Lock,
  Clock,
  Image as ImageIcon,
  Send,
  Mic,
  Square,
  Settings as SettingsIcon,
  Trash2,
  Check,
  CheckCheck,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  Timer,
  EyeOff,
  Flame,
  Users,
  Sparkles,
  Moon,
  Star,
  Type,
} from 'lucide-react';
import { playLockSound, triggerHaptic } from '../utils/sound';
import { WALLPAPERS, getWallpaperUrl } from '../utils/wallpapers';
import { useCalcVaultStore } from '../store/useCalcVaultStore';

export type ChatFontType = 'make-a-note' | 'indie' | 'kalam' | 'cursive';

export const CHAT_FONTS: { id: ChatFontType; label: string; sample: string; className: string }[] = [
  { id: 'make-a-note', label: 'Make a Note (Default ✨)', sample: 'Neat & charming note style', className: 'font-note-patrick' },
  { id: 'indie', label: 'Indie Note 🌸', sample: 'Playful note doodle', className: 'font-note-indie' },
  { id: 'kalam', label: 'Kalam Pen ✍️', sample: 'Everyday ballpoint ink', className: 'font-note-kalam' },
  { id: 'cursive', label: 'Cozy Cursive 🌙', sample: 'Dreamy cursive notes', className: 'font-cursive' },
];

interface SecretChatProps {
  peerId: string;
  settings: UserSettings;
  messages: Message[];
  onlineCount: number;
  isPeerTyping: boolean;
  peerTypingName: string;
  friendStatus?: {
    isOnline: boolean;
    inChat: boolean;
    name: string;
    lastSeen: number;
  };
  onSendMessage: (text: string, vanishesAfter?: number) => Promise<boolean>;
  onSendAudio: (audioDataUrl: string, duration?: number, vanishesAfter?: number) => Promise<boolean>;
  onSendImage: (imageDataUrl: string, vanishesAfter?: number) => Promise<boolean>;
  onSendTyping: (isTyping: boolean) => void;
  onBurnMessage: (messageId: string) => void;
  onBurnEntireChat: () => void;
  onBackToCalculator: () => void;
  onBackToBca?: () => void;
  onOpenSettings: () => void;
  onOpenInstall?: () => void;
  onChangeWallpaper: (wallpaper: NatureWallpaper) => void;
}

// Strictly Cute & Aesthetic Emojis (No Hearts, Just Stars, Moons, Clouds, Cozy Vibes)
const QUICK_EMOJIS = ['✨', '🌙', '☁️', '⭐', '☕', '🎧', '🐱', '👍'];

function formatLastSeen(timestamp: number): string {
  if (!timestamp) return '';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 45) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getAudioMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) {
      return t;
    }
  }
  return '';
}

export const SecretChat: React.FC<SecretChatProps> = ({
  peerId,
  settings,
  messages,
  onlineCount: _onlineCount,
  isPeerTyping,
  peerTypingName,
  friendStatus,
  onSendMessage,
  onSendAudio,
  onSendImage,
  onSendTyping,
  onBurnMessage,
  onBurnEntireChat,
  onBackToCalculator,
  onBackToBca,
  onOpenSettings,
  onChangeWallpaper,
}) => {
  // Global stealth state from Zustand store
  const isDuressMode = useCalcVaultStore((s) => s.isDuressMode);
  const decoyMessages = useCalcVaultStore((s) => s.decoyMessages);
  const addDecoyMessage = useCalcVaultStore((s) => s.addDecoyMessage);
  const isScreenBlurred = useCalcVaultStore((s) => s.isScreenBlurred);
  const setScreenBlurred = useCalcVaultStore((s) => s.setScreenBlurred);
  const e2eeEnabled = useCalcVaultStore((s) => s.e2eeEnabled);
  const disappearingDuration = useCalcVaultStore((s) => s.disappearingDuration);
  const setDisappearingDuration = useCalcVaultStore((s) => s.setDisappearingDuration);
  const panicWiping = useCalcVaultStore((s) => s.panicWiping);
  const panicCountdown = useCalcVaultStore((s) => s.panicCountdown);
  const triggerPanicWipe = useCalcVaultStore((s) => s.triggerPanicWipe);
  const cancelPanicWipe = useCalcVaultStore((s) => s.cancelPanicWipe);
  const socketStatus = useCalcVaultStore((s) => s.socketStatus);
  const retryMessage = useCalcVaultStore((s) => s.retryMessage);

  const [inputText, setInputText] = useState('');
  const [decoyInputText, setDecoyInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [confirmBurnOpen, setConfirmBurnOpen] = useState(false);
  const [wallpaperMenuOpen, setWallpaperMenuOpen] = useState(false);
  const [disappearMenuOpen, setDisappearMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [chatFont, setChatFont] = useState<ChatFontType>(() => {
    try {
      const saved = localStorage.getItem('calcvault_chat_font');
      if (saved && (saved === 'make-a-note' || saved === 'indie' || saved === 'kalam' || saved === 'cursive')) {
        return saved as ChatFontType;
      }
    } catch {}
    return 'make-a-note';
  });

  const activeFontClass = useMemo(() => {
    switch (chatFont) {
      case 'make-a-note':
        return 'font-note-patrick';
      case 'indie':
        return 'font-note-indie';
      case 'kalam':
        return 'font-note-kalam';
      case 'cursive':
        return 'font-cursive';
      default:
        return 'font-note-patrick';
    }
  }, [chatFont]);

  const [toastText, setToastText] = useState<string | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Triple tap header tracking for secret panic wipe
  const headerTapRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: 0 });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 2500);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isPeerTyping, decoyMessages.length]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onSendTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      onSendTyping(false);
    }, 1500);
  };

  // Send text (Permanent or Disappearing based on timer)
  const handleSendText = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    onSendTyping(false);
    const ttl = disappearingDuration > 0 ? disappearingDuration : undefined;
    await onSendMessage(textToSend, ttl);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendText();
    }
  };

  // Decoy message send (fake study chat)
  const handleSendDecoy = () => {
    if (!decoyInputText.trim()) return;
    addDecoyMessage(decoyInputText);
    setDecoyInputText('');
  };

  // Triple-tap header detector for Panic Wipe
  const handleHeaderTap = () => {
    const now = Date.now();
    if (now - headerTapRef.current.lastTime < 500) {
      headerTapRef.current.count += 1;
    } else {
      headerTapRef.current.count = 1;
    }
    headerTapRef.current.lastTime = now;

    if (headerTapRef.current.count >= 3) {
      headerTapRef.current.count = 0;
      triggerHaptic([100, 50, 100]);
      triggerPanicWipe(() => {
        onBackToCalculator();
      });
    }
  };

  // Audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getAudioMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          const ttl = disappearingDuration > 0 ? disappearingDuration : undefined;
          onSendAudio(base64Data, recordingSeconds, ttl);
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);
      triggerHaptic(20);

      recordIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      showToast('Microphone access allow karein');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
      triggerHaptic(20);
    }
  };

  // Image Upload with compression
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('Image 15MB se chhoti honi chahiye');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const ttl = disappearingDuration > 0 ? disappearingDuration : undefined;
      onSendImage(base64, ttl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePanicBack = () => {
    if (settings.soundEnabled) playLockSound();
    if (settings.hapticsEnabled) triggerHaptic([50, 50]);
    onBackToCalculator();
  };

  const handleRetryFailed = async (msg: Message) => {
    const item = retryMessage(msg.id);
    if (item && item.text) {
      await onSendMessage(item.text, item.vanishesAfter);
    }
  };

  const currentWallpaperUrl = getWallpaperUrl(settings.wallpaper);

  // High performance virtualization slice: limit active DOM nodes to last 60 unless requested
  const visibleMessages = useMemo(() => {
    if (showAllHistory || messages.length <= 60) {
      return messages;
    }
    return messages.slice(messages.length - 60);
  }, [messages, showAllHistory]);

  // -------------------------------------------------------------
  // DECOY MODE (Duress PIN Opened) — Looks like regular BCA Study Group
  // -------------------------------------------------------------
  if (isDuressMode) {
    return (
      <div className="relative flex flex-col h-full w-full max-w-md mx-auto bg-gradient-to-b from-[#0B0F1F] via-[#0E152B] to-[#121936] text-slate-100 overflow-hidden shadow-2xl font-sans">
        {/* Subtle Decoy Header */}
        <header className="relative flex items-center justify-between border-b border-indigo-900/50 bg-[#0B0F20]/90 backdrop-blur-md px-3 pt-3 pb-2.5 z-20 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePanicBack}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700/80 transition-all active:scale-95"
              title="Lock and return to Calculator"
            >
              <Lock size={12} className="text-purple-400" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.3)]">
                <Users size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  <span>BCA Sem-3 Lab Study Group</span>
                  <span className="text-[10px] text-amber-300">✨</span>
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>4 members online</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-[10px] text-indigo-300 font-mono">
              Academic
            </span>
          </div>
        </header>

        {/* Fake Decoy Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-[#090D1C] via-[#0E152E] to-[#0A0E21]">
          <div className="text-center my-2">
            <span className="text-[10px] text-indigo-300/80 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/40 font-mono">
              Today • BCA Semester 3 Project Submissions
            </span>
          </div>

          {decoyMessages.map((d) => (
            <div
              key={d.id}
              className={`flex flex-col ${d.isSelf ? 'items-end' : 'items-start'}`}
            >
              {!d.isSelf && (
                <span className="text-[11px] text-indigo-300 font-medium ml-1 mb-0.5 font-cursive">
                  {d.senderName}
                </span>
              )}
              <div
                className={`rounded-3xl px-4 py-2.5 max-w-[85%] text-xs leading-relaxed shadow-sm font-make-a-note text-[16px] ${
                  d.isSelf
                    ? 'bg-indigo-950/60 text-indigo-100 rounded-br-xs border border-indigo-500/40 shadow-[0_2px_12px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-900/80 text-amber-50 border border-amber-400/25 rounded-bl-xs shadow-[0_2px_12px_rgba(251,191,36,0.1)]'
                }`}
              >
                <p className={`${activeFontClass} text-[15px] sm:text-[16px]`}>{d.text}</p>
                <span className="block text-[9px] text-slate-400 text-right mt-1 font-mono">
                  {d.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Decoy Input */}
        <div className="p-2.5 bg-[#0A0E20]/95 border-t border-indigo-900/40">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={decoyInputText}
              onChange={(e) => setDecoyInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendDecoy()}
              placeholder="Send message to study group..."
              className={`flex-1 px-4 py-2 rounded-full bg-slate-900/80 border border-indigo-900/70 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 ${activeFontClass} text-[15px]`}
            />
            <button
              onClick={handleSendDecoy}
              disabled={!decoyInputText.trim()}
              className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white cursor-pointer transition-colors shadow-md shadow-indigo-600/30"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REAL STEALTH CHAT MODE (Cute, Cozy, Dreamy & Aesthetic)
  // NO PINK COLOR · NO HEARTS · STARS & MOONS · HANDWRITING FONTS
  // -------------------------------------------------------------
  return (
    <div className="relative flex flex-col h-full w-full max-w-md mx-auto bg-[#070A18] text-purple-50 overflow-hidden shadow-2xl select-none font-sans">
      {/* 🌌 Phase 1: Background Midnight Blue & Purple Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40 pointer-events-none"
        style={{ backgroundImage: `url(${currentWallpaperUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070A18]/92 via-[#0D122B]/85 to-[#120E28]/95 pointer-events-none" />

      {/* ✨ Ambient Starry Glows & Twinkling Sparkles (CSS only, 60 FPS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Celestial Glow Orbs */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-16 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 left-1/4 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Scattered Twinkling Stars */}
        <span className="absolute top-12 left-8 text-[11px] text-amber-200/60 animate-star-twinkle">✨</span>
        <span className="absolute top-28 right-10 text-[13px] text-purple-300/70 animate-star-twinkle-delay">⭐</span>
        <span className="absolute top-48 left-14 text-[9px] text-indigo-200/50 animate-star-twinkle">✨</span>
        <span className="absolute top-72 right-6 text-[10px] text-amber-300/60 animate-star-twinkle-delay">✨</span>
        <span className="absolute bottom-36 left-8 text-[12px] text-purple-200/60 animate-star-twinkle">⭐</span>
        <span className="absolute bottom-24 right-14 text-[9px] text-amber-200/50 animate-star-twinkle-delay">✨</span>

        {/* 🌙 Floating 3D Glassy Elements (No hearts, gentle CSS float) */}
        <div className="absolute top-20 right-4 p-2 rounded-2xl bg-purple-950/20 border border-purple-400/20 backdrop-blur-xs text-amber-200/70 animate-float-slow shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center justify-center">
          <Moon size={15} className="text-amber-300/80" />
        </div>
        <div className="absolute bottom-40 left-3 p-1.5 rounded-xl bg-indigo-950/20 border border-indigo-400/20 backdrop-blur-xs text-purple-300/70 animate-float-reverse shadow-[0_0_12px_rgba(99,102,241,0.15)] flex items-center justify-center">
          <Star size={13} className="text-purple-300/80" />
        </div>
      </div>

      {/* Screen Blur Privacy Shield (Anti-Shoulder Surfing) */}
      {isScreenBlurred && (
        <div className="absolute inset-0 z-50 bg-[#070A18]/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-purple-300 mb-4 shadow-[0_0_25px_rgba(168,85,247,0.35)] animate-dream-pulse">
            <EyeOff size={30} />
          </div>
          <h3 className="text-lg font-bold text-purple-100 mb-1 font-cursive text-2xl">
            Privacy Shield Active ✨
          </h3>
          <p className="text-xs text-purple-300/70 max-w-xs mb-5 leading-relaxed font-handwriting text-sm">
            Window lost focus. Secret messages are tucked away safely under the starry night sky.
          </p>
          <button
            onClick={() => setScreenBlurred(false)}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wider shadow-lg shadow-purple-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            <span>Tap to Resume View</span>
          </button>
        </div>
      )}

      {/* Emergency Panic Wipe Countdown Overlay */}
      {panicWiping && (
        <div className="absolute inset-0 z-50 bg-[#160820]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-purple-900/40 border-2 border-purple-400 flex items-center justify-center text-purple-200 mb-3 animate-pulse">
            <Flame size={32} />
          </div>
          <h3 className="text-xl font-bold text-purple-100 tracking-wider uppercase mb-1 font-cursive">
            Emergency Wipe In Progress
          </h3>
          <p className="text-xs text-purple-300/80 mb-4 max-w-xs leading-relaxed font-handwriting">
            Cleaning all encrypted conversations and credentials in:
          </p>
          <div className="text-5xl font-mono font-black text-amber-300 mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            0{panicCountdown}s
          </div>
          <button
            onClick={cancelPanicWipe}
            className="px-6 py-2 rounded-full bg-purple-100 text-purple-950 font-bold text-xs uppercase tracking-wider hover:bg-white cursor-pointer shadow-xl transition-all active:scale-95"
          >
            Cancel Wipe
          </button>
        </div>
      )}

      {/* 🌸 Phase 3: Header with Cursive Profile Name & Soft Glassmorphism */}
      <header
        onClick={handleHeaderTap}
        className="relative flex items-center justify-between border-b border-purple-500/20 bg-[#080C1F]/80 backdrop-blur-md px-3 pt-3 pb-2.5 z-20 cursor-default shadow-sm"
      >
        <div className="flex items-center gap-1.5">
          {/* Instant Lock to Calculator (Sleek Midnight Pill) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePanicBack();
            }}
            className="flex items-center gap-1 py-1.5 px-3 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-purple-500/40 text-purple-200 text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer shadow-sm shadow-purple-950/50"
            title="Instant Lock: Return to Calculator"
          >
            <Lock size={12} className="text-purple-300" />
            <span>Lock</span>
          </button>

          {/* Quick return to BCA Verse */}
          {onBackToBca && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBackToBca();
              }}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-full bg-indigo-950/70 hover:bg-indigo-900/90 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              title="Return to BCA Verse Hub"
            >
              <GraduationCap size={12} className="text-indigo-300" />
              <span>BCA</span>
            </button>
          )}
        </div>

        {/* Title, Presence & Encryption Badge (Cursive & Cozy) */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-cursive text-xl font-bold text-purple-100 tracking-wide drop-shadow-[0_0_8px_rgba(192,132,252,0.4)] flex items-center gap-1">
              <span>{friendStatus?.name ? friendStatus.name : 'Secret Star Vault'}</span>
              <span className="text-amber-300 text-xs">✨</span>
            </span>
            {e2eeEnabled && (
              <span
                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-400/40 text-[9px] font-mono text-purple-300"
                title="End-to-End Encrypted: AES-GCM 256-bit with PBKDF2"
              >
                <ShieldCheck size={10} className="text-purple-300" />
                <span>E2EE</span>
              </span>
            )}
          </div>

          {/* Presence Status */}
          <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
            {isPeerTyping ? (
              <div className={`flex items-center gap-1.5 text-purple-300 font-medium animate-pulse ${activeFontClass} text-xs`}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span>{peerTypingName || 'Friend'} is writing a note... ✨</span>
              </div>
            ) : friendStatus?.inChat ? (
              <div className="flex items-center gap-1.5 text-purple-200 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]"></span>
                </span>
                <span className="font-semibold text-purple-200">Cozy in Chat</span>
              </div>
            ) : friendStatus?.isOnline ? (
              <div className="flex items-center gap-1 text-amber-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                <span className="text-amber-200">Away (Calculator)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-purple-300/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/40" />
                <span>Offline</span>
                {friendStatus?.lastSeen && friendStatus.lastSeen > 0 ? (
                  <span className="text-[9px] text-purple-300/50 font-mono">
                    · {formatLastSeen(friendStatus.lastSeen)}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Disappearing Messages Timer */}
          <div className="relative">
            <button
              onClick={() => setDisappearMenuOpen(!disappearMenuOpen)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-0.5 ${
                disappearingDuration > 0
                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/50'
                  : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-500/15'
              }`}
              title="Disappearing Messages Timer"
            >
              <Timer size={16} />
              {disappearingDuration > 0 && (
                <span className="text-[9px] font-mono font-bold pr-0.5 text-amber-200">
                  {disappearingDuration === 60
                    ? '1m'
                    : disappearingDuration === 3600
                    ? '1h'
                    : '24h'}
                </span>
              )}
            </button>

            {disappearMenuOpen && (
              <div className="absolute right-0 top-10 w-44 bg-[#0F142D]/95 border border-purple-500/30 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md">
                <p className="text-[10px] text-purple-300 px-2 py-1 font-semibold uppercase tracking-wider font-cursive text-xs">
                  Vanishing Starlight Timer ✨
                </p>
                <div className="space-y-1">
                  {[
                    { label: 'Off (Keep Forever)', val: 0 },
                    { label: '1 Minute ⏳', val: 60 },
                    { label: '1 Hour 🌙', val: 3600 },
                    { label: '24 Hours ✨', val: 86400 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setDisappearingDuration(opt.val);
                        setDisappearMenuOpen(false);
                        showToast(
                          opt.val === 0
                            ? 'Disappearing timer off'
                            : `Messages will vanish softly in ${opt.label}`
                        );
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        disappearingDuration === opt.val
                          ? 'bg-purple-600 text-white font-bold'
                          : 'text-purple-200 hover:bg-purple-950/60'
                      }`}
                    >
                      <span className="font-handwriting text-sm">{opt.label}</span>
                      {disappearingDuration === opt.val && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wallpaper Switcher */}
          <div className="relative">
            <button
              onClick={() => setWallpaperMenuOpen(!wallpaperMenuOpen)}
              className="p-1.5 text-purple-300/80 hover:text-purple-100 rounded-full hover:bg-purple-500/15 transition-colors cursor-pointer"
              title="Change Dreamy Wallpaper"
            >
              <ImageIcon size={16} />
            </button>

            {wallpaperMenuOpen && (
              <div className="absolute right-0 top-10 w-52 bg-[#0F142E]/95 border border-purple-500/30 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md">
                <p className="text-[10px] text-purple-300 px-2 py-1 font-semibold uppercase tracking-wider font-cursive text-xs">
                  Dreamy Night Themes ✨
                </p>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {WALLPAPERS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        onChangeWallpaper(w.id);
                        setWallpaperMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        settings.wallpaper === w.id
                          ? 'bg-purple-600 text-white font-bold shadow-md'
                          : 'text-purple-200 hover:bg-purple-950/60'
                      }`}
                    >
                      <span className="truncate">{w.title}</span>
                      {settings.wallpaper === w.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Note Handwriting Font Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setFontMenuOpen(!fontMenuOpen);
                setWallpaperMenuOpen(false);
                setDisappearMenuOpen(false);
              }}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                fontMenuOpen
                  ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                  : 'text-purple-300/80 hover:text-purple-100 hover:bg-purple-500/15'
              }`}
              title="Change Note Font (Make a Note)"
            >
              <Type size={16} />
            </button>

            {fontMenuOpen && (
              <div className="absolute right-0 top-10 w-56 bg-[#0F142E]/95 border border-purple-500/30 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md">
                <div className="px-2 py-1 border-b border-purple-500/20 mb-1">
                  <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                    Note Font Style ✍️
                  </p>
                  <p className="text-[9px] text-purple-300/60 font-note-patrick">
                    Handwriting note aesthetics
                  </p>
                </div>
                <div className="space-y-1">
                  {CHAT_FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setChatFont(f.id);
                        try {
                          localStorage.setItem('calcvault_chat_font', f.id);
                        } catch {}
                        setFontMenuOpen(false);
                        setToastText(`Font: ${f.label.split(' ')[0]}`);
                        setTimeout(() => setToastText(null), 2000);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                        chatFont === f.id
                          ? 'bg-purple-600 text-white font-bold shadow-md'
                          : 'text-purple-200 hover:bg-purple-950/60'
                      }`}
                    >
                      <div className="truncate">
                        <div className={`text-xs ${f.className}`}>{f.label}</div>
                        <div className={`text-[10px] opacity-75 ${f.className}`}>{f.sample}</div>
                      </div>
                      {chatFont === f.id && <Check size={12} className="shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Messages */}
          <button
            onClick={() => setConfirmBurnOpen(true)}
            className="p-1.5 text-purple-400/70 hover:text-amber-300 rounded-full hover:bg-purple-500/15 transition-colors cursor-pointer"
            title="Clear all messages"
          >
            <Trash2 size={16} />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-purple-300/80 hover:text-purple-100 rounded-full hover:bg-purple-500/15 transition-colors cursor-pointer"
            title="Settings"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </header>

      {/* Network & Security Sub-Bar */}
      <div className="relative z-10 px-3.5 py-1 bg-[#090D22]/75 backdrop-blur-md border-b border-purple-500/15 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          {socketStatus === 'connected' ? (
            <span className="flex items-center gap-1.5 text-purple-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
              <span>Starlight Relay Connected</span>
            </span>
          ) : socketStatus === 'connecting' ? (
            <span className="flex items-center gap-1.5 text-amber-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              <span>Connecting Sky Relay...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Offline (Saved locally)</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 font-mono text-purple-300/70 text-[10px]">
          <span>AES-256</span>
          <span>•</span>
          <span>Room #{settings.roomId || 'direct'}</span>
        </div>
      </div>

      {/* 💌 Phase 2: Messages Stream with Soft Glassmorphism & Handwriting Font */}
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3.5 z-10 overscroll-contain">
        {messages.length > 60 && !showAllHistory && (
          <div className="text-center py-1">
            <button
              onClick={() => setShowAllHistory(true)}
              className="text-[11px] text-purple-300 hover:text-white bg-purple-950/60 border border-purple-500/30 px-3.5 py-1 rounded-full cursor-pointer hover:bg-purple-900/60 transition-colors font-cursive"
            >
              Show {messages.length - 60} earlier memories ✨
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 text-purple-200">
            <div className="w-16 h-16 rounded-3xl bg-purple-950/40 border border-purple-400/40 backdrop-blur-md flex items-center justify-center text-amber-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] animate-float-slow">
              <Sparkles size={28} />
            </div>
            <h4 className="text-2xl font-bold text-purple-100 mb-1 font-cursive">
              Cozy Night Vault ✨
            </h4>
            <p className="text-sm text-purple-200/80 max-w-xs leading-relaxed mb-3 font-handwriting">
              A private, encrypted starry space just for friends. Hand-written aesthetic notes, encrypted safely under the midnight sky.
            </p>
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[11px] text-purple-200 font-cursive text-sm">
              <Check size={12} className="text-amber-300" />
              <span>AES-GCM 256 • Zero-Knowledge • Friends Only</span>
            </div>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            const isSelf = msg.senderId === peerId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col group animate-star-burst ${isSelf ? 'items-end' : 'items-start'}`}
              >
                {!isSelf && (
                  <div className="flex items-center gap-1.5 ml-1 mb-1">
                    <span className="text-[13px] text-amber-200 font-semibold drop-shadow-xs font-cursive tracking-wide">
                      {msg.senderName}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        friendStatus?.inChat
                          ? 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]'
                          : friendStatus?.isOnline
                          ? 'bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
                          : 'bg-purple-900/60'
                      }`}
                    />
                  </div>
                )}

                <div className="flex items-end gap-1.5 max-w-[88%]">
                  {/* Single Message Delete icon for self */}
                  {isSelf && (
                    <button
                      onClick={() => onBurnMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 active:opacity-100 p-1 text-purple-400/50 hover:text-amber-300 transition-opacity cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}

                  {/* 💬 Bubble with Glassmorphism:
                      Sender: Transparent Glass with soft Lavender/Purple glowing border
                      Receiver: Darker Deep Blue glass with subtle peach glow */}
                  <div
                    className={`rounded-3xl px-4 py-2.5 shadow-lg text-sm relative break-words backdrop-blur-md transition-all ${
                      isSelf
                        ? 'bg-purple-950/45 text-purple-50 rounded-br-xs border border-purple-400/40 shadow-[0_4px_22px_rgba(168,85,247,0.18)]'
                        : 'bg-slate-900/70 text-amber-50 rounded-bl-xs border border-amber-300/35 shadow-[0_4px_22px_rgba(251,191,36,0.12)]'
                    }`}
                  >
                    {/* Disappearing indicator on message */}
                    {msg.vanishesAfter && msg.vanishesAfter > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono mb-1">
                        <Timer size={10} />
                        <span>Vanishes in {msg.vanishesAfter >= 3600 ? `${Math.round(msg.vanishesAfter / 3600)}h` : `${Math.round(msg.vanishesAfter / 60)}m`}</span>
                      </div>
                    )}

                    {/* Text Message with Make a Note Handwriting Font */}
                    {msg.text && (
                      <p className={`whitespace-pre-wrap leading-relaxed select-text ${activeFontClass} text-[16px] sm:text-[18px] tracking-wide`}>
                        {msg.text}
                      </p>
                    )}

                    {/* Audio Voice Note */}
                    {msg.audioData && (
                      <AudioPlayer
                        audioSrc={msg.audioData}
                        audioDuration={msg.audioDuration}
                        isSelf={isSelf}
                      />
                    )}

                    {/* Image Attachment */}
                    {msg.imageData && (
                      <div className="rounded-2xl overflow-hidden my-1 max-w-[260px] border border-purple-400/30 shadow-md">
                        <img
                          src={msg.imageData}
                          alt="Sent attachment"
                          className="w-full h-auto object-cover max-h-[300px]"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Message Timestamp & Seen Status */}
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span
                        className={`text-[10px] font-mono ${
                          isSelf ? 'text-purple-300/70' : 'text-amber-200/60'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      {/* Optimistic Status Icons */}
                      {isSelf && (
                        <div className="flex items-center">
                          {msg.status === 'pending' ? (
                            <span title="Sending...">
                              <Clock
                                size={11}
                                className="text-purple-300 animate-spin"
                              />
                            </span>
                          ) : msg.status === 'failed' ? (
                            <button
                              onClick={() => handleRetryFailed(msg)}
                              className="flex items-center gap-0.5 text-amber-300 font-semibold text-[10px] hover:underline cursor-pointer"
                              title="Message failed to send. Click to retry."
                            >
                              <AlertCircle size={11} className="text-amber-400" />
                              <span>Retry</span>
                            </button>
                          ) : (
                            <span title="Delivered & Encrypted">
                              <CheckCheck
                                size={13}
                                className="text-purple-300 drop-shadow-[0_0_4px_rgba(192,132,252,0.8)]"
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 🌸 Phase 3: Quick Cute Emojis Bar (NO HEARTS, Stars, Moons & Coffee) */}
      <div className="relative px-3 py-1.5 bg-[#080C1F]/70 backdrop-blur-md flex items-center justify-around border-t border-purple-500/15 z-20 overflow-x-auto no-scrollbar">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              const ttl = disappearingDuration > 0 ? disappearingDuration : undefined;
              onSendMessage(emoji, ttl);
            }}
            className="p-1 text-lg hover:scale-130 transition-transform active:scale-95 cursor-pointer filter hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* 🌸 Phase 4: Bottom Input Bar (Glass Pill Shape with Soft Glow) */}
      <div className="relative p-2.5 bg-[#080C1F]/85 backdrop-blur-md border-t border-purple-500/20 z-20">
        <div className="flex items-center gap-1.5">
          {/* Photo attach button (Glowing Lavender) */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-purple-300/80 hover:text-purple-100 hover:bg-purple-500/20 hover:shadow-[0_0_12px_rgba(192,132,252,0.5)] transition-all cursor-pointer shrink-0"
            title="Send Photo"
          >
            <ImageIcon size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Voice Note Button (Glowing Lavender / Animated Pulse) */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full transition-all cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-purple-600 text-white animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.8)]'
                : 'text-purple-300/80 hover:text-purple-100 hover:bg-purple-500/20 hover:shadow-[0_0_12px_rgba(192,132,252,0.5)]'
            }`}
            title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
          >
            {isRecording ? <Square size={18} /> : <Mic size={18} />}
          </button>

          {/* Input Field / Recording Status with Smooth Glass Pill */}
          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-3.5 py-2 rounded-full bg-purple-950/60 border border-purple-400/50 text-xs text-purple-200">
              <span className={`flex items-center gap-1.5 ${activeFontClass} text-sm`}>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Recording voice note... ✨</span>
              </span>
              <span className="font-mono font-bold text-amber-300">{recordingSeconds}s</span>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={
                disappearingDuration > 0
                  ? `Write a starry note (vanishes in ${disappearingDuration >= 3600 ? `${disappearingDuration / 3600}h` : `${disappearingDuration / 60}m`})...`
                  : 'Write a note... ✨'
              }
              className={`flex-1 px-4 py-2 rounded-full bg-slate-900/65 border border-purple-500/30 text-[16px] text-purple-100 placeholder-purple-300/40 ${activeFontClass} focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all`}
            />
          )}

          {/* Send Button: Radiant Star & Sparkles Button */}
          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-full transition-all shrink-0 flex items-center justify-center ${
              inputText.trim()
                ? 'bg-gradient-to-r from-purple-500 via-indigo-600 to-amber-400 text-white shadow-[0_0_16px_rgba(168,85,247,0.6)] active:scale-95 cursor-pointer hover:brightness-110'
                : 'bg-purple-950/50 border border-purple-500/20 text-purple-400/40 cursor-not-allowed'
            }`}
            title="Send"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastText && (
        <div className={`fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#0F142E]/95 border border-purple-400/60 text-purple-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-1.5 ${activeFontClass} text-sm`}>
          <Sparkles size={13} className="text-amber-300" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Clear All Messages Confirmation Modal */}
      {confirmBurnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xs rounded-3xl bg-[#0F142E] border border-purple-500/40 p-5 shadow-2xl text-purple-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow-lg">
              <Trash2 size={22} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1 font-cursive">Clear All Notes?</h3>
            <p className="text-xs text-purple-200/80 mb-4 leading-relaxed font-handwriting text-sm">
              Kya aap sach me saare messages delete karna chahte hain? Yeh messages permanently vanish ho jayenge.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmBurnOpen(false)}
                className="flex-1 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-xs font-semibold text-purple-200 transition-colors cursor-pointer border border-purple-500/30"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmBurnOpen(false);
                  onBurnEntireChat();
                  showToast('Saare messages clear ho gaye ✨');
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-purple-600/30"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
