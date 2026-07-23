import { GuideForm } from '@/components/admin/GuideForm';

export default function NewGuidePage() {
  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Guides / Nouveau</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Nouveau guide</h1>
      <GuideForm />
    </div>
  );
}
