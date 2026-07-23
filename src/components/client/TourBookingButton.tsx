'use client';
import { useState } from 'react';
import { BookingModal } from './BookingModal';
import { useTranslations } from 'next-intl';

export function TourBookingButton({
  destinationId,
  tourId,
  destinationName,
}: {
  destinationId: string;
  tourId: string;
  destinationName: string;
}) {
  const t = useTranslations('tours');
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-display w-full bg-terracotta text-paper-bright hover:bg-paper hover:text-terracotta justify-center">
        {t('bookNow')} →
      </button>
      {open && (
        <BookingModal
          destinationId={destinationId}
          destinationName={destinationName}
          defaultTourId={tourId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
