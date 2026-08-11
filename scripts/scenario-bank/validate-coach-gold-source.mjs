import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  COACH_GOLD_CATEGORIES,
  COACH_GOLD_FAMILIES,
  COACH_LEGACY_SOURCE_HASHES,
  COACH_TYPES,
  EXPERIENCE_BANDS,
} from './data/coach-gold-taxonomy.mjs';

const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const textHash = (value) => createHash('sha256').update(value).digest('hex');
const normalize = (value) => String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9čćžšđäöüß\s]/gi, ' ').replace(/\s+/g, ' ').trim();
const hrBlacklist = /\b(cue|reset|outlet|head coach|LB|RB|constraint|match-specific|session|timing|performance|startera?)\b/i;

export function validateCoachGoldSource({ root, scenarios, expectedCount, expectedPerCategory, readyStatus, reportPath }) {
  const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
  const bank = readJson('content/scenario-bank/scenarios.json');
  const manifest = readJson('scripts/gold-bank-final-lock-manifest.json');
  const pivotLock = readJson('scripts/pivot-gold-runtime-lock.json');
  const goalkeeperLock = readJson('scripts/goalkeeper-gold-runtime-lock.json');
  const errors = [];
  const warnings = [];

  const positionNames = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing', LW: 'Left Wing' };
  const originalLocks = Object.fromEntries(Object.entries(positionNames).map(([key, position]) => {
    const expected = manifest.positions[key].contentHash;
    const actual = hash(bank.filter(({ primaryPosition }) => primaryPosition === position));
    if (expected !== actual) errors.push(`${key} Gold hash drift`);
    return [key, { expected, actual, ok: expected === actual }];
  }));
  const pivotActual = hash(bank.filter(({ primaryPosition }) => primaryPosition === 'Pivot'));
  const goalkeeperActual = hash(bank.filter(({ primaryPosition }) => primaryPosition === 'Goalkeeper'));
  if (pivotActual !== pivotLock.contentHash) errors.push('Pivot Gold hash drift');
  if (goalkeeperActual !== goalkeeperLock.contentHash) errors.push('Goalkeeper Gold hash drift');

  const runtimeLockPath = join(root, 'scripts/coach-gold-runtime-lock.json');
  const runtimeCutoverPerformed = existsSync(runtimeLockPath);
  let coachRuntime;
  if (runtimeCutoverPerformed) {
    const runtimeLock = readJson('scripts/coach-gold-runtime-lock.json');
    const runtime = readJson(runtimeLock.runtimePath);
    const runtimeActual = hash(runtime);
    const entryPath = 'lib/coach-platform/challenges.ts';
    const entryText = readFileSync(join(root, entryPath), 'utf8');
    const entryActive = entryText.includes("import coachGoldRuntime from './challenges-gold.json'") && !entryText.includes("from './challenges-extra'");
    if (runtimeLock.status !== 'COACH GOLD RUNTIME LOCK') errors.push('Coach Gold runtime lock status');
    if (runtimeLock.contentHash !== runtimeActual) errors.push('Coach Gold runtime hash drift');
    if (!entryActive) errors.push('Coach Gold runtime entry is not active');
    if (expectedCount === 70 && runtimeLock.approvedSourceHash !== hash(scenarios)) errors.push('Coach Gold approved source hash drift');
    coachRuntime = {
      [runtimeLock.runtimePath]: { expected: runtimeLock.contentHash, actual: runtimeActual, ok: runtimeLock.contentHash === runtimeActual },
      [entryPath]: { expected: 'coach-gold-runtime-active', actual: entryActive ? 'coach-gold-runtime-active' : textHash(entryText), ok: entryActive },
    };
  } else {
    coachRuntime = Object.fromEntries(Object.entries(COACH_LEGACY_SOURCE_HASHES).map(([path, expected]) => {
      const actual = textHash(readFileSync(join(root, path), 'utf8'));
      if (expected !== actual) errors.push(`${path}: active Coach runtime changed before cutover`);
      return [path, { expected, actual, ok: expected === actual }];
    }));
  }

  if (COACH_GOLD_FAMILIES.length !== 70) errors.push(`Taxonomy count ${COACH_GOLD_FAMILIES.length} !== 70`);
  if (scenarios.length !== expectedCount) errors.push(`Source count ${scenarios.length} !== ${expectedCount}`);
  if (new Set(scenarios.map(({ id }) => id)).size !== scenarios.length) errors.push('Source IDs are not unique');
  if (new Set(scenarios.map(({ familyKey }) => familyKey)).size !== scenarios.length) errors.push('Source family keys are not unique');

  const familyByKey = new Map(COACH_GOLD_FAMILIES.map((family) => [family.familyKey, family]));
  const decisionBlobs = [];
  for (const scenario of scenarios) {
    const family = familyByKey.get(scenario.familyKey);
    if (!family) errors.push(`${scenario.id}: family not in taxonomy`);
    if (family && (scenario.id !== family.id || scenario.category !== family.category || scenario.difficulty !== family.difficulty)) errors.push(`${scenario.id}: taxonomy metadata drift`);
    if (!COACH_GOLD_CATEGORIES.includes(scenario.category)) errors.push(`${scenario.id}: invalid category`);
    if (!scenario.coachTypeTags.length || scenario.coachTypeTags.some((tag) => !COACH_TYPES.includes(tag))) errors.push(`${scenario.id}: invalid coachTypeTags`);
    if (!scenario.experienceTags.length || scenario.experienceTags.some((tag) => !EXPERIENCE_BANDS.includes(tag))) errors.push(`${scenario.id}: invalid experienceTags`);
    if (scenario.answers.map(({ quality }) => quality).join(',') !== 'optimal,good,risky,poor') errors.push(`${scenario.id}: answer ladder`);
    if (scenario.answers.map(({ id }) => id).join(',') !== 'a,b,c,d') errors.push(`${scenario.id}: answer IDs`);
    const localized = [
      ['situation', scenario.situation], ['question', scenario.question], ['explanation', scenario.explanation],
      ...scenario.answers.flatMap((answer, index) => [[`answers.${index}.text`, answer.text], [`answers.${index}.feedback`, answer.feedback]]),
    ];
    for (const [field, value] of localized) {
      for (const locale of ['en', 'hr', 'de']) if (!value?.[locale]?.trim()) errors.push(`${scenario.id}: ${field}.${locale} missing`);
      if (hrBlacklist.test(value.hr)) errors.push(`${scenario.id}: ${field}.hr non-native term: ${value.hr.match(hrBlacklist)?.[0]}`);
      if (new Set(['en', 'hr', 'de'].map((locale) => normalize(value[locale]))).size !== 3) errors.push(`${scenario.id}: ${field} locale copy`);
    }
    for (const locale of ['en', 'hr', 'de']) {
      if (new Set(scenario.answers.map(({ text }) => normalize(text[locale]))).size !== 4) errors.push(`${scenario.id}: duplicate ${locale} answer`);
    }
    decisionBlobs.push({
      id: scenario.id,
      tokens: new Set(normalize(`${scenario.question.en} ${scenario.answers[0].text.en}`).split(' ').filter((token) => token.length > 3)),
    });
  }

  const semanticRisks = [];
  for (let i = 0; i < decisionBlobs.length; i++) {
    for (let j = i + 1; j < decisionBlobs.length; j++) {
      const a = decisionBlobs[i];
      const b = decisionBlobs[j];
      let intersection = 0;
      for (const token of a.tokens) if (b.tokens.has(token)) intersection++;
      const similarity = intersection / (a.tokens.size + b.tokens.size - intersection || 1);
      if (similarity >= 0.62) semanticRisks.push({ a: a.id, b: b.id, similarity: Number(similarity.toFixed(3)) });
    }
  }
  if (semanticRisks.length) errors.push(`${semanticRisks.length} semantic decision overlap(s)`);

  const coverage = {
    categories: Object.fromEntries(COACH_GOLD_CATEGORIES.map((category) => [category, scenarios.filter((scenario) => scenario.category === category).length])),
    difficulty: Object.fromEntries(['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((difficulty) => [difficulty, scenarios.filter((scenario) => scenario.difficulty === difficulty).length])),
    coachTypes: Object.fromEntries(COACH_TYPES.map((tag) => [tag, scenarios.filter(({ coachTypeTags }) => coachTypeTags.includes(tag)).length])),
    experience: Object.fromEntries(EXPERIENCE_BANDS.map((tag) => [tag, scenarios.filter(({ experienceTags }) => experienceTags.includes(tag)).length])),
  };
  for (const [category, count] of Object.entries(coverage.categories)) if (count !== expectedPerCategory) errors.push(`${category}: ${count} !== ${expectedPerCategory}`);

  const report = {
    status: errors.length ? 'FAIL' : readyStatus,
    generatedAt: new Date().toISOString(),
    sourceCount: scenarios.length,
    fullTarget: 70,
    sourceHash: hash(scenarios),
    familyCount: new Set(scenarios.map(({ familyKey }) => familyKey)).size,
    coverage,
    semanticRisks,
    lockedPlayerBanks: {
      originalGold: originalLocks,
      pivot: { expected: pivotLock.contentHash, actual: pivotActual, ok: pivotLock.contentHash === pivotActual },
      goalkeeper: { expected: goalkeeperLock.contentHash, actual: goalkeeperActual, ok: goalkeeperLock.contentHash === goalkeeperActual },
    },
    activeCoachRuntimeStable: coachRuntime,
    runtimeCutoverPerformed,
    errors,
    warnings,
  };
  writeFileSync(join(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}
