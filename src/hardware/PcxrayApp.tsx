import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ArrowRight,
  HardDrive,
  Activity,
  Zap,
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  Shield,
  Eye,
  Server
} from 'lucide-react';

export interface PcxrayAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const PcxrayApp: React.FC<PcxrayAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'cpu' | 'memory' | 'kernel' | 'boot'>('cpu');
  const [bootStep, setBootStep] = useState(0);

  const BOOT_STAGES = [
    {
      title: '1. Power ON & Electrical Signal',
      hardware: 'Power Supply Unit (PSU) & Motherboard',
      desc: 'Power switch sends 3.3V/5V/12V rails. Motherboard generates \'Power Good\' signal to the CPU.',
      eli5: 'Computer ka switch dabaate hi bijli motherboard me failti hai aur CPU ko jagaati hai.'
    },
    {
      title: '2. POST (Power-On Self-Test)',
      hardware: 'BIOS / UEFI Firmware Chip (ROM)',
      desc: 'Firmware tests RAM sticks, CPU, GPU, keyboard. If a component fails, the motherboard sounds beep codes or displays error LEDs.',
      eli5: 'System check karta hai ki sabhi organ (RAM, Processor, Screen) theek se kaam kar rahe hain ya nahi.'
    },
    {
      title: '3. Bootloader Hand-off (GRUB / Windows Boot Manager)',
      hardware: 'NVMe SSD / HDD (EFI System Partition - ESP)',
      desc: 'UEFI reads NVRAM to locate the bootloader executable (`/EFI/BOOT/BOOTX64.EFI` or `grub.efi`).',
      eli5: 'Motherboard hard drive ke first gate keeper (GRUB) ko control deta hai jo OS choose karta hai.'
    },
    {
      title: '4. Kernel Unpacking & Memory Initialization',
      hardware: 'RAM & CPU Ring 0',
      desc: 'The compressed kernel (`vmlinuz`) is loaded into protected RAM. CPU switches from Real Mode to 64-bit Long Mode.',
      eli5: 'Operating system ka dimaag (Kernel) RAM me load hota hai aur sabse powerful security mode me chala jata hai.'
    },
    {
      title: '5. initramfs & Systemd (PID 1)',
      hardware: 'Virtual Filesystem & Userspace',
      desc: 'Temporary in-memory root filesystem mounts required storage drivers. `systemd` is spawned as Process ID 1, starting all system services.',
      eli5: 'System services (network, sound, login screen) ek-ek karke start hoti hain aur login screen dikhayi deti hai.'
    }
  ];

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                      PC Hardware &amp; OS Explorer
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Inside the Machine
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Interactive CPU pipeline, memory cache hierarchy, kernel rings &amp; boot sequence
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
              { id: 'cpu', label: '1. ⚡ CPU Pipeline & Registers', icon: Cpu },
              { id: 'memory', label: '2. 📦 Memory Cache Hierarchy', icon: Layers },
              { id: 'kernel', label: '3. 🛡️ Kernel Ring 0 vs Ring 3', icon: Shield },
              { id: 'boot', label: '4. 🚀 The 5-Step Boot Sequence', icon: Zap }
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
        {/* TAB 1: CPU PIPELINE */}
        {activeTab === 'cpu' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">CPU Execution Engine (Fetch &rarr; Decode &rarr; Execute &rarr; Writeback)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              {[
                { stage: '1. FETCH', sub: 'Instruction Pointer (RIP)', desc: 'Reads next instruction byte from L1 Instruction Cache using memory address in RIP.' },
                { stage: '2. DECODE', sub: 'Control Unit & Micro-ops', desc: 'Breaks complex x86 assembly instructions into internal RISC-like micro-operations (uOps).' },
                { stage: '3. EXECUTE', sub: 'ALU & FPU Engine', desc: 'Arithmetic Logic Unit carries out math (+, -, AND, OR) or floating-point calculations.' },
                { stage: '4. WRITEBACK', sub: 'Register File & Cache', desc: 'Writes the computed output back into registers (e.g. RAX) or commits to L1 Data Cache.' }
              ].map((st, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="font-mono font-bold text-cyan-400 text-sm">{st.stage}</div>
                  <div className="text-slate-200 font-bold">{st.sub}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>

            {/* Core Registers Matrix */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-cyan-400 block uppercase">Primary x86_64 Registers and Roles</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-cyan-300 font-bold">RAX:</span> Accumulator (Return values)
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-emerald-300 font-bold">RSP:</span> Stack Pointer (Top of stack)
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-300 font-bold">RBP:</span> Base Pointer (Stack frame)
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-purple-300 font-bold">RIP:</span> Instruction Pointer (Next code)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEMORY HIERARCHY */}
        {activeTab === 'memory' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">The Computer Memory Pyramid: Speed vs Capacity</h2>
            <div className="space-y-3">
              {[
                { name: '1. CPU Registers', speed: '< 1 Nanosecond (1 CPU Cycle)', capacity: '~1 KB', cost: 'Fastest / Inside Core', color: 'from-cyan-600 to-blue-600' },
                { name: '2. L1 & L2 Cache', speed: '1 - 4 Nanoseconds (4-14 Cycles)', capacity: '32 KB - 1 MB per core', cost: 'SRAM on CPU Die', color: 'from-blue-600 to-indigo-600' },
                { name: '3. L3 Shared Cache', speed: '10 - 20 Nanoseconds (40-60 Cycles)', capacity: '16 MB - 64 MB shared', cost: 'SRAM Shared across cores', color: 'from-indigo-600 to-purple-600' },
                { name: '4. Main RAM (DDR4 / DDR5)', speed: '50 - 100 Nanoseconds', capacity: '16 GB - 128 GB', cost: 'DRAM Capacitor Refresh', color: 'from-purple-600 to-pink-600' },
                { name: '5. NVMe SSD (PCIe Gen 4/5)', speed: '10 - 50 Microseconds', capacity: '1 TB - 4 TB', cost: 'NAND Flash Non-volatile', color: 'from-emerald-600 to-teal-600' },
                { name: '6. Mechanical HDD / Cloud Cold Storage', speed: '5 - 15 Milliseconds', capacity: '10 TB+', cost: 'Magnetic spinning platters', color: 'from-slate-700 to-slate-800' }
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white text-sm">{tier.name}</span>
                    <p className="text-slate-400 text-[11px]">{tier.cost}</p>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-cyan-300 font-bold">Latency: {tier.speed}</span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">
                      {tier.capacity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KERNEL RINGS */}
        {activeTab === 'kernel' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Privilege Rings: Kernel Mode (Ring 0) vs User Mode (Ring 3)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-3">
                <span className="px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 font-bold text-[10px] uppercase">
                  Ring 0: Kernel Mode
                </span>
                <h3 className="text-base font-bold text-white">Unrestricted Hardware Access</h3>
                <p className="text-slate-300 leading-relaxed">
                  The OS Kernel runs with maximum privilege. It controls page tables, interrupts, memory management, and physical device drivers. If code crashes in Ring 0, the entire system experiences a Blue Screen (BSOD) or Kernel Panic.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-900/60 space-y-3">
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 font-bold text-[10px] uppercase">
                  Ring 3: User Mode
                </span>
                <h3 className="text-base font-bold text-white">Sandboxed Applications</h3>
                <p className="text-slate-300 leading-relaxed">
                  Your web browsers, games, and terminal commands execute in Ring 3. They have zero direct access to physical memory or hardware. Whenever they need to read a file or send a network packet, they must issue a `syscall` to request Ring 0 assistance!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BOOT PROCESS */}
        {activeTab === 'boot' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">The 5-Stage Computer Boot Sequence</h2>
                <p className="text-xs text-slate-400 mt-1">From electrical switch to interactive login screen.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setBootStep((prev) => Math.max(0, prev - 1))}
                  disabled={bootStep === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() => setBootStep((prev) => Math.min(BOOT_STAGES.length - 1, prev + 1))}
                  disabled={bootStep === BOOT_STAGES.length - 1}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  Next Step &rarr;
                </button>
              </div>
            </div>

            {/* Stepper Display */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-3 text-xs">
                <span className="font-bold text-cyan-400 uppercase text-[10px]">Active Boot Phase</span>
                <h3 className="text-lg font-bold text-white">{BOOT_STAGES[bootStep].title}</h3>
                <div className="font-mono text-emerald-400 text-[11px]">Hardware Responsible: {BOOT_STAGES[bootStep].hardware}</div>
                <p className="text-slate-300 leading-relaxed text-sm">{BOOT_STAGES[bootStep].desc}</p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs">
                  <strong>ELI5 Summary: </strong>{BOOT_STAGES[bootStep].eli5}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
