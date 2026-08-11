/** Pivot Gold target architecture: 60 unique decision families. */
export const PIVOT_GOLD_TARGET = 60;
export const PIVOT_LEGACY_BASELINE_HASH =
  '777a81c3af3dea64aa5130798ca6750e1c6795ed7de968b20ad2a118114f24a1';
export const GOALKEEPER_LEGACY_BASELINE_HASH =
  'e06abb4dd22739074bf1dd04dc8f6b063d61c80799cee2d1ebf61c1cf1821af4';

const families = (area, keys) => keys.map((familyKey) => ({ area, familyKey }));

export const PIVOT_GOLD_FAMILIES = [
  ...families('positioning_and_seals', [
    'pv_60_opposite_ball_seal',
    'pv_60_reseal_after_reversal',
    'pv_fronted_escape_to_soft_side',
    'pv_show_not_hide_behind_middle',
    'pv_clear_drive_lane_then_reseal',
    'pv_low_high_seal_from_defender_hips',
    'pv_choose_gap_between_two_middles',
    'pv_halfspace_spacing_with_wing_entry',
    'pv_cross_screen_set_before_contact',
    'pv_legal_screen_stationary_base',
  ]),
  ...families('receiving_and_finishing', [
    'pv_bounce_target_behind_front',
    'pv_high_feed_secure_above_contact',
    'pv_catch_under_back_contact',
    'pv_turn_from_defender_hip',
    'pv_finish_read_goalkeeper_depth',
    'pv_finish_through_legal_contact',
    'pv_draw_seven_not_force_balance',
    'pv_secure_before_help_arrives',
    'pv_release_out_of_double_team',
    'pv_endgame_one_action_finish',
  ]),
  ...families('defensive_systems_and_numbers', [
    'pv_51_live_behind_advanced',
    'pv_51_screen_advanced_recovery_lane',
    'pv_321_pocket_behind_high_half',
    'pv_33_short_roll_after_pressure',
    'pv_42_screen_marking_defender',
    'pv_5plus1_free_marked_back_legally',
    'pv_4plus2_middle_outlet_timing',
    'pv_open_defence_slip_not_wrestle',
    'pv_man_to_man_screen_then_slip',
    'pv_7v6_first_pivot_spacing',
    'pv_7v6_second_pivot_weak_side',
    'pv_7v6_do_not_force_inside',
    'pv_6v5_seal_late_rotator',
    'pv_5v6_safe_release_no_inside_force',
    'pv_passive_play_quick_reseal',
  ]),
  ...families('cooperation', [
    'pv_cb_direct_feed_window',
    'pv_lb_drive_clear_then_return',
    'pv_rb_cross_screen_timing',
    'pv_wing_entry_exchange',
    'pv_step_out_handoff_only_on_call',
    'pv_double_pivot_same_line_avoidance',
    'pv_screen_goalkeeper_sightline_legally',
    'pv_fake_screen_and_slip',
    'pv_reseal_after_defensive_switch',
    'pv_reverse_ball_move_before_help',
  ]),
  ...families('transition', [
    'pv_first_wave_middle_trailer',
    'pv_second_wave_rim_run',
    'pv_turnover_middle_recovery',
    'pv_transition_match_opposing_pivot',
    'pv_counterpress_only_with_cover',
  ]),
  ...families('defence', [
    'pv_def_60_control_opposing_pivot',
    'pv_def_handover_with_half',
    'pv_def_51_back_line_organise',
    'pv_def_321_middle_cover',
    'pv_def_block_without_holding',
    'pv_def_step_out_on_back_catch',
    'pv_def_7v6_second_pivot_call',
    'pv_def_5v6_protect_six_first',
    'pv_def_transition_own_middle',
    'pv_def_endgame_foul_discipline',
  ]),
];

if (PIVOT_GOLD_FAMILIES.length !== PIVOT_GOLD_TARGET) {
  throw new Error(`Pivot taxonomy count ${PIVOT_GOLD_FAMILIES.length} != ${PIVOT_GOLD_TARGET}`);
}

export const PIVOT_PILOT_FAMILY_KEYS = [
  'pv_60_opposite_ball_seal',
  'pv_clear_drive_lane_then_reseal',
  'pv_bounce_target_behind_front',
  'pv_legal_screen_stationary_base',
  'pv_51_live_behind_advanced',
  'pv_321_pocket_behind_high_half',
  'pv_7v6_first_pivot_spacing',
  'pv_finish_read_goalkeeper_depth',
  'pv_turnover_middle_recovery',
  'pv_def_60_control_opposing_pivot',
];
