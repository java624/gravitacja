import React from 'react';
import { ChevronLeft, ChevronRight, Minimize2, Monitor, PlusCircle } from 'lucide-react';
import type { AdminLocation } from '../../../types/auth';
import { useReceptionDisplayMode } from '../../../context/ReceptionDisplayModeContext';
import {
  formatDateCompactPL,
  getTodayISODate,
  shiftDateISO,
} from '../timeline/dateNavigation';

interface ReceptionFullscreenBarProps {
  location: AdminLocation;
  /** Data siatki w formacie YYYY-MM-DD. */
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenNewBooking: () => void;
}

/** Krótkie podsumowanie lokalizacji na pasku, np. "Katowice (12 torów + 4 bilardy)". */
const getCompactLocationLabel = (loc: AdminLocation): string => {
  switch (loc) {
    case 'katowice':
      return 'Katowice (12 torów + 4 bilardy)';
    case 'jaworzno':
      return 'Jaworzno - Galena';
    case 'poznan':
      return 'Poznań - Posnania';
    default:
      return loc || 'Lokalizacja';
  }
};

/**
 * Jedyne miejsce, w którym w trybie TV wyświetla się lokalizacja, data i główne
 * akcje recepcji.
 *
 * Zastępuje duży baner (tytuł + opis) oraz cztery karty KPI - te są w trybie
 * pełnoekranowym ukryte, bo pochłaniałyby ~150px pionowej przestrzeni, której
 * potrzebuje siatka z 16 zasobami. Wszystko mieści się w jednym pasku ~40px,
 * dzięki czemu grafik startuje możliwie wysoko.
 *
 * UWAGA: komponent renderowany jest TYLKO dla isFullscreenMode. Zwykły tryb
 * dalej korzysta z ReceptionHeader + ReceptionStats bez żadnych zmian.
 */
export const ReceptionFullscreenBar: React.FC<ReceptionFullscreenBarProps> = ({
  location,
  selectedDate,
  onDateChange,
  onOpenNewBooking,
}) => {
  const { toggleDisplayMode } = useReceptionDisplayMode();
  const todayStr = getTodayISODate();
  const isToday = selectedDate === todayStr;

  return (
    <div className="shrink-0 h-10 px-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between gap-3">
      {/* Left: Location + compact status */}
      <div className="flex items-center gap-2 min-w-0">
        <Monitor className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-xs font-bold text-slate-100 truncate">
          {getCompactLocationLabel(location)}
        </span>
        <span className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Sesja aktywna
        </span>
      </div>

      {/* Center: Date + quick day switchers */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
          <button
            type="button"
            onClick={() => onDateChange(shiftDateISO(selectedDate, -1))}
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Poprzedni dzień"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDateChange(todayStr)}
            className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-colors cursor-pointer ${
              isToday
                ? 'bg-slate-800 text-slate-100'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            Dzisiaj
          </button>
          <button
            type="button"
            onClick={() => onDateChange(shiftDateISO(selectedDate, 1))}
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Następny dzień"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="hidden md:inline text-[11px] font-mono font-medium text-slate-300 whitespace-nowrap">
          {formatDateCompactPL(selectedDate)}
        </span>
      </div>

      {/* Right: New booking + TV mode toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenNewBooking}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-900 hover:bg-white text-[11px] font-semibold transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Nowa Rezerwacja</span>
        </button>

        <button
          type="button"
          onClick={toggleDisplayMode}
          aria-pressed
          title="Wyłącz tryb pełnoekranowy (Esc)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/70 text-cyan-100 hover:bg-cyan-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Tryb Kompaktowy</span>
        </button>
      </div>
    </div>
  );
};