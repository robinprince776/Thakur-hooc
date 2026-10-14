import React, { useState, useEffect } from 'react';
import {
  Wrench,
  FileCode2,
  Binary,
  KeyRound,
  Send,
  GitBranch,
  Sliders,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  RefreshCw,
  Hash,
  Database
} from 'lucide-react';
import { DevForgeTab, RegexPatternPreset, PortReference } from '../types';

export const DevForgeApp: React.FC<{
  onSwitchApp?: (appId: string) => void;
}> = ({ onSwitchApp }) => {
  const [activeTab, setActiveTab] = useState<DevForgeTab>('json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // ========================================================
  // 1. JSON STUDIO STATE
  // ========================================================
  const defaultJson = `{
  "developer": "Prince Thakur",
  "project": "DevForge Toolkit",
  "version": "2.4.0",
  "status": "active",
  "stats": {
    "tools": 7,
    "uptime": "99.99%",
    "offline_ready": true
  },
  "tags": ["bca", "cyber", "fullstack", "utilities"]
}`;
  const [jsonInput, setJsonInput] = useState<string>(defaultJson);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonParsed, setJsonParsed] = useState<any>(null);

  useEffect(() => {
    try {
      if (!jsonInput.trim()) {
        setJsonError(null);
        setJsonParsed(null);
        return;
      }
      const parsed = JSON.parse(jsonInput);
      setJsonParsed(parsed);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
      setJsonParsed(null);
    }
  }, [jsonInput]);

  const handleFormatJson = (indent: number = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, indent));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const handleDownloadJson = () => {
    try {
      const blob = new Blob([jsonInput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devforge-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  // ========================================================
  // 2. REGEX SANDBOX STATE
  // ========================================================
  const [regexPattern, setRegexPattern] = useState<string>(
    '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
  );
  const [regexFlags, setRegexFlags] = useState<string>('g');
  const [regexTestText, setRegexTestText] = useState<string>(
    'Contact admin at prince.thakur@example.edu or dev-team@google.com for support. Invalid emails: test@, @domain.com.'
  );

  const regexPresets: RegexPatternPreset[] = [
    {
      id: 'email',
      name: 'Email Address',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      flags: 'g',
      testSample: 'User: rahul@college.ac.in, priya_99@gmail.com, test@example.org',
      description: 'Matches standard RFC-compliant email formats'
    },
    {
      id: 'url',
      name: 'HTTP/HTTPS URLs',
      pattern: 'https?:\\/\\/[\\w\\-\\.]+\\.[a-zA-Z]{2,}(\\/\\S*)?',
      flags: 'g',
      testSample: 'Visit https://github.com/princethakur or http://localhost:3000/api',
      description: 'Matches web URLs with protocol and paths'
    },
    {
      id: 'ipv4',
      name: 'IPv4 Address',
      pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
      flags: 'g',
      testSample: 'Gateway is 192.168.1.1, DNS is 8.8.8.8 and local is 127.0.0.1',
      description: 'Finds dotted-decimal IPv4 addresses'
    },
    {
      id: 'hex',
      name: 'Hex Color Codes',
      pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
      flags: 'g',
      testSample: 'Colors: #06B6D4 cyan, #F43F5E rose, #fff white and #000 black',
      description: 'Matches 3 or 6 digit hex color hashes'
    },
    {
      id: 'phone',
      name: 'Indian Mobile (10-digit)',
      pattern: '\\b[6-9]\\d{9}\\b',
      flags: 'g',
      testSample: 'Call +91 9876543210 or 8123456789. Landline: 011-2345678.',
      description: 'Validates 10-digit Indian cell numbers starting with 6-9'
    }
  ];

  const getRegexMatches = () => {
    try {
      const reg = new RegExp(regexPattern, regexFlags);
      const matches: string[] = [];
      let m;
      if (regexFlags.includes('g')) {
        let match;
        while ((match = reg.exec(regexTestText)) !== null) {
          matches.push(match[0]);
          if (reg.lastIndex === 0) break;
        }
      } else {
        m = reg.exec(regexTestText);
        if (m) matches.push(m[0]);
      }
      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  };

  const { matches: regexMatches, error: regexError } = getRegexMatches();

  // ========================================================
  // 3. CRYPTO & ENCODER LAB
  // ========================================================
  const [cryptoText, setCryptoText] = useState<string>(
    'Prince Thakur - BCA Software Engineer & Cybersecurity Enthusiast'
  );
  const [base64Encoded, setBase64Encoded] = useState<string>('');
  const [base64Decoded, setBase64Decoded] = useState<string>('');
  const [urlEncoded, setUrlEncoded] = useState<string>('');
  const [sha256Hash, setSha256Hash] = useState<string>('');

  useEffect(() => {
    try {
      setBase64Encoded(btoa(cryptoText));
      setUrlEncoded(encodeURIComponent(cryptoText));

      // Calculate SHA-256 via native Web Crypto API
      if (window.crypto?.subtle) {
        const msgBuffer = new TextEncoder().encode(cryptoText);
        window.crypto.subtle.digest('SHA-256', msgBuffer).then((hashBuffer) => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
          setSha256Hash(hashHex);
        });
      }
    } catch (e) {
      // Safe fallback
    }
  }, [cryptoText]);

  const handleBase64Decode = (str: string) => {
    try {
      setBase64Decoded(atob(str));
    } catch (e) {
      setBase64Decoded('Error: Invalid Base64 payload');
    }
  };

  // ========================================================
  // 4. JWT INSPECTOR
  // ========================================================
  const sampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByaW5jZSBUaGFrdXIiLCJyb2xlIjoiU3VwZXJBZG1pbiIsImJjYV9iYXRjaCI6IjIwMjYtMjAyOSIsImlhdCI6MTczOTI4MDAwMCwiZXhwIjoxNzg5Mjg0ODAwfQ.8F2P3mY47Q1xZ4k3a9s5r7L0w2e4r6t8y1u3i5o7p9A';
  const [jwtInput, setJwtInput] = useState<string>(sampleJwt);
  const [jwtHeader, setJwtHeader] = useState<string>('');
  const [jwtPayload, setJwtPayload] = useState<string>('');
  const [jwtStatus, setJwtStatus] = useState<{ isExpired: boolean; expDate: string | null }>({
    isExpired: false,
    expDate: null
  });

  useEffect(() => {
    try {
      const parts = jwtInput.trim().split('.');
      if (parts.length >= 2) {
        const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
        const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const parsedHeader = JSON.parse(headerStr);
        const parsedPayload = JSON.parse(payloadStr);

        setJwtHeader(JSON.stringify(parsedHeader, null, 2));
        setJwtPayload(JSON.stringify(parsedPayload, null, 2));

        if (parsedPayload.exp) {
          const expMs = parsedPayload.exp * 1000;
          const isExpired = Date.now() > expMs;
          const expDate = new Date(expMs).toLocaleString();
          setJwtStatus({ isExpired, expDate });
        } else {
          setJwtStatus({ isExpired: false, expDate: 'No exp claim found' });
        }
      } else {
        setJwtHeader('// Invalid JWT format: Must contain 3 dot-separated segments');
        setJwtPayload('// Header.Payload.Signature');
      }
    } catch (e: any) {
      setJwtHeader('// Decode Error: ' + e.message);
      setJwtPayload('// Please check your token');
    }
  }, [jwtInput]);

  // ========================================================
  // 5. REST API SCRATCHPAD
  // ========================================================
  const [apiUrl, setApiUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts/1');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [apiHeaders, setApiHeaders] = useState<string>(
    '{\n  "Content-Type": "application/json"\n}'
  );
  const [apiBody, setApiBody] = useState<string>(
    '{\n  "title": "Prince Thakur Post",\n  "body": "Built via DevForge Scratchpad",\n  "userId": 1\n}'
  );
  const [apiResponse, setApiResponse] = useState<{
    status: number | null;
    statusText: string;
    durationMs: number | null;
    data: any;
    isLoading: boolean;
  }>({
    status: null,
    statusText: '',
    durationMs: null,
    data: null,
    isLoading: false
  });

  const handleSendApiRequest = async () => {
    setApiResponse((prev) => ({ ...prev, isLoading: true }));
    const startTime = performance.now();
    try {
      let parsedHeaders = {};
      try {
        parsedHeaders = JSON.parse(apiHeaders);
      } catch (e) {
        // ignore
      }

      const options: RequestInit = {
        method: apiMethod,
        headers: parsedHeaders
      };

      if (apiMethod !== 'GET' && apiBody.trim()) {
        options.body = apiBody;
      }

      const res = await fetch(apiUrl, options);
      const endTime = performance.now();
      const contentType = res.headers.get('content-type') || '';
      let resData = null;

      if (contentType.includes('application/json')) {
        resData = await res.json();
      } else {
        resData = await res.text();
      }

      setApiResponse({
        status: res.status,
        statusText: res.statusText || 'OK',
        durationMs: Math.round(endTime - startTime),
        data: resData,
        isLoading: false
      });
    } catch (err: any) {
      const endTime = performance.now();
      setApiResponse({
        status: 0,
        statusText: 'Network / CORS Error',
        durationMs: Math.round(endTime - startTime),
        data: {
          error: err.message,
          hint: 'Note: External domains must allow CORS headers (e.g. JSONPlaceholder supports CORS).'
        },
        isLoading: false
      });
    }
  };

  // ========================================================
  // 6. GIT COMMAND LAB
  // ========================================================
  const [gitBranchName, setGitBranchName] = useState<string>('feature/auth-redesign');
  const [gitCommitMsg, setGitCommitMsg] = useState<string>('feat: implement JWT auth protocol');

  const gitSnippets = [
    {
      title: 'Create & Switch New Branch',
      cmd: `git checkout -b ${gitBranchName || 'feature-branch'}`
    },
    {
      title: 'Stage All & Commit',
      cmd: `git add .\ngit commit -m "${gitCommitMsg || 'update codebase'}"`
    },
    {
      title: 'Undo Last Commit (Keep Changes in Staging)',
      cmd: 'git reset --soft HEAD~1'
    },
    {
      title: 'Undo Last Commit (Discard Everything Dangerously)',
      cmd: 'git reset --hard HEAD~1'
    },
    {
      title: 'Stash Working Directory & Apply Later',
      cmd: 'git stash push -m "WIP work"\ngit stash list\ngit stash pop'
    },
    {
      title: 'Squash Last 3 Commits into One',
      cmd: 'git reset --soft HEAD~3\ngit commit -m "squashed: consolidated updates"'
    },
    {
      title: 'Fetch & Pull with Rebase',
      cmd: 'git pull --rebase origin main'
    },
    {
      title: 'Clean Unstaged Untracked Files',
      cmd: 'git clean -fd'
    }
  ];

  // ========================================================
  // 7. DEV UTILITIES HUB
  // ========================================================
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [convertedDate, setConvertedDate] = useState<string>('');
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const num = parseInt(epochInput, 10);
      if (!isNaN(num)) {
        // If 10 digits -> seconds, if 13 digits -> ms
        const ms = epochInput.length <= 10 ? num * 1000 : num;
        setConvertedDate(new Date(ms).toUTCString() + ' (' + new Date(ms).toLocaleString() + ')');
      } else {
        setConvertedDate('Invalid timestamp');
      }
    } catch {
      setConvertedDate('Invalid timestamp');
    }
  }, [epochInput]);

  const generateUuidV4 = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      setGeneratedUuids((prev) => [crypto.randomUUID(), ...prev.slice(0, 4)]);
    } else {
      const u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      setGeneratedUuids((prev) => [u, ...prev.slice(0, 4)]);
    }
  };

  const generateStrongPassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';
    let pwd = '';
    for (let i = 0; i < 20; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pwd);
  };

  const portReferences: PortReference[] = [
    { port: 22, protocol: 'TCP', service: 'SSH', description: 'Secure Shell remote terminal access', risk: 'High' },
    { port: 80, protocol: 'TCP', service: 'HTTP', description: 'Unencrypted Web Traffic', risk: 'Medium' },
    { port: 443, protocol: 'TCP', service: 'HTTPS', description: 'TLS/SSL Encrypted Web Traffic', risk: 'Low' },
    { port: 3306, protocol: 'TCP', service: 'MySQL', description: 'MySQL / MariaDB Database Server', risk: 'High' },
    { port: 5432, protocol: 'TCP', service: 'PostgreSQL', description: 'PostgreSQL Relational DB', risk: 'High' },
    { port: 6379, protocol: 'TCP', service: 'Redis', description: 'Redis In-Memory Key-Value Cache', risk: 'High' },
    { port: 27017, protocol: 'TCP', service: 'MongoDB', description: 'MongoDB NoSQL Document Store', risk: 'High' },
    { port: 8080, protocol: 'TCP', service: 'HTTP-Alt', description: 'Alternative Web / Dev Server (Spring/Tomcat/Vite)', risk: 'Low' }
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-[#070B14]/90 backdrop-blur-xl border-b border-indigo-500/20 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-white font-mono">
                    DevForge
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 uppercase">
                    v2.4 Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Developer Swiss-Army Knife · Made by Prince Thakur
                </p>
              </div>
            </div>

            {/* Switch to Other Apps */}
            <div className="flex items-center gap-2">
              {onSwitchApp && (
                <button
                  onClick={() => onSwitchApp('switcher')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-xs text-indigo-300 border border-indigo-700/50 transition-all cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Suite Apps</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 border-t border-slate-800/60 scrollbar-none">
            {[
              { id: 'json' as DevForgeTab, label: 'JSON Studio', icon: FileCode2 },
              { id: 'regex' as DevForgeTab, label: 'Regex Sandbox', icon: Code2 },
              { id: 'crypto' as DevForgeTab, label: 'Encoder & Hashes', icon: Binary },
              { id: 'jwt' as DevForgeTab, label: 'JWT Debugger', icon: KeyRound },
              { id: 'api' as DevForgeTab, label: 'REST Scratchpad', icon: Send },
              { id: 'git' as DevForgeTab, label: 'Git Lab', icon: GitBranch },
              { id: 'utils' as DevForgeTab, label: 'Dev Utilities', icon: Sliders }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: JSON STUDIO */}
        {/* ======================================================== */}
        {activeTab === 'json' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D1322] p-4 rounded-2xl border border-slate-800 shadow-md">
              <div>
                <h2 className="text-base font-bold text-indigo-300 flex items-center gap-2 font-mono">
                  <FileCode2 className="w-5 h-5 text-indigo-400" /> JSON Studio & Validator
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Format, minify, validate syntax, and inspect JSON with instantaneous feedback.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleFormatJson(2)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-semibold cursor-pointer transition-all"
                >
                  Format (2 Spaces)
                </button>
                <button
                  onClick={handleMinifyJson}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-all"
                >
                  Minify
                </button>
                <button
                  onClick={() => copyToClipboard(jsonInput, 'json')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'json' ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" /> Save .json
                </button>
              </div>
            </div>

            {/* Validation Banner */}
            {jsonError ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>JSON Syntax Error: {jsonError}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>JSON Syntax 100% Valid · Ready for API consumption</span>
              </div>
            )}

            {/* Editor & Preview Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-[#0E1528] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Input JSON Editor</span>
                  <span>{jsonInput.length} chars</span>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste or write raw JSON here..."
                  className="w-full h-96 p-4 bg-transparent text-slate-100 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              <div className="flex flex-col rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-[#0E1528] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Parsed Tree / Schema Inspector</span>
                  <span>{jsonParsed ? `${Object.keys(jsonParsed).length} Root Keys` : 'No payload'}</span>
                </div>
                <div className="p-4 h-96 overflow-y-auto font-mono text-xs">
                  {jsonParsed ? (
                    <pre className="text-cyan-300 leading-relaxed whitespace-pre-wrap">
                      {JSON.stringify(jsonParsed, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                      Fix JSON syntax errors to see parsed tree preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: REGEX SANDBOX */}
        {/* ======================================================== */}
        {activeTab === 'regex' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#0D1322] p-4 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2 font-mono">
                <Code2 className="w-5 h-5 text-cyan-400" /> Regular Expression (Regex) Sandbox
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Test regex patterns live against sample strings with instant highlight and capture results.
              </p>

              {/* Preset Pattern Chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-500 self-center">Presets:</span>
                {regexPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setRegexPattern(preset.pattern);
                      setRegexFlags(preset.flags);
                      setRegexTestText(preset.testSample);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-all cursor-pointer"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Input Box */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#090E1A] p-4 rounded-2xl border border-slate-800">
              <div className="flex-1 flex items-center gap-2 bg-[#0E1528] px-3 py-2 rounded-xl border border-slate-700">
                <span className="text-cyan-400 font-mono text-sm font-bold">/</span>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  placeholder="e.g. [a-zA-Z0-9]+"
                  className="w-full bg-transparent text-cyan-300 font-mono text-sm focus:outline-none"
                />
                <span className="text-cyan-400 font-mono text-sm font-bold">/</span>
              </div>
              <div className="flex items-center gap-2 bg-[#0E1528] px-3 py-2 rounded-xl border border-slate-700 sm:w-32">
                <span className="text-xs text-slate-400 font-mono">Flags:</span>
                <input
                  type="text"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  placeholder="g, i, m"
                  className="w-full bg-transparent text-slate-200 font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            {regexError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Invalid Regular Expression: {regexError}</span>
              </div>
            )}

            {/* Test String and Match Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-[#0E1528] border-b border-slate-800 text-xs font-mono text-slate-400">
                  Test String Target
                </div>
                <textarea
                  value={regexTestText}
                  onChange={(e) => setRegexTestText(e.target.value)}
                  className="w-full h-64 p-4 bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-4 py-2 bg-[#0E1528] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Match Results</span>
                  <span className="text-emerald-400 font-bold">{regexMatches.length} Matches Found</span>
                </div>
                <div className="p-4 h-64 overflow-y-auto space-y-2">
                  {regexMatches.length > 0 ? (
                    regexMatches.map((match, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 font-mono text-xs"
                      >
                        <span className="text-cyan-300">
                          #{i + 1}: <span className="text-white font-bold">{match}</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(match, `match-${i}`)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                        >
                          {copiedKey === `match-${i}` ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                      No matches found with current pattern
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ENCODER & HASH LAB */}
        {/* ======================================================== */}
        {activeTab === 'crypto' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#0D1322] p-4 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-base font-bold text-violet-300 flex items-center gap-2 font-mono">
                <Binary className="w-5 h-5 text-violet-400" /> Encoder / Decoder & Cryptographic Hashes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Convert strings into Base64, URL encoded format, and generate real-time SHA-256 cryptographic hashes.
              </p>
            </div>

            {/* Source Input */}
            <div className="bg-[#090E1A] p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Input String for Encoding / Hashing:
              </label>
              <textarea
                value={cryptoText}
                onChange={(e) => setCryptoText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-[#0E1528] border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Generated Encodings and Hashes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Base64 Output */}
              <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 font-mono">Base64 Encoded</span>
                  <button
                    onClick={() => copyToClipboard(base64Encoded, 'b64')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'b64' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0E1528] border border-slate-800 font-mono text-xs text-indigo-200 break-all select-all">
                  {base64Encoded || 'None'}
                </div>
              </div>

              {/* SHA-256 Hash */}
              <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-mono">SHA-256 Hash</span>
                  <button
                    onClick={() => copyToClipboard(sha256Hash, 'sha256')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'sha256' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0E1528] border border-slate-800 font-mono text-xs text-cyan-200 break-all select-all">
                  {sha256Hash || 'Computing...'}
                </div>
              </div>

              {/* URL Encoded */}
              <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 font-mono">URL Encoded (%-Hex)</span>
                  <button
                    onClick={() => copyToClipboard(urlEncoded, 'url')}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0E1528] border border-slate-800 font-mono text-xs text-amber-200 break-all select-all">
                  {urlEncoded || 'None'}
                </div>
              </div>

              {/* Base64 Decode Tester */}
              <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 font-mono">Base64 Decoder (Reverse)</span>
                  <button
                    onClick={() => handleBase64Decode(base64Encoded)}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Decode Current Base64
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0E1528] border border-slate-800 font-mono text-xs text-emerald-200 break-all">
                  {base64Decoded || 'Click decode or test with encoded payload above'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: JWT INSPECTOR */}
        {/* ======================================================== */}
        {activeTab === 'jwt' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#0D1322] p-4 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-base font-bold text-pink-300 flex items-center gap-2 font-mono">
                <KeyRound className="w-5 h-5 text-pink-400" /> JSON Web Token (JWT) Inspector
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste any standard JWT to decode its Header, Claims Payload, and verify token expiration timestamp.
              </p>
            </div>

            {/* Token Input */}
            <div className="bg-[#090E1A] p-4 rounded-2xl border border-slate-800">
              <label className="block text-xs font-mono text-slate-400 mb-2">Raw Encoded JWT:</label>
              <textarea
                value={jwtInput}
                onChange={(e) => setJwtInput(e.target.value)}
                rows={3}
                placeholder="eyJhbGciOi..."
                className="w-full p-3 rounded-xl bg-[#0E1528] border border-slate-700 text-pink-300 font-mono text-xs focus:outline-none"
              />
            </div>

            {/* Expiration Status Pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0D1322] border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Token Expiration Status:</span>
              {jwtStatus.isExpired ? (
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Expired on {jwtStatus.expDate}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Active / Valid until {jwtStatus.expDate}
                </span>
              )}
            </div>

            {/* Decoded Header and Payload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden">
                <div className="px-4 py-2 bg-rose-950/40 border-b border-rose-900/40 text-xs font-mono font-bold text-rose-300">
                  Decoded Header (Algorithm & Token Type)
                </div>
                <pre className="p-4 text-xs font-mono text-rose-200 overflow-x-auto whitespace-pre-wrap">
                  {jwtHeader}
                </pre>
              </div>

              <div className="rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden">
                <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-900/40 text-xs font-mono font-bold text-indigo-300">
                  Decoded Payload (Claims & User Identity)
                </div>
                <pre className="p-4 text-xs font-mono text-indigo-200 overflow-x-auto whitespace-pre-wrap">
                  {jwtPayload}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: REST API SCRATCHPAD */}
        {/* ======================================================== */}
        {activeTab === 'api' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#0D1322] p-4 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-base font-bold text-emerald-300 flex items-center gap-2 font-mono">
                <Send className="w-5 h-5 text-emerald-400" /> REST API Client Scratchpad
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Send live HTTP requests, test backend endpoints, inspect status codes, and measure API response times.
              </p>
            </div>

            {/* URL & Method Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-[#090E1A] p-4 rounded-2xl border border-slate-800">
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#0E1528] border border-slate-700 text-xs font-mono font-bold text-emerald-400 focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1 px-3 py-2 rounded-xl bg-[#0E1528] border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendApiRequest}
                disabled={apiResponse.isLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950"
              >
                {apiResponse.isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send Request</span>
              </button>
            </div>

            {/* Request Body & Headers */}
            {apiMethod !== 'GET' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden">
                  <div className="px-4 py-2 bg-[#0E1528] border-b border-slate-800 text-xs font-mono text-slate-400">
                    Request Headers (JSON)
                  </div>
                  <textarea
                    value={apiHeaders}
                    onChange={(e) => setApiHeaders(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-transparent text-slate-200 font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden">
                  <div className="px-4 py-2 bg-[#0E1528] border-b border-slate-800 text-xs font-mono text-slate-400">
                    Request Body (JSON)
                  </div>
                  <textarea
                    value={apiBody}
                    onChange={(e) => setApiBody(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-transparent text-slate-200 font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Response Viewer */}
            <div className="rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 bg-[#0E1528] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Response Data</span>
                {apiResponse.status !== null && (
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        apiResponse.status >= 200 && apiResponse.status < 300
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-rose-950 text-rose-300 border border-rose-700'
                      }`}
                    >
                      {apiResponse.status} {apiResponse.statusText}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {apiResponse.durationMs}ms
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 max-h-96 overflow-y-auto font-mono text-xs">
                {apiResponse.data ? (
                  <pre className="text-emerald-300 leading-relaxed whitespace-pre-wrap">
                    {typeof apiResponse.data === 'object'
                      ? JSON.stringify(apiResponse.data, null, 2)
                      : String(apiResponse.data)}
                  </pre>
                ) : (
                  <div className="text-slate-500 py-8 text-center">
                    Hit 'Send Request' to inspect API server output
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: GIT COMMAND LAB */}
        {/* ======================================================== */}
        {activeTab === 'git' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#0D1322] p-4 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-base font-bold text-amber-300 flex items-center gap-2 font-mono">
                <GitBranch className="w-5 h-5 text-amber-400" /> Git Command Lab & Everyday Cheatsheet
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Fast interactive git commands generator for branching, soft/hard resets, stashing, and commit fixes.
              </p>

              {/* Customizer Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Target Branch Name:
                  </label>
                  <input
                    type="text"
                    value={gitBranchName}
                    onChange={(e) => setGitBranchName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#0E1528] border border-slate-700 text-xs font-mono text-amber-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Commit Message:
                  </label>
                  <input
                    type="text"
                    value={gitCommitMsg}
                    onChange={(e) => setGitCommitMsg(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#0E1528] border border-slate-700 text-xs font-mono text-amber-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Command Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gitSnippets.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 font-mono">{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.cmd, `git-${idx}`)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `git-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === `git-${idx}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#0E1528] border border-slate-800 text-amber-200 font-mono text-xs overflow-x-auto whitespace-pre">
                    {item.cmd}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: DEV UTILITIES (EPOCH, UUID, PORTS) */}
        {/* ======================================================== */}
        {activeTab === 'utils' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0D1322] p-4 rounded-2xl border border-slate-800 shadow-md">
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2 font-mono">
                <Sliders className="w-5 h-5 text-cyan-400" /> Dev Utilities & Network Port Database
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Live Unix epoch timestamp converter, UUID v4 generator, strong password generator, and port reference table.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Epoch Converter */}
              <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Unix Epoch Converter
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Live: {currentEpoch}</span>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-500 block mb-1">
                    Timestamp (Seconds or MS):
                  </label>
                  <input
                    type="text"
                    value={epochInput}
                    onChange={(e) => setEpochInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#0E1528] border border-slate-700 text-xs font-mono text-indigo-200 focus:outline-none"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-[#0E1528] border border-slate-800 font-mono text-[11px] text-slate-300">
                  {convertedDate}
                </div>
              </div>

              {/* UUID v4 Generator */}
              <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> UUID v4 Generator
                  </span>
                  <button
                    onClick={generateUuidV4}
                    className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold cursor-pointer hover:bg-cyan-900"
                  >
                    + Generate
                  </button>
                </div>
                <div className="space-y-1.5">
                  {generatedUuids.length > 0 ? (
                    generatedUuids.map((u, i) => (
                      <div
                        key={i}
                        onClick={() => copyToClipboard(u, `uuid-${i}`)}
                        className="p-1.5 rounded bg-[#0E1528] text-[11px] font-mono text-cyan-200 border border-slate-800 truncate cursor-pointer hover:border-cyan-600 flex justify-between"
                      >
                        <span className="truncate">{u}</span>
                        <span className="text-[9px] text-slate-500 shrink-0 ml-1">
                          {copiedKey === `uuid-${i}` ? 'Copied' : 'Copy'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-500 py-4 text-center">
                      Click '+ Generate' to create UUIDs
                    </div>
                  )}
                </div>
              </div>

              {/* Password Generator */}
              <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 20-Char Secret Key
                  </span>
                  <button
                    onClick={generateStrongPassword}
                    className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold cursor-pointer hover:bg-emerald-900"
                  >
                    Generate
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0E1528] border border-slate-800 font-mono text-xs text-emerald-200 break-all select-all">
                  {generatedPassword || 'Click Generate for high-entropy secret'}
                </div>
                {generatedPassword && (
                  <button
                    onClick={() => copyToClipboard(generatedPassword, 'pwd')}
                    className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    {copiedKey === 'pwd' ? 'Copied Secret' : 'Copy Secret'}
                  </button>
                )}
              </div>
            </div>

            {/* Well-known Ports Table */}
            <div className="rounded-2xl bg-[#090E1A] border border-slate-800 overflow-hidden shadow-inner">
              <div className="px-4 py-3 bg-[#0E1528] border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" /> Standard Network Ports & Services Reference
                </span>
                <span className="text-[11px] text-slate-500 font-mono">TCP / UDP Protocols</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0A1020] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Port</th>
                      <th className="p-3">Protocol</th>
                      <th className="p-3">Service</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Default Exposure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {portReferences.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3 font-bold text-indigo-300">{p.port}</td>
                        <td className="p-3 text-slate-400">{p.protocol}</td>
                        <td className="p-3 font-semibold text-white">{p.service}</td>
                        <td className="p-3 text-slate-400 text-[11px]">{p.description}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.risk === 'High'
                                ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                                : p.risk === 'Medium'
                                ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                                : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                            }`}
                          >
                            {p.risk} Risk
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070B14] py-3 text-center text-[11px] text-slate-500 font-mono">
        DevForge Toolkit · Part of the 7-Apps Suite · Built for Developers & BCA Students
      </footer>
    </div>
  );
};
