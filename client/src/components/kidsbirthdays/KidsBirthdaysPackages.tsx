import { motion } from 'framer-motion';
import { CheckCircle2, Crown, Users, Clock, CalendarRange } from 'lucide-react';
import { BIRTHDAY_PACKAGES, type BirthdayPackage } from './kidsBirthdaysData';

interface KidsBirthdaysPackagesProps {
  onScrollToForm: (packageId?: 'slonce' | 'gravitacja') => void;
  packages?: BirthdayPackage[];
}

export default function KidsBirthdaysPackages({
  onScrollToForm,
  packages = BIRTHDAY_PACKAGES,
}: KidsBirthdaysPackagesProps) {
  const minGroupNote = packages.find((pkg) => pkg.minGroup)?.minGroup ?? 'minimum 5 osób';
  const hasTiers = packages.some((pkg) => pkg.priceTiers && pkg.priceTiers.length > 0);
  return (
    <section id="zestawy-urodzinowe" className="scroll-mt-28 space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-pink-400 uppercase">Zestawy Urodzinowe</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Wybierz swój <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-amber-300">pakiet</span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          Dwa sprawdzone zestawy — {minGroupNote}. Cena za osobę.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <motion.div
              key={pkg.id}
              whileHover={{ y: -6 }}
              className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 to-slate-950/95 border backdrop-blur-2xl transition-all duration-300 group shadow-xl ${pkg.glow} ${
                pkg.featured
                  ? 'border-pink-500/50 hover:border-pink-400/70'
                  : 'border-amber-500/25 hover:border-amber-400/50'
              }`}
            >
              {/* Featured badge */}
              {pkg.featured && (
                <div className="absolute -top-3 right-6 z-20">
                  <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400/40 flex items-center gap-1.5">
                    <Crown className="w-3 h-3" />
                    {pkg.badge}
                  </div>
                </div>
              )}

              {/* Ambient glow orb */}
              <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full blur-2xl pointer-events-none bg-white/5 group-hover:bg-white/10 transition-colors" />

              <div className="relative z-10 space-y-5">
                {/* Header row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">{pkg.tagline}</span>
                      <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${pkg.featured ? 'text-pink-300' : 'text-amber-300'}`}>
                        {pkg.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Price */}
                {pkg.priceTiers && pkg.priceTiers.length > 0 ? (
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                      <CalendarRange className="w-3 h-3 text-pink-400" />
                      <span>Cennik • za osobę</span>
                    </div>
                    {pkg.priceTiers.map((tier) => (
                      <div key={tier.label} className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tier.label}</span>
                        <span className="text-xl sm:text-2xl font-black text-white leading-none">{tier.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-end gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white leading-none">
                      {pkg.pricePerPerson}
                    </span>
                    <span className="text-xs font-black uppercase text-slate-400 tracking-wider pb-1">za osobę</span>
                  </div>
                )}

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    <Users className="w-3 h-3 text-pink-400" />
                    {pkg.minGroup}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {pkg.duration} gry w kręgle
                  </span>
                </div>

                {/* Checklist */}
                <ul className="space-y-2 border-t border-white/10 pt-4">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-slate-300 font-medium leading-snug">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.featured ? 'text-pink-400' : 'text-amber-400'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => onScrollToForm(pkg.id)}
                  className={`w-full mt-2 px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-white flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-transform ${
                    pkg.featured
                      ? 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 shadow-[0_0_30px_rgba(236,72,153,0.55)]'
                      : 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.45)]'
                  }`}
                >
                  Zarezerwuj pakiet {pkg.name}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      {hasTiers && (
        <p className="text-[10px] text-slate-500 font-medium max-w-2xl">
          Ceny obowiązują za osobę. Wariant weekendowy (piątek, sobota, niedziela) obowiązuje również w dni świąteczne — szczegóły potwierdzimy telefonicznie.
        </p>
      )}
    </section>
  );
}