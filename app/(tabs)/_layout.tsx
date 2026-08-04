import { Tabs } from 'expo-router';
import { Home, Brain, Calendar, BarChart3, User, Settings } from 'lucide-react-native';
import { Colors } from '@/lib/theme';
import { useTranslation } from '@/hooks/useTranslation';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.hairline,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: 6,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textQuaternary,
        tabBarLabelStyle: { fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.3 },
        tabBarIconStyle: { marginTop: 0 },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: t('tabs.home'), tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} /> }} />
      <Tabs.Screen name="training" options={{ title: t('tabs.train'), tabBarIcon: ({ color, size }) => <Brain color={color} size={size} strokeWidth={2} /> }} />
      <Tabs.Screen name="match-day" options={{ title: t('tabs.matchDay'), tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} strokeWidth={2} /> }} />
      <Tabs.Screen name="progress" options={{ title: t('tabs.match'), tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} strokeWidth={2} /> }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={2} /> }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.profile'), tabBarIcon: ({ color, size }) => <Settings color={color} size={size} strokeWidth={2} /> }} />
    </Tabs>
  );
}
