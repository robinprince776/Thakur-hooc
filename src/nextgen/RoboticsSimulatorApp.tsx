import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  HelpCircle,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface RoboticsSimulatorProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

export const RoboticsSimulatorApp: React.FC<RoboticsSimulatorProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'drone' | 'pid' | 'astar'>('drone');
  const [showExplainModal, setShowExplainModal] = useState(false);

  // Drone Canvas Physics State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const droneState = useRef({
    x: 200,
    y: 150,
    vx: 0,
    vy: 0,
    angle: 0,
    vAngle: 0,
    thrust: 0.15
  });

  // PID Controller State
  const [kp, setKp] = useState(1.2);
  const [ki, setKi] = useState(0.05);
  const [kd, setKd] = useState(0.8);
  const [targetAltitude, setTargetAltitude] = useState(100);
  const [currentAltitude, setCurrentAltitude] = useState(20);

  // A* Pathfinding Maze State
  const [mazeStep, setMazeStep] = useState(0);
  const [isSolvingAStar, setIsSolvingAStar] = useState(false);

  // Drone 2D Flight Physics Loop
  useEffect(() => {
    if (activeTab !== 'drone') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const d = droneState.current;
      // Gravity
      d.vy += 0.08;

      // Air resistance damping
      d.vx *= 0.98;
      d.vy *= 0.98;
      d.vAngle *= 0.95;

      // Update positions
      d.x += d.vx;
      d.y += d.vy;
      d.angle += d.vAngle;

      // Boundaries
      if (d.y > canvas.height - 25) {
        d.y = canvas.height - 25;
        d.vy = 0;
      }
      if (d.y < 25) {
        d.y = 25;
        d.vy = 0;
      }
      if (d.x < 30) {
        d.x = 30;
        d.vx = 0;
      }
      if (d.x > canvas.width - 30) {
        d.x = canvas.width - 30;
        d.vx = 0;
      }

      // Draw background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Drone (Quadcopter)
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.angle);

      // Central Body
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.roundRect(-16, -8, 32, 16, 6);
      ctx.fill();

      // Arms
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-32, 0);
      ctx.lineTo(32, 0);
      ctx.stroke();

      // Rotors
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(-32, -4, 14, 3, 0, 0, 2 * Math.PI);
      ctx.ellipse(32, -4, 14, 3, 0, 0, 2 * Math.PI);
      ctx.fill();

      // Thrust flame trail if moving upward
      if (d.vy < -0.2) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-32, 4);
        ctx.lineTo(-32, 16);
        ctx.moveTo(32, 4);
        ctx.lineTo(32, 16);
        ctx.stroke();
      }

      ctx.restore();

      // HUD Telemetry overlay
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(`ALT: ${(canvas.height - d.y).toFixed(1)}m`, 15, 25);
      ctx.fillText(`VEL_Y: ${(-d.vy).toFixed(2)} m/s`, 15, 42);
      ctx.fillText(`PITCH: ${(d.angle * 57.3).toFixed(1)}°`, 15, 59);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeTab]);

  // Keyboard navigation for drone
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeTab !== 'drone') return;
      const d = droneState.current;
      if (e.key === 'ArrowUp' || e.key === 'w') {
        d.vy -= 0.35;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        d.vy += 0.2;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        d.vx -= 0.25;
        d.vAngle -= 0.04;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        d.vx += 0.25;
        d.vAngle += 0.04;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeTab]);

  // Touch controls for mobile
  const applyThrust = () => {
    droneState.current.vy -= 0.6;
  };
  const tiltLeft = () => {
    droneState.current.vx -= 0.4;
    droneState.current.vAngle -= 0.05;
  };
  const tiltRight = () => {
    droneState.current.vx += 0.4;
    droneState.current.vAngle += 0.05;
  };

  // PID Loop Simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'pid') {
      let integral = 0;
      let lastError = 0;

      timer = setInterval(() => {
        setCurrentAltitude((prev) => {
          const error = targetAltitude - prev;
          integral += error * 0.1;
          const derivative = (error - lastError) / 0.1;
          lastError = error;

          const output = kp * error + ki * integral + kd * derivative;
          const next = prev + output * 0.03;
          return Math.max(0, Math.min(180, next));
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [activeTab, kp, ki, kd, targetAltitude]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🚀 Next-Gen Labs' },
          { label: 'Drone & Robotics Simulator' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Drone & Autonomous Robotics Lab
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AERODYNAMICS & A*
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              2D Quadcopter aerodynamics physics, PID closed-loop stability controller, and A* pathfinding maze solver.
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
          { id: 'drone', name: '2D Quadcopter Flight Physics', icon: Zap },
          { id: 'pid', name: 'PID Closed-Loop Controller', icon: Sliders },
          { id: 'astar', name: 'A* Pathfinding Maze Solver', icon: Navigation }
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

      {/* TAB 1: DRONE FLIGHT PHYSICS */}
      {activeTab === 'drone' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 flex flex-col items-center justify-center space-y-4">
            <canvas
              ref={canvasRef}
              width={540}
              height={320}
              className="w-full max-w-full rounded-2xl bg-slate-950 border border-white/10 shadow-inner"
            />

            {/* Mobile Touch Flight Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={tiltLeft}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white cursor-pointer spring-press"
                title="Tilt Left"
              >
                <ArrowLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <button
                onClick={applyThrust}
                className="px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white cursor-pointer spring-press shadow-lg shadow-cyan-600/30 flex items-center gap-1.5"
                title="Rotor Thrust"
              >
                <ArrowUp className="w-5 h-5" />
                <span>Thrust (Up)</span>
              </button>
              <button
                onClick={tiltRight}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white cursor-pointer spring-press"
                title="Tilt Right"
              >
                <ArrowRight className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Keyboard: Arrow Keys (Up = Thrust, Left/Right = Pitch & Yaw)
            </span>
          </div>

          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Aerodynamics Engine Specs
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs font-mono text-slate-300">
              <div>Gravity: <span className="text-cyan-400">9.81 m/s² (0.08 px/f)</span></div>
              <div>Rotor Differential: <span className="text-emerald-400">Active Quad Torque</span></div>
              <div>Drag Coefficient (Cd): <span className="text-amber-400">0.02 Aerodynamic damping</span></div>
            </div>

            <button
              onClick={() => {
                droneState.current = {
                  x: 200,
                  y: 150,
                  vx: 0,
                  vy: 0,
                  angle: 0,
                  vAngle: 0,
                  thrust: 0.15
                };
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>Reset Position</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PID CONTROLLER */}
      {activeTab === 'pid' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Altitude Stabilization Loop</span>
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Target: {targetAltitude}m | Current: {currentAltitude.toFixed(1)}m
              </span>
            </div>

            {/* Height Visualizer */}
            <div className="relative h-48 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex items-end p-4">
              {/* Target Line */}
              <div
                className="absolute w-full border-t-2 border-dashed border-amber-400"
                style={{ bottom: `${(targetAltitude / 180) * 100}%` }}
              >
                <span className="text-[10px] font-mono text-amber-400 absolute right-3 -top-4 font-bold">
                  Target Setpoint
                </span>
              </div>

              {/* Drone visual */}
              <div
                className="w-16 h-8 rounded-xl bg-cyan-500 shadow-xl shadow-cyan-500/50 flex items-center justify-center text-slate-950 font-bold text-xs transition-all duration-75 mx-auto"
                style={{ marginBottom: `${(currentAltitude / 180) * 120}px` }}
              >
                🛸 Drone
              </div>
            </div>

            <div className="flex gap-2">
              {[50, 100, 150].map((setpoint) => (
                <button
                  key={setpoint}
                  onClick={() => setTargetAltitude(setpoint)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all ${
                    targetAltitude === setpoint
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Set Altitude {setpoint}m
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              PID Gain Parameters
            </span>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Proportional (Kp):</span>
                <span className="text-cyan-400 font-bold">{kp}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={kp}
                onChange={(e) => setKp(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Integral (Ki):</span>
                <span className="text-cyan-400 font-bold">{ki}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.2"
                step="0.01"
                value={ki}
                onChange={(e) => setKi(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Derivative (Kd):</span>
                <span className="text-cyan-400 font-bold">{kd}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={kd}
                onChange={(e) => setKd(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: A* PATHFINDING MAZE */}
      {activeTab === 'astar' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>A* Pathfinding Algorithm Simulation</span>
            </h3>
            <p className="text-xs text-slate-400">
              Heuristic search function: f(n) = g(n) + h(n), where g(n) is the distance from start, and h(n) is Manhattan distance to target.
            </p>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-w-md mx-auto p-4 rounded-2xl bg-slate-900/80 border border-white/5">
            {Array.from({ length: 48 }).map((_, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === 47;
              const isObstacle = [10, 11, 12, 19, 27, 28, 29, 36].includes(idx);
              const isPath = mazeStep > 0 && [0, 1, 2, 3, 4, 5, 13, 21, 22, 23, 31, 39, 47].includes(idx);

              return (
                <div
                  key={idx}
                  className={`h-10 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                    isStart
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-white'
                      : isEnd
                      ? 'bg-rose-500 text-white ring-2 ring-white'
                      : isObstacle
                      ? 'bg-slate-800 border border-slate-700 text-slate-600'
                      : isPath
                      ? 'bg-cyan-500 text-slate-950 animate-pulse'
                      : 'bg-slate-950/80 border border-white/5 text-slate-600'
                  }`}
                >
                  {isStart ? 'START' : isEnd ? 'GOAL' : isObstacle ? 'WALL' : isPath ? '●' : ''}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setMazeStep(1);
              }}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Solve Shortest Path (A*)</span>
            </button>
            <button
              onClick={() => setMazeStep(0)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
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
                <span>Robotics & Autonomous Flight Principles</span>
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
                • <strong>PID Loop:</strong> The Proportional term corrects for present error, Integral eliminates steady-state drift, and Derivative predicts future overshoot.
              </p>
              <p>
                • <strong>A* Pathfinding:</strong> Unlike Dijkstra's algorithm which explores all directions equally, A* uses an admissible heuristic to search aggressively toward the target goal.
              </p>
              <p>
                • <strong>Aerodynamic Drag:</strong> At high velocities, quadratic air resistance limits maximum forward speed to terminal velocity.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
