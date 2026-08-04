import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, RefreshControl } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BarChart3, Target, Shield, Eye, Activity, TrendingUp } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { loadMetrics, loadSessions, MetricHistory, SessionRecord } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - Spacing.lg * 2 - 40;
const CHART_HEIGHT = 160;

export default function ProgressScreen() {
  const { t } = useTranslation();
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

  const recentMetrics = [...metrics].reverse().slice(0, 10);
  const totalSessions = sessions.length;
  const avgScore = totalSessions > 0 ? Math.round(sessions.reduce((s, ss) => s + ss.decisionScore, 0) / totalSessions) : 0;
  const bestScore = totalSessions > 0 ? Math.max(...sessions.map((s) => s.decisionScore)) : 0;
  const totalTime = sessions.reduce((s, ss) => s + ss.timeSpent, 0);

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

        {/* Summary Stats */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.statsRow}>
            <StatCard value={`${totalSessions}`} label={t('progress.sessionsCompleted')} />
            <StatCard value={`${avgScore}%`} label={t('progress.avgScore')} />
            <StatCard value={`${bestScore}%`} label="Best Score" />
          </View>
        </Animated.View>

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
            <ChartSection title="Decision Score" subtitle="Last sessions" icon={<Target size={16} color={Colors.gold} />}>
              <LineChart data={recentMetrics.map((m) => m.decisionScore)} labels={recentMetrics.map((m) => m.date.slice(5))} />
            </ChartSection>

            {/* Pressure Control Chart */}
            <ChartSection title="Pressure Control" subtitle="Performance under pressure" icon={<Shield size={16} color={Colors.gold} />}>
              <BarChart data={recentMetrics.map((m) => m.pressureControl)} labels={recentMetrics.map((m) => m.date.slice(5))} maxValue={100} color={Colors.info} />
            </ChartSection>

            {/* Shooter Reading Chart */}
            <ChartSection title="Shooter Reading" subtitle="Reading the shooter accuracy" icon={<Eye size={16} color={Colors.gold} />}>
              <LineChart data={recentMetrics.map((m) => m.shooterReading)} labels={recentMetrics.map((m) => m.date.slice(5))} color={Colors.success} />
            </ChartSection>

            {/* Consistency Chart */}
            <ChartSection title="Consistency" subtitle="Overall decision consistency" icon={<Activity size={16} color={Colors.gold} />}>
              <BarChart data={recentMetrics.map((m) => m.consistency)} labels={recentMetrics.map((m) => m.date.slice(5))} maxValue={100} color={Colors.gold} />
            </ChartSection>

            {/* Total Time */}
            <SectionLabel label="TOTAL TRAINING TIME" />
            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
              <Card variant="gradient" shadow="card" style={styles.timeCard}>
                <View style={styles.timeRow}>
                  <View style={styles.timeIcon}><TrendingUp size={18} color={Colors.gold} /></View>
                  <Text style={styles.timeLabel}>Time invested</Text>
                  <Text style={styles.timeValue}>{Math.round(totalTime / 60)}m</Text>
                </View>
              </Card>
            </Animated.View>
          </>
        )}
      </ScrollView>
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

function LineChart({ data, labels, color = Colors.gold }: { data: number[]; labels: string[]; color?: string }) {
  if (data.length === 0) return <Text style={styles.emptyText}>No data yet.</Text>;
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

function BarChart({ data, labels, maxValue, color }: { data: number[]; labels: string[]; maxValue: number; color: string }) {
  if (data.length === 0) return <Text style={styles.emptyText}>No data yet.</Text>;
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
});
