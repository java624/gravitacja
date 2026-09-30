import { CheckCircle2, XCircle, Clock, User, Phone, Mail, Trash2, Eye } from 'lucide-react';
import type { Reservation, ReservationStatus } from '../../types/booking';

interface ReservationTableRowProps {
  res: Reservation;
  onStatusUpdate: (id: string, status: ReservationStatus) => void;
  onDelete?: (id: string) => void;
  onSelectReservation?: (res: Reservation) => void;
}

export default function ReservationTableRow({
  res,
  onStatusUpdate,
  onDelete,
  onSelectReservation,
}: ReservationTableRowProps) {
  const isPending = res.status === 'pending';
  const isConfirmed = res.status === 'confirmed';
  const isCancelled = res.status === 'cancelled';

  return (
    <tr
      onClick={() => onSelectReservation && onSelectReservation(res)}
      className={`hover:bg-slate-800/40 transition-colors border-b border-slate-800/60 ${
        onSelectReservation ? 'cursor-pointer' : ''
      }`}
    >
      {/* Client info */}
      <td className="py-3.5 px-4">
        <div className="font-semibold text-slate-100 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
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
      <td className="py-3.5 px-4">
        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-semibold uppercase text-[10px] text-slate-300">
          {res.location_slug}
        </span>
      </td>

      {/* Resource */}
      <td className="py-3.5 px-4">
        <div className="font-medium text-slate-200">
          {res.resource ? res.resource.name : res.resource_id}
        </div>
      </td>

      {/* Date & Time */}
      <td className="py-3.5 px-4 font-mono">
        <div className="font-medium text-slate-200">{res.reservation_date}</div>
        <div className="text-[11px] text-amber-300 font-semibold">
          {res.start_time} - {res.end_time}
        </div>
      </td>

      {/* Guests & Payment Price */}
      <td className="py-3.5 px-4">
        <div className="font-medium text-slate-300">{res.guests_count} osób</div>
        {res.total_price ? (
          <div className="text-[11px] font-mono text-emerald-400 font-medium mt-0.5">
            {res.total_price} PLN <span className="text-[9px] text-slate-500 uppercase font-sans">({res.payment_method || 'online'})</span>
          </div>
        ) : null}
      </td>

      {/* Status Badge */}
      <td className="py-3.5 px-4">
        {isConfirmed && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 text-[10px] font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Potwierdzona
          </span>
        )}
        {isPending && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/60 text-[10px] font-semibold uppercase tracking-wider">
            <Clock className="w-3 h-3 animate-pulse" /> Oczekuje
          </span>
        )}
        {isCancelled && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-700/60 text-[10px] font-semibold uppercase tracking-wider">
            <XCircle className="w-3 h-3" /> Anulowana
          </span>
        )}
      </td>

      {/* Action buttons */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {onSelectReservation && (
            <button
              type="button"
              onClick={() => onSelectReservation(res)}
              title="Zobacz szczegóły"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          {res.status !== 'confirmed' && (
            <button
              type="button"
              onClick={() => onStatusUpdate(res.id, 'confirmed')}
              title="Potwierdź rezerwację"
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 transition-colors text-[11px] font-semibold cursor-pointer"
            >
              Potwierdź
            </button>
          )}

          {res.status !== 'cancelled' && (
            <button
              type="button"
              onClick={() => onStatusUpdate(res.id, 'cancelled')}
              title="Anuluj rezerwację"
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border border-rose-800 transition-colors text-[11px] font-semibold cursor-pointer"
            >
              Anuluj
            </button>
          )}

          {res.status === 'cancelled' && (
            <button
              type="button"
              onClick={() => onStatusUpdate(res.id, 'pending')}
              title="Przywróć status oczekujący"
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-800 transition-colors text-[11px] font-semibold cursor-pointer"
            >
              Oczekuj
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(res.id)}
              title="Usuń wpis"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
