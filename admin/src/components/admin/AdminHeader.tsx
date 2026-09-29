import { ShieldCheck, Database, Plus, LogOut } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminHeaderProps {
  onOpenNewBooking: () => void;
  onLogout?: () => void;
}

export default function AdminHeader({ onOpenNewBooking, onLogout }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 border border-white/15 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
      <div>
        <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-orange-400 mb-1">
          <ShieldCheck className="w-4 h-4 text-orange-400" />
          <span>Panel Recepcji & Właściciela</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Zarządzanie Rezerwacjami
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Podgląd i zmiana statusów rezerwacji na żywo w centrach Gravitacja.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2 border ${
          isSupabaseConfigured
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          <Database className="w-3.5 h-3.5" />
          <span>{isSupabaseConfigured ? 'Supabase Live DB' : 'Demo Local Storage'}</span>
        </div>

        <button
          onClick={onOpenNewBooking}
          className="px-4 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:from-orange-400 hover:to-red-500 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nowa Rezerwacja</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Zablokuj panel i wyloguj"
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Zablokuj</span>
          </button>
        )}
      </div>
    </div>
  );
}
