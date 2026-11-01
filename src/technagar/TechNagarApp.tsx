import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  List,
  Compass,
  Trophy,
  Share2,
  RotateCcw,
  Bot,
  User,
  Radio,
  Zap,
  ChevronRight,
  ShieldAlert,
  Flame,
  Award,
  FastForward
} from 'lucide-react';
import { CHAPTERS_DATA, SEASONS_DATA } from './data/chaptersData';
import { Chapter, DialogueItem, SeasonInfo } from './types';

export interface TechNagarAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSwitchApp?: (appId: string) => void;
}

export const TechNagarApp: React.FC<TechNagarAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  onSwitchApp
}) => {
  // Current active chapter (1 to 18)
  const [currentChapterId, setCurrentChapterId] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('technagar_last_chapter');
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  // Completed chapters stored in localStorage
  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('technagar_completed_chapters');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Chat interaction mode: 'progressive' (step-by-step chat) or 'all' (read all at once)
  const [revealedDialogueCount, setRevealedDialogueCount] = useState<number>(2);
  const [isAutoPlayingChat, setIsAutoPlayingChat] = useState<boolean>(false);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);

  // Audio / Speech Synthesis State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false);
  const [currentSpokenIndex, setCurrentSpokenIndex] = useState<number>(-1);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Chat container scroll ref
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const activeChapter: Chapter = useMemo(() => {
    return CHAPTERS_DATA.find((c) => c.id === currentChapterId) || CHAPTERS_DATA[0];
  }, [currentChapterId]);

  // Persist current chapter
  useEffect(() => {
    try {
      localStorage.setItem('technagar_last_chapter', String(currentChapterId));
    } catch {}
  }, [currentChapterId]);

  // Persist completed chapters
  useEffect(() => {
    try {
      localStorage.setItem('technagar_completed_chapters', JSON.stringify(completedChapters));
    } catch {}
  }, [completedChapters]);

  // Reset chat dialogue reveal count when chapter changes
  useEffect(() => {
    setRevealedDialogueCount(activeChapter.dialogues.length >= 3 ? 3 : activeChapter.dialogues.length);
    stopAudio();
  }, [currentChapterId]);

  // Auto-scroll chat to bottom when dialogue count increases
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [revealedDialogueCount]);

  // Auto-play dialogue timer
  useEffect(() => {
    let timer: any = null;
    if (isAutoPlayingChat) {
      if (revealedDialogueCount < activeChapter.dialogues.length) {
        timer = setTimeout(() => {
          setRevealedDialogueCount((prev) => prev + 1);
        }, 2200);
      } else {
        setIsAutoPlayingChat(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isAutoPlayingChat, revealedDialogueCount, activeChapter.dialogues.length]);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Web Speech API Voice Selection & Utterance
  const playSpeechForDialogue = (index: number) => {
    if (!synthRef.current) return;
    if (index >= activeChapter.dialogues.length) {
      setIsPlayingAudio(false);
      setCurrentSpokenIndex(-1);
      markChapterComplete(activeChapter.id);
      return;
    }

    const dialogue = activeChapter.dialogues[index];
    setCurrentSpokenIndex(index);
    if (index >= revealedDialogueCount) {
      setRevealedDialogueCount(index + 1);
    }

    // Cancel any previous speech
    synthRef.current.cancel();

    // Prepare text
    const speakerPrefix = dialogue.char === 'Aarav' ? 'Aarav ne pucha: ' : 'Byte ne samjhaya: ';
    const cleanText = speakerPrefix + dialogue.text.replace(/[\n\r]+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechSpeed;

    // Distinct character pitch
    if (dialogue.char === 'Aarav') {
      utterance.pitch = 1.25; // Youthful, curious tone
    } else {
      utterance.pitch = 0.95; // Friendly robotic assistant tone
    }

    // Attempt to pick Hindi / Indian English voice
    const voices = synthRef.current.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India')
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onend = () => {
      // Continue to next dialogue
      playSpeechForDialogue(index + 1);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setCurrentSpokenIndex(-1);
    };

    synthRef.current.speak(utterance);
  };

  const startAudio = () => {
    if (!synthRef.current) {
      alert('Audio narration is not supported in this browser.');
      return;
    }
    setIsPlayingAudio(true);
    setIsAudioPaused(false);
    const startIdx = currentSpokenIndex >= 0 ? currentSpokenIndex : 0;
    playSpeechForDialogue(startIdx);
  };

  const pauseAudio = () => {
    if (synthRef.current) {
      synthRef.current.pause();
      setIsAudioPaused(true);
    }
  };

  const resumeAudio = () => {
    if (synthRef.current) {
      synthRef.current.resume();
      setIsAudioPaused(false);
    }
  };

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setCurrentSpokenIndex(-1);
  };

  const markChapterComplete = (id: number) => {
    setCompletedChapters((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleNextChapter = () => {
    markChapterComplete(activeChapter.id);
    if (currentChapterId < CHAPTERS_DATA.length) {
      setCurrentChapterId((prev) => prev + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterId > 1) {
      setCurrentChapterId((prev) => prev - 1);
    }
  };

  const progressPercentage = Math.round((completedChapters.length / CHAPTERS_DATA.length) * 100);
  const isCurrentCompleted = completedChapters.includes(activeChapter.id);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans select-none relative pb-16">
      {/* Background Subtle Cyber Matrix Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px), radial-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px'
        }}
      />

      {/* Top Glass Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-cyan-500/20 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2.5">
          {/* Chapter Drawer Toggle */}
          <button
            onClick={() => setShowDrawer(true)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Open Chapters Menu"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Chapters</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-800">
              {currentChapterId}/{CHAPTERS_DATA.length}
            </span>
          </button>

          {/* App Branding */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                TechNagar Chronicles
              </span>
              <span className="hidden md:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Story Mode
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
              Aarav 👦 &amp; Byte 🤖 · Technology Ki Kahani
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio TTS Read Aloud Controller */}
          {!isPlayingAudio ? (
            <button
              onClick={startAudio}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              title="Listen to story in voice"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Listen (Sunao)</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-emerald-500/40">
              {isAudioPaused ? (
                <button
                  onClick={resumeAudio}
                  className="p-1 rounded-lg text-emerald-400 hover:text-white"
                  title="Resume voice"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={pauseAudio}
                  className="p-1 rounded-lg text-amber-400 hover:text-white"
                  title="Pause voice"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button
                onClick={stopAudio}
                className="p-1 rounded-lg text-rose-400 hover:text-white"
                title="Stop voice"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
              <div className="flex items-center gap-0.5 px-1">
                <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-pulse delay-75" />
                <span className="w-1.5 h-2 bg-blue-400 rounded-full animate-pulse delay-150" />
              </div>
            </div>
          )}

          {/* App Switcher button */}
          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="All 45 Apps"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">All Apps</span>
            </button>
          )}

          {/* Back to BCA Verse */}
          {onBackToBca && (
            <button
              onClick={onBackToBca}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Main Hub
            </button>
          )}
        </div>
      </header>

      {/* Progress Strip */}
      <div className="bg-slate-900/50 border-b border-white/5 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total Progress:</span>
          <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-cyan-400 font-bold">{progressPercentage}%</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>{completedChapters.length} of 18 Cleared</span>
          {completedChapters.length === 18 && (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" /> Master
            </span>
          )}
        </div>
      </div>

      {/* Main Chat Interface Container (Mobile-first Phone format) */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-4 py-4 flex flex-col justify-between">
        {/* Chapter Header Banner */}
        <div className="mb-4 p-4 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/40 border border-cyan-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeChapter.seasonTitle}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                Chapter {activeChapter.chapterNumber}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{activeChapter.title}</span>
              {isCurrentCompleted && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </h2>
            <p className="text-xs text-slate-400 leading-snug">{activeChapter.tagline}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
            <div className="flex items-center gap-1">
              <button
                disabled={currentChapterId <= 1}
                onClick={handlePrevChapter}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Previous Chapter"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentChapterId >= CHAPTERS_DATA.length}
                onClick={handleNextChapter}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Next Chapter"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Character Status Indicator */}
        <div className="flex items-center justify-between px-2 mb-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-bold text-blue-300">👦 Aarav (Curious Kid)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-emerald-300">🤖 Byte (AI Guide)</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Chat Bubbles Scroll Area */}
        <div className="space-y-4 mb-4 select-text">
          {activeChapter.dialogues.slice(0, revealedDialogueCount).map((dialogue, idx) => {
            const isAarav = dialogue.char === 'Aarav';
            const isSpeakingThis = currentSpokenIndex === idx && isPlayingAudio;

            return (
              <div
                key={dialogue.id}
                className={`flex items-start gap-2.5 transition-all duration-300 ${
                  isAarav ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Character Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    isAarav
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/50 text-white'
                      : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 border border-emerald-400/50 text-white'
                  }`}
                >
                  {isAarav ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] p-3.5 rounded-3xl shadow-xl transition-all ${
                    isAarav
                      ? 'bg-blue-950/60 border border-blue-500/40 text-blue-50 rounded-tl-sm'
                      : 'bg-slate-900/90 border border-emerald-500/40 text-emerald-50 rounded-tr-sm'
                  } ${
                    isSpeakingThis
                      ? 'ring-2 ring-cyan-400 shadow-cyan-500/20 scale-[1.01]'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[11px] font-bold font-mono ${
                        isAarav ? 'text-blue-300' : 'text-emerald-300'
                      }`}
                    >
                      {dialogue.char}
                    </span>
                    <button
                      onClick={() => playSpeechForDialogue(idx)}
                      className="p-1 rounded-md text-slate-500 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="Speak this bubble"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {dialogue.text}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={chatBottomRef} />
        </div>

        {/* Next Dialogue / Show All Dialogue Controls */}
        {revealedDialogueCount < activeChapter.dialogues.length && (
          <div className="flex items-center justify-center gap-2 py-2">
            <button
              onClick={() => setRevealedDialogueCount((prev) => prev + 1)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 cursor-pointer active:scale-95 transition-all"
            >
              <span>Next Dialogue 💬</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsAutoPlayingChat(!isAutoPlayingChat)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                isAutoPlayingChat
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-800 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {isAutoPlayingChat ? 'Pause Auto-Play' : 'Auto-Play ▶️'}
            </button>

            <button
              onClick={() => setRevealedDialogueCount(activeChapter.dialogues.length)}
              className="px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-white/5 cursor-pointer"
            >
              Read All
            </button>
          </div>
        )}

        {/* 💡 AAJ KA LESSON (Appears when all dialogues are revealed) */}
        {revealedDialogueCount >= activeChapter.dialogues.length && (
          <div className="mt-4 p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-emerald-500/10 border-2 border-amber-400/40 shadow-2xl space-y-3 animate-fade-in relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-black text-amber-300 tracking-wide uppercase">
                  💡 Aaj Ka Lesson
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Chapter Clear!
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
              "{activeChapter.lesson}"
            </p>

            {activeChapter.realWorldAnalogy && (
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 text-xs text-slate-300 font-sans space-y-1">
                <span className="font-bold text-cyan-300 font-mono text-[10px] uppercase">
                  🌍 Asali Zindagi Ka Example:
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {activeChapter.realWorldAnalogy}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeChapter.conceptTags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300 border border-white/5"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Bottom Navigation to Next Chapter */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <button
                onClick={() => {
                  setRevealedDialogueCount(2);
                  stopAudio();
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-read</span>
              </button>

              {currentChapterId < CHAPTERS_DATA.length ? (
                <button
                  onClick={handleNextChapter}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:gap-3"
                >
                  <span>Agla Chapter 🚀</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 border border-amber-500/30">
                  <Trophy className="w-4 h-4" />
                  <span>Poori Book Complete Ho Gayi!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Chapters & Seasons Slide-Over Drawer */}
      {showDrawer && (
        <div
          onClick={() => setShowDrawer(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-start animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl text-slate-100 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>TechNagar Index</span>
                </h3>
                <p className="text-[11px] text-slate-400">17 Chapters + Grand Finale</p>
              </div>

              <button
                onClick={() => setShowDrawer(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Seasons & Chapters List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {SEASONS_DATA.map((season) => {
                const seasonChapters = CHAPTERS_DATA.filter((c) => c.seasonId === season.id);
                return (
                  <div key={season.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                      <span className="font-mono text-cyan-400">{season.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {seasonChapters.length} Ch
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {seasonChapters.map((ch) => {
                        const isCurrent = ch.id === currentChapterId;
                        const isDone = completedChapters.includes(ch.id);

                        return (
                          <button
                            key={ch.id}
                            onClick={() => {
                              setCurrentChapterId(ch.id);
                              setShowDrawer(false);
                            }}
                            className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isCurrent
                                ? 'bg-cyan-950/60 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                                : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/80'
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-slate-400">
                                  #{ch.chapterNumber}
                                </span>
                                <span
                                  className={`text-xs font-bold truncate ${
                                    isCurrent ? 'text-cyan-300' : 'text-white'
                                  }`}
                                >
                                  {ch.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">{ch.tagline}</p>
                            </div>

                            <div className="shrink-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : isCurrent ? (
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
