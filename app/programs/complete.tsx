import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Colors, Typography, Spacing } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { loadDevelopmentState } from '@/lib/development/storage';
import { buildProgramCompletionReport } from '@/lib/development/program-progress';
import type { ProgramId } from '@/lib/development/programs';

export default function ProgramComplete() {
  const { t } = useTranslation();
  const { programId, startedAt } = useLocalSearchParams<{ programId: string; startedAt?: string }>();
  const state = loadDevelopmentState();
  const enrollment =
    state.completedPrograms.find(
      (p) => p.programId === programId && (!startedAt || p.startedAt === startedAt),
    ) ||
    (state.activeProgram?.programId === programId && state.activeProgram.completed
      ? state.activeProgram
      : null);

  if (!enrollment) {
    return (
      <ScreenBackground>
        <View style={styles.container}>
          <BackButton labeled label={t('common.back')} fallbackHref="/programs" />
          <Text style={styles.title}>{t('sprint5.complete.noDelta')}</Text>
        </View>
      </ScreenBackground>
    );
  }

  const report = buildProgramCompletionReport(enrollment);
  const fmt = (n: number | null | undefined) =>
    typeof n === 'number' ? String(n) : t('sprint5.complete.na');

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <BackButton labeled label={t('common.back')} fallbackHref="/programs" />
        <Text style={styles.title}>{t('sprint5.complete.title')}</Text>
        <Text style={styles.sub}>{t(report.titleKey)}</Text>

        <Card style={styles.card}>
          <Row label={t('sprint5.complete.startingIq')} value={fmt(report.startingOverallIq)} />
          <Row label={t('sprint5.complete.currentIq')} value={fmt(report.currentOverallIq)} />
          <Row label={t('sprint5.complete.completion')} value={`${report.completionPercent}%`} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>{t('sprint5.complete.strongest')}</Text>
          <Text style={styles.value}>
            {report.strongestImprovement
              ? `${t(`iq.skill.${report.strongestImprovement.skillId}`)} (+${report.strongestImprovement.delta})`
              : t('sprint5.complete.noDelta')}
          </Text>
          <Text style={[styles.label, { marginTop: 12 }]}>{t('sprint5.complete.remaining')}</Text>
          <Text style={styles.value}>
            {report.remainingWeakness
              ? t(`iq.skill.${report.remainingWeakness}`)
              : t('sprint5.complete.na')}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>{t('sprint5.complete.next')}</Text>
          <Text style={styles.value}>{t(report.nextProgramTitleKey)}</Text>
          <Button
            label={t('sprint5.programs.view')}
            onPress={() => router.push(`/programs/${report.nextProgramId as ProgramId}`)}
            style={{ marginTop: 12 }}
          />
        </Card>
      </ScrollView>
    </ScreenBackground>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: 48, gap: Spacing.md },
  title: { ...Typography.h1, color: Colors.textPrimary },
  sub: { ...Typography.body, color: Colors.textTertiary },
  card: { padding: Spacing.md, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...Typography.caption, color: Colors.textTertiary },
  value: { ...Typography.h3, color: Colors.textPrimary },
});
