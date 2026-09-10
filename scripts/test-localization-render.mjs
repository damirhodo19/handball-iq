#!/usr/bin/env node
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRuntime } from './lib/localization-test-runtime.mjs';

// Render the real screen components with only native presentation primitives
// and external providers substituted. All text resolvers and bank adapters are real.
const Box = ({ children, label, title, subtitle }) => React.createElement('div', null, title, subtitle, label, children);
const Icon = () => null;
const animation = new Proxy({}, { get: () => () => animation });
let lang = 'en', profile, session, match, prep;
const r = createRuntime(process.cwd(), {
  'react-native': { View: Box, Text: Box, TextInput: Box, ScrollView: Box, TouchableOpacity: Box, StyleSheet: { create: x => x }, Platform: { OS: 'web' } },
  'react-native-reanimated': { __esModule: true, default: { View: Box }, FadeIn: animation, FadeInDown: animation, SlideInRight: animation, SlideOutLeft: animation, SlideInDown: animation },
  'lucide-react-native': new Proxy({}, { get: () => Icon }),
  'expo-linear-gradient': { LinearGradient: Box },
  'expo-router': { router: {}, useLocalSearchParams: () => ({}) },
  '@/hooks/useTranslation': { useTranslation: () => ({ lang, t: r.load('@/lib/locale-text').createTranslator(lang) }) },
  '@/hooks/useSyncedProfile': { useSyncedProfile: () => profile },
  '@/hooks/useActivePlayerPosition': { useActivePlayerPosition: () => ({ position: profile.position, positions: [profile.position], selectPosition() {} }) },
  '@/hooks/useDevelopment': { useDevelopment: () => ({ weeklyProgram: r.load('@/lib/development/weekly-program').getOrCreateWeeklyProgram(profile.position) }) },
  '@/context/MatchDayContext': { useMatchDay: () => prep },
  '@/context/SessionContext': { useSession: () => session },
  '@/context/MatchContext': { useMatch: () => match, HALFTIME_AFTER_INDEX: 6 },
  '@/components/Screen': { ScreenBackground: Box, ProgressBar: Icon },
  '@/components/Card': { Card: Box, PressableCard: Box },
  '@/components/Button': { Button: Box },
  '@/components/BackButton': { BackButton: Box },
  '@/components/ActivePositionSelector': { ActivePositionSelector: Icon },
});
const { getAllScenarios, toGKScenario, toMatchTemplate } = r.load('@/lib/scenario-bank');
const { getLocalizedSessionInfo } = r.load('@/lib/content-localize');
const bank = getAllScenarios();
const render = path => renderToStaticMarkup(React.createElement(r.load(path).default));
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
let renders = 0;
for (const position of Object.keys(r.load('@/lib/positions').POSITION_CONFIGS)) {
  profile = { ...r.load('@/lib/storage').loadProfile(), position, role: 'player', onboardingVersion: 2 };
  r.storage.setItem('hbiq_profile', JSON.stringify(profile));
  const source = bank.find(s => s.primaryPosition === position);
  const template = toMatchTemplate(source);
  session = { position, scenarios: [toGKScenario(source, 1)], currentScenarioIndex: 0, selectedIndex: 0, confirmed: true, isComplete: false };
  match = { situations: [{ ...template, index: 0, minute: 12, second: 30, scoreTeam: 7, scoreOpp: 6, formation: '5-1 aggressive defence', scenarioType: template.type, scenarioType_hr: template.type_hr, scenarioType_de: template.type_de, correctDecisionId: template.decisions[0].id }], answers: [{ situationIndex: 0, chosenDecisionId: template.decisions[0].id, isCorrect: true, quality: 'optimal', feedback: source.answers[0].feedback.en }], currentIndex: 0, phase: 'first-half' };
  prep = { activePrep: { id: 'test', setup: { position, goals: [], opponent: 'Test', matchType: 'League', location: 'Home', playingTime: 'Starter' } }, prepMode: 'complete', currentStep: 3, visualStep: 0, tacticalScenarios: [r.load('@/lib/scenario-bank').toTacticalScenario(source)], tacticalAnswers: [], personalStatement: 'default.statement' };
  const original = JSON.stringify({ session, match });
  for (lang of ['en', 'hr', 'de', 'en']) {
    const t = r.load('@/lib/locale-text').createTranslator(lang);
    const intro = render('@/app/session/index');
    assert.ok(intro.includes(escape(getLocalizedSessionInfo(lang, position).title)));
    const scenario = render('@/app/session/scenario');
    assert.ok(scenario.includes(escape(source.question[lang])));
    assert.ok(scenario.includes(escape(t('training.session01'))));
    const review = render('@/app/match/review');
    assert.ok(review.includes(escape(source.title[lang])));
    assert.ok(review.includes(escape(source.answers[0].feedback[lang])));
    const play = render('@/app/match/play');
    assert.ok(play.includes(escape(t('formation.aggressive51'))));
    const preparation = render('@/app/match-day/prepare');
    assert.ok(preparation.includes(escape(source.title[lang].toUpperCase())));
    const training = render('@/app/(tabs)/training');
    assert.ok(training.includes(escape(t('training.recommendedForYou'))));
    if (lang !== 'en') {
      assert.ok(!review.includes(escape(source.answers[0].feedback.en)), `${lang} English feedback`);
      assert.ok(!intro.includes(escape(getLocalizedSessionInfo('en', position).title)), `${lang} English title`);
      assert.ok(!training.includes('program.') && !training.includes('Position Skills'), `${lang} weekly focus`);
    }
    assert.equal(JSON.stringify({ session, match }), original, 'Switching language changed session state');
    renders += 6;
  }
}
console.log(`PASS: ${renders} actual screen renders, 7 positions, EN → HR → DE → EN, unchanged answers and IDs`);
