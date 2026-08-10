# FINAL LW Pilot Native Defence — Phase A Plan

## Objective

Replace **only** `scn_bank_949` and `scn_bank_950` with genuinely Left Wing native defensive teaching scenarios. Locked pilot `941–948` and LB/RB/CB/RW Gold banks stay untouched.

## Current failure

| ID | familyKey | Failure |
|---|---|---|
| 949 | `lw_def_deny_backdoor_left` | Universal wing deny-entry. Side flip keeps the teaching. |
| 950 | `lw_def_recovery_to_wing_after_help` | Universal recover-after-help. Side flip keeps the teaching. |

## Search direction

Strongest native path: **offensive LW action → turnover → LW-specific defensive problem**, using pilot continuity with:

- `945` second-pivot release / width
- `948` 6v5 entry-vs-width

RW Gold defence (`880`, `927–934`, `938`, `940`) was checked for semantic duplicates. No RW scenario teaches defence starting from an offensive second-pivot body position, and none teach empty-own defence after that entry.

## Candidate verdicts

| ID | familyKey | Class | Coach risk | Mirror |
|---|---|---|---|---|
| C1 | `lw_def_recover_wing_from_second_pivot_turnover` | **STRONG** | 3 | PASS (sequence-native) |
| C2 | `lw_def_empty_own_fill_from_second_pivot_turnover` | **STRONG** | 4 | PASS (sequence-native) |
| C3 | `lw_def_cover_seam_for_late_lb_after_left_entry` | QUESTIONABLE | 5 | FAIL strict flip |
| C4 | current back-door deny | REJECT | 2 | FAIL |
| C5 | current recover-after-help | REJECT | 2 | FAIL |
| C6 | set protect opp wing | REJECT | 3 | FAIL / RW 880 family |

### C1 — STRONG (→ 949)

After the ball is lost while LW is still second pivot on the left six, first sprint **out** to the left wing lane to deny the same-side outlet. Closest RW: `930` / `927` (normal transition starts, not second-pivot).

### C2 — STRONG (→ 950)

Same preceding entry, but **own GK is out**. Nearest job from the second-pivot spot is fill the empty-own lane before automatic wing recovery. No RW Gold empty-own defence twin. Closest conceptual RW: `931` (first-wave body between ball and goal) — different game state and start.

## Phase B gate

**Two STRONG candidates found → Phase B allowed.**

Assignment:

1. `scn_bank_949` ← C1
2. `scn_bank_950` ← C2
