import React from 'react';
import {
  Search,
  Command,
  Sun,
  Moon,
  Menu,
  ShieldAlert,
  Flame,
  Sparkles,
  Grid
} from 'lucide-react';
import { useOsStore } from '../store/useOsStore';
import { OmnitrixLogo } from './OmnitrixLogo';

interface OsTopBarProps {
  onOpenNavigator: () => void;
  onOpenSidebar: () => void;
  onToggleStealth: () => void;
  onOpenAppSwitcher: () => void;
  onHomeClick: () => void;
}

export const OsTopBar: React.FC<OsTopBarProps> = ({
  onOpenNavigator,
  onOpenSidebar,
  onToggleStealth,
  onOpenAppSwitcher,
  onHomeClick
}) => {
  const { theme, toggleTheme, dailyStreak, userName } = useOsStore();

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 bg-slate-950/75 border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* LEFT: Omnitrix Logo & User Identity */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 cursor-pointer spring-press transition-all"
            title="Open OS Sidebar Menu"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
          </button>

          <div
            onClick={onHomeClick}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <OmnitrixLogo size={28} glow={true} animated={true} />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950 animate-pulse" />
            </div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white tracking-wider group-hover:text-cyan-400 transition-colors">
                  BCA VERSE OS
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[9px] border border-cyan-500/30">
                  v3.0 PRO
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="truncate max-w-[100px]">{userName}</span>
                <span className="inline-flex items-center gap-0.5 text-amber-400 font-bold">
                  <Flame className="w-2.5 h-2.5" /> {dailyStreak}d
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Prominent TechNavigator Trigger Bar */}
        <div className="flex-1 max-w-md mx-2">
          <button
            onClick={onOpenNavigator}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 shadow-inner transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-xs truncate">
              <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="truncate text-slate-400 group-hover:text-slate-300">
                Search 70+ Apps, Topics, Labs...
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-850 text-slate-400 border border-white/5">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* All Apps Drawer Button */}
          <button
            onClick={onOpenAppSwitcher}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-white/10 cursor-pointer spring-press transition-all flex items-center gap-1.5 text-xs font-semibold"
            title="App Hubs Grid"
          >
            <Grid className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline text-[11px]">Hubs</span>
          </button>

          {/* Stealth Mode Panic Button */}
          <button
            onClick={onToggleStealth}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/40 cursor-pointer spring-press transition-all relative group"
            title="Stealth Mode Panic Button (Shift+Esc)"
          >
            <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-white/10 cursor-pointer spring-press transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
