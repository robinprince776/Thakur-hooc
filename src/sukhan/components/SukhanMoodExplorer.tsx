import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  PenTool,
  ArrowRight,
  Copy,
  Check,
  Palette,
  ExternalLink,
  Flame,
  Heart,
  ChevronRight
} from 'lucide-react';
import { MOODS_DATA } from '../data/moodsData';
import { POETS_DATA } from '../data/poetsData';
import { SHAYARI_LIBRARY_DATA } from '../data/shayariLibraryData';
import { Couplet, MoodCategory } from '../types';

interface SukhanMoodExplorerProps {
  onSelectMoodForStudio: (moodName: string, prompt?: string) => void;
  onOpenCardDesigner: (text: string, attribution: string) => void;
  onSelectPoet: (poetId: string) => void;
}

export const SukhanMoodExplorer: React.FC<SukhanMoodExplorerProps> = ({
  onSelectMoodForStudio,
  onOpenCardDesigner,
  onSelectPoet
}) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>('ishq');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeMood = MOODS_DATA.find((m) => m.id === selectedMoodId) || MOODS_DATA[0];

  // Gather verified couplets from poets that match this mood
  const matchingCouplets = React.useMemo(() => {
    const list: Couplet[] = [];
    POETS_DATA.forEach((poet) => {
      poet.popularCouplets.forEach((c) => {
        if (c.moods.some((m) => m.toLowerCase() === activeMood.nameRoman.toLowerCase())) {
          list.push(c);
        }
      });
    });

    // Also include couplets from the extended Shayari Library
    SHAYARI_LIBRARY_DATA.forEach((item) => {
      if (item.mood.toLowerCase() === activeMood.nameRoman.toLowerCase()) {
        list.push({
          id: item.id,
          poetId: item.poetId,
          poetName: item.poetName,
          linesRoman: item.linesRoman,
          hinglishMeaning: item.hinglishMeaning,
          moods: [item.mood],
          form: 'Sher',
          tags: item.tags,
          difficultWords: item.difficultWords
        });
      }
    });

    return list;
  }, [activeMood]);

  // Related poets
  const relatedPoets = React.useMemo(() => {
    return POETS_DATA.filter((p) => activeMood.relatedPoetIds.includes(p.id));
  }, [activeMood]);

  const handleCopy = (couplet: Couplet) => {
    const text = `${couplet.linesRoman.join('\n')}\n— ${couplet.poetName}\n(Sukhan · Made by Prince Thakur)`;
    navigator.clipboard.writeText(text);
    setCopiedId(couplet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* Top Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151C] border border-[#C6A66B]/30 text-xs font-semibold text-[#C6A66B]">
          <Compass className="w-3.5 h-3.5" />
          <span>Mood Ke Hisaab Se Shayari &amp; Alfaaz</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#F2E9DC] tracking-wide">
          Ehsaas Aur Jazbaat Explorer
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Apne dil ke haal ke hisaab se sheron ki dunya explore karein aur usi mood me naya sher likhein.
        </p>
      </div>

      {/* Mood Selector Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MOODS_DATA.map((mood) => {
          const isSelected = mood.id === activeMood.id;
          return (
            <button
              key={mood.id}
              onClick={() => setSelectedMoodId(mood.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border flex items-center gap-2 cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#59263C] to-[#0B0B0F] border-[#C6A66B] text-[#FFF5EA] shadow-lg shadow-[#59263C]/30 scale-102 ring-1 ring-[#C6A66B]/40'
                  : 'bg-[#15151C]/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mood.color }} />
              <span>{mood.nameRoman}</span>
            </button>
          );
        })}
      </div>

      {/* Active Mood Feature Spotlight Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#15151C]/90 border border-[#C6A66B]/30 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#59263C]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#C6A66B]/20 pb-6">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#C6A66B]">
              <span>Muntakhab Jazba:</span>
              <span className="font-bold">{activeMood.nameRoman}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#FFF5EA] tracking-wide">
              {activeMood.tagline}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
              {activeMood.descriptionHinglish}
            </p>
          </div>

          {/* Trigger Studio Button */}
          <button
            onClick={() => onSelectMoodForStudio(activeMood.nameRoman)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C6A66B] to-[#8C6F38] text-slate-950 font-bold text-xs shadow-xl shadow-[#C6A66B]/20 hover:brightness-110 transition-all cursor-pointer shrink-0"
          >
            <PenTool className="w-4 h-4" />
            <span>Is Mood Par Likhein</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Associated Poetic Vocabulary (Alfaaz Bank) */}
        <div className="relative z-10 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A66B] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Makhsoos Alfaaz (Vocabulary for {activeMood.nameRoman})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {activeMood.associatedAlfaaz.map((alfaz, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0B0B0F]/80 border border-zinc-800/80 hover:border-[#C6A66B]/40 transition-colors"
              >
                <div className="text-xs font-bold text-[#F2E9DC] font-serif">{alfaz.word}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{alfaz.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Writing Prompts for this Mood */}
        <div className="relative z-10 pt-6 border-t border-zinc-800/80 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A66B] mb-3">
            Inspiration &amp; Writing Prompts:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeMood.writingPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectMoodForStudio(activeMood.nameRoman, prompt)}
                className="p-3.5 rounded-xl bg-[#0B0B0F]/60 border border-zinc-800 hover:border-[#C6A66B]/40 text-left text-xs text-zinc-300 hover:text-white transition-all cursor-pointer group flex flex-col justify-between"
              >
                <p className="italic font-serif leading-relaxed">"{prompt}"</p>
                <span className="text-[10px] font-semibold text-[#C6A66B] mt-2 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Yeh Prompt Use Karein ➔
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Couplets Matching this Mood */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif text-[#F2E9DC] flex items-center gap-2">
            <span>Verified Kalam: {activeMood.nameRoman}</span>
            <span className="text-xs font-mono text-zinc-400 font-normal">
              ({matchingCouplets.length} Ash'aar)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchingCouplets.map((couplet) => (
            <div
              key={couplet.id}
              className="p-5 rounded-2xl bg-[#15151C]/70 border border-[#C6A66B]/20 hover:border-[#C6A66B]/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                  <button
                    onClick={() => onSelectPoet(couplet.poetId)}
                    className="font-serif font-bold text-[#C6A66B] hover:underline cursor-pointer"
                  >
                    — {couplet.poetName}
                  </button>
                  <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-[10px] border border-zinc-800">
                    {couplet.form}
                  </span>
                </div>

                <div className="py-3 text-center">
                  <p className="font-serif italic text-base text-[#F2E9DC] leading-loose">
                    {couplet.linesRoman[0]}
                    <br />
                    {couplet.linesRoman[1]}
                  </p>
                </div>

                <p className="text-xs text-zinc-400 bg-[#0B0B0F]/60 p-2.5 rounded-xl border border-zinc-800/80 leading-relaxed">
                  <strong className="text-zinc-300">Mafhoom: </strong>
                  {couplet.hinglishMeaning}
                </p>
              </div>

              {/* Bottom Quick Tools */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenCardDesigner(couplet.linesRoman.join('\n'), couplet.poetName)}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer text-[11px]"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Card Designer</span>
                </button>

                <button
                  onClick={() => handleCopy(couplet)}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  {copiedId === couplet.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === couplet.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Poets for this Mood */}
      {relatedPoets.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6A66B]">
            Poets known for {activeMood.nameRoman}:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {relatedPoets.map((poet) => (
              <button
                key={poet.id}
                onClick={() => onSelectPoet(poet.id)}
                className="p-3.5 rounded-xl bg-[#15151C]/80 border border-zinc-800 hover:border-[#C6A66B]/40 text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-sm font-serif font-bold text-[#F2E9DC] group-hover:text-[#C6A66B] transition-colors">
                    {poet.nameRoman}
                  </div>
                  <div className="text-[11px] text-zinc-400">{poet.era}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#C6A66B] transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
