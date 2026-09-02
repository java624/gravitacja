import KatowiceHero from '../components/katowice/KatowiceHero';
import KatowiceFeatures from '../components/katowice/KatowiceFeatures';
import KatowicePromotions from '../components/katowice/KatowicePromotions';
import LaneDivider from '../components/ui/LaneDivider';

export default function KatowicePage() {
  return (
    <div className="space-y-12 py-4">
      <KatowiceHero />
      <LaneDivider label="14 UV-TORÓW • GLOW BOWLING ZONE" badge="KATOWICE" />
      <KatowiceFeatures />
      <LaneDivider label="OFERTY SPECJAŁNE & REZERWACJA" />
      <KatowicePromotions />
    </div>
  );
}
