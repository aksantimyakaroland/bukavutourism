'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from '@/components/admin/Sidebar';
import type { User, UserType } from '@/types/database';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) {
        router.replace('/admin/login');
        return;
      }
      const { data, error: dbErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', u.id)
        .single();
      if (dbErr || !data) {
        setError('Profil introuvable.');
        setLoaded(true);
        return;
      }
      if (!['admin', 'super_admin'].includes((data as User).user_type)) {
        router.replace('/');
        return;
      }
      setUser(data as User);
      setLoaded(true);
    })();
  }, [router, pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  if (!loaded) {
    return (
      <div className="min-h-screen grid place-items-center bg-forest text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.18em]">Chargement…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-forest text-paper">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-terracotta">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest text-paper flex">
      <AdminSidebar user={user!} />
      <main className="flex-1 bg-paper text-ink overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
