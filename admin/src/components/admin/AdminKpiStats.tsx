import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface AdminKpiStatsProps {
  totalCount: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
}

export default function AdminKpiStats({
  totalCount,
  pendingCount,
  confirmedCount,
  cancelledCount,
}: AdminKpiStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wszystkie Wpisy</div>
        <div className="text-2xl sm:text-3xl font-black text-white mt-1">{totalCount}</div>
      </div>

      <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
        <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> Oczekujące
        </div>
        <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{pendingCount}</div>
      </div>

      <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3" /> Potwierdzone
        </div>
        <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{confirmedCount}</div>
      </div>

      <div className="bg-slate-950/70 border border-red-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.1)]">
        <div className="text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1.5">
          <XCircle className="w-3 h-3" /> Anulowane
        </div>
        <div className="text-2xl sm:text-3xl font-black text-red-400 mt-1">{cancelledCount}</div>
      </div>
    </div>
  );
}
