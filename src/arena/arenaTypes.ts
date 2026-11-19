export type ArenaCategory =
  | 'Web Dev'
  | 'Cybersecurity'
  | 'System Design'
  | 'DSA'
  | 'Database'
  | 'AI & LLM Security'
  | 'Cloud & DevOps'
  | 'Mobile Dev'
  | 'OS Internals'
  | 'Networking'
  | 'Reverse Engineering'
  | 'Hardware/IoT'
  | 'Logic Puzzles'
  | 'Automation'
  | 'Interview Prep'
  | 'Awareness';

export const ARENA_CATEGORIES: ArenaCategory[] = [
  'Web Dev',
  'Cybersecurity',
  'Awareness',
  'System Design',
  'DSA',
  'Database',
  'AI & LLM Security',
  'Cloud & DevOps',
  'Mobile Dev',
  'OS Internals',
  'Networking',
  'Reverse Engineering',
  'Hardware/IoT',
  'Logic Puzzles',
  'Automation',
  'Interview Prep',
];

export type ArenaLayer = 'DEFENSIVE' | 'AWARENESS';

export const ARENA_LAYERS: ArenaLayer[] = ['DEFENSIVE', 'AWARENESS'];

export type ArenaDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export const ARENA_DIFFICULTIES: ArenaDifficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];

export type ArenaIssueType = 'Bug' | 'Enhancement' | 'Security' | 'Optimization';

export const ARENA_ISSUE_TYPES: ArenaIssueType[] = ['Bug', 'Security', 'Optimization', 'Enhancement'];

export const DIFFICULTY_XP: Record<ArenaDifficulty, number> = {
  Easy: 10,
  Medium: 30,
  Hard: 50,
  Expert: 80,
};

export const HINT_PENALTIES = [5, 10, 15] as const;
export const SOLUTION_PENALTY = 20;

export interface ArenaProblem {
  id: string;
  title: string;
  category: ArenaCategory;
  difficulty: ArenaDifficulty;
  layer?: ArenaLayer;
  issueType: ArenaIssueType;
  bountyXp: number;
  rareBadge?: string;
  context: string;
  problemStatement: string;
  codeSnippet?: string;
  language?: string;
  starterCode?: string;
  redFlags?: string[];
  defensiveFix?: string;
  safePractice?: string;
  hints: [string, string, string] | string[];
  solution: string;
  isRunnableJs?: boolean;
  keywords: string[];
  isAiGenerated?: boolean;
}

export interface SolvedProblemRecord {
  problemId: string;
  solvedAt: number;
  earnedXp: number;
  solvedWithHelp: boolean;
  hintsUsed: number[];
  savedCode: string;
  rareBadge?: string;
}

export interface ArenaAiReview {
  verdict: 'pass' | 'partial' | 'needs_work';
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}
