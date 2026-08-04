import { useLanguage } from '@/context/LanguageContext';

export function useDateFormatter() {
  const { t } = useLanguage();

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const day = d.getDate();
    const year = d.getFullYear();
    const months = t('date.months').split(',');
    const month = months[d.getMonth()] ?? '';
    return t('date.format', { day, month, year });
  };

  return { formatDate };
}
