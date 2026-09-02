import { motion } from 'framer-motion';
import type { Promotion } from '../../types';

export default function PromotionCard({ item }: { item: Promotion }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="rounded-3xl p-6 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group shadow-lg"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${item.badgeColor} shadow-md`}>
            {item.tag}
          </span>
        </div>

        <h3 className="text-lg font-black uppercase text-white mb-1 group-hover:text-orange-400 transition-colors">
          {item.title}
        </h3>

        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-500 uppercase text-[10px]">Cena:</span>
          <span className="text-orange-400 font-black">{item.price}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>{item.time}</span>
        </div>

        <button className="w-full mt-2 py-2.5 rounded-xl bg-white/5 hover:bg-orange-500 hover:text-white text-slate-200 border border-white/10 hover:border-transparent text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer">
          Szczegóły
        </button>
      </div>
    </motion.div>
  );
}