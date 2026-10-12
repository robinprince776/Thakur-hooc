import React, { useState } from 'react';
import {
  Layers,
  BookOpen,
  Music,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Feather
} from 'lucide-react';
import { POETIC_TERMS, PUNJABI_SONG_RESOURCES, METAPHOR_SUGGESTIONS, RHYME_DICTIONARY } from '../data/resourcesData';

export const SukhanResources: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'terms' | 'punjabi' | 'metaphors' | 'rhymes'>('terms');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const handleCopy = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-6 select-none">
      {/* Top Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15151C] border border-[#C6A66B]/30 text-xs font-semibold text-[#C6A66B]">
          <Layers className="w-3.5 h-3.5" />
          <span>Writing Resources &amp; Adab Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#F2E9DC] tracking-wide">
          Shayari Aur Geet Ke Niyam
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Radif, Qafiya, Beher, aur Punjabi geet likhne ke frameworks aasan Hinglish me.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center justify-center gap-2 bg-[#15151C] p-1.5 rounded-2xl border border-zinc-800 max-w-md mx-auto text-xs">
        <button
          onClick={() => setActiveSection('terms')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeSection === 'terms'
              ? 'bg-[#C6A66B] text-slate-950 font-bold shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Poetic Terms
        </button>

        <button
          onClick={() => setActiveSection('punjabi')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeSection === 'punjabi'
              ? 'bg-[#C6A66B] text-slate-950 font-bold shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Punjabi Geet
        </button>

        <button
          onClick={() => setActiveSection('metaphors')}
          className={`flex-1 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            activeSection === 'metaphors'
              ? 'bg-[#C6A66B] text-slate-950 font-bold shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Tashbeeh Bank
        </button>
      </div>

      {/* SECTION 1: Poetic Terms */}
      {activeSection === 'terms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POETIC_TERMS.map((t, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#15151C]/80 border border-[#C6A66B]/25 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-[#FFF5EA]">
                    {t.term}{' '}
                    <span className="text-xs font-mono text-zinc-500 font-normal">
                      ({t.pronunciation})
                    </span>
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[#C6A66B] px-2 py-0.5 rounded bg-[#0B0B0F] border border-zinc-800">
                    {t.shortDesc}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {t.hinglishExplanation}
                </p>

                {/* Example Box */}
                <div className="p-3 rounded-xl bg-[#0B0B0F]/90 border border-zinc-800/80 text-center space-y-1">
                  <p className="font-serif italic text-xs text-[#F2E9DC]">
                    "{t.example[0]}"
                    <br />
                    "{t.example[1]}"
                  </p>
                  <p className="text-[10px] text-[#C6A66B] pt-1">
                    {t.exampleBreakdown}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Punjabi Songwriting */}
      {activeSection === 'punjabi' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#15151C]/90 border border-[#C6A66B]/30 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#C6A66B] uppercase tracking-wider font-mono">
              <Music className="w-4 h-4" />
              <span>Punjabi Song Structure Template</span>
            </div>

            <div className="space-y-3">
              {PUNJABI_SONG_RESOURCES.structures[0].sections.map((sec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-xs space-y-1"
                >
                  <div className="font-serif font-bold text-[#FFF5EA]">{sec.label}</div>
                  <p className="text-zinc-400 text-[11px]">{sec.hint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Punjabi Vocabulary Bank */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C6A66B]">
              Natural Punjabi Emotional Words (Vocabulary Bank):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {PUNJABI_SONG_RESOURCES.vocabulary.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#15151C] border border-zinc-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-serif font-bold text-[#F2E9DC]">{v.word}</div>
                    <div className="text-[10px] text-zinc-400">{v.meaning}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(v.word)}
                    className="text-zinc-500 hover:text-[#C6A66B] p-1 cursor-pointer"
                    title="Copy word"
                  >
                    {copiedWord === v.word ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Metaphors Bank */}
      {activeSection === 'metaphors' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {METAPHOR_SUGGESTIONS.map((m, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#15151C]/80 border border-[#C6A66B]/25 space-y-2"
              >
                <div className="text-sm font-serif font-bold text-[#C6A66B]">{m.theme}</div>
                <div className="p-2.5 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-xs font-serif italic text-[#FFF5EA]">
                  "{m.imagery}"
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                  {m.hinglishExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
