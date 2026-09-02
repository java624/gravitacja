import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, GlassWater, Trophy } from 'lucide-react';

export const FEATURES = [
  {
    id: 'bowling',
    title: '14 Torów Kręglarskich',
    subtitle: 'Nowoczesny system Brunswick',
    description: '14 profesjonalnych torów z automatycznym liczeniem punktów, oświetleniem UV oraz podświetlanymi bandami dla najmłodszych.',
    icon: Trophy,
    color: 'from-orange-500/20 to-red-600/20 border-orange-500/30 text-orange-400',
  },
  {
    id: 'billiards',
    title: 'Strefa Bilardowa',
    subtitle: 'Stoły tournament grade',
    description: 'Profesjonalne stoły 9ft do gry w ósemkę i dziewiątkę. Idealna przestrzeń do rywalizacji przy lampce dobrego trunku.',
    icon: Gamepad2,
    color: 'from-purple-500/20 to-pink-600/20 border-purple-500/30 text-purple-400',
  },
  {
    id: 'vip',
    title: 'VIP Lounge Room',
    subtitle: 'Prywatna strefa premium',
    description: 'Ekskluzywna wydzielona sala z prywatnym torem, wygodnymi sofami, telewizorami 4K i indywidualną obsługą kelnerską.',
    icon: Sparkles,
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
  },
  {
    id: 'bar',
    title: 'Cocktail & Food Bar',
    subtitle: 'Autorskie drinki i włoska pizza',
    description: 'Bogate menu alkoholowe, autorskie koktajle przygotowywane przez barmanów oraz świeża chrupiąca pizza prosto z pieca.',
    icon: GlassWater,
    color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-cyan-400',
  },
];

export default function KatowiceFeatures() {
  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase">Strefy Rozrywki</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">Atrakcje Katowice</h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          Poznaj wszystkie strefy rozrywkowe dostępne w obiekcie Punkt 44.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-6 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl group shadow-xl"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                  {item.subtitle}
                </span>

                <h3 className="text-lg font-black uppercase text-white mb-3 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                <span>Dowiedz się więcej</span>
                <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
