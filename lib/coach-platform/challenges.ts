import coachGoldRuntime from './challenges-gold.json';
import type { CoachChallenge, CoachChallengeCategory } from './types';
import { scoreTextForTacticalPrefs } from '@/lib/platform/tactical-systems';

/** Active Coach runtime: the reviewed and hash-locked Coach Gold 70 bank. */
export const COACH_CHALLENGES: CoachChallenge[] = coachGoldRuntime as unknown as CoachChallenge[];

export function getCoachChallenges(): CoachChallenge[] {
  return COACH_CHALLENGES;
}

export function getCoachChallengeById(id: string): CoachChallenge | undefined {
  return COACH_CHALLENGES.find((challenge) => challenge.id === id);
}

export function getChallengesByCategory(category: CoachChallengeCategory): CoachChallenge[] {
  return COACH_CHALLENGES.filter((challenge) => challenge.category === category);
}

function categoriesForDevelopmentGoal(goalInput?: string | null): CoachChallengeCategory[] | null {
  const goal = (goalInput ?? '').toLowerCase();
  if (goal.includes('match') || goal.includes('analysis')) return ['opponent_analysis', 'defensive_adjustment'];
  if (goal.includes('tactic')) return ['timeout', 'defensive_adjustment', 'opponent_analysis'];
  if (goal.includes('player')) return ['player_development', 'leadership'];
  if (goal.includes('training')) return ['training_plan'];
  if (goal.includes('leadership')) return ['leadership', 'timeout'];
  return null;
}

export function pickCoachChallengeForProfile(opts: {
  coachType?: string | null;
  experienceBand?: string | null;
  developmentGoal?: string | null;
  favoriteDefense?: string | null;
  favoriteAttack?: string | null;
  excludeIds?: string[];
}): CoachChallenge {
  const exclude = new Set(opts.excludeIds ?? []);
  let pool = COACH_CHALLENGES.filter((challenge) => !exclude.has(challenge.id));
  if (!pool.length) pool = COACH_CHALLENGES;

  if (opts.coachType) {
    const tagged = pool.filter((challenge) => challenge.coachTypeTags.includes(opts.coachType!));
    if (tagged.length) pool = tagged;
  }
  if (opts.experienceBand) {
    const tagged = pool.filter((challenge) => challenge.experienceTags.includes(opts.experienceBand!));
    if (tagged.length) pool = tagged;
  }

  const focusedCategories = categoriesForDevelopmentGoal(opts.developmentGoal);
  if (focusedCategories) {
    const focused = pool.filter((challenge) => focusedCategories.includes(challenge.category));
    if (focused.length) pool = focused;
  }

  // Tactical preferences are a soft bias and never empty an otherwise valid profile pool.
  const scored = pool.map((challenge) => {
    const blob = [
      challenge.situation.en,
      challenge.situation.hr,
      challenge.situation.de,
      challenge.question.en,
      challenge.explanation.en,
      ...challenge.answers.map((answer) => answer.text.en),
    ].join(' ');
    return {
      challenge,
      score: scoreTextForTacticalPrefs(blob, opts.favoriteDefense, opts.favoriteAttack),
    };
  });
  const max = Math.max(0, ...scored.map(({ score }) => score));
  if (max > 0) {
    const boosted = scored.filter(({ score }) => score === max).map(({ challenge }) => challenge);
    if (boosted.length) pool = boosted;
  }

  const identity = [
    new Date().toISOString().slice(0, 10),
    opts.coachType ?? '',
    opts.experienceBand ?? '',
    opts.developmentGoal ?? '',
    opts.favoriteDefense ?? '',
    opts.favoriteAttack ?? '',
  ].join('|');
  let hash = 0;
  for (let index = 0; index < identity.length; index += 1) {
    hash = (hash * 31 + identity.charCodeAt(index)) >>> 0;
  }
  return pool[hash % pool.length] ?? COACH_CHALLENGES[0];
}
