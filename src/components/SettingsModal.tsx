import React, { useState } from 'react';
import { UserSettings } from '../types';
import { X, KeyRound, User, Volume2, Shield, Hash, Save } from 'lucide-react';

export interface SettingsModalProps {
  isOpen?: boolean;
  settings: UserSettings;
  onUpdateSettings?: (newSettings: UserSettings) => void;
  onSave?: (newSettings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen = true,
  settings,
  onUpdateSettings,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;
  const [pin, setPin] = useState(settings.secretPin);
  const [duressPin, setDuressPin] = useState(settings.duressPin || '0000');
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [roomId, setRoomId] = useState(settings.roomId || '');
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState(settings.hapticsEnabled);
  const [e2eeEnabled, setE2eeEnabledState] = useState(settings.e2eeEnabled ?? true);
  const [antiShoulderSurfing, setAntiShoulderSurfing] = useState(settings.antiShoulderSurfing ?? true);
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch {
      return '';
    }
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim() || '1307';
    const cleanDuressPin = duressPin.trim() || '0000';
    const cleanName = displayName.trim() || 'Dost';
    const cleanRoom = roomId.trim().toLowerCase() || 'direct';

    try {
      if (geminiApiKey.trim()) {
        localStorage.setItem('gemini_api_key', geminiApiKey.trim());
      } else {
        localStorage.removeItem('gemini_api_key');
      }
    } catch {}

    const updated: UserSettings = {
      ...settings,
      secretPin: cleanPin,
      duressPin: cleanDuressPin,
      displayName: cleanName,
      roomId: cleanRoom,
      soundEnabled,
      hapticsEnabled,
      e2eeEnabled,
      antiShoulderSurfing,
    };
    if (onUpdateSettings) onUpdateSettings(updated);
    if (onSave) onSave(updated);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Vault Settings</h3>
            <p className="text-xs text-zinc-400">Secret PIN & Privacy preferences</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Secret PIN */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <KeyRound size={13} className="text-amber-400" />
              <span>Secret Passcode (Real Vault)</span>
            </label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="e.g. 1307"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Real PIN entering opens your encrypted private messenger.
            </p>
          </div>

          {/* Duress (Decoy) PIN */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <KeyRound size={13} className="text-rose-400" />
              <span>Duress / Decoy PIN (Fake Mode)</span>
            </label>
            <input
              type="text"
              value={duressPin}
              onChange={(e) => setDuressPin(e.target.value)}
              placeholder="e.g. 0000"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-white focus:outline-none focus:border-rose-500 transition-colors"
            />
            <p className="text-[10px] text-rose-400/80 mt-1">
              If forced to open app, enter this PIN to show a fake BCA study group!
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <User size={13} className="text-emerald-400" />
              <span>Your Chat Name</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Custom Room Code */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1.5">
              <Hash size={13} className="text-cyan-400" />
              <span>Private Room Code (Optional)</span>
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="direct (default) ya apna code"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Dono doston ko exact same Room Code daalna hoga baat karne ke liye.
            </p>
          </div>

          {/* Spy-Grade Security & Toggles */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" />
                <span>Web Crypto AES-GCM 256 E2EE</span>
              </span>
              <input
                type="checkbox"
                checked={e2eeEnabled}
                onChange={(e) => setE2eeEnabledState(e.target.checked)}
                className="accent-emerald-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-cyan-400" />
                <span>Anti-Shoulder-Surfing Blur</span>
              </span>
              <input
                type="checkbox"
                checked={antiShoulderSurfing}
                onChange={(e) => setAntiShoulderSurfing(e.target.checked)}
                className="accent-cyan-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Volume2 size={13} />
                <span>Sound Effects</span>
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-zinc-300 cursor-pointer">
              <span>Haptic Vibrations</span>
              <input
                type="checkbox"
                checked={hapticsEnabled}
                onChange={(e) => setHapticsEnabled(e.target.checked)}
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Google Gemini API Key for JARVIS */}
          <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <KeyRound size={13} className="text-cyan-400" />
              <span>Google Gemini API Key (JARVIS AI)</span>
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy... (Optional, default server AI active)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[10px] text-zinc-500">
              JARVIS AI will use this custom key if provided, or default to the server AI engine.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg ${
              savedSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20'
            }`}
          >
            <Save size={14} />
            <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
