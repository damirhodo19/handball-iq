/**
 * Left Back gold-standard families — Part B
 * Crossing / parallel / transition / game-state / defence coverage.
 * Does not overlap gold-12 or Part A (3:3, 4:2, 5+1, 4+2, open man, 1v1, shot IQ, pivot screen/lane/behind/2v2).
 */

const L = (en, hr, de) => ({ en, hr, de });

/** @type {import('./left-back-gold-families-a.mjs').GoldFamily[] | object[]} */
export const LEFT_BACK_GOLD_FAMILIES_B = [
  // ─── 1. Draw two, then wing ───
  {
    familyKey: 'lb_draw_two_wing',
    title: L(
      'Left Back — Draw Two, Then Wing',
      'Lijevi vanjski — veži dvojicu, zatim krilo',
      'Linker Rückraum — zwei binden, dann Außen',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 34,
    score: '19:18',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'passingDecisions'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You drive from nine metres against a set 6:0 at 34'. You lead 19:18. Your defender and the left half both step onto you — two bodies committed. The left wing holds width with a clear finishing lane opening as both defenders leave the outside.",
      'Krećeš u prodor s devet metara protiv postavljene obrane 6:0 u 34. minuti. Vodite 19:18. Tvoj branič i lijevi polubranitelj oboje izlaze na tebe — dva tijela su vezana. Lijevo krilo drži širinu s čistom linijom završnice dok oba braniča napuštaju vanjsku stranu.',
      'Du gehst von neun Metern gegen stehende 6:0 in Minute 34. Ihr führt 19:18. Dein Verteidiger und der linke Halbe treten beide auf dich — zwei Körper sind gebunden. Der Linksaußen hält Breite mit klarer Abschlussbahn, während beide Verteidiger die Außenlinie verlassen.',
    ),
    question: L(
      'What is the first play once two defenders commit to your drive?',
      'Što je prva akcija kad se dvojica braniča vežu na tvoj prodor?',
      'Was ist die erste Aktion, wenn zwei Verteidiger deinen Durchbruch binden?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Release early to the open left wing while both defenders are still on you',
          'Rano odigraj na otvoreno lijevo krilo dok su oba braniča još na tebi',
          'Früh auf den freien Linksaußen spielen, solange beide Verteidiger noch an dir sind',
        ),
        feedback: L(
          'Correct — drawing two creates the wing finish; the value is the early pass, not your own contested shot.',
          'Točno — vezivanje dvojice stvara završnicu na krilu; vrijednost je rano dodavanje, ne tvoj otežan šut.',
          'Richtig — zwei binden öffnet den Außenabschluss; der Wert ist der frühe Pass, nicht dein umkämpfter Wurf.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the outer defender recovers toward the wing, recycle one pass and re-attack the gap',
          'Ako se vanjski branič vraća prema krilu, vrati jedno dodavanje i ponovo napadni prostor',
          'Wenn der äußere Verteidiger zum Außen zurückkehrt, einen Pass zurück und die Lücke neu angreifen',
        ),
        feedback: L(
          'Good — valid if the wing lane closes, but slower than punishing the double commitment immediately.',
          'Dobro — vrijedi ako se linija na krilo zatvori, ali sporije od kažnjavanja dvostrukog izlaska odmah.',
          'Gut — sinnvoll wenn die Außenbahn schließt, aber langsamer als die Doppelbindung sofort zu bestrafen.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force a jump shot through both committed defenders',
          'Forsiraj skok-šut kroz oba vezana braniča',
          'Einen Sprungwurf durch beide gebundenen Verteidiger erzwingen',
        ),
        feedback: L(
          'Risky — you already drew two; shooting into both bodies wastes the wing gift.',
          'Rizično — već si vezao dvojicu; šut u oba tijela baca dar na krilu.',
          'Riskant — du hast schon zwei gebunden; Wurf in beide Körper verschenkt den Außen.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Stop the drive and reset beyond ten metres without using the wing',
          'Zaustavi prodor i kreni ispočetka iza deset metara bez korištenja krila',
          'Den Durchbruch abbrechen und hinter zehn Meter neu aufbauen, ohne den Außen zu nutzen',
        ),
        feedback: L(
          'Poor — resetting after drawing two gives the 6:0 time to recover width.',
          'Loše — povratak u postavu nakon vezivanja dvojice daje obrani 6:0 vrijeme da vrati širinu.',
          'Schlecht — Reset nach dem Binden von zweien gibt der 6:0 Zeit, Breite zurückzuholen.',
        ),
      },
    ],
    explanation: L(
      'Cue: two defenders step onto your drive. That is the wing gift. Pass early while they are still committed. A forced shot through both bodies or a full reset throws away the overload you created.',
      'Signal: dvojica braniča izlaze na tvoj prodor. To je dar za krilo. Odigraj rano dok su još vezani. Forsirani šut kroz oba tijela ili puni povratak u postavu baca višak koji si stvorio.',
      'Signal: zwei Verteidiger treten auf deinen Durchbruch. Das ist das Geschenk für den Außen. Früh passen, solange sie gebunden sind. Erzwungener Wurf oder kompletter Reset verschenkt die Überzahl.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.1 },
  },

  // ─── 2. When NOT to cross ───
  {
    familyKey: 'lb_no_cross',
    title: L(
      'Left Back — When Not to Cross',
      'Lijevi vanjski — kada ne križaš',
      'Linker Rückraum — wann nicht kreuzen',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 22,
    score: '14:14',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'defensiveReading'],
    perception: true,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "At 22' the score is 14:14. You and the centre back prepare a crossing run against 6:0. Before the exchange, you see the left half and centre defender already open their hips for the switch — they are set for the cross. Your own 1v1 lane on the left is free for one stride.",
      'U 22. minuti Neriješeno je 14:14. Krećeš u križanje sa srednjim vanjskim protiv 6:0. Prije razmjene vidiš da lijevi polubranitelj i srednji branič već otvaraju bokove za preuzimanje — spremni su na križanje. Tvoja vlastita linija 1 na 1 lijevo slobodna je za jedan korak.',
      'In Minute 22 steht es 14:14. Du und der Rückraum Mitte bereitet eine Kreuzbewegung gegen 6:0 vor. Vor dem Tausch siehst du: linker Halber und Mitte öffnen die Hüften schon für die Übernahme — sie sind aufs Kreuzen eingestellt. Deine eigene 1-gegen-1-Bahn links ist einen Schritt frei.',
    ),
    question: L(
      'What is the signal that you should NOT cross?',
      'Koji je signal da NE križaš?',
      'Welches Signal sagt dir, dass du NICHT kreuzen sollst?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Skip the cross — attack your open 1v1 lane because the defence is already set for the switch',
          'Preskoči križanje — napadni svoju otvorenu liniju 1 na 1 jer je obrana već spremna na preuzimanje',
          'Kreuzen lassen — deine offene 1-gegen-1-Bahn angreifen, weil die Abwehr schon auf Übernahme steht',
        ),
        feedback: L(
          'Correct — when defenders show early switch hips, the cross loses value; your free lane is the real advantage.',
          'Točno — kad braniči rano pokažu bokove za preuzimanje, križanje gubi vrijednost; tvoja slobodna linija je prava prednost.',
          'Richtig — frühe Übernahme-Hüften machen Kreuzen wertlos; deine freie Bahn ist der Vorteil.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'Delay one beat, then only cross if a defender turns late after all',
          'Pričekaj jedan trenutak, pa križaj samo ako branič ipak zakasni s okretanjem',
          'Einen Moment warten und nur kreuzen, wenn ein Verteidiger doch spät dreht',
        ),
        feedback: L(
          'Good — patient, but the cue already says the switch is prepared; waiting rarely improves it.',
          'Dobro — strpljivo, ali signal već kaže da je preuzimanje spremno; čekanje rijetko popravlja situaciju.',
          'Gut — geduldig, aber das Signal zeigt schon vorbereitete Übernahme; Warten verbessert selten.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force the cross anyway to “run the planned action”',
          'Forsiraj križanje ipak da „odradiš dogovorenu akciju“',
          'Das Kreuzen trotzdem erzwingen, um „die geplante Aktion“ zu spielen',
        ),
        feedback: L(
          'Risky — crossing into a prepared switch hands organisation back to the defence.',
          'Rizično — križanje u spremno preuzimanje vraća organizaciju obrani.',
          'Riskant — Kreuzen in vorbereitete Übernahme schenkt der Abwehr Ordnung zurück.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Start the cross, then stop mid-run and bounce the ball static at nine metres',
          'Kreni u križanje, pa stani usred trčanja i driblaj statično na devet metara',
          'Kreuzen starten, mitten im Lauf stoppen und auf neun Metern statisch dribbeln',
        ),
        feedback: L(
          'Poor — aborting mid-cross kills tempo and creates an easy steal window.',
          'Loše — prekid usred križanja ubija tempo i otvara lak prozor za oduzimanje.',
          'Schlecht — Abbruch mitten im Kreuzen tötet Tempo und öffnet Diebstahlfenster.',
        ),
      },
    ],
    explanation: L(
      'Cue: defenders already open hips for the switch before you cross. That means do not cross — attack the free 1v1 lane instead. Forcing the planned cross into a prepared switch returns structure to the 6:0.',
      'Signal: braniči već otvaraju bokove za preuzimanje prije križanja. To znači — ne križaj, nego napadni slobodnu liniju 1 na 1. Forsiranje dogovorenog križanja u spremno preuzimanje vraća strukturu obrani 6:0.',
      'Signal: Verteidiger öffnen schon vor dem Kreuzen die Hüften zur Übernahme. Also nicht kreuzen — freie 1-gegen-1-Bahn angreifen. Erzwungenes Kreuzen in vorbereitete Übernahme gibt der 6:0 Struktur zurück.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.2 },
  },

  // ─── 3. Early switch → continue parallel ───
  {
    familyKey: 'lb_early_switch_parallel',
    title: L(
      'Left Back — Early Switch, Continue Parallel',
      'Lijevi vanjski — rano preuzimanje, nastavi paralelno',
      'Linker Rückraum — frühe Übernahme, parallel weiter',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 41,
    score: '23:22',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'gameReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You start a parallel run with the centre back against 6:0 at 41'. You lead 23:22. The defence switches early — your new defender is already square before you receive. Behind the early switch, a half-step gap opens toward the left wing side.",
      'Krećeš paralelno sa srednjim vanjskim protiv 6:0 u 41. minuti. Vodite 23:22. Obrana rano preuzima — novi branič je već okrenut prema tebi prije prijema. Iza ranog preuzimanja otvara se prostor pola koraka prema strani lijevog krila.',
      'Du startest parallel mit dem Rückraum Mitte gegen 6:0 in Minute 41. Ihr führt 23:22. Die Abwehr übernimmt früh — dein neuer Verteidiger steht schon frontal vor dem Empfang. Hinter der frühen Übernahme öffnet sich eine halbe Schrittlücke zur Linksaußen-Seite.',
    ),
    question: L(
      'After an early switch, what do you do next?',
      'Nakon ranog preuzimanja, što radiš sljedeće?',
      'Was machst du nach früher Übernahme als Nächstes?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Continue the parallel threat into the gap the early switch leaves — do not reset',
          'Nastavi paralelnu prijetnju u prostor koji rano preuzimanje ostavlja — ne vraćaj se u postavu',
          'Die parallele Bedrohung in die Lücke der frühen Übernahme weiterführen — nicht neu aufbauen',
        ),
        feedback: L(
          'Correct — early switches create side gaps; continuing parallel punishes them before the 6:0 reseats.',
          'Točno — rana preuzimanja stvaraju bočne prostore; nastavak paralelno kažnjava ih prije nego se 6:0 ponovo sjedne.',
          'Richtig — frühe Übernahmen öffnen Seitenlücken; parallel weiter bestraft sie, bevor die 6:0 neu sitzt.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'One short fake to freeze the squared defender, then decide drive or wing pass',
          'Jedna kratka finta da zamrzneš okrenutog braniča, zatim odluči prodor ili dodavanje na krilo',
          'Kurze Finte zum Fixieren des frontal stehenden Verteidigers, dann Durchbruch oder Außenpass',
        ),
        feedback: L(
          'Good — can work, but slower than attacking the gap the switch already opened.',
          'Dobro — može proći, ali sporije od napada na prostor koji je preuzimanje već otvorilo.',
          'Gut — kann funktionieren, aber langsamer als die schon geöffnete Lücke anzugreifen.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Stop and restart a full crossing action after the switch lands',
          'Stani i pokreni potpuno novo križanje nakon što preuzimanje sjedne',
          'Stoppen und nach der Übernahme eine komplette Kreuzaktion neu starten',
        ),
        feedback: L(
          'Risky — restarting after an early switch gives the defence the reset it wanted.',
          'Rizično — ponovni start nakon ranog preuzimanja daje obrani povratak u postavu koji je htjela.',
          'Riskant — Neustart nach früher Übernahme schenkt der Abwehr den gewünschten Reset.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Bounce the ball and wait for the original defender match-up to return',
          'Driblaj i čekaj da se vrati originalni par braniča',
          'Dribbeln und warten, bis die ursprüngliche Zuordnung zurückkehrt',
        ),
        feedback: L(
          'Poor — waiting for the old match-up never comes; the gap closes meanwhile.',
          'Loše — čekanje starog para ne dolazi; prostor se u međuvremenu zatvara.',
          'Schlecht — Warten auf die alte Zuordnung kommt nicht; die Lücke schließt sich.',
        ),
      },
    ],
    explanation: L(
      'Cue: the defence switches early and leaves a side gap. Continue the parallel threat into that gap — do not reset or invent a new cross. The advantage is tempo after the switch, not waiting for your old match-up.',
      'Signal: obrana rano preuzima i ostavlja bočni prostor. Nastavi paralelnu prijetnju u taj prostor — ne vraćaj se u postavu i ne izmišljaj novo križanje. Prednost je tempo nakon preuzimanja, ne čekanje starog para.',
      'Signal: frühe Übernahme lässt eine Seitenlücke. Parallel in diese Lücke weiter — kein Reset, kein neues Kreuzen. Der Vorteil ist Tempo nach der Übernahme, nicht Warten auf die alte Zuordnung.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.3 },
  },

  // ─── 4. Double cross timing ───
  {
    familyKey: 'lb_double_cross',
    title: L(
      'Left Back — Double Crossing Timing',
      'Lijevi vanjski — tajming duplog križanja',
      'Linker Rückraum — Timing des Doppelkreuzens',
    ),
    difficulty: 'Expert',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 48,
    score: '26:25',
    defensiveSystem: '6-0',
    skillTags: ['gameReading', 'defensiveReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You run the first cross with the centre back against a compact 6:0 at 48'. You lead 26:25. The first switch is clean — defenders settle. The right back is already starting the second cross toward you. Your defender is still half-turned from the first exchange; the second cross window is one stride wide.",
      'Radiš prvo križanje sa srednjim vanjskim protiv zbijene 6:0 u 48. minuti. Vodite 26:25. Prvo preuzimanje je čisto — braniči sjedaju. Desni vanjski već kreće u drugo križanje prema tebi. Tvoj branič je još napola okrenut od prve razmjene; prozor drugog križanja širok je jedan korak.',
      'Du kreuzt zuerst mit dem Rückraum Mitte gegen kompakte 6:0 in Minute 48. Ihr führt 26:25. Die erste Übernahme ist sauber — Verteidiger setzen sich. Der rechte Rückraum startet schon das zweite Kreuzen zu dir. Dein Verteidiger ist von der ersten Aktion noch halb gedreht; das Fenster fürs zweite Kreuzen ist einen Schritt breit.',
    ),
    question: L(
      'When must the second cross be attacked?',
      'Kada moraš napasti drugo križanje?',
      'Wann muss das zweite Kreuzen angegriffen werden?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Attack on the catch of the second cross before the half-turned defender squares',
          'Napadni iz prijema drugog križanja prije nego se napola okrenuti branič poravna',
          'Beim Empfang des zweiten Kreuzens angreifen, bevor der halb gedrehte Verteidiger frontal steht',
        ),
        feedback: L(
          'Correct — double-cross value lives in the second switch window; delay kills it.',
          'Točno — vrijednost duplog križanja živi u prozoru drugog preuzimanja; kašnjenje ga ubija.',
          'Richtig — Doppelkreuzen lebt vom zweiten Übernahmefenster; Verzögerung tötet es.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the second defender recovers early, recycle and restart width instead of forcing',
          'Ako se drugi branič rano vrati, recikliraj i vrati širinu umjesto forsiranja',
          'Wenn der zweite Verteidiger früh zurückkommt, recyceln und Breite neu aufbauen statt Zwang',
        ),
        feedback: L(
          'Good — correct when the window closes, but here the half-turn still offers a clean attack.',
          'Dobro — točno kad se prozor zatvori, ali ovdje napola okretanje još nudi čist napad.',
          'Gut — richtig wenn das Fenster schließt, hier bietet die Halbdrehung aber noch klaren Angriff.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Hold after the second catch and wait for a third cross',
          'Nakon drugog prijema drži i čekaj treće križanje',
          'Nach dem zweiten Empfang halten und auf ein drittes Kreuzen warten',
        ),
        feedback: L(
          'Risky — a third cross against a settled 6:0 is empty movement.',
          'Rizično — treće križanje protiv sjednute 6:0 prazno je kretanje.',
          'Riskant — drittes Kreuzen gegen gesetzte 6:0 ist leere Bewegung.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Shoot immediately after the first cross without waiting for the second action',
          'Šutiraj odmah nakon prvog križanja bez čekanja druge akcije',
          'Sofort nach dem ersten Kreuzen werfen, ohne die zweite Aktion abzuwarten',
        ),
        feedback: L(
          'Poor — you already committed to the double; early shot wastes the prepared second window.',
          'Loše — već ste krenuli u duplo; rani šut baca pripremljeni drugi prozor.',
          'Schlecht — ihr seid schon im Doppel; früher Wurf verschenkt das zweite Fenster.',
        ),
      },
    ],
    explanation: L(
      'Cue: first switch settles, but your defender is still half-turned as the second cross arrives. Attack on that catch. Holding for a third cross or shooting after only the first action wastes the double-cross timing.',
      'Signal: prvo preuzimanje sjedne, ali je tvoj branič još napola okrenut kad stiže drugo križanje. Napadni iz tog prijema. Čekanje trećeg križanja ili šut samo nakon prve akcije baca tajming duplog križanja.',
      'Signal: erste Übernahme sitzt, aber dein Verteidiger ist beim zweiten Kreuzen noch halb gedreht. Beim Empfang angreifen. Warten aufs Dritte oder Wurf schon nach der ersten Aktion verschenkt das Doppelkreuzen-Timing.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.1 },
  },

  // ─── 5. Fake cross, stay ───
  {
    familyKey: 'lb_fake_cross_stay',
    title: L(
      'Left Back — Fake Cross, Attack Original Side',
      'Lijevi vanjski — lažno križanje, napadni originalnu stranu',
      'Linker Rückraum — Scheinkreuzen, Originalseite angreifen',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 17,
    score: '10:11',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'decisionMaking'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You show a crossing start with the centre back at 17'. You trail 10:11. Both defenders slide early toward the exchange. Your original left lane opens behind them as they commit to the fake cross path. The left wing stays wide.",
      'Pokazuješ početak križanja sa srednjim vanjskim u 17. minuti. Gubite 10:11. Oba braniča rano klize prema razmjeni. Tvoja originalna lijeva linija otvara se iza njih dok se vežu na putanju lažnog križanja. Lijevo krilo drži širinu.',
      'Du zeigst einen Kreuzstart mit dem Rückraum Mitte in Minute 17. Ihr liegt 10:11 zurück. Beide Verteidiger schieben früh zur Tauschbahn. Deine originale linke Bahn öffnet sich hinter ihnen, während sie der Scheinkreuzbahn folgen. Der Linksaußen bleibt breit.',
    ),
    question: L(
      'How do you use the fake cross?',
      'Kako koristiš lažno križanje?',
      'Wie nutzt du das Scheinkreuzen?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Abort the real cross and attack your original side into the space the slide leaves',
          'Prekini pravo križanje i napadni originalnu stranu u prostor koji klizanje ostavlja',
          'Echtes Kreuzen abbrechen und die Originalseite in den freigewordenen Raum angreifen',
        ),
        feedback: L(
          'Correct — the fake’s value is the vacated original lane, not completing the exchange.',
          'Točno — vrijednost lažnog križanja je napuštena originalna linija, ne dovršavanje razmjene.',
          'Richtig — der Wert des Scheinkreuzens ist die verlassene Originalbahn, nicht der Tausch selbst.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If a defender recovers to your original side, finish the real cross after all',
          'Ako se branič vrati na originalnu stranu, dovrši pravo križanje ipak',
          'Wenn ein Verteidiger auf die Originalseite zurückkommt, das echte Kreuzen doch zu Ende spielen',
        ),
        feedback: L(
          'Good — correct adaptation if the slide recovers; here the original lane is still open.',
          'Dobro — točna prilagodba ako se klizanje vrati; ovdje je originalna linija još otvorena.',
          'Gut — richtige Anpassung bei Rückkehr; hier ist die Originalbahn noch offen.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Complete the full cross into the defenders who already slid onto that path',
          'Dovrši puno križanje u braniče koji su već kliznuli na tu putanju',
          'Das volle Kreuzen in die Verteidiger spielen, die schon auf diese Bahn geschoben haben',
        ),
        feedback: L(
          'Risky — finishing the cross into prepared sliding defenders removes the fake’s edge.',
          'Rizično — dovršavanje križanja u spremne klizne braniče gubi prednost lažne akcije.',
          'Riskant — Kreuzen in vorbereitete Schieber nimmt dem Schein den Vorteil.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Stop after the fake and bounce without threatening either side',
          'Stani nakon lažne akcije i driblaj bez prijetnje ni na jednoj strani',
          'Nach dem Schein stoppen und dribbeln, ohne eine Seite zu bedrohen',
        ),
        feedback: L(
          'Poor — a dead fake with no attack gifts the defence a free reset.',
          'Loše — mrtva lažna akcija bez prijetnje daje obrani besplatan povratak u postavu.',
          'Schlecht — toter Schein ohne Bedrohung schenkt der Abwehr einen freien Reset.',
        ),
      },
    ],
    explanation: L(
      'Cue: defenders slide early onto the shown cross path and leave your original lane. Abort the real cross and attack that vacated side. Completing the exchange into prepared sliding defenders wastes the fake.',
      'Signal: braniči rano klize na pokazanu putanju križanja i ostavljaju tvoju originalnu liniju. Prekini pravo križanje i napadni napuštenu stranu. Dovršavanje razmjene u spremne klizne braniče baca lažnu akciju.',
      'Signal: Verteidiger schieben früh auf die gezeigte Kreuzbahn und lassen deine Originalseite. Echtes Kreuzen abbrechen und die freigewordene Seite angreifen. Tausch in vorbereitete Schieber verschenkt den Schein.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.2 },
  },

  // ─── 6. Parallel creates space for CB ───
  {
    familyKey: 'lb_parallel_for_cb',
    title: L(
      'Left Back — Parallel Opens Centre Back',
      'Lijevi vanjski — paralelno otvara srednjeg vanjskog',
      'Linker Rückraum — Parallel öffnet Rückraum Mitte',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 29,
    score: '16:15',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'defensiveReading', 'passingDecisions'],
    perception: true,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You run a hard parallel threat from the left at 29'. You lead 16:15 against 6:0. Both left-side defenders step with your run. Behind them, the centre back receives with a clean driving lane and the pivot sealed on his side.",
      'Radiš jaku paralelnu prijetnju s lijeve strane u 29. minuti. Vodite 16:15 protiv 6:0. Oba braniča s lijeve strane idu s tvojim trčanjem. Iza njih srednji vanjski prima s čistom linijom prodora i pivotom zatvorenim na njegovoj strani.',
      'Du drohst hart parallel von links in Minute 29. Ihr führt 16:15 gegen 6:0. Beide linken Verteidiger gehen mit deinem Lauf mit. Dahinter empfängt der Rückraum Mitte mit klarer Durchbruchbahn und abgedichtetem Kreisläufer auf seiner Seite.',
    ),
    question: L(
      'Which option opens next?',
      'Koja će se opcija otvoriti sljedeća?',
      'Welche Option öffnet sich als Nächstes?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'The centre back’s drive or pivot connection — your parallel pulled the left side away',
          'Prodor ili veza sa pivotom kod srednjeg vanjskog — tvoje paralelno odvuklo je lijevu stranu',
          'Durchbruch oder Kreisläufer-Verbindung beim Rückraum Mitte — dein Parallel hat die linke Seite weggezogen',
        ),
        feedback: L(
          'Correct — parallel’s job is to drag defenders; the next value is central, not your own forced finish.',
          'Točno — posao paralelnog je odvući braniče; sljedeća vrijednost je u sredini, ne tvoja forsiranja završnica.',
          'Richtig — Parallel soll Verteidiger ziehen; der nächste Wert liegt zentral, nicht in deinem Zwangsabschluss.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the centre is covered, recycle back to you for a second parallel threat',
          'Ako je sredina pokrivena, vrati loptu na tebe za drugu paralelnu prijetnju',
          'Wenn die Mitte zugestellt ist, den Ball zu dir zurück für eine zweite Parallel-Drohung',
        ),
        feedback: L(
          'Good — valid recycle if central closes, but here the centre lane is already open.',
          'Dobro — valjano vraćanje lopte ako se sredina zatvori, ali ovdje je središnja linija već otvorena.',
          'Gut — sinnvolles Recyceln wenn Mitte schließt; hier ist die zentrale Bahn schon offen.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force your own jump shot while both left defenders are still on you',
          'Forsiraj vlastiti skok-šut dok su oba lijeva braniča još na tebi',
          'Eigenen Sprungwurf erzwingen, während beide linken Verteidiger noch an dir sind',
        ),
        feedback: L(
          'Risky — you created the central gift; shooting into the dragged pair wastes it.',
          'Rizično — stvorio si dar u sredini; šut u odvučeni par to baca.',
          'Riskant — du hast das zentrale Geschenk geschaffen; Wurf in das mitgezogene Paar verschenkt es.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Ignore the open centre and swing empty to the right wing under no pressure',
          'Ignoriraj otvorenu sredinu i prazno prebaci na desno krilo bez pritiska',
          'Die offene Mitte ignorieren und ohne Druck leer auf den Rechtsaußen schwingen',
        ),
        feedback: L(
          'Poor — empty far-side swing after creating a central lane kills the advantage.',
          'Loše — prazan transfer na daleku stranu nakon stvorene središnje linije ubija prednost.',
          'Schlecht — leerer Swing auf die ferne Seite nach zentraler Bahn tötet den Vorteil.',
        ),
      },
    ],
    explanation: L(
      'Cue: your parallel pulls both left defenders and frees the centre back with a sealed pivot. The next option is central — drive or pivot connection. Forcing your own shot into the dragged pair or swinging empty far side wastes the parallel.',
      'Signal: tvoje paralelno odvlači oba lijeva braniča i oslobađa srednjeg vanjskog sa zatvorenim pivotom. Sljedeća opcija je središnja — prodor ili veza s pivotom. Forsirani vlastiti šut u odvučeni par ili prazan transfer daleko baca paralelno.',
      'Signal: dein Parallel zieht beide linken Verteidiger und öffnet den Rückraum Mitte mit Kreisläufer. Nächste Option ist zentral — Durchbruch oder Kreisläufer. Eigener Zwangswurf oder leerer Swing verschenkt das Parallel.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.0 },
  },

  // ─── 7. 5v6 short-handed attack ───
  {
    familyKey: 'lb_5v6_attack',
    title: L(
      'Left Back — Short-Handed 5v6 Attack',
      'Lijevi vanjski — napad s igračem manje 5 na 6',
      'Linker Rückraum — Unterzahlangriff 5 gegen 6',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 38,
    score: '21:20',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'shotSelection'],
    perception: false,
    numerical: '5v6',
    gameState: 'none',
    situation: L(
      "You are a player down at 38'. You lead 21:20. Against a packed 6:0 you receive on the left at nine metres. The wing is covered, the pivot is sealed but the passing lane is tight. A half-step gap appears between left half and centre — enough for a controlled finish, not a wild drive.",
      'Igrate s igračem manje u 38. minuti. Vodite 21:20. Protiv zbijene 6:0 primaš lijevo na devet metara. Krilo je pokriveno, pivot je zatvoren ali je linija dodavanja uska. Između lijevog polubranitelja i sredine otvara se prostor pola koraka — dovoljno za kontroliranu završnicu, ne za divlji prodor.',
      'Ihr seid in Unterzahl in Minute 38. Ihr führt 21:20. Gegen kompakte 6:0 empfängst du links auf neun Metern. Außen ist zugestellt, Kreisläufer abgedichtet aber Passspur eng. Zwischen linkem Halben und Mitte öffnet sich eine halbe Schrittlücke — genug für kontrollierten Abschluss, nicht für wilden Durchbruch.',
    ),
    question: L(
      'How do you attack short-handed?',
      'Kako napadaš s igračem manje?',
      'Wie greifst du in Unterzahl an?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Take the controlled finish into the clean half-step gap — no high-risk hero ball',
          'Uzmi kontroliranu završnicu u čist prostor pola koraka — bez visokorizične heroj-lopte',
          'Kontrollierten Abschluss in die klare halbe Schrittlücke — kein hochriskanter Heldenball',
        ),
        feedback: L(
          'Correct — short-handed attacks need careful high-percentage finishes, not chaos.',
          'Točno — napad s igračem manje traži pažljive završnice visokog postotka, ne kaos.',
          'Richtig — Unterzahlangriff braucht sorgfältige High-Percentage-Abschlüsse, kein Chaos.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the gap closes, recycle patiently and look for the next clean lane',
          'Ako se prostor zatvori, strpljivo recikliraj i traži sljedeću čistu liniju',
          'Wenn die Lücke schließt, geduldig recyceln und die nächste klare Bahn suchen',
        ),
        feedback: L(
          'Good — patience is right when nothing is clean; here a half-step gap already exists.',
          'Dobro — strpljenje je točno kad ništa nije čisto; ovdje prostor pola koraka već postoji.',
          'Gut — Geduld ist richtig wenn nichts klar ist; hier gibt es schon eine halbe Schrittlücke.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force a deep drive through the packed middle hoping for a foul',
          'Forsiraj duboki prodor kroz zbijenu sredinu u nadi na prekršaj',
          'Tiefen Durchbruch durch die kompakte Mitte erzwingen und auf Foul hoffen',
        ),
        feedback: L(
          'Risky — foul fishing in 5v6 often ends as a turnover or easy block.',
          'Rizično — lov na prekršaj u 5 na 6 često završi izgubljenom loptom ili lakim blokom.',
          'Riskant — Foul-Hoffen in 5 gegen 6 endet oft als Ballverlust oder leichter Block.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Lob the covered wing under pressure to “create something”',
          'Pod pritiskom lobaj na pokriveno krilo da „nešto stvoriš“',
          'Unter Druck einen Lob auf den zugestellten Außen spielen, um „etwas zu schaffen“',
        ),
        feedback: L(
          'Poor — covered-wing gambles in short-handed play gift easy counters.',
          'Loše — kockanje na pokriveno krilo s igračem manje daruje lake kontranapade.',
          'Schlecht — Risiko auf zugestellten Außen in Unterzahl schenkt leichte Gegenstöße.',
        ),
      },
    ],
    explanation: L(
      'Cue: player down, packed 6:0, but a clean half-step gap. Take the controlled finish. Do not force hero drives or covered-wing lobs — short-handed possessions must protect the ball and take high-percentage looks.',
      'Signal: igrač manje, zbijena 6:0, ali čist prostor pola koraka. Uzmi kontroliranu završnicu. Ne forsiraj heroj-prodore ni lobove na pokriveno krilo — posjedi s igračem manje moraju nježno čuvati loptu i uzimati završnice visokog postotka.',
      'Signal: Unterzahl, kompakte 6:0, aber klare halbe Schrittlücke. Kontrolliert abschließen. Keine Helden-Durchbrüche oder Lobs auf zugestellten Außen — Unterzahlbesitz muss den Ball schützen und High-Percentage-Würfe nehmen.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.3 },
  },

  // ─── 8. After exclusion ends ───
  {
    familyKey: 'lb_after_exclusion_6v6',
    title: L(
      'Left Back — Tempo After Exclusion Ends',
      'Lijevi vanjski — tempo nakon isteka isključenja',
      'Linker Rückraum — Tempo nach Ablauf der Zeitstrafe',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 44,
    score: '24:23',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'gameReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "The opponent’s two-minute exclusion just ended at 44'. You lead 24:23. Their returning player is still jogging into the 6:0 from the sideline. You have the ball on the left at nine metres — the structure is 6v6 on paper, but one defender is not yet set.",
      'Protivničko dvominutno isključenje upravo je isteklo u 44. minuti. Vodite 24:23. Njihov povratnik još trči u 6:0 s bočne linije. Imaš loptu lijevo na devet metara — na papiru je 6 na 6, ali jedan branič još nije postavljen.',
      'Die gegnerische Zweiminutenstrafe ist gerade abgelaufen in Minute 44. Ihr führt 24:23. Ihr Rückkehrer joggt noch von der Seitenlinie in die 6:0. Du hast den Ball links auf neun Metern — auf dem Papier 6 gegen 6, aber ein Verteidiger ist noch nicht gesetzt.',
    ),
    question: L(
      'What is the tempo decision as the exclusion ends?',
      'Kakva je odluka o tempu kad isključenje isteče?',
      'Welche Tempoentscheidung gilt beim Ablauf der Zeitstrafe?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Attack immediately into the unsettled side before the returning defender sets',
          'Napadni odmah u nestabilnu stranu prije nego se povratnik postavi',
          'Sofort die ungesetzte Seite angreifen, bevor der Rückkehrer steht',
        ),
        feedback: L(
          'Correct — the brief window after exclusion ends is still numerical in practice.',
          'Točno — kratki prozor nakon isteka isključenja i dalje je višak u praksi.',
          'Richtig — das kurze Fenster nach Ablauf ist praktisch noch Überzahl.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'One quick swing to the opposite side if that returning lane closes first',
          'Jedan brzi transfer na suprotnu stranu ako se ta povratna linija prva zatvori',
          'Ein schneller Swing auf die Gegenseite, wenn diese Rückkehrbahn zuerst schließt',
        ),
        feedback: L(
          'Good — valid if your side closes; here the unsettled defender is still your side.',
          'Dobro — vrijedi ako se tvoja strana zatvori; ovdje nestabilni branič još je na tvojoj strani.',
          'Gut — sinnvoll wenn deine Seite schließt; hier ist der ungesetzte Verteidiger noch deine Seite.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Hold and wait for a perfect set play once all six defenders are ready',
          'Drži i čekaj savršenu postavljenu akciju kad svih šest braniča bude spremno',
          'Halten und auf perfektes Positionsangriffsspiel warten, bis alle sechs Verteidiger stehen',
        ),
        feedback: L(
          'Risky — waiting for full set structure gifts away the returning-player window.',
          'Rizično — čekanje pune strukture odbacuje prozor dok se povratnik još postavlja.',
          'Riskant — Warten auf volle Struktur verschenkt das Fenster des Rückkehrers.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Call a timeout to redraw after the exclusion has already ended',
          'Traži minutu odmora za novi crtež nakon što je isključenje već isteklo',
          'Auszeit fordern für neue Zeichnung, obwohl die Zeitstrafe schon vorbei ist',
        ),
        feedback: L(
          'Poor — burning a timeout after the window opens stops the attack you should take now.',
          'Loše — trošenje minute odmora nakon što se prozor otvorio zaustavlja napad koji trebaš uzeti sad.',
          'Schlecht — Auszeit nach geöffnetem Fenster stoppt den Angriff, den du jetzt nehmen sollst.',
        ),
      },
    ],
    explanation: L(
      'Cue: exclusion just ended, returning defender still jogging in. Attack the unsettled side immediately — on paper 6v6, in practice still a window. Holding for a perfect set play gifts the defence the reset.',
      'Signal: isključenje upravo isteklo, povratnik još trči unutra. Napadni nestabilnu stranu odmah — na papiru 6 na 6, u praksi još prozor. Čekanje savršene postavljene akcije daje obrani povratak u postavu.',
      'Signal: Zeitstrafe gerade abgelaufen, Rückkehrer noch unterwegs. Ungesetzte Seite sofort angreifen — auf dem Papier 6 gegen 6, praktisch noch Fenster. Warten auf perfekten Positionsangriff schenkt der Abwehr den Reset.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.4 },
  },

  // ─── 9. Transition 3v2 ───
  {
    familyKey: 'lb_transition_3v2',
    title: L(
      'Left Back — Transition 3v2',
      'Lijevi vanjski — tranzicija 3 na 2',
      'Linker Rückraum — Übergang 3 gegen 2',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 12,
    score: '7:6',
    defensiveSystem: undefined,
    skillTags: ['fastBreakTiming', 'decisionMaking'],
    perception: false,
    numerical: 'transition',
    gameState: 'none',
    situation: L(
      "You steal the ball and push a first-wave break at 12'. You lead 7:6. You have two teammates ahead — left wing and centre back — against two recovering defenders. You receive in the middle of the three at speed with a clear passing lane to either side.",
      'Oduzimaš loptu i guraš prvi val u 12. minuti. Vodite 7:6. Imaš dvojicu suigrača ispred — lijevo krilo i srednji vanjski — protiv dvojice braniča u povratku. Primaš u sredini trojke u trčanju s čistom linijom dodavanja na obje strane.',
      'Du eroberst den Ball und gehst in die erste Welle in Minute 12. Ihr führt 7:6. Zwei Mitspieler voraus — Linksaußen und Rückraum Mitte — gegen zwei zurücklaufende Verteidiger. Du empfängst in der Mitte der Drei im Tempo mit klarer Passspur zu beiden Seiten.',
    ),
    question: L(
      'How do you finish the 3v2?',
      'Kako završavaš situaciju 3 na 2?',
      'Wie schließt du das 3 gegen 2 ab?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Commit one defender with a short threat, then release to the free teammate at speed',
          'Veži jednog braniča kratkom prijetnjom, zatim odigraj na slobodnog suigrača u trčanju',
          'Einen Verteidiger mit kurzer Drohung binden, dann im Tempo auf den freien Mitspieler spielen',
        ),
        feedback: L(
          'Correct — 3v2 needs one bind, then the free man; early empty passes or solo heroics break the math.',
          'Točno — 3 na 2 traži jedno vezivanje, zatim slobodnog; rana prazna dodavanja ili solo heroizam kvare matematiku.',
          'Richtig — 3 gegen 2 braucht eine Bindung, dann den Freien; leere Frühpässe oder Solo zerstören die Rechnung.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If both defenders freeze on you, take the shot yourself from the open middle',
          'Ako se oba braniča zamrznu na tebi, uzmi šut sam iz otvorene sredine',
          'Wenn beide Verteidiger auf dir einfrieren, selbst aus der offenen Mitte werfen',
        ),
        feedback: L(
          'Good — correct if they both freeze; usually one still slides, so the free man is cleaner.',
          'Dobro — točno ako se oboje zamrznu; obično jedan ipak klizi, pa je slobodni čistiji.',
          'Gut — richtig wenn beide einfrieren; meist schiebt einer, der Freie ist sauberer.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Pass immediately without binding anyone, hoping a teammate is free',
          'Odmah dodaj bez vezivanja ikoga, u nadi da je suigrač slobodan',
          'Sofort passen ohne jemanden zu binden, in der Hoffnung ein Mitspieler sei frei',
        ),
        feedback: L(
          'Risky — unbound early passes let both defenders cover the receivers.',
          'Rizično — rana dodavanja bez vezivanja dopuštaju oba braniča da pokriju primatelje.',
          'Riskant — frühe Pässe ohne Bindung lassen beide Verteidiger die Empfänger stellen.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Stop at nine metres and wait for the rest of the team to build a set attack',
          'Stani na devet metara i čekaj ostatak momčadi za pozicijski napad',
          'Auf neun Metern stoppen und auf den Rest für Positionsangriff warten',
        ),
        feedback: L(
          'Poor — stopping a live 3v2 turns numerical advantage into a settled 6v6.',
          'Loše — zaustavljanje živog 3 na 2 pretvara brojčanu prednost u sjednutih 6 na 6.',
          'Schlecht — Stoppen eines live 3 gegen 2 macht aus Überzahl eine gesetzte 6 gegen 6.',
        ),
      },
    ],
    explanation: L(
      'Cue: live 3v2 with you in the middle at speed. Bind one defender, then release to the free teammate. Empty early passes or stopping to wait for set attack kills the numerical advantage.',
      'Signal: živo 3 na 2 s tobom u sredini u trčanju. Veži jednog braniča, zatim odigraj na slobodnog. Prazna rana dodavanja ili stajanje u čekanju pozicijskog napada ubija brojčanu prednost.',
      'Signal: live 3 gegen 2 mit dir in der Mitte im Tempo. Einen binden, dann auf den Freien. Leere Frühpässe oder Stoppen auf Positionsangriff stammt die Überzahl.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.15 },
  },

  // ─── 10. Opponent empty goal ───
  {
    familyKey: 'lb_opp_empty_goal_risk',
    title: L(
      'Left Back — Opponent Empty Goal Risk',
      'Lijevi vanjski — rizik protiv praznog gola',
      'Linker Rückraum — Risiko bei leerem Gegnertor',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Final Minutes',
    minute: 58,
    score: '29:29',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'shotSelection'],
    perception: false,
    numerical: '6v6',
    gameState: 'empty_goal_opp',
    situation: L(
      "At 58' it is 29:29. The opponent’s goalkeeper is out — their goal is empty. You receive on the left with a contested mid-range look and a safer bounce lane to the sealed pivot. A turnover here is a free long shot the other way.",
      'U 58. minuti Neriješeno je 29:29. Protivnički vratar je vani — gol im je prazan. Primaš lijevo s otežanim šutom iz srednje distance i sigurnijom linijom odskoka na zatvorenog pivota. Izgubljena lopta ovdje je besplatan dugi šut u drugu stranu.',
      'In Minute 58 steht es 29:29. Der gegnerische Torwart ist draußen — ihr Tor ist leer. Du empfängst links mit umkämpftem Mittelstreckenwurf und sichererer Absprungbahn zum abgedichteten Kreisläufer. Ballverlust hier ist ein freier Weitschuss zurück.',
    ),
    question: L(
      'What matters most with their goal empty?',
      'Što je najvažnije dok im je gol prazan?',
      'Was zählt am meisten bei ihrem leeren Tor?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Choose the safer high-percentage action — pivot bounce over a contested mid-range gamble',
          'Izaberi sigurniju akciju visokog postotka — odskok na pivota umjesto kockanja otežanim šutom iz sredine',
          'Die sicherere High-Percentage-Aktion — Absprung zum Kreisläufer statt Riskowurf aus der Mitte',
        ),
        feedback: L(
          'Correct — empty-goal states punish turnovers more than they reward low-percentage shots.',
          'Točno — stanje praznog gola kažnjava gubitak lopte više nego što nagrađuje šuteve niskog postotka.',
          'Richtig — leeres Tor bestraft Ballverlust stärker, als es Low-Percentage-Würfe belohnt.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the pivot lane closes, take only a clean, balanced shot — never off-balance',
          'Ako se linija na pivota zatvori, uzmi samo čist, uravnotežen šut — nikad iz neravnoteže',
          'Wenn die Kreisläuferbahn schließt, nur einen klaren, ausbalancierten Wurf — nie aus dem Ungleichgewicht',
        ),
        feedback: L(
          'Good — clean shot is acceptable if pass dies; contested off-balance is not.',
          'Dobro — čist šut je prihvatljiv ako dodavanje umre; otežan iz neravnoteže nije.',
          'Gut — klarer Wurf geht wenn Pass stirbt; umkämpft aus dem Ungleichgewicht nicht.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force a long jump shot through contact hoping for the empty net',
          'Forsiraj dugi skok-šut kroz kontakt u nadi na praznu mrežu',
          'Langen Sprungwurf durch Kontakt erzwingen in Hoffnung auf leeres Netz',
        ),
        feedback: L(
          'Risky — contact finishes with empty goal behind still produce turnovers and free counters.',
          'Rizično — završnice kroz kontakt uz prazan gol i dalje stvaraju gubitke i besplatne kontranapade.',
          'Riskant — Kontaktabschlüsse bei leerem Tor erzeugen weiter Ballverluste und freie Gegenstöße.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Try a spectacular no-look pass across the court under pressure',
          'Pod pritiskom pokušaj spektakularno dodavanje bez gledanja preko terena',
          'Unter Druck einen spektakulären No-Look-Pass über den Platz versuchen',
        ),
        feedback: L(
          'Poor — show passes with empty goal behind are the highest-cost turnovers in the game.',
          'Loše — show-dodavanja uz prazan gol najskuplji su gubitci lopte u utakmici.',
          'Schlecht — Show-Pässe bei leerem Tor sind die teuersten Ballverluste im Spiel.',
        ),
      },
    ],
    explanation: L(
      'Cue: opponent goal empty late, your mid-range look is contested, pivot bounce is cleaner. Protect the ball — safer high-percentage action first. Forced contact shots and show passes gift free long counters the other way.',
      'Signal: protivnički gol prazan kasno, tvoj šut iz sredine otežan, odskok na pivota čistiji. Čuvaj loptu — prvo sigurnija akcija visokog postotka. Forsirani šutevi kroz kontakt i show-dodavanja daruju besplatne duge kontranapade.',
      'Signal: leeres Gegnertor spät, Mittelstreckenwurf umkämpft, Absprung zum Kreisläufer sauberer. Ball schützen — zuerst sichere High-Percentage-Aktion. Zwangswürfe und Show-Pässe schenken freie Weitschuss-Gegenstöße.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.15 },
  },

  // ─── 11. Passive — clean gap shoot ───
  {
    familyKey: 'lb_passive_gap_shoot',
    title: L(
      'Left Back — Passive Warning, Shoot the Gap',
      'Lijevi vanjski — upozorenje na pasivnu, šutiraj prostor',
      'Linker Rückraum — Passiv-Warnung, Lücke werfen',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 36,
    score: '20:20',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'pressureDecisions', 'shotSelection'],
    perception: true,
    numerical: '6v6',
    gameState: 'passive',
    situation: L(
      "The referee raises the passive-play warning at 36'. Score 20:20. You catch against 6:0 with a clean gap between left half and centre — balanced, open lane for one stride. Teammates are covered; another full swing will burn the warning.",
      'Sudac diže upozorenje na pasivnu igru u 36. minuti. Neriješeno je 20:20. Primaš protiv 6:0 s čistim prostorom između lijevog polubranitelja i sredine — uravnotežen, otvoren za jedan korak. Suigrači su pokriveni; još jedan puni transfer potrošit će upozorenje.',
      'Der Schiedsrichter hebt die Passiv-Warnung in Minute 36. Es steht 20:20. Du empfängst gegen 6:0 mit klarer Lücke zwischen linkem Halben und Mitte — ausbalanciert, einen Schritt offen. Mitspieler sind zugestellt; ein weiterer voller Swing verbrennt die Warnung.',
    ),
    question: L(
      'What do you do when the passive warning meets a clean gap?',
      'Što radiš kad se upozorenje na pasivnu digne uz čist prostor?',
      'Was tust du, wenn Passiv-Warnung auf eine klare Lücke trifft?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Shoot now into the clean gap — the warning ends empty swinging',
          'Šutiraj sad u čist prostor — upozorenje završava prazno prebacivanje',
          'Jetzt in die klare Lücke werfen — die Warnung beendet leeres Schwingen',
        ),
        feedback: L(
          'Correct — passive plus a clean lane means finish immediately.',
          'Točno — pasivna plus čista linija znači završi odmah.',
          'Richtig — Passiv plus klare Bahn heißt sofort abschließen.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'One short drive fake only if it clearly frees the same gap, then shoot',
          'Samo jedna kratka finta prodora ako jasno oslobodi isti prostor, zatim šut',
          'Nur eine kurze Durchbruchfinte wenn sie dieselbe Lücke klar öffnet, dann Wurf',
        ),
        feedback: L(
          'Good — tiny fake can help, but delay under passive is already costly.',
          'Dobro — mala finta može pomoći, ali kašnjenje pod pasivnom već skupo stoji.',
          'Gut — kleine Finte kann helfen, aber Verzögerung unter Passiv ist schon teuer.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Swing once more to the right looking for a perfect wing',
          'Još jednom prebaci desno tražeći savršeno krilo',
          'Noch einmal nach rechts schwingen und den perfekten Außen suchen',
        ),
        feedback: L(
          'Risky — extra swings after the warning often end as passive turnovers.',
          'Rizično — dodatni transferi nakon upozorenja često završe gubitkom zbog pasivne.',
          'Riskant — Extra-Swings nach der Warnung enden oft als Passiv-Ballverlust.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Bounce twice and wait for the pivot to reseal after the warning',
          'Dva puta driblaj i čekaj da se pivot ponovo zatvori nakon upozorenja',
          'Zweimal dribbeln und warten, bis der Kreisläufer nach der Warnung neu abdichtet',
        ),
        feedback: L(
          'Poor — static holding after passive warning is the classic turnover.',
          'Loše — statično držanje nakon upozorenja na pasivnu klasičan je gubitak lopte.',
          'Schlecht — statisches Halten nach Passiv-Warnung ist der klassische Ballverlust.',
        ),
      },
    ],
    explanation: L(
      'Cue: passive warning raised and you have a clean, balanced gap. Shoot now. Extra swings or static holding burn the warning into a turnover. Under passive, a clean lane ends the possession on purpose.',
      'Signal: upozorenje na pasivnu diglo se i imaš čist, uravnotežen prostor. Šutiraj sad. Dodatni transferi ili statično držanje pretvaraju upozorenje u gubitak lopte. Pod pasivnom čista linija namjerno završava posjed.',
      'Signal: Passiv-Warnung und klare, ausbalancierte Lücke. Jetzt werfen. Extra-Swings oder statisches Halten machen aus der Warnung einen Ballverlust. Unter Passiv beendet eine klare Bahn den Besitz absichtlich.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.25 },
  },

  // ─── 12. Passive — bad angle ───
  {
    familyKey: 'lb_passive_bad_angle',
    title: L(
      'Left Back — Passive, Bad Angle',
      'Lijevi vanjski — pasivna, loš kut',
      'Linker Rückraum — Passiv, schlechter Winkel',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 50,
    score: '27:26',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'passingDecisions'],
    perception: false,
    numerical: '6v6',
    gameState: 'passive',
    situation: L(
      "Passive warning is up at 50'. You lead 27:26. You are pushed wide left with a bad shooting angle — block line in front, no clean release. The pivot asks on a short bounce lane and the left wing has started a cut into space.",
      'Upozorenje na pasivnu diglo se u 50. minuti. Vodite 27:26. Gurnut si široko lijevo s lošim kutom šuta — linija bloka ispred, nema čistog ispusta. Pivot traži na kratkoj liniji odskoka, a lijevo krilo krenulo je u utrčavanje u prostor.',
      'Passiv-Warnung ist oben in Minute 50. Ihr führt 27:26. Du bist weit links mit schlechtem Wurfwinkel — Blocklinie davor, kein klarer Abwurf. Der Kreisläufer fordert auf kurzer Absprungbahn, der Linksaußen startet den Schnitt in den Raum.',
    ),
    question: L(
      'Under passive with a bad angle, what is the right finish?',
      'Pod pasivnom s lošim kutom, što je prava završnica?',
      'Unter Passiv bei schlechtem Winkel — welcher Abschluss ist richtig?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Find the pivot or cutting wing immediately — do not force the bad-angle shot',
          'Odmah nađi pivota ili utrčavanje krila — ne forsiraj šut iz lošeg kuta',
          'Sofort Kreisläufer oder einschneidenden Außen finden — keinen Wurf aus schlechtem Winkel erzwingen',
        ),
        feedback: L(
          'Correct — passive demands a finish, not any finish; bad-angle force is a low-value turnover risk.',
          'Točno — pasivna traži završnicu, ne bilo kakvu; forsiranje iz lošeg kuta nizak je postotak i rizik gubitka.',
          'Richtig — Passiv fordert Abschluss, nicht irgendeinen; Zwang aus schlechtem Winkel ist Low Percentage.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'One hard step inside only if it clearly improves the angle before the warning burns',
          'Jedan jak korak unutra samo ako jasno popravi kut prije nego upozorenje izgori',
          'Einen harten Schritt nach innen nur wenn er den Winkel klar verbessert, bevor die Warnung verbrennt',
        ),
        feedback: L(
          'Good — angle repair can work if instant; delayed steps under passive are costly.',
          'Dobro — popravak kuta može proći ako je trenutan; odgođeni koraci pod pasivnom skupi su.',
          'Gut — Winkelkorrektur geht wenn sofort; verzögerte Schritte unter Passiv sind teuer.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force the jump shot from the wide bad angle through the block',
          'Forsiraj skok-šut iz širokog lošeg kuta kroz blok',
          'Sprungwurf aus weitem schlechtem Winkel durch den Block erzwingen',
        ),
        feedback: L(
          'Risky — bad-angle shots into a block under passive are classic empty possessions.',
          'Rizično — šutevi iz lošeg kuta u blok pod pasivnom klasični su prazni posjedi.',
          'Riskant — Würfe aus schlechtem Winkel in den Block unter Passiv sind klassisch leer.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Pass backwards to reset and ignore the raised warning',
          'Dodaj unatrag za ponovni početak i zanemari dignuto upozorenje',
          'Zurückpassen zum Reset und die gehobene Warnung ignorieren',
        ),
        feedback: L(
          'Poor — backward resets after the warning are the fastest path to a passive turnover.',
          'Loše — povratno dodavanje nakon upozorenja najbrži je put do gubitka zbog pasivne.',
          'Schlecht — Rück-Reset nach der Warnung ist der schnellste Weg zum Passiv-Ballverlust.',
        ),
      },
    ],
    explanation: L(
      'Cue: passive warning plus bad shooting angle, but pivot/wing lanes exist. Find those finishes immediately. Forcing the wide shot through the block or resetting backward burns the warning into a turnover.',
      'Signal: upozorenje na pasivnu plus loš kut šuta, ali postoje linije na pivota/krilo. Odmah nađi te završnice. Forsiranje širokog šuta kroz blok ili povratno dodavanje pretvara upozorenje u gubitak lopte.',
      'Signal: Passiv-Warnung plus schlechter Winkel, aber Kreisläufer-/Außenbahnen existieren. Sofort diese Abschlüsse finden. Zwangswurf durch Block oder Rück-Reset verbrennt die Warnung zum Ballverlust.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.25 },
  },

  // ─── 13. Lead by 1 late — control ───
  {
    familyKey: 'lb_lead_one_late_control',
    title: L(
      'Left Back — Lead by One, Control Late',
      'Lijevi vanjski — vodstvo od jednog, kontrola kasno',
      'Linker Rückraum — Führung um eins, späte Kontrolle',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Final Minutes',
    minute: 57,
    score: '28:27',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'gameReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'lead_late',
    situation: L(
      "At 57' you lead 28:27. Clock management matters. You receive on the left against a set 6:0 with a messy drive lane and a clean, patient recycle to the centre back available. Chaos here can gift an equaliser possession.",
      'U 57. minuti Vodite 28:27. Upravljanje satom je važno. Primaš lijevo protiv postavljene 6:0 s neurednom linijom prodora i čistim, strpljivim povratom na srednjeg vanjskog. Kaos ovdje može darovati posjed za izjednačenje.',
      'In Minute 57 führt ihr 28:27. Uhr-Management zählt. Du empfängst links gegen stehende 6:0 mit unsauberer Durchbruchbahn und klarem, geduldigem Rückpass zum Rückraum Mitte. Chaos hier kann den Ausgleichsbesitz schenken.',
    ),
    question: L(
      'Leading by one late, what is the priority?',
      'Uz vodstvo od jednog kasno, što je prioritet?',
      'Bei Führung um eins spät — was hat Priorität?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Control the possession — recycle cleanly and only finish high-percentage looks',
          'Kontroliraj posjed — čisto recikliraj i završavaj samo akcije visokog postotka',
          'Besitz kontrollieren — sauber recyceln und nur High-Percentage-Abschlüsse nehmen',
        ),
        feedback: L(
          'Correct — a one-goal lead late rewards control more than forced chaos.',
          'Točno — vodstvo od jednog kasno nagrađuje kontrolu više od forsiranog kaosa.',
          'Richtig — Führung um eins spät belohnt Kontrolle mehr als erzwungenes Chaos.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If a sudden clean gap appears, take it — do not invent contact',
          'Ako se iznenada pojavi čist prostor, uzmi ga — ne izmišljaj kontakt',
          'Wenn plötzlich eine klare Lücke erscheint, nehmen — keinen Kontakt erfinden',
        ),
        feedback: L(
          'Good — clean finishes are always allowed; inventing hero drives is not.',
          'Dobro — čiste završnice uvijek su dozvoljene; izmišljanje heroj-prodora nije.',
          'Gut — klare Abschlüsse sind immer erlaubt; erfundene Helden-Durchbrüche nicht.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force a deep solo drive to “ice the game” through two defenders',
          'Forsiraj duboki solo prodor da „zatvoriš utakmicu“ kroz dva braniča',
          'Tiefen Solo-Durchbruch erzwingen, um das Spiel „zuzumachen“, durch zwei Verteidiger',
        ),
        feedback: L(
          'Risky — late lead turnovers from forced solos are classic equaliser gifts.',
          'Rizično — kasni gubitci iz forsiranog sola klasični su darovi za izjednačenje.',
          'Riskant — späte Ballverluste aus Solo-Zwang sind klassische Ausgleichsgeschenke.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Shoot immediately from bad balance just to end the attack early',
          'Šutiraj odmah iz loše ravnoteže samo da ranije završiš napad',
          'Sofort aus schlechter Balance werfen, nur um den Angriff früh zu beenden',
        ),
        feedback: L(
          'Poor — ending early with a bad shot often hands them a longer equaliser possession.',
          'Loše — rani kraj lošim šutom često im predaje duži posjed za izjednačenje.',
          'Schlecht — früher Schluss mit schlechtem Wurf schenkt oft längeren Ausgleichsbesitz.',
        ),
      },
    ],
    explanation: L(
      'Cue: lead by one late with a messy drive and a clean recycle. Priority is control — high-percentage only. Forced solos and early bad-balance shots gift equaliser possessions.',
      'Signal: vodstvo od jednog kasno, neuredan prodor, čist povrat. Prioritet je kontrola — samo visoki postotak. Forsirani solo i rani šutevi iz loše ravnoteže daruju posjede za izjednačenje.',
      'Signal: Führung um eins spät, unsauberer Durchbruch, sauberer Rückpass. Priorität Kontrolle — nur High Percentage. Solo-Zwang und frühe Würfe aus schlechter Balance schenken Ausgleichsbesitze.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.05 },
  },

  // ─── 14. Tie final possession ───
  {
    familyKey: 'lb_tie_final_possession',
    title: L(
      'Left Back — Tie, Final Possession',
      'Lijevi vanjski — neriješeno, posljednji posjed',
      'Linker Rückraum — Unentschieden, letzter Besitz',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Final Minutes',
    minute: 59,
    score: '30:30',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'shotSelection'],
    perception: false,
    numerical: '6v6',
    gameState: 'tie_final',
    situation: L(
      "Final possession at 59'. Score is 30:30. You receive on the left against a packed 6:0. The left wing has a clean cut opening; your own mid-range look is contested. There is no reset after this attack.",
      'Posljednji posjed u 59. minuti. Neriješeno je 30:30. Primaš lijevo protiv zbijene 6:0. Lijevo krilo ima čisto utrčavanje; tvoj šut iz srednje distance otežan je. Nakon ovog napada nema ponovnog početka.',
      'Letzter Besitz in Minute 59. Es steht 30:30. Du empfängst links gegen kompakte 6:0. Der Linksaußen hat einen klaren Schnitt; dein Mittelstreckenwurf ist umkämpft. Nach diesem Angriff gibt es keinen Reset.',
    ),
    question: L(
      'On the final tied possession, where is the best finish?',
      'Na posljednjem neriješenom posjedu, gdje je najbolja završnica?',
      'Beim letzten Unentschieden-Besitz — wo ist der beste Abschluss?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Play the clean wing cut — highest-percentage finish on the last attack',
          'Odigraj čisto utrčavanje krila — završnica najvišeg postotka na posljednjem napadu',
          'Den klaren Außenschnitt spielen — höchster Prozentsatz im letzten Angriff',
        ),
        feedback: L(
          'Correct — final tied possessions reward the cleanest finish, not ego mid-range.',
          'Točno — posljednji neriješeni posjedi nagrađuju najčistiju završnicu, ne ego šut iz sredine.',
          'Richtig — letzter Unentschieden-Besitz belohnt den klarsten Abschluss, nicht Ego-Mittelstrecke.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the wing lane dies late, take only a balanced, prepared shot yourself',
          'Ako linija na krilo kasno umre, uzmi samo uravnotežen, pripremljen šut sam',
          'Wenn die Außenbahn spät stirbt, nur einen ausbalancierten, vorbereiteten Wurf selbst',
        ),
        feedback: L(
          'Good — fallback when the wing dies; contested rush shots are still wrong.',
          'Dobro — rezervna opcija kad krilo umre; otežani brzi šutevi i dalje su krivi.',
          'Gut — Fallback wenn Außen stirbt; umkämpfte Hastwürfe bleiben falsch.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Force a contested jump shot early to “avoid a pass turnover”',
          'Rano forsiraj otežan skok-šut da „izbjegneš gubitak na dodavanju“',
          'Früh einen umkämpften Sprungwurf erzwingen, um „Passverlust zu vermeiden“',
        ),
        feedback: L(
          'Risky — avoiding a good pass by forcing a bad shot is still a low-value end.',
          'Rizično — izbjegavanje dobrog dodavanja forsiranajem lošeg šuta i dalje je slaba završnica.',
          'Riskant — guten Pass meiden und schlechten Wurf erzwingen bleibt Low Value.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Hold until the buzzer without a shot attempt',
          'Drži do sirene bez pokušaja šuta',
          'Bis zur Sirene halten ohne Wurfversuch',
        ),
        feedback: L(
          'Poor — a tied final possession must produce a finish; holding for the horn wastes it.',
          'Loše — neriješeni posljednji posjed mora proizvesti završnicu; držanje do sirene baca ga.',
          'Schlecht — Unentschieden-Letztbesitz muss Abschluss erzeugen; Halten bis zur Sirene verschenkt ihn.',
        ),
      },
    ],
    explanation: L(
      'Cue: final possession, tie, clean wing cut versus contested mid-range. Take the cleanest finish — the wing. Early forced shots or holding to the horn waste the last attack.',
      'Signal: posljednji posjed, neriješeno, čisto utrčavanje krila naspram otežanog šuta iz sredine. Uzmi najčistiju završnicu — krilo. Rani forsiran šut ili držanje do sirene baca posljednji napad.',
      'Signal: letzter Besitz, Unentschieden, klarer Außenschnitt gegen umkämpfte Mittelstrecke. Klarsten Abschluss nehmen — Außen. Früher Zwangswurf oder Halten bis zur Sirene verschenkt den letzten Angriff.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.05 },
  },

  // ─── 15. Trail — need tempo ───
  {
    familyKey: 'lb_trail_need_tempo',
    title: L(
      'Left Back — Trailing, Need Tempo',
      'Lijevi vanjski — zaostatak, treba tempo',
      'Linker Rückraum — Rückstand, Tempo nötig',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Final Minutes',
    minute: 55,
    score: '25:27',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'fastBreakTiming'],
    perception: false,
    numerical: '6v6',
    gameState: 'tempo_trail',
    situation: L(
      "At 55' you trail 25:27. You need tempo, not empty swinging. You receive on the left with a live driving lane for one stride; the defence is sliding late. Teammates are calling for another full right-side transfer that would burn eight seconds.",
      'U 55. minuti Gubite 25:27. Trebaš tempo, ne prazno prebacivanje. Primaš lijevo s živom linijom prodora za jedan korak; obrana kasni s klizanjem. Suigrači zovu još jedan puni transfer na desnu stranu koji bi potrošio osam sekundi.',
      'In Minute 55 liegt ihr 25:27 zurück. Ihr braucht Tempo, kein leeres Schwingen. Du empfängst links mit lebendiger Durchbruchbahn für einen Schritt; die Abwehr schiebt spät. Mitspieler rufen nach einem weiteren vollen Rechtstransfer, der acht Sekunden verbrennen würde.',
    ),
    question: L(
      'Trailing late, what keeps the tempo?',
      'U zaostatku kasno, što drži tempo?',
      'Im späten Rückstand — was hält das Tempo?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Attack the live lane now — empty far-side swings burn the comeback clock',
          'Napadni živu liniju sad — prazni transferi na daleku stranu pale sat povratka',
          'Die lebendige Bahn jetzt angreifen — leere Swings auf die ferne Seite verbrennen die Aufholuhr',
        ),
        feedback: L(
          'Correct — when trailing late, a live lane beats another empty swing.',
          'Točno — u zaostatku kasno živa linija pobjeđuje još jedan prazan transfer.',
          'Richtig — im späten Rückstand schlägt eine lebendige Bahn einen weiteren leeren Swing.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'One short pass to the centre only if it accelerates the same side attack',
          'Jedno kratko dodavanje na sredinu samo ako ubrzava napad na istoj strani',
          'Einen kurzen Pass zur Mitte nur wenn er denselben Seitenangriff beschleunigt',
        ),
        feedback: L(
          'Good — tempo-preserving short passes are fine; full empty swings are not.',
          'Dobro — kratka dodavanja koja čuvaju tempo su u redu; puna prazna prebacivanja nisu.',
          'Gut — tempoerhaltende Kurzpasses sind ok; volle leere Swings nicht.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Complete the full right-side swing before anyone threatens the goal',
          'Dovrši puni transfer na desnu stranu prije nego itko zaprijeti golu',
          'Den vollen Rechtsswing zu Ende spielen, bevor jemand das Tor bedroht',
        ),
        feedback: L(
          'Risky — empty swinging while trailing late is how leads become safe.',
          'Rizično — prazno prebacivanje u kasnom zaostatku čini vodstvo protivnika sigurnim.',
          'Riskant — leeres Schwingen im späten Rückstand macht Führungen sicher.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Hold above the nine and wait for a perfect set after the defence recovers',
          'Drži iznad devetke i čekaj savršenu postavu nakon što se obrana vrati',
          'Über der Neun halten und auf perfekten Aufbau warten, bis die Abwehr zurück ist',
        ),
        feedback: L(
          'Poor — waiting for perfection while trailing late gifts the defence the clock.',
          'Loše — čekanje savršenstva u kasnom zaostatku daruje obrani sat.',
          'Schlecht — Warten auf Perfektion im späten Rückstand schenkt der Abwehr die Uhr.',
        ),
      },
    ],
    explanation: L(
      'Cue: trailing late with a live left lane while teammates want an empty far swing. Attack the live lane — tempo first. Full empty transfers and waiting for perfect set play burn the comeback clock.',
      'Signal: kasni zaostatak, živa lijeva linija, a suigrači žele prazan daleki transfer. Napadni živu liniju — prvo tempo. Puna prazna prebacivanja i čekanje savršene postave pale sat povratka.',
      'Signal: später Rückstand, lebendige linke Bahn, Mitspieler wollen leeren fernen Swing. Lebendige Bahn angreifen — Tempo zuerst. Volle leere Transfers und Warten auf Perfektaufbau verbrennen die Aufholuhr.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.2 },
  },

  // ─── 16. First-wave support ───
  {
    familyKey: 'lb_transition_first_wave',
    title: L(
      'Left Back — First-Wave Support Receive',
      'Lijevi vanjski — prijem u podršci prvog vala',
      'Linker Rückraum — Empfang in der ersten Welle',
    ),
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 9,
    score: '5:4',
    defensiveSystem: undefined,
    skillTags: ['fastBreakTiming'],
    perception: false,
    numerical: 'transition',
    gameState: 'none',
    situation: L(
      "Your wing starts the first wave at 9'. You lead 5:4. You are the support runner receiving at speed just behind him. One recovering defender shades the wing; a second is still three metres late on you.",
      'Tvoje krilo kreće prvi val u 9. minuti. Vodite 5:4. Ti si trkač podrške koji prima u trčanju odmah iza njega. Jedan branič u povratku sjenači krilo; drugi kasni na tebi još tri metra.',
      'Dein Außen startet die erste Welle in Minute 9. Ihr führt 5:4. Du bist der Unterstützungsläufer und empfängst im Tempo direkt hinter ihm. Ein zurücklaufender Verteidiger schattet den Außen; ein zweiter ist auf dir noch drei Meter spät.',
    ),
    question: L(
      'How do you use the first-wave support receive?',
      'Kako koristiš prijem u podršci prvog vala?',
      'Wie nutzt du den Empfang als Unterstützung der ersten Welle?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Attack at speed immediately — shoot or return to the wing before the late help arrives',
          'Napadni u trčanju odmah — šutiraj ili vrati na krilo prije dolaska zakašnjele pomoći',
          'Sofort im Tempo angreifen — werfen oder zum Außen zurück, bevor späte Hilfe kommt',
        ),
        feedback: L(
          'Correct — first-wave support value is speed after the catch, not settling.',
          'Točno — vrijednost podrške prvog vala je brzina nakon prijema, ne smirivanje.',
          'Richtig — Wert der ersten Welle ist Tempo nach dem Empfang, kein Beruhigen.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the wing’s lane reopens first, one-touch him without slowing your stride',
          'Ako se linija krila prva ponovo otvori, odigraj mu iz prvog dodira bez usporavanja koraka',
          'Wenn die Außenbahn zuerst wieder öffnet, mit erstem Kontakt ohne Schrittdrosselung spielen',
        ),
        feedback: L(
          'Good — one-touch to the wing keeps tempo when his lane is clearer than yours.',
          'Dobro — iz prvog dodira na krilo čuva tempo kad je njegova linija čišća od tvoje.',
          'Gut — Erstkontakt zum Außen hält Tempo wenn seine Bahn klarer ist als deine.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Catch, stop, and bounce twice to “set your feet”',
          'Primi, stani i driblaj dvaput da „namjestiš noge“',
          'Fangen, stoppen und zweimal dribbeln, um „die Füße zu setzen“',
        ),
        feedback: L(
          'Risky — stopping first-wave support lets recovering defenders erase the advantage.',
          'Rizično — zaustavljanje podrške prvog vala daje braničima u povratku da obrišu prednost.',
          'Riskant — Stoppen der ersten Welle lässt Rückkehrer den Vorteil löschen.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Turn back and restart a positional attack from halfway',
          'Okreni se natrag i kreni pozicijski napad sa sredine terena',
          'Umdrehen und Positionsangriff von der Mittellinie neu starten',
        ),
        feedback: L(
          'Poor — turning a live first wave into set attack wastes the break entirely.',
          'Loše — pretvaranje živog prvog vala u pozicijski napad u potpunosti baca kontranapad.',
          'Schlecht — eine lebendige erste Welle in Positionsangriff zu drehen verschenkt den Break.',
        ),
      },
    ],
    explanation: L(
      'Cue: you receive as first-wave support at speed with late help. Attack immediately — shot or return to the wing. Stopping to set feet or turning back into positional attack kills the break.',
      'Signal: primaš kao podrška prvog vala u trčanju uz zakašnjelu pomoć. Napadni odmah — šut ili povrat na krilo. Stajanje zbog nogu ili okretanje u pozicijski napad ubija kontranapad.',
      'Signal: Empfang als Unterstützung der ersten Welle im Tempo bei später Hilfe. Sofort angreifen — Wurf oder zurück zum Außen. Stoppen zum Fußsetzen oder Drehen in Positionsangriff tötet den Break.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.35 },
  },

  // ─── 17. Polukontra / second wave ───
  {
    familyKey: 'lb_polukontra_second_wave',
    title: L(
      'Left Back — Second Wave Decision',
      'Lijevi vanjski — odluka u polukontri',
      'Linker Rückraum — Entscheidung in der zweiten Welle',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 31,
    score: '18:17',
    defensiveSystem: undefined,
    skillTags: ['fastBreakTiming', 'gameReading'],
    perception: false,
    numerical: 'transition',
    gameState: 'none',
    situation: L(
      "The first wave is stopped at 31'. You lead 18:17. You arrive as the second wave (polukontra) with the ball at pace. Three defenders are back but not set — gaps between them, not a formed 6:0. The left wing holds width; the pivot is sprinting into the middle.",
      'Prvi val je zaustavljen u 31. minuti. Vodite 18:17. Stižeš kao drugi val (polukontra) s loptom u tempu. Tri braniča su natrag ali nisu postavljeni — prostori među njima, ne formirana 6:0. Lijevo krilo drži širinu; pivot sprinta u sredinu.',
      'Die erste Welle ist gestoppt in Minute 31. Ihr führt 18:17. Du kommst als zweite Welle (Polukontra) mit Ball im Tempo. Drei Verteidiger sind zurück, aber nicht gesetzt — Lücken zwischen ihnen, keine formierte 6:0. Linksaußen hält Breite; Kreisläufer sprintet in die Mitte.',
    ),
    question: L(
      'What is the second-wave priority?',
      'Što je prioritet u polukontri?',
      'Was ist die Priorität in der zweiten Welle?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Keep tempo into the unsettled gaps — wing or pivot before the defence forms',
          'Drži tempo u nestabilne prostore — krilo ili pivot prije nego se obrana formira',
          'Tempo in die ungesetzten Lücken halten — Außen oder Kreisläufer bevor die Abwehr formiert',
        ),
        feedback: L(
          'Correct — polukontra value is finishing before a set 6:0 appears.',
          'Točno — vrijednost polukontre je završiti prije nego se pojavi postavljena 6:0.',
          'Richtig — Wert der zweiten Welle ist Abschließen bevor eine gesetzte 6:0 entsteht.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If all gaps close in the last stride, settle into a quick positional entry without a full reset',
          'Ako se svi prostori zatvore u zadnjem koraku, uđi brzo u pozicijski napad bez potpunog povratka unatrag',
          'Wenn alle Lücken im letzten Schritt schließen, schnell in Positionsangriff ohne vollen Reset',
        ),
        feedback: L(
          'Good — soft landing into set attack is right only when gaps are gone.',
          'Dobro — mekan ulazak u pozicijski napad vrijedi samo kad prostori nestanu.',
          'Gut — weicher Übergang in Positionsangriff nur wenn Lücken weg sind.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Stop at the nine and wait for the full team to rebuild a set play',
          'Stani na devetki i čekaj cijelu momčad da ponovo gradi postavljenu akciju',
          'An der Neun stoppen und auf das ganze Team für Positionsaufbau warten',
        ),
        feedback: L(
          'Risky — full stop after arriving in second wave gifts the defence the form-up.',
          'Rizično — potpuni stop nakon dolaska u drugom valu daje obrani formiranje.',
          'Riskant — Komplettstopp nach Ankunft in der zweiten Welle schenkt der Abwehr die Formierung.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Lob backwards to the goalkeeper and restart from zero',
          'Lobaj unatrag na vlastitog vratara i kreni ispočetka',
          'Zurück zum eigenen Torwart lobben und bei null neu starten',
        ),
        feedback: L(
          'Poor — restarting from your own goalkeeper erases every second-wave advantage.',
          'Loše — restart od vlastitog vratara briše svaku prednost drugog vala.',
          'Schlecht — Neustart vom eigenen Torwart löscht jeden Vorteil der zweiten Welle.',
        ),
      },
    ],
    explanation: L(
      'Cue: first wave stopped, you arrive as polukontra against three unset defenders. Keep tempo into gaps — wing or pivot. Full stop for set rebuild or lobbing back to your goalkeeper kills the second wave.',
      'Signal: prvi val zaustavljen, stižeš u polukontri protiv trojice nepostavljenih. Drži tempo u prostore — krilo ili pivot. Potpuni stop za gradnju postave ili lob natrag na vratara ubija drugi val.',
      'Signal: erste Welle gestoppt, du kommst als zweite Welle gegen drei ungesetzte. Tempo in Lücken — Außen oder Kreisläufer. Stopp für Positionsaufbau oder Lob zum eigenen Torwart tötet die zweite Welle.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.1 },
  },

  // ─── 18. Partially set defence ───
  {
    familyKey: 'lb_partially_set_settle',
    title: L(
      'Left Back — Partially Set Defence Read',
      'Lijevi vanjski — čitanje djelomično postavljene obrane',
      'Linker Rückraum — teilweise gesetzte Abwehr lesen',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 25,
    score: '14:13',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'defensiveReading', 'fastBreakTiming'],
    perception: true,
    numerical: 'transition',
    gameState: 'none',
    situation: L(
      "You push transition at 25'. You lead 14:13. Midway up court you see the change: four defenders have reached their 6:0 spots and are squared; only two are still recovering. The early break lanes are gone, but the defence is not yet compact.",
      'Guraš tranziciju u 25. minuti. Vodite 14:13. Na pola puta vidiš promjenu: četiri braniča stigli su na mjesta u 6:0 i okrenuti su; samo dvojica još se vraćaju. Rane linije kontranapada nestale su, ali obrana još nije zbijena.',
      'Du treibst den Übergang in Minute 25. Ihr führt 14:13. Auf halber Strecke siehst du die Änderung: vier Verteidiger stehen schon auf 6:0-Positionen frontal; nur zwei sind noch unterwegs. Frühe Breakbahnen sind weg, aber die Abwehr ist noch nicht kompakt.',
    ),
    question: L(
      'What changed in the defence?',
      'Što se promijenilo u obrani?',
      'Was hat sich in der Abwehr verändert?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'It is partially set — stop forcing pure transition and enter a quick positional attack',
          'Djelomično je postavljena — prestani forsirati čistu tranziciju i uđi u brzi pozicijski napad',
          'Sie ist teilweise gesetzt — reine Transition beenden und schnell in Positionsangriff gehen',
        ),
        feedback: L(
          'Correct — four squared defenders means the break is over; force-transition now is low percentage.',
          'Točno — četiri okrenuta braniča znače da je kontranapad gotov; forsiranje tranzicije sad je nizak postotak.',
          'Richtig — vier frontale Verteidiger heißen Break vorbei; Transition erzwingen ist jetzt Low Percentage.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If one recovering defender leaves a clear wing lane, take that single late break finish',
          'Ako jedan branič u povratku ostavi čistu liniju na krilo, uzmi tu jednu kasnu završnicu kontranapada',
          'Wenn ein Rückkehrer eine klare Außenbahn lässt, diesen einen späten Breakabschluss nehmen',
        ),
        feedback: L(
          'Good — one clean leftover lane is still valid; blind continuation is not.',
          'Dobro — jedna preostala čista linija još vrijedi; slijepo nastavljanje ne.',
          'Gut — eine klare Restbahn gilt noch; blindes Weiterlaufen nicht.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Keep sprinting into the four squared defenders as if it were still 3v2',
          'Nastavi sprintati u četiri okrenuta braniča kao da je još 3 na 2',
          'Weiter in die vier frontalen Verteidiger sprinten als wäre es noch 3 gegen 2',
        ),
        feedback: L(
          'Risky — attacking a half-set wall at full sprint creates easy turnovers.',
          'Rizično — napad na pola postavljen zid u punom sprintu stvara lake gubitke lopte.',
          'Riskant — Angriff auf halb gesetzte Wand im Vollsprint erzeugt leichte Ballverluste.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Ignore the change and lob a hopeful long pass into traffic',
          'Zanemari promjenu i lobaj nadobudno dugo dodavanje u gužvu',
          'Die Änderung ignorieren und einen hoffnungsvollen Longpass in den Verkehr lobben',
        ),
        feedback: L(
          'Poor — hopeful long balls after the defence partially sets are steal invitations.',
          'Loše — nadobudne duge lopte nakon djelomičnog postavljanja obrane poziv su na oduzimanje.',
          'Schlecht — hoffnungsvolle Longbälle nach teilweise gesetzter Abwehr sind Diebstahl-Einladungen.',
        ),
      },
    ],
    explanation: L(
      'Cue: four defenders already squared in 6:0 spots — the defence partially set. Stop pure transition and enter quick positional attack. Sprinting into a half-set wall or hopeful long lobs waste the read.',
      'Signal: četiri braniča već okrenuta na mjestima u 6:0 — obrana je djelomično postavljena. Prestani s čistom tranzicijom i uđi u brzi pozicijski napad. Sprint u pola postavljen zid ili nadobudni dug lob baca čitanje.',
      'Signal: vier Verteidiger schon frontal auf 6:0 — Abwehr teilweise gesetzt. Reine Transition beenden und schnell in Positionsangriff. Sprint in halb gesetzte Wand oder hoffnungsvoller Longlob verschenkt die Lese.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.1 },
  },

  // ─── 19. TD protect centre ───
  {
    familyKey: 'lb_td_protect_centre',
    title: L(
      'Left Back — Transition Defence, Protect Centre',
      'Lijevi vanjski — obrambena tranzicija, čuvaj sredinu',
      'Linker Rückraum — Abwehrübergang, Mitte schützen',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 15,
    score: '9:9',
    defensiveSystem: undefined,
    skillTags: ['defensiveTransition', 'defensiveReading'],
    perception: false,
    numerical: 'transition',
    gameState: 'none',
    situation: L(
      "You lose the ball at 15'. Score 9:9. You are the first recovering left back. The opponent has a 3v2 break forming — carrier in the middle, wings wide. Your near wing is free on the sideline, but the central lane to the six is open for the carrier’s next stride.",
      'Gubite loptu u 15. minuti. Neriješeno je 9:9. Ti si prvi povratnik na mjestu lijevog vanjskog. Protivnik gradi kontranapad 3 na 2 — nosač u sredini, krila široko. Tvoje bliže krilo slobodno je na bočnoj, ali središnja linija do šestice otvorena je za sljedeći korak nosača.',
      'Ihr verliert den Ball in Minute 15. Es steht 9:9. Du bist der erste zurücklaufende linke Rückraum. Der Gegner formt einen 3-gegen-2-Break — Träger in der Mitte, Außen breit. Dein naher Außen ist auf der Seite frei, aber die zentrale Bahn zur Sechs ist für den nächsten Schritt des Trägers offen.',
    ),
    question: L(
      'As first recoverer, what do you protect first?',
      'Kao prvi povratnik, što prvo štitiš?',
      'Als erster Rückkehrer — was schützt du zuerst?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Protect the central lane first — force the carrier wide before chasing the free wing',
          'Prvo zaštiti središnju liniju — natjeraj nosača na širinu prije jurnjave za slobodnim krilom',
          'Zuerst die zentrale Bahn schützen — den Träger nach außen zwingen bevor du den freien Außen jagst',
        ),
        feedback: L(
          'Correct — central finishes end breaks; wings can wait one stride if the middle is closed.',
          'Točno — središnje završnice završavaju kontranapade; krilo može pričekati jedan korak ako je sredina zatvorena.',
          'Richtig — zentrale Abschlüsse beenden Breaks; Außen kann einen Schritt warten wenn Mitte zu ist.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'Communicate the open wing while you hold the middle so a second recoverer can take him',
          'Javi otvoreno krilo dok držiš sredinu da ga drugi povratnik preuzme',
          'Den offenen Außen rufen während du die Mitte hältst, damit ein zweiter Rückkehrer ihn nimmt',
        ),
        feedback: L(
          'Good — communication helps, but only after your body already owns the centre.',
          'Dobro — komunikacija pomaže, ali tek nakon što tvoje tijelo već drži sredinu.',
          'Gut — Kommunikation hilft, aber erst wenn dein Körper die Mitte schon besitzt.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Sprint immediately to the free near wing and leave the central lane open',
          'Odmah sprintaj na slobodno bliže krilo i ostavi središnju liniju otvorenom',
          'Sofort zum freien nahen Außen sprinten und die zentrale Bahn offen lassen',
        ),
        feedback: L(
          'Risky — chasing the wing first gifts the easiest goal in transition defence.',
          'Rizično — jurnjava za krilom prvo daruje najlakši gol u obrambenoj tranziciji.',
          'Riskant — zuerst den Außen jagen schenkt das leichteste Tor im Abwehrübergang.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Stop at halfway and wait for the full 6:0 to form behind you',
          'Stani na sredini i čekaj da se puna 6:0 formira iza tebe',
          'An der Mittellinie stoppen und warten, bis die volle 6:0 hinter dir formiert',
        ),
        feedback: L(
          'Poor — passive halfway waiting lets the 3v2 finish before any structure arrives.',
          'Loše — pasivno čekanje na sredini dopušta 3 na 2 da završi prije dolaska strukture.',
          'Schlecht — passives Warten an der Mitte lässt 3 gegen 2 enden bevor Struktur kommt.',
        ),
      },
    ],
    explanation: L(
      'Cue: first recoverer vs 3v2 with open central lane. Protect the middle first and force the carrier wide. Chasing the free wing immediately or waiting at halfway gifts the break finish.',
      'Signal: prvi povratnik protiv 3 na 2 s otvorenom središnjom linijom. Prvo zaštiti sredinu i natjeraj nosača na širinu. Jurnjava za krilom odmah ili čekanje na sredini daruje završnicu kontranapada.',
      'Signal: erster Rückkehrer gegen 3 gegen 2 mit offener Mitte. Zuerst Mitte schützen und Träger nach außen zwingen. Sofort Außen jagen oder an der Mitte warten schenkt den Breakabschluss.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.0 },
  },

  // ─── 20. TD deny skip ───
  {
    familyKey: 'lb_td_deny_skip',
    title: L(
      'Left Back — Deny Far-Wing Skip Lane',
      'Lijevi vanjski — zatvori liniju dugog dodavanja na daleko krilo',
      'Linker Rückraum — Skip-Bahn zum fernen Außen schließen',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 27,
    score: '15:14',
    defensiveSystem: undefined,
    skillTags: ['defensiveTransition', 'defensiveReading'],
    perception: false,
    numerical: 'transition',
    gameState: 'none',
    situation: L(
      "Transition defence at 27'. You lead 15:14. A teammate already angles the ball carrier. You are the nearest defender to the far-side skip lane — that far wing is wide open and the carrier’s eyes are already there. You are not the primary on the carrier.",
      'Obrambena tranzicija u 27. minuti. Vodite 15:14. Suigrač već stavlja nosača lopte pod kut. Ti si najbliži branič liniji dugog dodavanja na daleku stranu — to daleko krilo široko je otvoreno i oči nosača već su tamo. Nisi primarni na nosaču.',
      'Abwehrübergang in Minute 27. Ihr führt 15:14. Ein Mitspieler winkelt den Ballträger schon an. Du bist der nächste Verteidiger zur Skip-Bahn auf die ferne Seite — dieser ferne Außen ist breit offen und die Augen des Trägers sind schon dort. Du bist nicht primär am Träger.',
    ),
    question: L(
      'When the skip lane is open and you are nearest, what do you do?',
      'Kad je linija dugog dodavanja otvorena i ti si najbliži, što radiš?',
      'Wenn die Skip-Bahn offen ist und du am nächsten bist — was tust du?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Deny the skip lane — take away the far wing pass while your teammate stays on the carrier',
          'Zatvori liniju dugog dodavanja — ukloni dodavanje na daleko krilo dok suigrač ostaje na nosaču',
          'Skip-Bahn schließen — den Pass auf den fernen Außen nehmen während der Mitspieler am Träger bleibt',
        ),
        feedback: L(
          'Correct — when the skip is open and you are nearest, your job is the lane, not a second body on the carrier.',
          'Točno — kad je dugo dodavanje otvoreno i ti si najbliži, tvoj je posao linija, ne drugo tijelo na nosaču.',
          'Richtig — wenn Skip offen und du am nächsten bist, ist deine Aufgabe die Bahn, nicht ein zweiter Körper am Träger.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'Show high hands in the skip lane and force the carrier to keep the ball',
          'Pokaži visoke ruke u liniji dugog dodavanja i natjeraj nosača da zadrži loptu',
          'Hohe Hände in der Skip-Bahn zeigen und den Träger zum Halten zwingen',
        ),
        feedback: L(
          'Good — high hands help deny; full body in the lane is still clearer.',
          'Dobro — visoke ruke pomažu zatvoriti; cijelo tijelo u liniji i dalje je jasnije.',
          'Gut — hohe Hände helfen; ganzer Körper in der Bahn ist noch klarer.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Leave the skip and double the carrier with your teammate',
          'Napusti liniju dugog dodavanja i udvoji nosača sa suigračem',
          'Skip verlassen und den Träger mit dem Mitspieler doppeln',
        ),
        feedback: L(
          'Risky — doubling the carrier with the skip open is exactly the far-wing assist they want.',
          'Rizično — udvajanje nosača uz otvoreno dugo dodavanje točno je asistencija na daleko krilo koju žele.',
          'Riskant — Träger doppeln bei offenem Skip ist genau der Fern-Außen-Assist den sie wollen.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Ball-watch from behind your teammate without occupying any passing lane',
          'Gledaj loptu iza suigrača bez zauzimanja ijedne linije dodavanja',
          'Ball gucken hinter dem Mitspieler ohne eine Passbahn zu besetzen',
        ),
        feedback: L(
          'Poor — ball-watching with an open skip lane gifts the easiest transition finish.',
          'Loše — gledanje lopte uz otvorenu liniju skipa daruje najlakšu tranzicijsku završnicu.',
          'Schlecht — Ballgucken bei offener Skip-Bahn schenkt den leichtesten Übergangs-Abschluss.',
        ),
      },
    ],
    explanation: L(
      'Cue: teammate already angles the carrier; you are nearest to an open far-wing skip. Deny that lane. Doubling the carrier or ball-watching leaves the skip assist free.',
      'Signal: suigrač već stavlja nosača pod kut; ti si najbliži otvorenoj liniji dugog dodavanja na daleko krilo. Zatvori tu liniju. Udvajanje nosača ili gledanje lopte ostavlja asistenciju dugim dodavanjem slobodnom.',
      'Signal: Mitspieler winkelt den Träger schon an; du bist am nächsten zum offenen Fern-Skip. Diese Bahn schließen. Doppeln oder Ballgucken lässt den Skip-Assist frei.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.3 },
  },

  // ─── 21. 6:0 block responsibility ───
  {
    familyKey: 'lb_def_6_0_block',
    title: L(
      'Left Back — 6:0 Block Responsibility',
      'Lijevi vanjski — odgovornost bloka u 6:0',
      'Linker Rückraum — Blockverantwortung in der 6:0',
    ),
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 20,
    score: '12:11',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'screening'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You defend left half in a set 6:0 at 20'. You lead 12:11. The opposing left back jumps into a clear shooting window on your side. Your inside teammate has the pivot. The shot lane is yours to close with a block — not a late reach from behind.",
      'Braniš lijevog polubranitelja u postavljenoj 6:0 u 20. minuti. Vodite 12:11. Protivnički lijevi vanjski skače u čisti prozor šuta na tvojoj strani. Unutarnji suigrač drži pivota. Linija šuta tvoja je za zatvoriti blokom — ne kasnim posezanjem odostraga.',
      'Du verteidigst linken Halben in stehender 6:0 in Minute 20. Ihr führt 12:11. Der gegnerische linke Rückraum springt in ein klares Wurffenster auf deiner Seite. Dein innerer Mitspieler hat den Kreisläufer. Die Wurfbahn ist deine Blockaufgabe — kein spätes Greifen von hinten.',
    ),
    question: L(
      'What is your block responsibility on that shot?',
      'Kakva je tvoja odgovornost bloka na tom šutu?',
      'Was ist deine Blockverantwortung bei diesem Wurf?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Step into the shooting lane early and take a solid block on your assigned side',
          'Rano uđi u liniju šuta i uzmi čvrst blok na svojoj dodijeljenoj strani',
          'Früh in die Wurfbahn treten und einen soliden Block auf deiner zugewiesenen Seite nehmen',
        ),
        feedback: L(
          'Correct — early body in the lane beats late arm reaches from behind.',
          'Točno — rano tijelo u liniji pobjeđuje kasna posezanja rukom odostraga.',
          'Richtig — früher Körper in der Bahn schlägt späte Armgriffe von hinten.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If you are late to the lane, contest the release arm without leaving the pivot free',
          'Ako kasniš u liniju, ometaj ruku ispusta bez ostavljanja pivota slobodnim',
          'Wenn du zur Bahn spät bist, den Abwurfarm stören ohne den Kreisläufer freizulassen',
        ),
        feedback: L(
          'Good — late contest is second-best; early block is the real responsibility.',
          'Dobro — kasno ometanje je druga opcija; rani blok prava je odgovornost.',
          'Gut — späte Störung ist zweite Wahl; früher Block ist die echte Verantwortung.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Jump straight up with arms only after the shooter is already in the air',
          'Skoči ravno gore samo s rukama nakon što je šuter već u zraku',
          'Nur mit Armen senkrecht springen nachdem der Werfer schon in der Luft ist',
        ),
        feedback: L(
          'Risky — vertical late jumps rarely close a prepared shooting window.',
          'Rizično — kasni vertikalni skokovi rijetko zatvaraju pripremljeni prozor šuta.',
          'Riskant — späte Vertikalsprünge schließen selten ein vorbereitetes Wurffenster.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Leave your lane to help the opposite side and hope someone else blocks',
          'Napusti svoju liniju da pomogneš suprotnoj strani i nadaj se da će netko drugi blokirati',
          'Deine Bahn verlassen um der Gegenseite zu helfen und hoffen dass jemand anders blockt',
        ),
        feedback: L(
          'Poor — abandoning your assigned block lane gifts the open shot you were there to stop.',
          'Loše — napuštanje dodijeljene linije bloka daruje otvoreni šut koji si trebao zaustaviti.',
          'Schlecht — Verlassen der zugewiesenen Blockbahn schenkt den offenen Wurf den du stoppen solltest.',
        ),
      },
    ],
    explanation: L(
      'Cue: clear shooting window on your 6:0 side, pivot already covered inside. Step early into the lane for a solid block. Late vertical arm jumps or leaving your lane gifts the open shot.',
      'Signal: čisti prozor šuta na tvojoj strani u 6:0, pivot već pokriven unutra. Rano uđi u liniju za čvrst blok. Kasni vertikalni skokovi rukama ili napuštanje linije daruju otvoreni šut.',
      'Signal: klares Wurffenster auf deiner 6:0-Seite, Kreisläufer innen schon gedeckt. Früh in die Bahn für soliden Block. Späte Vertikal-Armsprünge oder Bahn verlassen schenken den offenen Wurf.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.2 },
  },

  // ─── 22. Handover on crossing ───
  {
    familyKey: 'lb_def_handover_cross',
    title: L(
      'Left Back — Handover on Opponent Crossing',
      'Lijevi vanjski — predaja / preuzimanje na križanju',
      'Linker Rückraum — Übergabe / Übernahme beim Kreuzen',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 33,
    score: '19:19',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'gameReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You defend in 6:0 at 33'. Score 19:19. The opposing left back and centre back start a cross. Your teammate calls the switch early. The runner is coming into your zone still with the ball; a late, unclear handover would leave both of you ball-watching.",
      'Braniš u 6:0 u 33. minuti. Neriješeno je 19:19. Protivnički lijevi i srednji vanjski kreću u križanje. Suigrač rano zove preuzimanje. Trkač ulazi u tvoju zonu još s loptom; kasna, nejasna predaja ostavila bi obojicu da gledate loptu.',
      'Du verteidigst in 6:0 in Minute 33. Es steht 19:19. Gegnerischer linker und mittlerer Rückraum starten ein Kreuzen. Dein Mitspieler ruft die Übernahme früh. Der Läufer kommt mit Ball in deine Zone; späte, unklare Übergabe ließe euch beide ballgucken.',
    ),
    question: L(
      'How do you execute the handover on the cross?',
      'Kako izvodiš predaju / preuzimanje na križanju?',
      'Wie führst du Übergabe / Übernahme beim Kreuzen aus?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Communicate and take the runner early — clear body ownership, no two-man ball-watch',
          'Komuniciraj i rano preuzmi trkača — jasno vlasništvo tijela, bez gledanja lopte u dvoje',
          'Kommunizieren und den Läufer früh übernehmen — klarer Körperbesitz, kein zu zweit Ballgucken',
        ),
        feedback: L(
          'Correct — early clear takeover prevents the free catch after a messy switch.',
          'Točno — rano jasno preuzimanje sprječava slobodan prijem nakon neuredne zamjene.',
          'Richtig — frühe klare Übernahme verhindert freien Empfang nach unsauberem Tausch.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the call is late, stay with your original until voice confirmation, then switch hard',
          'Ako je poziv kasno, ostani na svom originalu do glasovne potvrde, zatim tvrdo preuzmi',
          'Wenn der Ruf spät kommt, beim Original bleiben bis zur Stimme, dann hart übernehmen',
        ),
        feedback: L(
          'Good — delayed clarity beats silent simultaneous leaving; early call is still better.',
          'Dobro — odgođena jasnoća bolja je od tihog istovremenog napuštanja; rani poziv i dalje je bolji.',
          'Gut — verzögerte Klarheit schlägt stilles gleichzeitiges Verlassen; früher Ruf bleibt besser.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Both leave your men at the same moment without a clear call',
          'Obojica u istom trenutku napustite svoje igrače bez jasnog poziva',
          'Beide verlassen eure Leute im selben Moment ohne klaren Ruf',
        ),
        feedback: L(
          'Risky — silent double leave is how crossing creates open shots.',
          'Rizično — tiho dvostruko napuštanje način je na koji križanje stvara otvorene šuteve.',
          'Riskant — stilles doppeltes Verlassen ist wie Kreuzen offene Würfe schafft.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Ignore the cross and ball-watch from a deep position',
          'Ignoriraj križanje i gledaj loptu iz duboke pozicije',
          'Das Kreuzen ignorieren und aus tiefer Position Ball gucken',
        ),
        feedback: L(
          'Poor — deep ball-watching on a live cross gifts free reception space.',
          'Loše — duboko gledanje lopte na živom križanju daruje slobodan prostor za prijem.',
          'Schlecht — tiefes Ballgucken bei live Kreuzen schenkt freien Empfangsraum.',
        ),
      },
    ],
    explanation: L(
      'Cue: opponent cross with an early switch call into your zone. Take the runner early with clear ownership. Silent double leave or deep ball-watching creates the open catch the cross wants.',
      'Signal: protivničko križanje s ranim pozivom preuzimanja u tvoju zonu. Rano preuzmi trkača s jasnim vlasništvom. Tiho dvostruko napuštanje ili duboko gledanje lopte stvara slobodan prijem koji križanje želi.',
      'Signal: Gegnerkreuz mit frühem Übernahmeruf in deine Zone. Läufer früh mit klarem Besitz übernehmen. Stilles doppeltes Verlassen oder tiefes Ballgucken schafft den freien Empfang den Kreuzen will.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.3 },
  },

  // ─── 23. Help late on wing ───
  {
    familyKey: 'lb_def_help_wing',
    title: L(
      'Left Back — Late Help on Wing Shot',
      'Lijevi vanjski — kasna pomoć na šutu s krila',
      'Linker Rückraum — späte Hilfe am Außenwurf',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 42,
    score: '23:23',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'defensiveReading'],
    perception: true,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You play left half in 6:0 at 42'. Score 23:23. Your near wing defender is beaten — the left wing receives with a finishing angle opening. You are the closest help. Leaving too early opens the backcourt shot; leaving too late gifts the wing goal.",
      'Igraš lijevog polubranitelja u 6:0 u 42. minuti. Neriješeno je 23:23. Tvoj branič na bližem krilu pređen je — lijevo krilo prima s otvaranjem kuta završnice. Ti si najbliža pomoć. Premalo rani izlazak otvara šut izvana; prekasni izlazak daruje gol s krila.',
      'Du spielst linken Halben in 6:0 in Minute 42. Es steht 23:23. Dein naher Außenverteidiger ist geschlagen — Linksaußen empfängt mit öffnendem Abschlusswinkel. Du bist die nächste Hilfe. Zu früher Exit öffnet den Rückraumwurf; zu spät schenkt das Außentor.',
    ),
    question: L(
      'When must you help the wing?',
      'Kada moraš pomoći krilu?',
      'Wann musst du dem Außen helfen?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Help when the wing receives with a real finishing angle — close the shot, then recover',
          'Pomozi kad krilo primi s pravim kutom završnice — zatvori šut, zatim se vrati',
          'Helfen wenn der Außen mit echtem Abschlusswinkel empfängt — Wurf schließen, dann zurück',
        ),
        feedback: L(
          'Correct — help on a real finishing catch; early help on a covered wing opens the back.',
          'Točno — pomozi na pravom prijumu za završnicu; rana pomoć na pokrivenom krilu otvara vanjskog.',
          'Richtig — helfen bei echtem Abschlussempfang; frühe Hilfe bei zugestelltem Außen öffnet den Rückraum.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'Show a short close-out that forces a tougher angle, then sprint back to your backcourt man',
          'Pokaži kratko zatvaranje koje oteža kut, zatim sprintaj natrag na svog vanjskog',
          'Kurzes Close-out zeigen das den Winkel erschwert, dann zurück zu deinem Rückraum sprinten',
        ),
        feedback: L(
          'Good — short contest then recover is valid when you cannot fully block.',
          'Dobro — kratko ometanje pa povratak vrijedi kad ne možeš potpuno blokirati.',
          'Gut — kurze Störung dann zurück wenn voller Block nicht geht.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Leave your backcourt man early while the wing is still covered and waiting',
          'Rano napusti svog vanjskog dok je krilo još pokriveno i čeka',
          'Deinen Rückraum früh verlassen während der Außen noch zugestellt wartet',
        ),
        feedback: L(
          'Risky — early help on a non-threat opens the higher-value backcourt shot.',
          'Rizično — rana pomoć na neprijetnji otvara vrijedniji šut izvana.',
          'Riskant — frühe Hilfe ohne Bedrohung öffnet den wertvolleren Rückraumwurf.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Stay glued to your backcourt man and watch the open wing finish alone',
          'Ostani zalijepljen za svog vanjskog i gledaj kako otvoreno krilo samo završava',
          'Am eigenen Rückraum kleben und den offenen Außen allein abschließen lassen',
        ),
        feedback: L(
          'Poor — never helping a beaten wing defender gifts open six-metre finishes.',
          'Loše — nikakva pomoć pređenom braniču na krilu daruje otvorene završnice sa šest metara.',
          'Schlecht — nie helfen wenn Außenverteidiger geschlagen ist schenkt offene Sechs-Meter-Abschlüsse.',
        ),
      },
    ],
    explanation: L(
      'Cue: near wing defender beaten and the wing receives with a real finishing angle — you are closest help. Close that shot, then recover. Helping early while the wing is still covered opens the backcourt; never helping gifts the wing goal.',
      'Signal: branič na bližem krilu pređen i krilo prima s pravim kutom završnice — ti si najbliža pomoć. Zatvori taj šut, zatim se vrati. Rana pomoć dok je krilo još pokriveno otvara vanjskog; nikakva pomoć daruje gol s krila.',
      'Signal: naher Außenverteidiger geschlagen und Außen empfängt mit echtem Winkel — du bist nächste Hilfe. Wurf schließen, dann zurück. Frühe Hilfe bei noch zugestelltem Außen öffnet Rückraum; nie helfen schenkt Außentor.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.15 },
  },

  // ─── 24. Pivot control contact ───
  {
    familyKey: 'lb_def_pivot_control',
    title: L(
      'Left Back — Pivot Contact Timing in 6:0',
      'Lijevi vanjski — tajming kontakta na pivotu u 6:0',
      'Linker Rückraum — Kontakt-Timing am Kreisläufer in der 6:0',
    ),
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 11,
    score: '6:5',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'screening'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "You share pivot responsibility in 6:0 at 11'. You lead 6:5. The pivot tries to seal you before the ball arrives on the left. Contact too early (while the ball is still far) lets him roll; contact too late lets him own the space first.",
      'Dijeliš odgovornost na pivotu u 6:0 u 11. minuti. Vodite 6:5. Pivot pokušava zatvoriti tebe prije nego lopta stigne lijevo. Kontakt prerano (dok je lopta još daleko) dopušta mu roll; kontakt prekasno dopušta mu da prvi zauzme prostor.',
      'Du teilst Kreisläufer-Verantwortung in 6:0 in Minute 11. Ihr führt 6:5. Der Kreisläufer will dich abdichten bevor der Ball links ankommt. Kontakt zu früh (Ball noch weit) erlaubt ihm den Roll; Kontakt zu spät lässt ihn den Raum zuerst besitzen.',
    ),
    question: L(
      'When do you take contact on the pivot?',
      'Kada uzimaš kontakt na pivotu?',
      'Wann nimmst du Kontakt am Kreisläufer?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'As the ball approaches your side — firm contact that denies the seal without early holding',
          'Kad se lopta približava tvojoj strani — čvrst kontakt koji sprečava zatvaranje bez ranog držanja',
          'Wenn der Ball auf deine Seite kommt — fester Kontakt der die Abdichtung verhindert ohne frühes Halten',
        ),
        feedback: L(
          'Correct — timed contact with the ball denies the seal; early holding is a foul and late contact loses the space.',
          'Točno — tajmirani kontakt s loptom sprečava zatvaranje; rano držanje je prekršaj, a kasni kontakt gubi prostor.',
          'Richtig — getimter Kontakt mit Ball verhindert Abdichtung; frühes Halten ist Foul, später Kontakt verliert den Raum.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If you lose the seal fight, call help and recover body position between pivot and goal',
          'Ako izgubiš borbu za zatvaranje, zovi pomoć i vrati tijelo između pivota i gola',
          'Wenn du den Abdichtungskampf verlierst, Hilfe rufen und Körper zwischen Kreisläufer und Tor bringen',
        ),
        feedback: L(
          'Good — recovery after a lost seal is second-best; winning the timing is first.',
          'Dobro — povratak nakon izgubljenog zatvaranja druga je opcija; pobijediti tajming je prva.',
          'Gut — Recovery nach verlorener Abdichtung ist zweite Wahl; Timing gewinnen ist erste.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Grab the pivot early while the ball is still on the far side',
          'Rano uhvati pivota dok je lopta još na dalekoj strani',
          'Den Kreisläufer früh greifen während der Ball noch auf der fernen Seite ist',
        ),
        feedback: L(
          'Risky — early holding often draws fouls and still loses the later seal fight.',
          'Rizično — rano držanje često vuče prekršaje i ipak gubi kasniju borbu za zatvaranje.',
          'Riskant — frühes Halten zieht oft Fouls und verliert trotzdem den späteren Abdichtungskampf.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Give free space and only react after the pivot has already sealed and received',
          'Daj slobodan prostor i reagiraj tek nakon što je pivot već zatvorio i primio',
          'Freien Raum geben und erst reagieren nachdem der Kreisläufer schon abgedichtet und empfangen hat',
        ),
        feedback: L(
          'Poor — reacting after the seal and catch is already a lost defensive action.',
          'Loše — reakcija nakon zatvaranja i prijema već je izgubljena obrambena akcija.',
          'Schlecht — Reagieren nach Abdichtung und Empfang ist schon verlorene Abwehraktion.',
        ),
      },
    ],
    explanation: L(
      'Cue: pivot tries to seal before the ball arrives on your side. Take firm contact as the ball approaches — deny the seal without early holding. Early grabs foul; late reactions lose the space.',
      'Signal: pivot pokušava zatvoriti prije dolaska lopte na tvoju stranu. Uzmi čvrst kontakt kad se lopta približava — spriječi zatvaranje bez ranog držanja. Rani hvatovi su prekršaj; kasne reakcije gube prostor.',
      'Signal: Kreisläufer will abdichten bevor der Ball kommt. Festen Kontakt wenn der Ball naht — Abdichtung verhindern ohne frühes Halten. Frühes Greifen foult; späte Reaktion verliert den Raum.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: -0.4 },
  },

  // ─── 25. Attack vs 1:5 high press ───
  {
    familyKey: 'lb_1_5_high_press',
    title: L(
      'Left Back — Play Behind 1:5 High Press',
      'Lijevi vanjski — igraj iza ekstremnog 1:5 presa',
      'Linker Rückraum — hinter extremem 1:5-Press spielen',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 46,
    score: '25:24',
    defensiveSystem: 'Mixed',
    skillTags: ['defensiveReading', 'pressureDecisions'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: L(
      "Kiel play an extreme 1:5 high press at 46' — one deep, five high. You lead 25:24. Five defenders are stepped out above nine metres. Behind that high line, the pivot has space to receive and the deep defender is alone. You catch under pressure on the left.",
      'Kiel igra ekstremni 1:5 visoki pres u 46. minuti — jedan duboko, petoro visoko. Vodite 25:24. Pet braniča izašlo je iznad devet metara. Iza te visoke linije pivot ima prostora za prijem, a duboki branič je sam. Primaš pod pritiskom lijevo.',
      'Kiel spielt extremen 1:5-Hochpress in Minute 46 — einer tief, fünf hoch. Ihr führt 25:24. Fünf Verteidiger stehen über neun Metern. Hinter der hohen Linie hat der Kreisläufer Empfangsraum, der tiefe Verteidiger ist allein. Du empfängst unter Druck links.',
    ),
    question: L(
      'Where is the advantage against extreme 1:5?',
      'Gdje je prednost protiv ekstremnog 1:5?',
      'Wo liegt der Vorteil gegen extremes 1:5?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Play behind the high line — early ball to the pivot or the free space past the press',
          'Igraj iza visoke linije — rana lopta na pivota ili u slobodan prostor iza presa',
          'Hinter die hohe Linie spielen — früher Ball zum Kreisläufer oder in den freien Raum hinter dem Press',
        ),
        feedback: L(
          'Correct — five high leaves space behind; punish depth, do not duel all five in front.',
          'Točno — petoro visoko ostavlja prostor iza; kazni dubinu, ne dueliraj svih pet ispred.',
          'Richtig — fünf hoch lässt Raum dahinter; Tiefe bestrafen, nicht alle fünf davor duellieren.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the behind-lane is denied, one sharp 1v1 past the nearest high defender into the gap',
          'Ako je linija iza zatvorena, jedan oštar 1 na 1 pored najbližeg visokog braniča u prostor',
          'Wenn die Bahn dahinter zu ist, ein scharfes 1 gegen 1 am nächsten hohen Verteidiger in die Lücke',
        ),
        feedback: L(
          'Good — beating one high defender works if behind is closed; first read remains depth.',
          'Dobro — prolazak jednog visokog radi ako je iza zatvoreno; prvo čitanje i dalje je dubina.',
          'Gut — einen Hohen schlagen geht wenn dahinter zu; erste Lese bleibt Tiefe.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Hold and try to beat the entire high line with repeated side swings at nine metres',
          'Drži i pokušaj pobijediti cijelu visoku liniju ponavljanim bočnim transferima na devet metara',
          'Halten und die ganze hohe Linie mit wiederholten Seit-Swings auf neun Metern schlagen wollen',
        ),
        feedback: L(
          'Risky — swinging in front of five high defenders is exactly what the press wants.',
          'Rizično — prebacivanje ispred petoro visokih točno je ono što pres želi.',
          'Riskant — Schwingen vor fünf Hohen ist genau was der Press will.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Force a deep jump shot into five raised arms from behind the press',
          'Forsiraj duboki skok-šut u pet podignutih ruku ispred presa',
          'Tiefen Sprungwurf in fünf hochgestellte Arme vor dem Press erzwingen',
        ),
        feedback: L(
          'Poor — shooting into a five-man high wall ignores the free space behind them.',
          'Loše — šut u zid od petoro visokih ignorira slobodan prostor iza njih.',
          'Schlecht — Wurf in eine fünfköpfige hohe Wand ignoriert den freien Raum dahinter.',
        ),
      },
    ],
    explanation: L(
      'Cue: extreme 1:5 — five high, one deep, pivot space behind. Play behind the high line early. Swinging in front of five or shooting into raised arms wastes the depth gift.',
      'Signal: ekstremni 1:5 — petoro visoko, jedan duboko, prostor za pivota iza. Rano igraj iza visoke linije. Prebacivanje ispred petoro ili šut u podignute ruke baca dar dubine.',
      'Signal: extremes 1:5 — fünf hoch, einer tief, Raum für Kreisläufer dahinter. Früh hinter die hohe Linie. Schwingen davor oder Wurf in hochgestellte Arme verschenkt das Tiefen-Geschenk.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: false, rubricBias: 0.05 },
  },

  // ─── 26. Exclusion late attack 6v5 ───
  {
    familyKey: 'lb_exclusion_late_attack',
    title: L(
      'Left Back — Late Exclusion, Attack with Player Up',
      'Lijevi vanjski — kasno isključenje, napad s igračem više',
      'Linker Rückraum — späte Zeitstrafe, Angriff mit Spieler mehr',
    ),
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Final Minutes',
    minute: 56,
    score: '29:28',
    defensiveSystem: '6-0',
    skillTags: ['pressureDecisions', 'defensiveReading'],
    perception: false,
    numerical: '6v5',
    gameState: 'exclusion_late',
    situation: L(
      "At 56' you lead 29:28. The opponent just received a two-minute exclusion — you attack 6v5. Their remaining five scramble to cover width. You receive on the left with a rotator late between you and the wing; the pivot seal is available if the rotator commits.",
      'U 56. minuti Vodite 29:28. Protivnik je upravo dobio dvominutno isključenje — napadaš 6 na 5. Preostalih pet juri pokriti širinu. Primaš lijevo s rotirajućim braničem koji kasni između tebe i krila; zatvaranje pivota dostupno je ako se rotator veže.',
      'In Minute 56 führt ihr 29:28. Der Gegner hat gerade eine Zweiminutenstrafe — ihr greift 6 gegen 5 an. Die restlichen fünf scramblem um Breite. Du empfängst links mit einem Rotierer der zwischen dir und Außen spät ist; Kreisläufer-Abdichtung ist da wenn der Rotierer bindet.',
    ),
    question: L(
      'How do you use the late 6v5?',
      'Kako koristiš kasni višak 6 na 5?',
      'Wie nutzt du die späte 6-gegen-5?',
    ),
    answers: [
      {
        quality: 'optimal',
        text: L(
          'Force the late rotator to choose — punish wing or pivot as soon as he commits',
          'Natjeraj zakašnjelog rotatora da bira — kazni krilo ili pivota čim se veže',
          'Den späten Rotierer zur Wahl zwingen — Außen oder Kreisläufer bestrafen sobald er bindet',
        ),
        feedback: L(
          'Correct — late 6v5 value is making one short-handed defender choose and finishing the free side.',
          'Točno — vrijednost kasnog 6 na 5 je natjerati jednog braniča s igračem manje da bira i završiti slobodnu stranu.',
          'Richtig — späte 6 gegen 5 heißt einen Unterzahl-Verteidiger wählen lassen und die freie Seite abschließen.',
        ),
      },
      {
        quality: 'good',
        text: L(
          'If the rotator covers both for a moment, recycle once and re-force the same mismatch',
          'Ako rotator na trenutak pokrije oboje, jednom recikliraj i ponovo forsiraj istu nepokrivenost',
          'Wenn der Rotierer kurz beides deckt, einmal recyceln und denselben Mismatch neu erzwingen',
        ),
        feedback: L(
          'Good — one recycle is fine; endless empty swinging burns the exclusion clock.',
          'Dobro — jedno vraćanje lopte je u redu; beskrajno prazno prebacivanje troši sat isključenja.',
          'Gut — ein Recycle ist ok; endloses leeres Schwingen verbrennt die Zeitstrafen-Uhr.',
        ),
      },
      {
        quality: 'risky',
        text: L(
          'Hold for a perfect set play until the exclusion is almost over',
          'Drži za savršenu postavljenu akciju dok isključenje skoro ne istekne',
          'Auf perfektes Positionsangriffsspiel halten bis die Zeitstrafe fast vorbei ist',
        ),
        feedback: L(
          'Risky — patient perfection often returns the ball just as they become 6v6 again.',
          'Rizično — strpljivo savršenstvo često vraća loptu baš kad opet postanu 6 na 6.',
          'Riskant — geduldige Perfektion bringt den Ball oft zurück genau wenn wieder 6 gegen 6 ist.',
        ),
      },
      {
        quality: 'poor',
        text: L(
          'Force a contested deep shot without engaging the late rotator at all',
          'Forsiraj otežan duboki šut bez ikakvog vezivanja zakašnjelog rotatora',
          'Umkämpften Tiefenwurf erzwingen ohne den späten Rotierer überhaupt zu binden',
        ),
        feedback: L(
          'Poor — ignoring the mismatch wastes the entire late numerical advantage.',
          'Loše — ignoriranje nepokrivenosti baca cijelu kasnu brojčanu prednost.',
          'Schlecht — den Mismatch ignorieren verschenkt die ganze späte Überzahl.',
        ),
      },
    ],
    explanation: L(
      'Cue: late exclusion, 6v5, rotator late between you and the wing with pivot seal available. Force the choice and punish the free side. Holding until the exclusion ends or shooting without engaging the rotator wastes the advantage.',
      'Signal: kasno isključenje, 6 na 5, rotator kasni između tebe i krila uz dostupno zatvaranje pivota. Natjeraj izbor i kazni slobodnu stranu. Držanje do isteka isključenja ili šut bez vezivanja rotatora baca prednost.',
      'Signal: späte Zeitstrafe, 6 gegen 5, Rotierer spät zwischen dir und Außen mit Kreisläufer-Abdichtung. Wahl erzwingen und freie Seite bestrafen. Halten bis Ablauf oder Wurf ohne Bindung verschenkt den Vorteil.',
    ),
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.15 },
  },
];
