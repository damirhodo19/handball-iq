#!/usr/bin/env node
/** Fail if archetypes do not meet elite decision-depth rubric. */
import { getAllArchetypes } from './scenario-bank/archetypes.mjs';
import { auditArchetype } from './scenario-bank/quality-rubric.mjs';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const archetypes = getAllArchetypes();
const results = archetypes.map((a) => ({
  title: a.titleEn,
  category: a.category,
  difficulty: a.difficulty,
  ...auditArchetype(a),
}));

const failing = results.filter((r) => !r.pass);
const avgDepth =
  results.reduce((n, r) => n + r.depth, 0) / Math.max(results.length, 1);

const report = {
  total: results.length,
  passing: results.length - failing.length,
  failing: failing.length,
  avgDepth: Math.round(avgDepth * 10) / 10,
  byDifficulty: Object.fromEntries(
    ['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((d) => [
      d,
      results.filter((r) => r.difficulty === d).length,
    ]),
  ),
  failures: failing.slice(0, 40),
};

writeFileSync(join(root, 'scripts/archetype-quality-report.json'), JSON.stringify(report, null, 2));
console.log(`Archetype quality: ${report.passing}/${report.total} pass · avg depth ${report.avgDepth}`);
console.log(`Difficulty mix:`, report.byDifficulty);
if (failing.length) {
  console.log('Sample failures:');
  for (const f of failing.slice(0, 15)) {
    console.log(`  - [${f.difficulty}] ${f.title}: ${f.issues.join(', ')} (depth ${f.depth})`);
  }
  process.exit(1);
}
console.log('PASS');
