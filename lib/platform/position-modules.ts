import type { HandballPosition } from '@/lib/positions';
import type { ScenarioCategory } from '@/content/scenario-bank/types';
import type { PlayerGoalId } from '@/lib/platform/types';

export type PositionSkillId = string;

export interface PositionModule {
  position: HandballPosition;
  group: 'goalkeeper' | 'wing' | 'back' | 'pivot';
  /** Position IQ skill keys (language-neutral ids) — Sprint 5 matrix */
  positionSkills: PositionSkillId[];
  primaryCategories: ScenarioCategory[];
  secondaryCategories: ScenarioCategory[];
  focusKey: string;
  recommendedSessionKey: string;
  skillKeywords: Record<PositionSkillId, string[]>;
  goalCategoryBoost: Partial<Record<PlayerGoalId, ScenarioCategory[]>>;
}

const WING_SHARED: Omit<PositionModule, 'position'> = {
  group: 'wing',
  positionSkills: [
    'angleSelection',
    'fastBreakTiming',
    'finishingVariation',
    'goalkeeperReading',
    'defensiveTransition',
    'pressureFinishing',
  ],
  primaryCategories: ['Left Wing', 'Right Wing', 'Fast Break', 'Decision Making'],
  secondaryCategories: ['Match Ending', 'Power Play', 'Defence'],
  focusKey: 'home.focus.wing.default',
  recommendedSessionKey: 'resolver.rec.wing',
  skillKeywords: {
    angleSelection: ['angle', 'near', 'far', 'corner', 'narrow'],
    fastBreakTiming: ['fast break', 'counter', 'breakaway', 'timing', 'temp'],
    finishingVariation: ['finish', 'shot', 'scoring', 'lob', 'bounce', 'variation'],
    goalkeeperReading: ['goalkeeper', 'gk', 'keeper', 'dive', 'read'],
    defensiveTransition: ['defence', 'transition', 'recover', 'sprint back', 'track'],
    pressureFinishing: ['pressure', 'final', 'clutch', 'match ending', 'late'],
  },
  goalCategoryBoost: {
    Attack: ['Left Wing', 'Right Wing', 'Fast Break'],
    'Decision Making': ['Decision Making'],
    'Match Preparation': ['Match Ending'],
    'Game Intelligence': ['Decision Making', 'Fast Break'],
    Defence: ['Defence'],
    'Mental Preparation': ['Match Ending', 'Decision Making'],
    Leadership: ['Decision Making', 'Defence'],
    'Complete Development': ['Left Wing', 'Right Wing', 'Fast Break', 'Decision Making', 'Defence'],
  },
};

const BACK_SHARED: Omit<PositionModule, 'position'> = {
  group: 'back',
  positionSkills: [
    'gameReading',
    'breakthrough',
    'passing',
    'shotSelection',
    'defensiveReading',
    'pressureDecisions',
  ],
  primaryCategories: ['Left Back', 'Centre Back', 'Right Back', 'Decision Making', 'Defence'],
  secondaryCategories: ['Fast Break', 'Power Play', 'Match Ending'],
  focusKey: 'home.focus.back.default',
  recommendedSessionKey: 'resolver.rec.back',
  skillKeywords: {
    gameReading: ['read', 'space', 'scan', 'vision', 'game'],
    breakthrough: ['breakthrough', '1v1', 'drive', 'penetration'],
    passing: ['pass', 'assist', 'wing', 'pivot', 'feed'],
    shotSelection: ['shot', 'jump', '9m', 'selection', 'release'],
    defensiveReading: ['defence', 'system', '6:0', '5:1', 'formation', 'recover'],
    pressureDecisions: ['pressure', 'final', 'clutch', 'match ending', 'late'],
  },
  goalCategoryBoost: {
    Attack: ['Left Back', 'Centre Back', 'Right Back', 'Power Play'],
    Defence: ['Defence'],
    'Game Intelligence': ['Decision Making', 'Defence'],
    'Decision Making': ['Decision Making'],
    'Match Preparation': ['Match Ending'],
    'Mental Preparation': ['Match Ending', 'Decision Making'],
    Leadership: ['Decision Making', 'Defence'],
    'Complete Development': ['Left Back', 'Centre Back', 'Right Back', 'Decision Making', 'Defence', 'Fast Break'],
  },
};

export const POSITION_MODULES: Record<HandballPosition, PositionModule> = {
  Goalkeeper: {
    position: 'Goalkeeper',
    group: 'goalkeeper',
    positionSkills: [
      'shotReading',
      'positioning',
      'blockCooperation',
      'sevenMetre',
      'fastBreakStart',
      'pressureControl',
    ],
    primaryCategories: ['Goalkeeper', 'Decision Making', 'Fast Break', 'Match Ending'],
    secondaryCategories: ['Defence', 'Power Play'],
    focusKey: 'home.focus.goalkeeper.default',
    recommendedSessionKey: 'resolver.rec.goalkeeper',
    skillKeywords: {
      shotReading: ['read', 'shooter', 'shoulder', 'release', 'wing', 'backcourt'],
      positioning: ['position', 'angle', 'stance', 'centred', 'depth'],
      blockCooperation: ['block', 'defence', 'communicat', 'wall'],
      sevenMetre: ['7m', 'seven', 'penalty', 'seven-metre', 'seven metre'],
      fastBreakStart: ['fast break', 'outlet', 'counter', 'breakaway'],
      pressureControl: ['pressure', 'final', 'clutch', 'match ending', 'late'],
    },
    goalCategoryBoost: {
      'Decision Making': ['Goalkeeper', 'Decision Making'],
      'Mental Preparation': ['Match Ending', 'Goalkeeper'],
      'Match Preparation': ['Match Ending'],
      Defence: ['Goalkeeper', 'Defence'],
      Attack: ['Goalkeeper', 'Fast Break', 'Power Play'],
      'Game Intelligence': ['Goalkeeper', 'Decision Making'],
      Leadership: ['Decision Making', 'Defence'],
      'Complete Development': ['Goalkeeper', 'Decision Making', 'Fast Break', 'Match Ending', 'Defence'],
    },
  },
  'Left Wing': { ...WING_SHARED, position: 'Left Wing', primaryCategories: ['Left Wing', 'Fast Break', 'Decision Making', 'Defence'] },
  'Right Wing': { ...WING_SHARED, position: 'Right Wing', primaryCategories: ['Right Wing', 'Fast Break', 'Decision Making', 'Defence'] },
  'Left Back': { ...BACK_SHARED, position: 'Left Back', primaryCategories: ['Left Back', 'Decision Making', 'Defence'] },
  'Centre Back': {
    ...BACK_SHARED,
    position: 'Centre Back',
    primaryCategories: ['Centre Back', 'Decision Making', 'Defence'],
  },
  'Right Back': { ...BACK_SHARED, position: 'Right Back', primaryCategories: ['Right Back', 'Decision Making', 'Defence'] },
  Pivot: {
    position: 'Pivot',
    group: 'pivot',
    positionSkills: [
      'screening',
      'timing',
      'positioning',
      'spaceCreation',
      'receivingUnderContact',
      'decisionMaking',
    ],
    primaryCategories: ['Pivot', 'Decision Making', 'Defence'],
    secondaryCategories: ['Power Play', 'Match Ending', 'Fast Break'],
    focusKey: 'home.focus.pivot.default',
    recommendedSessionKey: 'resolver.rec.pivot',
    skillKeywords: {
      screening: ['screen', 'pick', 'block', 'seal'],
      timing: ['timing', 'when', 'arrive'],
      positioning: ['position', 'six', '6m', 'circle'],
      spaceCreation: ['space', 'create', 'gap', 'open'],
      receivingUnderContact: ['contact', 'receive', 'catch', 'pressure', 'physical'],
      decisionMaking: ['decision', 'finish', 'pass', 'shot', 'choice'],
    },
    goalCategoryBoost: {
      Attack: ['Pivot', 'Power Play'],
      'Decision Making': ['Pivot', 'Decision Making'],
      Defence: ['Defence', 'Pivot'],
      'Game Intelligence': ['Pivot', 'Decision Making'],
      'Mental Preparation': ['Match Ending', 'Decision Making'],
      'Match Preparation': ['Match Ending'],
      Leadership: ['Decision Making', 'Defence'],
      'Complete Development': ['Pivot', 'Decision Making', 'Defence', 'Power Play', 'Fast Break'],
    },
  },
};

export function getPositionModule(position: HandballPosition | string | null | undefined): PositionModule | null {
  if (!position) return null;
  return POSITION_MODULES[position as HandballPosition] ?? null;
}

export function isHandballPosition(value: string | null | undefined): value is HandballPosition {
  return Boolean(value && value in POSITION_MODULES);
}

/** Infer skill tags for a scenario from title/situation keywords + optional explicit tags. */
export function inferScenarioSkills(
  position: HandballPosition | string | null | undefined,
  text: string,
  explicitTags?: string[] | null,
): PositionSkillId[] {
  if (explicitTags?.length) return [...new Set(explicitTags)];
  const mod = getPositionModule(position);
  if (!mod) return [];
  const lower = text.toLowerCase();
  const matched = mod.positionSkills.filter((id) =>
    (mod.skillKeywords[id] ?? []).some((kw) => lower.includes(kw.toLowerCase())),
  );
  return matched.length ? matched : [mod.positionSkills[0]];
}
