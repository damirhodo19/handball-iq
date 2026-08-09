#!/usr/bin/env node
/**
 * One-shot sync: missing UI keys (hr/de) + scenario strings + fix corrupted EN keys.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

const HR = {
  'match.teamLabel': 'Vaša ekipa',
  'match.correctAnswer': 'Točan odgovor',
  'match.yourChoice': 'Vaš odabir',
  'match.halftimeBreak': 'Pauza na poluvremenu',
  'match.firstHalfSummary': 'Sažetak prvog poluvremena',
  'match.finalScore': 'Konačni rezultat',
  'cdPlayers.emptySub': 'Dodajte igrače u ekipu kako biste ovdje pratili njihov razvoj.',
  'cdPlayers.emptySearch': 'Pokušajte s drugim pojmom ili očistite filtere.',
  'adminScenarios.statusAll': 'Sve',
  'adminScenarios.statusPublished': 'Objavljeno',
  'adminScenarios.statusDraft': 'Nacrt',
  'adminScenarios.statusArchived': 'Arhivirano',
  'adminScenarios.selectAll': 'Odaberi sve',
  'adminScenarios.selectedCount': '{n} odabrano',
  'adminScenarios.bulkPublish': 'Objavi odabrano',
  'adminScenarios.bulkDraft': 'Premjesti u nacrt',
  'adminScenarios.bulkArchive': 'Arhiviraj odabrano',
  'adminScenarios.bulkPublishDone': '{n} situacija objavljeno',
  'adminScenarios.bulkDraftDone': '{n} situacija premješteno u nacrt',
  'adminScenarios.bulkArchiveDone': '{n} situacija arhivirano',
  'team.teams': 'Momčade',
  'team.createTeam': 'Stvori momčadu',
  'team.noClubs': 'Još nema klubova. Stvorite prvi klub pri prijavi trenera.',
  'team.category': 'Kategorija momčade',
  'team.nameRequired': 'Naziv momčade je obavezan',
  'team.roster': 'Kadrovske liste',
  'team.attendance': 'Prisutnost',
  'team.dailyActivity': 'Dnevna aktivnost',
  'team.weeklyProgress': 'Tjedni napredak',
  'team.mostImproved': 'Najbolji napredak',
  'team.needsAttention': 'Potrebna pažnja',
  'team.invitePlayers': 'Pozovi igrače',
  'team.inviteSub': 'E-pošta, poveznica ili QR kod',
  'team.teamCode': 'KOD MOMČADE',
  'team.code': 'Kod',
  'team.copyCode': 'Kopiraj kod',
  'team.inviteByEmail': 'POZIV E-POŠTOM',
  'team.inviteByLink': 'POZIV POVEZNICOM',
  'team.inviteByQr': 'QR KOD',
  'team.sendInvite': 'Pošalji poziv',
  'team.generateLink': 'Generiraj i podijeli poveznicu',
  'team.qrHint': 'Skeniraj za pridruživanje momčadi',
  'team.qrScanHint': 'Igrači skeniraju ovo na treningu za automatsko pridruživanje',
  'team.inviteSent': 'Pozivnica poslana',
  'team.leaderboardsSub': 'Rezultat odluka, XP, nizovi',
  'team.lbDecisionScore': 'Rezultat odluka',
  'team.lbXp': 'XP',
  'team.lbStreak': 'Niz treninga',
  'team.lbActivity': 'Tjedna aktivnost',
  'team.lbImprovement': 'Napredak',
  'team.reportsSub': 'Izvoz tjedno, mjesečno, sezonski',
  'team.reportPeriod': 'Razdoblje izvještaja',
  'team.period.individual': 'Pojedinačno',
  'team.period.team': 'Momčad',
  'team.period.weekly': 'Tjedno',
  'team.period.monthly': 'Mjesečno',
  'team.period.season': 'Sezona',
  'team.reportPreview': 'Uključuje statistiku kadra, rezultat odluka i napredak',
  'team.exportExcel': 'Izvoz Excel (CSV)',
  'team.exportPdf': 'Izvoz PDF',
  'team.coachNotesSub': 'Privatne bilješke po igraču',
  'team.noteType': 'Vrsta bilješke',
  'team.note.training': 'Trening',
  'team.note.injury': 'Ozljeda',
  'team.note.mental': 'Mentalno',
  'team.note.general': 'Općenito',
  'team.notePlaceholder': 'Napišite privatne bilješke trenera…',
  'team.saveNote': 'Spremi bilješku',
  'team.previousNotes': 'PRETHODNE BILJEŠKE',
  'team.enterCode': 'Kod pozivnice za momčadu',
  'team.enterLink': 'Poveznica ili token pozivnice',
  'team.linkPlaceholder': 'handballiq://join/…',
  'team.joinByCode': 'Pridruži se kodom',
  'team.joinByLink': 'Pridruži se poveznicom',
  'team.joinSuccess': 'Uspješno ste se pridružili momčadi {name}!',
  'team.assignPosition': 'Pozicija',
  'team.assignDifficulty': 'Težina',
  'team.assignCategory': 'Kategorija',
  'team.scenarioCount': 'Broj situacija',
  'coachDashboard.assignSuccessSub': 'Igrač će to vidjeti na početnom ekranu.',
};

const DE = {
  'match.teamLabel': 'Dein Team',
  'match.correctAnswer': 'Richtige Antwort',
  'match.yourChoice': 'Deine Wahl',
  'match.halftimeBreak': 'Halbzeitpause',
  'match.firstHalfSummary': 'Zusammenfassung erste Halbzeit',
  'match.finalScore': 'Endstand',
  'cdPlayers.emptySub': 'Füge Spieler deinem Kader hinzu, um ihre Entwicklung hier zu verfolgen.',
  'cdPlayers.emptySearch': 'Probiere einen anderen Suchbegriff oder setze die Filter zurück.',
  'adminScenarios.statusAll': 'Alle',
  'adminScenarios.statusPublished': 'Veröffentlicht',
  'adminScenarios.statusDraft': 'Entwurf',
  'adminScenarios.statusArchived': 'Archiviert',
  'adminScenarios.selectAll': 'Alle auswählen',
  'adminScenarios.selectedCount': '{n} ausgewählt',
  'adminScenarios.bulkPublish': 'Auswahl veröffentlichen',
  'adminScenarios.bulkDraft': 'Als Entwurf speichern',
  'adminScenarios.bulkArchive': 'Auswahl archivieren',
  'adminScenarios.bulkPublishDone': '{n} Szenarien veröffentlicht',
  'adminScenarios.bulkDraftDone': '{n} Szenarien als Entwurf gespeichert',
  'adminScenarios.bulkArchiveDone': '{n} Szenarien archiviert',
  'team.teams': 'Mannschaften',
  'team.createTeam': 'Mannschaft erstellen',
  'team.noClubs': 'Noch keine Vereine. Erstelle deinen ersten Verein über die Trainer-Anmeldung.',
  'team.category': 'Mannschaftskategorie',
  'team.nameRequired': 'Mannschaftsname ist erforderlich',
  'team.roster': 'Kader',
  'team.attendance': 'Anwesenheit',
  'team.dailyActivity': 'Tägliche Aktivität',
  'team.weeklyProgress': 'Wöchentlicher Fortschritt',
  'team.mostImproved': 'Größte Verbesserung',
  'team.needsAttention': 'Braucht Aufmerksamkeit',
  'team.invitePlayers': 'Spieler einladen',
  'team.inviteSub': 'E-Mail, Link oder QR-Code',
  'team.teamCode': 'TEAMCODE',
  'team.code': 'Code',
  'team.copyCode': 'Code kopieren',
  'team.inviteByEmail': 'EINLADUNG PER E-MAIL',
  'team.inviteByLink': 'EINLADUNG PER LINK',
  'team.inviteByQr': 'QR-CODE',
  'team.sendInvite': 'Einladung senden',
  'team.generateLink': 'Link erstellen & teilen',
  'team.qrHint': 'Scannen, um dem Team beizutreten',
  'team.qrScanHint': 'Spieler scannen dies beim Training, um automatisch beizutreten',
  'team.inviteSent': 'Einladung gesendet',
  'team.leaderboardsSub': 'Entscheidungsscore, XP, Serien',
  'team.lbDecisionScore': 'Entscheidungsscore',
  'team.lbXp': 'XP',
  'team.lbStreak': 'Trainingsserie',
  'team.lbActivity': 'Wöchentliche Aktivität',
  'team.lbImprovement': 'Verbesserung',
  'team.reportsSub': 'Export wöchentlich, monatlich, Saison',
  'team.reportPeriod': 'Berichtszeitraum',
  'team.period.individual': 'Einzeln',
  'team.period.team': 'Team',
  'team.period.weekly': 'Wöchentlich',
  'team.period.monthly': 'Monatlich',
  'team.period.season': 'Saison',
  'team.reportPreview': 'Enthält Kaderstatistik, Entscheidungsscore und Fortschritt',
  'team.exportExcel': 'Excel exportieren (CSV)',
  'team.exportPdf': 'PDF exportieren',
  'team.coachNotesSub': 'Private Notizen pro Spieler',
  'team.noteType': 'Notiztyp',
  'team.note.training': 'Training',
  'team.note.injury': 'Verletzung',
  'team.note.mental': 'Mental',
  'team.note.general': 'Allgemein',
  'team.notePlaceholder': 'Private Trainernotizen schreiben…',
  'team.saveNote': 'Notiz speichern',
  'team.previousNotes': 'FRÜHERE NOTIZEN',
  'team.enterCode': 'Team-Einladungscode',
  'team.enterLink': 'Einladungslink oder Token',
  'team.linkPlaceholder': 'handballiq://join/…',
  'team.joinByCode': 'Mit Code beitreten',
  'team.joinByLink': 'Mit Link beitreten',
  'team.joinSuccess': 'Erfolgreich {name} beigetreten!',
  'team.assignPosition': 'Position',
  'team.assignDifficulty': 'Schwierigkeit',
  'team.assignCategory': 'Kategorie',
  'team.scenarioCount': 'Anzahl Szenarien',
  'coachDashboard.assignSuccessSub': 'Der Spieler sieht es auf seinem Startbildschirm.',
};

const SCENARIO_HR = {
  'Hold the ball': 'Zadrži loptu',
  'Seven Against Six': 'Sedam na šest',
  'Stay centred, wait for the throwing motion and react to the release': 'Ostani u centru, pričekaj završni pokret i reagiraj na ispuštanje lopte',
  'Pre-dive to the strong side since non-specialists often shoot predictably': 'Pred-ispupčavanje na jaku stranu jer nespecijalisti često šutiraju predvidivo',
  'Stay patient. Read the shooter before committing — do not guess.': 'Budi strpljiv. Pročitaj šutera prije nego što se odlučiš — ne nagađaj.',
  'You delivered a solid performance with good decision-making in most situations.': 'Ostvario si solidnu igru s dobrim odlukama u većini situacija.',
  'Stay centred, react to the shooter': 'Ostani u centru, reagiraj na šutera',
  "Screen and block the goalkeeper's view": 'Zaslon i blokiraj vratara da ne vidi',
  'Hold position, watch the ball carrier\'s eyes': 'Zadrži položaj, prati pogled nositelja lopte',
  'Practice controlled advancement to the five-metre line and reading the attacker\'s body language': 'Vježbaj kontrolirani izlazak do crte pet metara i čitanje jezika tijela napadača',
  'Stay patient and read the shooter\'s shoulder before committing': 'Budi strpljiv i pročitaj rame šutera prije nego što se odlučiš',
  'Stay patient before committing. Read the shooter\'s eyes': 'Budi strpljiv prije odluke. Pročitaj oči šutera',
  'Stay patient, read the shooter\'s body': 'Budi strpljiv, pročitaj tijelo šutera',
  'Stay patient, read the shooter\'s shoulder': 'Budi strpljiv, pročitaj rame šutera',
  'You consistently read the shooter\'s shoulder and timing before committing': 'Dosljedno čitaš rame šutera i tajming prije nego što se odlučiš',
};

const SCENARIO_DE = {
  'Correct — if the defence anticipates the screen, rolling to the opposite side creates an open passing lane.': 'Richtig — erwartet die Abwehr den Block, führt das Abrollen auf die Gegenseite zu einer freien Passlinie.',
  'Correct — if the defence anticipates the screen, the far post becomes the open option.': 'Richtig — erwartet die Abwehr den Block, wird der weite Pfosten zur freien Option.',
  'Correct — if the defence anticipates the screen, the pivot becomes the open option.': 'Richtig — erwartet die Abwehr den Block, wird der Kreisläufer zur freien Option.',
  'Correct — reading around the screen keeps you aligned with the actual shooting threat.': 'Richtig — das Lesen um den Block herum hält dich am eigentlichen Wurfthreat ausgerichtet.',
  'Correct — reading around the screen keeps you aligned with the real threat.': 'Richtig — das Lesen um den Block herum hält dich an der echten Gefahr ausgerichtet.',
  'Correct — timing the pass to the cutter around the screen creates a high-quality shot.': 'Richtig — der getimte Pass zum Läufer um den Block herum erzeugt eine hochwertige Wurfsituation.',
  "Correct — timing the screen to block the goalkeeper's view at the moment of the shot gives your back the best chance.": 'Richtig — der getimte Block des Torwartsichtfelds im Wurfmoment gibt deinem Rückraum die beste Chance.',
  'Good — drawing contact is reasonable, but screening the goalkeeper is the primary role here.': 'Gut — Kontakt suchen ist nachvollziehbar, aber das Blocken des Torwarts ist hier die Hauptaufgabe.',
  'Good — holding is safe but the screen may delay your reaction.': 'Gut — Halten ist sicher, aber der Block kann deine Reaktion verzögern.',
  'Hold the ball': 'Ball halten',
  "Move to screen the goalkeeper's view at the right moment": 'Zum richtigen Moment in die Sicht des Torwarts stellen',
  'Read around the screen, track the cutter': 'Um den Block lesen, Läufer mitverfolgen',
  'Read the defence — if they anticipate the screen, cut to the far post instead': 'Abwehr lesen — erwartet sie den Block, gehe stattdessen zum weiten Pfosten',
  'Read the defence — if they anticipate the screen, pass to the pivot who is now open': 'Abwehr lesen — erwartet sie den Block, passe zum jetzt freien Kreisläufer',
  'Read the defence — if they anticipate the screen, roll to the opposite side for the pass': 'Abwehr lesen — erwartet sie den Block, rolle auf die Gegenseite für den Pass',
  'Risky — without a screen, the goalkeeper sees the shot clearly and has a good chance to save.': 'Riskant — ohne Block sieht der Torwart den Wurf klar und hat gute Chancen zu parieren.',
  "Screen and block the goalkeeper's view": 'Block stellen und Sicht des Torwarts nehmen',
  'Seven Against Six': 'Sieben gegen Sechs',
  'Stay centred, react to the shooter': 'Zentriert bleiben und auf den Werfer reagieren',
  "Stay patient and read the shooter's shoulder before committing": 'Geduldig bleiben und die Schulter des Werfers lesen, bevor du dich festlegst',
  "Stay patient before committing. Read the shooter's eyes": 'Geduldig bleiben. Augen des Werfers lesen, bevor du dich festlegst',
  "Stay patient, read the shooter's body": 'Geduldig bleiben, Körpersprache des Werfers lesen',
  "Stay patient, read the shooter's shoulder": 'Geduldig bleiben, Schulter des Werfers lesen',
  'The opposition runs a rehearsed set play from a free throw. The pivot screens your defender while the left back cuts to the centre.': 'Der Gegner spielt eine einstudierte Freiwurfaktion. Der Kreisläufer blockt deinen Verteidiger, während der linke Rückraum in die Mitte läuft.',
  'Time the pass to the cutting left back around the screen': 'Pass zum laufenden linken Rückraum um den Block herum timen',
  'You delivered a solid performance with good decision-making in most situations.': 'Du hast solide gespielt und in den meisten Situationen gute Entscheidungen getroffen.',
  'Your team runs a rehearsed set play from a free throw. The pivot screens a defender while the left back cuts to the centre. You have the ball at the top.': 'Dein Team spielt eine einstudierte Freiwurfaktion. Der Kreisläufer blockt einen Verteidiger, während der linke Rückraum in die Mitte läuft. Du hast den Ball oben.',
  'Your team runs a rehearsed set play from a free throw. You are supposed to receive a screen from the pivot, then finish at the near post. The defence seems to anticipate the screen.': 'Dein Team spielt eine einstudierte Freiwurfaktion. Du sollst einen Block vom Kreisläufer bekommen und am nahen Pfosten abschließen. Die Abwehr scheint den Block zu erwarten.',
  'Your team runs a rehearsed set play from a free throw. You are supposed to screen a defender, then roll to the 6m line for a pass. The defence seems to anticipate the screen.': 'Dein Team spielt eine einstudierte Freiwurfaktion. Du sollst blocken und dann zur 6-m-Linie abrollen. Die Abwehr scheint den Block zu erwarten.',
  'Your team runs a rehearsed set play. You are supposed to receive a screen from the pivot, then shoot from 9m. The defence seems to anticipate the screen.': 'Dein Team spielt eine einstudierte Standardsituation. Du sollst einen Block vom Kreisläufer bekommen und aus 9 m werfen. Die Abwehr scheint den Block zu erwarten.',
  'Stay centred, wait for the throwing motion and react to the release': 'Zentriert bleiben, Wurfbewegung abwarten und auf die Ballabgabe reagieren',
  'Pre-dive to the strong side since non-specialists often shoot predictably': 'Vorher zum starken Arm ausfallen, da Nicht-Spezialisten oft vorhersehbar werfen',
  'Stay patient. Read the shooter before committing — do not guess.': 'Geduldig bleiben. Werfer lesen, bevor du dich festlegst — nicht raten.',
  "Hold position, watch the ball carrier's eyes": 'Position halten und die Augen des Ballträgers beobachten',
  "Practice controlled advancement to the five-metre line and reading the attacker's body language": 'Kontrolliertes Herauslaufen bis zur 5-m-Linie und Lesen der Körpersprache des Angreifers üben',
  'You consistently read the shooter\'s shoulder and timing before committing': 'Du liest konsequent Schulter und Timing des Werfers, bevor du dich festlegst',
};

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function injectLocale(file, patch) {
  let content = readFileSync(join(ROOT, file), 'utf8');
  const lines = [];
  for (const [key, value] of Object.entries(patch)) {
    if (content.includes(`'${key}':`)) continue;
    lines.push(`  '${key}': '${esc(value)}',`);
  }
  if (!lines.length) return;
  content = content.replace(/\n};\s*$/, `\n${lines.join('\n')}\n};\n`);
  writeFileSync(join(ROOT, file), content);
  console.log(`Injected ${lines.length} keys into ${file}`);
}

function injectScenarioMap(mapName, patch) {
  const file = join(ROOT, 'locales/scenario-text.ts');
  let content = readFileSync(file, 'utf8');
  const re = new RegExp(`(export const ${mapName}[^=]*=\\s*\\{)([\\s\\S]*?)(\\n\\};)`);
  const m = content.match(re);
  if (!m) throw new Error(`Map ${mapName} not found`);
  let body = m[2];
  for (const [key, value] of Object.entries(patch)) {
    const safeKey = esc(key);
    const safeVal = esc(value);
    const line = `  '${safeKey}': '${safeVal}',`;
    if (body.includes(`'${safeKey}':`)) {
      body = body.replace(new RegExp(`  '${safeKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}': '[^']*',`), line);
    } else {
      body += `\n${line}`;
    }
  }
  // Remove corrupted truncated keys
  body = body.replace(/^  '[^']*\\\\',:.*\n/gm, '');
  content = content.replace(re, `$1${body}$3`);
  writeFileSync(file, content);
  console.log(`Updated ${mapName} (+${Object.keys(patch).length} entries)`);
}

function fixScenarioStringsEn() {
  const file = join(ROOT, 'scripts/scenario-strings-en.json');
  const arr = JSON.parse(readFileSync(file, 'utf8'));
  const cleaned = arr.filter((s) => !/\\"$/.test(s));
  const additions = [
    'Stay centred, react to the shooter',
    "Screen and block the goalkeeper's view",
    "Practice controlled advancement to the five-metre line and reading the attacker's body language",
    "Stay patient and read the shooter's shoulder before committing",
    "Stay patient before committing. Read the shooter's eyes",
    "Stay patient, read the shooter's shoulder",
    'You consistently read the shooter\'s shoulder and timing before committing',
  ];
  for (const s of additions) {
    if (!cleaned.includes(s)) cleaned.push(s);
  }
  cleaned.sort((a, b) => a.localeCompare(b));
  writeFileSync(file, JSON.stringify(cleaned, null, 2) + '\n');
  console.log(`Cleaned scenario-strings-en.json (${arr.length} → ${cleaned.length})`);
}

injectLocale('locales/hr.ts', HR);
injectLocale('locales/de.ts', DE);
injectScenarioMap('scenarioTextHr', SCENARIO_HR);
injectScenarioMap('scenarioTextDe', SCENARIO_DE);
fixScenarioStringsEn();
console.log('Done.');
