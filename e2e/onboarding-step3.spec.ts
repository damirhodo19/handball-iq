import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Regression: Step 3 must upsert profiles fields that exist in Handball IQ 2.0 schema.
 * Catches the production failure where onboarding_version / coach_* columns were missing.
 */
test.describe('Onboarding Step 3 schema contract', () => {
  test('finishOnboarding upsert payload includes required IQ2 columns', () => {
    const src = readFileSync(join(process.cwd(), 'app/(auth)/onboarding.tsx'), 'utf8');
    for (const field of [
      'onboarding_version: 2',
      'primary_position:',
      'dominant_hand:',
      'playing_level:',
      'development_goal:',
      'coach_type:',
      'experience_band:',
      'favorite_defense:',
      'favorite_attack:',
      'coach_development_goal:',
      "from('profiles').upsert",
    ]) {
      expect(src, `missing ${field}`).toContain(field);
    }
    // Must not invent Goalkeeper on empty position
    expect(src).not.toMatch(/canonicalPosition\s*\|\|\s*['"]Goalkeeper['"]/);
    expect(src).not.toMatch(/primary_position:\s*['"]Goalkeeper['"]/);
  });

  test('Left Back chip value is canonical Title Case, not snake_case display label', () => {
    const positions = readFileSync(join(process.cwd(), 'lib/positions.ts'), 'utf8');
    expect(positions).toContain("'Left Back'");
    const resolve = readFileSync(join(process.cwd(), 'lib/platform/resolve-position.ts'), 'utf8');
    expect(resolve).toContain("left_back: 'Left Back'");
    expect(resolve).toContain("'lijevi vanjski': 'Left Back'");
  });
});
