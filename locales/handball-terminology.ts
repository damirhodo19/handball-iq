/**
 * Official Handball IQ terminology standard — single source of truth.
 * Data lives in handball-terminology.json; this module exposes typed helpers.
 */
import terminologyData from './handball-terminology.json';
import type { SupportedLanguage, TranslationDict } from './types';

export type TerminologyCategory =
  | 'position'
  | 'tactic'
  | 'coach'
  | 'ui'
  | 'difficulty'
  | 'button';

export interface HandballTerm {
  id: string;
  category: TerminologyCategory;
  localeKey?: string;
  en: string;
  hr: string;
  de: string;
  internalValues?: string[];
}

export interface HandballTerminologyStandard {
  version: string;
  officialLanguages: SupportedLanguage[];
  terms: HandballTerm[];
  forbiddenSynonyms: Partial<Record<SupportedLanguage, Record<string, string[]>>>;
  legacyDifficultyMap: Record<string, string>;
}

export const HANDBALL_TERMINOLOGY = terminologyData as HandballTerminologyStandard;

export const TERMINOLOGY_VERSION = HANDBALL_TERMINOLOGY.version;

/** All terms indexed by stable id. */
export const TERMS_BY_ID: Record<string, HandballTerm> = Object.fromEntries(
  HANDBALL_TERMINOLOGY.terms.map((term) => [term.id, term]),
);

/** Locale keys managed by the terminology standard. */
export const MANAGED_LOCALE_KEYS = new Set(
  HANDBALL_TERMINOLOGY.terms.map((t) => t.localeKey).filter(Boolean) as string[],
);

/** Get the official label for a term id in the given language. */
export function getHandballTerm(id: string, lang: SupportedLanguage): string {
  const term = TERMS_BY_ID[id];
  if (!term) return id;
  return term[lang];
}

/** Resolve an internal code value (e.g. scenario difficulty) to a terminology term id. */
export function resolveTermIdFromInternalValue(value: string): string | undefined {
  for (const term of HANDBALL_TERMINOLOGY.terms) {
    if (term.internalValues?.includes(value)) return term.id;
  }
  return HANDBALL_TERMINOLOGY.legacyDifficultyMap[value];
}

/** Build locale patch object for merging into TranslationDict. */
export function buildTerminologyLocalePatch(lang: SupportedLanguage): TranslationDict {
  const patch: TranslationDict = {};
  for (const term of HANDBALL_TERMINOLOGY.terms) {
    if (term.localeKey) {
      patch[term.localeKey] = term[lang];
    }
  }
  return patch;
}

/** Map legacy difficulty / level codes to official display locale keys. */
export function getDifficultyLocaleKey(internalValue: string): string {
  return (
    HANDBALL_TERMINOLOGY.legacyDifficultyMap[internalValue] ??
    `difficulty.${internalValue.toLowerCase()}`
  );
}

/** EN → HR / DE pairs for scenario translation glossaries (longest match first). */
export function buildScenarioGlossary(lang: 'hr' | 'de'): Array<[RegExp, string]> {
  const entries: Array<{ pattern: string; replacement: string; len: number }> = [];

  for (const term of HANDBALL_TERMINOLOGY.terms) {
    const en = term.en;
    if (!en || en.length < 3) continue;
    entries.push({
      pattern: en,
      replacement: term[lang],
      len: en.length,
    });
  }

  // Additional phrase-level mappings not covered by single terms
  const phraseMaps: Record<'hr' | 'de', Record<string, string>> = {
    hr: {
      goalkeeper: 'vratar',
      shooters: 'šuteri',
      shooter: 'šuter',
      'near post': 'bliža vratnica',
      'far post': 'dalja vratnica',
      'fast break': 'kontranapad',
      'second wave': 'polukontra',
      'quick centre': 'brzi centar',
      'positional attack': 'pozicijski napad',
      'seven-metre throw': 'sedmerac',
      'left wing': 'lijevo krilo',
      'right wing': 'desno krilo',
      'left back': 'lijevi vanjski',
      'right back': 'desni vanjski',
      'centre back': 'srednji vanjski',
      'center back': 'srednji vanjski',
      screen: 'blok',
      screener: 'postavljač bloka',
      'jump shot': 'skok-šut',
      'defensive block': 'obrambeni blok',
      'six-metre line': 'linija šest metara',
      'nine-metre line': 'linija devet metara',
      'delayed shot': 'odgođeni šut',
      breakthrough: 'prodor',
      feint: 'finta',
      crossing: 'križanje',
      transition: 'tranzicija',
      'shot selection': 'odabir šuta',
      'reading the game': 'čitanje igre',
      'reading the defence': 'čitanje obrane',
      'reading the defense': 'čitanje obrane',
      'reading the goalkeeper': 'čitanje vratara',
      defence: 'obrana',
      defense: 'obrana',
    },
    de: {
      goalkeeper: 'Torwart',
      shooters: 'Werfer',
      shooter: 'Werfer',
      'near post': 'kurzer Pfosten',
      'far post': 'langer Pfosten',
      'fast break': 'Tempogegenstoß',
      'second wave': 'zweite Welle',
      'seven-metre throw': '7-Meter-Wurf',
      'left wing': 'linker Außen',
      'right wing': 'rechter Außen',
      'left back': 'linker Rückraum',
      'right back': 'rechter Rückraum',
      'centre back': 'Rückraum Mitte',
      'center back': 'Rückraum Mitte',
      screen: 'Sperre',
      screener: 'Sperrespieler',
      'jump shot': 'Sprungwurf',
      'defensive block': 'Abwehrblock',
      pivot: 'Kreisläufer',
      'delayed shot': 'verzögerter Wurf',
    },
  };

  for (const [pattern, replacement] of Object.entries(phraseMaps[lang])) {
    entries.push({ pattern, replacement, len: pattern.length });
  }

  entries.sort((a, b) => b.len - a.len);
  return entries.map(({ pattern, replacement }) => [new RegExp(pattern, 'gi'), replacement]);
}

export function getForbiddenSynonyms(lang: SupportedLanguage): Record<string, string[]> {
  return HANDBALL_TERMINOLOGY.forbiddenSynonyms[lang] ?? {};
}
