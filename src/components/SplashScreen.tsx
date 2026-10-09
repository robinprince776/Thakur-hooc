import React, { useEffect, useState } from 'react';
import { Sparkles, Terminal, Cpu } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Start fade-out slightly before 2000ms so transition is buttery smooth
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1800);

    const finishTimer = setTimeout(() => {
      setHidden(true);
      if (onFinish) onFinish();
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 transition-all duration-500 ease-out ${
        fading ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      } bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-slate-800`}
    >
      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => {
            setFading(true);
            setTimeout(() => {
              setHidden(true);
              if (onFinish) onFinish();
            }, 300);
          }}
          className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200/60 bg-white/70 backdrop-blur"
        >
          Skip ➔
        </button>
      </div>

      {/* Center animated hero content */}
      <div className="flex flex-col items-center text-center max-w-sm px-4">
        {/* Animated App Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/25 flex items-center justify-center text-white ring-8 ring-white/80 animate-float-soft">
            <div className="relative flex items-center justify-center">
              <Cpu className="w-12 h-12 text-white/95" />
              <Terminal className="w-5 h-5 absolute -bottom-1 -right-1 text-pink-200" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-md text-amber-500">
            <Sparkles className="w-4 h-4 fill-amber-400" />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          BCA Verse
        </h1>

        {/* Tagline */}
        <p className="text-base font-medium text-slate-600 mb-4">
          Logic + C Programming Made Easy
        </p>

        {/* Feature Pills */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Number Systems</span>
          <span className="text-slate-300">·</span>
          <span>Hinglish Solutions</span>
          <span className="text-slate-300">·</span>
          <span>45+ C Programs</span>
        </div>
      </div>

      {/* Bottom author credit */}
      <div className="pb-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/70 shadow-sm backdrop-blur text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Made by Prince Thakur</span>
        </div>
      </div>
    </div>
  );
};
