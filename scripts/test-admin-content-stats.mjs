#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRuntime } from './lib/localization-test-runtime.mjs';

const hashBank = () => createHash('sha256').update(readFileSync('content/scenario-bank/scenarios.json')).digest('hex');
const before = hashBank();
const { load, storage } = createRuntime();
const admin = load('@/lib/admin-storage');
const bank = load('@/lib/scenario-bank').getAllScenarios();
const bankBefore = JSON.stringify(bank);
admin.migrateOldScenarios();
const localBefore = storage.getItem('hbiq_admin_scenarios');
const managed = admin.loadScenarios();
const stats = admin.getContentStats();

// Reproduce the original seed-only failure and exercise the actual stats code.
for (const position of ['Right Wing', 'Left Back', 'Right Back']) {
  assert.equal(managed.filter(s => s.position === position).length, 0);
  const expected = bank.filter(s => s.primaryPosition === position).length;
  assert.ok(expected > 0);
  assert.equal(stats.byPosition[position], expected);
  assert.ok(!stats.warnings.includes(`No scenarios for ${position}`));
}
assert.equal(stats.total, bank.length + managed.length);
assert.equal(stats.publishedVsDraft.published, bank.length + managed.filter(s => s.status === 'Published').length);
assert.equal(Object.values(stats.byPosition).reduce((a, b) => a + b, 0), stats.total);
assert.ok(stats.recentlyEdited.every(s => managed.some(m => m.id === s.id)));
assert.equal(JSON.stringify(await admin.getContentStatsAsync()), JSON.stringify(stats));

// A stale managed copy cannot override or double-count canonical bank metadata.
const duplicate = { ...managed[0], id: bank[0].id, position: 'All', status: 'Archived' };
assert.equal(admin.getContentStats([...managed, duplicate]).total, stats.total);
assert.equal(admin.getContentStats([...managed, duplicate]).archived, stats.archived);
assert.equal(admin.getContentStats([...managed, { ...managed[0], id: 'deleted', deleted: true }]).total, stats.total);

// Without the bank, real gaps still warn; applicability matches runtime rules.
const isolated = createRuntime(process.cwd(), { '@/lib/scenario-bank': { getAllScenarios: () => [] } });
const getStats = isolated.load('@/lib/admin-storage').getContentStats;
const row = { ...managed[0], ageGroup: 'All', playingLevel: 'All', secondaryPositions: [] };
assert.ok(getStats([]).warnings.includes('No scenarios for Right Wing'));
assert.ok(getStats([{ ...row, position: 'Goalkeeper', secondaryPositions: ['Right Wing'] }]).warnings.includes('No scenarios for Right Wing'));
assert.ok(!getStats([{ ...row, position: 'All', secondaryPositions: ['Right Wing'] }]).warnings.includes('No scenarios for Right Wing'));
assert.ok(getStats([{ ...row, position: 'All', secondaryPositions: ['Right Wing'] }]).warnings.includes('No scenarios for Left Back'));
assert.equal(getStats([{ ...row, position: 'All' }]).warnings.length, 0);
assert.ok(getStats([{ ...row, position: 'Right Wing', status: 'Archived' }]).warnings.includes('No scenarios for Right Wing'));
assert.ok(getStats([{ ...row, position: 'Right Wing', playingLevel: 'Beginner', ageGroup: 'Senior' }]).warnings.includes('No Professional-level Right Wing scenarios'));
assert.ok(getStats([{ ...row, position: 'Right Wing', playingLevel: 'Beginner', ageGroup: 'Senior' }]).warnings.includes('No Under 14 Right Wing scenarios'));

// Cloud rows and a failed cloud read follow the existing managed-content loader.
let cloudFails = false;
const cloudRow = {
  id: 'cloud-only', title: 'Cloud draft', title_hr: 'Nacrt iz oblaka', title_de: 'Cloudentwurf', position: 'Right Wing', category: 'Right Wing',
  difficulty: 'Advanced', status: 'Draft', age_group: 'All', playing_level: 'All',
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-02T00:00:00Z',
};
const query = {
  select() { return this; }, is() { return this; },
  async order() { return cloudFails ? { data: null, error: new Error('offline') } : { data: [cloudRow], error: null }; },
};
const cloudRuntime = createRuntime(process.cwd(), {
  '@/lib/supabase': { supabase: { from: () => query }, isSupabaseConfigured: true },
});
const cloudAdmin = cloudRuntime.load('@/lib/admin-storage');
const cloudStats = await cloudAdmin.getContentStatsAsync();
assert.equal(cloudStats.total, bank.length + 1);
assert.equal(cloudStats.drafts, 1);
assert.equal(cloudStats.recentlyEdited[0].id, 'cloud-only');
assert.equal(cloudStats.recentlyEdited[0].title_hr, 'Nacrt iz oblaka');
assert.equal(cloudStats.recentlyEdited[0].title_de, 'Cloudentwurf');
for (const lang of ['en', 'hr', 'de']) {
  const t = isolated.load('@/lib/locale-text').createTranslator(lang);
  const position = isolated.load('@/lib/translations').translatePosition('Right Wing', t);
  assert.ok(getStats([], t).warnings.includes(t('admin.warningMissingPosition', { position })));
  const gaps = getStats([{ ...row, position: 'Right Wing', playingLevel: 'Beginner', ageGroup: 'Senior' }], t).warnings;
  assert.ok(gaps.includes(t('admin.warningMissingProfessional', { position })));
  assert.ok(gaps.includes(t('admin.warningMissingUnder14', { position })));
}
cloudAdmin.migrateOldScenarios();
cloudFails = true;
assert.equal(JSON.stringify(await cloudAdmin.getContentStatsAsync()), JSON.stringify(cloudAdmin.getContentStats()));

assert.equal(storage.getItem('hbiq_admin_scenarios'), localBefore);
assert.equal(JSON.stringify(bank), bankBefore);
assert.equal(hashBank(), before);
console.log('PASS: admin inventory, position coverage, deduplication, cloud/fallback and unchanged bank');
console.log(JSON.stringify({ bankTotal: bank.length, managedTotal: managed.length, positions: stats.byPosition }));

// Local creation/import and cloud round trips must retain localized fields.
const localizedRuntime = createRuntime();
const localizedAdmin = localizedRuntime.load('@/lib/admin-storage');
const localized = { ...row, title_hr: 'Hrvatski naslov', title_de: 'Deutscher Titel',
  situation_hr: 'Situacija', situation_de: 'Situation', question_hr: 'Pitanje?', question_de: 'Frage?',
  answerOptions_hr: ['Prvi', 'Drugi'], answerOptions_de: ['Erste', 'Zweite'],
  explanation_hr: 'Objašnjenje', explanation_de: 'Erklärung',
  learningObjective_hr: 'Cilj', learningObjective_de: 'Ziel',
  commonMistake_hr: 'Pogreška', commonMistake_de: 'Fehler', coachNote_hr: 'Bilješka', coachNote_de: 'Notiz' };
const localizedKeys = Object.keys(localized).filter(key => /_(hr|de)$/.test(key));
const created = localizedAdmin.createScenario(localized);
for (const key of localizedKeys) assert.equal(JSON.stringify(created[key]), JSON.stringify(localized[key]), key);
const imported = localizedAdmin.importScenarios(JSON.stringify([{ ...localized, id: 'translated-import' }]));
assert.equal(imported.imported, 1);
for (const key of localizedKeys) assert.equal(JSON.stringify(localizedAdmin.loadScenario('translated-import')[key]), JSON.stringify(localized[key]), key);
let stored;
const roundTrip = createRuntime(process.cwd(), { '@/lib/supabase': { supabase: { from: () => ({
  insert(value) { stored = value; return this; },
  select() { return this; },
  single: async () => ({ data: { id: 'cloud-translated' }, error: null }),
  is() { return this; },
  order: async () => ({ data: [{ ...stored, id: 'cloud-translated' }], error: null }),
}) }, isSupabaseConfigured: true } });
const roundTripAdmin = roundTrip.load('@/lib/admin-storage');
const saved = await roundTripAdmin.createScenarioAsync(localized);
assert.equal(saved.error, null);
const loaded = (await roundTripAdmin.loadScenariosAsync())[0];
for (const key of localizedKeys) assert.equal(JSON.stringify(loaded[key]), JSON.stringify(localized[key]), key);
console.log('PASS: all localized admin fields survive creation, import and cloud round trips');
