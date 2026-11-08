import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Message, UserSettings, NatureWallpaper } from '../types';
import { AudioPlayer } from './AudioPlayer';
import {
  Lock,
  Clock,
  Image,
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
  FileText,
  Users,
} from 'lucide-react';
import { playLockSound, triggerHaptic } from '../utils/sound';
import { WALLPAPERS, getWallpaperUrl } from '../utils/wallpapers';
import { useCalcVaultStore } from '../store/useCalcVaultStore';

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

const QUICK_EMOJIS = ['❤️', '😂', '🤫', '🔥', '👍', '🙈', '👀', '💯'];

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
  onlineCount,
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
      <div className="relative flex flex-col h-full w-full max-w-md mx-auto bg-slate-950 text-slate-100 overflow-hidden shadow-2xl font-sans">
        {/* Subtle Decoy Banner for stealth */}
        <header className="relative flex items-center justify-between border-b border-slate-800 bg-slate-900/95 px-3 pt-3 pb-2.5 z-20 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePanicBack}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700"
              title="Lock and return to Calculator"
            >
              <Lock size={12} className="text-slate-400" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Users size={14} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">BCA Sem-3 Lab Study Group</h4>
                <p className="text-[10px] text-emerald-400 font-medium">4 members online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
              Academic
            </span>
          </div>
        </header>

        {/* Fake Decoy Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="text-center my-2">
            <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 font-mono">
              Today • BCA Semester 3 Project Submissions
            </span>
          </div>

          {decoyMessages.map((d) => (
            <div
              key={d.id}
              className={`flex flex-col ${d.isSelf ? 'items-end' : 'items-start'}`}
            >
              {!d.isSelf && (
                <span className="text-[11px] text-slate-400 font-medium ml-1 mb-0.5">
                  {d.senderName}
                </span>
              )}
              <div
                className={`rounded-2xl px-3.5 py-2 max-w-[85%] text-xs leading-relaxed shadow-sm ${
                  d.isSelf
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-xs'
                }`}
              >
                <p>{d.text}</p>
                <span className="block text-[9px] text-slate-300/70 text-right mt-1 font-mono">
                  {d.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Decoy Input */}
        <div className="p-2.5 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={decoyInputText}
              onChange={(e) => setDecoyInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendDecoy()}
              placeholder="Send message to study group..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendDecoy}
              disabled={!decoyInputText.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white cursor-pointer transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // REAL STEALTH CHAT MODE (Full Spy-Grade Features)
  // -------------------------------------------------------------
  return (
    <div className="relative flex flex-col h-full w-full max-w-md mx-auto bg-black text-white overflow-hidden shadow-2xl font-sans select-none">
      {/* Background Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-60 pointer-events-none"
        style={{ backgroundImage: `url(${currentWallpaperUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />

      {/* Screen Blur Privacy Shield (Anti-Shoulder Surfing) */}
      {isScreenBlurred && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900/90 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-2xl shadow-emerald-950">
            <EyeOff size={30} />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Privacy Shield Active</h3>
          <p className="text-xs text-zinc-400 max-w-xs mb-5 leading-relaxed">
            Window lost focus. Confidential messages are hidden from bystanders.
          </p>
          <button
            onClick={() => setScreenBlurred(false)}
            className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
          >
            Tap to Resume View
          </button>
        </div>
      )}

      {/* Emergency Panic Wipe Countdown Overlay */}
      {panicWiping && (
        <div className="absolute inset-0 z-50 bg-red-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-400 mb-3 animate-pulse">
            <Flame size={32} />
          </div>
          <h3 className="text-lg font-black text-white tracking-wider uppercase mb-1">
            Emergency Wipe
          </h3>
          <p className="text-xs text-red-200 mb-4 max-w-xs leading-relaxed">
            Destroying all encrypted chat history & local keys in:
          </p>
          <div className="text-5xl font-mono font-black text-red-400 mb-6 drop-shadow-lg">
            0{panicCountdown}s
          </div>
          <button
            onClick={cancelPanicWipe}
            className="px-6 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 cursor-pointer shadow-xl transition-all active:scale-95"
          >
            Cancel Wipe
          </button>
        </div>
      )}

      {/* Header */}
      <header
        onClick={handleHeaderTap}
        className="relative flex items-center justify-between border-b border-white/10 bg-black/80 backdrop-blur-md px-3 pt-3 pb-2.5 z-20 cursor-default"
      >
        <div className="flex items-center gap-1.5">
          {/* Instant Lock to Calculator */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePanicBack();
            }}
            className="flex items-center gap-1 py-1.5 px-2.5 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer shadow-md"
            title="Instant Lock: Return to Calculator"
          >
            <Lock size={12} className="text-red-400" />
            <span>Lock</span>
          </button>

          {/* Quick return to BCA Verse */}
          {onBackToBca && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBackToBca();
              }}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              title="Return to BCA Verse Hub"
            >
              <GraduationCap size={12} className="text-indigo-400" />
              <span>BCA</span>
            </button>
          )}
        </div>

        {/* Title, Presence & Encryption Badge */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide">
              {friendStatus?.name ? friendStatus.name : 'Stealth Direct'}
            </span>
            {e2eeEnabled && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-600/70 text-[9px] font-mono text-emerald-300"
                title="End-to-End Encrypted: AES-GCM 256-bit with PBKDF2"
              >
                <ShieldCheck size={10} className="text-emerald-400" />
                <span>E2EE</span>
              </span>
            )}
          </div>

          {/* Presence Status */}
          <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
            {isPeerTyping ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{peerTypingName || 'Friend'} typing...</span>
              </div>
            ) : friendStatus?.inChat ? (
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                </span>
                <span className="font-semibold text-emerald-400">In Chat</span>
              </div>
            ) : friendStatus?.isOnline ? (
              <div className="flex items-center gap-1 text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                <span className="text-amber-400">Away (Calc)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-zinc-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-zinc-600" />
                <span className="text-zinc-400">Offline</span>
                {friendStatus?.lastSeen && friendStatus.lastSeen > 0 ? (
                  <span className="text-[9px] text-zinc-500 font-mono">
                    · {formatLastSeen(friendStatus.lastSeen)}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Disappearing Messages Selector */}
          <div className="relative">
            <button
              onClick={() => setDisappearMenuOpen(!disappearMenuOpen)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-0.5 ${
                disappearingDuration > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
              title="Disappearing Messages Timer"
            >
              <Timer size={16} />
              {disappearingDuration > 0 && (
                <span className="text-[9px] font-mono font-bold pr-0.5">
                  {disappearingDuration === 60
                    ? '1m'
                    : disappearingDuration === 3600
                    ? '1h'
                    : '24h'}
                </span>
              )}
            </button>

            {disappearMenuOpen && (
              <div className="absolute right-0 top-10 w-44 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md">
                <p className="text-[10px] text-zinc-400 px-2 py-1 font-semibold uppercase tracking-wider">
                  Auto-Disappear Timer
                </p>
                <div className="space-y-1">
                  {[
                    { label: 'Off (Keep)', val: 0 },
                    { label: '1 Minute', val: 60 },
                    { label: '1 Hour', val: 3600 },
                    { label: '24 Hours', val: 86400 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => {
                        setDisappearingDuration(opt.val);
                        setDisappearMenuOpen(false);
                        showToast(
                          opt.val === 0
                            ? 'Disappearing messages turned off'
                            : `New messages will vanish after ${opt.label}`
                        );
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        disappearingDuration === opt.val
                          ? 'bg-amber-500 text-black font-bold'
                          : 'text-zinc-200 hover:bg-zinc-800'
                      }`}
                    >
                      <span>{opt.label}</span>
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
              className="p-1.5 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Change Nature Wallpaper"
            >
              <Image size={16} />
            </button>

            {wallpaperMenuOpen && (
              <div className="absolute right-0 top-10 w-44 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md">
                <p className="text-[10px] text-zinc-400 px-2 py-1 font-semibold uppercase tracking-wider">
                  Nature Wallpapers
                </p>
                <div className="space-y-1">
                  {WALLPAPERS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        onChangeWallpaper(w.id);
                        setWallpaperMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        settings.wallpaper === w.id
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'text-zinc-200 hover:bg-zinc-800'
                      }`}
                    >
                      <span>{w.title}</span>
                      {settings.wallpaper === w.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Messages */}
          <button
            onClick={() => setConfirmBurnOpen(true)}
            className="p-1.5 text-zinc-400 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Clear all messages"
          >
            <Trash2 size={16} />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Settings"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </header>

      {/* Network & Security Sub-Bar */}
      <div className="relative z-10 px-3.5 py-1 bg-black/60 backdrop-blur-md border-b border-white/5 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          {socketStatus === 'connected' ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>P2P Relay Connected</span>
            </span>
          ) : socketStatus === 'connecting' ? (
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Connecting P2P Relay...</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>Offline (Queueing locally)</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 font-mono text-zinc-400">
          <span>AES-GCM 256</span>
          <span>•</span>
          <span>Room #{settings.roomId || 'direct'}</span>
        </div>
      </div>

      {/* Messages Stream with Virtualization window */}
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3 z-10 overscroll-contain">
        {messages.length > 60 && !showAllHistory && (
          <div className="text-center py-1">
            <button
              onClick={() => setShowAllHistory(true)}
              className="text-[10px] text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-700/80 px-3 py-1 rounded-full cursor-pointer hover:bg-zinc-800 transition-colors font-mono"
            >
              Show {messages.length - 60} earlier messages
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 text-zinc-300">
            <div className="w-16 h-16 rounded-3xl bg-black/40 border border-emerald-500/30 backdrop-blur-md flex items-center justify-center text-emerald-400 mb-3 shadow-xl">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Zero-Knowledge Vault Chat
            </h4>
            <p className="text-xs text-zinc-300/80 max-w-xs leading-relaxed mb-3">
              Web Crypto AES-GCM 256-bit encrypted before leaving device. No plain text stored on server.
            </p>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300 font-mono">
              <Check size={12} />
              <span>Encrypted • Optimistic Send • Auto-Queue</span>
            </div>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            const isSelf = msg.senderId === peerId;

            return (
              <div
                key={msg.id}
                className={`flex flex-col group ${isSelf ? 'items-end' : 'items-start'}`}
              >
                {!isSelf && (
                  <div className="flex items-center gap-1.5 ml-1 mb-1">
                    <span className="text-[11px] text-zinc-300 font-semibold drop-shadow-sm">
                      {msg.senderName}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        friendStatus?.inChat
                          ? 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]'
                          : friendStatus?.isOnline
                          ? 'bg-amber-400'
                          : 'bg-zinc-600'
                      }`}
                    />
                  </div>
                )}

                <div className="flex items-end gap-1.5 max-w-[88%]">
                  {/* Single Message Delete icon for self */}
                  {isSelf && (
                    <button
                      onClick={() => onBurnMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 active:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition-opacity cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 shadow-lg text-sm relative break-words backdrop-blur-sm ${
                      isSelf
                        ? 'bg-emerald-600/90 text-white rounded-br-xs border border-emerald-500/30'
                        : 'bg-zinc-900/90 text-zinc-100 rounded-bl-xs border border-white/10'
                    }`}
                  >
                    {/* Disappearing indicator on message */}
                    {msg.vanishesAfter && msg.vanishesAfter > 0 && (
                      <div className="flex items-center gap-1 text-[9px] text-amber-300 font-mono mb-1">
                        <Timer size={10} />
                        <span>Vanishes in {msg.vanishesAfter >= 3600 ? `${Math.round(msg.vanishesAfter / 3600)}h` : `${Math.round(msg.vanishesAfter / 60)}m`}</span>
                      </div>
                    )}

                    {/* Text Message */}
                    {msg.text && (
                      <p className="whitespace-pre-wrap leading-relaxed select-text font-normal text-sm">
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
                      <div className="rounded-xl overflow-hidden my-1 max-w-[260px] border border-white/10">
                        <img
                          src={msg.imageData}
                          alt="Sent attachment"
                          className="w-full h-auto object-cover max-h-[300px]"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Message Timestamp & Optimistic Status */}
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span
                        className={`text-[9px] font-mono ${
                          isSelf ? 'text-emerald-200/70' : 'text-zinc-400'
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
                                className="text-zinc-300 animate-spin"
                              />
                            </span>
                          ) : msg.status === 'failed' ? (
                            <button
                              onClick={() => handleRetryFailed(msg)}
                              className="flex items-center gap-0.5 text-red-300 font-semibold text-[9px] hover:underline cursor-pointer"
                              title="Message failed to send. Click to retry."
                            >
                              <AlertCircle size={11} className="text-red-400" />
                              <span>Retry</span>
                            </button>
                          ) : (
                            <span title="Delivered & Encrypted">
                              <CheckCheck
                                size={13}
                                className="text-emerald-300"
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

      {/* Quick Emojis Bar */}
      <div className="relative px-3 py-1 bg-black/50 backdrop-blur-md flex items-center justify-between border-t border-white/5 z-20 overflow-x-auto no-scrollbar">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              const ttl = disappearingDuration > 0 ? disappearingDuration : undefined;
              onSendMessage(emoji, ttl);
            }}
            className="p-1 text-base hover:scale-125 transition-transform active:scale-95 cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="relative p-2.5 bg-black/85 backdrop-blur-md border-t border-white/10 z-20">
        <div className="flex items-center gap-1.5">
          {/* Photo attach button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Send Photo (Auto Compressed)"
          >
            <Image size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Voice Note Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-full transition-all cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
            title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
          >
            {isRecording ? <Square size={18} /> : <Mic size={18} />}
          </button>

          {/* Input Field / Recording Status */}
          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-2xl bg-red-950/60 border border-red-700/60 text-xs text-red-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>Recording encrypted audio...</span>
              </span>
              <span className="font-mono font-bold">{recordingSeconds}s</span>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={
                disappearingDuration > 0
                  ? `Secret message (expires in ${disappearingDuration >= 3600 ? `${disappearingDuration / 3600}h` : `${disappearingDuration / 60}m`})...`
                  : 'Encrypted secret message...'
              }
              className="flex-1 px-3.5 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 transition-colors"
            />
          )}

          {/* Send Button */}
          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-full transition-all shrink-0 ${
              inputText.trim()
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 active:scale-95 cursor-pointer'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
            title="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastText && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900/95 border border-amber-500/50 text-amber-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-1.5">
          <AlertCircle size={13} className="text-amber-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Clear All Messages Confirmation Modal */}
      {confirmBurnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xs rounded-3xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-red-400 mx-auto mb-3 shadow-lg">
              <Trash2 size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Clear All Messages?</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Kya aap sach me saare messages delete karna chahte hain? Yeh messages permanently remove ho jayenge.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmBurnOpen(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmBurnOpen(false);
                  onBurnEntireChat();
                  showToast('Saare messages delete kar diye gaye');
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-red-600/30"
              >
                Clear Messages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
