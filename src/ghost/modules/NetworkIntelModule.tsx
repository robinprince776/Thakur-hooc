import React, { useEffect, useRef, useState } from 'react';
import { Play, ShieldCheck, AlertOctagon, Layers } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

type FlowType = 'tcp-handshake' | 'tls-encrypted' | 'firewall-drop';

interface PacketStep {
  label: string;
  fromIdx: number;
  toIdx: number;
  color: string;
  detail: string;
  osi: { l3: string; l4: string; l7: string };
}

const NODES = [
  { id: 'client', label: 'Client Browser', ip: '192.168.1.40', x: 75, y: 145 },
  { id: 'firewall', label: 'Edge Firewall', ip: '10.24.0.1', x: 225, y: 145 },
  { id: 'router', label: 'Core Router', ip: '10.24.0.2', x: 375, y: 145 },
  { id: 'web', label: 'DMZ Web API', ip: '10.24.0.20', x: 525, y: 80 },
  { id: 'db', label: 'Vault Database', ip: '10.24.0.30', x: 525, y: 210 },
];

const FLOW_SEQUENCES: Record<FlowType, PacketStep[]> = {
  'tcp-handshake': [
    {
      label: 'SYN',
      fromIdx: 0,
      toIdx: 3,
      color: '#00E5FF',
      detail: 'Client -> Web: TCP SYN (Seq=100, Port=443)',
      osi: { l3: 'SRC 192.168.1.40 -> DST 10.24.0.20 (TTL=64)', l4: 'TCP Flags=[SYN] Seq=100 Win=64240', l7: 'Awaiting handshake completion' },
    },
    {
      label: 'SYN-ACK',
      fromIdx: 3,
      toIdx: 0,
      color: '#00FF41',
      detail: 'Web -> Client: TCP SYN-ACK (Seq=400, Ack=101)',
      osi: { l3: 'SRC 10.24.0.20 -> DST 192.168.1.40 (TTL=63)', l4: 'TCP Flags=[SYN,ACK] Seq=400 Ack=101', l7: 'Server socket allocated' },
    },
    {
      label: 'ACK',
      fromIdx: 0,
      toIdx: 3,
      color: '#00E5FF',
      detail: 'Client -> Web: TCP ACK (Ack=401) — Session Established',
      osi: { l3: 'SRC 192.168.1.40 -> DST 10.24.0.20 (TTL=64)', l4: 'TCP Flags=[ACK] Seq=101 Ack=401', l7: 'TCP Socket ESTABLISHED' },
    },
  ],
  'tls-encrypted': [
    {
      label: 'ClientHello',
      fromIdx: 0,
      toIdx: 3,
      color: '#00E5FF',
      detail: 'TLS 1.3 Cipher Suite Negotiation',
      osi: { l3: 'SRC 192.168.1.40 -> DST 10.24.0.20', l4: 'TCP Port 443 (HTTPS)', l7: 'TLS 1.3 ClientHello (TLS_AES_256_GCM_SHA384)' },
    },
    {
      label: 'ServerCert',
      fromIdx: 3,
      toIdx: 0,
      color: '#00FF41',
      detail: 'Verified X.509 Certificate + Key Share',
      osi: { l3: 'SRC 10.24.0.20 -> DST 192.168.1.40', l4: 'TCP Port 443 (Encrypted)', l7: 'X.509 ECDSA Chain Verified' },
    },
    {
      label: 'DB Query',
      fromIdx: 3,
      toIdx: 4,
      color: '#00FF41',
      detail: 'DMZ API -> Vault DB over mTLS tunnel',
      osi: { l3: 'SRC 10.24.0.20 -> DST 10.24.0.30 (Internal VLAN)', l4: 'TCP Port 5432 (mTLS)', l7: 'Parameterized SELECT query' },
    },
  ],
  'firewall-drop': [
    {
      label: 'PROBE 22',
      fromIdx: 0,
      toIdx: 1,
      color: '#FF003C',
      detail: 'Untrusted External Host probes Port 22 (SSH)',
      osi: { l3: 'SRC 192.168.1.40 -> DST 10.24.0.1', l4: 'TCP Flags=[SYN] DstPort=22', l7: 'SSH Banner Probe' },
    },
    {
      label: 'UFW DROP',
      fromIdx: 1,
      toIdx: 1,
      color: '#FF003C',
      detail: 'Edge Firewall drops packet silently (Zero exposure)',
      osi: { l3: 'Blocked at Edge ACL Policy', l4: 'Rule: DENY IN TCP/22 FROM !10.24.0.0/24', l7: 'No application response sent' },
    },
  ],
};

export const NetworkIntelModule: React.FC = () => {
  const addGhostXp = useGhostStore((s) => s.addGhostXp);

  const [selectedFlow, setSelectedFlow] = useState<FlowType>('tcp-handshake');
  const [packetPos, setPacketPos] = useState<{ x: number; y: number; label: string; color: string } | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
  const [inspectedOsi, setInspectedOsi] = useState<PacketStep['osi']>(FLOW_SEQUENCES['tcp-handshake'][0].osi);
  const [logs, setLogs] = useState<string[]>([
    'Topology ready. Select a packet scenario to inspect live OSI headers & packet flow.',
  ]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const triggerSimulation = (flow: FlowType) => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    setSelectedFlow(flow);
    const steps = FLOW_SEQUENCES[flow];
    setLogs([`Starting ${flow.toUpperCase()} simulation...`]);

    let stepIdx = 0;
    let t = 0;

    const animate = () => {
      const step = steps[stepIdx];
      if (!step) {
        setPacketPos(null);
        setActiveStepIdx(-1);
        setLogs((prev) => [...prev, 'Simulation complete.']);
        addGhostXp(20, `Network Simulation: ${flow}`, `net-sim-${flow}`);
        return;
      }

      setActiveStepIdx(stepIdx);
      setInspectedOsi(step.osi);
      const from = NODES[step.fromIdx];
      const to = NODES[step.toIdx];

      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;
      setPacketPos({ x, y, label: step.label, color: step.color });

      if (t === 0) {
        setLogs((prev) => [...prev, step.detail]);
      }

      t += 0.018;
      if (t >= 1) {
        t = 0;
        stepIdx += 1;
      }
      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);
  };

  return (
    <ModuleFrame
      moduleId="network"
      onResetLocal={() => {
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        setPacketPos(null);
        setActiveStepIdx(-1);
        setLogs(['Topology reset cleanly.']);
      }}
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => triggerSimulation('tcp-handshake')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
              selectedFlow === 'tcp-handshake'
                ? 'border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF]'
                : 'border-slate-700 bg-[#0D1322] text-slate-200 hover:border-[#00E5FF]/50'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>TCP 3-Way Handshake</span>
          </button>

          <button
            type="button"
            onClick={() => triggerSimulation('tls-encrypted')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
              selectedFlow === 'tls-encrypted'
                ? 'border-[#00FF41] bg-[#00FF41]/15 text-[#00FF41]'
                : 'border-slate-700 bg-[#0D1322] text-slate-200 hover:border-[#00FF41]/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TLS 1.3 &amp; mTLS Flow</span>
          </button>

          <button
            type="button"
            onClick={() => triggerSimulation('firewall-drop')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
              selectedFlow === 'firewall-drop'
                ? 'border-[#FF003C] bg-[#FF003C]/15 text-[#FF003C]'
                : 'border-slate-700 bg-[#0D1322] text-slate-200 hover:border-[#FF003C]/50'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Firewall Port Drop</span>
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#070B13] p-4 overflow-x-auto">
          <svg viewBox="0 0 610 280" className="w-full min-w-[520px] h-auto select-none">
            {[
              [0, 1],
              [1, 2],
              [2, 3],
              [2, 4],
              [3, 4],
            ].map(([a, b]) => (
              <line
                key={`${a}-${b}`}
                x1={NODES[a].x}
                y1={NODES[a].y}
                x2={NODES[b].x}
                y2={NODES[b].y}
                stroke="rgba(0, 229, 255, 0.35)"
                strokeWidth="2"
              />
            ))}

            {NODES.map((n) => (
              <g key={n.id}>
                <rect
                  x={n.x - 54}
                  y={n.y - 26}
                  width={108}
                  height={52}
                  rx={10}
                  fill="#0E1525"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />
                <text x={n.x} y={n.y - 4} textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="600">
                  {n.label}
                </text>
                <text x={n.x} y={n.y + 13} textAnchor="middle" fill="#00E5FF" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                  {n.ip}
                </text>
              </g>
            ))}

            {packetPos && (
              <g transform={`translate(${packetPos.x}, ${packetPos.y})`}>
                <circle r="8" fill={packetPos.color} />
                <text y="-14" textAnchor="middle" fill={packetPos.color} fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                  {packetPos.label}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Split Packet Inspector: OSI Layer Breakdown + Wire Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Layers className="w-4 h-4 text-[#00E5FF]" />
              <span>OSI Packet Header Breakdown</span>
            </div>
            <div className="space-y-2 font-ghost-mono text-xs">
              <div className="p-2.5 rounded-lg bg-[#090D16] border border-slate-800">
                <span className="text-slate-400">Layer 3 (Network): </span>
                <span className="text-[#00E5FF]">{inspectedOsi.l3}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090D16] border border-slate-800">
                <span className="text-slate-400">Layer 4 (Transport): </span>
                <span className="text-[#00FF41]">{inspectedOsi.l4}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090D16] border border-slate-800">
                <span className="text-slate-400">Layer 7 (Application): </span>
                <span className="text-slate-200">{inspectedOsi.l7}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white">Packet Wire Event Log</h3>
              {activeStepIdx >= 0 && (
                <span className="text-xs font-ghost-mono text-[#00FF41]">
                  Step {activeStepIdx + 1} Active
                </span>
              )}
            </div>
            <div className="space-y-1 font-ghost-mono text-xs text-slate-300">
              {logs.map((line, i) => (
                <div key={i} className="py-1 border-b border-slate-800/60 last:border-0">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
