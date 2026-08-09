import { useCallback, useMemo, useState } from 'react';
import { loadProfile, loadStreak } from '@/lib/storage';
import { resolvePlayerPosition } from '@/lib/platform/resolve-position';
import {
  loadDevelopmentState,
  saveDevelopmentState,
  getOrCreateDailyChallenge,
  getOrCreateWeeklyProgram,
  getDevelopmentSnapshot,
  xpToNextLevel,
  detectWeaknesses,
  processActivity,
  buildDailyGoals,
  buildWeeklyGoals,
  summarizeWeeklyGoals,
  ensureActiveProgram,
  getTodayProgramSession,
  recommendPrograms,
  type ActivityPayload,
  type ProcessResult,
  type DailyChallenge,
  type WeeklyProgram,
  type CoachReport,
} from '@/lib/development';

const EMPTY_CHALLENGE: DailyChallenge = {
  date: '',
  scenarioIds: [],
  title: '',
  focusCategory: '',
  difficulty: 'Intermediate',
  targetScore: 70,
  completed: false,
  xpAwarded: false,
};

const EMPTY_WEEKLY: WeeklyProgram = {
  weekStart: '',
  days: [],
  weeklyScore: 0,
  daysCompleted: 0,
  xpAwarded: false,
};

const EMPTY_COACH_REPORT: CoachReport = {
  generatedAt: '',
  improved: [],
  declined: [],
  trainNext: [],
  dailyFocus: '',
  summary: '',
};

export function useDevelopment() {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const profile = loadProfile();
  const position = resolvePlayerPosition(profile);

  const data = useMemo(() => {
    void tick;
    const state = loadDevelopmentState();
    const levelProgress = xpToNextLevel(state.totalXp);
    const weaknesses = detectWeaknesses(state.statistics, state.decisionEvents);
    const streak = loadStreak();

    if (!position) {
      return {
        state,
        dailyChallenge: EMPTY_CHALLENGE,
        weeklyProgram: EMPTY_WEEKLY,
        coachReport: EMPTY_COACH_REPORT,
        achievements: [] as ReturnType<typeof getDevelopmentSnapshot>['achievements'],
        levelProgress,
        weaknesses,
        streak,
        dailyGoals: null,
        weeklyGoals: null,
        weeklyGoalSummary: { completed: 0, remaining: 0, weeklyXp: 0, iqDelta: 0 },
        activeProgram: null,
        todayProgramSession: null,
        recommendedPrograms: [],
      };
    }

    ensureActiveProgram(
      state,
      position,
      profile.developmentGoal,
      weaknesses.weakCategories[0]?.name,
    );
    const dailyChallenge = getOrCreateDailyChallenge(position);
    const weeklyProgram = getOrCreateWeeklyProgram(position);
    const dailyGoals = buildDailyGoals(state, position);
    const weeklyGoals = buildWeeklyGoals(state);
    state.dailyGoals = dailyGoals;
    state.weeklyGoals = weeklyGoals;
    saveDevelopmentState(state);
    const snapshot = getDevelopmentSnapshot(position);
    const todayProgramSession = getTodayProgramSession(snapshot.state);
    const recommendedPrograms = recommendPrograms(
      position,
      profile.developmentGoal,
      weaknesses.weakCategories[0]?.name,
    );

    return {
      state: snapshot.state,
      dailyChallenge,
      weeklyProgram,
      coachReport: snapshot.coachReport,
      achievements: snapshot.achievements,
      levelProgress,
      weaknesses,
      streak,
      dailyGoals,
      weeklyGoals,
      weeklyGoalSummary: summarizeWeeklyGoals(snapshot.state),
      activeProgram: snapshot.state.activeProgram,
      todayProgramSession,
      recommendedPrograms,
    };
  }, [tick, position, profile.developmentGoal]);

  const recordActivity = useCallback((payload: ActivityPayload): ProcessResult => {
    const result = processActivity(payload);
    refresh();
    return result;
  }, [refresh]);

  return { ...data, refresh, recordActivity, position };
}
