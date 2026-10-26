import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const file = 'content/scenario-bank/scenarios.json';
const baseline = JSON.parse(execFileSync('git', ['show', '1de0687bb0d5f9f106c82ba8db37774033d125c9:' + file], { maxBuffer: 20 * 1024 * 1024 }));
const current = JSON.parse(readFileSync(file, 'utf8'));
const expected = structuredClone(baseline);
const mapping = { '22:21': '14:13', '28:27': '16:15', '29:27': '17:15' };
let count = 0;
for (const s of expected) {
  const values = (s.score.match(/\d+/g) || []).map(Number);
  if (![28, 29].includes(s.minute) || Math.max(...values) < 22) continue;
  const [home, away] = values;
  const score = mapping[home + ':' + away];
  assert.ok(score, s.id);
  assert.equal(score.split(':').map(Number).reduce((a,b) => a-b), home-away);
  const pattern = new RegExp('(?<!\\d)' + home + '\\s*[:–—-]\\s*' + away + '(?!\\d)', 'g');
  for (const lang of ['hr','en','de']) assert.ok(s.situation[lang].match(pattern), s.id + ': ' + lang);
  // Only replace the exact old score; no tactical choices or goal differences change.
  const revised = JSON.parse(JSON.stringify(s).replace(pattern, score));
  if (s.id === 'scn_bank_519') revised.matchPhase = 'Open Play';
  Object.assign(s, revised);
  for (const lang of ['hr','en','de']) assert.ok(s.situation[lang].includes(score));
  count++;
}
assert.equal(count, 52);
assert.equal(expected.length, 692);
if (process.argv.includes('--apply')) {
  assert.deepEqual(current, baseline, 'Apply only to the reviewed baseline');
  writeFileSync(file, JSON.stringify(expected, null, 2) + '\n');
  const fixturePath = 'scripts/fixtures/croatian-content-invariants.json';
  const fixtures = JSON.parse(readFileSync(fixturePath, 'utf8'));
  const omitHr = v => Array.isArray(v) ? v.map(omitHr) : v && typeof v === 'object'
    ? Object.fromEntries(Object.entries(v).filter(([k]) => k !== 'hr').map(([k,x]) => [k,omitHr(x)])) : v;
  fixtures[file] = createHash('sha256').update(JSON.stringify(omitHr(expected))).digest('hex');
  writeFileSync(fixturePath, JSON.stringify(fixtures, null, 2) + '\n');
} else {
  assert.deepEqual(current, expected, 'Only the reviewed 52 score corrections and one phase correction are permitted');
}
console.log('PASS: 52 score corrections, 156 localized situations, 640 unchanged scenarios; all IDs, minutes and goal differences preserved');
