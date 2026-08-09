#!/usr/bin/env node
/**
 * Fixes incorrect handball terminology in HR/DE translations.
 * Run: node scripts/fix-handball-terminology.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { HR_MT_FIXES, applyHrMtFixes } from './hr-mt-fixes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** DE value-side fixes only — never apply to EN map keys (avoid Screen→Sperre key mutation). */
const DE_FIXES = [
  [/Bildschirm/gi, 'Sperre'],
  [/Schirm/gi, 'Sperre'],
  [/Screener/gi, 'Sperrespieler'],
  [/Schütze/gi, 'Werfer'],
  [/Schützen/gi, 'Werfer'],
  [/Stoßstange/gi, 'Kreisläufer'],
  [/schnellen Angriff/gi, 'Tempogegenstoß'],
  [/schnelle Angriffe/gi, 'Tempogegenstöße'],
  [/schneller Angriff/gi, 'Tempogegenstoß'],
  [/Wiedergabe einstellen/gi, 'Standardsituation'],
  [/am Schalter/gi, 'im Wechsel'],
  [/Neun-Meter/gi, '9-Meter'],
  [/Sechs-Meter/gi, '6-Meter'],
  [/RückSperre/gi, 'Rück-Sperre'],
  [/Back-Screen/gi, 'Rück-Sperre'],
  [/Schalterverwirrung/gi, 'Verwirrung in der Rotation'],
  [/unnötige Schalter/gi, 'unnötige Wechsel'],
  [/stille Schalter/gi, 'leise Wechsel'],
  [/„Schalter“/gi, '„Wechsel“'],
  [/Schalter/gi, 'Wechsel'],
  [/einen Sperre/gi, 'eine Sperre'],
  [/einem Sperre/gi, 'einer Sperre'],
  [/den Sperre/gi, 'die Sperre'],
  [/dem Sperre/gi, 'der Sperre'],
  [/durch den Sperre/gi, 'durch die Sperre'],
  [/nach dem Sperre/gi, 'nach der Sperre'],
  [/Sperreer/gi, 'Sperrespieler'],
  [/den Screener/gi, 'den Sperrespieler'],
  [/Blocken/gi, 'Block'],
  [/blocken/gi, 'blocken'],
];

function applyFixes(text, fixes) {
  if (!text || typeof text !== 'string') return text;
  let out = text;
  for (const [re, rep] of fixes) out = out.replace(re, rep);
  return out;
}

function walkAndFix(obj, langKey, fixFn) {
  if (typeof obj === 'string') return { obj, count: 0 };
  if (Array.isArray(obj)) {
    let count = 0;
    const out = obj.map((item) => {
      const r = walkAndFix(item, langKey, fixFn);
      count += r.count;
      return r.obj;
    });
    return { obj: out, count };
  }
  if (obj && typeof obj === 'object') {
    let count = 0;
    const out = { ...obj };
    for (const [k, v] of Object.entries(obj)) {
      if (k === langKey && typeof v === 'string') {
        const fixed = fixFn(v);
        if (fixed !== v) count++;
        out[k] = fixed;
      } else if (typeof v === 'object' && v !== null) {
        const r = walkAndFix(v, langKey, fixFn);
        out[k] = r.obj;
        count += r.count;
      }
    }
    return { obj: out, count };
  }
  return { obj, count: 0 };
}

function fixScenarioTextFile() {
  const path = join(root, 'locales/scenario-text.ts');
  let content = readFileSync(path, 'utf8');
  let hrCount = 0;
  let deCount = 0;

  const hrMatch = content.match(/export const scenarioTextHr[^=]*=\s*\{([\s\S]*?)\};/);
  if (hrMatch) {
    let hrBlock = hrMatch[1];
    const orig = hrBlock;
    for (const [re, rep] of HR_MT_FIXES) hrBlock = hrBlock.replace(re, rep);
    if (hrBlock !== orig) {
      content = content.replace(hrMatch[1], hrBlock);
      hrCount += 1;
    }
  }

  const deMatch = content.match(/export const scenarioTextDe[^=]*=\s*\{([\s\S]*?)\};/);
  if (deMatch) {
    let deBlock = deMatch[1];
    const orig = deBlock;
    for (const [re, rep] of DE_FIXES) deBlock = deBlock.replace(re, rep);
    if (deBlock !== orig) {
      content = content.replace(deMatch[1], deBlock);
      deCount += 1;
    }
  }

  writeFileSync(path, content);
  return { hrCount, deCount };
}

const scenariosPath = join(root, 'content/scenario-bank/scenarios.json');
const scenarios = JSON.parse(readFileSync(scenariosPath, 'utf8'));
const hrResult = walkAndFix(scenarios, 'hr', (t) => applyHrMtFixes(t));
const deResult = walkAndFix(hrResult.obj, 'de', (t) => applyFixes(t, DE_FIXES));
writeFileSync(scenariosPath, JSON.stringify(deResult.obj, null, 2) + '\n');

const textFix = fixScenarioTextFile();

console.log('Handball terminology fix complete:');
console.log(`  scenarios.json HR strings fixed: ${hrResult.count}`);
console.log(`  scenarios.json DE strings fixed: ${deResult.count}`);
console.log(`  scenario-text.ts HR block updated: ${textFix.hrCount > 0}`);
console.log(`  scenario-text.ts DE block updated: ${textFix.deCount > 0}`);

const verify = readFileSync(scenariosPath, 'utf8');
const scenarioTextVerify = readFileSync(join(root, 'locales/scenario-text.ts'), 'utf8');
const checks = {
  klada: (verify.match(/klada/gi) || []).length + (scenarioTextVerify.match(/klada/gi) || []).length,
  'brzi odmor': (verify.match(/brzi odmor/gi) || []).length + (scenarioTextVerify.match(/brzi odmor/gi) || []).length,
  golman: (verify.match(/golman/gi) || []).length + (scenarioTextVerify.match(/golman/gi) || []).length,
  Ukrštanje: (verify.match(/Ukrštanje/g) || []).length + (scenarioTextVerify.match(/Ukrštanje/g) || []).length,
  '\bbek\b': (verify.match(/\bbek\b/gi) || []).length + (scenarioTextVerify.match(/\bbek\b/gi) || []).length,
};

console.log('\nVerification:');
for (const [k, n] of Object.entries(checks)) {
  console.log(`  Remaining "${k}": ${n}`);
}
const hardFail = checks.klada + checks['brzi odmor'] + checks.golman + checks.Ukrštanje + checks['\bbek\b'];
if (hardFail > 0) {
  console.error('FAIL: critical MT patterns remain');
  process.exit(1);
}
console.log('PASS: critical MT patterns eliminated from bank + scenario-text');
