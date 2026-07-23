'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@/types/database';
import { formatDate } from '@/lib/utils/format';

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return;
      const { data } = await supabase.from('users').select('*').eq('id', u.id).single();
      const p = data as unknown as User;
      setUser(p);
      setFullName(p.full_name || '');
      setPhone(p.phone || '');
    })();
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('users').update({ full_name: fullName, phone }).eq('id', user.id);
    setUser(prev => prev ? { ...prev, full_name: fullName, phone } : null);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Mon profil</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Mon Profil</h1>
      {!user ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</p>
      ) : (
        <div className="border border-ink/10 p-6 max-w-md">
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="label-folio block mb-1">Nom</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input-editorial" />
              </div>
              <div>
                <label className="label-folio block mb-1">Téléphone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-editorial" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-display-primary text-[10px]">
                  {saving ? '…' : 'Enregistrer'}
                </button>
                <button onClick={() => { setEditing(false); setFullName(user.full_name || ''); setPhone(user.phone || ''); }} className="btn-display-outline text-[10px]">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <p><span className="label-folio block mb-1">Email</span>{user.email}</p>
              <p><span className="label-folio block mb-1">Nom</span><span className="font-display text-xl">{user.full_name}</span></p>
              <p><span className="label-folio block mb-1">Téléphone</span>{user.phone || '—'}</p>
              <p><span className="label-folio block mb-1">Type</span><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">{user.user_type}</span></p>
              <p><span className="label-folio block mb-1">Membre depuis</span>{formatDate(user.created_at, 'fr')}</p>
              <button onClick={() => setEditing(true)} className="btn-display-outline text-[10px] mt-4">Modifier</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
