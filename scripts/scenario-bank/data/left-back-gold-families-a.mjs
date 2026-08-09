/**
 * Left Back gold-standard families (batch A) — 17 distinct scenarios.
 * Does NOT overlap the existing gold 12 (gap 6:0, block+pivot, 5:1 open side,
 * pivot feed, first recoverer, crossing late switch, 6v5 force rotator,
 * late trail possession, GK pattern, 3:2:1 behind first line, 7v6 second pivot).
 */

/** @typedef {{ en: string, hr: string, de: string }} L10n */
/** @typedef {'optimal'|'good'|'risky'|'poor'} Quality */
/** @typedef {{ quality: Quality, text: L10n, feedback: L10n }} Answer */

/**
 * @typedef {object} GoldFamily
 * @property {string} familyKey
 * @property {L10n} title
 * @property {'Beginner'|'Intermediate'|'Advanced'|'Expert'} difficulty
 * @property {'Low'|'Moderate'|'High'|'Critical'} pressureLevel
 * @property {'Attack'|'Defence'} attackOrDefence
 * @property {'Open Play'|'Final Minutes'} matchPhase
 * @property {number} minute
 * @property {string} score
 * @property {'6-0'|'5-1'|'4-2'|'3-2-1'|'Man-to-Man'|'Mixed'|undefined} defensiveSystem
 * @property {string[]} skillTags
 * @property {boolean} perception
 * @property {'6v6'|'6v5'|'5v6'|'7v6'|'transition'|null} numerical
 * @property {'none'|'lead_late'|'trail_late'|'tie_final'|'control_lead'|'tempo_trail'|'exclusion_late'|'empty_goal_opp'|'empty_goal_own'|'passive'} gameState
 * @property {L10n} situation
 * @property {L10n} question
 * @property {Answer[]} answers
 * @property {L10n} explanation
 * @property {{ singleBestOk: true, cueSpecific: true, gameStateExplicit: boolean, rubricBias: number }} human
 */

/** @type {GoldFamily[]} */
export const LEFT_BACK_GOLD_FAMILIES_A = [
  {
    familyKey: 'lb_3_3_space_speed',
    title: {
      en: 'Left Back — Ball Speed vs 3:3 Spaces',
      hr: 'Lijevi vanjski — brzina lopte protiv prostora u 3:3',
      de: 'Linker Rückraum — Balltempo gegen 3:3-Räume',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 24,
    score: '16:15',
    defensiveSystem: 'Mixed',
    skillTags: ['perception', 'defensiveReading', 'tempo'],
    perception: true,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Opponent defends a true 3:3 at 24\'. You lead 16:15. Large gaps sit between their three high and three low defenders. You receive at nine metres with time; the centre back is one short pass away. Your near defender is half a step open, and the pivot has not yet drawn help.',
      hr: 'Protivnik brani pravu obranu 3:3 u 24. minuti. Vodite 16:15. Između tri visoka i tri niska braniča veliki su prostori. Primaš na devet metara s vremenom; srednji vanjski je jedno kratko dodavanje daleko. Tvoj bliži branič kasni pola koraka, a pivot još nije povukao pomoć.',
      de: 'Gegner verteidigt echte 3:3 in Minute 24. Ihr führt 16:15. Zwischen den drei hohen und drei tiefen Verteidigern liegen große Räume. Du bekommst auf neun Metern mit Zeit; Rückraum Mitte ist einen kurzen Pass entfernt. Dein Nahverteidiger ist einen halben Schritt offen, der Kreisläufer hat noch keine Hilfe gebunden.',
    },
    question: {
      en: 'Where does the surplus appear first?',
      hr: 'Gdje nastaje višak?',
      de: 'Wo entsteht zuerst der Überzahlvorteil?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Accelerate the ball through the open channel or 1v1 before the 3:3 compresses',
          hr: 'Ubrzaj loptu kroz otvoreni kanal ili 1 na 1 prije nego se 3:3 stisne',
          de: 'Balltempo durch den offenen Kanal oder im 1 gegen 1, bevor die 3:3 komprimiert',
        },
        feedback: {
          en: 'Correct — in 3:3 the surplus is tempo through space; hesitate and the gaps close.',
          hr: 'Točno — u 3:3 višak je tempo kroz prostor; oklijevanje zatvara rupe.',
          de: 'Richtig — in der 3:3 ist der Vorteil Tempo durch Raum; Zögern schließt die Lücken.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Short exchange with the centre back to force one high defender to commit, then attack the freed lane',
          hr: 'Kratka razmjena sa srednjim vanjskim da vežeš jednog visokog braniča, pa napadni oslobođeni prolaz',
          de: 'Kurzer Austausch mit Rückraum Mitte, einen Hohen binden, dann die freie Bahn angreifen',
        },
        feedback: {
          en: 'Good — creates surplus too, but slower than punishing the already open channel.',
          hr: 'Dobro — i to stvara višak, ali sporije od kažnjavanja već otvorenog kanala.',
          de: 'Gut — schafft auch Vorteil, aber langsamer als den schon offenen Kanal zu bestrafen.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Hold at eleven metres and wait for a perfect wing cut while the 3:3 resets',
          hr: 'Ostani na jedanaest metara i čekaj savršen ulazak krila dok se 3:3 resetira',
          de: 'Auf elf Metern halten und auf den perfekten Außenlauf warten, während die 3:3 resetet',
        },
        feedback: {
          en: 'Risky — waiting kills the space advantage that defines 3:3.',
          hr: 'Rizično — čekanje ubija prostornu prednost koja definira 3:3.',
          de: 'Riskant — Warten tötet den Raumvorteil, der die 3:3 ausmacht.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Force a long cross-court pass into traffic without threatening a gap',
          hr: 'Forsiraj dugo dijagonalno dodavanje u gužvu bez prijetnje u prostor',
          de: 'Langen Diagonalpass in den Verkehr erzwingen, ohne eine Lücke zu bedrohen',
        },
        feedback: {
          en: 'Poor — empty long balls gift turnovers while the near surplus goes unused.',
          hr: 'Loše — prazne duge lopte daju gubitak dok se bliži višak ne koristi.',
          de: 'Schlecht — leere lange Bälle schenken Ballverlust, während der nahe Vorteil ungenutzt bleibt.',
        },
      },
    ],
    explanation: {
      en: 'Cue: big gaps in a true 3:3 with a half-step open defender. Surplus appears in ball speed through that channel or a decisive 1v1. A short exchange (B) also works but is slower. Holding for a perfect wing or forcing a long diagonal wastes the structural gift.',
      hr: 'Signal: veliki prostori u pravoj 3:3 i branič kasni pola koraka. Višak nastaje u brzini lopte kroz taj kanal ili odlučnom 1 na 1. Kratka razmjena (B) također radi, ali sporije. Čekanje krila ili forsiranje duge dijagonale baca strukturni dar.',
      de: 'Signal: große Lücken in echter 3:3 plus halber Schritt offen. Vorteil entsteht durch Balltempo in den Kanal oder klares 1 gegen 1. Kurzer Austausch (B) geht, ist aber langsamer. Warten auf den Außen oder erzwungene Diagonale verschenkt den Strukturvorteil.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.1 },
  },

  {
    familyKey: 'lb_4_2_behind_highs',
    title: {
      en: 'Left Back — Space Behind Two High 4:2 Defenders',
      hr: 'Lijevi vanjski — prostor iza dva visoka braniča u 4:2',
      de: 'Linker Rückraum — Raum hinter zwei hohen 4:2-Verteidigern',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 33,
    score: '19:19',
    defensiveSystem: 'Mixed',
    skillTags: ['perception', 'defensiveReading', 'tempo'],
    perception: true,
    numerical: '6v6',
    gameState: 'none',
    situation: {
      en: 'Opponent just switched into a 4:2 at 33\'. Score 19:19. Two high defenders jump out on you and the centre back. Behind them, between the four low defenders, a clear lane opens toward the pivot line. The left wing is covered; your near high defender is still advancing.',
      hr: 'Protivnik je upravo prešao na obranu 4:2 u 33. minuti. Neriješeno je 19:19. Dva visoka braniča izlaze na tebe i srednjeg vanjskog. Iza njih, između četiri niska braniča, otvara se čist prolaz prema liniji pivota. Lijevo krilo je pokriveno; tvoj bliži visoki branič još napreduje.',
      de: 'Gegner stellt gerade auf 4:2 um in Minute 33. Unentschieden 19:19. Zwei hohe Verteidiger springen auf dich und Rückraum Mitte heraus. Hinter ihnen öffnet sich zwischen den vier Tiefen eine klare Bahn zur Kreisläuferlinie. Linksaußen ist zugestellt; dein naher Hoher rückt noch vor.',
    },
    question: {
      en: 'What just changed in the defence?',
      hr: 'Što se promijenilo u obrani?',
      de: 'Was hat sich in der Abwehr gerade verändert?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Play behind the two high defenders into the freed lane before the four low close it',
          hr: 'Odigraj iza dva visoka braniča u oslobođeni prolaz prije nego ga četiri niska zatvore',
          de: 'Hinter die beiden Hohen in die freie Bahn spielen, bevor die vier Tiefen schließen',
        },
        feedback: {
          en: 'Correct — the change is two highs stepping out; value sits in the space they leave behind.',
          hr: 'Točno — promjena su dva visoka koja izlaze; vrijednost je u prostoru koji ostave iza sebe.',
          de: 'Richtig — die Änderung sind zwei heraustretende Hohe; der Wert liegt im Raum dahinter.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'If one high overcommits, drive past his hip before the second line slides across',
          hr: 'Ako jedan visoki pretjera s izlaskom, prodri kroz bok prije nego druga linija dođe u pomoć',
          de: 'Wenn ein Hoher überzieht, am Hüft vorbeigehen, bevor die zweite Linie hilft',
        },
        feedback: {
          en: 'Good — valid on a heavy overcommit; first punishment remains the lane behind both highs.',
          hr: 'Dobro — vrijedi kod jakog pretjeranog izlaska; prva kazna i dalje je prolaz iza oba visoka.',
          de: 'Gut — bei starkem Übercommit gültig; erste Bestrafung bleibt die Bahn hinter beiden Hohen.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Shoot immediately over the advancing high without using the space behind',
          hr: 'Odmah šutiraj preko izlazećeg visokog bez korištenja prostora iza',
          de: 'Sofort über den heraustretenden Hohen werfen, ohne den Raum dahinter zu nutzen',
        },
        feedback: {
          en: 'Risky — early shot into a set second line ignores the structural change you just saw.',
          hr: 'Rizično — rani šut u postavljenu drugu liniju ignorira strukturnu promjenu koju vidiš.',
          de: 'Riskant — früher Wurf in die stehende zweite Linie ignoriert die Strukturänderung.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Swing back to the covered left wing and restart as if it were still 6:0',
          hr: 'Vrati loptu na pokriveno lijevo krilo i kreni ispočetka kao da je još 6:0',
          de: 'Zurück auf den zugestellten Linksaußen und neu starten, als wäre es noch 6:0',
        },
        feedback: {
          en: 'Poor — you throw away the exact space the 4:2 just opened behind the highs.',
          hr: 'Loše — bacaš upravo prostor koji je 4:2 otvorila iza visokih.',
          de: 'Schlecht — du verschenkst genau den Raum, den die 4:2 hinter den Hohen öffnet.',
        },
      },
    ],
    explanation: {
      en: 'Cue: switch to 4:2 with two highs stepping out. What changed is space behind them. Play that lane early. A hip drive (B) is second if one overcommits. Blind shot or restarting like 6:0 wastes the read.',
      hr: 'Signal: prelazak na 4:2 i izlazak dva visoka. Promjena je prostor iza njih. Rano odigraj taj prolaz. Prodor kroz bok (B) je druga opcija ako jedan pretjera. Slijepi šut ili restart kao u 6:0 baca čitanje.',
      de: 'Signal: Umstellung auf 4:2 mit zwei heraustretenden Hohen. Die Änderung ist Raum dahinter — früh bespielen. Hüftangriff (B) nur bei Übercommit. Blindwurf oder 6:0-Neustart verschenkt die Lesart.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.1 },
  },

  {
    familyKey: 'lb_5_plus_1_marked_pivot',
    title: {
      en: 'Left Back — Free Zone vs 5+1 Marked Pivot',
      hr: 'Lijevi vanjski — slobodna zona protiv 5+1 s označenim pivotom',
      de: 'Linker Rückraum — freie Zone gegen 5+1 mit markiertem Kreisläufer',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 37,
    score: '21:20',
    defensiveSystem: 'Mixed',
    skillTags: ['defensiveReading', 'pressureDecisions', 'screening'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Opponent plays 5+1 at 37\'. You lead 21:20. One defender personally marks your pivot and stays glued to him. That leaves a free zone between the left half and centre of the five. Your near defender is shading the marked pivot more than you. The centre back is free for one tempo.',
      hr: 'Protivnik igra 5+1 u 37. minuti. Vodite 21:20. Jedan branič osobno čuva tvog pivota i ostaje zalijepljen za njega. Time ostaje slobodna zona između lijevog polubranitelja i sredine petorke. Tvoj bliži branič više pokriva označenog pivota nego tebe. Srednji vanjski je slobodan za jedno tempo.',
      de: 'Gegner spielt 5+1 in Minute 37. Ihr führt 21:20. Ein Verteidiger markiert euren Kreisläufer persönlich und bleibt kleben. Dadurch bleibt eine freie Zone zwischen linkem Halben und Mitte der Fünf. Dein Nahverteidiger schattet mehr den markierten Kreisläufer als dich. Rückraum Mitte ist ein Tempo frei.',
    },
    question: {
      en: 'How do you punish a pivot who is individually marked?',
      hr: 'Kako kažnjavaš pivota koji je individualno označen?',
      de: 'Wie bestrafst du einen individuell markierten Kreisläufer?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Attack the free zone or free back; ignore forcing the marked pivot',
          hr: 'Napadni slobodnu zonu ili slobodnog vanjskog; nemoj forsirati označenog pivota',
          de: 'Die freie Zone oder den freien Rückraum angreifen; den markierten Kreisläufer nicht erzwingen',
        },
        feedback: {
          en: 'Correct — individual mark on the pivot frees a back/zone; that is the surplus.',
          hr: 'Točno — individualno označavanje pivota oslobađa vanjskog/zonu; to je višak.',
          de: 'Richtig — Einzelmarkierung am Kreisläufer befreit Rückraum/Zone; das ist der Vorteil.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Short tempo with the free centre back to stretch the five, then take the opened half-gap',
          hr: 'Kratko tempo sa slobodnim srednjim vanjskim da rastegneš petorku, pa uzmi otvoreni poluprolaz',
          de: 'Kurzes Tempo mit freiem Rückraum Mitte, die Fünf strecken, dann die Halblücke nehmen',
        },
        feedback: {
          en: 'Good — stretches the five; direct free-zone attack is cleaner when already open.',
          hr: 'Dobro — rasteže petorku; izravan napad slobodne zone čišći je kad je već otvorena.',
          de: 'Gut — streckt die Fünf; direkter Angriff der freien Zone ist sauberer, wenn sie schon offen ist.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force a bounce into the marked pivot through the personal defender',
          hr: 'Forsiraj odskočno dodavanje na označenog pivota kroz osobnog braniča',
          de: 'Bounce auf den markierten Kreisläufer durch den Personalverteidiger erzwingen',
        },
        feedback: {
          en: 'Risky — the mark exists to steal that pass; you play into their plan.',
          hr: 'Rizično — oznaka postoji da ukrade to dodavanje; igraš im u plan.',
          de: 'Riskant — die Markierung soll genau diesen Pass stehlen; du spielst in ihren Plan.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Retreat beyond eleven metres and wait for the mark to leave the pivot alone',
          hr: 'Povuci se iza jedanaest metara i čekaj da oznaka ostavi pivota na miru',
          de: 'Hinter elf Meter zurück und warten, bis die Markierung den Kreisläufer freigibt',
        },
        feedback: {
          en: 'Poor — the mark will not leave; retreating kills the free zone you already have.',
          hr: 'Loše — oznaka neće otići; povlačenje ubija slobodnu zonu koju već imaš.',
          de: 'Schlecht — die Markierung bleibt; Zurückweichen tötet die freie Zone, die du schon hast.',
        },
      },
    ],
    explanation: {
      en: 'Cue: 5+1 with a glued personal mark on the pivot. Do not force that pass. Punish the free zone or free back. Tempo with CB (B) is fine but slower. Forcing the marked pivot or retreating wastes the surplus the mark creates.',
      hr: 'Signal: 5+1 s zalijepljenom osobnom oznakom na pivotu. Nemoj forsirati to dodavanje. Kazni slobodnu zonu ili slobodnog vanjskog. Tempo sa SV (B) može, ali sporije. Forsiranje označenog pivota ili povlačenje baca višak koji oznaka stvara.',
      de: 'Signal: 5+1 mit klebender Personalmarkierung am Kreisläufer. Diesen Pass nicht erzwingen. Freie Zone oder freien Rückraum bestrafen. Tempo mit RM (B) geht, ist langsamer. Erzwingen oder Zurückweichen verschenkt den Vorteil der Markierung.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.2 },
  },

  {
    familyKey: 'lb_4_plus_2_free_lane',
    title: {
      en: 'Left Back — Unmarked Channel vs 4+2',
      hr: 'Lijevi vanjski — neoznačeni kanal protiv 4+2',
      de: 'Linker Rückraum — unmarkierter Kanal gegen 4+2',
    },
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 42,
    score: '24:23',
    defensiveSystem: 'Mixed',
    skillTags: ['defensiveReading', 'pressureDecisions', 'perception'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Opponent runs 4+2 at 42\'. You lead 24:23. Two individual markers stick to your centre back and right back. You receive free at nine metres on the left — no personal marker on you. Between the four zone defenders a half-channel opens toward six metres. The pivot is fighting inside; the left wing is one long pass away.',
      hr: 'Protivnik igra 4+2 u 42. minuti. Vodite 24:23. Dva individualna braniča lijepe se za srednjeg i desnog vanjskog. Ti primaš slobodan na devet metara lijevo — nema osobnog markera na tebi. Između četiri zonska braniča otvara se polukanal prema šest metara. Pivot se bori unutra; lijevo krilo je jedno dugo dodavanje daleko.',
      de: 'Gegner spielt 4+2 in Minute 42. Ihr führt 24:23. Zwei Individualverteidiger kleben an Rückraum Mitte und Rechts. Du bekommst frei auf neun Metern links — kein Personalmarker auf dir. Zwischen den vier Zonenverteidigern öffnet sich ein Halbkanal zur Sechs. Der Kreisläufer kämpft innen; Linksaußen ist einen langen Pass entfernt.',
    },
    question: {
      en: 'Where is the unmarked channel you must attack first?',
      hr: 'Gdje je neoznačeni kanal koji prvo moraš napasti?',
      de: 'Wo ist der unmarkierte Kanal, den du zuerst angreifen musst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Drive or jump-shot the free half-channel before a zone defender slides onto you',
          hr: 'Prodor ili skok-šut u slobodni polukanal prije nego zonski branič dođe na tebe',
          de: 'Durchbruch oder Sprungwurf in den freien Halbkanal, bevor ein Zonenverteidiger auf dich schiebt',
        },
        feedback: {
          en: 'Correct — two markers elsewhere make you the free attacker; punish the open channel now.',
          hr: 'Točno — dva markera drugdje čine tebe slobodnim napadačem; odmah kazni otvoreni kanal.',
          de: 'Richtig — zwei Marker anderswo machen dich zum freien Angreifer; den offenen Kanal jetzt bestrafen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'If the half-channel closes, short pass into the pivot fight before help arrives from the markers',
          hr: 'Ako se polukanal zatvori, kratko dodaj u borbu pivota prije nego stigne pomoć od markera',
          de: 'Wenn der Halbkanal zu ist, kurz in den Kreisläuferkampf passen, bevor Markerhilfe kommt',
        },
        feedback: {
          en: 'Good — backup if the channel closes; first value is still your unmarked drive.',
          hr: 'Dobro — rezerva ako se kanal zatvori; prva vrijednost i dalje je tvoj neoznačeni prodor.',
          de: 'Gut — Reserve, wenn der Kanal zu ist; erster Wert bleibt dein unmarkierter Angriff.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force a long switch to the marked right back through both individual markers',
          hr: 'Forsiraj dugu promjenu strane na označenog desnog vanjskog kroz oba individualna markera',
          de: 'Lange Seite auf den markierten rechten Rückraum durch beide Individualmarker erzwingen',
        },
        feedback: {
          en: 'Risky — you pass into the two markers instead of using the free lane on your ball.',
          hr: 'Rizično — dodaješ u dva markera umjesto da koristiš slobodni prolaz na svojoj lopti.',
          de: 'Riskant — du passt in die beiden Marker, statt die freie Bahn am eigenen Ball zu nutzen.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Hold and wait for the markers to leave so everyone is free at once',
          hr: 'Drži i čekaj da markeri odu kako bi svi odjednom bili slobodni',
          de: 'Halten und warten, bis die Marker abziehen, damit alle gleichzeitig frei sind',
        },
        feedback: {
          en: 'Poor — markers will not leave; waiting lets the four zone close your channel.',
          hr: 'Loše — markeri neće otići; čekanje daje četvorici zonskih da zatvore tvoj kanal.',
          de: 'Schlecht — Marker bleiben; Warten lässt die vier Zonen deinen Kanal schließen.',
        },
      },
    ],
    explanation: {
      en: 'Cue: 4+2 with markers on CB and RB — you are free. Attack the unmarked half-channel immediately. Pivot pass (B) only if that channel closes. Switching into the markers or waiting wastes the isolation the system gave you.',
      hr: 'Signal: 4+2 s markerima na SV i DV — ti si slobodan. Odmah napadni neoznačeni polukanal. Pas na pivota (B) samo ako se kanal zatvori. Promjena u markere ili čekanje baca izolaciju koju ti sustav daje.',
      de: 'Signal: 4+2 mit Markern auf RM und RR — du bist frei. Sofort den unmarkierten Halbkanal angreifen. Kreisläuferpass (B) nur wenn zu. In die Marker schalten oder warten verschenkt die Isolation.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.35 },
  },

  {
    familyKey: 'lb_open_man_isolation',
    title: {
      en: 'Left Back — Isolation vs Open Man-to-Man',
      hr: 'Lijevi vanjski — izolacija protiv otvorenog individualnog čuvanja',
      de: 'Linker Rückraum — Isolation gegen offene Mann-Mann-Abwehr',
    },
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 18,
    score: '12:11',
    defensiveSystem: 'Man-to-Man',
    skillTags: ['defensiveReading', 'shotReading', '1v1'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Opponent presses open man-to-man at 18\'. You lead 12:11. Your defender is alone between you and the goal; the nearest help is two full strides late. You receive facing forward at nine metres with balance. The wing and pivot are each occupied by their own markers.',
      hr: 'Protivnik pritišće otvorenim individualnim čuvanjem u 18. minuti. Vodite 12:11. Tvoj branič je sam između tebe i gola; najbliža pomoć kasni dva puna koraka. Primaš okrenut naprijed na devet metara u ravnoteži. Krilo i pivot svaki imaju svog markera.',
      de: 'Gegner pressiert offene Mann-Mann in Minute 18. Ihr führt 12:11. Dein Verteidiger steht allein zwischen dir und dem Tor; die nächste Hilfe ist zwei volle Schritte spät. Du bekommst frontal auf neun Metern im Gleichgewicht. Außen und Kreisläufer sind jeweils gebunden.',
    },
    question: {
      en: 'What do you do when help is clearly late in open man-to-man?',
      hr: 'Što radiš kad je pomoć jasno kasna u otvorenom individualnom čuvanju?',
      de: 'Was tust du, wenn in offener Mann-Mann die Hilfe klar spät ist?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Take the 1v1 now — drive past the isolated defender before help arrives',
          hr: 'Uzmi 1 na 1 sada — prodri mimo izoliranog braniča prije nego stigne pomoć',
          de: 'Jetzt 1 gegen 1 — am isolierten Verteidiger vorbei, bevor Hilfe kommt',
        },
        feedback: {
          en: 'Correct — late help is the cue to finish the isolation, not to recycle.',
          hr: 'Točno — kasna pomoć je signal da završiš izolaciju, ne da recikliraš.',
          de: 'Richtig — späte Hilfe heißt Isolation abschließen, nicht recyceln.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Freeze-fake to freeze his feet, then shoot the opened corner if he stops the drive',
          hr: 'Finta-stop da mu zamrzneš noge, pa šut u otvoreni kut ako zaustavi prodor',
          de: 'Stoppfinte, um seine Füße zu frieren, dann in die offene Ecke werfen, wenn er den Weg stoppt',
        },
        feedback: {
          en: 'Good — works if he plants; decisive drive past still beats a contested jump shot.',
          hr: 'Dobro — radi ako se ukopa; odlučan prodor mimo njega i dalje bije otežan skok-šut.',
          de: 'Gut — geht, wenn er stockt; klarer Vorbeigen bleibt stärker als umkämpfter Sprungwurf.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Pass sideways immediately without threatening the isolated defender',
          hr: 'Odmah dodaj bočno bez prijetnje izoliranom braniču',
          de: 'Sofort seitlich passen, ohne den isolierten Verteidiger zu bedrohen',
        },
        feedback: {
          en: 'Risky — empty side pass lets late help recover into the isolation.',
          hr: 'Rizično — prazno bočno dodavanje daje kasnoj pomoći vrijeme da uđe u izolaciju.',
          de: 'Riskant — leerer Seitpass gibt der späten Hilfe Zeit, in die Isolation zu kommen.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Dribble backward to eleven metres and wait for a double screen that is not there',
          hr: 'Vodi unatrag na jedanaest metara i čekaj dvostruki blok koji ne postoji',
          de: 'Rückwärts auf elf Meter dribbeln und auf einen Doppelblock warten, den es nicht gibt',
        },
        feedback: {
          en: 'Poor — retreating cancels the isolation advantage against late help.',
          hr: 'Loše — povlačenje briše prednost izolacije protiv kasne pomoći.',
          de: 'Schlecht — Zurückweichen löscht den Isolationsvorteil gegen späte Hilfe.',
        },
      },
    ],
    explanation: {
      en: 'Cue: open man-to-man, help two strides late, you facing forward. Finish the 1v1. Freeze-fake into shot (B) is second if he plants. Empty side pass or retreating for a phantom screen wastes late help.',
      hr: 'Signal: otvoreno individualno čuvanje, pomoć kasni dva koraka, ti gledaš naprijed. Završi 1 na 1. Finta-stop u šut (B) je druga opcija ako se ukopa. Prazno bočno dodavanje ili povlačenje za nepostojeći blok baca kasnu pomoć.',
      de: 'Signal: offene Mann-Mann, Hilfe zwei Schritte spät, frontal. 1 gegen 1 abschließen. Stoppfinte-Wurf (B) wenn er stockt. Leerer Seitpass oder Zurückweichen für Phantomblock verschenkt die späte Hilfe.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.0 },
  },

  {
    familyKey: 'lb_1v1_defender_high',
    title: {
      en: 'Left Back — Defender Too High, Past the Hip',
      hr: 'Lijevi vanjski — branič previsok, mimo boka',
      de: 'Linker Rückraum — Verteidiger zu hoch, an der Hüfte vorbei',
    },
    difficulty: 'Beginner',
    pressureLevel: 'Low',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 12,
    score: '8:7',
    defensiveSystem: '6-0',
    skillTags: ['1v1', 'shotReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Set 6:0 at 12\'. You lead 8:7. You catch at nine metres. Your defender steps out too high — his hips are in front of the nine-metre line and his near hip is open. Help from the centre is still a step away. The left wing is covered.',
      hr: 'Postavljena obrana 6:0 u 12. minuti. Vodite 8:7. Primaš na devet metara. Tvoj branič izlazi previsoko — bokovi su ispred linije od devet metara, a bliži bok je otvoren. Pomoć iz sredine još je korak daleko. Lijevo krilo je pokriveno.',
      de: 'Stehende 6:0 in Minute 12. Ihr führt 8:7. Du fängst auf neun Metern. Dein Verteidiger tritt zu hoch heraus — Hüften vor der Neun-Meter-Linie, nahe Hüfte offen. Hilfe aus der Mitte ist noch einen Schritt weg. Linksaußen ist zugestellt.',
    },
    question: {
      en: 'What do you attack when the defender is too high?',
      hr: 'Što napadaš kad je branič previsok?',
      de: 'Was greifst du an, wenn der Verteidiger zu hoch steht?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Go past the open hip into the lane before centre help arrives',
          hr: 'Prođi mimo otvorenog boka u prolaz prije nego stigne pomoć iz sredine',
          de: 'An der offenen Hüfte vorbei in die Bahn, bevor Mittehilfe kommt',
        },
        feedback: {
          en: 'Correct — too-high defender = open hip; punish with a decisive drive past.',
          hr: 'Točno — previsok branič = otvoren bok; kazni odlučnim prodorom mimo njega.',
          de: 'Richtig — zu hoher Verteidiger = offene Hüfte; mit klarem Vorbeigen bestrafen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Jump-shot over him if he freezes after you threaten the hip',
          hr: 'Skok-šut preko njega ako se ukopa nakon što zaprijetiš bokom',
          de: 'Sprungwurf über ihn, wenn er nach der Hüftbedrohung stockt',
        },
        feedback: {
          en: 'Good — works if he plants; the cleaner read is still past the open hip.',
          hr: 'Dobro — radi ako se ukopa; čišće čitanje i dalje je mimo otvorenog boka.',
          de: 'Gut — geht bei Stocken; die sauberere Lesart bleibt an der offenen Hüfte vorbei.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Step back and shoot from eleven metres without using the open hip',
          hr: 'Korak unatrag i šut s jedanaest metara bez korištenja otvorenog boka',
          de: 'Zurücktreten und von elf Metern werfen, ohne die offene Hüfte zu nutzen',
        },
        feedback: {
          en: 'Risky — you give away the hip lane and shoot into a recovering help defender.',
          hr: 'Rizično — predaješ prolaz kroz bok i šutiraš u braniča koji stiže u pomoć.',
          de: 'Riskant — du verschenkst die Hüftbahn und wirfst in die kommende Hilfe.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Pass immediately to the covered left wing under no pressure',
          hr: 'Odmah dodaj na pokriveno lijevo krilo bez pritiska',
          de: 'Sofort auf den zugestellten Linksaußen passen, obwohl kein Druck da ist',
        },
        feedback: {
          en: 'Poor — you throw away a clear 1v1 gift against a too-high defender.',
          hr: 'Loše — bacaš jasan dar 1 na 1 protiv previsokog braniča.',
          de: 'Schlecht — du verschenkst ein klares 1-gegen-1-Geschenk gegen zu hohen Verteidiger.',
        },
      },
    ],
    explanation: {
      en: 'Cue: defender stepped too high with open near hip, help one step late. Attack past the hip. Jump shot (B) only if he freezes. Stepping back or forcing the covered wing wastes the simple read.',
      hr: 'Signal: branič previsoko, bliži bok otvoren, pomoć kasni korak. Napadni mimo boka. Skok-šut (B) samo ako se ukopa. Korak unatrag ili forsiranje pokrivenog krila baca jednostavno čitanje.',
      de: 'Signal: Verteidiger zu hoch, nahe Hüfte offen, Hilfe einen Schritt spät. An der Hüfte vorbei. Sprungwurf (B) nur bei Stocken. Zurücktreten oder zugestellter Außen verschenkt die einfache Lesart.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.2 },
  },

  {
    familyKey: 'lb_1v1_defender_deep',
    title: {
      en: 'Left Back — Defender Too Deep, Shoot or Freeze-Fake',
      hr: 'Lijevi vanjski — branič predubok, šut ili finta-stop',
      de: 'Linker Rückraum — Verteidiger zu tief, Wurf oder Stoppfinte',
    },
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 29,
    score: '18:17',
    defensiveSystem: '6-0',
    skillTags: ['1v1', 'shotReading', 'defensiveReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Compact 6:0 at 29\'. You lead 18:17. Your defender sits too deep — almost on the six-metre line — giving you a clean release window at nine. Help from the half is closing but not yet there. The pivot is sealed on the far side; you still have balance after the catch.',
      hr: 'Zbijena obrana 6:0 u 29. minuti. Vodite 18:17. Tvoj branič sjedi preduboko — gotovo na liniji od šest metara — i daje ti čist prozor za ispuštanje na devet. Pomoć s pola se zatvara, ali još nije tu. Pivot je zatvorio na dalekoj strani; još imaš ravnotežu nakon prijema.',
      de: 'Kompakte 6:0 in Minute 29. Ihr führt 18:17. Dein Verteidiger sitzt zu tief — fast auf der Sechs — und schenkt dir ein sauberes Abwurffenster auf neun. Hilfe vom Halben schließt, ist aber noch nicht da. Kreisläufer dichtet fern ab; nach dem Fang hast du noch Gleichgewicht.',
    },
    question: {
      en: 'What do you take when the defender sits too deep?',
      hr: 'Što uzimaš kad branič sjedi preduboko?',
      de: 'Was nimmst du, wenn der Verteidiger zu tief sitzt?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Shoot now or freeze-fake then shoot before half help arrives',
          hr: 'Šutiraj sada ili finta-stop pa šut prije nego stigne pomoć s pola',
          de: 'Jetzt werfen oder Stoppfinte und werfen, bevor Halbe-Hilfe kommt',
        },
        feedback: {
          en: 'Correct — deep defender gifts the release; take it before help closes the window.',
          hr: 'Točno — predubok branič poklanja prozor za šut; uzmi ga prije nego pomoć zatvori.',
          de: 'Richtig — zu tiefer Verteidiger schenkt das Abwurf Fenster; nimm es vor der Hilfe.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'If he suddenly steps up on the fake, drive the opened hip before he resets',
          hr: 'Ako naglo izađe na fintu, prodri kroz otvoreni bok prije nego se postavi',
          de: 'Wenn er auf die Finte plötzlich heraustritt, die offene Hüfte nehmen, bevor er steht',
        },
        feedback: {
          en: 'Good — second option when the deep defender panics up; first is the free shot.',
          hr: 'Dobro — druga opcija kad preduboki panično izađe; prva je slobodan šut.',
          de: 'Gut — zweite Option, wenn der Tiefe panisch heraustritt; erste bleibt der freie Wurf.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Drive into the deep defender hoping contact creates a foul',
          hr: 'Prodri u predubokog braniča u nadi da kontakt donese prekršaj',
          de: 'In den tiefen Verteidiger gehen und auf Foul durch Kontakt hoffen',
        },
        feedback: {
          en: 'Risky — he is set deep to absorb contact; you walk into his strength.',
          hr: 'Rizično — sjedi duboko da upije kontakt; ulaziš mu u snagu.',
          de: 'Riskant — er sitzt tief, um Kontakt zu schlucken; du läufst in seine Stärke.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Pass sideways and restart while the free shooting window is open',
          hr: 'Dodaj bočno i kreni ispočetka dok je slobodan prozor za šut otvoren',
          de: 'Seitlich passen und neu starten, während das freie Wurf Fenster offen ist',
        },
        feedback: {
          en: 'Poor — you gift the deep defender time and close your own clean release.',
          hr: 'Loše — poklanjaš predubokom braniču vrijeme i zatvaraš vlastiti čist šut.',
          de: 'Schlecht — du schenkst dem Tiefen Zeit und schließt dein eigenes sauberes Fenster.',
        },
      },
    ],
    explanation: {
      en: 'Cue: defender too deep, help closing but not there, you balanced. Shoot or freeze-fake-shoot now. Hip drive (B) only if he steps up in panic. Driving into his set body or recycling wastes the free window.',
      hr: 'Signal: branič predubok, pomoć se zatvara ali nije tu, ti si u ravnoteži. Šut ili finta-stop-šut sada. Prodor kroz bok (B) samo ako panično izađe. Prodor u njegovo tijelo ili recikliranje baca slobodan prozor.',
      de: 'Signal: Verteidiger zu tief, Hilfe schließt aber fehlt, du im Gleichgewicht. Jetzt werfen oder Stoppfinte-Wurf. Hüftangriff (B) nur bei Panikschritt. In seinen Körper gehen oder recyceln verschenkt das freie Fenster.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.15 },
  },

  {
    familyKey: 'lb_1v1_hips_turned',
    title: {
      en: 'Left Back — Attack the Wrong-Foot Hip',
      hr: 'Lijevi vanjski — napadni bok na pogrešnoj nozi',
      de: 'Linker Rückraum — die falsche Standbein-Hüfte angreifen',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 21,
    score: '14:14',
    defensiveSystem: '6-0',
    skillTags: ['1v1', 'perception', 'defensiveReading'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: {
      en: '6:0 at 21\'. Score 14:14. You receive at nine metres. Your defender has weight on the wrong foot — hips turned toward the sideline, near hip open to the middle. The centre defender is shading the pivot, not sliding yet. You still have a free first step.',
      hr: 'Obrana 6:0 u 21. minuti. Neriješeno je 14:14. Primaš na devet metara. Tvoj branič ima težinu na pogrešnoj nozi — bokovi okrenuti prema aut-liniji, bliži bok otvoren prema sredini. Srednji branič pokriva pivota, još ne klizi. Još imaš slobodan prvi korak.',
      de: '6:0 in Minute 21. Unentschieden 14:14. Du bekommst auf neun Metern. Dein Verteidiger steht auf dem falschen Bein — Hüften zur Seitenlinie, nahe Hüfte zur Mitte offen. Der Mittelverteidiger schattet den Kreisläufer, schiebt noch nicht. Du hast noch den freien ersten Schritt.',
    },
    question: {
      en: 'Which side do you attack when his hips are turned wrong?',
      hr: 'Koju stranu napadaš kad su mu bokovi krivo okrenuti?',
      de: 'Welche Seite greifst du an, wenn seine Hüften falsch stehen?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Attack the open hip toward the middle before he can re-plant',
          hr: 'Napadni otvoreni bok prema sredini prije nego se može ponovno ukopati',
          de: 'Die offene Hüfte zur Mitte angreifen, bevor er neu stehen kann',
        },
        feedback: {
          en: 'Correct — wrong-foot hips open one side; take that side on the first step.',
          hr: 'Točno — bokovi na pogrešnoj nozi otvaraju jednu stranu; uzmi je prvim korakom.',
          de: 'Richtig — falsches Standbein öffnet eine Seite; nimm sie mit dem ersten Schritt.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Threaten that hip, then shoot the freed corner if he lunges to recover',
          hr: 'Zaprijeti tom boku, pa šutiraj oslobođeni kut ako iskoči da se vrati',
          de: 'Diese Hüfte bedrohen, dann in die freie Ecke werfen, wenn er zum Zurückkommen ausgreift',
        },
        feedback: {
          en: 'Good — valid if the lunge opens a corner; first punish is still past the open hip.',
          hr: 'Dobro — vrijedi ako iskorak otvori kut; prva kazna i dalje je mimo otvorenog boka.',
          de: 'Gut — gültig, wenn der Ausfall eine Ecke öffnet; erste Bestrafung bleibt an der offenen Hüfte vorbei.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Attack the closed sideline side where his weight is already planted',
          hr: 'Napadni zatvorenu stranu prema autu gdje mu je težina već ukopana',
          de: 'Die geschlossene Seitenlinien-Seite angreifen, wo sein Gewicht schon steht',
        },
        feedback: {
          en: 'Risky — you run into his strong planted side and gift him the block.',
          hr: 'Rizično — trčiš u njegovu jaku ukopanu stranu i poklanjaš mu blok.',
          de: 'Riskant — du läufst in seine starke Standseite und schenkst ihm den Block.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Pass without using the free first step while his hips are still wrong',
          hr: 'Dodaj bez korištenja slobodnog prvog koraka dok su mu bokovi još krivi',
          de: 'Passen, ohne den freien ersten Schritt zu nutzen, während die Hüften noch falsch stehen',
        },
        feedback: {
          en: 'Poor — the hip cue lasts one step; unused, it disappears.',
          hr: 'Loše — signal boka traje jedan korak; neiskorišten nestaje.',
          de: 'Schlecht — das Hüftsignal hält einen Schritt; ungenutzt ist es weg.',
        },
      },
    ],
    explanation: {
      en: 'Cue: weight on wrong foot, hips to sideline, near hip open to middle. Attack that open middle hip on the first step. Corner shot (B) if he lunges. Attacking his planted side or passing unused wastes the cue.',
      hr: 'Signal: težina na pogrešnoj nozi, bokovi prema autu, bliži bok otvoren prema sredini. Napadni taj otvoreni bok prvim korakom. Šut u kut (B) ako iskoči. Napad ukopane strane ili dodavanje bez koraka baca signal.',
      de: 'Signal: Gewicht auf falschem Bein, Hüften zur Seite, nahe Hüfte zur Mitte offen. Diese Hüfte mit dem ersten Schritt. Eckenwurf (B) bei Ausfall. Seine Standseite oder ungenutzter Pass verschenkt das Signal.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.05 },
  },

  {
    familyKey: 'lb_1v1_help_close',
    title: {
      en: 'Left Back — Help Close, Recycle the 1v1',
      hr: 'Lijevi vanjski — pomoć blizu, recikliraj 1 na 1',
      de: 'Linker Rückraum — Hilfe nah, 1 gegen 1 recyceln',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 46,
    score: '25:24',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'pressureDecisions', 'tempo'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Tight 6:0 at 46\'. You lead 25:24. You start a 1v1 at nine metres, but the centre defender is already sliding into your drive lane — help is one stride away and closing. Your own defender still has chest contact. The centre back is free on the weak side for a short recycle.',
      hr: 'Zbijena obrana 6:0 u 46. minuti. Vodite 25:24. Krećeš 1 na 1 na devet metara, ali srednji branič već klizi u tvoj prolaz — pomoć je jedan korak daleko i zatvara se. Tvoj branič još ima kontakt prsima. Srednji vanjski je slobodan na slaboj strani za kratko recikliranje.',
      de: 'Enge 6:0 in Minute 46. Ihr führt 25:24. Du startest 1 gegen 1 auf neun, aber der Mittelverteidiger schiebt schon in deine Bahn — Hilfe ist einen Schritt weg und schließt. Dein Verteidiger hat noch Brustkontakt. Rückraum Mitte ist schwachseitig frei für kurzes Recycling.',
    },
    question: {
      en: 'What do you do when help is already in your drive lane?',
      hr: 'Što radiš kad je pomoć već u tvom prolazu za prodor?',
      de: 'Was tust du, wenn die Hilfe schon in deiner Durchbruchbahn ist?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Do not force the 1v1 — recycle early to the free centre back and reopen',
          hr: 'Nemoj forsirati 1 na 1 — rano recikliraj na slobodnog srednjeg vanjskog i ponovno otvori',
          de: '1 gegen 1 nicht erzwingen — früh auf freien Rückraum Mitte recyceln und neu öffnen',
        },
        feedback: {
          en: 'Correct — close help kills the drive; early recycle keeps possession and reshapes the gap.',
          hr: 'Točno — bliska pomoć ubija prodor; rano recikliranje čuva loptu i ponovno oblikuje prostor.',
          de: 'Richtig — nahe Hilfe tötet den Durchbruch; frühes Recycling hält den Ball und formt neu.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Short stop-fake to pull help past you, then bounce to the pivot if a lane flashes',
          hr: 'Kratka finta-stop da povučeš pomoć mimo sebe, pa odskočno na pivota ako bljesne prolaz',
          de: 'Kurze Stoppfinte, Hilfe vorbeiziehen, dann Bounce auf den Kreisläufer wenn eine Gasse blitzt',
        },
        feedback: {
          en: 'Good — works if help overruns; safer default is still recycle to the free CB.',
          hr: 'Dobro — radi ako pomoć pretjera; sigurniji default i dalje je recikliranje na slobodnog SV.',
          de: 'Gut — geht bei Überziehen der Hilfe; sicherer Default bleibt Recycling auf freien RM.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force the drive into two defenders and hope for a foul',
          hr: 'Forsiraj prodor u dva braniča i nadaj se prekršaju',
          de: 'Durchbruch in zwei Verteidiger erzwingen und auf Foul hoffen',
        },
        feedback: {
          en: 'Risky — help is already set; this is a turnover or blocked shot more often than a foul.',
          hr: 'Rizično — pomoć je već postavljena; češće je gubitak ili blokirani šut nego prekršaj.',
          de: 'Riskant — Hilfe steht schon; öfter Ballverlust oder geblockter Wurf als Foul.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Jump-shot into the sliding help with no angle and no balance',
          hr: 'Skok-šut u klizeću pomoć bez kuta i bez ravnoteže',
          de: 'Sprungwurf in die schiebende Hilfe ohne Winkel und ohne Gleichgewicht',
        },
        feedback: {
          en: 'Poor — you shoot into a closing double without a corner; easy save or block.',
          hr: 'Loše — šutiraš u zatvarajuće udvajanje bez kuta; lagan obrana ili blok.',
          de: 'Schlecht — Wurf in schließende Verdopplung ohne Ecke; leichter Halt oder Block.',
        },
      },
    ],
    explanation: {
      en: 'Cue: help already in the drive lane with chest contact on you. Do not force 1v1 — recycle early to the free CB. Pivot bounce (B) only if help overruns. Driving or shooting into the double is the classic late-possession mistake.',
      hr: 'Signal: pomoć već u prolazu i kontakt prsima. Nemoj forsirati 1 na 1 — rano recikliraj na slobodnog SV. Odskočno na pivota (B) samo ako pomoć pretjera. Prodor ili šut u udvajanje klasična je greška.',
      de: 'Signal: Hilfe schon in der Bahn, Brustkontakt. 1 gegen 1 nicht erzwingen — früh auf freien RM. Bounce auf Kreisläufer (B) nur bei Überziehen. Durchbruch/Wurf in die Verdopplung ist der Klassikerfehler.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.25 },
  },

  {
    familyKey: 'lb_no_shot_block_wall',
    title: {
      en: 'Left Back — When Not to Shoot vs Block Wall',
      hr: 'Lijevi vanjski — kada ne šutirati protiv zida bloka',
      de: 'Linker Rückraum — wann nicht werfen gegen Blockwand',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 34,
    score: '20:19',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'shotReading', 'defensiveReading'],
    perception: true,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Compact 6:0 at 34\'. You lead 20:19. Two defenders raise a solid block wall into your strong-hand release. The centre back is free one tempo to the right. The pivot has a seal starting on the far half. Your feet are set, but the wall fully covers your natural corner.',
      hr: 'Zbijena obrana 6:0 u 34. minuti. Vodite 20:19. Dva braniča dižu čvrst zid bloka u tvoje jako ispuštanje. Srednji vanjski je slobodan jedno tempo desno. Pivot počinje zatvarati na dalekom polu. Noge su ti postavljene, ali zid potpuno pokriva tvoj prirodni kut.',
      de: 'Kompakte 6:0 in Minute 34. Ihr führt 20:19. Zwei Verteidiger heben eine feste Blockwand in deine starke Abwurfseite. Rückraum Mitte ist ein Tempo rechts frei. Der Kreisläufer startet die Abdichtung am fernen Halben. Deine Füße stehen, aber die Wand deckt deine natürliche Ecke voll.',
    },
    question: {
      en: 'Which option is the defence trying to close?',
      hr: 'Koju opciju obrana pokušava zatvoriti?',
      de: 'Welche Option versucht die Abwehr zu schließen?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Your direct shot — so pass to the free centre back or into the developing seal',
          hr: 'Tvoj izravni šut — zato dodaj na slobodnog srednjeg vanjskog ili u razvijajuće zatvaranje',
          de: 'Deinen direkten Wurf — deshalb auf freien Rückraum Mitte oder in die entstehende Abdichtung passen',
        },
        feedback: {
          en: 'Correct — the wall closes your shot; the open value is the free CB or seal.',
          hr: 'Točno — zid zatvara tvoj šut; otvorena vrijednost je slobodan SV ili zatvaranje.',
          de: 'Richtig — die Wand schließt deinen Wurf; offen sind freier RM oder Abdichtung.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'One lateral step to slide past the wall edge if a half-corner opens for a beat',
          hr: 'Jedan bočni korak mimo ruba zida ako se na tren otvori polukut',
          de: 'Ein Seitenschritt an der Wandkante vorbei, wenn eine Halbecke einen Moment öffnet',
        },
        feedback: {
          en: 'Good — only if a real half-corner flashes; default remains pass off the wall.',
          hr: 'Dobro — samo ako stvarno bljesne polukut; default ostaje dodavanje s zida.',
          de: 'Gut — nur wenn wirklich eine Halbecke blitzt; Default bleibt Abspiel von der Wand.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Power jump-shot straight into the raised block wall',
          hr: 'Snažan skok-šut ravno u dignuti zid bloka',
          de: 'Kraft-Sprungwurf gerade in die gehobene Blockwand',
        },
        feedback: {
          en: 'Risky — that is exactly the option the wall was built to kill.',
          hr: 'Rizično — to je upravo opcija koju je zid digao da ubije.',
          de: 'Riskant — genau die Option, die die Wand töten soll.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Lob a high pass over the wall into traffic with no clear receiver',
          hr: 'Visoko dodavanje preko zida u gužvu bez jasnog primatelja',
          de: 'Hohen Pass über die Wand in den Verkehr ohne klaren Empfänger',
        },
        feedback: {
          en: 'Poor — panic lob turns a controlled read into a fifty-fifty ball.',
          hr: 'Loše — panični lob pretvara kontrolirano čitanje u fifty-fifty loptu.',
          de: 'Schlecht — Panik-Lob macht aus klarer Lesart einen Fifty-fifty-Ball.',
        },
      },
    ],
    explanation: {
      en: 'Cue: solid block wall on your strong release, CB free, seal developing. Defence is closing your shot — so pass. Lateral step (B) only for a real half-corner. Power into the wall or a panic lob is what they want.',
      hr: 'Signal: čvrst zid bloka na jakom ispuštanju, SV slobodan, zatvaranje se razvija. Obrana zatvara tvoj šut — zato dodaj. Bočni korak (B) samo za pravi polukut. Snažan šut u zid ili panični lob je ono što žele.',
      de: 'Signal: feste Blockwand auf starker Seite, RM frei, Abdichtung entsteht. Abwehr schließt deinen Wurf — also passen. Seitenschritt (B) nur bei echter Halbecke. Kraft in die Wand oder Panik-Lob ist ihr Plan.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.05 },
  },

  {
    familyKey: 'lb_shot_around_block',
    title: {
      en: 'Left Back — Lateral Step Around the Block',
      hr: 'Lijevi vanjski — bočni korak oko bloka',
      de: 'Linker Rückraum — Seitenschritt um den Block',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 48,
    score: '27:26',
    defensiveSystem: '6-0',
    skillTags: ['shotReading', 'angleSelection', '1v1'],
    perception: false,
    numerical: '6v6',
    gameState: 'lead_late',
    situation: {
      en: 'Late set 6:0 at 48\'. You lead 27:26. One defender raises a single block into your strong hand. A half-step lateral opens a clean far-corner lane around the block edge. Help is late from the weak side. The pivot seal is not ready; the wing is covered.',
      hr: 'Kasna postavljena 6:0 u 48. minuti. Vodite 27:26. Jedan branič diže jedan blok u tvoju jaku ruku. Pola koraka bočno otvara čist daleki kut oko ruba bloka. Pomoć sa slabe strane kasni. Zatvaranje pivota nije spremno; krilo je pokriveno.',
      de: 'Späte stehende 6:0 in Minute 48. Ihr führt 27:26. Ein Verteidiger hebt einen Einzelblock in deine starke Hand. Ein halber Seitenschritt öffnet die ferne Ecke um die Blockkante. Hilfe von der schwachen Seite ist spät. Kreisläufer-Abdichtung ist nicht fertig; Außen zugestellt.',
    },
    question: {
      en: 'How do you create the angle when one block sits in your strong hand?',
      hr: 'Kako stvaraš kut kad jedan blok sjedi u tvojoj jakoj ruci?',
      de: 'Wie schaffst du den Winkel, wenn ein Block in deiner starken Hand sitzt?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Lateral step around the block edge and shoot the opened far corner',
          hr: 'Bočni korak oko ruba bloka i šut u otvoreni daleki kut',
          de: 'Seitenschritt um die Blockkante und Wurf in die geöffnete ferne Ecke',
        },
        feedback: {
          en: 'Correct — one block leaves an edge; the lateral step creates the corner before help.',
          hr: 'Točno — jedan blok ostavlja rub; bočni korak stvara kut prije pomoći.',
          de: 'Richtig — ein Block lässt eine Kante; Seitenschritt schafft die Ecke vor der Hilfe.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Short pump fake to drop the block arm, then shoot the same corner without a full step',
          hr: 'Kratka finta zamaha da spustiš ruku bloka, pa šut u isti kut bez punog koraka',
          de: 'Kurze Pumpfinte, den Blockarm senken, dann dieselbe Ecke ohne vollen Schritt',
        },
        feedback: {
          en: 'Good — works if the arm drops; the lateral step is more reliable against a set block.',
          hr: 'Dobro — radi ako ruka padne; bočni korak pouzdaniji je protiv postavljenog bloka.',
          de: 'Gut — geht, wenn der Arm fällt; Seitenschritt ist gegen gesetzten Block zuverlässiger.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force power through the middle of the raised block without creating an angle',
          hr: 'Forsiraj snagu kroz sredinu dignutog bloka bez stvaranja kuta',
          de: 'Kraft durch die Mitte des gehobenen Blocks erzwingen, ohne Winkel zu schaffen',
        },
        feedback: {
          en: 'Risky — middle of a set block is the lowest-percentage finish available.',
          hr: 'Rizično — sredina postavljenog bloka najniži je postotak završetka.',
          de: 'Riskant — Mitte eines gesetzten Blocks ist die schlechteste Abschlussquote.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Retreat and restart the whole attack while the edge lane is open',
          hr: 'Povuci se i kreni cijeli napad ispočetka dok je prolaz uz rub otvoren',
          de: 'Zurück und den ganzen Angriff neu starten, während die Kantenbahn offen ist',
        },
        feedback: {
          en: 'Poor — you gift the defence time to recover the edge you already created.',
          hr: 'Loše — poklanjaš obrani vrijeme da vrati rub koji si već stvorio.',
          de: 'Schlecht — du schenkst der Abwehr Zeit, die Kante zurückzuholen, die du schon hast.',
        },
      },
    ],
    explanation: {
      en: 'Cue: single block on strong hand, half-step lateral opens the far corner, help late. Step around and shoot. Pump fake (B) is second if the arm drops. Power through the middle or full restart wastes the edge.',
      hr: 'Signal: jedan blok na jakoj ruci, pola koraka bočno otvara daleki kut, pomoć kasni. Zakorači oko i šutiraj. Finta zamaha (B) je druga ako ruka padne. Snaga kroz sredinu ili potpuni restart baca rub.',
      de: 'Signal: Einzelblock auf starker Hand, halber Seitenschritt öffnet ferne Ecke, Hilfe spät. Um die Kante und werfen. Pumpfinte (B) wenn der Arm fällt. Kraft durch die Mitte oder Neustart verschenkt die Kante.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.15 },
  },

  {
    familyKey: 'lb_gk_shows_low',
    title: {
      en: 'Left Back — Goalkeeper Set Low, High Corner',
      hr: 'Lijevi vanjski — vratar nizak, visoki kut',
      de: 'Linker Rückraum — Torwart tief, hohe Ecke',
    },
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 26,
    score: '17:16',
    defensiveSystem: '6-0',
    skillTags: ['perception', 'shotReading', 'angleSelection'],
    perception: true,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Open look at nine metres vs 6:0 at 26\'. You lead 17:16. Your defender is half a step late — enough for a clean release. The goalkeeper is set low with weight on the near post and gloves down. No block wall is up. You still have balance after the catch.',
      hr: 'Otvoren pogled s devet metara protiv 6:0 u 26. minuti. Vodite 17:16. Tvoj branič kasni pola koraka — dovoljno za čisto ispuštanje. Vratar je postavljen nisko, težina na bližoj stativi, rukavice dolje. Nema zida bloka. Još imaš ravnotežu nakon prijema.',
      de: 'Freier Blick von neun Metern gegen 6:0 in Minute 26. Ihr führt 17:16. Dein Verteidiger ist einen halben Schritt spät — genug für sauberes Abwerfen. Der Torwart steht tief, Gewicht am nahen Pfosten, Handschuhe unten. Keine Blockwand. Nach dem Fang noch Gleichgewicht.',
    },
    question: {
      en: 'What is the goalkeeper showing you?',
      hr: 'Što vratar pokazuje?',
      de: 'Was zeigt dir der Torwart?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Low set — shoot the high/far corner before he can climb',
          hr: 'Niska postava — šutiraj visoki/daleki kut prije nego se digne',
          de: 'Tiefe Position — hohe/ferne Ecke werfen, bevor er hochkommt',
        },
        feedback: {
          en: 'Correct — low gloves and near-post weight show the high/far corner.',
          hr: 'Točno — niske rukavice i težina na bližoj stativi pokazuju visoki/daleki kut.',
          de: 'Richtig — tiefe Handschuhe und Gewicht am Nahpfosten zeigen die hohe/ferne Ecke.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'If he starts climbing early, freeze-fake and go low near post instead',
          hr: 'Ako se rano digne, finta-stop i idi nisko na bližu stativu',
          de: 'Wenn er früh hochkommt, Stoppfinte und tief nahen Pfosten',
        },
        feedback: {
          en: 'Good — second read if he climbs; first read remains high/far on the low set.',
          hr: 'Dobro — drugo čitanje ako se digne; prvo ostaje visoko/daleko na niskoj postavi.',
          de: 'Gut — zweite Lesart wenn er hochkommt; erste bleibt hoch/fern bei tiefer Position.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Drive low into traffic instead of using the free high corner',
          hr: 'Prodri nisko u gužvu umjesto da koristiš slobodan visoki kut',
          de: 'Tief in den Verkehr gehen statt die freie hohe Ecke zu nutzen',
        },
        feedback: {
          en: 'Risky — you leave a clear GK read for a harder finish into bodies.',
          hr: 'Rizično — napuštaš jasno čitanje vratara za teži završetak u tijela.',
          de: 'Riskant — du lässt klare Torwart-Lesart für schwereren Abschluss in Körper.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Shoot low near post into the goalkeeper\'s set weight',
          hr: 'Šutiraj nisko na bližu stativu u težinu na kojoj vratar stoji',
          de: 'Tief nahen Pfosten werfen, genau in das Gewicht des Torwarts',
        },
        feedback: {
          en: 'Poor — that is the corner he is already covering with the low set.',
          hr: 'Loše — to je kut koji već pokriva niskom postavom.',
          de: 'Schlecht — genau die Ecke, die er mit der tiefen Position schon deckt.',
        },
      },
    ],
    explanation: {
      en: 'Cue: GK set low, gloves down, weight near post, clean release. He is showing high/far — take it. Low near post after he climbs (B) is second. Driving into traffic or shooting into his set weight ignores the read.',
      hr: 'Signal: vratar nisko, rukavice dolje, težina na bližoj stativi, čisto ispuštanje. Pokazuje visoko/daleko — uzmi to. Nisko bliže (B) ako se digne. Prodor u gužvu ili šut u njegovu težinu ignorira čitanje vratara.',
      de: 'Signal: Torwart tief, Handschuhe unten, Gewicht Nahpfosten, sauberes Fenster. Er zeigt hoch/fern — nimm es. Tief nah (B) wenn er hochkommt. Verkehr oder Wurf in sein Gewicht ignoriert die Lesart.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.3 },
  },

  {
    familyKey: 'lb_shot_after_contact',
    title: {
      en: 'Left Back — Shot After Contact, Still Balanced',
      hr: 'Lijevi vanjski — šut nakon kontakta, još u ravnoteži',
      de: 'Linker Rückraum — Wurf nach Kontakt, noch im Gleichgewicht',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 39,
    score: '22:21',
    defensiveSystem: '6-0',
    skillTags: ['shotReading', 'pressureDecisions', '1v1'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: 'Drive vs 6:0 at 39\'. You lead 22:21. You take contact on the shooting arm/shoulder but stay balanced with feet under you and eyes on the far corner. The goalkeeper is still loading. Help is arriving late from the weak side. The pivot seal is not open.',
      hr: 'Prodor protiv 6:0 u 39. minuti. Vodite 22:21. Primaš kontakt na ruci/ramenu za šut, ali ostaješ u ravnoteži, noge ispod sebe, pogled na daleki kut. Vratar se još učitava. Pomoć stiže kasno sa slabe strane. Zatvaranje pivota nije otvoreno.',
      de: 'Durchbruch gegen 6:0 in Minute 39. Ihr führt 22:21. Du bekommst Kontakt am Wurfarm/Schulter, bleibst aber im Gleichgewicht, Füße unter dir, Blick auf die ferne Ecke. Der Torwart lädt noch. Hilfe kommt schwachseitig spät. Kreisläufer-Abdichtung ist nicht offen.',
    },
    question: {
      en: 'When do you still finish after contact?',
      hr: 'Kada ipak završavaš nakon kontakta?',
      de: 'Wann schließt du nach Kontakt trotzdem ab?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Shoot through/after contact while balanced — take the far corner before help arrives',
          hr: 'Šutiraj kroz/nakon kontakta dok si u ravnoteži — uzmi daleki kut prije nego stigne pomoć',
          de: 'Durch/nach Kontakt werfen solange Gleichgewicht — ferne Ecke vor der Hilfe',
        },
        feedback: {
          en: 'Correct — balance + open corner after contact is still a high-value finish.',
          hr: 'Točno — ravnoteža + otvoren kut nakon kontakta i dalje je visokovrijedan završetak.',
          de: 'Richtig — Gleichgewicht + offene Ecke nach Kontakt bleibt hochwertiger Abschluss.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'If balance breaks, short pass out to the centre back and reopen without forcing',
          hr: 'Ako izgubiš ravnotežu, kratko dodaj van na srednjeg vanjskog i ponovno otvori bez forsiranja',
          de: 'Wenn das Gleichgewicht kippt, kurz auf Rückraum Mitte raus und neu öffnen ohne Zwang',
        },
        feedback: {
          en: 'Good — correct rescue if balance fails; here balance is still there, so finish.',
          hr: 'Dobro — točan spas ako padne ravnoteža; ovdje je još tu, zato završi.',
          de: 'Gut — richtige Rettung wenn Gleichgewicht fällt; hier steht es noch, also abschließen.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force a wild shot while falling with no corner and no eyes on the goal',
          hr: 'Forsiraj divlji šut dok padaš bez kuta i bez pogleda na gol',
          de: 'Wilden Wurf im Fallen erzwingen ohne Ecke und ohne Blick zum Tor',
        },
        feedback: {
          en: 'Risky — contact without balance is when you stop, not when you heave.',
          hr: 'Rizično — kontakt bez ravnoteže je trenutak za stop, ne za bacanje.',
          de: 'Riskant — Kontakt ohne Gleichgewicht heißt stoppen, nicht hechten.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Stop and complain for a foul instead of using the open far corner you still own',
          hr: 'Stani i traži prekršaj umjesto da koristiš otvoreni daleki kut koji još držiš',
          de: 'Stoppen und Foul fordern statt die offene ferne Ecke zu nutzen, die du noch hast',
        },
        feedback: {
          en: 'Poor — you trade a makeable finish for a maybe-call while help arrives.',
          hr: 'Loše — mijenjaš ostvariv završetak za možda-presudu dok stiže pomoć.',
          de: 'Schlecht — du tauschst machbaren Abschluss gegen vielleicht-Pfiff, während Hilfe kommt.',
        },
      },
    ],
    explanation: {
      en: 'Cue: contact but still balanced, far corner open, help late. Finish through/after contact. Exit pass (B) only if balance breaks. Wild falling shots or stopping to plead for a foul waste the window.',
      hr: 'Signal: kontakt ali još ravnoteža, daleki kut otvoren, pomoć kasni. Završi kroz/nakon kontakta. Izlazni pas (B) samo ako padne ravnoteža. Divlji padajući šutevi ili stajanje zbog prekršaja bacaju prozor.',
      de: 'Signal: Kontakt, aber Gleichgewicht, ferne Ecke offen, Hilfe spät. Durch/nach Kontakt abschließen. Exit-Pass (B) nur wenn Gleichgewicht kippt. Wilde Fallwürfe oder Foul-Fordern verschenken das Fenster.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.4 },
  },

  {
    familyKey: 'lb_pivot_screen_shoot',
    title: {
      en: 'Left Back — Shoot Off Pivot Screen',
      hr: 'Lijevi vanjski — šut preko bloka pivota',
      de: 'Linker Rückraum — Wurf über Kreisläufer-Block',
    },
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 31,
    score: '19:18',
    defensiveSystem: '6-0',
    skillTags: ['screening', 'shotReading', 'angleSelection'],
    perception: false,
    numerical: '6v6',
    gameState: 'control_lead',
    situation: {
      en: '6:0 at 31\'. You lead 19:18. Your pivot sets a legal screen (blok) on your near defender — not a seal asking for the ball. The screen frees a half-step shooting lane over/around the contact. The goalkeeper is still mid-set. The wing is covered; no clean bounce lane into the pivot exists.',
      hr: 'Obrana 6:0 u 31. minuti. Vodite 19:18. Tvoj pivot postavlja pravilan blok na tvog bližeg braniča — nije zatvaranje koje traži loptu. Blok oslobađa pola koraka linije šuta preko/oko kontakta. Vratar je još u sredini postave. Krilo je pokriveno; nema čistog odskočnog prolaza u pivota.',
      de: '6:0 in Minute 31. Ihr führt 19:18. Dein Kreisläufer setzt einen legalen Block auf deinen Nahverteidiger — keine Abdichtung, die den Ball fordert. Der Block öffnet eine halbe Schritt-Wurfbahn über/um den Kontakt. Der Torwart ist noch mittig gesetzt. Außen ist zugestellt; keine saubere Bounce-Gasse zum Kreisläufer.',
    },
    question: {
      en: 'How do you use a pivot screen that is not a seal?',
      hr: 'Kako koristiš blok pivota koji nije zatvaranje?',
      de: 'Wie nutzt du einen Kreisläufer-Block, der keine Abdichtung ist?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Shoot over/around the screen into the freed half-step lane',
          hr: 'Šutiraj preko/oko bloka u oslobođenu liniju od pola koraka',
          de: 'Über/um den Block in die freigemachte Halbschritt-Bahn werfen',
        },
        feedback: {
          en: 'Correct — screen value is your shot lane, not a pass into the screener.',
          hr: 'Točno — vrijednost bloka je tvoja linija šuta, ne pas u onog tko blokira.',
          de: 'Richtig — Blockwert ist deine Wurfbahn, nicht der Pass auf den Blocker.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'One short fake off the screen edge, then shoot the same freed corner',
          hr: 'Jedna kratka finta s ruba bloka, pa šut u isti oslobođeni kut',
          de: 'Kurze Finte an der Blockkante, dann in dieselbe freie Ecke werfen',
        },
        feedback: {
          en: 'Good — works if the defender peeks; direct shot off the screen is cleaner.',
          hr: 'Dobro — radi ako branič zaviruje; izravan šut s bloka čišći je.',
          de: 'Gut — geht, wenn der Verteidiger guckt; direkter Wurf vom Block ist sauberer.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force a bounce into the screening pivot with no seal and no lane',
          hr: 'Forsiraj odskočno na pivota koji blokira bez zatvaranja i bez prolaza',
          de: 'Bounce auf den blockenden Kreisläufer erzwingen ohne Abdichtung und ohne Gasse',
        },
        feedback: {
          en: 'Risky — that treats a screen like a seal-feed; the lane is not there.',
          hr: 'Rizično — tretiraš blok kao dodavanje u zatvaranje; prolaza nema.',
          de: 'Riskant — du behandelst Block wie Abdichtungspass; die Gasse fehlt.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Ignore the screen and restart wide while the half-step lane is open',
          hr: 'Ignoriraj blok i kreni široko ispočetka dok je linija od pola koraka otvorena',
          de: 'Block ignorieren und breit neu starten, während die Halbschritt-Bahn offen ist',
        },
        feedback: {
          en: 'Poor — you waste the exact advantage the pivot screen created for your shot.',
          hr: 'Loše — bacaš upravo prednost koju ti je blok pivota stvorio za šut.',
          de: 'Schlecht — du verschenkst genau den Vorteil, den der Kreisläufer-Block für deinen Wurf schafft.',
        },
      },
    ],
    explanation: {
      en: 'Cue: legal pivot screen (not a seal), half-step shot lane open, no bounce lane. Shoot over/around the screen. Short fake (B) is second. Forcing a pass into the screener or restarting wastes screen value — this is not a seal-feed.',
      hr: 'Signal: pravilan blok pivota (ne zatvaranje), linija šuta od pola koraka otvorena, nema odskočnog prolaza. Šutiraj preko/oko bloka. Kratka finta (B) je druga. Forsiranje pasa u onog tko blokira ili restart baca vrijednost bloka — ovo nije dodavanje u zatvaranje.',
      de: 'Signal: legaler Kreisläufer-Block (keine Abdichtung), Halbschritt-Wurfbahn offen, keine Bounce-Gasse. Über/um den Block werfen. Kurze Finte (B) ist zweitens. Pass auf den Blocker oder Neustart verschenkt den Block — das ist kein Abdichtungspass.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.25 },
  },

  {
    familyKey: 'lb_pass_lane_blocked_switch',
    title: {
      en: 'Left Back — Blocked Pivot Lane, Switch Side',
      hr: 'Lijevi vanjski — zatvoren prolaz do pivota, promjena strane',
      de: 'Linker Rückraum — gesperrte Kreisläufergasse, Seite wechseln',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 44,
    score: '24:24',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'pressureDecisions', 'tempo'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: {
      en: 'Tied 24:24 at 44\' vs compact 6:0. The pivot has a seal on the far half, but your near defender and the centre have closed the bounce lane with high hands — the pass to the pivot is blocked for this tempo. The centre back is free one short pass to your right; the far wing is starting to open after the close.',
      hr: 'Neriješeno je 24:24 u 44. minuti protiv zbijene 6:0. Pivot ima zatvaranje na dalekom polu, ali tvoj bliži branič i sredina zatvorili su odskočni prolaz dignutim rukama — pas na pivota blokiran je za ovo tempo. Srednji vanjski je slobodan jedno kratko dodavanje desno; daleko krilo počinje se otvarati nakon zatvaranja.',
      de: 'Unentschieden 24:24 in Minute 44 gegen kompakte 6:0. Der Kreisläufer hat Abdichtung am fernen Halben, aber dein Nahverteidiger und die Mitte haben die Bounce-Gasse mit hohen Händen zu — der Pass ist für dieses Tempo gesperrt. Rückraum Mitte ist einen kurzen Pass rechts frei; der ferne Außen öffnet sich nach dem Zulaufen.',
    },
    question: {
      en: 'What do you do when the lane to the sealed pivot is blocked?',
      hr: 'Što radiš kad je prolaz do zatvorenog pivota blokiran?',
      de: 'Was tust du, wenn die Gasse zum abgedichteten Kreisläufer gesperrt ist?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Change side early through the free centre back; do not force the blocked lane',
          hr: 'Rano promijeni stranu preko slobodnog srednjeg vanjskog; nemoj forsirati blokirani prolaz',
          de: 'Früh über freien Rückraum Mitte die Seite wechseln; gesperrte Gasse nicht erzwingen',
        },
        feedback: {
          en: 'Correct — blocked lane means switch; the seal stays valuable after the ball moves.',
          hr: 'Točno — blokirani prolaz znači promjenu strane; zatvaranje ostaje vrijedno nakon pomaka lopte.',
          de: 'Richtig — gesperrte Gasse heißt Seitenwechsel; die Abdichtung bleibt nach Ballbewegung wertvoll.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Short drive fake to drop the high hands, then bounce only if a real lane flashes',
          hr: 'Kratka finta prodora da spustiš dignute ruke, pa odskočno samo ako bljesne pravi prolaz',
          de: 'Kurze Durchbruchfinte, hohe Hände senken, Bounce nur wenn wirklich eine Gasse blitzt',
        },
        feedback: {
          en: 'Good — only if hands truly drop; default remains early switch to CB.',
          hr: 'Dobro — samo ako ruke stvarno padnu; default ostaje rana promjena na SV.',
          de: 'Gut — nur wenn Hände wirklich fallen; Default bleibt früher Wechsel auf RM.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force the bounce through both high-handed defenders into the seal',
          hr: 'Forsiraj odskočno kroz oba braniča s dignutim rukama u zatvaranje',
          de: 'Bounce durch beide Verteidiger mit hohen Händen in die Abdichtung erzwingen',
        },
        feedback: {
          en: 'Risky — that is the interception the defence just invited.',
          hr: 'Rizično — to je presjekanje koje je obrana upravo pozvala.',
          de: 'Riskant — genau die Interception, zu der die Abwehr gerade einlädt.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Hold and wait at eleven metres hoping the lane reopens without moving the ball',
          hr: 'Drži i čekaj na jedanaest metara u nadi da se prolaz sam otvori bez pomaka lopte',
          de: 'Auf elf Metern halten und hoffen, dass die Gasse ohne Ballbewegung wieder aufgeht',
        },
        feedback: {
          en: 'Poor — without a switch the closed lane stays closed and tempo dies.',
          hr: 'Loše — bez promjene strane zatvoreni prolaz ostaje zatvoren i tempo umire.',
          de: 'Schlecht — ohne Wechsel bleibt die Gasse zu und das Tempo stirbt.',
        },
      },
    ],
    explanation: {
      en: 'Cue: seal exists but high hands block the bounce lane; CB free. Switch early through CB. Fake then bounce (B) only if hands drop. Forcing through or waiting wastes the seal and invites the steal.',
      hr: 'Signal: zatvaranje postoji, ali dignute ruke blokiraju odskočni prolaz; SV slobodan. Rano promijeni stranu preko SV. Finta pa odskočno (B) samo ako ruke padnu. Forsiranje ili čekanje baca zatvaranje i zove oduzimanje.',
      de: 'Signal: Abdichtung da, hohe Hände sperren Bounce; RM frei. Früh über RM wechseln. Finte dann Bounce (B) nur wenn Hände fallen. Erzwingen oder Warten verschenkt die Abdichtung und lädt den Steal ein.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.12 },
  },

  {
    familyKey: 'lb_pivot_behind_defender',
    title: {
      en: 'Left Back — Early Bounce to Pivot Behind',
      hr: 'Lijevi vanjski — rano odskočno na pivota iza braniča',
      de: 'Linker Rückraum — früher Bounce auf Kreisläufer hinter dem Verteidiger',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 36,
    score: '20:20',
    defensiveSystem: '6-0',
    skillTags: ['screening', 'defensiveReading', 'tempo'],
    perception: false,
    numerical: '6v6',
    gameState: 'none',
    situation: {
      en: 'Tied 20:20 at 36\' vs 6:0. Your near defender steps out on you. Behind him, the pivot sneaks a half-step into the shadow between defender and goal — not a full frontal seal, a sneak behind. The bounce lane is open for one tempo. Help from the centre is late; the wing is covered.',
      hr: 'Neriješeno je 20:20 u 36. minuti protiv 6:0. Tvoj bliži branič izlazi na tebe. Iza njega pivot ulazi pola koraka u sjenu između braniča i gola — nije puno čeono zatvaranje, nego ulazak iza. Odskočni prolaz otvoren je za jedno tempo. Pomoć iz sredine kasni; krilo je pokriveno.',
      de: 'Unentschieden 20:20 in Minute 36 gegen 6:0. Dein Nahverteidiger tritt auf dich heraus. Hinter ihm schleicht der Kreisläufer einen halben Schritt in den Schatten zwischen Verteidiger und Tor — keine volle Frontabdichtung, ein Hinterlaufen. Bounce-Gasse ist ein Tempo offen. Hilfe aus der Mitte spät; Außen zugestellt.',
    },
    question: {
      en: 'When the pivot sneaks behind, when do you release?',
      hr: 'Kad pivot uđe iza, kada ispuštaš dodavanje?',
      de: 'Wann spielst du ab, wenn der Kreisläufer hinterläuft?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Early bounce into the shadow behind the defender before help closes',
          hr: 'Rano odskočno u sjenu iza braniča prije nego pomoć zatvori',
          de: 'Früher Bounce in den Schatten hinter dem Verteidiger, bevor Hilfe schließt',
        },
        feedback: {
          en: 'Correct — sneak-behind value lasts one tempo; early bounce beats waiting for a perfect seal.',
          hr: 'Točno — vrijednost ulaska iza traje jedno tempo; rano odskočno bije čekanje savršenog zatvaranja.',
          de: 'Richtig — Hinterlaufen hält ein Tempo; früher Bounce schlägt Warten auf perfekte Abdichtung.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'If the bounce lane closes, shoot the gap the stepping defender just left',
          hr: 'Ako se odskočni prolaz zatvori, šutiraj u prostor koji je izašli branič ostavio',
          de: 'Wenn die Bounce-Gasse zu ist, in die Lücke werfen, die der heraustretende Verteidiger lässt',
        },
        feedback: {
          en: 'Good — backup when help kills the bounce; first punish remains the early ball behind.',
          hr: 'Dobro — rezerva kad pomoć ubije odskočno; prva kazna ostaje rana lopta iza.',
          de: 'Gut — Reserve wenn Hilfe den Bounce tötet; erste Bestrafung bleibt der frühe Ball hinter.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Hold an extra fake waiting for a louder call while the shadow closes',
          hr: 'Drži dodatnu fintu čekajući glasniji poziv dok se sjena zatvara',
          de: 'Extra-Finte halten und auf lauteren Ruf warten, während der Schatten schließt',
        },
        feedback: {
          en: 'Risky — late release turns a sneak-behind into a contested fifty-fifty.',
          hr: 'Rizično — kasno ispuštanje pretvara ulazak iza u otežan fifty-fifty.',
          de: 'Riskant — spätes Abspiel macht aus dem Hinterlaufen ein umkämpftes Fifty-fifty.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Lob a high pass over the stepping defender into the goalkeeper\'s reach',
          hr: 'Visoko dodavanje preko izašlog braniča u doseg vratara',
          de: 'Hohen Pass über den heraustretenden Verteidiger in Reichweite des Torwarts',
        },
        feedback: {
          en: 'Poor — high lobs from nine are goalkeeper gifts; the value was the early bounce.',
          hr: 'Loše — visoki lobovi s devet poklon su vrataru; vrijednost je bilo rano odskočno.',
          de: 'Schlecht — hohe Lobs von neun sind Torwart-Geschenke; der Wert war der frühe Bounce.',
        },
      },
    ],
    explanation: {
      en: 'Cue: defender steps out, pivot sneaks a half-step behind into the shadow, bounce open one tempo. Release early. Shot into the step gap (B) if bounce dies. Extra fake or high lob wastes the sneak.',
      hr: 'Signal: branič izlazi, pivot ulazi pola koraka iza u sjenu, odskočno otvoreno jedno tempo. Ispusti rano. Šut u prostor izlaska (B) ako odskočno umre. Dodatna finta ili visoki lob baca ulazak iza.',
      de: 'Signal: Verteidiger heraustreten, Kreisläufer halb hinter in den Schatten, Bounce ein Tempo offen. Früh abspielen. Wurf in die Schrittlücke (B) wenn Bounce stirbt. Extra-Finte oder hoher Lob verschenkt das Hinterlaufen.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: -0.3 },
  },

  {
    familyKey: 'lb_2v2_with_pivot',
    title: {
      en: 'Left Back — 2v2 Read with Pivot',
      hr: 'Lijevi vanjski — čitanje 2 na 2 s pivotom',
      de: 'Linker Rückraum — 2-gegen-2-Lesart mit Kreisläufer',
    },
    difficulty: 'Expert',
    pressureLevel: 'Critical',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 52,
    score: '28:27',
    defensiveSystem: '6-0',
    skillTags: ['defensiveReading', 'screening', 'pressureDecisions', 'perception'],
    perception: false,
    numerical: '6v6',
    gameState: 'lead_late',
    situation: {
      en: 'You lead 28:27 at 52\'. On the left you and the pivot face two defenders in a true 2v2 — the rest of the defence is stretched weak side. The near defender shades you; the low defender shades the pivot. Neither has help for one full tempo. You receive with options: bind the high, play the seal, or punish a switch.',
      hr: 'Vodite 28:27 u 52. minuti. Lijevo ti i pivot igrate pravi 2 na 2 protiv dva braniča — ostatak obrane rastegnut je na slaboj strani. Bliži branič pokriva tebe; donji pokriva pivota. Nijedan nema pomoć za jedno puno tempo. Primaš s opcijama: veži visokog, odigraj zatvaranje ili kazni preuzimanje.',
      de: 'Ihr führt 28:27 in Minute 52. Links habt ihr als Rückraum und Kreisläufer echtes 2 gegen 2 — Rest der Abwehr schwachseitig gestreckt. Der Nahe schattet dich; der Untere den Kreisläufer. Keiner hat ein volles Tempo Hilfe. Du bekommst mit Optionen: Hohen binden, Abdichtung spielen oder Übernahme bestrafen.',
    },
    question: {
      en: 'What is the first read in a true 2v2 with the pivot?',
      hr: 'Što je prvo čitanje u pravom 2 na 2 s pivotom?',
      de: 'Was ist die erste Lesart im echten 2 gegen 2 mit Kreisläufer?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Bind your defender, read whether they switch or stay — then attack the freed man (you or pivot)',
          hr: 'Veži svog braniča, pročitaj ostaju li ili preuzimaju — zatim napadni oslobođenog (tebe ili pivota)',
          de: 'Deinen Verteidiger binden, bleiben oder Übernahme lesen — dann den Freien angreifen (dich oder Kreisläufer)',
        },
        feedback: {
          en: 'Correct — 2v2 starts with bind + switch/stay read; that decides shot vs early bounce.',
          hr: 'Točno — 2 na 2 počinje vezivanjem + čitanjem preuzimanja/ostajanja; to odlučuje šut ili rano odskočno.',
          de: 'Richtig — 2 gegen 2 beginnt mit Binden + Bleiben/Übernahme; das entscheidet Wurf oder früher Bounce.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'If they both collapse on you, release early to the pivot before the double sets',
          hr: 'Ako se oboje sruše na tebe, rano odigraj na pivota prije nego se udvajanje postavi',
          de: 'Wenn beide auf dich klappen, früh auf den Kreisläufer bevor die Verdopplung steht',
        },
        feedback: {
          en: 'Good — punishes collapse; still secondary to the bind-and-read first step.',
          hr: 'Dobro — kažnjava urušavanje; i dalje sekundarno uz prvi korak veži-i-čitaj.',
          de: 'Gut — bestraft Klappen; bleibt zweitrangig zum ersten Schritt Binden-und-Lesen.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Shoot immediately without binding, while both defenders are still set on their men',
          hr: 'Šutiraj odmah bez vezivanja, dok su oba braniča još postavljena na svojim ljudima',
          de: 'Sofort werfen ohne zu binden, während beide Verteidiger noch auf ihren Leuten stehen',
        },
        feedback: {
          en: 'Risky — no bind means no forced error; you shoot into two set defenders.',
          hr: 'Rizično — bez vezivanja nema prisiljene greške; šutiraš u dva postavljena braniča.',
          de: 'Riskant — ohne Binden kein erzwungener Fehler; du wirfst in zwei stehende Verteidiger.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Swing away from the 2v2 to the weak side without threatening either defender',
          hr: 'Prebaci loptu sa 2 na 2 na slabu stranu bez prijetnje ijednom braniču',
          de: 'Vom 2 gegen 2 auf die schwache Seite schwingen, ohne einen Verteidiger zu bedrohen',
        },
        feedback: {
          en: 'Poor — you abandon a true 2v2 surplus the rest of the defence already gifted you.',
          hr: 'Loše — napuštaš pravi višak 2 na 2 koji ti je ostatak obrane već poklonio.',
          de: 'Schlecht — du verlässt echten 2-gegen-2-Vorteil, den der Rest der Abwehr schon schenkt.',
        },
      },
    ],
    explanation: {
      en: 'Cue: true left-side 2v2, help a full tempo away. First bind your man and read switch vs stay — then attack the freed player. Early bounce on collapse (B) is second. Blind shot or swinging away wastes the surplus.',
      hr: 'Signal: pravi 2 na 2 lijevo, pomoć puno tempo daleko. Prvo veži svog i čitaj preuzimanje ili ostajanje — zatim napadni oslobođenog. Rano odskočno na urušavanje (B) je druga opcija. Slijepi šut ili bijeg na slabu stranu baca višak.',
      de: 'Signal: echtes 2 gegen 2 links, Hilfe ein Tempo weg. Zuerst binden und Übernahme/Bleiben lesen — dann den Freien. Früher Bounce bei Klappen (B) ist zweitens. Blindwurf oder Wegschwingen verschenkt den Vorteil.',
    },
    human: { singleBestOk: true, cueSpecific: true, gameStateExplicit: true, rubricBias: 0.18 },
  },
];
