import { create } from 'zustand';
import {
  ArenaProblem,
  DIFFICULTY_XP,
  HINT_PENALTIES,
  SOLUTION_PENALTY,
  SolvedProblemRecord,
} from '../arena/arenaTypes';

interface ArenaPersistedState {
  customProblems: ArenaProblem[];
  solvedMap: Record<string, SolvedProblemRecord>;
  revealedHintsMap: Record<string, number[]>;
  revealedSolutionMap: Record<string, boolean>;
  draftCodeMap: Record<string, string>;
  totalAttempts: number;
  successfulAttempts: number;
  xp: number;
  streak: number;
  lastSolveDate: string;
  unlockedBadges: string[];
}

interface ArenaStore extends ArenaPersistedState {
  addCustomProblem: (problem: ArenaProblem) => void;
  revealHint: (problemId: string, hintIndex: number) => void;
  revealSolution: (problemId: string) => void;
  saveDraftCode: (problemId: string, code: string) => void;
  recordAttempt: (passed: boolean) => void;
  markSolved: (problem: ArenaProblem, userCode: string) => { earnedXp: number; solvedWithHelp: boolean; badgeEarned?: string };
  resetProgress: () => void;
}

const STORAGE_KEY = 'bca_verse_arena_state_v1';

const DEFAULT_PERSISTED: ArenaPersistedState = {
  customProblems: [],
  solvedMap: {},
  revealedHintsMap: {},
  revealedSolutionMap: {},
  draftCodeMap: {},
  totalAttempts: 0,
  successfulAttempts: 0,
  xp: 0,
  streak: 0,
  lastSolveDate: '',
  unlockedBadges: [],
};

function loadState(): ArenaPersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PERSISTED,
      ...parsed,
      customProblems: Array.isArray(parsed.customProblems) ? parsed.customProblems : [],
      solvedMap: parsed.solvedMap && typeof parsed.solvedMap === 'object' ? parsed.solvedMap : {},
      revealedHintsMap:
        parsed.revealedHintsMap && typeof parsed.revealedHintsMap === 'object' ? parsed.revealedHintsMap : {},
      revealedSolutionMap:
        parsed.revealedSolutionMap && typeof parsed.revealedSolutionMap === 'object'
          ? parsed.revealedSolutionMap
          : {},
      draftCodeMap: parsed.draftCodeMap && typeof parsed.draftCodeMap === 'object' ? parsed.draftCodeMap : {},
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
    };
  } catch {
    return DEFAULT_PERSISTED;
  }
}

function persistState(state: ArenaPersistedState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        customProblems: state.customProblems,
        solvedMap: state.solvedMap,
        revealedHintsMap: state.revealedHintsMap,
        revealedSolutionMap: state.revealedSolutionMap,
        draftCodeMap: state.draftCodeMap,
        totalAttempts: state.totalAttempts,
        successfulAttempts: state.successfulAttempts,
        xp: state.xp,
        streak: state.streak,
        lastSolveDate: state.lastSolveDate,
        unlockedBadges: state.unlockedBadges,
      })
    );
  } catch {}
}

function computeNextStreak(lastDate: string, currentStreak: number): { streak: number; today: string } {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (!lastDate) return { streak: 1, today };
  if (lastDate === today) return { streak: Math.max(1, currentStreak), today };
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
  if (lastDate === yesterday) return { streak: currentStreak + 1, today };
  return { streak: 1, today };
}

export const useArenaStore = create<ArenaStore>((set, get) => {
  const initial = loadState();

  return {
    ...initial,

    addCustomProblem: (problem) => {
      set((state) => {
        const next: ArenaPersistedState = {
          ...state,
          customProblems: [problem, ...state.customProblems.filter((p) => p.id !== problem.id)],
        };
        persistState(next);
        return next;
      });
    },

    revealHint: (problemId, hintIndex) => {
      set((state) => {
        const existing = state.revealedHintsMap[problemId] || [];
        if (existing.includes(hintIndex)) return state;
        const penalty = HINT_PENALTIES[hintIndex] ?? 5;
        const nextHints = [...existing, hintIndex].sort((a, b) => a - b);
        const next: ArenaPersistedState = {
          ...state,
          revealedHintsMap: { ...state.revealedHintsMap, [problemId]: nextHints },
          xp: Math.max(0, state.xp - penalty),
        };
        persistState(next);
        return next;
      });
    },

    revealSolution: (problemId) => {
      set((state) => {
        if (state.revealedSolutionMap[problemId]) return state;
        const next: ArenaPersistedState = {
          ...state,
          revealedSolutionMap: { ...state.revealedSolutionMap, [problemId]: true },
          xp: Math.max(0, state.xp - SOLUTION_PENALTY),
        };
        persistState(next);
        return next;
      });
    },

    saveDraftCode: (problemId, code) => {
      set((state) => {
        const next: ArenaPersistedState = {
          ...state,
          draftCodeMap: { ...state.draftCodeMap, [problemId]: code },
        };
        persistState(next);
        return next;
      });
    },

    recordAttempt: (passed) => {
      set((state) => {
        const next: ArenaPersistedState = {
          ...state,
          totalAttempts: state.totalAttempts + 1,
          successfulAttempts: state.successfulAttempts + (passed ? 1 : 0),
        };
        persistState(next);
        return next;
      });
    },

    markSolved: (problem, userCode) => {
      const state = get();
      const alreadySolved = Boolean(state.solvedMap[problem.id]);
      const hintsUsed = state.revealedHintsMap[problem.id] || [];
      const viewedSolution = Boolean(state.revealedSolutionMap[problem.id]);
      const solvedWithHelp = viewedSolution || hintsUsed.length >= 2;
      const baseXp = problem.bountyXp || DIFFICULTY_XP[problem.difficulty] || 30;
      const earnedXp = alreadySolved ? 0 : viewedSolution ? Math.max(5, Math.floor(baseXp * 0.4)) : baseXp;

      const { streak, today } = computeNextStreak(state.lastSolveDate, state.streak);
      let badgeEarned: string | undefined;
      const nextBadges = [...state.unlockedBadges];
      if (!alreadySolved && problem.rareBadge && !viewedSolution && !nextBadges.includes(problem.rareBadge)) {
        nextBadges.push(problem.rareBadge);
        badgeEarned = problem.rareBadge;
      }

      const record: SolvedProblemRecord = {
        problemId: problem.id,
        solvedAt: Date.now(),
        earnedXp: alreadySolved ? state.solvedMap[problem.id].earnedXp : earnedXp,
        solvedWithHelp: alreadySolved ? state.solvedMap[problem.id].solvedWithHelp : solvedWithHelp,
        hintsUsed,
        savedCode: userCode,
        rareBadge: badgeEarned || state.solvedMap[problem.id]?.rareBadge,
      };

      const next: ArenaPersistedState = {
        ...state,
        solvedMap: { ...state.solvedMap, [problem.id]: record },
        draftCodeMap: { ...state.draftCodeMap, [problem.id]: userCode },
        totalAttempts: state.totalAttempts + 1,
        successfulAttempts: state.successfulAttempts + 1,
        xp: state.xp + earnedXp,
        streak,
        lastSolveDate: today,
        unlockedBadges: nextBadges,
      };

      persistState(next);
      set(next);
      return { earnedXp, solvedWithHelp, badgeEarned };
    },

    resetProgress: () => {
      persistState(DEFAULT_PERSISTED);
      set(DEFAULT_PERSISTED);
    },
  };
});
