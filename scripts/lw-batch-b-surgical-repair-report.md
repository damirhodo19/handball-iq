# LW Batch B Surgical Repair — Phase B

**Status: LW BATCH B SURGICAL REPAIR READY FOR HUMAN REVIEW**

Only modified: 963 · 964 · 970 · 974  
No 975 · No Batch C · No commit/tag/push/deploy

---

## Repair table

| ID | old family | new family | old teaching | new teaching | diff | perc | A/B | system | closest LW | closest RW | dup | risk | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| scn_bank_963 | `lw_sys_15_outlet_width` | `lw_sys_5plus1_trap` | Keep outlet width against deep 1:5 pressure | Against 5+1 the advanced defender on your side changes the wide finish. | Advanced | false | CLEAR | 5+1 | scn_bank_942 | no direct RW 5+1 twin | UNIQUE | 3 | READY_FOR_HUMAN_REVIEW |
| scn_bank_964 | `lw_sw_advantage_gone` | `lw_entry_when_space_opens` | Stop forcing second wave when numbers are back | Enter only when both are true: the wing defender’s overcommit empties a real path behind him, and the left back still has a free arm to feed that cut. | Advanced | true | CLEAR | 6-0 | scn_bank_967 | scn_bank_890 / 893 | RELATED_BUT_DISTINCT | 4 | READY_FOR_HUMAN_REVIEW |
| scn_bank_970 | `lw_empty_own_safe_return` | `lw_def_sys_51_vs_advance` | Empty own goal dirty catch → safe return | In 5:1 the advanced defender owns the left channel when he is already high there. | Advanced | false | CLEAR | 5-1 | scn_bank_961 / 942 | scn_bank_940 (1:5 defence — different system) | UNIQUE | 3 | READY_FOR_HUMAN_REVIEW |
| scn_bank_974 | `lw_def_lb_wing_coop` | `lw_def_handover_timing` | After RB binds you then looks wing, keep pass + call half | You start as owner of their right wing. | Advanced | true | CLEAR | 6-0 | scn_bank_962 / 973 | scn_bank_880 / 928 | RELATED_BUT_DISTINCT | 4 | READY_FOR_HUMAN_REVIEW |

---

## Finalist detail cards

### scn_bank_963 — `lw_sys_5plus1_trap`

**GEOMETRY**
```
{
  "ball": "LB left side ~9–10m",
  "LW": "wide left corner / sideline",
  "LB": "has ball, looking to play LW wide",
  "advanced": "high between LW and LB on left side",
  "wingDefender": "covering wide finish angle on sideline",
  "pivot": "n/a",
  "currentOwnership": "attack left side",
  "availableLane": "recycle / keep left structure",
  "blockedLane": "baited wide finish into advanced + WD",
  "trigger": "LB looks to play LW for wide finish while advanced still high on left",
  "aToBChange": "advanced leaves left side toward middle/pivot"
}
```

**WHY A NOW:** Wide finish feeds the 5+1 advanced and the wing defender together.

**WHEN B:** Advanced has left LW side toward middle or pivot.

**WHY B IS PLAUSIBLE:** Corner looks empty; good LW wants to punish a high defence.

**SYSTEM / OWNERSHIP LOGIC:** Remove advanced from left side → refuse-finish fork disappears; normal wing finish may become live.

**DUPLICATE DEFENCE:** UNIQUE vs 942 (ask-now under 5:1). No RW 5+1 attack twin.

**COACH RISK:** 3

#### Complete HR

**Title:** Lijevo krilo — odbij namamljeni široki završetak protiv 5+1

**Situation:** Neriješeno je 12:12 u 23. minuti protiv 5+1. Njihov istureni branič već je visoko između tebe i lijevog vanjskog na lijevoj strani. Njihov krilni branič također pokriva kut širokog završetka uz aut. Lijevi vanjski ima loptu i gleda da te igra za široki završetak. Iz kuta izgleda dovoljno prazno za napad.

**Question:** Lijevi vanjski te gleda za široku loptu dok im je istureni još visoko na tvojoj strani — što prvo?

**A:** Odbij široki završetak sada — vrati loptu s lijevim vanjskim i drži lijevu strukturu dok je istureni još na tvojoj strani

**B:** Uzmi široki završetak samo ako je istureni već napustio tvoju stranu prema sredini ili pivotu

**C:** Forsiraj široki završetak sada jer kut izgleda prazan

**D:** Siječi unutra u isturenog braniča da otvoriš prostor lijevom vanjskom

**Correct feedback:** Točno — taj široki završetak hrani isturenog u 5+1 i krilnog braniča zajedno.

**Explanation:** Protiv 5+1 istureni na tvojoj strani mijenja široki završetak. Ako je još visoko između tebe i lijevog vanjskog, a krilni branič također pokriva kut završetka, odbij tu akciju i vrati loptu. Široko napadaj tek kad istureni napusti tvoju stranu.

**whyCorrectOverSecondBest:** A odbija široki završetak dok je istureni još visoko na tvojoj strani. B postaje točan tek kad je taj istureni napustio tvoju stranu prema sredini ili pivotu.

---

### scn_bank_964 — `lw_entry_when_space_opens`

**GEOMETRY**
```
{
  "ball": "LB driving left side",
  "LW": "corner, ready to enter",
  "WD": "left corner, hips/chest turned inside toward LB drive",
  "LB": "free arm, body open to feed cut",
  "half": "n/a",
  "pivot": "n/a",
  "availableLane": "path behind WD toward six",
  "blockedLane": "n/a for A; entry undeliverable if LB doubled",
  "trigger": "WD overcommit inside + LB free arm",
  "aToBChange": "LB under double / no free arm"
}
```

**WHY A NOW:** Emptied path behind WD and LB can still deliver.

**WHEN B:** LB doubled with no free arm.

**WHY B IS PLAUSIBLE:** Intelligent LW checks delivery before committing the cut.

**SYSTEM / OWNERSHIP LOGIC:** N/A — 6:0 perception entry.

**DUPLICATE DEFENCE:** RELATED_BUT_DISTINCT vs 967 (opposite), RW 890 (second help), RW 893 (pivot return).

**COACH RISK:** 4

#### Complete HR

**Title:** Lijevo krilo — uđi samo kad se prostor otvori i lijevi vanjski te još može nahraniti

**Situation:** Neriješeno je 14:14 u 27. minuti protiv 6:0. Lijevi vanjski s loptom prodire na tvoju stranu. Tvoj krilni branič napušta kut i ide unutra prema tom prodoru — bokovi i prsa mu se okreću od tebe. Iza njega se otvara put prema šest za tvoj ulazak. Lijevi vanjski još ima slobodnu ruku i tijelo dovoljno otvoreno da doda u taj ulazak.

**Question:** On napušta kut da pomogne unutra a lijevi vanjski još ima slobodnu ruku — što radiš?

**A:** Kreni u ulazak iza njega sada — dok te lijevi vanjski još može nahraniti u taj ulazak

**B:** Ostani široko ako je lijevi vanjski već pod dvojicom i nema slobodnu ruku za dodavanje u ulazak

**C:** Ostani široko iz navike iako je on napustio kut a lijevi vanjski te još može nahraniti

**D:** Uđi rano prije nego napusti kut, dok lijevi vanjski još treba tvoju širinu

**Correct feedback:** Točno — ispražnjen put plus dodavanje koje lijevi vanjski još može izvesti čine ulazak živim.

**Explanation:** Uđi samo kad vrijede obje stvari: krilni branič odlaskom unutra isprazni pravi put iza sebe, i lijevi vanjski još ima slobodnu ruku za dodavanje u taj ulazak. Ako je lijevi vanjski pod dvojicom bez slobodne ruke, ostani široko. Ne ulazi rano dok još treba tvoju širinu.

**whyCorrectOverSecondBest:** A ulazi jer je put ispražnjen i lijevi vanjski još može dodati. B postaje točan kad je lijevi vanjski pod dvojicom i nema slobodnu ruku za taj ulazak.

---

### scn_bank_970 — `lw_def_sys_51_vs_advance`

**GEOMETRY**
```
{
  "ball": "Opp RB left channel ~10m",
  "LW": "defending left wing",
  "advanced": "already high on same left drive lane",
  "oppRW": "still wide, pass-ready (LW man)",
  "half": "behind/coordinating with advanced",
  "availableLane": "wing pass if LW chases advanced job",
  "blockedLane": "drive lane already owned by advanced",
  "trigger": "dangerous-looking drive while advanced already high on that lane",
  "aToBChange": "advanced leaves LW side completely"
}
```

**WHY A NOW:** Advanced already owns the drive lane; LW job remains the wing.

**WHEN B:** Advanced has left LW side completely.

**WHY B IS PLAUSIBLE:** Drive looks dangerous; 6:0 habit says help inside.

**SYSTEM / OWNERSHIP LOGIC:** Remove advanced ownership → stay-vs-help fork changes to standard wing help problem.

**DUPLICATE DEFENCE:** UNIQUE vs 961/942/940.

**COACH RISK:** 3

#### Complete HR

**Title:** Lijevo krilo — obrana: u 5:1 ne juri liniju prodora koju istureni već drži

**Situation:** Vodite 16:15 u 31. minuti u vašoj 5:1. Braniš lijevo krilo. Njihov desni vanjski ima loptu u lijevom prostoru na oko deset metara. Vaš istureni branič već je visoko na tom istom lijevom prostoru i drži liniju prodora. Njihovo desno krilo — tvoj čovjek — još je široko uz aut spremno za dodavanje. Prodor izgleda dovoljno opasno da bi te 6:0 navika vukla unutra.

**Question:** Vaš istureni već je visoko na lijevoj liniji prodora a njihovo krilo je još široko — što je tvoj posao?

**A:** Ostani na njihovom desnom krilu i zatvori to dodavanje — ne juri u prostor koji istureni već drži

**B:** Pomagni unutra na tom prostoru samo ako je istureni već potpuno napustio tvoju stranu

**C:** Napusti njihovo krilo i skoči na prodor desnog vanjskog jer izgleda opasno

**D:** Zanemari i krilo i prostor i padni duboko pod šest

**Correct feedback:** Točno — u 5:1 taj je prostor njegov posao; tvoj je i dalje krilo.

**Explanation:** U 5:1 istureni drži lijevi prostor kad je već visoko tamo. Tvoj prvi posao ostaje njihovo desno krilo. Ne juri taj prostor iz 6:0 navike pomaganja. Unutra pomaži samo ako je istureni potpuno napustio tvoju stranu.

**whyCorrectOverSecondBest:** A drži krilo jer istureni već drži lijevi prostor. B postaje točan samo kad je istureni potpuno napustio tvoju stranu.

---

### scn_bank_974 — `lw_def_handover_timing`

**GEOMETRY**
```
{
  "ball": "Opp RB still has ball",
  "LW": "owns opp RW",
  "oppRW": "starts inside run toward half zone",
  "half": "close enough, no contact, no call",
  "availableLane": "if LW releases early, runner free",
  "blockedLane": "n/a",
  "trigger": "runner enters half zone before contact+call",
  "aToBChange": "half contact + ownership call",
  "frames": [
    "LW owns",
    "runner to half zone",
    "half capable without ownership",
    "contact+call"
  ]
}
```

**WHY A NOW:** Zone entry is not handover; contact and call missing.

**WHEN B:** Half has body contact and has called ownership.

**WHY B IS PLAUSIBLE:** Runner entered half area; temptation to jump the ball.

**SYSTEM / OWNERSHIP LOGIC:** Ownership transfer timing — not pass-lane close (962), not controlled-help cocktail (880).

**DUPLICATE DEFENCE:** RELATED_BUT_DISTINCT vs 962/973/880/928.

**COACH RISK:** 4

#### Complete HR

**Title:** Lijevo krilo — obrana: pusti trkača tek nakon pravog preuzimanja

**Situation:** Neriješeno je 17:17 u 34. minuti u vašoj 6:0. Braniš lijevo krilo i čuvaš njihovo desno krilo. To krilo kreće unutra prema zoni tvog polubranitelja. Polubranitelj je dovoljno blizu da ga preuzme, ali još nije napravio kontakt i nije javio da ga drži. Njihov desni vanjski još ima loptu. Mamac je rano napustiti trkača i skočiti na loptu.

**Question:** Njihovo krilo trči prema polubranitelju, a polubranitelj nema kontakt i nije javio — što radiš?

**A:** Ostani s trkačem — pusti ga tek kad polubranitelj ima kontakt i javi da ga drži

**B:** Pusti odmah samo ako polubranitelj već ima kontakt tijelom i javio je da ga drži

**C:** Napusti trkača sada jer je ušao u prostor polubranitelja i skoči na desnog vanjskog

**D:** Nikad ne puštaj trkača čak ni nakon jasnog kontakta i jasne dojave preuzimanja

**Correct feedback:** Točno — ulazak u zonu polubranitelja još nije preuzimanje.

**Explanation:** Ti počinješ kao vlasnik njihovog desnog krila. Kad trči u zonu polubranitelja, čekaj pravo preuzimanje: kontakt plus dojava. Ne puštaj samo zato što je ušao u tu zonu. Pusti odmah samo kad su i kontakt i dojava tu.

**whyCorrectOverSecondBest:** A drži trkača jer kontakta i dojave još nema. B postaje točan tek kad polubranitelj već ima kontakt i javio je preuzimanje.

---

## Batch B after repair

- Count: 12
- Attack / Defence: 8 / 4
- Difficulty: {"Advanced":6,"Intermediate":5,"Expert":1}
- Perception T/F: 7 / 5

## Gold candidate 941–974 projected

- Attack / Defence: 26 / 8
- Difficulty: {"Beginner":5,"Intermediate":14,"Advanced":12,"Expert":3}
- Perception T/F: 24 / 10 (71%)

## Validators

All safe validators PASS. Mutating scenario-quality audit NOT RUN.

## Lock verification

| Bank | Count | Hash |
|---|---|---|
| LB | 62 | OK |
| RB | 63 | OK |
| CB | 70 | OK |
| RW | 65 | OK |

Protected 941–962 and untouched Batch B (965–969, 971–973): **byte identical**  
Only changed: 963, 964, 970, 974  
No scenario 975 · LW temporary total 74

## Remaining risks

- 964 RELATED to RW 890/893 — human must confirm LB free-arm co-cue is decisive
- 974 RELATED to RW 880 / LW 962 — human must confirm ownership-transfer timing stays isolated
- 963 first LW 5+1 attack scenario — confirm Advanced difficulty feels earned
- Do not Gold-approve Batch B until human coach review of the four HR texts

## Final status

# LW BATCH B SURGICAL REPAIR READY FOR HUMAN REVIEW
