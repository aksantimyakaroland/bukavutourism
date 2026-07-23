'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Rating } from '@/types/database';

export default function AdminRatingsPage() {
  const [rows, setRows] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('ratings').select('*').order('created_at', { ascending: false });
      setRows((data as any) || []);
      setLoading(false);
    })();
  }, []);

  async function moderate(id: string, approved: boolean) {
    const supabase = createClient();
    const { error } = await supabase.from('ratings').update({
      is_moderated: true,
      moderator_notes: approved ? 'Approuvé' : 'Rejeté',
    }).eq('id', id);
    if (!error) {
      setRows(r => r.map(x => x.id === id ? { ...x, is_moderated: true } : x));
    }
  }

  if (loading) return <p className="p-12 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</p>;

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Avis</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Modération des avis</h1>
      {rows.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucun avis.</p>
      ) : (
        <div className="space-y-4">
          {rows.map(r => (
            <div key={r.id} className="border border-ink/10 p-5 grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-2">
                <div className="text-terracotta text-lg">{'★'.repeat(r.rating)}<span className="text-ink/15">{'★'.repeat(5 - r.rating)}</span></div>
                <p className="label-folio mt-2">{r.is_moderated ? '✓ Modéré' : ' attends'}</p>
              </div>
              <div className="col-span-12 sm:col-span-8">
                <p className="font-display text-xl">{r.title_fr || r.title_en || 'Sans titre'}</p>
                <p className="text-sm text-ink/65 mt-1">{r.content_fr || r.content_en}</p>
              </div>
              <div className="col-span-12 sm:col-span-2 text-right">
                {!r.is_moderated ? (
                  <>
                    <button onClick={() => moderate(r.id, true)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta block mb-2 hover:underline">Approuver</button>
                    <button onClick={() => moderate(r.id, false)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 block hover:underline">Rejeter</button>
                  </>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">✓ {new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
