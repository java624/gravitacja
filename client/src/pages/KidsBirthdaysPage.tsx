import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import KidsBirthdaysHero from '../components/kidsbirthdays/KidsBirthdaysHero';
import KidsBirthdaysIntro from '../components/kidsbirthdays/KidsBirthdaysIntro';
import KidsBirthdaysPackages from '../components/kidsbirthdays/KidsBirthdaysPackages';
import KidsBirthdaysExtras from '../components/kidsbirthdays/KidsBirthdaysExtras';
import KidsBirthdaysContactForm from '../components/kidsbirthdays/KidsBirthdaysContactForm';
import LocationDataPlaceholder from '../components/ui/LocationDataPlaceholder';
import LaneDivider from '../components/ui/LaneDivider';
import type { BirthdayPackageType } from '../types/birthday';
import { LOCATIONS_DATA } from '../data/locationsData';
import { Cake } from 'lucide-react';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function KidsBirthdaysPage() {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const { setActiveSlug } = useLocationContext();
  const [selectedPackage, setSelectedPackage] = useState<BirthdayPackageType | null>(null);

  const validSlug: LocationSlug =
    locationSlug === 'jaworzno' || locationSlug === 'poznan'
      ? (locationSlug as LocationSlug)
      : 'katowice';

  const currentLocation = LOCATIONS_DATA.find((l) => l.id === validSlug) || LOCATIONS_DATA[1];
  const isKatowice = validSlug === 'katowice';

  useEffect(() => {
    setActiveSlug(validSlug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [validSlug, setActiveSlug]);

  const handleSelectPackage = (packageId?: 'slonce' | 'gravitacja') => {
    if (packageId) setSelectedPackage(packageId);
    scrollTo('zapytanie-urodziny');
  };

  return (
    <div className="space-y-12 py-4 text-left">
      {isKatowice ? (
        <>
          {/* Katowice Full Offer */}
          <KidsBirthdaysHero onScrollToForm={() => scrollTo('zapytanie-urodziny')} />
          <LaneDivider label="NIEZAPOMNIANE URODZINY • KATOWICE" badge="URODZINY" />
          <KidsBirthdaysIntro
            onScrollToPackages={() => scrollTo('zestawy-urodzinowe')}
            onScrollToForm={() => scrollTo('zapytanie-urodziny')}
          />
          <LaneDivider label="ZESTAWY URODZINOWE • SŁOŃCE vs GRAVITACJA • KATOWICE" badge="ZESTAWY" />
          <KidsBirthdaysPackages onScrollToForm={handleSelectPackage} />
          <LaneDivider label="ATRAKCJE DODATKOWE • DOPASUJ SWÓJ PAKIET" badge="DODATKI" />
          <KidsBirthdaysExtras />
          <LaneDivider label="SZYBKIE ZAPYTANIE • ZAREZERWUJ URODZINY KATOWICE" badge="REZERWACJA" />
          <KidsBirthdaysContactForm initialPackage={selectedPackage} />
        </>
      ) : (
        <>
          {/* Location Specific Page for Jaworzno / Poznań */}
          <section className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl space-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] sm:text-xs font-black tracking-wider uppercase">
              <Cake className="w-3.5 h-3.5" /> Urodziny dla Dzieci • {currentLocation.name}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Urodziny dla Dzieci w <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-amber-400">{currentLocation.name}</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              Zorganizuj niezapomniane urodziny dla swojego dziecka w obiekcie Grawitacja {currentLocation.name} ({currentLocation.mall}).
            </p>
          </section>

          <LaneDivider label={`OFERTA URODZINOWA • ${currentLocation.name.toUpperCase()}`} badge="URODZINY" />

          <LocationDataPlaceholder
            title="Urodziny dla Dzieci"
            categoryName="zestawów urodzinowych"
            subPath="dzieci"
            description={`Pakiety urodzinowe dla lokalu Grawitacja ${currentLocation.name} są wyceniane indywidualnie. Zapraszamy do kontaktu telefonicznego z recepcją (${currentLocation.phone}) lub wysłania zapytania przez formularz poniżej.`}
          />

          <LaneDivider label={`SZYBKIE ZAPYTANIE • URODZINY ${currentLocation.name.toUpperCase()}`} badge="REZERWACJA" />
          <KidsBirthdaysContactForm initialPackage={selectedPackage} />
        </>
      )}
    </div>
  );
}