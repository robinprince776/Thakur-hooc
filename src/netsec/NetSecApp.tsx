import React, { useState } from 'react';
import {
  Shield,
  Terminal,
  Search,
  Check,
  Copy,
  Lock,
  Globe,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Layers,
  Database
} from 'lucide-react';

interface OwaspItem {
  id: string;
  rank: string;
  title: string;
  category: string;
  threat: string;
  defense: string;
  codeSnippet: string;
}

const OWASP_ITEMS: OwaspItem[] = [
  {
    id: 'a01',
    rank: 'A01:2021',
    title: 'Broken Access Control',
    category: 'Authorization',
    threat: 'Users can act outside of their intended permissions (e.g. Insecure Direct Object References - IDOR).',
    defense: 'Enforce server-side record ownership checks on every request. Never rely solely on client-side role checks.',
    codeSnippet: `// Server-side authorization check (Express / Node.js)
app.get('/api/documents/:id', async (req, res) => {
  const doc = await db.documents.findById(req.params.id);
  // Verify ownership before returning document
  if (!doc || doc.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied: Unauthorized access' });
  }
  return res.json(doc);
});`
  },
  {
    id: 'a02',
    rank: 'A02:2021',
    title: 'Cryptographic Failures',
    category: 'Data Protection',
    threat: 'Exposure of sensitive data (PII, passwords) via plaintext transport or weak obsolete hashing (MD5, SHA1).',
    defense: 'Enforce TLS 1.3 in transit. Hash user passwords with Argon2id or bcrypt (cost factor >= 12).',
    codeSnippet: `// Modern password hashing with bcrypt
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;
export async function hashPassword(plainText: string): Promise<string> {
  return await bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plainText, hash);
}`
  },
  {
    id: 'a03',
    rank: 'A03:2021',
    title: 'Injection (SQL, NoSQL, Command)',
    category: 'Input Validation',
    threat: 'Untrusted user input concatenated directly into database queries or shell execution strings.',
    defense: 'Always use parameterized prepared statements or safe ORM mappings. Never concatenate strings into queries.',
    codeSnippet: `// SECURE: Parameterized Query (Node.js pg)
const query = 'SELECT * FROM users WHERE email = $1 AND active = $2';
const values = [userEmail, true];
const result = await pool.query(query, values);

// INSECURE (NEVER DO THIS):
// const query = "SELECT * FROM users WHERE email = '" + userEmail + "'";`
  },
  {
    id: 'a04',
    rank: 'A04:2021',
    title: 'Insecure Design',
    category: 'Architecture',
    threat: 'Missing security controls at the design phase (e.g. unlimited password attempts without rate limiting).',
    defense: 'Implement threat modeling (STRIDE), credential stuffing defenses, and exponential lockout policies.',
    codeSnippet: `// Rate Limiting Middleware
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' }
});`
  },
  {
    id: 'a05',
    rank: 'A05:2021',
    title: 'Security Misconfiguration',
    category: 'Configuration',
    threat: 'Default passwords, enabled debug endpoints, stack traces exposed to clients in production.',
    defense: 'Harden web servers, disable directory listing, remove stack traces, and set HTTP security headers.',
    codeSnippet: `// Helmet HTTP Security Headers in Express
import helmet from 'helmet';
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true }
}));`
  }
];

export const NetSecApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'headers' | 'audit' | 'dns' | 'owasp'>('headers');
  const [copied, setCopied] = useState(false);

  // Headers check state
  const [targetUrl, setTargetUrl] = useState('https://example.com');
  const [simulatedGrade, setSimulatedGrade] = useState<'A+' | 'B' | 'D'>('B');

  // DNS lookup state
  const [dnsDomain, setDnsDomain] = useState('example.com');
  const [dnsType, setDnsType] = useState<'A' | 'MX' | 'TXT' | 'ANY'>('A');

  // OWASP checklist state
  const [checkedOwasp, setCheckedOwasp] = useState<Record<string, boolean>>({ a01: true, a02: true });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCheck = (id: string) => {
    setCheckedOwasp((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Shield className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                NetSec Sandbox
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-800">
                  Security Lab
                </span>
              </h1>
              <p className="text-xs text-slate-400">Security Headers, DNS Auditing &amp; OWASP Defensive Hardening</p>
            </div>
          </div>

          <a
            href="#bcaverse"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Back to Suite
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'headers', label: 'Security Headers & CORS Audit', icon: Globe },
            { id: 'audit', label: 'Network Defense & Audit Reference', icon: Terminal },
            { id: 'dns', label: 'DNS & Subdomain Procedure', icon: Search },
            { id: 'owasp', label: 'OWASP Top 10 Hardening', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'headers' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-400" />
                Security Headers Posture Inspector
              </h2>
              <p className="text-xs text-slate-300">
                Audit crucial defensive HTTP response headers required to protect users against Clickjacking, Cross-Site Scripting (XSS), and MIME-sniffing.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white outline-none focus:border-rose-500"
                />
                <button
                  onClick={() => {
                    const grade = targetUrl.includes('https') ? 'A+' : 'D';
                    setSimulatedGrade(grade);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Analyze Posture
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                {[
                  {
                    header: 'Strict-Transport-Security (HSTS)',
                    status: 'Required',
                    state: 'Protected',
                    desc: 'Forces browser to only use HTTPS, mitigating SSL-stripping and man-in-the-middle attacks.',
                    recommended: 'max-age=31536000; includeSubDomains; preload'
                  },
                  {
                    header: 'Content-Security-Policy (CSP)',
                    status: 'Critical',
                    state: 'Protected',
                    desc: 'Restricts script injection origins and blocks unauthorized external execution.',
                    recommended: "default-src 'self'; script-src 'self' 'nonce-...';"
                  },
                  {
                    header: 'X-Frame-Options',
                    status: 'Recommended',
                    state: 'Protected',
                    desc: 'Stops malicious iframe embeddings and UI clickjacking attacks.',
                    recommended: 'DENY or SAMEORIGIN'
                  },
                  {
                    header: 'X-Content-Type-Options',
                    status: 'Recommended',
                    state: 'Protected',
                    desc: 'Prevents MIME-type confusion attacks by forcing browsers to honor declared Content-Type.',
                    recommended: 'nosniff'
                  }
                ].map((item) => (
                  <div key={item.header} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{item.header}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {item.state}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.desc}</p>
                    <div className="pt-1 text-[11px] text-slate-300 font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <strong>Recommended:</strong> {item.recommended}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-400" />
                Defensive Auditing &amp; Port Verification Reference
              </h2>
              <p className="text-xs text-slate-300">
                Educational reference for system administrators and defenders to verify their own network perimeter and secure configurations.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Service Version & Vulnerability Auditing (Self-Hosted Lab)',
                    command: 'sudo nmap -sV -sC -O -T4 127.0.0.1',
                    explanation: 'Probes local server to identify running services (-sV), default defense scripts (-sC), and OS fingerprint (-O) to uncover outdated or unpatched services.'
                  },
                  {
                    title: 'TLS/SSL Certificate & Cipher Inspection',
                    command: 'openssl s_client -connect example.com:443 -servername example.com',
                    explanation: 'Validates SSL certificate chain, expiration date, OCSP stapling, and supported cipher suites to detect weak TLS 1.0/1.1 protocols.'
                  },
                  {
                    title: 'Active Network Socket & Port Verification',
                    command: 'sudo ss -tulpn',
                    explanation: 'Inspects all TCP/UDP ports listening on the Linux host to detect accidental public exposure of internal databases (like MongoDB on 27017 or Redis on 6379).'
                  },
                  {
                    title: 'Firewall Policy Hardening (UFW Default Deny)',
                    command: 'sudo ufw default deny incoming && sudo ufw default allow outgoing && sudo ufw allow 22/tcp',
                    explanation: 'Sets default drop policy for all incoming ports and explicitly allows only SSH to prevent unauthorized lateral movement.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400">{item.explanation}</p>
                    <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <code className="font-mono text-xs text-emerald-300">{item.command}</code>
                      <button
                        onClick={() => handleCopy(item.command)}
                        className="p-1 text-slate-400 hover:text-white shrink-0 ml-2 cursor-pointer"
                        title="Copy command"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dns' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4 text-rose-400" />
                  DNS Record Verification
                </h2>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Domain Name:</label>
                  <input
                    type="text"
                    value={dnsDomain}
                    onChange={(e) => setDnsDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Query Record Type:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['A', 'MX', 'TXT', 'ANY'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setDnsType(t)}
                        className={`py-1.5 rounded-lg text-xs font-bold font-mono border transition-colors cursor-pointer ${
                          dnsType === t
                            ? 'bg-rose-600 text-white border-rose-500'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div><strong>A Record:</strong> Resolves domain to IPv4 address.</div>
                  <div><strong>MX Record:</strong> Points to mail exchange servers.</div>
                  <div><strong>TXT Record:</strong> Carries SPF, DKIM, and DMARC email security keys.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-xl space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Standard Command Line Procedures
                </span>

                <div className="space-y-3">
                  {[
                    {
                      tool: 'dig (DNS Lookup Utility)',
                      cmd: `dig ${dnsDomain} ${dnsType} +noall +answer`
                    },
                    {
                      tool: 'dig Trace from Root Nameservers',
                      cmd: `dig +trace ${dnsDomain}`
                    },
                    {
                      tool: 'nslookup Standard Query',
                      cmd: `nslookup -type=${dnsType} ${dnsDomain}`
                    },
                    {
                      tool: 'whois Domain Registration & Registrar Info',
                      cmd: `whois ${dnsDomain}`
                    }
                  ].map((proc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[11px] text-slate-400 font-semibold">{proc.tool}</div>
                      <div className="flex items-center justify-between">
                        <code className="text-xs font-mono text-emerald-300">{proc.cmd}</code>
                        <button
                          onClick={() => handleCopy(proc.cmd)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer ml-2"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'owasp' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 flex items-center justify-between">
              <span>OWASP Top 10 Security Architecture Checklist (Defense-in-Depth)</span>
              <span className="font-mono font-bold">
                {Object.values(checkedOwasp).filter(Boolean).length} / {OWASP_ITEMS.length} Hardened
              </span>
            </div>

            <div className="space-y-4">
              {OWASP_ITEMS.map((item) => {
                const isDone = !!checkedOwasp[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCheck(item.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                            isDone ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600 bg-slate-900'
                          }`}
                        >
                          {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-rose-400">{item.rank}</span>
                            <h3 className="font-bold text-sm text-white">{item.title}</h3>
                          </div>
                          <span className="text-[11px] text-slate-400 font-semibold">{item.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <strong className="text-rose-400 block mb-1">Threat Overview:</strong>
                        <p className="text-slate-300 leading-relaxed">{item.threat}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                        <strong className="text-emerald-400 block mb-1">Defensive Hardening:</strong>
                        <p className="text-slate-300 leading-relaxed">{item.defense}</p>
                      </div>
                    </div>

                    <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span>Defensive Remediation Code</span>
                        <button
                          onClick={() => handleCopy(item.codeSnippet)}
                          className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className="p-3 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                        {item.codeSnippet}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
