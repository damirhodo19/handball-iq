#!/usr/bin/env node
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRuntime } from './lib/localization-test-runtime.mjs';
const Box = ({children, label, title}) => React.createElement('div', null, title, label, children);
const Icon = () => null;
const animation = new Proxy({}, { get: () => () => animation });
let lang = 'en';
const r = createRuntime(process.cwd(), {
  'react-native': { View: Box, Text: Box, ScrollView: Box, TouchableOpacity: Box, StyleSheet: { create: x => x }, Platform: { OS: 'web' } },
  'react-native-reanimated': { __esModule: true, default: { View: Box }, FadeIn: animation, FadeInDown: animation },
  'lucide-react-native': new Proxy({}, { get: () => Icon }),
  'expo-router': { router: {}, useFocusEffect() {} },
  '@/hooks/useTranslation': { useTranslation: () => ({lang, t: r.load('@/lib/locale-text').createTranslator(lang)}) },
  '@/hooks/useSignOut': { useSignOut: () => () => {} },
  '@/components/Screen': { ScreenBackground: Box },
  '@/components/Card': { Card: Box },
  '@/components/Button': { Button: Box },
  '@/components/BackButton': { BackButton: Icon },
});
const admin = r.load('@/lib/admin-storage');
admin.migrateOldScenarios();
admin.createScenario({title:'Custom draft', title_hr:'Prilagođeni nacrt', title_de:'Eigener Entwurf', position:'Right Wing', category:'Wing Shots'});
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
for (lang of ['en','hr','de','en']) {
  const t = r.load('@/lib/locale-text').createTranslator(lang);
  for (const screen of ['dashboard','statistics']) {
    const html = renderToStaticMarkup(React.createElement(r.load(`@/app/admin/${screen}`).default));
    assert.ok(html.includes(escape(t('position.rightWing'))), `${screen}: ${lang} position`);
    assert.ok(html.includes(escape(t('category.wingShots'))), `${screen}: ${lang} category`);
    assert.ok(!html.includes('No scenarios for Right Wing'));
    if (screen === 'dashboard') {
      assert.ok(html.includes(escape(t('admin.recentlyEdited'))));
      assert.ok(html.includes(escape(lang === 'hr' ? 'Prilagođeni nacrt' : lang === 'de' ? 'Eigener Entwurf' : 'Custom draft')));
    }
    if (lang !== 'en') assert.ok(!html.includes('>Right Wing<') && !html.includes('>Wing Shots<'));
  }
}
console.log('PASS: 8 admin screen renders; EN/HR/DE headings, categories, positions and recent localized titles');
