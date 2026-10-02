import { Phone, MapPin } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';
import type { LocationSlug } from '../../context/LocationContext';

interface PhoneIslandProps {
  locationSlug: LocationSlug;
  /** Dodatkowe klasy pozycjonujące (np. margines w hero). */
  className?: string;
}

/**
 * "Phone Island" - unoszący się nad treścią panel z numerem telefonu miasta.
 *
 * Trafił tu z głównego paska (Header), który ma pozostać minimalistyczny:
 * logo + nawigacja + przycisk REZERWUJ. Dzięki temu numer telefonu jest
 * w jednym, przewidywalnym miejscu na stronie lokalu zamiast w dwóch
 * konkurencyjnych miejscach w menu.
 *
 * Projekt: okna (velvet) ciemne tło, blur, cienka ramka i neonowe
 * rozświetlenie przy najechaniu. Całość to jeden klikalny `<a href="tel:...">`,
 * więc działa też jako aktywny element bez rozbudowanego JS.
 */
export default function PhoneIsland({ locationSlug, className = '' }: PhoneIslandProps) {
  const location = LOCATIONS_DATA.find((l) => l.id === locationSlug);

  // Brak danych o mieście - nie renderujemy pustego kafelka.
  if (!location) return null;

  return (
    <a
      href={`tel:${location.phoneClean}`}
      aria-label={`Zadzwoń do Grawitacji ${location.name}: ${location.phone}`}
      title={`Zadzwoń do Grawitacji ${location.name}`}
      className={`
        group relative inline-flex items-center gap-3 sm:gap-3.5
        rounded-2xl sm:rounded-[22px] px-4 sm:px-5 py-3 sm:py-3.5
        bg-slate-900/80 backdrop-blur-md
        border border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.6)]
        hover:border-orange-400/40
        hover:shadow-[0_14px_44px_rgba(0,0,0,0.7),0_0_28px_rgba(249,115,22,0.28)]
        active:scale-[0.98]
        transition-all duration-300 cursor-pointer
        no-underline
        ${className}
      `}
    >
      {/* Delikatna poświata w tle, rozświetlająca się przy najechaniu */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-red-500/0 opacity-0 group-hover:opacity-100 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-red-500/10 transition-opacity duration-300"
      />
      {/* Neonowa krawędź u góry */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Ikona telefonu w "pudełku" */}
      <span className="relative z-10 shrink-0 grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 group-hover:border-orange-400/60 group-hover:text-orange-300 group-hover:shadow-[0_0_18px_rgba(249,115,22,0.45)] transition-all duration-300">
        <Phone className="w-[18px] h-[18px] sm:w-5 sm:h-5" strokeWidth={2.2} />
      </span>

      {/* Numer + miasto */}
      <span className="relative z-10 flex flex-col leading-tight min-w-0">
        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          <MapPin className="w-3 h-3 text-orange-500/80 shrink-0" />
          {location.name}
        </span>
        <span className="font-mono text-base sm:text-lg font-black text-white tracking-tight group-hover:text-orange-300 transition-colors duration-300">
          {location.phone}
        </span>
      </span>
    </a>
  );
}