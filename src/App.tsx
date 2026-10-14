import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LogicSolver } from './components/LogicSolver';
import { CProgramGenerator } from './components/CProgramGenerator';
import { ComputerFundamentals } from './components/ComputerFundamentals';
import { FormulaSheet } from './components/FormulaSheet';
import { BookmarksView } from './components/BookmarksView';
import { SearchModal } from './components/SearchModal';
import { Calculator } from './components/Calculator';
import { SecretChat } from './components/SecretChat';
import { SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { OfflineNotesPad } from './components/OfflineNotesPad';
import { SukhanApp } from './sukhan/components/SukhanApp';
import { SukhanPenIcon } from './sukhan/components/SukhanPenIcon';
import { SimpleCCompilerApp } from './compiler/components/SimpleCCompilerApp';
import { CyberShieldApp } from './cyber/components/CyberShieldApp';
import { JarvisApp } from './jarvis/components/JarvisApp';
import { DevForgeApp } from './devforge/components/DevForgeApp';
import { AppSwitcherModal, CurrentAppType } from './components/AppSwitcherModal';
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
import { Calculator as CalcIcon, Layers, Heart, Sparkles, FileText, RotateCw, Zap, Grid, Shield, Bot } from 'lucide-react';

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
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bca_buddy_theme');
      if (saved) return saved === 'dark';
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
  const [burnToast, setBurnToast] = useState(false);

  // --- SUKHAN Literary Lounge State ---
  const [isSukhanOpen, setIsSukhanOpen] = useState<boolean>(() => {
    try {
      const h = window.location.hash.toLowerCase();
      return h === '#sukhan' || h === '#shayar' || h === '#poetry';
    } catch {
      return false;
    }
  });

  // --- Simple C Compiler App State ---
  const [isCompilerOpen, setIsCompilerOpen] = useState<boolean>(() => {
    try {
      const h = window.location.hash.toLowerCase();
      return h === '#compiler' || h === '#c' || h === '#ccompiler' || h === '#run';
    } catch {
      return false;
    }
  });

  // --- CyberShield Cybersecurity Academy State ---
  const [isCyberOpen, setIsCyberOpen] = useState<boolean>(() => {
    try {
      const h = window.location.hash.toLowerCase();
      return h === '#cyber' || h === '#security' || h === '#hack' || h === '#kali';
    } catch {
      return false;
    }
  });

  // --- JARVIS AI Assistant State ---
  const [isJarvisOpen, setIsJarvisOpen] = useState<boolean>(() => {
    try {
      const h = window.location.hash.toLowerCase();
      return h === '#jarvis' || h === '#ai' || h === '#bot' || h === '#assistant';
    } catch {
      return false;
    }
  });

  // --- DevForge Developer Toolkit State ---
  const [isDevForgeOpen, setIsDevForgeOpen] = useState<boolean>(() => {
    try {
      const h = window.location.hash.toLowerCase();
      return h === '#dev' || h === '#devforge' || h === '#tools' || h === '#forge';
    } catch {
      return false;
    }
  });

  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState<boolean>(false);

  // Sync URL hash with vault, sukhan, compiler, cyber, jarvis, dev & offline notes mode
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#compiler' || h === '#c' || h === '#ccompiler' || h === '#run') {
        setIsCompilerOpen(true);
        setIsSukhanOpen(false);
        setIsVaultOpen(false);
        setIsCyberOpen(false);
        setIsJarvisOpen(false);
        setIsDevForgeOpen(false);
      } else if (h === '#cyber' || h === '#security' || h === '#hack' || h === '#kali') {
        setIsCyberOpen(true);
        setIsCompilerOpen(false);
        setIsSukhanOpen(false);
        setIsVaultOpen(false);
        setIsJarvisOpen(false);
        setIsDevForgeOpen(false);
      } else if (h === '#jarvis' || h === '#ai' || h === '#bot' || h === '#assistant') {
        setIsJarvisOpen(true);
        setIsCyberOpen(false);
        setIsCompilerOpen(false);
        setIsSukhanOpen(false);
        setIsVaultOpen(false);
        setIsDevForgeOpen(false);
      } else if (h === '#dev' || h === '#devforge' || h === '#tools' || h === '#forge') {
        setIsDevForgeOpen(true);
        setIsJarvisOpen(false);
        setIsCyberOpen(false);
        setIsCompilerOpen(false);
        setIsSukhanOpen(false);
        setIsVaultOpen(false);
      } else if (h === '#sukhan' || h === '#shayar' || h === '#poetry') {
        setIsSukhanOpen(true);
        setIsVaultOpen(false);
        setIsCompilerOpen(false);
        setIsCyberOpen(false);
        setIsJarvisOpen(false);
        setIsDevForgeOpen(false);
      } else if (h === '#calc' || h === '#vault' || h === '#chat') {
        setIsVaultOpen(true);
        setIsSukhanOpen(false);
        setIsCompilerOpen(false);
        setIsCyberOpen(false);
        setIsJarvisOpen(false);
        setIsDevForgeOpen(false);
      } else if (h === '#notes' || h === '#pad') {
        setIsVaultOpen(false);
        setIsSukhanOpen(false);
        setIsCompilerOpen(false);
        setIsCyberOpen(false);
        setIsJarvisOpen(false);
        setIsDevForgeOpen(false);
        setActiveTab('notes');
      } else if (h === '#bca' || h === '#home' || h === '') {
        setIsSukhanOpen(false);
        setIsVaultOpen(false);
        setIsCompilerOpen(false);
        setIsCyberOpen(false);
        setIsJarvisOpen(false);
        setIsDevForgeOpen(false);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Listen for Service Worker updates to show instant update button
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        }
      });
    }
  }, []);

  const handleForceUpdateApp = async () => {
    try {
      // Clear CacheStorage
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      // Unregister service worker so next reload gets fresh SW & assets
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }
    } catch (e) {
      console.warn('Cache clear error:', e);
    }
    window.location.reload();
  };

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
    setVaultView('calculator');
  };

  const handleCloseVault = () => {
    if (vaultSettings.soundEnabled) playLockSound();
    setIsVaultOpen(false);
    setVaultView('calculator');
    window.location.hash = '';
  };

  const handleOpenNotes = () => {
    setIsVaultOpen(false);
    setIsSukhanOpen(false);
    setIsCompilerOpen(false);
    setActiveTab('notes');
    window.location.hash = 'notes';
  };

  const handleOpenSukhan = () => {
    setIsVaultOpen(false);
    setIsCompilerOpen(false);
    setIsSukhanOpen(true);
    window.location.hash = 'sukhan';
  };

  const handleCloseSukhan = () => {
    setIsSukhanOpen(false);
    window.location.hash = '';
  };

  const handleOpenCompiler = () => {
    setIsVaultOpen(false);
    setIsSukhanOpen(false);
    setIsCyberOpen(false);
    setIsJarvisOpen(false);
    setIsCompilerOpen(true);
    window.location.hash = 'compiler';
  };

  const handleCloseCompiler = () => {
    setIsCompilerOpen(false);
    window.location.hash = '';
  };

  const handleOpenCyber = () => {
    setIsVaultOpen(false);
    setIsSukhanOpen(false);
    setIsCompilerOpen(false);
    setIsJarvisOpen(false);
    setIsCyberOpen(true);
    window.location.hash = 'cyber';
  };

  const handleCloseCyber = () => {
    setIsCyberOpen(false);
    window.location.hash = '';
  };

  const handleOpenJarvis = () => {
    setIsVaultOpen(false);
    setIsSukhanOpen(false);
    setIsCompilerOpen(false);
    setIsCyberOpen(false);
    setIsDevForgeOpen(false);
    setIsJarvisOpen(true);
    window.location.hash = 'jarvis';
  };

  const handleCloseJarvis = () => {
    setIsJarvisOpen(false);
    window.location.hash = '';
  };

  const handleOpenDevForge = () => {
    setIsVaultOpen(false);
    setIsSukhanOpen(false);
    setIsCompilerOpen(false);
    setIsCyberOpen(false);
    setIsJarvisOpen(false);
    setIsDevForgeOpen(true);
    window.location.hash = 'dev';
  };

  const handleCloseDevForge = () => {
    setIsDevForgeOpen(false);
    window.location.hash = '';
  };

  const handleOpenAppSwitcher = () => {
    setIsAppSwitcherOpen(true);
  };

  const handleSelectApp = (app: CurrentAppType) => {
    setIsAppSwitcherOpen(false);
    if (app === 'bca') {
      setIsSukhanOpen(false);
      setIsVaultOpen(false);
      setIsCompilerOpen(false);
      setIsCyberOpen(false);
      setIsJarvisOpen(false);
      setIsDevForgeOpen(false);
      window.location.hash = '';
    } else if (app === 'calc') {
      setIsSukhanOpen(false);
      setIsCompilerOpen(false);
      setIsCyberOpen(false);
      setIsJarvisOpen(false);
      setIsDevForgeOpen(false);
      setIsVaultOpen(true);
      window.location.hash = 'calc';
    } else if (app === 'sukhan') {
      setIsVaultOpen(false);
      setIsCompilerOpen(false);
      setIsCyberOpen(false);
      setIsJarvisOpen(false);
      setIsDevForgeOpen(false);
      setIsSukhanOpen(true);
      window.location.hash = 'sukhan';
    } else if (app === 'compiler') {
      setIsVaultOpen(false);
      setIsSukhanOpen(false);
      setIsCyberOpen(false);
      setIsJarvisOpen(false);
      setIsDevForgeOpen(false);
      setIsCompilerOpen(true);
      window.location.hash = 'compiler';
    } else if (app === 'cyber') {
      setIsVaultOpen(false);
      setIsSukhanOpen(false);
      setIsCompilerOpen(false);
      setIsJarvisOpen(false);
      setIsDevForgeOpen(false);
      setIsCyberOpen(true);
      window.location.hash = 'cyber';
    } else if (app === 'jarvis') {
      setIsVaultOpen(false);
      setIsSukhanOpen(false);
      setIsCompilerOpen(false);
      setIsCyberOpen(false);
      setIsDevForgeOpen(false);
      setIsJarvisOpen(true);
      window.location.hash = 'jarvis';
    } else if (app === 'dev') {
      setIsVaultOpen(false);
      setIsSukhanOpen(false);
      setIsCompilerOpen(false);
      setIsCyberOpen(false);
      setIsJarvisOpen(false);
      setIsDevForgeOpen(true);
      window.location.hash = 'dev';
    }
  };

  // Direct Peer-to-Peer Chat Hook (only active when room is connected)
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
    burnSingleMessage,
    burnEntireChat,
  } = useDirectChat({
    roomId: vaultSettings.roomId,
    peerId,
    peerName: vaultSettings.displayName,
    isActiveChat: isVaultOpen && vaultView === 'chat',
    soundEnabled: vaultSettings.soundEnabled,
    hapticsEnabled: vaultSettings.hapticsEnabled,
    onRoomBurned: handleRoomBurnedNotification,
  });

  // --- Theme Management ---
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('bca_buddy_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('bca_buddy_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // --- Bookmarks State ---
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('bca_buddy_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveBookmark = (item: {
    type: 'logic' | 'c-program' | 'fundamentals';
    title: string;
    subtitle: string;
    data: any;
  }) => {
    const newItem: BookmarkItem = {
      ...item,
      id: `${item.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...bookmarks.filter((b) => b.title !== newItem.title)];
    setBookmarks(updated);
    localStorage.setItem('bca_buddy_bookmarks', JSON.stringify(updated));
    showToast('Saved to Bookmarks!');
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('bca_buddy_bookmarks', JSON.stringify(updated));
    showToast('Removed from Bookmarks');
  };

  const handleClearBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem('bca_buddy_bookmarks');
    showToast('All bookmarks cleared');
  };

  const isBookmarked = (idOrTitle: string) =>
    bookmarks.some((b) => b.id === idOrTitle || b.title === idOrTitle);

  // --- Recent Searches State ---
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(() => {
    try {
      const saved = localStorage.getItem('bca_buddy_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleAddRecentSearch = (
    query: string,
    type: 'logic' | 'c-program' | 'fundamentals',
    targetId?: string
  ) => {
    const newItem: RecentSearchItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      query,
      type,
      targetId,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...recentSearches.filter((s) => s.query !== query)].slice(0, 8);
    setRecentSearches(updated);
    localStorage.setItem('bca_buddy_recent_searches', JSON.stringify(updated));
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('bca_buddy_recent_searches');
  };

  // --- Toast Feedback State ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // --- Global Search Modal State ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Deep Link / Prefill state for Solvers ---
  const [prefillLogic, setPrefillLogic] = useState<{ type?: NumberSystemType; input?: string }>({});
  const [prefillCProgramId, setPrefillCProgramId] = useState<string | undefined>();

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
            onBackToBca={handleCloseVault}
            onOpenNotes={handleOpenNotes}
            onOpenSukhan={handleOpenSukhan}
            onOpenCompiler={handleOpenCompiler}
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
      </main>
    );
  }

  // --- RENDER 2: SUKHAN Literary Lounge (Made by Prince Thakur) ---
  if (isSukhanOpen) {
    return (
      <>
        <SukhanApp
          onBackToSuite={handleOpenAppSwitcher}
          onOpenCalcVault={() => {
            setIsSukhanOpen(false);
            setIsVaultOpen(true);
            window.location.hash = 'calc';
          }}
          onOpenBcaVerse={handleCloseSukhan}
          onOpenAppSwitcher={handleOpenAppSwitcher}
        />

        {/* 4-Apps Suite Switcher Modal */}
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp="sukhan"
          onSelectApp={handleSelectApp}
        />
      </>
    );
  }

  // --- RENDER 3: Simple C Compiler (Made by Prince Thakur) ---
  if (isCompilerOpen) {
    return (
      <>
        <SimpleCCompilerApp
          onBackToBca={handleCloseCompiler}
          onOpenCalcVault={() => {
            setIsCompilerOpen(false);
            setIsVaultOpen(true);
            window.location.hash = 'calc';
          }}
          onOpenSukhan={() => {
            setIsCompilerOpen(false);
            setIsSukhanOpen(true);
            window.location.hash = 'sukhan';
          }}
          onOpenAppSwitcher={handleOpenAppSwitcher}
        />

        {/* 4-Apps Suite Switcher Modal */}
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp="compiler"
          onSelectApp={handleSelectApp}
        />
      </>
    );
  }

  // --- RENDER 4: CyberShield Academy (Zero to Hero) ---
  if (isCyberOpen) {
    return (
      <>
        <CyberShieldApp
          onBackToBca={handleCloseCyber}
          onOpenCalcVault={() => {
            setIsCyberOpen(false);
            setIsVaultOpen(true);
            window.location.hash = 'calc';
          }}
          onOpenSukhan={() => {
            setIsCyberOpen(false);
            setIsSukhanOpen(true);
            window.location.hash = 'sukhan';
          }}
          onOpenCompiler={() => {
            setIsCyberOpen(false);
            setIsCompilerOpen(true);
            window.location.hash = 'compiler';
          }}
          onOpenJarvis={() => {
            setIsCyberOpen(false);
            setIsJarvisOpen(true);
            window.location.hash = 'jarvis';
          }}
          onOpenAppSwitcher={handleOpenAppSwitcher}
        />

        {/* 6-Apps Suite Switcher Modal */}
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp="cyber"
          onSelectApp={handleSelectApp}
        />
      </>
    );
  }

  // --- RENDER 5: JARVIS AI Assistant ---
  if (isJarvisOpen) {
    return (
      <>
        <JarvisApp
          onBackToBca={handleCloseJarvis}
          onOpenCalcVault={() => {
            setIsJarvisOpen(false);
            setIsVaultOpen(true);
            window.location.hash = 'calc';
          }}
          onOpenSukhan={() => {
            setIsJarvisOpen(false);
            setIsSukhanOpen(true);
            window.location.hash = 'sukhan';
          }}
          onOpenCompiler={() => {
            setIsJarvisOpen(false);
            setIsCompilerOpen(true);
            window.location.hash = 'compiler';
          }}
          onOpenCyber={() => {
            setIsJarvisOpen(false);
            setIsCyberOpen(true);
            window.location.hash = 'cyber';
          }}
          onOpenAppSwitcher={handleOpenAppSwitcher}
        />

        {/* 7-Apps Suite Switcher Modal */}
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp="jarvis"
          onSelectApp={handleSelectApp}
        />
      </>
    );
  }

  // --- RENDER 6: DevForge (Developer Swiss-Army Knife) ---
  if (isDevForgeOpen) {
    return (
      <>
        <DevForgeApp
          onSwitchApp={(target) => {
            if (target === 'switcher') {
              setIsAppSwitcherOpen(true);
            }
          }}
        />

        {/* 7-Apps Suite Switcher Modal */}
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp="dev"
          onSelectApp={handleSelectApp}
        />
      </>
    );
  }

  // --- RENDER 7: BCA Verse Portal ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* App Launch Splash Screen: "Made by Prince Thakur" */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Floating Instant Update Notification Banner */}
      {updateAvailable && (
        <aside aria-label="Update notification" className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-2xl border border-indigo-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-xs font-bold">
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
          <span>Naya App Update Available Hai!</span>
          <button
            onClick={handleForceUpdateApp}
            className="px-3 py-1 bg-white text-indigo-700 rounded-xl text-xs font-extrabold hover:bg-indigo-50 shadow-xs cursor-pointer"
          >
            Update Now
          </button>
        </aside>
      )}

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
        onOpenNotes={handleOpenNotes}
        onOpenSukhan={handleOpenSukhan}
        onOpenCompiler={handleOpenCompiler}
        onOpenCyber={handleOpenCyber}
        onOpenJarvis={handleOpenJarvis}
        onOpenDevForge={handleOpenDevForge}
        onOpenAppSwitcher={handleOpenAppSwitcher}
        onForceUpdateApp={handleForceUpdateApp}
        bookmarkCount={bookmarks.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenCompiler={handleOpenCompiler}
            onOpenCyber={handleOpenCyber}
            onOpenJarvis={handleOpenJarvis}
            onOpenDevForge={handleOpenDevForge}
          />
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

        {activeTab === 'fundamentals' && (
          <ComputerFundamentals
            onSaveBookmark={handleSaveBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'notes' && (
          <OfflineNotesPad
            onBackToBca={() => {
              setActiveTab('home');
              window.location.hash = '';
            }}
            onOpenCalculator={() => {
              setIsVaultOpen(true);
              window.location.hash = 'calc';
            }}
            onOpenSukhan={handleOpenSukhan}
            onOpenCompiler={handleOpenCompiler}
            secretPin={vaultSettings.secretPin}
            soundEnabled={vaultSettings.soundEnabled}
            hapticsEnabled={vaultSettings.hapticsEnabled}
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

      {/* 6-Apps Suite Switcher Modal */}
      <AppSwitcherModal
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        currentApp={
          isJarvisOpen
            ? 'jarvis'
            : isCyberOpen
            ? 'cyber'
            : isCompilerOpen
            ? 'compiler'
            : isVaultOpen
            ? 'calc'
            : isSukhanOpen
            ? 'sukhan'
            : 'bca'
        }
        onSelectApp={handleSelectApp}
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
            <span>6-in-1 Master Offline Suite</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <button
              onClick={() => setShowSplash(true)}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              title="View credits & splash screen"
            >
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
              <span>Made by Prince Thakur</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            <button
              onClick={() => handleNavigate('logic-solver')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Number Solver
            </button>
            <button
              onClick={() => handleNavigate('c-generator')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              C Programs
            </button>
            <button
              onClick={handleOpenCompiler}
              className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer"
              title="Open Simple C Compiler"
            >
              <span>C Compiler (#compiler)</span>
            </button>
            <button
              onClick={handleOpenCyber}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
              title="Open CyberShield Academy"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>CyberShield (#cyber)</span>
            </button>
            <button
              onClick={handleOpenJarvis}
              className="flex items-center gap-1 text-cyan-500 dark:text-cyan-300 font-semibold hover:underline cursor-pointer"
              title="Open JARVIS AI Assistant"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>JARVIS AI (#jarvis)</span>
            </button>
            <button
              onClick={handleOpenSukhan}
              className="flex items-center gap-1 text-[#C6A66B] font-semibold hover:underline cursor-pointer"
              title="Open SUKHAN Literary Lounge"
            >
              <SukhanPenIcon size={14} />
              <span className="font-serif">SUKHAN (#sukhan)</span>
            </button>
            <button
              onClick={() => {
                setIsVaultOpen(true);
                window.location.hash = 'calc';
              }}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer"
              title="Open Secret Calculator"
            >
              <CalcIcon className="w-3.5 h-3.5" />
              <span>Calc Vault (#calc)</span>
            </button>
            <button
              onClick={handleOpenAppSwitcher}
              className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              title="Switch Between 6 Apps"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>6-Apps Suite</span>
            </button>
            <button
              onClick={handleForceUpdateApp}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium hover:underline cursor-pointer"
              title="Clear cache and reload latest version"
            >
              <RotateCw className="w-3 h-3" />
              <span>Force Update</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
