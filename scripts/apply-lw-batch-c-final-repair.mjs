#!/usr/bin/env node
/**
 * Batch C final repair:
 * - Replace 975, 977
 * - Polish 976, 978, 979
 * - Keep 980, 981 byte-identical
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const batchPath = join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-c.json');
const matrixPath = join(root, 'scripts/lw-gold-full-family-matrix.json');
const lockPath = join(root, 'scripts/.lw-batch-c-repair-lock-before.json');

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
  if (hashPos(pos) !== lock[k]) throw new Error(`Lock broken before repair: ${k}`);
}
for (const [id, h] of Object.entries(lock.seeds941to974)) {
  if (hash(bank.find((s) => s.id === id)) !== h) throw new Error(`941-974 changed: ${id}`);
}
for (const id of ['scn_bank_980', 'scn_bank_981']) {
  if (hash(bank.find((s) => s.id === id)) !== lock.seedsKeepC[id]) {
    throw new Error(`Must-keep C scenario changed before repair: ${id}`);
  }
}

const replacements = {
  scn_bank_975: {
    familyKey: 'lw_def_backdoor_deny',
    teachingArea: 'set_defence',
    title: {
      en: 'Left Wing — Defence: Do Not Let the Drive Pull You Off the Back-Door',
      hr: 'Lijevo krilo — obrana: ne daj da te prodor skine s ulaska iza leđa',
      de: 'Linksaußen — Abwehr: lass dich vom Durchbruch nicht vom Hinterlaufen lösen',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 28,
    score: '14:14',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['defence', 'decisionMaking', 'perception', 'timing'],
    situation: {
      en: "Tied 14:14 at 28' in your 6:0. You defend left wing with body contact on their right wing. Their right back drives hard into the half. Your eyes go with that drive. At the same moment their right wing starts a cut behind your back toward six. Your half is on the drive and has not taken the wing runner.",
      hr: 'Neriješeno je 14:14 u 28. minuti u vašoj 6:0. Braniš lijevo krilo s kontaktom na njihovom desnom krilu. Njihov desni vanjski jako prodire u polubranitelja. Oči ti idu s tim prodorom. U istom trenutku njihovo desno krilo kreće iza tvojih leđa prema šest. Polubranitelj je na prodoru i nije preuzeo krilnog trkača.',
      de: 'Unentschieden 14:14 in Minute 28 in eurer 6:0. Du verteidigst Linksaußen mit Körperkontakt am Rechtsaußen. Ihr rechter Rückraum geht hart in den Halben. Deine Augen gehen mit diesem Durchbruch. Im gleichen Moment startet ihr Rechtsaußen einen Schnitt hinter deinem Rücken auf sechs. Dein Halber ist am Durchbruch und hat den Flügelläufer nicht übernommen.',
    },
    question: {
      en: 'The drive pulls your eyes and their wing cuts behind you — what first?',
      hr: 'Prodor vuče oči a njihovo krilo siječe iza tebe — što prvo?',
      de: 'Der Durchbruch zieht deine Augen und ihr Flügel schneidet hinter dir — was zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Keep contact and deny the cut behind you — do not fully chase the drive',
          hr: 'Drži kontakt i zatvori ulazak iza leđa — ne juri potpuno na prodor',
          de: 'Kontakt halten und den Schnitt hinter dir verhindern — den Durchbruch nicht voll jagen',
        },
        feedback: {
          en: 'Correct — losing contact for the drive gifts the back-door.',
          hr: 'Točno — gubitak kontakta zbog prodora poklanja ulazak iza leđa.',
          de: 'Richtig — Kontaktverlust wegen des Durchbruchs schenkt das Hinterlaufen.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Leave the runner only if the half already has contact and has called that he has him',
          hr: 'Pusti trkača samo ako polubranitelj već ima kontakt i javio je da ga drži',
          de: 'Den Läufer nur lassen wenn der Halbe schon Kontakt hat und gerufen hat dass er ihn hat',
        },
        feedback: {
          en: 'Valid after real takeover; here the half is still on the drive.',
          hr: 'Valja nakon pravog preuzimanja; ovdje je polubranitelj još na prodoru.',
          de: 'Gültig nach echter Übernahme; hier ist der Halbe noch am Durchbruch.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Jump the right-back drive fully and trust someone else sees the cut',
          hr: 'Potpuno skoči na prodor desnog vanjskog i vjeruj da će netko drugi vidjeti ulazak',
          de: 'Voll in den Durchbruch des Rückraums springen und vertrauen dass jemand den Schnitt sieht',
        },
        feedback: {
          en: 'Risky — the cut behind you is free once contact dies.',
          hr: 'Rizično — ulazak iza tebe je slobodan čim kontakt padne.',
          de: 'Riskant — der Schnitt hinter dir ist frei sobald der Kontakt weg ist.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Drop under six without contact and watch both',
          hr: 'Padni pod šest bez kontakta i gledaj oboje',
          de: 'Ohne Kontakt unter die Sechs fallen und beide beobachten',
        },
        feedback: {
          en: 'Poor — you surrender the runner without a fight.',
          hr: 'Loše — predaješ trkača bez borbe.',
          de: 'Schlecht — du gibst den Läufer ohne Kampf auf.',
        },
      },
    ],
    explanation: {
      en: 'When the drive pulls your eyes, keep contact on the wing and deny the back-door cut. Do not fully chase the ball. Leave that runner only after a real takeover.',
      hr: 'Kad ti prodor vuče oči, drži kontakt na krilu i zatvori ulazak iza leđa. Ne juri potpuno loptu. Pusti tog trkača tek nakon pravog preuzimanja.',
      de: 'Wenn der Durchbruch deine Augen zieht, halte Kontakt am Flügel und verhindere das Hinterlaufen. Den Ball nicht voll jagen. Diesen Läufer erst nach echter Übernahme lassen.',
    },
    whyCorrectOverSecondBest: {
      en: 'A keeps contact because the drive has pulled the eyes and no takeover exists. B becomes correct only after the half has contact and has called ownership.',
      hr: 'A drži kontakt jer je prodor povukao oči a preuzimanja nema. B postaje točan tek kad polubranitelj ima kontakt i javio je da ga drži.',
      de: 'A hält Kontakt weil der Durchbruch die Augen gezogen hat und keine Übernahme da ist. B wird richtig erst wenn der Halbe Kontakt hat und Besitz gerufen hat.',
    },
    qualityScore: 8.7,
    reviewer: {
      closestLw: 'scn_bank_976 / 974',
      closestRw: 'scn_bank_932 / 934',
      sharedConcept: 'Deny wing runner path',
      criticalDifference:
        'Drive pulls eyes + maintain contact on back-door — not ball-watch entry start (976), not handover release timing alone (974)',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'CONTEXTUALLY_LW_NATIVE',
      coachRisk: 4,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
    },
  },

  scn_bank_977: {
    familyKey: 'lw_gk_extreme_angle_body',
    teachingArea: 'goalkeeper',
    title: {
      en: 'Left Wing — Extreme Angle: Skim Only If the Sliver Is Still Playable',
      hr: 'Lijevo krilo — ekstremni kut: šiber samo ako je procijep još igriv',
      de: 'Linksaußen — Extremwinkel: nur schieben wenn der Spalt noch spielbar ist',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 35,
    score: '18:18',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['shotSelection', 'perception', 'decisionMaking', 'timing'],
    situation: {
      en: "Tied 18:18 at 35' against 6:0. You catch at an extreme left angle. The wing defender is late and not on your shooting arm. The goalkeeper’s near body and near hand cover most of the near side; a thin skim line toward the far low corner is still visible. Inside help is still more than two metres away. The left back is free for a short return if that skim dies.",
      hr: 'Neriješeno je 18:18 u 35. minuti protiv 6:0. Hvataš iz ekstremnog lijevog kuta. Krilni branič kasni i nije na tvojoj ruci. Vratar bližim tijelom i bližom rukom pokriva veći dio bliže strane; tanak šiber prema dalekom donjem kutu još se vidi. Unutarnja pomoć je još više od dva metra. Lijevi vanjski je slobodan za kratki povratak ako taj šiber umre.',
      de: 'Unentschieden 18:18 in Minute 35 gegen 6:0. Du fängst aus extremem linken Winkel. Der Außenverteidiger ist spät und nicht an deinem Schussarm. Der Torhüter deckt mit nahem Körper und naher Hand den Großteil der nahen Seite; eine dünne Schiebeline zur fernen tiefen Ecke ist noch sichtbar. Innere Hilfe ist noch mehr als zwei Meter weg. Der linke Rückraum ist frei für einen kurzen Rückpass wenn dieser Schieber stirbt.',
    },
    question: {
      en: 'Extreme angle, thin skim still visible, help still late — what first?',
      hr: 'Ekstremni kut, tanak šiber još se vidi, pomoć još kasni — što prvo?',
      de: 'Extremwinkel, dünner Schieber noch sichtbar, Hilfe noch spät — was zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Take the soft skim to the far low corner now — the sliver is still playable',
          hr: 'Odigraj mekani šiber u daleki donji kut sada — procijep je još igriv',
          de: 'Den weichen Schieber in die ferne tiefe Ecke jetzt spielen — der Spalt ist noch spielbar',
        },
        feedback: {
          en: 'Correct — extreme-angle skim is live while help is late and the sliver remains.',
          hr: 'Točno — šiber iz ekstremnog kuta je živ dok pomoć kasni i procijep ostaje.',
          de: 'Richtig — der Extremwinkel-Schieber lebt solange Hilfe spät ist und der Spalt bleibt.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Short return to the left back if help arrives inside two metres or the goalkeeper covers the remaining skim',
          hr: 'Kratko vrati lijevom vanjskom ako pomoć stigne unutar dva metra ili vratar zatvori preostali šiber',
          de: 'Kurz zum Rückraum wenn Hilfe innerhalb von zwei Metern kommt oder der Torhüter den restlichen Schieber schließt',
        },
        feedback: {
          en: 'Valid when the skim dies; here the sliver is still visible and help is late.',
          hr: 'Valja kad šiber umre; ovdje se procijep još vidi a pomoć kasni.',
          de: 'Gültig wenn der Schieber stirbt; hier ist der Spalt noch sichtbar und Hilfe spät.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Force a hard near-side shot into the goalkeeper’s body',
          hr: 'Forsiraj tvrdi bliži šut u tijelo vratara',
          de: 'Einen harten nahen Schuss in den Körper des Torhüters erzwingen',
        },
        feedback: {
          en: 'Risky — that side is already covered by body and near hand.',
          hr: 'Rizično — tu stranu već drže tijelo i bliža ruka.',
          de: 'Riskant — diese Seite ist schon durch Körper und nahe Hand zu.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Hold and wait for a perfect goalkeeper mistake while the skim is open',
          hr: 'Čekaj savršenu grešku vratara dok je šiber otvoren',
          de: 'Auf einen perfekten Torhüterfehler warten während der Schieber offen ist',
        },
        feedback: {
          en: 'Poor — you waste the only playable line.',
          hr: 'Loše — bacaš jedinu igrivu liniju.',
          de: 'Schlecht — du verschenkst die einzige spielbare Linie.',
        },
      },
    ],
    explanation: {
      en: 'From an extreme left angle, finish the soft skim only while the far-low sliver is playable and help is late. If help arrives or the goalkeeper covers that skim, return short to the left back. Do not force the covered near side.',
      hr: 'Iz ekstremnog lijevog kuta završi mekani šiber samo dok je daleki donji procijep igriv i pomoć kasni. Ako pomoć stigne ili vratar zatvori taj šiber, kratko vrati lijevom vanjskom. Ne forsiraj pokrivenu bližu stranu.',
      de: 'Aus extremem linken Winkel den weichen Schieber nur abschließen solange der ferne tiefe Spalt spielbar ist und Hilfe spät ist. Kommt Hilfe oder schließt der Torhüter diesen Schieber, kurz zum Rückraum. Die gedeckte nahe Seite nicht erzwingen.',
    },
    whyCorrectOverSecondBest: {
      en: 'A skims because the sliver is still playable and help is late. B becomes correct when help arrives inside two metres or the goalkeeper covers the remaining skim.',
      hr: 'A igra šiber jer je procijep još igriv i pomoć kasni. B postaje točan kad pomoć stigne unutar dva metra ili vratar zatvori preostali šiber.',
      de: 'A schiebt weil der Spalt noch spielbar ist und Hilfe spät ist. B wird richtig wenn Hilfe innerhalb von zwei Metern kommt oder der Torhüter den restlichen Schieber schließt.',
    },
    qualityScore: 8.7,
    reviewer: {
      closestLw: 'scn_bank_946 / 955 / 956',
      closestRw: 'no extreme-angle skim-vs-recycle twin',
      sharedConcept: 'Goalkeeper/body finish decision',
      criticalDifference:
        'Extreme-angle skim vs recycle under body/help — not post-shade (955/956), not lob-vs-LB (946)',
      duplicateClassification: 'RELATED_BUT_DISTINCT',
      lwNativity: 'STRONGLY_LW_NATIVE',
      coachRisk: 4,
      abVerdict: 'CLEAR',
      geometryVerdict: 'PASS',
      hrVerdict: 'PASS',
    },
  },
};

// Fix HR typo skinue → skine
replacements.scn_bank_975.title.hr =
  'Lijevo krilo — obrana: ne daj da te prodor skine s ulaska iza leđa';

function polish976(prev) {
  return {
    ...prev,
    perception: true,
    skillTags: Array.from(new Set([...(prev.skillTags || []), 'perception'])),
    situation: {
      ...prev.situation,
      hr: 'Neriješeno je 9:9 u 18. minuti u vašoj 6:0. Braniš lijevo krilo. Lopta je kod njihovog desnog vanjskog na devet metara. Njihovo desno krilo kreće u ulazak iza tvojih leđa prema šest. Ti gledaš loptu. Nitko nije javio preuzimanje tog trkača.',
    },
    answers: prev.answers.map((a) => {
      if (a.quality !== 'poor') return a;
      return {
        ...a,
        text: {
          en: 'Drop under six without contact and leave the entry path open',
          hr: 'Padni pod šest bez kontakta i ostavi put ulaska otvoren',
          de: 'Ohne Kontakt unter die Sechs fallen und den Einlaufweg offen lassen',
        },
      };
    }),
    reviewer: {
      ...prev.reviewer,
      coachRisk: 3,
      perceptionJustification: 'true — runner start behind + ball-watch is a live cue',
    },
  };
}

function polish978(prev) {
  const replHr = (t) =>
    String(t)
      .replace(/\bskip\b/gi, 'dugo dodavanje')
      .replace(/daleki skip/gi, 'dugo dodavanje')
      .replace(/Daleki skip/g, 'Dugo dodavanje')
      .replace(/je živ/g, 'je otvoren')
      .replace(/živi prioritet/g, 'prvi prioritet');
  return {
    ...prev,
    difficulty: 'Intermediate',
    title: {
      en: 'Left Wing — Defence: Cut the Far Outlet Only When Your Side Is Covered',
      hr: 'Lijevo krilo — obrana: siječi daleki izlazak samo kad je tvoja strana pokrivena',
      de: 'Linksaußen — Abwehr: den fernen Auslass nur schneiden wenn deine Seite abgesichert ist',
    },
    situation: {
      en: "Tied 11:11 at 22' after a turnover. You are recovering on the left. A teammate is already between their right wing and the ball on your sideline. Their goalkeeper looks to their left wing on the far side for a long first outlet. That far wing is still high and open. You can reach the long pass lane if you leave your side now.",
      hr: 'Neriješeno je 11:11 u 22. minuti nakon gubitka lopte. Vraćaš se na lijevoj strani. Suigrač je već između njihovog desnog krila i lopte na tvojoj aut-liniji. Njihov vratar gleda njihovo lijevo krilo na dalekoj strani za dugi prvi izlazak. To daleko krilo još je visoko i otvoreno. Možeš stići na liniju dugog dodavanja ako sada napustiš svoju stranu.',
      de: prev.situation.de,
    },
    question: {
      en: 'A teammate already covers your sideline and their far wing is still open for the long outlet — what first?',
      hr: 'Suigrač već pokriva tvoju aut-liniju a njihovo daleko krilo još je otvoreno za dugi izlazak — što je prvo?',
      de: 'Ein Mitspieler deckt schon deine Seitenlinie und ihr ferner Flügel ist noch offen für den langen Auslass — was zuerst?',
    },
    answers: prev.answers.map((a) => ({
      ...a,
      text: {
        en: a.text.en.replace(/far skip/gi, 'far outlet').replace(/long pass to their left wing/, 'long pass to their left wing'),
        hr: replHr(a.text.hr)
          .replace(/daleki skip/gi, 'dugo dodavanje')
          .replace(/siječi dugo dodavanje na njihovo lijevo krilo/, 'siječi dugo dodavanje na njihovo lijevo krilo'),
        de: a.text.de,
      },
      feedback: {
        en: a.feedback.en.replace(/far skip/gi, 'far outlet'),
        hr: replHr(a.feedback.hr).replace(/daleki skip/gi, 'dugo dodavanje'),
        de: a.feedback.de,
      },
    })),
    explanation: {
      en: 'Take the far long outlet only when your own-side lane is already covered. If that cover is missing, protect your own wing first. That is the opposite map of own-side-first recovery.',
      hr: 'Uzmi daleki dugi izlazak samo kad je linija na tvojoj strani već pokrivena. Ako tog pokrića nema, prvo čuvaj svoje krilo. To je suprotna mapa od prvog čuvanja vlastite strane.',
      de: prev.explanation.de,
    },
    whyCorrectOverSecondBest: {
      en: 'A cuts the far long outlet because own-side cover is already there. B becomes correct when that sideline cover is missing.',
      hr: 'A siječe daleki dugi izlazak jer je pokriće na vlastitoj strani već tu. B postaje točan kad tog pokrića na aut-liniji nema.',
      de: prev.whyCorrectOverSecondBest.de,
    },
    reviewer: {
      ...prev.reviewer,
      coachRisk: 3,
      difficultyJustification: 'Intermediate — one map fork; Advanced not required',
    },
  };
}

function polish979(prev) {
  const fix = (t) =>
    String(t)
      .replace(/\bskip\b/gi, 'dugo dodavanje')
      .replace(/Daleki skip/g, 'Dugo dodavanje')
      .replace(/daleki skip/gi, 'dugo dodavanje');
  return {
    ...prev,
    difficulty: 'Advanced',
    title: {
      en: 'Left Wing — Defence: In 5v6 Protect the Most Dangerous Pass First',
      hr: 'Lijevo krilo — obrana: u 5v6 prvo zatvori najopasnije dodavanje',
      de: prev.title.de,
    },
    situation: {
      en: "You trail 20:21 at 41' and are down a player after an exclusion on your right side — 5v6 defence. You defend left wing. Their right back has the ball. Their right wing is wide. Their left wing on the far side is completely unmarked for a long cross-court pass. Your nearest teammate is stuck on the pivot. Jumping their near wing early leaves that far pass free.",
      hr: 'Gubite 20:21 u 41. minuti i igrate s igračem manje nakon isključenja na desnoj strani — obrana 5v6. Braniš lijevo krilo. Njihov desni vanjski ima loptu. Njihovo desno krilo je široko. Njihovo lijevo krilo na dalekoj strani potpuno je nepokriveno za dugo dodavanje preko terena. Najbliži suigrač zaglavio je na pivotu. Rani skok na bliže krilo ostavlja to daleko dodavanje slobodnim.',
      de: 'Ihr liegt 20:21 in Minute 41 zurück und verteidigt nach einer Disqualifikation/Zeitstrafe auf eurer rechten Seite in Unterzahl — 5v6. Du verteidigst Linksaußen. Ihr rechter Rückraum hat den Ball. Ihr Rechtsaußen steht breit. Ihr Linksaußen auf der fernen Seite ist für einen langen Diagonalpass komplett ungedeckt. Dein nächster Mitspieler hängt am Kreisläufer. Ein früher Sprung auf den nahen Flügel lässt diesen fernen Pass frei.',
    },
    question: {
      en: 'Down a player, their far wing is unmarked for the long pass — what is first?',
      hr: 'Igrač manje, njihovo daleko krilo je nepokriveno za dugo dodavanje — što je prvo?',
      de: 'Unterzahl, ihr ferner Flügel ist für den langen Pass ungedeckt — was ist zuerst?',
    },
    answers: prev.answers.map((a) => ({
      ...a,
      text: {
        en: a.text.en
          .replace(/free far skip/gi, 'free far long pass')
          .replace(/far skip/gi, 'far long pass'),
        hr: fix(a.text.hr)
          .replace(/slobodni daleki dugo dodavanje/gi, 'slobodno daleko dugo dodavanje')
          .replace(/Prvo zatvori slobodni daleki dugo dodavanje/, 'Prvo zatvori slobodno daleko dugo dodavanje')
          .replace(/skinuo daleki dugo dodavanje/, 'skinuo daleko dugo dodavanje'),
        de: a.text.de.replace(/weiten Skip/gi, 'weiten langen Pass').replace(/weiten Skip/gi, 'weiten langen Pass'),
      },
      feedback: {
        en: a.feedback.en.replace(/far skip/gi, 'far long pass'),
        hr: fix(a.feedback.hr),
        de: a.feedback.de.replace(/weiten Skip/gi, 'weiten langen Pass'),
      },
    })),
    explanation: {
      en: 'In 5v6 protect the most dangerous free pass first. Here that is the long pass to the unmarked far wing after the exclusion on the other side. Shift to the near wing only after that priority is removed.',
      hr: 'U 5v6 prvo zatvori najopasnije slobodno dodavanje. Ovdje je to dugo dodavanje na nepokriveno daleko krilo nakon isključenja na drugoj strani. Na bliže krilo se pomakni tek kad je taj prioritet skinut.',
      de: 'In Unterzahl zuerst den gefährlichsten freien Pass schließen. Hier ist das der lange Pass auf den ungedeckten fernen Flügel nach der Strafe auf der anderen Seite. Auf den nahen Flügel erst schieben wenn diese Priorität weg ist.',
    },
    whyCorrectOverSecondBest: {
      en: 'A protects the free far long pass because that is the live priority in 5v6. B becomes correct only after a teammate has taken that pass away.',
      hr: 'A zatvara slobodno daleko dugo dodavanje jer je to prvi prioritet u 5v6. B postaje točan tek kad je suigrač skinuo to dodavanje.',
      de: 'A schließt den freien fernen langen Pass weil das die lebende Priorität in Unterzahl ist. B wird richtig erst wenn ein Mitspieler diesen Pass weggenommen hat.',
    },
    reviewer: {
      ...prev.reviewer,
      coachRisk: 4,
      difficultyJustification: 'Advanced — layered short-handed priority; Expert not required',
    },
  };
}

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
    skillTags: [
      ...r.skillTags.filter((t) => !String(t).startsWith('family:') && !String(t).startsWith('batch:')),
      `family:${r.familyKey}`,
      `batch:${batchId}`,
    ],
    qualityScore: r.qualityScore ?? 8.6,
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
    qualityScore: r.qualityScore ?? 8.6,
    reviewer: r.reviewer,
  };
}

// Apply replacements 975/977
for (const id of ['scn_bank_975', 'scn_bank_977']) {
  const r = replacements[id];
  const bIdx = batch.findIndex((s) => s.id === id);
  const prev = batch[bIdx];
  batch[bIdx] = toBatch(id, r, prev);
  const idx = bank.findIndex((s) => s.id === id);
  bank[idx] = toBank(id, r, prev.batchId);
}

// Polish 976/978/979
const polishMap = {
  scn_bank_976: polish976,
  scn_bank_978: polish978,
  scn_bank_979: polish979,
};
for (const [id, fn] of Object.entries(polishMap)) {
  const bIdx = batch.findIndex((s) => s.id === id);
  const polished = fn(batch[bIdx]);
  batch[bIdx] = polished;
  const idx = bank.findIndex((s) => s.id === id);
  bank[idx] = toBank(id, polished, polished.batchId);
}

// Matrix sync for difficulty/perception honesty on polished/replaced families
const matrixPatches = {
  lw_def_backdoor_deny: { coachRisk: 4 },
  lw_gk_extreme_angle_body: { coachRisk: 4 },
  lw_def_wing_entry: { perception: true },
  lw_def_trans_far_skip_with_map: { difficulty: 'Intermediate' },
  lw_def_numerical_5v6: { difficulty: 'Advanced' },
};
for (const [fk, patch] of Object.entries(matrixPatches)) {
  const f = matrix.remainingFamilies.find((x) => x.familyKey === fk);
  if (f) Object.assign(f, patch);
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
    throw new Error(`Lock broken after repair: ${k}`);
  }
}
for (const [id, h] of Object.entries(lock.seeds941to974)) {
  if (hash(bank2.find((s) => s.id === id)) !== h) throw new Error(`941-974 mutated: ${id}`);
}
for (const id of ['scn_bank_980', 'scn_bank_981']) {
  if (hash(bank2.find((s) => s.id === id)) !== lock.seedsKeepC[id]) {
    throw new Error(`Keep-C mutated: ${id}`);
  }
}
if (bank2.some((s) => s.id === 'scn_bank_982')) throw new Error('982 exists');

console.log('Batch C final repair applied');
console.log(
  ['975', '976', '977', '978', '979']
    .map((n) => {
      const id = `scn_bank_${n}`;
      const b = JSON.parse(readFileSync(batchPath, 'utf8')).find((s) => s.id === id);
      return `${id} ${b.familyKey} ${b.difficulty} perc=${b.perception}`;
    })
    .join('\n'),
);
