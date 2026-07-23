'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Tour, Guide } from '@/types/database';

export function BookingModal({
  destinationId,
  destinationName,
  defaultTourId,
  onClose,
}: {
  destinationId: string;
  destinationName: string;
  defaultTourId?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedTour, setSelectedTour] = useState(defaultTourId || '');
  const [selectedGuide, setSelectedGuide] = useState('');
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: t } = await supabase.from('tours').select('*').eq('destination_id', destinationId).eq('is_active', true);
      const { data: g } = await supabase.from('guides').select('*').eq('is_available', true);
      setTours(t || []);
      setGuides(g || []);
    })();
  }, [destinationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!selectedTour) { setError('Veuillez choisir un circuit.'); setSaving(false); return; }
    if (!date) { setError('Veuillez choisir une date.'); setSaving(false); return; }
    if (!fullName || !email) { setError('Veuillez remplir votre nom et email.'); setSaving(false); return; }

    const tour = tours.find(t => t.id === selectedTour);
    const totalPrice = (tour?.price || 0) * participants;
    const code = `BKV-${Date.now().toString(36).toUpperCase()}`;

    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();

    const { error: err } = await supabase.from('reservations').insert({
      user_id: user?.user?.id || null,
      tour_id: selectedTour,
      guide_id: selectedGuide || null,
      full_name: fullName,
      email,
      phone,
      participants,
      reservation_date: date,
      total_price: totalPrice,
      status: 'pending',
      payment_status: 'unpaid',
      confirmation_code: code,
      special_requests: notes,
    });

    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess(true);
    setTimeout(() => { onClose(); router.refresh(); }, 2000);
  }

  return (
    <div className="fixed inset-0 z-50 bg-forest/60 grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-paper-bright border border-ink/10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-ink/10">
          <h2 className="font-display text-2xl tracking-editorial">Réserver à {destinationName}</h2>
          <button onClick={onClose} className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-terracotta">Fermer</button>
        </div>

        {success ? (
          <div className="p-10 text-center">
            <p className="font-display text-2xl text-terracotta mb-2">Réservation confirmée !</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Un email de confirmation vous sera envoyé.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {!defaultTourId && (
              <div>
                <label className="label-folio block mb-1.5">Circuit *</label>
                <select value={selectedTour} onChange={e => setSelectedTour(e.target.value)} required className="input-editorial">
                  <option value="">Choisir un circuit</option>
                  {tours.map(t => (
                    <option key={t.id} value={t.id}>{t.name_fr} — {t.duration_hours}h · ${t.price}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="label-folio block mb-1.5">Guide</label>
              <select value={selectedGuide} onChange={e => setSelectedGuide(e.target.value)} className="input-editorial">
                <option value="">Pas de guide spécifique</option>
                {guides.map(g => (
                  <option key={g.id} value={g.id}>{g.full_name} ★ {g.rating}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-folio block mb-1.5">Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="input-editorial" />
              </div>
              <div>
                <label className="label-folio block mb-1.5">Participants</label>
                <input type="number" min={1} max={20} value={participants} onChange={e => setParticipants(Number(e.target.value))} className="input-editorial" />
              </div>
            </div>

            <div>
              <label className="label-folio block mb-1.5">Nom complet *</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="input-editorial" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-folio block mb-1.5">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-editorial" />
              </div>
              <div>
                <label className="label-folio block mb-1.5">Téléphone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-editorial" />
              </div>
            </div>
            <div>
              <label className="label-folio block mb-1.5">Message / Demande spéciale</label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="input-editorial resize-none" />
            </div>

            {error && <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">{error}</p>}

            <button type="submit" disabled={saving} className="btn-display-primary w-full justify-center disabled:opacity-50">
              {saving ? 'Réservation en cours…' : 'Confirmer la réservation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
