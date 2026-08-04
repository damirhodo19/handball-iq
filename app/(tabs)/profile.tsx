import { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  User, Cake, Shield, Globe, Hand, Trophy, Edit3, X, Check,
  Flame, Calendar, Activity, ChevronRight, Award, Target, Clock,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card, PressableCard } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { useDevAuth } from '@/context/DevAuthContext';
import { loadProfile, saveProfile, loadSessions, loadStreak, UserProfile, SessionRecord, StreakData } from '@/lib/storage';
import { useTranslation } from '@/hooks/useTranslation';
import { translatePosition, translateHand, translatePlayingLevel } from '@/lib/translations';

const EXPERIENCE_LEVELS = ['Youth', 'Amateur', 'Semi Professional', 'Professional', 'National Team'];
const HAND_OPTIONS = ['Left', 'Right'];
const POSITIONS = ['Goalkeeper', 'Left Wing', 'Right Wing', 'Pivot', 'Centre Back', 'Left Back', 'Right Back'];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isDevAuthenticated, testUser, signOut } = useDevAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile | null>(null);

  const loadData = useCallback(() => {
    setProfile(loadProfile());
    setSessions(loadSessions());
    setStreak(loadStreak());
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function startEdit() {
    setDraft(profile ? { ...profile } : null);
    setEditing(true);
  }

  function saveEdit() {
    if (draft) {
      saveProfile(draft);
      setProfile(draft);
    }
    setEditing(false);
  }

  const displayName = profile?.name ?? 'Damir';
  const displayPosition = profile?.position ?? 'Goalkeeper';

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}><User size={20} color={Colors.gold} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('profile.title')}</Text>
            <Text style={styles.headerSub}>{t('profile.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7} onPress={startEdit}>
            <Edit3 size={16} color={Colors.gold} />
            <Text style={styles.editBtnText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <Card variant="gradient" shadow="cardLg" style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{displayName[0]?.toUpperCase() ?? 'D'}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{displayName}</Text>
                <Text style={styles.profilePosition}>{translatePosition(displayPosition, t)}</Text>
                {isDevAuthenticated && (
                  <View style={styles.foundingBadge}>
                    <Award size={11} color={Colors.gold} />
                    <Text style={styles.foundingText}>{t('profile.foundingMember')} {testUser?.memberNumber ?? '#001'}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Profile Fields */}
            <View style={styles.fieldsGrid}>
              <Field icon={<Cake size={15} color={Colors.gold} />} label={t('profile.age')} value={profile?.age || t('common.notSet')} />
              <Field icon={<Shield size={15} color={Colors.gold} />} label={t('profile.club')} value={profile?.club || t('common.notSet')} />
              <Field icon={<Globe size={15} color={Colors.gold} />} label={t('profile.country')} value={profile?.country || t('common.notSet')} />
              <Field icon={<Hand size={15} color={Colors.gold} />} label={t('profile.dominantHand')} value={profile?.dominantHand ? translateHand(profile.dominantHand, t) : t('common.notSet')} />
              <Field icon={<Trophy size={15} color={Colors.gold} />} label={t('profile.experience')} value={profile?.experienceLevel ? translatePlayingLevel(profile.experienceLevel, t) : t('common.notSet')} />
            </View>
          </Card>
        </Animated.View>

        {/* Daily Streak */}
        <SectionLabel label={t('profile.dailyStreak').toUpperCase()} />
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <Card variant="gradient" shadow="card" style={styles.streakCard}>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <View style={styles.streakIcon}><Flame size={20} color={Colors.gold} /></View>
                <Text style={styles.streakValue}>{streak?.currentStreak ?? 0}</Text>
                <Text style={styles.streakLabel}>{t('profile.currentStreak')}</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <View style={styles.streakIcon}><Award size={20} color={Colors.gold} /></View>
                <Text style={styles.streakValue}>{streak?.longestStreak ?? 0}</Text>
                <Text style={styles.streakLabel}>{t('profile.longestStreak')}</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <View style={styles.streakIcon}><Calendar size={20} color={Colors.gold} /></View>
                <Text style={styles.streakValue}>{streak?.sessionsThisWeek ?? 0}</Text>
                <Text style={styles.streakLabel}>{t('profile.thisWeek')}</Text>
              </View>
            </View>
            {/* Weekly progress dots */}
            <View style={styles.weekDots}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View key={i} style={[styles.weekDot, i < (streak?.sessionsThisWeek ?? 0) && styles.weekDotActive]} />
              ))}
            </View>
            <Text style={styles.weekHint}>{t('profile.consistencyHint')}</Text>
          </Card>
        </Animated.View>

        {/* Training History */}
        <SectionLabel label={t('profile.trainingHistory').toUpperCase()} />
        {sessions.length === 0 ? (
          <Card variant="gradient" shadow="card" style={styles.emptyCard}>
            <View style={styles.emptyIcon}><Activity size={28} color={Colors.gold} /></View>
            <Text style={styles.emptyTitle}>{t('profile.noSessions')}</Text>
            <Text style={styles.emptySub}>{t('profile.noSessionsSub')}</Text>
            <Button label={t('profile.startTraining')} onPress={() => router.push('/session')} />
          </Card>
        ) : (
          <View style={styles.historyList}>
            {sessions.map((s, i) => (
              <Animated.View key={s.id} entering={FadeInDown.delay(i * 60).duration(400)}>
                <Card variant="gradient" shadow="card" style={styles.historyCard}>
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIcon}>
                      <Target size={16} color={Colors.gold} />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyName}>{s.sessionName}</Text>
                      <Text style={styles.historyDate}>
                        {new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyScore}>{s.decisionScore}%</Text>
                    <View style={styles.historyMeta}>
                      <Clock size={11} color={Colors.textTertiary} />
                      <Text style={styles.historyMetaText}>{Math.round(s.timeSpent / 60)}m</Text>
                    </View>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.85} onPress={signOut}>
          <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editing} animationType="slide" transparent onRequestClose={() => setEditing(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('profile.editTitle')}</Text>
              <TouchableOpacity onPress={() => setEditing(false)}><X size={22} color={Colors.textSecondary} /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              {draft && (
                <>
                  <InputGroup label={t('profile.nameLabel').toUpperCase()}>
                    <TextInput style={styles.input} value={draft.name} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder={t('profile.namePlaceholder')} placeholderTextColor={Colors.textQuaternary} />
                  </InputGroup>
                  <InputGroup label={t('profile.position').toUpperCase()}>
                    <Picker options={POSITIONS} value={draft.position} onChange={(v) => setDraft({ ...draft, position: v })} renderOption={(opt) => translatePosition(opt, t)} />
                  </InputGroup>
                  <InputGroup label={t('profile.age').toUpperCase()}>
                    <TextInput style={styles.input} value={draft.age} onChangeText={(v) => setDraft({ ...draft, age: v })} placeholder={t('profile.agePlaceholder')} placeholderTextColor={Colors.textQuaternary} keyboardType="numeric" />
                  </InputGroup>
                  <InputGroup label={t('profile.club').toUpperCase()}>
                    <TextInput style={styles.input} value={draft.club} onChangeText={(v) => setDraft({ ...draft, club: v })} placeholder={t('profile.clubPlaceholder')} placeholderTextColor={Colors.textQuaternary} />
                  </InputGroup>
                  <InputGroup label={t('profile.country').toUpperCase()}>
                    <TextInput style={styles.input} value={draft.country} onChangeText={(v) => setDraft({ ...draft, country: v })} placeholder={t('profile.countryPlaceholder')} placeholderTextColor={Colors.textQuaternary} />
                  </InputGroup>
                  <InputGroup label={t('profile.dominantHand').toUpperCase()}>
                    <Picker options={HAND_OPTIONS} value={draft.dominantHand} onChange={(v) => setDraft({ ...draft, dominantHand: v })} renderOption={(opt) => translateHand(opt, t)} />
                  </InputGroup>
                  <InputGroup label={t('profile.experienceLevel').toUpperCase()}>
                    <Picker options={EXPERIENCE_LEVELS} value={draft.experienceLevel} onChange={(v) => setDraft({ ...draft, experienceLevel: v })} renderOption={(opt) => translatePlayingLevel(opt, t)} />
                  </InputGroup>
                  <Button label={t('common.save')} onPress={saveEdit} iconRight={<Check size={20} color={Colors.background} />} />
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>{icon}</View>
      <View>
        <Text style={styles.fieldLabel}>{label.toUpperCase()}</Text>
        <Text style={styles.fieldValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function InputGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Picker({ options, value, onChange, renderOption }: { options: string[]; value: string; onChange: (v: string) => void; renderOption?: (opt: string) => string }) {
  return (
    <View style={styles.pickerWrap}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.pickerItem, value === opt && styles.pickerItemSelected]}
          activeOpacity={0.7}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.pickerText, value === opt && styles.pickerTextSelected]}>{renderOption ? renderOption(opt) : opt}</Text>
          {value === opt && <Check size={14} color={Colors.background} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 1 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surface, paddingHorizontal: 14, paddingVertical: 9, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.gold },
  editBtnText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13 },

  profileCard: { gap: Spacing.lg, marginBottom: Spacing.sm },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.background },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  profilePosition: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  foundingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, backgroundColor: Colors.goldSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.gold, alignSelf: 'flex-start' },
  foundingText: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 11 },

  fieldsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  field: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, width: '47%' },
  fieldIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  fieldLabel: { color: Colors.textQuaternary, fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1 },
  fieldValue: { color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 14, marginTop: 1 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  streakCard: { gap: Spacing.md },
  streakRow: { flexDirection: 'row', alignItems: 'center' },
  streakItem: { flex: 1, alignItems: 'center', gap: 4 },
  streakIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  streakValue: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.textPrimary },
  streakLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 0.5, textAlign: 'center' },
  streakDivider: { width: 1, height: 50, backgroundColor: Colors.hairline },
  weekDots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  weekDot: { width: 28, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  weekDotActive: { backgroundColor: Colors.gold },
  weekHint: { color: Colors.textQuaternary, fontFamily: 'Inter-Regular', fontSize: 12, textAlign: 'center' },

  historyList: { gap: Spacing.sm },
  historyCard: { padding: Spacing.md },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  historyIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  historyInfo: { flex: 1 },
  historyName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary },
  historyDate: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },
  historyRight: { alignItems: 'flex-end' },
  historyScore: { fontFamily: 'Inter-ExtraBold', fontSize: 20, color: Colors.gold },
  historyMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  historyMetaText: { color: Colors.textTertiary, fontFamily: 'Inter-Medium', fontSize: 12 },

  emptyCard: { alignItems: 'center', gap: Spacing.md },
  emptyIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  emptySub: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  signOutBtn: { marginTop: Spacing.xxl, paddingVertical: 16, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.error, alignItems: 'center' },
  signOutText: { color: Colors.error, fontFamily: 'Inter-ExtraBold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surfaceElevated, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, maxHeight: '85%', borderWidth: 1, borderColor: Colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },
  modalScroll: { padding: Spacing.lg, gap: Spacing.md },
  inputGroup: { gap: Spacing.xs },
  inputLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1 },
  input: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: 14, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 16 },

  pickerWrap: { gap: Spacing.xs },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 12, borderRadius: Radius.md, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  pickerItemSelected: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  pickerText: { fontFamily: 'Inter-Medium', fontSize: 15, color: Colors.textSecondary },
  pickerTextSelected: { color: Colors.background, fontFamily: 'Inter-SemiBold' },
});
