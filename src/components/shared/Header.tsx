'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);

  const navItems = [
    { key: 'destinations', href: '/destinations' },
    { key: 'tours', href: '/tours' },
    { key: 'guides', href: '/guides' },
    { key: 'events', href: '/events' },
    { key: 'articles', href: '/articles' },
    { key: 'gallery', href: '/gallery' },
    { key: 'contact', href: '/contact' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-ink/10">
      <div className="container-editorial flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 bg-terracotta rotate-45 group-hover:scale-150 transition-transform" />
          <span className="font-display text-xl font-semibold tracking-editorial uppercase">Bukavu</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">№ 01</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-terracotta transition-colors"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="hidden lg:inline-flex btn-display-outline text-[10px]">
            {t('login')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="lg:hidden p-2 -mr-2"
            aria-label={t('menu')}
          >
            <div className="space-y-1.5">
              <span className="block w-5 h-px bg-ink" />
              <span className="block w-5 h-px bg-ink" />
              <span className="block w-3 h-px bg-ink" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-ink/10 px-6 py-4 space-y-2.5 bg-paper-bright">
          {navItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block font-mono text-xs uppercase tracking-[0.18em] text-ink/80 py-1.5"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link href="/auth/login" onClick={() => setOpen(false)} className="block py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-terracotta">
            {t('login')}
          </Link>
        </nav>
      )}
    </header>
  );
}
