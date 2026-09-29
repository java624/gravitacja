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
      color: 'from-blue-500/20 to-indigo-500/10',
      border: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      title: 'Oczekujące na Potwierdzenie',
      value: pendingCount,
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      title: 'Potwierdzone',
      value: confirmedCount,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      title: 'Anulowane',
      value: cancelledCount,
      icon: XCircle,
      color: 'from-rose-500/20 to-red-500/10',
      border: 'border-rose-500/30',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-xl shadow-lg flex items-center justify-between`}
          >
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {card.title}
              </span>
              <span className={`text-2xl sm:text-3xl font-black ${card.textColor}`}>
                {card.value}
              </span>
            </div>
            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${card.textColor}`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
