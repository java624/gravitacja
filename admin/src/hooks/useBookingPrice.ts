import { useMemo, useState, useEffect } from 'react';
import type { CalculationInput, PriceBreakdownResult } from '../services/booking/pricingCalculator';
import { calculateBookingPrice } from '../services/booking/pricingCalculator';

export function useBookingPrice(input: CalculationInput): PriceBreakdownResult {
  const [pricingVersion, setPricingVersion] = useState(0);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gravitacja_pricing_overrides') {
        setPricingVersion((v) => v + 1);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return useMemo(() => {
    return calculateBookingPrice(input);
  }, [
    input.locationSlug,
    input.resourceType,
    input.date,
    input.startTime,
    input.endTime,
    input.resourceCount,
    input.includeShoes,
    input.shoesCount,
    pricingVersion,
  ]);
}
