'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Tour } from '@/types/database';

export default function AdminToursPage() {
  const [rows, setRows] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('tours').select('*').order('created_at', { ascending: false }).limit(50);
      setRows((data as any) || []);
      setLoading(false);
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm('Supprimer ce circuit ?')) return;
    const supabase = createClient();
    await supabase.from('tours').delete().eq('id', id);
    setRows(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label-folio mb-3">№ Admin / Tours</p>
          <h1 className="font-display text-5xl tracking-tightest leading-[0.95]">Circuits</h1>
        </div>
        <Link href="/admin/tours/new" className="btn-display-primary">+ Nouveau</Link>
      </div>
      {loading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucun circuit.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left">
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Nom</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Prix</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Durée</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="py-3 font-display text-lg">{r.name_fr || r.name_en}</td>
                <td className="py-3 font-mono text-[10px] uppercase text-terracotta">{r.price} {r.currency}</td>
                <td className="py-3 font-mono text-xs text-ink/50">{r.duration_hours}h</td>
                <td className="py-3 text-right space-x-3">
                  <Link href={`/admin/tours/${r.id}/edit`} className="font-mono text-[10px] uppercase tracking-[0.18em] hover:text-terracotta">Modifier</Link>
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
