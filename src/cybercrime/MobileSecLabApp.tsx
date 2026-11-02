import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone,
  Shield,
  ShieldAlert,
  Wifi,
  Terminal,
  Search,
  Key,
  Layers,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Unlock,
  Radio,
  Cpu,
  Zap,
  Globe,
  Sliders,
  Share2,
  FileText,
  ChevronRight,
  Send,
  Database,
  ArrowRight,
  BookOpen,
  Award,
  PhoneCall,
  Info,
  Scale,
  Copy,
  Check,
  Folder,
  Download,
  Clock
} from 'lucide-react';

import {
  TRAI_DLT_HEADERS,
  DLT_VULNERABILITY_EXPLANATION,
  ANDROID_PERMISSIONS_MATRIX,
  ADB_COMMANDS_REFERENCE,
  SANCHAR_SAATHI_MODULES,
  DEVICE_HARDENING_ITEMS,
  FORENSIC_ARTIFACTS,
  ForensicArtifactItem
} from './data/mobileSecData';
import { ForensicArtifactChecklist } from './components/ForensicArtifactChecklist';
import { RansomwareTimelineOverlay } from './components/RansomwareTimelineOverlay';

interface MobileSecLabAppProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

type MobileSecTabId = 'smishing' | 'permissions' | 'eviltwin' | 'adb' | 'forensics';
type MobileSecSubMode = 'sandbox' | 'artifacts' | 'protocols' | 'dlt' | 'sancharsaathi' | 'hardening';

export const MobileSecLabApp: React.FC<MobileSecLabAppProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeTab, setActiveTab] = useState<MobileSecTabId>('smishing');
  const [subMode, setSubMode] = useState<MobileSecSubMode>('sandbox');
  const [ransomwareTimelineOpen, setRansomwareTimelineOpen] = useState<boolean>(false);

  // --- Module 1: Smishing State ---
  const [smishingSenderId, setSmishingSenderId] = useState<string>('VK-SBIINB');
  const [smishingBody, setSmishingBody] = useState<string>(
    'Dear Customer, your SBI YONO account will be blocked today due to pending KYC. Update PAN immediately at: https://sbi-kyc-verify.top/login'
  );

  // --- Module 2: Permissions & Privilege Escalation State ---
  const [activeAndroidLayer, setActiveAndroidLayer] = useState<'app' | 'framework' | 'binder' | 'kernel'>('framework');
  const [escalationTriggered, setEscalationTriggered] = useState<boolean>(false);

  // --- Module 3: Evil Twin Wi-Fi State ---
  const [wifiSecurityMode, setWifiSecurityMode] = useState<'http' | 'https' | 'vpn'>('http');
  const [wifiConnectedAP, setWifiConnectedAP] = useState<'legit' | 'evil'>('evil');

  // --- Module 4: ADB Terminal State ---
  const [adbInput, setAdbInput] = useState<string>('');
  const [adbTerminalHistory, setAdbTerminalHistory] = useState<Array<{ cmd: string; output: string | string[] }>>([
    {
      cmd: 'adb devices',
      output: [
        'List of devices attached',
        'RF8N90XYZ12    device (Android 14 / OneUI 6.1)',
        'daemon not running; starting now at tcp:5037',
        'daemon started successfully'
      ]
    }
  ]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // --- Module 5: Mobile Forensics & Anti-Theft State ---
  const [remoteWipeConfirmed, setRemoteWipeConfirmed] = useState<boolean>(false);

  // --- Hardening Checklist State ---
  const [completedHardening, setCompletedHardening] = useState<Record<string, boolean>>({
    sim_pin: false,
    usb_debug: true,
    lockscreen_notifications: false,
    auto_wifi_join: false,
    accessibility_audit: true,
    find_my_device: true,
    install_unknown_apps: true,
    screen_pinning: false
  });

  // Calculate hardening score
  const calculateHardeningScore = () => {
    const total = DEVICE_HARDENING_ITEMS.length;
    const completed = DEVICE_HARDENING_ITEMS.filter((item) => completedHardening[item.id]).length;
    return Math.round((completed / total) * 100);
  };

  // --- Forensic Artifacts Checklist State ---
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('sms_mmssms');
  const [artifactFilter, setArtifactFilter] = useState<string>('All');
  const [auditedArtifacts, setAuditedArtifacts] = useState<Record<string, boolean>>({
    sms_mmssms: true,
    chrome_history: true
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showEvidenceQueryRows, setShowEvidenceQueryRows] = useState<boolean>(true);
  const [webkitTimestampInput, setWebkitTimestampInput] = useState<string>('13373738521000000');
  const [triageReportModalOpen, setTriageReportModalOpen] = useState<boolean>(false);

  const handleCopyText = (text: string, id: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const convertWebkitTime = (val: string) => {
    try {
      const num = parseFloat(val.trim());
      if (isNaN(num) || num <= 0) return 'Invalid WebKit Timestamp';
      // WebKit epoch starts Jan 1, 1601 UTC
      const ms = (num / 1000) - 11644473600000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) return 'Timestamp out of range';
      return `${d.toUTCString()} (IST: ${d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })})`;
    } catch {
      return 'Conversion error';
    }
  };

  const selectedArtifact = FORENSIC_ARTIFACTS.find((a) => a.id === selectedArtifactId) || FORENSIC_ARTIFACTS[0];

  const filteredArtifacts = FORENSIC_ARTIFACTS.filter((a) => {
    if (artifactFilter === 'All') return true;
    return a.category === artifactFilter;
  });

  const auditedCount = FORENSIC_ARTIFACTS.filter((a) => auditedArtifacts[a.id]).length;

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [adbTerminalHistory]);

  // Smishing Analyzer Logic
  const analyzeSmishingRisk = (body: string, sender: string) => {
    let score = 0;
    const reasons: string[] = [];

    if (/(immediately|blocked|tonight|suspend|urgent|penalty|overdue)/i.test(body)) {
      score += 35;
      reasons.push('Coercive Urgency Trigger: Pressures user into rash action without thinking.');
    }
    if (/(\.top|\.xyz|\.click|\.vip|\.info|\.ru|\.work)/i.test(body)) {
      score += 40;
      reasons.push('Suspicious TLD: Links point to cheap/throwaway domains commonly abused by scam gangs.');
    }
    if (/(sbi|hdfc|yono|indiapost|icici).*\.(top|xyz|link|site)/i.test(body)) {
      score += 25;
      reasons.push('Brand Typosquatting: Domain impersonates official bank/post-office names.');
    }
    if (!/^[A-Z]{2}-[A-Z0-9]{6}$/.test(sender)) {
      score += 15;
      reasons.push('Anomalous Sender ID: Format deviates from Telecom DLT approved templates.');
    }

    return {
      score: Math.min(score, 99),
      isSmishing: score >= 50,
      reasons
    };
  };

  const smishingReport = analyzeSmishingRisk(smishingBody, smishingSenderId);

  // ADB Command Processor
  const handleRunAdbCommand = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun || adbInput).trim();
    if (!rawCmd) return;

    let output: string | string[] = '';

    const lower = rawCmd.toLowerCase();
    if (lower === 'clear') {
      setAdbTerminalHistory([]);
      setAdbInput('');
      return;
    } else if (lower === 'help') {
      output = [
        'Available Educational ADB Commands:',
        '  adb devices                             - List attached hardware & authorization state',
        '  adb shell getprop ro.build.version.release - Query running Android OS release',
        '  adb shell getprop ro.crypto.state      - Check hardware encryption status (FBE/FDE)',
        '  adb shell pm list packages -3          - Inspect 3rd-party user installed apps',
        '  adb shell dumpsys accessibility        - List active accessibility listeners (Trojans)',
        '  adb shell screencap -p /sdcard/sc.png   - Capture screen buffer silently without prompt',
        '  adb pull /sdcard/sc.png                 - Exfiltrate file from mobile storage to PC',
        '  adb shell dumpsys battery               - Read battery telemetry and charging status',
        '  adb install trojan_payload.apk          - Sideload app bypassing Google Play Protect',
        '  clear                                   - Clear terminal buffer'
      ];
    } else if (lower === 'adb devices') {
      output = [
        'List of devices attached',
        'RF8N90XYZ12    device (Android 14 / OneUI 6.1)',
        'Status: Authorized via RSA Key (Juice-Jacking Window Open)'
      ];
    } else if (lower.includes('ro.crypto.state')) {
      output = 'encrypted (File-Based Encryption - FBE with AES-256-XTS & Titan M Secure Element)';
    } else if (lower.includes('dumpsys accessibility')) {
      output = [
        'Active Accessibility Services:',
        '  Service: com.flashlight.superbright.pro/.MaliciousAccessibilityService',
        '  Flags: FLAG_RETRIEVE_INTERACTIVE_WINDOWS | FLAG_REQUEST_TOUCH_EXPLORATION_MODE',
        '  Feedback: FEEDBACK_ALL_MASK (Listening to all UI text)'
      ];
    } else if (lower.includes('ro.build.version.release')) {
      output = '14';
    } else if (lower.includes('pm list packages -3')) {
      output = [
        'package:com.whatsapp',
        'package:com.instagram.android',
        'package:com.google.android.apps.authenticator2',
        'package:com.flashlight.superbright.pro (⚠️ MALICIOUS - ACCESSIBILITY SERVICE INJECTED)'
      ];
    } else if (lower.includes('screencap')) {
      output = '[+] Screenshot captured successfully into /sdcard/sc.png (1080x2400 PNG - 3.2MB).';
    } else if (lower.includes('pull')) {
      output = [
        'Pulling /sdcard/sc.png to ./evidence_sc.png...',
        '/sdcard/sc.png: 1 file pulled, 0 skipped. 24.8 MB/s (3355443 bytes in 0.128s)'
      ];
    } else if (lower.includes('dumpsys battery')) {
      output = [
        'Current Battery Service state:',
        '  AC powered: true',
        '  USB powered: true (Juice-Jacking Vulnerable)',
        '  level: 84',
        '  scale: 100',
        '  voltage: 4180mV',
        '  temperature: 312 (31.2°C)'
      ];
    } else if (lower.includes('install')) {
      output = [
        'Performing Streamed Install...',
        'Success (App installed with requested dangerous permissions: READ_SMS, BIND_ACCESSIBILITY_SERVICE).'
      ];
    } else {
      output = `adb: command not recognized: "${rawCmd}". Type 'help' for instructions.`;
    }

    setAdbTerminalHistory((prev) => [...prev, { cmd: rawCmd, output }]);
    setAdbInput('');
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ⚠️ Permanent Educational Warning Badge */}
      <div className="w-full bg-rose-950/90 border-b border-rose-500/40 px-4 py-2 flex items-center justify-between text-xs text-rose-200 font-mono tracking-wide sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-center text-center">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
          <span className="font-semibold">
            ⚠️ Educational Sandbox. No Real Attacks. Strictly for Defensive Learning &amp; Mobile Security Auditing.
          </span>
        </div>
      </div>

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950/60 border border-cyan-400/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                  MobileSec Lab <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-sans">#mobilesec</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Smartphone Internal Architecture, TRAI DLT Headers, Evil Twin Wi-Fi &amp; Sanchar Saathi CEIR
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setRansomwareTimelineOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-rose-950/50"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-200 animate-pulse" />
              <span>Ransomware Timeline (MITRE)</span>
            </button>
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>All Apps</span>
              </button>
            )}
            {onBackToHub && (
              <button
                onClick={onBackToHub}
                className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all"
              >
                Back to OS Hub
              </button>
            )}
          </div>
        </div>

        {/* 5 Module Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'smishing', label: '1. Smishing Sandbox', icon: Smartphone, desc: 'Sender ID & Domain Phishing' },
            { id: 'permissions', label: '2. OS Architecture', icon: Layers, desc: 'Privilege Escalation & IPC' },
            { id: 'eviltwin', label: '3. Evil Twin Wi-Fi', icon: Wifi, desc: 'Rogue AP & TLS/VPN Sniffer' },
            { id: 'adb', label: '4. ADB God Mode', icon: Terminal, desc: 'Terminal & Juice Jacking' },
            { id: 'forensics', label: '5. Mobile Forensics', icon: Shield, desc: 'BLE Mesh, IMEI & Anti-Theft' }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MobileSecTabId)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono hidden sm:block">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-Navigation Mode Bar */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'sandbox', label: '🔬 Interactive Lab' },
            { id: 'artifacts', label: '🕵️ Forensic Artifacts Checklist' },
            { id: 'protocols', label: '⚙️ Android Permissions Matrix' },
            { id: 'dlt', label: '📡 TRAI DLT Telecom Headers' },
            { id: 'sancharsaathi', label: '🇮🇳 Sanchar Saathi & CEIR' },
            { id: 'hardening', label: '🛡️ 10-Factor Device Hardening Audit' }
          ].map((mode) => {
            const active = subMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSubMode(mode.id as MobileSecSubMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                  active
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* SUB-MODE 1: INTERACTIVE SANDBOXES */}
        {/* ========================================================================= */}
        {subMode === 'sandbox' && (
          <>
            {/* MODULE 1: SMISHING */}
            {activeTab === 'smishing' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Attack Vector 01 · SMS Phishing (Smishing) &amp; DLT Header Spoofing
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Spam SMS &amp; Phishing (Smishing) Simulator
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Cyber syndicates craft urgent SMS messages with spoofed headers imitating banks or postal services. The payload leads to fake credential harvesting forms using deceptive throwaway domains.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                        <Smartphone className="w-4 h-4" />
                        <span>Smishing Message Generator &amp; Inspector</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Heuristic Analysis Engine</span>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-2">Popular Real-World Smishing Lures:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            title: 'Bank KYC Freeze',
                            sender: 'VK-SBIINB',
                            body: 'Dear Customer, your SBI YONO account will be blocked today due to pending KYC. Update PAN immediately at: https://sbi-kyc-verify.top/login'
                          },
                          {
                            title: 'India Post Parcel',
                            sender: 'IP-POSTIN',
                            body: 'India Post: Your parcel #IN8892 is detained at regional depot due to incomplete address. Confirm delivery details at: https://indiapost-update.xyz/pay'
                          },
                          {
                            title: 'Power Disconnection',
                            sender: 'CP-ELECTR',
                            body: 'Urgent: Your electricity power supply will be disconnected tonight at 9:30 PM due to unpaid bill. Pay immediately or call officer: 9876543210'
                          }
                        ].map((preset, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSmishingSenderId(preset.sender);
                              setSmishingBody(preset.body);
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-all ${
                              smishingSenderId === preset.sender
                                ? 'bg-cyan-500/20 border-cyan-500/60 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="font-bold text-white mb-0.5">{preset.title}</div>
                            <div className="font-mono text-[10px] text-cyan-300">{preset.sender}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1">Sender ID Header (DLT Alphanumeric):</label>
                        <input
                          type="text"
                          value={smishingSenderId}
                          onChange={(e) => setSmishingSenderId(e.target.value)}
                          className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1">SMS Message Body:</label>
                        <textarea
                          rows={3}
                          value={smishingBody}
                          onChange={(e) => setSmishingBody(e.target.value)}
                          className="w-full bg-black/60 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-bold">Threat Evaluation:</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          smishingReport.isSmishing ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          RISK SCORE: {smishingReport.score}% · {smishingReport.isSmishing ? 'CRITICAL PHISHING' : 'LOW RISK'}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-300 pt-1">
                        {smishingReport.reasons.map((r, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>Victim Device Display Simulation</span>
                    </div>

                    <div className="w-[300px] h-[540px] bg-black border-4 border-slate-700 rounded-[38px] p-4 flex flex-col relative shadow-2xl shadow-cyan-950/40">
                      <div className="w-28 h-5 bg-slate-900 rounded-b-xl self-center absolute top-0" />
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-2">
                        <span>11:15 AM</span>
                        <span>LTE 88%</span>
                      </div>

                      <div className="flex-1 mt-4 bg-slate-950 rounded-2xl p-3 border border-slate-900 flex flex-col">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400">
                            {smishingSenderId.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{smishingSenderId}</div>
                            <div className="text-[9px] text-slate-500">Carrier SMS Gateway</div>
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 space-y-2 leading-relaxed">
                          <p>{smishingBody}</p>
                          <div className="text-[9px] text-slate-500 text-right">Just now · Delivered</div>
                        </div>

                        {smishingReport.isSmishing && (
                          <div className="mt-auto bg-rose-950/70 border border-rose-500/40 rounded-xl p-2.5 text-[10px] text-rose-200 font-mono space-y-1">
                            <div className="font-bold flex items-center gap-1 text-rose-300">
                              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> PROACTIVE THREAT SHIELD:
                            </div>
                            <div>Do not tap links. Banks never send `.top` or `.xyz` URLs for KYC verification.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: PERMISSIONS */}
            {activeTab === 'permissions' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Attack Vector 02 · Android OS Layering &amp; Abuse of Accessibility Services
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    App Permissions &amp; Privilege Escalation Sandbox
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Explore the internal stack from Application Sandboxing down to the Linux Kernel. Understand why granting{' '}
                    <code className="text-emerald-300 font-mono">BIND_ACCESSIBILITY_SERVICE</code> transforms a harmless utility into a God-Mode keylogger.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                        <Layers className="w-4 h-4" />
                        <span>Android OS Security Stack Hierarchy</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          id: 'app',
                          name: '1. Application Sandbox Layer',
                          sub: 'APK Execution Environment · Isolated UIDs per app',
                          desc: 'Each app runs under a distinct Linux User ID (e.g. u0_a182). Apps cannot read each other’s private data directories (/data/data/com.app) directly.',
                          color: 'border-blue-500/40 bg-blue-950/20 text-blue-300'
                        },
                        {
                          id: 'framework',
                          name: '2. Android Framework & Permission Manager',
                          sub: 'ActivityManager · PackageManager · AccessibilityManagerService',
                          desc: 'Enforces runtime permissions. When an app requests Accessibility, this manager grants window-event streaming, text input interception, and synthetic tap injection.',
                          color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                        },
                        {
                          id: 'binder',
                          name: '3. Binder IPC & Hardware Abstraction (HAL)',
                          sub: 'Inter-Process Communication driver (/dev/binder)',
                          desc: 'Facilitates fast, message-based remote procedure calls between sandboxed apps and system services with token-based credential checks.',
                          color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                        },
                        {
                          id: 'kernel',
                          name: '4. Linux Kernel & SELinux Enforcement',
                          sub: 'Kernel 5.15+ · Mandatory Access Control (MAC) Policies',
                          desc: 'Security-Enhanced Linux (SELinux) confines even root-level processes. Prevents privilege escalation from escaping into device memory or firmware.',
                          color: 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                        }
                      ].map((layer) => (
                        <div
                          key={layer.id}
                          onClick={() => setActiveAndroidLayer(layer.id as any)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            activeAndroidLayer === layer.id
                              ? `${layer.color} shadow-lg ring-1 ring-emerald-500/30`
                              : 'bg-black/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-mono text-xs font-bold text-white">{layer.name}</div>
                            <span className="text-[10px] font-mono text-slate-500">{layer.sub}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{layer.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Malicious APK Permission Escalation</span>
                      </div>
                    </div>

                    <div className="bg-black/60 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
                      <div className="text-white font-bold">Target APK: TorchLight_Pro.apk</div>
                      <div className="text-slate-400">Claimed Purpose: Simple flashlight widget</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-mono text-slate-300">Requested Android Permissions:</div>
                      {[
                        { name: 'android.permission.CAMERA', label: 'Camera (Legit: toggles LED)', risk: 'Low' },
                        { name: 'android.permission.READ_SMS', label: 'Read SMS (Captures Bank OTPs)', risk: 'High' },
                        { name: 'android.permission.SYSTEM_ALERT_WINDOW', label: 'Draw Over Apps (Overlay Attack)', risk: 'High' },
                        { name: 'android.permission.BIND_ACCESSIBILITY_SERVICE', label: 'Accessibility God Mode (Reads all screen DOM & taps)', risk: 'Critical' }
                      ].map((p, i) => (
                        <div
                          key={i}
                          className="p-3 bg-black/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <div className="text-white font-semibold">{p.label}</div>
                            <div className="text-[10px] text-slate-500">{p.name}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.risk === 'Critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : p.risk === 'High'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {p.risk}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setEscalationTriggered(!escalationTriggered)}
                      className={`w-full py-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                        escalationTriggered
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>{escalationTriggered ? 'Escalation Active: Keylogging All Apps' : 'Simulate Privilege Escalation Attack'}</span>
                    </button>

                    {escalationTriggered && (
                      <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs font-mono text-rose-200 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-rose-400">
                          ⚠️ ACCESS GRANTED TO ACCESSIBILITY SERVICE:
                        </div>
                        <div>• Captured keystrokes from WhatsApp &amp; Banking app</div>
                        <div>• Injected synthetic touch event to click "Confirm Transfer"</div>
                        <div>• Defense: Revoke in Settings &gt; Accessibility &gt; Downloaded Apps</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: EVIL TWIN */}
            {activeTab === 'eviltwin' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Attack Vector 03 · Rogue Access Points &amp; Man-in-the-Middle (MitM)
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Evil Twin (Fake Wi-Fi) Attack Visualizer
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Smartphones automatically connect to the strongest signal matching a remembered SSID. Attackers deploy high-gain antennas advertising identical names to intercept traffic.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-cyan-400">
                      <span className="flex items-center gap-1.5">
                        <Wifi className="w-4 h-4" /> 802.11 Beacon Broadcast Simulation
                      </span>
                      <span>SSID: "Cafe_Free_WiFi"</span>
                    </div>

                    <div className="space-y-3">
                      <div
                        onClick={() => setWifiConnectedAP('legit')}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          wifiConnectedAP === 'legit'
                            ? 'bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/30'
                            : 'bg-black/40 border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="font-bold text-emerald-400">🏢 Genuine Cafe Router (Legit AP)</span>
                          <span className="text-slate-400">-74 dBm (Weaker Signal)</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">BSSID: 00:14:22:98:A1:33 · Channel 6 · WPA2-Personal</div>
                      </div>

                      <div
                        onClick={() => setWifiConnectedAP('evil')}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          wifiConnectedAP === 'evil'
                            ? 'bg-rose-950/20 border-rose-500/60 ring-1 ring-rose-500/30'
                            : 'bg-black/40 border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="font-bold text-rose-400">🦹 Evil Twin Wi-Fi Pineapple (Rogue AP)</span>
                          <span className="text-rose-400 font-bold">-28 dBm (Stronger Boosted Signal)</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">BSSID: 00:C0:CA:99:F2:10 · Channel 6 · Deauth Flooder Active</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-mono text-slate-300 block mb-2">Transport Security Layer (Protection):</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'http', label: 'Plain HTTP', color: 'text-rose-400', desc: 'No Encryption' },
                          { id: 'https', label: 'HTTPS (TLS 1.3)', color: 'text-cyan-400', desc: 'Encrypted Stream' },
                          { id: 'vpn', label: 'WireGuard VPN', color: 'text-emerald-400', desc: 'Full Tunneling' }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setWifiSecurityMode(m.id as any)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              wifiSecurityMode === m.id
                                ? 'bg-cyan-500/20 border-cyan-500/60 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className={`text-xs font-mono font-bold ${m.color}`}>{m.label}</div>
                            <div className="text-[10px] text-slate-400">{m.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <Terminal className="w-4 h-4" /> Live Promiscuous Packet Sniffer
                      </span>
                      <span className="text-[10px] text-slate-500">Interface: mon0</span>
                    </div>

                    <div className="bg-black/80 rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-3 min-h-[220px]">
                      <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-1 flex justify-between">
                        <span>FRAME DECODE</span>
                        <span>PROTO: {wifiSecurityMode.toUpperCase()}</span>
                      </div>

                      {wifiConnectedAP === 'evil' && wifiSecurityMode === 'http' && (
                        <div className="space-y-1 text-rose-300">
                          <div className="font-bold text-rose-400">⚠️ CLEARTEXT DATA LEAK DETECTED!</div>
                          <div>POST /api/v1/auth/login HTTP/1.1</div>
                          <div>Host: student-portal.bca.edu</div>
                          <div className="bg-rose-950/80 p-2 rounded border border-rose-500/40 text-white mt-1">
                            Payload: username=<span className="text-amber-300">aarav.sharma@bca.edu</span>&amp;password=<span className="text-amber-300">BcaP@ssw0rd2024!</span>
                          </div>
                        </div>
                      )}

                      {wifiConnectedAP === 'evil' && wifiSecurityMode === 'https' && (
                        <div className="space-y-1 text-cyan-300">
                          <div className="font-bold text-cyan-400">🔒 TLS 1.3 ENCRYPTION ACTIVE</div>
                          <div>Client Hello (SNI: student-portal.bca.edu)</div>
                          <div>Server Key Exchange (Curve25519)</div>
                          <div className="text-slate-500">Application Data: [Encrypted Payload - 1420 bytes]</div>
                          <div className="text-[11px] text-emerald-400 mt-2">
                            ✓ Attacker cannot read passwords due to end-to-end TLS cryptography.
                          </div>
                        </div>
                      )}

                      {wifiConnectedAP === 'evil' && wifiSecurityMode === 'vpn' && (
                        <div className="space-y-1 text-emerald-300">
                          <div className="font-bold text-emerald-400">🛡️ FULL WIREGUARD VPN TUNNEL ACTIVE</div>
                          <div>UDP 198.51.100.4:51820 &lt;-&gt; 192.168.1.105:44812</div>
                          <div>ChaCha20-Poly1305 Encrypted Datagrams</div>
                          <div className="text-[11px] text-emerald-400 mt-2">
                            ✓ Complete privacy: Even DNS queries are masked from rogue AP.
                          </div>
                        </div>
                      )}

                      {wifiConnectedAP === 'legit' && (
                        <div className="text-slate-400 text-xs">
                          Device is connected directly to genuine AP. Rogue Pineapple receives no frames.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: ADB TERMINAL */}
            {activeTab === 'adb' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Attack Vector 04 · Physical Attack Surface &amp; Juice Jacking
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    ADB (Android Debug Bridge) "God Mode" Terminal Simulator
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    When "USB Debugging" is left enabled on a mobile phone, plugging into a compromised public airport charging kiosk ("Juice Jacking") allows an attacker host to execute ADB shell commands, dump databases, and capture screenshots.
                  </p>
                </div>

                <div className="bg-black/90 border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Terminal className="w-4 h-4" />
                      <span>Host Terminal: bash (adb client v1.0.41)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Connected: RF8N90XYZ12</span>
                      <button
                        onClick={() => handleRunAdbCommand('clear')}
                        className="text-[10px] text-slate-400 hover:text-white underline"
                      >
                        Clear Screen
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      'adb devices',
                      'adb shell pm list packages -3',
                      'adb shell dumpsys accessibility',
                      'adb shell screencap -p /sdcard/sc.png',
                      'adb pull /sdcard/sc.png',
                      'adb shell getprop ro.crypto.state',
                      'help'
                    ].map((cmd, i) => (
                      <button
                        key={i}
                        onClick={() => handleRunAdbCommand(cmd)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-[11px] font-mono transition-all"
                      >
                        $ {cmd}
                      </button>
                    ))}
                  </div>

                  <div className="min-h-[260px] max-h-[380px] overflow-y-auto space-y-3 bg-black/50 p-4 rounded-xl border border-slate-900">
                    {adbTerminalHistory.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <span className="text-slate-500">attacker@kali:~$</span>
                          <span>{item.cmd}</span>
                        </div>
                        {Array.isArray(item.output) ? (
                          <div className="text-slate-300 space-y-0.5 pl-4">
                            {item.output.map((line, lIdx) => (
                              <div key={lIdx}>{line}</div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-300 pl-4">{item.output}</div>
                        )}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <span className="text-amber-400 font-bold">attacker@kali:~$</span>
                    <input
                      type="text"
                      placeholder="Type an ADB command or click a quick pill above..."
                      value={adbInput}
                      onChange={(e) => setAdbInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRunAdbCommand();
                      }}
                      className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => handleRunAdbCommand()}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold font-mono"
                    >
                      Execute
                    </button>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    <span className="text-amber-400 font-bold">🛡️ Hardware Defense (USB Data Blocker / USB Condom):</span>{' '}
                    Physically interrupts D+ and D- data pins on the USB cable. Only power pins connect, preventing any data exfiltration.
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: FORENSICS */}
            {activeTab === 'forensics' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Blue Team Defense 05 · Post-Theft Remediation &amp; Hardware Hardening
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Mobile Forensics &amp; Anti-Theft Defense
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Master defensive strategies including Bluetooth Low Energy (BLE) offline mesh tracking, IMEI cell tower triangulation, CEIR portal blacklisting, and cryptographic remote wipe.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                      <Radio className="w-4 h-4" /> 1. Find My Device BLE Offline Mesh
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Even when powered off or missing a SIM card, devices broadcast encrypted rolling Bluetooth keys. Nearby bystander phones detect this beacon and relay encrypted GPS coordinates to the cloud owner without compromising anyone's privacy.
                    </p>
                  </div>

                  <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                      <Database className="w-4 h-4" /> 2. IMEI Triangulation &amp; Indian CEIR Portal
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Cellular towers calculate distance via Timing Advance (TA) and RSSI. Under India's Department of Telecommunications (DoT), the CEIR portal blacklists stolen IMEIs across all carriers (Jio, Airtel, Vi, BSNL).
                    </p>
                  </div>

                  <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                      <Lock className="w-4 h-4" /> 3. Cryptographic Key Erasure (Remote Wipe)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Android "Erase Device" via Google Find My Device instantly destroys hardware cryptographic master keys in the Titan M/Secure Element chip, rendering stored NAND data mathematically irrecoverable.
                    </p>
                    <button
                      onClick={() => setRemoteWipeConfirmed(!remoteWipeConfirmed)}
                      className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        remoteWipeConfirmed ? 'bg-emerald-600 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      {remoteWipeConfirmed ? '✓ Simulated Remote Wipe Triggered' : 'Simulate Cryptographic Remote Wipe'}
                    </button>
                  </div>

                  <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                      <Key className="w-4 h-4" /> 4. Physical SIM PIN Lock (Anti-OTP Theft)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Setting a 4-digit SIM PIN locks the physical SIM card so it cannot connect to any network without entering the PIN upon tray ejection and transfer to another phone.
                    </p>
                  </div>
                </div>

                {/* Callout & Embedded Interactive Forensic Artifacts Checklist */}
                <div className="space-y-4 pt-2">
                  <ForensicArtifactChecklist
                    selectedArtifactId={selectedArtifactId}
                    onSelectArtifact={(art) => {
                      setSelectedArtifactId(art.id);
                      setSubMode('artifacts');
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODE: FORENSIC ARTIFACTS INVESTIGATION CHECKLIST */}
        {/* ========================================================================= */}
        {subMode === 'artifacts' && (
          <div className="space-y-6 animate-fade-in">
            {/* Interactive Forensic Artifacts Checklist Component */}
            <ForensicArtifactChecklist
              selectedArtifactId={selectedArtifactId}
              onSelectArtifact={(art) => {
                setSelectedArtifactId(art.id);
                const el = document.getElementById('deep-artifact-inspector');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Deep Artifact Inspector & Query Workbench */}
            <div id="deep-artifact-inspector" className="bg-[#0B1120] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white font-mono">{selectedArtifact.name}</h3>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Target Database: <span className="text-cyan-300 font-bold">{selectedArtifact.databaseOrFileName}</span> · Format: <span className="text-amber-300">{selectedArtifact.format}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setAuditedArtifacts((prev) => ({
                        ...prev,
                        [selectedArtifact.id]: !prev[selectedArtifact.id]
                      }))
                    }
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all self-start md:self-auto ${
                      auditedArtifacts[selectedArtifact.id]
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {auditedArtifacts[selectedArtifact.id] ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{auditedArtifacts[selectedArtifact.id] ? 'Audited' : 'Mark as Audited'}</span>
                  </button>
                </div>

                {/* Path Inspector with Copy */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Absolute Storage Path:
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-black/60 border border-slate-800 rounded-xl p-3 font-mono text-xs">
                    <span className="text-cyan-300 break-all">{selectedArtifact.absolutePath}</span>
                    <button
                      onClick={() => handleCopyText(selectedArtifact.absolutePath, 'path_' + selectedArtifact.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] shrink-0 flex items-center gap-1 transition-all"
                    >
                      {copiedId === 'path_' + selectedArtifact.id ? (
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

                  {selectedArtifact.alternativePaths && selectedArtifact.alternativePaths.length > 0 && (
                    <div className="text-[11px] font-mono text-slate-500 space-y-0.5 pt-1 pl-1">
                      <span className="font-bold text-slate-400">Alternative / Multi-User Paths: </span>
                      {selectedArtifact.alternativePaths.map((p, pIdx) => (
                        <div key={pIdx} className="text-slate-400 truncate">• {p}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Forensic Investigative Value */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" /> Forensic Significance &amp; Threat Model:
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedArtifact.forensicValue}</p>
                </div>

                {/* Key Schema & Fields Table */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold text-slate-400 flex items-center justify-between">
                    <span>KEY INVESTIGATIVE FIELDS &amp; TYPES:</span>
                    <span className="text-cyan-400">Tables: {selectedArtifact.primaryTablesOrSections.join(', ')}</span>
                  </div>

                  <div className="overflow-x-auto bg-black/50 border border-slate-800 rounded-xl">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                          <th className="py-2 px-3">Field</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Forensic Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        {selectedArtifact.keyInvestigativeFields.map((f, fIdx) => (
                          <tr key={fIdx} className="hover:bg-slate-900/40">
                            <td className="py-1.5 px-3 font-bold text-cyan-300">{f.field}</td>
                            <td className="py-1.5 px-3 text-amber-300">{f.type}</td>
                            <td className="py-1.5 px-3 text-slate-300 text-[11px]">{f.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Analytical SQL Query Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-400" /> Analytical Forensic SQL Query:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowEvidenceQueryRows(!showEvidenceQueryRows)}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>{showEvidenceQueryRows ? 'Hide Table View' : 'Simulate Query Results'}</span>
                      </button>
                      <button
                        onClick={() => handleCopyText(selectedArtifact.sampleSqlQuery, 'sql_' + selectedArtifact.id)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                      >
                        {copiedId === 'sql_' + selectedArtifact.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy SQL</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/70 p-3 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre-wrap">
                    {selectedArtifact.sampleSqlQuery}
                  </div>
                </div>

                {/* Mock Parsed Evidence Table */}
                {showEvidenceQueryRows && (
                  <div className="space-y-2 pt-1 animate-fade-in">
                    <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Simulated Extracted Records (Live Database Evidence):
                    </div>

                    <div className="overflow-x-auto bg-black/60 border border-slate-800 rounded-xl">
                      <table className="w-full text-left font-mono text-[11px] border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 text-[10px] bg-slate-900/60">
                            {selectedArtifact.mockSchemaAndRows.columns.map((col, cIdx) => (
                              <th key={cIdx} className="py-2 px-3">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 text-slate-300">
                          {selectedArtifact.mockSchemaAndRows.sampleRows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/40">
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="py-2 px-3 text-[11px]">
                                  {typeof cell === 'string' && (cell.includes('sbi-kyc-verify') || cell.includes('KYC') || cell.includes('OTP')) ? (
                                    <span className="text-rose-400 font-semibold bg-rose-950/40 px-1 py-0.5 rounded border border-rose-500/30">
                                      {cell}
                                    </span>
                                  ) : typeof cell === 'string' && (cell.includes('INCOMING') || cell.includes('Mewat')) ? (
                                    <span className="text-amber-300 font-semibold">{cell}</span>
                                  ) : (
                                    <span>{cell}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ADB Extraction Terminal Command */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-rose-400" /> ADB Forensic Extraction Command:
                    </span>
                    <button
                      onClick={() => handleCopyText(selectedArtifact.forensicExtractionCommand, 'adb_' + selectedArtifact.id)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1"
                    >
                      {copiedId === 'adb_' + selectedArtifact.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied Command</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy ADB</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/90 p-3 rounded-xl border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto whitespace-pre-wrap">
                    {selectedArtifact.forensicExtractionCommand}
                  </div>
                </div>

                {/* Built-in Tool: WebKit Timestamp to UTC/IST Converter */}
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Built-In Tool: WebKit Timestamp to Human Date Converter
                    </span>
                    <span className="text-[10px] text-slate-400">Used by Chrome, Edge &amp; Safari SQLite databases</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Google Chrome logs <code className="text-cyan-300">last_visit_time</code> as microseconds elapsed since January 1, 1601 UTC. Enter any 17-digit timestamp below to convert into human UTC and IST:
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={webkitTimestampInput}
                      onChange={(e) => setWebkitTimestampInput(e.target.value)}
                      placeholder="e.g. 13373738521000000"
                      className="flex-1 bg-black/70 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setWebkitTimestampInput('13373738521000000')}
                        className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 border border-slate-700"
                      >
                        Sample Phishing Visit
                      </button>
                      <button
                        onClick={() => {
                          const nowMs = Date.now();
                          const webkitMicro = (nowMs + 11644473600000) * 1000;
                          setWebkitTimestampInput(webkitMicro.toString());
                        }}
                        className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 border border-slate-700"
                      >
                        Current Time
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/60 p-2.5 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Converted Date &amp; Time:</span>
                    <span className="text-emerald-300 font-bold">{convertWebkitTime(webkitTimestampInput)}</span>
                  </div>
                </div>
              </div>

            {/* Forensic Triage Report Modal */}
            {triageReportModalOpen && (
              <div
                onClick={() => setTriageReportModalOpen(false)}
                className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl text-slate-100 font-mono text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-bold text-sm text-white">Forensic Log Investigation Triage Summary</h3>
                    </div>
                    <button
                      onClick={() => setTriageReportModalOpen(false)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 bg-black/60 p-4 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap">
{`# ANDROID FORENSIC TRIAGE REPORT
Generated on: ${new Date().toUTCString()}
Audited Status: ${auditedCount} / ${FORENSIC_ARTIFACTS.length} Artifacts Inspected

## 1. EXECUTIVE SUMMARY
Investigation focused on identifying smishing SMS vectors, unauthorized outbound OTP transmissions, exfiltrated contact lists, and browser phishing site navigations.

## 2. ARTIFACTS INVESTIGATION CHECKLIST STATUS
${FORENSIC_ARTIFACTS.map(
  (a) =>
    `- [${auditedArtifacts[a.id] ? 'X' : ' '}] ${a.name} (${a.databaseOrFileName})
    Path: ${a.absolutePath}
    Status: ${auditedArtifacts[a.id] ? 'COMPLETED AUDIT' : 'PENDING EXTRACTION'}
    Key Tables: ${a.primaryTablesOrSections.join(', ')}`
).join('\n\n')}

## 3. EVIDENCE EXTRACTION SUMMARY
- Telephony SMS DB (mmssms.db): Inspected for incoming malicious sender headers (e.g. VK-SBIINB) and outgoing OTP exfiltration.
- Contacts DB (contacts2.db): Checked for contact book scraping by rogue loan apps.
- Chrome Browser History: Traced phishing landing URLs and malicious APK download target paths.

## 4. CHAIN OF CUSTODY NOTE
All database dumps must be extracted using cryptographic hash verification (SHA-256) immediately following extraction via ADB shell.`}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-slate-500 text-[10px]">Ready for export into Incident Response ticket</span>
                    <button
                      onClick={() => {
                        const reportText = `# ANDROID FORENSIC TRIAGE REPORT\nGenerated on: ${new Date().toUTCString()}\nAudited Status: ${auditedCount} / ${FORENSIC_ARTIFACTS.length} Artifacts Inspected\n\n${FORENSIC_ARTIFACTS.map((a) => `- [${auditedArtifacts[a.id] ? 'X' : ' '}] ${a.name} (${a.databaseOrFileName})\n  Path: ${a.absolutePath}\n  Status: ${auditedArtifacts[a.id] ? 'COMPLETED AUDIT' : 'PENDING'}`).join('\n')}`;
                        handleCopyText(reportText, 'full_report');
                      }}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5"
                    >
                      {copiedId === 'full_report' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === 'full_report' ? 'Report Copied!' : 'Copy Markdown Report'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODE 2: ANDROID PERMISSIONS SPECIFICATIONS MATRIX */}
        {/* ========================================================================= */}
        {subMode === 'protocols' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Operating System Internals &amp; Security Architecture
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Android 14/15 Dangerous Permissions &amp; Trojan Abuse Matrix
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Complete technical analysis of Android permission protection levels, how banking trojans exploit them, and recommended audit actions.
              </p>
            </div>

            <div className="space-y-4">
              {ANDROID_PERMISSIONS_MATRIX.map((perm, idx) => (
                <div key={idx} className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{perm.permission}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold self-start md:self-auto ${
                      perm.protectionLevel === 'Special App Access'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {perm.protectionLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{perm.threatDescription}</p>

                  <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-500/30 text-xs text-rose-200">
                    <span className="font-bold">How Malware/Trojans Abuse This: </span>
                    {perm.howTrojansAbuse}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                    <div className="bg-black/50 p-2.5 rounded-xl border border-slate-800 text-slate-400">
                      <span className="font-bold text-slate-300">Legitimate Use Case: </span>
                      {perm.legitUseCases}
                    </div>
                    <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30 text-emerald-300">
                      <span className="font-bold">Recommended Audit Action: </span>
                      {perm.recommendedAuditingAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODE 3: TRAI DLT TELECOM REGISTRY */}
        {/* ========================================================================= */}
        {subMode === 'dlt' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Telecommunications Regulatory Standards
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                TRAI DLT Header Anatomy &amp; Smishing Bypass Vectors
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Decoding India's 9-character Distributed Ledger Technology alphanumeric SMS header format and how attackers evade scrubbing engines.
              </p>
            </div>

            {/* DLT Registry Table */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Authorized Carrier &amp; Circle Prefix Lookup Table
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="py-2 px-3">Prefix</th>
                      <th className="py-2 px-3">Originating Carrier</th>
                      <th className="py-2 px-3">Telecom Circle (LSA)</th>
                      <th className="py-2 px-3">Approved Example</th>
                      <th className="py-2 px-3">Registry Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {TRAI_DLT_HEADERS.map((header, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 font-bold text-cyan-400">{header.prefix}</td>
                        <td className="py-2.5 px-3">{header.carrier}</td>
                        <td className="py-2.5 px-3">{header.circle}</td>
                        <td className="py-2.5 px-3 text-amber-300 font-bold">{header.example}</td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">{header.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exploit Loopholes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="font-bold font-mono text-xs text-rose-400">1. International SMPP Gateways</div>
                <p className="text-xs text-slate-300 leading-relaxed">{DLT_VULNERABILITY_EXPLANATION.loophole1}</p>
              </div>

              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="font-bold font-mono text-xs text-rose-400">2. Hardware SIM Box Arrays</div>
                <p className="text-xs text-slate-300 leading-relaxed">{DLT_VULNERABILITY_EXPLANATION.loophole2}</p>
              </div>

              <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="font-bold font-mono text-xs text-rose-400">3. Class 0 / Flash SMS Attacks</div>
                <p className="text-xs text-slate-300 leading-relaxed">{DLT_VULNERABILITY_EXPLANATION.loophole3}</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODE 4: SANCHAR SAATHI & CEIR */}
        {/* ========================================================================= */}
        {subMode === 'sancharsaathi' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Government of India Anti-Theft Infrastructure
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Sanchar Saathi: CEIR, TAFCOP &amp; Chakshu Portals
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Department of Telecommunications (DoT) official frameworks for IMEI blacklisting, detecting fraudulent SIM cards, and reporting smishing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SANCHAR_SAATHI_MODULES.map((portal, idx) => (
                <div key={idx} className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-mono text-sm font-bold text-cyan-300">{portal.name}</h3>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">{portal.portalUrl}</div>
                    <p className="text-xs text-slate-300 font-semibold">{portal.purpose}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{portal.howItWorks}</p>

                    <div className="pt-2">
                      <div className="text-[11px] font-mono font-bold text-amber-300 mb-1.5">Official Steps:</div>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        {portal.userSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-1.5">
                            <span className="text-cyan-400 font-mono font-bold shrink-0">{sIdx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://${portal.portalUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Visit {portal.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODE 5: 10-FACTOR DEVICE HARDENING AUDIT */}
        {/* ========================================================================= */}
        {subMode === 'hardening' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Defensive Mobile Posture Score
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Personal Smartphone Hardening Audit &amp; Score
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Check off each security setting enabled on your personal smartphone to compute your defense score and get step-by-step Android navigation paths.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-3">
                {DEVICE_HARDENING_ITEMS.map((item) => {
                  const isChecked = completedHardening[item.id] || false;
                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        setCompletedHardening((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id]
                        }))
                      }
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/60 ring-1 ring-emerald-500/30'
                          : 'bg-[#0B1120] border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        isChecked ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{item.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            item.importance === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {item.importance}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                        <div className="text-[11px] font-mono text-cyan-300 mt-2 bg-black/40 p-2 rounded-lg border border-slate-800">
                          📍 Android Path: {item.androidPath}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Score Dial Column */}
              <div className="lg:col-span-4 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 mb-4">
                    DEVICE HARDENING RATING
                  </div>

                  <div className="text-center my-6">
                    <div className="relative inline-flex items-center justify-center">
                      <div className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center ${
                        calculateHardeningScore() >= 80
                          ? 'border-emerald-500/50 bg-emerald-950/20 shadow-2xl shadow-emerald-950'
                          : calculateHardeningScore() >= 50
                          ? 'border-amber-500/50 bg-amber-950/20 shadow-2xl shadow-amber-950'
                          : 'border-rose-500/50 bg-rose-950/20 shadow-2xl shadow-rose-950'
                      }`}>
                        <span className="text-3xl font-black font-mono text-white">
                          {calculateHardeningScore()}%
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                          Score
                        </span>
                      </div>
                    </div>

                    <div className={`mt-4 font-mono font-bold text-sm ${
                      calculateHardeningScore() >= 80 ? 'text-emerald-400' : calculateHardeningScore() >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {calculateHardeningScore() >= 80
                        ? 'FORTIFIED SMARTPHONE'
                        : calculateHardeningScore() >= 50
                        ? 'PARTIALLY SECURED'
                        : 'VULNERABLE ENDPOINT'}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div>• 80-100%: Resistant to theft &amp; rogue APs</div>
                    <div>• 50-79%: Exposed to SIM swap or Juice Jacking</div>
                    <div>• 0-49%: Critical vulnerability to OTP theft</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      const all: Record<string, boolean> = {};
                      DEVICE_HARDENING_ITEMS.forEach((i) => (all[i.id] = true));
                      setCompletedHardening(all);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition-all"
                  >
                    Check All 10 Hardening Controls (100%)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Ransomware MITRE ATT&CK Timeline Overlay */}
      <RansomwareTimelineOverlay
        isOpen={ransomwareTimelineOpen}
        onClose={() => setRansomwareTimelineOpen(false)}
      />
    </div>
  );
};
export default MobileSecLabApp;
