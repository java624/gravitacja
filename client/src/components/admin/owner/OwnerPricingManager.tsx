import React, { useState, useEffect } from 'react';
import { Tag, Save, CheckCircle2, DollarSign, MapPin } from 'lucide-react';
import { PRICING_DATA, type PriceSlot } from '../../../data/pricingData';
import type { LocationSlug } from '../../../types/booking';

export const OwnerPricingManager: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<LocationSlug>('katowice');
  const [pricingState, setPricingState] = useState(PRICING_DATA);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gravitacja_pricing_overrides');
      if (stored) {
        setPricingState(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load custom pricing:', e);
    }
  }, []);

  const handlePriceChange = (
    city: LocationSlug,
    categoryKey: string,
    slotId: string,
    field: 'before17' | 'after17',
    newValue: number
  ) => {
    setPricingState((prev: any) => {
      const cityData = prev[city];
      if (!cityData || !cityData.categories[categoryKey]) return prev;

      const updatedPricing = cityData.categories[categoryKey].pricing.map((slot: PriceSlot) => {
        if (slot.id === slotId) {
          return { ...slot, [field]: newValue };
        }
        return slot;
      });

      return {
        ...prev,
        [city]: {
          ...cityData,
          categories: {
            ...cityData.categories,
            [categoryKey]: {
              ...cityData.categories[categoryKey],
              pricing: updatedPricing,
            },
          },
        },
      };
    });
  };

  const handleSaveAll = () => {
    try {
      localStorage.setItem('gravitacja_pricing_overrides', JSON.stringify(pricingState));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('Błąd zapisywania cennika: ' + e);
    }
  };

  const currentPricing = pricingState[selectedCity];

  return (
    <div className="bg-slate-950/80 border border-white/15 rounded-3xl p-6 backdrop-blur-2xl space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              Menedżer Taryf i Cenników (PLN/Godz.)
            </h2>
            <p className="text-xs text-slate-400">
              Edycja stawek godzinowych dla kręgli, bilarda i usług dodatkowych.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-black uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Zapisz Wszystkie Zmiany
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Taryfy cenowe zostały pomyślnie zapisane w systemie!</span>
        </div>
      )}

      {/* Location Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {(['katowice', 'jaworzno', 'poznan'] as const).map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setSelectedCity(city)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              selectedCity === city
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{city.toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Pricing Categories */}
      {currentPricing && (
        <div className="space-y-6">
          {Object.entries(currentPricing.categories).map(([catKey, category]: [string, any]) => (
            <div key={catKey} className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                    {category.title} ({category.subtitle})
                  </h3>
                  <span className="text-[10px] text-slate-400">{category.unitText}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/10 uppercase text-[10px] tracking-wider">
                      <th className="py-2 px-3">Dzień Tygodnia</th>
                      <th className="py-2 px-3">Do 17:00 (PLN)</th>
                      <th className="py-2 px-3">Po 17:00 (PLN)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {category.pricing.map((slot: PriceSlot) => (
                      <tr key={slot.id} className="hover:bg-white/5">
                        <td className="py-2.5 px-3 font-bold text-white">
                          {slot.dayLabel}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={slot.before17}
                              onChange={(e) =>
                                handlePriceChange(
                                  selectedCity,
                                  catKey,
                                  slot.id,
                                  'before17',
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-white/15 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                            />
                            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={slot.after17}
                              onChange={(e) =>
                                handlePriceChange(
                                  selectedCity,
                                  catKey,
                                  slot.id,
                                  'after17',
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-white/15 text-orange-400 font-mono text-xs focus:outline-none focus:border-orange-400"
                            />
                            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
