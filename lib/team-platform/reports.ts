import type {
  TeamMemberRecord,
  TeamDashboardStats,
  TeamLeaderboards,
  LeaderboardEntry,
  ReportPeriod,
  TeamRecord,
} from './types';
import { localFetchMembers } from './storage';

export function computeTeamDashboard(teamId: string): TeamDashboardStats {
  return computeTeamDashboardFromMembers(localFetchMembers(teamId));
}

export function computeTeamDashboardFromMembers(allMembers: TeamMemberRecord[]): TeamDashboardStats {
  const members = allMembers.filter((member) => member.member_role === 'player');
  if (members.length === 0) {
    return {
      rosterCount: 0,
      attendanceRate: 0,
      avgDecisionScore: 0,
      weeklyProgress: 0,
      dailyActivity: 0,
      mostImproved: null,
      needsAttention: null,
    };
  }

  const avgDecisionScore = Math.round(
    members.reduce((s, m) => s + (m.decision_score ?? 0), 0) / members.length,
  );
  const weeklyProgress = Math.round(
    members.reduce((s, m) => s + (m.improvement ?? 0), 0) / members.length,
  );
  const dailyActivity = members.filter((m) => (m.weekly_activity ?? 0) > 0).length;
  const attendanceRate = Math.round((dailyActivity / members.length) * 100);

  const sortedImprovement = [...members].sort((a, b) => (b.improvement ?? 0) - (a.improvement ?? 0));
  const sortedScore = [...members].sort((a, b) => (a.decision_score ?? 0) - (b.decision_score ?? 0));

  return {
    rosterCount: members.length,
    attendanceRate,
    avgDecisionScore,
    weeklyProgress,
    dailyActivity,
    mostImproved: sortedImprovement[0] ?? null,
    needsAttention: sortedScore[0] ?? null,
  };
}

function buildLeaderboard(
  members: TeamMemberRecord[],
  getValue: (m: TeamMemberRecord) => number,
): LeaderboardEntry[] {
  return [...members]
    .sort((a, b) => getValue(b) - getValue(a))
    .map((m, i) => ({
      user_id: m.user_id,
      display_name: m.display_name ?? 'Player',
      value: getValue(m),
      rank: i + 1,
    }));
}

export function computeLeaderboards(teamId: string): TeamLeaderboards {
  const members = localFetchMembers(teamId);
  return {
    decisionScore: buildLeaderboard(members, (m) => m.decision_score ?? 0),
    xp: buildLeaderboard(members, (m) => m.total_xp ?? 0),
    streak: buildLeaderboard(members, (m) => m.streak ?? 0),
    weeklyActivity: buildLeaderboard(members, (m) => m.weekly_activity ?? 0),
    improvement: buildLeaderboard(members, (m) => m.improvement ?? 0),
  };
}

export interface TeamReport {
  title: string;
  period: ReportPeriod;
  generatedAt: string;
  team: TeamRecord | null;
  summary: {
    rosterCount: number;
    avgDecisionScore: number;
    weeklyProgress: number;
    assignmentsCompleted: number;
    assignmentsPending: number;
  };
  players: {
    name: string;
    position: string;
    decisionScore: number;
    xp: number;
    streak: number;
    improvement: number;
  }[];
}

export function generateTeamReport(
  team: TeamRecord,
  period: ReportPeriod,
): TeamReport {
  const members = localFetchMembers(team.id);
  const dash = computeTeamDashboard(team.id);

  return {
    title: `${team.name} — ${period.charAt(0).toUpperCase() + period.slice(1)} Report`,
    period,
    generatedAt: new Date().toISOString(),
    team,
    summary: {
      rosterCount: dash.rosterCount,
      avgDecisionScore: dash.avgDecisionScore,
      weeklyProgress: dash.weeklyProgress,
      assignmentsCompleted: 0,
      assignmentsPending: 0,
    },
    players: members.map((m) => ({
      name: m.display_name ?? 'Player',
      position: m.position ?? '—',
      decisionScore: m.decision_score ?? 0,
      xp: m.total_xp ?? 0,
      streak: m.streak ?? 0,
      improvement: m.improvement ?? 0,
    })),
  };
}

export function reportToCsv(report: TeamReport): string {
  const lines: string[] = [
    report.title,
    `Generated,${report.generatedAt}`,
    '',
    'Summary',
    `Roster,${report.summary.rosterCount}`,
    `Avg Decision Score,${report.summary.avgDecisionScore}%`,
    `Weekly Progress,${report.summary.weeklyProgress}%`,
    '',
    'Player,Position,Decision Score,XP,Streak,Improvement',
  ];
  for (const p of report.players) {
    lines.push(`${p.name},${p.position},${p.decisionScore},${p.xp},${p.streak},${p.improvement}`);
  }
  return lines.join('\n');
}

export function reportToPdfContent(report: TeamReport): string {
  const lines = [
    report.title,
    '='.repeat(report.title.length),
    `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
    '',
    'SUMMARY',
    `Roster: ${report.summary.rosterCount}`,
    `Avg Decision Score: ${report.summary.avgDecisionScore}%`,
    `Weekly Progress: ${report.summary.weeklyProgress}%`,
    '',
    'PLAYERS',
    '-'.repeat(60),
  ];
  for (const p of report.players) {
    lines.push(
      `${p.name} (${p.position})`,
      `  Decision Score: ${p.decisionScore}% | XP: ${p.xp} | Streak: ${p.streak}d | Δ: ${p.improvement > 0 ? '+' : ''}${p.improvement}%`,
    );
  }
  return lines.join('\n');
}

export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain'): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportReportCsv(report: TeamReport): void {
  downloadTextFile(reportToCsv(report), `${report.team?.name ?? 'team'}_${report.period}_report.csv`, 'text/csv');
}

export function exportReportPdf(report: TeamReport): void {
  downloadTextFile(reportToPdfContent(report), `${report.team?.name ?? 'team'}_${report.period}_report.txt`, 'text/plain');
}
