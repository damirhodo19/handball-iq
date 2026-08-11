import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors, Typography, Spacing } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { getProgramDef, isProgramEligible, type ProgramId } from '@/lib/development/programs';
import { enrollInProgram } from '@/lib/development/program-progress';
import { useSyncedProfile } from '@/hooks/useSyncedProfile';
import { isHandballPosition } from '@/lib/platform/position-modules';
import type { HandballPosition } from '@/lib/positions';
import { useDevelopment } from '@/hooks/useDevelopment';

export default function ProgramDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const def = getProgramDef(id as ProgramId);
  const profile = useSyncedProfile();
  const positions = [profile.position, profile.secondaryPosition]
    .filter((value): value is HandballPosition => isHandballPosition(value));
  const { activeProgram, refresh } = useDevelopment();

  if (!def) {
    return (
      <ScreenBackground>
        <Text style={styles.title}>{t('common.back')}</Text>
      </ScreenBackground>
    );
  }

  const programPosition = positions.find((position) => isProgramEligible(def.id, position)) ?? null;
  const eligible = programPosition !== null;
  const isCurrent = activeProgram?.programId === def.id && !activeProgram.completed;

  const onEnroll = () => {
    if (!programPosition) {
      Alert.alert(t('sprint5.programs.title'), t('home.completeProfileTitle'));
      return;
    }
    try {
      enrollInProgram(def.id, programPosition);
      refresh();
      router.replace('/programs');
    } catch (e) {
      Alert.alert(t('sprint5.programs.title'), String((e as Error).message));
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton labeled label={t('common.back')} fallbackHref="/programs" />
        <Text style={styles.title}>{t(def.titleKey)}</Text>
        <Text style={styles.summary}>{t(def.summaryKey)}</Text>
        <Text style={styles.meta}>{t('sprint5.programs.weeks', { n: def.durationWeeks })}</Text>

        {def.weeks.map((w) => (
          <Card key={w.week} style={styles.weekCard}>
            <Text style={styles.weekTitle}>
              {t('sprint5.coach.weekFocus', { n: w.week })}
              {w.isCheckpoint ? ` · ${t('sprint5.programs.checkpoint')}` : ''}
            </Text>
            <Text style={styles.weekObj}>{t(w.objectiveKey)}</Text>
            <Text style={styles.meta}>
              {(() => {
                const key = `difficulty.${String(w.difficulty).toLowerCase()}`;
                const localized = t(key);
                return localized === key ? w.difficulty : localized;
              })()}{' '}
              · {w.skillFocus.map((s) => t(`iq.skill.${s}`)).join(' · ')}
            </Text>
          </Card>
        ))}

        <Card style={styles.weekCard}>
          <Text style={styles.weekTitle}>{t('sprint5.programs.finalAssessment')}</Text>
          <Text style={styles.meta}>
            {def.finalAssessment.scenarioCount} · ≥{def.finalAssessment.targetAccuracy}%
          </Text>
        </Card>

        {eligible && !isCurrent ? (
          <Button
            label={activeProgram && !activeProgram.completed ? t('sprint5.programs.switch') : t('sprint5.programs.enroll')}
            onPress={onEnroll}
          />
        ) : null}
        {isCurrent ? (
          <Button label={t('sprint5.programs.view')} onPress={() => router.push('/(tabs)/training')} />
        ) : null}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: 48, gap: Spacing.md },
  title: { ...Typography.h1, color: Colors.textPrimary },
  summary: { ...Typography.body, color: Colors.textTertiary },
  meta: { ...Typography.caption, color: Colors.textTertiary },
  weekCard: { padding: Spacing.md, gap: 4 },
  weekTitle: { ...Typography.caption, color: Colors.gold },
  weekObj: { ...Typography.body, color: Colors.textPrimary },
});
