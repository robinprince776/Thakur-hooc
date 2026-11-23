import React, { useState } from 'react';
import {
  ArrowLeft,
  Grid,
  Sparkles,
  Layers,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Download,
  FolderPlus,
  FolderKanban,
  Trash2,
  AlertTriangle,
  Plus,
  FileText,
  Clock,
  Cpu,
  Check,
} from 'lucide-react';
import { useGamificationStore } from '../store/useGamificationStore';
import { useTranslation } from '../store/useLanguageStore';

interface CapstoneGeneratorAppProps {
  onBackToBca: () => void;
  onOpenAppSwitcher: () => void;
}

interface CapstoneComponent {
  layer: string;
  technology: string;
  responsibility: string;
}

interface CapstoneWeek {
  weekNumber: number;
  title: string;
  milestone: string;
  tasks: string[];
  deliverables: string[];
}

interface CapstoneSecurityItem {
  area: string;
  risk: string;
  mitigation: string;
}

interface GeneratedCapstone {
  title: string;
  tagline: string;
  problemStatement: string;
  targetUsers: string;
  estimatedHours: number;
  architectureOverview: string;
  dataFlow: string;
  architectureComponents: CapstoneComponent[];
  weeks: CapstoneWeek[];
  securityConsiderations: CapstoneSecurityItem[];
  resumeBullets: string[];
  githubChecklist: string[];
  skills: string[];
  domain: string;
  difficulty: string;
}

const PRESET_SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'Cyber Security',
  'PostgreSQL / SQL',
  'Docker & Cloud',
  'AI / LLMs',
  'Networking',
  'Linux & Bash',
  'Java',
  'C / C++',
  'REST & GraphQL',
  'Tailwind CSS',
  'System Design',
  'DevSecOps',
];

const DOMAINS = [
  'Cybersecurity & Zero-Trust',
  'Healthcare & Clinical Systems',
  'FinTech & Fraud Prevention',
  'Cloud & DevOps Automation',
  'Developer Productivity Tools',
  'EdTech & Interactive Learning',
];

const DIFFICULTIES = ['Intermediate', 'Advanced', 'Production Senior'] as const;

export const CapstoneGeneratorApp: React.FC<CapstoneGeneratorAppProps> = ({
  onBackToBca,
  onOpenAppSwitcher,
}) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { portfolioProjects, addPortfolioProject, removePortfolioProject, xp } = useGamificationStore();

  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'Python', 'Cyber Security']);
  const [customSkill, setCustomSkill] = useState('');
  const [domain, setDomain] = useState<string>(DOMAINS[0]);
  const [difficulty, setDifficulty] = useState<string>('Advanced');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [activeView, setActiveView] = useState<'builder' | 'portfolio'>('builder');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [project, setProject] = useState<GeneratedCapstone | null>(null);
  const [savedTitle, setSavedTitle] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : prev.length < 10 ? [...prev, skill] : prev
    );
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customSkill.trim();
    if (!cleaned) return;
    if (!selectedSkills.includes(cleaned) && selectedSkills.length < 10) {
      setSelectedSkills((prev) => [...prev, cleaned]);
    }
    setCustomSkill('');
  };

  const handleGenerate = async () => {
    if (selectedSkills.length === 0) {
      setErrorMsg(
        language === 'hi'
          ? 'Kam se kam ek skill select karein.'
          : 'Select at least one skill before generating a roadmap.'
      );
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setSavedTitle(null);

    try {
      const response = await fetch('/api/capstone/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: selectedSkills,
          domain,
          difficulty,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || `Generation failed (HTTP ${response.status})`);
      }

      if (!data?.project) {
        throw new Error('Unexpected response format from capstone generator.');
      }

      setProject(data.project);
      setActiveWeek(1);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to generate capstone roadmap. Check server configuration and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isAlreadySaved = project
    ? savedTitle === project.title || portfolioProjects.some((p) => p.title === project.title)
    : false;

  const handleAddToPortfolio = () => {
    if (!project || isAlreadySaved) return;
    addPortfolioProject({
      title: project.title,
      tagline: project.tagline,
      domain: project.domain,
      difficulty: project.difficulty,
      skills: project.skills,
      problemStatement: project.problemStatement,
      architectureOverview: project.architectureOverview,
      securityHighlights: project.securityConsiderations.map((s) => `${s.area}: ${s.mitigation}`),
      weeksCount: project.weeks.length || 4,
    });
    setSavedTitle(project.title);
  };

  const handleDownloadMarkdown = () => {
    if (!project) return;
    const lines: string[] = [
      `# ${project.title}`,
      `> ${project.tagline}`,
      '',
      `**Domain:** ${project.domain} | **Level:** ${project.difficulty} | **Est. Effort:** ${project.estimatedHours} hrs`,
      `**Tech Stack:** ${project.skills.join(', ')}`,
      '',
      '## Problem Statement',
      project.problemStatement,
      '',
      `**Target Users:** ${project.targetUsers}`,
      '',
      '## System Architecture',
      project.architectureOverview,
      '',
      `**Data Flow:** \`${project.dataFlow}\``,
      '',
      ...project.architectureComponents.map(
        (c) => `- **${c.layer} (${c.technology})**: ${c.responsibility}`
      ),
      '',
      '## 4-Week Implementation Roadmap',
      ...project.weeks.flatMap((w) => [
        `### Week ${w.weekNumber}: ${w.title}`,
        `**Milestone:** ${w.milestone}`,
        '**Tasks:**',
        ...w.tasks.map((task) => `- [ ] ${task}`),
        '**Deliverables:**',
        ...w.deliverables.map((d) => `- ${d}`),
        '',
      ]),
      '## Security & Hardening Considerations',
      ...project.securityConsiderations.map(
        (s) => `- **${s.area}** — *Risk:* ${s.risk} | *Defense:* ${s.mitigation}`
      ),
      '',
      '## Resume Impact Bullets',
      ...project.resumeBullets.map((b) => `- ${b}`),
      '',
      '## GitHub Portfolio Checklist',
      ...project.githubChecklist.map((c) => `- [ ] ${c}`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 48)}-roadmap.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackToBca}
            className="h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">BCA Verse</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {t('capstoneTitle')}
            </h1>
            <div className="text-[11px] text-slate-400 font-mono tabular-nums truncate">
              4-Week Roadmaps · {portfolioProjects.length} Saved · {xp.toLocaleString()} XP
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleLanguage}
            className="h-10 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className={language === 'en' ? 'text-cyan-400' : 'opacity-60'}>A</span>
            <span className="opacity-40 mx-0.5">/</span>
            <span className={language === 'hi' ? 'text-emerald-400' : 'opacity-60'}>अ</span>
          </button>

          <button
            type="button"
            onClick={onOpenAppSwitcher}
            className="h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Grid className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">{t('navApps')}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Segmented Workspace Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t('capstoneTitle')}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('capstoneSubtitle')}
            </p>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('builder')}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'builder'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('portfolio')}
              className={`h-9 px-3.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeView === 'portfolio'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>{t('profilePortfolioTab')} ({portfolioProjects.length})</span>
            </button>
          </div>
        </div>

        {activeView === 'portfolio' ? (
          <section className="space-y-4">
            {portfolioProjects.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <FolderKanban className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">Your Capstone Portfolio is Empty</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Select your skills in the Generator tab to build a 4-week architecture blueprint and save it directly to your profile portfolio.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('builder')}
                  className="h-10 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Open Capstone Generator
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {portfolioProjects.map((item) => (
                  <article
                    key={item.id}
                    className="p-6 rounded-2xl bg-slate-900/75 border border-slate-800 flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-xs font-mono text-cyan-400">
                            {item.domain} · {item.difficulty} · {item.weeksCount} Weeks
                          </div>
                          <h3 className="text-base font-bold text-white">{item.title}</h3>
                          <p className="text-xs text-slate-400">{item.tagline}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePortfolioProject(item.id)}
                          aria-label="Delete saved project"
                          className="h-9 w-9 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{item.problemStatement}</p>

                      <div className="pt-2 border-t border-slate-800 space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-400">Architecture Summary</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.architectureOverview}</p>
                      </div>

                      <div className="text-xs font-mono text-slate-400 pt-1">
                        {item.skills.join(' · ')}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-500 font-mono tabular-nums">
                      <span>Saved {item.createdAt}</span>
                      <span>{item.securityHighlights.length} Security Controls</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT PANEL: Skill & Domain Configurator */}
            <aside className="lg:col-span-4 rounded-2xl bg-slate-900/75 border border-slate-800 p-5 space-y-5">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">
                    {t('capstoneSelectSkills')}
                  </label>
                  <span className="text-xs font-mono tabular-nums text-cyan-400">
                    {selectedSkills.length}/10
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PRESET_SKILLS.map((skill) => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`h-9 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill Input */}
                <form onSubmit={handleAddCustomSkill} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add custom skill (e.g. Rust, Redis)..."
                    className="flex-1 h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    aria-label="Add custom skill"
                    className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Domain Selector */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <label htmlFor="capstone-domain" className="block text-xs font-bold text-white">
                  Industry Domain
                </label>
                <select
                  id="capstone-domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Segmented Control */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="block text-xs font-bold text-white">Engineering Depth</span>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
                  {DIFFICULTIES.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`h-9 px-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                        difficulty === level
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {level.replace('Production ', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate CTA */}
              <button
                type="button"
                disabled={isGenerating || selectedSkills.length === 0}
                onClick={handleGenerate}
                className="w-full h-11 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{isGenerating ? 'Architecting 4-Week Plan...' : t('capstoneGenerateBtn')}</span>
              </button>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}
            </aside>

            {/* RIGHT PANEL: Generated 4-Week Capstone Roadmap */}
            <section className="lg:col-span-8 space-y-5">
              {isGenerating ? (
                <div className="rounded-2xl bg-slate-900/75 border border-slate-800 p-6 space-y-5 animate-pulse">
                  <div className="h-6 w-2/3 bg-slate-800 rounded-lg" />
                  <div className="h-4 w-full bg-slate-800/80 rounded-lg" />
                  <div className="h-4 w-5/6 bg-slate-800/80 rounded-lg" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="h-24 bg-slate-800/60 rounded-xl" />
                    <div className="h-24 bg-slate-800/60 rounded-xl" />
                  </div>
                  <div className="h-40 bg-slate-800/50 rounded-xl" />
                </div>
              ) : !project ? (
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 sm:p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 max-w-lg mx-auto">
                    <h3 className="text-lg font-bold text-white">
                      Turn Your Modules Into a Real Portfolio Project
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Pick your strongest technologies on the left and click Generate. You will get an end-to-end system architecture, a 4-week milestone sprint plan, OWASP security controls, and resume-ready bullet points.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-500 pt-2">
                    Selected Stack: {selectedSkills.join(' · ') || 'None'}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Project Title & Action Header */}
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
                          <span>{project.domain}</span>
                          <span aria-hidden="true">·</span>
                          <span>{project.difficulty}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock className="w-3.5 h-3.5" />
                            {project.estimatedHours} hrs
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {project.title}
                        </h2>
                        <p className="text-sm text-slate-300">{project.tagline}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleAddToPortfolio}
                          disabled={isAlreadySaved}
                          className={`h-10 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                            isAlreadySaved
                              ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {isAlreadySaved ? (
                            <>
                              <Check className="w-4 h-4 shrink-0" />
                              <span>{t('capstoneAddedPortfolio')}</span>
                            </>
                          ) : (
                            <>
                              <FolderPlus className="w-4 h-4 shrink-0" />
                              <span>{t('capstoneAddPortfolio')}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadMarkdown}
                          className="h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Download className="w-4 h-4 shrink-0" />
                          <span>Export .md</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="md:col-span-2 space-y-1">
                        <div className="font-semibold text-slate-400">Problem Statement</div>
                        <p className="text-slate-200 leading-relaxed">{project.problemStatement}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-400">Target Users</div>
                        <p className="text-slate-200 leading-relaxed">{project.targetUsers}</p>
                        <div className="font-mono text-[11px] text-slate-400 pt-1">
                          {project.skills.join(' · ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Architecture Blueprint */}
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">System Architecture &amp; Data Flow</h3>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {project.architectureOverview}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                      {project.dataFlow}
                    </div>

                    <div className="divide-y divide-slate-800/80">
                      {project.architectureComponents.map((comp, idx) => (
                        <div
                          key={`${comp.layer}-${idx}`}
                          className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-xs"
                        >
                          <div className="sm:w-1/3 shrink-0">
                            <span className="font-bold text-white">{comp.layer}</span>
                            <span className="text-slate-500 mx-1.5">·</span>
                            <span className="font-mono text-cyan-400">{comp.technology}</span>
                          </div>
                          <p className="text-slate-300 sm:flex-1 leading-relaxed">{comp.responsibility}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4-Week Implementation Roadmap */}
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-bold text-white">4-Week Implementation Roadmap</h3>
                      </div>

                      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
                        {project.weeks.map((w) => (
                          <button
                            key={w.weekNumber}
                            type="button"
                            onClick={() => setActiveWeek(w.weekNumber)}
                            className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                              activeWeek === w.weekNumber
                                ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-500/40'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Week {w.weekNumber}
                          </button>
                        ))}
                      </div>
                    </div>

                    {project.weeks
                      .filter((w) => w.weekNumber === activeWeek)
                      .map((week) => (
                        <div key={week.weekNumber} className="space-y-4 pt-1">
                          <div>
                            <h4 className="text-base font-bold text-white">
                              Week {week.weekNumber}: {week.title}
                            </h4>
                            <p className="text-xs text-indigo-300 mt-1">
                              Milestone: {week.milestone}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-slate-400">Engineering Tasks</div>
                              <ul className="space-y-2">
                                {week.tasks.map((task, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <div className="text-xs font-semibold text-slate-400">Shippable Deliverables</div>
                              <ul className="space-y-2">
                                {week.deliverables.map((del, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs text-emerald-200 leading-relaxed">
                                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{del}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Security Considerations */}
                  <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">Security &amp; Hardening Controls</h3>
                    </div>

                    <div className="divide-y divide-slate-800/80">
                      {project.securityConsiderations.map((sec, idx) => (
                        <div key={idx} className="py-3 space-y-1 text-xs">
                          <div className="font-bold text-emerald-300">{sec.area}</div>
                          <div className="text-slate-400">
                            <span className="text-slate-300 font-semibold">Risk:</span> {sec.risk}
                          </div>
                          <div className="text-slate-200">
                            <span className="text-emerald-400 font-semibold">Mitigation:</span> {sec.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resume Bullets & GitHub Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white">Resume Impact Bullets</h3>
                      <ul className="space-y-2">
                        {project.resumeBullets.map((bullet, idx) => (
                          <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                            <span className="text-cyan-400 font-mono">0{idx + 1}.</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white">GitHub README Checklist</h3>
                      <ul className="space-y-2">
                        {project.githubChecklist.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
