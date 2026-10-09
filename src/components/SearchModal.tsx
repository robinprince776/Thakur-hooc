import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Cpu, Terminal, Clock, ArrowRight, Layers } from 'lucide-react';
import { C_PROGRAMS } from '../data/cPrograms';
import { FUNDAMENTAL_TOPICS } from '../data/computerFundamentals';
import { ActiveTab } from './Navbar';
import { RecentSearchItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, prefill?: any) => void;
  recentSearches: RecentSearchItem[];
  onAddRecentSearch: (query: string, type: 'logic' | 'c-program' | 'fundamentals', targetId?: string) => void;
  onClearRecentSearches: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  recentSearches,
  onAddRecentSearch,
  onClearRecentSearches
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const logicKeywords = [
    { name: 'Decimal to Binary', type: 'dec-to-bin', desc: 'Convert decimal base 10 to binary base 2' },
    { name: 'Binary to Decimal', type: 'bin-to-dec', desc: 'Positional powers of 2 calculation' },
    { name: 'Decimal to Hexadecimal', type: 'dec-to-hex', desc: 'Convert decimal to Hex (0-9, A-F)' },
    { name: 'Binary to Octal (Group by 3)', type: 'bin-to-oct', desc: '3-bit grouping method' },
    { name: 'Binary to Hexadecimal (Group by 4)', type: 'bin-to-hex', desc: '4-bit nibble grouping' },
    { name: "1's Complement & 2's Complement", type: 'complements', desc: 'Invert bits & add 1 rule' },
    { name: 'Binary Addition (+)', type: 'bin-add', desc: 'Bitwise sum with carry propagation' },
    { name: 'Binary Subtraction (-)', type: 'bin-sub', desc: "2's complement & direct subtraction" },
    { name: 'Binary Multiplication (×)', type: 'bin-mul', desc: 'Step-by-step partial products & binary addition' },
    { name: 'Binary Division (÷)', type: 'bin-div', desc: 'Binary long division with quotient and remainder' },
    { name: 'Octal Arithmetic (+, -, ×, ÷)', type: 'oct-arithmetic', desc: 'Base 8 addition, subtraction, multiplication & division' },
    { name: 'Hexadecimal Arithmetic (+, -, ×, ÷)', type: 'hex-arithmetic', desc: 'Base 16 addition, subtraction, multiplication & division' },
    { name: 'Universal Base Calculator (+, -, ×, ÷)', type: 'base-arithmetic', desc: 'Arithmetic in any base (2, 8, 10, 16)' },
    { name: 'Logic Gates (AND, OR, NOT, NAND, NOR, XOR)', type: 'logic-gates', desc: 'Truth table & Boolean expressions' },
    { name: 'K-Map 2 & 3 Variable Simplification', type: 'kmap', desc: 'Karnaugh Map minterm grid SOP' }
  ];

  const q = query.toLowerCase().trim();

  const matchingLogic = logicKeywords.filter(
    (l) => !q || l.name.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q)
  );

  const matchingPrograms = C_PROGRAMS.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  ).slice(0, 8);

  const matchingFundamentals = FUNDAMENTAL_TOPICS.filter(
    (f) =>
      !q ||
      f.title.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q) ||
      f.importantTags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logic converters, C programs, formulas..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* Recent Searches */}
          {!q && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Searches
                </span>
                <button
                  onClick={onClearRecentSearches}
                  className="hover:text-slate-600 lowercase font-medium text-[11px]"
                >
                  clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (r.type === 'logic') {
                        onNavigate('logic-solver', { type: r.targetId });
                      } else {
                        onNavigate('c-generator', { cProgramId: r.targetId });
                      }
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-750 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="font-medium">{r.query}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{r.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Logic Solvers Category */}
          {matchingLogic.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>Logic & Number Conversions</span>
              </div>
              <div className="space-y-1">
                {matchingLogic.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onAddRecentSearch(item.name, 'logic', item.type);
                      onNavigate('logic-solver', { type: item.type });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors group"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* C Programs Category */}
          {matchingPrograms.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-500" />
                <span>C Programs ({matchingPrograms.length})</span>
              </div>
              <div className="space-y-1">
                {matchingPrograms.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onAddRecentSearch(p.title, 'c-program', p.id);
                      onNavigate('c-generator', { cProgramId: p.id });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-purple-50/70 dark:hover:bg-purple-950/40 transition-colors group"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {p.category} · {p.difficulty}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fundamental of Computer Category */}
          {matchingFundamentals.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                <span>Fundamental Notes ({matchingFundamentals.length})</span>
              </div>
              <div className="space-y-1">
                {matchingFundamentals.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onAddRecentSearch(f.title, 'fundamentals', f.id);
                      onNavigate('fundamentals');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 transition-colors group"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {f.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {f.unit}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingLogic.length === 0 && matchingPrograms.length === 0 && matchingFundamentals.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              No results found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press ESC to exit</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">BCA Verse by Prince Thakur</span>
        </div>
      </div>
    </div>
  );
};
