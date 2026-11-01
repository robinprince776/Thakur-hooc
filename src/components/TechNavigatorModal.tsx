import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Terminal,
  Cpu,
  Shield,
  BookOpen,
  Brain,
  Zap,
  Calculator,
  Compass,
  FileText,
  Lock,
  Layers,
  Heart,
  Music,
  GraduationCap,
  Sparkles,
  Command,
  CornerDownLeft
} from 'lucide-react';
import { CurrentAppType } from './AppSwitcherModal';

export interface TechNavigatorItem {
  id: string;
  title: string;
  category: 'App' | 'Topic' | 'Tool' | 'Exam Note';
  description: string;
  icon: any;
  appTarget: CurrentAppType;
  tabTarget?: string;
  hashTarget?: string;
  keywords: string[];
}

export const NAVIGATOR_ITEMS: TechNavigatorItem[] = [
  // Flagship Apps
  {
    id: 'technagar',
    title: 'TechNagar Chronicles',
    category: 'App',
    description: '18 Chapters comic-chat story with Aarav & Byte. Voice TTS narration.',
    icon: BookOpen,
    appTarget: 'technagar',
    hashTarget: '#technagar',
    keywords: ['story', 'byte', 'aarav', 'audio', 'tts', 'computer', 'beginner', 'chronicles']
  },
  {
    id: 'feynman',
    title: 'Mastery Lab: Feynman AI Simulator',
    category: 'Tool',
    description: 'Explain topics to a 10-year-old child. Get real-time clarity scores & jargon checks.',
    icon: Brain,
    appTarget: 'feynman' as CurrentAppType,
    hashTarget: '#feynman',
    keywords: ['feynman', 'mastery', 'clarity', 'jargon', 'explain', 'kid', 'simplicity', 'test']
  },
  {
    id: 'medicore',
    title: 'MediCore Pro Clinical Desk',
    category: 'App',
    description: 'D-Pharma reference: Disease Matrix, Drug Vault, IV Fluids, Cannula, Rx Decoder.',
    icon: Heart,
    appTarget: 'medicore',
    hashTarget: '#medicore',
    keywords: ['fever', 'medicine', 'pharma', 'd-pharma', 'drugs', 'iv fluids', 'cannula', 'disease', 'doctor', 'clinic', 'paracetamol']
  },
  {
    id: 'upsc',
    title: 'UPSC CSE Civil Services Navigator',
    category: 'App',
    description: 'IAS/IPS master hub: GS 1-4 syllabus, topper booklist, PESTLE mains answers simulator.',
    icon: GraduationCap,
    appTarget: 'upsc',
    hashTarget: '#upsc',
    keywords: ['upsc', 'ias', 'ips', 'civil services', 'prelims', 'mains', 'gs1', 'history', 'polity']
  },
  {
    id: 'music',
    title: 'SvaraPulse Musicology Studio',
    category: 'App',
    description: 'Indian classical ragas, Western circle of fifths, synthesizers, audio engine.',
    icon: Music,
    appTarget: 'music',
    hashTarget: '#music',
    keywords: ['music', 'ragas', 'sound', 'piano', 'frequencies', 'circle of fifths', 'audio', 'scales']
  },
  {
    id: 'techmaster',
    title: 'TechMaster 2000+ BCA Vault',
    category: 'App',
    description: '2,000+ BCA Q&As, university syllabus, semester exam prep.',
    icon: Cpu,
    appTarget: 'techmaster',
    hashTarget: '#techmaster',
    keywords: ['techmaster', 'bca', 'notes', 'questions', 'answers', 'semester']
  },
  {
    id: 'compiler',
    title: 'C Compiler & Code Runner',
    category: 'Tool',
    description: 'Fast client-side C code execution with custom stdin and terminal logs.',
    icon: Terminal,
    appTarget: 'compiler',
    hashTarget: '#compiler',
    keywords: ['c', 'compiler', 'code', 'runner', 'pointers', 'arrays', 'functions']
  },
  {
    id: 'cyber',
    title: 'CyberShield Security Suite',
    category: 'App',
    description: 'Offensive & defensive security tools, payload analysis, Kali shortcuts.',
    icon: Shield,
    appTarget: 'cyber',
    hashTarget: '#cyber',
    keywords: ['cyber', 'security', 'hack', 'kali', 'nmap', 'payload', 'wifi', 'firewall']
  },
  {
    id: 'linux',
    title: 'Linux Command Mastery',
    category: 'Tool',
    description: 'Interactive Linux terminal emulator, bash scripts, piping & grep.',
    icon: Terminal,
    appTarget: 'linux',
    hashTarget: '#linux',
    keywords: ['linux', 'bash', 'terminal', 'commands', 'chmod', 'chown', 'grep', 'shell']
  },
  {
    id: 'cryptomaster',
    title: 'CryptoMaster Encryption Lab',
    category: 'Tool',
    description: 'AES-256, RSA, ECC, SHA-256, Post-Quantum Cryptography interactive tests.',
    icon: Lock,
    appTarget: 'cryptomaster',
    hashTarget: '#cryptomaster',
    keywords: ['aes', 'rsa', 'crypto', 'encryption', 'hash', 'sha256', 'pqc', 'ciphers']
  },
  {
    id: 'brain',
    title: 'NeuroNet Knowledge Graph',
    category: 'App',
    description: 'Interactive force-directed graph connecting all concepts, apps and notes.',
    icon: Brain,
    appTarget: 'brain' as CurrentAppType,
    hashTarget: '#brain',
    keywords: ['brain', 'neuronet', 'graph', 'canvas', 'nodes', 'connections', 'mindmap', 'second brain']
  },
  {
    id: 'portfolio',
    title: 'My Portfolio & Career Resume',
    category: 'Tool',
    description: 'Auto-aggregated skill resume, verified module certificates, 1-click PDF export.',
    icon: FileText,
    appTarget: 'portfolio' as CurrentAppType,
    hashTarget: '#portfolio',
    keywords: ['portfolio', 'resume', 'career', 'pdf', 'cv', 'skills', 'export']
  },
  {
    id: 'projectx',
    title: 'Project-X Secret Cyber Lab',
    category: 'Tool',
    description: 'Hidden vault unlocked with 3 ciphers: Advanced hacker terminal simulator.',
    icon: Lock,
    appTarget: 'projectx' as CurrentAppType,
    hashTarget: '#projectx',
    keywords: ['projectx', 'vault', 'secret', 'hacker', 'matrix', 'terminal', 'hidden']
  },
  // Core BCA Topics & Solvers
  {
    id: 'logic-solver',
    title: 'Logic & Number System Solver',
    category: 'Tool',
    description: 'Binary, Octal, Hexadecimal conversions with remainder table step-by-step.',
    icon: Cpu,
    appTarget: 'bca',
    tabTarget: 'logic-solver',
    keywords: ['binary', 'decimal', 'hex', 'octal', 'conversion', 'complements', 'logic gates']
  },
  {
    id: 'c-programs',
    title: '45+ Ready C Programs',
    category: 'Topic',
    description: 'Fibonacci, Prime numbers, Bubble sort, Matrix multiplication with dry-run.',
    icon: Terminal,
    appTarget: 'bca',
    tabTarget: 'c-generator',
    keywords: ['c programs', 'fibonacci', 'prime', 'bubble sort', 'palindrome', 'armstrong']
  },
  {
    id: 'computer-fundamentals',
    title: 'Computer Fundamentals Notes',
    category: 'Exam Note',
    description: 'Von Neumann, 1st-5th Generations, RAM vs ROM, Operating System notes.',
    icon: FileText,
    appTarget: 'bca',
    tabTarget: 'fundamentals',
    keywords: ['fundamentals', 'von neumann', 'generations', 'ram rom', 'hardware']
  },
  {
    id: 'osi-topic',
    title: 'OSI 7 Layers Network Visualizer',
    category: 'Topic',
    description: 'Physical, Data Link, Network, Transport, Session, Presentation, Application.',
    icon: Layers,
    appTarget: 'netviz',
    hashTarget: '#netviz',
    keywords: ['osi', 'tcp', 'ip', 'layers', 'packets', 'networking']
  },
  {
    id: 'sql-topic',
    title: 'SQL Playground & DB Designer',
    category: 'Tool',
    description: 'Practice SELECT, JOIN, GROUP BY, and schema creation in client-side SQL.',
    icon: Cpu,
    appTarget: 'database',
    hashTarget: '#database',
    keywords: ['sql', 'query', 'database', 'postgres', 'mysql', 'tables', 'schema']
  }
];

interface TechNavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: TechNavigatorItem) => void;
}

export const TechNavigatorModal: React.FC<TechNavigatorModalProps> = ({
  isOpen,
  onClose,
  onSelectItem
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) {
      return NAVIGATOR_ITEMS.slice(0, 8); // Top recommended
    }
    const q = query.toLowerCase().trim();
    return NAVIGATOR_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      const matchCat = item.category.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchKeywords || matchCat;
    });
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        onSelectItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-950/95 border border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-slate-100 backdrop-blur-2xl"
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-cyan-500/20 bg-slate-900/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type anything (e.g., 'Fever', 'Linux', 'AES', 'TechNagar', 'Feynman')..."
            className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm sm:text-base focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Quick Category Hints */}
        <div className="px-5 py-2 bg-slate-900/30 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Search across 46+ Apps, Labs, Notes &amp; Tools</span>
          <span className="hidden sm:inline">Use ↑ ↓ to navigate · ↵ Enter to launch</span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2.5 space-y-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/60 border border-cyan-400/50 shadow-lg text-white'
                      : 'hover:bg-slate-900/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate text-white">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.2 rounded-md text-[9px] font-mono font-bold uppercase bg-slate-800 text-cyan-300 border border-cyan-500/20">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/70 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                        <span>Launch</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'translate-x-1 text-cyan-400' : 'text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <Compass className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">
                Koi result nahi mila "{query}" ke liye.
              </p>
              <p className="text-xs text-slate-500">
                Try searching "Fever", "Linux", "AES", "C Programs", "Feynman", ya "TechNagar".
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>TechNavigator 2.0 · Global Ecosystem Launcher</span>
          <span className="text-cyan-400 font-bold">Press Ctrl + K anytime</span>
        </div>
      </div>
    </div>
  );
};
