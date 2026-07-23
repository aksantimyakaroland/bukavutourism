'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Tour } from '@/types/database';

export function TourForm({ initial }: { initial?: Tour }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('destinations').select('id,name_fr').eq('is_active', true);
      setDestinations(data || []);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const slug = String(fd.get('slug') || '').trim();
    if (!slug) { setError('Slug requis.'); setSaving(false); return; }

    const payload = {
      slug,
      destination_id: fd.get('destination_id') || null,
      name_fr: fd.get('name') || '',
      description_fr: fd.get('description') || '',
      price: Number(fd.get('price')) || 0,
      currency: fd.get('currency') || 'USD',
      duration_hours: Number(fd.get('duration_hours')) || 0,
      difficulty: fd.get('difficulty') || 'easy',
      max_participants: Number(fd.get('max_participants')) || 10,
      min_participants: Number(fd.get('min_participants')) || 1,
      includes: (fd.get('includes') as string || '').split('\n').filter(Boolean),
      excludes: (fd.get('excludes') as string || '').split('\n').filter(Boolean),
      is_active: fd.get('is_active') === 'on',
      is_featured: fd.get('is_featured') === 'on',
    };

    const supabase = createClient();
    if (initial) {
      const { error: err } = await supabase.from('tours').update(payload).eq('id', initial.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('tours').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    router.push('/admin/tours');
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
          <label className="label-folio block mb-1.5">Destination</label>
          <select name="destination_id" defaultValue={initial?.destination_id || ''} className="input-editorial">
            <option value="">Aucune</option>
            {destinations.map(d => <option key={d.id} value={d.id}>{d.name_fr}</option>)}
          </select>
        </div>
        <div>
          <label className="label-folio block mb-1.5">Nom *</label>
          <input name="name" defaultValue={initial?.name_fr || ''} required className="input-editorial" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-folio block mb-1.5">Description</label>
          <textarea name="description" rows={3} defaultValue={initial?.description_fr || ''} className="input-editorial resize-none" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Prix ($)</label>
          <input name="price" type="number" step="0.01" defaultValue={initial?.price || 0} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Durée (heures)</label>
          <input name="duration_hours" type="number" defaultValue={initial?.duration_hours || 1} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Difficulté</label>
          <select name="difficulty" defaultValue={initial?.difficulty || 'easy'} className="input-editorial">
            <option value="easy">Facile</option>
            <option value="moderate">Modéré</option>
            <option value="hard">Difficile</option>
            <option value="extreme">Extrême</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-folio block mb-1.5">Participants max</label>
            <input name="max_participants" type="number" defaultValue={initial?.max_participants || 10} className="input-editorial" />
          </div>
          <div>
            <label className="label-folio block mb-1.5">Participants min</label>
            <input name="min_participants" type="number" defaultValue={initial?.min_participants || 1} className="input-editorial" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="label-folio block mb-1.5">Inclus (un par ligne)</label>
          <textarea name="includes" rows={4} defaultValue={(initial?.includes || []).join('\n')} className="input-editorial resize-none" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Non inclus (un par ligne)</label>
          <textarea name="excludes" rows={4} defaultValue={(initial?.excludes || []).join('\n')} className="input-editorial resize-none" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" defaultChecked={initial?.is_featured} />
          <span className="label-folio">À la une</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} />
          <span className="label-folio">Active</span>
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
