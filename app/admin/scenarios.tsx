import { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert, Share } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Search, Plus, Filter, Download, Upload, ChevronRight, Copy, Archive, Trash2, Pencil, Eye, X, FileJson
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '@/lib/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenBackground } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import {
  loadScenarios, loadScenariosAsync, duplicateScenarioAsync, archiveScenarioAsync,
  deleteScenarioAsync, exportScenarios, importScenarios, bulkUpdateScenarioStatus, AdminScenario,
} from '@/lib/admin-storage';
import { ALL_POSITIONS, AGE_GROUPS, PLAYING_LEVELS } from '@/lib/positions';
import { useTranslation } from '@/hooks/useTranslation';
import {
  translatePosition, translateDifficulty, translateStatus,
  translateAgeGroup, translatePlayingLevel, translateAttackDefence,
  translateCategory, translateDefensiveSystem, translatePressure,
} from '@/lib/translations';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const STATUSES = ['Published', 'Draft', 'Archived'] as const;
const ATTACK_DEFENCE = ['Attack', 'Defence'] as const;
const DEFENSIVE_SYSTEMS = ['6-0', '5-1', '4-2', '3-2-1', 'Man-to-Man', 'Mixed'] as const;
const PRESSURE_LEVELS = ['Low', 'Moderate', 'High', 'Critical'] as const;

export default function AdminScenariosScreen() {
  const { t } = useTranslation();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [scenarios, setScenarios] = useState<AdminScenario[]>([]);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showImport, setShowImport] = useState(tab === 'import');
  const [importText, setImportText] = useState('');
  const [importResult, setImportResult] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<'All' | 'Published' | 'Draft' | 'Archived'>('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    position: '' as string,
    category: '' as string,
    difficulty: '' as string,
    ageGroup: '' as string,
    playingLevel: '' as string,
    attackOrDefence: '' as string,
    defensiveSystem: '' as string,
    pressureLevel: '' as string,
    status: '' as string,
  });

  useFocusEffect(() => {
    refresh();
  });

  const refresh = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await loadScenariosAsync();
      setScenarios(data);
    } catch {
      setLoadError(t('adminScenarios.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    scenarios.forEach((s) => set.add(s.category));
    return Array.from(set).sort();
  }, [scenarios]);

  const filtered = useMemo(() => {
    return scenarios.filter((s) => {
      if (statusTab !== 'All' && s.status !== statusTab) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.title.toLowerCase().includes(q) && !s.situation.toLowerCase().includes(q) && !s.learningObjective.toLowerCase().includes(q)) return false;
      }
      if (filters.position && s.position !== filters.position) return false;
      if (filters.category && s.category !== filters.category) return false;
      if (filters.difficulty && s.difficulty !== filters.difficulty) return false;
      if (filters.ageGroup && s.ageGroup !== filters.ageGroup) return false;
      if (filters.playingLevel && s.playingLevel !== filters.playingLevel) return false;
      if (filters.attackOrDefence && s.attackOrDefence !== filters.attackOrDefence) return false;
      if (filters.defensiveSystem && s.defensiveSystem !== filters.defensiveSystem) return false;
      if (filters.pressureLevel && s.pressureLevel !== filters.pressureLevel) return false;
      if (filters.status && s.status !== filters.status) return false;
      return true;
    });
  }, [scenarios, search, filters, statusTab]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const handleBulkPublish = () => {
    const n = bulkUpdateScenarioStatus([...selectedIds], 'Published');
    Alert.alert(t('adminScenarios.bulkPublish'), t('adminScenarios.bulkPublishDone', { n }));
    setSelectedIds(new Set());
    refresh();
  };

  const handleBulkDraft = () => {
    const n = bulkUpdateScenarioStatus([...selectedIds], 'Draft');
    Alert.alert(t('adminScenarios.bulkDraft'), t('adminScenarios.bulkDraftDone', { n }));
    setSelectedIds(new Set());
    refresh();
  };

  const handleBulkArchive = () => {
    const n = bulkUpdateScenarioStatus([...selectedIds], 'Archived');
    Alert.alert(t('adminScenarios.bulkArchive'), t('adminScenarios.bulkArchiveDone', { n }));
    setSelectedIds(new Set());
    refresh();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateScenarioAsync(id);
    refresh();
  };

  const handleArchive = async (id: string) => {
    await archiveScenarioAsync(id);
    refresh();
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      t('adminScenarios.deleteTitle'),
      t('adminScenarios.deleteConfirm', { title }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('adminScenarios.cardDelete'), style: 'destructive', onPress: async () => { await deleteScenarioAsync(id); refresh(); } },
      ]
    );
  };

  const handleExport = async () => {
    const json = exportScenarios();
    try {
      await Share.share({ message: json, title: t('adminScenarios.exportFilename') });
    } catch {}
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setImportResult(t('adminScenarios.errorNoJson'));
      return;
    }
    const result = importScenarios(importText.trim());
    const msg = t('adminScenarios.importResult', { imported: result.imported, skipped: result.skipped, invalid: result.invalid, duplicates: result.duplicates });
    setImportResult(msg);
    if (result.errors.length > 0) {
      setImportResult(msg + '\n\n' + result.errors.join('\n'));
    }
    refresh();
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <BackButton />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t('adminScenarios.title')}</Text>
            <Text style={styles.headerSub}>{t('common.countOf', { shown: filtered.length, total: scenarios.length })} {t('adminScenarios.title').toLowerCase()}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/admin/editor')}>
            <Plus size={20} color={Colors.gold} />
          </TouchableOpacity>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)}>
          <View style={styles.searchWrap}>
            <Search size={18} color={Colors.textTertiary} style={{ marginLeft: 4 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('adminScenarios.searchPlaceholder')}
              placeholderTextColor={Colors.textQuaternary}
              value={search}
              onChangeText={setSearch}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}><X size={18} color={Colors.textTertiary} /></TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>

        {/* Status tabs */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.statusTabs}>
          {(['All', 'Published', 'Draft', 'Archived'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.statusTab, statusTab === tab && styles.statusTabActive]}
              onPress={() => { setStatusTab(tab); setSelectedIds(new Set()); }}
            >
              <Text style={[styles.statusTabText, statusTab === tab && styles.statusTabTextActive]}>
                {tab === 'All' ? t('adminScenarios.statusAll') : tab === 'Published' ? t('adminScenarios.statusPublished') : tab === 'Draft' ? t('adminScenarios.statusDraft') : t('adminScenarios.statusArchived')}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.bulkBar}>
            <TouchableOpacity onPress={toggleSelectAll} accessibilityRole="checkbox">
              <Text style={styles.bulkSelectText}>{t('adminScenarios.selectedCount', { n: selectedIds.size })}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bulkBtn} onPress={handleBulkPublish}><Text style={styles.bulkBtnText}>{t('adminScenarios.bulkPublish')}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.bulkBtn} onPress={handleBulkDraft}><Text style={styles.bulkBtnText}>{t('adminScenarios.bulkDraft')}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.bulkBtn, styles.bulkBtnDanger]} onPress={handleBulkArchive}><Text style={styles.bulkBtnTextDanger}>{t('adminScenarios.bulkArchive')}</Text></TouchableOpacity>
          </Animated.View>
        )}

        {/* Filter toggle */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.filterRow}>
          <TouchableOpacity style={[styles.filterBtn, showFilters && styles.filterBtnActive]} onPress={() => setShowFilters(!showFilters)}>
            <Filter size={16} color={showFilters ? Colors.gold : Colors.textSecondary} />
            <Text style={[styles.filterBtnText, showFilters && { color: Colors.gold }]}>{t('adminScenarios.filters')}</Text>
            {hasActiveFilters && <View style={styles.filterDot} />}
          </TouchableOpacity>
          {hasActiveFilters && (
            <TouchableOpacity onPress={() => setFilters({ position: '', category: '', difficulty: '', ageGroup: '', playingLevel: '', attackOrDefence: '', defensiveSystem: '', pressureLevel: '', status: '' })}>
              <Text style={styles.clearText}>{t('common.clearAll')}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Filters */}
        {showFilters && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Card padding={Spacing.md} style={{ marginBottom: Spacing.md }}>
              <FilterSection label={t('adminScenarios.filterPosition')}>
                <FilterChips values={['', ...ALL_POSITIONS]} current={filters.position} onChange={(v) => setFilters({ ...filters, position: v })} translate={(v) => translatePosition(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterCategory')}>
                <FilterChips values={['', ...allCategories]} current={filters.category} onChange={(v) => setFilters({ ...filters, category: v })} translate={(v) => translateCategory(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterDifficulty')}>
                <FilterChips values={['', ...DIFFICULTIES]} current={filters.difficulty} onChange={(v) => setFilters({ ...filters, difficulty: v })} translate={(v) => translateDifficulty(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterAgeGroup')}>
                <FilterChips values={['', ...AGE_GROUPS, 'All']} current={filters.ageGroup} onChange={(v) => setFilters({ ...filters, ageGroup: v })} translate={(v) => v === 'All' ? t('common.all') : translateAgeGroup(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterPlayingLevel')}>
                <FilterChips values={['', ...PLAYING_LEVELS, 'All']} current={filters.playingLevel} onChange={(v) => setFilters({ ...filters, playingLevel: v })} translate={(v) => v === 'All' ? t('common.all') : translatePlayingLevel(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterAttackDefence')}>
                <FilterChips values={['', ...ATTACK_DEFENCE]} current={filters.attackOrDefence} onChange={(v) => setFilters({ ...filters, attackOrDefence: v })} translate={(v) => translateAttackDefence(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterDefensiveSystem')}>
                <FilterChips values={['', ...DEFENSIVE_SYSTEMS]} current={filters.defensiveSystem} onChange={(v) => setFilters({ ...filters, defensiveSystem: v })} translate={(v) => translateDefensiveSystem(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterPressureLevel')}>
                <FilterChips values={['', ...PRESSURE_LEVELS]} current={filters.pressureLevel} onChange={(v) => setFilters({ ...filters, pressureLevel: v })} translate={(v) => translatePressure(v, t)} />
              </FilterSection>
              <FilterSection label={t('adminScenarios.filterStatus')}>
                <FilterChips values={['', ...STATUSES]} current={filters.status} onChange={(v) => setFilters({ ...filters, status: v })} translate={(v) => translateStatus(v, t)} />
              </FilterSection>
            </Card>
          </Animated.View>
        )}

        {/* Import / Export */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.ioRow}>
          <TouchableOpacity style={styles.ioBtn} onPress={handleExport}>
            <Download size={18} color={Colors.gold} />
            <Text style={styles.ioLabel}>{t('adminScenarios.exportJson')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ioBtn} onPress={() => setShowImport(!showImport)}>
            <Upload size={18} color={Colors.gold} />
            <Text style={styles.ioLabel}>{t('adminScenarios.importJson')}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Import panel */}
        {showImport && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Card padding={Spacing.md} style={{ marginBottom: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm }}>
                <FileJson size={18} color={Colors.gold} />
                <Text style={styles.ioTitle}>{t('adminScenarios.importTitle')}</Text>
              </View>
              <TextInput
                style={styles.importInput}
                placeholder={t('adminScenarios.pastePlaceholder')}
                placeholderTextColor={Colors.textQuaternary}
                value={importText}
                onChangeText={setImportText}
                multiline
                textAlignVertical="top"
              />
              <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
                <Button label={t('adminScenarios.importJson')} onPress={handleImport} size="md" style={{ flex: 1 }} />
                <Button label={t('common.cancel')} onPress={() => { setShowImport(false); setImportText(''); setImportResult(null); }} variant="dark" size="md" style={{ flex: 1 }} />
              </View>
              {importResult && (
                <Text style={styles.importResult}>{importResult}</Text>
              )}
            </Card>
          </Animated.View>
        )}

        {/* Scenario List */}
        <View style={{ gap: Spacing.sm }}>
          {loading ? (
            <Card padding={Spacing.xl} style={{ alignItems: 'center' }}>
              <Text style={styles.emptySub}>{t('common.loading')}</Text>
            </Card>
          ) : loadError ? (
            <Card padding={Spacing.xl} style={{ alignItems: 'center', gap: Spacing.md }}>
              <Text style={styles.emptyTitle}>{t('adminScenarios.loadFailed')}</Text>
              <Button label={t('common.retry')} onPress={refresh} variant="outline" size="md" />
            </Card>
          ) : filtered.length === 0 ? (
            <Card padding={Spacing.xl} style={{ alignItems: 'center' }}>
              <Text style={styles.emptyTitle}>{t('adminScenarios.emptyTitle')}</Text>
              <Text style={styles.emptySub}>{t('adminScenarios.emptySub')}</Text>
              <Button label={t('adminScenarios.createScenario')} onPress={() => router.push('/admin/editor')} variant="gold" size="md" style={{ marginTop: Spacing.md }} />
            </Card>
          ) : (
            <>
              <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
                <Text style={styles.selectAllText}>{t('adminScenarios.selectAll')}</Text>
              </TouchableOpacity>
              {filtered.map((s, i) => (
                <Animated.View key={s.id} entering={FadeInDown.delay(Math.min(i * 30, 300)).duration(400)}>
                  <ScenarioCard
                    scenario={s}
                    selected={selectedIds.has(s.id)}
                    onToggleSelect={() => toggleSelect(s.id)}
                    onOpen={() => router.push(`/admin/editor?id=${s.id}&mode=view`)}
                    onEdit={() => router.push(`/admin/editor?id=${s.id}`)}
                    onDuplicate={() => handleDuplicate(s.id)}
                    onArchive={() => handleArchive(s.id)}
                    onDelete={() => handleDelete(s.id, s.title)}
                  />
                </Animated.View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Text style={styles.filterLabel}>{label.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function FilterChips({ values, current, onChange, translate }: { values: readonly string[]; current: string; onChange: (v: string) => void; translate?: (v: string) => string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.chipWrap}>
      {values.map((v) => {
        const active = current === v;
        const label = v === '' ? t('common.all') : (translate ? translate(v) : v);
        return (
          <TouchableOpacity
            key={v || 'all'}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(v)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ScenarioCard({
  scenario, selected, onToggleSelect, onOpen, onEdit, onDuplicate, onArchive, onDelete,
}: {
  scenario: AdminScenario;
  selected?: boolean;
  onToggleSelect?: () => void;
  onOpen: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const statusColor = scenario.status === 'Published' ? Colors.success : scenario.status === 'Archived' ? Colors.textTertiary : Colors.warning;
  const updatedDate = new Date(scenario.updatedAt).toLocaleDateString();

  return (
    <Card padding={Spacing.md} style={selected ? { borderColor: Colors.gold, borderWidth: 2 } : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }}>
        {onToggleSelect ? (
          <TouchableOpacity onPress={onToggleSelect} style={[styles.checkbox, selected && styles.checkboxSelected]} accessibilityRole="checkbox" accessibilityState={{ checked: selected }}>
            {selected ? <Text style={styles.checkboxMark}>✓</Text> : null}
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onOpen} activeOpacity={0.7} style={{ flex: 1, marginBottom: Spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Text style={styles.cardTitle} numberOfLines={2}>{scenario.title}</Text>
            <Text style={styles.cardMeta}>{translatePosition(scenario.position, t)} · {translateCategory(scenario.category, t)} · {translateDifficulty(scenario.difficulty, t)}</Text>
            <Text style={styles.cardMeta2}>{t('adminScenarios.cardMeta', { minute: scenario.minute, date: updatedDate })}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20', borderColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{translateStatus(scenario.status, t)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </View>
      <View style={styles.actionRow}>
        <CardAction icon={<Eye size={16} color={Colors.textSecondary} />} label={t('adminScenarios.cardOpen')} onPress={onOpen} />
        <CardAction icon={<Pencil size={16} color={Colors.textSecondary} />} label={t('adminScenarios.cardEdit')} onPress={onEdit} />
        <CardAction icon={<Copy size={16} color={Colors.textSecondary} />} label={t('adminScenarios.cardCopy')} onPress={onDuplicate} />
        <CardAction icon={<Archive size={16} color={Colors.textSecondary} />} label={t('adminScenarios.cardArchive')} onPress={onArchive} />
        <CardAction icon={<Trash2 size={16} color={Colors.error} />} label={t('adminScenarios.cardDelete')} onPress={onDelete} danger />
      </View>
    </Card>
  );
}

function CardAction({ icon, label, onPress, danger }: { icon: React.ReactNode; label: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.cardAction} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Text style={[styles.cardActionText, danger && { color: Colors.error }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxxl + 16, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.goldSoft, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Inter-ExtraBold', fontSize: 24, color: Colors.textPrimary },
  headerSub: { color: Colors.textTertiary, fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.sm, gap: Spacing.xs, marginBottom: Spacing.md },
  searchInput: { flex: 1, color: Colors.textPrimary, fontFamily: 'Inter-Medium', fontSize: 15, paddingVertical: 14 },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.surface, borderRadius: 99, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: 10 },
  filterBtnActive: { borderColor: Colors.gold },
  filterBtnText: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter-SemiBold' },
  filterDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.gold },
  clearText: { fontSize: 13, color: Colors.gold, fontFamily: 'Inter-SemiBold' },
  filterLabel: { fontSize: 10, color: Colors.textTertiary, fontFamily: 'Inter-SemiBold', letterSpacing: 1, marginBottom: 6 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter-Medium' },
  chipTextActive: { color: Colors.background, fontFamily: 'Inter-Bold' },
  ioRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  ioBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingVertical: 14 },
  ioLabel: { fontSize: 14, color: Colors.textSecondary, fontFamily: 'Inter-SemiBold' },
  ioTitle: { fontSize: 15, color: Colors.textPrimary, fontFamily: 'Inter-SemiBold' },
  importInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary, fontFamily: 'Inter-Regular', fontSize: 13, padding: Spacing.md, minHeight: 120 },
  importResult: { marginTop: Spacing.sm, fontSize: 13, color: Colors.gold, fontFamily: 'Inter-Regular', lineHeight: 20 },
  cardTitle: { fontSize: 16, color: Colors.textPrimary, fontFamily: 'Inter-Bold' },
  cardMeta: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-Regular', marginTop: 3 },
  cardMeta2: { fontSize: 12, color: Colors.textTertiary, fontFamily: 'Inter-Regular', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, borderWidth: 1 },
  statusText: { fontSize: 11, fontFamily: 'Inter-Bold' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: Colors.hairline, paddingTop: Spacing.sm },
  cardAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardActionText: { fontSize: 12, color: Colors.textSecondary, fontFamily: 'Inter-Medium' },
  emptyTitle: { fontSize: 18, color: Colors.textPrimary, fontFamily: 'Inter-Bold', marginBottom: 4 },
  emptySub: { fontSize: 14, color: Colors.textTertiary, fontFamily: 'Inter-Regular', textAlign: 'center' },
  statusTabs: { flexDirection: 'row', gap: 6, marginBottom: Spacing.md, flexWrap: 'wrap' },
  statusTab: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 99, backgroundColor: Colors.surfaceRaised, borderWidth: 1, borderColor: Colors.border, minHeight: 44, justifyContent: 'center' },
  statusTabActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  statusTabText: { fontSize: 13, color: Colors.textSecondary, fontFamily: 'Inter-SemiBold' },
  statusTabTextActive: { color: Colors.background },
  bulkBar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md, padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.gold },
  bulkSelectText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.gold, marginRight: Spacing.sm },
  bulkBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: Radius.sm, backgroundColor: Colors.goldSoft, borderWidth: 1, borderColor: Colors.gold, minHeight: 44, justifyContent: 'center' },
  bulkBtnText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold },
  bulkBtnDanger: { borderColor: Colors.error, backgroundColor: Colors.errorSoft },
  bulkBtnTextDanger: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.error },
  selectAllRow: { paddingVertical: Spacing.sm },
  selectAllText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.gold },
  checkbox: { width: 28, height: 28, borderRadius: 8, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checkboxSelected: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  checkboxMark: { color: Colors.background, fontFamily: 'Inter-ExtraBold', fontSize: 14 },
});
