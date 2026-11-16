import React, { useState } from 'react';
import { BookOpen, FileText, Hash, Search } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

const LEXICON = [
  {
    term: 'Zero Trust Architecture (ZTA)',
    category: 'Architecture',
    definition: 'Security model assuming zero implicit trust based on network location; requires continuous explicit verification for every request.',
  },
  {
    term: 'Parameterized Queries (Prepared Statements)',
    category: 'AppSec',
    definition: 'Database execution pattern separating SQL structure from bound parameters so user data can never execute as SQL commands.',
  },
  {
    term: 'MITRE ATT&CK',
    category: 'Threat Intel',
    definition: 'Globally accessible knowledge base mapping real-world adversary tactics, techniques, and defensive mitigations.',
  },
  {
    term: 'DMARC (p=reject)',
    category: 'Email Security',
    definition: 'Email authentication policy instructing receiving mail servers to reject spoofed messages failing SPF and DKIM alignment.',
  },
  {
    term: 'Content-Security-Policy (CSP)',
    category: 'Web Defense',
    definition: 'HTTP response header restricting which scripts, styles, and origins a browser may execute, mitigating XSS blast radius.',
  },
  {
    term: 'Magic Bytes',
    category: 'Forensics DFIR',
    definition: 'Leading signature bytes inside a binary file header (e.g., FF D8 FF for JPEG) used to identify true file format independently of extension.',
  },
];

function estimateEntropy(pw: string): { bits: number; label: string } {
  if (!pw) return { bits: 0, label: 'Empty' };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  const bits = Math.round(pw.length * Math.log2(Math.max(pool, 1)));
  if (bits >= 80) return { bits, label: 'Strong (High Entropy)' };
  if (bits >= 50) return { bits, label: 'Moderate' };
  return { bits, label: 'Weak (Increase Length & Mix)' };
}

export const KnowledgeVaultModule: React.FC = () => {
  const savedReports = useGhostStore((s) => s.savedReports);
  const [query, setQuery] = useState('');
  const [hashInput, setHashInput] = useState('ghost-protocol-verify');
  const [sha256Out, setSha256Out] = useState('');
  const [pwCheck, setPwCheck] = useState('ZeroTrust!2026#SOC');

  const filteredTerms = LEXICON.filter(
    (item) =>
      !query.trim() ||
      item.term.toLowerCase().includes(query.toLowerCase()) ||
      item.definition.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const computeSha256 = async () => {
    try {
      const data = new TextEncoder().encode(hashInput);
      const digest = await crypto.subtle.digest('SHA-256', data);
      const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setSha256Out(hex);
    } catch {
      setSha256Out('Web Crypto API unavailable in this context.');
    }
  };

  const entropy = estimateEntropy(pwCheck);

  return (
    <ModuleFrame
      moduleId="vault"
      onResetLocal={() => {
        setQuery('');
        setSha256Out('');
      }}
    >
      <div className="space-y-6">
        {/* Real Client-Side Defensive Crypto & Entropy Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00E5FF]">
              <Hash className="w-4 h-4" />
              <span>Real Web Crypto SHA-256 Digest Calculator</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Enter text or artifact string..."
                className="flex-1 px-3 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 font-ghost-mono text-xs text-white focus:outline-none focus:border-[#00E5FF]"
              />
              <button
                type="button"
                onClick={computeSha256}
                className="px-4 py-2 min-h-[40px] rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
              >
                Hash
              </button>
            </div>
            {sha256Out && (
              <div className="p-2.5 rounded-lg bg-[#060910] border border-[#00FF41]/30 font-ghost-mono text-[11px] text-[#00FF41] break-all">
                {sha256Out}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#00FF41]">Passphrase Entropy Estimator</span>
              <span className="font-ghost-mono text-slate-300">{entropy.bits} bits · {entropy.label}</span>
            </div>
            <input
              type="text"
              value={pwCheck}
              onChange={(e) => setPwCheck(e.target.value)}
              placeholder="Test passphrase strength locally (never transmitted)..."
              className="w-full px-3 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 font-ghost-mono text-xs text-white focus:outline-none focus:border-[#00FF41]"
            />
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  entropy.bits >= 80 ? 'bg-[#00FF41]' : entropy.bits >= 50 ? 'bg-amber-400' : 'bg-[#FF003C]'
                }`}
                style={{ width: `${Math.min(100, entropy.bits)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search defensive cyber dictionary..."
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl bg-[#0D1322] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00E5FF]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00E5FF]">
              <BookOpen className="w-4 h-4" />
              <span>Cybersecurity Dictionary ({filteredTerms.length})</span>
            </div>
            {filteredTerms.map((item) => (
              <div
                key={item.term}
                className="p-4 rounded-xl border border-slate-800 bg-[#0D1322] space-y-1.5"
              >
                <div className="text-[11px] font-ghost-mono text-[#00FF41]">{item.category}</div>
                <h4 className="text-sm font-bold text-white">{item.term}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00FF41]">
              <FileText className="w-4 h-4" />
              <span>Saved Assessment Reports ({savedReports.length})</span>
            </div>
            {savedReports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-xl border border-slate-800 bg-[#0D1322] space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-ghost-mono">
                  <span className="text-[#00E5FF]">{rep.createdAt}</span>
                  <span className={rep.severity === 'High' || rep.severity === 'Critical' ? 'text-[#FF003C]' : 'text-amber-300'}>
                    {rep.severity} Severity
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{rep.title}</h4>
                <p className="text-xs text-slate-400">{rep.scope}</p>
                <p className="text-xs text-slate-200 leading-relaxed">{rep.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
};
