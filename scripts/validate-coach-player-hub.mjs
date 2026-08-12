import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (condition, message) => {
  if (condition) console.log(`  ✓ ${message}`);
  else failures.push(message);
};

const migration = read('supabase/migrations/20260812170000_coach_player_development_hub.sql');
const hub = read('app/coach-dashboard/player-hub.tsx');
const players = read('app/coach-dashboard/players.tsx');
const clear = read('lib/clear-user-local.ts');

console.log('\n=== Coach player hub validation ===');
check(migration.includes('CREATE TABLE IF NOT EXISTS public.coach_player_goals'), 'goal persistence table exists');
check(migration.includes('enforce_three_active_coach_player_goals'), 'database enforces three active goals');
check(migration.includes('public.can_manage_team(p_team_id)'), 'overview requires team manager access');
check(migration.includes('member.user_id = p_player_id'), 'overview requires team membership');
check(hub.includes('loadCoachAttendanceHistoryForTeam'), 'hub includes attendance history');
check(hub.includes('loadCoachWorkspaceNotesForTeam'), 'hub includes private coach notes');
check(hub.includes('fetchAssignments'), 'hub includes assigned tasks');
check(hub.includes('fetchCoachPlayerOverview'), 'hub includes player development aggregates');
check(players.includes('loadCoachRosterForTeam') && players.includes('fetchTeamMembers'), 'player list combines roster and connected accounts');
check(clear.includes("'hbiq_coach_player_goals_v1'"), 'sign-out clears local coach goals');
check(!hub.includes('scenario') && !migration.includes('scenarios'), 'scenario content is untouched');

if (failures.length) {
  console.error(`\nFAIL — ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log('\nPASS — coach player hub is wired safely');
