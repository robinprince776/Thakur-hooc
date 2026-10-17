import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  Layers,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Flame,
  Plus,
  Trash2
} from 'lucide-react';

export interface FocusAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const FocusApp: React.FC<FocusAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Daily Tasks State
  const [tasks, setTasks] = useState<Array<{ id: number; text: string; done: boolean }>>([
    { id: 1, text: 'Solve 1 OverTheWire Bandit level', done: true },
    { id: 2, text: 'Review STRIDE threat modeling notes', done: true },
    { id: 3, text: 'Inspect 5 sample auth.log brute force entries', done: false }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Audio Synth State (Web Audio API)
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedSessions((prev) => prev + 1);
        setMode('shortBreak');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const switchMode = (m: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(m);
    setIsRunning(false);
    if (m === 'work') setTimeLeft(25 * 60);
    if (m === 'shortBreak') setTimeLeft(5 * 60);
    if (m === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleAmbientSound = () => {
    if (!isAmbientPlaying) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime); // Low soothing drone
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setAudioCtx(ctx);
        setIsAmbientPlaying(true);
      } catch {}
    } else {
      audioCtx?.close();
      setAudioCtx(null);
      setIsAmbientPlaying(false);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: newTaskInput.trim(), done: false }]);
    setNewTaskInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToBca}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Return to BCA Verse"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                      Focus Studio &amp; Pomodoro
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Deep Work
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Pomodoro timer, daily study habit tracker &amp; ambient cyber soundscapes
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suite Apps</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pomodoro Timer Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="flex gap-2">
              {[
                { id: 'work', label: 'Work (25m)' },
                { id: 'shortBreak', label: 'Short Break (5m)' },
                { id: 'longBreak', label: 'Long Break (15m)' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => switchMode(m.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === m.id
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Huge Timer Numbers */}
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white py-4">
              {formatTime(timeLeft)}
            </div>

            {/* Play/Pause Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => switchMode(mode)}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleAmbientSound}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isAmbientPlaying
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title={isAmbientPlaying ? 'Stop Ambient Tone' : 'Play Cyber Ambient Drone'}
              >
                {isAmbientPlaying ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-xs text-slate-400 pt-2 font-mono">
              Completed Pomodoros Today: <strong className="text-cyan-400">{completedSessions} sessions</strong>
            </div>
          </div>

          {/* Daily Tasks & Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 text-xs">
            <h3 className="text-lg font-bold text-white">Daily Study &amp; Practice Goals</h3>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add a new study goal (e.g. Solve 2 LeetCode problems)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-500 text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    task.done ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-400 line-through' : 'bg-slate-850 border-slate-800 text-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, done: !t.done } : t))}
                    className="flex items-center gap-2.5 text-left cursor-pointer flex-1"
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${task.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span>{task.text}</span>
                  </button>
                  <button
                    onClick={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
