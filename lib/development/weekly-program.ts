import type { HandballPosition } from '@/lib/positions';
import type { WeeklyProgram, WeeklyDayPlan } from './types';
import { loadDevelopmentState, saveDevelopmentState, getWeekStart, todayStr } from './storage';
import { getTodayDayIndex as localDayIndex } from './calendar';
import { getCoreProgramForPosition, getProgramDef } from './programs';

function buildWeekDays(position: HandballPosition): WeeklyDayPlan[] {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const core = getCoreProgramForPosition(position);
  const weekNum = ((Math.floor(Date.now() / 86400000) % core.durationWeeks) + 1);
  const programWeek = getProgramDef(core.id)?.weeks.find((w) => w.week === weekNum) ?? core.weeks[0];
  const categories = programWeek.categories;

  const weeklyFocus: { focus: string; category: string }[] = [
    { focus: programWeek.objectiveKey, category: categories[0] ?? position },
    { focus: 'Position Skills', category: position },
    { focus: categories[1] ?? 'Decision Making', category: categories[1] ?? 'Decision Making' },
    { focus: 'Fast Break Timing', category: 'Fast Break' },
    { focus: 'Pressure Situations', category: 'Match Ending' },
    { focus: categories[0] ?? 'Defence', category: categories[0] ?? 'Defence' },
    { focus: 'Match Simulation', category: 'Decision Making' },
  ];
  return weeklyFocus.map((item, i) => ({
    dayIndex: i,
    label: dayLabels[i],
    focus: item.focus,
    category: item.category,
    scenarioCount: i === 6 ? 15 : Math.max(5, programWeek.scenariosPerSession - 1),
    completed: false,
  }));
}

export function getOrCreateWeeklyProgram(position: HandballPosition): WeeklyProgram {
  const state = loadDevelopmentState();
  const weekStart = getWeekStart();
  if (state.weeklyProgram?.weekStart === weekStart) return state.weeklyProgram;
  const program: WeeklyProgram = {
    weekStart,
    days: buildWeekDays(position),
    weeklyScore: 0,
    daysCompleted: 0,
    xpAwarded: false,
  };
  state.weeklyProgram = program;
  saveDevelopmentState(state);
  return program;
}

export function markWeeklyDayComplete(dayIndex: number, score: number): WeeklyProgram {
  const state = loadDevelopmentState();
  if (!state.weeklyProgram) {
    return { weekStart: '', days: [], weeklyScore: 0, daysCompleted: 0, xpAwarded: false };
  }
  const day = state.weeklyProgram.days[dayIndex];
  if (!day || day.completed) return state.weeklyProgram;

  day.completed = true;
  day.completedDate = todayStr();
  day.score = score;
  state.weeklyProgram.daysCompleted = state.weeklyProgram.days.filter((d) => d.completed).length;
  const scores = state.weeklyProgram.days.filter((d) => d.completed && d.score != null).map((d) => d.score!);
  state.weeklyProgram.weeklyScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  saveDevelopmentState(state);
  return state.weeklyProgram;
}

export function getTodayDayIndex(): number {
  return localDayIndex();
}
