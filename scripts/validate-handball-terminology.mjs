#!/usr/bin/env node
/**
 * Validates Handball IQ terminology consistency across the project.
 * Run: node scripts/validate-handball-terminology.mjs
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const terminology = JSON.parse(
  readFileSync(join(root, 'locales/handball-terminology.json'), 'utf8'),
);

const LANGS = ['en', 'hr', 'de'];
const SCAN_DIRS = ['app', 'lib', 'locales', 'content', 'components', 'scripts'];
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.json', '.mjs']);
const SKIP_FILES = new Set([
  'locales/handball-terminology.json',
  'locales/scenario-text.ts',
  'content/scenario-bank/scenarios.json',
  'scripts/.scenario-bank-translations-cache.json',
  'scripts/.scenario-translations-cache.json',
  'scripts/scenario-content-report.json',
  'scripts/handball-terminology-report.json',
  'scripts/fix-handball-terminology.mjs',
  'scripts/hr-mt-fixes.mjs',
  'scripts/rewrite-hr-scenario-voice.mjs',
  'scripts/validate-handball-terminology.mjs',
  'scripts/sync-handball-terminology-locales.mjs',
  'scripts/scenario-bank/glossary.mjs',
]);

/** Legacy normalize maps may still mention old labels to map saved prefs → canonical IDs. */
const ALLOW_FORBIDDEN_IN = new Set([
  'lib/platform/tactical-systems.ts',
]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = full.slice(root.length + 1);
    if (entry === 'node_modules' || entry === '.git' || entry === '.expo') continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (SCAN_EXTENSIONS.has(extname(entry)) && !SKIP_FILES.has(rel)) files.push(full);
  }
  return files;
}

function extractLocaleValue(content, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`'${escaped}':\\s*'((?:\\\\'|[^'])*)'`);
  const m = content.match(re);
  return m ? m[1].replace(/\\'/g, "'") : undefined;
}

const report = {
  version: terminology.version,
  status: 'PASS',
  managedTerms: terminology.terms.length,
  localeMismatches: [],
  forbiddenHits: [],
  bankMtHits: [],
  replacedTerms: [],
  manualReview: [],
  filesScanned: 0,
};

// 1. Verify base locale files align with terminology (pre-merge baseline)
for (const lang of LANGS) {
  const content = readFileSync(join(root, `locales/${lang}.ts`), 'utf8');
  for (const term of terminology.terms) {
    if (!term.localeKey) continue;
    const expected = term[lang];
    const actual = extractLocaleValue(content, term.localeKey);
    if (actual !== undefined && actual !== expected) {
      report.localeMismatches.push({
        lang,
        key: term.localeKey,
        expected,
        actual,
        note: 'Runtime uses terminology override; update locale file or remove duplicate',
      });
    }
  }
}

// 2. Scan for forbidden synonyms
const forbiddenPatterns = [];
for (const lang of LANGS) {
  const groups = terminology.forbiddenSynonyms[lang] ?? {};
  for (const [termId, words] of Object.entries(groups)) {
    for (const word of words) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Prefer word boundaries for short tokens to avoid DE "Unbekannt" / display-UI false positives.
      const needsBoundary = !/\s/.test(word) && word.length <= 8;
      forbiddenPatterns.push({
        lang,
        termId,
        word,
        re: new RegExp(needsBoundary ? `\\b${escaped}\\b` : escaped, 'gi'),
      });
    }
  }
}

const files = [];
for (const dir of SCAN_DIRS) {
  const full = join(root, dir);
  try {
    walk(full, files);
  } catch {
    /* dir may not exist */
  }
}
report.filesScanned = files.length;

for (const file of files) {
  const rel = file.slice(root.length + 1);
  if (ALLOW_FORBIDDEN_IN.has(rel)) continue;
  const content = readFileSync(file, 'utf8');

  for (const { lang, termId, word, re } of forbiddenPatterns) {
    if (rel.endsWith('.json') && rel.includes('scenario')) continue;
    if (rel === 'locales/handball-terminology.ts') continue;

    const isLangLocale =
      rel === `locales/${lang}.ts` ||
      (lang === 'hr' &&
        (rel === 'locales/hr.ts' ||
          rel.startsWith('locales/sprint') ||
          rel === 'locales/coach-engine-messages.ts' ||
          rel === 'locales/closed-beta-messages.ts')) ||
      (lang === 'de' &&
        (rel === 'locales/de.ts' ||
          rel.startsWith('locales/sprint') ||
          rel === 'locales/coach-engine-messages.ts' ||
          rel === 'locales/closed-beta-messages.ts'));

    const isAppLib = rel.startsWith('app/') || rel.startsWith('lib/');
    if (!isLangLocale && !isAppLib) continue;

    if (word.toLowerCase() === 'keeper' && lang === 'en' && !rel.includes('/hr.') && rel !== 'locales/hr.ts') {
      continue;
    }

    // Skip EN identifier noise for HR football "bek" in TypeScript identifiers
    if (lang === 'hr' && isAppLib && word.toLowerCase() === 'bek') continue;

    re.lastIndex = 0;
    if (re.test(content)) {
      // For sprint packs, only flag HR string values roughly by checking nearby quotes with Croatian context
      if (rel.startsWith('locales/sprint') || rel.includes('coach-engine') || rel.includes('closed-beta')) {
        // Only count when the language section likely contains the hit for that lang
        if (lang === 'hr' && !/MessagesHr|_hr\b|const hr|export const \w+Hr/i.test(rel + content.slice(0, 200))) {
          // still scan — multi-lang files embed HR blocks; require a HR-ish context around match
        }
      }
      report.forbiddenHits.push({ file: rel, lang, termId, word });
    }
  }
}

// 3. Scan scenario content for HR/DE forbidden (always check)
for (const rel of ['locales/scenario-text.ts', 'content/scenario-bank/scenarios.json']) {
  const full = join(root, rel);
  let content;
  try {
    content = readFileSync(full, 'utf8');
  } catch {
    continue;
  }
  for (const { lang, termId, word, re } of forbiddenPatterns) {
    if (lang === 'en') continue;
    re.lastIndex = 0;
    if (re.test(content)) {
      report.forbiddenHits.push({ file: rel, lang, termId, word });
    }
  }
}

// 4. Extra bank / scenario-text MT failure modes (release gate)
const BANK_MT_PATTERNS = [
  // Avoid JS \\b false positives on DE "bekämpft" (ä breaks ASCII word bounds).
  { id: 'mt.bek', re: /(?:^|[^A-Za-zÀ-ÖØ-öø-ÿ])bek(?:i|ovi|a|u|om)?(?=[^A-Za-zÀ-ÖØ-öø-ÿ]|$)/gi, note: 'football back → vanjski' },
  { id: 'mt.brziOdmor', re: /brzi odmor/gi, note: '→ kontranapad' },
  { id: 'mt.brzoVrijemePauze', re: /brzo vrijeme pauze/gi, note: '→ kontranapad' },
  { id: 'mt.ocjenaScore', re: /Ocjena\s+\d+[–\-]\d+/g, note: 'score label → Rezultat' },
  { id: 'mt.golman', re: /golman/gi, note: '→ vratar' },
  { id: 'mt.korner', re: /\bkorner\b/gi, note: 'football corner import' },
  { id: 'mt.straznjaVrata', re: /stražnj\w*\s+vrat/gi, note: '→ ulaz iza leđa' },
  { id: 'mt.ukrstanje', re: /Ukrštanje|ukrštanje/g, note: '→ Križanje' },
  { id: 'mt.manToMan', re: /Čovjek na čovjeka|čovjek na čovjeka/g, note: '→ Individualno čuvanje' },
  { id: 'mt.klada', re: /klada/gi, note: '→ blok' },
];

for (const rel of ['locales/scenario-text.ts', 'content/scenario-bank/scenarios.json']) {
  const full = join(root, rel);
  let content;
  try {
    content = readFileSync(full, 'utf8');
  } catch {
    continue;
  }
  for (const { id, re, note } of BANK_MT_PATTERNS) {
    re.lastIndex = 0;
    const m = content.match(re);
    if (m?.length) {
      report.bankMtHits.push({ file: rel, id, note, count: m.length });
    }
  }
}

// Deduplicate forbidden hits
const seen = new Set();
report.forbiddenHits = report.forbiddenHits.filter((h) => {
  const k = `${h.file}::${h.word}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

if (
  report.localeMismatches.length > 0 ||
  report.forbiddenHits.length > 0 ||
  report.bankMtHits.length > 0
) {
  report.status = 'FAIL';
}

report.manualReview = [
  {
    area: 'English scenario source strings',
    note: 'EN bank source may use goalkeeper/screen; HR/DE must use official terms via glossary + MT fixes.',
  },
  {
    area: 'Position abbreviations',
    note: 'positionShort.gk (GK) is allowed only as compact UI abbreviation, not as full position label.',
  },
  {
    area: 'Legacy preference labels',
    note: 'lib/platform/tactical-systems.ts may keep old HR labels only as normalize inputs.',
  },
];

const outPath = join(root, 'scripts/handball-terminology-report.json');
writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');

console.log(`Handball Terminology Validation: ${report.status}`);
console.log(`  Managed terms: ${report.managedTerms}`);
console.log(`  Files scanned: ${report.filesScanned}`);
console.log(`  Locale mismatches (baseline): ${report.localeMismatches.length}`);
console.log(`  Forbidden synonym hits: ${report.forbiddenHits.length}`);
console.log(`  Bank MT pattern hits: ${report.bankMtHits.length}`);
if (report.localeMismatches.length) {
  for (const h of report.localeMismatches.slice(0, 15)) {
    console.log(`    - [${h.lang}] ${h.key}: expected "${h.expected}" got "${h.actual}"`);
  }
}
if (report.forbiddenHits.length) {
  for (const h of report.forbiddenHits.slice(0, 25)) {
    console.log(`    - [${h.lang}] "${h.word}" in ${h.file} (use ${h.termId})`);
  }
}
if (report.bankMtHits.length) {
  for (const h of report.bankMtHits.slice(0, 20)) {
    console.log(`    - ${h.file}: ${h.id} ×${h.count} (${h.note})`);
  }
}
console.log(`  Report → ${outPath}`);

process.exit(report.status === 'PASS' ? 0 : 1);
