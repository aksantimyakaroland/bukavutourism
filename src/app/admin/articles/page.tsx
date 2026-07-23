'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Article } from '@/types/database';

export default function AdminArticlesPage() {
  const [rows, setRows] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(50);
      setRows((data as any) || []);
      setLoading(false);
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm('Supprimer cet article ?')) return;
    const supabase = createClient();
    await supabase.from('articles').delete().eq('id', id);
    setRows(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label-folio mb-3">№ Admin / Articles</p>
          <h1 className="font-display text-5xl tracking-tightest leading-[0.95]">Articles</h1>
        </div>
        <Link href="/admin/articles/new" className="btn-display-primary">+ Nouveau</Link>
      </div>
      {loading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucun article.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left">
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Titre</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Statut</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Vues</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="py-3 font-display text-lg">{r.title_fr || r.title_en}</td>
                <td className="py-3">
                  <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${r.is_published ? 'text-terracotta' : 'text-ink/40'}`}>
                    {r.is_published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="py-3 font-mono text-xs">{r.view_count}</td>
                <td className="py-3 text-right space-x-3">
                  <Link href={`/admin/articles/${r.id}/edit`} className="font-mono text-[10px] uppercase tracking-[0.18em] hover:text-terracotta">Modifier</Link>
                  <button onClick={() => remove(r.id)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 hover:text-terracotta">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
