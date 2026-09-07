import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Phone, Building2 } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';

interface ForCompaniesHeroProps {
  onScrollToForm: () => void;
}

export default function ForCompaniesHero({ onScrollToForm }: ForCompaniesHeroProps) {
  const katowice = LOCATIONS_DATA.find((l) => l.id === 'katowice') || LOCATIONS_DATA[1];

  return (
    <section className="relative rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden group">
      {/* Neon top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

      {/* Background "hall" atmosphere: dark layers + neon orbs + dark overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-slate-950/80 to-black/90" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-cyan-500/25 to-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-purple-600/25 to-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl group-hover:bg-cyan-400/15 transition-colors" />

        {/* Subtle ceiling grid (bowling hall ceiling) */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Perspective bowling lane strip at the bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-16 skew-x-[-18deg] origin-bottom bg-gradient-to-r from-purple-900/30 via-slate-900/50 to-cyan-900/30 blur-[1px]" />
        <div className="absolute bottom-2 left-[15%] w-[70%] h-[2px] bg-gradient-to-r from-transparent via-pink-500/60 to-transparent shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
        <div className="absolute bottom-2 left-[15%] w-[70%] h-[38px] bg-gradient-to-b from-pink-500/15 via-transparent to-cyan-500/15 blur-sm" />
      </div>

      <div className="relative z-10 space-y-5 sm:space-y-7">
        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.25)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Centrum Rozrywki Gravitacja • {katowice.name} • {katowice.mall}</span>
        </motion.div>

        {/* Big neon heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', damping: 16 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none"
        >
          <span className="drop-shadow-[0_0_35px_rgba(168,85,247,0.55)] bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-500">
            DLA FIRM
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-sm sm:text-xl font-black uppercase tracking-[0.12em] text-white flex items-center gap-3"
        >
          <span className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_#06b6d4]" />
          Imprezy integracyjne, szkolenia, ligi...
          <span className="w-8 h-[2px] bg-gradient-to-l from-cyan-400 to-purple-500 shadow-[0_0_10px_#06b6d4]" />
        </motion.p>

        {/* Lead text */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl font-medium"
        >
          Centrum Rozrywki Gravitacja to idealne miejsce na organizację różnego rodzaju imprez firmowych — od
          szkoleń i konferencji, przez integracje i turnieje, po spotkania wigilijne. Wszystko w kosmicznej,
          neonowej atmosferze z profesjonalną obsługą.
        </motion.p>

        {/* Quick chips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3"
        >
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sala Szkoleniowa</span>
            <span className="text-base sm:text-lg font-black text-cyan-300">Projektor + Ekran</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">VIP Room</span>
            <span className="text-base sm:text-lg font-black text-purple-300">Do 15 osób</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Parking</span>
            <span className="text-base sm:text-lg font-black text-emerald-300">Ogromny • bezpłatny</span>
          </div>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
        >
          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto justify-center px-8 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_30px_rgba(168,85,247,0.55)] flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Building2 className="w-4 h-4" />
            <span>Wyślij zapytanie</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href={`tel:${katowice.phoneClean}`}
            className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 active:scale-98"
          >
            <Phone className="w-4 h-4 text-cyan-400" />
            <span>{katowice.phone}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}