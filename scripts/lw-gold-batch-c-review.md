# LW Gold Batch C — Human Review (7)

**Verdict: LW BATCH C APPROVED FOR HUMAN REVIEW**

Temporary LW total: **81** (40 legacy + 34 Gold 941–974 + 7 Batch C)

| ID | familyKey | area | diff | A/D | sys | num | perc | risk | A/B | HR | geo | dup | nativity | rec |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| scn_bank_975 | `lw_def_comm_half` | communication | Beginner | Defence | 6-0 | 6v6 | false | 2 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE | KEEP |
| scn_bank_976 | `lw_def_wing_entry` | set_defence | Beginner | Defence | 6-0 | 6v6 | false | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE | KEEP |
| scn_bank_977 | `lw_def_sys_33_switch` | system_defence | Advanced | Defence | 3-3 | 6v6 | false | 3 | CLEAR | PASS | PASS | UNIQUE | CONTEXTUALLY_LW_NATIVE | KEEP |
| scn_bank_978 | `lw_def_trans_far_skip_with_map` | transition_defence | Advanced | Defence | Mixed | transition | true | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE | KEEP |
| scn_bank_979 | `lw_def_numerical_5v6` | numerical_defence | Expert | Defence | 6-0 | 5v6 | false | 4 | CLEAR | PASS | PASS | UNIQUE | CONTEXTUALLY_LW_NATIVE | KEEP |
| scn_bank_980 | `lw_sys_4plus2_lane` | system | Advanced | Attack | 4+2 | 6v6 | true | 3 | CLEAR | PASS | PASS | UNIQUE | CONTEXTUALLY_LW_NATIVE | KEEP |
| scn_bank_981 | `lw_sys_open_man_help` | system | Intermediate | Attack | Open | 6v6 | false | 2 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE | KEEP |

## Strongest 3
- scn_bank_975 `lw_def_comm_half` (risk 2)
- scn_bank_981 `lw_sys_open_man_help` (risk 2)
- scn_bank_976 `lw_def_wing_entry` (risk 3)

## Inspect closely
- scn_bank_979 `lw_def_numerical_5v6` (risk 4) — UNIQUE
- scn_bank_976 `lw_def_wing_entry` (risk 3) — RELATED_BUT_DISTINCT
- scn_bank_978 `lw_def_trans_far_skip_with_map` (risk 3) — RELATED_BUT_DISTINCT

## Distributions
- Attack / Defence: 2 / 5
- Difficulty: {"Beginner":2,"Advanced":3,"Expert":1,"Intermediate":1}
- Perception T/F: 2 / 5
- Systems: {"6-0":3,"3-3":1,"Mixed":1,"4+2":1,"Open":1}
- Numerical: {"6v6":5,"transition":1,"5v6":1}
- Nativity: {"CONTEXTUALLY_LW_NATIVE":7}

## Remaining unused matrix families: 18

---

## scn_bank_975 — Left Wing — Defence: Call the Half Before You Leave the Wing

**HR title:** Lijevo krilo — obrana: javi polubranitelju prije nego napustiš krilo

**Situation HR:** Neriješeno je 7:7 u 14. minuti u vašoj 6:0. Braniš lijevo krilo. Njihov desni vanjski jako prodire u razmak. Njihovo desno krilo ostaje široko. Hoćeš ući unutra da pomogneš. Polubranitelj je blizu prodora, ali nije preuzeo njihovo krilo i još nije odgovorio ni na kakvu dojavu.

**Question HR:** Prodor izgleda opasno i hoćeš pomoći — što prvo?

**A:** Prvo javi polubranitelju — napusti krilo tek kad potvrdi da drži njihovo krilo

**B:** Napusti bez dojave samo ako polubranitelj već ima jasan kontakt tijelom na njihovom krilu

**whyCorrectOverSecondBest:** A prvo javlja jer pokriće nije potvrđeno. B postaje točan samo kad polubranitelj već ima jasan kontakt na njihovom krilu.

---

## scn_bank_976 — Left Wing — Defence: Deny Their Wing Entry Behind You

**HR title:** Lijevo krilo — obrana: zatvori ulazak njihovog krila iza tebe

**Situation HR:** Neriješeno je 9:9 u 18. minuti u vašoj 6:0. Braniš lijevo krilo. Lopta je kod njihovog desnog vanjskog na devet metara. Njihovo desno krilo kreće u ulazak iza tvojih leđa prema šest. Ti gledaš loptu. Nitko nije javio preuzimanje tog trkača.

**Question HR:** Njihovo krilo kreće iza tebe prema šest — što je prvo?

**A:** Okreni se, nađi kontakt i zatvori taj ulazak — ne gledaj loptu dok on ide na šest

**B:** Pusti put samo nakon što je polubranitelj preuzeo tog trkača kontaktom i dojavom

**whyCorrectOverSecondBest:** A zatvara ulazak sada jer nitko nije preuzeo trkača. B postaje točan tek kad polubranitelj ima kontakt i javio je preuzimanje.

---

## scn_bank_977 — Left Wing — Defence: In 3:3 Switch the Runner When the Team Rule Says Switch

**HR title:** Lijevo krilo — obrana: u 3:3 preuzmi trkača kad dogovor kaže zamjenu

**Situation HR:** Neriješeno je 13:13 u 26. minuti u vašoj 3:3. Dogovor: kad njihovo desno krilo trči unutra preko polubranitelja, ti preuzimaš sljedećeg otvorenog napadača koji dolazi na krilo, a polubranitelj uzima trkača. Njihovo desno krilo sada jako trči unutra preko polubranitelja. Otvoreni napadač s lijeve strane dolazi prema tvom krilu. Polubranitelj je na putu trkača.

**Question HR:** Po vašem dogovoru zamjene u 3:3, što radiš kad njihovo krilo trči unutra?

**A:** Pusti trkača polubranitelju i preuzmi otvorenog napadača koji dolazi na krilo

**B:** Ostani s prvim trkačem samo ako je dogovor za ovu utakmicu ostanak, ne zamjena

**whyCorrectOverSecondBest:** A radi zamjenu jer je dogovor u 3:3 zamjena. B postaje točan samo ako je dogovor za utakmicu ostanak.

---

## scn_bank_978 — Left Wing — Defence: Cut the Far Skip Only When Your Side Is Covered

**HR title:** Lijevo krilo — obrana: siječi daleki skip samo kad je tvoja strana pokrivena

**Situation HR:** Neriješeno je 11:11 u 22. minuti nakon gubitka lopte. Vraćaš se na lijevoj strani. Suigrač je već između njihovog desnog krila i lopte na tvojoj aut-liniji. Njihov vratar gleda njihovo lijevo krilo na dalekoj strani za dugi prvi izlazak. To daleko krilo još je visoko i otvoreno. Možeš stići na liniju dugog dodavanja ako sada napustiš svoju stranu.

**Question HR:** Tvoja aut-linija je već pokrivena a daleki izlazak je živ — što je prvo?

**A:** Napusti svoju stranu i siječi dugo dodavanje na njihovo lijevo krilo

**B:** Ostani i čuvaj svoje krilo ako pokrića na aut-liniji još nema

**whyCorrectOverSecondBest:** A siječe daleki skip jer je pokriće na vlastitoj strani već tu. B postaje točan kad tog pokrića na aut-liniji nema.

---

## scn_bank_979 — Left Wing — Defence: In 5v6 Protect the Most Dangerous Pass First

**HR title:** Lijevo krilo — obrana: u 5v6 prvo zatvori najopasnije dodavanje

**Situation HR:** Gubite 20:21 u 41. minuti i igrate s igračem manje — obrana 5v6. Braniš lijevo krilo. Njihov desni vanjski ima loptu. Njihovo desno krilo je široko, ali najčišće slobodno dodavanje sada je skip na njihovo lijevo krilo na dalekoj strani — taj je igrač potpuno nepokriven. Najbliži suigrač zaglavio je na pivotu. Ako rano skočiš na njihovo desno krilo, daleki skip ostaje slobodan.

**Question HR:** Igrač manje, daleko krilo je potpuno slobodno za skip — što je prvo?

**A:** Prvo zatvori slobodni daleki skip — ne kockaj rano na njihovo bliže krilo

**B:** Pomakni se na bliže krilo samo nakon što je suigrač skinuo daleki skip

**whyCorrectOverSecondBest:** A zatvara slobodni daleki skip jer je to živi prioritet u 5v6. B postaje točan tek kad je suigrač skinuo taj skip.

---

## scn_bank_980 — Left Wing — Against 4+2 Attack the Open Left Lane Between the Advanced Pair

**HR title:** Lijevo krilo — protiv 4+2 napadni otvoreni lijevi prolaz između isturenog para

**Situation HR:** Neriješeno je 15:15 u 29. minuti protiv 4+2. Dva isturena braniča su visoko lijevo. Između njih je otvoren slobodan prolaz prema šest. Lijevi vanjski ima loptu i još može odigrati u taj prolaz. Vanjski istureni zatvara široki završetak uz aut. Unutarnji istureni otišao je prema sredini i ostavio razmak između njih.

**Question HR:** Dva isturena, jedan slobodan prolaz između njih — što je prvo?

**A:** Napadni otvoreni prolaz između njih sada dok lijevi vanjski još može odigrati

**B:** Vrati loptu ako oba isturena zatvore taj razmak prije ulova

**whyCorrectOverSecondBest:** A napada otvoreni prolaz između isturenog para. B postaje točan samo kad oba isturena zatvore taj razmak prije ulova.

---

## scn_bank_981 — Left Wing — In Open Defence Recycle When Help Arrives Into Your Isolation

**HR title:** Lijevo krilo — u otvorenoj obrani vrati loptu kad pomoć stigne u tvoju izolaciju

**Situation HR:** Vodite 17:16 u 33. minuti protiv otvorene obrane. Hvataš na lijevom krilu za 1v1. Krilni branič je ispred tebe, ali drugi branič stiže unutar dva metra u tu izolaciju prije nego osiguraš ulov za odraz. Lijevi vanjski je slobodan za kratki povratak.

**Question HR:** Pomoć stiže u izolaciju prije nego je odraz siguran — što je prvo?

**A:** Kratko vrati lijevom vanjskom — ne forsiraj 1v1 u pomoć koja je stigla

**B:** Napadni 1v1 samo ako je pomoć još više od dva metra daleko kad je ulov siguran

**whyCorrectOverSecondBest:** A vraća jer je pomoć već unutar dva metra. B postaje točan samo ako je pomoć još više od dva metra kad je ulov siguran.

