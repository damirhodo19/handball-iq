// ── AI Coach: Rule-Based Analysis Engine ─────────────────────────────────────
// Generates deterministic coaching feedback from player statistics.
// No external AI APIs. All logic is local and offline.

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
  label: string;
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
    label: 'Decision Making',
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
    label: 'Patience',
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
    label: 'Reading the Shooter',
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
    label: 'Fast Break Performance',
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
    label: 'Wing Situations',
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
    label: '7m Situations',
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
    label: 'Pressure Handling',
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
    label: 'Consistency',
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
    label: 'Mental Preparation',
    score,
    trend: t.trend,
    trendValue: t.trendValue,
    sample: all.length,
  };
}

// ── Generic Skill Calculator ────────────────────────────────────────────────────
// Works for any position's metric labels by dynamically looking up data fields.

function calcGenericSkill(stats: RawStats, key: string, label: string): SkillScore {
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
    label,
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
    return calcGenericSkill(stats, labelConfig.key, labelConfig.label);
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

// ── Coach Report: Natural Language Feedback ─────────────────────────────────────

export interface CoachReportEntry {
  category: SkillCategory;
  label: string;
  score: number;
  feedback: string;
}

export function generateCoachReport(profile: PlayerProfile): CoachReportEntry[] {
  return profile.skills.map((skill) => {
    const feedback = generateSkillFeedback(skill);
    return {
      category: skill.category,
      label: skill.label,
      score: skill.score,
      feedback,
    };
  });
}

function generateSkillFeedback(skill: SkillScore): string {
  const { score, trend, trendValue, label, sample } = skill;
  const hasData = sample > 0;

  if (!hasData) {
    return `Not enough data yet. Complete more sessions and matches to unlock personalized feedback for ${label.toLowerCase()}.`;
  }

  const parts: string[] = [];

  // Base assessment by score band
  switch (skill.category) {
    case 'decisionMaking':
      if (score >= 85) parts.push('Your decision making is excellent. You consistently stay patient and read the situation before committing.');
      else if (score >= 70) parts.push('Your decision making is improving. You usually stay patient before committing, but under pressure you occasionally move too early.');
      else if (score >= 50) parts.push('Your decision making is developing. You sometimes commit before reading the full situation. Focus on waiting for the shooter\'s final movement.');
      else parts.push('Your decision making needs attention. You tend to commit early. Practice delaying your first movement until you see the release cue.');
      break;

    case 'patience':
      if (score >= 85) parts.push('Your patience is a clear strength. You hold your position and let the shooter reveal their intention before reacting.');
      else if (score >= 70) parts.push('You show good patience in most situations. Under heavy pressure you sometimes shorten your wait — trust your positioning and hold a beat longer.');
      else if (score >= 50) parts.push('Your patience is inconsistent. You sometimes move before reading the shooter. Practice holding your stance until the arm swing begins.');
      else parts.push('Patience is your biggest opportunity. You frequently commit before the shooter reveals their plan. Slow down and wait for the release cue.');
      break;

    case 'readingShooter':
      if (score >= 85) parts.push('You consistently recognize body position well. Continue delaying your first movement and trusting what you see.');
      else if (score >= 70) parts.push('You read the shooter well in most situations. Occasionally you react to a fake — confirm the arm position before committing fully.');
      else if (score >= 50) parts.push('Your shooter reading is developing. You sometimes react to early body cues instead of waiting for the final arm position. Focus on the release point.');
      else parts.push('Reading the shooter needs work. You often react to initial movement rather than the final release. Practice tracking the wrist and elbow at the point of release.');
      break;

    case 'fastBreak':
      if (score >= 85) parts.push('Your fast break decisions are sharp. You control your advance and read the attacker\'s speed correctly.');
      else if (score >= 70) parts.push('You handle fast breaks well. Occasionally you over-advance — remember to stop at five metres and set your position.');
      else if (score >= 50) parts.push('Fast break performance is mixed. You sometimes rush out too early or stay too deep. Practice controlled advancement to the five-metre line.');
      else parts.push('Fast breaks are a weakness. You tend to either rush out or stay frozen. Work on a controlled, steady advance that shortens the angle without over-committing.');
      break;

    case 'wingSituations':
      if (score >= 85) parts.push('Your wing shot handling is excellent. You hold your shape and let the difficult angle work in your favour.');
      else if (score >= 70) parts.push('You handle wing situations well. Sometimes you commit to the near post early — hold your position until the release.');
      else if (score >= 50) parts.push('Wing situations are inconsistent. You sometimes guess a corner. Trust the angle and react to the actual shot.');
      else parts.push('Wing shots are a weakness. You often commit before the release. The angle is already difficult — hold your shape and make yourself large.');
      break;

    case 'sevenMetre':
      if (score >= 85) parts.push('Your seven-metre performance is excellent. You stay central and react to the throw rather than guessing.');
      else if (score >= 70) parts.push('You handle seven-metres well. Occasionally you pre-dive based on patterns — use them as context, not certainty.');
      else if (score >= 50) parts.push('Seven-metre performance is mixed. You sometimes guess a side. Stay central and read the throwing motion.');
      else parts.push('Seven-metre throws are a weakness. You frequently pre-dive. Without information, reaction is your best tool — stay central and react.');
      break;

    case 'pressureHandling':
      if (score >= 85) parts.push('You perform well under pressure. You maintain your routine and breathing in critical situations.');
      else if (score >= 70) parts.push('You perform well until the final minutes. Focus on slowing your breathing before critical situations and returning to your pre-shot routine.');
      else if (score >= 50) parts.push('Pressure affects your decision making. You tend to speed up under pressure. Practice your breathing routine and treat every shot as shot one.');
      else parts.push('Pressure handling needs significant work. You lose your structure in critical moments. Build a reset routine: one breath, one cue word, one save.');
      break;

    case 'consistency':
      if (score >= 85) parts.push('Your consistency is excellent. You deliver reliable performances across sessions and matches.');
      else if (score >= 70) parts.push('You are mostly consistent. Occasional dips happen — focus on your pre-shot routine to maintain your standard in every situation.');
      else if (score >= 50) parts.push('Your consistency varies. Some sessions are strong, others drop off. Build a repeatable pre-shot routine to stabilize your level.');
      else parts.push('Consistency is a significant gap. Your performance swings widely. Focus on a single repeatable cue before every action to build stability.');
      break;

    case 'mentalPreparation':
      if (score >= 85) parts.push('Your mental preparation is excellent. You arrive focused and reset well after setbacks.');
      else if (score >= 70) parts.push('Your mental preparation is solid. You benefit from pre-match breathing and visualization — keep doing it consistently.');
      else if (score >= 50) parts.push('Mental preparation is developing. You sometimes skip your routine. Complete your pre-match preparation more consistently to build readiness.');
      else parts.push('Mental preparation needs attention. You rarely complete pre-match routines. Start with a quick breathing exercise before every match.');
      break;
  }

  // Trend note
  if (trend === 'up' && trendValue >= 5) {
    parts.push(`Trending upward by ${trendValue} points — keep doing what you are doing.`);
  } else if (trend === 'down' && trendValue <= -5) {
    parts.push(`Trending down by ${Math.abs(trendValue)} points recently. Revisit the fundamentals of this skill.`);
  }

  return parts.join(' ');
}

// ── Weekly Report ───────────────────────────────────────────────────────────────

export interface WeeklyReport {
  biggestImprovement: string;
  biggestWeakness: string;
  mostImprovedSkill: string;
  skillNeedingAttention: string;
  overallTrend: 'up' | 'down' | 'stable';
  overallTrendValue: number;
  recommendation: string;
}

export function generateWeeklyReport(profile: PlayerProfile): WeeklyReport {
  const skills = profile.skills;

  // Most improved skill (highest positive trend)
  const sortedByTrendUp = [...skills].sort((a, b) => b.trendValue - a.trendValue);
  const mostImproved = sortedByTrendUp[0];
  const mostImprovedSkill = mostImproved.trendValue > 0 ? mostImproved.label : 'All skills are stable';

  // Skill needing attention (lowest score)
  const sortedByScore = [...skills].sort((a, b) => a.score - b.score);
  const weakest = sortedByScore[0];
  const skillNeedingAttention = weakest.label;

  // Biggest improvement (score-wise, comparing trend)
  const biggestImprovement = mostImproved.trendValue > 3
    ? `${mostImproved.label} improved by ${mostImproved.trendValue} points compared to your previous sessions.`
    : 'Your skills are holding steady. No major jumps this week, but consistency is valuable.';

  // Biggest weakness
  const biggestWeakness = weakest.score < 50
    ? `${weakest.label} is your lowest area at ${weakest.score}%. This is where the biggest gains are available.`
    : `${weakest.label} is your lowest area at ${weakest.score}%, which is still a reasonable level. Small improvements here will round out your game.`;

  // Overall trend
  const overallTrendValue = Math.round(avg(skills.map((s) => s.trendValue)));
  const overallTrend = overallTrendValue > 3 ? 'up' : overallTrendValue < -3 ? 'down' : 'stable';

  // Recommendation
  let recommendation: string;
  if (weakest.score < 50) {
    recommendation = `Focus next week on ${weakest.label.toLowerCase()}. Add two short sessions targeting this area, and complete a Match Day Preparation before your next game.`;
  } else if (overallTrend === 'up') {
    recommendation = `You are trending upward. Continue your current routine and add one extra session targeting ${weakest.label.toLowerCase()} to push your overall score higher.`;
  } else if (overallTrend === 'down') {
    recommendation = `Your recent trend is slightly down. Revisit the fundamentals — complete a Match Day Preparation and focus on your breathing routine before the next match.`;
  } else {
    recommendation = `Your performance is stable. To break through, target ${weakest.label.toLowerCase()} with two focused sessions and complete a post-match reflection after your next game.`;
  }

  return {
    biggestImprovement,
    biggestWeakness,
    mostImprovedSkill,
    skillNeedingAttention,
    overallTrend,
    overallTrendValue,
    recommendation,
  };
}

// ── Personal Training Plan ───────────────────────────────────────────────────────

export interface TrainingDay {
  day: string;
  focus: string;
  description: string;
}

export function generateTrainingPlan(profile: PlayerProfile): TrainingDay[] {
  const skills = profile.skills;
  const sortedWeakest = [...skills].sort((a, b) => a.score - b.score);

  // Map skill categories to training focus
  const skillToTraining: Record<SkillCategory, { focus: string; description: string }> = {
    decisionMaking: { focus: 'Decision Making', description: 'Review scenario cards and practice reading the full situation before committing.' },
    patience: { focus: 'Patience Training', description: 'Practice holding your stance. Wait for the shooter\'s final movement before reacting.' },
    readingShooter: { focus: 'Reading the Shooter', description: 'Study body position, shoulder angle and arm swing cues. Delay your first movement.' },
    fastBreak: { focus: 'Fast Break Decisions', description: 'Practice controlled advancement to the five-metre line and reading the attacker\'s speed.' },
    wingSituations: { focus: 'Wing Situations', description: 'Train your positioning on wing shots. Hold your shape and let the angle work for you.' },
    sevenMetre: { focus: '7m Throws', description: 'Practice staying central on seven-metre throws. React to the throwing motion, do not guess.' },
    pressureHandling: { focus: 'Pressure Situations', description: 'Simulate late-game pressure. Practice your breathing routine before every critical save.' },
    consistency: { focus: 'Consistency Training', description: 'Repeat your pre-shot routine before every action. Build a single reliable cue word.' },
    mentalPreparation: { focus: 'Mental Preparation', description: 'Complete a Match Day Preparation session. Breathing, visualization and tactical review.' },
  };

  // Build a 7-day plan targeting the weakest skills
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Pick the top 4 weakest skills for Mon–Thu
  const topFour = sortedWeakest.slice(0, 4);

  const plan: TrainingDay[] = days.map((day, i) => {
    if (i < 4 && topFour[i]) {
      const training = skillToTraining[topFour[i].category];
      return { day, focus: training.focus, description: training.description };
    }
    if (i === 4) {
      // Friday: pressure situations
      return { day, focus: 'Pressure Situations', description: 'Simulate high-pressure scenarios. Practice your breathing and reset routine before critical saves.' };
    }
    if (i === 5) {
      // Saturday: match preparation
      return { day, focus: 'Match Preparation', description: 'Complete a full Match Day Preparation. Breathing, mental reset, visualization and tactical scenarios.' };
    }
    // Sunday: recovery and review
    return { day, focus: 'Recovery and Review', description: 'Light review of the week. Reflect on what improved and set one focus for next week.' };
  });

  return plan;
}

// ── Player Type Classification ───────────────────────────────────────────────────

export type PlayerType =
  | 'Calm Reader'
  | 'Aggressive Goalkeeper'
  | 'Reactive Goalkeeper'
  | 'Balanced Goalkeeper'
  | 'Pressure Specialist'
  | 'Developing Goalkeeper';

export interface PlayerTypeInfo {
  type: PlayerType;
  strengths: string[];
  risks: string[];
  suggestedFocus: string;
  description: string;
}

export function classifyPlayerType(profile: PlayerProfile): PlayerTypeInfo {
  const skills = profile.skills;
  const byCategory = (cat: SkillCategory) => skills.find((s) => s.category === cat)!;

  const decision = byCategory('decisionMaking').score;
  const patience = byCategory('patience').score;
  const reading = byCategory('readingShooter').score;
  const fastBreak = byCategory('fastBreak').score;
  const pressure = byCategory('pressureHandling').score;
  const consistency = byCategory('consistency').score;
  const mental = byCategory('mentalPreparation').score;
  const overall = profile.overallScore;

  // Classification logic
  // Calm Reader: high patience + high reading, moderate pressure
  if (patience >= 70 && reading >= 70 && pressure >= 60) {
    return {
      type: 'Calm Reader',
      strengths: ['Patience before committing', 'Reading shooter body position', 'Stays composed under pressure'],
      risks: ['May concede by being too passive on quick attacks', 'Fast break decisions can be slow'],
      suggestedFocus: 'Improve fast break reaction speed while maintaining your patient reading style.',
      description: 'You are a Calm Reader. You stay patient, read the shooter well and rarely commit early. Your composure is a strength — use it while improving your speed on fast breaks.',
    };
  }

  // Aggressive Goalkeeper: high fast break + high pressure, lower patience
  if (fastBreak >= 65 && pressure >= 65 && patience < 65) {
    return {
      type: 'Aggressive Goalkeeper',
      strengths: ['Fast break decisions', 'Confidence under pressure', 'Proactive positioning'],
      risks: ['Sometimes over-commits', 'Can be beaten by patient shooters who wait you out'],
      suggestedFocus: 'Balance your aggression with more patience. Wait for the release cue on set-piece attacks.',
      description: 'You are an Aggressive Goalkeeper. You advance confidently and thrive under pressure. Your risk is over-committing — add patience to your set-piece play.',
    };
  }

  // Reactive Goalkeeper: high consistency + good decision but lower reading
  if (consistency >= 70 && decision >= 65 && reading < 65) {
    return {
      type: 'Reactive Goalkeeper',
      strengths: ['Consistent performances', 'Reliable decision making', 'Strong reaction saves'],
      risks: ['May struggle against shooters with strong fakes', 'Reading body cues needs improvement'],
      suggestedFocus: 'Improve your reading of the shooter. Focus on shoulder and wrist cues at release.',
      description: 'You are a Reactive Goalkeeper. You rely on reaction and consistency rather than early reads. Strengthen your shooter reading to reach the next level.',
    };
  }

  // Pressure Specialist: high pressure + high mental prep
  if (pressure >= 75 && mental >= 70) {
    return {
      type: 'Pressure Specialist',
      strengths: ['Performs in critical moments', 'Strong mental preparation', 'Reliable under pressure'],
      risks: ['May under-invest in routine situations', 'Can be overly intense in low-pressure moments'],
      suggestedFocus: 'Maintain your pressure performance while improving consistency in routine situations.',
      description: 'You are a Pressure Specialist. You shine in critical moments and prepare mentally better than most. Balance this with consistency in everyday situations.',
    };
  }

  // Balanced Goalkeeper: all scores reasonably high and close together
  if (overall >= 65) {
    const spread = Math.max(...skills.map((s) => s.score)) - Math.min(...skills.map((s) => s.score));
    if (spread <= 25) {
      return {
        type: 'Balanced Goalkeeper',
        strengths: ['No major weaknesses', 'Consistent across all situations', 'Adaptable to different game scenarios'],
        risks: ['May lack a standout strength', 'Can be predictable to experienced shooters'],
        suggestedFocus: 'Pick one skill to push to excellence. Turn a balanced game into a dominant one.',
        description: 'You are a Balanced Goalkeeper. You have no major weaknesses and perform reliably across all situations. To reach the next level, develop one standout strength.',
      };
    }
  }

  // Developing Goalkeeper: lower overall or limited data
  return {
    type: 'Developing Goalkeeper',
    strengths: ['Building foundations', 'Open to improvement', 'Every session adds data'],
    risks: ['Inconsistent performance', 'Limited experience in some situations'],
    suggestedFocus: 'Focus on the fundamentals: patience, reading the shooter and mental preparation. Complete sessions and matches regularly.',
    description: 'You are a Developing Goalkeeper. Your profile is still forming. Complete more sessions and matches to unlock a more specific player type and targeted coaching.',
  };
}

// ── Daily Coach Message ───────────────────────────────────────────────────────────

const COACH_MESSAGES: string[] = [
  'Today focus on staying patient.',
  'Trust your positioning.',
  'Read the shoulder before the shot.',
  'Reset immediately after every goal.',
  'One breath, one cue, one save.',
  'Wait for the release cue before you move.',
  'Communicate clearly with your defence.',
  'Treat every shot as shot one.',
  'Your stance is your foundation — check it.',
  'Slow your breathing before critical situations.',
  'A mistake is information, not identity.',
  'Stay balanced and let the shooter reveal their plan.',
  'Focus on the next action, not the previous result.',
  'Control what you can: your position and your breathing.',
  'Read the wrist at the point of release.',
  'Be patient on set pieces, aggressive on fast breaks.',
  'Your pre-shot routine is your anchor — use it every time.',
  'Stay central on seven metres and react.',
  'Make yourself large and hold your shape on wing shots.',
  'Advance with control — five metres, then set your position.',
];

export function getDailyCoachMessage(): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % COACH_MESSAGES.length;
  return COACH_MESSAGES[index];
}

// ── Long Term Progress ───────────────────────────────────────────────────────────

export interface ProgressPeriod {
  label: string;
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
      label: 'Last 7 Days',
      avgScore: clamp(last7Avg),
      sessionCount: last7Scores.length,
      ...periodTrend(last7Scores),
    },
    last30: {
      label: 'Last 30 Days',
      avgScore: clamp(last30Avg),
      sessionCount: last30Scores.length,
      ...periodTrend(last30Scores),
    },
    allTime: {
      label: 'All Time',
      avgScore: clamp(allTimeAvg),
      sessionCount: allScores.length,
      ...periodTrend(allScores),
    },
  };
}
