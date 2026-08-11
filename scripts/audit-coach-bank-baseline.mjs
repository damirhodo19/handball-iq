#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceFiles = [
  ['lib/coach-platform/challenges.ts', 'COACH_CHALLENGES_BASE'],
  ['lib/coach-platform/challenges-extra.ts', 'COACH_CHALLENGES_EXTRA'],
];
const hash = (value) => createHash('sha256').update(value).digest('hex');

function evaluate(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(evaluate);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(node.properties.map((property) => {
      if (!ts.isPropertyAssignment(property)) throw new Error(`Unsupported property: ${property.getText()}`);
      const key = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)
        ? property.name.text
        : property.name.getText();
      return [key, evaluate(property.initializer)];
    }));
  }
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'L') {
    const [en, hr, de] = node.arguments.map(evaluate);
    return { en, hr, de };
  }
  throw new Error(`Unsupported syntax: ${node.getText()}`);
}

function extractArray(relativePath, variableName) {
  const text = readFileSync(join(root, relativePath), 'utf8');
  const source = ts.createSourceFile(relativePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let initializer;
  source.forEachChild(function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === variableName) {
      initializer = node.initializer;
    }
    node.forEachChild(visit);
  });
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) throw new Error(`Missing ${variableName}`);
  return { text, rows: evaluate(initializer) };
}

const extracted = sourceFiles.map(([file, variable]) => ({ file, ...extractArray(file, variable) }));
const rows = extracted.flatMap(({ rows: fileRows }) => fileRows);
const by = (key) => rows.reduce((acc, row) => ({ ...acc, [row[key]]: (acc[row[key]] || 0) + 1 }), {});
const ids = new Map();
for (const row of rows) ids.set(row.id, [...(ids.get(row.id) || []), row.category]);
const duplicateIds = [...ids].filter(([, categories]) => categories.length > 1).map(([id, categories]) => ({ id, categories }));

const localeErrors = [];
const answerLadderErrors = [];
const languageFindings = [];
const smell = /\b(cue|reset|outlet|head coach|LB|RB|constraint|match-specific|session|timing|performance|startera?)\b/gi;
for (const row of rows) {
  const localized = [
    ['situation', row.situation],
    ['question', row.question],
    ['explanation', row.explanation],
    ...row.answers.flatMap((answer, index) => [
      [`answers.${index}.text`, answer.text],
      [`answers.${index}.feedback`, answer.feedback],
    ]),
  ];
  for (const [field, value] of localized) {
    for (const locale of ['en', 'hr', 'de']) {
      if (!value?.[locale]?.trim()) localeErrors.push({ id: row.id, field, locale });
    }
    const hits = value?.hr?.match(smell) || [];
    if (hits.length) languageFindings.push({ id: row.id, field, hits: [...new Set(hits.map((hit) => hit.toLowerCase()))] });
  }
  const qualities = row.answers.map(({ quality }) => quality).join(',');
  if (qualities !== 'optimal,good,risky,poor') answerLadderErrors.push({ id: row.id, qualities });
}

const normalized = (text) => String(text).toLowerCase().normalize('NFKD').replace(/[^a-z0-9čćžšđäöüß\s]/gi, ' ').replace(/\s+/g, ' ').trim();
const decisionKeys = new Map();
for (const row of rows) {
  const optimal = row.answers.find(({ quality }) => quality === 'optimal');
  const key = `${normalized(row.question.en)}|${normalized(optimal?.text?.en)}`;
  decisionKeys.set(key, [...(decisionKeys.get(key) || []), row.id]);
}
const duplicateDecisions = [...decisionKeys].filter(([, rowIds]) => rowIds.length > 1).map(([, rowIds]) => rowIds);

const report = {
  status: 'COACH LEGACY BASELINE AUDITED — REBUILD REQUIRED',
  generatedAt: new Date().toISOString(),
  count: rows.length,
  uniqueIds: ids.size,
  sourceHashes: Object.fromEntries(extracted.map(({ file, text }) => [file, hash(text)])),
  categoryCounts: by('category'),
  difficultyCounts: by('difficulty'),
  coachTypeCounts: Object.fromEntries([...new Set(rows.flatMap(({ coachTypeTags }) => coachTypeTags))].map((tag) => [tag, rows.filter(({ coachTypeTags }) => coachTypeTags.includes(tag)).length])),
  duplicateIds,
  duplicateDecisions,
  localeErrors,
  answerLadderErrors,
  languageFindings,
  conclusion: {
    runtimeCutoverNow: false,
    target: 70,
    targetPerCategory: 10,
    reason: 'The active bank is too small, has a duplicate runtime ID, inconsistent answer ordering, and non-native Croatian coaching language.',
  },
};

writeFileSync(join(root, 'scripts/coach-bank-baseline-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
const md = [
  '# Coach bank — početni audit', '',
  `Status: **${report.status}**`, '',
  `Aktivno: ${report.count} zapisa · jedinstveni ID-jevi: ${report.uniqueIds}`, '',
  `Duplikati ID-ja: ${duplicateIds.map(({ id }) => id).join(', ') || 'nema'}`,
  `Neispravan redoslijed kvalitete odgovora: ${answerLadderErrors.length}`,
  `HR nalazi strojnih/engleskih izraza: ${languageFindings.length}`,
  `Točni duplikati odluke: ${duplicateDecisions.length}`, '',
  'Zaključak: postojeći Coach bank ostaje samo legacy izvor do potpunog Gold cutovera. Cilj novog banka je 70 scenarija, po 10 u svakoj od 7 kategorija.', '',
];
writeFileSync(join(root, 'scripts/coach-bank-baseline-audit.md'), `${md.join('\n')}\n`);
console.log(JSON.stringify({
  status: report.status,
  count: report.count,
  uniqueIds: report.uniqueIds,
  duplicateIds: report.duplicateIds.length,
  answerLadderErrors: report.answerLadderErrors.length,
  languageFindings: report.languageFindings.length,
  duplicateDecisions: report.duplicateDecisions.length,
}, null, 2));
