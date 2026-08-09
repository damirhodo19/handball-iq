import { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Building2, Plus, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { localFetchClubs, localFetchTeams } from '@/lib/team-platform/storage';
import type { Club, TeamRecord } from '@/lib/team-platform/types';

export default function ClubsScreen() {
  const { t } = useTranslation();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [teams, setTeams] = useState<TeamRecord[]>([]);

  useFocusEffect(useCallback(() => {
    setClubs(localFetchClubs());
    setTeams(localFetchTeams());
  }, []));

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('team.clubs')}</Text>
            <Text style={styles.headerSub}>{t('team.clubsSub')}</Text>
          </View>
        </View>

        <Button label={t('team.createTeam')} onPress={() => router.push('/coach-dashboard/create-team')} iconRight={<Plus size={18} color={Colors.background} />} />

        {clubs.map((club) => (
          <Card key={club.id} variant="gradient" shadow="card" style={styles.clubCard}>
            <View style={styles.clubRow}>
              <View style={styles.clubIcon}><Building2 size={22} color={Colors.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Text style={styles.clubMeta}>{club.country ?? '—'} · {club.league ?? '—'} · {club.season ?? '—'}</Text>
                {club.description ? <Text style={styles.clubDesc} numberOfLines={2}>{club.description}</Text> : null}
              </View>
            </View>
            <Text style={styles.teamsLabel}>{t('team.teams')}</Text>
            {teams.filter((tm) => tm.club_id === club.id).map((team) => (
              <PressableCard key={team.id} onPress={() => router.push('/coach-dashboard')} variant="gradient" shadow="card" style={styles.teamRow}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamCat}>{team.team_category ?? team.age_group ?? '—'}</Text>
                <ChevronRight size={16} color={Colors.gold} />
              </PressableCard>
            ))}
          </Card>
        ))}

        {clubs.length === 0 && (
          <Text style={styles.empty}>{t('team.noClubs')}</Text>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13 },
  clubCard: { gap: Spacing.sm },
  clubRow: { flexDirection: 'row', gap: Spacing.md },
  clubIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  clubName: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  clubMeta: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  clubDesc: { fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  teamsLabel: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.textTertiary, letterSpacing: 1, marginTop: Spacing.sm },
  teamRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, padding: Spacing.sm },
  teamName: { flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.textPrimary },
  teamCat: { fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.gold },
  empty: { textAlign: 'center', color: Colors.textTertiary, fontFamily: 'Inter-Regular', marginTop: Spacing.xl },
});
