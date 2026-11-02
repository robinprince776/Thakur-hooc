import React, { useState, useEffect } from 'react';
import {
  Layers,
  Server,
  Database,
  Globe,
  Zap,
  HelpCircle,
  X,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface SystemDesignCanvasProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

export const SystemDesignCanvasApp: React.FC<SystemDesignCanvasProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [showConceptModal, setShowConceptModal] = useState(false);

  // Architecture Components State
  const [hasLoadBalancer, setHasLoadBalancer] = useState(false);
  const [hasRedisCache, setHasRedisCache] = useState(false);
  const [serverCount, setServerCount] = useState(1);
  const [hasDbReplica, setHasDbReplica] = useState(false);

  // Traffic Simulator State
  const [rps, setRps] = useState(5000); // Requests per second
  const [isSimulating, setIsSimulating] = useState(false);

  // Performance Metrics Calculation
  // 1 server without LB can handle max 10,000 RPS
  const serverCapacity = serverCount * (hasLoadBalancer ? 15000 : 8000);
  const cacheReduction = hasRedisCache ? 0.75 : 0; // 75% traffic absorbed by Redis
  const effectiveLoad = rps * (1 - cacheReduction);

  const isServerOverloaded = effectiveLoad > serverCapacity;
  const latency = hasRedisCache
    ? isServerOverloaded ? 420 : 12
    : isServerOverloaded ? 1850 : 85;

  const errorRate = isServerOverloaded
    ? Math.min(88, ((effectiveLoad - serverCapacity) / effectiveLoad) * 100).toFixed(1)
    : '0.0';

  const cpuLoad = Math.min(100, Math.round((effectiveLoad / serverCapacity) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-3 sm:p-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: '🧪 Elite Labs' },
          { label: 'System Design Canvas' }
        ]}
        onNavigate={(app) => onSelectApp ? onSelectApp(app) : onBackToHub?.()}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                System Design Canvas & Traffic Simulator
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SCALABILITY LAB
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive cloud topology builder with live load generator: test Load Balancers, Redis caching, and database read replicas under high load.
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

      {/* Top Architecture Topology Canvas */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Interactive Distributed Architecture Topology</span>
          </h2>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            Simulating {rps.toLocaleString()} Req/Sec
          </span>
        </div>

        {/* Nodes Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          {/* Node 1: Client Fleet */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">Clients (Mobile / Web)</h4>
            <span className="text-[10px] font-mono text-slate-400 block">{rps.toLocaleString()} req/s generated</span>
          </div>

          {/* Node 2: Load Balancer */}
          <div
            onClick={() => setHasLoadBalancer(!hasLoadBalancer)}
            className={`p-4 rounded-2xl border text-center space-y-2 cursor-pointer transition-all ${
              hasLoadBalancer
                ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/40 border-dashed border-slate-700 text-slate-500 hover:border-slate-500'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto ${
              hasLoadBalancer ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-600'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold">{hasLoadBalancer ? 'Nginx Load Balancer' : '+ Add Load Balancer'}</h4>
            <span className="text-[10px] font-mono block">
              {hasLoadBalancer ? 'Round-robin & SSL term' : 'Single point bottleneck'}
            </span>
          </div>

          {/* Node 3: Backend App Servers */}
          <div className={`p-4 rounded-2xl border text-center space-y-2 ${
            isServerOverloaded
              ? 'bg-rose-950/50 border-rose-500 text-white animate-pulse'
              : 'bg-emerald-950/40 border-emerald-500/40 text-white'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto ${
              isServerOverloaded ? 'bg-rose-500/30 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold">
              {serverCount}x Node.js App Cluster
            </h4>
            <span className="text-[10px] font-mono block">
              {isServerOverloaded ? '💥 504 Gateway Timeout' : `CPU Load: ${cpuLoad}%`}
            </span>
          </div>

          {/* Node 4: Cache & Database */}
          <div className="space-y-2">
            {/* Redis */}
            <div
              onClick={() => setHasRedisCache(!hasRedisCache)}
              className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                hasRedisCache
                  ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                  : 'bg-slate-900/40 border-dashed border-slate-700 text-slate-500'
              }`}
            >
              <h5 className="text-[11px] font-bold">{hasRedisCache ? '⚡ Redis Cache (75% hits)' : '+ Add Redis Cache'}</h5>
            </div>

            {/* Postgres */}
            <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-center space-y-1">
              <Database className="w-4 h-4 text-cyan-400 mx-auto" />
              <h5 className="text-xs font-bold text-white">PostgreSQL Primary</h5>
              <span className="text-[9px] font-mono text-slate-400">ACID Transactions</span>
            </div>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">Cluster Capacity</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {serverCapacity.toLocaleString()} RPS
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">Average Latency (p99)</span>
            <span className={`text-lg font-mono font-bold ${latency > 200 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {latency} ms
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">HTTP 5xx Error Rate</span>
            <span className={`text-lg font-mono font-bold ${parseFloat(errorRate) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {errorRate}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono block">CPU Core Saturation</span>
            <span className={`text-lg font-mono font-bold ${cpuLoad > 85 ? 'text-rose-400' : 'text-amber-400'}`}>
              {cpuLoad}%
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Controls */}
      <div className="p-6 rounded-3xl os-glass-card border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Traffic Stress Load Generator
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Incoming Traffic Volume:</span>
            <span className="text-cyan-400 font-bold">{rps.toLocaleString()} RPS</span>
          </div>
          <input
            type="range"
            min="1000"
            max="60000"
            step="1000"
            value={rps}
            onChange={(e) => setRps(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-500"
          />
        </div>

        {/* Server scaling slider */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">App Server Instances:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 4, 8].map((count) => (
                <button
                  key={count}
                  onClick={() => setServerCount(count)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                    serverCount === count
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {count}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LEARN CONCEPT MODAL */}
      {showConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="p-6 rounded-3xl os-glass-card border-white/15 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>System Design & High Availability</span>
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
                • <strong>Horizontal Scaling vs Vertical Scaling:</strong> Adding more server nodes (horizontal) is more resilient and cost-effective than buying a giant single server (vertical).
              </p>
              <p>
                • <strong>Caching (Redis / Memcached):</strong> An in-memory cache stores hot read requests, reducing slow disk I/O and SQL database lock contention by 80%+.
              </p>
              <p>
                • <strong>CAP Theorem:</strong> A distributed data store can only guarantee at most two out of Consistency, Availability, and Partition Tolerance simultaneously.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
