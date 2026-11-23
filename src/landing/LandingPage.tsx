import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  Briefcase,
  Code2,
  Cpu,
  ExternalLink,
  GraduationCap,
  HardDrive,
  Layers,
  Lock,
  Menu,
  Radio,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Swords,
  Workflow,
  X,
} from 'lucide-react';
import type { CurrentAppType } from '../components/AppSwitcherModal';

interface LandingPageProps {
  onLaunchApp: (targetApp?: CurrentAppType) => void;
}

interface FeatureCardItem {
  index: string;
  title: string;
  description: string;
  targetApp: CurrentAppType;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

interface LabSpotlightItem {
  title: string;
  category: string;
  description: string;
  targetApp: CurrentAppType;
  icon: React.ComponentType<{ className?: string }>;
}

const FEATURES: FeatureCardItem[] = [
  {
    index: '01',
    title: 'JARVIS AI Assistant',
    description:
      'Context-aware mentor in English and Hinglish that explains CS fundamentals, navigates modules, and accelerates exam prep.',
    targetApp: 'askai',
    icon: Bot,
    accent: 'text-sky-400',
  },
  {
    index: '02',
    title: 'Ghost Protocol (Cyber Range)',
    description:
      'Sandboxed defensive security OS with SIEM triage, DFIR artifact analysis, OWASP code labs, and OpSec tooling.',
    targetApp: 'ghost',
    icon: Shield,
    accent: 'text-cyan-400',
  },
  {
    index: '03',
    title: 'The Arena (Problem Solving)',
    description:
      '75+ real-world debugging, SQL, CTF, and system design challenges with AI-graded reviews, progressive hints, and XP.',
    targetApp: 'arena',
    icon: Swords,
    accent: 'text-blue-400',
  },
  {
    index: '04',
    title: 'MediCore Pro (Medical Guide)',
    description:
      'Structured clinical pharmacology reference, interactive dosage calculators, triage flowcharts, and offline study sheets.',
    targetApp: 'medicore',
    icon: Stethoscope,
    accent: 'text-emerald-400',
  },
  {
    index: '05',
    title: 'AI Automation Labs',
    description:
      'Visual workflow designer, reusable agent prompt blueprints, and local webhook simulators built for modern builders.',
    targetApp: 'aiflow',
    icon: Workflow,
    accent: 'text-indigo-400',
  },
  {
    index: '06',
    title: 'Career & Bounty Empire',
    description:
      'Responsible disclosure templates, freelance pricing calculators, GST/FIRC guides, and full-stack placement prep.',
    targetApp: 'bounty',
    icon: Briefcase,
    accent: 'text-amber-400',
  },
];

const FLAGSHIP_LABS: LabSpotlightItem[] = [
  {
    title: 'The War Room',
    category: 'Red vs Blue Simulator',
    description:
      'Defend a live SVG network topology against simulated threats in 60-second incident response rounds.',
    targetApp: 'warroom',
    icon: Radio,
  },
  {
    title: 'AI Capstone Generator',
    category: '4-Week Portfolio Builder',
    description:
      'Select your stack and generate a complete system architecture, weekly roadmap, and security checklist.',
    targetApp: 'capstone',
    icon: Sparkles,
  },
  {
    title: 'Hardware & IoT Lab',
    category: 'Circuits & GPIO',
    description:
      'Interactive virtual breadboard, Raspberry Pi pinout explorer, RFID security concepts, and hex firmware reader.',
    targetApp: 'iot',
    icon: Cpu,
  },
  {
    title: 'Offline .ghost Data Vault',
    category: 'AES-256 Local Backup',
    description:
      'Export and restore notes, XP, bookmarks, and progress in encrypted local snapshots with zero cloud lock-in.',
    targetApp: 'bca',
    icon: HardDrive,
  },
];

const AUDIENCE_COLUMNS = [
  {
    title: 'For Students',
    headline: 'BCA/BTech ke saare subjects ek jagah.',
    details:
      'Complete 6-semester notes, C/Python/Java playgrounds, K-Map and number-system solvers, exam simulators, and instant English/Hinglish bilingual switching.',
    icon: GraduationCap,
    targetApp: 'bca' as CurrentAppType,
    ctaLabel: 'Open Academic Hub',
  },
  {
    title: 'For Developers',
    headline: 'Coding, System Design aur API tools.',
    details:
      'DSA algorithm visualizers, SQL sandbox, API request workbench, Git flow studio, and AI-architected 4-week capstone roadmaps for your portfolio.',
    icon: Code2,
    targetApp: 'dev' as CurrentAppType,
    ctaLabel: 'Open Developer Suite',
  },
  {
    title: 'For Hackers',
    headline: '100% Legal Ethical Hacking Sims.',
    details:
      'Defensive cyber range with SIEM alert triage, incident response war games, cryptography playgrounds, and clean responsible disclosure workflows.',
    icon: ShieldCheck,
    targetApp: 'ghost' as CurrentAppType,
    ctaLabel: 'Enter Ghost Protocol',
  },
];

const METRICS = [
  { value: '90+', label: 'Premium Modules' },
  { value: '100%', label: 'Offline Capable' },
  { value: '50+', label: 'Interactive Simulators' },
  { value: '0%', label: 'Lag, Pure Performance' },
];

const NAV_LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'labs', label: 'Labs' },
  { id: 'audience', label: 'Audience' },
  { id: 'about', label: 'About' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="top"
      className="min-h-screen w-full overflow-x-hidden bg-[#06080D] text-slate-100 antialiased selection:bg-blue-500/30 selection:text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Top Navbar — Strict 3-Zone Contract */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-[#06080D]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg py-1"
            aria-label="TechMaster Home"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-4 h-4 text-[#06080D] stroke-[2.5]" />
            </span>
            <span className="text-base font-bold tracking-[-0.02em] text-white">
              TechMaster
            </span>
          </button>

          {/* Zone 2: Smooth-Scroll Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onLaunchApp()}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-tight inline-flex items-center gap-2 shadow-[0_0_24px_rgba(37,99,235,0.45)] hover:shadow-[0_0_32px_rgba(59,130,246,0.6)] transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080D]"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#080B12]/95 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="relative">
        {/* STEP 1: HERO SECTION */}
        <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle Cosmic Architectural Grid & Ambient Floating Glass Geometry */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            {/* Top radial illumination */}
            <div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full opacity-35 blur-3xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(37,99,235,0.45) 0%, rgba(6,182,212,0.18) 45%, rgba(6,8,13,0) 75%)',
              }}
            />

            {/* Precision cosmic grid */}
            <div
              className="absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)',
                backgroundSize: '64px 64px',
                maskImage:
                  'radial-gradient(ellipse 80% 65% at 50% 25%, #000 40%, transparent 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 80% 65% at 50% 25%, #000 40%, transparent 100%)',
              }}
            />

            {/* Drifting Glass Geometric Cubes (Compositor transform-only, zero lag) */}
            <div className="hidden lg:block absolute top-32 left-[8%] w-24 h-24 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm rotate-12 animate-float-slow motion-reduce:animate-none" />
            <div
              className="hidden lg:block absolute top-52 right-[9%] w-28 h-28 rounded-3xl border border-cyan-400/15 bg-cyan-500/[0.025] backdrop-blur-sm -rotate-12 animate-float-slow motion-reduce:animate-none"
              style={{ animationDelay: '1.8s' }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400/90 mb-5">
              TechMaster &amp; Ghost Protocol Ecosystem
            </p>

            <h1
              className="font-extrabold tracking-[-0.035em] text-white leading-[1.06] mx-auto max-w-4xl"
              style={{
                fontSize: 'clamp(2.35rem, 5.4vw, 4.5rem)',
                textWrap: 'balance',
              }}
            >
              The Ultimate Zero-to-Hero{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Tech Ecosystem
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
              AI Assistant, Cyber Security Labs, Coding Arena, aur Medical Guide — sab kuch ek hi jagah.
            </p>

            {/* Primary CTA + Quiet Secondary Scroll Anchor */}
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onLaunchApp()}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400 text-white text-base font-semibold tracking-tight inline-flex items-center justify-center gap-2.5 shadow-[0_0_40px_rgba(37,99,235,0.5)] hover:shadow-[0_0_52px_rgba(6,182,212,0.55)] transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080D]"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-2xl border border-white/12 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 text-slate-200 hover:text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <span>Explore 90+ Modules</span>
              </button>
            </div>

            {/* Apple-Style Architectural Showcase Frame */}
            <div className="mt-14 sm:mt-16 relative mx-auto max-w-5xl">
              <div
                aria-hidden="true"
                className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-white/20 via-blue-500/20 to-transparent pointer-events-none"
              />
              <div className="relative rounded-[27px] overflow-hidden bg-[#0A0F1A] border border-white/[0.08] shadow-[0_32px_100px_rgba(0,0,0,0.75)]">
                {/* Minimal Window Chrome Bar */}
                <div className="h-10 px-4 sm:px-5 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tracking-wide">
                    techmaster.os — workspace
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                    <Lock className="w-3 h-3 text-cyan-400/80" />
                    <span className="hidden sm:inline">Offline-First</span>
                  </div>
                </div>

                {/* High-Resolution Generated Architectural Showcase Visual */}
                <div className="relative aspect-[16/9] w-full bg-[#060910] overflow-hidden">
                  {!heroImageError ? (
                    <img
                      src="/og-preview.jpg"
                      alt="TechMaster and Ghost Protocol spatial glassmorphic workspace preview showing translucent computing, code, and security modules"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImageError(true)}
                      className="w-full h-full object-cover object-center select-none"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1122] via-[#070B14] to-[#081726] p-8">
                      <Layers className="w-14 h-14 text-blue-400/80 mb-4" />
                      <p className="text-lg font-semibold text-white">
                        TechMaster Spatial Workspace
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        90+ integrated modules across AI, Security, Code &amp; Medicine
                      </p>
                    </div>
                  )}

                  {/* Subtle bottom scrim & quick-launch action overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#06080D] via-[#06080D]/60 to-transparent flex items-end justify-between px-5 sm:px-8 pb-5">
                    <div className="text-left">
                      <p className="text-xs font-mono uppercase tracking-[0.16em] text-cyan-300/90">
                        Unified Browser OS
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-white mt-0.5">
                        Zero install. Instant launch in your browser.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onLaunchApp()}
                      className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs font-semibold text-white transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>Enter Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: FEATURES SHOWCASE (3x2 GLASSMORPHIC GRID) */}
        <section
          id="features"
          className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">
                Core Capabilities
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-white leading-tight"
                style={{ textWrap: 'balance' }}
              >
                Six flagship suites. One unified workflow.
              </h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Every discipline runs inside a single zero-lag workspace with persistent offline storage, bilingual notes, and instant module switching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.index}
                    type="button"
                    onClick={() => onLaunchApp(feature.targetApp)}
                    className="group text-left rounded-2xl p-6 sm:p-7 bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.08] hover:border-blue-400/35 backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] group-hover:border-white/15 flex items-center justify-center transition-colors">
                          <Icon className={`w-5 h-5 ${feature.accent}`} />
                        </div>
                        <span className="text-xs font-mono tabular-nums text-slate-500 group-hover:text-slate-300 transition-colors">
                          {feature.index}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold tracking-[-0.015em] text-white group-hover:text-blue-200 transition-colors">
                        {feature.title}
                      </h3>

                      <p className="mt-2.5 text-sm text-slate-400 leading-relaxed line-clamp-2">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
                      <span>Launch Suite</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTERACTIVE LABS SHOWCASE (#labs) */}
        <section
          id="labs"
          className="scroll-mt-20 py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-white/[0.01]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-3">
                  Hands-On Simulators
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white"
                  style={{ textWrap: 'balance' }}
                >
                  Practice inside live, browser-native labs.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onLaunchApp('warroom')}
                className="self-start md:self-auto h-10 px-4 rounded-xl border border-white/12 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold text-slate-200 hover:text-white inline-flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors"
              >
                <span>Try Live War Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FLAGSHIP_LABS.map((lab) => {
                const Icon = lab.icon;
                return (
                  <button
                    key={lab.title}
                    type="button"
                    onClick={() => onLaunchApp(lab.targetApp)}
                    className="group text-left rounded-2xl p-6 bg-[#0B101C]/70 hover:bg-[#0E1525] border border-white/[0.07] hover:border-cyan-400/30 transition-all duration-200 flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <div>
                      <Icon className="w-5 h-5 text-cyan-400 mb-4" />
                      <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-slate-500">
                        {lab.category}
                      </p>
                      <h3 className="mt-1.5 text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {lab.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                        {lab.description}
                      </p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors">
                      <span>Open Lab</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* STEP 3: "WHO IS THIS FOR?" (3 COLUMNS) */}
        <section
          id="audience"
          className="scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">
                Who Is This For
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-white"
                style={{ textWrap: 'balance' }}
              >
                Built for learners who ship, defend, and master.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {AUDIENCE_COLUMNS.map((col) => {
                const Icon = col.icon;
                return (
                  <div
                    key={col.title}
                    className="rounded-2xl p-7 bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mb-6">
                        <Icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {col.title}
                      </p>
                      <h3 className="mt-2.5 text-xl font-bold tracking-[-0.02em] text-white leading-snug">
                        {col.headline}
                      </h3>
                      <p className="mt-3.5 text-sm text-slate-400 leading-relaxed">
                        {col.details}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onLaunchApp(col.targetApp)}
                      className="mt-7 pt-4 border-t border-white/[0.06] w-full flex items-center justify-between text-sm font-semibold text-blue-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <span>{col.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STEP 4: STATS & SOCIAL PROOF BAND (THE FLEX) */}
        <section
          aria-label="Platform capabilities and performance metrics"
          className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-white/[0.08] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 70% 100% at 50% 50%, rgba(37,99,235,0.22) 0%, rgba(6,8,13,0) 75%)',
            }}
          />

          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="text-center lg:text-left lg:border-l lg:first:border-l-0 lg:border-white/[0.08] lg:pl-8 lg:first:pl-0"
                >
                  <div
                    className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] tabular-nums bg-gradient-to-b from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(56,189,248,0.28)]"
                  >
                    {metric.value}
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-300">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CONVERSION INVITATION */}
        <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-white/[0.04] to-white/[0.015] border border-white/[0.09] backdrop-blur-xl text-center">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-white"
              style={{ textWrap: 'balance' }}
            >
              Ready to launch your all-in-one tech command center?
            </h2>
            <p className="mt-4 text-base text-slate-300/90 max-w-xl mx-auto leading-relaxed">
              No sign-up wall, no subscription friction. Open all 90+ modules, interactive simulators, and offline vaults immediately.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => onLaunchApp()}
                className="min-h-[48px] px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold tracking-tight inline-flex items-center gap-2.5 shadow-[0_0_36px_rgba(37,99,235,0.5)] hover:shadow-[0_0_48px_rgba(59,130,246,0.65)] transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06080D]"
              >
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* STEP 5: QUIET FOOTER */}
      <footer
        id="about"
        className="scroll-mt-20 border-t border-white/[0.08] bg-[#05070B] py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-[#06080D] stroke-[2.5]" />
              </span>
              <span className="text-sm font-bold tracking-[-0.02em] text-white">
                TechMaster
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Developed by <span className="text-slate-200 font-semibold">Priyanshu (Prince Thakur)</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Offline-first academic, developer, and defensive cybersecurity ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onLaunchApp()}
              className="text-blue-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
            >
              Launch App
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
