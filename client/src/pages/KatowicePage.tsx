import KatowiceHero from '../components/katowice/KatowiceHero';
import KatowiceFeatures from '../components/katowice/KatowiceFeatures';
import KatowicePricing from '../components/katowice/KatowicePricing';
import KatowicePromotions from '../components/katowice/KatowicePromotions';
import LaneDivider from '../components/ui/LaneDivider';

interface KatowicePageProps {
  onOpenBooking?: (location?: string, resourceType?: 'bowling' | 'billiards') => void;
}

export default function KatowicePage({ onOpenBooking }: KatowicePageProps) {
  return (
    <div className="space-y-12 py-4">
      <KatowiceHero onOpenBooking={onOpenBooking} />
      <LaneDivider label="14 UV-TORÓW • GLOW BOWLING ZONE" badge="KATOWICE" />
      <KatowiceFeatures />
      <LaneDivider label="CENNIK USŁUG • KATOWICE" badge="CENNIK" />
      <KatowicePricing onOpenBooking={onOpenBooking} />
      <LaneDivider label="OFERTY SPECJAŁNE & REZERWACJA" />
      <KatowicePromotions />
    </div>
  );
}
