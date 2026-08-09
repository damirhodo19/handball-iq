#!/usr/bin/env node
/**
 * Audits content/scenario-bank/scenarios.json for quality and completeness.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SCENARIOS_PATH = path.join(ROOT, 'content/scenario-bank/scenarios.json');
const REPORT_PATH = path.join(ROOT, 'scripts/scenario-content-report.json');

const CATEGORY_TARGETS = {
  Goalkeeper: 75,
  'Left Wing': 38,
  'Right Wing': 37,
  'Left Back': 50,
  'Centre Back': 50,
  'Right Back': 50,
  Pivot: 75,
  Defence: 100,
  'Fast Break': 75,
  'Power Play': 50,
  'Short Handed': 50,
  'Match Ending': 75,
  'Decision Making': 75,
};

const MINIMUM_TOTAL = 700;
const REQUIRED_FIELDS = [
  'id',
  'title',
  'category',
  'primaryPosition',
  'difficulty',
  'pressureLevel',
  'attackOrDefence',
  'matchPhase',
  'minute',
  'score',
  'situation',
  'question',
  'answers',
  'explanation',
  'qualityScore',
];

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function similarity(a, b) {
  const wa = new Set(normalize(a).split(' '));
  const wb = new Set(normalize(b).split(' '));
  const inter = [...wa].filter((w) => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? inter / union : 0;
}

function audit(scenarios) {
  const report = {
    timestamp: new Date().toISOString(),
    total: scenarios.length,
    pass: true,
    categoryCounts: {},
    positionCounts: {},
    duplicateIds: [],
    similarSituations: [],
    weakScenarios: [],
    missingTranslations: [],
    missingFields: [],
    categoryTargetFailures: [],
    issues: [],
  };

  const ids = new Set();
  for (const s of scenarios) {
    if (ids.has(s.id)) report.duplicateIds.push(s.id);
    ids.add(s.id);

    report.categoryCounts[s.category] = (report.categoryCounts[s.category] ?? 0) + 1;
    report.positionCounts[s.primaryPosition] = (report.positionCounts[s.primaryPosition] ?? 0) + 1;

    for (const field of REQUIRED_FIELDS) {
      if (s[field] === undefined || s[field] === null || s[field] === '') {
        report.missingFields.push({ id: s.id, field });
      }
    }

    if (!s.answers || s.answers.length !== 4) {
      report.weakScenarios.push({ id: s.id, reason: 'Not exactly 4 answers' });
    } else {
      const optimal = s.answers.filter((a) => a.quality === 'optimal');
      if (optimal.length !== 1) {
        report.weakScenarios.push({ id: s.id, reason: `Multiple or no optimal answers (${optimal.length})` });
      }
      for (const a of s.answers) {
        if (!a.text?.en || !a.feedback?.en) {
          report.weakScenarios.push({ id: s.id, reason: 'Missing answer text or feedback' });
        }
      }
    }

    if (s.qualityScore < 8) {
      report.weakScenarios.push({ id: s.id, reason: `qualityScore ${s.qualityScore} < 8` });
    }

    for (const lang of ['en', 'hr', 'de']) {
      if (!s.situation?.[lang]) report.missingTranslations.push({ id: s.id, field: 'situation', lang });
      if (!s.question?.[lang]) report.missingTranslations.push({ id: s.id, field: 'question', lang });
      if (!s.explanation?.[lang]) report.missingTranslations.push({ id: s.id, field: 'explanation', lang });
      if (s.title && !s.title[lang]) report.missingTranslations.push({ id: s.id, field: 'title', lang });
      for (let i = 0; i < (s.answers?.length ?? 0); i++) {
        const a = s.answers[i];
        if (!a.text?.[lang]) report.missingTranslations.push({ id: s.id, field: `answers[${i}].text`, lang });
        if (!a.feedback?.[lang]) report.missingTranslations.push({ id: s.id, field: `answers[${i}].feedback`, lang });
      }
    }

    const obviousPatterns = [/call timeout/i, /turn your back/i, /close your eyes/i, /run to the bench/i];
    for (const p of obviousPatterns) {
      if (s.answers?.some((a) => p.test(a.text?.en) && a.quality === 'optimal')) {
        report.weakScenarios.push({ id: s.id, reason: `Joke/obvious optimal: ${p}` });
      }
    }
  }

  for (let i = 0; i < scenarios.length; i++) {
    for (let j = i + 1; j < scenarios.length; j++) {
      const sim = similarity(scenarios[i].situation.en, scenarios[j].situation.en);
      if (sim > 0.85) {
        report.similarSituations.push({
          id1: scenarios[i].id,
          id2: scenarios[j].id,
          similarity: Math.round(sim * 100) / 100,
        });
      }
    }
  }

  for (const [cat, target] of Object.entries(CATEGORY_TARGETS)) {
    const count = report.categoryCounts[cat] ?? 0;
    if (count < target) {
      report.categoryTargetFailures.push({ category: cat, count, target });
    }
  }

  if (report.total < MINIMUM_TOTAL) {
    report.categoryTargetFailures.push({ category: 'TOTAL', count: report.total, target: MINIMUM_TOTAL });
  }

  const failReasons = [];
  if (report.duplicateIds.length) failReasons.push('duplicate IDs');
  if (report.categoryTargetFailures.length) failReasons.push('category targets');
  if (report.missingFields.length) failReasons.push('missing fields');
  if (report.missingTranslations.length) failReasons.push('missing translations');
  if (report.weakScenarios.length) failReasons.push('weak scenarios');
  if (report.similarSituations.length > 50) failReasons.push('too many similar situations');

  report.pass = failReasons.length === 0;
  report.failReasons = failReasons;
  report.summary = {
    duplicateIds: report.duplicateIds.length,
    similarSituations: report.similarSituations.length,
    weakScenarios: report.weakScenarios.length,
    missingTranslations: report.missingTranslations.length,
    missingFields: report.missingFields.length,
    categoryTargetFailures: report.categoryTargetFailures.length,
  };

  return report;
}

function main() {
  if (!fs.existsSync(SCENARIOS_PATH)) {
    console.error(`Missing ${SCENARIOS_PATH}. Run generate-scenario-bank.mjs first.`);
    process.exit(1);
  }

  const scenarios = JSON.parse(fs.readFileSync(SCENARIOS_PATH, 'utf8'));
  const report = audit(scenarios);

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log(`Audit ${report.pass ? 'PASS' : 'FAIL'} — ${report.total} scenarios`);
  console.log('Category counts:');
  for (const [cat, count] of Object.entries(report.categoryCounts).sort()) {
    console.log(`  ${cat}: ${count}`);
  }
  if (report.failReasons?.length) {
    console.log('Fail reasons:', report.failReasons.join(', '));
  }
  console.log(`Report → ${REPORT_PATH}`);
  process.exit(report.pass ? 0 : 1);
}

main();
