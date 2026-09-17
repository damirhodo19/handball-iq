import assert from 'node:assert/strict';
import { createRuntime } from './lib/localization-test-runtime.mjs';

const { load } = createRuntime();
const { calculatePlayerIq, PLAYER_IQ_MIN_ANSWERS } = load('@/lib/player-iq');
const { sessionResultToRecord } = load('@/services/sessionService');
const { createTranslator } = load('@/lib/locale-text');
const { translations } = load('@/locales');
const session = (...answers) => ({ metrics: answers.map(correct => ({ correct })) });
assert.equal(PLAYER_IQ_MIN_ANSWERS, 5);
assert.equal(calculatePlayerIq([]).overall, null);
assert.equal(calculatePlayerIq([session(true, true, true, true)]).overall, null);
assert.equal(calculatePlayerIq([session(false, false, false, false, false)]).overall, 0);
assert.equal(calculatePlayerIq([session(true, true, true, true, true)]).overall, 100);
// Unequal session lengths must weight answers equally, including incorrect answers.
const input = [session(true), session(false, false, false, false, false)];
const before = JSON.stringify(input);
assert.equal(calculatePlayerIq(input).overall, 17);
assert.equal(JSON.stringify(input), before);
const malformed = [{}, { metrics: null }, { metrics: [null, {}, { correct: 'true' }, { correct: 1 }] }];
assert.equal(calculatePlayerIq(malformed).sampleCount, 0);
const answers = [true, false, true, false, true].map(correct => ({ metric: 'untrusted', correct }));
const remote = sessionResultToRecord({ id: 'test', answers, decision_score: 99 });
assert.equal(calculatePlayerIq([remote]).overall, 60);
assert.equal(calculatePlayerIq([remote]).sampleCount, 5);
const keys = ['home.overallIq', 'profile.handballIqTitle', 'profile.playerIqPending',
  'profile.playerIqSample', 'profile.playerIqFormula', 'profile.playerIqDetailsUnavailable'];
for (const lang of ['en', 'hr', 'de']) {
  const t = createTranslator(lang);
  for (const key of keys) {
    assert.equal(typeof translations[lang][key], 'string', `${lang}: ${key}`);
    assert.ok(t(key, { n: 6, min: 5 }).trim());
    assert.notEqual(t(key), key);
    assert.doesNotMatch(t(key, { n: 6, min: 5 }), /\{\w+\}/);
  }
  assert.ok(t('profile.playerIqSample', { n: 6 }).includes('6'));
  assert.ok(t('profile.playerIqFormula', { min: 5 }).includes('5'));
}
assert.notEqual(translations.hr['profile.playerIqDetailsUnavailable'], translations.en['profile.playerIqDetailsUnavailable']);
assert.notEqual(translations.de['profile.playerIqDetailsUnavailable'], translations.en['profile.playerIqDetailsUnavailable']);
console.log('PASS: Player IQ calculation, cloud answer mapping and EN/HR/DE labels');
