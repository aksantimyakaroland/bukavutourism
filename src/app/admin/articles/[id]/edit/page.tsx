'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArticleForm } from '@/components/admin/ArticleForm';
import type { Article } from '@/types/database';

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Article | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('articles').select('*').eq('id', id).single();
      setInitial(data as any);
    })();
  }, [id]);

  if (!initial) return <div className="p-12 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</div>;

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Articles / Modifier</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Modifier — {initial.title_fr}</h1>
      <ArticleForm initial={initial} />
    </div>
  );
}
