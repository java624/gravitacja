import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Plus,
  CircleDot,
  Dices,
  RefreshCw,
  Info,
} from 'lucide-react';
import type { Reservation, Resource } from '../../../types/booking';
import type { TimelineQuickSelection } from './quickBooking';
import { extractNumber, formatResourceDisplayName } from './resourceDisplay';

interface TimelineGridViewProps {
  resources: Resource[];
  reservations: Reservation[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSelectReservation: (res: Reservation) => void;
  /** Called when the operator clicks / click-&-drags free hour cells of one row. */
  onQuickBook?: (selection: TimelineQuickSelection) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  locationName?: string;
  /**
   * Tryb TV / Fit-to-Screen: siatka wypełnia dostępną wysokość i szerokość, więc
   * wszystkie 16 zasobów oraz wszystkie godziny mieszczą się bez scrollbarów.
   */
  isFullscreenMode?: boolean;
}

// Operating hours displayed on the horizontal timeline: 10:00 to 24:00
const START_HOUR = 10;
const END_HOUR = 24;
const HOURS_COUNT = END_HOUR - START_HOUR; // 14 hours
const HOURS_LIST = Array.from({ length: HOURS_COUNT }, (_, i) => START_HOUR + i);

const parseTimeToHours = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) + (m || 0) / 60;
};

// Resource naming helpers live in ./resourceDisplay (shared with the quick modal)

export const TimelineGridView: React.FC<TimelineGridViewProps> = ({
  resources,
  reservations,
  selectedDate,
  onDateChange,
  onSelectReservation,
  onQuickBook,
  onRefresh,
  isLoading = false,
  locationName,
  isFullscreenMode = false,
}) => {
  const [resourceFilter, setResourceFilter] = useState<'all' | 'bowling' | 'billiards'>('all');

  // Szerokość sticky kolumny zasobu. W trybie TV jest węższa, żeby oddać więcej
  // miejsca na godziny - pozycję linii „teraz" liczymy z tej samej wartości.
  const resourceColWidthClass = isFullscreenMode ? 'w-28' : 'w-48';
  const resourceColWidthPx = isFullscreenMode ? 112 : 192;

  // ----- Multi-cell (click & drag) selection inside one resource row -----
  const [drag, setDrag] = useState<{
    resourceId: string;
    anchorHour: number;
    currentHour: number;
  } | null>(null);
  const [gridNotice, setGridNotice] = useState<string | null>(null);

  // Short inline hint (e.g. "this hour is already taken") - disappears automatically.
  useEffect(() => {
    if (!gridNotice) return;
    const timer = window.setTimeout(() => setGridNotice(null), 2800);
    return () => window.clearTimeout(timer);
  }, [gridNotice]);

  // Selected range while dragging: start hour inclusive, end hour exclusive (17..19 => 17:00-19:00).
  const dragRange = useMemo(() => {
    if (!drag) return null;
    const resource = resources.find((r) => r.id === drag.resourceId);
    if (!resource) return null;
    return {
      resource,
      startHour: Math.min(drag.anchorHour, drag.currentHour),
      endHour: Math.max(drag.anchorHour, drag.currentHour) + 1,
    };
  }, [drag, resources]);

  const dragLabel = useMemo(() => {
    if (!dragRange) return null;
    const { resource, startHour, endHour } = dragRange;
    const hours = endHour - startHour;
    return `${formatResourceDisplayName(resource)} • ${startHour}:00 – ${endHour}:00 • ${hours} godz.`;
  }, [dragRange]);

  // Releasing the mouse button closes the range and hands it to the quick booking modal.
  useEffect(() => {
    if (!drag) return;

    const handleMouseUp = () => {
      const range = dragRange;
      setDrag(null);

      if (range && onQuickBook) {
        onQuickBook({
          resource: range.resource,
          locationSlug: range.resource.location_slug || 'katowice',
          date: selectedDate,
          startHour: range.startHour,
          endHour: range.endHour,
        });
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [drag, dragRange, onQuickBook, selectedDate]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isToday = selectedDate === todayStr;

  // Filter & sort resources: 1) all bowling (Tor 1..12) first, 2) all billiards (Stół 1..X) next
  const sortedAndFilteredResources = useMemo(() => {
    const filtered = resources.filter((res) => {
      if (resourceFilter === 'all') return true;
      return res.type === resourceFilter;
    });

    return [...filtered].sort((a, b) => {
      // 1. Group by category: bowling first, then billiards, then others
      const typeRank = (t: string) => {
        if (t === 'bowling') return 1;
        if (t === 'billiards') return 2;
        return 3;
      };

      const rankDiff = typeRank(a.type) - typeRank(b.type);
      if (rankDiff !== 0) return rankDiff;

      // 2. Numerical sort by number: Tor 1..12 or Stół 1..2
      const numA = extractNumber(a.name) || extractNumber(a.id);
      const numB = extractNumber(b.name) || extractNumber(b.id);
      if (numA !== numB) {
        return numA - numB;
      }

      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
  }, [resources, resourceFilter]);

  // Current time position (if today)
  const currentTimePositionPercent = useMemo(() => {
    if (!isToday) return null;
    const now = new Date();
    const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
    if (currentHourDecimal < START_HOUR || currentHourDecimal > END_HOUR) return null;
    return ((currentHourDecimal - START_HOUR) / HOURS_COUNT) * 100;
  }, [isToday]);

  // Filter reservations for current day
  const dayReservations = useMemo(() => {
    return reservations.filter((r) => r.reservation_date === selectedDate && r.status !== 'cancelled');
  }, [reservations, selectedDate]);

  // Stats for the day
  const pendingCount = dayReservations.filter((r) => r.status === 'pending').length;
  const confirmedCount = dayReservations.filter((r) => r.status === 'confirmed').length;

  // Navigation handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    onDateChange(todayStr);
  };

  // Formatted date string in Polish
  const formattedDateTitle = useMemo(() => {
    try {
      const d = new Date(selectedDate + 'T12:00:00');
      return d.toLocaleDateString('pl-PL', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div
      className={`bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col text-slate-100 ${
        isFullscreenMode ? 'flex-1 min-h-0 rounded-xl' : 'rounded-2xl'
      }`}
    >
      {/* Top Bar: Date Navigator, Filters & Legend */}
      <div
        className={`border-b border-slate-800 bg-slate-900/90 flex flex-col lg:flex-row items-stretch lg:items-center justify-between ${
          isFullscreenMode
            ? 'shrink-0 p-2 gap-2'
            : 'p-4 sm:p-5 gap-4'
        }`}
      >
        {/* Date Navigator */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1">
            <button
              type="button"
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Poprzedni dzień"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isToday
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              Dzisiaj
            </button>
            <button
              type="button"
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Następny dzień"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="bg-transparent text-slate-100 font-medium focus:outline-none cursor-pointer"
            />
          </div>

          <div className="hidden sm:block">
            <span
              className={`font-semibold capitalize text-slate-200 ${
                isFullscreenMode ? 'text-xs' : 'text-sm'
              }`}
            >
              {formattedDateTitle}
            </span>
            {locationName && (
              <span className="ml-2 text-xs text-slate-400 uppercase font-mono">
                • {locationName}
              </span>
            )}
          </div>
        </div>

        {/* Filters, Legend & Refresh */}
        <div
          className={`flex flex-wrap items-center self-end lg:self-center ${
            isFullscreenMode ? 'gap-2' : 'gap-3'
          }`}
        >
          {/* Resource Filter */}
          <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-1 text-xs">
            <button
              type="button"
              onClick={() => setResourceFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                resourceFilter === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Wszystkie ({resources.length})
            </button>
            <button
              type="button"
              onClick={() => setResourceFilter('bowling')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                resourceFilter === 'bowling'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kręgle ({resources.filter((r) => r.type === 'bowling').length})
            </button>
            <button
              type="button"
              onClick={() => setResourceFilter('billiards')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                resourceFilter === 'billiards'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bilard ({resources.filter((r) => r.type === 'billiards').length})
            </button>
          </div>

          {/* Status Legend */}
          <div
            className={`flex items-center bg-slate-950/70 border border-slate-800 rounded-xl ${
              isFullscreenMode ? 'gap-2 text-[10px] px-2 py-1' : 'gap-3 text-xs px-3 py-1.5'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-400 border border-amber-300" />
              <span className="text-slate-300 font-medium">Oczekuje ({pendingCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-400" />
              <span className="text-slate-300 font-medium">Potwierdzona ({confirmedCount})</span>
            </div>
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Odśwież grafik"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Live selection / hint bar for the click & drag booking flow */}
      {(dragLabel || gridNotice) && (
        <div
          className={`border-b flex items-center gap-2 ${
            isFullscreenMode ? 'shrink-0 px-3 py-1 text-[10px]' : 'px-5 py-2 text-xs'
          } ${
            gridNotice
              ? 'border-amber-800/60 bg-amber-950/40 text-amber-200'
              : 'border-cyan-800/60 bg-cyan-950/40 text-cyan-200'
          }`}
        >
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium">{gridNotice || `Wybrano: ${dragLabel}`}</span>
        </div>
      )}

      {/* Main Grid View Container with sticky left column */}
      <div
        className={`relative select-none ${
          isFullscreenMode ? 'flex-1 min-h-0 overflow-hidden flex flex-col' : 'overflow-x-auto'
        }`}
      >
        <div className={isFullscreenMode ? 'flex-1 min-h-0 flex flex-col min-w-0' : 'min-w-[1200px]'}>
          {/* Header Row: Hours Timeline */}
          <div
            className={`flex border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20 ${
              isFullscreenMode ? 'shrink-0' : ''
            }`}
          >
            {/* Sticky Resource Title Cell (Updated Header: ZASÓB (Tor / Stół)) */}
            <div
              className={`${resourceColWidthClass} shrink-0 font-semibold text-slate-300 uppercase tracking-wider border-r border-slate-800 bg-slate-950 sticky left-0 z-30 flex items-center justify-between ${
                isFullscreenMode ? 'px-2 py-1 text-[10px]' : 'px-4 py-3 text-xs'
              }`}
            >
              <span className="truncate">ZASÓB (Tor / Stół)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {sortedAndFilteredResources.length}
              </span>
            </div>

            {/* Hour Columns Header */}
            <div className="flex-1 grid grid-cols-14 relative min-w-0">
              {HOURS_LIST.map((hour) => (
                <div
                  key={hour}
                  className={`text-center font-mono font-medium text-slate-400 border-r border-slate-800/80 last:border-r-0 ${
                    isFullscreenMode ? 'py-1 px-0.5 text-[10px]' : 'py-3 px-2 text-xs'
                  }`}
                >
                  {hour}:00
                </div>
              ))}
            </div>
          </div>

          {/* Resources Rows */}
          <div
            className={`divide-y divide-slate-800/70 relative ${
              isFullscreenMode ? 'flex-1 min-h-0 flex flex-col' : ''
            }`}
          >
            {/* Current Time Indicator Line across rows */}
            {currentTimePositionPercent !== null && (
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
                style={{
                  left: `calc(${resourceColWidthPx}px + (100% - ${resourceColWidthPx}px) * ${
                    currentTimePositionPercent / 100
                  })`,
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md -mt-1" />
                <div className="w-0.5 flex-1 bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              </div>
            )}

            {sortedAndFilteredResources.length === 0 ? (
              <div className={`p-12 text-center text-slate-500 text-sm ${isFullscreenMode ? 'flex-1' : ''}`}>
                Brak zasobów spełniających kryteria.
              </div>
            ) : (
              sortedAndFilteredResources.map((resource, index) => {
                // Find all bookings for this resource on this day
                const resBookings = dayReservations.filter((b) => b.resource_id === resource.id);
                const isBowling = resource.type === 'bowling';
                const displayName = formatResourceDisplayName(resource);

                // Hours already covered by a booking in this row - the drag must not cross them
                const occupiedHours = new Set<number>();
                resBookings.forEach((booking) => {
                  const from = parseTimeToHours(booking.start_time);
                  const to = parseTimeToHours(booking.end_time);
                  HOURS_LIST.forEach((hour) => {
                    if (from < hour + 1 && to > hour) {
                      occupiedHours.add(hour);
                    }
                  });
                });

                // Range highlighted while the mouse is being dragged over this row
                const isDragRow = drag?.resourceId === resource.id;
                const selectionStart = drag ? Math.min(drag.anchorHour, drag.currentHour) : -1;
                const selectionEnd = drag ? Math.max(drag.anchorHour, drag.currentHour) : -1;

                // Check if this is the first billiard table when viewing all resources
                const isFirstBilliards =
                  resourceFilter === 'all' &&
                  resource.type === 'billiards' &&
                  (index === 0 || sortedAndFilteredResources[index - 1]?.type === 'bowling');

                return (
                  <React.Fragment key={resource.id}>
                    {/* Visual Section Divider between Bowling and Billiards */}
                    {isFirstBilliards && (
                      <div
                        className={`flex border-y border-slate-800/90 bg-slate-950 text-xs font-semibold ${
                          isFullscreenMode ? 'shrink-0' : ''
                        }`}
                      >
                        <div
                          className={`${resourceColWidthClass} shrink-0 border-r border-slate-800 bg-slate-950 sticky left-0 z-10 flex items-center gap-2 text-emerald-400 tracking-wider ${
                            isFullscreenMode ? 'px-2 py-0.5 text-[9px]' : 'px-4 py-2'
                          }`}
                        >
                          <Dices className={isFullscreenMode ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
                          <span className="truncate">STOŁY BILARDOWE</span>
                        </div>
                        <div
                          className={`flex-1 px-4 text-slate-500 font-medium flex items-center bg-slate-950/70 ${
                            isFullscreenMode ? 'py-0.5 text-[10px]' : 'py-2 text-[11px]'
                          }`}
                        >
                          Strefa Stołów Bilardowych
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex group hover:bg-slate-800/20 transition-colors ${
                        isFullscreenMode ? 'flex-1 min-h-0' : 'min-h-[58px]'
                      }`}
                    >
                      {/* Sticky Resource Info Cell */}
                      <div
                        className={`${resourceColWidthClass} shrink-0 border-r border-slate-800 bg-slate-900 sticky left-0 z-10 flex items-center ${
                          isFullscreenMode ? 'px-2 py-1 gap-1.5' : 'px-4 py-2.5 gap-3'
                        }`}
                      >
                        <div
                          className={`rounded-lg border shrink-0 ${
                            isFullscreenMode ? 'p-1' : 'p-2 rounded-xl'
                          } ${
                            isBowling
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {isBowling ? (
                            <CircleDot className={isFullscreenMode ? 'w-3 h-3' : 'w-4 h-4'} />
                          ) : (
                            <Dices className={isFullscreenMode ? 'w-3 h-3' : 'w-4 h-4'} />
                          )}
                        </div>

                        <div className="overflow-hidden">
                          <div
                            className={`font-semibold text-slate-100 truncate flex items-center gap-1.5 ${
                              isFullscreenMode ? 'text-[11px]' : 'text-xs'
                            }`}
                          >
                            <span>{displayName}</span>
                          </div>
                          <span
                            className={`font-medium text-slate-400 uppercase tracking-wider block ${
                              isFullscreenMode ? 'text-[8px]' : 'text-[10px]'
                            }`}
                          >
                            {isBowling ? 'TOR KRĘGLI' : 'BILARD'}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Hour Grid Cells + Rendered Reservations */}
                      <div className="flex-1 grid grid-cols-14 relative bg-slate-900/40 min-w-0">
                        {/* Hour Grid Slots: click a single cell or click & drag a range */}
                        {HOURS_LIST.map((hour) => {
                          const occupied = occupiedHours.has(hour);
                          const inSelection = isDragRow && hour >= selectionStart && hour <= selectionEnd;

                          return (
                            <div
                              key={hour}
                              onMouseDown={(event) => {
                                if (event.button !== 0) return;
                                event.preventDefault();

                                if (occupied) {
                                  setGridNotice(
                                    `${displayName}, godz. ${hour}:00 - ${hour + 1}:00 jest już zajęty. Wybierz wolny przedział czasu.`
                                  );
                                  return;
                                }

                                setGridNotice(null);
                                setDrag({
                                  resourceId: resource.id,
                                  anchorHour: hour,
                                  currentHour: hour,
                                });
                              }}
                              onMouseEnter={() => {
                                if (!drag || drag.resourceId !== resource.id) return;
                                if (occupied || drag.currentHour === hour) return;
                                setDrag({
                                  resourceId: resource.id,
                                  anchorHour: drag.anchorHour,
                                  currentHour: hour,
                                });
                              }}
                              className={`border-r border-slate-800/50 last:border-r-0 transition-colors relative group/slot flex items-center justify-center ${
                                inSelection
                                  ? 'bg-cyan-400/25 ring-2 ring-inset ring-cyan-300/80 cursor-crosshair'
                                  : occupied
                                    ? 'cursor-not-allowed'
                                    : 'hover:bg-slate-800/40 cursor-pointer'
                              }`}
                              title={
                                occupied
                                  ? `${displayName}, godz. ${hour}:00 - ${hour + 1}:00 - zajęte`
                                  : `Wolny termin: ${displayName}, godz. ${hour}:00. Kliknij lub przeciągnij, aby zarezerwować.`
                              }
                            >
                              {inSelection ? (
                                <span className="text-[10px] font-mono font-bold text-cyan-100">
                                  {hour}:00
                                </span>
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover/slot:opacity-100 transition-opacity" />
                              )}
                            </div>
                          );
                        })}

                        {/* Rendered Bookings on top of timeline */}
                        {resBookings.map((booking) => {
                          const startDec = parseTimeToHours(booking.start_time);
                          const endDec = parseTimeToHours(booking.end_time);

                          // Clamp to grid range
                          const clampedStart = Math.max(START_HOUR, startDec);
                          const clampedEnd = Math.min(END_HOUR, Math.max(clampedStart + 0.5, endDec));

                          const leftPercent = ((clampedStart - START_HOUR) / HOURS_COUNT) * 100;
                          const widthPercent = ((clampedEnd - clampedStart) / HOURS_COUNT) * 100;

                          const isPending = booking.status === 'pending';

                          return (
                            <div
                              key={booking.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectReservation(booking);
                              }}
                              style={{
                                left: `${leftPercent}%`,
                                width: `${widthPercent}%`,
                              }}
                              className={`absolute mx-0.5 rounded-xl border cursor-pointer transition-all duration-150 z-10 flex flex-col justify-center overflow-hidden shadow-sm ${
                                isFullscreenMode
                                  ? 'top-0.5 bottom-0.5 rounded-lg px-1.5 py-0.5'
                                  : 'top-1.5 bottom-1.5 px-2.5 py-1'
                              } ${
                                isPending
                                  ? 'bg-amber-400/20 hover:bg-amber-400/30 border-amber-400 text-amber-200'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400 text-emerald-200'
                              }`}
                              title={`Rezerwacja: ${booking.client_name} (${booking.start_time} - ${booking.end_time}) - Kliknij, aby otworzyć szczegóły`}
                            >
                              <div className="flex items-center justify-between gap-1 leading-tight">
                                <span
                                  className={`font-bold truncate ${
                                    isFullscreenMode ? 'text-[10px]' : 'text-xs'
                                  }`}
                                >
                                  {booking.client_name}
                                </span>
                                <span
                                  className={`shrink-0 font-mono font-semibold px-1 rounded bg-black/40 ${
                                    isFullscreenMode ? 'text-[9px]' : 'text-[10px]'
                                  }`}
                                >
                                  {booking.start_time}-{booking.end_time}
                                </span>
                              </div>

                              {!isFullscreenMode && (
                                <div className="flex items-center justify-between gap-1 text-[10px] mt-0.5 opacity-90">
                                  <span className="flex items-center gap-1">
                                    {isPending ? (
                                      <>
                                        <Clock className="w-3 h-3 text-amber-300 animate-pulse" />
                                        <span className="font-medium text-amber-300">Oczekuje</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                                        <span>Aktywna</span>
                                      </>
                                    )}
                                  </span>
                                  <span className="flex items-center gap-0.5 font-mono">
                                    <Users className="w-3 h-3" />
                                    {booking.guests_count} os.
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2 shrink-0 ${
          isFullscreenMode ? 'px-3 py-1 text-[10px]' : 'px-5 py-3 text-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>Łącznie w dniu dzisiejszym:</span>
          <span className="font-semibold text-slate-200">{dayReservations.length} rezerwacji</span>
          <span>•</span>
          <span className="text-amber-300 font-medium">{pendingCount} oczekujących na potwierdzenie</span>
          <span>•</span>
          <span className="text-emerald-300 font-medium">{confirmedCount} potwierdzonych</span>
        </div>
        {!isFullscreenMode && (
          <div className="text-[11px] text-slate-500">
            Kliknij na żółtą lub zieloną rezerwację, aby zobaczyć szczegóły. Przeciągnij po wolnych
            komórkach jednego rzędu, aby zarezerwować kilka godzin naraz.
          </div>
        )}
      </div>
    </div>
  );
};
