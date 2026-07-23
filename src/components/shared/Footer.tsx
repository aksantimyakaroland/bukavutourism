'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const tnav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 bg-forest text-paper">
      <div className="container-editorial py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 bg-terracotta rotate-45" />
            <span className="font-display text-2xl font-semibold tracking-editorial uppercase">Bukavu</span>
          </div>
          <p className="text-paper/70 max-w-md text-sm leading-relaxed">
            {t('tagline')}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="label-folio text-paper/40 mb-4">{t('explore')}</p>
          <ul className="space-y-2 text-sm">
            {(['destinations', 'tours', 'guides', 'events', 'articles', 'gallery'] as const).map(k => (
              <li key={k}>
                <Link href={`/${k}`} className="text-paper/80 hover:text-terracotta transition-colors">
                  {tnav(k)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="label-folio text-paper/40 mb-4">{t('connect')}</p>
          <p className="text-sm text-paper/80 leading-relaxed mb-4">
            {t('address')}<br />
            {t('country')}
          </p>
          <Link href="/contact" className="text-sm text-terracotta font-mono uppercase tracking-[0.18em]">
            {t('contactCta')} →
          </Link>
        </div>
      </div>

      <div className="container-editorial py-6 border-t border-paper/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40">
          © {year} Visit Bukavu · {t('rights')}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40">
          Développé par <a href="https://rolandmyaka.netlify.app" target="_blank" rel="noopener noreferrer" className="text-terracotta hover:text-paper transition-colors">Roland Myaka</a>
        </p>
      </div>
    </footer>
  );
}
