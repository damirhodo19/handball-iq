# LW Batch C — Final Gold Adversarial Audit

**Status: LW BATCH C GOLD APPROVED**

Gold locked range: **941–981**
Gold count: **41**

Repaired: 975 (`lw_def_backdoor_deny`) · 977 (`lw_gk_extreme_angle_body`)
Polished: 976 · 978 · 979
Unchanged: 980 · 981
Abandoned: `lw_def_comm_half` · `lw_def_sys_33_switch` (3:3)

---

## Gate checklist

| Check | Result |
|---|---|
| A/B CLEAR all 7 | PASS |
| 0 semantic duplicates | PASS |
| 0 decorative systems | PASS |
| 0 decorative numerical | PASS |
| 0 unjustified difficulty | PASS |
| 0 unjustified perception | PASS |
| Natural HR/EN/DE | PASS |
| Max coach risk ≤4 | PASS (4) |
| 941–974 byte-identical | PASS |
| 980/981 byte-identical | PASS |
| LB/RB/CB/RW hashes | PASS |
| Counts LB62/RB63/CB70/RW65 | {"LB":62,"RB":63,"CB":70,"RW":65} |
| No 982 | PASS |

## Scenario audit table

| ID | family | A/B | sys | num | perc | diff | dup | risk | gold |
|---|---|---|---|---|---|---|---|---|---|
| scn_bank_975 | `lw_def_backdoor_deny` | CLEAR | PASS | PASS | true | Advanced | RELATED_BUT_DISTINCT | 4 | YES |
| scn_bank_976 | `lw_def_wing_entry` | CLEAR | PASS | PASS | true | Beginner | RELATED_BUT_DISTINCT | 2 | YES |
| scn_bank_977 | `lw_gk_extreme_angle_body` | CLEAR | PASS | PASS | true | Advanced | RELATED_BUT_DISTINCT | 4 | YES |
| scn_bank_978 | `lw_def_trans_far_skip_with_map` | CLEAR | PASS | PASS | true | Intermediate | RELATED_BUT_DISTINCT | 3 | YES |
| scn_bank_979 | `lw_def_numerical_5v6` | CLEAR | PASS | PASS | false | Advanced | UNIQUE | 4 | YES |
| scn_bank_980 | `lw_sys_4plus2_lane` | CLEAR | PASS | PASS | true | Advanced | RELATED_BUT_DISTINCT | 3 | YES |
| scn_bank_981 | `lw_sys_open_man_help` | CLEAR | PASS | PASS | false | Intermediate | RELATED_BUT_DISTINCT | 3 | YES |

## Per-scenario notes

### scn_bank_975 — `lw_def_backdoor_deny`
- Teaching: Keep contact / deny back-door when drive pulls eyes; leave only after real half takeover
- Geometry: LW contact on opp RW; opp RB drives half; opp RW cuts behind; half on drive no takeover
- A now: Keep contact and deny back-door — do not fully chase drive
- B when: Leave runner only if half already has contact and called ownership
- A/B: CLEAR
- HR: NATURAL
- System: PASS — 6:0 half engagement shapes ownership but decision is contact discipline
- Numerical: PASS — 6v6 not decorative
- Difficulty: Advanced · Perception: true
- Closest LW: scn_bank_976
- Closest RW: scn_bank_932 / 934
- Duplicate: RELATED_BUT_DISTINCT vs 976 (ball-watch entry start vs drive-distraction contact maintenance)
- Nativity: CONTEXTUALLY_LW_NATIVE
- Coach risk: 4

### scn_bank_976 — `lw_def_wing_entry`
- Teaching: Close opp wing entry behind you — do not ball-watch
- Geometry: LW on left wing; ball at opp RB nine; opp RW cuts behind to six; no takeover call
- A now: Turn, find contact, close entry — do not watch ball while runner goes to six
- B when: Leave path only after half has taken runner with contact and call
- A/B: CLEAR
- HR: NATURAL
- System: PASS — 6:0
- Numerical: PASS
- Difficulty: Beginner · Perception: true
- Closest LW: scn_bank_975 / 966
- Closest RW: scn_bank_932
- Duplicate: RELATED_BUT_DISTINCT vs 975/966
- Nativity: CONTEXTUALLY_LW_NATIVE
- Coach risk: 2

### scn_bank_977 — `lw_gk_extreme_angle_body`
- Teaching: Extreme-angle soft skim when sliver playable; recycle when help/GK kill skim
- Geometry: LW extreme left angle; WD late off arm; GK near body covers near side; thin far-low skim visible; help >2m; LB free
- A now: Soft skim far-low now — gap still playable
- B when: Short return to LB if help arrives inside 2m or GK closes remaining skim
- A/B: CLEAR
- HR: NATURAL
- System: PASS — 6:0 not load-bearing; system label OK as default set defence
- Numerical: PASS
- Difficulty: Advanced · Perception: true
- Closest LW: scn_bank_946 / 955 / 956
- Closest RW: no extreme-angle skim-vs-recycle twin
- Duplicate: RELATED_BUT_DISTINCT — not lob (946), not corner-pick (955/956)
- Nativity: STRONGLY_LW_NATIVE
- Coach risk: 4

### scn_bank_978 — `lw_def_trans_far_skip_with_map`
- Teaching: Cut far-side outlet long pass only when own sideline already covered
- Geometry: Transition after turnover; teammate already between opp RW and ball on own sideline; GK looking far LW for long first outlet; far wing high/open
- A now: Leave own side and cut long pass to their left wing
- B when: Stay and guard own wing if own-sideline cover not yet there
- A/B: CLEAR
- HR: NATURAL — skip removed from player-facing text
- System: PASS — Mixed/transition
- Numerical: PASS — transition relevant
- Difficulty: Intermediate · Perception: true
- Closest LW: scn_bank_972 / 949
- Closest RW: scn_bank_929
- Duplicate: RELATED_BUT_DISTINCT — far-side cut with own-side map vs own-side lane first
- Nativity: CONTEXTUALLY_LW_NATIVE
- Coach risk: 3

### scn_bank_979 — `lw_def_numerical_5v6`
- Teaching: In 5v6 close most dangerous free pass first (far long wing pass)
- Geometry: 5v6 after exclusion other side; ball at opp RB; near wing wide; far wing unmarked for long cross; teammate stuck on pivot
- A now: Close free long pass to far wing first — do not gamble early on near wing
- B when: Shift to near wing only after teammate removed the long pass
- A/B: CLEAR
- HR: NATURAL
- System: PASS — 6:0 shell under exclusion
- Numerical: PASS — 5v6 creates priority
- Difficulty: Advanced · Perception: false
- Closest LW: scn_bank_978 / 962
- Closest RW: scn_bank_917 family inverse
- Duplicate: UNIQUE teaching (short-handed far-pass priority)
- Nativity: CONTEXTUALLY_LW_NATIVE
- Coach risk: 4

### scn_bank_980 — `lw_sys_4plus2_lane`
- Teaching: Vs 4+2 attack open left lane between advanced pair while LB can still feed
- Geometry: Two advanced defenders high left; open corridor between them to six; LB has ball; outer advanced closes wide finish; inner advanced drifted center
- A now: Attack open lane between them now while LB can still play
- B when: Return ball if both advanced close the gap before catch
- A/B: CLEAR
- HR: NATURAL
- System: PASS — 4+2 creates the corridor decision
- Numerical: PASS
- Difficulty: Advanced · Perception: true
- Closest LW: scn_bank_963 / 942
- Closest RW: scn_bank_937
- Duplicate: RELATED_BUT_DISTINCT vs 4+2 corridor RW; LW left-lane nativity
- Nativity: CONTEXTUALLY_LW_NATIVE
- Coach risk: 3

### scn_bank_981 — `lw_sys_open_man_help`
- Teaching: In open defence return when help arrives into isolation before takeoff secure
- Geometry: LW 1v1; wing defender in front; second defender arrives inside 2m before takeoff secure; LB free for short return
- A now: Short return to LB — do not force 1v1 into arrived help
- B when: Attack 1v1 only if help still >2m when catch is secure
- A/B: CLEAR
- HR: NATURAL
- System: PASS — Open creates help-arrive isolation fork
- Numerical: PASS
- Difficulty: Intermediate · Perception: false
- Closest LW: scn_bank_968 / 944
- Closest RW: scn_bank_895 / open help families
- Duplicate: RELATED_BUT_DISTINCT — return-when-help vs attack-when-space
- Nativity: CONTEXTUALLY_LW_NATIVE
- Coach risk: 3

## Distributions (Batch C 975–981)

```json
{
  "attackDefence": {
    "Defence": 4,
    "Attack": 3
  },
  "difficulty": {
    "Advanced": 4,
    "Beginner": 1,
    "Intermediate": 2
  },
  "perception": {
    "true": 5,
    "false": 2
  },
  "systems": {
    "6-0": 4,
    "Mixed": 1,
    "4+2": 1,
    "Open": 1
  },
  "numerical": {
    "6v6": 5,
    "transition": 1,
    "5v6": 1
  },
  "maxCoachRisk": 4
}
```

## Distributions (Gold 941–981)

```json
{
  "attackDefence": {
    "Attack": 29,
    "Defence": 12
  },
  "difficulty": {
    "Beginner": 6,
    "Intermediate": 18,
    "Advanced": 14,
    "Expert": 3
  },
  "perception": {
    "false": 10,
    "true": 31
  },
  "systems": {
    "6-0": 26,
    "5-1": 2,
    "3-2-1": 1,
    "Mixed": 8,
    "5+1": 1,
    "Open": 2,
    "4+2": 1
  },
  "numerical": {
    "6v6": 32,
    "transition": 4,
    "6v5": 1,
    "7v6": 1,
    "2v1": 1,
    "5v6": 2
  },
  "familiesUsed": 41,
  "maxCoachRisk": 4
}
```

## Full LW curriculum check

Question: Would adding another LW scenario teach an essential decision that a player currently cannot learn from 941–981?
Answer: **NO**

**LW GOLD CURRICULUM COMPLETE AT 41**

### Remaining unused families from original 49-family matrix

Summary: `{"DUPLICATE / EXHAUSTED":15,"REJECTED ARCHITECTURE":3}`

| familyKey | classification | why |
|---|---|---|
| `lw_6v5_free_finish` | DUPLICATE / EXHAUSTED | RW 917 twin |
| `lw_7v6_or_empty_opp` | DUPLICATE / EXHAUSTED | RW 912/913/915 |
| `lw_def_comm_half` | REJECTED ARCHITECTURE | 961/973/974 duplicate |
| `lw_def_lb_wing_coop` | DUPLICATE / EXHAUSTED | 962 twin |
| `lw_def_protect_opp_wing` | DUPLICATE / EXHAUSTED | 880/962 DNA |
| `lw_def_sys_33_switch` | REJECTED ARCHITECTURE | no 3:3-native LW defence survived remove-label |
| `lw_empty_own_safe_return` | DUPLICATE / EXHAUSTED | RW 879 twin |
| `lw_fw_3v2_hold_width` | DUPLICATE / EXHAUSTED | RW 876 twin |
| `lw_gk_late_movement_patience` | DUPLICATE / EXHAUSTED | overlaps 955/956 |
| `lw_gk_near_post_commit` | DUPLICATE / EXHAUSTED | RW 875 / corner-pick architecture |
| `lw_late_trail_create` | DUPLICATE / EXHAUSTED | RW 922 twin |
| `lw_short_clock` | DUPLICATE / EXHAUSTED | RW 925/926 twin |
| `lw_stay_wide_inside_help` | DUPLICATE / EXHAUSTED | RW 895 semantic twin |
| `lw_sw_advantage_gone` | DUPLICATE / EXHAUSTED | RW 877 twin |
| `lw_sys_15_outlet_width` | REJECTED ARCHITECTURE | decorative 1:5 |
| `lw_sys_33_pressure_release` | DUPLICATE / EXHAUSTED | RW 936 twin |
| `lw_sys_42_corridor` | DUPLICATE / EXHAUSTED | RW 937 twin |
| `lw_trans_lane_vs_recovery` | DUPLICATE / EXHAUSTED | RW 905 twin |

## Validators

All safe validators PASS. Mutating `audit:scenario-quality` not run.

LB 62 / RB 63 / CB 70 / RW 65 unchanged. 941–974 byte-identical.

## STOP

No 982. No Batch D. No commit / tag / push / deploy.
