import { View, Text } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Brain, ChevronRight, ClipboardList, Users, Sun, BookOpen, BarChart3,
} from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import {
  resolveCoachContent,
  loadCoachDevState,
  ensureCoachTrack,
  getCoachTrack,
} from '@/lib/coach-platform';
import type { UserProfile } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';
import { useTeamPlatform } from '@/hooks/useTeamPlatform';
import { useTranslation } from '@/hooks/useTranslation';
import { useMemo } from 'react';
import { attackLabelKey, defenseLabelKey } from '@/lib/platform/tactical-systems';

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function goalLabel(goal: string | null | undefined, t: TranslateFn): string {
  if (!goal) return t('home.noGoalsYet');
  const keyMap: Record<string, string> = {
    Tactics: 'coachGoal.tactics',
    'Player Development': 'coachGoal.playerDevelopment',
    'Training Planning': 'coachGoal.trainingPlanning',
    'Match Analysis': 'coachGoal.matchAnalysis',
    Leadership: 'goal.leadership',
    'Complete Development': 'goal.completeDevelopment',
  };
  const key = keyMap[goal];
  return key ? t(key) : goal;
}

function pickLocalized(
  text: { en: string; hr: string; de: string },
  lang: string,
): string {
  if (lang === 'hr') return text.hr;
  if (lang === 'de') return text.de;
  return text.en;
}

export function CoachHome({
  profile,
  styles,
}: {
  profile: UserProfile;
  styles: Record<string, any>;
}) {
  const { t, lang } = useTranslation();
  const { user } = useAuth();
  const { team } = useTeamPlatform(user?.id, profile.name);
  const coach = resolveCoachContent(profile);
  const iq = coach.iq.overall;
  const hasIq = iq != null;
  const trackInfo = useMemo(() => {
    const state = loadCoachDevState();
    const enrollment = ensureCoachTrack(state, profile.coachDevelopmentGoal);
    const def = getCoachTrack(enrollment.trackId);
    return { enrollment, def };
  }, [profile.coachDevelopmentGoal, coach.dailyCompleted]);

  return (
    <>
      <Animated.View entering={FadeInDown.delay(50).duration(500)}>
        <Card variant="gradient" style={styles.heroCard}>
          <View style={styles.heroGradient}>
            <Text style={styles.sectionMicro}>{t('coachHome.coachIq')}</Text>
            <View style={styles.heroRow}>
              <ProgressRing progress={hasIq ? Math.min(iq, 100) / 100 : 0} size={118} strokeWidth={10}>
                <View style={styles.ringInner}>
                  <Text style={styles.ringValue}>{hasIq ? iq : '—'}</Text>
                  <Text style={styles.ringLabel}>{t('coachHome.coachIq').toUpperCase()}</Text>
                </View>
              </ProgressRing>
              <View style={styles.heroMeta}>
                {!hasIq ? (
                  <>
                    <Text style={styles.metaText}>{t('coachHome.notEnough')}</Text>
                    {coach.iq.missingActivityKeys.slice(0, 3).map((key) => (
                      <Text key={key} style={styles.statHint}>• {t(key)}</Text>
                    ))}
                  </>
                ) : (
                  <>
                    {coach.iq.strongest ? (
                      <Text style={styles.metaText}>
                        {t('home.strongestSkill')}: {t(`coachIq.skill.${coach.iq.strongest.id}`)}
                      </Text>
                    ) : null}
                    {coach.iq.weakest ? (
                      <Text style={styles.metaText}>
                        {t('home.weakestSkill')}: {t(`coachIq.skill.${coach.iq.weakest.id}`)}
                      </Text>
                    ) : null}
                  </>
                )}
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(500)}>
        <Text style={styles.sectionLabel}>{t('coachHome.developmentFocus')}</Text>
        <Card variant="gradient" style={styles.focusCard}>
          <Text style={styles.focusText}>{t(coach.focusKey)}</Text>
          <Text style={[styles.statHint, { marginTop: 8 }]}>
            {goalLabel(coach.developmentGoal, t)}
            {coach.favoriteDefense && coach.favoriteDefense !== 'none'
              ? ` · ${t(defenseLabelKey(coach.favoriteDefense))}`
              : ''}
            {coach.favoriteAttack && coach.favoriteAttack !== 'none'
              ? ` · ${t(attackLabelKey(coach.favoriteAttack))}`
              : ''}
          </Text>
          {trackInfo.def ? (
            <>
              <Text style={[styles.statHint, { marginTop: 8 }]}>
                {t(trackInfo.def.titleKey)}
                {' · '}
                {t('sprint5.coach.weekFocus', { n: trackInfo.enrollment.currentWeek })}
                {' · '}
                {t('sprint4.programProgress', { percent: trackInfo.enrollment.completionPercent })}
              </Text>
              <Text style={[styles.statHint, { marginTop: 4 }]}>
                {t('sprint5.coach.finalAssessment')}
                {' · ≥'}
                {trackInfo.def.finalAssessment.minAccuracy}%
              </Text>
            </>
          ) : null}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(110).duration(500)}>
        <Text style={styles.sectionLabel}>{t('coachHome.todaysChallenge')}</Text>
        <PressableCard
          onPress={() => router.push({ pathname: '/coach-tools/challenge', params: { id: coach.dailyChallenge.id } })}
          variant="gradient"
          style={styles.linkCard}
        >
          <View style={styles.linkRow}>
            <View style={styles.linkIcon}><Sun size={20} color={Colors.gold} /></View>
            <View style={styles.linkTextCol}>
              <Text style={styles.linkTitle}>{t(`coachChallenge.cat.${coach.dailyChallenge.category}`)}</Text>
              <Text style={styles.linkSub}>
                {pickLocalized(coach.dailyChallenge.situation, lang)}
              </Text>
              {coach.dailyCompleted ? (
                <Text style={[styles.statHint, { color: Colors.success, marginTop: 4 }]}>{t('coachChallenge.done')}</Text>
              ) : null}
            </View>
            <ChevronRight size={18} color={Colors.gold} style={styles.linkChevron} />
          </View>
        </PressableCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(140).duration(500)}>
        <Text style={styles.sectionLabel}>{t('coachHome.recommended')}</Text>
        <PressableCard
          onPress={() => router.push({ pathname: '/coach-tools/challenge', params: { id: coach.dailyChallenge.id } })}
          variant="gradient"
          style={styles.linkCard}
        >
          <View style={styles.linkRow}>
            <View style={styles.linkIcon}><Brain size={20} color={Colors.gold} /></View>
            <View style={styles.linkTextCol}>
              <Text style={styles.linkTitle}>{t(coach.recommendedSessionKey)}</Text>
              <Text style={styles.linkSub}>{t(coach.recommendedSubtitleKey)}</Text>
            </View>
            <ChevronRight size={18} color={Colors.gold} style={styles.linkChevron} />
          </View>
        </PressableCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(170).duration(500)}>
        <Text style={styles.sectionLabel}>{t('coachHome.recentLearning')}</Text>
        {coach.recentLearning.length === 0 ? (
          <Card variant="gradient" style={styles.focusCard}>
            <Text style={styles.focusText}>{t('coachHome.noRecent')}</Text>
          </Card>
        ) : (
          <Card variant="gradient" style={styles.focusCard}>
            {coach.recentLearning.map((item, i) => (
              <View key={`${item.date}-${i}`} style={[styles.metaRow, { marginBottom: 6 }]}>
                <BookOpen size={14} color={Colors.gold} />
                <Text style={styles.metaText}>{t(item.labelKey)}</Text>
              </View>
            ))}
          </Card>
        )}
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.softLinks}
        testID="home-final-cta"
      >
        <PressableCard onPress={() => router.push('/coach-tools/planner')} variant="gradient" style={styles.softCard}>
          <ClipboardList size={18} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.softText}>{t('coachHome.plannerEntry')}</Text>
            <Text style={styles.linkSub}>{t('coachHome.plannerEntrySub')}</Text>
          </View>
          <ChevronRight size={16} color={Colors.gold} />
        </PressableCard>

        <PressableCard onPress={() => router.push('/coach-tools/analysis')} variant="gradient" style={styles.softCard}>
          <BarChart3 size={18} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.softText}>{t('coachHome.analysisEntry')}</Text>
            <Text style={styles.linkSub}>{t('coachHome.analysisEntrySub')}</Text>
          </View>
          <ChevronRight size={16} color={Colors.gold} />
        </PressableCard>

        <PressableCard onPress={() => router.push('/coach-dashboard')} variant="gradient" style={styles.softCard}>
          <Users size={18} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.softText}>{t('coachHome.teamOverview')}</Text>
            <Text style={styles.linkSub}>
              {team?.name ? team.name : t('coachHome.noTeam')}
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.gold} />
        </PressableCard>
      </Animated.View>
    </>
  );
}
