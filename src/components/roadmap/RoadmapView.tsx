import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Trophy,
  Compass,
  Layers,
  Shield,
  Cpu,
  Lock,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import { CurrentAppType } from '../AppSwitcherModal';

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  level: 'Beginner' | 'Intermediate' | 'Pro';
  title: string;
  targetApp: CurrentAppType;
  hash: string;
  category: string;
  description: string;
  keySkills: string[];
  estimatedHours: string;
}

const ROADMAP_STEPS: RoadmapStep[] = [
  // LEVEL 1: FOUNDATION & BASICS
  {
    id: 'step-story',
    stepNumber: 1,
    level: 'Beginner',
    title: 'TechNagar Comic Chronicles',
    targetApp: 'technagar',
    hash: '#technagar',
    category: 'Start Here',
    description: 'Learn Computers, Algorithms & Cyber Ethics through a 18-chapter interactive story with Aarav & Byte.',
    keySkills: ['Computer Concepts', 'Story-Driven Learning', 'Algorithm Mindset'],
    estimatedHours: '3 Hours',
  },
  {
    id: 'step-fundamentals',
    stepNumber: 2,
    level: 'Beginner',
    title: 'Computer Fundamentals & Logic',
    targetApp: 'bca',
    hash: '#fundamentals',
    category: 'Core Foundation',
    description: 'Master Von Neumann architecture, memory hierarchies, logic gates, and number system conversions.',
    keySkills: ['Binary/Hex Arithmetic', 'Logic Gates', 'Memory Hardware'],
    estimatedHours: '5 Hours',
  },
  {
    id: 'step-c-prog',
    stepNumber: 3,
    level: 'Beginner',
    title: 'C Programming & Memory Pointers',
    targetApp: 'compiler',
    hash: '#compiler',
    category: 'Programming',
    description: '45+ compilable C programs with line-by-line logic flow: pointers, structs, loops, and recursion.',
    keySkills: ['GCC Compilation', 'Pointers & Memory', 'Control Structures'],
    estimatedHours: '8 Hours',
  },
  {
    id: 'step-linux',
    stepNumber: 4,
    level: 'Beginner',
    title: 'Linux & Terminal Mastery',
    targetApp: 'linux',
    hash: '#linux',
    category: 'Operating System',
    description: 'Hands-on virtual Kali/Ubuntu bash terminal: chmod permissions, piping, grep, and process management.',
    keySkills: ['Bash CLI', 'File Permissions', 'Process Control'],
    estimatedHours: '4 Hours',
  },

  // LEVEL 2: INTERMEDIATE CORE COMPUTER SCIENCE & DEFENSE
  {
    id: 'step-networking',
    stepNumber: 5,
    level: 'Intermediate',
    title: 'Computer Networking Visualizer',
    targetApp: 'netviz',
    hash: '#netviz',
    category: 'Networking',
    description: 'Interactive OSI 7 layers packet inspector, 3-way TCP handshake visualizer, and IP subnetting calculator.',
    keySkills: ['OSI 7 Layers', 'TCP/IP Protocol', 'Packet Inspection'],
    estimatedHours: '6 Hours',
  },
  {
    id: 'step-database',
    stepNumber: 6,
    level: 'Intermediate',
    title: 'SQL & Database Engine Playground',
    targetApp: 'database',
    hash: '#database',
    category: 'Database Systems',
    description: 'In-browser SQLite/PostgreSQL engine: schema normalization, relational joins, indexing, and transactions.',
    keySkills: ['SQL Joins', 'Database Normalization', 'Index Tuning'],
    estimatedHours: '6 Hours',
  },
  {
    id: 'step-os',
    stepNumber: 7,
    level: 'Intermediate',
    title: 'OS Scheduling & Process Lab',
    targetApp: 'python',
    hash: '#python',
    category: 'Operating Systems',
    description: 'Visual Gantt chart CPU schedulers (FCFS, Round Robin), Banker deadlock algorithm, and paging simulation.',
    keySkills: ['CPU Scheduling', 'Deadlock Detection', 'Memory Paging'],
    estimatedHours: '5 Hours',
  },
  {
    id: 'step-cyber',
    stepNumber: 8,
    level: 'Intermediate',
    title: 'CyberShield Defensive Security Hub',
    targetApp: 'cyber',
    hash: '#cyber',
    category: 'Cyber Defense',
    description: 'Hands-on interactive defense sandbox: port scanning, SQL injection sanitization, XSS mitigation, and WAF rules.',
    keySkills: ['Defensive Security', 'Sanitization', 'Firewall Rules'],
    estimatedHours: '7 Hours',
  },
  {
    id: 'step-crypto',
    stepNumber: 9,
    level: 'Intermediate',
    title: 'Cryptography & Post-Quantum Lab',
    targetApp: 'cryptomaster',
    hash: '#crypto',
    category: 'Information Security',
    description: 'Deep dive into symmetric AES, asymmetric RSA key generation, SHA-256 hashing, and lattice quantum ciphers.',
    keySkills: ['RSA & AES Encryption', 'Hashing & Signatures', 'Quantum Resistance'],
    estimatedHours: '5 Hours',
  },

  // LEVEL 3: ADVANCED LABS & PRO ARCHITECTURE
  {
    id: 'step-dsa',
    stepNumber: 10,
    level: 'Pro',
    title: 'Data Structures & Algorithms Lab',
    targetApp: 'dsa',
    hash: '#dsa',
    category: 'Algorithms',
    description: 'Step-by-step visual sorting algorithms (QuickSort, MergeSort), BST balance rotations, and graph traversals.',
    keySkills: ['Big-O Time Complexity', 'Binary Search Trees', 'Graph Algorithms'],
    estimatedHours: '10 Hours',
  },
  {
    id: 'step-cybercrime',
    stepNumber: 11,
    level: 'Pro',
    title: 'CyberCrime Matrix & MobileSec Lab',
    targetApp: 'crimematrix',
    hash: '#crimematrix',
    category: 'Advanced Threat Intel',
    description: 'SS7 mobile network routing exploits, deepfake audio spectrograms, SMS PDU sniffing, and Android APK triage.',
    keySkills: ['SS7 Interception', 'Mobile Triage', 'RAT Detection'],
    estimatedHours: '6 Hours',
  },
  {
    id: 'step-forensics',
    stepNumber: 12,
    level: 'Pro',
    title: 'Digital Forensics & SIEM SOC Lab',
    targetApp: 'forensics',
    hash: '#forensics',
    category: 'Incident Response',
    description: 'Volatile RAM memory forensics, Wireshark PCAP log triage, and SIEM rule correlation for real threat hunts.',
    keySkills: ['Memory Extraction', 'PCAP Analysis', 'SOC Incident Response'],
    estimatedHours: '6 Hours',
  },
  {
    id: 'step-cloud',
    stepNumber: 13,
    level: 'Pro',
    title: 'DevSecOps, Docker & Cloud IAM',
    targetApp: 'cicd',
    hash: '#cicd',
    category: 'Cloud Infrastructure',
    description: 'Automated CI/CD security pipelines, Docker container isolation, Kubernetes pod orchestration, and IAM policies.',
    keySkills: ['Containerization', 'CI/CD Pipelines', 'Least Privilege IAM'],
    estimatedHours: '7 Hours',
  },
  {
    id: 'step-quantum',
    stepNumber: 14,
    level: 'Pro',
    title: 'Quantum Computing & Robotics Simulator',
    targetApp: 'quantum',
    hash: '#quantum',
    category: 'Emerging Tech',
    description: '3D Bloch Sphere quantum qubit state rotations, Hadamard gates, and 2D quadcopter PID aerodynamic physics.',
    keySkills: ['Quantum Superposition', 'PID Drone Control', 'Physics Simulation'],
    estimatedHours: '6 Hours',
  },
  {
    id: 'step-boss',
    stepNumber: 15,
    level: 'Pro',
    title: 'Final Boss Exam & Master Certification',
    targetApp: 'exam',
    hash: '#exam',
    category: 'University Capstone',
    description: 'Comprehensive 6-Semester adaptive exam engine. Earn your verified cryptographic digital certificate!',
    keySkills: ['Comprehensive CS Synthesis', 'Speed & Accuracy', 'Honor Certificate'],
    estimatedHours: '4 Hours',
  },
];

interface RoadmapViewProps {
  onSelectApp: (app: CurrentAppType) => void;
  onBackToHome: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onSelectApp, onBackToHome }) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('university_completed_steps');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Defaults with first 2 steps completed as a warm start
    return ['step-story', 'step-fundamentals'];
  });

  const [activeFilter, setActiveFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Pro'>('All');

  useEffect(() => {
    try {
      localStorage.setItem('university_completed_steps', JSON.stringify(completedSteps));

      // Calculate user level and store
      const ratio = completedSteps.length / ROADMAP_STEPS.length;
      let levelTitle = 'Beginner Scholar';
      if (ratio >= 0.7) levelTitle = 'Pro Full-Stack Architect';
      else if (ratio >= 0.35) levelTitle = 'Intermediate Engineer';

      localStorage.setItem('user_university_level', levelTitle);
    } catch {}
  }, [completedSteps]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleReset = () => {
    if (confirm('Reset your roadmap progress to beginning?')) {
      setCompletedSteps([]);
    }
  };

  const progressPercent = Math.round((completedSteps.length / ROADMAP_STEPS.length) * 100);

  const userRank =
    progressPercent >= 70
      ? { title: 'Pro Full-Stack Architect', badge: '🥇 Pro', color: 'from-amber-400 to-yellow-600' }
      : progressPercent >= 35
      ? { title: 'Intermediate Engineer', badge: '🥈 Intermediate', color: 'from-cyan-400 to-blue-600' }
      : { title: 'Beginner Explorer', badge: '🥉 Beginner', color: 'from-emerald-400 to-teal-600' };

  const filteredSteps =
    activeFilter === 'All'
      ? ROADMAP_STEPS
      : ROADMAP_STEPS.filter((s) => s.level === activeFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-100">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>Zero-to-Hero University Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              My Learning Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Step-by-step master path through all 70+ modules. Complete steps sequentially from Beginner to Pro to unlock mastery!
            </p>
          </div>

          {/* Level Progress Card */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shrink-0 min-w-[260px] shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Current Standing
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${userRank.color}`}>
                {userRank.badge}
              </span>
            </div>
            <div className="text-base font-bold text-white mb-2">{userRank.title}</div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>{completedSteps.length} of {ROADMAP_STEPS.length} Completed</span>
                <span className="font-bold text-cyan-400">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['All', 'Beginner', 'Intermediate', 'Pro'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Step by Step Vertical Timeline */}
      <div className="space-y-4">
        {filteredSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isNextInLine = !isCompleted && completedSteps.length === step.stepNumber - 1;

          return (
            <div
              key={step.id}
              className={`relative rounded-3xl transition-all duration-200 border p-5 sm:p-6 backdrop-blur-xl ${
                isCompleted
                  ? 'bg-slate-900/60 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                  : isNextInLine
                  ? 'bg-slate-900/90 border-cyan-400/60 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Step Info */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Step Ticker / Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    className="mt-1 shrink-0 p-1 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 hover:text-cyan-400 transition" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-cyan-400">
                        STEP {step.stepNumber.toString().padStart(2, '0')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          step.level === 'Beginner'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : step.level === 'Intermediate'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {step.level}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        · {step.category} · {step.estimatedHours}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold ${isCompleted ? 'text-slate-300 line-through decoration-emerald-500/50' : 'text-white'}`}>
                      {step.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                      {step.description}
                    </p>

                    {/* Key Skills Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {step.keySkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Launch Action Button */}
                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      if (window.location) {
                        window.location.hash = step.hash;
                      }
                      onSelectApp(step.targetApp);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                      isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : isNextInLine
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20 active:scale-95'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
