export type CyberLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface CyberTopic {
  id: string;
  title: string;
  tagline: string;
  hinglishSummary: string;
  detailedPoints: string[];
  keyTerms: { term: string; meaning: string }[];
  realWorldAttackScenario: string;
  howToDefend: string;
  commandOrCodeSnippet?: {
    lang: string;
    code: string;
    explanation: string;
  };
}

export interface CyberQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanationInHinglish: string;
  difficulty: 'Easy' | 'Medium' | 'Pro';
}

export interface CyberModule {
  level: CyberLevel;
  levelBadge: string;
  title: string;
  subtitle: string;
  iconName: string;
  hinglishIntro: string;
  estimatedTime: string;
  topics: CyberTopic[];
  quizzes: CyberQuizQuestion[];
}

export interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
  timestamp: string;
}

export interface BugBountyTip {
  id: string;
  category: string;
  title: string;
  tipHinglish: string;
  dorkOrPayload: string;
  bountyRange: string;
}
