import React, { useState, useEffect, useMemo } from 'react';
import {
  PenTool,
  Sparkles,
  Save,
  BookOpen,
  Volume2,
  Maximize2,
  Minimize2,
  Share2,
  Copy,
  Check,
  Palette,
  RotateCcw,
  Clock,
  Music,
  HelpCircle,
  FileText,
  Search,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { PoetryDraft, PoetryFormat } from '../types';
import { RHYME_DICTIONARY, PUNJABI_SONG_RESOURCES, METAPHOR_SUGGESTIONS } from '../data/resourcesData';

interface SukhanWritingStudioProps {
  initialDraft?: PoetryDraft | null;
  initialMood?: string;
  initialPrompt?: string;
  onSaveDraftToVault: (draft: PoetryDraft) => void;
  onOpenCardDesigner: (text: string, attribution: string) => void;
}

export const SukhanWritingStudio: React.FC<SukhanWritingStudioProps> = ({
  initialDraft,
  initialMood = 'Ishq',
  initialPrompt = '',
  onSaveDraftToVault,
  onOpenCardDesigner
}) => {
  const [title, setTitle] = useState(initialDraft?.title || 'Bina Naam Ki Ghazal');
  const [content, setContent] = useState(
    initialDraft?.content || initialPrompt || ''
  );
  const [format, setFormat] = useState<PoetryFormat>(initialDraft?.format || 'Ghazal');
  const [language, setLanguage] = useState<'Urdu' | 'Hindi' | 'Punjabi'>(
    initialDraft?.language || 'Urdu'
  );
  const [mood, setMood] = useState(initialDraft?.mood || initialMood);
  const [radif, setRadif] = useState(initialDraft?.radif || '');
  const [qafiya, setQafiya] = useState(initialDraft?.qafiya || '');

  // UI Modes
  const [isZenMode, setIsZenMode] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState<'rhymes' | 'metaphors' | 'ai_assist' | 'song_templates'>('rhymes');
  const [rhymeQuery, setRhymeQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI Assistant States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiExplanation, setAiExplanation] = useState<string>('');

  // Update when initial draft changes
  useEffect(() => {
    if (initialDraft) {
      setTitle(initialDraft.title);
      setContent(initialDraft.content);
      setFormat(initialDraft.format);
      setLanguage(initialDraft.language);
      setMood(initialDraft.mood);
      setRadif(initialDraft.radif || '');
      setQafiya(initialDraft.qafiya || '');
    }
  }, [initialDraft]);

  // Handle Save
  const handleSave = () => {
    const draft: PoetryDraft = {
      id: initialDraft?.id || `draft_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim() || 'Untitled Kalam',
      content,
      format,
      language,
      mood,
      radif,
      qafiya,
      folder: format === 'Ghazal' ? 'Ghazlen' : format.includes('Song') ? 'Geet' : 'Mukhtasar Sher',
      isFavorite: initialDraft?.isFavorite || false,
      createdAt: initialDraft?.createdAt || Date.now(),
      updatedAt: Date.now(),
      history: initialDraft ? [...initialDraft.history, { timestamp: Date.now(), content }] : []
    };
    onSaveDraftToVault(draft);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // AI Assistant API call with fallback
  const handleRequestAi = async (type: 'suggest_line' | 'rhyme' | 'metaphor' | 'feedback') => {
    setAiLoading(true);
    setAiSuggestions([]);
    setAiExplanation('');

    try {
      const res = await fetch('/api/sukhan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          prompt: title,
          context: content,
          language,
          mood
        })
      });
      const data = await res.json();
      if (data && data.suggestions) {
        setAiSuggestions(data.suggestions);
        setAiExplanation(data.explanation || '');
      }
    } catch (e) {
      console.warn('AI call error, using local suggestions:', e);
      setAiSuggestions([
        'Dil ne har zakhm ko seene se lagana seekha.',
        'Aap ki yaad me har raat guzarna seekha.',
        'Hum ne toote hue aaine me jeena seekha.'
      ]);
      setAiExplanation('Local rule-based generator se misra sujhaav diya gaya hai.');
    } finally {
      setAiLoading(false);
    }
  };

  // Filter rhymes from dictionary
  const filteredRhymes = useMemo(() => {
    if (!rhymeQuery.trim()) {
      return RHYME_DICTIONARY['ana'] || [];
    }
    const q = rhymeQuery.toLowerCase().trim();
    const matches: string[] = [];
    Object.entries(RHYME_DICTIONARY).forEach(([key, words]) => {
      if (key.includes(q) || q.includes(key)) {
        matches.push(...words);
      } else {
        words.forEach((w) => {
          if (w.toLowerCase().includes(q)) matches.push(w);
        });
      }
    });
    return Array.from(new Set(matches)).slice(0, 16);
  }, [rhymeQuery]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n\n${content}\n\n— Made with SUKHAN · Prince Thakur`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formats: PoetryFormat[] = [
    'Shayari',
    'Ghazal',
    'Nazm',
    'Punjabi Song',
    'Hindi Song',
    'Hooks & Chorus',
    'Couplet',
    'Free Verse'
  ];

  const moods = [
    'Ishq',
    'Judai',
    'Tanhai',
    'Yaadein',
    'Dard',
    'Umeed',
    'Gussa',
    'Zindagi',
    'Khuddaari',
    'Falsafa'
  ];

  return (
    <div
      className={`transition-all duration-300 select-none ${
        isZenMode
          ? 'fixed inset-0 z-50 bg-[#0B0B0F] p-6 sm:p-12 overflow-y-auto'
          : 'max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6'
      }`}
    >
      {/* Top Studio Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C6A66B]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#C6A66B]">
              Writing Studio
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
            <span className="text-xs text-zinc-400">Distraction-Free Poetic Suite</span>
          </div>
          <h1 className="text-2xl font-serif text-[#F2E9DC] tracking-wide mt-0.5">
            Apni Shayari &amp; Geet Likhein
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className="p-2 rounded-xl bg-[#15151C] border border-zinc-800 text-zinc-400 hover:text-[#C6A66B] transition-colors cursor-pointer"
            title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Fullscreen'}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-[#15151C] border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Kalam"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onOpenCardDesigner(content, title)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#15151C] border border-[#C6A66B]/40 text-[#F2E9DC] hover:border-[#C6A66B] text-xs font-semibold transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span className="hidden sm:inline">Design Card</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#8C6F38] text-slate-950 font-bold text-xs shadow-lg shadow-[#C6A66B]/20 hover:brightness-110 transition-all cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Draft Saved!' : 'Save in Diary'}</span>
          </button>
        </div>
      </div>

      {/* Format & Mood Selectors Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#15151C]/80 border border-zinc-800/80 p-3 rounded-2xl text-xs">
        {/* Format Pill Picker */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-semibold text-zinc-500">Format:</span>
          {formats.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                format === f
                  ? 'bg-[#C6A66B] text-slate-950 font-bold'
                  : 'bg-[#0B0B0F] border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Language & Mood Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-[#0B0B0F] border border-zinc-800 rounded-xl px-2.5 py-1 text-xs text-[#C6A66B] focus:outline-none"
          >
            <option value="Urdu">Urdu (Roman)</option>
            <option value="Hindi">Hindi (Roman)</option>
            <option value="Punjabi">Punjabi (Roman)</option>
          </select>

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-[#0B0B0F] border border-zinc-800 rounded-xl px-2.5 py-1 text-xs text-[#FFF5EA] focus:outline-none"
          >
            {moods.map((m) => (
              <option key={m} value={m}>
                Mood: {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Grid: Editor (7 Cols) + Poetic Assistant (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Distraction-Free Editor */}
        <div className="lg:col-span-7 bg-[#15151C]/90 border border-[#C6A66B]/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kalam Ka Unwaan (Title)..."
            className="w-full text-xl sm:text-2xl font-serif text-[#FFF5EA] bg-transparent border-none focus:outline-none placeholder-zinc-600 font-bold tracking-wide"
          />

          {/* Radif & Qafiya tags (if Ghazal) */}
          {format === 'Ghazal' && (
            <div className="flex items-center gap-3 text-xs border-y border-zinc-800/80 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-mono">Qafiya:</span>
                <input
                  type="text"
                  value={qafiya}
                  onChange={(e) => setQafiya(e.target.value)}
                  placeholder="e.g. yaar, intezaar"
                  className="bg-[#0B0B0F] border border-zinc-800 rounded-lg px-2 py-0.5 text-xs text-[#C6A66B] focus:outline-none w-32"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-mono">Radif:</span>
                <input
                  type="text"
                  value={radif}
                  onChange={(e) => setRadif(e.target.value)}
                  placeholder="e.g. hota"
                  className="bg-[#0B0B0F] border border-zinc-800 rounded-lg px-2 py-0.5 text-xs text-[#C6A66B] focus:outline-none w-32"
                />
              </div>
            </div>
          )}

          {/* Main Poetry Textarea */}
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              language === 'Punjabi'
                ? 'Akhiyan udeek diyan raatan nu sajjna,\nDil nu na aave chain...\n\n(Apna geet ya boliyan yahan likhein...)'
                : 'Pehla Misra yahan likhein...\nDusra Misra yahan likhein...\n\n(Roman English letters me apni shayari likhein...)'
            }
            className="w-full bg-[#0B0B0F]/90 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 font-serif text-base sm:text-lg text-[#F2E9DC] placeholder-zinc-700 focus:outline-none focus:border-[#C6A66B]/50 leading-loose resize-y min-h-[300px]"
          />

          {/* Bottom Editor Stats */}
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[#C6A66B] font-mono">
                {content.split('\n').filter(Boolean).length} Misre (Lines)
              </span>
              <span>·</span>
              <span>{content.trim() ? content.trim().split(/\s+/).length : 0} Words</span>
            </div>

            <div className="text-[11px] text-zinc-400">
              <span>Auto-saved in memory</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Writing Assistant & Tools (5 Cols) */}
        <div className="lg:col-span-5 bg-[#15151C]/90 border border-[#C6A66B]/30 rounded-3xl p-5 space-y-4 shadow-xl">
          {/* Assistant Tool Tabs */}
          <div className="flex items-center gap-1 bg-[#0B0B0F] p-1 rounded-2xl border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveToolTab('rhymes')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeToolTab === 'rhymes'
                  ? 'bg-[#C6A66B] text-slate-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Qafiya / Rhymes
            </button>

            <button
              onClick={() => setActiveToolTab('metaphors')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeToolTab === 'metaphors'
                  ? 'bg-[#C6A66B] text-slate-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tashbeeh / Metaphor
            </button>

            <button
              onClick={() => setActiveToolTab('ai_assist')}
              className={`flex-1 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeToolTab === 'ai_assist'
                  ? 'bg-gradient-to-r from-[#59263C] to-[#8C6F38] text-[#FFF5EA] font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              AI Assistant
            </button>
          </div>

          {/* TAB 1: Rhyme Dictionary */}
          {activeToolTab === 'rhymes' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={rhymeQuery}
                  onChange={(e) => setRhymeQuery(e.target.value)}
                  placeholder="e.g. ana, ar, dil, raat..."
                  className="w-full bg-[#0B0B0F] border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#F2E9DC] focus:outline-none focus:border-[#C6A66B]"
                />
              </div>

              <div className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
                <span>Matching Qafiya (Ham-Qafiya Alfaaz):</span>
                <span className="font-mono text-zinc-500">{filteredRhymes.length} words</span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredRhymes.map((word: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setContent((prev) => `${prev} ${word}`)}
                    className="px-2.5 py-1 rounded-xl bg-[#0B0B0F] border border-zinc-800/80 hover:border-[#C6A66B] text-xs font-serif text-[#F2E9DC] hover:text-[#C6A66B] transition-colors cursor-pointer"
                    title="Click to insert word"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Metaphor & Imagery */}
          {activeToolTab === 'metaphors' && (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <div className="text-[11px] text-zinc-400">
                Lafzon me tasweer banane ke liye tashbeeh aur isti'ara:
              </div>
              {METAPHOR_SUGGESTIONS.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0B0B0F] border border-zinc-800 text-xs space-y-1"
                >
                  <div className="font-serif font-bold text-[#C6A66B]">{m.theme}</div>
                  <div className="text-[#F2E9DC] font-medium italic">{m.imagery}</div>
                  <p className="text-[11px] text-zinc-400">{m.hinglishExplanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: AI Assistant */}
          {activeToolTab === 'ai_assist' && (
            <div className="space-y-3">
              <div className="text-xs text-zinc-300">
                Sukhan AI se agla misra, feedback, ya behtar alfaaz mangwayein:
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleRequestAi('suggest_line')}
                  disabled={aiLoading}
                  className="p-2 rounded-xl bg-[#0B0B0F] border border-[#C6A66B]/30 hover:border-[#C6A66B] text-xs font-semibold text-[#F2E9DC] text-center transition-all cursor-pointer disabled:opacity-50"
                >
                  Agla Misra Maango
                </button>
                <button
                  onClick={() => handleRequestAi('feedback')}
                  disabled={aiLoading}
                  className="p-2 rounded-xl bg-[#0B0B0F] border border-[#C6A66B]/30 hover:border-[#C6A66B] text-xs font-semibold text-[#F2E9DC] text-center transition-all cursor-pointer disabled:opacity-50"
                >
                  Wazn &amp; Flow Check
                </button>
              </div>

              {/* AI output box */}
              {aiLoading ? (
                <div className="p-6 rounded-2xl bg-[#0B0B0F] border border-zinc-800 text-center text-xs text-zinc-400 space-y-2">
                  <Sparkles className="w-5 h-5 mx-auto text-[#C6A66B] animate-spin" />
                  <p>Sukhan AI alfazon ko taraash raha hai...</p>
                </div>
              ) : aiSuggestions.length > 0 ? (
                <div className="p-3.5 rounded-2xl bg-[#0B0B0F] border border-[#C6A66B]/30 space-y-2 text-xs">
                  <div className="font-bold text-[#C6A66B] flex items-center justify-between">
                    <span>Sukhan AI Sujhaav:</span>
                  </div>
                  <div className="space-y-1.5">
                    {aiSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => setContent((prev) => `${prev}\n${s}`)}
                        className="p-2 rounded-lg bg-[#15151C] hover:bg-[#1f1a23] border border-zinc-800 text-zinc-200 cursor-pointer text-xs font-serif italic"
                        title="Click to append to draft"
                      >
                        + "{s}"
                      </div>
                    ))}
                  </div>
                  {aiExplanation && (
                    <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800 italic">
                      {aiExplanation}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0B0B0F]/50 border border-zinc-800 text-center text-[11px] text-zinc-500">
                  Upar diye gaye buttons par tap karke instant poetic feedback ya line suggestions lein.
                </div>
              )}
            </div>
          )}

          {/* Punjabi Songwriting Quick Tip Card */}
          {language === 'Punjabi' && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/20 to-[#59263C]/20 border border-[#C6A66B]/30 text-xs space-y-1">
              <div className="font-bold text-[#C6A66B] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>Punjabi Songwriting Tip:</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Mukhde me seedhe jazbaat rakhein jaise: "Akhiyan, Vichhoda, Mahiya, Taare, Jind". Aisi rhythm chunein jo gaane me aasan ho.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
