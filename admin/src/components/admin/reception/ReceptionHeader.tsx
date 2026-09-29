import React from 'react';
import { MapPin, LogOut, PlusCircle, ShieldCheck } from 'lucide-react';
import type { AdminLocation } from '../../../types/auth';

interface ReceptionHeaderProps {
  location: AdminLocation;
  onOpenNewBooking: () => void;
  onLogout: () => void;
}

export const ReceptionHeader: React.FC<ReceptionHeaderProps> = ({
  location,
  onOpenNewBooking,
  onLogout,
}) => {
  const getLocationName = (loc: AdminLocation) => {
    switch (loc) {
      case 'katowice':
        return 'Katowice (Śląsk)';
      case 'jaworzno':
        return 'Jaworzno (Galena)';
      case 'poznan':
        return 'Poznań (Frantowo)';
      default:
        return loc || 'Lokalizacja';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <MapPin className="w-7 h-7" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider">
              Panel Recepcji
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Aktywna Sesja
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-0.5">
            {getLocationName(location)}
          </h1>
          <p className="text-xs text-slate-400">
            Dostęp ograniczony do danych operacyjnych centrum {location?.toUpperCase()}.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenNewBooking}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 border border-orange-400/40 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:from-orange-400 hover:to-red-500 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nowa Rezerwacja na Recepcji</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Wyloguj się z recepcji"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>
      </div>
    </div>
  );
};
