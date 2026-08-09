import { Stack } from 'expo-router';
import { Colors } from '@/lib/theme';
import { useTheme } from '@/context/ThemeContext';

export default function CoachToolsLayout() {
  const { themeVersion } = useTheme();
  void themeVersion;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="challenge" />
      <Stack.Screen name="planner" />
      <Stack.Screen name="analysis" />
    </Stack>
  );
}
