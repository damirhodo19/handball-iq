import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { buildPlayerProfile, generateCoachReport, CoachReportEntry } from '@/lib/coach-engine';
import { useTranslation } from '@/hooks/useTranslation';

export default function ReportScreen() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<CoachReportEntry[]>([]);
  const [overall, setOverall] = useState(0);

  useFocusEffect(useCallback(() => {
    const profile = buildPlayerProfile();
    setEntries(generateCoachReport(profile));
    setOverall(profile.overallScore);
  }, []));

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('coachReport.title')}</Text>
            <Text style={styles.headerSub}>{t('coachReport.subtitle')}</Text>
          </View>
        </View>

        {/* Overall banner */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.overallCard}>
            <View style={styles.overallRow}>
              <View style={styles.overallIcon}><FileText size={22} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.overallLabel}>{t('coachReport.overallAssessment')}</Text>
                <Text style={styles.overallValue}>{overall}%</Text>
              </View>
            </View>
            <ProgressBar progress={overall / 100} height={5} color={Colors.gold} />
          </Card>
        </Animated.View>

        {/* Report entries */}
        {entries.map((entry, i) => (
          <ReportCard key={entry.category} entry={entry} index={i} />
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

function ReportCard({ entry, index }: { entry: CoachReportEntry; index: number }) {
  const scoreColor = entry.score >= 80 ? Colors.success : entry.score >= 60 ? Colors.gold : entry.score >= 40 ? Colors.warning : Colors.error;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60 + 50).duration(400)}>
      <Card variant="gradient" shadow="card" style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportLabel}>{entry.label}</Text>
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor + '22', borderColor: scoreColor }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{entry.score}</Text>
          </View>
        </View>
        <ProgressBar progress={entry.score / 100} height={4} color={scoreColor} />
        <Text style={styles.feedbackText}>{entry.feedback}</Text>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  overallCard: { gap: Spacing.md, marginBottom: Spacing.md },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  overallIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  overallLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  overallValue: { fontFamily: 'Inter-ExtraBold', fontSize: 30, color: Colors.textPrimary, lineHeight: 36 },

  reportCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportLabel: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1 },
  scoreText: { fontFamily: 'Inter-ExtraBold', fontSize: 16 },
  feedbackText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22, marginTop: Spacing.xs },
});
