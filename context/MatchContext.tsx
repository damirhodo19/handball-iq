import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  MatchSituation, MatchAnswer, MatchReport, evaluateMatch,
} from '@/lib/match-engine';
import { generatePositionMatch } from '@/lib/position-scenarios';
import { HandballPosition } from '@/lib/positions';
import { loadProfile } from '@/lib/storage';

export type MatchPhase = 'first-half' | 'halftime' | 'second-half' | 'finished';

interface MatchState {
  situations: MatchSituation[];
  answers: MatchAnswer[];
  currentIndex: number;
  phase: MatchPhase;
  report: MatchReport | null;
}

type MatchAction =
  | { type: 'START'; position: HandballPosition }
  | { type: 'SUBMIT_ANSWER'; answer: MatchAnswer }
  | { type: 'NEXT_SITUATION' }
  | { type: 'CONTINUE_SECOND_HALF' }
  | { type: 'FINISH' }
  | { type: 'RESET' };

const HALFTIME_AFTER_INDEX = 7; // show halftime after the 8th situation (index 7)

function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'START':
      return {
        situations: generatePositionMatch(action.position),
        answers: [],
        currentIndex: 0,
        phase: 'first-half',
        report: null,
      };

    case 'SUBMIT_ANSWER':
      return { ...state, answers: [...state.answers, action.answer] };

    case 'NEXT_SITUATION': {
      const nextIndex = state.currentIndex + 1;
      // After situation at HALFTIME_AFTER_INDEX, go to halftime
      if (state.currentIndex === HALFTIME_AFTER_INDEX && state.phase === 'first-half') {
        return { ...state, phase: 'halftime' };
      }
      return { ...state, currentIndex: nextIndex };
    }

    case 'CONTINUE_SECOND_HALF':
      return {
        ...state,
        phase: 'second-half',
        currentIndex: HALFTIME_AFTER_INDEX + 1,
      };

    case 'FINISH': {
      const report = evaluateMatch(state.answers, state.situations);
      return { ...state, phase: 'finished', report };
    }

    case 'RESET':
      return {
        situations: [],
        answers: [],
        currentIndex: 0,
        phase: 'first-half',
        report: null,
      };

    default:
      return state;
  }
}

const initialState: MatchState = {
  situations: [],
  answers: [],
  currentIndex: 0,
  phase: 'first-half',
  report: null,
};

interface MatchContextValue {
  state: MatchState;
  startMatch: () => void;
  submitAnswer: (situation: MatchSituation, decisionId: string) => void;
  nextSituation: () => void;
  continueSecondHalf: () => void;
  finishMatch: () => void;
  resetMatch: () => void;
  // Convenience accessors
  situations: MatchSituation[];
  answers: MatchAnswer[];
  currentIndex: number;
  phase: MatchPhase;
  report: MatchReport | null;
}

const MatchContext = createContext<MatchContextValue | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  const startMatch = useCallback(() => {
    const profile = loadProfile();
    const position = (profile.position as HandballPosition) || 'Goalkeeper';
    dispatch({ type: 'START', position });
  }, []);

  const submitAnswer = useCallback((situation: MatchSituation, decisionId: string) => {
    const chosen = situation.decisions.find((d) => d.id === decisionId);
    if (!chosen) return;
    const answer: MatchAnswer = {
      situationIndex: situation.index,
      chosenDecisionId: decisionId,
      correctDecisionId: situation.correctDecisionId,
      isCorrect: decisionId === situation.correctDecisionId,
      quality: chosen.quality,
      minute: situation.minute,
      scenarioType: situation.scenarioType,
      feedback: chosen.feedback,
    };
    dispatch({ type: 'SUBMIT_ANSWER', answer });
  }, []);

  const nextSituation = useCallback(() => dispatch({ type: 'NEXT_SITUATION' }), []);
  const continueSecondHalf = useCallback(() => dispatch({ type: 'CONTINUE_SECOND_HALF' }), []);
  const finishMatch = useCallback(() => dispatch({ type: 'FINISH' }), []);
  const resetMatch = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <MatchContext.Provider value={{
      state,
      startMatch,
      submitAnswer,
      nextSituation,
      continueSecondHalf,
      finishMatch,
      resetMatch,
      situations: state.situations,
      answers: state.answers,
      currentIndex: state.currentIndex,
      phase: state.phase,
      report: state.report,
    }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const ctx = useContext(MatchContext);
  if (!ctx) throw new Error('useMatch must be used within MatchProvider');
  return ctx;
}
