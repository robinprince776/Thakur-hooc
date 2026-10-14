import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Heart,
  Copy,
  Check,
  Palette,
  Volume2,
  Shuffle,
  Tag,
  Filter,
  Flame,
  ChevronDown,
  Info
} from 'lucide-react';
import { SHAYARI_LIBRARY_DATA, LibrarySher } from '../data/shayariLibraryData';

interface SukhanShayariLibraryProps {
  onOpenCardDesigner: (text: string, attribution: string) => void;
  onSelectMoodForStudio?: (mood: string, prompt?: string) => void;
}

export const SukhanShayariLibrary: React.FC<SukhanShayariLibraryProps> = ({
  onOpenCardDesigner,
  onSelectMoodForStudio
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('Sabhi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPoetFilter, setSelectedPoetFilter] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [spotlightSher, setSpotlightSher] = useState<LibrarySher | null>(() => {
    return SHAYARI_LIBRARY_DATA[Math.floor(Math.random() * SHAYARI_LIBRARY_DATA.length)];
  });
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [expandedWordsId, setExpandedWordsId] = useState<string | null>(null);

  const moodsList = [
    'Sabhi',
    'Ishq',
    'Dard',
    'Judai',
    'Tanhai',
    'Josh',
    'Dosti',
    'Khuddaari',
    'Falsafa',
    'Umeed',
    'Sufiana'
  ];

  const uniquePoets = useMemo(() => {
    const set = new Set<string>();
    SHAYARI_LIBRARY_DATA.forEach((s) => set.add(s.poetName));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredShayaris = useMemo(() => {
    return SHAYARI_LIBRARY_DATA.filter((item) => {
      // Mood filter
      if (selectedMood !== 'Sabhi') {
        if (item.mood.toLowerCase() !== selectedMood.toLowerCase()) {
          return false;
        }
      }

      // Poet filter
      if (selectedPoetFilter !== 'All') {
        if (item.poetName !== selectedPoetFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const line1 = item.linesRoman[0].toLowerCase();
        const line2 = item.linesRoman[1].toLowerCase();
        const poet = item.poetName.toLowerCase();
        const meaning = item.hinglishMeaning.toLowerCase();
        const tags = item.tags.join(' ').toLowerCase();

        return (
          line1.includes(q) ||
          line2.includes(q) ||
          poet.includes(q) ||
          meaning.includes(q) ||
          tags.includes(q)
        );
      }

      return true;
    });
  }, [selectedMood, selectedPoetFilter, searchQuery]);

  const handleCopy = (item: LibrarySher) => {
    const text = `${item.linesRoman[0]}\n${item.linesRoman[1]}\n— ${item.poetName}\n\n(Sukhan · Made by Prince Thakur)`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRandomShuffle = () => {
    const randomIndex = Math.floor(Math.random() * SHAYARI_LIBRARY_DATA.length);
    setSpotlightSher(SHAYARI_LIBRARY_DATA[randomIndex]);
  };

  const handleSpeakSher = (item: LibrarySher) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${item.linesRoman[0]}. ${item.linesRoman[1]}. By ${item.poetName}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      setSpeakingId(item.id);

      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C6A66B]/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#59263C]/30 border border-[#C6A66B]/30 text-xs font-semibold text-[#C6A66B] mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Khaas Shayari Library · Made by Prince Thakur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FFF5EA]">
            Shayari Ki Dastgah &amp; Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Har mood ke behtareen verified sher, Hinglish maani aur mushkil alfaaz ke arth ke sath.
          </p>
        </div>

        {/* Shuffle Button */}
        <button
          onClick={handleRandomShuffle}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#59263C] to-[#15151C] border border-[#C6A66B]/40 hover:border-[#C6A66B] text-xs font-bold text-[#FFF5EA] transition-all hover:scale-102 cursor-pointer shadow-lg shadow-[#59263C]/20"
        >
          <Shuffle className="w-3.5 h-3.5 text-[#C6A66B]" />
          <span>Random Sher Suno</span>
        </button>
      </div>

      {/* Spotlight Sher Box */}
      {spotlightSher && (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1C1724] via-[#121118] to-[#0B0B0F] border border-[#C6A66B]/40 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#59263C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C6A66B] bg-[#59263C]/40 px-2.5 py-1 rounded-full border border-[#C6A66B]/30 font-bold">
                ★ Aaj Ka Chuninda Sher ({spotlightSher.mood})
              </span>
              <span className="text-xs text-zinc-400 font-serif italic">
                Shayar: {spotlightSher.poetName}
              </span>
            </div>

            <div className="py-2 text-center space-y-2">
              <p className="text-lg sm:text-2xl font-serif text-[#FFF5EA] leading-relaxed">
                "{spotlightSher.linesRoman[0]}"
              </p>
              <p className="text-lg sm:text-2xl font-serif text-[#C6A66B] leading-relaxed">
                "{spotlightSher.linesRoman[1]}"
              </p>
            </div>

            <p className="text-xs text-center text-zinc-400 max-w-2xl mx-auto italic">
              Maani: {spotlightSher.hinglishMeaning}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() =>
                  onOpenCardDesigner(
                    `${spotlightSher.linesRoman[0]}\n${spotlightSher.linesRoman[1]}`,
                    spotlightSher.poetName
                  )
                }
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C6A66B] hover:bg-[#D4B87D] text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Sher Card Designer Me Kholein</span>
              </button>

              <button
                onClick={() => handleSpeakSher(spotlightSher)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#15151C] hover:bg-[#201d29] border border-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>{speakingId === spotlightSher.id ? 'Bol Raha Hai...' : 'Awaaz Suno'}</span>
              </button>

              <button
                onClick={() => handleCopy(spotlightSher)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#15151C] hover:bg-[#201d29] border border-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              >
                {copiedId === spotlightSher.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#C6A66B]" />
                )}
                <span>{copiedId === spotlightSher.id ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Search Bar + Poet Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Shayari, shayar, alfaz ya mood search karein (e.g. ghalib, ishq, hawa)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#15151C] border border-zinc-800 focus:border-[#C6A66B] text-xs text-[#FFF5EA] placeholder-zinc-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <select
              value={selectedPoetFilter}
              onChange={(e) => setSelectedPoetFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#15151C] border border-zinc-800 focus:border-[#C6A66B] text-xs text-[#FFF5EA] focus:outline-none cursor-pointer appearance-none pr-8"
            >
              {uniquePoets.map((poet) => (
                <option key={poet} value={poet} className="bg-[#15151C] text-white">
                  Shayar: {poet}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Mood Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {moodsList.map((mood) => {
            const isSelected = selectedMood === mood;
            const count =
              mood === 'Sabhi'
                ? SHAYARI_LIBRARY_DATA.length
                : SHAYARI_LIBRARY_DATA.filter((s) => s.mood === mood).length;

            return (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#59263C] to-[#15151C] border-[#C6A66B] text-[#FFF5EA] shadow-md shadow-[#59263C]/30'
                    : 'bg-[#15151C]/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span>{mood}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-[#C6A66B]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shayari Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShayaris.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-zinc-600 opacity-50" />
            <div className="text-sm font-semibold text-zinc-400">
              Koi Sher Nahi Mila
            </div>
            <p className="text-xs text-zinc-500">
              Search query badal kar dekhein ya "Sabhi" mood chunein.
            </p>
          </div>
        ) : (
          filteredShayaris.map((item) => {
            const isWordsExpanded = expandedWordsId === item.id;
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl p-5 bg-[#15151C]/90 border border-zinc-800 hover:border-[#C6A66B]/50 transition-all duration-300 flex flex-col justify-between gap-4 shadow-lg hover:shadow-[#59263C]/10"
              >
                {/* Header: Mood Badge & Poet */}
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#59263C]/40 text-[#C6A66B] border border-[#C6A66B]/30">
                      {item.mood}
                    </span>
                    {item.subMood && (
                      <span className="text-[10px] text-zinc-500 font-serif italic">
                        · {item.subMood}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-serif font-bold text-[#F2E9DC] group-hover:text-[#C6A66B] transition-colors">
                    {item.poetName}
                  </span>
                </div>

                {/* Couplet Text */}
                <div className="space-y-1.5 py-1">
                  <p className="text-sm sm:text-base font-serif text-[#FFF5EA] leading-relaxed">
                    {item.linesRoman[0]}
                  </p>
                  <p className="text-sm sm:text-base font-serif text-[#C6A66B] leading-relaxed">
                    {item.linesRoman[1]}
                  </p>
                </div>

                {/* Hinglish Explanation */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
                  <span className="font-semibold text-zinc-300">Maani: </span>
                  {item.hinglishMeaning}
                </div>

                {/* Difficult Words Toggle if available */}
                {item.difficultWords && item.difficultWords.length > 0 && (
                  <div>
                    <button
                      onClick={() =>
                        setExpandedWordsId(isWordsExpanded ? null : item.id)
                      }
                      className="text-[11px] text-[#C6A66B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3 h-3" />
                      <span>
                        {isWordsExpanded
                          ? 'Alfaaz Maani Chhupayein'
                          : `Alfaaz Maani Dekhein (${item.difficultWords.length})`}
                      </span>
                    </button>

                    {isWordsExpanded && (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 space-y-1 text-[11px]">
                        {item.difficultWords.map((dw, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-[#FFF5EA] font-serif">
                              {dw.word}:
                            </span>
                            <span className="text-zinc-400">{dw.meaning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Action Buttons */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleSpeakSher(item)}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer"
                    title="Pronounce & Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(item)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#C6A66B]" />
                      )}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() =>
                        onOpenCardDesigner(
                          `${item.linesRoman[0]}\n${item.linesRoman[1]}`,
                          item.poetName
                        )
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#59263C]/30 hover:bg-[#59263C]/50 border border-[#C6A66B]/40 text-[#C6A66B] text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Palette className="w-3 h-3" />
                      <span>Card Banayein</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
