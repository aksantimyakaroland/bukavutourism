'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Category } from '@/types/database';
import { cn } from '@/lib/utils/cn';

const CATEGORIES: Category[] = ['nature', 'cultural', 'adventure', 'urban', 'gastronomy'];

export function DestinationFilters({ current }: { current?: Category }) {
  const t = useTranslations('destinations');
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState<Category | undefined>(current);

  function pick(c?: Category) {
    setActive(c);
    const params = new URLSearchParams(search.toString());
    if (c) params.set('category', c);
    else params.delete('category');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="container-editorial sticky top-16 z-30 bg-paper/80 backdrop-blur-md py-4 border-y border-ink/10">
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-folio mr-2">{t('filtersTitle')}</span>
        <button
          onClick={() => pick(undefined)}
          className={cn(
            'font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 border border-ink/15 hover:border-terracotta hover:text-terracotta transition-colors',
            !active && 'bg-forest text-paper border-forest'
          )}
        >
          {t('all')}
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => pick(c)}
            className={cn(
              'font-mono text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 border border-ink/15 hover:border-terracotta hover:text-terracotta transition-colors',
              active === c && 'bg-forest text-paper border-forest'
            )}
          >
            {t(`category.${c}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
