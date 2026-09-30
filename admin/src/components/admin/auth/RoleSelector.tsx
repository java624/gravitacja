import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Crown, ShieldCheck, ChevronRight, UserCheck } from 'lucide-react';
import type { AdminRole, AdminLocation } from '../../../types/auth';

interface RoleSelectorProps {
  onSelectRole: (role: AdminRole, location?: AdminLocation) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium tracking-wide mb-2">
          <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Krok 1 z 2: Wybierz poziom dostępu
        </div>
        <h3 className="text-lg font-bold tracking-tight text-slate-100">
          Typ Logowania Do Panelu
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Wybierz swoją rolę oraz lokalizację, aby przejść do panelu.
        </p>
      </div>

      {/* Role Options Container */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* Reception Role Selection */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100">
                Recepcja Lokalizacji
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Zarządzanie grafikiem obłożenia i rezerwacjami wybranego centrum.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { slug: 'katowice', label: 'Katowice', badge: '12 torów' },
              { slug: 'jaworzno', label: 'Jaworzno', badge: 'Galena' },
              { slug: 'poznan', label: 'Poznań', badge: 'Posnania' },
            ].map((city) => (
              <motion.button
                key={city.slug}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onSelectRole('reception', city.slug as AdminLocation)}
                className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 transition-colors cursor-pointer text-center"
              >
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  {city.label}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {city.badge}
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
          className="group p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 transition-colors flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white">
                  Panel Właściciela / Zarząd
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-semibold">
                  GLOBAL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Statystyki wszystkich miast, cenniki, menu i bezpieczeństwo.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
        </motion.button>
      </div>

      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Wszystkie operacje autoryzacji są chronione bezpieczną sesją.</span>
      </div>
    </div>
  );
};
