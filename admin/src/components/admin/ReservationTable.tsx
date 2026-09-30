import { RefreshCw, AlertTriangle, Calendar } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types/booking';
import ReservationTableRow from './ReservationTableRow';

interface ReservationTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  onRefresh: () => void;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
  onDelete?: (id: string) => void;
  onSelectReservation?: (res: Reservation) => void;
}

export default function ReservationTable({
  reservations,
  isLoading,
  onRefresh,
  onStatusUpdate,
  onDelete,
  onSelectReservation,
}: ReservationTableProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100">
      <div className="px-5 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Lista Rezerwacji</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-400 font-mono font-medium">
            {reservations.length}
          </span>
        </h2>

        <button
          onClick={onRefresh}
          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs flex items-center gap-1.5 cursor-pointer font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Odśwież</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-7 h-7 animate-spin text-cyan-500" />
          <span className="font-medium text-slate-300">Wczytywanie listy rezerwacji...</span>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
          <p className="font-semibold text-slate-200 text-sm">Brak rezerwacji spełniających podane kryteria.</p>
          <p className="text-xs text-slate-400">Zmień filtry wyszukiwania lub dodaj nową rezerwację.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Klient & Kontakt</th>
                <th className="py-3 px-4">Lokalizacja</th>
                <th className="py-3 px-4">Zasób</th>
                <th className="py-3 px-4">Data & Godziny</th>
                <th className="py-3 px-4">Osoby</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reservations.map((res) => (
                <ReservationTableRow
                  key={res.id}
                  res={res}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onDelete}
                  onSelectReservation={onSelectReservation}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
