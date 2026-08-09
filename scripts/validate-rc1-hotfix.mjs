#!/usr/bin/env node
/**
 * Beta RC1 hotfix — regression probes for confirmed blockers.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
let failed = 0;

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL  ${msg}`);
    failed++;
  } else {
    console.log(`  ✓ ${msg}`);
  }
}

console.log('\n=== RC1 Hotfix Validation ===\n');

console.log('=== Activity idempotency ===');
const engine = read('lib/development/engine.ts');
assert(engine.includes('hasProcessedActivity'), 'processActivity gates on hasProcessedActivity');
assert(engine.includes('processedActivityIds'), 'marks processedActivityIds');
assert(!engine.includes('markDailyChallengeComplete'), 'daily challenge not clobbered via separate markComplete');
assert(/dailyChallenge\.completed = true/.test(engine), 'sets completed on same state object');

console.log('\n=== Sign-out isolation ===');
assert(read('hooks/useSignOut.ts').includes('clearUserScopedLocalData'), 'useSignOut clears user data');
assert(read('context/AuthContext.tsx').includes('clearUserScopedLocalData'), 'Auth signOut clears user data');
assert(read('lib/clear-user-local.ts').includes('hbiq_development'), 'clear list includes development');
assert(read('context/AuthContext.tsx').includes('bindDataOwner'), 'login binds data owner');

console.log('\n=== player_coach + onboarding_version ===');
const onboarding = read('app/(auth)/onboarding.tsx');
assert(!/role === 'coach' \? 'coach' : 'player'/.test(onboarding), 'no player_coach collapse');
assert(/onboarding_version:\s*2/.test(onboarding), 'writes onboarding_version: 2');
assert(/const dbRole = role/.test(onboarding), 'dbRole preserves selected role');
assert(
  read('services/preferencesService.ts').includes('Math.max(') &&
    read('services/preferencesService.ts').includes('onboarding_version'),
  'pull never downgrades onboarding version',
);

console.log('\n=== Coach double credit ===');
const challenge = read('app/coach-tools/challenge.tsx');
assert(/att_\$\{challenge\.id\}_\$\{day\}/.test(challenge), 'stable challenge attempt id');
assert(/if \(confirmed/.test(challenge), 'UI confirmed guard');
assert(read('lib/coach-platform/storage.ts').includes('a.id === attempt.id'), 'storage idempotent');
assert(read('lib/coach-platform/training-planner.ts').includes('stablePlanId'), 'stable plan ids');
assert(read('lib/coach-platform/match-analysis.ts').includes('stableAnalysisId'), 'stable analysis ids');

console.log('\n=== Offline queue ===');
assert(
  read('app/session/results.tsx').includes('persistOrQueue') &&
    read('app/match/report.tsx').includes('persistOrQueue'),
  'session/match use persistOrQueue',
);
assert(read('services/syncService.ts').includes('setSyncUiStatus'), 'sync UI status helpers');

console.log('\n=== Match streak + deferred cloud ===');
const storage = read('lib/storage.ts');
const matchFn = storage.slice(storage.indexOf('export function saveMatchRecord'));
assert(matchFn.includes('updateStreak'), 'saveMatchRecord updates streak');
assert(read('app/match/report.tsx').includes('cloudSavedKeyRef'), 'match cloud save deferred by key');

console.log('\n=== Program paused lifecycle ===');
const prog = read('lib/development/program-progress.ts');
assert(prog.includes('pauseActiveProgram') && prog.includes("status: 'paused'"), 'pause path sets paused');
assert(!/completedPrograms\.push\(\{ \.\.\.state\.activeProgram \}\)/.test(prog), 'no pause→completed push');
assert(read('app/programs/index.tsx').includes('sprint5.programs.paused'), 'UI shows paused section');

console.log('\n=== Position metrics ===');
assert(
  read('lib/scenario-bank/index.ts').includes('getPositionModule') &&
    !read('lib/scenario-bank/index.ts').includes("Patience', 'Reading the Shooter'"),
  'toGKScenario uses position skills',
);

console.log('\n=== Programs i18n ===');
assert(read('app/programs/index.tsx').includes('difficultyLabel'), 'localized difficulty');
assert(read('app/programs/index.tsx').includes('goalLabel'), 'localized goal filters');
assert(read('locales/sprint5-messages.ts').includes('sprint5.goal.defence'), 'goal locale keys');

console.log('\n=== Player post-hydrate push ===');
assert(
  read('context/AuthContext.tsx').includes('syncDevelopmentFull') &&
    read('context/AuthContext.tsx').includes('syncCoachDevelopmentFull'),
  'player + coach sync after hydrate',
);

console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'} — ${failed} failure(s)\n`);
process.exit(failed === 0 ? 0 : 1);
