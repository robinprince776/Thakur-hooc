import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  BookOpen,
  Bookmark,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Home,
  Calculator,
  Layers,
  FileText,
  RotateCw,
  Grid,
  Shield,
  Wrench,
  Sparkles,
  Cloud,
  Server,
  Globe,
  GitBranch
} from 'lucide-react';
import { CurrentAppType } from './AppSwitcherModal';

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
  onSelectApp: (app: CurrentAppType) => void;
  onOpenAppSwitcher: () => void;
  onForceUpdateApp?: () => void;
  bookmarkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onOpenSearch,
  onSelectApp,
  onOpenAppSwitcher,
  onForceUpdateApp,
  bookmarkCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const navItems = [
    { id: 'notes' as ActiveTab, label: 'Notes', icon: BookOpen },
    { id: 'solvers' as ActiveTab, label: 'Solvers', icon: Cpu },
    { id: 'code-runner' as ActiveTab, label: 'Code Runner', icon: Terminal },
    { id: 'practice' as ActiveTab, label: 'Practice', icon: Layers },
    { id: 'cheat-sheet' as ActiveTab, label: 'Cheat Sheet', icon: FileText },
    { id: 'home' as ActiveTab, label: 'Overview', icon: Home },
    { id: 'bookmarks' as ActiveTab, label: 'Saved', icon: Bookmark, badge: bookmarkCount },
  ];

  const handleUpdateClick = async () => {
    setUpdating(true);
    if (onForceUpdateApp) {
      await onForceUpdateApp();
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('notes');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-white">
                    BCA Verse
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                    By Prince Thakur
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400 hidden xs:block">
                  TechMaster Suite · 15 Apps
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-950 text-blue-300 border border-blue-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-medium transition-all cursor-pointer"
              title="Search logic solvers, C programs or notes (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] bg-slate-900 rounded border border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* TechMaster 2000+ Flagship Button */}
            <button
              onClick={() => onSelectApp('techmaster')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Open TechMaster 2000+ (#techmaster)"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">TechMaster 2000+</span>
              <span className="xl:hidden">TechMaster</span>
            </button>

            {/* PromptCraft Pro */}
            <button
              onClick={() => onSelectApp('promptcraft')}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold transition-all cursor-pointer"
              title="PromptCraft Pro (#promptcraft)"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>PromptCraft</span>
            </button>

            {/* CloudOps Shell */}
            <button
              onClick={() => onSelectApp('cloudops')}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all cursor-pointer"
              title="CloudOps Shell (#cloudops)"
            >
              <Cloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>CloudOps</span>
            </button>

            {/* API-X Lab */}
            <button
              onClick={() => onSelectApp('apix')}
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold transition-all cursor-pointer"
              title="API-X Testing Lab (#apix)"
            >
              <Server className="w-3.5 h-3.5 text-teal-400" />
              <span>API-X</span>
            </button>

            {/* 13-Apps Suite Switcher */}
            <button
              onClick={onOpenAppSwitcher}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              title="Open 13-Apps Master Suite Switcher"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">13 Apps</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Dark/Light Mode"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto animate-fade-in shadow-2xl">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Launch Suite Apps in Drawer */}
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
              All 16 Applications
            </div>

            {/* App Switcher button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppSwitcher();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4" />
                <span>Open 16-Apps Master Switcher</span>
              </div>
              <span>Launch</span>
            </button>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              {[
                { id: 'cyberpath' as CurrentAppType, label: 'CyberPath', icon: Shield },
                { id: 'sentinel' as CurrentAppType, label: 'SentinelLab', icon: Shield },
                { id: 'academy' as CurrentAppType, label: 'CyberAcademy', icon: BookOpen },
                { id: 'techmaster' as CurrentAppType, label: 'TechMaster 2000+', icon: BookOpen },
                { id: 'compiler' as CurrentAppType, label: 'C Compiler', icon: Terminal },
                { id: 'recon' as CurrentAppType, label: 'ReconMaster', icon: Search },
                { id: 'securecode' as CurrentAppType, label: 'SecureCode Lab', icon: Shield },
                { id: 'promptcraft' as CurrentAppType, label: 'PromptCraft Pro', icon: Sparkles },
                { id: 'apix' as CurrentAppType, label: 'API-X Lab', icon: Server },
                { id: 'cloudops' as CurrentAppType, label: 'CloudOps Shell', icon: Cloud },
                { id: 'gitstudio' as CurrentAppType, label: 'Git Studio', icon: GitBranch },
                { id: 'docucraft' as CurrentAppType, label: 'DocuCraft', icon: FileText },
                { id: 'netsec' as CurrentAppType, label: 'NetSec Sandbox', icon: Globe },
                { id: 'cyber' as CurrentAppType, label: 'CyberShield', icon: Shield },
                { id: 'dev' as CurrentAppType, label: 'DevForge', icon: Wrench },
                { id: 'calc' as CurrentAppType, label: 'CalcVault', icon: Calculator },
                { id: 'sukhan' as CurrentAppType, label: 'SUKHAN', icon: Sparkles },
              ].map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSelectApp(app.id);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate text-[11px] font-semibold">{app.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Update Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleUpdateClick();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer mt-3"
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Reload / Check Update</span>
              </div>
              <span className="text-[10px] text-blue-400 font-semibold">1-Tap Refresh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
