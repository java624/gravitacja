import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import type { Reservation, Resource } from '../../../types/booking';

interface TimelineGridViewProps {
  resources: Resource[];
  reservations: Reservation[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSelectReservation: (res: Reservation) => void;
  onQuickBook?: (resourceId: string, time: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  locationName?: string;
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

const extractNumber = (str: string): number => {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// Formats display names strictly as "Tor X" or "Stół X"
const formatResourceDisplayName = (resource: Resource): string => {
  const num = extractNumber(resource.name) || extractNumber(resource.id);
  if (resource.type === 'billiards') {
    return num ? `Stół ${num}` : 'Stół 1';
  }
  if (resource.type === 'bowling') {
    return num ? `Tor ${num}` : resource.name || 'Tor 1';
  }
  return resource.name;
};

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
}) => {
  const [resourceFilter, setResourceFilter] = useState<'all' | 'bowling' | 'billiards'>('all');

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col text-slate-100">
      {/* Top Bar: Date Navigator, Filters & Legend */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
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
            <span className="text-sm font-semibold capitalize text-slate-200">
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
        <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
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
          <div className="flex items-center gap-3 text-xs bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
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

      {/* Main Grid View Container with sticky left column */}
      <div className="relative overflow-x-auto select-none">
        <div className="min-w-[1200px]">
          {/* Header Row: Hours Timeline */}
          <div className="flex border-b border-slate-800 bg-slate-950/80 sticky top-0 z-20">
            {/* Sticky Resource Title Cell (Updated Header: ZASÓB (Tor / Stół)) */}
            <div className="w-48 shrink-0 px-4 py-3 font-semibold text-xs text-slate-300 uppercase tracking-wider border-r border-slate-800 bg-slate-950 sticky left-0 z-30 flex items-center justify-between">
              <span>ZASÓB (Tor / Stół)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {sortedAndFilteredResources.length}
              </span>
            </div>

            {/* Hour Columns Header */}
            <div className="flex-1 grid grid-cols-14 relative">
              {HOURS_LIST.map((hour) => (
                <div
                  key={hour}
                  className="py-3 px-2 text-center text-xs font-mono font-medium text-slate-400 border-r border-slate-800/80 last:border-r-0"
                >
                  {hour}:00
                </div>
              ))}
            </div>
          </div>

          {/* Resources Rows */}
          <div className="divide-y divide-slate-800/70 relative">
            {/* Current Time Indicator Line across rows */}
            {currentTimePositionPercent !== null && (
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none flex flex-col items-center"
                style={{
                  left: `calc(192px + (100% - 192px) * ${currentTimePositionPercent / 100})`,
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md -mt-1" />
                <div className="w-0.5 flex-1 bg-rose-500/80 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              </div>
            )}

            {sortedAndFilteredResources.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                Brak zasobów spełniających kryteria.
              </div>
            ) : (
              sortedAndFilteredResources.map((resource, index) => {
                // Find all bookings for this resource on this day
                const resBookings = dayReservations.filter((b) => b.resource_id === resource.id);
                const isBowling = resource.type === 'bowling';
                const displayName = formatResourceDisplayName(resource);

                // Check if this is the first billiard table when viewing all resources
                const isFirstBilliards =
                  resourceFilter === 'all' &&
                  resource.type === 'billiards' &&
                  (index === 0 || sortedAndFilteredResources[index - 1]?.type === 'bowling');

                return (
                  <React.Fragment key={resource.id}>
                    {/* Visual Section Divider between Bowling and Billiards */}
                    {isFirstBilliards && (
                      <div className="flex border-y border-slate-800/90 bg-slate-950 text-xs font-semibold">
                        <div className="w-48 shrink-0 px-4 py-2 border-r border-slate-800 bg-slate-950 sticky left-0 z-10 flex items-center gap-2 text-emerald-400 tracking-wider">
                          <Dices className="w-3.5 h-3.5" />
                          <span>STOŁY BILARDOWE</span>
                        </div>
                        <div className="flex-1 px-4 py-2 text-slate-500 text-[11px] font-medium flex items-center bg-slate-950/70">
                          Strefa Stołów Bilardowych
                        </div>
                      </div>
                    )}

                    <div className="flex group hover:bg-slate-800/20 transition-colors min-h-[58px]">
                      {/* Sticky Resource Info Cell */}
                      <div className="w-48 shrink-0 px-4 py-2.5 border-r border-slate-800 bg-slate-900 sticky left-0 z-10 flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${
                          isBowling
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}>
                          {isBowling ? <CircleDot className="w-4 h-4" /> : <Dices className="w-4 h-4" />}
                        </div>

                        <div className="overflow-hidden">
                          <div className="font-semibold text-xs text-slate-100 truncate flex items-center gap-1.5">
                            <span>{displayName}</span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            {isBowling ? 'TOR KRĘGLI' : 'BILARD'}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Hour Grid Cells + Rendered Reservations */}
                      <div className="flex-1 grid grid-cols-14 relative bg-slate-900/40">
                        {/* Hour Grid Slots (Background) */}
                        {HOURS_LIST.map((hour) => (
                          <div
                            key={hour}
                            onClick={() => onQuickBook && onQuickBook(resource.id, `${hour}:00`)}
                            className="border-r border-slate-800/50 last:border-r-0 hover:bg-slate-800/40 transition-colors relative group/slot cursor-pointer flex items-center justify-center"
                            title={`Wolny termin: ${displayName}, godz. ${hour}:00. Kliknij, aby zarezerwować.`}
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover/slot:opacity-100 transition-opacity" />
                          </div>
                        ))}

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
                              className={`absolute top-1.5 bottom-1.5 mx-0.5 rounded-xl border px-2.5 py-1 cursor-pointer transition-all duration-150 z-10 flex flex-col justify-center overflow-hidden shadow-sm ${
                                isPending
                                  ? 'bg-amber-400/20 hover:bg-amber-400/30 border-amber-400 text-amber-200'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400 text-emerald-200'
                              }`}
                              title={`Rezerwacja: ${booking.client_name} (${booking.start_time} - ${booking.end_time}) - Kliknij, aby otworzyć szczegóły`}
                            >
                              <div className="flex items-center justify-between gap-1 leading-tight">
                                <span className="font-bold text-xs truncate">
                                  {booking.client_name}
                                </span>
                                <span className="shrink-0 text-[10px] font-mono font-semibold px-1 rounded bg-black/40">
                                  {booking.start_time}-{booking.end_time}
                                </span>
                              </div>

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
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span>Łącznie w dniu dzisiejszym:</span>
          <span className="font-semibold text-slate-200">{dayReservations.length} rezerwacji</span>
          <span>•</span>
          <span className="text-amber-300 font-medium">{pendingCount} oczekujących na potwierdzenie</span>
          <span>•</span>
          <span className="text-emerald-300 font-medium">{confirmedCount} potwierdzonych</span>
        </div>
        <div className="text-[11px] text-slate-500">
          Kliknij na żółtą lub zieloną rezerwację, aby zobaczyć szczegóły i zarządzać statusem.
        </div>
      </div>
    </div>
  );
};
