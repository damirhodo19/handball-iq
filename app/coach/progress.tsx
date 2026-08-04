import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { getLongTermProgress, ProgressPeriod } from '@/lib/coach-engine';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProgressScreen() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<{ last7: ProgressPeriod; last30: ProgressPeriod; allTime: ProgressPeriod } | null>(null);

  useFocusEffect(useCallback(() => {
    setProgress(getLongTermProgress());
  }, []));

  if (!progress) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('coachProgress.loading')}</Text></View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('coachProgress.title')}</Text>
            <Text style={styles.headerSub}>{t('coachProgress.subtitle')}</Text>
          </View>
        </View>

        {/* Period cards */}
        <PeriodCard period={progress.last7} index={0} />
        <PeriodCard period={progress.last30} index={1} />
        <PeriodCard period={progress.allTime} index={2} />

        {/* Legend */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.legendCard}>
            <Text style={styles.legendTitle}>{t('coachProgress.howToRead')}</Text>
            <View style={styles.legendRow}>
              <TrendingUp size={14} color={Colors.success} />
              <Text style={styles.legendText}>{t('coachProgress.upArrow')}</Text>
            </View>
            <View style={styles.legendRow}>
              <TrendingDown size={14} color={Colors.error} />
              <Text style={styles.legendText}>{t('coachProgress.downArrow')}</Text>
            </View>
            <View style={styles.legendRow}>
              <Minus size={14} color={Colors.textTertiary} />
              <Text style={styles.legendText}>{t('coachProgress.stableInfo')}</Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function PeriodCard({ period, index }: { period: ProgressPeriod; index: number }) {
  const { t } = useTranslation();
  const TrendIcon = period.trend === 'up' ? TrendingUp : period.trend === 'down' ? TrendingDown : Minus;
  const trendColor = period.trend === 'up' ? Colors.success : period.trend === 'down' ? Colors.error : Colors.textTertiary;
  const scoreColor = period.avgScore >= 80 ? Colors.success : period.avgScore >= 60 ? Colors.gold : period.avgScore >= 40 ? Colors.warning : Colors.error;

  return (
    <Animated.View entering={FadeInDown.delay(index * 80 + 50).duration(400)}>
      <Card variant="gradient" shadow="card" style={styles.periodCard}>
        <View style={styles.periodHeader}>
          <View style={styles.periodIconWrap}>
            <Activity size={18} color={Colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.periodLabel}>{period.label}</Text>
            <Text style={styles.periodSessionCount}>{t('coachProgress.sessions', { n: period.sessionCount })}</Text>
          </View>
          <View style={[styles.trendBadge, { backgroundColor: trendColor + '22', borderColor: trendColor }]}>
            <TrendIcon size={14} color={trendColor} />
            <Text style={[styles.trendValue, { color: trendColor }]}>
              {period.trendValue > 0 ? '+' : ''}{period.trendValue}
            </Text>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>{period.avgScore}%</Text>
          <Text style={styles.scoreLabel}>{t('coachProgress.avgScore')}</Text>
        </View>

        <ProgressBar progress={period.avgScore / 100} height={5} color={scoreColor} />
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 16 },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  periodCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  periodHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  periodIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  periodLabel: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  periodSessionCount: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textQuaternary, marginTop: 1 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1 },
  trendValue: { fontFamily: 'Inter-ExtraBold', fontSize: 13 },

  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
  scoreValue: { fontFamily: 'Inter-ExtraBold', fontSize: 28 },
  scoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },

  legendCard: { gap: Spacing.sm, marginTop: Spacing.lg },
  legendTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  legendText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19 },
});
