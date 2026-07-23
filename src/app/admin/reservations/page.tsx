'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Reservation, ReservationStatus } from '@/types/database';

const STATUS_ACTIONS: { label: string; status: ReservationStatus; color: string }[] = [
  { label: 'Confirmer', status: 'confirmed', color: 'text-emerald-600' },
  { label: 'Terminer', status: 'completed', color: 'text-blue-600' },
  { label: 'Annuler', status: 'cancelled', color: 'text-red-600' },
  { label: 'Rembourser', status: 'refunded', color: 'text-orange-600' },
];

export default function AdminReservationsPage() {
  const [rows, setRows] = useState<(Reservation & { tours?: { name_fr: string } })[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('reservations')
      .select('*, tours(name_fr)')
      .order('created_at', { ascending: false })
      .limit(50);
    setRows(data || []);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function updateStatus(id: string, status: ReservationStatus) {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from('reservations').update({ status }).eq('id', id);
    setUpdating(null);
    fetch();
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      pending: 'text-amber-600 bg-amber-50',
      confirmed: 'text-emerald-600 bg-emerald-50',
      completed: 'text-blue-600 bg-blue-50',
      cancelled: 'text-red-600 bg-red-50',
      refunded: 'text-orange-600 bg-orange-50',
    };
    return `font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 ${colors[status] || 'text-ink/50 bg-ink/5'}`;
  }

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Réservations</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Réservations</h1>
      {rows.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucune réservation.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left">
                <th className="font-mono text-[10px] uppercase py-3 pr-4">Code</th>
                <th className="font-mono text-[10px] uppercase py-3 pr-4">Client</th>
                <th className="font-mono text-[10px] uppercase py-3 pr-4">Circuit</th>
                <th className="font-mono text-[10px] uppercase py-3 pr-4">Pax</th>
                <th className="font-mono text-[10px] uppercase py-3 pr-4">Total</th>
                <th className="font-mono text-[10px] uppercase py-3 pr-4">Date</th>
                <th className="font-mono text-[10px] uppercase py-3 pr-4">Statut</th>
                <th className="font-mono text-[10px] uppercase py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-b border-ink/5 hover:bg-paper-bright/50">
                  <td className="py-3 pr-4 font-mono text-[10px] uppercase text-terracotta whitespace-nowrap">{r.confirmation_code}</td>
                  <td className="py-3 pr-4">
                    <p>{r.full_name}</p>
                    <p className="text-xs text-ink/50">{r.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-xs text-ink/70">{r.tours?.name_fr || '—'}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{r.participants}</td>
                  <td className="py-3 pr-4 font-mono text-xs">${r.total_price}</td>
                  <td className="py-3 pr-4 text-xs text-ink/60 whitespace-nowrap">{new Date(r.reservation_date).toLocaleDateString('fr')}</td>
                  <td className="py-3 pr-4"><span className={statusBadge(r.status)}>{r.status}</span></td>
                  <td className="py-3">
                    <div className="flex gap-1 flex-wrap">
                      {STATUS_ACTIONS.filter(a => a.status !== r.status).map(a => (
                        <button
                          key={a.status}
                          onClick={() => updateStatus(r.id, a.status)}
                          disabled={updating === r.id}
                          className={`font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-1 border border-ink/10 hover:bg-ink/5 disabled:opacity-30 ${a.color}`}
                        >
                          {updating === r.id ? '…' : a.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
