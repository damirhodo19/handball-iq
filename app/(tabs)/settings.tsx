import { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Smartphone,
  Globe,
  Bell,
  Shield,
  Info,
  ChevronRight,
  Check,
  X,
  MessageSquareWarning,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows, ThemePreference } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { useSignOut } from '@/hooks/useSignOut';
import { useTranslation } from '@/hooks/useTranslation';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import type { SupportedLanguage } from '@/locales';
import { loadDevelopmentState, updateNotificationPrefs } from '@/lib/development';
import { loadProfile } from '@/lib/storage';
import {
  APP_BUILD,
  APP_VERSION,
  getBetaVersionLabel,
  buildBetaFeedbackMailto,
  type BetaFeedbackCategory,
} from '@/lib/app-version';

const LANGUAGES: { code: SupportedLanguage; labelKey: string }[] = [
  { code: 'en', labelKey: 'settings.languageEn' },
  { code: 'hr', labelKey: 'settings.languageHr' },
  { code: 'de', labelKey: 'settings.languageDe' },
];

const THEME_OPTIONS: { value: ThemePreference; labelKey: string; icon: 'sun' | 'moon' | 'system' }[] = [
  { value: 'light', labelKey: 'settings.themeLight', icon: 'sun' },
  { value: 'dark', labelKey: 'settings.themeDark', icon: 'moon' },
  { value: 'system', labelKey: 'settings.themeSystem', icon: 'system' },
];

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { preference, setPreference } = useTheme();
  const signOut = useSignOut();
  const { lang, setLang, t } = useTranslation();
  const { isAdmin } = useAdminAccess();
  const [langModal, setLangModal] = useState(false);
  const [themeModal, setThemeModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<BetaFeedbackCategory>('bug');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [notifPrefs, setNotifPrefs] = useState(() => loadDevelopmentState().notificationPrefs);

  const feedbackCategories: { id: BetaFeedbackCategory; labelKey: string }[] = [
    { id: 'bug', labelKey: 'beta.cat.bug' },
    { id: 'translation', labelKey: 'beta.cat.translation' },
    { id: 'terminology', labelKey: 'beta.cat.terminology' },
    { id: 'wrong_answer', labelKey: 'beta.cat.wrong_answer' },
    { id: 'feature', labelKey: 'beta.cat.feature' },
  ];

  const sendFeedback = useCallback(async () => {
    const profile = loadProfile();
    const url = buildBetaFeedbackMailto(feedbackCategory, feedbackNote, {
      language: lang,
      position: profile.position || undefined,
      role: profile.role || undefined,
    });
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(t('beta.feedbackTitle'), t('beta.feedbackUnavailable'));
        return;
      }
      await Linking.openURL(url);
      setFeedbackModal(false);
      setFeedbackNote('');
    } catch {
      Alert.alert(t('beta.feedbackTitle'), t('beta.feedbackUnavailable'));
    }
  }, [feedbackCategory, feedbackNote, lang, t]);

  const toggleNotif = useCallback((key: keyof typeof notifPrefs, value: boolean) => {
    updateNotificationPrefs({ [key]: value });
    setNotifPrefs((prev) => ({ ...prev, [key]: value }));
    if (key === 'dailyTraining') updateSettings({ dailyReminder: value });
  }, [updateSettings]);

  const currentLangLabel = LANGUAGES.find((l) => l.code === lang) ? t(LANGUAGES.find((l) => l.code === lang)!.labelKey) : t('settings.languageEn');

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}><SettingsIcon size={20} color={Colors.gold} /></View>
          <View>
            <Text style={styles.headerTitle}>{t('settings.title')}</Text>
            <Text style={styles.headerSub}>{t('settings.preferences')}</Text>
          </View>
        </View>

        {/* Appearance */}
        <SectionLabel label={t('settings.appearance')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => setThemeModal(true)}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                {preference === 'dark' ? <Moon size={18} color={Colors.gold} /> : preference === 'system' ? <Smartphone size={18} color={Colors.gold} /> : <Sun size={18} color={Colors.gold} />}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{t('settings.theme')}</Text>
                <Text style={styles.rowSub}>
                  {t(THEME_OPTIONS.find((o) => o.value === preference)?.labelKey ?? 'settings.themeLight')}
                </Text>
              </View>
            </View>
            <View style={styles.rowAction}>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Language */}
        <SectionLabel label={t('settings.preferences')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => setLangModal(true)}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Globe size={18} color={Colors.gold} /></View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{t('settings.language')}</Text>
                <Text style={styles.rowSub}>{currentLangLabel}</Text>
              </View>
            </View>
            <View style={styles.rowAction}>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Notifications */}
        <SectionLabel label={t('settings.notificationsSection')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <Row
            testID="settings-daily-training-row"
            icon={<Bell size={18} color={Colors.gold} />}
            label={t('dev.notifDailyTraining')}
            sub={t('dev.notifDailyTrainingSub')}
          >
            <Toggle value={notifPrefs.dailyTraining} onToggle={() => toggleNotif('dailyTraining', !notifPrefs.dailyTraining)} />
          </Row>
          <View style={styles.rowDivider} />
          <Row icon={<Bell size={18} color={Colors.gold} />} label={t('dev.notifWeeklyReview')} sub={t('dev.notifWeeklyReviewSub')}>
            <Toggle value={notifPrefs.weeklyReview} onToggle={() => toggleNotif('weeklyReview', !notifPrefs.weeklyReview)} />
          </Row>
          <View style={styles.rowDivider} />
          <Row icon={<Bell size={18} color={Colors.gold} />} label={t('dev.notifBrokenStreak')} sub={t('dev.notifBrokenStreakSub')}>
            <Toggle value={notifPrefs.brokenStreak} onToggle={() => toggleNotif('brokenStreak', !notifPrefs.brokenStreak)} />
          </Row>
          <View style={styles.rowDivider} />
          <Row icon={<Bell size={18} color={Colors.gold} />} label={t('dev.notifAchievement')} sub={t('dev.notifAchievementSub')}>
            <Toggle value={notifPrefs.achievementUnlocked} onToggle={() => toggleNotif('achievementUnlocked', !notifPrefs.achievementUnlocked)} />
          </Row>
        </Card>

        {/* Team */}
        <SectionLabel label={t('team.joinTeam')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => router.push('/coach-dashboard/join')}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Shield size={18} color={Colors.gold} /></View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{t('team.joinTeam')}</Text>
                <Text style={styles.rowSub}>{t('team.joinSub')}</Text>
              </View>
            </View>
            <View style={styles.rowAction}>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Privacy */}
        <SectionLabel label={t('settings.privacySection')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => Alert.alert(t('settings.privacy'), t('settings.privacySub'))}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Shield size={18} color={Colors.gold} /></View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{t('settings.privacy')}</Text>
                <Text style={styles.rowSub}>{t('settings.privacySub')}</Text>
              </View>
            </View>
            <View style={styles.rowAction}>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Admin — visible only to accounts approved by Supabase. */}
        {isAdmin ? (
          <>
            <SectionLabel label={t('settings.adminSection')} />
            <Card variant="gradient" shadow="card" style={styles.groupCard}>
              <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => router.push('/admin/dashboard')}>
                <View style={styles.rowLeft}>
                  <View style={styles.rowIcon}><Shield size={18} color={Colors.gold} /></View>
                  <View style={styles.rowText}>
                    <Text style={styles.rowLabel}>{t('admin.loginTitle')}</Text>
                    <Text style={styles.rowSub}>{t('admin.loginSub')}</Text>
                  </View>
                </View>
                <View style={styles.rowAction}>
                  <ChevronRight size={18} color={Colors.textTertiary} />
                </View>
              </TouchableOpacity>
            </Card>
          </>
        ) : null}

        {/* Beta feedback */}
        <SectionLabel label={t('beta.feedbackTitle')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => setFeedbackModal(true)}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><MessageSquareWarning size={18} color={Colors.gold} /></View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{t('beta.feedback')}</Text>
                <Text style={styles.rowSub}>{t('beta.feedbackSub')}</Text>
              </View>
            </View>
            <View style={styles.rowAction}>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* About */}
        <SectionLabel label={t('settings.about')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => setAboutModal(true)}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Info size={18} color={Colors.gold} /></View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{t('auth.appName')}</Text>
                <Text style={styles.rowSub}>{t('beta.versionLine', { version: APP_VERSION, build: APP_BUILD })}</Text>
              </View>
            </View>
            <View style={styles.rowAction}>
              <ChevronRight size={18} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.85} onPress={signOut}>
          <Text style={styles.signOutText}>{t('profile.signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
      <Modal visible={langModal} animationType="slide" transparent onRequestClose={() => setLangModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.language')}</Text>
              <TouchableOpacity onPress={() => setLangModal(false)}><X size={22} color={Colors.textSecondary} /></TouchableOpacity>
            </View>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langRow, lang === l.code && styles.langRowSelected]}
                activeOpacity={0.7}
                onPress={() => { setLang(l.code); setLangModal(false); }}
              >
                <Text style={[styles.langText, lang === l.code && styles.langTextSelected]}>{t(l.labelKey)}</Text>
                {lang === l.code && <Check size={18} color={Colors.gold} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Theme Modal */}
      <Modal visible={themeModal} animationType="slide" transparent onRequestClose={() => setThemeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.theme')}</Text>
              <TouchableOpacity onPress={() => setThemeModal(false)}><X size={22} color={Colors.textSecondary} /></TouchableOpacity>
            </View>
            {THEME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.langRow, preference === opt.value && styles.langRowSelected]}
                activeOpacity={0.7}
                onPress={() => { setPreference(opt.value); setThemeModal(false); }}
              >
                <Text style={[styles.langText, preference === opt.value && styles.langTextSelected]}>{t(opt.labelKey)}</Text>
                {preference === opt.value && <Check size={18} color={Colors.gold} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={aboutModal} animationType="slide" transparent onRequestClose={() => setAboutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('auth.appName')}</Text>
              <TouchableOpacity onPress={() => setAboutModal(false)}><X size={22} color={Colors.textSecondary} /></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.aboutContent}>
              <View style={styles.aboutLogo}>
                <Text style={styles.aboutLogoText}>IQ</Text>
              </View>
              <Text style={styles.aboutTitle}>{t('auth.appName')}</Text>
              <Text style={styles.aboutVersion}>{getBetaVersionLabel()}</Text>
              <Text style={styles.aboutDesc}>{t('beta.aboutBuild')}</Text>
              <Text style={styles.aboutDesc}>
                {t('auth.appTagline')}
              </Text>
              <Text style={styles.aboutDesc}>
                {t('settings.dataLocalNote')}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Beta feedback modal */}
      <Modal visible={feedbackModal} animationType="slide" transparent onRequestClose={() => setFeedbackModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('beta.feedbackTitle')}</Text>
              <TouchableOpacity onPress={() => setFeedbackModal(false)}>
                <X size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl }}>
              <Text style={styles.aboutDesc}>{t('beta.feedbackHint')}</Text>
              {feedbackCategories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.langRow, feedbackCategory === c.id && styles.langRowSelected]}
                  activeOpacity={0.7}
                  onPress={() => setFeedbackCategory(c.id)}
                >
                  <Text style={[styles.langText, feedbackCategory === c.id && styles.langTextSelected]}>
                    {t(c.labelKey)}
                  </Text>
                  {feedbackCategory === c.id && <Check size={18} color={Colors.gold} />}
                </TouchableOpacity>
              ))}
              <TextInput
                style={styles.feedbackInput}
                placeholder={t('beta.feedbackNotePlaceholder')}
                placeholderTextColor={Colors.textQuaternary}
                value={feedbackNote}
                onChangeText={setFeedbackNote}
                multiline
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.feedbackSend} activeOpacity={0.85} onPress={sendFeedback}>
                <Text style={styles.feedbackSendText}>{t('beta.feedbackSend')}</Text>
              </TouchableOpacity>
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

function Row({
  icon,
  label,
  sub,
  children,
  testID,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  children: React.ReactNode;
  testID?: string;
}) {
  return (
    <View style={styles.row} testID={testID}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>{icon}</View>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowSub}>{sub}</Text>
        </View>
      </View>
      <View style={styles.rowAction}>{children}</View>
    </View>
  );
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[styles.toggle, value && styles.toggleOn]}
      accessibilityRole="switch"
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 1 },

  sectionLabel: { color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 1.5, marginBottom: Spacing.sm, marginTop: Spacing.lg },

  groupCard: { gap: 0, padding: 0, width: '100%', maxWidth: '100%', overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.md,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: '100%',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 200,
    minWidth: 0,
    maxWidth: '100%',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.goldSoft,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rowText: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '100%',
  },
  rowLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.textPrimary,
    flexShrink: 1,
    maxWidth: '100%',
  },
  rowSub: {
    color: Colors.textTertiary,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
    flexShrink: 1,
    maxWidth: '100%',
  },
  rowAction: {
    flexShrink: 0,
    alignSelf: 'center',
  },
  rowDivider: { height: 1, backgroundColor: Colors.hairline, marginHorizontal: Spacing.lg },

  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    padding: 3,
    justifyContent: 'center',
    flexShrink: 0,
  },
  toggleOn: { backgroundColor: Colors.gold },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.textQuaternary },
  toggleThumbOn: { backgroundColor: Colors.background, alignSelf: 'flex-end' },

  signOutBtn: { marginTop: Spacing.xxl, paddingVertical: 16, borderRadius: Radius.lg, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.error, alignItems: 'center' },
  signOutText: { color: Colors.error, fontFamily: 'Inter-ExtraBold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.surfaceElevated, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, maxHeight: '80%', borderWidth: 1, borderColor: Colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  modalTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 18, color: Colors.textPrimary },

  langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  langRowSelected: { backgroundColor: Colors.goldSoft },
  langText: { fontFamily: 'Inter-Medium', fontSize: 16, color: Colors.textSecondary },
  langTextSelected: { color: Colors.gold, fontFamily: 'Inter-SemiBold' },

  aboutContent: { padding: Spacing.lg, gap: Spacing.md, alignItems: 'center' },
  aboutLogo: { width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.gold, justifyContent: 'center', alignItems: 'center' },
  aboutLogoText: { fontFamily: 'Inter-ExtraBold', fontSize: 28, color: Colors.background },
  aboutTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 22, color: Colors.textPrimary },
  aboutVersion: { color: Colors.gold, fontFamily: 'Inter-SemiBold', fontSize: 13 },
  aboutDesc: { color: Colors.textSecondary, fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  feedbackInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    backgroundColor: Colors.surface,
  },
  feedbackSend: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  feedbackSendText: { fontFamily: 'Inter-ExtraBold', fontSize: 15, color: Colors.background },
});
