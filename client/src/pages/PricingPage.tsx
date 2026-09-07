import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import LocationPricing from '../components/location/LocationPricing';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';
import { PROMOTIONS_DATA } from '../data/promotionsData';
import PromotionCard from '../components/katowice/PromotionCard';
import { DollarSign, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const { setActiveSlug } = useLocationContext();

  const validSlug: LocationSlug =
    locationSlug === 'jaworzno' || locationSlug === 'poznan'
      ? (locationSlug as LocationSlug)
      : 'katowice';

  const currentLocation = LOCATIONS_DATA.find((l) => l.id === validSlug) || LOCATIONS_DATA[1];
  const promotions = PROMOTIONS_DATA.filter((p) => !p.locationId || p.locationId === validSlug);

  useEffect(() => {
    setActiveSlug(validSlug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [validSlug, setActiveSlug]);

  return (
    <div className="space-y-12 py-4 text-left">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] sm:text-xs font-black tracking-wider uppercase">
            <DollarSign className="w-3.5 h-3.5" /> Official Pricing • {currentLocation.name}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Cennik Usług <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">{currentLocation.name}</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            Sprawdź aktualny cennik gry w kręgle oraz bilard w centrum rozrywki Grawitacja {currentLocation.name} ({currentLocation.mall}).
          </p>
        </div>
      </div>

      <LaneDivider label={`CENNIK BOWLING & BILARD • ${currentLocation.name.toUpperCase()}`} badge="CENNIK" />

      {/* Main Pricing Table */}
      <LocationPricing locationSlug={validSlug} />

      <LaneDivider label={`PROMOCJE & OFERTY SPECJAŁNE • ${currentLocation.name.toUpperCase()}`} badge="PROMOCJE" />

      {/* Promotions section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Korzystne Pakiety
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Promocje w {currentLocation.name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((item) => (
            <PromotionCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
