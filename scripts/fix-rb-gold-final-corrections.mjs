#!/usr/bin/env node
/**
 * Right Back gold bank — final human correction pass (targeted only).
 * Does not rebuild bank or touch Left Back.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(path, 'utf8'));

const report = {
  handednessFound: [],
  handednessFixed: [],
  croatianFixes: [],
  tactical: {},
};

function get(id) {
  const s = bank.find((x) => x.id === id);
  if (!s) throw new Error(`missing ${id}`);
  return s;
}

function setHand(s, hand) {
  const tags = [...(s.skillTags || [])].filter((t) => !String(t).startsWith('handedness:'));
  if (hand && hand !== 'none') tags.push(`handedness:${hand}`);
  s.skillTags = tags;
}

function mapHr(s, fn) {
  const touch = (obj, label) => {
    if (!obj?.hr) return;
    const next = fn(obj.hr);
    if (next !== obj.hr) {
      obj.hr = next;
      report.croatianFixes.push(`${s.id}:${label}`);
    }
  };
  touch(s.title, 'title');
  touch(s.situation, 'situation');
  touch(s.question, 'question');
  touch(s.explanation, 'explanation');
  for (const [i, a] of (s.answers || []).entries()) {
    touch(a.text, `A${i}.text`);
    touch(a.feedback, `A${i}.fb`);
  }
}

const leftCue = /lijevom rukom|ljevoruk|lijevak|left-hand|left handed|lijevoruk/i;
const rightCue = /desnom rukom|desnoruk|desnjak|right-hand|right handed|desnoruk/i;

// ── 1) Handedness metadata audit ──
for (const s of bank.filter((x) => x.primaryPosition === 'Right Back')) {
  const blob = [
    s.title?.en,
    s.title?.hr,
    s.situation?.en,
    s.situation?.hr,
    s.question?.hr,
    s.explanation?.hr,
    ...(s.answers || []).flatMap((a) => [a.text?.hr, a.feedback?.hr]),
  ].join('\n');
  const meta = (s.skillTags || []).find((t) => String(t).startsWith('handedness:'))?.replace('handedness:', '') || 'none';
  const hasL = leftCue.test(blob);
  const hasR = rightCue.test(blob);
  let expect = 'none';
  if (hasL && !hasR) expect = 'left';
  else if (hasR && !hasL) expect = 'right';
  else if (hasL && hasR) expect = meta; // leave if both appear
  if (expect !== meta) {
    report.handednessFound.push({ id: s.id, meta, expect, title: s.title?.en });
    setHand(s, expect);
    report.handednessFixed.push({ id: s.id, from: meta, to: expect });
  }
}

// Force required three
for (const [id, hand] of [
  ['scn_bank_710', 'left'],
  ['scn_bank_725', 'right'],
  ['scn_bank_760', 'left'],
]) {
  const s = get(id);
  const before = (s.skillTags || []).find((t) => String(t).startsWith('handedness:')) || 'none';
  setHand(s, hand);
  if (before !== `handedness:${hand}`) {
    report.handednessFixed.push({ id, from: before, to: hand, forced: true });
  }
}

// ── 2) scn_bank_710 Croatian ──
{
  const s = get('scn_bank_710');
  s.answers[0].text.hr =
    'Napadni rupu jednim snažnim korakom i iskoristi prirodan kut šuta lijevom rukom prema daljem kutu';
  s.answers[0].text.en =
    'Attack the gap with one strong step and use your natural left-handed shooting angle to the far corner';
  s.question.hr = 'Kao ljevoruki, što radiš s ovom otvorenom linijom šuta?';
  s.explanation.hr =
    'Signal: rupa široka kao tijelo u 6:0 i niska bliža ruka bloka. Kao ljevoruki desni vanjski, već imaš prirodan kut šuta lijevom rukom prema daljem kutu — iskoristi ga jednim snažnim korakom prije nego se linija zatvori. Lažni zamah (B) usporava kad je ruka bloka još niska.';
  report.tactical['710'] = 'Kept logic; naturalised shooting phrasing.';
}

// ── 3) scn_bank_720 terminology ──
{
  const s = get('scn_bank_720');
  mapHr(s, (hr) =>
    hr
      .replace(/istaknuti branič/g, 'prednji branič')
      .replace(/istaknuti /g, 'prednji ')
      .replace(/Istaknuti /g, 'Prednji ')
      .replace(/niske trojke/g, 'donjeg reda obrane')
      .replace(/niska trojka/g, 'donji red obrane'),
  );
  s.situation.hr =
    'Neriješeno je 25:25 u 44. minuti protiv 3:2:1. Njihov prednji branič izašao je na tvog srednjeg vanjskog, a dva srednja braniča stoje stepenasto iza njega. Između te prve linije i donjeg reda obrane, na tvojoj strani, otvoren je spoj otprilike na jedanaest metara. Srednji vanjski može dati i primiti loptu natrag u jednom taktu.';
  s.question.hr = 'Koji prostor ostavlja 3:2:1 kada prednji branič izađe?';
  s.answers[0].text.hr =
    'Spoj iza prve linije — kratka razmjena sa srednjim vanjskim i uđi prije nego se dvojica srednjih zatvore';
  s.answers[1].text.hr =
    'Prolaz prema pivotu iza prednjeg braniča, ako je potpuno okrenut leđima prema šest metara';
  s.explanation.hr =
    'Signal: prednji branič je izašao na srednjeg vanjskog, a dva srednja braniča stoje stepenasto, ne u ravnini. To ostavlja spoj iza prve linije na strani lopte — uzmi kratku razmjenu sa srednjim vanjskim i uđi prije nego se donji red zatvori. Prolaz na pivota (B) vrijedi samo ako je prednji potpuno okrenut leđima.';
  report.tactical['720'] = 'Canonical prednji branič; replaced niska trojka with donji red obrane.';
}

// ── 4) scn_bank_722 single-best rewrite ──
{
  const s = get('scn_bank_722');
  s.situation = {
    en: "Tied 17:17 at 29'. Opponent defends 3:3. Between the three high and three low defenders the spaces are large. On your side the channel toward the right wing is already open — their wing defender is a full stride late recovering width. You receive at nine metres with time. The high defender opposite you is half a step late on every ball change. The pivot has not drawn help yet.",
    hr: 'Neriješeno je 17:17 u 29. minuti, a protivnik brani 3:3. Između tri visoka i tri niska braniča stoje veliki prostori. Na tvojoj strani kanal prema desnom krilu već je otvoren — njihov krilni branič kasni cijeli korak s povratom u širinu. Primaš na devet metara s vremenom. Visoki branič nasuprot tebi kasni pola koraka na svaku promjenu lopte. Pivot još nije povukao nikakvu pomoć.',
    de: s.situation.de,
  };
  s.question = {
    en: 'Where does the surplus appear first?',
    hr: 'Gdje nastaje višak?',
    de: s.question.de,
  };
  s.answers[0].text = {
    en: 'Ball speed through the already open right channel — attack before the late wing defender recovers',
    hr: 'Brzina lopte kroz već otvoreni desni kanal — napadni prije nego se zakašnjeli krilni branič vrati u širinu',
    de: s.answers[0].text.de,
  };
  s.answers[0].feedback = {
    en: 'Correct — the corridor is already open and the wing defender is late; first punish that with tempo.',
    hr: 'Točno — koridor je već otvoren, a krilni branič kasni; prvo kazni to tempom.',
    de: s.answers[0].feedback.de,
  };
  s.answers[1].text = {
    en: 'Quick exchange with the right wing first, then attack the same corridor after he draws the high man',
    hr: 'Prvo brza razmjena s desnim krilom, pa napadni isti koridor nakon što on izvuče visokog braniča',
    de: s.answers[1].text.de,
  };
  s.answers[1].feedback = {
    en: 'Good idea in general, but here the corridor is already open — the exchange burns the one-tempo gift.',
    hr: 'Općenito dobra ideja, ali ovdje je koridor već otvoren — razmjena troši jednokratni dar tempa.',
    de: s.answers[1].feedback.de,
  };
  s.explanation = {
    en: 'Cue: the right channel is already open and the wing defender is a full stride late. Surplus is immediate ball speed into that channel. A wing exchange (B) can create surplus later, but here it slows the attack while the late defender recovers.',
    hr: 'Signal: desni kanal već je otvoren, a krilni branič kasni cijeli korak. Višak je trenutačna brzina lopte u taj kanal. Razmjena s krilom (B) može kasnije stvoriti višak, ali ovdje usporava napad dok se zakašnjeli branič vraća.',
    de: s.explanation.de,
  };
  report.tactical['722'] =
    'Rewrote cue: corridor already open + wing defender full stride late → immediate attack clearly > wing exchange.';
}

// ── 5) scn_bank_750 defence terminology ──
{
  const s = get('scn_bank_750');
  s.title.hr = 'Desni vanjski — napad na kombiniranu 5+1 s individualnim čuvanjem pivota';
  s.title.en = 'Right Back — Attack vs Combined 5+1 with Pivot Individually Marked';
  s.situation.hr =
    'Vodite 12:11 u 22. minuti. Protivnik brani kombiniranu obranu 5+1: petorica u liniji, a dodatni (+1) branič individualno čuva tvog pivota gdje god krene. Ti si ljevoruki desni vanjski i primaš na devet metara na svojoj strani. Pivot je upravo odveo svog čuvara na suprotnu stranu, pa petorica moraju pokriti cijelu širinu — razmak između polubranitelja i krilnog braniča na tvojoj strani jedan je korak prevelik.';
  s.question.hr =
    'Gdje nastaje slobodna zona kad +1 branič individualno čuva pivota?';
  s.explanation.hr =
    'Signal: kombinirana 5+1 s individualnim čuvanjem pivota — +1 napušta liniju, pa petorica pokrivaju šest napadačkih mjesta. Slobodna zona je rastegnuti razmak na tvojoj strani — napadni ga tempom. Krilo u 1 na 1 druga je ispravna opcija. Dodavanje pokrivenom pivotu ili daleki šut iz mjesta baca prednost.';
  // fix vašeg → tvog already in situation
  mapHr(s, (hr) => hr.replace(/vašeg pivota/g, 'tvog pivota').replace(/Vašeg pivota/g, 'Tvog pivota'));
  report.tactical['750'] =
    'Stated explicitly: combined 5+1 with +1 individually marking the Pivot. Canonical defensiveSystem stays Mixed/5+1 as stored.';
}

// ── 6) scn_bank_751 Croatian ──
{
  const s = get('scn_bank_751');
  s.answers[0].text.hr =
    'Između stisnute linije i zakašnjelog krilnog braniča — napadni slobodan prostor dok obrana ne reagira, umjesto uskog vanjskog kuta';
  s.answers[0].text.en =
    'Between the compressed line and the late wing defender — attack the free space before the defence reacts, instead of a tight outside angle';
  s.explanation.hr =
    'Signal: dva individualna čuvara, četvorica u stisnutoj liniji i krilni branič još unutra — ti si slobodan. Napadni slobodan prostor dok obrana ne reagira; ne moraš nužno ići do šest metara ako se ranije otvori čist šut. Krilo je razumna druga opcija. Blok za pokrivenog suigrača ili čekanje baca trenutačni višak.';
  mapHr(s, (hr) => hr.replace(/vašeg /g, 'tvog ').replace(/vaše /g, 'tvoje '));
  report.tactical['751'] = 'Removed drive-to-six implication; natural free-space language.';
}

// ── 7) scn_bank_715 pivot geometry ──
{
  const s = get('scn_bank_715');
  s.situation.hr =
    'Vodite 17:16 u 30. minuti protiv 6:0. Pivot je postavio blok na unutarnjeg braniča (srednjeg/polubranitelja uz tebe) — blokira mu put prema tvojoj unutarnjoj strani. Time se otvara prolaz preko unutarnjeg ramena tvog braniča. Tvoj branič još stoji okrenut prema lopti i nije osjetio blok iza sebe. Desno krilo drži širinu i zaposlilo je svog braniča, pa pomoć s vanjske strane kasni.';
  s.question.hr = 'Pivot je blokirao unutarnjeg braniča — koji ti je prvi potez?';
  s.answers[0].text.hr =
    'Odmah napadni unutarnje rame preko bloka i završi ili izvuci zadnjeg braniča koji mora reagirati';
  s.answers[1].text.hr =
    'Iskoristi blok da povučeš pomoć, pa dodaj pivotu kad se okrene s bloka';
  s.explanation.hr =
    'Signal: pivot blokira unutarnjeg braniča (onoga uz tebe prema sredini), tvoj branič još gleda loptu, a vanjska pomoć kasni jer je krilo zaposlilo svog. Prvi potez je napad preko unutarnjeg ramena — završiš ili natjeraš zadnjeg braniča na reakciju pa pivot ostaje slobodan. Odigravanje pivota nakon okretanja (B) dolazi tek ako pomoć stigne. Čekanje ili odlazak van od bloka baca geometriju.';
  report.tactical['715'] =
    'Clarified: Pivot blocks the inside (central/half) defender; opens inside shoulder lane; last defender must react.';
}

// ── 8) scn_bank_714 dugopas → dugo dodavanje ──
{
  const s = get('scn_bank_714');
  mapHr(s, (hr) =>
    hr
      .replace(/dugopas/g, 'dugo dodavanje')
      .replace(/Dugopas/g, 'Dugo dodavanje')
      .replace(/dugopasu/g, 'dugom dodavanju'),
  );
  s.title.hr = 'Desni vanjski — širina desnog krila: dugo dodavanje ili kratko dodavanje';
  s.question.hr = 'Koji je signal za dugo dodavanje na desno krilo?';
  s.answers[2].text.hr = s.answers[2].text.hr.replace(/dugo dodavanje|dugopas/g, (m) =>
    m.includes('dugo') ? m : 'dugo dodavanje',
  );
  // ensure C uses dugo dodavanje
  if (/dugopas/i.test(s.answers[2].text.hr)) {
    s.answers[2].text.hr = 'Baci dugo dodavanje sada dok još stoji okrenut prema lopti';
  }
  report.tactical['714'] = 'Replaced dugopas with dugo dodavanje throughout.';
}

// ── 9) scn_bank_730 procjep → prostor ──
{
  const s = get('scn_bank_730');
  mapHr(s, (hr) => hr.replace(/procjepa/g, 'prostora').replace(/procjep/g, 'prostor'));
  report.tactical['730'] = 'procjep → prostor; logic unchanged.';
}

// ── 10) scn_bank_741 front phrasing + A/B ──
{
  const s = get('scn_bank_741');
  s.situation.hr =
    'Gubite 28:29 u 58. minuti i napadaš 7 na 6 s vlastitim praznim golom. Drugi pivot ulazi s tvoje strane, iz desnog poluprostora, i smješta se odmah uz unutarnju stranu polubranitelja. Linija prema njemu je kratka, ali iz sadašnjeg položaja prolazi preko tvog tijela — morao bi dodavati oko vlastitog kuka. Alternativa je dugo dodavanje preko prednje linije obrane, a njihovo lijevo krilo već naginje se u tu stranu i gleda tvoj prazan gol.';
  s.answers[0].text.hr =
    'Prvo napravi korak prema van da otvoriš ravnu bližu liniju, pa dodaj kratko — nikad dugo dodavanje preko prednje linije obrane';
  s.answers[0].feedback.hr =
    'Točno — s praznim golom najsigurnija je kratka linija nakon koraka van; dugo dodavanje preko prednje linije je ono što protivničko krilo čeka.';
  s.answers[1].text.hr =
    'Predaj loptu srednjem vanjskom i pusti ga da posluži istog pivota iz plićeg kuta';
  s.answers[1].feedback.hr =
    'Plausibilno, ali sporije: dodatno dodavanje uz prazan gol i krilo koje već anticipira povećava rizik gubitka.';
  s.answers[2].text.hr =
    'Baci dugo dodavanje preko prednje linije obrane dok se njihovo krilo već naginje';
  s.explanation.hr =
    'Signal: drugi pivot dolazi s tvoje strane, prirodna linija ide preko tijela, a protivničko krilo već anticipira dugo dodavanje preko prednje linije — gol je prazan. Prvo korak van, pa kratko dodavanje. Predaja srednjem (B) ostaje moguća, ali je sporija i rizičnija. Dugo dodavanje preko prednje linije ili forsiranje šuta s devet najopasnije su uz prazan gol.';
  report.tactical['741'] = 'Removed preko fronta; A short safe line vs B slower with empty goal.';
}

// ── 11) scn_bank_745 passive wording ──
{
  const s = get('scn_bank_745');
  s.situation.hr =
    'Sudac je podigao upozorenje na pasivnu igru. Ostalo ti je još malo dodavanja prije forsiranog završetka — u 49. minuti Vodite 25:24 protiv obrane 5:1. Blok pivota konačno drži na polubranitelju i pred tobom se na devet metara otvara stvarno čist prostor: nema ruke u tvojoj liniji šuta, prednji branič je iza lopte, a vratar je duboko u golu. Kao ljevoruki desni vanjski već imaš pripremljene noge za skok, a daleki kut je otvoren.';
  s.question.hr = 'Pod upozorenjem na pasivnu, uz čist prostor pred sobom — što sada?';
  s.answers[0].text.hr =
    'Šutiraj sada kroz čist prostor — upozorenje i otvorena linija trenutak su za završetak';
  s.answers[2].text.hr =
    'Traži još jedno prebacivanje da „izgradiš“ napad dok upozorenje traje';
  s.explanation.hr =
    'Signal: upozorenje na pasivnu je aktivno, blok drži, linija šuta je stvarno slobodna, vratar je duboko. Daljnje odgađanje troši preostala dodavanja i forsira lošiji završetak — zato šut ide sada. Dodavanje potpuno slobodnom pivotu (B) ostaje rezervna opcija samo ako je stvarno slobodniji.';
  // also situation EN soften
  s.situation.en =
    "The referee has raised the passive-play warning. You have few passes left before a forced finish — at 49' you lead 25:24 against a 5:1. The pivot block finally holds the half defender and a truly clean space opens at nine metres: no arm in your shooting lane, the front defender is behind the ball, and the goalkeeper is deep. As a left-handed right back your feet are already set to jump and the far corner is open.";
  report.tactical['745'] =
    'Removed rigid three-pass legal claim; urgency from active warning + clean window.';
}

// ── 12) scn_bank_754 ti/vi + any smijete ──
{
  const s = get('scn_bank_754');
  mapHr(s, (hr) =>
    hr
      .replace(/ne smijete/g, 'ne smiješ')
      .replace(/loptu koju si ne smiješ priuštiti izgubiti/g, 'loptu koju ne smiješ priuštiti izgubiti')
      .replace(/smijete/g, 'smiješ')
      .replace(/morate/g, 'moraš')
      .replace(/imate /g, 'imaš ')
      .replace(/napadate/g, 'napadaš')
      .replace(/\bVaš /g, 'Tvoj ')
      .replace(/\bvaš /g, 'tvoj ')
      .replace(/\bvam\b/g, 'ti'),
  );
  // Fix answer texts if any contain the bad phrase
  for (const a of s.answers) {
    if (a.feedback?.hr) {
      a.feedback.hr = a.feedback.hr
        .replace(/ne smijete/g, 'ne smiješ')
        .replace(/loptu koju si ne smiješ/g, 'loptu koju ne smiješ');
    }
    if (a.text?.hr) {
      a.text.hr = a.text.hr.replace(/ne smijete/g, 'ne smiješ');
    }
  }
  // Inject clear ti phrasing into explanation if needed
  if (!/ne smiješ/.test(s.explanation.hr) && /izgub/i.test(s.explanation.hr + s.answers.map((a) => a.feedback?.hr).join(''))) {
    // ok
  }
  // Ensure feedback A mentions possession carefully
  s.answers[0].feedback.hr =
    'Točno — uz vodstvo od jednog u završnici ne smiješ priuštiti izgubiti loptu bez pokrivene odbijene lopte i ravnoteže iza.';
  report.tactical['754'] = 'Fixed ti/vi mix (smijete→smiješ).';
}

// ── 13) Global RB polish ──
const VI_ACTION =
  /\b(morate|imate|smijete|napadate|držite|čitate|primite|Hvatate|Primate|Odmaknite|Napadnite)\b/;
const VI_POSSESS = /\b(vašeg|vaše|vašim|Vašeg|Vaše|vam se)\b/;
const BAD_PHRASES = [
  [/dugopas/gi, 'dugo dodavanje'],
  [/preko fronta/gi, 'preko prednje linije obrane'],
  [/procjep(?!a)/g, 'prostor'],
  [/procjepa/g, 'prostora'],
  [/istaknuti branič/g, 'prednji branič'],
  [/istaknuti /g, 'prednji '],
  [/pucaj prirodnu liniju/g, 'iskoristi prirodan kut šuta'],
  [/pucaj /g, 'šutiraj '], // only if remaining unnatural - careful
];

for (const s of bank.filter((x) => x.primaryPosition === 'Right Back')) {
  mapHr(s, (hr) => {
    let out = hr;
    out = out
      .replace(/\bmorate\b/g, 'moraš')
      .replace(/\bimate\b/g, 'imaš')
      .replace(/\bsmijete\b/g, 'smiješ')
      .replace(/\bnapadate\b/g, 'napadaš')
      .replace(/\bdržite\b/g, 'držiš')
      .replace(/\bvašeg\b/g, 'tvog')
      .replace(/\bVašeg\b/g, 'Tvog')
      .replace(/\bvaše\b/g, 'tvoje')
      .replace(/\bVaše\b/g, 'Tvoje')
      .replace(/\bvam se\b/g, '')
      .replace(/dugopas/gi, 'dugo dodavanje')
      .replace(/preko fronta/gi, 'preko prednje linije obrane')
      .replace(/niske trojke/g, 'donjeg reda obrane')
      .replace(/niska trojka/g, 'donji red obrane');
    // Don't blanket-replace pucaj — too aggressive; only known bad
    out = out.replace(/pucaj prirodnu liniju lijevom rukom/g, 'iskoristi prirodan kut šuta lijevom rukom');
    return out;
  });
}

// Scan remaining issues
const remainingVi = [];
const remainingBad = [];
for (const s of bank.filter((x) => x.primaryPosition === 'Right Back')) {
  const hr = [s.situation?.hr, s.question?.hr, s.explanation?.hr, ...(s.answers || []).flatMap((a) => [a.text?.hr, a.feedback?.hr])].join(
    '\n',
  );
  if (VI_ACTION.test(hr) || VI_POSSESS.test(hr)) remainingVi.push({ id: s.id, hit: hr.match(VI_ACTION)?.[0] || hr.match(VI_POSSESS)?.[0] });
  if (/dugopas|preko fronta|tuljan|brtva|centaršut|\bfeed\b|power-?play|\bkeeper\b|fiksiraj|sporni šut|\bu hvatu\b|čovjek na čovjeka/i.test(hr)) {
    remainingBad.push(s.id);
  }
}
report.remainingVi = remainingVi;
report.remainingBad = remainingBad;

writeFileSync(path, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(join(root, 'scripts/rb-gold-final-corrections-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({
  handednessFound: report.handednessFound.length,
  handednessFixed: report.handednessFixed.length,
  croatianFixTouches: report.croatianFixes.length,
  remainingVi: remainingVi.length,
  remainingBad,
  tactical: Object.keys(report.tactical),
}, null, 2));
