import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Check, Clock, Calendar } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { loadPreps, MatchDayPrep } from '@/lib/match-day-storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translateMatchType, translateMatchLocation, translatePlayingTime, translatePersonalGoal } from '@/lib/translations';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [preps, setPreps] = useState<MatchDayPrep[]>([]);

  useFocusEffect(useCallback(() => {
    const all = loadPreps().filter((p) => p.completed);
    setPreps(all);
  }, []));

  if (preps.length === 0) {
    return (
      <ScreenBackground>
        <View style={styles.emptyWrap}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={styles.emptyContent}>
            <Calendar size={48} color={Colors.textQuaternary} />
            <Text style={styles.emptyTitle}>{t('matchDay.historyEmptyTitle')}</Text>
            <Text style={styles.emptySub}>{t('matchDay.historyEmptySub')}</Text>
          </View>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('matchDay.historyTitle')}</Text>
            <Text style={styles.headerSub}>{t('matchDay.historySub', { n: preps.length })}</Text>
          </View>
        </View>

        {preps.map((prep, i) => {
          const date = new Date(prep.date);
          const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
          const mentalColor = prep.mentalReadiness >= 80 ? Colors.success : prep.mentalReadiness >= 60 ? Colors.gold : Colors.warning;
          const tacColor = prep.tacticalReadiness >= 80 ? Colors.success : prep.tacticalReadiness >= 60 ? Colors.gold : Colors.warning;

          return (
            <Animated.View key={prep.id} entering={FadeInDown.delay(i * 50).duration(400)}>
              <Card variant="gradient" shadow="card" style={styles.historyCard}>
                {/* Top row */}
                <View style={styles.topRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.opponent}>vs {prep.setup.opponent}</Text>
                    <Text style={styles.dateText}>{dateStr}</Text>
                  </View>
                  <View style={styles.modeBadge}>
                    <Clock size={11} color={Colors.gold} />
                    <Text style={styles.modeText}>{prep.mode === 'complete' ? t('matchDay.modeComplete') : t('matchDay.modeQuick')}</Text>
                  </View>
                </View>

                {/* Match details */}
                <View style={styles.detailRow}>
                  <DetailChip label={t('matchDay.detailType')} value={translateMatchType(prep.setup.matchType, t)} />
                  <DetailChip label={t('matchDay.detailLocation')} value={translateMatchLocation(prep.setup.location, t)} />
                  <DetailChip label={t('matchDay.detailRole')} value={translatePlayingTime(prep.setup.playingTime, t)} />
                </View>

                {/* Goals */}
                <View style={styles.goalsRow}>
                  {prep.setup.goals.map((g) => (
                    <View key={g} style={styles.goalChip}>
                      <Text style={styles.goalChipText}>{translatePersonalGoal(g, t)}</Text>
                    </View>
                  ))}
                </View>

                {/* Readiness scores */}
                <View style={styles.scoresRow}>
                  <View style={styles.score}>
                    <Text style={[styles.scoreVal, { color: mentalColor }]}>{prep.mentalReadiness}%</Text>
                    <Text style={styles.scoreLabel}>{t('matchDay.detailMental')}</Text>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.score}>
                    <Text style={[styles.scoreVal, { color: tacColor }]}>{prep.tacticalReadiness}%</Text>
                    <Text style={styles.scoreLabel}>{t('matchDay.detailTactical')}</Text>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.score}>
                    <View style={styles.reflectionBadge}>
                      {prep.reflectionCompleted
                        ? <Check size={13} color={Colors.success} />
                        : <Text style={styles.reflectionNo}>—</Text>}
                    </View>
                    <Text style={styles.scoreLabel}>{t('matchDay.detailReflection')}</Text>
                  </View>
                </View>

                {/* Personal statement */}
                {prep.personalStatement ? (
                  <View style={styles.statementRow}>
                    <Text style={styles.statementText} numberOfLines={2}>{prep.personalStatement}</Text>
                  </View>
                ) : null}
              </Card>
            </Animated.View>
          );
        })}
      </ScrollView>
    </ScreenBackground>
  );
}

function DetailChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailChip}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  emptyWrap: { flex: 1, padding: Spacing.lg, paddingTop: Spacing.xxxl + 16 },
  emptyContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingBottom: 80 },
  emptyTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  emptySub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', lineHeight: 22 },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  historyCard: { gap: Spacing.md, marginBottom: Spacing.sm },

  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  opponent: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  dateText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  modeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.goldSoft, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold },
  modeText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 0.5 },

  detailRow: { flexDirection: 'row', gap: Spacing.sm },
  detailChip: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.sm, padding: Spacing.sm, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', flex: 1 },
  detailLabel: { fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.textQuaternary, letterSpacing: 0.5 },
  detailValue: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textPrimary, marginTop: 2 },

  goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  goalChip: { backgroundColor: Colors.goldSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.gold },
  goalChipText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12 },

  scoresRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.hairline, paddingTop: Spacing.md },
  score: { flex: 1, alignItems: 'center', gap: 3 },
  scoreVal: { fontFamily: 'Inter-ExtraBold', fontSize: 22 },
  scoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textQuaternary, letterSpacing: 0.5 },
  scoreDivider: { width: 1, height: 32, backgroundColor: Colors.hairline },
  reflectionBadge: { height: 22, justifyContent: 'center' },
  reflectionNo: { color: Colors.textQuaternary, fontFamily: 'Inter-ExtraBold', fontSize: 16 },

  statementRow: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  statementText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
});
