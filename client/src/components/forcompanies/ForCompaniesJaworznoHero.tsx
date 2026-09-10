import { motion } from 'framer-motion';
import { Briefcase, ArrowUpRight, Phone, Sparkles, Users, Grid3X3, Table2, Crown, Utensils } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';
import { JAWORZNO_FIRMY_BANNER, JAWORZNO_FIRMY_INTRO } from '../../data/firmyData';

interface ForCompaniesJaworznoHeroProps {
  onScrollToFeatures: () => void;
  onScrollToForm: () => void;
}

export default function ForCompaniesJaworznoHero({
  onScrollToFeatures,
  onScrollToForm,
}: ForCompaniesJaworznoHeroProps) {
  const jaworzno = LOCATIONS_DATA.find((l) => l.id === 'jaworzno') || LOCATIONS_DATA[0];
  const banner = JAWORZNO_FIRMY_BANNER;
  const intro = JAWORZNO_FIRMY_INTRO;

  return (
    <section className="relative rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 border border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden group">
      {/* Neon top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_12px_#fb7185]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      {/* Corporate night-club atmosphere background + dark overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-slate-950/80 to-black/90" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-rose-500/25 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-amber-500/25 to-rose-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl group-hover:bg-rose-400/15 transition-colors" />

        {/* Subtle ceiling grid (club atmosphere) */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] sm:text-xs font-black tracking-widest uppercase"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Centrum Rozrywki Grawitacja • {jaworzno.name} • {jaworzno.mall}</span>
        </motion.div>

        {/* Big neon heading: DLA FIRM */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, type: 'spring', damping: 16 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-amber-500 drop-shadow-[0_0_35px_rgba(244,63,94,0.45)]">
            {banner.title}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-[11px] sm:text-sm font-black uppercase tracking-[0.12em] text-white flex items-center gap-3"
        >
          <span className="w-8 h-[2px] bg-gradient-to-r from-rose-400 to-amber-500 shadow-[0_0_10px_#fb7185]" />
          {banner.subtitle}
          <span className="w-8 h-[2px] bg-gradient-to-l from-rose-400 to-amber-500 shadow-[0_0_10px_#fb7185]" />
        </motion.p>
{/* Intro questions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="space-y-3"
        >
          {intro.paragraphs.map((paragraph, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Users className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{paragraph}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick chips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
        >
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Grid3X3 className="w-3 h-3 text-rose-400" /> Kręgle
            </span>
            <span className="text-base sm:text-lg font-black text-rose-300">8 torów</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Table2 className="w-3 h-3 text-emerald-400" /> Bilard
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-300">4 stoły</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3 h-3 text-fuchsia-400" /> Strefa VIP
            </span>
            <span className="text-base sm:text-lg font-black text-fuchsia-300">VIP Room</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Utensils className="w-3 h-3 text-amber-400" /> Catering
            </span>
            <span className="text-base sm:text-lg font-black text-amber-300">na zamówienie</span>
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
            onClick={onScrollToFeatures}
            className="w-full sm:w-auto justify-center px-8 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-rose-500 via-red-600 to-purple-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_30px_rgba(244,63,94,0.55)] flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Poznaj nasze atuty</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Briefcase className="w-4 h-4 text-rose-400" />
            <span>Szybkie zapytanie</span>
          </button>

          <a
            href={`tel:${jaworzno.phoneClean}`}
            className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 active:scale-98"
          >
            <Phone className="w-4 h-4 text-rose-400" />
            <span>{jaworzno.phone}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}