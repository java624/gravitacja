import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';
import { Calendar, ArrowUpRight, Phone, Clock, MapPin } from 'lucide-react';

export default function ReservationsPage() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const { setActiveSlug, openBooking } = useLocationContext();

  const validSlug: LocationSlug =
    locationSlug === 'jaworzno' || locationSlug === 'poznan'
      ? (locationSlug as LocationSlug)
      : 'katowice';

  const currentLocation = LOCATIONS_DATA.find((l) => l.id === validSlug) || LOCATIONS_DATA[1];

  useEffect(() => {
    setActiveSlug(validSlug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [validSlug, setActiveSlug]);

  return (
    <div className="space-y-12 py-4 text-left">
      {/* Reservations Hero */}
      <section className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
          <Calendar className="w-3.5 h-3.5" /> Rezerwacja Online • {currentLocation.name}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              Rezerwacja Torów & Stołów <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
                Grawitacja {currentLocation.name}
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              Zarezerwuj tory kręglarskie lub stoły bilardowe online z natychmiastowym potwierdzeniem. Wybierz dogodny termin i datę dla lokalu w {currentLocation.mall}.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => openBooking(validSlug, 'bowling')}
                className="px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_25px_rgba(249,115,22,0.5)] flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Zarezerwuj Kręgle</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openBooking(validSlug, 'billiards')}
                className="px-6 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Zarezerwuj Bilard</span>
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <MapPin className="w-5 h-5 text-orange-400" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Adres Lokalu</span>
                <span className="text-sm font-black text-white">{currentLocation.address} ({currentLocation.mall})</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Phone className="w-5 h-5 text-orange-400" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Rezerwacja Telefoniczna</span>
                <a href={`tel:${currentLocation.phoneClean}`} className="text-sm font-black text-orange-400 hover:underline">
                  {currentLocation.phone}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" /> Godziny otwarcia
              </span>
              <div className="space-y-1 text-xs">
                {currentLocation.hours.map((h, idx) => (
                  <div key={idx} className="flex justify-between py-1 px-2.5 rounded-lg bg-white/5 text-slate-300">
                    <span>{h.day}:</span>
                    <span className="font-bold">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LaneDivider label={`ZASADY REZERWACJI • ${currentLocation.name.toUpperCase()}`} badge="INFORMACJE" />

      {/* Rules & Guidelines */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black">
            1
          </div>
          <h3 className="text-lg font-black uppercase text-white">Przybycie na czas</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Prosimy o przybycie około 15 minut przed zarezerwowaną godziną, aby pobrać obuwie i przygotować się do gry.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-black">
            2
          </div>
          <h3 className="text-lg font-black uppercase text-white">Obuwie sportowe</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Na torach obowiązuje specjalistyczne obuwie bowlingowe dostępne w recepcji lokalu.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black">
            3
          </div>
          <h3 className="text-lg font-black uppercase text-white">Rezerwacje grupowe</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Dla grup powyżej 15 osób prosimy o rezerwację telefoniczną lub kontakt poprzez dział dla firm.
          </p>
        </div>
      </section>
    </div>
  );
}
