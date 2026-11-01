import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Trophy,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  Check,
  ChevronRight,
  Sliders,
  HelpCircle,
  Zap,
  Target
} from 'lucide-react';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface BcaExamSimulatorProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: CurrentAppType) => void;
}

interface Question {
  id: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTION_BANK: Question[] = [
  {
    id: 1,
    subject: 'Python',
    topic: 'Data Types',
    question: 'Which of the following data structures in Python is immutable?',
    options: ['List', 'Dictionary', 'Tuple', 'Set'],
    correctIndex: 2,
    explanation: 'Tuples are immutable in Python, meaning their elements cannot be changed after creation. Lists, dicts, and sets are mutable.'
  },
  {
    id: 2,
    subject: 'Java',
    topic: 'OOP Concepts',
    question: 'Which keyword in Java is used to prevent method overriding by a subclass?',
    options: ['static', 'abstract', 'final', 'synchronized'],
    correctIndex: 2,
    explanation: 'A method declared as "final" cannot be overridden by any subclass.'
  },
  {
    id: 3,
    subject: 'DBMS',
    topic: 'Normalization',
    question: 'Which normal form eliminates partial dependency on a composite candidate key?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctIndex: 1,
    explanation: '2NF requires the table to be in 1NF and all non-prime attributes to be fully functionally dependent on the entire candidate key.'
  },
  {
    id: 4,
    subject: 'Operating Systems',
    topic: 'Process Scheduling',
    question: 'Which CPU scheduling algorithm is inherently preemptive and uses a time quantum?',
    options: ['First-Come First-Served', 'Shortest Job First', 'Round Robin', 'Priority Scheduling'],
    correctIndex: 2,
    explanation: 'Round Robin allocates a small unit of CPU time (time quantum) to each process in cyclic order with preemption.'
  },
  {
    id: 5,
    subject: 'C++',
    topic: 'Memory Management',
    question: 'What is the correct operator to deallocate dynamic memory allocated with new[] in C++?',
    options: ['free()', 'delete', 'delete[]', 'dispose()'],
    correctIndex: 2,
    explanation: 'Memory allocated using "new[]" must be released using "delete[]" to properly invoke destructors for each element.'
  },
  {
    id: 6,
    subject: 'DAA',
    topic: 'Complexity',
    question: 'What is the average time complexity of QuickSort?',
    options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    correctIndex: 1,
    explanation: 'QuickSort has an average and best case time complexity of O(n log n), while its worst case is O(n^2).'
  },
  {
    id: 7,
    subject: 'Web Technologies',
    topic: 'JavaScript',
    question: 'Which array method in JavaScript creates a new array with all elements that pass a test?',
    options: ['map()', 'filter()', 'reduce()', 'forEach()'],
    correctIndex: 1,
    explanation: 'filter() returns a new array with all elements that return true for the test function.'
  },
  {
    id: 8,
    subject: 'Artificial Intelligence',
    topic: 'Search Algorithms',
    question: 'What ensures that the A* search algorithm is both complete and optimal?',
    options: ['Heuristic is random', 'Heuristic is admissible', 'Depth limit is small', 'Queue is LIFO'],
    correctIndex: 1,
    explanation: 'A* is optimal if the heuristic function h(n) is admissible (it never overestimates the actual cost to reach the goal).'
  },
  {
    id: 9,
    subject: 'Cyber Security',
    topic: 'Cryptography',
    question: 'RSA is which type of cryptographic algorithm?',
    options: ['Symmetric Key', 'Asymmetric Key (Public/Private)', 'Stream Cipher', 'Hash Function'],
    correctIndex: 1,
    explanation: 'RSA uses a pair of keys: a public key for encryption and a private key for decryption.'
  },
  {
    id: 10,
    subject: 'Cloud Computing',
    topic: 'Service Models',
    question: 'AWS Lambda and Google Cloud Functions are examples of which cloud computing paradigm?',
    options: ['IaaS', 'PaaS', 'Serverless (FaaS)', 'Bare Metal'],
    correctIndex: 2,
    explanation: 'AWS Lambda is Function-as-a-Service (FaaS) / Serverless where code runs on demand without managing servers.'
  }
];

export const BcaExamSimulatorApp: React.FC<BcaExamSimulatorProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSelectApp
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [negativeMarking, setNegativeMarking] = useState<boolean>(true);
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes

  const filteredQuestions = useMemo(() => {
    if (selectedSubject === 'All') return QUESTION_BANK;
    return QUESTION_BANK.filter((q) => q.subject.toLowerCase() === selectedSubject.toLowerCase());
  }, [selectedSubject]);

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setExamSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examSubmitted, timeLeft]);

  const handleStartExam = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(filteredQuestions.length * 60);
    setExamSubmitted(false);
    setExamStarted(true);
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (examSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  // Score Calculation
  const resultStats = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const weakTopics: string[] = [];

    filteredQuestions.forEach((q: Question) => {
      const selected = selectedAnswers[q.id];
      if (selected === undefined) {
        unattempted++;
      } else if (selected === q.correctIndex) {
        correct++;
      } else {
        incorrect++;
        if (!weakTopics.includes(q.topic)) {
          weakTopics.push(`${q.subject}: ${q.topic}`);
        }
      }
    });

    const marksPerQ = 1;
    const penalty = negativeMarking ? 0.25 : 0;
    const totalScore = Math.max(0, correct * marksPerQ - incorrect * penalty);
    const maxScore = filteredQuestions.length * marksPerQ;
    const percentage = Number(((totalScore / maxScore) * 100).toFixed(1));

    return {
      correct,
      incorrect,
      unattempted,
      totalScore: Number(totalScore.toFixed(2)),
      maxScore,
      percentage,
      weakTopics
    };
  }, [filteredQuestions, selectedAnswers, negativeMarking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-ambient-mesh text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top Header */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">BCA Exam Simulator</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  MCQ Mock Test & Weakness Detector
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Timed questions, negative marking, instant scorecard, and personalized revision alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 spring-press cursor-pointer"
              >
                App Switcher
              </button>
            )}
            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 spring-press cursor-pointer"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {!examStarted ? (
          /* START SCREEN */
          <div className="p-6 sm:p-8 rounded-3xl glass-card border-white/10 space-y-6 text-center max-w-2xl mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-amber-500/25">
              <Target className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">BCA Semester Mock Test</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Test your knowledge across Python, Java, C++, DBMS, Operating Systems, DAA, AI, and Cloud Computing.
              </p>
            </div>

            {/* Test Configuration */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Subject Filter</span>
                  <span className="text-[11px] text-slate-400">Choose all or specific subject</span>
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Subjects (Comprehensive)</option>
                  <option value="Python">Python Programming</option>
                  <option value="Java">Java Programming</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="C++">C++</option>
                </select>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div>
                  <span className="text-xs font-bold text-white block">Negative Marking (-0.25)</span>
                  <span className="text-[11px] text-slate-400">Simulate university/GATE exam rules</span>
                </div>
                <input
                  type="checkbox"
                  checked={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs text-slate-400">
                <span>Total Questions: <strong className="text-white">{filteredQuestions.length}</strong></span>
                <span>Time Allowed: <strong className="text-amber-400">{filteredQuestions.length} Minutes</strong></span>
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl shadow-amber-500/25 spring-press cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4" />
              <span>Start Mock Exam Now</span>
            </button>
          </div>
        ) : !examSubmitted ? (
          /* ACTIVE EXAM RUNNER */
          <div className="space-y-5 animate-fade-in">
            {/* Top Status Bar with Timer */}
            <div className="p-4 rounded-2xl glass-card border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">
                  Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {filteredQuestions[currentQuestionIndex].subject}
                </span>
              </div>

              {/* Timer with Urgent Pulse */}
              <div
                className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold flex items-center gap-1.5 ${
                  timeLeft <= 60
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-urgent-pulse'
                    : 'bg-slate-900 text-amber-300 border-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Question Card */}
            {(() => {
              const currentQ = filteredQuestions[currentQuestionIndex];
              const selectedOpt = selectedAnswers[currentQ.id];

              return (
                <div className="p-6 rounded-3xl glass-card border-white/10 space-y-5">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                      Topic: {currentQ.topic}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      {currentQ.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQ.options.map((opt: string, optIdx: number) => {
                      const isChosen = selectedOpt === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                            isChosen
                              ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                              : 'bg-slate-950/50 border-white/5 text-slate-300 hover:bg-slate-900 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                                isChosen ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="text-xs sm:text-sm font-medium">{opt}</span>
                          </div>

                          {isChosen && <Check className="w-4 h-4 text-amber-400" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40 cursor-pointer spring-press"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {currentQuestionIndex < filteredQuestions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white spring-press cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setExamSubmitted(true)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white spring-press cursor-pointer shadow-lg shadow-emerald-600/30"
                        >
                          Submit Test ✓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* RESULT & WEAKNESS DETECTOR SCREEN */
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border-white/10 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/25">
                <Trophy className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">Scorecard & Performance</h2>
                <p className="text-xs text-slate-400">Comprehensive result breakdown with weakness detector</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Final Score</span>
                  <span className="text-xl font-mono font-bold text-cyan-400">
                    {resultStats.totalScore} / {resultStats.maxScore}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Correct</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">
                    {resultStats.correct}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Incorrect</span>
                  <span className="text-xl font-mono font-bold text-rose-400">
                    {resultStats.incorrect}
                  </span>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Percentage</span>
                  <span className="text-xl font-mono font-bold text-amber-400">
                    {resultStats.percentage}%
                  </span>
                </div>
              </div>

              {/* WEAKNESS DETECTOR ALERT */}
              {resultStats.weakTopics.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-left space-y-2 max-w-xl mx-auto">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    <span>AI Weakness Detector (Focus Areas for Revision):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resultStats.weakTopics.map((topic: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-rose-900/60 text-rose-200 border border-rose-700/60"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleStartExam}
                className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 spring-press cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-attempt Exam</span>
              </button>
            </div>

            {/* Answer Explanations Review */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Detailed Answer Keys & Hinglish Explanations
              </h3>

              {filteredQuestions.map((q: Question, idx: number) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;
                const isUnanswered = userAns === undefined;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl glass-card border transition-all ${
                      isCorrect
                        ? 'border-emerald-500/30 bg-emerald-950/10'
                        : isUnanswered
                        ? 'border-slate-800'
                        : 'border-rose-500/30 bg-rose-950/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs font-bold text-white">
                        {idx + 1}. {q.question}
                      </span>
                      {isCorrect ? (
                        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : isUnanswered ? (
                        <span className="text-xs font-mono text-slate-500 shrink-0">Unattempted</span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1 shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-300 space-y-1 mb-2 font-mono">
                      <div>Correct Answer: <strong className="text-emerald-400">{q.options[q.correctIndex]}</strong></div>
                      {!isCorrect && !isUnanswered && (
                        <div>Your Choice: <span className="text-rose-400">{q.options[userAns]}</span></div>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
