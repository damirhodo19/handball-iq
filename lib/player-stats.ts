import { loadSessions, loadMatchHistory, loadStreak, loadProfile, SessionRecord, MatchHistoryRecord } from '@/lib/storage';

export interface PlayerStats {
  decisionScore: number;
  avgDecisionScore: number;
  bestScore: number;
  sessionsCompleted: number;
  matchesPlayed: number;
  currentStreak: number;
  longestStreak: number;
  sessionsThisWeek: number;
  weeklyAvgScore: number;
  monthlyAvgScore: number;
  weeklySessions: number;
  monthlySessions: number;
  completionRate: number;
  favouritePosition: string;
  totalTrainingMinutes: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'session' | 'match';
  title: string;
  score: number;
  date: string;
}

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

export function computePlayerStats(
  sessions: SessionRecord[] = loadSessions(),
  matches: MatchHistoryRecord[] = loadMatchHistory(),
): PlayerStats {
  const streak = loadStreak();
  const profile = loadProfile();
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  const weeklySessions = sessions.filter((s) => new Date(s.date) >= weekStart);
  const monthlySessions = sessions.filter((s) => new Date(s.date) >= monthStart);

  const allScores = [
    ...sessions.map((s) => s.decisionScore),
    ...matches.map((m) => m.decisionScore),
  ];

  const bestScore = allScores.length > 0 ? Math.max(...allScores) : 0;
  const avgDecisionScore = avg(allScores);
  const decisionScore = sessions[0]?.decisionScore ?? matches[0]?.decisionScore ?? avgDecisionScore;

  const totalCorrect = sessions.reduce((sum, s) => sum + s.correctCount, 0);
  const totalQuestions = sessions.reduce((sum, s) => sum + s.totalCount, 0);
  const completionRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const totalTrainingMinutes = Math.round(
    sessions.reduce((sum, s) => sum + s.timeSpent, 0) / 60,
  );

  const recentActivity: ActivityItem[] = [
    ...sessions.slice(0, 5).map((s) => ({
      id: s.id,
      type: 'session' as const,
      title: s.sessionName,
      score: s.decisionScore,
      date: s.date,
    })),
    ...matches.slice(0, 5).map((m) => ({
      id: m.id,
      type: 'match' as const,
      title: m.competition,
      score: m.decisionScore,
      date: m.date,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return {
    decisionScore: decisionScore || 0,
    avgDecisionScore,
    bestScore,
    sessionsCompleted: sessions.length,
    matchesPlayed: matches.length,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    sessionsThisWeek: streak.sessionsThisWeek,
    weeklyAvgScore: avg(weeklySessions.map((s) => s.decisionScore)),
    monthlyAvgScore: avg(monthlySessions.map((s) => s.decisionScore)),
    weeklySessions: weeklySessions.length,
    monthlySessions: monthlySessions.length,
    completionRate,
    favouritePosition: profile.position ?? '',
    totalTrainingMinutes,
    recentActivity,
  };
}
