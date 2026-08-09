/** Translation with Google Translate + handball glossary post-processing. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { postProcessHr, postProcessDe } from './glossary.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.join(__dirname, '..', '.scenario-bank-translations-cache.json');

let cache = {};
if (fs.existsSync(CACHE_PATH)) {
  cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function googleTranslate(text, targetLang, retries = 4) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data[0].map((x) => x[0]).join('');
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await sleep(400 * (attempt + 1));
    }
  }
}

export async function translateText(en, lang) {
  if (!en || lang === 'en') return en;
  const key = `${lang}::${en}`;
  if (cache[key]) return cache[key];

  const raw = await googleTranslate(en, lang === 'hr' ? 'hr' : 'de');
  const result = lang === 'hr' ? postProcessHr(raw) : postProcessDe(raw);
  cache[key] = result;
  return result;
}

export async function localizeTextAsync(en) {
  const [hr, de] = await Promise.all([translateText(en, 'hr'), translateText(en, 'de')]);
  return { en, hr, de };
}

export function flushTranslationCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0));
}

export function getCacheSize() {
  return Object.keys(cache).length;
}
