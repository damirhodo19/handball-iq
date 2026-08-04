import { supabase } from '@/lib/supabase';
import { TrainingScenario, DailyProgress } from '@/types/database';

const db = () => {
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
};

export async function recordAttempt(params: {
  scenarioId: string;
  chosenIndex: number;
  isCorrect: boolean;
  reactionMs: number;
  pointsEarned: number;
}): Promise<{ error: string | null }> {
  try {
    const { error } = await db().from('training_attempts').insert({
    scenario_id: params.scenarioId,
    chosen_index: params.chosenIndex,
    is_correct: params.isCorrect,
    reaction_ms: params.reactionMs,
    points_earned: params.pointsEarned,
  });
  if (error) return { error: error.message };
  return { error: null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to record attempt.' };
  }
}

export async function fetchScenarios(): Promise<{ scenarios: TrainingScenario[] | null; error: string | null }> {
  try {
    const { data, error } = await db().from('training_scenarios').select('*').order('difficulty', { ascending: true });
    if (error) return { scenarios: null, error: error.message };
    return { scenarios: data as TrainingScenario[], error: null };
  } catch (e: any) {
    return { scenarios: null, error: e.message ?? 'Failed to fetch scenarios.' };
  }
}

export async function fetchRecentAttempts(limit = 20) {
  try {
    const { data, error } = await db()
      .from('training_attempts')
      .select('*, training_scenarios(difficulty, category)')
      .order('answered_at', { ascending: false })
      .limit(limit);
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export async function fetchDailyProgress(days = 7): Promise<{ data: DailyProgress[] | null; error: string | null }> {
  try {
    const { data, error } = await db()
      .from('daily_progress')
      .select('*')
      .order('date', { ascending: false })
      .limit(days);
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export async function updateDailyProgress(params: {
  isCorrect: boolean;
  pointsEarned: number;
  reactionMs: number;
}): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await db()
      .from('daily_progress')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    const prev = existing as DailyProgress | null;
    const totalScenarios = (prev?.scenarios_completed ?? 0) + 1;
    const totalPoints = (prev?.points_earned ?? 0) + params.pointsEarned;
    const prevCorrect = prev ? Math.round((prev.accuracy / 100) * prev.scenarios_completed) : 0;
    const newCorrect = prevCorrect + (params.isCorrect ? 1 : 0);
    const accuracy = totalScenarios > 0 ? (newCorrect / totalScenarios) * 100 : 0;
    const avgReaction = prev
      ? Math.round(((prev.avg_reaction_ms * prev.scenarios_completed) + params.reactionMs) / totalScenarios)
      : params.reactionMs;

    if (prev) {
      await db().from('daily_progress').update({
        scenarios_completed: totalScenarios,
        points_earned: totalPoints,
        accuracy,
        avg_reaction_ms: avgReaction,
      }).eq('id', prev.id);
    } else {
      await db().from('daily_progress').insert({
        date: today,
        scenarios_completed: 1,
        points_earned: params.pointsEarned,
        accuracy: params.isCorrect ? 100 : 0,
        avg_reaction_ms: params.reactionMs,
      });
    }
  } catch (e) {
    console.warn('[training] updateDailyProgress error:', e);
  }
}

export async function updateStreakAndScore(params: { isCorrect: boolean; pointsEarned: number }) {
  try {
    const { data: profile } = await db().from('profiles').select('*').maybeSingle();
    if (!profile) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const lastActive = profile.last_active_date ? new Date(profile.last_active_date).toISOString().split('T')[0] : null;

    let newStreak = profile.streak;
    if (lastActive !== todayStr) {
      if (lastActive) {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        newStreak = lastActive === yesterdayStr ? profile.streak + 1 : 1;
      } else {
        newStreak = 1;
      }
    }

    const newScore = Math.min(100, Math.max(0, profile.handball_iq_score + (params.isCorrect ? 1 : -1)));
    const newTotalPoints = profile.total_points + params.pointsEarned;

    await db().from('profiles').update({
      streak: newStreak,
      last_active_date: todayStr,
      handball_iq_score: newScore,
      total_points: newTotalPoints,
      updated_at: new Date().toISOString(),
    }).eq('id', profile.id);
  } catch (e) {
    console.warn('[training] updateStreakAndScore error:', e);
  }
}

export async function fetchMatchPreps() {
  try {
    const { data, error } = await db()
      .from('match_preparations')
      .select('*')
      .order('match_date', { ascending: false })
      .limit(10);
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export async function fetchReviews() {
  try {
    const { data, error } = await db()
      .from('post_match_reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}
