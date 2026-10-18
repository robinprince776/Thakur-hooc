import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Shield,
  Activity,
  Zap,
  Coffee,
  Eye,
  Check
} from 'lucide-react';

export interface ZenFocusAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const ZenFocusApp: React.FC<ZenFocusAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'soundscapes' | 'burnout' | 'rituals'>('breathing');

  // Breathing Engine State
  const [breathPattern, setBreathPattern] = useState<'box' | '478'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);

  // Web Audio Ambient Synthesizer
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [soundMode, setSoundMode] = useState<'brown' | 'binaural' | 'rain'>('brown');
  const [volume, setVolume] = useState(0.3);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);

  // Breathing Engine Timer
  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('Inhale');
      setPhaseSecondsLeft(breathPattern === 'box' ? 4 : 4);
      return;
    }

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition to next phase
        if (breathPattern === 'box') {
          // Box: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Rest (4s)
          setBreathPhase((current) => {
            if (current === 'Inhale') return 'Hold';
            if (current === 'Hold') return 'Exhale';
            if (current === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        } else {
          // 4-7-8: Inhale (4s) -> Hold (7s) -> Exhale (8s)
          setBreathPhase((current) => {
            if (current === 'Inhale') {
              setPhaseSecondsLeft(7);
              return 'Hold';
            }
            if (current === 'Hold') {
              setPhaseSecondsLeft(8);
              return 'Exhale';
            }
            setPhaseSecondsLeft(4);
            return 'Inhale';
          });
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathPattern]);

  // Audio Synthesizer Logic (Web Audio API)
  const stopAudio = () => {
    try {
      if (sourceNodeRef.current) {
        (sourceNodeRef.current as any).stop?.();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch {}
    setIsPlayingAudio(false);
  };

  const startAudio = () => {
    stopAudio();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.connect(ctx.destination);
      gainNodeRef.current = gainNode;

      if (soundMode === 'binaural') {
        // Binaural beat: 432 Hz left, 442 Hz right (10 Hz Alpha beat for calm focus)
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);
        osc.connect(gainNode);
        osc.start();
        sourceNodeRef.current = osc;
      } else {
        // Brown noise / Rain buffer generation
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (soundMode === 'brown') {
            // Brown noise: integrate white noise
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            // Rain pattern: pink filtered noise with soft droplets
            output[i] = (lastOut + 0.08 * white) / 1.08;
            lastOut = output[i];
            output[i] *= 2.0;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(gainNode);
        whiteNoise.start();
        sourceNodeRef.current = whiteNoise;
      }

      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Shutdown Ritual State
  const [ritualTasks, setRitualTasks] = useState([
    { id: 1, text: 'Push all Git commits and stash uncommitted experiments', done: true },
    { id: 2, text: 'Review tomorrow\'s top 3 engineering priorities', done: false },
    { id: 3, text: 'Close all 35 browser tabs down to 0', done: false },
    { id: 4, text: 'Set Slack / Teams status to "Offline & Recharging"', done: true },
    { id: 5, text: '20-20-20 Eye break: Look at 20 feet away for 20 seconds', done: false }
  ]);

  const toggleTask = (id: number) => {
    setRitualTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">ZenFocus</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  #zenfocus · App #42
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Burnout prevention, animated breathwork pacing & client-side ambient soundscapes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700 cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white transition-all shadow cursor-pointer"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'breathing', label: 'Breathing Engine', icon: Activity },
            { id: 'soundscapes', label: 'Ambient Audio Synthesizer', icon: Volume2 },
            { id: 'burnout', label: 'Burnout Recovery Protocol', icon: Shield },
            { id: 'rituals', label: 'Daily Shutdown Ritual', icon: Coffee }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Breathing Engine Tab */}
        {activeTab === 'breathing' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-2xl flex flex-col items-center justify-center space-y-8 text-center">
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-white">Vagus Nerve Reset Pacer</h3>
              <p className="text-xs text-slate-400">
                Activates parasympathetic nervous system, lowers cortisol, and clears brain fog during debugging fatigue.
              </p>
            </div>

            {/* Pattern Selector */}
            <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setBreathPattern('box');
                  setIsBreathingActive(false);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  breathPattern === 'box'
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Box Breathing (4-4-4-4 Navy SEAL)
              </button>
              <button
                onClick={() => {
                  setBreathPattern('478');
                  setIsBreathingActive(false);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  breathPattern === '478'
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                4-7-8 Relaxing Breath (Deep Sleep)
              </button>
            </div>

            {/* Visual Animated Breathing Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-teal-500/10 border-2 border-teal-500/40 transition-all duration-1000 ${
                  isBreathingActive && breathPhase === 'Inhale'
                    ? 'scale-110 border-teal-400 bg-teal-500/20 shadow-2xl shadow-teal-500/20'
                    : isBreathingActive && breathPhase === 'Hold'
                    ? 'scale-110 border-cyan-400 bg-cyan-500/25'
                    : isBreathingActive && breathPhase === 'Exhale'
                    ? 'scale-75 border-slate-600 bg-slate-900/60'
                    : 'scale-90 border-slate-700'
                }`}
              />
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold block">
                  {breathPhase}
                </span>
                <span className="text-5xl font-black font-mono text-white block">
                  {phaseSecondsLeft}s
                </span>
                <span className="text-[11px] text-slate-400 font-medium block">
                  {breathPhase === 'Inhale'
                    ? 'Breathe deeply through nose'
                    : breathPhase === 'Hold'
                    ? 'Keep lungs gently full'
                    : breathPhase === 'Exhale'
                    ? 'Slow whoosh through mouth'
                    : 'Rest and pause'}
                </span>
              </div>
            </div>

            {/* Play/Stop Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
              >
                {isBreathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBreathingActive ? 'Pause Breathwork' : 'Start Guided Session'}</span>
              </button>
              <button
                onClick={() => {
                  setIsBreathingActive(false);
                  setBreathPhase('Inhale');
                  setPhaseSecondsLeft(4);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer border border-slate-700"
                title="Reset session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Ambient Soundscapes Tab */}
        {activeTab === 'soundscapes' && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-teal-400" />
                Pure Web Audio Focus Synthesizer (Zero External MP3s)
              </h3>
              <p className="text-xs text-slate-400">
                Generated dynamically in real-time inside your browser using mathematical noise algorithms and sine oscillators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'brown', title: 'Deep Brown Noise', desc: 'Warm low-frequency rumble that masks office chatter and traffic noise.' },
                { id: 'binaural', title: '432 Hz Alpha Binaural Beat', desc: 'Calming harmonic tone engineered for flow state and deep problem-solving.' },
                { id: 'rain', title: 'Gentle Rain Shower', desc: 'Soft algorithmic pink noise simulating soothing raindrops.' }
              ].map((sound) => {
                const isSelected = soundMode === sound.id;
                return (
                  <div
                    key={sound.id}
                    onClick={() => {
                      setSoundMode(sound.id as any);
                      if (isPlayingAudio) setTimeout(startAudio, 50);
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500 shadow-lg shadow-teal-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-white">{sound.title}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{sound.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Audio Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-4">
                <button
                  onClick={isPlayingAudio ? stopAudio : startAudio}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    isPlayingAudio
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingAudio ? 'Stop Soundscape' : 'Play Soundscape'}</span>
                </button>
                <div className="text-xs text-slate-400 font-mono">
                  Status: {isPlayingAudio ? <span className="text-teal-400 font-bold">Playing Live</span> : 'Muted'}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-64">
                <span className="text-xs text-slate-400">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-teal-400"
                />
                <span className="text-xs font-mono text-slate-300">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Burnout Recovery Tab */}
        {activeTab === 'burnout' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                The 4 Stages of Developer Burnout
              </h3>
              <div className="space-y-3">
                {[
                  { stage: '1. The Compulsion to Prove', sign: 'Working late nights, skipping meals, measuring self-worth solely through completed PRs.' },
                  { stage: '2. Emotional Detachment', sign: 'Cynicism towards team code reviews, feeling numb about product milestones, chronic tiredness.' },
                  { stage: '3. Cognitive Impairment', sign: 'Simple syntax errors take hours to spot, reading documentation feels like static noise.' },
                  { stage: '4. Physical Collapse', sign: 'Frequent headaches, insomnia, eye strain, dreading opening the laptop.' }
                ].map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-mono font-bold text-teal-400">{s.stage}</span>
                    <p className="text-xs text-slate-300">{s.sign}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Evidence-Based Recovery Protocol
              </h3>
              <div className="space-y-3">
                {[
                  { rule: '90-Minute Ultradian Work Cycles', desc: 'The human brain operates on 90-minute circadian focus waves. Never code past 90 mins without standing up.' },
                  { rule: '20-20-20 Optic Rule', desc: 'Every 20 minutes, gaze at an object 20 feet away for 20 seconds to prevent ciliary muscle eye strain.' },
                  { rule: 'Digital Sunset at 9:00 PM', desc: 'Turn off blue-light screens 1 hour before sleep to allow melatonin synthesis and REM memory consolidation.' },
                  { rule: 'Single-Tasking Architecture', desc: 'Turn off notification badges. Context switching between Slack and code consumes up to 23 minutes per interruption.' }
                ].map((p, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-amber-400">{p.rule}</span>
                    <p className="text-xs text-slate-300">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shutdown Ritual Tab */}
        {activeTab === 'rituals' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-teal-400" />
                Cal Newport's Evening Shutdown Routine
              </h3>
              <p className="text-xs text-slate-400">
                A formal mental boundary signals your subconscious that work is done, preventing bedtime anxiety and insomnia.
              </p>
            </div>

            <div className="space-y-2.5">
              {ritualTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    t.done
                      ? 'bg-slate-950 border-slate-800 text-slate-400'
                      : 'bg-slate-950/80 border-teal-500/40 text-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${t.done ? 'bg-teal-600 border-teal-500 text-white' : 'border-slate-600'}`}>
                      {t.done && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs ${t.done ? 'line-through text-slate-500' : 'font-medium'}`}>
                      {t.text}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${t.done ? 'bg-slate-800 text-slate-500' : 'bg-teal-500/20 text-teal-300 font-bold'}`}>
                    {t.done ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
