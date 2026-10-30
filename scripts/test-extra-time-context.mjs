import assert from 'node:assert/strict';
import { createRuntime } from './lib/localization-test-runtime.mjs';

const { load } = createRuntime();
const { getAllScenarios, toGKScenario } = load('@/lib/scenario-bank');
const { localizeGKScenario } = load('@/lib/scenario-localize');
const { createTranslator } = load('@/lib/locale-text');
const ids = new Set(['scn_bank_553', 'scn_bank_563', 'scn_bank_573', 'scn_bank_583', 'scn_bank_593', 'scn_bank_603']);
const labels = {
  en: ['Extra time', 'Start of extra time'],
  hr: ['Produžeci', 'Početak produžetka'],
  de: ['Verlängerung', 'Beginn der Verlängerung'],
};
let corrected = 0;
let unchanged = 0;
for (const bank of getAllScenarios()) {
  const scenario = toGKScenario(bank, 1);
  assert.equal(scenario.score, bank.score);
  assert.equal(scenario.situation, bank.situation.en);
  assert.equal(JSON.stringify(scenario.options), JSON.stringify(bank.answers.map(a => a.text.en)));
  if (bank.id === 'scn_bank_1108') {
    assert.equal(scenario.half, 'Shootout');
    for (const lang of ['hr', 'en', 'de']) {
      const t = createTranslator(lang);
      for (const input of [scenario, { ...scenario, half: 'Second Half', time: '60′' }]) {
        const localized = localizeGKScenario(input, lang, t);
        assert.equal(localized.half, t('matchPhase.shootout'));
        assert.equal(localized.time, t('session.noMatchClock'));
        assert.equal(localized.score, t('session.scoreUnspecified'));
        assert.notEqual(localized.half, 'matchPhase.shootout');
        assert.notEqual(localized.time, 'session.noMatchClock');
        assert.notEqual(localized.score, 'session.scoreUnspecified');
        assert.equal(localized.correctIndex, scenario.correctIndex);
      }
    }
    continue;
  }
  if (!ids.has(bank.id)) {
    assert.equal(scenario.half, bank.minute <= 30 ? 'First Half' : 'Second Half');
    assert.equal(scenario.time, `${bank.minute}′`);
    unchanged++;
    continue;
  }
  corrected++;
  assert.equal(scenario.half, 'Extra Time');
  for (const [lang, [half, time]] of Object.entries(labels)) {
    for (const input of [scenario, { ...scenario, half: 'Second Half', time: '60′' }]) {
      const localized = localizeGKScenario(input, lang, createTranslator(lang));
      assert.equal(localized.half, half, `${bank.id}: ${lang}`);
      assert.equal(localized.time, time, `${bank.id}: ${lang}`);
      assert.equal(localized.score, bank.score);
      assert.equal(localized.correctIndex, scenario.correctIndex);
    }
  }
}
assert.equal(corrected, 6);
assert.equal(unchanged, 685);
console.log('PASS: six extra-time contexts and one shootout in three languages, including saved sessions; 685 other contexts unchanged');
