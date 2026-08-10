# Left Wing Gold Rebuild Plan

Phase 1 complete = architecture only.  
**Do not execute Phase 2 until explicitly instructed.**

---

## Preconditions (every phase)

1. Confirm LB=62, RB=63, CB=70, RW=65 unchanged (count + content hash).  
2. Confirm `scenarios.json` hash unchanged unless the active phase is an approved LW write.  
3. Never run mutating quality audits against locked banks.  
4. Never mirror RW text with Left/Right substitution.

---

## Phase 1 — Architecture (DONE when these files exist)

- [x] `scripts/lw-gold-architecture.md`
- [x] `scripts/lw-gold-architecture.json`
- [x] `scripts/lw-gold-family-matrix.json`
- [x] `scripts/lw-gold-coverage-target.json`
- [x] `scripts/lw-gold-rebuild-plan.md`
- [x] Bank untouched

**Target locked by architecture:** 60 scenarios · 44 attack · 16 defence · B10/I22/A20/E8 · perception 55–65% · handedness default none.

---

## Phase 2 — Pilot 10 (future)

Write **only** the pilot-10 families (not the full 60):

1. `lw_width_hold_true_width`  
2. `lw_lb_ask_when_hips_open`  
3. `lw_entry_when_not`  
4. `lw_takeoff_after_lb_pull`  
5. `lw_gk_near_post_commit`  
6. `lw_fw_3v2_hold_width`  
7. `lw_empty_own_safe_return`  
8. `lw_def_protect_opp_wing`  
9. `lw_def_handover_timing`  
10. `lw_backdoor_ball_watch`  

Rules for pilot:

- Native HR/EN/DE  
- Real left geometry + LB as primary partner  
- Perception honest  
- Answer ladder distinct  
- No folklore GK  
- Human coach review before expansion  

Optional: keep pilot in a side file first; only merge into `scenarios.json` when approved.

---

## Phase 3 — Attack core expansion

Generate remaining families in this order:

1. Width / stay-wide / entry / take-off / WD reads  
2. LB + pivot cooperation  
3. Remaining GK perception set (depth, step-out conditional, far commit, late patience, extreme angle)  
4. Transition first/second wave + lane  
5. Finish-before-recovery race  

Stop and merge/dedupe if any two families fail the uniqueness rule.

---

## Phase 4 — Sparse systems layer

Add exactly the planned system-specific attack families:

`5:1`, `3:2:1`, `3:3`, `4:2`, `1:5`, `5+1`, `4+2`, open/man  

Reject any system scenario that would play identically under 6:0 with renamed labels.

---

## Phase 5 — Defence curriculum

Build all 16 defence families.  
Require teammate map whenever A vs B depends on who covers what.  
State team rules in-situation when switch/handover answers need them.

---

## Phase 6 — Numerical / game state

`6v5`×2 · `5v6` · `7v6/empty-opp`×1 · empty own · passive · late lead · late trail · short clock  

Expert only when risk/rule complexity is real.

---

## Phase 7 — Replace current 40

Recommended approach (when authorized):

1. Snapshot current LW IDs for audit trail.  
2. Remove all current primary LW scenarios from the bank **or** replace in place with new IDs — choose the approach that does not disturb locked banks’ ordering/IDs.  
3. Insert 60 new LW Gold scenarios.  
4. Do **not** keep clone IDs for nostalgia.

Disposition reminder:

| KEEP text | POLISH idea | REWRITE ideas | REMOVE |
|---:|---:|---:|---:|
| 0 | 3 (width) | 9 families | 3 tied + 25 clones |

---

## Phase 8 — Validate

Run LW-only validators / audits:

- count = 60 (±2 if justified merge)  
- locked bank hashes unchanged  
- family uniqueness + semantic clone scan  
- perception honesty  
- HR blacklist + DE natural terms  
- coverage vs `lw-gold-coverage-target.json`  
- coach-risk top 15  

Fix surgically. Do not regenerate the whole bank for language nits.

---

## Phase 9 — Human lock

- Export human review pack  
- Accept / polish / rewrite listed items only  
- Tag LW gold approved  
- **Still no deploy** unless separately ordered  

---

## Generation hygiene checklist (every scenario)

- [ ] Left-native geometry mentally reconstructible  
- [ ] Teaching objective unique vs all other LW familyKeys  
- [ ] Cue → decision causal  
- [ ] `good` not secretly wrong  
- [ ] Difficulty matches cognitive load  
- [ ] `handedness=none` unless fork is hand-dependent  
- [ ] `defensiveSystem` set when system matters  
- [ ] No club decoration  
- [ ] HR/EN/DE coaching-native  

---

## Explicit non-goals

- Do not polish the existing 40 in place as the Gold bank  
- Do not mirror RW  
- Do not touch LB/RB/CB/RW  
- Do not deploy from this plan alone  

---

## STOP (Phase 1)

Architecture and plan only. Await explicit instruction before Phase 2.
