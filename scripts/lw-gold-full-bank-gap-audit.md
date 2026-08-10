# Left Wing Full Gold Bank — Phase 1 Gap Audit

**Status:** READ ONLY COMPLETE — no scenarios generated, no bank mutation.

**Verdict:** GAP_AUDIT_COMPLETE — READY TO GENERATE REMAINING FAMILIES

## Locks verified

| Bank | Count | Hash |
|---|---|---|
| LB | 62 | unchanged |
| RB | 63 | unchanged |
| CB | 70 | unchanged |
| RW | 65 | unchanged |

Pilot `941–950` treated as byte-locked.

## Count math

| | Architecture | Pilot locked | Remaining to build | Projected final |
|---|---:|---:|---:|---:|
| Total | 60 | 10 | 49 | **59** |
| Attack | 44 | 8 | 35 | **43** |
| Defence | 16 | 2 | 14 | **16** |

Projected difficulty: B3 / I18 / A30 / E8  
Projected perception (raw matrix): 55/59 (93%) — **too high**; after honesty plan: 50/59 (85%)

> Pilot DNA replaced several original matrix keys. Superseded slots are **not** rebuilt. Small deviation from 44/16 or B10/I22/A20/E8 is acceptable if quality is better.

## Locked pilot (do not touch)

| ID | familyKey | A/D | Diff |
|---|---|---|---|
| scn_bank_941 | `lw_width_hold_true_width` | Attack | Beginner |
| scn_bank_942 | `lw_lb_51_outlet_ask_now` | Attack | Intermediate |
| scn_bank_943 | `lw_wd_feet_decide_first_move` | Attack | Intermediate |
| scn_bank_944 | `lw_takeoff_321_half_steps` | Attack | Intermediate |
| scn_bank_945 | `lw_second_pivot_release_to_width` | Attack | Advanced |
| scn_bank_946 | `lw_gk_stepout_hands_high_soft_inside` | Attack | Advanced |
| scn_bank_947 | `lw_sw_left_wd_late_one_more` | Attack | Advanced |
| scn_bank_948 | `lw_6v5_stay_wide_vs_entry_pivot` | Attack | Advanced |
| scn_bank_949 | `lw_def_recover_wing_from_second_pivot_turnover` | Defence | Advanced |
| scn_bank_950 | `lw_def_empty_own_fill_from_second_pivot_turnover` | Defence | Expert |

## Superseded matrix families (do not rebuild)

| Matrix familyKey | Earned by pilot |
|---|---|
| `lw_takeoff_after_lb_pull` | scn_bank_944 (``) — 944 is the earned take-off family (3:2:1 half-step picture) |
| `lw_lb_ask_when_hips_open` | scn_bank_942 (``) — 942 earns LB ask + 5:1 advance width in one native family |
| `lw_wd_feet_chest_before_move` | scn_bank_943 (``) — superseded |
| `lw_gk_stepout_conditional` | scn_bank_946 (``) — superseded |
| `lw_partially_set_defence` | scn_bank_947 (``) — 947 teaches one-more left action while WD late |
| `lw_6v5_pivot_seal` | scn_bank_948 (``) — 948 is stay-wide vs enter onto own pivot in 6v5 |
| `lw_sys_51_advance_width` | scn_bank_942 (``) — superseded |
| `lw_sys_321_wing_vs_half` | scn_bank_944 (``) — superseded |
| `lw_def_recovery_to_wing` | scn_bank_949 (``) — 949 is stronger sequence-native version; do not also build generic recover-after-help |
| `lw_def_empty_own_after_turnover` | scn_bank_950 (``) — superseded |

## Remaining families to build (49)

### Attack (35)

| familyKey | Diff | Perc | System | Decision |
|---|---|---|---|---|
| `lw_width_stretch_when_lb_binds` | Intermediate | true | 6:0 | Stay/maximize width to keep the pass alive |
| `lw_stay_wide_inside_help` | Intermediate | true | 6:0 | Stay wide; do not follow into the crowded half |
| `lw_entry_when_space_opens` | Advanced | true | 6:0 | Timed entry toward six |
| `lw_entry_when_not` | Advanced | true | 6:0 | Stay wide; early entry kills LB space |
| `lw_backdoor_ball_watch` | Advanced | true | 6:0 | Cut behind WD to six on next pass |
| `lw_takeoff_lane_closed` | Advanced | true | 6:0 | Delay / recycle / soft inside — do not jump into block |
| `lw_lb_delay_ask_lane_blocked` | Intermediate | true | 6:0 | Hold width; do not force the ask into a steal |
| `lw_pivot_block_opens_takeoff` | Intermediate | true | 6:0 | Take off into freed lane; then read GK |
| `lw_pivot_feed_vs_finish` | Advanced | true | 6:0 | Feed pivot vs forced wing shot |
| `lw_1v1_wing_space` | Advanced | true | open/man | Attack 1v1 take-off / beat vs recycle |
| `lw_gk_near_post_commit` | Intermediate | true | 6:0 | Available target is far side — contextual, not folklore |
| `lw_gk_far_side_commit` | Intermediate | true | 6:0 | Near-side finish if lane and body allow — cue-based |
| `lw_gk_depth_read` | Advanced | true | 6:0 | Finish choice from depth + hands, not automatic lob/power |
| `lw_gk_late_movement_patience` | Advanced | true | 6:0 | Patience to abandoned corner vs early release into hands |
| `lw_gk_extreme_angle_body` | Advanced | true | 6:0 | Playable skim / recycle — hand tag only if fork is hand-dependent |
| `lw_fw_2v1_finish_or_pass` | Intermediate | true | transition | Shoot vs give the extra pass |
| `lw_fw_3v2_hold_width` | Intermediate | true | transition | Stay wide to six as pass option — do not crowd middle |
| `lw_fw_arrival_timing` | Intermediate | false | transition | Sprint timing so catch and six arrive together |
| `lw_sw_advantage_gone` | Advanced | true | transition | Hold width into positional attack |
| `lw_trans_lane_vs_recovery` | Advanced | true | transition | Wide lane vs inside lane to keep the advantage |
| `lw_6v5_free_finish` | Advanced | true | 6:0 | Finish now |
| `lw_5v6_safe_possession` | Expert | true | 6:0 | Safe recycle / high-percentage only |
| `lw_7v6_or_empty_opp` | Expert | true | 6:0 | Finish vs keep possession discipline |
| `lw_empty_own_safe_return` | Expert | true | 6:0 | High-percentage finish vs safe return |
| `lw_passive_warning` | Advanced | true | 6:0 | Best real end from width vs panic extreme |
| `lw_late_lead_risk` | Expert | false | 6:0 | Safe recycle / clear high-% only — risk changes the decision |
| `lw_late_trail_create` | Expert | true | 6:0 | Take the clean chance vs over-reset |
| `lw_short_clock` | Expert | true | 6:0 | Immediate end vs impossible force |
| `lw_sys_33_pressure_release` | Advanced | true | 3:3 | Width release / back-door / recycle |
| `lw_sys_42_corridor` | Advanced | true | 4:2 | Entry/take-off timing unique to 4:2 |
| `lw_sys_15_outlet_width` | Intermediate | true | 1:5 | Safe width outlet vs trapped ask |
| `lw_sys_5plus1_trap` | Advanced | true | 5+1 | Width/timing that differs from plain 6:0 |
| `lw_sys_4plus2_lane` | Advanced | true | 4+2 | Lane choice / ask timing |
| `lw_sys_open_man_help` | Advanced | true | open/man | 1v1 attack vs reset — distinct from structured 6:0 entry |
| `lw_recovering_defender_race` | Intermediate | true | 6:0 | Immediate controlled finish vs wait for contact |

### Defence (14)

| familyKey | Diff | Perc | System | Decision |
|---|---|---|---|---|
| `lw_def_protect_opp_wing` | Beginner | true | 6:0 | Deny wing pass / body on lane |
| `lw_def_inside_help_controlled` | Intermediate | true | 6:0 | Help distance vs full abandon |
| `lw_def_handover_timing` | Advanced | true | 6:0 | Release only after handover is real |
| `lw_def_when_not_abandon` | Advanced | true | 6:0 | Stay; do not chase middle |
| `lw_def_lb_wing_coop` | Advanced | true | 6:0 | Body/chest on pass + communicate half |
| `lw_def_wing_entry` | Intermediate | true | 6:0 | Contact/deny path vs ball-watch |
| `lw_def_backdoor_deny` | Advanced | true | 6:0 | Chest/feel contact; do not lose the runner |
| `lw_def_trans_own_side_lane` | Intermediate | true | transition | Sprint cut own-side lane first |
| `lw_def_trans_far_skip_with_map` | Advanced | true | transition | Cut far skip vs protect own wing — A/B must not both be correct |
| `lw_def_comm_half` | Intermediate | true | 6:0 | Help only after communication / confirmed cover |
| `lw_def_sys_60_wing_job` | Beginner | false | 6:0 | Primary wing job before freelancing |
| `lw_def_sys_51_vs_advance` | Advanced | true | 5:1 | System-specific stay/help — differs from 6:0 |
| `lw_def_sys_33_switch` | Advanced | true | 3:3 | Switch vs stay — rule must be in situation text |
| `lw_def_numerical_5v6` | Expert | true | 6:0 | Priority cover without gambling the wing randomly |

## Topic coverage gaps

| Area | Status | Still need |
|---|---|---|
| true width | UNDERCOVERED | `lw_width_stretch_when_lb_binds` |
| corner positioning | UNDERCOVERED | `lw_stay_wide_inside_help`, `lw_lb_delay_ask_lane_blocked` |
| take off timing | UNDERCOVERED | `lw_pivot_block_opens_takeoff`, `lw_recovering_defender_race` |
| take off angle / closed take-off | UNDERCOVERED | `lw_takeoff_lane_closed`, `lw_gk_extreme_angle_body` |
| when to stay wide | UNDERCOVERED | `lw_stay_wide_inside_help`, `lw_width_stretch_when_lb_binds` |
| when to enter | UNDERCOVERED | `lw_entry_when_space_opens`, `lw_backdoor_ball_watch` |
| when not to enter | UNDERCOVERED | `lw_entry_when_not` |
| second pivot use | COVERED | — |
| return from second pivot | COVERED | — |
| LB cooperation | UNDERCOVERED | `lw_lb_delay_ask_lane_blocked`, `lw_width_stretch_when_lb_binds` |
| pivot cooperation | UNDERCOVERED | `lw_pivot_block_opens_takeoff`, `lw_pivot_feed_vs_finish` |
| timing after ball reversal | UNDERCOVERED | `lw_stay_wide_inside_help`, `lw_lb_delay_ask_lane_blocked` |
| playing after defender recovery | UNDERCOVERED | `lw_recovering_defender_race`, `lw_takeoff_lane_closed` |
| 1v1 from wing | UNDERCOVERED | `lw_1v1_wing_space` |
| late pass | UNDERCOVERED | `lw_fw_arrival_timing`, `lw_fw_2v1_finish_or_pass` |
| second action after failed wing release | UNDERCOVERED | `lw_sw_advantage_gone` |
| system 6:0 | UNDERCOVERED | `many set attack/defence under 6:0` |
| system 5:1 | UNDERCOVERED | `lw_def_sys_51_vs_advance` |
| system 3:2:1 | COVERED | — |
| system 3:3 | UNDERCOVERED | `lw_sys_33_pressure_release`, `lw_def_sys_33_switch` |
| system 4:2 | UNDERCOVERED | `lw_sys_42_corridor` |
| system 1:5 | UNDERCOVERED | `lw_sys_15_outlet_width` |
| system 5+1 | UNDERCOVERED | `lw_sys_5plus1_trap` |
| system 4+2 | UNDERCOVERED | `lw_sys_4plus2_lane` |
| open / individual defence | UNDERCOVERED | `lw_1v1_wing_space`, `lw_sys_open_man_help` |
| first wave / 2v1 / 3v2 | UNDERCOVERED | `lw_fw_2v1_finish_or_pass`, `lw_fw_3v2_hold_width`, `lw_fw_arrival_timing` |
| wide lane / late defender | UNDERCOVERED | `lw_trans_lane_vs_recovery`, `lw_recovering_defender_race` |
| second wave keep/stop | UNDERCOVERED | `lw_sw_advantage_gone` |
| wing entry in transition | UNDERCOVERED | `lw_trans_lane_vs_recovery` |
| 6v5 | UNDERCOVERED | `lw_6v5_free_finish` |
| 5v6 | UNDERCOVERED | `lw_5v6_safe_possession`, `lw_def_numerical_5v6` |
| 7v6 / opp empty | UNDERCOVERED | `lw_7v6_or_empty_opp` |
| own empty goal attack | UNDERCOVERED | `lw_empty_own_safe_return` |
| own empty goal defence | COVERED | — |
| passive / late / clock | UNDERCOVERED | `lw_passive_warning`, `lw_late_lead_risk`, `lw_late_trail_create`, `lw_short_clock` |
| GK depth / step / hands / commit / late | UNDERCOVERED | `lw_gk_near_post_commit`, `lw_gk_far_side_commit`, `lw_gk_depth_read`, `lw_gk_late_movement_patience`, `lw_gk_extreme_angle_body` |
| set defence protect/help/handover/backdoor | UNDERCOVERED | `lw_def_protect_opp_wing`, `lw_def_inside_help_controlled`, `lw_def_handover_timing`, `lw_def_when_not_abandon`, `lw_def_lb_wing_coop`, `lw_def_wing_entry`, `lw_def_backdoor_deny`, `lw_def_comm_half`, `lw_def_sys_60_wing_job` |
| transition defence | UNDERCOVERED | `lw_def_trans_own_side_lane`, `lw_def_trans_far_skip_with_map` |
| system defence sparse | UNDERCOVERED | `lw_def_sys_51_vs_advance`, `lw_def_sys_33_switch` |

## Largest remaining gaps

1. **Set defence curriculum** — protect wing, controlled help, handover, do-not-abandon, WD entry/back-door deny, half communication, basic 6:0 wing job (almost entirely missing; pilot defence is transition/empty-own sequence-native only).
2. **GK perception set** — near/far commit, depth, late patience, extreme angle (only step-out/hands-high earned in pilot).
3. **First-wave transition attack** — 2v1, 3v2 hold width, arrival timing (zero in pilot).
4. **Game-state / risk** — empty-own attack return, passive, late lead/trail, short clock, 5v6, 7v6.
5. **Sparse systems** — 3:3, 4:2, 1:5, 5+1, 4+2, open/man (5:1 and 3:2:1 already earned by pilot).
6. **Pivot + closed take-off + 1v1** — still missing native families.

## Legacy LW

40 non-pilot LW scenarios remain in bank. Architecture disposition: remove/replace in insert phase — do not polish in place.

## Next step

Phase 2: generate the **49** remaining families as native LW scenarios, preserve `941–950` byte-identical, leave LB/RB/CB/RW untouched, then replace legacy 40 so final LW Gold = **59** (±2 if merges justified).

**No generation performed in this phase.**


## Recommended difficulty rebalance (planning only)

Before rebalance projection was heavy Advanced. Suggested generation targets after rebalance:

| Level | Target | Projected after rebalance |
|---|---:|---:|
| Beginner | 10 | 11 |
| Intermediate | 22 | 15 |
| Advanced | 20 | 25 |
| Expert | 8 | 8 |

Changes are advisory — cognitive load of the final written cue wins.

## STOP

Phase 1 gap audit only. No scenarios generated. No bank writes. No commit/tag/push/deploy.

## Perception honesty plan

Raw matrix + pilot projects ~93% perception — above the 55–65% target.

Force `perception=false` unless a live cue changes the fork for:

- `lw_fw_arrival_timing`
- `lw_5v6_safe_possession`
- `lw_empty_own_safe_return`
- `lw_late_lead_risk`
- `lw_late_trail_create`
- `lw_short_clock`
- `lw_def_sys_60_wing_job`
- `lw_7v6_or_empty_opp`

Consider false:

- `lw_passive_warning`
- `lw_sys_5plus1_trap`
- `lw_def_numerical_5v6`
- `lw_width_stretch_when_lb_binds`

Projected after force-false list: **50/59 (85%)** — still high; generation must keep tagging honest and may need more false on principle-style system/width scenarios to land in range.
