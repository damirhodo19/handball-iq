import { PIVOT_GOLD_BATCH_C1_8 } from './pivot-gold-batch-c1-8.mjs';
import { PIVOT_GOLD_BATCH_C2_7 } from './pivot-gold-batch-c2-7.mjs';

export const PIVOT_GOLD_BATCH_C_15 = [...PIVOT_GOLD_BATCH_C1_8, ...PIVOT_GOLD_BATCH_C2_7];
if (PIVOT_GOLD_BATCH_C_15.length !== 15) throw new Error('Pivot Batch C must contain 15');
