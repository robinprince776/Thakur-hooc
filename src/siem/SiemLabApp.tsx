import React, { useState, useMemo } from 'react';
import {
  Activity,
  ArrowRight,
  Layers,
  Search,
  Filter,
  Shield,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Play
} from 'lucide-react';

export interface SiemLabAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

const SAMPLE_LOGS = [
  'Oct 17 08:12:01 server sshd[12401]: Failed password for invalid user admin from 192.168.1.105 port 42100 ssh2',
  'Oct 17 08:12:03 server sshd[12403]: Failed password for invalid user root from 192.168.1.105 port 42102 ssh2',
  'Oct 17 08:12:06 server sshd[12406]: Failed password for invalid user test from 192.168.1.105 port 42105 ssh2',
  'Oct 17 08:14:15 server nginx: 198.51.100.22 - - [17/Oct/2026:08:14:15 +0000] "GET /wp-login.php HTTP/1.1" 404 162',
  'Oct 17 08:14:16 server nginx: 198.51.100.22 - - [17/Oct/2026:08:14:16 +0000] "GET /phpmyadmin/index.php HTTP/1.1" 404 162',
  'Oct 17 08:14:18 server nginx: 198.51.100.22 - - [17/Oct/2026:08:14:18 +0000] "GET /../../../../etc/passwd HTTP/1.1" 400 240',
  'Oct 17 08:16:20 server nginx: 203.0.113.88 - - [17/Oct/2026:08:16:20 +0000] "POST /api/v1/login HTTP/1.1" 200 450',
  'Oct 17 08:17:02 server nginx: 198.51.100.22 - - [17/Oct/2026:08:17:02 +0000] "GET /products?id=1%20UNION%20SELECT%20null,null HTTP/1.1" 403 520',
  'Oct 17 08:18:40 server sshd[12410]: Accepted publickey for user kali from 10.0.0.15 port 51200 ssh2'
];

export const SiemLabApp: React.FC<SiemLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'rules' | 'metrics'>('logs');
  const [filterRegex, setFilterRegex] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const PRESETS = [
    { label: 'SSH Brute Force', regex: 'Failed password.*', desc: 'Detects consecutive authentication failures on port 22' },
    { label: 'Path Traversal', regex: '\\.\\./', desc: 'Detects ../ directory breakout attempts targeting /etc/passwd' },
    { label: 'SQL Injection Scan', regex: 'UNION%20SELECT|SELECT.*FROM', desc: 'Detects in-band SQL union keywords in URL' },
    { label: 'Admin Probing 404', regex: '404.*(wp-login|phpmyadmin)', desc: 'Detects automated vulnerability scanner probes' }
  ];

  const filteredLogs = useMemo(() => {
    if (!filterRegex.trim()) return SAMPLE_LOGS;
    try {
      const reg = new RegExp(filterRegex, 'i');
      return SAMPLE_LOGS.filter((line) => reg.test(line));
    } catch {
      return SAMPLE_LOGS;
    }
  }, [filterRegex]);

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
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                      Log Analysis &amp; SIEM
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Blue Team Detection
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    SIEM rule builder, auth.log &amp; Nginx access regex threat detector
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

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'logs', label: '1. 📊 Live SIEM Stream', icon: Activity },
              { id: 'rules', label: '2. 🎯 Detection Presets', icon: Shield },
              { id: 'metrics', label: '3. 📈 Offender Metrics', icon: Filter }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Security Event Telemetry &amp; Regex Filtering</h2>
                <p className="text-xs text-slate-400 mt-1">Real-time log stream matching against custom regular expression rules.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 font-mono text-cyan-400 text-xs font-bold">
                {filteredLogs.length} / {SAMPLE_LOGS.length} Matched Events
              </span>
            </div>

            {/* Filter Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={filterRegex}
                onChange={(e) => {
                  setFilterRegex(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="Type regex query (e.g. Failed password, 404, UNION, 198.51)..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              {filterRegex && (
                <button
                  onClick={() => {
                    setFilterRegex('');
                    setActivePreset(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Presets Grid */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold">Quick SIEM Presets:</span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFilterRegex(p.regex);
                    setActivePreset(p.label);
                  }}
                  className={`px-3 py-1 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                    activePreset === p.label
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                      : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Log Stream Window */}
            <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 font-mono text-[11px] space-y-2 border border-slate-800 overflow-x-auto max-h-[450px]">
              {filteredLogs.map((log, idx) => {
                const isFail = log.includes('Failed') || log.includes('404') || log.includes('403') || log.includes('400');
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border leading-relaxed ${
                      isFail
                        ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
              {filteredLogs.length === 0 && (
                <div className="p-8 text-center text-slate-600 italic">No logs matched your query.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: RULES */}
        {activeTab === 'rules' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white">SIEM Detection Engineering Rule Specifications</h2>
            <div className="space-y-3 font-mono">
              {PRESETS.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-400">{p.label}</span>
                    <span className="text-[10px] text-slate-500">Regex Pattern</span>
                  </div>
                  <div className="text-white text-[11px]">{p.regex}</div>
                  <p className="text-slate-400 font-sans text-[11px]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: METRICS */}
        {activeTab === 'metrics' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h2 className="text-xl font-bold text-white">Top Offending IP Telemetry Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <span className="font-bold text-rose-400 block font-sans">198.51.100.22 (Malicious Scanner)</span>
                <p className="text-slate-300 text-[11px]">4 Events: /wp-login, /phpmyadmin, /etc/passwd, SQLi UNION probe</p>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold">Recommended: Firewall Block</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block font-sans">192.168.1.105 (Internal Brute-Force)</span>
                <p className="text-slate-300 text-[11px]">3 Events: Failed SSH root, admin, test passwords</p>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold">Recommended: Account Lockout &amp; Host Isolation</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
