#!/usr/bin/env node
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COACH_GOLD_70 } from './scenario-bank/data/coach-gold-70.mjs';
import { validateCoachGoldSource } from './scenario-bank/validate-coach-gold-source.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const report = validateCoachGoldSource({
  root,
  scenarios: COACH_GOLD_70,
  expectedCount: 70,
  expectedPerCategory: 10,
  readyStatus: 'COACH GOLD SOURCE 70 READY FOR HUMAN COACH REVIEW',
  reportPath: 'scripts/coach-gold-full-source-validation.json',
});

console.log(JSON.stringify({
  status: report.status,
  sourceCount: report.sourceCount,
  familyCount: report.familyCount,
  categories: report.coverage.categories,
  difficulty: report.coverage.difficulty,
  semanticRisks: report.semanticRisks.length,
  lockedPlayerBanksStable: Object.values(report.lockedPlayerBanks.originalGold).every(({ ok }) => ok) && report.lockedPlayerBanks.pivot.ok && report.lockedPlayerBanks.goalkeeper.ok,
  activeCoachRuntimeStable: Object.values(report.activeCoachRuntimeStable).every(({ ok }) => ok),
  errors: report.errors.length,
  warnings: report.warnings.length,
}, null, 2));
if (report.errors.length) process.exit(1);
