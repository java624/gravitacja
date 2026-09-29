import { useState, useEffect } from 'react';
import { RefreshCw, Mail, Phone, CalendarDays, Users, Tag, MessageSquare, Gift } from 'lucide-react';
import type { CorporateInquiry, CorporateInquiryStatus } from '../../types/corporate';
import { fetchCorporateInquiries, updateCorporateInquiryStatus, CORPORATE_INQUIRIES_EMAIL } from '../../lib/supabase';

const STATUS_LABELS: Record<CorporateInquiryStatus, string> = {
  new: 'Nowe',
  contacted: 'W kontakcie',
  closed: 'Zamknięte',
};

const STATUS_COLORS: Record<CorporateInquiryStatus, string> = {
  new: 'bg-pink-500/15 text-pink-300 border-pink-500/40',
  contacted: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  closed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
};

export default function CorporateInquiriesTable() {
  const [inquiries, setInquiries] = useState<CorporateInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | CorporateInquiryStatus>('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchCorporateInquiries();
        if (!cancelled) setInquiries(data);
      } catch (err) {
        console.error('Error loading corporate inquiries:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCorporateInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Error loading corporate inquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatus = async (id: string, status: CorporateInquiryStatus) => {
    try {
      await updateCorporateInquiryStatus(id, status);
      setInquiries((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'nieznany błąd';
      alert('Nie udało się zmienić statusu: ' + msg);
    }
  };

  const filtered = filter === 'all' ? inquiries : inquiries.filter((q) => q.status === filter);

  return (
    <div className="bg-slate-950/80 border border-white/15 rounded-3xl backdrop-blur-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Gift className="w-4 h-4 text-pink-400" />
          <span>Zapytania Firmowe</span>
          <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-[10px] text-pink-300 font-mono">
            {filtered.length}
          </span>
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {(['all', 'new', 'contacted', 'closed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                  filter === s ? 'bg-pink-500/20 text-pink-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s === 'all' ? 'Wszystkie' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <button
            onClick={refresh}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Odśwież"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-xs text-slate-400 font-medium">Ładowanie zapytań...</div>
      ) : filtered.length === 0 ? (
        <div className="p-10 text-center space-y-2">
          <Gift className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Brak zapytań firmowych.</p>
          <p className="text-[10px] text-slate-600">Zgłoszenia z formularza na stronie /katowice/firmy pojawią się tutaj.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5 max-h-[520px] overflow-y-auto">
          {filtered.map((q) => (
            <div key={q.id} className="p-4 hover:bg-white/[0.03] transition-colors grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Company / person */}
              <div className="lg:col-span-3">
                <div className="text-xs font-black text-white uppercase">{q.company_name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{q.id}</div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 mt-1.5">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <a href={`mailto:${q.email}`} className="hover:text-cyan-300 truncate">{q.email}</a>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 mt-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <a href={`tel:${q.phone}`} className="hover:text-emerald-300">{q.phone}</a>
                </div>
              </div>

              {/* Event details */}
              <div className="lg:col-span-3 space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="w-3 h-3 text-pink-400" />
                  <span>{q.event_date || 'Termin: do ustalenia'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span>{q.guests_count ? `${q.guests_count} osób` : 'Liczba osób: —'}</span>
                </div>
                {q.preferences && q.preferences.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Tag className="w-3 h-3 text-amber-400 mt-0.5" />
                    <span className="flex flex-wrap gap-1">
                      {q.preferences.map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] uppercase font-black text-slate-300">
                          {p}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="lg:col-span-4">
                {q.message ? (
                  <div className="flex items-start gap-1.5">
                    <MessageSquare className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{q.message}</p>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-600 italic">Brak dodatkowych uwag</span>
                )}
              </div>

              {/* Status */}
              <div className="lg:col-span-2 flex items-start lg:justify-end gap-2">
                <select
                  value={q.status}
                  onChange={(e) => handleStatus(q.id, e.target.value as CorporateInquiryStatus)}
                  className={`text-[11px] font-black uppercase px-2.5 py-1.5 rounded-xl border bg-white/5 cursor-pointer focus:outline-none ${STATUS_COLORS[q.status]}`}
                >
                  <option value="new">Nowe</option>
                  <option value="contacted">W kontakcie</option>
                  <option value="closed">Zamknięte</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 px-4 border-t border-white/10 text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between gap-1">
        <span>E-mail zespołu: <span className="font-mono">{CORPORATE_INQUIRIES_EMAIL}</span></span>
        <span>{isLoading ? '' : `Wyświetlono ${filtered.length} z ${inquiries.length} zapytań`}</span>
      </div>
    </div>
  );
}