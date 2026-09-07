import { motion } from 'framer-motion';
import { Gift, ArrowDown } from 'lucide-react';
import { CORPORATE_FEATURES } from './corporateFeatures';

export default function ForCompaniesFeatures({ onScrollToVoucher }: { onScrollToVoucher: () => void }) {
  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-purple-400 uppercase">Oferta Corporate</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Dlaczego <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">Gravitacja</span>?
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">Wszystko, czego potrzebuje Twoja firma — w jednym miejscu.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {CORPORATE_FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-6 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-xl group shadow-xl"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">{item.subtitle}</span>
                  <h3 className="text-base sm:text-lg font-black uppercase text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-4">
                {item.description}
              </p>
            </motion.div>
          );
        })}

        {/* #5 Vouchery Firmowe — full-width highlight card */}
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.99 }}
          onClick={onScrollToVoucher}
          className="rounded-3xl p-6 sm:px-8 bg-gradient-to-r from-purple-600/25 via-pink-600/20 to-rose-600/25 border border-pink-500/40 backdrop-blur-2xl shadow-[0_0_35px_rgba(236,72,153,0.35)] group w-full text-left cursor-pointer overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-pink-500/30 transition-colors" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-rose-500/25 to-pink-600/25 border border-pink-500/40 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Gift className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-300/80 block mb-1">Bilety i vouchery kwotowe dla pracowników</span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white group-hover:text-pink-300 transition-colors">
                  Vouchery Firmowe
                </h3>
                <p className="text-xs text-pink-200/90 font-medium leading-relaxed mt-2">
                  Vouchery na kręgle, bilard oraz vouchery kwotowe do wykorzystania na wszystkie atrakcje oraz usługi
                  barowe i cateringowe — doskonały upominek dla pracowników i ich rodzin.
                </p>
              </div>
            </div>
            <span className="hidden sm:flex shrink-0 items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-600/20 text-pink-300 text-[10px] font-black uppercase tracking-wider border border-pink-500/40">
              Szczegóły
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </div>
        </motion.button>
      </div>
    </section>
  );
}