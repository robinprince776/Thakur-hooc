export type JarvisPersonality =
  | 'ironman'
  | 'bca_guru'
  | 'cyber_expert'
  | 'code_architect'
  | 'bollywood'
  | 'sarcastic';

export type JarvisCringeLevel = 'mild' | 'balanced' | 'overdose';

export interface JarvisChatMessage {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
  cringeLevel?: JarvisCringeLevel;
  persona?: JarvisPersonality;
}

export interface JarvisQuickPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
}

export interface PromptChip {
  label: string;
  prompt: string;
  mode: string;
  iconName: string;
}
