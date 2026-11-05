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
import { TechNavigatorModal, TechNavigatorItem } from './components/TechNavigatorModal';
import { StealthModeOverlay } from './components/StealthModeOverlay';
import { ProjectXModal } from './projectx/ProjectXModal';
import { useDirectChat } from './hooks/useDirectChat';
import { useMobileBackHandler } from './hooks/useMobileBackHandler';
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
const CyberPathApp = React.lazy(() =>
  import('./cyberpath/CyberPathApp').then((m) => ({ default: m.CyberPathApp }))
);
const TechCareerHubApp = React.lazy(() =>
  import('./career/TechCareerHubApp').then((m) => ({ default: m.TechCareerHubApp }))
);
const LinuxMasteryApp = React.lazy(() =>
  import('./linux/LinuxMasteryApp').then((m) => ({ default: m.LinuxMasteryApp }))
);
const PcxrayApp = React.lazy(() =>
  import('./hardware/PcxrayApp').then((m) => ({ default: m.PcxrayApp }))
);
const NetVizApp = React.lazy(() =>
  import('./networking/NetVizApp').then((m) => ({ default: m.NetVizApp }))
);
const DsaLabApp = React.lazy(() =>
  import('./dsa/DsaLabApp').then((m) => ({ default: m.DsaLabApp }))
);
const SqlPlaygroundApp = React.lazy(() =>
  import('./database/SqlPlaygroundApp').then((m) => ({ default: m.SqlPlaygroundApp }))
);
const CicdApp = React.lazy(() =>
  import('./devops/CicdApp').then((m) => ({ default: m.CicdApp }))
);
const ContainersApp = React.lazy(() =>
  import('./devops/ContainersApp').then((m) => ({ default: m.ContainersApp }))
);
const CloudIamApp = React.lazy(() =>
  import('./cloudiam/CloudIamApp').then((m) => ({ default: m.CloudIamApp }))
);
const SiemLabApp = React.lazy(() =>
  import('./siem/SiemLabApp').then((m) => ({ default: m.SiemLabApp }))
);
const ThreatIntelApp = React.lazy(() =>
  import('./threatintel/ThreatIntelApp').then((m) => ({ default: m.ThreatIntelApp }))
);
const DigitalForensicsApp = React.lazy(() =>
  import('./forensics/DigitalForensicsApp').then((m) => ({ default: m.DigitalForensicsApp }))
);
const CryptoMasterApp = React.lazy(() =>
  import('./cryptomaster/CryptoMasterApp').then((m) => ({ default: m.CryptoMasterApp }))
);
const ReversingApp = React.lazy(() =>
  import('./reversing/ReversingApp').then((m) => ({ default: m.ReversingApp }))
);
const FocusApp = React.lazy(() =>
  import('./productivity/FocusApp').then((m) => ({ default: m.FocusApp }))
);
const DataFormatterApp = React.lazy(() =>
  import('./tools/DataFormatterApp').then((m) => ({ default: m.DataFormatterApp }))
);
const RegexMasterApp = React.lazy(() =>
  import('./tools/RegexMasterApp').then((m) => ({ default: m.RegexMasterApp }))
);
const SystemDesignLabApp = React.lazy(() =>
  import('./systemdesign/SystemDesignLabApp').then((m) => ({ default: m.SystemDesignLabApp }))
);
const ComplianceLabApp = React.lazy(() =>
  import('./compliance/ComplianceLabApp').then((m) => ({ default: m.ComplianceLabApp }))
);
const WebPerfLabApp = React.lazy(() =>
  import('./webperf/WebPerfLabApp').then((m) => ({ default: m.WebPerfLabApp }))
);
const ThreatModelingApp = React.lazy(() =>
  import('./threatmodeling/ThreatModelingApp').then((m) => ({ default: m.ThreatModelingApp }))
);
const GitFlowApp = React.lazy(() =>
  import('./gitflow/GitFlowApp').then((m) => ({ default: m.GitFlowApp }))
);
const MindShieldApp = React.lazy(() =>
  import('./psychology/MindShieldApp').then((m) => ({ default: m.MindShieldApp }))
);
const ZenFocusApp = React.lazy(() =>
  import('./wellness/ZenFocusApp').then((m) => ({ default: m.ZenFocusApp }))
);
const MediCoreApp = React.lazy(() =>
  import("./medicore/MediCoreApp").then((m) => ({ default: m.MediCoreApp }))
);

const VisualAtlasApp = React.lazy(() =>
  import('./atlas/VisualAtlasApp').then((m) => ({ default: m.VisualAtlasApp }))
);

const UpscMasterApp = React.lazy(() =>
  import('./upsc/UpscMasterApp').then((m) => ({ default: m.UpscMasterApp }))
);

const MusicMasterApp = React.lazy(() =>
  import('./music/MusicMasterApp').then((m) => ({ default: m.MusicMasterApp }))
);

const TechNagarApp = React.lazy(() =>
  import('./technagar/TechNagarApp').then((m) => ({ default: m.TechNagarApp }))
);

const FeynmanSimulatorApp = React.lazy(() =>
  import('./feynman/FeynmanSimulatorApp').then((m) => ({ default: m.FeynmanSimulatorApp }))
);

const NeuroNetApp = React.lazy(() =>
  import('./brain/NeuroNetApp').then((m) => ({ default: m.NeuroNetApp }))
);

const PortfolioApp = React.lazy(() =>
  import('./portfolio/PortfolioApp').then((m) => ({ default: m.PortfolioApp }))
);

const ProjectXApp = React.lazy(() =>
  import('./projectx/ProjectXApp').then((m) => ({ default: m.ProjectXApp }))
);

const BcaSemesterSuiteApp = React.lazy(() =>
  import('./bcasuite/BcaSemesterSuiteApp').then((m) => ({ default: m.BcaSemesterSuiteApp }))
);

const BcaExamSimulatorApp = React.lazy(() =>
  import('./bcasuite/BcaExamSimulatorApp').then((m) => ({ default: m.BcaExamSimulatorApp }))
);

const MultiCodePlaygroundApp = React.lazy(() =>
  import('./bcasuite/MultiCodePlaygroundApp').then((m) => ({ default: m.MultiCodePlaygroundApp }))
);

const VisualDbmsOsLabApp = React.lazy(() =>
  import('./bcasuite/VisualDbmsOsLabApp').then((m) => ({ default: m.VisualDbmsOsLabApp }))
);

const BcaDoubtSolverApp = React.lazy(() =>
  import('./bcasuite/BcaDoubtSolverApp').then((m) => ({ default: m.BcaDoubtSolverApp }))
);

const PlacementPrepApp = React.lazy(() =>
  import('./bcasuite/PlacementPrepApp').then((m) => ({ default: m.PlacementPrepApp }))
);

// 🧪 Elite Labs (5 Advanced Apps)
const ForensicCyberLabApp = React.lazy(() =>
  import('./elitelabs/ForensicCyberLabApp').then((m) => ({ default: m.ForensicCyberLabApp }))
);
const QuantumVisualizerApp = React.lazy(() =>
  import('./elitelabs/QuantumVisualizerApp').then((m) => ({ default: m.QuantumVisualizerApp }))
);
const HardwareIotLabApp = React.lazy(() =>
  import('./elitelabs/HardwareIotLabApp').then((m) => ({ default: m.HardwareIotLabApp }))
);
const SystemDesignCanvasApp = React.lazy(() =>
  import('./elitelabs/SystemDesignCanvasApp').then((m) => ({ default: m.SystemDesignCanvasApp }))
);
const TechWealthApp = React.lazy(() =>
  import('./elitelabs/TechWealthApp').then((m) => ({ default: m.TechWealthApp }))
);

// 🚀 Next-Gen Labs (5 Production Simulators)
const RoboticsSimulatorApp = React.lazy(() =>
  import('./nextgen/RoboticsSimulatorApp').then((m) => ({ default: m.RoboticsSimulatorApp }))
);
const GeointSimulatorApp = React.lazy(() =>
  import('./nextgen/GeointSimulatorApp').then((m) => ({ default: m.GeointSimulatorApp }))
);
const ComputerVisionLabApp = React.lazy(() =>
  import('./nextgen/ComputerVisionLabApp').then((m) => ({ default: m.ComputerVisionLabApp }))
);
const OnionRoutingApp = React.lazy(() =>
  import('./nextgen/OnionRoutingApp').then((m) => ({ default: m.OnionRoutingApp }))
);
const GameEngineSandboxApp = React.lazy(() =>
  import('./nextgen/GameEngineSandboxApp').then((m) => ({ default: m.GameEngineSandboxApp }))
);

// 🕵️‍♂️ Threat Intelligence & Mobile Security
const CyberCrimeMatrixApp = React.lazy(() =>
  import('./cybercrime/CyberCrimeMatrixApp').then((m) => ({ default: m.CyberCrimeMatrixApp }))
);
const MobileSecLabApp = React.lazy(() =>
  import('./cybercrime/MobileSecLabApp').then((m) => ({ default: m.MobileSecLabApp }))
);

// OS Architecture Components
import { useOsStore } from './store/useOsStore';
import { OsTopBar } from './components/OsTopBar';
import { OsSidebar } from './components/OsSidebar';
import { SkeletonLoader } from './components/SkeletonLoader';

// 🚀 Gamification, JARVIS AI Assistant & Roadmap Suite
import { JarvisAiAssistant } from './components/jarvis/JarvisAiAssistant';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { ProfileDashboardModal } from './components/gamification/ProfileDashboardModal';
import { CertificateGenerator } from './components/gamification/CertificateGenerator';
import { FinalBossExamEngine } from './components/gamification/FinalBossExamEngine';
import { BOSS_EXAM_TRACKS, ExamTrackInfo } from './data/bossExamQuestions';
import { CertificateRecord, EarnedCertificate } from './store/useGamificationStore';

const MyQuizModule = React.lazy(() =>
  import('./components/gamification/MyQuizModule').then((m) => ({ default: m.MyQuizModule }))
);
const SkillTreeEngine = React.lazy(() =>
  import('./components/gamification/SkillTreeEngine').then((m) => ({ default: m.SkillTreeEngine }))
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
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = `usr_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `usr_${Math.random().toString(36).substring(2, 8)}`;
  }
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
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 max-w-md w-full space-y-4 shadow-2xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {this.props.appName} crashed safely
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.message || 'A safe isolation barrier prevented this module error from affecting your session.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false });
                  try {
                    window.location.hash = '';
                  } catch {}
                  this.props.onReset();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to OS Hub</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer active:scale-95"
              >
                <span>Retry Module</span>
              </button>
            </div>
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
      if (h === '#cyberpath' || h === '#path') return 'cyberpath';
      if (h === '#career' || h === '#salary' || h === '#interview') return 'career';
      if (h === '#linux' || h === '#terminal') return 'linux';
      if (h === '#pcxray' || h === '#hardware' || h === '#cpu') return 'pcxray';
      if (h === '#netviz' || h === '#osi' || h === '#tcp') return 'netviz';
      if (h === '#dsa' || h === '#datastructures' || h === '#stack') return 'dsa';
      if (h === '#database' || h === '#sql' || h === '#query') return 'database';
      if (h === '#cicd' || h === '#devsecops' || h === '#pipeline') return 'cicd';
      if (h === '#containers' || h === '#docker' || h === '#k8s') return 'containers';
      if (h === '#cloudiam' || h === '#iam' || h === '#aws') return 'cloudiam';
      if (h === '#siem' || h === '#logs' || h === '#triage') return 'siem';
      if (h === '#threatintel' || h === '#ioc' || h === '#mitre') return 'threatintel';
      if (h === '#forensics' || h === '#dfir' || h === '#exif') return 'forensics';
      if (h === '#cryptomaster' || h === '#crypto' || h === '#pqc') return 'cryptomaster';
      if (h === '#reversing' || h === '#asm' || h === '#assembly') return 'reversing';
      if (h === '#focus' || h === '#pomodoro' || h === '#timer') return 'focus';
      if (h === '#dataformat' || h === '#json' || h === '#yaml') return 'dataformat';
      if (h === '#regexmaster' || h === '#regex') return 'regexmaster';
      if (h === '#systemdesign' || h === '#architecture' || h === '#cap') return 'systemdesign';
      if (h === '#compliance' || h === '#audit' || h === '#gdpr' || h === '#itact') return 'compliance';
      if (h === '#webperf' || h === '#vitals' || h === '#lighthouse') return 'webperf';
      if (h === '#threatmodel' || h === '#stride' || h === '#dread') return 'threatmodel';
      if (h === '#gitflow' || h === '#rebase' || h === '#reflog') return 'gitflow';
      if (h === '#mindshield' || h === '#psychology' || h === '#psych') return 'mindshield';
      if (h === '#zenfocus' || h === '#wellness' || h === '#zen') return 'zenfocus';
      if (h === '#atlas' || h === '#mindmap' || h === '#diagrams') return 'atlas';
      if (h === '#medicore' || h === '#pharma' || h === '#pharmacy' || h === '#clinic') return 'medicore';
      if (h === '#upsc' || h === '#ias' || h === '#civilservices' || h === '#ips') return 'upsc';
      if (h === '#music' || h === '#svara' || h === '#ragas' || h === '#audio') return 'music';
      if (h === '#technagar' || h === '#story' || h === '#chronicles') return 'technagar';
      if (h === '#feynman' || h === '#mastery' || h === '#explain') return 'feynman';
      if (h === '#brain' || h === '#neuronet' || h === '#graph') return 'brain';
      if (h === '#portfolio' || h === '#resume' || h === '#cv') return 'portfolio';
      if (h === '#projectx' || h === '#vault') return 'projectx';
      if (h === '#exam') return 'exam';
      if (h === '#playground') return 'playground';
      if (h === '#visuallab') return 'visuallab';
      if (h === '#askai') return 'askai';
      if (h === '#placement') return 'placement';
      if (h === '#python') return 'python';
      if (h === '#java') return 'java';
      if (h === '#cpp') return 'cpp';
      if (h === '#webdev') return 'webdev';
      if (h === '#dbms') return 'dbms';
      if (h === '#maths') return 'maths';
      if (h === '#softwareeng') return 'softwareeng';
      if (h === '#graphics') return 'graphics';
      if (h === '#os') return 'os';
      if (h === '#daa') return 'daa';
      if (h === '#internet') return 'internet';
      if (h === '#ai') return 'ai';
      if (h === '#ml') return 'ml';
      if (h === '#cloud') return 'cloud';
      if (h === '#cybersec') return 'cybersec';
      if (h === '#mobile') return 'mobile';
      if (h === '#datascience') return 'datascience';
      if (h === '#forensics') return 'forensics';
      if (h === '#quantum') return 'quantum';
      if (h === '#iot') return 'iot';
      if (h === '#sysdesign') return 'sysdesign';
      if (h === '#wealth') return 'wealth';
      if (h === '#robotics') return 'robotics';
      if (h === '#geoint') return 'geoint';
      if (h === '#vision') return 'vision';
      if (h === '#onion') return 'onion';
      if (h === '#gamedev') return 'gamedev';
      if (h === '#crimematrix' || h === '#crime' || h === '#ss7') return 'crimematrix';
      if (h === '#mobilesec' || h === '#smishing' || h === '#eviltwin') return 'mobilesec';
      if (h === '#myquiz' || h === '#quiz') return 'myquiz';
      if (h === '#skilltree' || h === '#rpg') return 'skilltree';
      return 'bca';
    } catch {
      return 'bca';
    }
  });

  // Meta-Features & Gamification State
  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false);
  const [isStealthActive, setIsStealthActive] = useState<boolean>(false);
  const [isProjectXModalOpen, setIsProjectXModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [activeCertificate, setActiveCertificate] = useState<CertificateRecord | null>(null);
  const [activeExamTrack, setActiveExamTrack] = useState<ExamTrackInfo | null>(null);

  // Global Keyboard Shortcuts (Ctrl+K for TechNavigator, Shift+Esc for Stealth Panic Mode)
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Ctrl + K or Cmd + K -> TechNavigator Command Palette
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsNavigatorOpen((prev) => !prev);
      }
      // Shift + Esc -> Stealth Mode Panic Button
      if (e.shiftKey && e.key === 'Escape') {
        e.preventDefault();
        setIsStealthActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

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
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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
      } else if (h === '#cyberpath' || h === '#path') {
        setCurrentApp('cyberpath');
      } else if (h === '#career' || h === '#salary' || h === '#interview') {
        setCurrentApp('career');
      } else if (h === '#linux' || h === '#terminal') {
        setCurrentApp('linux');
      } else if (h === '#pcxray' || h === '#hardware' || h === '#cpu') {
        setCurrentApp('pcxray');
      } else if (h === '#netviz' || h === '#osi' || h === '#tcp') {
        setCurrentApp('netviz');
      } else if (h === '#dsa' || h === '#datastructures' || h === '#stack') {
        setCurrentApp('dsa');
      } else if (h === '#database' || h === '#sql' || h === '#query') {
        setCurrentApp('database');
      } else if (h === '#cicd' || h === '#devsecops' || h === '#pipeline') {
        setCurrentApp('cicd');
      } else if (h === '#containers' || h === '#docker' || h === '#k8s') {
        setCurrentApp('containers');
      } else if (h === '#cloudiam' || h === '#iam' || h === '#aws') {
        setCurrentApp('cloudiam');
      } else if (h === '#siem' || h === '#logs' || h === '#triage') {
        setCurrentApp('siem');
      } else if (h === '#threatintel' || h === '#ioc' || h === '#mitre') {
        setCurrentApp('threatintel');
      } else if (h === '#forensics' || h === '#dfir' || h === '#exif') {
        setCurrentApp('forensics');
      } else if (h === '#cryptomaster' || h === '#crypto' || h === '#pqc') {
        setCurrentApp('cryptomaster');
      } else if (h === '#reversing' || h === '#asm' || h === '#assembly') {
        setCurrentApp('reversing');
      } else if (h === '#focus' || h === '#pomodoro' || h === '#timer') {
        setCurrentApp('focus');
      } else if (h === '#dataformat' || h === '#json' || h === '#yaml') {
        setCurrentApp('dataformat');
      } else if (h === '#regexmaster' || h === '#regex') {
        setCurrentApp('regexmaster');
      } else if (h === '#systemdesign' || h === '#architecture' || h === '#cap') {
        setCurrentApp('systemdesign');
      } else if (h === '#compliance' || h === '#audit' || h === '#gdpr' || h === '#itact') {
        setCurrentApp('compliance');
      } else if (h === '#webperf' || h === '#vitals' || h === '#lighthouse') {
        setCurrentApp('webperf');
      } else if (h === '#threatmodel' || h === '#stride' || h === '#dread') {
        setCurrentApp('threatmodel');
      } else if (h === '#gitflow' || h === '#rebase' || h === '#reflog') {
        setCurrentApp('gitflow');
      } else if (h === '#mindshield' || h === '#psychology' || h === '#psych') {
        setCurrentApp('mindshield');
      } else if (h === '#zenfocus' || h === '#wellness' || h === '#zen') {
        setCurrentApp('zenfocus');
      } else if (h === '#atlas' || h === '#mindmap' || h === '#diagrams') {
        setCurrentApp('atlas');
      } else if (h === '#medicore' || h === '#pharma' || h === '#pharmacy' || h === '#clinic') {
        setCurrentApp('medicore');
      } else if (h === '#upsc' || h === '#ias' || h === '#civilservices' || h === '#ips') {
        setCurrentApp('upsc');
      } else if (h === '#music' || h === '#svara' || h === '#ragas' || h === '#audio') {
        setCurrentApp('music');
      } else if (h === '#technagar' || h === '#story' || h === '#chronicles') {
        setCurrentApp('technagar');
      } else if (h === '#feynman' || h === '#mastery' || h === '#explain') {
        setCurrentApp('feynman');
      } else if (h === '#brain' || h === '#neuronet' || h === '#graph') {
        setCurrentApp('brain');
      } else if (h === '#portfolio' || h === '#resume' || h === '#cv') {
        setCurrentApp('portfolio');
      } else if (h === '#projectx' || h === '#vault') {
        setCurrentApp('projectx');
      } else if (h === '#exam') {
        setCurrentApp('exam');
      } else if (h === '#playground') {
        setCurrentApp('playground');
      } else if (h === '#visuallab') {
        setCurrentApp('visuallab');
      } else if (h === '#askai') {
        setCurrentApp('askai');
      } else if (h === '#placement') {
        setCurrentApp('placement');
      } else if (h === '#python') {
        setCurrentApp('python');
      } else if (h === '#java') {
        setCurrentApp('java');
      } else if (h === '#cpp') {
        setCurrentApp('cpp');
      } else if (h === '#webdev') {
        setCurrentApp('webdev');
      } else if (h === '#dbms') {
        setCurrentApp('dbms');
      } else if (h === '#maths') {
        setCurrentApp('maths');
      } else if (h === '#softwareeng') {
        setCurrentApp('softwareeng');
      } else if (h === '#graphics') {
        setCurrentApp('graphics');
      } else if (h === '#os') {
        setCurrentApp('os');
      } else if (h === '#daa') {
        setCurrentApp('daa');
      } else if (h === '#internet') {
        setCurrentApp('internet');
      } else if (h === '#ai') {
        setCurrentApp('ai');
      } else if (h === '#ml') {
        setCurrentApp('ml');
      } else if (h === '#cloud') {
        setCurrentApp('cloud');
      } else if (h === '#cybersec') {
        setCurrentApp('cybersec');
      } else if (h === '#mobile') {
        setCurrentApp('mobile');
      } else if (h === '#datascience') {
        setCurrentApp('datascience');
      } else if (h === '#forensics') {
        setCurrentApp('forensics');
      } else if (h === '#quantum') {
        setCurrentApp('quantum');
      } else if (h === '#iot') {
        setCurrentApp('iot');
      } else if (h === '#sysdesign') {
        setCurrentApp('sysdesign');
      } else if (h === '#wealth') {
        setCurrentApp('wealth');
      } else if (h === '#robotics') {
        setCurrentApp('robotics');
      } else if (h === '#geoint') {
        setCurrentApp('geoint');
      } else if (h === '#vision') {
        setCurrentApp('vision');
      } else if (h === '#onion') {
        setCurrentApp('onion');
      } else if (h === '#gamedev') {
        setCurrentApp('gamedev');
      } else if (h === '#crimematrix' || h === '#crime' || h === '#ss7') {
        setCurrentApp('crimematrix');
      } else if (h === '#mobilesec' || h === '#smishing' || h === '#eviltwin') {
        setCurrentApp('mobilesec');
      } else if (h === '#myquiz' || h === '#quiz') {
        setCurrentApp('myquiz');
      } else if (h === '#skilltree' || h === '#rpg') {
        setCurrentApp('skilltree');
      } else if (h === '#roadmap' || h === '#path' || h === '#curriculum') {
        setCurrentApp('roadmap');
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
    try {
      if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('bca_buddy_theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('bca_buddy_theme', 'light');
      }
    } catch {}
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Universal Mobile Hardware Back Button & Swipe Navigation Interceptor
  const { showExitToast } = useMobileBackHandler({
    currentApp,
    setCurrentApp,
    activeTab,
    setActiveTab,
    isAppSwitcherOpen,
    setIsAppSwitcherOpen,
    isNavigatorOpen,
    setIsNavigatorOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isSearchOpen,
    setIsSearchOpen,
    isProjectXModalOpen,
    setIsProjectXModalOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    isStealthActive,
    setIsStealthActive,
    vaultView,
    setVaultView,
  });

  // App Selector Handler (Universal for all 46+ apps)
  const handleSelectApp = (app: CurrentAppType) => {
    setIsAppSwitcherOpen(false);
    setCurrentApp(app);
    if (app === 'bca') {
      window.location.hash = 'bcaverse';
    } else {
      window.location.hash = app;
    }
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
    try {
      localStorage.setItem('calcvault_settings', JSON.stringify(newSettings));
    } catch {}
  };

  const handleChangeWallpaper = (wallpaper: NatureWallpaper) => {
    const updated = { ...vaultSettings, wallpaper };
    setVaultSettings(updated);
    try {
      localStorage.setItem('calcvault_settings', JSON.stringify(updated));
    } catch {}
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
      try {
        localStorage.setItem('bca_buddy_bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('bca_buddy_bookmarks', JSON.stringify(updated));
      } catch {}
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
      try {
        localStorage.setItem('bca_buddy_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleClearSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('bca_buddy_recent_searches');
    } catch {}
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

  // --- RENDER APP: Zero-to-Hero University Roadmap ---
  if (currentApp === 'roadmap') {
    return (
      <AppErrorBoundary appName="My Roadmap" onReset={handleReturnToBca}>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <OsTopBar
            onHomeClick={handleReturnToBca}
            onOpenNavigator={() => setIsNavigatorOpen(true)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onToggleStealth={() => setIsStealthActive((prev) => !prev)}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
          />
          <main className="flex-1 py-6">
            <RoadmapView
              onSelectApp={handleSelectApp}
              onBackToHome={handleReturnToBca}
            />
          </main>
          <AppSwitcherModal
            isOpen={isAppSwitcherOpen}
            onClose={() => setIsAppSwitcherOpen(false)}
            currentApp={currentApp}
            onSelectApp={handleSelectApp}
          />
          <TechNavigatorModal
            isOpen={isNavigatorOpen}
            onClose={() => setIsNavigatorOpen(false)}
            onSelectItem={(item) => {
              setIsNavigatorOpen(false);
              if (item.appTarget) handleSelectApp(item.appTarget);
              else if (item.hashTarget && typeof window !== 'undefined') window.location.hash = item.hashTarget;
            }}
          />
          <OsSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelectApp={handleSelectApp}
            currentApp={currentApp}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenPortfolio={() => {
              handleSelectApp('portfolio' as CurrentAppType);
              window.location.hash = '#portfolio';
            }}
            onToggleStealth={() => setIsStealthActive((prev) => !prev)}
          />
          <JarvisAiAssistant
            currentApp="roadmap"
            onNavigateApp={(appId: string) => handleSelectApp(appId as CurrentAppType)}
            onStartQuiz={(track) => {
              handleSelectApp('exam');
            }}
            onToggleTheme={toggleTheme}
            onOpenRoadmap={() => {
              if (typeof window !== 'undefined') window.location.hash = '#roadmap';
              handleSelectApp('roadmap');
            }}
          />
        </div>
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP: BCA Exam Simulator ---
  if (currentApp === 'exam') {
    return (
      <AppErrorBoundary appName="BCA Exam Simulator" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="BCA Exam Simulator" />}>
          <BcaExamSimulatorApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Multi-Language Code Playground ---
  if (currentApp === 'playground') {
    return (
      <AppErrorBoundary appName="Code Playground" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Code Playground" />}>
          <MultiCodePlaygroundApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Visual DBMS & OS Lab ---
  if (currentApp === 'visuallab') {
    return (
      <AppErrorBoundary appName="Visual DBMS & OS Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Visual DBMS & OS Lab" />}>
          <VisualDbmsOsLabApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: AI BCA Doubt Solver ---
  if (currentApp === 'askai') {
    return (
      <AppErrorBoundary appName="BCA Doubt Solver" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="BCA Doubt Solver" />}>
          <BcaDoubtSolverApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Placement Prep Hub ---
  if (currentApp === 'placement') {
    return (
      <AppErrorBoundary appName="Placement Prep Hub" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Placement Prep Hub" />}>
          <PlacementPrepApp
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: 6-Semester Core BCA Subjects ---
  if (
    currentApp === 'python' ||
    currentApp === 'java' ||
    currentApp === 'cpp' ||
    currentApp === 'webdev' ||
    currentApp === 'dbms' ||
    currentApp === 'maths' ||
    currentApp === 'softwareeng' ||
    currentApp === 'graphics' ||
    currentApp === 'os' ||
    currentApp === 'daa' ||
    currentApp === 'internet' ||
    currentApp === 'ai' ||
    currentApp === 'ml' ||
    currentApp === 'cloud' ||
    currentApp === 'cybersec' ||
    currentApp === 'mobile' ||
    currentApp === 'datascience'
  ) {
    return (
      <AppErrorBoundary appName="BCA Academic Suite" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="BCA Academic Suite" />}>
          <BcaSemesterSuiteApp
            initialSubject={currentApp}
            onBackToBca={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Forensic Cyber Lab (Elite Labs) ---
  if (currentApp === 'forensics') {
    return (
      <AppErrorBoundary appName="Forensic Cyber Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Forensic Cyber Lab" />}>
          <ForensicCyberLabApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Quantum Computing Visualizer (Elite Labs) ---
  if (currentApp === 'quantum') {
    return (
      <AppErrorBoundary appName="Quantum Visualizer" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Quantum Computing Visualizer" />}>
          <QuantumVisualizerApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Hardware & IoT Lab (Elite Labs) ---
  if (currentApp === 'iot') {
    return (
      <AppErrorBoundary appName="Hardware & IoT Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Hardware & IoT Lab" />}>
          <HardwareIotLabApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: System Design Canvas (Elite Labs) ---
  if (currentApp === 'sysdesign') {
    return (
      <AppErrorBoundary appName="System Design Canvas" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="System Design Canvas" />}>
          <SystemDesignCanvasApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: TechWealth (Elite Labs) ---
  if (currentApp === 'wealth') {
    return (
      <AppErrorBoundary appName="TechWealth" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="TechWealth Finance" />}>
          <TechWealthApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Drone & Robotics Simulator (Next-Gen Labs) ---
  if (currentApp === 'robotics') {
    return (
      <AppErrorBoundary appName="Drone Robotics Simulator" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Drone & Robotics Simulator" />}>
          <RoboticsSimulatorApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Satellite & GEOINT (Next-Gen Labs) ---
  if (currentApp === 'geoint') {
    return (
      <AppErrorBoundary appName="Satellite GEOINT Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Satellite & GEOINT" />}>
          <GeointSimulatorApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Computer Vision Lab (Next-Gen Labs) ---
  if (currentApp === 'vision') {
    return (
      <AppErrorBoundary appName="Computer Vision Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Computer Vision Lab" />}>
          <ComputerVisionLabApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Onion Routing & Tor (Next-Gen Labs) ---
  if (currentApp === 'onion') {
    return (
      <AppErrorBoundary appName="Onion Routing Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Onion Routing Lab" />}>
          <OnionRoutingApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: Game Engine & Physics (Next-Gen Labs) ---
  if (currentApp === 'gamedev') {
    return (
      <AppErrorBoundary appName="Game Engine Sandbox" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="Game Engine Sandbox" />}>
          <GameEngineSandboxApp
            onBackToHub={handleReturnToBca}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onSelectApp={handleSelectApp}
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

  // --- RENDER APP: CyberCrime Matrix (#crimematrix) ---
  if (currentApp === 'crimematrix') {
    return (
      <AppErrorBoundary appName="CyberCrime Matrix" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="CyberCrime Matrix" />}>
          <CyberCrimeMatrixApp
            onBackToHub={handleReturnToBca}
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

  // --- RENDER APP: MobileSec Lab (#mobilesec) ---
  if (currentApp === 'mobilesec') {
    return (
      <AppErrorBoundary appName="MobileSec Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<SkeletonLoader appName="MobileSec Lab" />}>
          <MobileSecLabApp
            onBackToHub={handleReturnToBca}
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

  // --- RENDER APP: My Quiz & Active Recall (#myquiz) ---
  if (currentApp === 'myquiz') {
    return (
      <AppErrorBoundary appName="My Quiz & Active Recall" onReset={handleReturnToBca}>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <OsTopBar
            onOpenNavigator={() => setIsNavigatorOpen(true)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onToggleStealth={() => setIsStealthActive((prev) => !prev)}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onHomeClick={handleReturnToBca}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
          <Suspense fallback={<SkeletonLoader appName="My Quiz & Active Recall" />}>
            <MyQuizModule />
          </Suspense>
          <AppSwitcherModal
            isOpen={isAppSwitcherOpen}
            onClose={() => setIsAppSwitcherOpen(false)}
            currentApp={currentApp}
            onSelectApp={handleSelectApp}
          />
          <OsSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelectApp={handleSelectApp}
            currentApp={currentApp}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenPortfolio={() => {
              handleSelectApp('portfolio' as CurrentAppType);
              window.location.hash = '#portfolio';
            }}
            onToggleStealth={() => setIsStealthActive((prev) => !prev)}
          />
          {isProfileModalOpen && (
            <ProfileDashboardModal
              onClose={() => setIsProfileModalOpen(false)}
              onViewCertificate={(cert: EarnedCertificate) => setActiveCertificate(cert)}
              onOpenSkillTree={() => {
                setIsProfileModalOpen(false);
                handleSelectApp('skilltree');
              }}
            />
          )}
          {activeCertificate && (
            <CertificateGenerator
              certificate={activeCertificate}
              onClose={() => setActiveCertificate(null)}
            />
          )}
        </div>
      </AppErrorBoundary>
    );
  }

  // --- RENDER APP: RPG Skill Tree Engine (#skilltree) ---
  if (currentApp === 'skilltree') {
    return (
      <AppErrorBoundary appName="RPG Skill Tree Engine" onReset={handleReturnToBca}>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <OsTopBar
            onOpenNavigator={() => setIsNavigatorOpen(true)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onToggleStealth={() => setIsStealthActive((prev) => !prev)}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onHomeClick={handleReturnToBca}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
          <Suspense fallback={<SkeletonLoader appName="RPG Skill Tree Engine" />}>
            <div className="pt-16 p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1">
              <SkillTreeEngine
                onStartBossChallenge={(_node: any) => {
                  const examTrack = BOSS_EXAM_TRACKS.find((t) => t.id === 'c-mastery-boss') || BOSS_EXAM_TRACKS[0];
                  setActiveExamTrack(examTrack);
                }}
              />
            </div>
          </Suspense>
          <AppSwitcherModal
            isOpen={isAppSwitcherOpen}
            onClose={() => setIsAppSwitcherOpen(false)}
            currentApp={currentApp}
            onSelectApp={handleSelectApp}
          />
          <OsSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelectApp={handleSelectApp}
            currentApp={currentApp}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenPortfolio={() => {
              handleSelectApp('portfolio' as CurrentAppType);
              window.location.hash = '#portfolio';
            }}
            onToggleStealth={() => setIsStealthActive((prev) => !prev)}
          />
          {activeExamTrack && (
            <FinalBossExamEngine
              examId={activeExamTrack.id}
              examTitle={activeExamTrack.title}
              category={activeExamTrack.category}
              passingScore={activeExamTrack.passingScore}
              durationMinutes={activeExamTrack.durationMinutes}
              xpReward={activeExamTrack.xpReward}
              badgeReward={activeExamTrack.badgeReward}
              questions={activeExamTrack.questions}
              onClose={() => setActiveExamTrack(null)}
              onPassed={(cert: EarnedCertificate) => {
                setActiveCertificate(cert);
              }}
            />
          )}
          {isProfileModalOpen && (
            <ProfileDashboardModal
              onClose={() => setIsProfileModalOpen(false)}
              onViewCertificate={(cert: EarnedCertificate) => setActiveCertificate(cert)}
              onOpenSkillTree={() => {
                setIsProfileModalOpen(false);
                handleSelectApp('skilltree');
              }}
            />
          )}
          {activeCertificate && (
            <CertificateGenerator
              certificate={activeCertificate}
              onClose={() => setActiveCertificate(null)}
            />
          )}
        </div>
      </AppErrorBoundary>
    );
  }

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

  // --- RENDER APP: CyberPath Master Learning Hub ---
  if (currentApp === 'cyberpath') {
    return (
      <AppErrorBoundary appName="CyberPath" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="CyberPath" />}>
          <CyberPathApp
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

  // --- RENDER APP: TechCareer Hub ---
  if (currentApp === 'career') {
    return (
      <AppErrorBoundary appName="TechCareer Hub" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="TechCareer Hub" />}>
          <TechCareerHubApp
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

  // --- RENDER APP: Linux & Kali Mastery ---
  if (currentApp === 'linux') {
    return (
      <AppErrorBoundary appName="Linux & Kali Mastery" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Linux & Kali Mastery" />}>
          <LinuxMasteryApp
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

  // --- RENDER APP: PC Hardware & OS Explorer ---
  if (currentApp === 'pcxray') {
    return (
      <AppErrorBoundary appName="PC Hardware & OS Explorer" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="PC Hardware & OS Explorer" />}>
          <PcxrayApp
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

  // --- RENDER APP: Networking Visualizer ---
  if (currentApp === 'netviz') {
    return (
      <AppErrorBoundary appName="Networking Visualizer" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Networking Visualizer" />}>
          <NetVizApp
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

  // --- RENDER APP: Data Structures Lab ---
  if (currentApp === 'dsa') {
    return (
      <AppErrorBoundary appName="Data Structures Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Data Structures Lab" />}>
          <DsaLabApp
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

  // --- RENDER APP: SQL Playground ---
  if (currentApp === 'database') {
    return (
      <AppErrorBoundary appName="SQL Playground" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="SQL Playground" />}>
          <SqlPlaygroundApp
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

  // --- RENDER APP: DevSecOps CI/CD Lab ---
  if (currentApp === 'cicd') {
    return (
      <AppErrorBoundary appName="DevSecOps CI/CD Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="DevSecOps CI/CD Lab" />}>
          <CicdApp
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

  // --- RENDER APP: Container & K8s Lab ---
  if (currentApp === 'containers') {
    return (
      <AppErrorBoundary appName="Container & K8s Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Container & K8s Lab" />}>
          <ContainersApp
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

  // --- RENDER APP: Cloud IAM & Policy Studio ---
  if (currentApp === 'cloudiam') {
    return (
      <AppErrorBoundary appName="Cloud IAM & Policy Studio" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Cloud IAM & Policy Studio" />}>
          <CloudIamApp
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

  // --- RENDER APP: SIEM & SOC Log Inspector ---
  if (currentApp === 'siem') {
    return (
      <AppErrorBoundary appName="SIEM & SOC Log Inspector" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="SIEM & SOC Log Inspector" />}>
          <SiemLabApp
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

  // --- RENDER APP: Threat Intel & IOC Extractor ---
  if (currentApp === 'threatintel') {
    return (
      <AppErrorBoundary appName="Threat Intel & IOC Extractor" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Threat Intel & IOC Extractor" />}>
          <ThreatIntelApp
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

  // --- RENDER APP: Crypto & Post-Quantum Lab ---
  if (currentApp === 'cryptomaster') {
    return (
      <AppErrorBoundary appName="Crypto & Post-Quantum Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Crypto & Post-Quantum Lab" />}>
          <CryptoMasterApp
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

  // --- RENDER APP: Reverse Engineering Lab ---
  if (currentApp === 'reversing') {
    return (
      <AppErrorBoundary appName="Reverse Engineering Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Reverse Engineering Lab" />}>
          <ReversingApp
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

  // --- RENDER APP: Focus & Productivity Studio ---
  if (currentApp === 'focus') {
    return (
      <AppErrorBoundary appName="Focus & Productivity Studio" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Focus & Productivity Studio" />}>
          <FocusApp
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

  // --- RENDER APP: Data Formatter & Minifier ---
  if (currentApp === 'dataformat') {
    return (
      <AppErrorBoundary appName="Data Formatter & Minifier" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Data Formatter & Minifier" />}>
          <DataFormatterApp
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

  // --- RENDER APP: Regex Master Lab ---
  if (currentApp === 'regexmaster') {
    return (
      <AppErrorBoundary appName="Regex Master Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="Regex Master Lab" />}>
          <RegexMasterApp
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

  // --- RENDER APP: SystemDesign Lab ---
  if (currentApp === 'systemdesign') {
    return (
      <AppErrorBoundary appName="SystemDesign Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="SystemDesign Lab" />}>
          <SystemDesignLabApp
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

  // --- RENDER APP: ComplianceLab ---
  if (currentApp === 'compliance') {
    return (
      <AppErrorBoundary appName="ComplianceLab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="ComplianceLab" />}>
          <ComplianceLabApp
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

  // --- RENDER APP: WebPerf Lab ---
  if (currentApp === 'webperf') {
    return (
      <AppErrorBoundary appName="WebPerf Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="WebPerf Lab" />}>
          <WebPerfLabApp
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

  // --- RENDER APP: ThreatModeling Lab ---
  if (currentApp === 'threatmodel') {
    return (
      <AppErrorBoundary appName="ThreatModeling Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="ThreatModeling Lab" />}>
          <ThreatModelingApp
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

  // --- RENDER APP: GitFlow Lab ---
  if (currentApp === 'gitflow') {
    return (
      <AppErrorBoundary appName="GitFlow Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="GitFlow Lab" />}>
          <GitFlowApp
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

  // --- RENDER APP: MindShield Lab ---
  if (currentApp === 'mindshield') {
    return (
      <AppErrorBoundary appName="MindShield Lab" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="MindShield Lab" />}>
          <MindShieldApp
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

  // --- RENDER APP: ZenFocus ---
  if (currentApp === 'zenfocus') {
    return (
      <AppErrorBoundary appName="ZenFocus" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="ZenFocus" />}>
          <ZenFocusApp
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

        // --- RENDER APP: MediCore Pro ---
      if (currentApp === 'medicore') {
        return (
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <AppErrorBoundary appName="MediCore Pro" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="MediCore Pro" />}>
                <MediCoreApp />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: UPSC CSE Civil Services Navigator ---
      if (currentApp === 'upsc') {
        return (
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <AppErrorBoundary appName="UPSC CSE Prep" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="UPSC CSE Prep" />}>
                <UpscMasterApp
                  onBackToBca={handleReturnToBca}
                  onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
                  onSwitchApp={(appId) => handleSelectApp(appId as CurrentAppType)}
                />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: SvaraPulse Musicology Studio ---
      if (currentApp === 'music') {
        return (
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <AppErrorBoundary appName="SvaraPulse Music" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="SvaraPulse Music" />}>
                <MusicMasterApp
                  onBackToBca={handleReturnToBca}
                  onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
                  onSwitchApp={(appId) => handleSelectApp(appId as CurrentAppType)}
                />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: TechNagar Chronicles ---
      if (currentApp === 'technagar') {
        return (
          <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
            <AppErrorBoundary appName="TechNagar Chronicles" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="TechNagar Chronicles" />}>
                <TechNagarApp
                  onBackToBca={handleReturnToBca}
                  onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
                  onSwitchApp={(appId) => handleSelectApp(appId as CurrentAppType)}
                />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
              <TechNavigatorModal
                isOpen={isNavigatorOpen}
                onClose={() => setIsNavigatorOpen(false)}
                onSelectItem={(item) => {
                  setIsNavigatorOpen(false);
                  if (item.appTarget === 'bca') {
                    handleReturnToBca();
                    if (item.tabTarget) setActiveTab(item.tabTarget as any);
                  } else {
                    handleSelectApp(item.appTarget);
                    if (item.hashTarget) window.location.hash = item.hashTarget;
                  }
                }}
              />
              <StealthModeOverlay
                isActive={isStealthActive}
                onExitStealth={() => setIsStealthActive(false)}
              />
              <ProjectXModal
                isOpen={isProjectXModalOpen}
                onClose={() => setIsProjectXModalOpen(false)}
                onUnlocked={() => {
                  setIsProjectXModalOpen(false);
                  handleSelectApp('projectx' as CurrentAppType);
                  window.location.hash = '#projectx';
                }}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: Feynman AI Mastery Lab ---
      if (currentApp === 'feynman') {
        return (
          <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col font-sans">
            <AppErrorBoundary appName="Feynman Mastery Lab" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="Feynman Mastery Lab" />}>
                <FeynmanSimulatorApp
                  onBackToHub={handleReturnToBca}
                  onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
                  onSwitchApp={(appId) => handleSelectApp(appId as CurrentAppType)}
                />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
              <TechNavigatorModal
                isOpen={isNavigatorOpen}
                onClose={() => setIsNavigatorOpen(false)}
                onSelectItem={(item) => {
                  setIsNavigatorOpen(false);
                  if (item.appTarget === 'bca') {
                    handleReturnToBca();
                    if (item.tabTarget) setActiveTab(item.tabTarget as any);
                  } else {
                    handleSelectApp(item.appTarget);
                    if (item.hashTarget) window.location.hash = item.hashTarget;
                  }
                }}
              />
              <StealthModeOverlay
                isActive={isStealthActive}
                onExitStealth={() => setIsStealthActive(false)}
              />
              <ProjectXModal
                isOpen={isProjectXModalOpen}
                onClose={() => setIsProjectXModalOpen(false)}
                onUnlocked={() => {
                  setIsProjectXModalOpen(false);
                  handleSelectApp('projectx' as CurrentAppType);
                  window.location.hash = '#projectx';
                }}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: NeuroNet Second Brain ---
      if (currentApp === 'brain') {
        return (
          <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans">
            <AppErrorBoundary appName="NeuroNet Second Brain" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="NeuroNet Knowledge Graph" />}>
                <NeuroNetApp
                  onBackToHub={handleReturnToBca}
                  onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
                  onSwitchApp={(appId) => handleSelectApp(appId as CurrentAppType)}
                />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
              <TechNavigatorModal
                isOpen={isNavigatorOpen}
                onClose={() => setIsNavigatorOpen(false)}
                onSelectItem={(item) => {
                  setIsNavigatorOpen(false);
                  if (item.appTarget === 'bca') {
                    handleReturnToBca();
                    if (item.tabTarget) setActiveTab(item.tabTarget as any);
                  } else {
                    handleSelectApp(item.appTarget);
                    if (item.hashTarget) window.location.hash = item.hashTarget;
                  }
                }}
              />
              <StealthModeOverlay
                isActive={isStealthActive}
                onExitStealth={() => setIsStealthActive(false)}
              />
              <ProjectXModal
                isOpen={isProjectXModalOpen}
                onClose={() => setIsProjectXModalOpen(false)}
                onUnlocked={() => {
                  setIsProjectXModalOpen(false);
                  handleSelectApp('projectx' as CurrentAppType);
                  window.location.hash = '#projectx';
                }}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: One-Click Portfolio ---
      if (currentApp === 'portfolio') {
        return (
          <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans">
            <AppErrorBoundary appName="My Portfolio" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="My Portfolio" />}>
                <PortfolioApp
                  onBackToHub={handleReturnToBca}
                  onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
                />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
              <TechNavigatorModal
                isOpen={isNavigatorOpen}
                onClose={() => setIsNavigatorOpen(false)}
                onSelectItem={(item) => {
                  setIsNavigatorOpen(false);
                  if (item.appTarget === 'bca') {
                    handleReturnToBca();
                    if (item.tabTarget) setActiveTab(item.tabTarget as any);
                  } else {
                    handleSelectApp(item.appTarget);
                    if (item.hashTarget) window.location.hash = item.hashTarget;
                  }
                }}
              />
              <StealthModeOverlay
                isActive={isStealthActive}
                onExitStealth={() => setIsStealthActive(false)}
              />
              <ProjectXModal
                isOpen={isProjectXModalOpen}
                onClose={() => setIsProjectXModalOpen(false)}
                onUnlocked={() => {
                  setIsProjectXModalOpen(false);
                  handleSelectApp('projectx' as CurrentAppType);
                  window.location.hash = '#projectx';
                }}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: Project-X Secret Cyber Lab ---
      if (currentApp === 'projectx') {
        return (
          <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col">
            <AppErrorBoundary appName="Project-X Cyber Lab" onReset={handleReturnToBca}>
              <Suspense fallback={<AppLoadingSpinner appName="Project-X Cyber Lab" />}>
                <ProjectXApp
                  onBackToHub={handleReturnToBca}
                  onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
                />
              </Suspense>
              <AppSwitcherModal
                isOpen={isAppSwitcherOpen}
                onClose={() => setIsAppSwitcherOpen(false)}
                currentApp={currentApp}
                onSelectApp={(appId) => handleSelectApp(appId as CurrentAppType)}
              />
              <TechNavigatorModal
                isOpen={isNavigatorOpen}
                onClose={() => setIsNavigatorOpen(false)}
                onSelectItem={(item) => {
                  setIsNavigatorOpen(false);
                  if (item.appTarget === 'bca') {
                    handleReturnToBca();
                    if (item.tabTarget) setActiveTab(item.tabTarget as any);
                  } else {
                    handleSelectApp(item.appTarget);
                    if (item.hashTarget) window.location.hash = item.hashTarget;
                  }
                }}
              />
              <StealthModeOverlay
                isActive={isStealthActive}
                onExitStealth={() => setIsStealthActive(false)}
              />
            </AppErrorBoundary>
          </div>
        );
      }

      // --- RENDER APP: VisualAtlas ---
  if (currentApp === 'atlas') {
    return (
      <AppErrorBoundary appName="VisualAtlas" onReset={handleReturnToBca}>
        <Suspense fallback={<AppLoadingSpinner appName="VisualAtlas" />}>
          <VisualAtlasApp
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
        onOpenNavigator={() => setIsNavigatorOpen(true)}
        onToggleStealth={() => setIsStealthActive((prev) => !prev)}
        onOpenProjectX={() => setIsProjectXModalOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onSelectApp={handleSelectApp}
        onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
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
            onSelectApp={handleSelectApp}
            onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
            onOpenRoadmap={() => {
              if (typeof window !== 'undefined') window.location.hash = '#roadmap';
              handleSelectApp('roadmap');
            }}
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

      {/* 46-Apps Suite Switcher Modal */}
      <AppSwitcherModal
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        currentApp={currentApp}
        onSelectApp={handleSelectApp}
      />

      {/* TechNavigator Command Palette (Ctrl+K) */}
      <TechNavigatorModal
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        onSelectItem={(item) => {
          setIsNavigatorOpen(false);
          if (item.appTarget === 'bca') {
            handleReturnToBca();
            if (item.tabTarget) setActiveTab(item.tabTarget as any);
          } else {
            handleSelectApp(item.appTarget);
            if (item.hashTarget) window.location.hash = item.hashTarget;
          }
        }}
      />

      {/* Stealth Mode Panic Button Overlay (Shift+Esc) */}
      <StealthModeOverlay
        isActive={isStealthActive}
        onExitStealth={() => setIsStealthActive(false)}
      />

      {/* Project-X 3-Cipher Hidden Vault Modal */}
      <ProjectXModal
        isOpen={isProjectXModalOpen}
        onClose={() => setIsProjectXModalOpen(false)}
        onUnlocked={() => {
          setIsProjectXModalOpen(false);
          handleSelectApp('projectx' as CurrentAppType);
          window.location.hash = '#projectx';
        }}
      />

      {/* OS Navigation Sidebar Drawer */}
      <OsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectApp={handleSelectApp}
        currentApp={currentApp}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPortfolio={() => {
          handleSelectApp('portfolio' as CurrentAppType);
          window.location.hash = '#portfolio';
        }}
        onToggleStealth={() => setIsStealthActive((prev) => !prev)}
      />

      {/* J.A.R.V.I.S. AGI AI Assistant & Action Engine */}
      <JarvisAiAssistant
        currentApp={currentApp}
        onNavigateApp={(appId: string) => handleSelectApp(appId as CurrentAppType)}
        onStartQuiz={(trackId?: string) => {
          handleSelectApp('exam');
        }}
        onToggleTheme={toggleTheme}
        onOpenRoadmap={() => {
          if (typeof window !== 'undefined') window.location.hash = '#roadmap';
          handleSelectApp('roadmap');
        }}
      />

      {/* Gamification Profile Dashboard 2.0 Modal */}
      {isProfileModalOpen && (
        <ProfileDashboardModal
          onClose={() => setIsProfileModalOpen(false)}
          onViewCertificate={(cert: EarnedCertificate) => setActiveCertificate(cert)}
          onOpenSkillTree={() => {
            setIsProfileModalOpen(false);
            handleSelectApp('skilltree');
          }}
        />
      )}

      {/* Verified Digital Certificate Modal */}
      {activeCertificate && (
        <CertificateGenerator
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Final Boss Exam Engine Modal */}
      {activeExamTrack && (
        <FinalBossExamEngine
          examId={activeExamTrack.id}
          examTitle={activeExamTrack.title}
          category={activeExamTrack.category}
          passingScore={activeExamTrack.passingScore}
          durationMinutes={activeExamTrack.durationMinutes}
          xpReward={activeExamTrack.xpReward}
          badgeReward={activeExamTrack.badgeReward}
          questions={activeExamTrack.questions}
          onClose={() => setActiveExamTrack(null)}
          onPassed={(cert: EarnedCertificate) => {
            setActiveCertificate(cert);
          }}
        />
      )}

      {/* Android Double-Back to Exit Toast */}
      {showExitToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-cyan-500/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce-slow pointer-events-none select-none">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Press back again to exit / Dubara dabayein bahar jane ke liye</span>
        </div>
      )}
    </div>
  );
}
