// ── AI Coach: Rule-Based Analysis Engine ─────────────────────────────────────
// Generates deterministic coaching feedback from player statistics.
// No external AI APIs. All logic is local and offline.

import {
  buildSkillFeedback,
  buildWeeklyReport,
  buildTrainingPlan,
  buildPlayerTypeInfo,
  type StructuredWeeklyReport,
  type StructuredTrainingDay,
  type StructuredPlayerTypeInfo,
} from '@/lib/coach-i18n';
import type { LocalizedMessage } from '@/lib/i18n-message';
import { loadSessions, loadMatchHistory, loadMetrics, SessionRecord, MatchHistoryRecord, MetricHistory } from '@/lib/storage';
import { loadPreps, loadReflections, MatchDayPrep, MatchDayReflection } from '@/lib/match-day-storage';
import { HandballPosition, getCoachReportLabels, getPositionMetrics } from '@/lib/positions';

// ── Skill Categories ──────────────────────────────────────────────────────────

export type SkillCategory =
  | 'decisionMaking'
  | 'patience'
  | 'readingShooter'
  | 'fastBreak'
  | 'wingSituations'
  | 'sevenMetre'
  | 'pressureHandling'
  | 'consistency'
  | 'mentalPreparation';

export interface SkillScore {
  category: SkillCategory;
  score: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  sample: number;
}

export interface PlayerProfile {
  skills: SkillScore[];
  overallScore: number;
  totalSessions: number;
  totalMatches: number;
  totalPreps: number;
  totalReflections: number;
}

// ── Data Collection ───────────────────────────────────────────────────────────

interface RawStats {
  sessions: SessionRecord[];
  matches: MatchHistoryRecord[];
  metrics: MetricHistory[];
  preps: MatchDayPrep[];
  reflections: MatchDayReflection[];
}

function collectStats(): RawStats {
  return {
    sessions: loadSessions(),
    matches: loadMatchHistory(),
    metrics: loadMetrics(),
    preps: loadPreps(),
    reflections: loadReflections(),
  };
}

// ── Scoring Helpers ────────────────────────────────────────────────────────────

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function recentVsOlder(values: number[], recentCount: number): { recent: number; older: number; trend: 'up' | 'down' | 'stable'; trendValue: number } {
  if (values.length === 0) return { recent: 0, older: 0, trend: 'stable', trendValue: 0 };
  const recent = values.slice(0, Math.min(recentCount, values.length));
  const older = values.slice(Math.min(recentCount, values.length));
  const recentAvg = avg(recent);
  const olderAvg = older.length > 0 ? avg(older) : recentAvg;
  const diff = recentAvg - olderAvg;
  const trend = diff > 3 ? 'up' : diff < -3 ? 'down' : 'stable';
  return { recent: recentAvg, older: olderAvg, trend, trendValue: Math.round(diff) };
}

// ── Skill Calculations ─────────────────────────────────────────────────────────

function calcDecisionMaking(stats: RawStats): SkillScore {
  const sessionScores = stats.sessions.map((s) => s.decisionScore);
  const matchScores = stats.matches.map((m) => m.decisionScore);
  const all = [...sessionScores, ...matchScores];
  const score = clamp(all.length > 0 ? avg(all) : 50);
  const t = recentVsOlder(all, 5);
  return {
    category: 'decisionMaking',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

function calcPatience(stats: RawStats): SkillScore {
  // Patience: derived from sessions where patience-related metrics were correct
  // Also use reflections' patience score
  const reflectionPatience = stats.reflections.map((r) => r.patience * 10);
  // Sessions with "Reading the Shooter" metric correct indicate patience
  const sessionPatience = stats.sessions.map((s) => {
    const patienceMetrics = s.metrics.filter((m) => m.metric === 'Reading the Shooter' || m.metric === 'Patience');
    if (patienceMetrics.length === 0) return null;
    const correct = patienceMetrics.filter((m) => m.correct).length;
    return (correct / patienceMetrics.length) * 100;
  }).filter((v): v is number => v !== null);

  const all = [...sessionPatience, ...reflectionPatience];
  const score = clamp(all.length > 0 ? avg(all) : 55);
  const t = recentVsOlder(all, 4);
  return {
    category: 'patience',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

function calcReadingShooter(stats: RawStats): SkillScore {
  const matchReading = stats.matches.map((m) => m.readingAbility);
  const metricReading = stats.metrics.map((m) => m.shooterReading);
  const all = [...matchReading, ...metricReading];
  const score = clamp(all.length > 0 ? avg(all) : 50);
  const t = recentVsOlder(all, 5);
  return {
    category: 'readingShooter',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

function calcFastBreak(stats: RawStats): SkillScore {
  // Use match answers tagged with fast break scenarios
  const matchScores = stats.matches.map((m) => {
    const fbAnswers = m.answers.filter((a: any) =>
      a.scenarioType === 'Fast Break' || a.scenarioType === 'Fast break' ||
      (a.question && a.question.toLowerCase().includes('fast break'))
    );
    if (fbAnswers.length === 0) return null;
    const correct = fbAnswers.filter((a: any) => a.correct).length;
    return (correct / fbAnswers.length) * 100;
  }).filter((v): v is number => v !== null);

  // Also use match-day preps with fast break goal
  const prepBoost = stats.preps.filter((p) => p.setup.goals.includes('Fast break saves'));
  const prepScore = prepBoost.length > 0 ? 60 + prepBoost.length * 5 : 0;

  const all = matchScores;
  const baseScore = all.length > 0 ? avg(all) : 50;
  const score = clamp(prepScore > 0 ? (baseScore + prepScore) / 2 : baseScore);
  const t = recentVsOlder(all, 3);
  return {
    category: 'fastBreak',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

function calcWingSituations(stats: RawStats): SkillScore {
  const matchScores = stats.matches.map((m) => {
    const wingAnswers = m.answers.filter((a: any) =>
      a.scenarioType === 'Wing Shot' || a.scenarioType === 'Wing' ||
      (a.question && a.question.toLowerCase().includes('wing'))
    );
    if (wingAnswers.length === 0) return null;
    const correct = wingAnswers.filter((a: any) => a.correct).length;
    return (correct / wingAnswers.length) * 100;
  }).filter((v): v is number => v !== null);

  const score = clamp(matchScores.length > 0 ? avg(matchScores) : 50);
  const t = recentVsOlder(matchScores, 3);
  return {
    category: 'wingSituations',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: matchScores.length,
  };
}

function calcSevenMetre(stats: RawStats): SkillScore {
  const matchScores = stats.matches.map((m) => {
    const smAnswers = m.answers.filter((a: any) =>
      a.scenarioType === 'Seven Metre Throw' || a.scenarioType === 'Seven metre' ||
      (a.question && a.question.toLowerCase().includes('seven metre'))
    );
    if (smAnswers.length === 0) return null;
    const correct = smAnswers.filter((a: any) => a.correct).length;
    return (correct / smAnswers.length) * 100;
  }).filter((v): v is number => v !== null);

  const prepBoost = stats.preps.filter((p) => p.setup.goals.includes('Seven metre saves'));
  const prepScore = prepBoost.length > 0 ? 60 + prepBoost.length * 5 : 0;

  const all = matchScores;
  const baseScore = all.length > 0 ? avg(all) : 50;
  const score = clamp(prepScore > 0 ? (baseScore + prepScore) / 2 : baseScore);
  const t = recentVsOlder(all, 3);
  return {
    category: 'sevenMetre',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

function calcPressureHandling(stats: RawStats): SkillScore {
  const matchPressure = stats.matches.map((m) => m.pressureControl);
  const metricPressure = stats.metrics.map((m) => m.pressureControl);
  const all = [...matchPressure, ...metricPressure];
  const score = clamp(all.length > 0 ? avg(all) : 50);
  const t = recentVsOlder(all, 5);
  return {
    category: 'pressureHandling',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

function calcConsistency(stats: RawStats): SkillScore {
  const matchConsistency = stats.matches.map((m) => m.consistency);
  const metricConsistency = stats.metrics.map((m) => m.consistency);
  const sessionAccuracy = stats.sessions.map((s) =>
    s.totalCount > 0 ? (s.correctCount / s.totalCount) * 100 : 0
  );
  const all = [...matchConsistency, ...metricConsistency, ...sessionAccuracy];
  const score = clamp(all.length > 0 ? avg(all) : 50);
  const t = recentVsOlder(all, 5);
  return {
    category: 'consistency',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

function calcMentalPreparation(stats: RawStats): SkillScore {
  const completedPreps = stats.preps.filter((p) => p.completed);
  const mentalScores = completedPreps.map((p) => p.mentalReadiness);
  const reflectionPrepFeel = stats.reflections.map((r) => r.preparedFeel * 10);
  const reflectionReset = stats.reflections.map((r) => r.resetAfterConceding * 10);

  const all = [...mentalScores, ...reflectionPrepFeel, ...reflectionReset];
  const score = clamp(all.length > 0 ? avg(all) : 45);
  const t = recentVsOlder(all, 4);
  return {
    category: 'mentalPreparation',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

// ── Generic Skill Calculator ────────────────────────────────────────────────────
// Works for any position's metric labels by dynamically looking up data fields.

function calcGenericSkill(stats: RawStats, key: string): SkillScore {
  // Try to get this metric from match history, metrics, and sessions
  const matchScores = stats.matches.map((m: any) => m[key] as number).filter((v: any) => typeof v === 'number' && v > 0);
  const metricScores = stats.metrics.map((m: any) => m[key] as number).filter((v: any) => typeof v === 'number' && v > 0);
  const sessionScores = stats.sessions.map((s: any) => s[key] as number).filter((v: any) => typeof v === 'number' && v > 0);

  // For goalkeeper-specific keys, also check legacy field names
  if (key === 'readingShooter') {
    const legacy = stats.matches.map((m: any) => m.readingAbility).filter((v: any) => typeof v === 'number' && v > 0);
    matchScores.push(...legacy);
    const legacyMetrics = stats.metrics.map((m: any) => m.shooterReading).filter((v: any) => typeof v === 'number' && v > 0);
    metricScores.push(...legacyMetrics);
  }
  if (key === 'pressureHandling') {
    const legacy = stats.matches.map((m: any) => m.pressureControl).filter((v: any) => typeof v === 'number' && v > 0);
    matchScores.push(...legacy);
    const legacyMetrics = stats.metrics.map((m: any) => m.pressureControl).filter((v: any) => typeof v === 'number' && v > 0);
    metricScores.push(...legacyMetrics);
  }
  if (key === 'consistency') {
    const legacy = stats.matches.map((m: any) => m.consistency).filter((v: any) => typeof v === 'number' && v > 0);
    matchScores.push(...legacy);
    const legacyMetrics = stats.metrics.map((m: any) => m.consistency).filter((v: any) => typeof v === 'number' && v > 0);
    metricScores.push(...legacyMetrics);
    const sessionAccuracy = stats.sessions.map((s: any) =>
      s.totalCount > 0 ? (s.correctCount / s.totalCount) * 100 : 0
    ).filter((v: number) => v > 0);
    sessionScores.push(...sessionAccuracy);
  }
  if (key === 'decisionMaking') {
    const legacySession = stats.sessions.map((s: any) => s.decisionScore).filter((v: any) => typeof v === 'number' && v > 0);
    sessionScores.push(...legacySession);
    const legacyMatch = stats.matches.map((m: any) => m.decisionScore).filter((v: any) => typeof v === 'number' && v > 0);
    matchScores.push(...legacyMatch);
  }
  if (key === 'mentalPreparation') {
    const completedPreps = stats.preps.filter((p) => p.completed);
    const mentalScores = completedPreps.map((p) => p.mentalReadiness);
    const reflectionPrepFeel = stats.reflections.map((r) => r.preparedFeel * 10);
    const reflectionReset = stats.reflections.map((r) => r.resetAfterConceding * 10);
    sessionScores.push(...mentalScores, ...reflectionPrepFeel, ...reflectionReset);
  }

  const all = [...matchScores, ...metricScores, ...sessionScores];
  const score = clamp(all.length > 0 ? avg(all) : 50);
  const t = recentVsOlder(all, 5);
  return {
    category: key as SkillCategory,
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

// ── Full Profile ───────────────────────────────────────────────────────────────

export function buildPlayerProfile(position: HandballPosition | null = null): PlayerProfile {
  const stats = collectStats();

  // Get position-specific labels, or fall back to goalkeeper defaults
  const reportLabels = getCoachReportLabels(position);

  // Build skills dynamically from position config labels
  const skills: SkillScore[] = reportLabels.map((labelConfig) => {
    return calcGenericSkill(stats, labelConfig.key);
  });

  const overallScore = clamp(avg(skills.map((s) => s.score)));

  return {
    skills,
    overallScore,
    totalSessions: stats.sessions.length,
    totalMatches: stats.matches.length,
    totalPreps: stats.preps.filter((p) => p.completed).length,
    totalReflections: stats.reflections.length,
  };
}

// ── Coach Report (structured i18n) ─────────────────────────────────────────────

export interface CoachReportEntry {
  category: SkillCategory;
  score: number;
  feedback: LocalizedMessage[];
}

export function generateCoachReport(profile: PlayerProfile): CoachReportEntry[] {
  return profile.skills.map((skill) => ({
    category: skill.category,
    score: skill.score,
    feedback: buildSkillFeedback(skill),
  }));
}

export type WeeklyReport = StructuredWeeklyReport;
export type TrainingDay = StructuredTrainingDay;
export type PlayerTypeInfo = StructuredPlayerTypeInfo;

export function generateWeeklyReport(profile: PlayerProfile): WeeklyReport {
  return buildWeeklyReport(profile);
}

export function generateTrainingPlan(profile: PlayerProfile): TrainingDay[] {
  return buildTrainingPlan(profile);
}

export function classifyPlayerType(profile: PlayerProfile): PlayerTypeInfo {
  return buildPlayerTypeInfo(profile);
}

// ── Daily Coach Message ───────────────────────────────────────────────────────────

const DAILY_COACH_MESSAGE_COUNT = 20;

export function getDailyCoachMessageIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % DAILY_COACH_MESSAGE_COUNT;
}
// ── Long Term Progress ───────────────────────────────────────────────────────────

export interface ProgressPeriod {
  avgScore: number;
  sessionCount: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

export function getLongTermProgress(): { last7: ProgressPeriod; last30: ProgressPeriod; allTime: ProgressPeriod } {
  const stats = collectStats();
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 86400000;
  const thirtyDaysAgo = now - 30 * 86400000;

  // Collect all dated scores
  type ScoreEntry = { date: number; score: number };
  const allScores: ScoreEntry[] = [];

  for (const s of stats.sessions) {
    allScores.push({ date: new Date(s.date).getTime(), score: s.decisionScore });
  }
  for (const m of stats.matches) {
    allScores.push({ date: new Date(m.date).getTime(), score: m.decisionScore });
  }

  // Last 7 days
  const last7Scores = allScores.filter((e) => e.date >= sevenDaysAgo);
  const last7Avg = last7Scores.length > 0 ? avg(last7Scores.map((e) => e.score)) : 0;

  // Last 30 days
  const last30Scores = allScores.filter((e) => e.date >= thirtyDaysAgo);
  const last30Avg = last30Scores.length > 0 ? avg(last30Scores.map((e) => e.score)) : 0;

  // All time
  const allTimeAvg = allScores.length > 0 ? avg(allScores.map((e) => e.score)) : 0;

  // Trends: compare first half vs second half within each period
  function periodTrend(scores: ScoreEntry[]): { trend: 'up' | 'down' | 'stable'; trendValue: number } {
    if (scores.length < 2) return { trend: 'stable', trendValue: 0 };
    const sorted = [...scores].sort((a, b) => a.date - b.date);
    const mid = Math.floor(sorted.length / 2);
    const firstHalf = sorted.slice(0, mid);
    const secondHalf = sorted.slice(mid);
    if (firstHalf.length === 0 || secondHalf.length === 0) return { trend: 'stable', trendValue: 0 };
    const diff = avg(secondHalf.map((e) => e.score)) - avg(firstHalf.map((e) => e.score));
    return {
      trend: diff > 3 ? 'up' : diff < -3 ? 'down' : 'stable',
      trendValue: Math.round(diff),
    };
  }

  return {
    last7: {
      avgScore: clamp(last7Avg),
      sessionCount: last7Scores.length,
      ...periodTrend(last7Scores),
    },
    last30: {
      avgScore: clamp(last30Avg),
      sessionCount: last30Scores.length,
      ...periodTrend(last30Scores),
    },
    allTime: {
      avgScore: clamp(allTimeAvg),
      sessionCount: allScores.length,
      ...periodTrend(allScores),
    },
  };
}
