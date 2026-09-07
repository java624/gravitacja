import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Phone, MapPin, ArrowRight, ShieldAlert } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';
import { useLocationContext, type LocationSlug } from '../../context/LocationContext';

interface LocationDataPlaceholderProps {
  title: string;
  categoryName: string;
  subPath?: string;
  description?: string;
}

export default function LocationDataPlaceholder({
  title,
  categoryName,
  subPath = '',
  description,
}: LocationDataPlaceholderProps) {
  const navigate = useNavigate();
  const { activeSlug, activeLocation, setActiveSlug } = useLocationContext();

  const currentCityName = activeLocation ? activeLocation.name : 'Wybrane Miasto';

  const handleSwitchToKatowice = () => {
    setActiveSlug('katowice');
    navigate(`/katowice${subPath ? `/${subPath}` : ''}`);
  };

  const handleSwitchCity = (slug: LocationSlug) => {
    setActiveSlug(slug);
    navigate(`/${slug}${subPath ? `/${subPath}` : ''}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl p-6 sm:p-10 md:p-12 border border-white/15 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-black backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden text-left"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Lokalizacja: {currentCityName}</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            {title} dla lokalu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-400">{currentCityName}</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            {description ||
              `Oferta ${categoryName} dla lokalu Grawitacja ${currentCityName} jest obecnie dopasowywana indywidualnie. Zapraszamy do kontaktu telefonicznego z naszą recepcją lub do sprawdzenia aktualnej oferty w lokalu Katowice.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={handleSwitchToKatowice}
            className="px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Zobacz Ofertę w Katowicach</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {activeLocation && (
            <a
              href={`tel:${activeLocation.phoneClean}`}
              className="px-6 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Zadzwoń: {activeLocation.phone}</span>
            </a>
          )}
        </div>

        {/* Fast Location Selector Grid */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400" /> Zmień lokalizację i sprawdź ofertę:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LOCATIONS_DATA.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSwitchCity(loc.id as LocationSlug)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                  activeSlug === loc.id
                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div>
                  <span className="block text-xs font-black uppercase">{loc.name}</span>
                  <span className="text-[10px] text-slate-400">{loc.mall}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
