import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  BookOpen,
  Bookmark,
  Check,
  Copy,
  Download,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Table,
  CheckCircle2,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { FUNDAMENTAL_TOPICS, FUNDAMENTAL_UNITS } from '../data/computerFundamentals';
import { FundamentalTopic, BookmarkItem } from '../types';

interface ComputerFundamentalsProps {
  onSaveBookmark: (item: Omit<BookmarkItem, 'id' | 'timestamp'>) => void;
  isBookmarked: (id: string) => boolean;
}

export const ComputerFundamentals: React.FC<ComputerFundamentalsProps> = ({
  onSaveBookmark,
  isBookmarked
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(FUNDAMENTAL_TOPICS[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [vivaModeOnly, setVivaModeOnly] = useState<boolean>(false);

  // Filter topics
  const filteredTopics = useMemo(() => {
    return FUNDAMENTAL_TOPICS.filter((t) => {
      // Unit filter
      if (selectedUnit !== 'all') {
        const unitNum = parseInt(selectedUnit.replace('unit-', ''), 10);
        if (t.unitNumber !== unitNum) return false;
      }

      // Search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchSummary = t.summary.toLowerCase().includes(q);
      const matchOverview = t.hinglishOverview.toLowerCase().includes(q);
      const matchTags = t.importantTags.some((tag) => tag.toLowerCase().includes(q));
      const matchViva = t.examVivaQuestions?.some(
        (v) => v.question.toLowerCase().includes(q) || v.answer.toLowerCase().includes(q)
      );
      return matchTitle || matchSummary || matchOverview || matchTags || matchViva;
    });
  }, [selectedUnit, searchQuery]);

  const handleCopyNotes = (topic: FundamentalTopic) => {
    const textToCopy = `📚 ${topic.title} (${topic.unit})
-----------------------------------------
Overview:
${topic.hinglishOverview}

Key Points:
${topic.keyPoints.join('\n')}

Exam / Viva Q&A:
${topic.examVivaQuestions?.map((v, i) => `${i + 1}. Q: ${v.question}\n   A: ${v.answer}`).join('\n') || ''}

- BCA Verse | Made by Prince Thakur`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(topic.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTopic = (topic: FundamentalTopic) => {
    const content = `=====================================================
${topic.title.toUpperCase()}
Subject: Fundamental of Computer - BCA 1st Semester
Unit: ${topic.unit}
=====================================================

OVERVIEW (HINGLISH):
${topic.hinglishOverview}

CORE CHARACTERISTICS & KEY EXAM POINTS:
${topic.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

DETAILED EXPLANATION:
${topic.detailedContent.join('\n\n')}

${
  topic.comparisonTable
    ? `COMPARISON TABLE:
${topic.comparisonTable.headers.join(' | ')}
-----------------------------------------------------
${topic.comparisonTable.rows.map((r) => r.join(' | ')).join('\n')}
`
    : ''
}

IMPORTANT VIVA & UNIVERSITY EXAM QUESTIONS:
${
  topic.examVivaQuestions
    ?.map(
      (v, i) => `Q${i + 1}: ${v.question}
Ans: ${v.answer}
`
    )
    .join('\n') || 'None'
}

TAGS: ${topic.importantTags.join(', ')}
Created with BCA Verse - Made by Prince Thakur
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.id}-bca-notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-indigo-500/10 p-6 sm:p-10 border border-emerald-200/60 dark:border-emerald-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 shadow-xs border border-emerald-200 dark:border-emerald-800 mb-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>3rd Subject · BCA 1st Semester · Made by Prince Thakur</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Fundamental of Computer{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
              Complete Notes &amp; Viva Q&amp;A
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
            Unit 1 se Unit 8 tak ke sabhi exam questions, Von Neumann architecture, CPU registers,
            RAM/ROM differences, Memory hierarchy, aur OSI model ko easy Hinglish me step-by-step master karein.
          </p>

          {/* Quick Metrics */}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              8 Complete Units
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-teal-500" />
              Comparison Tables
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-xs flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
              Exam &amp; Viva Q&amp;A Included
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
              100% Offline Access
            </span>
          </div>
        </div>
      </section>

      {/* Search & Unit Navigation */}
      <section className="space-y-4">
        {/* Search Bar + Viva Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. GIGO, Generations, Von Neumann, RAM vs ROM, OSI model)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setVivaModeOnly(!vivaModeOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
              vivaModeOnly
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{vivaModeOnly ? 'Showing Viva Questions Only' : 'Show All Exam & Viva Q&A'}</span>
          </button>
        </div>

        {/* Unit Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {FUNDAMENTAL_UNITS.map((unit) => {
            const isActive = selectedUnit === unit.id;
            return (
              <button
                key={unit.id}
                onClick={() => setSelectedUnit(unit.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {unit.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Topics Content List */}
      <section className="space-y-5">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>Showing {filteredTopics.length} topics</span>
          <span>BCA 1st Semester Syllabus Verified</span>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center bg-white/50 dark:bg-slate-800/50">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              No topic found for "{searchQuery}". Try searching "CPU", "RAM", "GIGO", or select "All Units".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUnit('all');
              }}
              className="mt-3 text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              const isExpanded = expandedTopicId === topic.id;
              const isSaved = isBookmarked(topic.id);

              return (
                <div
                  key={topic.id}
                  className={`rounded-2xl bg-white dark:bg-slate-800/90 border transition-all duration-200 overflow-hidden shadow-xs ${
                    isExpanded
                      ? 'border-emerald-500/60 dark:border-emerald-500/60 ring-1 ring-emerald-500/20'
                      : 'border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Topic Header Bar */}
                  <div
                    onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {topic.unit}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          {topic.importantTags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-slate-400 dark:text-slate-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{topic.title}</span>
                      </h2>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                        {topic.summary}
                      </p>
                    </div>

                    {/* Action buttons + Expand Toggle */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveBookmark({
                            type: 'fundamentals',
                            title: topic.title,
                            subtitle: topic.unit,
                            data: topic
                          });
                        }}
                        className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title={isSaved ? 'Bookmark se hatayein' : 'Bookmark me save karein'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyNotes(topic);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs transition-colors cursor-pointer"
                        title="Copy Summary"
                      >
                        {copiedId === topic.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadTopic(topic);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs transition-colors cursor-pointer"
                        title="Download Notes (.txt)"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <div className="p-2 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed Notes Content */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-700/80 space-y-6">
                      {/* Hinglish Intuitive Overview */}
                      <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Easy Hinglish Concept Overview</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                          {topic.hinglishOverview}
                        </p>
                      </div>

                      {/* Key Points for 5-Mark Exam Questions */}
                      <div className="space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Must-Know Exam Points:</span>
                        </h3>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          {topic.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                              <span className="leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Comparison Table (If Available) */}
                      {topic.comparisonTable && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                            <Table className="w-3.5 h-3.5 text-teal-500" />
                            <span>Comparison &amp; Specifications Table:</span>
                          </h3>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                            <table className="w-full text-left text-xs sm:text-sm">
                              <thead className="bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                  {topic.comparisonTable.headers.map((h, i) => (
                                    <th key={i} className="px-4 py-3 whitespace-nowrap">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {topic.comparisonTable.rows.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-750/50 text-slate-600 dark:text-slate-300"
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="px-4 py-2.5 whitespace-nowrap">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Detailed Explanatory Points */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Detailed Theory &amp; Mechanism:</span>
                        </h3>
                        <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/60 leading-relaxed font-mono">
                          {topic.detailedContent.map((item, idx) => (
                            <p key={idx}>{item}</p>
                          ))}
                        </div>
                      </div>

                      {/* Important Viva & University Questions Accordion */}
                      {topic.examVivaQuestions && topic.examVivaQuestions.length > 0 && (
                        <div className="space-y-2.5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Frequently Asked Viva &amp; Exam Questions:</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {topic.examVivaQuestions.map((viva, vIdx) => (
                              <div
                                key={vIdx}
                                className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1.5"
                              >
                                <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                                  <span>Q:</span>
                                  <span>{viva.question}</span>
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Ans:</span>
                                  <span>{viva.answer}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          BCA 1st Semester Notes · Unit {topic.unitNumber}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCopyNotes(topic)}
                            className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Notes</span>
                          </button>
                          <button
                            onClick={() => handleDownloadTopic(topic)}
                            className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download (.txt)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
