import { motion } from 'framer-motion';
import { Gamepad2, Sparkles, GlassWater, Trophy } from 'lucide-react';
import { useLocationContext, type LocationSlug } from '../../context/LocationContext';
import { LOCATIONS_DATA } from '../../data/locationsData';

interface LocationFeaturesProps {
  locationSlug?: LocationSlug;
}

const LOCATION_FEATURES_DATA: Record<LocationSlug, Array<{
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
}>> = {
  katowice: [
    {
      id: 'bowling',
      title: '14 Torów Kręglarskich',
      subtitle: 'Nowoczesny system Brunswick',
      description: '14 profesjonalnych torów z automatycznym liczeniem punktów, oświetleniem UV oraz podświetlanymi bandami dla najmłodszych.',
      icon: Trophy,
      color: 'from-orange-500/20 to-red-600/20 border-orange-500/30 text-orange-400',
    },
    {
      id: 'billiards',
      title: 'Strefa Bilardowa',
      subtitle: 'Stoły tournament grade',
      description: 'Profesjonalne stoły 9ft do gry w ósemkę i dziewiątkę. Idealna przestrzeń do rywalizacji przy lampce dobrego trunku.',
      icon: Gamepad2,
      color: 'from-purple-500/20 to-pink-600/20 border-purple-500/30 text-purple-400',
    },
    {
      id: 'vip',
      title: 'VIP Lounge Room',
      subtitle: 'Prywatna strefa premium',
      description: 'Ekskluzywna wydzielona sala z prywatnym torem, wygodnymi sofami, telewizorami 4K i indywidualną obsługą kelnerską.',
      icon: Sparkles,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'bar',
      title: 'Cocktail & Food Bar',
      subtitle: 'Autorskie drinki i włoska pizza',
      description: 'Bogate menu alkoholowe, autorskie koktajle przygotowywane przez barmanów oraz świeża chrupiąca pizza prosto z pieca.',
      icon: GlassWater,
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-cyan-400',
    },
  ],
  jaworzno: [
    {
      id: 'bowling',
      title: '8 Torów Bowlingowych UV',
      subtitle: 'Galeria Galena Jaworzno',
      description: '8 nowoczesnych torów kręglarskich w klimatycznym świetle UV, idealne na wyjścia ze znajomymi i rodziną.',
      icon: Trophy,
      color: 'from-rose-500/20 to-pink-600/20 border-rose-500/30 text-rose-400',
    },
    {
      id: 'billiards',
      title: 'Strefa Bilardowa',
      subtitle: 'Profesjonalne stoły 9ft',
      description: 'Strefa gry w bilard ze stołami wysokiej klasy, doskonałe warunki do gry w kameralnym klimacie.',
      icon: Gamepad2,
      color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30 text-purple-300',
    },
    {
      id: 'vip',
      title: 'Strefa VIP Lounge',
      subtitle: 'Rezerwacje kameralne',
      description: 'Wygodne loże VIP na spotkania okolicznościowe i urodziny z bezpośrednim widokiem na tory.',
      icon: Sparkles,
      color: 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-400',
    },
    {
      id: 'bar',
      title: 'Galena Gastro Bar',
      subtitle: 'Przekąski & Napoje',
      description: 'Szeroki wybór drinków, piwa rzemieślniczego, zapiekanek i dań z pieca serwowanych do stolików.',
      icon: GlassWater,
      color: 'from-cyan-500/20 to-teal-600/20 border-cyan-500/30 text-cyan-400',
    },
  ],
  poznan: [
    {
      id: 'bowling',
      title: '10 Torów UV Bowling',
      subtitle: 'CH Posnania Poznań',
      description: '10 torów do gry w kręgle w sercu Poznania, z podświetlanymi neonami i automatycznym systemem punktacji.',
      icon: Trophy,
      color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/30 text-purple-300',
    },
    {
      id: 'billiards',
      title: 'Neon Bilard Lounge',
      subtitle: 'Stoły turniejowe',
      description: 'Nastrojowa strefa stołów bilardowych w unikalnym neonowym wystroju z serwisem barowym.',
      icon: Gamepad2,
      color: 'from-pink-500/20 to-purple-600/20 border-pink-500/30 text-pink-400',
    },
    {
      id: 'vip',
      title: 'Posnania VIP Zone',
      subtitle: 'Strefa Imprezowa',
      description: 'Ekskluzywne loże dla firm i grup szukających prywatności i wyjątkowej oprawy eventowej.',
      icon: Sparkles,
      color: 'from-orange-500/20 to-amber-600/20 border-orange-500/30 text-orange-400',
    },
    {
      id: 'bar',
      title: 'Posnania Bar & Lounge',
      subtitle: 'Drinki & przekąski',
      description: 'Autorska karta drinków, napoje chłodzące, serwowane burgery i napoje na każdy wieczór.',
      icon: GlassWater,
      color: 'from-cyan-500/20 to-emerald-600/20 border-cyan-500/30 text-cyan-400',
    },
  ],
};

export default function LocationFeatures({ locationSlug }: LocationFeaturesProps) {
  const { activeSlug } = useLocationContext();
  const slug: LocationSlug = locationSlug || activeSlug || 'katowice';

  const currentLocation = LOCATIONS_DATA.find((l) => l.id === slug) || LOCATIONS_DATA[1];
  const features = LOCATION_FEATURES_DATA[slug] || LOCATION_FEATURES_DATA.katowice;

  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase">Strefy Rozrywki</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Atrakcje {currentLocation.name}
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          Poznaj wszystkie strefy rozrywkowe dostępne w obiekcie {currentLocation.mall}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-6 bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl group shadow-xl"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                  {item.subtitle}
                </span>

                <h3 className="text-lg font-black uppercase text-white mb-3 group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                <span>Centrum {currentLocation.name}</span>
                <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
