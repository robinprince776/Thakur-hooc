import React, { useState, useRef, useEffect } from 'react';
import { Message, UserSettings, NatureWallpaper } from '../types';
import { AudioPlayer } from './AudioPlayer';
import {
  Lock,
  Flame,
  Clock,
  Image,
  Send,
  Mic,
  Square,
  Smile,
  Settings as SettingsIcon,
  Trash2,
  Check,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { playLockSound, triggerHaptic } from '../utils/sound';
import { WALLPAPERS, getWallpaperUrl } from '../utils/wallpapers';

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

const VANISH_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
];

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
  onOpenInstall,
  onChangeWallpaper,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [confirmBurnOpen, setConfirmBurnOpen] = useState(false);
  const [wallpaperMenuOpen, setWallpaperMenuOpen] = useState(false);
  const [vanishMenuOpen, setVanishMenuOpen] = useState(false);
  const [vanishSeconds, setVanishSeconds] = useState<number>(settings.vanishDuration || 0);
  const [toastText, setToastText] = useState<string | null>(null);

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
  }, [messages, isPeerTyping]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onSendTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      onSendTyping(false);
    }, 1500);
  };

  // Send text
  const handleSendText = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    onSendTyping(false);
    await onSendMessage(textToSend, vanishSeconds > 0 ? vanishSeconds : undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendText();
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
          onSendAudio(base64Data, recordingSeconds, vanishSeconds > 0 ? vanishSeconds : undefined);
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

  // Image Upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image 8MB se chhoti honi chahiye');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onSendImage(base64, vanishSeconds > 0 ? vanishSeconds : undefined);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePanicBack = () => {
    if (settings.soundEnabled) playLockSound();
    if (settings.hapticsEnabled) triggerHaptic([50, 50]);
    onBackToCalculator();
  };

  const currentWallpaperUrl = getWallpaperUrl(settings.wallpaper);

  return (
    <div className="relative flex flex-col h-full w-full max-w-md mx-auto bg-black text-white overflow-hidden shadow-2xl font-sans">
      {/* Background Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-60 pointer-events-none"
        style={{ backgroundImage: `url(${currentWallpaperUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />

      {/* Header */}
      <header className="relative flex items-center justify-between border-b border-white/10 bg-black/75 backdrop-blur-md px-3 pt-3 pb-2.5 z-20">
        <div className="flex items-center gap-1.5">
          {/* Back to Calculator Panic Button */}
          <button
            onClick={handlePanicBack}
            className="flex items-center gap-1 py-1.5 px-2.5 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer shadow-md"
            title="Instant Lock: Calculator par wapas jayein"
          >
            <Lock size={12} className="text-red-400" />
            <span>Lock</span>
          </button>

          {/* Quick return to BCA Verse */}
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="flex items-center gap-1 py-1.5 px-2.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              title="BCA Verse me wapas jayein"
            >
              <GraduationCap size={12} className="text-indigo-400" />
              <span>BCA</span>
            </button>
          )}
        </div>

        {/* Title & Presence */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white tracking-wide">
              {friendStatus?.name ? friendStatus.name : 'Direct Stealth Chat'}
            </span>
            {settings.roomId && settings.roomId !== 'direct' && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-amber-400">
                #{settings.roomId}
              </span>
            )}
          </div>

          {/* Real-time online/offline presence indicator */}
          <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
            {isPeerTyping ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>typing...</span>
              </div>
            ) : friendStatus?.inChat ? (
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium" title="Friend is active in this chat room right now">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                </span>
                <span className="font-semibold text-emerald-400">Online</span>
                <span className="text-[9px] text-emerald-300/90 bg-emerald-950/80 border border-emerald-700/80 px-1 rounded font-mono">
                  In Chat
                </span>
              </div>
            ) : friendStatus?.isOnline ? (
              <div className="flex items-center gap-1 text-amber-300 font-medium" title="Connected to app (on calculator screen)">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                <span className="text-amber-400 font-medium">Online</span>
                <span className="text-[9px] text-amber-300/80 bg-amber-950/70 border border-amber-800/80 px-1 rounded font-mono">
                  Away
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-zinc-400 font-medium" title="Friend is currently offline">
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
        <div className="flex items-center gap-1">
          {/* Disappearing Messages Timer Button */}
          <div className="relative">
            <button
              onClick={() => setVanishMenuOpen(!vanishMenuOpen)}
              className={`p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1 ${
                vanishSeconds > 0
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
              title="Disappearing Messages Timer"
            >
              <Clock size={16} />
              {vanishSeconds > 0 && (
                <span className="text-[10px] pr-0.5">
                  {VANISH_OPTIONS.find((v) => v.value === vanishSeconds)?.label}
                </span>
              )}
            </button>

            {vanishMenuOpen && (
              <div className="absolute right-0 top-10 w-44 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-md">
                <p className="text-[10px] text-zinc-400 px-2 py-1 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Flame size={12} className="text-amber-400" />
                  <span>Self-Destruct Timer</span>
                </p>
                <div className="space-y-1">
                  {VANISH_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setVanishSeconds(opt.value);
                        setVanishMenuOpen(false);
                        showToast(
                          opt.value > 0
                            ? `Messages ${opt.label} baad delete ho jayenge`
                            : 'Self-destruct timer off kar diya'
                        );
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        vanishSeconds === opt.value
                          ? 'bg-amber-500 text-black font-bold'
                          : 'text-zinc-200 hover:bg-zinc-800'
                      }`}
                    >
                      <span>{opt.label === 'Off' ? 'Off (Normal)' : opt.label}</span>
                      {vanishSeconds === opt.value && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nature Wallpaper Switcher */}
          <div className="relative">
            <button
              onClick={() => setWallpaperMenuOpen(!wallpaperMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Change Nature Wallpaper"
            >
              <Image size={17} />
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

          {/* Panic Burn Chat */}
          <button
            onClick={() => setConfirmBurnOpen(true)}
            className="p-2 text-amber-400 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Dono phones se chat clear karein"
          >
            <Flame size={17} />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Settings"
          >
            <SettingsIcon size={17} />
          </button>
        </div>
      </header>

      {/* Real-time Presence Bar */}
      <div className="relative z-10 px-3.5 py-1.5 bg-black/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          {friendStatus?.inChat ? (
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{friendStatus.name || 'Friend'} is active in chat room</span>
            </span>
          ) : friendStatus?.isOnline ? (
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{friendStatus.name || 'Friend'} is online (away on calculator)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span>{friendStatus?.name || 'Friend'} is offline</span>
              {friendStatus?.lastSeen && friendStatus.lastSeen > 0 ? (
                <span className="text-zinc-500 text-[10px]">
                  (last active {formatLastSeen(friendStatus.lastSeen)})
                </span>
              ) : null}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
          <span>Room: #{settings.roomId || 'direct'}</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="relative flex-1 overflow-y-auto px-4 py-4 space-y-3 z-10 overscroll-contain">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12 text-zinc-300">
            <div className="w-16 h-16 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-emerald-400 mb-3 shadow-xl">
              <Lock size={26} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Direct Private Chat
            </h4>
            <p className="text-xs text-zinc-300/80 max-w-xs leading-relaxed mb-3">
              End-to-end encrypted direct connection. Koi chat history leak nahi hogi.
            </p>

            {/* Live Presence Status Box */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md shadow-lg text-xs mb-3">
              <span className="relative flex h-2.5 w-2.5">
                {friendStatus?.inChat && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    friendStatus?.inChat
                      ? 'bg-emerald-500'
                      : friendStatus?.isOnline
                      ? 'bg-amber-400'
                      : 'bg-zinc-600'
                  }`}
                />
              </span>
              <span className="font-medium text-zinc-200">
                {friendStatus?.name || 'Friend'}:{' '}
                <strong
                  className={
                    friendStatus?.inChat
                      ? 'text-emerald-400 font-semibold'
                      : friendStatus?.isOnline
                      ? 'text-amber-400 font-semibold'
                      : 'text-zinc-400 font-normal'
                  }
                >
                  {friendStatus?.inChat
                    ? 'Active in Chat Room'
                    : friendStatus?.isOnline
                    ? 'Connected (Away)'
                    : 'Currently Offline'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300 font-mono">
              <Check size={12} />
              <span>Chat history safe & encrypted</span>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.senderId === peerId;
            const now = Date.now();
            let vanishSecondsLeft: number | null = null;
            if (msg.vanishesAfter && msg.vanishesAfter > 0) {
              const expiresAt = msg.timestamp + msg.vanishesAfter * 1000;
              vanishSecondsLeft = Math.max(0, Math.ceil((expiresAt - now) / 1000));
            }

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
                      title={
                        friendStatus?.inChat
                          ? 'Active in chat'
                          : friendStatus?.isOnline
                          ? 'Online (Away)'
                          : 'Offline'
                      }
                    />
                  </div>
                )}

                <div className="flex items-end gap-1.5 max-w-[88%]">
                  {/* Single Message Delete icon */}
                  {isSelf && (
                    <button
                      onClick={() => onBurnMessage(msg.id)}
                      className="opacity-40 hover:opacity-100 active:opacity-100 p-1 text-zinc-400 hover:text-red-400 transition-opacity cursor-pointer"
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
                    {/* Disappearing countdown badge */}
                    {vanishSecondsLeft !== null && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono mb-1 pb-1 border-b border-white/10">
                        <Flame size={11} className="text-amber-400 animate-pulse" />
                        <span>Vanish: {vanishSecondsLeft}s</span>
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
                        />
                      </div>
                    )}

                    {/* Message Timestamp */}
                    <div
                      className={`text-[9px] font-mono mt-1 text-right ${
                        isSelf ? 'text-emerald-200/70' : 'text-zinc-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
            onClick={() => onSendMessage(emoji, vanishSeconds > 0 ? vanishSeconds : undefined)}
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
            title="Send Photo"
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
                <span>Recording audio...</span>
              </span>
              <span className="font-mono font-bold">{recordingSeconds}s</span>
            </div>
          ) : (
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Secret message..."
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

      {/* Panic Burn Confirmation Modal */}
      {confirmBurnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xs rounded-3xl bg-zinc-950 border border-red-900/80 p-5 shadow-2xl text-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 mx-auto mb-3 shadow-lg">
              <Flame size={24} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Clear Entire Chat?</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Dono doston ke phone aur server se saari chat turant permanently delete ho jayegi.
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
                  showToast('Dono devices se chat clear kar di gayi');
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-red-600/30"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
