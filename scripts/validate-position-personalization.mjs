/**
 * Native-safe regression: position personalization must not leak Goalkeeper-only content.
 * Exit 0 = PASS, 1 = FAIL.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const require = createRequire(import.meta.url);

// Minimal in-memory storage shim so resolver modules can load under Node
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};

// Polyfill window for platform-storage web path
globalThis.window = globalThis.window ?? { localStorage: globalThis.localStorage };

const scenarios = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

const POSITIONS = ['Left Back', 'Left Wing', 'Pivot', 'Centre Back'];
const FAIL = [];

function isScenarioForPosition(s, position) {
  const primary = s.primaryPosition;
  if (primary === position) return true;
  if (primary === 'All' || primary === 'Universal') {
    const secondary = s.secondaryPositions ?? [];
    if (secondary.length === 0) return true;
    return secondary.includes(position);
  }
  const SPECIFIC = new Set([
    'Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot',
  ]);
  if (SPECIFIC.has(primary) && primary !== position) return false;
  return (s.secondaryPositions ?? []).includes(position);
}

function getByPosition(position) {
  return scenarios.filter((s) => isScenarioForPosition(s, position));
}

function rankForPosition(position, count = 10) {
  const pool = getByPosition(position);
  return [...pool]
    .map((s) => {
      let score = s.qualityScore;
      if (s.primaryPosition === position) score += 40;
      if (s.primaryPosition === 'All' || s.primaryPosition === 'Universal') score -= 35;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.s);
}

// Alias mapping checks (display / snake_case → canonical Title Case)
const ALIASES = {
  left_back: 'Left Back',
  'lijevi vanjski': 'Left Back',
  'linker rückraum': 'Left Back',
  'Left Back': 'Left Back',
};

console.log('=== Canonical ID mapping ===');
for (const [raw, expected] of Object.entries(ALIASES)) {
  const got =
    [
      'Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot',
    ].includes(raw)
      ? raw
      : ({
          left_back: 'Left Back',
          'lijevi vanjski': 'Left Back',
          'linker rückraum': 'Left Back',
        })[raw.toLowerCase()] ?? null;
  const ok = got === expected;
  console.log(`  ${ok ? '✓' : '✗'} "${raw}" → ${got}`);
  if (!ok) FAIL.push(`alias ${raw} → ${got}, expected ${expected}`);
}

console.log('\n=== Training / match first-10 (no Goalkeeper primary) ===');
const report = { positions: {}, failures: [] };

for (const position of POSITIONS) {
  const training = rankForPosition(position, 10);
  const match = getByPosition(position).slice(0, 10);
  const pools = [
    ['training', training],
    ['match', match],
  ];

  for (const [label, pool] of pools) {
    const gk = pool.filter((s) => s.primaryPosition === 'Goalkeeper');
    const ok = pool.every(
      (s) =>
        s.primaryPosition === position ||
        s.primaryPosition === 'All' ||
        s.primaryPosition === 'Universal',
    );
    console.log(
      `  ${ok && gk.length === 0 ? '✓' : '✗'} ${position} ${label}: n=${pool.length}, gkPrimary=${gk.length}`,
    );
    if (!ok || gk.length) {
      const msg = `${position} ${label} leaked GK or foreign primary`;
      FAIL.push(msg);
      report.failures.push({
        msg,
        sample: gk.slice(0, 3).map((s) => ({ id: s.id, title: s.title.en, primary: s.primaryPosition })),
      });
    }
    pool.slice(0, 3).forEach((s, i) => {
      console.log(`      ${i + 1}. [${s.primaryPosition}] ${s.title.en.slice(0, 55)}`);
    });
  }

  report.positions[position] = {
    trainingTop: training.slice(0, 5).map((s) => ({
      id: s.id,
      primary: s.primaryPosition,
      title: s.title.en,
    })),
    matchPoolSize: getByPosition(position).length,
    gkInMatchPool: getByPosition(position).filter((s) => s.primaryPosition === 'Goalkeeper').length,
  };
}

// Mis-tag audit: GK primary must not list field secondaries
const mistags = scenarios.filter(
  (s) =>
    s.primaryPosition === 'Goalkeeper' &&
    (s.secondaryPositions ?? []).some((p) =>
      ['Left Back', 'Right Back', 'Centre Back', 'Left Wing', 'Right Wing', 'Pivot'].includes(p),
    ),
);
console.log(`\n=== Tag audit: GK with field secondary ===`);
console.log(mistags.length === 0 ? '  ✓ none' : `  ✗ ${mistags.length}`);
if (mistags.length) {
  FAIL.push(`${mistags.length} GK scenarios still tag field secondaries`);
  mistags.slice(0, 5).forEach((s) => console.log('   ', s.id, s.secondaryPositions));
}

// No empty-filter fallback to entire Goalkeeper category in daily-challenge source
const dailySrc = readFileSync(join(root, 'lib/development/daily-challenge.ts'), 'utf8');
if (/pool\s*=\s*getAllScenarios\(\)\s*;/.test(dailySrc) || /if \(pool\.length < 5\) pool = getAllScenarios\(\)/.test(dailySrc)) {
  FAIL.push('daily-challenge still falls back to getAllScenarios()');
  console.log('  ✗ daily-challenge full-bank fallback present');
} else {
  console.log('  ✓ daily-challenge has no full-bank fallback');
}

const sessionIntro = readFileSync(join(root, 'lib/content-localize.ts'), 'utf8');
if (!sessionIntro.includes('resolvePlayerPosition') || !sessionIntro.includes('getDailySession')) {
  FAIL.push('session intro not position-aware');
}

writeFileSync(
  join(root, 'scripts/position-personalization-report.json'),
  JSON.stringify({ date: new Date().toISOString(), verdict: FAIL.length ? 'FAIL' : 'PASS', FAIL, report }, null, 2),
);

if (FAIL.length) {
  console.log('\nFAIL');
  FAIL.forEach((f) => console.log(' -', f));
  process.exit(1);
}
console.log('\nPASS');
process.exit(0);
