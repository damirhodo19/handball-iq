import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, ClipboardList } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { buildPlayerProfile, generateTrainingPlan, TrainingDay } from '@/lib/coach-engine';
import { useTranslation } from '@/hooks/useTranslation';
import { translateDay } from '@/lib/translations';

export default function PlanScreen() {
  const { t } = useTranslation();
  const [plan, setPlan] = useState<TrainingDay[]>([]);

  useFocusEffect(useCallback(() => {
    const profile = buildPlayerProfile();
    setPlan(generateTrainingPlan(profile));
  }, []));

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('coachPlan.title')}</Text>
            <Text style={styles.headerSub}>{t('coachPlan.subtitle')}</Text>
          </View>
        </View>

        {/* Intro */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.introCard}>
            <View style={styles.introRow}>
              <View style={styles.introIcon}><ClipboardList size={22} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.introTitle}>{t('coachPlan.weekAhead')}</Text>
                <Text style={styles.introText}>{t('coachPlan.description')}</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Day cards */}
        {plan.map((day, i) => (
          <DayCard key={day.day} day={day} index={i} isWeekend={i >= 5} />
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

function DayCard({ day, index, isWeekend }: { day: TrainingDay; index: number; isWeekend: boolean }) {
  const { t } = useTranslation();
  return (
    <Animated.View entering={FadeInDown.delay(index * 50 + 50).duration(400)}>
      <Card variant="gradient" shadow="card" style={[styles.dayCard, isWeekend && styles.dayCardWeekend]}>
        <View style={styles.dayHeader}>
          <View style={[styles.dayBadge, isWeekend && styles.dayBadgeWeekend]}>
            <Text style={[styles.dayBadgeText, isWeekend && styles.dayBadgeTextWeekend]}>{translateDay(day.day, t).slice(0, 3).toUpperCase()}</Text>
          </View>
          <Text style={styles.dayName}>{translateDay(day.day, t)}</Text>
        </View>
        <Text style={styles.dayFocus}>{day.focus}</Text>
        <Text style={styles.dayDesc}>{day.description}</Text>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  introCard: { gap: Spacing.md, marginBottom: Spacing.md },
  introRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  introIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  introTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  introText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20, marginTop: 2 },

  dayCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  dayCardWeekend: { borderColor: Colors.gold + '44' },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dayBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  dayBadgeWeekend: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  dayBadgeText: { fontFamily: 'Inter-ExtraBold', fontSize: 12, color: Colors.gold, letterSpacing: 0.5 },
  dayBadgeTextWeekend: { color: Colors.background },
  dayName: { fontFamily: 'Inter-ExtraBold', fontSize: 17, color: Colors.textPrimary },
  dayFocus: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.gold },
  dayDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20 },
});
