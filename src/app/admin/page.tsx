'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactMessage } from '@/types/database';

interface Stats {
  activeDestinations: number;
  activeTours: number;
  pendingReservations: number;
  unmoderatedRatings: number;
  unreadMessages: number;
  totalMessages: number;
  recentMessages: ContactMessage[];
  recentReservations: any[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { count: activeDestinations } = await supabase.from('destinations').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: activeTours } = await supabase.from('tours').select('*', { count: 'exact', head: true }).eq('is_active', true);
      const { count: pendingReservations } = await supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: unmoderatedRatings } = await supabase.from('ratings').select('*', { count: 'exact', head: true }).eq('is_moderated', false);
      const { count: unreadMessages } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
      const { count: totalMessages } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });
      const { data: recentMessages } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5);
      const { data: recent } = await supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5);
      setData({
        activeDestinations: activeDestinations ?? 0,
        activeTours: activeTours ?? 0,
        pendingReservations: pendingReservations ?? 0,
        unmoderatedRatings: unmoderatedRatings ?? 0,
        unreadMessages: unreadMessages ?? 0,
        totalMessages: totalMessages ?? 0,
        recentMessages: recentMessages ?? [],
        recentReservations: recent ?? [],
      });
    })();
  }, []);

  const cards = [
    { label: 'Destinations actives', value: data?.activeDestinations ?? '—', color: 'text-terracotta' },
    { label: 'Tours actifs', value: data?.activeTours ?? '—', color: 'text-ink' },
    { label: 'Réservations en attente', value: data?.pendingReservations ?? '—', color: 'text-terracotta' },
    { label: 'Avis non modérés', value: data?.unmoderatedRatings ?? '—', color: 'text-terracotta' },
    { label: 'Messages non lus', value: data?.unreadMessages ?? '—', color: 'text-terracotta' },
    { label: 'Messages total', value: data?.totalMessages ?? '—', color: 'text-ink' },
  ];

  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Tableau de bord / Aujourd&apos;hui</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Tableau de Bord</h1>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {cards.map(c => (
          <div key={c.label} className="border border-ink/10 p-6 bg-paper-bright">
            <p className="label-folio mb-3">{c.label}</p>
            <p className={`font-display text-5xl tracking-tightest leading-none ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div>
          <h2 className="font-display text-2xl tracking-editorial mb-5">Messages récents</h2>
          {!data || data.recentMessages.length === 0 ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucun message.</p>
          ) : (
            <div className="space-y-2">
              {data.recentMessages.map(m => (
                <div key={m.id} className={`border ${m.is_read ? 'border-ink/10' : 'border-terracotta/30 bg-terracotta/5'} p-4`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-display text-base">{m.full_name}</p>
                    {!m.is_read && <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-terracotta">Nouveau</span>}
                  </div>
                  <p className="font-mono text-[10px] text-ink/50 mb-1">{m.email}</p>
                  <p className="text-sm text-ink/70 line-clamp-2">{m.message}</p>
                  <p className="font-mono text-[9px] text-ink/40 mt-1">{new Date(m.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-2xl tracking-editorial mb-5">Réservations récentes</h2>
          {!data || data.recentReservations.length === 0 ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">Aucune réservation pour le moment.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left">
                  <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Code</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Nom</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Pax</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.18em] py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.recentReservations.map(r => (
                  <tr key={r.id} className="border-b border-ink/5">
                    <td className="py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">{r.confirmation_code}</td>
                    <td className="py-3">{r.full_name}</td>
                    <td className="py-3 font-mono">{r.participants}</td>
                    <td className="py-3 font-mono text-[10px] uppercase tracking-[0.18em]">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
