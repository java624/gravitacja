import { PROMOTIONS_DATA } from '../../data/promotionsData';
import PromotionCard from './PromotionCard';

export default function KatowicePromotions() {
  const promotions = PROMOTIONS_DATA.filter((p) => !p.locationId || p.locationId === 'katowice');

  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase">Oferty Specjalne</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">Promocje i wydarzenia</h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          Aktualne zniżki i pakiety dla studentów, rodzin oraz klientów firmowych.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {promotions.map((item) => (
          <PromotionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}