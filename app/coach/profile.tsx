import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Brain } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { buildPlayerProfile, PlayerProfile, SkillScore } from '@/lib/coach-engine';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useFocusEffect(useCallback(() => {
    setProfile(buildPlayerProfile());
  }, []));

  if (!profile) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('coachProfile.analyzing')}</Text></View>
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
            <Text style={styles.headerTitle}>{t('coachProfile.title')}</Text>
            <Text style={styles.headerSub}>{t('coachProfile.subtitle')}</Text>
          </View>
        </View>

        {/* Overall */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.overallCard}>
            <View style={styles.overallRow}>
              <View style={styles.overallIcon}><Brain size={24} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.overallLabel}>{t('coachProfile.overallScore')}</Text>
                <Text style={styles.overallValue}>{profile.overallScore}<Text style={styles.overallPct}>%</Text></Text>
              </View>
            </View>
            <ProgressBar progress={profile.overallScore / 100} height={6} color={Colors.gold} />
          </Card>
        </Animated.View>

        {/* Skill Cards */}
        {profile.skills.map((skill, i) => (
          <SkillCard key={skill.category} skill={skill} index={i} />
        ))}

        {/* Summary stats */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{t('coachProfile.dataSummary')}</Text>
            <SummaryRow label={t('coachProfile.trainingSessions')} value={`${profile.totalSessions}`} />
            <SummaryRow label={t('coachProfile.matchesPlayed')} value={`${profile.totalMatches}`} />
            <SummaryRow label={t('coachProfile.matchDayPreps')} value={`${profile.totalPreps}`} />
            <SummaryRow label={t('coachProfile.postMatchReflections')} value={`${profile.totalReflections}`} />
          </Card>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function SkillCard({ skill, index }: { skill: SkillScore; index: number }) {
  const { t } = useTranslation();
  const scoreColor = skill.score >= 80 ? Colors.success : skill.score >= 60 ? Colors.gold : skill.score >= 40 ? Colors.warning : Colors.error;

  return (
    <Animated.View entering={FadeInDown.delay(index * 40 + 50).duration(400)}>
      <Card variant="gradient" shadow="card" style={styles.skillCard}>
        <View style={styles.skillHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.skillLabel}>{skill.label}</Text>
            <Text style={styles.skillSample}>{t('coachProfile.dataPoints', { n: skill.sample })}</Text>
          </View>
          <View style={styles.skillScoreWrap}>
            <Text style={[styles.skillScore, { color: scoreColor }]}>{skill.score}</Text>
            <TrendBadge trend={skill.trend} value={skill.trendValue} />
          </View>
        </View>
        <ProgressBar progress={skill.score / 100} height={5} color={scoreColor} />
      </Card>
    </Animated.View>
  );
}

function TrendBadge({ trend, value }: { trend: 'up' | 'down' | 'stable'; value: number }) {
  if (trend === 'up') {
    return (
      <View style={[styles.trendBadge, { backgroundColor: Colors.successSoft, borderColor: Colors.success }]}>
        <TrendingUp size={11} color={Colors.success} />
        <Text style={[styles.trendText, { color: Colors.success }]}>+{value}</Text>
      </View>
    );
  }
  if (trend === 'down') {
    return (
      <View style={[styles.trendBadge, { backgroundColor: Colors.errorSoft, borderColor: Colors.error }]}>
        <TrendingDown size={11} color={Colors.error} />
        <Text style={[styles.trendText, { color: Colors.error }]}>{value}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.trendBadge, { backgroundColor: Colors.surfaceRaised, borderColor: Colors.border }]}>
      <Minus size={11} color={Colors.textTertiary} />
      <Text style={[styles.trendText, { color: Colors.textTertiary }]}>0</Text>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
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

  overallCard: { gap: Spacing.md, marginBottom: Spacing.md },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  overallIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  overallLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  overallValue: { fontFamily: 'Inter-ExtraBold', fontSize: 34, color: Colors.textPrimary, lineHeight: 40 },
  overallPct: { fontSize: 18, color: Colors.gold },

  skillCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  skillHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  skillLabel: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  skillSample: { fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.textQuaternary, marginTop: 1 },
  skillScoreWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  skillScore: { fontFamily: 'Inter-ExtraBold', fontSize: 22 },

  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1 },
  trendText: { fontFamily: 'Inter-ExtraBold', fontSize: 11 },

  summaryCard: { gap: Spacing.sm, marginTop: Spacing.lg },
  summaryTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary, marginBottom: Spacing.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  summaryLabel: { fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
});
