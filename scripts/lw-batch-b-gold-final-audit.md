# LW Batch B — Final Gold Adversarial Audit

**Status: LW BATCH B GOLD APPROVED**

Gold locked range: **941–974**  
Pilot 941–950 · Batch A 951–962 · Batch B 963–974

Repaired in closure: 963 · 964 · 970 · 974  
Untouched: 965–969 · 971–973

---

## Gate checklist

| Check | Result |
|---|---|
| 0 A/B ambiguous | PASS |
| 0 semantic duplicates | PASS |
| 0 unjustified system labels | PASS |
| 0 fake perception | PASS |
| 0 unjustified difficulty | PASS |
| 0 coach risk >4 | PASS |
| Natural HR/EN/DE | PASS |
| Valid geometry | PASS |
| No RW side-flip masquerade | PASS |
| Validators | PASS |
| LB/RB/CB/RW hashes | PASS |
| 941–962 + untouched B unchanged | PASS |
| No 975 | PASS |

---

## Scenario audit table

| ID | family | A/B | spoil | sys | perc | diff | dup | risk | verdict | gold |
|---|---|---|---|---|---|---|---|---|---|---|
| scn_bank_963 | `lw_sys_5plus1_trap` | CLEAR | PASS | PASS | PASS | PASS | UNIQUE | 3 | KEEP | YES |
| scn_bank_964 | `lw_entry_when_space_opens` | CLEAR | PASS | N/A | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |
| scn_bank_965 | `lw_recovering_defender_race` | CLEAR | PASS | PASS | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |
| scn_bank_966 | `lw_backdoor_ball_watch` | CLEAR | PASS | PASS | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |
| scn_bank_967 | `lw_entry_when_not` | CLEAR | BORDERLINE | PASS | PASS | PASS | UNIQUE | 3 | KEEP | YES |
| scn_bank_968 | `lw_1v1_wing_space` | CLEAR | PASS | PASS | PASS | PASS | UNIQUE | 3 | KEEP | YES |
| scn_bank_969 | `lw_pivot_feed_vs_finish` | CLEAR | PASS | PASS | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |
| scn_bank_970 | `lw_def_sys_51_vs_advance` | CLEAR | PASS | PASS | PASS | PASS | UNIQUE | 3 | KEEP | YES |
| scn_bank_971 | `lw_late_lead_risk` | CLEAR | PASS | PASS | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |
| scn_bank_972 | `lw_def_trans_own_side_lane` | CLEAR | PASS | PASS | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |
| scn_bank_973 | `lw_def_when_not_abandon` | CLEAR | PASS | PASS | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |
| scn_bank_974 | `lw_def_handover_timing` | CLEAR | PASS | PASS | PASS | PASS | RELATED_BUT_DISTINCT | 3 | KEEP | YES |

---

## Per-scenario notes

### scn_bank_963 — `lw_sys_5plus1_trap`
- Closest LW: scn_bank_942 / 967
- Closest RW: no direct 5+1 twin
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Patient width until LB moves advanced; remove-advanced collapses fork; perception true earned

### scn_bank_964 — `lw_entry_when_space_opens`
- Closest LW: scn_bank_967
- Closest RW: scn_bank_890 / 893
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Dual-cue intact; nahraniti removed; distinct from 967/890/893

### scn_bank_965 — `lw_recovering_defender_race`
- Closest LW: scn_bank_954
- Closest RW: scn_bank_882
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Race-over-GK-patience fork holds

### scn_bank_966 — `lw_backdoor_ball_watch`
- Closest LW: scn_bank_943
- Closest RW: scn_bank_891
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: LB catch co-cue keeps distinct from pure ball-watch

### scn_bank_967 — `lw_entry_when_not`
- Closest LW: scn_bank_941
- Closest RW: no identical twin
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Question slightly leading but A/B still real; opposite of 964; not Gold-blocking

### scn_bank_968 — `lw_1v1_wing_space`
- Closest LW: scn_bank_944
- Closest RW: no clear twin
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Open defence isolation with help-distance cue

### scn_bank_969 — `lw_pivot_feed_vs_finish`
- Closest LW: scn_bank_946
- Closest RW: scn_bank_888
- Nativity: STRONGLY_LW_NATIVE
- Mirror: CONTEXTUAL
- Notes: Sealed pivot soft lane vs dirty wing shot

### scn_bank_970 — `lw_def_sys_51_vs_advance`
- Closest LW: scn_bank_961 / 942
- Closest RW: scn_bank_940
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Ownership inferred from active pressure; Intermediate honest; remove-advanced changes fork

### scn_bank_971 — `lw_late_lead_risk`
- Closest LW: scn_bank_959
- Closest RW: scn_bank_921
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Expert earned by late one-goal risk consequence

### scn_bank_972 — `lw_def_trans_own_side_lane`
- Closest LW: scn_bank_949
- Closest RW: scn_bank_929
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Own-side first-wave pass-lane priority

### scn_bank_973 — `lw_def_when_not_abandon`
- Closest LW: scn_bank_962
- Closest RW: scn_bank_934
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Reverse + inside help already present; distinct from 974 handover timing

### scn_bank_974 — `lw_def_handover_timing`
- Closest LW: scn_bank_962 / 973
- Closest RW: scn_bank_880 / 928
- Nativity: CONTEXTUALLY_LW_NATIVE
- Mirror: UNIVERSAL_ESSENTIAL
- Notes: Team-agreed takeover condition; Intermediate honest; distinct from 962/880

## Distributions (Batch B)

- Attack / Defence: 8 / 4
- Difficulty: {"Advanced":4,"Intermediate":7,"Expert":1}
- Perception T/F: 9 / 3
- Systems: {"5+1":1,"6-0":8,"Open":1,"5-1":1,"Mixed":1}
- Numerical: {"6v6":11,"transition":1}
- Nativity: {"CONTEXTUALLY_LW_NATIVE":11,"STRONGLY_LW_NATIVE":1}
- Max coach risk: 3

## Distributions (Gold 941–974)

- Attack / Defence: 26 / 8
- Difficulty: {"Beginner":5,"Intermediate":16,"Advanced":10,"Expert":3}
- Perception T/F: 26 / 8 (76%)
- Systems: {"6-0":22,"5-1":2,"3-2-1":1,"Mixed":7,"5+1":1,"Open":1}

## Lock artifact

`scripts/.lw-batch-b-gold-lock.json`

## Decision

# LW BATCH B GOLD APPROVED
