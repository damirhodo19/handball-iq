import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  BarChart3, Layers, TrendingUp, AlertTriangle,
  FileText, CheckCircle2, Clock, Archive, ChevronRight,
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { getContentStats } from '@/lib/admin-storage';
import { ALL_POSITIONS } from '@/lib/positions';
import { useTranslation } from '@/hooks/useTranslation';
import { translateDifficulty, translateStatus } from '@/lib/translations';

export default function AdminStatisticsScreen() {
  const { t } = useTranslation();
  const [stats] = useState(getContentStats());

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <BackButton />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.headerTitle}>{t('adminStats.title')}</Text>
            <Text style={styles.headerSub}>{t('adminStats.subtitle')}</Text>
          </View>
        </Animated.View>

        {/* Summary Stats */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <View style={styles.summaryGrid}>
            <SummaryCard icon={<FileText size={20} color={Colors.gold} />} value={String(stats.total)} label={t('adminStats.totalScenarios')} />
            <SummaryCard icon={<CheckCircle2 size={20} color={Colors.success} />} value={String(stats.publishedVsDraft.published)} label={t('adminStats.published')} />
            <SummaryCard icon={<Clock size={20} color={Colors.warning} />} value={String(stats.drafts)} label={t('adminStats.drafts')} />
            <SummaryCard icon={<Archive size={20} color={Colors.textTertiary} />} value={String(stats.archived)} label={t('adminStats.archived')} />
          </View>
        </Animated.View>

        {/* Published vs Draft */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.sectionLabel}>{t('adminStats.byStatus')}</Text>
          <Card padding={Spacing.md}>
            <View style={styles.pieRow}>
              <PieSegment label={t('adminStats.published')} count={stats.publishedVsDraft.published} total={stats.total} color={Colors.success} />
              <PieSegment label={t('adminStats.drafts')} count={stats.publishedVsDraft.draft} total={stats.total} color={Colors.warning} />
              <PieSegment label={t('adminStats.archived')} count={stats.publishedVsDraft.archived} total={stats.total} color={Colors.textTertiary} />
            </View>
          </Card>
        </Animated.View>

        {/* Average Difficulty */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text style={styles.sectionLabel}>{t('adminStats.byDifficulty')}</Text>
          <Card padding={Spacing.md} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View style={styles.avgIcon}><TrendingUp size={24} color={Colors.gold} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.avgValue}>{stats.averageDifficulty}</Text>
              <Text style={styles.avgLabel}>{translateDifficulty(stats.averageDifficulty, t)}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Scenarios per Position */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('adminStats.byPosition')}</Text>
          <Card padding={Spacing.md}>
            {ALL_POSITIONS.map((pos) => {
              const count = stats.byPosition[pos] ?? 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <View key={pos} style={styles.barRow}>
                  <Text style={styles.barLabel}>{translateDifficulty(pos, t)}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.barCount}>{count}</Text>
                </View>
              );
            })}
          </Card>
        </Animated.View>

        {/* Scenarios per Category */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <Text style={styles.sectionLabel}>{t('adminStats.byCategory')}</Text>
          <Card padding={Spacing.md}>
            {Object.entries(stats.byCategory).map(([cat, count]) => (
              <View key={cat} style={styles.barRow}>
                <Text style={styles.barLabel}>{cat}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }]} />
                </View>
                <Text style={styles.barCount}>{count}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Missing Content Warnings */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionLabel}>{t('adminStats.topCategories')}</Text>
          {stats.warnings.length === 0 ? (
            <Card padding={Spacing.md} style={{ alignItems: 'center' }}>
              <CheckCircle2 size={24} color={Colors.success} />
              <Text style={styles.noWarnings}>{t('adminStats.empty')}</Text>
            </Card>
          ) : (
            <Card padding={Spacing.md}>
              {stats.warnings.map((w, i) => (
                <View key={i} style={styles.warningRow}>
                  <AlertTriangle size={16} color={Colors.warning} />
                  <Text style={styles.warningText}>{w}</Text>
                </View>
              ))}
            </Card>
          )}
        </Animated.View>

        {/* Navigate to Scenario List */}
        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={{ marginTop: Spacing.lg }}>
          <Button label={t('adminStats.title')} onPress={() => router.push('/admin/scenarios')} variant="outline" iconRight={<ChevronRight size={20} color={Colors.gold} />} />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function SummaryCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>{icon}</View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function PieSegment({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={[styles.pieDot, { backgroundColor: color }]} />
      <Text style={styles.pieValue}>{count}</Text>
      <Text style={styles.pieLabel}>{label}</Text>
      <Text style={styles.piePct}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  sectionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  summaryCard: { width: '48%', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'flex-start', gap: 6 },
  summaryIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  summaryValue: { ...Typography.statMd, fontFamily: 'Inter-ExtraBold', color: Colors.white },
  summaryLabel: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold' },
  pieRow: { flexDirection: 'row', gap: Spacing.sm },
  pieDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  pieValue: { fontSize: 24, color: Colors.white, fontFamily: 'Inter-ExtraBold' },
  pieLabel: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter-Medium', marginTop: 2 },
  piePct: { fontSize: 11, color: Colors.textTertiary, fontFamily: 'Inter-Regular' },
  avgIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  avgValue: { fontSize: 20, color: Colors.white, fontFamily: 'Inter-ExtraBold' },
  avgLabel: { fontSize: 13, color: Colors.textTertiary, fontFamily: 'Inter-Regular', marginTop: 2 },
  barRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: Spacing.sm },
  barLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter-Medium' },
  barTrack: { flex: 2, height: 8, borderRadius: 99, backgroundColor: Colors.border, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 99, backgroundColor: Colors.gold },
  barCount: { fontSize: 14, color: Colors.white, fontFamily: 'Inter-Bold', minWidth: 24, textAlign: 'right' },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 6 },
  warningText: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-Regular', flex: 1 },
  noWarnings: { fontSize: 14, color: Colors.success, fontFamily: 'Inter-SemiBold', marginTop: Spacing.sm },
});
