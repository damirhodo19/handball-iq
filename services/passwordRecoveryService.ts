import { supabase } from '@/lib/supabase';
import { clearRecovery, isRecoverySession } from '@/lib/password-recovery';
import { isValidPassword } from '@/lib/form-validation';

export async function completePasswordRecovery(password: string, confirmation: string): Promise<string | null> {
  if (!isValidPassword(password)) return 'auth.errorShortPassword';
  if (password !== confirmation) return 'auth.recoveryMismatch';
  if (!supabase) return 'auth.recoveryInvalid';
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !isRecoverySession(data.session)) return 'auth.recoveryInvalid';
    const result = await supabase.auth.updateUser({ password });
    if (result.error) return result.error.code === 'same_password' ? 'auth.recoverySame' : 'auth.resetFailed';
    clearRecovery();
    return null;
  } catch { return 'auth.resetFailed'; }
}
