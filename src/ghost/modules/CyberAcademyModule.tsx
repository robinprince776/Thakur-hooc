import React, { useState } from 'react';
import { CheckCircle2, Lock, Unlock, ArrowRight } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { GhostModuleId, useGhostStore } from '../../store/useGhostStore';

interface SkillTreeNode {
  id: string;
  label: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  x: number;
  y: number;
  prereq: string[];
  targetModule: GhostModuleId;
  xpCost: number;
  summary: string;
}

const TREE_NODES: SkillTreeNode[] = [
  {
    id: 'net-basics',
    label: 'TCP/IP & OSI Core',
    tier: 'Beginner',
    x: 160,
    y: 70,
    prereq: [],
    targetModule: 'network',
    xpCost: 0,
    summary: 'Master 3-way handshakes, packet headers, and perimeter firewall rules.',
  },
  {
    id: 'linux-core',
    label: 'Linux Shell Audit',
    tier: 'Beginner',
    x: 440,
    y: 70,
    prereq: [],
    targetModule: 'terminal',
    xpCost: 0,
    summary: 'Inspect processes, permissions, and log streams via defensive bash commands.',
  },
  {
    id: 'web-defense',
    label: 'OWASP Web Hardening',
    tier: 'Intermediate',
    x: 160,
    y: 190,
    prereq: ['net-basics'],
    targetModule: 'websec',
    xpCost: 120,
    summary: 'Neutralize injection and cross-site scripting using parameterized queries and CSP.',
  },
  {
    id: 'dfir-triage',
    label: 'Forensics & EXIF DFIR',
    tier: 'Intermediate',
    x: 440,
    y: 190,
    prereq: ['linux-core'],
    targetModule: 'forensics',
    xpCost: 120,
    summary: 'Verify file magic bytes, extract metadata footprints, and trace anomaly bursts.',
  },
  {
    id: 'soc-ops',
    label: 'SIEM Alert Triage',
    tier: 'Advanced',
    x: 300,
    y: 300,
    prereq: ['web-defense', 'dfir-triage'],
    targetModule: 'soc',
    xpCost: 220,
    summary: 'Separate noisy false positives from true adversary persistence alerts.',
  },
  {
    id: 'ai-guardrails',
    label: 'AI Guardrail Defense',
    tier: 'Expert',
    x: 300,
    y: 410,
    prereq: ['soc-ops'],
    targetModule: 'aisec',
    xpCost: 350,
    summary: 'Protect LLM pipelines from prompt injection and detect synthetic media spoofing.',
  },
];

const EDGES: Array<[string, string]> = [
  ['net-basics', 'web-defense'],
  ['linux-core', 'dfir-triage'],
  ['web-defense', 'soc-ops'],
  ['dfir-triage', 'soc-ops'],
  ['soc-ops', 'ai-guardrails'],
];

export const CyberAcademyModule: React.FC = () => {
  const xp = useGhostStore((s) => s.xp);
  const unlockedSkills = useGhostStore((s) => s.unlockedSkills);
  const unlockSkill = useGhostStore((s) => s.unlockSkill);
  const setActiveModule = useGhostStore((s) => s.setActiveModule);

  const [selectedId, setSelectedId] = useState<string>('net-basics');
  const selectedNode = TREE_NODES.find((n) => n.id === selectedId) || TREE_NODES[0];

  const isUnlocked = (id: string) => unlockedSkills.includes(id);
  const canUnlock = (node: SkillTreeNode) =>
    !isUnlocked(node.id) &&
    xp >= node.xpCost &&
    node.prereq.every((p) => isUnlocked(p));

  return (
    <ModuleFrame moduleId="academy">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Interactive SVG Tree */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#090D16] p-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Interactive Defensive Skill Tree</h3>
            <span className="text-xs font-ghost-mono text-[#00FF41]">
              Unlocked {unlockedSkills.length} / {TREE_NODES.length}
            </span>
          </div>

          <svg viewBox="0 0 600 470" className="w-full min-w-[460px] h-auto select-none">
            {EDGES.map(([fromId, toId]) => {
              const from = TREE_NODES.find((n) => n.id === fromId)!;
              const to = TREE_NODES.find((n) => n.id === toId)!;
              const active = isUnlocked(fromId) && isUnlocked(toId);
              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={active ? '#00FF41' : 'rgba(0, 229, 255, 0.25)'}
                  strokeWidth={active ? 2.5 : 1.5}
                  strokeDasharray={active ? undefined : '5 5'}
                />
              );
            })}

            {TREE_NODES.map((node) => {
              const unlocked = isUnlocked(node.id);
              const ready = canUnlock(node);
              const isSelected = selectedId === node.id;
              const fill = unlocked ? '#0D2618' : ready ? '#0F2233' : '#111827';
              const stroke = isSelected
                ? '#00E5FF'
                : unlocked
                ? '#00FF41'
                : ready
                ? '#00E5FF'
                : '#334155';

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={node.x - 95}
                    y={node.y - 26}
                    width={190}
                    height={52}
                    rx={10}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text
                    x={node.x}
                    y={node.y - 4}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 14}
                    textAnchor="middle"
                    fill={unlocked ? '#00FF41' : ready ? '#00E5FF' : '#94A3B8'}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.tier} · {unlocked ? 'MASTERED' : `${node.xpCost} XP REQ`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details */}
        <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="text-xs font-ghost-mono text-[#00E5FF]">
              {selectedNode.tier} Track Node
            </div>
            <h3 className="text-lg font-bold text-white">{selectedNode.label}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedNode.summary}
            </p>

            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Required XP</span>
                <span className="font-ghost-mono text-white">{selectedNode.xpCost} XP</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Prerequisites</span>
                <span className="font-ghost-mono text-slate-200">
                  {selectedNode.prereq.length ? selectedNode.prereq.join(', ') : 'None'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Status</span>
                <span
                  className={`font-ghost-mono font-semibold ${
                    isUnlocked(selectedNode.id) ? 'text-[#00FF41]' : 'text-amber-300'
                  }`}
                >
                  {isUnlocked(selectedNode.id) ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {isUnlocked(selectedNode.id) ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30 text-xs text-[#00FF41] font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Skill node mastered &amp; active</span>
              </div>
            ) : canUnlock(selectedNode) ? (
              <button
                type="button"
                onClick={() => unlockSkill(selectedNode.id, 50)}
                className="w-full py-2.5 px-4 min-h-[44px] rounded-lg bg-[#00FF41] hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Skill Node (+50 XP)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Complete prerequisite nodes &amp; reach {selectedNode.xpCost} XP to unlock</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveModule(selectedNode.targetModule)}
              className="w-full py-2.5 px-4 min-h-[44px] rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Practice in Lab Module</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
