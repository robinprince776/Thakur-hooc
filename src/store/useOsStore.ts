import { create } from 'zustand';
import { CurrentAppType } from '../components/AppSwitcherModal';

export interface QuickNote {
  id: string;
  text: string;
  date: string;
  color: string;
}

export interface LastAppVisit {
  id: CurrentAppType;
  title: string;
  category: string;
  progress: number;
  timestamp: number;
}

export interface BreadcrumbItem {
  label: string;
  appTarget?: CurrentAppType;
  hashTarget?: string;
}

interface OsState {
  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Stealth Panic Mode
  stealthActive: boolean;
  setStealthActive: (active: boolean) => void;
  toggleStealth: () => void;

  // Navigation & Active App
  currentApp: CurrentAppType;
  setCurrentApp: (app: CurrentAppType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  navigatorOpen: boolean;
  setNavigatorOpen: (open: boolean) => void;

  // Breadcrumbs
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (crumbs: BreadcrumbItem[]) => void;

  // OS Widgets State
  dailyStreak: number;
  lastVisitDate: string;
  lastOpenedApp: LastAppVisit;
  quickNotes: QuickNote[];
  addQuickNote: (text: string, color?: string) => void;
  deleteQuickNote: (id: string) => void;
  recordAppVisit: (app: CurrentAppType, title: string, category: string, progress?: number) => void;

  // User Profile
  userName: string;
  userAvatar: string;
}

const DEFAULT_NOTES: QuickNote[] = [
  {
    id: 'note-1',
    text: 'Revise OSI 7 layers and TCP/IP 4-way handshake for viva.',
    date: 'Today',
    color: 'amber'
  },
  {
    id: 'note-2',
    text: 'Test Docker container compose & PostgreSQL indexing benchmarks.',
    date: 'Yesterday',
    color: 'cyan'
  }
];

function getInitialTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem('bca_buddy_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {}
  return 'dark';
}

function getInitialNotes(): QuickNote[] {
  try {
    const saved = localStorage.getItem('os_quick_notes');
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_NOTES;
}

function getInitialStreak(): { streak: number; date: string } {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem('os_streak_date');
    const savedCount = parseInt(localStorage.getItem('os_streak_count') || '7', 10);

    if (savedDate === today) {
      return { streak: savedCount, date: today };
    }
    // New day login increments or resets
    localStorage.setItem('os_streak_date', today);
    localStorage.setItem('os_streak_count', String(savedCount + 1));
    return { streak: savedCount + 1, date: today };
  } catch {
    return { streak: 7, date: new Date().toISOString().slice(0, 10) };
  }
}

export const useOsStore = create<OsState>((set, get) => {
  const initTheme = getInitialTheme();
  const initStreak = getInitialStreak();

  return {
    theme: initTheme,
    setTheme: (theme) => {
      try {
        localStorage.setItem('bca_buddy_theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('theme-light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('theme-light');
        }
      } catch {}
      set({ theme });
    },
    toggleTheme: () => {
      const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
      get().setTheme(nextTheme);
    },

    stealthActive: false,
    setStealthActive: (stealthActive) => set({ stealthActive }),
    toggleStealth: () => set((state) => ({ stealthActive: !state.stealthActive })),

    currentApp: 'bca',
    setCurrentApp: (currentApp) => {
      set({ currentApp });
    },

    sidebarOpen: false,
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    navigatorOpen: false,
    setNavigatorOpen: (navigatorOpen) => set({ navigatorOpen }),

    breadcrumbs: [{ label: 'OS Hub' }],
    setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

    dailyStreak: initStreak.streak,
    lastVisitDate: initStreak.date,

    lastOpenedApp: {
      id: 'exam',
      title: 'BCA Exam Simulator & Mock Test',
      category: 'Academic Hub',
      progress: 68,
      timestamp: Date.now()
    },

    quickNotes: getInitialNotes(),

    addQuickNote: (text, color = 'cyan') => {
      const newNote: QuickNote = {
        id: `note-${Date.now()}`,
        text: text.trim(),
        date: 'Just now',
        color
      };
      set((state) => {
        const updated = [newNote, ...state.quickNotes];
        try {
          localStorage.setItem('os_quick_notes', JSON.stringify(updated));
        } catch {}
        return { quickNotes: updated };
      });
    },

    deleteQuickNote: (id) => {
      set((state) => {
        const updated = state.quickNotes.filter((n) => n.id !== id);
        try {
          localStorage.setItem('os_quick_notes', JSON.stringify(updated));
        } catch {}
        return { quickNotes: updated };
      });
    },

    recordAppVisit: (app, title, category, progress = 50) => {
      const visit: LastAppVisit = {
        id: app,
        title,
        category,
        progress,
        timestamp: Date.now()
      };
      set({ lastOpenedApp: visit });
    },

    userName: 'Priyanshu (Pro Scholar)',
    userAvatar: '⚡'
  };
});
