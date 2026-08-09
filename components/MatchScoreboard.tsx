import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';

interface MatchScoreboardProps {
  minute: number;
  second: number;
  scoreTeam: number;
  scoreOpp: number;
  halfLabel: string;
  teamLabel?: string;
  opponentLabel?: string;
  pressureLabel?: string;
  pressureColor?: string;
}

export function MatchScoreboard({
  minute,
  second,
  scoreTeam,
  scoreOpp,
  halfLabel,
  teamLabel = 'You',
  opponentLabel = 'Opp',
  pressureLabel,
  pressureColor = Colors.gold,
}: MatchScoreboardProps) {
  const clock = `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

  return (
    <LinearGradient
      colors={['rgba(212,175,55,0.16)', 'rgba(20,20,23,0.95)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.board}
      accessibilityRole="summary"
      accessibilityLabel={`${halfLabel}. Score ${scoreTeam} to ${scoreOpp}. Time ${clock}`}
    >
      <View style={styles.topRow}>
        <View style={styles.halfBadge}>
          <Text style={styles.halfText}>{halfLabel.toUpperCase()}</Text>
        </View>
        <View style={styles.clockWrap}>
          <Clock size={14} color={Colors.textTertiary} />
          <Text style={styles.clock}>{clock}</Text>
        </View>
        {pressureLabel ? (
          <View style={[styles.pressureBadge, { borderColor: pressureColor, backgroundColor: pressureColor + '22' }]}>
            <Text style={[styles.pressureText, { color: pressureColor }]}>{pressureLabel}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.teamCol}>
          <Text style={styles.teamLabel}>{teamLabel}</Text>
          <Text style={styles.score}>{scoreTeam}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.teamCol}>
          <Text style={styles.teamLabel}>{opponentLabel}</Text>
          <Text style={styles.score}>{scoreOpp}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  board: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.gold,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  halfBadge: {
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  halfText: { fontFamily: 'Inter-ExtraBold', fontSize: 10, color: Colors.gold, letterSpacing: 1.2 },
  clockWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clock: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary, letterSpacing: 1 },
  pressureBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1 },
  pressureText: { fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.5 },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  teamCol: { flex: 1, alignItems: 'center', gap: 4 },
  teamLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 0.8 },
  score: { fontFamily: 'Inter-ExtraBold', fontSize: 42, color: Colors.gold, lineHeight: 46 },
  divider: { width: 1, height: 56, backgroundColor: Colors.hairline, marginHorizontal: Spacing.md },
});
