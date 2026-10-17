import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Shield,
  Layers,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';

export interface ThreatModelingAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const ThreatModelingApp: React.FC<ThreatModelingAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'stride' | 'dread' | 'components'>('stride');

  // STRIDE Explorer State
  const [selectedThreat, setSelectedThreat] = useState<'S' | 'T' | 'R' | 'I' | 'D' | 'E'>('S');

  // DREAD Calculator State
  const [damage, setDamage] = useState(8); // Damage (0-10)
  const [reproducibility, setReproducibility] = useState(7); // Reproducibility (0-10)
  const [exploitability, setExploitability] = useState(6); // Exploitability (0-10)
  const [affectedUsers, setAffectedUsers] = useState(9); // Affected Users (0-10)
  const [discoverability, setDiscoverability] = useState(5); // Discoverability (0-10)

  const dreadScore = useMemo(() => {
    const total = damage + reproducibility + exploitability + affectedUsers + discoverability;
    const avg = (total / 5).toFixed(1);
    const severity = Number(avg) >= 8 ? 'Critical' : Number(avg) >= 6 ? 'High' : Number(avg) >= 4 ? 'Medium' : 'Low';
    return { total, avg, severity };
  }, [damage, reproducibility, exploitability, affectedUsers, discoverability]);

  const STRIDE_CATEGORIES = {
    S: {
      name: 'Spoofing Identity',
      violation: 'Authenticity',
      definition: 'An attacker pretends to be another authorized user or a trusted machine system.',
      example: 'Attacker sends an email with forged SPF/DKIM or reuses an expired JWT cookie.',
      countermeasure: 'Digital signatures, PKI certificates, HMAC tokens, FIDO2/WebAuthn hardware keys, strict SPF/DMARC.'
    },
    T: {
      name: 'Tampering with Data',
      violation: 'Integrity',
      definition: 'Unauthorized modification of data in transit (Man-in-the-Middle) or data at rest in storage.',
      example: 'Modifying the price parameter from ₹500 to ₹1 in an unverified client HTTP request.',
      countermeasure: 'TLS 1.3 encryption, cryptographic hashes (SHA-256), database row check constraints, write-once storage.'
    },
    R: {
      name: 'Repudiation',
      violation: 'Non-Repudiation',
      definition: 'A user performs an illegal or destructive action and denies having done it, with no audit proof.',
      example: 'A rogue employee drops a database table and claims "it was not my account".',
      countermeasure: 'Append-only audit logs, cryptographic timestamping, remote syslog forwarding to immutable AWS S3.'
    },
    I: {
      name: 'Information Disclosure',
      violation: 'Confidentiality',
      definition: 'Exposing private data or system internals to unauthorized individuals.',
      example: 'Database error tracebacks leaking credentials and table schema in HTTP 500 JSON response.',
      countermeasure: 'Generic production error messages, AES-256 field-level encryption, masking PII in logs.'
    },
    D: {
      name: 'Denial of Service (DoS)',
      violation: 'Availability',
      definition: 'Degrading or denying service to valid users by exhausting server CPU, RAM, or bandwidth.',
      example: 'Slowloris attack holding open HTTP sockets or regex polynomial ReDoS freezing Node.js event loop.',
      countermeasure: 'Cloudflare DDoS protection, IP rate limiting, regex timeouts, connection limits, auto-scaling.'
    },
    E: {
      name: 'Elevation of Privilege',
      violation: 'Authorization',
      definition: 'An unprivileged user gains admin capabilities or bypasses security boundaries.',
      example: 'Manipulating role: "user" to role: "admin" in an insecure direct object reference (IDOR).',
      countermeasure: 'Strict server-side RBAC, least privilege, zero-trust token verification, input validation.'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">ThreatModeling Lab</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  #threatmodel · App #39
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Microsoft STRIDE Threat Matrix, DREAD Risk Scoring & Secure Architecture Boundaries
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
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-all shadow"
              >
                Back to Hub
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto flex gap-2 mt-3 overflow-x-auto pb-1">
          {[
            { id: 'stride', label: 'STRIDE Threat Matrix', icon: Shield },
            { id: 'dread', label: 'DREAD Risk Score Calculator', icon: Sliders },
            { id: 'components', label: 'Trust Boundaries & DFD', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
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
        {activeTab === 'stride' && (
          <div className="space-y-6">
            {/* Category Selector */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {(Object.keys(STRIDE_CATEGORIES) as Array<keyof typeof STRIDE_CATEGORIES>).map((key) => {
                const item = STRIDE_CATEGORIES[key];
                const isSelected = selectedThreat === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedThreat(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl font-bold font-mono text-rose-400 block">{key}</span>
                    <span className="text-xs font-bold text-white block truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400 truncate block">{item.violation}</span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Threat Inspector */}
            {(() => {
              const current = STRIDE_CATEGORIES[selectedThreat];
              return (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-mono text-rose-400 font-bold uppercase">Violated Security Property</span>
                      <h3 className="text-xl font-bold text-white">
                        {current.name} ({current.violation})
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                      STRIDE: {selectedThreat}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300">Formal Definition</span>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {current.definition}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300">Real-World Attack Scenario</span>
                    <p className="text-xs text-amber-300/90 leading-relaxed bg-amber-950/20 p-3 rounded-xl border border-amber-900/40">
                      ⚠️ {current.example}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300">Defensive Architecture Countermeasures</span>
                    <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/40">
                      🛡️ {current.countermeasure}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'dread' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">DREAD Threat Scoring Model</h3>
              <p className="text-xs text-slate-400">
                Rate vulnerability risk from 1 to 10 across the 5 DREAD criteria to calculate overall severity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                {[
                  { label: 'Damage Potential', val: damage, setVal: setDamage, desc: 'How grave is the damage if exploited?' },
                  { label: 'Reproducibility', val: reproducibility, setVal: setReproducibility, desc: 'How easily can the attack be duplicated?' },
                  { label: 'Exploitability', val: exploitability, setVal: setExploitability, desc: 'What technical skill level or tools are needed?' },
                  { label: 'Affected Users', val: affectedUsers, setVal: setAffectedUsers, desc: 'What percentage of users are impacted?' },
                  { label: 'Discoverability', val: discoverability, setVal: setDiscoverability, desc: 'How easy is it for an attacker to find this bug?' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      <span className="text-xs font-mono font-bold text-rose-400">{item.val}/10</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={item.val}
                      onChange={(e) => item.setVal(Number(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                    <span className="text-[10px] text-slate-400">{item.desc}</span>
                  </div>
                ))}
              </div>

              {/* DREAD Score Summary */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <span className="text-xs text-slate-400 uppercase font-mono block">Calculated DREAD Score</span>
                <div className="text-5xl font-bold font-mono text-rose-400">
                  {dreadScore.avg} <span className="text-lg text-slate-500">/ 10</span>
                </div>
                <div
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${
                    dreadScore.severity === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : dreadScore.severity === 'High'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}
                >
                  Severity: {dreadScore.severity}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Formula: (Damage + Reproducibility + Exploitability + AffectedUsers + Discoverability) / 5
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'External Untrusted Zone',
                entities: 'Public Internet Users, Third-Party APIs, Crawlers',
                threats: 'Spoofing, DDoS, SQL Injection, Credential Stuffing',
                boundary: 'WAF / API Gateway boundary with TLS 1.3'
              },
              {
                title: 'DMZ / Ingress Zone',
                entities: 'NGINX Reverse Proxy, Cloudflare Workers, Edge Caches',
                threats: 'Header injection, Cache poisoning, Protocol downgrade',
                boundary: 'mTLS & VPC Private Subnet boundary'
              },
              {
                title: 'Internal Secure Core',
                entities: 'PostgreSQL Database, Secret Manager, HashiCorp Vault',
                threats: 'Privilege escalation, SQL dumping, lateral movement',
                boundary: 'Zero-Trust IAM, private VPC endpoints, encrypted disks'
              }
            ].map((zone, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-rose-400 font-bold block">Zone {i + 1}</span>
                <h4 className="text-sm font-bold text-white">{zone.title}</h4>
                <div className="text-xs text-slate-300">
                  <strong>Components:</strong> {zone.entities}
                </div>
                <div className="text-xs text-amber-400/90">
                  <strong>Key Threats:</strong> {zone.threats}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  🔒 {zone.boundary}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
