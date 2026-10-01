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
  /** Tryb pełnoekranowy - przekazywany dalej do siatki TimelineGridView. */
  isFullscreenMode?: boolean;
}

export const ReceptionReservations: React.FC<ReceptionReservationsProps> = ({
  location,
  onReservationsLoaded,
  isFullscreenMode = false,
}) => {
  return (
    <div className={isFullscreenMode ? 'flex-1 min-h-0 flex flex-col gap-2' : ''}>
      <ReservationsManager
        location={location}
        isLocationLocked={true}
        onStatsUpdated={onReservationsLoaded}
        allowDelete={false}
        isFullscreenMode={isFullscreenMode}
      />
    </div>
  );
};
