/**
 * Regression: sessions must never repeat scenarioFamilyId (semantic family).
 * Also audits Left Back bank + runs 100 LB sessions.
 * Exit 0 = PASS.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};
globalThis.window = { localStorage: globalThis.localStorage };

const scenarios = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

function canonicalTitleBase(titleEn) {
  return (titleEn ?? '').replace(/\s*\(\d+\)\s*$/, '').trim();
}

function getScenarioFamilyId(s) {
  const base = canonicalTitleBase(s.title?.en ?? s.id);
  return base
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function formationFromText(text) {
  const patterns = [
    [/3\s*:\s*2\s*:\s*1|3-2-1/, '3-2-1'],
    [/5\s*:\s*1|5-1/, '5-1'],
    [/6\s*:\s*0|6-0/, '6-0'],
    [/3\s*:\s*3|3-3/, '3-3'],
    [/4\s*:\s*2|4-2/, '4-2'],
  ];
  for (const [re, id] of patterns) {
    if (re.test(text)) return id;
  }
  return null;
}

function extractFormation(s) {
  if (s.defensiveSystem) return String(s.defensiveSystem).toLowerCase();
  return (
    formationFromText((s.title?.en ?? '').toLowerCase()) ??
    formationFromText((s.situation?.en ?? '').toLowerCase()) ??
    'unknown'
  );
}

function getDecisionArchetype(s) {
  const title = canonicalTitleBase(s.title?.en ?? '');
  const parts = title.split(/\s*[—–]\s*/);
  return (parts.length > 1 ? parts.slice(1).join(' — ') : title).toLowerCase().replace(/\s+/g, ' ').trim();
}

function dedupeById(list) {
  const m = new Map();
  for (const s of list) if (s?.id && !m.has(s.id)) m.set(s.id, s);
  return [...m.values()];
}

function pickDiverse(ranked, count, position) {
  const maxPerCategory = count <= 5 ? 2 : Math.max(2, Math.ceil(count * 0.4));
  const seenIds = new Set();
  const seenFamilies = new Set();
  const categoryCounts = new Map();
  const picked = [];
  const primary = ranked.filter((s) => s.primaryPosition === position);
  const secondary = ranked.filter((s) => s.primaryPosition !== position);
  const ordered = [...primary, ...secondary];

  for (const s of ordered) {
    if (!s?.id || seenIds.has(s.id)) continue;
    if (s.primaryPosition === 'Goalkeeper' && position !== 'Goalkeeper') continue;
    const family = getScenarioFamilyId(s);
    if (seenFamilies.has(family)) continue;
    const cat = s.category;
    // Mirror the production selector: an exact position bank commonly uses the
    // position itself as its category (Goalkeeper, Pivot, wing/back banks).
    // Those rows may fill the session; the generic tactical-category cap only
    // applies to supplemental categories.
    const positionCategoryCap =
      cat === position || s.primaryPosition === position ? count : maxPerCategory;
    if ((categoryCounts.get(cat) ?? 0) >= positionCategoryCap) continue;
    if (picked.length > 0) {
      const prev = picked[picked.length - 1];
      if (
        extractFormation(prev) === extractFormation(s) &&
        getDecisionArchetype(prev) === getDecisionArchetype(s)
      ) {
        continue;
      }
    }
    seenIds.add(s.id);
    seenFamilies.add(family);
    categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
    picked.push(s);
    if (picked.length >= count) break;
  }
  return picked;
}

const SPECIFIC = new Set([
  'Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot',
]);

function isFor(s, pos) {
  if (s.primaryPosition === pos) return true;
  if (s.primaryPosition === 'All' || s.primaryPosition === 'Universal') {
    const sec = s.secondaryPositions ?? [];
    return sec.length === 0 || sec.includes(pos);
  }
  if (SPECIFIC.has(s.primaryPosition) && s.primaryPosition !== pos) return false;
  return (s.secondaryPositions ?? []).includes(pos);
}

function buildSession(position, salt) {
  const pool = scenarios.filter((s) => isFor(s, position));
  const ranked = pool
    .map((s) => {
      let score = s.qualityScore + (s.primaryPosition === position ? 40 : 0);
      if (s.primaryPosition === 'All' || s.primaryPosition === 'Universal') score -= 35;
      score += ((s.id.charCodeAt(s.id.length - 1) || 0) + salt * 13) % 17;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.s);
  return pickDiverse(ranked, 5, position);
}

function hasThreeConsecutiveSameCategory(session, position) {
  for (let i = 0; i < session.length - 2; i++) {
    if (
      session[i].category === session[i + 1].category &&
      session[i + 1].category === session[i + 2].category &&
      !(
        session[i].category === position &&
        session[i].primaryPosition === position &&
        session[i + 1].primaryPosition === position &&
        session[i + 2].primaryPosition === position
      )
    ) {
      return true;
    }
  }
  return false;
}

const FAIL = [];
const report = {
  date: new Date().toISOString(),
  leftBackAudit: {},
  lbSessions: [],
  sampleSessionLog: [],
};

// --- Audit Left Back bank ---
const lb = scenarios.filter((s) => s.primaryPosition === 'Left Back');
const familyMap = new Map();
for (const s of lb) {
  const f = getScenarioFamilyId(s);
  if (!familyMap.has(f)) familyMap.set(f, []);
  familyMap.get(f).push(s.id);
}
const qCounts = new Map();
for (const s of lb) {
  const k = (s.question?.en ?? '').trim().toLowerCase();
  qCounts.set(k, (qCounts.get(k) ?? 0) + 1);
}
const exactDupCount = [...qCounts.values()].reduce((acc, n) => acc + Math.max(0, n - 1), 0);
const familySizes = [...familyMap.entries()]
  .map(([family, ids]) => ({ family, n: ids.length, ids }))
  .sort((a, b) => b.n - a.n);

report.leftBackAudit = {
  totalLeftBackScenarios: lb.length,
  exactDuplicateQuestionCount: exactDupCount,
  semanticDuplicateFamilyCount: familySizes.filter((f) => f.n > 1).length,
  uniqueLeftBackScenarioFamilies: familyMap.size,
  repetitionCulprits: familySizes.filter((f) => f.n > 1),
};

console.log('=== Left Back scenario bank audit ===');
console.log(`  total Left Back scenarios: ${lb.length}`);
console.log(`  exact duplicate question count: ${exactDupCount}`);
console.log(`  semantic duplicate family count: ${report.leftBackAudit.semanticDuplicateFamilyCount}`);
console.log(`  unique Left Back scenario families: ${familyMap.size}`);
console.log('  repetition culprits (family → n):');
for (const f of familySizes.filter((x) => x.n > 1)) {
  console.log(`    ${f.n}× ${f.family}`);
}

// --- Sample full LB session log ---
console.log('\n=== Sample Left Back session (full diagnostic) ===');
const sample = buildSession('Left Back', 7);
for (const s of sample) {
  const optimal = (s.answers ?? []).find((a) => a.quality === 'optimal');
  const row = {
    id: s.id,
    title: s.title?.en,
    question: s.question?.en,
    category: s.category,
    subCategory: getDecisionArchetype(s),
    positionTags: [s.primaryPosition, ...(s.secondaryPositions ?? [])],
    goalTags: s.skillTags ?? [],
    difficulty: s.difficulty,
    correctAnswer: optimal?.text?.en,
    decisionArchetype: getDecisionArchetype(s),
    formation: extractFormation(s),
    scenarioFamilyId: getScenarioFamilyId(s),
    situationSignature: (s.situation?.en ?? '').slice(0, 120),
  };
  report.sampleSessionLog.push(row);
  console.log(JSON.stringify(row, null, 2));
}

// --- 100 Left Back sessions ---
console.log('\n=== 100 Left Back sessions (scenarioFamilyId regression) ===');
let lbOk = 0;
for (let i = 0; i < 100; i++) {
  const session = buildSession('Left Back', i + 1);
  const families = session.map(getScenarioFamilyId);
  const ids = session.map((s) => s.id);
  const familyDup = families.length !== new Set(families).size;
  const idDup = ids.length !== new Set(ids).size;
  const threeCat = hasThreeConsecutiveSameCategory(session, 'Left Back');
  const hasGk = session.some((s) => s.primaryPosition === 'Goalkeeper');
  const catOver = (() => {
    const c = new Map();
    for (const s of session) {
      if (s.category === 'Left Back' && s.primaryPosition === 'Left Back') continue;
      c.set(s.category, (c.get(s.category) ?? 0) + 1);
    }
    return [...c.values()].some((n) => n > 2);
  })();
  const ok =
    !familyDup &&
    !idDup &&
    !threeCat &&
    !hasGk &&
    !catOver &&
    session.length >= 3 &&
    session.length <= 5;

  if (ok) lbOk++;
  else {
    FAIL.push(
      `LB session ${i + 1}: familyDup=${familyDup} idDup=${idDup} threeCat=${threeCat} gk=${hasGk} catOver=${catOver} n=${session.length} families=${families.join(' | ')}`,
    );
  }
  if (i < 5 || !ok) {
    report.lbSessions.push({
      run: i + 1,
      ok,
      n: session.length,
      families,
      ids,
      categories: session.map((s) => s.category),
      titles: session.map((s) => s.title.en),
    });
  }
}
console.log(`  ${lbOk === 100 ? '✓' : '✗'} Left Back: ${lbOk}/100 clean`);

// Spot-check other positions (10 each)
for (const pos of ['Goalkeeper', 'Left Wing', 'Pivot']) {
  let okN = 0;
  for (let i = 0; i < 10; i++) {
    const session = buildSession(pos, i + 1);
    const families = session.map(getScenarioFamilyId);
    const familyDup = families.length !== new Set(families).size;
    const hasWrongGk =
      pos !== 'Goalkeeper' && session.some((s) => s.primaryPosition === 'Goalkeeper');
    if (!familyDup && !hasWrongGk && session.length >= 3) okN++;
    else FAIL.push(`${pos} session ${i + 1} failed`);
  }
  console.log(`  ${okN === 10 ? '✓' : '✗'} ${pos}: ${okN}/10 clean`);
}

// Source guards
const sessionCtx = readFileSync(join(root, 'context/SessionContext.tsx'), 'utf8');
const familySrc = readFileSync(join(root, 'lib/platform/scenario-family.ts'), 'utf8');
const resolver = readFileSync(join(root, 'lib/platform/content-resolver.ts'), 'utf8');
if (!familySrc.includes('getScenarioFamilyId') || !familySrc.includes('pickDiverseSessionScenarios')) {
  FAIL.push('scenario-family.ts missing core APIs');
}
if (!sessionCtx.includes('pickUniqueScenariosWithoutReplacement')) {
  FAIL.push('SessionContext missing unique pick');
}
if (!sessionCtx.includes('getScenarioFamilyId') && !sessionCtx.includes('scenario-family')) {
  FAIL.push('SessionContext missing family wiring');
}
if (!resolver.includes('pickUniqueScenariosWithoutReplacement')) {
  FAIL.push('content-resolver missing unique pick');
}

const verdict = FAIL.length ? 'FAIL' : 'PASS';
writeFileSync(
  join(root, 'scripts/unique-session-report.json'),
  JSON.stringify({ verdict, FAIL, ...report }, null, 2),
);

if (FAIL.length) {
  console.log('\nFAIL');
  FAIL.slice(0, 20).forEach((f) => console.log(' -', f));
  if (FAIL.length > 20) console.log(` ... +${FAIL.length - 20} more`);
  process.exit(1);
}
console.log('\nPASS');
process.exit(0);
