# LW Gold Batch A — Human Review (12)

**Verdict: LW BATCH A APPROVED FOR HUMAN REVIEW**

Temporary LW total: **62** (40 legacy + 10 pilot + 12 Batch A)

| ID | familyKey | area | diff | A/D | sys | perc | risk | A/B | HR | geo |
|---|---|---|---|---|---|---|---|---|---|---|
| scn_bank_951 | `lw_lb_delay_ask_lane_blocked` | lb_cooperation | Beginner | Attack | 6-0 | true | 2 | CLEAR | PASS | PASS |
| scn_bank_952 | `lw_width_stretch_when_lb_binds` | positional_width | Beginner | Attack | 6-0 | false | 2 | CLEAR | PASS | PASS |
| scn_bank_953 | `lw_pivot_block_opens_takeoff` | pivot | Intermediate | Attack | 6-0 | true | 3 | CLEAR | PASS | PASS |
| scn_bank_954 | `lw_takeoff_lane_closed` | takeoff | Intermediate | Attack | 6-0 | true | 3 | CLEAR | PASS | PASS |
| scn_bank_955 | `lw_gk_far_side_commit` | goalkeeper | Intermediate | Attack | 6-0 | true | 3 | CLEAR | PASS | PASS |
| scn_bank_956 | `lw_gk_depth_read` | goalkeeper | Advanced | Attack | 6-0 | true | 4 | CLEAR | PASS | PASS |
| scn_bank_957 | `lw_fw_2v1_finish_or_pass` | transition_first | Intermediate | Attack | Mixed | true | 3 | CLEAR | PASS | PASS |
| scn_bank_958 | `lw_fw_arrival_timing` | transition_first | Beginner | Attack | Mixed | false | 2 | CLEAR | PASS | PASS |
| scn_bank_959 | `lw_5v6_safe_possession` | numerical | Expert | Attack | 6-0 | false | 3 | CLEAR | PASS | PASS |
| scn_bank_960 | `lw_passive_warning` | passive | Intermediate | Attack | 6-0 | true | 3 | CLEAR | PASS | PASS |
| scn_bank_961 | `lw_def_sys_60_wing_job` | system_defence | Beginner | Defence | 6-0 | false | 2 | CLEAR | PASS | PASS |
| scn_bank_962 | `lw_def_inside_help_controlled` | set_defence | Intermediate | Defence | 6-0 | true | 3 | CLEAR | PASS | PASS |

## Strongest 3
- scn_bank_951 `lw_lb_delay_ask_lane_blocked` (risk 2)
- scn_bank_952 `lw_width_stretch_when_lb_binds` (risk 2)
- scn_bank_958 `lw_fw_arrival_timing` (risk 2)

## Inspect closely (even if pass)
- scn_bank_951 `lw_lb_delay_ask_lane_blocked` (risk 2)
- scn_bank_952 `lw_width_stretch_when_lb_binds` (risk 2)
- scn_bank_953 `lw_pivot_block_opens_takeoff` (risk 3)

---

## scn_bank_951 — Left Wing — Delay the Ask When the Pass Lane Is Cut

| Field | Value |
|---|---|
| familyKey | `lw_lb_delay_ask_lane_blocked` |
| teachingArea | lb_cooperation |
| difficulty | Beginner |
| attack/defence | Attack |
| system | 6-0 |
| perception | true |
| handedness | none |
| coachRisk | 2 |
| closest RW | scn_bank_872 (opposite fork) |

### HR
**Title:** Lijevo krilo — ne traži loptu dok je pas zatvoren

**Situation:** Vodite 8:7 u 14. minuti protiv 6:0. Lijevi vanjski ima loptu i gleda tvoju stranu na devet metara. Ti si široko uz lijevu aut-liniju. Krilni branič je oba stopala i prsa okrenuo u liniju pasa između lijevog vanjskog i tebe — ako lopta sada krene, može je uzeti ili odbiti. Lijevi vanjski još nije udvojen. Glasno tražiti loptu izgleda poželjno, ali put je zatvoren.

**Question:** Linija pasa do tebe je zatvorena — što je prvo?

#### OPTIMAL
- EN: Stay wide and delay the ask until the lane opens again
- HR: Ostani široko i ne traži loptu dok se put opet ne otvori
- DE: Breit bleiben und den Ball erst fordern wenn der Weg wieder offen ist
- Feedback EN: Correct — a forced ask into a closed lane gifts the steal.
- Feedback HR: Točno — forsiranje lopte u zatvoren put poklanja krađu.
- Feedback DE: Richtig — erzwungenes Fordern in die geschlossene Linie schenkt den Ballgewinn.

#### GOOD
- EN: Ask now only if his hips reopen the lane before the left back is doubled
- HR: Traži sada samo ako mu se kukovi opet otvore prema tebi prije nego lijevog vanjskog udvoje
- DE: Jetzt nur fordern wenn seine Hüften die Linie wieder öffnen bevor der Rückraum gedoppelt wird
- Feedback EN: Valid when the lane reopens; here his body still cuts it.
- Feedback HR: Valja kad se put ponovo otvori; ovdje ga tijelo još reže.
- Feedback DE: Gültig wenn die Linie wieder aufgeht; hier schneidet sein Körper sie noch.

#### RISKY
- EN: Call loudly and step toward the ball to force the pass through his arms
- HR: Glasno zovi i kreni prema lopti da forsiraš pas kroz njegove ruke
- DE: Laut rufen und zum Ball gehen um den Pass durch seine Arme zu erzwingen
- Feedback EN: Risky — you walk into the steal.
- Feedback HR: Rizično — ideš u krađu.
- Feedback DE: Riskant — du läufst in den Ballgewinn.

#### POOR
- EN: Leave the sideline and cut in front of the left back for a short hand-off while the lane is blocked
- HR: Napusti aut-liniju i sijeci ispred lijevog vanjskog za kratku predaju dok je put blokiran
- DE: Die Seitenlinie verlassen und vor dem Rückraum für eine kurze Übergabe einschneiden während die Linie blockiert ist
- Feedback EN: Poor — you kill width and still give no clean receive.
- Feedback HR: Loše — gasiš širinu i i dalje nemaš čist prijem.
- Feedback DE: Schlecht — du löschst Breite und hast trotzdem keinen sauberen Fang.

**Explanation HR:** Čitaj: stopala i prsa krilnog braniča režu pas od lijevog vanjskog do tebe. Prvi je posao ostati široko i čekati. Tražiti loptu ima smisla tek kad se kukovi opet otvore.

**whyCorrectOverSecondBest HR:** A poštuje zatvoren put sada; B treba kukove koji se otvaraju, a to nije navedeno.

### EN
**Situation:** You lead 8:7 at 14' against 6:0. The left back has the ball facing your side at nine metres. You are wide on the left sideline. Your wing defender has both feet and his chest turned into the passing lane between the left back and you — if the ball comes now, he can steal or tip it. The left back is not doubled yet. Asking hard for the ball looks eager, but the lane is closed.

**Question:** The pass lane to you is cut — what is first?

**whyCorrectOverSecondBest:** A respects the closed lane now; B needs hips that reopen, which are not stated.

---

## scn_bank_952 — Left Wing — Stretch Wider After the Left Back Binds the Wing Defender

| Field | Value |
|---|---|
| familyKey | `lw_width_stretch_when_lb_binds` |
| teachingArea | positional_width |
| difficulty | Beginner |
| attack/defence | Attack |
| system | 6-0 |
| perception | false |
| handedness | none |
| coachRisk | 2 |
| closest RW | scn_bank_887 / 884 |

### HR
**Title:** Lijevo krilo — još se više rastegni kad lijevi vanjski veže krilnog braniča

**Situation:** Neriješeno je 9:9 u 17. minuti protiv 6:0. Lijevi vanjski je već vezao tvog krilnog braniča — kontakt je tu, a kukovi braniča ostaju na lijevom vanjskom. Ti stojiš oko metra unutra od aut-linije. Pas do tebe još je otvoren. Još više ići unutra prema borbi izgleda kao pomoć, ali lijevi vanjski treba te šire da sljedeći pas i dalje rastegne obranu.

**Question:** Lijevi vanjski je vezao krilnog braniča — gdje pripadaš?

#### OPTIMAL
- EN: Push back to the sideline and stay available wide
- HR: Vrati se na aut-liniju i ostani dostupan široko
- DE: Zurück an die Seitenlinie und breit verfügbar bleiben
- Feedback EN: Correct — after the bind, your value is the stretch, not a third body in the contact.
- Feedback HR: Točno — nakon veza tvoja je vrijednost rastezanje, ne treće tijelo u kontaktu.
- Feedback DE: Richtig — nach der Bindung ist dein Wert die Dehnung nicht ein dritter Körper im Kontakt.

#### GOOD
- EN: Step one metre inside only if the left back asks for a short angle because the wide lane is body-blocked
- HR: Uđi metar unutra samo ako lijevi vanjski traži kraći kut jer je široki pas tijelom zatvoren
- DE: Einen Meter nach innen nur wenn der Rückraum einen kurzen Winkel fordert weil die breite Linie körperlich zu ist
- Feedback EN: Valid with a blocked wide lane and a call; here the lane is open.
- Feedback HR: Valja uz zatvoren široki pas i poziv; ovdje je pas otvoren.
- Feedback DE: Gültig bei blockierter breiter Linie und Ruf; hier ist die Linie offen.

#### RISKY
- EN: Walk into the contact to “help” the left back win the duel
- HR: Uđi u kontakt da “pomogneš” lijevom vanjskom da dobije duel
- DE: In den Kontakt gehen um dem Rückraum im Duell zu “helfen”
- Feedback EN: Risky — you remove the wide outlet he just created.
- Feedback HR: Rizično — skidaš široki izlaz koji je upravo stvorio.
- Feedback DE: Riskant — du nimmst den breiten Outlet den er gerade geschaffen hat.

#### POOR
- EN: Turn your back to the ball and jog toward the centre to reset early
- HR: Okreni leđa lopti i kreni prema sredini da se prerano resetiraš
- DE: Dem Ball den Rücken drehen und zur Mitte joggen um früh neu aufzubauen
- Feedback EN: Poor — the action is live; you abandon the stretch.
- Feedback HR: Loše — akcija je živa; napuštaš rastezanje.
- Feedback DE: Schlecht — die Aktion lebt; du verlässt die Dehnung.

**Explanation HR:** Kad lijevi vanjski veže krilnog braniča a široki pas još je otvoren, rastegni se uz aut-liniju. Korak unutra samo uz zatvoren pas i jasan poziv.

**whyCorrectOverSecondBest HR:** A drži rastezanje nakon živog veza; B treba zatvoren široki pas i poziv kojih nema.

### EN
**Situation:** Tied 9:9 at 17' against 6:0. The left back has already engaged your wing defender — contact is on, and the defender’s hips stay on the left back. You are standing about a metre inside the sideline. The pass lane to you is still open. Drifting further inside toward the fight looks supportive, but the left back needs you wider so the next pass still stretches the defence.

**Question:** The left back has bound the wing defender — where do you belong?

**whyCorrectOverSecondBest:** A keeps the stretch after a live bind; B needs a blocked wide lane and a call that are absent.

---

## scn_bank_953 — Left Wing — Take Off When the Pivot Seals the Recovery

| Field | Value |
|---|---|
| familyKey | `lw_pivot_block_opens_takeoff` |
| teachingArea | pivot |
| difficulty | Intermediate |
| attack/defence | Attack |
| system | 6-0 |
| perception | true |
| handedness | none |
| coachRisk | 3 |
| closest RW | scn_bank_874 |

### HR
**Title:** Lijevo krilo — idi u odraz kad pivot drži blok na povratku braniča

**Situation:** Vodite 12:11 u 22. minuti protiv 6:0. Hvataš na lijevom krilu s kutom za šut. Pivot je zapečatio na lijevoj polovici šestice i drži put povratka krilnog braniča — branič kasni još cijeli korak do tebe. Put za odraz prema sredini sada je slobodan. Vratar se još nije opredijelio. Lijevi vanjski je pokriven.

**Question:** Pivot drži povratak braniča a put za odraz je slobodan — što je prvo?

#### OPTIMAL
- EN: Take off toward the middle now while the lane is free — then finish from the goalkeeper’s next move
- HR: Idi u odraz prema sredini sada dok je put slobodan — pa završi prema sljedećem pokretu vratara
- DE: Jetzt zur Mitte abspringen solange die Linie frei ist — dann aus der nächsten Torhüterbewegung abschließen
- Feedback EN: Correct — the seal bought you the take-off; do not waste the beat.
- Feedback HR: Točno — blok ti je kupio odraz; ne gubi taj trenutak.
- Feedback DE: Richtig — der Block hat dir den Absprung gekauft; verliere den Moment nicht.

#### GOOD
- EN: Feed the pivot only if the seal breaks and a soft short pass into him opens before you jump
- HR: Uigraj pivota samo ako se blok raspada i otvori se mekan kratki pas u njega prije odraza
- DE: Den Kreisläufer nur bedienen wenn der Block bricht und ein weicher kurzer Pass auf ihn vor dem Absprung aufgeht
- Feedback EN: Valid if the seal breaks; here it is holding and the take-off is free.
- Feedback HR: Valja ako se blok raspada; ovdje drži i odraz je slobodan.
- Feedback DE: Gültig wenn der Block bricht; hier hält er und der Absprung ist frei.

#### RISKY
- EN: Hold the ball and wait for a clearer goalkeeper shade before leaving the ground
- HR: Drži loptu i čekaj jasniji pomak vratara prije nego digneš noge
- DE: Den Ball halten und auf eine klarere Torhüterverschiebung warten bevor du abspringst
- Feedback EN: Risky — the recovering defender will close while you wait.
- Feedback HR: Rizično — branič će se vratiti dok čekaš.
- Feedback DE: Riskant — der Verteidiger kommt zurück während du wartest.

#### POOR
- EN: Bounce the ball once and look for a high lob before the take-off lane is used
- HR: Odbij loptu jednom i traži visoki lob prije nego iskoristiš put za odraz
- DE: Den Ball einmal aufsetzen und einen hohen Lob suchen bevor du die Absprunglinie nutzt
- Feedback EN: Poor — you waste the free lane the pivot created.
- Feedback HR: Loše — propuštaš slobodan put koji je pivot stvorio.
- Feedback DE: Schlecht — du verschenkst die freie Linie die der Kreisläufer geschaffen hat.

**Explanation HR:** Čitaj: pivot drži povratak krilnog braniča i odraz prema sredini je slobodan. Skoči sada; završetak kasnije prema vrataru. Uigraj pivota samo ako se blok raspada.

**whyCorrectOverSecondBest HR:** A koristi slobodan odraz koji blok otvara; B treba raspad bloka kojeg nema.

### EN
**Situation:** You lead 12:11 at 22' against 6:0. You catch on the left wing with a playable angle. Your pivot has sealed on the left half of the six and is holding the wing defender’s recovery path — the defender is still a full step late returning to you. The take-off lane toward the middle is free for this beat. The goalkeeper has not yet committed. The left back is covered.

**Question:** The pivot is holding the recovery and your take-off lane is free — what is first?

**whyCorrectOverSecondBest:** A uses the free take-off the seal creates; B needs a broken seal that is not there.

---

## scn_bank_954 — Left Wing — Recycle When the Take-Off Lane Is Closed

| Field | Value |
|---|---|
| familyKey | `lw_takeoff_lane_closed` |
| teachingArea | takeoff |
| difficulty | Intermediate |
| attack/defence | Attack |
| system | 6-0 |
| perception | true |
| handedness | none |
| coachRisk | 3 |
| closest RW | scn_bank_883 |

### HR
**Title:** Lijevo krilo — vrati loptu kad je put za odraz zatvoren

**Situation:** Neriješeno je 13:13 u 26. minuti protiv 6:0. Hvataš na lijevom krilu. Polubranitelj se već vraća u tvoj put za odraz prema sredini — manje od koraka od kontakta ako sada skočiš. Lijevi vanjski se nakon prodora oslobodio i pokazuje kratki kut za povratak. Krilni branič kasni, ali polubranitelj je zatvorio put za skok.

**Question:** Polubranitelj je u tvom putu za odraz a lijevi vanjski je slobodan — što je prvo?

#### OPTIMAL
- EN: Play the short return to the free left back and keep your width for the next action
- HR: Vrati kratku loptu slobodnom lijevom vanjskom i zadrži širinu za sljedeću akciju
- DE: Kurzen Rückpass auf den freien linken Rückraum und Breite für die nächste Aktion halten
- Feedback EN: Correct — do not jump into a body that is already in the line.
- Feedback HR: Točno — ne skači u tijelo koje je već u putu.
- Feedback DE: Richtig — spring nicht in einen Körper der schon in der Linie steht.

#### GOOD
- EN: Take off only if that recovering body is still more than a full stride outside your jump line
- HR: Idi u odraz samo ako je to tijelo još više od cijelog koraka izvan tvoje linije skoka
- DE: Nur abspringen wenn dieser Körper noch mehr als einen vollen Schritt außerhalb deiner Sprunglinie ist
- Feedback EN: Valid with distance; here he is already in the line.
- Feedback HR: Valja uz udaljenost; ovdje je već u putu.
- Feedback DE: Gültig mit Distanz; hier ist er schon in der Linie.

#### RISKY
- EN: Force the jump into his recovering arm hoping for a seven-metre
- HR: Forsiraj skok u njegovu ruku u povratku nadajući se sedmercu
- DE: Den Sprung in seinen zurückkommenden Arm erzwingen in der Hoffnung auf Siebenmeter
- Feedback EN: Risky — you often give a turnover or a soft foul, not a clean seven.
- Feedback HR: Rizično — češće dobiješ izgubljenu loptu ili mekan prekršaj, ne čist sedmerac.
- Feedback DE: Riskant — oft Ballverlust oder weiches Foul, kein sauberer Siebenmeter.

#### POOR
- EN: Turn and throw a long cross-court pass toward the far wing under pressure
- HR: Okreni se i baci dugačku loptu na drugo krilo pod pritiskom
- DE: Drehen und unter Druck einen langen Pass auf den anderen Flügel werfen
- Feedback EN: Poor — the short free return is there; the long ball is a gift.
- Feedback HR: Loše — kratki slobodan povratak je tu; duga lopta je poklon.
- Feedback DE: Schlecht — der kurze freie Rückpass ist da; der lange Ball ist ein Geschenk.

**Explanation HR:** Čitaj: polubranitelj je već u putu za odraz; lijevi vanjski je slobodan. Vrati kratko. Skači samo ako je tijelo još više od koraka vani.

**whyCorrectOverSecondBest HR:** A izbjegava zatvoren skok uz slobodan kratki povratak; B treba udaljenost koju situacija briše.

### EN
**Situation:** Tied 13:13 at 26' against 6:0. You catch on the left wing. The half defender is already recovering into your take-off line toward the middle — less than a stride from contact if you jump now. The left back has stepped free after his drive and shows a short return angle. The wing defender is late, but the half has closed the jump path.

**Question:** The half is in your take-off line and the left back is free — what is first?

**whyCorrectOverSecondBest:** A avoids the closed jump into a free short return; B needs distance that the situation removes.

---

## scn_bank_955 — Left Wing — Do Not Trust the First Goalkeeper Shade in the Air

| Field | Value |
|---|---|
| familyKey | `lw_gk_far_side_commit` |
| teachingArea | goalkeeper |
| difficulty | Intermediate |
| attack/defence | Attack |
| system | 6-0 |
| perception | true |
| handedness | none |
| coachRisk | 3 |
| closest RW | scn_bank_900 / 875 / 901 |

### HR
**Title:** Lijevo krilo — ne vjeruj prvom zatvaranju vratara dok si u zraku

**Situation:** Neriješeno je 14:14 u 29. minuti protiv 6:0. Čisto ideš u skok s lijevog krila — krilni branič kasni i ne stiže na tvoju ruku. Na početku skoka vratar dalekim stopalom i težinom kreće prema daljoj stativi. Prije nego baciš, vraća bliže stopalo prema bližoj stativi i bliža ruka ide s tim povratkom da zatvori bliži gornji kut. Daleka ruka još kasni s povratkom preko.

**Question:** Krenuo je dalje, pa se vratio bliže — što radiš s loptom?

#### OPTIMAL
- EN: Wait one beat for that recovery, then finish far and low — he is late getting back across after planting near
- HR: Pričekaj taj povratak jedan trenutak, pa završi daleko i nisko — nakon bližeg oslonca kasni s povratkom preko
- DE: Einen Moment auf diese Rückkehr warten, dann fern und tief abschließen — nach dem nahen Aufsetzen kommt er spät zurück über die Mitte
- Feedback EN: Correct — the second action cancels the first shade; finish where he is late returning.
- Feedback HR: Točno — drugi pokret briše prvo zatvaranje; završi gdje kasni s povratkom.
- Feedback DE: Richtig — die zweite Bewegung löscht die erste Verschiebung; dorthin abschließen wo er bei der Rückkehr spät ist.

#### GOOD
- EN: Early near finish only if he keeps going far and never plants the near foot back
- HR: Rani bliži završetak samo ako nastavi dalje i ne vrati bliže stopalo
- DE: Früher naher Abschluss nur wenn er fern weitergeht und den nahen Fuß nicht zurücksetzt
- Feedback EN: Valid on a full far commit; here he planted back near.
- Feedback HR: Valja uz potpuno zatvaranje daleko; ovdje se vratio bliže.
- Feedback DE: Gültig bei voller ferner Festlegung; hier ist er nah zurückgekommen.

#### RISKY
- EN: Release immediately far on the first shade without waiting for his next foot
- HR: Odmah baci daleko na prvo zatvaranje bez čekanja sljedećeg stopala
- DE: Sofort fern auf die erste Verschiebung abgeben ohne den nächsten Fuß abzuwarten
- Feedback EN: Risky — you throw into the recovery he is already making.
- Feedback HR: Rizično — bacaš u povratak koji već radi.
- Feedback DE: Riskant — du wirfst in die Rückkehr die er schon macht.

#### POOR
- EN: Smash near-high into the hand that just came with the recovery
- HR: Lupaj bliže gore u ruku koja je upravo došla s povratkom
- DE: Nah-hoch in die Hand hämmern die gerade mit der Rückkehr gekommen ist
- Feedback EN: Poor — that is exactly the recovery he completed.
- Feedback HR: Loše — to je baš povratak koji je napravio.
- Feedback DE: Schlecht — genau das ist die Rückkehr die er fertiggemacht hat.

**Explanation HR:** Prvo zatvaranje daleko nije odluka. Kasniji bliži oslonac i bliža ruka s tim povratkom pokazuju da se vratio. Završi daleko i nisko gdje kasni s povratkom. Rano bliže samo ako se daleko zatvaranje ne vrati.

**whyCorrectOverSecondBest HR:** A čita drugi pokret (bliži oslonac + bliža ruka s povratkom). B treba nastavljeno zatvaranje daleko bez tog povratka.

### EN
**Situation:** Tied 14:14 at 29' against 6:0. You leave the ground clean from the left wing — the wing defender is late and cannot reach your shooting arm. Early in the jump the goalkeeper’s far foot and weight start toward the far post. Before you release, he plants the near foot back toward the near post and the near hand comes with that recovery to cover the near high corner. The far hand is still late coming back across.

**Question:** He started far, then recovered near — what do you do with the ball?

**whyCorrectOverSecondBest:** A uses the second cue (near plant + near hand with the recovery). B needs a continued far commit without that recovery.

---

## scn_bank_956 — Left Wing — Read the Brake After the Goalkeeper Leaves Deep

| Field | Value |
|---|---|
| familyKey | `lw_gk_depth_read` |
| teachingArea | goalkeeper |
| difficulty | Advanced |
| attack/defence | Attack |
| system | 6-0 |
| perception | true |
| handedness | none |
| coachRisk | 4 |
| closest RW | scn_bank_898 (continuous attack→lift) and 900 (near commit→far); not 897 |

### HR
**Title:** Lijevo krilo — pročitaj kočenje vratara nakon što izađe iz dubine

**Situation:** Vodite 16:15 u 33. minuti protiv 6:0. Čisto ideš u skok s lijevog krila — krilni branič još je van tvoje ruke. Na startu skoka vratar je duboko na crti. Usred skoka kreće naprijed prema tebi. Onda koči: bliže stopalo ide šire, težina pada na tu bližu nogu, a bliža ruka ide dolje da zatvori bliži donji kut. Daleka ruka još kasni s dolaskom preko. Ne nastavlja u tvoje tijelo.

**Question:** Izašao je iz dubine, pa kočio s težinom bliže i bližom rukom dolje — gdje završavaš?

#### OPTIMAL
- EN: Finish far and high — he is stuck on the near plant with the near hand down and cannot recover across in time
- HR: Završi daleko i gore — zaglavljen je na bližem osloncu s bližom rukom dolje i ne stiže se vratiti preko
- DE: Fern und hoch abschließen — er hängt am nahen Aufsetzen mit naher Hand unten und kommt nicht rechtzeitig zurück über die Mitte
- Feedback EN: Correct — depth change plus the brake body cue: near load and near hand down leave him late to the far-high side.
- Feedback HR: Točno — promjena dubine plus kočenje: težina bliže i bliža ruka dolje ostavljaju ga kasnog za daleko i gore.
- Feedback DE: Richtig — Tiefenwechsel plus Abbrems-Körperzeichen: nahe Last und nahe Hand unten machen ihn spät zur fern-hohen Seite.

#### GOOD
- EN: Soft lift over only if he keeps driving into your body with both hands rising and never plants that near foot wide
- HR: Meko podigni preko samo ako nastavi ići u tvoje tijelo s obje ruke gore i ne stavi bliže stopalo šire
- DE: Weich darüber heben nur wenn er mit beiden Händen oben weiter in deinen Körper kommt und den nahen Fuß nicht breit setzt
- Feedback EN: Valid on a continuous step-out; here he braked with near load and near hand down.
- Feedback HR: Valja uz kontinuirani izlazak; ovdje je kočio s težinom bliže i bližom rukom dolje.
- Feedback DE: Gültig bei durchgehendem Herauskommen; hier hat er nah belastet mit naher Hand unten abgebremst.

#### RISKY
- EN: Keep carrying late as if he is still deep on the line after he has already stepped and braked
- HR: Nastavi nositi kasno kao da je još duboko na crti iako je već izašao i kočio
- DE: Weiter spät tragen als stünde er noch tief auf der Linie obwohl er schon herausgekommen und abgebremst hat
- Feedback EN: Risky — that is the deep-line timing after the depth and body cue have already changed.
- Feedback HR: Rizično — to je čekanje kao na dubokoj crti nakon što su se dubina i tijelo već promijenili.
- Feedback DE: Riskant — das ist Timing für die tiefe Linie nachdem Tiefe und Körper schon gewechselt haben.

#### POOR
- EN: Smash hard through mid-height into the body he just brought forward
- HR: Lupaj jako kroz sredinu u tijelo koje je upravo doveo naprijed
- DE: Hart durch die Mitte in den Körper hämmern den er gerade nach vorne gebracht hat
- Feedback EN: Poor — the forward brake reduced that central path; you attack his body.
- Feedback HR: Loše — kočenjem naprijed smanjio je taj središnji put; udaraš u tijelo.
- Feedback DE: Schlecht — durch das Abbremsen vorne ist dieser Mittelweg kleiner; du greifst seinen Körper an.

**Explanation HR:** Čitaj dva pokreta: izlazi iz dubine, pa koči s težinom na bližem osloncu i bližom rukom dolje. Završi daleko i gore gdje kasni s povratkom. Meko podigni samo ako izlazak ne koči. Nemoj čekati kao da je ostao duboko.

**whyCorrectOverSecondBest HR:** A čita promjenu dubine plus kočenje (bliži oslonac + bliža ruka dolje). B treba kontinuirani ulazak u tijelo bez tog kočenja.

### EN
**Situation:** You lead 16:15 at 33' against 6:0. You leave the ground clean from the left wing — the wing defender is still outside your shooting arm. At jump start the goalkeeper is deep on the line. Mid-jump he attacks forward toward you. Then he brakes: the near foot plants wider, his weight dumps onto that near leg, and the near hand drops to cover the near low corner. The far hand is still late coming across. He is not continuing into your body.

**Question:** He left deep, then braked loaded near with the near hand down — where do you finish?

**whyCorrectOverSecondBest:** A uses depth change plus the brake body cue (near plant + near hand down). B needs a continuous drive into the body without that brake.

---

## scn_bank_957 — Left Wing — First Wave 2v1: Finish When the Defender Takes Your Teammate

| Field | Value |
|---|---|
| familyKey | `lw_fw_2v1_finish_or_pass` |
| teachingArea | transition_first |
| difficulty | Intermediate |
| attack/defence | Attack |
| system | Mixed |
| perception | true |
| handedness | none |
| coachRisk | 3 |
| closest RW | scn_bank_902 (different fork — stay as pass option) |

### HR
**Title:** Lijevo krilo — prvi val 2v1: završi kad branič ide na suigrača

**Situation:** Neriješeno je 10:10 u 19. minuti u prvom valu 2v1. Srednji vanjski ima loptu u sredini. Ti sprintaš široko lijevo prema šestici. Jedan branič u povratku je između vas. Prsa i prvi koraci potpuno su na srednjeg vanjskog — opredijelio se na loptu. Tvoj put do šestice slobodan je za pas i brz završetak.

**Question:** Branič se opredijelio na suigrača — što je tvoj posao?

#### OPTIMAL
- EN: Demand the ball and finish — he has left you
- HR: Traži loptu i završi — ostavio te je
- DE: Den Ball fordern und abschließen — er hat dich verlassen
- Feedback EN: Correct — when he takes the ball carrier, the extra pass ends with your finish.
- Feedback HR: Točno — kad uzme vodiča lopte, dodatni pas završava tvojim šutom.
- Feedback DE: Richtig — nimmt er den Ballführer, endet der Extra-Pass mit deinem Abschluss.

#### GOOD
- EN: Give the extra pass back / stay as decoy only if he switches and commits onto you before the pass arrives
- HR: Vrati dodatni pas / ostani mamac samo ako prebaci i krene na tebe prije nego pas stigne
- DE: Den Extra-Pass zurück / als Köder bleiben nur wenn er vor dem Pass auf dich umschaltet
- Feedback EN: Valid if he switches onto you; here he is committed to the centre back.
- Feedback HR: Valja ako prebaci na tebe; ovdje je na srednjem vanjskom.
- Feedback DE: Gültig wenn er auf dich umschaltet; hier ist er am Rückraum Mitte.

#### RISKY
- EN: Stop your run and wait at nine metres for a set attack to form
- HR: Zaustavi trčanje i čekaj na devet metara da se složi pozicijski napad
- DE: Den Lauf stoppen und auf neun Metern warten bis der Positionsangriff entsteht
- Feedback EN: Risky — you kill a live 2v1.
- Feedback HR: Rizično — gasiš živ 2v1.
- Feedback DE: Riskant — du löschst ein lebendiges 2v1.

#### POOR
- EN: Cut into the middle and ask for the ball in the same space as the centre back
- HR: Sijeci u sredinu i traži loptu u istom prostoru sa srednjim vanjskim
- DE: In die Mitte schneiden und den Ball im selben Raum wie der Rückraum Mitte fordern
- Feedback EN: Poor — you crowd the carrier he already chose to stop.
- Feedback HR: Loše — gužvaš vodiča kojeg je branič već izabrao zaustaviti.
- Feedback DE: Schlecht — du verdichtest den Ballführer den der Verteidiger schon stoppen will.

**Explanation HR:** Čitaj: jedini branič u povratku ide na vodiča lopte. Tvoj je posao završiti nakon pasa. Dodatni pas / mamac samo ako prebaci na tebe.

**whyCorrectOverSecondBest HR:** A završava 2v1 nakon što je otišao na suigrača; B treba prebacivanje na tebe koje se nije dogodilo.

### EN
**Situation:** Tied 10:10 at 19' in a first-wave 2v1. Your centre back has the ball in the middle. You are sprinting wide on the left toward six metres. One recovering defender is between you. His chest and first steps turn fully onto the centre back — he has committed to the ball. Your path to six is free for the pass and a quick finish.

**Question:** The defender has committed to your teammate — what is your job?

**whyCorrectOverSecondBest:** A finishes the 2v1 after his commit to the teammate; B needs a switch onto you that has not happened.

---

## scn_bank_958 — Left Wing — Arrive With the Catch on the Six

| Field | Value |
|---|---|
| familyKey | `lw_fw_arrival_timing` |
| teachingArea | transition_first |
| difficulty | Beginner |
| attack/defence | Attack |
| system | Mixed |
| perception | false |
| handedness | none |
| coachRisk | 2 |
| closest RW | related transition timing; not 902/876 |

### HR
**Title:** Lijevo krilo — stigni s hvatanjem na šesticu

**Situation:** Neriješeno je 3:3 u 8. minuti nakon krađe. Prva lopta ide u tvoju lijevu krilnu stazu. Jedan branič u povratku je između tebe i šestice, ali još ne pritišće tvoje ruke. Ako staneš na devet metara i čekaš loptu, hvataš prerano. Ako sprintaš preko mjesta hvatanja, lopta stiže iza tebe.

**Question:** Kako podesiš tempo trčanja u prvom valu?

#### OPTIMAL
- EN: Sprint so the catch and your arrival at six metres happen together
- HR: Sprintaj tako da hvatanje i dolazak na šesticu budu u istom trenutku
- DE: So sprinten dass Fang und Ankunft auf der Sechs zusammenfallen
- Feedback EN: Correct — first-wave value is arrival with the ball, not early waiting.
- Feedback HR: Točno — vrijednost prvog vala je dolazak s loptom, ne rano čekanje.
- Feedback DE: Richtig — Wert der ersten Welle ist Ankunft mit Ball nicht frühes Warten.

#### GOOD
- EN: Secure an early catch and short return only if a defender is already on your hands before six
- HR: Rano uhvati i kratko vrati samo ako ti je branič već na rukama prije šestice
- DE: Früh sichern und kurz zurück nur wenn vor der Sechs schon ein Verteidiger an deinen Händen ist
- Feedback EN: Valid under hand pressure; here he is not pressing your hands yet.
- Feedback HR: Valja pod pritiskom na rukama; ovdje još ne pritišće ruke.
- Feedback DE: Gültig unter Handdruck; hier drückt er deine Hände noch nicht.

#### RISKY
- EN: Stop at the nine and call for the ball early so you can set your feet
- HR: Stani na devetku i rano zovi loptu da namjestiš stopala
- DE: Auf der Neun stoppen und den Ball früh rufen um die Füße zu setzen
- Feedback EN: Risky — you catch too high and lose the six-metre finish.
- Feedback HR: Rizično — hvataš previsoko i gubiš završetak sa šestice.
- Feedback DE: Riskant — du fängst zu hoch und verlierst den Sechs-Meter-Abschluss.

#### POOR
- EN: Jog and let the ball bounce first so you can judge the bounce
- HR: Trči polako i pusti da lopta prvo odskoči da procijeniš odskok
- DE: Joggen und den Ball erst aufkommen lassen um den Absprung zu lesen
- Feedback EN: Poor — the first wave dies in your hands.
- Feedback HR: Loše — prvi val umire u tvojim rukama.
- Feedback DE: Schlecht — die erste Welle stirbt in deinen Händen.

**Explanation HR:** Princip tempa u prvom valu: hvatanje i dolazak na šesticu zajedno. Rano uhvatiti i vratiti samo ako su ruke već pod pritiskom.

**whyCorrectOverSecondBest HR:** A usklađuje dolazak s hvatanjem; B treba pritisak na rukama prije šestice koji nije naveden.

### EN
**Situation:** Tied 3:3 at 8' after a steal. The outlet is coming to your left wing lane. One recovering defender is between you and the six-metre line, but he is not yet pressing your hands. If you stop at nine metres and wait for the ball, you catch too early. If you sprint past the catch spot, the ball arrives behind you.

**Question:** How do you time the first-wave run?

**whyCorrectOverSecondBest:** A times arrival with the catch; B needs hand pressure before six that is not stated.

---

## scn_bank_959 — Left Wing — 5v6: Hold Width, Do Not Force the Corner

| Field | Value |
|---|---|
| familyKey | `lw_5v6_safe_possession` |
| teachingArea | numerical |
| difficulty | Expert |
| attack/defence | Attack |
| system | 6-0 |
| perception | false |
| handedness | none |
| coachRisk | 3 |
| closest RW | scn_bank_910 |

### HR
**Title:** Lijevo krilo — 5v6: drži širinu, ne forsiraj kut

**Situation:** Gubite 18:19 u 41. minuti u igraču manje nakon vlastitog isključenja — napad 5v6. Ti si na lijevom krilu. Obrana je složena. Krilni branič je na tebi a odraz prema sredini je pokriven. Lijevi vanjski te još može koristiti kao siguran izlaz. Forsirati šut iz kuta ili ulazak napamet poklonilo bi lak kontranapad dok ste već u igraču manje.

**Question:** U igraču manje, pokriven na krilu — što je prvo?

#### OPTIMAL
- EN: Stay wide as the safe release and refuse the forced corner action
- HR: Ostani široko kao siguran izlaz i odbij forsiranu akciju iz kuta
- DE: Breit als sicherer Outlet bleiben und die erzwungene Eckenaktion ablehnen
- Feedback EN: Correct — in 5v6 the wing’s first job is not to donate the next counter.
- Feedback HR: Točno — u 5v6 prvi posao krila nije pokloniti sljedeći kontranapad.
- Feedback DE: Richtig — in 5v6 ist die erste Flügelaufgabe nicht den nächsten Gegenstoß zu schenken.

#### GOOD
- EN: Finish only if the take-off is clearly free with no recovering contest at all
- HR: Završi samo ako je odraz jasno slobodan bez ikakvog povratka braniča
- DE: Nur abschließen wenn der Absprung klar frei ist ohne jede Rückkehr
- Feedback EN: Valid with a truly free finish; here the take-off is covered.
- Feedback HR: Valja uz stvarno slobodan završetak; ovdje je odraz pokriven.
- Feedback DE: Gültig bei wirklich freiem Abschluss; hier ist der Absprung zugestellt.

#### RISKY
- EN: Force the wing shot through the recovering body to “create” something
- HR: Forsiraj krilni šut kroz tijelo u povratku da “stvoriš” nešto
- DE: Den Flügelwurf durch den zurückkommenden Körper erzwingen um etwas zu “kreieren”
- Feedback EN: Risky — short-handed turnovers become easy goals the other way.
- Feedback HR: Rizično — izgubljene lopte u igraču manje postaju laki golovi u drugu stranu.
- Feedback DE: Riskant — Ballverluste in Unterzahl werden leichte Tore andersherum.

#### POOR
- EN: Enter as a second pivot into a crowded left six while short-handed
- HR: Uđi kao drugi pivot u zbijenu lijevu šesticu dok ste u igraču manje
- DE: Als zweiter Kreisläufer in die verdichtete linke Sechs einlaufen während Unterzahl herrscht
- Feedback EN: Poor — you remove the release and add traffic with no extra attacker.
- Feedback HR: Loše — skidaš izlaz i dodaješ gužvu bez igrača više.
- Feedback DE: Schlecht — du nimmst den Outlet und verdichtest ohne Überzahl.

**Explanation HR:** Princip rizika u 5v6: pokriveno krilo znači držati širinu kao siguran izlaz. Završiti samo ako je odraz stvarno slobodan.

**whyCorrectOverSecondBest HR:** A čuva posjed dok si pokriven; B treba slobodan odraz koji situacija briše.

### EN
**Situation:** You trail 18:19 at 41' while short-handed after your own exclusion — 5v6 attack. You are on the left wing. The defence is set. Your wing defender is home on you and the take-off toward the middle is covered. The left back can still use you as a safe release. Forcing a corner shot or a speculative entry would gift an easy counter while you are already down a player.

**Question:** Short-handed, covered on the wing — what is first?

**whyCorrectOverSecondBest:** A protects possession while covered; B needs a free take-off the situation removes.

---

## scn_bank_960 — Left Wing — Passive Warning: Finish the Clear Wing Lane

| Field | Value |
|---|---|
| familyKey | `lw_passive_warning` |
| teachingArea | passive |
| difficulty | Intermediate |
| attack/defence | Attack |
| system | 6-0 |
| perception | true |
| handedness | none |
| coachRisk | 3 |
| closest RW | scn_bank_923 / 924 |

### HR
**Title:** Lijevo krilo — upozorenje na pasivnu: završi dok je krilo otvoreno

**Situation:** Neriješeno je 17:17 u 37. minuti uz upozorenje na pasivnu igru. Hvataš na lijevom krilu. Krilni branič kasni cijeli korak u povratku — odraz prema sredini je čist i lijevi vanjski nema boljeg slobodnog čovjeka unutra. Na upozorenju još ima vremena za jedan čist kraj. Ponovno vrtjeti loptu potrošilo bi otvoreno krilo.

**Question:** Upozorenje na pasivnu i otvoreno krilo — što je prvo?

#### OPTIMAL
- EN: Take off and finish now through the clear wing lane
- HR: Idi u odraz i završi sada dok je krilo otvoreno
- DE: Abspringen und jetzt durch den offenen Flügel abschließen
- Feedback EN: Correct — passive needs a real end; the clear lane is that end.
- Feedback HR: Točno — pasivna traži pravi kraj; otvoreno krilo je taj kraj.
- Feedback DE: Richtig — Passiv braucht ein echtes Ende; der offene Flügel ist dieses Ende.

#### GOOD
- EN: Immediate short return only if the wing lane is closed and there is still time for one inside action
- HR: Odmah kratko vrati samo ako je krilo zatvoreno i još ima vremena za jednu unutarnju akciju
- DE: Sofort kurz zurück nur wenn der Flügel zu ist und noch Zeit für eine Innenaktion bleibt
- Feedback EN: Valid when the lane is closed; here it is clear.
- Feedback HR: Valja kad je krilo zatvoreno; ovdje je otvoreno.
- Feedback DE: Gültig wenn der Flügel zu ist; hier ist er offen.

#### RISKY
- EN: Swing one more full circuit looking for a prettier shot
- HR: Odigraj još jedan puni krug tražeći ljepši šut
- DE: Noch einen vollen Kreis spielen und einen schöneren Wurf suchen
- Feedback EN: Risky — the warning ends while you decorate.
- Feedback HR: Rizično — upozorenje istječe dok ukrašavaš.
- Feedback DE: Riskant — die Warnung endet während du verzierst.

#### POOR
- EN: Hold the ball in the corner until the referee calls passive
- HR: Drži loptu u kutu dok sudac ne dosudi pasivnu
- DE: Den Ball in der Ecke halten bis der Schiedsrichter Passiv gibt
- Feedback EN: Poor — you waste a clear finish on purpose.
- Feedback HR: Loše — namjerno propuštaš čist završetak.
- Feedback DE: Schlecht — du verschenkst absichtlich einen klaren Abschluss.

**Explanation HR:** Čitaj uz pasivnu: krilo/odraz otvoren. Završi sada. Kratko vrati samo ako je zatvoreno uz vrijeme za još jednu unutarnju akciju.

**whyCorrectOverSecondBest HR:** A zatvara upozorenje kroz otvoreno krilo; B treba zatvoreno krilo koje nije navedeno.

### EN
**Situation:** Tied 17:17 at 37' with a passive-play warning. You catch on the left wing. Your wing defender is a full step late returning — the take-off toward the middle is clear and the left back has no better free man inside. There is still time on the warning for one clean end. Swinging the ball again would waste the open wing.

**Question:** Passive warning and a clear wing lane — what is first?

**whyCorrectOverSecondBest:** A ends the warning through the clear lane; B needs a closed lane that is not stated.

---

## scn_bank_961 — Left Wing — Defence: Your First Job Is Their Wing

| Field | Value |
|---|---|
| familyKey | `lw_def_sys_60_wing_job` |
| teachingArea | system_defence |
| difficulty | Beginner |
| attack/defence | Defence |
| system | 6-0 |
| perception | false |
| handedness | none |
| coachRisk | 2 |
| closest RW | foundation behind 880, not same expert protect |

### HR
**Title:** Lijevo krilo — obrana: prvi ti je posao njihovo krilo

**Situation:** Vodite 7:6 u 12. minuti u vašoj 6:0. Braniš lijevo krilo. Lopta je na desnoj vanjskoj strani. Njihovo desno krilo — tvoj čovjek — još je široko uz aut-liniju. Nitko nije zvao preuzimanje. Trčati prema dalekoj lopti izgleda radno, ali tvoja prva odgovornost se nije pomaknula.

**Question:** Lopta je daleko a tvoje krilo još je široko — što je prvo?

#### OPTIMAL
- EN: Stay with their wing — that is your first job in 6:0
- HR: Ostani na njihovom krilu — to ti je prvi posao u 6:0
- DE: Beim gegnerischen Flügel bleiben — das ist dein erster Job in der 6:0
- Feedback EN: Correct — freelancing to a far ball leaves your man.
- Feedback HR: Točno — trčanje na daleku loptu ostavlja tvog čovjeka.
- Feedback DE: Richtig — Freilaufen zum fernen Ball lässt deinen Mann.

#### GOOD
- EN: Help inside only after your half clearly takes their wing by contact and call
- HR: Pomogni unutra samo kad polubranitelj jasno preuzme njihovo krilo kontaktom i glasom
- DE: Nur innen helfen wenn dein Halber ihren Flügel klar per Kontakt und Ruf übernimmt
- Feedback EN: Valid after a real takeover; none is stated.
- Feedback HR: Valja nakon pravog preuzimanja; ništa takvo nije navedeno.
- Feedback DE: Gültig nach echter Übernahme; nichts dergleichen ist genannt.

#### RISKY
- EN: Sprint toward the far ball to show effort while their wing stays free behind you
- HR: Sprintaj prema dalekoj lopti da pokažeš trud dok njihovo krilo ostaje slobodno iza tebe
- DE: Zum fernen Ball sprinten um Einsatz zu zeigen während ihr Flügel hinter dir frei bleibt
- Feedback EN: Risky — the skip to your man becomes easy.
- Feedback HR: Rizično — duga lopta na tvog čovjeka postaje laka.
- Feedback DE: Riskant — der Skip auf deinen Mann wird leicht.

#### POOR
- EN: Drop two metres toward the corner with no one to mark and watch the game
- HR: Ispusti se dva metra prema kutu bez čovjeka na sebi i gledaj utakmicu
- DE: Zwei Meter zur Ecke ohne Gegenspieler fallen und zuschauen
- Feedback EN: Poor — you defend nobody and help nobody.
- Feedback HR: Loše — ne braniš nikoga i ne pomažeš nikome.
- Feedback DE: Schlecht — du verteidigst niemanden und hilfst niemandem.

**Explanation HR:** Princip odgovornosti krila u 6:0: prvi je posao njihovo krilo dok nema pravog preuzimanja. Trčanje na daleku loptu je samostalan izlet.

**whyCorrectOverSecondBest HR:** A drži osnovni posao na krilu; B treba preuzimanje polubranitelja kojeg nema.

### EN
**Situation:** You lead 7:6 at 12' in your 6:0. You defend the left-side wing. The ball is on the far right backcourt. Their right wing — your man — is still wide near the sideline. Nobody has called a handover. Chasing toward the far ball looks busy, but your first responsibility has not moved.

**Question:** Ball is far and your wing is still wide — what is first?

**whyCorrectOverSecondBest:** A keeps the basic wing job; B needs a half takeover that is absent.

---

## scn_bank_962 — Left Wing — Defence: Close the Wing Pass When Your Half Is Removed

| Field | Value |
|---|---|
| familyKey | `lw_def_inside_help_controlled` |
| teachingArea | set_defence |
| difficulty | Intermediate |
| attack/defence | Defence |
| system | 6-0 |
| perception | true |
| handedness | none |
| coachRisk | 3 |
| closest RW | scn_bank_880 |

### HR
**Title:** Lijevo krilo — obrana: zatvori dodavanje na krilo kad ti polubranitelj nestane

**Situation:** Neriješeno je 11:11 u 24. minuti u vašoj 6:0. Braniš lijevo krilo. Njihov desni vanjski ima loptu i već je povukao tvog polubranitelja unutra — polubranitelj je zaglavio na tom prodoru i ne može doći na tvoje krilo. Njihovo desno krilo još je široko. Desni vanjski okreće prsa i ramena prema aut-liniji i gleda to krilo. Ako skočiš na prodor, dodavanje na krilo je slobodno.

**Question:** Polubranitelj je zaglavio unutra a desni vanjski gleda krilo — što je prvo?

#### OPTIMAL
- EN: Set yourself in the passing lane to their right wing and close that pass with body position and arms
- HR: Postavi se u liniju dodavanja prema njihovom desnom krilu i zatvori dodavanje položajem tijela i rukama
- DE: Stell dich in die Passlinie zu ihrem Rechtsaußen und schließe den Pass mit Körperposition und Armen
- Feedback EN: Correct — with the half removed, your first job is the wing pass he is looking for.
- Feedback HR: Točno — kad polubranitelja nema, prvi ti je posao dodavanje na krilo koje on traži.
- Feedback DE: Richtig — ist der Halbe weg ist dein erster Job der Flügelpass den er sucht.

#### GOOD
- EN: Jump the drive only if his chest stays toward the middle and the wing does not present for the pass
- HR: Skoči na prodor samo ako mu prsa ostanu prema sredini a krilo se ne nudi za dodavanje
- DE: Nur in den Durchbruch springen wenn die Brust zur Mitte bleibt und der Flügel sich nicht für den Pass anbietet
- Feedback EN: Valid when the wing pass is not live; here he turns to the wing.
- Feedback HR: Valja kad krilo ne traži loptu; ovdje se okreće na krilo.
- Feedback DE: Gültig wenn der Flügelpass nicht lebt; hier dreht er zum Flügel.

#### RISKY
- EN: Chase the right back into the middle because the drive looks more dangerous
- HR: Juri desnog vanjskog u sredinu jer prodor izgleda opasnije
- DE: Den rechten Rückraum in die Mitte jagen weil der Durchbruch gefährlicher wirkt
- Feedback EN: Risky — you gift the pass he is already looking for.
- Feedback HR: Rizično — poklanjaš dodavanje koje već traži.
- Feedback DE: Riskant — du schenkst den Pass den er schon sucht.

#### POOR
- EN: Drop to the corner and wait to see who receives after the pass is gone
- HR: Padni u kut i čekaj tko će primiti nakon što dodavanje ode
- DE: Zur Ecke fallen und warten wer fängt nachdem der Pass weg ist
- Feedback EN: Poor — you defend after the damage.
- Feedback HR: Loše — braniš nakon štete.
- Feedback DE: Schlecht — du verteidigst nach dem Schaden.

**Explanation HR:** Čitaj: polubranitelj zaglavljen unutra + prsa i ramena desnog vanjskog prema krilu. Prva akcija je zatvoriti to dodavanje tijelom i rukama. Skoči na prodor samo ako se krilo ne nudi za dodavanje.

**whyCorrectOverSecondBest HR:** A zatvara dodavanje na krilo kad polubranitelja nema; B treba prodor prema sredini uz krilo koje se ne nudi za dodavanje.

### EN
**Situation:** Tied 11:11 at 24' in your 6:0. You defend left wing. Their right back has the ball and has already pulled your half defender inside — the half is stuck on that drive and cannot come to your wing. Their right wing is still wide. The right back turns his chest and shoulders toward the sideline and looks at that wing. If you jump into the drive, the pass to the wing is free.

**Question:** Your half is stuck inside and the right back looks wing — what is first?

**whyCorrectOverSecondBest:** A closes the live wing pass after the half is removed; B needs a middle-facing drive with a wing that does not present for the pass.

