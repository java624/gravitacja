import type { LocationSlug, ResourceType } from '../../types/booking';
import { PRICING_DATA, type PriceSlot } from '../../data/pricingData';

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
  unitText: string;
  resourceCount: number;
  lineItems: { label: string; amount: number; detail?: string }[];
}

/**
 * Reads current active pricing rules from localStorage (set by Owner) or defaults.
 */
export function getActivePricingData() {
  try {
    const stored = localStorage.getItem('gravitacja_pricing_overrides');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Error reading pricing overrides:', err);
  }
  return PRICING_DATA;
}

/**
 * Parses HH:mm string into float hours (e.g., "16:30" => 16.5)
 */
function parseTimeToHours(timeStr: string): number {
  if (!timeStr) return 17;
  const parts = timeStr.split(':').map(Number);
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  return hours + minutes / 60;
}

/**
 * Finds matching price slot for a given date from category pricing array.
 */
function findMatchingPriceSlot(pricing: PriceSlot[], dateStr: string): PriceSlot {
  if (!pricing || pricing.length === 0) {
    return {
      id: 'default',
      dayLabel: 'Standard',
      dayShort: 'Std',
      before17: 119,
      after17: 159,
    };
  }

  const dateObj = new Date(dateStr);
  const day = dateObj.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri, 6: Sat

  if (day >= 1 && day <= 4) {
    // Monday - Thursday
    const slot = pricing.find(s => s.id === 'mon-thu' || s.dayShort.includes('Pn'));
    if (slot) return slot;
  } else if (day === 5) {
    // Friday
    const slot = pricing.find(s => s.id === 'fri' || s.id === 'fri-sun' || s.dayShort.includes('Pt'));
    if (slot) return slot;
  } else if (day === 6) {
    // Saturday
    const slot = pricing.find(s => s.id === 'sat-holidays' || s.id === 'weekend' || s.id === 'fri-sun' || s.dayShort.includes('Sob'));
    if (slot) return slot;
  } else if (day === 0) {
    // Sunday
    const slot = pricing.find(s => s.id === 'sun' || s.id === 'weekend' || s.id === 'sat-holidays' || s.id === 'fri-sun' || s.dayShort.includes('Ndz'));
    if (slot) return slot;
  }

  return pricing[0];
}

/**
 * Core dynamic price calculator
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

  const pricingState = getActivePricingData();
  const locationData = pricingState[locationSlug] || PRICING_DATA[locationSlug] || PRICING_DATA.katowice;
  const categoryData = locationData.categories[resourceType] || locationData.categories.bowling;

  const matchedSlot = findMatchingPriceSlot(categoryData.pricing, date);

  const startHour = parseTimeToHours(startTime);
  let endHour = parseTimeToHours(endTime);

  if (endHour <= startHour) {
    endHour = startHour + 1; // Minimum 1 hour fallback
  }

  const CUTOFF_HOUR = 17.0;

  // Split hours before and after 17:00
  const before17Hours = Math.max(0, Math.min(CUTOFF_HOUR, endHour) - Math.min(CUTOFF_HOUR, startHour));
  const after17Hours = Math.max(0, Math.max(CUTOFF_HOUR, endHour) - Math.max(CUTOFF_HOUR, startHour));

  const subtotalBefore17 = Math.round(before17Hours * matchedSlot.before17 * resourceCount);
  const subtotalAfter17 = Math.round(after17Hours * matchedSlot.after17 * resourceCount);
  const basePrice = subtotalBefore17 + subtotalAfter17;

  // Shoe rental unit price: Poznań 5 PLN, others 3 PLN
  const shoeUnitPrice = locationSlug === 'poznan' ? 5 : 3;
  const shoesPrice = includeShoes && resourceType === 'bowling' ? shoesCount * shoeUnitPrice : 0;

  const totalPrice = basePrice + shoesPrice;

  const lineItems: { label: string; amount: number; detail?: string }[] = [];

  if (before17Hours > 0) {
    lineItems.push({
      label: `Taryfa do 17:00 (${before17Hours} godz. × ${matchedSlot.before17} PLN)`,
      amount: subtotalBefore17,
      detail: resourceCount > 1 ? `× ${resourceCount} torów/stołów` : undefined,
    });
  }

  if (after17Hours > 0) {
    lineItems.push({
      label: `Taryfa po 17:00 (${after17Hours} godz. × ${matchedSlot.after17} PLN)`,
      amount: subtotalAfter17,
      detail: resourceCount > 1 ? `× ${resourceCount} torów/stołów` : undefined,
    });
  }

  if (shoesPrice > 0) {
    lineItems.push({
      label: `Wypożyczenie obuwia do kręgli (${shoesCount} par × ${shoeUnitPrice} PLN)`,
      amount: shoesPrice,
    });
  }

  return {
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
    unitText: categoryData.unitText || 'za 1 godz. gry',
    resourceCount,
    lineItems,
  };
}
