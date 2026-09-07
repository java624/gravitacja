import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Phone, MapPin, Clock, Tag } from 'lucide-react';
import { LOCATIONS_DATA } from '../data/locationsData';
import { PROMOTIONS_DATA } from '../data/promotionsData';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import LocationQuickGrid from '../components/location/LocationQuickGrid';
import LocationFeatures from '../components/location/LocationFeatures';
import PromotionCard from '../components/katowice/PromotionCard';
import LaneDivider from '../components/ui/LaneDivider';

export default function LocationPage() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const navigate = useNavigate();
  const { setActiveSlug, openBooking } = useLocationContext();

  const validSlug: LocationSlug =
    locationSlug === 'katowice' || locationSlug === 'jaworzno' || locationSlug === 'poznan'
      ? (locationSlug as LocationSlug)
      : 'katowice';

  const location = LOCATIONS_DATA.find((l) => l.id === validSlug) || LOCATIONS_DATA[1];
  const promotions = PROMOTIONS_DATA.filter((p) => p.locationId === validSlug);

  useEffect(() => {
    if (locationSlug !== validSlug) {
      navigate(`/${validSlug}`, { replace: true });
    } else {
      setActiveSlug(validSlug);
    }
  }, [locationSlug, validSlug, setActiveSlug, navigate]);

  return (
    <div className="space-y-12 py-4 text-left">
      {/* Location Hero Banner */}
      <section className="relative rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 md:p-12 border border-white/10 bg-slate-950/90 md:bg-gradient-to-b md:from-slate-900/90 md:via-slate-950/80 md:to-black/90 backdrop-blur-md md:backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Title & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Centrum {location.name} • {location.mall}
            </div>

            <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight leading-none">
              Grawitacja <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
                {location.name}
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl font-medium">
              {location.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tory Kręglarskie</span>
                <span className="text-base sm:text-lg font-black text-white">{location.uvLanes || location.lanes}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strefa Rozrywki</span>
                <span className="text-base sm:text-lg font-black text-white">{location.zones}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telefon</span>
                <span className="text-xs sm:text-sm font-black text-orange-400">{location.phone}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4">
              <button
                onClick={() => openBooking(validSlug, 'bowling')}
                className="w-full sm:w-auto justify-center px-8 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_25px_rgba(249,115,22,0.5)] flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Zarezerwuj Tor</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate(`/${validSlug}/cennik`)}
                className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 active:scale-98 cursor-pointer"
              >
                <Tag className="w-4 h-4 text-purple-400" />
                <span>Zobacz Cennik</span>
              </button>

              <a
                href={`tel:${location.phoneClean}`}
                className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 active:scale-98"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>Zadzwoń</span>
              </a>
            </div>
          </div>

          {/* Right Column: Address & Hours */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Lokalizacja</h4>
                  <p className="text-sm font-bold text-white">{location.address} ({location.mall})</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" /> Godziny otwarcia
                </h4>
                <div className="space-y-2 text-xs font-medium">
                  {location.hours.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between py-1.5 px-3 rounded-xl ${
                        item.color === 'orange'
                          ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                          : item.color === 'purple'
                          ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300'
                          : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>{item.day}:</span>
                      <span className="font-bold">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access 6-Tile Grid */}
      <LocationQuickGrid />

      <LaneDivider label={`${location.uvLanes || location.lanes} • STREFA GLOW BOWLING`} badge={location.name.toUpperCase()} />

      {/* Location Features & Attractions tailored per city */}
      <LocationFeatures locationSlug={validSlug} />

      {promotions.length > 0 && (
        <>
          <LaneDivider label={`OFERTY SPECJAŁNE • ${location.name.toUpperCase()}`} badge="PROMOCJE" />

          {/* Promotions Section */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase">Oferty Specjalne</span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">Promocje {location.name}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promotions.map((item) => (
                <PromotionCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
