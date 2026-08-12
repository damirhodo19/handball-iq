import type { SupportedLanguage } from '@/locales';
import type { HandballPosition } from '@/lib/positions';
import { getScenarioCategories, getDailySession } from '@/lib/positions';
import type { UserProfile } from '@/lib/storage';
import { loadProfile, loadSessions, loadMatchHistory } from '@/lib/storage';
import { loadDevelopmentState, saveDevelopmentState } from '@/lib/development/storage';
import { getOrCreateDailyChallenge } from '@/lib/development/daily-challenge';
import {
  getAllScenarios,
  getScenariosByPosition,
  toGKScenario,
} from '@/lib/scenario-bank';
import type { BankScenario, ScenarioCategory } from '@/content/scenario-bank/types';
import type { GKScenario } from '@/lib/scenarios';
import { resolveAppRole } from '@/lib/platform/personalization';
import { getActiveMode, type ActiveMode } from '@/lib/platform/active-mode';
import { getPositionModule, inferScenarioSkills, isHandballPosition } from '@/lib/platform/position-modules';
import { isScenarioForPosition, isUniversalPrimary } from '@/lib/platform/scenario-position';
import { pickUniqueScenariosWithoutReplacement } from '@/lib/platform/unique-scenarios';
import { calculateHandballIq, type HandballIqReport } from '@/lib/platform/handball-iq';
import type { PlayerGoalId } from '@/lib/platform/types';
import type { Difficulty } from '@/lib/admin-storage';
import { buildFocusSignature, computeDevelopmentLoad, shouldAvoidSignature } from '@/lib/development/load';
import { getWeakestSkillId } from '@/lib/development/weakness';
import { getProgramDef } from '@/lib/development/programs';
import { computeStatistics } from '@/lib/development/statistics';
import { resolveActivePlayerPosition } from '@/lib/platform/active-player-position';

export interface ResolverInput {
  profile?: UserProfile;
  language?: SupportedLanguage;
  activeMode?: ActiveMode;
}

export interface ResolvedTrainingPlan {
  position: HandballPosition | null;
  focusKey: string;
  focusParams?: Record<string, string | number>;
  recommendedTitleKey: string;
  recommendedSubtitleKey: string;
  recommendedCount: number;
  categories: ReturnType<typeof getScenarioCategories>;
  dailySession: ReturnType<typeof getDailySession> | null;
  scenarioIds: string[];
  difficulty: Difficulty;
}

export interface ContentResolution {
  role: ReturnType<typeof resolveAppRole>;
  activeMode: ActiveMode;
  position: HandballPosition | null;
  developmentGoal: string | null;
  iq: HandballIqReport;
  training: ResolvedTrainingPlan;
  dailyChallengePosition: HandballPosition | null;
  matchPoolPosition: HandballPosition | null;
  reportFocusKeys: string[];
  progressCategories: string[];
  isCoachMode: boolean;
}

function levelToDifficulty(level: string | null | undefined): Difficulty {
  switch (level) {
    case 'Beginner':
    case 'Youth':
      return 'Beginner';
    case 'Junior':
      return 'Intermediate';
    case 'Senior':
      return 'Advanced';
    case 'Professional':
      return 'Expert';
    default:
      return 'Intermediate';
  }
}

function scoreScenario(
  s: BankScenario,
  position: HandballPosition,
  goals: string[],
  weakCategories: string[],
  preferredDifficulty: Difficulty,
  incorrectTypes: string[],
  weakSkills: string[],
  programSkills: string[],
  improvementTrend: number,
): number {
  const mod = getPositionModule(position);
  let score = s.qualityScore;

  if (s.primaryPosition === position) score += 40;
  else if (s.secondaryPositions.includes(position)) score += 20;

  if (mod?.primaryCategories.includes(s.category)) score += 25;
  else if (mod?.secondaryCategories.includes(s.category)) score += 10;

  if (s.difficulty === preferredDifficulty) score += 15;
  else if (
    (preferredDifficulty === 'Beginner' && s.difficulty === 'Intermediate') ||
    (preferredDifficulty === 'Expert' && s.difficulty === 'Advanced')
  ) {
    score += 5;
  }

  if (mod) {
    for (const goal of goals) {
      const boost = mod.goalCategoryBoost[goal as PlayerGoalId];
      if (boost?.includes(s.category)) score += 20;
    }
  }

  if (weakCategories.some((w) => w.toLowerCase() === s.category.toLowerCase())) {
    score += 18;
  }

  if (incorrectTypes.some((t) => s.title.en.toLowerCase().includes(t.toLowerCase()))) {
    score += 12;
  }

  const text = `${s.title.en} ${s.situation.en} ${s.category}`;
  const skills = inferScenarioSkills(position, text, s.skillTags);
  if (weakSkills.some((w) => skills.includes(w))) score += 22;
  if (programSkills.some((w) => skills.includes(w))) score += 16;

  // Prefer slightly harder material when improving; easier when declining
  if (improvementTrend > 5 && (s.difficulty === 'Advanced' || s.difficulty === 'Expert')) score += 8;
  if (improvementTrend < -5 && (s.difficulty === 'Beginner' || s.difficulty === 'Intermediate')) score += 8;

  // Prefer defence / transition when those are weak categories
  if (weakCategories.includes('Defence') && s.attackOrDefence === 'Defence') score += 10;
  if (weakCategories.includes('Fast Break') && s.category === 'Fast Break') score += 10;

  return score;
}

function collectIncorrectTypes(events: ReturnType<typeof loadDevelopmentState>['decisionEvents']): string[] {
  const wrong = events.filter((e) => !e.isCorrect).slice(0, 40);
  const counts = new Map<string, number>();
  for (const e of wrong) {
    const key = e.scenarioType || e.category;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);
}

export function resolveRecommendedScenarios(
  position: HandballPosition,
  profile: UserProfile,
  count?: number,
): BankScenario[] {
  const load = computeDevelopmentLoad();
  const targetCount = count ?? load.scenarioCount;
  const preferredDifficulty = levelToDifficulty(profile.playingLevel);
  const developmentGoals = profile.developmentGoals.length
    ? profile.developmentGoals
    : profile.developmentGoal ? [profile.developmentGoal] : [];
  const state = loadDevelopmentState();
  const positionEvents = state.decisionEvents.filter((event) => event.position === position);
  const positionStatistics = computeStatistics(positionEvents);
  const weakCategories = Object.entries(positionStatistics.byCategory)
    .filter(([, v]) => v.total >= 3 && v.total > 0 && v.correct / v.total < 0.65)
    .map(([k]) => k);
  const incorrectTypes = collectIncorrectTypes(positionEvents);
  const weakSkill = getWeakestSkillId(positionStatistics);
  const weakSkills = weakSkill ? [weakSkill] : Object.entries(positionStatistics.bySkill ?? {})
    .filter(([, v]) => v.total >= 3 && v.accuracy < 65)
    .map(([k]) => k)
    .slice(0, 3);

  const programWeek = state.activeProgram && !state.activeProgram.completed
    ? getProgramDef(state.activeProgram.programId)?.weeks.find((w) => w.week === state.activeProgram!.currentWeek)
    : null;
  const programSkills = programWeek?.skillFocus ?? [];

  const signature = buildFocusSignature({
    position,
    programWeek: state.activeProgram?.currentWeek,
    weakSkill: weakSkill,
    loadLevel: load.loadLevel,
    difficulty: preferredDifficulty,
  });

  // Prefer position-compatible scenarios; never pull Goalkeeper (or other) primaries via category.
  const byId = new Map<string, BankScenario>();
  for (const s of getScenariosByPosition(position)) byId.set(s.id, s);

  if (byId.size < targetCount) {
    const mod = getPositionModule(position);
    const cats = new Set<ScenarioCategory>([
      ...(mod?.primaryCategories ?? []),
      ...(mod?.secondaryCategories ?? []),
    ]);
    for (const s of getAllScenarios()) {
      if (!isScenarioForPosition(s, position)) continue;
      if (s.primaryPosition === position || cats.has(s.category)) byId.set(s.id, s);
    }
  }

  if (byId.size < targetCount) {
    for (const s of getAllScenarios()) {
      // Universal player content only — never Goalkeeper fallback
      if (isUniversalPrimary(s.primaryPosition) && isScenarioForPosition(s, position)) {
        byId.set(s.id, s);
      }
      if (byId.size >= targetCount * 3) break;
    }
  }

  const pool = [...byId.values()];
  const avoidRepeat = shouldAvoidSignature(state.recommendationHistory, signature);

  const ranked = [...pool]
    .map((s) => {
      let score =
        scoreScenario(
          s,
          position,
          developmentGoals,
          weakCategories,
          preferredDifficulty,
          incorrectTypes,
          weakSkills,
          programSkills,
          positionStatistics.improvementTrend ?? 0,
        ) - (s.primaryPosition === 'All' ? 35 : 0);
      // Break loops: rotate when same focus signature repeats
      if (avoidRepeat) {
        const daySalt = new Date().getDate() % 7;
        score += ((s.id.charCodeAt(s.id.length - 1) || 0) + daySalt * 13) % 17;
      }
      return { s, score };
    })
    .sort((a, b) => b.score - a.score);

  // Without replacement: unique scenarioFamilyId + diversity rules (no semantic clones)
  const selected = pickUniqueScenariosWithoutReplacement(
    ranked.map((x) => x.s),
    targetCount,
    position,
  );

  // Persist focus signature (local cache only)
  const history = [signature, ...(state.recommendationHistory ?? [])].slice(0, 14);
  if (history[0] !== state.recommendationHistory?.[0]) {
    state.recommendationHistory = history;
    saveDevelopmentState(state);
  }

  return selected;
}

export function resolveTrainingScenariosAsGk(
  position: HandballPosition,
  profile: UserProfile,
  count = 5,
): GKScenario[] {
  return resolveRecommendedScenarios(position, profile, count).map((s, i) =>
    toGKScenario(s, i + 1, position),
  );
}

export function resolveContent(input: ResolverInput = {}): ContentResolution {
  const profile = input.profile ?? loadProfile();
  const role = resolveAppRole(profile);
  const activeMode = input.activeMode ?? getActiveMode();
  const isCoachMode = activeMode === 'coach' && (role === 'coach' || role === 'player_coach');

  const position = isCoachMode
    ? (isHandballPosition(profile.position) ? profile.position : null)
    : resolveActivePlayerPosition(profile);
  const mod = position ? getPositionModule(position) : null;

  const sessions = loadSessions();
  const matches = loadMatchHistory();
  const events = loadDevelopmentState().decisionEvents;
  const positionStatistics = computeStatistics(
    position ? events.filter((event) => event.position === position) : events,
  );
  const iq = calculateHandballIq(position, sessions, matches, events);

  const preferredDifficulty = levelToDifficulty(profile.playingLevel);
  const load = computeDevelopmentLoad();
  const recommended = position ? resolveRecommendedScenarios(position, profile) : [];
  const weakSkill = position ? getWeakestSkillId(positionStatistics) : null;

  const group = mod?.group ?? 'general';
  const training: ResolvedTrainingPlan = {
    position,
    focusKey: isCoachMode
      ? 'home.focus.coach.default'
      : weakSkill
        ? 'sprint5.focus.skill'
        : (mod?.focusKey ?? 'home.focus.general.default'),
    focusParams: weakSkill ? { skill: weakSkill } : undefined,
    recommendedTitleKey: isCoachMode
      ? 'home.rec.coach.title'
      : load.recommendedSessionLength === 'short_review'
        ? 'sprint5.load.shortReview'
        : `home.rec.${group}.title`,
    recommendedSubtitleKey: isCoachMode
      ? 'home.rec.coach.subtitle'
      : load.labelKey,
    recommendedCount: recommended.length || load.scenarioCount,
    categories: position ? getScenarioCategories(position) : [],
    dailySession: position ? getDailySession(position) : null,
    scenarioIds: recommended.map((s) => s.id),
    difficulty: preferredDifficulty,
  };

  // Ensure daily challenge exists for player mode
  if (position && !isCoachMode) {
    getOrCreateDailyChallenge(position);
  }

  const reportFocusKeys = [
    iq.weakest ? `iq.skill.${iq.weakest.id}` : 'iq.skill.decisionMaking',
    iq.strongest ? `iq.skill.${iq.strongest.id}` : 'iq.skill.positionIq',
  ];

  const progressCategories = mod
    ? [...mod.primaryCategories, ...mod.positionSkills]
    : ['Decision Making'];

  return {
    role,
    activeMode,
    position,
    developmentGoal: isCoachMode
      ? (profile.coachDevelopmentGoal ?? profile.developmentGoal)
      : profile.developmentGoal,
    iq,
    training,
    dailyChallengePosition: position,
    matchPoolPosition: position,
    reportFocusKeys,
    progressCategories,
    isCoachMode,
  };
}

/** Filters for training UI — applied on top of resolver ranking */
export function filterResolvedScenarios(
  scenarios: BankScenario[],
  filters: { category?: string; difficulty?: string },
): BankScenario[] {
  return scenarios.filter((s) => {
    if (filters.category && s.category !== filters.category) return false;
    if (filters.difficulty && s.difficulty !== filters.difficulty) return false;
    return true;
  });
}
