import { ArticleForm } from '@/components/admin/ArticleForm';

export default function NewArticlePage() {
  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Articles / Nouveau</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Nouvel article</h1>
      <ArticleForm />
    </div>
  );
}
