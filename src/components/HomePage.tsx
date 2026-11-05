import React, { useState } from 'react';
import {
  Cpu,
  Terminal,
  ArrowRight,
  Zap,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  FileText,
  Calculator as CalcIcon,
  Shield,
  Bot,
  Wrench,
  Compass,
  Trophy,
  Activity,
  Heart,
  Globe,
  Database,
  Lock,
  Server,
  Cloud,
  Box,
  Eye,
  Radio,
  Gamepad2,
  Smartphone
} from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';
import { OmnitrixLogo } from './OmnitrixLogo';
import { ActiveTab } from './Navbar';
import { OsWidgets } from './OsWidgets';
import { CurrentAppType } from './AppSwitcherModal';

interface HomePageProps {
  onNavigate: (tab: ActiveTab, prefill?: { type?: string; input?: string; cProgramId?: string }) => void;
  onOpenCompiler?: () => void;
  onOpenCyber?: () => void;
  onOpenDevForge?: () => void;
  onOpenTechMaster?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
  onOpenAppSwitcher?: () => void;
  onOpenRoadmap?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenCompiler,
  onOpenCyber,
  onOpenDevForge,
  onOpenTechMaster,
  onSelectApp,
  onOpenAppSwitcher,
  onOpenRoadmap
}) => {
  const [activeHubFilter, setActiveHubFilter] = useState<'all' | 'academic' | 'cyber' | 'labs' | 'dev' | 'tools'>('all');

  const launchApp = (appId: CurrentAppType, hashFallback?: string) => {
    if (onSelectApp) {
      onSelectApp(appId);
    } else if (hashFallback && typeof window !== 'undefined') {
      window.location.hash = hashFallback;
    }
  };

  const quickSolvers = [
    { label: '25.625 to Binary (Point)', type: 'dec-to-bin', input: '25.625' },
    { label: '11001.101 to Decimal', type: 'bin-to-dec', input: '11001.101' },
    { label: 'Binary Add: 1011 + 0101', type: 'bin-add', input: '1011', input2: '0101' },
    { label: 'Binary Mul: 1011 × 101', type: 'bin-mul', input: '1011', input2: '101' },
    { label: 'Octal Add: 75 + 24', type: 'oct-add', input: '75', input2: '24' },
    { label: 'Octal Mul: 25 × 5', type: 'oct-mul', input: '25', input2: '5' },
    { label: 'Hex Add: A5 + 1F', type: 'hex-add', input: 'A5', input2: '1F' },
    { label: 'Hex Mul: 1A × B', type: 'hex-mul', input: '1A', input2: 'B' },
    { label: "1's & 2's Comp of 1010", type: 'complements', input: '1010' },
    { label: 'AND Gate Truth Table', type: 'logic-gates', input: 'AND' }
  ];

  const quickPrograms = [
    { title: 'Fibonacci Series', id: 'fibonacci-series' },
    { title: 'Prime Number', id: 'prime-number' },
    { title: 'Bubble Sort', id: 'bubble-sort' },
    { title: 'Palindrome Check', id: 'palindrome-number' },
    { title: 'Armstrong Number', id: 'armstrong-number' },
    { title: 'Matrix Multiplication', id: 'matrix-multiplication' }
  ];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-100">
      {/* 🚀 HERO SECTION: ZERO-TO-HERO UNIVERSITY */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/70 p-6 sm:p-10 border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300">
              <OmnitrixLogo size="xs" glow={false} />
              <span>Zero-to-Hero University · 70+ Modules Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Master Computer Science &amp; Cyber Defense{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Priority-Ordered Learning
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
              Step-by-step curriculum organized into 5 clean hubs. Follow your personalized roadmap from beginner basics to advanced quantum and threat intelligence simulators.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenRoadmap ? onOpenRoadmap() : launchApp('roadmap' as any, '#roadmap')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:gap-3 cursor-pointer active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>Open My Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => launchApp('exam', '#exam')}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>BCA Exam Suite</span>
              </button>

              <button
                onClick={() => launchApp('technagar', '#technagar')}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>TechNagar Story Mode</span>
              </button>
            </div>
          </div>

          {/* Hero Stats Card */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 shadow-2xl backdrop-blur-md shrink-0 text-center space-y-2">
            <OmnitrixLogo size="xl" glow={true} animated={true} />
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest pt-2">
              70+ Interactive Modules
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              60 FPS Zero-Lag Architecture
            </div>
          </div>
        </div>
      </section>

      {/* 🧭 SECTION NAVIGATION TABS (Desktop & Mobile) */}
      <div className="sticky top-14 z-30 py-2 bg-slate-950/90 backdrop-blur-md border-y border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: '🌟 All 5 Hubs' },
          { id: 'academic', label: '🎓 1. Academic & Basics' },
          { id: 'cyber', label: '🛡️ 2. Cybersecurity Hub' },
          { id: 'labs', label: '🧪 3. Advanced Tech Labs' },
          { id: 'dev', label: '🛠️ 4. Dev & Cloud Hub' },
          { id: 'tools', label: '🧘 5. Standalone Tools' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveHubFilter(tab.id as any)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeHubFilter === tab.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🎓 HUB 1: ACADEMIC & BASICS HUB (START HERE) */}
      {(activeHubFilter === 'all' || activeHubFilter === 'academic') && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/40 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Hub 1 · Learning Priority 1 (Start Here)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Academic &amp; Computer Basics Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Foundations to advanced syllabus: Story mode, C logic, DBMS, Operating Systems, and DSA.
              </p>
            </div>
            <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-indigo-950 border border-indigo-700 text-indigo-300">
              Level 1 to Level 3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LEVEL 1: BEGINNER */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-emerald-500/30 flex flex-col justify-between shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                    Level 1 · Beginner
                  </span>
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white">TechNagar &amp; Computer Fundamentals</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start your journey: 18-chapter comic story mode, Von Neumann architecture, logic gates truth tables, and number conversions.
                </p>
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Story Mode, C Fundamentals, Logic Gates</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => launchApp('technagar', '#technagar')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition cursor-pointer"
                >
                  TechNagar Story
                </button>
                <button
                  onClick={() => onNavigate('logic-solver')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Logic Solver
                </button>
              </div>
            </div>

            {/* LEVEL 2: INTERMEDIATE */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-blue-500/30 flex flex-col justify-between shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 border border-blue-700 text-blue-300">
                    Level 2 · Intermediate
                  </span>
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-white">DBMS, OS &amp; Multi-Lang Playground</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive ER diagrams, SQL joins, CPU Gantt scheduling visualizer (Round Robin/FCFS), Python, and Java code execution.
                </p>
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-blue-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ER Diagrams, CPU Gantt, 6 Semesters</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => launchApp('python', '#python')}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center transition cursor-pointer"
                >
                  DBMS &amp; OS Suite
                </button>
                <button
                  onClick={() => launchApp('playground', '#playground')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Playground
                </button>
              </div>
            </div>

            {/* LEVEL 3: ADVANCED */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-purple-500/30 flex flex-col justify-between shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 border border-purple-700 text-purple-300">
                    Level 3 · Advanced
                  </span>
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white">DSA Lab &amp; Placement Preparation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Step-by-step sorting algorithms with live array bars, tree rotations, HR tech interview questions, and placement mock exams.
                </p>
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-purple-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>DSA Visualizer, Placement Prep, Doubt AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => launchApp('dsa', '#dsa')}
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold text-center transition cursor-pointer"
                >
                  DSA Lab
                </button>
                <button
                  onClick={() => launchApp('placement', '#placement')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  Placement Hub
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🛡️ HUB 2: CYBERSECURITY HUB (STEP-BY-STEP) */}
      {(activeHubFilter === 'all' || activeHubFilter === 'cyber') && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-900/40 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1">
                <Shield className="w-4 h-4" />
                <span>Hub 2 · Learning Priority 2 (Step-by-Step Defense)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Cybersecurity &amp; Defensive Warfare Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                100% defensive educational simulators: Linux CLI, CyberShield, Cryptography, SS7 Matrix, and MobileSec.
              </p>
            </div>
            <span className="self-start sm:self-center px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 border border-rose-700 text-rose-300">
              Defensive Matrix
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LEVEL 1: LINUX & NETWORKING BASICS */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 flex flex-col justify-between shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                    Level 1 · Terminal &amp; Networks
                  </span>
                  <Terminal className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-white">Linux Mastery &amp; Networking Visualizer</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Master bash commands, chmod permissions, and inspect live packet flows across OSI 7 layers and TCP/IP 3-way handshakes.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => launchApp('linux', '#linux')}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition cursor-pointer"
                >
                  Linux Terminal
                </button>
                <button
                  onClick={() => launchApp('netviz', '#netviz')}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition cursor-pointer"
                >
                  NetViz Lab
                </button>
              </div>
            </div>

            {/* LEVEL 2: DEFENSE, CRYPTO & RECON */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 flex flex-col justify-between shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 border border-blue-700 text-blue-300">
                    Level 2 · Defense &amp; Cryptography
                  </span>
                  <Lock className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-white">CyberShield &amp; Crypto Master Lab</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive defensive WAF rules, SQL injection sanitization, RSA/AES cipher simulations, and OSINT reconnaissance.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => launchApp('cyber', '#cyber')}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  CyberShield
                </button>
                <button
                  onClick={() => launchApp('cryptomaster', '#crypto')}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-blue-500/30 text-blue-300 text-xs font-bold transition cursor-pointer"
                >
                  Crypto Lab
                </button>
              </div>
            </div>

            {/* LEVEL 3: CYBERCRIME MATRIX & MOBILESEC */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-rose-500/40 flex flex-col justify-between shadow-xl space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 border border-rose-700 text-rose-300">
                    Level 3 · Advanced Threat Intel
                  </span>
                  <Smartphone className="w-4 h-4 text-rose-400" />
                </div>
                <h3 className="text-base font-bold text-white">CyberCrime Matrix &amp; MobileSec Lab</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interactive SVG architecture of SS7 SIM swapping, voice cloning waveforms, Android SQLite forensic triage, and SIEM rules.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => launchApp('crimematrix', '#crimematrix')}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Crime Matrix
                </button>
                <button
                  onClick={() => launchApp('mobilesec', '#mobilesec')}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
                >
                  MobileSec Lab
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🧪 HUB 3: ADVANCED TECH LABS */}
      {(activeHubFilter === 'all' || activeHubFilter === 'labs') && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-900/40 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span>Hub 3 · Advanced Engineering Labs</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Emerging Tech &amp; Hardware Physics Labs
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                3D Quantum Bloch Sphere, System Design Canvas, Drone Aerodynamics, and Satellite GEOINT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quantum Visualizer */}
            <div
              onClick={() => launchApp('quantum', '#quantum')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/60 shadow-lg cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Quantum Visualizer</h3>
              <p className="text-xs text-slate-400">3D Bloch sphere qubit superposition &amp; Hadamard gates.</p>
            </div>

            {/* System Design Canvas */}
            <div
              onClick={() => launchApp('sysdesign', '#sysdesign')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-400/60 shadow-lg cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">System Design Canvas</h3>
              <p className="text-xs text-slate-400">Drag-and-drop microservices with live load simulation.</p>
            </div>

            {/* Drone Robotics */}
            <div
              onClick={() => launchApp('robotics', '#robotics')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-400/60 shadow-lg cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Robotics &amp; Drone Physics</h3>
              <p className="text-xs text-slate-400">2D quadcopter canvas aerodynamics and PID control.</p>
            </div>

            {/* Hardware & IoT Lab */}
            <div
              onClick={() => launchApp('iot', '#iot')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/60 shadow-lg cursor-pointer transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Hardware &amp; IoT Lab</h3>
              <p className="text-xs text-slate-400">Pinouts, breadboard GPIO simulator &amp; oscilloscope.</p>
            </div>
          </div>
        </section>
      )}

      {/* 🛠️ HUB 4: DEVELOPER & CLOUD HUB */}
      {(activeHubFilter === 'all' || activeHubFilter === 'dev') && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/40 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-1">
                <Wrench className="w-4 h-4" />
                <span>Hub 4 · Cloud Infrastructure &amp; DevOps</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Developer &amp; Cloud Operations Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Git pipelines, Docker container isolation, Kubernetes pods, and Cloud IAM least-privilege policies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => launchApp('cicd', '#cicd')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Git &amp; CI/CD Pipelines</h3>
              <p className="text-xs text-slate-400">Build, test, deploy workflows with real status indicators.</p>
            </div>

            <div
              onClick={() => launchApp('containers', '#containers')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-3">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Docker &amp; K8s Simulator</h3>
              <p className="text-xs text-slate-400">Container runtime, pod scaling, and load-balancer routes.</p>
            </div>

            <div
              onClick={() => launchApp('apix', '#apix')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">API-X Client &amp; Testing</h3>
              <p className="text-xs text-slate-400">Postman-style REST client with headers and JWT auth.</p>
            </div>

            <div
              onClick={() => launchApp('cloudiam', '#cloudiam')}
              className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3">
                <Cloud className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Cloud IAM Policy Studio</h3>
              <p className="text-xs text-slate-400">JSON policy evaluation, privilege escalation &amp; RBAC audit.</p>
            </div>
          </div>
        </section>
      )}

      {/* 🧘 HUB 5: STANDALONE / LIFE TOOLS */}
      {(activeHubFilter === 'all' || activeHubFilter === 'tools') && (
        <section className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-900/40 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 mb-1">
                <Heart className="w-4 h-4" />
                <span>Hub 5 · Standalone Utility &amp; Life Tools</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Clinical, Poetry, Vault &amp; Wellness Suite
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Distinct life &amp; productivity applications built right into the ecosystem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* MediCore Pro */}
            <div
              onClick={() => launchApp('medicore', '#medicore')}
              className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-teal-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-500/40 flex items-center justify-center text-teal-300 mb-2.5">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">MediCore Pro</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Doctor clinic prescription desk &amp; vitals tracker.</p>
            </div>

            {/* Sukhan Poetry */}
            <div
              onClick={() => launchApp('sukhan', '#sukhan')}
              className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-2.5">
                <SukhanPenIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Sukhan AI Poetry</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Urdu &amp; Hindi sher, ghazal and meter meter studio.</p>
            </div>

            {/* CalcVault */}
            <div
              onClick={() => launchApp('calc', '#calc')}
              className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-2.5">
                <CalcIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">CalcVault Messenger</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Camouflaged calculator with secret P2P chat.</p>
            </div>

            {/* TechWealth */}
            <div
              onClick={() => launchApp('wealth', '#wealth')}
              className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-2.5">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">TechWealth Hub</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Engineer net-worth, tax &amp; SIP compound calculator.</p>
            </div>

            {/* ZenFocus */}
            <div
              onClick={() => launchApp('zenfocus', '#zenfocus')}
              className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-400/60 shadow-lg cursor-pointer transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-300 mb-2.5">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">ZenFocus &amp; Breath</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Binaural beats, box breathing, and Pomodoro timer.</p>
            </div>
          </div>
        </section>
      )}

      {/* ⚡ QUICK SOLVERS & C PROGRAMS SHORTCUTS */}
      <section className="bg-slate-900/60 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Instant Quick-Launch Formulas &amp; Programs</h3>
          </div>
          <button
            onClick={() => onNavigate('c-generator')}
            className="text-xs text-cyan-400 hover:underline cursor-pointer"
          >
            View All 45+ Programs &rarr;
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickSolvers.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate('logic-solver', { type: q.type, input: q.input })}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
          {quickPrograms.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate('c-generator', { cProgramId: p.id })}
              className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              💻 {p.title}
            </button>
          ))}
        </div>
      </section>

      {/* 📊 OS WIDGETS SECTION */}
      <OsWidgets
        onLaunchApp={(appId: CurrentAppType) => launchApp(appId)}
      />
    </div>
  );
};
