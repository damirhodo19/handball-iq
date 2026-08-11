/** Coach Gold architecture: 70 non-overlapping decision families, 10 per category. */
export const COACH_GOLD_TARGET = 70;
export const COACH_GOLD_PER_CATEGORY = 10;
export const COACH_GOLD_CATEGORIES = [
  'timeout',
  'defensive_adjustment',
  'substitution',
  'training_plan',
  'player_development',
  'opponent_analysis',
  'leadership',
];
export const COACH_TYPES = [
  'Youth Coach',
  'Senior Coach',
  'Professional Coach',
  'Goalkeeper Coach',
  'Assistant Coach',
  'Head Coach',
];
export const EXPERIENCE_BANDS = ['0-2', '3-5', '6-10', '10+'];

export const COACH_LEGACY_SOURCE_HASHES = {
  'lib/coach-platform/challenges.ts': '33771da5ffb3c58356a6973429ffb50c038cf01f8cf65d29985499435e151e57',
  'lib/coach-platform/challenges-extra.ts': 'd0e0afd3728c6a36270874674468f67dda9e46c9b5860a1411d68da34c089308',
};

const experienceFor = (difficulty) => ({
  Beginner: ['0-2', '3-5'],
  Intermediate: ['0-2', '3-5', '6-10'],
  Advanced: ['3-5', '6-10', '10+'],
  Expert: ['6-10', '10+'],
}[difficulty]);
const F = (category, familyKey, difficulty, coachTypeTags = COACH_TYPES, experienceTags = experienceFor(difficulty)) => ({
  category,
  familyKey,
  difficulty,
  coachTypeTags,
  experienceTags,
});

export const COACH_GOLD_FAMILIES = [
  F('timeout', 'timeout_trailing_vs_5_1_first_pass_trap', 'Advanced'),
  F('timeout', 'timeout_stop_7v6_double_pivot_run', 'Expert'),
  F('timeout', 'timeout_protect_one_goal_lead', 'Advanced'),
  F('timeout', 'timeout_youth_emotional_reset', 'Beginner', ['Youth Coach', 'Assistant Coach', 'Head Coach']),
  F('timeout', 'timeout_after_consecutive_turnovers', 'Intermediate'),
  F('timeout', 'timeout_goalkeeper_shot_pattern', 'Advanced', ['Goalkeeper Coach', 'Assistant Coach', 'Head Coach']),
  F('timeout', 'timeout_short_handed_final_minute', 'Expert'),
  F('timeout', 'timeout_passive_play_final_attack', 'Advanced'),
  F('timeout', 'timeout_stop_opponent_transition_run', 'Intermediate'),
  F('timeout', 'timeout_tied_last_possession', 'Expert'),

  F('defensive_adjustment', 'defence_block_goalkeeper_long_range_cooperation', 'Advanced'),
  F('defensive_adjustment', 'defence_7v6_weak_side_wing_protection', 'Expert'),
  F('defensive_adjustment', 'defence_5_1_front_defender_beaten', 'Advanced'),
  F('defensive_adjustment', 'defence_pivot_fronting_and_help', 'Advanced'),
  F('defensive_adjustment', 'defence_wing_overhelp_backcourt_shot', 'Intermediate'),
  F('defensive_adjustment', 'defence_transition_protect_centre_first', 'Intermediate'),
  F('defensive_adjustment', 'defence_double_pivot_in_6v5', 'Expert'),
  F('defensive_adjustment', 'defence_left_handed_right_back_release', 'Advanced'),
  F('defensive_adjustment', 'defence_empty_goal_recovery_roles', 'Advanced'),
  F('defensive_adjustment', 'defence_open_system_youth_spacing', 'Beginner', ['Youth Coach', 'Assistant Coach', 'Head Coach']),

  F('substitution', 'substitution_attack_defence_late_exchange', 'Advanced'),
  F('substitution', 'substitution_youth_learning_error', 'Intermediate', ['Youth Coach', 'Assistant Coach', 'Head Coach']),
  F('substitution', 'substitution_frustrated_backcourt_player', 'Intermediate'),
  F('substitution', 'substitution_short_handed_defensive_roles', 'Advanced'),
  F('substitution', 'substitution_goalkeeper_after_read_breakdown', 'Advanced', ['Goalkeeper Coach', 'Assistant Coach', 'Head Coach']),
  F('substitution', 'substitution_fresh_wing_for_transition', 'Intermediate'),
  F('substitution', 'substitution_pivot_exclusion_management', 'Expert'),
  F('substitution', 'substitution_fresh_defender_final_five', 'Advanced'),
  F('substitution', 'substitution_seven_metre_taker_plan', 'Intermediate'),
  F('substitution', 'substitution_young_player_debut_role', 'Beginner', ['Youth Coach', 'Assistant Coach', 'Head Coach']),

  F('training_plan', 'training_transition_defence_after_missed_shot', 'Intermediate'),
  F('training_plan', 'training_match_in_48_hours_freshness', 'Advanced'),
  F('training_plan', 'training_attack_against_5_1_progression', 'Advanced'),
  F('training_plan', 'training_youth_shooting_technique_transfer', 'Beginner', ['Youth Coach', 'Assistant Coach']),
  F('training_plan', 'training_goalkeeper_defence_cooperation', 'Advanced', ['Goalkeeper Coach', 'Assistant Coach', 'Head Coach']),
  F('training_plan', 'training_small_roster_high_repetition', 'Intermediate'),
  F('training_plan', 'training_post_match_low_load_learning', 'Intermediate'),
  F('training_plan', 'training_midweek_microcycle_priority', 'Expert'),
  F('training_plan', 'training_numerical_play_decision_transfer', 'Advanced'),
  F('training_plan', 'training_mixed_experience_group', 'Intermediate'),

  F('player_development', 'development_pivot_receive_under_contact', 'Intermediate'),
  F('player_development', 'development_goalkeeper_wing_angle', 'Advanced', ['Goalkeeper Coach', 'Assistant Coach', 'Head Coach']),
  F('player_development', 'development_centre_back_scan_before_catch', 'Advanced'),
  F('player_development', 'development_wing_takeoff_repertoire', 'Intermediate'),
  F('player_development', 'development_backcourt_shot_selection', 'Advanced'),
  F('player_development', 'development_defender_communication_habit', 'Beginner'),
  F('player_development', 'development_confidence_after_misses', 'Intermediate'),
  F('player_development', 'development_individual_plan_from_evidence', 'Expert'),
  F('player_development', 'development_role_change_without_identity_loss', 'Advanced'),
  F('player_development', 'development_youth_to_senior_transition', 'Expert', ['Youth Coach', 'Senior Coach', 'Professional Coach', 'Assistant Coach', 'Head Coach']),

  F('opponent_analysis', 'analysis_defence_switch_trigger', 'Intermediate'),
  F('opponent_analysis', 'analysis_left_handed_right_back_pattern', 'Advanced'),
  F('opponent_analysis', 'analysis_7v6_primary_route', 'Expert'),
  F('opponent_analysis', 'analysis_fast_break_first_outlet', 'Advanced'),
  F('opponent_analysis', 'analysis_goalkeeper_tendency_sample', 'Advanced', ['Goalkeeper Coach', 'Assistant Coach', 'Head Coach']),
  F('opponent_analysis', 'analysis_passive_play_response', 'Intermediate'),
  F('opponent_analysis', 'analysis_substitution_pattern', 'Advanced'),
  F('opponent_analysis', 'analysis_timeout_first_action', 'Intermediate'),
  F('opponent_analysis', 'analysis_defensive_transition_vulnerability', 'Advanced'),
  F('opponent_analysis', 'analysis_avoid_video_sample_bias', 'Expert'),

  F('leadership', 'leadership_bench_argument', 'Advanced'),
  F('leadership', 'leadership_align_assistant_message', 'Advanced', ['Assistant Coach', 'Head Coach', 'Senior Coach', 'Professional Coach']),
  F('leadership', 'leadership_captain_disagrees_with_plan', 'Advanced'),
  F('leadership', 'leadership_young_player_public_mistake', 'Beginner', ['Youth Coach', 'Assistant Coach', 'Head Coach']),
  F('leadership', 'leadership_playing_time_conversation', 'Intermediate'),
  F('leadership', 'leadership_selection_fairness', 'Expert'),
  F('leadership', 'leadership_training_standard_breach', 'Intermediate'),
  F('leadership', 'leadership_post_loss_debrief', 'Advanced'),
  F('leadership', 'leadership_referee_pressure_discipline', 'Advanced'),
  F('leadership', 'leadership_staff_error_ownership', 'Expert'),
].map((family, index) => ({ ...family, index: index + 1, id: `coach_gold_${String(index + 1).padStart(3, '0')}` }));

export const COACH_GOLD_PILOT_FAMILY_KEYS = COACH_GOLD_CATEGORIES.flatMap((category) =>
  COACH_GOLD_FAMILIES.filter((family) => family.category === category).slice(0, 2).map(({ familyKey }) => familyKey),
);
