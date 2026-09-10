import { motion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { JAWORZNO_FIRMY_ATUTY, JAWORZNO_FIRMY_SUMMARY } from '../../data/firmyData';

export default function ForCompaniesJaworznoFeatures() {
  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase">Nasze atuty</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Dlaczego <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-amber-400">Grawitacja Jaworzno</span>?
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">Wszystko, czego potrzebuje Twoja firma — w jednym miejscu.</p>
      </div>

      {/* Glassmorphism grid of atuty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {JAWORZNO_FIRMY_ATUTY.map((atut) => {
          const Icon = atut.icon;
          return (
            <motion.div
              key={atut.id}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-5 bg-white/[0.06] border border-white/10 backdrop-blur-xl shadow-xl group transition-colors hover:border-rose-500/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 shrink-0 rounded-2xl border ${atut.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner ${atut.glow}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-black uppercase text-white leading-tight tracking-wide">
                  {atut.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-3">{atut.text}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Closing summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-600/15 via-purple-600/10 to-amber-600/15 border border-rose-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(244,63,94,0.3)]"
      >
        <div className="absolute -top-8 -left-8 w-40 h-40 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 hidden sm:flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/25 to-amber-600/25 border border-rose-500/40 text-rose-400 shadow-inner">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <p className="text-sm sm:text-lg font-black text-white leading-snug">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-pink-400 to-amber-400">Zapewniamy:</span>{' '}
            {JAWORZNO_FIRMY_SUMMARY.text}
          </p>
          <Sparkles className="w-6 h-6 hidden lg:flex shrink-0 text-amber-400" />
        </div>
      </motion.div>
    </section>
  );
}