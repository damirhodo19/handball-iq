#!/usr/bin/env node
/**
 * Syncs managed locale keys in en/hr/de.ts from handball-terminology.json.
 * Run: node scripts/sync-handball-terminology-locales.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const terminology = JSON.parse(
  readFileSync(join(root, 'locales/handball-terminology.json'), 'utf8'),
);

const LANGS = ['en', 'hr', 'de'];
let totalUpdates = 0;

for (const lang of LANGS) {
  const path = join(root, `locales/${lang}.ts`);
  let content = readFileSync(path, 'utf8');
  let updates = 0;

  for (const term of terminology.terms) {
    if (!term.localeKey) continue;
    const value = term[lang].replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const escapedKey = term.localeKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`('${escapedKey}':\\s*')((?:\\\\'|[^'])*)(')`, 'g');
    const next = content.replace(re, `$1${value}$3`);
    if (next !== content) {
      updates++;
      content = next;
    } else if (!content.includes(`'${term.localeKey}':`)) {
      // Insert before Match Day Personal Goals section if missing
      const anchor = "  // ─── Match Day Personal Goals ───";
      const insertion = `  '${term.localeKey}': '${value}',\n\n`;
      if (content.includes(anchor) && !content.includes(`'${term.localeKey}':`)) {
        content = content.replace(anchor, insertion + anchor);
        updates++;
      }
    }
  }

  writeFileSync(path, content);
  totalUpdates += updates;
  console.log(`  ${lang}.ts — ${updates} keys synced`);
}

console.log(`Synced ${totalUpdates} locale keys from handball-terminology.json`);
