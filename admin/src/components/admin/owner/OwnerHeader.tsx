import React from 'react';
import { Crown, LogOut, PlusCircle, Globe } from 'lucide-react';
import type { LocationSlug } from '../../../types/booking';

interface OwnerHeaderProps {
  selectedCityFilter: LocationSlug | 'all';
  onCityFilterChange: (city: LocationSlug | 'all') => void;
  onOpenNewBooking: () => void;
  onLogout: () => void;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({
  selectedCityFilter,
  onCityFilterChange,
  onOpenNewBooking,
  onLogout,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0">
          <Crown className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold uppercase tracking-wider">
              Zarząd / Właściciel
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Dostęp Globalny
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1">
            Panel Zarządzania Siecią
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Zarządzanie operacyjne i strategiczne: Katowice (12 torów), Jaworzno i Poznań.
          </p>
        </div>
      </div>

      {/* Controls & Location Switcher */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* City Filter Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          {[
            { id: 'all', label: 'Wszystkie Miasta' },
            { id: 'katowice', label: 'Katowice' },
            { id: 'jaworzno', label: 'Jaworzno' },
            { id: 'poznan', label: 'Poznań' },
          ].map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onCityFilterChange(city.id as LocationSlug | 'all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCityFilter === city.id
                  ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenNewBooking}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-900 hover:bg-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-slate-900" />
          <span>Nowa Rezerwacja</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          title="Wyloguj się z panelu właściciela"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>
      </div>
    </div>
  );
};
