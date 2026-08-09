import type { CoachChallenge } from './types';

const L = (en: string, hr: string, de: string) => ({ en, hr, de });

/** Additional Sprint 5 coach challenges — profile-tagged, bilingual. */
export const COACH_CHALLENGES_EXTRA: CoachChallenge[] = [
  {
    id: 'coach-youth-teach-1',
    category: 'player_development',
    difficulty: 'Beginner',
    coachTypeTags: ['Youth Coach', 'Assistant Coach'],
    experienceTags: ['0-2', '3-5'],
    situation: L(
      'A U15 pivot freezes after two missed receptions. Teammates start avoiding the pass.',
      'U15 pivot se zamrzne nakon dva promašena primanja. Suigrači izbjegavaju pas.',
      'Ein U15-Kreisläufer blockiert nach zwei verpassten Annahmen. Mitspieler vermeiden den Pass.',
    ),
    question: L('Best next coaching action?', 'Najbolja sljedeća trenerska akcija?', 'Beste nächste Trainerhandlung?'),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Pause, reset a simple receive cue, and give two guaranteed high-quality looks',
          'Pauza, jednostavan cue za primanje i dva zajamčena kvaliteta pasa',
          'Pause, einfachen Annahme-Cue setzen und zwei sichere Zuspiele geben',
        ),
        feedback: L('Rebuilds confidence with executable success.', 'Vraća samopouzdanje kroz uspjeh.', 'Baut Selbstvertrauen durch Erfolg auf.'),
      },
      {
        id: 'b',
        quality: 'risky',
        text: L('Bench them immediately for the rest of practice', 'Odmah ih skinuti do kraja treninga', 'Sofort für den Rest des Trainings rausnehmen'),
        feedback: L('Punishes learning; youth need guided reps.', 'Kažnjava učenje.', 'Bestraft Lernen.'),
      },
      {
        id: 'c',
        quality: 'poor',
        text: L('Ignore it and keep the drill tempo high', 'Ignorirati i držati tempo', 'Ignorieren und Tempo halten'),
        feedback: L('Avoidance becomes a team habit.', 'Izbjegavanje postaje navika.', 'Vermeidung wird zur Gewohnheit.'),
      },
      {
        id: 'd',
        quality: 'good',
        text: L('Switch them to wing for one block', 'Prebaciti na krilo na jedan blok', 'Für einen Block auf den Flügel wechseln'),
        feedback: L('Can help, but does not fix the receive skill.', 'Može pomoći, ali ne rješava primanje.', 'Hilft, löst aber die Annahme nicht.'),
      },
    ],
    explanation: L(
      'Youth development prioritizes teaching cues and safe success reps over public punishment.',
      'Razvoj mladih daje prioritet poučavanju i sigurnim ponavljanjima.',
      'Jugendentwicklung priorisiert Lehr-Cues und sichere Erfolgswiederholungen.',
    ),
  },
  {
    id: 'coach-head-tactic-1',
    category: 'defensive_adjustment',
    difficulty: 'Advanced',
    coachTypeTags: ['Head Coach', 'Senior Coach', 'Professional Coach'],
    experienceTags: ['6-10', '10+'],
    situation: L(
      'Opponent LB is scoring from 9m after your wing overhelps. Score tied, 8 minutes left.',
      'Protivnički LB zabija s 9m jer krilo pretjerano pomaže. Neriješeno, 8 minuta.',
      'Der gegnerische Rückraum trifft aus 9m, weil der Flügel zu früh hilft. Unentschieden, 8 Minuten.',
    ),
    question: L('Best defensive adjustment?', 'Najbolja obrambena prilagodba?', 'Beste defensive Anpassung?'),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Hold wing depth, delay help one count, and force the LB into a contested shot or late pass',
          'Drži dubinu krila, odgodi pomoć jedan tempo i forsira LB u ometan šut ili kasni pas',
          'Flügeltiefe halten, Hilfe einen Moment verzögern und den Rückraum zu umkämpftem Wurf/spätem Pass zwingen',
        ),
        feedback: L('Fixes the overhelp without collapsing the line.', 'Rješava pretjeranu pomoć.', 'Behebt die Überhilfe.'),
      },
      {
        id: 'b',
        quality: 'risky',
        text: L('Switch fully to man coverage on the LB', 'Prijeći potpuno na igrač na igrača na LB', 'Komplett Mann-Mann auf den LB'),
        feedback: L('May isolate other shooters.', 'Može otvoriti druge šutere.', 'Kann andere Werfer freimachen.'),
      },
      {
        id: 'c',
        quality: 'poor',
        text: L('Call a timeout to yell about effort only', 'Timeout samo zbog truda', 'Timeout nur für Einsatz-Kritik'),
        feedback: L('No tactical fix.', 'Nema taktičkog rješenja.', 'Keine taktische Lösung.'),
      },
      {
        id: 'd',
        quality: 'good',
        text: L('Drop into a deeper 6:0 for two possessions', 'Ući u dublji 6:0 na dva napada', 'Für zwei Angriffe in tieferes 6:0'),
        feedback: L('Can slow them, but may concede wing finishes.', 'Može usporiti, ali otvara krila.', 'Kann bremsen, öffnet Flügel.'),
      },
    ],
    explanation: L(
      'Head-coach match management fixes the specific help timing error under score pressure.',
      'Vođenje utakmice ispravlja konkretnu grešku pomoći pod pritiskom rezultata.',
      'Matchmanagement korrigiert den konkreten Hilfe-Timing-Fehler unter Ergebnisdruck.',
    ),
  },
  {
    id: 'coach-gk-dev-1',
    category: 'player_development',
    difficulty: 'Intermediate',
    coachTypeTags: ['Goalkeeper Coach', 'Assistant Coach', 'Head Coach'],
    experienceTags: ['3-5', '6-10', '10+'],
    situation: L(
      'Your GK is late on wing shots after strong 9m saves in the first half.',
      'Vratar kasni na krilne šuteve nakon jakih obrana s 9m u prvom poluvremenu.',
      'Der Torwart kommt nach starken 9m-Paraden zu spät gegen Flügelwürfe.',
    ),
    question: L('Best half-time development cue?', 'Najbolji poluvremenski razvojni cue?', 'Bester Pause-Entwicklungs-Cue?'),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Reset starting depth for wing angles and rehearse one early step on the first wing look',
          'Resetiraj dubinu za krilne kutove i uvježbaj jedan rani korak na prvi krilni pogled',
          'Starttiefe für Flügelwinkel resetten und einen frühen Schritt auf den ersten Flügelblick üben',
        ),
        feedback: L('Specific, executable, position-true.', 'Specifično i izvedivo.', 'Spezifisch und umsetzbar.'),
      },
      {
        id: 'b',
        quality: 'poor',
        text: L('Tell them to “try harder” on every shot', 'Reći da se više trude na svaki šut', 'Sagen, sich bei jedem Ball mehr anzustrengen'),
        feedback: L('Not a skill cue.', 'Nije skill cue.', 'Kein Skill-Cue.'),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L('Replace them for the whole second half', 'Zamijeniti ih cijelo drugo poluvrijeme', 'Die ganze zweite Hälfte ersetzen'),
        feedback: L('May be needed later, but first fix the read.', 'Možda kasnije, prvo popravi čitanje.', 'Später möglich, zuerst Lesen korrigieren.'),
      },
      {
        id: 'd',
        quality: 'good',
        text: L('Show one video clip of their good wing save from last week', 'Pokazati jedan video dobre krilne obrane', 'Ein Video einer guten Flügelparade zeigen'),
        feedback: L('Helps confidence; still needs a concrete cue.', 'Pomaže samopouzdanju.', 'Hilft dem Selbstvertrauen.'),
      },
    ],
    explanation: L(
      'Goalkeeper coaching targets angle depth and early footwork, not generic effort talk.',
      'Trening vratara cilja dubinu kuta i rani rad nogu.',
      'Torwartcoaching zielt auf Winkeltiefe und frühe Fußarbeit.',
    ),
  },
  {
    id: 'coach-assist-analysis-1',
    category: 'opponent_analysis',
    difficulty: 'Intermediate',
    coachTypeTags: ['Assistant Coach', 'Goalkeeper Coach', 'Youth Coach'],
    experienceTags: ['0-2', '3-5', '6-10'],
    situation: L(
      'You must brief the head coach in 90 seconds before warm-up. Opponent starts in 5:1 then drops to 6:0 after goals.',
      'Moraš brifirati head coacha za 90 sekundi. Protivnik kreće u 5:1 pa pada u 6:0 nakon golova.',
      'Du hast 90 Sekunden Briefing. Gegner startet in 5:1 und fällt nach Toren in 6:0.',
    ),
    question: L('What do you communicate?', 'Što komuniciraš?', 'Was kommunizierst du?'),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Trigger: after they score → expect 6:0; first attack vs 5:1 needs a safe outlet, then stretch the line',
          'Okidač: nakon gola → očekuj 6:0; prvi napad vs 5:1 treba siguran outlet, zatim rastezanje linije',
          'Trigger: nach ihrem Tor → 6:0 erwarten; erster Angriff gegen 5:1 braucht sicheren Outlet, dann Breite',
        ),
        feedback: L('Clear trigger + first action.', 'Jasan okidač + prva akcija.', 'Klarer Trigger + erste Aktion.'),
      },
      {
        id: 'b',
        quality: 'poor',
        text: L('List every player tendency in detail', 'Nabrojati sve tendencije igrača', 'Alle Spielertendenzen detailliert auflisten'),
        feedback: L('Too much for 90 seconds.', 'Previše za 90 sekundi.', 'Zu viel für 90 Sekunden.'),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L('Only say “they are aggressive”', 'Samo reći da su agresivni', 'Nur sagen „sie sind aggressiv“'),
        feedback: L('Vague — no decision rule.', 'Nejasno.', 'Unklar.'),
      },
      {
        id: 'd',
        quality: 'good',
        text: L('Recommend one set play for each defence', 'Predložiti jednu zadanu akciju za svaku obranu', 'Ein Standardsystem je Verteidigung vorschlagen'),
        feedback: L('Useful if tied to the trigger.', 'Korisno uz okidač.', 'Nützlich mit Trigger.'),
      },
    ],
    explanation: L(
      'Assistant communication is trigger-based and brief enough for match-day use.',
      'Komunikacija asistenta je bazirana na okidačima i dovoljno kratka.',
      'Assistenten-Kommunikation ist triggerbasiert und kurz genug für den Spieltag.',
    ),
  },
  {
    id: 'coach-plan-1',
    category: 'training_plan',
    difficulty: 'Advanced',
    coachTypeTags: ['Head Coach', 'Youth Coach', 'Senior Coach'],
    experienceTags: ['3-5', '6-10', '10+'],
    situation: L(
      'Next match is in 48 hours. Players look heavy after a dense week. You have 70 minutes today.',
      'Sljedeća utakmica za 48 sati. Igrači izgledaju teško nakon gustog tjedna. Danas imaš 70 minuta.',
      'Nächstes Spiel in 48 Stunden. Spieler wirken schwer nach dichter Woche. Heute 70 Minuten.',
    ),
    question: L('Best session design?', 'Najbolji dizajn sesije?', 'Bestes Session-Design?'),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Short activation, one match-specific constraint game, and a calm set-piece finish — no new systems',
          'Kratka aktivacija, jedna utakmična constraint igra i miran set-piece finish — bez novih sustava',
          'Kurze Aktivierung, ein spielspezifisches Constraint-Game und ruhiger Standard-Abschluss — keine neuen Systeme',
        ),
        feedback: L('Protects freshness and clarity.', 'Čuva svježinu i jasnoću.', 'Schützt Frische und Klarheit.'),
      },
      {
        id: 'b',
        quality: 'poor',
        text: L('Full fitness block plus a new 5:1 install', 'Puni fitness blok plus nova 5:1 instalacija', 'Voller Fitnessblock plus neue 5:1-Einführung'),
        feedback: L('Overloads before a match.', 'Preopterećuje prije utakmice.', 'Überlastet vor dem Spiel.'),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L('Cancel practice entirely', 'Otkazati trening potpuno', 'Training komplett absagen'),
        feedback: L('Misses match-specific sharpening.', 'Gubi match-specific oštrenje.', 'Verpasst spielspezifische Schärfung.'),
      },
      {
        id: 'd',
        quality: 'good',
        text: L('Only shootout finishing for 70 minutes', 'Samo završnice 70 minuta', 'Nur Abschluss-Shootouts für 70 Minuten'),
        feedback: L('Too narrow for team readiness.', 'Preusko za spremnost.', 'Zu eng für Team-Readiness.'),
      },
    ],
    explanation: L(
      'Training planning before a match prioritizes clarity and freshness over volume.',
      'Planiranje treninga prije utakmice daje prioritet jasnoći i svježini.',
      'Trainingsplanung vor dem Spiel priorisiert Klarheit und Frische.',
    ),
  },
  {
    id: 'coach-lead-comm-1',
    category: 'leadership',
    difficulty: 'Advanced',
    coachTypeTags: ['Head Coach', 'Youth Coach', 'Assistant Coach', 'Senior Coach'],
    experienceTags: ['3-5', '6-10', '10+'],
    situation: L(
      'Two starters argue loudly on the bench after a substitution. The team is watching.',
      'Dva startera se glasno svađaju na klupi nakon izmjene. Ekipa gleda.',
      'Zwei Stammspieler streiten laut auf der Bank nach einem Wechsel. Das Team schaut zu.',
    ),
    question: L('Best leadership response?', 'Najbolji liderski odgovor?', 'Beste Führungsreaktion?'),
    answers: [
      {
        id: 'a',
        quality: 'optimal',
        text: L(
          'Stop it immediately, restate the bench standard, and schedule a private reset after the match',
          'Odmah zaustavi, ponovi standard klupe i dogovori privatni reset nakon utakmice',
          'Sofort stoppen, Bankstandard klarstellen und privaten Reset nach dem Spiel ansetzen',
        ),
        feedback: L('Protects culture in public, repairs in private.', 'Štiti kulturu javno, popravlja privatno.', 'Schützt Kultur öffentlich, repariert privat.'),
      },
      {
        id: 'b',
        quality: 'poor',
        text: L('Join the argument to “show honesty”', 'Ući u svađu da pokažeš iskrenost', 'In den Streit einsteigen, um „Ehrlichkeit“ zu zeigen'),
        feedback: L('Escalates spectacle.', 'Eskalira spektakl.', 'Eskaliert das Spektakel.'),
      },
      {
        id: 'c',
        quality: 'risky',
        text: L('Ignore until after the final whistle', 'Ignorirati do kraja', 'Bis zum Schlusspfiff ignorieren'),
        feedback: L('Bench culture erodes in real time.', 'Kultura klupe pada u stvarnom vremenu.', 'Bankkultur erodiert live.'),
      },
      {
        id: 'd',
        quality: 'good',
        text: L('Sub both out for the next five minutes', 'Skinuti oboje na pet minuta', 'Beide für fünf Minuten rausnehmen'),
        feedback: L('Possible later; standard-setting comes first.', 'Moguće kasnije; prvo standard.', 'Später möglich; zuerst Standard.'),
      },
    ],
    explanation: L(
      'Leadership communication protects standards publicly and resolves conflict privately.',
      'Liderska komunikacija štiti standarde javno i rješava konflikt privatno.',
      'Führungskommunikation schützt Standards öffentlich und löst Konflikte privat.',
    ),
  },
];
