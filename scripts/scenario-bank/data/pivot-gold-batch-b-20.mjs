import { PIVOT_GOLD_BATCH_B1_10 } from './pivot-gold-batch-b1-10.mjs';
import { PIVOT_GOLD_BATCH_B2_10 } from './pivot-gold-batch-b2-10.mjs';

export const PIVOT_GOLD_BATCH_B_20 = [
  ...PIVOT_GOLD_BATCH_B1_10,
  ...PIVOT_GOLD_BATCH_B2_10,
];

if (PIVOT_GOLD_BATCH_B_20.length !== 20) throw new Error('Pivot Batch B must contain 20');
