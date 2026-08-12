import { createContext, useContext, useState, ReactNode } from 'react';
import { PrepSetup, PrepMode, MatchDayPrep, TacticalAnswer, createPrep, savePrep, completePrep, calculateReadiness, loadPrepById } from '@/lib/match-day-storage';
import { buildMatchDayTactics, buildMatchPlan, type MatchPlan, type TacticalScenario } from '@/lib/match-day-tactics';
import { loadProfile } from '@/lib/storage';
import { resolveActivePlayerPosition } from '@/lib/platform/active-player-position';
import { saveMatchDayPreparation } from '@/services/matchDayService';
import { useAuth } from '@/context/AuthContext';

export const DEFAULT_STATEMENT_KEY = 'default.statement';

interface MatchDayContextValue {
  // Active prep
  activePrep: MatchDayPrep | null;
  prepMode: PrepMode;
  // Wizard state
  currentStep: number;
  breathingCyclesDone: number;
  visualStep: number;
  tacticalScenarios: TacticalScenario[];
  tacticalAnswers: TacticalAnswer[];
  matchPlan: MatchPlan | null;
  personalStatement: string;
  leaveBehinds: string | null;
  // Actions
  startPrep: (mode: PrepMode, setup: PrepSetup) => MatchDayPrep;
  resumePrep: (prepId: string) => MatchDayPrep | null;
  regenerateTactics: () => TacticalScenario[];
  setBreathingCyclesDone: (n: number) => void;
  setLeaveBehinds: (val: string) => void;
  setVisualStep: (n: number) => void;
  setTacticalScenarios: (s: TacticalScenario[]) => void;
  submitTacticalAnswer: (a: TacticalAnswer) => void;
  setPersonalStatement: (s: string) => void;
  goToStep: (n: number) => void;
  finishPrep: () => void;
  resetActivePrep: () => void;
}

const MatchDayContext = createContext<MatchDayContextValue | undefined>(undefined);

export function MatchDayProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activePrep, setActivePrep] = useState<MatchDayPrep | null>(null);
  const [prepMode, setPrepMode] = useState<PrepMode>('complete');
  const [currentStep, setCurrentStep] = useState(0);
  const [breathingCyclesDone, setBreathingCyclesDone] = useState(0);
  const [visualStep, setVisualStep] = useState(0);
  const [tacticalScenarios, setTacticalScenarios] = useState<TacticalScenario[]>([]);
  const [tacticalAnswers, setTacticalAnswers] = useState<TacticalAnswer[]>([]);
  const [matchPlan, setMatchPlan] = useState<MatchPlan | null>(null);
  const [personalStatement, setPersonalStatement] = useState(DEFAULT_STATEMENT_KEY);
  const [leaveBehinds, setLeaveBehindsState] = useState<string | null>(null);

  const generateForSetup = (mode: PrepMode, setup: PrepSetup) => {
    const count = mode === 'quick' ? 3 : 5;
    if (__DEV__) {
      console.log('[match-day] generateForSetup', {
        mode,
        position: setup.position,
        goals: setup.goals,
        opponent: setup.opponent,
        count,
      });
    }
    const profile = loadProfile();
    const profilePrefs = {
      favoriteDefense: profile.favoriteDefense ?? null,
      favoriteAttack: profile.favoriteAttack ?? null,
    };
    const scenarios = buildMatchDayTactics({
      position: setup.position,
      goals: setup.goals,
      count,
      developmentGoal: setup.developmentGoal,
      playingLevel: setup.playingLevel,
      dominantHand: setup.dominantHand,
      opponent: setup.opponent,
      favoriteDefense: profilePrefs.favoriteDefense,
      favoriteAttack: profilePrefs.favoriteAttack,
    });
    const plan = buildMatchPlan(setup, setup.position, profilePrefs);
    if (__DEV__) {
      console.log('[match-day] generateForSetup.result', {
        tacticalN: scenarios.length,
        tacticalIds: scenarios.map((s) => s.id),
        planReminders: plan.reminders.length,
      });
    }
    return { scenarios, plan };
  };

  const startPrep = (mode: PrepMode, setup: PrepSetup): MatchDayPrep => {
    if (!setup.position) {
      throw new Error('Match Day prep requires a resolved player position');
    }
    const prep = createPrep(mode, setup);
    const { scenarios, plan } = generateForSetup(mode, setup);
    setActivePrep(prep);
    setPrepMode(mode);
    setCurrentStep(0);
    setBreathingCyclesDone(0);
    setVisualStep(0);
    setTacticalScenarios(scenarios);
    setTacticalAnswers([]);
    setMatchPlan(plan);
    setPersonalStatement(DEFAULT_STATEMENT_KEY);
    setLeaveBehindsState(null);
    return prep;
  };

  const resumePrep = (prepId: string): MatchDayPrep | null => {
    let prep = loadPrepById(prepId);
    if (!prep || prep.completed) return null;
    // Migrate older in-progress preps that lack setup.position (never invent GK)
    if (!prep.setup?.position) {
      const resolved = resolveActivePlayerPosition(loadProfile());
      if (resolved) {
        prep = {
          ...prep,
          setup: { ...prep.setup, position: resolved },
        };
        savePrep(prep);
      }
    }
    setActivePrep(prep);
    setPrepMode(prep.mode);
    setCurrentStep(0);
    setBreathingCyclesDone(0);
    setVisualStep(0);
    setTacticalAnswers(prep.tacticalAnswers ?? []);
    setPersonalStatement(prep.personalStatement ?? DEFAULT_STATEMENT_KEY);
    setLeaveBehindsState(prep.leaveBehinds ?? null);
    if (prep.setup?.position) {
      const { scenarios, plan } = generateForSetup(prep.mode, prep.setup);
      setTacticalScenarios(scenarios);
      setMatchPlan(plan);
    } else {
      setTacticalScenarios([]);
      setMatchPlan(null);
    }
    return prep;
  };

  const regenerateTactics = (): TacticalScenario[] => {
    if (!activePrep?.setup?.position) return [];
    const { scenarios, plan } = generateForSetup(prepMode, activePrep.setup);
    setTacticalScenarios(scenarios);
    setMatchPlan(plan);
    setTacticalAnswers([]);
    return scenarios;
  };

  const setLeaveBehinds = (val: string) => {
    setLeaveBehindsState(val);
    if (activePrep) {
      const updated = { ...activePrep, leaveBehinds: val };
      setActivePrep(updated);
      savePrep(updated);
    }
  };

  const submitTacticalAnswer = (answer: TacticalAnswer) => {
    setTacticalAnswers((prev) => {
      const next = [...prev.filter((a) => a.scenarioIndex !== answer.scenarioIndex), answer];
      if (activePrep) {
        const updated = { ...activePrep, tacticalAnswers: next };
        setActivePrep(updated);
        savePrep(updated);
      }
      return next;
    });
  };

  const goToStep = (n: number) => {
    setCurrentStep(n);
    if (activePrep) {
      const updated = { ...activePrep, visualStep };
      setActivePrep(updated);
      savePrep(updated);
    }
  };

  const finishPrep = () => {
    if (!activePrep) return;
    const { mental, tactical } = calculateReadiness({
      mode: prepMode,
      leaveBehinds,
      visualStep,
      tacticalAnswers,
      personalStatement,
    });
    completePrep(activePrep.id, {
      mentalReadiness: mental,
      tacticalReadiness: tactical,
      personalStatement,
      tacticalAnswers,
      leaveBehinds,
    });

    // Save to Supabase if user is logged in
    if (user) {
      saveMatchDayPreparation({
        opponent: activePrep.setup.opponent,
        match_type: activePrep.setup.matchType ?? null,
        match_location: activePrep.setup.location ?? null,
        expected_playing_time: activePrep.setup.playingTime ?? null,
        personal_goals: activePrep.setup.goals ?? [],
        personal_statement: personalStatement,
        mental_readiness: mental,
        tactical_readiness: tactical,
      }).then(({ error }) => {
        if (error) console.warn('[MatchDay] Failed to sync prep:', error);
      });
    }
  };

  const resetActivePrep = () => {
    setActivePrep(null);
    setCurrentStep(0);
    setBreathingCyclesDone(0);
    setVisualStep(0);
    setTacticalScenarios([]);
    setTacticalAnswers([]);
    setMatchPlan(null);
    setPersonalStatement(DEFAULT_STATEMENT_KEY);
    setLeaveBehindsState(null);
  };

  return (
    <MatchDayContext.Provider value={{
      activePrep,
      prepMode,
      currentStep,
      breathingCyclesDone,
      visualStep,
      tacticalScenarios,
      tacticalAnswers,
      matchPlan,
      personalStatement,
      leaveBehinds,
      startPrep,
      resumePrep,
      regenerateTactics,
      setBreathingCyclesDone,
      setLeaveBehinds,
      setVisualStep,
      setTacticalScenarios,
      submitTacticalAnswer,
      setPersonalStatement,
      goToStep,
      finishPrep,
      resetActivePrep,
    }}>
      {children}
    </MatchDayContext.Provider>
  );
}

export function useMatchDay() {
  const ctx = useContext(MatchDayContext);
  if (!ctx) throw new Error('useMatchDay must be used within MatchDayProvider');
  return ctx;
}
