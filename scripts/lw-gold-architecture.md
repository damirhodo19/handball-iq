# Left Wing Gold Architecture (Phase 1)

**Status:** ARCHITECTURE ONLY — do not generate scenarios, do not mutate `scenarios.json`, do not deploy.

**Locked baseline:** LB 62 · RB 63 · CB 70 · RW 65 · commit `26f5999` / tag `rw-gold-approved-2026-08-09`

**Current LW:** 40 primaries · pre-audit verdict `CURRENT LW BANK NEEDS GOLD REBUILD`

---

## Verdict for curriculum size

**Recommended final LW Gold count: 60**

| Split | Count | Share |
|---|---:|---:|
| Attack | 44 | 73% |
| Defence | 16 | 27% |

**Why 60, not 65:** Coverage-driven. Forty-four attack families + sixteen defence families earn a place once each. Matching RW=65 would require padding. If a pilot merges two near-duplicates, prefer 58–59 over inventing stickers.

---

## Left Wing identity

LW Gold teaches **left-corner perception and decisions**:

- width on the left sideline
- take-off geometry from the left
- cooperation with **Left Back** and pivot
- wing-defender hips / feet / chest
- ask timing, stay wide, enter, **when NOT to enter**, back-door
- open vs closed take-off lane
- goalkeeper **feet, hands, depth, commitment, late movement** as cues
- first wave / second wave / running lane
- numerical, passive, late-game, empty-own-goal risk
- defensive wing job: protect wing, controlled help, handover, transition defence

**Not allowed**

- mechanical L/R swaps from Right Wing
- GK folklore (`moves X ⇒ always shoot Y`)
- Expert-from-clock
- unique-from-score/minute
- artificial handedness stickers

**Geometry note:** Near/far post, take-off direction, and LB relationship must be reconstructed from the **left**. Reusing RW quality rules is fine; reusing RW tactics with “left” pasted in is not.

---

## Handedness

| Rule | Detail |
|---|---|
| Default | `none` |
| Tag only when | Throwing hand changes the **first** tactical decision |
| Expected tagged | **0–4** of 60 |
| Separate | Position geometry vs throwing-hand execution |

Do not balance handedness. Remove current shade stickers from architecture (IDs `080/091/102/083/094/105` lineage).

---

## Perception

| Target | Value |
|---|---|
| Range | **55–65%** (~33–39 scenarios) |
| Rule | Observable cue must drive the correct answer |

True cues: defender hips/feet/chest, distance, recovery direction, inside-help timing, pass lane, LB body, pivot block, GK feet/hands/depth/step-out/commitment, recovering distance, handover call, transition numbers, empty-goal risk, passive signal.

Ordinary minute/score context alone is **not** perception.

---

## Difficulty

| Level | Target | Meaning |
|---|---:|---|
| Beginner | 10 | One strong cue, one primary decision |
| Intermediate | 22 | Two cues or simple conditional |
| Advanced | 20 | Multiple players / timing dependencies |
| Expert | 8 | Multi-cue + risk / rule / game state that rejects plausible actions |

Expert max soft cap: 10. Never inflate with drama adjectives.

---

## Defensive systems (sparse, not equal)

| System | Role | Target |
|---|---|---|
| 6:0 | CORE | 18–22 |
| transition | CORE | 8–10 |
| 5:1 | SPARSE | 2 |
| 3:3 | SPARSE | 2 |
| open/man | SPARSE | 2 |
| 3:2:1 | SPARSE | 1 |
| 4:2 | SPARSE | 1 |
| 1:5 | SPARSE | 1 |
| 5+1 | SPARSE | 1 |
| 4+2 | SPARSE | 1 |

Every system-specific scenario must teach something that would **change** if the defensive picture changed.

---

## Teaching-family totals

- **Attack families:** 44 (see `lw-gold-family-matrix.json`)
- **Defence families:** 16
- **True teaching families:** **60** (1:1 with scenarios)

### Attack clusters

Width / stay-wide / entry / back-door / take-off · LB coop · pivot · 1v1 · WD reads · GK perception (6) · first/second wave · numerical · empty/passive/late · sparse systems · recovering-defender race

### Defence clusters

Protect wing · controlled help · handover · do-not-abandon · LB/wing coop defence · deny entry · deny back-door · transition own-side + far-skip-with-map · half communication · system wing jobs · 5v6 defence · recover to wing · empty-own after turnover

---

## Answer quality

Every scenario: **optimal / good / risky / poor** as genuinely different decision quality.

- **good** may be conditional — condition must be stated or obvious from cues
- no unstated team rules (if needed, put the rule in the situation)
- no A≈B timing twins

---

## Language

HR / EN / DE all required at native coaching quality.

**HR blacklist (examples):** `Primate`, `Hvatate`, `završni sloj`, `krivotvorenje`, `čuvara`, `utičnicu`, `lob lane`, `pokojnog braniča`, club-name decoration, vi-form machine coaching.

Prefer natural terms: `odraz`, `bliža/dalja stativa`, `krilni branič`, `lijevi vanjski`, `vratar`, `ulaz iza leđa`, `prijelaz`.

DE: Handball terms (`Flügel`, `Kreisläufer`, `Absprung`, `Abwehrhilfe`), not EN calques.

---

## Clone prevention

Not unique if only score / minute / difficulty / club / word order / GK adjective / synonym / cosmetic handedness differs.

Must differ in at least one of: observable cue, decision, player relationship, defensive structure, timing, risk, numerical situation, transition state, stated team rule, GK behaviour that changes the fork.

**Watchlist:** stay-wide triplets · GK near/far/late · 6v5 finish vs pivot seal · late-lead vs short-clock vs empty-own · transition cover twins · back-door vs entry.

---

## Existing 40 — disposition (architecture stage, no edits)

| Disposition | Count | Notes |
|---|---:|---|
| KEEP (as production text) | **0** | None are Gold-ready |
| POLISH (teaching idea) | **3** | Simple Width family — one Beginner rewrite later; discard 2 clones |
| TACTICAL REWRITE (source ideas) | **9** families / 34 IDs | Rebuild as unique natives; discard clone surplus |
| REMOVE/MERGE | **3** | Tied-game Expert stickers |
| Clone surplus discarded in rebuild | **25** | Score/minute padding |

Preserve ideas, not IDs.

---

## Assumption flags (stronger handball solutions)

1. **Equal system counts** → REJECT → sparse system matrix  
2. **Match RW=65** → REJECT → 60 earned  
3. **Handedness balance for right-handed LWs** → REJECT → default none  
4. **Large opponent-empty-goal cluster** → SOFTEN → at most one  
5. **Preserve IDs** → REJECT → clean Phase-2 IDs  
6. **Mirror RW familyKeys** → REJECT → left-native with LB as primary partner  

---

## Validation strategy (Phase 2+)

- Never run mutating audits on LB/RB/CB/RW  
- Count/hash lock checks every write  
- Uniqueness + semantic clone scan  
- Perception honesty + HR/DE language gates  
- Answer-ladder distinctness  
- Coverage matrix against this target file  
- Coach-risk sample of 15  

Tolerance: final count 58–62 if pilot merges/splits; perception 55–65%; Expert ≤10; defence ≥14.

---

## Stop

Phase 1 ends here. No scenario generation. No bank mutation. No deploy.
