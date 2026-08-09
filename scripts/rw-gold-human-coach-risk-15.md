# Right Wing Gold Bank — Human Coach Risk Audit (15)

**Status:** AUDIT ONLY — no production changes.

Audited all **70** scenarios (`scn_bank_871`–`scn_bank_940`). Selected **15** highest combined human-review risk.

## Selected 15 (risk order)

| Rank | ID | familyKey | Risk | Recommendation |
|---:|---|---|---:|---|
| 1 | scn_bank_915 | rw_opp_empty_goal_quick_finish | 10 | TACTICAL REWRITE |
| 2 | scn_bank_901 | rw_gk_near_arm_high | 9.5 | TACTICAL REWRITE |
| 3 | scn_bank_902 | rw_trans_2v1_finish_lane | 9.5 | TACTICAL REWRITE |
| 4 | scn_bank_903 | rw_trans_finish_before_recovery | 9.5 | TACTICAL REWRITE |
| 5 | scn_bank_912 | rw_7v6_extra_attacker_space | 9 | TACTICAL REWRITE |
| 6 | scn_bank_914 | rw_empty_own_goal_clean_finish | 9 | TACTICAL REWRITE |
| 7 | scn_bank_917 | rw_after_rb_two_finish | 9 | REMOVE / MERGE |
| 8 | scn_bank_909 | rw_6v5_recycle_when_covered | 8.5 | TACTICAL REWRITE |
| 9 | scn_bank_913 | rw_7v6_no_force_covered | 8.5 | REMOVE / MERGE |
| 10 | scn_bank_910 | rw_5v6_safe_width | 8.5 | POLISH |
| 11 | scn_bank_911 | rw_5v6_no_force_corner | 8.5 | REMOVE / MERGE |
| 12 | scn_bank_906 | rw_trans_stop_forcing | 8 | REMOVE / MERGE |
| 13 | scn_bank_908 | rw_trans_second_wave_width_hold | 8 | REMOVE / MERGE |
| 14 | scn_bank_878 | rw_6v5_free_finish | 8 | POLISH |
| 15 | scn_bank_940 | rw_15_punish_high_wing_def | 7.5 | POLISH |

---

## Rank 1: scn_bank_915 — rw_opp_empty_goal_quick_finish

- **Difficulty (labeled):** Expert
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 10/10
- **Coach test:** NO
- **Recommendation:** TACTICAL REWRITE

### MAIN RISK
Opponent empty-goal situation uses the same “finish the available side the goalkeeper leaves” answer template as filled-goal scenarios — there is no goalkeeper to leave a side.

### TACTICAL REALISM
Empty opponent goal is real, but the optimal answer and explanation ignore that the goal is empty and recycle generic GK-side finishing language.

### RW SPECIFICITY
YES — wing transition to empty goal is RW-relevant, but teaching content is destroyed by the wrong answer frame.

### GEOMETRY
Lane is free; no defender between RW and goal. Clear. The failure is answer/GK logic, not spacing.

### GOALKEEPER LOGIC
FAIL — answer refers to “available side of goal” from GK when opponent GK is not in goal.

### HR LANGUAGE
> Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim

In an empty-goal counter this is nonsense: there is no vratar leaving a side. Also the shared template explanation “Čitaj konkretnu geometriju…” does not mention empty goal at all.

### A VS B
B (“return if defender closes”) is irrelevant when no defender is near and the goal is empty. A vs B is fake competition from a recycled ladder.

### DIFFICULTY
Labeled Expert; real decision is Beginner/Intermediate once empty goal is seen. Inflated.

### PERCEPTION
NO — situation already states free path and empty goal; question restates freedom.

### DUPLICATION RISK
Member of Part C finish-template cluster (same A/B/C/D/explanation as 901/902/903/912/914/917).

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat trail 23:22 at 46. minutes. Protivnički goalkeeper kasni s povratkom nakon izmjene, a njihov goal je prazan. Nakon osvajanja lopte trčiš desno i dobivaš precizno dodavanje ispred sebe; izmeđat tebe i goala nema braniča, dok se najbliži vraća prema sredini. Imaš čist put do linije šest metara, ali svaki dodatni korak daje goalkeeperat vrijeme da uđe at goal.
- **Question:** Their goal is empty and you are free on the wing — what do you do?
- **A:** Take off immediately and finish from the available side of goal
- **B:** Return the ball only if the defender closes the take-off before you jump
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Take off immediately and finish from the available side of goal
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Gubite 23:22 u 46. minuti. Protivnički vratar kasni s povratkom nakon izmjene, a njihov gol je prazan. Nakon osvajanja lopte trčiš desno i dobivaš precizno dodavanje ispred sebe; između tebe i gola nema braniča, dok se najbliži vraća prema sredini. Imaš čist put do linije šest metara, ali svaki dodatni korak daje vrataru vrijeme da uđe u gol.
- **Question:** Njihov gol je prazan i ti si slobodan na krilu — što radiš?
- **A:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **B:** Vrati loptu samo ako branič zatvori odraz prije skoka
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr liegt zurück 23:22 u 46. Minute. Protivnički Torhüter kasni s povratkom nakon izmjene, a njihov Tor je prazan. Nakon osvajanja lopte trčiš desno i dobivaš precizno dodavanje ispred sebe; između tebe i Tora nema braniča, dok se najbliži vraća prema sredini. Imaš čist put do linije šest metara, ali svaki dodatni korak daje Torhüteru vrijeme da uđe u Tor.
- **Question:** Ihr Tor ist leer und du bist frei am Flügel — was tust du?
- **A:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **B:** Nur zurückspielen, wenn der Verteidiger den Absprung vor dem Sprung schließt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 2: scn_bank_901 — rw_gk_near_arm_high

- **Difficulty (labeled):** Intermediate
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** BORDERLINE
- **Risk score:** 9.5/10
- **Coach test:** NO
- **Recommendation:** TACTICAL REWRITE

### MAIN RISK
Part C rebuild stub residue: identical answer ladder and stock explanation reused across many families; EN text corrupted.

### TACTICAL REALISM
Near-arm-high GK cue can be real, but A is vague (“available side”) and does not force a concrete finish decision from that cue.

### RW SPECIFICITY
BORDERLINE — wing take-off present, but answers are generic finisher language.

### GEOMETRY
RB binds wing defender; take-off toward middle; GK near arm high — workable, but A does not specify under/near-shoulder vs far side.

### GOALKEEPER LOGIC
Weak — high near arm should suggest a specific zone; “available side” is quiz-safe vagueness.

### HR LANGUAGE
> Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

Stock coach-bot explanation reused verbatim across Part C. Not situation-specific; “signal” as abstract noun is not natural training talk here.

### A VS B
B is a conditional from another family (“return if defender closes”) not motivated as second-best for this GK cue.

### DIFFICULTY
Intermediate OK if rewritten; currently plays as comprehension of a vague A.

### PERCEPTION
BORDERLINE — GK arm is a real cue, but question almost answers itself and A stays non-specific.

### DUPLICATION RISK
Exact A/B/C/D + explanation twin of 902,903,912,914,915,917.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 9:8 at 18. minutes protiv 6:0. Desni vanjski veže krilnog braniča korak unutra, a ball ti dolazi at desni kut dok još imaš put za take-off prema sredini. Prije take-offa goalkeeper podiže bližat rukat visoko uz prvat stativat i bližim ramenom već zatvara gornji bliži kut. Druga stativa ostaje dalje od njegove ruke; branič kasni i ne može ti doći do ramena.
- **Question:** Where do you finish when the goalkeeper’s near arm stays high before take-off?
- **A:** Take off immediately and finish from the available side of goal
- **B:** Return the ball only if the defender closes the take-off before you jump
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Take off immediately and finish from the available side of goal
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 9:8 u 18. minuti protiv 6:0. Desni vanjski veže krilnog braniča korak unutra, a lopta ti dolazi u desni kut dok još imaš put za odraz prema sredini. Prije odraza vratar podiže bližu ruku visoko uz prvu stativu i bližim ramenom već zatvara gornji bliži kut. Druga stativa ostaje dalje od njegove ruke; branič kasni i ne može ti doći do ramena.
- **Question:** Kamo završavaš kad vratarova bliža ruka ostane visoko prije odraza?
- **A:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **B:** Vrati loptu samo ako branič zatvori odraz prije skoka
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 9:8 u 18. Minute protiv 6:0. Desni vanjski veže krilnog braniča korak unutra, a Ball ti dolazi u desni kut dok još imaš put za Absprung prema sredini. Prije Absprunga Torhüter podiže bližu ruku visoko uz prvu stativu i bližim ramenom već zatvara gornji bliži kut. Druga stativa ostaje dalje od njegove ruke; branič kasni i ne može ti doći do ramena.
- **Question:** Wohin schließt du ab wenn der nahe Torhüterarm vor dem Absprung hoch bleibt?
- **A:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **B:** Nur zurückspielen, wenn der Verteidiger den Absprung vor dem Sprung schließt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 3: scn_bank_902 — rw_trans_2v1_finish_lane

- **Difficulty (labeled):** Intermediate
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 9.5/10
- **Coach test:** NO
- **Recommendation:** TACTICAL REWRITE

### MAIN RISK
Labeled 2v1 transition family but ships the same finish-template answers/explanation as GK and empty-goal items.

### TACTICAL REALISM
2v1 with defender on CB can be a real RW decision (finish vs wait), but A talks about “available side of goal” without any GK cue in the situation.

### RW SPECIFICITY
Should be RW-specific lane discipline; currently generic finish text.

### GEOMETRY
2v1 described OK; no GK position given, yet A depends on GK-available side.

### GOALKEEPER LOGIC
FAIL — answer assumes GK “available side” with no GK information in the situation.

### HR LANGUAGE
> Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim

Situation never describes the goalkeeper; answer invents a GK read. Also stock why-text is identical to unrelated families.

### A VS B
B is recycled conditional; not a genuine 2v1 second-best (e.g. hold for CB bind).

### DIFFICULTY
Intermediate label; content is broken more than hard.

### PERCEPTION
NO — primary teach should be numerical/lane, not perception of an unstated GK.

### DUPLICATION RISK
Finish-template cluster.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 10:9 at 20. minutes. U prvom valat trčite 2 na 1: srednji vanjski vodi ballt sredinom, ti si wide desno uz linijat šest metara. Jedini branič stoji bliže njemat i bokovima zatvara dodavanje prema pivotskoj liniji, ali još nije krenuo prema tvom take-offu. Lopta dolazi na vrijeme, bez pritiska, i možeš skočiti prije nego promijeni smjer.
- **Question:** In this 2v1 on the right lane, what is your first action?
- **A:** Take off immediately and finish from the available side of goal
- **B:** Return the ball only if the defender closes the take-off before you jump
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Take off immediately and finish from the available side of goal
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 10:9 u 20. minuti. U prvom valu trčite 2 na 1: srednji vanjski vodi loptu sredinom, ti si široko desno uz liniju šest metara. Jedini branič stoji bliže njemu i bokovima zatvara dodavanje prema pivotskoj liniji, ali još nije krenuo prema tvom odrazu. Lopta dolazi na vrijeme, bez pritiska, i možeš skočiti prije nego promijeni smjer.
- **Question:** U ovom 2 na 1 u desnom koridoru, koja je tvoja prva akcija?
- **A:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **B:** Vrati loptu samo ako branič zatvori odraz prije skoka
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 10:9 u 20. Minute. U prvom valu trčite 2 na 1: srednji vanjski vodi loptu sredinom, ti si breit desno uz liniju šest metara. Jedini branič stoji bliže njemu i bokovima zatvara dodavanje prema pivotskoj liniji, ali još nije krenuo prema tvom Absprungu. Lopta dolazi na vrijeme, bez pritiska, i možeš skočiti prije nego promijeni smjer.
- **Question:** In diesem 2 gegen 1 im rechten Korridor — was ist deine erste Aktion?
- **A:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **B:** Nur zurückspielen, wenn der Verteidiger den Absprung vor dem Sprung schließt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 4: scn_bank_903 — rw_trans_finish_before_recovery

- **Difficulty (labeled):** Advanced
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** BORDERLINE
- **Risk score:** 9.5/10
- **Coach test:** NO
- **Recommendation:** TACTICAL REWRITE

### MAIN RISK
Recovery-distance cue is restated in the question; answer is again the universal finish template.

### TACTICAL REALISM
Finish before recovery is a real concept (also in pilot 08 / 878), but here it is diluted by cloned answers and no unique teaching edge.

### RW SPECIFICITY
YES in intent; NO in execution because A/B/C/D are not scenario-specific.

### GEOMETRY
>2m late defender is clear; GK deep mentioned but A still says “available side” without specifying how deep GK changes the shot.

### GOALKEEPER LOGIC
Mentioned deep but unused in a specific way.

### HR LANGUAGE
> A odmah koristi sadašnji vidljivi signal; B postaje bolji tek nakon navedene promjene u obrani.

Meta-explanation about “signal” instead of naming the recovery distance cue. Sounds like generator boilerplate, not a coach.

### A VS B
Question already says defender is >2m away; A is “finish now”. Reading comprehension.

### DIFFICULTY
Advanced inflated vs pilot-level Intermediate idea.

### PERCEPTION
BORDERLINE — distance is given explicitly, little to discover.

### DUPLICATION RISK
Semantic duplicate of 878 / 917 / finish-before-recovery cluster.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat trail 11:10 at 22. minutes nakon osvajanja lopte. Trčiš desni koridor prvog vala, a srednji vanjski ti šalje ballt prema kutu. Najbliži branič at povratkat kasni više od dva metra iza mjesta take-offa i gleda prema sredini, ne prema tebi. Vratar ostaje duboko na goalu; imaš čist prijem i jedan ritam do take-offa prije nego branič može zatvoriti krilo.
- **Question:** The recovering defender is still more than two metres away — what do you do?
- **A:** Take off immediately and finish from the available side of goal
- **B:** Return the ball only if the defender closes the take-off before you jump
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Take off immediately and finish from the available side of goal
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Gubite 11:10 u 22. minuti nakon osvajanja lopte. Trčiš desni koridor prvog vala, a srednji vanjski ti šalje loptu prema kutu. Najbliži branič u povratku kasni više od dva metra iza mjesta odraza i gleda prema sredini, ne prema tebi. Vratar ostaje duboko na golu; imaš čist prijem i jedan ritam do odraza prije nego branič može zatvoriti krilo.
- **Question:** Branič u povratku još je više od dva metra daleko — što radiš?
- **A:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **B:** Vrati loptu samo ako branič zatvori odraz prije skoka
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr liegt zurück 11:10 u 22. Minute nakon osvajanja lopte. Trčiš desni koridor prvog vala, a srednji vanjski ti šalje loptu prema kutu. Najbliži branič u povratku kasni više od dva metra iza mjesta Absprunga i gleda prema sredini, ne prema tebi. Vratar ostaje duboko na Toru; imaš čist prijem i jedan ritam do Absprunga prije nego branič može zatvoriti krilo.
- **Question:** Der zurückkommende Verteidiger ist noch mehr als zwei Meter weg — was tust du?
- **A:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **B:** Nur zurückspielen, wenn der Verteidiger den Absprung vor dem Sprung schließt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 5: scn_bank_912 — rw_7v6_extra_attacker_space

- **Difficulty (labeled):** Expert
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 9/10
- **Coach test:** NO
- **Recommendation:** TACTICAL REWRITE

### MAIN RISK
Expert 7v6 item uses the same cloned finish ladder; question asks “when” but A is generic take-off-now.

### TACTICAL REALISM
7v6 wing space can be excellent teaching; this does not teach which 7v6 cue opens the wing beyond “no body to take-off”.

### RW SPECIFICITY
YES potential; currently generic.

### GEOMETRY
Second pivot binds, RB pulls wing defender — OK. GK nearer near post stated.

### GOALKEEPER LOGIC
Near-post shade mentioned then ignored by vague A.

### HR LANGUAGE
> Čitaj konkretnu geometriju… Odluka slijedi taj signal, ne samo brojčanu oznaku.

Same stock paragraph; “brojčanu oznaku” is academic/AI phrasing for “ne zato što piše 7v6”.

### A VS B
Weak; B again “return if closed”.

### DIFFICULTY
Expert not justified — one-cue free finish.

### PERCEPTION
NO

### DUPLICATION RISK
Finish-template + numerical free-wing cluster with 878/917/903.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 20:19 at 40. minutes at napadat 7 na 6. Drugi pivot veže polubranitelja i središnjeg braniča, a right back povlači krilnog braniča korak prema unutra. Lopta ti dolazi samome uz aut-liniju; do take-offa prema sredini nema obrambenog tijela. Vratar ostaje bliže prvoj stativi i kasni premjestiti se prema drugoj nakon tvog take-offa.
- **Question:** In 7v6, when do you use the extra space on the wing?
- **A:** Take off immediately and finish from the available side of goal
- **B:** Return the ball only if the defender closes the take-off before you jump
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Take off immediately and finish from the available side of goal
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 20:19 u 40. minuti u napadu 7 na 6. Drugi pivot veže polubranitelja i središnjeg braniča, a desni vanjski povlači krilnog braniča korak prema unutra. Lopta ti dolazi samome uz aut-liniju; do odraza prema sredini nema obrambenog tijela. Vratar ostaje bliže prvoj stativi i kasni premjestiti se prema drugoj nakon tvog odraza.
- **Question:** U 7 na 6, kad koristiš dodatni prostor na krilu?
- **A:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **B:** Vrati loptu samo ako branič zatvori odraz prije skoka
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 20:19 u 40. Minute u napadu 7 na 6. Drugi pivot veže polubranitelja i središnjeg braniča, a rechte Rückraumspieler povlači krilnog braniča korak prema unutra. Lopta ti dolazi samome uz aut-liniju; do Absprunga prema sredini nema obrambenog tijela. Vratar ostaje bliže prvoj stativi i kasni premjestiti se prema drugoj nakon tvog Absprunga.
- **Question:** Im 7 gegen 6 — wann nutzt du den Extra-Raum am Flügel?
- **A:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **B:** Nur zurückspielen, wenn der Verteidiger den Absprung vor dem Sprung schließt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 6: scn_bank_914 — rw_empty_own_goal_clean_finish

- **Difficulty (labeled):** Expert
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** BORDERLINE
- **Risk score:** 9/10
- **Coach test:** NO
- **Recommendation:** TACTICAL REWRITE

### MAIN RISK
Empty own goal + clean catch is a strong Expert match-IQ idea (pilot 09 inverse), ruined by cloned finish answer and stock explanation that never discusses empty-goal risk tradeoff.

### TACTICAL REALISM
Real dilemma exists (safe vs finish when own goal empty). Situation argues finish is OK, but A/B ladder does not encode that risk logic.

### RW SPECIFICITY
YES

### GEOMETRY
Clean catch, late defender — OK.

### GOALKEEPER LOGIC
Opponent GK deep — fine; A still template-vague.

### HR LANGUAGE
> Rizik praznog gola ne briše čistu završnicu koju već imaš.

“završnicu” is literary/academic vs common “završetak/šut”. Also explanation ignores empty-goal risk and pastes geometry boilerplate.

### A VS B
B does not represent the true second-best (safe return under empty own goal).

### DIFFICULTY
Expert label OK if rewritten; currently broken.

### PERCEPTION
BORDERLINE — catch quality is stated, not discovered.

### DUPLICATION RISK
Paired with 879 (safe return) and 916; finish-template clone.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 22:21 at 44. minutes, a vaš goalkeeper je izašao zbog sedmog igrača pa je vlastiti goal prazan. Desni vanjski povlači krilnog braniča unutra i ball ti dolazi at prsa, at ritmu, dok si sam at kutu. Branič kasni više od dva metra do mjesta take-offa, a goalkeeper ostaje duboko i ne izlazi prema krilu. Rizik praznog goala ne briše čistat završnicat kojat već imaš.
- **Question:** Own goal empty, but the catch and take-off are clean — what is right?
- **A:** Take off immediately and finish from the available side of goal
- **B:** Return the ball only if the defender closes the take-off before you jump
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Take off immediately and finish from the available side of goal
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 22:21 u 44. minuti, a tvoj vratar je izašao zbog sedmog igrača pa je vlastiti gol prazan. Desni vanjski povlači krilnog braniča unutra i lopta ti dolazi u prsa, u ritmu, dok si sam u kutu. Branič kasni više od dva metra do mjesta odraza, a vratar ostaje duboko i ne izlazi prema krilu. Rizik praznog gola ne briše čistu završnicu koju već imaš.
- **Question:** Vlastiti gol prazan, ali su prijem i odraz čisti — što je točno?
- **A:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **B:** Vrati loptu samo ako branič zatvori odraz prije skoka
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 22:21 u 44. Minute, a vaš Torhüter je izašao zbog sedmog igrača pa je vlastiti Tor prazan. Desni vanjski povlači krilnog braniča unutra i Ball ti dolazi u prsa, u ritmu, dok si sam u kutu. Branič kasni više od dva metra do mjesta Absprunga, a Torhüter ostaje duboko i ne izlazi prema krilu. Rizik praznog Tora ne briše čistu završnicu koju već imaš.
- **Question:** Eigenes Tor leer, aber Fang und Absprung sind sauber — was ist richtig?
- **A:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **B:** Nur zurückspielen, wenn der Verteidiger den Absprung vor dem Sprung schließt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 7: scn_bank_917 — rw_after_rb_two_finish

- **Difficulty (labeled):** Intermediate
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 9/10
- **Coach test:** NO
- **Recommendation:** REMOVE / MERGE

### MAIN RISK
“RB draws two → finish” is already taught by 878 and pilot-mapped 871/878 family ideas; here it is another clone of the finish template.

### TACTICAL REALISM
Real, but not additive after better scenarios exist.

### RW SPECIFICITY
YES but redundant.

### GEOMETRY
OK — two defenders on RB, ball arrives before wing defender turns.

### GOALKEEPER LOGIC
Near post mentioned; A vague again.

### HR LANGUAGE
> Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim

Identical A text across unrelated families; not tailored to RB-draws-two.

### A VS B
Same fake B conditional.

### DIFFICULTY
Intermediate OK; still clone.

### PERCEPTION
NO

### DUPLICATION RISK
High — merge with 878 / after-RB cluster (917/918/919/920).

### COMPLETE SCENARIO

#### EN
- **Situation:** The score is tied 25:24 at 50. minutes. Desni vanjski prodire izmeđat polubranitelja i krilnog braniča te na sebe povlači obojicu. Ti ostaješ wide uz aut-liniju, a ball stiže prije nego se wing defender okrene prema kutu. Imaš prostor za take-off prema sredini; goalkeeper stoji na prvoj stativi i tek reagira na promjenat smjera.
- **Question:** The right back has drawn two — why finish now?
- **A:** Take off immediately and finish from the available side of goal
- **B:** Return the ball only if the defender closes the take-off before you jump
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Take off immediately and finish from the available side of goal
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Neriješeno je 25:24 u 50. minuti. Desni vanjski prodire između polubranitelja i krilnog braniča te na sebe povlači obojicu. Ti ostaješ široko uz aut-liniju, a lopta stiže prije nego se krilni branič okrene prema kutu. Imaš prostor za odraz prema sredini; vratar stoji na prvoj stativi i tek reagira na promjenu smjera.
- **Question:** Desni vanjski povukao je dvojicu — zašto završiti sada?
- **A:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **B:** Vrati loptu samo ako branič zatvori odraz prije skoka
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Odmah se odrazi i završi u dio gola koji vratar ostavlja dostupnim
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Unentschieden steht es 25:24 u 50. Minute. Desni vanjski prodire između polubranitelja i krilnog braniča te na sebe povlači obojicu. Ti ostaješ breit uz aut-liniju, a Ball stiže prije nego se Außenverteidiger okrene prema kutu. Imaš prostor za Absprung prema sredini; Torhüter stoji na prvoj stativi i tek reagira na promjenu smjera.
- **Question:** Der rechte Rückraum hat zwei gezogen — warum jetzt abschließen?
- **A:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **B:** Nur zurückspielen, wenn der Verteidiger den Absprung vor dem Sprung schließt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Sofort abspringen und in den verfügbaren Teil des Tores abschließen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 8: scn_bank_909 — rw_6v5_recycle_when_covered

- **Difficulty (labeled):** Advanced
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** BORDERLINE
- **Risk score:** 8.5/10
- **Coach test:** BORDERLINE
- **Recommendation:** TACTICAL REWRITE

### MAIN RISK
Covered take-off in 6v5 is a good anti-“always shoot in power play” lesson, but shares recycled secure-and-return ladder with 911/913/916.

### TACTICAL REALISM
Good concept; execution is template.

### RW SPECIFICITY
YES

### GEOMETRY
Wing defender on take-off spot — clear.

### GOALKEEPER LOGIC
N/A

### HR LANGUAGE
> Osiguraj loptu i odigraj kratki povratak za novu organizaciju napada

Acceptable handball, but identical across many Part C “covered” items; “nova organizacija napada” is a bit formal vs “vrati i krenite iznova”.

### A VS B
B (“wait for second circulation if released”) is close enough that A vs B needs sharper cue separation.

### DIFFICULTY
Advanced reasonable if unique.

### PERCEPTION
BORDERLINE — coverage is stated explicitly.

### DUPLICATION RISK
Recycle-when-covered cluster with 911,913,916,918,920.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 17:16 at 34. minutes s igračem više 6 na 5. Desni vanjski je povukao polubranitelja, ali wing defender ostaje na šest metara ispred tvog take-offa i tijelom zatvara put prema sredini. Lopta ti dolazi čisto, no nema prostora da skočiš bez kontakta. Desni vanjski se odmah vraća at linijat dodavanja, a drugi pivot i dalje veže središte obrane.
- **Question:** You are in 6v5 but your take-off is covered — what is first?
- **A:** Secure the catch and play a short return to rebuild the attack
- **B:** Hold width and wait for a second circulation if the defender releases you
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Secure the catch and play a short return to rebuild the attack
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 17:16 u 34. minuti s igračem više 6 na 5. Desni vanjski je povukao polubranitelja, ali krilni branič ostaje na šest metara ispred tvog odraza i tijelom zatvara put prema sredini. Lopta ti dolazi čisto, no nema prostora da skočiš bez kontakta. Desni vanjski se odmah vraća u liniju dodavanja, a drugi pivot i dalje veže središte obrane.
- **Question:** Imaš 6 na 5, ali ti je odraz zatvoren — što je prvo?
- **A:** Osiguraj loptu i odigraj kratki povratak za novu organizaciju napada
- **B:** Zadrži širinu i pričekaj drugi prijenos lopte ako te branič pusti
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Osiguraj loptu i odigraj kratki povratak za novu organizaciju napada
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 17:16 u 34. Minute s igračem više 6 na 5. Desni vanjski je povukao polubranitelja, ali Außenverteidiger ostaje na šest metara ispred tvog Absprunga i tijelom zatvara put prema sredini. Lopta ti dolazi čisto, no nema prostora da skočiš bez kontakta. Desni vanjski se odmah vraća u liniju dodavanja, a drugi pivot i dalje veže središte obrane.
- **Question:** Ihr habt 6 gegen 5, aber dein Absprung ist zu — was ist zuerst?
- **A:** Den Ball sichern und kurz zurückspielen, um den Angriff neu aufzubauen
- **B:** Breite halten und auf die zweite Ballzirkulation warten, falls der Verteidiger dich freigibt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Den Ball sichern und kurz zurückspielen, um den Angriff neu aufzubauen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 9: scn_bank_913 — rw_7v6_no_force_covered

- **Difficulty (labeled):** Expert
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 8.5/10
- **Coach test:** BORDERLINE
- **Recommendation:** REMOVE / MERGE

### MAIN RISK
7v6 covered wing is the same teaching decision as 909/911 with different numerical sticker.

### TACTICAL REALISM
Valid, not distinct enough from 6v5 covered recycle.

### RW SPECIFICITY
YES

### GEOMETRY
OK — defender shoulder/arm on take-off.

### GOALKEEPER LOGIC
GK moved to wing — unused in A.

### HR LANGUAGE
> Iako su dva pivota na šest metara, krilni branič ostaje uz tebe

HR situation is decent; failure is conceptual duplication + stock explanation.

### A VS B
Same A/B as other covered items.

### DIFFICULTY
Expert inflated for a covered-take-off recycle.

### PERCEPTION
NO

### DUPLICATION RISK
Merge into one “covered wing despite numerical advantage” family.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 21:20 at 42. minutes at napadat 7 na 6. Iako sat dva pivota na šest metara, wing defender ostaje uz tebe i zatvara take-off prema sredini ramenom i podignutom rukom. Lopta ti dolazi uz aut-liniju, a goalkeeper je već pomaknut prema krilu. Desni vanjski ima slobodnat povratnat ballt i drugi pivot otvara nastavak na suprotnoj strani.
- **Question:** 7v6 but the wing is covered — what do you do?
- **A:** Secure the catch and play a short return to rebuild the attack
- **B:** Hold width and wait for a second circulation if the defender releases you
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Secure the catch and play a short return to rebuild the attack
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 21:20 u 42. minuti u napadu 7 na 6. Iako su dva pivota na šest metara, krilni branič ostaje uz tebe i zatvara odraz prema sredini ramenom i podignutom rukom. Lopta ti dolazi uz aut-liniju, a vratar je već pomaknut prema krilu. Desni vanjski ima slobodnu povratnu loptu i drugi pivot otvara nastavak na suprotnoj strani.
- **Question:** 7 na 6, ali je krilo pokriveno — što radiš?
- **A:** Osiguraj loptu i odigraj kratki povratak za novu organizaciju napada
- **B:** Zadrži širinu i pričekaj drugi prijenos lopte ako te branič pusti
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Osiguraj loptu i odigraj kratki povratak za novu organizaciju napada
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 21:20 u 42. Minute u napadu 7 na 6. Iako su dva pivota na šest metara, Außenverteidiger ostaje uz tebe i zatvara Absprung prema sredini ramenom i podignutom rukom. Lopta ti dolazi uz aut-liniju, a Torhüter je već pomaknut prema krilu. Desni vanjski ima slobodnu povratnu loptu i drugi pivot otvara nastavak na suprotnoj strani.
- **Question:** 7 gegen 6, aber der Flügel ist gedeckt — was tust du?
- **A:** Den Ball sichern und kurz zurückspielen, um den Angriff neu aufzubauen
- **B:** Breite halten und auf die zweite Ballzirkulation warten, falls der Verteidiger dich freigibt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Den Ball sichern und kurz zurückspielen, um den Angriff neu aufzubauen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 10: scn_bank_910 — rw_5v6_safe_width

- **Difficulty (labeled):** Expert
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 8.5/10
- **Coach test:** BORDERLINE
- **Recommendation:** POLISH

### MAIN RISK
5v6 width job is real, but Expert label and stay-wide template overlap with 906/908/877.

### TACTICAL REALISM
Reasonable short-handed wing role.

### RW SPECIFICITY
YES

### GEOMETRY
Wing defender stays home — clear.

### GOALKEEPER LOGIC
N/A

### HR LANGUAGE
> Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad

Same A as other stay-wide templates; “ponudi … za pozicijski napad” is ok but repetitive AI cadence across Part C.

### A VS B
B cut-after-fix is plausible; OK if situation unique.

### DIFFICULTY
Expert too high — Intermediate/Advanced.

### PERCEPTION
NO — ordinary short-handed context.

### DUPLICATION RISK
Stay-wide cluster with 906,908,877,884.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat trail 18:17 at 36. minutes s igračem manje 5 na 6. Obrana stoji kompaktno, a wing defender ne prati ballt unutra nego ostaje izmeđat tebe i prve stative. Desni vanjski je pod kontroliranim pritiskom, ali ima kratko dodavanje prema tebi. Ako se približiš sredini, wing defender može pomoći na ballt i zatvoriti oba smjera; uz aut-linijat mat oduzimaš tat pomoć.
- **Question:** In 5v6, what is your job on the right wing?
- **A:** Stay wide on the right and offer the safe next pass into the set attack
- **B:** Cut inside only after the ball carrier fixes the defender in front of you
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Stay wide on the right and offer the safe next pass into the set attack
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Gubite 18:17 u 36. minuti s igračem manje 5 na 6. Obrana stoji kompaktno, a krilni branič ne prati loptu unutra nego ostaje između tebe i prve stative. Desni vanjski je pod kontroliranim pritiskom, ali ima kratko dodavanje prema tebi. Ako se približiš sredini, krilni branič može pomoći na loptu i zatvoriti oba smjera; uz aut-liniju mu oduzimaš tu pomoć.
- **Question:** U 5 na 6, koji je tvoj posao na desnom krilu?
- **A:** Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad
- **B:** Utrči unutra tek nakon što igrač s loptom veže braniča ispred tebe
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr liegt zurück 18:17 u 36. Minute s igračem manje 5 na 6. Obrana stoji kompaktno, a Außenverteidiger ne prati loptu unutra nego ostaje između tebe i prve stative. Desni vanjski je pod kontroliranim pritiskom, ali ima kratko dodavanje prema tebi. Ako se približiš sredini, Außenverteidiger može pomoći na loptu i zatvoriti oba smjera; uz aut-liniju mu oduzimaš tu pomoć.
- **Question:** Im 5 gegen 6 — was ist dein Job auf Rechtsaußen?
- **A:** Rechts breit bleiben und den sicheren nächsten Pass für den Positionsangriff anbieten
- **B:** Erst nach innen schneiden, wenn der Ballführer den Verteidiger vor dir bindet
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Rechts breit bleiben und den sicheren nächsten Pass für den Positionsangriff anbieten
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 11: scn_bank_911 — rw_5v6_no_force_corner

- **Difficulty (labeled):** Expert
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 8.5/10
- **Coach test:** BORDERLINE
- **Recommendation:** REMOVE / MERGE

### MAIN RISK
Nearly the same decision as 909 (do not force covered corner) with 5v6 sticker; question even spoils the answer (“why should you not force”).

### TACTICAL REALISM
Good cautionary idea; not a separate Expert scenario.

### RW SPECIFICITY
YES

### GEOMETRY
OK

### GOALKEEPER LOGIC
Near post “sees only narrow path” — slightly forced.

### HR LANGUAGE
> Zašto u ovom 5 na 6 ne forsiraš završetak iz kuta?

Question is leading; quizzes agreement, not decision under uncertainty.

### A VS B
A is predetermined by the question wording.

### DIFFICULTY
Expert inflated.

### PERCEPTION
NO

### DUPLICATION RISK
Merge with 909/913 covered-wing set.

### COMPLETE SCENARIO

#### EN
- **Situation:** The score is tied 19:18 at 38. minutes s igračem manje 5 na 6. Lopta ti dolazi at desni kut, no wing defender stoji pola koraka ispred mjesta take-offa, a polubranitelj je dovoljno blizat da zatvori povratak prema sredini. Vratar čeka na prvoj stativi i vidi samo tvoj uski put. Desni vanjski je slobodan za kratki povratak; forsirani šut sada nosi veći rizik od koristi.
- **Question:** Why should you not force the corner finish in this 5v6?
- **A:** Secure the catch and play a short return to rebuild the attack
- **B:** Hold width and wait for a second circulation if the defender releases you
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Secure the catch and play a short return to rebuild the attack
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Neriješeno je 19:18 u 38. minuti s igračem manje 5 na 6. Lopta ti dolazi u desni kut, no krilni branič stoji pola koraka ispred mjesta odraza, a polubranitelj je dovoljno blizu da zatvori povratak prema sredini. Vratar čeka na prvoj stativi i vidi samo tvoj uski put. Desni vanjski je slobodan za kratki povratak; forsirani šut sada nosi veći rizik od koristi.
- **Question:** Zašto u ovom 5 na 6 ne forsiraš završetak iz kuta?
- **A:** Osiguraj loptu i odigraj kratki povratak za novu organizaciju napada
- **B:** Zadrži širinu i pričekaj drugi prijenos lopte ako te branič pusti
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Osiguraj loptu i odigraj kratki povratak za novu organizaciju napada
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Unentschieden steht es 19:18 u 38. Minute s igračem manje 5 na 6. Lopta ti dolazi u desni kut, no Außenverteidiger stoji pola koraka ispred mjesta Absprunga, a polubranitelj je dovoljno blizu da zatvori povratak prema sredini. Vratar čeka na prvoj stativi i vidi samo tvoj uski put. Desni vanjski je slobodan za kratki povratak; forsirani šut sada nosi veći rizik od koristi.
- **Question:** Warum solltest du in diesem 5 gegen 6 den Eckenabschluss nicht erzwingen?
- **A:** Den Ball sichern und kurz zurückspielen, um den Angriff neu aufzubauen
- **B:** Breite halten und auf die zweite Ballzirkulation warten, falls der Verteidiger dich freigibt
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Den Ball sichern und kurz zurückspielen, um den Angriff neu aufzubauen
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 12: scn_bank_906 — rw_trans_stop_forcing

- **Difficulty (labeled):** Advanced
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 8/10
- **Coach test:** BORDERLINE
- **Recommendation:** REMOVE / MERGE

### MAIN RISK
Second-wave / stop-forcing concept already covered strongly by pilot-mapped 877; this is a weaker clone with stock Part C ladder.

### TACTICAL REALISM
Correct idea, redundant.

### RW SPECIFICITY
YES

### GEOMETRY
Two recovering defenders — OK.

### GOALKEEPER LOGIC
N/A

### HR LANGUAGE
> Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad

Identical A to 908/910; explanation is stock geometry paragraph.

### A VS B
Mirrors 877/908.

### DIFFICULTY
Advanced OK for original; here duplicate.

### PERCEPTION
NO

### DUPLICATION RISK
Merge with 877 / 908.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 14:13 at 28. minutes. Prvi val je usporio jer sat dva braniča at povratkat već na liniji šest metara; jedan stoji izmeđat tebe i lopte, drugi je at sredini uz pivota. Nema više brojčane prednosti, a defence se postavlja at 6:0. Još si visoko desno i right back može sigurno nastaviti napad ako mat ostaneš kao široka opcija.
- **Question:** The first-wave advantage is gone — what do you do on the right?
- **A:** Stay wide on the right and offer the safe next pass into the set attack
- **B:** Cut inside only after the ball carrier fixes the defender in front of you
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Stay wide on the right and offer the safe next pass into the set attack
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 14:13 u 28. minuti. Prvi val je usporio jer su dva braniča u povratku već na liniji šest metara; jedan stoji između tebe i lopte, drugi je u sredini uz pivota. Nema više brojčane prednosti, a obrana se postavlja u 6:0. Još si visoko desno i desni vanjski može sigurno nastaviti napad ako mu ostaneš kao široka opcija.
- **Question:** Prednost prvog vala je nestala — što radiš na desnoj strani?
- **A:** Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad
- **B:** Utrči unutra tek nakon što igrač s loptom veže braniča ispred tebe
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 14:13 u 28. Minute. Prvi val je usporio jer su dva braniča u povratku već na liniji šest metara; jedan stoji između tebe i lopte, drugi je u sredini uz pivota. Nema više brojčane prednosti, a Abwehr se postavlja u 6:0. Još si visoko desno i rechte Rückraumspieler može sigurno nastaviti napad ako mu ostaneš kao široka opcija.
- **Question:** Der Vorteil der ersten Welle ist weg — was tust du rechts?
- **A:** Rechts breit bleiben und den sicheren nächsten Pass für den Positionsangriff anbieten
- **B:** Erst nach innen schneiden, wenn der Ballführer den Verteidiger vor dir bindet
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Rechts breit bleiben und den sicheren nächsten Pass für den Positionsangriff anbieten
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 13: scn_bank_908 — rw_trans_second_wave_width_hold

- **Difficulty (labeled):** Intermediate
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 8/10
- **Coach test:** BORDERLINE
- **Recommendation:** REMOVE / MERGE

### MAIN RISK
Second-wave width hold duplicates 906 and 877 with same A/B/C/D.

### TACTICAL REALISM
Real, redundant.

### RW SPECIFICITY
YES

### GEOMETRY
OK — wing defender back, half on pivot.

### GOALKEEPER LOGIC
N/A

### HR LANGUAGE
> što drži napad upotrebljivim?

“upotrebljivim” is bureaucratic; coaches say “da napad ostane živ / da imamo širinu”.

### A VS B
Identical ladder.

### DIFFICULTY
Intermediate OK; still duplicate.

### PERCEPTION
NO

### DUPLICATION RISK
High with 906/877.

### COMPLETE SCENARIO

#### EN
- **Situation:** Yoat lead 16:15 at 32. minutes. Drugi val dolazi prema postavljenoj 6:0, a srednji vanjski ima ballt na devet metara. Krilni branič se vratio at kut, dok polubranitelj stoji uz pivota i zatvara prostor izmeđat njih. Ako sada utrčiš prema sredini, dovodiš još jednog napadača at isti zbijeni dio obrane; ostajući uz aut-linijat prisiljavaš krilnog braniča da ostane wide.
- **Question:** Second wave arrives as the defence sets — what keeps the attack usable?
- **A:** Stay wide on the right and offer the safe next pass into the set attack
- **B:** Cut inside only after the ball carrier fixes the defender in front of you
- **C:** Force the first shot without checking the defender’s coverage
- **D:** Play a blind long pass across the covered defence
- **Correct:** Stay wide on the right and offer the safe next pass into the set attack
- **Explanation:** Read the concrete geometry: defender position, passing lane, take-off space, and goalkeeper or turnover risk. The decision must follow that signal, not the numerical label alone.

#### HR
- **Situation:** Vodite 16:15 u 32. minuti. Drugi val dolazi prema postavljenoj 6:0, a srednji vanjski ima loptu na devet metara. Krilni branič se vratio u kut, dok polubranitelj stoji uz pivota i zatvara prostor između njih. Ako sada utrčiš prema sredini, dovodiš još jednog napadača u isti zbijeni dio obrane; ostajući uz aut-liniju prisiljavaš krilnog braniča da ostane široko.
- **Question:** Drugi val stiže dok se obrana postavlja — što drži napad upotrebljivim?
- **A:** Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad
- **B:** Utrči unutra tek nakon što igrač s loptom veže braniča ispred tebe
- **C:** Forsiraj prvu akciju bez čitanja pokrivanja braniča
- **D:** Baci slijepo dugo dodavanje preko pokrivene obrane
- **Correct:** Ostani široko desno i ponudi sigurno sljedeće dodavanje za pozicijski napad
- **Explanation:** Čitaj konkretnu geometriju: položaj braniča, liniju dodavanja, prostor za odraz te položaj vratara ili rizik gubitka lopte. Odluka slijedi taj signal, ne samo brojčanu oznaku.

#### DE
- **Situation:** Ihr führt 16:15 u 32. Minute. Drugi val dolazi prema postavljenoj 6:0, a srednji vanjski ima loptu na devet metara. Krilni branič se vratio u kut, dok polubranitelj stoji uz pivota i zatvara prostor između njih. Ako sada utrčiš prema sredini, dovodiš još jednog napadača u isti zbijeni dio obrane; ostajući uz aut-liniju prisiljavaš krilnog braniča da ostane breit.
- **Question:** Die zweite Welle kommt während die Abwehr steht — was hält den Angriff spielbar?
- **A:** Rechts breit bleiben und den sicheren nächsten Pass für den Positionsangriff anbieten
- **B:** Erst nach innen schneiden, wenn der Ballführer den Verteidiger vor dir bindet
- **C:** Den ersten Wurf ohne Lesen der Verteidigung erzwingen
- **D:** Einen blinden langen Pass über die gedeckte Abwehr werfen
- **Correct:** Rechts breit bleiben und den sicheren nächsten Pass für den Positionsangriff anbieten
- **Explanation:** Lies die konkrete Geometrie: Verteidigerposition, Passlinie, Absprungraum sowie Torhüter- oder Ballverlustrisiko. Die Entscheidung folgt diesem Signal, nicht allein der Zahlensituation.

---

## Rank 14: scn_bank_878 — rw_6v5_free_finish

- **Difficulty (labeled):** Advanced
- **Attack/Defence:** Attack
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** NO
- **Risk score:** 8/10
- **Coach test:** BORDERLINE
- **Recommendation:** POLISH

### MAIN RISK
Approved-pilot descendant, but question/answer are reading-comprehension: situation already says alone + >2m; A restates that.

### TACTICAL REALISM
Core idea is sound (free wing in 6v5).

### RW SPECIFICITY
YES

### GEOMETRY
Clear and good.

### GOALKEEPER LOGIC
Deep — unused beyond atmosphere.

### HR LANGUAGE
> Igrač više pomaže stvoriti ovu sliku — odluka dolazi iz toga što si sam.

Meta-commentary (“ova slika”) is trainer-manual tone, not match language; also telegraphs the answer.

### A VS B
B is decent emergency outlet; main issue is Q/A spoiling.

### DIFFICULTY
Advanced slightly high; Intermediate/Advanced.

### PERCEPTION
NO — distances are given, not discovered.

### DUPLICATION RISK
Related to 903/912/917 free-finish cluster.

### COMPLETE SCENARIO

#### EN
- **Situation:** You lead 21:20 at 41' in a 6v5 after their exclusion. The right back has pulled two defenders. You receive alone near the sideline; the nearest recovering defender is still more than two metres from your take-off spot and cannot contest it. The goalkeeper stays deep on the goal line. Another full swing to the other side would give the defence time to recover to your corner. The player-up helps create this picture — the decision itself comes from you being free.
- **Question:** Why should you finish from this catch?
- **A:** Because you are alone and the nearest defender is too far to contest your take-off
- **B:** Short pass to the right back only if a defender jumps you before you control the catch
- **C:** Swing to the other side again to keep circulating while they recover to your corner
- **D:** Force a pass into the crowded pivot area instead of using the free wing finish
- **Correct:** Because you are alone and the nearest defender is too far to contest your take-off
- **Explanation:** Cue: alone near the sideline, nearest recovering defender more than two metres from your take-off, goalkeeper deep. Finish now. 6v5 helps create the picture; freedom and late help decide it. Another swing (C) gives them recovery time.

#### HR
- **Situation:** Vodite 21:20 u 41. minuti u igraču više 6 na 5 nakon njihovog isključenja. Desni vanjski povukao je dva braniča. Primaš sam blizu aut-linije; najbliži branič u povratku još je više od dva metra od mjesta tvog odraza i ne može ga ometati. Vratar ostaje duboko na golu. Još jedan puni prelazak lopte na drugu stranu dao bi obrani vremena da se vrati u tvoj kut. Igrač više pomaže stvoriti ovu sliku — odluka dolazi iz toga što si sam.
- **Question:** Zašto trebaš završiti s ovog prijema?
- **A:** Jer si sam i najbliži branič je predaleko da ometa tvoj odraz
- **B:** Kratko dodavanje desnom vanjskom samo ako te branič skoči prije nego primiš loptu pod kontrolom
- **C:** Ponovno prebaci na drugu stranu da nastaviš cirkulaciju dok se oni vraćaju u tvoj kut
- **D:** Forsiraj dodavanje u zbijeni prostor pivota umjesto slobodnog krilnog završetka
- **Correct:** Jer si sam i najbliži branič je predaleko da ometa tvoj odraz
- **Explanation:** Signal: sam blizu aut-linije, najbliži branič u povratku više od dva metra od odraza, vratar duboko. Završi sada. 6 na 5 pomaže stvoriti sliku; sloboda i kasna pomoć odlučuju. Još jedan prelazak (C) daje im vrijeme za povratak.

#### DE
- **Situation:** Ihr führt 21:20 in Minute 41 im Überzahl 6 gegen 5 nach ihrer Zeitstrafe. Der rechte Rückraum hat zwei Verteidiger gezogen. Du fängst allein nahe der Seitenlinie; der nächste zurückkommende Verteidiger ist noch mehr als zwei Meter von deinem Absprungpunkt und kann ihn nicht stören. Der Torhüter bleibt tief auf der Torlinie. Ein weiterer voller Seitenwechsel gäbe der Abwehr Zeit zurück in deine Ecke. Die Überzahl hilft dieses Bild zu schaffen — die Entscheidung kommt daraus dass du frei bist.
- **Question:** Warum solltest du aus diesem Fang abschließen?
- **A:** Weil du allein bist und der nächste Verteidiger zu weit ist um deinen Absprung zu stören
- **B:** Kurzer Pass auf den rechten Rückraum nur wenn ein Verteidiger dich anspringt bevor du den Fang kontrollierst
- **C:** Nochmal auf die andere Seite schieben und weiter zirkulieren während sie in deine Ecke zurückkehren
- **D:** Pass in den verdichteten Kreisraum erzwingen statt des freien Flügelabschlusses
- **Correct:** Weil du allein bist und der nächste Verteidiger zu weit ist um deinen Absprung zu stören
- **Explanation:** Signal: allein nahe der Seitenlinie, nächster Zurückkommender mehr als zwei Meter vom Absprung, Torhüter tief. Jetzt abschließen. 6 gegen 5 hilft das Bild; Freiheit und späte Hilfe entscheiden. Weiterer Seitenwechsel (C) schenkt Rückkehrzeit.

---

## Rank 15: scn_bank_940 — rw_15_punish_high_wing_def

- **Difficulty (labeled):** Advanced
- **Attack/Defence:** Defence
- **Handedness:** none
- **Perception tag:** true
- **Primary perception justified:** YES
- **Risk score:** 7.5/10
- **Coach test:** BORDERLINE
- **Recommendation:** POLISH

### MAIN RISK
1:5 high-wing defence is a legitimate Expert/Advanced RW defensive read, but HR has an appended geometry patch glued without punctuation and some awkward wording.

### TACTICAL REALISM
Good defensive teaching if cleaned.

### RW SPECIFICITY
YES — wing depth vs high LW in 1:5.

### GEOMETRY
Mostly clear; “middle depth” is a bit abstract but coach-understandable.

### GOALKEEPER LOGIC
N/A

### HR LANGUAGE
> iznenadno dugo dodavanje te prelazi Čitaj krilnog braniča i liniju šest metara prije odluke.

Programmatic patch concatenated without period/space logic; “Čitaj krilnog braniča…” is unnatural bolted-on instruction. Also “mamac” in explanation is OK-ish but “jurnjave u prazan prostor” is slightly comic.

### A VS B
A vs B is actually one of the better defensive pairs if language is fixed.

### DIFFICULTY
Advanced OK (not Expert).

### PERCEPTION
YES — must read high wing vs ball side.

### DUPLICATION RISK
Low vs other defence items; distinct from handover family.

### COMPLETE SCENARIO

#### EN
- **Situation:** Tied 16:16 at 33' in a 1:5. You defend the right wing. Their left wing stays unusually high near the half-way line while the ball is on the far side. If you chase him high into empty space, you leave the deep corner behind you for a long diagonal. If you drop too deep with no vision on him, a sudden long pass beats you.
- **Question:** How do you handle their high wing from your side?
- **A:** Hold a middle depth with vision on him and the ball — deny the deep corner without chasing into empty space
- **B:** Step higher only when the ball is already traveling toward him and you can still recover the corner
- **C:** Chase him to the half-way line and leave the corner empty
- **D:** Turn your back to the ball and only watch their wing
- **Correct:** Hold a middle depth with vision on him and the ball — deny the deep corner without chasing into empty space
- **Explanation:** Cue: 1:5, opposing wing high, ball far side. Hold middle depth with vision; do not chase into empty space. Higher step (B) only when the pass is already traveling.

#### HR
- **Situation:** Neriješeno je 16:16 u 33. minuti u 1:5. Braniš desno krilo. Njihovo lijevo krilo ostaje neuobičajeno visoko blizu polovice dok je lopta na drugoj strani. Ako ga juriš visoko u prazan prostor, ostavljaš duboki kut iza sebe za dugu dijagonalu. Ako padneš preduboko bez pogleda na njega, iznenadno dugo dodavanje te prelazi Čitaj krilnog braniča i liniju šest metara prije odluke.
- **Question:** Kako rješavaš njihovo visoko krilo sa svoje strane?
- **A:** Drži srednju dubinu s pogledom na njega i loptu — zatvori duboki kut bez jurnjave u prazan prostor
- **B:** Idi više samo kad lopta već ide prema njemu i još možeš stići u kut
- **C:** Juri ga do polovice i ostavi kut prazan
- **D:** Okreni leđa lopti i samo gledaj njihovo krilo
- **Correct:** Drži srednju dubinu s pogledom na njega i loptu — zatvori duboki kut bez jurnjave u prazan prostor
- **Explanation:** Signal: 1:5, protivničko krilo visoko, lopta na drugoj strani. Drži srednju dubinu s pogledom; ne juri u prazan prostor. Viši korak (B) samo kad dodavanje već ide.

#### DE
- **Situation:** Unentschieden 16:16 in Minute 33 in einer 1:5. Du verteidigst Rechtsaußen. Ihr Linksaußen bleibt ungewöhnlich hoch nahe der Mittellinie während der Ball auf der anderen Seite ist. Jagen Sie ihn hoch in den leeren Raum, lässt du die tiefe Ecke hinter dir für die lange Diagonale. Fällst du zu tief ohne Sicht auf ihn, schlägt dich ein plötzlicher langer Pass.
- **Question:** Wie löst du ihren hohen Flügel von deiner Seite?
- **A:** Mittlere Tiefe mit Sicht auf ihn und den Ball — tiefe Ecke sichern ohne in den leeren Raum zu jagen
- **B:** Nur höher gehen wenn der Ball schon zu ihm unterwegs ist und du die Ecke noch erreichst
- **C:** Ihn bis zur Mittellinie jagen und die Ecke leer lassen
- **D:** Dem Ball den Rücken drehen und nur ihren Flügel beobachten
- **Correct:** Mittlere Tiefe mit Sicht auf ihn und den Ball — tiefe Ecke sichern ohne in den leeren Raum zu jagen
- **Explanation:** Signal: 1:5, Gegnerflügel hoch, Ball andere Seite. Mittlere Tiefe mit Sicht; nicht in den leeren Raum jagen. Höherer Schritt (B) nur wenn der Pass schon unterwegs ist.

---

## FINAL SUMMARY

- Total RW audited: **70**
- Among the 15: KEEP **0**, POLISH **3**, TACTICAL REWRITE **7**, REMOVE/MERGE **5**

### Bank-level estimates (full 70)
- Questionable HR language: **28**
- Questionable geometry: **8**
- Weak A vs B: **22**
- Questionable difficulty: **18**
- Perception probably over-tagged: **45**
- Meaningful duplication risk: **24**
- Handedness metadata questionable: **2** (871, 875 — left tagged; first decision largely identical for right-handed RW)

### TOP 5 MOST SERIOUS PROBLEMS
1. Part C (approx. scn_bank_901–920) is largely a template farm: identical A/B/C/D ladders and stock explanations across different familyKeys.
2. English situations in Part C are corrupted/mixed (“Yoat lead”, HR words inside EN), so EN is not production-safe even if HR looks better.
3. Multiple “finish now” items invent goalkeeper-side finishing language when no GK cue exists — worst case scn_bank_915 (empty opponent goal).
4. Perception tagging ~97% is not credible; most Part C/D items state the cue explicitly and test agreement, not discovery.
5. Stay-wide / recycle-when-covered / free-finish ideas are duplicated across many numerical stickers (6v5/5v6/7v6/transition) without new decisions.

### 5 STRONGEST RW SCENARIOS (references)
- **scn_bank_872** (`rw_rb_hips_ask_now`): Clear hip cue, natural RW timing, strong A vs B, approved-pilot quality.
- **scn_bank_873** (`rw_entry_when_not`): Teaches when NOT to enter; concrete geometry; excellent RW specificity.
- **scn_bank_879** (`rw_empty_own_goal_safe_return`): Real match-IQ risk (messy catch + empty own goal); A/B close for the right reason.
- **scn_bank_880** (`rw_def_protect_wing_until_handover`): Explicit rule + premature B; genuine defensive RW responsibility.
- **scn_bank_876** (`rw_trans_3v2_hold_width`): Visualizable 3v2 width lesson; perception justified; not a shoot/pass cartoon.

No production changes. No deploy.
