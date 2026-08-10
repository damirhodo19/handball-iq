# LW Gold Batch B — Human Review (12)

**Verdict: LW BATCH B GOLD APPROVED**

Temporary LW total: **74** (40 legacy + 10 pilot + 12 Batch A + 12 Batch B)

| ID | familyKey | area | diff | A/D | sys | num | perc | risk | A/B | HR | geo | dup | nativity |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| scn_bank_963 | `lw_sys_5plus1_trap` | system | Advanced | Attack | 5+1 | 6v6 | true | 3 | CLEAR | PASS | PASS | UNIQUE | CONTEXTUALLY_LW_NATIVE |
| scn_bank_964 | `lw_entry_when_space_opens` | entry | Advanced | Attack | 6-0 | 6v6 | true | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE |
| scn_bank_965 | `lw_recovering_defender_race` | finish_pressure | Intermediate | Attack | 6-0 | 6v6 | false | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE |
| scn_bank_966 | `lw_backdoor_ball_watch` | backdoor | Intermediate | Attack | 6-0 | 6v6 | true | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE |
| scn_bank_967 | `lw_entry_when_not` | entry | Intermediate | Attack | 6-0 | 6v6 | false | 3 | CLEAR | PASS | PASS | UNIQUE | CONTEXTUALLY_LW_NATIVE |
| scn_bank_968 | `lw_1v1_wing_space` | one_v_one | Advanced | Attack | Open | 6v6 | true | 3 | CLEAR | PASS | PASS | UNIQUE | CONTEXTUALLY_LW_NATIVE |
| scn_bank_969 | `lw_pivot_feed_vs_finish` | pivot | Advanced | Attack | 6-0 | 6v6 | true | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | STRONGLY_LW_NATIVE |
| scn_bank_970 | `lw_def_sys_51_vs_advance` | system_defence | Intermediate | Defence | 5-1 | 6v6 | true | 3 | CLEAR | PASS | PASS | UNIQUE | CONTEXTUALLY_LW_NATIVE |
| scn_bank_971 | `lw_late_lead_risk` | late_game | Expert | Attack | 6-0 | 6v6 | false | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE |
| scn_bank_972 | `lw_def_trans_own_side_lane` | transition_defence | Intermediate | Defence | Mixed | transition | true | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE |
| scn_bank_973 | `lw_def_when_not_abandon` | set_defence | Intermediate | Defence | 6-0 | 6v6 | true | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE |
| scn_bank_974 | `lw_def_handover_timing` | handover | Intermediate | Defence | 6-0 | 6v6 | true | 3 | CLEAR | PASS | PASS | RELATED_BUT_DISTINCT | CONTEXTUALLY_LW_NATIVE |

## Strongest 3
- scn_bank_963 `lw_sys_5plus1_trap` (risk 3)
- scn_bank_964 `lw_entry_when_space_opens` (risk 3)
- scn_bank_965 `lw_recovering_defender_race` (risk 3)

## Inspect closely
- scn_bank_964 `lw_entry_when_space_opens` (risk 3) — RELATED_BUT_DISTINCT
- scn_bank_965 `lw_recovering_defender_race` (risk 3) — RELATED_BUT_DISTINCT
- scn_bank_966 `lw_backdoor_ball_watch` (risk 3) — RELATED_BUT_DISTINCT

---

## scn_bank_963 — Left Wing — In 5+1 Wait Until the Left Back Moves the Advanced Defender

| Field | Value |
|---|---|
| familyKey | `lw_sys_5plus1_trap` |
| closest LW | scn_bank_942 / 967 |
| closest RW | no direct RW 5+1 twin |
| duplicate | UNIQUE |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — u 5+1 pričekaj da lijevi vanjski odvuče isturenog

**Situation:** Neriješeno je 12:12 u 23. minuti protiv 5+1. Njihov istureni je visoko lijevo između tebe i lijevog vanjskog. Iza njega već vidiš prostor prema šest. Lijevi vanjski ima loptu i ide na tog isturenog. Direktna veza od lijevog vanjskog do tebe još je pokrivena njegovim tijelom. Njihov krilni branič još nije glavni problem.

**Question:** Iza isturenog se vidi prostor, ali on još sjedi na vezi s lijevim vanjskim — što prvo?

#### OPTIMAL
- EN: Stay wide and wait — give the left back time to move the advanced defender toward the middle before you enter
- HR: Ostani široko i pričekaj — daj lijevom vanjskom vremena da odvuče isturenog prema sredini prije nego uđeš
- DE: Breit bleiben und warten — dem Rückraum Zeit geben den Vorgeschobenen zur Mitte wegzuziehen bevor du einrückst
- Feedback EN: Correct — early entry while he still owns the left connection wastes the 5+1 read.
- Feedback HR: Točno — rani ulazak dok on još drži lijevu vezu baca čitanje 5+1.
- Feedback DE: Richtig — früher Eintritt während er die linke Verbindung noch hält, verschenkt die 5+1-Lesung.

#### GOOD
- EN: Enter behind him only after the left back has drawn him toward the middle and the pass into that space is open
- HR: Uđi iza njega samo nakon što ga je lijevi vanjski odvukao prema sredini i pas u taj prostor je otvoren
- DE: Erst hinter ihn einrücken wenn der Rückraum ihn zur Mitte gezogen hat und der Pass in diesen Raum offen ist
- Feedback EN: Valid after he is moved off the left connection; here he still sits between you and the left back.
- Feedback HR: Valja nakon što je skinut s lijeve veze; ovdje još sjedi između tebe i lijevog vanjskog.
- Feedback DE: Gültig nachdem er von der linken Verbindung weg ist; hier sitzt er noch zwischen dir und dem Rückraum.

#### RISKY
- EN: Cut early into the space behind him while he is still high on the left-back connection
- HR: Rano siječi u prostor iza njega dok je još visoko na vezi s lijevim vanjskim
- DE: Früh in den Raum hinter ihm schneiden während er noch hoch auf der Verbindung zum Rückraum steht
- Feedback EN: Risky — the space behind him is not usable until the left back moves him.
- Feedback HR: Rizično — prostor iza njega nije za korištenje dok ga lijevi vanjski ne odvuče.
- Feedback DE: Riskant — der Raum hinter ihm ist nicht nutzbar bis der Rückraum ihn wegzieht.

#### POOR
- EN: Force a wide finish into him because the corner looks empty
- HR: Forsiraj široki završetak u njega jer kut izgleda prazan
- DE: Einen breiten Abschluss in ihn erzwingen weil die Ecke leer wirkt
- Feedback EN: Poor — you attack the body that still covers the left connection.
- Feedback HR: Loše — napadaš tijelo koje još pokriva lijevu vezu.
- Feedback DE: Schlecht — du greifst den Körper an der die linke Verbindung noch zudeckt.

**Explanation HR:** U 5+1 istureni visoko lijevo mijenja tvoj timing. Ako vidiš prostor iza njega, ali on još pokriva vezu s lijevim vanjskim, prvo ostani široko. Uđi iza njega tek kad ga je lijevi vanjski odvukao prema sredini i pas je otvoren.

**whyCorrectOverSecondBest HR:** A ostaje široko dok istureni još pokriva vezu s lijevim vanjskim. B postaje točan tek kad ga je lijevi vanjski odvukao prema sredini i pas u taj prostor je otvoren.

### EN why A/B
A stays wide while the advanced still covers the left-back connection. B becomes correct only after the left back has drawn him toward the middle and the pass into that space is open.

**Critical difference:** Patient width until LB moves the 5+1 advanced off the left connection, then enter behind — not 942 ask-now under 5:1, not 967 early-entry reject without advanced geometry

---

## scn_bank_964 — Left Wing — Enter When the Path Opens and the Ball Can Still Arrive

| Field | Value |
|---|---|
| familyKey | `lw_entry_when_space_opens` |
| closest LW | scn_bank_967 |
| closest RW | scn_bank_890 / 893 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — uđi kad se otvori prostor i lopta još može doći

**Situation:** Neriješeno je 14:14 u 27. minuti protiv 6:0. Lijevi vanjski s loptom prodire na tvoju stranu. Tvoj krilni branič napušta kut i ide unutra prema tom prodoru — bokovi i prsa mu se okreću od tebe. Iza njega se otvara put prema šest za tvoj ulazak. Lijevi vanjski još ima slobodnu ruku i tijelo dovoljno otvoreno da odigra loptu u taj ulazak.

**Question:** On napušta kut da pomogne unutra a lijevi vanjski još ima slobodnu ruku — što radiš?

#### OPTIMAL
- EN: Start the entry behind him now — while the left back can still play the ball into that cut
- HR: Kreni u ulazak iza njega sada — dok lijevi vanjski još može odigrati loptu u tvoj ulazak
- DE: Jetzt hinter ihm einlaufen — solange der Rückraum den Ball noch in diesen Schnitt spielen kann
- Feedback EN: Correct — emptied path plus a deliverable left-back pass make the entry live.
- Feedback HR: Točno — ispražnjen put plus lopta koju lijevi vanjski još može odigrati čine ulazak pravim.
- Feedback DE: Richtig — geleerter Weg plus ein spielbarer Pass vom Rückraum machen den Einlauf echt.

#### GOOD
- EN: Stay wide if the left back is already under a double and has no free arm to play the cut
- HR: Ostani široko ako je lijevi vanjski već pod dvojicom i nema slobodnu ruku da odigra ulazak
- DE: Breit bleiben wenn der Rückraum schon unter Doppel steht und keinen freien Arm hat um den Schnitt zu spielen
- Feedback EN: Valid when the ball cannot arrive; here he still has a free arm and open body.
- Feedback HR: Valja kad lopta ne može doći; ovdje još ima slobodnu ruku i otvoreno tijelo.
- Feedback DE: Gültig wenn der Ball nicht ankommen kann; hier hat er noch freien Arm und offenen Körper.

#### RISKY
- EN: Stay wide out of habit even though he has left the corner and the left back can still play you the ball
- HR: Ostani široko iz navike iako je on napustio kut a lijevi vanjski ti još može odigrati loptu
- DE: Aus Gewohnheit breit bleiben obwohl er die Ecke verlassen hat und der Rückraum dir den Ball noch spielen kann
- Feedback EN: Risky — you waste a real entry that both cues already support.
- Feedback HR: Rizično — propuštaš pravi ulazak koji već drže oba znaka.
- Feedback DE: Riskant — du verschenkst einen echten Einlauf den beide Zeichen schon tragen.

#### POOR
- EN: Enter early before he leaves the corner, while the left back still needs your width
- HR: Uđi rano prije nego napusti kut, dok lijevi vanjski još treba tvoju širinu
- DE: Früh einrücken bevor er die Ecke verlässt, während der Rückraum noch deine Breite braucht
- Feedback EN: Poor — that is the opposite mistake: leaving early when width is still needed.
- Feedback HR: Loše — to je suprotna greška: rani odlazak dok se širina još treba.
- Feedback DE: Schlecht — das ist der Gegenfehler: früh weg während Breite noch gebraucht wird.

**Explanation HR:** Uđi samo kad vrijede obje stvari: krilni branič odlaskom unutra isprazni pravi put iza sebe, i lijevi vanjski još ima slobodnu ruku da odigra loptu u taj ulazak. Ako je lijevi vanjski pod dvojicom bez slobodne ruke, ostani široko. Ne ulazi rano dok još treba tvoju širinu.

**whyCorrectOverSecondBest HR:** A ulazi jer je put ispražnjen i lijevi vanjski još može odigrati loptu u ulazak. B postaje točan kad je lijevi vanjski pod dvojicom i nema slobodnu ruku za taj pas.

### EN why A/B
A enters because the path emptied and the left back can still play the ball into the cut. B becomes correct when the left back is doubled and has no free arm for that pass.

**Critical difference:** Requires simultaneous LB free-arm delivery; opposite of 967; not RW 890 second-help or 893 pivot-return entry

---

## scn_bank_965 — Left Wing — Finish the Race Before the Recovery — Do Not Wait for the Goalkeeper

| Field | Value |
|---|---|
| familyKey | `lw_recovering_defender_race` |
| closest LW | scn_bank_954 |
| closest RW | scn_bank_882 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — završi utrku prije povratka — ne čekaj vratara

**Situation:** Vodite 13:12 u 27. minuti protiv 6:0. Hvataš slobodno na lijevom krilu. Krilni branič kasni iznutra i još je oko tri metra od tvog odraza. Vratar je centralno i još nije pokazao jasno zatvaranje rukom ili stopalom. Čekati savršenu sliku vratara znači pustiti braniča da stigne. Linija odraza sada je slobodna.

**Question:** Odraz je sada slobodan ali vratar se nije zatvorio — što je prvo?

#### OPTIMAL
- EN: Take off and finish now — do not wait for a goalkeeper read that arrives too late
- HR: Idi u odraz i završi sad — ne čekaj čitanje vratara koje stiže prekasno
- DE: Jetzt abspringen und abschließen — nicht auf eine Torhüterlese warten die zu spät kommt
- Feedback EN: Correct — the race is with the recovering defender; the free take-off is now.
- Feedback HR: Točno — utrka je s braničem u povratku; slobodan odraz je sada.
- Feedback DE: Richtig — das Rennen ist mit dem zurückkehrenden Verteidiger; der freie Absprung ist jetzt.

#### GOOD
- EN: Short return to the left back only if the defender reaches your take-off foot before you can jump
- HR: Kratko vrati lijevom vanjskom samo ako branič stigne na tvoje stopalo odraza prije skoka
- DE: Kurz zum linken Rückraum nur wenn der Verteidiger deinen Absprungfuß vor dem Sprung erreicht
- Feedback EN: Valid when the race is already lost; here he is still about three metres late.
- Feedback HR: Valja kad je utrka već izgubljena; ovdje kasni još oko tri metra.
- Feedback DE: Gültig wenn das Rennen schon verloren ist; hier ist er noch etwa drei Meter spät.

#### RISKY
- EN: Hold the ball waiting for the goalkeeper to pick a post
- HR: Drži loptu i čekaj da vratar izabere stativu
- DE: Den Ball halten und warten bis der Torhüter eine Stange wählt
- Feedback EN: Risky — you gift the recovering defender the contest.
- Feedback HR: Rizično — poklanjaš braniču u povratku kontakt.
- Feedback DE: Riskant — du schenkst dem zurückkehrenden Verteidiger den Kampf.

#### POOR
- EN: Step inside and look for a new combination instead of using the free take-off
- HR: Uđi unutra i traži novu kombinaciju umjesto slobodnog odraza
- DE: Nach innen gehen und eine neue Kombination suchen statt den freien Absprung zu nutzen
- Feedback EN: Poor — you refuse a free finish to invent traffic.
- Feedback HR: Loše — odbijaš slobodan završetak da izmisliš gužvu.
- Feedback DE: Schlecht — du lehnst einen freien Abschluss ab um Verkehr zu erfinden.

**Explanation HR:** Kad je odraz slobodan a krilni branič još kasni metrima, završi utrku. Ne čekaj savršenu sliku vratara. Kratki povratak samo ako stigne na stopalo odraza prije skoka.

**whyCorrectOverSecondBest HR:** A koristi slobodan odraz prije povratka. B postaje točan samo ako branič stigne na stopalo odraza prije skoka.

### EN why A/B
A uses the free take-off before recovery. B becomes correct only if the defender reaches the take-off foot before the jump.

**Critical difference:** Stated temptation is waiting for unread GK; race-over-GK-patience, not pure recovery race alone

---

## scn_bank_966 — Left Wing — Cut Back-Door When He Ball-Watches and the Left Back Is About to Catch

| Field | Value |
|---|---|
| familyKey | `lw_backdoor_ball_watch` |
| closest LW | scn_bank_943 |
| closest RW | scn_bank_891 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — siječi iza leđa kad gleda loptu a lijevi vanjski hvata

**Situation:** Neriješeno je 9:9 u 18. minuti protiv 6:0. Ti si široko lijevo. Lopta ide na tvog lijevog vanjskog — uhvatit će u sljedećem trenutku s jasnim kutom prema šest. Tvoj krilni branič potpuno okreće glavu na loptu i oba stopala otvara prema devet metara. Ne gleda te. Put iza njegovih leđa prema šest je prazan.

**Question:** Gleda loptu a lijevi vanjski će uhvatiti — što je tvoj prvi pokret?

#### OPTIMAL
- EN: Cut behind him toward six on the next pass and show a clear hand
- HR: Siječi iza njega prema šest na sljedeći pas i pokaži jasnu ruku
- DE: Hinter ihn auf sechs auf den nächsten Pass schneiden und eine klare Hand zeigen
- Feedback EN: Correct — ball-watch plus a deliverable left-back catch opens the back-door now.
- Feedback HR: Točno — gledanje lopte plus dodavanje s lijevog vanjskog sada otvara prolaz iza leđa.
- Feedback DE: Richtig — Ballschauen plus zustellbarer Fang vom Rückraum öffnet jetzt den Hintertürweg.

#### GOOD
- EN: Hold width if his feet reopen to the corner before the left back catches
- HR: Ostani u širini ako mu se stopala vrate u kut prije nego lijevi vanjski uhvati
- DE: Breit bleiben wenn seine Füße vor dem Fang des Rückraums zur Ecke zurückdrehen
- Feedback EN: Valid when he recovers vision to you before the catch; here he stays on the ball.
- Feedback HR: Valja kad ti vrati pogled prije hvatanja; ovdje ostaje na lopti.
- Feedback DE: Gültig wenn er vor dem Fang zu dir zurückschaut; hier bleibt er am Ball.

#### RISKY
- EN: Show in front of him for a high catch before the left back receives
- HR: Pokaži se ispred njega za visoki ulov prije nego lijevi vanjski primi
- DE: Dich vor ihm für einen hohen Fang zeigen bevor der Rückraum annimmt
- Feedback EN: Risky — you run into the body that is already facing the ball.
- Feedback HR: Rizično — trčiš u tijelo koje je već okrenuto na loptu.
- Feedback DE: Riskant — du läufst in den Körper der schon zum Ball steht.

#### POOR
- EN: Stay glued to the corner and wait for an open wing shot later
- HR: Ostani zalijepljen za kut i čekaj kasnije otvoren šut s krila
- DE: An der Ecke kleben und später auf einen offenen Flügelwurf warten
- Feedback EN: Poor — you ignore a live back-door while he is not looking.
- Feedback HR: Loše — ignoriraš otvoren prolaz iza leđa dok te ne gleda.
- Feedback DE: Schlecht — du ignorierst einen offenen Hintertürweg während er nicht schaut.

**Explanation HR:** Čitaj: krilni branič gleda loptu a lijevi vanjski će uhvatiti s kutom za dodavanje. Siječi iza prema šest. Ostani u širini samo ako mu se stopala vrate u kut prije tog hvatanja.

**whyCorrectOverSecondBest HR:** A koristi gledanje lopte plus skoro hvatanje lijevog vanjskog. B postaje točan ako mu se stopala vrate u kut prije hvatanja.

### EN why A/B
A uses ball-watch plus the imminent left-back catch. B becomes correct if his feet reopen to the corner before the left back catches.

**Critical difference:** Requires LB about to catch with deliverable angle; B = feet reopen before catch (943 is pre-move feet read)

---

## scn_bank_967 — Left Wing — Do Not Enter Early When the Left Back Still Needs Width

| Field | Value |
|---|---|
| familyKey | `lw_entry_when_not` |
| closest LW | scn_bank_941 |
| closest RW | no identical entry-reject twin |
| duplicate | UNIQUE |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — ne ulazi rano dok lijevi vanjski još treba širinu

**Situation:** Neriješeno je 8:8 u 16. minuti protiv 6:0. Lijevi vanjski ima loptu prema tvojoj strani i sprema prodor. Mamac je rano napustiti kut i ući prema šest. Tvoj krilni branič se vraća prema kutu i zatvorio bi iza tebe. Lijevi vanjski još treba tvoju širinu vani da lijeva strana ostane otvorena. Nema zapečaćenog pivota koji te zove unutra.

**Question:** Lijevi vanjski još treba lijevu širinu — ulaziš li sada?

#### OPTIMAL
- EN: Stay wide in the corner — do not leave early
- HR: Ostani široko u kutu — ne napuštaj rano
- DE: Breit in der Ecke bleiben — nicht früh verlassen
- Feedback EN: Correct — early entry removes the width he is about to use.
- Feedback HR: Točno — rani ulazak skida širinu koju će upravo koristiti.
- Feedback DE: Richtig — früher Eintritt nimmt die Breite die er gleich nutzt.

#### GOOD
- EN: Enter only after he has clearly bound the wing defender and the cut lane is free
- HR: Uđi samo nakon što je jasno vezao krilnog braniča i linija ulaska je slobodna
- DE: Nur einrücken nachdem er den Außenverteidiger klar gebunden hat und die Schnittbahn frei ist
- Feedback EN: Valid after a real bind and free lane; here he still needs width and the defender is recovering to you.
- Feedback HR: Valja nakon prave veze i slobodne linije; ovdje još treba širinu a branič se vraća na tebe.
- Feedback DE: Gültig nach echter Bindung und freier Bahn; hier braucht er noch Breite und der Verteidiger kehrt zu dir zurück.

#### RISKY
- EN: Enter now to create traffic near six
- HR: Uđi sad da napraviš gužvu kod šest
- DE: Jetzt einrücken um Verkehr bei sechs zu erzeugen
- Feedback EN: Risky — you clog the left side without a bind.
- Feedback HR: Rizično — zatrpavaš lijevu stranu bez veze.
- Feedback DE: Riskant — du verstopfst die linke Seite ohne Bindung.

#### POOR
- EN: Back-door anyway because the wing defender is moving
- HR: Svejedno idi iza leđa jer se krilni branič miče
- DE: Trotzdem hinterrücks gehen weil der Außenverteidiger sich bewegt
- Feedback EN: Poor — movement toward you is recovery, not a ball-watch gift.
- Feedback HR: Loše — kretanje prema tebi je povratak, ne poklon gledanja lopte.
- Feedback DE: Schlecht — Bewegung zu dir ist Rückkehr, kein Ballschau-Geschenk.

**Explanation HR:** Odbij rani ulazak iz kuta dok lijevi vanjski još treba lijevu širinu a krilni branič se vraća u kut. Uđi samo nakon prave veze koja ostavlja liniju slobodnom.

**whyCorrectOverSecondBest HR:** A drži širinu koju lijevi vanjski još treba. B postaje točan samo nakon što veže krilnog braniča i linija ulaska je slobodna.

### EN why A/B
A keeps the width the left back still needs. B becomes correct only after he binds the wing defender and the cut lane is free.

**Critical difference:** Explicit do-not-enter while LB still needs width + WD recovering; not 948 6v5 pivot corridor

---

## scn_bank_968 — Left Wing — Attack the 1v1 When Help Is Late in Open Defence

| Field | Value |
|---|---|
| familyKey | `lw_1v1_wing_space` |
| closest LW | scn_bank_944 |
| closest RW | no clear RW attack twin |
| duplicate | UNIQUE |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — napadni 1v1 kad pomoć kasni u otvorenoj obrani

**Situation:** Vodite 15:14 u 31. minuti protiv otvorene obrane. Hvataš na lijevom krilu s prostorom uz aut-liniju. Tvoj krilni branič je izoliran — stopala ravno, prsa prema tebi, nema suigrača unutar dva metra. Najbliža pomoć još je više od dva metra unutra i kasni. Vraćati iz navike znači baciti živ 1v1.

**Question:** Imaš prostor uz aut i pomoć kasni — što je prvo?

#### OPTIMAL
- EN: Attack the 1v1 take-off now
- HR: Napadni 1v1 odraz sada
- DE: Das 1v1-Absprung jetzt angreifen
- Feedback EN: Correct — isolated feet and help outside two metres make the take-off the play.
- Feedback HR: Točno — izolirana stopala i pomoć van dva metra čine odraz pravom akcijom.
- Feedback DE: Richtig — isolierte Füße und Hilfe außerhalb von zwei Metern machen den Absprung zum Spiel.

#### GOOD
- EN: Recycle to the left back only if help closes inside two metres before your catch is secure
- HR: Vrati lijevom vanjskom samo ako pomoć uđe unutar dva metra prije nego uhvatiš čisto
- DE: Zum Rückraum nur zurück wenn Hilfe vor sicherem Fang innerhalb von zwei Metern schließt
- Feedback EN: Valid when help arrives early; here help is still late.
- Feedback HR: Valja kad pomoć stigne rano; ovdje još kasni.
- Feedback DE: Gültig wenn Hilfe früh kommt; hier ist sie noch spät.

#### RISKY
- EN: Wait and invite the help closer before you decide
- HR: Čekaj i zovi pomoć bliže prije odluke
- DE: Warten und die Hilfe näher holen bevor du entscheidest
- Feedback EN: Risky — you turn a free 1v1 into a crowded picture.
- Feedback HR: Rizično — pretvaraš slobodan 1v1 u gužvu.
- Feedback DE: Riskant — du machst aus einem freien 1v1 ein gedrängtes Bild.

#### POOR
- EN: Enter to six without using the isolation
- HR: Uđi na šest bez korištenja izolacije
- DE: Auf sechs gehen ohne die Isolation zu nutzen
- Feedback EN: Poor — you leave a live 1v1 to invent traffic.
- Feedback HR: Loše — napuštaš živ 1v1 da izmisliš gužvu.
- Feedback DE: Schlecht — du verlässt ein lebendes 1v1 um Verkehr zu erfinden.

**Explanation HR:** U otvorenoj obrani, kad imaš prostor uz aut, krilni branič je izoliran i pomoć kasni više od dva metra, napadni 1v1 sada. Vrati samo ako pomoć uđe unutar dva metra prije čistog hvatanja.

**whyCorrectOverSecondBest HR:** A napada dok pomoć još kasni i stopala su izolirana. B postaje točan ako pomoć uđe unutar dva metra prije čistog hvatanja.

### EN why A/B
A attacks while help is still late and feet are isolated. B becomes correct if help closes inside two metres before the catch is secure.

**Critical difference:** Open defence + help-distance cue; system changes decision vs 6:0 recycle habit

---

## scn_bank_969 — Left Wing — Feed the Sealed Pivot When the Wing Defender Recovers Onto Your Body

| Field | Value |
|---|---|
| familyKey | `lw_pivot_feed_vs_finish` |
| closest LW | scn_bank_946 |
| closest RW | scn_bank_888 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — dodaj zapečaćenom pivotu kad ti krilni branič dođe na tijelo

**Situation:** Neriješeno je 16:16 u 34. minuti protiv 6:0. Hvataš na lijevom krilu spreman za odraz. Krilni branič se vraća na tvoju ruku i tijelo — forsiran šut s krila je prljav. Istovremeno tvoj pivot je zapečatio svog braniča na šest metara i mekana unutarnja linija između tebe i njega je otvorena. Lijevi vanjski je pokriven i nije čista kratka opcija.

**Question:** Na tebi je tijelom a zapečaćeni pivot ima mekanu liniju — što je prvo?

#### OPTIMAL
- EN: Soft feed to the sealed pivot
- HR: Meko dodaj zapečaćenom pivotu
- DE: Weich zum abgedichteten Kreisläufer zuspielen
- Feedback EN: Correct — contact makes the wing shot dirty; the sealed pivot owns the clean lane.
- Feedback HR: Točno — kontakt čini šut prljavim; zapečaćeni pivot ima čistu liniju.
- Feedback DE: Richtig — Kontakt macht den Wurf schmutzig; der abgedichtete Kreisläufer besitzt die saubere Linie.

#### GOOD
- EN: Finish only if he loses contact and a playable skim opens before help arrives
- HR: Završi samo ako izgubi kontakt i otvori se igriv prolaz prije nego stigne pomoć
- DE: Nur abschließen wenn er den Kontakt verliert und vor ankommender Hilfe ein spielbarer Weg öffnet
- Feedback EN: Valid if contact breaks and a clean skim appears; here he is on your body.
- Feedback HR: Valja ako kontakt pukne i pojavi se čist prolaz; ovdje je na tvom tijelu.
- Feedback DE: Gültig wenn Kontakt reißt und ein sauberer Weg erscheint; hier ist er auf deinem Körper.

#### RISKY
- EN: Lob over the recovering defender into the goalkeeper
- HR: Lobaj preko braniča u povratku u vratara
- DE: Über den zurückkehrenden Verteidiger in den Torhüter lobben
- Feedback EN: Risky — you force a high finish while a clean pivot feed is open.
- Feedback HR: Rizično — forsiraš visoki završetak dok je čisto dodavanje pivotu otvoreno.
- Feedback DE: Riskant — du erzwingst einen hohen Abschluss während ein sauberes Kreisläufer-Zuspiel offen ist.

#### POOR
- EN: Force the wing shot through his arm
- HR: Forsiraj šut s krila kroz njegovu ruku
- DE: Den Flügelwurf durch seinen Arm erzwingen
- Feedback EN: Poor — that is exactly the dirty finish the contact creates.
- Feedback HR: Loše — to je baš prljavi završetak koji kontakt stvara.
- Feedback DE: Schlecht — genau das ist der schmutzige Abschluss den der Kontakt erzeugt.

**Explanation HR:** Čitaj: krilni branič na tvom tijelu plus zapečaćeni pivot s mekom unutarnjom linijom. Dodaj pivotu. Završi samo ako izgubi kontakt i otvori se igriv prolaz prije pomoći.

**whyCorrectOverSecondBest HR:** A koristi zapečaćenog pivota dok kontakt čini šut prljavim. B postaje točan samo ako kontakt pukne i čist prolaz se otvori prije pomoći.

### EN why A/B
A uses the sealed pivot while contact dirties the wing shot. B becomes correct only if contact breaks and a clean skim opens before help.

**Critical difference:** WD on LW body + sealed pivot (not free LB vs lob as in 946); not pivot-block take-off 953

---

## scn_bank_970 — Left Wing — Defence: In 5:1 Do Not Extra-Chase While the Advanced Still Pressures

| Field | Value |
|---|---|
| familyKey | `lw_def_sys_51_vs_advance` |
| closest LW | scn_bank_961 / 942 |
| closest RW | scn_bank_940 (different system) |
| duplicate | UNIQUE |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — obrana: u 5:1 ne juri dodatno dok istureni još pritišće

**Situation:** Vodite 16:15 u 31. minuti u vašoj 5:1. Braniš lijevo krilo na njihovo desno krilo. Njihov desni vanjski ima loptu na oko deset metara na tvojoj strani. Vaš istureni već je visoko i tijelom i rukama pritišće tog desnog vanjskog. Njihovo desno krilo ostaje široko uz aut. Desni vanjski okreće prsa prema tom krilu kao da traži dodavanje.

**Question:** Istureni je još visoko na njihovom desnom vanjskom a to krilo ostaje široko — što radiš?

#### OPTIMAL
- EN: Stay with their right wing and close the pass — do not leave him for an extra chase on the right back
- HR: Ostani na njihovom desnom krilu i zatvori dodavanje — ne napuštaj ga zbog dodatnog jurnjava na desnog vanjskog
- DE: Am Rechtsaußen bleiben und den Pass schließen — ihn nicht für eine Extra-Jagd auf den Rückraum verlassen
- Feedback EN: Correct — while the advanced still pressures the ball, your job is the wing.
- Feedback HR: Točno — dok istureni još pritišće loptu, tvoj je posao krilo.
- Feedback DE: Richtig — solange der Vorgeschobene noch Druck auf den Ball macht, ist dein Job der Flügel.

#### GOOD
- EN: Help on the right back only if the advanced has already been beaten or is out of the action
- HR: Pomagni na desnom vanjskom samo ako je istureni već prođen ili ispao iz akcije
- DE: Nur am Rückraum helfen wenn der Vorgeschobene schon geschlagen oder aus der Aktion ist
- Feedback EN: Valid when the advanced can no longer control the ball-side action; here he is still pressuring.
- Feedback HR: Valja kad istureni više ne kontrolira akciju na strani lopte; ovdje još pritišće.
- Feedback DE: Gültig wenn der Vorgeschobene die ballseitige Aktion nicht mehr kontrolliert; hier macht er noch Druck.

#### RISKY
- EN: Leave their wing now and jump the right back because the drive looks dangerous
- HR: Napusti njihovo krilo sada i skoči na desnog vanjskog jer prodor izgleda opasno
- DE: Den Flügel jetzt verlassen und auf den Rückraum springen weil der Durchbruch gefährlich wirkt
- Feedback EN: Risky — you open the wing while the advanced is still in the duel.
- Feedback HR: Rizično — otvaraš krilo dok je istureni još u duelu.
- Feedback DE: Riskant — du öffnest den Flügel während der Vorgeschobene noch im Duell ist.

#### POOR
- EN: Drop deep under six and watch both without taking either job
- HR: Padni duboko pod šest i gledaj oboje bez da preuzmeš ijedan posao
- DE: Tief unter die Sechs fallen und beide beobachten ohne einen Job zu nehmen
- Feedback EN: Poor — you give away the wing pass without helping usefully.
- Feedback HR: Loše — poklanjaš dodavanje na krilo a nigdje korisno ne pomažeš.
- Feedback DE: Schlecht — du schenkst den Flügelpass ohne sinnvoll zu helfen.

**Explanation HR:** U 5:1, dok je vaš istureni još visoko i pritišće desnog vanjskog, nemoj dodati 6:0 jurnjavu koja otvara njihovo krilo. Ostani na krilu i zatvori dodavanje. Na loptu pomaži tek kad je istureni prođen ili ispao iz akcije.

**whyCorrectOverSecondBest HR:** A ostaje na krilu jer istureni još pritišće desnog vanjskog. B postaje točan samo kad je istureni prođen ili ispao iz akcije.

### EN why A/B
A stays on the wing because the advanced is still pressuring the right back. B becomes correct only when the advanced has been beaten or is out of the action.

**Critical difference:** 5:1: keep wing while advanced still pressures RB; help only if advanced beaten/out — geometry shown, ownership not narrated

---

## scn_bank_971 — Left Wing — Protect a Late Lead: Do Not Gift a Counter From a Marginal Wing Chance

| Field | Value |
|---|---|
| familyKey | `lw_late_lead_risk` |
| closest LW | scn_bank_959 |
| closest RW | scn_bank_921 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — čuvaj kasno vođstvo: ne poklanjaj kontru iz granične šanse s krila

**Situation:** Vodite 27:26 u 56. minuti protiv 6:0. Hvataš na lijevom krilu s igrivim ali prljavim kutom — krilni branič je pola koraka od tvoje ruke i završetak nije jasno slobodan. Gubitak lopte ovdje poklanja kontru uz vođstvo od jednog gola. Lijevi vanjski je slobodan za siguran povratak i još imate vremena za čistiju šansu.

**Question:** Kasno vođstvo od jednog gola, šansa s krila samo granična — što je prvo?

#### OPTIMAL
- EN: Safe return to the left back and keep possession
- HR: Sigurno vrati lijevom vanjskom i drži posjed
- DE: Sicher zum linken Rückraum zurück und den Ballbesitz halten
- Feedback EN: Correct — protecting the lead means refusing a marginal wing gift.
- Feedback HR: Točno — čuvanje vođstva znači odbiti granični poklon s krila.
- Feedback DE: Richtig — die Führung schützen heißt eine grenzwertige Flügelchance ablehnen.

#### GOOD
- EN: Finish only if the defender clearly opens the take-off before you release
- HR: Završi samo ako branič jasno otvori odraz prije nego baciš
- DE: Nur abschließen wenn der Verteidiger den Absprung vor der Abgabe klar öffnet
- Feedback EN: Valid on a clearly free chance; here the finish is still dirty.
- Feedback HR: Valja uz jasno slobodnu šansu; ovdje je završetak još prljav.
- Feedback DE: Gültig bei klar freier Chance; hier ist der Abschluss noch schmutzig.

#### RISKY
- EN: Force the wing shot to end the game
- HR: Forsiraj šut s krila da zatvoriš utakmicu
- DE: Den Flügelwurf erzwingen um das Spiel zuzumachen
- Feedback EN: Risky — a turnover from a dirty angle is the counter they want.
- Feedback HR: Rizično — gubitak iz prljavog kuta je kontra koju žele.
- Feedback DE: Riskant — Verlust aus schmutzigem Winkel ist der Konter den sie wollen.

#### POOR
- EN: Enter speculative to six to create chaos
- HR: Ulazi spekulativno na šest da napraviš kaos
- DE: Spekulativ auf sechs gehen um Chaos zu erzeugen
- Feedback EN: Poor — chaos with a one-goal lead is the wrong risk.
- Feedback HR: Loše — kaos uz vođstvo od jednog gola je krivi rizik.
- Feedback DE: Schlecht — Chaos bei Ein-Tor-Führung ist das falsche Risiko.

**Explanation HR:** Kasno vođstvo mijenja odluku na krilu. Na graničnoj prljavoj šansi siguran povratak drži posjed. Završi samo ako branič jasno otvori odraz.

**whyCorrectOverSecondBest HR:** A štiti kasno vođstvo od prljave šanse s krila. B postaje točan samo ako branič jasno otvori odraz prije bacanja.

### EN why A/B
A protects the late lead from a dirty wing chance. B becomes correct only if the defender clearly opens the take-off before release.

**Critical difference:** Dirty left-wing angle under one-goal lead; not 5v6 possession (959) and not short-clock family

---

## scn_bank_972 — Left Wing — Defence: Protect Your Sideline Pass Lane After the Turnover

| Field | Value |
|---|---|
| familyKey | `lw_def_trans_own_side_lane` |
| closest LW | scn_bank_949 |
| closest RW | scn_bank_929 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — obrana: zaštiti liniju dodavanja uz aut nakon gubitka lopte

**Situation:** Neriješeno je 11:11 u 23. minuti. Vaš napad upravo je izgubio loptu u sredini. Trčiš nazad na lijevoj strani. Njihov desni vanjski ima loptu u prvom valu i gleda prema njihovom desnom krilu na tvojoj aut-liniji. To krilo još je visoko i široko. Nitko od suigrača još nije pokrio direktnu liniju dodavanja do njega. Ako prvo juriš nosača lopte, dodavanje niz tvoju aut-liniju je slobodno.

**Question:** Prvi val, njihovo krilo je otvoreno na tvojoj aut-liniji — što je prvo?

#### OPTIMAL
- EN: Drop into the direct pass lane to their wing on your sideline
- HR: Spusti se u direktnu liniju dodavanja na njihovo krilo uz tvoju aut-liniju
- DE: In die direkte Passlinie zu ihrem Flügel an deiner Seitenlinie fallen
- Feedback EN: Correct — with no one on that lane yet, your first job is the sideline pass.
- Feedback HR: Točno — dok nitko nije na toj liniji, prvi ti je posao dodavanje uz aut.
- Feedback DE: Richtig — solange niemand auf dieser Linie ist ist dein erster Job der Seitenlinienpass.

#### GOOD
- EN: Step to the ball carrier only after a recovering teammate covers the pass to their wing
- HR: Kreni na nosača lopte samo nakon što suigrač u povratku pokrije dodavanje na njihovo krilo
- DE: Zum Ballträger nur gehen nachdem ein zurückkehrender Mitspieler den Pass auf ihren Flügel deckt
- Feedback EN: Valid after the lane is covered; here it is still open.
- Feedback HR: Valja nakon što je linija pokrivena; ovdje je još otvorena.
- Feedback DE: Gültig nachdem die Linie gedeckt ist; hier ist sie noch offen.

#### RISKY
- EN: Sprint straight at the right back because he has the ball
- HR: Trči ravno na desnog vanjskog jer on ima loptu
- DE: Direkt auf den rechten Rückraum sprinten weil er den Ball hat
- Feedback EN: Risky — you gift the pass he is already looking for.
- Feedback HR: Rizično — poklanjaš dodavanje koje već traži.
- Feedback DE: Riskant — du schenkst den Pass den er schon sucht.

#### POOR
- EN: Stay high near the centre and watch both sides
- HR: Ostani visoko kod sredine i gledaj obje strane
- DE: Hoch in der Mitte bleiben und beide Seiten anschauen
- Feedback EN: Poor — you defend neither the lane nor the carrier.
- Feedback HR: Loše — ne braniš ni liniju ni nosača.
- Feedback DE: Schlecht — du verteidigst weder Linie noch Ballträger.

**Explanation HR:** Nakon gubitka iz normalnog starta, ako je njihovo krilo otvoreno na tvojoj aut-liniji i nitko nema liniju dodavanja, prvo se spusti u tu liniju. Kreni na loptu samo kad je linija pokrivena.

**whyCorrectOverSecondBest HR:** A zatvara otvoreno dodavanje uz aut dok ga nitko drugi nema. B postaje točan samo nakon što suigrač pokrije to dodavanje.

### EN why A/B
A closes the open sideline pass before anyone else has it. B becomes correct only after a teammate covers that pass.

**Critical difference:** Normal-start first-wave recovery (not second-pivot continuity 949); own-side sideline priority

---

## scn_bank_973 — Left Wing — Defence: Do Not Abandon the Wing When the Ball Reverses and Help Is Already Inside

| Field | Value |
|---|---|
| familyKey | `lw_def_when_not_abandon` |
| closest LW | scn_bank_962 |
| closest RW | scn_bank_934 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — obrana: ne napuštaj krilo kad se lopta vraća a pomoć je već unutra

**Situation:** Vodite 14:13 u 29. minuti u vašoj 6:0. Braniš lijevo krilo. Lopta je bila unutra; tvoj polubranitelj i sredina već pomažu na tom prodoru. Sada se lopta vraća na njihova desnog vanjskog a njihovo desno krilo — tvoj čovjek — otvoreno je uz aut-liniju. Ako juriš u sredinu jer je prethodni prodor izgledao opasno, njihovo krilo prima samo.

**Question:** Lopta se vraća, tvoj čovjek je otvoren, unutarnja pomoć je već tu — što je prvo?

#### OPTIMAL
- EN: Stay on the wing and deny the pass to your man
- HR: Ostani na krilu i zatvori dodavanje do svog čovjeka
- DE: Am Flügel bleiben und den Pass auf deinen Mann verhindern
- Feedback EN: Correct — inside help is already present; your job is the open wing.
- Feedback HR: Točno — unutarnja pomoć je već tu; tvoj je posao otvoreno krilo.
- Feedback DE: Richtig — innere Hilfe ist schon da; dein Job ist der offene Flügel.

#### GOOD
- EN: Leave only if your half has fully taken the wing runner and calls you to the ball
- HR: Napusti samo ako je polubranitelj potpuno preuzeo krilnog trkača i zove te na loptu
- DE: Nur verlassen wenn dein Halber den Flügelläufer voll übernommen hat und dich zum Ball ruft
- Feedback EN: Valid after a real takeover call; here the wing is still yours and open.
- Feedback HR: Valja nakon pravog preuzimanja; ovdje je krilo još tvoje i otvoreno.
- Feedback DE: Gültig nach echter Übernahme; hier ist der Flügel noch deiner und offen.

#### RISKY
- EN: Chase the middle because the earlier drive looked more dangerous
- HR: Juri u sredinu jer je raniji prodor izgledao opasnije
- DE: In die Mitte jagen weil der frühere Durchbruch gefährlicher wirkte
- Feedback EN: Risky — you abandon the open wing after the ball has already reversed.
- Feedback HR: Rizično — napuštaš otvoreno krilo nakon što se lopta već vratila.
- Feedback DE: Riskant — du verlässt den offenen Flügel nachdem der Ball schon zurück ist.

#### POOR
- EN: Foul the right back from a late chase
- HR: Fauliraj desnog vanjskog iz kasnog jurnjava
- DE: Den rechten Rückraum aus spätem Nachjagen foulen
- Feedback EN: Poor — you are late and the wing is free.
- Feedback HR: Loše — kasniš a krilo je slobodno.
- Feedback DE: Schlecht — du bist spät und der Flügel ist frei.

**Explanation HR:** Kad se lopta vraća na otvoreno protivničko krilo a unutarnja pomoć je već tu, ostani i zatvori to krilo. Napusti samo nakon pravog preuzimanja polubranitelja i poziva.

**whyCorrectOverSecondBest HR:** A ostaje jer je krilo otvoreno a unutarnja pomoć je već tu. B postaje točan samo nakon što polubranitelj potpuno preuzme krilnog trkača i pozove te na loptu.

### EN why A/B
A stays because the wing is open and inside help is already there. B becomes correct only after the half fully takes the wing runner and calls you to the ball.

**Critical difference:** Ball reverse + inside help already present (opposite temptation to over-help); not half-removed close-pass 962

---

## scn_bank_974 — Left Wing — Defence: Release the Runner Only After the Agreed Takeover

| Field | Value |
|---|---|
| familyKey | `lw_def_handover_timing` |
| closest LW | scn_bank_962 / 973 |
| closest RW | scn_bank_880 / 928 |
| duplicate | RELATED_BUT_DISTINCT |
| coachRisk | 3 |

### HR
**Title:** Lijevo krilo — obrana: pusti trkača tek nakon dogovorenog preuzimanja

**Situation:** Neriješeno je 17:17 u 34. minuti u vašoj 6:0. Po vašem obrambenom dogovoru trkača predajete tek nakon kontakta i jasne dojave. Braniš lijevo krilo i krećeš na njihovom desnom krilu. To krilo trči unutra prema tvom polubranitelju. Polubranitelj je dovoljno blizu da ga preuzme, ali još nema kontakta i nema dojave. Njihov desni vanjski još ima loptu. Mamac je rano napustiti trkača i skočiti na loptu.

**Question:** On trči prema polubranitelju, a još nema kontakta ni dojave — što radiš?

#### OPTIMAL
- EN: Stay with the runner — release him only after the half has contact and makes the clear call
- HR: Ostani s trkačem — pusti ga tek kad polubranitelj ima kontakt i jasno javi
- DE: Beim Läufer bleiben — erst freigeben wenn der Halbe Kontakt hat und klar ruft
- Feedback EN: Correct — under your agreement, entering the half’s zone is not yet a handover.
- Feedback HR: Točno — po vašem dogovoru ulazak u zonu polubranitelja još nije preuzimanje.
- Feedback DE: Richtig — nach eurer Absprache ist das Laufen in die Zone des Halben noch keine Übernahme.

#### GOOD
- EN: Release immediately only if the half already has body contact and has made the clear call
- HR: Pusti odmah samo ako polubranitelj već ima kontakt tijelom i jasno je javio
- DE: Sofort nur freigeben wenn der Halbe schon Körperkontakt hat und klar gerufen hat
- Feedback EN: Valid after the agreed takeover condition; here contact and call are both missing.
- Feedback HR: Valja nakon dogovorenog preuzimanja; ovdje nema ni kontakta ni dojave.
- Feedback DE: Gültig nach der vereinbarten Übernahmebedingung; hier fehlen Kontakt und Ruf.

#### RISKY
- EN: Leave the runner now because he entered the half’s area and jump the right back
- HR: Napusti trkača sada jer je ušao u prostor polubranitelja i skoči na desnog vanjskog
- DE: Den Läufer jetzt lassen weil er in den Raum des Halben gelaufen ist und auf den Rückraum springen
- Feedback EN: Risky — zone entry without the agreed contact and call leaves him free.
- Feedback HR: Rizično — ulazak u zonu bez dogovorenog kontakta i dojave ostavlja ga slobodnog.
- Feedback DE: Riskant — Zoneneintritt ohne vereinbarten Kontakt und Ruf lässt ihn frei.

#### POOR
- EN: Never release the runner even after clear contact and a clear call
- HR: Nikad ne puštaj trkača čak ni nakon jasnog kontakta i jasne dojave
- DE: Den Läufer nie freigeben auch nach klarem Kontakt und klarem Ruf
- Feedback EN: Poor — once the agreed takeover is done you must release or you double the same man.
- Feedback HR: Loše — kad je dogovoreno preuzimanje gotovo moraš pustiti ili udvajaš istog igrača.
- Feedback DE: Schlecht — ist die vereinbarte Übernahme da musst du freigeben sonst verdoppelst du denselben Mann.

**Explanation HR:** Po vašem obrambenom dogovoru trkača predajete tek nakon kontakta i jasne dojave. Kad njihovo krilo trči prema polubranitelju, ostani s njim dok taj uvjet nije ispunjen. Sam ulazak u zonu nije dovoljan. Pusti odmah samo nakon kontakta i dojave.

**whyCorrectOverSecondBest HR:** A ostaje s trkačem jer dogovorenog kontakta i dojave još nema. B postaje točan tek kad polubranitelj već ima kontakt i jasno je javio.

### EN why A/B
A stays with the runner because the agreed contact and call are not there yet. B becomes correct only after the half already has contact and has made the clear call.

**Critical difference:** Team-agreed takeover timing (contact+call) for releasing a runner — not close wing pass when half stuck (962), not abandon-wing reverse (973), not protect-pass + controlled help (880)

