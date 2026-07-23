'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.from('contact_messages').insert({
      email: fd.get('email'),
      full_name: fd.get('name'),
      subject: fd.get('subject'),
      message: fd.get('message'),
    });
    if (error) {
      console.error(error);
      setStatus('error');
      return;
    }
    setStatus('sent');
    (e.target as HTMLFormElement).reset();
  }

  if (status === 'sent') {
    return (
      <div className="border border-terracotta p-10 text-center">
        <p className="font-display text-3xl tracking-editorial text-terracotta mb-3">{t('sent')}</p>
        <p className="text-ink/70">{t('success')}</p>
        <button onClick={() => setStatus('idle')} className="font-mono text-[10px] uppercase tracking-[0.18em] mt-6 text-ink/50">
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="label-folio block mb-1.5" htmlFor="name">{t('name')}</label>
        <input id="name" name="name" required className="input-editorial" />
      </div>
      <div>
        <label className="label-folio block mb-1.5" htmlFor="email">{t('email')}</label>
        <input id="email" name="email" type="email" required className="input-editorial" />
      </div>
      <div>
        <label className="label-folio block mb-1.5" htmlFor="subject">{t('subject')}</label>
        <input id="subject" name="subject" required className="input-editorial" />
      </div>
      <div>
        <label className="label-folio block mb-1.5" htmlFor="message">{t('message')}</label>
        <textarea id="message" name="message" required rows={6} className="input-editorial resize-none border-b" />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-display-primary disabled:opacity-50"
      >
        {status === 'sending' ? t('sending') : `${t('submit')} →`}
      </button>
      {status === 'error' && (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-terracotta">{t('error')}</p>
      )}
    </form>
  );
}
