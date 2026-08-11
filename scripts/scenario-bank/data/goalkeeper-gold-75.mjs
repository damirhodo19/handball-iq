import { GOALKEEPER_GOLD_PILOT_10 } from './goalkeeper-gold-pilot-10.mjs';
import { GOALKEEPER_GOLD_BATCH_A_15 } from './goalkeeper-gold-batch-a-15.mjs';
import { GOALKEEPER_GOLD_BATCH_B1_10 } from './goalkeeper-gold-batch-b1-5.mjs';
import { GOALKEEPER_GOLD_BATCH_C_15 } from './goalkeeper-gold-batch-c-15.mjs';
import { GOALKEEPER_GOLD_BATCH_D_15 } from './goalkeeper-gold-batch-d-15.mjs';
import { GOALKEEPER_GOLD_BATCH_E_10 } from './goalkeeper-gold-batch-e-10.mjs';

export const GOALKEEPER_GOLD_75 = [
  ...GOALKEEPER_GOLD_PILOT_10,
  ...GOALKEEPER_GOLD_BATCH_A_15,
  ...GOALKEEPER_GOLD_BATCH_B1_10,
  ...GOALKEEPER_GOLD_BATCH_C_15,
  ...GOALKEEPER_GOLD_BATCH_D_15,
  ...GOALKEEPER_GOLD_BATCH_E_10,
];

if (GOALKEEPER_GOLD_75.length !== 75) throw new Error('Goalkeeper Gold source must contain 75 scenarios');
