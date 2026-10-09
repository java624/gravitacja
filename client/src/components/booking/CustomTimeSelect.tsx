import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, Check, Sparkles } from 'lucide-react';

export interface TimeOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface CustomTimeSelectProps {
  value: string;
  onChange: (time: string) => void;
  options: (string | TimeOption)[];
  minTime?: string; // Values <= minTime will be disabled
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const CustomTimeSelect: React.FC<CustomTimeSelectProps> = ({
  value,
  onChange,
  options,
  minTime,
  label = 'Godzina',
  placeholder = 'Wybierz...',
  disabled = false,
  className = '',
  error,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const componentId = useId();

  // Normalize options into TimeOption objects
  const normalizedOptions: TimeOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      const isDisabled = minTime ? opt <= minTime : false;
      return { value: opt, label: opt, disabled: isDisabled };
    }
    const isDisabled = opt.disabled || (minTime ? opt.value <= minTime : false);
    return { ...opt, disabled: isDisabled };
  });

  // Calculate floating dropdown coordinates
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    width: 200,
    placeAbove: false,
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 260;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    const width = Math.max(rect.width, 180);
    let left = rect.left;

    if (left + width > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - 16 - width);
    }

    setCoords({
      top: placeAbove ? rect.top - 6 : rect.bottom + 6,
      left,
      width,
      placeAbove,
    });
  }, []);

  const toggleOpen = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Scroll active item into view on open
  useEffect(() => {
    if (isOpen && listRef.current && value) {
      const activeEl = listRef.current.querySelector(`[data-time-value="${value}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, value]);

  // Click outside and keyboard listeners
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
        return;
      }

      const enabledOptions = normalizedOptions.filter((o) => !o.disabled);
      if (enabledOptions.length === 0) return;

      const currentIndex = enabledOptions.findIndex((o) => o.value === (hoveredValue || value));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
        setHoveredValue(enabledOptions[nextIdx].value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
        setHoveredValue(enabledOptions[prevIdx].value);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const targetVal = hoveredValue || value;
        const targetOpt = enabledOptions.find((o) => o.value === targetVal);
        if (targetOpt) {
          onChange(targetOpt.value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
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
  }, [isOpen, hoveredValue, value, normalizedOptions, updatePosition, onChange]);

  const handleSelect = (time: string, isOptDisabled?: boolean) => {
    if (isOptDisabled) return;
    onChange(time);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative flex flex-col ${className}`}>
      {label && (
        <label
          id={`${componentId}-label`}
          className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          {icon || <Clock className="w-3.5 h-3.5 text-[#ff5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]" />}
          <span>{label}</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={`${componentId}-trigger`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${componentId}-label` : undefined}
        disabled={disabled}
        onClick={toggleOpen}
        className={`group relative w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-mono transition-all duration-300 outline-none cursor-pointer ${
          disabled
            ? 'opacity-40 cursor-not-allowed bg-[#0d111d]/50 border border-[#232d42]'
            : isOpen
            ? 'bg-[#111625] border-[#ff5500] text-white shadow-[0_0_20px_rgba(255,85,0,0.35)] ring-1 ring-[#ff5500]/60'
            : 'bg-[#111625]/90 hover:bg-[#111625] border-[#232d42] hover:border-[#ff5500]/60 text-slate-200 hover:text-white hover:shadow-[0_0_15px_rgba(255,85,0,0.18)]'
        } backdrop-blur-md`}
      >
        {/* Glow ambient background on hover */}
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff5500]/5 via-transparent to-[#ff5500]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="flex items-center gap-2 truncate">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 ${
              isOpen
                ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.7)]'
                : 'bg-white/5 text-[#ff5500] group-hover:bg-[#ff5500]/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className={`font-semibold text-xs tracking-wider ${value ? 'text-white' : 'text-slate-400 font-normal'}`}>
            {value || placeholder}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 group-hover:text-white transition-colors shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      {error && <span className="text-[11px] text-red-400 mt-1 font-sans">{error}</span>}

      {/* Floating Dropdown List via Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                role="listbox"
                aria-label={label}
                initial={{ opacity: 0, scale: 0.94, y: coords.placeAbove ? 8 : -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: coords.placeAbove ? 6 : -6 }}
                transition={{ type: 'spring', damping: 24, stiffness: 380 }}
                style={{
                  position: 'fixed',
                  top: coords.placeAbove ? 'auto' : `${coords.top}px`,
                  bottom: coords.placeAbove ? `${window.innerHeight - coords.top}px` : 'auto',
                  left: `${coords.left}px`,
                  width: `${coords.width}px`,
                  zIndex: 99999,
                }}
                className="bg-[#111625]/95 backdrop-blur-2xl border border-[#232d42] rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(255,85,0,0.2)] select-none outline-none overflow-hidden"
              >
                {/* Cyber neon top glow line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5500] to-transparent opacity-80" />

                {/* Sub-header banner */}
                <div className="px-2.5 py-1.5 mb-1.5 flex items-center justify-between border-b border-[#232d42]/80 text-[10px] uppercase font-bold tracking-widest text-slate-400 font-sans">
                  <span className="flex items-center gap-1 text-[#ff5500]">
                    <Sparkles className="w-3 h-3" /> Slot Czasowy
                  </span>
                  <span className="font-mono text-slate-500">24H</span>
                </div>

                {/* Scrollable List with custom scrollbar */}
                <div
                  ref={listRef}
                  onMouseLeave={() => setHoveredValue(null)}
                  className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-[#232d42] scrollbar-track-transparent hover:scrollbar-thumb-[#ff5500]/40"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#232d42 transparent',
                  }}
                >
                  {normalizedOptions.map((opt) => {
                    const isSelected = opt.value === value;
                    const isHovered = hoveredValue === opt.value;
                    const isDisabled = opt.disabled;

                    return (
                      <div
                        key={opt.value}
                        data-time-value={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        aria-disabled={isDisabled}
                        onClick={() => handleSelect(opt.value, isDisabled)}
                        onMouseEnter={() => !isDisabled && setHoveredValue(opt.value)}
                        className={`relative px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                          isDisabled
                            ? 'opacity-25 text-slate-600 cursor-not-allowed select-none'
                            : isSelected
                            ? 'text-white font-bold'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {/* Sliding Hover Pill indicator */}
                        {isHovered && !isDisabled && !isSelected && (
                          <motion.div
                            layoutId="timeSlidingHover"
                            className="absolute inset-0 rounded-xl bg-white/10 border border-[#ff5500]/40 shadow-[0_0_12px_rgba(255,85,0,0.2)]"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          />
                        )}

                        {/* Selected Indicator Pill */}
                        {isSelected && (
                          <motion.div
                            layoutId="timeSelectedPill"
                            className="absolute inset-0 rounded-xl bg-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.6)]"
                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          />
                        )}

                        <span className="relative z-10 font-mono tracking-wider">{opt.label || opt.value}</span>

                        <div className="relative z-10 flex items-center gap-1.5">
                          {isDisabled && (
                            <span className="text-[9px] font-sans uppercase font-bold text-slate-500 bg-black/30 px-1 py-0.5 rounded">
                              niedostępne
                            </span>
                          )}
                          {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default CustomTimeSelect;
