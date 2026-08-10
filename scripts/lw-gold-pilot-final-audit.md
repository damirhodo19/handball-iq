# Left Wing Gold Pilot — Final Audit

**Status: PASS**

Generated: 2026-08-10T09:15:17.906Z

## Headline

| Metric | Value |
|---|---|
| Pilot count | 10 |
| Attack / Defence | 8 / 2 |
| Difficulty | B2 / I4 / A3 / E1 |
| Perception | 9 (90%) |
| Handedness tagged | 0 |
| Systems | {"6-0":5,"5-1":1,"3-2-1":1,"Mixed":3} |

## Scenarios

- `scn_bank_941` · `lw_width_hold_true_width` · Beginner · Attack · 6-0 · perception=false · Left Wing — Hold Width Before the Wing Defender Is Bound
- `scn_bank_942` · `lw_lb_51_outlet_ask_now` · Intermediate · Attack · 5-1 · perception=true · Left Wing — Under 5:1, Stay Wide and Ask Now While Left Back Is Pressured
- `scn_bank_943` · `lw_wd_feet_decide_first_move` · Intermediate · Attack · 6-0 · perception=true · Left Wing — Read the Wing Defender’s Feet Before Your First Move
- `scn_bank_944` · `lw_takeoff_321_half_steps` · Intermediate · Attack · 3-2-1 · perception=true · Left Wing — 3:2:1: Use the Take-Off When the Half Steps Out
- `scn_bank_945` · `lw_entry_when_not` · Advanced · Attack · 6-0 · perception=true · Left Wing — Do Not Enter While Left Back Still Needs the Wide Option
- `scn_bank_946` · `lw_gk_stepout_hands_high_soft_inside` · Advanced · Attack · 6-0 · perception=true · Left Wing — Do Not Automatic-Lob a Stepping Goalkeeper When Left Back Is Free
- `scn_bank_947` · `lw_fw_3v2_hold_left_width` · Intermediate · Attack · Mixed · perception=true · Left Wing — First Wave 3v2: Hold Left Width While Middle Is Covered
- `scn_bank_948` · `lw_6v5_stay_wide_vs_entry_pivot` · Advanced · Attack · Mixed · perception=true · Left Wing — 6v5: Do Not Enter Onto Your Own Pivot When the Wing Defender Narrows
- `scn_bank_949` · `lw_def_controlled_help_keep_wing` · Beginner · Defence · 6-0 · perception=true · Left Wing — Defence in 6:0: Controlled Help Without Leaving the Wing Pass
- `scn_bank_950` · `lw_def_trans_3v2_own_side_lane` · Expert · Defence · Mixed · perception=true · Left Wing — Transition Defence in 3v2: Cut Your Own-Side Pass First

## 948 replacement

- Family: `lw_6v5_stay_wide_vs_entry_pivot`
- Title: Left Wing — 6v5: Do Not Enter Onto Your Own Pivot When the Wing Defender Narrows
- Replaced: true
- Distinct from RW 878 finish-distance: true

## Lock check

| Bank | Count | OK |
|---|---:|---|
| LB | 62 | true |
| RB | 63 | true |
| CB | 70 | true |
| RW | 65 | true |

## Errors

- none

## Warnings

- none

## Coach notes

- 948 now teaches 6v5 stay-wide vs entry from pivot corridor + WD narrow — not finish-distance.
- Pilot remains a quality gate, not Gold-approved.
- Legacy LW 40 still present (total LW 50) until later replacement phase.

**Not Gold-approved. Human coach review still required.**
