import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
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
      {/* Header Banner */}
      <section className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] sm:text-xs font-black tracking-wider uppercase">
          <Mail className="w-3.5 h-3.5" /> Kontakt & Lokalizacja • {currentLocation.name}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Kontakt z Lokalem <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
            Grawitacja {currentLocation.name}
          </span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
          Masz pytania dotyczące rezerwacji, organizacji imprez lub oferty gastro? Skontaktuj się z naszą recepcją telefonicznie lub wyślij wiadomość.
        </p>
      </section>

      <LaneDivider label={`INFORMACJE KONTAKTOWE • ${currentLocation.name.toUpperCase()}`} badge="KONTAKT" />

      {/* Grid: Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950/90 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-start gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-black uppercase">Adres & Centrum</span>
                <p className="text-sm font-bold text-white">{currentLocation.address}</p>
                <p className="text-xs text-orange-400 font-medium">{currentLocation.mall}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-black uppercase">Telefon do Recepcjonalistów</span>
                <a href={`tel:${currentLocation.phoneClean}`} className="text-base font-black text-orange-400 hover:underline">
                  {currentLocation.phone}
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <span className="block text-[10px] text-slate-400 font-black uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" /> Godziny otwarcia
              </span>
              <div className="space-y-1.5 text-xs font-medium">
                {currentLocation.hours.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 px-3 rounded-xl bg-white/5 text-slate-300">
                    <span>{item.day}:</span>
                    <span className="font-bold text-white">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-slate-950/90 border border-white/10 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-orange-400 mx-auto animate-bounce" />
              <h3 className="text-2xl font-black uppercase text-white">Wiadomość została wysłana!</h3>
              <p className="text-xs text-slate-300">Dziękujemy za kontakt. Recepcja lokalu {currentLocation.name} odpowie najszybciej jak to możliwe.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-black uppercase text-white">Wyślij wiadomość do {currentLocation.name}</h3>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Imię i Nazwisko</label>
                <input
                  required
                  type="text"
                  placeholder="np. Anna Nowak"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Telefon</label>
                  <input
                    type="tel"
                    placeholder="np. 500 000 000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">E-mail</label>
                  <input
                    required
                    type="email"
                    placeholder="twoj@email.pl"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Treść pytania</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Wpisz treść pytania..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Wyślij Wiadomość</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
