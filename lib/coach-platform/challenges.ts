import type { CoachChallenge, CoachChallengeCategory } from './types';
import { COACH_CHALLENGES_EXTRA } from './challenges-extra';
import { scoreTextForTacticalPrefs } from '@/lib/platform/tactical-systems';

const L = (en: string, hr: string, de: string) => ({ en, hr, de });

/** Structured coach-development scenarios (EN / HR / DE). */
const COACH_CHALLENGES_BASE: CoachChallenge[] = [
  {
    id: 'coach-timeout-1',
    category: 'timeout',
    difficulty: 'Intermediate',
    coachTypeTags: ['Youth Coach', 'Senior Coach', 'Head Coach', 'Assistant Coach'],
    experienceTags: ['0-2', '3-5', '6-10', '10+'],
    situation: L(
      'Your team trails by 2 with 4:20 left. The opponent runs a sharp 5:1 and keeps stealing your first pass. Players look rushed.',
      'Vaša ekipa gubi za 2 s 4:20 do kraja. Protivnik igra oštru 5:1 i krade prvi pas. Igrači izgledaju ubrzano.',
      'Euer Team liegt 2 Tore zurück, noch 4:20. Der Gegner spielt aggressives 5:1 und stiehlt den ersten Pass. Die Spieler wirken hektisch.',
    ),
    question: L(
      'What is the best timeout use?',
      'Kako najbolje iskoristiti timeout?',
      'Wie nutzt du den Timeout am besten?',
    ),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Calm the group, set one clear first-pass option against 5:1, and name the next two attacks',
          'Smiri ekipu, odredi jednu jasnu opciju prvog pasa protiv 5:1 i imenuj sljedeća dva napada',
          'Gruppe beruhigen, eine klare erste Passoption gegen 5:1 festlegen und die nächsten zwei Angriffe benennen',
        ),
        feedback: L(
          'Best — timeout buys composure and one executable plan.',
          'Najbolje — timeout donosi smirenje i jedan izvediv plan.',
          'Beste Wahl — Timeout schafft Ruhe und einen klaren Plan.',
        ),
      },
      {
        id: 'b',
        quality: 'good',
        text: L(
          'Only motivate emotionally and send them back out',
          'Samo emocionalno motivirati i vratiti ih na teren',
          'Nur emotional motivieren und wieder rausschicken',
        ),
        feedback: L(
          'Motivation helps, but without a tactical fix the 5:1 will keep winning.',
          'Motivacija pomaže, ali bez taktičkog rješenja 5:1 i dalje pobjeđuje.',
          'Motivation hilft, ohne taktische Lösung gewinnt weiter das 5:1.',
        ),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L(
          'Change three roles at once and invent a new system',
          'Promijeniti tri uloge odjednom i izmisliti novi sustav',
          'Drei Rollen gleichzeitig ändern und ein neues System erfinden',
        ),
        feedback: L(
          'Too much change under pressure usually creates more turnovers.',
          'Previše promjena pod pritiskom obično stvara još više grešaka.',
          'Zu viele Änderungen unter Druck erzeugen meist mehr Fehler.',
        ),
      },
      {
        id: 'd',
        quality: 'poor',
        text: L(
          'Blame the pivot publicly for the last two turnovers',
          'Javno okriviti pivota za posljednja dva gubitka lopte',
          'Den Kreisläufer öffentlich für die letzten zwei Ballverluste verantwortlich machen',
        ),
        feedback: L(
          'Public blame destroys trust and wastes the timeout.',
          'Javno optuživanje ruši povjerenje i troši timeout.',
          'Öffentliche Schuldzuweisung zerstört Vertrauen und vergeudet den Timeout.',
        ),
      },
    ],
    explanation: L(
      'Late-game timeouts should restore composure and give one clear tactical answer to the opponent’s pressure.',
      'Timeout kasno u utakmici treba vratiti smirenje i dati jedan jasan taktički odgovor na pritisak.',
      'Späte Timeouts müssen Ruhe bringen und eine klare taktische Antwort auf den Druck liefern.',
    ),
  },
  {
    id: 'coach-defence-1',
    category: 'defensive_adjustment',
    difficulty: 'Advanced',
    coachTypeTags: ['Senior Coach', 'Head Coach', 'Professional Coach', 'Assistant Coach'],
    experienceTags: ['3-5', '6-10', '10+'],
    situation: L(
      'Opponent centre back is dominating your flat 6:0 with jump shots from 9m. Your wings are unused in attack.',
      'Protivnički srednji vanjski dominira vašu ravnu 6:0 skok-šutovima s 9m. Vaša krila su neiskorištena u napadu.',
      'Der gegnerische Rückraummitte dominiert euer flaches 6:0 mit Sprungwürfen von 9m. Eure Flügel sind im Angriff ungenutzt.',
    ),
    question: L(
      'Best defensive adjustment?',
      'Najbolja obrambena prilagodba?',
      'Beste defensive Anpassung?',
    ),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Shift to a controlled 5:1, pressure the shooter early, and protect the pivot lane',
          'Prijeći na kontroliranu 5:1, ranije pritisnuti šutera i štititi liniju pivota',
          'Kontrolliertes 5:1, den Werfer früher stören und die Kreisläufergasse schützen',
        ),
        feedback: L(
          'Correct — changing the shot rhythm forces a new decision.',
          'Točno — promjena ritma šuta forsira novu odluku.',
          'Richtig — verändertes Wurfrhythmus zwingt zu neuen Entscheidungen.',
        ),
      },
      {
        id: 'b',
        quality: 'good',
        text: L(
          'Stay in 6:0 but raise arms and close the middle gap',
          'Ostati u 6:0 ali podići ruke i zatvoriti srednji prostor',
          'Im 6:0 bleiben, Arme hoch und Mittelraum schließen',
        ),
        feedback: L(
          'Reasonable short-term patch, but the shooter still has time.',
          'Razumna kratkoročna zakrpa, ali šuter i dalje ima vremena.',
          'Kurzfristig sinnvoll, aber der Werfer behält Zeit.',
        ),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L(
          'Switch immediately to full-court press',
          'Odmah prijeći na press cijelog terena',
          'Sofort auf Ganzfeldpress umstellen',
        ),
        feedback: L(
          'Risky without training — can open easy fast-break goals.',
          'Rizično bez pripreme — može otvoriti lake kontriranja.',
          'Riskant ohne Vorbereitung — öffnet leichte Tempogegenstöße.',
        ),
      },
      {
        id: 'd',
        quality: 'poor',
        text: L(
          'Drop deeper and concede all 9m shots',
          'Povući se dublje i prepustiti sve šuteve s 9m',
          'Tiefer stehen und alle 9m-Würfe freigeben',
        ),
        feedback: L(
          'Poor — you are inviting the exact shot that is beating you.',
          'Loše — pozivate upravo šut koji vas pobjeđuje.',
          'Schlecht — genau der Wurf, der euch schlägt, wird freigegeben.',
        ),
      },
    ],
    explanation: L(
      'When one backcourt threat owns a flat defence, change the first contact and shot timing rather than hoping for better luck.',
      'Kad jedan vanjski dominira ravnu obranu, promijeni prvi kontakt i timing šuta umjesto nade u sreću.',
      'Wenn ein Rückraumspieler die flache Abwehr beherrscht, ändere Erstkontakt und Wurftiming statt auf Glück zu hoffen.',
    ),
  },
  {
    id: 'coach-sub-1',
    category: 'substitution',
    difficulty: 'Intermediate',
    coachTypeTags: ['Youth Coach', 'Senior Coach', 'Head Coach', 'Assistant Coach'],
    experienceTags: ['0-2', '3-5', '6-10', '10+'],
    situation: L(
      'Your left back has missed three decisions and looks frustrated. Bench left back is fresh and tactically sharp today.',
      'Lijevi vanjski je promašio tri odluke i izgleda frustrirano. Klupa ima svježeg i taktički oštrog lijevog vanjskog.',
      'Euer Linksaußenrückraum hat drei Entscheidungen verfehlt und wirkt frustriert. Der Ersatz ist frisch und taktisch klar.',
    ),
    question: L(
      'Best substitution timing?',
      'Najbolji timing zamjene?',
      'Bestes Wechsel-Timing?',
    ),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Change on the next dead ball, brief the substitute on one task, keep communication respectful',
          'Zamijeniti na sljedećoj mrtvoj lopti, brzo zadati jedan zadatak i zadržati poštovanje',
          'Beim nächsten Totball wechseln, eine klare Aufgabe geben, respektvoll kommunizieren',
        ),
        feedback: L(
          'Best — decisive, clear, and protects the player’s dignity.',
          'Najbolje — odlučno, jasno i štiti dostojanstvo igrača.',
          'Beste Wahl — klar, entschlossen und würdevoll.',
        ),
      },
      {
        id: 'b',
        quality: 'good',
        text: L(
          'Wait one more attack then change',
          'Pričekati još jedan napad pa zamijeniti',
          'Noch einen Angriff abwarten, dann wechseln',
        ),
        feedback: L(
          'Acceptable if you need one reset cue — don’t wait longer.',
          'Prihvatljivo ako treba jedan reset — ne čekaj dulje.',
          'Akzeptabel für einen Reset — nicht länger warten.',
        ),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L(
          'Shout the change during active play and leave them confused',
          'Vikati zamjenu usred igre i ostaviti ih zbunjene',
          'Während des laufenden Spiels den Wechsel schreien und Verwirrung erzeugen',
        ),
        feedback: L(
          'Creates chaos and often a foul or empty lane.',
          'Stvara kaos i često prekršaj ili praznu liniju.',
          'Erzeugt Chaos und oft Foul oder freie Gasse.',
        ),
      },
      {
        id: 'd',
        quality: 'poor',
        text: L(
          'Leave them on to “teach a lesson” despite the match state',
          'Ostaviti ih na terenu da “nauče lekciju” unatoč stanju utakmice',
          'Drinlassen, um eine „Lehre“ zu erteilen, trotz Spielstand',
        ),
        feedback: L(
          'Poor leadership — the team needs the best available decision-maker now.',
          'Loše vodstvo — ekipi treba najbolji dostupni donositelj odluka sada.',
          'Schlechte Führung — das Team braucht jetzt den besten Entscheider.',
        ),
      },
    ],
    explanation: L(
      'Substitutions should protect the team’s decision quality while keeping player relationships intact.',
      'Zamjene trebaju štititi kvalitetu odluka ekipe i očuvati odnos s igračem.',
      'Wechsel schützen die Entscheidungsqualität und die Beziehung zum Spieler.',
    ),
  },
  {
    id: 'coach-plan-1',
    category: 'training_plan',
    difficulty: 'Beginner',
    coachTypeTags: ['Youth Coach', 'Senior Coach', 'Assistant Coach', 'Goalkeeper Coach'],
    experienceTags: ['0-2', '3-5', '6-10', '10+'],
    situation: L(
      'You have 75 minutes with U16. Last match showed weak transition defence after missed shots.',
      'Imaš 75 minuta s U16. Zadnja utakmica pokazala slabu tranzicijsku obranu nakon promašenih šuteva.',
      '75 Minuten mit U16. Letztes Spiel: schwache Transitionsabwehr nach Fehlwürfen.',
    ),
    question: L(
      'Best session structure priority?',
      'Najbolji prioritet strukture treninga?',
      'Beste Priorität für die Einheit?',
    ),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Warm-up into two transition blocks, then a conditioned game rewarding early defence',
          'Zagrijavanje, dva tranzicijska bloka, zatim uvjetovana igra koja nagrađuje ranu obranu',
          'Aufwärmen, zwei Transitionsblöcke, dann konditioniertes Spiel mit Fokus frühe Abwehr',
        ),
        feedback: L(
          'Correct — the plan mirrors the match problem with enough reps.',
          'Točno — plan zrcali problem utakmice s dovoljno ponavljanja.',
          'Richtig — der Plan spiegelt das Spielproblem mit genug Wiederholungen.',
        ),
      },
      {
        id: 'b',
        quality: 'good',
        text: L(
          'Long physical circuit, short tactical talk at the end',
          'Dugi fizički krug, kratki taktički razgovor na kraju',
          'Langer Athletikblock, kurze Taktikansprache am Ende',
        ),
        feedback: L(
          'Fitness helps, but the decision problem needs live reps.',
          'Kondicija pomaže, ali problem odluka treba žive ponavljanja.',
          'Fitness hilft, aber das Entscheidungsproblem braucht Live-Wiederholungen.',
        ),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L(
          'Only shooting contest for motivation',
          'Samo natjecanje u šutu radi motivacije',
          'Nur Wurf-Wettkampf zur Motivation',
        ),
        feedback: L(
          'Fun, but ignores the identified match weakness.',
          'Zabavno, ali ignorira identificiranu slabost.',
          'Macht Spaß, ignoriert aber die erkannte Schwäche.',
        ),
      },
      {
        id: 'd',
        quality: 'poor',
        text: L(
          'Lecture for 40 minutes without balls',
          'Predavanje 40 minuta bez lopti',
          '40 Minuten Vortrag ohne Bälle',
        ),
        feedback: L(
          'Youth players need action-linked learning, not a long lecture.',
          'Mladi igrači trebaju učenje kroz akciju, ne dugo predavanje.',
          'Jugendspieler brauchen handlungsnahes Lernen, keinen langen Vortrag.',
        ),
      },
    ],
    explanation: L(
      'Training plans should attack the latest match problem with clear blocks and measurable behaviour.',
      'Plan treninga treba napasti problem zadnje utakmice jasnim blokovima i mjerljivim ponašanjem.',
      'Trainingspläne müssen das letzte Spielproblem mit klaren Blöcken und messbarem Verhalten angehen.',
    ),
  },
  {
    id: 'coach-pdev-1',
    category: 'player_development',
    difficulty: 'Advanced',
    coachTypeTags: ['Youth Coach', 'Senior Coach', 'Head Coach', 'Professional Coach'],
    experienceTags: ['3-5', '6-10', '10+'],
    situation: L(
      'A talented pivot avoids contact and rarely screens. Decision scores in training are low on timing.',
      'Talentirani pivot izbjegava kontakt i rijetko blokira. Na treningu su odluke o timingu slabe.',
      'Ein talentierter Kreisläufer vermeidet Kontakt und blockt selten. Timing-Entscheidungen im Training sind schwach.',
    ),
    question: L(
      'Best development decision?',
      'Najbolja razvojna odluka?',
      'Beste Entwicklungsentscheidung?',
    ),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Set a 3-week focus: contact screening drills, filmed reps, and one match KPI',
          'Postaviti 3-tjedni fokus: vježbe kontaktnog bloka, snimljene ponavljanja i jedan KPI na utakmici',
          '3-Wochen-Fokus: Kontaktblock-Drills, gefilmte Wiederholungen und eine Spiel-KPI',
        ),
        feedback: L(
          'Best — specific, time-bound, and measurable.',
          'Najbolje — konkretno, vremenski ograničeno i mjerljivo.',
          'Beste Wahl — konkret, befristet und messbar.',
        ),
      },
      {
        id: 'b',
        quality: 'good',
        text: L(
          'Give general encouragement to be more aggressive',
          'Općenito ohrabriti da bude agresivniji',
          'Allgemein zu mehr Aggressivität ermutigen',
        ),
        feedback: L(
          'Supportive, but too vague to change behaviour.',
          'Podržavajuće, ali previše neodređeno za promjenu ponašanja.',
          'Unterstützend, aber zu unkonkret für Verhaltensänderung.',
        ),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L(
          'Move them to wing permanently this week',
          'Ove sedmice ih trajno premjestiti na krilo',
          'Diese Woche dauerhaft auf den Flügel stellen',
        ),
        feedback: L(
          'Avoids the skill gap instead of developing it.',
          'Izbjegava jaz u vještini umjesto razvoja.',
          'Umgeht die Lücke statt sie zu entwickeln.',
        ),
      },
      {
        id: 'd',
        quality: 'poor',
        text: L(
          'Bench them until they “want it more” with no plan',
          'Staviti na klupu dok “ne požele više” bez plana',
          'Auf die Bank setzen, bis sie „mehr wollen“, ohne Plan',
        ),
        feedback: L(
          'Punishment without a plan is not development.',
          'Kazna bez plana nije razvoj.',
          'Strafe ohne Plan ist keine Entwicklung.',
        ),
      },
    ],
    explanation: L(
      'Player development needs a clear skill target, practice design, and a simple match measure.',
      'Razvoj igrača treba jasan cilj vještine, dizajn vježbe i jednostavnu mjeru na utakmici.',
      'Spielerentwicklung braucht klares Ziel, Übungsdesign und einfache Spielmessung.',
    ),
  },
  {
    id: 'coach-opp-1',
    category: 'opponent_analysis',
    difficulty: 'Advanced',
    coachTypeTags: ['Senior Coach', 'Head Coach', 'Professional Coach', 'Assistant Coach'],
    experienceTags: ['3-5', '6-10', '10+'],
    situation: L(
      'Next opponent scores 40% of goals from the right wing after a cross. Their 6:0 is passive on the weak side.',
      'Sljedeći protivnik postiže 40% golova s desnog krila nakon križanja. Njihova 6:0 je pasivna na slaboj strani.',
      'Nächster Gegner erzielt 40% der Tore vom rechten Flügel nach Kreuzung. Ihr 6:0 ist auf der schwachen Seite passiv.',
    ),
    question: L(
      'Best preparation focus?',
      'Najbolji fokus pripreme?',
      'Bester Vorbereitungsfokus?',
    ),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Train denial of the cross trigger and attack their weak-side gap in the first wave',
          'Trenirati sprečavanje okidača križanja i napadati njihov slabobočni prostor u prvom valu',
          'Kreuzungsauslöser verhindern und die schwache Seite in der ersten Welle angreifen',
        ),
        feedback: L(
          'Correct — prepare both sides of the ball around the same pattern.',
          'Točno — pripremi obje strane lopte oko istog obrasca.',
          'Richtig — beide Ballseiten um dasselbe Muster vorbereiten.',
        ),
      },
      {
        id: 'b',
        quality: 'good',
        text: L(
          'Only show video of their wing goals',
          'Samo pokazati video njihovih krilnih golova',
          'Nur Video ihrer Flügeltore zeigen',
        ),
        feedback: L(
          'Useful awareness, but players need rehearsed responses.',
          'Korisna svijest, ali igrači trebaju uvježbane odgovore.',
          'Nützlich, aber Spieler brauchen geübte Antworten.',
        ),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L(
          'Ignore their pattern and trust talent',
          'Ignorirati njihov obrazac i vjerovati talentu',
          'Muster ignorieren und auf Talent vertrauen',
        ),
        feedback: L(
          'Leaves a known 40% threat unaddressed.',
          'Ostavlja poznatu prijetnju od 40% neriješenom.',
          'Lässt eine bekannte 40%-Gefahr unbehandelt.',
        ),
      },
      {
        id: 'd',
        quality: 'poor',
        text: L(
          'Copy their entire attack system overnight',
          'Preko noći kopirati cijeli njihov napadački sustav',
          'Über Nacht ihr komplettes Angriffssystem kopieren',
        ),
        feedback: L(
          'Chaos — prepare your identity with two targeted adjustments.',
          'Kaos — pripremi svoj identitet s dvije ciljane prilagodbe.',
          'Chaos — bereite eure Identität mit zwei gezielten Anpassungen vor.',
        ),
      },
    ],
    explanation: L(
      'Opponent analysis should produce two concrete training answers: stop their main weapon and exploit their clear gap.',
      'Analiza protivnika treba dati dva konkretna odgovora na treningu: zaustaviti glavno oružje i iskoristiti jasnu rupu.',
      'Gegneranalyse muss zwei konkrete Trainingsantworten liefern: Hauptwaffe stoppen und klare Lücke nutzen.',
    ),
  },
  {
    id: 'coach-lead-1',
    category: 'leadership',
    difficulty: 'Expert',
    coachTypeTags: ['Head Coach', 'Senior Coach', 'Professional Coach', 'Youth Coach'],
    experienceTags: ['6-10', '10+', '3-5'],
    situation: L(
      'At half-time you lead by 1, but two leaders argue loudly in front of younger players about who should take the last shot.',
      'U poluvremenu vodite za 1, ali dva lidera se glasno svađaju pred mlađim igračima tko treba uzeti zadnji šut.',
      'Zur Halbzeit führt ihr mit 1, aber zwei Führungsspieler streiten laut vor Jüngeren über den letzten Wurf.',
    ),
    question: L(
      'Best leadership response?',
      'Najbolji liderski odgovor?',
      'Beste Führungsreaktion?',
    ),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Stop the argument, set one decision rule for end-game, and speak privately with both after',
          'Zaustaviti svađu, postaviti jedno pravilo odluke za kraj i privatno razgovarati s oboje poslije',
          'Streit stoppen, eine Endspiel-Regel setzen und danach mit beiden privat sprechen',
        ),
        feedback: L(
          'Best — protects culture now and restores leadership later.',
          'Najbolje — štiti kulturu sada i kasnije popravlja vodstvo.',
          'Beste Wahl — schützt die Kultur jetzt und klärt Führung danach.',
        ),
      },
      {
        id: 'b',
        quality: 'good',
        text: L(
          'Let them finish arguing so emotions settle',
          'Pustiti ih da završe svađu da se emocije smire',
          'Austragen lassen, damit Emotionen sich legen',
        ),
        feedback: L(
          'Risks modelling poor standards for younger players.',
          'Rizik da mlađi igrači vide loše standarde.',
          'Risiko schlechter Vorbilder für jüngere Spieler.',
        ),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L(
          'Pick a side publicly to end it fast',
          'Javno stati na jednu stranu da brzo završi',
          'Öffentlich Partei ergreifen, um es schnell zu beenden',
        ),
        feedback: L(
          'Can escalate status conflict inside the group.',
          'Može eskalirati sukob statusa u grupi.',
          'Kann den Statuskonflikt in der Gruppe verstärken.',
        ),
      },
      {
        id: 'd',
        quality: 'poor',
        text: L(
          'Ignore it and only talk tactics',
          'Ignorirati i govoriti samo o taktici',
          'Ignorieren und nur über Taktik sprechen',
        ),
        feedback: L(
          'Culture problems left unchecked become performance problems.',
          'Problemi kulture ako se ne riješe postaju problemi performansi.',
          'Ungeklärte Kulturprobleme werden zu Leistungsproblemen.',
        ),
      },
    ],
    explanation: L(
      'Leadership moments require protecting team standards first, then repairing relationships with clarity.',
      'Liderski trenuci zahtijevaju prvo zaštitu standarda ekipe, zatim popravak odnosa s jasnoćom.',
      'Führungsmomente schützen zuerst Teamstandards und klären danach Beziehungen klar.',
    ),
  },
];

export const COACH_CHALLENGES: CoachChallenge[] = [...COACH_CHALLENGES_BASE, ...COACH_CHALLENGES_EXTRA];

export function getCoachChallenges(): CoachChallenge[] {
  return COACH_CHALLENGES;
}

export function getCoachChallengeById(id: string): CoachChallenge | undefined {
  return COACH_CHALLENGES.find((c) => c.id === id);
}

export function getChallengesByCategory(category: CoachChallengeCategory): CoachChallenge[] {
  return COACH_CHALLENGES.filter((c) => c.category === category);
}

export function pickCoachChallengeForProfile(opts: {
  coachType?: string | null;
  experienceBand?: string | null;
  developmentGoal?: string | null;
  favoriteDefense?: string | null;
  favoriteAttack?: string | null;
  excludeIds?: string[];
}): CoachChallenge {
  const exclude = new Set(opts.excludeIds ?? []);
  let pool = COACH_CHALLENGES.filter((c) => !exclude.has(c.id));

  if (opts.coachType) {
    const tagged = pool.filter((c) => c.coachTypeTags.includes(opts.coachType!));
    if (tagged.length) pool = tagged;
  }
  if (opts.experienceBand) {
    const tagged = pool.filter((c) => c.experienceTags.includes(opts.experienceBand!));
    if (tagged.length) pool = tagged;
  }

  const goal = (opts.developmentGoal ?? '').toLowerCase();
  if (goal.includes('tactic')) {
    const tactical = pool.filter((c) =>
      ['timeout', 'defensive_adjustment', 'opponent_analysis'].includes(c.category),
    );
    if (tactical.length) pool = tactical;
  } else if (goal.includes('player')) {
    const pd = pool.filter((c) => c.category === 'player_development' || c.category === 'leadership');
    if (pd.length) pool = pd;
  } else if (goal.includes('training')) {
    const tp = pool.filter((c) => c.category === 'training_plan');
    if (tp.length) pool = tp;
  } else if (goal.includes('leadership')) {
    const lead = pool.filter((c) => c.category === 'leadership' || c.category === 'timeout');
    if (lead.length) pool = lead;
  }

  // Soft bias from tactical preferences — never hard-filter the pool empty
  const scored = pool.map((c) => {
    const blob = [
      c.situation.en,
      c.situation.hr,
      c.situation.de,
      c.question.en,
      c.explanation.en,
      ...c.answers.map((a) => a.text.en),
    ].join(' ');
    return {
      c,
      score: scoreTextForTacticalPrefs(blob, opts.favoriteDefense, opts.favoriteAttack),
    };
  });
  const max = Math.max(0, ...scored.map((s) => s.score));
  if (max > 0) {
    const boosted = scored.filter((s) => s.score === max).map((s) => s.c);
    if (boosted.length) pool = boosted;
  }

  const day = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < day.length; i++) hash = (hash * 31 + day.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length] ?? COACH_CHALLENGES[0];
}
