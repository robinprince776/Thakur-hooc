import React, { useState } from 'react';
import { BookmarkItem } from '../types';
import { Bookmark, Cpu, Terminal, Trash2, ArrowRight, BookOpen, Clock, Layers } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (tab: ActiveTab, prefill?: any) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onRemoveBookmark,
  onClearAll,
  onNavigate
}) => {
  const [filterType, setFilterType] = useState<'all' | 'logic' | 'c-program' | 'fundamentals'>('all');

  const filtered = bookmarks.filter((b) => {
    if (filterType === 'all') return true;
    return b.type === filterType;
  });

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Saved Bookmarks &amp; Favorites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Quickly revisit your saved number system questions, favorite C programs, and fundamental notes.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            filterType === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All ({bookmarks.length})
        </button>
        <button
          onClick={() => setFilterType('logic')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            filterType === 'logic'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Logic Solvers ({bookmarks.filter((b) => b.type === 'logic').length})
        </button>
        <button
          onClick={() => setFilterType('c-program')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            filterType === 'c-program'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          C Programs ({bookmarks.filter((b) => b.type === 'c-program').length})
        </button>
        <button
          onClick={() => setFilterType('fundamentals')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
            filterType === 'fundamentals'
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Fundamentals ({bookmarks.filter((b) => b.type === 'fundamentals').length})
        </button>
      </div>

      {/* Bookmarks List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Koi bookmark save nahi kiya gaya
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Jab aap number solver, C program, ya fundamental notes padhein, bookmark icon par click karke use yahan save kar sakte hain!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isLogic = item.type === 'logic';
            const isFundamental = item.type === 'fundamentals';
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isLogic
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                        : isFundamental
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                        : 'bg-purple-50 dark:bg-purple-950 text-purple-600'
                    }`}
                  >
                    {isLogic ? (
                      <Cpu className="w-5 h-5" />
                    ) : isFundamental ? (
                      <Layers className="w-5 h-5" />
                    ) : (
                      <Terminal className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      if (isLogic) {
                        onNavigate('logic-solver', {
                          type: item.data?.type,
                          input: item.data?.input1
                        });
                      } else if (isFundamental) {
                        onNavigate('fundamentals');
                      } else {
                        onNavigate('c-generator', {
                          cProgramId: item.data?.id
                        });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onRemoveBookmark(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
