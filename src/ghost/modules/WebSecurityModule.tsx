import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

export const WebSecurityModule: React.FC = () => {
  const addGhostXp = useGhostStore((s) => s.addGhostXp);

  const [labTab, setLabTab] = useState<'sqli' | 'xss' | 'jwt'>('sqli');
  const [usernameInput, setUsernameInput] = useState(`admin' OR '1'='1`);
  const [useParameterized, setUseParameterized] = useState(false);

  const [commentInput, setCommentInput] = useState(`<script>alert('cookie-theft')</script>`);
  const [useOutputEncoding, setUseOutputEncoding] = useState(false);

  const [jwtRole, setJwtRole] = useState<'user' | 'admin'>('admin');
  const [jwtAlg, setJwtAlg] = useState<'none' | 'HS256'>('none');
  const [enforceJwtSig, setEnforceJwtSig] = useState(false);

  const isSqliPayload = /('|or\s+1=1|--|;|union\s+select)/i.test(usernameInput);
  const isXssPayload = /(<script|onerror=|onload=|javascript:)/i.test(commentInput);

  const encodeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const handleToggleDefense = (nextVal: boolean) => {
    if (labTab === 'sqli') setUseParameterized(nextVal);
    else if (labTab === 'xss') setUseOutputEncoding(nextVal);
    else setEnforceJwtSig(nextVal);

    if (nextVal) {
      addGhostXp(25, `Enabled ${labTab.toUpperCase()} Defense`, `websec-${labTab}`);
    }
  };

  const b64Encode = (obj: object) => {
    try {
      return btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    } catch {
      return 'eyJhbGciOiJIUzI1NiJ9';
    }
  };

  const jwtHeader = b64Encode({ alg: jwtAlg, typ: 'JWT' });
  const jwtPayload = b64Encode({ sub: 'analyst_104', role: jwtRole, iat: 1763270000 });
  const jwtSig = jwtAlg === 'none' ? '' : 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  return (
    <ModuleFrame
      moduleId="websec"
      onResetLocal={() => {
        setUseParameterized(false);
        setUseOutputEncoding(false);
        setEnforceJwtSig(false);
        setUsernameInput(`admin' OR '1'='1`);
        setCommentInput(`<script>alert('cookie-theft')</script>`);
        setJwtRole('admin');
        setJwtAlg('none');
      }}
    >
      <div className="space-y-5">
        <div className="inline-flex flex-wrap p-1 rounded-lg bg-[#0D1322] border border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setLabTab('sqli')}
            className={`px-4 py-2 min-h-[40px] rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              labTab === 'sqli' ? 'bg-[#00E5FF] text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            SQL Injection Visualizer
          </button>
          <button
            type="button"
            onClick={() => setLabTab('xss')}
            className={`px-4 py-2 min-h-[40px] rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              labTab === 'xss' ? 'bg-[#00E5FF] text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            Reflected XSS &amp; CSP
          </button>
          <button
            type="button"
            onClick={() => setLabTab('jwt')}
            className={`px-4 py-2 min-h-[40px] rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              labTab === 'jwt' ? 'bg-[#00E5FF] text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            JWT Signature Tamper Lab
          </button>
        </div>

        {labTab === 'sqli' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">Mock Auth Endpoint: POST /api/login</h3>
                <button
                  type="button"
                  onClick={() => handleToggleDefense(!useParameterized)}
                  className={`px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    useParameterized
                      ? 'border-[#00FF41]/50 bg-[#00FF41]/15 text-[#00FF41]'
                      : 'border-[#FF003C]/50 bg-[#FF003C]/15 text-[#FF003C]'
                  }`}
                >
                  {useParameterized ? 'Parameterized Queries: ON' : 'Vulnerable Concat: ON'}
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Username Input Payload</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#060910] border border-slate-700 font-ghost-mono text-xs sm:text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setUsernameInput('alice_analyst')}
                  className="px-3 py-1.5 rounded border border-slate-700 text-xs font-ghost-mono text-slate-300 hover:text-white cursor-pointer"
                >
                  Benign: alice_analyst
                </button>
                <button
                  type="button"
                  onClick={() => setUsernameInput(`admin' OR '1'='1`)}
                  className="px-3 py-1.5 rounded border border-slate-700 text-xs font-ghost-mono text-amber-300 hover:text-white cursor-pointer"
                >
                  Test Tautology: &apos; OR &apos;1&apos;=&apos;1
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#060910] p-5 space-y-4">
              <div className="text-xs font-ghost-mono text-[#00E5FF]">Generated Database Execution Plan</div>
              {useParameterized ? (
                <div className="space-y-3">
                  <pre className="p-3 rounded-lg bg-[#0D1322] border border-[#00FF41]/30 font-ghost-mono text-xs text-[#00FF41] whitespace-pre-wrap">
                    {`PREPARE stmt FROM 'SELECT id, role FROM users WHERE username = ?';\nEXECUTE stmt USING @p0 = "${usernameInput}";`}
                  </pre>
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30 text-xs text-[#00FF41]">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>SAFE: SQL engine treats user input strictly as bound literal data, never SQL logic.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <pre className="p-3 rounded-lg bg-[#0D1322] border border-[#FF003C]/30 font-ghost-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {`SELECT id, role FROM users WHERE username = '${usernameInput}';`}
                  </pre>
                  {isSqliPayload ? (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FF003C]/10 border border-[#FF003C]/40 text-xs text-[#FF003C]">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>VULNERABILITY TRIGGERED: Unescaped quotes altered the query AST. Enable Parameterized Queries to fix!</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">Raw string concatenation remains vulnerable to metacharacters.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {labTab === 'xss' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">Mock Search API: GET /search?q=</h3>
                <button
                  type="button"
                  onClick={() => handleToggleDefense(!useOutputEncoding)}
                  className={`px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    useOutputEncoding
                      ? 'border-[#00FF41]/50 bg-[#00FF41]/15 text-[#00FF41]'
                      : 'border-[#FF003C]/50 bg-[#FF003C]/15 text-[#FF003C]'
                  }`}
                >
                  {useOutputEncoding ? 'HTML Encoding + CSP: ON' : 'Raw innerHTML Sink: ON'}
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Reflected Query Parameter</label>
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#060910] border border-slate-700 font-ghost-mono text-xs sm:text-sm text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#060910] p-5 space-y-4">
              <div className="text-xs font-ghost-mono text-[#00E5FF]">Rendered DOM Output Preview</div>
              {useOutputEncoding ? (
                <div className="space-y-3">
                  <pre className="p-3 rounded-lg bg-[#0D1322] border border-[#00FF41]/30 font-ghost-mono text-xs text-[#00FF41] whitespace-pre-wrap">
                    {`<div>Results for: ${encodeHtml(commentInput)}</div>\nContent-Security-Policy: default-src 'self'; script-src 'self'`}
                  </pre>
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30 text-xs text-[#00FF41]">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>SAFE: Angle brackets are entity-encoded and CSP blocks inline script execution.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <pre className="p-3 rounded-lg bg-[#0D1322] border border-[#FF003C]/30 font-ghost-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {`<div>Results for: ${commentInput}</div>`}
                  </pre>
                  {isXssPayload ? (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FF003C]/10 border border-[#FF003C]/40 text-xs text-[#FF003C]">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>XSS RISK DETECTED: Browser DOM parser treats untrusted input as executable HTML/JS tags.</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">Try adding &lt;script&gt; or onerror= to test reflected DOM interpretation.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {labTab === 'jwt' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">JWT Claims &amp; Signature Audit</h3>
                <button
                  type="button"
                  onClick={() => handleToggleDefense(!enforceJwtSig)}
                  className={`px-3 py-1.5 min-h-[38px] rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                    enforceJwtSig
                      ? 'border-[#00FF41]/50 bg-[#00FF41]/15 text-[#00FF41]'
                      : 'border-[#FF003C]/50 bg-[#FF003C]/15 text-[#FF003C]'
                  }`}
                >
                  {enforceJwtSig ? 'Strict HS256 Verify: ON' : 'Accept alg=none: VULNERABLE'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Header Algorithm</label>
                  <select
                    value={jwtAlg}
                    onChange={(e) => setJwtAlg(e.target.value as 'none' | 'HS256')}
                    className="w-full px-3 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 text-xs font-ghost-mono text-white"
                  >
                    <option value="none">alg: &quot;none&quot; (Unsigned)</option>
                    <option value="HS256">alg: &quot;HS256&quot; (HMAC-SHA256)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tampered Role Claim</label>
                  <select
                    value={jwtRole}
                    onChange={(e) => setJwtRole(e.target.value as 'user' | 'admin')}
                    className="w-full px-3 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 text-xs font-ghost-mono text-white"
                  >
                    <option value="user">role: &quot;user&quot;</option>
                    <option value="admin">role: &quot;admin&quot;</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-1">Encoded Bearer Token</div>
                <div className="p-3 rounded-lg bg-[#060910] border border-slate-800 font-ghost-mono text-[11px] break-all">
                  <span className="text-[#FF003C]">{jwtHeader}</span>.
                  <span className="text-[#00E5FF]">{jwtPayload}</span>.
                  <span className="text-[#00FF41]">{jwtSig || '(missing_signature)'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#060910] p-5 space-y-4">
              <div className="text-xs font-ghost-mono text-[#00E5FF]">Server Middleware Verdict</div>
              {enforceJwtSig ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#0D1322] border border-[#00FF41]/30 font-ghost-mono text-xs text-[#00FF41]">
                    {jwtAlg === 'none' || jwtRole === 'admin'
                      ? 'HTTP 401 UNAUTHORIZED — Rejected unsigned/forged token signature mismatch.'
                      : 'HTTP 200 OK — Valid HS256 signature verified against server secret.'}
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#00FF41]/10 border border-[#00FF41]/30 text-xs text-[#00FF41]">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>SAFE: Explicitly pinning allowed algorithms (HS256/RS256) and validating HMAC signatures blocks privilege escalation.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#0D1322] border border-[#FF003C]/30 font-ghost-mono text-xs text-[#FF003C]">
                    HTTP 200 GRANTED AS &quot;{jwtRole.toUpperCase()}&quot; — Server trusted unverified JWT payload!
                  </div>
                  <div className="text-xs text-slate-400">
                    When verification skips algorithm allowlisting, anyone can base64-encode a forged admin claim. Enable Strict HS256 Verify!
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ModuleFrame>
  );
};
