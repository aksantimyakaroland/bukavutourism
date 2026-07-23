import { TourForm } from '@/components/admin/TourForm';

export default function NewTourPage() {
  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Tours / Nouveau</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Nouveau circuit</h1>
      <TourForm />
    </div>
  );
}
