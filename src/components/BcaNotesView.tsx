import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Terminal,
  Cpu,
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Code2,
  HelpCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { BCA_SYLLABUS_MODULES, SyllabusTopic } from '../data/bcaNotesData';

interface BcaNotesViewProps {
  onSaveBookmark?: (item: any) => void;
  isBookmarked?: (id: string) => boolean;
  onOpenCodeRunner?: (codeSnippet?: string) => void;
}

export const BcaNotesView: React.FC<BcaNotesViewProps> = ({
  onSaveBookmark,
  isBookmarked,
  onOpenCodeRunner
}) => {
  const [selectedModule, setSelectedModule] = useState<'all' | 'c-programming' | 'digital-electronics'>('all');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>('c-hist-struct');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const filteredUnits = useMemo(() => {
    return BCA_SYLLABUS_MODULES.filter((unit) => {
      const matchMod = selectedModule === 'all' || unit.module === selectedModule;
      const matchUnit = selectedUnit === 'all' || unit.unitNumber === selectedUnit;
      return matchMod && matchUnit;
    });
  }, [selectedModule, selectedUnit]);

  const allTopics = useMemo(() => {
    const list: { unit: typeof filteredUnits[0]; topic: SyllabusTopic }[] = [];
    filteredUnits.forEach((u) => {
      u.topics.forEach((t) => {
        if (!searchQuery.trim()) {
          list.push({ unit: u, topic: t });
        } else {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchContent = t.hinglishContent.toLowerCase().includes(q);
          const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
          if (matchTitle || matchContent || matchTags) {
            list.push({ unit: u, topic: t });
          }
        }
      });
    });
    return list;
  }, [filteredUnits, searchQuery]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete BCA Syllabus 2023–2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Unit-Wise Syllabus Notes &amp; Viva Vault
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Deep-dive into <strong>C Programming Hub</strong> (CAP-101 &amp; SEC-106) and <strong>Digital Electronics Lab</strong>. Har topic ka detailed Hinglish explanation, verified code snippets, ASCII logic diagrams aur previous years ke exam viva questions.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics by keyword (e.g. pointers, K-Map, De Morgan, recursion, 2's complement)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Modules & Units Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Module Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Subject:</span>
            {[
              { id: 'all', label: 'All Subjects' },
              { id: 'c-programming', label: '💻 C Programming Hub' },
              { id: 'digital-electronics', label: '⚡ Digital Electronics Lab' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedModule === m.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
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
              { id: 'all', label: 'All Units' },
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
        </div>
      </div>

      {/* Topics Accordion List */}
      <div className="space-y-4">
        {allTopics.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">Koi topic match nahi hua. Search query change karke dekhein.</p>
          </div>
        ) : (
          allTopics.map(({ unit, topic }) => {
            const isExpanded = expandedTopicId === topic.id;
            const bookmarked = isBookmarked ? isBookmarked(`note-${topic.id}`) : false;

            return (
              <div
                key={topic.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900 border-blue-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-blue-400">
                        {unit.unitTitle.split(':')[0]}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-950">
                        {unit.syllabusCode}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">{topic.shortOverview}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onSaveBookmark && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSaveBookmark({
                            type: 'fundamentals',
                            title: topic.title,
                            subtitle: unit.unitTitle,
                            data: topic
                          });
                        }}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          bookmarked
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                        title={bookmarked ? 'Saved to bookmarks' : 'Save bookmark'}
                      >
                        {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    )}

                    <div className="p-2 rounded-xl text-slate-400 bg-slate-800">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Topic Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-6">
                    {/* Detailed Hinglish Content */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Detailed Hinglish Explanation:</span>
                      </h4>
                      <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                        {topic.hinglishContent}
                      </p>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        Key Concepts &amp; Exam Highlights:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {topic.bulletPoints.map((bp, idx) => (
                          <li key={idx} className="leading-relaxed">{bp}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Code Snippet if applicable */}
                    {topic.codeSnippet && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Code2 className="w-4 h-4" />
                            <span>Verified C Program / Syntax Implementation:</span>
                          </span>

                          <div className="flex items-center gap-2">
                            {onOpenCodeRunner && (
                              <button
                                onClick={() => onOpenCodeRunner(topic.codeSnippet)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer transition-colors"
                              >
                                Run in Compiler ➔
                              </button>
                            )}
                            <button
                              onClick={() => handleCopyCode(topic.id, topic.codeSnippet!)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold cursor-pointer"
                            >
                              {copiedSnippetId === topic.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedSnippetId === topic.id ? 'Copied' : 'Copy Code'}</span>
                            </button>
                          </div>
                        </div>

                        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                          {topic.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* ASCII Circuit Diagram if applicable */}
                    {topic.diagramAscii && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <Cpu className="w-4 h-4" />
                          <span>Circuit &amp; Truth Table Diagram:</span>
                        </span>
                        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
                          {topic.diagramAscii}
                        </pre>
                      </div>
                    )}

                    {/* Exam Pointers */}
                    {topic.examPointers && topic.examPointers.length > 0 && (
                      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-2">
                        <span className="text-xs font-bold text-blue-300">
                          BCA Exam Important Pointers (High Probability Questions):
                        </span>
                        <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                          {topic.examPointers.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Viva Voce Q&A */}
                    {topic.vivaQnA && topic.vivaQnA.length > 0 && (
                      <div className="space-y-3 pt-1">
                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Viva Voce (Lab Exam) Q&amp;A:</span>
                        </h4>

                        <div className="space-y-2">
                          {topic.vivaQnA.map((qna, idx) => (
                            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
                              <div className="font-bold text-white flex items-start gap-1.5">
                                <span className="text-purple-400 font-mono">Q{idx + 1}:</span>
                                <span>{qna.question}</span>
                              </div>
                              <div className="text-slate-300 pl-4 border-l-2 border-purple-800/50">
                                <span className="text-slate-500 font-semibold">Ans: </span>
                                {qna.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
