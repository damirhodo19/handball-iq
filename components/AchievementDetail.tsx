import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { useTranslation } from '@/hooks/useTranslation';
import {
  ACHIEVEMENTS,
  getAchievement,
  getAchievementProgress,
} from '@/lib/development/achievements';
import type { UnlockedAchievement } from '@/lib/development/types';

interface Props {
  achievementId: string | null;
  unlocked?: UnlockedAchievement | null;
  progressCtx: {
    sessionCount: number;
    decisionCount: number;
    streak: number;
    matchCount: number;
    programWeeks: number;
    programsCompleted: number;
  };
  onClose: () => void;
}

export function AchievementDetail({ achievementId, unlocked, progressCtx, onClose }: Props) {
  const { t } = useTranslation();
  const def = achievementId ? getAchievement(achievementId) : undefined;
  if (!def || !achievementId) return null;

  const progress = unlocked ? null : getAchievementProgress(achievementId, progressCtx);
  const rarity = def.rarity ?? 'common';
  const rarityLabel =
    rarity === 'rare' ? t('sprint5.ach.rare') : rarity === 'advanced' ? t('sprint5.ach.advanced') : t('sprint5.ach.common');

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.rarity}>{rarityLabel}</Text>
          <Text style={styles.title}>{t(`dev.achievement.${def.id}`)}</Text>
          <Text style={styles.desc}>
            {def.descriptionKey ? t(def.descriptionKey) : t(`dev.achievement.${def.id}`)}
          </Text>
          {unlocked ? (
            <Text style={styles.meta}>
              {t('sprint5.ach.unlocked')}: {unlocked.unlockedAt.slice(0, 10)}
            </Text>
          ) : (
            <>
              <Text style={styles.meta}>{t('sprint5.ach.locked')}</Text>
              {progress ? (
                <Text style={styles.meta}>
                  {t('sprint5.ach.progress', { current: progress.current, target: progress.target })}
                </Text>
              ) : null}
            </>
          )}
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function listAchievementDefs() {
  return ACHIEVEMENTS;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  rarity: { ...Typography.caption, color: Colors.gold, textTransform: 'uppercase' },
  title: { ...Typography.h2, color: Colors.textPrimary },
  desc: { ...Typography.body, color: Colors.textTertiary },
  meta: { ...Typography.caption, color: Colors.textTertiary },
  btn: {
    marginTop: Spacing.md,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.goldSoft,
  },
  btnText: { ...Typography.caption, color: Colors.gold },
});
