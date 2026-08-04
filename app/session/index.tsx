import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Shield, Clock, Layers, AlertTriangle, ArrowRight, ChevronLeft } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { SESSION_INFO } from '@/lib/scenarios';
import { useTranslation } from '@/hooks/useTranslation';

export default function SessionIntroScreen() {
  const { t } = useTranslation();
  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <ChevronLeft size={22} color={Colors.textSecondary} />
          <Text style={styles.backText}>{t('common.backToHome')}</Text>
        </TouchableOpacity>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <View style={styles.headerIcon}>
            <Shield size={32} color={Colors.gold} />
          </View>
          <Text style={styles.sessionLabel}>{SESSION_INFO.subtitle}</Text>
          <Text style={styles.sessionNumber}>{SESSION_INFO.sessionNumber}</Text>
          <Text style={styles.sessionTitle}>{SESSION_INFO.title}</Text>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Text style={styles.description}>{SESSION_INFO.description}</Text>
        </Animated.View>

        {/* Session Structure */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Text style={styles.sectionLabel}>{t('training.sessionStructure')}</Text>
          <Card variant="gradient" shadow="card" style={styles.structureCard}>
            <View style={styles.structureRow}>
              <View style={styles.structureIcon}><Layers size={18} color={Colors.gold} /></View>
              <Text style={styles.structureText}>{SESSION_INFO.structure[0]}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.structureRow}>
              <View style={styles.structureIcon}><Clock size={18} color={Colors.gold} /></View>
              <Text style={styles.structureText}>{SESSION_INFO.structure[1]}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.structureRow}>
              <View style={styles.structureIcon}><Shield size={18} color={Colors.gold} /></View>
              <Text style={styles.structureText}>{SESSION_INFO.structure[2]}</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Instruction */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.instructionBox}>
            <View style={styles.instructionHeader}>
              <AlertTriangle size={15} color={Colors.gold} />
              <Text style={styles.instructionLabel}>{t('training.instruction')}</Text>
            </View>
            <Text style={styles.instructionText}>{SESSION_INFO.instruction}</Text>
          </View>
        </Animated.View>

        {/* Meta row */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={14} color={Colors.textTertiary} />
              <Text style={styles.metaText}>{SESSION_INFO.duration}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Layers size={14} color={Colors.textTertiary} />
              <Text style={styles.metaText}>{SESSION_INFO.difficulty}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.buttonWrap}>
          <Button
            label={t('training.beginSession')}
            onPress={() => router.push('/session/scenario')}
            iconRight={<ArrowRight size={20} color={Colors.background} />}
          />
          <Button
            label={t('common.backToHome')}
            variant="dark"
            onPress={() => router.replace('/(tabs)/home')}
            style={{ marginTop: Spacing.sm }}
          />
        </Animated.View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: Spacing.xl, alignSelf: 'flex-start' },
  backText: { color: Colors.textSecondary, fontFamily: 'Inter-Medium', fontSize: 15 },

  headerIcon: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg,
  },
  sessionLabel: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13, letterSpacing: 2 },
  sessionNumber: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 14, marginTop: 4 },
  sessionTitle: { ...Typography.h1, fontFamily: 'Inter-ExtraBold', color: Colors.textPrimary, fontSize: 26, lineHeight: 32, marginTop: Spacing.xs },

  description: { ...Typography.body, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 15, lineHeight: 23, marginTop: Spacing.lg, marginBottom: Spacing.xl },

  sectionLabel: { ...Typography.micro, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1.5, marginBottom: Spacing.sm },
  structureCard: { gap: 0, padding: 0 },
  structureRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg },
  structureIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  structureText: { color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15 },
  divider: { height: 1, backgroundColor: Colors.hairline, marginLeft: 68 },

  instructionBox: {
    backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.xl, gap: Spacing.sm,
  },
  instructionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  instructionLabel: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 12, letterSpacing: 1 },
  instructionText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.lg, marginTop: Spacing.xl },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 14 },
  metaDivider: { width: 1, height: 20, backgroundColor: Colors.hairline },

  buttonWrap: { marginTop: Spacing.xxl },
});
