import { motion } from 'framer-motion';
import { Calendar, Tag, Cake, Briefcase, UtensilsCrossed, Sparkles, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocationContext } from '../../context/LocationContext';

export default function LocationQuickGrid() {
  const navigate = useNavigate();
  const { activeSlug } = useLocationContext();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const TILES = [
    {
      id: 'booking',
      title: 'Rezerwacje',
      subtitle: 'Tory Bowling & Stoły Bilard',
      icon: Calendar,
      gradient: 'from-orange-500/20 via-red-500/20 to-orange-600/20 border-orange-500/40 text-orange-400',
      glowColor: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]',
      onClick: () => navigate(`/${activeSlug || 'katowice'}/rezerwacje`),
    },
    {
      id: 'cennik',
      title: 'Cennik',
      subtitle: 'Stawki za 1h gier w obiekcie',
      icon: Tag,
      gradient: 'from-purple-500/20 via-pink-500/20 to-purple-600/20 border-purple-500/40 text-purple-300',
      glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      onClick: () => navigate(`/${activeSlug || 'katowice'}/cennik`),
    },
    {
      id: 'urodziny',
      title: 'Urodziny',
      subtitle: 'Imprezy dla dzieci i młodzieży',
      icon: Cake,
      gradient: 'from-pink-500/20 via-rose-500/20 to-pink-600/20 border-pink-500/40 text-pink-400',
      glowColor: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]',
      onClick: () => navigate(`/${activeSlug || 'katowice'}/dzieci`),
    },
    {
      id: 'firmowe',
      title: 'Dla firm',
      subtitle: 'Integracje, Liga & Catering',
      icon: Briefcase,
      gradient: 'from-cyan-500/20 via-blue-500/20 to-cyan-600/20 border-cyan-500/40 text-cyan-400',
      glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      onClick: () => navigate(`/${activeSlug || 'katowice'}/firmy`),
    },
    {
      id: 'menu',
      title: 'Menu',
      subtitle: 'Włoska pizza, koktajle & alkohole',
      icon: UtensilsCrossed,
      gradient: 'from-amber-500/20 via-orange-500/20 to-amber-600/20 border-amber-500/40 text-amber-400',
      glowColor: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      onClick: () => navigate(`/${activeSlug || 'katowice'}/menu`),
    },
    {
      id: 'promocje',
      title: 'Promocje i wydarzenia',
      subtitle: 'Student Night, Happy Hours & Turnieje',
      icon: Sparkles,
      gradient: 'from-emerald-500/20 via-teal-500/20 to-emerald-600/20 border-emerald-500/40 text-emerald-400',
      glowColor: 'shadow-[0_0_30px_rgba(16,180,129,0.3)]',
      onClick: () => scrollToSection('promocje'),
    },
  ];

  return (
    <section className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase">Szybki Dostęp</span>
          <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">Strefy i Usługi Obiektu</h3>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Wybierz interaktywną kafelkę, aby przejść do wybranej sekcji lub rezerwacji.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {TILES.map((tile, idx) => {
          const Icon = tile.icon;
          return (
            <motion.button
              key={tile.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={tile.onClick}
              className={`relative rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-slate-950/90 to-slate-900/80 border ${tile.gradient} backdrop-blur-xl transition-all duration-300 group flex flex-col justify-between text-left cursor-pointer overflow-hidden shadow-lg ${tile.glowColor}`}
            >
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors pointer-events-none" />

              <div>
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${tile.gradient}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm sm:text-base font-black uppercase text-white tracking-tight mb-1 group-hover:text-orange-400 transition-colors">
                  {tile.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-snug line-clamp-2">
                  {tile.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">
                <span>Otwórz</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
