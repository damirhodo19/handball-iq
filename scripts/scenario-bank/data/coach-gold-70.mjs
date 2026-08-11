import { COACH_GOLD_PILOT_14 } from './coach-gold-pilot-14.mjs';
import { COACH_GOLD_BATCH_A_14 } from './coach-gold-batch-a-14.mjs';
import { COACH_GOLD_BATCH_B_14 } from './coach-gold-batch-b-14.mjs';
import { COACH_GOLD_BATCH_C_14 } from './coach-gold-batch-c-14.mjs';
import { COACH_GOLD_FINAL_14 } from './coach-gold-final-14.mjs';

export const COACH_GOLD_70 = Object.freeze([
  ...COACH_GOLD_PILOT_14,
  ...COACH_GOLD_BATCH_A_14,
  ...COACH_GOLD_BATCH_B_14,
  ...COACH_GOLD_BATCH_C_14,
  ...COACH_GOLD_FINAL_14,
].sort((a, b) => a.id.localeCompare(b.id)));
