import { create } from 'zustand';

export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  icon: string;
  unlockedAt: string | null;
  category: 'academic' | 'cyber' | 'coding' | 'streak' | 'mastery';
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  routeTarget?: string;
}

export interface SkillNodeData {
  id: string;
  title: string;
  category: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  hub: 'academic' | 'programming' | 'cyber' | 'general';
  description: string;
  prerequisites: string[];
  xpReward: number;
  status: 'locked' | 'unlocked' | 'completed';
  completedAt?: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  hubTitle: string;
  timestamp: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpentSeconds: number;
  weakTopics: string[];
}

export interface EarnedCertificate {
  id: string;
  certNumber: string;
  userName: string;
  courseTitle: string;
  hubId: string;
  issueDate: string;
  score: number;
  achievementLevel: string;
  qrHash: string;
  recipientName?: string;
  title?: string;
  verificationCode?: string;
  grade?: string;
}

export type CertificateRecord = EarnedCertificate;

export interface GamificationState {
  // XP & Levels
  xp: number;
  level: number;
  levelTitle: string;
  xpHistory: Array<{ id: string; amount: number; source: string; timestamp: number }>;
  completedActivities: Record<string, boolean>; // Anti-duplicate prevention

  // Profile
  userName: string;
  userAvatar: string;
  userTitle: string;
  bio: string;
  showcasedBadgeIds: string[];
  userProfile: {
    userName: string;
    avatar: string;
    userAvatar: string;
    callsign: string;
    userTitle: string;
    bio: string;
    level: number;
    xp: number;
  };

  // Badges & Achievements
  badges: Badge[];

  // Daily Missions & Streak
  streak: number;
  lastActiveDate: string;
  dailyMissions: DailyMission[];

  // Skill Tree
  skillNodesProgress: Record<string, 'locked' | 'unlocked' | 'completed'>;

  // Exams & Certificates
  examHistory: ExamAttempt[];
  certificates: EarnedCertificate[];

  // Actions
  addXp: (amount: number, source: string, activityId?: string) => { added: boolean; newLevel?: number };
  unlockBadge: (badgeId: string) => boolean;
  completeDailyMissionTask: (missionId: string, increment?: number) => void;
  completeDailyMission: (missionId: string, increment?: number) => void;
  claimMissionReward: (missionId: string) => void;
  updateUserProfile: (profile: Partial<{ userName: string; userAvatar: string; userTitle: string; bio: string; showcasedBadgeIds: string[] }>) => void;
  completeSkillNode: (nodeId: string, xpReward: number) => void;
  recordExamResult: (attempt: Omit<ExamAttempt, 'id' | 'timestamp'>) => { certificate?: EarnedCertificate };
  resetDailyMissionsIfNewDay: () => void;
}

export const LEVEL_TIERS = [
  { level: 1, title: 'Beginner Scholar', minXp: 0, maxXp: 499 },
  { level: 2, title: 'Explorer', minXp: 500, maxXp: 1199 },
  { level: 3, title: 'Apprentice Hacker', minXp: 1200, maxXp: 2199 },
  { level: 4, title: 'Practitioner', minXp: 2200, maxXp: 3499 },
  { level: 5, title: 'Code Specialist', minXp: 3500, maxXp: 5199 },
  { level: 6, title: 'Advanced Architect', minXp: 5200, maxXp: 7299 },
  { level: 7, title: 'Cyber Defender', minXp: 7300, maxXp: 9999 },
  { level: 8, title: 'Elite Engineer', minXp: 10000, maxXp: 13999 },
  { level: 9, title: 'Grand Master', minXp: 14000, maxXp: 18999 },
  { level: 10, title: 'Cyber Ninja (Legendary)', minXp: 19000, maxXp: 999999 }
];

export function calculateLevelFromXp(xp: number): { level: number; title: string; minXp: number; maxXp: number; progressPercent: number } {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    const tier = LEVEL_TIERS[i];
    if (xp >= tier.minXp) {
      const span = tier.maxXp - tier.minXp;
      const currentInSpan = xp - tier.minXp;
      const progressPercent = Math.min(100, Math.max(0, Math.round((currentInSpan / span) * 100)));
      return {
        level: tier.level,
        title: tier.title,
        minXp: tier.minXp,
        maxXp: tier.maxXp,
        progressPercent
      };
    }
  }
  return { level: 1, title: LEVEL_TIERS[0].title, minXp: 0, maxXp: 499, progressPercent: 0 };
}

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Began the learning journey by opening your first module.',
    rarity: 'Common',
    icon: '🚀',
    unlockedAt: '2026-11-01',
    category: 'academic'
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Explored 5 distinct learning labs across the ecosystem.',
    rarity: 'Common',
    icon: '📖',
    unlockedAt: '2026-11-02',
    category: 'academic'
  },
  {
    id: 'code_warrior',
    name: 'Code Warrior',
    description: 'Successfully compiled and executed verified C and DSA programs.',
    rarity: 'Rare',
    icon: '⚔️',
    unlockedAt: '2026-11-03',
    category: 'coding'
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Achieved 85%+ score on any timed examination challenge.',
    rarity: 'Rare',
    icon: '🎯',
    unlockedAt: null,
    category: 'academic'
  },
  {
    id: 'cyber_explorer',
    name: 'Cyber Explorer',
    description: 'Investigated SS7 signaling flaws or inspected Android forensic logs.',
    rarity: 'Rare',
    icon: '🛡️',
    unlockedAt: '2026-11-04',
    category: 'cyber'
  },
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    description: 'Solved Boolean algebra K-Maps and number conversion puzzles.',
    rarity: 'Common',
    icon: '🧩',
    unlockedAt: null,
    category: 'academic'
  },
  {
    id: 'seven_day_streak',
    name: 'Seven-Day Streak',
    description: 'Maintained a persistent 7-day learning and training discipline.',
    rarity: 'Epic',
    icon: '🔥',
    unlockedAt: '2026-11-04',
    category: 'streak'
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Scored 100% on a comprehensive 20-question Final Boss Examination.',
    rarity: 'Epic',
    icon: '⭐',
    unlockedAt: null,
    category: 'academic'
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeated a Final Boss Examination and unlocked an official certificate.',
    rarity: 'Epic',
    icon: '👑',
    unlockedAt: null,
    category: 'mastery'
  },
  {
    id: 'grand_master',
    name: 'Grand Master',
    description: 'Attained Level 9+ with complete mastery of 20+ skill nodes.',
    rarity: 'Legendary',
    icon: '⚡',
    unlockedAt: null,
    category: 'mastery'
  }
];

export const DEFAULT_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'mission_1',
    title: 'Solve Logic/Code Puzzle',
    description: 'Run 1 C program or solve 1 Boolean logic problem',
    category: 'Coding',
    targetCount: 1,
    currentCount: 0,
    xpReward: 120,
    completed: false,
    claimed: false,
    routeTarget: 'compiler'
  },
  {
    id: 'mission_2',
    title: 'Cyber Security Triage',
    description: 'Inspect 1 forensic artifact or simulate ransomware containment',
    category: 'Security',
    targetCount: 1,
    currentCount: 0,
    xpReward: 150,
    completed: false,
    claimed: false,
    routeTarget: 'mobilesec'
  },
  {
    id: 'mission_3',
    title: 'Daily Active Recall Quiz',
    description: 'Complete 1 quick study session in My Quiz or Exam Simulator',
    category: 'Academic',
    targetCount: 1,
    currentCount: 0,
    xpReward: 100,
    completed: false,
    claimed: false,
    routeTarget: 'exam'
  }
];

const STORAGE_KEY = 'bca_gamification_v2';

function loadPersistedGamification() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Gamification store load error:', e);
  }
  return null;
}

export const useGamificationStore = create<GamificationState>((set, get) => {
  const persisted = loadPersistedGamification();
  const initXp = persisted?.xp ?? 2450;
  const initialTier = calculateLevelFromXp(initXp);

  return {
    xp: initXp,
    level: initialTier.level,
    levelTitle: initialTier.title,
    xpHistory: persisted?.xpHistory ?? [
      { id: 'xp-1', amount: 500, source: 'Initial Welcome Quest', timestamp: Date.now() - 86400000 * 3 },
      { id: 'xp-2', amount: 800, source: 'C Programming Lab Exploration', timestamp: Date.now() - 86400000 * 2 },
      { id: 'xp-3', amount: 650, source: 'Mobile Security Lab Artifacts', timestamp: Date.now() - 86400000 },
      { id: 'xp-4', amount: 500, source: 'Logic Gate & K-Map Solver', timestamp: Date.now() }
    ],
    completedActivities: persisted?.completedActivities ?? {},

    userName: persisted?.userName ?? 'Priyanshu (Pro Scholar)',
    userAvatar: persisted?.userAvatar ?? '⚡',
    userTitle: persisted?.userTitle ?? 'BCA Verse Cyber Scholar',
    bio: persisted?.bio ?? 'Computer Science scholar mastering OS, Algorithms, and Cyber Defense Systems.',
    showcasedBadgeIds: persisted?.showcasedBadgeIds ?? ['first_step', 'seven_day_streak', 'code_warrior'],

    get userProfile() {
      const state = get();
      return {
        userName: state.userName,
        avatar: state.userAvatar,
        userAvatar: state.userAvatar,
        callsign: state.userName,
        userTitle: state.userTitle,
        bio: state.bio,
        level: state.level,
        xp: state.xp
      };
    },

    badges: persisted?.badges ?? INITIAL_BADGES,

    streak: persisted?.streak ?? 7,
    lastActiveDate: persisted?.lastActiveDate ?? new Date().toISOString().slice(0, 10),
    dailyMissions: persisted?.dailyMissions ?? DEFAULT_DAILY_MISSIONS,

    skillNodesProgress: persisted?.skillNodesProgress ?? {
      c_basics: 'completed',
      c_pointers: 'completed',
      dsa_arrays: 'completed',
      dsa_trees: 'unlocked',
      net_osi: 'completed',
      cyber_recon: 'completed',
      cyber_forensics: 'unlocked'
    },

    examHistory: persisted?.examHistory ?? [
      {
        id: 'exam-sample-1',
        examId: 'c_core',
        hubTitle: 'C Programming & Logic Mastery',
        timestamp: Date.now() - 86400000 * 2,
        score: 17,
        totalQuestions: 20,
        passed: true,
        timeSpentSeconds: 540,
        weakTopics: ['Bitwise Operators', 'Dynamic Memory Reallocation']
      }
    ],

    certificates: persisted?.certificates ?? [
      {
        id: 'cert-sample-1',
        certNumber: 'BCAV-2026-C8912',
        userName: 'Priyanshu (Pro Scholar)',
        courseTitle: 'C Programming & Logic Mastery',
        hubId: 'compiler',
        issueDate: '02 Nov 2026',
        score: 85,
        achievementLevel: 'Distinction',
        qrHash: 'e7f12a9c381d4b6890'
      }
    ],

    addXp: (amount, source, activityId) => {
      const state = get();
      // Anti-duplicate protection: if activityId provided and already done, block duplicate XP
      if (activityId && state.completedActivities[activityId]) {
        return { added: false };
      }

      const newXp = state.xp + amount;
      const currentTier = calculateLevelFromXp(state.xp);
      const newTier = calculateLevelFromXp(newXp);
      const leveledUp = newTier.level > currentTier.level;

      const newHistoryItem = {
        id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        amount,
        source,
        timestamp: Date.now()
      };

      const updatedCompleted = activityId
        ? { ...state.completedActivities, [activityId]: true }
        : state.completedActivities;

      const updatedHistory = [newHistoryItem, ...state.xpHistory].slice(0, 50);

      set({
        xp: newXp,
        level: newTier.level,
        levelTitle: newTier.title,
        xpHistory: updatedHistory,
        completedActivities: updatedCompleted
      });

      // Save to localStorage
      try {
        const snap = { ...get(), xp: newXp, level: newTier.level, levelTitle: newTier.title };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
      } catch (e) {}

      return { added: true, newLevel: leveledUp ? newTier.level : undefined };
    },

    unlockBadge: (badgeId) => {
      const state = get();
      const target = state.badges.find((b) => b.id === badgeId);
      if (!target || target.unlockedAt) return false;

      const today = new Date().toISOString().slice(0, 10);
      const updated = state.badges.map((b) => (b.id === badgeId ? { ...b, unlockedAt: today } : b));

      set({ badges: updated });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), badges: updated }));
      } catch (e) {}

      // Award bonus XP for badge unlock
      get().addXp(300, `Unlocked Badge: ${target.name}`, `badge_${badgeId}`);
      return true;
    },

    completeDailyMissionTask: (missionId, increment = 1) => {
      const state = get();
      const updated = state.dailyMissions.map((m) => {
        if (m.id === missionId) {
          const nextCount = Math.min(m.targetCount, m.currentCount + increment);
          return {
            ...m,
            currentCount: nextCount,
            completed: nextCount >= m.targetCount
          };
        }
        return m;
      });

      set({ dailyMissions: updated });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), dailyMissions: updated }));
      } catch (e) {}
    },

    completeDailyMission: (missionId, increment = 1) => {
      get().completeDailyMissionTask(missionId, increment);
    },

    claimMissionReward: (missionId) => {
      const state = get();
      const target = state.dailyMissions.find((m) => m.id === missionId);
      if (!target || !target.completed || target.claimed) return;

      const updated = state.dailyMissions.map((m) => (m.id === missionId ? { ...m, claimed: true } : m));
      set({ dailyMissions: updated });

      get().addXp(target.xpReward, `Completed Daily Mission: ${target.title}`, `mission_claim_${missionId}`);
    },

    updateUserProfile: (profile) => {
      set((state) => {
        const updated = {
          ...state,
          userName: profile.userName ?? state.userName,
          userAvatar: profile.userAvatar ?? state.userAvatar,
          userTitle: profile.userTitle ?? state.userTitle,
          bio: profile.bio ?? state.bio,
          showcasedBadgeIds: profile.showcasedBadgeIds ?? state.showcasedBadgeIds
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    },

    completeSkillNode: (nodeId, xpReward) => {
      const state = get();
      if (state.skillNodesProgress[nodeId] === 'completed') return;

      const updatedProgress = {
        ...state.skillNodesProgress,
        [nodeId]: 'completed' as const
      };

      set({ skillNodesProgress: updatedProgress });
      get().addXp(xpReward, `Mastered Skill Node: ${nodeId}`, `skill_${nodeId}`);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), skillNodesProgress: updatedProgress }));
      } catch (e) {}
    },

    recordExamResult: (attempt) => {
      const state = get();
      const newId = `exam-${Date.now()}`;
      const fullAttempt: ExamAttempt = {
        ...attempt,
        id: newId,
        timestamp: Date.now()
      };

      let cert: EarnedCertificate | undefined;
      let updatedCerts = [...state.certificates];

      // If passed (>70%), generate verified certificate and award XP
      if (attempt.passed) {
        const certNumber = `BCAV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const achievementLevel = attempt.score >= 18 ? 'Grand Distinction' : attempt.score >= 16 ? 'Distinction' : 'Merit';

        cert = {
          id: `cert-${Date.now()}`,
          certNumber,
          userName: state.userName,
          courseTitle: attempt.hubTitle,
          hubId: attempt.examId,
          issueDate,
          score: Math.round((attempt.score / attempt.totalQuestions) * 100),
          achievementLevel,
          qrHash: Math.random().toString(36).substring(2, 15)
        };
        updatedCerts = [cert, ...updatedCerts];

        // Award XP & unlock boss badge
        get().addXp(600, `Passed Boss Exam: ${attempt.hubTitle}`, `exam_pass_${newId}`);
        get().unlockBadge('boss_slayer');
        if (attempt.score === attempt.totalQuestions) {
          get().unlockBadge('perfect_score');
        }
      }

      const updatedHistory = [fullAttempt, ...state.examHistory];

      set({
        examHistory: updatedHistory,
        certificates: updatedCerts
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), examHistory: updatedHistory, certificates: updatedCerts }));
      } catch (e) {}

      return { certificate: cert };
    },

    resetDailyMissionsIfNewDay: () => {
      const state = get();
      const today = new Date().toISOString().slice(0, 10);
      if (state.lastActiveDate !== today) {
        // Reset daily missions for the new day
        const freshMissions = DEFAULT_DAILY_MISSIONS.map((m) => ({ ...m, currentCount: 0, completed: false, claimed: false }));
        set({
          lastActiveDate: today,
          dailyMissions: freshMissions
        });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...get(), lastActiveDate: today, dailyMissions: freshMissions }));
        } catch (e) {}
      }
    }
  };
});
