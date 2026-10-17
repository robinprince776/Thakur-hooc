import React, { useState, useMemo } from 'react';
import {
  Code2,
  ArrowRight,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';

export interface RegexMasterAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const RegexMasterApp: React.FC<RegexMasterAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [pattern, setPattern] = useState('\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState(
    'Contact our SOC leads at security@company.com or analyst.team@defense.org for emergency incident triage. Support is at help@sub.domain.io.'
  );

  const [copied, setCopied] = useState(false);

  const regexResults = useMemo(() => {
    try {
      const reg = new RegExp(pattern, flags);
      const matches = Array.from(testString.matchAll(reg));
      return { isValid: true, matches: matches.map((m) => m[0]), error: null };
    } catch (err: any) {
      return { isValid: false, matches: [], error: err.message };
    }
  }, [pattern, flags, testString]);

  const SECURITY_PRESETS = [
    { label: 'Email Addresses', pat: '\\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\b' },
    { label: 'IPv4 Addresses', pat: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
    { label: 'SHA-256 Hashes', pat: '\\b[a-fA-F0-9]{64}\\b' },
    { label: 'JWT Token String', pat: 'ey[A-Za-z0-9_-]+\\.ey[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+' },
    { label: 'Indian Mobile (+91)', pat: '(?:\\+91[\\-\\s]?)?[6-9]\\d{9}' },
    { label: 'AWS Access Key ID', pat: 'AKIA[0-9A-Z]{16}' }
  ];

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                      Regex Master &amp; Tester
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Live Engine
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Real-time regex evaluation, syntax highlights &amp; security extraction library
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Live Regular Expression Engine</h2>
              <p className="text-xs text-slate-400 mt-0.5">Test regular expressions against custom input with instant capture matching.</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              regexResults.isValid ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {regexResults.isValid ? `${regexResults.matches.length} Matches Found` : 'Invalid Expression'}
            </span>
          </div>

          {/* Pattern & Flags Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="sm:col-span-3">
              <label className="text-slate-400 font-sans block mb-1 font-bold">Regular Expression Pattern:</label>
              <div className="flex items-center px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700">
                <span className="text-slate-500 text-sm mr-1">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="w-full bg-transparent text-cyan-300 focus:outline-none"
                />
                <span className="text-slate-500 text-sm ml-1">/</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-sans block mb-1 font-bold">Flags:</label>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="g, i, m, s"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">Security Presets:</span>
            {SECURITY_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setPattern(p.pat)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 cursor-pointer text-[11px]"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Test String */}
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-400 font-bold block">Test String Payload:</label>
            <textarea
              rows={4}
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Results Display */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-slate-500 uppercase font-bold text-[10px]">Extracted Matched Tokens:</div>
            <div className="flex flex-wrap gap-2">
              {regexResults.matches.map((m, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {m}
                </span>
              ))}
              {regexResults.matches.length === 0 && regexResults.isValid && (
                <span className="text-slate-600 italic">No matches in current test string.</span>
              )}
              {regexResults.error && (
                <span className="text-rose-400">{regexResults.error}</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
