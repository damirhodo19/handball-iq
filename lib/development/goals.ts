import type { HandballPosition } from '@/lib/positions';
import type {
  ActivityPayload,
  DailyGoalsState,
  DevelopmentState,
  WeeklyGoalsState,
} from './types';
import { XP_REWARDS } from './levels';
import { getWeekStart, todayStr } from './calendar';
import { getProgramDef } from './programs';

export function buildDailyGoals(
  state: DevelopmentState,
  position: HandballPosition | null,
): DailyGoalsState {
  const date = todayStr();
  if (state.dailyGoals?.date === date) return state.dailyGoals;

  const programWeek = state.activeProgram
    ? getProgramDef(state.activeProgram.programId)?.weeks.find(
        (w) => w.week === state.activeProgram!.currentWeek,
      )
    : null;

  const estimatedMinutes = programWeek
    ? programWeek.scenariosPerSession * 1.5 + 8
    : 12;

  const goals: DailyGoalsState['goals'] = [
    {
      id: 'daily_session',
      type: 'session',
      target: 1,
      progress: 0,
      status: 'pending',
      xpReward: XP_REWARDS.daily_goal,
      labelKey: 'sprint4.dailyGoal.session',
    },
    {
      id: 'daily_challenge',
      type: 'challenge',
      target: 1,
      progress: state.dailyChallenge?.date === date && state.dailyChallenge.completed ? 1 : 0,
      status:
        state.dailyChallenge?.date === date && state.dailyChallenge.completed
          ? 'completed'
          : 'pending',
      xpReward: XP_REWARDS.daily_challenge,
      labelKey: 'sprint4.dailyGoal.challenge',
    },
  ];

  if (position && state.activeProgram && !state.activeProgram.completed) {
    goals.push({
      id: 'daily_program',
      type: 'program',
      target: 1,
      progress: 0,
      status: 'pending',
      xpReward: XP_REWARDS.daily_goal,
      labelKey: 'sprint4.dailyGoal.program',
    });
  }

  const xpAvailable =
    goals.filter((g) => g.status !== 'completed').reduce((s, g) => s + g.xpReward, 0) +
    XP_REWARDS.streak_day;

  return { date, goals, xpAvailable, estimatedMinutes: Math.round(estimatedMinutes) };
}

export function buildWeeklyGoals(state: DevelopmentState): WeeklyGoalsState {
  const weekStart = getWeekStart();
  if (state.weeklyGoals?.weekStart === weekStart) return state.weeklyGoals;

  const weakest = Object.entries(state.statistics.byCategory)
    .filter(([, s]) => s.total >= 3)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)[0]?.[0];

  return {
    weekStart,
    weeklyXp: 0,
    iqDelta: state.statistics.improvementTrend,
    goals: [
      {
        id: 'weekly_sessions',
        type: 'sessions',
        target: 4,
        progress: 0,
        status: 'pending',
        xpReward: XP_REWARDS.weekly_goal,
        labelKey: 'sprint4.weeklyGoal.sessions',
      },
      {
        id: 'weekly_accuracy',
        type: 'accuracy',
        target: 75,
        progress: Math.round(state.statistics.decisionAccuracy),
        status: state.statistics.decisionAccuracy >= 75 ? 'completed' : 'pending',
        xpReward: XP_REWARDS.weekly_goal,
        labelKey: 'sprint4.weeklyGoal.accuracy',
      },
      {
        id: 'weekly_matches',
        type: 'matches',
        target: 2,
        progress: 0,
        status: 'pending',
        xpReward: XP_REWARDS.weekly_goal,
        labelKey: 'sprint4.weeklyGoal.matches',
      },
      {
        id: 'weekly_weakest',
        type: 'weakest',
        target: 1,
        progress: 0,
        status: 'pending',
        xpReward: XP_REWARDS.weekly_goal,
        labelKey: 'sprint4.weeklyGoal.weakest',
        meta: weakest ?? '',
      },
      {
        id: 'weekly_streak',
        type: 'streak',
        target: 5,
        progress: 0,
        status: 'pending',
        xpReward: XP_REWARDS.weekly_goal,
        labelKey: 'sprint4.weeklyGoal.streak',
      },
    ],
  };
}

export function applyActivityToGoals(
  state: DevelopmentState,
  payload: ActivityPayload,
  currentStreak: number,
): { dailyXpKeys: string[]; weeklyXpKeys: string[] } {
  const dailyXpKeys: string[] = [];
  const weeklyXpKeys: string[] = [];
  const date = todayStr();
  const weekStart = getWeekStart();

  if (!state.dailyGoals || state.dailyGoals.date !== date) {
    state.dailyGoals = buildDailyGoals(state, payload.position);
  }
  if (!state.weeklyGoals || state.weeklyGoals.weekStart !== weekStart) {
    state.weeklyGoals = buildWeeklyGoals(state);
  }

  const bumpDaily = (id: string) => {
    const g = state.dailyGoals!.goals.find((x) => x.id === id);
    if (!g || g.status === 'completed') return;
    g.progress = Math.min(g.target, g.progress + 1);
    if (g.progress >= g.target) {
      g.status = 'completed';
      dailyXpKeys.push(`daily_goal_${date}_${id}`);
    }
  };

  const bumpWeekly = (id: string, amount = 1) => {
    const g = state.weeklyGoals!.goals.find((x) => x.id === id);
    if (!g || g.status === 'completed') return;
    if (g.type === 'accuracy') {
      g.progress = Math.round(state.statistics.decisionAccuracy);
    } else if (g.type === 'streak') {
      g.progress = currentStreak;
    } else {
      g.progress = Math.min(g.target, g.progress + amount);
    }
    if (g.progress >= g.target) {
      g.status = 'completed';
      weeklyXpKeys.push(`weekly_goal_${weekStart}_${id}`);
    }
  };

  if (payload.source === 'training' || payload.source === 'daily_challenge') {
    bumpDaily('daily_session');
    bumpWeekly('weekly_sessions');
  }
  if (payload.source === 'daily_challenge' || payload.isDailyChallenge) {
    bumpDaily('daily_challenge');
  }
  if (state.activeProgram && !state.activeProgram.completed) {
    bumpDaily('daily_program');
  }
  if (payload.source === 'match') {
    bumpWeekly('weekly_matches');
  }

  const weakestMeta = state.weeklyGoals.goals.find((g) => g.id === 'weekly_weakest')?.meta;
  if (weakestMeta && payload.decisions.some((d) => d.category === weakestMeta)) {
    bumpWeekly('weekly_weakest');
  }

  bumpWeekly('weekly_accuracy', 0);
  bumpWeekly('weekly_streak', 0);

  state.dailyGoals.xpAvailable = state.dailyGoals.goals
    .filter((g) => g.status !== 'completed')
    .reduce((s, g) => s + g.xpReward, 0);

  return { dailyXpKeys, weeklyXpKeys };
}

export function summarizeWeeklyGoals(state: DevelopmentState): {
  completed: number;
  remaining: number;
  weeklyXp: number;
  iqDelta: number;
} {
  const goals = state.weeklyGoals?.goals ?? [];
  const completed = goals.filter((g) => g.status === 'completed').length;
  return {
    completed,
    remaining: Math.max(0, goals.length - completed),
    weeklyXp: state.weeklyGoals?.weeklyXp ?? 0,
    iqDelta: state.weeklyGoals?.iqDelta ?? state.statistics.improvementTrend,
  };
}
