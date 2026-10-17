import React, { useState, useMemo } from 'react';
import {
  Shield,
  ArrowRight,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Activity,
  Globe,
  Hash
} from 'lucide-react';

export interface ThreatIntelAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const ThreatIntelApp: React.FC<ThreatIntelAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<'ioc-extractor' | 'mitre' | 'pyramid'>('ioc-extractor');

  // IOC Extractor State
  const [rawLogText, setRawLogText] = useState(
    `Incident Alert: Suspicious outbound beacon observed from host 10.0.4.15 connecting to malicious C2 server 198.51.100.45 and backup domain update-sync-microsoft.xyz. 
The dropped executable binary hash was sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (MD5: 5d41402abc4b2a76b9719d911017c592).
Target exploited CVE-2023-38606 via phishing attachment.`
  );

  const extractedIocs = useMemo(() => {
    const text = rawLogText;
    const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
    const sha256Regex = /\b[A-Fa-f0-9]{64}\b/g;
    const md5Regex = /\b[A-Fa-f0-9]{32}\b/g;
    const cveRegex = /\bCVE-\d{4}-\d{4,7}\b/gi;
    const domainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:com|net|org|xyz|io|info|biz|ru|cn)\b/gi;

    const ips = Array.from(new Set(text.match(ipRegex) || []));
    const sha256 = Array.from(new Set(text.match(sha256Regex) || []));
    const md5 = Array.from(new Set(text.match(md5Regex) || []));
    const cves = Array.from(new Set(text.match(cveRegex) || []));
    const domains = Array.from(new Set(text.match(domainRegex) || []));

    return { ips, sha256, md5, cves, domains };
  }, [rawLogText]);

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-rose-400 bg-clip-text text-transparent">
                      Threat Intel Hub
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      MITRE &amp; IOC Extraction
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Automated IOC regex parser, MITRE ATT&amp;CK matrix &amp; Pyramid of Pain
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

          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'ioc-extractor', label: '1. 🔍 Automated IOC Extractor', icon: Search },
              { id: 'mitre', label: '2. 🎯 MITRE ATT&CK Matrix', icon: Shield },
              { id: 'pyramid', label: '3. 🔺 Pyramid of Pain', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: IOC EXTRACTOR */}
        {activeTab === 'ioc-extractor' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Automated Indicators of Compromise (IOC) Extractor</h2>
            <p className="text-xs text-slate-400">
              Paste raw threat intelligence reports, SIEM incident logs, or email headers to extract all IPs, domains, hashes, and CVEs automatically.
            </p>

            <div className="space-y-4">
              <textarea
                rows={4}
                value={rawLogText}
                onChange={(e) => setRawLogText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
                placeholder="Paste raw log data here..."
              />

              {/* Extracted Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-400 block uppercase font-sans">IP Addresses ({extractedIocs.ips.length})</span>
                  {extractedIocs.ips.map((ip, i) => (
                    <div key={i} className="text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 truncate">{ip}</div>
                  ))}
                  {extractedIocs.ips.length === 0 && <span className="text-slate-500 italic">None</span>}
                </div>

                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 block uppercase font-sans">Domains &amp; URLs ({extractedIocs.domains.length})</span>
                  {extractedIocs.domains.map((dom, i) => (
                    <div key={i} className="text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 truncate">{dom}</div>
                  ))}
                  {extractedIocs.domains.length === 0 && <span className="text-slate-500 italic">None</span>}
                </div>

                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 block uppercase font-sans">Cryptographic Hashes ({extractedIocs.sha256.length + extractedIocs.md5.length})</span>
                  {extractedIocs.sha256.map((h, i) => (
                    <div key={i} className="text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 truncate text-[10px]">SHA: {h}</div>
                  ))}
                  {extractedIocs.md5.map((h, i) => (
                    <div key={i} className="text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 truncate text-[10px]">MD5: {h}</div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
                  <span className="font-bold text-rose-400 block uppercase font-sans">CVE Vulnerabilities ({extractedIocs.cves.length})</span>
                  {extractedIocs.cves.map((cve, i) => (
                    <div key={i} className="text-slate-200 bg-slate-900 p-2 rounded-lg border border-slate-800 font-bold">{cve}</div>
                  ))}
                  {extractedIocs.cves.length === 0 && <span className="text-slate-500 italic">None</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MITRE ATT&CK */}
        {activeTab === 'mitre' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">MITRE ATT&amp;CK Enterprise Tactics Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {[
                { id: 'TA0043', name: 'Reconnaissance', desc: 'Gathering target employee info and DNS records.' },
                { id: 'TA0001', name: 'Initial Access', desc: 'Phishing, public facing exploit, valid accounts.' },
                { id: 'TA0002', name: 'Execution', desc: 'Running malicious code via PowerShell, bash, or macros.' },
                { id: 'TA0003', name: 'Persistence', desc: 'Maintaining access across reboots (Registry Run keys, Cron jobs).' },
                { id: 'TA0004', name: 'Privilege Escalation', desc: 'Gaining root or domain admin permissions.' },
                { id: 'TA0005', name: 'Defense Evasion', desc: 'Disabling antivirus, timestomping, process injection.' },
                { id: 'TA0006', name: 'Credential Access', desc: 'Dumping LSASS memory, mimikatz, kerberoasting.' },
                { id: 'TA0007', name: 'Discovery', desc: 'Listing network shares, active directory computers.' },
                { id: 'TA0008', name: 'Lateral Movement', desc: 'Passing the hash, SSH tunneling, PSExec.' },
                { id: 'TA0009', name: 'Collection', desc: 'Screen capture, keylogging, copying sensitive databases.' },
                { id: 'TA0011', name: 'Command & Control', desc: 'Encrypted beacons over HTTPS or DNS tunneling.' },
                { id: 'TA0010', name: 'Exfiltration', desc: 'Stealing data via cloud storage or webhooks.' }
              ].map((tac, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-400 font-mono text-[10px]">{tac.id}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{tac.name}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{tac.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PYRAMID OF PAIN */}
        {activeTab === 'pyramid' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">David Bianco&apos;s Pyramid of Pain</h2>
            <p className="text-xs text-slate-400">
              Measures how much distress you cause an adversary by taking away each type of Indicator of Compromise (IoC).
            </p>
            <div className="space-y-3">
              {[
                { level: 'TTPs (Tactics, Techniques, Procedures)', pain: 'Tough! (Forces adversary to invent completely new attack methods)', color: 'border-rose-500 bg-rose-950/40 text-rose-300' },
                { level: 'Tools (Mimikatz, Cobalt Strike, Nmap)', pain: 'Challenging (Adversary must find or author alternative software)', color: 'border-amber-500 bg-amber-950/40 text-amber-300' },
                { level: 'Network / Host Artifacts (URI patterns)', pain: 'Annoying (Changes configuration on proxy/C2)', color: 'border-yellow-500 bg-yellow-950/40 text-yellow-300' },
                { level: 'Domain Names (Dynamic DNS, C2 domains)', pain: 'Simple (Adversary buys a new $1 domain)', color: 'border-blue-500 bg-blue-950/40 text-blue-300' },
                { level: 'IP Addresses (Fast-flux, VPN egress)', pain: 'Trivial (Adversary switches proxy IP in 2 seconds)', color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300' },
                { level: 'Hash Values (SHA-256, MD5)', pain: 'Trivial (Changing 1 byte in malware creates a new hash)', color: 'border-slate-600 bg-slate-850 text-slate-300' }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${item.color} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs`}>
                  <span className="font-bold text-white text-sm">{item.level}</span>
                  <span className="font-mono text-[11px]">{item.pain}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
