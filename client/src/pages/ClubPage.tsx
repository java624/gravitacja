import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';
import { Flame, Sparkles, Music, Trophy, ArrowUpRight } from 'lucide-react';

export default function ClubPage() {
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
      {/* Club Hero */}
      <section className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
          <Flame className="w-3.5 h-3.5" /> Neon Nights & Event Club • {currentLocation.name}
        </div>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
            Klub Rozrywki <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400">
              Grawitacja {currentLocation.name}
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-medium">
            Odkryj kosmiczny klimat nocnej rozrywki: światła UV, wyselekcjonowana muzyka, strefa VIP Lounge, turnieje bowlingowe oraz niepowtarzalne drinki.
          </p>

          <div className="pt-2">
            <button
              onClick={() => openBooking(validSlug)}
              className="px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-purple-500 via-pink-600 to-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Zarezerwuj Strefę VIP / Tor</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <LaneDivider label={`ATRAKCJE KLUBOWE • ${currentLocation.name.toUpperCase()}`} badge="KLUB" />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black uppercase text-white">Glow Bowling UV</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Kultowa strefa z uderzającym światłem UV, neonowymi kulami i efektami świetlnymi zsynchronizowanymi z muzycą.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
          <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 w-fit">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black uppercase text-white">Muzyka & DJ Set</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            W weekendowe wieczory lokal wypełnia się energią nowoczesnych brzmień i selekcją muzyczną dla każdego klienta.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black uppercase text-white">Turnieje i Ligi</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Bierz udział w turniejach bowlingowych oraz bilardowych z nagrodami dla amatorów i pasjonatów gry.
          </p>
        </div>
      </section>
    </div>
  );
}
