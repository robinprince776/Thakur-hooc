import React from 'react';
import {
  Menu,
  ShieldAlert,
  Flame,
  Grid,
} from 'lucide-react';
import { useOsStore } from '../store/useOsStore';
import { useGamificationStore } from '../store/useGamificationStore';
import { OmnitrixLogo } from './OmnitrixLogo';
import { TopSearchBar } from './TopSearchBar';
import { AppSettingsMenu } from './AppSettingsMenu';
import { CurrentAppType } from './AppSwitcherModal';

interface OsTopBarProps {
  onOpenNavigator: () => void;
  onOpenSidebar: () => void;
  onToggleStealth: () => void;
  onOpenAppSwitcher: () => void;
  onHomeClick: () => void;
  onOpenProfile?: () => void;
  onSelectApp?: (app: CurrentAppType) => void;
  onOpenSettings?: () => void;
  onClearSearches?: () => void;
  recentSearchesCount?: number;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export const OsTopBar: React.FC<OsTopBarProps> = ({
  onOpenNavigator,
  onOpenSidebar,
  onToggleStealth,
  onOpenAppSwitcher,
  onHomeClick,
  onOpenProfile,
  onSelectApp,
  onOpenSettings,
  onClearSearches,
  recentSearchesCount = 0,
  onToggleTheme,
  isDark: isDarkProp,
}) => {
  const { theme, toggleTheme: toggleOsTheme, dailyStreak, userName } = useOsStore();
  const { userProfile } = useGamificationStore();
  const isDark = typeof isDarkProp === 'boolean' ? isDarkProp : theme === 'dark';

  const handleToggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      toggleOsTheme();
    }
  };

  const handleSelectApp = (app: CurrentAppType) => {
    if (onSelectApp) {
      onSelectApp(app);
    } else if (typeof window !== 'undefined') {
      window.location.hash = app === 'bca' ? 'bcaverse' : app;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 bg-white/85 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* LEFT: Omnitrix Logo & User Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300/70 dark:border-white/10 cursor-pointer flex items-center justify-center transition-colors shrink-0"
            title="Open OS Sidebar Menu"
            aria-label="Open OS Sidebar Menu"
          >
            <Menu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={onHomeClick}
            className="flex items-center gap-2.5 cursor-pointer group text-left whitespace-nowrap shrink-0"
          >
            <OmnitrixLogo size={28} glow={true} animated={true} />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-black text-slate-900 dark:text-white tracking-wider group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                BCA VERSE OS
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="truncate max-w-[100px]">{userName}</span>
                <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                  <Flame className="w-2.5 h-2.5" /> {dailyStreak}d
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* CENTER: Live Top Search Bar */}
        <TopSearchBar
          onSelectApp={handleSelectApp}
          onOpenNavigator={onOpenNavigator}
          placeholder="Search 70+ Apps, Topics, Labs..."
          className="flex-1 max-w-md min-w-[140px]"
        />

        {/* RIGHT: Actions & App Settings Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="hidden sm:flex items-center gap-1.5 h-10 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-500/30 cursor-pointer transition-colors text-xs font-semibold whitespace-nowrap shrink-0"
              title="Open Profile Dashboard (XP, Badges & Missions)"
            >
              <span className="text-sm">{userProfile.avatar}</span>
              <span className="hidden md:inline text-[11px] text-amber-600 dark:text-amber-400 font-bold tabular-nums">
                Lvl {userProfile.level}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAppSwitcher}
            className="h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-300/70 dark:border-white/10 cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0"
            title="App Hubs Grid"
          >
            <Grid className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="hidden md:inline text-xs">Hubs</span>
          </button>

          <button
            type="button"
            onClick={onToggleStealth}
            className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-300/70 dark:border-white/10 hover:border-rose-500/40 cursor-pointer transition-colors flex items-center justify-center shrink-0"
            title="Stealth Mode Panic Button (Shift+Esc)"
            aria-label="Stealth Mode Panic Button"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <AppSettingsMenu
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            onOpenVaultSettings={onOpenSettings}
            onToggleStealth={onToggleStealth}
            onOpenProfile={onOpenProfile}
            onClearSearches={onClearSearches}
            recentSearchesCount={recentSearchesCount}
            showLabel={false}
          />
        </div>
      </div>
    </header>
  );
};
