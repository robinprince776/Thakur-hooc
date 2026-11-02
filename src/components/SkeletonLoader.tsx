import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

interface SkeletonLoaderProps {
  appName?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ appName = 'Application' }) => {
  return (
    <div className="w-full min-h-[60vh] p-4 sm:p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-2">
            <div className="h-5 w-48 bg-slate-700/60 rounded-md"></div>
            <div className="h-3 w-64 bg-slate-800/60 rounded-md"></div>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <div className="h-8 w-20 bg-slate-800/80 rounded-xl"></div>
          <div className="h-8 w-24 bg-slate-800/80 rounded-xl"></div>
        </div>
      </div>

      {/* Content Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="h-64 rounded-3xl os-glass-card border-white/5 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-4 w-32 bg-slate-800 rounded"></div>
              <div className="h-8 w-3/4 bg-slate-700/50 rounded-lg"></div>
              <div className="h-3 w-5/6 bg-slate-800/70 rounded"></div>
              <div className="h-3 w-2/3 bg-slate-800/70 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-28 bg-cyan-600/30 rounded-xl"></div>
              <div className="h-9 w-28 bg-slate-800 rounded-xl"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 rounded-2xl os-glass-card border-white/5 p-4 space-y-2">
              <div className="h-4 w-20 bg-slate-800 rounded"></div>
              <div className="h-6 w-16 bg-slate-700/50 rounded"></div>
            </div>
            <div className="h-32 rounded-2xl os-glass-card border-white/5 p-4 space-y-2">
              <div className="h-4 w-20 bg-slate-800 rounded"></div>
              <div className="h-6 w-16 bg-slate-700/50 rounded"></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-96 rounded-3xl os-glass-card border-white/5 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-500" />
              <div className="h-4 w-24 bg-slate-800 rounded"></div>
            </div>
            <div className="h-3 w-full bg-slate-800/80 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-800/80 rounded"></div>
            <div className="h-3 w-4/6 bg-slate-800/80 rounded"></div>
            <div className="h-32 bg-slate-950/60 rounded-xl border border-white/5 mt-4"></div>
          </div>
        </div>
      </div>

      <div className="text-center py-2">
        <span className="text-xs text-slate-500 font-mono">
          Loading {appName}... Zero Lag Architecture
        </span>
      </div>
    </div>
  );
};
