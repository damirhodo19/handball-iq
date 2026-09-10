import assert from 'node:assert/strict';
import { createRuntime } from './lib/localization-test-runtime.mjs';
let updates = 0;
let failure = null;
let session = { user: { id: 'test' }, expires_at: Math.floor(Date.now()/1000)+3600 };
const runtime = createRuntime(process.cwd(), { '@/lib/supabase': { supabase: { auth: {
  getSession: async () => ({ data: { session }, error: null }),
  updateUser: async () => { updates++; return { error: failure }; },
} } } });
const guard = runtime.load('@/lib/password-recovery');
const { completePasswordRecovery: complete } = runtime.load('@/services/passwordRecoveryService');
assert.equal(await complete('abcdef','abcdef'), 'auth.recoveryInvalid');
guard.observeRecoveryEvent('SIGNED_IN',session);
assert.equal(await complete('abcdef','abcdef'), 'auth.recoveryInvalid');
guard.observeRecoveryEvent('PASSWORD_RECOVERY',session);
assert.equal(await complete('abc','abc'),'auth.errorShortPassword');
assert.equal(await complete('abcdef','different'),'auth.recoveryMismatch');
assert.equal(updates,0);
failure={code:'same_password'};
assert.equal(await complete('abcdef','abcdef'),'auth.recoverySame');
assert.equal(guard.isRecoverySession(session),true);
failure=null;
assert.equal(await complete('abcdef','abcdef'),null);
assert.equal(await complete('abcdef','abcdef'),'auth.recoveryInvalid');
assert.equal(updates,2);
guard.observeRecoveryEvent('PASSWORD_RECOVERY',session);
assert.equal(guard.isRecoverySession({...session,user:{id:'other'}}),false);
assert.equal(guard.isRecoverySession({...session,expires_at:1}),false);
guard.observeRecoveryEvent('SIGNED_OUT',null);
assert.equal(guard.isRecoverySession(session),false);
for (const lang of ['en','hr','de']) {
  const dict=runtime.load(`@/locales/${lang}`)[lang];
  for(const suffix of ['Title','Confirm','Save','Back','Invalid','Success','Mismatch','Same']) {
    assert.ok(dict[`auth.recovery${suffix}`]);
    if(lang!=='en') assert.notEqual(dict[`auth.recovery${suffix}`],runtime.load('@/locales/en').en[`auth.recovery${suffix}`]);
  }
}
console.log('PASS: recovery validation, session isolation, expiry, retry, one use and EN/HR/DE copy');
