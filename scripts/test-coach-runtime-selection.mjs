#!/usr/bin/env node
/** Non-mutating selection and stale-ID proof for the Coach Gold runtime. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const runtime = JSON.parse(readFileSync(join(root, 'lib/coach-platform/challenges-gold.json'), 'utf8'));
const backup = JSON.parse(readFileSync(join(root, 'scripts/coach-legacy-cleanup-backup.json'), 'utf8'));
const resolverText = readFileSync(join(root, 'lib/coach-platform/coach-resolver.ts'), 'utf8');
const storageText = readFileSync(join(root, 'lib/coach-platform/storage.ts'), 'utf8');
const legacyIds = new Set(backup.uniqueIds);
const byId = new Map(runtime.map((scenario) => [scenario.id, scenario]));
const errors = [];

const goalCategories = (goal) => {
  const value = goal.toLowerCase();
  if (value.includes('match') || value.includes('analysis')) return ['opponent_analysis', 'defensive_adjustment'];
  if (value.includes('tactic')) return ['timeout', 'defensive_adjustment', 'opponent_analysis'];
  if (value.includes('player')) return ['player_development', 'leadership'];
  if (value.includes('training')) return ['training_plan'];
  if (value.includes('leadership')) return ['leadership', 'timeout'];
  return null;
};
const eligible = (profile) => {
  let pool = runtime.filter((scenario) => scenario.coachTypeTags.includes(profile.coachType));
  const experience = pool.filter((scenario) => scenario.experienceTags.includes(profile.experienceBand));
  if (experience.length) pool = experience;
  const categories = goalCategories(profile.developmentGoal);
  if (categories) {
    const focused = pool.filter((scenario) => categories.includes(scenario.category));
    if (focused.length) pool = focused;
  }
  return pool;
};
const seededPick = (pool, seed) => {
  const key = createHash('sha1').update(seed).digest('hex');
  return pool[Number.parseInt(key.slice(0, 8), 16) % pool.length];
};

const coachTypes = ['Youth Coach', 'Senior Coach', 'Professional Coach', 'Goalkeeper Coach', 'Assistant Coach', 'Head Coach'];
const experienceBands = ['0-2', '3-5', '6-10', '10+'];
const goals = ['Tactics', 'Match Analysis', 'Player Development', 'Training', 'Leadership'];
const profiles = coachTypes.flatMap((coachType) => experienceBands.flatMap((experienceBand) => goals.map((developmentGoal) => ({ coachType, experienceBand, developmentGoal }))));
const trials = [];
for (const profile of profiles) {
  const pool = eligible(profile);
  if (!pool.length) errors.push(`Empty pool: ${JSON.stringify(profile)}`);
  for (let trial = 0; trial < 10 && pool.length; trial += 1) {
    const picked = seededPick(pool, `${JSON.stringify(profile)}:${trial}`);
    if (!picked || legacyIds.has(picked.id) || !byId.has(picked.id)) errors.push(`Invalid pick: ${JSON.stringify(profile)}`);
    trials.push({ profile, trial, id: picked?.id });
  }
}

const staleRequested = backup.uniqueIds;
const staleResolved = staleRequested.map((id) => byId.get(id)).filter(Boolean);
if (staleResolved.length) errors.push('Legacy Coach IDs still resolve in active runtime');
if (!resolverText.includes("getCoachChallengeById(state.dailyChallengeId ?? '')")) errors.push('Resolver does not check stored daily Coach ID before reuse');
if (!resolverText.includes('setDailyCoachChallenge(picked.id, today, true)')) errors.push('Resolver does not force replacement of stale daily Coach ID');
if (!storageText.includes('force = false')) errors.push('Storage has no force option for stale Coach ID replacement');

const report = {
  status: errors.length ? 'FAIL' : 'PASS',
  coachCount: runtime.length,
  profileCombinations: profiles.length,
  trials: trials.length,
  emptyPools: errors.filter((error) => error.startsWith('Empty pool')).length,
  returnedLegacy: trials.some(({ id }) => legacyIds.has(id)),
  staleResolve: { requested: staleRequested, resolved: staleResolved.map(({ id }) => id), droppedLegacy: staleRequested.filter((id) => !byId.has(id)) },
  errors,
};
writeFileSync(join(root, 'scripts/coach-runtime-selection-test.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: report.status,
  coachCount: report.coachCount,
  profileCombinations: report.profileCombinations,
  trials: report.trials,
  returnedLegacy: report.returnedLegacy,
  staleLegacyDropped: report.staleResolve.droppedLegacy.length,
  errors,
}, null, 2));
if (errors.length) process.exit(1);
