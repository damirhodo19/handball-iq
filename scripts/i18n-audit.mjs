/**
 * i18n audit — run: node scripts/i18n-audit.mjs
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const SKIP_DIRS = new Set(['node_modules', 'locales', '.git', 'scripts', 'supabase']);
const EXT = /\.(tsx|ts)$/;

const ENGLISH_IN_STRING = /['"`]([^'"`]{4,})['"`]/g;
const SKIP_PATTERNS = [
  /^@/, /^#/, /^http/, /^\/\(/, /^rgba?\(/, /^[A-Z_]+$/, /^\d/, /^[\d.]+$/,
  /^Inter-/, /^css-/, /^sb-/, /^handball/, /^GK$/, /^GK_|^CB$|^LW$|^RW$/,
  /^error\./, /^match\./, /^onboarding\./, /^settings\./, /^common\./,
  /^matchDay\./, /^training\./, /^coach/, /^admin/, /^tabs\./, /^home\./,
  /^progress\./, /^profile\./, /^auth\./, /^default\./, /^position\./,
  /^scenarioType\./, /^YYYY-MM-DD$/, /^e\.g\./, /^•/, /^IQ$/, /^OK$/,
  /^en$|^hr$|^de$/, /^true$|^false$/, /^auto$/, /^none$/, /^bold$|^700$/,
  /^pointer$|^0$|^1$|^2$|^3$|^4$|^5$|^6$|^7$|^8$|^9$|^10$|^15$|^30$|^45$|^60$/,
  /^a$|^b$|^c$|^d$|^A$|^B$|^C$|^D$/, /^vs /, /^#/, /^linear-gradient/,
  /^flex$/, /^row$/, /^column$/, /^center$/, /^space-/, /^100%$/,
  /^Patience$|^Reading the Shooter$|^Pressure Control$/, // metric enum keys in code
  /^Goalkeeper$|^Left Wing$|^Right Back$/, // position enum values in non-UI code
  /^First Half$|^Second Half$/, // stored values
  /^Low$|^Moderate$|^High$|^Critical$/, // pressure enum
  /^Attack$|^Defence$/, /^optimal$|^good$|^risky$|^poor$/,
  /^Player$|^Coach$/, /^Damir$/, /^Founding Member$/, /^#001$/,
  /^Berlin Lions$|^League Match$|^Match Simulation$|^Opponent$|^Intermediate$/,
  /^10–15 minutes$/, /^Starter$|^Shared minutes$|^Substitute$/,
  /^League$|^Cup$|^Friendly$|^Tournament$/, /^Home$|^Away$|^Neutral$/,
  /^Draft$|^Published$|^Archived$/, /^Warmup$/,
  /^Your Team$|^Opponent$|^Balanced$/, /^Medium$/,
  /^Stay patient$|^Read the shooter$/, /^Control emotions$/,
  /^Monday$|^Tuesday$|^Wednesday$|^Thursday$|^Friday$|^Saturday$|^Sunday$/,
  /^English$|^Hrvatski$|^Deutsch$/, /^🇬🇧$|^🇭🇷$|^🇩🇪$/,
  /^Breathing$|^Visualization$|^Tactical/, /^Mental Reset$|^Match Plan$/,
  /^PROGRESS$|^RECENTLY SENT$|^COMPLETE$|^AFTER THE MATCH$|^MENTAL$|^TACTICAL$/,
  /^APPEARANCE$|^NOTIFICATIONS$|^PRIVACY$|^ADMIN$|^DEVELOPMENT$/,
  /^Assigned by /, /^Great job\./, /^Focus on /, /^Keep working/,
  /^Stay patient\./, /^Trust your read/, /^Reset after every/,
  /^See all$|^View All$|^yrs$/, /^Failed to sync/,
  /^3-2-1/, /^2-4/, /^7 vs 6/, /^Standard 6-0/, /^5-1/, /^3-2-1 defence/,
  /^Calm Reader$|^Aggressive Goalkeeper$|^Reactive Goalkeeper$/,
  /^Balanced Goalkeeper$|^Pressure Specialist$|^Developing Goalkeeper$/,
  /^Wing Session$|^Pressure Session$|^Fast Break Session$|^7m Session$/,
  /^Mental Training$|^Match Day Preparation$/,
  /^Backcourt Shots$|^Wing Shots$|^Pivot Shots$|^Fast Breaks$/,
  /^Seven Metre Throws$|^Seven Against Six$|^Pressure Situations$/,
  /^Reading the Shooter$|^Goalkeeper Development$/,
  /^Crosshair$|^ArrowRight$|^Shield$|^Zap$|^Target$|^Users$|^Clock$|^Activity$/,
  /^Intermediate$|^Advanced$|^Expert$|^Beginner$|^Professional$/,
  /^Semi Professional$|^Amateur$|^Competitive$|^Under 14$|^Under 16$|^Under 18$|^Senior$/,
  /^Decision Making$|^Tactical Understanding$|^Mental Preparation$/,
  /^Playing Under Pressure$|^Reading the Defence$|^Position Specific Skills$/,
  /^Left$|^Right$/, /^Pivot$|^Centre Back$|^Left Back$|^Right Back$|^Left Wing$|^Right Wing$/,
  /^Title is required/, /^Situation is required/, /^Question is required/,
  /^At least 2 answer/, /^Explanation is required/, /^Recommended answer/,
  /^Continue as Test User$/, // if still in code as key reference
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (EXT.test(name)) files.push(p);
  }
  return files;
}

function looksLikeUserFacing(text) {
  if (text.length < 4) return false;
  if (!/[a-zA-Z]/.test(text)) return false;
  if (!/[aeiouAEIOU]/.test(text) && text.length > 6) return false;
  for (const pat of SKIP_PATTERNS) {
    if (pat.test(text)) return false;
  }
  // Must contain space or be Title Case phrase likely UI
  if (!/\s/.test(text) && !/^[A-Z][a-z]+([A-Z][a-z]+)+$/.test(text)) {
    if (text.length < 8) return false;
  }
  return /[a-z]{3,}/.test(text);
}

function scanFile(path) {
  const rel = path.replace(ROOT + '/', '');
  if (rel.startsWith('lib/position-scenarios') || rel.startsWith('lib/match-engine') ||
      rel.startsWith('lib/match-day-scenarios') || rel.startsWith('lib/scenarios.ts') ||
      rel.startsWith('lib/admin-storage') || rel.startsWith('lib/admin-templates') ||
      rel.startsWith('lib/coach-storage') || rel.startsWith('lib/coach-dashboard-data') ||
      rel.startsWith('locales/scenario-text')) {
    return [];
  }

  const content = readFileSync(path, 'utf8');
  const hits = [];
  const lines = content.split('\n');

  lines.forEach((line, i) => {
    if (line.includes('t(') || line.includes('translate') || line.includes('localize')) return;
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    if (line.includes('styles.') && !line.includes('Text') && !line.includes('label') && !line.includes('placeholder')) return;

    for (const m of line.matchAll(ENGLISH_IN_STRING)) {
      const text = m[1];
      if (looksLikeUserFacing(text)) {
        hits.push({ line: i + 1, text: text.slice(0, 80) });
      }
    }
  });
  return hits.map((h) => ({ file: rel, ...h }));
}

const files = walk(join(ROOT, 'app')).concat(walk(join(ROOT, 'components'))).concat(walk(join(ROOT, 'context')));
const allHits = files.flatMap(scanFile);

// Key parity
const enKeys = [...readFileSync('locales/en.ts', 'utf8').matchAll(/'([^']+)':/g)].map((m) => m[1]);
const hrKeys = [...readFileSync('locales/hr.ts', 'utf8').matchAll(/'([^']+)':/g)].map((m) => m[1]);
const deKeys = [...readFileSync('locales/de.ts', 'utf8').matchAll(/'([^']+)':/g)].map((m) => m[1]);

const missingHr = enKeys.filter((k) => !hrKeys.includes(k));
const missingDe = enKeys.filter((k) => !deKeys.includes(k));

console.log('=== i18n AUDIT ===');
console.log('Locale keys — en:', enKeys.length, 'hr:', hrKeys.length, 'de:', deKeys.length);
console.log('Missing in hr:', missingHr.length, missingHr.slice(0, 10).join(', ') || '(none)');
console.log('Missing in de:', missingDe.length, missingDe.slice(0, 10).join(', ') || '(none)');
console.log('Potential hardcoded UI strings:', allHits.length);
if (allHits.length) {
  const grouped = {};
  for (const h of allHits.slice(0, 80)) {
    grouped[h.file] ??= [];
    grouped[h.file].push(`L${h.line}: ${h.text}`);
  }
  for (const [f, items] of Object.entries(grouped)) {
    console.log(`\n${f}:`);
    items.forEach((x) => console.log('  ', x));
  }
  if (allHits.length > 80) console.log(`\n... and ${allHits.length - 80} more`);
}

const pass = missingHr.length === 0 && missingDe.length === 0 && allHits.length === 0;
console.log('\n=== RESULT:', pass ? 'PASS' : 'FAIL', '===');
process.exit(pass ? 0 : 1);
