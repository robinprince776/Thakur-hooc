import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Eye,
  FileCode2,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Terminal,
  X,
  ShieldCheck,
  CheckSquare,
  Square,
  FlaskConical,
} from 'lucide-react';
import {
  ArenaAiReview,
  ArenaProblem,
  HINT_PENALTIES,
  SOLUTION_PENALTY,
} from './arenaTypes';
import { useArenaStore } from '../store/useArenaStore';

interface ArenaWorkspaceModalProps {
  problem: ArenaProblem;
  onClose: () => void;
}

function getDifficultyColor(diff: ArenaProblem['difficulty']): string {
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

export const ArenaWorkspaceModal: React.FC<ArenaWorkspaceModalProps> = ({
  problem,
  onClose,
}) => {
  const {
    solvedMap,
    revealedHintsMap,
    revealedSolutionMap,
    draftCodeMap,
    revealHint,
    revealSolution,
    saveDraftCode,
    markSolved,
    recordAttempt,
  } = useArenaStore();

  const solvedRecord = solvedMap[problem.id];
  const revealedHints = revealedHintsMap[problem.id] || [];
  const isSolutionRevealed = Boolean(revealedSolutionMap[problem.id]);

  const initialCode =
    draftCodeMap[problem.id] ??
    solvedRecord?.savedCode ??
    problem.starterCode ??
    '// Write your solution, SQL query, or architecture notes here...\n';

  const [code, setCode] = useState(initialCode);
  const [mobilePane, setMobilePane] = useState<'problem' | 'editor' | 'hints'>('problem');
  const [openHintIdx, setOpenHintIdx] = useState<number | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedEditor, setCopiedEditor] = useState(false);
  const [checkedFlags, setCheckedFlags] = useState<Record<number, boolean>>({});

  // Local JS Sandbox state
  const [sandboxLogs, setSandboxLogs] = useState<string[] | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  // AI Code Review state
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [aiReview, setAiReview] = useState<ArenaAiReview | null>(null);

  // Self-Evaluation Modal
  const [showSelfEval, setShowSelfEval] = useState(false);
  const [solveBanner, setSolveBanner] = useState<{
    earnedXp: number;
    solvedWithHelp: boolean;
    badgeEarned?: string;
  } | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSelfEval) setShowSelfEval(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showSelfEval, onClose]);

  const handleCodeChange = (next: string) => {
    setCode(next);
    saveDraftCode(problem.id, next);
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = `${code.slice(0, start)}  ${code.slice(end)}`;
      handleCodeChange(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  const handleRunSandbox = () => {
    setSandboxError(null);
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) =>
        logs.push(
          args
            .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
            .join(' ')
        ),
      warn: (...args: any[]) => logs.push(`[warn] ${args.map(String).join(' ')}`),
      error: (...args: any[]) => logs.push(`[error] ${args.map(String).join(' ')}`),
    };

    try {
      // Isolated local JS evaluation with captured console output
      const runner = new Function('console', `"use strict";\n${code}`);
      const ret = runner(customConsole);
      if (ret !== undefined) {
        logs.push(`=> ${typeof ret === 'object' ? JSON.stringify(ret) : String(ret)}`);
      }
      setSandboxLogs(logs.length > 0 ? logs : ['Executed cleanly (no console output).']);
    } catch (err: any) {
      setSandboxError(err?.message || String(err));
      setSandboxLogs(logs.length > 0 ? logs : null);
    }
  };

  const handleAiReview = async () => {
    setReviewError(null);
    setAiReview(null);
    setIsReviewing(true);
    try {
      const res = await fetch('/api/arena/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: problem.title,
          category: problem.category,
          problemStatement: problem.problemStatement,
          userCode: code,
          expectedSolution: problem.solution,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.review) {
        throw new Error(data.error || `Review failed (HTTP ${res.status})`);
      }
      setAiReview(data.review as ArenaAiReview);
    } catch (err: any) {
      setReviewError(err?.message || 'AI code review unavailable right now.');
    } finally {
      setIsReviewing(false);
    }
  };

  const handleToggleHint = (idx: number) => {
    if (!revealedHints.includes(idx)) {
      revealHint(problem.id, idx);
    }
    setOpenHintIdx((prev) => (prev === idx ? null : idx));
  };

  const handleConfirmSolved = () => {
    const result = markSolved(problem, code);
    setSolveBanner(result);
    setShowSelfEval(false);
  };

  const handleNeedSolution = () => {
    recordAttempt(false);
    revealSolution(problem.id);
    setShowSelfEval(false);
    setMobilePane('hints');
  };

  const copyText = async (text: string, which: 'snippet' | 'editor') => {
    try {
      await navigator.clipboard.writeText(text);
      if (which === 'snippet') {
        setCopiedSnippet(true);
        setTimeout(() => setCopiedSnippet(false), 1600);
      } else {
        setCopiedEditor(true);
        setTimeout(() => setCopiedEditor(false), 1600);
      }
    } catch {}
  };

  const lineCount = Math.max(12, code.split('\n').length);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-xl flex flex-col text-slate-100 animate-fade-in">
      {/* Top Workspace Header */}
      <header className="h-16 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close challenge workspace"
            className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-cyan-400">{problem.category}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">{problem.issueType}</span>
              {problem.layer === 'AWARENESS' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-amber-300">Know Your Enemy</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="font-mono text-amber-400 tabular-nums">+{problem.bountyXp} XP</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate">
              {problem.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {solvedRecord && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4" />
              <span>{solvedRecord.solvedWithHelp ? 'Solved with Help' : 'Solved'}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowSelfEval(true)}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer whitespace-nowrap transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Solution</span>
          </button>
        </div>
      </header>

      {/* Solve Confirmation Banner */}
      {solveBanner && (
        <div className="px-4 sm:px-6 py-2.5 bg-emerald-950/70 border-b border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-200 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Challenge archived!{' '}
              {solveBanner.earnedXp > 0
                ? `Earned +${solveBanner.earnedXp} XP`
                : 'Solution updated in your Solved Archive.'}
              {solveBanner.solvedWithHelp ? ' (Marked Solved with Help)' : ''}
            </span>
            {solveBanner.badgeEarned && (
              <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                · Unlocked Rare Badge: {solveBanner.badgeEarned}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
          >
            Back to Arena
          </button>
        </div>
      )}

      {/* Mobile Pane Switcher */}
      <div className="lg:hidden px-4 py-2 border-b border-slate-800 bg-slate-900/70 grid grid-cols-3 gap-1.5 shrink-0">
        {(
          [
            { id: 'problem', label: 'Problem' },
            { id: 'editor', label: 'Editor' },
            { id: 'hints', label: `Hints (${revealedHints.length}/3)` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobilePane(tab.id)}
            className={`h-9 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              mobilePane === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-800/70 text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main 3-Pane Split Workspace */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Row: Left (Problem) + Right (Code Editor) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden">
          {/* LEFT PANE: Problem Statement & Real-World Impact */}
          <section
            className={`${
              mobilePane === 'problem' ? 'flex' : 'hidden'
            } lg:flex flex-col min-h-0 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-950/60`}
          >
            {/* Real-World Impact */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-1.5">
              <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Real-World Impact</span>
                {problem.rareBadge && (
                  <span className="text-amber-300 font-normal">
                    · Rare Badge Bounty: {problem.rareBadge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {problem.context}
              </p>
            </div>

            {/* Problem Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                {problem.layer === 'AWARENESS'
                  ? 'Threat Scenario (Defender View)'
                  : 'Challenge Brief'}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {problem.problemStatement}
              </p>
            </div>

            {/* Dual-Layer Red Flags Detection Checklist */}
            {problem.redFlags && problem.redFlags.length > 0 && (
              <div className="rounded-2xl bg-slate-900/80 border border-amber-500/25 p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Red Flags to Spot (Detection Checklist)</span>
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {Object.values(checkedFlags).filter(Boolean).length}/{problem.redFlags.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {problem.redFlags.map((flag, idx) => {
                    const isChecked = Boolean(checkedFlags[idx]);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setCheckedFlags((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-start gap-2.5 transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{flag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Safe Practice Exercise */}
            {problem.safePractice && (
              <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/25 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Safe Practice Exercise</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {problem.safePractice}
                </p>
              </div>
            )}

            {/* Defensive Response (shown for Awareness cards or once solved/revealed) */}
            {problem.defensiveFix &&
              (problem.layer === 'AWARENESS' || isSolutionRevealed || Boolean(solvedRecord)) && (
                <div className="rounded-2xl bg-emerald-950/35 border border-emerald-500/30 p-4 space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Defensive Response &amp; Mitigation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    {problem.defensiveFix}
                  </p>
                </div>
              )}

            {/* Syntax-Styled Snippet */}
            {problem.codeSnippet && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{problem.language || 'snippet'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(problem.codeSnippet || '', 'snippet')}
                    className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-100 overflow-x-auto leading-relaxed">
                  {problem.codeSnippet}
                </pre>
              </div>
            )}

            {/* Keywords */}
            {problem.keywords.length > 0 && (
              <div className="text-xs text-slate-500 pt-1">
                Topics: {problem.keywords.join(' · ')}
              </div>
            )}
          </section>

          {/* RIGHT PANE: Monaco-Style Lightweight Code Editor + Sandbox + AI Review */}
          <section
            className={`${
              mobilePane === 'editor' ? 'flex' : 'hidden'
            } lg:flex flex-col min-h-0 bg-[#0B1120] overflow-hidden`}
          >
            {/* Editor Toolbar */}
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>solution.{problem.language === 'sql' ? 'sql' : problem.language === 'python' ? 'py' : problem.language === 'bash' ? 'sh' : 'js'}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCodeChange(problem.starterCode || '')}
                  className="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset editor to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyText(code, 'editor')}
                  className="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedEditor ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEditor ? 'Copied' : 'Copy'}</span>
                </button>

                {(problem.isRunnableJs || problem.language === 'javascript') && (
                  <button
                    type="button"
                    onClick={handleRunSandbox}
                    className="h-8 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run JS</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleAiReview}
                  disabled={isReviewing}
                  className="h-8 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isReviewing ? 'Reviewing...' : 'AI Review'}</span>
                </button>
              </div>
            </div>

            {/* Editor Surface with Line Numbers */}
            <div className="flex-1 min-h-[200px] flex overflow-auto font-mono text-xs sm:text-sm">
              <div
                aria-hidden="true"
                className="select-none py-4 px-3 text-right text-slate-600 bg-slate-950/60 border-r border-slate-800/80 leading-6 tabular-nums"
              >
                {Array.from({ length: lineCount }, (_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                aria-label="Solution code editor"
                className="flex-1 p-4 bg-transparent text-slate-100 leading-6 resize-none focus:outline-none min-w-0"
              />
            </div>

            {/* Sandbox & AI Review Console Output */}
            {(sandboxLogs || sandboxError || aiReview || reviewError) && (
              <div className="max-h-52 overflow-y-auto border-t border-slate-800 bg-slate-950/95 p-3.5 space-y-3 text-xs shrink-0">
                {(sandboxLogs || sandboxError) && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <span className="inline-flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Local JS Sandbox Output</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSandboxLogs(null);
                          setSandboxError(null);
                        }}
                        className="text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    {sandboxLogs?.map((line, i) => (
                      <div key={i} className="font-mono text-emerald-300 whitespace-pre-wrap">
                        {line}
                      </div>
                    ))}
                    {sandboxError && (
                      <div className="font-mono text-rose-400 whitespace-pre-wrap">
                        RuntimeError: {sandboxError}
                      </div>
                    )}
                  </div>
                )}

                {reviewError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{reviewError}</span>
                  </div>
                )}

                {aiReview && (
                  <div className="rounded-xl bg-slate-900 border border-cyan-500/30 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-cyan-300 inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Code Review · Verdict: {aiReview.verdict.replace('_', ' ')}</span>
                      </span>
                      <span className="font-mono font-bold text-white tabular-nums">
                        {aiReview.score}/100
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{aiReview.summary}</p>
                    {aiReview.strengths.length > 0 && (
                      <div className="text-emerald-300">
                        <strong>Strengths:</strong> {aiReview.strengths.join(' · ')}
                      </div>
                    )}
                    {aiReview.improvements.length > 0 && (
                      <div className="text-amber-300">
                        <strong>Improvements:</strong> {aiReview.improvements.join(' · ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* BOTTOM PANE: 3-Level Progressive Hints Accordion + Reference Solution */}
        <section
          className={`${
            mobilePane === 'hints' ? 'flex' : 'hidden'
          } lg:flex flex-col border-t border-slate-800 bg-slate-900/95 max-h-[42vh] lg:max-h-56 overflow-y-auto shrink-0`}
        >
          <div className="px-4 sm:px-6 py-3 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Progressive Hints &amp; Reference Solution</span>
              </div>
              <button
                type="button"
                onClick={() => revealSolution(problem.id)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isSolutionRevealed
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {isSolutionRevealed
                    ? 'Reference Solution Unlocked'
                    : `Reveal Solution (-${SOLUTION_PENALTY} XP)`}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {problem.hints.slice(0, 3).map((hintText, idx) => {
                const isRevealed = revealedHints.includes(idx);
                const isExpanded = openHintIdx === idx && isRevealed;
                const labels = ['Hint 1 · Concept', 'Hint 2 · Direction', 'Hint 3 · Near-Solution'];
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleHint(idx)}
                      className="w-full px-3 py-2.5 flex items-center justify-between gap-2 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <span className="truncate">
                        {labels[idx] || `Hint ${idx + 1}`}{' '}
                        {!isRevealed && (
                          <span className="text-amber-400 font-mono">(-{HINT_PENALTIES[idx]} XP)</span>
                        )}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 text-xs text-slate-300 border-t border-slate-800/80 leading-relaxed">
                        {hintText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isSolutionRevealed && (
              <div className="rounded-xl bg-slate-950 border border-purple-500/35 p-4 space-y-1.5">
                <div className="text-xs font-bold text-purple-300">
                  Reference Solution &amp; Explanation
                </div>
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {problem.solution}
                </pre>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Self-Evaluate Modal on Submit */}
      {showSelfEval && (
        <div
          onClick={() => setShowSelfEval(false)}
          className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-white">Self-Evaluate Your Solution</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Compare your answer against the challenge requirements (or run the local JS sandbox / AI Review). Did your solution solve the problem cleanly?
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleConfirmSolved}
                className="flex-1 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Yes, I solved it! (+{problem.bountyXp} XP)</span>
              </button>
              <button
                type="button"
                onClick={handleNeedSolution}
                className="flex-1 h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Show Solution</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
