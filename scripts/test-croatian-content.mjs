#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRuntime } from './lib/localization-test-runtime.mjs';

// Locked before the Croatian editorial pass. These hashes include every other
// field: IDs, family keys, counts/order, answers, scoring and EN/DE wording.
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/croatian-content-invariants.json', import.meta.url)));
const omitCroatian = value => Array.isArray(value) ? value.map(omitCroatian)
  : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value)
    .filter(([key]) => key !== 'hr').map(([key, child]) => [key, omitCroatian(child)])) : value;
const badCalques = /oporavi kukove|ispupčavanje|čitanje pacijenta|nahrani pivota|brtvu osovine|vozi prazninu|brzi prekid|prije obveze|tajming trake|prekomjerna obveza/i;
let texts = 0;
function check(text, label) {
  assert.equal(typeof text, 'string', label);
  assert.ok(!badCalques.test(text), `${label}: ${text}`);
  texts++;
}
function visit(value, path = '') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'hr' && typeof child === 'string') check(child, path);
    else visit(child, `${path}.${key}`);
  }
}
for (const [file, expected] of Object.entries(fixtures)) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const hash = createHash('sha256').update(JSON.stringify(omitCroatian(data))).digest('hex');
  assert.equal(hash, expected, `${file}: non-Croatian content changed; review any intentional bank update before refreshing fixture`);
  visit(data, file);
}
const { load } = createRuntime();
for (const [key, text] of Object.entries(load('@/locales').translations.hr)) check(text, key);
for (const [key, text] of Object.entries(load('@/locales/scenario-text').scenarioTextHr)) check(text, key);
const t = load('@/lib/locale-text').createTranslator('hr');
assert.equal(t('position.centreBack'), 'Srednji vanjski');
assert.equal(t('admin.recentlyEdited'), 'NEDAVNO UREĐIVANO');
assert.ok(!t('admin.contentWarnings').includes('CONTENT'));
console.log(`PASS: ${texts} Croatian strings; all non-HR bank fields match the pre-edit baseline`);
