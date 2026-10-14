import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  RefreshCw,
  X,
  Radio,
  Power,
  Cpu,
  Bot,
  Wrench,
  BookOpen,
  Terminal,
  Lock,
  Feather,
  Layers,
  Flame,
  Activity,
  Compass,
  FileText
} from 'lucide-react';
import { CurrentAppType } from './AppSwitcherModal';
import { OmnitrixLogo } from './OmnitrixLogo';

interface OmnitrixDialProps {
  isOmnitrixActive: boolean;
  onToggleOmnitrix: () => void;
  onSelectApp?: (app: CurrentAppType) => void;
  size?: 'sm' | 'md' | 'lg';
}

interface AlienForceAlien {
  id: CurrentAppType | 'cybercell' | 'terminal';
  alienName: string;
  species: string;
  role: string;
  power: string;
  element: string;
  badgeColor: string;
  accentHex: string;
  icon: React.ReactNode;
}

export const OmnitrixDial: React.FC<OmnitrixDialProps> = ({
  isOmnitrixActive,
  onToggleOmnitrix,
  onSelectApp,
  size = 'md'
}) => {
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [activeAlienIndex, setActiveAlienIndex] = useState(0);

  // Synthesize futuristic mechanical Alien Force Omnitrix transform sound via Web Audio API
  const playOmnitrixTransformSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc2.type = 'sine';
      const now = audioCtx.currentTime;

      // Alien Force Omnitrix beep & burst: 220Hz -> 880Hz -> 1200Hz
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.32);

      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(660, now + 0.2);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  };

  const playDialBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(960, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  };

  const handleDialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playOmnitrixTransformSound();
    setShowMatrixModal(true);
  };

  const alienForceMatrix: AlienForceAlien[] = [
    {
      id: 'techmaster',
      alienName: 'Brainstorm',
      species: 'Cerebrocrustacean',
      role: 'TechMaster 2000+',
      power: '2000+ Questions & Answers, Cyber Cell, Supercomputers, Hacking & Architecture',
      element: 'Electric Neural Intelligence',
      badgeColor: 'border-emerald-400 text-emerald-300 shadow-emerald-500/50',
      accentHex: '#00FF66',
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />
    },
    {
      id: 'jarvis',
      alienName: 'Alien X',
      species: 'Celestialsapien',
      role: 'JARVIS AI Engine',
      power: 'Omniscient AI assistant powered by Gemini. 100% accurate, zero cringe solutions',
      element: 'Omnipresent Cosmic Intellect',
      badgeColor: 'border-cyan-400 text-cyan-300 shadow-cyan-500/50',
      accentHex: '#00F0FF',
      icon: <Bot className="w-6 h-6 text-cyan-400" />
    },
    {
      id: 'cyber',
      alienName: 'Chromastone',
      species: 'Crystalsapien',
      role: 'CyberShield Academy',
      power: 'Impenetrable defense, SOC operations, Wireshark packet capture & ethical hacking',
      element: 'Crystal Energy Absorption & Defense',
      badgeColor: 'border-fuchsia-400 text-fuchsia-300 shadow-fuchsia-500/50',
      accentHex: '#E056FD',
      icon: <Shield className="w-6 h-6 text-fuchsia-400" />
    },
    {
      id: 'dev',
      alienName: 'Echo Echo',
      species: 'Sonorosian',
      role: 'DevForge Toolkit',
      power: 'JSON Studio, Regex Sandbox, JWT debugger, REST client & developer utilities',
      element: 'Acoustic Signal Duplication',
      badgeColor: 'border-indigo-400 text-indigo-300 shadow-indigo-500/50',
      accentHex: '#818CF8',
      icon: <Wrench className="w-6 h-6 text-indigo-400" />
    },
    {
      id: 'compiler',
      alienName: 'Jetray',
      species: 'Aerophibian',
      role: 'Simple C Compiler',
      power: 'Lightning-fast client C code compilation, step-by-step logic tracing & templates',
      element: 'Hypersonic Computation',
      badgeColor: 'border-amber-400 text-amber-300 shadow-amber-500/50',
      accentHex: '#FBBF24',
      icon: <Terminal className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'bca',
      alienName: 'Humungousaur',
      species: 'Vaxasaurian',
      role: 'BCA Verse Portal',
      power: 'Boolean Algebra, K-Map solver, 2s Complement & semester exam notes',
      element: 'Titan Logic Strength',
      badgeColor: 'border-rose-400 text-rose-300 shadow-rose-500/50',
      accentHex: '#FB7185',
      icon: <Layers className="w-6 h-6 text-rose-400" />
    },
    {
      id: 'calc',
      alienName: 'Big Chill',
      species: 'Necrofriggian',
      role: 'CalcVault Stealth',
      power: 'Stealth disguised calculator with encrypted peer-to-peer vanishing chat',
      element: 'Cryo Invisibility & Camouflage',
      badgeColor: 'border-sky-400 text-sky-300 shadow-sky-500/50',
      accentHex: '#38BDF8',
      icon: <Lock className="w-6 h-6 text-sky-400" />
    },
    {
      id: 'sukhan',
      alienName: 'Swampfire',
      species: 'Methanosian',
      role: 'SUKHAN Lounge',
      power: 'Deep emotional Urdu poetry, audio mehfil, ghazals and literary aesthetics',
      element: 'Methane Flame & Rebirth',
      badgeColor: 'border-emerald-500 text-emerald-300 shadow-emerald-500/50',
      accentHex: '#10B981',
      icon: <Feather className="w-6 h-6 text-emerald-400" />
    },
    {
      id: 'cybercell',
      alienName: 'Spidermonkey',
      species: 'Arachnichimp',
      role: 'Cyber Cell 1930 Assistant',
      power: 'Step-by-step financial fraud recovery, Golden Hour rule, Section 66 FIR generator',
      element: 'Neural Web Net & Tracing',
      badgeColor: 'border-blue-400 text-blue-300 shadow-blue-500/50',
      accentHex: '#60A5FA',
      icon: <FileText className="w-6 h-6 text-blue-400" />
    },
    {
      id: 'terminal',
      alienName: 'Goop',
      species: 'Polymorph',
      role: 'Live Cyber Terminal',
      power: 'Interactive Kali Linux shell simulator (nmap, whois, ping, param-siddhi, cybercell)',
      element: 'Polymorphic Acid & Shell Injection',
      badgeColor: 'border-lime-400 text-lime-300 shadow-lime-500/50',
      accentHex: '#A3E635',
      icon: <Terminal className="w-6 h-6 text-lime-400" />
    }
  ];

  const handleTransform = (alien: AlienForceAlien) => {
    playOmnitrixTransformSound();
    setShowMatrixModal(false);

    if (alien.id === 'cybercell' || alien.id === 'terminal') {
      // Launch TechMaster with specific tab or hash
      window.location.hash = alien.id === 'cybercell' ? 'cybercell' : 'techmaster';
      if (onSelectApp) onSelectApp('techmaster');
      return;
    }

    if (onSelectApp) {
      onSelectApp(alien.id as CurrentAppType);
    }
  };

  const activeAlien = alienForceMatrix[activeAlienIndex];

  return (
    <>
      {/* Authentic Ben 10 Alien Force Omnitrix Button */}
      <button
        onClick={handleDialClick}
        className="relative flex items-center justify-center cursor-pointer select-none group focus:outline-none shrink-0"
        title="Ben 10 Alien Force Omnitrix (Click to Transform)"
        aria-label="Ben 10 Omnitrix Dial"
      >
        <OmnitrixLogo
          size={size}
          isGlowing={isOmnitrixActive}
          animated={isOmnitrixActive}
        />
        {/* Subtle Green Pulse Dot when Active */}
        {isOmnitrixActive && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00FF66] border border-black animate-ping pointer-events-none" />
        )}
      </button>

      {/* Holographic Ben 10 Alien Force Matrix Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-xl rounded-3xl bg-[#030A05] border-2 border-[#00FF66]/80 text-[#E6FFF0] shadow-[0_0_50px_rgba(0,255,102,0.4)] overflow-hidden flex flex-col font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Holographic Alien Force Scanline Texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00FF66_1px,transparent_1px)] [background-size:16px_16px]"
            />

            {/* Modal Header */}
            <div className="relative px-5 py-4 border-b border-[#00FF66]/30 bg-[#05150A]/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <OmnitrixLogo size="sm" isGlowing={true} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-widest text-[#00FF66] font-mono uppercase">
                      Omnitrix DNA Matrix
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00FF66]/20 border border-[#00FF66]/40 text-[#00FF66] rounded-full">
                      Alien Force
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-400/80 font-mono">
                    Azmuth Galvanic Prime · Level 20 Tech
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Omnitrix Theme Global Toggle */}
                <button
                  onClick={() => {
                    playDialBeep();
                    onToggleOmnitrix();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isOmnitrixActive
                      ? 'bg-[#00FF66] text-black border-[#00FF66] shadow-[0_0_12px_#00FF66]'
                      : 'bg-zinc-900 text-[#00FF66] border-[#00FF66]/40 hover:bg-[#00FF66]/20'
                  }`}
                  title="Toggle Ben 10 Alien Force Theme"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{isOmnitrixActive ? 'AF Theme: ON' : 'AF Theme: OFF'}</span>
                </button>

                <button
                  onClick={() => setShowMatrixModal(false)}
                  className="p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Active Alien Holographic Display */}
            <div className="relative p-5 sm:p-6 space-y-5">
              {/* Central Hologram Ring */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#061C0D] to-[#030C06] border border-[#00FF66]/40 p-5 flex flex-col sm:flex-row items-center gap-5 shadow-inner">
                {/* Alien Holographic Projection Visual */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shrink-0">
                  <div
                    className="absolute inset-0 rounded-full border-2 border-dashed border-[#00FF66]/50 animate-spin"
                    style={{ animationDuration: '14s' }}
                  />
                  <div className="absolute inset-2 rounded-full bg-[#00FF66]/15 blur-sm animate-pulse" />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="p-4 rounded-full bg-black/80 border-2 border-[#00FF66] shadow-[0_0_20px_#00FF66]">
                      {activeAlien.icon}
                    </div>
                  </div>
                </div>

                {/* Alien Telemetry Info */}
                <div className="flex-1 text-center sm:text-left space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                      {activeAlien.alienName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/40 uppercase">
                      {activeAlien.species}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-[#00FF66] font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Element: {activeAlien.element}</span>
                  </div>

                  <div className="text-xs text-zinc-300 leading-relaxed pt-1">
                    <strong className="text-[#00FF66] font-semibold">{activeAlien.role}:</strong>{' '}
                    {activeAlien.power}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleTransform(activeAlien)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00FF66] to-[#00CC52] hover:brightness-110 text-black font-black text-xs font-mono tracking-wider uppercase cursor-pointer shadow-[0_0_20px_rgba(0,255,102,0.6)] flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Transform Into {activeAlien.alienName}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Alien DNA Dial Selection Wheel */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#00FF66]" /> Select Alien DNA Sample (10 Forms)
                  </span>
                  <span className="text-zinc-500 text-[11px]">
                    {activeAlienIndex + 1} of {alienForceMatrix.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {alienForceMatrix.map((alien, idx) => {
                    const isSelected = idx === activeAlienIndex;
                    return (
                      <button
                        key={alien.alienName}
                        onClick={() => {
                          playDialBeep();
                          setActiveAlienIndex(idx);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#00FF66]/20 border-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.4)] text-white'
                            : 'bg-black/50 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isSelected ? 'bg-[#00FF66] text-black' : 'bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          {React.cloneElement(alien.icon as React.ReactElement<any>, {
                            className: 'w-4 h-4'
                          })}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold truncate">{alien.alienName}</div>
                          <div className="text-[9px] font-mono text-[#00FF66] truncate">
                            {alien.role.split(' ')[0]}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#00FF66]/30 bg-[#020904] flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span className="text-[#00FF66] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Recalibrated Omnitrix Ready
              </span>
              <span>Made by Prince Thakur</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
