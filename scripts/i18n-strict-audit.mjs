#!/usr/bin/env node
/**
 * Strict localization audit — fails on engine/mock user-facing English strings.
 * Run: node scripts/i18n-strict-audit.mjs
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

const ENGINE_FILES = [
  'lib/coach-engine.ts',
  'lib/coach-dashboard-data.ts',
];

/** Files with canonical English scenario source resolved via scenario-text / localizeMatchSituation at display time. */
const CANONICAL_SOURCE_FILES = ['lib/match-engine.ts'];

const ENGLISH_SENTENCE = /(?:^|[\s({=])['"]([A-Z][^'"]{20,})['"]/g;
const ALLOWED_PATTERNS = [
  /^[A-Z][a-z]+( [A-Z][a-z]+)*$/,
  /^[a-z_]+$/,
  /^\/\//,
  /__DEV__/,
  /Berlin/,
  /Hamburg/,
  /Goalkeeper/,
  /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/,
  /Wing Shot|Fast Break|7m Throw|Pivot/,
  /Standard 6-0/,
  /player_/,
  /evt_/,
  /coach_/,
  /asg_/,
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'dist') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(p);
  }
  return out;
}

function parseLocaleKeys() {
  const en = readFileSync(join(ROOT, 'locales/en.ts'), 'utf8');
  const coach = readFileSync(join(ROOT, 'locales/coach-engine-messages.ts'), 'utf8');
  const keys = new Set();
  for (const m of (en + coach).matchAll(/'([^']+)':\s*(?:'|coachEngine)/g)) keys.add(m[1]);
  for (const m of (en + coach).matchAll(/'([^']+)':\s*'/g)) keys.add(m[1]);
  return keys;
}

function isAllowedString(s) {
  if (s.length < 20) return true;
  if (s.includes('${') || s.includes('{')) return true;
  if (/^[A-Z][a-zA-Z0-9:.\-\/ ]{0,40}$/.test(s) && !s.includes(' you ') && !s.includes(' your ')) return true;
  return ALLOWED_PATTERNS.some((re) => re.test(s));
}

function auditMatchEngineCanonical(rel) {
  const content = readFileSync(join(ROOT, rel), 'utf8');
  const issues = [];
  const forbidden = [
    /summary:\s*['"][A-Z]/,
    /finalMessage:\s*['"][A-Z]/,
    /strengths\.push\(/,
    /areasToImprove\.push\(/,
    /generateSummary/,
    /generateFinalMessage/,
    /generateHalftimeMessage/,
  ];
  for (const re of forbidden) {
    if (re.test(content)) issues.push({ file: rel, line: 0, text: `Forbidden pattern: ${re}` });
  }
  return issues;
}

function auditEngineFile(rel) {
  const content = readFileSync(join(ROOT, rel), 'utf8');
  const issues = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('//')) continue;
    if (line.includes('import ')) continue;
    if (line.includes('console.')) continue;

    for (const m of line.matchAll(/['"]([A-Z][^'"]{24,})['"]/g)) {
      const s = m[1];
      if (isAllowedString(s)) continue;
      if (s.startsWith('coach.') || s.startsWith('cd') || s.startsWith('matchReport.')) continue;
      issues.push({ file: rel, line: i + 1, text: s.slice(0, 80) });
    }

    for (const m of line.matchAll(/`([^`]{30,})`/g)) {
      const s = m[1];
      if (s.includes('${')) continue;
      if (/^[a-z_]+$/.test(s)) continue;
      issues.push({ file: rel, line: i + 1, text: s.slice(0, 80) });
    }
  }
  return issues;
}

function auditMissingKeys(keys) {
  const sources = [
    ...walk(join(ROOT, 'lib')).filter((f) => f.endsWith('-i18n.ts') || f.endsWith('coach-i18n.ts')),
    ...walk(join(ROOT, 'app')),
  ];
  const missing = new Set();
  const keyRe = /(?:t|msg)\(\s*['"]([^'"]+)['"]/g;
  for (const file of sources) {
    const content = readFileSync(file, 'utf8');
    for (const m of content.matchAll(keyRe)) {
      const k = m[1];
      if (!keys.has(k) && (k.startsWith('coach.') || k.startsWith('cd') || k.startsWith('category.') || k.startsWith('defensiveSystem.'))) {
        if (k === 'coach.todaysMessage') continue;
        missing.add(k);
      }
    }
  }
  return [...missing];
}

const enKeys = parseLocaleKeys();
const engineIssues = [
  ...ENGINE_FILES.flatMap(auditEngineFile),
  ...CANONICAL_SOURCE_FILES.flatMap(auditMatchEngineCanonical),
];
const missingKeys = auditMissingKeys(enKeys);

let score = 100;
score -= engineIssues.length * 5;
score -= missingKeys.length * 3;
score = Math.max(0, score);

console.log('=== i18n Strict Audit ===');
console.log(`Score: ${score}/100`);
console.log(`Engine English strings: ${engineIssues.length}`);
console.log(`Missing keys: ${missingKeys.length}`);

if (engineIssues.length) {
  console.log('\nEngine issues:');
  for (const i of engineIssues.slice(0, 30)) {
    console.log(`  ${i.file}:${i.line}  ${i.text}`);
  }
}
if (missingKeys.length) {
  console.log('\nMissing keys:');
  for (const k of missingKeys.slice(0, 30)) console.log(`  ${k}`);
}

const pass = engineIssues.length === 0 && missingKeys.length === 0;
console.log(`\nResult: ${pass ? 'PASS' : 'FAIL'}`);
process.exit(pass ? 0 : 1);
