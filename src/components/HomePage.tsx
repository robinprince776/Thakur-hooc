import React from 'react';
import { Cpu, Terminal, ArrowRight, Zap, CheckCircle2, BookOpen, Sparkles, Layers, GraduationCap, FileText, Calculator as CalcIcon, Shield, Bot, Wrench } from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';
import { OmnitrixLogo } from './OmnitrixLogo';
import { ActiveTab } from './Navbar';

interface HomePageProps {
  onNavigate: (tab: ActiveTab, prefill?: { type?: string; input?: string; cProgramId?: string }) => void;
  onOpenCompiler?: () => void;
  onOpenCyber?: () => void;
  onOpenDevForge?: () => void;
  onOpenTechMaster?: () => void;
  onSelectApp?: (appId: any) => void;
  onOpenAppSwitcher?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenCompiler,
  onOpenCyber,
  onOpenDevForge,
  onOpenTechMaster,
  onSelectApp,
  onOpenAppSwitcher
}) => {
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

  const quickFundamentals = [
    { label: 'Von Neumann Architecture', id: 'intro-and-characteristics' },
    { label: 'Computer Generations (1st-5th)', id: 'generations-of-computers' },
    { label: 'RAM vs ROM Differences', id: 'classification-of-computers' },
    { label: 'OSI 7 Layers Mnemonic', id: 'cyber-security-and-data' }
  ];

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 sm:p-12 border border-indigo-100/80 dark:border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-xs border border-indigo-100 dark:border-indigo-900/60 mb-5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <OmnitrixLogo size="xs" glow={false} />
              <span>Dedicated study portal for BCA students · Made by Prince Thakur</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Master 3 Core BCA Subjects{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Step-by-Step in Hinglish
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              Logic System conversions with remainder tables, 45+ ready-to-run C Programs with line-by-line logic,
              aur Fundamental of Computer BCA 1st Semester ke Unit 1 se 8 tak ke sabhi exam notes &amp; viva questions!
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('logic-solver')}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all hover:gap-3 cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Logic &amp; Numbers</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('c-generator')}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-all hover:gap-3 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>45+ C Programs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('fundamentals')}
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:gap-3 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Fundamental Notes (3rd Subject)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Omnitrix Emblem Showcase */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md shrink-0">
            <OmnitrixLogo size="2xl" glow={true} animated={true} />
            <div className="mt-3 text-center">
              <span className="block text-xs font-mono font-bold text-lime-400 tracking-widest uppercase">
                Omnitrix Core
              </span>
              <span className="text-[11px] text-slate-400">
                42 Defensive &amp; Dev Tools
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ FLAGSHIP APPLICATIONS & CLINICAL REFERENCE HUB */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Launch · 45 Production Applications</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Flagship Hubs &amp; Clinical Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Direct 1-click access to newly requested modules, clinical reference, civil services, and audio labs.
            </p>
          </div>

          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-2 border border-slate-700 shadow-md cursor-pointer self-start sm:self-auto transition-all"
            >
              <span>View All 45 Apps</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: MediCore Pro */}
          <div
            onClick={() => onSelectApp ? onSelectApp('medicore') : (window.location.hash = '#medicore')}
            className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-teal-500/30 hover:border-teal-500/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 text-lg">
                  🩺
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                  Clinical Desk
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                MediCore Pro
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Complete clinical reference for D-Pharma &amp; clinics. Disease Matrix, Drug Vault, IV Fluid formulas &amp; Rx decoder.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-teal-400 font-bold">
              <span>Open Clinical Desk</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: UPSC CSE Prep */}
          <div
            onClick={() => onSelectApp ? onSelectApp('upsc') : (window.location.hash = '#upsc')}
            className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 text-lg">
                  🏛️
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  Civil Services
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                UPSC CSE Civil Services
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                IAS, IPS &amp; IFS master architecture. GS 1-4 syllabus, topper booklist, P.E.S.T.L.E mains answers &amp; PYQ simulator.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>Launch UPSC Navigator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: SvaraPulse Musicology */}
          <div
            onClick={() => onSelectApp ? onSelectApp('music') : (window.location.hash = '#music')}
            className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-pink-500/30 hover:border-pink-500/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 text-lg">
                  🎵
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold">
                  Audio &amp; Ragas
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                SvaraPulse Musicology
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Playable Web Audio Synthesizer, 10 Thaats, Teentaal metronome, Circle of 5ths, and studio audio mixing masterclass.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-pink-400 font-bold">
              <span>Open Music Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Sukhan Poetry Studio */}
          <div
            onClick={() => onSelectApp ? onSelectApp('sukhan') : (window.location.hash = '#sukhan')}
            className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-[#C6A66B]/30 hover:border-[#C6A66B]/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#59263C] to-[#15151C] border border-[#C6A66B]/40 flex items-center justify-center text-[#C6A66B] shadow-md text-lg">
                  ✍️
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#59263C] text-[#C6A66B] border border-[#C6A66B]/30 font-bold">
                  Literature
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#C6A66B] transition-colors">
                SUKHAN Literary Lounge
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Urdu, Hindi &amp; Punjabi poetry studio, classical typography, Ghazal rhyming assistant, and Instagram card export.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-[#C6A66B] font-bold">
              <span>Enter Sukhan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: C Programming & Algorithm Engine */}
          <div
            onClick={() => onNavigate('c-generator')}
            className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 text-lg">
                  💻
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  Code Studio
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Algorithm &amp; C Generator
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Convert any problem statement to C, C++, Python, Java with line-by-line Hinglish logic &amp; interactive runner.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-bold">
              <span>Open Code Generator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: TechCareer Hub */}
          <div
            onClick={() => onSelectApp ? onSelectApp('career') : (window.location.hash = '#career')}
            className="group p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 backdrop-blur-xl shadow-xl transition-all cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 text-lg">
                  💼
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Careers &amp; Salaries
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                TechCareer Hub
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                6-Month Cybersecurity, Cloud &amp; AI roadmaps, ₹5L to ₹1.5Cr+ salary packages, and simulated interview evaluator.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Explore Roadmaps</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE SUBJECT CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              3 Core Subjects &amp; Engines
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select any subject to start studying immediately
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: Logic & Number System Solver */}
          <div
            onClick={() => onNavigate('logic-solver')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 p-6 shadow-md hover:shadow-xl border border-slate-200/80 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                  Subject 1 · 15 Modes
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Logic &amp; Number Systems
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Base conversions with division remainder tables, fractional/point math, 1's &amp; 2's complement, logic gates &amp; K-Map.
              </p>

              <ul className="mt-4 space-y-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Decimal ↔ Binary, Octal, Hexadecimal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Binary Add, Sub, Mul &amp; Div</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Logic Gates &amp; 2-3 Var K-Maps</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Step-by-step Hinglish</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                Open Solver ➔
              </span>
            </div>
          </div>

          {/* CARD 2: C Programming Code Generator */}
          <div
            onClick={() => onNavigate('c-generator')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 p-6 shadow-md hover:shadow-xl border border-slate-200/80 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <Terminal className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    Subject 2 · 45+
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                C Programming Generator
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                45+ Ready BCA C programs plus custom statement generator that converts any question into clean GCC code &amp; Hinglish logic.
              </p>

              <ul className="mt-4 space-y-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Custom Statement AI Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>1-Click Copy &amp; Download .c File</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Variables &amp; Loop Flow Analysis</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Tested GCC code</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                Browse C Code ➔
              </span>
            </div>
          </div>

          {/* CARD 3: Fundamental of Computer (3rd Subject) */}
          <div
            onClick={() => onNavigate('fundamentals')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 p-6 shadow-md hover:shadow-xl border border-emerald-200/80 dark:border-emerald-800/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  Subject 3 · 8 Units
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Fundamental of Computer
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                BCA 1st Semester complete notes, Von Neumann model, CPU Registers, Memory hierarchy, Operating Systems &amp; Viva Q&amp;A.
              </p>

              <ul className="mt-4 space-y-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Units 1 to 8 Exam Notes in Hinglish</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>RAM/ROM &amp; Generations Tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Exam Viva Questions &amp; Answers</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Complete Syllabus</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                Read Notes ➔
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Jump Shortcuts Section */}
      <section className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quick Try Shortcuts
          </h3>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Popular Number Conversions:
          </div>
          <div className="flex flex-wrap gap-2">
            {quickSolvers.map((item, idx) => (
              <button
                key={idx}
                onClick={() =>
                  onNavigate('logic-solver', {
                    type: item.type,
                    input: item.input
                  })
                }
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Frequently Asked BCA Programs:
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrograms.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('c-generator', { cProgramId: item.id })}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50/50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 transition-colors"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Fundamental of Computer Key Topics:
          </div>
          <div className="flex flex-wrap gap-2">
            {quickFundamentals.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('fundamentals')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated 7-Apps Master Suite */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>Integrated 13-Apps Master Suite</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
                13 Apps Suite
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              BCA Verse, TechMaster 2000+, C Compiler, DevForge, DocuCraft, Git Studio, CyberShield, NetSec, API-X, CloudOps, PromptCraft, CalcVault aur SUKHAN.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* NEW CLINICAL APP: MediCore Pro */}
          <div
            onClick={() => {
              window.location.hash = "medicore";
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-cyan-500/10 dark:from-teal-950/40 dark:via-slate-900/90 dark:to-cyan-950/30 p-5 border-2 border-teal-500/50 hover:border-teal-400 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/40 group-hover:scale-110 transition-transform text-2xl">
                🩺
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-400 transition-colors">
                    MediCore Pro
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    NEW APP
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  D-Pharma Clinical Desk, Drug Vault with Indian brands, IV Fluids &amp; Cannula guide, Rx Decoder, and Paediatric/BSA calculators.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-teal-400 font-semibold text-[11px]">#medicore</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Open MediCore Desk ➔
              </span>
            </div>
          </div>

          {/* OFFLINE APP 1: Scientific Calculator Vault */}
          <div
            onClick={() => {
              window.location.hash = 'calc';
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-amber-500/5 via-slate-50 to-amber-500/10 dark:from-amber-950/20 dark:via-slate-900/80 dark:to-amber-950/10 p-5 border border-amber-300/40 dark:border-amber-700/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:scale-105 transition-transform">
                <CalcIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    CalcVault
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold shrink-0">
                    #calc
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Calculator with sounds, haptics, and stealth PIN vault.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <span>Open Calculator</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* OFFLINE APP 2: Offline Notes & Code Scratchpad */}
          <div
            onClick={() => onNavigate('notes')}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-500/5 via-slate-50 to-emerald-500/10 dark:from-emerald-950/20 dark:via-slate-900/80 dark:to-emerald-950/10 p-5 border border-emerald-300/40 dark:border-emerald-700/40 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Notes Pad
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                    #notes
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Personal notes, C snippets, PIN lock &amp; JS playground.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span>Open Notes Pad</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* OFFLINE APP 3: SUKHAN Literary Lounge */}
          <div
            onClick={() => {
              window.location.hash = 'sukhan';
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#59263C]/10 via-slate-50 to-[#C6A66B]/10 dark:from-[#59263C]/30 dark:via-slate-900/80 dark:to-[#0B0B0F] p-5 border border-[#C6A66B]/50 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#59263C]/30 text-[#C6A66B] flex items-center justify-center shrink-0 border border-[#C6A66B]/40 group-hover:scale-105 transition-transform">
                <SukhanPenIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#C6A66B] transition-colors">
                    SUKHAN
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C6A66B]/20 text-[#C6A66B] font-bold shrink-0">
                    #sukhan
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Mood Shayari Library (Dard, Ishq, Josh, Tanhai), Studio &amp; Card Designer.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-[#C6A66B]">
              <span>Launch SUKHAN</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* OFFLINE APP 4: Simple C Compiler & Execution Engine */}
          <div
            onClick={() => {
              if (onOpenCompiler) onOpenCompiler();
              else window.location.hash = 'compiler';
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-cyan-500/10 via-slate-50 to-blue-500/10 dark:from-cyan-950/30 dark:via-slate-900/80 dark:to-[#070A12] p-5 border border-cyan-400/40 dark:border-cyan-700/50 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-mono font-black text-sm flex items-center justify-center shrink-0 border border-cyan-400/40 group-hover:scale-105 transition-transform shadow-xs">
                C
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    C Compiler
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold shrink-0">
                    #compiler
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  In-browser C runner with interactive scanf, memory watcher &amp; 12+ programs.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-cyan-600 dark:text-cyan-400">
              <span>Launch Compiler</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* OFFLINE APP 5: CyberShield (Cybersecurity Zero to Hero) */}
          <div
            onClick={() => {
              if (onOpenCyber) onOpenCyber();
              else window.location.hash = 'cyber';
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-teal-500/10 dark:from-emerald-950/30 dark:via-slate-900/80 dark:to-[#070A12] p-5 border border-emerald-400/40 dark:border-emerald-700/50 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-black font-black text-sm flex items-center justify-center shrink-0 border border-emerald-400/40 group-hover:scale-105 transition-transform shadow-xs">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    CyberShield
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                    #cyber
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Cybersecurity Zero to Hero in Hinglish, Kali terminal, OWASP labs &amp; certificate.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span>Start Cyber Training</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* OFFLINE APP 6: PromptCraft Pro */}
          <div
            onClick={() => {
              window.location.hash = 'promptcraft';
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-blue-500/10 via-slate-50 to-indigo-500/10 dark:from-blue-950/30 dark:via-slate-900/80 dark:to-[#070A12] p-5 border border-blue-400/40 dark:border-blue-700/50 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-700 text-blue-200 flex items-center justify-center shrink-0 border border-blue-400/40 group-hover:scale-105 transition-transform shadow-xs">
                <Sparkles className="w-5 h-5 text-blue-200" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    PromptCraft Pro
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold shrink-0">
                    #promptcraft
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Role-based system prompts, token estimator, prompt optimizer &amp; 30+ prompt templates.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <span>Launch PromptCraft</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* OFFLINE APP 7: DevForge (Developer Swiss-Army Knife) */}
          <div
            onClick={() => {
              if (onOpenDevForge) onOpenDevForge();
              else window.location.hash = 'dev';
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-indigo-500/10 via-slate-50 to-violet-500/10 dark:from-indigo-950/30 dark:via-slate-900/80 dark:to-[#070A12] p-5 border border-indigo-400/40 dark:border-indigo-700/50 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 border border-indigo-400/40 group-hover:scale-105 transition-transform shadow-xs">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    DevForge
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
                    #dev
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  JSON Studio, live regex tester, Base64/hashes, JWT debugger, REST client &amp; Git lab.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              <span>Launch DevForge</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>

          {/* OFFLINE APP 8: TechMaster 2000+ (Zero to Hero Academy) */}
          <div
            onClick={() => {
              if (onOpenTechMaster) onOpenTechMaster();
              else window.location.hash = 'techmaster';
            }}
            className="group cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-50 to-teal-500/15 dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-[#040E06] p-5 border border-emerald-400/60 dark:border-emerald-500/60 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center shrink-0 border border-emerald-400 group-hover:scale-105 transition-transform shadow-md shadow-emerald-500/30">
                <BookOpen className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span>TechMaster 2000+</span>
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                    #tech
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  2000+ technical questions: Ethical Hacking, Indian Cyber Cell (1930), Supercomputers &amp; Roadmap!
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span>Become Tech Master ➔</span>
              <span className="group-hover:translate-x-1 transition-transform">➔</span>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Feature Quick Access: Formula Sheet */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              BCA Quick Formula &amp; Syntax Sheet
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Powers of 2, Radix table, C Operator Precedence, Format Specifiers, and De Morgan's laws.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('formula-sheet')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
        >
          View Formulas ➔
        </button>
      </section>
    </div>
  );
};
