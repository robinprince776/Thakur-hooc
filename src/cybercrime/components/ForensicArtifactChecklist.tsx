import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  Terminal,
  Database,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Eye,
  Folder,
  Layers,
  Shield,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { FORENSIC_ARTIFACTS, ForensicArtifactItem } from '../data/mobileSecData';

interface ForensicArtifactChecklistProps {
  onSelectArtifact?: (artifact: ForensicArtifactItem) => void;
  selectedArtifactId?: string;
  className?: string;
}

export const ForensicArtifactChecklist: React.FC<ForensicArtifactChecklistProps> = ({
  onSelectArtifact,
  selectedArtifactId = 'sms_mmssms',
  className = ''
}) => {
  const [auditedState, setAuditedState] = useState<Record<string, boolean>>({
    sms_mmssms: true,
    chrome_history: true,
    android_browser_history: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Triage Report Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatedReportText, setGeneratedReportText] = useState('');

  const SIMULATION_STAGES = [
    { title: 'Connecting via ADB Shell', log: 'adb connect 127.0.0.1:5555: Authenticated device serial RF8N90XYZ12 (Android 14)' },
    { title: 'Verifying Security & Encryption', log: 'ro.crypto.state: encrypted (FBE AES-256). Root privilege granted via su binary.' },
    { title: 'Acquiring Telephony & SMS Database', log: 'Pulling /data/data/com.android.providers.telephony/databases/mmssms.db [1,042 rows parsed]' },
    { title: 'Acquiring Stock & Chrome Browser DBs', log: 'Extracted /data/data/com.android.browser/databases/history.db & Chrome History WebKit records' },
    { title: 'Extracting Contacts & Call Logs', log: 'Inspected /data/data/com.android.providers.contacts/databases/contacts2.db & calllog.db' },
    { title: 'Auditing System Registry & Crash Logs', log: 'Parsing /data/system/packages.xml & dumping /data/system/dropbox/ event anomalies' },
    { title: 'Cross-Correlating Smishing Vectors', log: 'Found 3 smishing threats: Sender VK-SBIINB linked to malicious URL sbi-kyc-verify.top' },
    { title: 'Generating Triage Report & Hash', log: 'SHA-256 Digital Signature generated. Forensic triage report compiled successfully.' }
  ];

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleAudited = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAuditedState((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAll = (status: boolean) => {
    const updated: Record<string, boolean> = {};
    FORENSIC_ARTIFACTS.forEach((a) => (updated[a.id] = status));
    setAuditedState(updated);
  };

  const auditedCount = FORENSIC_ARTIFACTS.filter((a) => auditedState[a.id]).length;
  const auditPercent = Math.round((auditedCount / FORENSIC_ARTIFACTS.length) * 100);

  // Filtered artifacts
  const filtered = FORENSIC_ARTIFACTS.filter((a) => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.absolutePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.databaseOrFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.forensicValue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Start the interactive simulation of the forensic report
  const startReportSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(5);
    setSimulationStepIndex(0);
    setSimulationLogs(['[START] Initializing Digital Forensics & Incident Response (DFIR) Triage Engine...']);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < SIMULATION_STAGES.length) {
        setSimulationStepIndex(step);
        setSimulationProgress(Math.round(((step + 1) / SIMULATION_STAGES.length) * 100));
        setSimulationLogs((prev) => [...prev, `[${SIMULATION_STAGES[step].title}] ${SIMULATION_STAGES[step].log}`]);
      } else {
        clearInterval(interval);
        finalizeReport();
      }
    }, 700);
  };

  const finalizeReport = () => {
    setIsSimulating(false);
    setSimulationProgress(100);

    const now = new Date();
    const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    const reportContent = `# ANDROID DFIR FORENSIC TRIAGE REPORT
================================================================================
Generated Timestamp: ${now.toUTCString()} (IST: ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })})
Investigator Agency: TechMaster Forensic Cyber Defense Unit
Target Device Model: Samsung Galaxy S24 Ultra (SM-S928B) / Android 14 (API 34)
Device Storage State: File-Based Encryption (FBE - AES-256-XTS) ACTIVE
Evidence Integrity Hash (SHA-256): ${hash}
Audited Coverage: ${auditedCount} / ${FORENSIC_ARTIFACTS.length} Log Artifacts (${auditPercent}%)

--------------------------------------------------------------------------------
1. EXECUTIVE INCIDENT SUMMARY
--------------------------------------------------------------------------------
A forensic acquisition was executed to triage an alleged smishing and banking OTP
compromise. Analysis confirms inbound malicious SMS from header 'VK-SBIINB' advising
victim of impending bank KYC freeze. The embedded URL was navigated via Android Browser
and Google Chrome, following which an unauthorized trojanized APK was sideloaded.

--------------------------------------------------------------------------------
2. KEY EVIDENCE FINDINGS & PATH CORRELATION
--------------------------------------------------------------------------------
[CRITICAL EVIDENCE 01 - TELEPHONY PROVIDER]
• Path: /data/data/com.android.providers.telephony/databases/mmssms.db
• Record ID: #1042
• Sender Address: VK-SBIINB (Anomalous TRAI DLT header)
• Message Body: "Dear Customer, your SBI account will be blocked today due to pending KYC. Update PAN: https://sbi-kyc-verify.top/login"
• SMSC Service Center: +919822000000 | Type: 1 (Inbox) | Read: 1 (Read by victim)

[CRITICAL EVIDENCE 02 - ANDROID WEB BROWSERS]
• Path: /data/data/com.android.browser/databases/history.db
• Path: /data/data/com.android.chrome/app_chrome/Default/History
• Phishing Landing Page: https://sbi-kyc-verify.top/login.php?ref=sms_1042
• WebKit Visit Timestamp: 13373738521000000 (Converted: Oct 18, 2024, 10:42:01 UTC)
• Secondary Download: https://fastapkdownload.xyz/files/torch_v3.apk (Size: 14.2 MB)

[CRITICAL EVIDENCE 03 - PACKAGE MANAGER REGISTRY]
• Path: /data/system/packages.xml
• Sideloaded Rogue App: com.flashlight.superbright.pro (UID: 10214)
• Granted Risky Permissions:
    - android.permission.READ_SMS
    - android.permission.RECEIVE_SMS
    - android.permission.BIND_ACCESSIBILITY_SERVICE
    - android.permission.SYSTEM_ALERT_WINDOW

[CRITICAL EVIDENCE 04 - SYSTEM EVENT & CRASH LOGS]
• Path: /data/system/dropbox/ & /data/tombstones/
• Event: data_app_crash@1729248225000.txt.gz
• Fault: SIGSEGV (SEGV_MAPERR) triggered by libnative-exploit.so during privilege escalation

--------------------------------------------------------------------------------
3. ARTIFACTS INVESTIGATION INVENTORY CHECKLIST
--------------------------------------------------------------------------------
${FORENSIC_ARTIFACTS.map(
  (art, idx) => `[${auditedState[art.id] ? 'X' : ' '}] ${idx + 1}. ${art.name}
     Target Path: ${art.absolutePath}
     Format: ${art.format} | Permissions: ${art.requiresRoot ? 'ROOT (su)' : 'USER SPACE'}
     Audit Status: ${auditedState[art.id] ? 'COMPLETED & VERIFIED' : 'PENDING ACQUISITION'}
     Investigative Purpose: ${art.forensicValue}
`
).join('\n')}

--------------------------------------------------------------------------------
4. DFIR RECOMMENDATIONS & CHAIN OF CUSTODY
--------------------------------------------------------------------------------
1. Isolate device radio connectivity (Airplane Mode + Faraday RF pouch).
2. Retain bit-stream image (E01 / raw dd) with verified SHA-256 checksum.
3. Report suspect sender headers and domains to Chakshu (sancharsaathi.gov.in/sfc).
4. Revoke compromised banking net-banking credentials and issue SIM swap lock.

================================================================================
END OF FORENSIC TRIAGE REPORT
================================================================================`;

    setGeneratedReportText(reportContent);
    setShowReportModal(true);
  };

  const downloadReportFile = () => {
    const blob = new Blob([generatedReportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Android_Forensic_Triage_Report_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Banner & Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                DFIR Forensic Utility
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Android 14+ Log Paths
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white font-mono flex items-center gap-2">
              <Folder className="w-6 h-6 text-cyan-400" />
              Forensic Artifact Checklist &amp; Android Log Triage
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Investigate common Android log paths, SQLite databases, and system event registries. Trace smishing SMS in{' '}
              <code className="text-amber-300 font-mono">mmssms.db</code>, browsing histories in{' '}
              <code className="text-amber-300 font-mono">history.db</code>, and app package permissions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={startReportSimulation}
              disabled={isSimulating}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                isSimulating
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 cursor-wait'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-950/50'
              }`}
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Simulating Triage ({simulationProgress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Simulate Forensic Triage Report</span>
                </>
              )}
            </button>

            {generatedReportText && !isSimulating && (
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-all"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>View Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Simulation Progress Banner */}
        {isSimulating && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 animate-fade-in space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Step {simulationStepIndex + 1}/{SIMULATION_STAGES.length}: {SIMULATION_STAGES[simulationStepIndex]?.title}
              </span>
              <span className="text-amber-400 font-bold">{simulationProgress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/60 rounded-full h-2 border border-slate-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-amber-400 h-full transition-all duration-500"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>

            <div className="bg-black/80 rounded-lg p-2.5 border border-slate-800/80 font-mono text-[11px] text-slate-300 truncate">
              {simulationLogs[simulationLogs.length - 1]}
            </div>
          </div>
        )}

        {/* Audit Metric Bar & Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono text-slate-400">
              Audited: <span className="text-emerald-400 font-bold">{auditedCount}</span> / {FORENSIC_ARTIFACTS.length} ({auditPercent}%)
            </div>
            <div className="w-28 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${auditPercent}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => markAll(true)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Mark All Audited
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => markAll(false)}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Common Android Log Paths Quick Reference Card */}
      <div className="bg-[#0B1120] border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono font-bold text-xs md:text-sm text-cyan-300 uppercase tracking-wider">
              Common Android Log Paths Reference (Essential DFIR Locations)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            AOSP &amp; OEM Target Paths
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[
            {
              label: 'Telephony & SMS Inbox Database',
              path: '/data/data/com.android.providers.telephony/databases/mmssms.db',
              tag: 'SMS / OTP'
            },
            {
              label: 'Default Stock Android Browser History',
              path: '/data/data/com.android.browser/databases/history.db',
              tag: 'AOSP Browser'
            },
            {
              label: 'Google Chrome Web History & Downloads',
              path: '/data/data/com.android.chrome/app_chrome/Default/History',
              tag: 'Chrome'
            },
            {
              label: 'Contacts & People Provider Database',
              path: '/data/data/com.android.providers.contacts/databases/contacts2.db',
              tag: 'Contacts'
            },
            {
              label: 'Dialer & Call Logs Database',
              path: '/data/data/com.android.providers.contacts/databases/calllog.db',
              tag: 'Call Logs'
            },
            {
              label: 'Package Manager Registry & Permissions',
              path: '/data/system/packages.xml',
              tag: 'App Installs'
            },
            {
              label: 'Android DropBox Service Crash Logs',
              path: '/data/system/dropbox/',
              tag: 'System Crashes'
            },
            {
              label: 'Radio & Baseband Memory Ring Buffer',
              path: 'logcat -b radio (/dev/socket/logd)',
              tag: 'Cellular PDU'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all font-mono"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-bold">{item.tag}</span>
                  <span className="text-[11px] text-slate-300 font-semibold truncate">{item.label}</span>
                </div>
                <div className="text-[10px] text-cyan-400/90 truncate mt-0.5">{item.path}</div>
              </div>
              <button
                onClick={() => handleCopy(item.path, 'quick_' + idx)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] shrink-0 flex items-center gap-1 transition-all"
                title="Copy Path"
              >
                {copiedKey === 'quick_' + idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by path (e.g. mmssms.db, history.db, dropbox)..."
            className="w-full pl-9 pr-3 py-2 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Telephony & SMS', 'Browsers & Webview', 'Contacts & Calls', 'System & Event Logs'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-black/40 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Artifacts Table & Checklist */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1">
          <span>INVESTIGATIVE ARTIFACT REGISTRY ({filtered.length} ARTIFACTS)</span>
          <span className="text-[10px] text-slate-500">Click row or item to inspect schemas and forensic queries</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((artifact) => {
            const isAudited = auditedState[artifact.id] || false;
            const isSelected = selectedArtifactId === artifact.id;

            return (
              <div
                key={artifact.id}
                onClick={() => onSelectArtifact?.(artifact)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500/80 ring-1 ring-cyan-500/30 shadow-xl'
                    : 'bg-[#0B1120] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  {/* Left: Checkbox + Meta */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={(e) => toggleAudited(artifact.id, e)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                        isAudited
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-700 bg-black/60 hover:border-slate-500 text-transparent'
                      }`}
                      title={isAudited ? 'Mark as Pending' : 'Mark as Audited'}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">{artifact.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-slate-700">
                          {artifact.databaseOrFileName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            artifact.requiresRoot
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {artifact.requiresRoot ? 'ROOT REQUIRED' : 'USER SPACE'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{artifact.category}</span>
                      </div>

                      {/* Absolute Path Box */}
                      <div className="flex items-center justify-between gap-2 bg-black/60 border border-slate-800/80 rounded-xl px-3 py-1.5 font-mono text-xs">
                        <span className="text-cyan-300 truncate">{artifact.absolutePath}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(artifact.absolutePath, 'path_' + artifact.id);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] shrink-0 flex items-center gap-1 transition-all"
                        >
                          {copiedKey === 'path_' + artifact.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Path</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Forensic Value Description */}
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        {artifact.forensicValue}
                      </p>

                      {/* Key Tables & Extraction Command Snippet */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-500">
                        <span>
                          <strong className="text-slate-400">Tables:</strong> {artifact.primaryTablesOrSections.join(', ')}
                        </span>
                        <span>•</span>
                        <span>
                          <strong className="text-slate-400">Format:</strong> {artifact.format}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg ${
                        isAudited
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {isAudited ? '✓ Audited' : '○ Pending'}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtifact?.(artifact);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1 transition-all"
                    >
                      <span>Inspect Queries</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forensic Triage Report Modal */}
      {showReportModal && (
        <div
          onClick={() => setShowReportModal(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1120] border border-cyan-500/40 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl font-mono text-xs text-slate-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Android DFIR Forensic Triage Report</h3>
                  <p className="text-[10px] text-slate-400">Generated automatically via simulated log artifact acquisition</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Report Content */}
            <div className="flex-1 overflow-y-auto space-y-3 bg-black/80 p-4 rounded-2xl border border-slate-800 text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono">
              {generatedReportText}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-4">
              <div className="text-[10px] text-slate-400">
                Evidence hash verified. Ready for judicial chain-of-custody archive.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(generatedReportText, 'modal_report')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5"
                >
                  {copiedKey === 'modal_report' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
                <button
                  onClick={downloadReportFile}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950/50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report (.md)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
