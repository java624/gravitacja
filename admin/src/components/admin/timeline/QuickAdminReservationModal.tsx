import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Lock,
  Loader2,
  AlertTriangle,
  Users,
  Phone,
  User,
  Info,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import type {
  LocationSlug,
  PaymentStatus,
  Reservation,
  ReservationStatus,
  ResourceType,
} from '../../../types/booking';
import { createReservation } from '../../../lib/supabase/reservationsService';
import { useBookingPrice } from '../../../hooks/useBookingPrice';
import {
  formatResourceDisplayName,
  formatResourceTypeLabel,
} from './resourceDisplay';
import { formatHourLabel } from './quickBooking';
import type { TimelineQuickSelection } from './quickBooking';

/**
 * Three states the reception actually cares about, mapped to the DB fields:
 * - paid    -> payment_status: paid,    status: confirmed
 * - on_site -> payment_status: pending, status: confirmed (guest pays at the bar)
 * - hold    -> payment_status: pending, status: pending   (unconfirmed option)
 */
type ReceptionPaymentChoice = 'paid' | 'on_site' | 'hold';

const PAYMENT_CHOICES: { value: ReceptionPaymentChoice; label: string; hint: string }[] = [
  { value: 'paid', label: 'Opłacone', hint: 'Klient zapłacił - rezerwacja potwierdzona' },
  { value: 'on_site', label: 'Płatność na miejscu', hint: 'Gość płaci w recepcji' },
  { value: 'hold', label: 'Tylko rezerwacja', hint: 'Status "oczekuje" do potwierdzenia' },
];

const WALK_IN_NAME = 'Klient od lady (Walk-in)';

interface QuickAdminReservationModalProps {
  /** Selection made on the timeline grid. The modal is ONLY opened from the grid. */
  selection: TimelineQuickSelection | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called after a successful insert so the parent can refresh the grid. */
  onCreated?: (reservation: Reservation) => void;
}

const formatDateLabel = (date: string): string => {
  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  } catch {
    return date;
  }
};

export const QuickAdminReservationModal: React.FC<QuickAdminReservationModalProps> = ({
  selection,
  isOpen,
  onClose,
  onCreated,
}) => {
  const resource = selection?.resource ?? null;
  const isBowling = (resource?.type ?? 'bowling') === 'bowling';

  // Hooks must run unconditionally, so fall back to inert values when closed.
  const locationSlug: LocationSlug = selection?.locationSlug ?? 'katowice';
  const date = selection?.date ?? new Date().toISOString().split('T')[0];
  const startTime = selection ? formatHourLabel(selection.startHour) : '10:00';
  const endTime = selection ? formatHourLabel(selection.endHour) : '11:00';
  const resourceType: ResourceType = isBowling ? 'bowling' : 'billiards';
  const hoursCount = selection ? Math.max(1, selection.endHour - selection.startHour) : 1;

  // ---- Fields the reception fills in (kept intentionally short) ----
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState<number>(isBowling ? 4 : 2);
  const [paymentChoice, setPaymentChoice] = useState<ReceptionPaymentChoice>('on_site');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const priceBreakdown = useBookingPrice({
    locationSlug,
    resourceType,
    date,
    startTime,
    endTime,
    resourceCount: 1,
    includeShoes: false,
    shoesCount: 0,
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const canSubmit = useMemo(
    () => clientName.trim().length >= 2 && !isSubmitting,
    [clientName, isSubmitting]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selection || !resource) return;

    if (clientName.trim().length < 2) {
      setErrorMessage('Podaj imię i nazwisko klienta albo skorzystaj z „Klient od lady”.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const paymentStatus: PaymentStatus = paymentChoice === 'paid' ? 'paid' : 'pending';
    const status: ReservationStatus = paymentChoice === 'hold' ? 'pending' : 'confirmed';

    try {
      const created = await createReservation({
        resource_id: resource.id,
        location_slug: selection.locationSlug,
        client_name: clientName.trim(),
        client_phone: clientPhone.trim(),
        client_email: '',
        reservation_date: selection.date,
        start_time: formatHourLabel(selection.startHour),
        end_time: formatHourLabel(selection.endHour),
        guests_count: guestsCount,
        total_price: priceBreakdown.totalPrice,
        payment_method: 'reception',
        payment_status: paymentStatus,
        status,
        include_shoes: false,
        shoes_count: 0,
      });

      onCreated?.(created);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Nie udało się zapisać rezerwacji w bazie.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !selection || !resource) return null;

  const resourceLabel = formatResourceDisplayName(resource);
  const typeLabel = formatResourceTypeLabel(resource);
  const locationLabel = selection.locationSlug.toUpperCase();
  const rangeLabel = `${startTime} – ${endTime}`;

  const autoFields = [
    { label: 'Lokalizacja (z filtra)', value: locationLabel },
    { label: 'Typ rozrywki', value: typeLabel },
    { label: 'Zasób (tor / stół)', value: resourceLabel },
    { label: 'Data', value: formatDateLabel(selection.date) },
    { label: 'Godziny (z siatki)', value: `${rangeLabel} • ${hoursCount} godz.` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Szybka rezerwacja z siatki
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {resourceLabel} • {selection.date} • {rangeLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zamknij (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Hidden auto fields - never edited by the reception */}
          <input type="hidden" name="location_slug" value={selection.locationSlug} readOnly />
          <input type="hidden" name="type" value={resourceType} readOnly />
          <input type="hidden" name="resource_id" value={resource.id} readOnly />
          <input type="hidden" name="reservation_date" value={selection.date} readOnly />
          <input type="hidden" name="start_time" value={startTime} readOnly />
          <input type="hidden" name="end_time" value={endTime} readOnly />

          {/* Locked / automatic fields */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center gap-1.5 mb-3 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Uzupełnione automatycznie z siatki</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {autoFields.map((field) => (
                <div key={field.label} className="min-w-0">
                  <span className="block text-[10px] text-slate-500 truncate">{field.label}</span>
                  <span className="block text-xs font-semibold text-slate-200 truncate">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>


          {/* Client details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor="quick-client-name"
                  className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Imię i nazwisko klienta
                  <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setClientName(WALK_IN_NAME);
                    setErrorMessage(null);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Klient od lady (Walk-in)
                </button>
              </div>
              <input
                id="quick-client-name"
                type="text"
                autoFocus
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="np. Jan Kowalski"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="quick-client-phone"
                  className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Telefon
                  <span className="text-[10px] font-normal text-slate-500">(opcjonalnie)</span>
                </label>
                <input
                  id="quick-client-phone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+48 600 000 000"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Liczba graczy / osób
                </span>
                <div className="flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-700 p-1">
                  <button
                    type="button"
                    onClick={() => setGuestsCount((n) => Math.max(1, n - 1))}
                    className="w-9 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold cursor-pointer"
                    title="Mniej osób"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={guestsCount}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (!Number.isNaN(next)) {
                        setGuestsCount(Math.min(24, Math.max(1, next)));
                      }
                    }}
                    className="flex-1 w-full min-w-0 bg-transparent text-center text-sm font-semibold text-slate-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setGuestsCount((n) => Math.min(24, n + 1))}
                    className="w-9 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold cursor-pointer"
                    title="Więcej osób"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>


            {/* Payment status */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Status płatności
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PAYMENT_CHOICES.map((choice) => {
                  const active = paymentChoice === choice.value;
                  return (
                    <button
                      key={choice.value}
                      type="button"
                      onClick={() => setPaymentChoice(choice.value)}
                      className={`px-3 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-100'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/60'
                      }`}
                      title={choice.hint}
                    >
                      <span className="block text-xs font-semibold">{choice.label}</span>
                      <span className="block text-[10px] text-slate-500 mt-0.5 leading-tight">
                        {choice.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Orientation price taken from the owner pricing rules */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Info className="w-3.5 h-3.5" />
              Cena orientacyjna ({hoursCount} godz. × 1 {isBowling ? 'tor' : 'stół'})
            </span>
            <span className="font-mono font-semibold text-emerald-400">
              {priceBreakdown.totalPrice} PLN
            </span>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-semibold cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Zapisywanie...' : 'Zapisz rezerwację'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAdminReservationModal;

