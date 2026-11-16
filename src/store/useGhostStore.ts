import { create } from 'zustand';
import { useGamificationStore } from './useGamificationStore';

export type GhostModuleId =
  | 'command'
  | 'academy'
  | 'missions'
  | 'range'
  | 'terminal'
  | 'network'
  | 'websec'
  | 'forensics'
  | 'threatintel'
  | 'soc'
  | 'aisec'
  | 'vault'
  | 'progression'
  | 'portfolio';

export type GhostThreatLevel = 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export interface GhostTerminalEntry {
  id: string;
  cmd: string;
  output: string;
  timestamp: number;
}

export interface GhostSecurityReport {
  id: string;
  title: string;
  scope: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  findings: string[];
  recommendation: string;
  createdAt: string;
  sourceModule: GhostModuleId;
}

export interface GhostTriageRecord {
  alertId: string;
  verdict: 'tp' | 'fp';
  correct: boolean;
  timestamp: number;
}

export interface GhostStoreState {
  activeModuleId: GhostModuleId;
  xp: number;
  level: number;
  rankTitle: string;
  threatLevel: GhostThreatLevel;
  completedModules: string[];
  completedMissions: string[];
  completedVmTasks: string[];
  unlockedSkills: string[];
  terminalHistory: GhostTerminalEntry[];
  triageDecisions: Record<string, GhostTriageRecord>;
  savedReports: GhostSecurityReport[];
  sandboxNonce: number;

  // Actions
  setActiveModule: (moduleId: GhostModuleId) => void;
  setThreatLevel: (level: GhostThreatLevel) => void;
  addGhostXp: (amount: number, reason: string, activityKey?: string) => void;
  completeModule: (moduleId: GhostModuleId, xpReward?: number) => void;
  completeMission: (missionId: string, report?: Omit<GhostSecurityReport, 'id' | 'createdAt'>) => void;
  completeVmTask: (taskId: string, xpReward?: number) => void;
  unlockSkill: (skillId: string, xpReward?: number) => void;
  addTerminalEntry: (cmd: string, output: string) => void;
  clearTerminal: () => void;
  recordTriage: (alertId: string, verdict: 'tp' | 'fp', correct: boolean) => void;
  addReport: (report: Omit<GhostSecurityReport, 'id' | 'createdAt'>) => void;
  deleteReport: (id: string) => void;
  resetSandbox: (moduleId?: GhostModuleId) => void;
}

const STORAGE_KEY = 'ghost_protocol_state_v1';

function computeRank(xp: number): { level: number; rankTitle: string } {
  const level = Math.floor(xp / 250) + 1;
  if (xp >= 2500) return { level, rankTitle: 'Ghost Intelligence Architect' };
  if (xp >= 1500) return { level, rankTitle: 'Principal Threat Hunter' };
  if (xp >= 900) return { level, rankTitle: 'Lead SOC Responder' };
  if (xp >= 450) return { level, rankTitle: 'Defensive Security Analyst' };
  if (xp >= 150) return { level, rankTitle: 'Junior Telemetry Operator' };
  return { level, rankTitle: 'Recruit Observer' };
}

interface PersistedSnapshot {
  xp: number;
  threatLevel: GhostThreatLevel;
  completedModules: string[];
  completedMissions: string[];
  completedVmTasks: string[];
  unlockedSkills: string[];
  triageDecisions: Record<string, GhostTriageRecord>;
  savedReports: GhostSecurityReport[];
}

const DEFAULT_REPORTS: GhostSecurityReport[] = [
  {
    id: 'rep-baseline-1',
    title: 'Initial Perimeter & Telemetry Baseline',
    scope: 'Simulated DMZ Subnet 10.24.0.0/24',
    severity: 'Medium',
    findings: [
      'Unauthenticated SSH probe bursts observed from simulated external scanner pool.',
      'Legacy HTTP header missing strict Content-Security-Policy (CSP) directive.',
    ],
    recommendation:
      'Enforce key-based SSH authentication with rate-limiting (fail2ban) and deploy strict CSP headers across edge proxies.',
    createdAt: new Date().toISOString().split('T')[0],
    sourceModule: 'command',
  },
];

function loadInitial(): PersistedSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        xp: typeof parsed.xp === 'number' ? parsed.xp : 120,
        threatLevel: parsed.threatLevel || 'ELEVATED',
        completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
        completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
        completedVmTasks: Array.isArray(parsed.completedVmTasks) ? parsed.completedVmTasks : [],
        unlockedSkills: Array.isArray(parsed.unlockedSkills) ? parsed.unlockedSkills : ['net-basics', 'linux-core'],
        triageDecisions: parsed.triageDecisions || {},
        savedReports: Array.isArray(parsed.savedReports) && parsed.savedReports.length > 0 ? parsed.savedReports : DEFAULT_REPORTS,
      };
    }
  } catch {}
  return {
    xp: 120,
    threatLevel: 'ELEVATED',
    completedModules: [],
    completedMissions: [],
    completedVmTasks: [],
    unlockedSkills: ['net-basics', 'linux-core'],
    triageDecisions: {},
    savedReports: DEFAULT_REPORTS,
  };
}

function saveSnapshot(state: GhostStoreState) {
  try {
    const snap: PersistedSnapshot = {
      xp: state.xp,
      threatLevel: state.threatLevel,
      completedModules: state.completedModules,
      completedMissions: state.completedMissions,
      completedVmTasks: state.completedVmTasks,
      unlockedSkills: state.unlockedSkills,
      triageDecisions: state.triageDecisions,
      savedReports: state.savedReports,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
  } catch {}
}

const init = loadInitial();
const initRank = computeRank(init.xp);

export const useGhostStore = create<GhostStoreState>((set, get) => ({
  activeModuleId: 'command',
  xp: init.xp,
  level: initRank.level,
  rankTitle: initRank.rankTitle,
  threatLevel: init.threatLevel,
  completedModules: init.completedModules,
  completedMissions: init.completedMissions,
  completedVmTasks: init.completedVmTasks,
  unlockedSkills: init.unlockedSkills,
  terminalHistory: [
    {
      id: 'boot-1',
      cmd: 'ghostctl --status --sandbox',
      output:
        'GHOST PROTOCOL OS initialized in 100% isolated educational defense mode.\nType "help" to list safe inspection commands.',
      timestamp: Date.now(),
    },
  ],
  triageDecisions: init.triageDecisions,
  savedReports: init.savedReports,
  sandboxNonce: 1,

  setActiveModule: (moduleId) => set({ activeModuleId: moduleId }),

  setThreatLevel: (threatLevel) => {
    set({ threatLevel });
    saveSnapshot(get());
  },

  addGhostXp: (amount, reason, activityKey) => {
    const nextXp = get().xp + amount;
    const rank = computeRank(nextXp);
    set({ xp: nextXp, level: rank.level, rankTitle: rank.rankTitle });
    saveSnapshot(get());
    try {
      useGamificationStore.getState().addXp(amount, `Ghost Protocol: ${reason}`, activityKey);
    } catch {}
  },

  completeModule: (moduleId, xpReward = 75) => {
    const state = get();
    if (state.completedModules.includes(moduleId)) return;
    const updated = [...state.completedModules, moduleId];
    const nextXp = state.xp + xpReward;
    const rank = computeRank(nextXp);
    set({
      completedModules: updated,
      xp: nextXp,
      level: rank.level,
      rankTitle: rank.rankTitle,
    });
    saveSnapshot(get());
    try {
      useGamificationStore.getState().addXp(xpReward, `Ghost Module: ${moduleId}`, `ghost-mod-${moduleId}`);
    } catch {}
  },

  completeMission: (missionId, report) => {
    const state = get();
    const alreadyDone = state.completedMissions.includes(missionId);
    const updatedMissions = alreadyDone ? state.completedMissions : [...state.completedMissions, missionId];
    const nextReports = report
      ? [
          {
            ...report,
            id: `rep-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
          },
          ...state.savedReports,
        ]
      : state.savedReports;

    const reward = alreadyDone ? 0 : 150;
    const nextXp = state.xp + reward;
    const rank = computeRank(nextXp);

    set({
      completedMissions: updatedMissions,
      savedReports: nextReports,
      xp: nextXp,
      level: rank.level,
      rankTitle: rank.rankTitle,
    });
    saveSnapshot(get());
    if (reward > 0) {
      try {
        useGamificationStore.getState().addXp(reward, `Mission Cleared: ${missionId}`, `ghost-mission-${missionId}`);
      } catch {}
    }
  },

  completeVmTask: (taskId, xpReward = 60) => {
    const state = get();
    if (state.completedVmTasks.includes(taskId)) return;
    const nextXp = state.xp + xpReward;
    const rank = computeRank(nextXp);
    set({
      completedVmTasks: [...state.completedVmTasks, taskId],
      xp: nextXp,
      level: rank.level,
      rankTitle: rank.rankTitle,
    });
    saveSnapshot(get());
  },

  unlockSkill: (skillId, xpReward = 50) => {
    const state = get();
    if (state.unlockedSkills.includes(skillId)) return;
    const nextXp = state.xp + xpReward;
    const rank = computeRank(nextXp);
    set({
      unlockedSkills: [...state.unlockedSkills, skillId],
      xp: nextXp,
      level: rank.level,
      rankTitle: rank.rankTitle,
    });
    saveSnapshot(get());
  },

  addTerminalEntry: (cmd, output) => {
    set((state) => ({
      terminalHistory: [
        ...state.terminalHistory.slice(-45),
        {
          id: `term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          cmd,
          output,
          timestamp: Date.now(),
        },
      ],
    }));
  },

  clearTerminal: () =>
    set({
      terminalHistory: [
        {
          id: `term-clr-${Date.now()}`,
          cmd: 'clear',
          output: 'Terminal buffer cleared. Isolated defensive sandbox active.',
          timestamp: Date.now(),
        },
      ],
    }),

  recordTriage: (alertId, verdict, correct) => {
    const state = get();
    const alreadyScored = Boolean(state.triageDecisions[alertId]);
    const reward = !alreadyScored && correct ? 45 : 0;
    const nextXp = state.xp + reward;
    const rank = computeRank(nextXp);

    set({
      triageDecisions: {
        ...state.triageDecisions,
        [alertId]: { alertId, verdict, correct, timestamp: Date.now() },
      },
      xp: nextXp,
      level: rank.level,
      rankTitle: rank.rankTitle,
    });
    saveSnapshot(get());
  },

  addReport: (report) => {
    const state = get();
    const newReport: GhostSecurityReport = {
      ...report,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set({ savedReports: [newReport, ...state.savedReports] });
    saveSnapshot(get());
  },

  deleteReport: (id) => {
    set((state) => ({
      savedReports: state.savedReports.filter((r) => r.id !== id),
    }));
    saveSnapshot(get());
  },

  resetSandbox: (moduleId) => {
    const state = get();
    if (moduleId === 'terminal') {
      state.clearTerminal();
    } else if (moduleId === 'soc') {
      set({ triageDecisions: {}, sandboxNonce: state.sandboxNonce + 1 });
      saveSnapshot(get());
    } else {
      set({ sandboxNonce: state.sandboxNonce + 1 });
    }
  },
}));
