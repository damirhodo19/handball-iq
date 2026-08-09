import { loadProfile, saveProfile, loadSettings, saveSettings, UserProfile } from '@/lib/storage';
import type { AppRole, PlayingLevelId } from '@/lib/platform/types';
import {
  normalizeDefenseSystemId,
  normalizeAttackStyleId,
} from '@/lib/platform/tactical-systems';

const LEVEL_MAP: Record<string, PlayingLevelId> = {
  Beginner: 'Beginner',
  Amateur: 'Youth',
  Competitive: 'Junior',
  'Semi Professional': 'Senior',
  Professional: 'Professional',
  Youth: 'Youth',
  Junior: 'Junior',
  Senior: 'Senior',
};

const GOAL_MAP: Record<string, string> = {
  'Decision Making': 'Decision Making',
  'Tactical Understanding': 'Game Intelligence',
  'Mental Preparation': 'Mental Preparation',
  'Playing Under Pressure': 'Match Preparation',
  'Reading the Defence': 'Defence',
  'Position Specific Skills': 'Complete Development',
  'Game Intelligence': 'Game Intelligence',
  Defence: 'Defence',
  Attack: 'Attack',
  'Match Preparation': 'Match Preparation',
  Leadership: 'Leadership',
  'Complete Development': 'Complete Development',
};

/** Migrate local profile + settings to Handball IQ 2.0 Sprint 1 shape. Safe to run repeatedly. */
export function migrateLocalProfileToV2(): UserProfile {
  const profile = loadProfile();
  let changed = false;
  const next: UserProfile = { ...profile };

  if (!next.role) {
    next.role = 'player';
    changed = true;
  }

  if (next.playingLevel && LEVEL_MAP[next.playingLevel] && LEVEL_MAP[next.playingLevel] !== next.playingLevel) {
    next.playingLevel = LEVEL_MAP[next.playingLevel];
    changed = true;
  }

  if (next.developmentGoal && GOAL_MAP[next.developmentGoal]) {
    const mapped = GOAL_MAP[next.developmentGoal];
    if (mapped !== next.developmentGoal) {
      next.developmentGoal = mapped;
      changed = true;
    }
  }

  if (next.onboardingVersion == null) {
    // Existing users who finished old onboarding keep progress; mark incomplete for soft prompt
    const hadOldOnboarding = Boolean(next.position && next.dominantHand);
    next.onboardingVersion = hadOldOnboarding ? 1 : 0;
    changed = true;
  }

  // Canonical defence / attack preference IDs (legacy colon/EN labels → def_* / att_*)
  if (next.favoriteDefense != null) {
    const mapped = normalizeDefenseSystemId(next.favoriteDefense);
    if (mapped && mapped !== next.favoriteDefense) {
      next.favoriteDefense = mapped;
      changed = true;
    }
  }
  if (next.favoriteAttack != null) {
    const mapped = normalizeAttackStyleId(next.favoriteAttack);
    if (mapped && mapped !== next.favoriteAttack) {
      next.favoriteAttack = mapped;
      changed = true;
    }
  }

  if (changed) saveProfile(next);

  const settings = loadSettings();
  if (!settings.themeMigrated) {
    saveSettings({
      ...settings,
      theme: settings.darkMode ? 'dark' : 'light',
      themeMigrated: true,
      // Sprint 1: new installs default light; existing darkMode users keep dark
      darkMode: settings.darkMode,
    });
  }

  return next;
}

export function isProfileCompleteV2(profile: UserProfile): boolean {
  if ((profile.onboardingVersion ?? 0) >= 2) {
    if (profile.role === 'player') {
      return Boolean(profile.position && profile.playingLevel && profile.developmentGoal && profile.country);
    }
    if (profile.role === 'coach') {
      return Boolean(profile.coachType && profile.experienceBand && profile.favoriteDefense && profile.country);
    }
    if (profile.role === 'player_coach') {
      return Boolean(
        profile.position &&
        profile.coachType &&
        profile.country,
      );
    }
  }
  return false;
}

export function defaultRoleFromLegacy(role: string | null | undefined): AppRole {
  if (role === 'coach') return 'coach';
  if (role === 'admin') return 'admin';
  if (role === 'player_coach') return 'player_coach';
  return 'player';
}
