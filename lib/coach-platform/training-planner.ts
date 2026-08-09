import type { TrainingBlock, TrainingFocus, TrainingPlan, TrainingPlanInput } from './types';
import { attackEngineHint, defenseEngineHint } from '@/lib/platform/tactical-systems';

function stablePlanId(input: TrainingPlanInput): string {
  const day = new Date().toISOString().slice(0, 10);
  const raw = [
    input.focus,
    input.durationMin,
    input.playerCount,
    input.ageLevel,
    input.objective,
    input.favoriteDefense,
    input.favoriteAttack,
    day,
  ].join('|');
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `tp_${(h >>> 0).toString(16)}`;
}

function focusSlug(focus: TrainingFocus): string {
  switch (focus) {
    case 'Decision Making':
      return 'decision';
    case 'Goalkeeper':
      return 'gk';
    default:
      return focus.toLowerCase();
  }
}

function splitDuration(total: number): number[] {
  const warm = Math.max(8, Math.round(total * 0.15));
  const cool = Math.max(7, Math.round(total * 0.12));
  const game = Math.max(12, Math.round(total * 0.22));
  const remaining = Math.max(20, total - warm - cool - game);
  const main1 = Math.round(remaining * 0.5);
  const main2 = remaining - main1;
  return [warm, main1, main2, game, cool];
}

export function generateTrainingPlan(input: TrainingPlanInput): TrainingPlan {
  const [warm, main1, main2, game, cool] = splitDuration(input.durationMin);
  const slug = focusSlug(input.focus);
  const defenceHint = defenseEngineHint(input.favoriteDefense);
  const attackHint = attackEngineHint(input.favoriteAttack);
  const baseParams = {
    n: input.playerCount,
    defence: defenceHint,
    attack: attackHint,
    objective: input.objective,
    level: input.ageLevel,
    focus: input.focus,
  };

  const blocks: TrainingBlock[] = [
    {
      id: 'warmup',
      titleKey: 'planner.block.warmup',
      durationMin: warm,
      objectiveKey: 'planner.obj.warmup',
      instructionsKey: 'planner.ins.warmup',
      coachingPointsKey: 'planner.cp.warmup',
      params: baseParams,
    },
    {
      id: 'main1',
      titleKey: `planner.block.${slug}.main1`,
      durationMin: main1,
      objectiveKey: `planner.obj.${slug}.main1`,
      instructionsKey: `planner.ins.${slug}.main1`,
      coachingPointsKey: `planner.cp.${slug}.main1`,
      params: baseParams,
    },
    {
      id: 'main2',
      titleKey: `planner.block.${slug}.main2`,
      durationMin: main2,
      objectiveKey: `planner.obj.${slug}.main2`,
      instructionsKey: `planner.ins.${slug}.main2`,
      coachingPointsKey: `planner.cp.${slug}.main2`,
      params: baseParams,
    },
    {
      id: 'game',
      titleKey: `planner.block.${slug}.game`,
      durationMin: game,
      objectiveKey: `planner.obj.${slug}.game`,
      instructionsKey: `planner.ins.${slug}.game`,
      coachingPointsKey: `planner.cp.${slug}.game`,
      params: baseParams,
    },
    {
      id: 'cooldown',
      titleKey: 'planner.block.cooldown',
      durationMin: cool,
      objectiveKey: 'planner.obj.cooldown',
      instructionsKey: 'planner.ins.cooldown',
      coachingPointsKey: 'planner.cp.cooldown',
      params: baseParams,
    },
  ];

  return {
    id: stablePlanId(input),
    createdAt: new Date().toISOString(),
    input,
    blocks,
  };
}

export const TRAINING_FOCUS_OPTIONS: TrainingFocus[] = [
  'Attack',
  'Defence',
  'Transition',
  'Technical',
  'Decision Making',
  'Physical',
  'Mental',
  'Goalkeeper',
];

export const AGE_LEVEL_OPTIONS = [
  'U14',
  'U16',
  'U18',
  'Senior',
  'Professional',
] as const;

export const DURATION_OPTIONS = [60, 75, 90, 105, 120] as const;
