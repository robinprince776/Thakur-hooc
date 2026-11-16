import React from 'react';
import { ShieldCheck, RotateCcw, CheckCircle2, Info } from 'lucide-react';
import { GhostModuleId, useGhostStore } from '../../store/useGhostStore';
import { GHOST_MODULES } from '../ghostModulesMeta';

interface ModuleFrameProps {
  moduleId: GhostModuleId;
  onResetLocal?: () => void;
  children: React.ReactNode;
}

export const ModuleFrame: React.FC<ModuleFrameProps> = ({
  moduleId,
  onResetLocal,
  children,
}) => {
  const meta = GHOST_MODULES.find((m) => m.id === moduleId) || GHOST_MODULES[0];
  const completedModules = useGhostStore((s) => s.completedModules);
  const completeModule = useGhostStore((s) => s.completeModule);
  const resetSandbox = useGhostStore((s) => s.resetSandbox);

  const isCompleted = completedModules.includes(moduleId);

  const handleReset = () => {
    resetSandbox(moduleId);
    if (onResetLocal) onResetLocal();
  };

  return (
    <div className="space-y-5">
      {/* Ethical Disclaimer + Reset Sandbox Bar */}
      <div className="rounded-xl border border-[#00E5FF]/20 bg-[#0D1322]/90 px-4 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 text-xs text-slate-300 leading-relaxed">
          <Info className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-semibold text-[#00E5FF]">Ethical Disclaimer:</span>{' '}
            <span>
              100% isolated educational simulation. No real-world targets, live scanning, or offensive payloads are executed.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-[#00E5FF]/50 text-xs font-medium text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Reset Sandbox</span>
          </button>

          <button
            type="button"
            onClick={() => completeModule(moduleId, meta.xpReward)}
            disabled={isCompleted}
            className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isCompleted
                ? 'border border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41] cursor-default'
                : 'border border-[#00FF41]/50 bg-[#00FF41]/15 hover:bg-[#00FF41]/25 text-[#00FF41] cursor-pointer'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Mark Complete (+{meta.xpReward} XP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Module Workspace Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800/90 pb-3">
        <div>
          <div className="text-xs font-ghost-mono text-[#00E5FF] mb-0.5">
            {meta.num}. {meta.category}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {meta.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Module Content */}
      <div>{children}</div>
    </div>
  );
};
