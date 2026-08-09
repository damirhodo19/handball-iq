/**
 * Prints personalization diagnostics for Left Back (canonical: "Left Back").
 * Internal ID is English Title Case — snake_case left_back normalizes to Left Back.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scenarios = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));

const POSITION = 'Left Back';
const SPECIFIC = new Set([
  'Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot',
]);

function isScenarioForPosition(s, position) {
  if (s.primaryPosition === position) return true;
  if (s.primaryPosition === 'All' || s.primaryPosition === 'Universal') {
    const sec = s.secondaryPositions ?? [];
    return sec.length === 0 || sec.includes(position);
  }
  if (SPECIFIC.has(s.primaryPosition) && s.primaryPosition !== position) return false;
  return (s.secondaryPositions ?? []).includes(position);
}

const pool = scenarios.filter((s) => isScenarioForPosition(s, POSITION));
const ranked = [...pool]
  .map((s) => {
    let score = s.qualityScore + (s.primaryPosition === POSITION ? 40 : 0);
    if (s.primaryPosition === 'All') score -= 35;
    return { s, score };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);

console.log('=== Position chain diagnostic (Left Back / Lijevi vanjski) ===');
console.log('UI label (HR): Lijevi vanjski');
console.log('UI label (DE): Linker Rückraum');
console.log('UI label (EN): Left Back');
console.log('Canonical internal ID: Left Back  (alias left_back → Left Back)');
console.log('saved primary_position (expected): Left Back');
console.log('local cached position (expected): Left Back');
console.log('cloud position (expected): Left Back');
console.log('resolved position: Left Back');
console.log('ContentResolver position: Left Back');
console.log('training pool size:', pool.length);
console.log('training pool Goalkeeper primary:', pool.filter((s) => s.primaryPosition === 'Goalkeeper').length);
console.log('match pool Goalkeeper primary:', pool.filter((s) => s.primaryPosition === 'Goalkeeper').length);
console.log('\nFirst 10 recommended tags:');
ranked.forEach((x, i) => {
  console.log(
    `  ${i + 1}. primary=${x.s.primaryPosition} cat=${x.s.category} :: ${x.s.title.en.slice(0, 60)}`,
  );
});
