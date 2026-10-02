import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Calendar, Utensils, Gift, Cake, Tag, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import type { LocationSlug, Reservation, ReservationFilter, ReservationStatus } from '../../../types/booking';
import { fetchReservations, updateReservationStatus, deleteReservation, isSupabaseConfigured } from '../../../lib/supabase';
import { OwnerHeader } from './OwnerHeader';
import { OwnerGlobalStats } from './OwnerGlobalStats';
import { OwnerSecurityManager } from './OwnerSecurityManager';
import { AdminPricingManager } from './AdminPricingManager';
import AdminFilterBar from '../AdminFilterBar';
import ReservationTable from '../ReservationTable';
import AdminMenuManager from '../AdminMenuManager';
import CorporateInquiriesTable from '../CorporateInquiriesTable';
import KidsBirthdaysTable from '../KidsBirthdaysTable';
import BookingModal from '../../booking/BookingModal';

export const OwnerDashboard: React.FC = () => {
  const { logout, ownerCityFilter, setOwnerCityFilter } = useAdminAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState<
    'reservations' | 'menu' | 'inquiries' | 'birthdays' | 'pricing' | 'security'
  >('reservations');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [customDate, setCustomDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin New Reservation Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Licznik zapytań: odpowiedź wycofanego zapytania nie może nadpisać wyniku
  // nowszego (szybkie klikanie filtrów). Bez tego lista skakała między
  // starymi i nowymi danymi.
  const requestIdRef = useRef(0);

  // Wszystkie wejścia zapytania sprowadzamy do prymitywów, dzięki czemu
  // `useCallback` ma stabilną listę zależności i `useEffect` nie odpala się
  // na każdym renderze.
  const dateFilter =
    selectedDate === 'today' ? todayStr : selectedDate === 'custom' ? customDate : undefined;
  const statusFilter = selectedStatus !== 'all' ? selectedStatus : undefined;
  const searchFilter = searchQuery.trim() || undefined;
  const locationFilter = ownerCityFilter !== 'all' ? ownerCityFilter : undefined;

  const loadReservations = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setLoadError(null);
    try {
      const filter: ReservationFilter = {
        location_slug: locationFilter,
        date: dateFilter,
        status: statusFilter,
        searchQuery: searchFilter,
      };

      const data = await fetchReservations(filter);
      if (requestId !== requestIdRef.current) return; // wycofane zapytanie
      setReservations(data);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) return;
      console.error('Error loading reservations for owner:', err);
      setLoadError(err?.message || 'Nie udało się wczytać rezerwacji z bazy danych.');
    } finally {
      // Spinner zdejmuje wyłącznie zapytanie, które jest nadal aktualne.
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [locationFilter, dateFilter, statusFilter, searchFilter]);

  useEffect(() => {
    if (activeTab === 'reservations') {
      void loadReservations();
    }
  }, [activeTab, loadReservations]);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę rezerwację z systemu?')) return;
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert('Nie udało się usunąć: ' + err.message);
    }
  };

  // Stats calculation
  const totalCount = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const cancelledCount = reservations.filter((r) => r.status === 'cancelled').length;

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Owner Header */}
      <OwnerHeader
        selectedCityFilter={ownerCityFilter}
        onCityFilterChange={setOwnerCityFilter}
        onOpenNewBooking={() => setIsBookingModalOpen(true)}
        onLogout={logout}
      />

      {/* Global Stats Overview */}
      <OwnerGlobalStats
        totalCount={totalCount}
        pendingCount={pendingCount}
        confirmedCount={confirmedCount}
        cancelledCount={cancelledCount}
        selectedCityFilter={ownerCityFilter}
      />

      {/* Owner Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 backdrop-blur-xl w-full shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'reservations'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Zarządzanie Rezerwacjami</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menu i Bar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Zgłoszenia Firmowe</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('birthdays')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'birthdays'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cake className="w-4 h-4" />
          <span>Urodziny Dzieci</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Ceny i Taryfy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Bezpieczeństwo i Hasła</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'reservations' ? (
        <div className="space-y-4">
          <AdminFilterBar
            selectedLocation={ownerCityFilter}
            setSelectedLocation={(val) => setOwnerCityFilter(val as LocationSlug | 'all')}
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
                  Lista może być pusta. Sprawdź .env panelu (te same wartości co w client/.env),
                  restart npm run dev, polityki RLS dla roli anon na tabelach reservations i resources
                  oraz istnienie wszystkich kolumn rezerwacji.
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
                  Supabase nie jest skonfigurowany: poniższe dane pochodzą z localStorage tej
                  przeglądarki, a nie z bazy. Rezerwacji składanych na stronie klienta nie będzie tu
                  nigdy widocznych.
                </p>
              </div>
            </div>
          )}

          <ReservationTable
            reservations={reservations}
            isLoading={isLoading}
            onRefresh={loadReservations}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
          />
        </div>
      ) : activeTab === 'menu' ? (
        <AdminMenuManager locationSlug={ownerCityFilter !== 'all' ? ownerCityFilter : 'katowice'} />
      ) : activeTab === 'inquiries' ? (
        <CorporateInquiriesTable />
      ) : activeTab === 'birthdays' ? (
        <KidsBirthdaysTable />
      ) : activeTab === 'pricing' ? (
        <AdminPricingManager />
      ) : (
        <OwnerSecurityManager />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          loadReservations();
        }}
        initialLocation={ownerCityFilter !== 'all' ? ownerCityFilter : 'katowice'}
      />
    </div>
  );
};
