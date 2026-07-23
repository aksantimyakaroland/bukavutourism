import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import type { Guide } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';
import { formatCurrency, getInitials } from '@/lib/utils/format';

export function GuideCard({ guide }: { guide: Guide }) {
  const t = useTranslations('guides');
  const locale = useLocale() as any;
  const bio = tField(guide, 'bio', locale);

  return (
    <article className="card-editorial p-5 group">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-forest text-paper-bright grid place-items-center font-display text-xl shrink-0">
          {getInitials(guide.full_name || t('placeholder'))}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl tracking-editorial leading-tight">{guide.full_name}</h3>
          <p className="label-folio mt-1">
            {guide.experience_years} {t('years')} · {guide.rating.toFixed(1)} ★ · {guide.review_count} {t('reviews')}
          </p>
        </div>
        {guide.is_available && (
          <span className="w-2 h-2 bg-terracotta rounded-full" title={t('available')} />
        )}
      </div>
      <p className="text-sm text-ink/65 leading-relaxed line-clamp-3 mb-4">{bio}</p>
      <div className="flex flex-wrap gap-1.5">
        {guide.specialties.slice(0, 4).map(s => (
          <span key={s} className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 border border-ink/15 text-ink/70">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-ink/10 flex justify-between items-center">
        <span className="text-sm">{formatCurrency(guide.hourly_rate, 'USD', locale)}/h</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">
          {guide.languages.join(' · ')}
        </span>
      </div>
    </article>
  );
}
