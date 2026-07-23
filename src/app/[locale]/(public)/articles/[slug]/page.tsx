import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types/database';

export default async function ArticleDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single<Article>();

  if (!article) notFound();

  if (article) {
    await supabase.from('articles').update({ view_count: (article.view_count || 0) + 1 }).eq('id', article.id);
  }

  return (
    <article>
      {article.image_url && (
        <section className="relative h-[50vh] overflow-hidden bg-forest">
          <Image src={article.image_url} alt={article.title_fr || ''} fill priority sizes="100vw" className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-forest/30" />
        </section>
      )}

      <section className="container-editorial py-16 max-w-3xl mx-auto">
        <Link href="/articles" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 hover:text-terracotta">
          ← Tous les articles
        </Link>
        <p className="label-folio mt-8 mb-3">
          {article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR') : ''}
          {article.tags?.length ? ` · ${article.tags.join(', ')}` : ''}
        </p>
        <h1 className="font-display text-5xl lg:text-7xl tracking-tightest leading-[0.92] mb-10 text-balance">{article.title_fr}</h1>
        <div className="prose max-w-none text-ink/75 leading-[1.75] text-base lg:text-lg">
          {article.content_fr?.split('\n').map((p, i) => <p key={i} className="mb-4">{p}</p>)}
        </div>
      </section>
    </article>
  );
}
