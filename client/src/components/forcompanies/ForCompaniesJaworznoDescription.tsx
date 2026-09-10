import { motion } from 'framer-motion';
import { CheckCircle2, Grid3X3, Table2, Presentation, Crown } from 'lucide-react';
import { JAWORZNO_FIRMY_DESCRIPTION } from '../../data/firmyData';

const CHIP_ICONS = [Grid3X3, Table2, Presentation, Crown] as const;

export default function ForCompaniesJaworznoDescription() {
  const description = JAWORZNO_FIRMY_DESCRIPTION;
  const title = description.title;

  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-rose-400 uppercase">{description.eyebrow}</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            {title.replace(description.highlight, '')}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400">
              {description.highlight}
            </span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          Imprezy integracyjne, szkolenia, ligi i konferencje — wszystko w jednym miejscu.
        </p>
      </div>

      {/* Intro paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-5 sm:p-7 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl"
      >
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          {description.text}
        </p>
      </motion.div>

      {/* Quick stats chips */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {description.chips.map((chip, index) => {
          const Icon = CHIP_ICONS[index % CHIP_ICONS.length];
          return (
            <div key={chip.label} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-rose-400" />
                {chip.label}
              </span>
              <span className="text-sm sm:text-base font-black text-white">{chip.value}</span>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}