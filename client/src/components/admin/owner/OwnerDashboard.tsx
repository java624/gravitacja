import React, { useState, useEffect } from 'react';
import { Calendar, Utensils, Gift, Cake, Tag, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import type { LocationSlug, Reservation, ReservationFilter, ReservationStatus } from '../../../types/booking';
import { fetchReservations, updateReservationStatus, deleteReservation } from '../../../lib/supabase';
import { OwnerHeader } from './OwnerHeader';
import { OwnerGlobalStats } from './OwnerGlobalStats';
import { OwnerSecurityManager } from './OwnerSecurityManager';
import { OwnerPricingManager } from './OwnerPricingManager';
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

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [customDate, setCustomDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin New Reservation Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'reservations') {
      loadReservations();
    }
  }, [activeTab, ownerCityFilter, selectedDate, customDate, selectedStatus, searchQuery]);

  const loadReservations = async () => {
    setIsLoading(true);
    try {
      const filter: ReservationFilter = {
        location_slug: ownerCityFilter !== 'all' ? ownerCityFilter : undefined,
        date: selectedDate === 'today' ? todayStr : selectedDate === 'custom' ? customDate : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        searchQuery: searchQuery.trim() || undefined,
      };

      const data = await fetchReservations(filter);
      setReservations(data);
    } catch (err: any) {
      console.error('Error loading reservations for owner:', err);
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
        <OwnerPricingManager />
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
