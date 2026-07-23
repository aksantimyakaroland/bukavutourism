import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Destination, Article } from '@/types/database';
import { DestinationCard } from '@/components/client/DestinationCard';
import { MapContainer } from '@/components/client/MapContainer';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    }}
  );

  const { data: latestArticle } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: featured } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('avg_rating', { ascending: false })
    .limit(3);

  const { data: all } = await supabase
    .from('destinations')
    .select('id, slug, name_en, name_fr, latitude, longitude, category')
    .eq('is_active', true);

  const mapMarkers = (all || [])
    .filter((d: any) => d.latitude != null && d.longitude != null)
    .map((d: any) => ({
      longitude: d.longitude,
      latitude: d.latitude,
      title: d.name_en || d.name_fr,
      subtitle: d.category,
      href: `/${locale}/destinations/${d.slug}`,
    }));

  return (
    <div>
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-forest">
        {featured?.[0]?.image_url && (
          <Image src={featured[0].image_url} alt="" fill className="object-cover opacity-60" sizes="100vw" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest/40 to-transparent" />
        <div className="container-editorial relative z-10 py-16 lg:py-24 text-paper">
          <div className="max-w-3xl animate-revealUp">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-terracotta mb-6">№ 01 · {t('heroEyebrow')}</p>
            <h1 className="font-display text-[14vw] sm:text-[10vw] lg:text-[7.5vw] leading-[0.88] tracking-tightest text-balance">
              {t('heroTitle')}
            </h1>
            <p className="mt-8 text-lg lg:text-xl text-paper/80 max-w-xl text-pretty">{t('heroLead')}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/destinations" className="btn-display bg-terracotta text-paper hover:bg-paper hover:text-terracotta">
                {t('heroCta')} →
              </Link>
              <Link href="/tours" className="btn-display border border-paper/30 text-paper hover:border-paper">
                {t('heroSecondary')}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-8 right-8 hidden md:block z-10">
          <p className="folio text-paper/60 text-right">{t('heroFolio')}</p>
        </div>
      </section>

      <section className="container-editorial py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-7">
            <p className="label-folio mb-3">{t('featuredFolio')}</p>
            <h2 className="font-display text-5xl lg:text-6xl tracking-editorial leading-[0.95] text-balance">{t('featuredTitle')}</h2>
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            <p className="text-ink/70 leading-relaxed">{t('featuredLead')}</p>
            <Link href="/destinations" className="font-mono text-[11px] uppercase tracking-[0.18em] text-terracotta mt-6 inline-block">{t('featuredCta')} →</Link>
          </div>
        </div>
        <div className="editorial-rule mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(featured || []).map((d: Destination) => (
            <DestinationCard key={d.id} d={d} />
          ))}
        </div>
      </section>

      <section className="bg-forest text-paper py-24">
        <div className="container-editorial grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="label-folio text-paper/40 mb-3">{t('mapFolio')}</p>
            <h2 className="font-display text-4xl tracking-editorial leading-tight mb-5">{t('mapTitle')}</h2>
            <p className="text-paper/70 leading-relaxed mb-6">{t('mapLead')}</p>
            <Link href="/destinations" className="btn-display border border-paper/30 text-paper hover:bg-terracotta hover:border-terracotta">{t('mapCta')}</Link>
          </div>
          <div className="lg:col-span-7">
            <MapContainer markers={mapMarkers} />
          </div>
        </div>
      </section>

      {latestArticle && (
        <section className="container-editorial py-24">
          <div className="border border-ink/10 p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-paper-bright">
            <div className="lg:col-span-5">
              <p className="label-folio mb-3">№ Article récent</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta mb-2">
                {latestArticle.published_at ? new Date(latestArticle.published_at).toLocaleDateString('fr-FR') : ''}
              </p>
              <h2 className="font-display text-3xl lg:text-4xl tracking-editorial leading-tight text-balance mb-4">{latestArticle.title_fr}</h2>
              {latestArticle.excerpt_fr && <p className="text-ink/65 leading-relaxed mb-6">{latestArticle.excerpt_fr}</p>}
              <Link href={`/articles/${latestArticle.slug}`} className="btn-display-outline">Lire l&apos;article →</Link>
            </div>
            {latestArticle.image_url && (
              <div className="lg:col-span-7 relative aspect-[16/9] bg-forest/5 border border-ink/10 overflow-hidden">
                <Image src={latestArticle.image_url} alt={latestArticle.title_fr || ''} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="container-editorial py-24">
        <div className="border border-ink/15 p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <p className="label-folio mb-3">{t('contribFolio')}</p>
            <h2 className="font-display text-3xl lg:text-4xl tracking-editorial leading-tight text-balance">{t('contribTitle')}</h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link href="/auth/signup" className="btn-display-primary">{t('contribCta')} →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
