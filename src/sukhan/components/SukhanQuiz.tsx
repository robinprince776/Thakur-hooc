import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  Flame,
  Palette,
  BookOpen,
  Share2
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types';

interface SukhanQuizProps {
  onOpenCardDesigner?: (text: string, attribution: string) => void;
}

export const SukhanQuiz: React.FC<SukhanQuizProps> = ({ onOpenCardDesigner }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 10 + streak * 2);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > highestStreak) setHighestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 py-6 select-none animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#15151C] via-[#0B0B0F] to-[#24131b] border border-[#C6A66B]/30 shadow-2xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0B0F] border border-[#C6A66B]/40 text-xs font-semibold text-[#C6A66B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pehchano Kaun?</span>
              <span className="w-1 h-1 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] text-zinc-400">Adabi Parakh & Quiz</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#FFF5EA] tracking-wide">
              Shayar Aur Ash'aar <span className="italic text-[#C6A66B]">Quiz</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Kya aap sheron ko unke ustaadon ke naam se pehchaan sakte hain? Apni adabi yaadasht aur shayeri ke shauq ko aazmayein.
            </p>
          </div>

          {/* Score & Streak Counters */}
          <div className="flex items-center gap-3 bg-[#0B0B0F]/90 border border-[#C6A66B]/25 rounded-2xl p-3 sm:p-4">
            <div className="text-center px-2">
              <span className="block text-xl sm:text-2xl font-serif font-bold text-[#C6A66B]">
                {score}
              </span>
              <span className="text-[10px] text-zinc-400">XP Points</span>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center px-2">
              <span className="flex items-center justify-center gap-1 text-xl sm:text-2xl font-serif font-bold text-amber-400">
                <Flame className="w-4 h-4 fill-current" />
                <span>{streak}</span>
              </span>
              <span className="text-[10px] text-zinc-400">Streak</span>
            </div>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="rounded-3xl p-6 sm:p-8 bg-[#121218] border border-[#C6A66B]/25 shadow-xl space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold text-[#C6A66B]">
              Sawaal {currentIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#1c1625] text-zinc-300 border border-zinc-800 text-[11px]">
              {currentQuestion.type === 'identify_poet' ? '🎭 Shayar Pehchano' : '✍️ Misra Pura Karo'}
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#C6A66B] to-[#E6C280] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Couplet Card */}
          <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-[#C6A66B]/20 text-center space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#C6A66B] font-bold">
              Ghaur Se Padhein:
            </p>
            <div className="text-base sm:text-xl font-serif text-[#FFF5EA] italic leading-relaxed py-2">
              {currentQuestion.missingLineIndex === 0 ? (
                <>
                  <p className="text-zinc-500 underline decoration-dashed">
                    [ — Pehla Misra Gayab Hai — ]
                  </p>
                  <p>"{currentQuestion.sherLines[1]}"</p>
                </>
              ) : currentQuestion.missingLineIndex === 1 ? (
                <>
                  <p>"{currentQuestion.sherLines[0]}"</p>
                  <p className="text-zinc-500 underline decoration-dashed">
                    [ — Dusra Misra Gayab Hai — ]
                  </p>
                </>
              ) : (
                <>
                  <p>"{currentQuestion.sherLines[0]}"</p>
                  <p>"{currentQuestion.sherLines[1]}"</p>
                </>
              )}
            </div>
            {currentQuestion.type === 'identify_poet' && (
              <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                Yeh sher kis azeem shayar ka hai?
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQuestion.correctAnswer;

              let btnStyle = 'bg-[#181822] border-zinc-800 text-zinc-200 hover:border-[#C6A66B]/50 hover:bg-[#20202e]';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200 shadow-lg shadow-emerald-950/50';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-600 text-rose-200 shadow-lg shadow-rose-950/50';
                } else {
                  btnStyle = 'bg-[#15151C] border-zinc-800 text-zinc-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all text-left flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner after answering */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-[#C6A66B]/30 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-[#C6A66B]">
                <span>Tashreeh & Tareekhi Ma\'loomat:</span>
                <span className="text-zinc-400 font-normal">Shayar: {currentQuestion.poetName}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentQuestion.explanationHinglish}
              </p>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                {onOpenCardDesigner && (
                  <button
                    onClick={() =>
                      onOpenCardDesigner(
                        `${currentQuestion.sherLines[0]}\n${currentQuestion.sherLines[1]}`,
                        currentQuestion.poetName
                      )
                    }
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Design Card</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#8C6F38] text-slate-950 font-bold text-xs shadow-md shadow-[#C6A66B]/20 hover:brightness-110 transition-all cursor-pointer ml-auto"
                >
                  <span>{currentIndex + 1 === QUIZ_QUESTIONS.length ? 'Natija Dekhein' : 'Agla Sawaal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Completed Screen */
        <div className="rounded-3xl p-8 bg-[#121218] border border-[#C6A66B]/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#C6A66B] to-amber-500 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-[#C6A66B]/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-[#FFF5EA]">
              Khoobsoorat! Quiz Mukammal Hua
            </h3>
            <p className="text-xs text-zinc-400">
              Aapka adabi zauq aur tareekhi ilm kabil-e-tareef hai.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto py-2">
            <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-zinc-800">
              <span className="block text-2xl font-serif text-[#C6A66B] font-bold">{score}</span>
              <span className="text-[11px] text-zinc-400">Final Score</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-zinc-800">
              <span className="block text-2xl font-serif text-amber-400 font-bold">{highestStreak}</span>
              <span className="text-[11px] text-zinc-400">Max Streak</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C6A66B] hover:bg-[#b5955a] text-slate-950 font-bold text-xs shadow-xl shadow-[#C6A66B]/20 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Dobara Khelein (Restart Quiz)</span>
          </button>
        </div>
      )}
    </div>
  );
};
