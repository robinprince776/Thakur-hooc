import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Palette,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Heart,
  Quote,
  Feather,
  Info
} from 'lucide-react';
import { POETS_DATA } from '../data/poetsData';
import { Couplet, PoetProfile } from '../types';

interface SukhanPoetsLibraryProps {
  onOpenCardDesigner: (text: string, attribution: string) => void;
  onSelectMood: (moodName: string) => void;
  initialPoetId?: string;
}

export const SukhanPoetsLibrary: React.FC<SukhanPoetsLibraryProps> = ({
  onOpenCardDesigner,
  onSelectMood,
  initialPoetId
}) => {
  const [selectedPoetId, setSelectedPoetId] = useState<string>(initialPoetId || 'ghalib');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedLughat, setExpandedLughat] = useState<Record<string, boolean>>({});

  const eras = ['All', 'Classical', 'Progressive', 'Modern', 'Sufi & Bhakti'];

  const filteredPoets = useMemo(() => {
    return POETS_DATA.filter((p) => {
      const matchEra =
        selectedEra === 'All'
          ? true
          : selectedEra === 'Classical'
          ? p.era.includes('Classical') || p.era.includes('Mughal')
          : selectedEra === 'Progressive'
          ? p.era.includes('Progressive')
          : selectedEra === 'Modern'
          ? p.era.includes('Modern') || p.era.includes('Contemporary')
          : p.era.includes('Sufi') || p.era.includes('Bhakti');

      const matchSearch =
        !searchQuery.trim() ||
        p.nameRoman.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.takhallus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.majorThemes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.signatureCouplet.some((line) => line.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchEra && matchSearch;
    });
  }, [searchQuery, selectedEra]);

  const activePoet = useMemo(() => {
    return POETS_DATA.find((p) => p.id === selectedPoetId) || filteredPoets[0] || POETS_DATA[0];
  }, [selectedPoetId, filteredPoets]);

  const handleCopyCouplet = (couplet: Couplet) => {
    const text = `${couplet.linesRoman.join('\n')}\n— ${couplet.poetName}\n(Sukhan · Made by Prince Thakur)`;
    navigator.clipboard.writeText(text);
    setCopiedId(couplet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleLughat = (id: string) => {
    setExpandedLughat((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151C] border border-[#C6A66B]/30 text-xs font-semibold text-[#C6A66B]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Verified Literary Archive · 12 Master Poets</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#F2E9DC] tracking-wide">
          Shayaron Ki Duniya
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Mirza Ghalib se lekar Jaun Elia, Faiz, Parveen Shakir aur Bulleh Shah tak verified kalam aur falsafa.
        </p>
      </div>

      {/* Search & Era Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Shayar ka naam, sher, ya alfaaz dhoondhein..."
            className="w-full bg-[#15151C] border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F2E9DC] focus:outline-none focus:border-[#C6A66B]"
          />
        </div>

        {/* Era selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {eras.map((era) => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                selectedEra === era
                  ? 'bg-[#C6A66B]/20 border-[#C6A66B] text-[#FFF5EA]'
                  : 'bg-[#15151C] border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      </div>

      {/* Poet Avatars Grid / Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredPoets.map((poet) => {
          const isSelected = poet.id === activePoet.id;
          return (
            <button
              key={poet.id}
              onClick={() => setSelectedPoetId(poet.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-[#59263C]/30 via-[#15151C] to-[#0B0B0F] border-[#C6A66B] shadow-lg shadow-[#59263C]/20 ring-1 ring-[#C6A66B]/40 scale-102'
                  : 'bg-[#15151C]/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-[#15151C]'
              }`}
            >
              {/* Monogram Badge */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif text-base font-bold transition-transform group-hover:scale-105 border ${
                  isSelected
                    ? 'border-[#C6A66B] bg-[#0B0B0F] text-[#C6A66B]'
                    : 'border-zinc-800 bg-[#0B0B0F] text-zinc-400'
                }`}
              >
                {poet.nameRoman
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>

              <div className="min-w-0 w-full">
                <div className="text-xs font-serif font-bold text-[#F2E9DC] truncate">
                  {poet.nameRoman}
                </div>
                <div className="text-[10px] text-zinc-500 truncate mt-0.5">{poet.eraDates}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE POET PROFILE SPOTLIGHT */}
      {activePoet && (
        <div className="space-y-6">
          {/* Main Poet Profile Card */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-[#15151C]/90 border border-[#C6A66B]/30 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#59263C]/25 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono uppercase text-[#C6A66B] px-2.5 py-0.5 rounded-full bg-[#0B0B0F] border border-[#C6A66B]/30 font-bold">
                    {activePoet.era}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {activePoet.eraDates} · {activePoet.birthPlace}
                  </span>
                  {activePoet.takhallus && (
                    <span className="text-xs text-[#C6A66B] italic font-serif">
                      Takhallus: "{activePoet.takhallus}"
                    </span>
                  )}
                </div>

                <h2 className="text-3xl sm:text-4xl font-serif text-[#FFF5EA] tracking-wide">
                  {activePoet.nameRoman}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                  {activePoet.bioHinglish}
                </p>

                {/* Historical Context */}
                <div className="p-3.5 rounded-xl bg-[#0B0B0F]/60 border border-zinc-800/80 text-xs text-zinc-400 space-y-1 mt-3">
                  <strong className="text-zinc-200 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>Tareekhi Pas-Manzar (Historical Context):</span>
                  </strong>
                  <p>{activePoet.historicalContextHinglish}</p>
                </div>
              </div>

              {/* Verified Sources & Themes */}
              <div className="space-y-4 md:w-72 shrink-0 bg-[#0B0B0F]/70 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                    Ahem Mauzooaat (Major Themes):
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {activePoet.majorThemes.map((th, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#15151C] border border-zinc-800 text-[10px] text-zinc-300"
                      >
                        {th}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                    Reliable Sources:
                  </span>
                  <ul className="text-[11px] text-[#C6A66B] mt-1 space-y-0.5 list-disc list-inside">
                    {activePoet.sourceReferences.map((ref, i) => (
                      <li key={i} className="truncate">
                        {ref}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Signature Couplet */}
            <div className="relative z-10 mt-6 pt-6 border-t border-[#C6A66B]/20">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-serif font-bold text-[#C6A66B] uppercase tracking-wider flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-[#C6A66B]" />
                  <span>Signature Kalam (Pechan Sher):</span>
                </span>
                <button
                  onClick={() =>
                    onOpenCardDesigner(activePoet.signatureCouplet.join('\n'), activePoet.nameRoman)
                  }
                  className="text-[11px] text-[#C6A66B] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <Palette className="w-3 h-3" />
                  <span>Design Card</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B0B0F]/90 border border-[#C6A66B]/30 text-center space-y-2">
                <p className="font-serif italic text-base sm:text-xl text-[#FFF5EA] leading-loose">
                  "{activePoet.signatureCouplet[0]}"
                  <br />
                  "{activePoet.signatureCouplet[1]}"
                </p>
                <p className="text-xs text-zinc-400 max-w-xl mx-auto pt-1 leading-relaxed">
                  <strong className="text-zinc-300">Tashreeh: </strong>
                  {activePoet.signatureMeaning}
                </p>
              </div>
            </div>
          </div>

          {/* Popular Verified Couplets of this Poet */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-[#F2E9DC] flex items-center justify-between">
              <span>{activePoet.nameRoman} Ke Mashhoor Ash'aar</span>
              <span className="text-xs font-mono text-zinc-400">
                Verified ({activePoet.popularCouplets.length})
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activePoet.popularCouplets.map((couplet) => (
                <div
                  key={couplet.id}
                  className="p-5 rounded-2xl bg-[#15151C]/70 border border-[#C6A66B]/20 hover:border-[#C6A66B]/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0B0B0F] border border-zinc-800">
                        {couplet.form}
                      </span>
                      <div className="flex items-center gap-1">
                        {couplet.moods.map((m, idx) => (
                          <span
                            key={idx}
                            onClick={() => onSelectMood(m)}
                            className="text-[10px] text-[#C6A66B] hover:underline cursor-pointer"
                          >
                            #{m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="py-2 text-center">
                      <p className="font-serif italic text-base text-[#F2E9DC] leading-loose">
                        {couplet.linesRoman[0]}
                        <br />
                        {couplet.linesRoman[1]}
                      </p>
                    </div>

                    <p className="text-xs text-zinc-400 bg-[#0B0B0F]/60 p-2.5 rounded-xl border border-zinc-800 leading-relaxed">
                      <strong className="text-zinc-300">Mafhoom: </strong>
                      {couplet.hinglishMeaning}
                    </p>

                    {/* Lughat (Difficult Word Meanings) */}
                    {couplet.difficultWords && couplet.difficultWords.length > 0 && (
                      <div className="pt-1">
                        <button
                          onClick={() => toggleLughat(couplet.id)}
                          className="text-[11px] text-[#C6A66B] font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          <span>Lughat (Word Meanings)</span>
                          {expandedLughat[couplet.id] ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {expandedLughat[couplet.id] && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-zinc-800 text-[11px]">
                            {couplet.difficultWords.map((w, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-[#0B0B0F] border border-zinc-800/80"
                              >
                                <span className="font-serif font-bold text-[#F2E9DC]">{w.word}:</span>{' '}
                                <span className="text-zinc-400">{w.meaning}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        onOpenCardDesigner(couplet.linesRoman.join('\n'), activePoet.nameRoman)
                      }
                      className="flex items-center gap-1 text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer text-[11px]"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Card Designer</span>
                    </button>

                    <button
                      onClick={() => handleCopyCouplet(couplet)}
                      className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer text-[11px]"
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
        </div>
      )}
    </div>
  );
};
