import { Stack } from 'expo-router';
import { SessionProvider } from '@/context/SessionContext';
import { Colors } from '@/lib/theme';
import { useTheme } from '@/context/ThemeContext';

export default function SessionLayout() {
  const { themeVersion } = useTheme();
  void themeVersion;
  return (
    <SessionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="scenario" />
        <Stack.Screen name="results" />
        <Stack.Screen name="review" />
      </Stack>
    </SessionProvider>
  );
}
