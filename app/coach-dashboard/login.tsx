import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ArrowRight, Shield, UserCircle, Check } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BackButton } from '@/components/BackButton';
import { ScreenBackground } from '@/components/Screen';
import { CoachRole, createCoachAccount } from '@/lib/coach-dashboard-data';
import { createClub, createTeam, initCoachPlatform } from '@/lib/team-platform/platform';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { translateRole, translateRoleShort } from '@/lib/translations';
import { isValidEmail, isNonEmpty } from '@/lib/form-validation';
import { mapServiceError } from '@/lib/map-error';

const ROLES: CoachRole[] = ['Coach', 'Assistant Coach', 'Goalkeeper Coach', 'Academy Coach'];

export default function CoachLoginScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isDevAuthenticated } = useDevAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [teamName, setTeamName] = useState('');
  const [clubName, setClubName] = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole] = useState<CoachRole>('Coach');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isNonEmpty(name) || !isNonEmpty(email) || !isNonEmpty(teamName) || !isNonEmpty(clubName)) {
      setError(t('coachLogin.errorFields'));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t('auth.errorInvalidEmail'));
      return;
    }
    setError('');
    setLoading(true);
    const coachId = user?.id ?? (isDevAuthenticated ? 'dev_coach' : `coach_${Date.now()}`);

    createCoachAccount(name.trim(), email.trim(), role, teamName.trim());

    const { error: clubError, club } = await createClub({
      name: clubName.trim(),
      country: country.trim() || undefined,
      season: '2025/26',
      description: `${clubName.trim()} — Handball IQ club`,
      owner_id: coachId,
    });
    if (clubError) {
      setError(mapServiceError(clubError, t));
      setLoading(false);
      return;
    }

    const { error: teamError } = await createTeam({
      name: teamName.trim(),
      club_id: club?.id,
      club_name: clubName.trim(),
      country: country.trim() || undefined,
      team_category: 'Senior',
      created_by: coachId,
    });
    if (teamError) {
      setError(mapServiceError(teamError, t));
      setLoading(false);
      return;
    }

    await initCoachPlatform(coachId, name.trim());
    setLoading(false);
    router.replace('/coach-dashboard');
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <BackButton fallbackHref="/(tabs)/home" />
          <View style={{ flex: 1, minWidth: 0 }}>
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
          <Text style={styles.label}>{t('team.clubName')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('team.clubNamePlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            value={clubName}
            onChangeText={setClubName}
            returnKeyType="next"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(500)}>
          <Text style={styles.label}>{t('team.country')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('team.countryPlaceholder')}
            placeholderTextColor={Colors.textQuaternary}
            value={country}
            onChangeText={setCountry}
            returnKeyType="next"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(500)}>
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
            label={loading ? t('common.loading') : t('coachLogin.enterDashboard')}
            onPress={handleLogin}
            disabled={loading}
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
