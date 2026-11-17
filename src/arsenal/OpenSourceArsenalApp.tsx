import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  FolderOpen,
  Github,
  Layers,
  Search,
  Terminal,
  X,
} from 'lucide-react';
import {
  ARSENAL_CATEGORIES,
  ARSENAL_OS_FILTERS,
  ARSENAL_TOOLS,
  ArsenalCategoryId,
  ArsenalOs,
  ArsenalTool,
} from './arsenalData';

export interface OpenSourceArsenalAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  onSelectApp?: (appId: string) => void;
}

export const OpenSourceArsenalApp: React.FC<OpenSourceArsenalAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOs, setSelectedOs] = useState<'All' | ArsenalOs>('All');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ArsenalCategoryId>('all');
  const [activeTool, setActiveTool] = useState<ArsenalTool | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Close How-to-Use modal on Escape key
  useEffect(() => {
    if (!activeTool) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveTool(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeTool]);

  useEffect(() => {
    setCopiedCmd(false);
  }, [activeTool]);

  const osCounts = useMemo(() => {
    const counts: Record<'All' | ArsenalOs, number> = {
      All: ARSENAL_TOOLS.length,
      Windows: 0,
      Mac: 0,
      Linux: 0,
      Android: 0,
      Web: 0,
    };
    for (const tool of ARSENAL_TOOLS) {
      for (const platform of tool.os) {
        counts[platform] += 1;
      }
    }
    return counts;
  }, []);

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    return ARSENAL_TOOLS.filter((tool) => {
      const matchesOs = selectedOs === 'All' || tool.os.includes(selectedOs);
      if (!matchesOs) return false;

      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      if (!matchesCategory) return false;

      if (tokens.length === 0) return true;

      const haystack = [
        tool.name,
        tool.tagline,
        tool.categoryLabel,
        tool.description,
        tool.howToUse,
        tool.license,
        tool.os.join(' '),
        tool.keywords.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => haystack.includes(token));
    });
  }, [searchQuery, selectedOs, selectedCategory]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedOs('All');
    setSelectedCategory('all');
  };

  const handleCopyCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 1800);
    } catch {
      setCopiedCmd(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {onBackToBca && (
                <button
                  type="button"
                  onClick={onBackToBca}
                  className="p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  title="Return to OS Hub"
                  aria-label="Return to OS Hub"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                    OpenSource Arsenal
                  </h1>
                  <p className="text-xs text-slate-400 truncate hidden sm:block">
                    Lightweight, everyday micro-utilities replacing bloated paid software
                  </p>
                </div>
              </div>
            </div>

            {onOpenAppSwitcher && (
              <button
                type="button"
                onClick={onOpenAppSwitcher}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Suite Apps</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filter & Search Workspace Bar */}
        <section className="rounded-3xl bg-slate-900/75 backdrop-blur-xl border border-slate-800 p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Curated Open-Source Utility Vault
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Showing <span className="font-mono font-semibold text-cyan-400 tabular-nums">{filteredTools.length}</span> of{' '}
                <span className="font-mono tabular-nums">{ARSENAL_TOOLS.length}</span> verified tools across{' '}
                <span className="font-mono tabular-nums">5</span> categories
              </p>
            </div>

            {/* Smart Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools or tasks (e.g. PDF, Video, VPN, USB)..."
                className="w-full pl-10 pr-9 py-2.5 min-h-[42px] rounded-xl bg-slate-950/90 border border-slate-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* OS Filter Bar */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-400">Filter by Operating System</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ARSENAL_OS_FILTERS.map((os) => {
                const isActive = selectedOs === os;
                return (
                  <button
                    key={os}
                    type="button"
                    onClick={() => setSelectedOs(os)}
                    className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 border ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{os}</span>
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {osCounts[os]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {ARSENAL_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tools Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="rounded-3xl bg-slate-900/75 backdrop-blur-xl border border-slate-800 p-10 text-center space-y-3">
            <FolderOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">No matching tools found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Current OS filter ({selectedOs}) or search query did not match any utility. Reset filters to view all {ARSENAL_TOOLS.length} tools.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <article
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                className="group rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 p-5 flex flex-col justify-between gap-4 transition-colors cursor-pointer shadow-lg"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {tool.name}
                      </h3>
                      <div className="text-xs font-medium text-cyan-400">{tool.tagline}</div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0 tabular-nums">
                      {tool.license}
                    </span>
                  </div>

                  {/* Clean Unboxed Metadata */}
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
                    <span>{tool.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-300 font-medium">{tool.os.join(' / ')}</span>
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTool(tool);
                    }}
                    className="px-3 py-2 min-h-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>How to Use</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-2 min-h-[40px] rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={tool.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-2 min-h-[40px] rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>{tool.githubLabel || 'GitHub'}</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      {/* How To Use Modal */}
      {activeTool && (
        <div
          onClick={() => setActiveTool(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="arsenal-modal-title"
            className="w-full max-w-lg rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="arsenal-modal-title" className="text-xl font-bold text-white">
                  {activeTool.name}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-cyan-400 font-medium">{activeTool.tagline}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeTool.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{activeTool.license}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="p-2 min-h-[40px] min-w-[40px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer flex items-center justify-center shrink-0"
                aria-label="Close setup guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-400">
                Supported Platforms: <span className="text-slate-200">{activeTool.os.join(', ')}</span>
              </div>

              <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 space-y-2">
                <div className="text-xs font-semibold text-cyan-400">Quick Setup &amp; How to Use</div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {activeTool.howToUse}
                </p>
              </div>

              {activeTool.quickCommand && (
                <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-400">Quick Command / Snippet</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCommand(activeTool.quickCommand!)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <code className="block text-xs font-mono text-emerald-300 break-all">
                    {activeTool.quickCommand}
                  </code>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <a
                href={activeTool.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 min-h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>{activeTool.githubLabel || 'Open GitHub'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={activeTool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 min-h-[42px] rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
              >
                <span>Open Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
