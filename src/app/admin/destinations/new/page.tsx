import { DestinationForm } from '@/components/admin/DestinationForm';

export default function NewDestinationPage() {
  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Destinations / Nouveau</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Nouvelle destination</h1>
      <DestinationForm />
    </div>
  );
}
