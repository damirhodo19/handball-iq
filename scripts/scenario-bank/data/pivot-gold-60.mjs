import { PIVOT_GOLD_PILOT_10 } from './pivot-gold-pilot-10.mjs';
import { PIVOT_GOLD_BATCH_A_15 } from './pivot-gold-batch-a-15.mjs';
import { PIVOT_GOLD_BATCH_B_20 } from './pivot-gold-batch-b-20.mjs';
import { PIVOT_GOLD_BATCH_C_15 } from './pivot-gold-batch-c-15.mjs';

export const PIVOT_GOLD_60 = [
  ...PIVOT_GOLD_PILOT_10,
  ...PIVOT_GOLD_BATCH_A_15,
  ...PIVOT_GOLD_BATCH_B_20,
  ...PIVOT_GOLD_BATCH_C_15,
];

if (PIVOT_GOLD_60.length !== 60) throw new Error('Pivot Gold source must contain 60 scenarios');
