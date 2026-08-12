import { loadSessions, loadMatchHistory, loadProfile, type SessionRecord, type MatchHistoryRecord } from '@/lib/storage';
import { loadDevelopmentState } from '@/lib/development/storage';
import type { DecisionEvent } from '@/lib/development/types';
import type { HandballPosition } from '@/lib/positions';
import { getPositionModule, isHandballPosition } from '@/lib/platform/position-modules';

export interface SkillScore {
  id: string;
  score: number | null;
  sampleCount: number;
}

export interface HandballIqReport {
  overall: number | null;
  overallSampleCount: number;
  decisionMaking: SkillScore;
  attackIq: SkillScore;
  defenceIq: SkillScore;
  gameReading: SkillScore;
  mentalIq: SkillScore;
  pressureDecisions: SkillScore;
  positionIq: SkillScore;
  positionSkills: SkillScore[];
  strongest: SkillScore | null;
  weakest: SkillScore | null;
}

const WEIGHTS = {
  decisionMaking: 0.2,
  attackIq: 0.15,
  defenceIq: 0.15,
  gameReading: 0.15,
  mentalIq: 0.1,
  pressureDecisions: 0.1,
  positionIq: 0.15,
} as const;

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return clampScore(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function skill(id: string, values: number[]): SkillScore {
  return { id, score: avg(values), sampleCount: values.length };
}

function eventAccuracy(events: DecisionEvent[], predicate: (e: DecisionEvent) => boolean): number[] {
  const filtered = events.filter(predicate);
  if (filtered.length === 0) return [];
  // Convert correctness stream to rolling accuracy buckets of 1 (each event 0/100)
  return filtered.map((e) => (e.isCorrect ? 100 : 0));
}

function matchPressureScores(matches: MatchHistoryRecord[]): number[] {
  return matches.map((m) => m.pressureControl).filter((n) => typeof n === 'number' && n > 0);
}

function matchReadingScores(matches: MatchHistoryRecord[]): number[] {
  return matches.map((m) => m.readingAbility).filter((n) => typeof n === 'number' && n > 0);
}

function matchConsistencyScores(matches: MatchHistoryRecord[]): number[] {
  return matches.map((m) => m.consistency).filter((n) => typeof n === 'number' && n > 0);
}

function positionSkillScores(
  position: HandballPosition,
  events: DecisionEvent[],
): SkillScore[] {
  const mod = getPositionModule(position);
  if (!mod) return [];

  return mod.positionSkills.map((skillId) => {
    const keywords = mod.skillKeywords[skillId] ?? [skillId];
    const values = eventAccuracy(events, (e) => {
      if (e.position && e.position !== position) return false;
      const hay = `${e.category} ${e.scenarioType} ${e.formation ?? ''}`.toLowerCase();
      return keywords.some((k) => hay.includes(k.toLowerCase()));
    });
    // Fallback: position-filtered events if keyword match empty but we have position data
    if (values.length === 0) {
      const posValues = eventAccuracy(events, (e) => e.position === position);
      return skill(skillId, posValues.slice(0, Math.min(posValues.length, 20)));
    }
    return skill(skillId, values);
  });
}

function weightedOverall(parts: { score: number | null; weight: number; samples: number }[]): {
  overall: number | null;
  sampleCount: number;
} {
  let weightSum = 0;
  let acc = 0;
  let samples = 0;
  for (const p of parts) {
    if (p.score == null || p.samples <= 0) continue;
    weightSum += p.weight;
    acc += p.score * p.weight;
    samples += p.samples;
  }
  if (weightSum === 0) return { overall: null, sampleCount: 0 };
  return { overall: clampScore(acc / weightSum), sampleCount: samples };
}

export function calculateHandballIq(
  positionInput: string | null | undefined,
  sessions: SessionRecord[] = loadSessions(),
  matches: MatchHistoryRecord[] = loadMatchHistory(),
  events: DecisionEvent[] = loadDevelopmentState().decisionEvents,
): HandballIqReport {
  const position = isHandballPosition(positionInput) ? positionInput : null;
  const primaryPosition = loadProfile().position;
  const scopedSessions = position
    ? sessions.filter((session) => session.position === position || (!session.position && primaryPosition === position))
    : sessions;
  const scopedMatches = position
    ? matches.filter((match) => match.position === position || (!match.position && primaryPosition === position))
    : matches;
  const scopedEvents = position
    ? events.filter((event) => event.position === position || (!event.position && primaryPosition === position))
    : events;

  const sessionScores = scopedSessions.map((s) => s.decisionScore).filter((n) => n > 0);
  const matchScores = scopedMatches.map((m) => m.decisionScore).filter((n) => n > 0);
  const decisionValues = [...sessionScores, ...matchScores];

  const attackValues = eventAccuracy(
    scopedEvents,
    (e) =>
      /attack|wing|pivot|fast break|power|finish|shot/i.test(`${e.category} ${e.scenarioType}`) ||
      e.category === 'Left Wing' ||
      e.category === 'Right Wing' ||
      e.category === 'Pivot' ||
      e.category === 'Fast Break',
  );
  // Supplement with match decision when attack events sparse
  if (attackValues.length < 3 && matchScores.length) {
    attackValues.push(...matchScores.slice(0, 5));
  }

  const defenceValues = eventAccuracy(
    scopedEvents,
    (e) =>
      e.category === 'Defence' ||
      /defence|defense|block|6:0|5:1/i.test(`${e.category} ${e.scenarioType} ${e.formation ?? ''}`),
  );
  if (defenceValues.length < 3) {
    defenceValues.push(...matchPressureScores(scopedMatches).slice(0, 5));
  }

  const readingValues = [
    ...matchReadingScores(scopedMatches),
    ...eventAccuracy(scopedEvents, (e) => /read|shooter|tactical|scan/i.test(`${e.category} ${e.scenarioType}`)),
  ];

  const mentalValues = [
    ...matchConsistencyScores(scopedMatches),
    ...eventAccuracy(scopedEvents, (e) => /pressure|mental|emotion|reset/i.test(`${e.category} ${e.scenarioType}`)),
  ];

  const pressureValues = [
    ...matchPressureScores(scopedMatches),
    ...eventAccuracy(scopedEvents, (e) => e.difficulty === 'Expert' || e.difficulty === 'Advanced' || /pressure|final|critical/i.test(e.scenarioType)),
  ];

  const posSkills = position ? positionSkillScores(position, scopedEvents) : [];
  const posSkillValues = posSkills.map((s) => s.score).filter((n): n is number => n != null);
  // Position IQ also blends position-scoped event accuracy
  const positionEventValues = position
    ? eventAccuracy(scopedEvents, (e) => e.position === position)
    : [];
  const positionIqValues = [...posSkillValues, ...positionEventValues, ...sessionScores.slice(0, 5)];

  const decisionMaking = skill('decisionMaking', decisionValues);
  const attackIq = skill('attackIq', attackValues);
  const defenceIq = skill('defenceIq', defenceValues);
  const gameReading = skill('gameReading', readingValues);
  const mentalIq = skill('mentalIq', mentalValues);
  const pressureDecisions = skill('pressureDecisions', pressureValues);
  const positionIq = skill('positionIq', positionIqValues);

  const { overall, sampleCount } = weightedOverall([
    { score: decisionMaking.score, weight: WEIGHTS.decisionMaking, samples: decisionMaking.sampleCount },
    { score: attackIq.score, weight: WEIGHTS.attackIq, samples: attackIq.sampleCount },
    { score: defenceIq.score, weight: WEIGHTS.defenceIq, samples: defenceIq.sampleCount },
    { score: gameReading.score, weight: WEIGHTS.gameReading, samples: gameReading.sampleCount },
    { score: mentalIq.score, weight: WEIGHTS.mentalIq, samples: mentalIq.sampleCount },
    { score: pressureDecisions.score, weight: WEIGHTS.pressureDecisions, samples: pressureDecisions.sampleCount },
    { score: positionIq.score, weight: WEIGHTS.positionIq, samples: positionIq.sampleCount },
  ]);

  const ranked = [decisionMaking, attackIq, defenceIq, gameReading, mentalIq, pressureDecisions, positionIq]
    .filter((s) => s.score != null && s.sampleCount >= 3)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  return {
    overall,
    overallSampleCount: sampleCount,
    decisionMaking,
    attackIq,
    defenceIq,
    gameReading,
    mentalIq,
    pressureDecisions,
    positionIq,
    positionSkills: posSkills,
    strongest: ranked[0] ?? null,
    weakest: ranked.length ? ranked[ranked.length - 1] : null,
  };
}

export function labelForIqSkill(id: string): string {
  return `iq.skill.${id}`;
}
