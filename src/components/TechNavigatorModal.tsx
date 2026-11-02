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
  CornerDownLeft,
  ShieldAlert,
  Smartphone
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
  // 🕵️‍♂️ Threat Intelligence & Mobile Security
  {
    id: 'crimematrix',
    title: 'CyberCrime Matrix',
    category: 'App',
    description: 'Anatomy of SIM Swap, Deepfake Audio Voice Cloning, SPF/DKIM spoofing, Android RAT & OSINT.',
    icon: ShieldAlert,
    appTarget: 'crimematrix',
    hashTarget: '#crimematrix',
    keywords: [
      'crime',
      'crimematrix',
      'sim swap',
      'ss7',
      'deepfake',
      'voice cloning',
      'audio',
      'spf',
      'dkim',
      'dmarc',
      'email spoofing',
      'rat',
      'trojan',
      'c2',
      'accessibility',
      'osint',
      'identity theft',
      'phishing'
    ]
  },
  {
    id: 'mobilesec',
    title: 'MobileSec Lab',
    category: 'App',
    description: 'Smartphone internals, Smishing heuristic scanner, Android OS layers, Evil Twin Wi-Fi & ADB.',
    icon: Smartphone,
    appTarget: 'mobilesec',
    hashTarget: '#mobilesec',
    keywords: [
      'mobilesec',
      'mobile',
      'smishing',
      'sms phishing',
      'evil twin',
      'fake wifi',
      'pineapple',
      'adb',
      'android debug bridge',
      'juice jacking',
      'permissions',
      'privilege escalation',
      'forensics',
      'ceir',
      'imei',
      'ble mesh'
    ]
  },
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
  {
    id: 'exam',
    title: 'BCA Exam Simulator & Mock Test',
    category: 'Tool',
    description: 'Timed university mock exam, negative marking (-0.25), scorecard, and Weakness Detector.',
    icon: GraduationCap,
    appTarget: 'exam' as CurrentAppType,
    hashTarget: '#exam',
    keywords: ['exam', 'test', 'mock', 'mcq', 'scorecard', 'timer', 'questions', 'bca exam', 'quiz']
  },
  {
    id: 'playground',
    title: 'Live Multi-Language Playground',
    category: 'Tool',
    description: 'In-browser compiler & runner for Python, Java, C++, and JavaScript with AI Explainer.',
    icon: Terminal,
    appTarget: 'playground' as CurrentAppType,
    hashTarget: '#playground',
    keywords: ['playground', 'compiler', 'python', 'java', 'cpp', 'javascript', 'runner', 'code editor', 'ide']
  },
  {
    id: 'visuallab',
    title: 'Visual DBMS & OS Lab',
    category: 'Tool',
    description: 'Interactive ER Diagram builder, SQL Join table animator, and OS CPU Gantt Scheduler.',
    icon: Cpu,
    appTarget: 'visuallab' as CurrentAppType,
    hashTarget: '#visuallab',
    keywords: ['visuallab', 'er diagram', 'sql join', 'cpu scheduler', 'gantt chart', 'fcfs', 'sjf', 'round robin', 'dbms lab', 'os lab']
  },
  {
    id: 'askai',
    title: 'AI BCA Doubt Solver',
    category: 'Tool',
    description: '24/7 client-side smart doubt solver for BCA concepts, viva prep, and algorithm breakdowns.',
    icon: Sparkles,
    appTarget: 'askai' as CurrentAppType,
    hashTarget: '#askai',
    keywords: ['askai', 'ai tutor', 'doubt', 'solver', 'viva', 'explain', 'bcnf', 'deadlock', 'pointers']
  },
  {
    id: 'placement',
    title: 'Placement Prep Hub',
    category: 'App',
    description: 'TCS, Infosys, Wipro hiring patterns, quantitative aptitude solvers, and winning HR interview answers.',
    icon: Zap,
    appTarget: 'placement' as CurrentAppType,
    hashTarget: '#placement',
    keywords: ['placement', 'tcs', 'infosys', 'wipro', 'accenture', 'aptitude', 'hr round', 'interview', 'jobs', 'campus']
  },
  {
    id: 'bca-python',
    title: 'Python Programming (Sem 1 & 2)',
    category: 'Topic',
    description: 'Variables, loops, OOP, NumPy/Pandas, and file handling interactive notes & code.',
    icon: Terminal,
    appTarget: 'python' as CurrentAppType,
    hashTarget: '#python',
    keywords: ['python', 'oop', 'pandas', 'numpy', 'functions', 'sem 1', 'sem 2']
  },
  {
    id: 'bca-java',
    title: 'Java Programming (Sem 1 & 2)',
    category: 'Topic',
    description: 'Core Java, OOP, Exception handling, Collections Framework, and Multithreading.',
    icon: Terminal,
    appTarget: 'java' as CurrentAppType,
    hashTarget: '#java',
    keywords: ['java', 'jvm', 'oop', 'collections', 'multithreading', 'exception', 'inheritance']
  },
  {
    id: 'bca-cpp',
    title: 'C++ & Object Oriented Programming',
    category: 'Topic',
    description: 'Classes, Objects, Inheritance, Polymorphism, and STL Vectors & Maps.',
    icon: Terminal,
    appTarget: 'cpp' as CurrentAppType,
    hashTarget: '#cpp',
    keywords: ['cpp', 'c++', 'stl', 'vectors', 'classes', 'polymorphism', 'templates']
  },
  {
    id: 'bca-dbms',
    title: 'DBMS & Relational Database Design',
    category: 'Topic',
    description: 'Normalization (1NF to BCNF), ER Diagrams, SQL Queries, and Triggers.',
    icon: Cpu,
    appTarget: 'dbms' as CurrentAppType,
    hashTarget: '#dbms',
    keywords: ['dbms', 'sql', 'normalization', 'bcnf', '3nf', 'relational', 'keys', 'joins']
  },
  {
    id: 'bca-os',
    title: 'Operating Systems (Sem 3 & 4)',
    category: 'Topic',
    description: 'Process scheduling, Bankers algorithm, Paging, Segmentation, and Deadlock.',
    icon: Cpu,
    appTarget: 'os' as CurrentAppType,
    hashTarget: '#os',
    keywords: ['os', 'operating systems', 'deadlock', 'banker', 'paging', 'virtual memory', 'semaphores']
  },
  {
    id: 'bca-daa',
    title: 'Design & Analysis of Algorithms (DAA)',
    category: 'Topic',
    description: 'Time/space complexity, Greedy, Dynamic Programming, and Backtracking (N-Queens).',
    icon: Brain,
    appTarget: 'daa' as CurrentAppType,
    hashTarget: '#daa',
    keywords: ['daa', 'algorithms', 'knapsack', 'dynamic programming', 'greedy', 'n-queens', 'time complexity']
  },
  {
    id: 'bca-ai',
    title: 'Artificial Intelligence & Search (Sem 5 & 6)',
    category: 'Topic',
    description: 'BFS, DFS, A* Search, Alpha-Beta pruning, Knowledge Representation, and Expert Systems.',
    icon: Brain,
    appTarget: 'ai' as CurrentAppType,
    hashTarget: '#ai',
    keywords: ['ai', 'artificial intelligence', 'a star', 'heuristic', 'expert systems', 'search']
  },
  {
    id: 'bca-cloud',
    title: 'Cloud Computing (Sem 5 & 6)',
    category: 'Topic',
    description: 'IaaS, PaaS, SaaS, AWS, Azure, GCP, Serverless, and Containerization (Docker).',
    icon: Cpu,
    appTarget: 'cloud' as CurrentAppType,
    hashTarget: '#cloud',
    keywords: ['cloud', 'aws', 'docker', 'iaas', 'paas', 'saas', 'kubernetes', 'serverless']
  },
  {
    id: 'bca-cybersec',
    title: 'Cyber Security & Cryptography',
    category: 'Topic',
    description: 'CIA Triad, SQLi, XSS, Firewall, Ethical Hacking, and Cryptographic Ciphers.',
    icon: Shield,
    appTarget: 'cybersec' as CurrentAppType,
    hashTarget: '#cybersec',
    keywords: ['cybersec', 'cyber security', 'sqli', 'xss', 'firewall', 'cia triad', 'ethical hacking']
  },
  // 🧪 Elite Labs
  {
    id: 'forensics',
    title: 'Forensic Cyber Lab',
    category: 'Tool',
    description: 'File metadata viewer, EXIF parser, magic bytes signature checker & LSB stego decoder.',
    icon: Shield,
    appTarget: 'forensics' as CurrentAppType,
    hashTarget: '#forensics',
    keywords: ['forensics', 'exif', 'magic bytes', 'stego', 'steganography', 'hex', 'metadata', 'gps', 'dfir']
  },
  {
    id: 'quantum',
    title: 'Quantum Computing Visualizer',
    category: 'Tool',
    description: 'Interactive Bloch Sphere 3D canvas, Qubit superposition, Pauli-X, Hadamard & Grover race.',
    icon: Sparkles,
    appTarget: 'quantum' as CurrentAppType,
    hashTarget: '#quantum',
    keywords: ['quantum', 'qubit', 'bloch sphere', 'superposition', 'hadamard', 'pauli', 'grover', 'physics']
  },
  {
    id: 'iot',
    title: 'Hardware & IoT Lab',
    category: 'Tool',
    description: 'Raspberry Pi / Arduino 40-pin GPIO interactive pinout, virtual breadboard & Flipper Zero RFID/NFC.',
    icon: Cpu,
    appTarget: 'iot' as CurrentAppType,
    hashTarget: '#iot',
    keywords: ['iot', 'hardware', 'gpio', 'raspberry pi', 'arduino', 'breadboard', 'flipper', 'rfid', 'nfc']
  },
  {
    id: 'sysdesign',
    title: 'System Design Canvas',
    category: 'Tool',
    description: 'Interactive whiteboard cloud topology designer with live traffic load generator & crash simulator.',
    icon: Layers,
    appTarget: 'sysdesign' as CurrentAppType,
    hashTarget: '#sysdesign',
    keywords: ['system design', 'sysdesign', 'architecture', 'load balancer', 'redis', 'cache', 'traffic', 'scale', '504']
  },
  {
    id: 'wealth',
    title: 'TechWealth (Finance for Geeks)',
    category: 'Tool',
    description: 'SIP compounding growth curve, crypto wallet/phishing scam checker & India New Tax Regime salary.',
    icon: Zap,
    appTarget: 'wealth' as CurrentAppType,
    hashTarget: '#wealth',
    keywords: ['wealth', 'finance', 'sip', 'tax', 'salary', 'scam', 'crypto', 'in-hand', 'compounding', 'fire']
  },
  // 🚀 Next-Gen Labs
  {
    id: 'robotics',
    title: 'Drone & Robotics Simulator',
    category: 'Tool',
    description: '2D quadcopter flight physics on Canvas, PID altitude stabilizer & A* pathfinding maze solver.',
    icon: Zap,
    appTarget: 'robotics' as CurrentAppType,
    hashTarget: '#robotics',
    keywords: ['drone', 'robotics', 'quadcopter', 'pid', 'a*', 'pathfinding', 'flight', 'physics', 'aerodynamics']
  },
  {
    id: 'geoint',
    title: 'Satellite & Geospatial Intel (GEOINT)',
    category: 'Tool',
    description: '3-satellite GPS trilateration radar, tactical EXIF coordinate locator & 3D SAR terrain wireframe.',
    icon: Compass,
    appTarget: 'geoint' as CurrentAppType,
    hashTarget: '#geoint',
    keywords: ['geoint', 'satellite', 'gps', 'trilateration', 'radar', 'elevation', 'terrain', 'coordinates', 'intel']
  },
  {
    id: 'vision',
    title: 'Computer Vision & Biometrics Lab',
    category: 'Tool',
    description: 'CNN 3x3 convolution kernels (Sobel/Blur), Dlib 68-point face landmark mesh & OCR pipeline.',
    icon: Sparkles,
    appTarget: 'vision' as CurrentAppType,
    hashTarget: '#vision',
    keywords: ['vision', 'cnn', 'convolution', 'sobel', 'face', 'landmarks', 'dlib', 'biometrics', 'ocr']
  },
  {
    id: 'onion',
    title: 'Onion Routing & Tor Concepts',
    category: 'Tool',
    description: '3-hop circuit encryption peeling (Guard/Middle/Exit nodes), PGP key exchange demo & disclaimer.',
    icon: Lock,
    appTarget: 'onion' as CurrentAppType,
    hashTarget: '#onion',
    keywords: ['onion', 'tor', 'dark web', 'privacy', 'pgp', 'encryption', 'guard', 'exit relay', 'circuit']
  },
  {
    id: 'gamedev',
    title: 'Game Engine & Physics Sandbox',
    category: 'Tool',
    description: '2D rigid-body restitution physics canvas, fixed time step loop & classic Doom 2D-to-3D raycasting.',
    icon: Terminal,
    appTarget: 'gamedev' as CurrentAppType,
    hashTarget: '#gamedev',
    keywords: ['gamedev', 'game engine', 'physics', 'sandbox', 'raycasting', 'doom', 'gameloop', 'gravity', 'collision']
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
