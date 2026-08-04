import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  Shield,
  Library,
  TrendingUp,
  ArrowRight,
  Clock,
  Flame,
  Target,
  Zap,
  Award,
  Sparkles,
  ChevronRight,
  Activity,
  Play,
  Brain,
  Users,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { ProgressRing } from '@/components/ProgressRing';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { fetchScenarios, fetchRecentAttempts } from '@/lib/training';
import { TrainingScenario } from '@/types/database';
import { loadProfile, loadStreak, loadSessions, UserProfile, StreakData, SessionRecord } from '@/lib/storage';
import { getDevelopmentTitle, getDailySession, HandballPosition } from '@/lib/positions';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition } from '@/lib/translations';

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.goodMorning';
  if (hour < 18) return 'home.goodAfternoon';
  return 'home.goodEvening';
}

function getPositionLabel(position: string | null, t: (key: string, vars?: Record<string, string | number>) => string): string {
  return translatePosition(position ?? 'Goalkeeper', t);
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { profile: authProfile } = useAuth();
  const { isDevAuthenticated, testUser } = useDevAuth();
  const [scenarios, setScenarios] = useState<TrainingScenario[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [localSessions, setLocalSessions] = useState<SessionRecord[]>([]);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);

  const loadData = useCallback(async () => {
    const [scenarioRes, attemptRes] = await Promise.all([fetchScenarios(), fetchRecentAttempts(20)]);
    if (scenarioRes.scenarios) setScenarios(scenarioRes.scenarios);
    if (attemptRes.data) setAttempts(attemptRes.data);
    setStreak(loadStreak());
    setLocalSessions(loadSessions());
    setLocalProfile(loadProfile());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const score = isDevAuthenticated ? (testUser?.handball_iq_score ?? 82) : (authProfile?.handball_iq_score ?? 82);
  const streakDays = streak?.currentStreak ?? 0;
  const totalPoints = isDevAuthenticated ? (testUser?.total_points ?? 0) : (authProfile?.total_points ?? 0);
  const playerName = isDevAuthenticated ? (testUser?.name ?? 'Damir') : (authProfile?.display_name ?? (localProfile?.name ?? 'Damir'));
  const positionLabel = isDevAuthenticated
    ? translatePosition('Goalkeeper', t)
    : getPositionLabel(localProfile?.position ?? authProfile?.position ?? 'Goalkeeper', t);
  const dailySession = getDailySession((localProfile?.position ?? authProfile?.position ?? 'Goalkeeper') as HandballPosition);
  const sessionsCompleted = localSessions.length;
  const recentCorrect = localSessions.filter((s) => s.correctCount === s.totalCount).length;
  const mentalFocus = localSessions.length > 0 ? Math.round((recentCorrect / localSessions.length) * 100) : 0;

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        {/* Greeting */}
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={styles.greeting}>{t(getGreetingKey(), { name: playerName })}</Text>
          <Text style={styles.greetingSub}>{positionLabel}</Text>
        </Animated.View>

        {/* Play Match - Primary Feature */}
        <Animated.View entering={FadeInDown.delay(50).duration(600)} style={styles.playMatchWrap}>
          <PressableCard
            onPress={() => router.push('/match/intro')}
            variant="gradient"
            padding={0}
            shadow="cardLg"
            style={styles.playMatchCard}
          >
            <LinearGradient
              colors={['rgba(212,175,55,0.14)', 'rgba(212,175,55,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.playMatchGradient}
            >
              <View style={styles.playMatchTop}>
                <View style={styles.playMatchIcon}>
                  <Shield size={26} color={Colors.gold} />
                </View>
                <View style={styles.playMatchBadge}>
                  <Text style={styles.playMatchBadgeText}>{t('home.mainFeature')}</Text>
                </View>
              </View>
              <Text style={styles.playMatchTitle}>{t('home.playMatch')}</Text>
              <Text style={styles.playMatchDesc} numberOfLines={2}>
                {t('home.playMatchDesc')}
              </Text>
              <TouchableOpacity
                style={styles.playMatchBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/match/intro')}
              >
                <LinearGradient
                  colors={Colors.goldGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.playMatchBtnGradient}
                >
                  <Play size={18} color={Colors.background} />
                  <Text style={styles.playMatchBtnText}>{t('home.playMatch')}</Text>
                  <ArrowRight size={20} color={Colors.background} />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </PressableCard>
        </Animated.View>

        {/* Today's Session */}
        <Animated.View entering={FadeInDown.delay(150).duration(600)}>
          <Text style={styles.sectionLabel}>{t('home.todaysFocus')}</Text>
          <PressableCard
            onPress={() => router.push('/session')}
            variant="gradient"
            padding={0}
            shadow="cardLg"
            style={styles.sessionCard}
          >
            <LinearGradient
              colors={['rgba(212,175,55,0.10)', 'rgba(212,175,55,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sessionGradient}
            >
              <View style={styles.sessionTop}>
                <View style={styles.sessionIconWrap}>
                  <Target size={24} color={Colors.gold} />
                </View>
                <View style={styles.sessionMeta}>
                  <View style={styles.sessionBadge}>
                    <Zap size={10} color={Colors.gold} />
                    <Text style={styles.sessionBadgeText}>{t('difficulty.intermediate').toUpperCase()}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sessionTitle}>{t('home.trainingSession')}</Text>
              <Text style={styles.sessionDesc} numberOfLines={2}>
                {t('home.trainingSessionSub')}
              </Text>

              <View style={styles.sessionMetaRow}>
                <View style={styles.sessionMetaItem}>
                  <Clock size={13} color={Colors.textTertiary} />
                  <Text style={styles.sessionMetaText}>{t('home.tenMin')}</Text>
                </View>
                <View style={styles.sessionMetaDivider} />
                <View style={styles.sessionMetaItem}>
                  <Zap size={13} color={Colors.textTertiary} />
                  <Text style={styles.sessionMetaText}>{t('difficulty.intermediate')}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/session')}
              >
                <LinearGradient
                  colors={Colors.goldGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startBtnGradient}
                >
                  <Text style={styles.startBtnText}>{t('home.startSession')}</Text>
                  <ArrowRight size={20} color={Colors.background} />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </PressableCard>
        </Animated.View>

        {/* Navigation Cards */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <View style={styles.navGrid}>
            {/* Match Preparation */}
            <PressableCard
              onPress={() => router.push('/(tabs)/match-day')}
              variant="gradient"
              shadow="card"
              style={styles.navCard}
            >
              <View style={styles.navCardInner}>
                <View style={styles.navIconWrap}>
                  <Shield size={22} color={Colors.gold} />
                </View>
                <Text style={styles.navTitle}>{t('home.match')}</Text>
                <Text style={styles.navTitleSecond}>{t('home.preparation')}</Text>
              </View>
            </PressableCard>

            {/* Scenario Library */}
            <PressableCard
              onPress={() => router.push('/(tabs)/training')}
              variant="gradient"
              shadow="card"
              style={styles.navCard}
            >
              <View style={styles.navCardInner}>
                <View style={styles.navIconWrap}>
                  <Library size={22} color={Colors.gold} />
                </View>
                <Text style={styles.navTitle}>{t('home.scenario')}</Text>
                <Text style={styles.navTitleSecond}>{t('home.library')}</Text>
              </View>
            </PressableCard>
          </View>
        </Animated.View>

        {/* AI Coach */}
        <Animated.View entering={FadeInDown.delay(250).duration(500)}>
          <PressableCard
            onPress={() => router.push('/coach')}
            variant="gradient"
            shadow="cardLg"
            style={styles.coachCard}
          >
            <LinearGradient
              colors={['rgba(212,175,55,0.12)', 'rgba(212,175,55,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.coachGradient}
            >
              <View style={styles.coachRow}>
                <View style={styles.coachIconWrap}>
                  <Brain size={24} color={Colors.gold} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.coachTitle}>{t('home.aiCoach')}</Text>
                  <Text style={styles.coachSub} numberOfLines={1}>{t('home.aiCoachSub')}</Text>
                </View>
                <ChevronRight size={20} color={Colors.gold} />
              </View>
            </LinearGradient>
          </PressableCard>
        </Animated.View>

        {/* Coach Dashboard */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <PressableCard
            onPress={() => router.push('/coach-dashboard')}
            variant="gradient"
            shadow="cardLg"
            style={styles.coachCard}
          >
            <LinearGradient
              colors={['rgba(212,175,55,0.12)', 'rgba(212,175,55,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.coachGradient}
            >
              <View style={styles.coachRow}>
                <View style={styles.coachIconWrap}>
                  <Users size={24} color={Colors.gold} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.coachTitle}>{t('home.coachDashboard')}</Text>
                  <Text style={styles.coachSub} numberOfLines={1}>{t('home.coachDashboardSub')}</Text>
                </View>
                <ChevronRight size={20} color={Colors.gold} />
              </View>
            </LinearGradient>
          </PressableCard>
        </Animated.View>

        {/* Your Progress */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <PressableCard
            onPress={() => router.push('/(tabs)/progress')}
            variant="gradient"
            shadow="cardLg"
            style={styles.progressCard}
          >
            <View style={styles.progressTop}>
              <View style={styles.progressIconWrap}>
                <TrendingUp size={22} color={Colors.gold} />
              </View>
              <View style={styles.progressHeaderText}>
                <Text style={styles.progressTitle}>{t('home.yourProgress')}</Text>
                <Text style={styles.progressSub}>{t('home.viewProgressSub')}</Text>
              </View>
              <ChevronRight size={18} color={Colors.gold} />
            </View>

            <View style={styles.progressStatsRow}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{sessionsCompleted}</Text>
                <Text style={styles.progressStatLabel}>{t('home.sessions')}</Text>
              </View>
              <View style={styles.progressStatDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{score}</Text>
                <Text style={styles.progressStatLabel}>{t('home.decisionScore')}</Text>
              </View>
              <View style={styles.progressStatDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{mentalFocus}%</Text>
                <Text style={styles.progressStatLabel}>{t('home.mentalFocus')}</Text>
              </View>
            </View>

            <View style={styles.progressRingRow}>
              <ProgressRing progress={score / 100} size={90} strokeWidth={7}>
                <View style={styles.ringInner}>
                  <Text style={styles.ringValue}>{score}</Text>
                  <Text style={styles.ringLabel}>{t('home.iq')}</Text>
                </View>
              </ProgressRing>
              <View style={styles.progressDetails}>
                <View style={styles.progressDetailRow}>
                  <Flame size={14} color={Colors.gold} />
                  <Text style={styles.progressDetailText}>{t('home.dayStreak', { n: streakDays })}</Text>
                </View>
                <View style={styles.progressDetailRow}>
                  <Sparkles size={14} color={Colors.gold} />
                  <Text style={styles.progressDetailText}>{t('home.totalPoints', { n: totalPoints })}</Text>
                </View>
                <View style={styles.progressDetailRow}>
                  <Activity size={14} color={Colors.gold} />
                  <Text style={styles.progressDetailText}>{t('home.accuracy', { n: mentalFocus })}</Text>
                </View>
              </View>
            </View>
          </PressableCard>
        </Animated.View>

        {/* Founding Member Badge */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <View style={styles.foundingWrap}>
            <LinearGradient
              colors={['rgba(212,175,55,0.08)', 'rgba(212,175,55,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.foundingGradient}
            >
              <View style={styles.foundingLeft}>
                <View style={styles.foundingIconWrap}>
                  <Award size={22} color={Colors.gold} />
                </View>
                <View>
                  <Text style={styles.foundingTitle}>{t('home.foundingMember')}</Text>
                  <Text style={styles.foundingSub}>{t('home.earlyAccessPioneer')}</Text>
                </View>
              </View>
              <View style={styles.foundingBadge}>
                <Text style={styles.foundingBadgeText}>#001</Text>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  greeting: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 28, lineHeight: 34 },
  greetingSub: { ...Typography.bodySmall, color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14, marginTop: 2, marginBottom: Spacing.xl, letterSpacing: 0.5 },

  sectionLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, marginBottom: Spacing.sm },

  // Play Match
  playMatchWrap: { marginBottom: Spacing.lg },
  playMatchCard: { overflow: 'hidden' },
  playMatchGradient: { borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md },
  playMatchTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  playMatchIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  playMatchBadge: { backgroundColor: Colors.gold, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm },
  playMatchBadgeText: { color: Colors.background, fontFamily: 'Inter-ExtraBold', fontSize: 10, letterSpacing: 1.5 },
  playMatchTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary, lineHeight: 30 },
  playMatchDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },
  playMatchBtn: { borderRadius: Radius.lg, overflow: 'hidden' },
  playMatchBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: 16, borderRadius: Radius.lg },
  playMatchBtnText: { fontFamily: 'Inter-ExtraBold', fontSize: 17, color: Colors.background },

  // Today's Session
  sessionCard: { overflow: 'hidden', marginBottom: Spacing.lg },
  sessionGradient: { borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md },
  sessionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sessionIconWrap: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  sessionMeta: { alignItems: 'flex-end' },
  sessionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.goldSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold },
  sessionBadgeText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 1 },
  sessionTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary, lineHeight: 28 },
  sessionDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  sessionMetaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  sessionMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sessionMetaText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 13 },
  sessionMetaDivider: { width: 1, height: 16, backgroundColor: Colors.hairline },

  startBtn: { borderRadius: Radius.lg, overflow: 'hidden', marginTop: Spacing.xs },
  startBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: 16, borderRadius: Radius.lg },
  startBtnText: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.background },

  // Nav grid
  navGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  navCard: { flex: 1 },
  navCardInner: { gap: Spacing.xs },
  navIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  navTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary, lineHeight: 20 },
  navTitleSecond: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary, lineHeight: 20 },

  // AI Coach
  coachCard: { marginBottom: Spacing.lg, overflow: 'hidden' },
  coachGradient: { borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.gold },
  coachRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  coachIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  coachTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 17, color: Colors.textPrimary },
  coachSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },

  // Your Progress
  progressCard: { marginBottom: Spacing.xl, gap: Spacing.lg, padding: Spacing.lg, ...Shadows.cardLg, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, backgroundColor: Colors.surface, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 12 },
  progressTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  progressIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  progressHeaderText: { flex: 1, gap: 2 },
  progressTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 17, color: Colors.textPrimary },
  progressSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },
  progressStatsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.hairline, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  progressStat: { flex: 1, alignItems: 'center', gap: 4 },
  progressStatValue: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  progressStatLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 0.5, textTransform: 'uppercase' },
  progressStatDivider: { width: 1, height: 36, backgroundColor: Colors.hairline },

  progressRingRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  ringInner: { alignItems: 'center', justifyContent: 'center' },
  ringValue: { fontFamily: 'Inter-ExtraBold', fontSize: 26, color: Colors.textPrimary },
  ringLabel: { fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.gold, letterSpacing: 2 },
  progressDetails: { flex: 1, gap: Spacing.sm },
  progressDetailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressDetailText: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 14 },

  // Founding Member
  foundingWrap: { borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gold, ...Shadows.gold },
  foundingGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderRadius: Radius.lg },
  foundingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  foundingIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  foundingTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  foundingSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  foundingBadge: { backgroundColor: Colors.gold, paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.pill },
  foundingBadgeText: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.background },
});
