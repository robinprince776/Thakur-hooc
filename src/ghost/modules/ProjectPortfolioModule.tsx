import React, { useState } from 'react';
import { Copy, Check, Plus, Trash2, FileCheck2, Download } from 'lucide-react';
import { ModuleFrame } from '../components/ModuleFrame';
import { useGhostStore } from '../../store/useGhostStore';

export const ProjectPortfolioModule: React.FC = () => {
  const savedReports = useGhostStore((s) => s.savedReports);
  const addReport = useGhostStore((s) => s.addReport);
  const deleteReport = useGhostStore((s) => s.deleteReport);
  const completedMissions = useGhostStore((s) => s.completedMissions);
  const xp = useGhostStore((s) => s.xp);
  const rankTitle = useGhostStore((s) => s.rankTitle);

  const [title, setTitle] = useState('');
  const [scope, setScope] = useState('Simulated Enterprise Network 10.24.0.0/24');
  const [finding, setFinding] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !finding.trim()) return;
    addReport({
      title: title.trim(),
      scope: scope.trim() || 'Sandbox Lab',
      severity,
      findings: [finding.trim()],
      recommendation: recommendation.trim() || 'Apply least-privilege access controls and continuous monitoring.',
      sourceModule: 'portfolio',
    });
    setTitle('');
    setFinding('');
    setRecommendation('');
  };

  const buildMarkdown = (id: string) => {
    const rep = savedReports.find((r) => r.id === id);
    if (!rep) return null;
    return {
      rep,
      md: [
        `# ${rep.title}`,
        `- **Date:** ${rep.createdAt}`,
        `- **Operator Rank:** ${rankTitle} (${xp} XP)`,
        `- **Scope:** ${rep.scope}`,
        `- **Severity:** ${rep.severity}`,
        `\n## Key Findings`,
        ...rep.findings.map((f) => `- ${f}`),
        `\n## Defensive Recommendation`,
        rep.recommendation,
      ].join('\n'),
    };
  };

  const copyMarkdown = (id: string) => {
    const built = buildMarkdown(id);
    if (!built) return;
    navigator.clipboard?.writeText(built.md).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const downloadMarkdown = (id: string) => {
    const built = buildMarkdown(id);
    if (!built) return;
    const blob = new Blob([built.md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${built.rep.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ModuleFrame moduleId="portfolio">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form
          onSubmit={handleGenerateReport}
          className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-3.5"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FileCheck2 className="w-4 h-4 text-[#00FF41]" />
            <span>Draft Assessment Report</span>
          </div>
          <p className="text-xs text-slate-400">
            Missions completed automatically generate entries here, or author a custom defensive audit summary.
          </p>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DMZ Web API Hardening Audit"
              className="w-full px-3 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-2.5 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 text-xs text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Scope</label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-2.5 py-2 min-h-[40px] rounded-lg bg-[#060910] border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Primary Finding</label>
            <textarea
              rows={2}
              value={finding}
              onChange={(e) => setFinding(e.target.value)}
              placeholder="Describe observed misconfiguration or telemetry anomaly..."
              className="w-full p-2.5 rounded-lg bg-[#060910] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Mitigation Recommendation</label>
            <textarea
              rows={2}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="State concrete remediation steps..."
              className="w-full p-2.5 rounded-lg bg-[#060910] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 min-h-[44px] rounded-lg bg-[#00FF41] hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Security Portfolio</span>
          </button>
        </form>

        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-white">
              Generated Portfolio Reports ({savedReports.length})
            </span>
            <span className="font-ghost-mono text-[#00E5FF]">
              Missions Logged: {completedMissions.length}
            </span>
          </div>

          {savedReports.map((rep) => (
            <div
              key={rep.id}
              className="rounded-xl border border-slate-800 bg-[#0D1322] p-5 space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-ghost-mono text-[#00E5FF]">
                    {rep.createdAt} · {rep.scope} ·{' '}
                    <span className={rep.severity === 'High' || rep.severity === 'Critical' ? 'text-[#FF003C]' : 'text-amber-300'}>
                      {rep.severity}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">{rep.title}</h4>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyMarkdown(rep.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg border border-slate-700 hover:border-[#00E5FF] text-xs text-slate-200 cursor-pointer"
                  >
                    {copiedId === rep.id ? (
                      <Check className="w-3.5 h-3.5 text-[#00FF41]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#00E5FF]" />
                    )}
                    <span>{copiedId === rep.id ? 'Copied' : 'Copy MD'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadMarkdown(rep.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-lg border border-slate-700 hover:border-[#00FF41] text-xs text-slate-200 cursor-pointer"
                    title="Download Markdown Report"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00FF41]" />
                    <span>Save .MD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReport(rep.id)}
                    className="p-2 min-h-[36px] rounded-lg border border-slate-800 text-slate-400 hover:text-[#FF003C] cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {rep.findings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-[#00FF41]">
                <strong>Recommendation:</strong> <span className="text-slate-200">{rep.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModuleFrame>
  );
};
