import React, { useState } from 'react';
import {
  X,
  Cpu,
  Terminal,
  Calculator as CalcIcon,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Heart,
  Grid,
  Wrench,
  BookOpen,
  Search,
  Server,
  Cloud,
  FileText,
  GitBranch,
  Globe,
  Code2
} from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';

export type CurrentAppType =
  | 'bca'
  | 'techmaster'
  | 'compiler'
  | 'dev'
  | 'docucraft'
  | 'gitstudio'
  | 'cyber'
  | 'netsec'
  | 'apix'
  | 'recon'
  | 'securecode'
  | 'cloudops'
  | 'promptcraft'
  | 'calc'
  | 'sukhan';

interface AppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: CurrentAppType;
  onSelectApp: (app: CurrentAppType) => void;
}

interface AppItem {
  id: CurrentAppType;
  category: 'Education' | 'Development' | 'Security' | 'DevOps & AI' | 'Privacy & Life';
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  badge: string;
  badgeColor: string;
  hash: string;
  icon: React.ReactNode;
}

const ALL_APPS: AppItem[] = [
  // 📚 Education
  {
    id: 'bca',
    category: 'Education',
    title: 'BCA Verse',
    subtitle: 'Academic Solvers & Code Lab',
    tagline: 'Logic Systems · 60+ C Programs · Fundamentals',
    description: 'Complete academic portal with step-by-step number system converters, verified C programs, and exam notes.',
    badge: 'Core Academic',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    hash: '#bcaverse',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
        <Cpu className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'techmaster',
    category: 'Education',
    title: 'TechMaster 2000+',
    subtitle: 'Zero to Hero Knowledge Vault',
    tagline: '2,000+ Q&A · Hacking · Supercomputers · Cyber Laws',
    description: 'Comprehensive tech mastery vault covering Kali Linux, Indian Cyber Cell 1930 Helpline, Supercomputers, and Career Roadmaps.',
    badge: 'Master Vault',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    hash: '#techmaster',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md">
        <BookOpen className="w-5 h-5 text-cyan-200" />
      </div>
    )
  },

  // 💻 Development
  {
    id: 'compiler',
    category: 'Development',
    title: 'C Compiler',
    subtitle: 'In-Browser Execution',
    tagline: 'Fast C Engine · Live Terminal · Preloaded Templates',
    description: 'Instant C execution environment. Run programs with interactive input and examine output metrics.',
    badge: 'Compiler',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    hash: '#compiler',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md font-mono font-bold text-lg">
        C
      </div>
    )
  },
  {
    id: 'dev',
    category: 'Development',
    title: 'DevForge',
    subtitle: 'Developer Swiss-Army Knife',
    tagline: 'Base64 · Hashing · JWT · Regex · Formatter',
    description: 'Essential utility suite with JSON formatting, SHA-256 hashing, JWT debugging, and color palettes.',
    badge: 'Dev Suite',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    hash: '#dev',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
        <Wrench className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'docucraft',
    category: 'Development',
    title: 'DocuCraft Studio',
    subtitle: 'Markdown, Regex & README',
    tagline: 'Live HTML Preview · Regex Matcher · Formatter',
    description: 'Live Markdown to HTML renderer, regex testing sandbox with match extraction, and README generator.',
    badge: 'Docs & Regex',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    hash: '#docucraft',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md">
        <FileText className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'gitstudio',
    category: 'Development',
    title: 'Git & CI/CD Studio',
    subtitle: 'Undo Assistant & Pipelines',
    tagline: 'Conflict Fixer · Emergency Undo · Actions Builder',
    description: 'Step-by-step visual problem solver for Git emergencies, detached HEAD, merge conflicts, and GitHub Actions builder.',
    badge: 'Git Tool',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hash: '#gitstudio',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md">
        <GitBranch className="w-5 h-5" />
      </div>
    )
  },

  // 🛡️ Security
  {
    id: 'cyber',
    category: 'Security',
    title: 'CyberShield Academy',
    subtitle: 'Hands-on Cyber Defense',
    tagline: 'Kali Tools · OWASP Labs · Bug Bounty Roadmap',
    description: 'Comprehensive cybersecurity academy. Master networking, SQLi/XSS defense, and ethical hacking fundamentals.',
    badge: 'Academy',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    hash: '#cyber',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md">
        <Shield className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'netsec',
    category: 'Security',
    title: 'NetSec Sandbox',
    subtitle: 'Live Network & Security Analyzer',
    tagline: 'Security Headers · DNS Auditing · OWASP Hardening',
    description: 'Audit CSP, HSTS, CORS security headers, run DNS queries (dig, whois), and inspect OWASP Top 10 remediation.',
    badge: 'Security Lab',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    hash: '#netsec',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md">
        <Globe className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'apix',
    category: 'Security',
    title: 'API-X Lab',
    subtitle: 'API Testing & Mocking',
    tagline: 'cURL Converter · HTTP Codes · JSON Mocking',
    description: 'Convert cURL commands to Fetch/Axios/Python/Go/C code, inspect HTTP status codes, and test JSON schemas.',
    badge: 'API Testing',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    hash: '#apix',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md">
        <Server className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'recon',
    category: 'Security',
    title: 'ReconMaster',
    subtitle: 'OSINT & Recon Toolkit',
    tagline: 'DNS Lookup · Nmap Builder · Headers · Google Dorks',
    description: 'Ethical reconnaissance lab with real-time DNS queries, Nmap command generator, security headers inspector, and 50+ Google dorks.',
    badge: 'Recon & OSINT',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    hash: '#recon',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
        <Search className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'securecode',
    category: 'Security',
    title: 'SecureCode Lab',
    subtitle: 'AppSec & Defensive Coding',
    tagline: 'Hash Identifier · Encoding Toolkit · OWASP Top 10 Fixes',
    description: 'Learn secure coding in C, C++, and Web. Cryptographic hash analysis (MD5 vs bcrypt/Argon2), encoding conversions, and OWASP code patches.',
    badge: 'Defensive Lab',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    hash: '#securecode',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md">
        <Shield className="w-5 h-5" />
      </div>
    )
  },

  // 🚀 DevOps & AI
  {
    id: 'cloudops',
    category: 'DevOps & AI',
    title: 'CloudOps Shell',
    subtitle: 'DevOps Playbook',
    tagline: 'Docker Multi-Stage · K8s YAML · Linux One-Liners',
    description: 'Generate production multi-stage Dockerfiles, docker-compose.yml, Kubernetes manifests, and search Linux commands.',
    badge: 'DevOps',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    hash: '#cloudops',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
        <Cloud className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'promptcraft',
    category: 'DevOps & AI',
    title: 'PromptCraft Pro',
    subtitle: 'AI & LLM Prompting Studio',
    tagline: 'System Prompt Generator · Token Estimator · Library',
    description: 'Craft role-based system prompts, estimate token counts & model costs, and access 30+ production prompts.',
    badge: 'AI Studio',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    hash: '#promptcraft',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
        <Sparkles className="w-5 h-5 text-cyan-200" />
      </div>
    )
  },

  // 🔐 Privacy & Life
  {
    id: 'calc',
    category: 'Privacy & Life',
    title: 'CalcVault',
    subtitle: 'Calculator & Stealth Chat',
    tagline: 'Standard & Scientific · Permanent Encrypted Storage',
    description: 'Fully functional mathematical calculator with tactile haptics. Secret PIN (1307) opens private P2P encrypted chat with permanent storage.',
    badge: 'Utility & Chat',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hash: '#calc',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-zinc-900 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-md">
        <CalcIcon className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'sukhan',
    category: 'Privacy & Life',
    title: 'SUKHAN',
    subtitle: 'Alfaaz, Ehsaas Aur Adab',
    tagline: 'Urdu & Hindi Poetry · Audio · Sher Designer',
    description: 'Premium literary universe with mood-based poetry library, classical typography, audio recitations, and card exporter.',
    badge: 'Literature',
    badgeColor: 'bg-[#59263C] text-[#C6A66B] border-[#C6A66B]/40',
    hash: '#sukhan',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#59263C] to-[#15151C] border border-[#C6A66B]/50 flex items-center justify-center text-[#C6A66B] shadow-md">
        <SukhanPenIcon size={22} />
      </div>
    )
  }
];

const CATEGORIES = ['All', 'Education', 'Development', 'Security', 'DevOps & AI', 'Privacy & Life'] as const;

export const AppSwitcherModal: React.FC<AppSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentApp,
  onSelectApp
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredApps = ALL_APPS.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch =
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                TechMaster Master Suite
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-400 border border-blue-800">
                  13 Apps
                </span>
              </h2>
              <p className="text-xs text-slate-400">Switch seamlessly between all 13 integrated tools</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Apps Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredApps.map((app) => {
            const isCurrent = currentApp === app.id;
            return (
              <div
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/10'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {app.icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-white truncate flex items-center gap-2">
                        {app.title}
                        {isCurrent && (
                          <span className="text-[10px] text-blue-400 font-mono font-bold">● Active</span>
                        )}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${app.badgeColor}`}>
                        {app.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-300 mb-1">{app.subtitle}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{app.description}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-500">{app.hash}</span>
                  <span className="font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{isCurrent ? 'Current App' : 'Launch'}</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span>Engineered by Prince Thakur</span>
          <span>Switch anytime via URL hash or header menu</span>
        </div>
      </div>
    </div>
  );
};
