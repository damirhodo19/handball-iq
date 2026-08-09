import { Stack } from 'expo-router';
import { Colors } from '@/lib/theme';
import { useTheme } from '@/context/ThemeContext';

export default function CoachLayout() {
  const { themeVersion } = useTheme();
  void themeVersion;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="report" />
      <Stack.Screen name="weekly" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="type" />
      <Stack.Screen name="progress" />
      <Stack.Screen name="goals" />
    </Stack>
  );
}
