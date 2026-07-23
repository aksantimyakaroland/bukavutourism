'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Event } from '@/types/database';

export function EventForm({ initial }: { initial?: Event }) {
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
      title_fr: fd.get('title') || '',
      description_fr: fd.get('description') || '',
      event_date: fd.get('event_date') || null,
      end_date: fd.get('end_date') || null,
      location: fd.get('location') || '',
      category: fd.get('category') || 'cultural',
      capacity: Number(fd.get('capacity')) || 0,
      ticket_price: Number(fd.get('ticket_price')) || 0,
      is_free: fd.get('is_free') === 'on',
      is_active: fd.get('is_active') === 'on',
    };

    const supabase = createClient();
    if (initial) {
      const { error: err } = await supabase.from('events').update(payload).eq('id', initial.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('events').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    router.push('/admin/events');
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
          <label className="label-folio block mb-1.5">Titre *</label>
          <input name="title" defaultValue={initial?.title_fr || ''} required className="input-editorial" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-folio block mb-1.5">Description</label>
          <textarea name="description" rows={3} defaultValue={initial?.description_fr || ''} className="input-editorial resize-none" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Date début *</label>
          <input name="event_date" type="datetime-local" defaultValue={initial?.event_date ? new Date(initial.event_date).toISOString().slice(0, 16) : ''} required className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Date fin</label>
          <input name="end_date" type="datetime-local" defaultValue={initial?.end_date ? new Date(initial.end_date).toISOString().slice(0, 16) : ''} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Lieu</label>
          <input name="location" defaultValue={initial?.location || ''} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Catégorie</label>
          <select name="category" defaultValue={initial?.category || 'cultural'} className="input-editorial">
            <option value="cultural">Culturel</option>
            <option value="nature">Nature</option>
            <option value="adventure">Aventure</option>
            <option value="gastronomy">Gastronomie</option>
            <option value="urban">Urbain</option>
          </select>
        </div>
        <div>
          <label className="label-folio block mb-1.5">Capacité</label>
          <input name="capacity" type="number" defaultValue={initial?.capacity || 0} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Prix du billet ($)</label>
          <input name="ticket_price" type="number" step="0.01" defaultValue={initial?.ticket_price || 0} className="input-editorial" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_free" defaultChecked={initial?.is_free} />
          <span className="label-folio">Gratuit</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} />
          <span className="label-folio">Actif</span>
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
