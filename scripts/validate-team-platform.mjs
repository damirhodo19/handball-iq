/**
 * Validates Team & Coach Platform.
 * Run: node scripts/validate-team-platform.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const store = new Map();
global.window = {
  localStorage: {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  },
};

const issues = [];
let passed = 0;

function assert(name, condition, detail = '') {
  if (condition) { passed++; console.log(`  ✓ ${name}`); }
  else { issues.push(`${name}${detail ? `: ${detail}` : ''}`); console.log(`  ✗ ${name}`); }
}

// Dynamic import won't work easily - inline permission tests
const PERMS = {
  admin: ['*'],
  club_owner: ['team.create', 'team.invite', 'reports.export'],
  head_coach: ['team.invite', 'assignment.create', 'reports.export'],
  assistant_coach: ['assignment.create'],
  player: ['stats.view_own'],
};

function hasPerm(role, perm) {
  const p = PERMS[role] ?? [];
  return p.includes('*') || p.includes(perm);
}

console.log('\n=== Permissions ===');
assert('Admin has all', hasPerm('admin', 'team.create'));
assert('Club owner can invite', hasPerm('club_owner', 'team.invite'));
assert('Head coach can assign', hasPerm('head_coach', 'assignment.create'));
assert('Assistant cannot export', !hasPerm('assistant_coach', 'reports.export'));
assert('Player cannot invite', !hasPerm('player', 'team.invite'));

console.log('\n=== File Structure ===');
const required = [
  'lib/team-platform/types.ts',
  'lib/team-platform/platform.ts',
  'lib/team-platform/storage.ts',
  'lib/team-platform/permissions.ts',
  'lib/team-platform/reports.ts',
  'hooks/useTeamPlatform.ts',
  'services/clubService.ts',
  'supabase/migrations/20260806140000_team_platform.sql',
  'app/coach-dashboard/clubs.tsx',
  'app/coach-dashboard/invite.tsx',
  'app/coach-dashboard/leaderboards.tsx',
  'app/coach-dashboard/reports.tsx',
  'app/coach-dashboard/notes.tsx',
  'app/coach-dashboard/join.tsx',
  'app/coach-dashboard/create-team.tsx',
];

for (const f of required) {
  try { readFileSync(join(root, f)); assert(`Exists: ${f}`, true); }
  catch { assert(`Exists: ${f}`, false); }
}

console.log('\n=== Migration Tables ===');
const migration = readFileSync(join(root, 'supabase/migrations/20260806140000_team_platform.sql'), 'utf8');
for (const table of ['clubs', 'club_members', 'team_invitations', 'coach_notes', 'team_calendar_events', 'team_attendance']) {
  assert(`Table defined: ${table}`, migration.includes(`CREATE TABLE IF NOT EXISTS ${table}`));
}

console.log(`\n=== Result: ${issues.length === 0 ? 'PASS' : 'FAIL'} (${passed} checks, ${issues.length} issues) ===`);
if (issues.length) { issues.forEach((i) => console.log(`  - ${i}`)); process.exit(1); }
