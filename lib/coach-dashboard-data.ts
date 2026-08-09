// ── Coach Dashboard Data Layer ────────────────────────────────────────────────
// Local mock data with storage, architected for future Supabase migration.
// All types are designed to map 1:1 to database tables.

import { HandballPosition, getPositionGroup, PositionGroup } from '@/lib/positions';
import { readStorageJson, writeStorageJson, removeStorageKey } from '@/lib/platform-storage';
import type { LocalizedMessage } from '@/lib/i18n-message';
import { msg } from '@/lib/i18n-message';

// ── Coach Account Types ────────────────────────────────────────────────────────

export type CoachRole = 'Coach' | 'Assistant Coach' | 'Goalkeeper Coach' | 'Academy Coach';

export interface CoachAccount {
  id: string;
  name: string;
  email: string;
  role: CoachRole;
  teamName: string;
  createdAt: string;
}

// ── Player Types ────────────────────────────────────────────────────────────────

export interface PlayerProfile {
  id: string;
  name: string;
  position: string;
  secondaryPosition: string | null;
  ageGroup: string | null;
  playingLevel: string | null;
  age: number;
  club: string;
  // Scores (0-100)
  decisionScore: number;
  mentalReadiness: number;
  pressurePerformance: number;
  consistency: number;
  readingAbility: number;
  fastBreak: number;
  wingSituations: number;
  pivotSituations: number;
  sevenMetre: number;
  mentalPreparation: number;
  // Trends
  weeklyTrend: number;
  monthlyTrend: number;
  // Meta
  lastSessionDate: string | null;
  sessionsCompleted: number;
  assignedSession: AssignedSession | null;
  notifications: PlayerNotification[];
  weeklyHistory: { week: string; score: number }[];
}

export interface AssignedSession {
  id: string;
  type: SessionType;
  assignedBy: string;
  assignedAt: string;
  dueDate: string;
  note: string;
  completed: boolean;
}

export type SessionType =
  | 'Wing Session'
  | 'Pressure Session'
  | 'Fast Break Session'
  | '7m Session'
  | 'Match Day Preparation'
  | 'Mental Training';

export interface PlayerNotification {
  id: string;
  message: string;
  sentAt: string;
  read: boolean;
}

// ── Calendar Types ──────────────────────────────────────────────────────────────

export type CalendarEventType = 'Training' | 'Match' | 'Recovery' | 'Assigned Session';

export interface CalendarEvent {
  id: string;
  date: string;
  type: CalendarEventType;
  title: LocalizedMessage;
  description: LocalizedMessage;
  playerId?: string;
}

// ── Training Recommendation ─────────────────────────────────────────────────────

export interface TrainingRecommendation {
  playerId: string;
  playerName: string;
  issue: LocalizedMessage;
  recommendation: LocalizedMessage;
  sessionType: SessionType;
  severity: 'high' | 'medium' | 'low';
}

// ── Seed data (no personal/demo names) ───────────────────────────────────────────

function generateMockPlayers(): PlayerProfile[] {
  return [];
}

// ── Storage Layer ────────────────────────────────────────────────────────────────
// Designed for Supabase migration: each function maps to a future table operation.

const KEYS = {
  COACH: 'hbiq_coach_account',
  PLAYERS: 'hbiq_coach_players',
  CALENDAR: 'hbiq_coach_calendar',
  INIT: 'hbiq_coach_initialized',
};

function get<T>(key: string, fallback: T): T {
  return readStorageJson(key, fallback);
}

function set<T>(key: string, value: T): void {
  writeStorageJson(key, value);
}

// ── Initialization ────────────────────────────────────────────────────────────────

function ensureInitialized(): void {
  const init = get<boolean>(KEYS.INIT, false);
  if (!init) {
    set(KEYS.PLAYERS, generateMockPlayers());
    set(KEYS.CALENDAR, generateMockCalendar());
    set(KEYS.INIT, true);
  }
}

function generateMockCalendar(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const today = new Date();
  for (let i = -2; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dow = d.getDay();

    if (dow === 1 || dow === 3) {
      events.push({
        id: `evt_${i}_t`,
        date: dateStr,
        type: 'Training',
        title: msg('cdCalendar.teamTraining.title'),
        description: msg('cdCalendar.teamTraining.desc'),
      });
    }
    if (dow === 6 && i > 0) {
      events.push({
        id: `evt_${i}_m`,
        date: dateStr,
        type: 'Match',
        title: msg('cdCalendar.leagueMatch.title'),
        description: msg('cdCalendar.leagueMatch.desc', { opponent: 'Opponent' }),
      });
    }
    if (dow === 0) {
      events.push({
        id: `evt_${i}_r`,
        date: dateStr,
        type: 'Recovery',
        title: msg('cdCalendar.recovery.title'),
        description: msg('cdCalendar.recovery.desc'),
      });
    }
  }
  return events;
}

// ── Coach Account API ─────────────────────────────────────────────────────────────

export function loadCoachAccount(): CoachAccount | null {
  return get<CoachAccount | null>(KEYS.COACH, null);
}

export function saveCoachAccount(account: CoachAccount): void {
  set(KEYS.COACH, account);
}

export function clearCoachAccount(): void {
  removeStorageKey(KEYS.COACH);
}

export function createCoachAccount(name: string, email: string, role: CoachRole, teamName: string): CoachAccount {
  const account: CoachAccount = {
    id: `coach_${Date.now()}`,
    name,
    email,
    role,
    teamName,
    createdAt: new Date().toISOString(),
  };
  saveCoachAccount(account);
  ensureInitialized();
  return account;
}

// ── Players API ────────────────────────────────────────────────────────────────────

export function loadPlayers(): PlayerProfile[] {
  ensureInitialized();
  return get<PlayerProfile[]>(KEYS.PLAYERS, []);
}

export function savePlayers(players: PlayerProfile[]): void {
  set(KEYS.PLAYERS, players);
}

export function loadPlayerById(id: string): PlayerProfile | null {
  return loadPlayers().find((p) => p.id === id) ?? null;
}

export function updatePlayer(updated: PlayerProfile): void {
  const players = loadPlayers();
  const idx = players.findIndex((p) => p.id === updated.id);
  if (idx >= 0) {
    players[idx] = updated;
    savePlayers(players);
  }
}

export function assignSession(playerId: string, sessionType: SessionType, dueDate: string, note: string, coachName: string): void {
  const players = loadPlayers();
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx >= 0) {
    const assignment: AssignedSession = {
      id: `asg_${Date.now()}`,
      type: sessionType,
      assignedBy: coachName,
      assignedAt: new Date().toISOString(),
      dueDate,
      note,
      completed: false,
    };
    players[idx].assignedSession = assignment;
    savePlayers(players);
    // Also add to calendar
    const calendar = loadCalendar();
    calendar.push({
      id: `evt_asg_${Date.now()}`,
      date: dueDate,
      type: 'Assigned Session',
      title: msg('cdCalendar.assignedSession.title', { sessionType, playerName: players[idx].name }),
      description: note
        ? msg('cdCalendar.assignedNote.default')
        : msg('cdCalendar.assignedSessionDesc', { coachName }),
      playerId,
    });
    set(KEYS.CALENDAR, calendar);
  }
}

export function sendNotification(playerId: string, message: string): void {
  const players = loadPlayers();
  const idx = players.findIndex((p) => p.id === playerId);
  if (idx >= 0) {
    players[idx].notifications.unshift({
      id: `notif_${Date.now()}`,
      message,
      sentAt: new Date().toISOString(),
      read: false,
    });
    savePlayers(players);
  }
}

// ── Calendar API ────────────────────────────────────────────────────────────────────

export function loadCalendar(): CalendarEvent[] {
  ensureInitialized();
  return get<CalendarEvent[]>(KEYS.CALENDAR, []);
}

export function saveCalendar(events: CalendarEvent[]): void {
  set(KEYS.CALENDAR, events);
}

export function addCalendarEvent(event: Omit<CalendarEvent, 'id'>): void {
  const events = loadCalendar();
  events.push({ ...event, id: `evt_${Date.now()}` });
  events.sort((a, b) => a.date.localeCompare(b.date));
  saveCalendar(events);
}

// ── Team Dashboard Stats ────────────────────────────────────────────────────────────────

export interface TeamStats {
  totalPlayers: number;
  todayActive: number;
  sessionsCompleted: number;
  avgDecisionScore: number;
  avgMentalReadiness: number;
  weeklyProgress: number;
}

export function getTeamStats(): TeamStats {
  const players = loadPlayers();
  const today = new Date().toISOString().split('T')[0];
  const todayActive = players.filter((p) => p.lastSessionDate === today).length;
  const sessionsCompleted = players.reduce((sum, p) => sum + p.sessionsCompleted, 0);
  const avgDecisionScore = players.length > 0 ? Math.round(players.reduce((s, p) => s + p.decisionScore, 0) / players.length) : 0;
  const avgMentalReadiness = players.length > 0 ? Math.round(players.reduce((s, p) => s + p.mentalReadiness, 0) / players.length) : 0;
  const weeklyProgress = players.length > 0 ? Math.round(players.reduce((s, p) => s + p.weeklyTrend, 0) / players.length) : 0;

  return {
    totalPlayers: players.length,
    todayActive,
    sessionsCompleted,
    avgDecisionScore,
    avgMentalReadiness,
    weeklyProgress,
  };
}

// ── Team Analysis ────────────────────────────────────────────────────────────────────────

export interface TeamAnalysis {
  strongestSkill: { key: string; score: number };
  weakestSkill: { key: string; score: number };
  mostImprovedPlayer: PlayerProfile | null;
  playerRequiringAttention: PlayerProfile | null;
  avgMentalReadiness: number;
}

export function getTeamAnalysis(): TeamAnalysis {
  const players = loadPlayers();
  if (players.length === 0) {
    return {
      strongestSkill: { key: 'coach.skill.decisionMaking', score: 0 },
      weakestSkill: { key: 'coach.skill.decisionMaking', score: 0 },
      mostImprovedPlayer: null,
      playerRequiringAttention: null,
      avgMentalReadiness: 0,
    };
  }

  const skills: { key: keyof PlayerProfile; i18nKey: string }[] = [
    { key: 'decisionScore', i18nKey: 'coach.skill.decisionMaking' },
    { key: 'pressurePerformance', i18nKey: 'coach.skill.pressureHandling' },
    { key: 'consistency', i18nKey: 'coach.skill.consistency' },
    { key: 'readingAbility', i18nKey: 'coach.skill.readingShooter' },
    { key: 'fastBreak', i18nKey: 'coach.skill.fastBreak' },
    { key: 'wingSituations', i18nKey: 'coach.skill.wingSituations' },
    { key: 'pivotSituations', i18nKey: 'coach.skill.wingSituations' },
    { key: 'sevenMetre', i18nKey: 'coach.skill.sevenMetre' },
    { key: 'mentalPreparation', i18nKey: 'coach.skill.mentalPreparation' },
  ];

  const skillAverages = skills.map((s) => ({
    key: s.i18nKey,
    score: Math.round(players.reduce((sum, p) => sum + (p[s.key] as number), 0) / players.length),
  }));

  const sorted = [...skillAverages].sort((a, b) => b.score - a.score);
  const strongestSkill = sorted[0];
  const weakestSkill = sorted[sorted.length - 1];

  // Most improved: highest weeklyTrend
  const sortedByTrend = [...players].sort((a, b) => b.weeklyTrend - a.weeklyTrend);
  const mostImprovedPlayer = sortedByTrend[0];

  // Player requiring attention: lowest decision score
  const sortedByScore = [...players].sort((a, b) => a.decisionScore - b.decisionScore);
  const playerRequiringAttention = sortedByScore[0];

  const avgMentalReadiness = Math.round(players.reduce((s, p) => s + p.mentalReadiness, 0) / players.length);

  return {
    strongestSkill,
    weakestSkill,
    mostImprovedPlayer,
    playerRequiringAttention,
    avgMentalReadiness,
  };
}

// ── Training Recommendations ─────────────────────────────────────────────────────────

export function generateRecommendations(player: PlayerProfile): TrainingRecommendation[] {
  const recs: TrainingRecommendation[] = [];

  if (player.wingSituations < 55) {
    recs.push({
      playerId: player.id,
      playerName: player.name,
      issue: msg('cdRecommend.issue.wingSituations'),
      recommendation: msg('cdRecommend.action.wingSituations'),
      sessionType: 'Wing Session',
      severity: player.wingSituations < 45 ? 'high' : 'medium',
    });
  }

  if (player.pressurePerformance < 55) {
    recs.push({
      playerId: player.id,
      playerName: player.name,
      issue: msg('cdRecommend.issue.pressure'),
      recommendation: msg('cdRecommend.action.pressure'),
      sessionType: 'Pressure Session',
      severity: player.pressurePerformance < 45 ? 'high' : 'medium',
    });
  }

  if (player.fastBreak < 55) {
    recs.push({
      playerId: player.id,
      playerName: player.name,
      issue: msg('cdRecommend.issue.fastBreak'),
      recommendation: msg('cdRecommend.action.fastBreak'),
      sessionType: 'Fast Break Session',
      severity: player.fastBreak < 45 ? 'high' : 'medium',
    });
  }

  if (player.sevenMetre < 50) {
    recs.push({
      playerId: player.id,
      playerName: player.name,
      issue: msg('cdRecommend.issue.sevenMetre'),
      recommendation: msg('cdRecommend.action.sevenMetre'),
      sessionType: '7m Session',
      severity: player.sevenMetre < 40 ? 'high' : 'medium',
    });
  }

  if (player.mentalPreparation < 55) {
    recs.push({
      playerId: player.id,
      playerName: player.name,
      issue: msg('cdRecommend.issue.mentalPreparation'),
      recommendation: msg('cdRecommend.action.mentalPreparation'),
      sessionType: 'Mental Training',
      severity: player.mentalPreparation < 45 ? 'high' : 'low',
    });
  }

  if (player.readingAbility < 55) {
    recs.push({
      playerId: player.id,
      playerName: player.name,
      issue: msg('cdRecommend.issue.readingAbility'),
      recommendation: msg('cdRecommend.action.readingAbility'),
      sessionType: 'Match Day Preparation',
      severity: 'low',
    });
  }

  if (recs.length === 0) {
    recs.push({
      playerId: player.id,
      playerName: player.name,
      issue: msg('cdRecommend.issue.none'),
      recommendation: msg('cdRecommend.action.none'),
      sessionType: 'Match Day Preparation',
      severity: 'low',
    });
  }

  return recs;
}

export function generateTeamRecommendations(): TrainingRecommendation[] {
  const players = loadPlayers();
  const allRecs: TrainingRecommendation[] = [];
  for (const player of players) {
    allRecs.push(...generateRecommendations(player));
  }
  // Sort by severity: high first
  const severityOrder = { high: 0, medium: 1, low: 2 };
  return allRecs.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

// ── Position Filters ────────────────────────────────────────────────────────────

export function filterPlayersByPosition(position: string): PlayerProfile[] {
  return loadPlayers().filter((p) => p.position === position);
}

export function filterPlayersByAgeGroup(ageGroup: string): PlayerProfile[] {
  return loadPlayers().filter((p) => p.ageGroup === ageGroup);
}

export function filterPlayersByLevel(level: string): PlayerProfile[] {
  return loadPlayers().filter((p) => p.playingLevel === level);
}

export function filterPlayers(filters: { position?: string; ageGroup?: string; playingLevel?: string }): PlayerProfile[] {
  return loadPlayers().filter((p) => {
    if (filters.position && p.position !== filters.position) return false;
    if (filters.ageGroup && p.ageGroup !== filters.ageGroup) return false;
    if (filters.playingLevel && p.playingLevel !== filters.playingLevel) return false;
    return true;
  });
}

// ── Team Overview by Position Group ────────────────────────────────────────────

export interface PositionGroupStats {
  group: string;
  count: number;
  avgDecisionScore: number;
  avgMentalReadiness: number;
  players: PlayerProfile[];
}

export function getTeamOverviewByPosition(): PositionGroupStats[] {
  const players = loadPlayers();
  const groups: PositionGroupStats[] = [];
  const groupMap = new Map<string, PlayerProfile[]>();

  for (const p of players) {
    const group = getPositionGroup(p.position as HandballPosition);
    if (!groupMap.has(group)) groupMap.set(group, []);
    groupMap.get(group)!.push(p);
  }

  for (const [group, groupPlayers] of groupMap) {
    const avgDecision = groupPlayers.length > 0
      ? Math.round(groupPlayers.reduce((s, p) => s + p.decisionScore, 0) / groupPlayers.length)
      : 0;
    const avgMental = groupPlayers.length > 0
      ? Math.round(groupPlayers.reduce((s, p) => s + p.mentalReadiness, 0) / groupPlayers.length)
      : 0;
    groups.push({
      group,
      count: groupPlayers.length,
      avgDecisionScore: avgDecision,
      avgMentalReadiness: avgMental,
      players: groupPlayers,
    });
  }

  // Sort by group name for consistent ordering
  return groups.sort((a, b) => a.group.localeCompare(b.group));
}
