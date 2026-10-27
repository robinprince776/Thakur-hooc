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
  Code2,
  GraduationCap,
  Lock,
  Activity,
  Briefcase,
  HardDrive,
  Database,
  Box,
  AlertTriangle,
  Key,
  Clock,
  Sliders,
  Scale,
  Gauge,
  GitMerge,
  ShieldAlert,
  Share2,
  Brain
} from 'lucide-react';
import { SukhanPenIcon } from '../sukhan/components/SukhanPenIcon';
import { OmnitrixLogo } from './OmnitrixLogo';

export type CurrentAppType =
  // 🗺️ Career
  | 'career'
  // 📚 Education
  | 'bca'
  | 'techmaster'
  | 'linux'
  | 'pcxray'
  | 'netviz'
  | 'dsa'
  // 💻 Dev & Cloud
  | 'compiler'
  | 'dev'
  | 'docucraft'
  | 'gitstudio'
  | 'database'
  | 'systemdesign'
  | 'cloudops'
  | 'cicd'
  | 'containers'
  | 'cloudiam'
  | 'netsec'
  | 'apix'
  | 'webperf'
  | 'gitflow'
  // 🛡️ Security
  | 'cyber'
  | 'cyberpath'
  | 'sentinel'
  | 'academy'
  | 'recon'
  | 'securecode'
  | 'siem'
  | 'threatintel'
  | 'forensics'
  | 'cryptomaster'
  | 'reversing'
  | 'threatmodel'
  // 🧠 Psychology
  | 'mindshield'
  // 🗺️ Diagrams
  | 'atlas'
  // ⚙️ Utilities & Wellness
  | 'promptcraft'
  | 'calc'
  | 'focus'
  | 'zenfocus'
  | 'compliance'
  | 'dataformat'
  | 'regexmaster'
  | 'sukhan'
  // 🩺 Clinical & Pharma
  | 'medicore';

interface AppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: CurrentAppType;
  onSelectApp: (app: CurrentAppType) => void;
}

interface AppItem {
  id: CurrentAppType;
  category: 'Career' | 'Education' | 'Security' | 'Dev' | 'Psychology' | 'Diagrams' | 'Utilities';
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
  // 🎯 Career (1 App)
  {
    id: 'career',
    category: 'Career',
    title: 'TechCareer Hub',
    subtitle: 'Roadmaps, Salaries & AI Interviewer',
    tagline: 'Cybersecurity, Cloud & AI Careers · ₹5L to ₹1.5Cr+',
    description: '6-Month step-by-step roadmaps (SOC, Pentester, Cloud), FAANG salary benchmarks, certifications guide, and simulated interview evaluations.',
    badge: 'Career Mega-Hub',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    hash: '#career',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md">
        <Briefcase className="w-5 h-5 text-emerald-200" />
      </div>
    )
  },

  // 🧠 Psychology (1 App)
  {
    id: 'mindshield',
    category: 'Psychology',
    title: 'MindShield Lab',
    subtitle: 'Human Psychology & Social Defense',
    tagline: 'Cognitive Biases · Dark UX Defense · Cialdini Rules · Phishing Sim',
    description: 'Master cognitive biases exploited by hackers, defeat manipulative Dark UX patterns, study Cialdini persuasion principles, and simulate social engineering defenses.',
    badge: 'Human Defense',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    hash: '#mindshield',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
        <Brain className="w-5 h-5 text-purple-200" />
      </div>
    )
  },

  // 🗺️ Diagrams & Mind Maps (1 App)
  {
    id: 'atlas',
    category: 'Diagrams',
    title: 'VisualAtlas',
    subtitle: 'Interactive Mind Maps & Architecture',
    tagline: 'OSI 7-Layers · Cyber Kill Chain · C Pointer Memory · K8s Control Plane',
    description: 'The ultimate visual revision workbench. Clickable dynamic architecture diagrams spanning networking, cybersecurity kill chain, C stack/heap memory, and Kubernetes.',
    badge: 'Visual Engine',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    hash: '#atlas',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
        <Layers className="w-5 h-5 text-cyan-200" />
      </div>
    )
  },

  // 📚 Education (6 Apps)
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
  {
    id: 'linux',
    category: 'Education',
    title: 'Linux & Kali Mastery',
    subtitle: 'Interactive Terminal & Permission Lab',
    tagline: 'Bash Simulator · File Hierarchy · chmod Octal Calculator',
    description: 'Hands-on browser-based Linux terminal simulator, visual permissions converter (rwx/755), and Kali tool exploration.',
    badge: 'Hands-On CLI',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    hash: '#linux',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-emerald-400 shadow-md">
        <Terminal className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'pcxray',
    category: 'Education',
    title: 'PC Hardware & OS Explorer',
    subtitle: 'Interactive Computer Architecture',
    tagline: 'CPU Registers · RAM Paging · Kernel Ring 0 · Boot POST',
    description: 'Animated step-by-step PC boot lifecycle (POST, BIOS/UEFI, Bootloader, Kernel Init) and hardware breakdown with ELI5 explanations.',
    badge: 'Hardware X-Ray',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hash: '#pcxray',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-md">
        <HardDrive className="w-5 h-5 text-amber-200" />
      </div>
    )
  },
  {
    id: 'netviz',
    category: 'Education',
    title: 'Networking Visualizer',
    subtitle: 'OSI 7 Layers & Packet Flow Lab',
    tagline: 'TCP 3-Way Handshake · DNS Resolver · Subnet CIDR Calc',
    description: 'Interactive animated packet encapsulation through the 7 OSI layers, SYN-SYN/ACK-ACK flow, and IPv4 CIDR calculator.',
    badge: 'Interactive Net',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    hash: '#netviz',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
        <Globe className="w-5 h-5 text-blue-200" />
      </div>
    )
  },
  {
    id: 'dsa',
    category: 'Education',
    title: 'Data Structures Lab',
    subtitle: 'Visual DSA & Memory Simulator',
    tagline: 'Stack (LIFO) · Queue (FIFO) · Linked List · BST Trees',
    description: 'Visual push/pop animations, dynamic pointer representation, and side-by-side production C implementations with Big-O analysis.',
    badge: 'Visual DSA',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    hash: '#dsa',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-800 flex items-center justify-center text-white shadow-md">
        <Layers className="w-5 h-5 text-violet-200" />
      </div>
    )
  },

  // 🛡️ Security (12 Apps)
  {
    id: 'cyber',
    category: 'Security',
    title: 'CyberShield Lab',
    subtitle: 'Offense & Defense Simulation',
    tagline: 'Cryptography · Network Protocols · Legal CTF Challenges',
    description: 'Educational cybersecurity laboratory featuring hashing simulators, MITRE ATT&CK maps, and interactive security exercises.',
    badge: 'Cybersecurity',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    hash: '#cyber',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md">
        <Shield className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'cyberpath',
    category: 'Security',
    title: 'CyberPath',
    subtitle: 'Zero to Master Cybersecurity',
    tagline: 'Hacker Mindset · Attack Sim Lab · SOC Tier 1 · Daily Quests',
    description: 'Comprehensive 6-module interactive academy covering STRIDE threat modeling, visual attack simulations, hands-on SOC tools, and cert roadmaps.',
    badge: 'Mega-App',
    badgeColor: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/40',
    hash: '#cyberpath',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
        <Sparkles className="w-5 h-5 text-cyan-200" />
      </div>
    )
  },
  {
    id: 'sentinel',
    category: 'Security',
    title: 'SentinelLab',
    subtitle: 'Defensive Security & Blue Team',
    tagline: 'Password Entropy · Hashes · Headers · Log Analyzer · Phishing Sim',
    description: 'Security analyst & SOC toolkit with entropy calculation, Web Crypto API SHA/MD5 hashing, multi-format encoding, log triage, and OWASP defenses.',
    badge: 'Blue Team',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    hash: '#sentinel',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
        <Lock className="w-5 h-5 text-cyan-200" />
      </div>
    )
  },
  {
    id: 'academy',
    category: 'Security',
    title: 'CyberAcademy',
    subtitle: 'Hands-On Learning & Career Hub',
    tagline: 'CTF Arena · Crypto Playground · Stego · Network · Career Roadmap',
    description: '100% legal ethical hacking practice arena with built-in CTF puzzles, AES-GCM encryption visualizer, LSB image steganography, and career paths.',
    badge: 'CTF Arena',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    hash: '#academy',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
        <GraduationCap className="w-5 h-5 text-purple-200" />
      </div>
    )
  },
  {
    id: 'recon',
    category: 'Security',
    title: 'ReconMaster',
    subtitle: 'Defensive OSINT & Recon Toolkit',
    tagline: 'DNS Analyzer · IP Geolocation · Nmap Generator · Google Dorks',
    description: 'Comprehensive OSINT inspection suite featuring DNS record triage, IP range subnetting, hardened Nmap syntax, and 50+ defensive Google dorks.',
    badge: 'OSINT Suite',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    hash: '#recon',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md">
        <Search className="w-5 h-5 text-teal-200" />
      </div>
    )
  },
  {
    id: 'securecode',
    category: 'Security',
    title: 'SecureCode Lab',
    subtitle: 'AppSec & Defensive Coding',
    tagline: 'Hash Identifier · Encoding Toolkit · OWASP Top 10 Fixes',
    description: 'Learn secure coding in C, C++, and Web with side-by-side vulnerable vs remediated code, cryptographic hash detection, and input sanitizer guides.',
    badge: 'AppSec',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    hash: '#securecode',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md">
        <Shield className="w-5 h-5 text-emerald-200" />
      </div>
    )
  },
  {
    id: 'siem',
    category: 'Security',
    title: 'SIEM & SOC Log Inspector',
    subtitle: 'Live Incident Triage & Threat Detection',
    tagline: 'Linux auth.log · Nginx HTTP · SSH Brute Force Regex Triage',
    description: 'Interactive Blue Team log analytics studio with regex queries, severity tagging, MITRE mapping, and attacker IP pattern detection.',
    badge: 'SOC Triage',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    hash: '#siem',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-900 flex items-center justify-center text-white shadow-md">
        <Activity className="w-5 h-5 text-blue-200" />
      </div>
    )
  },
  {
    id: 'threatintel',
    category: 'Security',
    title: 'Threat Intel & IOC Extractor',
    subtitle: 'Indicators of Compromise & MITRE Matrix',
    tagline: 'Extract IPv4/Domains/SHA256 · Pyramid of Pain · ATT&CK',
    description: 'Automated IOC extraction from raw threat reports, David Bianco Pyramid of Pain visualizer, and enterprise defensive matrix.',
    badge: 'Threat Intel',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    hash: '#threatintel',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 to-violet-900 flex items-center justify-center text-white shadow-md">
        <ShieldAlert className="w-5 h-5 text-indigo-200" />
      </div>
    )
  },
  {
    id: 'forensics',
    category: 'Security',
    title: 'Digital Forensics Workbench',
    subtitle: 'Artifact Analysis & File Signatures',
    tagline: 'Magic Bytes (Hex) · EXIF Metadata · Memory Volatility Guide',
    description: 'Header magic byte inspector (PNG, ELF, PE, PDF, ZIP), EXIF GPS & camera metadata analyzer, and incident triage memory guide.',
    badge: 'DFIR',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    hash: '#forensics',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-pink-900 flex items-center justify-center text-white shadow-md">
        <Search className="w-5 h-5 text-purple-200" />
      </div>
    )
  },
  {
    id: 'cryptomaster',
    category: 'Security',
    title: 'Crypto & Post-Quantum Lab',
    subtitle: 'Modern & Post-Quantum Cryptography',
    tagline: 'Avalanche Effect · RSA Key Math · PQC Kyber/Dilithium Lattices',
    description: 'Bit-level hash avalanche effect visualizer, Euler totient RSA keypair math demonstration, and NIST post-quantum migration guide.',
    badge: 'Crypto Lab',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hash: '#cryptomaster',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-700 flex items-center justify-center text-white shadow-md">
        <Key className="w-5 h-5 text-amber-200" />
      </div>
    )
  },
  {
    id: 'reversing',
    category: 'Security',
    title: 'Reverse Engineering Lab',
    subtitle: 'x86-64 Assembly & Call Stack Sim',
    tagline: 'RAX/RBX Registers · Stack Frames (EBP/ESP) · PE Headers',
    description: 'Visual step-by-step assembly instruction simulator (MOV, ADD, XOR, CMP, JMP), stack frame memory visualizer, and PE portable executable breakdown.',
    badge: 'Reversing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    hash: '#reversing',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-700 to-red-900 flex items-center justify-center text-white shadow-md">
        <Cpu className="w-5 h-5 text-rose-200" />
      </div>
    )
  },
  {
    id: 'threatmodel',
    category: 'Security',
    title: 'ThreatModeling Lab',
    subtitle: 'STRIDE Matrix & DREAD Calculator',
    tagline: 'Spoofing to Elevation · DREAD Risk Scoring · Trust Boundaries',
    description: 'Microsoft STRIDE threat modeling matrix, interactive DREAD vulnerability severity calculator, and secure architecture boundaries.',
    badge: 'Architecture',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    hash: '#threatmodel',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md">
        <ShieldAlert className="w-5 h-5 text-rose-200" />
      </div>
    )
  },

  // 💻 Dev & Cloud (14 Apps)
  {
    id: 'compiler',
    category: 'Dev',
    title: 'Simple C Compiler',
    subtitle: 'In-Browser Sandbox & Runner',
    tagline: 'Zero Setup · Standard Libraries · Instant Output',
    description: 'Clean, distraction-free online C code execution sandbox with pre-loaded BCA curriculum templates and memory inspector.',
    badge: 'Pure Dev',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    hash: '#compiler',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md">
        <Terminal className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'dev',
    category: 'Dev',
    title: 'DevForge Web Studio',
    subtitle: 'Frontend Code Lab',
    tagline: 'HTML · CSS · JavaScript Live Preview',
    description: 'Interactive web prototyping environment with split-pane live preview, console inspection, and asset loaders.',
    badge: 'Frontend',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hash: '#dev',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
        <Wrench className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'docucraft',
    category: 'Dev',
    title: 'DocuCraft',
    subtitle: 'Technical Docs & Markdown',
    tagline: 'Live Rendering · MathJax · PDF Export Ready',
    description: 'Technical document editor with GitHub-flavored Markdown, LaTeX equation rendering, and syntax-highlighted code blocks.',
    badge: 'Docs',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    hash: '#docucraft',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md">
        <FileText className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'gitstudio',
    category: 'Dev',
    title: 'GitStudio',
    subtitle: 'Visual Git Tree & Branching',
    tagline: 'Interactive DAG · Rebase · Cherry-Pick Simulator',
    description: 'Interactive visualization of Git commit graphs, branch lifecycles, stash operations, and merge conflict resolution.',
    badge: 'Git Tool',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    hash: '#gitstudio',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center text-white shadow-md">
        <GitBranch className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'database',
    category: 'Dev',
    title: 'SQL Playground',
    subtitle: 'In-Memory Relational Database Sandbox',
    tagline: 'SELECT · JOIN · GROUP BY · Schema Visualizer',
    description: 'Interactive SQL query workbench with live employee/security dataset, explain visualizer, and syntax presets.',
    badge: 'SQL Sandbox',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    hash: '#database',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-700 flex items-center justify-center text-white shadow-md">
        <Database className="w-5 h-5 text-blue-200" />
      </div>
    )
  },
  {
    id: 'systemdesign',
    category: 'Dev',
    title: 'SystemDesign Lab',
    subtitle: 'Distributed Systems & Architecture Sim',
    tagline: 'CAP Theorem · Ingress QPS Sim · Caching Patterns',
    description: 'Interactive high-scale architecture simulator with CDN, Redis cache-aside, DB read replicas, and back-of-the-envelope estimation.',
    badge: 'Architecture',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    hash: '#systemdesign',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
        <Share2 className="w-5 h-5 text-cyan-200" />
      </div>
    )
  },
  {
    id: 'cloudops',
    category: 'Dev',
    title: 'CloudOps',
    subtitle: 'Cloud & Infrastructure Reference',
    tagline: 'AWS · Docker · Kubernetes · Terraform Blueprints',
    description: 'Cloud engineer cheat sheet with production-ready configurations, cost optimization patterns, and zero-trust IAM templates.',
    badge: 'Cloud',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    hash: '#cloudops',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md">
        <Cloud className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'cicd',
    category: 'Dev',
    title: 'DevSecOps CI/CD Lab',
    subtitle: 'Automated Pipeline Hardening',
    tagline: 'GitHub Actions · SAST (Semgrep) · Secret Scanning (TruffleHog)',
    description: 'Interactive hardened CI/CD pipeline generator with automated static analysis, dependency audit, and branch protection security gates.',
    badge: 'DevSecOps',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    hash: '#cicd',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md">
        <GitBranch className="w-5 h-5 text-indigo-200" />
      </div>
    )
  },
  {
    id: 'containers',
    category: 'Dev',
    title: 'Container & K8s Lab',
    subtitle: 'Docker Hardening & Kubernetes Pods',
    tagline: 'Multi-Stage Dockerfile · Non-Root User · K8s SecurityContext',
    description: 'Production Dockerfile generator, Kubernetes deployment manifest builder with readOnlyRootFilesystem and drop ALL capabilities.',
    badge: 'Containers',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    hash: '#containers',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-800 flex items-center justify-center text-white shadow-md">
        <Box className="w-5 h-5 text-sky-200" />
      </div>
    )
  },
  {
    id: 'cloudiam',
    category: 'Dev',
    title: 'Cloud IAM & Policy Studio',
    subtitle: 'Least Privilege AWS IAM Builder',
    tagline: 'JSON IAM Policies · S3 Bucket Policy Audit · Confused Deputy Fix',
    description: 'Visual generator for least privilege AWS IAM policies, S3 public block auditing, and cross-account sts:ExternalId security guide.',
    badge: 'Cloud IAM',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hash: '#cloudiam',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-md">
        <Lock className="w-5 h-5 text-amber-200" />
      </div>
    )
  },
  {
    id: 'netsec',
    category: 'Dev',
    title: 'NetSec Studio',
    subtitle: 'Web Security & Headers',
    tagline: 'CSP Generator · HSTS · CORS · Cookie Hardening',
    description: 'Interactive HTTP security header generator with real-time policy evaluation, XSS mitigation rules, and TLS configuration checkers.',
    badge: 'NetSec',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    hash: '#netsec',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
        <Globe className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'apix',
    category: 'Dev',
    title: 'ApiX',
    subtitle: 'API Inspector & HTTP Client',
    tagline: 'cURL Converter · REST Sandbox · Auth Tester',
    description: 'Lightweight client-side API prototyping console for composing requests, inspecting headers, and formatting JSON payloads.',
    badge: 'API Client',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    hash: '#apix',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
        <Server className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'webperf',
    category: 'Dev',
    title: 'WebPerf Lab',
    subtitle: 'Core Web Vitals & Asset Optimizer',
    tagline: 'LCP, INP, CLS Simulator · AVIF/WebP Compression · Cache-Control',
    description: 'Lighthouse metrics simulator, AVIF/WebP bandwidth savings calculator, and HTTP Cache-Control header strategy guide.',
    badge: 'Performance',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    hash: '#webperf',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md">
        <Gauge className="w-5 h-5 text-amber-200" />
      </div>
    )
  },
  {
    id: 'gitflow',
    category: 'Dev',
    title: 'GitFlow Lab',
    subtitle: 'Pro Git & Disaster Recovery',
    tagline: 'Rebase vs Merge · Cherry-Pick · Reflog Recovery · Bisect',
    description: 'Visual interactive Rebase vs Merge simulator, disaster recovery via git reflog, and cherry-picking for production hotfixes.',
    badge: 'Git Pro',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    hash: '#gitflow',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md">
        <GitMerge className="w-5 h-5 text-indigo-200" />
      </div>
    )
  },

  // ⚙️ Utilities & Wellness (8 Apps)
  {
    id: 'zenfocus',
    category: 'Utilities',
    title: 'ZenFocus',
    subtitle: 'Burnout Prevention & Mindful Flow',
    tagline: '4-7-8 Breathwork Pacer · Web Audio Soundscapes · Shutdown Ritual',
    description: 'Engineer wellness workspace with interactive vagus nerve breathing pacer, synthesizer-generated brown noise and binaural beats, and evening shutdown routines.',
    badge: 'Wellness',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    hash: '#zenfocus',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md">
        <Heart className="w-5 h-5 text-teal-200" />
      </div>
    )
  },
  {
    id: 'focus',
    category: 'Utilities',
    title: 'Focus Pomodoro Studio',
    subtitle: 'Deep Work & Pomodoro Lab',
    tagline: '25/5 Timer · Ambient White Noise · Daily Goal Tracker',
    description: 'Clean distraction-free focus workspace with Pomodoro cycles, streak counters, and customizable session audio signals.',
    badge: 'Focus',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    hash: '#focus',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md">
        <Clock className="w-5 h-5 text-emerald-200" />
      </div>
    )
  },
  {
    id: 'promptcraft',
    category: 'Utilities',
    title: 'PromptCraft',
    subtitle: 'AI Prompt Engineering Lab',
    tagline: 'Chain-of-Thought · Few-Shot · System Prompt Builder',
    description: 'Master prompt engineering techniques with interactive templates, token analyzers, and structured output designers.',
    badge: 'AI Lab',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    hash: '#promptcraft',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center text-white shadow-md">
        <Sparkles className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'calc',
    category: 'Utilities',
    title: 'CalcVault',
    subtitle: 'Discreet Calculator & Vault',
    tagline: 'P2P Encrypted Mesh · Zero Server Storage · Stealth UI',
    description: 'Functional high-precision scientific calculator with a secret PIN mode for encrypted notes, file vaults, and peer-to-peer messaging.',
    badge: 'Privacy',
    badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    hash: '#calc',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-white shadow-md">
        <CalcIcon className="w-5 h-5" />
      </div>
    )
  },
  {
    id: 'dataformat',
    category: 'Utilities',
    title: 'Data Formatter & Minifier',
    subtitle: 'JSON, YAML & XML Parser',
    tagline: 'Beautify · Minify · Syntax Validator · Escaper',
    description: 'Instant client-side JSON/YAML/XML formatting, tree inspection, payload minification, and schema validation.',
    badge: 'Data Utility',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    hash: '#dataformat',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md">
        <FileText className="w-5 h-5 text-teal-200" />
      </div>
    )
  },
  {
    id: 'regexmaster',
    category: 'Utilities',
    title: 'Regex Master Lab',
    subtitle: 'Real-Time Regular Expression Playground',
    tagline: 'Live Regex Matcher · Group Capturing · Security Patterns',
    description: 'High-speed client-side regex tester with match highlighting, capture group extraction, and common security regexes.',
    badge: 'Regex Pro',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    hash: '#regexmaster',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md">
        <Code2 className="w-5 h-5 text-indigo-200" />
      </div>
    )
  },
  {
    id: 'compliance',
    category: 'Utilities',
    title: 'ComplianceLab',
    subtitle: 'Cyber Laws & Audit Readiness',
    tagline: 'Indian IT Act 2000 · GDPR · SOC 2 · ISO 27001 · HIPAA',
    description: 'Interactive legal compliance and regulatory audit checklist covering Section 43/66 penalties, CERT-In 6-hour reporting, and GDPR Right to Erasure.',
    badge: 'Cyber Law',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    hash: '#compliance',
    icon: (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md">
        <Scale className="w-5 h-5 text-emerald-200" />
      </div>
    )
  },
  {
    id: 'sukhan',
    category: 'Utilities',
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

const CATEGORIES = ['All', 'Career', 'Education', 'Security', 'Dev', 'Psychology', 'Diagrams', 'Utilities'] as const;

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
      app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <OmnitrixLogo size="md" glow={true} animated={true} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                TechMaster Ultimate Ecosystem
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  42+ Applications · Zero Lag
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                100% legal, defensive, educational suite across Education, Security, Dev, Career, Psychology, Diagrams & Utilities
              </p>
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
                    ? 'bg-cyan-600 text-white shadow-md'
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
              placeholder="Search 42 apps..."
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 w-full sm:w-64"
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
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
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
                          <span className="text-[10px] text-cyan-400 font-mono font-bold">● Active</span>
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
                  <span className="font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
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
          <span>Engineered by Prince Thakur · 42+ Production Applications</span>
          <span>Switch anytime via URL hash, top navigation or ⌘K</span>
        </div>
      </div>
    </div>
  );
};
