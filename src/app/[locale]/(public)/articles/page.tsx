import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { Article } from '@/types/database';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Blog de voyage — actualités, guides et récits sur Bukavu, le Sud-Kivu et la République Démocratique du Congo.',
  openGraph: { title: 'Articles', description: 'Blog de voyage sur Bukavu et le Sud-Kivu.' },
  alternates: { canonical: 'https://visitbukavu.netlify.app/articles' },
};

export default async function ArticlesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  return (
    <div>
      <section className="container-editorial pt-16 pb-8">
        <p className="label-folio mb-3">№ Articles</p>
        <h1 className="font-display text-6xl lg:text-8xl tracking-tightest leading-[0.9]">Articles</h1>
      </section>

      <section className="container-editorial py-12">
        <div className="editorial-rule mb-12" />
        {!articles || articles.length === 0 ? (
          <p className="font-mono text-sm text-ink/50 uppercase tracking-[0.18em]">Aucun article pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a: Article) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="group card-editorial overflow-hidden">
                {a.image_url && (
                  <div className="aspect-[16/10] overflow-hidden relative bg-forest/5">
                    <Image src={a.image_url} alt={a.title_fr || ''} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" />
                  </div>
                )}
                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta mb-2">
                    {a.published_at ? new Date(a.published_at).toLocaleDateString('fr-FR') : ''}
                  </p>
                  <h2 className="font-display text-2xl tracking-editorial leading-tight mb-2">{a.title_fr}</h2>
                  {a.excerpt_fr && <p className="text-sm text-ink/65 leading-relaxed line-clamp-2">{a.excerpt_fr}</p>}
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta mt-4 group-hover:translate-x-1 transition-transform">Lire →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
