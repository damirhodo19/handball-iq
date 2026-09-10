#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRuntime } from './lib/localization-test-runtime.mjs';

const runtime = createRuntime();
const { load, storage } = runtime;
const { createTranslator, pickLocalizedText } = load('@/lib/locale-text');
const { normalizeSupportedLanguage } = load('@/lib/locale');
const { translations } = load('@/locales');
const { POSITION_CONFIGS } = load('@/lib/positions');
const { localizeContent, getLocalizedSessionInfo } = load('@/lib/content-localize');
const { localizeGKScenario, localizeMatchSituation, localizeTacticalScenario } = load('@/lib/scenario-localize');
const { getAllScenarios, toGKScenario, toMatchTemplate, toTacticalScenario } = load('@/lib/scenario-bank');
const { generatePositionMatch } = load('@/lib/position-scenarios');
const { getDailyChallengeScenarios } = load('@/lib/development/daily-challenge');
const { loadActiveTrainingSession, saveActiveTrainingSession } = load('@/lib/development/active-session');
const { resolveTrainingScenariosAsGk } = load('@/lib/platform/content-resolver');
const { getOrCreateWeeklyProgram } = load('@/lib/development/weekly-program');
const labels = load('@/lib/translations');
const bank = getAllScenarios();
const errors = [];
let assertions = 0;
function check(condition, message) { assertions++; if (!condition) errors.push(message); }
const languages = ['en', 'hr', 'de'];
const hash = () => createHash('sha256').update(readFileSync('content/scenario-bank/scenarios.json')).digest('hex');
const before = hash();
const bankBefore = JSON.stringify(bank);

for (const [raw, expected] of Object.entries({ hr: 'hr', de: 'de', en: 'en', 'hr-HR': 'hr', 'de-DE': 'de', 'en-US': 'en', HR_hr: 'hr', Croatian: 'hr', German: 'de' })) {
  check(normalizeSupportedLanguage(raw) === expected, `normalize ${raw}`);
  check(createTranslator(raw)('common.continue') === createTranslator(expected)('common.continue'), `translator ${raw}`);
  check(pickLocalizedText({ en: 'English', hr: 'Hrvatski', de: 'Deutsch' }, raw) === { en: 'English', hr: 'Hrvatski', de: 'Deutsch' }[expected], `localized object ${raw}`);
}

for (const lang of languages) {
  const t = createTranslator(lang);
  for (const [key, value] of Object.entries(translations.en)) {
    check(typeof translations[lang][key] === 'string' && Boolean(translations[lang][key].trim()), `${lang} missing key ${key}`);
    const placeholders = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort().join(',');
    check(placeholders(value) === placeholders(translations[lang][key]), `${lang} placeholders ${key}`);
  }
  for (const [position, config] of Object.entries(POSITION_CONFIGS)) {
    const profile = { ...load('@/lib/storage').loadProfile(), name: 'Locale test', position, role: 'player', onboardingVersion: 2 };
    storage.setItem('hbiq_profile', JSON.stringify(profile));
    const info = getLocalizedSessionInfo(lang, position);
    for (const field of ['title', 'description', 'subtitle']) {
      check(Boolean(info[field]) && !info[field].includes('training.positionIq'), `${lang} ${position} intro ${field}`);
      if (lang !== 'en' && !(lang === 'hr' && position === 'Pivot' && field === 'subtitle')) check(info[field] !== getLocalizedSessionInfo('en', position)[field], `${lang} ${position} English intro ${field}`);
    }
    const sourceLabels = [config.dailySessionTitle, config.dailySessionDesc, ...config.scenarioCategories.flatMap(c => [c.name, c.description]), ...config.trainingPlanFocus];
    for (const text of sourceLabels) {
      if (lang !== 'en') check(localizeContent(text, lang, t) !== text, `${lang} untranslated position copy: ${text}`);
    }
    const weekly = getOrCreateWeeklyProgram(position);
    for (const day of weekly.days) {
      const focus = localizeContent(day.focus, lang, t);
      check(!/^(sprint\d|program)\./.test(focus), `${lang} raw weekly focus ${focus}`);
      if (lang !== 'en') check(focus !== day.focus || day.focus === 'Pivot', `${lang} untranslated weekly focus ${focus}`);
    }
    const session = resolveTrainingScenariosAsGk(position, profile, 5);
    check(session.length >= 3, `${lang} ${position} training empty`);
    const ids = session.map(s => s.bankId);
    // Assigned and cached sessions resolve the same canonical IDs at display time.
    saveActiveTrainingSession({ position, bankIds: ids, startedAt: '2026-09-09T12:00:00Z' });
    const restored = loadActiveTrainingSession();
    const daily = getDailyChallengeScenarios({ scenarioIds: restored.bankIds }, position);
    check(daily.map(s => s.bankId).join() === ids.join(), `${lang} ${position} cached/assigned order changed`);
    for (const scenario of daily) {
      const source = bank.find(s => s.id === scenario.bankId);
      const view = localizeGKScenario(scenario, lang, t);
      check(view.question === source.question[lang], `${lang} ${position} daily/cached question`);
      check(view.half === labels.translateMatchPhase(scenario.half, t), `${lang} ${position} session half`);
      check(view.correctIndex === scenario.correctIndex, 'Answer quality changed');
    }
    const match = generatePositionMatch(position, lang);
    for (const situation of match) {
      const view = localizeMatchSituation(situation, lang, t);
      if (lang !== 'en') {
        check(view.scenarioType !== situation.scenarioType, `${lang} ${position} match header ${situation.scenarioType}`);
        check(view.formation !== situation.formation, `${lang} ${position} formation ${situation.formation}`);
      }
    }
  }
  for (const scenario of bank) {
    check(bank.filter(s => s.title.en === scenario.title.en).some(s => localizeContent(scenario.title.en, lang, t) === s.title[lang]), `${lang} saved scenario title ${scenario.id}`);
    const raw = toGKScenario(scenario, 1);
    const view = localizeGKScenario(raw, lang, t);
    check(view.situation === scenario.situation[lang], `${lang} ${scenario.id} situation`);
    check(view.question === scenario.question[lang], `${lang} ${scenario.id} question`);
    check(view.explanation === scenario.explanation[lang], `${lang} ${scenario.id} explanation`);
    const template = toMatchTemplate(scenario);
    const match = localizeMatchSituation({ ...template, scenarioType: template.type, scenarioType_hr: template.type_hr, scenarioType_de: template.type_de, formation: 'Standard 6-0 defence' }, lang, t);
    check(match.scenarioType === scenario.title[lang], `${lang} ${scenario.id} match title`);
    scenario.answers.forEach((answer, i) => {
      check(view.options[i] === answer.text[lang], `${lang} ${scenario.id} option ${i}`);
      check(match.decisions[i].feedback === answer.feedback[lang], `${lang} ${scenario.id} feedback ${i}`);
    });
    const tactical = localizeTacticalScenario(toTacticalScenario(scenario), lang, t);
    check(tactical.type === scenario.title[lang], `${lang} ${scenario.id} Match Day header`);
    check(tactical.description === scenario.situation[lang], `${lang} ${scenario.id} Match Day description`);
  }
}

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : /\.tsx?$/.test(entry.name) ? [`${dir}/${entry.name}`] : []);
for (const file of ['app', 'components', 'hooks', 'context', 'lib'].flatMap(walk)) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/\b(?:t|msg)\(['"]([^'"]+)['"]/g)) {
    for (const lang of languages) check(Boolean(translations[lang][match[1]]), `${file}: ${lang} missing ${match[1]}`);
  }
}
check(hash() === before && JSON.stringify(bank) === bankBefore, 'Scenario bank mutated');
console.log(`Localization assertions: ${assertions}; scenarios: ${bank.length}; languages: EN/HR/DE`);
if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  throw new Error(`${errors.length} localization checks failed`);
}
assert.equal(errors.length, 0);
console.log('PASS: locale resolution, position/session metadata, daily/assigned/cached IDs, Match Simulator, Match Day, keys, and immutable bank');
