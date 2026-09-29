import React from 'react';
import { Tag, Sparkles, Clock, Calendar } from 'lucide-react';
import type { PriceBreakdownResult } from '../../services/booking/pricingCalculator';

interface PriceBreakdownSummaryProps {
  breakdown: PriceBreakdownResult;
  compact?: boolean;
}

export const PriceBreakdownSummary: React.FC<PriceBreakdownSummaryProps> = ({
  breakdown,
  compact = false,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Podsumowanie i Kalkulacja Ceny
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
          {breakdown.dayLabel}
        </span>
      </div>

      {/* Line Items */}
      <div className="space-y-2">
        {breakdown.lineItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>{item.label}</span>
              {item.detail && (
                <span className="text-[10px] text-slate-500 font-mono">({item.detail})</span>
              )}
            </div>
            <span className="font-mono font-bold text-white shrink-0">
              {item.amount} PLN
            </span>
          </div>
        ))}
      </div>

      {/* Hourly info banner */}
      {!compact && (
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Do 17:00: <strong className="text-cyan-300 font-mono">{breakdown.before17Rate} PLN/godz.</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-400" />
            <span>Po 17:00: <strong className="text-orange-300 font-mono">{breakdown.after17Rate} PLN/godz.</strong></span>
          </div>
        </div>
      )}

      {/* Grand Total */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black uppercase text-slate-300">
            Razem do zapłaty:
          </span>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
            {breakdown.totalPrice} <span className="text-sm font-normal text-white">PLN</span>
          </span>
        </div>
      </div>
    </div>
  );
};
