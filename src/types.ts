export type NumberSystemType =
  | 'dec-to-bin'
  | 'dec-to-oct'
  | 'dec-to-hex'
  | 'bin-to-dec'
  | 'bin-to-oct'
  | 'bin-to-hex'
  | 'oct-to-dec'
  | 'oct-to-bin'
  | 'hex-to-dec'
  | 'hex-to-bin'
  | 'dec-to-all'
  | 'bin-add'
  | 'bin-sub'
  | 'bin-mul'
  | 'bin-div'
  | 'oct-add'
  | 'oct-sub'
  | 'oct-mul'
  | 'oct-div'
  | 'hex-add'
  | 'hex-sub'
  | 'hex-mul'
  | 'hex-div'
  | 'oct-arithmetic'
  | 'hex-arithmetic'
  | 'base-arithmetic'
  | 'complements'
  | 'logic-gates'
  | 'kmap';

export interface StepItem {
  stepNumber: number;
  title: string;
  explanation: string; // Hinglish explanation
  mathDetail?: string;
  subSteps?: string[];
  highlight?: boolean;
}

export interface NumberSolverResult {
  title: string;
  input: string;
  type: NumberSystemType;
  finalAnswer: string;
  steps: StepItem[];
  additionalInfo?: {
    binary?: string;
    octal?: string;
    hex?: string;
    decimal?: string;
    tableHeaders?: string[];
    tableRows?: (string | number)[][];
    notes?: string;
  };
}

export type ProgramCategory =
  | 'Basic'
  | 'Math & Numbers'
  | 'Loops & Patterns'
  | 'Arrays'
  | 'Strings'
  | 'Sorting & Searching'
  | 'Pointers & Structures'
  | 'Recursion & Files';

export type ProgramDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface CProgram {
  id: string;
  title: string;
  category: ProgramCategory;
  difficulty: ProgramDifficulty;
  tags: string[];
  description: string;
  code: string;
  hinglishExplanation: string;
  keyLogicPoints: string[];
  sampleInput: string;
  sampleOutput: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface BookmarkItem {
  id: string;
  type: 'logic' | 'c-program';
  title: string;
  subtitle: string;
  data: any;
  timestamp: number;
}

export interface RecentSearchItem {
  id: string;
  query: string;
  type: 'logic' | 'c-program';
  targetId?: string;
  timestamp: number;
}

// --- CalcVault Types ---
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  audioData?: string;
  audioDuration?: number;
  imageData?: string;
  timestamp: number;
  vanishesAfter?: number;
  roomId?: string;
}

export type NatureWallpaper = 'misty-lake' | 'emerald-rain' | 'deep-forest' | 'alpine-dawn';

export interface UserSettings {
  secretPin: string;
  displayName: string;
  roomId?: string;
  wallpaper: NatureWallpaper;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  vanishDuration?: number;
}

export interface PeerPresence {
  peerId: string;
  peerName: string;
  inChat: boolean;
  isOnline: boolean;
  lastSeen: number;
}

export type CalcVaultView = 'calculator' | 'chat';

