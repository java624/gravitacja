import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';
import { UserCheck, Send, CheckCircle2, Briefcase, Sparkles } from 'lucide-react';

export default function JobsPage() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const { setActiveSlug } = useLocationContext();

  const validSlug: LocationSlug =
    locationSlug === 'jaworzno' || locationSlug === 'poznan'
      ? (locationSlug as LocationSlug)
      : 'katowice';

  const currentLocation = LOCATIONS_DATA.find((l) => l.id === validSlug) || LOCATIONS_DATA[1];

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setActiveSlug(validSlug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [validSlug, setActiveSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 py-4 text-left">
      {/* Hero Banner */}
      <section className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-black tracking-wider uppercase">
          <UserCheck className="w-3.5 h-3.5" /> Grawitacja Team • {currentLocation.name}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Praca w Zespole <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400">
            Grawitacja {currentLocation.name}
          </span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
          Dołącz do dynamicznego i przyjaznego zespołu w centrum rozrywki w {currentLocation.mall}. Poszukujemy osób na stanowiska recepcji, obsługi baru oraz kelnerów.
        </p>
      </section>

      <LaneDivider label={`OFERTY PRACY • ${currentLocation.name.toUpperCase()}`} badge="REKRUTACJA" />

      {/* Available positions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black uppercase text-white">Pracownik Recepcji</h3>
          <p className="text-xs text-slate-300 font-medium">Obsługa klientów, rezerwacje torów, wydawanie obuwia oraz dbanie o komfort gości.</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 w-fit">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black uppercase text-white">Barman / Baristka</h3>
          <p className="text-xs text-slate-300 font-medium">Przygotowywanie autorskich drinków, kawy oraz obsługa strefy gastro barowej.</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-black uppercase text-white">Obsługa Sali / Kelner</h3>
          <p className="text-xs text-slate-300 font-medium">Obsługa stolików, przekąsek oraz pomoc przy organizowaniu imprez firmowych i urodzin.</p>
        </div>
      </div>

      <LaneDivider label={`APLIKUJ DO ZESPOŁU • ${currentLocation.name.toUpperCase()}`} badge="FORMULARZ" />

      {/* Application Form */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl max-w-2xl mx-auto">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-2xl font-black uppercase text-white">Dziękujemy za zgłoszenie!</h3>
            <p className="text-xs text-slate-300">Skontaktujemy się z Tobą w sprawie rekrutacji do lokalu Grawitacja {currentLocation.name}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-black uppercase text-white">Aplikuj do pracy w {currentLocation.name}</h3>
            
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Imię i Nazwisko</label>
              <input
                required
                type="text"
                placeholder="np. Jan Kowalski"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Telefon</label>
                <input
                  required
                  type="tel"
                  placeholder="np. 500 000 000"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">E-mail</label>
                <input
                  required
                  type="email"
                  placeholder="twoj@email.pl"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Wiadomość / Doświadczenie</label>
              <textarea
                rows={3}
                placeholder="Napisz kilka słów o sobie..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>Wyślij Aplikację</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
