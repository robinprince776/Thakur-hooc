import React, { useMemo, useState } from 'react';
import { Search, CheckCircle2, FileCode, Image as ImageIcon, Fingerprint } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

const SUSPICIOUS_LOGS = [
  { ts: '02:14:01', level: 'INFO', msg: 'systemd: Started Daily apt download activities.' },
  { ts: '02:14:19', level: 'WARN', msg: 'sshd[4102]: Failed password for root from 203.0.113.77 port 51822' },
  { ts: '02:14:21', level: 'WARN', msg: 'sshd[4104]: Failed password for root from 203.0.113.77 port 51829' },
  { ts: '02:14:24', level: 'ALERT', msg: 'sshd[4110]: Accepted password for backup_svc from 203.0.113.77 (ANOMALY)' },
  { ts: '02:15:02', level: 'ALERT', msg: 'auditd: /usr/bin/tar -czf /tmp/.cache.tgz /etc/nginx/conf.d' },
  { ts: '02:16:10', level: 'INFO', msg: 'cron: Finished logrotate maintenance.' },
];

const HEX_ROWS = [
  { offset: '00000000', hex: 'FF D8 FF E1 00 8A 45 78  69 66 00 00 4D 4D 00 2A', ascii: '......Exif..MM.*' },
  { offset: '00000010', hex: '00 00 00 08 00 03 01 0F  00 02 00 00 00 0A 00 00', ascii: '................' },
  { offset: '00000020', hex: '47 50 53 3A 20 31 39 2E  30 37 36 30 4E 2C 20 37', ascii: 'GPS: 19.0760N, 7' },
  { offset: '00000030', hex: '32 2E 38 37 37 37 45 20  7C 20 43 4C 55 45 3A 34', ascii: '2.8777E | CLUE:4' },
];

const DEFAULT_EVIDENCE_SAMPLE = SUSPICIOUS_LOGS.map((l) => `${l.ts} [${l.level}] ${l.msg}`).join('\n');

export const DigitalForensicsModule: React.FC = () => {
  const addGhostXp = useGhostStore((s) => s.addGhostXp);

  const [tab, setTab] = useState<'logs' | 'hex' | 'triage'>('logs');
  const [logFilter, setLogFilter] = useState('');
  const [clueAnswer, setClueAnswer] = useState('');
  const [verified, setVerified] = useState(false);
  const [rawArtifact, setRawArtifact] = useState(DEFAULT_EVIDENCE_SAMPLE);
  const [artifactHash, setArtifactHash] = useState<string>('');
  const [hashDone, setHashDone] = useState(false);

  const filteredLogs = SUSPICIOUS_LOGS.filter(
    (l) =>
      !logFilter.trim() ||
      l.msg.toLowerCase().includes(logFilter.toLowerCase()) ||
      l.level.toLowerCase().includes(logFilter.toLowerCase())
  );

  const extractedIocs = useMemo(() => {
    const ips = Array.from(new Set(rawArtifact.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || []));
    const paths = Array.from(new Set(rawArtifact.match(/\/(?:tmp|etc|var|usr)\/[^\s'"]+/g) || []));
    const anomalies = rawArtifact
      .split('\n')
      .filter((line) => /ALERT|Failed password|Accepted password|ANOMALY|tar\s/i.test(line));
    return { ips, paths, anomalies };
  }, [rawArtifact]);

  const computeSha256 = async () => {
    try {
      const encoded = new TextEncoder().encode(rawArtifact);
      const buffer = await crypto.subtle.digest('SHA-256', encoded);
      const hex = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setArtifactHash(hex);
      if (!hashDone) {
        setHashDone(true);
        addGhostXp(25, 'Chain-of-Custody SHA-256 Signed', 'dfir-sha256-hash');
      }
    } catch {
      setArtifactHash('Web Crypto digest unavailable in this browser context.');
    }
  };

  const checkEvidence = () => {
    const clean = clueAnswer.trim().toLowerCase();
    if (clean.includes('203.0.113.77') || clean.includes('19.0760') || clean.includes('mumbai') || clean.includes('ff d8 ff')) {
      setVerified(true);
      addGhostXp(60, 'DFIR Artifact Verified', 'dfir-clue-verified');
    }
  };

  return (
    <ModuleFrame
      moduleId="forensics"
      onResetLocal={() => {
        setLogFilter('');
        setClueAnswer('');
        setVerified(false);
        setRawArtifact(DEFAULT_EVIDENCE_SAMPLE);
        setArtifactHash('');
        setHashDone(false);
      }}
    >
      <div className="space-y-5">
        <div className="inline-flex flex-wrap p-1 rounded-lg bg-[#0D1322] border border-slate-800 gap-1">
          <button
            type="button"
            onClick={() => setTab('logs')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-md text-xs font-semibold cursor-pointer ${
              tab === 'logs' ? 'bg-[#00E5FF] text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Suspicious auth.log Analyzer</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('hex')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-md text-xs font-semibold cursor-pointer ${
              tab === 'hex' ? 'bg-[#00E5FF] text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Hex Viewer &amp; EXIF Inspector</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('triage')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-md text-xs font-semibold cursor-pointer ${
              tab === 'triage' ? 'bg-[#00E5FF] text-slate-950' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>SHA-256 &amp; IOC Extractor</span>
          </button>
        </div>

        {tab === 'logs' && (
          <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                Inspect <code className="font-ghost-mono text-[#00E5FF]">/var/log/auth.log</code> to identify the suspicious source IP that gained access.
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  placeholder="Filter logs (e.g. ALERT)..."
                  className="pl-8 pr-3 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                />
              </div>
            </div>

            <div className="rounded-lg bg-[#060910] border border-slate-800 p-3 font-ghost-mono text-xs space-y-1.5 overflow-x-auto">
              {filteredLogs.map((l, idx) => (
                <div key={idx} className="flex gap-3 whitespace-nowrap">
                  <span className="text-slate-500">{l.ts}</span>
                  <span
                    className={
                      l.level === 'ALERT'
                        ? 'text-[#FF003C] font-bold'
                        : l.level === 'WARN'
                        ? 'text-amber-300'
                        : 'text-[#00FF41]'
                    }
                  >
                    [{l.level}]
                  </span>
                  <span className="text-slate-200">{l.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'hex' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-800 bg-[#060910] p-4 space-y-3">
              <div className="text-xs font-ghost-mono text-[#00E5FF]">
                Artifact: evidence_photo.jpg (Hex Header Dump)
              </div>
              <div className="space-y-1.5 font-ghost-mono text-[11px] overflow-x-auto">
                {HEX_ROWS.map((r) => (
                  <div key={r.offset} className="flex gap-3 whitespace-nowrap">
                    <span className="text-slate-500">{r.offset}</span>
                    <span className="text-[#00E5FF]">{r.hex}</span>
                    <span className="text-[#00FF41]">{r.ascii}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-2.5">
              <div className="text-xs font-ghost-mono text-[#00FF41]">Extracted EXIF Metadata</div>
              <div className="text-xs space-y-1.5 font-ghost-mono">
                <div className="flex justify-between border-b border-slate-800 py-1">
                  <span className="text-slate-400">Magic Bytes</span>
                  <span className="text-[#00FF41]">FF D8 FF E1 (Valid JPEG/EXIF)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 py-1">
                  <span className="text-slate-400">GPS Coordinates</span>
                  <span className="text-[#FF003C]">19.0760° N, 72.8777° E (Mumbai)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 py-1">
                  <span className="text-slate-400">Camera Model</span>
                  <span className="text-slate-200">Pixel-Lab-Sim 8</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Software Tag</span>
                  <span className="text-slate-200">ExifTool Scrub Test</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'triage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-ghost-mono text-[#00E5FF]">Evidence Payload Buffer</span>
                <button
                  type="button"
                  onClick={computeSha256}
                  className="px-3.5 py-2 min-h-[38px] rounded-lg bg-[#00FF41] hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Sign SHA-256 Digest
                </button>
              </div>
              <textarea
                value={rawArtifact}
                onChange={(e) => {
                  setRawArtifact(e.target.value);
                  setArtifactHash('');
                }}
                rows={7}
                className="w-full rounded-lg bg-[#060910] border border-slate-700 p-3 text-xs font-ghost-mono text-slate-200 focus:outline-none focus:border-[#00E5FF]"
                placeholder="Paste raw forensic log lines or evidence text..."
              />
              {artifactHash && (
                <div className="rounded-lg bg-[#060910] border border-[#00FF41]/30 p-3 space-y-1">
                  <div className="text-[11px] font-ghost-mono text-[#00FF41]">
                    Chain-of-Custody SHA-256 (Web Crypto)
                  </div>
                  <div className="text-[11px] font-ghost-mono text-slate-200 break-all select-all">
                    {artifactHash}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 space-y-3">
              <div className="text-xs font-ghost-mono text-[#00FF41]">
                Automated IOC Extraction ({extractedIocs.ips.length} IPs · {extractedIocs.paths.length} Paths · {extractedIocs.anomalies.length} Alerts)
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400 mb-1">IPv4 Indicators (click to copy to verifier)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedIocs.ips.length === 0 ? (
                      <span className="text-slate-500 font-ghost-mono">No IPv4 addresses detected</span>
                    ) : (
                      extractedIocs.ips.map((ip) => (
                        <button
                          key={ip}
                          type="button"
                          onClick={() => setClueAnswer(ip)}
                          className="px-2.5 py-1 rounded bg-[#FF003C]/15 border border-[#FF003C]/40 text-[#FF003C] font-ghost-mono text-[11px] hover:bg-[#FF003C]/25 cursor-pointer"
                        >
                          {ip}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 mb-1">Targeted Filesystem Paths</div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedIocs.paths.length === 0 ? (
                      <span className="text-slate-500 font-ghost-mono">No sensitive paths detected</span>
                    ) : (
                      extractedIocs.paths.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-1 rounded bg-[#060910] border border-slate-700 text-[#00E5FF] font-ghost-mono text-[11px]"
                        >
                          {p}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 mb-1">Anomalous Events ({extractedIocs.anomalies.length})</div>
                  <div className="rounded-lg bg-[#060910] border border-slate-800 p-2.5 max-h-28 overflow-y-auto space-y-1 font-ghost-mono text-[11px] text-amber-200">
                    {extractedIocs.anomalies.length === 0 ? (
                      <div className="text-slate-500">No suspicious events matched.</div>
                    ) : (
                      extractedIocs.anomalies.map((line, idx) => (
                        <div key={idx} className="truncate">{line}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Evidence Submission */}
        <div className="rounded-xl border border-slate-800 bg-[#0D1322] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={clueAnswer}
            onChange={(e) => setClueAnswer(e.target.value)}
            placeholder="Submit clue found (e.g. suspicious IP or GPS latitude 19.0760)..."
            className="flex-1 px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#060910] border border-slate-700 text-xs sm:text-sm font-ghost-mono text-white focus:outline-none focus:border-[#00E5FF]"
          />
          <button
            type="button"
            onClick={checkEvidence}
            className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#00FF41] hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
          >
            Verify Evidence
          </button>
          {verified && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00FF41]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Evidence Confirmed (+60 XP)</span>
            </div>
          )}
        </div>
      </div>
    </ModuleFrame>
  );
};

