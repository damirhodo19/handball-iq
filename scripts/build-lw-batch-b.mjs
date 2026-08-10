#!/usr/bin/env node
/**
 * Build lw-families-b.json (963–974) from approved Batch B plan families.
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const ans = (o, g, r, p) => [
  { quality: 'optimal', text: o.t, feedback: o.f },
  { quality: 'good', text: g.t, feedback: g.f },
  { quality: 'risky', text: r.t, feedback: r.f },
  { quality: 'poor', text: p.t, feedback: p.f },
];

const L = (en, hr, de) => ({ en, hr, de });

const scenarios = [
  {
    id: 'scn_bank_963',
    batchId: 'lw_batch_b_01',
    familyKey: 'lw_sys_15_outlet_width',
    teachingArea: 'system',
    title: L(
      'Left Wing — Keep Outlet Width Against Deep 1:5 Pressure',
      'Lijevo krilo — drži širinu za izlazak lopte protiv dubokog 1:5 pritiska',
      'Linksaußen — Auslassbreite gegen tiefen 1:5-Druck halten',
    ),
    difficulty: 'Beginner',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 12,
    score: '6:6',
    defensiveSystem: '1-5',
    perception: false,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['decisionMaking', 'spacing', 'teamplay'],
    situation: L(
      "Tied 6:6 at 12' against a 1:5. Their front defender presses deep on your left back at nine metres. You are on the left sideline. The next defender is also stepping up toward the left channel. If you step inside into that pressure pocket, the left back loses the short outlet and the trap closes. The left back still has time to reverse or play wide if you stay outside.",
      'Neriješeno je 6:6 u 12. minuti protiv 1:5. Njihov prednji branič duboko pritišće tvog lijevog vanjskog na devet metara. Ti si uz lijevu aut-liniju. Sljedeći branič također ide gore u lijevi kanal. Ako uđeš unutra u taj džep pritiska, lijevi vanjski gubi kratki izlazak i zamka se zatvara. Lijevi vanjski još ima vremena vratiti ili igrati široko ako ti ostaneš vani.',
      'Unentschieden 6:6 in Minute 12 gegen 1:5. Ihr vorderer Verteidiger drückt tief auf euren linken Rückraum auf neun Metern. Du stehst an der linken Seitenlinie. Der nächste Verteidiger steigt auch in den linken Kanal. Gehst du nach innen in diese Drucktasche, verliert der Rückraum den kurzen Auslass und die Falle schließt. Der Rückraum hat noch Zeit zurück oder breit zu spielen wenn du außen bleibst.',
    ),
    question: L(
      'Deep 1:5 pressure is on the left back — what is your first job?',
      'Duboki 1:5 pritisak je na lijevom vanjskom — što je tvoj prvi posao?',
      'Tiefer 1:5-Druck liegt auf dem linken Rückraum — was ist dein erster Job?',
    ),
    answers: ans(
      {
        t: L(
          'Keep outlet width on the left sideline — do not step into the pressure pocket',
          'Drži širinu za izlazak uz lijevu aut-liniju — ne ulazi u džep pritiska',
          'Auslassbreite an der linken Seitenlinie halten — nicht in die Drucktasche gehen',
        ),
        f: L(
          'Correct — under 1:5 your width is the escape, not another body in the trap.',
          'Točno — u 1:5 tvoja širina je izlazak, ne još jedno tijelo u zamci.',
          'Richtig — in der 1:5 ist deine Breite der Auslass, nicht noch ein Körper in der Falle.',
        ),
      },
      {
        t: L(
          'Come short only if the left back is already trapped and needs a short angle to escape',
          'Dođi kratko samo ako je lijevi vanjski već uhvaćen i treba kratki kut za izlazak',
          'Nur kurz kommen wenn der Rückraum schon gefangen ist und einen kurzen Winkel zum Entkommen braucht',
        ),
        f: L(
          'Valid when he is trapped with no reverse; here he still has time if you stay wide.',
          'Valja kad je uhvaćen bez povratka; ovdje još ima vremena ako ostaneš široko.',
          'Gültig wenn er ohne Rückweg gefangen ist; hier hat er noch Zeit wenn du breit bleibst.',
        ),
      },
      {
        t: L(
          'Step inside early to “help” the left back in the pressure',
          'Rano uđi unutra da “pomogneš” lijevom vanjskom u pritisku',
          'Früh nach innen gehen um dem Rückraum im Druck zu „helfen“',
        ),
        f: L(
          'Risky — you remove the outlet and tighten the trap.',
          'Rizično — skidaš izlazak i stežeš zamku.',
          'Riskant — du nimmst den Auslass weg und ziehst die Falle zu.',
        ),
      },
      {
        t: L(
          'Enter to six immediately because the defence is high',
          'Odmah uđi na šest jer je obrana visoko',
          'Sofort auf sechs gehen weil die Abwehr hoch steht',
        ),
        f: L(
          'Poor — early entry under 1:5 gifts the left side without an outlet.',
          'Loše — rani ulazak u 1:5 poklanja lijevu stranu bez izlaska.',
          'Schlecht — früher Eintritt in der 1:5 verschenkt die linke Seite ohne Auslass.',
        ),
      },
    ),
    explanation: L(
      'Against deep 1:5 pressure the left wing’s first job is outlet width. Stay outside so the left back can reverse or play wide. Come short only if he is already trapped with no escape angle.',
      'Protiv dubokog 1:5 pritiska prvi je posao lijevog krila širina za izlazak. Ostani vani da lijevi vanjski može vratiti ili igrati široko. Dođi kratko samo ako je već uhvaćen bez kuta za izlazak.',
      'Gegen tiefen 1:5-Druck ist der erste Job des Linksaußen die Auslassbreite. Außen bleiben damit der Rückraum zurück oder breit spielen kann. Nur kurz kommen wenn er schon ohne Fluchtwinkel gefangen ist.',
    ),
    whyCorrectOverSecondBest: L(
      'A keeps the outlet while the left back still has time. B becomes correct only when he is already trapped and needs a short escape angle.',
      'A drži izlazak dok lijevi vanjski još ima vremena. B postaje točan samo kad je već uhvaćen i treba kratki kut za izlazak.',
      'A hält den Auslass solange der Rückraum noch Zeit hat. B wird richtig nur wenn er schon gefangen ist und einen kurzen Fluchtwinkel braucht.',
    ),
    reviewer: {
      closestLw: 'scn_bank_942',
      closestRw: 'scn_bank_940',
      sharedConcept: '1:5 left-side pressure geometry',
      criticalDifference: 'Attack outlet width vs defence chase depth (940); vs 942 5:1 ask-now',
      duplicateClassification: 'UNIQUE',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 2,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
    },
  },

  {
    id: 'scn_bank_964',
    batchId: 'lw_batch_b_02',
    familyKey: 'lw_sw_advantage_gone',
    teachingArea: 'transition_second',
    title: L(
      'Left Wing — Stop Forcing the Second Wave When Numbers Are Back',
      'Lijevo krilo — prestani forsirati drugi val kad su brojevi vraćeni',
      'Linksaußen — die zweite Welle nicht mehr forcen wenn die Zahlen zurück sind',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Transition',
    minute: 21,
    score: '10:10',
    defensiveSystem: 'Mixed',
    perception: false,
    handedness: 'none',
    numerical: 'transition',
    gameState: 'none',
    skillTags: ['decisionMaking', 'transition', 'spacing', 'timing'],
    situation: L(
      "Tied 10:10 at 21' in second wave after your own save. You stayed wide on the left for one more advantage. Their wing defender has now recovered inside two metres of you and a second defender has filled the left lane. There is no free run to six. The left back is slowing into set attack. Forcing one more left action would run into recovered numbers.",
      'Neriješeno je 10:10 u 21. minuti u drugom valu nakon vaše obrane. Ostao si široko lijevo za još jednu prednost. Njihov krilni branič sada je unutar dva metra od tebe i drugi branič je popunio lijevi kanal. Nema slobodnog trčanja na šest. Lijevi vanjski usporava u pozicijski napad. Forsirati još jednu lijevu akciju znači trčati u vraćene brojeve.',
      'Unentschieden 10:10 in Minute 21 in der zweiten Welle nach eurer Parade. Du bist links breit geblieben für einen weiteren Vorteil. Ihr Außenverteidiger ist jetzt innerhalb von zwei Metern und ein zweiter Verteidiger hat die linke Bahn gefüllt. Kein freier Lauf auf sechs. Der linke Rückraum bremst in den Positionsangriff. Noch eine linke Aktion forcen heißt in wiederhergestellte Zahlen zu laufen.',
    ),
    question: L(
      'The left second-wave advantage is gone — what now?',
      'Lijeva prednost drugog vala je nestala — što sada?',
      'Der linke Vorteil der zweiten Welle ist weg — was jetzt?',
    ),
    answers: ans(
      {
        t: L(
          'Stay wide and return into positional attack — do not force one more left action',
          'Ostani široko i vrati se u pozicijski napad — ne forsiraј još jednu lijevu akciju',
          'Breit bleiben und in den Positionsangriff zurück — keine weitere linke Aktion forcen',
        ),
        f: L(
          'Correct — numbers are restored; reset wide instead of forcing.',
          'Točno — brojevi su vraćeni; resetiraj široko umjesto forsiranja.',
          'Richtig — Zahlen sind zurück; breit resetten statt forcen.',
        ),
      },
      {
        t: L(
          'Demand one more left action only if their wing defender is still more than two metres late',
          'Traži još jednu lijevu akciju samo ako je njihov krilni branič još više od dva metra kasno',
          'Noch eine linke Aktion nur fordern wenn ihr Außenverteidiger noch mehr als zwei Meter spät ist',
        ),
        f: L(
          'Valid under the 947 condition; here he has recovered inside two metres.',
          'Valja uz uvjet iz 947; ovdje se vratio unutar dva metra.',
          'Gültig unter der 947-Bedingung; hier ist er innerhalb von zwei Metern zurück.',
        ),
      },
      {
        t: L(
          'Cut to six anyway because the break started as an advantage',
          'Svejedno siječi na šest jer je kontra krenula kao prednost',
          'Trotzdem auf sechs schneiden weil der Break als Vorteil begann',
        ),
        f: L(
          'Risky — you attack recovered defence from a dead left lane.',
          'Rizično — napadaš vraćenu obranu iz mrtvog lijevog kanala.',
          'Riskant — du greifst wiederhergestellte Abwehr aus einer toten linken Bahn an.',
        ),
      },
      {
        t: L(
          'Stop running and stand still in the half space',
          'Prestani trčati i stani u poluprostoru',
          'Aufhören zu laufen und im Halbraum stehen bleiben',
        ),
        f: L(
          'Poor — you neither reset wide nor offer a clean left structure.',
          'Loše — ni ne resetiraš široko ni ne nudiš čistu lijevu strukturu.',
          'Schlecht — du resettest weder breit noch bietest du eine saubere linke Struktur.',
        ),
      },
    ),
    explanation: L(
      'Opposite of the late second-wave ask: when the wing defender recovers inside two metres and the left lane fills, stop forcing. Stay wide into set attack. One more left action only if he is still more than two metres late.',
      'Suprotno od kasnog traženja u drugom valu: kad se krilni branič vrati unutar dva metra i lijevi kanal se popuni, prestani forsirati. Ostani široko u pozicijski napad. Još jedna lijeva akcija samo ako je još više od dva metra kasno.',
      'Gegenteil der späten zweiten Welle: kehrt der Außenverteidiger innerhalb von zwei Metern zurück und füllt sich die linke Bahn, nicht mehr forcen. Breit in den Positionsangriff. Noch eine linke Aktion nur wenn er noch mehr als zwei Meter spät ist.',
    ),
    whyCorrectOverSecondBest: L(
      'A matches restored numbers after the left second wave. B needs the wing defender still more than two metres late.',
      'A odgovara vraćenim brojevima nakon lijevog drugog vala. B treba krilnog braniča još više od dva metra kasno.',
      'A passt zu wiederhergestellten Zahlen nach der linken zweiten Welle. B braucht den Außenverteidiger noch mehr als zwei Meter spät.',
    ),
    reviewer: {
      closestLw: 'scn_bank_947',
      closestRw: 'scn_bank_877',
      sharedConcept: 'Stop forcing transition when advantage is gone',
      criticalDifference: 'Explicit opposite fork of LW 947 left second-wave; WD <2m + second filler on left lane',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
    },
  },

  {
    id: 'scn_bank_965',
    batchId: 'lw_batch_b_03',
    familyKey: 'lw_recovering_defender_race',
    teachingArea: 'finish_pressure',
    title: L(
      'Left Wing — Finish the Race Before the Recovery — Do Not Wait for the Goalkeeper',
      'Lijevo krilo — završi utrku prije povratka — ne čekaj vratara',
      'Linksaußen — das Rennen vor der Rückkehr beenden — nicht auf den Torhüter warten',
    ),
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 27,
    score: '13:12',
    defensiveSystem: '6-0',
    perception: false,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['shotSelection', 'timing', 'decisionMaking'],
    situation: L(
      "You lead 13:12 at 27' against 6:0. You catch free on the left wing. The wing defender is late from inside and still about three metres from your take-off foot. The goalkeeper is central and has not yet shown a clear hand or foot commit. Waiting for a perfect goalkeeper picture would let the defender arrive. Your take-off lane is free now.",
      'Vodite 13:12 u 27. minuti protiv 6:0. Hvataš slobodno na lijevom krilu. Krilni branič kasni iznutra i još je oko tri metra od tvog odraza. Vratar je centralno i još nije pokazao jasno zatvaranje rukom ili stopalom. Čekati savršenu sliku vratara znači pustiti braniča da stigne. Linija odraza sada je slobodna.',
      'Ihr führt 13:12 in Minute 27 gegen 6:0. Du fängst frei am Linksaußen. Der Außenverteidiger kommt spät von innen und ist noch etwa drei Meter von deinem Absprungfuß. Der Torhüter steht zentral und hat noch keine klare Hand- oder Fußfestlegung gezeigt. Auf ein perfektes Torhüterbild zu warten lässt den Verteidiger ankommen. Deine Absprungbahn ist jetzt frei.',
    ),
    question: L(
      'Take-off is free now but the goalkeeper has not committed — what first?',
      'Odraz je sada slobodan ali vratar se nije zatvorio — što je prvo?',
      'Absprung ist jetzt frei aber der Torhüter hat sich nicht festgelegt — was zuerst?',
    ),
    answers: ans(
      {
        t: L(
          'Take off and finish now — do not wait for a goalkeeper micro-read that arrives too late',
          'Idi u odraz i završi sad — ne čekaj sitno čitanje vratara koje stiže prekasno',
          'Jetzt abspringen und abschließen — nicht auf eine Torhüter-Mikrolese warten die zu spät kommt',
        ),
        f: L(
          'Correct — the race is with the recovering defender; the free take-off is now.',
          'Točno — utrka je s braničem u povratku; slobodan odraz je sada.',
          'Richtig — das Rennen ist mit dem zurückkehrenden Verteidiger; der freie Absprung ist jetzt.',
        ),
      },
      {
        t: L(
          'Short return to the left back only if the defender reaches your take-off foot before you can jump',
          'Kratko vrati lijevom vanjskom samo ako branič stigne na tvoje stopalo odraza prije skoka',
          'Kurz zum linken Rückraum nur wenn der Verteidiger deinen Absprungfuß vor dem Sprung erreicht',
        ),
        f: L(
          'Valid when the race is already lost; here he is still about three metres late.',
          'Valja kad je utrka već izgubljena; ovdje kasni još oko tri metra.',
          'Gültig wenn das Rennen schon verloren ist; hier ist er noch etwa drei Meter spät.',
        ),
      },
      {
        t: L(
          'Hold the ball in the air waiting for the goalkeeper to pick a post',
          'Drži loptu u zraku i čekaj da vratar izabere stativu',
          'Den Ball in der Luft halten und warten bis der Torhüter eine Stange wählt',
        ),
        f: L(
          'Risky — you gift the recovering defender the contest.',
          'Rizično — poklanjaš braniču u povratku kontakt.',
          'Riskant — du schenkst dem zurückkehrenden Verteidiger den Kampf.',
        ),
      },
      {
        t: L(
          'Step inside and look for a new combination instead of using the free take-off',
          'Uđi unutra i traži novu kombinaciju umjesto slobodnog odraza',
          'Nach innen gehen und eine neue Kombination suchen statt den freien Absprung zu nutzen',
        ),
        f: L(
          'Poor — you refuse a free finish to invent traffic.',
          'Loše — odbijaš slobodan završetak da izmisliš gužvu.',
          'Schlecht — du lehnst einen freien Abschluss ab um Verkehr zu erfinden.',
        ),
      },
    ),
    explanation: L(
      'When take-off is free and the wing defender is still metres late, finish the race. Do not wait for a perfect goalkeeper picture. Short return only if he reaches your take-off foot before the jump.',
      'Kad je odraz slobodan a krilni branič još kasni metrima, završi utrku. Ne čekaj savršenu sliku vratara. Kratki povratak samo ako stigne na stopalo odraza prije skoka.',
      'Ist der Absprung frei und der Außenverteidiger noch Meter spät, beende das Rennen. Nicht auf ein perfektes Torhüterbild warten. Kurzer Rückpass nur wenn er den Absprungfuß vor dem Sprung erreicht.',
    ),
    whyCorrectOverSecondBest: L(
      'A uses the free take-off before recovery. B becomes correct only if the defender reaches the take-off foot before the jump.',
      'A koristi slobodan odraz prije povratka. B postaje točan samo ako branič stigne na stopalo odraza prije skoka.',
      'A nutzt den freien Absprung vor der Rückkehr. B wird richtig nur wenn der Verteidiger den Absprungfuß vor dem Sprung erreicht.',
    ),
    reviewer: {
      closestLw: 'scn_bank_954',
      closestRw: 'scn_bank_882',
      sharedConcept: 'Finish before late recovery reaches take-off',
      criticalDifference: 'Extra stated temptation is waiting for unread GK; teaching race-over-GK-patience, not pure recovery race alone',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
    },
  },
];

// Continue building remaining scenarios in part 2 via append in same file - split for manageability
writeFileSync(join(root, 'scripts/.lw-batch-b-part1-tmp.json'), JSON.stringify(scenarios, null, 2));
console.log('part1', scenarios.length);
