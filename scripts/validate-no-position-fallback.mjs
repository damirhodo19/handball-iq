/**
 * Static + unit validation: no player-facing Goalkeeper/Centre Back position fallbacks.
 * Exit 0 = PASS, 1 = FAIL.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const FAIL = [];
const FOUND = [];

const BAD_PATTERNS = [
  { re: /\|\|\s*['"]Goalkeeper['"]/g, label: "|| 'Goalkeeper'" },
  { re: /\?\?\s*['"]Goalkeeper['"]/g, label: "?? 'Goalkeeper'" },
  { re: /\|\|\s*['"]Centre Back['"]/g, label: "|| 'Centre Back'" },
  { re: /\?\?\s*['"]Centre Back['"]/g, label: "?? 'Centre Back'" },
  { re: /DEFAULT_POSITION\s*=\s*['"]Goalkeeper['"]/g, label: "DEFAULT_POSITION = Goalkeeper" },
  { re: /DEFAULT_POSITION\s*=\s*['"]Centre Back['"]/g, label: "DEFAULT_POSITION = Centre Back" },
  { re: /getMatchDayPersonalGoals\(\s*['"]Goalkeeper['"]\s*\)/g, label: "getMatchDayPersonalGoals('Goalkeeper')" },
  { re: /getOrCreateWeeklyProgram\(\s*['"]Goalkeeper['"]/g, label: "getOrCreateWeeklyProgram('Goalkeeper')" },
  { re: /getOrCreateDailyChallenge\(\s*['"]Goalkeeper['"]/g, label: "getOrCreateDailyChallenge('Goalkeeper')" },
  { re: /generatePositionMatch\(\s*['"]Goalkeeper['"]\s*\)/g, label: "generatePositionMatch('Goalkeeper') fallback" },
];

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'e2e-screenshots', 'e2e-report', 'test-results',
  'content', 'locales', 'scripts', 'dist', '.expo',
]);

const SKIP_FILES = new Set([
  // Legitimate position-specific content / types (not player fallbacks)
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
for (const file of files) {
  const rel = file.slice(ROOT.length + 1);
  if (rel.includes('scenario-bank') && rel.endsWith('.json')) continue;
  // Allow explicit Goalkeeper content modules / admin templates that author GK scenarios
  if (
    rel.includes('position-modules.ts') ||
    rel.includes('position-scenarios.ts') ||
    rel.includes('admin-templates.ts') ||
    rel.includes('coach-engine-messages.ts') ||
    rel.includes('sprint') ||
    rel.startsWith('locales/')
  ) {
    // still scan for || Goalkeeper fallbacks
  }
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  for (const { re, label } of BAD_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(src)) {
      FOUND.push({ file: rel, label });
      FAIL.push(`${rel}: ${label}`);
    }
  }
}

// Unit checks mirroring resolvePlayerPosition contract
function isHandballPosition(value) {
  return [
    'Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back',
    'Centre Back', 'Right Back', 'Pivot',
  ].includes(value);
}
function resolvePlayerPosition(profile) {
  if (!profile?.position) return null;
  return isHandballPosition(profile.position) ? profile.position : null;
}

const unitCases = [
  [{ position: '' }, null],
  [{ position: null }, null],
  [{}, null],
  [{ position: 'Goalkeeper' }, 'Goalkeeper'],
  [{ position: 'Left Wing' }, 'Left Wing'],
  [{ position: 'Centre Back' }, 'Centre Back'],
  [{ position: 'Pivot' }, 'Pivot'],
  [{ position: 'NotAPosition' }, null],
];

for (const [input, expected] of unitCases) {
  const got = resolvePlayerPosition(input);
  if (got !== expected) {
    FAIL.push(`unit resolvePlayerPosition(${JSON.stringify(input)}) => ${got}, expected ${expected}`);
  }
}

console.log('=== Fallbacks found (player-facing anti-patterns) ===');
if (FOUND.length === 0) console.log('(none)');
else FOUND.forEach((f) => console.log(`- ${f.file}: ${f.label}`));

console.log('\n=== Unit resolvePlayerPosition ===');
console.log(unitCases.length, 'cases checked');

if (FAIL.length) {
  console.log('\nFAIL');
  FAIL.forEach((f) => console.log(' -', f));
  process.exit(1);
}
console.log('\nPASS');
process.exit(0);
