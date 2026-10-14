export type SukhanAppTab =
  | 'home'
  | 'library'
  | 'studio'
  | 'poets'
  | 'moods'
  | 'vault'
  | 'card-designer'
  | 'resources';

export interface DifficultWord {
  word: string;
  meaning: string;
  romanMeaning?: string;
}

export interface Couplet {
  id: string;
  poetId: string;
  poetName: string;
  linesRoman: [string, string];
  originalScript?: [string, string];
  hinglishMeaning: string;
  moods: string[];
  form: 'Sher' | 'Fard' | 'Doha' | 'Kafi';
  difficultWords?: DifficultWord[];
  tags: string[];
}

export interface PoemWork {
  id: string;
  poetId: string;
  poetName: string;
  titleRoman: string;
  form: 'Ghazal' | 'Nazm' | 'Song' | 'Doha' | 'Kafi';
  language: 'Urdu' | 'Hindi' | 'Punjabi';
  radif?: string;
  qafiya?: string;
  beherName?: string;
  couplets: [string, string][];
  hinglishSummary: string;
  difficultWords: DifficultWord[];
  moods: string[];
}

export interface PoetProfile {
  id: string;
  nameRoman: string;
  takhallus?: string;
  era: string;
  eraDates: string;
  languages: ('Urdu' | 'Hindi' | 'Punjabi')[];
  birthPlace: string;
  bioHinglish: string;
  historicalContextHinglish: string;
  majorThemes: string[];
  signatureCouplet: [string, string];
  signatureMeaning: string;
  verifiedWorksCount: number;
  popularCouplets: Couplet[];
  poems: PoemWork[];
  relatedPoetIds: string[];
  sourceReferences: string[];
  portraitGradient: string;
  accentColor: string;
}

export interface MoodCategory {
  id: string;
  nameRoman: string;
  tagline: string;
  descriptionHinglish: string;
  color: string;
  bgGradient: string;
  borderGlow: string;
  relatedPoetIds: string[];
  writingPrompts: string[];
  associatedAlfaaz: { word: string; meaning: string }[];
}

export type PoetryFormat =
  | 'Shayari'
  | 'Ghazal'
  | 'Nazm'
  | 'Punjabi Song'
  | 'Hindi Song'
  | 'Hooks & Chorus'
  | 'Couplet'
  | 'Free Verse';

export interface PoetryDraft {
  id: string;
  title: string;
  content: string;
  format: PoetryFormat;
  language: 'Urdu' | 'Hindi' | 'Punjabi';
  mood: string;
  radif?: string;
  qafiya?: string;
  folder: 'Ghazlen' | 'Geet' | 'Mukhtasar Sher' | 'Azaad Nazm' | 'Favorites';
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  history: { timestamp: number; content: string }[];
}

export interface RhymeEntry {
  rhymeWord: string;
  meaning: string;
  language: 'Urdu' | 'Hindi' | 'Punjabi';
  moods: string[];
}

export interface MetaphorSuggestion {
  theme: string;
  imagery: string;
  hinglishExplanation: string;
  exampleUsage: string;
}

export interface CardDesignerTheme {
  id: 'obsidian' | 'burgundy' | 'paper' | 'gold' | 'midnight';
  name: string;
  containerBg: string;
  textColor: string;
  accentColor: string;
  subtextColor: string;
  borderColor: string;
  watermarkColor: string;
}

export interface CardDesignerConfig {
  theme: 'obsidian' | 'burgundy' | 'paper' | 'gold' | 'midnight';
  font: 'serif' | 'cinzel' | 'sans';
  alignment: 'center' | 'left' | 'right';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  showAttribution: boolean;
  attribution: string;
  showWatermark: boolean;
  watermarkText: string;
  poetryText: string;
}
