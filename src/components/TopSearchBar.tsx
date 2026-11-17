import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Command,
  FileText,
  Layers,
  Search,
  Terminal,
  Wrench,
  X,
} from 'lucide-react';
import { NAVIGATOR_ITEMS, TechNavigatorItem } from './TechNavigatorModal';
import { ARSENAL_TOOLS } from '../arsenal/arsenalData';
import { C_PROGRAMS } from '../data/cPrograms';
import { FUNDAMENTAL_TOPICS } from '../data/computerFundamentals';
import { CurrentAppType } from './AppSwitcherModal';
import type { ActiveTab } from './Navbar';

export interface TopSearchBarProps {
  onSelectApp: (app: CurrentAppType) => void;
  onNavigateTab?: (tab: ActiveTab, prefill?: { cProgramId?: string; topicId?: string }) => void;
  onOpenFullSearch?: () => void;
  onOpenNavigator?: () => void;
  placeholder?: string;
  className?: string;
}

interface UnifiedSearchResult {
  id: string;
  title: string;
  subtitle: string;
  group: 'App' | 'Arsenal Tool' | 'C Program' | 'Notes';
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({
  onSelectApp,
  onNavigateTab,
  onOpenFullSearch,
  onOpenNavigator,
  placeholder = 'Search apps, tools, C programs, notes...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Listen for global Ctrl+K focus signal when top bar is active
  useEffect(() => {
    const handleFocusSignal = () => {
      inputRef.current?.focus();
      setIsFocused(true);
    };
    window.addEventListener('bca-focus-top-search', handleFocusSignal);
    return () => window.removeEventListener('bca-focus-top-search', handleFocusSignal);
  }, []);

  const results = useMemo<UnifiedSearchResult[]>(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return NAVIGATOR_ITEMS.slice(0, 6).map((item: TechNavigatorItem) => ({
        id: `nav-${item.id}`,
        title: item.title,
        subtitle: item.description,
        group: 'App',
        icon: item.icon || Layers,
        onSelect: () => {
          onSelectApp(item.appTarget);
          if (item.hashTarget && typeof window !== 'undefined') {
            window.location.hash = item.hashTarget;
          }
        },
      }));
    }

    const tokens = q.split(/\s+/).filter(Boolean);
    const matchesAll = (text: string) => tokens.every((t) => text.includes(t));

    const matchedApps: UnifiedSearchResult[] = NAVIGATOR_ITEMS.filter((item) => {
      const hay = `${item.title} ${item.description} ${item.category} ${item.keywords.join(' ')}`.toLowerCase();
      return matchesAll(hay);
    })
      .slice(0, 5)
      .map((item) => ({
        id: `nav-${item.id}`,
        title: item.title,
        subtitle: item.description,
        group: 'App',
        icon: item.icon || Layers,
        onSelect: () => {
          onSelectApp(item.appTarget);
          if (item.hashTarget && typeof window !== 'undefined') {
            window.location.hash = item.hashTarget;
          }
        },
      }));

    const matchedArsenal: UnifiedSearchResult[] = ARSENAL_TOOLS.filter((tool) => {
      const hay = `${tool.name} ${tool.tagline} ${tool.categoryLabel} ${tool.os.join(' ')} ${tool.keywords.join(' ')}`.toLowerCase();
      return matchesAll(hay);
    })
      .slice(0, 4)
      .map((tool) => ({
        id: `arsenal-${tool.id}`,
        title: tool.name,
        subtitle: `${tool.tagline} · ${tool.os.join(', ')}`,
        group: 'Arsenal Tool',
        icon: Wrench,
        onSelect: () => {
          onSelectApp('arsenal');
          if (typeof window !== 'undefined') window.location.hash = '#arsenal';
        },
      }));

    const matchedPrograms: UnifiedSearchResult[] = C_PROGRAMS.filter((prog) => {
      const hay = `${prog.title} ${prog.category} ${prog.tags.join(' ')}`.toLowerCase();
      return matchesAll(hay);
    })
      .slice(0, 4)
      .map((prog) => ({
        id: `prog-${prog.id}`,
        title: prog.title,
        subtitle: `${prog.category} · ${prog.difficulty}`,
        group: 'C Program',
        icon: Terminal,
        onSelect: () => {
          if (onNavigateTab) {
            onNavigateTab('c-generator', { cProgramId: prog.id });
          } else {
            onSelectApp('compiler');
          }
        },
      }));

    const matchedTopics: UnifiedSearchResult[] = FUNDAMENTAL_TOPICS.filter((topic) => {
      const hay = `${topic.title} ${topic.unit} ${topic.summary} ${topic.importantTags.join(' ')}`.toLowerCase();
      return matchesAll(hay);
    })
      .slice(0, 3)
      .map((topic) => ({
        id: `topic-${topic.id}`,
        title: topic.title,
        subtitle: topic.unit,
        group: 'Notes',
        icon: FileText,
        onSelect: () => {
          if (onNavigateTab) {
            onNavigateTab('fundamentals', { topicId: topic.id });
          } else {
            onSelectApp('bca');
          }
        },
      }));

    return [...matchedApps, ...matchedArsenal, ...matchedPrograms, ...matchedTopics].slice(0, 12);
  }, [query, onSelectApp, onNavigateTab]);

  const showDropdown = isFocused;

  const handleSelectResult = (res: UnifiedSearchResult) => {
    res.onSelect();
    setIsFocused(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      } else if (onOpenNavigator) {
        setIsFocused(false);
        onOpenNavigator();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (query) {
        setQuery('');
      } else {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 h-10 px-3 rounded-xl border transition-all duration-150 ${
          isFocused
            ? 'bg-white dark:bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-sm'
            : 'bg-slate-100 dark:bg-slate-800/85 border-slate-300 dark:border-slate-700/80 hover:border-cyan-500/50'
        }`}
      >
        <Search className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => {
            setIsFocused(true);
            setSelectedIndex(0);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search apps, tools, programs, and notes"
          className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedIndex(0);
              inputRef.current?.focus();
            }}
            aria-label="Clear search query"
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-400 shrink-0">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </kbd>
        )}
      </div>

      {/* Live Instant Search Dropdown */}
      {showDropdown && (
        <div
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-[440px] max-w-[calc(100vw-2rem)] mt-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50"
        >
          <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {query.trim()
                ? `${results.length} matches across apps & notes`
                : 'Quick jump to top apps'}
            </span>
            {onOpenFullSearch && (
              <button
                type="button"
                onClick={() => {
                  setIsFocused(false);
                  onOpenFullSearch();
                }}
                className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer whitespace-nowrap"
              >
                BCA Notes Search
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
            {results.length > 0 ? (
              results.map((item, idx) => {
                const Icon = item.icon;
                const active = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleSelectResult(item)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          active
                            ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate text-slate-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {item.group} · {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        active ? 'text-cyan-600 dark:text-cyan-400 translate-x-0.5' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center space-y-1.5">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No results found for "{query}"
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Try searching HandBrake, Stirling PDF, Ghost Protocol, Fibonacci, or DBMS.
                </p>
              </div>
            )}
          </div>

          {onOpenNavigator && (
            <div className="px-3.5 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Use ↑↓ to move · ↵ Enter to open</span>
              <button
                type="button"
                onClick={() => {
                  setIsFocused(false);
                  onOpenNavigator();
                }}
                className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer whitespace-nowrap"
              >
                Open Full Command Palette
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
