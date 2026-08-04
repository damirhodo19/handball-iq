import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, ArrowRight, Shield, Lock } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { loginAdmin } from '@/lib/admin-storage';
import { useTranslation } from '@/hooks/useTranslation';

export default function AdminLoginScreen() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!password.trim()) {
      setError(t('admin.errorEmpty'));
      return;
    }
    if (loginAdmin(password.trim())) {
      setError('');
      router.replace('/admin/dashboard');
    } else {
      setError(t('admin.errorWrong'));
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('admin.loginTitle')}</Text>
            <Text style={styles.headerSub}>{t('admin.loginSub')}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <LinearGradient
            colors={['rgba(212,175,55,0.14)', 'rgba(212,175,55,0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroWrap}
          >
            <View style={styles.heroIcon}><Shield size={32} color={Colors.gold} /></View>
            <Text style={styles.heroTitle}>{t('admin.access')}</Text>
            <Text style={styles.heroSub}>{t('admin.accessDesc')}</Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.label}>{t('admin.passwordLabel')}</Text>
          <View style={styles.inputWrap}>
            <Lock size={18} color={Colors.textTertiary} style={{ marginLeft: 4 }} />
            <TextInput
              style={styles.input}
              placeholder={t('admin.passwordPlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
          </View>
          <Text style={styles.hint}>{t('admin.passwordHint')}</Text>
        </Animated.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={{ marginTop: Spacing.xl }}>
          <Button
            label={t('admin.enterBtn')}
            onPress={handleLogin}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
          />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  heroWrap: { borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.gold, marginBottom: Spacing.xl, alignItems: 'center' },
  heroIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.goldSoft, borderWidth: 2, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  heroTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  heroSub: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: Spacing.sm },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.sm, gap: Spacing.xs },
  input: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 16, paddingVertical: 14 },
  hint: { color: Colors.textQuaternary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: Spacing.sm },
  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.md, textAlign: 'center' },
});
