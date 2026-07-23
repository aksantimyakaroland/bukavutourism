import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import type { Tour } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';
import { formatCurrency } from '@/lib/utils/format';

export function TourCard({ tour }: { tour: Tour }) {
  const t = useTranslations('tours');
  const locale = useLocale() as any;
  const name = tField(tour, 'name', locale);

  return (
    <Link href={`/tours/${tour.slug}`} className="group block card-editorial overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden relative bg-forest/5">
        {/* Tours have no image column; we use a generative hero of the price/difficulty as visual */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest to-forest-deep" />
        <div className="absolute inset-0 grid place-items-center text-paper">
          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/60 mb-1">
              {t('duration')} {tour.duration_hours}h
            </p>
            <p className="font-display text-3xl tracking-editorial">{formatCurrency(tour.price, tour.currency, locale)}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/60 mt-1">
              {t(`difficulty.${tour.difficulty}`)}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="label-folio mb-1.5">{t('tour')} · {String(tour.avg_rating ?? '—')}</p>
        <h3 className="font-display text-xl tracking-editorial leading-tight mb-3">{name}</h3>
        <div className="pt-3 border-t border-ink/10 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-ink/50">{tour.booking_count} {t('bookings')}</span>
          <span className="text-terracotta group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
