import { Users, MapPin, Trophy, Dices, Clock } from 'lucide-react';
import type { LocationSlug, ResourceType } from '../../types/booking';
import CustomDatePicker from './CustomDatePicker';
import CustomTimeSelect from './CustomTimeSelect';

interface Step1TermSelectionProps {
  selectedLocation: LocationSlug;
  setSelectedLocation: (loc: LocationSlug) => void;
  resourceType: ResourceType;
  setResourceType: (type: ResourceType) => void;
  date: string;
  setDate: (d: string) => void;
  startTime: string;
  setStartTime: (t: string) => void;
  endTime: string;
  setEndTime: (t: string) => void;
  guestsCount: number;
  setGuestsCount: (c: number) => void;
  onNext: () => void;
}

const LOCATIONS: { id: LocationSlug; label: string; city: string }[] = [
  { id: 'katowice', label: 'Katowice - CH Punkt 44', city: 'Katowice' },
  { id: 'jaworzno', label: 'Jaworzno - Galeria Galena', city: 'Jaworzno' },
  { id: 'poznan', label: 'Poznań - Posnania', city: 'Poznań' },
];

const TIME_SLOTS = [
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00', '23:00',
];

export default function Step1TermSelection({
  selectedLocation,
  setSelectedLocation,
  resourceType,
  setResourceType,
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  guestsCount,
  setGuestsCount,
  onNext,
}: Step1TermSelectionProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    const startIdx = TIME_SLOTS.indexOf(newStartTime);
    const endIdx = TIME_SLOTS.indexOf(endTime);
    // Auto-calculate endTime if it's less than or equal to startTime
    if (endIdx <= startIdx || endIdx === -1) {
      const targetIdx = Math.min(startIdx + 2, TIME_SLOTS.length - 1);
      const nextTime = TIME_SLOTS[targetIdx] || TIME_SLOTS[Math.min(startIdx + 1, TIME_SLOTS.length - 1)];
      setEndTime(nextTime);
    }
  };

  const availableEndTimes = TIME_SLOTS.filter((t) => t > startTime);

  return (
    <div className="space-y-5">
      {/* Location Picker */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#ff5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]" /> Lokacja Centrum
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setSelectedLocation(loc.id)}
              className={`p-3 rounded-2xl border text-left transition-all text-xs font-bold cursor-pointer ${
                selectedLocation === loc.id
                  ? 'border-[#ff5500] bg-[#ff5500]/15 text-white shadow-[0_0_15px_rgba(255,85,0,0.3)] ring-1 ring-[#ff5500]/50'
                  : 'border-white/10 bg-[#111625]/60 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="font-black text-sm uppercase">{loc.city}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{loc.label.split(' - ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Game Type Picker */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[#ff5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]" /> Rodzaj Rozrywki
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setResourceType('bowling')}
            className={`p-3.5 rounded-2xl border text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              resourceType === 'bowling'
                ? 'border-[#ff5500] bg-gradient-to-r from-[#ff5500]/25 to-red-600/25 text-white shadow-[0_0_15px_rgba(255,85,0,0.35)] ring-1 ring-[#ff5500]/50'
                : 'border-white/10 bg-[#111625]/60 text-slate-400 hover:border-white/20'
            }`}
          >
            <Dices className="w-4 h-4 text-[#ff5500]" />
            <span>Bowling (Tory)</span>
          </button>
          <button
            type="button"
            onClick={() => setResourceType('billiards')}
            className={`p-3.5 rounded-2xl border text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              resourceType === 'billiards'
                ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/50'
                : 'border-white/10 bg-[#111625]/60 text-slate-400 hover:border-white/20'
            }`}
          >
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span>Bilard (Stoły)</span>
          </button>
        </div>
      </div>

      {/* Date & Time Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <CustomDatePicker
          label="Data"
          value={date}
          minDate={todayStr}
          onChange={(newDate) => setDate(newDate)}
          placeholder="Wybierz termin"
        />

        <CustomTimeSelect
          label="Od godziny"
          value={startTime}
          options={TIME_SLOTS.slice(0, -1)}
          onChange={handleStartTimeChange}
          placeholder="Start"
          icon={<Clock className="w-3.5 h-3.5 text-[#ff5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]" />}
        />

        <CustomTimeSelect
          label="Do godziny"
          value={endTime}
          options={availableEndTimes.length > 0 ? availableEndTimes : [startTime]}
          minTime={startTime}
          onChange={(newEndTime) => setEndTime(newEndTime)}
          placeholder="Koniec"
          icon={<Clock className="w-3.5 h-3.5 text-[#ff5500] drop-shadow-[0_0_8px_rgba(255,85,0,0.6)]" />}
        />
      </div>

      {/* Guests Count */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-orange-400" /> Liczba Graczy
        </label>
        <div className="flex items-center gap-3">
          {[2, 4, 6, 8, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setGuestsCount(num)}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                guestsCount === num
                  ? 'border-orange-500 bg-orange-500/20 text-white'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              {num} {num === 10 ? '+' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 transition-all shadow-[0_0_20px_rgba(249,115,22,0.5)] cursor-pointer"
        >
          Sprawdź Dostępność Tory →
        </button>
      </div>
    </div>
  );
}
