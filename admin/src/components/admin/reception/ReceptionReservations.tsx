import React, { useState, useEffect } from 'react';
import type { Reservation, ReservationFilter, ReservationStatus } from '../../../types/booking';
import type { AdminLocation } from '../../../types/auth';
import { fetchReservations, updateReservationStatus, isSupabaseConfigured } from '../../../lib/supabase';
import AdminFilterBar from '../AdminFilterBar';
import ReservationTable from '../ReservationTable';
import { AlertTriangle } from 'lucide-react';

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
  const [loadError, setLoadError] = useState<string | null>(null);

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
    setLoadError(null);
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
      setLoadError(err?.message || 'Nie udało się wczytać rezerwacji z bazy danych.');
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

      {loadError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
          <div className="space-y-1">
            <p className="font-bold text-red-100">Nie udało się wczytać rezerwacji z bazy</p>
            <p className="text-red-200/90">{loadError}</p>
            <p className="text-red-200/60 text-xs leading-relaxed">
              Lista poniżej może być pusta lub nieaktualna. Sprawdź: (1) admin/.env zawiera te same
              VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY co client/.env, (2) restart
              npm run dev po zmianie .env, (3) polityki RLS dla tabeli reservations i resources
              (rola anon: select / insert / update), (4) kolumny reservations istnieją w bazie.
            </p>
          </div>
        </div>
      )}

      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <p className="font-bold text-amber-100">Tryb demo - bez bazy danych</p>
            <p className="text-amber-200/80">
              Supabase nie jest skonfigurowany, więc poniższa lista pochodzi z localStorage tej
              przeglądarki. Rezerwacji złożonych na stronie klienta tutaj nie widać i nigdy nie
              pojawią się same - uzupełnij .env i zrestartuj serwer deweloperski.
            </p>
          </div>
        </div>
      )}

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
