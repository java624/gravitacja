import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { CalculationInput, PriceBreakdownResult } from '../services/booking/pricingCalculator';
import { calculateBookingPrice } from '../services/booking/pricingCalculator';
import {
  isLocationPricingLoaded,
  loadPricing,
  startPricingRealtime,
  subscribeToPricing,
} from '../lib/supabase/pricingService';

/**
 * Hook wyceny rezerwacji opartej wyłącznie na taryfach z `pricing_tariffs`.
 *
 * Odpowiedzialności:
 *  - przy pierwszym użyciu (i przy zmianie miasta) wczytuje ceny z bazy,
 *  - nasłuchuje Realtime, więc zmiana stawki w panelu admina przelicza
 *    sumę natychmiast, bez odświeżania strony,
 *  - wylicza podsumowanie przez `calculateBookingPrice`.
 *
 * Wynik NIGDY nie opiera się na stałych zapisanych w kodzie.
 */
export function useBookingPrice(input: CalculationInput): PriceBreakdownResult {
  const { locationSlug } = input;

  // Subskrypcja cache: każda zmiana taryf przerenderowuje komponent.
  useSyncExternalStore(subscribeToPricing, () => isLocationPricingLoaded(locationSlug));

  useEffect(() => {
    startPricingRealtime();
    if (!isLocationPricingLoaded(locationSlug)) {
      void loadPricing().catch((error) => {
        console.error('[useBookingPrice] Nie udało się wczytać cennika:', error);
      });
    }
  }, [locationSlug]);

  return useMemo(
    () => calculateBookingPrice(input),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      input.locationSlug,
      input.resourceType,
      input.date,
      input.startTime,
      input.endTime,
      input.resourceCount,
      input.includeShoes,
      input.shoesCount,
      // Zmiana cache (nowa stawka z bazy) musi wymusić przeliczenie.
      isLocationPricingLoaded(locationSlug),
    ]
  );
}
