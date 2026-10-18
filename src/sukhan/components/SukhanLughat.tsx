import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Copy,
  Check,
  Tag,
  PenTool,
  Bookmark,
  Share2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { LUGHAT_DATA } from '../data/lughatData';
import { LughatWord } from '../types';

interface SukhanLughatProps {
  onInsertIntoStudio?: (word: string) => void;
  onOpenCardDesigner?: (text: string, attribution: string) => void;
}

export const SukhanLughat: React.FC<SukhanLughatProps> = ({
  onInsertIntoStudio,
  onOpenCardDesigner
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('All');
  const [copiedWordId, setCopiedWordId] = useState<string | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sukhan_bookmarked_words');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = ['All', 'Ishq', 'Gham', 'Falsafa', 'Qudrat', 'Mehfil', 'Tasawwuf'];
  const origins = ['All', 'Urdu / Farsi', 'Arabi', 'Hindi / Sanskrit', 'Punjabi'];

  const toggleBookmark = (id: string) => {
    setBookmarkedWords((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('sukhan_bookmarked_words', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleCopyWord = (word: LughatWord) => {
    const textToCopy = `✨ ${word.word} (${word.pronunciation})\nOrigin: ${word.origin}\nMeaning: ${word.hinglishMeaning}\n\nSher:\n"${word.exampleSher.lines[0]}\n${word.exampleSher.lines[1]}"\n— ${word.exampleSher.poet}\n\n(Lughat-e-Sukhan · By Prince Thakur)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedWordId(word.id);
    setTimeout(() => setCopiedWordId(null), 2000);
  };

  const filteredWords = useMemo(() => {
    return LUGHAT_DATA.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hinglishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.synonyms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesOrigin = selectedOrigin === 'All' || item.origin === selectedOrigin;

      return matchesSearch && matchesCategory && matchesOrigin;
    });
  }, [searchQuery, selectedCategory, selectedOrigin]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-6 select-none animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#15151C] via-[#0B0B0F] to-[#201018] border border-[#C6A66B]/30 shadow-2xl overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B0B0F] border border-[#C6A66B]/40 text-xs font-semibold text-[#C6A66B]">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lughat-e-Sukhan</span>
              <span className="w-1 h-1 rounded-full bg-[#C6A66B]" />
              <span className="text-[10px] text-zinc-400">Adabi Alfaaz & Tashreeh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#FFF5EA] tracking-wide">
              Shayari Ki Khoobsurat <span className="italic text-[#C6A66B]">Dictionary</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Urdu, Farsi, Hindi aur Punjabi ke anmol aur roohani lafzon ke maani, unka talaffuz (pronunciation) aur mashhoor sheron me unka istemaal.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0B0B0F]/80 border border-[#C6A66B]/20 rounded-2xl p-4">
            <div className="text-center px-2">
              <span className="block text-2xl font-serif text-[#C6A66B] font-bold">
                {LUGHAT_DATA.length}+
              </span>
              <span className="text-[11px] text-zinc-400">Selected Alfaaz</span>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center px-2">
              <span className="block text-2xl font-serif text-[#E6C280] font-bold">
                {bookmarkedWords.length}
              </span>
              <span className="text-[11px] text-zinc-400">Saved Words</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search word (e.g., Visaal, Qurbat, Furqat, Tafakkur)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#15151C] border border-[#C6A66B]/20 focus:border-[#C6A66B] text-xs sm:text-sm text-[#FFF5EA] placeholder-zinc-500 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C6A66B] text-slate-950 shadow-md shadow-[#C6A66B]/20 font-bold'
                  : 'bg-[#15151C] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Origin Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs text-zinc-400">
        <span className="text-[11px] uppercase tracking-wider text-zinc-500">Origin:</span>
        {origins.map((origin) => (
          <button
            key={origin}
            onClick={() => setSelectedOrigin(origin)}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedOrigin === origin
                ? 'bg-[#59263C] text-white border border-[#C6A66B]/40 font-bold'
                : 'bg-[#0B0B0F] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {origin}
          </button>
        ))}
      </div>

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word) => {
          const isBookmarked = bookmarkedWords.includes(word.id);
          const isCopied = copiedWordId === word.id;

          return (
            <div
              key={word.id}
              className="group relative rounded-2xl p-5 bg-[#121218] border border-[#C6A66B]/20 hover:border-[#C6A66B]/60 shadow-lg hover:shadow-xl hover:shadow-[#C6A66B]/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Word Title & Action Icons */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-serif text-[#FFF5EA] font-bold tracking-wide">
                        {word.word}
                      </h3>
                      <span className="text-xs text-[#C6A66B] italic font-mono">
                        ({word.pronunciation})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#261523] text-[#E6C280] border border-[#C6A66B]/20">
                        {word.origin}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1C1625] text-zinc-300 border border-zinc-800">
                        {word.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleBookmark(word.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-[#59263C] text-[#C6A66B]'
                          : 'bg-[#181822] text-zinc-400 hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Word'}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleCopyWord(word)}
                      className="p-2 rounded-xl bg-[#181822] hover:bg-[#20202e] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Word & Meaning"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Meanings */}
                <div className="space-y-1.5 my-3 text-xs sm:text-sm">
                  <p className="text-zinc-200 leading-snug">
                    <strong className="text-[#C6A66B] font-semibold">Hinglish: </strong>
                    {word.hinglishMeaning}
                  </p>
                  <p className="text-zinc-400 text-xs">
                    <strong className="text-zinc-300 font-semibold">English: </strong>
                    {word.englishMeaning}
                  </p>
                </div>

                {/* Synonyms */}
                {word.synonyms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                      Ham-maani:
                    </span>
                    {word.synonyms.map((syn) => (
                      <span
                        key={syn}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-[#181822] text-zinc-300 border border-zinc-800/80"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                )}

                {/* Example Couplet in Quotes */}
                <div className="rounded-xl p-3.5 bg-[#0B0B0F] border border-[#C6A66B]/15 relative">
                  <div className="text-xs sm:text-sm font-serif text-[#FFF5EA] italic space-y-0.5 leading-relaxed">
                    <p>"{word.exampleSher.lines[0]}</p>
                    <p>{word.exampleSher.lines[1]}"</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#C6A66B] mt-2 pt-2 border-t border-zinc-800/80">
                    <span>— {word.exampleSher.poet}</span>
                    {onOpenCardDesigner && (
                      <button
                        onClick={() =>
                          onOpenCardDesigner(
                            `${word.exampleSher.lines[0]}\n${word.exampleSher.lines[1]}`,
                            word.exampleSher.poet
                          )
                        }
                        className="hover:underline text-[10px] text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer"
                      >
                        Create Card ➔
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action: Insert into Studio */}
              {onInsertIntoStudio && (
                <div className="mt-3 pt-2 flex items-center justify-end">
                  <button
                    onClick={() => onInsertIntoStudio(word.word)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#C6A66B] hover:text-[#FFF5EA] transition-colors cursor-pointer"
                  >
                    <PenTool className="w-3 h-3" />
                    <span>Writing Studio me istemaal karein</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-12 rounded-3xl bg-[#15151C] border border-zinc-800">
          <p className="text-sm text-zinc-400 font-serif">
            Koi lafz nahi mila. Search query badal kar dekhein.
          </p>
        </div>
      )}
    </div>
  );
};
