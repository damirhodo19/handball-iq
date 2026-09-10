import { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert, BackHandler } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  ChevronRight, ChevronLeft, Check, Plus, X, FileText, Settings2, Crosshair, HelpCircle, BookOpen, Eye, Save, Upload, AlertCircle, Sparkles, Pencil
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import {
  loadScenario, createScenario, updateScenario, validateScenario,
  createScenarioAsync, updateScenarioAsync,
  AdminScenario, ScenarioStatus, Difficulty, MatchPhase, AttackOrDefence,
  DefensiveSystem, PressureLevel,
} from '@/lib/admin-storage';
import { SCENARIO_TEMPLATES } from '@/lib/admin-templates';
import { ALL_POSITIONS, AGE_GROUPS, PLAYING_LEVELS, HandballPosition } from '@/lib/positions';
import { useTranslation } from '@/hooks/useTranslation';
import {
  translatePosition, translateDifficulty, translateAgeGroup,
  translatePlayingLevel, translateStatus, translateMatchPhase,
  translateAttackDefence, translatePressure, translateCategory, translateDefensiveSystem,
} from '@/lib/translations';

const STEPS = ['Basic Info', 'Match Context', 'Decision', 'Learning', 'Preview'];
const STEP_ICONS = [FileText, Settings2, Crosshair, HelpCircle, BookOpen];

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const STATUSES: ScenarioStatus[] = ['Published', 'Draft', 'Archived'];
const MATCH_PHASES: MatchPhase[] = ['First Half', 'Second Half', 'Overtime', 'Warmup'];
const ATTACK_DEFENCE: AttackOrDefence[] = ['Attack', 'Defence'];
const DEFENSIVE_SYSTEMS: DefensiveSystem[] = ['6-0', '5-1', '4-2', '3-2-1', 'Man-to-Man', 'Mixed'];
const PRESSURE_LEVELS: PressureLevel[] = ['Low', 'Moderate', 'High', 'Critical'];

const EMPTY_DRAFT: Partial<AdminScenario> = {
  title: '',
  position: 'Goalkeeper',
  secondaryPositions: [],
  category: '',
  difficulty: 'Intermediate',
  ageGroup: 'All',
  playingLevel: 'All',
  status: 'Draft',
  matchPhase: 'First Half',
  minute: 15,
  score: '12-11',
  attackOrDefence: 'Defence',
  playersOnCourt: 7,
  defensiveSystem: '6-0',
  situation: '',
  question: '',
  answerOptions: ['', ''],
  recommendedAnswer: 0,
  explanation: '',
  learningObjective: '',
  mentalSkill: '',
  tacticalSkill: '',
  commonMistake: '',
  coachNote: '',
  pressureLevel: 'Moderate',
};

export default function AdminEditorScreen() {
  const { t } = useTranslation();
  const { id, mode, template } = useLocalSearchParams<{ id?: string; mode?: string; template?: string }>();
  const isEditMode = !!id;
  const isViewMode = mode === 'view';

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Partial<AdminScenario>>({ ...EMPTY_DRAFT });
  const [originalCreatedAt, setOriginalCreatedAt] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!isEditMode && !template);

  useEffect(() => {
    if (id) {
      const existing = loadScenario(id);
      if (existing) {
        setDraft({ ...existing });
        setOriginalCreatedAt(existing.createdAt);
      }
    } else if (template) {
      const tpl = SCENARIO_TEMPLATES.find((t) => t.id === template);
      if (tpl) {
        setDraft({ ...EMPTY_DRAFT, ...tpl.preset });
      }
    }
  }, [id, template]);

  const update = useCallback((updates: Partial<AdminScenario>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  }, []);

  const handleSaveDraft = async () => {
    if (isEditMode) {
      const { error } = await updateScenarioAsync(id!, { ...draft, status: 'Draft', createdAt: originalCreatedAt });
      if (error) { Alert.alert(t('editor.saveFailed'), error); return; }
    } else {
      const { error } = await createScenarioAsync({ ...draft, status: 'Draft' });
      if (error) { Alert.alert(t('editor.saveFailed'), error); return; }
    }
    setHasChanges(false);
    Alert.alert(t('editor.draftSaved'), t('editor.saved'), [{ text: t('common.ok'), onPress: () => router.back() }]);
  };

  const handlePublish = async () => {
    const validation = validateScenario(draft);
    if (!validation.isValid) {
      setErrors(validation.errors);
      Alert.alert(t('editor.cannotPublish'), validation.errors.join('\n'));
      return;
    }
    setErrors([]);
    if (isEditMode) {
      const { error } = await updateScenarioAsync(id!, { ...draft, status: 'Published', createdAt: originalCreatedAt });
      if (error) { Alert.alert(t('editor.publishFailed'), error); return; }
    } else {
      const { error } = await createScenarioAsync({ ...draft, status: 'Published' });
      if (error) { Alert.alert(t('editor.publishFailed'), error); return; }
    }
    setHasChanges(false);
    Alert.alert(t('editor.published'), t('editor.publishedMsg'), [{ text: t('common.ok'), onPress: () => router.back() }]);
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        t('editor.unsavedChanges'),
        t('editor.unsavedMsg'),
        [
          { text: t('common.stay'), style: 'cancel' },
          { text: t('common.leave'), style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  if (isViewMode) {
    return <PreviewView scenario={draft as AdminScenario} onBack={() => router.back()} onEdit={() => router.replace(`/admin/editor?id=${id}`)} />;
  }

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{isEditMode ? t('editor.editTitle') : t('editor.createTitle')}</Text>
            <Text style={styles.headerSub}>{t('editor.stepProgress', { n: step + 1, total: STEPS.length, step: t(`editor.step${['Basic', 'MatchContext', 'Decision', 'Learning', 'Preview'][step]}`) })}</Text>
          </View>
        </View>

        {/* Step Progress */}
        <View style={styles.stepBar}>
          {STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            const active = i === step;
            const completed = i < step;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.stepDot, active && styles.stepDotActive, completed && styles.stepDotDone]}
                onPress={() => setStep(i)}
                disabled={i > step && !hasChanges}
              >
                <Icon size={16} color={active ? Colors.background : completed ? Colors.gold : Colors.textTertiary} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Template Selection */}
        {showTemplates && step === 0 && !isEditMode && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <Card padding={Spacing.md} style={{ marginBottom: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm }}>
                <Sparkles size={18} color={Colors.gold} />
                <Text style={styles.templateTitle}>{t('editor.templateTitle')}</Text>
              </View>
              <Text style={styles.templateSub}>{t('editor.templateDesc')}</Text>
              <View style={{ gap: Spacing.sm, marginTop: Spacing.md }}>
                {SCENARIO_TEMPLATES.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.templateCard}
                    onPress={() => { setDraft({ ...EMPTY_DRAFT, ...t.preset }); setShowTemplates(false); setHasChanges(true); }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.templateName}>{t.name}</Text>
                      <Text style={styles.templateDesc}>{t.description}</Text>
                    </View>
                    <ChevronRight size={18} color={Colors.textQuaternary} />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.templateCard, { borderColor: Colors.gold }]}
                  onPress={() => { setShowTemplates(false); }}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.templateName, { color: Colors.gold }]}>{t('editor.scratchTitle')}</Text>
                    <Text style={styles.templateDesc}>{t('editor.scratchDesc')}</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.gold} />
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* Step Content */}
        {!showTemplates || step > 0 ? (
          <Animated.View key={step} entering={FadeIn.duration(300)}>
            {step === 0 && <Step1Basic draft={draft} update={update} />}
            {step === 1 && <Step2Context draft={draft} update={update} />}
            {step === 2 && <Step3Decision draft={draft} update={update} />}
            {step === 3 && <Step4Learning draft={draft} update={update} />}
            {step === 4 && <Step5Preview draft={draft} errors={errors} />}
          </Animated.View>
        ) : null}

        {/* Validation Errors */}
        {errors.length > 0 && step === 4 && (
          <Card padding={Spacing.md} style={{ marginTop: Spacing.md, borderColor: Colors.error }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm }}>
              <AlertCircle size={18} color={Colors.error} />
              <Text style={styles.errorTitle}>{t('editor.requiredMissing')}</Text>
            </View>
            {errors.map((e, i) => (
              <Text key={i} style={styles.errorItem}>• {e}</Text>
            ))}
          </Card>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          {step > 0 && (
            <Button
              label={t('common.back')}
              onPress={() => setStep(step - 1)}
              variant="dark"
              size="md"
              icon={<ChevronLeft size={18} color={Colors.textPrimary} />}
              style={{ flex: 1 }}
            />
          )}
          {step < STEPS.length - 1 ? (
            <Button
              label={t('common.next')}
              onPress={() => setStep(step + 1)}
              size="md"
              iconRight={<ChevronRight size={18} color={Colors.background} />}
              style={{ flex: 1 }}
            />
          ) : (
            <View style={{ flex: 1, gap: Spacing.sm }}>
              <Button label={t('editor.saveDraft')} onPress={handleSaveDraft} variant="outline" size="md" icon={<Save size={18} color={Colors.gold} />} />
              <Button label={t('editor.publishScenario')} onPress={handlePublish} size="md" icon={<Upload size={18} color={Colors.background} />} />
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

// ── Step 1: Basic Info ─────────────────────────────────────────────────────────

function Step1Basic({ draft, update }: { draft: Partial<AdminScenario>; update: (u: Partial<AdminScenario>) => void }) {
  const { t } = useTranslation();
  return (
    <Card padding={Spacing.md}>
      <FieldLabel label={t('editor.titleLabel')} required />
      <TextInput style={styles.input} placeholder={t('editor.titlePlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.title ?? ''} onChangeText={(v) => update({ title: v })} />

      <FieldLabel label={t('editor.primaryPosition')} required />
      <ChipSelector values={ALL_POSITIONS} current={draft.position as string} onChange={(v) => update({ position: v as HandballPosition })} translate={(v) => translatePosition(v, t)} />

      <FieldLabel label={t('editor.secondaryPositions')} />
      <MultiChipSelector
        values={ALL_POSITIONS}
        current={draft.secondaryPositions ?? []}
        onChange={(v) => update({ secondaryPositions: v as HandballPosition[] })}
        translate={(v) => translatePosition(v, t)}
      />

      <FieldLabel label={t('editor.categoryLabel')} required />
      <TextInput style={styles.input} placeholder={t('editor.categoryPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.category ?? ''} onChangeText={(v) => update({ category: v })} />

      <FieldLabel label={t('editor.difficultyLabel')} required />
      <ChipSelector values={DIFFICULTIES} current={draft.difficulty as string} onChange={(v) => update({ difficulty: v as Difficulty })} translate={(v) => translateDifficulty(v, t)} />

      <FieldLabel label={t('editor.ageGroupLabel')} />
      <ChipSelector values={[...AGE_GROUPS, 'All']} current={draft.ageGroup as string} onChange={(v) => update({ ageGroup: v as any })} translate={(v) => v === 'All' ? t('common.all') : translateAgeGroup(v, t)} />

      <FieldLabel label={t('editor.playingLevelLabel')} />
      <ChipSelector values={[...PLAYING_LEVELS, 'All']} current={draft.playingLevel as string} onChange={(v) => update({ playingLevel: v as any })} translate={(v) => v === 'All' ? t('common.all') : translatePlayingLevel(v, t)} />

      <FieldLabel label={t('editor.statusLabel')} />
      <ChipSelector values={STATUSES} current={draft.status as string} onChange={(v) => update({ status: v as ScenarioStatus })} translate={(v) => translateStatus(v, t)} />
    </Card>
  );
}

// ── Step 2: Match Context ──────────────────────────────────────────────────────

function Step2Context({ draft, update }: { draft: Partial<AdminScenario>; update: (u: Partial<AdminScenario>) => void }) {
  const { t } = useTranslation();
  return (
    <Card padding={Spacing.md}>
      <FieldLabel label={t('editor.matchPhase')} />
      <ChipSelector values={MATCH_PHASES} current={draft.matchPhase as string} onChange={(v) => update({ matchPhase: v as MatchPhase })} translate={(v) => translateMatchPhase(v, t)} />

      <FieldLabel label={t('editor.minute')} />
      <TextInput style={styles.input} placeholder={t('editor.minutePlaceholder')} placeholderTextColor={Colors.textQuaternary} value={String(draft.minute ?? 0)} onChangeText={(v) => update({ minute: parseInt(v) || 0 })} keyboardType="numeric" />

      <FieldLabel label={t('editor.score')} />
      <TextInput style={styles.input} placeholder={t('editor.scorePlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.score ?? ''} onChangeText={(v) => update({ score: v })} />

      <FieldLabel label={t('editor.attackDefence')} />
      <ChipSelector values={ATTACK_DEFENCE} current={draft.attackOrDefence as string} onChange={(v) => update({ attackOrDefence: v as AttackOrDefence })} translate={(v) => translateAttackDefence(v, t)} />

      <FieldLabel label={t('editor.playersOnCourt')} />
      <TextInput style={styles.input} placeholder={t('editor.playersPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={String(draft.playersOnCourt ?? 7)} onChangeText={(v) => update({ playersOnCourt: parseInt(v) || 7 })} keyboardType="numeric" />

      <FieldLabel label={t('editor.defensiveSystem')} />
      <ChipSelector values={DEFENSIVE_SYSTEMS} current={draft.defensiveSystem as string} onChange={(v) => update({ defensiveSystem: v as DefensiveSystem })} translate={(v) => translateDefensiveSystem(v, t)} />

      <FieldLabel label={t('editor.pressureLevel')} />
      <ChipSelector values={PRESSURE_LEVELS} current={draft.pressureLevel as string} onChange={(v) => update({ pressureLevel: v as PressureLevel })} translate={(v) => translatePressure(v, t)} />

      <FieldLabel label={t('editor.situationDesc')} required />
      <TextInput style={[styles.input, styles.textArea]} placeholder={t('editor.situationPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.situation ?? ''} onChangeText={(v) => update({ situation: v })} multiline textAlignVertical="top" />
    </Card>
  );
}

// ── Step 3: Decision ───────────────────────────────────────────────────────────

function Step3Decision({ draft, update }: { draft: Partial<AdminScenario>; update: (u: Partial<AdminScenario>) => void }) {
  const { t } = useTranslation();
  const options = draft.answerOptions ?? ['', ''];

  const updateOption = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = text;
    update({ answerOptions: newOptions });
  };

  const addOption = () => {
    if (options.length < 4) {
      update({ answerOptions: [...options, ''] });
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      let rec = draft.recommendedAnswer ?? 0;
      if (rec >= newOptions.length) rec = 0;
      update({ answerOptions: newOptions, recommendedAnswer: rec });
    }
  };

  return (
    <Card padding={Spacing.md}>
      <FieldLabel label={t('editor.questionLabel')} required />
      <TextInput style={[styles.input, styles.textArea]} placeholder={t('editor.questionPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.question ?? ''} onChangeText={(v) => update({ question: v })} multiline textAlignVertical="top" />

      <FieldLabel label={t('editor.answerOptions')} required />
      <Text style={styles.helperText}>{t('editor.tapCircle')}</Text>
      <View style={{ gap: Spacing.sm }}>
        {options.map((opt, i) => (
          <View key={i} style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.radio, (draft.recommendedAnswer ?? 0) === i && styles.radioActive]}
              onPress={() => update({ recommendedAnswer: i })}
            >
              {(draft.recommendedAnswer ?? 0) === i && <Check size={14} color={Colors.background} />}
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={t('editor.optionN', { n: i + 1 })}
              placeholderTextColor={Colors.textQuaternary}
              value={opt}
              onChangeText={(v) => updateOption(i, v)}
            />
            {options.length > 2 && (
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeOption(i)}>
                <X size={16} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {options.length < 4 && (
        <TouchableOpacity style={styles.addOptionBtn} onPress={addOption}>
          <Plus size={18} color={Colors.gold} />
          <Text style={styles.addOptionText}>{t('editor.addOption')}</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.helperText}>{t('editor.recommendedAnswer', { n: (draft.recommendedAnswer ?? 0) + 1 })}</Text>
    </Card>
  );
}

// ── Step 4: Learning Content ───────────────────────────────────────────────────

function Step4Learning({ draft, update }: { draft: Partial<AdminScenario>; update: (u: Partial<AdminScenario>) => void }) {
  const { t } = useTranslation();
  return (
    <Card padding={Spacing.md}>
      <FieldLabel label={t('editor.explanationLabel')} required />
      <TextInput style={[styles.input, styles.textArea]} placeholder={t('editor.explanationPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.explanation ?? ''} onChangeText={(v) => update({ explanation: v })} multiline textAlignVertical="top" />

      <FieldLabel label={t('editor.learningObjective')} required />
      <TextInput style={[styles.input, styles.textArea]} placeholder={t('editor.objectivePlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.learningObjective ?? ''} onChangeText={(v) => update({ learningObjective: v })} multiline textAlignVertical="top" />

      <FieldLabel label={t('editor.mentalSkill')} />
      <TextInput style={styles.input} placeholder={t('editor.mentalSkillPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.mentalSkill ?? ''} onChangeText={(v) => update({ mentalSkill: v })} />

      <FieldLabel label={t('editor.tacticalSkill')} />
      <TextInput style={styles.input} placeholder={t('editor.tacticalSkillPlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.tacticalSkill ?? ''} onChangeText={(v) => update({ tacticalSkill: v })} />

      <FieldLabel label={t('editor.commonMistake')} />
      <TextInput style={[styles.input, styles.textArea]} placeholder={t('editor.mistakePlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.commonMistake ?? ''} onChangeText={(v) => update({ commonMistake: v })} multiline textAlignVertical="top" />

      <FieldLabel label={t('editor.coachNote')} />
      <TextInput style={[styles.input, styles.textArea]} placeholder={t('editor.coachNotePlaceholder')} placeholderTextColor={Colors.textQuaternary} value={draft.coachNote ?? ''} onChangeText={(v) => update({ coachNote: v })} multiline textAlignVertical="top" />
    </Card>
  );
}

// ── Step 5: Preview ─────────────────────────────────────────────────────────────

function Step5Preview({ draft, errors }: { draft: Partial<AdminScenario>; errors: string[] }) {
  const { t } = useTranslation();
  const validation = validateScenario(draft);
  return (
    <View style={{ gap: Spacing.md }}>
      <Card padding={Spacing.md}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm }}>
          <Eye size={18} color={Colors.gold} />
          <Text style={styles.previewTitle}>{t('editor.playerPreview')}</Text>
        </View>
        <Text style={styles.previewMeta}>{translatePosition(draft.position ?? '', t)} · {translateCategory(draft.category ?? '', t)} · {translateDifficulty(draft.difficulty ?? '', t)}</Text>
        <Text style={styles.previewMinute}>{t('editor.minute')} {draft.minute} · {draft.score} · {translatePressure(draft.pressureLevel ?? '', t)}</Text>

        <View style={styles.previewDivider} />
        <Text style={styles.previewSituation}>{draft.situation || t('editor.noSituation')}</Text>

        <View style={styles.previewDivider} />
        <Text style={styles.previewQuestion}>{draft.question || t('editor.noQuestion')}</Text>
        <View style={{ gap: Spacing.sm, marginTop: Spacing.sm }}>
          {(draft.answerOptions ?? []).map((opt, i) => (
            <View key={i} style={[styles.previewOption, (draft.recommendedAnswer ?? 0) === i && styles.previewOptionCorrect]}>
              <View style={[styles.previewOptionDot, (draft.recommendedAnswer ?? 0) === i && styles.previewOptionDotCorrect]}>
                <Text style={styles.previewOptionLabel}>{String.fromCharCode(65 + i)}</Text>
              </View>
              <Text style={styles.previewOptionText}>{opt || t('editor.empty')}</Text>
              {(draft.recommendedAnswer ?? 0) === i && <Check size={16} color={Colors.success} />}
            </View>
          ))}
        </View>

        {draft.explanation && (
          <>
            <View style={styles.previewDivider} />
            <Text style={styles.previewExplanationLabel}>{t('editor.explanationLabel')}</Text>
            <Text style={styles.previewExplanation}>{draft.explanation}</Text>
          </>
        )}
        {draft.learningObjective && (
          <>
            <Text style={styles.previewExplanationLabel}>{t('editor.learningObjective')}</Text>
            <Text style={styles.previewExplanation}>{draft.learningObjective}</Text>
          </>
        )}
      </Card>

      <Card padding={Spacing.md}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          {validation.isValid ? (
            <>
              <Check size={18} color={Colors.success} />
              <Text style={[styles.validationTitle, { color: Colors.success }]}>{t('editor.readyToPublish')}</Text>
            </>
          ) : (
            <>
              <AlertCircle size={18} color={Colors.warning} />
              <Text style={[styles.validationTitle, { color: Colors.warning }]}>{t('editor.missingFields')}</Text>
            </>
          )}
        </View>
        {!validation.isValid && (
          <View style={{ marginTop: Spacing.sm }}>
            {validation.errors.map((e, i) => (
              <Text key={i} style={styles.errorItem}>• {e}</Text>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
}

// ── View Mode ───────────────────────────────────────────────────────────────────

function PreviewView({ scenario, onBack, onEdit }: { scenario: AdminScenario; onBack: () => void; onEdit: () => void }) {
  const { t } = useTranslation();
  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={onBack} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{scenario.title}</Text>
            <Text style={styles.headerSub}>{translatePosition(scenario.position, t)} · {translateCategory(scenario.category, t)} · {translateStatus(scenario.status, t)}</Text>
          </View>
        </View>
        <Step5Preview draft={scenario} errors={[]} />
        <View style={{ marginTop: Spacing.lg }}>
          <Button label={t('editor.editTitle')} onPress={onEdit} variant="gold" icon={<Pencil size={18} color={Colors.background} />} />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

// ── Shared Components ───────────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6, marginTop: Spacing.md }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {required && <Text style={styles.required}>*</Text>}
    </View>
  );
}

function ChipSelector({ values, current, onChange, translate }: { values: readonly string[]; current: string; onChange: (v: string) => void; translate?: (v: string) => string }) {
  return (
    <View style={styles.chipWrap}>
      {values.map((v) => {
        const active = current === v;
        return (
          <TouchableOpacity key={v} style={[styles.chip, active && styles.chipActive]} onPress={() => onChange(v)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{translate ? translate(v) : v}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MultiChipSelector({ values, current, onChange, translate }: { values: readonly string[]; current: string[]; onChange: (v: string[]) => void; translate?: (v: string) => string }) {
  const toggle = (v: string) => {
    if (current.includes(v)) {
      onChange(current.filter((x) => x !== v));
    } else {
      onChange([...current, v]);
    }
  };
  return (
    <View style={styles.chipWrap}>
      {values.map((v) => {
        const active = current.includes(v);
        return (
          <TouchableOpacity key={v} style={[styles.chip, active && styles.chipActive]} onPress={() => toggle(v)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{translate ? translate(v) : v}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  stepBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg, paddingHorizontal: Spacing.sm },
  stepDot: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  stepDotActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  stepDotDone: { borderColor: Colors.goldDeep, backgroundColor: Colors.goldSoft },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-SemiBold', letterSpacing: 0.3 },
  required: { fontSize: 13, color: Colors.error, fontFamily: 'Inter-Bold' },
  input: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-Medium' },
  chipTextActive: { color: Colors.background, fontFamily: 'Inter-Bold' },
  helperText: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Inter-Regular', marginTop: 4 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  radio: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { backgroundColor: Colors.success, borderColor: Colors.success },
  removeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.errorSoft, justifyContent: 'center', alignItems: 'center' },
  addOptionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.gold, borderStyle: 'dashed', marginTop: Spacing.sm },
  addOptionText: { fontSize: 14, color: Colors.gold, fontFamily: 'Inter-SemiBold' },
  navRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
  templateTitle: { fontSize: 16, color: Colors.textPrimary, fontFamily: 'Inter-Bold' },
  templateSub: { fontSize: 13, color: Colors.textTertiary, fontFamily: 'Inter-Regular' },
  templateCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm },
  templateName: { fontSize: 15, color: Colors.textPrimary, fontFamily: 'Inter-SemiBold' },
  templateDesc: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Inter-Regular', marginTop: 2 },
  previewTitle: { fontSize: 18, color: Colors.textPrimary, fontFamily: 'Inter-Bold' },
  previewMeta: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-Medium', marginTop: 4 },
  previewMinute: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Inter-Regular', marginTop: 2 },
  previewDivider: { height: 1, backgroundColor: Colors.hairline, marginVertical: Spacing.md },
  previewSituation: { fontSize: 15, color: Colors.textSecondary, fontFamily: 'Inter-Regular', lineHeight: 22 },
  previewQuestion: { fontSize: 16, color: Colors.textPrimary, fontFamily: 'Inter-SemiBold' },
  previewOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  previewOptionCorrect: { borderColor: Colors.success, backgroundColor: Colors.successSoft },
  previewOptionDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  previewOptionDotCorrect: { backgroundColor: Colors.success },
  previewOptionLabel: { fontSize: 13, color: Colors.textPrimary, fontFamily: 'Inter-Bold' },
  previewOptionText: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontFamily: 'Inter-Regular' },
  previewExplanationLabel: { fontSize: 12, color: Colors.gold, fontFamily: 'Inter-SemiBold', letterSpacing: 0.5, marginTop: Spacing.sm },
  previewExplanation: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter-Regular', lineHeight: 20, marginTop: 4 },
  errorTitle: { fontSize: 15, color: Colors.error, fontFamily: 'Inter-SemiBold' },
  errorItem: { fontSize: 13, color: Colors.error, fontFamily: 'Inter-Regular', paddingVertical: 2 },
  validationTitle: { fontSize: 15, fontFamily: 'Inter-SemiBold' },
});
