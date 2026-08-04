import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Settings as SettingsIcon, Moon, Globe, Bell, Shield, Info, ChevronRight, Check, X } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/lib/theme';
import { Card } from '@/components/Card';
import { ScreenBackground } from '@/components/Screen';
import { useSettings } from '@/context/SettingsContext';
import { useDevAuth } from '@/context/DevAuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { SupportedLanguage } from '@/locales';

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hr', label: 'Hrvatski' },
];

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { signOut } = useDevAuth();
  const { lang, setLang, t } = useTranslation();
  const [langModal, setLangModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);

  const currentLangLabel = LANGUAGES.find((l) => l.code === lang)?.label ?? 'English';

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
        <SectionLabel label="APPEARANCE" />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <Row icon={<Moon size={18} color={Colors.gold} />} label="Dark Mode" sub="Default theme">
            <Toggle value={settings.darkMode} onToggle={() => updateSettings({ darkMode: !settings.darkMode })} />
          </Row>
        </Card>

        {/* Language */}
        <SectionLabel label={t('settings.preferences')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => setLangModal(true)}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Globe size={18} color={Colors.gold} /></View>
              <View>
                <Text style={styles.rowLabel}>{t('settings.language')}</Text>
                <Text style={styles.rowSub}>{currentLangLabel}</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        {/* Notifications */}
        <SectionLabel label="NOTIFICATIONS" />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <Row icon={<Bell size={18} color={Colors.gold} />} label={t('settings.notifications')} sub="Get a daily training nudge">
            <Toggle value={settings.dailyReminder} onToggle={() => updateSettings({ dailyReminder: !settings.dailyReminder })} />
          </Row>
        </Card>

        {/* Privacy */}
        <SectionLabel label="PRIVACY" />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => {}}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Shield size={18} color={Colors.gold} /></View>
              <View>
                <Text style={styles.rowLabel}>Privacy</Text>
                <Text style={styles.rowSub}>Your data stays on this device</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        {/* Admin */}
        <SectionLabel label="ADMIN" />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => router.push('/admin/login')}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Shield size={18} color={Colors.gold} /></View>
              <View>
                <Text style={styles.rowLabel}>{t('admin.loginTitle')}</Text>
                <Text style={styles.rowSub}>{t('admin.loginSub')}</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        {/* About */}
        <SectionLabel label={t('settings.about')} />
        <Card variant="gradient" shadow="card" style={styles.groupCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => setAboutModal(true)}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}><Info size={18} color={Colors.gold} /></View>
              <View>
                <Text style={styles.rowLabel}>{t('auth.appName')}</Text>
                <Text style={styles.rowSub}>{t('settings.version')}</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
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
                <Text style={[styles.langText, lang === l.code && styles.langTextSelected]}>{l.label}</Text>
                {lang === l.code && <Check size={18} color={Colors.gold} />}
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
              <Text style={styles.aboutVersion}>{t('settings.version')} 1.0.0 (MVP)</Text>
              <Text style={styles.aboutDesc}>
                {t('auth.appTagline')}
              </Text>
              <Text style={styles.aboutDesc}>
                All data is stored locally on your device. No account required.
              </Text>
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

function Row({ icon, label, sub, children }: { icon: React.ReactNode; label: string; sub: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>{icon}</View>
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowSub}>{sub}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={[styles.toggle, value && styles.toggleOn]}>
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

  groupCard: { gap: 0, padding: 0 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.textPrimary },
  rowSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 12, marginTop: 2 },

  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: Colors.border, padding: 3, justifyContent: 'center' },
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
});
