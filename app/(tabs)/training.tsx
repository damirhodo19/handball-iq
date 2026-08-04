import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Brain, Zap, ArrowRight, Target, Shield, Crosshair, Users, Clock,
  ChevronRight, Library,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { SCENARIO_CATEGORIES } from '@/lib/scenario-library';
import { getScenarioCategories, getDailySession, HandballPosition } from '@/lib/positions';
import { loadProfile } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition, translateDifficulty } from '@/lib/translations';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Zap, ArrowRight, Target, Shield, Crosshair, Users, Clock,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: Colors.success,
  Intermediate: Colors.info,
  Advanced: Colors.warning,
  Expert: Colors.error,
};

export default function TrainingScreen() {
  const { t } = useTranslation();
  const profile = loadProfile();
  const position = (profile.position as HandballPosition) || 'Goalkeeper';
  const categories = getScenarioCategories(position);
  const dailySession = getDailySession(position);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}><Library size={20} color={Colors.gold} /></View>
            <View>
              <Text style={styles.headerTitle}>{t('training.title')}</Text>
              <Text style={styles.headerSub}>{translatePosition(position, t)} · {t('training.subtitle')}</Text>
            </View>
          </View>
        </View>

        {/* Featured Session */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <PressableCard
            onPress={() => router.push('/session')}
            variant="gradient"
            padding={0}
            shadow="cardLg"
            style={styles.featuredCard}
          >
            <View style={styles.featuredInner}>
              <View style={styles.featuredLeft}>
                <View style={styles.featuredIcon}><Brain size={24} color={Colors.gold} /></View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle}>{dailySession.title}</Text>
                  <Text style={styles.featuredDesc}>{t('training.scenariosCount', { n: 5 })} · {t('training.approxDuration', { n: 10 })}</Text>
                </View>
              </View>
              <View style={styles.featuredBtn}>
                <Text style={styles.featuredBtnText}>{t('training.startSession')}</Text>
                <ChevronRight size={16} color={Colors.background} />
              </View>
            </View>
          </PressableCard>
        </Animated.View>

        {/* Categories */}
        <SectionLabel label={t('training.chooseCategory')} />
        <View style={styles.categoryList}>
          {categories.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] ?? Target;
            const diffColor = DIFFICULTY_COLORS[cat.difficulty] ?? Colors.info;
            return (
              <Animated.View key={cat.id} entering={FadeInDown.delay(150 + i * 60).duration(400)}>
                <PressableCard
                  onPress={() => router.push('/session')}
                  variant="gradient"
                  shadow="card"
                  style={styles.categoryCard}
                >
                  <View style={styles.categoryRow}>
                    <View style={styles.categoryIcon}>
                      <Icon size={22} color={Colors.gold} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={styles.categoryDesc} numberOfLines={1}>{cat.description}</Text>
                      <View style={styles.categoryMeta}>
                        <View style={[styles.diffBadge, { backgroundColor: diffColor + '20', borderColor: diffColor }]}>
                          <Text style={[styles.diffText, { color: diffColor }]}>{translateDifficulty(cat.difficulty, t).toUpperCase()}</Text>
                        </View>
                        <Text style={styles.scenarioCount}>{t('training.scenariosCount', { n: cat.scenarioCount })}</Text>
                      </View>
                    </View>
                    <ChevronRight size={18} color={Colors.textTertiary} />
                  </View>
                </PressableCard>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 1 },

  featuredCard: { marginBottom: Spacing.lg, overflow: 'hidden' },
  featuredInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  featuredLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  featuredIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  featuredInfo: { flex: 1 },
  featuredTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  featuredDesc: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  featuredBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.pill },
  featuredBtnText: { color: Colors.background, fontFamily: 'Inter-ExtraBold', fontSize: 14 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm },

  categoryList: { gap: Spacing.sm },
  categoryCard: { padding: Spacing.md },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  categoryIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  categoryInfo: { flex: 1 },
  categoryName: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  categoryDesc: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  categoryMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 6 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm, borderWidth: 1 },
  diffText: { fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 0.5 },
  scenarioCount: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12 },
});
