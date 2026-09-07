import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { BIRTHDAY_EXTRAS } from './kidsBirthdaysData';

export default function KidsBirthdaysExtras() {
  return (
    <section id="atrakcje-dodatkowe" className="scroll-mt-28 space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase">Atrakcje Dodatkowe</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Podkręć <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-amber-300">przyjęcie</span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          Dodatkowe atrakcje i słodycze, które możecie dokupić do wybranego pakietu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {BIRTHDAY_EXTRAS.map((extra) => {
          const Icon = extra.icon;
          return (
            <motion.div
              key={extra.id}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', damping: 18 }}
              className="rounded-2xl p-5 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 backdrop-blur-xl hover:border-pink-500/30 transition-colors duration-300 group shadow-lg flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 shrink-0 rounded-2xl border flex items-center justify-center ${extra.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">{extra.unit}</span>
                  <h3 className="text-sm font-black uppercase text-white leading-snug">{extra.name}</h3>
                  {extra.desc && <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">{extra.desc}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-xl font-black text-white">{extra.price}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-[9px] font-black uppercase tracking-wider text-pink-300">
                  <Plus className="w-3 h-3" /> Dodatek
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}