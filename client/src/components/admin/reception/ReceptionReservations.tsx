import React, { useState, useEffect } from 'react';
import type { Reservation, ReservationFilter, ReservationStatus } from '../../../types/booking';
import type { AdminLocation } from '../../../types/auth';
import { fetchReservations, updateReservationStatus } from '../../../lib/supabase';
import AdminFilterBar from '../AdminFilterBar';
import ReservationTable from '../ReservationTable';

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
  const todayStr = new Date().toISOString().split('T')[0];

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters state (Location is strictly bound to location prop)
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [customDate, setCustomDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (location) {
      loadReservations();
    }
  }, [location, selectedDate, customDate, selectedStatus, searchQuery]);

  const loadReservations = async () => {
    setIsLoading(true);
    try {
      const filter: ReservationFilter = {
        location_slug: location || undefined,
        date: selectedDate === 'today' ? todayStr : selectedDate === 'custom' ? customDate : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        searchQuery: searchQuery.trim() || undefined,
      };

      const data = await fetchReservations(filter);
      setReservations(data);

      if (onReservationsLoaded) {
        const total = data.length;
        const pending = data.filter((r) => r.status === 'pending').length;
        const confirmed = data.filter((r) => r.status === 'confirmed').length;
        const cancelled = data.filter((r) => r.status === 'cancelled').length;
        onReservationsLoaded({ total, pending, confirmed, cancelled });
      }
    } catch (err: any) {
      console.error('Error loading reception reservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: ReservationStatus) => {
    try {
      await updateReservationStatus(id, newStatus);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      alert('Nie udało się zmienić statusu: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <AdminFilterBar
        selectedLocation={location || 'katowice'}
        setSelectedLocation={() => {}}
        isLocationLocked={true}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        customDate={customDate}
        setCustomDate={setCustomDate}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        todayStr={todayStr}
      />

      <ReservationTable
        reservations={reservations}
        isLoading={isLoading}
        onRefresh={loadReservations}
        onStatusUpdate={handleStatusUpdate}
        // Reception does not get delete option to preserve operational audit logs
      />
    </div>
  );
};
