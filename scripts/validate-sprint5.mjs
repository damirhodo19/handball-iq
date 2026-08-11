/**
 * Sprint 5 integrity validation.
 * Run: node scripts/validate-sprint5.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const issues = [];
let passed = 0;

function assert(name, cond, detail = '') {
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    issues.push(`${name}${detail ? `: ${detail}` : ''}`);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

console.log('\n=== Sprint 5 matrix ===');
{
  const mod = readFileSync(join(root, 'lib/platform/position-modules.ts'), 'utf8');
  assert('GK sevenMetre skill', mod.includes("'sevenMetre'"));
  assert('Wing pressureFinishing', mod.includes("'pressureFinishing'"));
  assert('Back defensiveReading', mod.includes("'defensiveReading'"));
  assert('Pivot receivingUnderContact', mod.includes("'receivingUnderContact'"));
  assert('inferScenarioSkills helper', mod.includes('inferScenarioSkills'));
}

console.log('\n=== Load management ===');
{
  const load = readFileSync(join(root, 'lib/development/load.ts'), 'utf8');
  assert('load module exists', existsSync(join(root, 'lib/development/load.ts')));
  assert('short_review length', load.includes('short_review'));
  assert('no health-advice framing', !/injury|rehab|fatigue syndrome|doctor|diagnosis/i.test(load));
  assert('focus signature anti-loop', load.includes('buildFocusSignature'));
}

console.log('\n=== Programs ===');
{
  const prog = readFileSync(join(root, 'lib/development/programs.ts'), 'utf8');
  const weeks = [...prog.matchAll(/isCheckpoint:\s*true/g)];
  assert('mid-program checkpoints present', weeks.length >= 6, `found ${weeks.length}`);
  assert('skillFocus on weeks', prog.includes('skillFocus'));
  assert('programs UI index', existsSync(join(root, 'app/programs/index.tsx')));
  assert('program detail', existsSync(join(root, 'app/programs/[id].tsx')));
  assert('completion report', existsSync(join(root, 'app/programs/complete.tsx')));
  const progress = readFileSync(join(root, 'lib/development/program-progress.ts'), 'utf8');
  assert('starting IQ snapshot', progress.includes('startingOverallIq'));
  assert('completion report builder', progress.includes('buildProgramCompletionReport'));
}

console.log('\n=== Stats / weakness skills ===');
{
  const stats = readFileSync(join(root, 'lib/development/statistics.ts'), 'utf8');
  const weak = readFileSync(join(root, 'lib/development/weakness.ts'), 'utf8');
  assert('bySkill stats', stats.includes('bySkill'));
  assert('weakSkills', weak.includes('weakSkills'));
}

console.log('\n=== Coach depth ===');
{
  const ch = readFileSync(join(root, 'lib/coach-platform/challenges.ts'), 'utf8');
  const gold = JSON.parse(readFileSync(join(root, 'lib/coach-platform/challenges-gold.json'), 'utf8'));
  const tracks = readFileSync(join(root, 'lib/coach-platform/tracks.ts'), 'utf8');
  assert('Gold 70 challenges', gold.length === 70, `found ${gold.length}`);
  assert('youth tagged challenges', gold.some((challenge) => challenge.coachTypeTags.includes('Youth Coach')));
  assert('gk coach tagged', gold.some((challenge) => challenge.coachTypeTags.includes('Goalkeeper Coach')));
  assert('track finalAssessment', tracks.includes('finalAssessment'));
  assert('legacy Coach not merged', ch.includes('challenges-gold.json') && !ch.includes('COACH_CHALLENGES_EXTRA'));
}

console.log('\n=== Locales ===');
{
  assert('sprint5 messages', existsSync(join(root, 'locales/sprint5-messages.ts')));
  const en = readFileSync(join(root, 'locales/en.ts'), 'utf8');
  assert('en wires sprint5', en.includes('sprint5MessagesEn'));
}

console.log('\n=== Content quality tooling ===');
{
  assert('quality audit script', existsSync(join(root, 'scripts/scenario-quality-audit.mjs')));
}

console.log(`\n${passed} assertions`);
if (issues.length) {
  console.error('\nFAILURES:');
  for (const i of issues) console.error(' -', i);
  process.exit(1);
}
console.log('PASS');
