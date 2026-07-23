import type { Locale } from '@/types/database';

// Reads a translatable field from a record. Falls back to English, then to any locale.
export function tField(obj: any, base: string, locale: Locale): string {
  const order = [locale, 'en', 'fr', 'sw', 'pt', 'es'];
  for (const l of order) {
    const key = `${base}_${l}`;
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}
