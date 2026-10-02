import type { LocationSlug, ResourceType } from '../../types/booking';
import type { LocationPricing, PriceSlot, PricingCategoryData } from '../../data/pricingData';
import { dayGroupCandidates } from '../../data/pricingData';
import { peekLocationPricing } from '../../lib/supabase/pricingService';

export interface CalculationInput {
  locationSlug: LocationSlug;
  resourceType: ResourceType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  resourceCount?: number;
  includeShoes?: boolean;
  shoesCount?: number;
}

export interface PriceBreakdownResult {
  /** Czy w pamięci są wczytane stawki (gdy false - UI pokazuje stan ładowania). */
  hasTariffs: boolean;
  before17Hours: number;
  before17Rate: number;
  after17Hours: number;
  after17Rate: number;
  subtotalBefore17: number;
  subtotalAfter17: number;
  basePrice: number;
  shoesPrice: number;
  shoeUnitPrice: number;
  totalPrice: number;
  dayLabel: string;
  dayShort: string;
  dayGroup: string | null;
  unitText: string;
  resourceCount: number;
  lineItems: { label: string; amount: number; detail?: string }[];
}

/** Godzina graniczna między stawką dzienną a wieczorną. */
const CUTOFF_HOUR = 17;

/**
 * Parsuje 'HH:mm' na liczbę godzin (np. '16:30' => 16.5).
 */
function parseTimeToHours(timeStr: string): number {
  if (!timeStr) return CUTOFF_HOUR;
  const parts = timeStr.split(':').map(Number);
  const hours = Number.isFinite(parts[0]) ? parts[0] : 0;
  const minutes = Number.isFinite(parts[1]) ? parts[1] : 0;
  return hours + minutes / 60;
}

/** Zaokrągla kwotę do pełnych złotych. */
function roundPln(value: number): number {
  return Math.round(value);
}

/**
 * Wybiera stawkę dzienną dla daty.
 *
 * Kolejność kandydatów pochodzi z `DAY_GROUP_PRIORITY`:
 *  1. święto ustawowe -> 'sat-holidays' / 'weekend' / 'fri-sun',
 *  2. PN-CZ -> 'mon-thu',
 *  3. PT    -> 'fri',
 *  4. SO    -> 'sat-holidays' (lub 'weekend'),
 *  5. ND    -> 'sun' (lub 'weekend').
 *
 * Dzięki temu ten sam kod obsługuje cennik z czterema grupami dni (Katowice,
 * Poznań) i z trzema (Jaworzno ma tylko PN-CZ / PT / weekend).
 */
export function findMatchingPriceSlot(
  pricing: PriceSlot[],
  dateStr: string
): PriceSlot | undefined {
  if (!pricing || pricing.length === 0) return undefined;

  for (const dayGroup of dayGroupCandidates(dateStr)) {
    const slot = pricing.find((candidate) => candidate.id === dayGroup);
    if (slot) return slot;
  }

  // Ostatnia deska ratunku: dowolna stawka z cennika tej usługi.
  return pricing[0];
}

/**
 * Rozwiązuje kategorię usługi dla lokalizacji.
 *
 * Dart i karaoke istnieją tylko w jednym mieście, a stawka kręgli jest
 * zawsze dostępna - dlatego brakująca usługa wpada na cennik kręgli.
 */
export function resolveCategory(
  pricing: LocationPricing | undefined,
  resourceType: ResourceType
): PricingCategoryData | undefined {
  if (!pricing) return undefined;
  return pricing.categories[resourceType] ?? pricing.categories.bowling;
}

/** Wynik pusty - UI pokazuje wtedy stan ładowania zamiast wyciętego widoku. */
function emptyBreakdown(
  resourceCount: number,
  unitText: string
): PriceBreakdownResult {
  return {
    hasTariffs: false,
    before17Hours: 0,
    before17Rate: 0,
    after17Hours: 0,
    after17Rate: 0,
    subtotalBefore17: 0,
    subtotalAfter17: 0,
    basePrice: 0,
    shoesPrice: 0,
    shoeUnitPrice: 0,
    totalPrice: 0,
    dayLabel: '—',
    dayShort: '—',
    dayGroup: null,
    unitText,
    resourceCount,
    lineItems: [],
  };
}

/**
 * Oblicza podsumowanie ceny rezerwacji na podstawie taryf z bazy.
 *
 * REGUŁA KALKULACJI (zgodna z cennikiem):
 *  1. po dacie ustalamy grupę dni -> stawkę `before17` / `after17`,
 *  2. przedział czasu dzielimy w punkcie 17:00 - jeśli slot je przekracza,
 *     godziny liczymy PROPORCJONALNIE dla obu stawek (np. 16:30-17:30
 *     = 0,5 h × stawka dzienna + 0,5 h × wieczorna),
 *  3. mnożymy przez liczbę torów / stołów,
 *  4. dodajemy wypożyczenie obuwia: stawka z bazy × liczba par.
 *
 * ZERO HARDCODOWANYCH CEN - wszystkie stawki pochodzą z `pricing_tariffs`.
 */
export function calculateBookingPrice(input: CalculationInput): PriceBreakdownResult {
  const {
    locationSlug,
    resourceType,
    date,
    startTime,
    endTime,
    resourceCount = 1,
    includeShoes = false,
    shoesCount = 0,
  } = input;

  const locationData = peekLocationPricing(locationSlug);
  const categoryData = resolveCategory(locationData, resourceType);
  const matchedSlot = findMatchingPriceSlot(categoryData?.pricing ?? [], date);
  const lanes = Math.max(1, resourceCount);
  const unitText = categoryData?.unitText || 'za 1 godz. gry';

  // Brak taryfy w bazie: zwracamy strukturę z zerami, żeby UI mogło pokazać
  // stan ładowania zamiast wyciętego widoku. Nigdy nie podstawiamy stawek z kodu.
  if (!matchedSlot) {
    return emptyBreakdown(lanes, unitText);
  }

  const startHour = parseTimeToHours(startTime);
  let endHour = parseTimeToHours(endTime);
  if (endHour <= startHour) {
    endHour = startHour + 1; // Minimalna rozliczalna długość slotu.
  }

  // Proporcjonalny podział przedziału względem godziny 17:00.
  const before17Hours = Math.max(
    0,
    Math.min(CUTOFF_HOUR, endHour) - Math.min(CUTOFF_HOUR, startHour)
  );
  const after17Hours = Math.max(
    0,
    Math.max(CUTOFF_HOUR, endHour) - Math.max(CUTOFF_HOUR, startHour)
  );

  const subtotalBefore17 = roundPln(before17Hours * matchedSlot.before17 * lanes);
  const subtotalAfter17 = roundPln(after17Hours * matchedSlot.after17 * lanes);
  const basePrice = subtotalBefore17 + subtotalAfter17;

  // Obuwie: stawka z bazy (ta sama dla każdej grupy dni danego miasta).
  const shoeUnitPrice = categoryData?.shoesUnitPrice ?? 0;
  const shoesPrice =
    includeShoes && resourceType === 'bowling' && shoeUnitPrice > 0
      ? Math.max(0, shoesCount) * shoeUnitPrice
      : 0;

  const totalPrice = basePrice + shoesPrice;

  const lineItems: PriceBreakdownResult['lineItems'] = [];
  const resourceDetail = lanes > 1 ? `× ${lanes} torów/stołów` : undefined;

  if (before17Hours > 0) {
    lineItems.push({
      label: `Taryfa do 17:00 (${before17Hours} godz. × ${matchedSlot.before17} PLN)`,
      amount: subtotalBefore17,
      detail: resourceDetail,
    });
  }

  if (after17Hours > 0) {
    lineItems.push({
      label: `Taryfa po 17:00 (${after17Hours} godz. × ${matchedSlot.after17} PLN)`,
      amount: subtotalAfter17,
      detail: resourceDetail,
    });
  }

  if (shoesPrice > 0) {
    lineItems.push({
      label: `Wypożyczenie obuwia do kręgli (${shoesCount} par × ${shoeUnitPrice} PLN)`,
      amount: shoesPrice,
    });
  }

  return {
    hasTariffs: true,
    before17Hours,
    before17Rate: matchedSlot.before17,
    after17Hours,
    after17Rate: matchedSlot.after17,
    subtotalBefore17,
    subtotalAfter17,
    basePrice,
    shoesPrice,
    shoeUnitPrice,
    totalPrice,
    dayLabel: matchedSlot.dayLabel,
    dayShort: matchedSlot.dayShort,
    dayGroup: matchedSlot.id,
    unitText,
    resourceCount: lanes,
    lineItems,
  };
}