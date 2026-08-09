import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';

import { Colors, Spacing, Radius } from '@/lib/theme';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { createTeam, getActiveTeam } from '@/lib/team-platform/platform';
import { TEAM_CATEGORIES } from '@/lib/team-platform/types';
import { useAuth } from '@/context/AuthContext';

export default function CreateTeamScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const club = getActiveTeam();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('U17');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) { setError(t('team.nameRequired')); return; }
    const { error: err } = await createTeam({
      name: name.trim(),
      club_id: club?.club_id ?? undefined,
      club_name: club?.club_name ?? undefined,
      team_category: category,
      age_group: category,
      created_by: user?.id ?? 'dev_coach',
    });
    if (err) { setError(err); return; }
    router.back();
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>{t('team.createTeam')}</Text>
        </View>

        <Text style={styles.label}>{t('coachLogin.teamName')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={Colors.textQuaternary} />

        <Text style={styles.label}>{t('team.category')}</Text>
        <View style={styles.catGrid}>
          {TEAM_CATEGORIES.map((c) => (
            <TouchableOpacity key={c} style={[styles.catChip, category === c && styles.catChipActive]} onPress={() => setCategory(c)}>
              <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label={t('team.createTeam')} onPress={handleCreate} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl, gap: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  label: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary, marginTop: Spacing.md },
  input: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 16, paddingHorizontal: Spacing.md, paddingVertical: 14 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.border },
  catChipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  catText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.textSecondary },
  catTextActive: { color: Colors.background },
  error: { color: Colors.error, fontFamily: 'Inter-Regular', textAlign: 'center' },
});
