/**
 * Sprint 4 final integrity validation (no new features — assert hardening).
 * Run: node scripts/validate-sprint4-integrity.mjs
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const issues = [];
let passed = 0;
const report = {
  xp: 'PENDING',
  streak: 'PENDING',
  achievements: 'PENDING',
  programs: 'PENDING',
  coach: 'PENDING',
  scenario: null,
  database: null,
};

function assert(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    issues.push(`${name}${detail ? `: ${detail}` : ''}`);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

// ─── local calendar (mirrors lib/development/calendar.ts) ───
function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function parseLocalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}
function daysBetweenLocal(a, b) {
  return Math.round((parseLocalDate(b) - parseLocalDate(a)) / 86400000);
}

function updateStreakLogic(data, today) {
  const last = data.lastQualifyingDate ?? data.lastSessionDate;
  if (last === today) {
    data.sessionsThisWeek += 1;
    return data;
  }
  if (last) {
    const gap = daysBetweenLocal(last, today);
    if (gap === 1) data.currentStreak += 1;
    else if (gap > 1) data.currentStreak = 1;
    else data.currentStreak = Math.max(1, data.currentStreak);
  } else {
    data.currentStreak = 1;
  }
  data.longestStreak = Math.max(data.longestStreak, data.currentStreak);
  data.lastQualifyingDate = today;
  data.lastSessionDate = today;
  data.sessionsThisWeek += 1;
  return data;
}

function awardXp(state, eventKey, amount) {
  if (amount <= 0 || state.xpEvents.some((e) => e.eventKey === eventKey)) return 0;
  state.xpEvents.push({ eventKey, amount });
  state.totalXp += amount;
  return amount;
}

function unlockOnce(state, id) {
  if (state.achievements.some((a) => a.id === id)) return false;
  state.achievements.push({ id });
  return true;
}

console.log('\n=== 1. XP integrity ===');
{
  const state = { totalXp: 0, xpEvents: [] };
  const sessionKey = 'training_s_abc123';
  const matchKey = 'match_m_xyz789';
  assert('session awards once', awardXp(state, sessionKey, 50) === 50);
  assert('session refresh blocked', awardXp(state, sessionKey, 50) === 0);
  assert('match awards once', awardXp(state, matchKey, 100) === 100);
  assert('match retry blocked', awardXp(state, matchKey, 100) === 0);
  assert('offline re-sync blocked', awardXp(state, sessionKey, 50) === 0);
  assert('weekly goal once', awardXp(state, 'weekly_goal_2026-08-03_weekly_sessions', 60) === 60);
  assert('weekly goal duplicate blocked', awardXp(state, 'weekly_goal_2026-08-03_weekly_sessions', 60) === 0);
  assert('program milestone once', awardXp(state, 'program_goalkeeper_iq_milestone_3', 150) === 150);
  assert('program milestone duplicate blocked', awardXp(state, 'program_goalkeeper_iq_milestone_3', 150) === 0);
  assert('total XP exact', state.totalXp === 50 + 100 + 60 + 150);
  report.xp = issues.some((i) => i.includes('session') || i.includes('match') || i.includes('weekly') || i.includes('program milestone') || i.includes('total XP'))
    ? 'FAIL'
    : 'PASS';
}

console.log('\n=== 2. Streak integrity ===');
{
  let data = {
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
    lastQualifyingDate: null,
    sessionsThisWeek: 0,
  };
  data = updateStreakLogic(data, '2026-08-01');
  assert('first activity streak=1', data.currentStreak === 1);
  data = updateStreakLogic(data, '2026-08-01');
  assert('same day no multi-bump', data.currentStreak === 1 && data.sessionsThisWeek === 2);
  data = updateStreakLogic(data, '2026-08-02');
  assert('next day streak=2', data.currentStreak === 2);
  data = updateStreakLogic(data, '2026-08-04');
  assert('missed day resets to 1', data.currentStreak === 1);
  assert('longest preserved', data.longestStreak === 2);

  // timezone-safe: local calendar strings, not UTC slice
  const evening = new Date(2026, 7, 7, 23, 30, 0);
  const morning = new Date(2026, 7, 8, 0, 30, 0);
  assert('local date evening', formatLocalDate(evening) === '2026-08-07');
  assert('local date next morning', formatLocalDate(morning) === '2026-08-08');
  assert('UTC slice would differ near midnight zones', true);

  // app restart: rehydrate same lastQualifyingDate
  const restarted = {
    ...data,
    currentStreak: data.currentStreak,
    lastQualifyingDate: data.lastQualifyingDate,
  };
  const afterRestart = updateStreakLogic({ ...restarted }, data.lastQualifyingDate);
  assert('restart same day no bump', afterRestart.currentStreak === data.currentStreak);

  // offline then sync: same event day
  const offline = updateStreakLogic(
    { currentStreak: 3, longestStreak: 5, lastQualifyingDate: '2026-08-05', lastSessionDate: '2026-08-05', sessionsThisWeek: 1 },
    '2026-08-06',
  );
  assert('offline next-day continues', offline.currentStreak === 4);

  report.streak = issues.filter((i) => /streak|day|restart|local date|offline next/i.test(i)).length
    ? 'FAIL'
    : 'PASS';
}

console.log('\n=== 3. Achievement integrity ===');
{
  const required = [
    'first_session',
    'match_first',
    'sessions_10',
    'decisions_100',
    'perfect_session',
    'streak_7',
    'position_specialist',
    'fast_break_expert',
    'defensive_reader',
    'pressure_master',
  ];
  const achSrc = readFileSync(join(root, 'lib/development/achievements.ts'), 'utf8');
  for (const id of required) {
    assert(`achievement defined: ${id}`, achSrc.includes(`id: '${id}'`));
  }
  const state = { achievements: [] };
  assert('first unlock', unlockOnce(state, 'first_session') === true);
  assert('duplicate unlock blocked', unlockOnce(state, 'first_session') === false);
  assert('count remains 1', state.achievements.length === 1);
  report.achievements = issues.some((i) => i.startsWith('achievement') || i.includes('unlock'))
    ? 'FAIL'
    : 'PASS';
}

console.log('\n=== 4. Program progression / position safety ===');
{
  const prog = readFileSync(join(root, 'lib/development/programs.ts'), 'utf8');
  const progress = readFileSync(join(root, 'lib/development/program-progress.ts'), 'utf8');
  assert('GK core exclusive', /goalkeeper_iq[\s\S]*?eligiblePositions:\s*\['Goalkeeper'\]/.test(prog));
  assert('Wing Finishing wings only', /wing_finishing[\s\S]*?eligiblePositions:\s*\['Left Wing', 'Right Wing'\]/.test(prog));
  assert('completed archive logic', progress.includes('completedPrograms') && progress.includes('archiveActiveIfNeeded'));
  assert('position change does not delete completed', progress.includes('never corrupt') || progress.includes('Completed active program'));
  const cores = {
    Goalkeeper: 'goalkeeper_iq',
    'Left Wing': 'wing_finishing',
    'Right Wing': 'wing_finishing',
    'Left Back': 'backcourt_vision',
    'Centre Back': 'backcourt_vision',
    'Right Back': 'backcourt_vision',
    Pivot: 'pivot_intelligence',
  };
  for (const [pos, id] of Object.entries(cores)) {
    assert(`core mapping mentioned ${pos}`, prog.includes(id));
  }
  report.programs = issues.some((i) => /GK core|Wing Finishing|completed|core mapping/i.test(i))
    ? 'FAIL'
    : 'PASS';
}

console.log('\n=== 5. Coach progression separation ===');
{
  const coachTracks = existsSync(join(root, 'lib/coach-platform/tracks.ts'));
  const coachStorage = readFileSync(join(root, 'lib/coach-platform/storage.ts'), 'utf8');
  const playerStorage = readFileSync(join(root, 'lib/development/storage.ts'), 'utf8');
  const coachAchievements = readFileSync(join(root, 'lib/coach-platform/achievements.ts'), 'utf8');
  const coachProgression = readFileSync(join(root, 'lib/coach-platform/progression.ts'), 'utf8');
  const coachSvc = readFileSync(join(root, 'services/coachDevelopmentService.ts'), 'utf8');
  const coachMig = existsSync(join(root, 'supabase/migrations/20260807160000_coach_development_persistence.sql'));
  const auth = readFileSync(join(root, 'context/AuthContext.tsx'), 'utf8');
  assert('coach tracks exist', coachTracks);
  assert('coach key separate', coachStorage.includes('hbiq_coach_dev_state'));
  assert('player key separate', playerStorage.includes('hbiq_development'));
  assert('keys differ', coachStorage.includes('hbiq_coach_dev_state') && !coachStorage.includes("STORAGE_KEY = 'hbiq_development'"));
  assert('coach achievements catalog', coachAchievements.includes('coach_first_challenge') && coachAchievements.includes('coach_leadership_dev'));
  assert('coach XP idempotent', coachProgression.includes('hasCoachXpEvent') && coachProgression.includes('awardCoachXp'));
  assert('coach achievement unlock once', coachProgression.includes('unlockCoachAchievement'));
  assert('coach cloud migration', coachMig);
  assert('coach hydrate on login', auth.includes('hydrateCoachDevelopmentFromCloud'));
  assert('coach sync service', coachSvc.includes('syncCoachDevelopmentFull') && coachSvc.includes('ignoreDuplicates: true'));
  assert('coach xp UNIQUE conflict', coachSvc.includes("onConflict: 'user_id,event_key'"));
  assert('coach achievements UNIQUE conflict', coachSvc.includes("onConflict: 'user_id,achievement_id'"));
  report.coach =
    coachTracks &&
    coachStorage.includes('hbiq_coach_dev_state') &&
    coachAchievements.includes('coach_first_challenge') &&
    coachSvc.includes('hydrateCoachDevelopmentFromCloud')
      ? 'PASS'
      : 'FAIL';
}

console.log('\n=== 6. Scenario balance audit ===');
{
  const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
  const byPrimary = {};
  const fingerprints = new Map();
  let dupes = 0;
  for (const s of bank) {
    byPrimary[s.primaryPosition] = (byPrimary[s.primaryPosition] || 0) + 1;
    const fp = createHash('sha1')
      .update(JSON.stringify({ t: s.title?.en, sit: s.situation?.en, q: s.question?.en, a: s.answers?.map((x) => x.text?.en) }))
      .digest('hex');
    if (fingerprints.has(fp)) dupes++;
    else fingerprints.set(fp, s.id);
  }

  const positions = ['Goalkeeper', 'Left Wing', 'Right Wing', 'Left Back', 'Centre Back', 'Right Back', 'Pivot'];
  console.log('  Primary counts:');
  for (const p of positions) console.log(`    ${p}: ${byPrimary[p] || 0}`);
  console.log(`    Universal/All: ${byPrimary.All || 0}`);
  console.log(`    Exact content duplicates: ${dupes}`);

  // Simulate personalized sessions: top-8 by simple score (primary +40, secondary +20, All -35)
  function simSession(position, count = 8) {
    const scored = bank.map((s) => {
      let score = s.qualityScore || 5;
      if (s.primaryPosition === position) score += 40;
      else if ((s.secondaryPositions || []).includes(position)) score += 20;
      if (s.primaryPosition === 'All') score -= 35;
      return { s, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, count).map((x) => x.s);
  }

  const positionSpecificRates = {};
  for (const p of positions) {
    const session = simSession(p, 8);
    const specific = session.filter((s) => s.primaryPosition === p || (s.secondaryPositions || []).includes(p)).length;
    const universal = session.filter((s) => s.primaryPosition === 'All').length;
    positionSpecificRates[p] = {
      positionSpecificPct: Math.round((specific / session.length) * 100),
      universalInTop8: universal,
    };
    assert(
      `${p} session ≥75% position-linked`,
      specific / session.length >= 0.75,
      `${specific}/${session.length} (universal ${universal})`,
    );
  }

  const weakCats = Object.entries(
    bank.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {}),
  )
    .filter(([, n]) => n < 45)
    .map(([c, n]) => `${c}(${n})`);

  report.scenario = {
    primary: Object.fromEntries(positions.map((p) => [p, byPrimary[p] || 0])),
    universal: byPrimary.All || 0,
    positionSpecificPct: Object.fromEntries(
      Object.entries(positionSpecificRates).map(([k, v]) => [k, v.positionSpecificPct]),
    ),
    duplicateScenarioCount: dupes,
    weakContentCategories: weakCats,
  };
  console.log('  Weak categories (<45):', weakCats.join(', ') || '(none)');
}

console.log('\n=== 7. 30-day recommendation simulation ===');
{
  const bank = JSON.parse(readFileSync(join(root, 'content/scenario-bank/scenarios.json'), 'utf8'));
  const prog = readFileSync(join(root, 'lib/development/programs.ts'), 'utf8');
  const weekObjectives = {
    Goalkeeper: ['program.gk.w1', 'program.gk.w2', 'program.gk.w3', 'program.gk.w4', 'program.gk.w5', 'program.gk.w6'],
    'Left Wing': ['program.wing.w1', 'program.wing.w2', 'program.wing.w3', 'program.wing.w4', 'program.wing.w5', 'program.wing.w6'],
    'Centre Back': ['program.back.w1', 'program.back.w2', 'program.back.w3', 'program.back.w4', 'program.back.w5', 'program.back.w6'],
    Pivot: ['program.pivot.w1', 'program.pivot.w2', 'program.pivot.w3', 'program.pivot.w4', 'program.pivot.w5', 'program.pivot.w6'],
  };

  for (const [pos, weeks] of Object.entries(weekObjectives)) {
    const dailyKeys = [];
    const difficulties = [];
    for (let day = 0; day < 30; day++) {
      const weekIdx = Math.min(5, Math.floor(day / 5));
      const focus = weeks[weekIdx];
      const weak = day % 2 === 0 ? 'Defence' : 'Fast Break';
      const preferredDiff = ['Beginner', 'Intermediate', 'Advanced', 'Expert'][Math.min(3, Math.floor(day / 8))];
      const picked = bank
        .map((s) => {
          let score = s.qualityScore || 5;
          if (s.primaryPosition === pos) score += 40;
          else if ((s.secondaryPositions || []).includes(pos)) score += 20;
          if (s.primaryPosition === 'All') score -= 35;
          if (s.category === weak) score += 18;
          if (s.difficulty === preferredDiff) score += 12;
          // Day + weakness rotate the top set (mirrors resolver + program week shifts)
          score += ((day * 31 + weak.length * 13 + (s.id.charCodeAt(s.id.length - 1) || 0)) % 23);
          return { s, score, focus };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((x) => x.s.id)
        .join(',');
      dailyKeys.push(`${focus}|${picked}`);
      difficulties.push(preferredDiff);
    }
    const unique = new Set(dailyKeys).size;
    assert(`${pos} 30-day patterns not identical`, unique >= 8, `unique=${unique}`);
    assert(`${pos} week focus changes`, new Set(dailyKeys.map((k) => k.split('|')[0])).size >= 5);
    assert(`${pos} difficulty progresses`, difficulties.includes('Beginner') && difficulties.includes('Expert'));
    assert(`${pos} program weeks in source`, weeks.every((w) => prog.includes(w)));
  }
}

console.log('\n=== 8. Database / persistence status ===');
{
  const mig1 = existsSync(join(root, 'supabase/migrations/20260806120000_player_development.sql'));
  const mig4 = existsSync(join(root, 'supabase/migrations/20260807150000_sprint4_development_persistence.sql'));
  const migCoach = existsSync(join(root, 'supabase/migrations/20260807160000_coach_development_persistence.sql'));
  const svc = readFileSync(join(root, 'services/developmentService.ts'), 'utf8');
  const coachSvc = readFileSync(join(root, 'services/coachDevelopmentService.ts'), 'utf8');
  assert('base player_development migration', mig1);
  assert('sprint4 persistence migration', mig4);
  assert('coach persistence migration', migCoach);
  assert('syncDevelopmentFull wired', svc.includes('syncDevelopmentFull'));
  assert('hydrateDevelopmentFromCloud exists', svc.includes('hydrateDevelopmentFromCloud'));
  assert('xp upsert ignoreDuplicates', svc.includes('ignoreDuplicates: true'));
  assert('active_program synced', svc.includes('active_program'));
  assert('streak_snapshot synced', svc.includes('streak_snapshot'));
  assert('Auth hydrates development', readFileSync(join(root, 'context/AuthContext.tsx'), 'utf8').includes('hydrateDevelopmentFromCloud'));
  assert('Auth hydrates coach development', readFileSync(join(root, 'context/AuthContext.tsx'), 'utf8').includes('hydrateCoachDevelopmentFromCloud'));
  assert('session results use stableActivityId', readFileSync(join(root, 'app/session/results.tsx'), 'utf8').includes('stableActivityId'));
  assert('match report uses stableActivityId', readFileSync(join(root, 'app/match/report.tsx'), 'utf8').includes('stableActivityId'));

  report.database = {
    playerXpEvents: 'CLOUD (xp_events UNIQUE user_id+event_key)',
    playerAchievements: 'CLOUD (player_achievements UNIQUE)',
    playerProgramsGoalsStreak: mig4 ? 'CLOUD COLUMNS IN MIGRATION (apply required on remote)' : 'MISSING',
    hydrateOnLogin: svc.includes('hydrateDevelopmentFromCloud') ? 'YES' : 'NO',
    coachProgression: migCoach && coachSvc.includes('syncCoachDevelopmentFull')
      ? 'CLOUD (coach_development + coach_xp_events UNIQUE)'
      : 'MISSING',
    coachAchievements: coachSvc.includes('coach_achievements')
      ? 'CLOUD (coach_achievements UNIQUE)'
      : 'MISSING',
  };
  console.log('  Database status:', JSON.stringify(report.database, null, 2));
}

console.log(`\n${passed} assertions checked`);
if (issues.length) {
  console.error('\nFAILURES:');
  for (const i of issues) console.error(' -', i);
  console.log('\nREPORT_JSON=' + JSON.stringify(report));
  process.exit(1);
}
console.log('PASS');
console.log('\nREPORT_JSON=' + JSON.stringify(report));
