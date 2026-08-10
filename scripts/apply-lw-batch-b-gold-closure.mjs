#!/usr/bin/env node
/**
 * Final Batch B Gold closure repairs: ONLY 963, 964, 970, 974.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const batchPath = join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-b.json');
const matrixPath = join(root, 'scripts/lw-gold-full-family-matrix.json');
const lockPath = join(root, 'scripts/.lw-batch-b-gold-closure-lock-before.json');

const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));
const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'));
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));

const hash = (v) => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hashPos = (pos) => hash(bank.filter((s) => s.primaryPosition === pos));

for (const [k, pos] of Object.entries({
  LB: 'Left Back',
  RB: 'Right Back',
  CB: 'Centre Back',
  RW: 'Right Wing',
})) {
  if (hashPos(pos) !== lock[k]) throw new Error(`Lock broken before closure: ${k}`);
}

const targets = new Set(['scn_bank_963', 'scn_bank_964', 'scn_bank_970', 'scn_bank_974']);
for (const [id, h] of Object.entries(lock.seeds)) {
  if (targets.has(id)) continue;
  const cur = hash(bank.find((s) => s.id === id));
  if (cur !== h) throw new Error(`Protected scenario changed before closure: ${id}`);
}

const replacements = {
  scn_bank_963: {
    familyKey: 'lw_sys_5plus1_trap',
    teachingArea: 'system',
    title: {
      en: 'Left Wing — In 5+1 Wait Until the Left Back Moves the Advanced Defender',
      hr: 'Lijevo krilo — u 5+1 pričekaj da lijevi vanjski odvuče isturenog',
      de: 'Linksaußen — in der 5+1 warten bis der Rückraum den Vorgeschobenen wegzieht',
    },
    difficulty: 'Advanced',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 23,
    score: '12:12',
    defensiveSystem: '5+1',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['decisionMaking', 'perception', 'timing', 'spacing', 'system'],
    situation: {
      en: "Tied 12:12 at 23' against 5+1. Their advanced defender is high on the left between you and the left back. Behind him you can already see space toward six. The left back has the ball and is about to engage that advanced defender. The direct connection from the left back to you is still covered by that advanced body. Their wing defender is not the main problem yet.",
      hr: 'Neriješeno je 12:12 u 23. minuti protiv 5+1. Njihov istureni je visoko lijevo između tebe i lijevog vanjskog. Iza njega već vidiš prostor prema šest. Lijevi vanjski ima loptu i ide na tog isturenog. Direktna veza od lijevog vanjskog do tebe još je pokrivena njegovim tijelom. Njihov krilni branič još nije glavni problem.',
      de: 'Unentschieden 12:12 in Minute 23 gegen 5+1. Ihr Vorgeschobener steht hoch links zwischen dir und dem linken Rückraum. Hinter ihm siehst du schon Raum Richtung Sechs. Der Rückraum hat den Ball und geht auf diesen Vorgeschobenen. Die direkte Verbindung vom Rückraum zu dir ist noch durch seinen Körper zugedeckt. Ihr Außenverteidiger ist noch nicht das Hauptproblem.',
    },
    question: {
      en: 'Space appears behind the advanced defender, but he still sits on the left-back connection — what first?',
      hr: 'Iza isturenog se vidi prostor, ali on još sjedi na vezi s lijevim vanjskim — što prvo?',
      de: 'Hinter dem Vorgeschobenen sieht man Raum, aber er sitzt noch auf der Verbindung zum Rückraum — was zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay wide and wait — give the left back time to move the advanced defender toward the middle before you enter',
          hr: 'Ostani široko i pričekaj — daj lijevom vanjskom vremena da odvuče isturenog prema sredini prije nego uđeš',
          de: 'Breit bleiben und warten — dem Rückraum Zeit geben den Vorgeschobenen zur Mitte wegzuziehen bevor du einrückst',
        },
        feedback: {
          en: 'Correct — early entry while he still owns the left connection wastes the 5+1 read.',
          hr: 'Točno — rani ulazak dok on još drži lijevu vezu baca čitanje 5+1.',
          de: 'Richtig — früher Eintritt während er die linke Verbindung noch hält, verschenkt die 5+1-Lesung.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Enter behind him only after the left back has drawn him toward the middle and the pass into that space is open',
          hr: 'Uđi iza njega samo nakon što ga je lijevi vanjski odvukao prema sredini i pas u taj prostor je otvoren',
          de: 'Erst hinter ihn einrücken wenn der Rückraum ihn zur Mitte gezogen hat und der Pass in diesen Raum offen ist',
        },
        feedback: {
          en: 'Valid after he is moved off the left connection; here he still sits between you and the left back.',
          hr: 'Valja nakon što je skinut s lijeve veze; ovdje još sjedi između tebe i lijevog vanjskog.',
          de: 'Gültig nachdem er von der linken Verbindung weg ist; hier sitzt er noch zwischen dir und dem Rückraum.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Cut early into the space behind him while he is still high on the left-back connection',
          hr: 'Rano siječi u prostor iza njega dok je još visoko na vezi s lijevim vanjskim',
          de: 'Früh in den Raum hinter ihm schneiden während er noch hoch auf der Verbindung zum Rückraum steht',
        },
        feedback: {
          en: 'Risky — the space behind him is not usable until the left back moves him.',
          hr: 'Rizično — prostor iza njega nije za korištenje dok ga lijevi vanjski ne odvuče.',
          de: 'Riskant — der Raum hinter ihm ist nicht nutzbar bis der Rückraum ihn wegzieht.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Force a wide finish into him because the corner looks empty',
          hr: 'Forsiraj široki završetak u njega jer kut izgleda prazan',
          de: 'Einen breiten Abschluss in ihn erzwingen weil die Ecke leer wirkt',
        },
        feedback: {
          en: 'Poor — you attack the body that still covers the left connection.',
          hr: 'Loše — napadaš tijelo koje još pokriva lijevu vezu.',
          de: 'Schlecht — du greifst den Körper an der die linke Verbindung noch zudeckt.',
        },
      },
    ],
    explanation: {
      en: 'In 5+1 the advanced defender high on the left changes your timing. If you can see space behind him but he still covers the left-back connection, stay wide first. Enter behind him only after the left back has moved him toward the middle and the pass is open.',
      hr: 'U 5+1 istureni visoko lijevo mijenja tvoj timing. Ako vidiš prostor iza njega, ali on još pokriva vezu s lijevim vanjskim, prvo ostani široko. Uđi iza njega tek kad ga je lijevi vanjski odvukao prema sredini i pas je otvoren.',
      de: 'In der 5+1 verändert der Vorgeschobene hoch links dein Timing. Siehst du Raum hinter ihm, deckt er aber noch die Verbindung zum Rückraum, bleib zuerst breit. Hinter ihn erst einrücken wenn der Rückraum ihn zur Mitte gezogen hat und der Pass offen ist.',
    },
    whyCorrectOverSecondBest: {
      en: 'A stays wide while the advanced still covers the left-back connection. B becomes correct only after the left back has drawn him toward the middle and the pass into that space is open.',
      hr: 'A ostaje široko dok istureni još pokriva vezu s lijevim vanjskim. B postaje točan tek kad ga je lijevi vanjski odvukao prema sredini i pas u taj prostor je otvoren.',
      de: 'A bleibt breit solange der Vorgeschobene die Verbindung zum Rückraum noch zudeckt. B wird richtig erst wenn der Rückraum ihn zur Mitte gezogen hat und der Pass in diesen Raum offen ist.',
    },
    qualityScore: 8.8,
    reviewer: {
      closestLw: 'scn_bank_942 / 967',
      closestRw: 'no direct RW 5+1 twin',
      sharedConcept: 'Advanced defender on left changes wing timing',
      criticalDifference:
        'Patient width until LB moves the 5+1 advanced off the left connection, then enter behind — not 942 ask-now under 5:1, not 967 early-entry reject without advanced geometry',
      duplicateClassification: 'UNIQUE',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
      systemRemoveLabelTest:
        'PASS — without advanced high on left connection, wait-then-enter fork collapses',
      perceptionJustification: 'true — decision depends on reading whether advanced still covers the left connection or has been moved',
    },
  },

  scn_bank_964: {
    familyKey: 'lw_entry_when_space_opens',
    teachingArea: 'entry',
    title: {
      en: 'Left Wing — Enter When the Path Opens and the Ball Can Still Arrive',
      hr: 'Lijevo krilo — uđi kad se otvori prostor i lopta još može doći',
      de: 'Linksaußen — einrücken wenn Raum entsteht und der Ball noch ankommen kann',
    },
    difficulty: 'Advanced',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 27,
    score: '14:14',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['decisionMaking', 'perception', 'timing', 'spacing'],
    situation: {
      en: "Tied 14:14 at 27' against 6:0. The left back drives your side with the ball. Your wing defender leaves the corner and steps inside toward that drive — his hips and chest turn away from you. Behind him a path toward six opens for your cut. The left back still has a free arm and his body is open enough to play the ball into that cut.",
      hr: 'Neriješeno je 14:14 u 27. minuti protiv 6:0. Lijevi vanjski s loptom prodire na tvoju stranu. Tvoj krilni branič napušta kut i ide unutra prema tom prodoru — bokovi i prsa mu se okreću od tebe. Iza njega se otvara put prema šest za tvoj ulazak. Lijevi vanjski još ima slobodnu ruku i tijelo dovoljno otvoreno da odigra loptu u taj ulazak.',
      de: 'Unentschieden 14:14 in Minute 27 gegen 6:0. Der linke Rückraum geht mit Ball auf deine Seite. Dein Außenverteidiger verlässt die Ecke und geht nach innen zum Durchbruch — Hüfte und Brust drehen sich von dir weg. Hinter ihm öffnet sich ein Weg auf sechs für deinen Einlauf. Der Rückraum hat noch einen freien Arm und den Körper offen genug um den Ball in diesen Einlauf zu spielen.',
    },
    question: {
      en: 'He leaves the corner to help inside and the left back still has a free arm — what do you do?',
      hr: 'On napušta kut da pomogne unutra a lijevi vanjski još ima slobodnu ruku — što radiš?',
      de: 'Er verlässt die Ecke zur Hilfe innen und der Rückraum hat noch einen freien Arm — was machst du?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Start the entry behind him now — while the left back can still play the ball into that cut',
          hr: 'Kreni u ulazak iza njega sada — dok lijevi vanjski još može odigrati loptu u tvoj ulazak',
          de: 'Jetzt hinter ihm einlaufen — solange der Rückraum den Ball noch in diesen Schnitt spielen kann',
        },
        feedback: {
          en: 'Correct — emptied path plus a deliverable left-back pass make the entry live.',
          hr: 'Točno — ispražnjen put plus lopta koju lijevi vanjski još može odigrati čine ulazak pravim.',
          de: 'Richtig — geleerter Weg plus ein spielbarer Pass vom Rückraum machen den Einlauf echt.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Stay wide if the left back is already under a double and has no free arm to play the cut',
          hr: 'Ostani široko ako je lijevi vanjski već pod dvojicom i nema slobodnu ruku da odigra ulazak',
          de: 'Breit bleiben wenn der Rückraum schon unter Doppel steht und keinen freien Arm hat um den Schnitt zu spielen',
        },
        feedback: {
          en: 'Valid when the ball cannot arrive; here he still has a free arm and open body.',
          hr: 'Valja kad lopta ne može doći; ovdje još ima slobodnu ruku i otvoreno tijelo.',
          de: 'Gültig wenn der Ball nicht ankommen kann; hier hat er noch freien Arm und offenen Körper.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Stay wide out of habit even though he has left the corner and the left back can still play you the ball',
          hr: 'Ostani široko iz navike iako je on napustio kut a lijevi vanjski ti još može odigrati loptu',
          de: 'Aus Gewohnheit breit bleiben obwohl er die Ecke verlassen hat und der Rückraum dir den Ball noch spielen kann',
        },
        feedback: {
          en: 'Risky — you waste a real entry that both cues already support.',
          hr: 'Rizično — propuštaš pravi ulazak koji već drže oba znaka.',
          de: 'Riskant — du verschenkst einen echten Einlauf den beide Zeichen schon tragen.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Enter early before he leaves the corner, while the left back still needs your width',
          hr: 'Uđi rano prije nego napusti kut, dok lijevi vanjski još treba tvoju širinu',
          de: 'Früh einrücken bevor er die Ecke verlässt, während der Rückraum noch deine Breite braucht',
        },
        feedback: {
          en: 'Poor — that is the opposite mistake: leaving early when width is still needed.',
          hr: 'Loše — to je suprotna greška: rani odlazak dok se širina još treba.',
          de: 'Schlecht — das ist der Gegenfehler: früh weg während Breite noch gebraucht wird.',
        },
      },
    ],
    explanation: {
      en: 'Enter only when both are true: the wing defender’s overcommit empties a real path behind him, and the left back still has a free arm to play the ball into that cut. If the left back is doubled with no free arm, stay wide. Do not enter early while he still needs your width.',
      hr: 'Uđi samo kad vrijede obje stvari: krilni branič odlaskom unutra isprazni pravi put iza sebe, i lijevi vanjski još ima slobodnu ruku da odigra loptu u taj ulazak. Ako je lijevi vanjski pod dvojicom bez slobodne ruke, ostani široko. Ne ulazi rano dok još treba tvoju širinu.',
      de: 'Nur einrücken wenn beides gilt: der Außenverteidiger leert durch Hilfe innen einen echten Weg hinter sich, und der Rückraum hat noch einen freien Arm um den Ball in diesen Schnitt zu spielen. Steht der Rückraum unter Doppel ohne freien Arm, bleib breit. Nicht früh einrücken solange er noch deine Breite braucht.',
    },
    whyCorrectOverSecondBest: {
      en: 'A enters because the path emptied and the left back can still play the ball into the cut. B becomes correct when the left back is doubled and has no free arm for that pass.',
      hr: 'A ulazi jer je put ispražnjen i lijevi vanjski još može odigrati loptu u ulazak. B postaje točan kad je lijevi vanjski pod dvojicom i nema slobodnu ruku za taj pas.',
      de: 'A läuft ein weil der Weg leer ist und der Rückraum den Ball noch in den Schnitt spielen kann. B wird richtig wenn der Rückraum unter Doppel steht und keinen freien Arm für diesen Pass hat.',
    },
    qualityScore: 8.8,
    reviewer: {
      closestLw: 'scn_bank_967',
      closestRw: 'scn_bank_890 / 893',
      sharedConcept: 'Wing entry after defender leaves corner / helps inside',
      criticalDifference:
        'Requires simultaneous LB free-arm delivery; opposite of 967; not RW 890 second-help or 893 pivot-return entry',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
    },
  },

  scn_bank_970: {
    familyKey: 'lw_def_sys_51_vs_advance',
    teachingArea: 'system_defence',
    title: {
      en: 'Left Wing — Defence: In 5:1 Do Not Extra-Chase While the Advanced Still Pressures',
      hr: 'Lijevo krilo — obrana: u 5:1 ne juri dodatno dok istureni još pritišće',
      de: 'Linksaußen — Abwehr: in der 5:1 nicht zusätzlich jagen solange der Vorgeschobene noch Druck macht',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 31,
    score: '16:15',
    defensiveSystem: '5-1',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['defence', 'decisionMaking', 'perception', 'teamplay', 'system'],
    situation: {
      en: "You lead 16:15 at 31' in your team’s 5:1. You defend left wing against their right wing. Their right back has the ball at about ten metres on your side. Your advanced defender is already high and pressuring that right back with body and arms. Their right wing stays wide near the sideline. The right back turns his chest toward that wing as if he wants the pass.",
      hr: 'Vodite 16:15 u 31. minuti u vašoj 5:1. Braniš lijevo krilo na njihovo desno krilo. Njihov desni vanjski ima loptu na oko deset metara na tvojoj strani. Vaš istureni već je visoko i tijelom i rukama pritišće tog desnog vanjskog. Njihovo desno krilo ostaje široko uz aut. Desni vanjski okreće prsa prema tom krilu kao da traži dodavanje.',
      de: 'Ihr führt 16:15 in Minute 31 in eurer 5:1. Du verteidigst Linksaußen gegen ihren Rechtsaußen. Ihr rechter Rückraum hat den Ball auf etwa zehn Metern auf deiner Seite. Euer Vorgeschobener steht schon hoch und drückt diesen Rückraum mit Körper und Armen. Ihr Rechtsaußen bleibt breit an der Seitenlinie. Der Rückraum dreht die Brust zu diesem Flügel als wollte er den Pass.',
    },
    question: {
      en: 'The advanced is still high on their right back and that wing stays wide — what do you do?',
      hr: 'Istureni je još visoko na njihovom desnom vanjskom a to krilo ostaje široko — što radiš?',
      de: 'Der Vorgeschobene ist noch hoch am rechten Rückraum und dieser Flügel bleibt breit — was machst du?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay with their right wing and close the pass — do not leave him for an extra chase on the right back',
          hr: 'Ostani na njihovom desnom krilu i zatvori dodavanje — ne napuštaj ga zbog dodatnog jurnjava na desnog vanjskog',
          de: 'Am Rechtsaußen bleiben und den Pass schließen — ihn nicht für eine Extra-Jagd auf den Rückraum verlassen',
        },
        feedback: {
          en: 'Correct — while the advanced still pressures the ball, your job is the wing.',
          hr: 'Točno — dok istureni još pritišće loptu, tvoj je posao krilo.',
          de: 'Richtig — solange der Vorgeschobene noch Druck auf den Ball macht, ist dein Job der Flügel.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Help on the right back only if the advanced has already been beaten or is out of the action',
          hr: 'Pomagni na desnom vanjskom samo ako je istureni već prođen ili ispao iz akcije',
          de: 'Nur am Rückraum helfen wenn der Vorgeschobene schon geschlagen oder aus der Aktion ist',
        },
        feedback: {
          en: 'Valid when the advanced can no longer control the ball-side action; here he is still pressuring.',
          hr: 'Valja kad istureni više ne kontrolira akciju na strani lopte; ovdje još pritišće.',
          de: 'Gültig wenn der Vorgeschobene die ballseitige Aktion nicht mehr kontrolliert; hier macht er noch Druck.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Leave their wing now and jump the right back because the drive looks dangerous',
          hr: 'Napusti njihovo krilo sada i skoči na desnog vanjskog jer prodor izgleda opasno',
          de: 'Den Flügel jetzt verlassen und auf den Rückraum springen weil der Durchbruch gefährlich wirkt',
        },
        feedback: {
          en: 'Risky — you open the wing while the advanced is still in the duel.',
          hr: 'Rizično — otvaraš krilo dok je istureni još u duelu.',
          de: 'Riskant — du öffnest den Flügel während der Vorgeschobene noch im Duell ist.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Drop deep under six and watch both without taking either job',
          hr: 'Padni duboko pod šest i gledaj oboje bez da preuzmeš ijedan posao',
          de: 'Tief unter die Sechs fallen und beide beobachten ohne einen Job zu nehmen',
        },
        feedback: {
          en: 'Poor — you give away the wing pass without helping usefully.',
          hr: 'Loše — poklanjaš dodavanje na krilo a nigdje korisno ne pomažeš.',
          de: 'Schlecht — du schenkst den Flügelpass ohne sinnvoll zu helfen.',
        },
      },
    ],
    explanation: {
      en: 'In 5:1, while your advanced defender is still high and pressuring the right back, do not add a 6:0-style chase that opens their wing. Stay on the wing and close the pass. Help on the ball only after the advanced has been beaten or is out of the action.',
      hr: 'U 5:1, dok je vaš istureni još visoko i pritišće desnog vanjskog, nemoj dodati 6:0 jurnjavu koja otvara njihovo krilo. Ostani na krilu i zatvori dodavanje. Na loptu pomaži tek kad je istureni prođen ili ispao iz akcije.',
      de: 'In der 5:1, solange euer Vorgeschobener noch hoch steht und den Rückraum drückt, keine zusätzliche 6:0-Jagd die ihren Flügel öffnet. Am Flügel bleiben und den Pass schließen. Am Ball erst helfen wenn der Vorgeschobene geschlagen oder aus der Aktion ist.',
    },
    whyCorrectOverSecondBest: {
      en: 'A stays on the wing because the advanced is still pressuring the right back. B becomes correct only when the advanced has been beaten or is out of the action.',
      hr: 'A ostaje na krilu jer istureni još pritišće desnog vanjskog. B postaje točan samo kad je istureni prođen ili ispao iz akcije.',
      de: 'A bleibt am Flügel weil der Vorgeschobene den Rückraum noch drückt. B wird richtig nur wenn der Vorgeschobene geschlagen oder aus der Aktion ist.',
    },
    qualityScore: 8.7,
    reviewer: {
      closestLw: 'scn_bank_961 / 942',
      closestRw: 'scn_bank_940 (different system)',
      sharedConcept: 'Wing responsibility under advanced/high defence',
      criticalDifference:
        '5:1: keep wing while advanced still pressures RB; help only if advanced beaten/out — geometry shown, ownership not narrated',
      duplicateClassification: 'UNIQUE',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
      systemRemoveLabelTest:
        'PASS — without advanced pressuring RB, extra-chase vs stay fork changes',
      perceptionJustification:
        'true — A/B depends on whether advanced is still active vs beaten/out of action',
      difficultyJustification:
        'Intermediate — one competing responsibility with clear active-vs-removed fork; Advanced not required',
    },
  },

  scn_bank_974: {
    familyKey: 'lw_def_handover_timing',
    teachingArea: 'handover',
    title: {
      en: 'Left Wing — Defence: Release the Runner Only After the Agreed Takeover',
      hr: 'Lijevo krilo — obrana: pusti trkača tek nakon dogovorenog preuzimanja',
      de: 'Linksaußen — Abwehr: den Läufer erst nach der vereinbarten Übernahme freigeben',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 34,
    score: '17:17',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['defence', 'decisionMaking', 'perception', 'timing'],
    situation: {
      en: "Tied 17:17 at 34' in your 6:0. Under your defensive agreement you hand over a runner only after contact and a clear call. You defend left wing and start on their right wing. That wing runs inside toward your half defender. The half is close enough to take him, but there is still no contact and no call. Their right back still has the ball. The temptation is to leave the runner early and jump the ball.",
      hr: 'Neriješeno je 17:17 u 34. minuti u vašoj 6:0. Po vašem obrambenom dogovoru trkača predajete tek nakon kontakta i jasne dojave. Braniš lijevo krilo i krećeš na njihovom desnom krilu. To krilo trči unutra prema tvom polubranitelju. Polubranitelj je dovoljno blizu da ga preuzme, ali još nema kontakta i nema dojave. Njihov desni vanjski još ima loptu. Mamac je rano napustiti trkača i skočiti na loptu.',
      de: 'Unentschieden 17:17 in Minute 34 in eurer 6:0. Nach eurer Abwehrabsprache gebt ihr einen Läufer erst nach Kontakt und klarem Ruf ab. Du verteidigst Linksaußen und startest am Rechtsaußen. Dieser Flügel läuft innen zu deinem Halben. Der Halbe ist nah genug um ihn zu übernehmen, aber es gibt noch keinen Kontakt und keinen Ruf. Ihr rechter Rückraum hat noch den Ball. Die Versuchung ist den Läufer früh zu lassen und auf den Ball zu springen.',
    },
    question: {
      en: 'He runs toward the half, and there is still no contact and no call — what do you do?',
      hr: 'On trči prema polubranitelju, a još nema kontakta ni dojave — što radiš?',
      de: 'Er läuft zum Halben, und es gibt noch keinen Kontakt und keinen Ruf — was machst du?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay with the runner — release him only after the half has contact and makes the clear call',
          hr: 'Ostani s trkačem — pusti ga tek kad polubranitelj ima kontakt i jasno javi',
          de: 'Beim Läufer bleiben — erst freigeben wenn der Halbe Kontakt hat und klar ruft',
        },
        feedback: {
          en: 'Correct — under your agreement, entering the half’s zone is not yet a handover.',
          hr: 'Točno — po vašem dogovoru ulazak u zonu polubranitelja još nije preuzimanje.',
          de: 'Richtig — nach eurer Absprache ist das Laufen in die Zone des Halben noch keine Übernahme.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Release immediately only if the half already has body contact and has made the clear call',
          hr: 'Pusti odmah samo ako polubranitelj već ima kontakt tijelom i jasno je javio',
          de: 'Sofort nur freigeben wenn der Halbe schon Körperkontakt hat und klar gerufen hat',
        },
        feedback: {
          en: 'Valid after the agreed takeover condition; here contact and call are both missing.',
          hr: 'Valja nakon dogovorenog preuzimanja; ovdje nema ni kontakta ni dojave.',
          de: 'Gültig nach der vereinbarten Übernahmebedingung; hier fehlen Kontakt und Ruf.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Leave the runner now because he entered the half’s area and jump the right back',
          hr: 'Napusti trkača sada jer je ušao u prostor polubranitelja i skoči na desnog vanjskog',
          de: 'Den Läufer jetzt lassen weil er in den Raum des Halben gelaufen ist und auf den Rückraum springen',
        },
        feedback: {
          en: 'Risky — zone entry without the agreed contact and call leaves him free.',
          hr: 'Rizično — ulazak u zonu bez dogovorenog kontakta i dojave ostavlja ga slobodnog.',
          de: 'Riskant — Zoneneintritt ohne vereinbarten Kontakt und Ruf lässt ihn frei.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Never release the runner even after clear contact and a clear call',
          hr: 'Nikad ne puštaj trkača čak ni nakon jasnog kontakta i jasne dojave',
          de: 'Den Läufer nie freigeben auch nach klarem Kontakt und klarem Ruf',
        },
        feedback: {
          en: 'Poor — once the agreed takeover is done you must release or you double the same man.',
          hr: 'Loše — kad je dogovoreno preuzimanje gotovo moraš pustiti ili udvajaš istog igrača.',
          de: 'Schlecht — ist die vereinbarte Übernahme da musst du freigeben sonst verdoppelst du denselben Mann.',
        },
      },
    ],
    explanation: {
      en: 'Under your defensive agreement you hand over a runner only after contact and a clear call. When their wing runs toward the half, stay with him until that condition is met. Entering the half’s zone alone is not enough. Release immediately only after contact and call.',
      hr: 'Po vašem obrambenom dogovoru trkača predajete tek nakon kontakta i jasne dojave. Kad njihovo krilo trči prema polubranitelju, ostani s njim dok taj uvjet nije ispunjen. Sam ulazak u zonu nije dovoljan. Pusti odmah samo nakon kontakta i dojave.',
      de: 'Nach eurer Abwehrabsprache gebt ihr einen Läufer erst nach Kontakt und klarem Ruf ab. Läuft ihr Flügel zum Halben, bleib bei ihm bis diese Bedingung erfüllt ist. Nur in die Zone laufen reicht nicht. Sofort erst freigeben nach Kontakt und Ruf.',
    },
    whyCorrectOverSecondBest: {
      en: 'A stays with the runner because the agreed contact and call are not there yet. B becomes correct only after the half already has contact and has made the clear call.',
      hr: 'A ostaje s trkačem jer dogovorenog kontakta i dojave još nema. B postaje točan tek kad polubranitelj već ima kontakt i jasno je javio.',
      de: 'A bleibt beim Läufer weil vereinbarter Kontakt und Ruf noch fehlen. B wird richtig erst wenn der Halbe schon Kontakt hat und klar gerufen hat.',
    },
    qualityScore: 8.7,
    reviewer: {
      closestLw: 'scn_bank_962 / 973',
      closestRw: 'scn_bank_880 / 928',
      sharedConcept: 'Wing/half responsibility around a moving attacker',
      criticalDifference:
        'Team-agreed takeover timing (contact+call) for releasing a runner — not close wing pass when half stuck (962), not abandon-wing reverse (973), not protect-pass + controlled help (880)',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
      difficultyJustification:
        'Intermediate — clear team-rule timing fork; Advanced not required once rule is stated',
    },
  },
};

function toBank(id, r, batchId) {
  return {
    id,
    title: r.title,
    category: 'Left Wing',
    primaryPosition: 'Left Wing',
    secondaryPositions: [],
    difficulty: r.difficulty,
    pressureLevel: r.pressureLevel,
    attackOrDefence: r.attackOrDefence,
    matchPhase: r.matchPhase,
    minute: r.minute,
    score: r.score,
    defensiveSystem: r.defensiveSystem,
    situation: r.situation,
    question: r.question,
    answers: r.answers,
    explanation: r.explanation,
    whyCorrectOverSecondBest: r.whyCorrectOverSecondBest,
    skillTags: [...r.skillTags, `family:${r.familyKey}`, `batch:${batchId}`],
    qualityScore: r.qualityScore,
  };
}

function toBatch(id, r, prev) {
  return {
    id,
    batchId: prev.batchId,
    familyKey: r.familyKey,
    teachingArea: r.teachingArea,
    title: r.title,
    difficulty: r.difficulty,
    pressureLevel: r.pressureLevel,
    attackOrDefence: r.attackOrDefence,
    matchPhase: r.matchPhase,
    minute: r.minute,
    score: r.score,
    defensiveSystem: r.defensiveSystem,
    perception: r.perception,
    handedness: r.handedness,
    numerical: r.numerical,
    gameState: r.gameState,
    skillTags: r.skillTags,
    situation: r.situation,
    question: r.question,
    answers: r.answers,
    explanation: r.explanation,
    whyCorrectOverSecondBest: r.whyCorrectOverSecondBest,
    qualityScore: r.qualityScore,
    reviewer: r.reviewer,
  };
}

for (const id of targets) {
  const r = replacements[id];
  const bIdx = batch.findIndex((s) => s.id === id);
  const prev = batch[bIdx];
  batch[bIdx] = toBatch(id, r, prev);
  const idx = bank.findIndex((s) => s.id === id);
  bank[idx] = toBank(id, r, prev.batchId);
}

// Honest matrix metadata sync for repaired families (tags follow content)
const matrixUpdates = {
  lw_sys_5plus1_trap: {
    perception: true,
    primaryTeachingObjective:
      'Against 5+1, stay wide while the advanced still covers the left LB connection; enter behind only after LB moves him toward the middle.',
    perceptionDetail: {
      cueObserved: 'advanced still covers left connection vs drawn to middle',
      decisionCaused: 'wait wide vs enter behind',
      changedCueForB: 'advanced drawn to middle + pass open → enter',
    },
  },
  lw_def_sys_51_vs_advance: {
    difficulty: 'Intermediate',
    perception: true,
    primaryTeachingObjective:
      'In 5:1, while the advanced still pressures the ball-side back, do not add a 6:0-style chase that opens the wing.',
    perceptionDetail: {
      cueObserved: 'advanced still pressuring vs beaten/out of action',
      decisionCaused: 'stay on wing vs help on ball',
      changedCueForB: 'advanced beaten/out → help on ball',
    },
  },
  lw_def_handover_timing: {
    difficulty: 'Intermediate',
    primaryTeachingObjective:
      'Under the team defensive agreement, release a runner only after the agreed takeover condition (contact + clear call).',
  },
};

for (const [fk, patch] of Object.entries(matrixUpdates)) {
  const f = matrix.remainingFamilies.find((x) => x.familyKey === fk);
  if (!f) throw new Error(`Matrix family missing: ${fk}`);
  Object.assign(f, patch);
  if (patch.difficulty) f.difficulty = patch.difficulty;
  if ('perception' in patch) f.perception = patch.perception;
}

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(batchPath, JSON.stringify(batch, null, 2) + '\n');
writeFileSync(matrixPath, JSON.stringify(matrix, null, 2) + '\n');

const bank2 = JSON.parse(readFileSync(bankPath, 'utf8'));
for (const [k, pos] of Object.entries({
  LB: 'Left Back',
  RB: 'Right Back',
  CB: 'Centre Back',
  RW: 'Right Wing',
})) {
  if (hash(bank2.filter((s) => s.primaryPosition === pos)) !== lock[k]) {
    throw new Error(`Lock broken after closure: ${k}`);
  }
}
for (const [id, h] of Object.entries(lock.seeds)) {
  const cur = hash(bank2.find((s) => s.id === id));
  if (targets.has(id)) {
    if (cur === h) throw new Error(`Target not changed: ${id}`);
  } else if (cur !== h) {
    throw new Error(`Protected mutated: ${id}`);
  }
}
if (bank2.some((s) => s.id === 'scn_bank_975')) throw new Error('975 exists');

console.log('Gold closure applied to', [...targets].join(', '));
