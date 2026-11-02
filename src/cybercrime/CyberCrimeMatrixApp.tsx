import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  Smartphone,
  Mic,
  Mail,
  Bug,
  UserCheck,
  Radio,
  Lock,
  Unlock,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Server,
  Database,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  ChevronRight,
  HelpCircle,
  Cpu,
  Volume2,
  Search,
  ExternalLink,
  Info,
  KeyRound,
  FileCode,
  Zap,
  Globe,
  BookOpen,
  Scale,
  Award,
  Clock,
  Send,
  Sliders,
  PhoneCall
} from 'lucide-react';

import {
  SS7_PROTOCOL_SPECS,
  EMAIL_SECURITY_STANDARDS,
  CASE_STUDIES,
  LEGAL_PROVISIONS,
  INCIDENT_RESPONSE_PLAYBOOK,
  SELF_AUDIT_QUESTIONS
} from './data/cyberCrimeData';
import { RansomwareTimelineOverlay } from './components/RansomwareTimelineOverlay';

interface CyberCrimeMatrixAppProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

type MatrixModuleId = 'simswap' | 'deepfake' | 'emailspoof' | 'rat' | 'osint';
type SubViewMode = 'sandbox' | 'specs' | 'cases' | 'legal' | 'audit';

export const CyberCrimeMatrixApp: React.FC<CyberCrimeMatrixAppProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [activeModule, setActiveModule] = useState<MatrixModuleId>('simswap');
  const [subViewMode, setSubViewMode] = useState<SubViewMode>('sandbox');
  const [ransomwareTimelineOpen, setRansomwareTimelineOpen] = useState<boolean>(false);

  // --- Module 1: SIM Swap & SS7 State ---
  const [simStep, setSimStep] = useState<number>(1);
  const [simShieldActive, setSimShieldActive] = useState<boolean>(false);
  const [simSimulating, setSimSimulating] = useState<boolean>(false);
  const [simLog, setSimLog] = useState<string[]>([
    '[INIT] Subscriber registered on Telco BTS Tower (IMSI: 404-45-98721102938).'
  ]);

  // --- Module 2: Voice Cloning & Deepfake Audio State ---
  const [voicePersona, setVoicePersona] = useState<'ceo' | 'relative' | 'bank'>('relative');
  const [voiceText, setVoiceText] = useState<string>(
    'Papa, emergency hai! Mera wallet chori ho gaya Delhi me, please is UPI pe 10,000 transfer karo turant!'
  );
  const [voicePitch, setVoicePitch] = useState<number>(1.2);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(0.95);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [secretCodewordInput, setSecretCodewordInput] = useState<string>('');
  const [secretWordVerified, setSecretWordVerified] = useState<boolean | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Module 3: Email Spoofing & SPF/DKIM/DMARC State ---
  const [spfConfig, setSpfConfig] = useState<'+all' | '~all' | '-all' | 'none'>('-all');
  const [dkimConfig, setDkimConfig] = useState<'valid' | 'tampered' | 'missing'>('tampered');
  const [dmarcPolicy, setDmarcPolicy] = useState<'none' | 'quarantine' | 'reject'>('reject');
  const [spoofedSender, setSpoofedSender] = useState<string>('ceo@globalbank.com');
  const [returnPath, setReturnPath] = useState<string>('attacker@bulletproof-vps.ru');
  const [emailVerifiedResult, setEmailVerifiedResult] = useState<{
    spfPass: boolean;
    dkimPass: boolean;
    dmarcAction: 'inbox' | 'spam' | 'dropped';
    reason: string;
  } | null>(null);

  // --- Module 4: RAT Sandbox State ---
  const [ratActiveCamera, setRatActiveCamera] = useState<boolean>(false);
  const [ratActiveMic, setRatActiveMic] = useState<boolean>(false);
  const [ratKeylogStream, setRatKeylogStream] = useState<string[]>([
    'User opened App: SBI YONO',
    'PIN entered: [4][9][2][1]',
    'OTP received: [7][3][0][1][9][5]'
  ]);
  const [ratDefenseTriggered, setRatDefenseTriggered] = useState<boolean>(false);

  // --- Module 5: Identity Theft & OSINT State ---
  const [osintCollectedData, setOsintCollectedData] = useState<{
    petName: boolean;
    motherMaiden: boolean;
    firstCar: boolean;
    highSchool: boolean;
  }>({
    petName: false,
    motherMaiden: false,
    firstCar: false,
    highSchool: false
  });

  // --- Risk Audit State ---
  const [auditAnswers, setAuditAnswers] = useState<Record<string, number>>({});

  // Calculate audit score
  const calculateTotalRisk = () => {
    let score = 0;
    SELF_AUDIT_QUESTIONS.forEach((q) => {
      const ansIdx = auditAnswers[q.id];
      if (ansIdx !== undefined && q.options[ansIdx]) {
        score += q.options[ansIdx].scoreImpact;
      } else {
        score += 25; // Default unconfigured risk
      }
    });
    return Math.min(score, 100);
  };

  // Waveform visualizer animation loop for Deepfake module
  useEffect(() => {
    let animationId: number;
    let offset = 0;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const bars = 48;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        let barHeight = 0;
        if (isSynthesizing) {
          const freq = (i + offset * 0.1) * 0.4;
          barHeight = Math.abs(Math.sin(freq) * Math.cos(freq * 0.5) * (height * 0.8)) + 10;
        } else {
          barHeight = Math.abs(Math.sin(i * 0.2 + offset * 0.03) * (height * 0.2)) + 4;
        }

        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSynthesizing) {
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(0.5, '#10b981');
          grad.addColorStop(1, '#f43f5e');
        } else {
          grad.addColorStop(0, '#334155');
          grad.addColorStop(1, '#1e293b');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      }

      offset += 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isSynthesizing]);

  // SIM Swap Simulation Trigger
  const handleRunSimSwapSim = () => {
    setSimSimulating(true);
    setSimStep(1);
    setSimLog([`[STEP 1] Attacker targets victim (+91-98765-XXXXX) through social engineering.`]);

    setTimeout(() => {
      setSimStep(2);
      setSimLog((prev) => [
        ...prev,
        `[STEP 2] Attacker impersonates subscriber at Telecom Carrier store or issues fraudulent SS7 UpdateLocation.`
      ]);

      setTimeout(() => {
        if (simShieldActive) {
          setSimStep(2);
          setSimSimulating(false);
          setSimLog((prev) => [
            ...prev,
            `[BLOCKED] 🛡️ Carrier Port-Freeze PIN required! Telco rejected SIM swap authorization. Victim notified via secondary email.`
          ]);
        } else {
          setSimStep(3);
          setSimLog((prev) => [
            ...prev,
            `[STEP 3] Telecom HLR/HSS database transfers IMSI route to Attacker's physical blank SIM card!`
          ]);

          setTimeout(() => {
            setSimStep(4);
            setSimLog((prev) => [
              ...prev,
              `[STEP 4] Victim's original phone loses signal ("No Service / SOS Only"). Telco network deregisters old ICCID.`
            ]);

            setTimeout(() => {
              setSimStep(5);
              setSimSimulating(false);
              setSimLog((prev) => [
                ...prev,
                `[COMPROMISED] ⚠️ Attacker intercepts bank SMS OTP (618492) and initiates account takeover! Real-world loss: ₹2,50,000.`
              ]);
            }, 1200);
          }, 1200);
        }
      }, 1200);
    }, 1000);
  };

  // Voice Deepfake Synthesizer
  const handleSynthesizeVoice = () => {
    setIsSynthesizing(true);
    setAudioProgress(0);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.pitch = voicePitch;
      utterance.rate = voiceSpeed;
      utterance.onend = () => {
        setIsSynthesizing(false);
        setAudioProgress(100);
      };
      utterance.onerror = () => {
        setIsSynthesizing(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsSynthesizing(false);
        setAudioProgress(100);
      }, 3000);
    }
  };

  // Email Spoof Verification Engine
  const handleVerifyEmailSecurity = () => {
    let spfPass = false;
    let dkimPass = false;
    let dmarcAction: 'inbox' | 'spam' | 'dropped' = 'inbox';
    let reason = '';

    if (spfConfig === '-all') {
      spfPass = false;
    } else if (spfConfig === '~all') {
      spfPass = false;
    } else if (spfConfig === '+all') {
      spfPass = true;
    } else {
      spfPass = false;
    }

    if (dkimConfig === 'valid') {
      dkimPass = true;
    } else {
      dkimPass = false;
    }

    const aligned = spfPass || dkimPass;

    if (aligned) {
      dmarcAction = 'inbox';
      reason = 'Email passed authentication alignment and landed cleanly in victim inbox.';
    } else {
      if (dmarcPolicy === 'reject') {
        dmarcAction = 'dropped';
        reason = 'DMARC Policy "p=reject" enforced: Mail server rejected spoofed email (550 5.7.1). Attacker thwarted!';
      } else if (dmarcPolicy === 'quarantine') {
        dmarcAction = 'spam';
        reason = 'DMARC Policy "p=quarantine" enforced: Email routed directly to Junk/Spam folder with phishing banner.';
      } else {
        dmarcAction = 'inbox';
        reason = 'CRITICAL VULNERABILITY: DMARC is "p=none" (monitoring only). Despite SPF/DKIM fail, email entered Inbox!';
      }
    }

    setEmailVerifiedResult({
      spfPass,
      dkimPass,
      dmarcAction,
      reason
    });
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      {/* ⚠️ Permanent Educational Warning Badge */}
      <div className="w-full bg-rose-950/90 border-b border-rose-500/40 px-4 py-2 flex items-center justify-between text-xs text-rose-200 font-mono tracking-wide sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-center text-center">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
          <span className="font-semibold">
            ⚠️ Educational Sandbox. No Real Attacks. Strictly for Defensive Learning &amp; Cybersecurity Research.
          </span>
        </div>
      </div>

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/60 border border-rose-400/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                  CyberCrime Matrix <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-sans">#crimematrix</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Threat Anatomy, Telecommunications Signaling Flaws, Legal Frameworks &amp; Incident Response
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
                className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-all"
              >
                Back to OS Hub
              </button>
            )}
          </div>
        </div>

        {/* 5 Module Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'simswap', label: '1. SIM Swap & SS7', icon: Smartphone, desc: 'Telecom Hijack & 2FA Bypass' },
            { id: 'deepfake', label: '2. Deepfake Voice AI', icon: Mic, desc: 'Acoustic Cloning & Duress Defense' },
            { id: 'emailspoof', label: '3. Email Spoofing', icon: Mail, desc: 'SPF, DKIM & DMARC Enforcement' },
            { id: 'rat', label: '4. RAT Trojan C2', icon: Bug, desc: 'Android Accessibility Spyware' },
            { id: 'osint', label: '5. OSINT Identity Theft', icon: UserCheck, desc: 'Social Profiling & KBA Takeover' }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as MatrixModuleId)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? 'bg-rose-500/20 border-rose-500/60 text-white shadow-lg shadow-rose-950/40'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-rose-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono hidden sm:block">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mode Selector (Deep Knowledge Sub-Nav) */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'sandbox', label: '🔬 Interactive Sandbox', icon: Zap },
            { id: 'specs', label: '📜 Technical Protocols & RFCs', icon: FileCode },
            { id: 'cases', label: '🚨 Real-World Case Studies', icon: BookOpen },
            { id: 'legal', label: '⚖️ Indian Cyber Law & FIR (IT Act)', icon: Scale },
            { id: 'audit', label: '🛡️ Personal Vulnerability Audit', icon: Shield }
          ].map((mode) => {
            const active = subViewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setSubViewMode(mode.id as SubViewMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Ransomware MITRE ATT&CK Timeline Callout Banner */}
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-[#0A1628] border border-rose-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-sm text-white">
                  Ransomware Attack Kill Chain &amp; MITRE ATT&amp;CK Matrix
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  Interactive Overlay
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                Step through 8 stages from initial perimeter breach to double extortion exfiltration and intermittent encryption. Explore mapped MITRE techniques, red team CLI commands, SIEM telemetry, and test defensive containment playbooks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRansomwareTimelineOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-lg shadow-rose-950/60 transition-all self-stretch sm:self-auto justify-center"
          >
            <span>Launch Timeline Overlay</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SUB-VIEW 1: INTERACTIVE SANDBOX */}
        {/* ========================================================================= */}
        {subViewMode === 'sandbox' && (
          <>
            {/* MODULE 1: SIM SWAP & SS7 */}
            {activeModule === 'simswap' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                        Attack Vector 01 · Telecommunications Protocol Hijacking
                      </span>
                      <h2 className="text-2xl font-bold text-white mt-1">
                        SIM Swapping &amp; SS7 Protocol Vulnerability
                      </h2>
                      <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                        Signaling System No. 7 (SS7) was designed in 1975 without native cryptographic authentication. Attackers manipulate SS7{' '}
                        <code className="text-rose-300 font-mono">MAP_UPDATE_LOCATION</code> signals or socially engineer carrier reps to migrate a victim’s telephone number to an attacker’s SIM card.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSimShieldActive(!simShieldActive)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all ${
                          simShieldActive
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/40'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {simShieldActive ? <Lock className="w-4 h-4 text-emerald-400" /> : <Unlock className="w-4 h-4 text-amber-400" />}
                        <span>{simShieldActive ? 'Defensive Carrier PIN: ACTIVE' : 'Defensive Carrier PIN: DISABLED'}</span>
                      </button>
                      <button
                        onClick={handleRunSimSwapSim}
                        disabled={simSimulating}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-bold shadow-lg shadow-rose-950/60 disabled:opacity-50 transition-all flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>{simSimulating ? 'Simulating Attack Flow...' : 'Launch Visualizer'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive SVG Telecom Architecture Diagram */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span>Interactive Network Signaling Topology (GSM/LTE Core to HSS/HLR)</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Step {simStep} of 5 · {simShieldActive ? 'Shielded' : 'Vulnerable'}
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto py-4">
                    <svg viewBox="0 0 900 320" className="w-full min-w-[700px] h-auto select-none">
                      <line
                        x1="120"
                        y1="100"
                        x2="280"
                        y2="100"
                        stroke={simStep >= 1 ? '#38bdf8' : '#334155'}
                        strokeWidth="3"
                        strokeDasharray={simStep === 1 ? '6,6' : '0'}
                      />
                      <line
                        x1="320"
                        y1="100"
                        x2="480"
                        y2="100"
                        stroke={simStep >= 2 ? (simShieldActive ? '#10b981' : '#f43f5e') : '#334155'}
                        strokeWidth="3"
                        strokeDasharray={simStep === 2 ? '6,6' : '0'}
                      />
                      <line
                        x1="520"
                        y1="100"
                        x2="680"
                        y2="100"
                        stroke={simStep >= 3 ? '#f43f5e' : '#334155'}
                        strokeWidth="3"
                      />
                      <path
                        d="M 720 120 C 720 220, 680 240, 500 240 L 140 240"
                        fill="none"
                        stroke={simStep >= 4 ? '#f43f5e' : '#1e293b'}
                        strokeWidth="3"
                        strokeDasharray={simStep >= 4 ? '5,5' : '0'}
                      />

                      <g transform="translate(60, 60)">
                        <rect
                          width="80"
                          height="80"
                          rx="16"
                          fill={simStep >= 4 ? '#1e293b' : '#0f172a'}
                          stroke={simStep >= 4 ? '#ef4444' : '#38bdf8'}
                          strokeWidth="2"
                        />
                        <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="22">📱</text>
                        <text x="40" y="72" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          Victim Phone
                        </text>
                        {simStep >= 4 && (
                          <g transform="translate(20, -10)">
                            <rect width="75" height="18" rx="6" fill="#ef4444" />
                            <text x="37" y="13" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">NO SERVICE</text>
                          </g>
                        )}
                      </g>

                      <g transform="translate(260, 60)">
                        <rect width="80" height="80" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                        <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="22">📡</text>
                        <text x="40" y="72" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          BTS Tower
                        </text>
                      </g>

                      <g transform="translate(460, 60)">
                        <rect
                          width="80"
                          height="80"
                          rx="16"
                          fill="#0f172a"
                          stroke={simStep >= 2 ? (simShieldActive ? '#10b981' : '#f43f5e') : '#64748b'}
                          strokeWidth="2"
                        />
                        <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="22">🌐</text>
                        <text x="40" y="72" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          SS7 Hub
                        </text>
                        {simShieldActive && (
                          <g transform="translate(-10, -12)">
                            <rect width="100" height="18" rx="6" fill="#059669" />
                            <text x="50" y="13" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">PORT LOCK ACTIVE</text>
                          </g>
                        )}
                      </g>

                      <g transform="translate(660, 60)">
                        <rect
                          width="80"
                          height="80"
                          rx="16"
                          fill="#0f172a"
                          stroke={simStep >= 3 ? '#f43f5e' : '#38bdf8'}
                          strokeWidth="2"
                        />
                        <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="22">🗄️</text>
                        <text x="40" y="72" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          HLR Database
                        </text>
                      </g>

                      <g transform="translate(60, 200)">
                        <rect
                          width="80"
                          height="80"
                          rx="16"
                          fill="#1c1917"
                          stroke={simStep >= 4 ? '#f43f5e' : '#44403c'}
                          strokeWidth="2"
                        />
                        <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="22">🦹‍♂️</text>
                        <text x="40" y="72" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="monospace">
                          Attacker SIM
                        </text>
                        {simStep >= 5 && (
                          <g transform="translate(15, 84)">
                            <rect width="85" height="18" rx="6" fill="#ef4444" />
                            <text x="42" y="13" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">2FA INTERCEPTED</text>
                          </g>
                        )}
                      </g>
                    </svg>
                  </div>

                  <div className="mt-4 bg-black/80 rounded-xl p-3 border border-slate-800 font-mono text-xs space-y-1">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1 text-slate-400">
                      <span className="flex items-center gap-1.5 text-rose-400">
                        <Terminal className="w-3.5 h-3.5" /> Telephony Signaling Audit Log
                      </span>
                      <span>Target: +91-98765-XXXXX</span>
                    </div>
                    <div className="max-h-28 overflow-y-auto space-y-1 pt-1 text-slate-300">
                      {simLog.map((line, idx) => (
                        <div key={idx} className={line.includes('COMPROMISED') ? 'text-rose-400 font-bold' : line.includes('BLOCKED') ? 'text-emerald-400 font-bold' : ''}>
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: DEEPFAKE VOICE AI */}
            {activeModule === 'deepfake' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Attack Vector 02 · Generative Acoustic Synthesizers &amp; Social Engineering
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Voice Cloning &amp; Deepfake Audio Simulator
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Modern neural vocoders (e.g. VALL-E, Bark) require as little as a 3-second audio sample scraped from Instagram Reels or WhatsApp voice notes to capture timbre, formant frequencies, and prosody.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                        <Volume2 className="w-4 h-4" />
                        <span>Neural Voice Cloning Workbench</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Client-Side Web Speech &amp; Canvas</span>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-2">Select Target Voice Profile:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'relative', label: 'Grandchild / Child', icon: '👦', pitch: 1.3, speed: 1.05, text: 'Papa, emergency hai! Mera wallet chori ho gaya Delhi me, please is UPI pe 10,000 transfer karo turant!' },
                          { id: 'ceo', label: 'Company CEO', icon: '👔', pitch: 0.85, speed: 0.9, text: 'Hi Rajesh, I am in a board meeting right now. Please execute an urgent supplier wire transfer of 45,000 dollars immediately.' },
                          { id: 'bank', label: 'Bank Fraud Officer', icon: '🏦', pitch: 1.0, speed: 1.0, text: 'Namaskar, main SBI Central Fraud Prevention se bol raha hoon. Suspicious transfer attempt hua hai. Turant OTP batayein.' }
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setVoicePersona(p.id as any);
                              setVoicePitch(p.pitch);
                              setVoiceSpeed(p.speed);
                              setVoiceText(p.text);
                            }}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              voicePersona === p.id
                                ? 'bg-cyan-500/20 border-cyan-500/60 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="text-xl mb-1">{p.icon}</div>
                            <div className="text-xs font-bold">{p.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-2">Synthetic Speech Script (Hinglish / English):</label>
                      <textarea
                        value={voiceText}
                        onChange={(e) => setVoiceText(e.target.value)}
                        rows={3}
                        className="w-full bg-black/60 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                          <span>Formant Pitch</span>
                          <span className="text-cyan-400">{voicePitch.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="1.8"
                          step="0.05"
                          value={voicePitch}
                          onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                          <span>Cadence Rate</span>
                          <span className="text-cyan-400">{voiceSpeed.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.6"
                          max="1.5"
                          step="0.05"
                          value={voiceSpeed}
                          onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSynthesizeVoice}
                      disabled={isSynthesizing}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-950/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>{isSynthesizing ? 'Synthesizing Neural Audio...' : 'Play Synthesized Deepfake Voice'}</span>
                    </button>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 shadow-xl">
                      <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1.5 text-cyan-400">
                          <Mic className="w-3.5 h-3.5" /> Acoustic Spectrogram Canvas
                        </span>
                        <span className={isSynthesizing ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-500'}>
                          {isSynthesizing ? 'GENERATING AUDIO' : 'IDLE'}
                        </span>
                      </div>

                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={140}
                        className="w-full h-36 bg-black/90 rounded-xl border border-slate-800"
                      />

                      <div className="mt-3 text-[11px] font-mono text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Acoustic Latent Dimension:</span>
                          <span className="text-cyan-300">512-dim Vector</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sampling Rate:</span>
                          <span className="text-cyan-300">24 kHz Mel-Spectrogram</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                        <Shield className="w-4 h-4" /> Anti-Deepfake Protocol: Duress Safe Words
                      </div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        Test the call with your family offline secret codeword (e.g., <code className="text-emerald-300 font-mono">NEELAM</code>). Ask the caller for the secret word!
                      </p>

                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Type codeword (try: NEELAM)..."
                          value={secretCodewordInput}
                          onChange={(e) => setSecretCodewordInput(e.target.value)}
                          className="flex-1 bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => {
                            if (secretCodewordInput.trim().toUpperCase() === 'NEELAM') {
                              setSecretWordVerified(true);
                            } else {
                              setSecretWordVerified(false);
                            }
                          }}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold"
                        >
                          Verify
                        </button>
                      </div>

                      {secretWordVerified !== null && (
                        <div className={`mt-3 p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
                          secretWordVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {secretWordVerified ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>SAFE WORD MATCH! Verified real family member. Not a deepfake scam.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              <span>SAFE WORD FAILED! Caller could not provide codeword. Hang up immediately!</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: EMAIL SPOOFING */}
            {activeModule === 'emailspoof' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Attack Vector 03 · SMTP Protocol Vulnerability &amp; DNS Authentication Triad
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Email Spoofing (SPF, DKIM, DMARC) Sandbox
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Simple Mail Transfer Protocol (SMTP RFC 821) permits any client to declare any arbitrary address in the{' '}
                    <code className="text-amber-300 font-mono">From:</code> header. Explore how SPF, DKIM cryptographic signatures, and DMARC policies stop CEO fraud &amp; BEC.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 border-b border-slate-800 pb-3">
                      <Mail className="w-4 h-4" />
                      <span>DNS Security Records Configuration</span>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1">
                        1. SPF (Sender Policy Framework) Record:
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">Defines which IP addresses are authorized to send mail for this domain.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '-all', label: '-all (HardFail)', desc: 'Strict authorized IPs only' },
                          { id: '~all', label: '~all (SoftFail)', desc: 'Questionable, flag spam' },
                          { id: '+all', label: '+all (Pass All)', desc: 'VULNERABLE: Any IP allowed!' },
                          { id: 'none', label: 'No Record', desc: 'Domain has no SPF TXT' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSpfConfig(opt.id as any)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              spfConfig === opt.id
                                ? 'bg-amber-500/20 border-amber-500/60 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="font-mono font-bold">{opt.label}</div>
                            <div className="text-[10px] text-slate-400">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1">
                        2. DKIM (DomainKeys Identified Mail):
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">Cryptographic RSA signature in email headers to verify message integrity.</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'valid', label: 'Valid Sign', color: 'text-emerald-400' },
                          { id: 'tampered', label: 'Tampered/Corrupt', color: 'text-rose-400' },
                          { id: 'missing', label: 'Missing DKIM', color: 'text-slate-400' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setDkimConfig(opt.id as any)}
                            className={`p-2.5 rounded-xl border text-center text-xs font-mono font-bold transition-all ${
                              dkimConfig === opt.id
                                ? 'bg-amber-500/20 border-amber-500/60 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className={opt.color}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1">
                        3. DMARC (Domain-based Message Authentication) Policy:
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">Instructs receiver mail servers what to do if SPF or DKIM fails.</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'reject', label: 'p=reject', desc: 'Drop email' },
                          { id: 'quarantine', label: 'p=quarantine', desc: 'Send to Spam' },
                          { id: 'none', label: 'p=none', desc: 'Monitor only' }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setDmarcPolicy(opt.id as any)}
                            className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                              dmarcPolicy === opt.id
                                ? 'bg-amber-500/20 border-amber-500/60 text-white'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="font-mono font-bold">{opt.label}</div>
                            <div className="text-[10px] text-slate-400">{opt.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleVerifyEmailSecurity}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-mono text-xs font-bold shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Simulate Sender to Receiver Packet Flow</span>
                    </button>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 shadow-xl font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-slate-400">
                        <span className="text-amber-400 font-bold flex items-center gap-1.5">
                          <FileCode className="w-4 h-4" /> Raw RFC 5322 Inbound Mail Headers
                        </span>
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                          ATTACK PACKET
                        </span>
                      </div>

                      <div className="space-y-1.5 text-slate-300 bg-black/60 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                        <div>
                          <span className="text-slate-500">Received-From: </span>
                          <span className="text-rose-400">185.220.101.5 (bulletproof-vps.ru)</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Return-Path: </span>
                          <span className="text-amber-300">{returnPath}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">From: </span>
                          <span className="text-rose-400 font-bold">{spoofedSender} (Spoofed Display Name)</span>
                        </div>
                        <div>
                          <span className="text-slate-500">To: </span>
                          <span className="text-cyan-300">finance-officer@target-company.com</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Subject: </span>
                          <span className="text-white font-semibold">URGENT: Re-route Quarterly Vendor Payout</span>
                        </div>
                      </div>
                    </div>

                    {emailVerifiedResult ? (
                      <div className={`p-5 rounded-2xl border backdrop-blur-md shadow-xl ${
                        emailVerifiedResult.dmarcAction === 'dropped'
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : emailVerifiedResult.dmarcAction === 'spam'
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                          : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      }`}>
                        <div className="flex items-center gap-2 text-sm font-bold font-mono">
                          {emailVerifiedResult.dmarcAction === 'dropped' ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <span>MAIL REJECTED AT GATEWAY (550 Policy Rejection)</span>
                            </>
                          ) : emailVerifiedResult.dmarcAction === 'spam' ? (
                            <>
                              <AlertTriangle className="w-5 h-5 text-amber-400" />
                              <span>MAIL QUARANTINED TO SPAM FOLDER</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-rose-400" />
                              <span>CRITICAL BREACH: SPOOFED MAIL DELIVERED TO INBOX!</span>
                            </>
                          )}
                        </div>

                        <p className="text-xs mt-2 leading-relaxed opacity-90">{emailVerifiedResult.reason}</p>

                        <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono text-xs">
                          <div className="bg-black/40 p-2 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-400">SPF VERDICT</div>
                            <div className={`font-bold ${emailVerifiedResult.spfPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {emailVerifiedResult.spfPass ? 'PASS' : 'FAIL'}
                            </div>
                          </div>
                          <div className="bg-black/40 p-2 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-400">DKIM VERDICT</div>
                            <div className={`font-bold ${emailVerifiedResult.dkimPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {emailVerifiedResult.dkimPass ? 'PASS' : 'FAIL'}
                            </div>
                          </div>
                          <div className="bg-black/40 p-2 rounded-xl border border-slate-800">
                            <div className="text-[10px] text-slate-400">DMARC OUTCOME</div>
                            <div className="font-bold uppercase text-cyan-300">
                              {emailVerifiedResult.dmarcAction}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500 font-mono text-xs">
                        Configure DNS records on the left and click "Simulate Sender to Receiver Packet Flow".
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: RAT SANDBOX */}
            {activeModule === 'rat' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                    Attack Vector 04 · Mobile Endpoint Compromise &amp; C2 Surveillance
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    RAT (Remote Access Trojan) Sandbox
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    Trojans masquerading as utility APKs coerce users to grant Android{' '}
                    <code className="text-rose-300 font-mono">BIND_ACCESSIBILITY_SERVICE</code>. This grants god-mode screen reading, keylogging, and silent SMS theft.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="text-xs font-mono text-slate-400 mb-2 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>Victim Smartphone UI (Samsung S23 / Android 14)</span>
                    </div>

                    <div className="w-[300px] h-[580px] bg-black border-4 border-slate-700 rounded-[38px] p-4 flex flex-col relative shadow-2xl shadow-cyan-950/40 overflow-hidden">
                      <div className="w-28 h-5 bg-slate-900 rounded-b-xl self-center absolute top-0 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-2">
                        <span>10:42 AM</span>
                        <div className="flex items-center gap-1">
                          {ratDefenseTriggered ? (
                            <span className="text-emerald-400">🛡️ Protected</span>
                          ) : (
                            <span className="text-rose-400 animate-pulse">● Rec Active</span>
                          )}
                          <span>5G 92%</span>
                        </div>
                      </div>

                      <div className="flex-1 mt-4 bg-slate-950 rounded-2xl p-3 border border-slate-900 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                              🔦
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">Ultra Flashlight Pro</div>
                              <div className="text-[9px] text-slate-400">v3.4.1 · Clean utility</div>
                            </div>
                          </div>

                          <div className="my-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-amber-500/50 mx-auto flex items-center justify-center text-amber-300 text-2xl shadow-lg shadow-amber-500/20">
                              ⚡
                            </div>
                            <div className="text-[11px] text-slate-400 mt-2">Torch is OFF</div>
                          </div>

                          {!ratDefenseTriggered && (
                            <div className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-2.5 text-[10px] text-rose-200 font-mono space-y-1">
                              <div className="font-bold flex items-center gap-1">
                                <Bug className="w-3 h-3 text-rose-400" /> COVERT BACKGROUND WORKER:
                              </div>
                              <div>• Accessibility service reading screen DOM</div>
                              <div>• Sending SMS inbox to 194.26.29.112:4444</div>
                              <div>• Battery drain: +38% / hour</div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setRatDefenseTriggered(!ratDefenseTriggered)}
                          className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            ratDefenseTriggered
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          }`}
                        >
                          {ratDefenseTriggered ? '✓ Safe Mode Activated: RAT Killed' : 'Kill Trojan Process & Revoke Permissions'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                        <Server className="w-4 h-4" />
                        <span>Hydra C2 Master Control Dashboard (Port 4444 Active)</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {ratDefenseTriggered ? 'TARGET DISCONNECTED' : 'SESSION: ACTIVE'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-black/80 rounded-xl p-3 border border-slate-800">
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Eye className="w-3.5 h-3.5" /> Front Cam Stream
                          </span>
                          <button
                            onClick={() => setRatActiveCamera(!ratActiveCamera)}
                            className="text-[10px] text-rose-400 underline"
                          >
                            {ratActiveCamera ? 'Stop' : 'Capture'}
                          </button>
                        </div>
                        <div className="h-28 bg-slate-950 rounded-lg border border-slate-900 flex items-center justify-center relative overflow-hidden">
                          {ratActiveCamera && !ratDefenseTriggered ? (
                            <div className="text-center">
                              <div className="text-3xl animate-bounce">👤</div>
                              <div className="text-[9px] font-mono text-rose-400 mt-1">Snapshot captured: face_01.jpg</div>
                            </div>
                          ) : (
                            <div className="text-[11px] font-mono text-slate-600">Camera Feed Dormant</div>
                          )}
                        </div>
                      </div>

                      <div className="bg-black/80 rounded-xl p-3 border border-slate-800">
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Mic className="w-3.5 h-3.5" /> Ambient Mic Bug
                          </span>
                          <button
                            onClick={() => setRatActiveMic(!ratActiveMic)}
                            className="text-[10px] text-rose-400 underline"
                          >
                            {ratActiveMic ? 'Mute' : 'Record'}
                          </button>
                        </div>
                        <div className="h-28 bg-slate-950 rounded-lg border border-slate-900 flex items-center justify-center">
                          {ratActiveMic && !ratDefenseTriggered ? (
                            <div className="text-center space-y-1">
                              <div className="flex gap-1 justify-center items-center h-8">
                                {[16, 28, 12, 32, 20, 36, 14].map((h, i) => (
                                  <div
                                    key={i}
                                    className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                                    style={{ height: `${h}px` }}
                                  />
                                ))}
                              </div>
                              <div className="text-[9px] font-mono text-rose-400">Streaming 128kbps AAC</div>
                            </div>
                          ) : (
                            <div className="text-[11px] font-mono text-slate-600">Mic Idle</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/80 rounded-xl p-3 border border-slate-800 font-mono text-xs">
                      <div className="text-slate-400 border-b border-slate-800 pb-1 mb-2 flex justify-between">
                        <span className="text-rose-400 font-bold">Exfiltrated Keystroke &amp; SMS Stream</span>
                        <span className="text-[10px] text-slate-500">Live Socket Payload</span>
                      </div>
                      <div className="space-y-1 text-slate-300">
                        {ratKeylogStream.map((log, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: OSINT */}
            {activeModule === 'osint' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                    Attack Vector 05 · Open Source Intelligence (OSINT) &amp; KBA Bypass
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Identity Theft &amp; OSINT Profiling Sandbox
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                    See how attackers harvest public Instagram captions, LinkedIn resumes, and Facebook tags to guess answers to banking security questions.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
                        <Search className="w-4 h-4" />
                        <span>Target's Public Social Media Footprint</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">Target: Aarav Sharma</span>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-black/60 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-200">📸 Instagram Post (@aarav_codes)</div>
                          <p className="text-slate-400 mt-1">
                            "Happy 2nd birthday to my golden boy <span className="text-rose-400 font-bold">Rocky</span>! 🐕 Best pet ever."
                          </p>
                        </div>
                        <button
                          onClick={() => setOsintCollectedData((prev) => ({ ...prev, petName: true }))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            osintCollectedData.petName ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {osintCollectedData.petName ? '✓ Harvested' : 'Scrape Intel'}
                        </button>
                      </div>

                      <div className="bg-black/60 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-200">💬 Facebook Family Post</div>
                          <p className="text-slate-400 mt-1">
                            "Happy 50th birthday mom! Still proud of your 1995 wedding photo. We love you <span className="text-rose-400 font-bold">Sunita Patel</span>! ❤️"
                          </p>
                        </div>
                        <button
                          onClick={() => setOsintCollectedData((prev) => ({ ...prev, motherMaiden: true }))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            osintCollectedData.motherMaiden ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {osintCollectedData.motherMaiden ? '✓ Harvested' : 'Scrape Intel'}
                        </button>
                      </div>

                      <div className="bg-black/60 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-200">🏍️ Twitter / X Fleet Post</div>
                          <p className="text-slate-400 mt-1">
                            "First self-earned ride! 2021 Black <span className="text-rose-400 font-bold">Pulsar 150</span> delivered today."
                          </p>
                        </div>
                        <button
                          onClick={() => setOsintCollectedData((prev) => ({ ...prev, firstCar: true }))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            osintCollectedData.firstCar ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {osintCollectedData.firstCar ? '✓ Harvested' : 'Scrape Intel'}
                        </button>
                      </div>

                      <div className="bg-black/60 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3">
                        <div className="text-xs">
                          <div className="font-semibold text-slate-200">🎓 LinkedIn Education Record</div>
                          <p className="text-slate-400 mt-1">
                            "Class XII Science · <span className="text-rose-400 font-bold">Delhi Public School RK Puram</span>"
                          </p>
                        </div>
                        <button
                          onClick={() => setOsintCollectedData((prev) => ({ ...prev, highSchool: true }))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            osintCollectedData.highSchool ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {osintCollectedData.highSchool ? '✓ Harvested' : 'Scrape Intel'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold">
                        <Lock className="w-4 h-4" />
                        <span>Target's Bank Portal Password Recovery Flow</span>
                      </div>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="bg-black/60 p-3 rounded-xl border border-slate-800">
                        <div className="text-slate-400">Security Question 1: What was your first pet's name?</div>
                        <div className="mt-1.5 font-bold text-white">
                          {osintCollectedData.petName ? 'Rocky (✓ Solved)' : '•••••••• (Awaiting OSINT)'}
                        </div>
                      </div>
                      <div className="bg-black/60 p-3 rounded-xl border border-slate-800">
                        <div className="text-slate-400">Security Question 2: What is your mother's maiden surname?</div>
                        <div className="mt-1.5 font-bold text-white">
                          {osintCollectedData.motherMaiden ? 'Patel (✓ Solved)' : '•••••••• (Awaiting OSINT)'}
                        </div>
                      </div>
                      <div className="bg-black/60 p-3 rounded-xl border border-slate-800">
                        <div className="text-slate-400">Security Question 3: What was the model of your first bike?</div>
                        <div className="mt-1.5 font-bold text-white">
                          {osintCollectedData.firstCar ? 'Pulsar 150 (✓ Solved)' : '•••••••• (Awaiting OSINT)'}
                        </div>
                      </div>
                      <div className="bg-black/60 p-3 rounded-xl border border-slate-800">
                        <div className="text-slate-400">Security Question 4: Which high school did you graduate from?</div>
                        <div className="mt-1.5 font-bold text-white">
                          {osintCollectedData.highSchool ? 'DPS RK Puram (✓ Solved)' : '•••••••• (Awaiting OSINT)'}
                        </div>
                      </div>
                    </div>

                    {Object.values(osintCollectedData).every(Boolean) && (
                      <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-mono">
                        <div className="font-bold flex items-center gap-1.5 text-rose-400">
                          <AlertTriangle className="w-4 h-4" /> ALL SECURITY QUESTIONS MATCHED!
                        </div>
                        <p className="mt-1">
                          Attacker successfully reset password without victim's phone.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 2: TECHNICAL PROTOCOLS & RFC SPECIFICATIONS */}
        {/* ========================================================================= */}
        {subViewMode === 'specs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                In-Depth Engineering Specifications &amp; Standards
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Telecommunications Signaling, RFC Standards &amp; Binary Wire Formats
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Authoritative packet structures, signaling primitives, and architectural vulnerability blueprints from 3GPP, ITU-T, and IETF specifications.
              </p>
            </div>

            {/* SS7 Protocol Signals */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" /> SS7 Mobile Application Part (MAP) Vulnerabilities
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SS7_PROTOCOL_SPECS.map((spec, i) => (
                  <div key={i} className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-mono text-xs font-bold text-rose-400">{spec.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{spec.rfcOrStandard} · {spec.layer}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{spec.overview}</p>

                    <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-500/30 text-xs text-rose-200">
                      <span className="font-bold">Vulnerability Mechanism: </span>
                      {spec.vulnerabilityDetails}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-mono font-bold text-slate-400">Packet Wire Structure:</div>
                      <div className="bg-black/60 rounded-xl p-2 border border-slate-800 divide-y divide-slate-800 font-mono text-[11px]">
                        {spec.packetStructure.map((field, fIdx) => (
                          <div key={fIdx} className="py-1 flex justify-between">
                            <span className="text-cyan-300 font-semibold">{field.field} ({field.size})</span>
                            <span className="text-slate-400 text-right">{field.purpose}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
                      <span className="font-bold">Blue-Team Mitigation: </span>
                      {spec.blueTeamCountermeasure}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Security Standards */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" /> Email Cryptographic Triad: SPF, DKIM &amp; DMARC RFCs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="font-mono text-xs font-bold text-amber-400">{EMAIL_SECURITY_STANDARDS.spf.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{EMAIL_SECURITY_STANDARDS.spf.rfc}</div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {EMAIL_SECURITY_STANDARDS.spf.mechanisms.map((m, idx) => (
                      <div key={idx} className="bg-black/40 p-2 rounded-lg border border-slate-800 font-mono text-[11px]">
                        <div className="text-amber-300 font-bold">{m.prefix}</div>
                        <div className="text-slate-400">{m.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-rose-300 bg-rose-950/30 p-2 rounded border border-rose-500/20">
                    <span className="font-bold">Limitation: </span>{EMAIL_SECURITY_STANDARDS.spf.limitations}
                  </div>
                </div>

                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="font-mono text-xs font-bold text-cyan-400">{EMAIL_SECURITY_STANDARDS.dkim.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{EMAIL_SECURITY_STANDARDS.dkim.rfc}</div>
                  <p className="text-xs text-slate-300">{EMAIL_SECURITY_STANDARDS.dkim.overview}</p>
                  <div className="space-y-1 font-mono text-[11px] bg-black/60 p-2 rounded-xl border border-slate-800">
                    {EMAIL_SECURITY_STANDARDS.dkim.headerFields.map((h, idx) => (
                      <div key={idx} className="py-0.5 flex justify-between">
                        <span className="text-cyan-300 font-bold">{h.tag}</span>
                        <span className="text-slate-400">{h.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="font-mono text-xs font-bold text-emerald-400">{EMAIL_SECURITY_STANDARDS.dmarc.title}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{EMAIL_SECURITY_STANDARDS.dmarc.rfc}</div>
                  <p className="text-xs text-slate-300">{EMAIL_SECURITY_STANDARDS.dmarc.overview}</p>
                  <div className="space-y-1.5 text-xs">
                    {EMAIL_SECURITY_STANDARDS.dmarc.policies.map((p, idx) => (
                      <div key={idx} className="bg-black/40 p-2 rounded-lg border border-slate-800">
                        <div className="font-mono text-emerald-300 font-bold">{p.policy} ({p.action})</div>
                        <div className="text-[11px] text-slate-400">{p.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 3: REAL-WORLD CASE STUDIES */}
        {/* ========================================================================= */}
        {subViewMode === 'cases' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                Forensic Analysis &amp; High-Profile Incident Deconstructions
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Real-World Cyber Heists, Timelines &amp; Post-Mortems
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Deep-dive into actual breaches demonstrating how technical vulnerabilities and human social engineering converged into catastrophic losses.
              </p>
            </div>

            <div className="space-y-6">
              {CASE_STUDIES.map((study) => (
                <div key={study.id} className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white font-mono">{study.title}</h3>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Target: <span className="text-cyan-300">{study.victim}</span> · Year: <span className="text-amber-300">{study.year}</span> · Vector: <span className="text-rose-400">{study.attackVector}</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-mono font-bold self-start md:self-auto">
                      Damage: {study.financialOrDataLoss}
                    </div>
                  </div>

                  {/* Incident Timeline */}
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> Attack Timeline &amp; Kill Chain Progression:
                    </div>
                    <div className="space-y-2">
                      {study.timeline.map((step, sIdx) => (
                        <div key={sIdx} className="bg-black/50 border border-slate-800/80 p-3 rounded-xl flex items-start gap-3 text-xs">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {sIdx + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-200">{step.step}</span>
                              <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                            </div>
                            <p className="text-slate-400 mt-0.5 leading-relaxed">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical & Lessons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                      <div className="font-bold text-amber-300 font-mono mb-1">🔬 Root Technical Vulnerability:</div>
                      <p className="text-slate-400 leading-relaxed">{study.technicalBreakdown}</p>
                    </div>
                    <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                      <div className="font-bold text-emerald-300 font-mono mb-1">🛡️ Blue-Team Lesson Learned:</div>
                      <p className="text-slate-400 leading-relaxed">{study.lessonLearned}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 4: INDIAN CYBER LAWS & FIR PLAYBOOK */}
        {/* ========================================================================= */}
        {subViewMode === 'legal' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Statutory Framework &amp; Law Enforcement Playbook
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Indian Cyber Law (IT Act 2000, BNS) &amp; Emergency FIR Protocol
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Precise statutory legal sections for SIM swapping, deepfakes, phishing, and remote access trojans, plus the official step-by-step Golden Hour recovery procedure.
              </p>
            </div>

            {/* Golden Hour Playbook */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
                <PhoneCall className="w-4 h-4 animate-pulse" /> The 60-Minute "Golden Hour" Recovery Playbook
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {INCIDENT_RESPONSE_PLAYBOOK.goldenHourActions.map((action, i) => (
                  <div key={i} className="bg-black/60 border border-slate-800 p-4 rounded-xl space-y-2">
                    <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      {action.minute}
                    </div>
                    <div className="text-xs font-bold text-white">{action.title}</div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{action.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Statutes Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LEGAL_PROVISIONS.map((law, idx) => (
                <div key={idx} className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-emerald-400">{law.code}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Penal Section
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{law.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{law.applicability}</p>

                  <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30 text-xs text-rose-200 font-mono">
                    <span className="font-bold">Prescribed Penalty: </span>{law.penalty}
                  </div>

                  {law.bnsEquivalent && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-bold">New BNS Provision: </span>{law.bnsEquivalent}
                    </div>
                  )}

                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    <span className="font-bold text-cyan-300">FIR Filing Tip: </span>{law.practicalFilingTip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 5: VULNERABILITY AUDIT & RISK CALCULATOR */}
        {/* ========================================================================= */}
        {subViewMode === 'audit' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Self-Assessment Diagnostic Engine
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Personal Cyber Vulnerability Risk Calculator
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Answer these 4 fundamental diagnostic questions to compute your real-world exposure to SIM swapping, deepfake scams, and account takeover.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Questions Column */}
              <div className="lg:col-span-8 space-y-4">
                {SELF_AUDIT_QUESTIONS.map((q, qIdx) => (
                  <div key={q.id} className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-cyan-400 font-bold">Diagnostic {qIdx + 1} · {q.category}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{q.question}</div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = auditAnswers[q.id] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => setAuditAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-500/60 ring-1 ring-cyan-500/30 text-white'
                                : 'bg-black/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-center text-xs font-medium">
                              <span>{opt.label}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                opt.scoreImpact === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}>
                                +{opt.scoreImpact}% Risk
                              </span>
                            </div>
                            {isSelected && (
                              <p className="text-[11px] text-cyan-200 mt-1.5 font-mono pt-1 border-t border-cyan-500/20">
                                💡 Advice: {opt.advice}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-Time Risk Score Dial Column */}
              <div className="lg:col-span-4 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400 border-b border-slate-800 pb-2 mb-4">
                    AGGREGATE THREAT POSTURE
                  </div>

                  <div className="text-center my-6">
                    <div className="relative inline-flex items-center justify-center">
                      <div className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center ${
                        calculateTotalRisk() > 50
                          ? 'border-rose-500/50 bg-rose-950/20 shadow-2xl shadow-rose-950'
                          : calculateTotalRisk() > 20
                          ? 'border-amber-500/50 bg-amber-950/20 shadow-2xl shadow-amber-950'
                          : 'border-emerald-500/50 bg-emerald-950/20 shadow-2xl shadow-emerald-950'
                      }`}>
                        <span className="text-3xl font-black font-mono text-white">
                          {calculateTotalRisk()}%
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                          Risk Level
                        </span>
                      </div>
                    </div>

                    <div className={`mt-4 font-mono font-bold text-sm ${
                      calculateTotalRisk() > 50 ? 'text-rose-400' : calculateTotalRisk() > 20 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {calculateTotalRisk() > 50
                        ? 'CRITICAL EXPOSURE'
                        : calculateTotalRisk() > 20
                        ? 'MODERATE THREAT SURFACE'
                        : 'HARDENED POSTURE'}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div>• 0-20%: Bank-grade enterprise security</div>
                    <div>• 21-50%: Vulnerable to targeted spear phishing</div>
                    <div>• 51-100%: High probability of SIM swap or 2FA takeover</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setAuditAnswers({ q1: 2, q2: 1, q3: 2, q4: 1 })}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 transition-all"
                  >
                    Load Ideal Hardened State (0% Risk)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Ransomware MITRE ATT&CK Timeline Overlay Modal */}
      <RansomwareTimelineOverlay
        isOpen={ransomwareTimelineOpen}
        onClose={() => setRansomwareTimelineOpen(false)}
      />
    </div>
  );
};
export default CyberCrimeMatrixApp;
