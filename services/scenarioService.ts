import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Scenario } from '@/types/database';
import { AdminScenario } from '@/lib/admin-storage';
import { HandballPosition } from '@/lib/positions';

// Convert admin-scenario (local) to DB row
function toDbRow(s: Partial<AdminScenario>): Partial<Scenario> {
  return {
    title: s.title,
    position: s.position ?? 'Goalkeeper',
    secondary_positions: s.secondaryPositions ?? [],
    category: s.category ?? 'General',
    difficulty: s.difficulty ?? 'Intermediate',
    age_group: s.ageGroup ?? 'All',
    playing_level: s.playingLevel ?? 'All',
    status: s.status ?? 'Draft',
    match_phase: s.matchPhase ?? 'First Half',
    minute: s.minute ?? 15,
    home_score: null,
    away_score: null,
    attack_or_defence: s.attackOrDefence ?? 'Defence',
    players_on_court: String(s.playersOnCourt ?? 7),
    defensive_system: s.defensiveSystem ?? '6-0',
    situation: s.situation ?? '',
    question: s.question ?? '',
    answer_options: s.answerOptions ?? [],
    recommended_answer: s.recommendedAnswer ?? 0,
    explanation: s.explanation ?? '',
    learning_objective: s.learningObjective ?? '',
    mental_skill: s.mentalSkill ?? null,
    tactical_skill: s.tacticalSkill ?? null,
    common_mistake: s.commonMistake ?? null,
    coach_note: s.coachNote ?? null,
    pressure_level: s.pressureLevel ?? 'Moderate',
  };
}

// Convert DB row to admin-scenario (local)
function toAdminScenario(s: Scenario): AdminScenario {
  return {
    id: s.id,
    title: s.title,
    position: s.position as any,
    secondaryPositions: (s.secondary_positions ?? []) as any[],
    category: s.category,
    difficulty: s.difficulty as any,
    ageGroup: s.age_group as any,
    playingLevel: s.playing_level as any,
    status: s.status as any,
    matchPhase: s.match_phase as any,
    minute: s.minute,
    score: s.home_score != null && s.away_score != null ? `${s.home_score}-${s.away_score}` : '12-11',
    attackOrDefence: s.attack_or_defence as any,
    playersOnCourt: parseInt(s.players_on_court) || 7,
    defensiveSystem: s.defensive_system as any,
    situation: s.situation,
    question: s.question,
    answerOptions: s.answer_options ?? [],
    recommendedAnswer: s.recommended_answer,
    explanation: s.explanation,
    learningObjective: s.learning_objective,
    mentalSkill: s.mental_skill ?? '',
    tacticalSkill: s.tactical_skill ?? '',
    commonMistake: s.common_mistake ?? '',
    coachNote: s.coach_note ?? '',
    pressureLevel: s.pressure_level as any,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
    createdBy: s.created_by ?? 'admin',
  };
}

export async function fetchPublishedScenariosForPosition(position: HandballPosition): Promise<AdminScenario[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('status', 'Published')
      .is('deleted_at', null)
      .or(`position.eq.${position},position.eq.All,secondary_positions.cs.{${position}}`)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return (data as Scenario[]).map(toAdminScenario);
  } catch {
    return [];
  }
}

export async function fetchPublishedScenarios(filters?: {
  ageGroup?: string;
  playingLevel?: string;
  category?: string;
  difficulty?: string;
}): Promise<AdminScenario[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    let query = supabase
      .from('scenarios')
      .select('*')
      .eq('status', 'Published')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters?.ageGroup && filters.ageGroup !== 'All') {
      query = query.or(`age_group.eq.${filters.ageGroup},age_group.eq.All`);
    }
    if (filters?.playingLevel && filters.playingLevel !== 'All') {
      query = query.or(`playing_level.eq.${filters.playingLevel},playing_level.eq.All`);
    }
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);

    const { data, error } = await query;
    if (error || !data) return [];
    return (data as Scenario[]).map(toAdminScenario);
  } catch {
    return [];
  }
}

export async function fetchAllScenarios(): Promise<AdminScenario[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });
    if (error || !data) return [];
    return (data as Scenario[]).map(toAdminScenario);
  } catch {
    return [];
  }
}

export async function createScenarioDb(scenario: Partial<AdminScenario>): Promise<{ error: string | null; id: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.', id: null };
  try {
    const { data, error } = await supabase
      .from('scenarios')
      .insert(toDbRow(scenario))
      .select('id')
      .single();
    if (error) return { error: error.message, id: null };
    return { error: null, id: data.id };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to create scenario.', id: null };
  }
}

export async function updateScenarioDb(id: string, updates: Partial<AdminScenario>): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.from('scenarios').update(toDbRow(updates)).eq('id', id);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to update scenario.' };
  }
}

export async function softDeleteScenarioDb(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.from('scenarios').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to delete scenario.' };
  }
}

export async function restoreScenarioDb(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.from('scenarios').update({ deleted_at: null }).eq('id', id);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to restore scenario.' };
  }
}

export async function hardDeleteScenarioDb(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };
  try {
    const { error } = await supabase.from('scenarios').delete().eq('id', id);
    return { error: error?.message ?? null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to permanently delete scenario.' };
  }
}

export async function importScenariosDb(scenarios: Partial<AdminScenario>[]): Promise<{ imported: number; errors: string[] }> {
  if (!isSupabaseConfigured || !supabase) return { imported: 0, errors: ['Supabase not configured.'] };
  const errors: string[] = [];
  let imported = 0;
  for (const s of scenarios) {
    const { error } = await createScenarioDb(s);
    if (error) errors.push(`${s.title ?? 'Unknown'}: ${error}`);
    else imported++;
  }
  return { imported, errors };
}
