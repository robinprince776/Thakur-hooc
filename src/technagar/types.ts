export type CharacterType = 'Aarav' | 'Byte';

export interface DialogueItem {
  id: string;
  char: CharacterType;
  text: string;
  mood?: 'curious' | 'shocked' | 'happy' | 'explaining' | 'heroic';
  subNote?: string;
}

export interface Chapter {
  id: number;
  seasonId: number;
  seasonTitle: string;
  chapterNumber: number;
  title: string;
  tagline: string;
  icon: string;
  dialogues: DialogueItem[];
  lesson: string;
  realWorldAnalogy?: string;
  conceptTags: string[];
}

export interface SeasonInfo {
  id: number;
  title: string;
  tagline: string;
  chapterCount: number;
  color: string;
  icon: string;
}
