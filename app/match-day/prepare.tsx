import { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { ArrowLeft, ArrowRight, Pause, Play, SkipForward, Check } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground, ProgressBar } from '@/components/Screen';
import { useMatchDay } from '@/context/MatchDayContext';
import { VISUALIZATION_STEPS, getScenariosForGoals, TacticalScenario } from '@/lib/match-day-scenarios';
import { calculateReadiness } from '@/lib/match-day-storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translateMatchType, translateMatchLocation, translatePlayingTime, translatePersonalGoal } from '@/lib/translations';

// ── Constants ─────────────────────────────────────────────────────────────────

const LEAVE_BEHIND_KEYS = [
  'matchDay.leaveBehind1',
  'matchDay.leaveBehind2',
  'matchDay.leaveBehind3',
  'matchDay.leaveBehind4',
  'matchDay.leaveBehind5',
  'matchDay.leaveBehind6',
];

const RESET_MESSAGE_KEY = 'matchDay.resetMessage';

type BreathPhase = 'in' | 'hold' | 'out';

const PHASE_DURATIONS: Record<BreathPhase, number> = { in: 4, hold: 2, out: 6 };
const PHASE_ORDER: BreathPhase[] = ['in', 'hold', 'out'];

// ── Breathing Timer Component ─────────────────────────────────────────────────

function BreathingTimer({
  totalCycles,
  onComplete,
}: {
  totalCycles: number;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const [cyclesDone, setCyclesDone] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASE_DURATIONS.in);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = PHASE_ORDER[phaseIdx];
  const scale = useSharedValue(1);

  // Animate circle based on phase
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(currentPhase === 'in' ? 1.25 : currentPhase === 'hold' ? 1.25 : 1, {
          duration: PHASE_DURATIONS[currentPhase] * 1000,
        }),
      ),
      1,
    );
  }, [currentPhase]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev > 1) return prev - 1;
      // Move to next phase
      setPhaseIdx((pi) => {
        const next = (pi + 1) % 3;
        const nextPhase = PHASE_ORDER[next];
        setSecondsLeft(PHASE_DURATIONS[nextPhase]);
        if (next === 0) {
          // Completed a cycle
          setCyclesDone((cd) => {
            const newCd = cd + 1;
            if (newCd >= totalCycles) {
              setDone(true);
            }
            return newCd;
          });
        }
        return next;
      });
      return 0;
    });
  }, [totalCycles]);

  useEffect(() => {
    if (paused || done) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, done, tick]);

  const phaseColor =
    currentPhase === 'in' ? Colors.info :
    currentPhase === 'hold' ? Colors.gold :
    Colors.success;

  return (
    <View style={bStyles.wrap}>
      {/* Cycle count */}
      <Text style={bStyles.cycleText}>{t('matchDay.cycleProgress', { n: Math.min(cyclesDone + 1, totalCycles), total: totalCycles })}</Text>

      {/* Animated circle */}
      <View style={bStyles.circleWrap}>
        <Animated.View style={[bStyles.circleOuter, { borderColor: phaseColor + '44' }, circleStyle]}>
          <View style={[bStyles.circleInner, { borderColor: phaseColor }]}>
            <Text style={[bStyles.phaseLabel, { color: phaseColor }]}>{currentPhase === 'in' ? t('matchDay.breatheIn') : currentPhase === 'hold' ? t('matchDay.hold') : t('matchDay.breatheOut')}</Text>
            <Text style={[bStyles.countdown, { color: phaseColor }]}>{done ? '✓' : secondsLeft}</Text>
          </View>
        </Animated.View>
      </View>

      {/* Phase guide */}
      <View style={bStyles.phaseRow}>
        {PHASE_ORDER.map((p) => (
          <View key={p} style={bStyles.phaseItem}>
            <View style={[bStyles.phaseDot, { backgroundColor: currentPhase === p ? phaseColor : Colors.border }]} />
            <Text style={bStyles.phaseLabel2}>{p === 'in' ? t('matchDay.breatheIn') : p === 'hold' ? t('matchDay.hold') : t('matchDay.breatheOut')}</Text>
            <Text style={bStyles.phaseDur}>{PHASE_DURATIONS[p]}s</Text>
          </View>
        ))}
      </View>

      {/* Controls */}
      <View style={bStyles.controls}>
        {!done && (
          <TouchableOpacity style={bStyles.controlBtn} onPress={() => setPaused((p) => !p)}>
            {paused ? <Play size={18} color={Colors.gold} /> : <Pause size={18} color={Colors.gold} />}
            <Text style={bStyles.controlText}>{paused ? t('matchDay.breatheIn') : t('matchDay.pause')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={bStyles.controlBtn} onPress={onComplete}>
          <SkipForward size={18} color={Colors.textTertiary} />
          <Text style={[bStyles.controlText, { color: Colors.textTertiary }]}>{t('matchDay.skip')}</Text>
        </TouchableOpacity>
      </View>

      {done && (
        <Animated.View entering={FadeIn.duration(400)} style={bStyles.doneRow}>
          <View style={bStyles.doneCheck}><Check size={18} color={Colors.success} /></View>
          <Text style={bStyles.doneText}>{t('matchDay.breathingComplete')}</Text>
        </Animated.View>
      )}

      {done && (
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ marginTop: Spacing.md }}>
          <Button label={t('matchDay.breathingComplete')} onPress={onComplete} iconRight={<ArrowRight size={20} color={Colors.background} />} />
        </Animated.View>
      )}
    </View>
  );
}

// ── Main Prepare Screen ───────────────────────────────────────────────────────

export default function PrepareScreen() {
  const {
    activePrep, prepMode, currentStep, goToStep,
    leaveBehinds, setLeaveBehinds,
    visualStep, setVisualStep,
    tacticalScenarios, setTacticalScenarios,
    tacticalAnswers, submitTacticalAnswer,
    personalStatement, setPersonalStatement,
    finishPrep,
  } = useMatchDay();

  const { t } = useTranslation();
  const [showResetMessage, setShowResetMessage] = useState(false);
  const [tacticalStep, setTacticalStep] = useState(0);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const isQuick = prepMode === 'quick';
  const totalSteps = isQuick ? 3 : 5;
  const totalCycles = isQuick ? 2 : 4;
  const totalVisualize = isQuick ? 1 : 3;
  const totalTactical = isQuick ? 3 : 5;

  // Generate scenarios once
  useEffect(() => {
    if (tacticalScenarios.length === 0 && activePrep) {
      const s = getScenariosForGoals(activePrep.setup.goals, totalTactical);
      setTacticalScenarios(s);
    }
  }, [activePrep]);

  if (!activePrep) {
    return (
      <ScreenBackground>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('matchDay.loadingPrep')}</Text></View>
      </ScreenBackground>
    );
  }

  const stepLabels = isQuick
    ? ['Breathing', 'Visualization', 'Tactical & Plan']
    : ['Breathing', 'Mental Reset', 'Visualization', 'Tactical', 'Match Plan'];

  const currentScenario: TacticalScenario | undefined = tacticalScenarios[tacticalStep];
  const currentAnswer = tacticalAnswers.find((a) => a.scenarioIndex === tacticalStep);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
      setSelectedDecision(null);
      setShowExplanation(false);
    } else {
      finishPrep();
      router.replace('/match-day/ready');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  };

  const handleDecisionSelect = (id: string, scenario: TacticalScenario) => {
    if (currentAnswer) return;
    setSelectedDecision(id);
    submitTacticalAnswer({
      scenarioIndex: tacticalStep,
      chosenId: id,
      isCorrect: id === scenario.correctId,
    });
    setShowExplanation(true);
  };

  const nextTactical = () => {
    if (tacticalStep < totalTactical - 1) {
      setTacticalStep((t) => t + 1);
      setSelectedDecision(null);
      setShowExplanation(false);
    } else {
      nextStep();
    }
  };

  // Determine which step to render (for quick mode, map 3 steps to content)
  const getStepContent = () => {
    // Quick: 0=breathing, 1=visualization, 2=tactical+plan
    // Complete: 0=breathing, 1=reset, 2=visualization, 3=tactical, 4=plan
    if (isQuick) {
      if (currentStep === 0) return 'breathing';
      if (currentStep === 1) return 'visualization';
      return 'tactical-and-plan';
    }
    if (currentStep === 0) return 'breathing';
    if (currentStep === 1) return 'mental-reset';
    if (currentStep === 2) return 'visualization';
    if (currentStep === 3) return 'tactical';
    return 'plan';
  };

  const content = getStepContent();

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header nav */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={prevStep} disabled={currentStep === 0}>
            <ArrowLeft size={20} color={currentStep === 0 ? Colors.textQuaternary : Colors.gold} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepLabel}>{t('matchDay.stepProgress', { n: currentStep + 1, total: totalSteps })}</Text>
            <Text style={styles.stepName}>{stepLabels[currentStep]}</Text>
          </View>
          <Text style={styles.opponentTag}>{t('matchDay.vsOpponent', { opponent: activePrep.setup.opponent })}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressWrap}>
          <ProgressBar progress={(currentStep + 1) / totalSteps} height={4} color={Colors.gold} />
          <View style={styles.stepDots}>
            {stepLabels.map((_, i) => (
              <View key={i} style={[styles.dot, i <= currentStep && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ── Step content ── */}

        {/* BREATHING */}
        {content === 'breathing' && (
          <Animated.View key="breathing" entering={FadeInDown.duration(500)}>
            <Card variant="gradient" shadow="cardLg" style={styles.stepCard}>
              <Text style={styles.stepTitle}>{t('matchDay.breathingTitle')}</Text>
              <Text style={styles.stepDesc}>
                {t('matchDay.breathingInstruction')}
              </Text>
              <BreathingTimer totalCycles={totalCycles} onComplete={nextStep} />
            </Card>
          </Animated.View>
        )}

        {/* MENTAL RESET (complete only) */}
        {content === 'mental-reset' && (
          <Animated.View key="reset" entering={FadeInDown.duration(500)}>
            <Card variant="gradient" shadow="cardLg" style={styles.stepCard}>
              <Text style={styles.stepTitle}>{t('matchDay.mentalResetTitle')}</Text>
              <Text style={styles.stepDesc}>{t('matchDay.mentalResetSub')}</Text>
              <Text style={styles.questionText}>{t('matchDay.leaveBehindQuestion')}</Text>
              <View style={styles.optionList}>
                {LEAVE_BEHIND_KEYS.map((key) => {
                  const opt = t(key);
                  const active = leaveBehinds === opt;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.optionBtn, active && styles.optionBtnActive]}
                      onPress={() => { setLeaveBehinds(opt); setShowResetMessage(true); }}
                      activeOpacity={0.8}
                    >
                      {active && <Check size={14} color={Colors.background} />}
                      <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {showResetMessage && leaveBehinds && (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.resetMsg}>
                  <Text style={styles.resetMsgText}>{t(RESET_MESSAGE_KEY)}</Text>
                </Animated.View>
              )}
              {leaveBehinds && (
                <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                  <Button label={t('matchDay.breathingComplete')} onPress={nextStep} iconRight={<ArrowRight size={20} color={Colors.background} />} />
                </Animated.View>
              )}
            </Card>
          </Animated.View>
        )}

        {/* VISUALIZATION */}
        {content === 'visualization' && (
          <Animated.View key="viz" entering={FadeInDown.duration(500)}>
            <Card variant="gradient" shadow="cardLg" style={styles.stepCard}>
              <Text style={styles.stepTitle}>{t('matchDay.visualizationTitle')}</Text>
              <Text style={styles.stepDesc}>
                {t('matchDay.visualizationInstruction')}
              </Text>

              {/* Visualization step indicator */}
              <View style={styles.vizStepRow}>
                {Array.from({ length: totalVisualize }).map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setVisualStep(i)}
                    style={[styles.vizDot, i === visualStep && styles.vizDotActive]}
                  />
                ))}
              </View>

              <Animated.View key={`viz-${visualStep}`} entering={FadeIn.duration(400)} style={styles.vizCard}>
                <View style={styles.vizBadge}>
                  <Text style={styles.vizBadgeText}>{t('matchDay.situationN', { n: visualStep + 1 })}</Text>
                </View>
                <Text style={styles.vizTitle}>{VISUALIZATION_STEPS[visualStep].title}</Text>
                <Text style={styles.vizText}>{VISUALIZATION_STEPS[visualStep].instruction}</Text>
              </Animated.View>

              <View style={styles.vizNav}>
                <TouchableOpacity
                  style={[styles.vizNavBtn, visualStep === 0 && styles.vizNavBtnDisabled]}
                  onPress={() => { if (visualStep > 0) setVisualStep(visualStep - 1); }}
                  disabled={visualStep === 0}
                >
                  <ArrowLeft size={18} color={visualStep === 0 ? Colors.textQuaternary : Colors.gold} />
                  <Text style={[styles.vizNavText, visualStep === 0 && { color: Colors.textQuaternary }]}>{t('matchDay.previous')}</Text>
                </TouchableOpacity>

                {visualStep < totalVisualize - 1 ? (
                  <TouchableOpacity style={styles.vizNavBtn} onPress={() => setVisualStep(visualStep + 1)}>
                    <Text style={styles.vizNavText}>{t('matchDay.nextScenario')}</Text>
                    <ArrowRight size={18} color={Colors.gold} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.vizNavBtn} onPress={nextStep}>
                    <Text style={styles.vizNavText}>{t('matchDay.breathingComplete')}</Text>
                    <ArrowRight size={18} color={Colors.gold} />
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          </Animated.View>
        )}

        {/* TACTICAL */}
        {(content === 'tactical' || content === 'tactical-and-plan') && currentScenario && (
          <Animated.View key={`tac-${tacticalStep}`} entering={FadeInDown.duration(500)}>
            <Card variant="gradient" shadow="cardLg" style={styles.stepCard}>
              <View style={styles.tacHeader}>
                <Text style={styles.stepTitle}>{t('matchDay.tacticalTitle')}</Text>
                <Text style={styles.tacCount}>{t('matchDay.scoreCounter', { n: tacticalStep + 1, total: totalTactical })}</Text>
              </View>
              <View style={styles.tacTypeBadge}>
                <Text style={styles.tacTypeText}>{currentScenario.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.questionText}>{currentScenario.description}</Text>

              <View style={styles.optionList}>
                {currentScenario.decisions.map((dec, i) => {
                  const chosen = selectedDecision === dec.id || currentAnswer?.chosenId === dec.id;
                  const isCorrect = showExplanation && dec.id === currentScenario.correctId;
                  const isWrong = showExplanation && chosen && dec.id !== currentScenario.correctId;
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <TouchableOpacity
                      key={dec.id}
                      style={[
                        styles.decBtn,
                        chosen && styles.decBtnSelected,
                        isCorrect && styles.decBtnCorrect,
                        isWrong && styles.decBtnWrong,
                      ]}
                      onPress={() => handleDecisionSelect(dec.id, currentScenario)}
                      disabled={showExplanation}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.decLetter, chosen && styles.decLetterActive, isCorrect && styles.decLetterCorrect, isWrong && styles.decLetterWrong]}>
                        <Text style={[styles.decLetterText, (chosen || isCorrect || isWrong) && styles.decLetterTextActive]}>{letter}</Text>
                      </View>
                      <Text style={[styles.decText, chosen && styles.decTextSelected]}>{dec.text}</Text>
                      {isCorrect && <Check size={16} color={Colors.success} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {showExplanation && (
                <Animated.View entering={FadeInDown.duration(400)} style={styles.explanationBox}>
                  <View style={styles.explanationHeader}>
                    <View style={styles.explanationDot} />
                    <Text style={styles.explanationTitle}>
                      {currentAnswer?.isCorrect ? t('matchDay.correctPrefix') : t('matchDay.recommendedPrefix')}{currentScenario.decisions.find((d) => d.id === currentScenario.correctId)?.text.slice(0, 30)}...
                    </Text>
                  </View>
                  <Text style={styles.explanationText}>{currentScenario.explanation}</Text>
                  <Button
                    label={tacticalStep < totalTactical - 1 ? t('matchDay.nextScenario') : content === 'tactical-and-plan' ? t('matchDay.continueToPlan') : t('matchDay.breathingComplete')}
                    onPress={nextTactical}
                    iconRight={<ArrowRight size={20} color={Colors.background} />}
                  />
                </Animated.View>
              )}
            </Card>
          </Animated.View>
        )}

        {/* PERSONAL PLAN (also shown after tactical in quick mode via nextStep) */}
        {content === 'plan' && (
          <Animated.View key="plan" entering={FadeInDown.duration(500)}>
            <Card variant="gradient" shadow="cardLg" style={styles.stepCard}>
              <Text style={styles.stepTitle}>{t('matchDay.planTitle')}</Text>

              {/* Setup summary */}
              <View style={styles.planSummary}>
                <SummaryRow label={t('matchDay.planOpponent')} value={t('matchDay.vsOpponent', { opponent: activePrep.setup.opponent })} />
                <SummaryRow label={t('matchDay.planMatch')} value={`${translateMatchType(activePrep.setup.matchType, t)} · ${translateMatchLocation(activePrep.setup.location, t)}`} />
                <SummaryRow label={t('matchDay.planRole')} value={translatePlayingTime(activePrep.setup.playingTime, t)} />
                <SummaryRow label={t('matchDay.planGoals')} value={activePrep.setup.goals.map((g) => translatePersonalGoal(g, t)).join(', ')} />
              </View>

              {/* Fixed reminders */}
              <View style={styles.reminders}>
                <Reminder text={t('matchDay.reminder1')} />
                <Reminder text={t('matchDay.reminder2')} />
                <Reminder text={t('matchDay.reminder3')} />
              </View>

              {/* Editable personal statement */}
              <View style={styles.statementWrap}>
                <Text style={styles.statementLabel}>{t('matchDay.yourStatement')}</Text>
                <TextInput
                  style={styles.statementInput}
                  multiline
                  value={personalStatement}
                  onChangeText={setPersonalStatement}
                  placeholderTextColor={Colors.textQuaternary}
                  placeholder={t('matchDay.statementPlaceholder')}
                />
              </View>

              <Button
                label={t('matchDay.iAmReady')}
                onPress={nextStep}
                iconRight={<ArrowRight size={20} color={Colors.background} />}
              />
            </Card>
          </Animated.View>
        )}

        {/* Quick mode: after all tactical scenarios, show the plan */}
        {content === 'tactical-and-plan' && tacticalAnswers.length === totalTactical && !currentScenario && (
          <Animated.View key="quick-plan" entering={FadeInDown.duration(500)}>
            <Card variant="gradient" shadow="cardLg" style={styles.stepCard}>
              <Text style={styles.stepTitle}>{t('matchDay.planTitle')}</Text>
              <View style={styles.planSummary}>
                <SummaryRow label={t('matchDay.planOpponent')} value={t('matchDay.vsOpponent', { opponent: activePrep.setup.opponent })} />
                <SummaryRow label={t('matchDay.planGoals')} value={activePrep.setup.goals.map((g) => translatePersonalGoal(g, t)).join(', ')} />
              </View>
              <View style={styles.reminders}>
                <Reminder text={t('matchDay.reminder1')} />
                <Reminder text={t('matchDay.reminder2')} />
                <Reminder text={t('matchDay.reminder3')} />
              </View>
              <View style={styles.statementWrap}>
                <Text style={styles.statementLabel}>{t('matchDay.yourStatement')}</Text>
                <TextInput
                  style={styles.statementInput}
                  multiline
                  value={personalStatement}
                  onChangeText={setPersonalStatement}
                  placeholderTextColor={Colors.textQuaternary}
                />
              </View>
              <Button
                label={t('matchDay.iAmReady')}
                onPress={nextStep}
                iconRight={<ArrowRight size={20} color={Colors.background} />}
              />
            </Card>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenBackground>
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

function Reminder({ text }: { text: string }) {
  return (
    <View style={styles.reminderRow}>
      <View style={styles.reminderDot} />
      <Text style={styles.reminderText}>{text}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 16 },

  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.surfaceRaised, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  stepLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 1.5 },
  stepName: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.textPrimary },
  opponentTag: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary },

  progressWrap: { marginBottom: Spacing.lg, gap: Spacing.sm },
  stepDots: { flexDirection: 'row', gap: Spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.gold },

  stepCard: { gap: Spacing.lg },
  stepTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  stepDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },
  questionText: { color: Colors.textPrimary, fontFamily: 'Inter-SemiBold', fontSize: 15, lineHeight: 22 },

  optionList: { gap: Spacing.sm },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: 13, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  optionBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  optionText: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary },
  optionTextActive: { color: Colors.background },

  resetMsg: { backgroundColor: Colors.goldSoft, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.gold },
  resetMsgText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14, lineHeight: 21, fontStyle: 'italic' },

  vizStepRow: { flexDirection: 'row', gap: Spacing.sm, justifyContent: 'center' },
  vizDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  vizDotActive: { backgroundColor: Colors.gold, width: 20 },

  vizCard: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  vizBadge: { backgroundColor: Colors.goldSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold, alignSelf: 'flex-start' },
  vizBadgeText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold, letterSpacing: 1 },
  vizTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  vizText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 22 },
  vizNav: { flexDirection: 'row', justifyContent: 'space-between' },
  vizNavBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  vizNavBtnDisabled: { opacity: 0.35 },
  vizNavText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14 },

  tacHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tacCount: { fontFamily: 'Inter-ExtraBold', fontSize: 14, color: Colors.gold },
  tacTypeBadge: { backgroundColor: Colors.goldSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold, alignSelf: 'flex-start' },
  tacTypeText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold, letterSpacing: 1 },

  decBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.md, borderRadius: Radius.md, backgroundColor: Colors.surfaceRaised, borderWidth: 1.5, borderColor: Colors.border },
  decBtnSelected: { borderColor: Colors.gold, backgroundColor: Colors.goldSoft },
  decBtnCorrect: { borderColor: Colors.success, backgroundColor: Colors.successSoft },
  decBtnWrong: { borderColor: Colors.error, backgroundColor: Colors.errorSoft },
  decLetter: { width: 30, height: 30, borderRadius: 9, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  decLetterActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  decLetterCorrect: { backgroundColor: Colors.success, borderColor: Colors.success },
  decLetterWrong: { backgroundColor: Colors.error, borderColor: Colors.error },
  decLetterText: { fontFamily: 'Inter-ExtraBold', fontSize: 13, color: Colors.textSecondary },
  decLetterTextActive: { color: Colors.background },
  decText: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 20 },
  decTextSelected: { color: Colors.textPrimary },

  explanationBox: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md, borderWidth: 1, borderColor: Colors.gold },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  explanationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
  explanationTitle: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.gold, flex: 1 },
  explanationText: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 20 },

  planSummary: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, padding: Spacing.md, gap: 10, borderWidth: 1, borderColor: Colors.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm },
  summaryLabel: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.textTertiary, width: 70 },
  summaryValue: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textPrimary, textAlign: 'right' },

  reminders: { gap: Spacing.sm },
  reminderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  reminderDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gold, marginTop: 7 },
  reminderText: { flex: 1, color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21 },

  statementWrap: { gap: Spacing.sm },
  statementLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 1.5 },
  statementInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.gold, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 22, padding: Spacing.md, minHeight: 80, textAlignVertical: 'top' },
});

const bStyles = StyleSheet.create({
  wrap: { gap: Spacing.lg, alignItems: 'center' },
  cycleText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textTertiary, letterSpacing: 0.5 },
  circleWrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  circleOuter: { width: 180, height: 180, borderRadius: 90, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  circleInner: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, alignItems: 'center', justifyContent: 'center', gap: 6 },
  phaseLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13, letterSpacing: 0.5, textAlign: 'center' },
  countdown: { fontFamily: 'Inter-ExtraBold', fontSize: 40, lineHeight: 46 },
  phaseRow: { flexDirection: 'row', gap: Spacing.lg },
  phaseItem: { alignItems: 'center', gap: 4 },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },
  phaseLabel2: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.textTertiary, letterSpacing: 0.5 },
  phaseDur: { fontFamily: 'Inter-ExtraBold', fontSize: 12, color: Colors.textSecondary },
  controls: { flexDirection: 'row', gap: Spacing.md },
  controlBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: Radius.pill, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  controlText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.gold },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.successSoft, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.success },
  doneCheck: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.success + '33', justifyContent: 'center', alignItems: 'center' },
  doneText: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success },
});
