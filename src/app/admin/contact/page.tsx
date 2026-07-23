'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types/database';

export default function AdminContactPage() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(50);
    setRows((data as any) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    const supabase = createClient();
    await supabase.from('contact_messages').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', id);
    setRows(r => r.map(m => m.id === id ? { ...m, is_read: true } : m));
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce message ?')) return;
    const supabase = createClient();
    await supabase.from('contact_messages').delete().eq('id', id);
    setRows(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Contact</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Messages reçus</h1>
      {loading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucun message.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.id} className={`border ${r.is_read ? 'border-ink/10' : 'border-terracotta/30 bg-terracotta/5'} p-5`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-display text-xl">{r.subject || '(Sans objet)'}</p>
                  <p className="font-mono text-[11px] text-ink/50 mt-1">{r.full_name} &lt;{r.email}&gt;</p>
                </div>
                <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${r.is_read ? 'text-ink/40' : 'text-terracotta'}`}>
                  {r.is_read ? 'Lu' : 'Nouveau'}
                </span>
              </div>
              <p className="text-sm text-ink/70 mb-3">{r.message}</p>
              <div className="flex gap-3">
                {!r.is_read && (
                  <button onClick={() => markRead(r.id)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta hover:text-ink">
                    Marquer comme lu
                  </button>
                )}
                <button onClick={() => remove(r.id)} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 hover:text-terracotta">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
