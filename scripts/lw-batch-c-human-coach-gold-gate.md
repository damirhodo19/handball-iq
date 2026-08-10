# LW Batch C — Human Coach Gold Gate (First Pass)

**Verdict: LW BATCH C GOLD BLOCKED**

Mode: read-only. No scenario edits. No 982. No Batch D. 941–974 untouched.

---

## Blocking failures only

| ID | Verdict | Reason |
|---|---|---|
| **975** | REMOVE / MERGE | Same coach explanation as locked 961/973/974: do not leave the wing until the half has cover. Near-drive + “call first” does not create a new decision. |
| **977** | TACTICAL REWRITE | 3:3 remove-label **FAIL** (same switch agreement works in 6:0). B needs a different team rule (= different scenario). Situation states the rule then the matching picture → spoils A. Advanced not earned. |

---

## Full first-pass table

| ID | Geo | A/B | Spoil | Diff now→rec | Perc | Sys/Num | Dup | Risk | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 975 | OK | CLEAR | no | Beg→Beg | F OK | n/a | **SEMANTIC DUP** | 7 | **REMOVE / MERGE** |
| 976 | OK | CLEAR | no | Beg→Beg | F→**should T** | n/a | RELATED | 3 | POLISH |
| 977 | GAP | **AMBIGUOUS** | **yes** | Adv→Beg | F OK | **sys FAIL** | RELATED | 8 | **TACTICAL REWRITE** |
| 978 | OK | CLEAR | soft | Adv→Int | T borderline | OK | RELATED 972 | 4 | POLISH |
| 979 | GAP | CLEAR | soft | Exp→**Adv** | F OK | 5v6 borderline | RELATED | 5 | POLISH |
| 980 | OK | CLEAR | no | Adv→Adv | T OK | **sys PASS** | UNIQUE | 3 | KEEP |
| 981 | OK | CLEAR | no | Int→Int | F borderline | sys PASS vs 968 | RELATED | 2 | KEEP |

---

## Failed IDs — detail

### 975 — REMOVE / MERGE
- Closest: 961 / 973 / 974 / RW 880
- Shared decision: leave wing only after half cover
- Distinction attempted: “communicate first” on near drive — not enough
- Coach risk 7

### 977 — TACTICAL REWRITE
- System remove-label: FAIL
- A/B: B = opposite team rule → different scenario
- Spoil: rule text + matching geometry
- Coach risk 8

---

## STOP

No second-pass polish.  
No metadata changes.  
No new IDs.  
No Batch D.  
No commit / tag / push / deploy.

Repair or replace **975** and **977** before any Batch C Gold attempt.
