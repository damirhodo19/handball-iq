import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const file = 'content/scenario-bank/scenarios.json';
const before = JSON.parse(execFileSync('git', ['show', `dac95b11cf6dbd73dedc91668b97d776d7df41bf:${file}`], { maxBuffer: 20 * 1024 * 1024 }));
const after = JSON.parse(readFileSync(file, 'utf8'));
assert.equal(after.length, 692);
assert.deepEqual(after.map(s => s.id), before.map(s => s.id));
let changed = 0;
for (let i = 0; i < before.length; i++) {
  const old = before[i], current = after[i];
  // Other minutes are covered by correct-first-half-scores.mjs.
  if (old.minute !== 9) continue;
  if (JSON.stringify(old) === JSON.stringify(current)) continue;
  changed++;
  assert.equal(old.minute, 9);
  assert.equal(current.minute, 9);
  const [oh, oa] = old.score.match(/\d+/g).map(Number);
  const [nh, na] = current.score.match(/\d+/g).map(Number);
  assert.equal(nh - na, oh - oa, `${old.id}: goal difference`);
  assert.ok(Math.max(nh, na) <= 6 && Math.min(nh, na) >= 3);
  const pattern = new RegExp(`(?<!\\d)${oh}\\s*[:–—-]\\s*${oa}(?!\\d)`, 'g');
  const expected = JSON.parse(JSON.stringify(old).replace(pattern, current.score));
  if (['scn_bank_527', 'scn_bank_535'].includes(old.id)) expected.matchPhase = 'Open Play';
  assert.deepEqual(current, expected, `${old.id}: only reviewed score and phase edits permitted`);
  for (const lang of ['en','hr','de']) {
    assert.ok(current.situation[lang].includes(current.score), `${old.id}: ${lang} score`);
    assert.ok(!current.situation[lang].match(pattern), `${old.id}: stale ${lang} score`);
  }
}
assert.equal(changed, 70);
assert.ok(!after.some(s => s.minute === 9 && Math.max(...s.score.match(/\d+/g).map(Number)) >= 14));
console.log('PASS: 70 reviewed ninth-minute corrections, all IDs and goal differences preserved, 210 localized situations checked');
