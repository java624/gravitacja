import { ChevronRight, MapPin, ShieldCheck, Gamepad2, Heart } from 'lucide-react';

import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl pt-16 pb-10 px-6 overflow-hidden">
      {/* Фонова неонова підсвітка у підвалі */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-r from-orange-600/10 via-red-600/15 to-purple-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Верхній блок: Логотип + Опис */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-12 border-b border-white/5 gap-6">
          <div>
            <Logo />
            <p className="mt-3 text-xs text-slate-400 max-w-sm font-medium">
              Najnowocześniejsze centrum rozrywki — kręgle, bilard, restauracja i niezapomniane emocje.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span>Lokale otwarte dzisiaj</span>
          </div>
        </div>

        {/* Навігаційна сітка */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm text-slate-400 text-left py-12">
          
          {/* Секція 1: Локації */}
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Nasze lokale
            </h4>
            <ul className="space-y-3 text-xs">
              {[
                'Jaworzno - Galeria Galena',
                'Katowice - Punkt 44',
                'Poznań - Posnania'
              ].map((location) => (
                <li 
                  key={location}
                  className="hover:text-white cursor-pointer transition-all duration-300 flex items-center justify-between group p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  <span className="group-hover:translate-x-1 transition-transform">{location}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-orange-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </li>
              ))}
            </ul>
          </div>

          {/* Секція 2: Інформація */}
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              Informacje
            </h4>
            <ul className="space-y-3 text-xs">
              {['O nas', 'Polityka prywatności', 'Regulamin lokalu'].map((item) => (
                <li 
                  key={item}
                  className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-orange-500 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Секція 3: Правила гри */}
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-500" />
              Zasady gry
            </h4>
            <ul className="space-y-3 text-xs">
              {['Poradnik gry w kręgle', 'Poradnik gry w bilard'].map((item) => (
                <li 
                  key={item}
                  className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-purple-500 transition-colors" />
                  <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Копірайт та копірайт-лінія */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 Centrum Rozrywki Gravitacja. Wszystkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <span>Designed with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500/20 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}