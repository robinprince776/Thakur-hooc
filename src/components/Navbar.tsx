import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  BookOpen,
  Bookmark,
  Menu,
  X,
  Home,
  Calculator,
  Layers,
  FileText,
  RotateCw,
  Grid,
  Shield,
  Sparkles,
  Cloud,
  Server,
  Globe,
  GitBranch,
  Search,
  Settings,
} from 'lucide-react';
import { OmnitrixLogo } from './OmnitrixLogo';
import { CurrentAppType } from './AppSwitcherModal';
import { useGamificationStore } from '../store/useGamificationStore';
import { TopSearchBar } from './TopSearchBar';
import { AppSettingsMenu } from './AppSettingsMenu';

export type ActiveTab =
  | 'home'
  | 'notes'
  | 'solvers'
  | 'code-runner'
  | 'practice'
  | 'cheat-sheet'
  | 'bookmarks'
  | 'logic-solver'
  | 'c-generator'
  | 'fundamentals'
  | 'formula-sheet';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenNavigator?: () => void;
  onToggleStealth?: () => void;
  onOpenProjectX?: () => void;
  onOpenSidebar?: () => void;
  onSelectApp: (app: CurrentAppType) => void;
  onOpenAppSwitcher: () => void;
  onForceUpdateApp?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onClearSearches?: () => void;
  recentSearchesCount?: number;
  onSyncSoundSetting?: (enabled: boolean) => void;
  onNavigateTabWithPrefill?: (tab: ActiveTab, prefill?: { cProgramId?: string; topicId?: string }) => void;
  bookmarkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onOpenSearch,
  onOpenNavigator,
  onToggleStealth,
  onOpenSidebar,
  onSelectApp,
  onOpenAppSwitcher,
  onForceUpdateApp,
  onOpenProfile,
  onOpenSettings,
  onClearSearches,
  recentSearchesCount = 0,
  onSyncSoundSetting,
  onNavigateTabWithPrefill,
  bookmarkCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userProfile } = useGamificationStore();

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Overview', icon: Home },
    { id: 'notes' as ActiveTab, label: 'Notes', icon: BookOpen },
    { id: 'solvers' as ActiveTab, label: 'Solvers', icon: Cpu },
    { id: 'code-runner' as ActiveTab, label: 'Code', icon: Terminal },
    { id: 'practice' as ActiveTab, label: 'Practice', icon: Layers },
    { id: 'bookmarks' as ActiveTab, label: 'Saved', icon: Bookmark, badge: bookmarkCount },
  ];

  const handleUpdateClick = async () => {
    if (onForceUpdateApp) {
      await onForceUpdateApp();
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-5 h-16">
          {/* Brand Logo & Sidebar Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {onOpenSidebar && (
              <button
                type="button"
                onClick={onOpenSidebar}
                className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-300/70 dark:border-white/5 cursor-pointer flex items-center justify-center transition-colors shrink-0"
                title="Open OS Hubs Sidebar"
                aria-label="Open OS Hubs Sidebar"
              >
                <Menu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer whitespace-nowrap shrink-0"
            >
              <OmnitrixLogo size="md" glow={true} animated={true} />
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
                BCA Verse
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0" aria-label="Primary Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 h-10 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] leading-none bg-blue-600 text-white font-bold tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Prominent Top Search Bar */}
          <TopSearchBar
            onSelectApp={onSelectApp}
            onNavigateTab={
              onNavigateTabWithPrefill ||
              ((tab) => {
                setActiveTab(tab);
              })
            }
            onOpenFullSearch={onOpenSearch}
            onOpenNavigator={onOpenNavigator}
            placeholder="Search apps, tools, C code..."
            className="flex-1 min-w-[120px] max-w-sm"
          />

          {/* Right Actions: Profile, All Apps, App Settings Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="hidden sm:inline-flex items-center gap-1.5 h-10 px-2.5 rounded-xl border border-amber-500/30 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Profile Dashboard (XP, Badges & Missions)"
              >
                <span>{userProfile.avatar}</span>
                <span className="hidden xl:inline font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  Lvl {userProfile.level}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAppSwitcher}
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 cursor-pointer whitespace-nowrap shrink-0"
              title="Open 70+ Apps Suite Switcher"
            >
              <Grid className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Apps</span>
            </button>

            {/* App Settings Menu */}
            <AppSettingsMenu
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onOpenVaultSettings={onOpenSettings}
              onToggleStealth={onToggleStealth}
              onOpenProfile={onOpenProfile}
              onClearSearches={onClearSearches}
              recentSearchesCount={recentSearchesCount}
              onForceUpdateApp={onForceUpdateApp}
              onSyncSoundSetting={onSyncSoundSetting}
              showLabel={true}
            />

            {/* Mobile Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300/70 dark:border-slate-700/70 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto animate-fade-in shadow-2xl">
          <div className="space-y-1">
            {[
              ...navItems,
              { id: 'cheat-sheet' as ActiveTab, label: 'Cheat Sheet', icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {'badge' in item && typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white font-bold tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppSwitcher();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4" />
                <span>Open All 70+ Apps</span>
              </div>
              <span className="text-[10px] bg-cyan-700/60 px-2 py-0.5 rounded font-mono">Suite</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {[
                { id: 'ghost' as CurrentAppType, label: 'GHOST PROTOCOL', icon: Shield },
                { id: 'arsenal' as CurrentAppType, label: 'OpenSource Arsenal', icon: Terminal },
                { id: 'technagar' as CurrentAppType, label: 'TechNagar Story', icon: BookOpen },
                { id: 'medicore' as CurrentAppType, label: 'MediCore Pro', icon: Sparkles },
                { id: 'upsc' as CurrentAppType, label: 'UPSC CSE Prep', icon: BookOpen },
                { id: 'music' as CurrentAppType, label: 'SvaraPulse Music', icon: Sparkles },
                { id: 'linux' as CurrentAppType, label: 'Linux Mastery', icon: Terminal },
                { id: 'pcxray' as CurrentAppType, label: 'PC Hardware', icon: Cpu },
                { id: 'netviz' as CurrentAppType, label: 'Net Visualizer', icon: Globe },
                { id: 'dsa' as CurrentAppType, label: 'DSA Lab', icon: Layers },
                { id: 'database' as CurrentAppType, label: 'SQL Sandbox', icon: Server },
                { id: 'gitflow' as CurrentAppType, label: 'GitFlow Lab', icon: GitBranch },
                { id: 'containers' as CurrentAppType, label: 'Docker & K8s', icon: Cloud },
                { id: 'forensics' as CurrentAppType, label: 'DFIR Forensics', icon: Search },
                { id: 'techmaster' as CurrentAppType, label: 'TechMaster 2000+', icon: BookOpen },
                { id: 'calc' as CurrentAppType, label: 'CalcVault', icon: Calculator },
              ].map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    type="button"
                    key={app.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSelectApp(app.id);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">{app.label}</span>
                  </button>
                );
              })}
            </div>

            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mt-2"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-purple-500" />
                  <span>Vault &amp; Security Settings</span>
                </div>
                <span className="text-[10px] text-slate-400">PIN &amp; E2EE</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleUpdateClick();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-blue-500" />
                <span>Reload / Check Update</span>
              </div>
              <span className="text-[10px] text-blue-500 font-semibold">Refresh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
