import React, { useCallback, useState } from 'react';
import { Calendar, Utensils, Gift, Cake, Tag, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import type { LocationSlug } from '../../../types/booking';
import { OwnerHeader } from './OwnerHeader';
import { OwnerGlobalStats } from './OwnerGlobalStats';
import { OwnerSecurityManager } from './OwnerSecurityManager';
import { AdminPricingManager } from './AdminPricingManager';
import AdminMenuManager from '../AdminMenuManager';
import CorporateInquiriesTable from '../CorporateInquiriesTable';
import KidsBirthdaysTable from '../KidsBirthdaysTable';
import BookingModal from '../../booking/BookingModal';
import { ReservationsManager } from '../ReservationsManager';

export const OwnerDashboard: React.FC = () => {
  const { logout, ownerCityFilter, setOwnerCityFilter } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<
    'reservations' | 'menu' | 'inquiries' | 'birthdays' | 'pricing' | 'security'
  >('reservations');

  // Stats state from reservations
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  // Admin New Reservation Express Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Stabilne handlery przekazywane dziecku.
  //
  // Inline arrow w JSX (`{(v) => setX(v)}`) tworzy nową referencję przy każdym
  // renderze. Dziecko trzyma ją w zależnościach `useCallback`, więc każdy render
  // rodzica odpalał w nim `useEffect` od nowa - a ponieważ wywołanie
  // `setStats` waliduje się nowym obiektem, powstawała nieskończona pętla
  // fetch (migotanie listy i "znikanie" trybu tabeli). `useCallback` utrzymuje
  // tożsamość funkcji między renderami.
  const handleLocationChange = useCallback((val: LocationSlug | 'all') => {
    setOwnerCityFilter(val);
  }, []);

  const handleStatsUpdated = useCallback(
    (newStats: { total: number; pending: number; confirmed: number; cancelled: number }) => {
      // Nowy obiekt przy każdym wywołaniu i tak wymusza render rodzica, więc
      // nie blokujemy go - zależności `useCallback` są już stabilne.
      setStats(newStats);
    },
    []
  );

  const handleOpenNewBooking = useCallback(() => setIsBookingModalOpen(true), []);

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Owner Header */}
      <OwnerHeader
        selectedCityFilter={ownerCityFilter}
        onCityFilterChange={setOwnerCityFilter}
        onOpenNewBooking={handleOpenNewBooking}
        onLogout={logout}
      />

      {/* Global Stats Overview */}
      <OwnerGlobalStats
        totalCount={stats.total}
        pendingCount={stats.pending}
        confirmedCount={stats.confirmed}
        cancelledCount={stats.cancelled}
        selectedCityFilter={ownerCityFilter}
      />

      {/* Owner Tab Switcher */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'reservations'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Zarządzanie Rezerwacjami</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'menu'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Utensils className="w-4 h-4 text-slate-400" />
          <span>Menu i Bar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Gift className="w-4 h-4 text-slate-400" />
          <span>Zgłoszenia Firmowe</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('birthdays')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'birthdays'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Cake className="w-4 h-4 text-slate-400" />
          <span>Urodziny Dzieci</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Tag className="w-4 h-4 text-slate-400" />
          <span>Ceny i Taryfy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Bezpieczeństwo i Hasła</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'reservations' ? (
        <ReservationsManager
          location={ownerCityFilter}
          isLocationLocked={false}
          onLocationChange={handleLocationChange}
          onStatsUpdated={handleStatsUpdated}
          allowDelete={true}
        />
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
        onClose={() => setIsBookingModalOpen(false)}
        initialLocation={ownerCityFilter !== 'all' ? ownerCityFilter : 'katowice'}
      />
    </div>
  );
};
