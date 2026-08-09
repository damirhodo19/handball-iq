import type { UserProfile } from '@/lib/storage';
import { loadProfile } from '@/lib/storage';
import { pickCoachChallengeForProfile, getCoachChallengeById } from './challenges';
import { calculateCoachIq, type CoachIqReport } from './coach-iq';
import { loadCoachDevState, setDailyCoachChallenge } from './storage';
import type { CoachChallenge, MatchAnalysisRecord, TrainingPlan } from './types';

export interface CoachContentResolution {
  iq: CoachIqReport;
  dailyChallenge: CoachChallenge;
  dailyCompleted: boolean;
  focusKey: string;
  recommendedSessionKey: string;
  recommendedSubtitleKey: string;
  recentLearning: {
    type: 'challenge' | 'planner' | 'match_analysis';
    labelKey: string;
    date: string;
  }[];
  recentPlans: TrainingPlan[];
  recentAnalyses: MatchAnalysisRecord[];
  developmentGoal: string | null;
  coachType: string | null;
  favoriteDefense: string | null;
  favoriteAttack: string | null;
  experienceBand: string | null;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function focusKeyForProfile(profile: UserProfile): string {
  const goal = profile.coachDevelopmentGoal ?? profile.developmentGoal ?? '';
  if (goal.includes('Tactics') || goal.includes('Match Analysis')) return 'coachHome.focus.tactics';
  if (goal.includes('Player Development')) return 'coachHome.focus.playerDev';
  if (goal.includes('Training')) return 'coachHome.focus.training';
  if (goal.includes('Leadership')) return 'coachHome.focus.leadership';
  if (profile.favoriteDefense && profile.favoriteDefense !== 'none') return 'coachHome.focus.defence';
  if (profile.favoriteAttack && profile.favoriteAttack !== 'none') return 'coachHome.focus.attack';
  return 'coachHome.focus.default';
}

export function resolveCoachContent(profileInput?: UserProfile): CoachContentResolution {
  const profile = profileInput ?? loadProfile();
  const state = loadCoachDevState();
  const today = todayStr();

  if (state.dailyChallengeDate !== today || !state.dailyChallengeId) {
    const picked = pickCoachChallengeForProfile({
      coachType: profile.coachType,
      experienceBand: profile.experienceBand,
      developmentGoal: profile.coachDevelopmentGoal ?? profile.developmentGoal,
      favoriteDefense: profile.favoriteDefense,
      favoriteAttack: profile.favoriteAttack,
    });
    setDailyCoachChallenge(picked.id, today);
  }

  const refreshed = loadCoachDevState();
  const dailyChallenge =
    getCoachChallengeById(refreshed.dailyChallengeId ?? '') ??
    pickCoachChallengeForProfile({
      coachType: profile.coachType,
      experienceBand: profile.experienceBand,
      developmentGoal: profile.coachDevelopmentGoal ?? profile.developmentGoal,
      favoriteDefense: profile.favoriteDefense,
      favoriteAttack: profile.favoriteAttack,
    });

  const iq = calculateCoachIq(refreshed.challengeAttempts, refreshed.activityEvents);

  const recentLearning = refreshed.activityEvents.slice(0, 5).map((e) => ({
    type: e.source,
    labelKey:
      e.source === 'challenge'
        ? `coachChallenge.cat.${e.category}`
        : e.source === 'planner'
          ? 'coachHome.recent.planner'
          : 'coachHome.recent.analysis',
    date: e.date,
  }));

  return {
    iq,
    dailyChallenge,
    dailyCompleted: refreshed.dailyChallengeCompleted,
    focusKey: focusKeyForProfile(profile),
    recommendedSessionKey: 'coachHome.rec.challenge.title',
    recommendedSubtitleKey: 'coachHome.rec.challenge.subtitle',
    recentLearning,
    recentPlans: refreshed.trainingPlans.slice(0, 3),
    recentAnalyses: refreshed.matchAnalyses.slice(0, 3),
    developmentGoal: profile.coachDevelopmentGoal ?? profile.developmentGoal,
    coachType: profile.coachType ?? null,
    favoriteDefense: profile.favoriteDefense ?? null,
    favoriteAttack: profile.favoriteAttack ?? null,
    experienceBand: profile.experienceBand ?? null,
  };
}
