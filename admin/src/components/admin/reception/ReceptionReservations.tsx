import React from 'react';
import type { AdminLocation } from '../../../types/auth';
import { ReservationsManager } from '../ReservationsManager';

interface ReceptionReservationsProps {
  location: AdminLocation;
  onReservationsLoaded?: (stats: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  }) => void;
}

export const ReceptionReservations: React.FC<ReceptionReservationsProps> = ({
  location,
  onReservationsLoaded,
}) => {
  return (
    <ReservationsManager
      location={location}
      isLocationLocked={true}
      onStatsUpdated={onReservationsLoaded}
      allowDelete={false}
    />
  );
};
