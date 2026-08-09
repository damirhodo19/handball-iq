export {};

/** @typedef {'optimal'|'good'|'risky'|'poor'} DecisionQuality */

/**
 * @typedef {object} ArchetypeAnswer
 * @property {string} textEn
 * @property {DecisionQuality} quality
 * @property {string} feedbackEn
 */

/**
 * @typedef {object} Archetype
 * @property {string} category
 * @property {string} primaryPosition
 * @property {string[]} secondaryPositions
 * @property {string} difficulty
 * @property {string} pressureLevel
 * @property {string} attackOrDefence
 * @property {string} matchPhase
 * @property {string} titleEn
 * @property {string} situationEn
 * @property {string} questionEn
 * @property {string} explanationEn
 * @property {ArchetypeAnswer[]} answers
 * @property {Record<string, string[]|number[]>} [variationSlots]
 * @property {string} [defensiveSystem]
 */
