import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import { Colors, Spacing } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { useTranslation } from '@/hooks/useTranslation';
import { getActiveTeam } from '@/lib/team-platform/platform';
import { computeLeaderboards } from '@/lib/team-platform/reports';
import type { TeamLeaderboards } from '@/lib/team-platform/types';

export default function LeaderboardsScreen() {
  const { t } = useTranslation();
  const [boards, setBoards] = useState<TeamLeaderboards | null>(null);

  useFocusEffect(useCallback(() => {
    const team = getActiveTeam();
    if (team) setBoards(computeLeaderboards(team.id));
  }, []));

  const sections: { key: keyof TeamLeaderboards; label: string }[] = [
    { key: 'decisionScore', label: t('team.lbDecisionScore') },
    { key: 'xp', label: t('team.lbXp') },
    { key: 'streak', label: t('team.lbStreak') },
    { key: 'weeklyActivity', label: t('team.lbActivity') },
    { key: 'improvement', label: t('team.lbImprovement') },
  ];

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>{t('team.leaderboards')}</Text>
        </View>

        {sections.map(({ key, label }) => (
          <View key={key}>
            <Text style={styles.section}>{label}</Text>
            <Card variant="gradient" shadow="card" style={styles.board}>
              {(boards?.[key] ?? []).slice(0, 5).map((entry) => (
                <View key={entry.user_id} style={styles.row}>
                  <View style={styles.rank}><Text style={styles.rankText}>{entry.rank}</Text></View>
                  <Text style={styles.name}>{entry.display_name}</Text>
                  <Text style={styles.value}>{entry.value}</Text>
                  {entry.rank === 1 && <Trophy size={14} color={Colors.gold} />}
                </View>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  section: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.md },
  board: { gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rank: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  rankText: { fontFamily: 'Inter-ExtraBold', fontSize: 12, color: Colors.gold },
  name: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textPrimary },
  value: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.gold },
});
