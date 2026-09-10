import React from 'react';
import { Calendar, Clock, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';
import type { LocationSlug } from '../../../types/booking';

interface OwnerGlobalStatsProps {
  totalCount: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  selectedCityFilter: LocationSlug | 'all';
}

export const OwnerGlobalStats: React.FC<OwnerGlobalStatsProps> = ({
  totalCount,
  pendingCount,
  confirmedCount,
  cancelledCount,
  selectedCityFilter,
}) => {
  // Estimated average booking value ~120 PLN per booking slot
  const estimatedRevenue = confirmedCount * 120;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Wszystkie Rezerwacje {selectedCityFilter !== 'all' ? `(${selectedCityFilter.toUpperCase()})` : ''}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">
            {totalCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950/80 border border-orange-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Oczekujące
          </span>
          <span className="text-2xl sm:text-3xl font-black text-orange-400">
            {pendingCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Potwierdzone
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
            {confirmedCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Szacowany Przychód
          </span>
          <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
            {estimatedRevenue} <span className="text-sm font-normal">PLN</span>
          </span>
        </div>
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 to-slate-950/80 border border-purple-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Konwersja / Anulowane
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
              {totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0}%
            </span>
            <span className="text-xs text-rose-400 font-mono">
              ({cancelledCount} anulowane)
            </span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
