import React, { useState, useMemo } from 'react';
import {
  Shield,
  Lock,
  Key,
  Hash,
  Code2,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Search,
  BookOpen,
  ArrowRight,
  Upload,
  Layers,
  Terminal,
  Activity,
  Award,
  Eye,
  EyeOff,
  Sliders,
  AlertCircle
} from 'lucide-react';

export interface SentinelLabAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

// Pure JS MD5 Implementation for browser Web Crypto fallback
function md5(inputString: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRol(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function binlMD5(x: number[], len: number): number[] {
    x[len >> 5] |= 0x80 << len % 32;
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;

      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function rstr2binl(input: string): number[] {
    const output: number[] = [];
    for (let i = 0; i < input.length * 8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;
    }
    return output;
  }
  function binl2hex(binarray: number[]): string {
    const hexTab = '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++) {
      str +=
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0x0f) +
        hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0x0f);
    }
    return str;
  }
  return binl2hex(binlMD5(rstr2binl(unescape(encodeURIComponent(inputString))), unescape(encodeURIComponent(inputString)).length * 8));
}

export const SentinelLabApp: React.FC<SentinelLabAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher
}) => {
  const [activeTab, setActiveTab] = useState<
    'password-strength' | 'password-gen' | 'hashes' | 'encoder' | 'headers' | 'log-analyzer' | 'phishing' | 'owasp' | 'mitre'
  >('password-strength');

  // 1. Password Strength Analyzer State
  const [testPassword, setTestPassword] = useState('SuperSecret@Pass2026!');
  const [showPassword, setShowPassword] = useState(false);

  // 2. Password Generator State
  const [genMode, setGenMode] = useState<'random' | 'passphrase'>('random');
  const [genLength, setGenLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeDigits, setIncludeDigits] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passphraseWords, setPassphraseWords] = useState(4);
  const [passphraseSep, setPassphraseSep] = useState('-');
  const [generatedPass, setGeneratedPass] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  // 3. Hash Generator State
  const [hashInput, setHashInput] = useState('The quick brown fox jumps over the lazy dog');
  const [calculatedHashes, setCalculatedHashes] = useState<Record<string, string>>({});
  const [hashVerifyExpected, setHashVerifyExpected] = useState('');
  const [copiedHashKey, setCopiedHashKey] = useState<string | null>(null);

  // 4. Encoding state
  const [encodeInput, setEncodeInput] = useState('SentinelLab: Blue Team Defense');
  const [encodeFormat, setEncodeFormat] = useState<'base64' | 'hex' | 'url' | 'html' | 'rot13' | 'binary'>('base64');
  const [encodeAction, setEncodeAction] = useState<'encode' | 'decode'>('encode');
  const [copiedEncoded, setCopiedEncoded] = useState(false);

  // 5. Log Analyzer State
  const sampleLog = `192.168.1.105 - - [16/Oct/2026:04:12:01 +0000] "GET /index.html HTTP/1.1" 200 4520 "-" "Mozilla/5.0"
45.33.32.156 - - [16/Oct/2026:04:12:15 +0000] "GET /wp-admin/setup-config.php HTTP/1.1" 404 182 "-" "sqlmap/1.7"
45.33.32.156 - - [16/Oct/2026:04:12:16 +0000] "GET /login?user=admin' OR '1'='1 HTTP/1.1" 403 210 "-" "curl/7.68.0"
103.21.244.2 - - [16/Oct/2026:04:13:02 +0000] "GET /../../../../etc/passwd HTTP/1.1" 400 150 "-" "DirBuster"
192.168.1.105 - - [16/Oct/2026:04:13:40 +0000] "POST /api/v1/login HTTP/1.1" 200 120 "-" "Mozilla/5.0"
198.51.100.44 - - [16/Oct/2026:04:14:10 +0000] "GET /.env HTTP/1.1" 404 182 "-" "python-requests/2.28"
198.51.100.44 - - [16/Oct/2026:04:14:11 +0000] "GET /.git/config HTTP/1.1" 404 182 "-" "python-requests/2.28"
198.51.100.44 - - [16/Oct/2026:04:14:12 +0000] "GET /phpmyadmin/index.php HTTP/1.1" 404 182 "-" "python-requests/2.28"`;
  const [logInput, setLogInput] = useState(sampleLog);

  // 6. Phishing Simulator State
  const [phishIndex, setPhishIndex] = useState(0);
  const [phishAnswers, setPhishAnswers] = useState<Record<number, boolean>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  // 7. OWASP filter
  const [owaspSearch, setOwaspSearch] = useState('');

  // Password Entropy & Strength Math (NIST Guidelines)
  const passwordStats = useMemo(() => {
    const pwd = testPassword;
    const len = pwd.length;
    let poolSize = 0;
    if (/[a-z]/.test(pwd)) poolSize += 26;
    if (/[A-Z]/.test(pwd)) poolSize += 26;
    if (/[0-9]/.test(pwd)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 33;

    if (len === 0 || poolSize === 0) {
      return {
        entropy: 0,
        score: 0,
        rating: 'Empty',
        crackTimeOnline: 'Instant',
        crackTimeOffline: 'Instant',
        color: 'text-slate-500 bg-slate-900 border-slate-800',
        tips: ['Enter a password to evaluate strength']
      };
    }

    // Shannon Entropy formula: H = L * log2(R)
    const entropy = Math.round(len * Math.log2(poolSize));
    let score = 1;
    let rating = 'Very Weak';
    let color = 'text-rose-400 bg-rose-950/40 border-rose-800';

    if (entropy >= 80 && len >= 14) {
      score = 4;
      rating = 'Very Strong';
      color = 'text-emerald-400 bg-emerald-950/40 border-emerald-800';
    } else if (entropy >= 60 && len >= 12) {
      score = 3;
      rating = 'Strong';
      color = 'text-teal-400 bg-teal-950/40 border-teal-800';
    } else if (entropy >= 45 && len >= 8) {
      score = 2;
      rating = 'Moderate';
      color = 'text-amber-400 bg-amber-950/40 border-amber-800';
    }

    // Brute force calculation: total combinations = R^L
    // Offline cluster: 10^10 (10 Billion) hashes/sec
    // Online rate-limited: 100 attempts/sec
    const totalCombinations = Math.pow(poolSize, Math.min(len, 18));
    const secondsOffline = totalCombinations / 1e10;
    const secondsOnline = totalCombinations / 100;

    const formatTime = (sec: number) => {
      if (sec < 1) return 'Less than 1 second';
      if (sec < 60) return `${Math.round(sec)} seconds`;
      if (sec < 3600) return `${Math.round(sec / 60)} minutes`;
      if (sec < 86400) return `${Math.round(sec / 3600)} hours`;
      if (sec < 31536000) return `${Math.round(sec / 86400)} days`;
      if (sec < 3153600000) return `${Math.round(sec / 31536000)} years`;
      if (sec < 315360000000) return `${Math.round(sec / 3153600000)} centuries`;
      return 'Millions of years (Astronomical)';
    };

    const tips: string[] = [];
    if (len < 12) tips.push('NIST recommends minimum 12-16 characters length.');
    if (!/[A-Z]/.test(pwd)) tips.push('Add uppercase characters (A-Z).');
    if (!/[0-9]/.test(pwd)) tips.push('Include numbers (0-9).');
    if (!/[^a-zA-Z0-9]/.test(pwd)) tips.push('Add symbols (@, #, $, %, etc.).');
    if (/password|admin|123456|qwerty/i.test(pwd)) tips.push('Common dictionary pattern detected!');

    return {
      entropy,
      score,
      rating,
      crackTimeOnline: formatTime(secondsOnline),
      crackTimeOffline: formatTime(secondsOffline),
      color,
      tips: tips.length > 0 ? tips : ['Excellent NIST compliant password! High entropy protects against offline hash cracking.']
    };
  }, [testPassword]);

  // Generate Cryptographically Random Password
  const handleGeneratePassword = () => {
    if (genMode === 'passphrase') {
      const words = [
        'apple', 'river', 'galaxy', 'quantum', 'forest', 'shield', 'cipher', 'horizon',
        'falcon', 'beacon', 'ember', 'granite', 'orbit', 'matrix', 'crystal', 'vector',
        'anchor', 'canyon', 'shadow', 'nebula', 'glacier', 'phoenix', 'sentinel', 'summit'
      ];
      const selected: string[] = [];
      const array = new Uint32Array(passphraseWords);
      crypto.getRandomValues(array);
      for (let i = 0; i < passphraseWords; i++) {
        selected.push(words[array[i] % words.length]);
      }
      setGeneratedPass(selected.join(passphraseSep));
      return;
    }

    let charset = '';
    if (includeLower) charset += 'abcdefghjkmnpqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (includeDigits) charset += '23456789';
    if (includeSymbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    const array = new Uint32Array(genLength);
    crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < genLength; i++) {
      result += charset[array[i] % charset.length];
    }
    setGeneratedPass(result);
  };

  // Generate Hashes using Web Crypto API + pure MD5
  React.useEffect(() => {
    const compute = async () => {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);

      // Web Crypto SHA-1, SHA-256, SHA-512
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);

      const toHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      setCalculatedHashes({
        MD5: md5(hashInput),
        'SHA-1': toHex(sha1Buffer),
        'SHA-256': toHex(sha256Buffer),
        'SHA-512': toHex(sha512Buffer)
      });
    };
    compute();
  }, [hashInput]);

  // File Checksum Generator
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        const hashBuf = await crypto.subtle.digest('SHA-256', buffer);
        const hex = Array.from(new Uint8Array(hashBuf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
        setCalculatedHashes((prev) => ({
          ...prev,
          [`File (${file.name}) SHA-256`]: hex
        }));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Encoding & Decoding Engine
  const encodedText = useMemo(() => {
    try {
      if (encodeAction === 'encode') {
        if (encodeFormat === 'base64') return btoa(unescape(encodeURIComponent(encodeInput)));
        if (encodeFormat === 'hex')
          return Array.from(encodeInput)
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join(' ');
        if (encodeFormat === 'url') return encodeURIComponent(encodeInput);
        if (encodeFormat === 'html')
          return encodeInput
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        if (encodeFormat === 'rot13')
          return encodeInput.replace(/[a-zA-Z]/g, (ch) => {
            const code = ch.charCodeAt(0);
            const base = code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + 13) % 26) + base);
          });
        if (encodeFormat === 'binary')
          return Array.from(encodeInput)
            .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
            .join(' ');
      } else {
        // Decode
        if (encodeFormat === 'base64') return decodeURIComponent(escape(atob(encodeInput.trim())));
        if (encodeFormat === 'hex') {
          const cleanHex = encodeInput.replace(/\s+/g, '');
          let str = '';
          for (let i = 0; i < cleanHex.length; i += 2) {
            str += String.fromCharCode(parseInt(cleanHex.substring(i, i + 2), 16));
          }
          return str;
        }
        if (encodeFormat === 'url') return decodeURIComponent(encodeInput);
        if (encodeFormat === 'html') {
          const doc = new DOMParser().parseFromString(encodeInput, 'text/html');
          return doc.documentElement.textContent || '';
        }
        if (encodeFormat === 'rot13')
          return encodeInput.replace(/[a-zA-Z]/g, (ch) => {
            const code = ch.charCodeAt(0);
            const base = code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + 13) % 26) + base);
          });
        if (encodeFormat === 'binary') {
          const clean = encodeInput.trim().split(/\s+/);
          return clean.map((bin) => String.fromCharCode(parseInt(bin, 2))).join('');
        }
      }
      return encodeInput;
    } catch {
      return 'Syntax / Decoding Error: Input string is not valid format.';
    }
  }, [encodeInput, encodeFormat, encodeAction]);

  // Log Analyzer Detection Patterns (Pure Regex)
  const logAnalysisResults = useMemo(() => {
    const lines = logInput.split('\n').filter((l) => l.trim().length > 0);
    const alerts: {
      type: string;
      severity: 'High' | 'Medium' | 'Low';
      ip: string;
      line: string;
      explanation: string;
      mitigation: string;
    }[] = [];

    const stats = {
      totalLines: lines.length,
      status200: 0,
      status404: 0,
      status403: 0,
      status500: 0,
      uniqueIps: new Set<string>()
    };

    lines.forEach((line) => {
      const ipMatch = line.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
      const ip = ipMatch ? ipMatch[1] : 'Unknown IP';
      if (ipMatch) stats.uniqueIps.add(ip);

      if (line.includes(' 200 ')) stats.status200++;
      if (line.includes(' 404 ')) stats.status404++;
      if (line.includes(' 403 ')) stats.status403++;
      if (line.includes(' 500 ')) stats.status500++;

      // SQL Injection Detection
      if (/('|\%27).*(\bOR\b|\bUNION\b|\bSELECT\b|--|#)/i.test(line)) {
        alerts.push({
          type: 'SQL Injection Signature Probe',
          severity: 'High',
          ip,
          line,
          explanation: 'SQL syntax keywords (OR 1=1, UNION, SELECT) detected in URL request parameters.',
          mitigation: 'Enforce parameterized queries (PreparedStatements) and configure WAF SQLi filter rules.'
        });
      }

      // Path Traversal
      if (/(\.\.\/|\.\.\\|etc\/passwd|boot\.ini)/i.test(line)) {
        alerts.push({
          type: 'Directory Path Traversal Attempt',
          severity: 'High',
          ip,
          line,
          explanation: 'Relative path navigation (../) targeting sensitive operating system files detected.',
          mitigation: 'Implement path canonicalization and reject path separator characters in URL parameters.'
        });
      }

      // Sensitive File Enumeration
      if (/(\.env|\.git|\.aws|wp-config\.php|phpmyadmin)/i.test(line)) {
        alerts.push({
          type: 'Configuration & Secret Reconnaissance',
          severity: 'Medium',
          ip,
          line,
          explanation: 'Automated crawler scanning for unexposed secrets (.env, .git) or admin consoles.',
          mitigation: 'Restrict access to dotfiles in Nginx/Apache configuration (deny all on hidden files).'
        });
      }

      // Automated scanner tools
      if (/(sqlmap|DirBuster|Nikto|Nmap|masscan|curl|python-requests)/i.test(line)) {
        alerts.push({
          type: 'Automated Security Scanner User-Agent',
          severity: 'Low',
          ip,
          line,
          explanation: 'Known automated testing/crawler user-agent string detected in access log.',
          mitigation: 'Monitor IP activity, deploy rate-limiting, and enforce bot detection challenges.'
        });
      }
    });

    return { alerts, stats };
  }, [logInput]);

  // Phishing Simulator Questions
  const PHISHING_SCENARIOS = [
    {
      id: 1,
      sender: 'security-alert@micros0ft-support.co',
      subject: 'URGENT: Your Office 365 Password Expires in 2 Hours',
      body: 'Dear Employee, your organizational account password will expire today. Click here immediately to keep your current password: http://login-microsoft365-verify.com/auth',
      isPhishing: true,
      redFlags: [
        'Spoofed Domain: micros0ft-support.co uses zero (0) instead of letter O (typosquatting).',
        'Artificial Urgency: Threatening account suspension in 2 hours forces hasty action.',
        'Mismatched URL: Link leads to an external unverified domain (login-microsoft365-verify.com) instead of login.microsoftonline.com.',
        'Generic Greeting: "Dear Employee" instead of user specific corporate name.'
      ]
    },
    {
      id: 2,
      sender: 'notifications@github.com',
      subject: '[GitHub] Successful SSH Key Upload on your account',
      body: 'Hey dev-user, an SSH public key (SHA256:abc123xyz) was added to your account. If you did this, you can safely ignore this email. Review keys in your settings: https://github.com/settings/keys',
      isPhishing: false,
      redFlags: [
        'Authentic Domain: Sent from verified @github.com with valid SPF and DKIM signatures.',
        'No Artificial Pressure: Clearly states "If you did this, ignore this email".',
        'Legitimate URL: Direct link to official https://github.com/settings/keys.',
        'Informational only: Does not request re-entering your password.'
      ]
    },
    {
      id: 3,
      sender: 'hr-payroll@yourcompany-intranet.net',
      subject: 'Updated 2026 Diwali Bonus & Appraisal List (Confidential.pdf.exe)',
      body: 'Please find attached the revised bonus disbursement list for Q3. Double click the file to view your personalized CTC breakdown.',
      isPhishing: true,
      redFlags: [
        'Double Extension: "Confidential.pdf.exe" disguises an executable binary as a PDF document.',
        'Emotional Bait: High-value bonus promise tricks victims into bypassing safety caution.',
        'Execution Request: Legitimate HR portals never distribute executable binaries (.exe).'
      ]
    },
    {
      id: 4,
      sender: 'billing@netflix-account-verify.info',
      subject: 'Payment declined - Update card to avoid immediate termination',
      body: 'We were unable to process your monthly subscription fee. Update credit card immediately at http://update-netflix-billing.info',
      isPhishing: true,
      redFlags: [
        'Non-official Top Level Domain (.info) instead of netflix.com.',
        'Unsecured HTTP hyperlink without TLS encryption.',
        'Urgent threat of immediate termination.'
      ]
    }
  ];

  const currentPhish = PHISHING_SCENARIOS[phishIndex];

  // OWASP Top 10 Reference Data
  const OWASP_TOP10 = [
    {
      code: 'A01:2021',
      title: 'Broken Access Control',
      summary: 'Users can act outside of their intended permissions (Horizontal & Vertical privilege escalation).',
      example: 'User A changes URL parameter from /account?id=101 to /account?id=102 and views User B\'s confidential balance.',
      defense: 'Enforce server-side authorization checks on every request. Deny access by default (Principle of Least Privilege).'
    },
    {
      code: 'A02:2021',
      title: 'Cryptographic Failures',
      summary: 'Exposure of sensitive data in transit or rest due to broken or weak cryptographic algorithms.',
      example: 'Storing passwords in unsalted MD5 or transmitting credit card numbers over plaintext HTTP.',
      defense: 'Enforce TLS 1.3 in transit. Use modern salted adaptive algorithms (Argon2id, bcrypt) for passwords and AES-256-GCM for data at rest.'
    },
    {
      code: 'A03:2021',
      title: 'Injection (SQL, NoSQL, OS Command)',
      summary: 'Hostile data sent to an interpreter as part of a command or query tricks interpreter into executing unintended commands.',
      example: 'Entering \' OR 1=1 -- into a login username box to bypass authentication without a password.',
      defense: 'Always use Parameterized Queries (PreparedStatements), ORMs, and strict regex input whitelisting.'
    },
    {
      code: 'A04:2021',
      title: 'Insecure Design',
      summary: 'Flaws and architectural omissions that cannot be fixed by a perfect implementation because design itself is flawed.',
      example: 'An e-commerce app allowing negative quantities (-5 items) to receive a store credit refund.',
      defense: 'Perform threat modeling (STRIDE) during architecture phase. Implement secure design patterns and business logic validation.'
    },
    {
      code: 'A05:2021',
      title: 'Security Misconfiguration',
      summary: 'Default credentials, unpatched flaws, open cloud storage buckets, verbose error stack traces enabled in production.',
      example: 'Leaving default admin/admin credentials on a database management console exposed on the public internet.',
      defense: 'Automate server hardening with Infrastructure-as-Code (Ansible/Terraform). Disable unnecessary ports, services, and debugging endpoints.'
    },
    {
      code: 'A06:2021',
      title: 'Vulnerable and Outdated Components',
      summary: 'Using outdated third-party open-source libraries (npm, PyPI, maven) with known CVE vulnerabilities.',
      example: 'Running Apache Log4j with Log4Shell (CVE-2021-44228) remote code execution vulnerability.',
      defense: 'Regularly run Software Composition Analysis (SCA) like `npm audit`, Snyk, or Dependabot. Maintain a Software Bill of Materials (SBOM).'
    },
    {
      code: 'A07:2021',
      title: 'Identification and Authentication Failures',
      summary: 'Weak session management, allowing credential stuffing, missing Multi-Factor Authentication (MFA).',
      example: 'Allowing unlimited automated password guessing without IP rate limiting or CAPTCHA triggers.',
      defense: 'Enforce Multi-Factor Authentication (MFA/FIDO2). Implement adaptive account lockout and secure session cookies (HttpOnly, Secure, SameSite).'
    },
    {
      code: 'A08:2021',
      title: 'Software and Data Integrity Failures',
      summary: 'Code and infrastructure that does not protect against integrity violations (unverified updates, insecure deserialization).',
      example: 'SolarWinds supply chain attack where malicious code was injected into legitimate software updates before digital signing.',
      defense: 'Enforce cryptographic digital signature verification on all software packages and updates. Verify SHA-256 hashes.'
    },
    {
      code: 'A09:2021',
      title: 'Security Logging and Monitoring Failures',
      summary: 'Insufficient logging and detection allows breaches to go unnoticed for months.',
      example: 'An attacker conducts password brute force for 3 weeks because no alert or SIEM monitoring was active.',
      defense: 'Centralize logs in a SIEM. Ensure all login failures, privilege escalations, and server errors generate real-time alerts.'
    },
    {
      code: 'A10:2021',
      title: 'Server-Side Request Forgery (SSRF)',
      summary: 'Web server fetches a remote resource without validating the user-supplied destination URL.',
      example: 'Providing URL parameter http://169.254.169.254/latest/meta-data/ to steal AWS cloud IAM role credentials.',
      defense: 'Strictly validate and whitelist target domain schemes. Block internal RFC 1918 private IP ranges and link-local cloud metadata endpoints.'
    }
  ];

  const filteredOwasp = OWASP_TOP10.filter((o) => {
    const q = owaspSearch.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.summary.toLowerCase().includes(q) || o.code.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">SentinelLab</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Blue Team &amp; SOC Suite
                </span>
              </div>
              <span className="text-xs text-slate-400">Defensive Security Analyst &amp; Incident Response Toolkit</span>
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
            { id: 'password-strength', label: 'Password Strength', icon: Lock },
            { id: 'password-gen', label: 'Secure Generator', icon: Key },
            { id: 'hashes', label: 'Hash Lab & Verifier', icon: Hash },
            { id: 'encoder', label: 'Encoding Toolkit', icon: Code2 },
            { id: 'log-analyzer', label: 'Log Analyzer (SOC)', icon: Activity },
            { id: 'phishing', label: 'Phishing Simulator', icon: AlertTriangle },
            { id: 'owasp', label: 'OWASP Top 10', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: PASSWORD STRENGTH ANALYZER */}
        {activeTab === 'password-strength' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    <span>NIST Password Entropy &amp; Strength Analyzer</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculates mathematical Shannon entropy, pool combinations, and estimated brute force crack time.
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-extrabold border ${passwordStats.color}`}>
                  {passwordStats.rating} (Score {passwordStats.score}/4)
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="Type password to evaluate..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-500 pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Shannon Entropy:</span>
                  <div className="text-2xl font-bold font-mono text-cyan-400">{passwordStats.entropy} bits</div>
                  <p className="text-[11px] text-slate-500">Target &gt; 80 bits for high security</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Offline Hash Crack Time:</span>
                  <div className="text-sm font-bold font-mono text-amber-300">{passwordStats.crackTimeOffline}</div>
                  <p className="text-[11px] text-slate-500">Assuming 10 Billion hashes/sec cluster</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Online Throttled Attack:</span>
                  <div className="text-sm font-bold font-mono text-emerald-400">{passwordStats.crackTimeOnline}</div>
                  <p className="text-[11px] text-slate-500">Assuming 100 attempts/sec with lockouts</p>
                </div>
              </div>

              {/* Recommendations & NIST Feedback */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>NIST SP 800-63B Recommendations:</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {passwordStats.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURE PASSWORD GENERATOR */}
        {activeTab === 'password-gen' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-400" />
                    <span>Cryptographic Random Generator (Web Crypto API)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Utilizes hardware-backed CSPRNG (crypto.getRandomValues) for true cryptographic randomness.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGenMode('random')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      genMode === 'random' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Random Chars
                  </button>
                  <button
                    onClick={() => setGenMode('passphrase')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      genMode === 'passphrase' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Diceware Passphrase
                  </button>
                </div>
              </div>

              {/* Generator Settings */}
              {genMode === 'random' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-bold">
                      <span>Length: {genLength} Characters</span>
                      <span>{genLength >= 16 ? 'Strong' : 'Minimum recommended is 14+'}</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={48}
                      value={genLength}
                      onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={includeUpper}
                        onChange={(e) => setIncludeUpper(e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>Uppercase (A-Z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={includeLower}
                        onChange={(e) => setIncludeLower(e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>Lowercase (a-z)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={includeDigits}
                        onChange={(e) => setIncludeDigits(e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>Digits (0-9)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>Symbols (!@#$)</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Number of Words ({passphraseWords}):</label>
                    <input
                      type="range"
                      min={3}
                      max={8}
                      value={passphraseWords}
                      onChange={(e) => setPassphraseWords(parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Separator Character:</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={passphraseSep}
                      onChange={(e) => setPassphraseSep(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-center text-emerald-300"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleGeneratePassword}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Generate Cryptographically Secure Password</span>
              </button>

              {/* Result Output */}
              {generatedPass && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="font-mono text-base font-bold text-emerald-300 break-all select-all">
                    {generatedPass}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPass);
                      setCopiedPass(true);
                      setTimeout(() => setCopiedPass(false), 2000);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPass ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: HASH LAB & VERIFIER */}
        {activeTab === 'hashes' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-amber-400" />
                  <span>Cryptographic Hash Generator &amp; Integrity Verifier</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate SHA-256, SHA-512, SHA-1, and MD5 hashes using client-side Web Crypto and verify file checksum integrity.
                </p>
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Input Text String to Hash:</label>
                <textarea
                  rows={2}
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Local File Hash Checksum */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Calculate Local File Hash (SHA-256 Checksum)</span>
                  </span>
                  <p className="text-[11px] text-slate-400">File is processed 100% locally in browser memory. Never uploaded anywhere.</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                />
              </div>

              {/* Hash Outputs */}
              <div className="space-y-3">
                {Object.entries(calculatedHashes).map(([algo, hashVal]) => (
                  <div key={algo} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400 font-mono">{algo}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(hashVal);
                          setCopiedHashKey(algo);
                          setTimeout(() => setCopiedHashKey(null), 2000);
                        }}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedHashKey === algo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHashKey === algo ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs text-slate-300 break-all select-all">{hashVal}</div>
                  </div>
                ))}
              </div>

              {/* Hash Verifier */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-white">Compare with Expected Hash (Integrity Verification):</label>
                <input
                  type="text"
                  value={hashVerifyExpected}
                  onChange={(e) => setHashVerifyExpected(e.target.value)}
                  placeholder="Paste expected checksum to verify (case-insensitive)..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300"
                />

                {hashVerifyExpected.trim() && (
                  <div>
                    {Object.values(calculatedHashes).some(
                      (h) => h.toLowerCase() === hashVerifyExpected.trim().toLowerCase()
                    ) ? (
                      <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs font-bold text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>INTEGRITY VERIFIED: Checksum exactly matches calculated hash! No tampering detected.</span>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs font-bold text-rose-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>CHECKSUM MISMATCH: Hash does not match any current algorithm output. Check input or integrity.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ENCODING TOOLKIT */}
        {activeTab === 'encoder' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                    <span>Defensive Multi-Format Encoding Toolkit</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Encode and decode between Base64, Hex, URL, HTML Entities, ROT13, and 8-Bit Binary.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEncodeAction('encode')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      encodeAction === 'encode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => setEncodeAction('decode')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      encodeAction === 'decode' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Decode
                  </button>
                </div>
              </div>

              {/* Format Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'base64', label: 'Base64' },
                  { id: 'hex', label: 'Hex (0x)' },
                  { id: 'url', label: 'URL Percent' },
                  { id: 'html', label: 'HTML Entity' },
                  { id: 'rot13', label: 'ROT13' },
                  { id: 'binary', label: '8-Bit Binary' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setEncodeFormat(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      encodeFormat === f.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Input Text:</label>
                <textarea
                  rows={3}
                  value={encodeInput}
                  onChange={(e) => setEncodeInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Output Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Result ({encodeAction.toUpperCase()} · {encodeFormat.toUpperCase()}):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(encodedText);
                      setCopiedEncoded(true);
                      setTimeout(() => setCopiedEncoded(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-colors"
                  >
                    {copiedEncoded ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEncoded ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg font-mono text-xs sm:text-sm text-cyan-300 break-all select-all">
                  {encodedText}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LOG ANALYZER (OFFLINE SOC) */}
        {activeTab === 'log-analyzer' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-400" />
                    <span>Client-Side Security Log Analyzer (SOC SIEM)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Offline regex engine parses access logs to detect SQLi, Path Traversal, credential brute-forcing, and scanner probes.
                  </p>
                </div>

                <button
                  onClick={() => setLogInput(sampleLog)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Load Sample Attack Logs
                </button>
              </div>

              {/* Log Input Area */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Paste Raw Access Log / Syslog:</label>
                <textarea
                  rows={6}
                  value={logInput}
                  onChange={(e) => setLogInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Telemetry Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Total Log Lines:</span>
                  <div className="text-xl font-bold font-mono text-white">{logAnalysisResults.stats.totalLines}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Unique Client IPs:</span>
                  <div className="text-xl font-bold font-mono text-cyan-400">{logAnalysisResults.stats.uniqueIps.size}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">404 Not Found:</span>
                  <div className="text-xl font-bold font-mono text-amber-400">{logAnalysisResults.stats.status404}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-semibold">Security Alerts:</span>
                  <div className="text-xl font-bold font-mono text-rose-400">{logAnalysisResults.alerts.length}</div>
                </div>
              </div>

              {/* Detected Security Incidents */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Detected Suspicious Indicators ({logAnalysisResults.alerts.length}):
                </h3>

                {logAnalysisResults.alerts.length === 0 ? (
                  <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300">
                    No suspicious attack signatures detected in the provided log lines.
                  </div>
                ) : (
                  logAnalysisResults.alerts.map((alert, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              alert.severity === 'High'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : alert.severity === 'Medium'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            }`}
                          >
                            {alert.severity} SEVERITY
                          </span>
                          <span className="font-bold text-white">{alert.type}</span>
                        </div>
                        <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded">
                          Source IP: {alert.ip}
                        </span>
                      </div>

                      <div className="p-2 bg-slate-900/80 rounded font-mono text-[11px] text-slate-300 break-all border border-slate-800">
                        {alert.line}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <strong className="text-slate-400">SOC Analyst Note: </strong>
                          <span className="text-slate-300">{alert.explanation}</span>
                        </div>
                        <div>
                          <strong className="text-emerald-400">Blue Team Action: </strong>
                          <span className="text-slate-300">{alert.mitigation}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PHISHING SIMULATOR */}
        {activeTab === 'phishing' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>Phishing &amp; Social Engineering Awareness Simulator</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Test your ability to spot typosquatting, spoofed headers, and deceptive social engineering triggers.
                  </p>
                </div>

                <div className="text-xs font-mono text-cyan-300">
                  Scenario {phishIndex + 1} of {PHISHING_SCENARIOS.length}
                </div>
              </div>

              {/* Scenario Email Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-sans">
                <div className="border-b border-slate-800/80 pb-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">From:</span>
                    <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-0.5 rounded">{currentPhish.sender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">Subject:</span>
                    <span className="font-bold text-white">{currentPhish.subject}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentPhish.body}
                </div>
              </div>

              {/* Decision Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setPhishAnswers((prev) => ({ ...prev, [phishIndex]: true }));
                      setShowExplanation(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    🚩 Flag as PHISHING
                  </button>
                  <button
                    onClick={() => {
                      setPhishAnswers((prev) => ({ ...prev, [phishIndex]: false }));
                      setShowExplanation(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    ✅ Mark as LEGITIMATE
                  </button>
                </div>

                <button
                  onClick={() => {
                    setPhishIndex((prev) => (prev + 1) % PHISHING_SCENARIOS.length);
                    setShowExplanation(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Next Scenario ➔
                </button>
              </div>

              {/* Feedback and Red Flags */}
              {showExplanation && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-fade-in">
                  <div className="flex items-center gap-2">
                    {phishAnswers[phishIndex] === currentPhish.isPhishing ? (
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>CORRECT ASSESSMENT! You identified this scenario accurately.</span>
                      </span>
                    ) : (
                      <span className="font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>INCORRECT! This scenario was actually {currentPhish.isPhishing ? 'PHISHING' : 'LEGITIMATE'}.</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-amber-300">Security Red Flags &amp; Indicators:</span>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside">
                      {currentPhish.redFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: OWASP TOP 10 EXPLORER */}
        {activeTab === 'owasp' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <span>OWASP Top 10 Defensive Architecture Explorer</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Comprehensive blue team defense guides for the most critical web application security risks.
                  </p>
                </div>

                <input
                  type="text"
                  value={owaspSearch}
                  onChange={(e) => setOwaspSearch(e.target.value)}
                  placeholder="Filter by vulnerability..."
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-4">
                {filteredOwasp.map((item) => (
                  <div key={item.code} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                        {item.code}
                      </span>
                      <h3 className="font-bold text-white text-sm">{item.title}</h3>
                    </div>

                    <p className="text-slate-300 leading-relaxed">{item.summary}</p>

                    <div className="p-3 bg-slate-900 rounded-lg space-y-1 border border-slate-800/80">
                      <strong className="text-rose-400">Real-World Scenario: </strong>
                      <span className="text-slate-300">{item.example}</span>
                    </div>

                    <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg space-y-1">
                      <strong className="text-emerald-400">Blue Team Defense: </strong>
                      <span className="text-slate-300">{item.defense}</span>
                    </div>
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
