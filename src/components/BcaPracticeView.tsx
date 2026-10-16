import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { BCA_PRACTICE_QUESTIONS, PracticeQuestion } from '../data/bcaPracticeData';

interface BcaPracticeViewProps {
  onSaveBookmark?: (item: any) => void;
  isBookmarked?: (id: string) => boolean;
}

export const BcaPracticeView: React.FC<BcaPracticeViewProps> = ({
  onSaveBookmark,
  isBookmarked
}) => {
  const [selectedModule, setSelectedModule] = useState<'all' | 'c-programming' | 'digital-electronics'>('all');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('cp-q1');

  const filteredQuestions = useMemo(() => {
    return BCA_PRACTICE_QUESTIONS.filter((q) => {
      const matchMod = selectedModule === 'all' || q.module === selectedModule;
      const matchUnit = selectedUnit === 'all' || q.unit === selectedUnit;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;

      let matchSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        matchSearch =
          q.title.toLowerCase().includes(query) ||
          q.problemStatement.toLowerCase().includes(query) ||
          q.solution.toLowerCase().includes(query) ||
          q.tags.some((t) => t.toLowerCase().includes(query));
      }

      return matchMod && matchUnit && matchDiff && matchCat && matchSearch;
    });
  }, [selectedModule, selectedUnit, selectedDifficulty, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BCA Exam &amp; Viva Voce Practice Bank</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          150+ Solved Practice Problems &amp; Viva Questions
        </h1>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Master <strong>C Programming viva</strong> and <strong>Digital Electronics numericals</strong> step-by-step. Filter by unit, difficulty, and problem type with detailed Hinglish hints and model answers.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by topic (e.g. 2's complement, pointer, K-Map, full adder, call by reference)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Module Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Subject:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'c-programming', label: '💻 C Programming' },
              { id: 'digital-electronics', label: '⚡ Digital Electronics' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedModule === m.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Unit Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Unit:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 1, label: 'Unit I' },
              { id: 2, label: 'Unit II' },
              { id: 3, label: 'Unit III' },
              { id: 4, label: 'Unit IV' }
            ].map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedUnit === u.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Level:</span>
            {['all', 'Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedDifficulty === d
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {d === 'all' ? 'All Levels' : d}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>Showing <strong>{filteredQuestions.length}</strong> practice problems</span>
          <span>Click on any question to view step-by-step solution</span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
            Koi question match nahi hua. Filters reset karke dekhein.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const bookmarked = isBookmarked ? isBookmarked(`prac-${q.id}`) : false;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900 border-emerald-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400">
                        {q.module === 'c-programming' ? 'C Programming' : 'Digital Electronics'} · Unit {q.unit}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 text-slate-400 border border-slate-800">
                        {q.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {q.title}
                    </h3>

                    <p className="text-xs text-slate-300 font-normal leading-relaxed">
                      {q.problemStatement}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onSaveBookmark && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveBookmark({
                            type: 'fundamentals',
                            title: q.title,
                            subtitle: `${q.module} Unit ${q.unit}`,
                            data: q
                          });
                        }}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          bookmarked
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    )}

                    <div className="p-2 rounded-xl text-slate-400 bg-slate-800">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-slate-800/80 space-y-4">
                    {/* Solution */}
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Step-by-Step Solution &amp; Answer:</span>
                      </h4>
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                        {q.solution}
                      </div>
                    </div>

                    {/* Code or Math preview if present */}
                    {q.codeOrMath && (
                      <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                        {q.codeOrMath}
                      </pre>
                    )}

                    {/* Hinglish Exam Tip */}
                    <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300">Exam &amp; Viva Tip: </strong>
                        {q.hinglishTip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
