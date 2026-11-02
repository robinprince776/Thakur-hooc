import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Server,
  Database,
  Lock,
  Unlock,
  Radio,
  Clock,
  Sparkles,
  Download,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  RANSOMWARE_STAGES,
  THREAT_GROUP_PROFILES,
  RansomwareStage
} from '../data/ransomwareMitreData';

interface RansomwareTimelineOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RansomwareTimelineOverlay: React.FC<RansomwareTimelineOverlayProps> = ({
  isOpen,
  onClose
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(2500); // ms per stage
  const [selectedThreatGroup, setSelectedThreatGroup] = useState<string>('LockBit 3.0 (Black)');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Containment Simulation State
  const [containedAtStage, setContainedAtStage] = useState<number | null>(null);
  const [containmentResult, setContainmentResult] = useState<string | null>(null);

  const activeStage: RansomwareStage = RANSOMWARE_STAGES[currentStageIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStageIndex((prev) => {
          if (prev >= RANSOMWARE_STAGES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen, playSpeed]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentStageIndex((prev) => Math.min(prev + 1, RANSOMWARE_STAGES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStageIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const triggerContainment = () => {
    setIsPlaying(false);
    setContainedAtStage(currentStageIndex);
    const success = Math.random() * 100 <= activeStage.containmentAction.effectivenessPercentage;
    if (success) {
      setContainmentResult(
        `SUCCESS (${activeStage.containmentAction.effectivenessPercentage}% Probability): ${activeStage.containmentAction.successMessage}`
      );
    } else {
      setContainmentResult(
        `PARTIAL BREACH: Attacker detected containment probe and initiated fallback secondary C2 channels. Escalate immediately!`
      );
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentStageIndex(0);
    setContainedAtStage(null);
    setContainmentResult(null);
  };

  // Node highlighting status for interactive SVG network map
  const getNodeCompromisedLevel = (node: string) => {
    const order = ['perimeter', 'workstation', 'domain_controller', 'database_server', 'backup_server'];
    const currentTargetIndex = order.indexOf(activeStage.targetNode);
    const nodeIndex = order.indexOf(node);

    if (containedAtStage !== null && currentStageIndex <= containedAtStage) {
      if (nodeIndex === currentTargetIndex) return 'contained';
    }
    if (nodeIndex < currentTargetIndex) return 'compromised';
    if (nodeIndex === currentTargetIndex) return 'active_target';
    return 'clean';
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-lg animate-fade-in font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#0B1120] border border-rose-500/30 rounded-3xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 text-slate-100 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-7xl max-h-[94vh]'
        }`}
      >
        {/* ===================================================================== */}
        {/* TOP BAR / CONTROLS */}
        {/* ===================================================================== */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border-b border-slate-800 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white">
                  Ransomware Attack Kill Chain
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                  MITRE ATT&amp;CK Mapping
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Interactive 48-Hour Enterprise Attack Timeline &amp; Defensive Matrix
              </p>
            </div>
          </div>

          {/* Quick Actions & Overlay Controls */}
          <div className="flex items-center gap-2">
            {/* Threat Group Selector */}
            <div className="hidden md:flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[11px]">Variant:</span>
              <select
                value={selectedThreatGroup}
                onChange={(e) => setSelectedThreatGroup(e.target.value)}
                className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                {THREAT_GROUP_PROFILES.map((g) => (
                  <option key={g.name} value={g.name} className="bg-slate-900 text-slate-200">
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE TIMELINE SCRUBBER TRACK */}
        {/* ===================================================================== */}
        <div className="bg-black/60 border-b border-slate-800/80 p-4 shrink-0 overflow-x-auto scrollbar-thin">
          <div className="min-w-[780px]">
            {/* Timeline Playback Controls & Progress Bar */}
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause Attack' : 'Auto Play Attack'}</span>
                </button>

                <button
                  onClick={resetSimulation}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                  title="Reset to Day 0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <span className="text-slate-500 text-xs">|</span>

                <span className="text-slate-400">
                  Speed:
                </span>
                {[
                  { label: '1x', val: 3000 },
                  { label: '2x', val: 1800 },
                  { label: '3x', val: 1000 }
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setPlaySpeed(s.val)}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      playSpeed === s.val ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs">
                  Elapsed Incident Time:{' '}
                  <strong className="text-amber-400 font-bold">{activeStage.timelineOffset}</strong>
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  Phase {activeStage.stageNumber} of 8: {activeStage.phaseCategory}
                </span>
              </div>
            </div>

            {/* Stepper Nodes */}
            <div className="relative flex items-center justify-between pt-2 pb-1">
              {/* Background Connecting Line */}
              <div className="absolute left-6 right-6 top-5 h-1 bg-slate-800 -z-0">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 transition-all duration-300"
                  style={{ width: `${(currentStageIndex / (RANSOMWARE_STAGES.length - 1)) * 100}%` }}
                />
              </div>

              {RANSOMWARE_STAGES.map((stage, idx) => {
                const isActive = idx === currentStageIndex;
                const isPassed = idx < currentStageIndex;

                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setCurrentStageIndex(idx);
                      setIsPlaying(false);
                    }}
                    className="relative z-10 flex flex-col items-center group focus:outline-none"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold transition-all ${
                        isActive
                          ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 scale-125 shadow-lg shadow-rose-950'
                          : isPassed
                          ? 'bg-amber-500 text-black font-extrabold'
                          : 'bg-slate-900 border border-slate-700 text-slate-400 group-hover:border-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Stage Label Below */}
                    <div className="mt-2 text-center">
                      <div
                        className={`text-[10px] font-mono font-bold whitespace-nowrap transition-colors ${
                          isActive ? 'text-rose-400' : isPassed ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {stage.mitreTactic.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">
                        {stage.timelineOffset.split(' ')[0]} {stage.timelineOffset.split(' ')[1]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MAIN BODY: 2-COLUMN LAYOUT (Topological Visualizer + MITRE Dossier) */}
        {/* ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top Banner: Stage Overview & MITRE Tactic Details */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0B1528] to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  STAGE {activeStage.stageNumber}: {activeStage.mitreTactic.id} ({activeStage.mitreTactic.name})
                </span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Timeline: {activeStage.timelineOffset}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    activeStage.severity === 'Critical'
                      ? 'bg-rose-900/60 text-rose-300 border border-rose-600'
                      : 'bg-amber-900/40 text-amber-300 border border-amber-600/50'
                  }`}
                >
                  Threat Severity: {activeStage.severity}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
                {activeStage.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {activeStage.shortDescription}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
              <button
                disabled={currentStageIndex === 0}
                onClick={() => setCurrentStageIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-mono flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                disabled={currentStageIndex === RANSOMWARE_STAGES.length - 1}
                onClick={() => setCurrentStageIndex((prev) => Math.min(RANSOMWARE_STAGES.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-lg shadow-rose-950"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* INTERACTIVE NETWORK ATTACK TOPOLOGY (Visual Attack Map) */}
          {/* =================================================================== */}
          <div className="bg-[#070D1B] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <h3 className="font-mono font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                  Live Attack Topology &amp; Lateral Spread Map
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Clean Node
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block animate-pulse" /> Active Breach
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Compromised / Encrypted
                </span>
              </div>
            </div>

            {/* Topology Visual Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {[
                {
                  id: 'perimeter',
                  label: 'Edge Gateway / VPN',
                  ip: '198.51.100.25 (FortiGate SSL)',
                  icon: Radio,
                  tag: 'Perimeter'
                },
                {
                  id: 'workstation',
                  label: 'Finance Workstation',
                  ip: '10.0.4.112 (Windows 11)',
                  icon: Terminal,
                  tag: 'Foothold'
                },
                {
                  id: 'domain_controller',
                  label: 'Primary Domain Controller',
                  ip: '10.0.0.10 (DC01.corp.local)',
                  icon: Server,
                  tag: 'Active Directory'
                },
                {
                  id: 'database_server',
                  label: 'ERP & SQL Database',
                  ip: '10.0.2.45 (MSSQL Clusters)',
                  icon: Database,
                  tag: 'Core Assets'
                },
                {
                  id: 'backup_server',
                  label: 'Backup & VM Storage',
                  ip: '10.0.99.15 (Veeam / ESXi)',
                  icon: Lock,
                  tag: 'Recovery Vault'
                }
              ].map((node) => {
                const status = getNodeCompromisedLevel(node.id);
                const IconComponent = node.icon;

                return (
                  <div
                    key={node.id}
                    className={`p-3.5 rounded-xl border font-mono transition-all relative overflow-hidden ${
                      status === 'active_target'
                        ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/40 shadow-xl'
                        : status === 'compromised'
                        ? 'bg-rose-950/20 border-rose-700/60 text-slate-300'
                        : status === 'contained'
                        ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300'
                        : 'bg-black/50 border-slate-800 text-slate-400 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {node.tag}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          status === 'active_target'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : status === 'compromised'
                            ? 'bg-rose-900/60 text-rose-300'
                            : status === 'contained'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {status === 'active_target'
                          ? 'ATTACKING NOW'
                          : status === 'compromised'
                          ? 'COMPROMISED'
                          : status === 'contained'
                          ? 'ISOLATED'
                          : 'SECURE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <IconComponent
                        className={`w-4 h-4 ${
                          status === 'active_target'
                            ? 'text-rose-400 animate-bounce'
                            : status === 'compromised'
                            ? 'text-rose-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="font-bold text-xs text-white truncate">{node.label}</span>
                    </div>

                    <div className="text-[10px] text-cyan-400/90 truncate">{node.ip}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================================== */}
          {/* 2-COLUMN SECTION: (1) MITRE TECHNIQUES & ATTACKER PROCEDURES (2) BLUE TEAM TELEMETRY */}
          {/* =================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: MITRE ATT&CK Mapping & Red Team Procedures */}
            <div className="lg:col-span-7 space-y-5">
              {/* MITRE ATT&CK Techniques List */}
              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                      Mapped MITRE ATT&amp;CK Techniques ({activeStage.mitreTechniques.length})
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Enterprise Matrix v14</span>
                </div>

                <div className="space-y-2.5">
                  {activeStage.mitreTechniques.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-3 bg-black/50 border border-slate-800/80 rounded-xl space-y-1.5 hover:border-cyan-500/40 transition-all font-mono"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                            {tech.id}
                          </span>
                          <span className="font-bold text-xs text-white">{tech.name}</span>
                          {tech.subtechnique && (
                            <span className="text-[10px] text-slate-400">({tech.subtechnique})</span>
                          )}
                        </div>
                        <a
                          href={tech.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <span>MITRE Doc</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {tech.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Team Attack Procedures & Code Artifacts */}
              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-rose-400" />
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                      Red Team Attack Procedures &amp; Live CLI Artifacts
                    </h3>
                  </div>
                  <span className="text-[10px] text-rose-400">Adversary Emulation</span>
                </div>

                <div className="space-y-3">
                  {activeStage.attackerProcedures.map((proc, pIdx) => (
                    <div key={pIdx} className="space-y-1.5 bg-black/70 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-amber-300">{proc.commandOrTool}</span>
                        <button
                          onClick={() => handleCopy(proc.sampleSnippet, `cmd_${pIdx}`)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-all"
                        >
                          {copiedKey === `cmd_${pIdx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy CLI</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans">{proc.purpose}</p>
                      <div className="bg-black/90 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-rose-300 overflow-x-auto whitespace-pre-wrap">
                        {proc.sampleSnippet}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real World Threat Group Incident Case */}
              <div className="bg-gradient-to-r from-slate-900 to-[#120E1E] border border-purple-900/40 rounded-2xl p-4 text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <Info className="w-4 h-4" />
                  <span>Real-World Forensic Precedent ({activeStage.realWorldExample.gang}):</span>
                </div>
                <div className="text-slate-200 font-bold text-xs">{activeStage.realWorldExample.incident}</div>
                <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                  {activeStage.realWorldExample.detail}
                </p>
              </div>
            </div>

            {/* Right 5 Columns: Blue Team Detection, Telemetry & Incident Containment */}
            <div className="lg:col-span-5 space-y-5">
              {/* Blue Team SIEM & EDR Telemetry */}
              <div className="bg-[#0B1120] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                      Blue Team SIEM &amp; EDR Detection
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-400">Detection Engineering</span>
                </div>

                {/* EDR Alert Simulation Banner */}
                <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{activeStage.blueTeamTelemetry.edrAlertTitle}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    IoC: {activeStage.blueTeamTelemetry.indicatorOfCompromise}
                  </div>
                </div>

                {/* Windows Event IDs */}
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-bold">Windows Security Event IDs:</div>
                  <div className="space-y-1">
                    {activeStage.blueTeamTelemetry.windowsEventIds.map((ev, i) => (
                      <div key={i} className="text-[11px] bg-black/60 px-2.5 py-1 rounded border border-slate-800 text-cyan-300">
                        • {ev}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sysmon Events */}
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-bold">Sysmon Audit Rules:</div>
                  <div className="space-y-1">
                    {activeStage.blueTeamTelemetry.sysmonEvents.map((sy, i) => (
                      <div key={i} className="text-[11px] bg-black/60 px-2.5 py-1 rounded border border-slate-800 text-amber-300">
                        • {sy}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sigma Rule */}
                <div className="pt-1 flex items-center justify-between text-[11px] bg-black/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Detection Sigma Rule:</span>
                  <span className="text-emerald-300 font-bold truncate">{activeStage.blueTeamTelemetry.sigmaRule}</span>
                </div>
              </div>

              {/* Blue Team Containment Simulator Action Box */}
              <div className="bg-[#0B1528] border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                      Incident Response Containment Simulation
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {activeStage.containmentAction.effectivenessPercentage}% Success Rate
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-sm font-bold text-white">{activeStage.containmentAction.actionTitle}</div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {activeStage.containmentAction.description}
                  </p>

                  <div className="bg-black/60 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-400">
                    <strong className="text-amber-300">Operational Blast Radius: </strong>
                    {activeStage.containmentAction.blastRadius}
                  </div>
                </div>

                {/* Containment Trigger Button */}
                <button
                  onClick={triggerContainment}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span>Execute Defensive Containment Playbook</span>
                </button>

                {/* Containment Output Feedback */}
                {containmentResult && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs space-y-1 animate-fade-in font-sans">
                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Containment Assessment Result:</span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-relaxed">{containmentResult}</p>
                  </div>
                )}
              </div>

              {/* Threat Cartel Tactics Summary Card */}
              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>Cartel Profile: {selectedThreatGroup}</span>
                  <span className="text-rose-400 text-[10px]">RaaS Operational Model</span>
                </div>
                {(() => {
                  const prof = THREAT_GROUP_PROFILES.find((p) => p.name === selectedThreatGroup) || THREAT_GROUP_PROFILES[0];
                  return (
                    <div className="space-y-1.5 text-[11px] text-slate-400 font-sans">
                      <div>
                        <strong className="text-slate-300">Signature Tactics: </strong>
                        {prof.notableTactics}
                      </div>
                      <div>
                        <strong className="text-slate-300">Favored Tooling: </strong>
                        <span className="font-mono text-cyan-300">{prof.favoredTooling}</span>
                      </div>
                      <div>
                        <strong className="text-slate-300">Encryption Scheme: </strong>
                        <span className="font-mono text-amber-300">{prof.encryptionType}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* FOOTER */}
        {/* ===================================================================== */}
        <div className="bg-slate-950 border-t border-slate-800 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MITRE ATT&amp;CK Enterprise Matrix v14 Mapping Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const report = `# RANSOMWARE ATTACK TIMELINE & MITRE ATT&CK MAPPING REPORT
Generated for Case: ${selectedThreatGroup}
============================================================
${RANSOMWARE_STAGES.map(
  (s) => `[${s.timelineOffset}] STAGE ${s.stageNumber}: ${s.title}
Tactic: ${s.mitreTactic.id} - ${s.mitreTactic.name}
Techniques: ${s.mitreTechniques.map((t) => `${t.id} (${t.name})`).join(', ')}
Severity: ${s.severity} | Target Node: ${s.targetNode}
Primary Telemetry: ${s.blueTeamTelemetry.windowsEventIds.join('; ')}
Containment: ${s.containmentAction.actionTitle} (${s.containmentAction.effectivenessPercentage}% effectiveness)
`
).join('\n------------------------------------------------------------\n')}
============================================================`;
                handleCopy(report, 'full_report');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-all"
            >
              {copiedKey === 'full_report' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Report Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy MITRE Timeline Report</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all"
            >
              Close Overlay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
