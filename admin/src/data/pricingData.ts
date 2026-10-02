/**
 * Typy i reguły cennika - BEZ ŻADNYCH STAWEK.
 *
 * UWAGA ARCHITEKTURALNA: w tym pliku celowo NIE MA numerów (cen).
 * Wszystkie stawki żyją w tabeli Supabase `pricing_tariffs` i są ładowane
 * przez `lib/supabase/pricingService.ts`. Dzięki temu zmiana ceny w panelu
 * admina natychmiast zmienia publiczny cennik i kalkulator rezerwacji.
 *
 * Ten plik zawiera wyłącznie:
 *  - kształt danych (interfejsy),
 *  - dozwolone wartości słownikowe (grupy dni, rodzaje usług),
 *  - kolejność priorytetów dopasowania grupy dni do daty.
 */
import type { LocationSlug, ResourceType } from '../types/booking';

/** Jedna stawka dobowa dla konkretnej grupy dni, wczytana z bazy. */
export interface PriceSlot {
  /** Klucz grupy dni - patrz DAY_GROUPS. */
  id: string;
  dayLabel: string;
  dayShort: string;
  /** PLN za godzinę przed godziną 17:00. */
  before17: number;
  /** PLN za godzinę po godzinie 17:00. */
  after17: number;
  isPopular?: boolean;
}

/** Opis usługi rozrywkowej wraz z jej cennikiem (wczytanym z bazy). */
export interface PricingCategoryData {
  id: ResourceType;
  title: string;
  subtitle: string;
  unitText: string;
  extraNote: string;
  /** PLN za jedną parę wypożyczonego obuwia (0 = usługa go nie wypożycza). */
  shoesUnitPrice: number;
  pricing: PriceSlot[];
}

/** Cały cennik jednego miasta - w całości pochodzi z `pricing_tariffs`. */
export interface LocationPricing {
  locationId: string;
  locationName: string;
  /** Opcjonalny nagłówek sekcji cennika. */
  pageTitle?: string;
  categories: {
    bowling: PricingCategoryData;
    billiards: PricingCategoryData;
    /** Tylko Jaworzno. */
    dart?: PricingCategoryData;
    /** Tylko Poznań. */
    karaoke?: PricingCategoryData;
  };
}

export type PricingMap = Record<string, LocationPricing>;

/**
 * Dozwolone grupy dni. Wartość `day_group` w bazie musi być jedną z nich,
 * inaczej wiersz nigdy nie zostanie dopasowany do daty i cena się nie pokaże.
 */
export const DAY_GROUPS = [
  'mon-thu', // PN-CZ
  'fri', // PT
  'sat-holidays', // SO + święta
  'sun', // ND
  'weekend', // SO + ND + święta (Jaworzno)
  'fri-sun', // PT + ND + święta (Karaoke)
  'all-week', // PN-ND + święta (Dart)
] as const;

export type DayGroup = (typeof DAY_GROUPS)[number];

export const PRICING_LOCATIONS: readonly LocationSlug[] = ['katowice', 'jaworzno', 'poznan'];

export const PRICING_RESOURCE_TYPES: readonly ResourceType[] = [
  'bowling',
  'billiards',
  'dart',
  'karaoke',
];

/**
 * Priorytet dopasowania grupy dni: pierwsza trafiona wygrywa.
 * Kolejność jest świadoma - taryfy weekendowe muszą wyprzedzać taryfy
 * zwykłych dni roboczych, a święto w środku tygodnia ma użyć stawki
 * weekendowej, o ile dana lokalizacja taką posiada.
 */
export const DAY_GROUP_PRIORITY = {
  holiday: ['sat-holidays', 'weekend', 'fri-sun', 'all-week', 'sun', 'fri', 'mon-thu'],
  monday: ['mon-thu', 'all-week', 'fri-sun', 'fri', 'sun', 'sat-holidays', 'weekend'],
  friday: ['fri', 'fri-sun', 'all-week', 'mon-thu', 'sun', 'sat-holidays', 'weekend'],
  saturday: ['sat-holidays', 'weekend', 'fri-sun', 'sun', 'all-week', 'fri', 'mon-thu'],
  sunday: ['sun', 'weekend', 'fri-sun', 'all-week', 'sat-holidays', 'fri', 'mon-thu'],
} as const;

export type DayKind = keyof typeof DAY_GROUP_PRIORITY;

/**
 * Stałe polskie święta ustawowe (dni wolne od pracy).
 * Święta ruchome liczone są z Wielkanocy - patrz `easterSunday`.
 */
const FIXED_PUBLIC_HOLIDAYS = new Set([
  '01-01', // Nowy Rok
  '01-06', // Święto Trzech Króli
  '05-01', // Święto Pracy
  '05-03', // Święto Konstytucji 3 Maja
  '08-15', // Wniebowzięcie NMP
  '11-01', // Wszystkich Świętych
  '11-11', // Narodowe Święto Niepodległości
  '12-24', // Wigilia Bożego Narodzenia
  '12-25', // Boże Narodzenie (pierwszy dzień)
  '12-26', // Boże Narodzenie (drugi dzień)
]);

/** 'MM-DD' dla podanej daty. */
function monthDay(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** Data Wielkanocy w danym roku (algorytm Gaussa / Meeusa). */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * Parsuje 'YYYY-MM-DD' do Date w strefie lokalnej.
 *
 * `new Date('2026-02-10')` jest interpretowany jako UTC, przez co w Polsce
 * (UTC+1/+2) daje 23:00 dnia poprzedniego i `getDay()` zwraca zły dzień
 * tygodnia - stawka zostałaby policzona dla niewłaściwej grupy dni.
 * Dlatego składamy datę ręcznie z części tekstowych.
 */
export function parseIsoDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (!match) return null;
  const [, y, m, d] = match;
  const parsed = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Czy podana data (YYYY-MM-DD) jest świętem ustawowym w Polsce.
 * Uwzględnia Wielkanoc, Poniedziałek Wielkanocny, Zielone Świątki,
 * Boże Ciało oraz stałe dni wolne od pracy.
 */
export function isPolishPublicHoliday(dateStr: string): boolean {
  const parsed = parseIsoDate(dateStr);
  if (!parsed) return false;

  if (FIXED_PUBLIC_HOLIDAYS.has(monthDay(parsed))) return true;

  const easter = easterSunday(parsed.getFullYear());
  const movable = [
    easter, // Wielkanoc
    addDays(easter, 1), // Poniedziałek Wielkanocny
    addDays(easter, 49), // Zielone Świątki
    addDays(easter, 60), // Boże Ciało
  ];
  return movable.some((holiday) => monthDay(holiday) === monthDay(parsed));
}

/** Z którego zbioru priorytetów korzystamy dla podanej daty. */
export function resolveDayKind(dateStr: string): DayKind {
  const parsed = parseIsoDate(dateStr);
  if (!parsed) return 'monday';

  // Święto w środku tygodnia ma pierwszeństwo przed dniem roboczym.
  if (isPolishPublicHoliday(dateStr)) return 'holiday';

  switch (parsed.getDay()) {
    case 5:
      return 'friday';
    case 6:
      return 'saturday';
    case 0:
      return 'sunday';
    default:
      return 'monday';
  }
}

/** Lista priorytetów dla daty - gotowa do użycia w kalkulatorze. */
export function dayGroupCandidates(dateStr: string): readonly string[] {
  return DAY_GROUP_PRIORITY[resolveDayKind(dateStr)];
}