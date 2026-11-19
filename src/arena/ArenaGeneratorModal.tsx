import React, { useState } from 'react';
import { Sparkles, X, AlertTriangle, Wand2, Layers, Cpu } from 'lucide-react';
import {
  ARENA_CATEGORIES,
  ARENA_DIFFICULTIES,
  ARENA_LAYERS,
  ArenaCategory,
  ArenaDifficulty,
  ArenaLayer,
  ArenaProblem,
  DIFFICULTY_XP,
} from './arenaTypes';

interface ArenaGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingTitles: string[];
  onProblemGenerated: (problem: ArenaProblem) => void;
}

function buildOfflineChallenge(
  category: ArenaCategory,
  difficulty: ArenaDifficulty,
  layer: ArenaLayer,
  topicInput: string
): ArenaProblem {
  const cleanTopic = topicInput.trim() || `${category} Trust Boundary`;
  const slug = `${category}-${cleanTopic}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 36);

  const isAwareness = layer === 'AWARENESS' || category === 'Awareness';
  return {
    id: `local-${slug}-${Date.now().toString(36)}`,
    title: isAwareness
      ? `Know Your Enemy: ${cleanTopic} Defense Drill`
      : `Harden ${cleanTopic} in ${category}`,
    category,
    difficulty,
    layer: isAwareness ? 'AWARENESS' : 'DEFENSIVE',
    issueType: isAwareness ? 'Security' : 'Bug',
    bountyXp: DIFFICULTY_XP[difficulty],
    rareBadge: difficulty === 'Expert' ? `${category} Sentinel` : undefined,
    context: `Real engineering teams regularly triage ${cleanTopic} anomalies during production audits and incident reviews.`,
    problemStatement: isAwareness
      ? `A defender received an alert involving ${cleanTopic} with [redacted_sample] telemetry. Review the red flags below, distinguish genuine risk from false positives, and outline the defensive response and verification steps.`
      : `An internal service handling ${cleanTopic} failed a ${difficulty.toLowerCase()} reliability and security review using [benign_test_input]. Design a clean, defensive implementation that enforces strict validation, least privilege, and deterministic error handling.`,
    codeSnippet: `// Mock Defender Sandbox (${cleanTopic})\nfunction validateInput(sample) {\n  // Review [benign_test_input] against allowlist rules\n  return typeof sample === 'string' && sample.length <= 128;\n}`,
    language: 'javascript',
    starterCode: `// Defensive solution for: ${cleanTopic}\nfunction mitigate(event) {\n  // 1. Validate structure & allowlist fields\n  // 2. Enforce authorization & rate limits\n  // 3. Return safe sanitized outcome\n  return { allowed: true, sanitized: String(event ?? '') };\n}\nconsole.log(mitigate('[benign_test_input]'));\n`,
    redFlags: [
      `Unexpected [mock_request] parameter format or untrusted origin touching ${cleanTopic}`,
      'Missing server-side schema validation or authorization boundary checks',
      'Verbose stack traces or unredacted internal metadata exposed in responses',
    ],
    defensiveFix: `Enforce strict allowlist validation, least-privilege access controls, structured audit logging, and safe error responses across every ${cleanTopic} entry point.`,
    safePractice: `Use the local JS editor on the right to test [benign_test_input] edge cases (empty values, oversized strings, unexpected types) and verify your guard function rejects malformed input cleanly.`,
    hints: [
      `Identify the exact trust boundary where untrusted data enters ${cleanTopic}.`,
      'Prefer strict allowlists and parameterized/typed interfaces over ad-hoc blocklists.',
      'Validate input shape, enforce caller permissions server-side, and log redacted telemetry.',
    ],
    solution: `Validate input types and length against an explicit allowlist, enforce server-side authorization before state mutations, and return generic safe error messages while logging redacted diagnostics internally.`,
    isRunnableJs: true,
    keywords: [category.toLowerCase(), cleanTopic.toLowerCase(), layer.toLowerCase(), 'defense'],
    isAiGenerated: true,
  };
}

export const ArenaGeneratorModal: React.FC<ArenaGeneratorModalProps> = ({
  isOpen,
  onClose,
  existingTitles,
  onProblemGenerated,
}) => {
  const [category, setCategory] = useState<ArenaCategory>('Web Dev');
  const [difficulty, setDifficulty] = useState<ArenaDifficulty>('Medium');
  const [layer, setLayer] = useState<ArenaLayer>('DEFENSIVE');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateOffline = () => {
    setErrorMsg(null);
    setIsGenerating(true);
    window.setTimeout(() => {
      const created = buildOfflineChallenge(category, difficulty, layer, topic);
      onProblemGenerated(created);
      setTopic('');
      setIsGenerating(false);
      onClose();
    }, 550);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/arena/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          difficulty,
          layer,
          topic: topic.trim(),
          existingTitles: existingTitles.slice(0, 25),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.problem) {
        throw new Error(data.error || `Generation failed (HTTP ${response.status})`);
      }
      onProblemGenerated({
        ...(data.problem as ArenaProblem),
        layer,
      });
      setTopic('');
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          'AI generator is unavailable right now. You can use Instant Offline Mode below.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      onClick={isGenerating ? undefined : onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white truncate">
                Generate New Challenge
              </h2>
              <p className="text-xs text-slate-400 truncate">
                Dual-Layer Defensive &amp; Awareness Scenario Builder
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close generator modal"
              className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {isGenerating ? (
            <div className="space-y-4 py-2" aria-live="polite">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-cyan-300">
                <Wand2 className="w-4 h-4 animate-spin" />
                <span>
                  Architecting a {layer.toLowerCase()} {difficulty} {category} challenge...
                </span>
              </div>
              <div className="space-y-3 animate-pulse">
                <div className="h-5 w-3/4 rounded-lg bg-slate-800" />
                <div className="h-3.5 w-full rounded-lg bg-slate-800/80" />
                <div className="h-3.5 w-5/6 rounded-lg bg-slate-800/80" />
                <div className="h-24 w-full rounded-xl bg-slate-950/90 border border-slate-800" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-9 rounded-xl bg-slate-800/70" />
                  <div className="h-9 rounded-xl bg-slate-800/70" />
                  <div className="h-9 rounded-xl bg-slate-800/70" />
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Building defender scenario, red-flag checklist, 3 progressive hints, and safe fix...
              </p>
            </div>
          ) : (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Challenge Layer
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ARENA_LAYERS.map((l) => {
                    const active = layer === l;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLayer(l)}
                        className={`h-10 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          active
                            ? l === 'AWARENESS'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {l === 'DEFENSIVE' ? 'Layer A: Defensive Build' : 'Layer B: Threat Awareness'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArenaCategory)}
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ARENA_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ARENA_DIFFICULTIES.map((diff) => {
                    const active = difficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setDifficulty(diff)}
                        className={`h-10 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                          active
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Topic or Keyword (Optional)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., SPF/DMARC, MFA Rate Limit, EXIF Privacy, Redis Cache..."
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateOffline}
                  className="h-10 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Instant Offline</span>
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-cyan-600/25 cursor-pointer transition-all whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Generate</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

