import { useMemo, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Brain, Zap, ArrowRight, Target, Shield, Crosshair, Users, Clock,
  ChevronRight, Library, MapPin,
} from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { loadSessions } from '@/lib/storage';
import { computePlayerStats } from '@/lib/player-stats';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition, translateDifficulty, translateCategory } from '@/lib/translations';
import { useDevelopment } from '@/hooks/useDevelopment';
import { getTodayDayIndex, setSessionMode } from '@/lib/development';
import { setSessionIntent } from '@/lib/development/session-intent';
import { clearActiveTrainingSession } from '@/lib/development/active-session';
import { localizeContent } from '@/lib/content-localize';
import { resolveContent, filterResolvedScenarios, resolveRecommendedScenarios } from '@/lib/platform/content-resolver';
import { getActiveMode } from '@/lib/platform/active-mode';
import { getPositionModule, isHandballPosition } from '@/lib/platform/position-modules';
import { loadProfile } from '@/lib/storage';
import type { ScenarioCategory } from '@/content/scenario-bank/types';
import { resolvePlayerPosition } from '@/lib/platform/resolve-position';
import type { HandballPosition } from '@/lib/positions';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Zap, ArrowRight, Target, Shield, Crosshair, Users, Clock,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: Colors.success,
  Intermediate: Colors.info,
  Advanced: Colors.warning,
  Expert: Colors.error,
};

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const SESSION_SCENARIO_COUNT = 5;
const SESSION_DURATION_MIN = 10;

export default function TrainingScreen() {
  const { t, lang } = useTranslation();
  const profile = loadProfile();
  const primaryPosition = resolvePlayerPosition(profile);
  const availablePositions = [profile.position, profile.secondaryPosition]
    .filter((value): value is HandballPosition => isHandballPosition(value));
  const [selectedPosition, setSelectedPosition] = useState<HandballPosition | null>(primaryPosition);
  const position = selectedPosition && availablePositions.includes(selectedPosition)
    ? selectedPosition
    : primaryPosition;
  const effectiveProfile = useMemo(
    () => ({ ...profile, position: position ?? profile.position }),
    [profile, position],
  );
  const resolved = useMemo(
    () => resolveContent({ profile: effectiveProfile, activeMode: getActiveMode() }),
    [effectiveProfile],
  );
  const categories = resolved.training.categories;
  const dailySession = resolved.training.dailySession;
  const sessions = loadSessions();
  const stats = useMemo(() => computePlayerStats(sessions), [sessions.length]);

  const [filterCategory, setFilterCategory] = useState<ScenarioCategory | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  const bankCategories = useMemo(() => {
    const mod = position ? getPositionModule(position) : null;
    if (!mod) return [] as ScenarioCategory[];
    return [...mod.primaryCategories, ...mod.secondaryCategories.filter((c) => !mod.primaryCategories.includes(c))];
  }, [position]);

  const recommendedPool = useMemo(() => {
    if (!position) return [];
    return resolveRecommendedScenarios(position, effectiveProfile, 12);
  }, [position, effectiveProfile]);

  const filteredCount = useMemo(() => {
    return filterResolvedScenarios(recommendedPool, {
      category: filterCategory ?? undefined,
      difficulty: filterDifficulty ?? undefined,
    }).length;
  }, [recommendedPool, filterCategory, filterDifficulty]);

  const categoryProgress = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of categories) {
      const related = sessions.filter((s) =>
        s.sessionName.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0] ?? ''),
      );
      map[cat.id] = related.length > 0
        ? Math.min(100, Math.round(related.reduce((sum, s) => sum + s.decisionScore, 0) / related.length))
        : 0;
    }
    return map;
  }, [categories, sessions]);

  const { weeklyProgram } = useDevelopment();
  const todayIndex = getTodayDayIndex();
  const overallCompletion = stats.completionRate;

  const startSession = (opts?: { category?: string; difficulty?: string; scenarioIds?: string[] }) => {
    // New session — drop any in-progress pool so resume does not reuse a finished set
    clearActiveTrainingSession();
    setSessionMode('standard');
    setSessionIntent({
      category: opts?.category ?? filterCategory ?? undefined,
      difficulty: opts?.difficulty ?? filterDifficulty ?? undefined,
      scenarioIds: opts?.scenarioIds ?? resolved.training.scenarioIds,
    });
    router.push('/session');
  };

  if (!position) {
    return (
      <ScreenBackground>
        <View style={[styles.scroll, { paddingTop: Spacing.xxxl + 40, gap: Spacing.md }]}>
          <Text style={styles.headerTitle} testID="training-complete-profile-title">
            {t('home.completeProfileTitle')}
          </Text>
          <Text style={styles.headerSub}>{t('home.completeProfileBody')}</Text>
          <PressableCard onPress={() => router.push('/(auth)/onboarding')} variant="gradient">
            <Text style={styles.featuredTitle}>{t('home.setupProfileCta')}</Text>
          </PressableCard>
        </View>

        {availablePositions.length > 1 ? (
          <Animated.View entering={FadeInDown.delay(20).duration(500)}>
            <Text style={styles.sectionLabel}>{t('training.position')}</Text>
            <View style={styles.filterRow}>
              {availablePositions.map((playerPosition) => (
                <FilterChip
                  key={playerPosition}
                  label={translatePosition(playerPosition, t)}
                  active={position === playerPosition}
                  onPress={() => {
                    setSelectedPosition(playerPosition);
                    setFilterCategory(null);
                    setFilterDifficulty(null);
                  }}
                />
              ))}
            </View>
          </Animated.View>
        ) : null}
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}><Library size={20} color={Colors.gold} /></View>
            <View>
              <Text style={styles.headerTitle}>{t('training.title')}</Text>
              <Text style={styles.headerSub}>{translatePosition(position, t)} · {t('training.subtitle')}</Text>
            </View>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(40).duration(500)}>
          <Text style={styles.sectionLabel}>{t('training.focusLabel')}</Text>
          <Text style={styles.focusText}>{t(resolved.training.focusKey)}</Text>
        </Animated.View>

        {/* Manual filters */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <Text style={styles.sectionLabel}>{t('training.filters')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            <FilterChip
              label={t('training.filterAll')}
              active={!filterCategory && !filterDifficulty}
              onPress={() => {
                setFilterCategory(null);
                setFilterDifficulty(null);
              }}
            />
            {bankCategories.map((cat) => (
              <FilterChip
                key={cat}
                label={translateCategory(cat, t)}
                active={filterCategory === cat}
                onPress={() => setFilterCategory(filterCategory === cat ? null : cat)}
              />
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {DIFFICULTIES.map((d) => (
              <FilterChip
                key={d}
                label={translateDifficulty(d, t)}
                active={filterDifficulty === d}
                onPress={() => setFilterDifficulty(filterDifficulty === d ? null : d)}
              />
            ))}
          </ScrollView>
          {(filterCategory || filterDifficulty) && (
            <Text style={styles.filterHint}>
              {filteredCount} · {t('training.scenariosCount', { n: filteredCount || SESSION_SCENARIO_COUNT })}
            </Text>
          )}
        </Animated.View>

        {/* Weekly Program */}
        <Animated.View entering={FadeInDown.delay(60).duration(500)}>
          <SectionLabel label={t('dev.weeklyProgram')} />
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyTop}>
              <Text style={styles.weeklyScoreLabel}>{t('dev.weeklyScore')}</Text>
              <Text style={styles.weeklyScoreValue}>{weeklyProgram.weeklyScore || '—'}%</Text>
            </View>
            <Text style={styles.weeklyProgress}>
              {t('dev.daysCompleted', { n: weeklyProgram.daysCompleted, total: 7 })}
            </Text>
            <View style={styles.weekDaysRow}>
              {weeklyProgram.days.map((day) => (
                <View key={day.dayIndex} style={styles.weekDayCol}>
                  <View
                    style={[
                      styles.weekDayDot,
                      day.completed && styles.weekDayDotDone,
                      day.dayIndex === todayIndex && styles.weekDayDotToday,
                    ]}
                  />
                  <Text style={[styles.weekDayLabel, day.dayIndex === todayIndex && styles.weekDayLabelToday]}>
                    {day.label}
                  </Text>
                </View>
              ))}
            </View>
            {weeklyProgram.days[todayIndex] && (
              <Text style={styles.weeklyTodayFocus}>
                {t('dev.todayFocus')}: {weeklyProgram.days[todayIndex].focus}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Overall progress */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <View style={styles.progressSummary}>
            <View style={styles.progressSummaryTop}>
              <Text style={styles.progressSummaryLabel}>{t('training.yourProgress')}</Text>
              <Text style={styles.progressSummaryValue}>{overallCompletion}%</Text>
            </View>
            <ProgressBar progress={overallCompletion / 100} height={8} color={Colors.gold} />
            <View style={styles.progressMetaRow}>
              <MetaChip icon={<MapPin size={12} color={Colors.gold} />} label={translatePosition(position, t)} />
              <MetaChip icon={<Clock size={12} color={Colors.gold} />} label={t('training.estimatedDuration', { n: SESSION_DURATION_MIN })} />
              <MetaChip icon={<Target size={12} color={Colors.gold} />} label={t('training.scenariosCount', { n: SESSION_SCENARIO_COUNT })} />
            </View>
          </View>
        </Animated.View>

        {/* Recommended Session */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <SectionLabel label={t('training.recommendedForYou')} />
          <PressableCard
            onPress={() => startSession({ scenarioIds: resolved.training.scenarioIds })}
            variant="gradient"
            padding={0}
            shadow="cardLg"
            style={styles.featuredCard}
          >
            <View style={styles.featuredInner}>
              <View style={styles.featuredLeft}>
                <View style={styles.featuredIcon}><Brain size={24} color={Colors.gold} /></View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle}>
                    {t(resolved.training.recommendedTitleKey, { n: resolved.training.recommendedCount })}
                  </Text>
                  <View style={styles.featuredMetaGrid}>
                    <Text style={styles.featuredMeta}>
                      {t('training.difficulty')}: {translateDifficulty(resolved.training.difficulty, t)}
                    </Text>
                    <Text style={styles.featuredMeta}>
                      {t('training.duration')}: {t('training.estimatedDuration', { n: SESSION_DURATION_MIN })}
                    </Text>
                    <Text style={styles.featuredMeta}>{t('training.position')}: {translatePosition(position, t)}</Text>
                    <Text style={styles.featuredMeta}>{t('training.scenariosCount', { n: SESSION_SCENARIO_COUNT })}</Text>
                    {dailySession ? (
                      <Text style={styles.featuredMeta}>{localizeContent(dailySession.title, lang, t)}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
              <View style={styles.featuredBtn}>
                <Text style={styles.featuredBtnText}>{t('training.startRecommended')}</Text>
                <ChevronRight size={16} color={Colors.background} />
              </View>
            </View>
          </PressableCard>
        </Animated.View>

        <SectionLabel label={t('training.chooseCategory')} />
        <View style={styles.categoryList}>
          {categories.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] ?? Target;
            const diffColor = DIFFICULTY_COLORS[cat.difficulty] ?? Colors.info;
            const progress = categoryProgress[cat.id] ?? 0;
            return (
              <Animated.View key={cat.id} entering={FadeInDown.delay(150 + i * 60).duration(400)}>
                <PressableCard
                  onPress={() => startSession({
                    category: filterCategory ?? undefined,
                    difficulty: filterDifficulty ?? cat.difficulty,
                  })}
                  variant="gradient"
                  shadow="card"
                  style={styles.categoryCard}
                >
                  <View style={styles.categoryRow}>
                    <View style={styles.categoryIcon}>
                      <Icon size={22} color={Colors.gold} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{localizeContent(cat.name, lang, t)}</Text>
                      <Text style={styles.categoryDesc} numberOfLines={1}>{localizeContent(cat.description, lang, t)}</Text>
                      <View style={styles.categoryMeta}>
                        <View style={[styles.diffBadge, { backgroundColor: diffColor + '20', borderColor: diffColor }]}>
                          <Text style={[styles.diffText, { color: diffColor }]}>{translateDifficulty(cat.difficulty, t).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.scenarioCount}>{t('training.scenariosCount', { n: cat.scenarioCount })}</Text>
                        <Text style={styles.durationText}>{t('training.estimatedDuration', { n: Math.max(5, Math.round(cat.scenarioCount * 2)) })}</Text>
                      </View>
                      <View style={styles.catProgressRow}>
                        <Text style={styles.catProgressLabel}>{t('training.completion')}</Text>
                        <Text style={styles.catProgressValue}>{progress}%</Text>
                      </View>
                      <ProgressBar progress={progress / 100} height={5} color={Colors.gold} />
                    </View>
                    <ChevronRight size={18} color={Colors.textTertiary} />
                  </View>
                </PressableCard>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.filterChip, active && styles.filterChipActive]}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function MetaChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.metaChip}>
      {icon}
      <Text style={styles.metaChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 1 },
  focusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },

  filterRow: { gap: Spacing.sm, paddingBottom: Spacing.sm },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  filterChipText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },
  filterChipTextActive: { color: Colors.gold },
  filterHint: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.textTertiary, marginBottom: Spacing.md },

  progressSummary: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  progressSummaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressSummaryLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  progressSummaryValue: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.gold },
  progressMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xs },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  metaChipText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold },

  weeklyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  weeklyTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weeklyScoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  weeklyScoreValue: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.gold },
  weeklyProgress: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13 },
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  weekDayCol: { alignItems: 'center', gap: 4 },
  weekDayDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.hairline },
  weekDayDotDone: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  weekDayDotToday: { borderWidth: 2, borderColor: Colors.gold },
  weekDayLabel: { fontFamily: 'Inter-Medium', fontSize: 10, color: Colors.textTertiary },
  weekDayLabelToday: { color: Colors.gold, fontFamily: 'Inter-SemiBold' },
  weeklyTodayFocus: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.gold, marginTop: Spacing.xs },

  featuredCard: { marginBottom: Spacing.lg, overflow: 'hidden' },
  featuredInner: { padding: Spacing.lg, gap: Spacing.md },
  featuredLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  featuredIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  featuredInfo: { flex: 1, gap: 6 },
  featuredTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  featuredMetaGrid: { gap: 2 },
  featuredMeta: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },
  featuredBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 14, borderRadius: Radius.pill, minHeight: 48 },
  featuredBtnText: { color: Colors.background, fontFamily: 'Inter-ExtraBold', fontSize: 15 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm },

  categoryList: { gap: Spacing.sm },
  categoryCard: { padding: Spacing.md },
  categoryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  categoryIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  categoryInfo: { flex: 1, gap: 4 },
  categoryName: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  categoryDesc: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12 },
  categoryMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.sm, marginTop: 4 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm, borderWidth: 1 },
  diffText: { fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 0.5 },
  scenarioCount: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12 },
  durationText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 12 },
  catProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  catProgressLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textQuaternary, letterSpacing: 0.5 },
  catProgressValue: { fontFamily: 'Inter-ExtraBold', fontSize: 11, color: Colors.gold },
});
