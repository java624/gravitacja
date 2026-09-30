import React from 'react';
import { X, CheckCircle2, XCircle, Clock, User, Phone, Mail, Calendar, MapPin, DollarSign, Users, Award } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types/booking';

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: ReservationStatus) => Promise<void> | void;
}

export const ReservationDetailModal: React.FC<ReservationDetailModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  if (!isOpen || !reservation) return null;

  const isPending = reservation.status === 'pending';
  const isConfirmed = reservation.status === 'confirmed';
  const isCancelled = reservation.status === 'cancelled';

  const handleConfirm = async () => {
    await onStatusUpdate(reservation.id, 'confirmed');
    onClose();
  };

  const handleReject = async () => {
    if (confirm('Czy na pewno chcesz odrzucić / anulować tę rezerwację?')) {
      await onStatusUpdate(reservation.id, 'cancelled');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              isPending
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : isConfirmed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {isPending ? <Clock className="w-5 h-5" /> : isConfirmed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Szczegóły Rezerwacji
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                ID: {reservation.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Badge Banner */}
          <div className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-medium ${
            isPending
              ? 'bg-amber-950/40 border-amber-700/50 text-amber-300'
              : isConfirmed
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-700/50 text-rose-300'
          }`}>
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                isPending ? 'bg-amber-400 animate-pulse' : isConfirmed ? 'bg-emerald-400' : 'bg-rose-400'
              }`} />
              Status rezerwacji:
            </span>
            <span className="font-bold uppercase tracking-wider">
              {isPending ? 'Nowe online (Oczekuje na potwierdzenie)' : isConfirmed ? 'Potwierdzona / Aktywna' : 'Anulowana'}
            </span>
          </div>

          {/* Client Details Card */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Dane Klienta
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="block text-[11px] text-slate-500">Imię i nazwisko</span>
                <span className="font-medium text-slate-100">{reservation.client_name}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500">Telefon kontaktowy</span>
                <a
                  href={`tel:${reservation.client_phone}`}
                  className="font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-0.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {reservation.client_phone}
                </a>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-[11px] text-slate-500">Adres e-mail</span>
                <a
                  href={`mailto:${reservation.client_email}`}
                  className="font-mono text-slate-300 hover:text-slate-100 flex items-center gap-1 mt-0.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {reservation.client_email}
                </a>
              </div>
            </div>
          </div>

          {/* Booking Session Info */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" /> Sesja i Przypisany Zasób
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="block text-[11px] text-slate-500">Zasób / Tor</span>
                <span className="font-semibold text-slate-100">
                  {reservation.resource ? reservation.resource.name : reservation.resource_id}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500">Data rezerwacji</span>
                <span className="font-medium text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {reservation.reservation_date}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500">Godziny</span>
                <span className="font-mono font-semibold text-amber-300">
                  {reservation.start_time} - {reservation.end_time}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500">Lokalizacja</span>
                <span className="font-medium text-slate-300 uppercase text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {reservation.location_slug}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500">Liczba graczy</span>
                <span className="font-medium text-slate-200 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {reservation.guests_count} osób
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-500">Wartość / Płatność</span>
                <span className="font-mono font-medium text-emerald-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {reservation.total_price ? `${reservation.total_price} PLN` : 'Do ustalenia'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-semibold cursor-pointer"
          >
            Zamknij
          </button>

          <div className="flex items-center gap-2">
            {!isCancelled && (
              <button
                type="button"
                onClick={handleReject}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 hover:bg-rose-900/80 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Відхилити / Anuluj</span>
              </button>
            )}

            {!isConfirmed && (
              <button
                type="button"
                onClick={handleConfirm}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-xs font-semibold cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Підтвердити (Potwierdź)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
