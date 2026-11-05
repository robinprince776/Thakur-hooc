import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  Shield,
  Code2,
  Zap,
  Info
} from 'lucide-react';
import { useGamificationStore, SkillNodeData } from '../../store/useGamificationStore';

export interface SkillNodeConfig extends SkillNodeData {
  x: number;
  y: number;
  icon?: string;
}

export interface SkillTreeProps {
  hub?: 'academic' | 'programming' | 'cyber';
  title?: string;
  subtitle?: string;
  onLaunchSkillTopic?: (topicId: string) => void;
  onStartBossChallenge?: (node?: any) => void;
}

// Academic Hub Skill Tree Configuration
export const ACADEMIC_SKILL_NODES: SkillNodeConfig[] = [
  // 1. Foundation
  {
    id: 'bin_logic',
    title: 'Binary & Number Systems',
    category: 'Foundation',
    hub: 'academic',
    description: 'Master binary, octal, hex, and two’s complement representations.',
    prerequisites: [],
    xpReward: 150,
    status: 'completed',
    x: 80,
    y: 120,
    icon: '01'
  },
  {
    id: 'bool_algebra',
    title: 'Boolean Algebra & Gates',
    category: 'Foundation',
    hub: 'academic',
    description: 'De Morgan’s theorems, universal NAND/NOR gates, and truth tables.',
    prerequisites: ['bin_logic'],
    xpReward: 200,
    status: 'completed',
    x: 240,
    y: 120,
    icon: '⚡'
  },
  // 2. Intermediate
  {
    id: 'kmap_min',
    title: 'K-Map Minimization',
    category: 'Intermediate',
    hub: 'academic',
    description: '2, 3, and 4-variable Karnaugh Maps, grouping, and SOP/POS expressions.',
    prerequisites: ['bool_algebra'],
    xpReward: 250,
    status: 'unlocked',
    x: 400,
    y: 120,
    icon: '🗺️'
  },
  {
    id: 'comb_circuits',
    title: 'Adders & Multiplexers',
    category: 'Intermediate',
    hub: 'academic',
    description: 'Half/Full Adders, Decoders, Encoders, and MUX/DEMUX logic.',
    prerequisites: ['kmap_min'],
    xpReward: 300,
    status: 'locked',
    x: 560,
    y: 80,
    icon: '🔌'
  },
  // 3. Advanced
  {
    id: 'seq_circuits',
    title: 'Flip-Flops & Registers',
    category: 'Advanced',
    hub: 'academic',
    description: 'SR, JK, D, and T flip-flops, race-around conditions, and shift registers.',
    prerequisites: ['comb_circuits'],
    xpReward: 400,
    status: 'locked',
    x: 720,
    y: 80,
    icon: '🔄'
  },
  {
    id: 'counters_syn',
    title: 'Synchronous Counters',
    category: 'Advanced',
    hub: 'academic',
    description: 'Mod-N ripple counters, ring counters, and state diagram synthesis.',
    prerequisites: ['seq_circuits'],
    xpReward: 450,
    status: 'locked',
    x: 880,
    y: 120,
    icon: '⏱️'
  },
  // 4. Expert & Master
  {
    id: 'arch_viva',
    title: 'Computer Architecture Capstone',
    category: 'Expert',
    hub: 'academic',
    description: 'Von Neumann vs Harvard architecture, ALU design, and bus control lines.',
    prerequisites: ['counters_syn'],
    xpReward: 600,
    status: 'locked',
    x: 1040,
    y: 120,
    icon: '🏛️'
  },
  {
    id: 'academic_boss',
    title: 'BCA Verse Grand Viva Boss',
    category: 'Master',
    hub: 'academic',
    description: '20-question comprehensive timed examination to earn the Academic Scholar Certificate.',
    prerequisites: ['arch_viva'],
    xpReward: 1000,
    status: 'locked',
    x: 1200,
    y: 120,
    icon: '👑'
  }
];

// Programming Hub Skill Tree Configuration
export const PROGRAMMING_SKILL_NODES: SkillNodeConfig[] = [
  {
    id: 'c_basics',
    title: 'C Syntax & Variables',
    category: 'Foundation',
    hub: 'programming',
    description: 'Data types, format specifiers, operators, and I/O streams.',
    prerequisites: [],
    xpReward: 150,
    status: 'completed',
    x: 80,
    y: 120,
    icon: '💻'
  },
  {
    id: 'c_control',
    title: 'Control Flow & Loops',
    category: 'Foundation',
    hub: 'programming',
    description: 'If-else, switch case, while, do-while, and nested for loops.',
    prerequisites: ['c_basics'],
    xpReward: 200,
    status: 'completed',
    x: 240,
    y: 120,
    icon: '🔁'
  },
  {
    id: 'c_arrays',
    title: 'Arrays & Strings',
    category: 'Intermediate',
    hub: 'programming',
    description: '1D/2D arrays, matrix arithmetic, and null-terminated string manipulation.',
    prerequisites: ['c_control'],
    xpReward: 250,
    status: 'completed',
    x: 400,
    y: 120,
    icon: '📊'
  },
  {
    id: 'c_pointers',
    title: 'Pointers & Memory Addresses',
    category: 'Intermediate',
    hub: 'programming',
    description: 'Pointer arithmetic, dereferencing, double pointers, and call-by-reference.',
    prerequisites: ['c_arrays'],
    xpReward: 350,
    status: 'completed',
    x: 560,
    y: 120,
    icon: '🎯'
  },
  {
    id: 'c_dma',
    title: 'Dynamic Memory (malloc/free)',
    category: 'Advanced',
    hub: 'programming',
    description: 'Heap allocation with malloc, calloc, realloc, and memory leak prevention.',
    prerequisites: ['c_pointers'],
    xpReward: 400,
    status: 'unlocked',
    x: 720,
    y: 80,
    icon: '🧠'
  },
  {
    id: 'c_structs',
    title: 'Structures, Unions & Files',
    category: 'Advanced',
    hub: 'programming',
    description: 'Custom typedefs, bit fields, file handles, and binary I/O.',
    prerequisites: ['c_dma'],
    xpReward: 450,
    status: 'locked',
    x: 880,
    y: 80,
    icon: '📁'
  },
  {
    id: 'dsa_core',
    title: 'Linked Lists & Stacks',
    category: 'Expert',
    hub: 'programming',
    description: 'Singly/doubly linked lists, stack push/pop, queues, and recursion.',
    prerequisites: ['c_structs'],
    xpReward: 600,
    status: 'locked',
    x: 1040,
    y: 120,
    icon: '⛓️'
  },
  {
    id: 'c_boss',
    title: 'Final Boss: C Master Architect',
    category: 'Master',
    hub: 'programming',
    description: 'Comprehensive 20-question C & DSA Challenge for Gold Certification.',
    prerequisites: ['dsa_core'],
    xpReward: 1000,
    status: 'locked',
    x: 1200,
    y: 120,
    icon: '🏆'
  }
];

// Cybersecurity Hub Skill Tree Configuration
export const CYBER_SKILL_NODES: SkillNodeConfig[] = [
  {
    id: 'cyber_osi',
    title: 'Networking & Port Fundamentals',
    category: 'Foundation',
    hub: 'cyber',
    description: 'TCP/UDP sockets, DNS resolution, and 3-way handshakes.',
    prerequisites: [],
    xpReward: 150,
    status: 'completed',
    x: 80,
    y: 120,
    icon: '🌐'
  },
  {
    id: 'cyber_recon',
    title: 'Reconnaissance & OSINT',
    category: 'Foundation',
    hub: 'cyber',
    description: 'Passive domain enumeration, WHOIS querying, and DNS harvesting.',
    prerequisites: ['cyber_osi'],
    xpReward: 200,
    status: 'completed',
    x: 240,
    y: 120,
    icon: '🔍'
  },
  {
    id: 'cyber_crypto',
    title: 'Cryptography & Hashes',
    category: 'Intermediate',
    hub: 'cyber',
    description: 'AES-256, RSA asymmetric keys, SHA-256 hashing, and salting.',
    prerequisites: ['cyber_recon'],
    xpReward: 300,
    status: 'completed',
    x: 400,
    y: 120,
    icon: '🔐'
  },
  {
    id: 'cyber_websec',
    title: 'Web Security & Injection',
    category: 'Intermediate',
    hub: 'cyber',
    description: 'SQL Injection defense, Cross-Site Scripting (XSS), and CSRF tokens.',
    prerequisites: ['cyber_crypto'],
    xpReward: 350,
    status: 'unlocked',
    x: 560,
    y: 80,
    icon: '🛡️'
  },
  {
    id: 'cyber_forensics',
    title: 'Android & Digital Forensics',
    category: 'Advanced',
    hub: 'cyber',
    description: 'Investigating mmssms.db, Chrome WebKit logs, and DropBox crash traces.',
    prerequisites: ['cyber_websec'],
    xpReward: 450,
    status: 'unlocked',
    x: 720,
    y: 80,
    icon: '🕵️'
  },
  {
    id: 'cyber_malware',
    title: 'Ransomware & Kill Chain Defense',
    category: 'Advanced',
    hub: 'cyber',
    description: 'MITRE ATT&CK mapping, double extortion triage, and containment.',
    prerequisites: ['cyber_forensics'],
    xpReward: 500,
    status: 'locked',
    x: 880,
    y: 120,
    icon: '☣️'
  },
  {
    id: 'cyber_soc',
    title: 'SIEM Triage & Threat Hunting',
    category: 'Expert',
    hub: 'cyber',
    description: 'Sysmon telemetry correlation, Sigma rules, and EDR containment.',
    prerequisites: ['cyber_malware'],
    xpReward: 650,
    status: 'locked',
    x: 1040,
    y: 120,
    icon: '📡'
  },
  {
    id: 'cyber_boss',
    title: 'Final Boss: Red-Blue Defender Exam',
    category: 'Master',
    hub: 'cyber',
    description: '20-question high-intensity cybersecurity simulation and certification.',
    prerequisites: ['cyber_soc'],
    xpReward: 1000,
    status: 'locked',
    x: 1200,
    y: 120,
    icon: '👑'
  }
];

export const SkillTreeEngine: React.FC<SkillTreeProps> = ({
  hub = 'academic',
  title = 'BCA Computer Science & Cyber Skill Tree',
  subtitle = 'Interactive competency roadmap with tier prerequisites and exam bosses',
  onLaunchSkillTopic,
  onStartBossChallenge
}) => {
  const { skillNodesProgress, completeSkillNode } = useGamificationStore();
  const [selectedNode, setSelectedNode] = useState<SkillNodeConfig | null>(null);

  // Pick node set based on hub
  const rawNodes =
    hub === 'academic'
      ? ACADEMIC_SKILL_NODES
      : hub === 'programming'
      ? PROGRAMMING_SKILL_NODES
      : CYBER_SKILL_NODES;

  // Compute live node status based on store progress & prerequisites
  const nodes: SkillNodeConfig[] = rawNodes.map((n) => {
    // If explicitly completed in store
    if (skillNodesProgress[n.id] === 'completed') {
      return { ...n, status: 'completed' };
    }
    // Check if prerequisites are all completed
    const prereqsMet =
      n.prerequisites.length === 0 ||
      n.prerequisites.every((p) => skillNodesProgress[p] === 'completed');

    if (prereqsMet) {
      return { ...n, status: 'unlocked' };
    }
    return { ...n, status: 'locked' };
  });

  const completedCount = nodes.filter((n) => n.status === 'completed').length;
  const progressPercent = Math.round((completedCount / nodes.length) * 100);

  return (
    <div className="bg-[#070D1B] border border-cyan-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              RPG Skill Tree Engine
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Tier Progression
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        {/* Live Mastery Meter */}
        <div className="bg-black/60 border border-slate-800 p-3 rounded-2xl flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400">Hub Skill Mastery</div>
            <div className="text-base font-bold text-cyan-300">
              {completedCount} / {nodes.length} Nodes ({progressPercent}%)
            </div>
          </div>
          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* SVG Canvas Skill Tree Graph (Horizontal scrollable on mobile) */}
      <div className="relative overflow-x-auto bg-black/70 rounded-2xl border border-slate-800/80 p-4 scrollbar-thin">
        <div className="min-w-[1300px] h-[240px] relative">
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            {/* Draw connecting bezier links between nodes */}
            {nodes.map((node) => {
              return node.prerequisites.map((prereqId) => {
                const parent = nodes.find((n) => n.id === prereqId);
                if (!parent) return null;

                const isConnectedCompleted =
                  parent.status === 'completed' && node.status === 'completed';
                const isConnectedUnlocked =
                  parent.status === 'completed' && node.status === 'unlocked';

                const startX = parent.x + 30;
                const startY = parent.y + 30;
                const endX = node.x + 30;
                const endY = node.y + 30;

                const midX = (startX + endX) / 2;

                return (
                  <path
                    key={`${parent.id}->${node.id}`}
                    d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke={
                      isConnectedCompleted
                        ? '#10b981'
                        : isConnectedUnlocked
                        ? '#06b6d4'
                        : '#334155'
                    }
                    strokeWidth={isConnectedCompleted ? 3 : 2}
                    strokeDasharray={isConnectedCompleted ? 'none' : '4,4'}
                    className={isConnectedUnlocked ? 'animate-pulse' : ''}
                  />
                );
              });
            })}
          </svg>

          {/* Render Interactive Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isCompleted = node.status === 'completed';
            const isUnlocked = node.status === 'unlocked';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group focus:outline-none"
              >
                {/* Node Outer Ring */}
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono transition-all duration-300 relative ${
                    isCompleted
                      ? 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-950/60 ring-2 ring-emerald-500/20'
                      : isUnlocked
                      ? 'bg-cyan-950/90 border-2 border-cyan-400 text-cyan-200 shadow-xl shadow-cyan-950/80 animate-pulse ring-4 ring-cyan-500/30'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-500 opacity-60 hover:opacity-90'
                  } ${isSelected ? 'scale-110 ring-4 ring-amber-400' : 'group-hover:scale-105'}`}
                >
                  <span className="text-xl">{node.icon || '📌'}</span>
                  <span className="text-[9px] font-bold mt-0.5 truncate max-w-[56px] text-center">
                    {node.category}
                  </span>

                  {/* Corner Status Badge */}
                  <div className="absolute -top-1.5 -right-1.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                    ) : isUnlocked ? (
                      <Unlock className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </div>

                {/* Node Title Below */}
                <div className="w-28 text-center mt-2 -ml-6">
                  <div
                    className={`text-[11px] font-bold leading-tight truncate ${
                      isCompleted ? 'text-emerald-300' : isUnlocked ? 'text-cyan-200' : 'text-slate-500'
                    }`}
                  >
                    {node.title}
                  </div>
                  <div className="text-[9px] text-slate-400">+{node.xpReward} XP</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Detailed Inspector */}
      {selectedNode && (
        <div className="bg-black/60 border border-slate-800 p-5 rounded-2xl animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-slate-800 text-cyan-300">
                Tier: {selectedNode.category}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                  selectedNode.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : selectedNode.status === 'unlocked'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                Status: {selectedNode.status.toUpperCase()}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Reward: +{selectedNode.xpReward} XP
              </span>
            </div>

            <h4 className="text-lg font-bold text-white font-mono">{selectedNode.title}</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {selectedNode.description}
            </p>

            {selectedNode.prerequisites.length > 0 && (
              <div className="text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Prerequisites Required: </span>
                {selectedNode.prerequisites.map((p) => {
                  const reqNode = nodes.find((n) => n.id === p);
                  const isPrereqDone = skillNodesProgress[p] === 'completed';
                  return (
                    <span
                      key={p}
                      className={`inline-block mr-2 px-1.5 py-0.5 rounded text-[10px] ${
                        isPrereqDone
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {reqNode?.title || p} {isPrereqDone ? '✓' : '🔒'}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
            {selectedNode.status === 'completed' ? (
              <button
                disabled
                className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 cursor-default"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Node Mastered</span>
              </button>
            ) : selectedNode.status === 'unlocked' ? (
              <button
                onClick={() => {
                  completeSkillNode(selectedNode.id, selectedNode.xpReward);
                  onLaunchSkillTopic?.(selectedNode.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg shadow-cyan-950 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Lesson &amp; Claim +{selectedNode.xpReward} XP</span>
              </button>
            ) : (
              <div className="text-[11px] text-rose-400 flex items-center gap-1.5 bg-rose-950/40 px-3 py-2 rounded-xl border border-rose-800">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Complete preceding nodes to unlock this mastery tier</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
