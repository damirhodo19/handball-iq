# LW Batch B — Human Coach Audit (4)

**Mode:** READ ONLY · adversarial Gold gate  
**Audited:** `scn_bank_963`, `964`, `970`, `974`  
**Content edited:** NO  
**Gate:** **BATCH B NEEDS SURGICAL REPAIR**

| KEEP | POLISH | TACTICAL REWRITE | REMOVE / MERGE |
|---|---|---|---|
| 0 | 0 | 3 | 1 |

## Compact table

| ID | main teaching | geometry | A/B | HR | system | closest LW | closest RW | duplicate | nativity | difficulty | perception | risk | recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 963 | Stay wide as outlet under LB press | WITH GAP | SOFT | FLAGS | DECORATIVE | 942 / 941 / 967 | 940 (diff phase) | RELATED | UNIVERSAL | Beginner OK | false OK | 6 | TACTICAL REWRITE |
| 964 | Stop forcing when SW advantage gone | RECONSTRUCTABLE | SOFT | SPOILED | n/a | 947 | **877** | **SEMANTIC DUP** | MIRRORED | Intermediate | false questionable | 7 | TACTICAL REWRITE |
| 970 | Empty own + dirty catch → safe return | RECONSTRUCTABLE | SOFT | FLAGS | n/a | 950 (diff phase) | **879** | **SEMANTIC DUP** | MIRRORED | Expert → Adv | false OK | 8 | REMOVE / MERGE |
| 974 | Bind-then-look: keep wing pass + call half | WITH GAP | CLEAR | FLAGS | 6-0 OK | **962** | 932 | **SEMANTIC DUP** | CONTEXTUAL | Advanced → Int | true OK | 7 | TACTICAL REWRITE |

## Lock verification (post-audit)

| Bank | count | hash |
|---|---|---|
| LB | 62 | OK |
| RB | 63 | OK |
| CB | 70 | OK |
| RW | 65 | OK |

941–962 byte identical: **YES**  
963–974 unchanged (read-only): **YES**  
975 present: **NO**

---

## 963 — `lw_sys_15_outlet_width`

**Recommendation: TACTICAL REWRITE · coach risk 6**

Would a serious coach use this exact scenario? **No** — not as 1:5 system teaching.

### Full tactical reconstruction

- Advanced defender: front defender pressing LB at nine metres (presumed the “1”)
- Five remaining: **not placed** — only “next defender stepping up into left channel”
- LW: left sideline
- LB: nine metres under pressure, ball
- Who marks LW: **ambiguous**
- Passing lane: wide outlet if LW stays out; short pocket if LW steps in
- Why width is specifically a 1:5 problem: **not proven**

### Remove-label test

Same cue → same optimal action against 6:0, 5:1, and open press pictures.

**Verdict:** system label is decorative / weak.

Class: **VALID UNIVERSAL WIDTH PRINCIPLE WITH WEAK SYSTEM LABEL**

### Why A now / when B

- **A now:** LB still has reverse/wide time; stepping in removes the outlet.
- **B when:** LB already trapped with no reverse, needs short escape angle.
- B realistic: yes
- Situation spoils A: **yes** (“if you step inside… trap closes”)
- A/B: **SOFT**

### Duplicate comparison

| vs | teaching | distinction |
|---|---|---|
| RW 940 | Defence: don’t chase high wing decoy in 1:5 | Different phase/problem — not a duplicate |
| LW 942 | 5:1 stay wide and ask under pressure | Same width family; 942 adds ask |
| LW 941 / 967 | Hold width / don’t enter when LB needs you outside | Same abstract decision |

Duplicate: **RELATED BUT DISTINCT** (fails uniqueness vs LW width curriculum, not vs 940)

Nativity: **UNIVERSAL ESSENTIAL**

### HR language problems

| Quote | Issue | Natural alternative (not applied) |
|---|---|---|
| `širina za izlazak` | Translated “outlet width” | ostani vani da ima kuda |
| `džep pritiska` | Literal “pressure pocket” | unutra u pritisak |
| `ne još jedno tijelo u zamci` | Abstract AI coaching | nemoj mu još i ti ući u pritisak |

### Difficulty / perception

- Beginner: OK for a real system lesson  
- Perception false: OK for role discipline  

### Coach verdict

1:5 is not doing real work. Rebuild so the high-defender geometry **forces** a LW decision that fails under 6:0/5:1, or merge into width curriculum.

---

## 964 — `lw_sw_advantage_gone`

**Recommendation: TACTICAL REWRITE · coach risk 7**

Would a serious coach use this exact scenario? **No** as a standalone Gold item — it teaches RW 877 again; the question spoils the answer.

### Chronology

1. First wave ends (after own save; lightly sketched)  
2. Second wave: LW stayed wide for one more advantage  
3. Advantage was: late WD / free left run  
4. Recovered: WD inside 2m + second defender filled left lane  
5. LW sees: no free run to six; LB slowing  
6. Decision: force one more left action vs reset wide  
7. Risk if continue: recovered numbers / dead left lane  

### Teaching objectives (one sentence each)

- **RW 877:** When the transition finish is gone and defence is set, stay wide into set attack instead of forcing the cut.  
- **LW 945:** When already second pivot and the LB drive dies in a stacked left six, sprint back to width.  
- **LW 947:** When middle is closed but left WD is still >2m late, demand one more left second-wave action.  
- **LW 964:** When the second-wave left advantage is gone, stop forcing and reset wide into set attack.  

**964 ≈ 877** at sentence level.  
**964 = inverse of 947** at fork level — that is the only non-cosmetic survival claim.

Exact cue advantage is gone: WD ≤2m **and** left lane filled.

### Why A now / when B

- **A now:** numbers restored (WD inside 2m + lane filled).  
- **B when:** WD still >2m late (947 condition).  
- B realistic: yes — that is 947.  
- Situation/question spoils A: **yes** — “advantage is gone”.  
- A/B: **SOFT**

### Duplicate comparison

| | cue | decision | consequence |
|---|---|---|---|
| 877 | Recovered defence / advantage gone | Stay wide into set | Don’t force dead transition |
| 964 | WD ≤2m + lane filled | Stay wide into set | Don’t force dead transition |
| 947 | WD >2m late | One more left action | Exploit remaining advantage |

Duplicate: **SEMANTIC DUPLICATE** of RW 877  
Related curriculum pair with 947, not unique standalone teaching.

Nativity: **MIRRORED / ARTIFICIAL**

### HR language problems

| Quote | Issue | Natural alternative (not applied) |
|---|---|---|
| `Lijeva prednost drugog vala je nestala — što sada?` | Spoiled premise | Krilni branič je unutar dva metra i kanal je pun — što radiš? |
| `resetiraj široko` | Anglicism | vrati se u širinu / prijeđi u pozicijski |
| `mrtvog lijevog kanala` | Slightly abstract | zatvorenog lijevog prostora |

### Difficulty / perception

- Intermediate: OK  
- Perception **false is questionable** — WD distance / lane fill is a live cue  

### Coach verdict

Do not keep as “left second wave” decoration. Either rewrite into a non-877 mechanism, or absorb the inverse fork into 947’s curriculum and drop the standalone twin.

---

## 970 — `lw_empty_own_safe_return`

**Recommendation: REMOVE / MERGE · coach risk 8**

Would a serious coach use this exact scenario as separate LW Gold DNA? **No.**

### Reconstruction

- Own goal empty: GK out as seventh  
- LW receives from LB; catch needs settle  
- WD already closing take-off  
- LB free for short return  
- After loss: counter into empty net (thinner than 879, which also places opponent wing high)  

### Strip test

**970 rule:** empty own + catch needs settle + defender closing → safe return; finish only if already clean.  
**879 rule:** empty own + catch behind body needing extra step + defender recovering → safe return; finish only if already clean.

Remove LW/RW, left/right, names, score/minute → both reduce to:

> With an empty own goal, avoid a risky finish from a messy catch and recycle safely.

**Materially different mechanism:** none found.

Duplicate: **SEMANTIC DUPLICATE** of RW 879.

| vs | note |
|---|---|
| 948 | Different (6v5 stay-wide vs entry) |
| 950 | Different phase (defence fill empty-goal lane) |
| 912 / 914 | Same empty-own family already split clean vs messy in RW Gold |

### Expert test

Independent variables: own GK out, dirty catch, WD closing, LB free.  
No genuine layered interaction beyond the known risk rule.  
Dramatic empty goal ≠ Expert.

**Recommended difficulty:** Advanced (or Intermediate). Expert fails.

### Why A now / when B

- **A now:** dirty catch + closing WD + empty own → return.  
- **B when:** clean one-step catch + free take-off before WD arrives.  
- B attractive: yes.  
- Situation spoils A: **yes** (narrates dirty catch, closing defender, counter risk).  
- A/B: **SOFT**

### HR language problems

| Quote | Issue | Natural alternative (not applied) |
|---|---|---|
| `ulov još treba smirivanje` | Mechanical | lopta ti još nije mirna |
| `nesmirenom loptom` | Unnatural | loptom koja ti još nije mirna |

Nativity: **MIRRORED / ARTIFICIAL**  
Geometry: **RECONSTRUCTABLE**  
Perception false: acceptable as principle once spoiled.

### Coach verdict

Merge / do not keep as separate LW Gold. RW 879 already owns this teaching.

---

## 974 — `lw_def_lb_wing_coop`

**Recommendation: TACTICAL REWRITE · coach risk 7**

Would a serious coach use this exact scenario as distinct from 962? **No** — same decision for the same reason.

### Role reconstruction

| Role | State |
|---|---|
| Opp RB | Drives into LW, binds chest, then looks to wing |
| Opp RW | Wide, shows for short pass |
| LW defender | Being bound; must deny pass vs jump ball |
| Half | Has **not** taken wing runner — position during bind **underspecified** |
| Ball | With RB |
| Pass lane | RB → RW becoming live |
| Who owns RB | Ambiguous (bind is on LW; normally half’s man) |
| Who owns RW | Still LW until half takes |

### One-line rules

- **974:** When RB binds you then looks wing, keep body on the wing pass and call half because half has not taken the runner.  
- **962:** When half is already stuck inside and RB looks wing, close the RB→RW pass because half cannot recover.  
- **932:** When wing has the ball in a 2v2 and half has not called switch after the back cuts, stay with the wing on the ball.  
- **973:** When ball reverses and inside help is already present, stay on your open wing.

### Semantic comparison

974 and 962:

- Same decision: deny/close wing pass; do not jump the back  
- Same reason: half unavailable for the wing  
- Claimed difference: 974 starts one action earlier (bind-on-you)

**Adversarial verdict:** starting earlier is not a different decision → **SEMANTIC DUPLICATE** of 962.

vs 932: different (ball already with wing) — related but distinct.  
vs 973: different (reverse-ball stay-home).

Cooperation test: **partial** — “call the half” is asserted, but half’s live geometry during the bind is missing. FamilyKey says `lb_wing_coop` while content correctly uses opp RB/RW.

### Why A now / when B

- **A now:** bind-then-look; wing presenting; half has not taken runner.  
- **B when:** half has already taken the wing runner.  
- B realistic: yes  
- Mild spoil: “if you jump… pass is free”  
- A/B: **CLEAR**

### HR language problems

| Quote | Issue | Natural alternative (not applied) |
|---|---|---|
| `veži pa gledaj` | Slogan / translation artifact | veže te i gleda krilo |
| `Drži tijelo i prsa na dodavanju prema njihovom krilu` | Overexplained | Zatvori pas na krilo i zovi polua |
| `prava prijetnja` | Slightly abstract | tu ide lopta |

### Difficulty / perception

- Advanced overstated → Intermediate  
- Perception true: OK  

Geometry: **RECONSTRUCTABLE WITH GAP** (half during bind)

### Coach verdict

Do not keep as a second “close the wing pass” scenario. Either merge into 962 or rewrite into a true two-defender ownership change with a **different** LW action.

---

## Batch B gate

| KEEP | POLISH | TACTICAL REWRITE | REMOVE / MERGE |
|---|---|---|---|
| 0 | 0 | 963, 964, 974 | 970 |

**BATCH B NEEDS SURGICAL REPAIR**

Not automatic Gold. These four fail the adversarial coaching standard:

1. **963** — 1:5 decorative; universal width already taught  
2. **964** — RW 877 twin; spoiled question  
3. **970** — RW 879 twin; Expert unjustified → remove/merge  
4. **974** — LW 962 twin with earlier start  

STOP. No edits. No Batch C. No 975. No commit/tag/push/deploy.
