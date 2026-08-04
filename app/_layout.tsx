import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/lib/theme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { DevAuthProvider } from '@/context/DevAuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { MatchProvider } from '@/context/MatchContext';
import { MatchDayProvider } from '@/context/MatchDayContext';
import { migrateOldScenarios } from '@/lib/admin-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    migrateOldScenarios();
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <AuthProvider>
        <DevAuthProvider>
          <LanguageProvider>
            <SettingsProvider>
            <MatchProvider>
              <MatchDayProvider>
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="session" />
                  <Stack.Screen name="match" />
                  <Stack.Screen name="match-day" />
                  <Stack.Screen name="coach" />
                  <Stack.Screen name="coach-dashboard" />
                  <Stack.Screen name="admin" />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" />
              </MatchDayProvider>
            </MatchProvider>
            </SettingsProvider>
          </LanguageProvider>
        </DevAuthProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
