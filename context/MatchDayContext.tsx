import { createContext, useContext, useState, ReactNode } from 'react';
import { PrepSetup, PrepMode, MatchDayPrep, TacticalAnswer, createPrep, savePrep, completePrep, calculateReadiness } from '@/lib/match-day-storage';
import { TacticalScenario } from '@/lib/match-day-scenarios';
import { saveMatchDayPreparation } from '@/services/matchDayService';
import { useAuth } from '@/context/AuthContext';

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
  personalStatement: string;
  leaveBehinds: string | null;
  // Actions
  startPrep: (mode: PrepMode, setup: PrepSetup) => MatchDayPrep;
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
  const [personalStatement, setPersonalStatement] = useState("Today I will focus on the next action, not the previous result.");
  const [leaveBehinds, setLeaveBehindsState] = useState<string | null>(null);

  const startPrep = (mode: PrepMode, setup: PrepSetup): MatchDayPrep => {
    const prep = createPrep(mode, setup);
    setActivePrep(prep);
    setPrepMode(mode);
    setCurrentStep(0);
    setBreathingCyclesDone(0);
    setVisualStep(0);
    setTacticalScenarios([]);
    setTacticalAnswers([]);
    setPersonalStatement("Today I will focus on the next action, not the previous result.");
    setLeaveBehindsState(null);
    return prep;
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
    setPersonalStatement("Today I will focus on the next action, not the previous result.");
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
      personalStatement,
      leaveBehinds,
      startPrep,
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
