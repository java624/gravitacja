import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Crown, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import type { AdminRole, AdminLocation } from '../../../types/auth';

interface RoleSelectorProps {
  onSelectRole: (role: AdminRole, location?: AdminLocation) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-black uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Krok 1 z 2: Wybierz poziom dostępu
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-white">
          Typ Logowania Do Panelu
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Wybierz swoją rolę oraz lokalizację, aby przejść do odpowiedniego panelu zarządzania.
        </p>
      </div>

      {/* Role Options Container */}
      <div className="grid grid-cols-1 gap-4">
        {/* Reception Role Selection */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Recepcja Lokalizacji (Reception)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Zarządzanie operacyjne rezerwacjami, torami/stołami oraz zgłoszeniami wybranego miasta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {[
              { slug: 'katowice', label: 'Katowice', badge: 'Śląsk' },
              { slug: 'jaworzno', label: 'Jaworzno', badge: 'Galena' },
              { slug: 'poznan', label: 'Poznań', badge: 'Frantowo' },
            ].map((city) => (
              <motion.button
                key={city.slug}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onSelectRole('reception', city.slug as AdminLocation)}
                className="group flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950/80 border border-white/15 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all cursor-pointer text-center shadow-md"
              >
                <span className="text-xs font-black uppercase tracking-wide text-white group-hover:text-cyan-300">
                  {city.label}
                </span>
                <span className="text-[9px] text-slate-500 group-hover:text-cyan-400 font-mono mt-0.5">
                  Recepcja
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Owner Role Selection */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={() => onSelectRole('owner')}
          className="group p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900/80 border border-amber-500/40 hover:border-amber-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black uppercase tracking-wider text-amber-300 group-hover:text-amber-200">
                  Panel Właściciela (Owner / Super Admin)
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-black uppercase">
                  FULL ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Globalna statystyka wszystkich miast, zarządzanie cenami, menu i zmiana haseł.
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </motion.button>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-[11px] text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Wszystkie operacje autoryzacji są chronione bezpieczną sesją.</span>
      </div>
    </div>
  );
};
