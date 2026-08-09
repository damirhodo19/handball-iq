#!/usr/bin/env node
/**
 * Final human correction pass — only the 12 gold LB scenarios.
 * Does not regenerate bank / deploy / expand coverage.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(path, 'utf8'));

function L(en, hr, de) {
  return { en, hr, de };
}

/** @param {string} id */
function get(id) {
  const s = bank.find((x) => x.id === id);
  if (!s) throw new Error(`missing ${id}`);
  return s;
}

function setAnswers(s, rows) {
  s.answers = rows.map(([quality, en, hr, de, fbEn, fbHr, fbDe]) => ({
    text: L(en, hr, de),
    quality,
    feedback: L(fbEn, fbHr, fbDe),
  }));
}

// ─── 156 ───
{
  const s = get('scn_bank_156');
  s.score = '22:21';
  s.situation = L(
    "You catch at nine metres against a set 6:0 at 28'. You lead 22:21. Your defender is a half-step late. The gap between the left half and the centre defender is open for one stride. The left wing is covered.",
    'Primaš loptu na devet metara protiv postavljene obrane 6:0 u 28. minuti. Vodite 22:21. Tvoj branič kasni pola koraka. Između lijevog polubranitelja i srednjeg braniča otvoren je prostor za jedan korak. Lijevo krilo je pokriveno.',
    s.situation.de,
  );
}

// ─── 158 — veži / pomakni blok; pivot clearly first ───
{
  const s = get('scn_bank_158');
  s.score = '28:27';
  s.title = L(
    'Left Back — Block Line vs Sealed Pivot',
    'Lijevi vanjski — linija bloka protiv zatvorenog pivota',
    s.title.de,
  );
  s.situation = L(
    "You receive at nine metres against a compact 6:0 at 51'. You lead 28:27. The pivot has already sealed the right defender and is asking for the ball behind him. Two defenders raise a block into your shooting lane — a clean shot through them is gone. The left wing is covered.",
    'Primaš na devet metara protiv zbijene obrane 6:0 u 51. minuti. Vodite 28:27. Pivot je već zatvorio desnog braniča i traži loptu iza njega. Dva braniča dižu blok u tvoju liniju šuta — čist šut kroz njih više nije opcija. Lijevo krilo je pokriveno.',
    s.situation.de,
  );
  s.question = L(
    'What is the first action when the block closes your shot and the pivot is already sealed?',
    'Što je prva akcija kad ti blok zatvori šut, a pivot je već zatvorio?',
    s.question.de,
  );
  setAnswers(s, [
    [
      'optimal',
      'Bind the defender, move the block with a drive fake, then play to the sealed pivot',
      'Veži braniča, pomakni blok fintom prodora, zatim odigraj na pivota',
      'Verteidiger binden, Block mit Durchbruchfinte verschieben, dann zum Kreisläufer spielen',
      'Correct — the seal is already won; the fake only opens the pass behind the block.',
      'Točno — zatvaranje pivota je već dobiveno; finta samo otvara dodavanje iza bloka.',
      'Richtig — die Abdichtung ist schon da; die Finte öffnet nur den Pass hinter dem Block.',
    ],
    [
      'good',
      'If the fake drops the top arm and frees a near corner, take that shot',
      'Ako finta spusti gornju ruku i otvori bliži kut, uzmi taj šut',
      'Wenn die Finte den oberen Arm senkt und die nahe Ecke öffnet, diesen Wurf nehmen',
      'Good — only if the fake creates a clean corner; the sealed pivot remains first choice.',
      'Dobro — samo ako finta stvori čist kut; zatvoreni pivot ostaje prvi izbor.',
      'Gut — nur wenn die Finte eine klare Ecke öffnet; Kreisläufer bleibt erste Wahl.',
    ],
    [
      'risky',
      'Force a power jump shot straight through the raised block',
      'Forsiraj snagu skok-šuta ravno kroz podignuti blok',
      'Harten Sprungwurf frontal durch den hochgestellten Block erzwingen',
      'Risky — shooting into a set block gives easy saves.',
      'Rizično — šut u postavljeni blok daje lake obrane.',
      'Riskant — Wurf in den stehenden Block bringt leichte Paraden.',
    ],
    [
      'poor',
      'Force the pass to the covered left wing under pressure',
      'Pod pritiskom forsiraj dodavanje na pokriveno lijevo krilo',
      'Unter Druck den Pass auf den zugestellten Linksaußen erzwingen',
      'Poor — the wing is covered; that pass risks a turnover.',
      'Loše — krilo je pokriveno; to dodavanje riskira gubitak lopte.',
      'Schlecht — der Außen ist zugestellt; Ballverlust-Risiko.',
    ],
  ]);
  s.explanation = L(
    'The cue is the already-sealed pivot plus a block that has closed your shot. Bind the defender, move the block with a drive fake, then play to the pivot. A corner shot is only second if the fake drops an arm. Power through the block wastes the seal.',
    'Signal je već zatvoreni pivot i blok koji ti je zatvorio šut. Veži braniča, pomakni blok fintom prodora, zatim odigraj na pivota. Šut u kut je druga opcija samo ako finta spusti ruku. Šut kroz blok baca vrijednost zatvaranja.',
    s.explanation.de,
  );
}

// ─── 162 ───
{
  const s = get('scn_bank_162');
  s.score = '22:21';
  s.situation.hr =
    'Hamburg igra agresivnu obranu 5:1 u 51. minuti. Vodite 22:21. Njihov prednji branič potpuno je izašao na srednjeg vanjskog i ne vraća se. Ti si slobodan lijevo na devet metara. Lijevo krilo drži širinu. Pomoć s lijevog polubranitelja kasni cijeli korak.';
  s.situation.en =
    "Hamburg play an aggressive 5:1 at 51'. You lead 22:21. Their front defender has fully stepped out onto the centre back and is not recovering. You are free on the left at nine metres. The left wing holds width. Help from the left half is one full stride late.";
}

// ─── 363 ───
{
  const s = get('scn_bank_363');
  s.score = '21:22';
  s.situation = L(
    "In a 3:2:1 at 9', you trail 21:22. The ball swings to the left back at nine metres. You are the recovering high defender. Inside help is still one stride late — if you arrive out of control, he has a clean shot or draws a suspension.",
    'U obrani 3:2:1 u 9. minuti. Gubite 21:22. Lopta ide na lijevog vanjskog na devet metara. Ti si visoki branič u povratku. Unutarnja pomoć još kasni cijeli korak — ako dođeš bez kontrole, ima čist šut ili iznuđuje isključenje.',
    s.situation.de,
  );
  s.question = L(
    'How do you close out so the shot stays hard without fouling?',
    'Kako zatvaraš prostor da šut ostane otežan, a da ne napraviš prekršaj?',
    s.question.de,
  );
  setAnswers(s, [
    [
      'optimal',
      'Arrive on balance with hands high; force a hard shot or a pass',
      'Dođi u ravnoteži, ruke gore; natjeraj ga na otežan šut ili dodavanje',
      'Ausbalanciert ankommen, Hände hoch; erzwinge schweren Wurf oder Pass',
      'Correct — balance plus high hands contests the shot without diving into a foul.',
      'Točno — ravnoteža i dignute ruke čine šut otežanim bez letećeg prekršaja.',
      'Richtig — Balance und hohe Hände machen den Wurf schwer, ohne zu foulen.',
    ],
    [
      'good',
      'Close under control and show the sideline, accepting a tougher angle shot',
      'Zatvori pod kontrolom i pokaži mu bočnu liniju, prihvati teži kut šuta',
      'Kontrolliert schließen und die Seitenlinie zeigen',
      'Good — safe angle work, but without high hands the shot stays too clean.',
      'Dobro — siguran rad na kutu, ali bez dignutih ruku šut ostaje predobar.',
      'Gut — sichere Winkelarbeit, aber ohne hohe Hände bleibt der Wurf zu sauber.',
    ],
    [
      'risky',
      'Sprint flat-out and jump at his shooting arm hoping to block',
      'Trči punom brzinom i skoči na ruku u šutu u nadi da blokiraš',
      'Voll sprinten und an den Wurfarm springen',
      'Risky — flying close-outs create fouls or leave you flat for the next action.',
      'Rizično — leteće zatvaranje često znači prekršaj ili gubitak pozicije za sljedeću akciju.',
      'Riskant — fliegende Close-outs erzeugen Fouls.',
    ],
    [
      'poor',
      'Stop short at eleven metres and give him a free nine-metre shot',
      'Stani kratko na jedanaest metara i pokloni mu slobodan šut s devet',
      'Auf elf Metern abbremsen und den freien Neun-Meter schenken',
      'Poor — conceding a free nine-metre shot breaks the 3:2:1 idea.',
      'Loše — pokloniti slobodan šut s devet metara ruši smisao 3:2:1.',
      'Schlecht — freien Neun-Meter zu schenken zerstört die 3:2:1-Idee.',
    ],
  ]);
  s.explanation = L(
    'Help is late — that is the cue. Contest alone: arrive on balance, hands high, force a hard shot or a pass. Jumping at the arm risks a suspension; stopping short gifts a clean shot.',
    'Pomoć kasni — to je signal. Moraš zatvoriti sam: dođi u ravnoteži, ruke gore, natjeraj otežan šut ili dodavanje. Skok na ruku riskira isključenje; rano stajanje poklanja čist šut. Usmjeravanje prema pomoći koja još nije stigla nije opcija.',
    s.explanation.de,
  );
}

// ─── 159 ───
{
  const s = get('scn_bank_159');
  s.score = '22:21';
  s.situation.hr =
    'U 9. minuti. Vodite 22:21. Pivot zatvara desnog braniča na šest metara i drži kontakt. Ti imaš loptu na devet metara. Tvoj branič stoji između tebe i pivota s rukama gore u liniji dodavanja.';
  s.situation.en =
    "At 9', you lead 22:21. The pivot seals the right defender at six metres and holds the seal. You have the ball at nine metres. Your own defender stands between you and the pivot with hands high in the passing lane.";
  s.answers[0].text.hr =
    'Kratka finta prodora da pomakneš braniča s dignutim rukama, zatim odigraj na pivota u prostor koji drži';
  s.answers[0].text.en =
    'Short drive fake to move the defender with high hands, then play to the pivot in the space he owns';
  s.explanation.hr =
    'Dignute ruke u liniji dodavanja su signal. Kratkom fintom prodora veži i pomakni braniča, zatim odigraj na pivota u prostor koji je već zatvorio. Izravno dodavanje kroz ruke se presiječe. Izvlačenje pivota van baca zatvaranje.';
}

// ─── 164 ───
{
  const s = get('scn_bank_164');
  s.score = '27:28';
  s.situation.hr =
    'Zagreb osvaja loptu i ide u kontranapad u 9. minuti. Gubite 27:28. Ti si prvi u povratku u obranu. Njihov napadač s loptom ide ravno na tebe velikom brzinom. Tvoj suigrač već pokriva daleko krilo — linija dugog dodavanja je zatvorena. Ako skočiš u prekršaj ili staneš, on ide sam na vratara.';
  s.situation.en =
    "Zagreb win the ball and counter at 9'. You trail 27:28. You are the first back recovering. Their ball carrier attacks straight at you at speed. Your teammate already covers the far wing — the skip lane is closed. If you dive or stop, he finishes alone.";
}

// ─── 161 ───
{
  const s = get('scn_bank_161');
  s.score = '28:27';
  s.situation.hr =
    'Ti i srednji vanjski izvodite križanje u 28. minuti. Vodite 28:27. Obrana kasno radi preuzimanje. Primaš na desnoj strani na devet metara. Preuzeti branič još je djelomično leđima prema tebi i tek se okreće. Pomoć iz sredine još nije zatvorila prostor.';
  s.situation.en =
    "You and the centre back run a crossing action at 28'. You lead 28:27. The defence switches late. You receive on the right side at nine metres. The switched defender still has his back partly toward you and is turning. Help from the middle has not closed the gap yet.";
  s.answers[0].text.hr =
    'Napadni odmah iz prijema prije nego se preuzeti branič postavi frontalno';
  s.answers[0].text.en =
    'Attack immediately off the catch before the switched defender squares up';
  s.explanation.hr =
    'Signal je branič koji se još okreće i pomoć koja nije zatvorila prostor. Napadni odmah iz prijema. Dodatna finta inače pomaže, ali ovdje mu poklanja vrijeme da se postavi. Držanje ili povratak lopte resetira obranu.';
  s.explanation.en =
    'The cue is the defender still turning and help not yet closed. Attack immediately off the catch. An extra fake is usually useful, but here it gifts the time he needs to face you.';
}

// ─── 163 — first action only: force/fix late rotator ───
{
  const s = get('scn_bank_163');
  s.score = '14:13';
  s.title = L(
    'Left Back — Force the Late Rotator in Player-Up',
    'Lijevi vanjski — veži kasnog rotatora u igraču više',
    s.title.de,
  );
  s.situation = L(
    "Your team plays 6-on-5 at 9'. You lead 14:13. You receive at nine metres. One defender from the short-handed unit is rotating late from the middle — the gap in front of you is open only until he arrives. The pivot holds the near man. The left wing waits one pass wide.",
    'Tvoj tim igra s igračem više (6 na 5) u 9. minuti. Vodite 14:13. Primaš na devet metara. U obrani s igračem manje jedan branič kasno rotira iz sredine — prostor ispred tebe otvoren je samo dok on ne stigne. Pivot drži bližeg braniča. Lijevo krilo čeka jedno dodavanje u širinu.',
    s.situation.de,
  );
  s.question = L(
    'What is the first action when you see the late rotator?',
    'Što je prva akcija kad vidiš kasnog rotatora?',
    s.question.de,
  );
  setAnswers(s, [
    [
      'optimal',
      'Attack the open gap immediately and force the late rotator to commit',
      'Odmah napadni otvoreni prostor i natjeraj kasnog rotatora da se veže',
      'Die offene Lücke sofort angreifen und den späten Rotierer zum Binden zwingen',
      'Correct — first create the advantage by binding him; shot, pivot or wing comes after his reaction.',
      'Točno — prvo stvori prednost vezivanjem njega; šut, pivot ili krilo dolaze tek nakon njegove reakcije.',
      'Richtig — zuerst Vorteil erzeugen, indem du ihn bindest; Wurf, Kreisläufer oder Außen kommen nach seiner Reaktion.',
    ],
    [
      'good',
      'One more full perimeter swing looking for a prettier angle before you attack',
      'Još jedan puni obilazak perimetra u potrazi za ljepšim kutom prije napada',
      'Noch eine volle Perimeterkreisung für einen schöneren Winkel',
      'Good — can improve the angle, but often lets the short-handed defence recover to 6:0.',
      'Dobro — može popraviti kut, ali često vrati obranu s igračem manje u 6:0.',
      'Gut — kann den Winkel verbessern, holt die Unterzahl oft in die 6:0 zurück.',
    ],
    [
      'risky',
      'Hold at nine metres until the pivot seals even deeper',
      'Drži na devet metara dok pivot ne zatvori još dublje',
      'Auf neun Metern halten, bis der Kreisläufer noch tiefer abdichtet',
      'Risky — holding invites the short-handed unit to rebuild structure.',
      'Rizično — držanje daje obrani s igračem manje vrijeme da ponovo zatvori oblik.',
      'Riskant — Halten lädt die Unterzahl ein, die Form neu zu bauen.',
    ],
    [
      'poor',
      'Dribble along the nine-metre line only to protect possession',
      'Vodi loptu uz liniju devet metara samo da čuvaš posjed',
      'Entlang der Neun-Meter-Linie dribbeln, nur um den Ball zu schützen',
      'Poor — player-up is for scoring pressure, not empty clock work.',
      'Loše — igrač više služi za pritisak na gol, ne za prazno čuvanje lopte.',
      'Schlecht — Überzahl ist für Druck aufs Tor, nicht zum Totspielen.',
    ],
  ]);
  s.explanation = L(
    'The cue is the late rotator. First attack the open gap and force him to commit — that creates the advantage. Only after his reaction do you choose shot, pivot or wing. Another full swing or holding often lets the defence recover to 6:0.',
    'Signal je kasni rotator. Prvo napadni otvoreni prostor i natjeraj ga da se veže — time stvaraš prednost. Tek nakon njegove reakcije biraš šut, pivota ili krilo. Još jedan obilazak ili držanje često vraća obranu u 6:0.',
    s.explanation.de,
  );
}

// ─── 166 ───
{
  const s = get('scn_bank_166');
  s.score = '22:23';
  s.situation.hr =
    'Gubite 22:23. Ostalo je 18 sekundi. Ovo je vjerojatno zadnji napad. Pasivna igra nije najavljena. Ti si lijevi vanjski s loptom na devet metara. Čist prostor je otvoren između lijevog polubranitelja i sredine. Lijevo krilo je samo polupokriveno. Trener traži čistu odluku, ne kaos.';
  s.situation.en =
    'You trail 22:23 with 18 seconds left. This is likely your final possession. Passive play has not been announced. You are the left back with the ball at nine metres. A clean gap is open between left half and centre. The left wing is only half-covered. Coach wants a clean decision, not chaos.';
  s.answers[2].text.hr =
    'Drži do pet sekundi, zatim forsiraj duboki otežan skok-šut';
  s.answers[2].text.en =
    'Hold until five seconds then force a deep contested jumper';
  s.explanation.hr =
    'Gubite 22:23, ostalo je 18 sekundi i vjerojatno jedan napad. Signal je već otvoren čist prostor — uzmi taj šut. Dodavanje na krilo je druga opcija samo ako je stvarno slobodniji. Držanje do pet sekundi ili lov na sedmerac pretvara čistu priliku u kaos.';
}

// ─── 165 — pivot unavailable so A is uniquely best ───
{
  const s = get('scn_bank_165');
  s.score = '22:21';
  s.situation = L(
    "You receive at ten metres at 28' against a set 6:0. You lead 22:21. The goalkeeper has saved your last two shots to the same high corner and is already set for that same shot. The pivot is tightly covered between two defenders — no clean feed. The near wing is closed.",
    'Primaš na deset metara u 28. minuti protiv postavljene 6:0. Vodite 22:21. Vratar je obranio tvoja zadnja dva šuta u isti visoki kut i već stoji spreman na isti šut. Pivot je čvrsto pokriven između dva braniča — nema čistog dodavanja. Bliže krilo je zatvoreno.',
    s.situation.de,
  );
  s.question = L(
    'How do you change the shot duel with the goalkeeper?',
    'Kako mijenjaš duel šuta s vratarem?',
    s.question.de,
  );
  setAnswers(s, [
    [
      'optimal',
      'Pass fake, then shoot a different height or the opposite corner',
      'Finta dodavanja, zatim šut u drugu visinu ili suprotni kut',
      'Passfinte, dann Wurf in andere Höhe oder die Gegenecke',
      'Correct — change shot type or height; more power into the same window loses.',
      'Točno — promijeni vrstu ili visinu šuta; više snage u isti prozor gubi.',
      'Richtig — Wurfart oder Höhe ändern; mehr Power ins gleiche Fenster verliert.',
    ],
    [
      'good',
      'One short drive to change the release angle, then shoot away from his set',
      'Kratki prodor da promijeniš kut šuta, zatim šutiraj mimo njegove pripreme',
      'Kurzer Durchbruch zur Winkeländerung, dann weg von seiner Vorbereitung werfen',
      'Good — can help, but slower than a clean pass-fake change of height/corner.',
      'Dobro — može pomoći, ali je sporije od čiste finte dodavanja s promjenom visine ili kuta.',
      'Gut — kann helfen, ist aber langsamer als eine klare Passfinte mit Höhen-/Eckenwechsel.',
    ],
    [
      'risky',
      'Shoot harder into the same high corner he already owns',
      'Šutiraj jače u isti visoki kut koji već čita',
      'Härter in dieselbe hohe Ecke werfen, die er schon liest',
      'Risky — he is prepared for that exact window.',
      'Rizično — spreman je baš na taj prozor.',
      'Riskant — genau dieses Fenster erwartet er.',
    ],
    [
      'poor',
      'Force a pass into the tightly covered pivot anyway',
      'Svejedno forsiraj dodavanje na čvrsto pokrivenog pivota',
      'Trotzdem den Pass auf den eng zugestellten Kreisläufer erzwingen',
      'Poor — the pivot lane is closed; that feed is a high turnover risk.',
      'Loše — prolaz prema pivotu je zatvoren; to dodavanje jako riskira gubitak lopte.',
      'Schlecht — die Bahn zum Kreisläufer ist zu; hoher Ballverlust.',
    ],
  ]);
  s.explanation = L(
    'The cue is the goalkeeper already set for your favourite high corner, and the pivot is not available. Change the shot — pass fake into another height or the far corner. A short drive to change angle is slower. More power to the same corner or forcing the covered pivot ignores the read.',
    'Signal je da vratar već stoji spreman na tvoj omiljeni visoki kut, a pivot nije dostupan. Promijeni šut — finta dodavanja u drugu visinu ili daleki kut. Kratki prodor za novi kut je sporiji. Više snage u isti kut ili forsiranje pokrivenog pivota ignorira čitanje.',
    s.explanation.de,
  );
}

// ─── 657 ───
{
  const s = get('scn_bank_657');
  s.score = '19:18';
  s.situation = L(
    "Opponent defends 3:2:1 at 28'. You lead 19:18. Their high outside defender steps toward you at nine metres. Behind him, between the first defensive line and the pivot lane, a passing lane opens. The centre back is moving toward you for a short exchange. The pivot sits between the two low defenders, not yet sealed.",
    'Protivnik brani 3:2:1 u 28. minuti. Vodite 19:18. Njihov visoki vanjski branič izlazi na tebe na devet metara. Iza njega, između prvog reda obrane i linije pivota, otvara se prolaz za jedno dodavanje. Srednji vanjski ide prema tebi za kratku razmjenu. Pivot stoji između dva donja braniča, još nije zatvorio.',
    s.situation.de,
  );
  s.question = L(
    'What do you read first when the high defender steps out?',
    'Što prvo čitaš kad visoki branič izađe na tebe?',
    s.question.de,
  );
  setAnswers(s, [
    [
      'optimal',
      'Bind the stepping defender, then play behind him into the space behind the first defensive line or to the arriving centre back',
      'Veži izašlog braniča, zatim odigraj iza njega u prostor iza prvog reda obrane ili na dolazećeg srednjeg vanjskog',
      'Den heraustretenden Verteidiger binden, dann hinter ihn in den Raum hinter der ersten Abwehrreihe oder auf den kommenden Rückraum Mitte spielen',
      'Correct — the step creates space behind; binding him then playing through beats a blind shot.',
      'Točno — izlazak stvara prostor iza; vezivanje pa proigravanje bije slijepi šut.',
      'Richtig — das Herausrücken schafft Raum dahinter; Binden und Durchspielen schlägt Blindwurf.',
    ],
    [
      'good',
      'If he overcommits, breakthrough past his hip before the second line slides',
      'Ako preduboko izađe, prodri kroz bok prije nego se drugi red obrane pomakne u pomoć',
      'Wenn er zu tief herauskommt, am Hüft vorbeigehen, bevor die zweite Reihe hilft',
      'Good — valid on a heavy overcommit; first read remains the space behind the step.',
      'Dobro — vrijedi kod jakog pretjeranog izlaska; prvo čitanje i dalje je prostor iza koraka.',
      'Gut — bei starkem Übercommit gültig; erste Lesart bleibt der Raum hinter dem Schritt.',
    ],
    [
      'risky',
      'Shoot immediately over the stepping defender without binding him',
      'Odmah šutiraj preko izašlog braniča bez vezivanja',
      'Sofort über den heraustretenden Verteidiger werfen, ohne ihn zu binden',
      'Risky — without a bind the next line and goalkeeper are set for an early shot.',
      'Rizično — bez vezivanja sljedeći red i vratar čekaju rani šut.',
      'Riskant — ohne Binden warten nächste Reihe und Torwart auf den frühen Wurf.',
    ],
    [
      'poor',
      'Ignore the step and swing the ball back to the far wing immediately',
      'Ignoriraj izlazak i odmah vrati loptu na daleko krilo',
      'Das Herausrücken ignorieren und sofort auf den entfernten Außen zurückschwingen',
      'Poor — you throw away the space the high defender just gifted behind him.',
      'Loše — bacaš prostor koji ti je visoki branič upravo poklonio iza sebe.',
      'Schlecht — du verschenkst den Raum hinter dem hohen Verteidiger.',
    ],
  ]);
  s.explanation = L(
    'In 3:2:1 the cue is the high defender stepping out. Do not just shoot over him. Bind him first, then play the space behind the first defensive line or to the arriving centre back. A breakthrough is second if he overcommits.',
    'U 3:2:1 signal je izlazak visokog braniča. Nemoj samo šutirati preko njega. Prvo ga veži, zatim proigraj prostor iza prvog reda obrane ili na dolazećeg srednjeg vanjskog. Prodor je druga opcija ako pretjera s izlaskom. Ignoriranje izlaska baca strukturnu prednost.',
    s.explanation.de,
  );
}

// ─── 658 ───
{
  const s = get('scn_bank_658');
  s.score = '26:26';
  s.situation = L(
    'Tied 26:26 at 51\'. Your team plays 7v6 with an empty goal. You have the ball at nine metres on the left. The first pivot seals the near defender. A teammate starts the second-pivot run into the middle at six metres. Two defenders collapse toward the first pivot — that frees space for the second pivot between them. The left wing is open but one long pass away. A turnover is an empty-goal counter the other way.',
    'Neriješeno je 26:26 u 51. minuti. Tvoj tim igra 7 na 6 s praznim golom. Ti imaš loptu na devet metara lijevo. Prvi pivot zatvara bližeg braniča. Suigrač kreće u ulazak drugog pivota u sredinu na šest metara. Dva braniča padaju prema prvom pivotu — time se između njih otvara prostor za drugog pivota. Lijevo krilo je otvoreno, ali jedno dugo dodavanje daleko. Izgubljena lopta znači kontranapad na prazan gol.',
    s.situation.de,
  );
  s.question = L(
    'What do you punish when two defenders collapse on the first pivot?',
    'Što kažnjavaš kad se dva braniča sruše na prvog pivota?',
    s.question.de,
  );
  setAnswers(s, [
    [
      'optimal',
      'Bind the collapsing pair, then release early to the second pivot in the open middle space at six metres',
      'Veži par koji pada, zatim rano odigraj na drugog pivota u otvoreni prostor u sredini na šest metara',
      'Das zusammenklappende Paar binden, dann früh auf den zweiten Kreisläufer in den offenen Mittelraum auf sechs Metern spielen',
      'Correct — two on the first pivot frees the second-pivot space; early release beats waiting.',
      'Točno — dva na prvom pivotu oslobađaju prostor za drugog pivota; rano dodavanje bije čekanje.',
      'Richtig — zwei auf dem ersten Kreisläufer öffnen den Raum für den Zweiten; frühes Abspiel schlägt Warten.',
    ],
    [
      'good',
      'If the space for the second pivot closes, hit the open wing before the defence recovers width',
      'Ako se prostor za drugog pivota zatvori, odigraj na otvoreno krilo prije nego obrana vrati širinu',
      'Wenn der Raum für den zweiten Kreisläufer zu ist, auf den freien Außen spielen',
      'Good — the wing is the safety valve; second pivot remains the first punishment of the collapse.',
      'Dobro — krilo je sigurnosni ventil; drugi pivot ostaje prva kazna za urušavanje.',
      'Gut — der Außen ist Sicherheitsventil; der zweite Kreisläufer bleibt erste Bestrafung.',
    ],
    [
      'risky',
      'Force a tight bounce into the first pivot through both collapsing defenders',
      'Forsiraj usko odskočno dodavanje na prvog pivota kroz oba braniča koji padaju',
      'Engen Bounce auf den ersten Kreisläufer durch beide klappenden Verteidiger erzwingen',
      'Risky — two defenders on one pivot makes that feed the highest turnover risk with empty goal.',
      'Rizično — dva braniča na jednom pivotu čine to dodavanje najopasnijim gubitkom uz prazan gol.',
      'Riskant — höchster Ballverlust bei leerem Tor.',
    ],
    [
      'poor',
      'Hold and dribble laterally until the shot clock is nearly empty',
      'Drži i vodi loptu bočno dok sat za napad skoro ne istekne',
      'Halten und seitlich dribbeln, bis die Angriffszeit fast leer ist',
      'Poor — with empty goal behind you, slow play raises turnover disaster without punishing the collapse.',
      'Loše — s praznim golom iza sebe spora igra diže rizik katastrofe bez kazne urušavanja.',
      'Schlecht — bei leerem Tor erhöht langsames Spiel das Desaster-Risiko.',
    ],
  ]);
  s.explanation = L(
    'In 7v6 the cue is two defenders collapsing on the first pivot. That frees space for the second pivot in the middle at six metres — bind, then release early. The open wing is the backup if that space closes. Forcing the crowded first pivot or slow dribbling risks an empty-goal counter.',
    'U 7 na 6 signal je urušavanje dva braniča na prvog pivota. To otvara prostor za drugog pivota u sredini na šest metara — veži, zatim rano odigraj. Otvoreno krilo je rezerva ako se taj prostor zatvori. Forsiranje zbijenog prvog pivota ili sporo vođenje riskira kontranapad na prazan gol.',
    s.explanation.de,
  );
}

// Final sweep: forbidden / translation-like leftovers in the 12
const IDS = [
  'scn_bank_156',
  'scn_bank_158',
  'scn_bank_162',
  'scn_bank_363',
  'scn_bank_159',
  'scn_bank_164',
  'scn_bank_161',
  'scn_bank_163',
  'scn_bank_166',
  'scn_bank_165',
  'scn_bank_657',
  'scn_bank_658',
];

const sweeps = [
  [/Prednost je (\d+)[–-](\d+)/g, 'Vodite $1:$2'],
  [/Zaostatak je (\d+)[–-](\d+)/g, 'Gubite $1:$2'],
  [/zaostatak je (\d+)[–-](\d+)/g, 'gubite $1:$2'],
  [/(\d+)[–-](\d+)/g, '$1:$2'], // score separators in HR body — careful
  [/sporni šut/g, 'otežan šut'],
  [/sporni skok-šut/g, 'otežan skok-šut'],
  [/u hvatu/g, 'iz prijema'],
  [/Napadni u hvatu/g, 'Napadni iz prijema'],
  [/fiksiraj/gi, 'veži'],
  [/Fiksiraj/g, 'Veži'],
  [/fiksacij/gi, 'vezivanj'],
  [/prostor druge linije/g, 'prostor iza prvog reda obrane'],
  [/drugu liniju/g, 'prostor iza prvog reda obrane'],
  [/linija drugog pivota/g, 'prostor za drugog pivota'],
  [/liniju drugog pivota/g, 'prostor za drugog pivota'],
  [/branič u igraču manje/g, 'branič iz obrane s igračem manje'],
];

for (const id of IDS) {
  const s = get(id);
  const touch = (obj) => {
    if (!obj?.hr) return;
    let hr = obj.hr;
    // score language first (before generic dash replace on all numbers)
    hr = hr
      .replace(/Prednost je (\d+)[–-](\d+)/g, 'Vodite $1:$2')
      .replace(/Zaostatak je (\d+)[–-](\d+)/g, 'Gubite $1:$2')
      .replace(/zaostatak je (\d+)[–-](\d+)/g, 'gubite $1:$2')
      .replace(/Neriješeno (\d+)[–-](\d+)/g, 'Neriješeno je $1:$2')
      .replace(/Neriješeno je (\d+)[–-](\d+)/g, 'Neriješeno je $1:$2')
      .replace(/Vodite (\d+)[–-](\d+)/g, 'Vodite $1:$2')
      .replace(/Gubite (\d+)[–-](\d+)/g, 'Gubite $1:$2')
      .replace(/sporni šut/g, 'otežan šut')
      .replace(/sporni skok-šut/g, 'otežan skok-šut')
      .replace(/odmah u hvatu/g, 'odmah iz prijema')
      .replace(/Napadni u hvatu/g, 'Napadni iz prijema')
      .replace(/u hvatu/g, 'iz prijema')
      .replace(/\bfiksiraj\b/gi, (m) => (m[0] === 'F' ? 'Veži' : 'veži'))
      .replace(/fiksacije/g, 'vezivanja')
      .replace(/fiksacija/g, 'vezivanja')
      .replace(/prostor druge linije/g, 'prostor iza prvog reda obrane')
      .replace(/u drugu liniju/g, 'u prostor iza prvog reda obrane')
      .replace(/linija drugog pivota/g, 'prostor za drugog pivota')
      .replace(/liniju drugog pivota/g, 'prostor za drugog pivota')
      .replace(/branič u igraču manje/g, 'branič iz obrane s igračem manje');
    obj.hr = hr;
  };
  touch(s.situation);
  touch(s.question);
  touch(s.explanation);
  touch(s.title);
  for (const a of s.answers) {
    touch(a.text);
    touch(a.feedback);
  }
}

// Validate leftovers
const bad = [
  /Prednost je/,
  /Zaostatak je/,
  /sporni šut/,
  /u hvatu/,
  /fiksiraj/i,
  /prostor druge linije/,
  /linija drugog pivota/,
  /branič u igraču manje/,
];
let issues = 0;
for (const id of IDS) {
  const s = get(id);
  const all = [s.situation.hr, s.question.hr, s.explanation.hr, ...s.answers.flatMap((a) => [a.text.hr, a.feedback.hr])].join(
    '\n',
  );
  for (const re of bad) {
    if (re.test(all)) {
      console.log('LEFTOVER', id, re);
      issues++;
    }
  }
  console.log(id, '|', s.situation.hr.match(/Vodite|Gubite|Neriješeno/)?.[0] || 'NO-SCORE', '|', s.answers[0].text.hr.slice(0, 60));
}

writeFileSync(path, JSON.stringify(bank, null, 2) + '\n');
writeFileSync(
  join(root, 'scripts/lb-gold-standard-human-review.json'),
  JSON.stringify(
    IDS.map((id) => {
      const s = get(id);
      return {
        id,
        family: s.title.hr,
        difficulty: s.difficulty,
        situation: s.situation.hr,
        question: s.question.hr,
        A: s.answers[0].text.hr,
        B: s.answers[1].text.hr,
        C: s.answers[2].text.hr,
        D: s.answers[3].text.hr,
        correct: 'A',
        explanation: s.explanation.hr,
      };
    }),
    null,
    2,
  ) + '\n',
);

if (issues) {
  console.error(`Failed with ${issues} leftovers`);
  process.exit(1);
}
console.log('Final correction pass OK.');
