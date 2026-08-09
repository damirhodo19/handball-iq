import { Stack } from 'expo-router';
import { Colors } from '@/lib/theme';
import { useTheme } from '@/context/ThemeContext';

export default function MatchDayLayout() {
  const { themeVersion } = useTheme();
  void themeVersion;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="setup" />
      <Stack.Screen name="prepare" />
      <Stack.Screen name="ready" />
      <Stack.Screen name="reflection" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
