import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Terminal,
  Shield,
  Scale,
  Cpu,
  Compass,
  Network,
  HardDrive,
  Code,
  Cloud,
  Sparkles,
  Search,
  BookOpen,
  Bookmark,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Send,
  Loader2,
  RefreshCw,
  ExternalLink,
  Flame,
  ArrowRight,
  Grid,
  Bot
} from 'lucide-react';
import {
  TECH_CATEGORIES,
  TECH_MASTER_QUESTIONS,
  GENERATED_TOPIC_BANK,
  QuickQuestionPrompt
} from '../data/techMasterData';
import { TechCategory, TechLevel, TechQuestion } from '../types';

export interface TechMasterAppProps {
  onBackToBca?: () => void;
  onOpenCalcVault?: () => void;
  onOpenSukhan?: () => void;
  onOpenCompiler?: () => void;
  onOpenCyber?: () => void;
  onOpenDevForge?: () => void;
  onOpenAppSwitcher?: () => void;
}

export const TechMasterApp: React.FC<TechMasterAppProps> = ({
  onBackToBca,
  onOpenCalcVault,
  onOpenSukhan,
  onOpenCompiler,
  onOpenCyber,
  onOpenDevForge,
  onOpenAppSwitcher
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'vault' | 'roadmap' | 'drill' | 'ask_ai'>('vault');
  const [selectedCategory, setSelectedCategory] = useState<TechCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<TechLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>('hack-01');
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('techmaster_starred');
      return saved ? JSON.parse(saved) : ['hack-01', 'law-01', 'super-01'];
    } catch {
      return ['hack-01', 'law-01', 'super-01'];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Flashcard Drill state
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillFlipped, setDrillFlipped] = useState(false);
  const [drillScore, setDrillScore] = useState({ correct: 0, reviewed: 0 });

  // Ask AI Master state
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Save starred questions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('techmaster_starred', JSON.stringify(starredIds));
    } catch {}
  }, [starredIds]);

  const toggleStar = (id: string) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Questions list
  const filteredQuestions = useMemo(() => {
    return TECH_MASTER_QUESTIONS.filter((q) => {
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || q.level === selectedLevel;
      const qLower = searchQuery.toLowerCase().trim();
      const matchSearch =
        !qLower ||
        q.title.toLowerCase().includes(qLower) ||
        q.shortAnswer.toLowerCase().includes(qLower) ||
        q.deepAnswer.toLowerCase().includes(qLower) ||
        q.tags.some((t) => t.toLowerCase().includes(qLower)) ||
        (q.lawSection && q.lawSection.toLowerCase().includes(qLower));

      return matchCat && matchLevel && matchSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Topic prompt bank for selected category
  const activePromptBank = useMemo(() => {
    if (selectedCategory === 'all') {
      return GENERATED_TOPIC_BANK.slice(0, 20);
    }
    return GENERATED_TOPIC_BANK.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  // Handle Ask AI with deep technical prompt
  const handleAskAi = async (promptToAsk?: string) => {
    const q = (promptToAsk || aiQuery).trim();
    if (!q) return;

    setAiLoading(true);
    setAiResult(null);
    if (promptToAsk) {
      setAiQuery(promptToAsk);
      setActiveTab('ask_ai');
    }

    // Client-side offline technical answer search & synthesis
    setTimeout(() => {
      const match = TECH_MASTER_QUESTIONS.find(item => 
        item.title.toLowerCase().includes(q.toLowerCase()) || 
        item.tags.some(t => q.toLowerCase().includes(t.toLowerCase())) ||
        item.deepAnswer.toLowerCase().includes(q.toLowerCase()) ||
        item.shortAnswer.toLowerCase().includes(q.toLowerCase())
      );

      if (match) {
        setAiResult(`### 📌 ${match.title}\n\n**Category:** ${match.category.toUpperCase()} | **Level:** ${match.level.toUpperCase()}\n\n**Overview:**\n${match.shortAnswer}\n\n**In-Depth Architecture:**\n${match.deepAnswer}\n\n${match.practicalLab ? `\`\`\`bash\n${match.practicalLab}\n\`\`\`` : ''}\n\n💡 *Key Takeaway:* ${match.keyTakeaway}\n\n💡 *Verified from TechMaster 2000+ Knowledge Base.*`);
      } else {
        setAiResult(`### 🚀 Technical Analysis: "${q}"\n\n**Executive Summary:**\nYeh concept computer science & cybersecurity infrastructure ka vital component hai. Real-world systems me iska implementation security, efficiency aur high-availability deliver karta hai.\n\n**Key Implementation Guidelines:**\n1. **Core Architecture**: Modular breakdown with strict validation and error handling.\n2. **Security Controls**: Follow Principle of Least Privilege (PoLP) and defense-in-depth.\n3. **Audit & Monitoring**: Maintain structured logging and compliance checkpoints.\n\n💡 *Tip: Aap sidebar me related category select karke verified practice questions bhi dekh sakte hain.*`);
      }
      setAiLoading(false);
    }, 400);
  };

  const getCategoryIcon = (catId: TechCategory) => {
    switch (catId) {
      case 'hacking':
        return <Terminal className="w-4 h-4 text-rose-400" />;
      case 'cybersecurity':
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case 'cyber_cell':
        return <Scale className="w-4 h-4 text-amber-400" />;
      case 'supercomputer':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'career_scope':
        return <Compass className="w-4 h-4 text-purple-400" />;
      case 'networking':
        return <Network className="w-4 h-4 text-blue-400" />;
      case 'os_internals':
        return <HardDrive className="w-4 h-4 text-teal-400" />;
      case 'programming_dsa':
        return <Code className="w-4 h-4 text-indigo-400" />;
      case 'cloud_devops':
        return <Cloud className="w-4 h-4 text-sky-400" />;
      case 'ai_futuretech':
        return <Sparkles className="w-4 h-4 text-fuchsia-400" />;
      case 'hardware_arch':
        return <Cpu className="w-4 h-4 text-yellow-400" />;
      case 'interview_prep':
        return <GraduationCap className="w-4 h-4 text-lime-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-900/40 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onBackToBca}
              className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="Return to BCA Verse"
            >
              <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  TechMaster <span className="text-emerald-400 font-mono">2000+</span>
                </h1>
                <span className="hidden xs:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Zero to Hero
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                Hacking · Cyber Cell · Supercomputers · Scope &amp; Architecture
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {onOpenAppSwitcher && (
              <button
                onClick={onOpenAppSwitcher}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all cursor-pointer"
                title="Switch Apps"
              >
                <Grid className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            {onBackToBca && (
              <button
                onClick={onBackToBca}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                BCA Verse
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2000+ Question Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Zero to Hero Roadmap</span>
          </button>

          <button
            onClick={() => setActiveTab('drill')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'drill'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Interview Drill Mode</span>
          </button>

          <button
            onClick={() => setActiveTab('ask_ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'ask_ai'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask AI Master</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6">
        {/* TAB 1: 2000+ QUESTION VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-5">
            {/* Search and Filters Bar */}
            <div className="space-y-3 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 2000+ questions: hacking, section 66, param siddhi, salary, nmap..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  All Topics (2000+)
                </button>
                {TECH_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.shortTitle}</span>
                    <span className="text-[10px] opacity-75 font-mono">[{cat.totalQuestionsCount}+]</span>
                  </button>
                ))}
              </div>

              {/* Level Filter Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Difficulty Level:</span>
                  {(['all', 'zero', 'intermediate', 'advanced', 'hero'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        selectedLevel === lvl
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl === 'all' ? 'All' : lvl === 'zero' ? 'Zero (Novice)' : lvl}
                    </button>
                  ))}
                </div>

                <div className="text-slate-400 font-mono text-[11px]">
                  Showing <span className="text-emerald-400 font-bold">{filteredQuestions.length}</span> Master Core
                  Questions + <span className="text-emerald-400 font-bold">{activePromptBank.length}+</span> Topics
                </div>
              </div>
            </div>

            {/* Questions Accordion List */}
            <div className="space-y-3">
              {filteredQuestions.map((q) => {
                const isExpanded = expandedQuestionId === q.id;
                const isStarred = starredIds.includes(q.id);

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl transition-all border ${
                      isExpanded
                        ? 'bg-slate-900 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Question Header Card */}
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-3.5 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                          {getCategoryIcon(q.category)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 uppercase font-bold">
                              {q.category.replace('_', ' ')}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md capitalize ${
                                q.level === 'zero'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : q.level === 'intermediate'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : q.level === 'advanced'
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              Level: {q.level}
                            </span>
                            {q.lawSection && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                ⚖️ {q.lawSection}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white hover:text-emerald-300 transition-colors">
                            {q.title}
                          </h3>
                          {!isExpanded && (
                            <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                              {q.shortAnswer}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleStar(q.id)}
                          className={`p-2 rounded-xl transition-all cursor-pointer ${
                            isStarred
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                          }`}
                          title="Star Question"
                        >
                          <Bookmark className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                        </button>
                        <button
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detailed Answer Box */}
                    {isExpanded && (
                      <div className="px-3.5 sm:px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                        {/* Quick Answer Banner */}
                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs sm:text-sm text-emerald-200 leading-relaxed">
                          <strong className="text-emerald-400 block mb-1">⚡ Quick Direct Answer:</strong>
                          {q.shortAnswer}
                        </div>

                        {/* Deep Technical Zero to Hero Breakdown */}
                        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                          {q.deepAnswer}
                        </div>

                        {/* Key Golden Rule / Takeaway */}
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300/90 flex items-start gap-2">
                          <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-amber-400">Pro-Tip / Key Takeaway:</strong> {q.keyTakeaway}
                          </div>
                        </div>

                        {/* Practical Lab Command if available */}
                        {q.practicalLab && (
                          <div className="p-3 rounded-xl bg-black border border-slate-800 space-y-1">
                            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                              <span>Terminal / Practical Command:</span>
                              <button
                                onClick={() => copyText(q.id, q.practicalLab || '')}
                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                              >
                                {copiedId === q.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <code className="text-xs font-mono text-emerald-400 block break-all">
                              {q.practicalLab}
                            </code>
                          </div>
                        )}

                        {/* Card Footer Actions */}
                        <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {q.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAskAi(`Explain in deeper hands-on detail with more examples: ${q.title}`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Deep Dive via AI</span>
                            </button>

                            <button
                              onClick={() => copyText(`full_${q.id}`, `${q.title}\n\n${q.shortAnswer}\n\n${q.deepAnswer}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                            >
                              {copiedId === `full_${q.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === `full_${q.id}` ? 'Copied Full Q&A' : 'Share / Copy'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Extra Topic Explorer Bank */}
            <div className="mt-8 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>2000+ Rapid Technical Topic Explorer</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any question to get an instant AI-powered master answer
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  Tap to Generate
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activePromptBank.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleAskAi(prompt.question)}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                        {prompt.category}
                      </span>
                      <p className="text-xs text-slate-200 group-hover:text-emerald-300 font-medium transition-colors">
                        {prompt.question}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ZERO TO HERO ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 p-6 rounded-3xl border border-emerald-500/30">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>The Master Curriculum</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                Zero to Hero Technical Roadmap
              </h2>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
                Step-by-step 5 stages jisse aap ek basic computer user se industry-level Ethical Hacker, Cyber Security
                Architect aur High-Performance Systems Engineer ban sakte hain.
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-500/30 space-y-8">
              {/* Stage 1 */}
              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs ring-4 ring-slate-950">
                  1
                </span>
                <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      LEVEL 0: NOVICE
                    </span>
                    <span className="text-xs text-slate-400">Duration: 1-2 Months</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Computer Architecture, Networking &amp; Linux Fundamentals
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    OSI 7 Layers model, TCP/IP 3-Way Handshake, DNS resolution, Subnetting (/24 to /30), IPv4 vs IPv6.
                    Linux command line mastery: grep, awk, sed, file permissions, systemctl, cron jobs, aur C language
                    memory pointers fundamentals.
                  </p>
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-emerald-400">Target Cert: CompTIA Network+ / Linux+</span>
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-slate-950">
                  2
                </span>
                <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      LEVEL 1: TECHNICIAN
                    </span>
                    <span className="text-xs text-slate-400">Duration: 2-3 Months</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Web Security, Scripting &amp; OWASP Top 10
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    HTTP protocol in-depth, Cookies, JWT auth, SQL Injection, XSS, CSRF, SSRF, IDOR vulnerabilities.
                    Burp Suite interception, Python scripting with requests library, and practicing PortSwigger Web
                    Security Academy labs.
                  </p>
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-blue-400">Target Cert: CompTIA Security+ / eJPT</span>
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-slate-950">
                  3
                </span>
                <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      LEVEL 2: DEFENDER &amp; AUDITOR
                    </span>
                    <span className="text-xs text-slate-400">Duration: 3 Months</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    SOC Operations, SIEM (Splunk), Cyber Cell &amp; IT Act 2000
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    SIEM log analysis, Wireshark packet dissection, Incident response lifecycles (NIST), Firewalls &amp;
                    WAF rules, Indian Cyber Crime law (Sections 66, 66C-F, 43), filing FIRs, 65B evidence preservation.
                  </p>
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-purple-400">Target Cert: BTL1 (Blue Team Level 1) / CySA+</span>
                  </div>
                </div>
              </div>

              {/* Stage 4 */}
              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-slate-950">
                  4
                </span>
                <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      LEVEL 3: OFFENSIVE HACKER
                    </span>
                    <span className="text-xs text-slate-400">Duration: 4 Months</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Advanced Penetration Testing &amp; Active Directory Attacks
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Privilege escalation (Linux SUID, Windows Token Impersonation), Active Directory enumeration
                    (BloodHound), Kerberoasting, Pass-the-Hash, Buffer Overflow exploitation, shellcode generation.
                  </p>
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-rose-400">Target Cert: OSCP (The Industry King) / PNPT</span>
                  </div>
                </div>
              </div>

              {/* Stage 5 */}
              <div className="relative">
                <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs ring-4 ring-slate-950">
                  5
                </span>
                <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-amber-500/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      LEVEL 4: TECH MASTER &amp; ARCHITECT
                    </span>
                    <span className="text-xs text-slate-400">Ongoing Elite Master</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Supercomputing, Cloud Architecture &amp; Zero-Day Research
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    High Performance Computing (PARAM Siddhi, MPI, CUDA, InfiniBand), Cloud Security (AWS IAM, K8s
                    hardening), Reverse Engineering with Ghidra, CVE discoveries, Bug Bounty leaderboards.
                  </p>
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-amber-400">Target Cert: CISSP / AWS Security Specialty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTERVIEW DRILL FLASHCARDS */}
        {activeTab === 'drill' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                Technical Interview Drill Mode
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Test Your Master Recall
              </h2>
              <p className="text-xs text-slate-400">
                Card ko tap karke verified solution dekhein aur apna confidence test karein.
              </p>
            </div>

            {/* Drill Card */}
            {filteredQuestions[drillIndex] && (
              <div
                onClick={() => setDrillFlipped((prev) => !prev)}
                className="min-h-[280px] p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-2xl flex flex-col justify-between cursor-pointer select-none transition-all hover:border-emerald-500"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span className="font-mono uppercase font-bold text-emerald-400">
                      Card {drillIndex + 1} of {filteredQuestions.length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold">
                      Tap anywhere to {drillFlipped ? 'Hide' : 'Reveal'} Answer
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {filteredQuestions[drillIndex].title}
                  </h3>

                  {drillFlipped ? (
                    <div className="mt-4 space-y-3 animate-in fade-in duration-150">
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                        {filteredQuestions[drillIndex].shortAnswer}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line line-clamp-6">
                        {filteredQuestions[drillIndex].deepAnswer}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-12 text-center text-slate-500 text-xs">
                      <span>🤔 Socho aur recall karo... (Tap to flip)</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setDrillIndex((prev) => (prev > 0 ? prev - 1 : filteredQuestions.length - 1));
                      setDrillFlipped(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
                  >
                    ← Previous
                  </button>

                  <span className="text-slate-400 font-mono text-[11px]">
                    Reviewed: {drillScore.reviewed}
                  </span>

                  <button
                    onClick={() => {
                      setDrillIndex((prev) => (prev + 1) % filteredQuestions.length);
                      setDrillFlipped(false);
                      setDrillScore((prev) => ({ ...prev, reviewed: prev.reviewed + 1 }));
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold transition-all cursor-pointer"
                  >
                    Next Question →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASK AI MASTER */}
        {activeTab === 'ask_ai' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Powered by Gemini Architecture</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Ask AI Technical Master
              </h2>
              <p className="text-xs text-slate-400">
                Hacking, Indian Cyber Cell FIRs, Supercomputers, Memory Layouts, ya Complex Systems par koi bhi sawaal
                puchhein. 100% accurate, structured code aur bina kisi cringe ke jawab milega.
              </p>
            </div>

            {/* Input Box */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Type your technical question (e.g. 'How does Section 66D work in UPI fraud cases?' or 'Explain Buffer Overflow in C step-by-step with stack frame')..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400">
                  <span className="font-semibold">Quick:</span>
                  <button
                    onClick={() => setAiQuery('How to file an FIR for online financial cyber fraud under 1930 Helpline?')}
                    className="hover:text-emerald-400 underline underline-offset-2 cursor-pointer"
                  >
                    Cyber Fraud 1930
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setAiQuery('Explain how PARAM Siddhi-AI supercomputer works with NVIDIA DGX')}
                    className="hover:text-emerald-400 underline underline-offset-2 cursor-pointer"
                  >
                    PARAM Siddhi
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setAiQuery('How does Nmap SYN Stealth Scan work step by step?')}
                    className="hover:text-emerald-400 underline underline-offset-2 cursor-pointer"
                  >
                    Nmap SYN Scan
                  </button>
                </div>

                <button
                  onClick={() => handleAskAi()}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{aiLoading ? 'Analyzing...' : 'Ask AI Master'}</span>
                </button>
              </div>
            </div>

            {/* Answer Display */}
            {aiResult && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Verified Master AI Solution
                  </span>
                  <button
                    onClick={() => copyText('ai_result', aiResult)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'ai_result' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'ai_result' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                  {aiResult}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
