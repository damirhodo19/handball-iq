import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, ArrowRight, Shield, UserCircle, Check } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { CoachRole, createCoachAccount } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translateRole, translateRoleShort } from '@/lib/translations';

const ROLES: CoachRole[] = ['Coach', 'Assistant Coach', 'Goalkeeper Coach', 'Academy Coach'];

export default function CoachLoginScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState<CoachRole>('Coach');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!name.trim() || !email.trim() || !teamName.trim()) {
      setError(t('coachLogin.errorFields'));
      return;
    }
    setError('');
    createCoachAccount(name.trim(), email.trim(), role, teamName.trim());
    router.replace('/coach-dashboard');
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('coachLogin.title')}</Text>
            <Text style={styles.headerSub}>{t('coachLogin.subtitle')}</Text>
          </View>
        </Animated.View>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <LinearGradient
            colors={['rgba(212,175,55,0.14)', 'rgba(212,175,55,0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroWrap}
          >
            <View style={styles.heroIcon}><Shield size={32} color={Colors.gold} /></View>
            <Text style={styles.heroTitle}>{t('coachLogin.access')}</Text>
            <Text style={styles.heroSub}>{t('coachLogin.description')}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.label}>{t('coachLogin.fullName')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('coachLogin.fullNamePlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text style={styles.label}>{t('coachLogin.email')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('coachLogin.emailPlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.label}>{t('coachLogin.teamName')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('coachLogin.teamNamePlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            value={teamName}
            onChangeText={setTeamName}
            returnKeyType="done"
          />
        </Animated.View>

        {/* Role selection */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <Text style={styles.label}>{t('coachLogin.coachRole')}</Text>
          <View style={styles.roleGrid}>
            {ROLES.map((r) => {
              const active = role === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleCard, active && styles.roleCardActive]}
                  onPress={() => setRole(r)}
                  activeOpacity={0.8}
                >
                  {active && <View style={styles.roleCheck}><Check size={12} color={Colors.background} /></View>}
                  <Text style={[styles.roleTitle, active && styles.roleTitleActive]}>{translateRole(r, t)}</Text>
                  <Text style={[styles.roleShort, active && styles.roleShortActive]}>{translateRoleShort(r, t)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Login button */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={{ marginTop: Spacing.xl }}>
          <Button
            label={t('coachLogin.enterDashboard')}
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

  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  input: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },

  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  roleCard: { width: '48%', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border, gap: 4 },
  roleCardActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  roleCheck: { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 6, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' },
  roleTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  roleTitleActive: { color: Colors.background },
  roleShort: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textTertiary },
  roleShortActive: { color: Colors.background + 'CC' },

  errorText: { color: Colors.error, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: Spacing.md, textAlign: 'center' },
});
