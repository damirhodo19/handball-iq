#!/usr/bin/env node
/**
 * Phase B surgical repair: rewrite ONLY 963, 964, 970, 974.
 * Does not touch any other scenario.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const batchPath = join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-b.json');
const lockPath = join(root, 'scripts/.lw-batch-b-surgical-lock-before.json');

const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));

const hash = (v) => crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hashPos = (pos) => hash(bank.filter((s) => s.primaryPosition === pos));

for (const [k, pos] of Object.entries({
  LB: 'Left Back',
  RB: 'Right Back',
  CB: 'Centre Back',
  RW: 'Right Wing',
})) {
  if (hashPos(pos) !== lock[k]) throw new Error(`Lock changed before repair: ${k}`);
}

const protectedIds = Object.keys(lock.seeds).filter(
  (id) => !['scn_bank_963', 'scn_bank_964', 'scn_bank_970', 'scn_bank_974'].includes(id),
);
for (const id of protectedIds) {
  const cur = hash(bank.find((s) => s.id === id));
  if (cur !== lock.seeds[id]) throw new Error(`Protected scenario changed before repair: ${id}`);
}

/** @type {Record<string, any>} */
const replacements = {
  scn_bank_963: {
    familyKey: 'lw_sys_5plus1_trap',
    teachingArea: 'system',
    title: {
      en: 'Left Wing — Refuse the Baited Wide Finish Against 5+1',
      hr: 'Lijevo krilo — odbij namamljeni široki završetak protiv 5+1',
      de: 'Linksaußen — den gelockten breiten Abschluss gegen 5+1 ablehnen',
    },
    difficulty: 'Advanced',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 23,
    score: '12:12',
    defensiveSystem: '5+1',
    perception: false,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['decisionMaking', 'spacing', 'teamplay', 'system'],
    situation: {
      en: "Tied 12:12 at 23' against 5+1. Their advanced defender is already high between you and the left back on the left side. Their wing defender also covers the wide finish angle on the sideline. The left back has the ball and looks to play you for a wide finish. From the corner it looks empty enough to attack.",
      hr: 'Neriješeno je 12:12 u 23. minuti protiv 5+1. Njihov istureni branič već je visoko između tebe i lijevog vanjskog na lijevoj strani. Njihov krilni branič također pokriva kut širokog završetka uz aut. Lijevi vanjski ima loptu i gleda da te igra za široki završetak. Iz kuta izgleda dovoljno prazno za napad.',
      de: 'Unentschieden 12:12 in Minute 23 gegen 5+1. Ihr vorgeschobener Verteidiger steht schon hoch zwischen dir und dem linken Rückraum auf der linken Seite. Ihr Außenverteidiger deckt auch den Winkel für den breiten Abschluss an der Seitenlinie. Der linke Rückraum hat den Ball und will dich für den breiten Abschluss bedienen. Aus der Ecke wirkt es leer genug zum Angreifen.',
    },
    question: {
      en: 'The left back looks to play you wide while their advanced defender is still high on your side — what first?',
      hr: 'Lijevi vanjski te gleda za široku loptu dok im je istureni još visoko na tvojoj strani — što prvo?',
      de: 'Der linke Rückraum will dich breit bedienen während ihr Vorgeschobener noch hoch auf deiner Seite steht — was zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Refuse the wide finish now — recycle with the left back and keep left structure while the advanced defender is still on your side',
          hr: 'Odbij široki završetak sada — vrati loptu s lijevim vanjskim i drži lijevu strukturu dok je istureni još na tvojoj strani',
          de: 'Den breiten Abschluss jetzt ablehnen — mit dem linken Rückraum zurückspielen und die linke Struktur halten solange der Vorgeschobene noch auf deiner Seite ist',
        },
        feedback: {
          en: 'Correct — that wide finish feeds the 5+1 advanced and the wing defender together.',
          hr: 'Točno — taj široki završetak hrani isturenog u 5+1 i krilnog braniča zajedno.',
          de: 'Richtig — dieser breite Abschluss füttert den Vorgeschobenen in der 5+1 und den Außenverteidiger zusammen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Take the wide finish only if the advanced defender has already left your side toward the middle or the pivot',
          hr: 'Uzmi široki završetak samo ako je istureni već napustio tvoju stranu prema sredini ili pivotu',
          de: 'Den breiten Abschluss nur nehmen wenn der Vorgeschobene deine Seite schon Richtung Mitte oder Kreisläufer verlassen hat',
        },
        feedback: {
          en: 'Valid once the advanced leaves your side; here he is still high between you and the left back.',
          hr: 'Valja kad istureni napusti tvoju stranu; ovdje je još visoko između tebe i lijevog vanjskog.',
          de: 'Gültig sobald der Vorgeschobene deine Seite verlässt; hier steht er noch hoch zwischen dir und dem Rückraum.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force the wide finish now because the corner looks empty',
          hr: 'Forsiraj široki završetak sada jer kut izgleda prazan',
          de: 'Den breiten Abschluss jetzt erzwingen weil die Ecke leer wirkt',
        },
        feedback: {
          en: 'Risky — the empty look is what the 5+1 uses to pull you into both defenders.',
          hr: 'Rizično — taj prazan izgled 5+1 koristi da te uvuče u oba braniča.',
          de: 'Riskant — die leere Optik nutzt die 5+1 um dich in beide Verteidiger zu ziehen.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Cut inside into the advanced defender to create space for the left back',
          hr: 'Siječi unutra u isturenog braniča da otvoriš prostor lijevom vanjskom',
          de: 'Nach innen gegen den Vorgeschobenen schneiden um Raum für den Rückraum zu schaffen',
        },
        feedback: {
          en: 'Poor — you walk straight into the defender who is already set on your connection.',
          hr: 'Loše — ideš ravno u braniča koji je već postavljen na vašu vezu.',
          de: 'Schlecht — du läufst direkt in den Verteidiger der schon auf eure Verbindung steht.',
        },
      },
    ],
    explanation: {
      en: 'Against 5+1 the advanced defender on your side changes the wide finish. If he is still high between you and the left back, and the wing defender also covers the finish angle, refuse that action and recycle. Attack wide only after the advanced has left your side.',
      hr: 'Protiv 5+1 istureni na tvojoj strani mijenja široki završetak. Ako je još visoko između tebe i lijevog vanjskog, a krilni branič također pokriva kut završetka, odbij tu akciju i vrati loptu. Široko napadaj tek kad istureni napusti tvoju stranu.',
      de: 'Gegen 5+1 verändert der Vorgeschobene auf deiner Seite den breiten Abschluss. Steht er noch hoch zwischen dir und dem Rückraum und deckt der Außenverteidiger auch den Abschlusswinkel, lehne die Aktion ab und spiele zurück. Breit angreifen erst wenn der Vorgeschobene deine Seite verlassen hat.',
    },
    whyCorrectOverSecondBest: {
      en: 'A refuses the wide finish while the advanced is still high on your side. B becomes correct only after that advanced has left your side toward the middle or pivot.',
      hr: 'A odbija široki završetak dok je istureni još visoko na tvojoj strani. B postaje točan tek kad je taj istureni napustio tvoju stranu prema sredini ili pivotu.',
      de: 'A lehnt den breiten Abschluss ab solange der Vorgeschobene noch hoch auf deiner Seite steht. B wird richtig erst wenn dieser Vorgeschobene deine Seite Richtung Mitte oder Kreisläufer verlassen hat.',
    },
    qualityScore: 8.7,
    reviewer: {
      closestLw: 'scn_bank_942',
      closestRw: 'no direct RW 5+1 twin',
      sharedConcept: 'Advanced defender on left side changes wing action',
      criticalDifference: 'Refuse baited wide finish into 5+1 advanced+WD vs 942 ask-now under 5:1 pressure',
      duplicateClassification: 'UNIQUE',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
      systemRemoveLabelTest: 'PASS — without advanced high on left side, refuse-finish fork disappears',
      mirror: 'UNIVERSAL_ESSENTIAL — no RW 5+1 attack twin',
    },
  },

  scn_bank_964: {
    familyKey: 'lw_entry_when_space_opens',
    teachingArea: 'entry',
    title: {
      en: 'Left Wing — Enter Only When Space Opens and the Left Back Can Still Feed You',
      hr: 'Lijevo krilo — uđi samo kad se prostor otvori i lijevi vanjski te još može nahraniti',
      de: 'Linksaußen — nur einrücken wenn Raum entsteht und der Rückraum dich noch bedienen kann',
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
      en: "Tied 14:14 at 27' against 6:0. The left back drives your side with the ball. Your wing defender leaves the corner and steps inside toward that drive — his hips and chest turn away from you. Behind him a path toward six opens for your cut. The left back still has a free arm and his body is open enough to pass into that cut.",
      hr: 'Neriješeno je 14:14 u 27. minuti protiv 6:0. Lijevi vanjski s loptom prodire na tvoju stranu. Tvoj krilni branič napušta kut i ide unutra prema tom prodoru — bokovi i prsa mu se okreću od tebe. Iza njega se otvara put prema šest za tvoj ulazak. Lijevi vanjski još ima slobodnu ruku i tijelo dovoljno otvoreno da doda u taj ulazak.',
      de: 'Unentschieden 14:14 in Minute 27 gegen 6:0. Der linke Rückraum geht mit Ball auf deine Seite. Dein Außenverteidiger verlässt die Ecke und geht nach innen zum Durchbruch — Hüfte und Brust drehen sich von dir weg. Hinter ihm öffnet sich ein Weg auf sechs für deinen Einlauf. Der Rückraum hat noch einen freien Arm und den Körper offen genug um in diesen Einlauf zu passen.',
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
          en: 'Start the entry behind him now — while the left back can still feed that cut',
          hr: 'Kreni u ulazak iza njega sada — dok te lijevi vanjski još može nahraniti u taj ulazak',
          de: 'Jetzt hinter ihm einlaufen — solange der Rückraum diesen Schnitt noch bedienen kann',
        },
        feedback: {
          en: 'Correct — emptied path plus a deliverable left-back pass make the entry live.',
          hr: 'Točno — ispražnjen put plus dodavanje koje lijevi vanjski još može izvesti čine ulazak živim.',
          de: 'Richtig — geleerter Weg plus ein bedienbarer Pass vom Rückraum machen den Einlauf lebendig.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Stay wide if the left back is already under a double and has no free arm to deliver the cut',
          hr: 'Ostani široko ako je lijevi vanjski već pod dvojicom i nema slobodnu ruku za dodavanje u ulazak',
          de: 'Breit bleiben wenn der Rückraum schon unter Doppel steht und keinen freien Arm für den Schnittpass hat',
        },
        feedback: {
          en: 'Valid when delivery is gone; here he still has a free arm and open body.',
          hr: 'Valja kad nema dodavanja; ovdje još ima slobodnu ruku i otvoreno tijelo.',
          de: 'Gültig wenn die Zuspielmöglichkeit weg ist; hier hat er noch freien Arm und offenen Körper.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Stay wide out of habit even though he has left the corner and the left back can still feed you',
          hr: 'Ostani široko iz navike iako je on napustio kut a lijevi vanjski te još može nahraniti',
          de: 'Aus Gewohnheit breit bleiben obwohl er die Ecke verlassen hat und der Rückraum dich noch bedienen kann',
        },
        feedback: {
          en: 'Risky — you waste a real entry that both cues already support.',
          hr: 'Rizično — bacaš pravi ulazak koji već podržavaju oba znaka.',
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
      en: 'Enter only when both are true: the wing defender’s overcommit empties a real path behind him, and the left back still has a free arm to feed that cut. If the left back is doubled with no free arm, stay wide. Do not enter early while he still needs your width.',
      hr: 'Uđi samo kad vrijede obje stvari: krilni branič odlaskom unutra isprazni pravi put iza sebe, i lijevi vanjski još ima slobodnu ruku za dodavanje u taj ulazak. Ako je lijevi vanjski pod dvojicom bez slobodne ruke, ostani široko. Ne ulazi rano dok još treba tvoju širinu.',
      de: 'Nur einrücken wenn beides gilt: der Außenverteidiger leert durch Hilfe innen einen echten Weg hinter sich, und der Rückraum hat noch einen freien Arm für diesen Schnitt. Steht der Rückraum unter Doppel ohne freien Arm, bleib breit. Nicht früh einrücken solange er noch deine Breite braucht.',
    },
    whyCorrectOverSecondBest: {
      en: 'A enters because the path emptied and the left back can still deliver. B becomes correct when the left back is doubled and has no free arm for that cut.',
      hr: 'A ulazi jer je put ispražnjen i lijevi vanjski još može dodati. B postaje točan kad je lijevi vanjski pod dvojicom i nema slobodnu ruku za taj ulazak.',
      de: 'A läuft ein weil der Weg leer ist und der Rückraum noch bedienen kann. B wird richtig wenn der Rückraum unter Doppel steht und keinen freien Arm für diesen Schnitt hat.',
    },
    qualityScore: 8.7,
    reviewer: {
      closestLw: 'scn_bank_967',
      closestRw: 'scn_bank_890 / 893',
      sharedConcept: 'Wing entry after defender leaves corner / helps inside',
      criticalDifference:
        'Requires simultaneous LB free-arm delivery; opposite of 967 (do-not-enter); not RW 890 second-help or 893 pivot-return entry',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 4,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
      comparisonSentences: {
        vs967: '967: do not enter while LB still needs width; 964: enter when WD overcommit empties a path LB can still feed.',
        vs890: '890: enter after the second inside help with half on pivot; 964: first overcommit + LB free-arm delivery, no second-help requirement.',
        vs893: '893: enter behind WD for pivot return after WD leaves for pivot; 964: enter on LB delivery after WD helps the LB drive.',
      },
      mirror: 'UNIVERSAL_ESSENTIAL — related RW entries use different co-cues',
    },
  },

  scn_bank_970: {
    familyKey: 'lw_def_sys_51_vs_advance',
    teachingArea: 'system_defence',
    title: {
      en: 'Left Wing — Defence: In 5:1 Do Not Chase the Drive Lane the Advanced Already Owns',
      hr: 'Lijevo krilo — obrana: u 5:1 ne juri liniju prodora koju istureni već drži',
      de: 'Linksaußen — Abwehr: in der 5:1 nicht die Durchbruchbahn jagen die der Vorgeschobene schon besitzt',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 31,
    score: '16:15',
    defensiveSystem: '5-1',
    perception: false,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['defence', 'decisionMaking', 'teamplay', 'system'],
    situation: {
      en: "You lead 16:15 at 31' in your team’s 5:1. You defend left wing. Their right back has the ball in the left channel at about ten metres. Your advanced defender is already high on that same left channel and owns the drive lane. Their right wing — your man — is still wide near the sideline ready for the pass. The drive looks dangerous enough that a 6:0 habit would pull you inside.",
      hr: 'Vodite 16:15 u 31. minuti u vašoj 5:1. Braniš lijevo krilo. Njihov desni vanjski ima loptu u lijevom prostoru na oko deset metara. Vaš istureni branič već je visoko na tom istom lijevom prostoru i drži liniju prodora. Njihovo desno krilo — tvoj čovjek — još je široko uz aut spremno za dodavanje. Prodor izgleda dovoljno opasno da bi te 6:0 navika vukla unutra.',
      de: 'Ihr führt 16:15 in Minute 31 in eurer 5:1. Du verteidigst Linksaußen. Ihr rechter Rückraum hat den Ball im linken Raum auf etwa zehn Metern. Euer vorgeschobener Verteidiger steht schon hoch in genau diesem linken Raum und besitzt die Durchbruchbahn. Ihr Rechtsaußen — dein Mann — steht noch breit an der Seitenlinie bereit für den Pass. Der Durchbruch wirkt gefährlich genug dass dich die 6:0-Gewohnheit nach innen ziehen würde.',
    },
    question: {
      en: 'Your advanced is already high on the left drive lane and their wing is still wide — what is your job?',
      hr: 'Vaš istureni već je visoko na lijevoj liniji prodora a njihovo krilo je još široko — što je tvoj posao?',
      de: 'Euer Vorgeschobener steht schon hoch auf der linken Durchbruchbahn und ihr Flügel steht noch breit — was ist dein Job?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay on their right wing and deny that pass — do not chase into the channel the advanced already owns',
          hr: 'Ostani na njihovom desnom krilu i zatvori to dodavanje — ne juri u prostor koji istureni već drži',
          de: 'Am Rechtsaußen bleiben und diesen Pass verhindern — nicht in den Raum jagen den der Vorgeschobene schon besitzt',
        },
        feedback: {
          en: 'Correct — in 5:1 that channel is his job; yours is still the wing.',
          hr: 'Točno — u 5:1 taj je prostor njegov posao; tvoj je i dalje krilo.',
          de: 'Richtig — in der 5:1 ist dieser Raum sein Job; deiner bleibt der Flügel.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Help inside on that channel only if the advanced defender has already left your side completely',
          hr: 'Pomagni unutra na tom prostoru samo ako je istureni već potpuno napustio tvoju stranu',
          de: 'Nur innen in diesem Raum helfen wenn der Vorgeschobene deine Seite schon komplett verlassen hat',
        },
        feedback: {
          en: 'Valid when the advanced is gone from your side; here he already owns the channel.',
          hr: 'Valja kad isturenog nema na tvojoj strani; ovdje on već drži taj prostor.',
          de: 'Gültig wenn der Vorgeschobene von deiner Seite weg ist; hier besitzt er den Raum schon.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Leave their wing and jump the right-back drive because it looks dangerous',
          hr: 'Napusti njihovo krilo i skoči na prodor desnog vanjskog jer izgleda opasno',
          de: 'Den Flügel verlassen und in den Durchbruch des Rückraums springen weil er gefährlich wirkt',
        },
        feedback: {
          en: 'Risky — you abandon your man to do a job the advanced already has.',
          hr: 'Rizično — napuštaš svog čovjeka da radiš posao koji istureni već ima.',
          de: 'Riskant — du verlässt deinen Mann um einen Job zu machen den der Vorgeschobene schon hat.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Ignore both the wing and the channel and drop deep under the six',
          hr: 'Zanemari i krilo i prostor i padni duboko pod šest',
          de: 'Sowohl Flügel als auch Raum ignorieren und tief unter die Sechs fallen',
        },
        feedback: {
          en: 'Poor — you give away the wing pass without helping anywhere useful.',
          hr: 'Loše — poklanjaš dodavanje na krilo a nigdje korisno ne pomažeš.',
          de: 'Schlecht — du schenkst den Flügelpass ohne irgendwo sinnvoll zu helfen.',
        },
      },
    ],
    explanation: {
      en: 'In 5:1 the advanced defender owns the left channel when he is already high there. Your first job stays their right wing. Do not chase that channel with a 6:0 help habit. Help inside only if the advanced has left your side completely.',
      hr: 'U 5:1 istureni drži lijevi prostor kad je već visoko tamo. Tvoj prvi posao ostaje njihovo desno krilo. Ne juri taj prostor iz 6:0 navike pomaganja. Unutra pomaži samo ako je istureni potpuno napustio tvoju stranu.',
      de: 'In der 5:1 besitzt der Vorgeschobene den linken Raum wenn er dort schon hoch steht. Dein erster Job bleibt ihr Rechtsaußen. Diesen Raum nicht mit 6:0-Hilfegewohnheit jagen. Innen nur helfen wenn der Vorgeschobene deine Seite komplett verlassen hat.',
    },
    whyCorrectOverSecondBest: {
      en: 'A holds the wing because the advanced already owns the left channel. B becomes correct only when the advanced has left your side completely.',
      hr: 'A drži krilo jer istureni već drži lijevi prostor. B postaje točan samo kad je istureni potpuno napustio tvoju stranu.',
      de: 'A hält den Flügel weil der Vorgeschobene den linken Raum schon besitzt. B wird richtig nur wenn der Vorgeschobene deine Seite komplett verlassen hat.',
    },
    qualityScore: 8.6,
    reviewer: {
      closestLw: 'scn_bank_961 / 942',
      closestRw: 'scn_bank_940 (1:5 defence — different system)',
      sharedConcept: 'Wing responsibility under high/advanced defence',
      criticalDifference:
        '5:1 ownership: stay on wing because advanced owns channel; not 6:0 basic wing job (961); not attack ask-now (942); not 1:5 chase (940)',
      duplicateClassification: 'UNIQUE',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 3,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
      systemRemoveLabelTest: 'PASS — without advanced owning the channel, stay-vs-help fork changes',
      mirror: 'UNIVERSAL_ESSENTIAL — no RW 5:1 defence twin with same fork',
    },
  },

  scn_bank_974: {
    familyKey: 'lw_def_handover_timing',
    teachingArea: 'handover',
    title: {
      en: 'Left Wing — Defence: Release the Runner Only After Real Handover',
      hr: 'Lijevo krilo — obrana: pusti trkača tek nakon pravog preuzimanja',
      de: 'Linksaußen — Abwehr: den Läufer erst nach echter Übernahme freigeben',
    },
    difficulty: 'Advanced',
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
      en: "Tied 17:17 at 34' in your 6:0. You defend left wing and own their right wing. That wing starts an inside run toward your half defender’s zone. Your half is close enough to take him, but he has not made contact yet and has not called ownership. Their right back still has the ball. The temptation is to leave the runner early and jump the ball.",
      hr: 'Neriješeno je 17:17 u 34. minuti u vašoj 6:0. Braniš lijevo krilo i čuvaš njihovo desno krilo. To krilo kreće unutra prema zoni tvog polubranitelja. Polubranitelj je dovoljno blizu da ga preuzme, ali još nije napravio kontakt i nije javio da ga drži. Njihov desni vanjski još ima loptu. Mamac je rano napustiti trkača i skočiti na loptu.',
      de: 'Unentschieden 17:17 in Minute 34 in eurer 6:0. Du verteidigst Linksaußen und besitzt ihren Rechtsaußen. Dieser Flügel startet einen Innenlauf in die Zone deines Halben. Dein Halber ist nah genug um ihn zu übernehmen, hat aber noch keinen Kontakt und hat Besitz nicht gerufen. Ihr rechter Rückraum hat noch den Ball. Die Versuchung ist den Läufer früh zu lassen und auf den Ball zu springen.',
    },
    question: {
      en: 'Their wing runs toward the half, and the half has no contact and has not called — what do you do?',
      hr: 'Njihovo krilo trči prema polubranitelju, a polubranitelj nema kontakt i nije javio — što radiš?',
      de: 'Ihr Flügel läuft zum Halben, und der Halbe hat keinen Kontakt und hat nicht gerufen — was machst du?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Stay with the runner — release him only after the half has contact and calls ownership',
          hr: 'Ostani s trkačem — pusti ga tek kad polubranitelj ima kontakt i javi da ga drži',
          de: 'Beim Läufer bleiben — erst freigeben wenn der Halbe Kontakt hat und Besitz ruft',
        },
        feedback: {
          en: 'Correct — entering the half’s zone is not yet a handover.',
          hr: 'Točno — ulazak u zonu polubranitelja još nije preuzimanje.',
          de: 'Richtig — das Laufen in die Zone des Halben ist noch keine Übernahme.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Release immediately only if the half already has body contact and has called that he has him',
          hr: 'Pusti odmah samo ako polubranitelj već ima kontakt tijelom i javio je da ga drži',
          de: 'Sofort nur freigeben wenn der Halbe schon Körperkontakt hat und gerufen hat dass er ihn hat',
        },
        feedback: {
          en: 'Valid after real contact plus call; here neither has happened yet.',
          hr: 'Valja nakon pravog kontakta plus dojave; ovdje se još nije dogodilo ni jedno.',
          de: 'Gültig nach echtem Kontakt plus Ruf; hier ist noch nichts davon passiert.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Leave the runner now because he has entered the half’s area and jump the right back',
          hr: 'Napusti trkača sada jer je ušao u prostor polubranitelja i skoči na desnog vanjskog',
          de: 'Den Läufer jetzt lassen weil er in den Raum des Halben gelaufen ist und auf den Rückraum springen',
        },
        feedback: {
          en: 'Risky — zone entry without contact and call leaves the runner free.',
          hr: 'Rizično — ulazak u zonu bez kontakta i dojave ostavlja trkača slobodnog.',
          de: 'Riskant — Zoneneintritt ohne Kontakt und Ruf lässt den Läufer frei.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Never release the runner even after clear contact and a clear ownership call',
          hr: 'Nikad ne puštaj trkača čak ni nakon jasnog kontakta i jasne dojave preuzimanja',
          de: 'Den Läufer nie freigeben auch nach klarem Kontakt und klarem Übernahme-Ruf',
        },
        feedback: {
          en: 'Poor — once handover is real you must release or you double the same man.',
          hr: 'Loše — kad je preuzimanje stvarno moraš pustiti ili udvajaš istog čovjeka.',
          de: 'Schlecht — ist die Übernahme real musst du freigeben sonst verdoppelst du denselben Mann.',
        },
      },
    ],
    explanation: {
      en: 'You start as owner of their right wing. When he runs into the half’s zone, wait for real handover: contact plus ownership call. Do not release just because he entered that zone. Release immediately only after contact and call are both there.',
      hr: 'Ti počinješ kao vlasnik njihovog desnog krila. Kad trči u zonu polubranitelja, čekaj pravo preuzimanje: kontakt plus dojava. Ne puštaj samo zato što je ušao u tu zonu. Pusti odmah samo kad su i kontakt i dojava tu.',
      de: 'Du startest als Besitzer ihres Rechtsaußen. Läuft er in die Zone des Halben, warte auf echte Übernahme: Kontakt plus Ruf. Nicht freigeben nur weil er in diese Zone gelaufen ist. Sofort erst freigeben wenn Kontakt und Ruf beide da sind.',
    },
    whyCorrectOverSecondBest: {
      en: 'A holds the runner because contact and call are not there yet. B becomes correct only after the half already has contact and has called ownership.',
      hr: 'A drži trkača jer kontakta i dojave još nema. B postaje točan tek kad polubranitelj već ima kontakt i javio je preuzimanje.',
      de: 'A hält den Läufer weil Kontakt und Ruf noch fehlen. B wird richtig erst wenn der Halbe schon Kontakt hat und Besitz gerufen hat.',
    },
    qualityScore: 8.7,
    reviewer: {
      closestLw: 'scn_bank_962 / 973',
      closestRw: 'scn_bank_880 / 928',
      sharedConcept: 'Wing/half responsibility around a moving attacker',
      criticalDifference:
        'Central teaching is WHEN ownership transfers (contact+call), not close wing pass when half stuck (962), not abandon-wing reverse (973), not protect-pass + controlled help cocktail (880)',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 4,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
      ownershipFrames: {
        frame1: 'LW owns opp RW',
        frame2: 'opp RW runs into half zone',
        frame3: 'half capable but no contact/call — decision NOW',
        frame4: 'contact + call → B correct',
      },
      mirror: 'UNIVERSAL_ESSENTIAL — not identical to RW 880',
    },
  },
};

function toBankScenario(id, r) {
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
    skillTags: [...r.skillTags, `family:${r.familyKey}`, 'batch:lw_batch_b_01'],
    qualityScore: r.qualityScore,
  };
}

function toBatchEntry(id, r, prev) {
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

const TARGETS = ['scn_bank_963', 'scn_bank_964', 'scn_bank_970', 'scn_bank_974'];

for (const id of TARGETS) {
  const idx = bank.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error(`Missing ${id}`);
  bank[idx] = toBankScenario(id, replacements[id]);

  const bIdx = batch.findIndex((s) => s.id === id);
  if (bIdx < 0) throw new Error(`Missing batch ${id}`);
  batch[bIdx] = toBatchEntry(id, replacements[id], batch[bIdx]);
}

// Fix batch tags to keep original batch ids per scenario
for (const id of TARGETS) {
  const b = batch.find((s) => s.id === id);
  const bankScn = bank.find((s) => s.id === id);
  bankScn.skillTags = bankScn.skillTags.map((t) =>
    String(t).startsWith('batch:') ? `batch:${b.batchId}` : t,
  );
}

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(batchPath, JSON.stringify(batch, null, 2) + '\n');

// Post verification
const bank2 = JSON.parse(readFileSync(bankPath, 'utf8'));
for (const [k, pos] of Object.entries({
  LB: 'Left Back',
  RB: 'Right Back',
  CB: 'Centre Back',
  RW: 'Right Wing',
})) {
  const h = hash(bank2.filter((s) => s.primaryPosition === pos));
  if (h !== lock[k]) throw new Error(`Lock broken after repair: ${k}`);
}
for (const id of protectedIds) {
  const cur = hash(bank2.find((s) => s.id === id));
  if (cur !== lock.seeds[id]) throw new Error(`Protected scenario mutated: ${id}`);
}
for (const id of TARGETS) {
  const cur = hash(bank2.find((s) => s.id === id));
  if (cur === lock.seeds[id]) throw new Error(`Target not changed: ${id}`);
}
if (bank2.some((s) => s.id === 'scn_bank_975')) throw new Error('975 must not exist');

console.log('Applied surgical repair to', TARGETS.join(', '));
console.log(
  'Changed hashes:',
  TARGETS.map((id) => id + ':' + hash(bank2.find((s) => s.id === id)).slice(0, 12)).join(' '),
);
