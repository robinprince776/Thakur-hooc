import React, { useState } from 'react';
import {
  Code2,
  ArrowRight,
  Layers,
  Cpu,
  Shield,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export interface ReversingAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const ReversingApp: React.FC<ReversingAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'assembly' | 'stack' | 'pe'>('assembly');

  // Assembly Simulator State
  const [registers, setRegisters] = useState({ rax: 5, rbx: 10, rcx: 0, rdx: 0 });
  const [executedSteps, setExecutedSteps] = useState<string[]>([]);

  const handleRunInstruction = (cmd: string) => {
    setExecutedSteps((prev) => [...prev, cmd]);
    if (cmd === 'MOV RAX, 20') setRegisters((r) => ({ ...r, rax: 20 }));
    if (cmd === 'ADD RAX, RBX') setRegisters((r) => ({ ...r, rax: r.rax + r.rbx }));
    if (cmd === 'XOR RCX, RCX') setRegisters((r) => ({ ...r, rcx: 0 }));
    if (cmd === 'INC RDX') setRegisters((r) => ({ ...r, rdx: r.rdx + 1 }));
  };

  const handleResetAsm = () => {
    setRegisters({ rax: 5, rbx: 10, rcx: 0, rdx: 0 });
    setExecutedSteps([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToBca}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Return to BCA Verse"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-purple-300 bg-clip-text text-transparent">
                      Reverse Engineering Concepts
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Static Analysis &amp; x86
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Interactive x86_64 register simulator, call stack frames &amp; PE structure
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suite Apps</span>
            </button>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'assembly', label: '1. ⚡ x86_64 Assembly Simulator', icon: Cpu },
              { id: 'stack', label: '2. 📦 Function Call Stack Frame', icon: Layers },
              { id: 'pe', label: '3. 🗃️ PE/ELF Binary Headers', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: ASSEMBLY SIMULATOR */}
        {activeTab === 'assembly' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">x86_64 Register Execution Simulator</h2>
                <p className="text-xs text-slate-400 mt-1">Execute micro-instructions and watch CPU registers change state in real-time.</p>
              </div>
              <button
                onClick={handleResetAsm}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer"
              >
                Reset Registers
              </button>
            </div>

            {/* Current Register State */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[10px]">RAX (Accumulator)</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">{registers.rax}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[10px]">RBX (Base)</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">{registers.rbx}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[10px]">RCX (Counter)</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{registers.rcx}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 text-center">
                <span className="text-slate-500 block text-[10px]">RDX (Data)</span>
                <span className="text-2xl font-black text-purple-400 font-mono">{registers.rdx}</span>
              </div>
            </div>

            {/* Interactive Instruction Buttons */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">Click Instructions to Execute:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {['MOV RAX, 20', 'ADD RAX, RBX', 'XOR RCX, RCX', 'INC RDX'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleRunInstruction(cmd)}
                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 cursor-pointer font-bold transition-all text-center"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Execution History */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Instruction Log:</span>
              {executedSteps.map((s, idx) => (
                <div key={idx} className="text-emerald-400">&gt;&gt; {s}</div>
              ))}
              {executedSteps.length === 0 && <span className="text-slate-600 italic">No instructions run yet.</span>}
            </div>
          </div>
        )}

        {/* TAB 2: STACK FRAME */}
        {activeTab === 'stack' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">C Function Call Stack Frame Architecture</h2>
            <div className="space-y-2 font-mono text-xs max-w-xl mx-auto">
              <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-center text-slate-400">
                [High Memory Address: Function Arguments]
              </div>
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500 text-center text-rose-300 font-bold">
                Saved Return Address (RIP) &larr; Attacker target in Buffer Overflows!
              </div>
              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500 text-center text-amber-300 font-bold">
                Saved Base Pointer (RBP)
              </div>
              <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500 text-center text-purple-300">
                Stack Canary Guard (Random 64-bit value)
              </div>
              <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500 text-center text-cyan-300">
                Local Variables (e.g. char buffer[64]) &larr; RSP (Top of Stack)
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PE STRUCTURE */}
        {activeTab === 'pe' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs font-mono">
            <h2 className="text-xl font-bold text-white font-sans">Portable Executable (PE) Section Map</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400">.text Section (Code)</span>
                <p className="text-slate-300 font-sans text-[11px]">Contains compiled machine instructions. Permissions: Read + Execute (RX). Write disabled by DEP/NX.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400">.data Section (Globals)</span>
                <p className="text-slate-300 font-sans text-[11px]">Contains initialized global and static variables. Permissions: Read + Write (RW).</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">.rdata Section (Constants)</span>
                <p className="text-slate-300 font-sans text-[11px]">Read-only strings and Import Address Table (IAT) listing external DLLs.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400">.bss Section (Uninitialized)</span>
                <p className="text-slate-300 font-sans text-[11px]">Uninitialized global data zeroed out when the program loads into memory.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
