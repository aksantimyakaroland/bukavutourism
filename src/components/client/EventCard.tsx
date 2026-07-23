import { useTranslations, useLocale } from 'next-intl';
import type { Event } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';
import { formatDate, formatCurrency } from '@/lib/utils/format';

export function EventCard({ event }: { event: Event }) {
  const t = useTranslations('events');
  const locale = useLocale() as any;
  const title = tField(event, 'title', locale);
  const desc = tField(event, 'description', locale);

  const d = new Date(event.event_date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();

  return (
    <article className="card-editorial p-6 group grid grid-cols-12 gap-4">
      <div className="col-span-3 sm:col-span-2 border-r border-ink/10 pr-4">
        <p className="font-display text-4xl tracking-editorial leading-none">{day}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta mt-1">{month} {year}</p>
      </div>
      <div className="col-span-9 sm:col-span-10">
        <p className="label-folio mb-1">{event.location} {event.is_free ? `· ${t('free')}` : `· ${formatCurrency(event.ticket_price, 'USD', locale)}`}</p>
        <h3 className="font-display text-2xl tracking-editorial leading-tight mb-2">{title}</h3>
        <p className="text-sm text-ink/65 leading-relaxed line-clamp-2">{desc}</p>
      </div>
    </article>
  );
}
