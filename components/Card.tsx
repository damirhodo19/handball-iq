import { ReactNode } from 'react';
import { View, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadows, Spacing } from '@/lib/theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'raised' | 'gradient';
  padding?: number;
  shadow?: 'card' | 'cardLg' | 'gold' | 'float' | 'none';
}

export function Card({ children, style, variant = 'default', padding = 20, shadow = 'card' }: CardProps) {
  const bg = {
    default: Colors.surface,
    elevated: Colors.surfaceElevated,
    raised: Colors.surfaceRaised,
    gradient: Colors.surface,
  }[variant];

  const shadowStyle = shadow === 'none' ? {} : Shadows[shadow];

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={Colors.surfaceGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[{ backgroundColor: bg, borderRadius: Radius.lg, padding, borderWidth: 1, borderColor: Colors.border }, shadowStyle, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[{ backgroundColor: bg, borderRadius: Radius.lg, padding, borderWidth: 1, borderColor: Colors.border }, shadowStyle, style]}>
      {children}
    </View>
  );
}

interface PressableCardProps extends CardProps {
  onPress: () => void;
  pressedScale?: number;
  testID?: string;
}

export function PressableCard({
  children,
  onPress,
  pressedScale = 0.97,
  style,
  variant = 'default',
  padding = 20,
  shadow = 'card',
  testID,
}: PressableCardProps) {
  const bg = {
    default: Colors.surface,
    elevated: Colors.surfaceElevated,
    raised: Colors.surfaceRaised,
    gradient: Colors.surface,
  }[variant];
  const shadowStyle = shadow === 'none' ? {} : Shadows[shadow];

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderRadius: Radius.lg,
          padding,
          borderWidth: 1,
          borderColor: Colors.border,
          maxWidth: '100%',
          alignSelf: 'stretch',
        },
        shadowStyle,
        pressed && { transform: [{ scale: pressedScale }], opacity: 0.95 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
