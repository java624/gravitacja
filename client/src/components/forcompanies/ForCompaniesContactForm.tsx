import { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  CalendarDays,
  Users,
  Ticket,
  Gamepad2,
  Crown,
  Martini,
  Presentation,
  Gift,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { submitCorporateInquiry, buildCorporateMailtoHref, CORPORATE_INQUIRIES_EMAIL } from '../../lib/supabase';
import { LOCATIONS_DATA } from '../../data/locationsData';

const PREFERENCE_OPTIONS = [
  { value: 'bowling', label: 'Kręgle', icon: Ticket },
  { value: 'billiards', label: 'Bilard', icon: Gamepad2 },
  { value: 'catering', label: 'Catering & Bar', icon: Martini },
  { value: 'training', label: 'Szkolenia / Konferencja', icon: Presentation },
  { value: 'vouchers', label: 'Vouchery', icon: Gift },
] as const;

export default function ForCompaniesContactForm({ locationSlug = 'katowice' }: { locationSlug?: string }) {
  const location =
    LOCATIONS_DATA.find((l) => l.id === locationSlug) ||
    LOCATIONS_DATA.find((l) => l.id === 'katowice') ||
    LOCATIONS_DATA[1];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; mailtoHref: string } | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestsCount, setGuestsCount] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const togglePreference = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = companyName.trim();
    const mail = email.trim();
    const tel = phone.trim();

    if (name.length < 2) {
      setError('Podaj nazwę firmy lub imię i nazwisko.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) {
      setError('Podaj poprawny adres e-mail.');
      return;
    }
    if (tel.replace(/[^0-9]/g, '').length < 9) {
      setError('Podaj poprawny numer telefonu.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await submitCorporateInquiry({
        companyName: name,
        email: mail,
        phone: tel,
        eventDate: eventDate || undefined,
        guestsCount: guestsCount ? Number(guestsCount) : undefined,
        preferences: preferences.length > 0 ? preferences : undefined,
        message: message.trim() || undefined,
      }, locationSlug);

      setResult({
        id: saved.id,
        mailtoHref: buildCorporateMailtoHref(
          {
            companyName: name,
            email: mail,
            phone: tel,
            eventDate: eventDate || undefined,
            guestsCount: guestsCount ? Number(guestsCount) : undefined,
            preferences: preferences.length > 0 ? preferences : undefined,
            message: message.trim() || undefined,
          },
          saved.id,
          locationSlug
        ),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'błąd sieci';
      setError('Nie udało się wysłać zapytania: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="zapytanie-firmowe" className="scroll-mt-28 text-left">
      <div className="relative rounded-[28px] overflow-hidden border border-cyan-500/25 bg-slate-950/80 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.25)]">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-cyan-500/20 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-purple-600/20 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]" />

        <div className="relative z-10 p-6 sm:p-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] sm:text-xs font-black tracking-widest uppercase">
              <Send className="w-3.5 h-3.5" />
              <span>Szybkie zapytanie • {location.name}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Zaplanuj wydarzenie <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">razem z nami</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Wypełnij formularz, a nasz dział organizacji imprez firmowych skontaktuje się z Tobą, aby omówić szczegóły.
              Możesz też zadzwonić: <a className="text-cyan-300 font-bold" href={`tel:${location.phoneClean}`}>{location.phone}</a>.
            </p>
          </div>

          {result ? (
            /* Success state */
            <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-xl text-left">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white">Dziękujemy za zapytanie!</h3>
                  <p className="text-xs text-emerald-300/90 font-medium">
                    Twoje zgłoszenie dotarło do naszego zespołu — numer referencyjny: <span className="font-mono font-bold">{result.id}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium mt-4">
                Nasz dział organizacji imprez firmowych skontaktuje się z Tobą tak szybko, jak to możliwe. Chcesz
                przyspieszyć sprawę? Wyślij nam podsumowanie bezpośrednio na adres e-mail lub zadzwoń.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <a
                  href={result.mailtoHref}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-emerald-500 to-cyan-600 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 active:scale-98"
                >
                  <Mail className="w-4 h-4" />
                  <span>Wyślij przez e-mail</span>
                </a>
                <a
                  href={`tel:${location.phoneClean}`}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{location.phone}</span>
                </a>
              </div>
              <p className="text-[10px] text-slate-500 mt-3">
                E-mail zespołu: {CORPORATE_INQUIRIES_EMAIL}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company / Contact person */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Firma / Imię i nazwisko *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Firma XYZ Sp. z o.o."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Adres e-mail *
                </label>
                <input
                  type="email"
                  required
                  placeholder="kontakt@firma.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" /> Telefon kontaktowy *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+48 600 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Approximate date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-cyan-400" /> Orientacyjny termin
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
                />
              </div>

              {/* Guests count */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Liczba osób
                </label>
                <input
                  type="number"
                  min={2}
                  placeholder="np. 25"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Preferences: bowling / billiards / catering */ }
              <div className="sm:col-span-2">
                <span className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-cyan-400" /> Czego potrzebujecie?
                </span>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCE_OPTIONS.map((opt) => {
                    const active = preferences.includes(opt.value);
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => togglePreference(opt.value)}
                        aria-pressed={active}
                        className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                            : 'bg-white/5 text-slate-400 border-white/15 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-300' : 'text-slate-500'}`} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message / additional requests */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-cyan-400" /> Dodatkowe życzenia
                </label>
                <textarea
                  rows={4}
                  placeholder="np. Potrzebujemy sali szkoleniowej, cateringu i turnieju bowlingowego dla 40 osób w godzinach 10:00-16:00..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500 resize-y"
                />
              </div>

              {error && (
                <div className="sm:col-span-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="sm:col-span-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_35px_rgba(6,182,212,0.55)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Wysyłanie zapytania...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Wyślij zapytanie</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-500 mt-3">
                  Wysyłając formularz akceptujesz, że Twoje dane zostaną wykorzystane wyłącznie w celu kontaktu w sprawie oferty.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}