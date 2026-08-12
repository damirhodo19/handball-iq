import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { HandballPosition } from '@/lib/positions';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition } from '@/lib/translations';

interface ActivePositionSelectorProps {
  positions: HandballPosition[];
  activePosition: HandballPosition | null;
  onSelect: (position: HandballPosition) => void;
  compact?: boolean;
}

export function ActivePositionSelector({
  positions,
  activePosition,
  onSelect,
  compact = false,
}: ActivePositionSelectorProps) {
  const { t } = useTranslation();
  if (positions.length === 0) return null;

  return (
    <View style={[styles.container, compact && styles.containerCompact]} testID="active-position-selector">
      <Text style={styles.label}>{t('position.activeLabel')}</Text>
      <View style={styles.row}>
        {positions.map((position) => {
          const active = position === activePosition;
          return (
            <TouchableOpacity
              key={position}
              testID={`active-position-${position.toLowerCase().replace(/\s+/g, '-')}`}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(position)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {translatePosition(position, t)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!compact ? <Text style={styles.hint}>{t('position.activeHint')}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerCompact: {
    paddingVertical: Spacing.sm,
  },
  label: {
    ...Typography.micro,
    color: Colors.gold,
    letterSpacing: 1.2,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  chipText: {
    color: Colors.textSecondary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  chipTextActive: {
    color: Colors.background,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
