#!/usr/bin/env node
/**
 * Final i18n quality audit — run: node scripts/i18n-quality-audit.mjs
 * Audit-only. Does not modify source files.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

function parseLocaleKeys(file) {
  const content = readFileSync(join(ROOT, file), 'utf8');
  const entries = {};
  for (const m of content.matchAll(/'([^']+)':\s*'((?:\\'|[^'])*)'/g)) {
    entries[m[1]] = m[2].replace(/\\'/g, "'");
  }
  return entries;
}

function parseScenarioMaps() {
  const content = readFileSync(join(ROOT, 'locales/scenario-text.ts'), 'utf8');
  const hr = {};
  const de = {};
  const hrBlock = content.match(/export const scenarioTextHr[^=]*=\s*\{([\s\S]*?)\n\};/);
  const deBlock = content.match(/export const scenarioTextDe[^=]*=\s*\{([\s\S]*?)\n\};/);
  for (const block of [hrBlock, deBlock]) {
    if (!block) continue;
    const target = block === hrBlock ? hr : de;
    for (const m of block[1].matchAll(/'((?:\\'|[^'])*)':\s*'((?:\\'|[^'])*)'/g)) {
      target[m[1].replace(/\\'/g, "'")] = m[2].replace(/\\'/g, "'");
    }
  }
  return { hr, de };
}

function extractGkScenarios() {
  const content = readFileSync(join(ROOT, 'lib/scenarios.ts'), 'utf8');
  const scenarios = [];
  const blocks = content.split(/\{\s*\n\s*id:\s*\d+/).slice(1);
  for (let i = 0; i < blocks.length; i++) {
    const block = '{ id: ' + (i + 1) + blocks[i];
    const get = (field) => {
      const re = new RegExp(`${field}:\\s*\\n\\s*'((?:\\\\'|[^'])*)'`, 'm');
      const m = block.match(re);
      return m ? m[1].replace(/\\'/g, "'") : null;
    };
    const getArr = (field) => {
      const re = new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\],`, 'm');
      const m = block.match(re);
      if (!m) return [];
      return [...m[1].matchAll(/'((?:\\'|[^'])*)'/g)].map((x) => x[1].replace(/\\'/g, "'"));
    };
    scenarios.push({
      id: i + 1,
      situation: get('situation'),
      question: get('question'),
      options: getArr('options'),
      explanation: get('explanation'),
      metric: get('metric')?.replace(/,\s*$/, ''),
      situation_hr: get('situation_hr'),
      question_hr: get('question_hr'),
      options_hr: getArr('options_hr'),
      explanation_hr: get('explanation_hr'),
    });
  }
  return scenarios;
}

const TERMINOLOGY = {
  'Goalkeeper': { hr: ['vratar', 'Vratar'], de: ['Torwart', 'torwart'] },
  'Pivot': { hr: ['pivot', 'Pivot'], de: ['Kreis', 'kreis'] },
  'Left Wing': { hr: ['Lijevo krilo', 'lijevo krilo'], de: ['Linksaußen', 'linksaußen'] },
  'Right Wing': { hr: ['Desno krilo', 'desno krilo'], de: ['Rechtsaußen', 'rechtsaußen'] },
  'Centre Back': { hr: ['Srednji vanjski', 'srednji vanjski', 'centar'], de: ['Rückraum Mitte', 'Rückraum'] },
  'Fast Break': { hr: ['Kontranapad', 'kontranapad', 'brzi napad'], de: ['Tempogegenstoß', 'tempogegenstoß', 'Konter'] },
  'Decision Score': { hr: ['Rezultat odluka', 'rezultat odluka', 'ocjena odluke'], de: ['Entscheidungsscore', 'entscheidungsscore'] },
  'Match Simulator': { hr: ['Simulator utakmice', 'simulator'], de: ['Spielsimulator', 'simulator'] },
  'Training Session': { hr: ['Trening', 'trening', 'sesija'], de: ['Training', 'Einheit', 'einheit'] },
};

const ENGLISH_LEAK = /\b(the|and|your|should|before|after|with|without|goalkeeper|shooter|wing shot|fast break)\b/i;
const KEY_PATTERN = /^[a-z][a-zA-Z0-9]*(\.[a-zA-Z][a-zA-Z0-9.]*)+$/;

const issues = [];

const en = parseLocaleKeys('locales/en.ts');
const hr = parseLocaleKeys('locales/hr.ts');
const de = parseLocaleKeys('locales/de.ts');
const { hr: scenarioHr, de: scenarioDe } = parseScenarioMaps();
const scenarioEn = JSON.parse(readFileSync(join(ROOT, 'scripts/scenario-strings-en.json'), 'utf8'));

// 1. UI key parity
for (const k of Object.keys(en)) {
  if (!(k in hr)) issues.push({ severity: 'error', category: 'missing_translation', lang: 'hr', key: k });
  if (!(k in de)) issues.push({ severity: 'error', category: 'missing_translation', lang: 'de', key: k });
}

for (const [lang, dict] of [['hr', hr], ['de', de]]) {
  for (const [k, v] of Object.entries(dict)) {
    if (v === k || KEY_PATTERN.test(v)) {
      issues.push({ severity: 'error', category: 'fallback_key', lang, key: k, value: v });
    }
    if (!v.trim()) {
      issues.push({ severity: 'error', category: 'empty_translation', lang, key: k });
    }
    if (lang !== 'en' && ENGLISH_LEAK.test(v) && !v.includes('IQ') && k.startsWith('position.') === false) {
      // heuristic only for non-proper-noun keys
      if (!k.includes('language') && !k.includes('English')) {
        issues.push({ severity: 'warn', category: 'possible_english_leak', lang, key: k, value: v.slice(0, 80) });
      }
    }
  }
}

// 2. Terminology consistency (position/skill keys)
const termChecks = [
  ['position.goalkeeper', 'Goalkeeper'],
  ['position.pivot', 'Pivot'],
  ['position.leftWing', 'Left Wing'],
  ['position.rightWing', 'Right Wing'],
  ['position.centreBack', 'Centre Back'],
  ['scenarioType.fastBreak', 'Fast Break'],
  ['term.decisionScore', 'Decision Score'],
  ['home.playMatch', 'Match Simulator'],
  ['training.beginSession', 'Training Session'],
];

for (const [key, concept] of termChecks) {
  const spec = TERMINOLOGY[concept];
  if (!spec) continue;
  for (const lang of ['hr', 'de']) {
    const dict = lang === 'hr' ? hr : de;
    const val = dict[key];
    if (!val) continue;
    const ok = spec[lang].some((frag) => val.toLowerCase().includes(frag.toLowerCase()));
    if (!ok) {
      issues.push({ severity: 'warn', category: 'terminology', lang, key, concept, value: val });
    }
  }
}

// 3. Scenario content strings
for (const s of scenarioEn) {
  if (!scenarioHr[s] || scenarioHr[s] === s) {
    issues.push({ severity: 'error', category: 'scenario_missing_hr', text: s.slice(0, 100) });
  }
  if (!scenarioDe[s] || scenarioDe[s] === s) {
    issues.push({ severity: 'error', category: 'scenario_missing_de', text: s.slice(0, 100) });
  }
}

// 4. GK quiz scenarios (structured)
const gk = extractGkScenarios();
for (const s of gk) {
  const label = `GK#${s.id}`;
  for (const field of ['situation', 'question', 'explanation']) {
    for (const lang of ['hr', 'de']) {
      const map = lang === 'hr' ? scenarioHr : scenarioDe;
      const enText = s[field];
      const hasField = lang === 'hr' ? s[`${field}_hr`] : map[enText];
      if (!hasField && (!map[enText] || map[enText] === enText)) {
        issues.push({ severity: 'error', category: 'gk_missing', lang, scenario: label, field });
      }
    }
  }
  if (s.options.length !== 4) {
    issues.push({ severity: 'error', category: 'gk_invalid', scenario: label, detail: `options=${s.options.length}` });
  }
  s.options.forEach((o, i) => {
    for (const lang of ['hr', 'de']) {
      const map = lang === 'hr' ? scenarioHr : scenarioDe;
      const hasHr = s.options_hr?.[i];
      if (lang === 'hr' && !hasHr) {
        issues.push({ severity: 'error', category: 'gk_missing', lang, scenario: label, field: `option_${i}` });
      }
      if (lang === 'de' && (!map[o] || map[o] === o)) {
        issues.push({ severity: 'error', category: 'gk_missing', lang, scenario: label, field: `option_${i}` });
      }
    }
  });
  if (!s.metric) {
    issues.push({ severity: 'warn', category: 'gk_missing', scenario: label, field: 'metric/category' });
  }
}

// 5. Hardcoded UI in app (strict)
const UI_RE = /<Text[^>]*>([^<{][^<]{3,})<\//g;
function walkApp(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkApp(p, files);
    else if (p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

for (const file of walkApp(join(ROOT, 'app'))) {
  const rel = file.replace(ROOT + '/', '');
  const content = readFileSync(file, 'utf8');
  for (const m of content.matchAll(UI_RE)) {
    const text = m[1].trim();
    if (/^[A-Za-z][A-Za-z .,'!?:-]{3,}$/.test(text) && !text.includes('IQ')) {
      issues.push({ severity: 'error', category: 'hardcoded_ui', file: rel, text });
    }
  }
}

const errors = issues.filter((i) => i.severity === 'error');
const warns = issues.filter((i) => i.severity === 'warn');

console.log('=== i18n QUALITY AUDIT ===\n');
console.log('UI keys: en', Object.keys(en).length, '| hr', Object.keys(hr).length, '| de', Object.keys(de).length);
console.log('Scenario content strings:', scenarioEn.length);
console.log('GK structured scenarios:', gk.length);
console.log('\nErrors:', errors.length);
console.log('Warnings:', warns.length);

const grouped = {};
for (const i of errors) {
  grouped[i.category] ??= [];
  grouped[i.category].push(i);
}
for (const [cat, items] of Object.entries(grouped)) {
  console.log(`\n--- ${cat} (${items.length}) ---`);
  items.slice(0, 8).forEach((x) => console.log(JSON.stringify(x)));
  if (items.length > 8) console.log(`  ... +${items.length - 8} more`);
}

if (warns.length) {
  console.log(`\n--- warnings (${warns.length}) ---`);
  warns.slice(0, 10).forEach((x) => console.log(JSON.stringify(x)));
  if (warns.length > 10) console.log(`  ... +${warns.length - 10} more`);
}

const pass = errors.length === 0;
console.log('\n=== RESULT:', pass ? 'PASS' : 'FAIL', '===');
process.exit(pass ? 0 : 1);
