# Left Wing Pre-Audit Report

Generated: 2026-08-10T07:01:46.552Z

**Verdict: CURRENT LW BANK NEEDS GOLD REBUILD**

## Lock check

- Commit context: 26f5999 / rw-gold-approved-2026-08-09
- LB 62 · RB 63 · CB 70 · RW 65 · LW 40
- scenarios.json SHA-256: `4b07b5588a8ca8085269fd9952f6c8b2bd1508c37f7c122a4fb84eaa8cad7df0`
- Audit modified bank: **no**

## Headline counts

| Metric | Value |
|---|---|
| Primary LW scenarios | 40 |
| True teaching families | 11 |
| Clone families | 11 |
| Attack | 37 (92.5%) |
| Defence | 3 (7.5%) |
| Perception tagged | 0 (0%) |
| Handedness tagged | 0 |
| Handedness in text IDs | scn_bank_080, scn_bank_083, scn_bank_091, scn_bank_094, scn_bank_102, scn_bank_105 |
| Difficulty | B7 / I12 / A15 / E6 |
| Defensive systems | {"UNSPECIFIED":40} |
| GK-ish families | 6 |
| Entry families | 1 |
| Pivot coop families | 1 |
| LB coop families | 2 |
| Transition families | 2 |
| Numerical families | 1 |
| Game-state families | 1 |
| Empty-goal families | 0 |
| Passive families | 0 |
| End-game families | 1 |
| HR vi-form scenarios | 40/40 |
| HR awkward/corrupt scenarios | 37/40 |

## Verdict reasons

- Only ~11 true teaching families under 40 IDs — rest is score/minute clone padding.
- Croatian is systematically machine-translated (vi-form, calques, football/basketball leaks, club names).
- Coverage of real LW decision space is mostly MISSING vs a gold architecture (hips, take-off geometry, when-not-to-enter, 5v6/7v6, empty goal, passive, set defence, systems beyond unspecified 6:0).
- GK logic is formulaic; Expert labels are clock/adjective driven.
- Defence has a single thin cloned family.
- Not salvageable by polish alone — needs position-native gold rebuild after RW-quality process (not RW mirror).

## True families (11) under 40 IDs

### lw_basic_near_post_read ×4

- Title: Left Wing — Basic Near-Post Read
- IDs: scn_bank_074, scn_bank_085, scn_bank_096, scn_bank_107
- Teaching: GK drifts far → finish near post
- Coach test: **NO**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 9/10 — Machine HR + simplistic GK formula + clone padding
- Geometry: QUESTIONABLE — no sideline/take-off/body orientation; “near/far” from LW not reconstructed
- GK logic: SIMPLISTIC — far drift ⇒ always near post
- A/B: WEAK — B lob without dropped-hands cue; C/D cartoon
- Suspicious HR quotes:
  - `Primate na lijevom krilu`
  - `Što prvo završavate?`
  - `pomicanje daljeg stupića ostavlja otvorenim blizu stupića`
  - `vašeg pokojnog braniča`
  - `Vozite unutra prema sredini`

### lw_far_post_under_centred_keeper ×4

- Title: Left Wing — Far-Post Under Centred Keeper
- IDs: scn_bank_075, scn_bank_086, scn_bank_097, scn_bank_108
- Teaching: Centred GK → far-post finish before recovering defender
- Coach test: **NO**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 9/10 — Broken HR terminology + automatic far-post rule
- Geometry: QUESTIONABLE — “vratar ostaje na sredini od šest metara”; “završni sloj”; take-off not stated
- GK logic: SIMPLISTIC — centred keeper ⇒ automatic far post
- A/B: WEAK — B near-post vs centred GK poorly motivated
- Suspicious HR quotes:
  - `hvatate preskok na lijevom krilu`
  - `Gdje postavljaš završni sloj`
  - `lijevi bočni branič`
  - `Snaga u bližu stativu igra na njihovoj snazi`

### lw_lob_vs_stepping_keeper ×4

- Title: Left Wing — Lob vs Stepping Keeper
- IDs: scn_bank_076, scn_bank_087, scn_bank_098, scn_bank_109
- Teaching: GK steps out early → lob
- Coach test: **NO**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 9/10 — Club name + automatic lob formula + HR corruption
- Geometry: QUESTIONABLE — narrow angle asserted without take-off path
- GK logic: SIMPLISTIC — step out ⇒ automatic lob; “lob lane” English calque in HR explanation
- A/B: MEDIOCRE
- Suspicious HR quotes:
  - `Kiel igra visoko`
  - `lob lane preko bližeg ramena`
  - `Snažan snažan šut`
  - `Povucite se izvan`

### lw_fast_break_arrival_timing ×4

- Title: Left Wing — Fast-Break Arrival Timing
- IDs: scn_bank_077, scn_bank_088, scn_bank_099, scn_bank_110
- Teaching: Sprint on outlet so you arrive at 6m with the catch
- Coach test: **BORDERLINE**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 8/10 — Machine HR; incomplete first-wave geometry; not LB-cooperation native
- Geometry: THIN — one recovering defender between player and 6m; lane unclear
- GK logic: N/A
- A/B: OK concept; distractors weak
- Suspicious HR quotes:
  - `Desna poleđina oslobađa dugački otvor`
  - `Sprintajte na izlazu`
  - `prije nego što se ispust pusti`
  - `cilj ostane`

### lw_back_door_vs_ball_watching_6_0 ×4

- Title: Left Wing — Back-Door vs Ball-Watching 6:0
- IDs: scn_bank_078, scn_bank_089, scn_bank_100, scn_bank_111
- Teaching: Ball-watching wing defender → cut behind to 6m
- Coach test: **BORDERLINE**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 8/10 — Useful family buried under machine translation
- Geometry: PARTIAL — defender head to ball and pinches; LB about to receive stated
- GK logic: N/A
- A/B: OK structure (cut vs hold width)
- Suspicious HR quotes:
  - `Sjecanje iza braniča`
  - `ulaz iza leđa srezana na šest metara`
  - `opciju najveće vrijednosti`
  - `poluzaštitnu stazu`

### lw_power_play_wing_overload ×4

- Title: Left Wing — Power-Play Wing Overload
- IDs: scn_bank_079, scn_bank_090, scn_bank_101, scn_bank_112
- Teaching: 6v5 late rotation → finish or feed sealed pivot
- Coach test: **BORDERLINE**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 8/10 — HR nonsense (“bližnjeg”, “zabrtvi”, “Zaradiš napad”); power-play English framing
- Geometry: THIN — “rotates one player late from middle”; pivot seal vague
- GK logic: N/A
- A/B: OK
- Suspicious HR quotes:
  - `rotira jednog igrača kasno iz sredine`
  - `Pivot zatvara bližnjeg braniča`
  - `dok osovina ne zabrtvi dublje`
  - `Zaradiš napad ili nahranite zapečaćenog Pivota`
  - `Driblati uz bočnu liniju`

### lw_tied_game_wing_finish ×3

- Title: Left Wing — Tied Game Wing Finish
- IDs: scn_bank_080, scn_bank_091, scn_bank_102
- Teaching: Late pressure finish with one GK read
- Coach test: **NO**
- Recommendation: **REMOVE / MERGE** (do not execute)
- Risk: 9/10 — Expert label from clock; contradictory score/title; fake hand shade
- Geometry: THIN — playable angle asserted
- GK logic: QUESTIONABLE — shade strong side ⇒ opposite / change height without concrete feet/arms
- A/B: WEAK
- Suspicious HR quotes:
  - `zasjenjuje tvoju snažnu sklonost ka desnoj ruci`
  - `Trener signalizira mirnu završnicu, a ne junaštvo`
  - `zaradiš slabu stranu`
  - `sjene tvoju jaku stranu`

### lw_keeper_first_step_read ×4

- Title: Left Wing — Keeper First-Step Read
- IDs: scn_bank_081, scn_bank_092, scn_bank_103, scn_bank_114
- Teaching: Fake → read GK first step → finish abandoned corner
- Coach test: **NO**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 8/10 — Football/keeper vocabulary; formulaic GK read
- Geometry: THIN
- GK logic: SIMPLISTIC — upright keeper + one fake formula
- A/B: MEDIOCRE
- Suspicious HR quotes:
  - `Koje informacije uzimate od čuvara prije puštanja?`
  - `Jedno kratko krivotvorenje`
  - `zaradiš napušteni kut`
  - `Visoki uspravni čuvari`

### lw_transition_cover_priority ×3

- Title: Left Wing — Transition Cover Priority
- IDs: scn_bank_082, scn_bank_093, scn_bank_104
- Teaching: After LW turnover, cut far-wing skip lane first
- Coach test: **NO**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 9/10 — Club sticker + incomplete  transition geometry; only defence family in bank
- Geometry: INCOMPLETE — no second defender location; far-wing skip asserted
- GK logic: N/A
- A/B: B stay on own wing is a real alternative — A not proven without teammate map
- Suspicious HR quotes:
  - `Zagrebački ispust odmah na desno krilo`
  - `presjekli stazu za preuzimanje dalekog krila`
  - `pritisnite najbližu utičnicu`
  - `signalizirate grešku`

### lw_extreme_angle_finish ×3

- Title: Left Wing — Extreme-Angle Finish
- IDs: scn_bank_083, scn_bank_094, scn_bank_105
- Teaching: Extreme angle + GK shades strong hand → low near-post skim
- Coach test: **BORDERLINE**
- Recommendation: **TACTICAL REWRITE** (do not execute)
- Risk: 8/10 — Expert from angle adjective; hand→shot formula; weak HR
- Geometry: THIN — “sliver of goal”; help one step from block
- GK logic: QUESTIONABLE — right-hander shade ⇒ low near skim as fixed technique
- A/B: WEAK distractors
- Suspicious HR quotes:
  - `dešnjak koji završava i zasjeni to oslobađanje`
  - `Nisko pri stupu preletite po podu`
  - `pokrivenog polubranika`
  - `Centralna moć je dar čuvaru`

### lw_simple_width_principle ×3

- Title: Left Wing — Simple Width Principle
- IDs: scn_bank_084, scn_bank_095, scn_bank_106
- Teaching: Hold true width on sideline in 6:0
- Coach test: **BORDERLINE**
- Recommendation: **POLISH** (do not execute)
- Risk: 6/10 — HR still machine-like; only thin positional teaching family that is salvageable
- Geometry: OK for Beginner — standing 1m inside sideline
- GK logic: N/A
- A/B: OK (hold width vs early cut)
- Suspicious HR quotes:
  - `Držite pravu širinu`
  - `krenite prečicom`
  - `Spustite do pola`
  - `dugo ispuštanje`

## Coverage matrix

| Topic | Status |
|---|---|
| 6:0 | TACTICALLY QUESTIONABLE |
| 5:1 | MISSING |
| 3:2:1 | MISSING |
| 3:3 | MISSING |
| 4:2 | MISSING |
| 1:5 | MISSING |
| 5+1 | MISSING |
| 4+2 | MISSING |
| open / individual defence | MISSING |
| 1v1 | MISSING |
| Left Back cooperation | LANGUAGE QUESTIONABLE |
| pivot cooperation | LANGUAGE QUESTIONABLE |
| entry timing | LANGUAGE QUESTIONABLE |
| when NOT to enter | MISSING |
| take off geometry | MISSING |
| wing defender hip read | MISSING |
| goalkeeper near-post movement | TACTICALLY QUESTIONABLE |
| goalkeeper depth | MISSING |
| goalkeeper step-out | TACTICALLY QUESTIONABLE |
| goalkeeper patience / late finish | TACTICALLY QUESTIONABLE |
| first wave 2v1 | MISSING |
| first wave 3v2 | MISSING |
| second wave | MISSING |
| partially set defence | MISSING |
| 6v5 | LANGUAGE QUESTIONABLE |
| 5v6 | MISSING |
| 7v6 | MISSING |
| own empty goal | MISSING |
| opponent empty goal | MISSING |
| after exclusion | LANGUAGE QUESTIONABLE |
| passive play | MISSING |
| lead late | MISSING |
| trail late | MISSING |
| tie final possession | DUPLICATED |
| transition defence | TACTICALLY QUESTIONABLE |
| set defence responsibility | MISSING |
| handover | MISSING |
| inside help | MISSING |
| recovery to wing | MISSING |
| first wave attack timing | LANGUAGE QUESTIONABLE |
| positional width | LANGUAGE QUESTIONABLE |
| extreme angle finish | LANGUAGE QUESTIONABLE |

## 15 human-review priorities

### scn_bank_074 — Left Wing — Basic Near-Post Read

- familyKey: `lw_basic_near_post_read`
- Beginner / Attack · handedness=none · perception=false
- risk **9/10** — Machine HR + simplistic GK formula + clone padding
- coach test: **NO** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Primate`; `završavate`; `vašeg`; `Vozite`; `Primate`
- geometry: QUESTIONABLE — no sideline/take-off/body orientation; “near/far” from LW not reconstructed
- A vs B: WEAK — B lob without dropped-hands cue; C/D cartoon
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** Primate na lijevom krilu protiv set 6:0 u 28 min. Rezultat 14–13. Vratar je odlutao pola koraka prema daljnjoj vratnici. Tvoj branič kasni korak i ne može blokirati.

**HR question:** Što prvo završavate?

- **optimal:** Niska završnica blizu stative prije nego što se vratar vrati u centar
- **good:** Visoki lob dalekom stativom preko vratara koji se oporavljao
- **risky:** Dodavanje unatrag lijevom vanjskom za resetiranje napada
- **poor:** Vozite unutra prema sredini protiv pomoći za oporavak

### scn_bank_075 — Left Wing — Far-Post Under Centred Keeper

- familyKey: `lw_far_post_under_centred_keeper`
- Intermediate / Attack · handedness=none · perception=false
- risk **9/10** — Broken HR terminology + automatic far-post rule
- coach test: **NO** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Zaustavite`; `hvatate`; `preskok`; `završni sloj`; `Odskočno`
- geometry: QUESTIONABLE — “vratar ostaje na sredini od šest metara”; “završni sloj”; take-off not stated
- A vs B: WEAK — B near-post vs centred GK poorly motivated
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** U 28. minuti (28–27) hvatate preskok na lijevom krilu. Vratar ostaje na sredini od šest metara. Tvoj lijevi bočni branič se oporavlja odostraga i stići će u jednom koraku.

**HR question:** Gdje postavljaš završni sloj prije nego što stigne kontakt?

- **optimal:** Kontrolirani završetak preko igrališta do daljnje vratnice prije dolaska braniča
- **good:** Snažni završetak na bližu stativu protiv središnjeg vratara
- **risky:** Odskočno dodavanje unutar do pivota kroz braniča koji se oporavlja
- **poor:** Zaustavite se licem prema gore i pričekajte da lijevi vanjski stigne za predaju

### scn_bank_076 — Left Wing — Lob vs Stepping Keeper

- familyKey: `lw_lob_vs_stepping_keeper`
- Advanced / Attack · handedness=none · perception=false
- risk **9/10** — Club name + automatic lob formula + HR corruption
- coach test: **NO** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Povucite`; `Keeper`; `Kiel`; `lob lane`; `Kiel igra visoko`
- geometry: QUESTIONABLE — narrow angle asserted without take-off path
- A vs B: MEDIOCRE
- difficulty: labeled Advanced but assessed Intermediate
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** Kiel igra visoko. U 51. minuti (22–21) njihov vratar agresivno izlazi prema vama na lijevom krilu. Imate uzak kut; lijevi vanjski je otvoren jedno dodavanje unutra ali ispod zaostalog braniča.

**HR question:** Kako kažnjavate rani korak?

- **optimal:** Visoki lob preko naprednog vratara prema daljem kutu
- **good:** Jedan lažni pa meki pas unutra na lijevog vanjskog
- **risky:** Snažan snažan šut pored vratnice u iskoračenog vratara
- **poor:** Povucite se izvan devet metara i ponovno započnite pozicijski napad

### scn_bank_077 — Left Wing — Fast-Break Arrival Timing

- familyKey: `lw_fast_break_arrival_timing`
- Intermediate / Attack · handedness=none · perception=false
- risk **8/10** — Machine HR; incomplete first-wave geometry; not LB-cooperation native
- coach test: **BORDERLINE** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Sprintajte`; `ispust`; `Desna poleđina oslobađa dugački otvor`; `Sprintajte na izlazu`; `prije nego što se ispust pusti`
- geometry: THIN — one recovering defender between player and 6m; lane unclear
- A vs B: OK concept; distractors weak
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** Tvoj tim osvaja loptu nakon 9 minuta (14–13). Desna poleđina oslobađa dugački otvor. Na pola ste puta; jedan branič koji se oporavlja je između vas i linije od šest metara.

**HR question:** Kada započinjete sprint tako da cilj ostane?

- **optimal:** Sprintajte na izlazu i stignite na šest metara dok uhvatite
- **good:** Zadržite dok lopta ne prijeđe pola puta, a zatim projurite pored braniča
- **risky:** Sprintajte prije nego što se ispust pusti kako biste pretekli loptu
- **poor:** Ostanite povezani sa zadnjom linijom kako biste održali obrambenu ravnotežu

### scn_bank_078 — Left Wing — Back-Door vs Ball-Watching 6:0

- familyKey: `lw_back_door_vs_ball_watching_6_0`
- Advanced / Attack · handedness=none · perception=false
- risk **8/10** — Useful family buried under machine translation
- coach test: **BORDERLINE** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Držite`; `poluzaštit`; `dalekometn`; `Sjecanje iza braniča`; `ulaz iza leđa srezana na šest metara`
- geometry: PARTIAL — defender head to ball and pinches; LB about to receive stated
- A vs B: OK structure (cut vs hold width)
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** Pozicijski 6:0 na 9 min (28–27). Lopta je na suprotnom krilu. Tvoj branič okreće glavu prema lopti i sužava prema sredini. lijevi vanjski je pred primanjem.

**HR question:** Koja akcija izvan lopte stvara opciju najveće vrijednosti?

- **optimal:** Sjecanje iza braniča koji je promatrao loptu prema šest metara pri sljedećem dodavanju
- **good:** Držite širinu na liniji krila kako biste rastegli obranu
- **risky:** Odlutajte u poluzaštitnu stazu i zatražite predaju
- **poor:** Spustite se na devet metara pripremajući dalekometni hitac

### scn_bank_079 — Left Wing — Power-Play Wing Overload

- familyKey: `lw_power_play_wing_overload`
- Advanced / Attack · handedness=none · perception=false
- risk **8/10** — HR nonsense (“bližnjeg”, “zabrtvi”, “Zaradiš napad”); power-play English framing
- coach test: **BORDERLINE** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Primate`; `Držite`; `Power-Play`; `Primate`; `bližnjeg`
- geometry: THIN — “rotates one player late from middle”; pivot seal vague
- A vs B: OK
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** 6 na 5 nakon isključenja na 28 minuta (22-21). Primate na lijevom krilu. Obrana s kratkim igračima rotira jednog igrača kasno iz sredine; Pivot zatvara bližnjeg braniča.

**HR question:** Što prvo pročitaš prije zatvaranja rotacije?

- **optimal:** Odmah napadnite kasnu rotaciju — doradiš ili nahranite zapečaćeni pivot
- **good:** Još jednom zamahnite loptom natrag oko cijelog perimetra
- **risky:** Držite krilo dok osovina ne zabrtvi dublje
- **poor:** Driblati uz bočnu liniju kako bi zaštitili posjed

### scn_bank_080 — Left Wing — Tied Game Wing Finish

- familyKey: `lw_tied_game_wing_finish`
- Expert / Attack · handedness=none · perception=false
- risk **9/10** — Expert label from clock; contradictory score/title; fake hand shade
- coach test: **NO** · recommendation: **REMOVE / MERGE**
- HR concerns: `Primate`; `imate`; `Primate`; `sjene`; `resetiranje`
- geometry: THIN — playable angle asserted
- A vs B: WEAK
- difficulty: labeled Expert but assessed Intermediate/Advanced
- duplication: 3-way clone family (score/minute stickers)

**HR situation:** Posljednjih 90 sekundi, rezultat 22–21. Primate na lijevom krilu s kutom koji se može igrati. Vratar zasjenjuje tvoju snažnu sklonost ka desnoj ruci. Trener signalizira mirnu završnicu, a ne junaštvo.

**HR question:** Kako odlučujete o završnici pod ovim pritiskom?

- **optimal:** Jedan vratar čita, zatim završava nasuprot svoje sjene ili mijenja visinu udarca
- **good:** Vratite loptu za potpuno resetiranje unatoč kutu koji se može igrati
- **risky:** Pokušajte obrnuti završetak vrtnje kako biste iznenadili obranu
- **poor:** Udarite snažan šut bez provjere sjenila vratara

### scn_bank_081 — Left Wing — Keeper First-Step Read

- familyKey: `lw_keeper_first_step_read`
- Intermediate / Attack · handedness=none · perception=false
- risk **8/10** — Football/keeper vocabulary; formulaic GK read
- coach test: **NO** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Hvatate`; `Hvatate`; `krivotvoren`; `Koje informacije uzimate od čuvara prije puštanja?`; `Jedno kratko krivotvorenje`
- geometry: THIN
- A vs B: MEDIOCRE
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** Hvatate na lijevom krilu na 51. minuti (28–27). Vratar je visok i uspravan. Tvoj branič daje pola koraka prostora. Imate vremena za jedan fejk prije kontakta.

**HR question:** Koje informacije uzimate od čuvara prije puštanja?

- **optimal:** Jedno kratko krivotvorenje, pročitajte prvi korak vratara, zaradiš napušteni kut
- **good:** Trenutačno puštanje bez lažnjaka za prebijanje braniča
- **risky:** Unaprijed se posvetite udaljenom stupu prije nego što vidite prvi korak
- **poor:** Pas do Pivota čak i kada su već udvostručeni

### scn_bank_082 — Left Wing — Transition Cover Priority

- familyKey: `lw_transition_cover_priority`
- Advanced / Defence · handedness=none · perception=false
- risk **9/10** — Club sticker + incomplete  transition geometry; only defence family in bank
- coach test: **NO** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Sprintajte`; `Zaustavite`; `Zagreb`; `ispust`; `utičnic`
- geometry: INCOMPLETE — no second defender location; far-wing skip asserted
- A vs B: B stay on own wing is a real alternative — A not proven without teammate map
- difficulty: label roughly ok
- duplication: 3-way clone family (score/minute stickers)

**HR situation:** Izgubite loptu visoko na lijevoj strani nakon 9 minuta (22–21). Zagrebački ispust odmah na desno krilo. Još uvijek ste iznad linije od devet metara.

**HR question:** Koji je tvoj prvi obrambeni posao u ovoj tranziciji?

- **optimal:** Sprintajte kako biste presjekli stazu za preuzimanje dalekog krila, a zatim se vratite na stranu gola
- **good:** Vratite se na vlastito krilo i pričekajte postavljenu obranu
- **risky:** Odmah pritisnite najbližu utičnicu
- **poor:** Zaustavite se da signalizirate grešku prije oporavka

### scn_bank_083 — Left Wing — Extreme-Angle Finish

- familyKey: `lw_extreme_angle_finish`
- Expert / Attack · handedness=none · perception=false
- risk **8/10** — Expert from angle adjective; hand→shot formula; weak HR
- coach test: **BORDERLINE** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Hvatate`; `imate`; `Hvatate`; `dešnjak koji završava i zasjeni to oslobađanje`; `Nisko pri stupu preletite po podu`
- geometry: THIN — “sliver of goal”; help one step from block
- A vs B: WEAK distractors
- difficulty: labeled Expert but assessed Advanced
- duplication: 3-way clone family (score/minute stickers)

**HR situation:** Hvatate na bočnoj liniji s vidljivim samo djelićem gola nakon 9 minuta (22–21). Vratar zna da ste dešnjak koji završava i zasjeni to oslobađanje. Obrana pomoći je jedan korak od bloka.

**HR question:** Koja tehnika održava ovu završnicu na životu?

- **optimal:** Nisko pri stupu preletite po podu prije nego što pomoć stigne
- **good:** Mekano dodavanje unutra na pokrivenog polubranika
- **risky:** Snažan šut u sredinu vidljivog gola
- **poor:** Izađite izvan bočne linije i ponovno započnite napad

### scn_bank_084 — Left Wing — Simple Width Principle

- familyKey: `lw_simple_width_principle`
- Beginner / Attack · handedness=none · perception=false
- risk **6/10** — HR still machine-like; only thin positional teaching family that is salvageable
- coach test: **BORDERLINE** · recommendation: **POLISH**
- HR concerns: `Držite`; `Držite pravu širinu`; `krenite prečicom`; `Spustite do pola`; `dugo ispuštanje`
- geometry: OK for Beginner — standing 1m inside sideline
- A vs B: OK (hold width vs early cut)
- difficulty: label roughly ok
- duplication: 3-way clone family (score/minute stickers)

**HR situation:** Tvoj tim napada jednakih 6:0 u 28. minuti (28–27). Lopta je sa srednjim vanjskim. Vi ste na lijevom krilu i stojite metar unutar bočne linije dok se branič nalazi udobno.

**HR question:** Kako trebaš koristiti širinu da pomognete napadu?

- **optimal:** Držite pravu širinu na bočnoj liniji da rastegnete krilnog braniča
- **good:** Držite širinu, a zatim krenite prečicom kada središnji dio leđa gleda u tvom smjeru
- **risky:** Uđite do polubranika i zatražite loptu
- **poor:** Spustite do pola kako biste se pripremili za dugo ispuštanje

### scn_bank_096 — Left Wing — Basic Near-Post Read

- familyKey: `lw_basic_near_post_read`
- Beginner / Attack · handedness=none · perception=false
- risk **9/10** — Machine HR + simplistic GK formula + clone padding
- coach test: **NO** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Primate`; `završavate`; `vašeg`; `Vozite`; `Primate`
- geometry: QUESTIONABLE — no sideline/take-off/body orientation; “near/far” from LW not reconstructed
- A vs B: WEAK — B lob without dropped-hands cue; C/D cartoon
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** Primate na lijevom krilu protiv set 6:0 u 9 min. Rezultat 28–27. Vratar je odlutao pola koraka prema daljnjoj vratnici. Tvoj branič kasni korak i ne može blokirati.

**HR question:** Što prvo završavate?

- **optimal:** Niska završnica blizu stative prije nego što se vratar vrati u centar
- **good:** Visoki lob dalekom stativom preko vratara koji se oporavljao
- **risky:** Dodavanje unatrag lijevom vanjskom za resetiranje napada
- **poor:** Vozite unutra prema sredini protiv pomoći za oporavak

### scn_bank_091 — Left Wing — Tied Game Wing Finish

- familyKey: `lw_tied_game_wing_finish`
- Expert / Attack · handedness=none · perception=false
- risk **9/10** — Expert label from clock; contradictory score/title; fake hand shade
- coach test: **NO** · recommendation: **REMOVE / MERGE**
- HR concerns: `Primate`; `imate`; `Primate`; `sjene`; `resetiranje`
- geometry: THIN — playable angle asserted
- A vs B: WEAK
- difficulty: labeled Expert but assessed Intermediate/Advanced
- duplication: 3-way clone family (score/minute stickers)

**HR situation:** Posljednjih 90 sekundi, rezultat 14–13. Primate na lijevom krilu s kutom koji se može igrati. Vratar zasjenjuje tvoju snažnu sklonost ka desnoj ruci. Trener signalizira mirnu završnicu, a ne junaštvo.

**HR question:** Kako odlučujete o završnici pod ovim pritiskom?

- **optimal:** Jedan vratar čita, zatim završava nasuprot svoje sjene ili mijenja visinu udarca
- **good:** Vratite loptu za potpuno resetiranje unatoč kutu koji se može igrati
- **risky:** Pokušajte obrnuti završetak vrtnje kako biste iznenadili obranu
- **poor:** Udarite snažan šut bez provjere sjenila vratara

### scn_bank_104 — Left Wing — Transition Cover Priority

- familyKey: `lw_transition_cover_priority`
- Advanced / Defence · handedness=none · perception=false
- risk **9/10** — Club sticker + incomplete  transition geometry; only defence family in bank
- coach test: **NO** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Sprintajte`; `Zaustavite`; `utičnic`; `preskok`; `Zagrebački ispust odmah na desno krilo`
- geometry: INCOMPLETE — no second defender location; far-wing skip asserted
- A vs B: B stay on own wing is a real alternative — A not proven without teammate map
- difficulty: label roughly ok
- duplication: 3-way clone family (score/minute stickers)

**HR situation:** Izgubite loptu visoko na lijevoj strani nakon 9 minuta (14–13). Hamburški izlaz odmah na desno krilo. Još uvijek ste iznad linije od devet metara.

**HR question:** Koji je tvoj prvi obrambeni posao u ovoj tranziciji?

- **optimal:** Sprintajte kako biste presjekli stazu za preuzimanje dalekog krila, a zatim se vratite na stranu gola
- **good:** Vratite se na vlastito krilo i pričekajte postavljenu obranu
- **risky:** Odmah pritisnite najbližu utičnicu
- **poor:** Zaustavite se da signalizirate grešku prije oporavka

### scn_bank_112 — Left Wing — Power-Play Wing Overload

- familyKey: `lw_power_play_wing_overload`
- Advanced / Attack · handedness=none · perception=false
- risk **8/10** — HR nonsense (“bližnjeg”, “zabrtvi”, “Zaradiš napad”); power-play English framing
- coach test: **BORDERLINE** · recommendation: **TACTICAL REWRITE**
- HR concerns: `Primate`; `Držite`; `Power-Play`; `Primate`; `bližnjeg`
- geometry: THIN — “rotates one player late from middle”; pivot seal vague
- A vs B: OK
- difficulty: label roughly ok
- duplication: 4-way clone family (score/minute stickers)

**HR situation:** 6 na 5 nakon isključenja nakon 51 minute (22-21). Primate na lijevom krilu. Obrana s kratkim igračima rotira jednog igrača kasno iz sredine; Pivot zatvara bližnjeg braniča.

**HR question:** Što prvo pročitaš prije zatvaranja rotacije?

- **optimal:** Odmah napadnite kasnu rotaciju — doradiš ili nahranite zapečaćeni pivot
- **good:** Još jednom zamahnite loptom natrag oko cijelog perimetra
- **risky:** Držite krilo dok osovina ne zabrtvi dublje
- **poor:** Driblati uz bočnu liniju kako bi zaštitili posjed

## Architecture note vs RW Gold

RW Gold is a quality-architecture reference only (native position logic, geometry, A/B integrity, natural HR, honest tags).
This audit does **not** recommend mirroring RW tactics side-to-side.
LW eventually needs its own left-corner / LB-cooperation native gold bank.

## STOP

No scenarios rewritten. No deploy. No LW gold build started.
