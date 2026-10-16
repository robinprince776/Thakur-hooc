import React, { useState, useEffect, useCallback, Suspense, Component, ReactNode, ErrorInfo } from 'react';
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
import { BcaNotesView } from './components/BcaNotesView';
import { BcaPracticeView } from './components/BcaPracticeView';
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
import { Sparkles, Zap, ShieldAlert, ArrowLeft } from 'lucide-react';

// Lazy-loaded App Bundles for Maximum Performance & Zero Lag
const TechMasterApp = React.lazy(() =>
  import('./techmaster/components/TechMasterApp').then((m) => ({ default: m.TechMasterApp }))
);
const SimpleCCompilerApp = React.lazy(() =>
  import('./compiler/components/SimpleCCompilerApp').then((m) => ({ default: m.SimpleCCompilerApp }))
);
const CyberShieldApp = React.lazy(() =>
  import('./cyber/components/CyberShieldApp').then((m) => ({ default: m.CyberShieldApp }))
);
const DevForgeApp = React.lazy(() =>
  import('./devforge/components/DevForgeApp').then((m) => ({ default: m.DevForgeApp }))
);
const SukhanApp = React.lazy(() =>
  import('./sukhan/components/SukhanApp').then((m) => ({ default: m.SukhanApp }))
);
const PromptCraftApp = React.lazy(() =>
  import('./promptcraft/PromptCraftApp').then((m) => ({ default: m.PromptCraftApp }))
);
const ApiXApp = React.lazy(() =>
  import('./apix/ApiXApp').then((m) => ({ default: m.ApiXApp }))
);
const CloudOpsApp = React.lazy(() =>
  import('./cloudops/CloudOpsApp').then((m) => ({ default: m.CloudOpsApp }))
);
const NetSecApp = React.lazy(() =>
  import('./netsec/NetSecApp').then((m) => ({ default: m.NetSecApp }))
);
const GitStudioApp = React.lazy(() =>
  import('./gitstudio/GitStudioApp').then((m) => ({ default: m.GitStudioApp }))
);
const DocuCraftApp = React.lazy(() =>
  import('./docucraft/DocuCraftApp').then((m) => ({ default: m.DocuCraftApp }))
);
const ReconMasterApp = React.lazy(() =>
  import('./recon/ReconMasterApp').then((m) => ({ default: m.ReconMasterApp }))
);
const SecureCodeLabApp = React.lazy(() =>
  import('./defense/SecureCodeLabApp').then((m) => ({ default: m.SecureCodeLabApp }))
);
const SentinelLabApp = React.lazy(() =>
  import('./sentinel/SentinelLabApp').then((m) => ({ default: m.SentinelLabApp }))
);
const CyberAcademyApp = React.lazy(() =>
  import('./academy/CyberAcademyApp').then((m) => ({ default: m.CyberAcademyApp }))
);

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

// Lightweight Loading Spinner
function AppLoadingSpinner({ appName }: { appName: string }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-200">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 animate-pulse mb-3">
        <Sparkles className="w-6 h-6 animate-spin text-white" />
      </div>
      <div className="text-sm font-bold text-white tracking-wide">
        Loading {appName}...
      </div>
      <div className="text-[11px] text-slate-400 mt-1 font-mono">
        Optimizing bundle · Zero lag
      </div>
    </div>
  );
}

// Error Boundary for Individual App Fault Tolerance
interface ErrorBoundaryProps {
  children: ReactNode;
  appName: string;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary caught error in ${this.props.appName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="p-6 rounded-3xl bg-slate-800 border border-rose-800/80 max-w-md space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white">Something went wrong in {this.props.appName}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred while loading this application.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onReset();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to BCA Verse</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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
      return true; // Default dark
    }
  });

  // Current Active Application (out of 13 apps)
  const [currentApp, setCurrentApp] = useState<CurrentAppType>(() => {
    try {
      const h = window.location.hash.toLowerCase();
      if (h === '#techmaster' || h === '#tech' || h === '#qna') return 'techmaster';
      if (h === '#compiler' || h === '#c' || h === '#ccompiler' || h === '#run') return 'compiler';
      if (h === '#dev' || h === '#devforge' || h === '#tools' || h === '#forge') return 'dev';
      if (h === '#docucraft' || h === '#doc' || h === '#markdown' || h === '#regex') return 'docucraft';
      if (h === '#gitstudio' || h === '#git' || h === '#cicd') return 'gitstudio';
      if (h === '#cyber' || h === '#security' || h === '#hack' || h === '#kali') return 'cyber';
      if (h === '#netsec' || h === '#headers' || h === '#cors') return 'netsec';
      if (h === '#apix' || h === '#api' || h === '#curl') return 'apix';
      if (h === '#cloudops' || h === '#devops' || h === '#docker' || h === '#k8s') return 'cloudops';
      if (h === '#promptcraft' || h === '#prompt' || h === '#ai') return 'promptcraft';
      if (h === '#calc' || h === '#vault' || h === '#chat') return 'calc';
      if (h === '#sukhan' || h === '#shayar' || h === '#poetry') return 'sukhan';
      if (h === '#recon' || h === '#osint') return 'recon';
      if (h === '#securecode' || h === '#defense') return 'securecode';
      if (h === '#sentinel' || h === '#soc' || h === '#blue') return 'sentinel';
      if (h === '#academy' || h === '#ctf' || h === '#learn') return 'academy';
      return 'bca';
    } catch {
      return 'bca';
    }
  });

  // CalcVault State
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
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState<boolean>(false);

  // Sync URL hash with 13-App Suite
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#techmaster' || h === '#tech' || h === '#qna') {
        setCurrentApp('techmaster');
      } else if (h === '#compiler' || h === '#c' || h === '#ccompiler' || h === '#run') {
        setCurrentApp('compiler');
      } else if (h === '#dev' || h === '#devforge' || h === '#tools' || h === '#forge') {
        setCurrentApp('dev');
      } else if (h === '#docucraft' || h === '#doc' || h === '#markdown' || h === '#regex') {
        setCurrentApp('docucraft');
      } else if (h === '#gitstudio' || h === '#git' || h === '#cicd') {
        setCurrentApp('gitstudio');
      } else if (h === '#cyber' || h === '#security' || h === '#hack' || h === '#kali') {
        setCurrentApp('cyber');
      } else if (h === '#netsec' || h === '#headers' || h === '#cors') {
        setCurrentApp('netsec');
      } else if (h === '#apix' || h === '#api' || h === '#curl') {
        setCurrentApp('apix');
      } else if (h === '#cloudops' || h === '#devops' || h === '#docker' || h === '#k8s') {
        setCurrentApp('cloudops');
      } else if (h === '#promptcraft' || h === '#prompt' || h === '#ai') {
        setCurrentApp('promptcraft');
      } else if (h === '#calc' || h === '#vault' || h === '#chat') {
        setCurrentApp('calc');
      } else if (h === '#sukhan' || h === '#shayar' || h === '#poetry') {
        setCurrentApp('sukhan');
      } else if (h === '#recon' || h === '#osint') {
        setCurrentApp('recon');
      } else if (h === '#securecode' || h === '#defense') {
        setCurrentApp('securecode');
      } else if (h === '#sentinel' || h === '#soc' || h === '#blue') {
        setCurrentApp('sentinel');
      } else if (h === '#academy' || h === '#ctf' || h === '#learn') {
        setCurrentApp('academy');
      } else if (h === '#notes' || h === '#pad') {
        setCurrentApp('bca');
        setActiveTab('notes');
      } else if (h === '#bcaverse' || h === '#bca' || h === '#home' || h === '') {
        setCurrentApp('bca');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Theme Sync
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

  // App Selector Handler
  const handleSelectApp = (app: CurrentAppType) => {
    setIsAppSwitcherOpen(false);
    setCurrentApp(app);
    if (app === 'bca') window.location.hash = 'bcaverse';
    else if (app === 'techmaster') window.location.hash = 'techmaster';
    else if (app === 'compiler') window.location.hash = 'compiler';
    else if (app === 'dev') window.location.hash = 'dev';
    else if (app === 'docucraft') window.location.hash = 'docucraft';
    else if (app === 'gitstudio') window.location.hash = 'gitstudio';
    else if (app === 'cyber') window.location.hash = 'cyber';
    else if (app === 'sentinel') window.location.hash = 'sentinel';
    else if (app === 'academy') window.location.hash = 'academy';
    else if (app === 'netsec') window.location.hash = 'netsec';
    else if (app === 'apix') window.location.hash = 'apix';
    else if (app === 'recon') window.location.hash = 'recon';
    else if (app === 'securecode') window.location.hash = 'securecode';
    else if (app === 'cloudops') window.location.hash = 'cloudops';
    else if (app === 'promptcraft') window.location.hash = 'promptcraft';
    else if (app === 'calc') window.location.hash = 'calc';
    else if (app === 'sukhan') window.location.hash = 'sukhan';
  };

  const handleReturnToBca = () => {
    setCurrentApp('bca');
    window.location.hash = '';
  };

  // CalcVault Direct Chat Hook
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
    isActiveChat: currentApp === 'calc' && vaultView === 'chat',
    soundEnabled: vaultSettings.soundEnabled,
    hapticsEnabled: vaultSettings.hapticsEnabled,
  });

  const handleUnlockVault = () => {
    if (vaultSettings.soundEnabled) playUnlockSound();
    if (vaultSettings.hapticsEnabled) triggerHaptic([30, 60, 30]);
    setVaultView('chat');
  };

  const handleBackToCalculator = () => {
    if (vaultSettings.soundEnabled) playLockSound();
    setVaultView('calculator');
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

  // BCA Verse State (Bookmarks & Search)
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
  const [prefilledSolverType, setPrefilledSolverType] = useState<NumberSystemType | null>(null);
  const [prefilledProgramId, setPrefilledProgramId] = useState<string | null>(null);
  const [prefilledTopicId, setPrefilledTopicId] = useState<string | null>(null);

  const handleAddBookmark = (item: Omit<BookmarkItem, 'id' | 'timestamp'>) => {
    const newItem: BookmarkItem = {
      ...item,
      id: `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setBookmarks((prev) => {
      const updated = [newItem, ...prev.filter((b) => b.title !== item.title)];
      localStorage.setItem('bca_buddy_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem('bca_buddy_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddSearch = (query: string, type: RecentSearchItem['type'], targetId?: string) => {
    const newItem: RecentSearchItem = {
      id: `search-${Date.now()}`,
      query,
      type,
      targetId,
      timestamp: Date.now(),
    };
    setRecentSearches((prev) => {
      const updated = [newItem, ...prev.filter((s) => s.query !== query)].slice(0, 8);
      localStorage.setItem('bca_buddy_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('bca_buddy_recent_searches');
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- RENDER APP 1: TechMaster 2000+ ---
  if (currentApp === 'techmaster') {
    return (
      <AppErrorBoundary appName="TechMaster 2000+" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="TechMaster 2000+" />}>
          <TechMasterApp
            onBackToBca={handleReturnToBca}
            onOpenCalcVault={() => handleSelectApp('calc')}
            onOpenSukhan={() => handleSelectApp('sukhan')}
            onOpenCompiler={() => handleSelectApp('compiler')}
            onOpenCyber={() => handleSelectApp('cyber')}
            onOpenDevForge={() => handleSelectApp('dev')}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 2: C Compiler ---
  if (currentApp === 'compiler') {
    return (
      <AppErrorBoundary appName="C Compiler" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="C Compiler" />}>
          <SimpleCCompilerApp
            onBackToBca={handleReturnToBca}
            onOpenCalcVault={() => handleSelectApp('calc')}
            onOpenSukhan={() => handleSelectApp('sukhan')}
            onOpenCyber={() => handleSelectApp('cyber')}
            onOpenDevForge={() => handleSelectApp('dev')}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 3: DevForge ---
  if (currentApp === 'dev') {
    return (
      <AppErrorBoundary appName="DevForge" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="DevForge" />}>
          <DevForgeApp
            onBackToBca={handleReturnToBca}
            onOpenCalcVault={() => handleSelectApp('calc')}
            onOpenSukhan={() => handleSelectApp('sukhan')}
            onOpenCompiler={() => handleSelectApp('compiler')}
            onOpenCyber={() => handleSelectApp('cyber')}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 4: DocuCraft Studio ---
  if (currentApp === 'docucraft') {
    return (
      <AppErrorBoundary appName="DocuCraft Studio" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="DocuCraft Studio" />}>
          <DocuCraftApp />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 5: Git & CI/CD Studio ---
  if (currentApp === 'gitstudio') {
    return (
      <AppErrorBoundary appName="Git & CI/CD Studio" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Git & CI/CD Studio" />}>
          <GitStudioApp />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 6: CyberShield Academy ---
  if (currentApp === 'cyber') {
    return (
      <AppErrorBoundary appName="CyberShield" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="CyberShield" />}>
          <CyberShieldApp
            onBackToBca={handleReturnToBca}
            onOpenCalcVault={() => handleSelectApp('calc')}
            onOpenSukhan={() => handleSelectApp('sukhan')}
            onOpenCompiler={() => handleSelectApp('compiler')}
            onOpenDevForge={() => handleSelectApp('dev')}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 7: NetSec Sandbox ---
  if (currentApp === 'netsec') {
    return (
      <AppErrorBoundary appName="NetSec Sandbox" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="NetSec Sandbox" />}>
          <NetSecApp />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 8: API-X Lab ---
  if (currentApp === 'apix') {
    return (
      <AppErrorBoundary appName="API-X Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="API-X Lab" />}>
          <ApiXApp />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP: ReconMaster OSINT Toolkit ---
  if (currentApp === 'recon') {
    return (
      <AppErrorBoundary appName="ReconMaster" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="ReconMaster" />}>
          <ReconMasterApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP: SecureCode Lab Defensive Studio ---
  if (currentApp === 'securecode') {
    return (
      <AppErrorBoundary appName="SecureCode Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="SecureCode Lab" />}>
          <SecureCodeLabApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP: SentinelLab Defensive Toolkit ---
  if (currentApp === 'sentinel') {
    return (
      <AppErrorBoundary appName="SentinelLab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="SentinelLab" />}>
          <SentinelLabApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP: CyberAcademy Hands-On Learning Hub ---
  if (currentApp === 'academy') {
    return (
      <AppErrorBoundary appName="CyberAcademy" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="CyberAcademy" />}>
          <CyberAcademyApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 9: CloudOps Shell ---
  if (currentApp === 'cloudops') {
    return (
      <AppErrorBoundary appName="CloudOps Shell" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="CloudOps Shell" />}>
          <CloudOpsApp />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 10: PromptCraft Pro ---
  if (currentApp === 'promptcraft') {
    return (
      <AppErrorBoundary appName="PromptCraft Pro" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="PromptCraft Pro" />}>
          <PromptCraftApp />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 11: SUKHAN Literary Lounge ---
  if (currentApp === 'sukhan') {
    return (
      <AppErrorBoundary appName="SUKHAN" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="SUKHAN" />}>
          <SukhanApp
            onBackToBca={handleReturnToBca}
            onOpenCalcVault={() => handleSelectApp('calc')}
            onOpenCompiler={() => handleSelectApp('compiler')}
            onOpenCyber={() => handleSelectApp('cyber')}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
          />
        </Suspense>
        <AppSwitcherModal
          isOpen={isAppSwitcherOpen}
          onClose={() => setIsAppSwitcherOpen(false)}
          currentApp={currentApp}
          onSelectApp={handleSelectApp}
        />
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP 12: CalcVault ---
  if (currentApp === 'calc') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in font-sans">
        <div className="w-full h-full max-w-md bg-black shadow-2xl relative flex flex-col">
          {vaultView === 'calculator' ? (
            <Calculator
              onUnlock={handleUnlockVault}
              onClose={handleReturnToBca}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              soundEnabled={vaultSettings.soundEnabled}
              hapticsEnabled={vaultSettings.hapticsEnabled}
              secretPin={vaultSettings.secretPin}
              hasSecretCode={Boolean(vaultSettings.secretPin)}
              onlineCount={onlineCount}
              friendStatus={friendStatus}
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
              onBackToBca={handleReturnToBca}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onChangeWallpaper={handleChangeWallpaper}
            />
          )}

          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            settings={vaultSettings}
            onSave={handleUpdateVaultSettings}
          />
        </div>
      </div>
    );
  }

  // --- RENDER APP 13: Core BCA Verse Academic Portal ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* App Launch Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Instant Update Banner */}
      {updateAvailable && (
        <aside aria-label="Update notification" className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-2xl shadow-2xl border border-blue-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 text-xs font-bold">
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
          <span>New Update Available!</span>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-white text-blue-700 rounded-xl text-xs font-extrabold hover:bg-blue-50 shadow-xs cursor-pointer"
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
        onSelectApp={handleSelectApp}
        onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
        bookmarkCount={bookmarks.length}
      />

      {/* Main Tab Panels */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. 📖 Notes Tab (C Programming Hub & Digital Electronics Lab) */}
        {activeTab === 'notes' && (
          <BcaNotesView
            onSaveBookmark={handleAddBookmark}
            isBookmarked={(id) => bookmarks.some((b) => b.id === id)}
            onOpenCodeRunner={(code) => {
              if (code) setPrefilledProgramId(null);
              setActiveTab('code-runner');
            }}
          />
        )}

        {/* 2. 🧮 Solvers Tab (Number Systems, K-Map, Truth Table, Adders) */}
        {(activeTab === 'solvers' || activeTab === 'logic-solver') && (
          <LogicSolver
            initialType={prefilledSolverType || 'dec-to-bin'}
            onSaveBookmark={handleAddBookmark}
            isBookmarked={(id) => bookmarks.some((b) => b.id === id)}
          />
        )}

        {/* 3. 💻 Code Runner Tab (60+ verified C programs with compiler) */}
        {(activeTab === 'code-runner' || activeTab === 'c-generator') && (
          <CProgramGenerator
            initialProgramId={prefilledProgramId || undefined}
            onSaveBookmark={handleAddBookmark}
            isBookmarked={(id) => bookmarks.some((b) => b.id === id)}
          />
        )}

        {/* 4. 📝 Practice Tab (150+ Viva Voce & Exam oriented questions) */}
        {activeTab === 'practice' && (
          <BcaPracticeView
            onSaveBookmark={handleAddBookmark}
            isBookmarked={(id) => bookmarks.some((b) => b.id === id)}
          />
        )}

        {/* 5. 📄 Cheat Sheet Tab (Formulas & quick syntax reference) */}
        {(activeTab === 'cheat-sheet' || activeTab === 'formula-sheet') && (
          <FormulaSheet />
        )}

        {/* 6. Overview / Home Hub */}
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab: ActiveTab, prefill?: any) => {
              if (prefill?.topicId) setPrefilledTopicId(prefill.topicId);
              if (prefill?.type) setPrefilledSolverType(prefill.type);
              if (prefill?.cProgramId) setPrefilledProgramId(prefill.cProgramId);
              setActiveTab(tab);
            }}
            onOpenCompiler={() => handleSelectApp('compiler')}
            onOpenCyber={() => handleSelectApp('cyber')}
            onOpenDevForge={() => handleSelectApp('dev')}
            onOpenTechMaster={() => handleSelectApp('techmaster')}
          />
        )}

        {/* 7. Computer Fundamentals (Archival) */}
        {activeTab === 'fundamentals' && (
          <ComputerFundamentals
            onSaveBookmark={handleAddBookmark}
            isBookmarked={(id) => bookmarks.some((b) => b.id === id)}
          />
        )}

        {/* 8. Saved Bookmarks */}
        {activeTab === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            onRemoveBookmark={handleRemoveBookmark}
            onClearAll={() => setBookmarks([])}
            onNavigate={(tab: ActiveTab, prefill?: any) => {
              if (prefill?.topicId) setPrefilledTopicId(prefill.topicId);
              if (prefill?.type) setPrefilledSolverType(prefill.type);
              if (prefill?.cProgramId) setPrefilledProgramId(prefill.cProgramId);
              setActiveTab(tab);
            }}
          />
        )}
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        recentSearches={recentSearches}
        onAddRecentSearch={handleAddSearch}
        onClearRecentSearches={handleClearSearches}
        onNavigate={(tab: ActiveTab, prefill?: any) => {
          if (prefill?.topicId) setPrefilledTopicId(prefill.topicId);
          if (prefill?.type) setPrefilledSolverType(prefill.type);
          if (prefill?.cProgramId) setPrefilledProgramId(prefill.cProgramId);
          setActiveTab(tab);
        }}
      />

      {/* 13-Apps Suite Switcher Modal */}
      <AppSwitcherModal
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        currentApp={currentApp}
        onSelectApp={handleSelectApp}
      />
    </div>
  );
}
