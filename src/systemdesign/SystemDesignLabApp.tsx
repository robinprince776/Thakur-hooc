import React, { useState, useMemo } from 'react';
import {
  Layers,
  Server,
  Database,
  ArrowRight,
  Shield,
  Activity,
  Zap,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Cpu,
  Globe,
  Radio,
  Share2
} from 'lucide-react';

export interface SystemDesignLabAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const SystemDesignLabApp: React.FC<SystemDesignLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'cap' | 'estimation' | 'patterns'>('architecture');

  // Architecture Simulation State
  const [trafficRps, setTrafficRps] = useState(50000); // 50k requests per second
  const [hasCdn, setHasCdn] = useState(true);
  const [hasCache, setHasCache] = useState(true);
  const [appInstances, setAppInstances] = useState(4);
  const [dbReplication, setDbReplication] = useState<'single' | 'master-slave' | 'sharded'>('master-slave');

  // Simulation Metrics
  const metrics = useMemo(() => {
    // CDN absorbs ~60% static and read-heavy traffic
    const effectiveRps = hasCdn ? trafficRps * 0.4 : trafficRps;
    // Cache absorbs ~75% of remaining read traffic
    const dbRps = hasCache ? effectiveRps * 0.25 : effectiveRps;

    // Latency estimates in milliseconds
    let avgLatency = 30; // base network
    if (!hasCdn) avgLatency += 80;
    if (!hasCache) avgLatency += 120;
    avgLatency += Math.max(0, Math.floor((effectiveRps / (appInstances * 15000)) * 25));

    // Server load per instance
    const loadPerInstance = Math.round(effectiveRps / appInstances);
    const serverStatus = loadPerInstance > 20000 ? 'Overloaded' : loadPerInstance > 12000 ? 'Heavy' : 'Optimal';

    // DB Status
    let dbStatus = 'Healthy';
    if (dbReplication === 'single' && dbRps > 10000) dbStatus = 'Bottleneck';
    if (dbReplication === 'master-slave' && dbRps > 35000) dbStatus = 'Heavy Write Lag';
    if (dbReplication === 'sharded') dbStatus = 'Distributed Scalable';

    return {
      effectiveRps: Math.round(effectiveRps),
      dbRps: Math.round(dbRps),
      avgLatency: Math.min(650, Math.round(avgLatency)),
      serverStatus,
      loadPerInstance,
      dbStatus
    };
  }, [trafficRps, hasCdn, hasCache, appInstances, dbReplication]);

  // CAP Theorem State
  const [capSelection, setCapSelection] = useState<'CP' | 'AP' | 'CA'>('CP');

  // Back-of-envelope estimation
  const [dau, setDau] = useState(10); // 10 million Daily Active Users
  const [actionsPerUser, setActionsPerUser] = useState(25);
  const [payloadKb, setPayloadKb] = useState(2); // 2 KB per action

  const estimation = useMemo(() => {
    const totalDailyRequests = dau * 1000000 * actionsPerUser;
    const avgQps = Math.round(totalDailyRequests / 86400);
    const peakQps = avgQps * 2;
    const dailyStorageGb = Math.round((totalDailyRequests * payloadKb) / (1024 * 1024));
    const yearlyStorageTb = ((dailyStorageGb * 365) / 1024).toFixed(1);
    const bandwidthMbps = Math.round((peakQps * payloadKb * 8) / 1024);

    return { totalDailyRequests, avgQps, peakQps, dailyStorageGb, yearlyStorageTb, bandwidthMbps };
  }, [dau, actionsPerUser, payloadKb]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">SystemDesign Lab</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  #systemdesign · App #36
                </span>
              </div>
              <p className="text-xs text-slate-400">
                High-scale architecture simulator, CAP theorem, back-of-envelope math & caching patterns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all border border-slate-700"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-all shadow"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto pb-1">
          {[
            { id: 'architecture', label: 'Interactive Architecture Sim', icon: Layers },
            { id: 'cap', label: 'CAP Theorem Matrix', icon: Shield },
            { id: 'estimation', label: 'Back-of-Envelope Calculator', icon: Sliders },
            { id: 'patterns', label: 'System Design Patterns', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
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
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Incoming Traffic: {trafficRps.toLocaleString()} RPS
                </label>
                <input
                  type="range"
                  min={5000}
                  max={200000}
                  step={5000}
                  value={trafficRps}
                  onChange={(e) => setTrafficRps(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5K RPS</span>
                  <span>100K RPS</span>
                  <span>200K RPS</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Edge & Cache Layer</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setHasCdn(!hasCdn)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      hasCdn ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    CDN {hasCdn ? '✓ ON' : '✗ OFF'}
                  </button>
                  <button
                    onClick={() => setHasCache(!hasCache)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      hasCache ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Redis {hasCache ? '✓ ON' : '✗ OFF'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  App Instances (Nodes): {appInstances}
                </label>
                <div className="flex gap-1">
                  {[2, 4, 8, 16].map((num) => (
                    <button
                      key={num}
                      onClick={() => setAppInstances(num)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        appInstances === num
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Database Topology</label>
                <select
                  value={dbReplication}
                  onChange={(e) => setDbReplication(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="single">Single Primary (No Replica)</option>
                  <option value="master-slave">Primary + Read Replicas</option>
                  <option value="sharded">Sharded Multi-Master Cluster</option>
                </select>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Live Tier Dataflow Simulation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
                {/* Clients */}
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="text-xs font-mono text-cyan-400 font-bold">1. Clients</div>
                  <div className="text-lg font-bold text-white">{trafficRps.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400">Total Ingress RPS</div>
                </div>

                {/* CDN / LB */}
                <div className={`p-4 rounded-xl border space-y-2 ${hasCdn ? 'bg-cyan-950/30 border-cyan-800/60' : 'bg-slate-800/50 border-slate-700/50 opacity-60'}`}>
                  <div className="text-xs font-mono text-cyan-400 font-bold">2. CDN & Cloudflare</div>
                  <div className="text-lg font-bold text-white">{hasCdn ? 'Absorbs 60%' : 'Bypassed'}</div>
                  <div className="text-[11px] text-slate-400">Edge static cache</div>
                </div>

                {/* Load Balancer & App Tier */}
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/60 space-y-2">
                  <div className="text-xs font-mono text-blue-400 font-bold">3. App Tier ({appInstances}x)</div>
                  <div className="text-lg font-bold text-white">{metrics.effectiveRps.toLocaleString()} RPS</div>
                  <div className="text-[11px] text-slate-400">{metrics.loadPerInstance} RPS/node ({metrics.serverStatus})</div>
                </div>

                {/* Redis Cache */}
                <div className={`p-4 rounded-xl border space-y-2 ${hasCache ? 'bg-emerald-950/30 border-emerald-800/60' : 'bg-slate-800/50 border-slate-700/50 opacity-60'}`}>
                  <div className="text-xs font-mono text-emerald-400 font-bold">4. Redis Cache</div>
                  <div className="text-lg font-bold text-white">{hasCache ? '75% Hit Ratio' : 'No Cache'}</div>
                  <div className="text-[11px] text-slate-400">In-memory sub-ms reads</div>
                </div>

                {/* Database Tier */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-2">
                  <div className="text-xs font-mono text-purple-400 font-bold">5. Database Tier</div>
                  <div className="text-lg font-bold text-white">{metrics.dbRps.toLocaleString()} RPS</div>
                  <div className="text-[11px] text-slate-400">{metrics.dbStatus}</div>
                </div>
              </div>

              {/* Status Summary */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Avg Response Latency:</span>
                    <span className={`text-base font-bold font-mono ${metrics.avgLatency < 80 ? 'text-emerald-400' : metrics.avgLatency < 200 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {metrics.avgLatency} ms
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">System Resilience:</span>
                    <span className="text-base font-bold text-cyan-400">
                      {hasCdn && hasCache && dbReplication !== 'single' ? 'High Availability (99.99%)' : 'Single Point of Failure'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  Formula: Ingress → CDN (60% cut) → NGINX LB → Cluster ({appInstances} pods) → Redis (75% cache hit) → DB Replica
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cap' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2">Eric Brewer's CAP Theorem</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                In any distributed asynchronous network, you can guarantee at most two of the three properties:
                Consistency (C), Availability (A), and Partition Tolerance (P). In real networks, partitions (P) are unavoidable, so you must trade off Consistency vs Availability!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    type: 'CP',
                    title: 'Consistency + Partition Tolerance',
                    systems: 'MongoDB, HBase, CockroachDB, Spanner, Redis (standalone)',
                    tradeoff: 'When network partitions occur, requests will wait or error out rather than return stale data.',
                    ideal: 'Banking, payment gateways, stock trading, inventory reservation.'
                  },
                  {
                    type: 'AP',
                    title: 'Availability + Partition Tolerance',
                    systems: 'Apache Cassandra, Amazon DynamoDB, CouchDB, DNS',
                    tradeoff: 'Every request receives a response, but it may contain stale data (Eventual Consistency).',
                    ideal: 'Social media feeds, video comments, analytics logging, shopping cart browsing.'
                  },
                  {
                    type: 'CA',
                    title: 'Consistency + Availability',
                    systems: 'PostgreSQL (Single Node), MySQL (Single Node)',
                    tradeoff: 'Only possible in a non-partitioned environment (single datacenter / single node). Not distributed!',
                    ideal: 'Traditional monolithic ERP, single-server local database.'
                  }
                ].map((item) => (
                  <div
                    key={item.type}
                    onClick={() => setCapSelection(item.type as any)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      capSelection === item.type
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold font-mono text-cyan-400">{item.type}</span>
                      {capSelection === item.type && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">Selected</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-300 mb-3">{item.tradeoff}</p>
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <strong>Examples:</strong> {item.systems}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estimation' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Back-of-the-Envelope Capacity Estimation</h3>
              <p className="text-xs text-slate-400">
                Formulae used in Google/Meta System Design interviews to size servers, memory, and bandwidth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Daily Active Users (DAU)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={dau}
                    onChange={(e) => setDau(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-xs font-mono font-bold text-white w-14 text-right">{dau}M</span>
                </div>
              </div>

              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Requests per User / Day</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={actionsPerUser}
                    onChange={(e) => setActionsPerUser(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-xs font-mono font-bold text-white w-14 text-right">{actionsPerUser}</span>
                </div>
              </div>

              <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Average Payload Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={payloadKb}
                    onChange={(e) => setPayloadKb(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="text-xs font-mono font-bold text-white w-14 text-right">{payloadKb} KB</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Avg Ingress QPS</span>
                <span className="text-lg font-bold font-mono text-cyan-400">{estimation.avgQps.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Peak QPS (2x Rule)</span>
                <span className="text-lg font-bold font-mono text-amber-400">{estimation.peakQps.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Daily Ingest Storage</span>
                <span className="text-lg font-bold font-mono text-emerald-400">{estimation.dailyStorageGb} GB/day</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">5-Year Projected Storage</span>
                <span className="text-lg font-bold font-mono text-purple-400">{(Number(estimation.yearlyStorageTb) * 5).toFixed(1)} TB</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Cache-Aside (Lazy Loading)',
                desc: 'Application first queries Cache. If Cache Miss, it queries DB and writes the result into Cache before returning.',
                benefit: 'Resilient to cache node failures; cache only holds frequently accessed keys.',
                code: 'async function getUser(id) {\n  let u = await redis.get(`user:${id}`);\n  if (u) return JSON.parse(u);\n  u = await db.query("SELECT * FROM users WHERE id = ?", id);\n  await redis.setex(`user:${id}`, 3600, JSON.stringify(u));\n  return u;\n}'
              },
              {
                title: 'Write-Through Cache',
                desc: 'Application writes data to Cache and DB synchronously. High write latency, but guarantees zero stale reads.',
                benefit: 'Cache is always consistent with the database; no race conditions.',
                code: 'async function updateUser(user) {\n  await db.update(user);\n  await redis.set(`user:${user.id}`, JSON.stringify(user));\n}'
              },
              {
                title: 'Bloom Filter (Fast In-Memory Exists Check)',
                desc: 'Probabilistic data structure with zero false negatives. Tests if an element definitely does not exist before hitting expensive disk DB.',
                benefit: 'Protects DB against Cache Penetration attacks where hackers request non-existent random IDs.',
                code: '// If bloomFilter.mightContain(key) == false\n// Return 404 immediately without touching PostgreSQL'
              },
              {
                title: 'Distributed Rate Limiting (Token Bucket)',
                desc: 'Tokens refill at a steady rate. Burst traffic is allowed up to bucket capacity. Handled using Redis atomic INCR or Lua scripts.',
                benefit: 'Protects microservices from DDoS and prevents cascade collapse.',
                code: 'local current = redis.call("INCR", KEYS[1])\nif current == 1 then\n  redis.call("EXPIRE", KEYS[1], ARGV[1])\nend\nreturn current <= tonumber(ARGV[2])'
              }
            ].map((pattern, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  {pattern.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{pattern.desc}</p>
                <div className="text-[11px] text-emerald-400 font-medium">✓ Advantage: {pattern.benefit}</div>
                <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto">
                  {pattern.code}
                </pre>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
