'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

const BUCKET = 'images';
const FOLDER = 'gallery';

export default function AdminGalleryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedDest, setSelectedDest] = useState('');
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from('gallery').select('*').order('sort_order').limit(50);
    setRows(data || []);
    setLoading(false);
    const { data: d } = await supabase.from('destinations').select('id,name_fr').eq('is_active', true);
    setDestinations((d as any[]) || []);
  }

  useEffect(() => { load(); }, []);

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from(BUCKET).upload(`${FOLDER}/${fileName}`, file);
    if (uploadErr) { alert(uploadErr.message); setUploading(false); return; }
    const { data: pubData } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${fileName}`);
    const { error: insertErr } = await supabase.from('gallery').insert({
      destination_id: selectedDest || null,
      image_url: pubData.publicUrl,
      caption_fr: caption || null,
      sort_order: rows.length,
    });
    if (insertErr) { alert(insertErr.message); setUploading(false); return; }
    setCaption('');
    setSelectedDest('');
    if (fileRef.current) fileRef.current.value = '';
    setUploading(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette image ?')) return;
    const supabase = createClient();
    await supabase.from('gallery').delete().eq('id', id);
    setRows(r => r.filter(x => x.id !== id));
  }

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Galerie</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Galerie</h1>

      <div className="border border-ink/10 p-6 bg-paper-bright mb-10">
        <h2 className="font-display text-2xl tracking-editorial mb-4">Ajouter une image</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="label-folio block mb-1.5">Fichier</label>
            <input ref={fileRef} type="file" accept="image/*" className="block w-full text-sm text-ink/60 file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-forest file:text-paper file:font-mono file:text-[10px] file:uppercase file:tracking-[0.18em] file:cursor-pointer" />
          </div>
          <div>
            <label className="label-folio block mb-1.5">Destination</label>
            <select value={selectedDest} onChange={e => setSelectedDest(e.target.value)} className="input-editorial">
              <option value="">Général</option>
              {destinations.map(d => <option key={d.id} value={d.id}>{d.name_fr}</option>)}
            </select>
          </div>
          <div>
            <label className="label-folio block mb-1.5">Légende</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} className="input-editorial" />
          </div>
          <button onClick={handleUpload} disabled={uploading} className="btn-display-primary justify-center disabled:opacity-50">
            {uploading ? 'Upload…' : 'Upload →'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucune image.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {rows.map(r => (
            <div key={r.id} className="aspect-square overflow-hidden bg-forest/5 border border-ink/10 relative group">
              <Image src={r.image_url} alt={r.caption_fr || ''} fill className="object-cover" sizes="25vw" />
              <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-paper text-xs">{r.caption_fr || '—'}</p>
                <button onClick={() => remove(r.id)} className="font-mono text-[9px] uppercase tracking-[0.18em] text-terracotta text-left mt-1">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
