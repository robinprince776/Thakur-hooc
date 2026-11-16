import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

const RANK_TIERS = [
  { rank: 'Recruit Observer', minXp: 0 },
  { rank: 'Junior Telemetry Operator', minXp: 150 },
  { rank: 'Defensive Security Analyst', minXp: 450 },
  { rank: 'Lead SOC Responder', minXp: 900 },
  { rank: 'Principal Threat Hunter', minXp: 1500 },
  { rank: 'Ghost Intelligence Architect', minXp: 2500 },
];

export const SkillProgressionModule: React.FC = () => {
  const xp = useGhostStore((s) => s.xp);
  const level = useGhostStore((s) => s.level);
  const rankTitle = useGhostStore((s) => s.rankTitle);
  const completedModules = useGhostStore((s) => s.completedModules);
  const completedMissions = useGhostStore((s) => s.completedMissions);
  const completedVmTasks = useGhostStore((s) => s.completedVmTasks);
  const triageDecisions = useGhostStore((s) => s.triageDecisions);

  const nextLevelXp = level * 250;
  const levelProgressPct = Math.min(100, Math.round(((xp % 250) / 250) * 100));
  const correctTriages = Object.values(triageDecisions).filter((d) => d.correct).length;

  return (
    <ModuleFrame moduleId="progression">
      <div className="space-y-6">
        <div className="rounded-xl border border-[#00E5FF]/30 bg-[#0D1322] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-ghost-mono text-[#00E5FF]">Ghost Protocol Operator Profile</div>
            <h3 className="text-xl font-bold text-white">{rankTitle}</h3>
            <p className="text-xs text-slate-400">
              Level {level} · {xp} Total XP · Next level at {nextLevelXp} XP
            </p>
          </div>
          <div className="w-full sm:w-56 space-y-1.5">
            <div className="flex justify-between text-xs font-ghost-mono">
              <span className="text-slate-400">Level Progress</span>
              <span className="text-[#00FF41]">{levelProgressPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-[#00FF41]" style={{ width: `${levelProgressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4">
            <div className="text-xs text-slate-400">Modules Mastered</div>
            <div className="mt-1 text-2xl font-bold font-ghost-mono text-[#00E5FF]">
              {completedModules.length} / 14
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4">
            <div className="text-xs text-slate-400">VM Hardening Objectives</div>
            <div className="mt-1 text-2xl font-bold font-ghost-mono text-[#00FF41]">
              {completedVmTasks.length} / 4
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4">
            <div className="text-xs text-slate-400">Missions &amp; Accurate Triages</div>
            <div className="mt-1 text-2xl font-bold font-ghost-mono text-white">
              {completedMissions.length} · {correctTriages}
            </div>
          </div>
        </div>

        {/* Rank Ladder */}
        <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-3">
          <h4 className="text-sm font-semibold text-white">Clearance Rank Ladder</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RANK_TIERS.map((tier) => {
              const unlocked = xp >= tier.minXp;
              return (
                <div
                  key={tier.rank}
                  className={`p-3.5 rounded-lg border flex items-center justify-between ${
                    unlocked
                      ? 'border-[#00FF41]/40 bg-[#00FF41]/5'
                      : 'border-slate-800 bg-[#090D16] opacity-70'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{tier.rank}</div>
                    <div className="text-[11px] font-ghost-mono text-slate-400">{tier.minXp} XP Required</div>
                  </div>
                  {unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0" />
                  ) : (
                    <Award className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
