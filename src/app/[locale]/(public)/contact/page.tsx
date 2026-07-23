import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/client/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez-nous pour réserver un circuit, poser une question ou organiser votre voyage à Bukavu.',
  openGraph: { title: 'Contact', description: 'Contactez-nous pour votre voyage à Bukavu.' },
  alternates: { canonical: 'https://visitbukavu.netlify.app/contact' },
};

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div>
      <section className="container-editorial pt-16 pb-8">
        <p className="label-folio mb-3">№ 06 · {t('subtitle')}</p>
        <h1 className="font-display text-6xl lg:text-8xl tracking-tightest leading-[0.9]">{t('title')}</h1>
      </section>
      <section className="container-editorial py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="font-display text-2xl tracking-editorial leading-snug text-ink/85 mb-6 text-pretty">
            {t('body')}
          </p>
          <div className="pt-8 border-t border-ink/10 space-y-3 text-sm text-ink/65">
            <p>{t('address')}</p>
            <p>{t('location')}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta pt-4">{t('replyTime')}</p>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
