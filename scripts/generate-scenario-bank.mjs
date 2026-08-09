#!/usr/bin/env node
/**
 * Generates content/scenario-bank/scenarios.json from scenario archetypes.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllArchetypes } from './scenario-bank/archetypes.mjs';
import { localizeTextAsync, flushTranslationCache, getCacheSize } from './scenario-bank/translate.mjs';
import { scoreDecisionDepth } from './scenario-bank/quality-rubric.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'content/scenario-bank/scenarios.json');

/** Targets prefer depth over padding — do not force clones to hit old volume. */
const CATEGORY_TARGETS = {
  Goalkeeper: 55,
  'Left Wing': 40,
  'Right Wing': 40,
  'Left Back': 45,
  'Centre Back': 45,
  'Right Back': 45,
  Pivot: 50,
  Defence: 55,
  'Fast Break': 50,
  'Power Play': 40,
  'Short Handed': 40,
  'Match Ending': 50,
  'Decision Making': 50,
};

const MINIMUM_TOTAL = 500;

function substituteSlots(text, slotValues) {
  let out = text;
  for (const [key, value] of Object.entries(slotValues)) {
    out = out.replaceAll(`{${key}}`, String(value));
  }
  return out;
}

function cartesianSlotCombos(slots) {
  const keys = Object.keys(slots);
  if (keys.length === 0) return [{}];

  function expand(keyIndex, current) {
    if (keyIndex >= keys.length) return [current];
    const key = keys[keyIndex];
    const values = slots[key];
    const results = [];
    for (const val of values) {
      results.push(...expand(keyIndex + 1, { ...current, [key]: val }));
    }
    return results;
  }
  return expand(0, {});
}

function computeQualityScore(scenario) {
  const depth = scoreDecisionDepth({
    situationEn: scenario.situation.en,
    questionEn: scenario.question.en,
    answers: scenario.answers.map((a) => ({
      textEn: a.text.en,
      feedbackEn: a.feedback.en,
      quality: a.quality,
    })),
    difficulty: scenario.difficulty,
  });
  let score = depth;
  const optimalCount = scenario.answers.filter((a) => a.quality === 'optimal').length;
  if (optimalCount !== 1) score -= 3;
  for (const lang of ['hr', 'de']) {
    if (!scenario.situation[lang] || scenario.situation[lang] === scenario.situation.en) score -= 0.5;
    if (!scenario.question[lang]) score -= 0.5;
  }
  return Math.max(1, Math.min(10, Math.round(score)));
}

async function buildScenarioFromArchetype(archetype, slotValues, id, _variationIndex) {
  const situationEn = substituteSlots(archetype.situationEn, slotValues);
  const titleEn = substituteSlots(archetype.titleEn, slotValues);
  const minute = slotValues.minute ?? pickFrom([8, 15, 22, 35, 48]);
  const score = slotValues.score ?? pickFrom(['14–13', '19–18', '24–23']);

  const answerEntries = archetype.answers.map((a) => ({
    textEn: substituteSlots(a.textEn, slotValues),
    quality: a.quality,
    feedbackEn: substituteSlots(a.feedbackEn, slotValues),
  }));

  const [title, situation, question, explanation, ...answerTexts] = await Promise.all([
    localizeTextAsync(titleEn),
    localizeTextAsync(situationEn),
    localizeTextAsync(substituteSlots(archetype.questionEn, slotValues)),
    localizeTextAsync(substituteSlots(archetype.explanationEn, slotValues)),
    ...answerEntries.flatMap((a) => [
      localizeTextAsync(a.textEn),
      localizeTextAsync(a.feedbackEn),
    ]),
  ]);

  const answers = answerEntries.map((a, i) => ({
    text: answerTexts[i * 2],
    quality: a.quality,
    feedback: answerTexts[i * 2 + 1],
  }));

  const scenario = {
    id,
    title,
    category: archetype.category,
    primaryPosition: archetype.primaryPosition,
    secondaryPositions: archetype.secondaryPositions ?? [],
    difficulty: archetype.difficulty,
    pressureLevel: archetype.pressureLevel,
    attackOrDefence: archetype.attackOrDefence,
    matchPhase: archetype.matchPhase ?? 'Open Play',
    minute: typeof minute === 'number' ? minute : parseInt(String(minute), 10) || 25,
    score: String(score),
    defensiveSystem: archetype.defensiveSystem,
    situation,
    question,
    answers,
    explanation,
    qualityScore: 0,
  };

  scenario.qualityScore = computeQualityScore(scenario);
  return scenario;
}

function pickFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateScenarios() {
  const archetypes = getAllArchetypes();
  const byCategory = {};
  for (const a of archetypes) {
    (byCategory[a.category] ??= []).push(a);
  }

  const scenarios = [];
  let idCounter = 1;
  let variationIndex = 0;

  for (const [category, target] of Object.entries(CATEGORY_TARGETS)) {
    const pool = byCategory[category] ?? [];
    if (pool.length === 0) {
      console.warn(`No archetypes for category: ${category}`);
      continue;
    }

    const generated = [];
    let archetypeIdx = 0;
    let attempt = 0;
    const maxAttempts = target * 30;

    while (generated.length < target && attempt < maxAttempts) {
      const archetype = pool[archetypeIdx % pool.length];
      archetypeIdx++;
      attempt++;
      variationIndex++;

      const combos = cartesianSlotCombos(archetype.variationSlots ?? {});
      const combo = combos[(attempt + variationIndex) % Math.max(combos.length, 1)] ?? {};

      const id = `scn_bank_${String(idCounter).padStart(3, '0')}`;
      idCounter++;

      const scenario = await buildScenarioFromArchetype(archetype, combo, id, variationIndex);

      const situationKey = scenario.situation.en.slice(0, 100);
      const isDupe = generated.some(
        (s) => s.situation.en.slice(0, 100) === situationKey,
      );
      if (isDupe) continue;

      generated.push(scenario);

      if (generated.length % 25 === 0) {
        flushTranslationCache();
        process.stderr.write(`  ${category}: ${generated.length}/${target}\n`);
      }
    }

    if (generated.length < target) {
      console.warn(`Category ${category}: only generated ${generated.length}/${target}`);
    }

    scenarios.push(...generated);
  }

  return scenarios;
}

async function main() {
  const scenarios = await generateScenarios();
  const total = scenarios.length;

  flushTranslationCache();
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(scenarios, null, 2));

  const byCategory = {};
  for (const s of scenarios) {
    byCategory[s.category] = (byCategory[s.category] ?? 0) + 1;
  }

  console.log(`Generated ${total} scenarios → ${OUT_PATH}`);
  console.log(`Translation cache entries: ${getCacheSize()}`);
  console.log('Category breakdown:');
  for (const [cat, count] of Object.entries(byCategory).sort()) {
    const target = CATEGORY_TARGETS[cat] ?? '?';
    console.log(`  ${cat}: ${count} (target ${target})`);
  }
  console.log(`Minimum total: ${MINIMUM_TOTAL} — ${total >= MINIMUM_TOTAL ? 'PASS' : 'FAIL'}`);

  const lowQuality = scenarios.filter((s) => s.qualityScore < 8);
  if (lowQuality.length > 0) {
    console.warn(`${lowQuality.length} scenarios scored below 8`);
  }
}

main().catch((e) => {
  console.error(e);
  flushTranslationCache();
  process.exit(1);
});
