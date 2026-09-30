import { Filter, Search } from 'lucide-react';

interface AdminFilterBarProps {
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedDate: string;
  setSelectedDate: (val: string) => void;
  customDate: string;
  setCustomDate: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  todayStr: string;
  isLocationLocked?: boolean;
}

export default function AdminFilterBar({
  selectedLocation,
  setSelectedLocation,
  selectedDate,
  setSelectedDate,
  customDate,
  setCustomDate,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
  todayStr,
  isLocationLocked = false,
}: AdminFilterBarProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3 text-slate-100">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <span>Filtry i Wyszukiwanie Rezerwacji</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Location Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Lokalizacja {isLocationLocked && '(Przypisana)'}
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => !isLocationLocked && setSelectedLocation(e.target.value)}
            disabled={isLocationLocked}
            className={`w-full bg-slate-950 border rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none ${
              isLocationLocked
                ? 'border-slate-800 text-slate-400 bg-slate-950/60 cursor-not-allowed font-medium'
                : 'border-slate-800 focus:border-slate-600'
            }`}
          >
            <option value="all">Wszystkie Centra</option>
            <option value="katowice">Katowice (12 torów)</option>
            <option value="jaworzno">Jaworzno</option>
            <option value="poznan">Poznań</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Data</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
          >
            <option value="all">Wszystkie Daty</option>
            <option value="today">Dzisiaj ({todayStr})</option>
            <option value="custom">Wybrany Dzień...</option>
          </select>
        </div>

        {/* Custom Date Picker if selectedDate === 'custom' */}
        {selectedDate === 'custom' && (
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Wybierz Datę</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600 font-mono"
            />
          </div>
        )}

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
          >
            <option value="all">Wszystkie Statusy</option>
            <option value="pending">Oczekujące (Pending)</option>
            <option value="confirmed">Potwierdzone (Confirmed)</option>
            <option value="cancelled">Anulowane (Cancelled)</option>
          </select>
        </div>

        {/* Search Input (Name or Phone number) */}
        <div className={selectedDate === 'custom' ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Szukaj po nazwisku lub telefonie
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Wpisz nazwisko, tel. +48... lub email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-slate-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
