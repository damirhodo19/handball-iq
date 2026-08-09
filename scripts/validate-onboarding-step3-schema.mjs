/**
 * Live-schema gate for onboarding Step 3.
 * Confirms profiles columns + user_preferences exist (anon-readable metadata via select).
 * Exit 0 = PASS.
 */
import { readFileSync } from 'fs';
import { join } from 'path';

function loadEnv() {
  try {
    const raw = readFileSync(join(process.cwd(), '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* optional */
  }
}

loadEnv();
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error('FAIL: missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const REQUIRED_PROFILE_COLS = [
  'id',
  'role',
  'primary_position',
  'position',
  'dominant_hand',
  'playing_level',
  'development_goal',
  'country',
  'onboarded',
  'onboarding_version',
  'coach_type',
  'experience_band',
  'favorite_defense',
  'favorite_attack',
  'coach_development_goal',
  'preferred_language',
  'theme',
];

const FAIL = [];

for (const col of REQUIRED_PROFILE_COLS) {
  const r = await fetch(`${url}/rest/v1/profiles?select=${encodeURIComponent(col)}&limit=0`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  });
  if (r.status !== 200) {
    const body = await r.text();
    FAIL.push(`profiles.${col}: ${body.slice(0, 160)}`);
    console.log('✗', col);
  } else {
    console.log('✓', col);
  }
}

const prefs = await fetch(`${url}/rest/v1/user_preferences?select=user_id&limit=0`, {
  headers: { apikey: anon, Authorization: `Bearer ${anon}` },
});
if (prefs.status !== 200) {
  FAIL.push(`user_preferences missing: ${(await prefs.text()).slice(0, 160)}`);
  console.log('✗ user_preferences');
} else {
  console.log('✓ user_preferences');
}

// Source check: Step 3 upsert includes onboarding_version (must exist in live schema)
const onboarding = readFileSync(join(process.cwd(), 'app/(auth)/onboarding.tsx'), 'utf8');
if (!onboarding.includes('onboarding_version: 2')) {
  FAIL.push('onboarding.tsx no longer upserts onboarding_version: 2');
}
if (!onboarding.includes(".from('profiles').upsert")) {
  FAIL.push('onboarding.tsx missing profiles.upsert');
}
if (!onboarding.includes('[onboarding] profiles.upsert')) {
  FAIL.push('onboarding.tsx missing upsert error logging');
}

if (FAIL.length) {
  console.log('\nFAIL');
  FAIL.forEach((f) => console.log(' -', f));
  process.exit(1);
}
console.log('\nPASS — live schema supports onboarding Step 3');
process.exit(0);
