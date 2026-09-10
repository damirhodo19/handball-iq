import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { isRecoverySession } from '@/lib/password-recovery';
import { completePasswordRecovery } from '@/services/passwordRecoveryService';
import { Colors, Typography, Spacing } from '@/lib/theme';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const [state, setState] = useState<'loading' | 'ready' | 'invalid' | 'success'>('loading');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const result = await supabase?.auth.getSession();
        if (active) setState(result && !result.error && isRecoverySession(result.data.session) ? 'ready' : 'invalid');
      } catch { if (active) setState('invalid'); }
    }
    const subscription = supabase?.auth.onAuthStateChange((event, session) => {
      if (active && event === 'PASSWORD_RECOVERY' && isRecoverySession(session)) setState('ready');
      if (active && event === 'SIGNED_OUT') setState('invalid');
    });
    void check();
    return () => { active = false; subscription?.data.subscription.unsubscribe(); };
  }, []);
  async function save() {
    if (busy) return;
    setBusy(true);
    setError(null);
    const failure = await completePasswordRecovery(password, confirmation);
    if (failure) { setError(failure); if (failure === 'auth.recoveryInvalid') setState('invalid'); }
    else { setPassword(''); setConfirmation(''); setState('success'); }
    setBusy(false);
  }
  return <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>{t('auth.recoveryTitle')}</Text>
    {state === 'loading' && <Text style={styles.text}>{t('common.loading')}</Text>}
    {state === 'invalid' && <Text style={styles.text}>{t('auth.recoveryInvalid')}</Text>}
    {state === 'success' && <Text style={styles.text}>{t('auth.recoverySuccess')}</Text>}
    {state === 'ready' && <>
      <Text style={styles.text}>{t('auth.passwordLabel')}</Text>
      <TextInput accessibilityLabel={t('auth.passwordLabel')} style={styles.input} secureTextEntry autoComplete="new-password" autoCapitalize="none" value={password} onChangeText={setPassword} editable={!busy} />
      <Text style={styles.text}>{t('auth.recoveryConfirm')}</Text>
      <TextInput accessibilityLabel={t('auth.recoveryConfirm')} style={styles.input} secureTextEntry autoComplete="new-password" autoCapitalize="none" value={confirmation} onChangeText={setConfirmation} editable={!busy} />
      {error && <Text accessibilityRole="alert" style={styles.error}>{t(error)}</Text>}
      <Button label={t('auth.recoverySave')} onPress={save} loading={busy} />
    </>}
    {state !== 'loading' && <Button label={t('auth.recoveryBack')} variant="outline" disabled={busy} onPress={() => router.replace('/(auth)/login')} />}
  </ScrollView>;
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', backgroundColor: Colors.background, padding: Spacing.lg, gap: Spacing.md },
  title: { ...Typography.h1, color: Colors.textPrimary },
  text: { ...Typography.body, color: Colors.textPrimary },
  input: { color: Colors.textPrimary, borderColor: Colors.gold, borderWidth: 1, borderRadius: 12, padding: Spacing.md },
  error: { color: Colors.error },
});
