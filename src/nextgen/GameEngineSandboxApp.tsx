import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Play,
  RotateCcw,
  Sliders,
  HelpCircle,
  X,
  Sparkles,
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface GameEngineSandboxProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

interface PhysicsBody {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const GameEngineSandboxApp: React.FC<GameEngineSandboxProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'physics' | 'gameloop' | 'raycasting'>('physics');
  const [showExplainModal, setShowExplainModal] = useState(false);

  // 2D Physics Engine State
  const physicsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bodiesRef = useRef<PhysicsBody[]>([
    { id: 1, x: 100, y: 50, vx: 2, vy: 0, radius: 14, color: '#06b6d4' },
    { id: 2, x: 200, y: 80, vx: -1.5, vy: 0, radius: 18, color: '#f43f5e' },
    { id: 3, x: 300, y: 40, vx: 1, vy: 0, radius: 12, color: '#f59e0b' }
  ]);
  const [gravity, setGravity] = useState(0.25);
  const [restitution, setRestitution] = useState(0.75); // Bounciness (0 to 1)

  // Raycasting (Doom Style) State
  const raycastCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerAngle, setPlayerAngle] = useState(0.4);

  // 2D Physics Engine Loop
  useEffect(() => {
    if (activeTab !== 'physics') return;
    const canvas = physicsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bodies = bodiesRef.current;

      bodies.forEach((b) => {
        // Gravity
        b.vy += gravity;

        // Velocity integrate
        b.x += b.vx;
        b.y += b.vy;

        // Floor collision
        if (b.y + b.radius > canvas.height - 10) {
          b.y = canvas.height - 10 - b.radius;
          b.vy = -b.vy * restitution;
          b.vx *= 0.98; // Friction
        }

        // Ceiling collision
        if (b.y - b.radius < 10) {
          b.y = 10 + b.radius;
          b.vy = -b.vy * restitution;
        }

        // Left / Right Wall collisions
        if (b.x + b.radius > canvas.width - 10) {
          b.x = canvas.width - 10 - b.radius;
          b.vx = -b.vx * restitution;
        }
        if (b.x - b.radius < 10) {
          b.x = 10 + b.radius;
          b.vx = -b.vx * restitution;
        }

        // Draw body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, 2 * Math.PI);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Floor line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, canvas.height - 10);
      ctx.lineTo(canvas.width - 10, canvas.height - 10);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, gravity, restitution]);

  // Spawn new ball on click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = physicsCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ['#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#a855f7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    bodiesRef.current.push({
      id: Date.now(),
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * -2,
      radius: Math.floor(Math.random() * 8) + 12,
      color: randomColor
    });
  };

  // Raycasting Canvas Loop (Doom Pseudo-3D)
  useEffect(() => {
    if (activeTab !== 'raycasting') return;
    const canvas = raycastCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const halfW = canvas.width / 2;
    const height = canvas.height;

    // LEFT HALF: 2D Top-Down View
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, halfW, height);

    // Wall box in 2D
    ctx.fillStyle = '#334155';
    ctx.fillRect(100, 40, 50, 80);

    // Player position
    const px = 40;
    const py = 120;
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Cast FOV rays
    const fov = 1.0; // 60 degrees in radians
    const numRays = 40;
    const startAngle = playerAngle - fov / 2;

    // RIGHT HALF: 3D Projected View
    ctx.fillStyle = '#070b14';
    ctx.fillRect(halfW, 0, halfW, height); // Floor/Ceiling

    for (let i = 0; i < numRays; i++) {
      const rayAngle = startAngle + (i / numRays) * fov;
      // Ray distance mock
      const dist = 70 + Math.abs(Math.sin(rayAngle * 2) * 50);

      // Draw Ray in 2D
      const rx = px + Math.cos(rayAngle) * dist;
      const ry = py + Math.sin(rayAngle) * dist;

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(rx, ry);
      ctx.stroke();

      // Draw 3D column
      const colWidth = halfW / numRays;
      const colHeight = Math.min(height, (800 / dist) * 12);
      const colX = halfW + i * colWidth;
      const colY = (height - colHeight) / 2;

      // Distance fog shading
      const shade = Math.max(20, Math.min(240, 255 - dist * 1.5));
      ctx.fillStyle = `rgb(${Math.round(shade * 0.2)}, ${Math.round(shade * 0.6)}, ${Math.round(shade)})`;
      ctx.fillRect(colX, colY, colWidth + 1, colHeight);
    }

    // Divider line between 2D and 3D
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(halfW, 0);
    ctx.lineTo(halfW, height);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('2D TOP-DOWN MAP', 10, 20);
    ctx.fillText('3D RAYCAST VIEWPORT', halfW + 10, 20);
  }, [activeTab, playerAngle]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🚀 Next-Gen Labs' },
          { label: 'Game Engine & Physics Sandbox' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Gamepad2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Game Engine & 2D Physics Sandbox
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                RAYCASTING 1993
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rigid-body restitution physics sandbox, deterministic game loop cycles, and classic Wolfenstein/Doom 2D-to-3D raycasting.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowExplainModal(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer spring-press transition-all self-start md:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Explain this Lab</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'physics', name: '2D Rigid Body Physics Sandbox', icon: Gamepad2 },
          { id: 'raycasting', name: 'Doom-Style Raycasting (2D to 3D)', icon: Layers },
          { id: 'gameloop', name: 'Fixed Time Step Game Loop', icon: Zap }
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

      {/* TAB 1: 2D PHYSICS SANDBOX */}
      {activeTab === 'physics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                Click anywhere in the box to spawn bouncing balls!
              </span>
              <button
                onClick={() => {
                  bodiesRef.current = [];
                }}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-rose-400 border border-white/5 cursor-pointer"
              >
                Clear Sandbox
              </button>
            </div>

            <canvas
              ref={physicsCanvasRef}
              onClick={handleCanvasClick}
              width={540}
              height={300}
              className="w-full rounded-2xl bg-slate-950 border border-white/10 shadow-inner cursor-crosshair"
            />
          </div>

          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Physics Constants
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Gravity Force (g):</span>
                <span className="text-cyan-400 font-bold">{gravity} px/f²</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.8"
                step="0.05"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Elastic Restitution (Bounciness):</span>
                <span className="text-cyan-400 font-bold">{Math.round(restitution * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={restitution}
                onChange={(e) => setRestitution(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RAYCASTING (DOOM STYLE) */}
      {activeTab === 'raycasting' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Raycasting Engine: 2D Grid to 3D Column Projection</span>
            </h3>
            <p className="text-xs text-slate-400">
              In 1992, Wolfenstein 3D used raycasting to simulate 3D environments on 16MHz Intel 286/386 hardware without 3D graphics cards.
            </p>
          </div>

          <canvas
            ref={raycastCanvasRef}
            width={600}
            height={260}
            className="w-full rounded-2xl bg-slate-950 border border-white/10 shadow-inner"
          />

          <div className="space-y-1.5 max-w-sm">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Player Viewing Angle:</span>
              <span className="text-cyan-400 font-bold">{((playerAngle / Math.PI) * 180).toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI}
              step="0.05"
              value={playerAngle}
              onChange={(e) => setPlayerAngle(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>
      )}

      {/* TAB 3: GAME LOOP VISUALIZER */}
      {activeTab === 'gameloop' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Deterministic Fixed Time Step Game Loop (60 FPS)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Separating physics ticks (fixed 16.6ms) from rendering prevents gameplay speed from fluctuating across slow or fast computers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-white space-y-1">
              <span className="text-xs font-bold block">1. Poll Input</span>
              <span className="text-[10px] text-slate-400 font-mono">Keyboard / Gamepad</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-white space-y-1">
              <span className="text-xs font-bold block">2. Fixed Update</span>
              <span className="text-[10px] text-slate-400 font-mono">Δt = 0.0166s Physics</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-white space-y-1">
              <span className="text-xs font-bold block">3. Interpolation</span>
              <span className="text-[10px] text-slate-400 font-mono">Alpha lerp states</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-white space-y-1">
              <span className="text-xs font-bold block">4. GPU Render</span>
              <span className="text-[10px] text-slate-400 font-mono">VSync buffer flip</span>
            </div>
          </div>
        </div>
      )}

      {/* EXPLAIN MODAL */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Game Engine Architecture Principles</span>
              </h2>
              <button
                onClick={() => setShowExplainModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                • <strong>Raycasting:</strong> Emits a beam for each vertical screen column. When the beam collides with a wall block, the distance dictates the column's height and brightness.
              </p>
              <p>
                • <strong>Fixed vs Variable Time Step:</strong> Running physics on variable delta-time causes numerical instability and "tunneling" (objects clipping through walls).
              </p>
              <p>
                • <strong>Restitution:</strong> Coefficient of Restitution (COR) measures elasticity in collisions: e = v_final / v_initial. A value of 1.0 represents a perfectly elastic collision with no energy loss.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
