/**
 * Runtime-style Match Day tactics + plan validation for all positions.
 * Exit 0 = PASS.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const scenarios = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

const POSITIONS = [
  'Goalkeeper',
  'Left Wing',
  'Right Wing',
  'Left Back',
  'Centre Back',
  'Right Back',
  'Pivot',
];

const GOALS = {
  Goalkeeper: ['Stay patient', 'Read the shooter'],
  'Centre Back': ['Control the tempo', 'Read the defence'],
  'Left Back': ['Shot selection', 'Playing with the pivot'],
  'Right Back': ['Shot selection', 'One-on-one decisions'],
  'Left Wing': ['Improve finishing', 'Fast break timing'],
  'Right Wing': ['Angle management', 'Pressure finishing'],
  Pivot: ['Finishing at six metres', 'Blocking decisions'],
};

const REMINDERS = {
  Goalkeeper: ['Stay patient before moving.', 'Use previous shots as information, not certainty.', 'Reset immediately after every action.'],
  'Left Back': ['Attack the space before choosing the final action.', "Read the defender's stance before committing to the drive.", 'Time the wing pass — do not force it into coverage.'],
  'Right Back': ['Attack the space before choosing the final action.', "Read the defender's stance before committing to the drive.", 'Time the wing pass — do not force it into coverage.'],
  'Centre Back': ['Scan the defence before receiving the ball.', 'Control the tempo — do not rush the first pass.', 'Communicate the attacking plan before each phase.'],
  'Left Wing': ['Time your cut with the backcourt tempo.', 'Attack the near post when the angle opens.', 'Sprint the first three steps on every fast break.'],
  'Right Wing': ['Time your cut with the backcourt tempo.', 'Attack the near post when the angle opens.', 'Sprint the first three steps on every fast break.'],
  Pivot: ['Seal early and ask for the ball in space.', 'Screen with purpose — create a clear lane.', 'Finish through contact when the gap appears.'],
};

const SPECIFIC = new Set(POSITIONS);

function isFor(s, pos) {
  if (s.primaryPosition === pos) return true;
  if (s.primaryPosition === 'All' || s.primaryPosition === 'Universal') {
    const sec = s.secondaryPositions ?? [];
    return sec.length === 0 || sec.includes(pos);
  }
  if (SPECIFIC.has(s.primaryPosition) && s.primaryPosition !== pos) return false;
  return (s.secondaryPositions ?? []).includes(pos);
}

function poolFor(pos) {
  return scenarios.filter((s) => {
    if (!isFor(s, pos)) return false;
    if (pos !== 'Goalkeeper' && s.primaryPosition === 'Goalkeeper') return false;
    return true;
  });
}

function buildTactics(goals, count, pos) {
  const pool = poolFor(pos);
  const keywords = goals.join(' ').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
  let filtered = pool.filter((s) =>
    keywords.some((k) => `${s.title.en} ${s.situation.en}`.toLowerCase().includes(k)),
  );
  if (filtered.length < count) {
    filtered = [
      ...filtered,
      ...pool.filter((s) => s.primaryPosition === pos),
      ...pool.filter((s) => s.primaryPosition === 'All' || s.primaryPosition === 'Universal'),
    ];
  }
  const seen = new Set();
  const unique = [];
  for (const s of filtered) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    unique.push(s);
    if (unique.length >= count) break;
  }
  return unique;
}

function buildPlan(pos, goals, opponent) {
  const reminders = REMINDERS[pos] ?? [];
  return {
    opponent,
    position: pos,
    goals,
    reminders,
    focusPoints: goals.map((g) => `Focus: ${g}`),
  };
}

const FAIL = [];
const report = { positions: {} };

console.log('=== Match Day tactics + plan (all positions) ===');
for (const pos of POSITIONS) {
  const goals = GOALS[pos];
  const selected = buildTactics(goals, 5, pos);
  const plan = buildPlan(pos, goals, 'Zagreb');
  const hasGk = selected.some((s) => s.primaryPosition === 'Goalkeeper');
  const ok =
    selected.length >= 3 &&
    (pos === 'Goalkeeper' || !hasGk) &&
    plan.reminders.length >= 1 &&
    plan.focusPoints.length >= 1;
  report.positions[pos] = {
    tacticalN: selected.length,
    ids: selected.map((s) => s.id),
    types: selected.map((s) => s.title.en),
    planReminders: plan.reminders.length,
    gkLeak: hasGk && pos !== 'Goalkeeper',
    ok,
  };
  console.log(
    `  ${ok ? '✓' : '✗'} ${pos}: tactics=${selected.length} planReminders=${plan.reminders.length}${
      hasGk && pos !== 'Goalkeeper' ? ' [GK LEAK]' : ''
    }`,
  );
  if (selected[0]) console.log(`      sample: ${selected[0].title.en}`);
  if (!ok) FAIL.push(`${pos} failed`);
}

// Left Back deep check (production repro profile)
const lb = buildTactics(GOALS['Left Back'], 5, 'Left Back');
if (lb.length < 5) FAIL.push('Left Back must produce 5 tactics');
if (lb.some((s) => s.primaryPosition === 'Goalkeeper')) FAIL.push('Left Back GK leak');
console.log(`\n=== Left Back deep ===`);
console.log(`  n=${lb.length}`);
lb.forEach((s, i) => console.log(`  ${i + 1}. ${s.id} — ${s.title.en}`));

// Source guards
const prep = readFileSync(join(root, 'app/match-day/prepare.tsx'), 'utf8');
const setup = readFileSync(join(root, 'app/match-day/setup.tsx'), 'utf8');
const ctx = readFileSync(join(root, 'context/MatchDayContext.tsx'), 'utf8');
const tactics = readFileSync(join(root, 'lib/match-day-tactics.ts'), 'utf8');
const storage = readFileSync(join(root, 'lib/match-day-storage.ts'), 'utf8');

if (!storage.includes('position: HandballPosition')) FAIL.push('PrepSetup missing position');
if (!setup.includes('position,') || !setup.includes('developmentGoal')) FAIL.push('setup missing position wiring');
if (!ctx.includes('buildMatchDayTactics') || !ctx.includes('buildMatchPlan')) FAIL.push('context missing generation');
if (!ctx.includes('generateForSetup')) FAIL.push('context missing generateForSetup');
if (!prep.includes('activePrep?.setup?.position') && !prep.includes('activePrep.setup?.position') && !prep.includes('playerPosition = activePrep')) {
  FAIL.push('prepare not using prep.setup.position');
}
if (prep.includes('resolvePlayerPosition(loadProfile()), []')) FAIL.push('prepare still freezes loadProfile position');
if (prep.includes('continueToPlan') && prep.includes('skipTacticsToPlan')) FAIL.push('prepare still pads empty tactics with Continue');
if (!tactics.includes('buildMatchDayTactics') || !tactics.includes('buildMatchPlan')) FAIL.push('match-day-tactics missing builders');
if (!tactics.includes("position !== 'Goalkeeper' && s.primaryPosition === 'Goalkeeper'")) {
  FAIL.push('tactics missing GK exclusion');
}

if (FAIL.length) {
  console.log('\nFAIL');
  FAIL.forEach((f) => console.log(' -', f));
  process.exit(1);
}
console.log('\nPASS');
process.exit(0);
