export type TechCategory =
  | 'hacking'
  | 'cybersecurity'
  | 'cyber_cell'
  | 'supercomputer'
  | 'career_scope'
  | 'networking'
  | 'os_internals'
  | 'programming_dsa'
  | 'cloud_devops'
  | 'ai_futuretech'
  | 'hardware_arch'
  | 'interview_prep';

export type TechLevel = 'zero' | 'intermediate' | 'advanced' | 'hero';

export interface TechQuestion {
  id: string;
  category: TechCategory;
  title: string;
  shortAnswer: string;
  deepAnswer: string;
  keyTakeaway: string;
  level: TechLevel;
  tags: string[];
  practicalLab?: string;
  lawSection?: string;
  realWorldExample?: string;
}

export interface TechCategoryMeta {
  id: TechCategory;
  title: string;
  shortTitle: string;
  tagline: string;
  iconName: string;
  color: string;
  bgGlow: string;
  borderGlow: string;
  totalQuestionsCount: number;
}
