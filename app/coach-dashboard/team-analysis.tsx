import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, TrendingUp, AlertCircle, Award, Brain, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { getTeamAnalysis, generateTeamRecommendations, TeamAnalysis, TrainingRecommendation } from '@/lib/coach-dashboard-data';
import { useTranslation } from '@/hooks/useTranslation';
import { translateSkill, translateSessionType } from '@/lib/translations';

export default function TeamAnalysisScreen() {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState<TeamAnalysis | null>(null);
  const [recs, setRecs] = useState<TrainingRecommendation[]>([]);

  useFocusEffect(useCallback(() => {
    setAnalysis(getTeamAnalysis());
    setRecs(generateTeamRecommendations());
  }, []));

  if (!analysis) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('cdAnalysis.analyzing')}</Text></View>
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
            <Text style={styles.headerTitle}>{t('cdAnalysis.title')}</Text>
            <Text style={styles.headerSub}>{t('cdAnalysis.subtitle')}</Text>
          </View>
        </View>

        {/* Strongest & Weakest Skills */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <View style={styles.skillRow}>
            <Card variant="gradient" shadow="card" style={[styles.skillCard, { borderColor: Colors.success + '55' }]}>
              <View style={styles.skillIconWrap}><Award size={18} color={Colors.success} /></View>
              <Text style={styles.skillCardLabel}>{t('cdAnalysis.strongestSkill')}</Text>
              <Text style={[styles.skillCardValue, { color: Colors.success }]}>{translateSkill(analysis.strongestSkill.label, t)}</Text>
              <Text style={styles.skillCardScore}>{t('cdAnalysis.avgScore', { score: analysis.strongestSkill.score })}</Text>
              <ProgressBar progress={analysis.strongestSkill.score / 100} height={4} color={Colors.success} />
            </Card>
            <View style={{ width: Spacing.sm }} />
            <Card variant="gradient" shadow="card" style={[styles.skillCard, { borderColor: Colors.warning + '55' }]}>
              <View style={styles.skillIconWrap}><AlertCircle size={18} color={Colors.warning} /></View>
              <Text style={styles.skillCardLabel}>{t('cdAnalysis.weakestSkill')}</Text>
              <Text style={[styles.skillCardValue, { color: Colors.warning }]}>{translateSkill(analysis.weakestSkill.label, t)}</Text>
              <Text style={styles.skillCardScore}>{t('cdAnalysis.avgScore', { score: analysis.weakestSkill.score })}</Text>
              <ProgressBar progress={analysis.weakestSkill.score / 100} height={4} color={Colors.warning} />
            </Card>
          </View>
        </Animated.View>

        {/* Most Improved Player */}
        {analysis.mostImprovedPlayer && (
          <Animated.View entering={FadeInDown.delay(50).duration(500)}>
            <PressableCard
              onPress={() => router.push({ pathname: '/coach-dashboard/player-report', params: { playerId: analysis.mostImprovedPlayer!.id } })}
              variant="gradient"
              shadow="card"
              style={styles.playerCard}
            >
              <View style={styles.playerCardHeader}>
                <View style={styles.playerCardIcon}><TrendingUp size={18} color={Colors.success} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playerCardLabel}>{t('cdAnalysis.mostImproved')}</Text>
                  <Text style={styles.playerCardName}>{analysis.mostImprovedPlayer.name}</Text>
                </View>
                <View style={[styles.trendBadge, { backgroundColor: Colors.successSoft, borderColor: Colors.success }]}>
                  <Text style={[styles.trendText, { color: Colors.success }]}>+{analysis.mostImprovedPlayer.weeklyTrend}</Text>
                </View>
              </View>
              <Text style={styles.playerCardSub}>{t('cdAnalysis.decisionDetail', { score: analysis.mostImprovedPlayer.decisionScore, sessions: analysis.mostImprovedPlayer.sessionsCompleted })}</Text>
            </PressableCard>
          </Animated.View>
        )}

        {/* Player Requiring Attention */}
        {analysis.playerRequiringAttention && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <PressableCard
              onPress={() => router.push({ pathname: '/coach-dashboard/player-report', params: { playerId: analysis.playerRequiringAttention!.id } })}
              variant="gradient"
              shadow="card"
              style={styles.playerCard}
            >
              <View style={styles.playerCardHeader}>
                <View style={[styles.playerCardIcon, { backgroundColor: Colors.errorSoft, borderColor: Colors.error }]}><AlertCircle size={18} color={Colors.error} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playerCardLabel}>{t('cdAnalysis.attentionPlayer')}</Text>
                  <Text style={styles.playerCardName}>{analysis.playerRequiringAttention.name}</Text>
                </View>
                <View style={[styles.trendBadge, { backgroundColor: Colors.errorSoft, borderColor: Colors.error }]}>
                  <Text style={[styles.trendText, { color: Colors.error }]}>{analysis.playerRequiringAttention.decisionScore}%</Text>
                </View>
              </View>
              <Text style={styles.playerCardSub}>{t('cdAnalysis.attentionDetail', { sessions: analysis.playerRequiringAttention.sessionsCompleted })}</Text>
            </PressableCard>
          </Animated.View>
        )}

        {/* Avg Mental Readiness */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <Card variant="gradient" shadow="card" style={styles.mentalCard}>
            <View style={styles.mentalRow}>
              <View style={styles.mentalIcon}><Brain size={22} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mentalLabel}>{t('cdAnalysis.avgMental')}</Text>
                <Text style={styles.mentalValue}>{analysis.avgMentalReadiness}%</Text>
              </View>
            </View>
            <ProgressBar progress={analysis.avgMentalReadiness / 100} height={5} color={Colors.gold} />
          </Card>
        </Animated.View>

        {/* All Recommendations */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('cdAnalysis.allRecs', { n: recs.length })}</Text>
          {recs.map((rec, i) => (
            <Card key={i} variant="gradient" shadow="card" style={styles.recCard}>
              <View style={styles.recHeader}>
                <View style={[styles.severityDot, { backgroundColor: rec.severity === 'high' ? Colors.error : rec.severity === 'medium' ? Colors.warning : Colors.success }]} />
                <Text style={styles.recPlayer}>{rec.playerName}</Text>
                <View style={styles.recTypePill}>
                  <Text style={styles.recTypeText}>{translateSessionType(rec.sessionType, t)}</Text>
                </View>
              </View>
              <Text style={styles.recIssue}>{rec.issue}</Text>
              <Text style={styles.recAction}>{rec.recommendation}</Text>
            </Card>
          ))}
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 16 },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  skillRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  skillCard: { flex: 1, gap: Spacing.xs, borderWidth: 1.5 },
  skillIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surfaceRaised, justifyContent: 'center', alignItems: 'center' },
  skillCardLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 0.5 },
  skillCardValue: { fontFamily: 'Inter-ExtraBold', fontSize: 15 },
  skillCardScore: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textQuaternary },

  playerCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  playerCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  playerCardIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.successSoft, borderWidth: 1, borderColor: Colors.success, justifyContent: 'center', alignItems: 'center' },
  playerCardLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 0.5 },
  playerCardName: { fontFamily: 'Inter-ExtraBold', fontSize: 17, color: Colors.textPrimary },
  trendBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm, borderWidth: 1 },
  trendText: { fontFamily: 'Inter-ExtraBold', fontSize: 13 },
  playerCardSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary },

  mentalCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  mentalRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  mentalIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  mentalLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  mentalValue: { fontFamily: 'Inter-ExtraBold', fontSize: 26, color: Colors.textPrimary },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  recCard: { gap: Spacing.xs, marginBottom: Spacing.sm },
  recHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  severityDot: { width: 8, height: 8, borderRadius: 4 },
  recPlayer: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary, flex: 1 },
  recTypePill: { backgroundColor: Colors.goldSoft, borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: Colors.gold },
  recTypeText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold },
  recIssue: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19 },
  recAction: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13, lineHeight: 19 },
});
