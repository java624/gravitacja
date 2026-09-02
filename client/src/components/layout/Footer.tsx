import { ChevronRight, MapPin, ShieldCheck, Gamepad2, Clock, Sparkles } from 'lucide-react';
import Logo from '../ui/Logo';
import { FOOTER_SECTIONS } from '../../data/navigationData';

interface FooterProps {
  onSelectCity?: (id: string) => void;
}

export default function Footer({ onSelectCity }: FooterProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MapPin':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-red-500" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-gradient-to-b from-slate-950/90 via-slate-950 to-black pt-16 pb-10 px-4 sm:px-6 overflow-hidden">
      {/* Фонова неонова підсвітка */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gradient-to-r from-orange-600/10 via-red-600/15 to-purple-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Верхній блок: Логотип + Статус */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-10 border-b border-white/10 gap-6">
          <div className="space-y-3">
            <Logo size="md" />
            <p className="text-xs text-slate-400 max-w-md font-medium leading-relaxed">
              Najnowocześniejsze centrum rozrywki — kręgle, bilard, restauracja i niezapomniane emocje w kosmicznym wydaniu.
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 backdrop-blur-xl shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Lokale otwarte dzisiaj</span>
          </div>
        </div>

        {/* Навігаційна сітка (4 колонки) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 text-sm text-slate-400 text-left py-12">
          
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                {getIcon(section.icon)}
                {section.title}
              </h4>
              <ul className="space-y-2 text-xs font-medium">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <button
                      onClick={() => {
                        if (onSelectCity && (item.title === 'Jaworzno' || item.title === 'Katowice' || item.title === 'Poznań')) {
                          onSelectCity(item.title.toLowerCase());
                        }
                      }}
                      className="w-full flex items-center justify-between group p-2 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all duration-300 text-left"
                    >
                      <div className="flex flex-col">
                        <span className="text-slate-200 group-hover:text-orange-400 font-bold transition-colors">{item.title}</span>
                        {item.subtitle && <span className="text-[10px] text-slate-500">{item.subtitle}</span>}
                      </div>
                      <ChevronRight className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Секція 4: Godziny otwarcia */}
          <div className="space-y-4">
            <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Godziny otwarcia
            </h4>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs space-y-2 font-medium backdrop-blur-md">
              <div className="flex justify-between items-center text-slate-300">
                <span>Pn - Czw:</span>
                <span className="text-white font-bold">12:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Pt - Sob:</span>
                <span className="text-orange-400 font-bold drop-shadow-[0_0_6px_rgba(249,115,22,0.4)]">12:00 - 02:00</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Niedziela:</span>
                <span className="text-white font-bold">12:00 - 23:00</span>
              </div>
            </div>
          </div>

        </div>

        {/* Нижній блок з копірайтом */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 Centrum Rozrywki Gravitacja. Wszystkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Nowoczesna rozrywka w Twoim mieście</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
