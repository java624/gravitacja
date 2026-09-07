import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import MenuSection from '../components/menu/MenuSection';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';
import { Utensils } from 'lucide-react';

export default function MenuPage() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const { setActiveSlug } = useLocationContext();

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
      {/* Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl space-y-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-black tracking-wider uppercase">
          <Utensils className="w-3.5 h-3.5" /> Gastro & Bar Menu • {currentLocation.name}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
          Menu Barowe & Gastro <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            Grawitacja {currentLocation.name}
          </span>
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
          Pizza, burgery, przekąski, autorskie drinki neonowe i napoje serwowane prosto do Twojego toru bowlingowego w {currentLocation.mall}.
        </p>
      </div>

      <LaneDivider label={`OFERTA KULINARNA & DRINKI • ${currentLocation.name.toUpperCase()}`} badge="GASTRO" />

      {/* Menu Section */}
      <MenuSection locationSlug={validSlug} />
    </div>
  );
}
