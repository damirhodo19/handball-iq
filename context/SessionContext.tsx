import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { GK_SCENARIOS, GKScenario } from '@/lib/scenarios';
import { loadPublishedScenariosForPositionAsync, AdminScenario } from '@/lib/admin-storage';
import { loadProfile } from '@/lib/storage';
import { HandballPosition } from '@/lib/positions';

function adminScenarioToGKScenario(s: AdminScenario, index: number): GKScenario {
  return {
    id: 1000 + index,
    half: s.matchPhase === 'Second Half' ? 'Second Half' : 'First Half',
    time: `${s.minute}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    score: s.score,
    situation: s.situation,
    question: s.question,
    options: s.answerOptions,
    correctIndex: s.recommendedAnswer,
    explanation: s.explanation,
    metric: s.mentalSkill as any || 'Reading the Shooter',
  };
}

interface SessionState {
  answers: (number | null)[];
  currentScenarioIndex: number;
  selectedIndex: number | null;
  confirmed: boolean;
  scenarios: GKScenario[];
  isComplete: boolean;
  selectAnswer: (index: number) => void;
  confirmAnswer: () => void;
  nextScenario: () => void;
  resetSession: () => void;
  decisionScore: number;
  correctCount: number;
}

const SessionContext = createContext<SessionState | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [scenarios, setScenarios] = useState<GKScenario[]>(GK_SCENARIOS);

  useEffect(() => {
    (async () => {
      const profile = loadProfile();
      const position = (profile.position as HandballPosition) || 'Goalkeeper';
      try {
        const adminScenarios = await loadPublishedScenariosForPositionAsync(position);
        if (adminScenarios.length >= 3) {
          setScenarios(adminScenarios.slice(0, 5).map((s, i) => adminScenarioToGKScenario(s, i)));
        }
      } catch {}
    })();
  }, []);

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => GK_SCENARIOS.map(() => null)
  );
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectAnswer = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const confirmAnswer = useCallback(() => {
    if (selectedIndex === null) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentScenarioIndex] = selectedIndex;
      return next;
    });
    setConfirmed(true);
  }, [selectedIndex, currentScenarioIndex]);

  const nextScenario = useCallback(() => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex((i) => i + 1);
      setSelectedIndex(null);
      setConfirmed(false);
    }
  }, [currentScenarioIndex, scenarios.length]);

  const resetSession = useCallback(() => {
    setAnswers(scenarios.map(() => null));
    setCurrentScenarioIndex(0);
    setSelectedIndex(null);
    setConfirmed(false);
  }, [scenarios]);

  // Update answers array length when scenarios change
  useEffect(() => {
    setAnswers(scenarios.map(() => null));
  }, [scenarios]);

  const correctCount = answers.reduce<number>((count, ans, i) => {
    const scenario = scenarios[i];
    if (scenario && ans !== null && ans === scenario.correctIndex) return count + 1;
    return count;
  }, 0);

  const decisionScore = scenarios.length > 0 ? Math.round((correctCount / scenarios.length) * 100) : 0;

  const isComplete = currentScenarioIndex === scenarios.length - 1 && confirmed;

  return (
    <SessionContext.Provider
      value={{
        answers,
        currentScenarioIndex,
        selectedIndex,
        confirmed,
        scenarios,
        isComplete,
        selectAnswer,
        confirmAnswer,
        nextScenario,
        resetSession,
        decisionScore,
        correctCount,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
