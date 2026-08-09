import { useEffect } from 'react';
import { router } from 'expo-router';

/** Legacy route — admin access requires Supabase auth, not a separate login screen. */
export default function AdminLoginRedirect() {
  useEffect(() => {
    router.replace('/(auth)/login');
  }, []);

  return null;
}
