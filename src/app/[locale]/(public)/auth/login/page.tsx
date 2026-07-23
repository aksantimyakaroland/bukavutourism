import { setRequestLocale, getTranslations } from 'next-intl/server';
import { AuthForm } from '@/components/client/AuthForm';

export default async function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('auth');
  return (
    <section className="container-editorial py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-[70vh]">
      <div className="lg:col-span-7 lg:col-start-1">
        <p className="label-folio mb-3">№ 07 · {t('loginSubtitle')}</p>
        <h1 className="font-display text-6xl lg:text-7xl tracking-tightest leading-[0.9] mb-4">{t('signIn')}</h1>
        <p className="font-display text-2xl tracking-editorial text-ink/70 max-w-md text-pretty">
          {t('loginBody')}
        </p>
      </div>
      <div className="lg:col-span-5 lg:self-center">
        <AuthForm mode="login" />
      </div>
    </section>
  );
}
