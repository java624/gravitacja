import { ChevronRight, MapPin, ShieldCheck, Gamepad2, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { FOOTER_SECTIONS } from '../../data/navigationData';
import { LOCATIONS_DATA } from '../../data/locationsData';
import { useLocationContext } from '../../context/LocationContext';

const FacebookIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

interface FooterProps {
  onSelectCity?: (id: string) => void;
}

export default function Footer({ onSelectCity }: FooterProps) {
  const navigate = useNavigate();
  const { activeSlug } = useLocationContext();

  // Social linki bieżącego miasta, a na stronie bez wybranego lokalu - główne.
  const activeLocation = LOCATIONS_DATA.find((l) => l.id === activeSlug) ?? null;
  const facebookHref = activeLocation?.facebookUrl || 'https://facebook.com';
  const instagramHref = activeLocation?.instagramUrl || 'https://instagram.com';
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
      {/* Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gradient-to-r from-orange-600/10 via-red-600/15 to-purple-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header Row */}
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

        {/* 4 Navigation Columns */}
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
                        } else if (item.href && item.href.startsWith('/')) {
                          navigate(item.href);
                        }
                      }}
                      className="w-full flex items-center justify-between group p-2 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all duration-300 text-left cursor-pointer"
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

          {/* Column 4: Opening hours */}
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

        {/* Bottom copyright row + socials (moved out of the header) */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-5">
          <p>© 2026 Centrum Rozrywki Gravitacja. Wszystkie prawa zastrzeżone.</p>

          <div className="flex items-center gap-4 sm:gap-5">
            {/* Social media — jedyne miejsce na stronie, gdzie są dostępne */}
            <div className="flex items-center gap-2">
              <a
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                title={activeLocation ? `Facebook Grawitacja ${activeLocation.name}` : 'Facebook Grawitacja'}
                aria-label="Facebook"
                className="grid place-items-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-500/10 hover:shadow-[0_0_18px_rgba(59,130,246,0.35)] transition-all duration-300 active:scale-95"
              >
                <FacebookIcon />
              </a>
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                title={activeLocation ? `Instagram Grawitacja ${activeLocation.name}` : 'Instagram Grawitacja'}
                aria-label="Instagram"
                className="grid place-items-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-pink-400 hover:border-pink-400/40 hover:bg-pink-500/10 hover:shadow-[0_0_18px_rgba(236,72,153,0.35)] transition-all duration-300 active:scale-95"
              >
                <InstagramIcon />
              </a>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Nowoczesna rozrywka w Twoim mieście</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
