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
  Bot,
  Wrench
} from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';

export type ActiveTab =
  | 'home'
  | 'logic-solver'
  | 'c-generator'
  | 'fundamentals'
  | 'formula-sheet'
  | 'notes'
  | 'bookmarks';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenCalculatorVault?: () => void;
  onOpenNotes?: () => void;
  onOpenSukhan?: () => void;
  onOpenCompiler?: () => void;
  onOpenCyber?: () => void;
  onOpenJarvis?: () => void;
  onOpenDevForge?: () => void;
  onOpenAppSwitcher?: () => void;
  onForceUpdateApp?: () => void;
  bookmarkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onOpenSearch,
  onOpenCalculatorVault,
  onOpenNotes,
  onOpenSukhan,
  onOpenCompiler,
  onOpenCyber,
  onOpenJarvis,
  onOpenDevForge,
  onOpenAppSwitcher,
  onForceUpdateApp,
  bookmarkCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'logic-solver' as ActiveTab, label: 'Logic & Numbers', icon: Cpu },
    { id: 'c-generator' as ActiveTab, label: 'C Programs', icon: Terminal },
    { id: 'fundamentals' as ActiveTab, label: 'Comp Fundamentals', icon: Layers },
    { id: 'notes' as ActiveTab, label: 'Offline Notes', icon: FileText },
    { id: 'formula-sheet' as ActiveTab, label: 'Formula Sheet', icon: BookOpen },
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
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    BCA Verse
                  </span>
                  {/* Made by Prince Thakur badge */}
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    By Prince Thakur
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden xs:block">
                  Academic Suite + Offline Tools
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
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-600 text-white font-bold">
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
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-all cursor-pointer"
              title="Search logic solvers, C programs or notes (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Offline Notes App Button */}
            <button
              onClick={() => {
                if (onOpenNotes) onOpenNotes();
                else setActiveTab('notes');
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Open Offline Notes Pad & Code Runner"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Notes Pad</span>
            </button>

            {/* SUKHAN Literary Lounge Button */}
            {onOpenSukhan && (
              <button
                onClick={onOpenSukhan}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#C6A66B]/50 bg-gradient-to-r from-[#59263C]/30 to-[#0B0B0F] hover:border-[#C6A66B] text-[#C6A66B] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="Open SUKHAN Literary Lounge (#sukhan)"
              >
                <SukhanPenIcon size={14} />
                <span className="font-serif hidden sm:inline">SUKHAN</span>
              </button>
            )}

            {/* Simple C Compiler Button */}
            {onOpenCompiler && (
              <button
                onClick={onOpenCompiler}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="Open Simple C Compiler (#compiler)"
              >
                <span className="w-4 h-4 rounded bg-cyan-600 text-white font-mono font-black text-[10px] flex items-center justify-center">
                  C
                </span>
                <span className="hidden sm:inline">C Compiler</span>
              </button>
            )}

            {/* CyberShield Cybersecurity Button */}
            {onOpenCyber && (
              <button
                onClick={onOpenCyber}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="Open CyberShield (#cyber)"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">CyberShield</span>
              </button>
            )}

            {/* JARVIS AI Button */}
            {onOpenJarvis && (
              <button
                onClick={onOpenJarvis}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="Open JARVIS AI (#jarvis)"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">JARVIS AI</span>
              </button>
            )}

            {/* DevForge Developer Toolkit Button */}
            {onOpenDevForge && (
              <button
                onClick={onOpenDevForge}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="Open DevForge Toolkit (#dev)"
              >
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">DevForge</span>
              </button>
            )}

            {/* Calculator Vault Stealth Button */}
            {onOpenCalculatorVault && (
              <button
                onClick={onOpenCalculatorVault}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="Open Calculator Vault (#calc)"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">Calculator</span>
              </button>
            )}

            {/* 6-Apps Suite Switcher */}
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Open 6-Apps Suite Switcher"
                aria-label="App Suite Switcher"
              >
                <Grid className="w-4 h-4 text-cyan-500" />
              </button>
            )}

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Dark/Light Mode"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Force Update / Reload button */}
            <button
              onClick={handleUpdateClick}
              disabled={updating}
              className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer ${
                updating ? 'animate-spin text-indigo-500' : ''
              }`}
              aria-label="Update & Reload App"
              title="Check update / Clear cache & reload app"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg">
          <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>BCA Study Portal</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Made by Prince Thakur</span>
          </div>

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
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-600 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            {/* Direct button to SUKHAN Literary Lounge */}
            {onOpenSukhan && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSukhan();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#59263C]/30 via-[#3C1425]/20 to-[#0B0B0F] hover:brightness-110 text-[#C6A66B] border border-[#C6A66B]/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <SukhanPenIcon size={18} />
                  <span className="font-serif">SUKHAN (Literary Universe)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C6A66B]/20 text-[#C6A66B]">
                  New App 3
                </span>
              </button>
            )}

            {/* Direct button to Offline Notes */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenNotes) onOpenNotes();
                else setActiveTab('notes');
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Offline Notes &amp; Scratchpad</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                Offline
              </span>
            </button>

            {/* Direct button to Simple C Compiler */}
            {onOpenCompiler && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCompiler();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-md bg-cyan-600 text-white font-mono font-black text-xs flex items-center justify-center">
                    C
                  </span>
                  <span>Simple C Compiler &amp; Runner</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
                  #compiler
                </span>
              </button>
            )}

            {/* Direct button to CyberShield */}
            {onOpenCyber && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCyber();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>CyberShield (Zero to Hero)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                  #cyber
                </span>
              </button>
            )}

            {/* Direct button to JARVIS AI */}
            {onOpenJarvis && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJarvis();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>JARVIS AI (Smart &amp; Cringe)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
                  #jarvis
                </span>
              </button>
            )}

            {/* Direct button to DevForge */}
            {onOpenDevForge && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDevForge();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="w-4 h-4 text-indigo-400" />
                  <span>DevForge (Developer Swiss-Army Knife)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold">
                  #dev
                </span>
              </button>
            )}

            {/* Direct button to Calculator */}
            {onOpenCalculatorVault && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCalculatorVault();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="w-4 h-4 text-amber-500" />
                  <span>Scientific Calculator Vault</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
                  #calc
                </span>
              </button>
            )}

            {/* 7-Apps Suite Launcher Button */}
            {onOpenAppSwitcher && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppSwitcher();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Grid className="w-4 h-4 text-cyan-500" />
                  <span>7-Apps Master Suite Switcher</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
                  7 Apps
                </span>
              </button>
            )}

            {/* Quick Update Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleUpdateClick();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
                <span>Check for App Update / Reload</span>
              </div>
              <span className="text-[10px] text-indigo-500 font-semibold">1-Tap Refresh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
