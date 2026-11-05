import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  Award,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  ArrowLeft,
  X,
  FileText
} from 'lucide-react';
import { useGamificationStore, EarnedCertificate } from '../../store/useGamificationStore';

export interface ExamQuestion {
  id: string;
  topic: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FinalBossExamProps {
  examId: string;
  hubTitle?: string;
  examTitle?: string;
  questionBank?: ExamQuestion[];
  questions?: ExamQuestion[];
  isOpen?: boolean;
  onClose: () => void;
  onViewCertificate?: (cert: EarnedCertificate) => void;
  onPassed?: (cert: EarnedCertificate) => void;
  category?: string;
  passingScore?: number;
  durationMinutes?: number;
  xpReward?: number;
  badgeReward?: string;
}

export const FinalBossExamEngine: React.FC<FinalBossExamProps> = ({
  examId,
  hubTitle,
  examTitle,
  questionBank,
  questions,
  isOpen = true,
  onClose,
  onViewCertificate,
  onPassed,
  category,
  passingScore,
  durationMinutes,
  xpReward,
  badgeReward
}) => {
  const effectiveQuestions = questionBank || questions || [];
  const displayTitle = hubTitle || examTitle || 'Final Boss Examination';
  const { recordExamResult } = useGamificationStore();

  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60); // 15 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    percentage: number;
    weakTopics: string[];
    certificate?: EarnedCertificate;
  } | null>(null);

  // Initialize and randomize 20 questions
  useEffect(() => {
    if (isOpen) {
      const shuffled = [...effectiveQuestions].sort(() => Math.random() - 0.5).slice(0, 20);
      setActiveQuestions(shuffled);
      setCurrentIndex(0);
      setUserAnswers({});
      setFlaggedQuestions({});
      setTimeLeftSeconds(15 * 60);
      setIsSubmitted(false);
      setScoreResult(null);
    }
  }, [isOpen, examId, effectiveQuestions]);

  // 15-minute Countdown Timer
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, activeQuestions, userAnswers]);

  if (!isOpen) return null;

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  const toggleFlag = (qIndex: number) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };

  const handleSubmitExam = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);

    let score = 0;
    const weakTopicsMap: Record<string, number> = {};

    activeQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === q.correctIndex) {
        score++;
      } else {
        weakTopicsMap[q.topic] = (weakTopicsMap[q.topic] || 0) + 1;
      }
    });

    const total = activeQuestions.length || 20;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70; // 70% threshold

    const weakTopics = Object.entries(weakTopicsMap)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic);

    // Save exam attempt in store & award certificate if passed
    const recordResult = recordExamResult({
      examId,
      hubTitle: displayTitle,
      score,
      totalQuestions: total,
      passed,
      timeSpentSeconds: 15 * 60 - timeLeftSeconds,
      weakTopics
    });

    setScoreResult({
      score,
      total,
      passed,
      percentage,
      weakTopics,
      certificate: recordResult.certificate
    });

    if (passed && recordResult.certificate) {
      onPassed?.(recordResult.certificate);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimerWarning = timeLeftSeconds <= 300; // < 5 mins
  const isTimerCritical = timeLeftSeconds <= 120; // < 2 mins

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-mono text-slate-100"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B1120] border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Top Header with Timer */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0D182E] to-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                Final Boss Examination
              </span>
              <span className="text-xs text-slate-400 font-bold">{hubTitle}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              20-Question Comprehensive Master Assessment
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer Pill */}
            {!isSubmitted && (
              <div
                className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                  isTimerCritical
                    ? 'bg-rose-500/30 border-rose-500 text-rose-300 animate-pulse'
                    : isTimerWarning
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-black/60 border-slate-700 text-cyan-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* MAIN BODY: EXAM QUESTIONS OR SUBMITTED RESULTS */}
        {/* =================================================================== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isSubmitted && currentQ ? (
            <div className="space-y-6">
              {/* Question Navigation Track (1 to 20) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {activeQuestions.map((_, qIdx) => {
                  const isAnswered = userAnswers[qIdx] !== undefined;
                  const isFlagged = flaggedQuestions[qIdx];
                  const isCurrent = qIdx === currentIndex;

                  return (
                    <button
                      key={qIdx}
                      onClick={() => setCurrentIndex(qIdx)}
                      className={`w-8 h-8 rounded-xl font-bold text-xs shrink-0 flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-cyan-500 text-black ring-2 ring-cyan-400 scale-105'
                          : isFlagged
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500'
                          : isAnswered
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Card */}
              <div className="bg-black/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">Question {currentIndex + 1} of 20</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Topic: {currentQ.topic}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentQ.difficulty === 'Expert'
                          ? 'bg-purple-500/20 text-purple-300'
                          : currentQ.difficulty === 'Hard'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {currentQ.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFlag(currentIndex)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                      flaggedQuestions[currentIndex]
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flaggedQuestions[currentIndex] ? 'Flagged for Review' : 'Flag'}</span>
                  </button>
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white font-sans leading-relaxed">
                  {currentQ.question}
                </h4>

                {/* 4 Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[currentIndex] === oIdx;

                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400 text-white font-semibold'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                            isSelected
                              ? 'bg-cyan-500 text-black border-cyan-400'
                              : 'bg-black/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="text-xs sm:text-sm font-sans flex-1">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentIndex < activeQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center gap-1.5"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Submit Final Boss Exam</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : scoreResult ? (
            /* =================================================================== */
            /* RESULTS DOSSIER (PASSED / FAILED) */
            /* =================================================================== */
            <div className="space-y-6 animate-fade-in">
              <div
                className={`p-6 rounded-3xl border text-center space-y-3 ${
                  scoreResult.passed
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-2xl bg-black/50 border border-slate-800">
                  {scoreResult.passed ? '🏆' : '⚠️'}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white font-sans">
                    {scoreResult.passed
                      ? 'Congratulations! Boss Defeated!'
                      : 'Threshold Not Met (Needs 70%)'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto font-sans">
                    {scoreResult.passed
                      ? 'You successfully mastered the comprehensive syllabus, earned +600 XP, and unlocked your verified certificate.'
                      : 'Keep going! Review your weak topics below and re-challenge the Boss Exam anytime.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6 pt-2 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400">Total Score</span>
                    <div className="text-2xl font-bold text-white">
                      {scoreResult.score} / {scoreResult.total}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-400">Percentage</span>
                    <div className="text-2xl font-bold text-cyan-300">
                      {scoreResult.percentage}%
                    </div>
                  </div>
                  <div className="w-px h-10 bg-slate-800" />
                  <div>
                    <span className="text-[10px] text-slate-400">Passing Grade</span>
                    <div className="text-2xl font-bold text-emerald-400">70%</div>
                  </div>
                </div>

                {scoreResult.passed && scoreResult.certificate && (
                  <div className="pt-3">
                    <button
                      onClick={() => onViewCertificate?.(scoreResult.certificate!)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-950 inline-flex items-center gap-2 hover:brightness-110"
                    >
                      <Award className="w-4 h-4" />
                      <span>View &amp; Download Verified Certificate</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Weak Topics Analysis */}
              {scoreResult.weakTopics.length > 0 && (
                <div className="bg-black/50 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Identified Diagnostic Weak Areas:
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">
                    Focus your revision on these topics to achieve 100% mastery:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {scoreResult.weakTopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-800/80 text-xs font-semibold"
                      >
                        • {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                  Full Question Review &amp; Explanations:
                </h4>

                <div className="space-y-3">
                  {activeQuestions.map((q, qIdx) => {
                    const chosen = userAnswers[qIdx];
                    const isCorrect = chosen === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border space-y-2 ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-rose-950/20 border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">
                            Question {qIdx + 1}: {q.topic}
                          </span>
                          <span
                            className={`font-bold ${
                              isCorrect ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-sans">{q.question}</p>

                        <div className="text-[11px] text-slate-400 space-y-1 pt-1 font-sans">
                          <div>
                            Your Answer:{' '}
                            <strong className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                              {chosen !== undefined ? q.options[chosen] : 'Unanswered'}
                            </strong>
                          </div>
                          {!isCorrect && (
                            <div className="text-emerald-400">
                              Correct Answer: <strong>{q.options[q.correctIndex]}</strong>
                            </div>
                          )}
                          <div className="text-slate-400 italic pt-0.5">
                            💡 Explanation: {q.explanation}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
