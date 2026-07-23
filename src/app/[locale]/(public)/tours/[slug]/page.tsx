import { setRequestLocale, getTranslations, getLocale } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Tour, Rating } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';
import { formatCurrency } from '@/lib/utils/format';
import { RatingCard } from '@/components/client/RatingCard';
import { TourBookingButton } from '@/components/client/TourBookingButton';

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: t } = await supabase.from('tours').select('name_fr, description_fr').eq('slug', slug).eq('is_active', true).maybeSingle();
  return {
    title: t?.name_fr || 'Circuit',
    description: (t?.description_fr || 'Découvrez ce circuit à Bukavu, Sud-Kivu.').slice(0, 160),
    openGraph: { title: t?.name_fr, description: (t?.description_fr || '').slice(0, 160) },
    alternates: { canonical: `https://visitbukavu.netlify.app/tours/${slug}` },
  };
}

export default async function TourDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('tours');
  const loc = (await getLocale()) as any;

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Tour>();

  if (!tour) notFound();
  const name = tField(tour, 'name', loc);
  const desc = tField(tour, 'description', loc);

  const { data: dest } = await supabase
    .from('destinations')
    .select('name_fr')
    .eq('id', tour.destination_id)
    .single();

  const { data: ratings } = await supabase
    .from('ratings')
    .select('*')
    .eq('tour_id', tour.id)
    .eq('is_moderated', true)
    .order('helpful_count', { ascending: false })
    .limit(3);

  return (
    <article>
      <section className="container-editorial pt-16 pb-6">
        <Link href="/tours" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 hover:text-terracotta">
          {t('back')}
        </Link>
        <p className="label-folio mt-8 mb-3">№ {tour.id.slice(0,4).toUpperCase()} · {t('tour')}</p>
        <h1 className="font-display text-5xl lg:text-7xl tracking-tightest leading-[0.92] max-w-3xl text-balance">{name}</h1>
      </section>

      <section className="container-editorial py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 border-y border-ink/10">
        <div className="lg:col-span-7 max-w-xl">
          <p className="dropcap text-base text-ink/75 leading-[1.75]">{desc}</p>
        </div>
        <aside className="lg:col-span-5">
          <div className="bg-forest text-paper p-8 grid grid-cols-2 gap-6">
            <div>
              <p className="label-folio text-paper/40 mb-1">{t('duration')}</p>
              <p className="font-display text-3xl tracking-editorial">{tour.duration_hours}<span className="text-sm ml-1">{t('hours')}</span></p>
            </div>
            <div>
              <p className="label-folio text-paper/40 mb-1">{t('maxParticipants')}</p>
              <p className="font-display text-3xl tracking-editorial">{tour.max_participants}</p>
            </div>
            <div>
              <p className="label-folio text-paper/40 mb-1">{t('difficulty')}</p>
              <p className="font-display text-2xl tracking-editorial">{t(`difficulty.${tour.difficulty}`)}</p>
            </div>
            <div>
              <p className="label-folio text-paper/40 mb-1">{t('price')}</p>
              <p className="font-display text-3xl tracking-editorial text-terracotta">{formatCurrency(tour.price, tour.currency, loc)}</p>
            </div>
            <div className="col-span-2 pt-4 border-t border-paper/15">
              <TourBookingButton destinationId={tour.destination_id} tourId={tour.id} destinationName={dest?.name_fr || ''} />
            </div>
          </div>
        </aside>
      </section>

      <section className="container-editorial py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-6">
          <h2 className="font-display text-3xl tracking-editorial mb-5">{t('includes')}</h2>
          <ul className="space-y-2">
            {tour.includes.map(i => (
              <li key={i} className="text-ink/75 leading-relaxed flex gap-2">
                <span className="text-terracotta">+</span> {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6">
          <h2 className="font-display text-3xl tracking-editorial mb-5">{t('excludes')}</h2>
          <ul className="space-y-2">
            {tour.excludes.map(i => (
              <li key={i} className="text-ink/75 leading-relaxed flex gap-2">
                <span className="text-ink/30">−</span> {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {tour.itinerary && tour.itinerary.length > 0 && (
        <section className="container-editorial py-16 border-t border-ink/10">
          <h2 className="font-display text-4xl tracking-editorial mb-10">{t('itinerary')}</h2>
          <ol className="relative">
            {tour.itinerary.map((step, i) => (
              <li key={i} className="grid grid-cols-12 gap-6 py-6 border-t border-ink/10 first:border-0">
                <div className="col-span-2 sm:col-span-1">
                  <p className="font-display text-3xl tracking-editorial text-terracotta">{String(step.day).padStart(2,'0')}</p>
                </div>
                <div className="col-span-10 sm:col-span-11">
                  <h3 className="font-display text-2xl tracking-editorial mb-2">{step.title}</h3>
                  <p className="text-ink/70 leading-relaxed">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {ratings && ratings.length > 0 && (
        <section className="container-editorial py-16 border-t border-ink/10">
          <h2 className="font-display text-4xl tracking-editorial mb-8">{t('reviews')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ratings.map(r => <RatingCard key={r.id} rating={r} />)}
          </div>
        </section>
      )}
    </article>
  );
}
