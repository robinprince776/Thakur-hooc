import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  HelpCircle,
  X,
  Play,
  RotateCcw,
  Zap,
  Activity,
  ArrowRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface QuantumVisualizerProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

export const QuantumVisualizerApp: React.FC<QuantumVisualizerProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'qubit' | 'bloch' | 'race'>('bloch');
  const [showConceptModal, setShowConceptModal] = useState(false);

  // Bloch Sphere State: theta (0 to PI) and phi (0 to 2PI)
  const [theta, setTheta] = useState<number>(Math.PI / 2); // 90 deg = superposition
  const [phi, setPhi] = useState<number>(0); // 0 deg
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Quantum vs Classical Race State
  const [isRacing, setIsRacing] = useState(false);
  const [classicalProgress, setClassicalProgress] = useState(0);
  const [quantumProgress, setQuantumProgress] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  // Gates application
  const applyGate = (gate: 'X' | 'Z' | 'H' | 'RESET0' | 'RESET1') => {
    if (gate === 'RESET0') {
      setTheta(0);
      setPhi(0);
    } else if (gate === 'RESET1') {
      setTheta(Math.PI);
      setPhi(0);
    } else if (gate === 'X') {
      // Pauli-X (Bit Flip): |0> -> |1>, |1> -> |0>
      setTheta((prev) => Math.PI - prev);
    } else if (gate === 'Z') {
      // Pauli-Z (Phase Flip): adds PI to phi
      setPhi((prev) => (prev + Math.PI) % (2 * Math.PI));
    } else if (gate === 'H') {
      // Hadamard Gate: puts into equal superposition
      if (Math.abs(theta) < 0.1) {
        setTheta(Math.PI / 2);
      } else if (Math.abs(theta - Math.PI) < 0.1) {
        setTheta(Math.PI / 2);
        setPhi(Math.PI);
      } else {
        setTheta(0);
      }
    }
  };

  // Bloch Sphere 3D projection on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 100;

      // Draw Sphere Wireframe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;

      // Outer circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Equator ellipse
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.35, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.stroke();

      // Z-axis (Vertical: |0> at top, |1> at bottom)
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius - 15);
      ctx.lineTo(cx, cy + radius + 15);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('|0⟩ (Z+)', cx + 8, cy - radius - 5);
      ctx.fillText('|1⟩ (Z-)', cx + 8, cy + radius + 15);

      // X-axis & Y-axis guides
      ctx.beginPath();
      ctx.moveTo(cx - radius - 10, cy);
      ctx.lineTo(cx + radius + 10, cy);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
      ctx.fillText('|i+⟩ (Y)', cx + radius + 5, cy - 5);

      // Compute vector tip in 3D:
      // x = r * sin(theta) * cos(phi)
      // y = r * sin(theta) * sin(phi)
      // z = r * cos(theta)
      const x3d = Math.sin(theta) * Math.cos(phi);
      const y3d = Math.sin(theta) * Math.sin(phi);
      const z3d = Math.cos(theta);

      // Project onto 2D isometric view
      const px = cx + radius * (x3d * 0.85 - y3d * 0.4);
      const py = cy - radius * z3d + radius * (y3d * 0.25);

      // State Vector Line (Neon Cyan Glow)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // State Vector Tip
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label at tip
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('|ψ⟩', px + 10, py - 6);
    };

    render();
  }, [theta, phi]);

  // Quantum vs Classical Race Animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRacing) {
      timer = setInterval(() => {
        // Classical increments sequentially: O(N)
        setClassicalProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 2;
        });

        // Quantum Grover Search increments quadratic speedup: O(sqrt(N))
        setQuantumProgress((prev) => {
          if (prev >= 100) {
            if (!winner) setWinner('Quantum Grover Search (32x Faster!)');
            return 100;
          }
          return prev + 9;
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [isRacing, winner]);

  // Probabilities calculation
  const prob0 = Math.pow(Math.cos(theta / 2), 2) * 100;
  const prob1 = Math.pow(Math.sin(theta / 2), 2) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🧪 Elite Labs' },
          { label: 'Quantum Visualizer' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Quantum Computing Visualizer
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                BLOCH SPHERE 3D
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive Qubit state space, Quantum Logic Gates (Pauli-X, Hadamard), and Grover's algorithm speedup race.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConceptModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer spring-press transition-all self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Learn Concept</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'bloch', name: 'Bloch Sphere & Quantum Gates', icon: Sparkles },
          { id: 'qubit', name: 'Qubit Superposition Basics', icon: Activity },
          { id: 'race', name: 'Quantum vs Classical Race', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 border border-cyan-400/40'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BLOCH SPHERE */}
      {activeTab === 'bloch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
              State Vector |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
            </span>

            <canvas
              ref={canvasRef}
              width={340}
              height={300}
              className="max-w-full drop-shadow-2xl"
            />

            {/* Measurement Probabilities Display */}
            <div className="w-full max-w-md grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">P(|0⟩) Probability</span>
                <span className="text-xl font-mono font-bold text-cyan-400">{prob0.toFixed(1)}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">P(|1⟩) Probability</span>
                <span className="text-xl font-mono font-bold text-rose-400">{prob1.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Controls & Gate Buttons */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Apply Quantum Gates</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyGate('H')}
                  className="p-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-bold cursor-pointer transition-all"
                >
                  <span className="text-white block font-mono text-sm">Hadamard (H)</span>
                  <span className="text-[10px] text-slate-400">Puts into 50/50 superposition</span>
                </button>

                <button
                  onClick={() => applyGate('X')}
                  className="p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold cursor-pointer transition-all"
                >
                  <span className="text-white block font-mono text-sm">Pauli-X (NOT)</span>
                  <span className="text-[10px] text-slate-400">Flips |0⟩ ⇄ |1⟩</span>
                </button>

                <button
                  onClick={() => applyGate('Z')}
                  className="p-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-200 text-xs font-bold cursor-pointer transition-all"
                >
                  <span className="text-white block font-mono text-sm">Pauli-Z (Phase)</span>
                  <span className="text-[10px] text-slate-400">Flips relative phase π</span>
                </button>

                <button
                  onClick={() => applyGate('RESET0')}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-bold cursor-pointer transition-all"
                >
                  <span className="text-white block font-mono text-sm">Reset |0⟩</span>
                  <span className="text-[10px] text-slate-400">Pure ground state</span>
                </button>
              </div>

              {/* Angles Fine Slider */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Polar Angle θ:</span>
                    <span className="text-cyan-400">{((theta / Math.PI) * 180).toFixed(0)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.PI}
                    step="0.05"
                    value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Azimuth Angle φ:</span>
                    <span className="text-cyan-400">{((phi / Math.PI) * 180).toFixed(0)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.05"
                    value={phi}
                    onChange={(e) => setPhi(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUBIT SUPERPOSITION BASICS */}
      {activeTab === 'qubit' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Classical Bit vs Quantum Qubit
            </h3>
            <p className="text-xs text-slate-400">
              A classical computer bit is either 0 OR 1 (like a coin lying on a table). A qubit in superposition is both 0 AND 1 simultaneously (like a spinning coin).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 text-center space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block font-bold">
                Classical Bit (Deterministic)
              </span>
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-600 mx-auto flex items-center justify-center font-mono text-2xl font-black text-white">
                0
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Strict binary switch. Stores exactly 1 bit of information at any instant.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-center space-y-3">
              <span className="text-xs font-mono uppercase text-cyan-400 block font-bold">
                Quantum Qubit (|ψ⟩ = α|0⟩ + β|1⟩)
              </span>
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-rose-500 mx-auto flex items-center justify-center font-mono text-base font-black text-white animate-spin shadow-lg shadow-cyan-500/25">
                |0⟩+|1⟩
              </div>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Continuous complex sphere. Upon measurement, the wave function collapses to |0⟩ or |1⟩ with probability |α|² or |β|².
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUANTUM VS CLASSICAL RACE */}
      {activeTab === 'race' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Grover's Search Algorithm Race: Unsorted Database of N = 1024</span>
            </h3>
            <p className="text-xs text-slate-400">
              Classical computer checks items sequentially (O(N) = 1024 operations). Quantum computer applies amplitude amplification (Grover's algorithm, O(√N) ≈ 32 operations).
            </p>
          </div>

          <div className="space-y-4">
            {/* Classical Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">Classical Supercomputer (O(N) Linear Search)</span>
                <span className="text-slate-400">{classicalProgress}% checked</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-100"
                  style={{ width: `${classicalProgress}%` }}
                />
              </div>
            </div>

            {/* Quantum Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold">Quantum Processor (O(√N) Grover Search)</span>
                <span className="text-cyan-400 font-bold">{quantumProgress}% solved</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-100 shadow-md shadow-cyan-500/50"
                  style={{ width: `${quantumProgress}%` }}
                />
              </div>
            </div>

            {winner && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Winner: {winner}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setClassicalProgress(0);
                  setQuantumProgress(0);
                  setWinner(null);
                  setIsRacing(true);
                }}
                disabled={isRacing}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Search Race</span>
              </button>

              <button
                onClick={() => {
                  setIsRacing(false);
                  setClassicalProgress(0);
                  setQuantumProgress(0);
                  setWinner(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEARN CONCEPT MODAL */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Quantum Computing Principles</span>
              </h2>
              <button
                onClick={() => setShowConceptModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>Superposition:</strong> A quantum system can be in multiple states simultaneously until measured.
              </p>
              <p>
                • <strong>Bloch Sphere:</strong> Geometrical representation of a 2-level quantum state. The North Pole is |0⟩, the South Pole is |1⟩, and the equator represents equal superpositions.
              </p>
              <p>
                • <strong>Quantum Supremacy:</strong> Solving complex mathematical problems (like prime factorization via Shor's algorithm) in seconds that would take classical supercomputers thousands of years.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
