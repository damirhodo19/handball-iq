import { ReactNode, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/lib/theme';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { DevAuthProvider } from '@/context/DevAuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ModeProvider } from '@/context/ModeContext';
import { MatchProvider } from '@/context/MatchContext';
import { MatchDayProvider } from '@/context/MatchDayContext';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { migrateOldScenarios } from '@/lib/admin-storage';
import { migrateLocalProfileToV2 } from '@/lib/platform/migrate-profile';
import { hydratePlatformStorage, getPersistenceMode, isNativePersistenceAvailable } from '@/lib/platform-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    migrateOldScenarios();
    hydratePlatformStorage()
      .then(() => {
        migrateLocalProfileToV2();
        if (__DEV__) {
          const mode = getPersistenceMode();
          const persistent = isNativePersistenceAvailable();
          console.log(
            `[Storage] persistence mode: ${mode}${persistent ? '' : ' (data will not survive restarts)'}`,
          );
        }
      })
      .finally(() => setStorageReady(true));
  }, []);

  // Web: ensure viewport-fit + dvh even when static `+html.tsx` is skipped (single output).
  useEffect(() => {
    if (typeof document === 'undefined') return;
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      document.head.appendChild(meta);
    }
    const content = meta.getAttribute('content') || '';
    if (!content.includes('viewport-fit=cover')) {
      meta.setAttribute(
        'content',
        content
          ? `${content}, viewport-fit=cover`
          : 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover',
      );
    }
    if (!document.getElementById('hbiq-web-viewport-fix')) {
      const style = document.createElement('style');
      style.id = 'hbiq-web-viewport-fix';
      style.textContent = 'html,body,#root{min-height:100%;min-height:100dvh;}';
      document.head.appendChild(style);
    }
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && storageReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, storageReady]);

  if ((!fontsLoaded && !fontError) || !storageReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaProvider>
        <AuthProvider>
          <DevAuthProvider>
            <LanguageProvider>
              <AppErrorBoundary>
                <SettingsProvider>
                  <ThemeProvider>
                    <ModeProvider>
                      <MatchProvider>
                        <MatchDayProvider>
                          <RootNavigation />
                        </MatchDayProvider>
                      </MatchProvider>
                    </ModeProvider>
                  </ThemeProvider>
                </SettingsProvider>
              </AppErrorBoundary>
            </LanguageProvider>
          </DevAuthProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigation() {
  const { scheme, themeVersion } = useTheme();
  return (
    <>
      <Stack
        key={themeVersion}
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session" />
        <Stack.Screen name="match" />
        <Stack.Screen name="match-day" />
        <Stack.Screen name="programs" />
        <Stack.Screen name="coach" />
        <Stack.Screen name="coach-tools" />
        <Stack.Screen name="coach-dashboard" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="team-calendar" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </>
  );
}
