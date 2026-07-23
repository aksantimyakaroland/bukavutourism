import type { Locale } from '@/types/database';

export function formatCurrency(value: number | null | undefined, currency: string = 'USD', locale: Locale = 'en'): string {
  if (value == null) return '—';
  const localeMap: Record<Locale, string> = {
    en: 'en-US', fr: 'fr-FR', sw: 'sw-KE', pt: 'pt-PT', es: 'es-ES',
  };
  try {
    return new Intl.NumberFormat(localeMap[locale] ?? 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export function formatDate(date: string | null | undefined, locale: Locale = 'en'): string {
  if (!date) return '—';
  const localeMap: Record<Locale, string> = {
    en: 'en-US', fr: 'fr-FR', sw: 'sw-KE', pt: 'pt-PT', es: 'es-ES',
  };
  try {
    return new Intl.DateTimeFormat(localeMap[locale] ?? 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export function truncate(text: string, max: number = 140): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trim() + '…';
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
