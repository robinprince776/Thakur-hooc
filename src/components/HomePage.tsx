import React from 'react';
import { Cpu, Terminal, ArrowRight, Zap, CheckCircle2, BookOpen, Sparkles, Binary, Code2, HelpCircle } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HomePageProps {
  onNavigate: (tab: ActiveTab, prefill?: { type?: string; input?: string; cProgramId?: string }) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
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
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 sm:p-12 border border-indigo-100/80 dark:border-indigo-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-xs border border-indigo-100 dark:border-indigo-900/60 mb-5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Dedicated study portal for BCA students · Made by Prince Thakur</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Crack Logic Systems & C Programming{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Step-by-Step in Hinglish
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            Stop struggling with base conversions, division remainders, and tricky C logic!
            BCA Verse breaks down every conversion with division tables, point/fractional calculations, and delivers tested,
            ready-to-compile C programs with line-by-line Hinglish logic.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('logic-solver')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:gap-3 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Solve Number System</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('c-generator')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-xs transition-all hover:gap-3 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Browse 45+ C Programs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2 BIG CARDS — Main Navigation Centers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Choose What You Want To Solve
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select one of the two core engines below
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: Logic & Number System Solver */}
          <div
            onClick={() => onNavigate('logic-solver')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 p-7 shadow-md hover:shadow-xl border border-slate-200/80 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                15 Solver Modes
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Logic & Number System Solver
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Step-by-step conversions with division tables, positional weights, and clear Hinglish notes so you understand every single remainder!
            </p>

            {/* Feature highlights */}
            <ul className="mt-5 space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Decimal ↔ Binary, Octal, Hexadecimal conversions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Binary Addition, Subtraction & 1's / 2's Complement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Logic Gates Truth Tables (AND, OR, NOT, NAND, NOR, XOR)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>2-Variable & 3-Variable K-Map minterm simplification</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Instant calculations · Zero lag
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                Open Solver ➔
              </span>
            </div>
          </div>

          {/* CARD 2: C Programming Code Generator */}
          <div
            onClick={() => onNavigate('c-generator')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-800/90 p-7 shadow-md hover:shadow-xl border border-slate-200/80 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />

            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <Terminal className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  Custom Statement AI
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  45+ Programs
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              C Programming Code Generator
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Apna koi bhi custom statement ya question likhein (jaise "Automorphic number", "Electricity bill", "Remove duplicates") aur yeh automatically pura C code + Hinglish explanation bana dega!
            </p>

            {/* Feature highlights */}
            <ul className="mt-5 space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Custom Statement se instant C code generator</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1-Click Copy Code & Download ready-to-run .c file</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Clean Hinglish explanation of loop flow & variables</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>45+ Ready BCA Programs library with instant search</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Tested GCC compatible code
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                Browse Programs ➔
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
      </section>

      {/* Extra Feature Quick Access: Formula Sheet */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              BCA Quick Formula & Syntax Sheet
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Powers of 2, Radix table, C Operator Precedence, Format Specifiers, and De Morgan's laws.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('formula-sheet')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0"
        >
          View Formulas ➔
        </button>
      </section>
    </div>
  );
};
