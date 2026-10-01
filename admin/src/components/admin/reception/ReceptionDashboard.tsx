import React, { useState } from 'react';
import { Calendar, MessageSquare, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { ReceptionHeader } from './ReceptionHeader';
import { ReceptionStats } from './ReceptionStats';
import { ReceptionFullscreenBar } from './ReceptionFullscreenBar';
import { ReceptionReservations } from './ReceptionReservations';
import { ReceptionInquiries } from './ReceptionInquiries';
import BookingModal from '../../booking/BookingModal';
import { useReceptionDisplayMode } from '../../../context/ReceptionDisplayModeContext';
import { getTodayISODate } from '../timeline/dateNavigation';

export const ReceptionDashboard: React.FC = () => {
  const { assignedLocation, logout } = useAdminAuth();
  const { isFullscreenMode } = useReceptionDisplayMode();

  const [activeTab, setActiveTab] = useState<'reservations' | 'inquiries'>('reservations');
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);

  // Data siatki jest trzymana tutaj, bo w trybie TV nawigacja po dniach siedzi
  // w wąskim pasku nagłówka, a nie w pasku narzędzi siatki. Ten sam stan i te same
  // przyciski obsługują oba widoki, więc data nie może się rozjechać.
  const [timelineDate, setTimelineDate] = useState<string>(() => getTodayISODate());

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
    <div
      className={
        isFullscreenMode
          ? 'h-full min-h-0 flex flex-col gap-2 overflow-hidden text-left'
          : 'space-y-6 pb-12 text-left'
      }
    >
      {/* Reception Header.
          TV mode: one thin ~40px bar replaces the big banner AND the 4 KPI cards.
          Normal mode / owner panel: untouched original header + stats. */}
      {isFullscreenMode ? (
        <ReceptionFullscreenBar
          location={assignedLocation}
          selectedDate={timelineDate}
          onDateChange={setTimelineDate}
          onOpenNewBooking={() => setIsQuickBookingOpen(true)}
        />
      ) : (
        <>
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
        </>
      )}

      {/* Tab Controls */}
      <div
        className={
          isFullscreenMode
            ? 'shrink-0 flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full self-start shadow-sm'
            : 'flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto self-start shadow-sm'
        }
      >
        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isFullscreenMode ? 'px-3 py-1.5' : 'px-5 py-2.5'
          } ${
            activeTab === 'reservations'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span>Rezerwacje {assignedLocation.toUpperCase()}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isFullscreenMode ? 'px-3 py-1.5' : 'px-5 py-2.5'
          } ${
            activeTab === 'inquiries'
              ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span>Zgłoszenia (Firmy & Urodziny)</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'reservations' ? (
        <ReceptionReservations
          location={assignedLocation}
          onReservationsLoaded={setStats}
          isFullscreenMode={isFullscreenMode}
          selectedDate={timelineDate}
          onDateChange={setTimelineDate}
        />
      ) : (
        <div className={isFullscreenMode ? 'flex-1 min-h-0 overflow-auto' : ''}>
          <ReceptionInquiries location={assignedLocation} />
        </div>
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
