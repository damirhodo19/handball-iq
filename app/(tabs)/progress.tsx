import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BarChart3, Target, Shield, Eye, Activity, TrendingUp, Award } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { loadMetrics, loadSessions, loadMatchHistory, loadStreak, MetricHistory, SessionRecord } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translateSkill } from '@/lib/translations';
import { buildWeaknessRecommendations, formatWeaknessRecommendation } from '@/lib/development/weakness-i18n';
import { localizeContent } from '@/lib/content-localize';
import { useDevelopment } from '@/hooks/useDevelopment';
import { resolveContent } from '@/lib/platform/content-resolver';
import { getPositionModule } from '@/lib/platform/position-modules';
import { getProgramDef } from '@/lib/development/programs';
import { AchievementDetail } from '@/components/AchievementDetail';
import { useSyncedProfile } from '@/hooks/useSyncedProfile';
import { useActivePlayerPosition } from '@/hooks/useActivePlayerPosition';
import { ActivePositionSelector } from '@/components/ActivePositionSelector';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - Spacing.lg * 2 - 40;
const CHART_HEIGHT = 160;

export default function ProgressScreen() {
  const { t, lang } = useTranslation();
  const [metrics, setMetrics] = useState<MetricHistory[]>([]);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setMetrics(loadMetrics());
    setSessions(loadSessions());
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const profile = useSyncedProfile();
  const { position, positions, selectPosition } = useActivePlayerPosition(profile);
  const scopedSessions = useMemo(
    () => position
      ? sessions.filter((session) => session.position === position || (!session.position && profile.position === position))
      : sessions,
    [sessions, position, profile.position],
  );
  const scopedMetrics = useMemo(
    () => position
      ? metrics.filter((metric) => metric.position === position || (!metric.position && profile.position === position))
      : metrics,
    [metrics, position, profile.position],
  );
  const recentMetrics = [...scopedMetrics].reverse().slice(0, 10);
  const totalSessions = scopedSessions.length;
  const avgScore = totalSessions > 0 ? Math.round(scopedSessions.reduce((s, ss) => s + ss.decisionScore, 0) / totalSessions) : 0;
  const bestScore = totalSessions > 0 ? Math.max(...scopedSessions.map((s) => s.decisionScore)) : 0;
  const {
    state: devState,
    positionStatistics,
    weaknesses,
    coachReport,
    achievements,
    activeProgram,
    weeklyGoalSummary,
    streak: devStreak,
    refresh: refreshDevelopment,
  } = useDevelopment();
  const completedPrograms = devState.completedPrograms ?? [];
  const [selectedAch, setSelectedAch] = useState<string | null>(null);
  const weaknessRecs = buildWeaknessRecommendations(weaknesses);
  const localizedWeaknessRecs = weaknessRecs.length > 0
    ? weaknessRecs.map((item) => formatWeaknessRecommendation(item, t, lang))
    : [t('dev.rec.maintainConsistency')];
  const stats = positionStatistics;
  const totalTime = scopedSessions.reduce((s, ss) => s + ss.timeSpent, 0);
  const topCategories = Object.entries(stats.byCategory)
    .filter(([, s]) => s.total >= 3)
    .sort((a, b) => b[1].accuracy - a[1].accuracy)
    .slice(0, 5);
  const effectiveProfile = useMemo(
    () => ({ ...profile, position: position ?? profile.position }),
    [profile, position],
  );
  const resolved = useMemo(() => resolveContent({ profile: effectiveProfile }), [effectiveProfile, scopedSessions]);
  const mod = position ? getPositionModule(position) : null;
  const skillRows = mod
    ? mod.positionSkills.map((id) => ({
        id,
        accuracy: stats.bySkill?.[id]?.accuracy ?? null,
        total: stats.bySkill?.[id]?.total ?? 0,
        iqScore: resolved.iq.positionSkills.find((s) => s.id === id)?.score ?? null,
      }))
    : [];
  const progressCtx = {
    sessionCount: scopedSessions.length,
    decisionCount: stats.totalDecisions,
    streak: devStreak?.currentStreak ?? loadStreak().currentStreak,
    matchCount: loadMatchHistory().filter((match) =>
      !position || match.position === position || (!match.position && profile.position === position),
    ).length,
    programWeeks: activeProgram?.weeksCompleted.length ?? 0,
    programsCompleted: completedPrograms.filter((p) => p.completed).length,
  };

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}><BarChart3 size={20} color={Colors.gold} /></View>
          <View>
            <Text style={styles.headerTitle}>{t('progress.title')}</Text>
            <Text style={styles.headerSub}>{t('progress.subtitle')}</Text>
          </View>
        </View>

        <ActivePositionSelector
          positions={positions}
          activePosition={position}
          onSelect={(nextPosition) => {
            selectPosition(nextPosition);
            refreshDevelopment();
          }}
        />

        {/* Handball IQ trend */}
        <SectionLabel label={t('home.overallIq')} />
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <View style={styles.statsRow}>
            <StatCard value={resolved.iq.overall == null ? '—' : `${resolved.iq.overall}`} label={t('home.overallIq')} />
            <StatCard value={resolved.iq.positionIq.score == null ? '—' : `${resolved.iq.positionIq.score}`} label={t('home.positionIq')} />
            <StatCard value={stats.improvementTrend >= 0 ? `+${stats.improvementTrend}` : `${stats.improvementTrend}`} label={t('sprint5.recentImprovement')} />
          </View>
        </Animated.View>

        {/* Skill matrix */}
        {skillRows.length > 0 && (
          <>
            <SectionLabel label={t('sprint5.skillMatrix')} />
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <Card variant="gradient" shadow="card" style={styles.catCard}>
                {skillRows.map((row) => (
                  <View key={row.id} style={styles.catRow}>
                    <Text style={styles.catName} numberOfLines={1}>{t(`iq.skill.${row.id}`)}</Text>
                    <Text style={styles.catAcc}>
                      {row.iqScore != null ? row.iqScore : row.accuracy != null ? `${row.accuracy}%` : '—'}
                    </Text>
                    <ProgressBar
                      progress={(row.iqScore ?? row.accuracy ?? 0) / 100}
                      height={4}
                      color={Colors.gold}
                    />
                  </View>
                ))}
              </Card>
            </Animated.View>
          </>
        )}

        {/* Current program + history */}
        <SectionLabel label={t('sprint5.programs.current')} />
        <Animated.View entering={FadeInDown.delay(110).duration(500)}>
          <Card variant="gradient" shadow="card" style={styles.recCard}>
            {activeProgram && !activeProgram.completed ? (
              <TouchableOpacity onPress={() => router.push('/programs')}>
                <Text style={styles.recText}>
                  {t(getProgramDef(activeProgram.programId)?.titleKey ?? activeProgram.programId)} · {activeProgram.completionPercent}%
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => router.push('/programs')}>
                <Text style={styles.recText}>{t('sprint5.programs.recommended')}</Text>
              </TouchableOpacity>
            )}
            <Text style={[styles.recText, { marginTop: 8 }]}>{t('sprint5.programHistory')}</Text>
            {completedPrograms.slice(0, 3).map((p) => (
              <Text key={`${p.programId}_${p.startedAt}`} style={styles.recText}>
                • {t(getProgramDef(p.programId)?.titleKey ?? p.programId)}
              </Text>
            ))}
          </Card>
        </Animated.View>

        <SectionLabel label={t('sprint4.weeklyGoals')} />
        <Animated.View entering={FadeInDown.delay(115).duration(500)}>
          <View style={styles.statsRow}>
            <StatCard value={`${devStreak?.currentStreak ?? 0}`} label={t('profile.currentStreak')} />
            <StatCard
              value={`${weeklyGoalSummary.completed}/${weeklyGoalSummary.completed + weeklyGoalSummary.remaining}`}
              label={t('sprint4.weeklyGoals')}
            />
            <StatCard value={`${totalSessions}`} label={t('progress.sessionsCompleted')} />
          </View>
        </Animated.View>

        {/* Achievements */}
        <SectionLabel label={t('sprint5.achievements')} />
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {achievements.slice(0, 8).map((a) => (
              <TouchableOpacity
                key={a.id}
                onPress={() => setSelectedAch(a.id)}
                style={{
                  width: '47%',
                  padding: 10,
                  borderRadius: Radius.md,
                  backgroundColor: Colors.surface,
                  opacity: a.unlocked ? 1 : 0.55,
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <Award size={16} color={a.unlocked ? Colors.gold : Colors.textTertiary} />
                <Text style={{ ...Typography.caption, color: Colors.textPrimary, flex: 1 }} numberOfLines={2}>
                  {t(`dev.achievement.${a.id}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Summary Stats */}
        <Animated.View entering={FadeInDown.delay(130).duration(500)}>
          <View style={styles.statsRow}>
            <StatCard value={`${totalSessions}`} label={t('progress.sessionsCompleted')} />
            <StatCard value={`${avgScore}%`} label={t('progress.avgScore')} />
            <StatCard value={`${bestScore}%`} label={t('progress.bestScore')} />
          </View>
        </Animated.View>

        {/* Development Statistics */}
        <SectionLabel label={t('dev.statistics')} />
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <View style={styles.statsRow}>
            <StatCard value={`${stats.decisionAccuracy}%`} label={t('dev.decisionAccuracy')} />
            <StatCard value={stats.avgReactionMs > 0 ? `${(stats.avgReactionMs / 1000).toFixed(1)}s` : '—'} label={t('dev.reactionTime')} />
            <StatCard value={stats.improvementTrend >= 0 ? `+${stats.improvementTrend}%` : `${stats.improvementTrend}%`} label={t('dev.improvementTrend')} />
          </View>
        </Animated.View>

        {(stats.bestDay || stats.worstDay) && (
          <Animated.View entering={FadeInDown.delay(140).duration(500)}>
            <Card variant="gradient" shadow="card" style={styles.dayCard}>
              {stats.bestDay && (
                <View style={styles.dayRow}>
                  <Text style={styles.dayLabel}>{t('dev.bestDay')}</Text>
                  <Text style={styles.dayValue}>{stats.bestDay.date.slice(5)} · {stats.bestDay.accuracy}%</Text>
                </View>
              )}
              {stats.worstDay && (
                <View style={styles.dayRow}>
                  <Text style={styles.dayLabel}>{t('dev.worstDay')}</Text>
                  <Text style={styles.dayValue}>{stats.worstDay.date.slice(5)} · {stats.worstDay.accuracy}%</Text>
                </View>
              )}
            </Card>
          </Animated.View>
        )}

        {topCategories.length > 0 && (
          <>
            <SectionLabel label={t('dev.categoryPerformance')} />
            <Animated.View entering={FadeInDown.delay(160).duration(500)}>
              <Card variant="gradient" shadow="card" style={styles.catCard}>
                {topCategories.map(([name, s]) => (
                  <View key={name} style={styles.catRow}>
                    <Text style={styles.catName} numberOfLines={1}>{translateSkill(name, t)}</Text>
                    <Text style={styles.catAcc}>{s.accuracy}%</Text>
                    <ProgressBar progress={s.accuracy / 100} height={4} color={Colors.gold} />
                  </View>
                ))}
              </Card>
            </Animated.View>
          </>
        )}

        {localizedWeaknessRecs.length > 0 && (
          <>
            <SectionLabel label={t('dev.recommendations')} />
            <Animated.View entering={FadeInDown.delay(180).duration(500)}>
              <Card variant="gradient" shadow="card" style={styles.recCard}>
                {localizedWeaknessRecs.slice(0, 4).map((rec, i) => (
                  <Text key={i} style={styles.recText}>• {rec}</Text>
                ))}
              </Card>
            </Animated.View>
          </>
        )}

        {coachReport.trainNext.length > 0 && (
          <>
            <SectionLabel label={t('dev.trainNext')} />
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <Card variant="gradient" shadow="card" style={styles.recCard}>
                {coachReport.trainNext.slice(0, 3).map((item, i) => (
                  <Text key={i} style={styles.recText}>• {localizeContent(item, lang, t)}</Text>
                ))}
              </Card>
            </Animated.View>
          </>
        )}

        {totalSessions === 0 && (
          <Card variant="gradient" shadow="card" style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Activity size={28} color={Colors.gold} /></View>
            <Text style={styles.emptyTitle}>{t('progress.emptyTitle')}</Text>
            <Text style={styles.emptySub}>{t('progress.emptySub')}</Text>
          </Card>
        )}

        {/* Decision Score Chart */}
        {totalSessions > 0 && (
          <>
            <ChartSection title={t('progress.decisionScoreChart')} subtitle={t('progress.lastSessions')} icon={<Target size={16} color={Colors.gold} />}>
              <LineChart data={recentMetrics.map((m) => m.decisionScore)} labels={recentMetrics.map((m) => m.date.slice(5))} emptyText={t('progress.noDataYet')} />
            </ChartSection>

            {/* Pressure Control Chart */}
            <ChartSection title={t('progress.pressureControl')} subtitle={t('progress.pressureSub')} icon={<Shield size={16} color={Colors.gold} />}>
              <BarChart data={recentMetrics.map((m) => m.pressureControl)} labels={recentMetrics.map((m) => m.date.slice(5))} maxValue={100} color={Colors.info} emptyText={t('progress.noDataYet')} />
            </ChartSection>

            {/* Shooter Reading Chart */}
            <ChartSection title={t('progress.shooterReading')} subtitle={t('progress.readingSub')} icon={<Eye size={16} color={Colors.gold} />}>
              <LineChart data={recentMetrics.map((m) => m.shooterReading)} labels={recentMetrics.map((m) => m.date.slice(5))} color={Colors.success} emptyText={t('progress.noDataYet')} />
            </ChartSection>

            {/* Consistency Chart */}
            <ChartSection title={t('progress.consistency')} subtitle={t('progress.consistencySub')} icon={<Activity size={16} color={Colors.gold} />}>
              <BarChart data={recentMetrics.map((m) => m.consistency)} labels={recentMetrics.map((m) => m.date.slice(5))} maxValue={100} color={Colors.gold} emptyText={t('progress.noDataYet')} />
            </ChartSection>

            {/* Total Time */}
            <SectionLabel label={t('progress.totalTrainingTime')} />
            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
              <Card variant="gradient" shadow="card" style={styles.timeCard}>
                <View style={styles.timeRow}>
                  <View style={styles.timeIcon}><TrendingUp size={18} color={Colors.gold} /></View>
                  <Text style={styles.timeLabel}>{t('progress.timeInvested')}</Text>
                  <Text style={styles.timeValue}>{Math.round(totalTime / 60)}m</Text>
                </View>
              </Card>
            </Animated.View>
          </>
        )}
      </ScrollView>
      <AchievementDetail
        achievementId={selectedAch}
        unlocked={
          selectedAch && achievements.find((a) => a.id === selectedAch)?.unlocked
            ? {
                id: selectedAch,
                unlockedAt:
                  achievements.find((a) => a.id === selectedAch)?.unlockedAt ||
                  new Date().toISOString(),
              }
            : null
        }
        progressCtx={progressCtx}
        onClose={() => setSelectedAch(null)}
      />
    </ScreenBackground>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function ChartSection({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.delay(200).duration(500)}>
      <View style={styles.chartHeader}>
        <View style={styles.chartHeaderLeft}>
          <View style={styles.chartHeaderIcon}>{icon}</View>
          <View>
            <Text style={styles.chartTitle}>{title}</Text>
            <Text style={styles.chartSub}>{subtitle}</Text>
          </View>
        </View>
      </View>
      <Card variant="gradient" shadow="card" style={styles.chartCard}>
        {children}
      </Card>
    </Animated.View>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card variant="gradient" shadow="float" style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function LineChart({ data, labels, color = Colors.gold, emptyText }: { data: number[]; labels: string[]; color?: string; emptyText: string }) {
  if (data.length === 0) return <Text style={styles.emptyText}>{emptyText}</Text>;
  const stepX = data.length > 1 ? CHART_WIDTH / (data.length - 1) : CHART_WIDTH;
  const points = data.map((v, i) => ({ x: i * stepX, y: CHART_HEIGHT - 20 - (v / 100) * (CHART_HEIGHT - 40) }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1]?.x ?? 0} ${CHART_HEIGHT - 20} L ${points[0]?.x ?? 0} ${CHART_HEIGHT - 20} Z`;

  const Svg = require('react-native-svg').default;
  const Path = require('react-native-svg').Path;
  const Circle = require('react-native-svg').Circle;
  const Defs = require('react-native-svg').Defs;
  const SvgLinearGradient = require('react-native-svg').LinearGradient;
  const Stop = require('react-native-svg').Stop;

  const gradId = `areaGrad_${color.replace('#', '')}`;

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartInner}>
        <Animated.View entering={FadeIn.duration(800)} style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <SvgLinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity="0.25" />
                <Stop offset="1" stopColor={color} stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Path d={areaPath} fill={`url(#${gradId})`} />
            <Path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke={Colors.background} strokeWidth={2} />
            ))}
          </Svg>
        </Animated.View>
      </View>
      <View style={styles.labelsRow}>
        {labels.map((l, i) => <Text key={i} style={styles.barLabel}>{l}</Text>)}
      </View>
    </View>
  );
}

function BarChart({ data, labels, maxValue, color, emptyText }: { data: number[]; labels: string[]; maxValue: number; color: string; emptyText: string }) {
  if (data.length === 0) return <Text style={styles.emptyText}>{emptyText}</Text>;
  const barWidth = (CHART_WIDTH - (data.length - 1) * 8) / data.length;
  return (
    <View style={styles.chartWrap}>
      <View style={styles.barsRow}>
        {data.map((v, i) => {
          const h = maxValue > 0 ? (v / maxValue) * (CHART_HEIGHT - 30) : 0;
          return (
            <View key={i} style={styles.barCol}>
              <View style={[styles.bar, { height: Math.max(h, 4), width: barWidth, backgroundColor: color }]} />
              <Text style={styles.barLabel}>{labels[i]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 1 },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: { flex: 1, padding: Spacing.md, gap: 4 },
  statValue: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  statLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.5 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm, marginTop: Spacing.md },
  chartHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  chartHeaderIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  chartTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  chartSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 1 },

  chartCard: { marginBottom: Spacing.sm, gap: Spacing.md },
  chartWrap: { alignItems: 'center' },
  chartInner: { width: CHART_WIDTH, height: CHART_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', height: CHART_HEIGHT, gap: 8 },
  barCol: { alignItems: 'center', gap: 6 },
  bar: { borderRadius: 5 },
  barLabel: { fontSize: 9, color: Colors.textTertiary, fontFamily: 'Inter-Medium' },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between', width: CHART_WIDTH, marginTop: 4 },

  emptyCard: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  emptyIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  emptySub: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', paddingVertical: Spacing.md },

  timeCard: { marginBottom: Spacing.sm },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  timeIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  timeLabel: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 15 },
  timeValue: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.gold },

  dayCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  dayValue: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.gold },

  catCard: { gap: Spacing.md, marginBottom: Spacing.sm },
  catRow: { gap: 4 },
  catName: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textPrimary },
  catAcc: { fontFamily: 'Inter-ExtraBold', fontSize: 12, color: Colors.gold, alignSelf: 'flex-end' },

  recCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  recText: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
});
