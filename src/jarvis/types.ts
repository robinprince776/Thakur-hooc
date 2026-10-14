export type JarvisPersonality = 'ironman' | 'bca_guru' | 'bollywood' | 'sarcastic';

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
  category: 'Tech' | 'College Life' | 'Roast' | 'Cringe Flirt' | 'Science';
}

export interface PromptChip {
  label: string;
  prompt: string;
  mode: string;
  iconName: string;
}
