#!/usr/bin/env node
/**
 * Generates locales/scenario-text.ts from scripts/scenario-strings-en.json
 * Uses Google Translate + handball terminology post-processing.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { postProcessHr, postProcessDe } from './scenario-bank/glossary.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const strings = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts/scenario-strings-en.json'), 'utf8'),
);

// Preserve quality HR translations from lib/scenarios.ts only (not from scenario-text.ts)
function loadExistingHr() {
  const map = new Map();
  const scenarios = fs.readFileSync(path.join(ROOT, 'lib/scenarios.ts'), 'utf8');
  const fieldRe =
    /(situation|question|explanation):\s*\n\s*'((?:\\'|[^'])*)',\s*\n\s*\1_hr:\s*\n\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = fieldRe.exec(scenarios))) {
    const k = m[2].replace(/\\'/g, "'");
    const v = m[3].replace(/\\'/g, "'");
    if (k !== v) map.set(k, v);
  }
  const optRe = /options:\s*\[([\s\S]*?)\],\s*\n\s*options_hr:\s*\[([\s\S]*?)\]/g;
  while ((m = optRe.exec(scenarios))) {
    const enOpts = [...m[1].matchAll(/'((?:\\'|[^'])*)'/g)].map((x) =>
      x[1].replace(/\\'/g, "'"),
    );
    const hrOpts = [...m[2].matchAll(/'((?:\\'|[^'])*)'/g)].map((x) =>
      x[1].replace(/\\'/g, "'"),
    );
    enOpts.forEach((o, i) => {
      if (hrOpts[i] && o !== hrOpts[i]) map.set(o, hrOpts[i]);
    });
  }
  return map;
}

const EXISTING_HR = loadExistingHr();

// Croatian keys accidentally in EN list — identity for HR, map to English for DE
const CROATIAN_KEY_PATTERN = /[čćžšđ]/i;

const CROATIAN_TO_EN = {
  'Koji je najbolji mentalni i taktički pristup?': 'What is the best mental and tactical approach?',
  'Koji je najbolji početni odgovor?': 'What is the best initial response?',
  'Kontranapad. Napadač prilazi sam iz sredine i još uvijek ima nekoliko metara do šestometarske crte.':
    'Fast break. The attacker approaches alone from the centre and still has several metres before the six-metre line.',
  'Kontrolirani izlazak sužava kut bez prisanja. Ostati velik i reagirati kasno tjera napadača da donese prvu odluku.':
    'Advancing under control narrows the angle without committing. Staying large and reacting late forces the attacker to make the first decision.',
  'Krilo je pokazalo dvije različite završetke. Zatvaranje bliže stative uz uravnoteženost pokriva najvjerojatniji kut i ostavlja spremnim za lob.':
    'The wing has shown two different finishes. Closing the near post while staying balanced covers the most likely angle and keeps you ready for the lob.',
  'Lijevo krilo prima loptu pod vrlo malim kutom. Prije je jednom postigao gol bližom stativom i jednom lobanjem.':
    'Left wing receives the ball at a very narrow angle. He previously scored once at the near post and once with a lob.',
  'Pivot je izvan ravnoteže, pa će šut biti sporiji. Ostati uspravan i reagirati kasno daje najbolju šansu za pokrivanje završetka.':
    'The pivot is off balance, so the release will be slower. Staying upright and reacting late gives you the best chance to cover the finish.',
  'Prethodni šutovi su informacija, a ne sigurnost. Držanje pozicije i reagiranje na konačni pokret ostavlja svaki kut otvoren.':
    'Previous shots are information, not certainty. Holding position and reacting to the final movement keeps every corner live.',
  'Protivnik igra sedam protiv šest. Pivot prima loptu pod pritiskom na šest metara, blago izvan ravnoteže.':
    'The opponent plays seven against six. The pivot receives the ball under pressure at six metres, slightly off balance.',
  'Protivnik napada šest protiv šest. Desni vanjski je već dvaput postigao gol visokim šutom prema vašoj lijevoj strani. Branič kasni i šuter ima prostor za pun skok šut.':
    'The opponent attacks six against six. The right back has already scored twice with a high shot toward your left side. The defender is late and the shooter has space for a full jump shot.',
  'Rano kretanje daje šuteru vremena da promijeni šut. Strpljivost omogućuje vrataru da pročita konačni položaj ruke i tijela.':
    'Moving early gives the shooter time to change the shot. Staying patient allows the goalkeeper to read the final arm and body position.',
  'Sedmerac. Šuter je prije koristio dva niska šuta, ali sada dugo gleda u vratara.':
    'Seven-metre throw. The shooter previously used two low shots, but is now looking at the goalkeeper for a long time.',
  'Što treba biti vaš glavni fokus?': 'What should be your main focus?',
  'Što treba biti vaš primarni fokus?': 'What should be your primary focus?',
  'Što trebate prioritetno raditi?': 'What should you prioritize?',
};

async function googleTranslate(text, targetLang, retries = 5) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data[0].map((x) => x[0]).join('');
    } catch (err) {
      if (attempt === retries - 1) throw new Error(`Translate failed after ${retries} tries: ${text.slice(0, 60)} (${err.message})`);
      await sleep(500 * (attempt + 1));
    }
  }
}

function escapeTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateAll() {
  const hrMap = {};
  const deMap = {};
  const cachePath = path.join(ROOT, 'scripts/.scenario-translations-cache.json');
  let cache = {};
  if (fs.existsSync(cachePath)) {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  }

  for (let i = 0; i < strings.length; i++) {
    const en = strings[i];
    const cacheKey = en;

    if (cache[cacheKey]?.hr && cache[cacheKey]?.de) {
      hrMap[en] = EXISTING_HR.has(en) ? EXISTING_HR.get(en) : postProcessHr(cache[cacheKey].hr);
      deMap[en] = postProcessDe(cache[cacheKey].de);
      continue;
    }

    // HR: use existing, or identity if already Croatian
    let hr;
    if (EXISTING_HR.has(en)) {
      hr = EXISTING_HR.get(en);
    } else if (CROATIAN_KEY_PATTERN.test(en)) {
      hr = en;
    } else if (cache[cacheKey]?.hr) {
      hr = cache[cacheKey].hr;
    } else {
      const raw = await googleTranslate(en, 'hr');
      hr = postProcessHr(raw);
      await sleep(250);
    }

    // DE
    let de;
    const deSource = CROATIAN_TO_EN[en] ?? en;
    if (cache[cacheKey]?.de) {
      de = cache[cacheKey].de;
    } else {
      const raw = await googleTranslate(deSource, 'de');
      de = postProcessDe(raw);
      await sleep(250);
    }

    hrMap[en] = hr;
    deMap[en] = de;
    cache[cacheKey] = { hr, de };

    if (i % 20 === 0) {
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 0));
      process.stderr.write(`Translated ${i + 1}/${strings.length}\n`);
    }
  }

  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 0));
  return { hrMap, deMap };
}

function renderMap(name, map, keys) {
  const lines = [`export const ${name}: Record<string, string> = {`];
  for (const k of keys) {
    const v = map[k] ?? k;
    lines.push(`  '${escapeTs(k)}': '${escapeTs(v)}',`);
  }
  lines.push('};');
  return lines.join('\n');
}

async function main() {
  const { hrMap, deMap } = await translateAll();

  const sortedKeys = [...strings].sort((a, b) => a.localeCompare(b));

  const out = `// Auto-generated scenario body translations keyed by English source text

${renderMap('scenarioTextHr', hrMap, sortedKeys)}

${renderMap('scenarioTextDe', deMap, sortedKeys)}
`;

  fs.writeFileSync(path.join(ROOT, 'locales/scenario-text.ts'), out);

  const hrTranslated = sortedKeys.filter((k) => hrMap[k] && hrMap[k] !== k).length;
  const deTranslated = sortedKeys.filter((k) => deMap[k] && deMap[k] !== k).length;
  console.log(`Generated locales/scenario-text.ts`);
  console.log(`scenarioTextHr: ${sortedKeys.length} keys, ${hrTranslated} translated`);
  console.log(`scenarioTextDe: ${sortedKeys.length} keys, ${deTranslated} translated`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
