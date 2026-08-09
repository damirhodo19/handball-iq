import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

readFileSync('.env', 'utf8').split('\n').forEach((l) => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
});

const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
const email = `rls.${Date.now()}@handballiq.test`;
const pw = `HbIQ-Rls-${Date.now()}-Xk9mP2nQ7`;

async function ensureAuthSession() {
  const signUp = await sb.auth.signUp({ email, password: pw });
  if (!signUp.error && signUp.data.session) return;

  if (signUp.error && !/rate limit exceeded|invalid/i.test(signUp.error.message)) {
    console.error('FAIL signup', signUp.error.message);
    process.exit(1);
  }

  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    try {
      const ref = new URL(process.env.EXPO_PUBLIC_SUPABASE_URL).hostname.split('.')[0];
      const stdout = execSync(`npx supabase projects api-keys --project-ref ${ref}`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 30000,
      });
      serviceRoleKey = JSON.parse(stdout.trim()).keys?.find((k) => k.name === 'service_role')?.api_key;
    } catch {}
  }

  if (serviceRoleKey) {
    const admin = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await admin.auth.admin.createUser({
      email,
      password: pw,
      email_confirm: true,
    });
    if (error && !/already been registered/i.test(error.message)) {
      console.error('FAIL admin createUser', error.message);
      process.exit(1);
    }
  } else if (signUp.error) {
    console.error('FAIL signup', signUp.error.message);
    process.exit(1);
  }

  const signIn = await sb.auth.signInWithPassword({ email, password: pw });
  if (signIn.error) {
    console.error('FAIL signin', signIn.error.message);
    process.exit(1);
  }
}

await ensureAuthSession();

const ins = await sb.from('session_results').insert({
  session_type: 'training', session_name: 'RLS test', score: 50, decision_score: 50,
  mental_readiness: 0, pressure_control: 0, duration_seconds: 60, answers: [],
}).select('id').single();
if (ins.error) { console.error('FAIL insert+select', ins.error.message); process.exit(1); }

const sel = await sb.from('session_results').select('id, decision_score').limit(5);
if (sel.error) { console.error('FAIL select', sel.error.message); process.exit(1); }
if (!sel.data?.length) { console.error('FAIL select empty'); process.exit(1); }

console.log('PASS rls verification');
