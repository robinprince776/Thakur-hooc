import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Key,
  Unlock,
  AlertTriangle,
  Code2,
  Lock,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const InteractiveLabs: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'sqli' | 'xss' | 'hash' | 'caesar'>('sqli');

  // --- SQLi Lab State ---
  const [sqliUser, setSqliUser] = useState("admin' OR '1'='1' --");
  const [sqliPass, setSqliPass] = useState('random_guess');
  const [isSecureSqliMode, setIsSecureSqliMode] = useState(false);

  // --- XSS Lab State ---
  const [xssInput, setXssInput] = useState('<img src=x onerror="alert(\'Session Token Stolen: xy928k\')">');

  // --- Hash Lab State ---
  const [hashInput, setHashInput] = useState('password123');
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  // Simple MD5 simulation hash helper
  const pseudoHash = (str: string, type: 'md5' | 'sha256') => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    if (type === 'md5') {
      return (hex + 'e4b291a0c84f5d1e2b3c4d5e6f7a8b9c').slice(0, 32);
    }
    return (hex + '8f4b2c1a0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b').slice(0, 64);
  };

  // --- Caesar Cipher State ---
  const [caesarText, setCaesarText] = useState('ATTACK AT DAWN');
  const [caesarShift, setCaesarShift] = useState(3);

  const applyCaesar = (text: string, shift: number) => {
    return text
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0);
        // Uppercase
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        // Lowercase
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
      })
      .join('');
  };

  const isSqliExploited =
    !isSecureSqliMode &&
    (sqliUser.includes("' OR '1'='1") ||
      sqliUser.includes("' OR 1=1") ||
      sqliUser.includes("' or '1'='1"));

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Lab Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'sqli', label: '1. SQL Injection Lab', icon: AlertTriangle, color: 'text-amber-400' },
          { id: 'xss', label: '2. XSS & Sanitizer Lab', icon: Code2, color: 'text-cyan-400' },
          { id: 'hash', label: '3. Hash & Cracker Lab', icon: Lock, color: 'text-emerald-400' },
          { id: 'caesar', label: '4. Caesar Cipher Lab', icon: Key, color: 'text-purple-400' }
        ].map((tab) => {
          const isActive = activeLab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#121A29] border-emerald-500/80 text-emerald-300 shadow-lg shadow-emerald-950/50'
                  : 'bg-[#0B0F17]/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* LAB 1: SQL INJECTION INTERACTIVE SIMULATOR */}
      {/* ======================================================== */}
      {activeLab === 'sqli' && (
        <div className="bg-[#0B0F17] rounded-3xl p-6 border border-amber-500/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold mb-1">
                Lab 1: Vulnerable Authentication
              </div>
              <h3 className="text-xl font-bold text-white">SQL Injection Bypass Lab</h3>
              <p className="text-xs text-zinc-400">
                Neeche login form me try karo SQL syntax inject karna aur dekho backend database me query kaise twist hoti hai.
              </p>
            </div>

            {/* Toggle Secure Mode */}
            <button
              onClick={() => setIsSecureSqliMode(!isSecureSqliMode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
                isSecureSqliMode
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-red-950/60 border-red-500/60 text-red-300'
              }`}
            >
              {isSecureSqliMode ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Backend Mode: SECURE (Prepared Statement)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>Backend Mode: VULNERABLE (Raw Concatenation)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Interactive Simulated Login Form */}
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-4">
              <span className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
                Target Login Screen (Bank/Portal)
              </span>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Username / Email:</label>
                  <input
                    type="text"
                    value={sqliUser}
                    onChange={(e) => setSqliUser(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#121A29] border border-zinc-700 focus:border-amber-400 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Password:</label>
                  <input
                    type="text"
                    value={sqliPass}
                    onChange={(e) => setSqliPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#121A29] border border-zinc-700 focus:border-amber-400 text-xs text-white font-mono outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSqliUser("admin' OR '1'='1' --");
                      setSqliPass('anything');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-600/50 text-amber-300 text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    Quick Payload 1: ' OR '1'='1' --
                  </button>
                  <button
                    onClick={() => {
                      setSqliUser('admin');
                      setSqliPass('wrong_password');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    Reset: Normal User
                  </button>
                </div>
              </div>

              {/* Login Result Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  isSqliExploited
                    ? 'bg-red-950/40 border-red-500/60 text-red-200'
                    : sqliUser === 'admin' && sqliPass === 'admin123'
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                }`}
              >
                {isSqliExploited ? (
                  <>
                    <Unlock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-red-300">
                        🚨 AUTHENTICATION BYPASSED! (HACKED)
                      </div>
                      <p className="leading-relaxed">
                        Logged in as: <strong className="text-white">admin (Superuser)</strong> bina password ke!
                        Kyunki <code className="bg-red-900/40 px-1 py-0.5 rounded">'1'='1'</code> ne puri condition ko TRUE bana diya aur baaki query comment out ho gayi.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      {isSecureSqliMode ? (
                        <span className="text-emerald-400 font-bold">
                          🛡️ Secure Mode: Input parameter treated as literal string. Hack blocked!
                        </span>
                      ) : (
                        <span>Normal behavior: Enter credentials to login.</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Behind-The-Scenes SQL Engine Inspection */}
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-4 font-mono text-xs">
              <span className="uppercase text-amber-400 font-bold tracking-wider text-[11px] block">
                Backend Query Inspector (Live SQL)
              </span>

              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 overflow-x-auto">
                {isSecureSqliMode ? (
                  <div className="space-y-2 text-zinc-300">
                    <span className="text-emerald-400 font-bold">// SECURE: Prepared Statement</span>
                    <pre className="text-cyan-300">
                      {`SELECT id, username, role FROM users 
WHERE username = $1 AND password_hash = $2;`}
                    </pre>
                    <div className="pt-2 text-[11px] text-zinc-400 font-sans border-t border-zinc-800">
                      Parameter $1 binded safely as: <span className="text-amber-300 font-mono">"{sqliUser}"</span>
                      <br />
                      Database is input ko SQL code nahi, bas ek normal string value maanta hai.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-red-400 font-bold">// VULNERABLE: Direct Concatenation</span>
                    <pre className="text-zinc-300">
                      SELECT id, username FROM users
                      {'\n'}WHERE username = '<span className="text-amber-400 font-bold">{sqliUser}</span>'
                      {'\n'}AND password = '{sqliPass}';
                    </pre>
                    {isSqliExploited && (
                      <div className="p-2 rounded bg-amber-950/40 border border-amber-600/40 text-amber-200 text-[11px] font-sans">
                        ⚠️ Dhyan do: SQL me <code className="font-mono font-bold">--</code> ka matlab hota hai comment! Yani backend ne password checking statement ko ignore hi kar diya.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#121A29] border border-zinc-700/60 text-zinc-300 text-xs font-sans space-y-1">
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Permanent Solution (Hinglish):
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Kabhi bhi <code className="bg-zinc-800 px-1 py-0.5 rounded font-mono">"WHERE user = '" + input</code> mat likho. Hamesha Parameterized Queries ya ORM use karo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LAB 2: XSS SANITIZER & COOKIE THEFT SIMULATOR */}
      {/* ======================================================== */}
      {activeLab === 'xss' && (
        <div className="bg-[#0B0F17] rounded-3xl p-6 border border-cyan-500/30 shadow-2xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold mb-1">
              Lab 2: Client-side Exploitation
            </div>
            <h3 className="text-xl font-bold text-white">Cross-Site Scripting (XSS) Sandbox</h3>
            <p className="text-xs text-zinc-400">
              Dekho kaise unescaped input HTML me inject hokar dangerous script execute karta hai aur sanitizer kaise ise neutralize karta hai.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-4">
              <label className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider block">
                User Comment / Input Box:
              </label>
              <textarea
                rows={4}
                value={xssInput}
                onChange={(e) => setXssInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#121A29] border border-zinc-700 focus:border-cyan-400 text-xs text-cyan-200 font-mono outline-none resize-none"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setXssInput('<script>alert("Cookie: " + document.cookie)</script>')}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-600/50 text-cyan-300 text-[11px] font-mono cursor-pointer transition-colors"
                >
                  Payload: &lt;script&gt; Alert
                </button>
                <button
                  onClick={() => setXssInput('<img src=x onerror="alert(\'Session Hijacked!\')">')}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-600/50 text-cyan-300 text-[11px] font-mono cursor-pointer transition-colors"
                >
                  Payload: &lt;img onerror&gt;
                </button>
                <button
                  onClick={() => setXssInput('Awesome post! Keep it up brother.')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono cursor-pointer transition-colors"
                >
                  Normal Text
                </button>
              </div>

              {/* What Attacker Steals */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-700/40 text-xs text-zinc-300 space-y-2">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Attacker's Goal:
                </span>
                <p className="text-[11px] leading-relaxed">
                  XSS ka asli maksad alert popup nahi hota! Asli maksad hota hai victim ke browser me se <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300 font-mono">document.cookie</code> chura kar attacker ke C2 server par bhejna taaki bina password victim ka account login kiya ja sake.
                </p>
              </div>
            </div>

            {/* Right: Sanitized vs Unsanitized Comparison */}
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-4">
              <span className="uppercase text-cyan-400 font-bold tracking-wider text-[11px] block font-mono">
                Sanitization Defense Analysis
              </span>

              <div className="space-y-3 font-mono text-xs">
                {/* Unsafe */}
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40">
                  <span className="text-red-400 font-bold text-[11px] block mb-1">
                    ❌ Unsafe DOM (innerHTML = input):
                  </span>
                  <div className="bg-black/60 p-2 rounded text-red-200 break-all">
                    {xssInput}
                  </div>
                  <span className="text-[10px] text-red-300 font-sans mt-1 block">
                    Browser is tag ko parse karke malicious JS run kar dega!
                  </span>
                </div>

                {/* Safe */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
                  <span className="text-emerald-400 font-bold text-[11px] block mb-1">
                    ✅ Sanitized HTML Encoding (DOMPurify / textContent):
                  </span>
                  <div className="bg-black/60 p-2 rounded text-emerald-200 break-all">
                    {xssInput
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;')
                      .replace(/"/g, '&quot;')}
                  </div>
                  <span className="text-[10px] text-emerald-300 font-sans mt-1 block">
                    Browser ab ise executable tag nahi balki plain text ki tarah render karega. No exploit!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LAB 3: HASH & CRACKER LAB */}
      {/* ======================================================== */}
      {activeLab === 'hash' && (
        <div className="bg-[#0B0F17] rounded-3xl p-6 border border-emerald-500/30 shadow-2xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono font-bold mb-1">
              Lab 3: Cryptographic Hashes & Cracking
            </div>
            <h3 className="text-xl font-bold text-white">Password Hash & Rainbow Table Simulator</h3>
            <p className="text-xs text-zinc-400">
              Koi bhi word type karo aur dekho kaise MD5 aur SHA-256 hashes bante hain aur hackers unhe dictionary attack se crack karte hain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1.5">
                  Plaintext Password:
                </label>
                <input
                  type="text"
                  value={hashInput}
                  onChange={(e) => {
                    setHashInput(e.target.value);
                    setLookupResult(null);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#121A29] border border-zinc-700 focus:border-emerald-400 text-xs text-emerald-300 font-mono outline-none"
                />
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                    MD5 Hash (32 Hex Chars · Obsolete & Broken):
                  </span>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-amber-300 break-all select-all">
                    {pseudoHash(hashInput, 'md5')}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                    SHA-256 Hash (64 Hex Chars · Strong Cryptographic):
                  </span>
                  <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 text-emerald-400 break-all select-all">
                    {pseudoHash(hashInput, 'sha256')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const commonList = ['password', '123456', 'admin', 'password123', 'qwerty', 'love', 'secret', 'bca2026'];
                  if (commonList.includes(hashInput.toLowerCase())) {
                    setLookupResult(`CRACKED! Wordlist match found: "${hashInput}" (Time taken: 0.04s)`);
                  } else {
                    setLookupResult(`NOT in common wordlist. Complex password survived simple dictionary attack!`);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-emerald-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Simulate Dictionary Attack (Hashcat Mode)</span>
              </button>

              {lookupResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono ${
                    lookupResult.startsWith('CRACKED')
                      ? 'bg-red-950/40 border-red-600/60 text-red-200'
                      : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                  }`}
                >
                  {lookupResult}
                </div>
              )}
            </div>

            {/* Right: Salt & Bcrypt Explanation */}
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-4">
              <span className="uppercase text-emerald-400 font-bold tracking-wider text-[11px] block font-mono">
                Kyu Salt Lagana Zaroori Hai? (Hinglish)
              </span>

              <div className="space-y-2 text-xs text-zinc-300 leading-relaxed font-sans">
                <p>
                  Agar 10 users ka password <code className="bg-zinc-800 px-1 py-0.5 rounded font-mono text-amber-300">"admin123"</code> hai aur bina salt ke hash store kiya gaya, to database me sabka hash <strong>bilkul same</strong> dikhega. Attacker ek hi baar me sabko dhoond lega!
                </p>
                <div className="p-3 rounded-xl bg-[#121A29] border border-zinc-700/60 font-mono text-xs space-y-1">
                  <span className="text-cyan-400 font-bold text-[11px] block">// With Random Salt:</span>
                  <div className="text-zinc-400 text-[11px]">
                    User 1: "admin123" + "x9#L2" =&gt; <span className="text-white">a9f82...</span>
                  </div>
                  <div className="text-zinc-400 text-[11px]">
                    User 2: "admin123" + "k7@Q1" =&gt; <span className="text-white">e4b71...</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Salt lagane se Rainbow Tables bekar ho jaati hain aur attack exponentially slow ho jata hai.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LAB 4: CAESAR CIPHER LAB */}
      {/* ======================================================== */}
      {activeLab === 'caesar' && (
        <div className="bg-[#0B0F17] rounded-3xl p-6 border border-purple-500/30 shadow-2xl space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-bold mb-1">
              Lab 4: Classical Cryptography
            </div>
            <h3 className="text-xl font-bold text-white">Caesar Cipher Interactive Wheel</h3>
            <p className="text-xs text-zinc-400">
              Itihaas ka pehla famous encryption jo Julius Caesar apni fauj ko secret messages bhejne ke liye use karta tha!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold block mb-1">
                  Plaintext Message:
                </label>
                <input
                  type="text"
                  value={caesarText}
                  onChange={(e) => setCaesarText(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-[#121A29] border border-zinc-700 focus:border-purple-400 text-xs text-purple-200 font-mono outline-none uppercase"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <span className="text-zinc-400 font-bold">Shift Key (K):</span>
                  <span className="text-purple-400 font-bold">Shift +{caesarShift} Positions</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={caesarShift}
                  onChange={(e) => setCaesarShift(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-1 font-mono">
                <span className="text-[10px] text-purple-300 uppercase tracking-wider block">
                  Encrypted Ciphertext (Transmitted over wire):
                </span>
                <div className="text-lg font-bold text-white tracking-widest break-all">
                  {applyCaesar(caesarText, caesarShift)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-1 font-mono">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                  Decrypted with Key (-{caesarShift}):
                </span>
                <div className="text-base text-emerald-400 tracking-wider">
                  {caesarText}
                </div>
              </div>
            </div>

            {/* Right: Weakness of Caesar */}
            <div className="bg-[#080B10] p-5 rounded-2xl border border-zinc-800 space-y-3 font-sans text-xs">
              <span className="uppercase text-purple-400 font-bold tracking-wider text-[11px] block font-mono">
                Iska Tod: Frequency Analysis & Brute Force
              </span>
              <p className="text-zinc-300 leading-relaxed text-[11px]">
                Caesar Cipher ko todna behad aasan hai kyunki English alphabet me sirf <strong>25 possible keys</strong> hain! Attacker 1 second me saare 25 combinations dekh sakta hai.
              </p>
              <div className="p-3 rounded-xl bg-[#121A29] border border-zinc-700/60 space-y-1 text-[11px] text-zinc-300">
                <span className="text-amber-400 font-bold">Modern Replacement: AES-256</span>
                <p>
                  Aaj hum Advanced Encryption Standard (AES) use karte hain jisme <strong className="text-white">2^256 combinations</strong> hote hain — duniya ke saare supercomputers bhi trillions of years tak brute force nahi kar sakte!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
