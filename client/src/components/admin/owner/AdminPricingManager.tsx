import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Tag,
  Save,
  CheckCircle2,
  DollarSign,
  MapPin,
  Loader2,
  AlertTriangle,
  Footprints,
  RefreshCw,
} from 'lucide-react';
import type { LocationSlug, ResourceType } from '../../../types/booking';
import { PRICING_LOCATIONS, PRICING_RESOURCE_TYPES } from '../../../data/pricingData';
import {
  fetchPricingTariffs,
  upsertPricingTariffs,
  startPricingRealtime,
  subscribeToPricing,
  loadPricing,
  type PricingTariffInput,
  type PricingTariffRow,
} from '../../../lib/supabase/pricingService';

const LOCATION_LABELS: Record<LocationSlug, string> = {
  katowice: 'Katowice',
  jaworzno: 'Jaworzno',
  poznan: 'Poznań',
};

const RESOURCE_LABELS: Record<ResourceType, string> = {
  bowling: 'Kręgle',
  billiards: 'Bilard',
  dart: 'Dart',
  karaoke: 'Karaoke',
};

/**
 * Panel "Ceny i Taryfy".
 *
 * JEDYNE ŹRÓDŁO: tabela `pricing_tariffs` w Supabase.
 *  - po wejściu wczytujemy taryfy dla wybranego miasta,
 *  - zmiana pola buduje lokalną kopię wierszy,
 *  - "ZAPISZ WSZYSTKIE ZMIANY" robi jeden UPSERT po
 *    (location_slug, resource_type, day_group) i odświeża cache,
 *    dzięki czemu publiczny cennik i kalkulator widzą nową stawkę od razu.
 *
 * Nie ma już localStorage `gravitacja_pricing_overrides` - cena zmieniona
 * tylko w jednej przeglądarce nie trafiała do recepcji ani do klientów.
 */
export const AdminPricingManager: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<LocationSlug>('katowice');
  const [rows, setRows] = useState<PricingTariffRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadRows = useCallback(async (city: LocationSlug) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPricingTariffs(city);
      setRows(data);
      if (data.length === 0) {
        setError(
          'W bazie nie ma żadnych taryf dla tego miasta. Uruchom create_pricing_tariffs.sql albo uzupełnij taryfy poniżej.'
        );
      }
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : 'Nie udało się pobrać taryf z bazy.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startPricingRealtime();
    void loadRows(selectedCity);
  }, [selectedCity, loadRows]);

  // Realtime: ktoś inny zmienił stawkę -> przeładowujemy edytowane wiersze.
  useEffect(
    () =>
      subscribeToPricing(() => {
        void loadRows(selectedCity);
      }),
    [selectedCity, loadRows]
  );

  /** Zmiana jednego pola w wierszu (edycja lokalna, do czasu zapisu). */
  const handleFieldChange = useCallback(
    (rowId: string, field: 'price_before_17' | 'price_after_17' | 'shoes_price', value: number) => {
      setSavedSuccess(false);
      setRows((prev) => {
        const target = prev.find((row) => row.id === rowId);
        if (!target) return prev;
        // Kwoty w PLN trzymamy jako liczby całkowite.
        const sanitized = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;

        // Cena obuwia zależy tylko od miasta i usługi, więc zmiana w jednym
        // wierszu musi zaktualizować całą kategorię (wszystkie grupy dni).
        if (field === 'shoes_price') {
          return prev.map((candidate) =>
            candidate.location_slug === target.location_slug &&
            candidate.resource_type === target.resource_type
              ? { ...candidate, shoes_price: sanitized }
              : candidate
          );
        }

        return prev.map((candidate) =>
          candidate.id === rowId ? { ...candidate, [field]: sanitized } : candidate
        );
      });
    },
    []
  );

  /** Buduje payload UPSERT ze wszystkich wierszy wybranego miasta. */
  const buildPayload = useCallback((): PricingTariffInput[] => {
    return rows.map((row) => ({
      location_slug: row.location_slug,
      location_name: row.location_name || LOCATION_LABELS[row.location_slug],
      resource_type: row.resource_type,
      title: row.title,
      subtitle: row.subtitle,
      unit_text: row.unit_text,
      extra_note: row.extra_note,
      page_title: row.page_title,
      day_group: row.day_group,
      day_label: row.day_label,
      day_short: row.day_short,
      price_before_17: row.price_before_17,
      price_after_17: row.price_after_17,
      shoes_price: row.shoes_price,
      is_popular: row.is_popular,
      sort_order: row.sort_order,
      is_active: true,
    }));
  }, [rows]);

  const handleSaveAll = async () => {
    const payload = buildPayload();
    if (payload.length === 0) {
      setError('Brak wierszy do zapisania.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      await upsertPricingTariffs(payload);
      // Odświeżamy cache, żeby kalkulatory w tej samej przeglądarce
      // przeliczyły się od razu, bez czekania na Realtime.
      await loadPricing();
      await loadRows(selectedCity);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zapisać taryf do bazy.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    void loadRows(selectedCity);
  };

  /** Wiersze pogrupowane po usłudze (kolejność z bazy zachowana). */
  const grouped = useMemo(() => {
    const buckets = new Map<ResourceType, PricingTariffRow[]>();
    for (const row of rows) {
      const bucket = buckets.get(row.resource_type) ?? [];
      bucket.push(row);
      buckets.set(row.resource_type, bucket);
    }
    return PRICING_RESOURCE_TYPES.map((type) => ({
      type,
      rows: buckets.get(type) ?? [],
    })).filter((group) => group.rows.length > 0);
  }, [rows]);

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
            <p className="text-[10px] text-slate-500">
              Źródło danych: tabela <span className="font-mono text-amber-400">pricing_tariffs</span> (Supabase).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading || isSaving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Odśwież
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving || isLoading || rows.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-black uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Zapisywanie...' : 'Zapisz Wszystkie Zmiany'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Taryfy cenowe zostały zapisane w bazie i są już widoczne na stronie.</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Location Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {PRICING_LOCATIONS.map((city) => (
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
            <span>{LOCATION_LABELS[city]}</span>
          </button>
        ))}
      </div>

      {isLoading && rows.length === 0 ? (
        <div className="flex items-center justify-center gap-3 py-12 text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          Wczytywanie taryf dla {LOCATION_LABELS[selectedCity]}...
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ type, rows: categoryRows }) => {
            const meta = categoryRows[0];
            return (
              <div key={type} className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                      {RESOURCE_LABELS[type]} ({meta.subtitle})
                    </h3>
                    <span className="text-[10px] text-slate-400">{meta.unit_text}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {categoryRows.length} grupy dni
                  </span>
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
                      {categoryRows.map((row) => (
                        <tr key={row.id} className="hover:bg-white/5">
                          <td className="py-2.5 px-3 font-bold text-white">
                            <div>{row.day_label || row.day_group}</div>
                            <div className="text-[10px] font-mono text-slate-500">{row.day_group}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={row.price_before_17}
                                onChange={(e) =>
                                  handleFieldChange(row.id, 'price_before_17', Number(e.target.value))
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
                                min={0}
                                step={1}
                                value={row.price_after_17}
                                onChange={(e) =>
                                  handleFieldChange(row.id, 'price_after_17', Number(e.target.value))
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

                {/* Wypożyczenie obuwia - jeden rate dla całej usługi. */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                    Wypożyczenie obuwia ({RESOURCE_LABELS[type].toLowerCase()}) za parę
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={meta.shoes_price}
                      onChange={(e) =>
                        handleFieldChange(meta.id, 'shoes_price', Number(e.target.value))
                      }
                      className="w-20 px-2 py-1 rounded-lg bg-slate-950 border border-white/15 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-[10px] font-mono text-slate-500">PLN / para</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPricingManager;
