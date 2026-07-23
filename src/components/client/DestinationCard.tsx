import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import type { Destination } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';
import { formatCurrency } from '@/lib/utils/format';

export function DestinationCard({ d }: { d: Destination }) {
  const t = useTranslations('destinations');
  const locale = useLocale() as any;
  const name = tField(d, 'name', locale);
  const desc = tField(d, 'description', locale);

  return (
    <Link href={`/destinations/${d.slug}`} className="group block card-editorial overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden relative bg-forest/5">
        {d.image_url && (
          <Image
            src={d.image_url}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
          />
        )}
        <div className="absolute top-3 left-3 bg-paper-bright/85 px-2 py-0.5 folio">
          {t(`category.${d.category}`)}
        </div>
        {d.is_featured && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-terracotta text-paper-bright grid place-items-center text-[10px] font-mono">
            ★
          </div>
        )}
      </div>
      <div className="p-5 pt-4">
        <p className="label-folio mb-1.5">{t('destination')} · {String(d.avg_rating || '—')}</p>
        <h3 className="font-display text-2xl tracking-editorial leading-tight mb-2">{name}</h3>
        <p className="text-sm text-ink/65 leading-relaxed line-clamp-2">{desc}</p>
        <div className="mt-4 pt-3 border-t border-ink/10 flex justify-between items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
            {t(`difficulty.${d.difficulty}`)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta group-hover:translate-x-1 transition-transform">
            → {t('viewDetail')}
          </span>
        </div>
      </div>
    </Link>
  );
}
