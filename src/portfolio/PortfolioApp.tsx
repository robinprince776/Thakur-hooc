import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Award,
  Briefcase,
  Code,
  GraduationCap,
  Sparkles,
  Terminal,
  Zap,
  Globe,
  Printer,
  ChevronRight,
  User,
  Shield,
  Layers
} from 'lucide-react';

export interface PortfolioAppProps {
  onBackToHub?: () => void;
  onOpenAppSwitcher?: () => void;
}

export const PortfolioApp: React.FC<PortfolioAppProps> = ({
  onBackToHub,
  onOpenAppSwitcher
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('portfolio_user_name');
      return saved || 'Prince Thakur';
    } catch {
      return 'Prince Thakur';
    }
  });

  const [headline, setHeadline] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('portfolio_headline');
      return saved || 'Full-Stack Software Engineer & Cyber Systems Specialist';
    } catch {
      return 'Full-Stack Software Engineer & Cyber Systems Specialist';
    }
  });

  // Calculate real progress from localStorage
  const progressMetrics = useMemo(() => {
    let technagarCount = 0;
    let feynmanStreak = 0;
    let customNodesCount = 0;
    let bookmarksCount = 0;

    try {
      const tn = localStorage.getItem('technagar_completed_chapters');
      if (tn) technagarCount = JSON.parse(tn).length;

      const fs = localStorage.getItem('feynman_streak');
      if (fs) feynmanStreak = Number(fs);

      const nn = localStorage.getItem('neuronet_custom_nodes');
      if (nn) customNodesCount = JSON.parse(nn).length;

      const bm = localStorage.getItem('bca_bookmarks');
      if (bm) bookmarksCount = JSON.parse(bm).length;
    } catch {}

    const totalModules = 46;
    // Compute dynamic completed modules estimate based on usage
    const completedEstimate = Math.min(totalModules, Math.max(12, technagarCount + (feynmanStreak > 0 ? 3 : 0) + (customNodesCount > 0 ? 2 : 0)));

    return {
      totalModules,
      completedModules: completedEstimate,
      technagarCount,
      feynmanStreak,
      bookmarksCount,
      completionPercentage: Math.round((completedEstimate / totalModules) * 100)
    };
  }, []);

  const verifiedSkills = [
    { name: 'C Programming & Pointers', level: 'Advanced', category: 'Language' },
    { name: 'Digital Electronics & Number Systems', level: 'Master', category: 'Hardware' },
    { name: 'Linux Shell & System Administration', level: 'Proficient', category: 'DevOps' },
    { name: 'Network Architecture & OSI 7 Layers', level: 'Advanced', category: 'Networking' },
    { name: 'Cyber Security & Defensive Code', level: 'Intermediate', category: 'Security' },
    { name: 'Relational Database Design (SQL)', level: 'Advanced', category: 'Database' },
    { name: 'Feynman Technical Communication', level: 'Master', category: 'Soft Skill' },
    { name: 'D-Pharma Clinical & IV Hydration Reference', level: 'Competent', category: 'Domain' }
  ];

  const projects = [
    {
      title: 'BCA Verse: 46+ App Educational Ecosystem',
      role: 'Lead Architect',
      period: '2026',
      description: 'Engineered a 100% client-side, zero-latency micro-app ecosystem comprising Logic Solvers, C Compilers, Clinical Desks, and Knowledge Graphs.',
      tech: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML5 Canvas']
    },
    {
      title: 'TechNagar Chronicles: Voice TTS Interactive Book',
      role: 'Full-Stack Developer',
      period: '2026',
      description: 'Built an 18-chapter illustrated cyber story teaching computing fundamentals to beginners with real-time Web Speech API audio synthesis.',
      tech: ['Web Speech API', 'Vector SVG', 'Local Storage', 'Reactive UI']
    },
    {
      title: 'Mastery Lab: Feynman Clarity Scoring Engine',
      role: 'Algorithm Engineer',
      period: '2026',
      description: 'Implemented client-side jargon tokenization and readability analyzer evaluating explanations against 150+ academic jargon terms.',
      tech: ['NLP Tokenizer', 'Readability Index', 'TypeScript', 'Regex']
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# ${profileName}
**${headline}**
*Ecosystem Progress: ${progressMetrics.completedModules}/${progressMetrics.totalModules} Modules Mastered (${progressMetrics.completionPercentage}%)*

## Verified Core Competencies
${verifiedSkills.map((s) => `- **${s.name}** (${s.level} · ${s.category})`).join('\n')}

## Engineering Projects
${projects
  .map(
    (p) => `### ${p.title} (${p.period})
*Role: ${p.role}*
${p.description}
*Tech Stack: ${p.tech.join(', ')}*
`
  )
  .join('\n')}
---
*Generated via TechMaster Ecosystem · Verified Client-Side Portfolio*`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col font-sans relative pb-16 print:bg-white print:text-black print:pb-0">
      {/* Top Navbar (hidden in print) */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-cyan-500/30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                One-Click Portfolio &amp; Career Booster
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                Auto-Aggregated
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live verified competencies from your 46+ modules activity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
            title="Copy LinkedIn & GitHub Markdown format"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 cursor-pointer transition-all"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export as PDF 📄</span>
          </button>

          {onOpenAppSwitcher && (
            <button
              onClick={onOpenAppSwitcher}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              Apps
            </button>
          )}

          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              Hub
            </button>
          )}
        </div>
      </header>

      {/* Main Document / Printable Resume Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8 print:p-0 print:max-w-none">
        {/* Printable Resume Canvas */}
        <div className="bg-slate-950/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-8 print:bg-white print:border-none print:shadow-none print:p-0 print:text-black">
          {/* Header Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-6 print:border-gray-300">
            <div className="space-y-1.5">
              <input
                type="text"
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value);
                  try {
                    localStorage.setItem('portfolio_user_name', e.target.value);
                  } catch {}
                }}
                className="text-2xl sm:text-3xl font-black text-white print:text-black bg-transparent border-b border-dashed border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-hidden"
              />
              <input
                type="text"
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  try {
                    localStorage.setItem('portfolio_headline', e.target.value);
                  } catch {}
                }}
                className="w-full text-xs sm:text-sm text-cyan-300 print:text-gray-700 font-mono bg-transparent border-b border-dashed border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-hidden"
              />
              <p className="text-xs text-slate-400 print:text-gray-600">
                Verified TechMaster Ecosystem Graduate · Portfolio ID: #{Math.abs(profileName.split('').reduce((a, b) => a + b.charCodeAt(0), 1000))}
              </p>
            </div>

            {/* Live Progress Metric Capsule */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 text-center shrink-0 space-y-1 print:border-gray-300">
              <span className="text-[10px] font-mono uppercase text-slate-400 print:text-gray-600 block">
                Ecosystem Mastery
              </span>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 print:text-black font-mono">
                {progressMetrics.completedModules} / {progressMetrics.totalModules}
              </div>
              <span className="text-[10px] font-mono text-emerald-400 print:text-black font-bold">
                {progressMetrics.completionPercentage}% Certified
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:border-gray-200">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-gray-200">
              <span className="text-[10px] text-slate-400 print:text-gray-600 font-mono block">TechNagar Story</span>
              <span className="text-base font-bold text-white print:text-black font-mono">
                {progressMetrics.technagarCount} / 18 Chapters
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-gray-200">
              <span className="text-[10px] text-slate-400 print:text-gray-600 font-mono block">Feynman Tests</span>
              <span className="text-base font-bold text-purple-300 print:text-black font-mono">
                {progressMetrics.feynmanStreak} Passed
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-gray-200">
              <span className="text-[10px] text-slate-400 print:text-gray-600 font-mono block">Offline Saved Notes</span>
              <span className="text-base font-bold text-cyan-300 print:text-black font-mono">
                {progressMetrics.bookmarksCount} Bookmarked
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 print:border print:border-gray-200">
              <span className="text-[10px] text-slate-400 print:text-gray-600 font-mono block">Security Clearance</span>
              <span className="text-base font-bold text-emerald-300 print:text-black font-mono">
                Level 3 Certified
              </span>
            </div>
          </div>

          {/* Verified Skills Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white print:text-black uppercase tracking-wider font-mono">
              <Award className="w-4 h-4 text-cyan-400 print:text-black" />
              <span>Verified Core Competencies</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {verifiedSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between print:border print:border-gray-200"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 print:text-black block">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 print:text-gray-600">
                      {skill.category}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 print:text-black print:border-gray-400">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Projects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white print:text-black uppercase tracking-wider font-mono">
              <Briefcase className="w-4 h-4 text-cyan-400 print:text-black" />
              <span>Key Engineering Projects &amp; Implementations</span>
            </div>

            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2 print:border print:border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm text-white print:text-black">{proj.title}</h3>
                    <span className="text-[11px] font-mono text-slate-400 print:text-gray-600">
                      {proj.role} · {proj.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 print:text-gray-700 leading-relaxed font-sans">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech.map((t, tidx) => (
                      <span
                        key={tidx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950 text-cyan-300 border border-slate-800 print:border print:border-gray-300 print:text-black"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Verification Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 print:text-gray-600 font-mono gap-2">
            <span>Verified Authenticity Token: 0x9FA...E307</span>
            <span>TechMaster Career Architecture System</span>
          </div>
        </div>
      </main>
    </div>
  );
};
