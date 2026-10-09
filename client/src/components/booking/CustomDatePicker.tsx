import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

export interface CustomDatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  minDate?: string; // Format: YYYY-MM-DD (defaults to today)
  maxDate?: string; // Format: YYYY-MM-DD
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

// Polish localization constants
const POLISH_MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const POLISH_MONTHS_GENITIVE = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
];

const POLISH_WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];

// Helper to format Date -> 'YYYY-MM-DD' in local time
function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper to parse 'YYYY-MM-DD' into a local Date
function parseDateISO(str: string): Date | null {
  if (!str) return null;
  const parts = str.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

// Format date for human reading in Polish: "14 października 2026"
function formatPolishDisplay(isoStr: string): string {
  const d = parseDateISO(isoStr);
  if (!d) return '';
  const day = d.getDate();
  const monthName = POLISH_MONTHS_GENITIVE[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  label = 'Data',
  placeholder = 'Wybierz datę...',
  disabled = false,
  className = '',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const todayStr = formatDateISO(new Date());
  const effectiveMinDate = minDate ?? todayStr;

  // Initial view year and month
  const initialDate = parseDateISO(value) || parseDateISO(effectiveMinDate) || new Date();
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [slideDirection, setSlideDirection] = useState<number>(0);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Position state for Portal dropdown
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    width: 320,
    placeAbove: false,
  });

  const componentId = useId();

  // Sync view month when value changes
  useEffect(() => {
    if (value) {
      const parsed = parseDateISO(value);
      if (parsed) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
  }, [value]);

  // Recalculate floating position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 370;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    const width = Math.max(rect.width, 320);
    let left = rect.left;

    // Prevent off-screen overflow on the right
    if (left + width > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - 16 - width);
    }

    setCoords({
      top: placeAbove ? rect.top - 8 : rect.bottom + 8,
      left,
      width,
      placeAbove,
    });
  }, []);

  // Open/Close toggle
  const toggleOpen = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleScrollOrResize = () => {
      if (isOpen) updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Month navigation
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection(-1);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection(1);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleTodayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onChange(todayStr);
    setIsOpen(false);
  };

  // Day selection
  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    const iso = formatDateISO(selected);
    onChange(iso);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Calendar matrix computation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Get starting day index where Monday is 0
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Check if date is disabled
  const isDateDisabled = (day: number): boolean => {
    const current = formatDateISO(new Date(viewYear, viewMonth, day));
    if (effectiveMinDate && current < effectiveMinDate) return true;
    if (maxDate && current > maxDate) return true;
    return false;
  };

  // Check if date is selected
  const isDateSelected = (day: number): boolean => {
    if (!value) return false;
    const current = formatDateISO(new Date(viewYear, viewMonth, day));
    return current === value;
  };

  // Check if date is today
  const isDateToday = (day: number): boolean => {
    const current = formatDateISO(new Date(viewYear, viewMonth, day));
    return current === todayStr;
  };

  const monthSlideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 35 : -35,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.22, ease: 'easeOut' as const },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -35 : 35,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.18, ease: 'easeIn' as const },
    }),
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      {label && (
        <label
          id={`${componentId}-label`}
          className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-[#ff5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]" />
          <span>{label}</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={`${componentId}-trigger`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${componentId}-label` : undefined}
        disabled={disabled}
        onClick={toggleOpen}
        className={`group relative w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-mono transition-all duration-300 outline-none cursor-pointer ${
          disabled
            ? 'opacity-40 cursor-not-allowed bg-[#0d111d]/50 border border-[#232d42]'
            : isOpen
            ? 'bg-[#111625] border-[#ff5500] text-white shadow-[0_0_20px_rgba(255,85,0,0.35)] ring-1 ring-[#ff5500]/60'
            : 'bg-[#111625]/90 hover:bg-[#111625] border-[#232d42] hover:border-[#ff5500]/60 text-slate-200 hover:text-white hover:shadow-[0_0_15px_rgba(255,85,0,0.18)]'
        } backdrop-blur-md`}
      >
        {/* Glow ambient background on hover */}
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff5500]/5 via-transparent to-[#ff5500]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="flex items-center gap-2.5 truncate">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.7)]'
                : 'bg-white/5 text-[#ff5500] group-hover:bg-[#ff5500]/20'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
          <span className={`truncate ${value ? 'text-white font-medium' : 'text-slate-400'}`}>
            {value ? formatPolishDisplay(value) : placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  onChange('');
                }
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Wyczyść datę"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider font-sans font-bold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:border-[#ff5500]/40 transition-colors">
            {value ? value.split('-').slice(1).reverse().join('.') : 'PL'}
          </span>
        </div>
      </button>

      {error && <span className="text-[11px] text-red-400 mt-1 font-sans">{error}</span>}

      {/* Dropdown Popover via React Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                role="dialog"
                aria-modal="true"
                aria-label="Kalendarz wyboru daty"
                initial={{ opacity: 0, scale: 0.95, y: coords.placeAbove ? 10 : -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: coords.placeAbove ? 10 : -10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                style={{
                  position: 'fixed',
                  top: coords.placeAbove ? 'auto' : `${coords.top}px`,
                  bottom: coords.placeAbove ? `${window.innerHeight - coords.top}px` : 'auto',
                  left: `${coords.left}px`,
                  width: `${coords.width}px`,
                  zIndex: 99999,
                }}
                className="bg-[#111625]/95 backdrop-blur-2xl border border-[#232d42] rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,85,0,0.2)] select-none outline-none overflow-hidden"
              >
                {/* Cyber accent top border highlight */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5500] to-transparent opacity-80" />

                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#232d42]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {POLISH_MONTHS[viewMonth]} {viewYear}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleTodayClick}
                      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white/5 hover:bg-[#ff5500]/20 text-slate-300 hover:text-[#ff5500] border border-white/10 hover:border-[#ff5500]/40 transition-all cursor-pointer mr-1"
                    >
                      Dziś
                    </button>
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      aria-label="Poprzedni miesiąc"
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label="Następny miesiąc"
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekdays Row */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  {POLISH_WEEKDAYS.map((day, idx) => (
                    <div
                      key={day}
                      className={`text-[11px] font-bold uppercase tracking-wider py-1 ${
                        idx >= 5 ? 'text-[#ff5500]/80' : 'text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days Matrix with Animated Month Slide */}
                <div className="relative overflow-hidden min-h-[210px]">
                  <AnimatePresence custom={slideDirection} mode="wait">
                    <motion.div
                      key={`${viewYear}-${viewMonth}`}
                      custom={slideDirection}
                      variants={monthSlideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="grid grid-cols-7 gap-1"
                    >
                      {/* Previous month padding days */}
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => {
                        const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1;
                        return (
                          <div
                            key={`prev-${i}`}
                            className="h-8 flex items-center justify-center text-[11px] text-slate-600 font-mono select-none"
                          >
                            {dayNum}
                          </div>
                        );
                      })}

                      {/* Current month active days */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const disabled = isDateDisabled(day);
                        const selected = isDateSelected(day);
                        const isToday = isDateToday(day);

                        return (
                          <button
                            key={`curr-${day}`}
                            type="button"
                            disabled={disabled}
                            onClick={() => handleSelectDay(day)}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`relative h-8 rounded-xl font-mono text-xs flex items-center justify-center transition-all cursor-pointer ${
                              disabled
                                ? 'opacity-25 text-slate-600 cursor-not-allowed pointer-events-none'
                                : selected
                                ? 'text-white font-bold'
                                : 'text-slate-200 hover:text-white'
                            }`}
                          >
                            {/* Selected highlight with Framer Motion layoutId */}
                            {selected && (
                              <motion.div
                                layoutId="selectedDatePill"
                                className="absolute inset-0 rounded-xl bg-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.6)]"
                                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                              />
                            )}

                            {/* Hover magnetic highlight */}
                            {!selected && !disabled && hoveredDay === day && (
                              <motion.div
                                layoutId="hoverDatePill"
                                className="absolute inset-0 rounded-xl bg-white/10 border border-[#ff5500]/40 shadow-[0_0_10px_rgba(255,85,0,0.25)]"
                                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                              />
                            )}

                            {/* Today ring indicator */}
                            {isToday && !selected && (
                              <span className="absolute inset-0.5 rounded-lg border border-[#ff5500]/50 pointer-events-none" />
                            )}

                            <span className="relative z-10">{day}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Quick Info */}
                <div className="mt-3 pt-2.5 border-t border-[#232d42] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff5500] shadow-[0_0_6px_#ff5500]" />
                    <span className="text-slate-300">Wybór: {value || 'Brak'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    Zamknij
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default CustomDatePicker;
