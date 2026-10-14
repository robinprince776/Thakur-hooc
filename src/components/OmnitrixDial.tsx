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
  Layers
} from 'lucide-react';
import { CurrentAppType } from './AppSwitcherModal';

interface OmnitrixDialProps {
  isOmnitrixActive: boolean;
  onToggleOmnitrix: () => void;
  onSelectApp?: (app: CurrentAppType) => void;
  size?: 'sm' | 'md' | 'lg';
}

interface AlienForm {
  id: CurrentAppType;
  alienName: string;
  species: string;
  role: string;
  power: string;
  badgeColor: string;
  icon: React.ReactNode;
}

export const OmnitrixDial: React.FC<OmnitrixDialProps> = ({
  isOmnitrixActive,
  onToggleOmnitrix,
  onSelectApp,
  size = 'md'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [activeAlienIndex, setActiveAlienIndex] = useState(0);

  // Synthesize futuristic mechanical Omnitrix transform sound via Web Audio API
  const playOmnitrixTransformSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      const now = audioCtx.currentTime;
      // Omnitrix transform pitch slide: 160Hz -> 740Hz -> 920Hz
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.28);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
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
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  };

  const handleDialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playOmnitrixTransformSound();
    setShowMatrixModal(true);
  };

  const alienMatrix: AlienForm[] = [
    {
      id: 'techmaster' as CurrentAppType,
      alienName: 'Brainstorm',
      species: 'Cerebrocrustacean',
      role: 'TechMaster 2000+',
      power: '2000+ Questions & Answers, Cyber Cell, Supercomputers, Hacking & Architecture',
      badgeColor: 'border-emerald-400 text-emerald-300 shadow-emerald-500/50',
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />
    },
    {
      id: 'jarvis' as CurrentAppType,
      alienName: 'Grey Matter',
      species: 'Galvan',
      role: 'JARVIS AI Engine',
      power: 'Ultra-high IQ AI assistant powered by Gemini. 100% accurate, zero cringe solutions',
      badgeColor: 'border-cyan-400 text-cyan-300 shadow-cyan-500/50',
      icon: <Bot className="w-6 h-6 text-cyan-400" />
    },
    {
      id: 'cyber' as CurrentAppType,
      alienName: 'Diamondhead',
      species: 'Petrosapien',
      role: 'CyberShield Academy',
      power: 'Impenetrable defense, SOC operations, Wireshark packet capture & ethical hacking',
      badgeColor: 'border-teal-400 text-teal-300 shadow-teal-500/50',
      icon: <Shield className="w-6 h-6 text-teal-400" />
    },
    {
      id: 'dev' as CurrentAppType,
      alienName: 'Upgrade',
      species: 'Galvanic Mechamorph',
      role: 'DevForge Toolkit',
      power: 'JSON Studio, Regex Sandbox, JWT debugger, REST client & developer utilities',
      badgeColor: 'border-indigo-400 text-indigo-300 shadow-indigo-500/50',
      icon: <Wrench className="w-6 h-6 text-indigo-400" />
    },
    {
      id: 'compiler' as CurrentAppType,
      alienName: 'XLR8',
      species: 'Kineceleran',
      role: 'Simple C Compiler',
      power: 'Lightning-fast client C code compilation, step-by-step logic tracing & templates',
      badgeColor: 'border-blue-400 text-blue-300 shadow-blue-500/50',
      icon: <Terminal className="w-6 h-6 text-blue-400" />
    },
    {
      id: 'bca' as CurrentAppType,
      alienName: 'Four Arms',
      species: 'Tetramand',
      role: 'BCA Verse Core',
      power: 'Heavy-duty Logic system conversions, 50+ C programs, and exam syllabus notes',
      badgeColor: 'border-rose-400 text-rose-300 shadow-rose-500/50',
      icon: <Layers className="w-6 h-6 text-rose-400" />
    },
    {
      id: 'calc' as CurrentAppType,
      alienName: 'Ghostfreak',
      species: 'Ectonurite',
      role: 'CalcVault Stealth',
      power: 'Stealth disguised calculator with encrypted peer-to-peer vanishing chat',
      badgeColor: 'border-amber-400 text-amber-300 shadow-amber-500/50',
      icon: <Lock className="w-6 h-6 text-amber-400" />
    },
    {
      id: 'sukhan' as CurrentAppType,
      alienName: 'Ripjaws',
      species: 'Piscciss Volann',
      role: 'SUKHAN Lounge',
      power: 'Deep emotional Urdu poetry, audio mehfil, ghazals and literary aesthetics',
      badgeColor: 'border-purple-400 text-purple-300 shadow-purple-500/50',
      icon: <Feather className="w-6 h-6 text-purple-400" />
    }
  ];

  const handleTransform = (appId: CurrentAppType) => {
    playOmnitrixTransformSound();
    setShowMatrixModal(false);
    if (onSelectApp) {
      onSelectApp(appId);
    }
  };

  const dimensions =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';

  return (
    <>
      <button
        onClick={handleDialClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative ${dimensions} rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer select-none group focus:outline-none shrink-0`}
        title="Ben 10 Omnitrix Alien Matrix (Tap to Transform)"
        aria-label="Ben 10 Omnitrix Dial"
      >
        {/* Outer Titanium Dial Bezel */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
            isOmnitrixActive
              ? 'border-[#00FF66] shadow-[0_0_20px_#00FF66] bg-[#03150B]'
              : 'border-emerald-600/70 dark:border-emerald-500/50 bg-slate-900/90 hover:border-[#00FF66]'
          }`}
        />

        {/* 4 Titanium Screws / Notches on the Ring */}
        <span className="absolute -top-0.5 w-1.5 h-1 bg-slate-400 rounded-xs shadow-xs" />
        <span className="absolute -bottom-0.5 w-1.5 h-1 bg-slate-400 rounded-xs shadow-xs" />
        <span className="absolute -left-0.5 h-1.5 w-1 bg-slate-400 rounded-xs shadow-xs" />
        <span className="absolute -right-0.5 h-1.5 w-1 bg-slate-400 rounded-xs shadow-xs" />

        {/* Dial Face / Glass Cover */}
        <div
          className={`relative w-[78%] h-[78%] rounded-full overflow-hidden flex items-center justify-center ${
            isOmnitrixActive ? 'bg-black shadow-inner' : 'bg-slate-950'
          }`}
        >
          {/* Pulsing Green Energy Ring */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
              isOmnitrixActive
                ? 'opacity-100 bg-radial from-[#00FF66]/40 via-transparent to-transparent animate-pulse'
                : 'opacity-40 group-hover:opacity-100'
            }`}
          />

          {/* Authentic Ben 10 Omnitrix Hourglass Emblem */}
          <svg
            viewBox="0 0 100 100"
            className={`w-[85%] h-[85%] transition-transform duration-300 ${
              isOmnitrixActive
                ? 'text-[#00FF66] filter drop-shadow-[0_0_8px_#00FF66]'
                : 'text-[#00FF66]/80 group-hover:text-[#00FF66]'
            } ${isHovered ? 'rotate-90 scale-105' : 'rotate-0'}`}
          >
            {/* Hourglass Silhouette Left and Right Wings */}
            <polygon
              points="10,12 50,50 10,88"
              fill={isOmnitrixActive ? '#00FF66' : '#00dd55'}
            />
            <polygon
              points="90,12 50,50 90,88"
              fill={isOmnitrixActive ? '#00FF66' : '#00dd55'}
            />
            {/* Core Dark Insets */}
            <polygon points="10,12 90,12 50,50" fill="#060C08" />
            <polygon points="10,88 90,88 50,50" fill="#060C08" />
            {/* Center Core Dot */}
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Glowing Indicator Pill */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF66] shadow-[0_0_8px_#00FF66]"></span>
        </span>
      </button>

      {/* BEN 10 OMNITRIX TRANSFORMATION MATRIX POPUP MODAL */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
          <div className="relative w-full max-w-lg bg-[#040e06] border-2 border-[#00FF66] rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,255,102,0.35)] text-white space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#00FF66]/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black border-2 border-[#00FF66] flex items-center justify-center shadow-[0_0_12px_#00FF66]">
                  <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#00FF66]">
                    <polygon points="10,12 50,50 10,88" fill="#00FF66" />
                    <polygon points="90,12 50,50 90,88" fill="#00FF66" />
                    <polygon points="10,12 90,12 50,50" fill="#000" />
                    <polygon points="10,88 90,88 50,50" fill="#000" />
                    <circle cx="50" cy="50" r="4" fill="#FFF" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black tracking-wider text-[#00FF66] uppercase flex items-center gap-2">
                    Omnitrix Alien Matrix
                  </h2>
                  <p className="text-[11px] text-emerald-300/80">
                    Galvanic Tech DNA Selector · Tap Alien Form to Transform
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMatrixModal(false)}
                className="p-1.5 rounded-full hover:bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Omnitrix Theme Mode Toggle Banner */}
            <div className="p-3 rounded-2xl bg-[#021307] border border-[#00FF66]/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Power className="w-4 h-4 text-[#00FF66] animate-pulse" />
                <span className="text-xs font-bold text-emerald-200">
                  Ben 10 Omnitrix Theme Mode:
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isOmnitrixActive
                      ? 'bg-[#00FF66] text-black shadow-[0_0_10px_#00FF66]'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isOmnitrixActive ? 'ONLINE' : 'STANDBY'}
                </span>
              </div>
              <button
                onClick={() => {
                  playOmnitrixTransformSound();
                  onToggleOmnitrix();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isOmnitrixActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-[#00FF66] text-black shadow-[0_0_12px_#00FF66] hover:bg-[#00dd55]'
                }`}
              >
                {isOmnitrixActive ? 'Switch to Standard' : 'Activate Hero Mode'}
              </button>
            </div>

            {/* Alien Form Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {alienMatrix.map((alien, idx) => (
                <button
                  key={alien.id}
                  onClick={() => handleTransform(alien.id)}
                  onMouseEnter={playDialBeep}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between ${alien.badgeColor} bg-black/60 hover:bg-emerald-950/40 hover:border-[#00FF66] hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 group-hover:border-[#00FF66]">
                      {alien.icon}
                    </div>
                    <span className="text-[10px] font-mono text-[#00FF66] font-bold">
                      DNA #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-white group-hover:text-[#00FF66] transition-colors flex items-center gap-1.5">
                      <span>{alien.alienName}</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-400/90 truncate">
                      {alien.role}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {alien.power}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer Hint */}
            <div className="text-center pt-1 border-t border-[#00FF66]/20">
              <span className="text-[11px] font-mono text-emerald-400/70">
                Created by Prince Thakur · Level 10 Galvanic Technology
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
