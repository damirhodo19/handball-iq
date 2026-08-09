import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Shield, Trophy, Clock, BarChart3, Play } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { BackButton } from '@/components/BackButton';
import { ScreenBackground } from '@/components/Screen';
import { useMatch } from '@/context/MatchContext';
import { getLocalizedMatchConfig } from '@/lib/match-config-i18n';
import { loadProfile } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translateDifficulty, translatePosition } from '@/lib/translations';
import { isHandballPosition } from '@/lib/platform/position-modules';

export default function MatchIntroScreen() {
  const { t } = useTranslation();
  const { startMatch } = useMatch();
  const profile = loadProfile();
  const position = isHandballPosition(profile.position) ? profile.position : null;
  const matchConfig = getLocalizedMatchConfig(t);

  function handleStart() {
    if (!position) {
      router.push('/(auth)/onboarding');
      return;
    }
    startMatch();
    router.push('/match/play');
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topNav}>
          <BackButton />
        </View>
        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.heroWrap}>
          <View style={styles.heroIcon}>
            <Shield size={48} color={Colors.gold} />
          </View>
          <Text style={styles.heroTitle}>{t('match.title')}</Text>
          <Text style={styles.heroSub}>
            {position ? translatePosition(position, t) : t('match.subtitle')}
          </Text>
        </Animated.View>

        {/* Match Info Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Card variant="gradient" shadow="cardLg" style={styles.infoCard}>
            <InfoRow icon={<Trophy size={16} color={Colors.gold} />} label={t('match.opponentLabel')} value={matchConfig.opponent} />
            <Divider />
            <InfoRow icon={<BarChart3 size={16} color={Colors.gold} />} label={t('match.competitionLabel')} value={matchConfig.competition} />
            <Divider />
            <InfoRow icon={<BarChart3 size={16} color={Colors.gold} />} label={t('match.difficultyLabel')} value={t('match.difficulty', { difficulty: translateDifficulty(matchConfig.difficulty, t) })} />
            <Divider />
            <InfoRow icon={<Clock size={16} color={Colors.gold} />} label={t('match.durationLabel')} value={t('match.duration', { duration: matchConfig.duration })} />
          </Card>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Card variant="gradient" shadow="card" style={styles.descCard}>
            <Text style={styles.descText}>{t('match.introDesc', { n: matchConfig.situationCount })}</Text>
          </Card>
        </Animated.View>

        {/* What to expect */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)}>
          <Text style={styles.sectionLabel}>{t('match.whatToExpect')}</Text>
          <Card variant="gradient" shadow="card" style={styles.expectCard}>
            <ExpectItem text={t('match.eachDecision')} />
          </Card>
        </Animated.View>

        {/* Start Button */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.btnWrap}>
          <Button label={t('match.startMatch')} onPress={handleStart} icon={<Play size={20} color={Colors.background} />} />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function ExpectItem({ text }: { text: string }) {
  return (
    <View style={styles.expectRow}>
      <View style={styles.expectBullet} />
      <Text style={styles.expectText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxxl },
  topNav: { marginBottom: Spacing.md, alignSelf: 'flex-start' },
  heroWrap: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  heroIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  heroTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.textPrimary },
  heroSub: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14, letterSpacing: 1 },

  infoCard: { gap: 0, padding: 0 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
  infoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { flex: 1, color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 14 },
  infoValue: { color: Colors.textPrimary, fontFamily: 'Inter-SemiBold', fontSize: 15 },
  divider: { height: 1, backgroundColor: Colors.hairline, marginLeft: 68 },

  descCard: { marginBottom: 0 },
  descText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 15, lineHeight: 23 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  expectCard: { gap: Spacing.md },
  expectRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  expectBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold },
  expectText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 20 },

  btnWrap: { marginTop: Spacing.xxl },
});
