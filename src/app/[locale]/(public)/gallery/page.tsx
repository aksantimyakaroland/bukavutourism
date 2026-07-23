import { setRequestLocale, getTranslations, getLocale } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Image from 'next/image';
import type { GalleryItem } from '@/types/database';
import { tField } from '@/lib/utils/i18n-field';

export default async function GalleryPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('gallery');
  const loc = (await getLocale()) as any;

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order');

  return (
    <div>
      <section className="container-editorial pt-16 pb-8">
        <p className="label-folio mb-3">№ 05 · {t('subtitle')}</p>
        <h1 className="font-display text-6xl lg:text-8xl tracking-tightest leading-[0.9]">{t('title')}</h1>
      </section>
      <div className="container-editorial"><div className="editorial-rule mb-12" /></div>
      <section className="container-editorial pb-24">
        {!data || data.length === 0 ? (
          <p className="font-mono text-sm text-ink/50 uppercase tracking-[0.18em]">{t('empty')}</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 space-y-2">
            {data.map((g: GalleryItem) => {
              const caption = tField(g, 'caption', loc);
              const span = g.is_featured ? 'row-span-2' : '';
              return (
                <figure key={g.id} className={`break-inside-avoid mb-2 relative overflow-hidden ${span}`}>
                  <Image src={g.image_url} alt={caption} width={800} height={600} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-[1.2s]" />
                  {(caption || g.credit) && (
                    <figcaption className="pt-2 pb-1 flex justify-between text-xs">
                      <span className="text-ink/70">{caption}</span>
                      {g.credit && <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">© {g.credit}</span>}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
