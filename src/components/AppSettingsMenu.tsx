import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  HardDrive,
  Lock,
  Monitor,
  Moon,
  RotateCw,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useOsStore } from '../store/useOsStore';
import { useGamificationStore } from '../store/useGamificationStore';

export interface AppSettingsMenuProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenVaultSettings?: () => void;
  onOpenDataVault?: () => void;
  onToggleStealth?: () => void;
  onOpenProfile?: () => void;
  onClearSearches?: () => void;
  recentSearchesCount?: number;
  onForceUpdateApp?: () => void;
  onSyncSoundSetting?: (enabled: boolean) => void;
  showLabel?: boolean;
}

export const AppSettingsMenu: React.FC<AppSettingsMenuProps> = ({
  isDark,
  onToggleTheme,
  onOpenVaultSettings,
  onOpenDataVault,
  onToggleStealth,
  onOpenProfile,
  onClearSearches,
  recentSearchesCount = 0,
  onForceUpdateApp,
  onSyncSoundSetting,
  showLabel = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clearedToast, setClearedToast] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const {
    splashEnabled,
    setSplashEnabled,
    defaultStartTab,
    setDefaultStartTab,
    compactMode,
    setCompactMode,
    soundEffects,
    setSoundEffects,
    userName,
  } = useOsStore();
  const { userProfile } = useGamificationStore();

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleToggleSound = () => {
    const next = !soundEffects;
    setSoundEffects(next);
    if (onSyncSoundSetting) {
      onSyncSoundSetting(next);
    }
  };

  const handleClearRecent = () => {
    if (onClearSearches) {
      onClearSearches();
      setClearedToast(true);
      setTimeout(() => setClearedToast(false), 1600);
    }
  };

  const handleReload = () => {
    setIsOpen(false);
    if (onForceUpdateApp) {
      onForceUpdateApp();
    } else {
      window.location.reload();
    }
  };

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="App Settings Menu"
        title="App Settings"
        className={`h-10 min-w-[40px] px-2.5 rounded-xl border transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
          isOpen
            ? 'bg-cyan-600/15 border-cyan-500/60 text-cyan-600 dark:text-cyan-300'
            : 'bg-slate-100 dark:bg-slate-800/85 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700/80 text-slate-700 dark:text-slate-200'
        }`}
      >
        <Settings className="w-4 h-4 shrink-0" />
        {showLabel && (
          <span className="hidden xl:inline text-xs font-semibold">Settings</span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="App Settings"
          className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden text-slate-900 dark:text-slate-100"
        >
          {/* Menu Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950/60">
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>App Settings</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {userName} · Level {userProfile.level}
              </p>
            </div>
            {onOpenProfile && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenProfile();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            )}
          </div>

          {/* Preferences Toggles */}
          <div className="p-2.5 space-y-1">
            {/* Appearance Theme Toggle */}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={isDark}
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                {isDark ? (
                  <Moon className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold">Appearance</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isDark ? 'Dark glass mode' : 'Light frosted mode'}
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                {isDark ? 'Dark' : 'Light'}
              </span>
            </button>

            {/* Launch Splash Toggle */}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={splashEnabled}
              onClick={() => setSplashEnabled(!splashEnabled)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Launch Splash Screen</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Show intro animation on startup
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${
                  splashEnabled
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {splashEnabled ? 'On' : 'Off'}
              </span>
            </button>

            {/* Compact Workspace Toggle */}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={compactMode}
              onClick={() => setCompactMode(!compactMode)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Monitor className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">Compact Layout</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Tighter container width for focus
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${
                  compactMode
                    ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {compactMode ? 'Compact' : 'Wide'}
              </span>
            </button>

            {/* Sound & Haptics Toggle */}
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={soundEffects}
              onClick={handleToggleSound}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                {soundEffects ? (
                  <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold">Sound Effects</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Audio cues &amp; CalcVault tones
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${
                  soundEffects
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {soundEffects ? 'On' : 'Muted'}
              </span>
            </button>
          </div>

          {/* Default Startup Tab Selector */}
          <div className="px-3.5 py-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Startup View
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              {(
                [
                  { id: 'home', label: 'Overview' },
                  { id: 'notes', label: 'Notes' },
                  { id: 'solvers', label: 'Solvers' },
                ] as const
              ).map((tab) => {
                const active = defaultStartTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDefaultStartTab(tab.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-cyan-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security & Data Actions */}
          <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 space-y-1">
            {(onOpenDataVault || onOpenVaultSettings) && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenDataVault) {
                    onOpenDataVault();
                  } else if (onOpenVaultSettings) {
                    onOpenVaultSettings();
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <HardDrive className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold">Data Vault (Backup &amp; Restore)</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-500 dark:text-emerald-400">.ghost</span>
              </button>
            )}

            {onOpenVaultSettings && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onOpenVaultSettings();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
                  <span className="text-xs font-semibold">Vault &amp; PIN Settings...</span>
                </div>
                <span className="text-[11px] text-slate-400">E2EE</span>
              </button>
            )}

            {onToggleStealth && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  onToggleStealth();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span className="text-xs font-semibold">Stealth Cover Mode</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  Shift+Esc
                </kbd>
              </button>
            )}

            {onClearSearches && (
              <button
                type="button"
                role="menuitem"
                onClick={handleClearRecent}
                disabled={recentSearchesCount === 0 && !clearedToast}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-default text-left"
              >
                <div className="flex items-center gap-2.5">
                  {clearedToast ? (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                  )}
                  <span className="text-xs font-semibold">
                    {clearedToast ? 'Recent Searches Cleared' : 'Clear Recent Searches'}
                  </span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-400">
                  {recentSearchesCount}
                </span>
              </button>
            )}

            <button
              type="button"
              role="menuitem"
              onClick={handleReload}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <RotateCw className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                <span className="text-xs font-semibold">Reload Application</span>
              </div>
              <span className="text-[11px] text-slate-400">Refresh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
