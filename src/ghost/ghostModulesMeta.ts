import { GhostModuleId } from '../store/useGhostStore';

export interface GhostModuleMeta {
  id: GhostModuleId;
  num: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: 'Core Operations' | 'Hands-On Labs' | 'Threat & Defense' | 'Knowledge & Career';
  xpReward: number;
}

export const GHOST_MODULES: GhostModuleMeta[] = [
  {
    id: 'command',
    num: '01',
    title: 'Command Center',
    shortTitle: 'Command Center',
    subtitle: 'Threat posture, XP telemetry & simulated global attack canvas',
    category: 'Core Operations',
    xpReward: 50,
  },
  {
    id: 'academy',
    num: '02',
    title: 'Cyber Academy',
    shortTitle: 'Cyber Academy',
    subtitle: 'Interactive SVG skill tree from foundations to principal architecture',
    category: 'Core Operations',
    xpReward: 75,
  },
  {
    id: 'missions',
    num: '03',
    title: 'Mission Control',
    shortTitle: 'Mission Control',
    subtitle: 'Cinematic defensive incident investigations & branching decisions',
    category: 'Core Operations',
    xpReward: 150,
  },
  {
    id: 'range',
    num: '04',
    title: 'Virtual Cyber Range',
    shortTitle: 'Cyber Range VM',
    subtitle: 'Guided mock Kali defensive audit workstation & hardening exercises',
    category: 'Hands-On Labs',
    xpReward: 100,
  },
  {
    id: 'terminal',
    num: '05',
    title: 'Terminal Studio',
    shortTitle: 'Terminal Studio',
    subtitle: 'Browser-based mock bash shell with virtual filesystem & network tools',
    category: 'Hands-On Labs',
    xpReward: 80,
  },
  {
    id: 'network',
    num: '06',
    title: 'Network Intel Lab',
    shortTitle: 'Network Intel',
    subtitle: 'SVG topology & animated TCP/IP packet flow visualizer',
    category: 'Hands-On Labs',
    xpReward: 90,
  },
  {
    id: 'websec',
    num: '07',
    title: 'Web Security Lab',
    shortTitle: 'Web Sec Lab',
    subtitle: 'Defensive SQLi & XSS execution visualizer with mitigation toggles',
    category: 'Hands-On Labs',
    xpReward: 95,
  },
  {
    id: 'forensics',
    num: '08',
    title: 'Digital Forensics Center',
    shortTitle: 'Forensics DFIR',
    subtitle: 'Suspicious log triage, hex viewer & EXIF metadata extractor',
    category: 'Threat & Defense',
    xpReward: 100,
  },
  {
    id: 'threatintel',
    num: '09',
    title: 'Threat Intel Hub',
    shortTitle: 'Threat Intel',
    subtitle: 'Animated threat actor radar & mock OSINT IOC feed',
    category: 'Threat & Defense',
    xpReward: 85,
  },
  {
    id: 'soc',
    num: '10',
    title: 'SOC Operations Center',
    shortTitle: 'SOC Triage',
    subtitle: 'SIEM alert queue triage: True Positive vs False Positive analysis',
    category: 'Threat & Defense',
    xpReward: 110,
  },
  {
    id: 'aisec',
    num: '11',
    title: 'AI Security Lab',
    shortTitle: 'AI Security',
    subtitle: 'Prompt injection boundary visualizer & deepfake spectral inspection',
    category: 'Threat & Defense',
    xpReward: 95,
  },
  {
    id: 'vault',
    num: '12',
    title: 'Knowledge Vault',
    shortTitle: 'Knowledge Vault',
    subtitle: 'Searchable security lexicon & saved incident reports archive',
    category: 'Knowledge & Career',
    xpReward: 60,
  },
  {
    id: 'progression',
    num: '13',
    title: 'Skill Tree & Progression',
    shortTitle: 'XP & Ranks',
    subtitle: 'Ghost Protocol rank tiers, competency radar & operational milestones',
    category: 'Knowledge & Career',
    xpReward: 50,
  },
  {
    id: 'portfolio',
    num: '14',
    title: 'Project & Portfolio Studio',
    shortTitle: 'Portfolio Studio',
    subtitle: 'Auto-generated Security Assessment Reports & Markdown export',
    category: 'Knowledge & Career',
    xpReward: 100,
  },
];
