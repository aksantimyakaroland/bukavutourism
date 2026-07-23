'use client';
import { useState } from 'react';
import { BookingModal } from './BookingModal';

export function BookingButton({
  destinationId,
  destinationName,
}: {
  destinationId: string;
  destinationName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-display-primary w-full justify-center mt-4">
        Réserver →
      </button>
      {open && (
        <BookingModal
          destinationId={destinationId}
          destinationName={destinationName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
