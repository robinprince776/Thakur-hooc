import React, { useEffect, useMemo, useState } from 'react';
import { List, RowComponentProps } from 'react-window';
import {
  Archive,
  ArrowRight,
  Award,
  CheckCircle2,
  Flame,
  Layers,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import seedProblemsRaw from './arenaData.json';
import {
  ARENA_CATEGORIES,
  ARENA_DIFFICULTIES,
  ARENA_ISSUE_TYPES,
  ARENA_LAYERS,
  ArenaCategory,
  ArenaDifficulty,
  ArenaIssueType,
  ArenaLayer,
  ArenaProblem,
} from './arenaTypes';
import { useArenaStore } from '../store/useArenaStore';
import { ArenaWorkspaceModal } from './ArenaWorkspaceModal';
import { ArenaGeneratorModal } from './ArenaGeneratorModal';

const SEED_PROBLEMS = seedProblemsRaw as ArenaProblem[];

export interface TheArenaAppProps {
  onBackToBca?: () => void;
  onOpenAppSwitcher?: () => void;
  initialProblemId?: string | null;
  onClearInitialProblem?: () => void;
}

interface ArenaRowProps {
  rows: ArenaProblem[][];
  solvedMap: ReturnType<typeof useArenaStore.getState>['solvedMap'];
  onOpenProblem: (problem: ArenaProblem) => void;
}

function getDiffTextColor(diff: ArenaDifficulty): string {
  switch (diff) {
    case 'Easy':
      return 'text-emerald-400';
    case 'Medium':
      return 'text-amber-400';
    case 'Hard':
      return 'text-rose-400';
    case 'Expert':
      return 'text-purple-400';
  }
}

function getIssueTextColor(issue: ArenaIssueType): string {
  switch (issue) {
    case 'Bug':
      return 'text-rose-300';
    case 'Security':
      return 'text-emerald-300';
    case 'Optimization':
      return 'text-cyan-300';
    case 'Enhancement':
      return 'text-indigo-300';
  }
}

const ArenaVirtualRow = ({
  index,
  style,
  rows,
  solvedMap,
  onOpenProblem,
}: RowComponentProps<ArenaRowProps>) => {
  const rowItems = rows[index] || [];
  return (
    <div style={style} className="px-1 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {rowItems.map((problem) => {
          const solved = solvedMap[problem.id];
          return (
            <article
              key={problem.id}
              className="rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/45 p-5 flex flex-col justify-between transition-colors h-full"
            >
              <div className="space-y-2.5 min-w-0">
                {/* Unboxed Metadata Row (GitHub Issue style) */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0 truncate">
                    <span className={`font-semibold ${getIssueTextColor(problem.issueType)}`}>
                      {problem.issueType}
                    </span>
                    <span className="text-slate-600" aria-hidden="true">·</span>
                    <span className="text-slate-400 truncate">{problem.category}</span>
                    {problem.layer === 'AWARENESS' && (
                      <>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-amber-300 font-semibold whitespace-nowrap">Awareness</span>
                      </>
                    )}
                    {problem.isAiGenerated && (
                      <>
                        <span className="text-slate-600" aria-hidden="true">·</span>
                        <span className="text-cyan-400 font-semibold">Generated</span>
                      </>
                    )}
                  </div>
                  <span className={`font-semibold shrink-0 ${getDiffTextColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
                  {problem.title}
                </h3>

                {/* Context Summary */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {problem.context}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs min-w-0">
                  <span className="font-mono font-bold text-amber-400 tabular-nums whitespace-nowrap">
                    +{problem.bountyXp} XP
                  </span>
                  {problem.rareBadge && (
                    <>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-purple-300 truncate">{problem.rareBadge}</span>
                    </>
                  )}
                  {solved && (
                    <>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold whitespace-nowrap">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{solved.solvedWithHelp ? 'Solved (Help)' : 'Solved'}</span>
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenProblem(problem)}
                  className="h-9 px-3.5 rounded-xl bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/40 text-cyan-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                >
                  <span>{solved ? 'Review Code' : 'View Challenge'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export const TheArenaApp: React.FC<TheArenaAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
  initialProblemId,
  onClearInitialProblem,
}) => {
  const {
    customProblems,
    solvedMap,
    totalAttempts,
    successfulAttempts,
    xp,
    streak,
    unlockedBadges,
    addCustomProblem,
  } = useArenaStore();

  const [viewMode, setViewMode] = useState<'active' | 'archive'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ArenaCategory>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | ArenaDifficulty>('All');
  const [selectedIssue, setSelectedIssue] = useState<'All' | ArenaIssueType>('All');
  const [selectedLayer, setSelectedLayer] = useState<'All' | ArenaLayer>('All');
  const [activeProblem, setActiveProblem] = useState<ArenaProblem | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const allProblems = useMemo<ArenaProblem[]>(
    () => [...customProblems, ...SEED_PROBLEMS],
    [customProblems]
  );

  // Open deep-linked problem if requested via TechNavigator / hash
  useEffect(() => {
    if (!initialProblemId) return;
    const match = allProblems.find((p) => p.id === initialProblemId);
    if (match) {
      setActiveProblem(match);
      if (onClearInitialProblem) onClearInitialProblem();
    }
  }, [initialProblemId, allProblems, onClearInitialProblem]);

  const solvedCount = Object.keys(solvedMap).length;
  const accuracyPct =
    totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 100;

  const filteredProblems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];

    return allProblems.filter((p) => {
      const isSolved = Boolean(solvedMap[p.id]);
      if (viewMode === 'archive' && !isSolved) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
      if (selectedIssue !== 'All' && p.issueType !== selectedIssue) return false;
      const effectiveLayer: ArenaLayer = p.layer ?? 'DEFENSIVE';
      if (selectedLayer !== 'All' && effectiveLayer !== selectedLayer) return false;

      if (tokens.length === 0) return true;
      const hay = [
        p.title,
        p.category,
        p.difficulty,
        p.issueType,
        effectiveLayer,
        p.context,
        p.problemStatement,
        (p.redFlags || []).join(' '),
        p.defensiveFix || '',
        p.keywords.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [
    allProblems,
    solvedMap,
    viewMode,
    selectedCategory,
    selectedDifficulty,
    selectedIssue,
    selectedLayer,
    searchQuery,
  ]);

  // Chunk into rows of 2 on desktop, 1 on mobile for react-window virtualization
  const virtualRows = useMemo(() => {
    const cols = isDesktop ? 2 : 1;
    const rows: ArenaProblem[][] = [];
    for (let i = 0; i < filteredProblems.length; i += cols) {
      rows.push(filteredProblems.slice(i, i + cols));
    }
    return rows;
  }, [filteredProblems, isDesktop]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedIssue('All');
    setSelectedLayer('All');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {onBackToBca && (
              <button
                type="button"
                onClick={onBackToBca}
                className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
                title="Return to OS Hub"
                aria-label="Return to OS Hub"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                The Arena
              </h1>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                Dual-Layer Defensive &amp; Threat Awareness Arena · {allProblems.length} Curated Challenges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsGeneratorOpen(true)}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 cursor-pointer whitespace-nowrap transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate New Challenge</span>
            </button>

            {onOpenAppSwitcher && (
              <button
                type="button"
                onClick={onOpenAppSwitcher}
                className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Suite</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* User Stats Dashboard */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-slate-900/75 border border-slate-800 p-4 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solved Problems</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {solvedCount}
              <span className="text-xs font-normal text-slate-500"> / {allProblems.length}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/75 border border-slate-800 p-4 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Total Arena XP</span>
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{xp} XP</div>
          </div>

          <div className="rounded-2xl bg-slate-900/75 border border-slate-800 p-4 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Current Streak</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {streak} <span className="text-xs font-normal text-slate-500">days</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/75 border border-slate-800 p-4 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-cyan-300 font-mono tabular-nums">
              {accuracyPct}%
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 rounded-2xl bg-slate-900/75 border border-slate-800 p-4 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>Rare Badges</span>
            </div>
            <div className="text-2xl font-bold text-purple-300 font-mono tabular-nums">
              {unlockedBadges.length}
            </div>
          </div>
        </section>

        {/* Controls & Filters Panel */}
        <section className="rounded-3xl bg-slate-900/75 border border-slate-800 p-5 space-y-4">
          {/* Top Row: View Mode Tabs + Search Input + Difficulty + Issue Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Active vs Solved Archive Segmented Switch */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0 self-start">
              <button
                type="button"
                onClick={() => setViewMode('active')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'active'
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Challenges ({allProblems.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('archive')}
                className={`h-9 px-3.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'archive'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Solved Archive ({solvedCount})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-500 transition-colors">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search XSS, SQL, URL Shortener, Docker, Base64, LRU Cache..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear Arena search"
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Difficulty + GitHub-Issue Type Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1">Difficulty:</span>
              {(['All', ...ARENA_DIFFICULTIES] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedDifficulty === diff
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1">Layer:</span>
              {(['All', ...ARENA_LAYERS] as const).map((layer) => (
                <button
                  key={layer}
                  type="button"
                  onClick={() => setSelectedLayer(layer)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedLayer === layer
                      ? layer === 'AWARENESS'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {layer === 'All' ? 'All Layers' : layer === 'DEFENSIVE' ? 'Defensive' : 'Awareness'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1">Tag:</span>
              {(['All', ...ARENA_ISSUE_TYPES] as const).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedIssue(tag)}
                  className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedIssue === tag
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 15 Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(['All', ...ARENA_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-950/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Unlocked Rare Badges Summary */}
          {unlockedBadges.length > 0 && (
            <div className="pt-2 border-t border-slate-800 text-xs text-purple-300 flex items-center gap-2 flex-wrap">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">Unlocked Rare Badges:</span>
              <span className="text-slate-300">{unlockedBadges.join(' · ')}</span>
            </div>
          )}
        </section>

        {/* Virtualized Challenge Feed (react-window v2) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-cyan-300 font-mono tabular-nums">{filteredProblems.length}</strong>{' '}
              {viewMode === 'archive' ? 'archived' : 'matching'} challenges (virtualized 60 FPS list)
            </span>
            {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedIssue !== 'All') && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {virtualRows.length > 0 ? (
            <div className="rounded-3xl bg-slate-950/40 border border-slate-800/80 p-3">
              <List
                rowComponent={ArenaVirtualRow}
                rowCount={virtualRows.length}
                rowHeight={196}
                overscanCount={4}
                rowProps={{
                  rows: virtualRows,
                  solvedMap,
                  onOpenProblem: (prob) => setActiveProblem(prob),
                }}
                style={{ height: Math.min(680, Math.max(240, virtualRows.length * 196)) }}
              />
            </div>
          ) : (
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-white">
                {viewMode === 'archive'
                  ? 'No solved challenges in your Archive yet.'
                  : 'No challenges match your active filters.'}
              </p>
              <p className="text-xs text-slate-400">
                {viewMode === 'archive'
                  ? 'Open any challenge, submit your solution, and it will be saved here with your code.'
                  : 'Reset filters or generate a brand-new custom problem with Gemini AI.'}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('active');
                    resetFilters();
                  }}
                  className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Show All Challenges
                </button>
                <button
                  type="button"
                  onClick={() => setIsGeneratorOpen(true)}
                  className="h-10 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Custom Challenge</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* 3-Pane Challenge Workspace Modal */}
      {activeProblem && (
        <ArenaWorkspaceModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
        />
      )}

      {/* Infinite AI Challenge Generator Modal */}
      <ArenaGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        existingTitles={allProblems.map((p) => p.title)}
        onProblemGenerated={(newProblem) => {
          addCustomProblem(newProblem);
          setActiveProblem(newProblem);
        }}
      />
    </div>
  );
};
