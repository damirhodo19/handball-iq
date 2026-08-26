import { useCallback, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Calendar, Clock, ChevronRight, Shield, History, RotateCcw, Check } from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { loadPreps, MatchDayPrep } from '@/lib/match-day-storage';
import { useMatchDay } from '@/context/MatchDayContext';
import { useTranslation } from '@/hooks/useTranslation';
import { translateMatchType } from '@/lib/translations';
import { localeTagForLanguage } from '@/lib/locale';

export default function MatchDayTabScreen() {
  const { t, lang } = useTranslation();
  const { resumePrep } = useMatchDay();
  const [preps, setPreps] = useState<MatchDayPrep[]>([]);

  useFocusEffect(useCallback(() => {
    setPreps(loadPreps());
  }, []));

  const todayStr = new Date().toISOString().split('T')[0];
  const todayPrep = preps.find((p) => p.date.startsWith(todayStr) && p.completed);
  const latestIncomplete = preps.find((p) => !p.completed);
  const recentCompleted = preps.filter((p) => p.completed).slice(0, 3);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <View style={styles.headerIcon}><Calendar size={22} color={Colors.gold} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('matchDay.title')}</Text>
            <Text style={styles.headerSub}>{t('matchDay.subtitle')}</Text>
          </View>
        </Animated.View>

        {/* Today's prep badge if done */}
        {todayPrep && (
          <Animated.View entering={FadeInDown.delay(50).duration(400)}>
            <View style={styles.doneBanner}>
              <View style={styles.doneIcon}><Check size={16} color={Colors.success} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.doneBannerTitle}>{t('matchDay.todayPrepComplete')}</Text>
                <Text style={styles.doneBannerSub}>{t('matchDay.vsOpponent', { opponent: todayPrep.setup.opponent })} · {translateMatchType(todayPrep.setup.matchType, t)}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/match-day/history')} style={styles.doneHistoryBtn}>
                <History size={16} color={Colors.gold} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Resume banner */}
        {latestIncomplete && (
          <Animated.View entering={FadeInDown.delay(60).duration(400)}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.resumeBanner}
              onPress={() => {
                if (resumePrep(latestIncomplete.id)) {
                  router.push('/match-day/prepare');
                }
              }}
            >
              <View style={styles.resumeIcon}><RotateCcw size={16} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resumeTitle}>{t('matchDay.resumePrep')}</Text>
                <Text style={styles.resumeSub}>{t('matchDay.vsOpponent', { opponent: latestIncomplete.setup.opponent })} — {t('matchDay.notYetCompleted')}</Text>
              </View>
              <ChevronRight size={18} color={Colors.gold} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Main options */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.sectionLabel}>{t('matchDay.beginPrep').toUpperCase()}</Text>

          {/* Complete Preparation */}
          <PressableCard
            onPress={() => router.push({ pathname: '/match-day/setup', params: { mode: 'complete' } })}
            variant="gradient"
            padding={0}
            shadow="cardLg"
            style={styles.mainCard}
          >
            <LinearGradient
              colors={['rgba(212,175,55,0.14)', 'rgba(212,175,55,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainCardGradient}
            >
              <View style={styles.mainCardTop}>
                <View style={styles.mainCardIcon}><Shield size={26} color={Colors.gold} /></View>
                <View style={styles.mainCardBadge}><Text style={styles.mainCardBadgeText}>{t('matchDay.modeComplete').toUpperCase()}</Text></View>
              </View>
              <Text style={styles.mainCardTitle}>{t('matchDay.completePrep')}</Text>
              <Text style={styles.mainCardDesc}>{t('matchDay.completePrepDesc')}</Text>
              <View style={styles.mainCardMeta}>
                <Clock size={13} color={Colors.textTertiary} />
                <Text style={styles.mainCardMetaText}>{t('matchDay.completePrepTime')}</Text>
              </View>
            </LinearGradient>
          </PressableCard>

          {/* Quick Preparation */}
          <PressableCard
            onPress={() => router.push({ pathname: '/match-day/setup', params: { mode: 'quick' } })}
            variant="gradient"
            shadow="card"
            style={styles.quickCard}
          >
            <View style={styles.quickInner}>
              <View style={styles.quickIcon}><Clock size={20} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.quickTitle}>{t('matchDay.quickPrep')}</Text>
                <Text style={styles.quickSub}>{t('matchDay.quickPrepDesc')}</Text>
                <View style={styles.quickMeta}>
                  <Clock size={12} color={Colors.textQuaternary} />
                  <Text style={styles.quickMetaText}>{t('matchDay.quickPrepTime')}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.gold} />
            </View>
          </PressableCard>
        </Animated.View>

        {/* Post Match Reflection */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('matchDay.afterMatch')}</Text>
          <PressableCard
            onPress={() => router.push('/match-day/reflection')}
            variant="gradient"
            shadow="card"
            style={styles.reflectCard}
          >
            <View style={styles.quickInner}>
              <View style={styles.quickIcon}><History size={20} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.quickTitle}>{t('matchDay.reflectionTitle')}</Text>
                <Text style={styles.quickSub}>{t('matchDay.reflectionSub')}</Text>
              </View>
              <ChevronRight size={20} color={Colors.gold} />
            </View>
          </PressableCard>
        </Animated.View>

        {/* Recent history */}
        {recentCompleted.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionLabel}>{t('matchDay.recentPreps').toUpperCase()}</Text>
              <TouchableOpacity onPress={() => router.push('/match-day/history')}>
                <Text style={styles.seeAllText}>{t('common.viewAll')}</Text>
              </TouchableOpacity>
            </View>
            {recentCompleted.map((prep) => (
              <Card key={prep.id} variant="gradient" shadow="card" style={styles.historyCard}>
                <View style={styles.historyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyOpponent}>{t('matchDay.vsOpponent', { opponent: prep.setup.opponent })}</Text>
                    <Text style={styles.historyMeta}>
                      {new Date(prep.date).toLocaleDateString(localeTagForLanguage(lang), { weekday: 'short', month: 'short', day: 'numeric' })} · {translateMatchType(prep.setup.matchType, t)} · {prep.mode === 'complete' ? t('matchDay.completePrep') : t('matchDay.quickPrep')}
                    </Text>
                  </View>
                  <View style={styles.historyScores}>
                    <View style={styles.historyScore}>
                      <Text style={styles.historyScoreVal}>{prep.mentalReadiness}%</Text>
                      <Text style={styles.historyScoreLabel}>{t('matchDay.mentalShort')}</Text>
                    </View>
                    <View style={styles.historyScore}>
                      <Text style={styles.historyScoreVal}>{prep.tacticalReadiness}%</Text>
                      <Text style={styles.historyScoreLabel}>{t('matchDay.tacticalShort')}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.xl },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },

  doneBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.successSoft, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.success, marginBottom: Spacing.md },
  doneIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.success + '22', justifyContent: 'center', alignItems: 'center' },
  doneBannerTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.success },
  doneBannerSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 1 },
  doneHistoryBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },

  resumeBanner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold, marginBottom: Spacing.md },
  resumeIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  resumeTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textPrimary },
  resumeSub: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 1 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  mainCard: { overflow: 'hidden', marginBottom: Spacing.sm },
  mainCardGradient: { borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm },
  mainCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mainCardIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.goldSoft, borderWidth: 1.5, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  mainCardBadge: { backgroundColor: Colors.gold, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.sm },
  mainCardBadgeText: { color: Colors.background, fontFamily: 'Inter-ExtraBold', fontSize: 10, letterSpacing: 1.5 },
  mainCardTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  mainCardDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },
  mainCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mainCardMetaText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 13 },

  quickCard: { marginBottom: 0 },
  quickInner: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  quickIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  quickTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  quickSub: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 19, marginTop: 2 },
  quickMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  quickMetaText: { color: Colors.textQuaternary, fontFamily: 'Inter-Medium', fontSize: 12 },

  reflectCard: { marginBottom: 0 },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAllText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13 },

  historyCard: { marginBottom: Spacing.sm },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  historyOpponent: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary },
  historyMeta: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  historyScores: { flexDirection: 'row', gap: Spacing.md },
  historyScore: { alignItems: 'center' },
  historyScoreVal: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.gold },
  historyScoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textQuaternary, letterSpacing: 0.5, marginTop: 1 },
});
