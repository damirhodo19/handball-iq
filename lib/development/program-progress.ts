import type { HandballPosition } from '@/lib/positions';
import type { DevelopmentState, ProgramEnrollment } from './types';
import {
  getCoreProgramForPosition,
  getProgramDef,
  isProgramEligible,
  recommendPrograms,
  type ProgramId,
} from './programs';
import { todayStr } from './calendar';
import { loadDevelopmentState, saveDevelopmentState } from './storage';
import { calculateHandballIq } from '@/lib/platform/handball-iq';
import { loadSessions, loadMatchHistory } from '@/lib/storage';

function snapshotIq(position: HandballPosition): Pick<
  ProgramEnrollment,
  'startingOverallIq' | 'startingPositionIq' | 'startingSkillScores'
> {
  const iq = calculateHandballIq(position, loadSessions(), loadMatchHistory(), loadDevelopmentState().decisionEvents);
  const startingSkillScores: Record<string, number | null> = {};
  for (const s of iq.positionSkills) startingSkillScores[s.id] = s.score;
  return {
    startingOverallIq: iq.overall,
    startingPositionIq: iq.positionIq.score,
    startingSkillScores,
  };
}

function computeCompletion(enrollment: ProgramEnrollment): number {
  const def = getProgramDef(enrollment.programId);
  if (!def) return 0;
  const totalWeeks = def.durationWeeks;
  const weekWeight = 100 / (totalWeeks + 1); // +1 for assessment
  const weeksDone = enrollment.weeksCompleted.length;
  const assessmentBonus = enrollment.assessmentPassed ? weekWeight : 0;
  const currentWeekProgress = Math.min(
    1,
    enrollment.sessionsThisWeek / (def.weeks.find((w) => w.week === enrollment.currentWeek)?.sessionsPerWeek ?? 4),
  );
  const inProgress =
    enrollment.completed || enrollment.weeksCompleted.includes(enrollment.currentWeek)
      ? 0
      : currentWeekProgress * weekWeight;
  return Math.min(100, Math.round(weeksDone * weekWeight + inProgress + assessmentBonus));
}

export function createEnrollment(
  programId: ProgramId,
  position: HandballPosition,
): ProgramEnrollment {
  return {
    programId,
    position,
    startedAt: todayStr(),
    currentWeek: 1,
    weeksCompleted: [],
    sessionsThisWeek: 0,
    totalSessions: 0,
    completionPercent: 0,
    completed: false,
    assessmentPassed: false,
    lastActivityDate: null,
    checkpointCompleted: false,
    completedAt: null,
    status: 'active',
    pausedAt: null,
    ...snapshotIq(position),
  };
}

function archiveActiveIfNeeded(state: DevelopmentState): void {
  if (!state.activeProgram) return;
  if (!state.completedPrograms) state.completedPrograms = [];
  if (state.activeProgram.completed || state.activeProgram.status === 'completed') {
    const already = state.completedPrograms.some(
      (p) =>
        p.programId === state.activeProgram!.programId &&
        p.startedAt === state.activeProgram!.startedAt,
    );
    if (!already) {
      state.completedPrograms.push({
        ...state.activeProgram,
        status: 'completed',
        completed: true,
      });
    }
  }
}

function pauseActiveProgram(state: DevelopmentState): void {
  if (!state.activeProgram || state.activeProgram.completed) return;
  if (!state.pausedPrograms) state.pausedPrograms = [];
  const pausedKey = `${state.activeProgram.programId}_${state.activeProgram.startedAt}`;
  const alreadyPaused = state.pausedPrograms.some(
    (p) => `${p.programId}_${p.startedAt}` === pausedKey,
  );
  if (!alreadyPaused) {
    state.pausedPrograms.push({
      ...state.activeProgram,
      status: 'paused',
      completed: false,
      pausedAt: todayStr(),
    });
  }
  state.activeProgram = null;
}

/** Ensure active program is position-eligible; auto-enroll core program if missing. */
export function ensureActiveProgram(
  state: DevelopmentState,
  position: HandballPosition,
  developmentGoal?: string | null,
  weakestCategory?: string | null,
): ProgramEnrollment {
  if (!state.completedPrograms) state.completedPrograms = [];

  // Completed active program: never corrupt — archive and enroll a new one only when needed
  if (state.activeProgram?.completed) {
    archiveActiveIfNeeded(state);
    const stillEligible = isProgramEligible(state.activeProgram.programId, position);
    if (stillEligible && state.activeProgram.position === position) {
      return state.activeProgram;
    }
    // Position changed after completion — keep archive, start fresh eligible program
    state.activeProgram = null;
  }

  if (
    state.activeProgram &&
    !state.activeProgram.completed &&
    isProgramEligible(state.activeProgram.programId, position)
  ) {
    state.activeProgram.completionPercent = computeCompletion(state.activeProgram);
    return state.activeProgram;
  }

  // In-progress program became ineligible after position change — pause (never mark completed)
  if (state.activeProgram && !state.activeProgram.completed) {
    pauseActiveProgram(state);
  }

  const recommended = recommendPrograms(position, developmentGoal, weakestCategory)[0]
    ?? getCoreProgramForPosition(position);
  const enrollment = createEnrollment(recommended.id, position);
  enrollment.completionPercent = 0;
  state.activeProgram = enrollment;
  return enrollment;
}

export function enrollInProgram(programId: ProgramId, position: HandballPosition): ProgramEnrollment {
  if (!isProgramEligible(programId, position)) {
    throw new Error(`Program ${programId} is not eligible for ${position}`);
  }
  const state = loadDevelopmentState();
  const enrollment = createEnrollment(programId, position);
  state.activeProgram = enrollment;
  saveDevelopmentState(state);
  return enrollment;
}

export function applyProgramProgress(
  state: DevelopmentState,
  position: HandballPosition,
  decisionScore: number,
): { weekCompleted: boolean; programCompleted: boolean; milestone: boolean } {
  if (!state.activeProgram || state.activeProgram.completed) {
    return { weekCompleted: false, programCompleted: false, milestone: false };
  }
  if (!isProgramEligible(state.activeProgram.programId, position)) {
    return { weekCompleted: false, programCompleted: false, milestone: false };
  }

  const enrollment = state.activeProgram;
  const def = getProgramDef(enrollment.programId);
  if (!def) return { weekCompleted: false, programCompleted: false, milestone: false };

  const weekDef = def.weeks.find((w) => w.week === enrollment.currentWeek);
  enrollment.sessionsThisWeek += 1;
  enrollment.totalSessions += 1;
  enrollment.lastActivityDate = todayStr();

  let weekCompleted = false;
  let milestone = false;
  let programCompleted = false;

  if (weekDef && enrollment.sessionsThisWeek >= weekDef.sessionsPerWeek) {
    if (!enrollment.weeksCompleted.includes(enrollment.currentWeek)) {
      enrollment.weeksCompleted.push(enrollment.currentWeek);
      weekCompleted = true;
      if (weekDef.isCheckpoint) enrollment.checkpointCompleted = true;
      milestone = !!weekDef.isCheckpoint || enrollment.currentWeek === 6;
    }
    if (enrollment.currentWeek < def.durationWeeks) {
      enrollment.currentWeek += 1;
      enrollment.sessionsThisWeek = 0;
    } else if (!enrollment.assessmentPassed && decisionScore >= def.finalAssessment.targetAccuracy) {
      enrollment.assessmentPassed = true;
      enrollment.completed = true;
      enrollment.status = 'completed';
      enrollment.completedAt = todayStr();
      programCompleted = true;
    } else if (enrollment.assessmentPassed) {
      enrollment.completed = true;
      enrollment.status = 'completed';
      enrollment.completedAt = todayStr();
      programCompleted = true;
    }
  }

  // Final assessment attempt when all weeks done
  if (
    !enrollment.completed &&
    enrollment.weeksCompleted.length >= def.durationWeeks &&
    decisionScore >= def.finalAssessment.targetAccuracy
  ) {
    enrollment.assessmentPassed = true;
    enrollment.completed = true;
    enrollment.status = 'completed';
    enrollment.completedAt = todayStr();
    programCompleted = true;
    milestone = true;
  }

  enrollment.completionPercent = computeCompletion(enrollment);
  return { weekCompleted, programCompleted, milestone };
}

export function getTodayProgramSession(state: DevelopmentState): {
  programId: ProgramId | null;
  week: number;
  objectiveKey: string;
  categories: string[];
  skillFocus: string[];
  difficulty: string;
  scenarioCount: number;
  estimatedMinutes: number;
  completionPercent: number;
  isCheckpoint: boolean;
} | null {
  const enrollment = state.activeProgram;
  if (!enrollment || enrollment.completed) return null;
  const def = getProgramDef(enrollment.programId);
  if (!def) return null;
  const week = def.weeks.find((w) => w.week === enrollment.currentWeek) ?? def.weeks[0];
  return {
    programId: enrollment.programId,
    week: week.week,
    objectiveKey: week.objectiveKey,
    categories: week.categories,
    skillFocus: week.skillFocus ?? [],
    difficulty: week.difficulty,
    scenarioCount: week.scenariosPerSession,
    estimatedMinutes: Math.round(week.scenariosPerSession * 1.5 + 5),
    completionPercent: enrollment.completionPercent,
    isCheckpoint: !!week.isCheckpoint,
  };
}

/** Real-metric completion summary — never invents IQ deltas. */
export function buildProgramCompletionReport(enrollment: ProgramEnrollment) {
  const def = getProgramDef(enrollment.programId);
  const position = enrollment.position;
  const iq = calculateHandballIq(position, loadSessions(), loadMatchHistory(), loadDevelopmentState().decisionEvents);
  const currentSkills: Record<string, number | null> = {};
  for (const s of iq.positionSkills) currentSkills[s.id] = s.score;

  const deltas: { skillId: string; delta: number }[] = [];
  for (const [id, start] of Object.entries(enrollment.startingSkillScores ?? {})) {
    const cur = currentSkills[id];
    if (typeof start === 'number' && typeof cur === 'number') {
      deltas.push({ skillId: id, delta: cur - start });
    }
  }
  deltas.sort((a, b) => b.delta - a.delta);
  const strongest = deltas.find((d) => d.delta > 0) ?? null;

  const remainingWeakness =
    iq.weakest && typeof iq.weakest.score === 'number' ? iq.weakest.id : null;

  const next =
    recommendPrograms(position, null, remainingWeakness).find((p) => p.id !== enrollment.programId) ??
    getCoreProgramForPosition(position);

  return {
    programId: enrollment.programId,
    titleKey: def?.titleKey ?? enrollment.programId,
    startingOverallIq: enrollment.startingOverallIq ?? null,
    currentOverallIq: iq.overall,
    startingPositionIq: enrollment.startingPositionIq ?? null,
    currentPositionIq: iq.positionIq.score,
    skillDeltas: deltas,
    strongestImprovement: strongest,
    remainingWeakness,
    completionPercent: enrollment.completionPercent,
    nextProgramId: next.id,
    nextProgramTitleKey: next.titleKey,
  };
}
