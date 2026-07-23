'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@/types/database';
import { getInitials } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const NAV = [
  { label: 'Tableau de Bord', href: '/admin' },
  { label: 'Destinations', href: '/admin/destinations' },
  { label: 'Tours', href: '/admin/tours' },
  { label: 'Guides', href: '/admin/guides' },
  { label: 'Événements', href: '/admin/events' },
  { label: 'Articles', href: '/admin/articles' },
  { label: 'Galerie', href: '/admin/gallery' },
  { label: 'Réservations', href: '/admin/reservations' },
  { label: 'Avis', href: '/admin/ratings' },
  { label: 'Contact', href: '/admin/contact' },
  { label: 'Paramètres', href: '/admin/settings' },
  { label: 'Mon Profil', href: '/admin/profile' },
] as const;

export function AdminSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initials = getInitials(user.full_name || user.email || 'A');

  return (
    <>
      <button onClick={() => setOpen(o => !o)} className="lg:hidden fixed top-3 left-3 z-50 bg-forest text-paper p-2 border border-paper/20">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]">Menu</span>
      </button>
      <aside className={cn(
        'w-64 shrink-0 border-r border-paper/15 bg-forest text-paper flex flex-col p-5 lg:block',
        open ? 'block fixed inset-y-0 left-0 z-40' : 'hidden lg:block'
      )}>
        <div className="flex items-center gap-2 mb-8 pt-8 lg:pt-0">
          <span className="w-2 h-2 bg-terracotta rotate-45" />
          <span className="font-display text-xl font-semibold tracking-editorial uppercase">Bukavu</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/50 ml-auto">Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex justify-between items-center px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
                  active ? 'bg-terracotta text-paper-bright' : 'text-paper/70 hover:text-terracotta'
                )}
              >
                <span>{item.label}</span>
                {active && <span className="text-[8px]">●</span>}
              </Link>
            );
          })}
        </nav>
        <div className="pt-5 border-t border-paper/15">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-terracotta text-paper-bright grid place-items-center font-display text-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{user.full_name}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-paper/40">{user.user_type}</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="post" className="mt-3">
            <button className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50 hover:text-terracotta">Déconnexion →</button>
          </form>
        </div>
      </aside>
    </>
  );
}
