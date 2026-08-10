# LW Batch A — Surgical Tactical Repair Report

**Verdict: LW BATCH A SURGICAL REPAIR READY FOR HUMAN REVIEW**

Touched IDs only: `scn_bank_955`, `scn_bank_956`, `scn_bank_962`

- Batch A count: **12**
- Temporary LW count: **62** (40 legacy + 10 pilot + 12 Batch A)
- No Batch B · legacy LW kept · no commit/tag/push/deploy

## Repair cards

### scn_bank_955 (`lw_gk_far_side_commit`)

| Field | Value |
|---|---|
| Old teaching objective | Near finish when GK shades far early (spoiled answer; far→near folklore) |
| New teaching objective | Second cue in the air beats the first GK shade — finish where recovery leaves him late |
| New primary cue | Early far shade, then near foot plant + near arm drop during jump |
| New A | Hold one beat and finish far and low |
| New B | Early near finish only if he keeps going far without planting near foot back |
| Why A beats B | A uses second cue; B needs continued far commit without recovery |
| When B becomes correct | Full far commit continues — near foot never plants back |
| HR language | PASS |
| Geometry | PASS |
| Closest RW | 900 / 875 / 901 |
| Shared idea | In-flight GK commit reading |
| Different cue | Far→recover near vs near-slide (900) vs pre-jump near commit (875) |
| Different fork | Wait for recovery then far-low; not automatic opposite-side |
| Semantic duplication | UNIQUE |
| Perception | PASS |
| Difficulty | Intermediate |
| Coach risk | 4 |

### scn_bank_956 (`lw_gk_depth_read`)

| Field | Value |
|---|---|
| Old teaching objective | Deep GK + high hands → carry late (RW 897 twin) |
| New teaching objective | Adapt timing when GK leaves deep mid-jump with false step-out that freezes short |
| New primary cue | Deep at jump start → mid-jump 1m attack then freeze short |
| New A | Finish now hard mid-height into space left by short stop — do not wait as if still deep |
| New B | Soft lift only if he keeps driving into body without freezing |
| Why A beats B | A matches freeze after false step-out; B needs continuous drive |
| When B becomes correct | Continuous step-out into body — no freeze |
| HR language | PASS |
| Geometry | PASS |
| Closest RW | **898** (not 897) |
| Shared idea | GK leaves line during wing take-off |
| Different cue | Freeze after false step vs continuous attack (898) vs stay-deep (897) |
| Different fork | Hard-now on freeze is A; lift is conditional B (inverted vs 898) |
| Semantic duplication | UNIQUE vs 897 and defended vs 898 |
| Perception | PASS |
| Difficulty | Advanced |
| Coach risk | 4 |

### scn_bank_962 (`lw_def_inside_help_controlled`)

| Field | Value |
|---|---|
| Old teaching objective | Controlled help without abandoning wing / handover (RW 880 mirror) |
| New teaching objective | Half removed → close RB→RW pass on shoulder turn; do not chase drive |
| New primary cue | Half stuck inside + RB chest/shoulders turn to wide wing |
| New A | Step into RB→wing pass with body and arms |
| New B | Jump drive only if chest stays middle and wing does not ask for ball |
| Why A beats B | A closes live wing pass after half removed; B needs middle-facing drive + passive wing |
| When B becomes correct | RB chest stays middle; wing does not ask for ball |
| HR language | PASS |
| Geometry | PASS |
| Closest RW | 880 |
| Shared idea | Do not gift pass to opposing wing |
| Different cue | Half already removed + shoulder turn vs help-step + handover call |
| Different fork | Close pass now vs jump drive if pass not live — no help cocktail |
| Semantic duplication | UNIQUE vs 880 |
| Perception | PASS |
| Difficulty | Intermediate |
| Coach risk | 4 |

## Validators

| Check | Result |
|---|---|
| validate:left-back-gold-bank | PASS |
| validate:right-back-gold-bank | PASS |
| validate:centre-back-gold-bank | PASS |
| validate:right-wing-gold-bank | PASS |
| validate:unique-session | PASS |
| validate:no-position-fallback | PASS |
| validate:position-personalization | PASS |
| audit:scenario-quality | NOT RUN (mutating) |
| audit-lw-batch-a | PASS / blockers [] |

## Lock hashes

| Bank | Hash OK |
|---|---|
| LB | true (`057e027a…`) |
| RB | true (`502abe41…`) |
| CB | true (`8a0e250a…`) |
| RW | true (`28da60b5…`) |
| Pilot 941–950 | unchanged |
| Batch A 951–954, 957–961 | unchanged |

## Files changed

- `content/scenario-bank/scenarios.json`
- `scripts/scenario-bank/data/lw-parts/lw-families-a.json`
- `scripts/apply-lw-batch-a-surgical-repair.mjs`
- `scripts/audit-lw-batch-a.mjs`
- `scripts/lw-gold-batch-a-review.json`
- `scripts/lw-gold-batch-a-review.md`
- `scripts/lw-gold-batch-a-audit.json`
- `scripts/lw-gold-batch-a-audit.md`
- `scripts/lw-gold-batch-a-duplicate-audit.json`
- `scripts/lw-gold-batch-a-status.json`
- `scripts/lw-batch-a-surgical-repair-report.json`
- `scripts/lw-batch-a-surgical-repair-report.md`
- `scripts/.lw-batch-a-repair-lock-before.json`
