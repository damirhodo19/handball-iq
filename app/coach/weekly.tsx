import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, AlertCircle, CheckCircle2, Target, Lightbulb } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { buildPlayerProfile, generateWeeklyReport, WeeklyReport } from '@/lib/coach-engine';
import { useTranslation } from '@/hooks/useTranslation';

export default function WeeklyScreen() {
  const { t } = useTranslation();
  const [report, setReport] = useState<WeeklyReport | null>(null);

  useFocusEffect(useCallback(() => {
    const profile = buildPlayerProfile();
    setReport(generateWeeklyReport(profile));
  }, []));

  if (!report) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('coachWeekly.generating')}</Text></View>
      </ScreenBackground>
    );
  }

  const TrendIcon = report.overallTrend === 'up' ? TrendingUp : report.overallTrend === 'down' ? TrendingDown : Minus;
  const trendColor = report.overallTrend === 'up' ? Colors.success : report.overallTrend === 'down' ? Colors.error : Colors.textTertiary;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('coachWeekly.title')}</Text>
            <Text style={styles.headerSub}>{t('coachWeekly.subtitle')}</Text>
          </View>
        </View>

        {/* Overall Trend */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.trendCard}>
            <View style={styles.trendRow}>
              <View style={[styles.trendIcon, { backgroundColor: trendColor + '22', borderColor: trendColor }]}>
                <TrendIcon size={24} color={trendColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.trendLabel}>{t('coachWeekly.overallTrend')}</Text>
                <Text style={styles.trendValue}>
                  {report.overallTrend === 'up' ? t('coachWeekly.improving') : report.overallTrend === 'down' ? t('coachWeekly.declining') : t('coachWeekly.stable')}
                  {report.overallTrendValue !== 0 ? ` (${report.overallTrendValue > 0 ? '+' : ''}${report.overallTrendValue} pts)` : ''}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Biggest Improvement */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ReportSection
            icon={<CheckCircle2 size={18} color={Colors.success} />}
            iconBg={Colors.successSoft}
            iconBorder={Colors.success}
            title={t('coachWeekly.biggestImprovement')}
            text={report.biggestImprovement}
          />
        </Animated.View>

        {/* Biggest Weakness */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <ReportSection
            icon={<AlertCircle size={18} color={Colors.warning} />}
            iconBg={Colors.warningSoft}
            iconBorder={Colors.warning}
            title={t('coachWeekly.biggestWeakness')}
            text={report.biggestWeakness}
          />
        </Animated.View>

        {/* Most Improved Skill */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={styles.skillRow}>
            <SkillBadge label={t('coachWeekly.mostImprovedSkill')} value={report.mostImprovedSkill} color={Colors.success} />
            <View style={{ width: Spacing.sm }} />
            <SkillBadge label={t('coachWeekly.skillAttention')} value={report.skillNeedingAttention} color={Colors.warning} />
          </View>
        </Animated.View>

        {/* Recommendation */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)}>
          <Card variant="gradient" shadow="cardLg" style={styles.recommendCard}>
            <View style={styles.recommendHeader}>
              <View style={styles.recommendIcon}><Lightbulb size={18} color={Colors.gold} /></View>
              <Text style={styles.recommendTitle}>{t('coachWeekly.recommendation')}</Text>
            </View>
            <Text style={styles.recommendText}>{report.recommendation}</Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function ReportSection({ icon, iconBg, iconBorder, title, text }: { icon: React.ReactNode; iconBg: string; iconBorder: string; title: string; text: string }) {
  return (
    <Card variant="gradient" shadow="card" style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: iconBg, borderColor: iconBorder }]}>{icon}</View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionText}>{text}</Text>
    </Card>
  );
}

function SkillBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.skillBadge, { borderColor: color + '55' }]}>
      <Text style={styles.skillBadgeLabel}>{label}</Text>
      <Text style={[styles.skillBadgeValue, { color }]}>{value}</Text>
    </View>
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

  trendCard: { gap: Spacing.md, marginBottom: Spacing.md },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  trendIcon: { width: 52, height: 52, borderRadius: 16, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  trendLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  trendValue: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary, marginTop: 2 },

  sectionCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  sectionText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },

  skillRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  skillBadge: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.xs, borderWidth: 1, alignItems: 'center' },
  skillBadgeLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 0.5, textAlign: 'center' },
  skillBadgeValue: { fontFamily: 'Inter-ExtraBold', fontSize: 14, textAlign: 'center' },

  recommendCard: { gap: Spacing.sm, marginTop: Spacing.sm, borderColor: Colors.gold, borderWidth: 1.5 },
  recommendHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  recommendIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  recommendTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.gold },
  recommendText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },
});
