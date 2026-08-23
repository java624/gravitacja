import { motion } from 'framer-motion';
import { LOCATIONS } from '../data/locations';
import Logo from './Logo';

interface HeaderProps {
  selectedCity: string | null;
  onSelectCity: (id: string) => void;
}

export default function Header({ selectedCity, onSelectCity }: HeaderProps) {
  return (
    <header className="relative z-30 w-full max-w-7xl mx-auto px-6 py-6">
      
      {/* Glassmorphism контейнер з ефектом відблиску */}
      <div className="relative rounded-3xl p-4 md:px-8 border border-white/10 bg-slate-950/40 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex justify-between items-center overflow-hidden">
        
        {/* Анімований промінь світла на фоні хедера */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent skew-x-12 pointer-events-none"
        />

        {/* Окремий компонент логотипу */}
        <Logo />

        {/* Навігація з інтерактивним перемикачем */}
        <motion.nav 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-2xl relative z-10 shadow-inner"
        >
          {LOCATIONS.map((loc) => {
            const isActive = selectedCity === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => onSelectCity(loc.id)}
                className={`relative px-5 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all duration-300 uppercase cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* Анімований неоновий таб активного міста */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 shadow-[0_0_25px_rgba(249,115,22,0.6)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 drop-shadow-md">{loc.name}</span>
              </button>
            );
          })}
        </motion.nav>

      </div>
    </header>
  );
}