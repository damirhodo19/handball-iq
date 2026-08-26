#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const failures = [];

function read(relativePath) {
  return readFileSync(join(ROOT, relativePath), 'utf8');
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

function decodeSingleQuoted(value) {
  return value
    .replace(/\\'/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\\\/g, '\\');
}

function quotedStrings(source) {
  return [...source.matchAll(/'((?:\\.|[^'\\])*)'/g)].map((match) => decodeSingleQuoted(match[1]));
}

function directLocaleEntries(relativePath) {
  const entries = new Map();
  const source = read(relativePath);
  for (const match of source.matchAll(/'([^']+)':\s*'((?:\\.|[^'\\])*)'/g)) {
    entries.set(match[1], decodeSingleQuoted(match[2]));
  }
  return entries;
}

function assertIncludes(relativePath, fragments) {
  const source = read(relativePath);
  for (const fragment of fragments) {
    check(source.includes(fragment), `${relativePath} is missing required guard: ${fragment}`);
  }
}

const bankRaw = read('content/scenario-bank/scenarios.json');
const bank = JSON.parse(bankRaw);
const expectedBankHash = '735413ec250062ade3b710e973c51a9d7a22a5c501946e42e962464d1dbcfd20';
const actualBankHash = createHash('sha256').update(bankRaw).digest('hex');
check(actualBankHash === expectedBankHash, `Gold bank hash changed: ${actualBankHash}`);
check(bank.length === 692, `Gold bank count changed: ${bank.length}`);
check(new Set(bank.map((scenario) => scenario.id)).size === bank.length, 'Gold bank scenario IDs are not unique');

for (const scenario of bank) {
  for (const field of ['title', 'situation', 'question', 'explanation']) {
    for (const lang of ['en', 'hr', 'de']) {
      check(Boolean(scenario[field]?.[lang]?.trim()), `${scenario.id} is missing ${field}.${lang}`);
    }
  }
  check(Array.isArray(scenario.answers) && scenario.answers.length >= 2, `${scenario.id} has invalid answers`);
  for (const [index, answer] of (scenario.answers ?? []).entries()) {
    for (const field of ['text', 'feedback']) {
      for (const lang of ['en', 'hr', 'de']) {
        check(Boolean(answer[field]?.[lang]?.trim()), `${scenario.id} answer ${index} is missing ${field}.${lang}`);
      }
    }
  }
}

const localeEntries = {
  en: directLocaleEntries('locales/en.ts'),
  hr: directLocaleEntries('locales/hr.ts'),
  de: directLocaleEntries('locales/de.ts'),
};
const requiredKeys = [
  'error.unknown',
  'dev.achievementUnlocked',
  'errorBoundary.title',
  'errorBoundary.body',
  'match.scoreboardA11y',
  'match.configOpponent',
];
for (const key of requiredKeys) {
  for (const lang of ['en', 'hr', 'de']) {
    check(Boolean(localeEntries[lang].get(key)?.trim()), `${lang} is missing ${key}`);
  }
}
check(localeEntries.hr.get('match.configOpponent') === 'Protivnik', 'Croatian opponent label is not localized');
check(localeEntries.de.get('match.configOpponent') === 'Gegner', 'German opponent label is not localized');

const positionsSource = read('lib/positions.ts');
const reminderBlocks = [...positionsSource.matchAll(/matchDayReminders:\s*\[([\s\S]*?)\]/g)];
const reminders = new Set(reminderBlocks.flatMap((match) => quotedStrings(match[1])));
const matchDayCatalog = new Set();
for (const match of read('lib/match-day-localize.ts').matchAll(
  /^\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"):\s*\{/gm,
)) {
  matchDayCatalog.add(decodeSingleQuoted(match[1] ?? match[2]));
}
for (const reminder of reminders) {
  check(matchDayCatalog.has(reminder), `Match Day reminder is not localized: ${reminder}`);
}

assertIncludes('context/SessionContext.tsx', [
  'hasLocalizedAdminScenario(s, lang)',
  'situation_hr: s.situation_hr',
  'situation_de: s.situation_de',
  '}, [lang]);',
]);
assertIncludes('context/MatchContext.tsx', [
  "type: 'START'; position: HandballPosition; lang: SupportedLanguage",
  'generatePositionMatch(action.position, action.lang)',
  "dispatch({ type: 'START', position, lang })",
]);
assertIncludes('lib/position-scenarios.ts', [
  'hasLocalizedAdminScenario(s, lang)',
  'text_hr: s.answerOptions_hr?.[i]',
  'text_de: s.answerOptions_de?.[i]',
  "lang: SupportedLanguage = 'en'",
]);
assertIncludes('services/scenarioService.ts', [
  'situation_hr: s.situation_hr',
  'situation_de: s.situation_de',
  'answer_options_hr: s.answerOptions_hr',
  'answer_options_de: s.answerOptions_de',
]);
assertIncludes('lib/locale.ts', [
  "normalized.split('-')[0]",
  "croatian: 'hr'",
  "german: 'de'",
]);
assertIncludes('app/match-day/prepare.tsx', ['localizeMatchDayText(text, lang, t)']);
assertIncludes('app/match-day/history.tsx', [
  'localeTagForLanguage(lang)',
  'resolveDefaultStatement(prep.personalStatement, t)',
]);
assertIncludes('app/(tabs)/profile.tsx', [
  'translateStoredActivityTitle(item.title, item.type, t)',
  'localeTagForLanguage(lang)',
]);
assertIncludes('app/team-calendar.tsx', [
  "event.event_type !== 'assigned_session'",
  'translateCategory(category, t)',
  'translatePosition(position, t)',
]);
const layoutSource = read('app/_layout.tsx');
check(
  layoutSource.indexOf('<LanguageProvider>') < layoutSource.indexOf('<AppErrorBoundary>'),
  'AppErrorBoundary must render inside LanguageProvider',
);

const migration = read('supabase/migrations/20260826100000_scenario_de_localization.sql');
for (const column of [
  'title_de',
  'situation_de',
  'question_de',
  'answer_options_de',
  'explanation_de',
  'learning_objective_de',
  'common_mistake_de',
  'coach_note_de',
]) {
  check(migration.includes(`ADD COLUMN IF NOT EXISTS ${column}`), `Migration is missing ${column}`);
}

if (failures.length) {
  console.error(`Localization runtime validation failed with ${failures.length} issue(s)`);
  for (const failure of failures.slice(0, 80)) console.error(`  ${failure}`);
  process.exit(1);
}

console.log(`Localization runtime validation passed`);
console.log(`Gold scenarios checked: ${bank.length}`);
console.log(`Position reminders checked: ${reminders.size}`);
console.log(`Required locale keys checked: ${requiredKeys.length * 3}`);
