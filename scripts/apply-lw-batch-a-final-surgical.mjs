#!/usr/bin/env node
/**
 * Final surgical pass: polish 955/962, tactical rewrite 956 only.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const batchPath = join(root, 'scripts/scenario-bank/data/lw-parts/lw-families-a.json');
const lock = JSON.parse(readFileSync(join(root, 'scripts/.lw-batch-a-repair-lock-before.json'), 'utf8'));

const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));

const hashPos = (arr, pos) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(arr.filter((s) => s.primaryPosition === pos)))
    .digest('hex');

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(bank, pos) !== lock[k]) throw new Error(`Lock changed before final repair: ${k}`);
}
for (const [id, h] of Object.entries(lock.seeds)) {
  const cur = crypto.createHash('sha256').update(JSON.stringify(bank.find((s) => s.id === id))).digest('hex');
  if (cur !== h) throw new Error(`Protected seed changed before final repair: ${id}`);
}

const replacements = {
  scn_bank_955: {
    familyKey: 'lw_gk_far_side_commit',
    teachingArea: 'goalkeeper',
    title: {
      en: 'Left Wing — Do Not Trust the First Goalkeeper Shade in the Air',
      hr: 'Lijevo krilo — ne vjeruj prvom zatvaranju vratara dok si u zraku',
      de: 'Linksaußen — dem ersten Torhüterzuschieben in der Luft nicht glauben',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 29,
    score: '14:14',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['shotSelection', 'perception', 'decisionMaking', 'timing'],
    situation: {
      en: "Tied 14:14 at 29' against 6:0. You leave the ground clean from the left wing — the wing defender is late and cannot reach your shooting arm. Early in the jump the goalkeeper’s far foot and weight start toward the far post. Before you release, he plants the near foot back toward the near post and the near hand comes with that recovery to cover the near high corner. The far hand is still late coming back across.",
      hr: 'Neriješeno je 14:14 u 29. minuti protiv 6:0. Čisto ideš u skok s lijevog krila — krilni branič kasni i ne stiže na tvoju ruku. Na početku skoka vratar dalekim stopalom i težinom kreće prema daljoj stativi. Prije nego baciš, vraća bliže stopalo prema bližoj stativi i bliža ruka ide s tim povratkom da zatvori bliži gornji kut. Daleka ruka još kasni s povratkom preko.',
      de: 'Unentschieden 14:14 in Minute 29 gegen 6:0. Du gehst sauber vom Linksaußen in die Luft — der Außenverteidiger ist spät und kommt nicht an deinen Schussarm. Früh im Sprung gehen ferner Fuß und Gewicht zur fernen Stange. Bevor du abgibst, setzt er den nahen Fuß zur nahen Stange zurück und die nahe Hand geht mit dieser Rückkehr und deckt die nahe hohe Ecke. Die ferne Hand kommt noch spät zurück über die Mitte.',
    },
    question: {
      en: 'He started far, then recovered near — what do you do with the ball?',
      hr: 'Krenuo je dalje, pa se vratio bliže — što radiš s loptom?',
      de: 'Er ist fern gestartet und dann nah zurückgekommen — was machst du mit dem Ball?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Wait one beat for that recovery, then finish far and low — he is late getting back across after planting near',
          hr: 'Pričekaj taj povratak jedan trenutak, pa završi daleko i nisko — nakon bližeg oslonca kasni s povratkom preko',
          de: 'Einen Moment auf diese Rückkehr warten, dann fern und tief abschließen — nach dem nahen Aufsetzen kommt er spät zurück über die Mitte',
        },
        feedback: {
          en: 'Correct — the second action cancels the first shade; finish where he is late returning.',
          hr: 'Točno — drugi pokret briše prvo zatvaranje; završi gdje kasni s povratkom.',
          de: 'Richtig — die zweite Bewegung löscht die erste Verschiebung; dorthin abschließen wo er bei der Rückkehr spät ist.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Early near finish only if he keeps going far and never plants the near foot back',
          hr: 'Rani bliži završetak samo ako nastavi dalje i ne vrati bliže stopalo',
          de: 'Früher naher Abschluss nur wenn er fern weitergeht und den nahen Fuß nicht zurücksetzt',
        },
        feedback: {
          en: 'Valid on a full far commit; here he planted back near.',
          hr: 'Valja uz potpuno zatvaranje daleko; ovdje se vratio bliže.',
          de: 'Gültig bei voller ferner Festlegung; hier ist er nah zurückgekommen.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Release immediately far on the first shade without waiting for his next foot',
          hr: 'Odmah baci daleko na prvo zatvaranje bez čekanja sljedećeg stopala',
          de: 'Sofort fern auf die erste Verschiebung abgeben ohne den nächsten Fuß abzuwarten',
        },
        feedback: {
          en: 'Risky — you throw into the recovery he is already making.',
          hr: 'Rizično — bacaš u povratak koji već radi.',
          de: 'Riskant — du wirfst in die Rückkehr die er schon macht.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Smash near-high into the hand that just came with the recovery',
          hr: 'Lupaj bliže gore u ruku koja je upravo došla s povratkom',
          de: 'Nah-hoch in die Hand hämmern die gerade mit der Rückkehr gekommen ist',
        },
        feedback: {
          en: 'Poor — that is exactly the recovery he completed.',
          hr: 'Loše — to je baš povratak koji je napravio.',
          de: 'Schlecht — genau das ist die Rückkehr die er fertiggemacht hat.',
        },
      },
    ],
    explanation: {
      en: 'First shade far is not the decision. The later near plant and near hand with that recovery show he came back. Finish far-low where he is late returning. Early near only if the far commit never comes back.',
      hr: 'Prvo zatvaranje daleko nije odluka. Kasniji bliži oslonac i bliža ruka s tim povratkom pokazuju da se vratio. Završi daleko i nisko gdje kasni s povratkom. Rano bliže samo ako se daleko zatvaranje ne vrati.',
      de: 'Erste ferne Verschiebung ist nicht die Entscheidung. Späteres nahes Aufsetzen und nahe Hand mit der Rückkehr zeigen dass er zurückkommt. Fern-tief abschließen wo er bei der Rückkehr spät ist. Früh nah nur wenn die ferne Festlegung nicht zurückkommt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A uses the second cue (near plant + near hand with the recovery). B needs a continued far commit without that recovery.',
      hr: 'A čita drugi pokret (bliži oslonac + bliža ruka s povratkom). B treba nastavljeno zatvaranje daleko bez tog povratka.',
      de: 'A nutzt das zweite Zeichen (nahes Aufsetzen + nahe Hand mit Rückkehr). B braucht anhaltende ferne Festlegung ohne diese Rückkehr.',
    },
    reviewer: {
      mode: 'LANGUAGE_POLISH',
      tacticalConceptUnchanged: true,
      oldTeachingObjective: 'Second cue in the air beats the first GK shade — finish where the recovery leaves him late',
      newTeachingObjective: 'Second cue in the air beats the first GK shade — finish where the recovery leaves him late',
      primaryCue: 'Early far shade, then near foot plant + near hand joins recovery',
      languageChanges: [
        'bliža ruka pada u taj gornji kut → bliža ruka ide s tim povratkom da zatvori bliži gornji kut',
        'daleka mu je ruka kasno i nisko → daleka ruka još kasni s povratkom preko',
        'strana koju je zakasnio → nakon bližeg oslonca kasni s povratkom preko',
      ],
      closestRw: 'scn_bank_900 / 875 / 901',
      coachRisk: 3,
    },
  },

  scn_bank_956: {
    familyKey: 'lw_gk_depth_read',
    teachingArea: 'goalkeeper',
    title: {
      en: 'Left Wing — Read the Brake After the Goalkeeper Leaves Deep',
      hr: 'Lijevo krilo — pročitaj kočenje vratara nakon što izađe iz dubine',
      de: 'Linksaußen — das Abbremsen lesen nachdem der Torhüter die Tiefe verlässt',
    },
    difficulty: 'Advanced',
    pressureLevel: 'High',
    attackOrDefence: 'Attack',
    matchPhase: 'Open Play',
    minute: 33,
    score: '16:15',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['shotSelection', 'perception', 'decisionMaking', 'timing'],
    situation: {
      en: "You lead 16:15 at 33' against 6:0. You leave the ground clean from the left wing — the wing defender is still outside your shooting arm. At jump start the goalkeeper is deep on the line. Mid-jump he attacks forward toward you. Then he brakes: the near foot plants wider, his weight dumps onto that near leg, and the near hand drops to cover the near low corner. The far hand is still late coming across. He is not continuing into your body.",
      hr: 'Vodite 16:15 u 33. minuti protiv 6:0. Čisto ideš u skok s lijevog krila — krilni branič još je van tvoje ruke. Na startu skoka vratar je duboko na crti. Usred skoka kreće naprijed prema tebi. Onda koči: bliže stopalo ide šire, težina pada na tu bližu nogu, a bliža ruka ide dolje da zatvori bliži donji kut. Daleka ruka još kasni s dolaskom preko. Ne nastavlja u tvoje tijelo.',
      de: 'Ihr führt 16:15 in Minute 33 gegen 6:0. Du gehst sauber vom Linksaußen in die Luft — der Außenverteidiger ist noch außerhalb deines Schussarms. Zu Sprungbeginn steht der Torhüter tief auf der Linie. Mitten im Sprung kommt er nach vorne auf dich zu. Dann bremst er ab: der nahe Fuß setzt breiter, das Gewicht fällt auf dieses nahe Bein und die nahe Hand fällt und deckt die nahe tiefe Ecke. Die ferne Hand kommt noch spät über die Mitte. Er kommt nicht weiter in deinen Körper.',
    },
    question: {
      en: 'He left deep, then braked loaded near with the near hand down — where do you finish?',
      hr: 'Izašao je iz dubine, pa kočio s težinom bliže i bližom rukom dolje — gdje završavaš?',
      de: 'Er hat die Tiefe verlassen und dann nah belastet mit naher Hand unten abgebremst — wohin schließt du ab?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Finish far and high — he is stuck on the near plant with the near hand down and cannot recover across in time',
          hr: 'Završi daleko i gore — zaglavljen je na bližem osloncu s bližom rukom dolje i ne stiže se vratiti preko',
          de: 'Fern und hoch abschließen — er hängt am nahen Aufsetzen mit naher Hand unten und kommt nicht rechtzeitig zurück über die Mitte',
        },
        feedback: {
          en: 'Correct — depth change plus the brake body cue: near load and near hand down leave him late to the far-high side.',
          hr: 'Točno — promjena dubine plus kočenje: težina bliže i bliža ruka dolje ostavljaju ga kasnog za daleko i gore.',
          de: 'Richtig — Tiefenwechsel plus Abbrems-Körperzeichen: nahe Last und nahe Hand unten machen ihn spät zur fern-hohen Seite.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Soft lift over only if he keeps driving into your body with both hands rising and never plants that near foot wide',
          hr: 'Meko podigni preko samo ako nastavi ići u tvoje tijelo s obje ruke gore i ne stavi bliže stopalo šire',
          de: 'Weich darüber heben nur wenn er mit beiden Händen oben weiter in deinen Körper kommt und den nahen Fuß nicht breit setzt',
        },
        feedback: {
          en: 'Valid on a continuous step-out; here he braked with near load and near hand down.',
          hr: 'Valja uz kontinuirani izlazak; ovdje je kočio s težinom bliže i bližom rukom dolje.',
          de: 'Gültig bei durchgehendem Herauskommen; hier hat er nah belastet mit naher Hand unten abgebremst.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Keep carrying late as if he is still deep on the line after he has already stepped and braked',
          hr: 'Nastavi nositi kasno kao da je još duboko na crti iako je već izašao i kočio',
          de: 'Weiter spät tragen als stünde er noch tief auf der Linie obwohl er schon herausgekommen und abgebremst hat',
        },
        feedback: {
          en: 'Risky — that is the deep-line timing after the depth and body cue have already changed.',
          hr: 'Rizično — to je čekanje kao na dubokoj crti nakon što su se dubina i tijelo već promijenili.',
          de: 'Riskant — das ist Timing für die tiefe Linie nachdem Tiefe und Körper schon gewechselt haben.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Smash hard through mid-height into the body he just brought forward',
          hr: 'Lupaj jako kroz sredinu u tijelo koje je upravo doveo naprijed',
          de: 'Hart durch die Mitte in den Körper hämmern den er gerade nach vorne gebracht hat',
        },
        feedback: {
          en: 'Poor — the forward brake reduced that central path; you attack his body.',
          hr: 'Loše — kočenjem naprijed smanjio je taj središnji put; udaraš u tijelo.',
          de: 'Schlecht — durch das Abbremsen vorne ist dieser Mittelweg kleiner; du greifst seinen Körper an.',
        },
      },
    ],
    explanation: {
      en: 'Read two cues: he leaves deep, then brakes with weight on the near plant and near hand down. Finish far-high where recovery across is late. Soft lift only if the attack never brakes. Do not keep waiting as if he stayed deep.',
      hr: 'Čitaj dva pokreta: izlazi iz dubine, pa koči s težinom na bližem osloncu i bližom rukom dolje. Završi daleko i gore gdje kasni s povratkom. Meko podigni samo ako izlazak ne koči. Nemoj čekati kao da je ostao duboko.',
      de: 'Zwei Zeichen lesen: er verlässt die Tiefe, dann bremst er mit Last auf dem nahen Aufsetzen und naher Hand unten. Fern-hoch abschließen wo die Rückkehr spät ist. Weich heben nur wenn der Angriff nicht bremst. Nicht warten als wäre er tief geblieben.',
    },
    whyCorrectOverSecondBest: {
      en: 'A uses depth change plus the brake body cue (near plant + near hand down). B needs a continuous drive into the body without that brake.',
      hr: 'A čita promjenu dubine plus kočenje (bliži oslonac + bliža ruka dolje). B treba kontinuirani ulazak u tijelo bez tog kočenja.',
      de: 'A nutzt Tiefenwechsel plus Abbremsen (nahes Aufsetzen + nahe Hand unten). B braucht durchgehenden Druck in den Körper ohne dieses Abbremsen.',
    },
    reviewer: {
      mode: 'TACTICAL_REWRITE',
      familyKeyKept: 'lw_gk_depth_read',
      familyKeyReplaced: false,
      oldProblem:
        'Forward freeze then hard mid-height — indefensible; attacks reduced angle / GK body',
      newTeachingObjective:
        'When GK leaves deep mid-jump then brakes with near load + near hand down, finish far-high — not deep=wait, not auto-lob, not hard mid',
      fullGkGeometry:
        'Deep on line at take-off → mid-jump forward attack → brake: near foot wider, weight on near leg, near hand down to near-low; far hand late across; not continuing into body',
      firstCue: 'GK leaves deep / attacks forward during LW jump',
      secondCue: 'Brake: near plant wider + weight on near leg + near hand drops to near-low',
      closestRw: 'scn_bank_898 (continuous attack→lift) and 900 (near commit→far); not 897',
      coachRisk: 4,
    },
  },

  scn_bank_962: {
    familyKey: 'lw_def_inside_help_controlled',
    teachingArea: 'set_defence',
    title: {
      en: 'Left Wing — Defence: Close the Wing Pass When Your Half Is Removed',
      hr: 'Lijevo krilo — obrana: zatvori dodavanje na krilo kad ti polubranitelj nestane',
      de: 'Linksaußen — Abwehr: den Flügelpass schließen wenn dein Halber weg ist',
    },
    difficulty: 'Intermediate',
    pressureLevel: 'Moderate',
    attackOrDefence: 'Defence',
    matchPhase: 'Open Play',
    minute: 24,
    score: '11:11',
    defensiveSystem: '6-0',
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    skillTags: ['defence', 'decisionMaking', 'perception', 'timing'],
    situation: {
      en: "Tied 11:11 at 24' in your 6:0. You defend left wing. Their right back has the ball and has already pulled your half defender inside — the half is stuck on that drive and cannot come to your wing. Their right wing is still wide. The right back turns his chest and shoulders toward the sideline and looks at that wing. If you jump into the drive, the pass to the wing is free.",
      hr: 'Neriješeno je 11:11 u 24. minuti u vašoj 6:0. Braniš lijevo krilo. Njihov desni vanjski ima loptu i već je povukao tvog polubranitelja unutra — polubranitelj je zaglavio na tom prodoru i ne može doći na tvoje krilo. Njihovo desno krilo još je široko. Desni vanjski okreće prsa i ramena prema aut-liniji i gleda to krilo. Ako skočiš na prodor, dodavanje na krilo je slobodno.',
      de: 'Unentschieden 11:11 in Minute 24 in eurer 6:0. Du verteidigst Linksaußen. Ihr rechter Rückraum hat den Ball und hat deinen Halben schon nach innen gezogen — der Halbe hängt an diesem Durchbruch und kommt nicht zu deinem Flügel. Ihr Rechtsaußen steht noch breit. Der rechte Rückraum dreht Brust und Schultern zur Seitenlinie und schaut auf diesen Flügel. Springst du in den Durchbruch ist der Pass auf den Flügel frei.',
    },
    question: {
      en: 'Your half is stuck inside and the right back looks wing — what is first?',
      hr: 'Polubranitelj je zaglavio unutra a desni vanjski gleda krilo — što je prvo?',
      de: 'Dein Halber hängt innen und der rechte Rückraum schaut Flügel — was ist zuerst?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Set yourself in the passing lane to their right wing and close that pass with body position and arms',
          hr: 'Postavi se u liniju dodavanja prema njihovom desnom krilu i zatvori dodavanje položajem tijela i rukama',
          de: 'Stell dich in die Passlinie zu ihrem Rechtsaußen und schließe den Pass mit Körperposition und Armen',
        },
        feedback: {
          en: 'Correct — with the half removed, your first job is the wing pass he is looking for.',
          hr: 'Točno — kad polubranitelja nema, prvi ti je posao dodavanje na krilo koje on traži.',
          de: 'Richtig — ist der Halbe weg ist dein erster Job der Flügelpass den er sucht.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Jump the drive only if his chest stays toward the middle and the wing does not present for the pass',
          hr: 'Skoči na prodor samo ako mu prsa ostanu prema sredini a krilo se ne nudi za dodavanje',
          de: 'Nur in den Durchbruch springen wenn die Brust zur Mitte bleibt und der Flügel sich nicht für den Pass anbietet',
        },
        feedback: {
          en: 'Valid when the wing pass is not live; here he turns to the wing.',
          hr: 'Valja kad krilo ne traži loptu; ovdje se okreće na krilo.',
          de: 'Gültig wenn der Flügelpass nicht lebt; hier dreht er zum Flügel.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Chase the right back into the middle because the drive looks more dangerous',
          hr: 'Juri desnog vanjskog u sredinu jer prodor izgleda opasnije',
          de: 'Den rechten Rückraum in die Mitte jagen weil der Durchbruch gefährlicher wirkt',
        },
        feedback: {
          en: 'Risky — you gift the pass he is already looking for.',
          hr: 'Rizično — poklanjaš dodavanje koje već traži.',
          de: 'Riskant — du schenkst den Pass den er schon sucht.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Drop to the corner and wait to see who receives after the pass is gone',
          hr: 'Padni u kut i čekaj tko će primiti nakon što dodavanje ode',
          de: 'Zur Ecke fallen und warten wer fängt nachdem der Pass weg ist',
        },
        feedback: {
          en: 'Poor — you defend after the damage.',
          hr: 'Loše — braniš nakon štete.',
          de: 'Schlecht — du verteidigst nach dem Schaden.',
        },
      },
    ],
    explanation: {
      en: 'Cue: half stuck inside + RB chest/shoulders to the wing. First action is close that pass with body and arms. Jump the drive only if the wing is not presenting for the pass.',
      hr: 'Čitaj: polubranitelj zaglavljen unutra + prsa i ramena desnog vanjskog prema krilu. Prva akcija je zatvoriti to dodavanje tijelom i rukama. Skoči na prodor samo ako se krilo ne nudi za dodavanje.',
      de: 'Lesen: Halber innen fest + Brust/Schultern des Rückraums zum Flügel. Erste Aktion: diesen Pass mit Körper und Armen schließen. In den Durchbruch nur wenn der Flügel sich nicht für den Pass anbietet.',
    },
    whyCorrectOverSecondBest: {
      en: 'A closes the live wing pass after the half is removed; B needs a middle-facing drive with a wing that does not present for the pass.',
      hr: 'A zatvara dodavanje na krilo kad polubranitelja nema; B treba prodor prema sredini uz krilo koje se ne nudi za dodavanje.',
      de: 'A schließt den lebenden Flügelpass wenn der Halbe weg ist; B braucht einen mittigen Durchbruch mit Flügel der sich nicht für den Pass anbietet.',
    },
    reviewer: {
      mode: 'LANGUAGE_POLISH',
      tacticalConceptUnchanged: true,
      geometryUnchanged: true,
      languageChanges: [
        'stani u pas → postavi se u liniju dodavanja prema njihovom desnom krilu',
        'uzmi taj put tijelom i rukama → zatvori dodavanje položajem tijela i rukama',
        'krilo ostane visoko → krilo se ne nudi za dodavanje',
        'pas → dodavanje where natural',
      ],
      closestRw: 'scn_bank_880',
      coachRisk: 3,
    },
  },
};

function toBankScenario(id, r, old) {
  const batchTag =
    id === 'scn_bank_955' ? 'batch:lw_batch_a_05' : id === 'scn_bank_956' ? 'batch:lw_batch_a_06' : 'batch:lw_batch_a_12';
  const skillTags = [
    ...r.skillTags,
    ...(r.perception && !r.skillTags.includes('perception') ? ['perception'] : []),
    `family:${r.familyKey}`,
    batchTag,
  ];
  // preserve any non-family/batch tags from old that we still want? Use clean set from r + markers
  return {
    ...old,
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
    skillTags,
    qualityScore: old.qualityScore ?? 8.6,
  };
}

const changeLog = [];

for (const [id, r] of Object.entries(replacements)) {
  const bIdx = bank.findIndex((s) => s.id === id);
  if (bIdx < 0) throw new Error(`Missing ${id}`);
  const old = bank[bIdx];
  bank[bIdx] = toBankScenario(id, r, old);

  const pIdx = batch.findIndex((s) => s.id === id);
  if (pIdx < 0) throw new Error(`Missing batch ${id}`);
  const prev = batch[pIdx];
  batch[pIdx] = {
    ...prev,
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
    reviewer: r.reviewer,
    surgicalStatus: 'BATCH_A_FINAL_SURGICAL',
  };

  changeLog.push({
    id,
    familyKey: r.familyKey,
    mode: r.reviewer.mode,
    coachRisk: r.reviewer.coachRisk,
    reviewer: r.reviewer,
    newA: r.answers[0].text.en,
    newB: r.answers[1].text.en,
    whyABeatsB: r.whyCorrectOverSecondBest.en,
  });
}

for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(bank, pos) !== lock[k]) throw new Error(`Lock changed after final repair: ${k}`);
}
for (const [id, h] of Object.entries(lock.seeds)) {
  const cur = crypto.createHash('sha256').update(JSON.stringify(bank.find((s) => s.id === id))).digest('hex');
  if (cur !== h) throw new Error(`Protected seed mutated: ${id}`);
}
const lw = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lw !== 62) throw new Error(`LW count ${lw}`);

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(batchPath, JSON.stringify(batch, null, 2) + '\n');

console.log(JSON.stringify({ status: 'FINAL_REPAIRED', changeLog }, null, 2));
