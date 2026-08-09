import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FileText, Download } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { generateTeamReport, exportReportCsv, exportReportPdf } from '@/lib/team-platform/reports';
import { localGetActiveTeam } from '@/lib/team-platform/storage';
import type { ReportPeriod } from '@/lib/team-platform/types';

const PERIODS: ReportPeriod[] = ['individual', 'team', 'weekly', 'monthly', 'season'];

export default function ReportsScreen() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<ReportPeriod>('weekly');
  const team = localGetActiveTeam();

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!team) return;
    const report = generateTeamReport(team, period);
    if (format === 'csv') exportReportCsv(report);
    else exportReportPdf(report);
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>{t('team.reports')}</Text>
        </View>

        <Text style={styles.label}>{t('team.reportPeriod')}</Text>
        <View style={styles.periodGrid}>
          {PERIODS.map((p) => (
            <TouchableOpacity key={p} style={[styles.periodChip, period === p && styles.periodActive]} onPress={() => setPeriod(p)}>
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{t(`team.period.${p}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card variant="gradient" shadow="card" style={styles.preview}>
          <FileText size={24} color={Colors.gold} />
          <Text style={styles.previewTitle}>{team?.name ?? '—'} — {t(`team.period.${period}`)}</Text>
          <Text style={styles.previewSub}>{t('team.reportPreview')}</Text>
        </Card>

        <Button label={t('team.exportExcel')} onPress={() => handleExport('csv')} iconRight={<Download size={18} color={Colors.background} />} />
        <Button label={t('team.exportPdf')} onPress={() => handleExport('pdf')} variant="outline" />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary, marginTop: Spacing.md },
  periodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  periodChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border },
  periodActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  periodText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textSecondary },
  periodTextActive: { color: Colors.background },
  preview: { alignItems: 'center', gap: Spacing.sm, padding: Spacing.lg },
  previewTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary, textAlign: 'center' },
  previewSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary, textAlign: 'center' },
});
