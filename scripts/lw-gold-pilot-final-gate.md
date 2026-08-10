# LW Final Native Defence — Report & Gold Gate

## Verdict

**LW GOLD PILOT APPROVED**

No blockers.

## Phase A

- Strong candidates: **2** (C1, C2)
- Phase B allowed: **yes**

## Replacements

| ID | Old familyKey | New familyKey |
|---|---|---|
| 949 | `lw_def_deny_backdoor_left` | `lw_def_recover_wing_from_second_pivot_turnover` |
| 950 | `lw_def_recovery_to_wing_after_help` | `lw_def_empty_own_fill_from_second_pivot_turnover` |

### Tactical notes

- **949:** Possession lost while still second pivot → first sprint out to the abandoned left wing lane (continuity with 945).
- **950:** Same preceding entry with own GK out → fill empty-own lane first because you are the nearest body from inside.

### Mirror tests

- **949:** PASS — sequence-native start (second pivot), not set-wing label flip.
- **950:** PASS — empty-own priority from second-pivot start; no RW defence twin.

## Pilot 10 scorecard

| ID | familyKey | diff | A/D | perc | hand | system | num | nativity | closest RW | dup | A/B | risk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| scn_bank_941 | `lw_width_hold_true_width` | Beginner | Attack | false | none | 6-0 | 6v6 | CONTEXTUALLY LW NATIVE | scn_bank_871 / width hold families | none | CLEAR | 2 |
| scn_bank_942 | `lw_lb_51_outlet_ask_now` | Intermediate | Attack | true | none | 5-1 | 6v6 | STRONGLY LW NATIVE | scn_bank_872 outlet ask families | none | CLEAR | 2 |
| scn_bank_943 | `lw_wd_feet_decide_first_move` | Intermediate | Attack | true | none | 6-0 | 6v6 | CONTEXTUALLY LW NATIVE | RW wing-defender feet reads | none | CLEAR | 3 |
| scn_bank_944 | `lw_takeoff_321_half_steps` | Intermediate | Attack | true | none | 3-2-1 | 6v6 | STRONGLY LW NATIVE | scn_bank_875 / 3:2:1 take-off | none | CLEAR | 3 |
| scn_bank_945 | `lw_second_pivot_release_to_width` | Advanced | Attack | true | none | 6-0 | 6v6 | STRONGLY LW NATIVE | RW second-pivot enter families (attack) | none | CLEAR | 3 |
| scn_bank_946 | `lw_gk_stepout_hands_high_soft_inside` | Advanced | Attack | true | none | 6-0 | 6v6 | STRONGLY LW NATIVE | RW GK lob families | none | CLEAR | 2 |
| scn_bank_947 | `lw_sw_left_wd_late_one_more` | Advanced | Attack | true | none | Mixed | transition | STRONGLY LW NATIVE | RW second-wave families | none | CLEAR | 3 |
| scn_bank_948 | `lw_6v5_stay_wide_vs_entry_pivot` | Advanced | Attack | true | none | Mixed | 6v5 | STRONGLY LW NATIVE | RW 6v5 entry families | none | CLEAR | 2 |
| scn_bank_949 | `lw_def_recover_wing_from_second_pivot_turnover` | Advanced | Defence | true | none | Mixed | 6v6 | STRONGLY LW NATIVE | scn_bank_930 / scn_bank_927 | none | CLEAR | 3 |
| scn_bank_950 | `lw_def_empty_own_fill_from_second_pivot_turnover` | Expert | Defence | true | none | Mixed | 7v6 | STRONGLY LW NATIVE | scn_bank_931 (conceptual body-between-ball-goal; no empty-own twin) | none | CLEAR | 4 |

## Totals

- count: 10
- attack/defence: 8/2
- difficulty: {"Beginner":1,"Intermediate":3,"Advanced":5,"Expert":1}
- perception: 9/10 (90%)
- handedness: {"none":10}
- systems: {"6-0":4,"5-1":1,"3-2-1":1,"Mixed":4}
- strongly LW native: 8
- contextually LW native: 2
- universal: 0
- semantic duplicates: 0
- max coach risk: 4

## Lock verification

| Bank | count | expected | hash ok |
|---|---|---|---|
| LB | 62 | 62 | true |
| RB | 63 | 63 | true |
| CB | 70 | 70 | true |
| RW | 65 | 65 | true |

Locked pilot seeds 941–948 unchanged: **true**


## Validators

| Check | Result |
|---|---|
| typecheck | PASS |
| terminology | PASS |
| unique-session | PASS |
| personalization | PASS |
| match-day tactics | PASS |
| tactical systems | PASS |
| no-position-fallback | PASS |
| archetypes | PASS |
| LB Gold | PASS (62) |
| RB Gold | PASS (63) |
| CB Gold | PASS (70) |
| RW Gold | PASS (65) |
| audit:scenario-quality | SKIPPED (mutating) |

## Files changed

- `content/scenario-bank/scenarios.json`
- `scripts/scenario-bank/data/lw-pilot-10.json`
- `scripts/lw-final-native-defence-plan.json`
- `scripts/lw-final-native-defence-plan.md`
- `scripts/lw-final-native-defence-report.json`
- `scripts/lw-final-native-defence-report.md`
- `scripts/lw-gold-pilot-final-gate.json`
- `scripts/lw-gold-pilot-final-gate.md`
- `scripts/lw-gold-pilot-10-review.md`
- `scripts/lw-gold-pilot-10-review.json`
- `scripts/apply-lw-final-native-defence.mjs`
- `scripts/audit-lw-final-native-defence-gate.mjs`
- `scripts/lw-final-native-defence-apply.json`
- `scripts/.lw-final-def-lock-before.json`
