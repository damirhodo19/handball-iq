#!/usr/bin/env node
/**
 * Surgical tactical rewrite of Batch A IDs 955, 956, 962 only.
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
  if (hashPos(bank, pos) !== lock[k]) throw new Error(`Lock changed before repair: ${k}`);
}
for (const [id, h] of Object.entries(lock.seeds)) {
  const cur = crypto.createHash('sha256').update(JSON.stringify(bank.find((s) => s.id === id))).digest('hex');
  if (cur !== h) throw new Error(`Protected seed changed before repair: ${id}`);
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
      en: "Tied 14:14 at 29' against 6:0. You leave the ground clean from the left wing — the wing defender is late and cannot reach your shooting arm. Early in the jump the goalkeeper’s far foot and weight start toward the far post. Before you release, his near foot plants back hard toward the near post and his near arm drops into that near high corner — he is recovering the first shade. His far hand is late and low.",
      hr: 'Neriješeno je 14:14 u 29. minuti protiv 6:0. Čisto ideš u skok s lijevog krila — krilni branič kasni i ne stiže na tvoju ruku. Na početku skoka vratar dalekim stopalom i težinom kreće prema daljoj stativi. Prije nego baciš, bliže stopalo čvrsto se vraća prema bližoj stativi i bliža ruka pada u taj gornji kut — vraća se iz prvog zatvaranja. Daleka mu je ruka kasno i nisko.',
      de: 'Unentschieden 14:14 in Minute 29 gegen 6:0. Du gehst sauber vom Linksaußen in die Luft — der Außenverteidiger ist spät und kommt nicht an deinen Schussarm. Früh im Sprung gehen ferner Fuß und Gewicht zur fernen Stange. Bevor du abgibst, setzt der nahe Fuß hart zur nahen Stange zurück und der nahe Arm fällt in die nahe hohe Ecke — er holt die erste Verschiebung zurück. Seine ferne Hand ist spät und tief.',
    },
    question: {
      en: 'He started far, then planted back near — what do you do with the ball?',
      hr: 'Krenuo je dalje, pa se vratio bliže — što radiš s loptom?',
      de: 'Er ist fern gestartet und dann nah zurückgekommen — was machst du mit dem Ball?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Hold one beat and finish far and low — that is the side he left late after the recovery',
          hr: 'Drži jedan trenutak i završi daleko i nisko — to je strana koju je zakasnio nakon povratka',
          de: 'Einen Moment halten und fern-tief abschließen — das ist die Seite die er nach der Rückkehr spät gelassen hat',
        },
        feedback: {
          en: 'Correct — the second move cancels the first shade; finish where he is late.',
          hr: 'Točno — drugi pokret briše prvo zatvaranje; završi gdje kasni.',
          de: 'Richtig — die zweite Bewegung löscht die erste Verschiebung; dorthin abschließen wo er spät ist.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Early near finish only if he keeps going far without planting the near foot back',
          hr: 'Rani bliži završetak samo ako nastavi dalje bez da vrati bliže stopalo',
          de: 'Früher naher Abschluss nur wenn er fern weitergeht ohne den nahen Fuß zurückzusetzen',
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
          en: 'Smash near-high into the arm he just dropped into that corner',
          hr: 'Lupaj bliže gore u ruku koju je upravo spustio u taj kut',
          de: 'Nah-hoch in den Arm hämmern den er gerade in diese Ecke fallen ließ',
        },
        feedback: {
          en: 'Poor — that is exactly the recovery he completed.',
          hr: 'Loše — to je baš povratak koji je napravio.',
          de: 'Schlecht — genau das ist die Rückkehr die er fertiggemacht hat.',
        },
      },
    ],
    explanation: {
      en: 'First shade far is not the decision. The later plant and near-arm drop show he recovered. Finish far-low where he is late. Early near only if the far commit never comes back.',
      hr: 'Prvo zatvaranje daleko nije odluka. Kasniji oslonac i spuštanje bliže ruke pokazuju da se vratio. Završi daleko-nisko gdje kasni. Rano bliže samo ako se daleko zatvaranje ne vrati.',
      de: 'Erste ferne Verschiebung ist nicht die Entscheidung. Späteres Aufsetzen und naher Armfall zeigen die Rückkehr. Fern-tief abschließen wo er spät ist. Früh nah nur wenn die ferne Festlegung nicht zurückkommt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A uses the second cue (near plant + near arm drop). B needs a continued far commit without that recovery.',
      hr: 'A koristi drugi znak (bliži oslonac + spuštanje bliže ruke). B treba nastavljeno zatvaranje daleko bez tog povratka.',
      de: 'A nutzt das zweite Zeichen (nahes Aufsetzen + naher Armfall). B braucht anhaltende ferne Festlegung ohne diese Rückkehr.',
    },
    reviewer: {
      oldTeachingObjective: 'Near finish when GK shades far early (answer spoiled in situation)',
      newTeachingObjective: 'Second cue in the air beats the first GK shade — finish where the recovery leaves him late',
      primaryCue: 'Early far shade, then near foot plant + near arm drop during jump',
      closestRw: 'scn_bank_875 / 900 / 901 (related GK reads, different second-cue fork)',
      coachRisk: 4,
    },
  },

  scn_bank_956: {
    familyKey: 'lw_gk_depth_read',
    teachingArea: 'goalkeeper',
    title: {
      en: 'Left Wing — Do Not Keep Waiting After a False Step-Out Freezes',
      hr: 'Lijevo krilo — nemoj čekati kad se lažni izlazak vratara zamrzne',
      de: 'Linksaußen — nach einem eingefrorenen Fake-Herausschritt nicht weiter warten',
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
      en: "You lead 16:15 at 33' against 6:0. You start a clean take-off from the left wing with the wing defender still outside your arm. At jump start the goalkeeper is deep on the line. Mid-jump he suddenly drives one metre forward with chest and hands rising — then he freezes that step short of you and stops. He is not continuing into your body.",
      hr: 'Vodite 16:15 u 33. minuti protiv 6:0. Krećeš čist skok s lijevog krila, a krilni branič još je van tvoje ruke. Na startu skoka vratar je duboko na crti. Usred skoka naglo krene metar naprijed prsima i rukama gore — pa taj korak zamrzne ispred tebe i stane. Ne nastavlja u tvoje tijelo.',
      de: 'Ihr führt 16:15 in Minute 33 gegen 6:0. Du startest einen sauberen Absprung vom Linksaußen und der Außenverteidiger ist noch außerhalb deines Arms. Zu Sprungbeginn steht der Torhüter tief auf der Linie. Mitten im Sprung kommt er plötzlich einen Meter mit Brust und Händen nach oben — dann friert er diesen Schritt vor dir ein und stoppt. Er kommt nicht weiter in deinen Körper.',
    },
    question: {
      en: 'He stepped then froze short — how do you time the finish?',
      hr: 'Izašao je pa se zamrzao kratko — kako tempiras završetak?',
      de: 'Er ist herausgekommen und dann kurz eingefroren — wie timingst du den Abschluss?',
    },
    answers: [
      {
        quality: 'optimal',
        text: {
          en: 'Finish now hard at mid-height into the space he left by stopping short — do not wait as if he is still deep',
          hr: 'Završi sad jako na srednjoj visini u prostor koji je ostavio kratkim stajanjem — nemoj čekati kao da je još duboko',
          de: 'Jetzt hart auf mittlerer Höhe in den Raum abschließen den er durch das kurze Stoppen gelassen hat — nicht warten als stünde er noch tief',
        },
        feedback: {
          en: 'Correct — the depth change froze; waiting for a deep-line late movement is the wrong timing.',
          hr: 'Točno — promjena dubine se zamrzla; čekanje kao na dubokoj crti je krivo tempiranje.',
          de: 'Richtig — der Tiefenwechsel ist eingefroren; auf eine tiefe Spätbewegung zu warten ist falsches Timing.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Soft lift over only if he keeps driving into your body without freezing',
          hr: 'Meko podigni preko samo ako nastavi ići u tvoje tijelo bez zamrzavanja',
          de: 'Weich darüber heben nur wenn er ohne Einfrieren weiter in deinen Körper kommt',
        },
        feedback: {
          en: 'Valid on a continuous step-out; here he froze short.',
          hr: 'Valja uz kontinuirani izlazak; ovdje se zamrzao kratko.',
          de: 'Gültig bei durchgehendem Herauskommen; hier ist er kurz eingefroren.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Keep carrying late as if he never left the line',
          hr: 'Nastavi nositi kasno kao da nije nikad izašao s crte',
          de: 'Weiter spät tragen als hätte er die Linie nie verlassen',
        },
        feedback: {
          en: 'Risky — that is the deep-line timing after the depth has already changed.',
          hr: 'Rizično — to je tempiranje za duboku crtu nakon što se dubina već promijenila.',
          de: 'Riskant — das ist Timing für die tiefe Linie nachdem die Tiefe schon gewechselt hat.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Smash early into the first deep picture without reading the step',
          hr: 'Lupaj rano u prvu duboku sliku bez čitanja koraka',
          de: 'Früh in das erste tiefe Bild hämmern ohne den Schritt zu lesen',
        },
        feedback: {
          en: 'Poor — you ignore both the step and the freeze.',
          hr: 'Loše — ignoriraš i korak i zamrzavanje.',
          de: 'Schlecht — du ignorierst Schritt und Einfrieren.',
        },
      },
    ],
    explanation: {
      en: 'Cue is mid-jump depth change: forward step then freeze. Not “deep = wait longer”. Finish now into the short stop. Soft lift only if the attack never freezes.',
      hr: 'Čitaj promjenu dubine usred skoka: korak naprijed pa zamrzavanje. Ne “duboko = čekaj duže”. Završi sad u kratko stajanje. Meko podigni samo ako izlazak ne stane.',
      de: 'Lesen: Tiefenwechsel mitten im Sprung — Schritt nach vorne dann Einfrieren. Nicht „tief = länger warten“. Jetzt in den kurzen Stopp abschließen. Weich heben nur wenn der Angriff nicht stoppt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A matches the freeze after a false step-out; B needs a continuous drive into the body without freeze.',
      hr: 'A odgovara na zamrzavanje nakon lažnog izlaska; B treba kontinuirani ulazak u tijelo bez zamrzavanja.',
      de: 'A passt zum Einfrieren nach dem Fake-Herausschritt; B braucht durchgehenden Druck in den Körper ohne Einfrieren.',
    },
    reviewer: {
      oldTeachingObjective: 'Deep GK + high hands → carry late (RW 897 twin)',
      newTeachingObjective:
        'Adapt release timing when GK leaves deep mid-jump with a false step-out that freezes short — not deep=wait, not auto-lob',
      primaryCue: 'Deep at jump start → mid-jump 1m attack then freeze short',
      closestRw:
        'scn_bank_898 (continuous GK attack → lift) — here freeze makes A hard now; lift is only B. Not 897 deep=carry late.',
      coachRisk: 4,
    },
  },

  scn_bank_962: {
    familyKey: 'lw_def_inside_help_controlled',
    teachingArea: 'set_defence',
    title: {
      en: 'Left Wing — Defence: Close the Wing Pass When Your Half Is Removed',
      hr: 'Lijevo krilo — obrana: zatvori pas na krilo kad ti polubranitelj nestane',
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
      hr: 'Neriješeno je 11:11 u 24. minuti u vašoj 6:0. Braniš lijevo krilo. Njihov desni vanjski ima loptu i već je povukao tvog polubranitelja unutra — polubranitelj je zaglavio na tom prodoru i ne može doći na tvoje krilo. Njihovo desno krilo još je široko. Desni vanjski okreće prsa i ramena prema aut-liniji i gleda to krilo. Ako skočiš na prodor, pas na krilo je slobodan.',
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
          en: 'Step into the pass from the right back to their wing and take that lane with your body and arms',
          hr: 'Stani u pas od desnog vanjskog na njihovo krilo i uzmi taj put tijelom i rukama',
          de: 'In den Pass vom rechten Rückraum auf ihren Flügel treten und diese Linie mit Körper und Armen nehmen',
        },
        feedback: {
          en: 'Correct — with the half removed, your first job is the wing pass he is looking for.',
          hr: 'Točno — kad polubranitelja nema, prvi ti je posao pas na krilo koji on traži.',
          de: 'Richtig — ist der Halbe weg ist dein erster Job der Flügelpass den er sucht.',
        },
      },
      {
        quality: 'good',
        text: {
          en: 'Jump the drive only if his chest stays middle and the wing stays high without asking for the ball',
          hr: 'Skoči na prodor samo ako mu prsa ostanu u sredinu a krilo ostane visoko bez traženja lopte',
          de: 'Nur in den Durchbruch springen wenn die Brust Mitte bleibt und der Flügel hoch bleibt ohne den Ball zu fordern',
        },
        feedback: {
          en: 'Valid when the wing pass is not live; here he turns to the wing.',
          hr: 'Valja kad pas na krilo nije živ; ovdje se okreće na krilo.',
          de: 'Gültig wenn der Flügelpass nicht lebt; hier dreht er zum Flügel.',
        },
      },
      {
        quality: 'risky',
        text: {
          en: 'Chase the right back into the middle because the drive “looks more dangerous”',
          hr: 'Juri desnog vanjskog u sredinu jer prodor “izgleda opasnije”',
          de: 'Den rechten Rückraum in die Mitte jagen weil der Durchbruch “gefährlicher wirkt”',
        },
        feedback: {
          en: 'Risky — you gift the pass he is already looking for.',
          hr: 'Rizično — poklanjaš pas koji već traži.',
          de: 'Riskant — du schenkst den Pass den er schon sucht.',
        },
      },
      {
        quality: 'poor',
        text: {
          en: 'Drop to the corner and wait to see who receives after the pass is gone',
          hr: 'Ispusti se u kut i čekaj tko će primiti nakon što pas ode',
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
      en: 'Cue: half stuck inside + RB chest/shoulders to the wing. First action is close that pass with body and arms. Jump the drive only if the wing pass is not live.',
      hr: 'Čitaj: polubranitelj zaglavljen unutra + prsa/ramena desnog vanjskog prema krilu. Prva akcija je zatvoriti taj pas tijelom i rukama. Skoči na prodor samo ako pas na krilo nije živ.',
      de: 'Lesen: Halber innen fest + Brust/Schultern des Rückraums zum Flügel. Erste Aktion: diesen Pass mit Körper und Armen schließen. In den Durchbruch nur wenn der Flügelpass nicht lebt.',
    },
    whyCorrectOverSecondBest: {
      en: 'A closes the live wing pass after the half is removed; B needs a middle-facing drive with a passive wing.',
      hr: 'A zatvara živi pas na krilo kad polubranitelja nema; B treba prodor prema sredini uz pasivno krilo.',
      de: 'A schließt den lebenden Flügelpass wenn der Halbe weg ist; B braucht einen mittigen Durchbruch mit passivem Flügel.',
    },
    reviewer: {
      oldTeachingObjective: 'Controlled help step without abandoning wing (RW 880 twin)',
      newTeachingObjective:
        'When half is removed by the drive, close the RB→RW pass lane on the shoulder turn — do not chase the drive',
      primaryCue: 'Half stuck inside + RB chest/shoulders turn to wide wing',
      closestRw: 'scn_bank_880 (related protect-pass theme) — different fork: no help-step cocktail; half removed; shoulders cue',
      coachRisk: 4,
    },
  },
};

function toBankScenario(id, r, old) {
  const skillTags = [
    ...r.skillTags,
    ...(r.perception && !r.skillTags.includes('perception') ? ['perception'] : []),
    ...(r.numerical && r.numerical !== '6v6' && !r.skillTags.some((t) => String(t).startsWith('numerical:'))
      ? [`numerical:${r.numerical}`]
      : []),
    `family:${r.familyKey}`,
    `batch:lw_batch_a_${id === 'scn_bank_955' ? '05' : id === 'scn_bank_956' ? '06' : '12'}`,
  ];
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
    surgicalStatus: 'BATCH_A_TACTICAL_REPAIR',
  };

  changeLog.push({
    id,
    familyKey: r.familyKey,
    oldTeachingObjective: r.reviewer.oldTeachingObjective,
    newTeachingObjective: r.reviewer.newTeachingObjective,
    primaryCue: r.reviewer.primaryCue,
    newA: r.answers[0].text.en,
    newB: r.answers[1].text.en,
    whyABeatsB: r.whyCorrectOverSecondBest.en,
    whenB: r.answers[1].feedback.en,
    closestRw: r.reviewer.closestRw,
    coachRisk: r.reviewer.coachRisk,
  });
}

// post locks
for (const k of ['LB', 'RB', 'CB', 'RW']) {
  const pos = { LB: 'Left Back', RB: 'Right Back', CB: 'Centre Back', RW: 'Right Wing' }[k];
  if (hashPos(bank, pos) !== lock[k]) throw new Error(`Lock changed after repair: ${k}`);
}
for (const [id, h] of Object.entries(lock.seeds)) {
  const cur = crypto.createHash('sha256').update(JSON.stringify(bank.find((s) => s.id === id))).digest('hex');
  if (cur !== h) throw new Error(`Protected seed mutated: ${id}`);
}
const lw = bank.filter((s) => s.primaryPosition === 'Left Wing').length;
if (lw !== 62) throw new Error(`LW count ${lw}`);

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(batchPath, JSON.stringify(batch, null, 2) + '\n');
writeFileSync(
  join(root, 'scripts/lw-batch-a-surgical-repair-report.json'),
  JSON.stringify(
    {
      status: 'REPAIRED',
      changeLog,
      lwCount: lw,
      lockOk: true,
      touchedIds: Object.keys(replacements),
    },
    null,
    2,
  ) + '\n',
);

console.log(JSON.stringify({ status: 'REPAIRED', changeLog }, null, 2));
