import React from 'react';
import { MapPin, LogOut, PlusCircle, ShieldCheck, Maximize2, Minimize2 } from 'lucide-react';
import type { AdminLocation } from '../../../types/auth';
import { useReceptionDisplayMode } from '../../../context/ReceptionDisplayModeContext';

interface ReceptionHeaderProps {
  location: AdminLocation;
  onOpenNewBooking: () => void;
  onLogout: () => void;
  /** Tryb "Pełny ekran (Bez skrолu)" - kompaktowe odstępy w nagłówku. */
  isFullscreenMode?: boolean;
}

export const ReceptionHeader: React.FC<ReceptionHeaderProps> = ({
  location,
  onOpenNewBooking,
  onLogout,
  isFullscreenMode = false,
}) => {
  const { toggleDisplayMode, isBrowserFullscreen } = useReceptionDisplayMode();
  const getLocationName = (loc: AdminLocation) => {
    switch (loc) {
      case 'katowice':
        return 'Katowice - Punkt 44 (12 torów)';
      case 'jaworzno':
        return 'Jaworzno - Galena';
      case 'poznan':
        return 'Poznań - Posnania';
      default:
        return loc || 'Lokalizacja';
    }
  };

  return (
    <div
      className={
        isFullscreenMode
          ? 'shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 shadow-md'
          : 'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md'
      }
    >
      <div className={`flex items-center ${isFullscreenMode ? 'gap-2.5' : 'gap-4'}`}>
        <div
          className={`rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0 ${
            isFullscreenMode ? 'w-8 h-8' : 'w-12 h-12'
          }`}
        >
          <MapPin className={isFullscreenMode ? 'w-4 h-4' : 'w-6 h-6'} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold uppercase tracking-wider">
              Panel Recepcji
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Sesja aktywna
            </span>
          </div>
          <h1
            className={`font-bold tracking-tight text-slate-100 mt-0.5 ${
              isFullscreenMode ? 'text-base' : 'text-xl sm:text-2xl mt-1'
            }`}
          >
            {getLocationName(location)}
          </h1>
          {!isFullscreenMode && (
            <p className="text-xs text-slate-400 mt-0.5">
              Dostęp operacyjny do grafiku obłożenia i listy rezerwacji centrum {location?.toUpperCase()}.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* TV Mode / Fit-to-Screen toggle (persisted in localStorage) */}
        <button
          type="button"
          onClick={toggleDisplayMode}
          aria-pressed={isFullscreenMode}
          className={`flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-colors cursor-pointer border ${
            isFullscreenMode
              ? 'px-3 py-2 bg-cyan-500/20 border-cyan-400/70 text-cyan-100 hover:bg-cyan-500/30'
              : 'px-3.5 py-2.5 bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
          } ${isFullscreenMode ? 'text-xs' : 'text-xs'}`}
          title={
            isFullscreenMode
              ? 'Wyłącz tryb pełnoekranowy (Esc)'
              : 'Włącz tryb pełnoekranowy - grafik bez przewijania'
          }
        >
          {isFullscreenMode ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
          <span className="whitespace-nowrap">
            {isFullscreenMode ? 'Tryb Kompaktowy' : 'Pełny ekran (Bez skrолu)'}
          </span>
          {isBrowserFullscreen && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenNewBooking}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-900 hover:bg-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm ${
            isFullscreenMode ? 'px-3 py-2' : 'px-4 py-2.5'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-slate-900" />
          <span>Nowa Rezerwacja</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className={`flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer ${
            isFullscreenMode ? 'px-2.5 py-2' : 'px-3.5 py-2.5'
          }`}
          title="Wyloguj się z recepcji"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Wyloguj</span>
        </button>
      </div>
    </div>
  );
};
