import { User, Phone, Mail, Loader2 } from 'lucide-react';
import type { Resource, LocationSlug } from '../../types/booking';

interface Step3ContactDetailsProps {
  selectedLocation: LocationSlug;
  selectedResourceId: string | null;
  availableResources: { resource: Resource; isAvailable: boolean }[];
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  clientName: string;
  setClientName: (val: string) => void;
  clientPhone: string;
  setClientPhone: (val: string) => void;
  clientEmail: string;
  setClientEmail: (val: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function Step3ContactDetails({
  selectedLocation,
  selectedResourceId,
  availableResources,
  date,
  startTime,
  endTime,
  guestsCount,
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  clientEmail,
  setClientEmail,
  isSubmitting,
  onBack,
  onSubmit,
}: Step3ContactDetailsProps) {
  const resourceName = availableResources.find(r => r.resource.id === selectedResourceId)?.resource.name;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-400">Lokalizacja:</span>
          <span className="font-bold text-white uppercase">{selectedLocation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Zasób:</span>
          <span className="font-bold text-orange-400">{resourceName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Termin:</span>
          <span className="font-bold text-white font-mono">{date} | {startTime} - {endTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Liczba osób:</span>
          <span className="font-bold text-white">{guestsCount} graczy</span>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-orange-400" /> Imię i Nazwisko *
        </label>
        <input
          type="text"
          required
          placeholder="np. Jan Kowalski"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-orange-400" /> Numer Telefonu *
        </label>
        <input
          type="tel"
          required
          placeholder="+48 600 000 000"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-orange-400" /> Adres E-mail *
        </label>
        <input
          type="email"
          required
          placeholder="jan.kowalski@example.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
        />
      </div>

      <div className="pt-3 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          ← Wstecz
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.6)] cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Rezerwowanie...</span>
            </>
          ) : (
            <span>Potwierdzam Rezerwację →</span>
          )}
        </button>
      </div>
    </form>
  );
}
