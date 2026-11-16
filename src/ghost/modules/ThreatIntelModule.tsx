import React, { useEffect, useRef, useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';

const MOCK_IOCS = [
  {
    id: 'ioc-1',
    indicator: '198.51.100.44',
    type: 'IPv4',
    actor: 'APT-ShadowPulse (Sim)',
    mitre: 'T1110 · Brute Force',
    confidence: '94%',
  },
  {
    id: 'ioc-2',
    indicator: 'login-verify-portal.example',
    type: 'Domain',
    actor: 'PhishRing-24 (Sim)',
    mitre: 'T1566 · Phishing',
    confidence: '98%',
  },
  {
    id: 'ioc-3',
    indicator: '8f434346648f6b96df89dda901c5176b',
    type: 'Hash',
    actor: 'CryptLock-Sim',
    mitre: 'T1486 · Data Encrypted',
    confidence: '91%',
  },
  {
    id: 'ioc-4',
    indicator: '203.0.113.77',
    type: 'IPv4',
    actor: 'BeaconCrawler (Sim)',
    mitre: 'T1071 · App Layer Protocol',
    confidence: '87%',
  },
];

export const ThreatIntelModule: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let angle = 0;

    const blips = [
      { r: 0.35, theta: 0.9, label: 'APT-ShadowPulse' },
      { r: 0.62, theta: 2.5, label: 'PhishRing-24' },
      { r: 0.48, theta: 4.3, label: 'BeaconCrawler' },
    ];

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(cx, cy) - 16;

      ctx.clearRect(0, 0, w, h);

      // Concentric radar rings
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.lineWidth = 1;
      [0.33, 0.66, 1].forEach((f) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * f, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Sweep wedge
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, maxR);
      grad.addColorStop(0, 'rgba(0, 255, 65, 0.25)');
      grad.addColorStop(1, 'rgba(0, 255, 65, 0.02)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, angle, angle + 0.5);
      ctx.closePath();
      ctx.fill();

      blips.forEach((b) => {
        const bx = cx + Math.cos(b.theta) * maxR * b.r;
        const by = cy + Math.sin(b.theta) * maxR * b.r;
        ctx.fillStyle = '#FF003C';
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#CBD5E1';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(b.label, bx + 7, by + 3);
      });

      angle = (angle + 0.02) % (Math.PI * 2);
      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(animId);
  }, []);

  const filtered = MOCK_IOCS.filter(
    (item) =>
      !search.trim() ||
      item.indicator.toLowerCase().includes(search.toLowerCase()) ||
      item.actor.toLowerCase().includes(search.toLowerCase()) ||
      item.mitre.toLowerCase().includes(search.toLowerCase())
  );

  const copyBlockRule = (ioc: (typeof MOCK_IOCS)[0]) => {
    const rule = `# Defensive Block Rule for ${ioc.actor}\nDENY ${ioc.type}: ${ioc.indicator} (${ioc.mitre})`;
    navigator.clipboard?.writeText(rule).catch(() => {});
    setCopiedId(ioc.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <ModuleFrame moduleId="threatintel" onResetLocal={() => setSearch('')}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Animated Threat Radar */}
        <div className="rounded-xl border border-slate-800 bg-[#090D16] p-4 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white">OSINT Actor Radar</span>
            <Globe className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <canvas ref={canvasRef} width={280} height={240} className="max-w-full" />
        </div>

        {/* IOC Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">Mock OSINT Indicators of Compromise</h3>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search IP, actor, MITRE ID..."
              className="px-3 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((ioc) => (
              <div
                key={ioc.id}
                className="p-3 rounded-lg bg-[#090D16] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="font-ghost-mono text-xs text-[#00E5FF] break-all">
                    {ioc.indicator}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {ioc.type} · {ioc.actor} · <span className="text-amber-300">{ioc.mitre}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyBlockRule(ioc)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded border border-slate-700 hover:border-[#00FF41]/50 text-[11px] font-ghost-mono text-slate-200 cursor-pointer shrink-0"
                >
                  {copiedId === ioc.id ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5 text-[#00E5FF]" />}
                  <span>{copiedId === ioc.id ? 'Copied Rule' : 'Copy Block Rule'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
