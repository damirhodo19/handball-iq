import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

// Reviewed correction: preserve minute, goal difference, decisions and tactical lesson.
const path = 'content/scenario-bank/scenarios.json';
const bank = JSON.parse(readFileSync(path, 'utf8'));
const mapping = { '22:21': '5:4', '14:13': '4:3', '27:28': '4:5',
  '28:27': '6:5', '21:22': '4:5', '15:13': '5:3', '23:21': '6:4' };
const targets = bank.filter(s => s.minute === 9 && Math.max(...s.score.match(/\d+/g).map(Number)) >= 14);
assert.equal(targets.length, 70, 'Expected the reviewed 70 scenarios; do not apply to a different baseline');
for (const scenario of targets) {
  const [home, away] = scenario.score.match(/\d+/g).map(Number);
  const replacement = mapping[`${home}:${away}`];
  assert.ok(replacement, scenario.id);
  const pattern = new RegExp(`(?<!\\d)${home}\\s*[:–—-]\\s*${away}(?!\\d)`, 'g');
  for (const lang of ['hr', 'en', 'de']) {
    assert.ok(scenario.situation[lang].match(pattern), `${scenario.id}: missing score in ${lang}`);
  }
  function replace(value) {
    if (typeof value === 'string') return value.replace(pattern, replacement);
    if (Array.isArray(value)) return value.map(replace);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,replace(v)]));
    return value;
  }
  Object.assign(scenario, replace(scenario));
  scenario.score = replacement;
  if (['scn_bank_527', 'scn_bank_535'].includes(scenario.id)) scenario.matchPhase = 'Open Play';
}
writeFileSync(path, JSON.stringify(bank, null, 2) + '\n');
console.log(`Corrected ${targets.length} scenarios in HR, EN and DE`);
