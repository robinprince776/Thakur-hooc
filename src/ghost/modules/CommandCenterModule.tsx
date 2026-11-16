import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Zap, Target, Play, Pause, ArrowRight, ShieldCheck, Radio } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { GhostThreatLevel, useGhostStore } from '../../store/useGhostStore';

interface SimulatedArc {
  id: number;
  srcX: number;
  srcY: number;
  dstX: number;
  dstY: number;
  progress: number;
  speed: number;
  type: 'DDoS Probe' | 'Credential Stuffing' | 'Port Sweep' | 'Phishing Beacon';
  blocked: boolean;
}

const GEO_NODES = [
  { name: 'Mumbai SOC', x: 0.67, y: 0.56, isSensor: true, latency: '12ms', posture: 'WAF + mTLS Active' },
  { name: 'Frankfurt IX', x: 0.51, y: 0.31, isSensor: true, latency: '24ms', posture: 'Geo-Fence Strict' },
  { name: 'Virginia Edge', x: 0.25, y: 0.38, isSensor: true, latency: '38ms', posture: 'Rate-Limit 1k/s' },
  { name: 'Tokyo Relay', x: 0.85, y: 0.39, isSensor: true, latency: '29ms', posture: 'Zero-Trust Proxy' },
  { name: 'Singapore Core', x: 0.76, y: 0.63, isSensor: true, latency: '18ms', posture: 'SIEM Collector ON' },
  { name: 'Sao Paulo POP', x: 0.33, y: 0.72, isSensor: false, latency: '94ms', posture: 'External Telemetry' },
  { name: 'Eastern Grid', x: 0.61, y: 0.26, isSensor: false, latency: '112ms', posture: 'Untrusted Source' },
];

const THREAT_LEVELS: GhostThreatLevel[] = ['LOW', 'ELEVATED', 'HIGH', 'CRITICAL'];

export const CommandCenterModule: React.FC = () => {
  const xp = useGhostStore((s) => s.xp);
  const level = useGhostStore((s) => s.level);
  const rankTitle = useGhostStore((s) => s.rankTitle);
  const threatLevel = useGhostStore((s) => s.threatLevel);
  const setThreatLevel = useGhostStore((s) => s.setThreatLevel);
  const completedModules = useGhostStore((s) => s.completedModules);
  const completedMissions = useGhostStore((s) => s.completedMissions);
  const setActiveModule = useGhostStore((s) => s.setActiveModule);
  const addGhostXp = useGhostStore((s) => s.addGhostXp);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simRunning, setSimRunning] = useState(true);
  const [shieldActive, setShieldActive] = useState(false);
  const [selectedNodeName, setSelectedNodeName] = useState('Mumbai SOC');
  const [mitigatedCount, setMitigatedCount] = useState(14);
  const [eventsFeed, setEventsFeed] = useState<
    Array<{ id: number; time: string; vector: string; target: string; action: 'MITIGATED' | 'MONITORING' }>
  >([
    { id: 1, time: '06:55:12', vector: 'SYN Flood Telemetry', target: 'Mumbai SOC', action: 'MITIGATED' },
    { id: 2, time: '06:56:04', vector: 'SSH Brute Burst', target: 'Frankfurt IX', action: 'MITIGATED' },
    { id: 3, time: '06:56:49', vector: 'Anomalous DNS Query', target: 'Singapore Core', action: 'MONITORING' },
  ]);

  const shieldActiveRef = useRef(shieldActive);
  useEffect(() => {
    shieldActiveRef.current = shieldActive;
  }, [shieldActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let radarAngle = 0;
    let frameCount = 0;

    const arcs: SimulatedArc[] = [
      { id: 1, srcX: 0.61, srcY: 0.26, dstX: 0.51, dstY: 0.31, progress: 0.2, speed: 0.006, type: 'Port Sweep', blocked: true },
      { id: 2, srcX: 0.33, srcY: 0.72, dstX: 0.25, dstY: 0.38, progress: 0.6, speed: 0.005, type: 'Credential Stuffing', blocked: true },
      { id: 3, srcX: 0.85, srcY: 0.39, dstX: 0.67, dstY: 0.56, progress: 0.4, speed: 0.007, type: 'DDoS Probe', blocked: false },
      { id: 4, srcX: 0.61, srcY: 0.26, dstX: 0.76, dstY: 0.63, progress: 0.1, speed: 0.0055, type: 'Phishing Beacon', blocked: true },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(300, Math.floor(rect.width * dpr));
      canvas.height = Math.max(220, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const drawWorldSilhouette = (w: number, h: number) => {
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.16)';
      ctx.fillStyle = 'rgba(0, 229, 255, 0.045)';
      ctx.lineWidth = 1;
      const regions = [
        [[0.12, 0.24], [0.30, 0.22], [0.31, 0.43], [0.22, 0.48], [0.15, 0.38]],
        [[0.27, 0.53], [0.37, 0.57], [0.36, 0.82], [0.29, 0.85], [0.25, 0.65]],
        [[0.45, 0.20], [0.60, 0.18], [0.62, 0.38], [0.47, 0.38]],
        [[0.46, 0.42], [0.58, 0.43], [0.57, 0.76], [0.49, 0.74], [0.44, 0.55]],
        [[0.61, 0.22], [0.87, 0.23], [0.89, 0.55], [0.73, 0.62], [0.63, 0.52]],
        [[0.78, 0.67], [0.90, 0.69], [0.89, 0.84], [0.78, 0.82]],
      ];

      regions.forEach((poly) => {
        ctx.beginPath();
        poly.forEach(([px, py], i) => {
          if (i === 0) ctx.moveTo(px * w, py * h);
          else ctx.lineTo(px * w, py * h);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    };

    const tick = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const shielded = shieldActiveRef.current;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 8; i++) {
        const gx = (w / 8) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let j = 1; j < 5; j++) {
        const gy = (h / 5) * j;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      drawWorldSilhouette(w, h);

      // Radar sweep centered on selected/primary Mumbai SOC hub
      const cx = 0.67 * w;
      const cy = 0.56 * h;
      const radius = Math.min(w, h) * 0.38;
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius);
      grad.addColorStop(0, shielded ? 'rgba(0, 255, 65, 0.24)' : 'rgba(0, 229, 255, 0.18)');
      grad.addColorStop(1, 'rgba(0, 255, 65, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, radarAngle, radarAngle + 0.55);
      ctx.closePath();
      ctx.fill();

      if (shielded) {
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (simRunning) {
        radarAngle = (radarAngle + 0.025) % (Math.PI * 2);
        frameCount += 1;

        arcs.forEach((arc) => {
          arc.progress += arc.speed;
          if (arc.progress >= 1) {
            const src = GEO_NODES[Math.floor(Math.random() * GEO_NODES.length)];
            const sensors = GEO_NODES.filter((n) => n.isSensor);
            const dst = sensors[Math.floor(Math.random() * sensors.length)];
            arc.srcX = src.x;
            arc.srcY = src.y;
            arc.dstX = dst.x;
            arc.dstY = dst.y;
            arc.progress = 0;
            arc.blocked = shielded ? true : Math.random() > 0.25;
            const types: SimulatedArc['type'][] = [
              'DDoS Probe',
              'Credential Stuffing',
              'Port Sweep',
              'Phishing Beacon',
            ];
            arc.type = types[Math.floor(Math.random() * types.length)];
          }
        });

        if (frameCount % 150 === 0) {
          const sampleArc = arcs[0];
          const targetNode = GEO_NODES.find((n) => Math.abs(n.x - sampleArc.dstX) < 0.02);
          const now = new Date();
          const hhmmss = now.toTimeString().slice(0, 8);
          if (sampleArc.blocked) {
            setMitigatedCount((c) => c + 1);
          }
          setEventsFeed((prev) => [
            {
              id: Date.now(),
              time: hhmmss,
              vector: sampleArc.type,
              target: targetNode?.name || 'Edge Sensor',
              action: sampleArc.blocked ? 'MITIGATED' : 'MONITORING',
            },
            ...prev.slice(0, 5),
          ]);
        }
      }

      arcs.forEach((arc) => {
        const sx = arc.srcX * w;
        const sy = arc.srcY * h;
        const dx = arc.dstX * w;
        const dy = arc.dstY * h;
        const ctrlX = (sx + dx) / 2;
        const ctrlY = Math.min(sy, dy) - 45;

        const isBlocked = shielded || arc.blocked;
        ctx.strokeStyle = isBlocked ? 'rgba(0, 229, 255, 0.35)' : 'rgba(255, 0, 60, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(ctrlX, ctrlY, dx, dy);
        ctx.stroke();

        const t = arc.progress;
        const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * ctrlX + t * t * dx;
        const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * ctrlY + t * t * dy;

        ctx.fillStyle = isBlocked ? '#00FF41' : '#FF003C';
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      GEO_NODES.forEach((node) => {
        const nx = node.x * w;
        const ny = node.y * h;
        ctx.fillStyle = node.isSensor ? '#00FF41' : '#FF003C';
        ctx.beginPath();
        ctx.arc(nx, ny, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(node.name, nx + 7, ny + 3);
      });

      animId = window.requestAnimationFrame(tick);
    };

    animId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [simRunning]);

  const handleToggleShieldDrill = () => {
    const next = !shieldActive;
    setShieldActive(next);
    if (next) {
      setThreatLevel('LOW');
      setMitigatedCount((c) => c + 5);
      addGhostXp(25, 'Perimeter Containment Drill Activated', 'cmd-shield-drill');
      setEventsFeed((prev) => [
        {
          id: Date.now(),
          time: new Date().toTimeString().slice(0, 8),
          vector: 'Zero-Trust Rate Limit Shield',
          target: 'All Edge POPs',
          action: 'MITIGATED',
        },
        ...prev.slice(0, 5),
      ]);
    } else {
      setThreatLevel('ELEVATED');
    }
  };

  const selectedNode = GEO_NODES.find((n) => n.name === selectedNodeName) || GEO_NODES[0];

  const threatStyles: Record<GhostThreatLevel, string> = {
    LOW: 'text-[#00FF41] border-[#00FF41]/40 bg-[#00FF41]/10',
    ELEVATED: 'text-[#00E5FF] border-[#00E5FF]/40 bg-[#00E5FF]/10',
    HIGH: 'text-amber-300 border-amber-400/40 bg-amber-400/10',
    CRITICAL: 'text-[#FF003C] border-[#FF003C]/40 bg-[#FF003C]/10',
  };

  return (
    <ModuleFrame
      moduleId="command"
      onResetLocal={() => {
        setShieldActive(false);
        setSimRunning(true);
        setThreatLevel('ELEVATED');
      }}
    >
      <div className="space-y-6">
        {/* Top Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4">
            <div className="text-xs text-slate-400">Current Threat Level</div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-ghost-mono font-bold border ${threatStyles[threatLevel]}`}>
                {threatLevel}
              </span>
              <ShieldAlert className={`w-5 h-5 ${threatLevel === 'CRITICAL' ? 'text-[#FF003C]' : 'text-[#00E5FF]'}`} />
            </div>
            <div className="mt-3 flex gap-1">
              {THREAT_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setThreatLevel(lvl)}
                  className={`flex-1 py-1 text-[10px] font-ghost-mono rounded cursor-pointer transition-colors ${
                    threatLevel === lvl
                      ? 'bg-[#00E5FF] text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4">
            <div className="text-xs text-slate-400">Operator Rank &amp; XP</div>
            <div className="mt-1.5 text-xl font-bold font-ghost-mono text-[#00FF41]">
              {xp.toLocaleString()} XP
            </div>
            <div className="mt-1 text-xs text-slate-300">
              Level {level} · {rankTitle}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4">
            <div className="text-xs text-slate-400">Modules Cleared · Mitigated</div>
            <div className="mt-1.5 flex items-baseline justify-between font-ghost-mono">
              <span className="text-xl font-bold text-[#00E5FF]">{completedModules.length} / 14</span>
              <span className="text-xs text-[#00FF41]">{mitigatedCount} blocked</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#00E5FF] transition-all"
                style={{ width: `${Math.round((completedModules.length / 14) * 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4">
            <div className="text-xs text-slate-400">Investigations Completed</div>
            <div className="mt-1.5 text-xl font-bold font-ghost-mono text-white">
              {completedMissions.length} / 3
            </div>
            <button
              type="button"
              onClick={() => setActiveModule('missions')}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#00E5FF] hover:underline cursor-pointer"
            >
              <span>Launch Mission Control</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Simulated Global Telemetry Map & Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#090D16] p-4 flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Simulated Global Threat Telemetry Canvas
                </h3>
                <p className="text-xs text-slate-400">
                  Green paths show mitigated probes · Crimson paths indicate unshielded triage targets
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleShieldDrill}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    shieldActive
                      ? 'border-[#00FF41] bg-[#00FF41]/15 text-[#00FF41]'
                      : 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{shieldActive ? 'Perimeter Shield: ON' : 'Engage Shield'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSimRunning((p) => !p)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-slate-700 bg-slate-900 hover:border-[#00E5FF]/50 text-xs font-medium text-slate-200 cursor-pointer shrink-0"
                >
                  {simRunning ? <Pause className="w-3.5 h-3.5 text-[#00E5FF]" /> : <Play className="w-3.5 h-3.5 text-[#00FF41]" />}
                  <span>{simRunning ? 'Pause' : 'Resume'}</span>
                </button>
              </div>
            </div>

            <div className="relative flex-1 min-h-[260px] rounded-lg border border-slate-800/80 bg-[#060910] overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Interactive Sensor POP Selector */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {GEO_NODES.slice(0, 5).map((node) => (
                  <button
                    key={node.name}
                    type="button"
                    onClick={() => setSelectedNodeName(node.name)}
                    className={`px-2.5 py-1.5 rounded-md font-ghost-mono text-[11px] border cursor-pointer transition-colors ${
                      selectedNodeName === node.name
                        ? 'border-[#00FF41] bg-[#00FF41]/10 text-[#00FF41]'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {node.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 font-ghost-mono text-[11px] text-slate-300">
                <Radio className="w-3.5 h-3.5 text-[#00FF41]" />
                <span>{selectedNode.latency}</span>
                <span className="text-slate-600">·</span>
                <span className="text-[#00E5FF]">{selectedNode.posture}</span>
              </div>
            </div>
          </div>

          {/* Telemetry Log + Quick Actions */}
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Simulated Event Stream</h3>
                <span className="text-[11px] font-ghost-mono text-[#00FF41]">Sandbox Live</span>
              </div>
              <div className="space-y-2">
                {eventsFeed.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-lg bg-[#090D16] border border-slate-800/90 text-xs"
                  >
                    <div className="flex items-center justify-between font-ghost-mono text-[11px]">
                      <span className="text-slate-400">{ev.time}</span>
                      <span className={ev.action === 'MITIGATED' ? 'text-[#00FF41]' : 'text-[#FF003C]'}>
                        {ev.action}
                      </span>
                    </div>
                    <div className="mt-1 font-medium text-slate-200">
                      {ev.vector} <span className="text-slate-500">·</span>{' '}
                      <span className="text-[#00E5FF]">{ev.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs font-medium text-slate-400">Priority Drills</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModule('terminal')}
                  className="px-3 py-2.5 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span>Terminal Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('soc')}
                  className="px-3 py-2.5 min-h-[40px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5 text-[#FF003C]" />
                  <span>SOC Triage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
