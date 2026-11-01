import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Brain,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  BookOpen,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Zap,
  Target
} from 'lucide-react';
import { FEYNMAN_TOPICS, UNIVERSAL_JARGONS, FeynmanTopic } from './feynmanData';

export interface FeynmanSimulatorAppProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
  onSwitchApp?: (appId: string) => void;
}

interface EvaluationResult {
  score: number; // 0 to 10
  verdict: 'Master' | 'Good Explainer' | 'Needs Simplification' | 'Jargon Heavy';
  gradeLetter: 'A+' | 'A' | 'B' | 'C' | 'Try Again';
  detectedJargons: string[];
  detectedAnalogies: string[];
  coveredConcepts: string[];
  missingConcepts: string[];
  readabilityFeedback: string;
  advice: string[];
}

export const FeynmanSimulatorApp: React.FC<FeynmanSimulatorAppProps> = ({
  onBackToHub,
  onOpenAppSwitcher,
  onSwitchApp
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('osi-model');
  const [customTopicTitle, setCustomTopicTitle] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [userText, setUserText] = useState<string>('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('feynman_streak') || 0);
    } catch {
      return 0;
    }
  });

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const activeTopic = useMemo<FeynmanTopic>(() => {
    if (isCustomMode) {
      return {
        id: 'custom',
        title: customTopicTitle || 'Custom Topic',
        category: 'Computer Science',
        tagline: 'Explain this to a 10-year-old child in simple everyday words.',
        expectedConcepts: ['working', 'example', 'use', 'how it works'],
        jargonList: [],
        recommendedAnalogies: ['jaise', 'like', 'imagine', 'example'],
        sampleKidExplanation: 'Use simple everyday examples like food, toys, water or school!'
      };
    }
    return FEYNMAN_TOPICS.find((t) => t.id === selectedTopicId) || FEYNMAN_TOPICS[0];
  }, [selectedTopicId, isCustomMode, customTopicTitle]);

  // Client-Side Feynman Simplicity & Mastery Engine
  const evaluateExplanation = () => {
    if (!userText.trim()) return;

    setIsEvaluating(true);
    setTimeout(() => {
      const lower = userText.toLowerCase();
      const words = lower.split(/\s+/).filter(Boolean);

      // 1. Check for Jargon
      const allJargons = [...activeTopic.jargonList, ...UNIVERSAL_JARGONS];
      const foundJargons: string[] = [];
      allJargons.forEach((jargon) => {
        if (lower.includes(jargon.toLowerCase()) && !foundJargons.includes(jargon)) {
          foundJargons.push(jargon);
        }
      });

      // 2. Check for Kid-Friendly Analogies
      const analogyKeywords = [
        'like a',
        'like an',
        'jaise',
        'jaise ki',
        'imagine',
        'maan lo',
        'socho',
        'example',
        'postman',
        'chithi',
        'envelope',
        'water',
        'nalka',
        'tap',
        'toy',
        'khilona',
        'box',
        'dabba',
        'superhero',
        'police',
        'restaurant',
        'bhai',
        'friend'
      ];
      const foundAnalogies: string[] = [];
      analogyKeywords.forEach((kw) => {
        if (lower.includes(kw) && !foundAnalogies.includes(kw)) {
          foundAnalogies.push(kw);
        }
      });

      // 3. Concept coverage
      const covered: string[] = [];
      const missing: string[] = [];
      activeTopic.expectedConcepts.forEach((concept) => {
        if (lower.includes(concept.toLowerCase())) {
          covered.push(concept);
        } else {
          missing.push(concept);
        }
      });

      // 4. Scoring Algorithm (0 to 10)
      let score = 5.0; // Base score for writing

      // Length bonus / penalty
      if (words.length >= 35 && words.length <= 150) {
        score += 1.5; // Ideal concise length for explaining to a child
      } else if (words.length < 20) {
        score -= 1.5; // Too short
      } else if (words.length > 250) {
        score -= 1.0; // Over-complicated wall of text
      }

      // Analogy bonus
      if (foundAnalogies.length > 0) {
        score += Math.min(foundAnalogies.length * 1.2, 2.5);
      } else {
        score -= 1.0; // Penalty for having zero layman analogies
      }

      // Concept coverage
      if (activeTopic.expectedConcepts.length > 0) {
        const coverageRatio = covered.length / activeTopic.expectedConcepts.length;
        score += coverageRatio * 2.0;
      }

      // Jargon penalty
      if (foundJargons.length > 0) {
        score -= foundJargons.length * 1.5;
      } else {
        score += 1.0; // Bonus for 0 jargon
      }

      // Bound score strictly between 1.0 and 10.0
      score = Math.max(1.0, Math.min(10.0, Math.round(score * 10) / 10));

      let verdict: EvaluationResult['verdict'] = 'Needs Simplification';
      let gradeLetter: EvaluationResult['gradeLetter'] = 'C';

      if (score >= 8.5) {
        verdict = 'Master';
        gradeLetter = 'A+';
      } else if (score >= 7.0) {
        verdict = 'Good Explainer';
        gradeLetter = 'A';
      } else if (score >= 5.0) {
        verdict = 'Needs Simplification';
        gradeLetter = 'B';
      } else {
        verdict = 'Jargon Heavy';
        gradeLetter = 'Try Again';
      }

      // Actionable advice
      const advice: string[] = [];
      if (foundJargons.length > 0) {
        advice.push(
          `⚠️ Tumne bhari technical jargon use kiya (${foundJargons.slice(0, 3).join(', ')}). 10 saal ke bachhe ko ye samajh nahi aayega! Iski jagah aam zaban ke shabdon ka use karo.`
        );
      }
      if (foundAnalogies.length === 0) {
        advice.push(
          '💡 Koi relatable analogy nahi mili! Ek practical misaal do (jaise "postman", "water pipe", "toys", ya "restaurant").'
        );
      } else {
        advice.push(
          `✨ Zabardast! Tumne simple metaphors use kiye: "${foundAnalogies.slice(0, 3).join(', ')}". Ye bachho ke dimag me turant image banata hai.`
        );
      }
      if (words.length < 25) {
        advice.push('📝 Explanation thoda chhota hai. Kam se kam 2-3 simple sentences me context samjhao.');
      } else if (words.length > 200) {
        advice.push('⏳ Explanation thoda lamba ho gaya. Chhota aur focused rakhoge toh attention nahi tootega.');
      }

      let readabilityFeedback = 'Aapki bhasha ka flow accha hai.';
      if (foundJargons.length > 0) {
        readabilityFeedback = `Rattafication alert: ${foundJargons.length} complex words detected. Ratta maarne ki bajaye core logic pe focus karo.`;
      } else if (score >= 8.0) {
        readabilityFeedback = 'Pure clarity! Einstein ne kaha tha: "If you cannot explain it simply, you do not understand it well enough." Tum pass ho gaye!';
      }

      const evalData: EvaluationResult = {
        score,
        verdict,
        gradeLetter,
        detectedJargons: foundJargons,
        detectedAnalogies: foundAnalogies,
        coveredConcepts: covered,
        missingConcepts: missing,
        readabilityFeedback,
        advice
      };

      setResult(evalData);
      setIsEvaluating(false);

      if (score >= 7.0) {
        const nextStreak = streakCount + 1;
        setStreakCount(nextStreak);
        try {
          localStorage.setItem('feynman_streak', String(nextStreak));
        } catch {}
      }
    }, 600);
  };

  const speakFeedback = () => {
    if (!synthRef.current || !result) return;
    synthRef.current.cancel();

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const speechText = `Feynman Clarity Score: ${result.score} out of 10. Verdict: ${result.verdict}. ${result.readabilityFeedback} ${result.advice.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    synthRef.current.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col font-sans select-none relative pb-16">
      {/* Cyber Grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px), radial-gradient(rgba(168, 85, 247, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px'
        }}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                Mastery Lab: Feynman AI Simulator
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                Meta-Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              "Explain it to a 10-year-old child" · Zero Rattafication Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Streak: {streakCount}</span>
          </div>

          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              Apps
            </button>
          )}

          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Main Hub
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Banner Rule Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>THE FEYNMAN TECHNIQUE (RICHARD FEYNMAN)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Agar tum kisi cheez ko 10 saal ke bachhe ko aasan bhasha me nahi samjha sakte, toh tum khud use poora nahi samjhe!
            </h2>
            <p className="text-xs text-slate-400">
              Technical jargon (bhari shabdon) ko chhupao mat. Real life analogies (postman, water, nalka, khilona) use karo.
            </p>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Select Challenge Topic:</span>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-purple-400 hover:text-purple-300 text-xs font-bold underline cursor-pointer"
            >
              {isCustomMode ? '← Pick Pre-Built Topic' : '+ Enter Custom Topic'}
            </button>
          </label>

          {isCustomMode ? (
            <input
              type="text"
              placeholder="E.g. Blockchain, Quantum Computing, Buffer Overflow..."
              value={customTopicTitle}
              onChange={(e) => setCustomTopicTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-white text-sm focus:outline-hidden focus:border-purple-400"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {FEYNMAN_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setResult(null);
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedTopicId === topic.id
                      ? 'bg-purple-900/40 border-purple-400 ring-2 ring-purple-500/20 text-white'
                      : 'bg-slate-900/60 border-white/10 hover:border-purple-500/30 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono block text-purple-400 font-bold">
                    {topic.category}
                  </span>
                  <span className="text-xs font-bold block truncate">{topic.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Topic Brief */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Target: {activeTopic.title}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Audience: 10-Year-Old Child 👦
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            "{activeTopic.tagline}"
          </p>
        </div>

        {/* Explanation Textarea Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400">Apna Jawab Yahan Likhein:</span>
            <span className="text-slate-500 font-mono">
              {userText.split(/\s+/).filter(Boolean).length} words · {userText.length} characters
            </span>
          </div>

          <textarea
            rows={6}
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            placeholder={`Bachhe ko samjhao jaise tum kahani suna rahe ho...\n\nExample hint: "Imagine karo ek dabba hai...", ya "Jaise postman chithi le jata hai..."\n(Bhari technical jargon use mat karna!)`}
            className="w-full p-4 rounded-3xl bg-slate-900/90 border border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 text-slate-100 text-sm leading-relaxed transition-all focus:outline-hidden placeholder:text-slate-600 select-text"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserText(activeTopic.sampleKidExplanation)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-white/5 transition-all cursor-pointer"
              >
                Sample Kid Explanation Dekhein 💡
              </button>
              <button
                onClick={() => {
                  setUserText('');
                  setResult(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-white/5 transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>

            <button
              onClick={evaluateExplanation}
              disabled={!userText.trim() || isEvaluating}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isEvaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Evaluating Simplicity...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Test My Clarity Score 🚀</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Evaluation Output Dashboard */}
        {result && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-purple-950/40 border-2 border-purple-500/40 shadow-2xl space-y-6 animate-fade-in">
            {/* Top Score Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-4">
                {/* Grade Circle */}
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-black text-2xl shadow-xl ${
                    result.score >= 8.0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : result.score >= 6.0
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  <span>{result.score}</span>
                  <span className="text-[10px] text-slate-400 font-normal">/ 10</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                        result.score >= 8.0
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : result.score >= 6.0
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {result.verdict}
                    </span>
                    <span className="text-xs text-slate-400">Grade: {result.gradeLetter}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {result.score >= 8.0
                      ? '🌟 Feynman Mastery Verified!'
                      : result.score >= 6.0
                      ? '👍 Acha prayas hai, thoda aur aasan banao!'
                      : '⚠️ Jargon Heavy! Ratta maarne se bachein.'}
                  </h3>
                </div>
              </div>

              {/* TTS Listen Button */}
              <button
                onClick={speakFeedback}
                className="px-4 py-2 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span>Listen AI Verdict 🔊</span>
                  </>
                )}
              </button>
            </div>

            {/* Readability Verdict */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                Feynman Diagnostic:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {result.readabilityFeedback}
              </p>
            </div>

            {/* Jargon vs Metaphors Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Jargon Detected (Bad) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Unexplained Jargon Words:</span>
                  </span>
                  <span className="font-mono text-slate-400">{result.detectedJargons.length}</span>
                </div>
                {result.detectedJargons.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.detectedJargons.map((j, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-700/60 font-mono text-[10px]"
                      >
                        ⛔ {j}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-emerald-400 text-[11px] font-bold">
                    ✅ Zero heavy jargon! Bachha aasaani se samajh lega.
                  </p>
                )}
              </div>

              {/* Analogies Used (Good) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Relatable Metaphors Found:</span>
                  </span>
                  <span className="font-mono text-slate-400">{result.detectedAnalogies.length}</span>
                </div>
                {result.detectedAnalogies.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.detectedAnalogies.map((a, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-mono text-[10px]"
                      >
                        ✨ {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-400 text-[11px]">
                    ⚠️ Koi visual metaphor nahi mila (jaise dabba, chithi, nalka).
                  </p>
                )}
              </div>
            </div>

            {/* Actionable Recommendations List */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase font-bold text-purple-400">
                Actionable Feedback To Improve:
              </span>
              <div className="space-y-1.5">
                {result.advice.map((adv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-300 leading-relaxed"
                  >
                    {adv}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
