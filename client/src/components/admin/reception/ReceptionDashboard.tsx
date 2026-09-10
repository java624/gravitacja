import React, { useState } from 'react';
import { Calendar, MessageSquare, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { ReceptionHeader } from './ReceptionHeader';
import { ReceptionStats } from './ReceptionStats';
import { ReceptionReservations } from './ReceptionReservations';
import { ReceptionInquiries } from './ReceptionInquiries';
import BookingModal from '../../booking/BookingModal';

export const ReceptionDashboard: React.FC = () => {
  const { assignedLocation, logout } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'reservations' | 'inquiries'>('reservations');
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  if (!assignedLocation || assignedLocation === 'all') {
    return (
      <div className="p-8 rounded-3xl bg-slate-900 border border-red-500/30 text-center space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Błąd Dostępu do Recepcji</h2>
        <p className="text-xs text-slate-400">Wymagane jest zalogowanie do konkretnej lokalizacji.</p>
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold uppercase"
        >
          Powrót do logowania
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Reception Header */}
      <ReceptionHeader
        location={assignedLocation}
        onOpenNewBooking={() => setIsQuickBookingOpen(true)}
        onLogout={logout}
      />

      {/* KPI Stats */}
      <ReceptionStats
        totalCount={stats.total}
        pendingCount={stats.pending}
        confirmedCount={stats.confirmed}
        cancelledCount={stats.cancelled}
      />

      {/* Tab Controls */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-xl w-full sm:w-auto self-start shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'reservations'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Rezerwacje {assignedLocation.toUpperCase()}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Zgłoszenia (Firmy & Urodziny)</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'reservations' ? (
        <ReceptionReservations
          location={assignedLocation}
          onReservationsLoaded={setStats}
        />
      ) : (
        <ReceptionInquiries location={assignedLocation} />
      )}

      {/* Reception Manual Express Booking Modal */}
      <BookingModal
        isOpen={isQuickBookingOpen}
        onClose={() => setIsQuickBookingOpen(false)}
        initialLocation={assignedLocation}
      />
    </div>
  );
};
