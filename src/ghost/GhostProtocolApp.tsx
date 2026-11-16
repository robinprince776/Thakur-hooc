import React, { Suspense, useState } from 'react';
import {
  ArrowLeft,
  Menu,
  X,
  Shield,
  CheckCircle2,
  Grid,
  Bot,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GhostModuleId, useGhostStore } from '../store/useGhostStore';
import { GHOST_MODULES } from './ghostModulesMeta';
import { GhostMentorDrawer } from './components/GhostMentorDrawer';

// Lazy-load all 14 Core Ghost Protocol Modules for zero initial bundle lag
const CommandCenterModule = React.lazy(() =>
  import('./modules/CommandCenterModule').then((m) => ({ default: m.CommandCenterModule }))
);
const CyberAcademyModule = React.lazy(() =>
  import('./modules/CyberAcademyModule').then((m) => ({ default: m.CyberAcademyModule }))
);
const MissionControlModule = React.lazy(() =>
  import('./modules/MissionControlModule').then((m) => ({ default: m.MissionControlModule }))
);
const VirtualCyberRangeModule = React.lazy(() =>
  import('./modules/VirtualCyberRangeModule').then((m) => ({ default: m.VirtualCyberRangeModule }))
);
const TerminalStudioModule = React.lazy(() =>
  import('./modules/TerminalStudioModule').then((m) => ({ default: m.TerminalStudioModule }))
);
const NetworkIntelModule = React.lazy(() =>
  import('./modules/NetworkIntelModule').then((m) => ({ default: m.NetworkIntelModule }))
);
const WebSecurityModule = React.lazy(() =>
  import('./modules/WebSecurityModule').then((m) => ({ default: m.WebSecurityModule }))
);
const DigitalForensicsModule = React.lazy(() =>
  import('./modules/DigitalForensicsModule').then((m) => ({ default: m.DigitalForensicsModule }))
);
const ThreatIntelModule = React.lazy(() =>
  import('./modules/ThreatIntelModule').then((m) => ({ default: m.ThreatIntelModule }))
);
const SocOperationsModule = React.lazy(() =>
  import('./modules/SocOperationsModule').then((m) => ({ default: m.SocOperationsModule }))
);
const AiSecurityModule = React.lazy(() =>
  import('./modules/AiSecurityModule').then((m) => ({ default: m.AiSecurityModule }))
);
const KnowledgeVaultModule = React.lazy(() =>
  import('./modules/KnowledgeVaultModule').then((m) => ({ default: m.KnowledgeVaultModule }))
);
const SkillProgressionModule = React.lazy(() =>
  import('./modules/SkillProgressionModule').then((m) => ({ default: m.SkillProgressionModule }))
);
const ProjectPortfolioModule = React.lazy(() =>
  import('./modules/ProjectPortfolioModule').then((m) => ({ default: m.ProjectPortfolioModule }))
);

interface GhostProtocolAppProps {
  onBackToBca: () => void;
  onOpenAppSwitcher?: () => void;
}

const CATEGORIES = [
  'Core Operations',
  'Hands-On Labs',
  'Threat & Defense',
  'Knowledge & Career',
] as const;

export const GhostProtocolApp: React.FC<GhostProtocolAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const activeModuleId = useGhostStore((s) => s.activeModuleId);
  const setActiveModule = useGhostStore((s) => s.setActiveModule);
  const completedModules = useGhostStore((s) => s.completedModules);
  const xp = useGhostStore((s) => s.xp);
  const rankTitle = useGhostStore((s) => s.rankTitle);
  const threatLevel = useGhostStore((s) => s.threatLevel);
  const sandboxNonce = useGhostStore((s) => s.sandboxNonce);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [ghostMentorOpen, setGhostMentorOpen] = useState(false);
  const [navQuery, setNavQuery] = useState('');

  const activeIndex = Math.max(0, GHOST_MODULES.findIndex((m) => m.id === activeModuleId));
  const activeMeta = GHOST_MODULES[activeIndex] || GHOST_MODULES[0];
  const prevModule = activeIndex > 0 ? GHOST_MODULES[activeIndex - 1] : null;
  const nextModule = activeIndex < GHOST_MODULES.length - 1 ? GHOST_MODULES[activeIndex + 1] : null;

  const handleSelectModule = (id: GhostModuleId) => {
    setActiveModule(id);
    setMobileNavOpen(false);
  };

  const renderActiveModule = () => {
    switch (activeModuleId) {
      case 'command':
        return <CommandCenterModule key={`cmd-${sandboxNonce}`} />;
      case 'academy':
        return <CyberAcademyModule key={`aca-${sandboxNonce}`} />;
      case 'missions':
        return <MissionControlModule key={`mis-${sandboxNonce}`} />;
      case 'range':
        return <VirtualCyberRangeModule key={`rng-${sandboxNonce}`} />;
      case 'terminal':
        return <TerminalStudioModule key={`trm-${sandboxNonce}`} />;
      case 'network':
        return <NetworkIntelModule key={`net-${sandboxNonce}`} />;
      case 'websec':
        return <WebSecurityModule key={`web-${sandboxNonce}`} />;
      case 'forensics':
        return <DigitalForensicsModule key={`for-${sandboxNonce}`} />;
      case 'threatintel':
        return <ThreatIntelModule key={`thr-${sandboxNonce}`} />;
      case 'soc':
        return <SocOperationsModule key={`soc-${sandboxNonce}`} />;
      case 'aisec':
        return <AiSecurityModule key={`ais-${sandboxNonce}`} />;
      case 'vault':
        return <KnowledgeVaultModule key={`vlt-${sandboxNonce}`} />;
      case 'progression':
        return <SkillProgressionModule key={`prg-${sandboxNonce}`} />;
      case 'portfolio':
        return <ProjectPortfolioModule key={`prt-${sandboxNonce}`} />;
      default:
        return <CommandCenterModule />;
    }
  };

  const normalizedQuery = navQuery.trim().toLowerCase();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080C15] border-r border-slate-800/90">
      {/* Brand Block */}
      <div className="p-4 border-b border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/40 flex items-center justify-center text-[#00FF41] shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white tracking-tight truncate">
              GHOST PROTOCOL
            </div>
            <div className="text-[11px] font-ghost-mono text-[#00E5FF] truncate">
              Hub 6 · Intelligence OS
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Operator Summary */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-[#0B101C] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Clearance ({completedModules.length}/14)</span>
          <span className="font-ghost-mono font-semibold text-[#00FF41] tabular-nums">{xp} XP</span>
        </div>
        <div className="text-xs font-medium text-slate-200 truncate">{rankTitle}</div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={navQuery}
            onChange={(e) => setNavQuery(e.target.value)}
            placeholder="Filter 14 modules..."
            className="w-full pl-8 pr-2.5 py-1.5 rounded-md bg-[#060910] border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#00E5FF]"
          />
        </div>
      </div>

      {/* 14 Modules List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {CATEGORIES.map((cat) => {
          const items = GHOST_MODULES.filter(
            (m) =>
              m.category === cat &&
              (!normalizedQuery ||
                m.shortTitle.toLowerCase().includes(normalizedQuery) ||
                m.title.toLowerCase().includes(normalizedQuery) ||
                m.num.includes(normalizedQuery))
          );
          if (items.length === 0) return null;
          return (
            <div key={cat} className="space-y-1">
              <div className="px-2.5 text-[11px] font-medium text-slate-500">
                {cat}
              </div>
              {items.map((mod) => {
                const isActive = mod.id === activeModuleId;
                const isDone = completedModules.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => handleSelectModule(mod.id)}
                    className={`w-full text-left px-3 py-2.5 min-h-[42px] rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/40 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-ghost-mono opacity-75 mr-1.5">{mod.num}.</span>
                      <span>{mod.shortTitle}</span>
                    </span>
                    {isDone && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF41] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom Exit */}
      <div className="p-3 border-t border-slate-800/90">
        <button
          type="button"
          onClick={onBackToBca}
          className="w-full py-2.5 px-3 min-h-[44px] rounded-lg border border-slate-700 bg-slate-900/90 hover:border-[#00E5FF]/50 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#00E5FF]" />
          <span>Return to BCA Verse OS</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ghost-matrix-grid text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Clean Top Bar (3-zone workspace header) */}
        <header className="sticky top-0 z-30 h-14 px-4 sm:px-6 bg-[#0A0E17]/90 backdrop-blur-md border-b border-slate-800/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 min-h-[40px] min-w-[40px] rounded-lg border border-slate-800 bg-slate-900 text-slate-200 flex items-center justify-center cursor-pointer"
              aria-label="Open module menu"
            >
              <Menu className="w-4 h-4 text-[#00E5FF]" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0 truncate">
              <span className="font-semibold text-white whitespace-nowrap">Ghost Protocol</span>
              <span className="text-slate-600">/</span>
              <span className="font-ghost-mono text-[#00E5FF] truncate">
                {activeMeta.num}. {activeMeta.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline-block text-xs font-ghost-mono text-slate-400 mr-2">
              Threat: <strong className={threatLevel === 'CRITICAL' ? 'text-[#FF003C]' : 'text-[#00FF41]'}>{threatLevel}</strong>
            </span>

            {onOpenAppSwitcher && (
              <button
                type="button"
                onClick={onOpenAppSwitcher}
                className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-slate-700 bg-slate-900 hover:border-slate-600 text-xs font-medium text-slate-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Grid className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="hidden sm:inline">Switch Hub</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setGhostMentorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg bg-[#00FF41] hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Ask GHOST</span>
            </button>
          </div>
        </header>

        {/* Active Lazy-Loaded Module Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto space-y-6">
          <Suspense
            fallback={
              <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-8 text-center font-ghost-mono text-xs text-[#00E5FF]">
                Initializing sandbox module...
              </div>
            }
          >
            {renderActiveModule()}
          </Suspense>

          {/* Sequential Module Stepper */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {prevModule ? (
              <button
                type="button"
                onClick={() => handleSelectModule(prevModule.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg border border-slate-800 bg-[#0D1322] hover:border-[#00E5FF]/50 text-xs font-medium text-slate-200 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[#00E5FF]" />
                <span className="truncate">
                  {prevModule.num}. {prevModule.shortTitle}
                </span>
              </button>
            ) : (
              <div />
            )}

            <span className="hidden sm:inline text-[11px] font-ghost-mono text-slate-500">
              Module {activeMeta.num} of 14
            </span>

            {nextModule ? (
              <button
                type="button"
                onClick={() => handleSelectModule(nextModule.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg border border-slate-800 bg-[#0D1322] hover:border-[#00FF41]/50 text-xs font-medium text-slate-200 cursor-pointer"
              >
                <span className="truncate">
                  {nextModule.num}. {nextModule.shortTitle}
                </span>
                <ChevronRight className="w-4 h-4 text-[#00FF41]" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>

      {/* GHOST AI Defensive Mentor Drawer */}
      <GhostMentorDrawer
        isOpen={ghostMentorOpen}
        onClose={() => setGhostMentorOpen(false)}
        activeModuleId={activeModuleId}
      />
    </div>
  );
};
