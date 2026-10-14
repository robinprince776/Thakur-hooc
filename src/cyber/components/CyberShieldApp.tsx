import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Terminal as TerminalIcon,
  FlaskConical,
  Award,
  DollarSign,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Code2,
  Lock,
  ArrowRight,
  Download,
  Share2,
  Grid,
  Menu,
  X,
  Layers
} from 'lucide-react';
import { CYBER_MODULES, BUG_BOUNTY_CHEAT_SHEET } from '../data/cyberCurriculum';
import { CyberTerminal } from './CyberTerminal';
import { InteractiveLabs } from './InteractiveLabs';
import { CyberModule, CyberQuizQuestion } from '../types';

interface CyberShieldAppProps {
  onBackToBca?: () => void;
  onOpenCalcVault?: () => void;
  onOpenSukhan?: () => void;
  onOpenCompiler?: () => void;
  onOpenJarvis?: () => void;
  onOpenAppSwitcher?: () => void;
}

export const CyberShieldApp: React.FC<CyberShieldAppProps> = ({
  onBackToBca,
  onOpenCalcVault,
  onOpenSukhan,
  onOpenCompiler,
  onOpenJarvis,
  onOpenAppSwitcher
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'terminal' | 'labs' | 'quiz' | 'bounty'>('modules');
  const [selectedModuleLevel, setSelectedModuleLevel] = useState<number>(0);
  const [learnerName, setLearnerName] = useState<string>('Prince Thakur');
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([0]);

  const activeModule = CYBER_MODULES.find((m) => m.level === selectedModuleLevel) || CYBER_MODULES[0];

  // Quiz evaluation
  const allQuizzes = CYBER_MODULES.flatMap((m) => m.quizzes);
  const totalScore = allQuizzes.reduce((acc, q) => {
    return acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const toggleLevelComplete = (lvl: number) => {
    if (completedLevels.includes(lvl)) {
      setCompletedLevels(completedLevels.filter((l) => l !== lvl));
    } else {
      setCompletedLevels([...completedLevels, lvl]);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Top Cyber Obsidian Header */}
      <header className="sticky top-0 z-40 w-full bg-[#07090E]/90 backdrop-blur-xl border-b border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/20">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-wider text-white">
                    CYBERSHIELD
                  </span>
                  <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
                    Zero to Hero
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <span>Hinglish Academy</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-emerald-400">Made by Prince Thakur</span>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* App Switcher Trigger */}
              <button
                onClick={onOpenAppSwitcher}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-emerald-500/60 text-xs font-semibold text-zinc-300 transition-all cursor-pointer shadow-sm"
                title="Switch Suite App"
              >
                <Grid className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Suite Apps</span>
              </button>

              {/* Certificate Trigger */}
              <button
                onClick={() => setShowCertModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-600/30"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hero Certificate</span>
                <span className="sm:hidden">Cert</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-t border-emerald-950/80 bg-[#090D14]/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
            {[
              { id: 'modules', label: '1. Zero to Hero Modules', icon: BookOpen },
              { id: 'terminal', label: '2. Kali Terminal Simulator', icon: TerminalIcon },
              { id: 'labs', label: '3. Hands-On Exploitation Labs', icon: FlaskConical },
              { id: 'quiz', label: '4. Exam & Certification', icon: Award },
              { id: 'bounty', label: '5. Bug Bounty Vault ($$$)', icon: DollarSign }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-sm'
                      : 'bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: ZERO TO HERO MODULES */}
        {/* ======================================================== */}
        {activeTab === 'modules' && (
          <div className="space-y-6">
            {/* Level Stepper Ribbon */}
            <div className="bg-[#0B0F17] rounded-3xl p-5 border border-emerald-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-emerald-400" />
                    <span>Cybersecurity Zero to Hero Roadmap (Hinglish)</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Step-by-step master levels. Level 0 se start karke Level 5 Cyber Guardian tak pohcho!
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/50">
                  Completed: {completedLevels.length} / {CYBER_MODULES.length} Levels
                </div>
              </div>

              {/* Level Buttons Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                {CYBER_MODULES.map((m) => {
                  const isSelected = selectedModuleLevel === m.level;
                  const isDone = completedLevels.includes(m.level);
                  return (
                    <button
                      key={m.level}
                      onClick={() => setSelectedModuleLevel(m.level)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-emerald-950 via-[#0e1724] to-[#080B10] border-emerald-400 text-white shadow-lg shadow-emerald-950/60'
                          : 'bg-[#080B10]/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                          Lvl {m.level}
                        </span>
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-xs font-bold leading-tight truncate text-white">
                        {m.title.split('—')[0]}
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-1">{m.estimatedTime}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Module Details */}
            <div className="bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div className="space-y-1 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                    {activeModule.levelBadge} · {activeModule.estimatedTime}
                  </div>
                  <h3 className="text-2xl font-black text-white">{activeModule.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {activeModule.hinglishIntro}
                  </p>
                </div>

                <button
                  onClick={() => toggleLevelComplete(activeModule.level)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0 ${
                    completedLevels.includes(activeModule.level)
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedLevels.includes(activeModule.level)
                      ? 'Level Completed ✓'
                      : 'Mark as Completed'}
                  </span>
                </button>
              </div>

              {/* Topics Breakdown */}
              <div className="space-y-6">
                {activeModule.topics.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#080B10] border border-zinc-800/90 hover:border-emerald-500/40 transition-colors space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          Topic {idx + 1} · {t.tagline}
                        </div>
                        <h4 className="text-lg font-bold text-white mt-0.5">{t.title}</h4>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-[#101622] p-3.5 rounded-xl border border-zinc-700/50">
                      💡 <strong>Hinglish Summary:</strong> {t.hinglishSummary}
                    </p>

                    {/* Detailed bullet points */}
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                        Key Concepts To Master:
                      </span>
                      <ul className="space-y-1.5 text-xs text-zinc-300">
                        {t.detailedPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">›</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Terms Lugat */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {t.keyTerms.map((kt, kIdx) => (
                        <div
                          key={kIdx}
                          className="p-2.5 rounded-xl bg-black/40 border border-zinc-800 text-xs"
                        >
                          <strong className="text-emerald-400 font-mono">{kt.term}:</strong>{' '}
                          <span className="text-zinc-300">{kt.meaning}</span>
                        </div>
                      ))}
                    </div>

                    {/* Real World Attack & How to Defend */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 space-y-1">
                        <span className="text-[11px] font-bold text-red-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Real Attack Case:
                        </span>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">
                          {t.realWorldAttackScenario}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> How To Defend (Blue Team):
                        </span>
                        <p className="text-[11px] text-zinc-300 leading-relaxed">{t.howToDefend}</p>
                      </div>
                    </div>

                    {/* Command or Code Snippet */}
                    {t.commandOrCodeSnippet && (
                      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-black/60 font-mono text-xs">
                        <div className="bg-zinc-900 px-3 py-1.5 border-b border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                          <span>{t.commandOrCodeSnippet.lang.toUpperCase()} Example Snippet</span>
                          <span className="text-emerald-400">CyberShield Lab</span>
                        </div>
                        <pre className="p-3 text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                          {t.commandOrCodeSnippet.code}
                        </pre>
                        <div className="p-2.5 bg-zinc-950 text-[11px] text-zinc-400 border-t border-zinc-800/80 font-sans">
                          {t.commandOrCodeSnippet.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: KALI TERMINAL SIMULATOR */}
        {/* ======================================================== */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="bg-[#0B0F17] p-5 rounded-3xl border border-emerald-500/30">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TerminalIcon className="w-5 h-5 text-emerald-400" />
                <span>Simulated Kali Linux Terminal</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Real ethical hacking command prompt. Try running commands like <code>nmap 192.168.1.1</code>, <code>sqlmap -u shop.com?id=1</code>, <code>hashcat -m 0</code>, <code>cat /etc/passwd</code>, and <code>whoami</code>.
              </p>
            </div>
            <CyberTerminal />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: HANDS-ON EXPLOITATION LABS */}
        {/* ======================================================== */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            <InteractiveLabs />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: EXAM & HERO CERTIFICATE */}
        {/* ======================================================== */}
        {activeTab === 'quiz' && (
          <div className="bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <span>Cybersecurity Hero Exam Checkpoint</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Answer these curriculum questions to test your knowledge and claim your verified Cyber Hero Certificate!
                </p>
              </div>

              <div className="text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-700 text-zinc-300">
                Score: {totalScore} / {allQuizzes.length}
              </div>
            </div>

            <div className="space-y-4">
              {allQuizzes.map((q, idx) => {
                const userAns = quizAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-[#080B10] border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                        Question {idx + 1} ({q.difficulty})
                      </span>
                      {quizSubmitted && (
                        <span
                          className={`text-xs font-bold ${
                            isCorrect ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-white">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = userAns === oIdx;
                        let btnStyle = 'bg-[#121A29] border-zinc-700 text-zinc-300 hover:border-zinc-500';

                        if (isChosen) {
                          btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                        }
                        if (quizSubmitted) {
                          if (oIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-red-950/80 border-red-500 text-red-300';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers({ ...quizAnswers, [q.id]: oIdx });
                              }
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-colors cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-mono text-zinc-400 mr-2">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="p-3 rounded-xl bg-[#101622] border border-zinc-700 text-xs text-zinc-300 font-sans">
                        💡 <strong>Explanation (Hinglish):</strong> {q.explanationInHinglish}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < allQuizzes.length}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-bold text-xs cursor-pointer transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Submit All Answers & Calculate Score
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 cursor-pointer"
                >
                  Retake Exam
                </button>
              )}

              <button
                onClick={() => setShowCertModal(true)}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-black font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <Award className="w-4 h-4" />
                <span>View & Generate Certificate</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BUG BOUNTY VAULT */}
        {/* ======================================================== */}
        {activeTab === 'bounty' && (
          <div className="bg-[#0B0F17] rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold mb-1">
                Monetization & Career Track
              </div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Bug Bounty Hunter Secret Vault</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Top companies (Google, Meta, Swiggy, Zomato) par legal bugs report karke bounties jeetne ka roadmap aur top dorks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BUG_BOUNTY_CHEAT_SHEET.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-[#080B10] border border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">
                      {b.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                      Bounty: {b.bountyRange}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{b.title}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{b.tipHinglish}</p>

                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre-wrap">
                    {b.dorkOrPayload}
                  </div>
                </div>
              ))}
            </div>

            {/* Legal Warning Notice */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/50 text-xs text-zinc-300 space-y-1">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Golden Rule of Ethical Hacking:
              </span>
              <p className="text-[11px] leading-relaxed">
                Hacking bina company ke written permission ke illegal hai (IT Act 2000 Section 66 ke tahat jurmana aur jail ho sakti hai). Hamesha HackerOne, Bugcrowd, ya Intigriti ke authorized program scope ke andar hi testing karein!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* CERTIFICATE MODAL */}
      {/* ======================================================== */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="relative w-full max-w-2xl bg-[#090D14] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                Official Credential Verification
              </span>
              <button
                onClick={() => setShowCertModal(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Learner Name input */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-400 font-mono">Candidate Name:</label>
              <input
                type="text"
                value={learnerName}
                onChange={(e) => setLearnerName(e.target.value)}
                className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white font-bold outline-none focus:border-emerald-400"
              />
            </div>

            {/* Certificate Canvas Box */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0C121D] via-[#080B10] to-[#040608] border-2 border-emerald-500/60 shadow-2xl text-center space-y-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 mx-auto flex items-center justify-center text-black shadow-xl shadow-emerald-500/30">
                <Shield className="w-8 h-8 text-black" />
              </div>

              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                  CYBERSHIELD ACADEMY · ZERO TO HERO
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  CERTIFICATE OF CYBER GUARDIAN
                </h2>
              </div>

              <p className="text-xs text-zinc-400">This officially certifies that</p>

              <div className="text-2xl sm:text-3xl font-serif font-black text-emerald-300 underline underline-offset-8 decoration-emerald-500/50">
                {learnerName || 'Prince Thakur'}
              </div>

              <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                has successfully mastered all 6 levels of the Zero to Hero Cybersecurity Curriculum, including OWASP Top 10, Kali Linux Reconnaissance, Cryptographic Defense, and Bug Bounty Methodology.
              </p>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-left text-[10px] text-zinc-400 font-mono">
                <div>
                  <span className="text-emerald-400 font-bold block">ACADEMY ARCHITECT</span>
                  <span>Prince Thakur</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">VERIFICATION ID</span>
                  <span>CS-2026-HERO-{(Date.now() % 100000).toString().padStart(6, '0')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-emerald-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
