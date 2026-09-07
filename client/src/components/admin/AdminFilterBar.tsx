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
}: AdminFilterBarProps) {
  return (
    <div className="bg-slate-950/80 border border-white/15 rounded-2xl p-4 backdrop-blur-xl space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
        <Filter className="w-4 h-4 text-orange-400" /> Filarowanie i Szukanie
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Location Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Lokalizacja</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">Wszystkie Centra</option>
            <option value="katowice">Katowice</option>
            <option value="jaworzno">Jaworzno</option>
            <option value="poznan">Poznań</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Data</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">Wszystkie Daty</option>
            <option value="today">Dzisiaj ({todayStr})</option>
            <option value="custom">Wybrana Data</option>
          </select>
        </div>

        {/* Custom Date Picker if selectedDate === 'custom' */}
        {selectedDate === 'custom' && (
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Wybierz Datę</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>
        )}

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">Wszystkie Statusy</option>
            <option value="pending">Oczekujące (Pending)</option>
            <option value="confirmed">Potwierdzone (Confirmed)</option>
            <option value="cancelled">Anulowane (Cancelled)</option>
          </select>
        </div>

        {/* Search Input */}
        <div className={selectedDate === 'custom' ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Szukaj Klienta / ID</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Imię, telefon, email lub ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
