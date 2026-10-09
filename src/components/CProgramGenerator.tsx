import React, { useState, useMemo, useEffect } from 'react';
import { C_PROGRAMS } from '../data/cPrograms';
import { CProgram, ProgramCategory, ProgramDifficulty } from '../types';
import {
  Search,
  Copy,
  Check,
  Download,
  Terminal,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Wand2,
  Clock,
  HardDrive,
  Lightbulb,
  Play,
  ArrowRight,
  Loader2,
  Library,
  Layers,
  AlertCircle
} from 'lucide-react';

interface CProgramGeneratorProps {
  initialProgramId?: string;
  onSaveBookmark: (item: {
    type: 'c-program';
    title: string;
    subtitle: string;
    data: any;
  }) => void;
  isBookmarked: (id: string) => boolean;
}

export const CProgramGenerator: React.FC<CProgramGeneratorProps> = ({
  initialProgramId,
  onSaveBookmark,
  isBookmarked
}) => {
  // Mode: 'statement' (custom prompt) or 'library' (preloaded 45+ programs)
  const [activeMode, setActiveMode] = useState<'statement' | 'library'>('statement');
  const [statementInput, setStatementInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Custom generated programs stored in localStorage
  const [customPrograms, setCustomPrograms] = useState<CProgram[]>(() => {
    try {
      const saved = localStorage.getItem('bca_verse_custom_programs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCustomProgram, setActiveCustomProgram] = useState<CProgram | null>(null);

  // Library mode states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [activeLibraryProgramId, setActiveLibraryProgramId] = useState<string>(
    initialProgramId || 'fibonacci-series'
  );

  const [copiedCode, setCopiedCode] = useState(false);

  // Save custom programs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bca_verse_custom_programs', JSON.stringify(customPrograms));
    } catch {}
  }, [customPrograms]);

  useEffect(() => {
    if (initialProgramId) {
      // Check if it's in library
      const inLib = C_PROGRAMS.find((p) => p.id === initialProgramId);
      if (inLib) {
        setActiveLibraryProgramId(initialProgramId);
        setActiveMode('library');
      } else {
        // Check in custom programs
        const inCustom = customPrograms.find((p) => p.id === initialProgramId);
        if (inCustom) {
          setActiveCustomProgram(inCustom);
          setActiveMode('statement');
        }
      }
    }
  }, [initialProgramId]);

  const categories: (ProgramCategory | 'All')[] = [
    'All',
    'Basic',
    'Math & Numbers',
    'Loops & Patterns',
    'Arrays',
    'Strings',
    'Sorting & Searching',
    'Pointers & Structures',
    'Recursion & Files'
  ];

  // Filtered library programs
  const filteredLibraryPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return C_PROGRAMS.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  // Current displayed program
  const currentProgram: CProgram = useMemo(() => {
    if (activeMode === 'statement') {
      if (activeCustomProgram) return activeCustomProgram;
      if (customPrograms.length > 0) return customPrograms[0];
      // Default to library item if no custom generated yet
      return C_PROGRAMS[0];
    }
    return (
      C_PROGRAMS.find((p) => p.id === activeLibraryProgramId) ||
      filteredLibraryPrograms[0] ||
      C_PROGRAMS[0]
    );
  }, [activeMode, activeCustomProgram, customPrograms, activeLibraryProgramId, filteredLibraryPrograms]);

  // Handler to generate code from statement via server API
  const handleGenerateCode = async (promptStatement?: string) => {
    const textToGenerate = (promptStatement || statementInput).trim();
    if (!textToGenerate) {
      setGenerateError('Kripya apna question ya problem statement enter karein.');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/generate-c-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement: textToGenerate })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Server se code generate nahi ho saka.');
      }

      const generatedData: CProgram = await response.json();

      setActiveCustomProgram(generatedData);
      setCustomPrograms((prev) => [
        generatedData,
        ...prev.filter((p) => p.title !== generatedData.title)
      ]);
      setActiveMode('statement');
    } catch (err: any) {
      console.error(err);
      setGenerateError(
        err.message || 'Error occurred while generating code. Kripya dobara try karein.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const samplePromptSuggestions = [
    'Check whether a number is Automorphic or not',
    'Calculate electricity bill based on units slab rates',
    'Find second smallest element in array',
    'Structure to store and display 5 students records',
    'Check if a string is a Pangram',
    "Print Pascal's Triangle pattern using loops",
    'Find power of number base^exp using recursion'
  ];

  const handleCopyCode = () => {
    if (!currentProgram) return;
    navigator.clipboard.writeText(currentProgram.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCFile = () => {
    if (!currentProgram) return;
    const element = document.createElement('a');
    const file = new Blob([currentProgram.code], { type: 'text/x-c' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentProgram.id || 'program'}.c`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleBookmarkToggle = () => {
    if (!currentProgram) return;
    onSaveBookmark({
      type: 'c-program',
      title: currentProgram.title,
      subtitle: `${currentProgram.category} · ${currentProgram.difficulty}`,
      data: currentProgram
    });
  };

  const isCurrentBookmarked = isBookmarked(`c-program-${currentProgram.id}`);
  const codeLines = currentProgram ? currentProgram.code.split('\n') : [];

  const getDifficultyColor = (diff: ProgramDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-900';
      case 'Medium':
        return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-900';
      case 'Hard':
        return 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200/80 dark:border-rose-900';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Statement-to-Code Engine + 45+ BCA Programs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            C Programming Code Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Apna problem statement likhein aur instantly compilable C code + Hinglish logic praapt karein.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-center">
          <button
            onClick={() => setActiveMode('statement')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'statement'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Statement se Code Banao</span>
          </button>
          <button
            onClick={() => setActiveMode('library')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'library'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>45+ Ready BCA Programs</span>
          </button>
        </div>
      </div>

      {/* MODE 1: STATEMENT TO CODE GENERATOR */}
      {activeMode === 'statement' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-purple-200/80 dark:border-purple-900/50 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Wand2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Enter Your Problem Statement or Question:</span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={statementInput}
              onChange={(e) => setStatementInput(e.target.value)}
              placeholder="e.g. Write a C program to check whether a number is Automorphic or not, or 'ek program banao jo array me se duplicate elements remove kare'..."
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">Try these popular questions:</span>
            <div className="flex flex-wrap gap-1.5">
              {samplePromptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setStatementInput(prompt);
                    handleGenerateCode(prompt);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900/60 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={isGenerating || !statementInput.trim()}
              onClick={() => handleGenerateCode()}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>C Code Generate ho raha hai...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Complete C Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {customPrograms.length > 0 && (
              <span className="text-xs text-slate-400 font-medium">
                {customPrograms.length} Custom Programs Generated Previously
              </span>
            )}
          </div>

          {generateError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{generateError}</span>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: LIBRARY SEARCH & FILTERS */}
      {activeMode === 'library' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-700 space-y-4">
          {/* Instant Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Type program name (e.g. "Fibonacci", "Prime", "Bubble Sort", "Armstrong", "Matrix", "Tower of Hanoi")...'
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Tab Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Difficulty filter pills */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">Difficulty:</span>
              {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <span className="text-slate-400 font-medium">
              {filteredLibraryPrograms.length} of {C_PROGRAMS.length} programs
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Left Program List (Custom or Library) + Right Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[640px] overflow-y-auto pr-1">
          {activeMode === 'statement' ? (
            /* Custom Generated List */
            customPrograms.length === 0 ? (
              <div className="p-6 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-2">
                <Wand2 className="w-8 h-8 text-purple-400 mx-auto" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Upar apna problem statement likhein aur "Generate" par click karein.
                </p>
                <p>AI turant custom compilable C code taiyar karega!</p>
              </div>
            ) : (
              customPrograms.map((p) => {
                const isCurrent = p.id === currentProgram?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveCustomProgram(p)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-purple-50/90 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800 shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`text-sm font-bold line-clamp-1 ${
                          isCurrent
                            ? 'text-purple-900 dark:text-purple-200'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {p.title}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 shrink-0">
                        Custom AI
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {p.description}
                    </p>
                  </button>
                );
              })
            )
          ) : (
            /* Library List */
            filteredLibraryPrograms.map((p) => {
              const isCurrent = p.id === currentProgram?.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveLibraryProgramId(p.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-purple-50/90 dark:bg-purple-950/50 border-purple-300 dark:border-purple-800 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3
                      className={`text-sm font-bold line-clamp-1 ${
                        isCurrent
                          ? 'text-purple-900 dark:text-purple-200'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {p.title}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getDifficultyColor(
                        p.difficulty
                      )}`}
                    >
                      {p.difficulty}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {p.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{p.category}</span>
                    <span className="font-mono">{p.timeComplexity}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Viewer (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentProgram ? (
            <>
              {/* Program Header Box */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        {currentProgram.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                          currentProgram.difficulty
                        )}`}
                      >
                        {currentProgram.difficulty}
                      </span>
                      {currentProgram.id?.startsWith('custom-') && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          AI Generated from Statement
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {currentProgram.title}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      {currentProgram.description}
                    </p>
                  </div>

                  {/* Actions: Copy, Download, Bookmark */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                      title="Copy C Code"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleDownloadCFile}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                      title="Download as .c file"
                    >
                      <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="hidden sm:inline">.c File</span>
                    </button>

                    <button
                      onClick={handleBookmarkToggle}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isCurrentBookmarked
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                      }`}
                      title={isCurrentBookmarked ? 'Bookmarked' : 'Add to Favorites'}
                    >
                      {isCurrentBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Complexity metrics */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Time: <strong className="text-slate-700 dark:text-slate-200 font-mono">{currentProgram.timeComplexity}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    <span>Space: <strong className="text-slate-700 dark:text-slate-200 font-mono">{currentProgram.spaceComplexity}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Standard: <strong className="text-slate-700 dark:text-slate-200">ANSI C / GCC Compatible</strong></span>
                  </div>
                </div>
              </div>

              {/* Code Box with Syntax Styling and Line Numbers */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 ml-2">
                      {currentProgram.id}.c
                    </span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 selection:bg-purple-900">
                  <pre className="grid grid-cols-[auto_1fr] gap-x-4">
                    <span className="select-none text-slate-600 text-right pr-2 border-r border-slate-800/80">
                      {codeLines.map((_, idx) => (
                        <span key={idx} className="block">
                          {idx + 1}
                        </span>
                      ))}
                    </span>
                    <code>
                      {codeLines.map((line, idx) => {
                        const isComment = line.trim().startsWith('//');
                        const isInclude = line.trim().startsWith('#include');
                        return (
                          <span
                            key={idx}
                            className={`block ${
                              isComment
                                ? 'text-emerald-400/90 italic'
                                : isInclude
                                ? 'text-pink-400'
                                : 'text-slate-200'
                            }`}
                          >
                            {line || ' '}
                          </span>
                        );
                      })}
                    </code>
                  </pre>
                </div>
              </div>

              {/* Hinglish Explanation Box */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <span>Program Logic Explanation in Hinglish</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
                  {currentProgram.hinglishExplanation}
                </p>

                {/* Key Points */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Important Viva & Exam Points:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {currentProgram.keyLogicPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sample Input / Output */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Play className="w-4 h-4 text-emerald-500" />
                    <span>Sample Execution & Expected Output</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500">Input Data:</span>
                    <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                      {currentProgram.sampleInput}
                    </pre>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-500">Console Output:</span>
                    <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                      {currentProgram.sampleOutput}
                    </pre>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
