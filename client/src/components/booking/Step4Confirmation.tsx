import { CheckCircle2 } from 'lucide-react';
import type { Resource, LocationSlug } from '../../types/booking';

interface Step4ConfirmationProps {
  clientName: string;
  completedReservationId: string | null;
  selectedLocation: LocationSlug;
  selectedResourceId: string | null;
  availableResources: { resource: Resource; isAvailable: boolean }[];
  date: string;
  startTime: string;
  endTime: string;
  totalPrice?: number;
  onClose: () => void;
}

export default function Step4Confirmation({
  clientName,
  completedReservationId,
  selectedLocation,
  selectedResourceId,
  availableResources,
  date,
  startTime,
  endTime,
  totalPrice,
  onClose,
}: Step4ConfirmationProps) {
  const resourceName = availableResources.find(r => r.resource.id === selectedResourceId)?.resource.name;

  return (
    <div className="text-center py-6 space-y-5">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Sukces! Rezerwacja Otrzymana</span>
        <h3 className="text-xl font-black text-white mt-1">Dziękujemy, {clientName}!</h3>
        <p className="text-xs text-slate-400 mt-1">
          Twoja rezerwacja została zarejestrowana i opłacona w systemie Gravitacja.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-900/90 border border-white/15 rounded-2xl p-4 text-xs text-left space-y-2 font-mono">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-slate-400">ID Rezerwacji:</span>
          <span className="font-bold text-orange-400">{completedReservationId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Centrum:</span>
          <span className="font-bold text-white uppercase">{selectedLocation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Zasób:</span>
          <span className="font-bold text-white">{resourceName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Data & Czas:</span>
          <span className="font-bold text-white">{date} ({startTime} - {endTime})</span>
        </div>
        {totalPrice && (
          <div className="flex justify-between border-t border-white/10 pt-2 text-amber-300 font-bold">
            <span>Wartość zamówienia:</span>
            <span>{totalPrice} PLN</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Status Płatności:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-sans font-bold text-[10px] uppercase">
            Opłacono / Potwierdzono
          </span>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-8 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_25px_rgba(249,115,22,0.5)] cursor-pointer"
        >
          Zamknij Okno
        </button>
      </div>
    </div>
  );
}
