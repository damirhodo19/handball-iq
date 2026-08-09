import { test, expect, Page } from '@playwright/test';
import scenarios from '../content/scenario-bank/scenarios.json';

const SEEDED_IDS = [
  'scn_bank_169',
  'scn_bank_174',
  'scn_bank_409',
  'scn_bank_519',
  'scn_bank_629',
];

function scenarioFamilyId(titleEn: string): string {
  return (titleEn ?? '')
    .replace(/\s*\(\d+\)\s*$/, '')
    .toLowerCase()
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function familiesForIds(ids: string[]): string[] {
  const map = new Map(scenarios.map((s) => [s.id, s.title?.en ?? s.id]));
  return ids.map((id) => scenarioFamilyId(map.get(id) ?? id));
}

async function seed(page: Page, withActive: boolean) {
  await page.addInitScript(
    ({ ids, withActive: active }) => {
      window.localStorage.setItem(
        'hbiq_profile',
        JSON.stringify({
          name: 'Dup Test',
          role: 'player',
          position: 'Left Back',
          country: 'Croatia',
          dominantHand: 'Right',
          playingLevel: 'Senior',
          developmentGoal: 'Decision Making',
          onboardingVersion: 2,
          notificationsEnabled: true,
          firstName: 'D',
          lastName: 'T',
          secondaryPosition: null,
          age: '',
          ageGroup: null,
          club: '',
          experienceLevel: '',
        }),
      );
      window.localStorage.setItem('handball_iq_language', 'en');
      window.localStorage.setItem(
        'hbiq_settings',
        JSON.stringify({
          darkMode: false,
          theme: 'light',
          themeMigrated: true,
          language: 'English',
          dailyReminder: false,
          activeMode: 'player',
        }),
      );
      window.localStorage.removeItem('hbiq_session_intent');
      if (active) {
        window.localStorage.setItem(
          'hbiq_active_training_session',
          JSON.stringify({
            position: 'Left Back',
            bankIds: ids,
            startedAt: new Date().toISOString(),
          }),
        );
      } else {
        window.localStorage.removeItem('hbiq_active_training_session');
      }
    },
    { ids: SEEDED_IDS, withActive },
  );
}

test.describe('Unique scenarios within a training session', () => {
  test('new Left Back session persists unique bankIds', async ({ page }) => {
    await seed(page, false);
    await page.goto('/session');
    await page.waitForTimeout(3000);

    let active: { bankIds: string[] } | null = null;
    for (let i = 0; i < 20; i++) {
      active = await page.evaluate(() => {
        const raw = window.localStorage.getItem('hbiq_active_training_session');
        return raw ? JSON.parse(raw) : null;
      });
      if (active?.bankIds?.length) break;
      await page.waitForTimeout(200);
    }

    expect(active?.bankIds?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(new Set(active!.bankIds).size).toBe(active!.bankIds.length);

    const families = familiesForIds(active!.bankIds);
    expect(new Set(families).size).toBe(families.length);
    expect(families.some((f) => f.startsWith('goalkeeper'))).toBe(false);
  });

  test('resume restores the same active bankIds (no regenerate)', async ({ page }) => {
    await seed(page, true);
    await page.goto('/session');
    await page.waitForTimeout(2500);

    const active = await page.evaluate(() => {
      const raw = window.localStorage.getItem('hbiq_active_training_session');
      return raw ? JSON.parse(raw) : null;
    });
    expect(active?.bankIds).toEqual(SEEDED_IDS);

    // Stay in session stack — navigate to scenario and back to intro
    await page.goto('/session/scenario');
    await page.waitForTimeout(1000);
    await page.goto('/session');
    await page.waitForTimeout(1500);

    const after = await page.evaluate(() => {
      const raw = window.localStorage.getItem('hbiq_active_training_session');
      return raw ? JSON.parse(raw) : null;
    });
    expect(after?.bankIds).toEqual(SEEDED_IDS);
  });
});
