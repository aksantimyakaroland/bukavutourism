'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));
    const supabase = createClient();

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          const fullName = String(fd.get('full_name') || '');
          if (fullName) {
            await supabase.from('users').update({ full_name: fullName }).eq('id', data.user.id);
          }
        }
      }
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.message || 'Authentification échouée.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-paper-bright border border-ink/10 p-8">
      {mode === 'signup' && (
        <div>
          <label className="label-folio block mb-1.5">{t('fullName')}</label>
          <input name="full_name" className="input-editorial" />
        </div>
      )}
      <div>
        <label className="label-folio block mb-1.5">{t('email')}</label>
        <input name="email" type="email" required className="input-editorial" />
      </div>
      <div>
        <label className="label-folio block mb-1.5">{t('password')}</label>
        <input name="password" type="password" required minLength={6} className="input-editorial" />
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn-display-primary w-full justify-center disabled:opacity-50">
        {status === 'sending' ? '…' : t('submit')}
      </button>
      {status === 'error' && (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta">{errorMsg}</p>
      )}
      <p className="text-sm text-ink/60 text-center">
        {mode === 'login'
          ? <>{t('noAccount')} <Link href="/auth/signup" className="text-terracotta">{t('signupCta')}</Link></>
          : <>{t('hasAccount')} <Link href="/auth/login" className="text-terracotta">{t('loginCta')}</Link></>}
      </p>
    </form>
  );
}
