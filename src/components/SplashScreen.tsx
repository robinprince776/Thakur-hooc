import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal, Cpu, Layers, Heart, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast smooth progress bar increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 15;
      });
    }, 40);

    // Auto transition fast (max 750ms)
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 550);

    const finishTimer = setTimeout(() => {
      setHidden(true);
      if (onFinish) onFinish();
    }, 750);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  if (hidden) return null;

  const handleEnter = () => {
    setFading(true);
    setTimeout(() => {
      setHidden(true);
      if (onFinish) onFinish();
    }, 250);
  };

  return (
    <div
      onClick={handleEnter}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 sm:p-10 select-none cursor-pointer transition-all duration-500 ease-out ${
        fading ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      } bg-gradient-to-br from-slate-950 via-[#070b19] to-slate-950 text-white overflow-hidden`}
    >
      {/* Ambient background glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-[380px] h-[380px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[320px] h-[320px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Badge & Skip */}
      <div className="w-full flex items-center justify-between relative z-10 max-w-2xl">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-300 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>BCA 1st Semester Academic Suite</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 hover:bg-white/20 backdrop-blur-md cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Hero Content */}
      <div className="flex flex-col items-center text-center max-w-lg px-4 relative z-10 my-auto">
        {/* Animated App Icon Triad */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-2xl shadow-indigo-500/40 flex items-center justify-center text-white ring-8 ring-white/10 animate-float-soft transition-transform">
            <div className="relative flex items-center justify-center">
              <Cpu className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 absolute -bottom-1 -right-1 text-pink-300" />
            </div>
          </div>
          <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-tr from-amber-400 to-pink-500 p-1.5 rounded-full shadow-lg text-white">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-pink-200 bg-clip-text text-transparent mb-2">
          BCA Verse
        </h1>

        {/* 3 Core Subjects Tagline */}
        <p className="text-xs sm:text-sm font-medium text-slate-300 mb-5 leading-relaxed max-w-md">
          Logic Systems · 45+ C Programs · Fundamental of Computer
        </p>

        {/* 3 Subject Feature Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-200 font-medium mb-7">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
            ⚡ Logic &amp; Numbers
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
            💻 45+ C Programs
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
            📚 Comp Fundamentals
          </span>
        </div>

        {/* PROMINENT DESIGNER BADGE: "Made by Prince Thakur" */}
        <div className="relative w-full max-w-sm group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-80 group-hover:opacity-100 transition duration-300 animate-pulse" />
          <div className="relative px-6 py-4 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-widest font-extrabold text-indigo-400">
                  Designed &amp; Created By
                </div>
                <div className="text-lg sm:text-xl font-black tracking-wide text-white drop-shadow-sm">
                  Prince Thakur
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-[10px] font-semibold text-slate-400">
              <span className="text-amber-400 font-bold">★ Verified</span>
              <span>BCA 1st Sem</span>
            </div>
          </div>
        </div>

        {/* Enter App Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter();
          }}
          className="mt-7 inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>Enter BCA Verse</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Progress Bar & Tap Hint */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center gap-2 pb-2">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Tap anywhere to launch app</span>
        </div>
      </div>
    </div>
  );
};
