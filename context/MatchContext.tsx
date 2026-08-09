import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import {
  MatchSituation, MatchAnswer, MatchReport, evaluateMatch,
} from '@/lib/match-engine';
import { generatePositionMatch } from '@/lib/position-scenarios';
import { HandballPosition } from '@/lib/positions';
import { loadProfile } from '@/lib/storage';
import { isHandballPosition } from '@/lib/platform/position-modules';

export type MatchPhase = 'first-half' | 'halftime' | 'second-half' | 'finished';

interface MatchState {
  /** Stable snapshot taken at match start — never replaced mid-match. */
  situations: MatchSituation[];
  answers: MatchAnswer[];
  currentIndex: number;
  phase: MatchPhase;
  report: MatchReport | null;
  /** Index of the situation awaiting continue (prevents double submit). */
  pendingAnswerIndex: number | null;
}

type MatchAction =
  | { type: 'START'; position: HandballPosition }
  | { type: 'SUBMIT_ANSWER'; answer: MatchAnswer; situationIndex: number }
  | { type: 'NEXT_SITUATION' }
  | { type: 'CONTINUE_SECOND_HALF' }
  | { type: 'FINISH' }
  | { type: 'RESET' };

export const HALFTIME_AFTER_INDEX = 7; // show halftime after the 8th situation (index 7)
export const MATCH_SITUATION_COUNT = 15;

function validateSituation(s: MatchSituation | undefined): s is MatchSituation {
  if (!s) return false;
  if (!Array.isArray(s.decisions) || s.decisions.length < 2) return false;
  if (!s.correctDecisionId) return false;
  if (!s.decisions.some((d) => d.id === s.correctDecisionId)) return false;
  return true;
}

function sanitizeSituations(raw: MatchSituation[], position: HandballPosition): MatchSituation[] {
  const valid = raw.filter((s) => validateSituation(s));
  if (valid.length === 0) {
    if (__DEV__) console.warn('[MatchSimulator] No valid scenarios — regenerating for', position);
    const retry = generatePositionMatch(position).filter((s) => validateSituation(s));
    return retry.slice(0, MATCH_SITUATION_COUNT).map((s, i) => ({ ...s, index: i }));
  }
  return valid.slice(0, MATCH_SITUATION_COUNT).map((s, i) => ({ ...s, index: i }));
}

function matchReducer(state: MatchState, action: MatchAction): MatchState {
  switch (action.type) {
    case 'START': {
      const situations = sanitizeSituations(generatePositionMatch(action.position), action.position);
      return {
        situations,
        answers: [],
        currentIndex: 0,
        phase: 'first-half',
        report: null,
        pendingAnswerIndex: null,
      };
    }

    case 'SUBMIT_ANSWER': {
      if (state.pendingAnswerIndex === action.situationIndex) return state;
      if (state.answers.some((a) => a.situationIndex === action.situationIndex)) return state;
      return {
        ...state,
        answers: [...state.answers, action.answer],
        pendingAnswerIndex: action.situationIndex,
      };
    }

    case 'NEXT_SITUATION': {
      const total = state.situations.length;
      if (total === 0) return state;

      if (state.currentIndex === HALFTIME_AFTER_INDEX && state.phase === 'first-half') {
        return { ...state, phase: 'halftime', pendingAnswerIndex: null };
      }

      const nextIndex = Math.min(state.currentIndex + 1, total - 1);
      if (nextIndex === state.currentIndex && state.phase !== 'halftime') {
        return { ...state, pendingAnswerIndex: null };
      }

      return { ...state, currentIndex: nextIndex, pendingAnswerIndex: null };
    }

    case 'CONTINUE_SECOND_HALF': {
      const nextIndex = Math.min(HALFTIME_AFTER_INDEX + 1, Math.max(0, state.situations.length - 1));
      return {
        ...state,
        phase: 'second-half',
        currentIndex: nextIndex,
        pendingAnswerIndex: null,
      };
    }

    case 'FINISH': {
      const report = evaluateMatch(state.answers, state.situations);
      return { ...state, phase: 'finished', report, pendingAnswerIndex: null };
    }

    case 'RESET':
      return {
        situations: [],
        answers: [],
        currentIndex: 0,
        phase: 'first-half',
        report: null,
        pendingAnswerIndex: null,
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
  pendingAnswerIndex: null,
};

interface MatchContextValue {
  state: MatchState;
  startMatch: () => void;
  submitAnswer: (situation: MatchSituation, decisionId: string) => boolean;
  nextSituation: () => void;
  continueSecondHalf: () => void;
  finishMatch: () => void;
  resetMatch: () => void;
  situations: MatchSituation[];
  answers: MatchAnswer[];
  currentIndex: number;
  phase: MatchPhase;
  report: MatchReport | null;
  pendingAnswerIndex: number | null;
}

const MatchContext = createContext<MatchContextValue | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  const startMatch = useCallback(() => {
    const profile = loadProfile();
    if (!isHandballPosition(profile.position)) {
      if (__DEV__) console.warn('[MatchSimulator] No position on profile — cannot start match.');
      return;
    }
    dispatch({ type: 'START', position: profile.position });
  }, []);

  const submitAnswer = useCallback((situation: MatchSituation, decisionId: string): boolean => {
    const chosen = situation.decisions.find((d) => d.id === decisionId);
    if (!chosen) return false;
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
    dispatch({ type: 'SUBMIT_ANSWER', answer, situationIndex: situation.index });
    return true;
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
      pendingAnswerIndex: state.pendingAnswerIndex,
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
