import { Tabs } from 'expo-router';
import { Home, Brain, Calendar, BarChart3, User, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/lib/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { useMode } from '@/context/ModeContext';
import { useTheme } from '@/context/ThemeContext';
import { useBottomSafeInset, useTabBarHeight } from '@/lib/layout';

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomInset = useBottomSafeInset();
  const tabBarHeight = useTabBarHeight();
  const { isCoachMode } = useMode();
  const { themeVersion } = useTheme();
  void themeVersion;
  void insets;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.hairline,
          borderTopWidth: 1,
          // Total height = content row + safe inset (matches useTabBarHeight).
          height: tabBarHeight,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textQuaternary,
        tabBarLabelStyle: { fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.3 },
        tabBarIconStyle: { marginTop: 0 },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ title: t('tabs.home'), tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2} /> }} />
      <Tabs.Screen
        name="training"
        options={{
          title: t('tabs.train'),
          href: isCoachMode ? null : undefined,
          tabBarIcon: ({ color, size }) => <Brain color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="match-day"
        options={{
          title: t('tabs.matchDay'),
          href: isCoachMode ? null : undefined,
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('tabs.progress'),
          href: isCoachMode ? null : undefined,
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={2} /> }} />
      <Tabs.Screen name="settings" options={{ title: t('tabs.settings'), tabBarIcon: ({ color, size }) => <Settings color={color} size={size} strokeWidth={2} /> }} />
    </Tabs>
  );
}
