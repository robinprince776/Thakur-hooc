import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, Compass, ArrowLeft } from 'lucide-react';

interface ModuleLearningHeaderProps {
  title: string;
  category: string;
  level?: 'Beginner' | 'Intermediate' | 'Pro' | 'Specialized';
  description: string;
  outcomes: string[];
  onBackToHome?: () => void;
  onOpenRoadmap?: () => void;
}

export const ModuleLearningHeader: React.FC<ModuleLearningHeaderProps> = ({
  title,
  category,
  level = 'Intermediate',
  description,
  outcomes,
  onBackToHome,
  onOpenRoadmap,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const levelColor =
    level === 'Beginner'
      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
      : level === 'Intermediate'
      ? 'bg-blue-950 text-blue-300 border-blue-800'
      : level === 'Pro'
      ? 'bg-purple-950 text-purple-300 border-purple-800'
      : 'bg-amber-950 text-amber-300 border-amber-800';

  return (
    <div className="w-full mb-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-lg backdrop-blur-xl p-3.5 sm:p-4 text-slate-200 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Level */}
        <div className="flex items-center gap-3">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Return to Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${levelColor}`}>
                {level}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {category}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide mt-0.5">
              {title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {onOpenRoadmap && (
            <button
              onClick={onOpenRoadmap}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-mono text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>University Roadmap</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-[11px] font-medium text-slate-300 transition cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isExpanded ? 'Hide Outcomes' : 'Learning Outcomes'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Description & Learning Outcomes dropdown */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-fade-in text-xs">
          <p className="text-slate-300 leading-relaxed">{description}</p>
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Key Learning Outcomes:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {outcomes.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-200 text-[11px]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
