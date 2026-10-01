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
        return 'Katowice - Punkt 44 (12 torów)';
      case 'jaworzno':
        return 'Jaworzno - Galena';
      case 'poznan':
        return 'Poznań - Posnania';
      default:
        return loc || 'Lokalizacja';
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
          <MapPin className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold uppercase tracking-wider">
              Panel Recepcji
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Sesja aktywna
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1">
            {getLocationName(location)}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dostęp operacyjny do grafiku obłożenia i listy rezerwacji centrum {location?.toUpperCase()}.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenNewBooking}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 hover:bg-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-slate-900" />
          <span>Nowa Rezerwacja</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          title="Wyloguj się z recepcji"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>
      </div>
    </div>
  );
};
