import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LayoutGrid, ListFilter, AlertTriangle, CalendarDays } from 'lucide-react';
import type { Reservation, ReservationFilter, ReservationStatus, Resource, LocationSlug } from '../../types/booking';
import { fetchReservations, updateReservationStatus, deleteReservation, isSupabaseConfigured } from '../../lib/supabase';
import { fetchResources } from '../../lib/supabase/resourcesService';
import { TimelineGridView } from './timeline/TimelineGridView';
import AdminFilterBar from './AdminFilterBar';
import ReservationTable from './ReservationTable';
import { ReservationDetailModal } from './ReservationDetailModal';
import { QuickAdminReservationModal } from './timeline/QuickAdminReservationModal';
import type { TimelineQuickSelection } from './timeline/quickBooking';

export type AdminViewMode = 'timeline' | 'table';

interface ReservationsManagerProps {
  location?: LocationSlug | 'all';
  isLocationLocked?: boolean;
  onLocationChange?: (location: LocationSlug | 'all') => void;
  onStatsUpdated?: (stats: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  }) => void;
  allowDelete?: boolean;
  /** Tryb pełnoekranowy (recepcja): siatka wypełnia 100% wysokości bez scrollbarów. */
  isFullscreenMode?: boolean;
  /**
   * Opcjonalne sterowanie datą z góry. Używane przez pasek TV, żeby nawigacja
   * po dniach była w jednym miejscu. Gdy nieprzekazane (panel właściciela),
   * data siedzi w lokalnym stanie - jak dotychczas.
   */
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export const ReservationsManager: React.FC<ReservationsManagerProps> = ({
  location,
  isLocationLocked = true,
  onLocationChange,
  onStatsUpdated,
  allowDelete = false,
  isFullscreenMode = false,
  selectedDate,
  onDateChange,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // View Mode: 1) Timeline (Occupancy Grid) vs 2) Table (Quick Search & List)
  const [viewMode, setViewMode] = useState<AdminViewMode>('timeline');

  // Selected date for timeline view
  const [internalTimelineDate, setInternalTimelineDate] = useState<string>(todayStr);
  const timelineDate = selectedDate ?? internalTimelineDate;
  const setTimelineDate = onDateChange ?? setInternalTimelineDate;

  // Filters for table view
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [customTableDate, setCustomTableDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [resources, setResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Detail Modal & Express Booking states
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Quick reception booking made directly on the timeline grid (cell click / drag range).
  // null = closed; the full BookingModal behind the header button stays untouched.
  const [quickSelection, setQuickSelection] = useState<TimelineQuickSelection | null>(null);

  // Current active location slug for queries
  const activeLocationSlug = location && location !== 'all' ? location : 'katowice';

  // ---------------------------------------------------------------------------
  // Stabilność tożsamości callbacków (to było źródło nieskończonej pętli fetch)
  // ---------------------------------------------------------------------------
  // Rodzic przekazuje `onStatsUpdated` jako INLINE ARROW, np.
  //   onStatsUpdated={(newStats) => setStats(newStats)}
  // Każdy jego render tworzy nową referencję funkcji. Gdyby `onStatsUpdated`
  // znalazł się w zależnościach `useCallback` poniżej, to:
  //   nowa referencja -> nowy `loadReservations` -> useEffect odpala fetch ->
  //   fetch wywołuje `onStatsUpdated` -> setStats z NOWYM obiektem ->
  //   rodzic renderuje się ponownie -> pętla w nieskończoność.
  // Dlatego trzymamy callback w `ref`: jego tożsamość nie wpływa na
  // `loadReservations`, a wartość zawsze jest aktualna.
  const onStatsUpdatedRef = useRef(onStatsUpdated);
  useEffect(() => {
    onStatsUpdatedRef.current = onStatsUpdated;
  }, [onStatsUpdated]);

  // Licznik zapytań: ignorujemy odpowiedzi, które wróciły po nowszym zapytaniu
  // (szybkie przełączanie dat / trybów). Bez tego widok skakałby między
  // starymi i nowymi danymi.
  const requestIdRef = useRef(0);

  // Load resources for current location
  const loadResources = useCallback(async () => {
    try {
      const data = await fetchResources(activeLocationSlug);
      setResources(data);
    } catch (err: any) {
      console.error('Error loading resources:', err);
    }
  }, [activeLocationSlug]);

  // Wszystkie wejścia zapytania sprowadzamy do PRYMITYWÓW (string / undefined).
  // Obiekt `filter` jest nowy przy każdym renderze, więc gdyby trafił do
  // `useMemo` jako całość, i tak nie dawałby stabilności - liczymy go
  // bezpośrednio z prymitywów, a zależności useCallback są już prymitywami.
  const tableDateFilter =
    selectedDateFilter === 'today'
      ? todayStr
      : selectedDateFilter === 'custom'
        ? customTableDate
        : undefined;
  const statusFilter = selectedStatus !== 'all' ? selectedStatus : undefined;
  const searchFilter = searchQuery.trim() || undefined;
  const locationFilter = location !== 'all' ? location : undefined;

  // Load reservations based on mode & filters
  const loadReservations = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setLoadError(null);
    try {
      const filter: ReservationFilter = { location_slug: locationFilter };

      if (viewMode === 'timeline') {
        // Timeline view loads reservations for the selected timeline date
        filter.date = timelineDate;
      } else {
        // Table view uses table filters
        filter.date = tableDateFilter;
        filter.status = statusFilter;
        filter.searchQuery = searchFilter;
      }

      const data = await fetchReservations(filter);
      // Starsze zapytanie nie może nadpisać wyniku nowszego.
      if (requestId !== requestIdRef.current) return;

      setReservations(data);

      const statsCallback = onStatsUpdatedRef.current;
      if (statsCallback) {
        statsCallback({
          total: data.length,
          pending: data.filter((r) => r.status === 'pending').length,
          confirmed: data.filter((r) => r.status === 'confirmed').length,
          cancelled: data.filter((r) => r.status === 'cancelled').length,
        });
      }
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error('Error loading reservations:', err);
      setLoadError(err?.message || 'Nie udało się wczytać rezerwacji.');
    } finally {
      // Sprawdzamy requestId także tutaj: wycofane zapytanie nie może zdjąć
      // spinnera z nowszego, którego jeszcze trwa.
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    locationFilter,
    viewMode,
    timelineDate,
    tableDateFilter,
    statusFilter,
    searchFilter,
  ]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  // Status update handler (Confirm / Reject)
  const handleStatusUpdate = async (id: string, newStatus: ReservationStatus) => {
    try {
      await updateReservationStatus(id, newStatus);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert('Błąd podczas aktualizacji statusu: ' + (err?.message || err));
    }
  };

  // Delete handler (Owner only)
  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę rezerwację z systemu?')) return;
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      if (selectedReservation && selectedReservation.id === id) {
        setIsDetailModalOpen(false);
        setSelectedReservation(null);
      }
    } catch (err: any) {
      alert('Nie udało się usunąć rezerwacji: ' + (err?.message || err));
    }
  };

  // Open detail modal when clicking a booking
  const handleOpenDetailModal = (res: Reservation) => {
    setSelectedReservation(res);
    setIsDetailModalOpen(true);
  };

  return (
    <div className={isFullscreenMode ? 'flex-1 min-h-0 flex flex-col gap-2' : 'space-y-4'}>
      {/* Requirement 3: Top Mode Switcher (Tabs) */}
      <div
        className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between rounded-2xl bg-slate-900 border border-slate-800 shadow-md ${
          isFullscreenMode ? 'shrink-0 gap-2 p-1' : 'gap-3 p-1.5'
        }`}
      >
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {/* Mode 1: Timeline View */}
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isFullscreenMode ? 'px-3 py-1.5' : 'px-4 sm:px-5 py-2.5'
            } ${
              viewMode === 'timeline'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span>📊 Сітка завантаженості (Бар / Рецепція)</span>
          </button>

          {/* Mode 2: Table View */}
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isFullscreenMode ? 'px-3 py-1.5' : 'px-4 sm:px-5 py-2.5'
            } ${
              viewMode === 'table'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ListFilter className="w-4 h-4 text-amber-400" />
            <span>📋 Список бронювань (Швидкий пошук)</span>
          </button>
        </div>

        {/* Current Context Info */}
        <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-slate-400">
          <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
          <span>Lokalizacja:</span>
          <span className="font-semibold text-slate-200 uppercase font-mono">
            {location || 'Wszystkie'}
          </span>
          {activeLocationSlug === 'katowice' && (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
              12 torów + 4 bilardy
            </span>
          )}
        </div>
      </div>

      {/* Database Status Warnings */}
      {loadError && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-rose-800/70 bg-rose-950/40 text-rose-200 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold text-rose-100">Błąd podczas wczytywania rezerwacji</p>
            <p className="text-rose-300/80 mt-0.5">{loadError}</p>
          </div>
        </div>
      )}

      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-800/60 bg-amber-950/30 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div>
            <span className="font-semibold text-amber-100">Tryb lokalny / demonstracyjny: </span>
            <span className="text-amber-200/90">
              Dane pochodzą z lokalnego magazynu testowego (Katowice: 12 torów bowlingowych Tor 1...Tor 12 oraz 4 stoły bilardowe Stół 1...Stół 4). Zmiany statusu i rezerwacje działają w pamięci przeglądarki.
            </span>
          </div>
        </div>
      )}

      {/* Main Mode View */}
      {viewMode === 'timeline' ? (
        /* Requirement 4: Mode 1 - Occupancy Grid (Timeline View) */
        <TimelineGridView
          resources={resources}
          reservations={reservations}
          selectedDate={timelineDate}
          onDateChange={setTimelineDate}
          onSelectReservation={handleOpenDetailModal}
          onQuickBook={(selection) => setQuickSelection(selection)}
          onRefresh={loadReservations}
          isLoading={isLoading}
          locationName={location?.toUpperCase()}
          isFullscreenMode={isFullscreenMode}
        />
      ) : (
        /* Requirement 5: Mode 2 - List & Quick Search (Table View) */
        <div className={isFullscreenMode ? 'flex-1 min-h-0 overflow-auto space-y-3' : 'space-y-4'}>
          <AdminFilterBar
            selectedLocation={location || 'katowice'}
            setSelectedLocation={(val) => onLocationChange && onLocationChange(val as LocationSlug | 'all')}
            isLocationLocked={isLocationLocked}
            selectedDate={selectedDateFilter}
            setSelectedDate={setSelectedDateFilter}
            customDate={customTableDate}
            setCustomDate={setCustomTableDate}
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
            onDelete={allowDelete ? handleDelete : undefined}
            onSelectReservation={handleOpenDetailModal}
          />
        </div>
      )}

      {/* Detail Modal for Clicked Booking */}
      <ReservationDetailModal
        reservation={selectedReservation}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedReservation(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />

      {/*
        Quick booking modal - opened ONLY from a timeline grid selection (click or
        drag range). Location, entertainment type, resource, date and hours are
        filled in automatically, the reception only types name / phone / people.
        The header button "Nowa Rezerwacja" still opens the full BookingModal.
      */}
      <QuickAdminReservationModal
        key={
          quickSelection
            ? `${quickSelection.resource.id}-${quickSelection.date}-${quickSelection.startHour}-${quickSelection.endHour}`
            : 'quick-booking-closed'
        }
        selection={quickSelection}
        isOpen={!!quickSelection}
        onClose={() => setQuickSelection(null)}
        onCreated={() => {
          setQuickSelection(null);
          loadReservations();
        }}
      />
    </div>
  );
};
