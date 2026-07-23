import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Destination, Tour, Rating } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';
import { MapContainer } from '@/components/client/MapContainer';
import { RatingCard } from '@/components/client/RatingCard';
import { BookingButton } from '@/components/client/BookingButton';

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: d } = await supabase.from('destinations').select('name_fr, description_fr').eq('slug', slug).eq('is_active', true).maybeSingle();
  return {
    title: d?.name_fr || 'Destination',
    description: (d?.description_fr || 'Découvrez cette destination à Bukavu, Sud-Kivu.').slice(0, 160),
    openGraph: { title: d?.name_fr, description: (d?.description_fr || '').slice(0, 160) },
    alternates: { canonical: `https://visitbukavu.netlify.app/destinations/${slug}` },
  };
}

export default async function DestinationDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('destinations');
  const loc = (await getLocale()) as any;

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: dest } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Destination>();

  if (!dest) notFound();

  const name = tField(dest, 'name', loc);
  const desc = tField(dest, 'description', loc);

  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .eq('destination_id', dest.id)
    .eq('is_active', true);

  const { data: ratings } = await supabase
    .from('ratings')
    .select('*')
    .eq('is_moderated', true)
    .order('helpful_count', { ascending: false })
    .limit(3);

  const { data: gallery } = await supabase
    .from('gallery')
    .select('*')
    .eq('destination_id', dest.id)
    .order('sort_order');

  return (
    <article>
      {/* Full-bleed hero image */}
      <section className="relative h-[70vh] overflow-hidden bg-forest">
        {dest.image_url && (
          <Image src={dest.image_url} alt={name} fill priority sizes="100vw" className="object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-forest/30" />
        <div className="container-editorial absolute inset-x-0 bottom-10 z-10 text-paper">
          <p className="folio text-paper/70 mb-3">{dest.category} · {dest.difficulty}</p>
          <h1 className="font-display text-6xl lg:text-8xl tracking-tightest leading-[0.9] max-w-4xl text-balance">{name}</h1>
        </div>
      </section>

      {/* Body — editorial long-form */}
      <section className="container-editorial py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
          <Link href="/destinations" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 hover:text-terracotta">
            {t('back')}
          </Link>
          <div className="mt-6 pt-6 border-t border-ink/10 space-y-3 text-sm">
            <p><span className="label-folio block mb-1">{t('destination')}</span></p>
            <p><span className="label-folio block mb-1">★ {dest.avg_rating ?? '—'}</span></p>
            {dest.latitude && dest.longitude && (
              <p><span className="label-folio block mb-1">{t('gps')}</span>{dest.latitude.toFixed(4)}, {dest.longitude.toFixed(4)}</p>
            )}
            <BookingButton destinationId={dest.id} destinationName={name} />
          </div>
        </aside>

        <div className="lg:col-span-9 max-w-2xl">
          <p className="font-display text-2xl lg:text-3xl tracking-editorial leading-snug text-ink/85 mb-8 text-pretty">
            {desc || t('noDescription')}
          </p>
          <div className="dropcap text-base text-ink/75 leading-[1.75] mb-10">
            {desc}
          </div>
        </div>
      </section>

      {/* Map */}
      {dest.latitude && dest.longitude && (
        <section className="container-editorial pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-6">
            <div className="lg:col-span-6">
              <p className="label-folio mb-2">{t('subtitle')}</p>
              <h2 className="font-display text-3xl tracking-editorial leading-tight">{t('whereToFind')}</h2>
            </div>
          </div>
          <MapContainer markers={[{ longitude: dest.longitude, latitude: dest.latitude, title: name }]} center={[dest.longitude, dest.latitude]} zoom={12} />
        </section>
      )}

      {/* Tours */}
      {(tours || []).length > 0 && (
        <section className="container-editorial py-16 border-t border-ink/10">
          <h2 className="font-display text-4xl tracking-editorial mb-8">{t('toursHere')}</h2>
          <div className="divide-y divide-ink/10">
            {(tours || []).map((tour: Tour) => {
              const tourName = tField(tour, 'name', loc);
              return (
                <Link href={`/tours/${tour.slug}`} key={tour.id} className="group flex items-baseline justify-between py-5 hover:text-terracotta transition-colors">
                  <h3 className="font-display text-2xl tracking-editorial group-hover:translate-x-2 transition-transform">{tourName}</h3>
                  <span className="font-mono text-xs uppercase tracking-[0.18em]">{tour.duration_hours}h · ${tour.price}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Gallery */}
      {(gallery || []).length > 0 && (
        <section className="container-editorial py-16 border-t border-ink/10">
          <h2 className="font-display text-4xl tracking-editorial mb-8">{t('gallery')}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {gallery!.map(g => (
              <div key={g.id} className="aspect-square overflow-hidden bg-forest/5">
                <Image src={g.image_url} alt={g.caption_en || ''} width={400} height={400} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[1.2s]" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ratings */}
      {(ratings || []).length > 0 && (
        <section className="container-editorial py-16 border-t border-ink/10">
          <h2 className="font-display text-4xl tracking-editorial mb-8">{t('reviews')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(ratings || []).map((r: Rating) => (
              <RatingCard key={r.id} rating={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
