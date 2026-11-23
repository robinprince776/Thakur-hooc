import { create } from 'zustand';
import langDict from '../data/lang.json';

export type AppLanguage = 'en' | 'hi';
export type TranslationKey = keyof typeof langDict.en;

interface LanguageState {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
}

const STORAGE_KEY = 'bcaverse_language';

function getInitialLanguage(): AppLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'hi') return saved;
  } catch {}
  return 'en';
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getInitialLanguage(),
  setLanguage: (language) => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language === 'hi' ? 'hi-Latn' : 'en';
    } catch {}
    set({ language });
  },
  toggleLanguage: () => {
    const next: AppLanguage = get().language === 'en' ? 'hi' : 'en';
    get().setLanguage(next);
  },
}));

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const toggleLanguage = useLanguageStore((s) => s.toggleLanguage);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const t = (key: TranslationKey): string => {
    const dict = langDict[language] || langDict.en;
    return dict[key] || langDict.en[key] || key;
  };

  return { t, language, toggleLanguage, setLanguage };
}
