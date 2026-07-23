import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Destination, Category } from '@/types/database';
import { DestinationCard } from '@/components/client/DestinationCard';
import { DestinationFilters } from '@/components/client/DestinationFilters';

const CATEGORIES: Category[] = ['nature', 'cultural', 'adventure', 'urban', 'gastronomy'];

export default async function DestinationsPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('destinations');

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  let query = supabase.from('destinations').select('*').eq('is_active', true);
  const cat = searchParams.category as Category | undefined;
  if (cat && CATEGORIES.includes(cat)) query = query.eq('category', cat);
  query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });
  const { data } = await query;

  return (
    <div>
      <section className="container-editorial pt-16 pb-8">
        <p className="label-folio mb-3">№ 02 · {t('subtitle')}</p>
        <h1 className="font-display text-6xl lg:text-8xl tracking-tightest leading-[0.9]">{t('title')}</h1>
      </section>

      <DestinationFilters current={cat} />

      <section className="container-editorial py-12">
        <div className="editorial-rule mb-12" />
        {!data || data.length === 0 ? (
          <p className="font-mono text-sm text-ink/50 uppercase tracking-[0.18em]">{t('empty')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((d: Destination) => (
              <DestinationCard key={d.id} d={d} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
