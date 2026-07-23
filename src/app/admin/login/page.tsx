'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setMsg('');
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus('error');
      setMsg(error.message);
      return;
    }
    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', data.user.id)
        .single();
      if (!profile || !['admin', 'super_admin'].includes(profile.user_type)) {
        await supabase.auth.signOut();
        setStatus('error');
        setMsg('Accès réservé aux administrateurs.');
        return;
      }
      router.replace('/admin');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-forest text-paper grid place-items-center px-6 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <span className="w-2 h-2 bg-terracotta rotate-45" />
          <span className="font-display text-2xl font-semibold tracking-editorial uppercase">Bukavu</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40 ml-2">№ Admin</span>
        </div>
        <h1 className="font-display text-5xl tracking-tightest leading-[0.9] text-center mb-2">Connexion</h1>
        <p className="text-paper/60 text-center mb-10 text-sm font-mono uppercase tracking-[0.18em]">Accès restreint</p>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="label-folio text-paper/40 block mb-1.5">Email</label>
            <input name="email" type="email" required className="w-full bg-transparent border-b border-paper/30 py-2 text-paper focus:border-terracotta outline-none" />
          </div>
          <div>
            <label className="label-folio text-paper/40 block mb-1.5">Mot de passe</label>
            <input name="password" type="password" required className="w-full bg-transparent border-b border-paper/30 py-2 text-paper focus:border-terracotta outline-none" />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-display w-full bg-terracotta text-paper-bright justify-center hover:bg-paper hover:text-terracotta disabled:opacity-50"
          >
            {status === 'sending' ? 'Vérification…' : 'Continuer →'}
          </button>
          {status === 'error' && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-terracotta text-center">{msg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
