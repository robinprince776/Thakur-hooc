import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Grid,
  Shield,
  Crosshair,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Timer,
  Lock,
  Wrench,
  Ban,
  Activity,
  Server,
} from 'lucide-react';
import { useGamificationStore } from '../store/useGamificationStore';
import { useTranslation } from '../store/useLanguageStore';

interface WarRoomAppProps {
  onBackToBca: () => void;
  onOpenAppSwitcher: () => void;
}

type TeamRole = 'blue' | 'red';
type SimPhase = 'briefing' | 'running' | 'debrief';
type NodeId = 'gateway' | 'firewall' | 'web' | 'auth' | 'api' | 'db';

type DefenseActionId =
  | 'firewall_block'
  | 'deploy_patch'
  | 'enforce_mfa'
  | 'rate_limit_waf'
  | 'isolate_snapshot';

interface NetworkNode {
  id: NodeId;
  label: string;
  ip: string;
  x: number;
  y: number;
  health: number;
  compromised: boolean;
  hardened: boolean;
}

interface SimulatedIncident {
  id: string;
  targetNode: NodeId;
  sourceNode: NodeId;
  vectorName: string;
  severity: 'High' | 'Critical';
  summary: string;
  correctDefense: DefenseActionId;
  spawnedAtElapsed: number;
}

interface EventLogEntry {
  id: string;
  time: string;
  tone: 'alert' | 'success' | 'info' | 'warning';
  text: string;
}

const INITIAL_NODES: NetworkNode[] = [
  { id: 'gateway', label: 'Internet Gateway', ip: '198.51.100.1', x: 110, y: 180, health: 100, compromised: false, hardened: false },
  { id: 'firewall', label: 'Edge Firewall', ip: '10.0.0.1', x: 270, y: 180, health: 100, compromised: false, hardened: false },
  { id: 'web', label: 'Web Portal', ip: '10.0.1.10', x: 455, y: 95, health: 100, compromised: false, hardened: false },
  { id: 'auth', label: 'Identity SSO', ip: '10.0.1.20', x: 455, y: 265, health: 100, compromised: false, hardened: false },
  { id: 'api', label: 'Core App API', ip: '10.0.2.30', x: 645, y: 180, health: 100, compromised: false, hardened: false },
  { id: 'db', label: 'Primary DB Vault', ip: '10.0.3.50', x: 815, y: 180, health: 100, compromised: false, hardened: false },
];

const NETWORK_EDGES: Array<{ from: NodeId; to: NodeId }> = [
  { from: 'gateway', to: 'firewall' },
  { from: 'firewall', to: 'web' },
  { from: 'firewall', to: 'auth' },
  { from: 'web', to: 'api' },
  { from: 'auth', to: 'api' },
  { from: 'api', to: 'db' },
];

const BLUE_DEFENSE_TOOLS: Array<{
  id: DefenseActionId;
  label: string;
  shortDesc: string;
  icon: any;
}> = [
  {
    id: 'firewall_block',
    label: 'Firewall Block Rule',
    shortDesc: 'Drop suspicious port sweeps & flood sources at edge',
    icon: Ban,
  },
  {
    id: 'deploy_patch',
    label: 'Deploy Hotfix Patch',
    shortDesc: 'Close vulnerable dependency or outdated service version',
    icon: Wrench,
  },
  {
    id: 'enforce_mfa',
    label: 'Enforce MFA & Revoke',
    shortDesc: 'Invalidate phished session tokens & require passkey',
    icon: Lock,
  },
  {
    id: 'rate_limit_waf',
    label: 'Enable WAF Rate Limit',
    shortDesc: 'Throttle anomalous API query bursts & strict schema checks',
    icon: Activity,
  },
  {
    id: 'isolate_snapshot',
    label: 'Isolate & Verify Backup',
    shortDesc: 'Quarantine lateral probe & verify immutable DB snapshot',
    icon: Server,
  },
];

const BLUE_SCENARIO_POOL: Array<Omit<SimulatedIncident, 'id' | 'spawnedAtElapsed'>> = [
  {
    targetNode: 'firewall',
    sourceNode: 'gateway',
    vectorName: 'Simulated Port Sweep',
    severity: 'High',
    summary: 'High-rate TCP SYN sweep probing exposed perimeter ports on Edge Firewall.',
    correctDefense: 'firewall_block',
  },
  {
    targetNode: 'auth',
    sourceNode: 'firewall',
    vectorName: 'Phishing Credential Replay',
    severity: 'Critical',
    summary: 'Unusual login attempts using a phished staff token targeting Identity SSO.',
    correctDefense: 'enforce_mfa',
  },
  {
    targetNode: 'web',
    sourceNode: 'firewall',
    vectorName: 'Unpatched Web Library Alert',
    severity: 'High',
    summary: 'Automated scanner flagged an outdated HTTP parser on Public Web Portal.',
    correctDefense: 'deploy_patch',
  },
  {
    targetNode: 'api',
    sourceNode: 'web',
    vectorName: 'Suspicious API Burst',
    severity: 'High',
    summary: 'Spike of malformed parameter requests hammering Core App API endpoints.',
    correctDefense: 'rate_limit_waf',
  },
  {
    targetNode: 'db',
    sourceNode: 'api',
    vectorName: 'Anomalous Lateral Access',
    severity: 'Critical',
    summary: 'Unexpected service account attempting bulk reads against Primary DB Vault.',
    correctDefense: 'isolate_snapshot',
  },
];

const RED_AUDIT_CHECKS: Array<{
  id: string;
  label: string;
  targetNode: NodeId;
  finding: string;
  blueDefenseLesson: string;
}> = [
  {
    id: 'audit_surface',
    label: 'Perimeter Exposure Audit',
    targetNode: 'firewall',
    finding: 'Identified an unneeded administrative port open on Edge Firewall.',
    blueDefenseLesson: 'Blue Team Fix: Restrict ingress rules with default-deny firewall policy.',
  },
  {
    id: 'audit_phish',
    label: 'Phishing Resilience Check',
    targetNode: 'auth',
    finding: 'Verified legacy password-only fallback was still enabled on Identity SSO.',
    blueDefenseLesson: 'Blue Team Fix: Enforce FIDO2/WebAuthn MFA and short-lived tokens.',
  },
  {
    id: 'audit_patch',
    label: 'Dependency Patch Audit',
    targetNode: 'web',
    finding: 'Detected outdated frontend/server package lacking security advisory patch.',
    blueDefenseLesson: 'Blue Team Fix: Enable automated SBOM checks & rapid hotfix deployment.',
  },
  {
    id: 'audit_api',
    label: 'API Rate-Limit Verification',
    targetNode: 'api',
    finding: 'Confirmed unthrottled burst traffic could degrade Core App API availability.',
    blueDefenseLesson: 'Blue Team Fix: Enforce per-IP token bucket limits & WAF validation.',
  },
  {
    id: 'audit_segment',
    label: 'Zero-Trust Segmentation Check',
    targetNode: 'db',
    finding: 'Verified overly broad east-west service permissions toward Primary DB Vault.',
    blueDefenseLesson: 'Blue Team Fix: Apply least-privilege RBAC and immutable offline backups.',
  },
];

const ROUND_SECONDS = 60;

export const WarRoomApp: React.FC<WarRoomAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { addXp, unlockBadge, xp } = useGamificationStore();

  const [role, setRole] = useState<TeamRole>('blue');
  const [phase, setPhase] = useState<SimPhase>('briefing');
  const [secondsLeft, setSecondsLeft] = useState<number>(ROUND_SECONDS);
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<NodeId>('firewall');
  const [activeIncidents, setActiveIncidents] = useState<SimulatedIncident[]>([]);
  const [logs, setLogs] = useState<EventLogEntry[]>([]);
  const [mitigatedCount, setMitigatedCount] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [completedRedAudits, setCompletedRedAudits] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [badgeAwarded, setBadgeAwarded] = useState(false);

  const elapsedRef = useRef<number>(0);
  const scenarioCursorRef = useRef<number>(0);

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const pushLog = (tone: EventLogEntry['tone'], text: string) => {
    const time = formatClock(Math.max(0, ROUND_SECONDS - elapsedRef.current));
    setLogs((prev) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, time, tone, text },
      ...prev.slice(0, 24),
    ]);
  };

  const startSimulation = (chosenRole: TeamRole) => {
    setRole(chosenRole);
    setPhase('running');
    setSecondsLeft(ROUND_SECONDS);
    setNodes(INITIAL_NODES.map((n) => ({ ...n })));
    setActiveIncidents([]);
    setLogs([]);
    setMitigatedCount(0);
    setWrongMoves(0);
    setResponseTimes([]);
    setCompletedRedAudits([]);
    setScore(0);
    setBadgeAwarded(false);
    elapsedRef.current = 0;
    scenarioCursorRef.current = 0;

    if (chosenRole === 'blue') {
      const first = BLUE_SCENARIO_POOL[0];
      scenarioCursorRef.current = 1;
      setSelectedNodeId(first.targetNode);
      setActiveIncidents([
        {
          ...first,
          id: `inc-init`,
          spawnedAtElapsed: 0,
        },
      ]);
      setLogs([
        {
          id: 'log-start',
          time: '01:00',
          tone: 'alert',
          text: `ALERT: ${first.vectorName} detected on ${first.targetNode.toUpperCase()}. Select the node and apply the right control.`,
        },
      ]);
    } else {
      setSelectedNodeId('firewall');
      setLogs([
        {
          id: 'log-red-start',
          time: '01:00',
          tone: 'info',
          text: 'Authorized Red Team Tabletop Audit started. Inspect nodes and uncover gaps before AI Blue Team hardens the network.',
        },
      ]);
    }
  };

  // Main 1-second simulation tick (zero-lag, clean teardown)
  useEffect(() => {
    if (phase !== 'running') return;

    const timer = window.setInterval(() => {
      elapsedRef.current += 1;
      const elapsed = elapsedRef.current;

      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setPhase('debrief');
          return 0;
        }
        return prev - 1;
      });

      if (role === 'blue') {
        // Spawn a new simulated incident every 9 seconds if fewer than 2 active
        if (elapsed % 9 === 0 && elapsed < ROUND_SECONDS - 4) {
          setActiveIncidents((curr) => {
            if (curr.length >= 2) return curr;
            const nextTemplate = BLUE_SCENARIO_POOL[scenarioCursorRef.current % BLUE_SCENARIO_POOL.length];
            scenarioCursorRef.current += 1;
            if (curr.some((c) => c.targetNode === nextTemplate.targetNode)) return curr;

            pushLog(
              'alert',
              `ALERT: ${nextTemplate.vectorName} targeting ${nextTemplate.targetNode.toUpperCase()} — ${nextTemplate.summary}`
            );
            return [
              ...curr,
              {
                ...nextTemplate,
                id: `inc-${elapsed}-${scenarioCursorRef.current}`,
                spawnedAtElapsed: elapsed,
              },
            ];
          });
        }

        // Apply integrity drain to nodes with active unmitigated incidents
        setActiveIncidents((currIncidents) => {
          if (currIncidents.length > 0) {
            const threatenedIds = new Set(currIncidents.map((i) => i.targetNode));
            setNodes((prevNodes) =>
              prevNodes.map((n) => {
                if (!threatenedIds.has(n.id)) return n;
                const nextHealth = Math.max(0, n.health - 4);
                return {
                  ...n,
                  health: nextHealth,
                  compromised: nextHealth <= 20,
                };
              })
            );
          }
          return currIncidents;
        });
      } else {
        // Red Team Mode: AI Blue Team SOC hardens one un-audited node every 11 seconds
        if (elapsed % 11 === 0 && elapsed < ROUND_SECONDS - 3) {
          setNodes((prevNodes) => {
            const target = prevNodes.find((n) => n.id !== 'gateway' && !n.hardened && !n.compromised);
            if (!target) return prevNodes;
            pushLog(
              'warning',
              `AI BLUE TEAM SOC hardened ${target.label} (${target.ip}) with automated policy updates.`
            );
            return prevNodes.map((n) => (n.id === target.id ? { ...n, hardened: true } : n));
          });
        }
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, role]);

  // Award XP & Badge cleanly when entering debrief
  useEffect(() => {
    if (phase !== 'debrief') return;
    const avgHealth = Math.round(nodes.reduce((acc, n) => acc + n.health, 0) / nodes.length);
    const earnedXp = role === 'blue' ? Math.max(60, mitigatedCount * 40) : Math.max(60, completedRedAudits.length * 45);
    addXp(earnedXp, `War Room (${role === 'blue' ? 'Blue Team' : 'Red Team Audit'})`, `warroom_${role}_${Date.now()}`);
    if ((role === 'blue' && avgHealth >= 70 && mitigatedCount >= 3) || (role === 'red' && completedRedAudits.length >= 3)) {
      const unlocked = unlockBadge('war_room_commander');
      if (unlocked) setBadgeAwarded(true);
    }
  }, [phase]);

  const handleApplyBlueDefense = (actionId: DefenseActionId) => {
    if (phase !== 'running' || role !== 'blue') return;

    const matchingIncident = activeIncidents.find((i) => i.targetNode === selectedNodeId);
    if (!matchingIncident) {
      pushLog('info', `No active incident on ${selectedNodeId.toUpperCase()}. Click a highlighted alert node on the network map.`);
      return;
    }

    if (matchingIncident.correctDefense === actionId) {
      const reactionSec = Math.max(1, elapsedRef.current - matchingIncident.spawnedAtElapsed);
      setResponseTimes((prev) => [...prev, reactionSec]);
      setMitigatedCount((c) => c + 1);
      setScore((s) => s + Math.max(100, 220 - reactionSec * 8));
      setActiveIncidents((prev) => prev.filter((i) => i.id !== matchingIncident.id));
      setNodes((prev) =>
        prev.map((n) =>
          n.id === selectedNodeId
            ? { ...n, health: Math.min(100, n.health + 15), compromised: false, hardened: true }
            : n
        )
      );
      pushLog(
        'success',
        `CONTAINED (${reactionSec}s): ${matchingIncident.vectorName} neutralized on ${selectedNodeId.toUpperCase()}.`
      );
    } else {
      setWrongMoves((w) => w + 1);
      setScore((s) => Math.max(0, s - 30));
      const toolLabel = BLUE_DEFENSE_TOOLS.find((tItem) => tItem.id === actionId)?.label || actionId;
      pushLog(
        'warning',
        `INEFFECTIVE CONTROL: ${toolLabel} did not stop ${matchingIncident.vectorName}. Match the defense to the threat vector.`
      );
    }
  };

  const handleRunRedAudit = (checkId: string) => {
    if (phase !== 'running' || role !== 'red') return;
    const check = RED_AUDIT_CHECKS.find((c) => c.id === checkId);
    if (!check) return;

    if (completedRedAudits.includes(check.id)) {
      pushLog('info', `Audit "${check.label}" already documented in this engagement.`);
      return;
    }

    const node = nodes.find((n) => n.id === check.targetNode);
    setSelectedNodeId(check.targetNode);

    if (node?.hardened) {
      setWrongMoves((w) => w + 1);
      pushLog('warning', `BLOCKED BY SOC: ${node.label} was already hardened by AI Blue Team defenses.`);
      return;
    }

    setCompletedRedAudits((prev) => [...prev, check.id]);
    setMitigatedCount((c) => c + 1);
    setScore((s) => s + 180);
    setNodes((prev) =>
      prev.map((n) => (n.id === check.targetNode ? { ...n, compromised: true, health: 65 } : n))
    );
    pushLog('success', `FINDING LOGGED on ${check.targetNode.toUpperCase()}: ${check.finding}`);
    pushLog('info', check.blueDefenseLesson);
  };

  const avgIntegrity = useMemo(
    () => Math.round(nodes.reduce((sum, n) => sum + n.health, 0) / nodes.length),
    [nodes]
  );

  const avgMttr = useMemo(() => {
    if (responseTimes.length === 0) return 0;
    return Math.round((responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) * 10) / 10;
  }, [responseTimes]);

  const activeIncidentOnSelected = activeIncidents.find((i) => i.targetNode === selectedNodeId);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToBca}
            className="h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">BCA Verse</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {t('warRoomTitle')}
            </h1>
            <div className="text-[11px] text-slate-400 font-mono tabular-nums truncate">
              Red vs Blue Tabletop SOC Simulator · {xp.toLocaleString()} XP
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {phase === 'running' && (
            <div
              className={`h-10 px-3 rounded-xl border font-mono text-sm font-bold tabular-nums inline-flex items-center gap-1.5 ${
                secondsLeft <= 15
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  : 'bg-slate-900 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <Timer className="w-4 h-4 shrink-0" />
              <span>{formatClock(secondsLeft)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleLanguage}
            className="h-10 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className={language === 'en' ? 'text-cyan-400' : 'opacity-60'}>A</span>
            <span className="opacity-40 mx-0.5">/</span>
            <span className={language === 'hi' ? 'text-emerald-400' : 'opacity-60'}>अ</span>
          </button>

          <button
            type="button"
            onClick={onOpenAppSwitcher}
            className="h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Grid className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">{t('navApps')}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* BRIEFING PHASE */}
        {phase === 'briefing' && (
          <section className="max-w-4xl mx-auto space-y-6 py-4">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {t('warRoomChooseSide')}
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {t('warRoomSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Blue Team Card */}
              <div
                onClick={() => setRole('blue')}
                className={`p-6 rounded-2xl border cursor-pointer transition-colors space-y-4 ${
                  role === 'blue'
                    ? 'bg-cyan-950/35 border-cyan-400/60'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-cyan-400">SOC Defense · 60s</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">{t('warRoomBlueTeam')}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Defend a 6-node enterprise network against simulated AI phishing, port sweeps, unpatched libraries, and API bursts. Click threatened nodes and deploy exact countermeasures before node health drops.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startSimulation('blue');
                  }}
                  className="w-full h-11 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4 shrink-0" />
                  <span>{t('warRoomStartBtn')} (Blue Team)</span>
                </button>
              </div>

              {/* Red Team Card */}
              <div
                onClick={() => setRole('red')}
                className={`p-6 rounded-2xl border cursor-pointer transition-colors space-y-4 ${
                  role === 'red'
                    ? 'bg-rose-950/30 border-rose-400/60'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center justify-center">
                    <Crosshair className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-rose-300">Authorized Audit · 60s</span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">{t('warRoomRedTeam')}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Run authorized purple-team posture audits across perimeter, SSO, web, API, and database layers before the AI Blue Team SOC hardens them. Every finding reveals the corresponding defensive fix.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startSimulation('red');
                  }}
                  className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4 shrink-0" />
                  <span>{t('warRoomStartBtn')} (Red Audit)</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* RUNNING & DEBRIEF WORKSPACE */}
        {phase !== 'briefing' && (
          <div className="space-y-5">
            {/* Compact KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Active Role</div>
                <div className={`text-sm font-bold mt-1 ${role === 'blue' ? 'text-cyan-300' : 'text-rose-300'}`}>
                  {role === 'blue' ? t('warRoomBlueTeam') : t('warRoomRedTeam')}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Network Integrity</div>
                <div className="text-lg font-bold text-emerald-300 font-mono tabular-nums mt-0.5">
                  {avgIntegrity}%
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">
                  {role === 'blue' ? 'Threats Contained' : 'Audit Findings'}
                </div>
                <div className="text-lg font-bold text-white font-mono tabular-nums mt-0.5">
                  {mitigatedCount}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Tactical Score</div>
                <div className="text-lg font-bold text-amber-300 font-mono tabular-nums mt-0.5">
                  {score.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Debrief Banner when 60s finishes */}
            {phase === 'debrief' && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <Award className="w-4 h-4" />
                    <span>60-Second Simulation Complete</span>
                    {badgeAwarded && <span>· Unlocked "War Room Commander" Badge</span>}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {role === 'blue'
                      ? `Contained ${mitigatedCount} Incidents · ${avgIntegrity}% Integrity Retained`
                      : `Logged ${completedRedAudits.length}/5 Security Posture Findings`}
                  </h3>
                  <p className="text-xs text-slate-300 font-mono tabular-nums">
                    Score: {score} · Wrong Actions: {wrongMoves}
                    {role === 'blue' && avgMttr > 0 ? ` · Mean Response Time: ${avgMttr}s` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startSimulation(role)}
                    className="h-10 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('warRoomResetBtn')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase('briefing')}
                    className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Switch Team
                  </button>
                </div>
              </div>
            )}

            {/* Interactive SVG Network Map + Tactical Control Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* SVG Virtual Network Topology */}
              <div className="lg:col-span-8 rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-white">Virtual Enterprise Network Topology</h2>
                    <p className="text-xs text-slate-400">
                      Click any node to inspect status and deploy controls.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400">Healthy</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-rose-400">Under Alert</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-cyan-400">Hardened</span>
                  </div>
                </div>

                <div className="w-full overflow-x-auto rounded-xl bg-slate-950 border border-slate-800 p-2">
                  <svg
                    viewBox="0 0 920 350"
                    className="w-full min-w-[640px] h-auto select-none"
                    role="img"
                    aria-label="Interactive virtual network topology map"
                  >
                    {/* Subtle Grid Pattern */}
                    <defs>
                      <pattern id="warroom-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path
                          d="M 32 0 L 0 0 0 32"
                          fill="none"
                          stroke="rgba(148,163,184,0.08)"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="920" height="350" fill="url(#warroom-grid)" />

                    {/* Edges */}
                    {NETWORK_EDGES.map((edge) => {
                      const fromNode = nodes.find((n) => n.id === edge.from)!;
                      const toNode = nodes.find((n) => n.id === edge.to)!;
                      const isThreatEdge = activeIncidents.some(
                        (inc) => inc.sourceNode === edge.from && inc.targetNode === edge.to
                      );

                      return (
                        <g key={`${edge.from}-${edge.to}`}>
                          <line
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke={isThreatEdge ? '#f43f5e' : '#334155'}
                            strokeWidth={isThreatEdge ? 3 : 2}
                            strokeDasharray={isThreatEdge ? '8 6' : undefined}
                          />
                        </g>
                      );
                    })}

                    {/* Interactive Network Nodes */}
                    {nodes.map((node) => {
                      const hasAlert = activeIncidents.some((i) => i.targetNode === node.id);
                      const isSelected = selectedNodeId === node.id;

                      const strokeColor = hasAlert
                        ? '#f43f5e'
                        : node.compromised
                        ? '#f59e0b'
                        : node.hardened
                        ? '#22d3ee'
                        : '#10b981';

                      const fillColor = isSelected ? '#1e293b' : '#0f172a';

                      return (
                        <g
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className="cursor-pointer"
                        >
                          {isSelected && (
                            <rect
                              x={node.x - 68}
                              y={node.y - 44}
                              width="136"
                              height="88"
                              rx="16"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2"
                              strokeDasharray="4 3"
                            />
                          )}

                          <rect
                            x={node.x - 62}
                            y={node.y - 38}
                            width="124"
                            height="76"
                            rx="12"
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={hasAlert ? 2.5 : 1.5}
                          />

                          <text
                            x={node.x}
                            y={node.y - 12}
                            textAnchor="middle"
                            fill="#f8fafc"
                            fontSize="12"
                            fontWeight="700"
                          >
                            {node.label}
                          </text>

                          <text
                            x={node.x}
                            y={node.y + 6}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="10"
                            fontFamily="monospace"
                          >
                            {node.ip}
                          </text>

                          {/* Integrity Bar inside SVG node */}
                          <rect
                            x={node.x - 44}
                            y={node.y + 18}
                            width="88"
                            height="6"
                            rx="3"
                            fill="#1e293b"
                          />
                          <rect
                            x={node.x - 44}
                            y={node.y + 18}
                            width={Math.max(4, (88 * node.health) / 100)}
                            height="6"
                            rx="3"
                            fill={strokeColor}
                          />

                          {hasAlert && (
                            <text
                              x={node.x}
                              y={node.y - 46}
                              textAnchor="middle"
                              fill="#fda4af"
                              fontSize="11"
                              fontWeight="700"
                              fontFamily="monospace"
                            >
                              ALERT ACTIVE
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Live Tactical Event Log */}
                <div className="pt-2 space-y-2">
                  <div className="text-xs font-bold text-slate-300">Live Operations Feed</div>
                  <div className="max-h-44 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 divide-y divide-slate-800/70">
                    {logs.map((entry) => (
                      <div key={entry.id} className="px-3.5 py-2.5 text-xs flex items-start gap-2.5">
                        <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0">
                          {entry.time}
                        </span>
                        <span
                          className={
                            entry.tone === 'alert'
                              ? 'text-rose-300'
                              : entry.tone === 'success'
                              ? 'text-emerald-300'
                              : entry.tone === 'warning'
                              ? 'text-amber-300'
                              : 'text-slate-300'
                          }
                        >
                          {entry.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Active Node Inspector & Countermeasures */}
              <aside className="lg:col-span-4 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
                <div className="space-y-1 border-b border-slate-800 pb-3">
                  <div className="text-[11px] font-mono text-cyan-400">
                    Selected Node · {selectedNode.ip}
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
                    <span className="text-xs font-mono font-bold tabular-nums text-emerald-300">
                      {selectedNode.health}% HP
                    </span>
                  </div>
                </div>

                {role === 'blue' ? (
                  <>
                    {/* Active Threat Box */}
                    {activeIncidentOnSelected ? (
                      <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{activeIncidentOnSelected.vectorName}</span>
                        </div>
                        <p className="text-xs text-rose-100/90 leading-relaxed">
                          {activeIncidentOnSelected.summary}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          {activeIncidents.length > 0
                            ? `Nominal. Click ${activeIncidents.map((i) => i.targetNode.toUpperCase()).join(' or ')} to respond.`
                            : 'Node nominal. Monitoring incoming network telemetry.'}
                        </span>
                      </div>
                    )}

                    {/* Defensive Tool Buttons */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-white">Deploy Defensive Control</div>
                      {BLUE_DEFENSE_TOOLS.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            disabled={phase !== 'running'}
                            onClick={() => handleApplyBlueDefense(tool.id)}
                            className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 disabled:opacity-50 border border-slate-800 hover:border-cyan-500/50 text-left transition-colors cursor-pointer flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white">{tool.label}</div>
                              <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                                {tool.shortDesc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-white">
                      Authorized Security Posture Audits
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Run conceptual checks before AI Blue Team hardens each asset to uncover defense lessons.
                    </p>
                    {RED_AUDIT_CHECKS.map((check) => {
                      const done = completedRedAudits.includes(check.id);
                      const targetHardened = nodes.find((n) => n.id === check.targetNode)?.hardened;
                      return (
                        <button
                          key={check.id}
                          type="button"
                          disabled={phase !== 'running' || done}
                          onClick={() => handleRunRedAudit(check.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                            done
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 cursor-default'
                              : targetHardened
                              ? 'bg-slate-950/60 border-slate-800 text-slate-500'
                              : 'bg-slate-950 hover:bg-slate-800/90 border-slate-800 hover:border-rose-500/50 text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs font-bold">
                            <span>{check.label}</span>
                            <span className="text-[10px] font-mono uppercase text-slate-400">
                              {done ? 'Logged' : targetHardened ? 'Hardened' : check.targetNode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {done ? check.blueDefenseLesson : `Target: ${check.targetNode.toUpperCase()} posture verification`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
