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
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">
            Wszystkie {selectedCityFilter !== 'all' ? `(${selectedCityFilter.toUpperCase()})` : ''}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
            {totalCount}
          </span>
        </div>
        <div className="p-2.5 rounded-xl border bg-slate-800 text-slate-300 border-slate-700">
          <Calendar className="w-5 h-5 text-slate-300" />
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">
            Oczekujące
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
            {pendingCount}
          </span>
        </div>
        <div className="p-2.5 rounded-xl border bg-amber-950/40 text-amber-300 border-amber-800/60">
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">
            Potwierdzone
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-300 font-mono">
            {confirmedCount}
          </span>
        </div>
        <div className="p-2.5 rounded-xl border bg-emerald-950/40 text-emerald-300 border-emerald-800/60">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">
            Szacowany Przychód
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
            {estimatedRevenue} <span className="text-sm font-normal text-slate-400">PLN</span>
          </span>
        </div>
        <div className="p-2.5 rounded-xl border bg-slate-800 text-cyan-300 border-slate-700">
          <DollarSign className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">
            Wskaźnik Realizacji
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
              {totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0}%
            </span>
            <span className="text-xs text-rose-400 font-mono">
              ({cancelledCount} anul.)
            </span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl border bg-slate-800 text-slate-300 border-slate-700">
          <TrendingUp className="w-5 h-5 text-slate-300" />
        </div>
      </div>
    </div>
  );
};
