/**
 * Right Wing Gold Bank — tactical model & family taxonomy (post-recovery).
 * Quality > count. Healthy range ~50–65 distinct teaching scenarios.
 * Pilot-approved principles: cue first, one first decision, real geometry, no fixed hand→post rules.
 */

export const RW_TACTICAL_MODEL = {
  role: 'Right Wing (desno krilo)',
  identity: [
    'width keeper in positional attack',
    'finish reader from the corner',
    'right-back cooperation partner',
    'pivot-block exploiter',
    'goalkeeper reader on take-off',
    'first-wave lane runner',
    'second-wave organizer into positional attack',
    'numerical-situation finisher or safe recirculator',
    'empty-goal risk manager',
    'wing-side defender with handover discipline',
  ],
  decisionPattern: 'see cue → choose first action → finish/pass from geometry',
  perceptionTargetPct: null, // justified by content, not a quota
  perceptionFloorPct: 30,
  defenceTargetPct: 15,
  defenceFloorPct: 12,
  familyTarget: 'parent areas with genuinely distinct teaching scenarios',
  scenarioFloor: 50,
  scenarioTargetHint: '50–65 (not a quota)',
};

/** Parent tactical areas → active unique familyKeys (recovered bank). */
export const RW_PARENT_FAMILIES = {
  positional_takeoff: {
    label: 'Positional take-off & width',
    keys: [
      'rw_60_rb_binds_takeoff',
      'rw_60_defender_stays_home',
      'rw_60_defender_late_recover',
      'rw_60_takeoff_closed_from_inside',
      'rw_60_stay_wide_for_release',
      'rw_60_step_inside_for_lane',
    ],
  },
  rb_timing: {
    label: 'RB pass timing & hips',
    keys: [
      'rw_rb_hips_ask_now',
      'rw_rb_hips_wait_recover',
      'rw_rb_create_width_for_drive',
      'rw_rb_short_vs_long_release',
      'rw_rb_not_ready_hold_width',
    ],
  },
  entry: {
    label: 'Wing entry timing',
    keys: [
      'rw_entry_when_not',
      'rw_entry_when_yes_second',
      'rw_entry_backdoor_open',
      'rw_entry_crowd_rb_space',
      'rw_entry_after_help_leaves',
    ],
  },
  pivot: {
    label: 'Pivot cooperation',
    keys: [
      'rw_pivot_block_middle_takeoff',
      'rw_pivot_roll_after_seal',
      'rw_pivot_decoy_stay_wide',
      'rw_pivot_feed_unavailable',
    ],
  },
  gk: {
    label: 'Goalkeeper reads',
    keys: [
      'rw_gk_near_post_commit',
      'rw_gk_stays_deep',
      'rw_gk_attacks_wing',
      'rw_gk_drops_hands_lob',
      'rw_gk_opens_during_takeoff',
      'rw_gk_near_arm_high',
    ],
  },
  transition_first: {
    label: 'First-wave transition',
    keys: [
      'rw_trans_3v2_hold_width',
      'rw_trans_2v1_finish_lane',
      'rw_trans_pressure_catch',
      'rw_trans_cut_after_pass',
    ],
  },
  transition_second: {
    label: 'Second-wave / settle',
    keys: ['rw_trans_second_wave_positional', 'rw_trans_safe_continuation'],
  },
  numerical: {
    label: 'Numerical situations',
    keys: [
      'rw_6v5_free_finish',
      'rw_6v5_recycle_when_covered',
      'rw_5v6_safe_width',
      'rw_7v6_extra_attacker_space',
      'rw_7v6_no_force_covered',
    ],
  },
  empty_goal: {
    label: 'Empty goal / late risk',
    keys: [
      'rw_empty_own_goal_safe_return',
      'rw_empty_own_goal_clean_finish',
      'rw_opp_empty_goal_quick_finish',
    ],
  },
  after_rb: {
    label: 'After RB draws two / rotation',
    keys: [
      'rw_after_rb_two_finish',
      'rw_after_rb_two_short_return',
      'rw_rotation_finish_window',
      'rw_rotation_too_late_recycle',
    ],
  },
  endgame: {
    label: 'End-game / special state',
    keys: [
      'rw_protect_one_goal_lead',
      'rw_trailing_one_force_window',
      'rw_passive_warning_clear_lane',
      'rw_passive_warning_no_force',
      'rw_bad_catch_late_possession',
      'rw_clock_safe_return',
      'rw_fast_restart_ready',
    ],
  },
  defence: {
    label: 'Defence',
    keys: [
      'rw_def_protect_wing_until_handover',
      'rw_def_handover_then_help',
      'rw_def_close_transition_lane',
      'rw_def_return_correct_lane',
      'rw_def_stop_first_wave',
      'rw_def_2v2_wing_side',
      'rw_def_deny_long_outlet',
      'rw_def_ball_vs_wing_choice',
    ],
  },
  systems: {
    label: 'Other systems (non-6:0 attack)',
    keys: [
      'rw_51_wide_vs_point',
      'rw_33_fast_ball_wide',
      'rw_42_free_lane_finish',
      'rw_open_1v1_wing',
      'rw_321_behind_high_wing',
      'rw_15_punish_high_wing_def',
    ],
  },
};

export const RW_ALL_FAMILY_KEYS = Object.values(RW_PARENT_FAMILIES).flatMap((p) => p.keys);

export const RW_PILOT_MAPPING = {
  rw_pilot_01: 'rw_60_rb_binds_takeoff',
  rw_pilot_02: 'rw_rb_hips_ask_now',
  rw_pilot_03: 'rw_entry_when_not',
  rw_pilot_04: 'rw_pivot_block_middle_takeoff',
  rw_pilot_05: 'rw_gk_near_post_commit',
  rw_pilot_06: 'rw_trans_3v2_hold_width',
  rw_pilot_07: 'rw_trans_second_wave_positional',
  rw_pilot_08: 'rw_6v5_free_finish',
  rw_pilot_09: 'rw_empty_own_goal_safe_return',
  rw_pilot_10: 'rw_def_protect_wing_until_handover',
};

/** Locked tactical-quality references — do not rewrite. */
export const RW_LOCKED_REFERENCES = [
  'rw_rb_hips_ask_now', // scn_bank_872
  'rw_entry_when_not', // scn_bank_873
  'rw_trans_3v2_hold_width', // scn_bank_876
  'rw_empty_own_goal_safe_return', // scn_bank_879
  'rw_gk_stays_deep', // scn_bank_897
];

export const RW_PERCEPTION_KEYS = new Set([
  'rw_60_rb_binds_takeoff',
  'rw_60_defender_late_recover',
  'rw_60_takeoff_closed_from_inside',
  'rw_60_step_inside_for_lane',
  'rw_rb_hips_ask_now',
  'rw_rb_hips_wait_recover',
  'rw_rb_not_ready_hold_width',
  'rw_entry_when_not',
  'rw_entry_when_yes_second',
  'rw_entry_backdoor_open',
  'rw_entry_after_help_leaves',
  'rw_pivot_block_middle_takeoff',
  'rw_pivot_roll_after_seal',
  'rw_gk_near_post_commit',
  'rw_gk_stays_deep',
  'rw_gk_attacks_wing',
  'rw_gk_drops_hands_lob',
  'rw_gk_opens_during_takeoff',
  'rw_gk_near_arm_high',
  'rw_trans_3v2_hold_width',
  'rw_trans_2v1_finish_lane',
  'rw_trans_pressure_catch',
  'rw_trans_cut_after_pass',
  'rw_trans_safe_continuation',
  'rw_6v5_free_finish',
  'rw_6v5_recycle_when_covered',
  'rw_7v6_extra_attacker_space',
  'rw_7v6_no_force_covered',
  'rw_empty_own_goal_safe_return',
  'rw_empty_own_goal_clean_finish',
  'rw_after_rb_two_finish',
  'rw_after_rb_two_short_return',
  'rw_rotation_finish_window',
  'rw_rotation_too_late_recycle',
  'rw_bad_catch_late_possession',
  'rw_def_protect_wing_until_handover',
  'rw_def_close_transition_lane',
  'rw_321_behind_high_wing',
]);

const n = RW_ALL_FAMILY_KEYS.length;
if (n < RW_TACTICAL_MODEL.scenarioFloor) {
  throw new Error(`RW taxonomy below floor: ${n} < ${RW_TACTICAL_MODEL.scenarioFloor}`);
}
if (new Set(RW_ALL_FAMILY_KEYS).size !== n) {
  throw new Error('Duplicate RW family keys in taxonomy');
}
