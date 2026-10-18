import React, { useState, useMemo } from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Feather
} from 'lucide-react';
import { BAHR_PATTERNS, AROOZ_RULES } from '../data/meterData';
import { BahrPattern } from '../types';

interface SukhanMeterAnalyzerProps {
  onInsertTemplateIntoStudio?: (meterName: string, pattern: string) => void;
  onOpenCardDesigner?: (text: string, attribution: string) => void;
}

export const SukhanMeterAnalyzer: React.FC<SukhanMeterAnalyzerProps> = ({
  onInsertTemplateIntoStudio,
  onOpenCardDesigner
}) => {
  const [inputLine, setInputLine] = useState(
    'Dil-e-nadaan tujhe hua kya hai'
  );
  const [selectedBahr, setSelectedBahr] = useState<BahrPattern>(BAHR_PATTERNS[0]);
  const [copiedPattern, setCopiedPattern] = useState(false);

  // Client-side Syllable Scansion (Taqti) Engine
  const scansionResult = useMemo(() => {
    if (!inputLine.trim()) {
      return { syllables: [], weights: '', count1: 0, count2: 0 };
    }

    // Normalized words
    const words = inputLine
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
      .split(/\s+/)
      .filter(Boolean);

    const longVowels = ['aa', 'ee', 'oo', 'ai', 'au', 'aai', 'aan', 'een', 'oon', 'o', 'e'];

    const syllables: { token: string; weight: '1' | '2'; isLong: boolean }[] = [];

    words.forEach((word) => {
      // Simple heuristic syllable splitter for Roman/Hindustani
      // We chunk word by consonant-vowel pairs
      let i = 0;
      while (i < word.length) {
        // Lookahead for long vowel
        const sub3 = word.substring(i, i + 3);
        const sub2 = word.substring(i, i + 2);

        if (longVowels.includes(sub3)) {
          syllables.push({ token: sub3, weight: '2', isLong: true });
          i += 3;
        } else if (longVowels.includes(sub2)) {
          syllables.push({ token: sub2, weight: '2', isLong: true });
          i += 2;
        } else if ('aeiou'.includes(word[i])) {
          // Check if followed by consonant cluster or ends word
          if (i === word.length - 1) {
            syllables.push({ token: word[i], weight: '1', isLong: false });
          } else if (
            i + 2 < word.length &&
            !'aeiou'.includes(word[i + 1]) &&
            !'aeiou'.includes(word[i + 2])
          ) {
            syllables.push({
              token: word.substring(i, i + 2),
              weight: '2',
              isLong: true
            });
            i += 1;
          } else {
            syllables.push({ token: word[i], weight: '1', isLong: false });
          }
          i++;
        } else {
          // Consonant - attach to next vowel if available
          let chunk = word[i];
          i++;
          while (i < word.length && !'aeiou'.includes(word[i])) {
            chunk += word[i];
            i++;
          }
          if (i < word.length && 'aeiou'.includes(word[i])) {
            // Check long vowel
            const nextSub2 = word.substring(i, i + 2);
            if (longVowels.includes(nextSub2)) {
              chunk += nextSub2;
              i += 2;
              syllables.push({ token: chunk, weight: '2', isLong: true });
            } else {
              chunk += word[i];
              i++;
              syllables.push({ token: chunk, weight: '1', isLong: false });
            }
          } else {
            syllables.push({ token: chunk, weight: '1', isLong: false });
          }
        }
      }
    });

    const weightString = syllables.map((s) => s.weight).join('');
    const count1 = syllables.filter((s) => s.weight === '1').length;
    const count2 = syllables.filter((s) => s.weight === '2').length;

    return { syllables, weights: weightString, count1, count2 };
  }, [inputLine]);

  // Match closest Bahr
  const closestBahr = useMemo(() => {
    const rawInputWeights = scansionResult.weights;
    if (!rawInputWeights) return null;

    let bestMatch: BahrPattern = BAHR_PATTERNS[0];
    let bestScore = -1;

    BAHR_PATTERNS.forEach((bahr) => {
      const cleanPattern = bahr.weightPattern.replace(/\s+/g, '');
      // Calculate simple Levenshtein/Hamming similarity
      let matches = 0;
      const compareLen = Math.min(rawInputWeights.length, cleanPattern.length);
      for (let i = 0; i < compareLen; i++) {
        if (rawInputWeights[i] === cleanPattern[i]) matches++;
      }
      const score = matches / Math.max(rawInputWeights.length, cleanPattern.length);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = bahr;
      }
    });

    return { bahr: bestMatch, score: Math.round(bestScore * 100) };
  }, [scansionResult]);

  const handleCopyBahr = (bahr: BahrPattern) => {
    navigator.clipboard.writeText(
      `Bahr: ${bahr.name}\nRhythm Pattern: ${bahr.arooziPattern}\nWeights: ${bahr.weightPattern}\n\nExample:\n"${bahr.popularExample[0]}\n${bahr.popularExample[1]}"\n— ${bahr.poet}\n\n(Sukhan Ilm-e-Arooz Studio · By Prince Thakur)`
    );
    setCopiedPattern(true);
    setTimeout(() => setCopiedPattern(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6 select-none animate-fade-in">
      {/* Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#15151C] via-[#0B0B0F] to-[#161c28] border border-[#C6A66B]/30 shadow-2xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0B0F] border border-[#C6A66B]/40 text-xs font-semibold text-[#C6A66B]">
              <Activity className="w-3.5 h-3.5" />
              <span>Ilm-e-Arooz & Taqti Engine</span>
              <span className="w-1 h-1 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] text-zinc-400">Poetry Meter Scansion</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#FFF5EA] tracking-wide">
              Bahr & Wazan <span className="italic text-[#C6A66B]">Analyzer</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Shayari ke sur, vajan aur meter (Chhand / Taqti) ko samjhein. Har misre ke short (1) aur long (2) syllables scansion karke classical Bahrs se match karein.
            </p>
          </div>

          <div className="bg-[#0B0B0F]/90 border border-[#C6A66B]/30 rounded-2xl p-4 text-xs space-y-1.5 max-w-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C6A66B] block">
              Quick Rule of Thumb
            </span>
            <p className="text-zinc-300 leading-tight">
              <strong className="text-cyan-400 font-mono">1 = Chhoti Harkat:</strong> Akele zabar, zer, pesh (Laghu)
            </p>
            <p className="text-zinc-300 leading-tight">
              <strong className="text-amber-400 font-mono">2 = Bada Sukoon:</strong> Bada vowel / do harf (Guru)
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Line Tester */}
      <div className="rounded-3xl p-6 bg-[#121218] border border-[#C6A66B]/25 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#FFF5EA] tracking-wide flex items-center gap-2">
            <Feather className="w-4 h-4 text-[#C6A66B]" />
            <span>Misra Scansion Tool (Taqti Checker)</span>
          </h3>
          <span className="text-xs text-zinc-400">Real-time Client-side Scansion</span>
        </div>

        {/* Input box */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-400 block font-medium">
            Apna Misra yahan likhein ya paste karein (Roman Urdu / Hindi):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputLine}
              onChange={(e) => setInputLine(e.target.value)}
              placeholder="e.g. Dil-e-nadaan tujhe hua kya hai"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0B0B0F] border border-[#C6A66B]/30 focus:border-[#C6A66B] text-sm text-[#FFF5EA] placeholder-zinc-500 outline-none transition-all"
            />
            <button
              onClick={() => setInputLine('Hazaron khwahishen aisi ki har khwahish pe dam nikle')}
              className="px-3.5 py-2.5 rounded-2xl bg-[#181822] hover:bg-[#222230] text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700/60 transition-all cursor-pointer whitespace-nowrap"
            >
              Ghalib Sample
            </button>
            <button
              onClick={() => setInputLine('Kaun is ghar ki dekh-bhaal kare')}
              className="px-3.5 py-2.5 rounded-2xl bg-[#181822] hover:bg-[#222230] text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700/60 transition-all cursor-pointer whitespace-nowrap hidden sm:block"
            >
              Jaun Sample
            </button>
          </div>
        </div>

        {/* Live Scansion Visual Breakdown */}
        {scansionResult.syllables.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#0B0B0F] border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/80 pb-2">
              <span>Syllable Breakdown (Lafzi Taqti):</span>
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-mono">1 (Short): {scansionResult.count1}</span>
                <span className="text-amber-400 font-mono">2 (Long): {scansionResult.count2}</span>
                <span className="text-zinc-300 font-bold">Total: {scansionResult.syllables.length}</span>
              </div>
            </div>

            {/* Visual Syllable Beads */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {scansionResult.syllables.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                    s.weight === '2'
                      ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                      : 'bg-cyan-950/40 border-cyan-600/40 text-cyan-300'
                  }`}
                >
                  <span className="text-[10px] text-zinc-400 font-normal">{s.token}</span>
                  <span className="text-sm font-bold">{s.weight}</span>
                </div>
              ))}
            </div>

            {/* Generated Weight Signature */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 uppercase tracking-wider font-bold">Weight Vector:</span>
                <span className="font-mono text-[#C6A66B] bg-[#15151C] px-2.5 py-1 rounded-lg border border-zinc-800 tracking-widest text-sm">
                  {scansionResult.weights}
                </span>
              </div>

              {/* Closest Match Indicator */}
              {closestBahr && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Closest Classic Bahr:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-700/40 text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{closestBahr.bahr.name}</span>
                    <span className="text-[10px] text-emerald-400/80">({closestBahr.score}% match)</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Classic Bahrs Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-serif font-bold text-[#FFF5EA]">
              6 Azeem Classical Bahrs (Ghazal Meters)
            </h3>
            <p className="text-xs text-zinc-400">
              Ustaad Shayaron ke wazan aur unke mashhoor ash'aar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BAHR_PATTERNS.map((bahr) => {
            const isSelected = selectedBahr.id === bahr.id;
            return (
              <div
                key={bahr.id}
                onClick={() => setSelectedBahr(bahr)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#181824] border-[#C6A66B] shadow-xl shadow-[#C6A66B]/10'
                    : 'bg-[#121218] border-zinc-800 hover:border-[#C6A66B]/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-serif text-[#FFF5EA] font-bold text-sm">
                      {bahr.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#261523] text-[#E6C280] border border-[#C6A66B]/20 whitespace-nowrap">
                      {bahr.cadence.split(' ')[0]}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 font-mono bg-[#0B0B0F] px-2.5 py-1.5 rounded-lg border border-zinc-800 mb-2">
                    {bahr.arooziPattern}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#C6A66B] mb-2">
                    <span className="text-zinc-500 font-sans text-[10px] uppercase">Rhythm:</span>
                    <span>{bahr.weightPattern}</span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-3 mb-3 leading-relaxed">
                    {bahr.descriptionHinglish}
                  </p>

                  {/* Popular Example */}
                  <div className="p-3 rounded-xl bg-[#0B0B0F] border border-zinc-800/80 text-xs italic font-serif text-[#FFF5EA]">
                    <p>"{bahr.popularExample[0]}</p>
                    <p>{bahr.popularExample[1]}"</p>
                    <span className="block not-italic text-[10px] text-[#C6A66B] mt-1 text-right">
                      — {bahr.poet}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyBahr(bahr);
                    }}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Info</span>
                  </button>

                  {onInsertTemplateIntoStudio && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInsertTemplateIntoStudio(bahr.name, bahr.weightPattern);
                      }}
                      className="flex items-center gap-1 font-semibold text-[#C6A66B] hover:text-[#FFF5EA] transition-colors cursor-pointer"
                    >
                      <span>Studio me use karein</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arooz Guide Rules */}
      <div className="rounded-3xl p-6 bg-[#121218] border border-zinc-800 space-y-4">
        <h3 className="text-sm font-serif font-bold text-[#FFF5EA] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#C6A66B]" />
          <span>Arooz Ke 4 Buniyadi Qanoon (Fundamentals of Urdu Scansion)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AROOZ_RULES.map((rule, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0B0B0F] border border-zinc-800/80 space-y-1">
              <h4 className="text-xs font-bold text-[#C6A66B]">{rule.title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
