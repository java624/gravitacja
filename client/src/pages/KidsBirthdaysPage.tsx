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

  useEffect(() => {
    setActiveSlug(validSlug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [validSlug, setActiveSlug]);

  const handleSelectPackage = (packageId?: 'slonce' | 'gravitacja') => {
    if (packageId) setSelectedPackage(packageId);
    scrollTo('zapytanie-urodziny');
  };

  const isKatowice = validSlug === 'katowice';

  return (
    <div className="space-y-12 py-4 text-left">
      {/* Hero: URODZINY DLA DZIECI */}
      <KidsBirthdaysHero onScrollToForm={() => scrollTo('zapytanie-urodziny')} />

      <LaneDivider label={`NIEZAPOMNIANE URODZINY • ${currentLocation.name.toUpperCase()}`} badge="URODZINY" />

      {!isKatowice && (
        <LocationDataPlaceholder
          title="Urodziny dla Dzieci"
          categoryName="zestawów urodzinowych"
          subPath="dzieci"
          description={`Pakiet urodzinowy dla lokalu Grawitacja ${currentLocation.name} jest dostosowywany indywidualnie. Możesz wysłać formularz rezerwacyjny poniżej, zadzwonić do naszej recepcji (${currentLocation.phone}) lub sprawdzić stałe zestawy w Katowicach.`}
        />
      )}

      {/* Intro text + invitation */}
      <KidsBirthdaysIntro
        onScrollToPackages={() => scrollTo('zestawy-urodzinowe')}
        onScrollToForm={() => scrollTo('zapytanie-urodziny')}
      />

      <LaneDivider label={`ZESTAWY URODZINOWE • SŁOŃCE vs GRAVITACJA • ${currentLocation.name.toUpperCase()}`} badge="ZESTAWY" />

      {/* Packages comparison */}
      <KidsBirthdaysPackages onScrollToForm={handleSelectPackage} />

      <LaneDivider label="ATRAKCJE DODATKOWE • DOPASUJ SWÓJ PAKIET" badge="DODATKI" />

      {/* Extras */}
      <KidsBirthdaysExtras />

      <LaneDivider label={`SZYBKIE ZAPYTANIE • ZAREZERWUJ URODZINY ${currentLocation.name.toUpperCase()}`} badge="REZERWACJA" />

      {/* Booking / inquiry form */}
      <KidsBirthdaysContactForm initialPackage={selectedPackage} />
    </div>
  );
}