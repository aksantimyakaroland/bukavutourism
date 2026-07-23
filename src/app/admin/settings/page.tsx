'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Settings = Record<string, string>;

const DEFAULT: Settings = {
  site_name: 'Visiter Bukavu',
  tagline: 'Voyagez au Sud-Kivu, Congo. Lacs, gorilles, montagnes, culture.',
  contact_email: 'contact@visitbukavu.cd',
  phone: '+243 123 456 789',
  currency: 'USD',
  default_locale: 'fr',
  max_participants_per_booking: '20',
  email_notif_new_reservation: 'true',
  email_notif_contact: 'true',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.from('settings').select('key, value');
      if (data) {
        const merged = { ...DEFAULT };
        for (const row of data) {
          merged[row.key] = String(row.value ?? '');
        }
        setSettings(merged);
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();

    for (const [key, value] of Object.entries(settings)) {
      const existing = await supabase.from('settings').select('id').eq('key', key).maybeSingle();
      if (existing.data) {
        await supabase.from('settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
      } else {
        await supabase.from('settings').insert({ key, value, category: 'general' });
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Paramètres</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Paramètres</h1>
      <div className="max-w-xl space-y-5">
        <div>
          <label className="label-folio block mb-1">Nom du site</label>
          <input value={settings.site_name} onChange={e => setSettings(s => ({ ...s, site_name: e.target.value }))} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1">Slogan</label>
          <input value={settings.tagline} onChange={e => setSettings(s => ({ ...s, tagline: e.target.value }))} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1">Email de contact</label>
          <input value={settings.contact_email} onChange={e => setSettings(s => ({ ...s, contact_email: e.target.value }))} className="input-editorial" />
        </div>
        <div>
          <label className="label-folio block mb-1">Téléphone</label>
          <input value={settings.phone} onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))} className="input-editorial" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-folio block mb-1">Devise</label>
            <input value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} className="input-editorial" />
          </div>
          <div>
            <label className="label-folio block mb-1">Participants max</label>
            <input value={settings.max_participants_per_booking} onChange={e => setSettings(s => ({ ...s, max_participants_per_booking: e.target.value }))} className="input-editorial" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="label-folio block">Notifications</label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.email_notif_new_reservation === 'true'} onChange={e => setSettings(s => ({ ...s, email_notif_new_reservation: e.target.checked ? 'true' : 'false' }))} />
            Email pour nouvelle réservation
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.email_notif_contact === 'true'} onChange={e => setSettings(s => ({ ...s, email_notif_contact: e.target.checked ? 'true' : 'false' }))} />
            Email pour nouveau message contact
          </label>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-display-primary text-[10px]">
            {saving ? '…' : 'Enregistrer'}
          </button>
          {saved && <span className="font-mono text-[10px] uppercase text-emerald-600">✓ Enregistré</span>}
        </div>
      </div>
    </div>
  );
}
