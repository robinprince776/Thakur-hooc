import React, { useState } from 'react';
import {
  Flame,
  Play,
  CheckCircle2,
  Plus,
  Trash2,
  StickyNote,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useOsStore } from '../store/useOsStore';
import { CurrentAppType } from './AppSwitcherModal';

interface OsWidgetsProps {
  onLaunchApp: (appId: CurrentAppType) => void;
}

export const OsWidgets: React.FC<OsWidgetsProps> = ({ onLaunchApp }) => {
  const {
    dailyStreak,
    lastOpenedApp,
    quickNotes,
    addQuickNote,
    deleteQuickNote
  } = useOsStore();

  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState<'cyan' | 'amber' | 'emerald' | 'purple'>('cyan');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addQuickNote(newNoteText.trim(), selectedColor);
    setNewNoteText('');
  };

  const colorStyles: Record<string, string> = {
    cyan: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200',
    amber: 'bg-amber-950/40 border-amber-500/30 text-amber-200',
    emerald: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200',
    purple: 'bg-purple-950/40 border-purple-500/30 text-purple-200'
  };

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Smart OS Dashboard & Widgets
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Real-time sync</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WIDGET 1: CONTINUE LEARNING */}
        <div className="p-5 rounded-3xl os-glass-card border-white/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Continue Learning
              </span>
              <span className="text-xs font-mono text-slate-400">
                {lastOpenedApp.progress}% Completed
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {lastOpenedApp.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Hub: {lastOpenedApp.category}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(15, lastOpenedApp.progress)}%` }}
              />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Pick up right where you left</span>
            <button
              onClick={() => onLaunchApp(lastOpenedApp.id)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer spring-press transition-all"
            >
              <span>Resume</span>
              <Play className="w-3 h-3 fill-white" />
            </button>
          </div>
        </div>

        {/* WIDGET 2: DAILY STREAK */}
        <div className="p-5 rounded-3xl os-glass-card border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                Daily Streak
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Active
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-white font-mono tracking-tight">
                {dailyStreak}
              </span>
              <span className="text-sm font-semibold text-slate-300">
                Days Unstoppable 🔥
              </span>
            </div>

            {/* Streak Milestones */}
            <div className="flex items-center gap-2 pt-1">
              {[3, 7, 14, 30].map((milestone) => {
                const reached = dailyStreak >= milestone;
                return (
                  <div
                    key={milestone}
                    className={`flex-1 py-1.5 text-center rounded-xl border text-[11px] font-mono font-bold transition-all ${
                      reached
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                        : 'bg-slate-900/40 border-white/5 text-slate-600'
                    }`}
                  >
                    {milestone}d
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
              <Award className="w-3.5 h-3.5" />
              <span>Next badge in {Math.max(1, 14 - dailyStreak)} days</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Streak Vault</span>
          </div>
        </div>

        {/* WIDGET 3: QUICK NOTES */}
        <div className="p-5 rounded-3xl os-glass-card border-white/10 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Quick Notes
              </span>
              <span className="text-xs font-mono text-slate-400">
                {quickNotes.length} saved
              </span>
            </div>

            {/* Note input form */}
            <form onSubmit={handleAddNote} className="flex gap-1.5">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Jot down quick concept or formula..."
                className="flex-1 text-xs px-3 py-1.5 rounded-xl os-glass-input placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer spring-press"
                title="Add Note"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Color tags */}
            <div className="flex items-center gap-1.5">
              {(['cyan', 'amber', 'emerald', 'purple'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                    color === 'cyan'
                      ? 'bg-cyan-400'
                      : color === 'amber'
                      ? 'bg-amber-400'
                      : color === 'emerald'
                      ? 'bg-emerald-400'
                      : 'bg-purple-400'
                  } ${selectedColor === color ? 'ring-2 ring-white scale-125' : 'opacity-60'}`}
                />
              ))}
              <span className="text-[10px] text-slate-500 ml-1">Color tag</span>
            </div>

            {/* Notes list */}
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 no-scrollbar">
              {quickNotes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className={`p-2 rounded-xl border text-xs flex items-start justify-between gap-2 transition-all ${
                    colorStyles[note.color] || colorStyles.cyan
                  }`}
                >
                  <p className="line-clamp-2 leading-relaxed text-[11px] font-medium">
                    {note.text}
                  </p>
                  <button
                    onClick={() => deleteQuickNote(note.id)}
                    className="text-slate-400 hover:text-rose-400 p-0.5 shrink-0 cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono text-right">
            Synced with OS LocalStorage
          </div>
        </div>
      </div>
    </section>
  );
};
