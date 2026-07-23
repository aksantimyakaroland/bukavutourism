import { EventForm } from '@/components/admin/EventForm';

export default function NewEventPage() {
  return (
    <div className="p-8 lg:p-12">
      <p className="label-folio mb-3">№ Admin / Événements / Nouveau</p>
      <h1 className="font-display text-5xl tracking-tightest leading-[0.95] mb-10">Nouvel événement</h1>
      <EventForm />
    </div>
  );
}
