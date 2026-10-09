import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LogicSolver } from './components/LogicSolver';
import { CProgramGenerator } from './components/CProgramGenerator';
import { FormulaSheet } from './components/FormulaSheet';
import { BookmarksView } from './components/BookmarksView';
import { SearchModal } from './components/SearchModal';
import { Calculator } from './components/Calculator';
import { SecretChat } from './components/SecretChat';
import { SettingsModal } from './components/SettingsModal';
import { InstallModal } from './components/InstallModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { useDirectChat } from './hooks/useDirectChat';
import { playUnlockSound, playLockSound, triggerHaptic } from './utils/sound';
import {
  BookmarkItem,
  NumberSystemType,
  RecentSearchItem,
  CalcVaultView,
  UserSettings,
  NatureWallpaper,
} from './types';
import { Calculator as CalcIcon, Smartphone } from 'lucide-react';

const DEFAULT_VAULT_SETTINGS: UserSettings = {
  secretPin: '1307',
  displayName: 'Dost',
  wallpaper: 'misty-lake',
  soundEnabled: true,
  hapticsEnabled: true,
};

function getOrCreatePeerId(): string {
  const key = 'calcvault_peer_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `usr_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bca_buddy_theme') === 'dark';
    } catch {
      return false; // Default light theme
    }
  });

  // --- CalcVault State ---
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(() => {
    try {
      const h = window.location.hash.toLowerCase();
      return h === '#calc' || h === '#vault' || h === '#chat';
    } catch {
      return false;
    }
  });
  const [vaultView, setVaultView] = useState<CalcVaultView>('calculator');
  const [peerId] = useState<string>(getOrCreatePeerId);
  const [vaultSettings, setVaultSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem('calcvault_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_VAULT_SETTINGS,
          ...parsed,
          secretPin: parsed.secretPin?.trim() || '1307',
        };
      }
    } catch {}
    return DEFAULT_VAULT_SETTINGS;
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [burnToast, setBurnToast] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  // Capture native Android PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const triggerNativeInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          showBcaToast('App phone me install ho rahi hai!');
        }
        setDeferredPrompt(null);
      });
    }
  };

  // Sync URL hash with vault mode
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#calc' || h === '#vault' || h === '#chat') {
        setIsVaultOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleUpdateVaultSettings = (newSettings: UserSettings) => {
    setVaultSettings(newSettings);
    localStorage.setItem('calcvault_settings', JSON.stringify(newSettings));
  };

  const handleChangeWallpaper = (wallpaper: NatureWallpaper) => {
    const updated = { ...vaultSettings, wallpaper };
    setVaultSettings(updated);
    localStorage.setItem('calcvault_settings', JSON.stringify(updated));
  };

  const handleRoomBurnedNotification = useCallback(() => {
    setBurnToast(true);
    setTimeout(() => setBurnToast(false), 2500);
  }, []);

  const handleUnlockVault = () => {
    if (vaultSettings.soundEnabled) playUnlockSound();
    if (vaultSettings.hapticsEnabled) triggerHaptic([30, 60, 30]);
    setVaultView('chat');
  };

  const handleBackToCalculator = () => {
    if (vaultSettings.soundEnabled) playLockSound();
    if (vaultSettings.hapticsEnabled) triggerHaptic(20);
    setVaultView('calculator');
  };

  const handleCloseVault = () => {
    setIsVaultOpen(false);
    if (window.location.hash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  // Direct Chat Hook for Secret Vault
  const {
    messages,
    onlineCount,
    isPeerTyping,
    peerTypingName,
    friendStatus,
    sendMessage,
    sendAudio,
    sendImage,
    sendTyping,
    burnEntireChat,
    burnSingleMessage,
  } = useDirectChat({
    peerId,
    peerName: vaultSettings.displayName,
    roomId: vaultSettings.roomId || 'direct',
    isActiveChat: isVaultOpen && vaultView === 'chat',
    soundEnabled: vaultSettings.soundEnabled,
    hapticsEnabled: vaultSettings.hapticsEnabled,
    onRoomBurned: handleRoomBurnedNotification,
  });

  // --- BCA Verse State ---
  const [prefillLogic, setPrefillLogic] = useState<{
    type?: NumberSystemType;
    input?: string;
  }>({
    type: 'dec-to-bin',
    input: '25.625',
  });

  const [prefillCProgramId, setPrefillCProgramId] = useState<string>('fibonacci-series');

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('bca_buddy_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const saved = localStorage.getItem('bca_buddy_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bca_buddy_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bca_buddy_theme', 'light');
    }
  }, [isDark]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bca_buddy_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  // Sync recent searches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bca_buddy_recent_searches', JSON.stringify(recentSearches));
    } catch {}
  }, [recentSearches]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const showBcaToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBookmark = (item: Omit<BookmarkItem, 'id' | 'timestamp'>) => {
    const existing = bookmarks.find((b) => b.title === item.title && b.type === item.type);
    if (existing) {
      setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
      showBcaToast('Bookmark se hata diya');
      return;
    }

    const newItem: BookmarkItem = {
      ...item,
      id: `bm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    setBookmarks((prev) => [newItem, ...prev]);
    showBcaToast('Bookmark me save ho gaya!');
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showBcaToast('Bookmark delete kar diya');
  };

  const handleClearBookmarks = () => {
    setBookmarks([]);
    showBcaToast('Saare bookmarks clear ho gaye');
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id || b.title === id || b.data?.id === id);
  };

  const handleAddRecentSearch = (query: string, type: 'logic' | 'c-program', targetId?: string) => {
    const filtered = recentSearches.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
    const newItem: RecentSearchItem = {
      id: `rs_${Date.now()}`,
      query,
      type,
      targetId,
      timestamp: Date.now(),
    };
    setRecentSearches([newItem, ...filtered.slice(0, 7)]);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleNavigate = (tab: ActiveTab, params?: any) => {
    setActiveTab(tab);
    if (tab === 'logic-solver' && params) {
      setPrefillLogic(params);
    }
    if (tab === 'c-generator' && params?.programId) {
      setPrefillCProgramId(params.programId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- RENDER 1: CalcVault (Calculator & Secret Chat) ---
  if (isVaultOpen) {
    return (
      <main className="fixed inset-0 w-full h-full bg-black flex flex-col justify-center items-center overflow-hidden z-50">
        {vaultView === 'calculator' ? (
          <Calculator
            secretPin={vaultSettings.secretPin}
            onUnlockVault={handleUnlockVault}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            onBackToBca={handleCloseVault}
            soundEnabled={vaultSettings.soundEnabled}
            hapticsEnabled={vaultSettings.hapticsEnabled}
          />
        ) : (
          <SecretChat
            peerId={peerId}
            settings={vaultSettings}
            messages={messages}
            onlineCount={onlineCount}
            isPeerTyping={isPeerTyping}
            peerTypingName={peerTypingName}
            friendStatus={friendStatus}
            onSendMessage={sendMessage}
            onSendAudio={sendAudio}
            onSendImage={sendImage}
            onSendTyping={sendTyping}
            onBurnMessage={burnSingleMessage}
            onBurnEntireChat={burnEntireChat}
            onBackToCalculator={handleBackToCalculator}
            onBackToBca={handleCloseVault}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenInstall={() => setIsInstallModalOpen(true)}
            onChangeWallpaper={handleChangeWallpaper}
          />
        )}

        {/* Burn Broadcast Toast */}
        {burnToast && (
          <div className="fixed top-5 z-50 bg-red-950/90 border border-red-800 text-red-200 text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Chat clear ho gayi!</span>
          </div>
        )}

        {/* Settings Modal */}
        {isSettingsModalOpen && (
          <SettingsModal
            settings={vaultSettings}
            onUpdateSettings={handleUpdateVaultSettings}
            onClose={() => setIsSettingsModalOpen(false)}
          />
        )}

        {/* Install Modal */}
        {isInstallModalOpen && (
          <InstallModal onClose={() => setIsInstallModalOpen(false)} />
        )}
      </main>
    );
  }

  // --- RENDER 2: BCA Verse Portal ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCalculatorVault={() => {
          setIsVaultOpen(true);
          window.location.hash = 'calc';
        }}
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        bookmarkCount={bookmarks.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {activeTab === 'logic-solver' && (
          <LogicSolver
            initialType={prefillLogic.type}
            initialInput={prefillLogic.input}
            onSaveBookmark={handleSaveBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'c-generator' && (
          <CProgramGenerator
            initialProgramId={prefillCProgramId}
            onSaveBookmark={handleSaveBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'formula-sheet' && <FormulaSheet />}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onClearAll={handleClearBookmarks}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        recentSearches={recentSearches}
        onAddRecentSearch={handleAddRecentSearch}
        onClearRecentSearches={handleClearRecentSearches}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              BCA Verse
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span>Logic & C Programming Solver</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Made by Prince Thakur
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => handleNavigate('logic-solver')}
              className="hover:text-indigo-600 transition-colors"
            >
              Number Solver
            </button>
            <button
              onClick={() => handleNavigate('c-generator')}
              className="hover:text-indigo-600 transition-colors"
            >
              C Programs
            </button>
            <button
              onClick={() => handleNavigate('formula-sheet')}
              className="hover:text-indigo-600 transition-colors"
            >
              Formulas
            </button>
            <button
              onClick={() => {
                setIsVaultOpen(true);
                window.location.hash = 'calc';
              }}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              title="Open Secret Calculator"
            >
              <CalcIcon className="w-3.5 h-3.5" />
              <span>Calc Vault (#calc)</span>
            </button>
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
              title="Install Android App (.apk)"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Android App (.apk)</span>
            </button>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-200 dark:border-emerald-800">
              100% Offline in Browser
            </span>
          </div>
        </div>
      </footer>

      {/* Android Installation Modal */}
      <AndroidInstallModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={triggerNativeInstall}
      />
    </div>
  );
}
