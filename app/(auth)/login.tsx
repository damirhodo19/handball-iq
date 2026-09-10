import { recoveryRedirectUrl } from '@/lib/password-recovery';
import { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Apple, Mail, ArrowRight, Shield, Eye, EyeOff, FlaskConical } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { Button } from '@/components/Button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDevAuth } from '@/context/DevAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { isValidEmail, isValidPassword, isNonEmpty } from '@/lib/form-validation';
import { mapAuthError } from '@/lib/map-error';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'choose' | 'email-signin' | 'email-signup'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { signInAsTestUser, clearDevAuth } = useDevAuth();

  async function waitForBrowserSession(maxAttempts = 25): Promise<boolean> {
    if (!supabase) return false;
    for (let i = 0; i < maxAttempts; i++) {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await supabase.auth.refreshSession();
        return true;
      }
      await new Promise((r) => setTimeout(r, 120));
    }
    return false;
  }

  async function signInWithEmail() {
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured || !supabase) {
      setError(t('auth.errorSignIn'));
      return;
    }
    if (!isNonEmpty(email) || !isNonEmpty(password)) { setError(t('auth.errorEmptyFields')); return; }
    if (!isValidEmail(email)) { setError(t('auth.errorInvalidEmail')); return; }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) { setError(mapAuthError(signInError.message, t)); setLoading(false); return; }
      const hasSession = await waitForBrowserSession();
      setLoading(false);
      if (!hasSession) { setError(t('auth.errorSignIn')); return; }
      clearDevAuth();
      router.replace('/(auth)/splash');
    } catch (e: unknown) {
      setError(mapAuthError(e instanceof Error ? e.message : null, t));
      setLoading(false);
    }
  }

  async function signUpWithEmail() {
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured || !supabase) {
      setError(t('auth.errorSignUp'));
      return;
    }
    if (!isNonEmpty(email) || !isNonEmpty(password)) { setError(t('auth.errorEmptyFields')); return; }
    if (!isValidEmail(email)) { setError(t('auth.errorInvalidEmail')); return; }
    if (!isValidPassword(password)) { setError(t('auth.errorShortPassword')); return; }
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
      if (signUpError) { setError(mapAuthError(signUpError.message, t)); setLoading(false); return; }
      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(mapAuthError(signInError.message, t));
          setLoading(false);
          return;
        }
      }
      const hasSession = await waitForBrowserSession();
      setLoading(false);
      if (!hasSession) { setError(t('auth.errorSignUp')); return; }
      clearDevAuth();
      router.replace('/(auth)/splash');
    } catch (e: unknown) {
      setError(e instanceof Error ? mapAuthError(e.message, t) : t('auth.errorSignUp'));
      setLoading(false);
    }
  }

  function handleAppleSignIn() {
    setError(null);
    setNotice(t('auth.comingSoon'));
  }

  async function handleForgotPassword() {
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured || !supabase) {
      setError(t('auth.resetFailed'));
      return;
    }
    if (!email.trim()) { setError(t('auth.errorNoEmail')); return; }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: recoveryRedirectUrl() });
      if (resetError) {
        setError(mapAuthError(resetError.message, t));
      } else {
        setNotice(t('auth.resetSent'));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? mapAuthError(e.message, t) : t('auth.resetFailed'));
    }
    setLoading(false);
  }

  return (
    <LinearGradient colors={Colors.bgGradient} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeIn.delay(100).duration(600)} style={styles.hero}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>IQ</Text>
            </View>
            <Text style={styles.heroTitle}>{t('auth.appName')}</Text>
            <Text style={styles.heroSub}>{t('auth.appTagline')}</Text>
          </Animated.View>

          {mode === 'choose' && (
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.actions}>
              <Button
                label={t('auth.apple')}
                onPress={handleAppleSignIn}
                variant="dark"
                icon={<Apple size={20} color={Colors.textPrimary} />}
              />
              <Button
                label={t('auth.email')}
                onPress={() => { setNotice(null); setMode('email-signin'); }}
                variant="outline"
                icon={<Mail size={20} color={Colors.gold} />}
              />

              <TouchableOpacity style={styles.signupRow} onPress={() => { setNotice(null); setMode('email-signup'); }}>
                <Text style={styles.signupText}>{t('auth.newHere')} </Text>
                <Text style={styles.signupLink}>{t('auth.createAccountLink')}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {(mode === 'email-signin' || mode === 'email-signup') && (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.actions}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('auth.emailLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.emailPlaceholder')}
                  placeholderTextColor={Colors.textQuaternary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('auth.passwordLabel')}</Text>
                <View style={styles.passwordWrap}>
                  <TextInput
                    style={[styles.input, { flex: 1, paddingRight: 48 }]}
                    placeholder={t('auth.passwordPlaceholder')}
                    placeholderTextColor={Colors.textQuaternary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} color={Colors.textTertiary} /> : <Eye size={18} color={Colors.textTertiary} />}
                  </TouchableOpacity>
                </View>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}
              {notice && <Text style={styles.noticeText}>{notice}</Text>}

              <Button
                label={mode === 'email-signin' ? t('auth.signIn') : t('auth.createAccount')}
                onPress={mode === 'email-signin' ? signInWithEmail : signUpWithEmail}
                loading={loading}
                iconRight={<ArrowRight size={20} color={Colors.background} />}
              />

              {mode === 'email-signin' && (
                <TouchableOpacity onPress={handleForgotPassword} style={{ paddingVertical: Spacing.sm }}>
                  <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => { setError(null); setNotice(null); setMode('choose'); }}>
                <Text style={styles.backText}>{t('auth.backToOptions')}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {notice && mode === 'choose' && <Text style={styles.noticeText}>{notice}</Text>}
          {error && mode === 'choose' && <Text style={styles.errorText}>{error}</Text>}

          {__DEV__ && (
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.devBypass}>
              <View style={styles.devDivider}>
                <View style={styles.devDividerLine} />
                <Text style={styles.devDividerText}>{t('auth.devDivider')}</Text>
                <View style={styles.devDividerLine} />
              </View>
              <TouchableOpacity
                style={styles.devBtn}
                activeOpacity={0.85}
                onPress={signInAsTestUser}
              >
                <FlaskConical size={18} color={Colors.gold} />
                <Text style={styles.devBtnText}>{t('auth.testUser')}</Text>
                <ArrowRight size={18} color={Colors.gold} />
              </TouchableOpacity>
              <Text style={styles.devHint}>{t('auth.devHint')}</Text>
            </Animated.View>
          )}

          <View style={styles.footer}>
            <Shield size={13} color={Colors.textQuaternary} />
            <Text style={styles.footerText}>{t('auth.securedBy')}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.huge, paddingBottom: Spacing.xxl },
  hero: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.goldSoft,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoText: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.gold },
  heroTitle: { ...Typography.hero, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 30 },
  heroSub: { ...Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, paddingHorizontal: Spacing.lg, lineHeight: 22 },
  actions: { gap: Spacing.md },
  inputGroup: { gap: Spacing.xs },
  inputLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  passwordWrap: { flexDirection: 'row', alignItems: 'center' },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },
  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', paddingHorizontal: Spacing.md },
  noticeText: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 14, textAlign: 'center', paddingHorizontal: Spacing.md, marginTop: Spacing.sm },
  signupRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: Spacing.sm },
  signupText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14 },
  signupLink: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  backText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', paddingVertical: Spacing.sm },
  forgotText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'center' },
  footer: { marginTop: 'auto', paddingTop: Spacing.xxl, alignItems: 'center', gap: 6, flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: Colors.textQuaternary, fontFamily: 'Inter-Regular', fontSize: 12 },

  devBypass: { marginTop: Spacing.xl, paddingHorizontal: Spacing.sm },
  devDivider: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  devDividerLine: { flex: 1, height: 1, backgroundColor: Colors.hairline },
  devDividerText: { color: Colors.textQuaternary, fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 1.5 },
  devBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    paddingVertical: 16, borderRadius: Radius.lg,
    backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.gold,
  },
  devBtnText: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 15 },
  devHint: { color: Colors.textQuaternary, fontFamily: 'Inter-Regular', fontSize: 12, textAlign: 'center', marginTop: Spacing.sm },
});
