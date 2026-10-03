#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createRuntime } from './lib/localization-test-runtime.mjs';
const {load} = createRuntime();
const bank = load('@/lib/scenario-bank');
const positions = Object.keys(load('@/lib/positions').POSITION_CONFIGS);
const {getLocalizedSessionInfo} = load('@/lib/content-localize');
const {DEFAULT_SESSION_LENGTH} = load('@/lib/development/session-config');
assert.equal(load('@/lib/development/load').computeDevelopmentLoad().scenarioCount, DEFAULT_SESSION_LENGTH);
for (const position of [...positions, null]) {
  for (const lang of ['en','hr','de']) {
    const t = load('@/lib/locale-text').createTranslator(lang);
    for (const count of [3,4,5]) {
      const info = getLocalizedSessionInfo(lang,position,count);
      assert.equal(info.structure[0],t('training.scenariosCount',{n:count}));
      if (position !== 'Goalkeeper') assert.equal(info.instruction,t('training.fieldPlayerInstruction'));
    }
  }
}
for (const source of bank.getAllScenarios()) {
  const a=bank.toGKScenario(source,1), b=bank.toGKScenario(source,1);
  assert.equal(a.time,`${source.minute}′`);
  assert.equal(a.time,b.time,'Training clock must not invent seconds');
  const match=source.situation.hr.match(/\b(Vodite|Gubite|Neriješeno je)\s+(\d+)[:–-](\d+)/i);
  if(match){const [,word,left,right]=match; const delta=Number(left)-Number(right);
    assert.ok(word.toLowerCase()==='vodite'?delta>0:word.toLowerCase()==='gubite'?delta<0:delta===0,source.id);
  }
  for(const answer of source.answers) assert.ok(!answer.text.hr.includes('sat za napad'),source.id);
}
console.log('PASS: session counts and position instructions in EN/HR/DE; deterministic minute display; Croatian score wording');
