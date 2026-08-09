import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Plus, Check, X, Target, Trash2, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { loadGoals, createGoal, deleteGoal, CoachGoal, GOAL_TEMPLATES } from '@/lib/coach-storage';
import { buildPlayerProfile, SkillCategory } from '@/lib/coach-engine';
import { useTranslation } from '@/hooks/useTranslation';

export default function GoalsScreen() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<CoachGoal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [profile, setProfile] = useState(buildPlayerProfile());

  useFocusEffect(useCallback(() => {
    setGoals(loadGoals());
    setProfile(buildPlayerProfile());
  }, []));

  const getCurrentScore = (category: string): number => {
    const skill = profile.skills.find((s) => s.category === (category as SkillCategory));
    return skill ? skill.score : 0;
  };

  const handleCreate = (title: string, category: string, targetValue: number) => {
    const startScore = getCurrentScore(category);
    createGoal(title, category, targetValue, startScore);
    setGoals(loadGoals());
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    setGoals(loadGoals());
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('coachGoals.title')}</Text>
            <Text style={styles.headerSub}>{t('coachGoals.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Plus size={20} color={Colors.background} />
          </TouchableOpacity>
        </View>

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>{t('coachGoals.activeGoals', { n: activeGoals.length })}</Text>
            {activeGoals.map((goal, i) => {
              const currentScore = getCurrentScore(goal.category);
              const progress = Math.min(100, Math.max(0, ((currentScore - goal.startValue) / (goal.targetValue - goal.startValue)) * 100));
              return <GoalCard key={goal.id} goal={goal} currentScore={currentScore} progress={progress} onDelete={handleDelete} index={i} />;
            })}
          </View>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <View style={{ marginTop: Spacing.lg }}>
            <Text style={styles.sectionLabel}>{t('coachGoals.completed', { n: completedGoals.length })}</Text>
            {completedGoals.map((goal, i) => (
              <GoalCard key={goal.id} goal={goal} currentScore={getCurrentScore(goal.category)} progress={100} onDelete={handleDelete} index={i} />
            ))}
          </View>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyWrap}>
            <View style={styles.emptyIcon}><Target size={40} color={Colors.textQuaternary} /></View>
            <Text style={styles.emptyTitle}>{t('coachGoals.emptyTitle')}</Text>
            <Text style={styles.emptySub}>{t('coachGoals.emptySub')}</Text>
            <Button label={t('coachGoals.addFirstGoal')} onPress={() => setShowAddModal(true)} iconRight={<Plus size={20} color={Colors.background} />} style={{ marginTop: Spacing.lg }} />
          </Animated.View>
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <AddGoalModal visible={showAddModal} onClose={() => setShowAddModal(false)} onCreate={handleCreate} />
    </ScreenBackground>
  );
}

function GoalCard({ goal, currentScore, progress, onDelete, index }: { goal: CoachGoal; currentScore: number; progress: number; onDelete: (id: string) => void; index: number }) {
  const { t } = useTranslation();
  const isComplete = goal.completed || currentScore >= goal.targetValue;
  const progressColor = isComplete ? Colors.success : progress >= 66 ? Colors.gold : progress >= 33 ? Colors.warning : Colors.error;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Card variant="gradient" shadow="card" style={[styles.goalCard, isComplete && styles.goalCardComplete]}>
        <View style={styles.goalHeader}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalMeta}>
              {t('coachGoals.currentTarget', { current: currentScore, target: goal.targetValue })}
            </Text>
          </View>
          {isComplete && (
            <View style={styles.completeBadge}>
              <Check size={12} color={Colors.background} />
              <Text style={styles.completeText}>{t('coachGoals.done')}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(goal.id)}>
            <Trash2 size={15} color={Colors.textQuaternary} />
          </TouchableOpacity>
        </View>
        <View style={styles.progressRow}>
          <ProgressBar progress={progress / 100} height={6} color={progressColor} />
          <Text style={[styles.progressPct, { color: progressColor }]}>{Math.round(progress)}%</Text>
        </View>
      </Card>
    </Animated.View>
  );
}

function AddGoalModal({ visible, onClose, onCreate }: { visible: boolean; onClose: () => void; onCreate: (title: string, category: string, targetValue: number) => void }) {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customTarget, setCustomTarget] = useState('80');

  const handleCreate = () => {
    if (selectedTemplate !== null) {
      const tmpl = GOAL_TEMPLATES[selectedTemplate];
      onCreate(tmpl.title, tmpl.category, tmpl.targetValue);
    } else if (customTitle.trim()) {
      onCreate(customTitle.trim(), 'decisionMaking', parseInt(customTarget) || 80);
    }
    setSelectedTemplate(null);
    setCustomTitle('');
    setCustomTarget('80');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('coachGoals.newGoal')}</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
              <X size={20} color={Colors.gold} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalLabel}>{t('coachGoals.chooseTemplate')}</Text>
            {GOAL_TEMPLATES.map((tmpl, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.templateCard, selectedTemplate === i && styles.templateCardActive]}
                onPress={() => { setSelectedTemplate(i); setCustomTitle(''); }}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.templateTitle}>{tmpl.title}</Text>
                  <Text style={styles.templateDesc}>{tmpl.description}</Text>
                  <Text style={styles.templateTarget}>{t('coachGoals.targetLabel', { n: tmpl.targetValue })}</Text>
                </View>
                {selectedTemplate === i && (
                  <View style={styles.templateCheck}><Check size={14} color={Colors.background} /></View>
                )}
              </TouchableOpacity>
            ))}

            <Text style={[styles.modalLabel, { marginTop: Spacing.lg }]}>{t('coachGoals.orCustom')}</Text>
            <TextInput
              style={styles.customInput}
              placeholder={t('coachGoals.titlePlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
              value={customTitle}
              onChangeText={(text) => { setCustomTitle(text); setSelectedTemplate(null); }}
            />
            <TextInput
              style={[styles.customInput, { marginTop: Spacing.sm }]}
              placeholder={t('coachGoals.targetPlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
              value={customTarget}
              onChangeText={(text) => { setCustomTarget(text); setSelectedTemplate(null); }}
              keyboardType="numeric"
            />
          </ScrollView>

          <Button
            label={t('coachGoals.createGoal')}
            onPress={handleCreate}
            disabled={selectedTemplate === null && !customTitle.trim()}
            iconRight={<Plus size={20} color={Colors.background} />}
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm },

  goalCard: { gap: Spacing.sm, marginBottom: Spacing.sm },
  goalCardComplete: { borderColor: Colors.success, borderWidth: 1.5 },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  goalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.textPrimary },
  goalMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary },
  completeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  completeText: { fontFamily: 'Inter-ExtraBold', fontSize: 10, color: Colors.background, letterSpacing: 1 },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.surfaceRaised, justifyContent: 'center', alignItems: 'center' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressPct: { fontFamily: 'Inter-ExtraBold', fontSize: 14, minWidth: 40, textAlign: 'right' },

  emptyWrap: { alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.xxl },
  emptyIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  emptyTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary, marginTop: Spacing.md },
  emptySub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.lg, maxHeight: '85%', borderWidth: 1, borderColor: Colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  modalLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1.5, marginBottom: Spacing.sm },

  templateCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border, marginBottom: Spacing.sm },
  templateCardActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  templateTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.textPrimary },
  templateDesc: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, lineHeight: 18 },
  templateTarget: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, marginTop: 2 },
  templateCheck: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },

  customInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15, paddingHorizontal: Spacing.md, paddingVertical: 13 },
});
