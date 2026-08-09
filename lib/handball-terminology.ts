/**
 * Runtime helpers for the official Handball IQ terminology standard.
 */
export {
  HANDBALL_TERMINOLOGY,
  TERMINOLOGY_VERSION,
  TERMS_BY_ID,
  MANAGED_LOCALE_KEYS,
  getHandballTerm,
  resolveTermIdFromInternalValue,
  buildTerminologyLocalePatch,
  getDifficultyLocaleKey,
  buildScenarioGlossary,
  getForbiddenSynonyms,
} from '@/locales/handball-terminology';

export type {
  HandballTerm,
  HandballTerminologyStandard,
  TerminologyCategory,
} from '@/locales/handball-terminology';
