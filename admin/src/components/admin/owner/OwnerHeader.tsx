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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/90 border border-amber-500/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(245,158,11,0.1)]">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(245,158,11,0.3)]">
          <Crown className="w-7 h-7" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
              Super Admin / Owner
            </span>
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
              <Globe className="w-3 h-3" /> Dostęp Globalny
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-0.5">
            Panel Zarządzania Właściciela
          </h1>
          <p className="text-xs text-slate-400">
            Pełna kontrola nad wszystkimi lokalizacjami, cenami, menu i bezpieczeństwem.
          </p>
        </div>
      </div>

      {/* Controls & Location Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        {/* City Filter Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900 border border-white/15">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedCityFilter === city.id
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {city.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenNewBooking}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 border border-orange-400/40 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:from-orange-400 hover:to-red-500 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Utwórz Rezerwację</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title="Wyloguj się z panelu właściciela"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>
      </div>
    </div>
  );
};
