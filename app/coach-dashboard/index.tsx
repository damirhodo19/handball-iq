import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect, Redirect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Users, Activity, Target, Brain, TrendingUp, TrendingDown, ChevronRight, Calendar, ClipboardList, BarChart3, Bell, UserCircle, Shield, AlertCircle, Plus
} from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { loadCoachAccount, getTeamStats, TeamStats, generateTeamRecommendations, TrainingRecommendation } from '@/lib/coach-dashboard-data';
import { useTeamPlatform } from '@/hooks/useTeamPlatform';
import { renderCoachMessage } from '@/lib/coach-i18n';
import { useTranslation } from '@/hooks/useTranslation';
import { translateRole } from '@/lib/translations';
import { loadCoachAttendance, loadCoachRoster } from '@/lib/coach-workspace';
import { getActiveTeam } from '@/lib/team-platform/platform';

const INIT_TIMEOUT_MS = 8000;

export default function CoachDashboardHome() {
  const { t } = useTranslation();
  const { session, user, profile, loading: authLoading, retry } = useAuth();
  const { isDevAuthenticated } = useDevAuth();
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [coach, setCoach] = useState(loadCoachAccount());
  const [topRecs, setTopRecs] = useState<TrainingRecommendation[]>([]);
  const [timedOut, setTimedOut] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [workspaceOverview, setWorkspaceOverview] = useState({ rosterCount: 0, attendanceRate: 0, hasAttendance: false });
  const coachId = user?.id ?? (isDevAuthenticated ? 'dev_coach' : undefined);
  const { team: platformTeam, stats: platformStats, init, refresh: refreshTeam } = useTeamPlatform(coachId, coach?.name);

  useEffect(() => {
    if (authLoading && !isDevAuthenticated) {
      const timer = setTimeout(() => setTimedOut(true), INIT_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }
    setTimedOut(false);
  }, [authLoading, isDevAuthenticated]);

  useFocusEffect(useCallback(() => {
    try {
      setStats(getTeamStats());
      setCoach(loadCoachAccount());
      setTopRecs(generateTeamRecommendations().slice(0, 3));
      if (coachId) {
        const teamKey = getActiveTeam()?.id ?? 'default';
        const roster = loadCoachRoster(coachId, teamKey);
        const now = new Date();
        const today = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}-${`${now.getDate()}`.padStart(2, '0')}`;
        const attendance = loadCoachAttendance(coachId, teamKey, today);
        const present = attendance.filter((entry) => entry.status === 'present').length;
        setWorkspaceOverview({
          rosterCount: roster.length,
          attendanceRate: attendance.length ? Math.round((present / attendance.length) * 100) : 0,
          hasAttendance: attendance.length > 0,
        });
      }
      if (coachId && !platformTeam) init();
      refreshTeam();
      setDataError(false);
    } catch {
      setDataError(true);
    }
  }, [coachId, platformTeam, init, refreshTeam]));

  // State: auth still loading (with 8s timeout)
  if (authLoading && !isDevAuthenticated && !timedOut) {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>{t('coachDashboard.loading')}</Text>
        </View>
      </ScreenBackground>
    );
  }

  // State: auth timed out
  if (timedOut && authLoading) {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('coachDashboard.errorTitle')}</Text>
          <View style={styles.buttonRow}>
            <Button label={t('coachDashboard.retry')} onPress={() => { setTimedOut(false); retry(); }} variant="outline" />
            <Button label={t('coachDashboard.returnHome')} onPress={() => router.replace('/(tabs)/home')} variant="dark" />
          </View>
        </View>
      </ScreenBackground>
    );
  }

  // State: not authenticated
  if (!session && !isDevAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // State: authenticated as player (not coach)
  const metadataRole = user?.app_metadata?.['role'] as string | undefined;
  const role = metadataRole || profile?.role;
  if (role === 'player') {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <AlertCircle size={48} color={Colors.gold} />
          <Text style={styles.errorTitle}>{t('coachDashboard.coachesOnly')}</Text>
          <Button label={t('coachDashboard.returnHome')} onPress={() => router.replace('/(tabs)/home')} />
        </View>
      </ScreenBackground>
    );
  }

  // State: data loading error
  if (dataError) {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('coachDashboard.errorTitle')}</Text>
          <View style={styles.buttonRow}>
            <Button label={t('common.retry')} onPress={() => { setDataError(false); retry(); }} variant="outline" />
            <Button label={t('coachDashboard.returnHome')} onPress={() => router.replace('/(tabs)/home')} variant="dark" />
          </View>
        </View>
      </ScreenBackground>
    );
  }

  // State: coach (or dev auth, or unknown role) with no local account
  if (!coach) {
    return (
      <ScreenBackground>
        <View style={styles.centered}>
          <Users size={48} color={Colors.gold} />
          <Text style={styles.errorTitle}>{t('coachDashboard.noTeam')}</Text>
          <Button label={t('coachDashboard.createTeam')} onPress={() => router.push('/coach-dashboard/login')} iconRight={<Plus size={20} color={Colors.background} />} />
        </View>
      </ScreenBackground>
    );
  }

  const displayTeamName = platformTeam?.name ?? coach.teamName;
  const dashStats = platformStats ?? stats;
  const weeklyProgressColor = (dashStats?.weeklyProgress ?? 0) >= 0 ? Colors.success : Colors.error;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{displayTeamName}</Text>
            <Text style={styles.headerSub}>{translateRole(coach.role, t)} · {coach.name}</Text>
          </View>
          <View style={styles.headerIcon}><Shield size={20} color={Colors.gold} /></View>
        </Animated.View>

        {/* Platform highlights */}
        {platformStats && (
          <Animated.View entering={FadeInDown.delay(30).duration(500)}>
            <Card variant="gradient" shadow="card" style={styles.highlightCard}>
              {platformStats.mostImproved && (
                <Text style={styles.highlightText}>
                  {t('team.mostImproved')}: {platformStats.mostImproved.display_name} (+{platformStats.mostImproved.improvement ?? 0}%)
                </Text>
              )}
              {platformStats.needsAttention && (
                <Text style={styles.highlightWarn}>
                  {t('team.needsAttention')}: {platformStats.needsAttention.display_name} ({platformStats.needsAttention.decision_score ?? 0}%)
                </Text>
              )}
            </Card>
          </Animated.View>
        )}

        {/* Stats Grid */}
        {dashStats && (
          <Animated.View entering={FadeInDown.delay(50).duration(500)}>
            <Text style={styles.sectionLabel}>{t('coachDashboard.teamOverview')}</Text>
            <View style={styles.statsGrid}>
              <StatCard icon={<Users size={18} color={Colors.gold} />} value={`${workspaceOverview.rosterCount || platformStats?.rosterCount || (stats as TeamStats)?.totalPlayers || 0}`} label={t('team.roster')} />
              <StatCard icon={<Activity size={18} color={Colors.success} />} value={`${platformStats?.dailyActivity ?? (stats as TeamStats)?.todayActive ?? 0}`} label={t('team.dailyActivity')} />
              <StatCard icon={<Target size={18} color={Colors.info} />} value={`${workspaceOverview.hasAttendance ? workspaceOverview.attendanceRate : (platformStats?.attendanceRate ?? 0)}%`} label={t('team.attendance')} />
              <StatCard icon={<Brain size={18} color={Colors.gold} />} value={`${platformStats?.avgDecisionScore ?? (stats as TeamStats)?.avgDecisionScore ?? 0}`} label={t('coachDashboard.avgDecision')} />
            </View>
          </Animated.View>
        )}

        {/* Mental Readiness + Weekly Progress */}
        {dashStats && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Card variant="gradient" shadow="card" style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressLabel}>{t('team.weeklyProgress')}</Text>
                  <Text style={[styles.progressValue, { color: weeklyProgressColor }]}>
                    {(platformStats?.weeklyProgress ?? (stats as TeamStats)?.weeklyProgress ?? 0) > 0 ? '+' : ''}
                    {platformStats?.weeklyProgress ?? (stats as TeamStats)?.weeklyProgress ?? 0}%
                  </Text>
                </View>
                <View style={styles.progressIconWrap}>
                  {(platformStats?.weeklyProgress ?? 0) >= 0 ? <TrendingUp size={22} color={Colors.success} /> : <TrendingDown size={22} color={Colors.error} />}
                </View>
              </View>
            </Card>

            {(stats as TeamStats)?.avgMentalReadiness != null && (
            <Card variant="gradient" shadow="card" style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressLabel}>{t('coachDashboard.avgMentalReadiness')}</Text>
                  <Text style={styles.progressValue}>{(stats as TeamStats).avgMentalReadiness}%</Text>
                </View>
                <View style={styles.progressIconWrap}><Brain size={22} color={Colors.gold} /></View>
              </View>
              <ProgressBar progress={(stats as TeamStats).avgMentalReadiness / 100} height={5} color={Colors.gold} />
            </Card>
            )}
          </Animated.View>
        )}

        {/* Top Recommendations */}
        {topRecs.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('coachDashboard.priorityRecs')}</Text>
              <TouchableOpacity onPress={() => router.push('/coach-dashboard/team-analysis')}>
                <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            {topRecs.map((rec, i) => (
              <Card key={i} variant="gradient" shadow="card" style={styles.recCard}>
                <View style={styles.recHeader}>
                  <View style={[styles.severityDot, { backgroundColor: rec.severity === 'high' ? Colors.error : rec.severity === 'medium' ? Colors.warning : Colors.success }]} />
                  <Text style={styles.recPlayer}>{rec.playerName}</Text>
                </View>
                <Text style={styles.recIssue}>{renderCoachMessage(t, rec.issue)}</Text>
                <Text style={styles.recAction}>{renderCoachMessage(t, rec.recommendation)}</Text>
              </Card>
            ))}
          </Animated.View>
        )}

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('coachDashboard.management')}</Text>
          <View style={styles.menuCol}>
            <MenuItem icon={<Users size={20} color={Colors.gold} />} title={t('coachDashboard.playerList')} subtitle={t('coachDashboard.playerListSub')} onPress={() => router.push('/coach-dashboard/players')} />
            <MenuItem icon={<ClipboardList size={20} color={Colors.gold} />} title={t('team.attendanceManager')} subtitle={t('team.attendanceManagerSub')} onPress={() => router.push('/coach-dashboard/attendance' as never)} />
            <MenuItem icon={<BarChart3 size={20} color={Colors.gold} />} title={t('coachDashboard.teamAnalysis')} subtitle={t('coachDashboard.teamAnalysisSub')} onPress={() => router.push('/coach-dashboard/team-analysis')} />
            <MenuItem icon={<ClipboardList size={20} color={Colors.gold} />} title={t('coachDashboard.sessionAssignment')} subtitle={t('coachDashboard.sessionAssignmentSub')} onPress={() => router.push('/coach-dashboard/assign')} />
            <MenuItem icon={<UserCircle size={20} color={Colors.gold} />} title={t('team.invitePlayers')} subtitle={t('team.inviteSub')} onPress={() => router.push('/coach-dashboard/invite')} />
            <MenuItem icon={<BarChart3 size={20} color={Colors.gold} />} title={t('team.leaderboards')} subtitle={t('team.leaderboardsSub')} onPress={() => router.push('/coach-dashboard/leaderboards')} />
            <MenuItem icon={<ClipboardList size={20} color={Colors.gold} />} title={t('team.reports')} subtitle={t('team.reportsSub')} onPress={() => router.push('/coach-dashboard/reports')} />
            <MenuItem icon={<Shield size={20} color={Colors.gold} />} title={t('team.clubs')} subtitle={t('team.clubsSub')} onPress={() => router.push('/coach-dashboard/clubs')} />
            <MenuItem icon={<UserCircle size={20} color={Colors.gold} />} title={t('team.coachNotes')} subtitle={t('team.coachNotesSub')} onPress={() => router.push('/coach-dashboard/notes')} />
            <MenuItem icon={<UserCircle size={20} color={Colors.gold} />} title={t('coachDashboard.playerComparison')} subtitle={t('coachDashboard.playerComparisonSub')} onPress={() => router.push('/coach-dashboard/compare')} />
            <MenuItem icon={<Bell size={20} color={Colors.gold} />} title={t('coachDashboard.notifications')} subtitle={t('coachDashboard.notificationsSub')} onPress={() => router.push('/coach-dashboard/notifications')} />
            <MenuItem icon={<Calendar size={20} color={Colors.gold} />} title={t('coachDashboard.teamCalendar')} subtitle={t('coachDashboard.teamCalendarSub')} onPress={() => router.push('/coach-dashboard/calendar')} />
          </View>
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

function MenuItem({ icon, title, subtitle, onPress }: { icon: React.ReactNode; title: string; subtitle: string; onPress: () => void }) {
  return (
    <PressableCard onPress={onPress} variant="gradient" shadow="card" style={styles.menuCard}>
      <View style={styles.menuRow}>
        <View style={styles.menuIcon}>{icon}</View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSub}>{subtitle}</Text>
        </View>
        <ChevronRight size={18} color={Colors.gold} />
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg, gap: Spacing.lg },
  loadingText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 16 },
  errorTitle: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 20, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13, marginTop: 2 },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAllText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: { width: '48%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, gap: 6, borderWidth: 1, borderColor: Colors.border },
  statIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  statLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 0.5 },

  progressCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  progressLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  progressValue: { fontFamily: 'Inter-ExtraBold', fontSize: 26, color: Colors.textPrimary, marginTop: 2 },
  progressIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },

  highlightCard: { gap: Spacing.xs, marginBottom: Spacing.sm, padding: Spacing.md },
  highlightText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success },
  highlightWarn: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.warning },

  recCard: { gap: Spacing.xs, marginBottom: Spacing.sm },
  recHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  recPlayer: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  recIssue: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19 },
  recAction: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13, lineHeight: 19 },

  menuCol: { gap: Spacing.sm },
  menuCard: { marginBottom: 0 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  menuTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  menuSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary },
});
