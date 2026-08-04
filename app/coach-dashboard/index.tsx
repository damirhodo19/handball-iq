import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect, Redirect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  ArrowLeft, Users, Activity, Target, Brain, TrendingUp, TrendingDown,
  ChevronRight, Calendar, ClipboardList, BarChart3, Bell, UserCircle, Shield,
  AlertCircle, Plus,
} from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { loadCoachAccount, getTeamStats, TeamStats, generateTeamRecommendations, TrainingRecommendation } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translateRole } from '@/lib/translations';

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
      setDataError(false);
    } catch {
      setDataError(true);
    }
  }, []));

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

  const weeklyProgressColor = (stats?.weeklyProgress ?? 0) >= 0 ? Colors.success : Colors.error;

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{coach.teamName}</Text>
            <Text style={styles.headerSub}>{translateRole(coach.role, t)} · {coach.name}</Text>
          </View>
          <View style={styles.headerIcon}><Shield size={20} color={Colors.gold} /></View>
        </Animated.View>

        {/* Stats Grid */}
        {stats && (
          <Animated.View entering={FadeInDown.delay(50).duration(500)}>
            <Text style={styles.sectionLabel}>{t('coachDashboard.teamOverview')}</Text>
            <View style={styles.statsGrid}>
              <StatCard icon={<Users size={18} color={Colors.gold} />} value={`${stats.totalPlayers}`} label={t('coachDashboard.totalPlayers')} />
              <StatCard icon={<Activity size={18} color={Colors.success} />} value={`${stats.todayActive}`} label={t('coachDashboard.activeToday')} />
              <StatCard icon={<Target size={18} color={Colors.info} />} value={`${stats.sessionsCompleted}`} label={t('coachDashboard.sessionsDone')} />
              <StatCard icon={<Brain size={18} color={Colors.gold} />} value={`${stats.avgDecisionScore}`} label={t('coachDashboard.avgDecision')} />
            </View>
          </Animated.View>
        )}

        {/* Mental Readiness + Weekly Progress */}
        {stats && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Card variant="gradient" shadow="card" style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressLabel}>{t('coachDashboard.avgMentalReadiness')}</Text>
                  <Text style={styles.progressValue}>{stats.avgMentalReadiness}%</Text>
                </View>
                <View style={styles.progressIconWrap}><Brain size={22} color={Colors.gold} /></View>
              </View>
              <ProgressBar progress={stats.avgMentalReadiness / 100} height={5} color={Colors.gold} />
            </Card>

            <Card variant="gradient" shadow="card" style={styles.progressCard}>
              <View style={styles.progressRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressLabel}>{t('coachDashboard.weeklyProgress')}</Text>
                  <Text style={[styles.progressValue, { color: weeklyProgressColor }]}>
                    {stats.weeklyProgress > 0 ? '+' : ''}{t('coachDashboard.pts', { n: stats.weeklyProgress })}
                  </Text>
                </View>
                <View style={styles.progressIconWrap}>
                  {stats.weeklyProgress >= 0 ? <TrendingUp size={22} color={Colors.success} /> : <TrendingDown size={22} color={Colors.error} />}
                </View>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Top Recommendations */}
        {topRecs.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>{t('coachDashboard.priorityRecs')}</Text>
              <TouchableOpacity onPress={() => router.push('/coach-dashboard/team-analysis')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            {topRecs.map((rec, i) => (
              <Card key={i} variant="gradient" shadow="card" style={styles.recCard}>
                <View style={styles.recHeader}>
                  <View style={[styles.severityDot, { backgroundColor: rec.severity === 'high' ? Colors.error : rec.severity === 'medium' ? Colors.warning : Colors.success }]} />
                  <Text style={styles.recPlayer}>{rec.playerName}</Text>
                </View>
                <Text style={styles.recIssue}>{rec.issue}</Text>
                <Text style={styles.recAction}>{rec.recommendation}</Text>
              </Card>
            ))}
          </Animated.View>
        )}

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('coachDashboard.management')}</Text>
          <View style={styles.menuCol}>
            <MenuItem icon={<Users size={20} color={Colors.gold} />} title={t('coachDashboard.playerList')} subtitle={t('coachDashboard.playerListSub')} onPress={() => router.push('/coach-dashboard/players')} />
            <MenuItem icon={<BarChart3 size={20} color={Colors.gold} />} title={t('coachDashboard.teamAnalysis')} subtitle={t('coachDashboard.teamAnalysisSub')} onPress={() => router.push('/coach-dashboard/team-analysis')} />
            <MenuItem icon={<ClipboardList size={20} color={Colors.gold} />} title={t('coachDashboard.sessionAssignment')} subtitle={t('coachDashboard.sessionAssignmentSub')} onPress={() => router.push('/coach-dashboard/assign')} />
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
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
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
