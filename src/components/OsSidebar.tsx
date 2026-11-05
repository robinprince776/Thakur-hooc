import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Shield,
  Terminal,
  Cpu,
  HeartPulse,
  BookOpen,
  Briefcase,
  Zap,
  Sparkles,
  Lock,
  FileText,
  Sliders,
  Settings,
  Flame,
  Radio,
  Compass,
  Layers,
  ArrowRight,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { CurrentAppType } from './AppSwitcherModal';
import { OmnitrixLogo } from './OmnitrixLogo';
import { useOsStore } from '../store/useOsStore';

interface OsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (app: CurrentAppType) => void;
  currentApp: CurrentAppType;
  onOpenSettings: () => void;
  onOpenPortfolio: () => void;
  onToggleStealth: () => void;
}

interface HubCategory {
  id: string;
  name: string;
  icon: any;
  badge?: string;
  color: string;
  apps: {
    id: CurrentAppType;
    name: string;
    desc: string;
    tag?: string;
  }[];
}

const OS_HUBS: HubCategory[] = [
  {
    id: 'gamification',
    name: '🎮 RPG Mastery & Active Recall',
    icon: Sparkles,
    badge: 'NEW',
    color: 'from-amber-400 to-yellow-600',
    apps: [
      { id: 'roadmap', name: 'My Learning Roadmap', desc: 'Zero-to-Hero University step-by-step master path', tag: 'Curriculum' },
      { id: 'myquiz', name: 'My Quiz & Active Recall', desc: 'Custom decks, note importer & timed drills', tag: 'Quiz' },
      { id: 'skilltree', name: 'RPG Skill Tree Engine', desc: 'Interactive node graph, tier unlocks & boss exams', tag: 'RPG' }
    ]
  },
  {
    id: 'threatsec',
    name: '🕵️‍♂️ Threat Intelligence & Mobile Security',
    icon: ShieldAlert,
    badge: 'NEW',
    color: 'from-rose-500 to-amber-600',
    apps: [
      { id: 'crimematrix', name: 'CyberCrime Matrix', desc: 'SIM swap, Deepfake audio, SPF spoof & RAT C2', tag: 'Threats' },
      { id: 'mobilesec', name: 'MobileSec Lab', desc: 'Smishing scanner, OS permissions & Evil Twin', tag: 'Mobile' }
    ]
  },
  {
    id: 'elitelabs',
    name: '🧪 Elite Labs',
    icon: Sparkles,
    badge: 'NEW',
    color: 'from-cyan-500 to-blue-600',
    apps: [
      { id: 'forensics', name: 'Forensic Cyber Lab', desc: 'EXIF viewer, magic bytes & stego', tag: 'Lab' },
      { id: 'quantum', name: 'Quantum Visualizer', desc: 'Qubit Bloch sphere & superposition', tag: 'Visual' },
      { id: 'iot', name: 'Hardware & IoT Lab', desc: 'Raspberry Pi / Arduino & circuits', tag: 'IoT' },
      { id: 'sysdesign', name: 'System Design Canvas', desc: 'Architecture designer & traffic load', tag: 'Design' },
      { id: 'wealth', name: 'TechWealth Finance', desc: 'SIP calculator, scam check & India tax', tag: 'Wealth' }
    ]
  },
  {
    id: 'nextgen',
    name: '🚀 Next-Gen Labs',
    icon: Zap,
    badge: 'NEW',
    color: 'from-amber-500 to-rose-600',
    apps: [
      { id: 'robotics', name: 'Drone & Robotics Sim', desc: 'Flight physics, PID & A* maze', tag: 'Robotics' },
      { id: 'geoint', name: 'Satellite & GEOINT', desc: '3-satellite GPS fix & elevation', tag: 'Intel' },
      { id: 'vision', name: 'Computer Vision Lab', desc: 'CNN kernels, face landmarks & OCR', tag: 'CV' },
      { id: 'onion', name: 'Onion Routing & Tor', desc: '3-layer encryption peel & PGP', tag: 'Privacy' },
      { id: 'gamedev', name: 'Game Engine & Physics', desc: '2D physics sandbox & raycasting', tag: 'Engine' }
    ]
  },
  {
    id: 'academic',
    name: '🎓 Academic & BCA Hub',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    apps: [
      { id: 'exam', name: 'BCA Exam Simulator', desc: 'Timed mock tests & weakness detector', tag: 'Exam' },
      { id: 'playground', name: 'Multi-Language Playground', desc: 'Python, Java, C++, JS runner', tag: 'Code' },
      { id: 'visuallab', name: 'Visual DBMS & OS Lab', desc: 'ER diagrams, SQL joins & Gantt chart', tag: 'Interactive' },
      { id: 'askai', name: 'AI BCA Doubt Solver', desc: 'Viva questions & concept breakdown', tag: 'AI' },
      { id: 'techmaster', name: 'TechMaster 2000+', desc: '2000+ university questions vault', tag: 'Vault' },
      { id: 'bca', name: 'BCA Semester Suite', desc: 'All 6 semesters notes & syllabus', tag: 'Syllabus' }
    ]
  },
  {
    id: 'cyber',
    name: '🛡️ Cyber Defense & Offensive',
    icon: Shield,
    color: 'from-emerald-500 to-teal-600',
    apps: [
      { id: 'cyber', name: 'CyberShield Suite', desc: 'Offensive tools & Kali terminal', tag: 'Hacking' },
      { id: 'recon', name: 'ReconMaster OSINT', desc: 'Reconnaissance & intelligence gathering', tag: 'OSINT' },
      { id: 'sentinel', name: 'Sentinel SOC Lab', desc: 'Log triage & blue team monitoring', tag: 'SOC' },
      { id: 'linux', name: 'Linux Mastery Terminal', desc: 'Interactive bash terminal emulator', tag: 'CLI' },
      { id: 'cryptomaster', name: 'CryptoMaster Lab', desc: 'AES, RSA, ECC & Post-Quantum crypto', tag: 'Crypto' }
    ]
  },
  {
    id: 'dev',
    name: '💻 Dev & Cloud Hub',
    icon: Terminal,
    color: 'from-purple-500 to-indigo-600',
    apps: [
      { id: 'compiler', name: 'C Compiler', desc: 'Fast client-side C code execution', tag: 'Runner' },
      { id: 'dev', name: 'DevForge Utilities', desc: 'JSON, JWT, RegEx & Hash generators', tag: 'Tools' },
      { id: 'gitstudio', name: 'GitStudio & CI/CD', desc: 'Git visualizer & pipeline builder', tag: 'DevOps' },
      { id: 'database', name: 'SQL Playground', desc: 'Interactive relational DB queries', tag: 'SQL' },
      { id: 'cloudops', name: 'CloudOps Docker & K8s', desc: 'Containers & cloud infrastructure', tag: 'Cloud' }
    ]
  },
  {
    id: 'medical',
    name: '🩺 Medical & Clinical Desk',
    icon: HeartPulse,
    color: 'from-rose-500 to-red-600',
    apps: [
      { id: 'medicore', name: 'MediCore Pro Desk', desc: 'Disease matrix, drug vault & IV cannula', tag: 'Pharma' }
    ]
  },
  {
    id: 'story',
    name: '📖 Story & Culture',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-600',
    apps: [
      { id: 'technagar', name: 'TechNagar Chronicles', desc: 'Aarav & Byte comic novel + audio TTS', tag: 'Comic' },
      { id: 'sukhan', name: 'Sukhan Poetry Studio', desc: 'Urdu poetry, ghazals & meter analysis', tag: 'Arts' },
      { id: 'music', name: 'SvaraPulse Musicology', desc: 'Ragas, synthesizers & circle of fifths', tag: 'Music' }
    ]
  },
  {
    id: 'career',
    name: '🚀 Career & Mastery',
    icon: Briefcase,
    color: 'from-teal-500 to-cyan-600',
    apps: [
      { id: 'placement', name: 'Placement Prep Hub', desc: 'TCS, Infosys aptitude & HR rounds', tag: 'Campus' },
      { id: 'portfolio', name: 'My Portfolio Generator', desc: 'Auto-curated resume with PDF export', tag: 'CV' },
      { id: 'feynman', name: 'Feynman AI Simulator', desc: 'Mastery test with clarity score check', tag: 'Mastery' },
      { id: 'brain', name: 'NeuroNet Knowledge Graph', desc: 'Interactive concept nodes network', tag: 'Brain' },
      { id: 'upsc', name: 'UPSC CSE Navigator', desc: 'Civil Services IAS/IPS topper syllabus', tag: 'UPSC' }
    ]
  }
];

export const OsSidebar: React.FC<OsSidebarProps> = ({
  isOpen,
  onClose,
  onSelectApp,
  currentApp,
  onOpenSettings,
  onOpenPortfolio,
  onToggleStealth
}) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    threatsec: true,
    elitelabs: true,
    nextgen: true,
    academic: true
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] h-full bg-slate-950/95 border-r border-white/10 flex flex-col justify-between shadow-2xl z-10 animate-slide-right">
        {/* TOP: Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <OmnitrixLogo size={26} glow={true} animated={true} />
            <div>
              <h2 className="text-xs font-black text-white tracking-widest uppercase">
                BCA VERSE OS
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">
                System Navigation Hub
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MIDDLE: Scrollable Categories Accordion */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {OS_HUBS.map((hub) => {
            const isCatOpen = !!openCategories[hub.id];
            const HubIcon = hub.icon;

            return (
              <div key={hub.id} className="rounded-2xl border border-white/5 bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => toggleCategory(hub.id)}
                  className="w-full p-2.5 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-cyan-400">
                      <HubIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">{hub.name}</span>
                    {hub.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {hub.badge}
                      </span>
                    )}
                  </div>
                  {isCatOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>

                {isCatOpen && (
                  <div className="p-1 space-y-1 bg-slate-950/60 border-t border-white/5">
                    {hub.apps.map((app) => {
                      const isActive = currentApp === app.id;

                      return (
                        <button
                          key={app.id}
                          onClick={() => {
                            onSelectApp(app.id);
                            onClose();
                          }}
                          className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                            isActive
                              ? 'bg-cyan-600/20 border border-cyan-500/50 text-white'
                              : 'hover:bg-white/5 text-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold truncate text-white">
                                {app.name}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">
                              {app.desc}
                            </p>
                          </div>

                          {app.tag && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 shrink-0">
                              {app.tag}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM: Quick Action Controls */}
        <div className="p-3 border-t border-white/10 bg-slate-950/90 space-y-1.5">
          <div className="text-[10px] font-mono uppercase text-slate-500 px-2">
            Quick Actions
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                onToggleStealth();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-white/5 hover:border-rose-500/30 text-center cursor-pointer transition-all"
              title="Stealth Panic Mode (Shift+Esc)"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400 mx-auto mb-1" />
              <span className="text-[9px] font-semibold text-slate-300 block">Stealth</span>
            </button>

            <button
              onClick={() => {
                onOpenPortfolio();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-500/30 text-center cursor-pointer transition-all"
              title="Career Portfolio"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
              <span className="text-[9px] font-semibold text-slate-300 block">Resume</span>
            </button>

            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 text-center cursor-pointer transition-all"
              title="Settings & Preferences"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400 mx-auto mb-1" />
              <span className="text-[9px] font-semibold text-slate-300 block">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
