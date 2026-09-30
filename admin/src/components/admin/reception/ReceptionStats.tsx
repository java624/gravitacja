import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface ReceptionStatsProps {
  totalCount: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
}

export const ReceptionStats: React.FC<ReceptionStatsProps> = ({
  totalCount,
  pendingCount,
  confirmedCount,
  cancelledCount,
}) => {
  const cards = [
    {
      title: 'Wszystkie Rezerwacje',
      value: totalCount,
      icon: Calendar,
      iconColor: 'text-slate-300',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      title: 'Oczekujące na Potwierdzenie',
      value: pendingCount,
      icon: Clock,
      iconColor: 'text-amber-400',
      badgeColor: 'bg-amber-950/40 text-amber-300 border-amber-800/60',
    },
    {
      title: 'Potwierdzone / Aktywne',
      value: confirmedCount,
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60',
    },
    {
      title: 'Anulowane',
      value: cancelledCount,
      icon: XCircle,
      iconColor: 'text-rose-400',
      badgeColor: 'bg-rose-950/40 text-rose-300 border-rose-800/60',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">
                {card.title}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
                {card.value}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border ${card.badgeColor}`}>
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
