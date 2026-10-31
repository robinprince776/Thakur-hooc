import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Disc,
  Sliders,
  Radio,
  Layers,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Square,
  Compass,
  ArrowRight,
  BookOpen,
  Waves,
  Mic2,
  Guitar,
  Clock,
  Activity,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export interface MusicMasterAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSwitchApp?: (appId: string) => void;
}

interface PianoKey {
  note: string;
  svara: string;
  freq: number;
  isBlack: boolean;
  keyLabel: string;
}

const PIANO_KEYS: PianoKey[] = [
  { note: 'C4', svara: 'Sa', freq: 261.63, isBlack: false, keyLabel: 'A' },
  { note: 'C#4', svara: 're (komal)', freq: 277.18, isBlack: true, keyLabel: 'W' },
  { note: 'D4', svara: 'Re (shuddha)', freq: 293.66, isBlack: false, keyLabel: 'S' },
  { note: 'D#4', svara: 'ga (komal)', freq: 311.13, isBlack: true, keyLabel: 'E' },
  { note: 'E4', svara: 'Ga (shuddha)', freq: 329.63, isBlack: false, keyLabel: 'D' },
  { note: 'F4', svara: 'Ma (shuddha)', freq: 349.23, isBlack: false, keyLabel: 'F' },
  { note: 'F#4', svara: 'Ma (teevra)', freq: 369.99, isBlack: true, keyLabel: 'T' },
  { note: 'G4', svara: 'Pa', freq: 392.00, isBlack: false, keyLabel: 'G' },
  { note: 'G#4', svara: 'dha (komal)', freq: 415.30, isBlack: true, keyLabel: 'Y' },
  { note: 'A4', svara: 'Dha (shuddha)', freq: 440.00, isBlack: false, keyLabel: 'H' },
  { note: 'A#4', svara: 'ni (komal)', freq: 466.16, isBlack: true, keyLabel: 'U' },
  { note: 'B4', svara: 'Ni (shuddha)', freq: 493.88, isBlack: false, keyLabel: 'J' },
  { note: 'C5', svara: 'Tar Sa', freq: 523.25, isBlack: false, keyLabel: 'K' }
];

export const MusicMasterApp: React.FC<MusicMasterAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSwitchApp
}) => {
  const [activeTab, setActiveTab] = useState<'piano' | 'indian' | 'western' | 'production' | 'acoustics'>('piano');
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [synthWaveform, setSynthWaveform] = useState<OscillatorType>('sine');
  const [selectedRaag, setSelectedRaag] = useState<string>('yaman');
  const [isPlayingTaal, setIsPlayingTaal] = useState<boolean>(false);
  const [currentMatra, setCurrentMatra] = useState<number>(1);
  const [bpm, setBpm] = useState<number>(80);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize or get Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play single note sound synthesized in real-time
  const playSound = (freq: number, noteName: string) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = synthWaveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Smooth attack & decay envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.0);

      setActiveNote(noteName);
      setTimeout(() => setActiveNote(null), 300);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  };

  // Keyboard shortcut listener for virtual piano
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const keyUpper = e.key.toUpperCase();
      const match = PIANO_KEYS.find(k => k.keyLabel === keyUpper);
      if (match) {
        playSound(match.freq, match.note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [synthWaveform]);

  // Teentaal Rhythm Metronome Loop
  useEffect(() => {
    let interval: any = null;
    if (isPlayingTaal) {
      const msPerBeat = (60 / bpm) * 1000;
      interval = setInterval(() => {
        setCurrentMatra(prev => {
          const next = prev >= 16 ? 1 : prev + 1;
          // Play click sound on beat
          try {
            const ctx = getAudioContext();
            if (ctx) {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              // Higher pitch on 'Sam' (Beat 1)
              osc.frequency.setValueAtTime(next === 1 ? 880 : (next === 5 || next === 13 ? 550 : 330), ctx.currentTime);
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.1);
            }
          } catch {}
          return next;
        });
      }, msPerBeat);
    } else {
      setCurrentMatra(1);
    }
    return () => clearInterval(interval);
  }, [isPlayingTaal, bpm]);

  // Raag Encyclopedia Data
  const raagCatalog: Record<string, {
    name: string;
    thaat: string;
    prahar: string;
    rasa: string;
    aaroh: string;
    avroh: string;
    pakad: string;
    vadi: string;
    samvadi: string;
    description: string;
  }> = {
    yaman: {
      name: 'Raag Yaman (Kalyan Thaat)',
      thaat: 'Kalyan (All shuddha svara except Teevra Ma)',
      prahar: 'First Prahar of Night (6:00 PM – 9:00 PM)',
      rasa: 'Shringar & Shanti (Romantic, Devotional & Peaceful)',
      aaroh: "Ni' Re Ga, Ma(t) Dha Ni Sa'",
      avroh: "Sa' Ni Dha Pa, Ma(t) Ga Re Sa",
      pakad: "Ni' Re Ga, Re Sa, Pa Ma(t) Ga Re Sa",
      vadi: 'Ga (Gandhar)',
      samvadi: 'Ni (Nishad)',
      description: 'The emperor of evening ragas in Hindustani classical music. Renowned for its uplifting, serene, and majestic mood.'
    },
    bhairav: {
      name: 'Raag Bhairav (Bhairav Thaat)',
      thaat: 'Bhairav (Komal re and Komal dha with distinctive andolans)',
      prahar: 'First Prahar of Morning / Dawn (3:00 AM – 6:00 AM)',
      rasa: 'Bhakti, Vairagya & Gambhir (Deep meditation, devotion, seriousness)',
      aaroh: "Sa re Ga Ma Pa dha Ni Sa'",
      avroh: "Sa' Ni dha Pa Ma Ga re Sa",
      pakad: "Ga Ma dha~ Pa, Ga Ma re~ Sa",
      vadi: 'dha (Komal Dhaivat with heavy oscillation)',
      samvadi: 're (Komal Rishabh)',
      description: 'The primordial morning raga associated with Lord Shiva. Its lingering oscillations on komal re and dha evoke immense spiritual awakening.'
    },
    darbari: {
      name: 'Raag Darbari Kanhada (Asavari Thaat)',
      thaat: 'Asavari (Komal ga, dha, ni)',
      prahar: 'Late Midnight (12:00 AM – 3:00 AM)',
      rasa: 'Veer & Gambhir (Regal, Majestic, Profound solemnity)',
      aaroh: "Sa Re ga, Ma Pa, dha, ni Sa'",
      avroh: "Sa' ni dha Pa, Ma Pa ga, Ma Re Sa",
      pakad: "ga~ Ma Re Sa, dha~ ni Pa",
      vadi: 'Re (Rishabh)',
      samvadi: 'Pa (Pancham)',
      description: 'Created by Miyan Tansen for the royal court of Emperor Akbar. One of the most difficult and prestigious ragas demanding slow, weighty meends.'
    },
    bageshri: {
      name: 'Raag Bageshri (Kafi Thaat)',
      thaat: 'Kafi (Komal ga and ni, Pancham varjit in aaroh)',
      prahar: 'Second Prahar of Night (9:00 PM – 12:00 AM)',
      rasa: 'Viraha & Karuna (Longing of reunion with the beloved)',
      aaroh: "Sa ga Ma Dha ni Sa'",
      avroh: "Sa' ni Dha, Ma Pa Dha, ga Ma Re Sa",
      pakad: "Dha' ni' Sa, Ma, Dha ni Dha Ma, ga Ma Re Sa",
      vadi: 'Ma (Madhyam)',
      samvadi: 'Sa (Shadja)',
      description: 'A deeply romantic raga portraying the emotion of sweet anticipation and melancholic longing between lovers.'
    },
    malkauns: {
      name: 'Raag Malkauns (Bhairavi Thaat)',
      thaat: 'Bhairavi (Audav-Audav: 5 notes only; Re and Pa strictly absent)',
      prahar: 'Deep Midnight (12:00 AM – 3:00 AM)',
      rasa: 'Veer & Shanti (Mystical, Supernatural energy, Transcendence)',
      aaroh: "Sa ga Ma dha ni Sa'",
      avroh: "Sa' ni dha Ma ga Sa",
      pakad: "ga Ma dha Ma, ga Ma ga Sa",
      vadi: 'Ma (Madhyam)',
      samvadi: 'Sa (Shadja)',
      description: 'Ancient tantric raga created to calm Lord Shiva. Pentatonic scale with immense hypnotic resonance and slow alap.'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Glass Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 border border-pink-400/30">
            <Music className="w-5 h-5 text-pink-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                SvaraPulse Musicology Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Acoustics · Ragas · Audio Engineering
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Web Audio Synthesizer, 10 Thaats, Western Circle of 5ths & Studio Production
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">All Apps</span>
            </button>
          )}
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Main Hub
            </button>
          )}
        </div>
      </header>

      {/* Navigation Pills */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-5">
        <div className="p-1.5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center gap-1 overflow-x-auto scrollbar-none shadow-xl">
          {[
            { id: 'piano', label: '1. Svara Piano & Synthesizer', icon: Waves },
            { id: 'indian', label: '2. Indian Classical & Ragas', icon: Disc },
            { id: 'western', label: '3. Western Theory & Chords', icon: Layers },
            { id: 'production', label: '4. Audio Production & Mixing', icon: Sliders },
            { id: 'acoustics', label: '5. Acoustics & Physics', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-6">
        {/* TAB 1: INTERACTIVE PIANO & SYNTHESIZER */}
        {activeTab === 'piano' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/80 to-purple-950/30 border border-purple-500/20 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    Live Web Audio Engine
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                    Interactive Dual-System Keyboard
                  </h2>
                  <p className="text-xs text-slate-300">
                    Play notes in real time using mouse or keyboard keys (A, W, S, E, D, F, T, G, Y, H, U, J, K).
                    Each key displays Western pitch + Indian Svara!
                  </p>
                </div>

                {/* Synth Controls */}
                <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-white/10">
                  <span className="text-xs text-slate-400 font-mono px-2">Waveform:</span>
                  {(['sine', 'triangle', 'sawtooth', 'square'] as OscillatorType[]).map(wave => (
                    <button
                      key={wave}
                      onClick={() => setSynthWaveform(wave)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                        synthWaveform === wave
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {wave}
                    </button>
                  ))}
                </div>
              </div>

              {/* Virtual Piano Keys Container */}
              <div className="mt-8 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner flex justify-center overflow-x-auto">
                <div className="relative inline-flex items-start h-56 select-none py-2">
                  {PIANO_KEYS.map((k) => {
                    const isActive = activeNote === k.note;

                    if (!k.isBlack) {
                      return (
                        <button
                          key={k.note}
                          onClick={() => playSound(k.freq, k.note)}
                          className={`w-12 sm:w-14 h-48 sm:h-52 rounded-b-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 flex flex-col justify-end p-2 text-center transition-all cursor-pointer shadow-md -mr-1.5 ${
                            isActive ? 'bg-pink-200 border-pink-500 scale-[0.98]' : ''
                          }`}
                        >
                          <span className="text-[10px] font-mono text-slate-400 font-bold">[{k.keyLabel}]</span>
                          <span className="text-xs font-black text-slate-900">{k.note}</span>
                          <span className="text-[10px] font-bold text-purple-700 truncate">{k.svara}</span>
                        </button>
                      );
                    } else {
                      return (
                        <button
                          key={k.note}
                          onClick={() => playSound(k.freq, k.note)}
                          style={{ marginLeft: '-18px', marginRight: '-18px', zIndex: 10 }}
                          className={`w-8 sm:w-9 h-28 sm:h-32 rounded-b-xl border border-slate-700 bg-gradient-to-b from-slate-800 to-black hover:from-slate-700 hover:to-slate-900 flex flex-col justify-end p-1.5 text-center transition-all cursor-pointer shadow-xl ${
                            isActive ? 'bg-pink-600 border-pink-400' : ''
                          }`}
                        >
                          <span className="text-[9px] font-mono text-slate-500">[{k.keyLabel}]</span>
                          <span className="text-[11px] font-bold text-white">{k.note}</span>
                          <span className="text-[8px] font-semibold text-pink-400 truncate">{k.svara}</span>
                        </button>
                      );
                    }
                  })}
                </div>
              </div>
            </div>

            {/* Indian 7 Svaras Frequency & Emotion Table */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>The 7 Vedic Svaras (Sapta Svara) & Natural Animal Associations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">1. Sa (Shadja)</span>
                    <span className="text-slate-500 font-mono">261.6 Hz</span>
                  </div>
                  <p className="text-slate-300 font-semibold">Peacock's cry (Mayur)</p>
                  <p className="text-[11px] text-slate-400">Foundation svara, immortal (Achala), associated with peace.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">2. Re (Rishabh)</span>
                    <span className="text-slate-500 font-mono">293.6 Hz</span>
                  </div>
                  <p className="text-slate-300 font-semibold">Skylark / Bull (Chatak/Vrishabh)</p>
                  <p className="text-[11px] text-slate-400">Heroism, vitality, courage (Veer & Adbhuta Rasa).</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">3. Ga (Gandhar)</span>
                    <span className="text-slate-500 font-mono">329.6 Hz</span>
                  </div>
                  <p className="text-slate-300 font-semibold">Goat (Aja)</p>
                  <p className="text-[11px] text-slate-400">Sweetness, love, devotion (Shringar Rasa).</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">4. Ma (Madhyam)</span>
                    <span className="text-slate-500 font-mono">349.2 Hz</span>
                  </div>
                  <p className="text-slate-300 font-semibold">Heron / Crane (Kraunch)</p>
                  <p className="text-[11px] text-slate-400">Heart center (Anahata), compassion & laughter (Hasya Rasa).</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">5. Pa (Pancham)</span>
                    <span className="text-slate-500 font-mono">392.0 Hz</span>
                  </div>
                  <p className="text-slate-300 font-semibold">Cuckoo / Nightingale (Kokila)</p>
                  <p className="text-[11px] text-slate-400">The 5th, stationary anchor (Achala), joyful celebration.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">6. Dha (Dhaivat)</span>
                    <span className="text-slate-500 font-mono">440.0 Hz</span>
                  </div>
                  <p className="text-slate-300 font-semibold">Horse (Ashwa / Frog)</p>
                  <p className="text-[11px] text-slate-400">Majesty, fearlessness, or poignant tragedy (Bibhatsa & Bhayanak).</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">7. Ni (Nishad)</span>
                    <span className="text-slate-500 font-mono">493.8 Hz</span>
                  </div>
                  <p className="text-slate-300 font-semibold">Elephant (Gaja)</p>
                  <p className="text-[11px] text-slate-400">Deep compassion, sorrow, yearning for merger (Karuna Rasa).</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-pink-400 font-bold font-mono">Shrutis (Microtones)</span>
                    <span className="text-slate-500 font-mono">22 Shrutis</span>
                  </div>
                  <p className="text-slate-300 font-semibold">4-3-2-4-4-3-2 Division</p>
                  <p className="text-[11px] text-slate-400">Micro-intervals that give Indian music its expressive vocal meend.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INDIAN CLASSICAL & RAGAS */}
        {activeTab === 'indian' && (
          <div className="space-y-6">
            {/* Raag Explorer */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    Hindustani Classical Heritage
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Grand Classical Raag Encyclopedia
                  </h2>
                </div>

                {/* Raag Picker */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(raagCatalog).map(key => (
                    <button
                      key={key}
                      onClick={() => setSelectedRaag(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedRaag === key
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Raag Card */}
              {raagCatalog[selectedRaag] && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-white/5 space-y-4 mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <h3 className="text-lg font-black text-white">{raagCatalog[selectedRaag].name}</h3>
                    <span className="text-xs text-pink-400 font-mono">{raagCatalog[selectedRaag].prahar}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {raagCatalog[selectedRaag].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-slate-400 font-bold">Thaat:</span>
                      <p className="text-pink-300">{raagCatalog[selectedRaag].thaat}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-slate-400 font-bold">Mood / Dominant Rasa:</span>
                      <p className="text-purple-300">{raagCatalog[selectedRaag].rasa}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-slate-400 font-bold">Aaroh (Ascending):</span>
                      <p className="text-emerald-300">{raagCatalog[selectedRaag].aaroh}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-slate-400 font-bold">Avroh (Descending):</span>
                      <p className="text-cyan-300">{raagCatalog[selectedRaag].avroh}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-slate-400 font-bold">Pakad (Catch Phrase):</span>
                      <p className="text-amber-300">{raagCatalog[selectedRaag].pakad}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <span className="text-slate-400 font-bold">Vadi (King) & Samvadi (Queen):</span>
                      <p className="text-white">Vadi: {raagCatalog[selectedRaag].vadi} · Samvadi: {raagCatalog[selectedRaag].samvadi}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Teentaal Rhythm Metronome & Beat Counter */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Disc className="w-4 h-4 text-pink-400" />
                    <span>Teentaal Rhythm Metronome (16 Matras · 4 Vibhags)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dha Dhin Dhin Dha | Dha Dhin Dhin Dha | Dha Tin Tin Ta | Ta Dhin Dhin Dha
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">BPM:</span>
                    <input
                      type="range"
                      min="50"
                      max="160"
                      value={bpm}
                      onChange={e => setBpm(Number(e.target.value))}
                      className="w-24 accent-pink-500 cursor-pointer"
                    />
                    <span className="text-pink-400 font-bold w-8">{bpm}</span>
                  </div>

                  <button
                    onClick={() => setIsPlayingTaal(!isPlayingTaal)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingTaal
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'bg-emerald-600 text-white shadow-lg'
                    }`}
                  >
                    {isPlayingTaal ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{isPlayingTaal ? 'Stop Taal' : 'Start Taal'}</span>
                  </button>
                </div>
              </div>

              {/* 16 Matras Visual Display */}
              <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-2 pt-2">
                {[
                  { m: 1, bol: 'Dha', sign: 'X (Sam)' },
                  { m: 2, bol: 'Dhin', sign: '2' },
                  { m: 3, bol: 'Dhin', sign: '3' },
                  { m: 4, bol: 'Dha', sign: '4' },
                  { m: 5, bol: 'Dha', sign: '2 (Taali)' },
                  { m: 6, bol: 'Dhin', sign: '6' },
                  { m: 7, bol: 'Dhin', sign: '7' },
                  { m: 8, bol: 'Dha', sign: '8' },
                  { m: 9, bol: 'Dha', sign: '0 (Khaali)' },
                  { m: 10, bol: 'Tin', sign: '10' },
                  { m: 11, bol: 'Tin', sign: '11' },
                  { m: 12, bol: 'Ta', sign: '12' },
                  { m: 13, bol: 'Ta', sign: '3 (Taali)' },
                  { m: 14, bol: 'Dhin', sign: '14' },
                  { m: 15, bol: 'Dhin', sign: '15' },
                  { m: 16, bol: 'Dha', sign: '16' }
                ].map(item => {
                  const isCurrent = currentMatra === item.m && isPlayingTaal;
                  return (
                    <div
                      key={item.m}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-pink-600 border-pink-300 text-white shadow-lg scale-105'
                          : item.m === 1
                          ? 'bg-slate-900 border-pink-500/40 text-pink-300'
                          : 'bg-slate-950 border-white/5 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-500 font-bold">{item.m}</div>
                      <div className="text-xs font-black mt-0.5">{item.bol}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 font-mono">{item.sign}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 10 Thaats of Bhatkhande System */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white">The 10 Parent Thaats (Hindustani Classification)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                {[
                  { name: '1. Bilawal', svara: 'All Shuddha Notes', sample: 'Alhaiya Bilawal' },
                  { name: '2. Kalyan', svara: 'Teevra Ma (rest shuddha)', sample: 'Yaman, Shuddha Kalyan' },
                  { name: '3. Khamaj', svara: 'Komal ni', sample: 'Desh, Tilak Kamod' },
                  { name: '4. Kafi', svara: 'Komal ga, ni', sample: 'Bageshri, Bhimpalasi' },
                  { name: '5. Asavari', svara: 'Komal ga, dha, ni', sample: 'Darbari, Jaunpuri' },
                  { name: '6. Bhairav', svara: 'Komal re, dha', sample: 'Ahir Bhairav, Ramkali' },
                  { name: '7. Bhairavi', svara: 'Komal re, ga, dha, ni', sample: 'Malkauns, Bhupali' },
                  { name: '8. Todi', svara: 'Komal re, ga, dha + Teevra Ma', sample: 'Miyan Ki Todi' },
                  { name: '9. Poorvi', svara: 'Komal re, dha + Teevra Ma', sample: 'Puriya Dhanashree' },
                  { name: '10. Marwa', svara: 'Komal re + Teevra Ma (Pa varjit)', sample: 'Marwa, Puriya' }
                ].map((th, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                    <span className="font-bold text-pink-300">{th.name}</span>
                    <p className="text-[11px] text-slate-300 font-mono">{th.svara}</p>
                    <p className="text-[10px] text-slate-500 italic">e.g. {th.sample}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WESTERN THEORY & CHORDS */}
        {activeTab === 'western' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Western Harmony & Chord Construction
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Circle of Fifths & Diatonic Chords
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                The Circle of Fifths reveals the geometric relationship among the 12 chromatic pitches.
                Moving clockwise adds 1 Sharp (#); moving counter-clockwise adds 1 Flat (b).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-amber-400">Major Triad Formula</span>
                  <p className="text-xs text-slate-300 font-mono">Root + Major 3rd (4 st) + Perfect 5th (7 st)</p>
                  <p className="text-xs text-slate-400">
                    Formula: 1 - 3 - 5. Bright, triumphant, resolved feeling. E.g. C Major = C - E - G.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-cyan-400">Minor Triad Formula</span>
                  <p className="text-xs text-slate-300 font-mono">Root + Minor 3rd (3 st) + Perfect 5th (7 st)</p>
                  <p className="text-xs text-slate-400">
                    Formula: 1 - b3 - 5. Somber, reflective, emotional. E.g. A Minor = A - C - E.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-pink-400">Dominant 7th & Maj7</span>
                  <p className="text-xs text-slate-300 font-mono">1 - 3 - 5 - b7 (Dom 7) | 1 - 3 - 5 - 7 (Maj7)</p>
                  <p className="text-xs text-slate-400">
                    Provides harmonic tension and pull towards resolution (Blues & Jazz bedrock).
                  </p>
                </div>
              </div>
            </div>

            {/* The 7 Musical Modes Breakdown */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white">The 7 Diatonic Modes (Ancient Greek Scales)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {[
                  { name: 'Ionian (Major)', root: 'C to C', feeling: 'Happy, bright, triumphant (pop standard)' },
                  { name: 'Dorian', root: 'D to D', feeling: 'Jazzy, cool minor with natural 6th (Pink Floyd)' },
                  { name: 'Phrygian', root: 'E to E', feeling: 'Dark, Spanish/Flamenco exotic flavor (b2 note)' },
                  { name: 'Lydian', root: 'F to F', feeling: 'Dreamy, ethereal, space-like (#4 note)' },
                  { name: 'Mixolydian', root: 'G to G', feeling: 'Bluesy rock scale with flat 7th (AC/DC, Beatles)' },
                  { name: 'Aeolian (Minor)', root: 'A to A', feeling: 'Standard emotional natural minor' },
                  { name: 'Locrian', root: 'B to B', feeling: 'Extremely tense & unstable (diminished 5th)' }
                ].map((mode, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="font-bold text-cyan-300">{mode.name}</span>
                    <p className="text-[11px] text-slate-400 font-mono">{mode.root}</p>
                    <p className="text-xs text-slate-300">{mode.feeling}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIO PRODUCTION & MIXING */}
        {activeTab === 'production' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Music Production & Mixing Engineering
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                The 4 Pillars of a Radio-Ready Mix
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                A professional audio engineer carves frequencies so every element (Kick, Bass, Vocals, Guitars, Synths) has its dedicated pocket without masking or muddy clash.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    <span>1. Parametric Equalization (EQ)</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>• <strong>High-Pass Filter (Low-cut):</strong> Cut below 30Hz on master; cut below 80-100Hz on vocals to remove mic rumble.</li>
                    <li>• <strong>Mud Removal:</strong> Notch out 250Hz - 400Hz to eliminate boxiness.</li>
                    <li>• <strong>Vocal Presence:</strong> Boost gently around 3kHz - 5kHz for speech intelligibility.</li>
                    <li>• <strong>Air Band:</strong> High-shelf boost above 10kHz - 14kHz for modern sheen and silky polish.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>2. Dynamic Compression</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>• <strong>Threshold:</strong> The dB level above which the signal gets reduced.</li>
                    <li>• <strong>Ratio:</strong> How much reduction occurs (e.g. 4:1 means 4dB input over threshold yields 1dB out).</li>
                    <li>• <strong>Attack Time:</strong> Fast attack squashes transient punch; slow attack lets drum snap through.</li>
                    <li>• <strong>Release Time:</strong> Fast release pumps energy; auto release keeps vocals smooth.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Waves className="w-4 h-4" />
                    <span>3. Time-Based Effects (Reverb & Delay)</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>• <strong>Plate Reverb:</strong> Dense, bright, artificial reflection perfect for snare drums and pop vocals.</li>
                    <li>• <strong>Hall Reverb:</strong> Expansive, cathedral-like tail creating grand cinematic depth.</li>
                    <li>• <strong>Ducking Delay:</strong> Sidechain compressor ducks the delay while singer is singing, letting the echo bloom only in pauses!</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    <span>4. Mastering & Loudness Standards</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <li>• <strong>Integrated LUFS:</strong> Spotify targets -14 LUFS, Apple Music -16 LUFS, Club/EDM -8 to -6 LUFS.</li>
                    <li>• <strong>True Peak Ceiling:</strong> Set limiter to -1.0 dBFS to prevent inter-sample clipping during MP3/AAC lossy encoding.</li>
                    <li>• <strong>Mono Compatibility:</strong> Keep sub-bass (under 90Hz) 100% mono to avoid phase cancellation on club subwoofers!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACOUSTICS & PHYSICS OF SOUND */}
        {activeTab === 'acoustics' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                Physics of Sound & Harmonic Series
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Why Different Instruments Sound Different (Timbre)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                When a guitar string or flute plays 440 Hz (Note A4), it doesn't produce just one frequency. It vibrates at whole-number multiples called <strong>Harmonics / Overtones</strong> (880Hz, 1320Hz, 1760Hz). The relative strength of these overtones creates Timbre (sound color)!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-pink-400">Speed of Sound</span>
                  <div className="text-2xl font-black text-white font-mono">343 m/s</div>
                  <p className="text-xs text-slate-400">In 20°C air. Travels faster in liquids (~1480 m/s in water) and steel (~5960 m/s)!</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-cyan-400">Human Hearing Range</span>
                  <div className="text-2xl font-black text-white font-mono">20 Hz – 20 kHz</div>
                  <p className="text-xs text-slate-400">Most sensitive between 2 kHz and 5 kHz (evolutionary adaptation to human speech and baby cries).</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-amber-400">Decibel Scale (dB)</span>
                  <div className="text-2xl font-black text-white font-mono">Logarithmic</div>
                  <p className="text-xs text-slate-400">+10 dB represents a 10x increase in sound power and roughly 2x perceived loudness!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
