import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { NAVIGATION_LINKS } from '../../data/navigationData';
import Logo from '../ui/Logo';

interface HeaderProps {
  selectedCity: string | null;
  onSelectCity: (id: string | null) => void;
}

export default function Header({ selectedCity, onSelectCity }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Неонова лінія над хедером */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent blur-[1px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

      {/* Головний контейнер Хедера */}
      <div className="relative rounded-[28px] p-3 md:px-8 md:py-4 border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-950/70 to-black/90 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex justify-between items-center overflow-hidden">
        
        {/* Spotlight scan effect */}
        <motion.div
          animate={{ x: ['-100%', '250%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent skew-x-12 pointer-events-none z-0"
        />

        {/* Логотип (Клік повертає на головну) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Logo onClick={() => onSelectCity(null)} />
        </motion.div>

        {/* Навігація — Десктоп */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl relative z-10 shadow-inner"
        >
          <button
            onClick={() => onSelectCity(null)}
            className={`relative px-4 py-2.5 rounded-xl text-xs font-black tracking-[0.15em] transition-all duration-300 uppercase cursor-pointer ${
              selectedCity === null ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {selectedCity === null && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 shadow-[0_0_25px_rgba(249,115,22,0.6)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 drop-shadow-md">Strona Główna</span>
          </button>

          {NAVIGATION_LINKS.map((loc) => {
            const isActive = selectedCity === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => onSelectCity(loc.id)}
                className={`relative px-5 py-2.5 rounded-xl text-xs font-black tracking-[0.15em] transition-all duration-300 uppercase cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 shadow-[0_0_25px_rgba(249,115,22,0.6)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 drop-shadow-md">{loc.label}</span>
              </button>
            );
          })}
        </motion.nav>

        {/* Кнопка CTA — Десктоп */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex items-center relative z-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black tracking-[0.15em] uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] border border-orange-400/30 cursor-pointer"
          >
            <span>Rezerwuj</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Перемикач мобільного меню */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden relative z-10 p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-orange-500/20 hover:border-orange-500/40 transition-all"
          aria-label="Меню"
        >
          {mobileOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Мобільне Меню */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden mt-3"
          >
            <div className="rounded-[24px] border border-white/10 bg-slate-950/90 backdrop-blur-3xl p-4 flex flex-col gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <span className="text-[10px] font-black tracking-[0.2em] text-orange-400/80 uppercase px-3 pt-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Wybierz lokalizację
              </span>

              <button
                onClick={() => {
                  onSelectCity(null);
                  setMobileOpen(false);
                }}
                className={`text-left px-5 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all flex justify-between items-center ${
                  selectedCity === null
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>Strona Główna</span>
                {selectedCity === null && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
              </button>

              {NAVIGATION_LINKS.map((loc) => {
                const isActive = selectedCity === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectCity(loc.id);
                      setMobileOpen(false);
                    }}
                    className={`text-left px-5 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all flex justify-between items-center ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span>{loc.label}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                  </button>
                );
              })}

              <div className="h-px bg-white/10 my-1" />

              <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-98 transition-transform">
                <span>Rezerwuj Tor</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
