import { useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  User, Globe, Edit3, X, Check,
  Flame, Calendar, Activity, ChevronRight, Award, Target, Bell, Palette,
} from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { WebAvatarPicker } from '@/components/WebAvatarPicker';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { useDevAuth } from '@/context/DevAuthContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSignOut } from '@/hooks/useSignOut';
import {
  loadProfile, saveProfile, loadSessions, loadStreak, loadMatchHistory,
  UserProfile, SessionRecord, StreakData,
} from '@/lib/storage';
import { migrateLocalProfileToV2 } from '@/lib/platform/migrate-profile';
import {
  AppRole,
  PLAYING_LEVELS_V2,
  PLAYER_GOALS_V2,
  COACH_TYPES_V2,
  EXPERIENCE_BANDS,
  DEFENSE_SYSTEMS_V2,
  ATTACK_STYLES_V2,
  DEFENSE_LABEL_KEYS,
  ATTACK_LABEL_KEYS,
  defenseLabelKey,
  attackLabelKey,
  COACH_GOALS_V2,
  COUNTRIES,
  PlayingLevelId,
  PlayerGoalId,
  CoachTypeId,
  ExperienceBand,
  DefenseSystemId,
  AttackStyleId,
  CoachGoalId,
} from '@/lib/platform/types';
import { ALL_POSITIONS, DominantHand } from '@/lib/positions';
import { computePlayerStats } from '@/lib/player-stats';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { fetchSessionResults, sessionResultToRecord } from '@/services/sessionService';
import { useTranslation } from '@/hooks/useTranslation';
import { localeTagForLanguage } from '@/lib/locale';
import { translateStoredActivityTitle, translatePosition, translateHand } from '@/lib/translations';
import { useDevelopment } from '@/hooks/useDevelopment';
import { ProgressBar } from '@/components/Screen';
import { AchievementDetail } from '@/components/AchievementDetail';
import { useMode } from '@/context/ModeContext';
import { pullPreferencesFromCloud, syncPreferencesToCloud } from '@/services/preferencesService';
import { removeProfileAvatar, resolveAvatarUrl, uploadProfileAvatar, type AvatarErrorCode } from '@/services/avatarService';

const HAND_OPTIONS: DominantHand[] = ['Left', 'Right'];
const ROLE_OPTIONS: Exclude<AppRole, 'admin'>[] = ['player', 'coach', 'player_coach'];

const LEVEL_KEYS: Record<PlayingLevelId, string> = {
  Beginner: 'playingLevel.beginner',
  Youth: 'level.youth',
  Junior: 'level.junior',
  Senior: 'level.senior',
  Professional: 'playingLevel.professional',
};

const GOAL_KEYS: Record<PlayerGoalId, string> = {
  'Decision Making': 'devGoal.decisionMaking',
  'Game Intelligence': 'goal.gameIntelligence',
  Defence: 'goal.defence',
  Attack: 'goal.attack',
  'Mental Preparation': 'devGoal.mentalPreparation',
  'Match Preparation': 'goal.matchPreparation',
  Leadership: 'goal.leadership',
  'Complete Development': 'goal.completeDevelopment',
};

const COACH_TYPE_KEYS: Record<CoachTypeId, string> = {
  'Youth Coach': 'coachType.youth',
  'Senior Coach': 'coachType.senior',
  'Professional Coach': 'coachType.professional',
  'Goalkeeper Coach': 'coachType.goalkeeper',
  'Assistant Coach': 'coachType.assistant',
  'Head Coach': 'coachType.head',
};

const EXPERIENCE_KEYS: Record<ExperienceBand, string> = {
  '0-2': 'experience.0_2',
  '3-5': 'experience.3_5',
  '6-10': 'experience.6_10',
  '10+': 'experience.10_plus',
};

const COACH_GOAL_KEYS: Record<CoachGoalId, string> = {
  Tactics: 'coachGoal.tactics',
  Leadership: 'coachGoal.leadership',
  'Player Development': 'coachGoal.playerDevelopment',
  'Training Planning': 'coachGoal.trainingPlanning',
  'Match Analysis': 'coachGoal.matchAnalysis',
  'Complete Development': 'coachGoal.complete',
};

const ROLE_LABEL_KEYS: Record<Exclude<AppRole, 'admin'>, string> = {
  player: 'onboarding.v2.player',
  coach: 'onboarding.v2.coach',
  player_coach: 'onboarding.v2.playerCoach',
};

const THEME_LABEL_KEYS: Record<string, string> = {
  light: 'settings.themeLight',
  dark: 'settings.themeDark',
  system: 'settings.themeSystem',
};

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function roleLabel(role: string | null | undefined, t: TranslateFn): string {
  if (role === 'player' || role === 'coach' || role === 'player_coach') return t(ROLE_LABEL_KEYS[role]);
  return t('common.notSet');
}

function goalLabel(goal: string | null | undefined, t: TranslateFn): string {
  if (!goal) return t('common.notSet');
  if (goal in GOAL_KEYS) return t(GOAL_KEYS[goal as PlayerGoalId]);
  if (goal in COACH_GOAL_KEYS) return t(COACH_GOAL_KEYS[goal as CoachGoalId]);
  return goal;
}

function goalsLabel(goals: string[] | undefined, fallback: string | null | undefined, t: TranslateFn): string {
  const values = goals?.length ? goals : fallback ? [fallback] : [];
  return values.length ? values.map((goal) => goalLabel(goal, t)).join(' · ') : t('common.notSet');
}

function positionsLabel(primary: string | null | undefined, secondary: string | null | undefined, t: TranslateFn): string {
  const positions = [primary, secondary].filter((position): position is string => Boolean(position));
  return positions.length ? positions.map((position) => translatePosition(position, t)).join(' · ') : t('common.notSet');
}

function levelLabel(level: string | null | undefined, t: TranslateFn): string {
  if (!level) return t('common.notSet');
  if (level in LEVEL_KEYS) return t(LEVEL_KEYS[level as PlayingLevelId]);
  return level;
}

function isCoachRole(role: string | null | undefined): boolean {
  return role === 'coach' || role === 'player_coach';
}

function isPlayerRole(role: string | null | undefined): boolean {
  return role === 'player' || role === 'player_coach' || !role;
}

export default function ProfileScreen() {
  const { t, lang } = useTranslation();
  const { preference } = useTheme();
  const { isDevAuthenticated } = useDevAuth();
  const signOut = useSignOut();
  const { user, profile: cloudProfile, refreshProfile } = useAuth();
  const { activeMode, canSwitch, setMode, isCoachMode } = useMode();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [matches, setMatches] = useState<ReturnType<typeof loadMatchHistory>>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const migrated = migrateLocalProfileToV2();
    setProfile(migrated);
    setStreak(loadStreak());
    setMatches(loadMatchHistory());
    if (user) {
      const remote = await fetchSessionResults();
      setSessions(remote.map(sessionResultToRecord));
    } else {
      setSessions(loadSessions());
    }
    setLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  function startEdit() {
    setProfileSaveError(null);
    setDraft(profile ? { ...profile } : null);
    setEditing(true);
  }

  async function saveEdit() {
    if (!draft || savingProfile) return;
    setSavingProfile(true);
    setProfileSaveError(null);
    saveProfile(draft);
    const savedLocal = loadProfile();
    setProfile(savedLocal);
    setDraft(savedLocal);

    if (user?.id) {
      const pushed = await syncPreferencesToCloud(user.id);
      if (pushed.error) {
        setProfileSaveError(t('profile.saveSyncFailed'));
        setSavingProfile(false);
        return;
      }
      const pulled = await pullPreferencesFromCloud(user.id);
      if (pulled.error) {
        setProfileSaveError(t('profile.saveSyncFailed'));
        setSavingProfile(false);
        return;
      }
      const confirmed = loadProfile();
      setProfile(confirmed);
      setDraft(confirmed);
    }

    setSavingProfile(false);
    setEditing(false);
  }

  function patchProfile(partial: Partial<UserProfile>) {
    const base = profile ?? loadProfile();
    const next = { ...base, ...partial };
    saveProfile(next);
    setProfile(next);
    if (user?.id) void syncPreferencesToCloud(user.id);
  }

  const avatarErrorKey = (code: AvatarErrorCode): string => {
    if (code === 'too_large') return 'profile.avatarTooLarge';
    if (code === 'invalid_type' || code === 'decode_failed') return 'profile.avatarInvalid';
    if (code === 'unsupported_platform') return 'profile.avatarWebOnly';
    return 'profile.avatarUploadFailed';
  };

  async function chooseAvatar(file: File) {
    if (!user?.id || avatarUploading) return;
    setAvatarUploading(true);
    setAvatarError(null);
    const result = await uploadProfileAvatar(user.id, file);
    if (result.error) {
      setAvatarError(t(avatarErrorKey(result.error)));
      setAvatarUploading(false);
      return;
    }
    setAvatarUrl(await resolveAvatarUrl(result.avatarPath));
    await refreshProfile();
    setAvatarUploading(false);
  }

  async function removeAvatar() {
    if (!user?.id || avatarUploading) return;
    setAvatarUploading(true);
    setAvatarError(null);
    const error = await removeProfileAvatar(user.id);
    if (error) setAvatarError(t('profile.avatarRemoveFailed'));
    await refreshProfile();
    setAvatarUploading(false);
  }

  useEffect(() => {
    let active = true;
    void resolveAvatarUrl(cloudProfile?.avatar_url ?? (user?.user_metadata?.avatar_url as string | undefined))
      .then((url) => { if (active) setAvatarUrl(url); });
    return () => { active = false; };
  }, [cloudProfile?.avatar_url, user?.user_metadata?.avatar_url]);

  const rawName = profile?.name?.trim() ?? '';
  const displayName = rawName || t('role.player');
  const avatarLetter = rawName[0]?.toUpperCase() ?? '?';
  const displayPosition = profile?.position
    ? translatePosition(profile.position, t)
    : t('onboarding.v2.position');
  const stats = computePlayerStats(sessions, matches);
  const { state: devState, achievements, levelProgress, streak: devStreak } = useDevelopment();
  const [selectedAch, setSelectedAch] = useState<string | null>(null);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const showCoachFields = isCoachRole(profile?.role);
  const showPlayerFields = isPlayerRole(profile?.role);
  const handballIqScores = [
    { label: t('iq.skill.attackIq'), value: 82 },
    { label: t('iq.skill.defenceIq'), value: 71 },
    { label: t('iq.skill.decisionMaking'), value: 80 },
    { label: t('iq.skill.gameReading'), value: 76 },
  ];

  const langLabel =
    lang === 'hr' ? t('settings.languageHr')
      : lang === 'de' ? t('settings.languageDe')
        : t('settings.languageEn');
  const themeLabel = t(THEME_LABEL_KEYS[preference] ?? 'settings.themeLight');

  if (loading) {
    return (
      <ScreenBackground>
        <LoadingState message={t('common.loading')} accessibilityLabel={t('common.loading')} />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}><User size={20} color={Colors.gold} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('profile.title')}</Text>
            <Text style={styles.headerSub}>{t('profile.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={startEdit}>
            <Edit3 size={16} color={Colors.gold} />
            <Text style={styles.editBtnText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.profileCard}>
            <WebAvatarPicker
              avatarUrl={avatarUrl}
              fallback={avatarLetter}
              uploading={avatarUploading}
              chooseLabel={t('profile.choosePhoto')}
              removeLabel={t('profile.removePhoto')}
              unavailableLabel={t('profile.avatarWebOnly')}
              onChoose={(file) => { void chooseAvatar(file); }}
              onRemove={() => { void removeAvatar(); }}
            />
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{displayName}</Text>
                <Text style={styles.profilePosition}>{displayPosition}</Text>
                {isDevAuthenticated && (
                  <View style={styles.foundingBadge}>
                    <Award size={11} color={Colors.gold} />
                    <Text style={styles.foundingText}>{t('profile.foundingMember')}</Text>
                  </View>
                )}
            </View>
            <Text style={styles.avatarHint}>{t('profile.avatarHint')}</Text>
            {avatarError ? <Text style={styles.errorText}>{avatarError}</Text> : null}
          </Card>
        </Animated.View>

        {showPlayerFields && (
          <>
            <SectionLabel label={t('profile.handballIqTitle').toUpperCase()} />
            <Animated.View entering={FadeInDown.delay(110).duration(500)}>
              <Card variant="gradient" shadow="cardLg" style={styles.iqCard}>
                <View style={styles.iqHero}>
                  <View style={styles.iqScoreRing}>
                    <Text style={styles.iqOverallValue}>78</Text>
                    <Text style={styles.iqScoreMax}>/ 100</Text>
                  </View>
                  <View style={styles.iqHeroCopy}>
                    <Text style={styles.iqOverallLabel}>{t('home.overallIq')}</Text>
                    <Text style={styles.iqOverallHint}>{t('profile.handballIqPreviewHint')}</Text>
                  </View>
                </View>
                <View style={styles.iqBars}>
                  {handballIqScores.map((score) => (
                    <View key={score.label} style={styles.iqBarItem}>
                      <View style={styles.iqBarHeader}>
                        <Text style={styles.iqScoreLabel}>{score.label}</Text>
                        <Text style={styles.iqScoreValue}>{score.value}</Text>
                      </View>
                      <View style={styles.iqBarTrack}>
                        <View style={[styles.iqBarFill, { width: `${score.value}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.iqInsightsRow}>
                  <View style={styles.iqInsightColumn}>
                    <Text style={styles.iqInsightTitle}>{t('profile.handballIqStrengths')}</Text>
                    <Text style={styles.iqInsightText}>✓ {t('profile.handballIqStrengthFinishing')}</Text>
                    <Text style={styles.iqInsightText}>✓ {t('profile.handballIqStrengthGoalkeeper')}</Text>
                  </View>
                  <View style={styles.iqInsightColumn}>
                    <Text style={styles.iqInsightTitle}>{t('profile.handballIqImprove')}</Text>
                    <Text style={styles.iqInsightText}>→ {t('profile.handballIqImproveDefence')}</Text>
                    <Text style={styles.iqInsightText}>→ {t('profile.handballIqImproveTiming')}</Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          </>
        )}

        {/* Control Center */}
        <SectionLabel label={t('profile.controlCenter').toUpperCase()} />
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.controlCard}>
            <ControlRow label={t('profile.nameLabel')} value={rawName || t('common.notSet')} onPress={startEdit} />
            <ControlRow label={t('profile.role')} value={roleLabel(profile?.role, t)} onPress={startEdit} />
            {canSwitch && (
              <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, gap: 8 }}>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary, letterSpacing: 1 }}>
                  {t('mode.switch').toUpperCase()}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setMode('player')}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: Radius.lg,
                      borderWidth: 1,
                      borderColor: activeMode === 'player' ? Colors.gold : Colors.border,
                      backgroundColor: activeMode === 'player' ? Colors.goldSoft : Colors.surface,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: activeMode === 'player' ? Colors.gold : Colors.textTertiary }}>
                      {t('mode.player')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setMode('coach')}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: Radius.lg,
                      borderWidth: 1,
                      borderColor: activeMode === 'coach' ? Colors.gold : Colors.border,
                      backgroundColor: activeMode === 'coach' ? Colors.goldSoft : Colors.surface,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: activeMode === 'coach' ? Colors.gold : Colors.textTertiary }}>
                      {t('mode.coach')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary }}>
                  {isCoachMode ? t('coachHome.title') : t('mode.player')}
                </Text>
              </View>
            )}
            {showPlayerFields && (
              <ControlRow
                label={t('profile.position')}
                value={positionsLabel(profile?.position, profile?.secondaryPosition, t)}
                onPress={startEdit}
              />
            )}
            {showPlayerFields && (
              <ControlRow
                label={t('profile.devGoal')}
                value={goalsLabel(profile?.developmentGoals, profile?.developmentGoal, t)}
                onPress={startEdit}
              />
            )}
            {showCoachFields && (
              <ControlRow
                label={t('onboarding.v2.coachGoal')}
                value={goalsLabel(profile?.coachDevelopmentGoals, profile?.coachDevelopmentGoal, t)}
                onPress={startEdit}
              />
            )}
            <ControlRow label={t('profile.club')} value={profile?.club || t('common.notSet')} onPress={startEdit} />
            <ControlRow label={t('profile.country')} value={profile?.country || t('common.notSet')} onPress={startEdit} />
            {showPlayerFields && (
              <ControlRow
                label={t('profile.dominantHand')}
                value={profile?.dominantHand ? translateHand(profile.dominantHand, t) : t('common.notSet')}
                onPress={startEdit}
              />
            )}
            {showPlayerFields && (
              <ControlRow
                label={t('profile.playingLevel')}
                value={levelLabel(profile?.playingLevel, t)}
                onPress={startEdit}
              />
            )}
            {showCoachFields && (
              <>
                <ControlRow
                  label={t('profile.experience')}
                  value={profile?.experienceBand ? t(EXPERIENCE_KEYS[profile.experienceBand as ExperienceBand] ?? 'common.notSet') : t('common.notSet')}
                  onPress={startEdit}
                />
                <ControlRow
                  label={t('profile.coachType')}
                  value={profile?.coachType ? t(COACH_TYPE_KEYS[profile.coachType as CoachTypeId] ?? 'common.notSet') : t('common.notSet')}
                  onPress={startEdit}
                />
                <ControlRow
                  label={t('profile.favDefence')}
                  value={profile?.favoriteDefense ? t(defenseLabelKey(profile.favoriteDefense)) : t('common.notSet')}
                  onPress={startEdit}
                />
                <ControlRow
                  label={t('profile.favAttack')}
                  value={profile?.favoriteAttack ? t(attackLabelKey(profile.favoriteAttack)) : t('common.notSet')}
                  onPress={startEdit}
                />
              </>
            )}

            <View style={styles.controlRow}>
              <View style={styles.controlLeft}>
                <Bell size={15} color={Colors.gold} />
                <Text style={styles.controlLabel}>{t('profile.notifications')}</Text>
              </View>
              <Toggle
                value={profile?.notificationsEnabled !== false}
                onToggle={() => patchProfile({ notificationsEnabled: profile?.notificationsEnabled === false })}
              />
            </View>

            <TouchableOpacity
              style={styles.controlRow}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <View style={styles.controlLeft}>
                <Palette size={15} color={Colors.gold} />
                <View>
                  <Text style={styles.controlLabel}>{t('profile.theme')}</Text>
                  <Text style={styles.controlValue}>{themeLabel}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlRow, styles.controlRowLast]}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <View style={styles.controlLeft}>
                <Globe size={15} color={Colors.gold} />
                <View>
                  <Text style={styles.controlLabel}>{t('settings.language')}</Text>
                  <Text style={styles.controlValue}>{langLabel}</Text>
                </View>
              </View>
              <ChevronRight size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </Card>
        </Animated.View>

        {/* Performance Stats */}
        <SectionLabel label={t('profile.yourStats')} />
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <StatBox label={t('profile.avgDecisionScore')} value={`${stats.avgDecisionScore}%`} />
              <StatBox label={t('profile.bestScore')} value={`${stats.bestScore}%`} highlight />
              <StatBox label={t('profile.weeklyProgress')} value={`${stats.weeklyAvgScore}%`} sub={t('profile.weeklySessions', { n: stats.weeklySessions })} />
              <StatBox label={t('profile.monthlyProgress')} value={`${stats.monthlyAvgScore}%`} sub={t('profile.monthlySessions', { n: stats.monthlySessions })} />
            </View>
            <View style={styles.favRow}>
              <Target size={16} color={Colors.gold} />
              <Text style={styles.favLabel}>{t('profile.favouritePosition')}</Text>
              <Text style={styles.favValue}>{translatePosition(stats.favouritePosition, t)}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Player Development */}
        <SectionLabel label={t('dev.playerDevelopment')} />
        <Animated.View entering={FadeInDown.delay(175).duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.devCard}>
            <View style={styles.devTop}>
              <View>
                <Text style={styles.devLevelLabel}>{t('dev.playerLevel')}</Text>
                <Text style={styles.devLevelName}>
                  {t('sprint4.levelNumber', { n: levelProgress.playerLevel })}
                  {' · '}
                  {t(`dev.level.${devState.level.toLowerCase()}`)}
                </Text>
              </View>
              <View style={styles.devXpWrap}>
                <Text style={styles.devXpValue}>{devState.totalXp}</Text>
                <Text style={styles.devXpLabel}>XP</Text>
              </View>
            </View>
            <ProgressBar progress={levelProgress.progress} height={6} color={Colors.gold} />
            <Text style={styles.devXpSub}>
              {levelProgress.next
                ? t('dev.xpToNext', { xp: levelProgress.xpNeeded, level: t(`dev.level.${levelProgress.next.toLowerCase()}`) })
                : t('dev.maxLevel')}
            </Text>
          </Card>
        </Animated.View>

        {/* Achievements */}
        <SectionLabel label={t('dev.achievements', { n: unlockedCount, total: achievements.length })} />
        <Animated.View entering={FadeInDown.delay(190).duration(500)}>
          <View style={styles.achievementGrid}>
            {achievements.map((a) => (
              <TouchableOpacity
                key={a.id}
                style={[styles.achievementItem, !a.unlocked && styles.achievementLocked]}
                onPress={() => setSelectedAch(a.id)}
              >
                <Award size={18} color={a.unlocked ? Colors.gold : Colors.textQuaternary} />
                <Text style={[styles.achievementName, !a.unlocked && styles.achievementNameLocked]} numberOfLines={2}>
                  {t(`dev.achievement.${a.id}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
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
          progressCtx={{
            sessionCount: sessions.length,
            decisionCount: devState.statistics.totalDecisions,
            streak: devStreak?.currentStreak ?? streak?.currentStreak ?? 0,
            matchCount: matches.length,
            programWeeks: devState.activeProgram?.weeksCompleted.length ?? 0,
            programsCompleted: (devState.completedPrograms ?? []).filter((p) => p.completed).length,
          }}
          onClose={() => setSelectedAch(null)}
        />

        {/* Daily Streak */}
        <SectionLabel label={t('profile.dailyStreak').toUpperCase()} />
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card variant="gradient" shadow="card" style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <View style={styles.streakIcon}><Flame size={20} color={Colors.gold} /></View>
                <Text style={styles.streakValue}>{streak?.currentStreak ?? 0}</Text>
                <Text style={styles.streakLabel}>{t('profile.currentStreak')}</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <View style={styles.streakIcon}><Award size={20} color={Colors.gold} /></View>
                <Text style={styles.streakValue}>{streak?.longestStreak ?? 0}</Text>
                <Text style={styles.streakLabel}>{t('profile.longestStreak')}</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <View style={styles.streakIcon}><Calendar size={20} color={Colors.gold} /></View>
                <Text style={styles.streakValue}>{streak?.sessionsThisWeek ?? 0}</Text>
                <Text style={styles.streakLabel}>{t('profile.thisWeek')}</Text>
              </View>
            </View>
            <View style={styles.weekDots}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={[styles.weekDot, i < (streak?.sessionsThisWeek ?? 0) && styles.weekDotActive]} />
              ))}
            </View>
            <Text style={styles.weekHint}>{t('profile.consistencyHint')}</Text>
          </Card>
        </Animated.View>

        {/* Training History */}
        <SectionLabel label={t('profile.recentActivity')} />
        {sessions.length === 0 && matches.length === 0 ? (
          <Card variant="gradient" shadow="card" style={styles.emptyCard}>
            <EmptyState
              icon={<Activity size={28} color={Colors.gold} />}
              title={t('profile.noSessions')}
              description={t('profile.noSessionsSub')}
              actionLabel={t('profile.startTraining')}
              onAction={() => router.push('/session')}
            />
          </Card>
        ) : (
          <View style={styles.historyList}>
            {stats.recentActivity.map((item, i) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(i * 60).duration(400)}>
                <Card variant="gradient" shadow="card" style={styles.historyCard}>
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIcon}>
                      <Target size={16} color={Colors.gold} />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyName}>{translateStoredActivityTitle(item.title, item.type, t)}</Text>
                      <Text style={styles.historyDate}>
                        {item.type === 'session' ? t('profile.activitySession') : t('profile.activityMatch')} ·{' '}
                        {new Date(item.date).toLocaleDateString(localeTagForLanguage(lang), { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyScore}>{item.score}%</Text>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.85} onPress={signOut}>
          <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editing} animationType="slide" transparent onRequestClose={() => setEditing(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('profile.editTitle')}</Text>
              <TouchableOpacity onPress={() => setEditing(false)}><X size={22} color={Colors.textSecondary} /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              {draft && (
                <EditForm
                  draft={draft}
                  setDraft={setDraft}
                  t={t}
                  onSave={saveEdit}
                  saving={savingProfile}
                  saveError={profileSaveError}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

function EditForm({
  draft,
  setDraft,
  t,
  onSave,
  saving,
  saveError,
}: {
  draft: UserProfile;
  setDraft: (p: UserProfile) => void;
  t: TranslateFn;
  onSave: () => void | Promise<void>;
  saving: boolean;
  saveError: string | null;
}) {
  const [goalSelectionError, setGoalSelectionError] = useState<string | null>(null);
  const [coachGoalSelectionError, setCoachGoalSelectionError] = useState<string | null>(null);
  const [positionSelectionError, setPositionSelectionError] = useState<string | null>(null);
  const showCoach = isCoachRole(draft.role);
  const showPlayer = isPlayerRole(draft.role);
  const patch = (partial: Partial<UserProfile>) => setDraft({ ...draft, ...partial });

  return (
    <>
      <InputGroup label={t('profile.nameLabel').toUpperCase()}>
        <TextInput
          style={styles.input}
          value={draft.name}
          onChangeText={(v) => patch({ name: v })}
          placeholder={t('profile.namePlaceholder')}
          placeholderTextColor={Colors.textQuaternary}
        />
      </InputGroup>

      <InputGroup label={t('profile.role').toUpperCase()}>
        <ChipGrid>
          {ROLE_OPTIONS.map((role) => (
            <Chip
              key={role}
              label={t(ROLE_LABEL_KEYS[role])}
              selected={draft.role === role}
              onPress={() => patch({ role })}
            />
          ))}
        </ChipGrid>
      </InputGroup>

      {showPlayer && (
        <InputGroup label={t('profile.position').toUpperCase()}>
          <Text style={styles.hint}>
            {t('onboarding.v2.positionHint', { n: draft.position ? (draft.secondaryPosition ? 2 : 1) : 0, max: 2 })}
          </Text>
          <ChipGrid>
            {ALL_POSITIONS.map((p) => (
              <Chip
                key={p}
                label={translatePosition(p, t)}
                selected={draft.position === p || draft.secondaryPosition === p}
                onPress={() => {
                  setPositionSelectionError(null);
                  if (draft.position === p) {
                    if (draft.secondaryPosition) {
                      patch({ position: draft.secondaryPosition, secondaryPosition: null });
                    } else {
                      setPositionSelectionError(t('onboarding.v2.positionMin'));
                    }
                  } else if (draft.secondaryPosition === p) {
                    patch({ secondaryPosition: null });
                  } else if (!draft.position) {
                    patch({ position: p });
                  } else if (!draft.secondaryPosition) {
                    patch({ secondaryPosition: p });
                  } else {
                    setPositionSelectionError(t('onboarding.v2.positionMax'));
                  }
                }}
              />
            ))}
          </ChipGrid>
          {positionSelectionError && <Text style={styles.errorText}>{positionSelectionError}</Text>}
        </InputGroup>
      )}

      {showPlayer && (
        <InputGroup label={t('onboarding.v2.devGoal').toUpperCase()}>
          <Text style={styles.hint}>{t('onboarding.v2.devGoalHint', { n: draft.developmentGoals.length, max: 3 })}</Text>
          <ChipGrid>
            {PLAYER_GOALS_V2.map((g) => (
              <Chip
                key={g}
                label={t(GOAL_KEYS[g])}
                selected={draft.developmentGoals.includes(g)}
                onPress={() => {
                  const selected = draft.developmentGoals.includes(g);
                  if (selected && draft.developmentGoals.length === 1) {
                    setGoalSelectionError(t('onboarding.v2.devGoalMin'));
                    return;
                  }
                  if (!selected && draft.developmentGoals.length === 3) {
                    setGoalSelectionError(t('onboarding.v2.devGoalMax'));
                    return;
                  }
                  const developmentGoals = selected
                    ? draft.developmentGoals.filter((goal) => goal !== g)
                    : [...draft.developmentGoals, g];
                  setGoalSelectionError(null);
                  patch({ developmentGoals, developmentGoal: developmentGoals[0] ?? null });
                }}
              />
            ))}
          </ChipGrid>
          {goalSelectionError && <Text style={styles.errorText}>{goalSelectionError}</Text>}
        </InputGroup>
      )}

      {showCoach && (
        <InputGroup label={t('onboarding.v2.coachGoal').toUpperCase()}>
          <Text style={styles.hint}>
            {t('onboarding.v2.coachGoalHint', { n: draft.coachDevelopmentGoals.length, max: 3 })}
          </Text>
          <ChipGrid>
            {COACH_GOALS_V2.map((g) => (
              <Chip
                key={g}
                label={t(COACH_GOAL_KEYS[g])}
                selected={draft.coachDevelopmentGoals.includes(g)}
                onPress={() => {
                  const selected = draft.coachDevelopmentGoals.includes(g);
                  if (selected && draft.coachDevelopmentGoals.length === 1) {
                    setCoachGoalSelectionError(t('onboarding.v2.coachGoalMin'));
                    return;
                  }
                  if (!selected && draft.coachDevelopmentGoals.length === 3) {
                    setCoachGoalSelectionError(t('onboarding.v2.coachGoalMax'));
                    return;
                  }
                  const coachDevelopmentGoals = selected
                    ? draft.coachDevelopmentGoals.filter((goal) => goal !== g)
                    : [...draft.coachDevelopmentGoals, g];
                  setCoachGoalSelectionError(null);
                  patch({
                    coachDevelopmentGoals,
                    coachDevelopmentGoal: coachDevelopmentGoals[0] ?? null,
                  });
                }}
              />
            ))}
          </ChipGrid>
          {coachGoalSelectionError && <Text style={styles.errorText}>{coachGoalSelectionError}</Text>}
        </InputGroup>
      )}

      <InputGroup label={t('profile.club').toUpperCase()}>
        <TextInput
          style={styles.input}
          value={draft.club}
          onChangeText={(v) => patch({ club: v })}
          placeholder={t('profile.clubPlaceholder')}
          placeholderTextColor={Colors.textQuaternary}
        />
      </InputGroup>

      <InputGroup label={t('profile.country').toUpperCase()}>
        <ChipGrid>
          {COUNTRIES.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={draft.country === c}
              onPress={() => patch({ country: c })}
              compact
            />
          ))}
        </ChipGrid>
      </InputGroup>

      {showPlayer && (
        <InputGroup label={t('profile.dominantHand').toUpperCase()}>
          <ChipGrid>
            {HAND_OPTIONS.map((h) => (
              <Chip
                key={h}
                label={translateHand(h, t)}
                selected={draft.dominantHand === h}
                onPress={() => patch({ dominantHand: h })}
              />
            ))}
          </ChipGrid>
        </InputGroup>
      )}

      {showPlayer && (
        <InputGroup label={t('profile.playingLevel').toUpperCase()}>
          <ChipGrid>
            {PLAYING_LEVELS_V2.map((lvl) => (
              <Chip
                key={lvl}
                label={t(LEVEL_KEYS[lvl])}
                selected={draft.playingLevel === lvl}
                onPress={() => patch({ playingLevel: lvl, experienceLevel: lvl })}
              />
            ))}
          </ChipGrid>
        </InputGroup>
      )}

      {showCoach && (
        <>
          <InputGroup label={t('profile.coachType').toUpperCase()}>
            <ChipGrid>
              {COACH_TYPES_V2.map((ct) => (
                <Chip
                  key={ct}
                  label={t(COACH_TYPE_KEYS[ct])}
                  selected={draft.coachType === ct}
                  onPress={() => patch({ coachType: ct })}
                />
              ))}
            </ChipGrid>
          </InputGroup>

          <InputGroup label={t('profile.experience').toUpperCase()}>
            <ChipGrid>
              {EXPERIENCE_BANDS.map((band) => (
                <Chip
                  key={band}
                  label={t(EXPERIENCE_KEYS[band])}
                  selected={draft.experienceBand === band}
                  onPress={() => patch({ experienceBand: band })}
                  compact
                />
              ))}
            </ChipGrid>
          </InputGroup>

          <InputGroup label={t('profile.favDefence').toUpperCase()}>
            <ChipGrid>
              {DEFENSE_SYSTEMS_V2.map((d) => (
                <Chip
                  key={d}
                  label={t(DEFENSE_LABEL_KEYS[d])}
                  selected={draft.favoriteDefense === d}
                  onPress={() => patch({ favoriteDefense: d })}
                  compact
                />
              ))}
            </ChipGrid>
          </InputGroup>

          <InputGroup label={t('profile.favAttack').toUpperCase()}>
            <ChipGrid>
              {ATTACK_STYLES_V2.map((a) => (
                <Chip
                  key={a}
                  label={t(ATTACK_LABEL_KEYS[a])}
                  selected={draft.favoriteAttack === a}
                  onPress={() => patch({ favoriteAttack: a })}
                />
              ))}
            </ChipGrid>
          </InputGroup>
        </>
      )}

      <InputGroup label={t('profile.notifications').toUpperCase()}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleRowLabel}>{t('profile.notifications')}</Text>
          <Toggle
            value={draft.notificationsEnabled !== false}
            onToggle={() => patch({ notificationsEnabled: draft.notificationsEnabled === false })}
          />
        </View>
      </InputGroup>

      <Button
        label={t('common.save')}
        onPress={() => {
          if (showPlayer && !draft.position) {
            setPositionSelectionError(t('onboarding.v2.positionMin'));
            return;
          }
          if (showPlayer && draft.developmentGoals.length === 0) {
            setGoalSelectionError(t('onboarding.v2.devGoalMin'));
            return;
          }
          if (showCoach && draft.coachDevelopmentGoals.length === 0) {
            setCoachGoalSelectionError(t('onboarding.v2.coachGoalMin'));
            return;
          }
          onSave();
        }}
        loading={saving}
        iconRight={<Check size={20} color={Colors.background} />}
      />
      {saveError && <Text style={styles.errorText}>{saveError}</Text>}
    </>
  );
}

function ControlRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.controlRow} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.controlTextCol}>
        <Text style={styles.controlLabel}>{label}</Text>
        <Text style={styles.controlValue} numberOfLines={1}>{value}</Text>
      </View>
      <ChevronRight size={16} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
}

function StatBox({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, highlight && { color: Colors.gold }]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
      {sub ? <Text style={styles.statBoxSub}>{sub}</Text> : null}
    </View>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function InputGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
  compact,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.chip, compact && styles.chipCompact, selected && styles.chipSelected]}
    >
      {selected && <Check size={14} color={Colors.gold} />}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ChipGrid({ children }: { children: ReactNode }) {
  return <View style={styles.chipGrid}>{children}</View>;
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={[styles.toggle, value && styles.toggleOn]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hint: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginBottom: Spacing.sm },
  errorText: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.error, marginTop: Spacing.sm },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 1 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.gold },
  editBtnText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13 },

  profileCard: { gap: Spacing.md, marginBottom: Spacing.sm },
  avatarHint: { fontFamily: 'Inter-Regular', fontSize: 10, lineHeight: 15, color: Colors.textTertiary },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.background },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  profilePosition: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  foundingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, backgroundColor: Colors.goldSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold, alignSelf: 'flex-start' },
  foundingText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 11 },

  iqCard: { gap: Spacing.lg, marginBottom: Spacing.sm },
  iqHero: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
  iqScoreRing: { width: 112, height: 112, borderRadius: 56, borderWidth: 8, borderColor: Colors.gold, backgroundColor: Colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  iqHeroCopy: { flex: 1, gap: 5 },
  iqOverallLabel: { color: Colors.textPrimary, fontFamily: 'Inter-ExtraBold', fontSize: 18 },
  iqOverallHint: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 18 },
  iqOverallValue: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 38, lineHeight: 40 },
  iqScoreMax: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11 },
  iqBars: { gap: Spacing.md },
  iqBarItem: { gap: 7 },
  iqBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iqScoreValue: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 14 },
  iqScoreLabel: { color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 12 },
  iqBarTrack: { height: 7, borderRadius: Radius.pill, backgroundColor: Colors.border, overflow: 'hidden' },
  iqBarFill: { height: '100%', borderRadius: Radius.pill, backgroundColor: Colors.gold },
  iqInsightsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.hairline },
  iqInsightColumn: { flex: 1, minWidth: 150, gap: 7 },
  iqInsightTitle: { color: Colors.gold, fontFamily: 'Inter-ExtraBold', fontSize: 12, letterSpacing: 0.5 },
  iqInsightText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 18 },

  controlCard: { gap: 0, paddingVertical: Spacing.xs },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.hairline,
    gap: Spacing.sm,
  },
  controlRowLast: { borderBottomWidth: 0 },
  controlLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  controlTextCol: { flex: 1, gap: 2 },
  controlLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 12 },
  controlValue: { color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 14, flexShrink: 1 },

  statsCard: { gap: Spacing.lg, marginBottom: Spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statBox: { width: '47%', gap: 4 },
  statBoxValue: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  statBoxLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 0.5 },
  statBoxSub: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textQuaternary },
  favRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.hairline },
  favLabel: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  favValue: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.gold },

  devCard: { gap: Spacing.sm },
  devTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  devLevelLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1 },
  devLevelName: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  devXpWrap: { alignItems: 'flex-end' },
  devXpValue: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.gold },
  devXpLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary },
  devXpSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12 },

  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  achievementItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  achievementLocked: { borderColor: Colors.border, opacity: 0.55 },
  achievementName: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textPrimary },
  achievementNameLocked: { color: Colors.textTertiary },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  streakCard: { gap: Spacing.md },
  streakRow: { flexDirection: 'row', alignItems: 'center' },
  streakItem: { flex: 1, alignItems: 'center', gap: 4 },
  streakIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  streakValue: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.textPrimary },
  streakLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.5, textAlign: 'center' },
  streakDivider: { width: 1, height: 50, backgroundColor: Colors.hairline },
  weekDots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  weekDot: { width: 28, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  weekDotActive: { backgroundColor: Colors.gold },
  weekHint: { color: Colors.textQuaternary, fontFamily: 'Inter-Regular', fontSize: 12, textAlign: 'center' },

  historyList: { gap: Spacing.sm },
  historyCard: { padding: Spacing.md },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  historyIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  historyInfo: { flex: 1 },
  historyName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary },
  historyDate: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  historyRight: { alignItems: 'flex-end' },
  historyScore: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.gold },

  emptyCard: { alignItems: 'center', gap: Spacing.md },

  signOutBtn: { marginTop: Spacing.xxl, paddingVertical: 16, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.error, alignItems: 'center' },
  signOutText: { color: Colors.error, fontFamily: 'Inter-ExtraBold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surfaceElevated, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, maxHeight: '90%', borderWidth: 1, borderColor: Colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  modalScroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  inputGroup: { gap: Spacing.xs },
  inputLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 14, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 16 },

  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: '46%',
    flexGrow: 1,
  },
  chipCompact: { minWidth: '30%', flexGrow: 0 },
  chipSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  chipText: { color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', fontSize: 13, flexShrink: 1 },
  chipTextSelected: { color: Colors.gold },

  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 12, borderWidth: 1, borderColor: Colors.border },
  toggleRowLabel: { color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15 },
  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: Colors.border, padding: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: Colors.gold },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.textQuaternary },
  toggleThumbOn: { backgroundColor: Colors.background, alignSelf: 'flex-end' },
});
