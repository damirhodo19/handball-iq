#!/usr/bin/env node
/**
 * FINAL GOLD BANK INTEGRATION AND LOCK AUDIT (NON-MUTATING)
 * Proves LB/RB/CB/RW/LW approved Gold banks are stable for content lock.
 * Does NOT edit scenarios. Does NOT delete legacy. Does NOT deploy/commit.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = join(root, 'content/scenario-bank/scenarios.json');
const bank = JSON.parse(readFileSync(bankPath, 'utf8'));
const lwLock = JSON.parse(readFileSync(join(root, 'scripts/.lw-batch-c-gold-lock.json'), 'utf8'));
const rwSnap = existsSync(join(root, 'scripts/rw-gold-locked-refs-snapshot.json'))
  ? JSON.parse(readFileSync(join(root, 'scripts/rw-gold-locked-refs-snapshot.json'), 'utf8'))
  : null;

const hash = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const now = new Date().toISOString();

const POS = {
  LB: { key: 'LB', name: 'Left Back', expected: 62 },
  RB: { key: 'RB', name: 'Right Back', expected: 63 },
  CB: { key: 'CB', name: 'Centre Back', expected: 70 },
  RW: { key: 'RW', name: 'Right Wing', expected: 65 },
  LW: { key: 'LW', name: 'Left Wing', expected: 41 },
};

function numId(id) {
  const m = String(id).match(/^scn_bank_(\d+)$/);
  return m ? Number(m[1]) : NaN;
}

function familyKeyOf(s) {
  const tag = (s.skillTags || []).find((t) => String(t).startsWith('family:'));
  return tag ? tag.slice(7) : null;
}

function perceptionOf(s, partsById) {
  if (partsById[s.id]?.perception !== undefined) return !!partsById[s.id].perception;
  return (s.skillTags || []).includes('perception');
}

function handednessOf(s, partsById) {
  return partsById[s.id]?.handedness || 'unknown';
}

function numericalOf(s, partsById) {
  return partsById[s.id]?.numerical || 'unknown';
}

function teachingAreaOf(s, partsById) {
  return partsById[s.id]?.teachingArea || null;
}

// Load optional part metadata (non-mutating)
const partsById = {};
const partFiles = [
  'scripts/scenario-bank/data/lw-pilot-10.json',
  'scripts/scenario-bank/data/lw-parts/lw-families-a.json',
  'scripts/scenario-bank/data/lw-parts/lw-families-b.json',
  'scripts/scenario-bank/data/lw-parts/lw-families-c.json',
];
for (const rel of partFiles) {
  const p = join(root, rel);
  if (!existsSync(p)) continue;
  const rows = JSON.parse(readFileSync(p, 'utf8'));
  if (rel.includes('lw-pilot-10')) {
    rows.forEach((r, i) => {
      partsById[`scn_bank_${941 + i}`] = r;
    });
  } else {
    for (const r of rows) if (r.id) partsById[r.id] = r;
  }
}

function selectGold(posKey) {
  if (posKey === 'LW') {
    return bank
      .filter((s) => s.primaryPosition === 'Left Wing' && numId(s.id) >= 941 && numId(s.id) <= 981)
      .sort((a, b) => numId(a.id) - numId(b.id));
  }
  return bank.filter((s) => s.primaryPosition === POS[posKey].name);
}

// ─────────────────────────────────────────────
// PHASE 1 — counts
// ─────────────────────────────────────────────
const goldSets = {
  LB: selectGold('LB'),
  RB: selectGold('RB'),
  CB: selectGold('CB'),
  RW: selectGold('RW'),
  LW: selectGold('LW'),
};

const counts = Object.fromEntries(
  Object.entries(goldSets).map(([k, rows]) => [k, rows.length]),
);
const expectedCounts = { LB: 62, RB: 63, CB: 70, RW: 65, LW: 41 };
const countMismatches = Object.entries(expectedCounts)
  .filter(([k, n]) => counts[k] !== n)
  .map(([k, n]) => ({ position: k, expected: n, actual: counts[k] }));

// ─────────────────────────────────────────────
// PHASE 2 — hashes
// ─────────────────────────────────────────────
const contentHashes = {
  LB: hash(goldSets.LB),
  RB: hash(goldSets.RB),
  CB: hash(goldSets.CB),
  RW: hash(goldSets.RW),
  LW: hash(goldSets.LW),
};

const expectedPosHashes = {
  LB: lwLock.hashes.LB,
  RB: lwLock.hashes.RB,
  CB: lwLock.hashes.CB,
  RW: lwLock.hashes.RW,
};

const hashMismatches = [];
for (const k of ['LB', 'RB', 'CB', 'RW']) {
  if (contentHashes[k] !== expectedPosHashes[k]) {
    hashMismatches.push({
      position: k,
      expected: expectedPosHashes[k],
      actual: contentHashes[k],
      changedIds: 'full-position-set-hash-mismatch',
    });
  }
}

const lwSeedExpected = { ...lwLock.hashes.seeds941to974, ...lwLock.hashes.seeds975to981 };
const lwSeedDrift = [];
for (const [id, expected] of Object.entries(lwSeedExpected)) {
  const s = bank.find((x) => x.id === id);
  if (!s) {
    lwSeedDrift.push({ id, expected, actual: null, err: 'missing' });
    continue;
  }
  const actual = hash(s);
  if (actual !== expected) lwSeedDrift.push({ id, expected, actual });
}

const lwIdChecks = {
  range941to981Exact: goldSets.LW.length === 41 && goldSets.LW.every((s, i) => numId(s.id) === 941 + i),
  no982: !bank.some((s) => s.id === 'scn_bank_982'),
  noMissing: (() => {
    for (let n = 941; n <= 981; n++) {
      if (!bank.find((s) => s.id === `scn_bank_${n}` && s.primaryPosition === 'Left Wing')) return false;
    }
    return true;
  })(),
  noDuplicateIds: new Set(goldSets.LW.map((s) => s.id)).size === goldSets.LW.length,
  noOutsideTreatedAsGold: true, // selection rule is ID-range only
};

// RW locked refs snapshot if present
const rwLockedRefDrift = [];
if (rwSnap?.locked) {
  for (const [id, meta] of Object.entries(rwSnap.locked)) {
    const s = bank.find((x) => x.id === id);
    if (!s) {
      rwLockedRefDrift.push({ id, err: 'missing' });
      continue;
    }
    const actual = hash(s);
    if (meta.hash && actual !== meta.hash) rwLockedRefDrift.push({ id, expected: meta.hash, actual });
  }
}

// ─────────────────────────────────────────────
// PHASE 3 — position identity
// ─────────────────────────────────────────────
const identityFindings = [];

function blobAll(s) {
  return JSON.stringify({
    t: s.title,
    sit: s.situation,
    q: s.question,
    a: s.answers,
    e: s.explanation,
  });
}

const identityRules = {
  LB: {
    own: [/Left Back/i, /Lijevi vanjski/i, /Linksaußenrückraum|Rückraum links|Linker Rückraum/i, /Linksaußen(?!)/i],
    wrongTitleStart: /^(Right Back|Centre Back|Left Wing|Right Wing|Goalkeeper|Pivot)\b/i,
    sideLeak: [
      { re: /\bRight Back\b/i, note: 'RB name in LB title/question', where: 'title|question' },
      { re: /\bdesni vanjski\b/i, note: 'desni vanjski as self', where: 'title' },
    ],
  },
  RB: {
    wrongTitleStart: /^(Left Back|Centre Back|Left Wing|Right Wing|Goalkeeper|Pivot)\b/i,
  },
  CB: {
    wrongTitleStart: /^(Left Back|Right Back|Left Wing|Right Wing|Goalkeeper|Pivot)\b/i,
  },
  RW: {
    wrongTitleStart: /^(Left Back|Right Back|Centre Back|Left Wing|Goalkeeper|Pivot)\b/i,
    tacticalLeak: [
      { re: /\bLeft Wing —/i, cls: 'TACTICAL', note: 'LW title pattern inside RW' },
      { re: /\bLijevo krilo —/i, cls: 'TACTICAL', note: 'HR LW title pattern inside RW' },
      { re: /\bLinksaußen —/i, cls: 'TACTICAL', note: 'DE LW title pattern inside RW' },
    ],
  },
  LW: {
    wrongTitleStart: /^(Left Back|Right Back|Centre Back|Right Wing|Goalkeeper|Pivot)\b/i,
    tacticalLeak: [
      { re: /\bRight Wing —/i, cls: 'TACTICAL', note: 'RW title pattern inside LW' },
      { re: /\bDesno krilo —/i, cls: 'TACTICAL', note: 'HR RW title pattern inside LW' },
      { re: /\bRechtsaußen —/i, cls: 'TACTICAL', note: 'DE RW title pattern inside LW' },
    ],
  },
};

for (const [posKey, rows] of Object.entries(goldSets)) {
  const rules = identityRules[posKey];
  for (const s of rows) {
    const titleEn = s.title?.en || '';
    const titleHr = s.title?.hr || '';
    const titleDe = s.title?.de || '';
    const titles = `${titleEn}\n${titleHr}\n${titleDe}`;
    if (rules.wrongTitleStart && rules.wrongTitleStart.test(titleEn)) {
      identityFindings.push({
        id: s.id,
        position: posKey,
        classification: 'TACTICAL',
        note: `Title starts with wrong position: ${titleEn.slice(0, 80)}`,
      });
    }
    if (rules.tacticalLeak) {
      for (const leak of rules.tacticalLeak) {
        if (leak.re.test(titles)) {
          identityFindings.push({
            id: s.id,
            position: posKey,
            classification: leak.cls,
            note: leak.note,
          });
        }
      }
    }
    // Generic fallback smell in titles
    if (/Scenario \d+|TODO|FIXME|lorem ipsum|placeholder/i.test(titles)) {
      identityFindings.push({
        id: s.id,
        position: posKey,
        classification: 'TACTICAL',
        note: 'Placeholder / fallback title text',
      });
    }
    // LB/RB side swap in own-position titles (self-reference)
    if (posKey === 'LB' && /^Right Back\b/i.test(titleEn)) {
      identityFindings.push({ id: s.id, position: posKey, classification: 'TACTICAL', note: 'LB titled as Right Back' });
    }
    if (posKey === 'RB' && /^Left Back\b/i.test(titleEn)) {
      identityFindings.push({ id: s.id, position: posKey, classification: 'TACTICAL', note: 'RB titled as Left Back' });
    }
    // Wing side: player role in title must match
    if (posKey === 'LW' && !/Left Wing|Lijevo krilo|Linksaußen/i.test(titles)) {
      identityFindings.push({
        id: s.id,
        position: posKey,
        classification: 'COSMETIC',
        note: 'LW title missing clear LW identity in one locale',
      });
    }
    if (posKey === 'RW' && !/Right Wing|Desno krilo|Rechtsaußen/i.test(titles)) {
      identityFindings.push({
        id: s.id,
        position: posKey,
        classification: 'COSMETIC',
        note: 'RW title missing clear RW identity in one locale',
      });
    }
  }
}

const tacticalLeakage = identityFindings.filter((f) => f.classification === 'TACTICAL');

// ─────────────────────────────────────────────
// PHASE 4 — cross-bank semantic duplicates
// ─────────────────────────────────────────────
function abstractTeaching(s) {
  const raw = [
    s.title?.en,
    s.question?.en,
    (s.answers || []).slice(0, 2).map((a) => a.text?.en).join(' || '),
    s.whyCorrectOverSecondBest?.en || s.explanation?.en,
  ]
    .join(' \n ')
    .toLowerCase();
  return raw
    .replace(/\bleft wing\b|\bright wing\b|\bleft back\b|\bright back\b|\bcentre back\b|\bcenter back\b/g, 'POS')
    .replace(/\bleft\b|\bright\b/g, 'SIDE')
    .replace(/\b\d+:\d+\b/g, 'SCORE')
    .replace(/\b\d+['′]?\b/g, 'NUM')
    .replace(/[^a-z0-9:\s|+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(text) {
  return new Set(text.split(' ').filter((w) => w.length > 3));
}

function jaccard(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

const allGold = [];
for (const [posKey, rows] of Object.entries(goldSets)) {
  for (const s of rows) {
    allGold.push({
      id: s.id,
      position: posKey,
      abstract: abstractTeaching(s),
      tokens: tokenSet(abstractTeaching(s)),
      title: s.title?.en,
    });
  }
}

const crossPairs = [];
for (let i = 0; i < allGold.length; i++) {
  for (let j = i + 1; j < allGold.length; j++) {
    const a = allGold[i];
    const b = allGold[j];
    if (a.position === b.position) continue;
    const sim = jaccard(a.tokens, b.tokens);
    if (sim < 0.62) continue;
    // Stronger gate: shared optimal decision stem
    const aDec = a.abstract.split('||')[0] || '';
    const bDec = b.abstract.split('||')[0] || '';
    const decSim = jaccard(tokenSet(aDec), tokenSet(bDec));
    if (decSim < 0.55) continue;

    // Mirror pairs LW↔RW or LB↔RB are usually VALID POSITION VARIANT
    const mirror =
      (a.position === 'LW' && b.position === 'RW') ||
      (a.position === 'RW' && b.position === 'LW') ||
      (a.position === 'LB' && b.position === 'RB') ||
      (a.position === 'RB' && b.position === 'LB');

    let classification = 'RELATED BUT DISTINCT';
    let distinction = 'Different position geometry / role ownership likely changes cue or consequence.';
    if (mirror && sim >= 0.72) {
      classification = 'VALID POSITION VARIANT';
      distinction = 'Side-mirror pair; position geometry (side/hand/outlet) materially changes the scenario.';
    }
    if (!mirror && sim >= 0.78 && decSim >= 0.7) {
      classification = 'QUESTIONABLE DUPLICATE';
      distinction = 'High abstract overlap across non-mirror positions — human coach should confirm role distinction.';
    }
    // Confirmed semantic duplicate only if nearly identical abstract after side stripping
    if (sim >= 0.9 && decSim >= 0.85) {
      classification = 'SEMANTIC DUPLICATE';
      distinction = 'Abstract teaching nearly identical after stripping side/position labels.';
    }

    crossPairs.push({
      scenarioA: a.id,
      positionA: a.position,
      titleA: a.title,
      scenarioB: b.id,
      positionB: b.position,
      titleB: b.title,
      sharedTeaching: aDec.slice(0, 160),
      similarity: Number(sim.toFixed(3)),
      decisionSimilarity: Number(decSim.toFixed(3)),
      realPositionalDistinction: distinction,
      classification,
    });
  }
}

crossPairs.sort((a, b) => b.similarity - a.similarity);
const semanticDuplicates = crossPairs.filter((p) => p.classification === 'SEMANTIC DUPLICATE');
const questionableDuplicates = crossPairs.filter((p) => p.classification === 'QUESTIONABLE DUPLICATE');

// ─────────────────────────────────────────────
// PHASE 5 — language consistency
// ─────────────────────────────────────────────
const languageFindings = [];
const hrRoleTerms = [
  'lijevi vanjski',
  'desni vanjski',
  'srednji vanjski',
  'lijevo krilo',
  'desno krilo',
  'polubranitelj',
  'krilni branič',
  'istureni branič',
  'pivot',
  'preuzimanje',
  'odraz',
  'prodor',
  'dodavanje',
  'pasivna igra',
  'igrač više',
  'igrač manje',
];

const mtSmells =
  /nahraniti|fiksiraj|u hvatu|pokojni branič|centaršut|\btuljan\b|\bbrtva\b|power-?play|\bkeeper\b|\bskip pass\b/i;

for (const [posKey, rows] of Object.entries(goldSets)) {
  for (const s of rows) {
    const hr = `${s.title?.hr || ''} ${s.situation?.hr || ''} ${s.question?.hr || ''} ${(s.answers || [])
      .map((a) => a.text?.hr || '')
      .join(' ')}`;
    const en = `${s.title?.en || ''} ${s.situation?.en || ''}`;
    const de = `${s.title?.de || ''} ${s.situation?.de || ''}`;

    if (mtSmells.test(hr) || mtSmells.test(en) || mtSmells.test(de)) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'Possible MT / legacy coaching smell in player-facing text',
        sample: (hr + en).match(mtSmells)?.[0],
      });
    }

    // English position leakage into HR title
    if (/\b(Left|Right)\s+(Wing|Back)\b|\bCentre Back\b|\bCenter Back\b/.test(s.title?.hr || '')) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'English position label inside HR title',
      });
    }

    // Wrong Croatian self-label for wings/backs in title
    if (posKey === 'LW' && /\bDesno krilo\b/.test(s.title?.hr || '') && !/njihov/i.test(s.title?.hr || '')) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'HR title uses Desno krilo for LW self',
      });
    }
    if (posKey === 'RW' && /\bLijevo krilo\b/.test(s.title?.hr || '') && !/njihov/i.test(s.title?.hr || '')) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'HR title uses Lijevo krilo for RW self',
      });
    }
    if (posKey === 'LB' && /^Desni vanjski\b/i.test(s.title?.hr || '')) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'HR title starts as Desni vanjski for LB',
      });
    }
    if (posKey === 'RB' && /^Lijevi vanjski\b/i.test(s.title?.hr || '')) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'HR title starts as Lijevi vanjski for RB',
      });
    }

    // DE wrong wing labels in titles
    if (posKey === 'LW' && /^Rechtsaußen\b/.test(s.title?.de || '')) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'DE title starts Rechtsaußen for LW',
      });
    }
    if (posKey === 'RW' && /^Linksaußen\b/.test(s.title?.de || '')) {
      languageFindings.push({
        id: s.id,
        position: posKey,
        severity: 'MEANINGFUL',
        note: 'DE title starts Linksaußen for RW',
      });
    }
  }
}

// Term inventory (presence counts only — not a rewrite pass)
const hrTermInventory = {};
for (const term of hrRoleTerms) hrTermInventory[term] = 0;
for (const rows of Object.values(goldSets)) {
  for (const s of rows) {
    const hr = JSON.stringify({ t: s.title?.hr, s: s.situation?.hr, q: s.question?.hr, a: s.answers }).toLowerCase();
    for (const term of hrRoleTerms) {
      if (hr.includes(term)) hrTermInventory[term]++;
    }
  }
}

// ─────────────────────────────────────────────
// PHASE 6 — metadata integrity
// ─────────────────────────────────────────────
const DIFF = new Set(['Beginner', 'Intermediate', 'Advanced', 'Expert']);
const AOD = new Set(['Attack', 'Defence']);
const metadataIssues = [];
const globalIds = new Set();

for (const [posKey, rows] of Object.entries(goldSets)) {
  const families = new Map();
  for (const s of rows) {
    if (globalIds.has(s.id)) metadataIssues.push({ id: s.id, issue: 'duplicate ID across gold sets' });
    globalIds.add(s.id);

    if (s.primaryPosition !== POS[posKey].name) {
      metadataIssues.push({ id: s.id, issue: `primaryPosition ${s.primaryPosition} != ${POS[posKey].name}` });
    }
    if (!DIFF.has(s.difficulty)) metadataIssues.push({ id: s.id, issue: `invalid difficulty ${s.difficulty}` });
    if (!AOD.has(s.attackOrDefence)) metadataIssues.push({ id: s.id, issue: `invalid attackOrDefence ${s.attackOrDefence}` });
    if (!s.title?.en || !s.title?.hr || !s.title?.de) metadataIssues.push({ id: s.id, issue: 'missing title locale' });
    if (!s.situation?.en || !s.question?.en) metadataIssues.push({ id: s.id, issue: 'missing situation/question EN' });
    if (!Array.isArray(s.answers) || s.answers.length < 2) metadataIssues.push({ id: s.id, issue: 'answers incomplete' });
    if (!s.defensiveSystem) {
      // Optional in production schema for some transition / numerical / structure-action Gold rows.
      // Hard error only when text affirmatively sets the defence (against/in/vs system), not negations.
      const text = `${s.situation?.en || ''} ${s.title?.en || ''}`;
      const affirmativeSystem =
        /\b(against|vs\.?|in your|in their|into the|under)\s+(6:0|6-0|5:1|5-1|3:2:1|3-2-1|3:3|5\+1|4\+2|1:5|open)\b/i.test(
          text,
        ) || /\b(your|their)\s+(6:0|6-0|5:1|5-1)\b/i.test(text);
      metadataIssues.push({
        id: s.id,
        issue: affirmativeSystem
          ? 'defensiveSystem absent while situation affirmatively names the defence'
          : 'defensiveSystem absent (accepted optional on some approved Gold rows)',
        severity: affirmativeSystem ? 'error' : 'warning',
      });
    }

    const fk = familyKeyOf(s);
    if (posKey === 'LW' && !fk) metadataIssues.push({ id: s.id, issue: 'missing family: skillTag' });
    if (fk) {
      if (families.has(fk)) {
        metadataIssues.push({
          id: s.id,
          issue: `duplicate familyKey inside ${posKey}: ${fk} also ${families.get(fk)}`,
        });
      } else families.set(fk, s.id);
    }

    // attack/defence vs text contradiction (soft)
    const sitEn = (s.situation?.en || '').toLowerCase();
    if (s.attackOrDefence === 'Defence' && /\byou (catch|shoot|finish|take off)\b/i.test(sitEn) && !/defend|recover|cover|guard/i.test(sitEn)) {
      // only flag strong mismatch
      if (!/\bdefend|your \d|in your|recovery|turnover/i.test(sitEn)) {
        /* keep soft — many attack verbs appear in defence contexts */
      }
    }

    // perception tag vs content: if perception tagged, situation should have a live cue-ish verb
    const perc = perceptionOf(s, partsById);
    if (perc) {
      const cueish = /see|watch|read|hips|feet|eyes|arrive|late|early|turn|commit|shade|distance|within|meter|metre|cut|drive/i;
      if (!cueish.test(sitEn) && !cueish.test(s.question?.en || '')) {
        metadataIssues.push({
          id: s.id,
          issue: 'perception true/tag but situation/question lack obvious live-cue language',
          severity: 'warning',
        });
      }
    }
  }
}

const metadataErrors = metadataIssues.filter((m) => m.severity !== 'warning');
const metadataWarnings = metadataIssues.filter((m) => m.severity === 'warning');

// ─────────────────────────────────────────────
// PHASE 7 — distributions
// ─────────────────────────────────────────────
function distFor(posKey, rows) {
  const countBy = (fn) => {
    const o = {};
    for (const s of rows) {
      const k = fn(s);
      o[k] = (o[k] || 0) + 1;
    }
    return o;
  };
  return {
    count: rows.length,
    attack: rows.filter((s) => s.attackOrDefence === 'Attack').length,
    defence: rows.filter((s) => s.attackOrDefence === 'Defence').length,
    difficulty: countBy((s) => s.difficulty),
    perception: {
      true: rows.filter((s) => perceptionOf(s, partsById)).length,
      false: rows.filter((s) => !perceptionOf(s, partsById)).length,
    },
    handedness: countBy((s) => handednessOf(s, partsById)),
    systems: countBy((s) => s.defensiveSystem || 'unknown'),
    numerical: countBy((s) => numericalOf(s, partsById)),
  };
}

const distributions = Object.fromEntries(
  Object.entries(goldSets).map(([k, rows]) => [k, distFor(k, rows)]),
);

const totals = {
  count: Object.values(counts).reduce((a, b) => a + b, 0),
  attack: Object.values(distributions).reduce((a, d) => a + d.attack, 0),
  defence: Object.values(distributions).reduce((a, d) => a + d.defence, 0),
  difficulty: {},
  perception: { true: 0, false: 0 },
  systems: {},
  numerical: {},
};
for (const d of Object.values(distributions)) {
  for (const [k, v] of Object.entries(d.difficulty)) totals.difficulty[k] = (totals.difficulty[k] || 0) + v;
  totals.perception.true += d.perception.true;
  totals.perception.false += d.perception.false;
  for (const [k, v] of Object.entries(d.systems)) totals.systems[k] = (totals.systems[k] || 0) + v;
  for (const [k, v] of Object.entries(d.numerical)) totals.numerical[k] = (totals.numerical[k] || 0) + v;
}

// ─────────────────────────────────────────────
// PHASE 8 — validators
// ─────────────────────────────────────────────
function runValidator(cmd) {
  try {
    const out = execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { status: 'PASS', exitCode: 0, tail: out.trim().split('\n').slice(-8).join('\n') };
  } catch (e) {
    const out = `${e.stdout || ''}${e.stderr || ''}`;
    return { status: 'FAIL', exitCode: e.status ?? 1, tail: out.trim().split('\n').slice(-20).join('\n') };
  }
}

const validators = {
  typecheck: runValidator('npm run typecheck'),
  terminology: runValidator('npm run terminology:validate'),
  uniqueSession: runValidator('npm run validate:unique-session'),
  personalization: runValidator('npm run validate:position-personalization'),
  matchDayTactics: runValidator('npm run validate:match-day-tactics'),
  tacticalSystems: runValidator('npm run validate:tactical-systems'),
  noPositionFallback: runValidator('npm run validate:no-position-fallback'),
  archetypes: runValidator('npm run audit:archetypes'),
  leftBackGold: runValidator('npm run validate:left-back-gold-bank'),
  rightBackGold: runValidator('npm run validate:right-back-gold-bank'),
  centreBackGold: runValidator('npm run validate:centre-back-gold-bank'),
  rightWingGold: runValidator('npm run validate:right-wing-gold-bank'),
  leftWingGold: runValidator('node scripts/validate-left-wing-gold-bank.mjs'),
  mutatingScenarioQuality: { status: 'NOT_RUN', note: 'mutating audit:scenario-quality skipped by design' },
};

const validatorsPass = Object.entries(validators)
  .filter(([k]) => k !== 'mutatingScenarioQuality')
  .every(([, v]) => v.status === 'PASS');

// ─────────────────────────────────────────────
// PHASE 9 — legacy separation
// ─────────────────────────────────────────────
const goldIdSet = new Set(allGold.map((g) => g.id));
const byPosAll = {
  LB: bank.filter((s) => s.primaryPosition === 'Left Back'),
  RB: bank.filter((s) => s.primaryPosition === 'Right Back'),
  CB: bank.filter((s) => s.primaryPosition === 'Centre Back'),
  RW: bank.filter((s) => s.primaryPosition === 'Right Wing'),
  LW: bank.filter((s) => s.primaryPosition === 'Left Wing'),
};

const legacySeparation = {};
for (const posKey of Object.keys(POS)) {
  const all = byPosAll[posKey];
  const gold = goldSets[posKey];
  const goldIds = new Set(gold.map((s) => s.id));
  const legacy = all.filter((s) => !goldIds.has(s.id));
  legacySeparation[posKey] = {
    goldCount: gold.length,
    primaryTotal: all.length,
    legacyCount: legacy.length,
    legacyIdsSample: legacy.slice(0, 8).map((s) => s.id),
    safeToRemoveLater:
      posKey === 'LW'
        ? legacy.length > 0
          ? 'YES_AFTER_RUNTIME_CUTOVER — 40 legacy LW remain; remove only after session selectors use Gold IDs 941–981'
          : 'N/A'
        : legacy.length === 0
          ? 'N/A — entire primaryPosition set is approved Gold'
          : 'REVIEW — unexpected non-gold primary rows',
  };
}

const nonPositional = bank.filter(
  (s) =>
    !['Left Back', 'Right Back', 'Centre Back', 'Right Wing', 'Left Wing', 'Goalkeeper', 'Pivot'].includes(
      s.primaryPosition,
    ) && s.primaryPosition !== 'All',
);
const allCategory = bank.filter((s) => s.primaryPosition === 'All' || (s.category || '').toLowerCase() === 'all');

// Runtime references to legacy LW IDs / counts — scan later in phase 10

// ─────────────────────────────────────────────
// PHASE 10 — runtime dependency audit
// ─────────────────────────────────────────────
const runtimeFindings = [];

function rg(pattern, glob) {
  try {
    const cmd = `rg -n --glob '${glob}' ${JSON.stringify(pattern)} lib app context hooks constants types scripts/generate-scenario-bank.mjs 2>/dev/null | head -80`;
    const out = execSync(cmd, { cwd: root, encoding: 'utf8', shell: '/bin/zsh' });
    return out.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

const runtimeChecks = [
  { pattern: 'Left Wing.: 40', note: 'Hard-coded LW count 40 in generator' },
  { pattern: 'Left Wing.*59|lw.*59|LW.*59', note: 'Assumes LW 59' },
  { pattern: 'Left Wing.*60|lwCount.*60|LW.*= 60', note: 'Assumes LW 60' },
  { pattern: 'Right Wing.*70|RW.*70', note: 'Assumes RW 70' },
  { pattern: 'equal counts|same count|all positions have', note: 'Equal-count assumption language' },
  { pattern: 'scn_bank_98[2-9]|scn_bank_99', note: 'References LW IDs beyond approved Gold' },
];

// Focused file reads for known risks
const genBank = readFileSync(join(root, 'scripts/generate-scenario-bank.mjs'), 'utf8');
if (/Left Wing': 40/.test(genBank) || /'Left Wing': 40/.test(genBank)) {
  runtimeFindings.push({
    severity: 'INFO',
    file: 'scripts/generate-scenario-bank.mjs',
    note: "Generator still lists 'Left Wing': 40 — legacy build target, not runtime lock blocker if unused for Gold selection",
    blocksLock: false,
  });
}

// Search app/lib for count assumptions
const searchRoots = ['lib', 'app', 'context', 'hooks', 'constants'];
for (const dir of searchRoots) {
  const dirPath = join(root, dir);
  if (!existsSync(dirPath)) continue;
}

try {
  const hits = execSync(
    `rg -n -i "left wing.*\\b(40|50|59|60)\\b|\\blw\\b.*\\b(40|50|59|60)\\b|right wing.*\\b70\\b|equal.*(count|bank)|contiguous" lib app context hooks constants types --glob '!**/node_modules/**' 2>/dev/null | head -60`,
    { cwd: root, encoding: 'utf8', shell: '/bin/zsh' },
  )
    .trim()
    .split('\n')
    .filter(Boolean);
  for (const h of hits) {
    runtimeFindings.push({
      severity: 'REVIEW',
      file: h.split(':')[0],
      note: h,
      blocksLock: false,
    });
  }
} catch {
  /* no hits */
}

// Session selection / personalization references
try {
  const sel = execSync(
    `rg -n "primaryPosition|Left Wing|family:|scn_bank_" lib/scenario* lib/**/*scenario* lib/**/*personal* lib/**/*session* app/session* context/*Session* 2>/dev/null | head -80`,
    { cwd: root, encoding: 'utf8', shell: '/bin/zsh' },
  )
    .trim()
    .split('\n')
    .filter(Boolean);
  runtimeFindings.push({
    severity: 'INFO',
    note: `Scenario selection touchpoints sampled: ${sel.length} lines (see runtimeDependencySamples)`,
    samples: sel.slice(0, 25),
    blocksLock: false,
  });
} catch {
  runtimeFindings.push({
    severity: 'INFO',
    note: 'No dense scenario selection hits in sampled globs',
    blocksLock: false,
  });
}

// Immediate blockers: code that REQUIRES exact legacy LW count for production paths
const blockerPatterns = [
  { re: /LEFT_WING_COUNT\s*=\s*(40|50|59|60)/, note: 'Hard constant LW count' },
  { re: /assert.*Left Wing.*===?\s*(40|59|60)/, note: 'Assert LW exact count' },
  { re: /require.*65.*Right Wing.*70/, note: 'RW 70 requirement' },
];
for (const rel of ['lib', 'app', 'context']) {
  try {
    const files = execSync(`rg -l "Left Wing|LEFT_WING|lwCount" ${rel} --glob '*.ts' --glob '*.tsx' 2>/dev/null`, {
      cwd: root,
      encoding: 'utf8',
      shell: '/bin/zsh',
    })
      .trim()
      .split('\n')
      .filter(Boolean);
    for (const f of files.slice(0, 40)) {
      const txt = readFileSync(join(root, f), 'utf8');
      for (const bp of blockerPatterns) {
        if (bp.re.test(txt)) {
          runtimeFindings.push({ severity: 'BLOCKER', file: f, note: bp.note, blocksLock: true });
        }
      }
    }
  } catch {
    /* none */
  }
}

const runtimeBlockers = runtimeFindings.filter((f) => f.blocksLock);

// ─────────────────────────────────────────────
// PHASE 11/12 — verdict + artifacts
// ─────────────────────────────────────────────
const blockers = [];
if (countMismatches.length) blockers.push({ phase: 1, detail: countMismatches });
if (hashMismatches.length) blockers.push({ phase: 2, detail: hashMismatches });
if (lwSeedDrift.length) blockers.push({ phase: 2, detail: { lwSeedDrift } });
if (!lwIdChecks.range941to981Exact || !lwIdChecks.no982 || !lwIdChecks.noMissing) {
  blockers.push({ phase: 2, detail: lwIdChecks });
}
if (tacticalLeakage.length) blockers.push({ phase: 3, detail: tacticalLeakage });
if (semanticDuplicates.length) {
  // Material integrity: any confirmed semantic duplicate blocks
  blockers.push({ phase: 4, detail: semanticDuplicates });
}
if (metadataErrors.length) blockers.push({ phase: 6, detail: metadataErrors.slice(0, 50) });
if (!validatorsPass) {
  blockers.push({
    phase: 8,
    detail: Object.fromEntries(Object.entries(validators).filter(([, v]) => v.status === 'FAIL')),
  });
}
if (runtimeBlockers.length) blockers.push({ phase: 10, detail: runtimeBlockers });

const verdict =
  blockers.length === 0 ? 'ALL GOLD BANKS INTEGRATION LOCK READY' : 'FINAL GOLD INTEGRATION BLOCKED';

const positionStatus = {};
for (const k of Object.keys(POS)) {
  positionStatus[k] = {
    expected: expectedCounts[k],
    actual: counts[k],
    contentHash: contentHashes[k],
    hashStable:
      k === 'LW'
        ? lwSeedDrift.length === 0 && lwIdChecks.range941to981Exact
        : contentHashes[k] === expectedPosHashes[k],
    identityTactical: tacticalLeakage.filter((f) => f.position === k).length,
    metadataErrors: metadataErrors.filter((m) => goldSets[k].some((s) => s.id === m.id)).length,
    status:
      counts[k] === expectedCounts[k] &&
      (k === 'LW' ? lwSeedDrift.length === 0 : contentHashes[k] === expectedPosHashes[k]) &&
      tacticalLeakage.filter((f) => f.position === k).length === 0
        ? 'LOCK_READY'
        : 'BLOCKED',
  };
}

const manifest = {
  status: verdict,
  generatedAt: now,
  totalGoldCount: totals.count,
  expectedTotalGoldCount: 301,
  unequalPositionalCountsIntentional: true,
  lwCurriculumCompleteAt41: true,
  legacyCleanupHasNotOccurred: true,
  noDeploymentOccurred: true,
  noGoldScenarioModifiedInThisPass: true,
  positions: {
    LB: {
      position: 'Left Back',
      approvedCount: counts.LB,
      selectionRule: "primaryPosition === 'Left Back' (entire set is approved Gold)",
      scenarioIds: goldSets.LB.map((s) => s.id),
      contentHash: contentHashes.LB,
      timestamp: now,
      validator: validators.leftBackGold.status,
    },
    RB: {
      position: 'Right Back',
      approvedCount: counts.RB,
      selectionRule: "primaryPosition === 'Right Back' (entire set is approved Gold)",
      scenarioIds: goldSets.RB.map((s) => s.id),
      contentHash: contentHashes.RB,
      timestamp: now,
      validator: validators.rightBackGold.status,
    },
    CB: {
      position: 'Centre Back',
      approvedCount: counts.CB,
      selectionRule: "primaryPosition === 'Centre Back' (entire set is approved Gold)",
      scenarioIds: goldSets.CB.map((s) => s.id),
      contentHash: contentHashes.CB,
      timestamp: now,
      validator: validators.centreBackGold.status,
    },
    RW: {
      position: 'Right Wing',
      approvedCount: counts.RW,
      selectionRule: "primaryPosition === 'Right Wing' (entire set is approved Gold)",
      scenarioIds: goldSets.RW.map((s) => s.id),
      contentHash: contentHashes.RW,
      timestamp: now,
      validator: validators.rightWingGold.status,
      lockedRefsSnapshotDrift: rwLockedRefDrift.length,
    },
    LW: {
      position: 'Left Wing',
      approvedCount: counts.LW,
      selectionRule: 'scn_bank_941 through scn_bank_981 inclusive; primaryPosition Left Wing',
      scenarioIds: goldSets.LW.map((s) => s.id),
      contentHash: contentHashes.LW,
      seedHashLock: 'scripts/.lw-batch-c-gold-lock.json',
      timestamp: now,
      validator: validators.leftWingGold.status,
      curriculumVerdict: 'LW GOLD CURRICULUM COMPLETE AT 41',
      legacyStillPresent: legacySeparation.LW.legacyCount,
    },
  },
  validatorResults: Object.fromEntries(Object.entries(validators).map(([k, v]) => [k, v.status])),
};

const audit = {
  status: verdict,
  generatedAt: now,
  phase1_counts: { counts, expectedCounts, mismatches: countMismatches },
  phase2_hashes: {
    contentHashes,
    expectedPosHashes,
    hashMismatches,
    lwSeedDrift,
    lwIdChecks,
    rwLockedRefDriftCount: rwLockedRefDrift.length,
    rwLockedRefDrift: rwLockedRefDrift.slice(0, 20),
  },
  phase3_identity: {
    findings: identityFindings,
    tacticalCount: tacticalLeakage.length,
    cosmeticCount: identityFindings.filter((f) => f.classification === 'COSMETIC').length,
    noneMeansClean: identityFindings.length === 0,
  },
  phase4_crossDuplicates: {
    totalGoldCompared: allGold.length,
    pairsAboveThreshold: crossPairs.length,
    semanticDuplicates,
    questionableDuplicates: questionableDuplicates.slice(0, 40),
    sampleValidVariants: crossPairs.filter((p) => p.classification === 'VALID POSITION VARIANT').slice(0, 20),
    blocking: semanticDuplicates.length > 0,
  },
  phase5_language: {
    meaningfulFindings: languageFindings,
    hrTermInventory,
    result: languageFindings.length === 0 ? 'PASS_NO_MEANINGFUL_ISSUES' : 'FINDINGS_REPORTED_NON_BLOCKING_UNLESS_TACTICAL',
  },
  phase6_metadata: {
    errors: metadataErrors,
    warnings: metadataWarnings.slice(0, 40),
    pass: metadataErrors.length === 0,
  },
  phase7_distributions: { perPosition: distributions, totals },
  phase8_validators: validators,
  phase9_legacy: {
    perPosition: legacySeparation,
    nonPositionalOddPrimaryCount: nonPositional.length,
    allCategoryCount: allCategory.length,
    note: 'READ ONLY — no deletion performed',
  },
  phase10_runtime: {
    findings: runtimeFindings,
    blockers: runtimeBlockers,
    immediateBlockerToLockingGold: runtimeBlockers.length > 0,
  },
  blockers,
  positionStatus,
  statements: {
    totalGoldCount301: totals.count === 301,
    lwApprovedCount41: counts.LW === 41,
    unequalCountsIntentional: true,
    lwCurriculumCompleteAt41: true,
    legacyCleanupComplete: legacySeparation.LW.legacyCount === 0,
    noDeploymentOccurred: true,
    noGoldScenarioModifiedInThisPass: true,
  },
};

const finalLockManifestPath = join(root, 'scripts/gold-bank-final-lock-manifest.json');
// A lock manifest is immutable once created. Audits may verify it, never refresh timestamps or drop cleanup metadata.
if (!existsSync(finalLockManifestPath)) {
  writeFileSync(finalLockManifestPath, JSON.stringify(manifest, null, 2) + '\n');
}
writeFileSync(join(root, 'scripts/gold-bank-final-integration-audit.json'), JSON.stringify(audit, null, 2) + '\n');

const md = [];
md.push('# Final Gold Bank Integration Audit');
md.push('');
md.push(`**Verdict: ${verdict}**`);
md.push('');
md.push(`Generated: ${now}`);
md.push('');
md.push('## Position status');
md.push('');
md.push('| Pos | Expected | Actual | Hash stable | Identity tactical | Status |');
md.push('|---|---:|---:|---|---:|---|');
for (const k of ['LB', 'RB', 'CB', 'RW', 'LW']) {
  const s = positionStatus[k];
  md.push(`| ${k} | ${s.expected} | ${s.actual} | ${s.hashStable} | ${s.identityTactical} | ${s.status} |`);
}
md.push('');
md.push(`Total Gold: **${totals.count}** (expected 301)`);
md.push('');
md.push('## Cross-bank duplicates');
md.push('');
md.push(`Pairs above threshold: ${crossPairs.length}`);
md.push(`SEMANTIC DUPLICATE: ${semanticDuplicates.length}`);
md.push(`QUESTIONABLE DUPLICATE: ${questionableDuplicates.length}`);
if (semanticDuplicates.length) {
  md.push('');
  md.push('### Semantic duplicates');
  for (const p of semanticDuplicates) {
    md.push(`- ${p.scenarioA} (${p.positionA}) ↔ ${p.scenarioB} (${p.positionB}) sim=${p.similarity}`);
  }
}
md.push('');
md.push('## Language');
md.push('');
md.push(`Meaningful findings: ${languageFindings.length}`);
md.push('');
md.push('## Metadata');
md.push('');
md.push(`Errors: ${metadataErrors.length} · Warnings: ${metadataWarnings.length}`);
md.push('');
md.push('## Distributions');
md.push('');
md.push('```json');
md.push(JSON.stringify(distributions, null, 2));
md.push('```');
md.push('');
md.push('### Totals');
md.push('```json');
md.push(JSON.stringify(totals, null, 2));
md.push('```');
md.push('');
md.push('## Validators');
md.push('');
md.push('| Validator | Status |');
md.push('|---|---|');
for (const [k, v] of Object.entries(validators)) md.push(`| ${k} | ${v.status} |`);
md.push('');
md.push('## Legacy separation');
md.push('');
md.push('| Pos | Gold | Primary total | Legacy | Safe later? |');
md.push('|---|---:|---:|---:|---|');
for (const k of ['LB', 'RB', 'CB', 'RW', 'LW']) {
  const L = legacySeparation[k];
  md.push(`| ${k} | ${L.goldCount} | ${L.primaryTotal} | ${L.legacyCount} | ${L.safeToRemoveLater} |`);
}
md.push('');
md.push('## Runtime dependency');
md.push('');
md.push(`Findings: ${runtimeFindings.length} · Blockers: ${runtimeBlockers.length}`);
for (const f of runtimeFindings.slice(0, 30)) {
  md.push(`- [${f.severity}] ${f.file || ''} ${f.note}`);
}
md.push('');
md.push('## Statements');
md.push('');
md.push('- Unequal positional counts are intentional');
md.push('- LW curriculum is complete at 41');
md.push(`- Legacy cleanup is ${legacySeparation.LW.legacyCount === 0 ? 'complete' : 'not yet complete'}`);
md.push('- No deployment occurred');
md.push('- No Gold scenario was modified during this pass');
md.push('');
if (verdict === 'ALL GOLD BANKS INTEGRATION LOCK READY') {
  md.push('## GOLD BANKS LOCKED FOR CONTENT CHANGES');
  md.push('');
  md.push('Content lock only. Legacy cleanup / commit / tag / push / deploy NOT authorized by this audit.');
}
md.push('');
md.push('## STOP');
md.push('');
md.push('No scenario edits. No cleanup. No commit. No tag. No push. No deploy.');

writeFileSync(join(root, 'scripts/gold-bank-final-integration-audit.md'), md.join('\n') + '\n');

console.log(
  JSON.stringify(
    {
      verdict,
      counts,
      total: totals.count,
      hashMismatches: hashMismatches.length,
      lwSeedDrift: lwSeedDrift.length,
      tacticalLeakage: tacticalLeakage.length,
      semanticDuplicates: semanticDuplicates.length,
      questionableDuplicates: questionableDuplicates.length,
      languageFindings: languageFindings.length,
      metadataErrors: metadataErrors.length,
      validatorsPass,
      runtimeBlockers: runtimeBlockers.length,
      legacyLW: legacySeparation.LW.legacyCount,
    },
    null,
    2,
  ),
);

if (verdict !== 'ALL GOLD BANKS INTEGRATION LOCK READY') process.exit(2);
