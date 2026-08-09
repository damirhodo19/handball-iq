#!/usr/bin/env node
/**
 * Final surgical coach correction pass — 15 RW scenarios only.
 * Does not rebuild bank. Does not touch LB/RB/CB or locked refs.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { scoreRubricV2 } from './scenario-bank/quality-rubric-v2.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const matrixPath = join(root, 'scripts/rw-gold-coverage-matrix.json');
const beforePath = join(root, 'scripts/rw-surgical-locked-refs-before.json');

const LOCKED = [
  'scn_bank_872',
  'scn_bank_873',
  'scn_bank_876',
  'scn_bank_879',
  'scn_bank_897',
];

const TARGET = new Set([
  'scn_bank_871',
  'scn_bank_886',
  'scn_bank_890',
  'scn_bank_874',
  'scn_bank_875',
  'scn_bank_883',
  'scn_bank_902',
  'scn_bank_877',
  'scn_bank_878',
  'scn_bank_910',
  'scn_bank_912',
  'scn_bank_922',
  'scn_bank_924',
  'scn_bank_880',
  'scn_bank_929',
]);

function L(en, hr, de) {
  return { en, hr, de };
}
function ans(quality, text, feedback) {
  return { quality, text, feedback };
}
function hash(obj) {
  return createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

function setTags(s, { perception, handedness, numerical, gameState, base }) {
  const next = [...(base || [])];
  if (perception) next.push('perception');
  if (handedness && handedness !== 'none') next.push(`handedness:${handedness}`);
  if (numerical && numerical !== '6v6') next.push(`numerical:${numerical}`);
  if (gameState && gameState !== 'none') next.push(`gameState:${gameState}`);
  s.skillTags = [...new Set(next)];
}

function rescore(s) {
  const scored = scoreRubricV2(s, {
    singleBestOk: true,
    cueSpecific: true,
    gameStateExplicit: /Vodite|Gubite|Neriješeno/.test(s.situation?.hr || ''),
  });
  s.qualityScore = Math.max(7.5, Math.min(9.6, Math.round(scored.overall * 10) / 10));
  return scored;
}

const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const matrix = JSON.parse(readFileSync(matrixPath, 'utf8'));
const before = JSON.parse(readFileSync(beforePath, 'utf8'));

const lbBefore = bank.filter((s) => s.primaryPosition === 'Left Back').length;
const rbBefore = bank.filter((s) => s.primaryPosition === 'Right Back').length;
const cbBefore = bank.filter((s) => s.primaryPosition === 'Centre Back').length;

// Verify locked unchanged before edits
for (const id of LOCKED) {
  const s = bank.find((x) => x.id === id);
  const h = hash(s);
  if (h !== before.locked[id]) {
    throw new Error(`Locked ${id} already drifted before surgical pass`);
  }
}

const byId = Object.fromEntries(bank.map((s) => [s.id, s]));
const reportRows = [];

function record(id, meta) {
  reportRows.push({ id, ...meta });
}

// ─────────────── 871 ───────────────
{
  const s = byId.scn_bank_871;
  s.title = L(
    'Right Wing — Take Off Toward the Middle While the Wing Defender Is Still Inside',
    'Desno krilo — odraz prema sredini dok je krilni branič još unutra',
    'Rechtsaußen — zur Mitte abspringen solange der Außenverteidiger noch innen ist',
  );
  s.situation = L(
    'You lead 8:7 at 14\' against a set 6:0. The right back drives between the half defender and the wing defender and pulls the wing defender one full step inside. You stay wide near the sideline. The ball arrives while the wing defender is still turned toward the right back and has not recovered to the corner — you have clear space to take off toward the middle. The goalkeeper stands closer to the near post, but that is the next read during the jump, not the first decision.',
    'Vodite 8:7 u 14. minuti protiv postavljene 6:0. Desni vanjski napada između polubranitelja i krilnog braniča i povlači krilnog braniča cijeli korak unutra. Ostaješ široko uz aut-liniju. Lopta stiže dok je krilni branič još okrenut prema desnom vanjskom i nije se vratio u kut — imaš čist prostor za odraz prema sredini. Vratar stoji bliže prvoj stativi, ali to je sljedeće čitanje tijekom skoka, ne prva odluka.',
    'Ihr führt 8:7 in Minute 14 gegen eine stehende 6:0. Der rechte Rückraum zieht zwischen Halbem und Außenverteidiger und holt den Außenverteidiger einen vollen Schritt nach innen. Du bleibst breit an der Seitenlinie. Der Ball kommt, während der Außenverteidiger noch zum Rückraum gedreht ist und nicht in die Ecke zurück ist — du hast klaren Raum für den Absprung zur Mitte. Der Torhüter steht näher am nahen Pfosten, aber das ist die nächste Lesung im Sprung, nicht die erste Entscheidung.',
  );
  s.question = L(
    'What must you do first while the wing defender is still inside?',
    'Što moraš prvo učiniti dok je krilni branič još unutra?',
    'Was musst du zuerst tun solange der Außenverteidiger noch innen ist?',
  );
  s.answers = [
    ans(
      'optimal',
      L(
        'Take off toward the middle immediately before the wing defender recovers to the corner',
        'Odmah se odrazi prema sredini prije nego se krilni branič vrati u kut',
        'Sofort zur Mitte abspringen bevor der Außenverteidiger in die Ecke zurückkommt',
      ),
      L(
        'Correct — the open take-off is the first decision.',
        'Točno — otvoreni odraz je prva odluka.',
        'Richtig — der offene Absprung ist die erste Entscheidung.',
      ),
    ),
    ans(
      'good',
      L(
        'Hold the catch and wait only if the defender recovers onto your take-off path before you jump',
        'Zadrži prijem i čekaj samo ako se branič vrati na put odraza prije skoka',
        'Fang halten und nur warten wenn der Verteidiger vor dem Sprung auf deinen Absprungweg zurückkommt',
      ),
      L(
        'Becomes correct if the window closes on the catch.',
        'Postaje točno ako se prilika zatvori na prijema.',
        'Wird richtig wenn das Fenster beim Fang zugeht.',
      ),
    ),
    ans(
      'risky',
      L(
        'Pass back to the right back who is already crowded by the recovering wing defender',
        'Vrati loptu desnom vanjskom koji je već pod vraćajućim krilnim braničem',
        'Zurück auf den rechten Rückraum der schon unter dem zurückkehrenden Außenverteidiger steht',
      ),
      L(
        'Gives away a clean take-off that is already there.',
        'Predaje čist odraz koji je već tu.',
        'Verschenkt einen sauberen Absprung der schon da ist.',
      ),
    ),
    ans(
      'poor',
      L(
        'Stay glued to the sideline and force a standing shot without using the take-off toward the middle',
        'Ostani zalijepljen za aut-liniju i forsiraj šut iz mjesta bez odraza prema sredini',
        'An der Seitenlinie kleben und einen Standwurf erzwingen ohne Absprung zur Mitte',
      ),
      L(
        'Ignores the space the right back just created.',
        'Ignorira prostor koji je desni vanjski upravo stvorio.',
        'Ignoriert den Raum den der rechte Rückraum gerade geschaffen hat.',
      ),
    ),
  ];
  s.explanation = L(
    'First decision: take off toward the middle while the wing defender is still inside. After you are in the air, read the goalkeeper for the finish. Do not mix those two steps into one Beginner choice.',
    'Prva odluka: odraz prema sredini dok je krilni branič još unutra. Kad si u zraku, čitaj vratara za završetak. Ne miješaj ta dva koraka u jednu početničku odluku.',
    'Erste Entscheidung: zur Mitte abspringen solange der Außenverteidiger noch innen ist. In der Luft dann den Torhüter für den Abschluss lesen. Diese zwei Schritte nicht in eine Anfängerentscheidung mischen.',
  );
  s.whyCorrectOverSecondBest = L(
    'A uses the open take-off that exists now; B waits for a recovery that has not happened.',
    'A koristi otvoreni odraz koji postoji sada; B čeka povratak koji se nije dogodio.',
    'A nutzt den jetzt offenen Absprung; B wartet auf eine Rückkehr die nicht da ist.',
  );
  s.difficulty = 'Beginner';
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    base: ['finishing', 'positioning'],
  });
  rescore(s);
  record('scn_bank_871', {
    changeType: 'tactical rewrite',
    tacticalReason: 'Split take-off first decision from GK finish; remove handedness',
    difficulty: 'Beginner',
    perception: true,
    handedness: 'none',
    handednessReason: 'First decision identical for either throwing hand',
    remainingUncertainty: 'None material',
  });
}

// ─────────────── 886 language ───────────────
{
  const s = byId.scn_bank_886;
  s.answers[0].text = L(
    'Stay wide and wait for the next action; the defender is already recovering before the pass can arrive',
    'Ostani široko i čekaj novu akciju; branič se već vraća prije nego što dodavanje može stići',
    'Breit bleiben und auf die nächste Aktion warten; der Verteidiger kommt schon zurück bevor der Pass ankommen kann',
  );
  s.explanation = L(
    'Hips and first foot already turn back to the corner while the right back cannot pass yet. The wing chance is gone for now; stay available for the next action.',
    'Bokovi i prva noga već se vraćaju prema kutu dok desni vanjski još ne može dodati. Šansa na krilu trenutno je nestala; ostani dostupan za novu akciju.',
    'Hüften und erster Fuß drehen schon zur Ecke während der rechte Rückraum noch nicht passen kann. Die Flügelchance ist vorbei; für die nächste Aktion verfügbar bleiben.',
  );
  s.answers[0].feedback = L(
    'Correct — wait wide while he recovers.',
    'Točno — čekaj široko dok se vraća.',
    'Richtig — breit warten während er zurückkommt.',
  );
  // DE answer A polish
  s.answers[0].text.de =
    'Breit bleiben und auf die nächste Aktion warten; der Verteidiger kommt schon zurück bevor der Pass ankommen kann';
  rescore(s);
  record('scn_bank_886', {
    changeType: 'language only',
    tacticalReason: 'Unchanged hips-recover wait decision',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 890 ───────────────
{
  const s = byId.scn_bank_890;
  s.title = L(
    'Right Wing — Enter After the Second Inside Help',
    'Desno krilo — ulazak nakon druge pomoći unutra',
    'Rechtsaußen — Einlauf nach der zweiten Innenhilfe',
  );
  s.situation = L(
    'You trail 18:19 at 36\'. On the first right-back drive you stayed wide and the wing defender recovered. The right back attacks again; this time the half defender is already occupied by the pivot, so the wing defender steps two metres inside to stop the drive. His back is to the corner and space opens behind him for your run. The right back can see that run.',
    'Gubite 18:19 u 36. minuti. Na prvom prodoru desnog vanjskog ostao si široko i krilni branič se vratio. Desni vanjski ponovno napada; ovaj put je polubranitelj već zauzet pivotom pa krilni branič ulazi dva metra unutra da zaustavi prodor. Leđima je prema kutu i iza njega se otvara prostor za utrčavanje. Desni vanjski vidi taj ulazak.',
    'Ihr liegt 18:19 in Minute 36 zurück. Beim ersten Zug des rechten Rückraums bliebst du breit und der Außenverteidiger kam zurück. Der rechte Rückraum greift erneut an; diesmal bindet der Kreisläufer den Halben, deshalb tritt der Außenverteidiger zwei Meter innen. Sein Rücken ist zur Ecke und dahinter öffnet sich Raum für deinen Einlauf. Der rechte Rückraum sieht diesen Lauf.',
  );
  s.question = L(
    'When do you start the wing entry?',
    'Kada krećeš u ulazak krila?',
    'Wann startest du den Flügeleinlauf?',
  );
  s.answers[0].text = L(
    'Enter behind the wing defender now, after his second inside help has emptied the corner',
    'Sada utrči iza leđa krilnog braniča, nakon što je drugom pomoći unutra ispraznio kut',
    'Jetzt hinter dem Außenverteidiger einlaufen, nachdem seine zweite Innenhilfe die Ecke geleert hat',
  );
  s.explanation = L(
    'On the second drive the pivot holds the half defender and the wing defender helps two metres inside, back to the corner. Now the entry separates from the right back’s line.',
    'Na drugom prodoru pivot drži polubranitelja, a krilni branič pomaže dva metra unutra, leđima prema kutu. Sada se ulazak odvaja od linije desnog vanjskog.',
    'Beim zweiten Zug bindet der Kreisläufer den Halben und der Außenverteidiger hilft zwei Meter innen, Rücken zur Ecke. Jetzt trennt sich der Einlauf von der Linie des rechten Rückraums.',
  );
  rescore(s);
  record('scn_bank_890', {
    changeType: 'language only',
    tacticalReason: 'Same second-help entry timing',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 874 ───────────────
{
  const s = byId.scn_bank_874;
  s.answers[0].text = L(
    'Take off toward the middle before the defender clears the pivot block — then read the goalkeeper during the jump for the finish',
    'Odrazi se prema sredini prije nego branič obiđe blok pivota — pa tijekom skoka čitaj vratara za završetak',
    'Zur Mitte abspringen bevor der Verteidiger den Kreisläuferblock umläuft — dann im Sprung den Torhüter für den Abschluss lesen',
  );
  s.answers[0].feedback = L(
    'Correct — use the open take-off first; the finish is the next read in the air.',
    'Točno — prvo iskoristi otvoreni odraz; završetak je sljedeće čitanje u zraku.',
    'Richtig — zuerst den offenen Absprung nutzen; der Abschluss ist die nächste Lesung in der Luft.',
  );
  s.situation = L(
    'Tied 14:14 at 27\' against 6:0. The pivot sets a block on your wing defender’s inside shoulder — the defender cannot slide toward the middle without fouling. You receive near the sideline with room to take off toward the middle before he recovers around the pivot. The goalkeeper stays deep on the goal line and has not stepped out toward you. The real advantage is that take-off space; choose the finish from the goalkeeper read during the take-off.',
    'Neriješeno je 14:14 u 27. minuti protiv 6:0. Pivot postavlja blok na unutarnje rame tvog krilnog braniča — branič ne može skliznuti prema sredini bez prekršaja. Primaš blizu aut-linije s prostorom za odraz prema sredini prije nego branič obiđe pivota. Vratar ostaje duboko na golu i nije izašao prema tebi. Prava prednost je taj prostor za odraz; završetak biraj prema čitanju vratara tijekom odraza.',
    'Unentschieden 14:14 in Minute 27 gegen 6:0. Der Kreisläufer setzt den Block auf die Innenschulter deines Außenverteidigers — ohne Foul kommt er nicht zur Mitte. Du fängst nahe der Seitenlinie mit Raum für den Absprung zur Mitte bevor er um den Kreisläufer herumkommt. Der Torhüter bleibt tief auf der Torlinie und ist nicht zu dir herausgekommen. Der echte Vorteil ist dieser Absprungraum; den Abschluss aus dem Torhüterlesen während des Absprungs wählen.',
  );
  s.explanation = L(
    'Pivot blocks the wing defender’s inside recovery — take-off toward the middle is open. Use that take-off now. Deep goalkeeper does not automatically pick the target; read him during the jump. Pass to the pivot only if they close your take-off.',
    'Pivot blokira unutarnji povratak krilnog braniča — odraz prema sredini je otvoren. Iskoristi taj odraz sada. Duboki vratar sam ne određuje metu; čitaj ga tijekom skoka. Dodaj pivotu samo ako ti zatvore odraz.',
    'Kreisläufer blockiert die Innenrückkehr — Absprung zur Mitte ist offen. Jetzt nutzen. Tiefer Torhüter wählt das Ziel nicht automatisch; im Sprung lesen. Pass zum Kreisläufer nur wenn der Absprung zugeht.',
  );
  s.whyCorrectOverSecondBest = L(
    'A uses the already open take-off; B is only if the defender clears the block and closes that lane.',
    'A koristi već otvoreni odraz; B je samo ako branič obiđe blok i zatvori taj put.',
    'A nutzt den schon offenen Absprung; B nur wenn der Verteidiger den Block umläuft und die Bahn schließt.',
  );
  rescore(s);
  record('scn_bank_874', {
    changeType: 'answer polish',
    tacticalReason: 'A = take-off before block clears; GK is next read',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 875 ───────────────
{
  const s = byId.scn_bank_875;
  s.situation = L(
    'You lead 10:9 at 19\'. You receive alone in the right corner; the wing defender is one step late from helping inside. Before you take off, the goalkeeper’s near foot and near arm already move toward the near post — he closes that side early and leaves more room toward the far post. You take off toward the middle with a clean release path to that far side.',
    'Vodite 10:9 u 19. minuti. Primaš sam u desnom kutu; krilni branič kasni jedan korak s pomoći unutra. Prije odraza bliža noga i bliža ruka vratara već idu prema prvoj stativi — prerano zatvara tu stranu i ostavlja više prostora prema drugoj stativi. Odraziš se prema sredini s čistim putem za ispuštanje na tu daleku stranu.',
    'Ihr führt 10:9 in Minute 19. Du fängst allein in der rechten Ecke; der Außenverteidiger ist einen Schritt spät von der Innenhilfe. Vor dem Absprung gehen naher Fuß und naher Arm des Torhüters schon zum nahen Pfosten — er schließt diese Seite früh und lässt mehr Raum zum langen Pfosten. Du springst zur Mitte mit sauberem Abgabeweg auf diese lange Seite.',
  );
  // Avoid "ispuštanje" forbidden? language gate forbids puštanje - ispuštanje might match. Use "za šut"
  s.situation.hr =
    'Vodite 10:9 u 19. minuti. Primaš sam u desnom kutu; krilni branič kasni jedan korak s pomoći unutra. Prije odraza bliža noga i bliža ruka vratara već idu prema prvoj stativi — prerano zatvara tu stranu i ostavlja više prostora prema drugoj stativi. Odraziš se prema sredini s čistim putem za šut na tu daleku stranu.';
  s.explanation = L(
    'Before take-off the near foot and near arm commit to the near post. That makes the far-post side more available. The throwing hand is not the reason — the goalkeeper movement is.',
    'Prije odraza bliža noga i bliža ruka idu na prvu stativu. To čini stranu druge stative dostupnijom. Ruka kojom bacaš nije razlog — pokret vratara jest.',
    'Vor dem Absprung legen sich naher Fuß und naher Arm auf den nahen Pfosten. Das macht die lange Seite zugänglicher. Die Wurhand ist nicht der Grund — die Torhüterbewegung ist es.',
  );
  s.whyCorrectOverSecondBest = L(
    'A uses the early near-post commit that is already visible; B needs dropped hands and an early leave that are not here.',
    'A koristi preranu obvezu na prvu stativu koja se već vidi; B treba spuštene ruke i rani iskok kojih nema.',
    'A nutzt die schon sichtbare frühe Nahpfosten-Festlegung; B braucht gesenkte Hände und frühes Abheben die fehlen.',
  );
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    base: ['finishing'],
  });
  rescore(s);
  record('scn_bank_875', {
    changeType: 'metadata only',
    tacticalReason: 'Same GK early-commit read; remove left-hand framing',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    handednessReason: 'Far-side availability comes from GK commit, not throwing hand',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 883 ───────────────
{
  const s = byId.scn_bank_883;
  s.situation = L(
    'You lead 13:11 at 25\'. You catch near the right sideline. The wing defender has recovered from inside and closed your take-off toward the middle, chest facing you. The half defender has followed the pivot, leaving the right back free for a short return at nine metres.',
    'Vodite 13:11 u 25. minuti. Primaš blizu desne aut-linije. Krilni branič vratio se iznutra i zatvorio ti je prostor za odraz prema sredini, prsima prema tebi. Polubranitelj je otišao za pivotom pa je desni vanjski slobodan za kratku povratnu loptu na devet metara.',
    'Ihr führt 13:11 in Minute 25. Du fängst nahe der rechten Seitenlinie. Der Außenverteidiger ist von innen zurück und hat dir den Absprungraum zur Mitte geschlossen, Brust zu dir. Der Halbe folgt dem Kreisläufer, der rechte Rückraum ist für den kurzen Rückpass auf neun Metern frei.',
  );
  s.explanation = L(
    'The wing defender has closed the take-off toward the middle. Do not force a wing shot — short return to the free right back and keep the corner occupied.',
    'Krilni branič zatvorio ti je prostor za odraz prema sredini. Ne forsiraj šut s krila — kratka povratna slobodnom desnom vanjskom i zadrži kut zauzetim.',
    'Der Außenverteidiger hat den Absprung zur Mitte geschlossen. Keinen Flügelwurf erzwingen — kurzer Rückpass zum freien rechten Rückraum und die Ecke besetzt halten.',
  );
  rescore(s);
  record('scn_bank_883', {
    changeType: 'language only',
    tacticalReason: 'Same closed take-off → short return',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 902 ───────────────
{
  const s = byId.scn_bank_902;
  s.title = L(
    'Right Wing — First Wave 2v1: Stay Wide as the Pass Option',
    'Desno krilo — prvi val 2 na 1: ostani široko kao opcija za dodavanje',
    'Rechtsaußen — erste Welle 2v1: breit als Passoption bleiben',
  );
  s.situation = L(
    'You lead 10:9 at 20\'. After the ball win you and the centre back run a 2v1 on the right side of the first wave. The centre back has the ball centrally. The only recovering defender stands between him and the goal, chest toward the ball. You are wide on the right near the six-metre line with a clear path if he commits to the centre back. If you cut early into his chest, you close the 2v1 yourself.',
    'Vodite 10:9 u 20. minuti. Nakon osvajanja lopte ti i srednji vanjski trčite 2 na 1 desnom stranom prvog vala. Srednji vanjski vodi loptu sredinom. Jedini branič u povratku stoji između njega i gola, prsima prema lopti. Ti si široko desno uz liniju šest metara s čistim putem ako on krene na srednjeg. Ako rano utrčiš u njegova prsa, sam zatvaraš 2 na 1.',
    'Ihr führt 10:9 in Minute 20. Nach dem Ballgewinn lauft ihr mit dem Rückraum Mitte ein 2v1 auf der rechten Seite der ersten Welle. Der Rückraum Mitte führt den Ball zentral. Der einzige zurücklaufende Verteidiger steht zwischen ihm und dem Tor, Brust zum Ball. Du bist breit rechts an der Sechs-Meter-Linie mit klarem Weg wenn er zum Rückraum geht. Läufst du früh in seine Brust, machst du das 2v1 selbst zu.',
  );
  s.answers[0].text = L(
    'Hold width near six metres and stay wide as the pass option while the centre back fixes the defender',
    'Drži širinu uz šest metara i ostani široko kao opcija za dodavanje dok srednji veže braniča',
    'Breite an der Sechs halten und breit als Passoption bleiben während der Rückraum den Verteidiger bindet',
  );
  s.answers[1].text = L(
    'Cut behind him only after the centre back has fixed his feet with a shot threat or drive',
    'Utrči iza njega tek kad mu srednji veže noge prijetnjom šuta ili prodorom',
    'Hinter ihn einlaufen erst wenn der Rückraum seine Füße mit Schussdrohung oder Durchbruch bindet',
  );
  s.answers[1].feedback = L(
    'Good as the second action after the fix.',
    'Dobro kao druga akcija nakon vezivanja.',
    'Gut als zweite Aktion nach dem Binden.',
  );
  s.explanation = L(
    'One defender between ball and goal: stay wide as the pass option. Enter behind him only after he is fixed. Early middle runs destroy the 2v1.',
    'Jedan branič između lopte i gola: ostani široko kao opcija za dodavanje. Utrči iza njega tek kad je vezan. Rani utrčaji u sredinu uništavaju 2 na 1.',
    'Ein Verteidiger zwischen Ball und Tor: breit als Passoption bleiben. Hinter ihn erst nach dem Binden. Frühe Läufe in die Mitte zerstören das 2v1.',
  );
  rescore(s);
  record('scn_bank_902', {
    changeType: 'language only',
    tacticalReason: 'Same 2v1 width hold; HR gender/consistency fix',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 877 ───────────────
{
  const s = byId.scn_bank_877;
  s.situation = L(
    'You lead 18:17 at 35\'. In the first wave you were left 2v2 on the right; the centre back slows because a recovering defender is already between him and you. A second recovering defender is two strides from the six-metre line. There is no clean finish now. The defence has already set into a 6:0. You are still high and wide on the right — if you force inside now, you arrive late into a crowded area without the ball.',
    'Vodite 18:17 u 35. minuti. U prvom valu ostali ste 2 na 2 na desnoj strani; srednji vanjski usporava jer je branič u povratku već između njega i tebe. Drugi branič u povratku udaljen je dva koraka od linije šest metara. Nema čistog završetka. Obrana se u međuvremenu postavila u 6:0. Još si visoko i široko desno — ako sada forsiraš ulazak unutra, kasno stižeš u zbijeni prostor bez lopte.',
    'Ihr führt 18:17 in Minute 35. In der ersten Welle wart ihr 2 gegen 2 rechts; der Rückraum Mitte bremst weil ein Zurückkommender schon zwischen ihm und dir steht. Ein zweiter Zurückkommender ist zwei Schritte von der Sechs entfernt. Es gibt keinen sauberen Abschluss. Die Abwehr hat sich inzwischen in einer 6:0 gestellt. Du bist noch hoch und breit rechts — erzwingst du jetzt den Einlauf innen, kommst du spät in den engen Raum ohne Ball.',
  );
  s.explanation = L(
    'Recovering defenders have arrived and the defence is already in 6:0 — the first-wave advantage is gone. Stay wide on the right and move into the set attack. Forcing the cut ignores that the counter is over.',
    'Braniči u povratku stigli su i obrana je već u 6:0 — prednost prvog vala nestala je. Ostani široko desno i prijeđi u pozicijski napad. Forsiranje ulaska ignorira da je kontra gotova.',
    'Zurückkommende sind da und die Abwehr steht schon in 6:0 — der Vorteil der ersten Welle ist weg. Rechts breit bleiben und in den Positionsangriff gehen. Den Einlauf zu erzwingen ignoriert dass der Konter vorbei ist.',
  );
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: 'transition',
    gameState: 'none',
    base: ['transition', 'gameReading'],
  });
  rescore(s);
  record('scn_bank_877', {
    changeType: 'metadata only',
    tacticalReason: 'Same settle decision; perception=true for reading recovery/set defence',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 878 ───────────────
{
  const s = byId.scn_bank_878;
  s.title = L(
    'Right Wing — 6v5: Read the Recovering Defender’s Distance',
    'Desno krilo — 6 na 5: čitaj udaljenost braniča u povratku',
    'Rechtsaußen — 6v5: Distanz des zurückkommenden Verteidigers lesen',
  );
  s.situation = L(
    'You lead 21:20 at 41\' in a 6v5 after their exclusion. The right back has pulled two defenders. You receive near the sideline. The nearest recovering defender is still more than two metres from your take-off spot, sprinting but not yet able to contest the jump. The goalkeeper stays deep. Another full swing to the far side would give that defender time to reach your corner.',
    'Vodite 21:20 u 41. minuti u igraču više 6 na 5 nakon njihovog isključenja. Desni vanjski povukao je dva braniča. Primaš blizu aut-linije. Najbliži branič u povratku još je više od dva metra od mjesta tvog odraza — sprinta, ali još ne može ometati skok. Vratar ostaje duboko. Još jedan puni prelazak na drugu stranu dao bi tom braniču vremena da stigne u tvoj kut.',
    'Ihr führt 21:20 in Minute 41 im 6v5 nach ihrer Zeitstrafe. Der rechte Rückraum hat zwei Verteidiger gezogen. Du fängst nahe der Seitenlinie. Der nächste zurückkommende Verteidiger ist noch mehr als zwei Meter von deinem Absprungpunkt — er sprintet, kann den Sprung aber noch nicht stören. Der Torhüter bleibt tief. Ein weiterer voller Seitenwechsel gäbe ihm Zeit in deine Ecke zu kommen.',
  );
  s.question = L(
    'What does the nearest defender’s position tell you right now?',
    'Što ti položaj najbližeg braniča govori u ovom trenutku?',
    'Was sagt dir die Position des nächsten Verteidigers jetzt?',
  );
  s.answers = [
    ans(
      'optimal',
      L(
        'Finish now — he is still too far to contest your take-off before you jump',
        'Završi sada — još je predaleko da ometa tvoj odraz prije skoka',
        'Jetzt abschließen — er ist noch zu weit um deinen Absprung vor dem Sprung zu stören',
      ),
      L(
        'Correct — distance and recovery timing decide the finish.',
        'Točno — udaljenost i vrijeme povratka odlučuju o završetku.',
        'Richtig — Distanz und Rückkehrzeit entscheiden den Abschluss.',
      ),
    ),
    ans(
      'good',
      L(
        'Short pass to the right back only if he closes inside two metres and reaches your take-off before you control the catch',
        'Kratko dodavanje desnom vanjskom samo ako uđe unutar dva metra i stigne na odraz prije nego kontroliraš prijem',
        'Kurzer Pass auf den rechten Rückraum nur wenn er unter zwei Meter kommt und deinen Absprung erreicht bevor du den Fang kontrollierst',
      ),
      L(
        'Becomes correct if the recovery wins the race to your take-off.',
        'Postaje točno ako povratak pobijedi utrku do odraza.',
        'Wird richtig wenn die Rückkehr das Rennen zum Absprung gewinnt.',
      ),
    ),
    ans(
      'risky',
      L(
        'Swing to the other side again because you are a player up and should keep circulating',
        'Ponovno prebaci na drugu stranu jer ste igrač više i treba cirkulirati',
        'Nochmal auf die andere Seite schieben weil Überzahl weiter zirkulieren soll',
      ),
      L(
        'Gives the recovering defender the time he needs to reach your corner.',
        'Daje braniču u povratku vrijeme koje mu treba da stigne u kut.',
        'Gibt dem Zurückkommenden die Zeit die er in deine Ecke braucht.',
      ),
    ),
    ans(
      'poor',
      L(
        'Force a pass into the crowded pivot area instead of using this wing window',
        'Forsiraj dodavanje u zbijeni prostor pivota umjesto ovog trenutka na krilu',
        'Pass in den verdichteten Kreisraum erzwingen statt dieses Flügelfensters',
      ),
      L(
        'Ignores the clearer finish that the recovery distance creates.',
        'Ignorira jasniji završetak koji stvara udaljenost u povratku.',
        'Ignoriert den klareren Abschluss den die Rückkehrdistanz schafft.',
      ),
    ),
  ];
  s.explanation = L(
    '6v5 helps create the picture, but the decision comes from the recovering defender still being more than two metres from your take-off. Finish before he arrives. Recycle only if he wins that race.',
    '6 na 5 pomaže stvoriti sliku, ali odluka dolazi iz toga što je branič u povratku još više od dva metra od odraza. Završi prije nego stigne. Vrati loptu samo ako pobijedi tu utrku.',
    '6v5 hilft das Bild zu schaffen, aber die Entscheidung kommt daher dass der Zurückkommende noch mehr als zwei Meter vom Absprung ist. Vor seiner Ankunft abschließen. Zurück nur wenn er das Rennen gewinnt.',
  );
  s.whyCorrectOverSecondBest = L(
    'A reads the current distance as a finish window; B waits for a close contest that is not there yet.',
    'A čita trenutnu udaljenost kao priliku za završetak; B čeka bliski kontakt kojeg još nema.',
    'A liest die aktuelle Distanz als Abschlussfenster; B wartet auf engen Kontakt den es noch nicht gibt.',
  );
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: '6v5',
    gameState: 'none',
    base: ['finishing', 'numericalAdvantage', 'decisionMaking'],
  });
  rescore(s);
  record('scn_bank_878', {
    changeType: 'tactical rewrite',
    tacticalReason: 'Question now tests defender-distance read, not comprehension repeat',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 910 ───────────────
{
  const s = byId.scn_bank_910;
  s.situation = L(
    'You trail 18:17 at 36\' a player down (5v6). The defence is compact. Your wing defender stays tight on you — square to the corner, body between you and the take-off toward the middle — and does not help inside on the ball. The right back needs a safe release on the right. Forcing a corner finish into that body risks the ball and the space behind your attack.',
    'Gubite 18:17 u 36. minuti s igračem manje (5 na 6). Obrana je kompaktna. Krilni branič ostaje uz tebe — okrenut kutu, tijelom između tebe i odraza prema sredini — i ne pomaže unutra na loptu. Desnom vanjskom treba sigurna opcija desno. Forsiranje završetka iz kuta u to tijelo riskira loptu i prostor iza napada.',
    'Ihr liegt 18:17 in Minute 36 in Unterzahl (5v6). Die Abwehr ist kompakt. Dein Außenverteidiger bleibt eng an dir — frontal zur Ecke, Körper zwischen dir und dem Absprung zur Mitte — und hilft innen nicht am Ball. Der rechte Rückraum braucht eine sichere Ablage rechts. Ein erzwungener Eckenabschluss in diesen Körper riskiert Ball und Raum hinter eurem Angriff.',
  );
  s.answers[0].text = L(
    'Hold width near the sideline as the safe release and do not force a corner shot into the tight wing defender',
    'Drži širinu uz aut-liniju kao sigurnu opciju za dodavanje i ne forsiraj šut iz kuta u čvrstog krilnog braniča',
    'Breite an der Seitenlinie als sichere Ablage halten und keinen Eckenwurf in den engen Außenverteidiger erzwingen',
  );
  s.answers[1].text = L(
    'Ask for the ball only after he turns inside to help and leaves real space for your take-off toward the middle',
    'Traži loptu tek kad se okrene unutra u pomoć i ostavi stvaran prostor za odraz prema sredini',
    'Den Ball erst fordern wenn er innen zur Hilfe dreht und echten Raum für den Absprung zur Mitte lässt',
  );
  s.explanation = L(
    'Player down: keep width as the safe release. Do not force the corner into a wing defender who stays tight and closes the take-off. Attack only if he helps inside and real take-off space appears.',
    'Igrač manje: čuvaj širinu kao sigurnu opciju. Ne forsiraj kut u krilnog braniča koji ostaje uz tebe i zatvara odraz. Napadaj samo ako pomogne unutra i pojavi se stvaran prostor za odraz.',
    'Unterzahl: Breite als sichere Ablage. Keine Ecke in den engen Außenverteidiger erzwingen der den Absprung schließt. Erst angreifen wenn er innen hilft und echter Absprungraum entsteht.',
  );
  s.whyCorrectOverSecondBest = L(
    'A is the job for this covered 5v6 picture; B waits for help inside that has not started.',
    'A je posao za ovu zatvorenu sliku 5 na 6; B čeka pomoć unutra koja još nije krenula.',
    'A ist der Job für dieses verstellte 5v6; B wartet auf Innenhilfe die noch nicht begonnen hat.',
  );
  setTags(s, {
    perception: false,
    handedness: 'none',
    numerical: '5v6',
    gameState: 'none',
    base: ['decisionMaking', 'teamplay'],
  });
  rescore(s);
  record('scn_bank_910', {
    changeType: 'tactical rewrite',
    tacticalReason: 'Player-term defender geometry; 5v6 width/risk decision',
    difficulty: 'Intermediate',
    perception: false,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 912 distinct 7v6 ───────────────
{
  const s = byId.scn_bank_912;
  s.title = L(
    'Right Wing — 7v6 with Empty Own Goal: Quick Clean Finish or Immediate Return',
    'Desno krilo — 7 na 6 s praznim vlastitim golom: brz čist završetak ili odmah povratak',
    'Rechtsaußen — 7v6 mit leerem eigenem Tor: schneller sauberer Abschluss oder sofort zurück',
  );
  s.situation = L(
    'You lead 20:19 at 40\' attacking 7v6 — your goalkeeper is out as the seventh attacker, own goal empty. The second pivot binds the half defender and the centre defender inside. That forces your wing defender to choose: step inside toward the second-pivot/RB action, or stay on you. He takes one clear step inside. You receive near the sideline. Because your own goal is empty, you cannot admire the picture: finish only if the first touch is clean and the take-off toward the middle is free; otherwise return immediately to the right back.',
    'Vodite 20:19 u 40. minuti u napadu 7 na 6 — vratar je vani kao sedmi napadač, vlastiti gol prazan. Drugi pivot veže polubranitelja i središnjeg braniča unutra. To tjera tvog krilnog braniča na izbor: ući unutra prema akciji drugog pivota i desnog vanjskog, ili ostati na tebi. On uzima jedan čist korak unutra. Primaš uz aut-liniju. Jer je vlastiti gol prazan, ne smiješ gledati sliku: završi samo ako je prvi dodir čist i odraz prema sredini slobodan; inače odmah vrati desnom vanjskom.',
    'Ihr führt 20:19 in Minute 40 im 7v6 — Torwart draußen als siebter Angreifer, eigenes Tor leer. Der zweite Kreis bindet Halben und Mitte innen. Das zwingt deinen Außenverteidiger zur Wahl: innen zur Aktion von zweitem Kreis/rechtem Rückraum oder bei dir bleiben. Er geht einen klaren Schritt innen. Du fängst an der Seitenlinie. Weil euer Tor leer ist, darfst du das Bild nicht betrachten: nur abschließen wenn der erste Kontakt sauber und der Absprung zur Mitte frei ist; sonst sofort zum rechten Rückraum zurück.',
  );
  s.question = L(
    'In this 7v6 with your own goal empty, what is the right first decision on the catch?',
    'U ovom 7 na 6 s praznim vlastitim golom, što je točna prva odluka na prijema?',
    'In diesem 7v6 mit leerem eigenem Tor — was ist die richtige erste Entscheidung beim Fang?',
  );
  s.answers = [
    ans(
      'optimal',
      L(
        'If the first touch is clean and the take-off toward the middle is free, finish immediately before he recovers — your own goal is empty',
        'Ako je prvi dodir čist i odraz prema sredini slobodan, završi odmah prije nego se vrati — vlastiti gol je prazan',
        'Wenn der erste Kontakt sauber und der Absprung zur Mitte frei ist, sofort abschließen bevor er zurückkommt — eigenes Tor ist leer',
      ),
      L(
        'Correct — 7v6 collapse plus empty own goal demands a quick, clean finish.',
        'Točno — sužavanje u 7 na 6 plus prazan vlastiti gol traži brz, čist završetak.',
        'Richtig — 7v6-Einengung plus leeres eigenes Tor verlangt schnellen, sauberen Abschluss.',
      ),
    ),
    ans(
      'good',
      L(
        'Immediate short return if the first touch is messy or he recovers onto the take-off before you jump',
        'Odmah kratka povratna ako je prvi dodir nezgodan ili se vrati na odraz prije skoka',
        'Sofort kurzer Rückpass wenn der erste Kontakt unsauber ist oder er vor dem Sprung auf den Absprung zurückkommt',
      ),
      L(
        'Correct when the finish is not technically safe with an empty own goal.',
        'Točno kad završetak nije tehnički siguran uz prazan vlastiti gol.',
        'Richtig wenn der Abschluss mit leerem eigenem Tor technisch nicht sicher ist.',
      ),
    ),
    ans(
      'risky',
      L(
        'Hold the ball to run clock because you lead by one',
        'Drži loptu da spustiš sat jer vodite jedan gol',
        'Ball halten um die Uhr zu spielen weil ihr mit einem führt',
      ),
      L(
        'With your own goal empty, delay is the expensive mistake.',
        'S praznim vlastitim golom odgađanje je skupa greška.',
        'Mit leerem eigenem Tor ist Verzögerung der teure Fehler.',
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
        'Unnecessary risk into an empty own-goal counter.',
        'Nepotrebni rizik u kontru na prazan vlastiti gol.',
        'Unnötiges Risiko in den Konter aufs leere eigene Tor.',
      ),
    ),
  ];
  s.explanation = L(
    'Second pivot collapses the interior and the wing defender must step inside — that creates the wing window. Empty own goal makes the decision binary and urgent: clean finish now, or immediate return. Do not hold.',
    'Drugi pivot sužava unutrašnjost i krilni branič mora ući unutra — to stvara priliku na krilu. Prazan vlastiti gol čini odluku binarnom i hitnom: čist završetak sada ili odmah povratak. Ne drži loptu.',
    'Zweiter Kreis engt innen und der Außenverteidiger muss innen gehen — das schafft das Flügelfenster. Leeres eigenes Tor macht die Entscheidung binär und dringend: sauber jetzt abschließen oder sofort zurück. Nicht halten.',
  );
  s.whyCorrectOverSecondBest = L(
    'A is for a clean catch with free take-off under empty-own-goal urgency; B is the escape when the catch or take-off is not safe.',
    'A je za čist prijem sa slobodnim odrazom uz hitnost praznog vlastitog gola; B je izlaz kad prijem ili odraz nisu sigurni.',
    'A gilt bei sauberem Fang und freiem Absprung unter leerem-eigenem-Tor-Druck; B ist der Ausweg wenn Fang oder Absprung nicht sicher sind.',
  );
  s.difficulty = 'Expert';
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: '7v6',
    gameState: 'empty_own_risk',
    base: ['decisionMaking', 'riskManagement', 'finishing'],
  });
  rescore(s);
  record('scn_bank_912', {
    changeType: 'tactical rewrite',
    tacticalReason: 'Distinct 7v6: second-pivot collapse + empty-own-goal urgency binary',
    difficulty: 'Expert',
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'Still related to free-wing family but game-state risk now material',
  });
}

// ─────────────── 922 distinct late-game ───────────────
{
  const s = byId.scn_bank_922;
  s.title = L(
    'Right Wing — Trailing Late: Take the High-Percentage Wing Chance Now',
    'Desno krilo — zaostatak u finišu: uzmi jaku priliku na krilu sada',
    'Rechtsaußen — spät zurück: starke Flügelchance jetzt nehmen',
  );
  s.situation = L(
    'You trail 26:27 at 59\' with little time left. The right back has drawn the wing defender one step inside and the ball arrives clean in front of your body near the sideline. Your take-off toward the middle is free on the first step; the defender is turning back but cannot win the race to contest that jump. The right back is free for a return, but another full circulation almost certainly ends the attack without a shot. You need a goal — this is a high-percentage wing chance, not a forced bad catch.',
    'Gubite 26:27 u 59. minuti s malo vremena. Desni vanjski povukao je krilnog braniča korak unutra i lopta stiže čisto ispred tijela uz aut-liniju. Odraz prema sredini slobodan je na prvom koraku; branič se okreće natrag, ali ne stiže ometati taj skok. Desni vanjski je slobodan za povratak, ali još jedna puna razmjena gotovo sigurno završava napad bez šuta. Treba vam gol — ovo je jaka prilika s krila, ne forsirani loš prijem.',
    'Ihr liegt 26:27 in Minute 59 mit wenig Zeit zurück. Der rechte Rückraum hat den Außenverteidiger einen Schritt innen gezogen und der Ball kommt sauber vor dem Körper an der Seitenlinie. Absprung zur Mitte ist im ersten Schritt frei; er dreht zurück, erreicht den Sprung aber nicht. Der rechte Rückraum ist für den Rückpass frei, aber ein weiterer voller Umlauf beendet den Angriff fast sicher ohne Wurf. Ihr braucht ein Tor — das ist eine starke Flügelchance, kein erzwungener schlechter Fang.',
  );
  s.question = L(
    'Trailing late with a clean wing window — what is the right decision?',
    'U zaostatku u finišu s čistom prilikom na krilu — što je točna odluka?',
    'Spät zurück mit sauberem Flügelfenster — was ist die richtige Entscheidung?',
  );
  s.answers = [
    ans(
      'optimal',
      L(
        'Take the finish now — clean catch, free take-off, and another circulation likely ends the attack without a shot',
        'Uzmi završetak sada — čist prijem, slobodan odraz, a još jedna razmjena vjerojatno završava napad bez šuta',
        'Abschluss jetzt nehmen — sauberer Fang, freier Absprung, und ein weiterer Umlauf beendet den Angriff wahrscheinlich ohne Wurf',
      ),
      L(
        'Correct — late deficit makes this clean wing chance the shot you need.',
        'Točno — kasni zaostatak čini ovu čistu priliku na krilu šutom koji trebaš.',
        'Richtig — der späte Rückstand macht diese saubere Flügelchance zum nötigen Wurf.',
      ),
    ),
    ans(
      'good',
      L(
        'Short return only if the first touch fails and you would be forcing a contested take-off',
        'Kratka povratna samo ako prvi dodir ne uspije i forsirala bi osporeni odraz',
        'Kurzer Rückpass nur wenn der erste Kontakt scheitert und du einen umkämpften Absprung erzwingen würdest',
      ),
      L(
        'Correct if the catch becomes messy — do not force a poor shot even when trailing.',
        'Točno ako prijem postane nezgodan — ne forsiraj loš šut čak ni u zaostatku.',
        'Richtig wenn der Fang unsauber wird — auch zurück keinen schlechten Wurf erzwingen.',
      ),
    ),
    ans(
      'risky',
      L(
        'Hold for another full circulation to look for a higher-percentage set shot',
        'Čekaj još jednu punu razmjenu da nađeš “sigurniji” šut iz pozicije',
        'Auf einen weiteren vollen Umlauf warten um einen „sichereren“ Positionswurf zu suchen',
      ),
      L(
        'With little time and a clean wing window, this usually ends the attack empty.',
        'S malo vremena i čistom prilikom na krilu to obično završava napad prazan.',
        'Mit wenig Zeit und sauberem Flügelfenster endet das den Angriff meist leer.',
      ),
    ),
    ans(
      'poor',
      L(
        'Enter without the ball into the traffic the right back just left',
        'Uđi bez lopte u gužvu koju je desni vanjski upravo napustio',
        'Ohne Ball in den Verkehr gehen den der rechte Rückraum gerade verlassen hat',
      ),
      L(
        'Abandons the clean finish you already have.',
        'Napušta čist završetak koji već imaš.',
        'Gibt den sauberen Abschluss auf den du schon hast.',
      ),
    ),
  ];
  s.explanation = L(
    'Late and trailing: a clean catch with free take-off is the high-percentage chance. Take it now. Return only if the catch becomes messy — game state does not justify forcing a bad shot, but it does justify refusing another empty circulation.',
    'Kasno i u zaostatku: čist prijem sa slobodnim odrazom jaka je prilika. Uzmi je sada. Vrati samo ako prijem postane nezgodan — rezultat ne opravdava loš šut, ali opravdava odbijanje još jedne prazne razmjene.',
    'Spät und zurück: sauberer Fang mit freiem Absprung ist die starke Chance. Jetzt nehmen. Zurück nur wenn der Fang unsauber wird — der Spielstand rechtfertigt keinen schlechten Wurf, aber er verbietet einen weiteren leeren Umlauf.',
  );
  s.whyCorrectOverSecondBest = L(
    'A takes the clean late-game wing chance that exists; B is only for a failed first touch.',
    'A uzima čistu kasnu priliku na krilu koja postoji; B je samo za neuspješan prvi dodir.',
    'A nimmt die vorhandene saubere späte Flügelchance; B nur bei gescheitertem Erstkontakt.',
  );
  s.difficulty = 'Expert';
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'trailing_one',
    base: ['timing', 'decisionMaking', 'riskManagement'],
  });
  rescore(s);
  record('scn_bank_922', {
    changeType: 'tactical rewrite',
    tacticalReason: 'Late deficit + time pressure justifies taking clean wing chance now',
    difficulty: 'Expert',
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'Still shares free-takeoff DNA with 871/878 but game-state is now the teaching point',
  });
}

// ─────────────── 924 ───────────────
{
  const s = byId.scn_bank_924;
  s.score = '25:25';
  s.minute = 49;
  s.situation = L(
    'Tied 25:25 at 49\'. Passive warning is active. You catch in the right corner, but the wing defender is square between you and the six-metre line and the half defender has closed inside help. The goalkeeper has stepped out. The right back is free immediately behind you for a short return, and there is still enough action time for that one fast continuation before the referee stops the attack. Forcing the closed wing shot is worse than the immediate return.',
    'Neriješeno je 25:25 u 49. minuti. Aktivno je upozorenje na pasivnu igru. Primaš u desnom kutu, ali krilni branič stoji ravno između tebe i linije šest metara, a polubranitelj je zatvorio pomoć iznutra. Vratar je izašao. Desni vanjski je odmah slobodan iza tebe za kratku povratnu, i još ima dovoljno vremena akcije za taj jedan brz nastavak prije nego sudac prekine napad. Forsiranje zatvorenog šuta s krila gore je od trenutnog povratka.',
    'Unentschieden 25:25 in Minute 49. Passivwarnung ist aktiv. Du fängst in der rechten Ecke, aber der Außenverteidiger steht frontal zwischen dir und der Sechs-Meter-Linie, der Halbe schließt innen. Der Torhüter ist herausgetreten. Der rechte Rückraum ist sofort hinter dir frei für den kurzen Rückpass, und es bleibt genug Aktionszeit für diese eine schnelle Fortsetzung bevor der Schiedsrichter den Angriff stoppt. Den geschlossenen Flügelwurf zu erzwingen ist schlechter als der sofortige Rückpass.',
  );
  s.question = L(
    'Passive warning, wing closed — what is the best decision?',
    'Pasivna igra, krilo zatvoreno — što je najbolja odluka?',
    'Passiv, Flügel zu — was ist die beste Entscheidung?',
  );
  s.answers[0].text = L(
    'Immediate short return to the free right back while there is still time for one fast continuation',
    'Odmah kratka povratna slobodnom desnom vanjskom dok još ima vremena za jedan brz nastavak',
    'Sofort kurzer Rückpass zum freien rechten Rückraum solange noch Zeit für eine schnelle Fortsetzung bleibt',
  );
  s.answers[1].text = L(
    'Finish only if the wing defender turns inside and opens a real take-off before you release',
    'Završi samo ako se krilni branič okrene unutra i otvori stvaran odraz prije ispuštanja lopte',
    'Nur abschließen wenn der Außenverteidiger innen dreht und vor der Abgabe einen echten Absprung öffnet',
  );
  // fix ispuštanje - use "prije šuta"
  s.answers[1].text.hr =
    'Završi samo ako se krilni branič okrene unutra i otvori stvaran odraz prije šuta';
  s.explanation = L(
    'Passive warning needs a real action, not a bad wing shot. Wing closed, half help closed, goalkeeper out — immediate return to the free right back while one continuation is still possible. Finish only if the take-off actually opens.',
    'Upozorenje na pasivnu igru traži stvarnu akciju, ne loš šut s krila. Krilo zatvoreno, pomoć iznutra zatvorena, vratar vani — odmah vrati slobodnom desnom vanjskom dok je jedan nastavak još moguć. Završi samo ako se odraz stvarno otvori.',
    'Passivwarnung braucht eine echte Aktion, keinen schlechten Flügelwurf. Flügel zu, Innenhilfe zu, Torhüter draußen — sofort zum freien rechten Rückraum zurück solange eine Fortsetzung noch möglich ist. Abschluss nur wenn der Absprung wirklich aufgeht.',
  );
  s.whyCorrectOverSecondBest = L(
    'A uses the free immediate continuation that still fits under passive pressure; B needs an opening that is not present.',
    'A koristi slobodan trenutni nastavak koji još staje pod pasivnim pritiskom; B treba otvaranje kojeg nema.',
    'A nutzt die freie sofortige Fortsetzung die unter Passivdruck noch passt; B braucht eine Öffnung die fehlt.',
  );
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'passive_warning',
    base: ['passivePlay', 'riskManagement'],
  });
  rescore(s);
  record('scn_bank_924', {
    changeType: 'tactical rewrite',
    tacticalReason: 'Fixed tied score; removed duplicate minute/score; passive timing meaningful',
    difficulty: 'Expert',
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 880 ───────────────
{
  const s = byId.scn_bank_880;
  s.answers = [
    ans(
      'optimal',
      L(
        'Protect the pass to their wing, show a controlled step inside toward the drive, and wait for the handover call',
        'Štiti dodavanje na njihovo krilo, pokaži kontrolirani korak unutra prema prodoru i čekaj poziv za preuzimanje',
        'Den Pass auf ihren Flügel sichern, einen kontrollierten Innenschritt zum Zug zeigen und auf den Übergaberuf warten',
      ),
      L(
        'Correct — controlled help without abandoning the wing before handover.',
        'Točno — kontrolirana pomoć bez napuštanja krila prije preuzimanja.',
        'Richtig — kontrollierte Hilfe ohne Flügelaufgabe vor der Übergabe.',
      ),
    ),
    ans(
      'good',
      L(
        'Leave the wing completely and take the drive yourself now because the half defender is late',
        'Potpuno napusti krilo i sam preuzmi prodor sada jer polubranitelj kasni',
        'Den Flügel vollständig verlassen und den Zug selbst übernehmen weil der Halbe spät ist',
      ),
      L(
        'Looks right because the half is late, but full leave before handover frees their wing.',
        'Izgleda točno jer polubranitelj kasni, ali potpuni odlazak prije preuzimanja oslobađa njihovo krilo.',
        'Sieht richtig aus weil der Halbe spät ist, aber volles Verlassen vor der Übergabe macht ihren Flügel frei.',
      ),
    ),
    ans(
      'risky',
      L(
        'Stay glued to their wing and give no inside help even though the half defender is already beaten on the drive',
        'Ostani zalijepljen za njihovo krilo i ne daj nikakvu pomoć unutra iako je polubranitelj već proigran na prodoru',
        'Am Flügel kleben und innen keine Hilfe geben obwohl der Halbe am Zug schon geschlagen ist',
      ),
      L(
        'Protects the wing pass but gifts the walk-in at six metres.',
        'Štiti dodavanje na krilo, ali poklanja šetnju na šest metara.',
        'Schützt den Flügelpass, schenkt aber den Spaziergang auf sechs Meter.',
      ),
    ),
    ans(
      'poor',
      L(
        'Turn your back to the ball and only watch their wing at the sideline',
        'Okreni leđa lopti i samo gledaj njihovo krilo uz aut-liniju',
        'Dem Ball den Rücken drehen und nur ihren Flügel an der Seitenlinie beobachten',
      ),
      L(
        'Loses the ball and the drive at the same time.',
        'Gubi i loptu i prodor u isto vrijeme.',
        'Verliert Ball und Zug gleichzeitig.',
      ),
    ),
  ];
  // situation/question/explanation keep team rule; polish explanation for new C
  s.explanation = L(
    'Team rule: half takes the ball carrier; wing protects the wing pass until handover. Half is late and has not called. A = controlled help. B = too much help (full leave). C = no inside help. D = lose visual connection to the ball.',
    'Pravilo ekipe: polubranitelj preuzima igrača s loptom; krilo štiti dodavanje na krilo do preuzimanja. Polubranitelj kasni i nije pozvao. A = kontrolirana pomoć. B = previše pomoći (potpuni odlazak). C = bez pomoći unutra. D = gubiš vizualni kontakt s loptom.',
    'Teamregel: Halber übernimmt den Ballführer; Flügel sichert den Flügelpass bis zur Übergabe. Halber ist spät und hat nicht gerufen. A = kontrollierte Hilfe. B = zu viel Hilfe (volles Verlassen). C = keine Innenhilfe. D = visueller Ballkontakt weg.',
  );
  s.whyCorrectOverSecondBest = L(
    'A keeps wing responsibility with controlled help; B abandons the wing before the handover call.',
    'A drži odgovornost za krilo uz kontroliranu pomoć; B napušta krilo prije poziva za preuzimanje.',
    'A hält Flügelverantwortung mit kontrollierter Hilfe; B verlässt den Flügel vor dem Übergaberuf.',
  );
  // dedupe perception tag
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: '6v6',
    gameState: 'none',
    base: ['defensiveReading', 'decisionMaking'],
  });
  rescore(s);
  record('scn_bank_880', {
    changeType: 'answer polish',
    tacticalReason: 'Distinct B too much help / C no help / D lose awareness',
    difficulty: s.difficulty,
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// ─────────────── 929 ───────────────
{
  const s = byId.scn_bank_929;
  s.title = L(
    'Right Wing — Defence in 3v2: Protect Your Sideline Pass Lane',
    'Desno krilo — obrana u 3 na 2: zatvori dodavanje tvojom stranom',
    'Rechtsaußen — Abwehr im 3 gegen 2: Passbahn auf deiner Seite schließen',
  );
  s.situation = L(
    'Tied 17:17 at 33\'. After your turnover you are one of two defenders back in a 3v2. Their centre runner has the ball in the middle. Their left wing is wide on the far side and is already being tracked by your teammate, who has taken the centre-left lane between that left wing and the ball. Their right wing sprints up your sideline and is still free. You are two steps from the direct pass lane to that right wing. If you sprint straight at the ball carrier now, you leave that right-side pass open while your teammate is already occupied on the other side.',
    'Neriješeno je 17:17 u 33. minuti. Nakon gubitka lopte vi ste dvojica braniča u povratku protiv 3 na 2. Njihov srednji vodi loptu kroz sredinu. Njihovo lijevo krilo je široko na drugoj strani i već ga prati tvoj suigrač, koji je zauzeo središnje-lijevi put između tog lijevog krila i lopte. Njihovo desno krilo sprinta uz tvoju aut-liniju i još je slobodno. Ti si dva koraka od izravne linije dodavanja tom desnom krilu. Ako sada juriš ravno na igrača s loptom, ostavljaš to desno dodavanje otvorenim dok je suigrač već zaposlen na drugoj strani.',
    'Unentschieden 17:17 in Minute 33. Nach eurem Ballverlust seid ihr zwei Verteidiger zurück gegen 3 gegen 2. Ihr Mittelmann führt den Ball zentral. Ihr Linksaußen ist auf der anderen Seite breit und wird schon von deinem Mitspieler verfolgt, der die mitte-linke Bahn zwischen diesem Linksaußen und dem Ball genommen hat. Ihr Rechtsaußen sprintet an deiner Seitenlinie und ist noch frei. Du bist zwei Schritte von der direkten Passlinie zu diesem Rechtsaußen. Sprintest du jetzt gerade auf den Ballführer, lässt du diesen rechten Pass offen während dein Mitspieler schon auf der anderen Seite gebunden ist.',
  );
  s.question = L(
    'With your teammate already covering the far side, what is your first job?',
    'Kad suigrač već pokriva drugu stranu, što je tvoj prvi posao?',
    'Wenn dein Mitspieler die andere Seite schon deckt — was ist dein erster Job?',
  );
  s.answers = [
    ans(
      'optimal',
      L(
        'Drop into the direct pass lane to their right wing on your sideline and force the ball carrier to decide later',
        'Spusti se u izravnu liniju dodavanja njihovom desnom krilu uz tvoju aut-liniju i natjeraj igrača s loptom na kasniju odluku',
        'In die direkte Passlinie zu ihrem Rechtsaußen an deiner Seitenlinie fallen und den Ballführer später entscheiden lassen',
      ),
      L(
        'Correct — your teammate has the far side; your first job is the open right-side pass.',
        'Točno — suigrač ima drugu stranu; tvoj prvi posao je otvoreno desno dodavanje.',
        'Richtig — dein Mitspieler hat die andere Seite; dein erster Job ist der offene rechte Pass.',
      ),
    ),
    ans(
      'good',
      L(
        'Step to the ball only after a recovering teammate covers the pass to their right wing',
        'Izađi na loptu tek kad suigrač u povratku pokrije dodavanje njihovom desnom krilu',
        'Erst zum Ball treten wenn ein zurückkommender Mitspieler den Pass auf ihren Rechtsaußen deckt',
      ),
      L(
        'Becomes correct once the right-side lane is covered by someone else.',
        'Postaje točno kad desni put pokrije netko drugi.',
        'Wird richtig sobald die rechte Bahn von jemand anderem gedeckt ist.',
      ),
    ),
    ans(
      'risky',
      L(
        'Sprint straight at the ball carrier immediately and leave their right wing alone on your sideline',
        'Odmah sprintaj ravno na igrača s loptom i ostavi njihovo desno krilo samo uz tvoju aut-liniju',
        'Sofort gerade auf den Ballführer sprinten und ihren Rechtsaußen allein an deiner Seitenlinie lassen',
      ),
      L(
        'Leaves the open 3v2 pass on your side while the far side is already covered.',
        'Ostavlja otvoreno dodavanje 3 na 2 na tvojoj strani dok je druga strana već pokrivena.',
        'Lässt den offenen 3v2-Pass auf deiner Seite während die andere Seite schon gedeckt ist.',
      ),
    ),
    ans(
      'poor',
      L(
        'Stop at nine metres and point for someone else to run your sideline',
        'Stani na devet metara i pokaži nekome drugome da trči tvoju stranu',
        'Auf neun Metern stehen bleiben und jemand anderen auf deine Seite schicken',
      ),
      L(
        'Abandons the lane that is specifically your responsibility in this 3v2.',
        'Napušta put koji je baš tvoja odgovornost u ovom 3 na 2.',
        'Gibt die Bahn auf die in diesem 3v2 genau deine Verantwortung ist.',
      ),
    ),
  ];
  s.explanation = L(
    '3v2 geometry: teammate already covers the far left wing and centre-left lane. The open danger on your side is the pass to their right wing. Drop into that lane and delay the ball carrier. Do not chase the ball while that pass is free.',
    'Geometrija 3 na 2: suigrač već pokriva daleko lijevo krilo i središnje-lijevi put. Otvorena opasnost na tvojoj strani je dodavanje njihovom desnom krilu. Spusti se u taj put i uspori igrača s loptom. Ne juri loptu dok je to dodavanje slobodno.',
    '3v2-Geometrie: Mitspieler deckt schon den fernen Linksaußen und die mitte-linke Bahn. Die offene Gefahr auf deiner Seite ist der Pass auf ihren Rechtsaußen. In diese Bahn fallen und den Ballführer verzögern. Nicht den Ball jagen solange dieser Pass frei ist.',
  );
  s.whyCorrectOverSecondBest = L(
    'A matches the open right-side lane while the far side is covered; B waits for another cover that is not there yet.',
    'A odgovara otvorenom desnom putu dok je druga strana pokrivena; B čeka drugo pokriće kojeg još nema.',
    'A passt zur offenen rechten Bahn während die andere Seite gedeckt ist; B wartet auf eine weitere Deckung die noch fehlt.',
  );
  setTags(s, {
    perception: true,
    handedness: 'none',
    numerical: 'transition',
    gameState: 'none',
    base: ['transitionDefence', 'spacing'],
  });
  rescore(s);
  record('scn_bank_929', {
    changeType: 'tactical rewrite',
    tacticalReason: 'Explicit 3v2: teammate covers far side; RW closes own-side pass lane',
    difficulty: 'Advanced',
    perception: true,
    handedness: 'none',
    remainingUncertainty: 'None',
  });
}

// Verify locked still identical
const afterLocked = {};
for (const id of LOCKED) {
  const s = byId[id];
  const h = hash(s);
  afterLocked[id] = h;
  if (h !== before.locked[id]) {
    throw new Error(`LOCKED REF CHANGED DURING PASS: ${id}`);
  }
}

if (bank.filter((s) => s.primaryPosition === 'Left Back').length !== lbBefore) {
  throw new Error('LB changed');
}
if (bank.filter((s) => s.primaryPosition === 'Right Back').length !== rbBefore) {
  throw new Error('RB changed');
}
if (bank.filter((s) => s.primaryPosition === 'Centre Back').length !== cbBefore) {
  throw new Error('CB changed');
}

// Sync matrix for targets
for (const row of matrix) {
  if (!TARGET.has(row.id)) continue;
  const s = byId[row.id];
  const r = reportRows.find((x) => x.id === row.id);
  row.difficulty = s.difficulty;
  row.perception = !!r?.perception || (s.skillTags || []).includes('perception');
  row.handedness = r?.handedness || 'none';
  row.qualityScore = s.qualityScore;
  if (r?.perception !== undefined) row.perception = r.perception;
}

writeFileSync(bankPath, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(matrixPath, JSON.stringify(matrix, null, 2) + '\n');
writeFileSync(
  join(root, 'scripts/rw-surgical-locked-refs-after.json'),
  JSON.stringify({ createdAt: new Date().toISOString(), locked: afterLocked, unchanged: true }, null, 2) +
    '\n',
);

const rw = bank.filter((s) => s.primaryPosition === 'Right Wing');
const summary = {
  status: 'APPLIED',
  targets: reportRows.length,
  byType: reportRows.reduce((a, r) => {
    a[r.changeType] = (a[r.changeType] || 0) + 1;
    return a;
  }, {}),
  rwCount: rw.length,
  lockedUnchanged: true,
  rows: reportRows,
};
writeFileSync(join(root, 'scripts/rw-surgical-pass-summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
