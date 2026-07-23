import { useTranslations, useLocale } from 'next-intl';
import type { Rating } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';

export function RatingCard({ rating }: { rating: Rating }) {
  const t = useTranslations('ratings');
  const locale = useLocale() as any;
  const title = tField(rating, 'title', locale);
  const content = tField(rating, 'content', locale);

  return (
    <article className="card-editorial p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(n => (
            <span key={n} className={n <= rating.rating ? 'text-terracotta' : 'text-ink/15'}>★</span>
          ))}
        </div>
        {rating.is_verified && (
          <span className="label-folio text-terracotta">✓ {t('verified')}</span>
        )}
      </div>
      <h4 className="font-display text-xl tracking-editorial leading-tight mb-2">{title}</h4>
      <p className="text-sm text-ink/70 leading-relaxed mb-4">{content}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-ink/10">
        {(['guide_knowledge','value_for_money','safety','overall_experience'] as const).map(k => (
          <div key={k}>
            <p className="label-folio">{t(k)}</p>
            <p className="font-display text-lg tracking-editorial">
              {(rating as any)[k]}/5
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
