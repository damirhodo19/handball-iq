import type { HandballPosition } from '@/lib/positions';
import type { ScenarioCategory } from '@/content/scenario-bank/types';
import type { PlayerGoalId } from '@/lib/platform/types';

export type ProgramId =
  | 'goalkeeper_iq'
  | 'wing_finishing'
  | 'backcourt_vision'
  | 'pivot_intelligence'
  | 'defensive_specialist'
  | 'fast_break_mastery'
  | 'pressure_decisions';

export interface ProgramWeek {
  week: number;
  objectiveKey: string;
  categories: ScenarioCategory[];
  /** Sprint 5 skill matrix focus for the week */
  skillFocus: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  sessionsPerWeek: number;
  scenariosPerSession: number;
  /** Mid-program checkpoint (typically week 3) */
  isCheckpoint?: boolean;
}

export interface DevelopmentProgramDef {
  id: ProgramId;
  titleKey: string;
  summaryKey: string;
  durationWeeks: number;
  /** Positions that may receive this as a core recommended program */
  eligiblePositions: HandballPosition[];
  /** Goal tags that boost recommendation */
  goalTags: PlayerGoalId[];
  weeks: ProgramWeek[];
  finalAssessment: {
    scenarioCount: number;
    categories: ScenarioCategory[];
    targetAccuracy: number;
  };
}

const GK_WEEKS: ProgramWeek[] = [
  { week: 1, objectiveKey: 'program.gk.w1', categories: ['Goalkeeper'], skillFocus: ['shotReading', 'positioning'], difficulty: 'Beginner', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 2, objectiveKey: 'program.gk.w2', categories: ['Goalkeeper', 'Decision Making'], skillFocus: ['blockCooperation', 'sevenMetre'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 3, objectiveKey: 'program.gk.w3', categories: ['Goalkeeper', 'Defence'], skillFocus: ['positioning', 'blockCooperation'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 7, isCheckpoint: true },
  { week: 4, objectiveKey: 'program.gk.w4', categories: ['Goalkeeper', 'Fast Break'], skillFocus: ['fastBreakStart'], difficulty: 'Advanced', sessionsPerWeek: 4, scenariosPerSession: 7 },
  { week: 5, objectiveKey: 'program.gk.w5', categories: ['Goalkeeper', 'Match Ending'], skillFocus: ['pressureControl', 'sevenMetre'], difficulty: 'Advanced', sessionsPerWeek: 5, scenariosPerSession: 8 },
  { week: 6, objectiveKey: 'program.gk.w6', categories: ['Goalkeeper', 'Match Ending', 'Decision Making'], skillFocus: ['pressureControl', 'shotReading'], difficulty: 'Expert', sessionsPerWeek: 5, scenariosPerSession: 8 },
];

const WING_WEEKS: ProgramWeek[] = [
  { week: 1, objectiveKey: 'program.wing.w1', categories: ['Left Wing', 'Right Wing'], skillFocus: ['angleSelection', 'finishingVariation'], difficulty: 'Beginner', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 2, objectiveKey: 'program.wing.w2', categories: ['Left Wing', 'Right Wing', 'Fast Break'], skillFocus: ['fastBreakTiming'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 3, objectiveKey: 'program.wing.w3', categories: ['Left Wing', 'Right Wing', 'Decision Making'], skillFocus: ['goalkeeperReading'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 7, isCheckpoint: true },
  { week: 4, objectiveKey: 'program.wing.w4', categories: ['Left Wing', 'Right Wing', 'Defence'], skillFocus: ['defensiveTransition'], difficulty: 'Advanced', sessionsPerWeek: 4, scenariosPerSession: 7 },
  { week: 5, objectiveKey: 'program.wing.w5', categories: ['Left Wing', 'Right Wing', 'Decision Making'], skillFocus: ['finishingVariation', 'goalkeeperReading'], difficulty: 'Advanced', sessionsPerWeek: 5, scenariosPerSession: 8 },
  { week: 6, objectiveKey: 'program.wing.w6', categories: ['Left Wing', 'Right Wing', 'Match Ending'], skillFocus: ['pressureFinishing'], difficulty: 'Expert', sessionsPerWeek: 5, scenariosPerSession: 8 },
];

const BACK_WEEKS: ProgramWeek[] = [
  { week: 1, objectiveKey: 'program.back.w1', categories: ['Left Back', 'Centre Back', 'Right Back'], skillFocus: ['gameReading', 'passing'], difficulty: 'Beginner', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 2, objectiveKey: 'program.back.w2', categories: ['Left Back', 'Centre Back', 'Right Back', 'Decision Making'], skillFocus: ['breakthrough', 'shotSelection'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 3, objectiveKey: 'program.back.w3', categories: ['Left Back', 'Centre Back', 'Right Back', 'Defence'], skillFocus: ['defensiveReading'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 7, isCheckpoint: true },
  { week: 4, objectiveKey: 'program.back.w4', categories: ['Left Back', 'Centre Back', 'Right Back', 'Power Play'], skillFocus: ['breakthrough', 'passing'], difficulty: 'Advanced', sessionsPerWeek: 4, scenariosPerSession: 7 },
  { week: 5, objectiveKey: 'program.back.w5', categories: ['Decision Making', 'Defence'], skillFocus: ['defensiveReading', 'gameReading'], difficulty: 'Advanced', sessionsPerWeek: 5, scenariosPerSession: 8 },
  { week: 6, objectiveKey: 'program.back.w6', categories: ['Match Ending', 'Decision Making'], skillFocus: ['pressureDecisions'], difficulty: 'Expert', sessionsPerWeek: 5, scenariosPerSession: 8 },
];

const PIVOT_WEEKS: ProgramWeek[] = [
  { week: 1, objectiveKey: 'program.pivot.w1', categories: ['Pivot'], skillFocus: ['positioning', 'screening'], difficulty: 'Beginner', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 2, objectiveKey: 'program.pivot.w2', categories: ['Pivot', 'Decision Making'], skillFocus: ['timing', 'decisionMaking'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 3, objectiveKey: 'program.pivot.w3', categories: ['Pivot', 'Defence'], skillFocus: ['spaceCreation'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 7, isCheckpoint: true },
  { week: 4, objectiveKey: 'program.pivot.w4', categories: ['Pivot', 'Power Play'], skillFocus: ['receivingUnderContact', 'screening'], difficulty: 'Advanced', sessionsPerWeek: 4, scenariosPerSession: 7 },
  { week: 5, objectiveKey: 'program.pivot.w5', categories: ['Pivot', 'Decision Making'], skillFocus: ['decisionMaking', 'timing'], difficulty: 'Advanced', sessionsPerWeek: 5, scenariosPerSession: 8 },
  { week: 6, objectiveKey: 'program.pivot.w6', categories: ['Pivot', 'Match Ending'], skillFocus: ['receivingUnderContact', 'decisionMaking'], difficulty: 'Expert', sessionsPerWeek: 5, scenariosPerSession: 8 },
];

const DEFENCE_WEEKS: ProgramWeek[] = [
  { week: 1, objectiveKey: 'program.def.w1', categories: ['Defence'], skillFocus: ['defensiveReading'], difficulty: 'Beginner', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 2, objectiveKey: 'program.def.w2', categories: ['Defence', 'Decision Making'], skillFocus: ['defensiveReading', 'gameReading'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 3, objectiveKey: 'program.def.w3', categories: ['Defence', 'Short Handed'], skillFocus: ['pressureDecisions'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 7, isCheckpoint: true },
  { week: 4, objectiveKey: 'program.def.w4', categories: ['Defence', 'Fast Break'], skillFocus: ['defensiveTransition', 'fastBreakTiming'], difficulty: 'Advanced', sessionsPerWeek: 4, scenariosPerSession: 7 },
  { week: 5, objectiveKey: 'program.def.w5', categories: ['Defence', 'Match Ending'], skillFocus: ['pressureDecisions'], difficulty: 'Advanced', sessionsPerWeek: 5, scenariosPerSession: 8 },
  { week: 6, objectiveKey: 'program.def.w6', categories: ['Defence', 'Decision Making', 'Match Ending'], skillFocus: ['defensiveReading', 'pressureDecisions'], difficulty: 'Expert', sessionsPerWeek: 5, scenariosPerSession: 8 },
];

const FB_WEEKS: ProgramWeek[] = [
  { week: 1, objectiveKey: 'program.fb.w1', categories: ['Fast Break'], skillFocus: ['fastBreakTiming', 'fastBreakStart'], difficulty: 'Beginner', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 2, objectiveKey: 'program.fb.w2', categories: ['Fast Break', 'Decision Making'], skillFocus: ['fastBreakTiming', 'decisionMaking'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 3, objectiveKey: 'program.fb.w3', categories: ['Fast Break', 'Defence'], skillFocus: ['defensiveTransition'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 7, isCheckpoint: true },
  { week: 4, objectiveKey: 'program.fb.w4', categories: ['Fast Break', 'Left Wing', 'Right Wing'], skillFocus: ['finishingVariation', 'fastBreakTiming'], difficulty: 'Advanced', sessionsPerWeek: 4, scenariosPerSession: 7 },
  { week: 5, objectiveKey: 'program.fb.w5', categories: ['Fast Break', 'Match Ending'], skillFocus: ['pressureFinishing'], difficulty: 'Advanced', sessionsPerWeek: 5, scenariosPerSession: 8 },
  { week: 6, objectiveKey: 'program.fb.w6', categories: ['Fast Break', 'Decision Making', 'Match Ending'], skillFocus: ['pressureFinishing', 'fastBreakTiming'], difficulty: 'Expert', sessionsPerWeek: 5, scenariosPerSession: 8 },
];

const PRESSURE_WEEKS: ProgramWeek[] = [
  { week: 1, objectiveKey: 'program.pressure.w1', categories: ['Match Ending', 'Decision Making'], skillFocus: ['pressureDecisions', 'pressureControl'], difficulty: 'Beginner', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 2, objectiveKey: 'program.pressure.w2', categories: ['Match Ending'], skillFocus: ['pressureFinishing', 'sevenMetre'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 6 },
  { week: 3, objectiveKey: 'program.pressure.w3', categories: ['Match Ending', 'Decision Making'], skillFocus: ['pressureDecisions'], difficulty: 'Intermediate', sessionsPerWeek: 4, scenariosPerSession: 7, isCheckpoint: true },
  { week: 4, objectiveKey: 'program.pressure.w4', categories: ['Match Ending', 'Power Play'], skillFocus: ['pressureDecisions', 'shotSelection'], difficulty: 'Advanced', sessionsPerWeek: 4, scenariosPerSession: 7 },
  { week: 5, objectiveKey: 'program.pressure.w5', categories: ['Match Ending', 'Short Handed'], skillFocus: ['pressureControl', 'defensiveReading'], difficulty: 'Advanced', sessionsPerWeek: 5, scenariosPerSession: 8 },
  { week: 6, objectiveKey: 'program.pressure.w6', categories: ['Match Ending', 'Decision Making'], skillFocus: ['pressureDecisions', 'pressureControl'], difficulty: 'Expert', sessionsPerWeek: 5, scenariosPerSession: 8 },
];

export const DEVELOPMENT_PROGRAMS: DevelopmentProgramDef[] = [
  {
    id: 'goalkeeper_iq',
    titleKey: 'program.goalkeeper_iq.title',
    summaryKey: 'program.goalkeeper_iq.summary',
    durationWeeks: 6,
    eligiblePositions: ['Goalkeeper'],
    goalTags: ['Decision Making', 'Mental Preparation', 'Match Preparation', 'Defence'],
    weeks: GK_WEEKS,
    finalAssessment: { scenarioCount: 12, categories: ['Goalkeeper', 'Match Ending'], targetAccuracy: 75 },
  },
  {
    id: 'wing_finishing',
    titleKey: 'program.wing_finishing.title',
    summaryKey: 'program.wing_finishing.summary',
    durationWeeks: 6,
    eligiblePositions: ['Left Wing', 'Right Wing'],
    goalTags: ['Attack', 'Decision Making', 'Game Intelligence'],
    weeks: WING_WEEKS,
    finalAssessment: { scenarioCount: 12, categories: ['Left Wing', 'Right Wing', 'Fast Break'], targetAccuracy: 75 },
  },
  {
    id: 'backcourt_vision',
    titleKey: 'program.backcourt_vision.title',
    summaryKey: 'program.backcourt_vision.summary',
    durationWeeks: 6,
    eligiblePositions: ['Left Back', 'Centre Back', 'Right Back'],
    goalTags: ['Attack', 'Game Intelligence', 'Decision Making'],
    weeks: BACK_WEEKS,
    finalAssessment: { scenarioCount: 12, categories: ['Left Back', 'Centre Back', 'Right Back'], targetAccuracy: 75 },
  },
  {
    id: 'pivot_intelligence',
    titleKey: 'program.pivot_intelligence.title',
    summaryKey: 'program.pivot_intelligence.summary',
    durationWeeks: 6,
    eligiblePositions: ['Pivot'],
    goalTags: ['Attack', 'Decision Making', 'Game Intelligence'],
    weeks: PIVOT_WEEKS,
    finalAssessment: { scenarioCount: 12, categories: ['Pivot', 'Decision Making'], targetAccuracy: 75 },
  },
  {
    id: 'defensive_specialist',
    titleKey: 'program.defensive_specialist.title',
    summaryKey: 'program.defensive_specialist.summary',
    durationWeeks: 6,
    eligiblePositions: ['Left Back', 'Centre Back', 'Right Back', 'Pivot', 'Left Wing', 'Right Wing'],
    goalTags: ['Defence', 'Game Intelligence'],
    weeks: DEFENCE_WEEKS,
    finalAssessment: { scenarioCount: 12, categories: ['Defence'], targetAccuracy: 75 },
  },
  {
    id: 'fast_break_mastery',
    titleKey: 'program.fast_break_mastery.title',
    summaryKey: 'program.fast_break_mastery.summary',
    durationWeeks: 6,
    eligiblePositions: ['Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot'],
    goalTags: ['Attack', 'Game Intelligence'],
    weeks: FB_WEEKS,
    finalAssessment: { scenarioCount: 12, categories: ['Fast Break'], targetAccuracy: 75 },
  },
  {
    id: 'pressure_decisions',
    titleKey: 'program.pressure_decisions.title',
    summaryKey: 'program.pressure_decisions.summary',
    durationWeeks: 6,
    eligiblePositions: ['Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot'],
    goalTags: ['Mental Preparation', 'Match Preparation', 'Decision Making'],
    weeks: PRESSURE_WEEKS,
    finalAssessment: { scenarioCount: 12, categories: ['Match Ending', 'Decision Making'], targetAccuracy: 80 },
  },
];

export function getProgramDef(id: ProgramId | string): DevelopmentProgramDef | undefined {
  return DEVELOPMENT_PROGRAMS.find((p) => p.id === id);
}

/** Core recommended program for a position — never cross-assigns incompatible cores */
export function getCoreProgramForPosition(position: HandballPosition): DevelopmentProgramDef {
  switch (position) {
    case 'Goalkeeper':
      return getProgramDef('goalkeeper_iq')!;
    case 'Left Wing':
    case 'Right Wing':
      return getProgramDef('wing_finishing')!;
    case 'Left Back':
    case 'Centre Back':
    case 'Right Back':
      return getProgramDef('backcourt_vision')!;
    case 'Pivot':
      return getProgramDef('pivot_intelligence')!;
    default:
      return getProgramDef('pressure_decisions')!;
  }
}

export function getEligiblePrograms(position: HandballPosition): DevelopmentProgramDef[] {
  return DEVELOPMENT_PROGRAMS.filter((p) => p.eligiblePositions.includes(position));
}

export function isProgramEligible(programId: ProgramId | string, position: HandballPosition): boolean {
  const def = getProgramDef(programId);
  return !!def && def.eligiblePositions.includes(position);
}

/** Rank eligible programs for recommendation (core first, then goal match, then secondary) */
export function recommendPrograms(
  position: HandballPosition,
  developmentGoal: string | string[] | null | undefined,
  weakestCategory?: string | null,
): DevelopmentProgramDef[] {
  const core = getCoreProgramForPosition(position);
  const eligible = getEligiblePrograms(position);
  const goals = (Array.isArray(developmentGoal) ? developmentGoal : developmentGoal ? [developmentGoal] : []) as PlayerGoalId[];

  return [...eligible].sort((a, b) => {
    const score = (p: DevelopmentProgramDef) => {
      let s = 0;
      if (p.id === core.id) s += 100;
      s += goals.filter((goal) => p.goalTags.includes(goal)).length * 40;
      if (weakestCategory && p.weeks.some((w) => w.categories.includes(weakestCategory as ScenarioCategory))) s += 25;
      if (p.id === 'defensive_specialist' && goals.includes('Defence')) s += 30;
      if (p.id === 'fast_break_mastery' && goals.some((goal) => goal === 'Attack' || goal === 'Game Intelligence')) s += 15;
      if (p.id === 'pressure_decisions' && goals.some((goal) => goal === 'Mental Preparation' || goal === 'Match Preparation')) s += 20;
      return s;
    };
    return score(b) - score(a);
  });
}
