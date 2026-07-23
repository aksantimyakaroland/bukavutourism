'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Destination, Category, Difficulty } from '@/types/database';

const CATEGORIES: Category[] = ['nature', 'cultural', 'adventure', 'urban', 'gastronomy'];
const DIFFICULTIES: Difficulty[] = ['easy', 'moderate', 'hard', 'extreme'];

const BUCKET = 'images';
const FOLDER = 'destinations';

export function DestinationForm({ initial }: { initial?: Destination }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `${FOLDER}/${fileName}`;
      const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(filePath, file);
      if (uploadErr) throw uploadErr;
      const { data: pubData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      setImageUrl(pubData.publicUrl);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const slug = String(fd.get('slug') || '').trim();
    if (!slug) {
      setError('Slug requis.');
      setSaving(false);
      return;
    }
    const payload: Record<string, any> = {
      slug,
      name_fr: fd.get('name') || '',
      description_fr: fd.get('description') || '',
      category: fd.get('category'),
      difficulty: fd.get('difficulty'),
      latitude: fd.get('latitude') ? Number(fd.get('latitude')) : null,
      longitude: fd.get('longitude') ? Number(fd.get('longitude')) : null,
      image_url: imageUrl || null,
      is_featured: fd.get('is_featured') === 'on',
      is_active: fd.get('is_active') === 'on',
      visit_count: Number(fd.get('visit_count')) || 0,
      avg_rating: Number(fd.get('avg_rating')) || 0,
    };

    const supabase = createClient();
    if (initial) {
      const { error: err } = await supabase.from('destinations').update(payload).eq('id', initial.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('destinations').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    router.push('/admin/destinations');
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
          <label className="label-folio block mb-1.5">Image</label>
          <div className="space-y-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-ink/60 file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-forest file:text-paper file:font-mono file:text-[10px] file:uppercase file:tracking-[0.18em] file:cursor-pointer"
            />
            {uploading && <p className="font-mono text-[10px] text-terracotta">Upload en cours…</p>}
            {imageUrl && (
              <div className="relative aspect-video bg-forest/5 border border-ink/10 overflow-hidden">
                <Image src={imageUrl} alt="" fill className="object-cover" sizes="400px" />
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="label-folio block mb-1.5">Nom *</label>
          <input name="name" defaultValue={initial?.name_fr || ''} required className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Catégorie</label>
          <select name="category" defaultValue={initial?.category || 'nature'} className="input-editorial">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label-folio block mb-1.5">Description</label>
          <textarea name="description" rows={4} defaultValue={initial?.description_fr || ''} className="input-editorial resize-none" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Difficulté</label>
          <select name="difficulty" defaultValue={initial?.difficulty || 'easy'} className="input-editorial">
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="label-folio block mb-1.5">Latitude</label>
          <input name="latitude" type="number" step="0.0001" defaultValue={initial?.latitude ?? ''} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Longitude</label>
          <input name="longitude" type="number" step="0.0001" defaultValue={initial?.longitude ?? ''} className="input-editorial" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="label-folio block mb-1">Nombre de visites</label>
          <input name="visit_count" type="number" defaultValue={initial?.visit_count ?? 0} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1">Note moyenne</label>
          <input name="avg_rating" type="number" step="0.1" defaultValue={initial?.avg_rating ?? 0} className="input-editorial" />
        </div>
        <label className="flex items-center gap-2 self-end pb-3">
          <input type="checkbox" name="is_featured" defaultChecked={initial?.is_featured} />
          <span className="label-folio">À la une</span>
        </label>
        <label className="flex items-center gap-2 self-end pb-3">
          <input type="checkbox" name="is_active" defaultChecked={initial?.is_active ?? true} />
          <span className="label-folio">Active</span>
        </label>
      </div>

      {error && <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-display-primary disabled:opacity-50">
          {saving ? 'Enregistrement…' : 'Enregistrer →'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-display-outline">Annuler</button>
      </div>
    </form>
  );
}
