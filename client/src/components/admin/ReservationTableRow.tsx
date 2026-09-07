import { CheckCircle2, XCircle, Clock, User, Phone, Mail, Trash2 } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types/booking';

interface ReservationTableRowProps {
  res: Reservation;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
  onDelete: (id: string) => void;
}

export default function ReservationTableRow({
  res,
  onStatusUpdate,
  onDelete,
}: ReservationTableRowProps) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
      {/* Client info */}
      <td className="py-4 px-4">
        <div className="font-black text-white flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-orange-400" />
          <span>{res.client_name}</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
          <Phone className="w-3 h-3 text-slate-500" /> {res.client_phone}
        </div>
        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <Mail className="w-3 h-3 text-slate-500" /> {res.client_email}
        </div>
      </td>

      {/* Location */}
      <td className="py-4 px-4">
        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-bold uppercase text-[10px] text-slate-200">
          {res.location_slug}
        </span>
      </td>

      {/* Resource */}
      <td className="py-4 px-4">
        <div className="font-bold text-orange-300">
          {res.resource ? res.resource.name : res.resource_id}
        </div>
      </td>

      {/* Date & Time */}
      <td className="py-4 px-4 font-mono">
        <div className="font-bold text-white">{res.reservation_date}</div>
        <div className="text-[11px] text-orange-400 font-bold">
          {res.start_time} - {res.end_time}
        </div>
      </td>

      {/* Guests */}
      <td className="py-4 px-4 font-bold text-slate-200">
        {res.guests_count} osób
      </td>

      {/* Status Badge */}
      <td className="py-4 px-4">
        {res.status === 'confirmed' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-3 h-3" /> Potwierdzona
          </span>
        )}
        {res.status === 'pending' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Clock className="w-3 h-3" /> Oczekuje
          </span>
        )}
        {res.status === 'cancelled' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(239,68,68,0.3)]">
            <XCircle className="w-3 h-3" /> Anulowana
          </span>
        )}
      </td>

      {/* Action buttons */}
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {res.status !== 'confirmed' && (
            <button
              onClick={() => onStatusUpdate(res.id, 'confirmed')}
              title="Potwierdź rezerwację"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-all text-[11px] font-bold cursor-pointer"
            >
              Potwierdź
            </button>
          )}

          {res.status !== 'cancelled' && (
            <button
              onClick={() => onStatusUpdate(res.id, 'cancelled')}
              title="Anuluj rezerwację"
              className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-all text-[11px] font-bold cursor-pointer"
            >
              Anuluj
            </button>
          )}

          {res.status === 'cancelled' && (
            <button
              onClick={() => onStatusUpdate(res.id, 'pending')}
              title="Przywróć status oczekujący"
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 transition-all text-[11px] font-bold cursor-pointer"
            >
              Oczekuj
            </button>
          )}

          <button
            onClick={() => onDelete(res.id)}
            title="Usuń wpis"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
