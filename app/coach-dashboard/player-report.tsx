import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, ClipboardList, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { loadPlayerById, generateRecommendations, PlayerProfile, TrainingRecommendation } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translateSessionType, translatePosition } from '@/lib/translations';

export default function PlayerReportScreen() {
  const { t } = useTranslation();
  const { playerId } = useLocalSearchParams<{ playerId: string }>();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [recs, setRecs] = useState<TrainingRecommendation[]>([]);

  useFocusEffect(useCallback(() => {
    const p = loadPlayerById(playerId);
    setPlayer(p);
    if (p) setRecs(generateRecommendations(p));
  }, [playerId]));

  if (!player) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('cdReport.loading')}</Text></View>
      </ScreenBackground>
    );
  }

  const skills = [
    { label: t('cdReport.skillDecision'), value: player.decisionScore },
    { label: t('cdReport.skillPressure'), value: player.pressurePerformance },
    { label: t('cdReport.skillConsistency'), value: player.consistency },
    { label: t('cdReport.skillReading'), value: player.readingAbility },
    { label: t('cdReport.skillFastBreak'), value: player.fastBreak },
    { label: t('cdReport.skillWing'), value: player.wingSituations },
    { label: t('cdReport.skillPivot'), value: player.pivotSituations },
    { label: t('cdReport.skill7m'), value: player.sevenMetre },
    { label: t('cdReport.skillMental'), value: player.mentalPreparation },
  ];

  const weeklyColor = player.weeklyTrend > 0 ? Colors.success : player.weeklyTrend < 0 ? Colors.error : Colors.textTertiary;
  const monthlyColor = player.monthlyTrend > 0 ? Colors.success : player.monthlyTrend < 0 ? Colors.error : Colors.textTertiary;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{player.name}</Text>
            <Text style={styles.headerSub}>{translatePosition(player.position, t)} · {player.age} yrs · {player.club}</Text>
          </View>
        </View>

        {/* Overall */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.overallCard}>
            <View style={styles.overallRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.overallLabel}>{t('cdReport.overallDecision')}</Text>
                <Text style={styles.overallValue}>{player.decisionScore}<Text style={styles.overallPct}>%</Text></Text>
                <Text style={styles.overallSub}>{t('cdReport.sessionsCompleted', { n: player.sessionsCompleted })}</Text>
              </View>
              <View style={styles.overallBadge}>
                <Text style={styles.overallBadgeText}>
                  {player.decisionScore >= 80 ? t('coach.excellent') : player.decisionScore >= 65 ? t('coach.strong') : player.decisionScore >= 50 ? t('coach.developing') : t('coach.early')}
                </Text>
              </View>
            </View>
            <ProgressBar progress={player.decisionScore / 100} height={6} color={Colors.gold} />
          </Card>
        </Animated.View>

        {/* Improvement Summary */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <View style={styles.improvementRow}>
            <Card variant="gradient" shadow="card" style={styles.improvementCard}>
              <Text style={styles.improvementLabel}>{t('cdReport.weeklyImprovement')}</Text>
              <Text style={[styles.improvementValue, { color: weeklyColor }]}>
                {player.weeklyTrend > 0 ? '+' : ''}{player.weeklyTrend}
              </Text>
              <View style={styles.improvementIcon}>
                {player.weeklyTrend > 0 ? <TrendingUp size={14} color={Colors.success} /> : player.weeklyTrend < 0 ? <TrendingDown size={14} color={Colors.error} /> : <Text style={styles.flatDash}>—</Text>}
              </View>
            </Card>
            <View style={{ width: Spacing.sm }} />
            <Card variant="gradient" shadow="card" style={styles.improvementCard}>
              <Text style={styles.improvementLabel}>{t('cdReport.monthlyImprovement')}</Text>
              <Text style={[styles.improvementValue, { color: monthlyColor }]}>
                {player.monthlyTrend > 0 ? '+' : ''}{player.monthlyTrend}
              </Text>
              <View style={styles.improvementIcon}>
                {player.monthlyTrend > 0 ? <TrendingUp size={14} color={Colors.success} /> : player.monthlyTrend < 0 ? <TrendingDown size={14} color={Colors.error} /> : <Text style={styles.flatDash}>—</Text>}
              </View>
            </Card>
          </View>
        </Animated.View>

        {/* Skill Scores */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.sectionLabel}>{t('cdReport.skillBreakdown')}</Text>
          <Card variant="gradient" shadow="card" style={styles.skillsCard}>
            {skills.map((skill, i) => {
              const color = skill.value >= 75 ? Colors.success : skill.value >= 55 ? Colors.gold : skill.value >= 40 ? Colors.warning : Colors.error;
              return (
                <View key={i} style={[styles.skillRow, i < skills.length - 1 && styles.skillRowBorder]}>
                  <Text style={styles.skillLabel}>{skill.label}</Text>
                  <View style={styles.skillBarWrap}>
                    <ProgressBar progress={skill.value / 100} height={5} color={color} />
                  </View>
                  <Text style={[styles.skillValue, { color }]}>{skill.value}</Text>
                </View>
              );
            })}
          </Card>
        </Animated.View>

        {/* Progress Chart */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text style={styles.sectionLabel}>{t('cdReport.progressChart')}</Text>
          <Card variant="gradient" shadow="card" style={styles.chartCard}>
            <MiniBarChart data={player.weeklyHistory.map((h) => h.score)} labels={player.weeklyHistory.map((h) => {
              const d = new Date(h.week);
              return `${d.getMonth() + 1}/${d.getDate()}`;
            })} />
          </Card>
        </Animated.View>

        {/* Training Recommendations */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('cdReport.trainingRecs')}</Text>
          {recs.map((rec, i) => (
            <Card key={i} variant="gradient" shadow="card" style={styles.recCard}>
              <View style={styles.recHeader}>
                <View style={[styles.severityBadge, { backgroundColor: rec.severity === 'high' ? Colors.errorSoft : rec.severity === 'medium' ? Colors.warningSoft : Colors.successSoft, borderColor: rec.severity === 'high' ? Colors.error : rec.severity === 'medium' ? Colors.warning : Colors.success }]}>
                  <AlertCircle size={12} color={rec.severity === 'high' ? Colors.error : rec.severity === 'medium' ? Colors.warning : Colors.success} />
                  <Text style={[styles.severityText, { color: rec.severity === 'high' ? Colors.error : rec.severity === 'medium' ? Colors.warning : Colors.success }]}>{rec.severity.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.recIssue}>{rec.issue}</Text>
              <View style={styles.recActionRow}>
                <Text style={styles.recActionLabel}>{t('cdReport.recommendation')}</Text>
                <Text style={styles.recAction}>{rec.recommendation}</Text>
              </View>
              <PressableCard
                onPress={() => router.push({ pathname: '/coach-dashboard/assign', params: { playerId: player.id, sessionType: rec.sessionType } })}
                variant="gradient"
                shadow="card"
                style={styles.assignBtn}
              >
                <View style={styles.assignBtnRow}>
                  <ClipboardList size={16} color={Colors.gold} />
                  <Text style={styles.assignBtnText}>{t('cdReport.assignSession', { sessionType: translateSessionType(rec.sessionType, t) })}</Text>
                  <ChevronRight size={16} color={Colors.gold} style={{ marginLeft: 'auto' }} />
                </View>
              </PressableCard>
            </Card>
          ))}
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

// ── Mini Bar Chart ────────────────────────────────────────────────────────────

function MiniBarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const maxVal = Math.max(...data, 1);
  const chartHeight = 120;

  return (
    <View>
      <View style={[styles.chartArea, { height: chartHeight }]}>
        {data.map((val, i) => {
          const h = (val / maxVal) * (chartHeight - 20);
          const color = val >= 75 ? Colors.success : val >= 55 ? Colors.gold : val >= 40 ? Colors.warning : Colors.error;
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barTrack}>
                <Animated.View
                  entering={FadeIn.delay(i * 50).duration(600)}
                  style={[styles.bar, { height: h, backgroundColor: color }]}
                />
              </View>
              <Text style={styles.barLabel}>{val}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.chartLabels}>
        {labels.map((l, i) => (
          <Text key={i} style={styles.chartLabelText}>{l}</Text>
        ))}
      </View>
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

  overallCard: { gap: Spacing.md, marginBottom: Spacing.sm },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  overallLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  overallValue: { fontFamily: 'Inter-ExtraBold', fontSize: 34, color: Colors.textPrimary, lineHeight: 40 },
  overallPct: { fontSize: 18, color: Colors.gold },
  overallSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textQuaternary, marginTop: 2 },
  overallBadge: { backgroundColor: Colors.goldSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold },
  overallBadgeText: { fontFamily: 'Inter-ExtraBold', fontSize: 11, color: Colors.gold, letterSpacing: 1 },

  improvementRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  improvementCard: { flex: 1, gap: 4 },
  improvementLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 0.5 },
  improvementValue: { fontFamily: 'Inter-ExtraBold', fontSize: 24 },
  improvementIcon: { position: 'absolute', bottom: 14, right: 14 },
  flatDash: { color: Colors.textTertiary, fontFamily: 'Inter-ExtraBold', fontSize: 14 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  skillsCard: { gap: 0 },
  skillRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 10 },
  skillRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  skillLabel: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textPrimary, width: 120 },
  skillBarWrap: { flex: 1 },
  skillValue: { fontFamily: 'Inter-ExtraBold', fontSize: 16, minWidth: 32, textAlign: 'right' },

  chartCard: { gap: Spacing.sm },
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '70%', borderRadius: 4 },
  barLabel: { fontFamily: 'Inter-ExtraBold', fontSize: 10, color: Colors.textTertiary },
  chartLabels: { flexDirection: 'row', gap: 6, marginTop: 4 },
  chartLabelText: { flex: 1, textAlign: 'center', fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.textQuaternary },

  recCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  recHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  severityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm, borderWidth: 1 },
  severityText: { fontFamily: 'Inter-ExtraBold', fontSize: 10, letterSpacing: 1 },
  recIssue: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },
  recActionRow: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, padding: Spacing.md, gap: 4 },
  recActionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold, letterSpacing: 1 },
  recAction: { color: Colors.textPrimary, fontFamily: 'Inter-SemiBold', fontSize: 14, lineHeight: 20 },
  assignBtn: { marginTop: Spacing.xs },
  assignBtnRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  assignBtnText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.gold },
});
