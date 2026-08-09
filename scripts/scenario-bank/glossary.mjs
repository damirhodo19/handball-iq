/** Handball terminology glossaries for EN → HR / DE translation.
 *  Official terms: locales/handball-terminology.json
 *  HR MT repair: scripts/hr-mt-fixes.mjs (shared with fix-handball-terminology)
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { applyHrMtFixes } from '../hr-mt-fixes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const terminology = JSON.parse(
  readFileSync(join(__dirname, '..', '..', 'locales/handball-terminology.json'), 'utf8'),
);

function buildGlossaryFromTerms(ids, lang) {
  const out = [];
  for (const id of ids) {
    const t = terminology.terms.find((x) => x.id === id);
    if (t && t.en) out.push([new RegExp(t.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), t[lang]]);
  }
  return out;
}

/** Core glossary entries sourced from official terminology standard. */
const CORE_TERM_IDS = [
  'position.goalkeeper', 'position.leftWing', 'position.rightWing', 'position.leftBack',
  'position.centreBack', 'position.rightBack', 'position.pivot',
  'tactic.fastBreak', 'tactic.secondWave', 'tactic.quickCentre', 'tactic.positionalAttack',
  'tactic.screen', 'tactic.jumpShot', 'tactic.penaltyThrow', 'tactic.defensiveBlock',
  'tactic.sixMetreLine', 'tactic.nineMetreLine', 'tactic.defence60', 'tactic.defence51',
  'tactic.defence321', 'tactic.crossing', 'tactic.helpDefence', 'tactic.wingShot',
  'tactic.breakthrough', 'tactic.feint', 'tactic.transition', 'tactic.manToMan',
  'coach.shotSelection', 'coach.readingGame', 'coach.readingDefence', 'coach.readingGoalkeeper',
];

export const HR_GLOSSARY = [
  ...buildGlossaryFromTerms(CORE_TERM_IDS, 'hr'),
  [/goalkeepers/gi, 'vratari'],
  [/shooters/gi, 'šuteri'],
  [/shooter/gi, 'šuter'],
  [/shooting/gi, 'šutiranje'],
  [/shots/gi, 'šutovi'],
  [/shot/gi, 'šut'],
  [/near post/gi, 'bliža vratnica'],
  [/far post/gi, 'dalja vratnica'],
  [/fast breaks/gi, 'kontranapadi'],
  [/counter-attack/gi, 'kontranapad'],
  [/counter-attacks/gi, 'kontranapadi'],
  [/seven-metre throw/gi, 'sedmerac'],
  [/seven-metre/gi, 'sedmerac'],
  [/seven metre/gi, 'sedmerac'],
  [/7m throw/gi, 'sedmerac'],
  [/7m/gi, '7 m'],
  [/wings/gi, 'krila'],
  [/wing/gi, 'krilo'],
  [/centre/gi, 'centar'],
  [/center/gi, 'centar'],
  [/defenders/gi, 'obrambeni igrači'],
  [/defender/gi, 'obrambeni igrač'],
  [/attackers/gi, 'napadači'],
  [/attacker/gi, 'napadač'],
  [/screen play/gi, 'igra s blokom'],
  [/screens/gi, 'blok'],
  [/screener/gi, 'postavljač bloka'],
  [/lob/gi, 'lob'],
  [/power play/gi, 'igra s igračem više'],
  [/set play/gi, 'izvedba iz igre'],
  [/free throw/gi, 'slobodno bacanje'],
  [/six metre/gi, 'šest metara'],
  [/six metres/gi, 'šest metara'],
  [/six-metre/gi, 'šest metara'],
  [/nine metre/gi, 'devet metara'],
  [/goal line/gi, 'gol-crta'],
  [/halfway line/gi, 'sredina terena'],
  [/delayed shot/gi, 'odgođeni šut'],
  [/Correct —/g, 'Točno —'],
  [/Good —/g, 'Dobro —'],
  [/Poor —/g, 'Loše —'],
  [/Risky —/g, 'Rizično —'],
  [/Reasonable —/g, 'Razumno —'],
];

export const DE_GLOSSARY = [
  ...buildGlossaryFromTerms(CORE_TERM_IDS, 'de'),
  [/shooters/gi, 'Werfer'],
  [/shooter/gi, 'Werfer'],
  [/shooting/gi, 'Wurf'],
  [/shots/gi, 'Würfe'],
  [/shot/gi, 'Wurf'],
  [/near post/gi, 'kurzer Pfosten'],
  [/far post/gi, 'langer Pfosten'],
  [/counter-attack/gi, 'Tempogegenstoß'],
  [/counter-attacks/gi, 'Tempogegenstöße'],
  [/seven-metre/gi, '7-Meter-Wurf'],
  [/seven metre/gi, '7-Meter-Wurf'],
  [/7m throw/gi, '7-Meter-Wurf'],
  [/7m/gi, '7 m'],
  [/wings/gi, 'Außen'],
  [/wing/gi, 'Außen'],
  [/centre/gi, 'Mitte'],
  [/center/gi, 'Mitte'],
  [/defence/gi, 'Abwehr'],
  [/defense/gi, 'Abwehr'],
  [/defenders/gi, 'Verteidiger'],
  [/defender/gi, 'Verteidiger'],
  [/attackers/gi, 'Angreifer'],
  [/attacker/gi, 'Angreifer'],
  [/screens/gi, 'Sperre'],
  [/screener/gi, 'Sperrespieler'],
  [/lob/gi, 'Lob'],
  [/power play/gi, 'Überzahl'],
  [/set play/gi, 'Standardsituation'],
  [/free throw/gi, 'Freiwurf'],
  [/six metre/gi, '6 Meter'],
  [/six metres/gi, '6 Meter'],
  [/six-metre/gi, '6-Meter'],
  [/nine metre/gi, '9 Meter'],
  [/goal line/gi, 'Torlinie'],
  [/halfway line/gi, 'Mittellinie'],
  [/delayed shot/gi, 'verzögerter Wurf'],
  [/Correct —/g, 'Richtig —'],
  [/Good —/g, 'Gut —'],
  [/Poor —/g, 'Schlecht —'],
  [/Risky —/g, 'Riskant —'],
  [/Reasonable —/g, 'Vertretbar —'],
];

function applyGlossary(text, glossary) {
  let out = text;
  for (const [re, rep] of glossary) out = out.replace(re, rep);
  return out;
}

export function postProcessHr(text) {
  let out = applyGlossary(text, HR_GLOSSARY);
  out = applyHrMtFixes(out);
  out = out.replace(/ - /g, ' — ');
  return out;
}

export function postProcessDe(text) {
  let out = applyGlossary(text, DE_GLOSSARY);
  const fixes = [
    [/Schütze/gi, 'Werfer'],
    [/Stoßstange/gi, 'Kreisläufer'],
    [/schnellen Angriff/gi, 'Tempogegenstoß'],
    [/Bildschirm/gi, 'Sperre'],
    [/Schirm/gi, 'Sperre'],
    [/Schalterverwirrung/gi, 'Verwirrung in der Rotation'],
    [/unnötige Schalter/gi, 'unnötige Wechsel'],
    [/stille Schalter/gi, 'leise Wechsel'],
    [/Schalter/gi, 'Wechsel'],
    [/einen Sperre/gi, 'eine Sperre'],
    [/den Sperre/gi, 'die Sperre'],
    [/dem Sperre/gi, 'der Sperre'],
    [/Sperreer/gi, 'Sperrespieler'],
    [/Gegenstoß/gi, 'Tempogegenstoß'],
    [/ - /g, ' — '],
  ];
  for (const [re, rep] of fixes) out = out.replace(re, rep);
  return out;
}

export function localizeEn(text) {
  return {
    en: text,
    hr: postProcessHr(text),
    de: postProcessDe(text),
  };
}
