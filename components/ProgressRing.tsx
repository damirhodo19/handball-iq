import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, SharedValue } from 'react-native-reanimated';
import { Colors } from '@/lib/theme';

const Svg = require('react-native-svg').default;
const Circle = require('react-native-svg').Circle;

interface ProgressRingProps {
  progress: number | SharedValue<number>;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 140,
  strokeWidth = 10,
  color = Colors.gold,
  trackColor = 'rgba(255,255,255,0.08)',
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const internalProgress = useSharedValue(0);

  const isSharedValue = typeof progress === 'object' && progress !== null && 'value' in progress;

  useEffect(() => {
    if (!isSharedValue && typeof progress === 'number') {
      internalProgress.value = withTiming(Math.max(0, Math.min(1, progress)), {
        duration: 1200,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [progress, internalProgress, isSharedValue]);

  const sourceValue = isSharedValue ? (progress as SharedValue<number>) : internalProgress;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - sourceValue.value * circumference,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.children}>{children}</View>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle) as any;

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  svg: { position: 'absolute' },
  children: { justifyContent: 'center', alignItems: 'center' },
});
