import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Guide } from '@/types/database';
import { GuideCard } from '@/components/client/GuideCard';

export default async function GuidesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('guides');

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from('guides')
    .select('*')
    .eq('is_available', true)
    .order('rating', { ascending: false });

  return (
    <div>
      <section className="container-editorial pt-16 pb-8">
        <p className="label-folio mb-3">№ 04 · {t('subtitle')}</p>
        <h1 className="font-display text-6xl lg:text-8xl tracking-tightest leading-[0.9]">{t('title')}</h1>
      </section>
      <div className="container-editorial"><div className="editorial-rule mb-12" /></div>
      <section className="container-editorial pb-24">
        {!data || data.length === 0 ? (
          <p className="font-mono text-sm text-ink/50 uppercase tracking-[0.18em]">{t('empty')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((g: Guide) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
