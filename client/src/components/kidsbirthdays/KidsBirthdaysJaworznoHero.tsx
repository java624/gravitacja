import { motion } from 'framer-motion';
import { Cake, PartyPopper, Phone, ArrowUpRight, Sparkles, Users, Clock } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';
import { JAWORZNO_KIDS_INTRO } from '../../data/kidsData';

interface KidsBirthdaysJaworznoHeroProps {
  onScrollToPackages: () => void;
  onScrollToForm: () => void;
}

export default function KidsBirthdaysJaworznoHero({
  onScrollToPackages,
  onScrollToForm,
}: KidsBirthdaysJaworznoHeroProps) {
  const jaworzno = LOCATIONS_DATA.find((l) => l.id === 'jaworzno') || LOCATIONS_DATA[0];
  const intro = JAWORZNO_KIDS_INTRO;

  return (
    <section className="relative rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 border border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden group">
      {/* Neon top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_12px_#fb7185]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      {/* Party atmosphere background + dark overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-slate-950/80 to-black/90" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-rose-500/25 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-amber-500/25 to-rose-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl group-hover:bg-rose-400/15 transition-colors" />

        {/* Confetti dots */}
        <div className="absolute top-8 left-[12%] w-2 h-2 rounded-full bg-rose-400/60 shadow-[0_0_10px_#fb7185] animate-pulse" />
        <div className="absolute top-16 left-[38%] w-1.5 h-1.5 rounded-full bg-amber-300/70 shadow-[0_0_8px_#fcd34d] animate-pulse" style={{ animationDelay: '0.4s' }} />
        <div className="absolute top-24 left-[62%] w-2 h-2 rounded-full bg-purple-400/60 shadow-[0_0_10px_#a855f7] animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-12 right-[10%] w-1.5 h-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_8px_#67e8f9] animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-16 left-[20%] w-1.5 h-1.5 rounded-full bg-rose-400/60 shadow-[0_0_8px_#fb7185] animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] sm:text-xs font-black tracking-widest uppercase"
        >
          <Cake className="w-3.5 h-3.5" />
          <span>{intro.badge}</span>
          <span className="w-8 h-[2px] bg-gradient-to-l from-rose-400 to-amber-400 shadow-[0_0_10px_#fb7185]" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight"
        >
          Urodziny dla Dzieci w{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-amber-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.45)]">
            Jaworznie
          </span>
        </motion.h1>

        {/* Intro paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
        >
          {intro.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl font-medium">
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Quick chips */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3"
        >
          {intro.chips.map((chip, index) => (
            <div key={chip.label} className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{chip.label}</span>
              <span className={`text-base sm:text-lg font-black ${index === 0 ? 'text-amber-300' : index === 1 ? 'text-rose-300' : 'text-emerald-300'}`}>
                {chip.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
        >
          <button
            onClick={onScrollToPackages}
            className="w-full sm:w-auto justify-center px-8 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-rose-500 via-red-600 to-purple-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_30px_rgba(244,63,94,0.55)] flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Zestawy urodzinowe</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <PartyPopper className="w-4 h-4 text-rose-400" />
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

        {/* Invitation callout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium"
        >
          <Users className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>
            <span className="text-rose-300 font-black uppercase tracking-wider mr-1.5">Zapraszamy:</span>
            {intro.cta}
          </span>
        </motion.div>

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap gap-2"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            <Users className="w-3 h-3 text-rose-400" /> min. 6 osób
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            <Clock className="w-3 h-3 text-amber-400" /> pakiet 1h / 2h gry
          </span>
        </motion.div>
      </div>
    </section>
  );
}