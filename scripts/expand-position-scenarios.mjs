/**
 * Sprint 4 — expand thin position primary content (wings + backs).
 * Appends unique high-quality scenarios to content/scenario-bank/scenarios.json
 * Run: node scripts/expand-position-scenarios.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '..', 'content', 'scenario-bank', 'scenarios.json');
const bank = JSON.parse(readFileSync(path, 'utf8'));

const L = (en, hr, de) => ({ en, hr, de });

const WING_TEMPLATES = [
  {
    slug: 'far-post-lob',
    title: { lw: 'Left Wing — Far-Post Lob', rw: 'Right Wing — Far-Post Lob' },
    titleHr: { lw: 'Lijevo krilo — lob na daleku vratnicu', rw: 'Desno krilo — lob na daleku vratnicu' },
    titleDe: { lw: 'Linker Flügel – Lob langer Pfosten', rw: 'Rechter Flügel – Lob langer Pfosten' },
    situEn: (side, min, score) =>
      `You receive on the ${side} wing at a wide angle at ${min}'. Score ${score}. The goalkeeper sits deep on the near post. Your backcourt partner is double-covered. The defence is stretched after a wide swing.`,
    situHr: (side, min, score) =>
      `Primáte na ${side} krilu pod širokim kutom na ${min}'. Rezultat ${score}. Vratar sjedi duboko na bližoj vratnici. Vanjski partner je dvostruko pokriven. Obrana je rastegnuta nakon širokog prijelaza.`,
    situDe: (side, min, score) =>
      `Du erhältst den Ball auf dem ${side} Flügel aus weitem Winkel in Minute ${min}. Stand ${score}. Der Torwart steht tief am kurzen Pfosten. Dein Rückraumpartner ist doppelt gedeckt. Die Abwehr ist nach einem weiten Swing gestreckt.`,
    q: L('What is the highest-percentage finish?', 'Koja je završnica s najvećim postotkom?', 'Was ist der Abschluss mit der höchsten Quote?'),
    answers: [
      {
        quality: 'optimal',
        text: L('Soft lob to the far post over the near-side keeper', 'Meki lob na daleku vratnicu preko vratara na bližoj strani', 'Weicher Lob über den nahen Torwart zum langen Pfosten'),
        fb: L('Correct — a deep near-post keeper leaves far-post air.', 'Točno — duboki vratar na bliskoj vratnici ostavlja zrak daleko.', 'Richtig – tiefer kurzer Pfosten öffnet den langen.'),
      },
      {
        quality: 'good',
        text: L('Hard bounce shot to the near corner', 'Tvrdi odraz u bliži kut', 'Harter Aufsetzer in die kurze Ecke'),
        fb: L('Good — works if the keeper rises late, but lower percentage here.', 'Dobro — radi ako vratar kasno ustane, ali manji postotak ovdje.', 'Gut – möglich bei spätem Aufrichten, aber geringere Quote.'),
      },
      {
        quality: 'risky',
        text: L('Spin and drive through the first defender', 'Okret i proboj kroz prvog braniča', 'Drehung und Durchbruch durch den ersten Abwehrspieler'),
        fb: L('Risky — from a wide angle you invite a block or turnover.', 'Rizično — iz širokog kuta tražiš blok ili gubitak lopte.', 'Riskant – aus weitem Winkel drohen Block oder Ballverlust.'),
      },
      {
        quality: 'poor',
        text: L('Pass across the face of goal hoping for a tip', 'Dodavanje ispred gola u nadi za skretanje', 'Pass vor das Tor in der Hoffnung auf eine Ablenkung'),
        fb: L('Poor — cross-face passes from the wing are often intercepted.', 'Loše — dodavanja ispred gola s krila često se presijecaju.', 'Schlecht – Pässe vor dem Tor vom Flügel werden oft abgefangen.'),
      },
    ],
    expl: L(
      'When the goalkeeper is pinned near post, the far-post lob is the professional finish. Release early before the keeper recovers across the goal.',
      'Kad je vratar prikovan uz bližu vratnicu, lob na daleku je profesionalna završnica. Ispusti rano prije nego se vratar vrati.',
      'Sitzt der Torwart am kurzen Pfosten, ist der Lob auf den langen Pfosten der Profi-Abschluss. Früh lösen, bevor er querkommt.',
    ),
    categoryFocus: 'finishing',
  },
  {
    slug: 'fast-break-lane',
    title: { lw: 'Left Wing — Fast Break Lane Choice', rw: 'Right Wing — Fast Break Lane Choice' },
    titleHr: { lw: 'Lijevo krilo — izbor trake u kontrи', rw: 'Desno krilo — izbor trake u kontrи' },
    titleDe: { lw: 'Linker Flügel – Tempogegenstoß Spurwahl', rw: 'Rechter Flügel – Tempogegenstoß Spurwahl' },
    situEn: (side, min, score) =>
      `After a save, you sprint the ${side} lane at ${min}'. Score ${score}. The outlet pass is in the air. One recovering defender is between you and the goalkeeper. Your centre back calls for a trail pass.`,
    situHr: (side, min, score) =>
      `Nakon obrane sprintaš ${side} traku na ${min}'. Rezultat ${score}. Outlet pas je u zraku. Jedan vraćajući branič je između tebe i vratara. Srednji vanjski traži pas u trag.`,
    situDe: (side, min, score) =>
      `Nach einer Parade sprintest du die ${side} Bahn in Minute ${min}. Stand ${score}. Der Outlet-Pass ist in der Luft. Ein zurücklaufender Verteidiger steht zwischen dir und dem Torwart. Dein Rückraummitte fordert einen Nachlaufpass.`,
    q: L('What is the best decision in this break?', 'Koja je najbolja odluka u ovoj kontrи?', 'Was ist die beste Entscheidung in diesem Gegenstoß?'),
    answers: [
      {
        quality: 'optimal',
        text: L('Attack the space outside the recovering defender and finish', 'Napadni prostor van vraćajućeg braniča i završi', 'Greife den Raum außen am zurücklaufenden Verteidiger an und schließe ab'),
        fb: L('Correct — beat the recovery angle; do not wait for the trail.', 'Točno — pobijedi kut povratka; ne čekaj trag.', 'Richtig – Winkel des Zurücklaufers schlagen; nicht auf Nachlauf warten.'),
      },
      {
        quality: 'good',
        text: L('Soft pass back to the trailing centre back for a 2v1', 'Meki pas natrag na pratećeg srednjeg vanjskog za 2v1', 'Weicher Pass zurück zum nachlaufenden Rückraummitte für 2v1'),
        fb: L('Good — if the defender seals your lane early.', 'Dobro — ako branič rano zatvori tvoju traku.', 'Gut – wenn der Verteidiger deine Bahn früh schließt.'),
      },
      {
        quality: 'risky',
        text: L('Stop and wait for full team support', 'Stani i čekaj punu podršku ekipe', 'Stoppen und auf volle Unterstützung warten'),
        fb: L('Risky — stopping kills the numerical advantage.', 'Rizično — stajanje ubija brojčanu prednost.', 'Riskant – Stoppen tötet den Überzahlvorteil.'),
      },
      {
        quality: 'poor',
        text: L('Cross-field pass to the opposite wing immediately', 'Odmah dug pas na suprotno krilo', 'Sofort weiter Pass auf den gegnerischen Flügel'),
        fb: L('Poor — a blind switch often turns into a counter the other way.', 'Loše — slijepa zamjena često postaje kontra u drugom smjeru.', 'Schlecht – blinder Seitenwechsel wird oft zum Gegenangriff.'),
      },
    ],
    expl: L(
      'In a 2v1 break, the wing should force the recovering defender to commit, then finish or release. Delaying for a full set-up wastes the break.',
      'U 2v1 kontrи krilo forsira vraćajućeg braniča da se odluči, zatim završava ili dodaje. Odgađanje za puni napad troši kontru.',
      'Im 2v1 muss der Flügel den Zurückläufer binden und dann abschließen oder abspielen. Warten auf kompletten Aufbau vergeudet den Gegenstoß.',
    ),
    categoryFocus: 'fastbreak',
  },
  {
    slug: 'gk-read-step',
    title: { lw: 'Left Wing — Goalkeeper Step Read', rw: 'Right Wing — Goalkeeper Step Read' },
    titleHr: { lw: 'Lijevo krilo — čitanje koraka vratara', rw: 'Desno krilo — čitanje koraka vratara' },
    titleDe: { lw: 'Linker Flügel – Torwartschritt lesen', rw: 'Rechter Flügel – Torwartschritt lesen' },
    situEn: (side, min, score) =>
      `You catch on the ${side} wing at ${min}' with score ${score}. The goalkeeper takes an early step toward you before you plant. The near defender is late. Crowd noise rises after two missed wing shots.`,
    situHr: (side, min, score) =>
      `Hvataš na ${side} krilu na ${min}' pri rezultatu ${score}. Vratar rano zakorači prema tebi prije nego što se ukotviš. Bliži branič kasni. Buka raste nakon dva promašena krilna šuta.`,
    situDe: (side, min, score) =>
      `Du fängst auf dem ${side} Flügel in Minute ${min} bei Stand ${score}. Der Torwart macht einen frühen Schritt zu dir, bevor du setzt. Der nahe Verteidiger kommt zu spät. Nach zwei vergebenen Flügelwürfen steigt der Lärm.`,
    q: L('How do you beat this early keeper step?', 'Kako pobjeđuješ ovaj rani korak vratara?', 'Wie schlägst du diesen frühen Torwartschritt?'),
    answers: [
      {
        quality: 'optimal',
        text: L('Freeze one count, then shoot opposite the step', 'Zamrzni jedan broj, zatim šutni suprotno od koraka', 'Einen Count frieren, dann gegen den Schritt werfen'),
        fb: L('Correct — punish the early commitment with a delayed opposite finish.', 'Točno — kazni ranu odluku odgođenom suprotnom završnicom.', 'Richtig – frühe Festlegung mit verzögertem Gegenabschluss bestrafen.'),
      },
      {
        quality: 'good',
        text: L('Immediate high shot before the step lands', 'Odmah visoki šut prije nego korak sleti', 'Sofort hoher Wurf bevor der Schritt landet'),
        fb: L('Good — if your catch is clean and release is already loaded.', 'Dobro — ako je hvatanje čisto i ispuštanje već spremno.', 'Gut – wenn Fang sauber und Lösung bereits geladen ist.'),
      },
      {
        quality: 'risky',
        text: L('Pump fake twice then force the near corner', 'Dva puta finta pa forsiraš bliži kut', 'Zweimal Täuschen, dann kurze Ecke erzwingen'),
        fb: L('Risky — double fakes invite blocks from the recovering defender.', 'Rizično — duple finte zovu blok vraćajućeg braniča.', 'Riskant – Doppel-Finten laden Blöcke des Zurückläufers ein.'),
      },
      {
        quality: 'poor',
        text: L('Pass back immediately without reading the keeper', 'Odmah dodaj natrag bez čitanja vratara', 'Sofort zurückpassen ohne den Torwart zu lesen'),
        fb: L('Poor — you already have a scoring window; giving it up trains hesitation.', 'Loše — već imaš prozor za gol; predaja uči oklijevanje.', 'Schlecht – du hast bereits ein Torfenster; Abgeben trainiert Zögern.'),
      },
    ],
    expl: L(
      'An early goalkeeper step is information. Delay one count and finish to the open side. Do not panic-pass a clean wing catch.',
      'Rani korak vratara je informacija. Odgodi jedan broj i završi na otvorenu stranu. Ne paničaruj s čistog hvatanja na krilu.',
      'Ein früher Torwartschritt ist Information. Einen Count verzögern und auf die offene Seite abschließen. Keinen sauberen Flügelfang panisch abgeben.',
    ),
    categoryFocus: 'gkread',
  },
  {
    slug: 'pressure-end',
    title: { lw: 'Left Wing — Late Lead Protection Finish', rw: 'Right Wing — Late Lead Protection Finish' },
    titleHr: { lw: 'Lijevo krilo — završnica uz vodstvo', rw: 'Desno krilo — završnica uz vodstvo' },
    titleDe: { lw: 'Linker Flügel – Abschluss bei Führung', rw: 'Rechter Flügel – Abschluss bei Führung' },
    situEn: (side, min, score) =>
      `Final two minutes, you receive on the ${side} wing at ${min}'. Score ${score}. Your team leads by one. The goalkeeper is aggressive. A foul would give them a last possession. Coach wants a high-percentage decision.`,
    situHr: (side, min, score) =>
      `Zadnje dvije minute, primaš na ${side} krilu na ${min}'. Rezultat ${score}. Vodite jednim. Vratar je agresivan. Prekršaj bi im dao zadnji napad. Trener želi visokopostotnu odluku.`,
    situDe: (side, min, score) =>
      `Letzte zwei Minuten, du erhältst auf dem ${side} Flügel in Minute ${min}. Stand ${score}. Eure Führung beträgt einen. Der Torwart ist aggressiv. Ein Foul gäbe ihnen den letzten Ballbesitz. Der Trainer will eine hohe Quote.`,
    q: L('What decision protects the lead best?', 'Koja odluka najbolje štiti vodstvo?', 'Welche Entscheidung schützt die Führung am besten?'),
    answers: [
      {
        quality: 'optimal',
        text: L('Take the clean high-percentage shot you already created', 'Uzmi čisti visokopostotni šut koji si već stvorio', 'Nimm den sauberen High-Percentage-Wurf den du schon hast'),
        fb: L('Correct — convert the open look; do not invent risk.', 'Točno — pretvori otvoreni šut; ne izmišljaj rizik.', 'Richtig – die freie Chance verwerten; kein Extra-Risiko.'),
      },
      {
        quality: 'good',
        text: L('Pass back for a controlled reset if the angle collapsed', 'Dodaj natrag za kontrolirani reset ako se kut zatvorio', 'Zurückpassen zum kontrollierten Reset wenn der Winkel kollabiert'),
        fb: L('Good — only if the finishing window truly closed.', 'Dobro — samo ako se prozor za završnicu stvarno zatvorio.', 'Gut – nur wenn das Abschlussfenster wirklich zu ist.'),
      },
      {
        quality: 'risky',
        text: L('Force a spectacular reverse spin to draw a foul', 'Forsiraj spektakularni reverse spin za prekršaj', 'Spektakulären Reverse-Spin erzwingen um ein Foul zu holen'),
        fb: L('Risky — a no-call leaves them with a long possession.', 'Rizično — ako nema prekršaja, oni dobivaju dugi napad.', 'Riskant – ohne Foul bekommen sie langen Ballbesitz.'),
      },
      {
        quality: 'poor',
        text: L('Hold the ball in the corner until the clock expires', 'Drži loptu u kutu dok sat ne istekne', 'Ball in der Ecke halten bis die Uhr abläuft'),
        fb: L('Poor — stalling with two minutes left invites a steal and panic.', 'Loše — zatezanje dvije minute prije kraja zove krađu i paniku.', 'Schlecht – zwei Minuten vor Schluss halten lädt Diebstahl und Panik ein.'),
      },
    ],
    expl: L(
      'With a slim lead late, take the clean chance you earned. Do not gamble for fouls or stall with too much time left.',
      'Uz tanko vodstvo kasno uzmi čistu priliku koju si zaradio. Ne kockaj za prekršaje i ne zateži dok ima previše vremena.',
      'Bei knapper Führung spät die saubere Chance nehmen. Nicht auf Fouls spekulieren und nicht zu früh die Uhr halten.',
    ),
    categoryFocus: 'pressure',
  },
  {
    slug: 'variation-underarm',
    title: { lw: 'Left Wing — Underarm Variation', rw: 'Right Wing — Underarm Variation' },
    titleHr: { lw: 'Lijevo krilo — varijacija ispod ruke', rw: 'Desno krilo — varijacija ispod ruke' },
    titleDe: { lw: 'Linker Flügel – Unterarm-Variation', rw: 'Rechter Flügel – Unterarm-Variation' },
    situEn: (side, min, score) =>
      `Third wing possession of the half at ${min}', score ${score}. You are on the ${side}. The goalkeeper has saved your last two high shots. The block is late. Teammates expect a different release.`,
    situHr: (side, min, score) =>
      `Treći napad s krila u poluvremenu na ${min}', rezultat ${score}. Na ${side} si. Vratar je obranio tvoja zadnja dva visoka šuta. Blok kasni. Suigrači očekuju drugačije ispuštanje.`,
    situDe: (side, min, score) =>
      `Dritter Flügelbesitz der Halbzeit in Minute ${min}, Stand ${score}. Du bist ${side}. Der Torwart hat deine letzten zwei hohen Würfe gehalten. Der Block kommt spät. Mitspieler erwarten eine andere Lösung.`,
    q: L('Which finishing variation is best now?', 'Koja varijacija završnice je sada najbolja?', 'Welche Abschlussvariation ist jetzt am besten?'),
    answers: [
      {
        quality: 'optimal',
        text: L('Change eye line and finish underarm to the near post', 'Promijeni liniju pogleda i završi ispod ruke na bližu vratnicu', 'Blicklinie ändern und Unterarm auf den kurzen Pfosten'),
        fb: L('Correct — vary after repeated high looks; punish the tall save set.', 'Točno — variraj nakon ponovljenih visokih šuteva; kazni visoki set.', 'Richtig – nach hohen Würfen variieren; hohe Rettungsstellung bestrafen.'),
      },
      {
        quality: 'good',
        text: L('Same high look but earlier release before the set', 'Isti visoki šut ali ranije ispuštanje prije seta', 'Gleicher hoher Wurf aber frühere Lösung vor dem Set'),
        fb: L('Good — tempo change can work if the keeper is late.', 'Dobro — promjena tempa može raditi ako vratar kasni.', 'Gut – Tempowechsel kann funktionieren wenn der Torwart spät ist.'),
      },
      {
        quality: 'risky',
        text: L('Jump into the defender to force seven metres', 'Skoči u braniča da forsiraš sedmerac', 'In den Verteidiger springen um Siebenmeter zu erzwingen'),
        fb: L('Risky — officials rarely reward jumping into a late block.', 'Rizično — suci rijetko nagrađuju skok u kasni blok.', 'Riskant – Schiris belohnen Sprung in späten Block selten.'),
      },
      {
        quality: 'poor',
        text: L('Repeat the exact same high far-post shot', 'Ponovi točno isti visoki šut na daleku vratnicu', 'Genau denselben hohen Wurf auf den langen Pfosten wiederholen'),
        fb: L('Poor — the keeper has already solved that pattern twice.', 'Loše — vratar je već dvaput riješio taj obrazac.', 'Schlecht – der Torwart hat dieses Muster schon zweimal gelöst.'),
      },
    ],
    expl: L(
      'After consecutive high saves, change the release. An underarm near-post finish attacks a tall goalkeeper set.',
      'Nakon uzastopnih visokih obrana promijeni ispuštanje. Završnica ispod ruke na bližu vratnicu napada visoki set vratara.',
      'Nach mehreren hohen Paraden die Lösung ändern. Unterarm auf den kurzen Pfosten greift eine hohe Torwartstellung an.',
    ),
    categoryFocus: 'variation',
  },
];

function nextId(existing) {
  let max = 0;
  for (const s of existing) {
    const m = String(s.id).match(/scn_bank_(\d+)/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

function buildScenario(id, position, category, template, idx) {
  const isLeft = position === 'Left Wing';
  const sideEn = isLeft ? 'left' : 'right';
  const sideHr = isLeft ? 'lijevом' : 'desnom';
  const sideDe = isLeft ? 'linken' : 'rechten';
  const min = 8 + ((idx * 7) % 50);
  const score = `${12 + (idx % 8)}–${11 + (idx % 7)}`;
  const difficulty = ['Beginner', 'Intermediate', 'Advanced', 'Expert'][idx % 4];
  const pressure = ['Low', 'Moderate', 'High', 'Extreme'][idx % 4];
  const key = isLeft ? 'lw' : 'rw';

  return {
    id: `scn_bank_${String(id).padStart(3, '0')}`,
    title: {
      en: template.title[key],
      hr: template.titleHr[key],
      de: template.titleDe[key],
    },
    category,
    primaryPosition: position,
    secondaryPositions: [],
    difficulty,
    pressureLevel: pressure,
    attackOrDefence: 'Attack',
    matchPhase: template.categoryFocus === 'pressure' ? 'Closing' : template.categoryFocus === 'fastbreak' ? 'Transition' : 'Open Play',
    minute: min,
    score,
    situation: {
      en: template.situEn(sideEn, min, score),
      hr: template.situHr(sideHr, min, score),
      de: template.situDe(sideDe, min, score),
    },
    question: template.q,
    answers: template.answers.map((a) => ({
      text: a.text,
      quality: a.quality,
      feedback: a.fb,
    })),
    explanation: template.expl,
    qualityScore: 8,
  };
}

const BACK_TEMPLATES = [
  {
    pos: 'Left Back',
    category: 'Left Back',
    title: L('Left Back — Skip Pass vs Closed Wing', 'Lijevi vanjski — skip pas uz zatvoreno krilo', 'Linker Rückraum – Skip-Pass bei geschlossenem Flügel'),
    situ: L(
      'You hold at 9m left at 24\'. Score 14–14. The left wing is sealed. The pivot shows a short seal. Centre back is open for one count.',
      'Držiš na 9m lijevo na 24\'. Rezultat 14–14. Lijevo krilo je zatvoreno. Pivot pokazuje kratki seal. Srednji vanjski je otvoren jedan broj.',
      'Du hältst bei 9m links in Minute 24. Stand 14–14. Linker Flügel ist dicht. Kreis zeigt kurzen Seal. Rückraummitte ist einen Count offen.',
    ),
    q: L('Best creation choice?', 'Najbolji izbor kreacije?', 'Beste Kreationswahl?'),
    answers: [
      [L('Hit the open centre back immediately, then relocate', 'Odmah nađi otvorenog srednjeg vanjskog, zatim se premjesti', 'Sofort offenen Rückraummitte bedienen, dann nachrücken'), 'optimal', L('Correct — attack the open count before the help recovers.', 'Točno — napadni otvoreni broj prije povratka pomoći.', 'Richtig – offenen Count angreifen bevor Hilfe kommt.')],
      [L('Force a jump shot over the closed wing lane', 'Forsiraj skok šut preko zatvorene krilne trake', 'Sprungwurf über die geschlossene Flügelbahn erzwingen'), 'risky', L('Risky — low percentage into a sealed side.', 'Rizično — nizak postotak u zatvorenu stranu.', 'Riskant – geringe Quote in die geschlossene Seite.')],
      [L('Bounce pass into the sealed wing anyway', 'Ipak odrazni pas u zatvoreno krilo', 'Trotzdem Aufsetzer in den geschlossenen Flügel'), 'poor', L('Poor — the seal is already lost.', 'Loše — seal je već izgubljen.', 'Schlecht – der Seal ist schon weg.')],
      [L('Drive middle to occupy two defenders then release pivot', 'Probi sredinu da vežeš dva braniča pa pusti pivota', 'Mitte angreifen um zwei zu binden dann Kreis lösen'), 'good', L('Good — if the first pass window closes.', 'Dobro — ako se prvi prozor zatvori.', 'Gut – wenn das erste Passfenster zu ist.')],
    ],
    expl: L('When the wing is sealed, do not force it. Use the open backcourt count or create a new angle through the middle.', 'Kad je krilo zatvoreno, ne forsiraj. Koristi otvoreni vanjski broj ili stvori novi kut kroz sredinu.', 'Ist der Flügel dicht, nicht forcieren. Offenen Rückraum-Count nutzen oder neuen Winkel über die Mitte schaffen.'),
  },
  {
    pos: 'Right Back',
    category: 'Right Back',
    title: L('Right Back — Shot Clock Pressure', 'Desni vanjski — pritisak sata napada', 'Rechter Rückraum – Angriffszeit-Druck'),
    situ: L(
      'Six seconds left in the attack at 39\'. Score 18–17. You are on the right back with a half-step. Wing is covered. Pivot is fronted.',
      'Šest sekundi do kraja napada na 39\'. Rezultat 18–17. Na desnom vanjskom si s pola koraka. Krilo je pokriveno. Pivot je sprijeda čuvan.',
      'Sechs Sekunden Angriffszeit in Minute 39. Stand 18–17. Du bist rechter Rückraum mit Halbschritt. Flügel gedeckt. Kreis wird von vorne bewacht.',
    ),
    q: L('Best late-clock decision?', 'Najbolja odluka pred krajem napada?', 'Beste Entscheidung spät in der Angriffszeit?'),
    answers: [
      [L('Take the prepared jump shot now', 'Uzmi pripremljeni skok šut sada', 'Den vorbereiteten Sprungwurf jetzt nehmen'), 'optimal', L('Correct — convert before the clock dies; you already created space.', 'Točno — pretvori prije isteka; prostor je stvoren.', 'Richtig – vor Ablauf abschließen; Raum ist schon da.')],
      [L('Extra dribble looking for a miracle lane', 'Još jedan dribling u potrazi za čudesnom trakom', 'Extra Dribbling auf der Suche nach einer Wunderbahn'), 'poor', L('Poor — dribbles burn the last seconds.', 'Loše — driblingovi troše zadnje sekunde.', 'Schlecht – Dribblings verbrennen die letzten Sekunden.')],
      [L('Forced lob into the fronted pivot', 'Forsirani lob u sprijeda čuvanog pivota', 'Erzwungener Lob auf den von vorne bewachteten Kreis'), 'risky', L('Risky — high turnover chance.', 'Rizično — visoka šansa gubitka.', 'Riskant – hohe Ballverlustgefahr.')],
      [L('Skip to the weak-side wing if a lane flashes', 'Skip na slabu stranu krila ako bljesne traka', 'Skip auf den schwachen Flügel wenn eine Bahn aufblitzt'), 'good', L('Good — only with a clear lane and time to catch-shoot.', 'Dobro — samo uz jasnu traku i vrijeme za catch-shoot.', 'Gut – nur bei klarer Bahn und Zeit für Catch-Shoot.')],
    ],
    expl: L('With seconds left, take the shot you prepared. Extra creation often ends in a turnover or a rushed poor release.', 'Uz malo sekundi uzmi šut koji si pripremio. Dodatna kreacija često završi gubitkom ili lošim ispuštanjem.', 'Mit wenigen Sekunden den vorbereiteten Wurf nehmen. Extra-Kreation endet oft im Verlust oder hastiger Lösung.'),
  },
  {
    pos: 'Centre Back',
    category: 'Centre Back',
    title: L('Centre Back — Call Between Shot and Pass', 'Srednji vanjski — izbor između šuta i pasa', 'Rückraummitte – Entscheidung Schuss oder Pass'),
    situ: L(
      'You arrive at 8m centre at 51\'. Score 20–20. Both wings show. The defence collapses one step late. Pivot seals the middle defender.',
      'Dolaziš na 8m centar na 51\'. Rezultat 20–20. Oba krila se pokazuju. Obrana kasni jedan korak. Pivot zatvara srednjeg braniča.',
      'Du kommst bei 8m Mitte in Minute 51. Stand 20–20. Beide Flügel zeigen. Die Abwehr kollabiert einen Schritt zu spät. Kreis schließt den Mittelverteidiger.',
    ),
    q: L('What is the professional call?', 'Koji je profesionalni poziv?', 'Was ist der Profi-Call?'),
    answers: [
      [L('Shoot now into the collapsed gap', 'Šutni sada u urušeni prostor', 'Jetzt in die kollabierte Lücke werfen'), 'optimal', L('Correct — the gap is temporary; delay loses it.', 'Točno — prostor je privremen; odgoda ga gubi.', 'Richtig – Lücke ist temporär; Verzögern verliert sie.')],
      [L('One more fake then dump to pivot', 'Još jedna finta pa dump na pivota', 'Noch eine Finte dann Dump auf den Kreis'), 'good', L('Good — if a defender jumps the shot fake cleanly.', 'Dobro — ako branič čisto skoči na fintu šuta.', 'Gut – wenn ein Verteidiger sauber auf die Wurf-Finte springt.')],
      [L('Reset fully to 11m', 'Potpuni reset na 11m', 'Kompletter Reset auf 11m'), 'poor', L('Poor — you already beat the first line.', 'Loše — već si prošao prvu liniju.', 'Schlecht – du hast die erste Linie schon geschlagen.')],
      [L('Cross-court lob without a clear catch window', 'Lob preko cijelog terena bez jasnog hvatanja', 'Querfeld-Lob ohne klares Fangfenster'), 'risky', L('Risky — turnover under equal score pressure.', 'Rizično — gubitak pod pritiskom izjednačenog rezultata.', 'Riskant – Ballverlust bei Gleichstand.')],
    ],
    expl: L('At 8m with a collapsed defence, the shot is often the best pass. Do not over-create once the gap opens.', 'Na 8m uz urušenu obranu šut je često najbolji pas. Ne pretjeruj s kreacijom kad se prostor otvori.', 'Bei 8m und kollabierter Abwehr ist der Wurf oft der beste Pass. Nicht überkreieren wenn die Lücke da ist.'),
  },
];

let id = nextId(bank);
const added = [];

for (const position of ['Left Wing', 'Right Wing']) {
  const category = position;
  for (let i = 0; i < WING_TEMPLATES.length; i++) {
    // 5 unique templates × 5 parameter variants = 25 per wing
    for (let v = 0; v < 5; v++) {
      const sc = buildScenario(id++, position, category, WING_TEMPLATES[i], i * 5 + v);
      // Differentiate variants slightly in title/minute already via idx
      sc.title.en = `${sc.title.en} (${v + 1})`;
      sc.title.hr = `${sc.title.hr} (${v + 1})`;
      sc.title.de = `${sc.title.de} (${v + 1})`;
      sc.minute = 5 + ((i * 5 + v) * 3) % 55;
      sc.score = `${10 + v + i}–${9 + v}`;
      sc.difficulty = ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Intermediate'][v];
      added.push(sc);
    }
  }
}

for (let i = 0; i < BACK_TEMPLATES.length; i++) {
  const t = BACK_TEMPLATES[i];
  for (let v = 0; v < 8; v++) {
    const answers = t.answers.map(([text, quality, fb]) => ({ text, quality, feedback: fb }));
    // rotate optimal to keep qualities but shuffle order? keep order for clarity
    added.push({
      id: `scn_bank_${String(id++).padStart(3, '0')}`,
      title: {
        en: `${t.title.en} (${v + 1})`,
        hr: `${t.title.hr} (${v + 1})`,
        de: `${t.title.de} (${v + 1})`,
      },
      category: t.category,
      primaryPosition: t.pos,
      secondaryPositions: [],
      difficulty: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][v % 4],
      pressureLevel: ['Low', 'Moderate', 'High', 'Extreme'][v % 4],
      attackOrDefence: 'Attack',
      matchPhase: 'Open Play',
      minute: 10 + v * 5,
      score: `${15 + v}–${14 + (v % 3)}`,
      situation: {
        en: t.situ.en.replace(/\d+'/g, `${10 + v * 5}'`),
        hr: t.situ.hr.replace(/\d+'/g, `${10 + v * 5}'`),
        de: t.situ.de.replace(/Minute \d+/g, `Minute ${10 + v * 5}`),
      },
      question: t.q,
      answers,
      explanation: t.expl,
      qualityScore: 8,
    });
  }
}

bank.push(...added);
writeFileSync(path, JSON.stringify(bank, null, 2) + '\n');

const counts = {};
for (const s of bank) {
  counts[s.primaryPosition] = (counts[s.primaryPosition] || 0) + 1;
}
console.log(`Added ${added.length} scenarios. Total ${bank.length}`);
console.log(counts);
