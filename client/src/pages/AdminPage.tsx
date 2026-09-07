import { useState, useEffect } from 'react';
import { Calendar, Utensils, Gift, Cake } from 'lucide-react';
import type { Reservation, ReservationFilter, ReservationStatus } from '../types/booking';
import { fetchReservations, updateReservationStatus, deleteReservation } from '../lib/supabase';
import AdminHeader from '../components/admin/AdminHeader';
import AdminKpiStats from '../components/admin/AdminKpiStats';
import AdminFilterBar from '../components/admin/AdminFilterBar';
import ReservationTable from '../components/admin/ReservationTable';
import AdminMenuManager from '../components/admin/AdminMenuManager';
import CorporateInquiriesTable from '../components/admin/CorporateInquiriesTable';
import KidsBirthdaysTable from '../components/admin/KidsBirthdaysTable';
import BookingModal from '../components/booking/BookingModal';

interface AdminPageProps {
  onLogout?: () => void;
}

export default function AdminPage({ onLogout }: AdminPageProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [activeAdminTab, setActiveAdminTab] = useState<'reservations' | 'menu' | 'inquiries' | 'birthdays'>('reservations');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters state
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [customDate, setCustomDate] = useState<string>(todayStr);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin New Reservation Modal state
  const [isAdminBookingOpen, setIsAdminBookingOpen] = useState(false);

  useEffect(() => {
    if (activeAdminTab === 'reservations') {
      loadReservations();
    }
  }, [activeAdminTab, selectedLocation, selectedDate, customDate, selectedStatus, searchQuery]);

  const loadReservations = async () => {
    setIsLoading(true);
    try {
      const filter: ReservationFilter = {
        location_slug: selectedLocation !== 'all' ? selectedLocation : undefined,
        date: selectedDate === 'today' ? todayStr : selectedDate === 'custom' ? customDate : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        searchQuery: searchQuery.trim() || undefined,
      };

      const data = await fetchReservations(filter);
      setReservations(data);
    } catch (err: any) {
      console.error('Error loading reservations:', err);
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
      <AdminHeader onOpenNewBooking={() => setIsAdminBookingOpen(true)} onLogout={onLogout} />

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-xl w-full sm:w-auto self-start shadow-inner">
        <button
          onClick={() => setActiveAdminTab('reservations')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeAdminTab === 'reservations'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Rezerwacje Torów / Stołów</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('menu')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeAdminTab === 'menu'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Gastro & Bar Menu (Katowice)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('inquiries')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeAdminTab === 'inquiries'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Zapytania Firmowe</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('birthdays')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeAdminTab === 'birthdays'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cake className="w-4 h-4" />
          <span>Urodziny Dzieci</span>
        </button>
      </div>

      {activeAdminTab === 'reservations' ? (
        <>
          <AdminKpiStats
            totalCount={totalCount}
            pendingCount={pendingCount}
            confirmedCount={confirmedCount}
            cancelledCount={cancelledCount}
          />

          <AdminFilterBar
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
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
        </>
      ) : activeAdminTab === 'menu' ? (
        <AdminMenuManager locationSlug="katowice" />
      ) : activeAdminTab === 'inquiries' ? (
        <CorporateInquiriesTable />
      ) : (
        <KidsBirthdaysTable />
      )}

      <BookingModal
        isOpen={isAdminBookingOpen}
        onClose={() => {
          setIsAdminBookingOpen(false);
          loadReservations();
        }}
        initialLocation={selectedLocation !== 'all' ? selectedLocation : 'katowice'}
      />
    </div>
  );
}
