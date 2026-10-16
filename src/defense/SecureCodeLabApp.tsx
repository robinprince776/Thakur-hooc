import React, { useState, useMemo } from 'react';
import {
  Shield,
  Lock,
  Key,
  Code2,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Search,
  BookOpen,
  ArrowRight,
  Layers
} from 'lucide-react';

export interface SecureCodeLabAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const SecureCodeLabApp: React.FC<SecureCodeLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher
}) => {
  const [activeTab, setActiveTab] = useState<'encoder' | 'hash-id' | 'owasp-fixes' | 'memory-safety'>('encoder');

  // 1. Encoding state
  const [encodeInput, setEncodeInput] = useState('Hello TechMaster! <script>alert(1)</script>');
  const [encodeMode, setEncodeMode] = useState<'base64' | 'url' | 'hex' | 'html' | 'binary'>('base64');
  const [copiedEncode, setCopiedEncode] = useState(false);

  // 2. Hash Identifier state
  const [hashInput, setHashInput] = useState('e10adc3949ba59abbe56e057f20f883e');
  const [hashCopied, setHashCopied] = useState(false);

  // 3. OWASP Defensive Studio
  const [selectedVulnerability, setSelectedVulnerability] = useState<'sqli' | 'xss' | 'cmdi' | 'path-traversal' | 'deserialization'>('sqli');

  // Encoding computation
  const encodedOutput = useMemo(() => {
    try {
      if (encodeMode === 'base64') {
        return btoa(unescape(encodeURIComponent(encodeInput)));
      } else if (encodeMode === 'url') {
        return encodeURIComponent(encodeInput);
      } else if (encodeMode === 'hex') {
        return Array.from(encodeInput)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(' ');
      } else if (encodeMode === 'html') {
        return encodeInput
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      } else if (encodeMode === 'binary') {
        return Array.from(encodeInput)
          .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
      }
      return encodeInput;
    } catch {
      return 'Encoding error: invalid character sequence';
    }
  }, [encodeInput, encodeMode]);

  // Hash Identification logic
  const hashAnalysis = useMemo(() => {
    const clean = hashInput.trim();
    const len = clean.length;
    const isHex = /^[0-9a-fA-F]+$/.test(clean);

    if (len === 32 && isHex) {
      return {
        type: 'MD5 (Message Digest 5)',
        bits: '128-bit',
        securityStatus: 'DEPRECATED & INSECURE',
        statusColor: 'text-rose-400 bg-rose-950/40 border-rose-800',
        explanation: 'MD5 is vulnerable to collision attacks (Wang et al., 2004) and precomputed Rainbow Tables. Must NEVER be used for passwords or digital signatures.',
        recommendation: 'Migrate to Argon2id, bcrypt, or PBKDF2 for password storage, or SHA-256 for checksum integrity.'
      };
    } else if (len === 40 && isHex) {
      return {
        type: 'SHA-1 (Secure Hash Algorithm 1)',
        bits: '160-bit',
        securityStatus: 'DEPRECATED & INSECURE',
        statusColor: 'text-amber-400 bg-amber-950/40 border-amber-800',
        explanation: 'Shattered attack (Google & CWI, 2017) demonstrated practical collisions in SHA-1. Modern browsers and TLS certificates forbid SHA-1.',
        recommendation: 'Use SHA-256 or SHA-3.'
      };
    } else if (len === 64 && isHex) {
      return {
        type: 'SHA-256 (SHA-2 Family)',
        bits: '256-bit',
        securityStatus: 'SECURE FOR DATA INTEGRITY',
        statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800',
        explanation: 'Standard cryptographic hash function with no known practical collision attacks. Ideal for HMAC, blockchain proof-of-work, and file integrity.',
        recommendation: 'For passwords, pair with high work-factor salts (PBKDF2 with SHA-256).'
      };
    } else if (clean.startsWith('$2a$') || clean.startsWith('$2b$') || clean.startsWith('$2y$')) {
      return {
        type: 'bcrypt (Adaptive Password Hash)',
        bits: 'Adaptive work factor (Cost 10-14)',
        securityStatus: 'HIGHLY RECOMMENDED',
        statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800',
        explanation: 'Key-derivation function based on Blowfish cipher. Automatically includes 128-bit salt and configurable computational cost to defeat GPU cracking.',
        recommendation: 'Excellent choice for production authentication systems.'
      };
    } else if (clean.startsWith('$argon2')) {
      return {
        type: 'Argon2 (PHC Winner)',
        bits: 'Configurable memory & time cost',
        securityStatus: 'GOLD STANDARD',
        statusColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800',
        explanation: 'Winner of the Password Hashing Competition (2015). Resistant to dedicated FPGA/ASIC hardware brute-force attacks via memory hardness.',
        recommendation: 'Industry gold standard for user credentials.'
      };
    } else {
      return {
        type: `Unrecognized Hash (${len} chars)`,
        bits: 'Unknown',
        securityStatus: 'NON-STANDARD OR ARBITRARY STRING',
        statusColor: 'text-slate-400 bg-slate-900 border-slate-800',
        explanation: 'Format does not match standard 32-char (MD5), 40-char (SHA-1), 64-char (SHA-256), or bcrypt/Argon2 signatures.',
        recommendation: 'Check if string is base64 encoded or padded.'
      };
    }
  }, [hashInput]);

  // OWASP Remediation Data
  const OWASP_DATA = {
    sqli: {
      title: 'SQL Injection (SQLi) Prevention',
      vulnDesc: 'Direct concatenation of unescaped user input into SQL query strings allows attackers to alter query logic.',
      vulnerableCode: `// ❌ INSECURE: String concatenation
String query = "SELECT * FROM users WHERE username = '" 
             + req.getParameter("user") + "' AND password = '" 
             + req.getParameter("pass") + "'";
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery(query);`,
      secureCode: `// ✅ SECURE: Parameterized Prepared Statement
String sql = "SELECT id, username, role FROM users WHERE username = ? AND password_hash = ?";
PreparedStatement pstmt = connection.prepareStatement(sql);
pstmt.setString(1, req.getParameter("user"));
pstmt.setString(2, hashedPassword);
ResultSet rs = pstmt.executeQuery();`,
      defensePoints: [
        'Always use Parameterized Queries (PreparedStatement) or Object-Relational Mappers (ORM).',
        'Input data is treated strictly as literal data parameters, never as executable SQL commands.',
        'Apply principle of least privilege: Database service accounts should not have DROP/ALTER permissions.'
      ]
    },
    xss: {
      title: 'Cross-Site Scripting (XSS) Prevention',
      vulnDesc: 'Rendering unsanitized user-supplied input directly into web DOM allows script execution in the victim\'s browser.',
      vulnerableCode: `<!-- ❌ INSECURE: Raw DOM injection -->
<div id="greeting"></div>
<script>
  const name = new URLSearchParams(window.location.search).get('name');
  document.getElementById('greeting').innerHTML = "Welcome " + name; // Vulnerable to <script>
</script>`,
      secureCode: `<!-- ✅ SECURE: Contextual HTML Encoding & textContent -->
<div id="greeting"></div>
<script>
  const name = new URLSearchParams(window.location.search).get('name');
  // textContent automatically encodes HTML special characters (<, >, &, ")
  document.getElementById('greeting').textContent = "Welcome " + name;
</script>`,
      defensePoints: [
        'Use safe DOM APIs like element.textContent instead of innerHTML.',
        'Implement strict Content-Security-Policy (CSP) headers (e.g. script-src \'self\').',
        'Set HttpOnly flag on authentication session cookies to block JavaScript theft.'
      ]
    },
    cmdi: {
      title: 'Command Injection Defense',
      vulnDesc: 'Passing untrusted parameters to system shell commands (e.g. system(), exec()) enables arbitrary OS command execution.',
      vulnerableCode: `// ❌ INSECURE: Shell execution with unvalidated user input
char cmd[256];
sprintf(cmd, "ping -c 4 %s", userIpInput); // User enters "8.8.8.8; cat /etc/passwd"
system(cmd);`,
      secureCode: `// ✅ SECURE: Strict Regex Whitelist + execve array execution
// 1. Whitelist validate IPv4 format:
if (!isValidIpv4(userIpInput)) {
    return ERROR_INVALID_INPUT;
}
// 2. Pass arguments as separate array without shell interpreter:
char *args[] = {"/bin/ping", "-c", "4", userIpInput, NULL};
execv("/bin/ping", args);`,
      defensePoints: [
        'Avoid invoking the system shell (system(), /bin/sh) whenever native API libraries exist.',
        'Use strict regular expression character whitelists rather than blacklists.',
        'Pass arguments as distinct array elements (execv) to prevent separator interpretation (;, |, &&).'
      ]
    },
    'path-traversal': {
      title: 'Path Traversal (Directory Traversal) Defense',
      vulnDesc: 'Attackers manipulate file path inputs using dot-dot-slash (../) to access restricted files outside the intended root directory.',
      vulnerableCode: `// ❌ INSECURE: Direct path concatenation
const filename = req.query.file; // e.g. "../../etc/shadow"
const content = fs.readFileSync("/var/www/uploads/" + filename);
res.send(content);`,
      secureCode: `// ✅ SECURE: Path Canonicalization & Root Boundary Validation
const path = require('path');
const UPLOAD_ROOT = '/var/www/uploads';

// Resolve to absolute canonical path
const safePath = path.resolve(UPLOAD_ROOT, req.query.file);

// Verify resolved path strictly starts with intended root
if (!safePath.startsWith(UPLOAD_ROOT)) {
    return res.status(403).send("Access Denied: Path Traversal Detected");
}
const content = fs.readFileSync(safePath);`,
      defensePoints: [
        'Normalize and canonicalize paths before reading from disk.',
        'Verify that the canonical path starts with the designated safe root prefix.',
        'Store files using randomized UUIDs in the database rather than user-supplied filenames.'
      ]
    },
    deserialization: {
      title: 'Insecure Deserialization Defense',
      vulnDesc: 'Deserializing untrusted object streams allows attackers to manipulate object state and instantiate arbitrary code execution gadgets.',
      vulnerableCode: `// ❌ INSECURE: Deserializing raw serialized Java / Python pickle objects
ObjectInputStream ois = new ObjectInputStream(clientSocket.getInputStream());
Object obj = ois.readObject(); // Remote Code Execution via gadget chains!`,
      secureCode: `// ✅ SECURE: Use Safe Data Interchange Formats (JSON / Protocol Buffers)
ObjectMapper mapper = new ObjectMapper();
// Strictly serialize only expected typed DTO class:
UserProfile profile = mapper.readValue(jsonStream, UserProfile.class);`,
      defensePoints: [
        'Prefer safe data-only interchange formats such as JSON, Protocol Buffers, or XML with disabled external entities (XXE).',
        'If native object serialization is required, implement type whitelist inspection (e.g. SerialKiller or Look-Ahead ObjectInputStream).',
        'Cryptographically sign serialized payloads with HMAC-SHA256 to prevent tampering.'
      ]
    }
  };

  const currentOwasp = OWASP_DATA[selectedVulnerability];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">SecureCode Lab</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  AppSec &amp; Defensive Coding
                </span>
              </div>
              <span className="text-xs text-slate-400">Software Security, Cryptography &amp; Vulnerability Remediation</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
              >
                Back to BCA Verse
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
          {[
            { id: 'encoder', label: 'Encoding Toolkit', icon: Code2 },
            { id: 'hash-id', label: 'Hash Identifier & Crypto', icon: Lock },
            { id: 'owasp-fixes', label: 'OWASP Top 10 Fixes', icon: Shield },
            { id: 'memory-safety', label: 'C/C++ Memory Safety', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: ENCODING TOOLKIT */}
        {activeTab === 'encoder' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                    <span>Defensive Multi-Format Encoding Toolkit</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time client-side encoding &amp; escaping for Base64, URL, Hex, HTML Entities, and Binary strings.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'base64', label: 'Base64' },
                    { id: 'url', label: 'URL Encode' },
                    { id: 'hex', label: 'Hex (0x)' },
                    { id: 'html', label: 'HTML Entity Escape' },
                    { id: 'binary', label: 'Binary 8-Bit' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setEncodeMode(m.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        encodeMode === m.id
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Input Text / Payload to Encode:</label>
                <textarea
                  rows={3}
                  value={encodeInput}
                  onChange={(e) => setEncodeInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-mono text-cyan-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Encoded Output Area */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Encoded Result ({encodeMode.toUpperCase()}):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(encodedOutput);
                      setCopiedEncode(true);
                      setTimeout(() => setCopiedEncode(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors"
                  >
                    {copiedEncode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEncode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs sm:text-sm text-emerald-300 break-all select-all">
                  {encodedOutput}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HASH IDENTIFIER */}
        {activeTab === 'hash-id' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span>Cryptographic Hash Identifier &amp; Security Analyzer</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detect hash formats (MD5, SHA-1, SHA-256, bcrypt, Argon2) and review collision resilience guidelines.
                </p>
              </div>

              {/* Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Paste Hash String to Analyze:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => setHashInput('e10adc3949ba59abbe56e057f20f883e')}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Sample MD5
                  </button>
                  <button
                    onClick={() => setHashInput('$2b$12$e8NjhW3qvq8lU3r1M6eY/Oh3Vj6lZ3WJ2h8k1e3p8z5v2x9w7k4m1')}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-bold transition-colors cursor-pointer"
                  >
                    Sample bcrypt
                  </button>
                </div>
              </div>

              {/* Analysis Result Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400">Detected Algorithm:</span>
                    <h3 className="text-lg font-bold text-white font-mono">{hashAnalysis.type}</h3>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-extrabold border ${hashAnalysis.statusColor}`}>
                    {hashAnalysis.securityStatus}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold">Bit Length / Output Space:</span>
                    <div className="font-mono text-cyan-300 font-bold">{hashAnalysis.bits}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold">Input Character Count:</span>
                    <div className="font-mono text-white font-bold">{hashInput.trim().length} Characters</div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Cryptographic Threat Analysis:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{hashAnalysis.explanation}</p>
                </div>

                <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Defensive Engineering Recommendation:</span>
                  </span>
                  <p className="text-slate-300">{hashAnalysis.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OWASP TOP 10 REMEDIATION */}
        {activeTab === 'owasp-fixes' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <span>OWASP Top 10 Defensive Code Remediation</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Side-by-side comparison of vulnerable code patterns vs production-ready secure remediations.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'sqli', label: 'SQL Injection' },
                    { id: 'xss', label: 'Cross-Site Scripting (XSS)' },
                    { id: 'cmdi', label: 'Command Injection' },
                    { id: 'path-traversal', label: 'Path Traversal' },
                    { id: 'deserialization', label: 'Insecure Deserialization' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVulnerability(v.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedVulnerability === v.id
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">{currentOwasp.title}</h3>
                <p className="text-xs text-slate-400">{currentOwasp.vulnDesc}</p>
              </div>

              {/* Side-by-side Code Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Vulnerable */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Vulnerable Implementation:</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs font-mono text-rose-200 overflow-x-auto leading-relaxed">
                    {currentOwasp.vulnerableCode}
                  </pre>
                </div>

                {/* Secure */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Secure Remediated Implementation:</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-xs font-mono text-emerald-200 overflow-x-auto leading-relaxed">
                    {currentOwasp.secureCode}
                  </pre>
                </div>
              </div>

              {/* Key Defensive Rules */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-300">Engineering Defense Checklist:</span>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {currentOwasp.defensePoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: C/C++ MEMORY SAFETY */}
        {activeTab === 'memory-safety' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <span>C &amp; C++ Memory Safety &amp; Buffer Overflow Defense</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Guidance for BCA and low-level software engineers to eliminate memory corruption and segmentation faults.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    dangerous: 'gets(buffer)',
                    safe: 'fgets(buffer, sizeof(buffer), stdin)',
                    reason: 'gets() does not check boundary limits, overflowing stack memory. fgets() enforces buffer capacity.'
                  },
                  {
                    dangerous: 'strcpy(dest, src)',
                    safe: 'strncpy(dest, src, sizeof(dest) - 1) or strlcpy',
                    reason: 'strcpy copies until null-byte without knowing destination size. strncpy limits copy length.'
                  },
                  {
                    dangerous: 'sprintf(buf, "%s", input)',
                    safe: 'snprintf(buf, sizeof(buf), "%s", input)',
                    reason: 'sprintf does not bound string size, causing buffer overflows. snprintf limits max characters written.'
                  },
                  {
                    dangerous: 'free(ptr); // dangling pointer',
                    safe: 'free(ptr); ptr = NULL;',
                    reason: 'Assigning NULL after free prevents Dangling Pointer and Use-After-Free (UAF) vulnerabilities.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-rose-400 font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50">
                        ❌ {item.dangerous}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                      <span className="font-mono text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
                        ✅ {item.safe}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed pt-1">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
