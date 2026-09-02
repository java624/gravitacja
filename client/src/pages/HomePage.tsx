import HomeHero from '../components/home/HomeHero';
import LocationSelector from '../components/home/LocationSelector';
import LaneDivider from '../components/ui/LaneDivider';

interface HomePageProps {
  onSelectCity: (id: string) => void;
}

export default function HomePage({ onSelectCity }: HomePageProps) {
  return (
    <div className="space-y-12 py-8">
      <HomeHero />
      <LaneDivider label="WYBIERZ SWÓJ LOKAL • GLOW BOWLING" badge="UV READY" />
      <LocationSelector onSelectCity={onSelectCity} />
      <LaneDivider label="KOSMICZNA ATMOSFERA • NEON NIGHTS" />
    </div>
  );
}
