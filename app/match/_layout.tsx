import { Stack } from 'expo-router';
import { Colors } from '@/lib/theme';
import { useTheme } from '@/context/ThemeContext';

export default function MatchLayout() {
  const { themeVersion } = useTheme();
  void themeVersion;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="play" />
      <Stack.Screen name="report" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
