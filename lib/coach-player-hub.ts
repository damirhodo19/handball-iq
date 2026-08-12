import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { readStorageJson, writeStorageJson } from '@/lib/platform-storage';

export interface CoachPlayerOverview {
  player_id: string;
  display_name: string;
  primary_position: string | null;
  secondary_position: string | null;
  playing_level: string | null;
  development_goals: string[];
  total_xp: number;
  player_level: string;
  completed_sessions: number;
  average_decision_score: number;
  average_mental_readiness: number;
  average_pressure_control: number;
  last_session_at: string | null;
}

export interface CoachPlayerGoal {
  id: string;
  team_id: string;
  player_id: string;
  coach_id: string;
  title: string;
  progress: number;
  status: 'active' | 'completed';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'hbiq_coach_player_goals_v1';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function localGoals(): CoachPlayerGoal[] {
  return readStorageJson<CoachPlayerGoal[]>(STORAGE_KEY, []);
}

function saveLocalGoals(goals: CoachPlayerGoal[]): void {
  writeStorageJson(STORAGE_KEY, goals);
}

function createId(): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `goal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function canUseCloud(...ids: string[]): boolean {
  return Boolean(isSupabaseConfigured && supabase && ids.every((id) => UUID_RE.test(id)));
}

export async function fetchCoachPlayerOverview(
  teamId: string,
  playerId: string,
): Promise<{ overview: CoachPlayerOverview | null; error: string | null }> {
  if (!canUseCloud(teamId, playerId) || !supabase) return { overview: null, error: null };
  const { data, error } = await supabase.rpc('get_coach_player_overview', {
    p_team_id: teamId,
    p_player_id: playerId,
  });
  const row = Array.isArray(data) ? data[0] : data;
  return {
    overview: row ? { ...row, development_goals: row.development_goals ?? [] } as CoachPlayerOverview : null,
    error: error?.message ?? null,
  };
}

export async function fetchCoachPlayerGoals(teamId: string, playerId: string): Promise<CoachPlayerGoal[]> {
  if (!canUseCloud(teamId, playerId) || !supabase) {
    return localGoals().filter((goal) => goal.team_id === teamId && goal.player_id === playerId);
  }
  const { data, error } = await supabase
    .from('coach_player_goals')
    .select('*')
    .eq('team_id', teamId)
    .eq('player_id', playerId)
    .order('status')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as CoachPlayerGoal[];
}

export async function createCoachPlayerGoal(input: {
  teamId: string;
  playerId: string;
  coachId: string;
  title: string;
  dueDate?: string | null;
}): Promise<{ goal: CoachPlayerGoal | null; error: string | null }> {
  const now = new Date().toISOString();
  const goal: CoachPlayerGoal = {
    id: createId(),
    team_id: input.teamId,
    player_id: input.playerId,
    coach_id: input.coachId,
    title: input.title.trim(),
    progress: 0,
    status: 'active',
    due_date: input.dueDate || null,
    created_at: now,
    updated_at: now,
  };
  if (!canUseCloud(input.teamId, input.playerId, input.coachId) || !supabase) {
    const goals = localGoals();
    if (goals.filter((item) => item.team_id === input.teamId && item.player_id === input.playerId && item.status === 'active').length >= 3) {
      return { goal: null, error: 'goal_limit' };
    }
    saveLocalGoals([goal, ...goals]);
    return { goal, error: null };
  }
  const { data, error } = await supabase.from('coach_player_goals').insert({
    team_id: goal.team_id,
    player_id: goal.player_id,
    coach_id: goal.coach_id,
    title: goal.title,
    due_date: goal.due_date,
  }).select('*').single();
  return { goal: data as CoachPlayerGoal | null, error: error?.message ?? null };
}

export async function updateCoachPlayerGoalProgress(
  goal: CoachPlayerGoal,
  progress: number,
): Promise<string | null> {
  const nextProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const nextStatus = nextProgress >= 100 ? 'completed' : 'active';
  if (!canUseCloud(goal.team_id, goal.player_id, goal.coach_id) || !supabase) {
    saveLocalGoals(localGoals().map((item) => item.id === goal.id
      ? { ...item, progress: nextProgress, status: nextStatus, updated_at: new Date().toISOString() }
      : item));
    return null;
  }
  const { error } = await supabase.from('coach_player_goals').update({
    progress: nextProgress,
    status: nextStatus,
  }).eq('id', goal.id);
  return error?.message ?? null;
}

export async function deleteCoachPlayerGoal(goal: CoachPlayerGoal): Promise<string | null> {
  if (!canUseCloud(goal.team_id, goal.player_id, goal.coach_id) || !supabase) {
    saveLocalGoals(localGoals().filter((item) => item.id !== goal.id));
    return null;
  }
  const { error } = await supabase.from('coach_player_goals').delete().eq('id', goal.id);
  return error?.message ?? null;
}
