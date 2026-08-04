import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, UserCircle, CheckCircle2, AlertTriangle, Target } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { buildPlayerProfile, classifyPlayerType, PlayerTypeInfo } from '@/lib/coach-engine';
import { useTranslation } from '@/hooks/useTranslation';

export default function TypeScreen() {
  const { t } = useTranslation();
  const [typeInfo, setTypeInfo] = useState<PlayerTypeInfo | null>(null);
  const [overall, setOverall] = useState(0);

  useFocusEffect(useCallback(() => {
    const profile = buildPlayerProfile();
    setTypeInfo(classifyPlayerType(profile));
    setOverall(profile.overallScore);
  }, []));

  if (!typeInfo) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('coachType.analyzing')}</Text></View>
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
            <Text style={styles.headerTitle}>{t('coachType.title')}</Text>
            <Text style={styles.headerSub}>{t('coachType.subtitle')}</Text>
          </View>
        </View>

        {/* Hero type card */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.typeCard}>
            <View style={styles.typeIconWrap}><UserCircle size={40} color={Colors.gold} /></View>
            <Text style={styles.typeLabel}>{t('coachType.style')}</Text>
            <Text style={styles.typeName}>{typeInfo.type}</Text>
            <Text style={styles.typeDesc}>{typeInfo.description}</Text>
            <View style={styles.typeScoreRow}>
              <Text style={styles.typeScoreLabel}>{t('coachType.overallScore')}</Text>
              <Text style={styles.typeScoreValue}>{overall}%</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Strengths */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.listCard}>
            <View style={styles.listHeader}>
              <View style={[styles.listIcon, { backgroundColor: Colors.successSoft, borderColor: Colors.success }]}>
                <CheckCircle2 size={18} color={Colors.success} />
              </View>
              <Text style={styles.listTitle}>{t('coachType.strengths')}</Text>
            </View>
            {typeInfo.strengths.map((s, i) => (
              <View key={i} style={styles.listItem}>
                <View style={[styles.listDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.listText}>{s}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Risks */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)}>
          <Card variant="gradient" shadow="card" style={styles.listCard}>
            <View style={styles.listHeader}>
              <View style={[styles.listIcon, { backgroundColor: Colors.warningSoft, borderColor: Colors.warning }]}>
                <AlertTriangle size={18} color={Colors.warning} />
              </View>
              <Text style={styles.listTitle}>{t('coachType.risks')}</Text>
            </View>
            {typeInfo.risks.map((r, i) => (
              <View key={i} style={styles.listItem}>
                <View style={[styles.listDot, { backgroundColor: Colors.warning }]} />
                <Text style={styles.listText}>{r}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Suggested Focus */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card variant="gradient" shadow="cardLg" style={styles.focusCard}>
            <View style={styles.focusHeader}>
              <View style={styles.focusIcon}><Target size={18} color={Colors.gold} /></View>
              <Text style={styles.focusTitle}>{t('coachType.suggestedFocus')}</Text>
            </View>
            <Text style={styles.focusText}>{typeInfo.suggestedFocus}</Text>
          </Card>
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

  typeCard: { gap: Spacing.sm, alignItems: 'center', marginBottom: Spacing.md, borderColor: Colors.gold, borderWidth: 1.5 },
  typeIconWrap: { width: 72, height: 72, borderRadius: 22, backgroundColor: Colors.goldSoft, borderWidth: 2, borderColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  typeLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 2, marginTop: Spacing.sm },
  typeName: { fontFamily: 'Inter-ExtraBold', fontSize: 26, color: Colors.textPrimary, textAlign: 'center' },
  typeDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: Spacing.xs },
  typeScoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.hairline, width: '100%', justifyContent: 'center' },
  typeScoreLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary },
  typeScoreValue: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.gold },

  listCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  listHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  listIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  listTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.textPrimary },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: 4 },
  listDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  listText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  focusCard: { gap: Spacing.sm, borderColor: Colors.gold, borderWidth: 1.5 },
  focusHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  focusIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  focusTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 16, color: Colors.gold },
  focusText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },
});
