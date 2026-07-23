import { setRequestLocale, getTranslations } from 'next-intl/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User, Reservation, Rating } from '@/types/database';
import { formatDate } from '@/lib/utils/format';

export default async function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('profile');
  const ta = await getTranslations('auth');

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single<User>();

  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="container-editorial py-16">
      <p className="label-folio mb-3">{t('subtitle')}</p>
      <h1 className="font-display text-6xl tracking-tightest leading-[0.92] mb-10">
        {profile?.full_name || t('traveller')}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4">
          <div className="border border-ink/10 p-6 space-y-3 text-sm">
            <p><span className="label-folio block mb-1">{ta('email')}</span>{profile?.email || user.email}</p>
            <p><span className="label-folio block mb-1">{t('phone')}</span>{profile?.phone || '—'}</p>
            <p><span className="label-folio block mb-1">{t('joined')}</span>{profile?.created_at ? formatDate(profile.created_at, locale as any) : '—'}</p>
            <form action="/api/auth/logout" method="post" className="pt-4 border-t border-ink/10">
              <button type="submit" className="btn-display-outline text-[10px]">{t('signOut')}</button>
            </form>
          </div>
        </aside>
        <div className="lg:col-span-8">
          <h2 className="font-display text-3xl tracking-editorial mb-6">{t('myReservations')}</h2>
          {!reservations || reservations.length === 0 ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">{t('noReservations')}</p>
          ) : (
            <div className="divide-y divide-ink/10">
              {(reservations as Reservation[]).map(r => (
                <div key={r.id} className="grid grid-cols-12 gap-3 py-4">
                  <div className="col-span-8">
                    <p className="font-display text-lg">{r.confirmation_code}</p>
                    <p className="text-xs text-ink/55">{formatDate(r.reservation_date, locale as any)}</p>
                  </div>
                  <div className="col-span-4 text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">{r.status}</p>
                    <p className="text-sm">{r.participants} pax</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
