import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import ForCompaniesHero from '../components/forcompanies/ForCompaniesHero';
import ForCompaniesFeatures from '../components/forcompanies/ForCompaniesFeatures';
import ForCompaniesDescription from '../components/forcompanies/ForCompaniesDescription';
import ForCompaniesVoucher from '../components/forcompanies/ForCompaniesVoucher';
import ForCompaniesContactForm from '../components/forcompanies/ForCompaniesContactForm';
import LocationDataPlaceholder from '../components/ui/LocationDataPlaceholder';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function ForCompaniesPage() {
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

  const isKatowice = validSlug === 'katowice';

  return (
    <div className="space-y-12 py-4 text-left">
      {/* Hero: DLA FIRM */}
      <ForCompaniesHero onScrollToForm={() => scrollTo('zapytanie-firmowe')} />

      <LaneDivider
        label={`IMPREZY INTEGRACYJNE • SZKOLENIA • LIGI • ${currentLocation.name.toUpperCase()}`}
        badge="DLA FIRM"
      />

      {!isKatowice && (
        <LocationDataPlaceholder
          title="Oferta Dla Firm"
          categoryName="imprez firmowych i integracyjnych"
          subPath="firmy"
          description={`Pakiety firmowe dla lokalu Grawitacja ${currentLocation.name} są wyceniane indywidualnie. Zapraszamy do wysłania zapytania przez formularz poniżej, kontaktu z recepcją (${currentLocation.phone}) lub zapoznania się ze standardowym cennikiem firmowym w Katowicach.`}
        />
      )}

      {/* Info cards grid */}
      <ForCompaniesFeatures onScrollToVoucher={() => scrollTo('voucher-firmowy')} />

      <LaneDivider label={`DLACZEGO FIRMY WYBIERAJĄ GRAWITACJĘ • ${currentLocation.name.toUpperCase()}`} badge={currentLocation.name.toUpperCase()} />

      {/* Main offer description */}
      <ForCompaniesDescription onScrollToVoucher={() => scrollTo('voucher-firmowy')} />

      <LaneDivider label="VOUCHER FIRMOWY • IDEALNY PREZENT DLA PRACOWNIKÓW" badge="VOUCHERY" />

      {/* Voucher block */}
      <ForCompaniesVoucher onScrollToForm={() => scrollTo('zapytanie-firmowe')} />

      <LaneDivider label={`SZYBKIE ZAPYTANIE • REZERWACJA FIRMOWA ${currentLocation.name.toUpperCase()}`} badge="KONTAKT" />

      {/* Corporate contact form */}
      <ForCompaniesContactForm />
    </div>
  );
}