import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import {
  Shield,
  TrendingUp,
  ArrowRight,
  Flame,
  Target,
  Zap,
  ChevronRight,
  Activity,
  Brain,
  Users,
  Sun,
  AlertCircle,
  CalendarDays,
  Bell,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { useDevelopment } from '@/hooks/useDevelopment';
import { setSessionMode } from '@/lib/development';
import { ScreenBackground } from '@/components/Screen';
import { ProgressRing } from '@/components/ProgressRing';
import { useAuth } from '@/context/AuthContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  loadProfile,
  loadStreak,
  loadSessions,
  loadMatchHistory,
  UserProfile,
  StreakData,
  SessionRecord,
} from '@/lib/storage';
import { computePlayerStats } from '@/lib/player-stats';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition } from '@/lib/translations';
import { migrateLocalProfileToV2 } from '@/lib/platform/migrate-profile';
import { profileNeedsCompletion, resolveAppRole } from '@/lib/platform/personalization';
import { resolveContent } from '@/lib/platform/content-resolver';
import { setSessionIntent } from '@/lib/development/session-intent';
import { clearActiveTrainingSession } from '@/lib/development/active-session';
import { translateCategory } from '@/lib/translations';
import { useMode } from '@/context/ModeContext';
import { CoachHome } from '@/components/CoachHome';
import { LoadingState } from '@/components/LoadingState';
import { Button } from '@/components/Button';
import { getSyncUiStatus, type SyncUiStatus } from '@/services/syncService';
import {
  activeModeNeedsPlayerPosition,
} from '@/lib/platform/resolve-position';
import { isPlatformStorageHydrated } from '@/lib/platform-storage';
import { useTabScreenBottomPadding } from '@/lib/layout';
import { fetchTeamNotificationCounts } from '@/lib/team-platform/notifications';
import { useActivePlayerPosition } from '@/hooks/useActivePlayerPosition';
import { ActivePositionSelector } from '@/components/ActivePositionSelector';

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.goodMorning';
  if (hour < 18) return 'home.goodAfternoon';
  return 'home.goodEvening';
}

function goalLabel(
  goal: string | null | undefined,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string {
  if (!goal) return t('home.noGoalsYet');
  const keyMap: Record<string, string> = {
    'Decision Making': 'devGoal.decisionMaking',
    'Game Intelligence': 'goal.gameIntelligence',
    Defence: 'goal.defence',
    Attack: 'goal.attack',
    'Mental Preparation': 'devGoal.mentalPreparation',
    'Match Preparation': 'goal.matchPreparation',
    Leadership: 'goal.leadership',
    'Complete Development': 'goal.completeDevelopment',
    Tactics: 'coachGoal.tactics',
    'Player Development': 'coachGoal.playerDevelopment',
    'Training Planning': 'coachGoal.trainingPlanning',
    'Match Analysis': 'coachGoal.matchAnalysis',
  };
  const key = keyMap[goal];
  return key ? t(key) : goal;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { themeVersion } = useTheme();
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const { isDevAuthenticated, testUser } = useDevAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [localSessions, setLocalSessions] = useState<SessionRecord[]>([]);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<ReturnType<typeof loadMatchHistory>>([]);
  const [syncStatus, setSyncStatus] = useState<SyncUiStatus>('idle');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { activeMode, isCoachMode, canSwitch: showModeSwitch, setMode, refreshMode } = useMode();
  // Measured tab bar height + small visual gap (see lib/layout.ts).
  const tabBottomPad = useTabScreenBottomPadding();

  const loadData = useCallback(() => {
    if (!isPlatformStorageHydrated() && typeof window === 'undefined') {
      setProfileReady(false);
      return;
    }
    const profile = migrateLocalProfileToV2();
    setLocalProfile(profile);
    setStreak(loadStreak());
    setLocalSessions(loadSessions());
    setMatches(loadMatchHistory());
    setSyncStatus(getSyncUiStatus());
    refreshMode();
    setProfileReady(true);
  }, [refreshMode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  useFocusEffect(useCallback(() => {
    if (!user?.id) {
      setUnreadNotifications(0);
      return;
    }
    void fetchTeamNotificationCounts(null, user.id).then((result) => {
      if (!result.error) setUnreadNotifications(result.counts.unreadNotifications);
    });
  }, [user?.id]));

  const {
    dailyChallenge,
    coachReport,
    state: devState,
    dailyGoals,
    weeklyGoalSummary,
    todayProgramSession,
    levelProgress,
    streak: devStreak,
    positionStatistics,
    refresh: refreshDev,
  } = useDevelopment();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    loadData();
    refreshDev();
    setRefreshing(false);
  }, [loadData, refreshDev]);
  const styles = useMemo(() => createStyles(), [themeVersion]);

  const safeProfile = localProfile ?? migrateLocalProfileToV2();
  const {
    position: playerPosition,
    positions: playerPositions,
    selectPosition,
  } = useActivePlayerPosition(safeProfile);
  const effectiveProfile = useMemo(
    () => ({ ...safeProfile, position: playerPosition ?? safeProfile.position }),
    [safeProfile, playerPosition],
  );
  const stats = useMemo(
    () => computePlayerStats(localSessions, matches, playerPosition),
    [localSessions, matches, playerPosition],
  );
  const needsPlayerPosition = activeModeNeedsPlayerPosition(safeProfile, activeMode);

  const resolved = useMemo(
    () => resolveContent({ profile: effectiveProfile, activeMode }),
    [effectiveProfile, activeMode, localSessions, matches],
  );

  const iqScore = resolved.iq.overall;
  const positionIq = resolved.iq.positionIq.score;
  const score = iqScore ?? (isDevAuthenticated
    ? (testUser?.handball_iq_score ?? (stats.decisionScore || 0))
    : (authProfile?.handball_iq_score ?? (stats.decisionScore || 0)));

  const playerName = isDevAuthenticated
    ? (testUser?.name ?? t('role.player'))
    : (authProfile?.display_name?.trim()
      || safeProfile?.name?.trim()
      || t('role.player'));

  const appRole = resolveAppRole(safeProfile);
  const showCoachDashboard = isCoachMode || appRole === 'coach' || appRole === 'player_coach';
  const needsCompletion = profileNeedsCompletion(safeProfile);

  const focusSkillId = resolved.training.focusParams?.skill
    ? String(resolved.training.focusParams.skill)
    : null;
  const focusText = focusSkillId
    ? t('sprint5.focus.skill', { skill: t(`iq.skill.${focusSkillId}`) })
    : t(resolved.training.focusKey);
  const recommendation = {
    title: t(resolved.training.recommendedTitleKey, { n: resolved.training.recommendedCount }),
    subtitle: t(resolved.training.recommendedSubtitleKey),
    route: '/session',
  };

  const startRecommended = () => {
    clearActiveTrainingSession();
    setSessionIntent({
      position: playerPosition ?? undefined,
      scenarioIds: resolved.training.scenarioIds,
    });
    setSessionMode('standard');
    router.push('/session');
  };

  const sessionsThisWeek = streak?.sessionsThisWeek ?? stats.sessionsThisWeek ?? 0;
  const trend = positionStatistics.improvementTrend ?? 0;
  const activeDevelopmentGoals = safeProfile.developmentGoals.length
    ? safeProfile.developmentGoals
    : resolved.developmentGoal ? [resolved.developmentGoal] : [];
  const upcomingGoal = activeDevelopmentGoals.length
    ? activeDevelopmentGoals.map((goal) => goalLabel(goal, t)).join(' · ')
    : goalLabel(null, t);

  const positionLabel = playerPosition
    ? translatePosition(playerPosition, t)
    : t('role.player');

  if (authLoading || !profileReady) {
    return (
      <ScreenBackground edges={['top']}>
        <LoadingState
          message={t('home.profileLoading')}
          accessibilityLabel={t('home.profileLoading')}
        />
      </ScreenBackground>
    );
  }

  const weakestLabel = resolved.iq.weakest
    ? t(`iq.skill.${resolved.iq.weakest.id}`)
    : t('home.noIqYet');
  const strongestLabel = resolved.iq.strongest
    ? t(`iq.skill.${resolved.iq.strongest.id}`)
    : t('home.noIqYet');

  const dailyTitle = dailyChallenge.focusCategory
    ? t('home.dailyChallengeTitle', {
        focus: translateCategory(dailyChallenge.focusCategory, t),
      })
    : dailyChallenge.title;

  const trendText =
    trend > 2
      ? t('home.trendUp', { n: trend })
      : trend < -2
        ? t('home.trendDown', { n: trend })
        : t('home.trendFlat');

  return (
    <ScreenBackground edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={styles.greeting}>{t(getGreetingKey(), { name: playerName })}</Text>
          <Text style={styles.greetingSub}>
            {isCoachMode ? t('coachHome.title') : positionLabel}
          </Text>
        </Animated.View>

        {(syncStatus === 'pending' || syncStatus === 'failed' || syncStatus === 'synced') && (
          <Text
            style={{
              textAlign: 'center',
              color: syncStatus === 'failed' ? Colors.error : Colors.textSecondary,
              fontFamily: 'Inter-Regular',
              fontSize: 12,
              marginBottom: Spacing.sm,
            }}
          >
            {syncStatus === 'pending'
              ? t('sprint5.sync.pending')
              : syncStatus === 'failed'
                ? t('sprint5.sync.failed')
                : t('sprint5.sync.synced')}
          </Text>
        )}

        {showModeSwitch && (
          <Animated.View entering={FadeInDown.delay(10).duration(400)} style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeChip, activeMode === 'player' && styles.modeChipActive]}
              onPress={() => setMode('player')}
              activeOpacity={0.85}
            >
              <Text style={[styles.modeChipText, activeMode === 'player' && styles.modeChipTextActive]}>
                {t('mode.player')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeChip, activeMode === 'coach' && styles.modeChipActive]}
              onPress={() => setMode('coach')}
              activeOpacity={0.85}
            >
              <Text style={[styles.modeChipText, activeMode === 'coach' && styles.modeChipTextActive]}>
                {t('mode.coach')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {isCoachMode ? (
          <CoachHome profile={safeProfile} styles={styles} />
        ) : needsPlayerPosition ? (
          <Animated.View entering={FadeInDown.delay(20).duration(400)} style={styles.completionWrap}>
            <AlertCircle size={36} color={Colors.gold} />
            <Text style={styles.completionTitle} testID="home-complete-profile-title">
              {t('home.completeProfileTitle')}
            </Text>
            <Text style={styles.completionBody}>{t('home.completeProfileBody')}</Text>
            <View testID="home-setup-profile-cta">
              <Button
                label={t('home.setupProfileCta')}
                onPress={() => router.push('/(auth)/onboarding')}
              />
            </View>
          </Animated.View>
        ) : (
        <>

        {needsCompletion && (
          <Animated.View entering={FadeInDown.delay(20).duration(400)}>
            <PressableCard
              onPress={() => router.push('/(auth)/onboarding')}
              variant="gradient"
              style={styles.bannerCard}
            >
              <View style={styles.bannerRow}>
                <AlertCircle size={22} color={Colors.gold} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerTitle}>{t('home.completeProfile')}</Text>
                  <Text style={styles.bannerSub}>{t('home.completeProfileSub')}</Text>
                </View>
                <ChevronRight size={18} color={Colors.gold} />
              </View>
            </PressableCard>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(35).duration(400)}>
          <ActivePositionSelector
            positions={playerPositions}
            activePosition={playerPosition}
            onSelect={(nextPosition) => {
              selectPosition(nextPosition);
              refreshDev();
            }}
          />
        </Animated.View>

        {/* Today's Handball IQ */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <PressableCard
            onPress={() => router.push('/(tabs)/progress')}
            variant="gradient"
            padding={0}
            style={styles.heroCard}
          >
            <LinearGradient
              colors={['rgba(212,175,55,0.16)', 'rgba(212,175,55,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <Text style={styles.sectionMicro}>{t('home.overallIq')}</Text>
              <View style={styles.heroRow}>
                <ProgressRing progress={Math.min(score, 100) / 100} size={118} strokeWidth={10}>
                  <View style={styles.ringInner}>
                    <Text style={styles.ringValue}>{iqScore == null && !score ? '—' : score}</Text>
                    <Text style={styles.ringLabel}>{t('home.overallIq').toUpperCase()}</Text>
                  </View>
                </ProgressRing>
                <View style={styles.heroMeta}>
                  <View style={styles.metaRow}>
                    <Brain size={16} color={Colors.gold} />
                    <Text style={styles.metaText}>
                      {t('home.positionIq')}: {positionIq == null ? '—' : positionIq}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Flame size={16} color={Colors.gold} />
                    <Text style={styles.metaText}>
                      {t('home.dayStreak', { n: streak?.currentStreak ?? stats.currentStreak })}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Activity size={16} color={Colors.gold} />
                    <Text style={styles.metaText}>{t('home.sessionsThisWeek', { n: sessionsThisWeek })}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </PressableCard>
        </Animated.View>

        {/* Today's Focus */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <Text style={styles.sectionLabel}>{t('home.todaysFocusLabel')}</Text>
          <Card variant="gradient" style={styles.focusCard}>
            <Text style={styles.focusText}>{focusText}</Text>
          </Card>
        </Animated.View>

        {/* Current Program */}
        {!isCoachMode && todayProgramSession ? (
          <Animated.View entering={FadeInDown.delay(95).duration(500)}>
            <Text style={styles.sectionLabel}>{t('sprint5.programs.current')}</Text>
            <PressableCard onPress={() => router.push('/programs')} variant="gradient" style={styles.focusCard}>
              <Text style={styles.focusText}>{t(todayProgramSession.objectiveKey)}</Text>
              <Text style={styles.metaText}>
                {t('sprint4.programProgress', { percent: todayProgramSession.completionPercent })}
                {todayProgramSession.isCheckpoint ? ` · ${t('sprint5.programs.checkpoint')}` : ''}
              </Text>
              <View style={[styles.metaRow, { marginTop: 8 }]}>
                <Text style={styles.sectionMicro}>{t('sprint5.programs.view')}</Text>
                <ChevronRight size={16} color={Colors.gold} />
              </View>
            </PressableCard>
          </Animated.View>
        ) : !isCoachMode ? (
          <Animated.View entering={FadeInDown.delay(95).duration(500)}>
            <PressableCard onPress={() => router.push('/programs')} variant="gradient" style={styles.focusCard}>
              <Text style={styles.focusText}>{t('sprint5.programs.recommended')}</Text>
              <Text style={styles.metaText}>{t('sprint5.programs.view')}</Text>
            </PressableCard>
          </Animated.View>
        ) : null}

        {/* Recommended Session */}
        {!isCoachMode && (
          <Animated.View entering={FadeInDown.delay(110).duration(500)}>
            <Text style={styles.sectionLabel}>{recommendation.title}</Text>
            <PressableCard onPress={startRecommended} variant="gradient" padding={0} style={styles.ctaCard}>
              <LinearGradient
                colors={['rgba(212,175,55,0.14)', 'rgba(212,175,55,0.03)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <View style={styles.ctaIcon}>
                  <Zap size={22} color={Colors.gold} />
                </View>
                <Text style={styles.ctaTitle}>{t('home.startSession')}</Text>
                <Text style={styles.ctaSub}>{recommendation.subtitle}</Text>
                <TouchableOpacity
                  testID="home-start-session-cta"
                  style={styles.ctaBtn}
                  activeOpacity={0.85}
                  onPress={startRecommended}
                >
                  <LinearGradient colors={Colors.goldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaBtnGradient}>
                    <Text style={styles.ctaBtnText}>{t('home.startSession')}</Text>
                    <ArrowRight size={18} color={Colors.background} />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </PressableCard>
          </Animated.View>
        )}

        {/* Daily Challenge */}
        {!isCoachMode && (
          <Animated.View entering={FadeInDown.delay(140).duration(500)}>
            <Text style={styles.sectionLabel}>{t('home.dailyChallenge')}</Text>
            <PressableCard
              testID="home-daily-challenge-card"
              onPress={() => {
                clearActiveTrainingSession();
                setSessionIntent({ position: playerPosition ?? undefined });
                setSessionMode('daily_challenge');
                router.push('/session');
              }}
              variant="gradient"
              style={styles.linkCard}
            >
              <View style={styles.linkRow}>
                <View style={styles.linkIcon}>
                  <Sun size={20} color={Colors.gold} />
                </View>
                <View style={styles.linkTextCol}>
                  <Text style={styles.linkTitle}>{dailyTitle}</Text>
                  <Text style={styles.linkSub}>
                    {t('home.dailyChallengeSub')}
                  </Text>
                </View>
                <View style={styles.linkChevronWrap}>
                  <ChevronRight size={18} color={Colors.gold} />
                </View>
              </View>
            </PressableCard>
          </Animated.View>
        )}

        {/* Weekly Goal + Streak + Recent Improvement */}
        {!isCoachMode && dailyGoals ? (
          <Animated.View entering={FadeInDown.delay(160).duration(500)}>
            <Text style={styles.sectionLabel}>{t('sprint4.weeklyGoals')}</Text>
            <Card variant="gradient" style={styles.focusCard}>
              <Text style={styles.focusText}>
                {t('sprint4.goalsCompleted', {
                  done: weeklyGoalSummary.completed,
                  total: weeklyGoalSummary.completed + weeklyGoalSummary.remaining,
                })}
              </Text>
            </Card>
          </Animated.View>
        ) : null}

        <Animated.View entering={FadeInDown.delay(170).duration(500)} style={styles.twoCol}>
          <Card variant="gradient" style={styles.statHalf}>
            <Text style={styles.statLabel}>{t('sprint4.currentStreak', { n: devStreak?.currentStreak ?? streak?.currentStreak ?? 0 })}</Text>
            <Text style={styles.statValue}>{devStreak?.currentStreak ?? streak?.currentStreak ?? 0}</Text>
            <Text style={styles.statHint}>{t('home.sessionsThisWeek', { n: sessionsThisWeek })}</Text>
          </Card>
          <Card variant="gradient" style={styles.statHalf}>
            <Text style={styles.statLabel}>{t('sprint5.recentImprovement')}</Text>
            <View style={styles.trendRow}>
              <TrendingUp size={18} color={Colors.gold} />
              <Text style={styles.statHint}>
                {trend === 0
                  ? t('sprint5.recentImprovementFlat')
                  : t('sprint5.recentImprovementValue', { n: trend })}
              </Text>
            </View>
          </Card>
        </Animated.View>

        {/* Weakest / Strongest */}
        {!isCoachMode && (
          <Animated.View entering={FadeInDown.delay(190).duration(500)} style={styles.twoCol}>
            <Card variant="gradient" style={styles.statHalf}>
              <Text style={styles.statLabel}>{t('home.weakestSkill')}</Text>
              <Text style={styles.statHint}>{weakestLabel}</Text>
            </Card>
            <Card variant="gradient" style={styles.statHalf}>
              <Text style={styles.statLabel}>{t('home.strongestSkill')}</Text>
              <Text style={styles.statHint}>{strongestLabel}</Text>
            </Card>
          </Animated.View>
        )}

        {/* Development Goal */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('home.developmentGoal')}</Text>
          <Card variant="gradient" style={styles.focusCard}>
            <View style={styles.metaRow}>
              <Target size={18} color={Colors.gold} />
              <Text style={styles.focusText}>{upcomingGoal}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Recommended Session */}
        <Animated.View entering={FadeInDown.delay(230).duration(500)}>
          <Text style={styles.sectionLabel}>{t('home.recommendedSession')}</Text>
          <PressableCard
            onPress={startRecommended}
            variant="gradient"
            style={styles.linkCard}
          >
            <View style={styles.linkRow}>
              <View style={styles.linkIcon}>
                <Brain size={20} color={Colors.gold} />
              </View>
              <View style={styles.linkTextCol}>
                <Text style={styles.linkTitle}>{recommendation.title}</Text>
                <Text style={styles.linkSub}>{recommendation.subtitle}</Text>
              </View>
              <View style={styles.linkChevronWrap}>
                <ChevronRight size={18} color={Colors.gold} />
              </View>
            </View>
          </PressableCard>
        </Animated.View>

        {/* Soft links — last Home section before bottom spacer */}
        <Animated.View
          entering={FadeInDown.delay(260).duration(500)}
          style={styles.softLinks}
          testID="home-final-cta"
        >
          <PressableCard onPress={() => router.push('/team-calendar' as never)} variant="gradient" style={styles.softCard}>
            <CalendarDays size={18} color={Colors.gold} />
            <Text style={styles.softText}>{t('teamCalendar.title')}</Text>
          </PressableCard>
          <PressableCard onPress={() => router.push('/notifications' as never)} variant="gradient" style={styles.softCard}>
            <Bell size={18} color={Colors.gold} />
            <Text style={styles.softText}>{t('notifications.title')}</Text>
            {unreadNotifications > 0 ? (
              <Text style={styles.softBadge}>{unreadNotifications > 99 ? '99+' : unreadNotifications}</Text>
            ) : null}
          </PressableCard>
          <PressableCard onPress={() => router.push('/match/intro')} variant="gradient" style={styles.softCard}>
            <Shield size={18} color={Colors.gold} />
            <Text style={styles.softText}>{t('home.playMatch')}</Text>
          </PressableCard>
          <PressableCard onPress={() => router.push('/coach')} variant="gradient" style={styles.softCard}>
            <Brain size={18} color={Colors.gold} />
            <Text style={styles.softText}>{t('home.aiCoach')}</Text>
          </PressableCard>
          {showCoachDashboard && (
            <PressableCard onPress={() => router.push('/coach-dashboard')} variant="gradient" style={styles.softCard}>
              <Users size={18} color={Colors.gold} />
              <Text style={styles.softText}>{t('home.coachDashboard')}</Text>
            </PressableCard>
          )}
        </Animated.View>
        </>
        )}

        {/*
          Explicit spacer — RN-web ScrollView has dropped contentContainerStyle.paddingBottom
          from scroll extent, leaving the last CTA under the tab bar. Height = measured tab
          bar + visual gap via useTabScreenBottomPadding().
        */}
        <View testID="home-bottom-spacer" style={{ height: tabBottomPad }} collapsable={false} />
      </ScrollView>
    </ScreenBackground>
  );
}

function createStyles() {
  return StyleSheet.create({
    scroll: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xxxl + 16,
      // Bottom clearance via home-bottom-spacer (measured tab bar + gap)
      width: '100%',
      maxWidth: '100%',
    },
    greeting: {
      ...Typography.h1,
      fontFamily: 'Inter-ExtraBold',
      color: Colors.textPrimary,
      fontSize: 28,
      lineHeight: 34,
    },
    greetingSub: {
      ...Typography.bodySmall,
      color: Colors.gold,
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      marginTop: 2,
      marginBottom: Spacing.sm,
      letterSpacing: 0.5,
    },
    modeRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    modeChip: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
    },
    modeChipActive: {
      borderColor: Colors.gold,
      backgroundColor: Colors.goldSoft,
    },
    modeChipText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 13,
      color: Colors.textTertiary,
    },
    modeChipTextActive: {
      color: Colors.gold,
    },
    completionWrap: {
      marginTop: Spacing.lg,
      padding: Spacing.xl,
      gap: Spacing.md,
      alignItems: 'center',
      backgroundColor: Colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: Colors.gold,
    },
    completionTitle: {
      fontFamily: 'Inter-ExtraBold',
      fontSize: 20,
      color: Colors.textPrimary,
      textAlign: 'center',
      lineHeight: 28,
    },
    completionBody: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
      marginBottom: Spacing.sm,
    },
    bannerCard: { marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.gold },
    bannerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    bannerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
    bannerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
    heroCard: { overflow: 'hidden', marginBottom: Spacing.lg },
    heroGradient: { borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md },
    sectionMicro: {
      color: Colors.gold,
      fontFamily: 'Inter-ExtraBold',
      fontSize: 10,
      letterSpacing: 2,
    },
    heroRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
    ringInner: { alignItems: 'center', justifyContent: 'center' },
    ringValue: { fontFamily: 'Inter-ExtraBold', fontSize: 34, color: Colors.textPrimary, lineHeight: 38 },
    ringLabel: { fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.gold, letterSpacing: 1.5 },
    heroMeta: { flex: 1, gap: Spacing.sm },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    metaText: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 14, flex: 1 },
    sectionLabel: {
      ...Typography.micro,
      color: Colors.textTertiary,
      fontFamily: 'Inter-SemiBold',
      letterSpacing: 1.5,
      marginBottom: Spacing.sm,
    },
    focusCard: { marginBottom: Spacing.lg, padding: Spacing.lg },
    focusText: { color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15, lineHeight: 22, flex: 1 },
    ctaCard: { overflow: 'hidden', marginBottom: Spacing.lg },
    ctaGradient: { borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm },
    ctaIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: Colors.goldSoft,
      borderWidth: 1,
      borderColor: Colors.gold,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    ctaTitle: {
      fontFamily: 'Inter-ExtraBold',
      fontSize: 22,
      color: Colors.textPrimary,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    ctaSub: {
      color: Colors.textSecondary,
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      marginBottom: Spacing.sm,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    ctaBtn: { borderRadius: Radius.lg, overflow: 'hidden', alignSelf: 'stretch' },
    ctaBtnGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      paddingVertical: 14,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.lg,
      flexWrap: 'wrap',
    },
    ctaBtnText: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.background, flexShrink: 1 },
    linkCard: { marginBottom: Spacing.lg, width: '100%', maxWidth: '100%', overflow: 'hidden', alignSelf: 'stretch' },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: Spacing.md,
      width: '100%',
      maxWidth: '100%',
    },
    linkIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: Colors.goldSoft,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    linkTextCol: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 160,
      minWidth: 0,
      maxWidth: '100%',
    },
    linkTitle: {
      fontFamily: 'Inter-ExtraBold',
      fontSize: 16,
      color: Colors.textPrimary,
      flexShrink: 1,
      maxWidth: '100%',
      width: '100%',
    },
    linkSub: {
      color: Colors.textTertiary,
      fontFamily: 'Inter-Regular',
      fontSize: 13,
      marginTop: 2,
      flexShrink: 1,
      maxWidth: '100%',
      width: '100%',
    },
    linkChevronWrap: {
      flexShrink: 0,
      marginTop: 4,
    },
    twoCol: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg, width: '100%' },
    statHalf: { flex: 1, minWidth: 0, padding: Spacing.md, gap: 6, overflow: 'hidden' },
    statLabel: {
      color: Colors.textTertiary,
      fontFamily: 'Inter-SemiBold',
      fontSize: 11,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      flexShrink: 1,
    },
    statValue: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.textPrimary },
    statHint: {
      color: Colors.textSecondary,
      fontFamily: 'Inter-Medium',
      fontSize: 13,
      flexShrink: 1,
      flexWrap: 'wrap',
    },
    trendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
    statExtra: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 4 },
    softLinks: { gap: Spacing.sm, width: '100%', paddingBottom: Spacing.sm },
    softCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
    },
    softText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 15,
      color: Colors.textPrimary,
      flex: 1,
      flexShrink: 1,
      minWidth: 0,
      flexWrap: 'wrap',
    },
    softBadge: { minWidth: 25, paddingHorizontal: 7, paddingVertical: 4, borderRadius: Radius.pill, overflow: 'hidden', textAlign: 'center', fontFamily: 'Inter-ExtraBold', fontSize: 10, color: Colors.background, backgroundColor: Colors.gold },
  });
}
