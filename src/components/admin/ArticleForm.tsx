'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { Article } from '@/types/database';

const BUCKET = 'images';
const FOLDER = 'articles';

export function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(`${FOLDER}/${fileName}`, file);
    if (uploadErr) { setError(uploadErr.message); setUploading(false); return; }
    const { data: pubData } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${fileName}`);
    setImageUrl(pubData.publicUrl);
    setUploading(false);
  }

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
      content_fr: fd.get('content') || '',
      excerpt_fr: fd.get('excerpt') || '',
      image_url: imageUrl || null,
      tags: (fd.get('tags') as string || '').split(',').map(s => s.trim()).filter(Boolean),
      is_published: fd.get('is_published') === 'on',
      published_at: fd.get('is_published') === 'on' ? new Date().toISOString() : null,
    };

    const supabase = createClient();
    if (initial) {
      const { error: err } = await supabase.from('articles').update(payload).eq('id', initial.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('articles').insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    router.push('/admin/articles');
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
          <label className="label-folio block mb-1.5">Image</label>
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="block w-full text-sm text-ink/60 file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-forest file:text-paper file:font-mono file:text-[10px] file:uppercase file:tracking-[0.18em] file:cursor-pointer" />
            {uploading && <p className="font-mono text-[10px] text-terracotta">Upload en cours…</p>}
            {imageUrl && <Image src={imageUrl} alt="" width={400} height={160} className="w-full object-cover border border-ink/10" style={{ maxHeight: 160 }} />}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="label-folio block mb-1.5">Extrait</label>
          <textarea name="excerpt" rows={2} defaultValue={initial?.excerpt_fr || ''} className="input-editorial resize-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="label-folio block mb-1.5">Contenu</label>
          <textarea name="content" rows={10} defaultValue={initial?.content_fr || ''} className="input-editorial resize-none" />
        </div>
        <div>
          <label className="label-folio block mb-1.5">Tags (séparés par des virgules)</label>
          <input name="tags" defaultValue={(initial?.tags || []).join(', ')} className="input-editorial" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_published" defaultChecked={initial?.is_published} />
          <span className="label-folio">Publié</span>
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
