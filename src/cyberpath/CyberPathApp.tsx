import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Brain,
  Cpu,
  Terminal,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  Search,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Lock,
  Unlock,
  Key,
  Globe,
  Flame,
  ArrowRight,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Sliders,
  FileText,
  RotateCcw,
  Play,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FolderLock,
  Activity,
  Server,
  Cloud,
  Code2,
  DollarSign,
  Scale
} from 'lucide-react';
import {
  THINK_SCENARIOS,
  FAMOUS_BREACHES,
  DEEP_CONCEPTS,
  CERT_ROADMAP,
  INDIAN_CYBER_LAWS,
  INTERVIEW_QA_BANK,
  QUIZ_QUESTIONS,
  BOOTCAMP_30_DAYS,
  ThinkScenario,
  BreachCaseStudy,
  DeepConcept,
  InterviewQA
} from './data/cyberPathData';

export interface CyberPathAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const CyberPathApp: React.FC<CyberPathAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<
    'mindset' | 'simlab' | 'homelab' | 'deepdive' | 'practice' | 'career' | 'notes'
  >('mindset');

  // Global "Explain Like I'm 5" (ELI5) vs Technical Toggle
  const [isEli5Mode, setIsEli5Mode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cyberpath_eli5_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleEli5 = () => {
    setIsEli5Mode((prev) => {
      const next = !prev;
      localStorage.setItem('cyberpath_eli5_mode', String(next));
      return next;
    });
  };

  // Gamification: XP & Levels
  const [userXp, setUserXp] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cyberpath_xp') || '250', 10);
    } catch {
      return 250;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cyberpath_streak') || '3', 10);
    } catch {
      return 3;
    }
  });

  const addXp = (amount: number, reason: string) => {
    setUserXp((prev) => {
      const updated = prev + amount;
      localStorage.setItem('cyberpath_xp', String(updated));
      return updated;
    });
  };

  // Rank Calculation
  const rankInfo = useMemo(() => {
    if (userXp < 200) return { title: 'Script Kiddie', level: 1, next: 200, color: 'text-slate-400' };
    if (userXp < 600) return { title: 'Padawan', level: 2, next: 600, color: 'text-cyan-400' };
    if (userXp < 1500) return { title: 'Security Analyst', level: 3, next: 1500, color: 'text-blue-400' };
    if (userXp < 3000) return { title: 'Threat Hunter', level: 4, next: 3000, color: 'text-emerald-400' };
    if (userXp < 5000) return { title: 'Elite Defender', level: 5, next: 5000, color: 'text-purple-400' };
    return { title: 'Cyber Master', level: 6, next: 10000, color: 'text-amber-400' };
  }, [userXp]);

  // Bookmarks & Notes
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpath_bookmarks');
      return saved ? JSON.parse(saved) : ['sc-1', 'dc-1'];
    } catch {
      return ['sc-1', 'dc-1'];
    }
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('cyberpath_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const [personalNotes, setPersonalNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('cyberpath_notes') || '# My Cybersecurity Learning Notes\n- Completed STRIDE threat modeling notes.\n- Memorize port numbers: 22 SSH, 53 DNS, 443 HTTPS.\n- Remember: Prepared statements for SQLi, context encoding for XSS!';
    } catch {
      return '';
    }
  });

  const handleSaveNotes = (val: string) => {
    setPersonalNotes(val);
    localStorage.setItem('cyberpath_notes', val);
  };

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // ─────────────────────────────────────────────────────────────
  // MODULE 1 STATE: Scenarios, STRIDE, CIA, Breaches
  // ─────────────────────────────────────────────────────────────
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [selectedScenarioChoice, setSelectedScenarioChoice] = useState<string | null>(null);
  const [strideActiveCategory, setStrideActiveCategory] = useState<'S' | 'T' | 'R' | 'I' | 'D' | 'E'>('S');
  const [selectedBreachId, setSelectedBreachId] = useState<string>('case-1');

  // ─────────────────────────────────────────────────────────────
  // MODULE 2 STATE: Attack Sim Lab (Visual Educational Sandbox)
  // ─────────────────────────────────────────────────────────────
  const [simActiveTab, setSimActiveTab] = useState<'sqli' | 'xss' | 'csrf' | 'phish' | 'pw-math' | 'wifi' | 'mitm'>('sqli');

  // SQLi Visualizer State
  const [sqliInput, setSqliInput] = useState<string>("' OR '1'='1' --");
  const [sqliDefenseMode, setSqliDefenseMode] = useState<boolean>(false);

  // XSS Visualizer State
  const [xssInput, setXssInput] = useState<string>("<script>alert('Cookie: ' + document.cookie)</script>");
  const [xssDefenseMode, setXssDefenseMode] = useState<boolean>(false);

  // Phishing Email Hotspots State
  const [phishFoundHotspots, setPhishFoundHotspots] = useState<string[]>([]);

  // Password Math Calculator State
  const [pwLength, setPwLength] = useState<number>(12);
  const [pwCharsetSize, setPwCharsetSize] = useState<number>(94); // upper+lower+digits+symbols

  const pwMathResults = useMemo(() => {
    const combinations = Math.pow(pwCharsetSize, pwLength);
    const entropyBits = Math.round(pwLength * Math.log2(pwCharsetSize));
    
    // Hardware Hash Rates (RTX 4090)
    const md5Speed = 100e9; // 100 GH/s
    const sha256Speed = 30e9; // 30 GH/s
    const bcryptSpeed = 50e3; // 50 KH/s (Cost 12)
    const argon2Speed = 5e3; // 5 KH/s

    const formatTime = (seconds: number) => {
      if (seconds < 0.001) return 'Instant (< 1 millisecond)';
      if (seconds < 1) return 'Sub-second';
      if (seconds < 60) return `${Math.round(seconds)} seconds`;
      if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
      if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
      if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
      if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
      if (seconds < 31536000 * 1e6) return `${(seconds / 31536000).toExponential(2)} years`;
      return 'Trillions of years (Mathematically unbreakable in our lifetime)';
    };

    return {
      entropyBits,
      combinations: combinations.toExponential(2),
      timeMd5: formatTime(combinations / md5Speed),
      timeSha256: formatTime(combinations / sha256Speed),
      timeBcrypt: formatTime(combinations / bcryptSpeed),
      timeArgon2: formatTime(combinations / argon2Speed)
    };
  }, [pwLength, pwCharsetSize]);

  // ─────────────────────────────────────────────────────────────
  // MODULE 3 STATE: Home Lab Guides
  // ─────────────────────────────────────────────────────────────
  const [homeLabActiveSection, setHomeLabActiveSection] = useState<'vbox' | 'kali' | 'thm' | 'htb' | 'pico' | 'docker' | 'network'>('vbox');

  // ─────────────────────────────────────────────────────────────
  // MODULE 4 STATE: Deep Concepts
  // ─────────────────────────────────────────────────────────────
  const [deepCategoryFilter, setDeepCategoryFilter] = useState<string>('all');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('dc-1');

  // ─────────────────────────────────────────────────────────────
  // MODULE 5 STATE: Practice (Quiz & Interview & Challenges)
  // ─────────────────────────────────────────────────────────────
  const [practiceSubTab, setPracticeSubTab] = useState<'daily' | 'bootcamp' | 'quiz' | 'interview'>('daily');
  
  // Daily Challenge State
  const [dailyAnswer, setDailyAnswer] = useState('');
  const [dailySubmitted, setDailySubmitted] = useState(false);
  const [dailySuccess, setDailySuccess] = useState(false);

  // Bootcamp Checklist
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpath_bootcamp_completed');
      return saved ? JSON.parse(saved) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  const toggleBootcampDay = (day: number) => {
    setCompletedDays((prev) => {
      const next = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];
      localStorage.setItem('cyberpath_bootcamp_completed', JSON.stringify(next));
      if (!prev.includes(day)) addXp(25, `Completed Bootcamp Day ${day}`);
      return next;
    });
  };

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const quizScore = useMemo(() => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  }, [quizAnswers]);

  // Interview Domain Filter
  const [interviewDomainFilter, setInterviewDomainFilter] = useState<string>('all');
  const [expandedInterviewId, setExpandedInterviewId] = useState<string | null>('i-1');

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ─────────────────────────────────────────────────────────────
          TOP NAVBAR & GAMIFICATION DASHBOARD
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToBca}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Return to BCA Verse"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                      CyberPath
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      100% Legal Defense
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                    Zero to Master Cybersecurity Roadmap · TryHackMe &amp; OSCP Standard
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: ELI5 Toggle & Gamification Badges */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* "Explain Like I'm 5" (ELI5) Toggle */}
              <button
                onClick={toggleEli5}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isEli5Mode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
                title={isEli5Mode ? 'Switch to Technical In-Depth Mode' : 'Switch to Super Simple ELI5 Mode'}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isEli5Mode ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
                <span className="hidden xs:inline">{isEli5Mode ? 'ELI5 Mode (Simple)' : 'Technical Mode'}</span>
                <span className="xs:hidden">{isEli5Mode ? 'ELI5' : 'Tech'}</span>
              </button>

              {/* Streak Tracker */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-950/60 border border-orange-800/60 text-orange-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
                <span>{streakDays}d Streak</span>
              </div>

              {/* XP & Rank Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <div>
                  <span className={`font-extrabold ${rankInfo.color}`}>{rankInfo.title}</span>
                  <span className="text-slate-400 ml-1.5 font-mono">{userXp} XP</span>
                </div>
              </div>

              {/* 15-App Switcher Modal Trigger */}
              <button
                onClick={onOpenAppSwitcher}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Suite Apps</span>
              </button>
            </div>
          </div>

          {/* Module Tabs Navigation */}
          <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
            {[
              { id: 'mindset', label: '1. Hacker Mindset', icon: Brain, badge: 'Scenarios' },
              { id: 'simlab', label: '2. Attack Sim Lab', icon: Activity, badge: 'Visual' },
              { id: 'homelab', label: '3. Home Lab Setup', icon: Server, badge: 'VirtualBox' },
              { id: 'deepdive', label: '4. Deep Concepts', icon: BookOpen, badge: '99% Unknown' },
              { id: 'practice', label: '5. Daily Practice', icon: Terminal, badge: 'XP & Quizzes' },
              { id: 'career', label: '6. Career & Legal', icon: Award, badge: 'Jobs & Certs' },
              { id: 'notes', label: 'Notes & Bookmarks', icon: FileText, badge: bookmarks.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-xs shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                      isActive ? 'bg-cyan-800 text-cyan-100 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT CONTAINER
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ═════════════════════════════════════════════════════════════
            MODULE 1: 🧠 HACKER MINDSET (SOCHNE KA TARIKA)
            ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'mindset' && (
          <div className="space-y-8">
            {/* Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Defensive Architecture &amp; Threat Modeling</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Module 1: The Defensive Hacker Mindset
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Ek acha security analyst banne ke liye pehle samajhna padta hai ki attacker kaise sochta hai.
                  Yahan 20+ real-world interactive scenarios hain: Pehle khud decision lo, phir multi-layered defense strategy dekho!
                </p>
              </div>
            </div>

            {/* Sub-Tabs for Module 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: 20+ Scenarios Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Real-World Scenarios ({THINK_SCENARIOS.length})
                  </h3>
                  <span className="text-xs text-cyan-400 font-mono">Select to Analyze</span>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                  {THINK_SCENARIOS.map((sc, idx) => {
                    const isSelected = selectedScenarioIndex === idx;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => {
                          setSelectedScenarioIndex(idx);
                          setSelectedScenarioChoice(null);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-850 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-cyan-400">{sc.sector}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Case #{idx + 1}</span>
                        </div>
                        <div className="text-sm font-bold text-white leading-snug">{sc.title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right 2 Columns: Active Scenario Interactive Workspace */}
              <div className="lg:col-span-2 space-y-6">
                {(() => {
                  const currentSc = THINK_SCENARIOS[selectedScenarioIndex];
                  return (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                      {/* Scenario Title Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            {currentSc.sector}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                            {currentSc.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => toggleBookmark(currentSc.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {bookmarks.includes(currentSc.id) ? (
                            <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Goal & Description */}
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-rose-300 text-xs">
                          <strong className="text-rose-200">🎯 Attacker Ka Goal: </strong>
                          {currentSc.attackerGoal}
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 text-slate-200 text-sm leading-relaxed">
                          {isEli5Mode ? (
                            <div>
                              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1">
                                <Sparkles className="w-3.5 h-3.5" /> ELI5 Simple Breakdown:
                              </span>
                              {currentSc.eli5Description}
                            </div>
                          ) : (
                            currentSc.scenarioDescription
                          )}
                        </div>
                      </div>

                      {/* Interactive Question */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-cyan-400" />
                          <span>{currentSc.question}</span>
                        </h4>

                        <div className="space-y-2">
                          {currentSc.options.map((opt) => {
                            const isChosen = selectedScenarioChoice === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  setSelectedScenarioChoice(opt.id);
                                  if (opt.isOptimal) addXp(20, 'Correct scenario response');
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                                  isChosen
                                    ? opt.isOptimal
                                      ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-sm'
                                      : 'bg-rose-950/60 border-rose-500/80 text-rose-200'
                                    : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{opt.text}</span>
                                  {isChosen && (
                                    <span className="shrink-0 ml-2">
                                      {opt.isOptimal ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                      ) : (
                                        <AlertCircle className="w-4 h-4 text-rose-400" />
                                      )}
                                    </span>
                                  )}
                                </div>
                                {isChosen && (
                                  <div className="mt-2 pt-2 border-t border-slate-700/60 text-xs font-normal">
                                    {opt.feedback}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Defense Strategy Unlocked */}
                      <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <Shield className="w-4 h-4" />
                          <span>Industry Defense Strategy &amp; Hardening</span>
                        </div>
                        <h5 className="text-sm font-bold text-white">{currentSc.defenseStrategy.title}</h5>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                          {currentSc.defenseStrategy.principles.map((pr, i) => (
                            <li key={i}>{pr}</li>
                          ))}
                        </ul>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto">
                          {currentSc.defenseStrategy.technicalRemediation}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* STRIDE Threat Modeling Interactive Matrix */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Framework</span>
                      <h3 className="text-xl font-black text-white">STRIDE Threat Modeling Playground</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                      Microsoft STRIDE
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Software architecture me threats identify karne ke liye STRIDE framework use kiya jata hai. Har letter ek specific risk aur defense ko represent karta hai:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {[
                      { key: 'S' as const, name: 'Spoofing', threat: 'Identity Theft', defense: 'Authentication' },
                      { key: 'T' as const, name: 'Tampering', threat: 'Data Modification', defense: 'Integrity (HMAC/SHA)' },
                      { key: 'R' as const, name: 'Repudiation', threat: 'Denying Actions', defense: 'Non-Repudiation (Logs)' },
                      { key: 'I' as const, name: 'Info Disclosure', threat: 'Data Leak', defense: 'Confidentiality (TLS)' },
                      { key: 'D' as const, name: 'Denial of Service', threat: 'Crashing System', defense: 'Availability (Rate Limits)' },
                      { key: 'E' as const, name: 'Elevation of Priv', threat: 'Privilege Escalation', defense: 'Authorization (RBAC)' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setStrideActiveCategory(item.key)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          strideActiveCategory === item.key
                            ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-lg font-black text-cyan-400 font-mono">{item.key}</div>
                        <div className="text-xs font-bold truncate">{item.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active STRIDE Card Details */}
                  {(() => {
                    const strideDetails: Record<'S' | 'T' | 'R' | 'I' | 'D' | 'E', { title: string; risk: string; defense: string; example: string }> = {
                      S: {
                        title: 'Spoofing Identity (Nakal Karna)',
                        risk: 'Attacker pretend karta hai ki wo koi aur verified user ya system hai (e.g. IP spoofing, Email header spoofing, fake JWT signature).',
                        defense: 'Strong Authentication: Multi-Factor Authentication (MFA), FIDO2 Passkeys, mutual TLS (mTLS), SPF/DKIM/DMARC.',
                        example: 'Fake email claims to come from CEO requesting emergency bank transfer.'
                      },
                      T: {
                        title: 'Tampering with Data (Data Chhedna)',
                        risk: 'Data ko transit ya rest me modify karna (e.g. changing price parameter in HTTP request from $500 to $1).',
                        defense: 'Cryptographic Integrity: HMAC-SHA256, Digital Signatures, TLS 1.3, Immutable database logs.',
                        example: 'Intercepting payment gateway callback and modifying payment status to \'SUCCESS\'.'
                      },
                      R: {
                        title: 'Repudiation (Mukar Jaana)',
                        risk: 'User koi illegal action karta hai aur baad me mukar jata hai "Maine nahi kiya, system hack tha".',
                        defense: 'Non-Repudiation: Digitally signed audit trails, WORM (Write Once Read Many) storage, tamper-proof SIEM logs.',
                        example: 'An employee deletes critical customer database and claims credentials were stolen.'
                      },
                      I: {
                        title: 'Information Disclosure (Data Leak)',
                        risk: 'Confidential data unauthenticated logon ke samne expose ho jana (e.g. open S3 bucket, verbose stack traces with database passwords).',
                        defense: 'Confidentiality: AES-256-GCM encryption at rest, TLS 1.3 in transit, strict DLP, zero-knowledge KMS.',
                        example: 'Web server returns full SQL query error exposing credit card numbers in browser.'
                      },
                      D: {
                        title: 'Denial of Service (Service Rokna)',
                        risk: 'Server ko crash karna ya itne requests bhejna ki legitimate users access na kar payein (e.g. SYN flood, ReDoS regex crash).',
                        defense: 'Availability: Cloudflare DDoS protection, Anycast DNS, token-bucket rate limiting, auto-scaling.',
                        example: 'Sending a single complex regular expression that consumes 100% CPU for 10 minutes.'
                      },
                      E: {
                        title: 'Elevation of Privilege (Aukaat Se Badi Chabi)',
                        risk: 'Standard user system ka admin / root access le leta hai (e.g. modifying cookie `role=admin`, kernel exploit).',
                        defense: 'Authorization & Least Privilege: Role-Based Access Control (RBAC), sudo restrictions, SELinux policies.',
                        example: 'A regular student changes their role parameter to \'Dean\' to alter exam grades.'
                      }
                    };
                    const active = strideDetails[strideActiveCategory];
                    return (
                      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 space-y-2 text-xs">
                        <div className="text-sm font-bold text-indigo-300">{active.title}</div>
                        <p><strong className="text-slate-300">Threat / Risk: </strong>{active.risk}</p>
                        <p><strong className="text-emerald-400">Defense Solution: </strong>{active.defense}</p>
                        <p className="text-slate-400 italic"><strong className="text-slate-300 not-italic">Example: </strong>{active.example}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* 10 Case Studies of Famous Breaches */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">History Lessons</span>
                      <h3 className="text-xl font-black text-white">Famous Real-World Breaches Deep Dive</h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">10 Historic Cases</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FAMOUS_BREACHES.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBreachId(b.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedBreachId === b.id
                            ? 'bg-amber-950/60 border-amber-500 text-white'
                            : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-[10px] text-amber-400 font-mono font-bold">{b.year}</div>
                        <div className="text-xs font-bold truncate">{b.name}</div>
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const activeBreach = FAMOUS_BREACHES.find((b) => b.id === selectedBreachId) || FAMOUS_BREACHES[0];
                    return (
                      <div className="p-5 rounded-2xl bg-slate-850/90 border border-slate-800 space-y-4 text-xs">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-bold text-white">{activeBreach.name} ({activeBreach.year})</h4>
                            <p className="text-slate-400 mt-0.5">Victim: {activeBreach.target}</p>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-rose-950 text-rose-300 font-mono font-bold text-[10px]">
                            {activeBreach.impact}
                          </span>
                        </div>

                        {isEli5Mode ? (
                          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-200">
                            <strong>ELI5 Summary: </strong>{activeBreach.eli5Summary}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p><strong className="text-slate-200">What Happened: </strong>{activeBreach.whatHappened}</p>
                            <p><strong className="text-rose-300">Root Cause: </strong>{activeBreach.rootCause}</p>
                            <p><strong className="text-emerald-300">How to Prevent: </strong>{activeBreach.howToPrevent}</p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-800">
                          <span className="font-bold text-slate-300 block mb-1">Key Defensive Lessons:</span>
                          <ul className="space-y-1 list-disc list-inside text-slate-400">
                            {activeBreach.lessonsLearned.map((ls, idx) => (
                              <li key={idx}>{ls}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODULE 2: 🔬 ATTACK SIMULATION LAB (VISUAL EDUCATIONAL SANDBOX)
            ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'simlab' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Pure Visual Simulations · Zero Attack Execution</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Module 2: Visual Attack &amp; Defense Lab
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Har simulation educational visual demo hai jo dikhata hai ki application logic kaise break hoti hai aur standard defense (Prepared Statements, Output Encoding, Anti-CSRF tokens) use kaise rokta hai.
                </p>
              </div>
            </div>

            {/* Sim Lab Sub-Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'sqli', label: 'SQL Injection Visualizer', icon: Terminal },
                { id: 'xss', label: 'XSS & Output Encoding', icon: Code2 },
                { id: 'csrf', label: 'CSRF Token Defense', icon: Shield },
                { id: 'phish', label: 'Phishing Email Inspector', icon: Eye },
                { id: 'pw-math', label: 'Password Attack Math', icon: Lock },
                { id: 'wifi', label: 'WiFi (WEP/WPA2/WPA3)', icon: Globe },
                { id: 'mitm', label: 'MITM & TLS Defense', icon: Server }
              ].map((sub) => {
                const Icon = sub.icon;
                const isActive = simActiveTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSimActiveTab(sub.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/80 shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 1. SQL Injection Visualizer */}
            {simActiveTab === 'sqli' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">SQL Injection: Logic Breakdown &amp; Prepared Statements</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      See how string concatenation allows input to change database execution structure versus parameterized queries.
                    </p>
                  </div>
                  <button
                    onClick={() => setSqliDefenseMode((prev) => !prev)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      sqliDefenseMode
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : 'bg-rose-950 text-rose-300 border-rose-500'
                    }`}
                  >
                    {sqliDefenseMode ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{sqliDefenseMode ? 'Defense Active (Prepared Statements)' : 'Vulnerable Mode (String Concat)'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Input Form Simulation */}
                  <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                    <div className="text-xs font-bold uppercase text-slate-400">Simulated Login Form</div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Username / Account Input</label>
                      <input
                        type="text"
                        value={sqliInput}
                        onChange={(e) => setSqliInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <button
                        onClick={() => setSqliInput("' OR '1'='1' --")}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        Payload 1: \' OR \'1\'=\'1\' --
                      </button>
                      <button
                        onClick={() => setSqliInput("admin' #")}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        Payload 2: admin\' #
                      </button>
                      <button
                        onClick={() => setSqliInput("john_doe")}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        Normal: john_doe
                      </button>
                    </div>
                  </div>

                  {/* Right: Database Engine Execution View */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-3">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Database Engine AST Parser</div>
                    {sqliDefenseMode ? (
                      <div className="space-y-3">
                        <div className="text-emerald-400">
                          PREPARED STATEMENT (COMPILED ONCE):
                          <br />
                          <span className="text-white">SELECT * FROM users WHERE username = ? AND password = ?</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          PARAMETER VALUE BOUND STRICTLY AS LITERAL TEXT:
                          <br />
                          <span className="text-cyan-300">param1 = &quot;{sqliInput}&quot;</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-[11px]">
                          🛡️ RESULT: Query AST is pre-compiled. Database treats quotes and dashes strictly as characters inside a single string, completely preventing syntax injection!
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-rose-400">
                          VULNERABLE CONCATENATED QUERY:
                          <br />
                          <span className="text-white">
                            SELECT * FROM users WHERE username = &apos;<span className="text-amber-400 font-bold">{sqliInput}</span>&apos; AND password = &apos;...&apos;
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px]">
                          PARSED LOGIC EFFECT:
                          <br />
                          {sqliInput.includes("' OR '1'='1'") ? (
                            <span className="text-rose-400 font-bold">
                              Condition `WHERE 1=1` evaluates to TRUE for all rows! First user in DB returned (Auth Bypass).
                            </span>
                          ) : (
                            <span className="text-slate-300">Standard string comparison.</span>
                          )}
                        </div>
                        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px]">
                          ⚠️ VULNERABILITY: User input broke outside quotes and became executable SQL commands.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. XSS & Output Encoding Visualizer */}
            {simActiveTab === 'xss' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Cross-Site Scripting (XSS) &amp; Context-Aware Encoding</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Observe how browser DOM parsers execute unescaped user inputs vs how HTML entity encoding neutralizes tag rendering.
                    </p>
                  </div>
                  <button
                    onClick={() => setXssDefenseMode((prev) => !prev)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      xssDefenseMode
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : 'bg-rose-950 text-rose-300 border-rose-500'
                    }`}
                  >
                    {xssDefenseMode ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{xssDefenseMode ? 'Defense Active (Output Encoding)' : 'Vulnerable (Direct innerHTML)'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input Box */}
                  <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-4">
                    <label className="text-xs font-bold uppercase text-slate-400 block">User Comment / Profile Input</label>
                    <textarea
                      rows={3}
                      value={xssInput}
                      onChange={(e) => setXssInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[11px] text-slate-400">
                      Standard defense: Convert special characters into safe HTML entities:
                      <br />
                      <code className="text-cyan-400">&lt; &rarr; &amp;lt;</code>, <code className="text-cyan-400">&gt; &rarr; &amp;gt;</code>, <code className="text-cyan-400">&quot; &rarr; &amp;quot;</code>
                    </div>
                  </div>

                  {/* Browser DOM Render Sandbox */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Rendered Browser Output</div>
                    {xssDefenseMode ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800 text-slate-200 font-mono text-[11px] break-all">
                          {xssInput}
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 text-[11px]">
                          🛡️ RESULT: Browser receives encoded HTML entities. The string is rendered visually as plain text on screen, and no JavaScript parser execution occurs.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800 text-rose-300 font-mono text-[11px]">
                          [VULNERABLE BROWSER SINK: element.innerHTML = user_input]
                          <br />
                          ⚠️ Browser HTML Parser discovers tag `<span className="text-amber-400 font-bold">&lt;script&gt;</span>` and triggers execution engine in victim&apos;s session!
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 text-[11px]">
                          Defense Checklist: 1) Use `textContent` instead of `innerHTML`. 2) Implement Content Security Policy (`script-src &apos;self&apos;`). 3) Set `HttpOnly` on session cookies.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Phishing Email Analyzer */}
            {simActiveTab === 'phish' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Phishing Email Red Flag Detector</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Click the 4 suspicious hotspots in this realistic phishing email to identify deceptive psychological triggers!
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs sm:text-sm">
                  {/* Email Header */}
                  <div className="pb-3 border-b border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">From:</span>
                      <button
                        onClick={() => {
                          if (!phishFoundHotspots.includes('from')) {
                            setPhishFoundHotspots((prev) => [...prev, 'from']);
                            addXp(15, 'Found spoofed email sender');
                          }
                        }}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                          phishFoundHotspots.includes('from')
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        &quot;PayPal Security Team&quot; &lt;support@paypal-security-alert.xyz&gt;
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">Subject:</span>
                      <button
                        onClick={() => {
                          if (!phishFoundHotspots.includes('subject')) {
                            setPhishFoundHotspots((prev) => [...prev, 'subject']);
                            addXp(15, 'Found urgent tone trigger');
                          }
                        }}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                          phishFoundHotspots.includes('subject')
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        🚨 URGENT: Your account has been suspended! Verify within 2 hours or permanent deletion!
                      </button>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="space-y-3 text-slate-300 leading-relaxed">
                    <p>
                      <button
                        onClick={() => {
                          if (!phishFoundHotspots.includes('greeting')) {
                            setPhishFoundHotspots((prev) => [...prev, 'greeting']);
                            addXp(15, 'Found generic greeting');
                          }
                        }}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          phishFoundHotspots.includes('greeting')
                            ? 'bg-rose-950 text-rose-300 border border-rose-700'
                            : 'hover:bg-slate-800'
                        }`}
                      >
                        Dear Valued Customer,
                      </button>
                    </p>
                    <p>
                      We detected unauthorized login attempts from Moscow, Russia. To protect your funds, click the link below immediately and enter your primary password and debit card details.
                    </p>
                    <p>
                      <button
                        onClick={() => {
                          if (!phishFoundHotspots.includes('link')) {
                            setPhishFoundHotspots((prev) => [...prev, 'link']);
                            addXp(20, 'Found deceptive URL hotspot');
                          }
                        }}
                        className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
                          phishFoundHotspots.includes('link')
                            ? 'bg-rose-900 text-white border border-rose-500'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                        }`}
                      >
                        Verify Identity &amp; Unlock Account &rarr;
                      </button>
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      Actual Hyperlink Destination: `http://192.168.1.100:8080/login.php` (Notice HTTP without SSL, raw IP, and deceptive anchor text!)
                    </p>
                  </div>
                </div>

                {/* Hotspots Discovered Tracker */}
                <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">Red Flags Identified: </span>
                    <span className="font-mono text-cyan-400">{phishFoundHotspots.length} / 4 Discovered</span>
                  </div>
                  {phishFoundHotspots.length === 4 && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[11px]">
                      🎉 All 4 Red Flags Solved! +65 XP
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 4. Password Attack Math & GPU Speed Calculator */}
            {simActiveTab === 'pw-math' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Password Entropy &amp; GPU Crack-Time Mathematics</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Calculate pure mathematical brute-force limits based on combinatorics ($N^L$) and modern GPU cluster hash rates.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Controls */}
                  <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-5">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-slate-300">Password Length (Characters):</span>
                        <span className="text-cyan-400 font-mono text-sm">{pwLength} chars</span>
                      </div>
                      <input
                        type="range"
                        min="6"
                        max="24"
                        value={pwLength}
                        onChange={(e) => setPwLength(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-slate-300">Character Set Variety:</span>
                        <span className="text-cyan-400 font-mono text-sm">{pwCharsetSize} pool</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => setPwCharsetSize(10)}
                          className={`p-2 rounded-xl border text-left cursor-pointer ${
                            pwCharsetSize === 10 ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          Numbers Only (0-9): 10
                        </button>
                        <button
                          onClick={() => setPwCharsetSize(26)}
                          className={`p-2 rounded-xl border text-left cursor-pointer ${
                            pwCharsetSize === 26 ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          Lowercase (a-z): 26
                        </button>
                        <button
                          onClick={() => setPwCharsetSize(62)}
                          className={`p-2 rounded-xl border text-left cursor-pointer ${
                            pwCharsetSize === 62 ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          Alphanumeric: 62
                        </button>
                        <button
                          onClick={() => setPwCharsetSize(94)}
                          className={`p-2 rounded-xl border text-left cursor-pointer ${
                            pwCharsetSize === 94 ? 'bg-cyan-950 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          All ASCII Symbols: 94
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Math Calculations Display */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs font-mono">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-slate-400">Information Entropy:</span>
                      <span className="text-lg font-black text-cyan-400">{pwMathResults.entropyBits} Bits</span>
                    </div>

                    <div className="space-y-2 text-slate-300">
                      <div>Total Search Space: <span className="text-white">{pwMathResults.combinations} combinations</span></div>
                      <div>Fast Hash (MD5 @ 100 GH/s): <span className="text-amber-400">{pwMathResults.timeMd5}</span></div>
                      <div>SHA-256 (@ 30 GH/s): <span className="text-blue-400">{pwMathResults.timeSha256}</span></div>
                      <div>KDF bcrypt (Cost 12 @ 50 KH/s): <span className="text-emerald-400 font-bold">{pwMathResults.timeBcrypt}</span></div>
                      <div>Argon2id (Memory-Hard @ 5 KH/s): <span className="text-emerald-300 font-bold">{pwMathResults.timeArgon2}</span></div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-sans text-slate-400">
                      💡 <strong>Defensive Insight:</strong> Fast cryptographic hashes (MD5, SHA-256) are meant for file checksums, NOT passwords. Using slow, memory-hard algorithms (Argon2id, bcrypt) forces attackers to spend thousands of times more electricity per guess!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CSRF, WiFi & MITM Placeholders */}
            {(simActiveTab === 'csrf' || simActiveTab === 'wifi' || simActiveTab === 'mitm') && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <Shield className="w-10 h-10 text-cyan-400 mx-auto" />
                <h3 className="text-lg font-bold text-white capitalize">{simActiveTab.toUpperCase()} Protocol Deep Dive</h3>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  {simActiveTab === 'csrf' && 'Anti-CSRF Synchronizer Tokens and SameSite=Strict cookies completely neutralize cross-site forged POST submissions by demanding cryptographically unique secrets per session.'}
                  {simActiveTab === 'wifi' && 'WEP used an obsolete 24-bit IV with RC4 allowing key reconstruction in 5 minutes. WPA2 introduced CCMP/AES but still allowed offline dictionary attack on 4-way handshakes. WPA3 solves this using SAE (Simultaneous Authentication of Equals) with forward secrecy!'}
                  {simActiveTab === 'mitm' && 'Man-in-the-Middle attacks (ARP Poisoning, Rogue Access Points) rely on plaintext traffic. TLS 1.3 with Certificate Authority validation ensures the public key is strictly bound to the genuine domain owner.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODULE 3: 🛠️ HOME LAB SETUP GUIDE (PRACTICAL & LEGAL)
            ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'homelab' && (
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Server className="w-3.5 h-3.5" />
                  <span>100% Legal &amp; Safe Local Practice</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Module 3: Home Lab Setup Playbook
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Apne personal laptop pe isolated legal lab kaise banayein taaki aap bina kisi real system ko harm kiye practice kar sakein.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Left Selector */}
              <div className="space-y-2">
                {[
                  { id: 'vbox', label: 'VirtualBox / VMware', desc: 'Type-2 Hypervisor' },
                  { id: 'kali', label: 'Kali Linux Install', desc: 'ISO to First Boot' },
                  { id: 'thm', label: 'TryHackMe Setup', desc: 'OpenVPN & Rooms' },
                  { id: 'htb', label: 'HackTheBox Guide', desc: 'Starting Point VIP' },
                  { id: 'pico', label: 'PicoCTF for Beginners', desc: 'High School & College' },
                  { id: 'docker', label: 'Juice Shop & DVWA', desc: 'Docker Vulnerable Apps' },
                  { id: 'network', label: 'Isolated Network Adapters', desc: 'Host-Only vs NAT' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHomeLabActiveSection(item.id as any)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      homeLabActiveSection === item.id
                        ? 'bg-purple-950/80 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Right Content */}
              <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
                {homeLabActiveSection === 'vbox' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">VirtualBox Hypervisor Installation</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Oracle VirtualBox ek free, open-source Type-2 hypervisor hai jo aapke Windows, Mac ya Linux OS ke upar isolated virtual machines run karta hai.
                    </p>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                      <div className="font-bold text-cyan-400">Prerequisites &amp; Specs:</div>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Minimum 8 GB RAM (16 GB strongly recommended for smooth 2 VMs simultaneously)</li>
                        <li>50 GB free SSD disk space</li>
                        <li>BIOS / UEFI me &quot;Intel VT-x&quot; ya &quot;AMD-V&quot; virtualization enable hona zaroori hai</li>
                      </ul>
                      <div className="mt-2 pt-2 border-t border-slate-800 font-mono text-cyan-300 text-[11px]">
                        Official Download: https://www.virtualbox.org/wiki/Downloads
                      </div>
                    </div>
                  </div>
                )}

                {homeLabActiveSection === 'docker' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Running OWASP Juice Shop in Docker</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      OWASP Juice Shop is the most modern and sophisticated intentionally insecure web application. Docker ke zariye ye 1 command me aapke laptop pe isolated run hota hai.
                    </p>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                      <div className="text-slate-400"># 1. Pull and run OWASP Juice Shop container</div>
                      <div className="text-emerald-400 p-2 rounded-xl bg-slate-900 border border-slate-800">
                        docker run -d -p 3000:3000 bkimminich/juice-shop
                      </div>
                      <div className="text-slate-400"># 2. Open in browser: `http://localhost:3000`</div>
                      <p className="font-sans text-slate-300 text-xs">
                        Juice Shop me 100+ challenges hain covering all OWASP Top 10 vulnerabilities (SQLi, XSS, BOLA, JWT tampering).
                      </p>
                    </div>
                  </div>
                )}

                {homeLabActiveSection === 'network' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Host-Only vs NAT Network Adapter Architecture</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="font-bold text-cyan-400">NAT (Network Address Translation):</span>
                        <p className="text-slate-300 leading-relaxed">
                          VM internet access kar sakti hai (software updates ke liye), lekin aapke ghar ke doosre computers VM ko access nahi kar sakte.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="font-bold text-emerald-400">Host-Only Adapter:</span>
                        <p className="text-slate-300 leading-relaxed">
                          A completely isolated virtual switch between your laptop (Host) and VM. <strong>Zero packet leaks</strong> to public Wi-Fi. Perfect for malware analysis and vulnerable target VMs!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(homeLabActiveSection === 'kali' || homeLabActiveSection === 'thm' || homeLabActiveSection === 'htb' || homeLabActiveSection === 'pico') && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white capitalize">{homeLabActiveSection.toUpperCase()} Guide</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {homeLabActiveSection === 'kali' && 'Download the pre-built VirtualBox OVA appliance from kali.org to skip manual partitioning and driver configuration. Default credentials are kali / kali.'}
                      {homeLabActiveSection === 'thm' && 'TryHackMe is beginner-friendly. Download your personal OpenVPN configuration file (`sudo openvpn <username>.ovpn`) to connect directly to target machine subnets.'}
                      {homeLabActiveSection === 'htb' && 'HackTheBox Starting Point tier gives structured introductory boxes (Meow, Fawn, Dancing) teaching Telnet, FTP anonymous logins, and SMB enumeration.'}
                      {homeLabActiveSection === 'pico' && 'PicoCTF is free year-round CTF designed by Carnegie Mellon University. Excellent for high-school and undergraduate computer science students.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODULE 4: 📖 DEEP CONCEPTS (99% KO NAHI PATA)
            ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'deepdive' && (
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Beyond Superficial Tutorials</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Module 4: Deep Cybersecurity Concepts
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Wo deep architectural principles jo top security engineers ko average practitioners se alag karte hain.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Concept Selector */}
              <div className="space-y-2">
                {DEEP_CONCEPTS.map((concept) => (
                  <button
                    key={concept.id}
                    onClick={() => setSelectedConceptId(concept.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedConceptId === concept.id
                        ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] text-cyan-400 font-bold uppercase">{concept.category}</div>
                    <div className="text-xs font-bold line-clamp-1">{concept.title}</div>
                  </button>
                ))}
              </div>

              {/* Concept Workspace */}
              <div className="md:col-span-3">
                {(() => {
                  const concept = DEEP_CONCEPTS.find((c) => c.id === selectedConceptId) || DEEP_CONCEPTS[0];
                  return (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{concept.category}</span>
                          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{concept.title}</h3>
                          <p className="text-xs text-slate-400 italic mt-1">{concept.tagline}</p>
                        </div>
                        <button
                          onClick={() => toggleBookmark(concept.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {bookmarks.includes(concept.id) ? (
                            <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Content Toggle between ELI5 and Technical */}
                      <div className="space-y-4">
                        {isEli5Mode ? (
                          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/40 text-amber-200 text-xs sm:text-sm leading-relaxed">
                            <span className="font-bold flex items-center gap-1.5 text-amber-400 mb-1">
                              <Sparkles className="w-3.5 h-3.5" /> Explain Like I&apos;m 5 (ELI5):
                            </span>
                            {concept.eli5}
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed">
                            <span className="font-bold text-cyan-400 block mb-1">In-Depth Technical Breakdown:</span>
                            {concept.technicalDetails}
                          </div>
                        )}

                        {/* Real-World Industry Example */}
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                          <strong className="text-cyan-400">Industry Example: </strong>
                          {concept.realWorldExample}
                        </div>

                        {/* Key Takeaways */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-400 uppercase">Core Principles</span>
                          <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-300">
                            {concept.keyTakeaways.map((tk, idx) => (
                              <li key={idx}>{tk}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Defensive Engineering Checklist */}
                        <div className="pt-4 border-t border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" /> Defender&apos;s Engineering Checklist
                          </span>
                          <ul className="space-y-1 text-xs text-slate-300 font-mono">
                            {concept.defensiveChecklist.map((ch, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{ch}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODULE 5: 🎯 DAILY PRACTICE & INTERVIEW PREP
            ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'practice' && (
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-orange-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Gamified Daily System · Duolingo Style</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Module 5: Daily Practice, XP &amp; Interview Hub
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Rozana practice karo, XP earn karo, 30-Day Bootcamp finish karo, aur 300+ Interview Q&amp;As master karo!
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'daily', label: 'Daily Challenge', icon: Flame },
                { id: 'bootcamp', label: '30-Day Bootcamp', icon: CheckCircle2 },
                { id: 'quiz', label: 'Weekly Assessment Quiz', icon: HelpCircle },
                { id: 'interview', label: '300+ Interview Q&As', icon: Award }
              ].map((sub) => {
                const Icon = sub.icon;
                const isActive = practiceSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setPracticeSubTab(sub.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/80 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Daily Challenge */}
            {practiceSubTab === 'daily' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">Today&apos;s Challenge</span>
                    <h3 className="text-xl font-bold text-white mt-1">Log Analysis &amp; Base64 Decode</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-mono text-xs font-bold">
                    +50 XP Reward
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                  <div className="text-slate-500"># Suspicious Log Entry Intercepted:</div>
                  <div className="text-cyan-300">
                    GET /api/v1/auth?payload=ZmxhZ3tkZWZlbnNpdmVfbWFzdGVyeX0= HTTP/1.1
                  </div>
                  <div className="text-slate-400 text-[11px] pt-1">
                    Task: What is the decoded flag inside `payload` query parameter? (Format: flag&#123;...&#125;)
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter decoded flag..."
                    value={dailyAnswer}
                    onChange={(e) => setDailyAnswer(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    onClick={() => {
                      setDailySubmitted(true);
                      if (dailyAnswer.trim() === 'flag{defensive_mastery}') {
                        setDailySuccess(true);
                        addXp(50, 'Daily Challenge Solved');
                      } else {
                        setDailySuccess(false);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Submit Flag
                  </button>
                </div>

                {dailySubmitted && (
                  <div className={`p-4 rounded-2xl text-xs ${
                    dailySuccess
                      ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/50 border border-rose-800 text-rose-300'
                  }`}>
                    {dailySuccess ? (
                      <div>
                        🎉 <strong>Correct!</strong> `ZmxhZ3tkZWZlbnNpdmVfbWFzdGVyeX0=` decodes from Base64 to `flag&#123;defensive_mastery&#125;`. You earned 50 XP!
                      </div>
                    ) : (
                      <div>
                        ❌ Incorrect flag. Hint: Standard Base64 decoding ends with `=` padding. Try converting it using our Encoding tool or atob()!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 30-Day Bootcamp */}
            {practiceSubTab === 'bootcamp' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">30-Day Cybersecurity Bootcamp</h3>
                    <p className="text-xs text-slate-400 mt-1">Structured 30-minute daily learning plan from zero to certified baseline.</p>
                  </div>
                  <div className="text-xs font-bold text-cyan-400 font-mono">
                    {completedDays.length} / {BOOTCAMP_30_DAYS.length} Days Completed
                  </div>
                </div>

                <div className="space-y-3">
                  {BOOTCAMP_30_DAYS.map((day) => {
                    const isDone = completedDays.includes(day.day);
                    return (
                      <div
                        key={day.day}
                        className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-800/60'
                            : 'bg-slate-850 border-slate-800'
                        }`}
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-800 text-cyan-300">
                              Day {day.day}
                            </span>
                            <span className="text-[10px] text-slate-400">{day.phase} · {day.duration}</span>
                          </div>
                          <div className="font-bold text-white text-sm">{day.title}</div>
                          <div className="text-slate-300">{day.topics.join(' · ')}</div>
                          <div className="text-[11px] text-amber-300 font-mono pt-1">
                            🎯 Task: {day.practicalTask}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleBootcampDay(day.day)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                            isDone
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isDone ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Weekly Assessment Quiz */}
            {practiceSubTab === 'quiz' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Weekly Security Assessment Test</h3>
                    <p className="text-xs text-slate-400 mt-1">Multi-domain randomized quiz to identify technical blind spots.</p>
                  </div>
                  {quizSubmitted && (
                    <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 font-bold text-xs border border-cyan-800">
                      Score: {quizScore} / {QUIZ_QUESTIONS.length}
                    </span>
                  )}
                </div>

                <div className="space-y-6">
                  {QUIZ_QUESTIONS.map((q, qIdx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-400 uppercase text-[10px]">{q.category}</span>
                        <span className="text-slate-500 font-mono">Q{qIdx + 1}</span>
                      </div>
                      <div className="font-bold text-white text-sm">{q.question}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';
                          if (isSelected) {
                            btnStyle = 'bg-cyan-950 border-cyan-500 text-white font-bold';
                          }
                          if (quizSubmitted) {
                            if (oIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isSelected && oIdx !== q.correctIndex) {
                              btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                            }
                          }
                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizSubmitted && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-slate-400 text-[11px]">
                          <strong>Explanation: </strong>{q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      addXp(quizScore * 10, 'Completed Quiz');
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg cursor-pointer"
                  >
                    Submit Quiz &amp; Calculate Weakness Analysis
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm cursor-pointer"
                  >
                    Reset &amp; Retake Quiz
                  </button>
                )}
              </div>
            )}

            {/* 300+ Interview Q&A Repository */}
            {practiceSubTab === 'interview' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">Cybersecurity Job Interview Repository</h3>
                    <p className="text-xs text-slate-400 mt-1">High-yield technical questions asked in SOC, Pentesting, and AppSec rounds.</p>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto text-xs">
                    {['all', 'SOC Analyst', 'Pentester', 'AppSec', 'Cloud Security'].map((dom) => (
                      <button
                        key={dom}
                        onClick={() => setInterviewDomainFilter(dom)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                          interviewDomainFilter === dom
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {dom}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {INTERVIEW_QA_BANK.filter((qa) => interviewDomainFilter === 'all' || qa.domain === interviewDomainFilter).map((qa) => {
                    const isExpanded = expandedInterviewId === qa.id;
                    return (
                      <div
                        key={qa.id}
                        className="rounded-2xl bg-slate-850 border border-slate-800 p-5 space-y-3 text-xs"
                      >
                        <div
                          onClick={() => setExpandedInterviewId(isExpanded ? null : qa.id)}
                          className="flex items-start justify-between gap-4 cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                                {qa.domain}
                              </span>
                              <span className="text-slate-500 font-mono text-[10px]">{qa.difficulty}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{qa.question}</h4>
                          </div>
                          <button className="text-slate-400 hover:text-white mt-1">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-800 space-y-3 leading-relaxed">
                            {isEli5Mode ? (
                              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 text-amber-200">
                                <strong>ELI5 Simple Version: </strong>{qa.eli5Answer}
                              </div>
                            ) : (
                              <p className="text-slate-200">{qa.answer}</p>
                            )}

                            <div>
                              <strong className="text-cyan-400 block mb-1">Interviewer Evaluation Points:</strong>
                              <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                                {qa.keyPoints.map((kp, idx) => (
                                  <li key={idx}>{kp}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="text-slate-400 italic text-[11px]">
                              💡 Follow-up probe: {qa.sampleFollowUp}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODULE 6: 💼 CAREER, ROADMAP & INDIAN CYBER LAW
            ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'career' && (
          <div className="space-y-8">
            <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Award className="w-3.5 h-3.5" />
                  <span>Real World &amp; Legal Framework</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Module 6: Career Roadmap &amp; Cyber Laws
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Certifications comparison, bug bounty starter template, job profiles, and Indian IT Act 2000 legal framework for ethical security analysts.
                </p>
              </div>
            </div>

            {/* Certifications Comparison Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-white">Cybersecurity Certification Roadmap &amp; Cost Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {CERT_ROADMAP.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3 text-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {cert.tier}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">{cert.costInr} ({cert.costUsd})</span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug">{cert.name}</h4>
                      <p className="text-slate-400 font-medium">{cert.organization}</p>
                      <p className="text-slate-300"><strong className="text-slate-400">Target Role: </strong>{cert.idealRole}</p>
                      <p className="text-slate-300"><strong className="text-slate-400">Study Time: </strong>{cert.studyTime}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <strong className="text-slate-400 block mb-1 text-[11px]">Syllabus Highlights:</strong>
                      <ul className="space-y-0.5 text-slate-300 list-disc list-inside text-[11px]">
                        {cert.syllabusHighlights.slice(0, 3).map((s, idx) => (
                          <li key={idx} className="truncate">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indian Cyber Laws & IT Act 2000 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Indian Cyber Law &amp; IT Act 2000 Guide</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ethical hackers aur students ke liye legal protections aur bailable/non-bailable provisions.
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  <span>National Helpline: 1930</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {INDIAN_CYBER_LAWS.map((law, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-cyan-400 font-mono">{law.section}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{law.act}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{law.title}</h4>
                    <p className="text-slate-300 leading-relaxed">{law.description}</p>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-[11px]">
                      <strong>Penalty: </strong>{law.penalty}
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 text-[11px]">
                      <strong>Ethical Advice: </strong>{law.ethicalHackerAdvice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            NOTES & BOOKMARKS
            ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-white">Personal Learning Scratchpad</h3>
              <p className="text-xs text-slate-400">
                Write notes, cheat codes, and reminders. Automatically saved in your browser&apos;s localStorage for offline access.
              </p>
              <textarea
                rows={10}
                value={personalNotes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
                placeholder="Write your cybersecurity notes here..."
              />
              <div className="text-[11px] text-slate-500 font-mono">
                Saved locally · Zero external telemetry · 100% private
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
