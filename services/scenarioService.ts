import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Scenario } from '@/types/database';
import { AdminScenario } from '@/lib/admin-storage';
import { HandballPosition } from '@/lib/positions';

// Convert admin-scenario (local) to DB row
function toDbRow(s: Partial<AdminScenario>): Partial<Scenario> {
  return {
    title: s.title,
    title_hr: s.title_hr,
    title_de: s.title_de,
    position: s.position ?? '',
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
    situation_hr: s.situation_hr,
    situation_de: s.situation_de,
    question: s.question ?? '',
    question_hr: s.question_hr,
    question_de: s.question_de,
    answer_options: s.answerOptions ?? [],
    answer_options_hr: s.answerOptions_hr,
    answer_options_de: s.answerOptions_de,
    recommended_answer: s.recommendedAnswer ?? 0,
    explanation: s.explanation ?? '',
    explanation_hr: s.explanation_hr,
    explanation_de: s.explanation_de,
    learning_objective: s.learningObjective ?? '',
    learning_objective_hr: s.learningObjective_hr,
    learning_objective_de: s.learningObjective_de,
    mental_skill: s.mentalSkill ?? null,
    tactical_skill: s.tacticalSkill ?? null,
    common_mistake: s.commonMistake ?? null,
    common_mistake_hr: s.commonMistake_hr,
    common_mistake_de: s.commonMistake_de,
    coach_note: s.coachNote ?? null,
    coach_note_hr: s.coachNote_hr,
    coach_note_de: s.coachNote_de,
    pressure_level: s.pressureLevel ?? 'Moderate',
  };
}

// Convert DB row to admin-scenario (local)
function toAdminScenario(s: Scenario): AdminScenario {
  return {
    id: s.id,
    title: s.title,
    title_hr: s.title_hr ?? undefined,
    title_de: s.title_de ?? undefined,
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
    situation_hr: s.situation_hr ?? undefined,
    situation_de: s.situation_de ?? undefined,
    question: s.question,
    question_hr: s.question_hr ?? undefined,
    question_de: s.question_de ?? undefined,
    answerOptions: s.answer_options ?? [],
    answerOptions_hr: s.answer_options_hr ?? undefined,
    answerOptions_de: s.answer_options_de ?? undefined,
    recommendedAnswer: s.recommended_answer,
    explanation: s.explanation,
    explanation_hr: s.explanation_hr ?? undefined,
    explanation_de: s.explanation_de ?? undefined,
    learningObjective: s.learning_objective,
    learningObjective_hr: s.learning_objective_hr ?? undefined,
    learningObjective_de: s.learning_objective_de ?? undefined,
    mentalSkill: s.mental_skill ?? '',
    tacticalSkill: s.tactical_skill ?? '',
    commonMistake: s.common_mistake ?? '',
    commonMistake_hr: s.common_mistake_hr ?? undefined,
    commonMistake_de: s.common_mistake_de ?? undefined,
    coachNote: s.coach_note ?? '',
    coachNote_hr: s.coach_note_hr ?? undefined,
    coachNote_de: s.coach_note_de ?? undefined,
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
      // Quote values — "Left Back" contains a space and breaks unquoted PostgREST filters
      .or(`position.eq."${position}",position.eq.All`)
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
