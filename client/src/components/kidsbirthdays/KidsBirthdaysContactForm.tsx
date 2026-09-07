import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Cake,
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  Gift,
  PartyPopper,
  Send,
  Loader,
} from 'lucide-react';
import { submitBirthdayInquiry, buildBirthdayMailtoHref, BIRTHDAY_INQUIRIES_EMAIL } from '../../lib/supabase';
import { LOCATIONS_DATA } from '../../data/locationsData';
import { BIRTHDAY_PACKAGES, BIRTHDAY_EXTRAS } from './kidsBirthdaysData';
import type { BirthdayPackageType } from '../../types/birthday';

const EXTRA_OPTIONS = BIRTHDAY_EXTRAS.filter((extra) => extra.id !== 'woda-butelka').map((extra) => ({
  value: extra.id,
  label: extra.name,
}));

interface KidsBirthdaysContactFormProps {
  initialPackage?: BirthdayPackageType | null;
}

export default function KidsBirthdaysContactForm({ initialPackage }: KidsBirthdaysContactFormProps) {
  const katowice = LOCATIONS_DATA.find((l) => l.id === 'katowice') || LOCATIONS_DATA[1];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; mailtoHref: string } | null>(null);

  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [packageType, setPackageType] = useState<BirthdayPackageType | ''>(initialPackage || '');
  const [guestsCount, setGuestsCount] = useState('');
  const [extras, setExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleExtra = (value: string) => {
    setExtras((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parent = parentName.trim();
    const mail = email.trim();
    const tel = phone.trim();

    if (parent.length < 2) {
      setError('Podaj imię i nazwisko opiekuna.');
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
    if (childName.trim().length < 2) {
      setError('Podaj imię dziecka.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await submitBirthdayInquiry({
        parentName: parent,
        email: mail,
        phone: tel,
        childName: childName.trim() || undefined,
        childAge: childAge ? Number(childAge) : undefined,
        eventDate: eventDate || undefined,
        eventTime: eventTime || undefined,
        packageType: packageType || undefined,
        guestsCount: guestsCount ? Number(guestsCount) : undefined,
        extras: extras.length > 0 ? extras : undefined,
        notes: notes.trim() || undefined,
      });

      setResult({
        id: saved.id,
        mailtoHref: buildBirthdayMailtoHref(
          {
            parentName: parent,
            email: mail,
            phone: tel,
            childName: childName.trim() || undefined,
            childAge: childAge ? Number(childAge) : undefined,
            eventDate: eventDate || undefined,
            eventTime: eventTime || undefined,
            packageType: packageType || undefined,
            guestsCount: guestsCount ? Number(guestsCount) : undefined,
            extras: extras.length > 0 ? extras : undefined,
            notes: notes.trim() || undefined,
          },
          saved.id
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
    <section id="zapytanie-urodziny" className="scroll-mt-28 text-left">
      <div className="relative rounded-[28px] overflow-hidden border border-pink-500/25 bg-slate-950/80 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(236,72,153,0.25)]">
        {/* Ambient glows */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-amber-500/20 to-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_12px_#ec4899]" />
        <div className="relative z-10 p-6 sm:p-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-[10px] sm:text-xs font-black tracking-widest uppercase">
              <PartyPopper className="w-3.5 h-3.5" />
              <span>Szybkie zapytanie • Urodziny w Katowicach</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Zarezerwuj <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-amber-300">urodziny</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Wypełnij formularz, a nasz zespół skontaktuje się z Tobą, aby potwierdzić szczegóły przyjęcia.

              Możesz też zadzwonić: <a className="text-pink-300 font-bold" href={`tel:${katowice.phoneClean}`}>{katowice.phone}</a>.
            </p>
          </div>
          {result ? (
            /* Success state */
            <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-pink-500/10 border border-emerald-500/30 backdrop-blur-xl text-left">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white">Dziękujemy za zgłoszenie!</h3>
                  <p className="text-xs text-emerald-300/90 font-medium">
                    Twoje zapytanie o urodziny dotarło do naszego zespołu — numer referencyjny: <span className="font-mono font-bold">{result.id}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium mt-4">
                Nasz zespół skontaktuje się z Tobą, aby potwierdzić dostępność terminu i szczegóły przyjęcia. Chcesz
                przyspieszyć sprawę? Wyślij nam podsumowanie bezpośrednio na adres e-mail lub zadzwoń。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-5">
                <a
                  href={result.mailtoHref}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-emerald-500 to-pink-600 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 active:scale-98"
                >
                  <Mail className="w-4 h-4" />
                  <span>Wyślij przez e-mail</span>
                </a>
                <a
                  href={`tel:${katowice.phoneClean}`}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{katowice.phone}</span>
                </a>
              </div>
              <p className="text-[10px] text-slate-500 mt-3">
                E-mail zespołu: {BIRTHDAY_INQUIRIES_EMAIL}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Parent name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-pink-400" /> Imię i nazwisko opiekuna *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Anna Nowak"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-pink-400" /> Adres e-mail *
                </label>
                <input
                  type="email"
                  required
                  placeholder="anna.nowak@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-pink-400" /> Telefon kontaktowy *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+48 600 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              {/* Child name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-pink-400" /> Imię dziecka *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Antek"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Child age */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-amber-400" /> Wiek dziecka
                </label>
                <input
                  type="number"
                  min={1}
                  max={18}
                  placeholder="np. 8"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              {/* Event date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-pink-400" /> Orientacyjny termin
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 [color-scheme:dark]"
                />
              </div>

              {/* Event time */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Godzina rozpoczęcia
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 [color-scheme:dark] font-mono"
                />
              </div>

              {/* Guests count */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-pink-400" /> Oczekiwana liczba dzieci
                </label>
                <input
                  type="number"
                  min={5}
                  placeholder="np. 10"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              {/* Package selection */}
              <div className="sm:col-span-2">
                <span className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-pink-400" /> Wybierz pakiet
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BIRTHDAY_PACKAGES.map((pkg) => {
                    const active = packageType === pkg.id;
                    const Icon = pkg.icon;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setPackageType(pkg.id as BirthdayPackageType)}
                        aria-pressed={active}
                        className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer active:scale-98 ${
                          active
                            ? pkg.featured
                              ? 'bg-pink-500/15 border-pink-500/60 shadow-[0_0_25px_rgba(236,72,153,0.4)]'
                              : 'bg-amber-500/15 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                            : 'bg-white/5 border-white/15 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-5 h-5 ${active ? (pkg.featured ? 'text-pink-300' : 'text-amber-300') : 'text-slate-400'}`} />
                            <span className="text-xs font-black uppercase tracking-wider text-white">{pkg.name}</span>
                          </div>
                          <span className="text-sm font-black text-white">{pkg.pricePerPerson}<span className="text-[9px] text-slate-400"> / os.</span></span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] text-slate-400 font-medium">{pkg.duration} gry • {pkg.minGroup}</span>
                          <CheckCircle2 className={`w-4 h-4 ${active ? (pkg.featured ? 'text-pink-400' : 'text-amber-400') : 'text-slate-700'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extras checkboxes */}
              <div className="sm:col-span-2">
                <span className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-400" /> Dodatkowe atrakcje (opcjonalnie)
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXTRA_OPTIONS.map((opt) => {
                    const active = extras.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleExtra(opt.value)}
                        aria-pressed={active}
                        className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer active:scale-95 ${
                          active
                            ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.35)]'
                            : 'bg-white/5 text-slate-400 border-white/15 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${active ? 'text-pink-300' : 'text-slate-500'}`} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <PartyPopper className="w-3.5 h-3.5 text-pink-400" /> Dodatkowe życzenia
                </label>
                <textarea
                  rows={4}
                  placeholder="np. Prosimy o tort, piniatę i dyplomy dla wszystkich gości. Solenizant uwielbia kosmos!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 resize-y"
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
                  className="w-full px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_35px_rgba(236,72,153,0.55)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Wysyłanie zapytania...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Zarezerwuj urodziny</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-500 mt-3">
                  Wysyłając formularz akceptujesz, że Twoje dane zostaną wykorzystane wyłącznie w celu kontaktu w sprawie oferty. Min. grupa 5 dzieci — szczegóły potwierdzimy telefonicznie.

                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}