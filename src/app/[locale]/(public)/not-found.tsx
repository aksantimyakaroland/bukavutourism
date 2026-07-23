import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function NotFoundPage() {
  const t = await getTranslations('errors');
  return (
    <section className="container-editorial py-32 text-center min-h-[60vh] grid place-items-center">
      <div className="max-w-xl">
        <p className="label-folio mb-3">№ Err</p>
        <h1 className="font-display text-[14vw] lg:text-[10rem] tracking-tightest leading-[0.85] mb-6">404</h1>
        <p className="font-display text-2xl tracking-editorial text-ink/70 mb-10 text-pretty">{t('404Lead')}</p>
        <Link href="/" className="btn-display-primary">{t('backHome')}</Link>
      </div>
    </section>
  );
}
