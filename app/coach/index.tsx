import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  ArrowLeft, ArrowRight, Brain, FileText, Calendar, ClipboardList,
  UserCircle, TrendingUp, Target, MessageSquare, ChevronRight, Sparkles,
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { buildPlayerProfile, getDailyCoachMessage, PlayerProfile } from '@/lib/coach-engine';
import { loadGoals, CoachGoal } from '@/lib/coach-storage';
import { useTranslation } from '@/hooks/useTranslation';

export default function CoachHome() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [dailyMessage, setDailyMessage] = useState('');
  const [goals, setGoals] = useState<CoachGoal[]>([]);

  useFocusEffect(useCallback(() => {
    setProfile(buildPlayerProfile());
    setDailyMessage(getDailyCoachMessage());
    setGoals(loadGoals());
  }, []));

  const activeGoals = goals.filter((g) => !g.completed);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('coach.title')}</Text>
            <Text style={styles.headerSub}>{t('coach.subtitle')}</Text>
          </View>
          <View style={styles.headerIcon}><Brain size={22} color={Colors.gold} /></View>
        </View>

        {/* Daily Coach Message */}
        <Animated.View entering={FadeInDown.delay(50).duration(500)}>
          <LinearGradient
            colors={['rgba(212,175,55,0.14)', 'rgba(212,175,55,0.03)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dailyMsgWrap}
          >
            <View style={styles.dailyMsgHeader}>
              <View style={styles.dailyMsgIcon}><Sparkles size={16} color={Colors.gold} /></View>
              <Text style={styles.dailyMsgLabel}>{t('coach.todaysMessage')}</Text>
            </View>
            <Text style={styles.dailyMsgText}>"{dailyMessage}"</Text>
          </LinearGradient>
        </Animated.View>

        {/* Overall Score */}
        {profile && (
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <Card variant="gradient" shadow="card" style={styles.overallCard}>
              <View style={styles.overallRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.overallLabel}>{t('coach.overallScore')}</Text>
                  <Text style={styles.overallValue}>{profile.overallScore}<Text style={styles.overallPct}>%</Text></Text>
                  <Text style={styles.overallSub}>
                    {t('coach.activitySummary', { sessions: profile.totalSessions, matches: profile.totalMatches, preps: profile.totalPreps })}
                  </Text>
                </View>
                <View style={styles.overallScoreBadge}>
                  <Text style={styles.overallBadgeText}>
                    {profile.overallScore >= 80 ? t('coach.excellent') : profile.overallScore >= 65 ? t('coach.strong') : profile.overallScore >= 50 ? t('coach.developing') : t('coach.early')}
                  </Text>
                </View>
              </View>
              <ProgressBar progress={profile.overallScore / 100} height={6} color={Colors.gold} />
            </Card>
          </Animated.View>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(500)}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/coach/goals')}>
              <View style={styles.goalsBanner}>
                <Target size={16} color={Colors.gold} />
                <Text style={styles.goalsBannerText}>{t('coach.activeGoals', { n: activeGoals.length })}</Text>
                <ChevronRight size={16} color={Colors.gold} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Menu Section: Analysis */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('coach.analysis')}</Text>
          <View style={styles.menuCol}>
            <MenuItem icon={<UserCircle size={20} color={Colors.gold} />} title={t('coach.playerProfile')} subtitle={t('coach.playerProfileSub')} onPress={() => router.push('/coach/profile')} />
            <MenuItem icon={<FileText size={20} color={Colors.gold} />} title={t('coach.coachReport')} subtitle={t('coach.coachReportSub')} onPress={() => router.push('/coach/report')} />
            <MenuItem icon={<UserCircle size={20} color={Colors.gold} />} title={t('coach.playerType')} subtitle={t('coach.playerTypeSub')} onPress={() => router.push('/coach/type')} />
          </View>
        </Animated.View>

        {/* Menu Section: Planning */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <Text style={styles.sectionLabel}>{t('coach.planning')}</Text>
          <View style={styles.menuCol}>
            <MenuItem icon={<Calendar size={20} color={Colors.gold} />} title={t('coach.weeklyReport')} subtitle={t('coach.weeklyReportSub')} onPress={() => router.push('/coach/weekly')} />
            <MenuItem icon={<ClipboardList size={20} color={Colors.gold} />} title={t('coach.trainingPlan')} subtitle={t('coach.trainingPlanSub')} onPress={() => router.push('/coach/plan')} />
            <MenuItem icon={<Target size={20} color={Colors.gold} />} title={t('coach.goals')} subtitle={t('coach.goalsSub')} onPress={() => router.push('/coach/goals')} />
          </View>
        </Animated.View>

        {/* Menu Section: Progress */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Text style={styles.sectionLabel}>{t('coach.progressSection')}</Text>
          <View style={styles.menuCol}>
            <MenuItem icon={<TrendingUp size={20} color={Colors.gold} />} title={t('coach.longTermProgress')} subtitle={t('coach.longTermProgressSub')} onPress={() => router.push('/coach/progress')} />
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

function MenuItem({ icon, title, subtitle, onPress }: { icon: React.ReactNode; title: string; subtitle: string; onPress: () => void }) {
  return (
    <PressableCard onPress={onPress} variant="gradient" shadow="card" style={styles.menuCard}>
      <View style={styles.menuRow}>
        <View style={styles.menuIcon}>{icon}</View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSub}>{subtitle}</Text>
        </View>
        <ChevronRight size={18} color={Colors.gold} />
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  headerIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },

  dailyMsgWrap: { borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.gold, marginBottom: Spacing.md },
  dailyMsgHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dailyMsgIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  dailyMsgLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold, letterSpacing: 1.5 },
  dailyMsgText: { fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.textPrimary, lineHeight: 25, fontStyle: 'italic' },

  overallCard: { gap: Spacing.md, marginBottom: Spacing.md },
  overallRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  overallLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  overallValue: { fontFamily: 'Inter-ExtraBold', fontSize: 36, color: Colors.textPrimary, lineHeight: 42 },
  overallPct: { fontSize: 20, color: Colors.gold },
  overallSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textQuaternary, marginTop: 2 },
  overallScoreBadge: { backgroundColor: Colors.goldSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold },
  overallBadgeText: { fontFamily: 'Inter-ExtraBold', fontSize: 11, color: Colors.gold, letterSpacing: 1 },

  goalsBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold, marginBottom: Spacing.md },
  goalsBannerText: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textPrimary },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  menuCol: { gap: Spacing.sm },
  menuCard: { marginBottom: 0 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  menuTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  menuSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textTertiary },
});
