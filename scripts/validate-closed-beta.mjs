#!/usr/bin/env node
/**
 * Closed Beta build readiness — config / release hygiene (not a device smoke).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

let failed = 0;
const findings = [];

function assert(cond, msg, sev = 'BLOCKER') {
  if (!cond) {
    failed++;
    findings.push({ sev, msg });
    console.error(`FAIL  [${sev}] ${msg}`);
  } else {
    console.log(`  ✓ ${msg}`);
  }
}

console.log('\n=== Closed Beta Readiness ===\n');

console.log('=== Identity & versioning ===');
assert(exists('app.config.ts'), 'app.config.ts present');
assert(exists('eas.json'), 'eas.json present');
assert(!exists('app.json'), 'legacy app.json removed (single source of truth)');
const cfg = read('app.config.ts');
assert(cfg.includes("name: 'Handball IQ'") || cfg.includes('name: "Handball IQ"'), 'app name Handball IQ');
assert(cfg.includes('0.9.0'), 'version 0.9.0');
assert(cfg.includes("bundleIdentifier: 'com.llhprojects.handballiq'"), 'iOS bundle id');
assert(cfg.includes("package: 'com.llhprojects.handballiq'"), 'Android package');
assert(cfg.includes("buildNumber: '1'") || cfg.includes('buildNumber: "1"'), 'iOS buildNumber 1');
assert(cfg.includes('versionCode: 1'), 'Android versionCode 1');
assert(cfg.includes("userInterfaceStyle: 'automatic'"), 'system theme support');
assert(read('package.json').includes('"version": "0.9.0"'), 'package.json version 0.9.0');
assert(read('lib/app-version.ts').includes('getBetaVersionLabel'), 'beta version helper');

console.log('\n=== EAS profiles ===');
const eas = JSON.parse(read('eas.json'));
assert(Boolean(eas.build?.development), 'development profile');
assert(Boolean(eas.build?.preview), 'preview profile');
assert(Boolean(eas.build?.production), 'production profile');
assert(eas.build.preview.distribution === 'internal', 'preview is internal distribution');
assert(eas.build.preview.env?.APP_ENV === 'preview', 'preview APP_ENV');

console.log('\n=== Release-mode cleanup ===');
assert(read('app/(auth)/login.tsx').includes('{__DEV__ &&'), 'test-user button gated by __DEV__');
assert(read('context/DevAuthContext.tsx').includes('if (!__DEV__) return'), 'signInAsTestUser no-op in release');
assert(read('app/(tabs)/settings.tsx').includes('{__DEV__ ?'), 'admin settings gated');
assert(read('app/(tabs)/settings.tsx').includes('beta.feedback'), 'beta feedback entry');
assert(read('app/_layout.tsx').includes('AppErrorBoundary'), 'error boundary wired');

console.log('\n=== Environment safety ===');
assert(exists('.env.example'), '.env.example present');
assert(read('.gitignore').includes('.env'), '.env gitignored');
assert(read('.gitignore').includes('.env.save'), '.env.save gitignored');
const envExample = read('.env.example');
// Only flag real assignments / export lines — comments may mention forbidden names.
const envSecretAssign = envExample
  .split('\n')
  .filter((line) => !/^\s*#/.test(line))
  .some((line) => /(?:SERVICE_ROLE|service_role|password)\s*=/i.test(line));
assert(!envSecretAssign, '.env.example has no secret assignments');
assert(envExample.includes('EXPO_PUBLIC_SUPABASE_URL'), 'documents public Supabase URL');
assert(envExample.includes('EXPO_PUBLIC_SUPABASE_ANON_KEY'), 'documents anon key only');

// Tracked secret scan (ignore scripts that only read env at runtime)
let trackedEnvSave = '';
try {
  trackedEnvSave = execSync('git ls-files .env .env.save', { cwd: root, encoding: 'utf8' }).trim();
} catch {
  trackedEnvSave = '';
}
assert(!trackedEnvSave, 'no .env / .env.save tracked in git');

const supabase = read('lib/supabase.ts');
assert(
  supabase.includes('EXPO_PUBLIC_SUPABASE_URL') && supabase.includes('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  'client uses public env vars only',
);
assert(!supabase.includes('SERVICE_ROLE'), 'supabase client has no service role');

console.log('\n=== Locales ===');
assert(exists('locales/closed-beta-messages.ts'), 'closed-beta messages');
assert(read('locales/en.ts').includes('closedBetaMessagesEn'), 'en wires beta messages');
assert(read('locales/hr.ts').includes('closedBetaMessagesHr'), 'hr wires beta messages');
assert(read('locales/de.ts').includes('closedBetaMessagesDe'), 'de wires beta messages');

const report = {
  name: 'Handball IQ 2.0 — Closed Beta Readiness',
  date: new Date().toISOString(),
  verdict: failed === 0 ? 'READY TO BUILD PREVIEW' : 'NOT READY',
  failures: findings,
  manualSmoke: {
    devices: ['iPhone (required)', 'Android physical or emulator'],
    flows: [
      'Splash → Register → Onboarding → Home',
      'Login → session restore after kill',
      'Training / Match / Programs / Progress / Profile / Settings',
      'Offline activity → reopen → online sync (no duplicates)',
      'Goalkeeper / Wing / Back / Pivot personalization accounts',
      'Coach + player_coach mode switch / no XP mix',
      'Light / Dark / System + EN/HR/DE',
      'Settings → Beta feedback email compose',
    ],
    eas: [
      'eas login',
      'eas init (set EAS_PROJECT_ID)',
      'eas secret:create EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY',
      'npm run build:preview:ios',
      'npm run build:preview:android',
    ],
  },
  security: {
    bundledSecretsAllowed: ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'],
    neverBundle: ['SUPABASE_SERVICE_ROLE_KEY', 'database password', 'admin private keys'],
    note: '.env.save may exist locally — ensure it stays untracked (now gitignored).',
  },
};

fs.writeFileSync(path.join(root, 'scripts/closed-beta-readiness-report.json'), JSON.stringify(report, null, 2));
console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'} — ${failed} failure(s)`);
console.log('Wrote scripts/closed-beta-readiness-report.json');
console.log(`VERDICT: ${report.verdict}\n`);
process.exit(failed === 0 ? 0 : 1);
