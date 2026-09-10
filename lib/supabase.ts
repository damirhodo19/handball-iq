import 'react-native-url-polyfill/auto';
import { observeRecoveryEvent } from '@/lib/password-recovery';
import { Platform } from 'react-native';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseAuthStorage } from '@/lib/async-storage-safe';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
      'The app will continue using local storage. Add these to your .env file to enable cloud sync.',
  );
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        // Web: Supabase defaults to localStorage. Native: custom adapter with safe fallback.
        storage: Platform.OS === 'web' ? undefined : createSupabaseAuthStorage(),
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: Platform.OS === 'web',
        flowType: 'pkce',
      },
    })
  : null;

// Register before auth initialization completes so recovery cannot be missed.
supabase?.auth.onAuthStateChange(observeRecoveryEvent);
