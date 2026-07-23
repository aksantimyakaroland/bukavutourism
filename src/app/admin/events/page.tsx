'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Event } from '@/types/database';

export default function AdminEventsPage() {
  const [rows, setRows] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false }).limit(50);
      setRows((data as any) || []);
      setLoading(false);
    })();
  }, []);

  async function remove(id: string) {
    if (!confirm('Supprimer cet événement ?')) return;
    const supabase = createClient();
    await supabase.from('events').delete().eq('id', id);
    setRows(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="label-folio mb-3">№ Admin / Événements</p>
          <h1 className="font-display text-5xl tracking-tightest leading-[0.95]">Événements</h1>
        </div>
        <Link href="/admin/events/new" className="btn-display-primary">+ Nouveau</Link>
      </div>
      {loading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucun événement.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left">
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Titre</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Date</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Lieu</th>
              <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="py-3 font-display text-lg">{r.title_fr || r.title_en}</td>
                <td className="py-3 font-mono text-xs">{new Date(r.event_date).toLocaleDateString('fr-FR')}</td>
                <td className="py-3 font-mono text-[10px] text-ink/50">{r.location || '—'}</td>
                <td className="py-3 text-right space-x-3">
                  <Link href={`/admin/events/${r.id}/edit`} className="font-mono text-[10px] uppercase tracking-[0.18em] hover:text-terracotta">Modifier</Link>
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
