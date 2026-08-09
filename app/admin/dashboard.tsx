import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  FileText, CheckCircle2, Archive, PlusCircle, Download, Upload, BarChart3, Layers, TrendingUp, AlertTriangle, LogOut, ChevronRight, Clock
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { getContentStats, AdminScenario } from '@/lib/admin-storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition, translateDifficulty, translateCategory } from '@/lib/translations';
import { useSignOut } from '@/hooks/useSignOut';

export default function AdminDashboardScreen() {
  const { t } = useTranslation();
  const signOut = useSignOut();
  const [stats, setStats] = useState<ReturnType<typeof getContentStats> | null>(null);

  useFocusEffect(() => {
    setStats(getContentStats());
  });

  if (!stats) return null;

  const handleLogout = () => {
    signOut();
  };

  const handleExport = () => {
    // Export is handled on the scenarios screen
    router.push('/admin/scenarios');
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('admin.dashboardTitle')}</Text>
            <Text style={styles.headerSub}>{t('admin.dashboardSub')}</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color={Colors.error} />
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <Text style={styles.sectionLabel}>{t('admin.overview')}</Text>
          <View style={styles.statsGrid}>
            <StatCard icon={<FileText size={20} color={Colors.gold} />} value={String(stats.total)} label={t('admin.totalScenarios')} />
            <StatCard icon={<CheckCircle2 size={20} color={Colors.success} />} value={String(stats.publishedVsDraft.published)} label={t('admin.published')} />
            <StatCard icon={<Clock size={20} color={Colors.warning} />} value={String(stats.drafts)} label={t('admin.drafts')} />
            <StatCard icon={<Archive size={20} color={Colors.textTertiary} />} value={String(stats.archived)} label={t('admin.archived')} />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.sectionLabel}>{t('admin.quickActions')}</Text>
          <View style={styles.actionRow}>
            <QuickAction icon={<PlusCircle size={22} color={Colors.gold} />} label={t('admin.createNew')} onPress={() => router.push('/admin/editor')} />
            <QuickAction icon={<Upload size={22} color={Colors.gold} />} label={t('admin.import')} onPress={() => router.push('/admin/scenarios?tab=import')} />
            <QuickAction icon={<Download size={22} color={Colors.gold} />} label={t('admin.export')} onPress={handleExport} />
            <QuickAction icon={<BarChart3 size={22} color={Colors.gold} />} label={t('admin.statistics')} onPress={() => router.push('/admin/statistics')} />
          </View>
        </Animated.View>

        {/* By Position */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Text style={styles.sectionLabel}>{t('admin.byPosition')}</Text>
          <Card padding={Spacing.md}>
            {Object.entries(stats.byPosition).map(([pos, count]) => (
              <View key={pos} style={styles.distributionRow}>
                <Text style={styles.distLabel}>{translatePosition(pos, t)}</Text>
                <View style={styles.distBarWrap}>
                  <View style={[styles.distBar, { width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }]} />
                </View>
                <Text style={styles.distCount}>{count}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* By Difficulty */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('admin.byDifficulty')}</Text>
          <View style={styles.chipRow}>
            {Object.entries(stats.byDifficulty).map(([diff, count]) => (
              <View key={diff} style={styles.chip}>
                <Text style={styles.chipLabel}>{translateDifficulty(diff, t)}</Text>
                <Text style={styles.chipCount}>{count}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* By Category */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <Text style={styles.sectionLabel}>{t('admin.byCategory')}</Text>
          <Card padding={Spacing.md}>
            {Object.entries(stats.byCategory).map(([cat, count]) => (
              <View key={cat} style={styles.distributionRow}>
                <Text style={styles.distLabel}>{cat}</Text>
                <Text style={styles.distCount}>{count}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Recently Created */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionLabel}>{t('admin.recentlyCreated')}</Text>
          <Card padding={0}>
            {stats.recentlyCreated.map((s, i) => (
              <RecentRow key={s.id} scenario={s} isLast={i === stats.recentlyCreated.length - 1} />
            ))}
          </Card>
        </Animated.View>

        {/* Recently Edited */}
        <Animated.View entering={FadeInDown.delay(350).duration(500)}>
          <Text style={styles.sectionLabel}>{t('admin.recentlyEdited')}</Text>
          <Card padding={0}>
            {stats.recentlyEdited.map((s, i) => (
              <RecentRow key={s.id} scenario={s} isLast={i === stats.recentlyEdited.length - 1} />
            ))}
          </Card>
        </Animated.View>

        {/* Warnings */}
        {stats.warnings.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <Text style={styles.sectionLabel}>{t('admin.contentWarnings')}</Text>
            <Card padding={Spacing.md}>
              {stats.warnings.map((w, i) => (
                <View key={i} style={styles.warningRow}>
                  <AlertTriangle size={16} color={Colors.warning} />
                  <Text style={styles.warningText}>{w}</Text>
                </View>
              ))}
            </Card>
          </Animated.View>
        )}

        {/* Navigation */}
        <Animated.View entering={FadeInDown.delay(450).duration(500)} style={{ marginTop: Spacing.lg, gap: Spacing.sm }}>
          <Button label={t('admin.manageScenarios')} onPress={() => router.push('/admin/scenarios')} variant="gold" iconRight={<ChevronRight size={20} color={Colors.background} />} />
          <Button label={t('admin.contentStatistics')} onPress={() => router.push('/admin/statistics')} variant="outline" iconRight={<ChevronRight size={20} color={Colors.gold} />} />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.quickIcon}>{icon}</View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function RecentRow({ scenario, isLast }: { scenario: AdminScenario; isLast: boolean }) {
  const { t } = useTranslation();
  const date = new Date(scenario.createdAt).toLocaleDateString();
  return (
    <TouchableOpacity
      style={[styles.recentRow, isLast && { borderBottomWidth: 0 }]}
      onPress={() => router.push(`/admin/editor?id=${scenario.id}`)}
      activeOpacity={0.7}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.recentTitle} numberOfLines={1}>{scenario.title}</Text>
        <Text style={styles.recentMeta}>{translatePosition(scenario.position, t)} · {translateCategory(scenario.category, t)} · {date}</Text>
      </View>
      <ChevronRight size={18} color={Colors.textQuaternary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.errorSoft, justifyContent: 'center', alignItems: 'center' },
  sectionLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { width: '48%', backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'flex-start', gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  statValue: { ...Typography.statMd, fontFamily: 'Inter-ExtraBold', color: Colors.white },
  statLabel: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold' },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  quickAction: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', gap: 8 },
  quickIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  quickLabel: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', textAlign: 'center' },
  distributionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: Spacing.sm },
  distLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter-Medium' },
  distBarWrap: { flex: 2, height: 6, borderRadius: 99, backgroundColor: Colors.border, overflow: 'hidden' },
  distBar: { height: 6, borderRadius: 99, backgroundColor: Colors.gold },
  distCount: { fontSize: 14, color: Colors.white, fontFamily: 'Inter-Bold', minWidth: 24, textAlign: 'right' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surface, borderRadius: 99, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: 8 },
  chipLabel: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-Medium' },
  chipCount: { fontSize: 14, color: Colors.gold, fontFamily: 'Inter-Bold' },
  recentRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.hairline, gap: Spacing.sm },
  recentTitle: { fontSize: 15, color: Colors.textPrimary, fontFamily: 'Inter-SemiBold' },
  recentMeta: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Inter-Regular', marginTop: 2 },
  warningRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 6 },
  warningText: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-Regular', flex: 1 },
});
