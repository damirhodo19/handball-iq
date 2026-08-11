#!/usr/bin/env node
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_28 } from './scenario-bank/data/coach-gold-28.mjs';
import { validateCoachGoldSource } from './scenario-bank/validate-coach-gold-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const report = validateCoachGoldSource({
  root,
  scenarios: COACH_GOLD_28,
  expectedCount: 28,
  expectedPerCategory: 4,
  readyStatus: 'COACH GOLD SOURCE 28 READY FOR HUMAN COACH REVIEW',
  reportPath: 'scripts/coach-gold-batch-a-validation.json',
});
console.log(JSON.stringify({
  status: report.status,
  sourceCount: report.sourceCount,
  fullTarget: report.fullTarget,
  familyCount: report.familyCount,
  categories: report.coverage.categories,
  semanticRisks: report.semanticRisks.length,
  lockedPlayerBanksStable: Object.values(report.lockedPlayerBanks.originalGold).every(({ ok }) => ok) && report.lockedPlayerBanks.pivot.ok && report.lockedPlayerBanks.goalkeeper.ok,
  activeCoachRuntimeStable: Object.values(report.activeCoachRuntimeStable).every(({ ok }) => ok),
  errors: report.errors.length,
  warnings: report.warnings.length,
}, null, 2));
if (report.errors.length) process.exit(1);
