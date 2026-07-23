'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Guide } from '@/types/database';

export function GuideForm({ initial }: { initial?: Guide }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const slug = String(fd.get('slug') || '').trim();
    if (!slug) { setError('Slug requis.'); setSaving(false); return; }

    const payload = {
      slug,
      full_name: fd.get('full_name') || '',
      email: fd.get('email') || '',
      phone: fd.get('phone') || '',
      bio_fr: fd.get('bio') || '',
      specialties: (fd.get('specialties') as string || '').split(',').map(s => s.trim()).filter(Boolean),
      languages: (fd.get('languages') as string || '').split(',').map(s => s.trim()).filter(Boolean),
      hourly_rate: Number(fd.get('hourly_rate')) || 0,
      experience_years: Number(fd.get('experience_years')) || 0,
      is_available: fd.get('is_available') === 'on',
    };

    const supabase = createClient();
    if (initial) {
      const { error: err } = await supabase.from('guides').update(payload).eq('id', initial.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('guides').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    router.push('/admin/guides');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label-folio block mb-1.5">Slug *</label>
          <input name="slug" defaultValue={initial?.slug} required className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Email *</label>
          <input name="email" type="email" defaultValue={initial?.email} required className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Nom complet *</label>
          <input name="full_name" defaultValue={initial?.full_name} required className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Téléphone</label>
          <input name="phone" defaultValue={initial?.phone || ''} className="input-editorial" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-folio block mb-1.5">Biographie</label>
          <textarea name="bio" rows={4} defaultValue={initial?.bio_fr || ''} className="input-editorial resize-none" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Spécialités (séparées par des virgules)</label>
          <input name="specialties" defaultValue={(initial?.specialties || []).join(', ')} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Langues (séparées par des virgules)</label>
          <input name="languages" defaultValue={(initial?.languages || []).join(', ')} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Tarif horaire ($)</label>
          <input name="hourly_rate" type="number" step="0.01" defaultValue={initial?.hourly_rate || 0} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Années d&apos;expérience</label>
          <input name="experience_years" type="number" defaultValue={initial?.experience_years || 0} className="input-editorial" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_available" defaultChecked={initial?.is_available ?? true} />
          <span className="label-folio">Disponible</span>
        </label>
      </div>

      {error && <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-display-primary disabled:opacity-50">
          {saving ? 'Enregistrement…' : 'Enregistrer →'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-display-outline">Annuler</button>
      </div>
    </form>
  );
}
