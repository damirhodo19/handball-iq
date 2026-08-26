import { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { GKScenario } from '@/lib/scenarios';
import {
  hasLocalizedAdminScenario,
  loadPublishedScenariosForPositionAsync,
  AdminScenario,
} from '@/lib/admin-storage';
import { useTranslation } from '@/hooks/useTranslation';
import { loadProfile } from '@/lib/storage';
import { HandballPosition } from '@/lib/positions';
import {
  getSessionMode,
  getOrCreateDailyChallenge,
  getDailyChallengeScenarios,
  clearSessionMode,
} from '@/lib/development';
import { getSessionIntent, clearSessionIntent } from '@/lib/development/session-intent';
import {
  clearActiveTrainingSession,
  loadActiveTrainingSession,
  saveActiveTrainingSession,
} from '@/lib/development/active-session';
import { isHandballPosition } from '@/lib/platform/position-modules';
import {
  getAvailablePlayerPositions,
  resolveActivePlayerPosition,
} from '@/lib/platform/active-player-position';
import {
  resolveTrainingScenariosAsGk,
  resolveRecommendedScenarios,
  filterResolvedScenarios,
} from '@/lib/platform/content-resolver';
import { getAllScenarios, toGKScenario } from '@/lib/scenario-bank';
import { isScenarioForPosition } from '@/lib/platform/scenario-position';
import {
  dedupeIdsPreserveOrder,
  pickUniqueScenariosWithoutReplacement,
} from '@/lib/platform/unique-scenarios';
import {
  getScenarioFamilyId,
  logScenarioSelectionDiagnostics,
} from '@/lib/platform/scenario-family';
import type { BankScenario } from '@/content/scenario-bank/types';

const DEFAULT_SESSION_LENGTH = 5;
const MIN_SESSION_LENGTH = 3;

function adminScenarioToGKScenario(s: AdminScenario, index: number): GKScenario {
  return {
    id: 1000 + index,
    bankId: s.id,
    half: s.matchPhase === 'Second Half' ? 'Second Half' : 'First Half',
    time: `${s.minute}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    score: s.score,
    situation: s.situation,
    situation_hr: s.situation_hr,
    situation_de: s.situation_de,
    question: s.question,
    question_hr: s.question_hr,
    question_de: s.question_de,
    options: s.answerOptions,
    options_hr: s.answerOptions_hr,
    options_de: s.answerOptions_de,
    correctIndex: s.recommendedAnswer,
    explanation: s.explanation,
    explanation_hr: s.explanation_hr,
    explanation_de: s.explanation_de,
    metric: s.mentalSkill as any || 'decisionMaking',
  };
}

function bankToSessionScenarios(bank: BankScenario[], position: HandballPosition): GKScenario[] {
  return bank.map((s, i) => toGKScenario(s, i + 1, position));
}

function dedupeAdminByContent(rows: AdminScenario[]): AdminScenario[] {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();
  const out: AdminScenario[] = [];
  for (const s of rows) {
    if (seenIds.has(s.id)) continue;
    const key = `${s.title}||${s.question}||${s.situation}`.toLowerCase();
    if (seenContent.has(key)) continue;
    seenIds.add(s.id);
    seenContent.add(key);
    out.push(s);
  }
  return out;
}

function logSessionIds(source: string, scenarios: GKScenario[]): void {
  const ids = scenarios.map((s) => s.bankId ?? String(s.id));
  if (__DEV__) {
    console.log(`[session] ${source} selected bankIds (${ids.length}):`, ids);
  }
}

function resolveFromBankIds(ids: string[], position: HandballPosition): BankScenario[] {
  const all = getAllScenarios();
  const map = new Map(all.map((s) => [s.id, s]));
  const ordered: BankScenario[] = [];
  const seenFamilies = new Set<string>();
  for (const id of dedupeIdsPreserveOrder(ids)) {
    const s = map.get(id);
    if (!s) continue;
    if (!isScenarioForPosition(s, position)) continue;
    const family = getScenarioFamilyId(s);
    if (seenFamilies.has(family)) continue;
    seenFamilies.add(family);
    ordered.push(s);
  }
  return ordered;
}

function finalizeSession(bank: BankScenario[], position: HandballPosition, source: string): GKScenario[] {
  logScenarioSelectionDiagnostics(bank, `${source}:${position}`);
  return bankToSessionScenarios(bank, position);
}

function loadPersonalizedScenarios(position: HandballPosition, targetCount = DEFAULT_SESSION_LENGTH): GKScenario[] {
  const profile = loadProfile();
  const intent = getSessionIntent();

  if (intent?.scenarioIds?.length) {
    const uniqueIds = dedupeIdsPreserveOrder(intent.scenarioIds);
    const fromIntent = resolveFromBankIds(uniqueIds, position);
    const picked = pickUniqueScenariosWithoutReplacement(fromIntent, targetCount, position);
    if (picked.length >= MIN_SESSION_LENGTH) {
      return finalizeSession(picked, position, 'intent');
    }
  }

  let recommended = resolveRecommendedScenarios(position, profile, Math.max(targetCount * 3, 12));
  if (intent?.category || intent?.difficulty) {
    recommended = filterResolvedScenarios(recommended, {
      category: intent?.category,
      difficulty: intent?.difficulty,
    });
    if (recommended.length < MIN_SESSION_LENGTH) {
      recommended = filterResolvedScenarios(
        getAllScenarios().filter((s) => isScenarioForPosition(s, position)),
        { category: intent?.category, difficulty: intent?.difficulty },
      );
    }
  }

  const unique = pickUniqueScenariosWithoutReplacement(recommended, targetCount, position);
  if (unique.length >= MIN_SESSION_LENGTH) {
    return finalizeSession(unique, position, 'recommended');
  }

  // Broaden with position-compatible pool — still one family per session slot
  const broadened = pickUniqueScenariosWithoutReplacement(
    getAllScenarios().filter((s) => isScenarioForPosition(s, position)),
    targetCount,
    position,
  );
  if (broadened.length > 0) {
    return finalizeSession(broadened, position, 'broadened');
  }

  // Last resort: resolver helper (already family-aware via resolveRecommended)
  return resolveTrainingScenariosAsGk(position, profile, Math.min(targetCount, 5));
}

interface SessionState {
  position: HandballPosition | null;
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
  const { lang } = useTranslation();
  const [scenarios, setScenarios] = useState<GKScenario[]>([]);
  const [sessionPosition, setSessionPosition] = useState<HandballPosition | null>(null);
  const scenarioPoolKeyRef = useRef('');

  useEffect(() => {
    let cancelled = false;

    const restoreIfActive = (position: HandballPosition): boolean => {
      const active = loadActiveTrainingSession();
      if (!active || active.position !== position || active.bankIds.length < MIN_SESSION_LENGTH) {
        return false;
      }
      const restored = resolveFromBankIds(active.bankIds, position);
      // Admin IDs are resolved after the async content load. A stale pool is replaced later.
      if (restored.length < MIN_SESSION_LENGTH) {
        return false;
      }
      const gk = bankToSessionScenarios(restored, position);
      logSessionIds('resume', gk);
      if (!cancelled) setScenarios(gk);
      return true;
    };

    const restoreAdminIfActive = (
      position: HandballPosition,
      adminScenarios: AdminScenario[],
    ): boolean => {
      const active = loadActiveTrainingSession();
      if (!active || active.position !== position || active.bankIds.length < MIN_SESSION_LENGTH) {
        return false;
      }
      const byId = new Map(adminScenarios.map((scenario) => [scenario.id, scenario]));
      const restored = active.bankIds
        .map((id) => byId.get(id))
        .filter((scenario): scenario is AdminScenario => Boolean(scenario));
      if (restored.length < MIN_SESSION_LENGTH) return false;
      const gk = restored.map((scenario, index) => adminScenarioToGKScenario(scenario, index));
      logSessionIds('resume_admin', gk);
      if (!cancelled) setScenarios(gk);
      return true;
    };

    (async () => {
      const profile = loadProfile();
      const intent = getSessionIntent();
      const availablePositions = getAvailablePlayerPositions(profile);
      const intentPosition = intent?.position && availablePositions.includes(intent.position)
        ? intent.position
        : null;
      const position = intentPosition ?? resolveActivePlayerPosition(profile);

      if (!position) {
        if (!cancelled) {
          setSessionPosition(null);
          setScenarios([]);
        }
        return;
      }
      if (!cancelled) setSessionPosition(position);

      // Resume: navigating away/back must not regenerate the active pool
      if (restoreIfActive(position)) return;

      if (getSessionMode() === 'daily_challenge') {
        const challenge = getOrCreateDailyChallenge(position);
        const dailyScenarios = getDailyChallengeScenarios(challenge, position);
        const uniqueDaily = (() => {
          const seen = new Set<string>();
          const out: GKScenario[] = [];
          for (const s of dailyScenarios) {
            const key = s.bankId ?? `${s.question}||${s.situation}`;
            if (seen.has(key)) continue;
            seen.add(key);
            out.push({ ...s, id: out.length + 1 });
          }
          return out;
        })();
        if (uniqueDaily.length >= MIN_SESSION_LENGTH) {
          if (cancelled) return;
          // Another mount may have already persisted a pool (Strict Mode)
          if (restoreIfActive(position)) return;
          logSessionIds('daily_challenge', uniqueDaily);
          saveActiveTrainingSession({
            position,
            bankIds: uniqueDaily.map((s) => s.bankId!).filter(Boolean),
            startedAt: new Date().toISOString(),
          });
          setScenarios(uniqueDaily);
          clearSessionMode();
          clearSessionIntent();
          return;
        }
      }

      try {
        const adminScenarios = await loadPublishedScenariosForPositionAsync(position);
        if (cancelled) return;
        const exact = dedupeAdminByContent(
          adminScenarios.filter(
            (s) => s.position === position && hasLocalizedAdminScenario(s, lang),
          ),
        );
        if (restoreIfActive(position)) return;
        if (restoreAdminIfActive(position, exact)) return;
        if (exact.length >= MIN_SESSION_LENGTH) {
          const slice = exact.slice(0, DEFAULT_SESSION_LENGTH);
          const gk = slice.map((s, i) => adminScenarioToGKScenario(s, i));
          logSessionIds('admin', gk);
          saveActiveTrainingSession({
            position,
            bankIds: slice.map((s) => s.id),
            startedAt: new Date().toISOString(),
          });
          setScenarios(gk);
          clearSessionIntent();
          return;
        }
      } catch {
        // fall through to bank resolver
      }

      if (cancelled) return;
      if (restoreIfActive(position)) return;

      const personalized = loadPersonalizedScenarios(position, DEFAULT_SESSION_LENGTH);
      logSessionIds('bank', personalized);
      const bankIds = personalized.map((s) => s.bankId).filter((id): id is string => Boolean(id));
      if (bankIds.length >= MIN_SESSION_LENGTH) {
        saveActiveTrainingSession({
          position,
          bankIds,
          startedAt: new Date().toISOString(),
        });
      }
      if (!cancelled) setScenarios(personalized);
      clearSessionIntent();
    })();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const [answers, setAnswers] = useState<(number | null)[]>([]);
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
    // Restart same pool (answers only) — do not regenerate scenarios
    setAnswers(scenarios.map(() => null));
    setCurrentScenarioIndex(0);
    setSelectedIndex(null);
    setConfirmed(false);
  }, [scenarios]);

  useEffect(() => {
    const nextPoolKey = scenarios.map((scenario) => scenario.bankId ?? scenario.id).join('|');
    const poolChanged = Boolean(scenarioPoolKeyRef.current) && scenarioPoolKeyRef.current !== nextPoolKey;
    scenarioPoolKeyRef.current = nextPoolKey;
    if (poolChanged) {
      setAnswers(scenarios.map(() => null));
      setCurrentScenarioIndex(0);
      setSelectedIndex(null);
      setConfirmed(false);
      return;
    }
    setAnswers((prev) => prev.length === scenarios.length ? prev : scenarios.map(() => null));
  }, [scenarios]);

  const correctCount = answers.reduce<number>((count, ans, i) => {
    const scenario = scenarios[i];
    if (scenario && ans !== null && ans === scenario.correctIndex) return count + 1;
    return count;
  }, 0);

  const decisionScore = scenarios.length > 0 ? Math.round((correctCount / scenarios.length) * 100) : 0;

  const isComplete = scenarios.length > 0 && currentScenarioIndex === scenarios.length - 1 && confirmed;

  useEffect(() => {
    if (isComplete) {
      clearActiveTrainingSession();
    }
  }, [isComplete]);

  return (
    <SessionContext.Provider
      value={{
        position: sessionPosition,
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
