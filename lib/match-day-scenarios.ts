import type { HandballPosition } from '@/lib/positions';
import { getMatchDayReminders } from '@/lib/positions';
import { buildMatchDayTactics, type TacticalScenario } from '@/lib/match-day-tactics';

export type { TacticalScenario };

export interface VisualizationStep {
  title: string;
  instruction: string;
}

/** Goalkeeper-specific visualization (kept for GK profiles only). */
const GK_VISUALIZATION_STEPS: VisualizationStep[] = [
  {
    title: 'First Attack',
    instruction:
      'Imagine the first opponent attack of the match. You are balanced, calm and watching the shooter\'s body before moving. You read the release point and react with a clean save. Feel the confidence of that moment.',
  },
  {
    title: 'After Conceding',
    instruction:
      'Imagine conceding a goal. You immediately reset — take one breath, communicate clearly with your defence and prepare your position for the next attack. The goal is gone. Your focus is entirely on the next action.',
  },
  {
    title: 'Decisive Save',
    instruction:
      'Imagine a decisive save late in the second half. The match is tight. You are patient, your positioning is strong, and you commit only after reading the shooter\'s final arm position. You make the save. Focus on the process, not the result.',
  },
];

const FIELD_VISUALIZATION_STEPS: VisualizationStep[] = [
  {
    title: 'First Possession',
    instruction:
      'Imagine receiving the ball in the first organised attack. Scan the defence, choose your space, and commit to the highest-percentage decision for your position. Feel calm control before the action.',
  },
  {
    title: 'After a Mistake',
    instruction:
      'Imagine a turnover or missed chance. Reset immediately — one breath, clear communication, and the next defensive or attacking action. The previous play is gone. Your focus is entirely forward.',
  },
  {
    title: 'Decisive Moment',
    instruction:
      'Imagine a late, tight scoreline with the ball in your area of responsibility. Read the situation, trust your preparation, and execute the best available decision under pressure.',
  },
];

/** @deprecated Prefer getVisualizationStepsForPosition */
export const VISUALIZATION_STEPS = GK_VISUALIZATION_STEPS;

export function getVisualizationStepsForPosition(
  position: HandballPosition | null | undefined,
): VisualizationStep[] {
  if (position === 'Goalkeeper') return GK_VISUALIZATION_STEPS;
  const reminders = getMatchDayReminders(position);
  if (reminders.length >= 3) {
    return [
      { title: 'Focus Cue 1', instruction: reminders[0] },
      { title: 'Focus Cue 2', instruction: reminders[1] },
      { title: 'Focus Cue 3', instruction: reminders[2] },
    ];
  }
  return FIELD_VISUALIZATION_STEPS;
}

/**
 * Build tactical scenarios for selected Match Day goals and player position.
 * Never substitutes Goalkeeper content for field players.
 */
export function getScenariosForGoals(
  goals: string[],
  count: number,
  position?: HandballPosition | null,
  extras?: {
    developmentGoal?: string | string[] | null;
    playingLevel?: string | null;
    dominantHand?: string | null;
    opponent?: string | null;
    weakSkills?: string[];
  },
): TacticalScenario[] {
  if (!position) return [];
  return buildMatchDayTactics({
    position,
    goals,
    count,
    developmentGoal: extras?.developmentGoal,
    playingLevel: extras?.playingLevel,
    dominantHand: extras?.dominantHand,
    opponent: extras?.opponent,
    weakSkills: extras?.weakSkills,
  });
}
