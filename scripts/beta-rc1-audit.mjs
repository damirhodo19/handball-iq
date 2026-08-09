#!/usr/bin/env node
/**
 * Beta RC1 audit — after hotfix: verifies blockers are closed.
 * Exit 0 = READY FOR CLOSED BETA (blockers clear).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const open = [];
function check(fixed, sev, id, title, evidence) {
  if (!fixed) open.push({ sev, id, title, evidence });
}

const engine = read('lib/development/engine.ts');
check(engine.includes('hasProcessedActivity') && engine.includes('processedActivityIds'), 'BLOCKER', 'RC-01', 'Activity side-effect idempotency', 'engine.ts');
check(
  read('app/session/results.tsx').includes('stableActivityId') &&
    read('app/session/results.tsx').includes('id: sourceId'),
  'BLOCKER',
  'RC-02',
  'Session results stable id',
  'results.tsx',
);
check(
  read('hooks/useSignOut.ts').includes('clearUserScopedLocalData') &&
    read('lib/clear-user-local.ts').includes('hbiq_development'),
  'BLOCKER',
  'RC-03',
  'Sign-out clears user progression',
  'clear-user-local.ts',
);
const onboarding = read('app/(auth)/onboarding.tsx');
check(
  /const dbRole = role/.test(onboarding) && /onboarding_version:\s*2/.test(onboarding),
  'BLOCKER',
  'RC-04/05',
  'player_coach + onboarding_version persistence',
  'onboarding.tsx',
);
check(
  /att_\$\{challenge\.id\}_\$\{day\}/.test(read('app/coach-tools/challenge.tsx')) &&
    read('lib/coach-platform/storage.ts').includes('a.id === attempt.id'),
  'BLOCKER',
  'RC-09',
  'Coach challenge stable id + guard',
  'challenge.tsx / storage.ts',
);
check(
  read('app/session/results.tsx').includes('persistOrQueue') &&
    read('services/syncService.ts').includes('addToOfflineQueue'),
  'MAJOR',
  'RC-08',
  'Offline queue wired',
  'syncService + results',
);
check(
  /dailyChallenge\.completed = true/.test(engine) && !engine.includes('markDailyChallengeComplete'),
  'MAJOR',
  'RC-07',
  'Daily challenge completion not clobbered',
  'engine.ts',
);
const matchSave = read('lib/storage.ts').slice(read('lib/storage.ts').indexOf('export function saveMatchRecord'));
check(matchSave.includes('updateStreak'), 'MAJOR', 'RC-11', 'Match advances streak', 'storage.ts');
check(
  read('lib/development/program-progress.ts').includes("status: 'paused'") &&
    read('app/programs/index.tsx').includes('sprint5.programs.paused'),
  'MAJOR',
  'RC-12',
  'Paused program lifecycle',
  'program-progress + UI',
);
check(
  read('lib/scenario-bank/index.ts').includes('getPositionModule') &&
    !read('lib/scenario-bank/index.ts').includes("Patience', 'Reading the Shooter'"),
  'MAJOR',
  'RC-13',
  'Position metric labels',
  'scenario-bank',
);
check(
  read('app/programs/index.tsx').includes('difficultyLabel') &&
    read('app/programs/index.tsx').includes('goalLabel'),
  'MAJOR',
  'RC-14',
  'Programs localization',
  'programs/index.tsx',
);
check(
  read('context/AuthContext.tsx').includes('syncDevelopmentFull') &&
    read('context/AuthContext.tsx').includes('syncCoachDevelopmentFull'),
  'MAJOR',
  'RC-18',
  'Player post-hydrate sync',
  'AuthContext',
);
check(
  read('app/(tabs)/home.tsx').includes('sprint5.sync.pending'),
  'MAJOR',
  'RC-17',
  'Sync status UI',
  'home.tsx',
);

// Residual (not hotfix blockers)
const residual = [];
if (/s\.category === focusCategory/.test(read('lib/development/daily-challenge.ts'))) {
  residual.push({
    sev: 'MAJOR',
    id: 'RC-06',
    title: 'Daily challenge category OR can still broaden pool (monitor in beta)',
    evidence: 'daily-challenge.ts — not a closed-beta blocker if Universal content is acceptable',
  });
}

const blockers = open.filter((f) => f.sev === 'BLOCKER');
const majors = open.filter((f) => f.sev === 'MAJOR');
const verdict = blockers.length === 0 ? 'READY FOR CLOSED BETA' : 'NO-GO';

const report = {
  name: 'Handball IQ 2.0 — Beta RC1 (post-hotfix)',
  date: new Date().toISOString(),
  verdict,
  open,
  residual,
  counts: { blockersOpen: blockers.length, majorsOpen: majors.length, residual: residual.length },
};

fs.writeFileSync(path.join(root, 'scripts/beta-rc1-report.json'), JSON.stringify(report, null, 2));

console.log(`\n=== ${report.name} ===`);
console.log(`VERDICT: ${verdict}`);
console.log(`Open blockers: ${blockers.length} · Open majors: ${majors.length} · Residual: ${residual.length}\n`);
for (const f of open) console.log(`[OPEN ${f.sev}] ${f.id} ${f.title}`);
for (const f of residual) console.log(`[RESIDUAL ${f.sev}] ${f.id} ${f.title}`);
if (open.length === 0) console.log('(all hotfix targets closed)');
console.log(`\nWrote scripts/beta-rc1-report.json`);
process.exit(blockers.length ? 1 : 0);
