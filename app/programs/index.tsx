import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Card, PressableCard } from '@/components/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { useDevelopment } from '@/hooks/useDevelopment';
import { loadProfile } from '@/lib/storage';
import {
  DEVELOPMENT_PROGRAMS,
  getEligiblePrograms,
  recommendPrograms,
  type ProgramId,
  type DevelopmentProgramDef,
} from '@/lib/development/programs';
import { isHandballPosition } from '@/lib/platform/position-modules';
import type { HandballPosition } from '@/lib/positions';
import { getWeakestSkillId } from '@/lib/development/weakness';

export default function ProgramsIndex() {
  const { t } = useTranslation();
  const { activeProgram, state } = useDevelopment();
  const completedPrograms = (state.completedPrograms ?? []).filter(
    (p) => p.completed || p.status === 'completed',
  );
  const pausedPrograms = state.pausedPrograms ?? [];
  const statistics = state.statistics;
  const profile = loadProfile();
  const position = isHandballPosition(profile.position) ? profile.position : null;
  const [filterGoal, setFilterGoal] = useState<string | null>(null);

  const goalLabel = (g: string) => {
    const map: Record<string, string> = {
      'Decision Making': 'sprint5.goal.decisionMaking',
      Defence: 'sprint5.goal.defence',
      Attack: 'sprint5.goal.attack',
      'Mental Preparation': 'sprint5.goal.mentalPreparation',
    };
    const key = map[g];
    if (!key) return g;
    const localized = t(key);
    return localized === key ? g : localized;
  };

  const difficultyLabel = (d?: string) => {
    if (!d) return '';
    const key = `difficulty.${d.toLowerCase()}`;
    const localized = t(key);
    return localized === key ? d : localized;
  };

  const recommended = useMemo(() => {
    if (!position) return [];
    return recommendPrograms(position, profile.developmentGoal, getWeakestSkillId(statistics));
  }, [position, profile.developmentGoal, statistics]);

  const eligible = useMemo(
    () => (position ? getEligiblePrograms(position) : DEVELOPMENT_PROGRAMS),
    [position],
  );

  const filteredAll = useMemo(() => {
    let list = eligible;
    if (filterGoal) list = list.filter((p) => p.goalTags.includes(filterGoal as never));
    return list;
  }, [eligible, filterGoal]);

  const completedIds = new Set(completedPrograms.map((p: { programId: ProgramId }) => p.programId));

  const renderProgram = (p: DevelopmentProgramDef, badge?: string) => (
    <PressableCard
      key={p.id}
      style={styles.card}
      onPress={() => router.push(`/programs/${p.id}`)}
    >
      <View style={styles.cardRow}>
        <BookOpen size={18} color={Colors.gold} />
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{t(p.titleKey)}</Text>
          <Text style={styles.cardSub}>{t(p.summaryKey)}</Text>
          <Text style={styles.meta}>
            {t('sprint5.programs.weeks', { n: p.durationWeeks })} · {difficultyLabel(p.weeks[0]?.difficulty)}→
            {difficultyLabel(p.weeks[p.weeks.length - 1]?.difficulty)}
          </Text>
          {badge ? <Text style={styles.badge}>{badge}</Text> : null}
        </View>
      </View>
    </PressableCard>
  );

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton labeled label={t('common.back')} fallbackHref="/(tabs)/progress" style={{ marginBottom: Spacing.sm }} />
        <Text style={styles.title}>{t('sprint5.programs.title')}</Text>

        {activeProgram && !activeProgram.completed ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('sprint5.programs.current')}</Text>
            {renderProgram(
              DEVELOPMENT_PROGRAMS.find((p) => p.id === activeProgram.programId)!,
              `${activeProgram.completionPercent}%`,
            )}
          </View>
        ) : null}

        {position ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('sprint5.programs.recommended')}</Text>
            {recommended.slice(0, 3).map((p) => renderProgram(p))}
          </View>
        ) : null}

        {pausedPrograms.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('sprint5.programs.paused')}</Text>
            {pausedPrograms.map((c: { programId: ProgramId; startedAt: string; pausedAt?: string | null }) => {
              const def = DEVELOPMENT_PROGRAMS.find((p) => p.id === c.programId);
              if (!def) return null;
              return (
                <PressableCard
                  key={`paused_${c.programId}_${c.startedAt}`}
                  style={styles.card}
                  onPress={() => router.push(`/programs/${c.programId}`)}
                >
                  <Text style={styles.cardTitle}>{t(def.titleKey)}</Text>
                  <Text style={styles.meta}>{t('sprint5.programs.pausedMeta', { date: c.pausedAt || c.startedAt })}</Text>
                </PressableCard>
              );
            })}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('sprint5.programs.completed')}</Text>
          {completedPrograms.length === 0 ? (
            <Text style={styles.empty}>{t('sprint5.programs.emptyCompleted')}</Text>
          ) : (
            completedPrograms.map((c: { programId: ProgramId; startedAt: string; completedAt?: string | null }) => {
              const def = DEVELOPMENT_PROGRAMS.find((p) => p.id === c.programId);
              if (!def) return null;
              return (
                <PressableCard
                  key={`${c.programId}_${c.startedAt}`}
                  style={styles.card}
                  onPress={() =>
                    router.push({ pathname: '/programs/complete', params: { programId: c.programId, startedAt: c.startedAt } })
                  }
                >
                  <Text style={styles.cardTitle}>{t(def.titleKey)}</Text>
                  <Text style={styles.meta}>{c.completedAt || c.startedAt}</Text>
                </PressableCard>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('sprint5.programs.all')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
            {[null, 'Decision Making', 'Defence', 'Attack', 'Mental Preparation'].map((g) => (
              <TouchableOpacity
                key={g ?? 'all'}
                style={[styles.chip, filterGoal === g && styles.chipActive]}
                onPress={() => setFilterGoal(g)}
              >
                <Text style={[styles.chipText, filterGoal === g && styles.chipTextActive]}>
                  {g ? goalLabel(g) : t('common.all')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {filteredAll.map((p) =>
            renderProgram(p, completedIds.has(p.id as ProgramId) ? t('sprint5.programs.completed') : undefined),
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: 48, gap: Spacing.md },
  title: { ...Typography.h1, color: Colors.textPrimary, marginBottom: Spacing.md },
  section: { gap: Spacing.sm, marginBottom: Spacing.lg },
  sectionLabel: { ...Typography.caption, color: Colors.textTertiary, textTransform: 'uppercase' },
  card: { padding: Spacing.md },
  cardRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  cardTitle: { ...Typography.h3, color: Colors.textPrimary },
  cardSub: { ...Typography.bodySmall, color: Colors.textTertiary, marginTop: 4 },
  meta: { ...Typography.caption, color: Colors.textTertiary, marginTop: 6 },
  badge: { ...Typography.caption, color: Colors.gold, marginTop: 4 },
  empty: { ...Typography.body, color: Colors.textTertiary },
  filters: { marginBottom: Spacing.sm },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.goldSoft },
  chipText: { ...Typography.caption, color: Colors.textTertiary },
  chipTextActive: { color: Colors.gold, fontWeight: '600' },
});
