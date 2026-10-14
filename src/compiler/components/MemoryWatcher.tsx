import React from 'react';
import { VariableWatch } from '../types';
import { Eye, HardDrive, Database, Info } from 'lucide-react';

interface MemoryWatcherProps {
  variables: VariableWatch[];
}

export const MemoryWatcher: React.FC<MemoryWatcherProps> = ({ variables }) => {
  return (
    <div className="flex flex-col h-full bg-[#0E131F] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141A29] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200">Live Memory &amp; Variable Watcher</span>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
          {variables.length} Variables
        </span>
      </div>

      {/* Variables List / Table */}
      <div className="flex-1 p-3 overflow-y-auto">
        {variables.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <HardDrive className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
            <div className="text-xs font-semibold text-slate-400">
              Koi Variables Active Nahi Hain
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs mt-1">
              Program run karne ke baad yahan declared variables ki live value aur data type dikhayi degi.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
              <span className="col-span-4">Identifier</span>
              <span className="col-span-3">Type</span>
              <span className="col-span-5">Current Value</span>
            </div>

            {variables.map((v, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 items-center font-mono text-xs hover:border-cyan-500/40 transition-colors"
              >
                <div className="col-span-4 flex items-center gap-1.5 font-bold text-cyan-300 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="truncate">{v.name}</span>
                </div>

                <div className="col-span-3 text-[11px] text-purple-300 truncate">
                  <span className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                    {v.type}
                  </span>
                </div>

                <div className="col-span-5 text-amber-300 font-bold break-all bg-black/40 px-2 py-1 rounded border border-white/5">
                  {v.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-[#0A0E17] border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>Stack memory inspect karta hai jab execution complete hota hai.</span>
      </div>
    </div>
  );
};
