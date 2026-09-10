import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

let recoveryUser: string | null = null;
let deadline = 0;
export function observeRecoveryEvent(event: AuthChangeEvent, session: Session | null) {
  if (event === 'PASSWORD_RECOVERY' && session) {
    recoveryUser = session.user.id;
    deadline = Date.now() + 15 * 60 * 1000;
  } else if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
    clearRecovery();
  }
}
export function clearRecovery() { recoveryUser = null; deadline = 0; }
export function isRecoverySession(session: Session | null): boolean {
  return Boolean(session && session.user.id === recoveryUser && Date.now() < deadline
    && session.expires_at && session.expires_at * 1000 > Date.now());
}
export function recoveryRedirectUrl(): string {
  // Web PKCE recovery must finish in the browser that requested the email.
  const origin = typeof window !== 'undefined' ? window.location?.origin : undefined;
  return `${origin || 'https://handball-iq.vercel.app'}/reset-password`;
}
