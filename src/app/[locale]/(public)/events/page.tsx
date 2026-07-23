import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Event } from '@/types/database';
import { EventCard } from '@/components/client/EventCard';

export default async function EventsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('events');

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true });

  return (
    <div>
      <section className="container-editorial pt-16 pb-8">
        <p className="label-folio mb-3">№ 05 · {t('subtitle')}</p>
        <h1 className="font-display text-6xl lg:text-8xl tracking-tightest leading-[0.9]">{t('title')}</h1>
      </section>
      <div className="container-editorial"><div className="editorial-rule mb-12" /></div>
      <section className="container-editorial pb-24 space-y-6">
        {!data || data.length === 0 ? (
          <p className="font-mono text-sm text-ink/50 uppercase tracking-[0.18em]">{t('empty')}</p>
        ) : (
          data.map((e: Event) => <EventCard key={e.id} event={e} />)
        )}
      </section>
    </div>
  );
}
