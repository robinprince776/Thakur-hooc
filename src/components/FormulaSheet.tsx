import React, { useState } from 'react';
import { FORMULA_SHEETS } from '../data/formulaSheet';
import { BookOpen, Search, Copy, Check, Sparkles } from 'lucide-react';

export const FormulaSheet: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredSections = FORMULA_SHEETS.map((sec) => {
    const q = search.toLowerCase().trim();
    if (activeSectionId !== 'all' && sec.id !== activeSectionId) {
      return { ...sec, items: [] };
    }
    if (!q) return sec;
    const matchedItems = sec.items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.formula.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q)
    );
    return { ...sec, items: matchedItems };
  }).filter((sec) => sec.items.length > 0);

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BCA Exam Cheat Sheet</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Formula & Syntax Reference Sheet
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Instant formulas for Number Systems, Complements, Boolean Algebra, and C Syntax rules.
        </p>
      </div>

      {/* Filter and Section Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-700 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search formulas (e.g. 2's complement, De Morgan, printf, operator precedence)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Section Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveSectionId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSectionId === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Formulas
          </button>
          {FORMULA_SHEETS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSectionId(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeSectionId === sec.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {sec.title.split(' ')[0]} {sec.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Sections List */}
      <div className="space-y-8">
        {filteredSections.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
            No formulas match "{search}".
          </div>
        ) : (
          filteredSections.map((sec) => (
            <div
              key={sec.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-700 space-y-4"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {sec.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {sec.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sec.items.map((item, idx) => {
                  const copyKey = `${sec.id}-${idx}`;
                  const isCopied = copiedIndex === copyKey;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => handleCopy(`${item.name}: ${item.formula}`, copyKey)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                          title="Copy formula"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs font-semibold text-slate-900 dark:text-white selection:bg-indigo-100">
                        {item.formula}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.explanation}
                      </p>

                      {item.example && (
                        <div className="pt-1 text-[11px] text-slate-500 font-mono">
                          Example: <span className="text-slate-700 dark:text-slate-300">{item.example}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
