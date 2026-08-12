import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { loadSettings, loadProfile, saveSettings, saveProfile, type AppSettings, type UserProfile } from '@/lib/storage';
import { upsertProfile } from '@/services/profileService';
import type { Profile } from '@/types/database';
import { normalizeHandballPosition } from '@/lib/platform/resolve-position';
import {
  normalizeAttackStyleId,
  normalizeDefenseSystemId,
} from '@/lib/platform/tactical-systems';
import {
  resolveActivePlayerPosition,
  setActivePlayerPosition,
} from '@/lib/platform/active-player-position';

export interface UserPreferencesRow {
  user_id: string;
  notifications_enabled: boolean | null;
  daily_reminder_time: string | null;
  active_mode: 'player' | 'coach' | null;
  active_player_position?: string | null;
  onboarding_version: number | null;
  created_at?: string;
  updated_at?: string;
}

function languageToCode(lang: AppSettings['language']): string {
  if (lang === 'German') return 'de';
  if (lang === 'Croatian') return 'hr';
  return 'en';
}

function codeToLanguage(code: string | null | undefined): AppSettings['language'] {
  if (code === 'de') return 'German';
  if (code === 'hr') return 'Croatian';
  return 'English';
}

/** Push local settings + coach/profile preference fields to Supabase. */
export async function syncPreferencesToCloud(userId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };

  const settings = loadSettings();
  const profile = loadProfile();

  const profilePatch: Partial<Profile> & { id: string } = {
    id: userId,
    role: (profile.role as Profile['role']) ?? 'player',
    coach_type: profile.coachType ?? null,
    experience_band: profile.experienceBand ?? null,
    favorite_defense:
      normalizeDefenseSystemId(profile.favoriteDefense) ?? profile.favoriteDefense ?? null,
    favorite_attack:
      normalizeAttackStyleId(profile.favoriteAttack) ?? profile.favoriteAttack ?? null,
    preferred_language: languageToCode(settings.language),
    theme: settings.theme,
    country: profile.country || null,
    onboarding_version: Math.max(Number(profile.onboardingVersion) || 0, 0),
    development_goal: profile.developmentGoal ?? profile.coachDevelopmentGoal ?? null,
    development_goals: profile.developmentGoals.length ? profile.developmentGoals : null,
    coach_development_goal: profile.coachDevelopmentGoal ?? null,
    coach_development_goals: profile.coachDevelopmentGoals.length ? profile.coachDevelopmentGoals : null,
    primary_position: profile.position || null,
    secondary_position: profile.secondaryPosition || null,
    dominant_hand: profile.dominantHand || null,
    playing_level: profile.playingLevel ?? null,
    club: profile.club || null,
  };

  let { error: profileError } = await upsertProfile(profilePatch);
  if (profileError) {
    const {
      development_goals: _developmentGoals,
      coach_development_goals: _coachDevelopmentGoals,
      ...legacyProfilePatch
    } = profilePatch;
    ({ error: profileError } = await upsertProfile(legacyProfilePatch));
  }
  if (profileError) return { error: profileError };

  const prefs: UserPreferencesRow = {
    user_id: userId,
    notifications_enabled: profile.notificationsEnabled ?? true,
    daily_reminder_time: null,
    active_mode: settings.activeMode,
    active_player_position: resolveActivePlayerPosition(profile),
    onboarding_version: profile.onboardingVersion ?? 2,
    updated_at: new Date().toISOString(),
  };

  let { error } = await supabase.from('user_preferences').upsert(prefs);
  if (error) {
    const { active_player_position: _activePlayerPosition, ...legacyPrefs } = prefs;
    ({ error } = await supabase.from('user_preferences').upsert(legacyPrefs));
  }
  return { error: error?.message ?? null };
}

/** Pull preferences from cloud into local storage. */
export async function pullPreferencesFromCloud(userId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !supabase) return { error: 'Supabase not configured.' };

  try {
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (pErr) return { error: pErr.message };

    const { data: prefs, error: prefErr } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (prefErr) return { error: prefErr.message };

    const localProfile = loadProfile();
    const localSettings = loadSettings();

    if (profile) {
      const p = profile as Profile;
      const next: UserProfile = {
        ...localProfile,
        role: p.role ?? localProfile.role,
        position:
          normalizeHandballPosition(p.primary_position) ??
          normalizeHandballPosition(p.position) ??
          normalizeHandballPosition(localProfile.position) ??
          localProfile.position,
        secondaryPosition: p.secondary_position ?? localProfile.secondaryPosition,
        dominantHand: p.dominant_hand ?? localProfile.dominantHand,
        playingLevel: p.playing_level ?? localProfile.playingLevel,
        country: p.country ?? localProfile.country,
        club: p.club ?? localProfile.club,
        developmentGoal: p.development_goals?.[0] ?? p.development_goal ?? localProfile.developmentGoal,
        developmentGoals: p.development_goals?.length
          ? p.development_goals.slice(0, 3)
          : p.development_goal ? [p.development_goal] : localProfile.developmentGoals,
        coachType: p.coach_type ?? localProfile.coachType,
        coachDevelopmentGoal:
          p.coach_development_goals?.[0] ?? p.coach_development_goal ?? localProfile.coachDevelopmentGoal,
        coachDevelopmentGoals: p.coach_development_goals?.length
          ? p.coach_development_goals.slice(0, 3)
          : p.coach_development_goal ? [p.coach_development_goal] : localProfile.coachDevelopmentGoals,
        experienceBand: p.experience_band ?? localProfile.experienceBand,
        favoriteDefense:
          normalizeDefenseSystemId(p.favorite_defense) ??
          normalizeDefenseSystemId(localProfile.favoriteDefense) ??
          localProfile.favoriteDefense,
        favoriteAttack:
          normalizeAttackStyleId(p.favorite_attack) ??
          normalizeAttackStyleId(localProfile.favoriteAttack) ??
          localProfile.favoriteAttack,
        // Never downgrade a completed V2 profile because of stale/default cloud 0
        onboardingVersion: Math.max(
          Number(p.onboarding_version) || 0,
          Number(localProfile.onboardingVersion) || 0,
          p.onboarded ? 2 : 0,
        ),
      };
      saveProfile(next);

      const nextSettings: AppSettings = {
        ...localSettings,
        theme: (p.theme as AppSettings['theme']) || localSettings.theme,
        language: p.preferred_language
          ? codeToLanguage(p.preferred_language)
          : localSettings.language,
        themeMigrated: true,
      };
      if (prefs?.active_mode === 'player' || prefs?.active_mode === 'coach') {
        nextSettings.activeMode = prefs.active_mode;
      }
      if (typeof prefs?.notifications_enabled === 'boolean') {
        next.notificationsEnabled = prefs.notifications_enabled;
        saveProfile(next);
      }
      if (prefs?.active_player_position) {
        setActivePlayerPosition(next, prefs.active_player_position);
      }
      saveSettings(nextSettings);
    }

    return { error: null };
  } catch (e: any) {
    return { error: e.message ?? 'Failed to pull preferences.' };
  }
}
