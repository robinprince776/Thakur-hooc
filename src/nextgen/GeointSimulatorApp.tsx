import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Radio,
  MapPin,
  HelpCircle,
  X,
  Sparkles,
  Layers,
  Upload,
  Globe,
  Navigation,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface GeointSimulatorProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

export const GeointSimulatorApp: React.FC<GeointSimulatorProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'triangulation' | 'metadata' | 'elevation'>('triangulation');
  const [showExplainModal, setShowExplainModal] = useState(false);

  // Satellites Trilateration State
  const [satDist1, setSatDist1] = useState(130);
  const [satDist2, setSatDist2] = useState(120);
  const [satDist3, setSatDist3] = useState(140);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Terrain Elevation Canvas
  const elevationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedElevationPoint, setSelectedElevationPoint] = useState<number>(680); // meters

  // Trilateration Radar Canvas Loop
  useEffect(() => {
    if (activeTab !== 'triangulation') return;
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Radar Concentric Circles
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      [40, 80, 120, 160].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
      });

      // Rotating Radar Sweep Line
      angle += 0.02;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 170 * Math.cos(angle), cy + 170 * Math.sin(angle));
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Satellite Positions
      const sat1 = { x: cx - 110, y: cy - 90, name: 'NAVSTAR SV-01' };
      const sat2 = { x: cx + 120, y: cy - 70, name: 'GALILEO GS-04' };
      const sat3 = { x: cx, y: cy + 120, name: 'GLONASS GL-09' };

      // Draw Distance Circles
      ctx.lineWidth = 1.5;

      ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
      ctx.beginPath();
      ctx.arc(sat1.x, sat1.y, satDist1, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.beginPath();
      ctx.arc(sat2.x, sat2.y, satDist2, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.beginPath();
      ctx.arc(sat3.x, sat3.y, satDist3, 0, 2 * Math.PI);
      ctx.stroke();

      // Satellite Icons
      [sat1, sat2, sat3].forEach((s) => {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(s.name, s.x - 30, s.y - 10);
      });

      // Target Ground Fix (Intersection Point)
      const targetFix = { x: cx + 5, y: cy + 15 };
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(targetFix.x, targetFix.y, 7, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('TARGET LOCK (Fix)', targetFix.x + 12, targetFix.y + 4);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, satDist1, satDist2, satDist3]);

  // Terrain 3D Elevation Wireframe Canvas
  useEffect(() => {
    if (activeTab !== 'elevation') return;
    const canvas = elevationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Wireframe Iso Grid
    const rows = 14;
    const cols = 22;
    const cellW = canvas.width / (cols + 4);
    const cellH = canvas.height / (rows + 6);

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 1;

    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        // Pseudo-random elevation wave height
        const z = Math.sin(r * 0.4) * Math.cos(c * 0.3) * 35;
        const x = 40 + c * cellW + r * 6;
        const y = 60 + r * cellH - z;

        if (c === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🚀 Next-Gen Labs' },
          { label: 'Satellite & Geospatial Intel (GEOINT)' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Satellite & Geospatial Intel (GEOINT)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                GPS TRILATERATION
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              3-Satellite orbital trilateration geometry, EXIF tactical coordinate mapping, and 3D terrain wireframe elevation models.
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
          { id: 'triangulation', name: '3-Satellite GPS Trilateration', icon: Radio },
          { id: 'metadata', name: 'Tactical EXIF Geolocation Map', icon: MapPin },
          { id: 'elevation', name: 'Terrain Elevation Wireframe', icon: Layers }
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

      {/* TAB 1: SATELLITE TRILATERATION */}
      {activeTab === 'triangulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 p-6 rounded-3xl os-glass-card border-white/10 flex flex-col items-center justify-center space-y-4">
            <canvas
              ref={radarCanvasRef}
              width={460}
              height={340}
              className="w-full max-w-full rounded-2xl bg-slate-950 border border-white/10 shadow-inner"
            />
            <span className="text-[11px] font-mono text-slate-400">
              Trilateration intersection defines ground latitude and longitude within &lt; 3.2m accuracy.
            </span>
          </div>

          <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Satellite Pseudorange Radius
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-400">NAVSTAR SV-01 (USA):</span>
                <span>{satDist1} km</span>
              </div>
              <input
                type="range"
                min="80"
                max="180"
                value={satDist1}
                onChange={(e) => setSatDist1(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400">GALILEO GS-04 (ESA):</span>
                <span>{satDist2} km</span>
              </div>
              <input
                type="range"
                min="80"
                max="180"
                value={satDist2}
                onChange={(e) => setSatDist2(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-amber-400">GLONASS GL-09:</span>
                <span>{satDist3} km</span>
              </div>
              <input
                type="range"
                min="80"
                max="180"
                value={satDist3}
                onChange={(e) => setSatDist3(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/5 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold block">
                Receiver Clock Bias
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                4th satellite signal is mathematically required in real-world GNSS to correct nanosecond clock drift between atomic space clocks and cheap quartz receiver clocks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: METADATA GEOLOCATION */}
      {activeTab === 'metadata' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Tactical Geolocation OSINT Visualizer</span>
            </h3>
            <p className="text-xs text-slate-400">
              Photographs taken with smartphones automatically record GPS coordinates inside EXIF tags unless explicitly stripped.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Sample Target Fix
              </span>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs space-y-2">
                <div>Country: <span className="text-white font-bold">India (IN)</span></div>
                <div>Coordinates: <span className="text-cyan-400 font-bold">28.6139° N, 77.2090° E</span></div>
                <div>City / Landmark: <span className="text-amber-300">Central Delhi, India Gate</span></div>
                <div>Altitude: <span className="text-emerald-400">216m MSL</span></div>
                <div>Time Offset: <span className="text-slate-400">UTC+05:30 (IST)</span></div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-3">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
                Military & Recon Applications
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reconnaissance teams analyze metadata to establish hostile operating bases. Social media posts from forward operating locations have compromised operations when soldiers forgot to disable device location tags.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TERRAIN ELEVATION WIREFRAME */}
      {activeTab === 'elevation' && (
        <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Synthetic Aperture Radar (SAR) 3D Terrain Wireframe</span>
              </h3>
              <p className="text-xs text-slate-400">
                Satellite radar pulses measure surface height differences down to millimeters.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              Elevation Fix: {selectedElevationPoint}m AGL
            </span>
          </div>

          <canvas
            ref={elevationCanvasRef}
            width={520}
            height={220}
            className="w-full rounded-2xl bg-slate-950 border border-white/10 shadow-inner"
          />
        </div>
      )}

      {/* EXPLAIN MODAL */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Geospatial Intelligence (GEOINT) Principles</span>
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
                • <strong>Trilateration vs Triangulation:</strong> Triangulation measures angles; Trilateration measures distances from known satellite orbital points using signal time-of-flight (c × Δt).
              </p>
              <p>
                • <strong>SAR (Synthetic Aperture Radar):</strong> Uses the motion of the satellite antenna over a target region to create fine spatial-resolution 3D images day or night.
              </p>
              <p>
                • <strong>Relativistic Clock Shifts:</strong> GPS satellites move at 14,000 km/h, meaning Einstein's Special and General Relativity must be accounted for to prevent a 10 km daily positioning error!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
