# LW Batch B Repair — Phase A (Architecture Only)

**Verdict: FOUR STRONG REPLACEMENTS FOUND**

Mode: concept design only. No `scenarios.json` edits. No HR/EN/DE text. No scenario 975. No Batch C. No commit/tag/push/deploy.

Locks verified (counts only; content of 941–974 unchanged): LB 62 · RB 63 · CB 70 · RW 65.

---

## Compact candidate table

| ID | Slot | familyKey | A/D | Sys | Diff | Perc | Risk | Status |
|---|---|---|---|---|---|---|---|---|
| 963-A | 963 | `lw_sys_5plus1_trap` | Attack | 5+1 | Adv | F | 3 | **FINALIST** |
| 963-B | 963 | `lw_sys_4plus2_lane` | Attack | 4+2 | Adv | T | 3 | Alternate |
| 963-C | 963 | `lw_sys_42_corridor` | Attack | 4-2 | Int | F | 7 | Rejected (≈RW 937) |
| 963-D | 963 | `lw_sys_open_man_help` | Attack | Open | Int | F | 3 | Alternate |
| 964-A | 964 | `lw_entry_when_space_opens` | Attack | 6-0 | Adv | T | 4 | **FINALIST** |
| 964-B | 964 | `lw_stay_wide_inside_help` | Attack | 6-0 | Beg | T | 3 | Alternate |
| 964-C | 964 | `lw_trans_lane_vs_recovery` | Attack | Mix | Adv | T | 7 | Rejected (≈RW 905) |
| 964-D | 964 | `lw_fw_3v2_hold_width` | Attack | Mix | Int | F | 8 | Rejected (≈RW 876) |
| 970-D1 | 970 | `lw_def_sys_51_vs_advance` | Defence | 5-1 | Adv | F | 4 | **FINALIST** |
| 970-D2 | 970 | `lw_def_trans_far_skip_with_map` | Defence | Mix | Adv | T | 4 | Alternate |
| 970-D3 | 970 | `lw_def_numerical_5v6` | Defence | 6-0 | Exp* | F | 4 | Alternate |
| 970-A1 | 970 | `lw_late_trail_create` | Attack | 6-0 | Exp | F | 5 | Rejected (~RW 922) |
| 970-A2 | 970 | `lw_7v6_or_empty_opp` | Attack | Mix | Exp | F | 8 | Rejected |
| 970-A3 | 970 | `lw_short_clock` | Attack | 6-0 | Exp | F | 8 | Rejected |
| 974-A | 974 | `lw_def_handover_timing` | Defence | 6-0 | Adv | T | 4 | **FINALIST** |
| 974-B | 974 | `lw_def_sys_33_switch` | Defence | 3-3 | Adv | F | 3 | Alternate |
| 974-C | 974 | `lw_def_backdoor_deny` | Defence | 6-0 | Adv | T | 5 | Rejected (risk) |
| 974-D | 974 | `lw_def_wing_entry` | Defence | 6-0 | Beg | F | 3 | Alternate |

\*970-D3 Expert only if Phase B writes a concrete multi-threat picture; otherwise Advanced.

---

## Finalist cards

### 963 → `lw_sys_5plus1_trap` (risk 3)

| Field | Value |
|---|---|
| Old family | `lw_sys_15_outlet_width` |
| New teaching | Refuse baited left-wide action into 5+1 advanced pair |
| A/D · Sys · Num | Attack · 5+1 · 6v6 |
| Diff · Perc · Nativity | Advanced · false · CONTEXTUALLY_LW_NATIVE |
| Closest LW / RW | 942 / none direct |
| Duplicate | UNIQUE |

**Geometry:** LB has ball left channel; advanced 5+1 pair already high between LB–LW; LW wide. A = refuse baited wide finish / recycle. B = attack wide only if advanced pair has jumped off the left channel.

**Why it earns Gold:** System is causal (remove advanced pair → fork dies). Inhibitory wing decision. Unused approved matrix family. No RW twin. Fixes decorative 1:5.

---

### 964 → `lw_entry_when_space_opens` (risk 4)

| Field | Value |
|---|---|
| Old family | `lw_sw_advantage_gone` |
| New teaching | Enter only after WD overcommit empties a lane LB can still feed |
| A/D · Sys · Num | Attack · 6-0 · 6v6 |
| Diff · Perc · Nativity | Advanced · true · CONTEXTUALLY_LW_NATIVE |
| Closest LW / RW | 967 / 890·893 |
| Duplicate | RELATED_BUT_DISTINCT |

**Geometry:** WD overcommitted inside; corner path empty; LB free arm. A = timed entry. B = stay wide if LB doubled / no delivery.

**Why it earns Gold:** Positive pair to locked 967, not another “advantage gone” stop (RW 877). Two-cue A/B. Related RW entries use different co-cues — Phase B must keep LB deliverability mandatory.

---

### 970 → `lw_def_sys_51_vs_advance` (risk 4)

| Field | Value |
|---|---|
| Old family | `lw_empty_own_safe_return` |
| New teaching | In 5:1, do not 6:0-chase the channel the advanced already owns — hold wing |
| A/D · Sys · Num | Defence · 5-1 · 6v6 |
| Diff · Perc · Nativity | Advanced · false · CONTEXTUALLY_LW_NATIVE |
| Closest LW / RW | 961·942 / 940 (different) |
| Duplicate | UNIQUE |

**Geometry:** Opp RB left channel; advanced already on that channel; opp RW still a pass threat. A = hold wing. B = standard help only if advanced is entirely out of your side.

**Why it earns Gold:** Dead empty-own concept replaced with defence (improves 27/7 skew). System-causal. No RW twin. Expert drama removed.

---

### 974 → `lw_def_handover_timing` (risk 4)

| Field | Value |
|---|---|
| Old family | `lw_def_lb_wing_coop` |
| New teaching | Release wing runner only after half contact + ownership call |
| A/D · Sys · Num | Defence · 6-0 · 6v6 |
| Diff · Perc · Nativity | Advanced · true · CONTEXTUALLY_LW_NATIVE |
| Closest LW / RW | 962·973 / 880·928 |
| Duplicate | RELATED_BUT_DISTINCT |

**Geometry:** You on opp RW; half approaching without contact/call. A = hold runner. B = release only after contact + call.

**Why it earns Gold:** Not 962’s “close pass because half stuck.” Isolates release timing (vs RW 880 cocktail). Live call justifies perception. Real two-defender ownership change.

---

## Duplicate audit (finalists)

| Slot | Closest LW | Closest RW | Verdict | Critical distinction |
|---|---|---|---|---|
| 963 | 942 | — | UNIQUE | Refuse 5+1 trap vs ask-now under 5:1 |
| 964 | 967 | 890/893 | RELATED_BUT_DISTINCT | Entry + LB deliverability; opposite of 967 |
| 970 | 961/942 | 940 | UNIQUE | 5:1 wing stay because advanced owns channel |
| 974 | 962/973 | 880/928 | RELATED_BUT_DISTINCT | Release trigger vs close-pass / help cocktail |

No SEMANTIC_DUPLICATE finalists.

---

## Mirror audit

All four finalists flip identically LW↔RW (universal geometry). Classification: **UNIVERSAL_ESSENTIAL** for curriculum gaps, with contextual left-side framing.

| Slot | Already in RW Gold? | Survive? |
|---|---|---|
| 963 | No | Yes |
| 964 | No identical twin (related 890/893) | Yes |
| 970 | No | Yes |
| 974 | No identical twin (related 880/928) | Yes |

---

## System relevance

| Slot | System | Remove-label test |
|---|---|---|
| 963 | 5+1 | **PASS** — without advanced pair, refuse-trap fork disappears |
| 964 | 6-0 | N/A (not a system teaching scenario) |
| 970 | 5-1 | **PASS** — without advanced, “don’t double-cover his job” disappears |
| 974 | 6-0 | N/A (set-defence handover) |

Rejected system concepts: 963-C (`lw_sys_42_corridor` ≈ RW 937).

---

## Projected distribution (941–974 after replacements)

Natural metadata from finalists (no post-hoc tweaking):

| Metric | Before | After |
|---|---|---|
| Attack / Defence | 27 / 7 | **26 / 8** |
| B / I / A / E | 6 / 15 / 9 / 4 | **5 / 14 / 12 / 3** |
| Perception T / F | 23 / 11 (68%) | **24 / 10 (71%)** |

Attack skew improves; Advanced rises; unjustified Expert (old 970) drops. Perception % up slightly because 964 and 974 honestly need live cues — quality first.

---

## Cross-finalist diversity

Themes: system attack refuse-trap · timed entry · system defence 5:1 · handover release.

Not four spacing / four risk / four transition / four defender-read clones. **PASS.**

---

## Remaining risks (Phase B watchlist)

1. **964** — keep LB deliverability as a mandatory co-cue so it does not collapse into RW 890/893.
2. **974** — isolate release timing; do not recreate RW 880 protect-pass + controlled-help cocktail; stay distinct from 962.
3. **970** — picture must state advanced location so system dependence remains causal.
4. Perception share still high — later batches should prefer `perception=false` where honest.

---

## Phase A verdict

# FOUR STRONG REPLACEMENTS FOUND

All four finalists: risk ≤ 4 · A/B clear · no semantic duplicate · geometry reconstructable · difficulty and perception justified · real curriculum value.

**STOP.** Do not write scenarios. Do not apply. Do not start Batch C.
