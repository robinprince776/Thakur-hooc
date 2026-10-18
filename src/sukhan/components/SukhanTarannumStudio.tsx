import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Square,
  Mic,
  RotateCcw,
  Download,
  Sliders,
  Sparkles,
  Radio,
  Clock,
  Heart,
  HelpCircle
} from 'lucide-react';

export const SukhanTarannumStudio: React.FC = () => {
  // Audio state
  const [isDronePlaying, setIsDronePlaying] = useState(false);
  const [droneVolume, setDroneVolume] = useState(0.5);
  const [selectedKey, setSelectedKey] = useState<'C' | 'C#' | 'D' | 'D#'>('C#');
  const [tuningType, setTuningType] = useState<'Pa-Sa' | 'Ma-Sa'>('Pa-Sa');

  // Metronome / Taal state
  const [selectedTaal, setSelectedTaal] = useState<'Keherwa' | 'Dadra' | 'Roopak' | 'Deepchandi'>('Keherwa');
  const [bpm, setBpm] = useState(80);
  const [isTaalPlaying, setIsTaalPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<{ gain: GainNode; oscillators: OscillatorNode[] } | null>(null);
  const taalIntervalRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);

  // Key frequencies in Hz
  const keyFrequencies: Record<string, number> = {
    C: 130.81,
    'C#': 138.59,
    D: 146.83,
    'D#': 155.56
  };

  // Taal beat structures
  const taalSpecs: Record<
    string,
    { beats: number; division: string; claps: string[]; description: string }
  > = {
    Keherwa: {
      beats: 8,
      division: '4 + 4',
      claps: ['Sam (X)', '2', '3', '4', 'Khali (0)', '6', '7', '8'],
      description: 'Ghazal aur Geet ki sabse lokpriya taal (Dha Ge Na Ti Na Ka Dhi Na)'
    },
    Dadra: {
      beats: 6,
      division: '3 + 3',
      claps: ['Sam (X)', '2', '3', 'Khali (0)', '5', '6'],
      description: 'Chanchal aur meethi 6 maatra taal (Dha Dhi Na Dha Tu Na)'
    },
    Roopak: {
      beats: 7,
      division: '3 + 2 + 2',
      claps: ['Khali (0)', '2', '3', 'Taali (1)', '5', 'Taali (2)', '7'],
      description: 'Gehri aur shastriya 7 maatra taal jo Khali se shuru hoti hai'
    },
    Deepchandi: {
      beats: 14,
      division: '3 + 4 + 3 + 4',
      claps: ['Sam (X)', '2', '3', 'Taali', '5', '6', '7', 'Khali', '9', '10', 'Taali', '12', '13', '14'],
      description: 'Thumri aur gambhir ghazlon ki 14 maatra vilambit taal'
    }
  };

  // Web Audio Context initializer
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Start Tanpura Drone
  const startTanpura = () => {
    const ctx = getAudioContext();
    const saFreq = keyFrequencies[selectedKey];
    // Fifth (Pa) = 1.5 * Sa, Fourth (Ma) = 1.333 * Sa
    const firstStringFreq = tuningType === 'Pa-Sa' ? saFreq * 1.5 : saFreq * 1.333;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(droneVolume, ctx.currentTime);

    // Filter to give acoustic warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    const oscillators: OscillatorNode[] = [];

    // Strings: 1st (Pa/Ma), 2nd (Sa high), 3rd (Sa high), 4th (Sa low base)
    const stringFreqs = [firstStringFreq, saFreq * 2, saFreq * 2, saFreq];

    stringFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx === 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Subtle detune for shimmer (Javari acoustic buzz)
      osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

      const strGain = ctx.createGain();
      strGain.gain.setValueAtTime(0.2, ctx.currentTime);

      // Gentle LFO tremolo simulating plucking cadence
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.3 + idx * 0.1, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(strGain.gain);
      lfo.start();

      osc.connect(strGain);
      strGain.connect(filter);
      osc.start();
      oscillators.push(osc);
      oscillators.push(lfo);
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    droneNodesRef.current = { gain: masterGain, oscillators };
    setIsDronePlaying(true);
  };

  // Stop Tanpura Drone
  const stopTanpura = () => {
    if (droneNodesRef.current) {
      droneNodesRef.current.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      droneNodesRef.current.gain.disconnect();
      droneNodesRef.current = null;
    }
    setIsDronePlaying(false);
  };

  const toggleDrone = () => {
    if (isDronePlaying) {
      stopTanpura();
    } else {
      startTanpura();
    }
  };

  // Update volume
  useEffect(() => {
    if (droneNodesRef.current && audioCtxRef.current) {
      droneNodesRef.current.gain.gain.setValueAtTime(
        droneVolume,
        audioCtxRef.current.currentTime
      );
    }
  }, [droneVolume]);

  // Restart Tanpura if key or tuning changes while playing
  useEffect(() => {
    if (isDronePlaying) {
      stopTanpura();
      startTanpura();
    }
  }, [selectedKey, tuningType]);

  // Clean up audio context on unmount
  useEffect(() => {
    return () => {
      stopTanpura();
      if (taalIntervalRef.current) clearInterval(taalIntervalRef.current);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  // Metronome / Taal Clicker
  const playClickSound = (isSam: boolean) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isSam ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isSam ? 660 : 440, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  };

  // Start / Stop Taal Metronome
  const toggleTaal = () => {
    if (isTaalPlaying) {
      clearInterval(taalIntervalRef.current);
      setIsTaalPlaying(false);
      setCurrentBeat(0);
    } else {
      setIsTaalPlaying(true);
      const intervalMs = (60 / bpm) * 1000;
      let beat = 0;
      setCurrentBeat(0);
      playClickSound(true);

      taalIntervalRef.current = setInterval(() => {
        const total = taalSpecs[selectedTaal].beats;
        beat = (beat + 1) % total;
        setCurrentBeat(beat);
        playClickSound(beat === 0);
      }, intervalMs);
    }
  };

  // Update metronome timing when BPM changes
  useEffect(() => {
    if (isTaalPlaying) {
      clearInterval(taalIntervalRef.current);
      const intervalMs = (60 / bpm) * 1000;
      let beat = currentBeat;
      taalIntervalRef.current = setInterval(() => {
        const total = taalSpecs[selectedTaal].beats;
        beat = (beat + 1) % total;
        setCurrentBeat(beat);
        playClickSound(beat === 0);
      }, intervalMs);
    }
  }, [bpm, selectedTaal]);

  // Voice Recording Engine
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access is needed for Riyaz voice recorder.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordTimerRef.current);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-6 select-none animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#15151C] via-[#0B0B0F] to-[#251025] border border-[#C6A66B]/30 shadow-2xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0B0F] border border-[#C6A66B]/40 text-xs font-semibold text-[#C6A66B]">
              <Music className="w-3.5 h-3.5" />
              <span>Tarannum & Riyaz Studio</span>
              <span className="w-1 h-1 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] text-zinc-400">Pure Client-side Web Audio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#FFF5EA] tracking-wide">
              Mauseeqi, Tanpura & <span className="italic text-[#C6A66B]">Riyaz Companion</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Ghazal padhne aur tarannum me sher sunane ke liye acoustic Tanpura drone, Hindustani Taal metronome aur live voice recorder.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDrone}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-xl cursor-pointer ${
                isDronePlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-[#C6A66B] hover:bg-[#b5955a] text-slate-950 shadow-[#C6A66B]/30'
              }`}
            >
              {isDronePlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isDronePlaying ? 'Stop Tanpura' : 'Play Tanpura Drone'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Tanpura Controls & Taal Metronome */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tanpura Section */}
        <div className="rounded-3xl p-6 bg-[#121218] border border-[#C6A66B]/25 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#FFF5EA] flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#C6A66B]" />
              <span>Acoustic Tanpura Drone (तानपूरा)</span>
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isDronePlaying
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 animate-pulse'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {isDronePlaying ? 'Resonating' : 'Muted'}
            </span>
          </div>

          {/* Key / Pitch Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 block font-medium">
              Sur / Tonic Pitch (Sa):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['C', 'C#', 'D', 'D#'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedKey === key
                      ? 'bg-[#C6A66B] text-slate-950 shadow-md shadow-[#C6A66B]/20'
                      : 'bg-[#0B0B0F] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {key} ({keyFrequencies[key]} Hz)
                </button>
              ))}
            </div>
          </div>

          {/* Tuning Style: Pa-Sa vs Ma-Sa */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 block font-medium">
              Tuning Variant (First String):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTuningType('Pa-Sa')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  tuningType === 'Pa-Sa'
                    ? 'bg-[#59263C] text-white border border-[#C6A66B]/40'
                    : 'bg-[#0B0B0F] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Pa - Sa (Pancham Tuning - Most Common)
              </button>
              <button
                onClick={() => setTuningType('Ma-Sa')}
                className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  tuningType === 'Ma-Sa'
                    ? 'bg-[#59263C] text-white border border-[#C6A66B]/40'
                    : 'bg-[#0B0B0F] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                Ma - Sa (Madhyam Tuning - For Ragas like Malkauns)
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>Tanpura Volume:</span>
              </span>
              <span className="font-mono text-zinc-300">{Math.round(droneVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={droneVolume}
              onChange={(e) => setDroneVolume(parseFloat(e.target.value))}
              className="w-full accent-[#C6A66B] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Taal Metronome Section */}
        <div className="rounded-3xl p-6 bg-[#121218] border border-[#C6A66B]/25 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#FFF5EA] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C6A66B]" />
              <span>Hindustani Taal Metronome (ताल)</span>
            </h3>
            <button
              onClick={toggleTaal}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isTaalPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
              }`}
            >
              {isTaalPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isTaalPlaying ? 'Stop' : 'Start'}</span>
            </button>
          </div>

          {/* Taal Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 block font-medium">Taal Chuniye:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Keherwa', 'Dadra', 'Roopak', 'Deepchandi'] as const).map((taal) => (
                <button
                  key={taal}
                  onClick={() => setSelectedTaal(taal)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedTaal === taal
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                      : 'bg-[#0B0B0F] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {taal} ({taalSpecs[taal].beats})
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 italic pt-1">
              {taalSpecs[selectedTaal].description}
            </p>
          </div>

          {/* BPM Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Laya / Tempo:</span>
              <span className="font-mono text-cyan-300 font-bold">{bpm} BPM</span>
            </div>
            <input
              type="range"
              min="40"
              max="160"
              step="2"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full accent-cyan-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Visual Beat Bar */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
              Maatra Beat Counter:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {Array.from({ length: taalSpecs[selectedTaal].beats }).map((_, idx) => {
                const isActive = isTaalPlaying && currentBeat === idx;
                const isSam = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`flex-1 min-w-[28px] h-10 rounded-xl flex flex-col items-center justify-center text-xs font-mono font-bold transition-all ${
                      isActive
                        ? isSam
                          ? 'bg-amber-500 text-slate-950 scale-110 shadow-lg shadow-amber-500/50'
                          : 'bg-cyan-500 text-slate-950 scale-105 shadow-md shadow-cyan-500/40'
                        : isSam
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                        : 'bg-[#0B0B0F] text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    <span className="text-[9px] font-sans">
                      {isSam ? 'Sam' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Riyaz Voice Recorder */}
      <div className="rounded-3xl p-6 bg-[#121218] border border-[#C6A66B]/25 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-sm font-serif font-bold text-[#FFF5EA] flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#C6A66B]" />
              <span>Riyaz Voice Recorder (Apni Aawaz Record Karein)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Tanpura aur Taal ke saath apna sher ya ghazal padhein aur foran playback sunein
            </p>
          </div>

          {/* Record Control */}
          <div className="flex items-center gap-3">
            {isRecording && (
              <span className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-xl border border-rose-800 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>
                  {Math.floor(recordingSeconds / 60)}:
                  {String(recordingSeconds % 60).padStart(2, '0')}
                </span>
              </span>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </button>
          </div>
        </div>

        {/* Playback Box */}
        {recordedAudioUrl ? (
          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#C6A66B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#C6A66B]">Aapki Recorded Recitation:</span>
              <audio src={recordedAudioUrl} controls className="w-full sm:w-80 h-9" />
            </div>

            <div className="flex items-center gap-2">
              <a
                href={recordedAudioUrl}
                download={`sukhan-riyaz-${Date.now()}.webm`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181822] hover:bg-[#20202e] text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Audio</span>
              </a>
              <button
                onClick={() => setRecordedAudioUrl(null)}
                className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                title="Discard Recording"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-xs text-zinc-500">
              Start Recording button dabayein aur Tanpura bajate hue apna kalam record karein.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
