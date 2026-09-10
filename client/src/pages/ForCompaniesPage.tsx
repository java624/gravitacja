import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';
import ForCompaniesHero from '../components/forcompanies/ForCompaniesHero';
import ForCompaniesFeatures from '../components/forcompanies/ForCompaniesFeatures';
import ForCompaniesDescription from '../components/forcompanies/ForCompaniesDescription';
import ForCompaniesVoucher from '../components/forcompanies/ForCompaniesVoucher';
import ForCompaniesContactForm from '../components/forcompanies/ForCompaniesContactForm';
import ForCompaniesJaworznoHero from '../components/forcompanies/ForCompaniesJaworznoHero';
import ForCompaniesJaworznoDescription from '../components/forcompanies/ForCompaniesJaworznoDescription';
import ForCompaniesJaworznoFeatures from '../components/forcompanies/ForCompaniesJaworznoFeatures';
import ForCompaniesJaworznoVideo from '../components/forcompanies/ForCompaniesJaworznoVideo';
import ForCompaniesJaworznoVoucher from '../components/forcompanies/ForCompaniesJaworznoVoucher';
import LocationDataPlaceholder from '../components/ui/LocationDataPlaceholder';
import LaneDivider from '../components/ui/LaneDivider';
import { LOCATIONS_DATA } from '../data/locationsData';
import { Briefcase } from 'lucide-react';

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
  const isKatowice = validSlug === 'katowice';
  const isJaworzno = validSlug === 'jaworzno';

  useEffect(() => {
    setActiveSlug(validSlug);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [validSlug, setActiveSlug]);

  return (
    <div className="space-y-12 py-4 text-left">
      {isKatowice ? (
        <>
          {/* Katowice Full Corporate Offer */}
          <ForCompaniesHero onScrollToForm={() => scrollTo('zapytanie-firmowe')} />
          <LaneDivider label="IMPREZY INTEGRACYJNE • SZKOLENIA • LIGI • KATOWICE" badge="DLA FIRM" />
          <ForCompaniesFeatures onScrollToVoucher={() => scrollTo('voucher-firmowy')} />
          <LaneDivider label="DLACZEGO FIRMY WYBIERAJĄ GRAWITACJĘ • KATOWICE" badge="KATOWICE" />
          <ForCompaniesDescription onScrollToVoucher={() => scrollTo('voucher-firmowy')} />
          <LaneDivider label="VOUCHER FIRMOWY • IDEALNY PREZENT DLA PRACOWNIKÓW" badge="VOUCHERY" />
          <ForCompaniesVoucher onScrollToForm={() => scrollTo('zapytanie-firmowe')} />
          <LaneDivider label="SZYBKIE ZAPYTANIE • REZERWACJA FIRMOWA KATOWICE" badge="KONTAKT" />
          <ForCompaniesContactForm />
        </>
      ) : isJaworzno ? (
        <>
          {/* Jaworzno Full Corporate Offer — dane wyłącznie z JAWORZNO_FIRMY_* (src/data/firmyData.ts) */}
          <ForCompaniesJaworznoHero
            onScrollToFeatures={() => scrollTo('nasze-atuty-jaworzno')}
            onScrollToForm={() => scrollTo('zapytanie-firmowe')}
          />
          <LaneDivider label="DLACZEGO GRAWITACJA JAWORZNO • IMPREZY FIRMOWE" badge="DLA FIRM" />
          <ForCompaniesJaworznoDescription />
          <LaneDivider label="NASZE ATUTY • JAWORZNO" badge="ATUTY" />
          <section id="nasze-atuty-jaworzno" className="scroll-mt-28">
            <ForCompaniesJaworznoFeatures />
          </section>
          <LaneDivider label="ZOBACZ GRAWITACJĘ W AKCJI • WIDEO" badge="WIDEO" />
          <ForCompaniesJaworznoVideo />
          <LaneDivider label="VOUCHER FIRMOWY • IDEALNY PREZENT DLA PRACOWNIKÓW" badge="VOUCHERY" />
          <ForCompaniesJaworznoVoucher onScrollToForm={() => scrollTo('zapytanie-firmowe')} />
          <LaneDivider label="SZYBKIE ZAPYTANIE • REZERWACJA FIRMOWA JAWORZNO" badge="KONTAKT" />
          <ForCompaniesContactForm locationSlug="jaworzno" />
        </>
      ) : (
        <>
          {/* Location Specific Page for Poznań (placeholder) */}
          <section className="relative rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-950/90 backdrop-blur-2xl overflow-hidden shadow-2xl space-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-black tracking-wider uppercase">
              <Briefcase className="w-3.5 h-3.5" /> Oferta Dla Firm • {currentLocation.name}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Imprezy Firmowe w <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">{currentLocation.name}</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              Zorganizuj integrację, spotkanie biznesowe lub turniej firmowy w obiekcie Grawitacja {currentLocation.name} ({currentLocation.mall}).
            </p>
          </section>

          <LaneDivider label={`OFERTA DLA FIRM • ${currentLocation.name.toUpperCase()}`} badge="DLA FIRM" />

          <LocationDataPlaceholder
            title="Oferta Dla Firm"
            categoryName="imprez firmowych i integracyjnych"
            subPath="firmy"
            description={`Pakiety firmowe dla lokalu Grawitacja ${currentLocation.name} są wyceniane indywidualnie. Zapraszamy do kontaktu telefonicznego z recepcją (${currentLocation.phone}) lub wysłania zapytania przez formularz poniżej.`}
          />

          <LaneDivider label={`SZYBKIE ZAPYTANIE • REZERWACJA FIRMOWA ${currentLocation.name.toUpperCase()}`} badge="KONTAKT" />
          <ForCompaniesContactForm />
        </>
      )}
    </div>
  );
}