import { RefreshCw, AlertTriangle } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types/booking';
import ReservationTableRow from './ReservationTableRow';

interface ReservationTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  onRefresh: () => void;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
  onDelete: (id: string) => void;
}

export default function ReservationTable({
  reservations,
  isLoading,
  onRefresh,
  onStatusUpdate,
  onDelete,
}: ReservationTableProps) {
  return (
    <div className="bg-slate-950/80 border border-white/15 rounded-3xl backdrop-blur-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <span>Lista Rezerwacji</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-slate-400 font-mono">
            {reservations.length}
          </span>
        </h2>

        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Odśwież</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-400" />
          <span>Wczytywanie bazy rezerwacji...</span>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs space-y-2">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
          <p className="font-bold text-slate-300">Brak rezerwacji spełniających podane kryteria.</p>
          <p className="text-[11px] text-slate-500">Zmień filtry wyszukiwania lub dodaj nową rezerwację.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Klient & Kontakt</th>
                <th className="py-3.5 px-4">Lokalizacja</th>
                <th className="py-3.5 px-4">Zasób</th>
                <th className="py-3.5 px-4">Data & Godziny</th>
                <th className="py-3.5 px-4">Osoby</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reservations.map((res) => (
                <ReservationTableRow
                  key={res.id}
                  res={res}
                  onStatusUpdate={onStatusUpdate}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
