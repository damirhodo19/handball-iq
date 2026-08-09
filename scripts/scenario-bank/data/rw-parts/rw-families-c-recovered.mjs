/**
 * Recovered Part C — individually authored RW scenarios.
 * Replaces template-farm block scn_bank_901–920 (minus removed merges).
 * Style bar: locked refs 872 / 873 / 876 / 879 / 880.
 */

function L(en, hr, de) {
  return { en, hr, de };
}

function ans(quality, text, feedback) {
  return { quality, text, feedback };
}

/** Families removed (merged into stronger keepers). */
export const RW_C_REMOVED = [
  {
    oldId: 'scn_bank_903',
    familyKey: 'rw_trans_finish_before_recovery',
    teachingObjective: 'Finish in first wave before late recovering defender arrives',
    reason: 'Same lesson as rw_60_defender_late_recover (882) with numerical sticker only',
    mergedIntoId: 'scn_bank_882',
    mergedIntoFamily: 'rw_60_defender_late_recover',
  },
  {
    oldId: 'scn_bank_906',
    familyKey: 'rw_trans_stop_forcing',
    teachingObjective: 'Stop forcing when first-wave advantage is gone',
    reason: 'Same lesson as rw_trans_second_wave_positional (877)',
    mergedIntoId: 'scn_bank_877',
    mergedIntoFamily: 'rw_trans_second_wave_positional',
  },
  {
    oldId: 'scn_bank_908',
    familyKey: 'rw_trans_second_wave_width_hold',
    teachingObjective: 'Hold width as second wave meets set defence',
    reason: 'Same width-settle lesson as 877; score sticker only',
    mergedIntoId: 'scn_bank_877',
    mergedIntoFamily: 'rw_trans_second_wave_positional',
  },
  {
    oldId: 'scn_bank_911',
    familyKey: 'rw_5v6_no_force_corner',
    teachingObjective: 'Do not force covered corner finish in 5v6',
    reason: 'Merged into rw_5v6_safe_width — one clear 5v6 risk lesson',
    mergedIntoId: 'scn_bank_910',
    mergedIntoFamily: 'rw_5v6_safe_width',
  },
  {
    oldId: 'scn_bank_916',
    familyKey: 'rw_empty_own_no_skip_risk',
    teachingObjective: 'Refuse risky skip with own goal empty',
    reason: 'Same empty-own-goal risk management as locked 879',
    mergedIntoId: 'scn_bank_879',
    mergedIntoFamily: 'rw_empty_own_goal_safe_return',
  },
];

/** Production ID → recovered family content (IDs kept). */
export const RW_C_RECOVERED = [
  {
    id: 'scn_bank_901',
    oldTeachingObjective: 'Finish available side when GK near arm high (template, no real cue use)',
    newTeachingObjective: 'Near arm stays high before take-off → finish low under that arm, not a blind far-post',
    familyKey: 'rw_gk_near_arm_high',
    title: L(
      'Right Wing — Goalkeeper Near Arm Stays High Before Take-Off',
      'Desno krilo — bliža ruka vratara ostaje visoko prije odraza',
      'Rechtsaußen — naher Torwartarm bleibt vor dem Absprung hoch',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 18,
    score: '9:8',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'decision-making', 'finishing'],
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    primaryTacticalCue:
      'GK near arm stays high and committed to near high corner before take-off — finish low under that arm',
    situation: L(
      'You lead 9:8 at 18\' against 6:0. The right back has pulled your wing defender one step inside and the ball arrives clean in the right corner. You have space to take off toward the middle. Before you jump, the goalkeeper’s near foot is already on the near post and his near arm stays high, covering the near high corner. His far foot is still central and the low near path under that raised arm is open.',
      'Vodite 9:8 u 18. minuti protiv 6:0. Desni vanjski je povukao krilnog braniča korak unutra i lopta stiže čisto u desni kut. Imaš prostor za odraz prema sredini. Prije skoka bliža noga vratara već je na prvoj stativi, a bliža ruka ostaje visoko i zatvara gornji bliži kut. Dalja noga još je centralna, a niski put ispod te podignute ruke prema bližoj stativi ostaje otvoren.',
      'Ihr führt 9:8 in Minute 18 gegen 6:0. Der rechte Rückraum hat deinen Außenverteidiger einen Schritt nach innen gezogen und der Ball kommt sauber in die rechte Ecke. Du hast Raum für den Absprung zur Mitte. Vor dem Sprung steht der nahe Torwartfuß schon am nahen Pfosten und der nahe Arm bleibt hoch und deckt die hohe nahe Ecke. Der ferne Fuß steht noch zentral und der tiefe nahe Weg unter diesem Arm ist offen.',
    ),
    question: L(
      'With the near arm already high before take-off, where do you finish?',
      'Kad je bliža ruka već visoko prije odraza, kamo završavaš?',
      'Wohin schließt du ab, wenn der nahe Arm vor dem Absprung schon hoch ist?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Take off and finish low under the raised near arm toward the near post',
          'Odraz i završi nisko ispod podignute bliže ruke prema prvoj stativi',
          'Abspringen und tief unter dem hohen nahen Arm zum nahen Pfosten abschließen',
        ),
        L(
          'Correct — the high near arm has already left the low near path.',
          'Točno — visoka bliža ruka već je ostavila niski bliži put.',
          'Richtig — der hohe nahe Arm hat den tiefen nahen Weg schon freigegeben.',
        ),
      ),
      ans(
        'good',
        L(
          'Hold the shot half a beat if he suddenly drops that near arm during the jump',
          'Pričekaj s udarcem pola takta ako tijekom skoka naglo spusti tu bližu ruku',
          'Den Wurf einen halben Takt halten wenn er den nahen Arm im Sprung plötzlich senkt',
        ),
        L(
          'Good only if the high-arm cue disappears mid-air.',
          'Dobro samo ako signal visoke ruke nestane u zraku.',
          'Gut nur wenn das Hocharm-Signal in der Luft verschwindet.',
        ),
      ),
      ans(
        'risky',
        L(
          'Force the far high corner because he looks committed near',
          'Forsiraj daleki gornji kut jer izgleda kao da je vezan bliže',
          'Die ferne hohe Ecke erzwingen weil er nah gebunden wirkt',
        ),
        L(
          'Risky — without a far-side open cue you are guessing.',
          'Rizično — bez signala otvorene dalje strane nagađaš.',
          'Riskant — ohne Signal der offenen fernen Seite rätst du.',
        ),
      ),
      ans(
        'poor',
        L(
          'Lob immediately because any forward goalkeeper movement invites it',
          'Odmah lobaj jer svaki izlazak vratara to poziva',
          'Sofort lobben weil jede Torwartbewegung danach verlangt',
        ),
        L(
          'Wrong — there is no early leave or dropped-hands cue for a lob.',
          'Krivo — nema izlaska ni spuštenih ruku za lob.',
          'Falsch — kein Herauskommen und keine gesenkten Hände für einen Lob.',
        ),
      ),
    ],
    explanation: L(
      'The usable cue is the high near arm before take-off. Finish low under it. A far-post guess or automatic lob needs a different cue.',
      'Koristan signal je visoka bliža ruka prije odraza. Završi nisko ispod nje. Pogađanje daljeg kuta ili automatski lob treba drugi signal.',
      'Das nutzbare Signal ist der hohe nahe Arm vor dem Absprung. Tief darunter abschließen. Ferner Pfosten oder Automatik-Lob brauchen ein anderes Signal.',
    ),
    whyCorrectOverSecondBest: L(
      'A uses the arm-height cue that is already present; B waits for a mid-air change that has not happened.',
      'A koristi visinu ruke koja je već tu; B čeka promjenu u zraku koja se još nije dogodila.',
      'A nutzt die schon vorhandene Armhöhe; B wartet auf eine Luftänderung die noch nicht da ist.',
    ),
  },

  {
    id: 'scn_bank_902',
    oldTeachingObjective: 'Generic free finish in 2v1 with stock A/B',
    newTeachingObjective: 'In 2v1 hold the wide lane as the pass option until the CB fixes the lone defender',
    familyKey: 'rw_trans_2v1_finish_lane',
    title: L(
      'Right Wing — First Wave 2v1: Stay the Wide Pass Option',
      'Desno krilo — prvi val 2 na 1: ostani široka opcija za dodavanje',
      'Rechtsaußen — erste Welle 2v1: breite Passoption bleiben',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Transition',
    minute: 20,
    score: '10:9',
    defensiveSystem: null,
    skillTags: ['transition', 'timing', 'teamplay'],
    perception: true,
    handedness: 'none',
    numerical: '2v1',
    gameState: 'none',
    primaryTacticalCue:
      'Lone defender between CB and goal — hold right width at six metres as the pass option, do not crowd',
    situation: L(
      'You lead 10:9 at 20\'. After the ball win you and the centre back run a 2v1 on the right side of the first wave. The centre back has the ball centrally. The only recovering defender stands between him and the goal, chest toward the ball. You are wide on the right near the six-metre line with a clear lane if he commits to the centre back. If you cut early into his chest, you close the 2v1 yourself.',
      'Vodite 10:9 u 20. minuti. Nakon osvajanja lopte ti i srednji vanjski trčite 2 na 1 desnom stranom prvog vala. Srednji vanjski vodi loptu sredinom. Jedini branič u povratku stoji između njega i gola, prsima prema lopti. Ti si široko desno uz liniju šest metara s čistim putem ako on krene na srednjeg. Ako rano urežeš u njegova prsa, sam zatvaraš 2 na 1.',
      'Ihr führt 10:9 in Minute 20. Nach dem Ballgewinn lauft ihr mit dem Rückraum Mitte ein 2v1 auf der rechten Seite der ersten Welle. Der Rückraum Mitte führt den Ball zentral. Der einzige zurücklaufende Verteidiger steht zwischen ihm und dem Tor, Brust zum Ball. Du bist breit rechts an der Sechs-Meter-Linie mit klarer Gasse wenn er zum Rückraum geht. Schneidet du früh in seine Brust, machst du das 2v1 selbst zu.',
    ),
    question: L(
      'In this 2v1, what is your first job on the right?',
      'U ovom 2 na 1, što je tvoj prvi posao desno?',
      'Was ist in diesem 2v1 dein erster Job rechts?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Hold width near six metres and stay available as the pass option while the centre back fixes the defender',
          'Drži širinu uz šest metara i ostani dostupna opcija za dodavanje dok srednji veže braniča',
          'Breite an der Sechs halten und als Passoption bleiben während der Rückraum den Verteidiger bindet',
        ),
        L(
          'Correct — width keeps the 2v1 alive.',
          'Točno — širina drži 2 na 1 živim.',
          'Richtig — Breite hält das 2v1 lebendig.',
        ),
      ),
      ans(
        'good',
        L(
          'Cut behind him only after the centre back has fixed his feet with a shot threat or drive',
          'Ureži iza njega tek kad mu srednji veže noge prijetnjom šuta ili prodorom',
          'Hinter ihn schneiden erst wenn der Rückraum seine Füße mit Schussdrohung oder Durchbruch bindet',
        ),
        L(
          'Good as the second action after the fix.',
          'Dobro kao druga akcija nakon vezivanja.',
          'Gut als zweite Aktion nach dem Binden.',
        ),
      ),
      ans(
        'risky',
        L(
          'Sprint into the middle now to demand the ball at the top of the nine',
          'Odmah utrči u sredinu i traži loptu na vrhu devetke',
          'Sofort in die Mitte sprinten und den Ball oben an der Neun fordern',
        ),
        L(
          'Crowds the only free lane the centre back is using.',
          'Zatvara jedini slobodni put koji srednji koristi.',
          'Macht die einzige freie Gasse des Rückraums zu.',
        ),
      ),
      ans(
        'poor',
        L(
          'Stop outside nine metres and wait for a set attack to form',
          'Stani izvan devet metara i čekaj da se složi pozicijski napad',
          'Außerhalb der Neun stoppen und auf den Positionsangriff warten',
        ),
        L(
          'Kills a live 2v1 without a reason.',
          'Ubija živi 2 na 1 bez razloga.',
          'Tötet ein lebendiges 2v1 ohne Grund.',
        ),
      ),
    ],
    explanation: L(
      'One defender between ball and goal: stay the wide option. Cut only after he is fixed. Early middle runs destroy the 2v1.',
      'Jedan branič između lopte i gola: ostani široka opcija. Ulaz tek kad je vezan. Rani utrčaji u sredinu uništavaju 2 na 1.',
      'Ein Verteidiger zwischen Ball und Tor: breite Option bleiben. Schneiden erst nach dem Binden. Frühe Läufe in die Mitte zerstören das 2v1.',
    ),
    whyCorrectOverSecondBest: L(
      'A is correct now while the defender is still on the ball; B becomes correct after a real fix.',
      'A je točan sada dok je branič još na lopti; B postaje točan nakon pravog vezivanja.',
      'A ist jetzt richtig während der Verteidiger noch am Ball ist; B wird richtig nach echtem Binden.',
    ),
  },

  {
    id: 'scn_bank_904',
    oldTeachingObjective: 'Stock short return under pressure (template)',
    newTeachingObjective: 'Pressure catch in transition: secure first, short return, do not force take-off',
    familyKey: 'rw_trans_pressure_catch',
    title: L(
      'Right Wing — Secure a Pressured Transition Catch',
      'Desno krilo — osiguraj pritisnuti prijem u kontri',
      'Rechtsaußen — bedrängten Übergangsfang sichern',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Transition',
    minute: 24,
    score: '12:11',
    defensiveSystem: null,
    skillTags: ['transition', 'decision-making', 'risk-management'],
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    primaryTacticalCue:
      'High pass behind right shoulder + recovering defender on sideline — secure and short return',
    situation: L(
      'You lead 12:11 at 24\'. In the second wave the pass to you is high and arrives behind your right shoulder near the sideline. A recovering defender is already within arm’s length on the sideline line, hand up toward your catch. You need an extra touch to control the ball. The centre back is free three metres inside you and calling for the short return. There is no clean take-off foot yet.',
      'Vodite 12:11 u 24. minuti. U drugom valu lopta ide previsoko i stiže iza desnog ramena uz aut-liniju. Branič u povratku već je na dohvat ruke uz aut, ruka gore prema tvom prijema. Treba ti dodatni dodir da kontroliraš loptu. Srednji vanjski je slobodan tri metra unutra i zove kratku povratnu. Još nemaš čist odraz.',
      'Ihr führt 12:11 in Minute 24. In der zweiten Welle kommt der Pass hoch und hinter deine rechte Schulter an der Seitenlinie. Ein zurücklaufender Verteidiger ist schon auf Armlänge an der Linie, Hand hoch zum Fang. Du brauchst einen Extra-Kontakt. Der Rückraum Mitte ist drei Meter innen frei und verlangt den kurzen Rückpass. Noch kein sauberer Absprungfuß.',
    ),
    question: L(
      'You receive under that pressure — what protects the possession?',
      'Primaš pod tim pritiskom — što štiti posjed?',
      'Du fängst unter diesem Druck — was schützt den Ballbesitz?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Secure the catch with the extra touch and play the short return to the free centre back',
          'Osiguraj prijem dodatnim dodirom i odigraj kratku povratnu slobodnom srednjem',
          'Fang mit Extra-Kontakt sichern und kurzen Rückpass zum freien Rückraum Mitte spielen',
        ),
        L(
          'Correct — first control, then the free short option.',
          'Točno — prvo kontrola, onda slobodna kratka opcija.',
          'Richtig — zuerst Kontrolle, dann die freie kurze Option.',
        ),
      ),
      ans(
        'good',
        L(
          'Finish only if the first touch puts the ball cleanly in front of your take-off foot and the defender’s hand is late',
          'Završi samo ako prvi dodir stavi loptu čisto pred odraznu nogu, a braničeva ruka kasni',
          'Nur abschließen wenn der erste Kontakt den Ball sauber vor den Absprungfuß legt und die Hand spät ist',
        ),
        L(
          'Becomes correct if the catch suddenly cleans and the contest disappears.',
          'Postaje točno ako prijem odjednom bude čist i kontakt nestane.',
          'Wird richtig wenn der Fang plötzlich sauber wird und der Kontakt verschwindet.',
        ),
      ),
      ans(
        'risky',
        L(
          'Turn immediately into a contested take-off along the sideline',
          'Odmah se okreni u osporeni odraz uz aut-liniju',
          'Sofort in einen umkämpften Absprung an der Seitenlinie drehen',
        ),
        L(
          'High turnover risk with an unsettled catch.',
          'Visok rizik gubitka s nestabilnim prijemom.',
          'Hohes Turnover-Risiko bei unsicherem Fang.',
        ),
      ),
      ans(
        'poor',
        L(
          'Lob the recovering defender because he is close',
          'Lobaj braniča u povratku jer je blizu',
          'Den zurücklaufenden Verteidiger lobben weil er nah ist',
        ),
        L(
          'Wrong tool — this is a catch/possession problem, not a finish read.',
          'Krivi alat — ovo je problem prijema/posjeda, ne čitanja završetka.',
          'Falsches Mittel — Fang/Besitz-Problem, keine Abschluss-Lesung.',
        ),
      ),
    ],
    explanation: L(
      'High ball behind the shoulder plus a contesting hand: secure and give the short return. Forcing the take-off from a bad catch is the main mistake.',
      'Visoka lopta iza ramena plus ruka u kontaktu: osiguraj i daj kratku povratnu. Forsiranje odraza iz lošeg prijema glavna je greška.',
      'Hoher Ball hinter der Schulter plus störende Hand: sichern und kurz zurück. Absprung aus schlechtem Fang ist der Hauptfehler.',
    ),
    whyCorrectOverSecondBest: L(
      'A matches the unsettled catch and free short option; B needs a clean first touch that is not present.',
      'A odgovara nestabilnom prijema i slobodnoj kratkoj opciji; B treba čist prvi dodir kojeg nema.',
      'A passt zu unsicherem Fang und freier Kurzoption; B braucht einen sauberen Erstkontakt den es nicht gibt.',
    ),
  },

  {
    id: 'scn_bank_905',
    oldTeachingObjective: 'Template cut-after-fix with corrupted EN/HR',
    newTeachingObjective: 'Cut inside behind recovering defender only after CB fixes him',
    familyKey: 'rw_trans_cut_after_pass',
    title: L(
      'Right Wing — Cut Behind Only After the Fix',
      'Desno krilo — ureži iza tek nakon vezivanja',
      'Rechtsaußen — hinterlaufen erst nach dem Binden',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Transition',
    minute: 26,
    score: '13:13',
    defensiveSystem: null,
    skillTags: ['transition', 'timing', 'perception'],
    perception: true,
    handedness: 'none',
    numerical: '3v2',
    gameState: 'none',
    primaryTacticalCue:
      'Recovering defender between you and CB — hold lane until CB fixes him, then cut behind',
    situation: L(
      'Tied 13:13 at 26\'. You run wide right in the first wave. A recovering defender is between you and the centre back, hips still facing the ball. The centre back still has the ball and has not yet threatened a shot or drive. Your cut lane behind the defender will open only if he turns his feet fully onto the centre back. Cutting now runs you into his back.',
      'Neriješeno je 13:13 u 26. minuti. Trčiš široko desno u prvom valu. Branič u povratku stoji između tebe i srednjeg vanjskog, bokovi još prema lopti. Srednji još ima loptu i nije zaprijetio šutom ni prodorom. Koridor za urezivanje iza braniča otvara se tek ako okrene noge potpuno na srednjeg. Urez sada vodi te u njegova leđa.',
      'Unentschieden 13:13 in Minute 26. Du läufst breit rechts in der ersten Welle. Ein zurücklaufender Verteidiger steht zwischen dir und dem Rückraum Mitte, Hüfte noch zum Ball. Der Rückraum hat den Ball noch und hat weder Schuss noch Durchbruch angedroht. Die Schnittgasse hinter ihm öffnet sich erst wenn er die Füße voll auf den Rückraum dreht. Jetzt schneiden läuft dich in seinen Rücken.',
    ),
    question: L(
      'When may you cut inside behind the recovering defender?',
      'Kada smiješ urezati unutra iza braniča u povratku?',
      'Wann darfst du hinter den zurücklaufenden Verteidiger schneiden?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Hold the wide lane until the centre back fixes his feet, then cut behind him toward six metres',
          'Drži široki put dok mu srednji ne veže noge, onda ureži iza njega prema šest metara',
          'Breite Gasse halten bis der Rückraum seine Füße bindet, dann hinter ihn zur Sechs schneiden',
        ),
        L(
          'Correct — the cut needs a real fix first.',
          'Točno — urez treba pravo vezivanje prvo.',
          'Richtig — der Schnitt braucht zuerst echtes Binden.',
        ),
      ),
      ans(
        'good',
        L(
          'Stay wide as a pass option if the centre back never fixes him and plays safe into the set attack',
          'Ostani široko kao opcija za dodavanje ako srednji nikad ne veže njega i ide sigurno u pozicijski napad',
          'Breit als Passoption bleiben wenn der Rückraum ihn nie bindet und sicher in den Positionsangriff geht',
        ),
        L(
          'Correct when the fix never comes.',
          'Točno kad vezivanje nikad ne dođe.',
          'Richtig wenn das Binden nie kommt.',
        ),
      ),
      ans(
        'risky',
        L(
          'Cut immediately behind him while his hips still face the ball',
          'Ureži odmah iza njega dok mu bokovi još gledaju loptu',
          'Sofort hinter ihn schneiden während seine Hüfte noch zum Ball zeigt',
        ),
        L(
          'Runs into his recovery line.',
          'Trčiš mu u liniju povratka.',
          'Läuft in seine Rückkehrlinie.',
        ),
      ),
      ans(
        'poor',
        L(
          'Stop and call for a high lob over the recovering defender',
          'Stani i zovi visoki lob preko braniča u povratku',
          'Stoppen und einen hohen Lob über den zurücklaufenden Verteidiger fordern',
        ),
        L(
          'Wrong tool for this geometry.',
          'Krivi alat za ovu geometriju.',
          'Falsches Mittel für diese Geometrie.',
        ),
      ),
    ],
    explanation: L(
      'Defender between you and the ball: wait for the centre back to fix his feet, then cut. Early cut hits his back.',
      'Branič između tebe i lopte: čekaj da mu srednji veže noge, onda ureži. Rani urez udara u leđa.',
      'Verteidiger zwischen dir und Ball: warten bis der Rückraum die Füße bindet, dann schneiden. Früher Schnitt trifft seinen Rücken.',
    ),
    whyCorrectOverSecondBest: L(
      'A is the timed cut after a fix; B is the fallback if the fix never arrives.',
      'A je vremenski urez nakon vezivanja; B je rezervna opcija ako vezivanje ne dođe.',
      'A ist der zeitliche Schnitt nach dem Binden; B ist die Reserve wenn das Binden ausbleibt.',
    ),
  },

  {
    id: 'scn_bank_907',
    oldTeachingObjective: 'Stock short return when transition finish gone',
    newTeachingObjective: 'No clean transition finish: short secure continuation, not a forced wing shot',
    familyKey: 'rw_trans_safe_continuation',
    title: L(
      'Right Wing — Safe Continuation When the Counter Finish Is Gone',
      'Desno krilo — siguran nastavak kad nema završetka iz kontre',
      'Rechtsaußen — sichere Fortsetzung wenn der Konterabschluss weg ist',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Transition',
    minute: 30,
    score: '15:14',
    defensiveSystem: '6-0',
    skillTags: ['transition', 'decision-making', 'risk-management'],
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    primaryTacticalCue:
      'Wing defender already between you and goal with hand up — short return, no forced finish',
    situation: L(
      'You trail 15:14 at 30\'. After the counter you receive near the sideline, but the wing defender is already between you and the goal with his outside hand up. The half defender is sliding across to cover the short inside lane. The right back is free behind you calling for the ball. There is no take-off foot toward the middle without contacting the raised arm.',
      'Gubite 15:14 u 30. minuti. Nakon kontre primaš blizu aut-linije, ali krilni branič već stoji između tebe i gola s vanjskom rukom gore. Polubranitelj klizi da zatvori kratki unutarnji put. Desni vanjski je slobodan iza tebe i zove loptu. Nema odrazne noge prema sredini bez kontakta s podignutom rukom.',
      'Ihr liegt 15:14 in Minute 30 zurück. Nach dem Konter fängst du nah an der Seitenlinie, aber der Außenverteidiger steht schon zwischen dir und dem Tor mit äußerer Hand hoch. Der Halbe schiebt den kurzen Innenweg zu. Der rechte Rückraum ist hinter dir frei und verlangt den Ball. Kein Absprungfuß zur Mitte ohne Kontakt mit dem Arm.',
    ),
    question: L(
      'There is no clean finish left in transition — how do you continue?',
      'Nema više čistog završetka u kontri — kako nastavljaš?',
      'Kein sauberer Konterabschluss mehr — wie setzt du fort?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Secure the catch and play the short return to the free right back',
          'Osiguraj prijem i odigraj kratku povratnu slobodnom desnom vanjskom',
          'Fang sichern und kurzen Rückpass zum freien rechten Rückraum spielen',
        ),
        L(
          'Correct — possession into the set attack beats a blocked wing shot.',
          'Točno — posjed u pozicijski napad bolji je od blokiranog krilnog šuta.',
          'Richtig — Besitz in den Positionsangriff schlägt den geblockten Flügelwurf.',
        ),
      ),
      ans(
        'good',
        L(
          'Hold width for one more circulation if the right back is under immediate pressure and cannot receive',
          'Drži širinu za još jednu cirkulaciju ako je desni vanjski pod trenutnim pritiskom i ne može primiti',
          'Breite für eine weitere Zirkulation halten wenn der rechte Rückraum unter Druck nicht empfangen kann',
        ),
        L(
          'Useful if the short return is temporarily covered.',
          'Korisno ako je kratka povratna trenutno zatvorena.',
          'Nützlich wenn der kurze Rückpass kurz verstellt ist.',
        ),
      ),
      ans(
        'risky',
        L(
          'Force the take-off into the raised arm because the counter started well',
          'Forsiraj odraz u podignutu ruku jer je kontra dobro krenula',
          'Absprung in den hohen Arm erzwingen weil der Konter gut begann',
        ),
        L(
          'The start of the counter does not create a finish now.',
          'Početak kontre ne stvara završetak sada.',
          'Der Konterbeginn schafft jetzt keinen Abschluss.',
        ),
      ),
      ans(
        'poor',
        L(
          'Enter behind the wing defender into the crowded six-metre traffic',
          'Uđi iza krilnog braniča u gužvu na šest metara',
          'Hinter den Außenverteidiger in den Sechs-Meter-Verkehr gehen',
        ),
        L(
          'Adds bodies where there is already no lane.',
          'Dodaje tijela gdje već nema puta.',
          'Mehr Körper wo schon keine Gasse ist.',
        ),
      ),
    ],
    explanation: L(
      'Defender already between you and goal: short return to the free back. Do not force a wing finish from a dead counter.',
      'Branič već između tebe i gola: kratka povratna slobodnom vanjskom. Ne forsiraj krilni završetak iz mrtve kontre.',
      'Verteidiger schon zwischen dir und Tor: kurzer Rückpass zum freien Rückraum. Keinen Flügelabschluss aus totem Konter erzwingen.',
    ),
    whyCorrectOverSecondBest: L(
      'A uses the free short option that exists now; B waits only if that option is covered.',
      'A koristi slobodnu kratku opciju koja postoji sada; B čeka samo ako je ta opcija zatvorena.',
      'A nutzt die freie Kurzoption die jetzt da ist; B wartet nur wenn sie verstellt ist.',
    ),
  },

  {
    id: 'scn_bank_909',
    oldTeachingObjective: 'Stock recycle in 6v5 when covered',
    newTeachingObjective: '6v5 with covered take-off: short return — numerical advantage is not an automatic finish',
    familyKey: 'rw_6v5_recycle_when_covered',
    title: L(
      'Right Wing — 6v5 with Covered Take-Off: Recycle',
      'Desno krilo — 6 na 5 sa zatvorenim odrazom: vrati loptu',
      'Rechtsaußen — 6v5 mit verstelltem Absprung: zurückspielen',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 34,
    score: '17:16',
    defensiveSystem: '6-0',
    skillTags: ['decision-making', 'numerical', 'risk-management'],
    perception: true,
    handedness: 'none',
    numerical: '6v5',
    gameState: 'none',
    primaryTacticalCue:
      '6v5 but wing defender square on take-off with hand up — short return, do not force',
    situation: L(
      'You lead 17:16 at 34\' in a 6v5 after their exclusion. The right back has pulled the half defender, but your wing defender stays on the six-metre line square in front of your take-off foot with his outside hand up. The short return lane to the right back is open. Being a player up does not create a free shot while that body is still in your jump path.',
      'Vodite 17:16 u 34. minuti s igračem više (6 na 5) nakon isključenja. Desni vanjski je povukao polubranitelja, ali krilni branič ostaje na šest metara ravno ispred tvoje odrazne noge s vanjskom rukom gore. Kratka povratna prema desnom vanjskom je otvorena. Igrač više ne stvara slobodan šut dok je to tijelo još u putu odraza.',
      'Ihr führt 17:16 in Minute 34 im 6v5 nach ihrer Zeitstrafe. Der rechte Rückraum hat den Halben gezogen, aber dein Außenverteidiger bleibt auf der Sechs frontal vor deinem Absprungfuß mit äußerer Hand hoch. Der kurze Rückpass zum rechten Rückraum ist offen. Die Überzahl schafft keinen freien Wurf solange dieser Körper noch in deiner Absprungbahn steht.',
    ),
    question: L(
      'You are in 6v5 but your take-off is covered — what is first?',
      'Imaš igrača više, ali odraz je zatvoren — što je prvo?',
      'Du hast Überzahl, aber der Absprung ist zu — was zuerst?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Secure the catch and play the short return to the free right back',
          'Osiguraj prijem i odigraj kratku povratnu slobodnom desnom vanjskom',
          'Fang sichern und kurzen Rückpass zum freien rechten Rückraum spielen',
        ),
        L(
          'Correct — recycle until the wing lane is real.',
          'Točno — vrati loptu dok put za odraz ne postane stvaran.',
          'Richtig — zurückspielen bis die Flügelgasse real ist.',
        ),
      ),
      ans(
        'good',
        L(
          'Finish only if he turns his hips inside toward the pivot and opens your take-off foot before you jump',
          'Završi samo ako okrene bokove unutra prema pivotu i otvori ti odraznu nogu prije skoka',
          'Nur abschließen wenn er die Hüfte innen zum Kreis dreht und deinen Absprungfuß vor dem Sprung öffnet',
        ),
        L(
          'Becomes correct if the cover leaves.',
          'Postaje točno ako pokriće ode.',
          'Wird richtig wenn die Deckung weggeht.',
        ),
      ),
      ans(
        'risky',
        L(
          'Force the take-off into his chest because you are a player up',
          'Forsiraj odraz u prsa jer imaš igrača više',
          'Absprung in seine Brust erzwingen weil Überzahl herrscht',
        ),
        L(
          'Numerical label does not beat a covered take-off.',
          'Brojčana oznaka ne pobjeđuje zatvoreni odraz.',
          'Die Überzahl-Marke schlägt keinen verstellten Absprung.',
        ),
      ),
      ans(
        'poor',
        L(
          'Enter behind him into the crowded exclusion defence',
          'Uđi iza njega u gužvu obrane s isključenjem',
          'Hinter ihn in die gedrängte Unterzahlverteidigung gehen',
        ),
        L(
          'Crowds the middle where the extra attacker already works.',
          'Zatrpava sredinu gdje dodatni napadač već radi.',
          'Verstopft die Mitte wo der Extraangreifer schon arbeitet.',
        ),
      ),
    ],
    explanation: L(
      'Player-up only helps if the take-off is free. Square defender with hand up: short return. Finish if he turns inside and opens the foot.',
      'Igrač više pomaže samo ako je odraz slobodan. Branič ravno s rukom gore: kratka povratna. Završi ako se okrene unutra i otvori nogu.',
      'Überzahl hilft nur bei freiem Absprung. Frontaler Verteidiger mit Hand hoch: kurzer Rückpass. Abschließen wenn er innen dreht und den Fuß öffnet.',
    ),
    whyCorrectOverSecondBest: L(
      'A matches the covered take-off now; B waits for a hip turn that has not happened.',
      'A odgovara zatvorenom odrazu sada; B čeka okret bokova koji se nije dogodio.',
      'A passt zum verstellten Absprung jetzt; B wartet auf eine Hüftdrehung die nicht da ist.',
    ),
  },

  {
    id: 'scn_bank_910',
    oldTeachingObjective: 'Generic stay wide in 5v6 (template)',
    newTeachingObjective: 'In 5v6 hold width as safe release — do not force the corner into a home wing defender',
    familyKey: 'rw_5v6_safe_width',
    title: L(
      'Right Wing — 5v6: Hold Width, Do Not Force the Corner',
      'Desno krilo — 5 na 6: drži širinu, ne forsiraj kut',
      'Rechtsaußen — 5v6: Breite halten, Ecke nicht erzwingen',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 36,
    score: '18:17',
    defensiveSystem: '6-0',
    skillTags: ['decision-making', 'numerical', 'teamplay'],
    perception: false,
    handedness: 'none',
    numerical: '5v6',
    gameState: 'none',
    primaryTacticalCue:
      'Player down — wing defender stays between you and near post; hold width as safe release for RB',
    situation: L(
      'You trail 18:17 at 36\' a player down (5v6). The defence is compact. Your wing defender does not follow the ball inside; he stays between you and the near post with both feet toward the corner. The right back needs a safe release on the right. Forcing a corner finish into that body risks the ball and the empty space behind your attack.',
      'Gubite 18:17 u 36. minuti s igračem manje (5 na 6). Obrana je kompaktna. Krilni branič ne prati loptu unutra; ostaje između tebe i prve stative s obje noge prema kutu. Desnom vanjskom treba sigurna opcija desno. Forsiranje završetka iz kuta u to tijelo riskira loptu i prostor iza napada.',
      'Ihr liegt 18:17 in Minute 36 in Unterzahl (5v6). Die Abwehr ist kompakt. Dein Außenverteidiger folgt dem Ball nicht nach innen; er bleibt zwischen dir und dem nahen Pfosten mit beiden Füßen zur Ecke. Der rechte Rückraum braucht eine sichere Ablage rechts. Ein erzwungener Eckenabschluss in diesen Körper riskiert Ball und Raum hinter eurem Angriff.',
    ),
    question: L(
      'In this 5v6, what is your job on the right wing?',
      'U ovom 5 na 6, što je tvoj posao na desnom krilu?',
      'Was ist in diesem 5v6 dein Job auf Rechtsaußen?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Hold width near the sideline as the safe release pass and keep the corner available without forcing a shot',
          'Drži širinu uz aut-liniju kao sigurnu opciju za dodavanje i čuvaj kut bez forsiranja šuta',
          'Breite an der Seitenlinie als sichere Ablage halten und die Ecke ohne erzwungenen Wurf verfügbar lassen',
        ),
        L(
          'Correct — width protects possession when you are a player down.',
          'Točno — širina štiti posjed kad ste igrač manje.',
          'Richtig — Breite schützt den Besitz in Unterzahl.',
        ),
      ),
      ans(
        'good',
        L(
          'Ask for the ball only after the wing defender turns inside to help and leaves a real take-off foot',
          'Traži loptu tek kad se krilni branič okrene unutra u pomoć i ostavi pravu odraznu nogu',
          'Den Ball erst fordern wenn der Außenverteidiger innen hilft und einen echten Absprungfuß lässt',
        ),
        L(
          'Correct if help finally opens the corner.',
          'Točno ako pomoć napokon otvori kut.',
          'Richtig wenn Hilfe die Ecke endlich öffnet.',
        ),
      ),
      ans(
        'risky',
        L(
          'Force the corner finish now to create a rebound chance',
          'Forsiraj završetak iz kuta sada radi šanse za odbijenu',
          'Eckenabschluss jetzt erzwingen für eine Abprallerchance',
        ),
        L(
          'High-cost shot while a player down.',
          'Skup šut dok ste igrač manje.',
          'Teurer Wurf in Unterzahl.',
        ),
      ),
      ans(
        'poor',
        L(
          'Enter early into the crowded middle to chase a foul',
          'Rano uđi u gužvu u sredini da iznuješ prekršaj',
          'Früh in die gedrängte Mitte gehen um ein Foul zu holen',
        ),
        L(
          'Gives away the only safe wide release.',
          'Predaje jedinu sigurnu široku opciju.',
          'Verschenkt die einzige sichere breite Ablage.',
        ),
      ),
    ],
    explanation: L(
      'Player down: keep width as the safe release. Do not force the corner into a home wing defender. Ask only if he helps inside and opens the foot.',
      'Igrač manje: čuvaj širinu kao sigurnu opciju. Ne forsiraj kut u braniča koji čuva dom. Traži loptu samo ako pomogne unutra i otvori nogu.',
      'Unterzahl: Breite als sichere Ablage. Keine Ecke in den heimatgebundenen Außenverteidiger erzwingen. Ball nur fordern wenn er innen hilft.',
    ),
    whyCorrectOverSecondBest: L(
      'A is the job for this covered 5v6 picture; B waits for a help cue that is not present yet.',
      'A je posao za ovu zatvorenu sliku 5 na 6; B čeka signal pomoći kojeg još nema.',
      'A ist der Job für dieses verstellte 5v6; B wartet auf ein Hilfe-Signal das noch fehlt.',
    ),
  },

  {
    id: 'scn_bank_912',
    oldTeachingObjective: 'Template free finish in 7v6',
    newTeachingObjective: '7v6 with second pivot binding middle: finish when wing defender steps inside and lane opens',
    familyKey: 'rw_7v6_extra_attacker_space',
    title: L(
      'Right Wing — 7v6: Use the Extra Space When the Wing Defender Steps In',
      'Desno krilo — 7 na 6: iskoristi prostor kad krilni branič uđe unutra',
      'Rechtsaußen — 7v6: Extra-Raum nutzen wenn der Außenverteidiger innen geht',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 40,
    score: '20:19',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'numerical', 'finishing'],
    perception: true,
    handedness: 'none',
    numerical: '7v6',
    gameState: 'empty_own_risk',
    primaryTacticalCue:
      'Second pivot binds half/centre; wing defender steps inside — take off immediately while lane is open',
    situation: L(
      'You lead 20:19 at 40\' attacking 7v6 with your goalkeeper out as the seventh attacker. The second pivot binds the half defender and the centre defender. The right back pulls your wing defender one clear step inside. You receive alone near the sideline with a free take-off foot toward the middle. Delaying lets him recover before the release.',
      'Vodite 20:19 u 40. minuti u napadu 7 na 6, vratar je vani kao sedmi napadač. Drugi pivot veže polubranitelja i središnjeg braniča. Desni vanjski povlači krilnog braniča jedan čist korak unutra. Primaš sam uz aut-liniju s slobodnom odraznom nogom prema sredini. Odgađanje mu daje povratak prije ispuštanja.',
      'Ihr führt 20:19 in Minute 40 im 7v6-Angriff, Torwart draußen als siebter Angreifer. Der zweite Kreis bindet Halben und Mitte. Der rechte Rückraum zieht deinen Außenverteidiger einen klaren Schritt nach innen. Du fängst allein an der Seitenlinie mit freiem Absprungfuß zur Mitte. Verzögern lässt ihn vor der Abgabe zurückkommen.',
    ),
    question: L(
      'In this 7v6, when do you use the extra space on the wing?',
      'U ovom 7 na 6, kada koristiš dodatni prostor na krilu?',
      'Wann nutzt du in diesem 7v6 den Extra-Raum auf dem Flügel?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Take off toward the middle now while the wing defender is still that step inside',
          'Odraz prema sredini sada dok je krilni branič još taj korak unutra',
          'Jetzt zur Mitte abspringen solange der Außenverteidiger noch diesen Schritt innen ist',
        ),
        L(
          'Correct — the open take-off foot is the cue, not the 7v6 label alone.',
          'Točno — signal je otvorena odrazna noga, ne sama oznaka 7 na 6.',
          'Richtig — Signal ist der freie Absprungfuß, nicht nur die 7v6-Marke.',
        ),
      ),
      ans(
        'good',
        L(
          'Short return if he recovers onto your take-off foot before you control the catch',
          'Kratka povratna ako se vrati na odraznu nogu prije nego kontroliraš prijem',
          'Kurzer Rückpass wenn er vor der Fangkontrolle auf deinen Absprungfuß zurückkommt',
        ),
        L(
          'Correct if the window closes on the catch.',
          'Točno ako se prilika zatvori na prijema.',
          'Richtig wenn das Fenster beim Fang zugeht.',
        ),
      ),
      ans(
        'risky',
        L(
          'Hold the ball to run down the clock because you lead',
          'Drži loptu da spustiš sat jer vodite',
          'Ball halten um die Uhr herunterzuspielen weil ihr führt',
        ),
        L(
          'With your own goal empty, delayed decisions are expensive.',
          'S praznim vlastitim golom skupe su odgođene odluke.',
          'Mit eigenem leerem Tor sind verzögerte Entscheidungen teuer.',
        ),
      ),
      ans(
        'poor',
        L(
          'Pass across the face of goal looking for a spectacular finish',
          'Dodaj preko lica gola tražeći spektakularan završetak',
          'Vor dem Tor vorbeipassen für einen spektakulären Abschluss',
        ),
        L(
          'Unnecessary risk with an empty own goal behind you.',
          'Nepotrebni rizik s praznim vlastitim golom iza.',
          'Unnötiges Risiko mit leerem eigenem Tor hinter euch.',
        ),
      ),
    ],
    explanation: L(
      '7v6 helps only when the wing defender’s inside step opens your take-off. Finish that window now; return if he recovers onto the foot. Empty own goal makes delay costly.',
      '7 na 6 pomaže samo kad unutarnji korak krilnog braniča otvara odraz. Iskoristi taj trenutak sada; vrati ako se vrati na nogu. Prazan vlastiti gol čini odgodu skupom.',
      '7v6 hilft nur wenn der Innenschritt den Absprung öffnet. Fenster jetzt nutzen; zurück wenn er auf den Fuß kommt. Leeres eigenes Tor macht Verzögerung teuer.',
    ),
    whyCorrectOverSecondBest: L(
      'A uses the open take-off that exists now; B is the escape if recovery beats the catch.',
      'A koristi otvoreni odraz koji postoji sada; B je izlaz ako povratak pobijedi prijem.',
      'A nutzt den jetzt offenen Absprung; B ist der Ausweg wenn die Rückkehr den Fang schlägt.',
    ),
  },

  {
    id: 'scn_bank_913',
    oldTeachingObjective: 'Stock covered recycle in 7v6',
    newTeachingObjective: '7v6 but wing still covered: short return — extra attacker elsewhere is not your finish',
    familyKey: 'rw_7v6_no_force_covered',
    title: L(
      'Right Wing — 7v6 Covered on the Wing: Do Not Force',
      'Desno krilo — 7 na 6 zatvoreno na krilu: ne forsiraj',
      'Rechtsaußen — 7v6 auf dem Flügel zu: nicht erzwingen',
    ),
    difficulty: 'Expert',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 42,
    score: '21:20',
    defensiveSystem: '6-0',
    skillTags: ['decision-making', 'numerical', 'risk-management'],
    perception: true,
    handedness: 'none',
    numerical: '7v6',
    gameState: 'empty_own_risk',
    primaryTacticalCue:
      'Two pivots inside but wing defender stays on you closing middle take-off — short return',
    situation: L(
      'You lead 21:20 at 42\' attacking 7v6 with the goalkeeper out. Even with two pivots on six metres, your wing defender stays with you and closes the take-off toward the middle with shoulder and raised outside hand. The short return to the right back is open. Forcing the wing shot with your own goal empty is the expensive mistake.',
      'Vodite 21:20 u 42. minuti u napadu 7 na 6, vratar je vani. Čak i s dva pivota na šest metara, krilni branič ostaje uz tebe i zatvara odraz prema sredini ramenom i podignutom vanjskom rukom. Kratka povratna desnom vanjskom je otvorena. Forsiranje krilnog šuta s praznim vlastitim golom skupa je greška.',
      'Ihr führt 21:20 in Minute 42 im 7v6, Torwart draußen. Selbst mit zwei Kreisen auf der Sechs bleibt dein Außenverteidiger bei dir und schließt den Absprung zur Mitte mit Schulter und hoher äußerer Hand. Der kurze Rückpass zum rechten Rückraum ist offen. Einen Flügelwurf mit leerem eigenem Tor zu erzwingen ist der teure Fehler.',
    ),
    question: L(
      '7v6 but the wing is covered — what do you do?',
      '7 na 6, ali krilo je zatvoreno — što radiš?',
      '7v6 aber der Flügel ist zu — was tust du?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Secure the catch and play the short return — let the extra attacker work elsewhere',
          'Osiguraj prijem i odigraj kratku povratnu — nek dodatni napadač radi drugdje',
          'Fang sichern und kurz zurückspielen — den Extraangreifer woanders arbeiten lassen',
        ),
        L(
          'Correct — covered wing plus empty own goal means recycle.',
          'Točno — zatvoreno krilo plus prazan vlastiti gol znači povrat lopte.',
          'Richtig — verstellter Flügel plus leeres eigenes Tor heißt zurückspielen.',
        ),
      ),
      ans(
        'good',
        L(
          'Finish only if he turns fully inside onto a pivot and leaves your take-off foot free before you jump',
          'Završi samo ako se potpuno okrene unutra na pivot i ostavi odraznu nogu slobodnom prije skoka',
          'Nur abschließen wenn er voll innen auf einen Kreis dreht und deinen Absprungfuß vor dem Sprung freilässt',
        ),
        L(
          'Correct if the cover actually leaves.',
          'Točno ako pokriće stvarno ode.',
          'Richtig wenn die Deckung wirklich weggeht.',
        ),
      ),
      ans(
        'risky',
        L(
          'Force the far-post shot because empty-goal games need quick finishes',
          'Forsiraj šut na dalju stativu jer igre s praznim golom traže brze završetke',
          'Fernpfosten erzwingen weil Spiele mit leerem Tor schnelle Abschlüsse brauchen',
        ),
        L(
          'Confuses opponent empty goal with your empty goal risk.',
          'Miješa prazan protivnički gol s rizikom vlastitog praznog gola.',
          'Verwechselt leeres Gegentor mit dem Risiko des eigenen leeren Tors.',
        ),
      ),
      ans(
        'poor',
        L(
          'Lob over the wing defender to create chaos',
          'Lobaj preko krilnog braniča da stvoriš kaos',
          'Über den Außenverteidiger lobben um Chaos zu erzeugen',
        ),
        L(
          'Wrong tool and huge counter risk.',
          'Krivi alat i ogroman rizik kontre.',
          'Falsches Mittel und riesiges Konterrisiko.',
        ),
      ),
    ],
    explanation: L(
      'Extra attacker elsewhere does not open your covered take-off. Short return. Finish only if he turns inside and frees the foot. Own empty goal raises the cost of a forced miss.',
      'Dodatni napadač drugdje ne otvara tvoj zatvoreni odraz. Kratka povratna. Završi samo ako se okrene unutra i oslobodi nogu. Prazan vlastiti gol poskupljuje forsirani promašaj.',
      'Extraangreifer woanders öffnet deinen verstellten Absprung nicht. Kurzer Rückpass. Abschluss nur wenn er innen dreht. Leeres eigenes Tor macht den erzwungenen Fehlwurf teurer.',
    ),
    whyCorrectOverSecondBest: L(
      'A matches the covered wing now; B needs a turn that has not happened.',
      'A odgovara zatvorenom krilu sada; B treba okret koji se nije dogodio.',
      'A passt zum verstellten Flügel jetzt; B braucht eine Drehung die nicht da ist.',
    ),
  },

  {
    id: 'scn_bank_914',
    oldTeachingObjective: 'Template finish with own goal empty',
    newTeachingObjective: 'Own goal empty but catch/take-off clean and defender late — finish now, do not over-safe',
    familyKey: 'rw_empty_own_goal_clean_finish',
    title: L(
      'Right Wing — Empty Own Goal: Clean Catch, Finish Now',
      'Desno krilo — prazan vlastiti gol: čist prijem, završi sada',
      'Rechtsaußen — eigenes Tor leer: sauberer Fang, jetzt abschließen',
    ),
    difficulty: 'Expert',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 44,
    score: '22:21',
    defensiveSystem: '6-0',
    skillTags: ['decision-making', 'risk-management', 'finishing'],
    perception: true,
    handedness: 'none',
    numerical: '7v6',
    gameState: 'empty_own_goal',
    primaryTacticalCue:
      'Own GK out, clean catch, wing defender still a full stride late — finish immediately',
    situation: L(
      'You lead 22:21 at 44\'. Your goalkeeper is out as the seventh attacker — own goal empty. The right back pulls the wing defender inside and the ball arrives clean in front of your body in the right corner. You control it in one touch with a free take-off foot toward the middle. The wing defender is still a full stride from your jumping foot. Waiting for a safer picture invites his recovery and a counter into your empty goal.',
      'Vodite 22:21 u 44. minuti. Vratar je vani kao sedmi napadač — vlastiti gol je prazan. Desni vanjski povlači krilnog braniča unutra i lopta stiže čisto ispred tijela u desni kut. Kontroliraš je iz jednog dodira sa slobodnom odraznom nogom prema sredini. Krilni branič još je cijeli korak od tvoje odrazne noge. Čekanje “sigurnije” slike poziva njegov povratak i kontru u prazan gol.',
      'Ihr führt 22:21 in Minute 44. Torwart draußen als siebter Angreifer — eigenes Tor leer. Der rechte Rückraum zieht den Außenverteidiger nach innen und der Ball kommt sauber vor dem Körper in die rechte Ecke. Du kontrollierst ihn in einem Kontakt mit freiem Absprungfuß zur Mitte. Der Außenverteidiger ist noch einen vollen Schritt von deinem Absprungfuß. Auf ein „sichereres“ Bild zu warten holt seine Rückkehr und den Konter ins leere Tor.',
    ),
    question: L(
      'Own goal empty, but the catch and take-off are clean — what is right?',
      'Vlastiti gol prazan, ali prijem i odraz su čisti — što je ispravno?',
      'Eigenes Tor leer, aber Fang und Absprung sind sauber — was ist richtig?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Take off immediately and finish before the defender completes the stride to your foot',
          'Odraz odmah i završi prije nego branič dovrši korak do tvoje noge',
          'Sofort abspringen und abschließen bevor der Verteidiger den Schritt zu deinem Fuß vollendet',
        ),
        L(
          'Correct — clean window plus empty own goal means finish now.',
          'Točno — čista prilika plus prazan vlastiti gol znači završi sada.',
          'Richtig — sauberes Fenster plus leeres eigenes Tor heißt jetzt abschließen.',
        ),
      ),
      ans(
        'good',
        L(
          'Short return only if the first touch fails and you need a second to control the ball',
          'Kratka povratna samo ako prvi dodir ne uspije i treba ti drugi za kontrolu',
          'Kurzer Rückpass nur wenn der erste Kontakt scheitert und du einen zweiten zur Kontrolle brauchst',
        ),
        L(
          'That is the messy-catch rule from the sister scenario — not this picture.',
          'To je pravilo nezgodnog prijema iz sestrinskog scenarija — ne ova slika.',
          'Das ist die Regel des unsauberen Fangs aus dem Schwester-Szenario — nicht dieses Bild.',
        ),
      ),
      ans(
        'risky',
        L(
          'Pass across looking for a higher-percentage teammate',
          'Dodaj preko tražeći suigrača s većim postotkom',
          'Querpassen und einen Mitspieler mit höherer Quote suchen',
        ),
        L(
          'Extra pass with empty own goal after a clean wing window.',
          'Dodatno dodavanje s praznim vlastitim golom nakon čistog krilne prilike.',
          'Extra-Pass mit leerem eigenem Tor nach sauberem Flügelfenster.',
        ),
      ),
      ans(
        'poor',
        L(
          'Hold the ball in the corner to run clock because you lead by one',
          'Drži loptu u kutu da spustiš sat jer vodite jedan gol',
          'Ball in der Ecke halten um die Uhr zu spielen weil ihr mit einem führt',
        ),
        L(
          'Invites the recovery and the counter into the empty goal.',
          'Poziva povratak i kontru u prazan gol.',
          'Holt Rückkehr und Konter ins leere Tor.',
        ),
      ),
    ],
    explanation: L(
      'Opposite of the messy empty-own-goal return: clean catch, free foot, defender a stride late — finish now. Extra passes and clock-holding are expensive with your goal empty.',
      'Suprotno od povrata kod nezgodnog prijema s praznim golom: čist prijem, slobodna noga, branič korak kasni — završi sada. Dodatna dodavanja i držanje sata skupi su s praznim golom.',
      'Gegenteil der Rückpass-Regel bei unsauberem Fang: sauberer Fang, freier Fuß, Verteidiger einen Schritt spät — jetzt abschließen. Extra-Pässe und Uhrspielen sind mit leerem Tor teuer.',
    ),
    whyCorrectOverSecondBest: L(
      'A uses the clean window that exists; B is for a failed first touch, which did not happen.',
      'A koristi čistu priliku koja postoji; B je za neuspješan prvi dodir, kojeg nije bilo.',
      'A nutzt das vorhandene saubere Fenster; B gilt bei gescheitertem Erstkontakt, den es nicht gab.',
    ),
  },

  {
    id: 'scn_bank_915',
    oldTeachingObjective: 'Broken opp-empty finish inventing GK side without GK cues',
    newTeachingObjective: 'Opponent goal empty + free wing receive — finish immediately into empty net, no fake GK read',
    familyKey: 'rw_opp_empty_goal_quick_finish',
    title: L(
      'Right Wing — Opponent Empty Goal: Finish Immediately',
      'Desno krilo — prazan protivnički gol: završi odmah',
      'Rechtsaußen — leeres Gegentor: sofort abschließen',
    ),
    difficulty: 'Beginner',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Transition',
    minute: 46,
    score: '23:22',
    defensiveSystem: null,
    skillTags: ['decision-making', 'transition', 'finishing'],
    perception: false,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'opp_empty_goal',
    primaryTacticalCue:
      'Opponent GK late returning from bench — empty net — finish immediately, no invented post choice',
    situation: L(
      'You trail 23:22 at 46\'. Their goalkeeper is late returning from the bench after a substitution and their goal is empty. After the ball win you run the right lane and receive a clean pass alone near six metres. No defender is within two metres of your take-off. There is no goalkeeper to read — only an empty net and a short window before someone recovers.',
      'Gubite 23:22 u 46. minuti. Njihov vratar kasni s povratkom s klupe nakon izmjene i njihov gol je prazan. Nakon osvajanja lopte trčiš desnu stranu i primaš čistu loptu sam blizu šest metara. Nijedan branič nije unutar dva metra od tvog odraza. Nema vratara za čitanje — samo prazna mreža i kratka prilika prije nego netko stigne u povratak.',
      'Ihr liegt 23:22 in Minute 46 zurück. Ihr Torwart kommt nach einem Wechsel zu spät von der Bank zurück und ihr Tor ist leer. Nach dem Ballgewinn läufst du die rechte Gasse und fängst einen sauberen Pass allein nahe der Sechs. Kein Verteidiger innerhalb von zwei Metern. Kein Torwart zum Lesen — nur leeres Netz und ein kurzes Fenster bevor jemand zurück ist.',
    ),
    question: L(
      'Their goal is empty and you are free on the wing — what do you do?',
      'Njihov gol je prazan i slobodan si na krilu — što radiš?',
      'Ihr Tor ist leer und du bist frei auf dem Flügel — was tust du?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Take off immediately and finish into the empty net before any recovery arrives',
          'Odraz odmah i završi u praznu mrežu prije nego stigne bilo kakav povratak',
          'Sofort abspringen und ins leere Netz abschließen bevor irgendeine Rückkehr kommt',
        ),
        L(
          'Correct — empty net, free catch: finish now.',
          'Točno — prazna mreža, slobodan prijem: završi sada.',
          'Richtig — leeres Netz, freier Fang: jetzt abschließen.',
        ),
      ),
      ans(
        'good',
        L(
          'Take one gather step only if needed to put the ball in front of your take-off foot, then release',
          'Uzmi samo jedan korak za smještaj lopte pred odraznu nogu ako treba, pa ispusti',
          'Nur einen Sammelschritt wenn nötig um den Ball vor den Absprungfuß zu legen, dann abgeben',
        ),
        L(
          'Acceptable only to settle a slightly awkward catch — not to admire the empty goal.',
          'Prihvatljivo samo da središ malo nezgodan prijem — ne da gledaš prazan gol.',
          'Nur akzeptabel um einen leicht unsauberen Fang zu legen — nicht um das leere Tor zu betrachten.',
        ),
      ),
      ans(
        'risky',
        L(
          'Pass back to create a higher-percentage set shot',
          'Vrati loptu da stvoriš šut s većim postotkom iz pozicije',
          'Zurückpassen für einen höherprozentigen Positionswurf',
        ),
        L(
          'Gives them time to recover into an empty goal chance you already have.',
          'Daje im vrijeme za povratak u šansu s praznim golom koju već imaš.',
          'Gibt Zeit zur Rückkehr in eine leere-Tor-Chance die du schon hast.',
        ),
      ),
      ans(
        'poor',
        L(
          'Aim specifically far post because empty-goal finishes should go far',
          'Ciljaj baš dalju stativu jer se u prazan gol šutira daleko',
          'Bewusst Fernpfosten wählen weil leere Tore fern abgeschlossen werden sollen',
        ),
        L(
          'There is no goalkeeper and no post rule — just put it in the net.',
          'Nema vratara i nema pravila stative — samo ubaci u mrežu.',
          'Kein Torwart und keine Pfostenregel — einfach ins Netz.',
        ),
      ),
    ],
    explanation: L(
      'Opponent goal empty, free receive, no contest: finish immediately into the net. Do not invent a far/near post read without a goalkeeper.',
      'Protivnički gol prazan, slobodan prijem, bez kontakta: završi odmah u mrežu. Ne izmišljaj čitanje dalje/bliže stative bez vratara.',
      'Gegentor leer, freier Fang, kein Kontakt: sofort ins Netz. Keine Fern-/Nahpfosten-Lesung ohne Torwart erfinden.',
    ),
    whyCorrectOverSecondBest: L(
      'A finishes the empty net now; B only adds a gather step if the catch needs it.',
      'A završava praznu mrežu sada; B dodaje korak smještaja samo ako prijem to traži.',
      'A schließt das leere Netz jetzt ab; B fügt nur einen Sammelschritt hinzu wenn der Fang es braucht.',
    ),
  },

  {
    id: 'scn_bank_917',
    oldTeachingObjective: 'Template finish after RB draws two',
    newTeachingObjective: 'After RB draws two in 6:0, free wing receive with open take-off — finish now',
    familyKey: 'rw_after_rb_two_finish',
    title: L(
      'Right Wing — After the Right Back Draws Two: Finish',
      'Desno krilo — nakon što desni vanjski povuče dvojicu: završi',
      'Rechtsaußen — nachdem der rechte Rückraum zwei zieht: abschließen',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 50,
    score: '25:25',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'timing', 'finishing'],
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    primaryTacticalCue:
      'RB pulls half + wing defender; you stay wide and receive free with open take-off — finish',
    situation: L(
      'Tied 25:25 at 50\' against 6:0. The right back drives between the half defender and the wing defender and pulls both onto himself. You stay wide on the sideline and receive the out-pass alone. Your take-off foot toward the middle is free and the nearest recovering body is still more than two metres away. This is the second action the drive created — use it.',
      'Neriješeno je 25:25 u 50. minuti protiv 6:0. Desni vanjski prodire između polubranitelja i krilnog braniča i na sebe povlači obojicu. Ostaješ široko uz aut-liniju i primaš vanjsku loptu sam. Odrazna noga prema sredini je slobodna, a najbliže tijelo u povratku još je više od dva metra daleko. Ovo je druga akcija koju je prodor stvorio — iskoristi je.',
      'Unentschieden 25:25 in Minute 50 gegen 6:0. Der rechte Rückraum geht zwischen Halbem und Außenverteidiger durch und zieht beide auf sich. Du bleibst breit an der Seitenlinie und fängst den Herauspass allein. Absprungfuß zur Mitte frei, nächster zurückkehrender Körper noch mehr als zwei Meter weg. Das ist die zweite Aktion des Durchbruchs — nutze sie.',
    ),
    question: L(
      'The right back has drawn two — why finish now?',
      'Desni vanjski je povukao dvojicu — zašto završavaš sada?',
      'Der rechte Rückraum hat zwei gezogen — warum jetzt abschließen?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Take off toward the middle immediately — you are free because both defenders are still on the right back',
          'Odraz prema sredini odmah — slobodan si jer su oba braniča još na desnom vanjskom',
          'Sofort zur Mitte abspringen — du bist frei weil beide Verteidiger noch am rechten Rückraum sind',
        ),
        L(
          'Correct — the two-man bind is the reason the wing is free.',
          'Točno — vezivanje dvojice razlog je što je krilo slobodno.',
          'Richtig — das Binden von zwei ist der Grund warum der Flügel frei ist.',
        ),
      ),
      ans(
        'good',
        L(
          'Short return if a third defender jumps your catch before you can take off',
          'Kratka povratna ako treći branič skoči na tvoj prijem prije odraza',
          'Kurzer Rückpass wenn ein dritter Verteidiger deinen Fang vor dem Absprung attackiert',
        ),
        L(
          'Correct if the free picture disappears on the catch.',
          'Točno ako slobodna slika nestane na prijema.',
          'Richtig wenn das freie Bild beim Fang verschwindet.',
        ),
      ),
      ans(
        'risky',
        L(
          'Hold the ball to let the right back clear out of the traffic',
          'Drži loptu da desni vanjski izađe iz gužve',
          'Ball halten damit der rechte Rückraum aus dem Verkehr kommt',
        ),
        L(
          'Gives the two defenders time to recover onto you.',
          'Daje dvojici braniča vrijeme za povratak na tebe.',
          'Gibt den zwei Verteidigern Zeit zur Rückkehr auf dich.',
        ),
      ),
      ans(
        'poor',
        L(
          'Enter behind the traffic the right back just created',
          'Uđi iza gužve koju je desni vanjski upravo stvorio',
          'Hinter den Verkehr gehen den der rechte Rückraum gerade erzeugt hat',
        ),
        L(
          'Runs into the bodies he just occupied.',
          'Trčiš u tijela koja je upravo zaposlio.',
          'Läuft in die Körper die er gerade gebunden hat.',
        ),
      ),
    ],
    explanation: L(
      'When the right back draws two and you receive free with an open take-off, finish that second action. Delay invites the recovery.',
      'Kad desni vanjski povuče dvojicu i primaš sam s otvorenim odrazom, završi tu drugu akciju. Odgađanje poziva povratak.',
      'Wenn der rechte Rückraum zwei zieht und du frei mit offenem Absprung fängst, schließe diese zweite Aktion ab. Verzögern holt die Rückkehr.',
    ),
    whyCorrectOverSecondBest: L(
      'A uses the free wing created by the two-man bind; B is only for a third defender jumping the catch.',
      'A koristi slobodno krilo koje je stvorilo vezivanje dvojice; B je samo ako treći branič skoči na prijem.',
      'A nutzt den freien Flügel durch das Binden von zwei; B nur wenn ein Dritter den Fang attackiert.',
    ),
  },

  {
    id: 'scn_bank_918',
    oldTeachingObjective: 'Template short return after RB drew two',
    newTeachingObjective: 'After RB drew two you are jumped on the catch — short return, not a forced finish',
    familyKey: 'rw_after_rb_two_short_return',
    title: L(
      'Right Wing — Jumped After the Right Back Drew Two: Short Return',
      'Desno krilo — skočili te nakon što je desni vanjski povukao dvojicu: kratka povratna',
      'Rechtsaußen — nach Zwei-Zug angesprungen: kurzer Rückpass',
    ),
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 52,
    score: '26:25',
    defensiveSystem: '6-0',
    skillTags: ['decision-making', 'timing', 'risk-management'],
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    primaryTacticalCue:
      'RB drew two but wing defender recovers onto your catch with hand up — short return',
    situation: L(
      'You lead 26:25 at 52\'. The right back has drawn two defenders, but after the out-pass the wing defender recovers to the corner and meets your catch with a raised outside hand between you and the take-off toward the middle. The right back has already cleared a metre and is free for the short return. The two-man bind created the pass; it did not guarantee the finish.',
      'Vodite 26:25 u 52. minuti. Desni vanjski je povukao dva braniča, ali nakon vanjske lopte krilni branič stiže u kut i dočekuje tvoj prijem s podignutom vanjskom rukom između tebe i odraza prema sredini. Desni vanjski već je izašao metar i slobodan je za kratku povratnu. Vezivanje dvojice stvorilo je dodavanje; nije garantiralo završetak.',
      'Ihr führt 26:25 in Minute 52. Der rechte Rückraum hat zwei gezogen, aber nach dem Herauspass kommt der Außenverteidiger in die Ecke und stellt deinen Fang mit hoher äußerer Hand zwischen dir und dem Absprung zur Mitte. Der rechte Rückraum ist schon einen Meter frei für den kurzen Rückpass. Das Binden von zwei schuf den Pass; es garantierte nicht den Abschluss.',
    ),
    question: L(
      'You are jumped as you receive after the right back drew two — what then?',
      'Skočili su te na prijema nakon što je desni vanjski povukao dvojicu — što onda?',
      'Du wirst beim Fang angesprungen nachdem der rechte Rückraum zwei gezogen hat — was dann?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Secure the catch and play the short return to the free right back',
          'Osiguraj prijem i odigraj kratku povratnu slobodnom desnom vanjskom',
          'Fang sichern und kurzen Rückpass zum freien rechten Rückraum spielen',
        ),
        L(
          'Correct — the finish window closed on the catch.',
          'Točno — prilika za završetak zatvorila se na prijema.',
          'Richtig — das Abschlussfenster ist beim Fang zu.',
        ),
      ),
      ans(
        'good',
        L(
          'Finish only if his hand is late and your first touch already puts the ball in front of a free take-off foot',
          'Završi samo ako mu ruka kasni i prvi dodir već stavlja loptu pred slobodnu odraznu nogu',
          'Nur abschließen wenn seine Hand spät ist und der erste Kontakt den Ball schon vor einen freien Absprungfuß legt',
        ),
        L(
          'Becomes correct if the contest is late and the foot is free.',
          'Postaje točno ako je kontakt kasno i noga je slobodna.',
          'Wird richtig wenn der Kontakt spät und der Fuß frei ist.',
        ),
      ),

      ans(
        'risky',
        L(
          'Force through the raised hand because he “should” still be on the right back',
          'Probij kroz podignutu ruku jer “treba” još biti na desnom vanjskom',
          'Durch die hohe Hand erzwingen weil er „noch“ am rechten Rückraum sein sollte',
        ),
        L(
          'Play the picture you have, not the picture from a second ago.',
          'Igraj sliku koju imaš, ne sliku od prije sekunde.',
          'Spiele das Bild das du hast, nicht das von vor einer Sekunde.',
        ),
      ),
      ans(
        'poor',
        L(
          'Lob the recovering wing defender to “use the two-man bind”',
          'Lobaj krilnog braniča u povratku da “iskoristiš vezivanje dvojice”',
          'Den zurückkommenden Außenverteidiger lobben um „das Binden von zwei zu nutzen“',
        ),
        L(
          'Wrong tool for a contested catch.',
          'Krivi alat za osporeni prijem.',
          'Falsches Mittel für einen umkämpften Fang.',
        ),
      ),
    ],
    explanation: L(
      'The right back drew two, but the wing defender recovered onto your catch. Short return. Finish only if the hand is late and the take-off foot is free.',
      'Desni vanjski je povukao dvojicu, ali krilni branič se vratio na tvoj prijem. Kratka povratna. Završi samo ako ruka kasni i odrazna noga je slobodna.',
      'Der rechte Rückraum zog zwei, aber der Außenverteidiger kam auf deinen Fang zurück. Kurzer Rückpass. Abschluss nur wenn die Hand spät und der Absprungfuß frei ist.',
    ),
    whyCorrectOverSecondBest: L(
      'A matches the contested catch now; B needs a late hand and free foot that are not present.',
      'A odgovara osporenom prijema sada; B treba kasnu ruku i slobodnu nogu kojih nema.',
      'A passt zum umkämpften Fang jetzt; B braucht späte Hand und freien Fuß die fehlen.',
    ),
  },

  {
    id: 'scn_bank_919',
    oldTeachingObjective: 'Template finish after rotation with stock available-side answer',
    newTeachingObjective: 'After defensive rotation, wing defender still one step inside — finish while lane open',
    familyKey: 'rw_rotation_finish_window',
    title: L(
      'Right Wing — Rotation Leaves the Corner Open: Finish',
      'Desno krilo — rotacija ostavlja kut otvorenim: završi',
      'Rechtsaußen — Rotation lässt die Ecke offen: abschließen',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 54,
    score: '27:26',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'timing', 'finishing'],
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    primaryTacticalCue:
      'During cross/rotation wing defender steps inside to take new man — take-off still open — finish now',
    situation: L(
      "You trail 27:26 at 54'. During the cross the right back switches with the centre back and your wing defender takes one step inside to pick up the new ball carrier. You wait wide and receive as that step still leaves your take-off foot toward the middle free. If you wait for a second look, he finishes the handover and closes the corner.",
      'Gubite 27:26 u 54. minuti. U križanju desni vanjski mijenja sa srednjim, a krilni branič uzima korak unutra da preuzme novog igrača s loptom. Čekaš široko i primaš dok taj korak još ostavlja odraznu nogu prema sredini slobodnom. Ako čekaš drugi pogled, on završava preuzimanje i zatvara kut.',
      'Ihr liegt 27:26 in Minute 54 zurück. Im Kreuz wechselt der rechte Rückraum mit der Mitte und dein Außenverteidiger geht einen Schritt innen um den neuen Ballführer zu übernehmen. Du wartest breit und fängst während dieser Schritt deinen Absprungfuß zur Mitte noch frei lässt. Wartest du auf den zweiten Blick, beendet er die Übernahme und schließt die Ecke.',
    ),
    question: L(
      'After the defensive rotation, is the wing finish still there?',
      'Nakon obrambene rotacije, je li krilni završetak još tu?',
      'Ist nach der defensiven Rotation der Flügelabschluss noch da?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Take off toward the middle now while he is still that step inside on the new man',
          'Odraz prema sredini sada dok je još taj korak unutra na novom igraču',
          'Jetzt zur Mitte abspringen solange er noch diesen Schritt innen am neuen Mann ist',
        ),
        L(
          'Correct — the unfinished handover is the open window.',
          'Točno — nedovršeno preuzimanje je otvorena prilika.',
          'Richtig — die unfertige Übernahme ist das offene Fenster.',
        ),
      ),
      ans(
        'good',
        L(
          'Return the ball only if he completes the handover and meets your take-off foot before you jump',
          'Vrati loptu samo ako dovrši preuzimanje i dočeka odraznu nogu prije skoka',
          'Ball nur zurück wenn er die Übernahme beendet und deinen Absprungfuß vor dem Sprung stellt',
        ),
        L(
          'Correct if the window closes on the catch.',
          'Točno ako se prilika zatvori na prijema.',
          'Richtig wenn das Fenster beim Fang zugeht.',
        ),
      ),
      ans(
        'risky',
        L(
          'Hold for a higher-percentage second circulation after the rotation settles',
          'Čekaj cirkulaciju s većim postotkom nakon što se rotacija smiri',
          'Auf eine höherprozentige zweite Zirkulation warten nachdem die Rotation sich setzt',
        ),
        L(
          'Lets him finish the handover onto you.',
          'Pušta ga da dovrši preuzimanje na tebe.',
          'Lässt ihn die Übernahme auf dich beenden.',
        ),
      ),
      ans(
        'poor',
        L(
          'Enter into the crossing traffic because rotation always means backdoor',
          'Uđi u gužvu križanja jer rotacija uvijek znači ulazak iza leđa',
          'In den Kreuzverkehr gehen weil Rotation immer Hinterlaufen heißt',
        ),
        L(
          'Wrong automatic rule — the open cue here is the take-off foot.',
          'Krivo automatsko pravilo — ovdje je otvoreni signal odrazna noga.',
          'Falsche Automatik — hier ist das offene Signal der Absprungfuß.',
        ),
      ),
    ],
    explanation: L(
      'Rotation leaves him one step inside on the new man: finish that window. Return only if he completes the handover onto your foot.',
      'Rotacija ga ostavlja korak unutra na novom igraču: iskoristi taj trenutak. Vrati samo ako dovrši preuzimanje na tvoju nogu.',
      'Rotation lässt ihn einen Schritt innen am neuen Mann: Fenster nutzen. Zurück nur wenn er die Übernahme auf deinen Fuß beendet.',
    ),
    whyCorrectOverSecondBest: L(
      'A uses the open take-off during the unfinished handover; B waits for a closed picture that is not here yet.',
      'A koristi otvoreni odraz tijekom nedovršenog preuzimanja; B čeka zatvorenu sliku koje još nema.',
      'A nutzt den offenen Absprung während unfertiger Übernahme; B wartet auf ein geschlossenes Bild das noch fehlt.',
    ),
  },

  {
    id: 'scn_bank_920',
    oldTeachingObjective: 'Template recycle after late rotation',
    newTeachingObjective: 'Ball late after rotation and handover already complete — short return, do not force',
    familyKey: 'rw_rotation_too_late_recycle',
    title: L(
      'Right Wing — Rotation Already Closed the Corner: Recycle',
      'Desno krilo — rotacija je već zatvorila kut: vrati loptu',
      'Rechtsaußen — Rotation hat die Ecke schon geschlossen: zurückspielen',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 56,
    score: '28:27',
    defensiveSystem: '6-0',
    skillTags: ['decision-making', 'timing', 'risk-management'],
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    primaryTacticalCue:
      'Pass arrives late after cross; wing defender already finished handover and stands on take-off — short return',
    situation: L(
      "You lead 28:27 at 56'. After the cross the ball arrives late to the right wing. The wing defender has already finished his handover and stands between you and the take-off space toward the middle, outside hand up. The right back is free after the switch for a short return. The rotation window existed a second earlier; it is gone now.",
      'Vodite 28:27 u 56. minuti. Nakon križanja lopta kasni prema desnom krilu. Krilni branič već je završio preuzimanje i stoji između tebe i prostora za odraz prema sredini, vanjska ruka gore. Desni vanjski je nakon zamjene slobodan za kratku povratnu. Prozor rotacije postojao je sekundu ranije; sada ga nema.',
      'Ihr führt 28:27 in Minute 56. Nach dem Kreuz kommt der Ball spät auf Rechtsaußen. Der Außenverteidiger hat die Übernahme schon beendet und steht zwischen dir und dem Absprungraum zur Mitte, äußere Hand hoch. Der rechte Rückraum ist nach dem Wechsel frei für den kurzen Rückpass. Das Rotationsfenster gab es eine Sekunde früher; jetzt ist es weg.',
    ),
    question: L(
      'The rotation has already closed your corner — what is first?',
      'Rotacija je već zatvorila tvoj kut — što je prvo?',
      'Die Rotation hat deine Ecke schon geschlossen — was zuerst?',
    ),
    answers: [
      ans(
        'optimal',
        L(
          'Secure the catch and play the short return to the free right back',
          'Osiguraj prijem i odigraj kratku povratnu slobodnom desnom vanjskom',
          'Fang sichern und kurzen Rückpass zum freien rechten Rückraum spielen',
        ),
        L(
          'Correct — play the closed picture, not the earlier open one.',
          'Točno — igraj zatvorenu sliku, ne raniju otvorenu.',
          'Richtig — spiele das geschlossene Bild, nicht das frühere offene.',
        ),
      ),
      ans(
        'good',
        L(
          'Hold width for the next circulation if the short return is temporarily covered',
          'Drži širinu za sljedeću cirkulaciju ako je kratka povratna trenutno zatvorena',
          'Breite für die nächste Zirkulation halten wenn der kurze Rückpass kurz verstellt ist',
        ),
        L(
          'Useful if the free back is temporarily blocked.',
          'Korisno ako je slobodni vanjski trenutno blokiran.',
          'Nützlich wenn der freie Rückraum kurz blockiert ist.',
        ),
      ),
      ans(
        'risky',
        L(
          'Force the take-off anyway because rotation “should” have left you free',
          'Forsiraj odraz ionako jer rotacija “treba” ostaviti te slobodnim',
          'Absprung trotzdem erzwingen weil Rotation dich „frei“ gelassen haben sollte',
        ),
        L(
          'Late ball plus completed handover is not a finish.',
          'Kasna lopta plus dovršeno preuzimanje nije završetak.',
          'Später Ball plus fertige Übernahme ist kein Abschluss.',
        ),
      ),
      ans(
        'poor',
        L(
          'Enter into the post-rotation traffic at six metres',
          'Uđi u gužvu nakon rotacije na šest metara',
          'In den Verkehr nach der Rotation auf der Sechs gehen',
        ),
        L(
          'Adds bodies where the lane is already gone.',
          'Dodaje tijela gdje put već nestaje.',
          'Mehr Körper wo die Gasse schon weg ist.',
        ),
      ),
    ],
    explanation: L(
      'Late ball after rotation with handover complete: short return. Do not force a finish from a window that already closed.',
      'Kasna lopta nakon rotacije s dovršenim preuzimanjem: kratka povratna. Ne forsiraj završetak iz prilike koja se već zatvorila.',
      'Später Ball nach Rotation mit fertiger Übernahme: kurzer Rückpass. Keinen Abschluss aus einem schon geschlossenen Fenster erzwingen.',
    ),
    whyCorrectOverSecondBest: L(
      'A matches the closed corner and free short option; B is only if that short option is covered.',
      'A odgovara zatvorenom kutu i slobodnoj kratkoj opciji; B je samo ako je ta kratka opcija zatvorena.',
      'A passt zur geschlossenen Ecke und freien Kurzoption; B nur wenn diese Kurzoption verstellt ist.',
    ),
  },
];
