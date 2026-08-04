import { useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Shield, Star, Target, ArrowRight, Home } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { useMatchDay } from '@/context/MatchDayContext';
import { loadPreps, MatchDayPrep, calculateReadiness } from '@/lib/match-day-storage';
import { useTranslation } from '@/hooks/useTranslation';

export default function ReadyScreen() {
  const { t } = useTranslation();
  const { activePrep, prepMode, tacticalAnswers, leaveBehinds, visualStep, personalStatement, resetActivePrep } = useMatchDay();

  // Calculate readiness
  const { mental, tactical } = calculateReadiness({
    mode: prepMode,
    leaveBehinds,
    visualStep,
    tacticalAnswers,
    personalStatement,
  });

  const mentalColor = mental >= 80 ? Colors.success : mental >= 60 ? Colors.gold : Colors.warning;
  const tacticalColor = tactical >= 80 ? Colors.success : tactical >= 60 ? Colors.gold : Colors.warning;

  const handleFinish = () => {
    resetActivePrep();
    router.replace('/(tabs)/match-day');
  };

  const handleReviewPlan = () => {
    // Navigate back to the last step of preparation
    router.push('/match-day/prepare');
  };

  const opponent = activePrep?.setup.opponent ?? t('matchDay.todaysOpponent');
  const goals = activePrep?.setup.goals ?? [];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.hero}>
          <View style={styles.heroIcon}>
            <Shield size={44} color={Colors.gold} />
          </View>
          <Text style={styles.heroTitle}>{t('matchDay.readyTitle')}</Text>
          <Text style={styles.heroSub}>{t('matchDay.vsOpponent', { opponent })}</Text>
        </Animated.View>

        {/* Readiness scores */}
        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <Text style={styles.sectionLabel}>{t('matchDay.readiness')}</Text>
          <Card variant="gradient" shadow="cardLg" style={styles.readinessCard}>
            <View style={styles.readinessRow}>
              <View style={styles.readinessStat}>
                <Text style={[styles.readinessValue, { color: mentalColor }]}>{mental}%</Text>
                <Text style={styles.readinessLabel}>{t('matchDay.mentalReadiness')}</Text>
                <View style={[styles.readinessBar, { backgroundColor: Colors.border }]}>
                  <View style={[styles.readinessFill, { width: `${mental}%` as any, backgroundColor: mentalColor }]} />
                </View>
              </View>
              <View style={styles.readinessDivider} />
              <View style={styles.readinessStat}>
                <Text style={[styles.readinessValue, { color: tacticalColor }]}>{tactical}%</Text>
                <Text style={styles.readinessLabel}>{t('matchDay.tacticalReadiness')}</Text>
                <View style={[styles.readinessBar, { backgroundColor: Colors.border }]}>
                  <View style={[styles.readinessFill, { width: `${tactical}%` as any, backgroundColor: tacticalColor }]} />
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Main focus */}
        {goals.length > 0 && (
          <Animated.View entering={FadeInDown.delay(250).duration(600)}>
            <Text style={styles.sectionLabel}>{t('matchDay.mainFocus')}</Text>
            <Card variant="gradient" shadow="card" style={styles.focusCard}>
              <View style={styles.focusRow}>
                <Target size={18} color={Colors.gold} />
                <View style={{ flex: 1 }}>
                  {goals.map((g) => (
                    <Text key={g} style={styles.focusGoal}>{g}</Text>
                  ))}
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Personal statement */}
        <Animated.View entering={FadeInDown.delay(350).duration(600)}>
          <Text style={styles.sectionLabel}>{t('matchDay.yourStatement')}</Text>
          <Card variant="gradient" shadow="card" style={styles.statementCard}>
            <Star size={16} color={Colors.gold} />
            <Text style={styles.statementText}>{personalStatement}</Text>
          </Card>
        </Animated.View>

        {/* Key reminders */}
        <Animated.View entering={FadeInDown.delay(450).duration(600)}>
          <Text style={styles.sectionLabel}>{t('matchDay.keyReminders')}</Text>
          <Card variant="gradient" shadow="card" style={styles.remindersCard}>
            {[
              t('matchDay.reminder1'),
              t('matchDay.reminder2'),
              t('matchDay.reminder3'),
            ].map((r, i) => (
              <View key={i} style={styles.reminderRow}>
                <View style={styles.reminderDot} />
                <Text style={styles.reminderText}>{r}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInDown.delay(550).duration(600)} style={styles.buttons}>
          <Button
            label={t('matchDay.finishPrep')}
            onPress={handleFinish}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
          />
          <TouchableOpacity style={styles.reviewBtn} onPress={handleReviewPlan} activeOpacity={0.8}>
            <Text style={styles.reviewBtnText}>{t('matchDay.reviewPlan')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 24, paddingBottom: Spacing.xxxl },

  hero: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
  heroIcon: { width: 88, height: 88, borderRadius: 28, backgroundColor: Colors.goldSoft, borderWidth: 2, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  heroTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 34, color: Colors.textPrimary },
  heroSub: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 16 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  readinessCard: { gap: Spacing.md },
  readinessRow: { flexDirection: 'row', alignItems: 'stretch', gap: Spacing.md },
  readinessStat: { flex: 1, gap: Spacing.sm },
  readinessDivider: { width: 1, backgroundColor: Colors.hairline },
  readinessValue: { fontFamily: 'Inter-ExtraBold', fontSize: 32 },
  readinessLabel: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },
  readinessBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  readinessFill: { height: 4, borderRadius: 2 },

  focusCard: { gap: 0 },
  focusRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  focusGoal: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary, lineHeight: 24 },

  statementCard: { gap: Spacing.sm },
  statementText: { color: Colors.textPrimary, fontFamily: 'Inter-SemiBold', fontSize: 15, lineHeight: 23, fontStyle: 'italic' },

  remindersCard: { gap: Spacing.md },
  reminderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  reminderDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold, marginTop: 8 },
  reminderText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  buttons: { gap: Spacing.sm, marginTop: Spacing.xl },
  reviewBtn: { paddingVertical: 16, alignItems: 'center', borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  reviewBtnText: { color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 16 },
});
