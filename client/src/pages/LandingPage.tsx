import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHero from '../components/home/HomeHero';
import LocationSelector from '../components/home/LocationSelector';
import LaneDivider from '../components/ui/LaneDivider';
import { useLocationContext, type LocationSlug } from '../context/LocationContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setActiveSlug } = useLocationContext();

  useEffect(() => {
    setActiveSlug(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [setActiveSlug]);

  const handleSelectCity = (id: string) => {
    const slug = id as LocationSlug;
    setActiveSlug(slug);
    navigate(`/${slug}`);
  };

  return (
    <div className="space-y-12 py-8">
      <HomeHero />
      <LaneDivider label="WYBIERZ SWÓJ LOKAL • GLOW BOWLING" badge="UV READY" />
      <LocationSelector onSelectCity={handleSelectCity} />
      <LaneDivider label="KOSMICZNA ATMOSFERA • NEON NIGHTS" />
    </div>
  );
}
