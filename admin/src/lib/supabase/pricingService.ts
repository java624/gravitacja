/**
 * pricingService - JEDYNE ZRÓDŁO CEN w aplikacji.
 *
 * Wszystkie stawki pochodzą z tabeli Supabase `pricing_tariffs`
 * (migracja: src/lib/supabase/create_pricing_tariffs.sql). Moduł:
 *  - wczytuje taryfy i buduje z nich strukturę używaną przez UI,
 *  - trzyma cache w pamięci + subskrybentów, żeby kalkulator wyceny
 *    przeliczał się natychmiast po zmianie ceny w panelu admina,
 *  - nasłuchuje Realtime `postgres_changes` na `pricing_tariffs`,
 *  - zapisuje zmiany przez UPSERT (jedno zapytanie na cały batch).
 *
 * ZASADA PROJEKTOWA (zgodna z resztą warstwy danych): brak konfiguracji
 * Supabase nie może być cichy. Gdy baza jest nieosiągalna, funkcje rzucają
 * SupabaseDbError z instrukcją naprawy - nigdy nie podstawiamy stawek
 * zaszytych w kodzie, bo klient zapłaciłby inną kwotę niż widzi na cenniku.
 */
import { supabase, isSupabaseConfigured, supabaseConfigInfo } from './client';
import { SupabaseDbError } from './supabaseErrors';
import type { LocationPricing, PricingCategoryData, PricingMap } from '../../data/pricingData';
import { PRICING_LOCATIONS, PRICING_RESOURCE_TYPES } from '../../data/pricingData';
import type { LocationSlug, ResourceType } from '../../types/booking';

/** Nazwa tabeli - jedna dla odczytu i dla UPSERT. */
export const PRICING_TABLE = 'pricing_tariffs';

/** Wiersz, który panel admina zapisuje przez UPSERT. */
export interface PricingTariffInput {
  location_slug: LocationSlug;
  location_name?: string;
  resource_type: ResourceType;
  title?: string;
  subtitle?: string;
  unit_text?: string;
  extra_note?: string;
  page_title?: string | null;
  day_group: string;
  day_label: string;
  day_short: string;
  price_before_17: number;
  price_after_17: number;
  shoes_price: number;
  is_popular?: boolean;
  sort_order?: number;
  is_active?: boolean;
}

/** Wiersz tabeli `pricing_tariffs` po odczycie z bazy. */
export interface PricingTariffRow extends PricingTariffInput {
  id: string;
  location_name: string;
  title: string;
  subtitle: string;
  unit_text: string;
  extra_note: string;
  day_label: string;
  day_short: string;
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
  updated_at?: string;
}

/**
 * Kolumny istniejące w `pricing_tariffs`. PostgREST odpowiada HTTP 400
 * (PGRST204) na każdy klucz spoza schematu, więc payload trzymamy
 * w tym allowliście - tak jak robi to menuService dla menu_items.
 */
const TARIFF_COLUMNS: readonly string[] = [
  'id',
  'location_slug',
  'location_name',
  'resource_type',
  'title',
  'subtitle',
  'unit_text',
  'extra_note',
  'page_title',
  'day_group',
  'day_label',
  'day_short',
  'price_before_17',
  'price_after_17',
  'shoes_price',
  'is_popular',
  'sort_order',
  'is_active',
  'updated_at',
];

function ensureSupabaseReady(): NonNullable<typeof supabase> {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseDbError(
      `Cennik nie może zostać wczytany: ${supabaseConfigInfo.reason}. ` +
        'Uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY w .env i zrestartuj Vite.'
    );
  }
  return supabase;
}

/** `numeric` wraca z PostgREST jako string - zamieniamy na liczbę. */
function toNumber(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Usuwa klucze spoza schematu oraz `undefined`. */
function sanitizeRow(row: PricingTariffInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (TARIFF_COLUMNS.includes(key) && value !== undefined) {
      payload[key] = value;
    }
  }
  return payload;
}

function describePricingError(operation: string, error: unknown): Error {
  const err = error as { code?: string; message?: string; details?: string; hint?: string };
  const code = err?.code ?? '';
  const message = err?.message ?? String(error);
  console.error(`[pricingService] ${operation} failed:`, error);

  let explanation = message;
  if (code === 'PGRST204' || /schema cache/i.test(message)) {
    explanation =
      'Tabela pricing_tariffs nie ma wszystkich wymaganych kolumn. ' +
      'Uruchom src/lib/supabase/create_pricing_tariffs.sql w Supabase SQL Editor.';
  } else if (code === '42P01' || /does not exist/i.test(message)) {
    explanation =
      'W podłączonym projekcie Supabase nie ma tabeli pricing_tariffs. ' +
      'Uruchom src/lib/supabase/create_pricing_tariffs.sql w Supabase SQL Editor.';
  } else if (code === '42501' || /row-level security|permission denied/i.test(message)) {
    explanation = 'Polityka RLS tabeli pricing_tariffs blokuje tę operację dla roli "anon".';
  }

  const full = [explanation, err?.details, err?.hint].filter(Boolean).join(' ');
  const instance = new Error(full);
  (instance as Error & { code?: string }).code = code;
  return instance;
}
// ---------------------------------------------------------------------------
// Odczyt
// ---------------------------------------------------------------------------

/** Mapuje wiersz z PostgREST na silnie typowany obiekt. */
function mapRowFromDb(row: Record<string, unknown>): PricingTariffRow {
  return {
    id: String(row.id),
    location_slug: row.location_slug as LocationSlug,
    location_name: (row.location_name as string) ?? '',
    resource_type: row.resource_type as ResourceType,
    title: (row.title as string) ?? '',
    subtitle: (row.subtitle as string) ?? '',
    unit_text: (row.unit_text as string) ?? '',
    extra_note: (row.extra_note as string) ?? '',
    page_title: (row.page_title as string | null) ?? null,
    day_group: String(row.day_group),
    day_label: (row.day_label as string) ?? '',
    day_short: (row.day_short as string) ?? '',
    price_before_17: toNumber(row.price_before_17),
    price_after_17: toNumber(row.price_after_17),
    shoes_price: toNumber(row.shoes_price),
    is_popular: Boolean(row.is_popular),
    sort_order: toNumber(row.sort_order),
    is_active: row.is_active !== false,
    updated_at: (row.updated_at as string) ?? undefined,
  };
}

/**
 * Pobiera aktywne taryfy z bazy.
 * @param locationSlug wąski wybór miasta; `undefined` = wszystkie miasta.
 */
export async function fetchPricingTariffs(locationSlug?: LocationSlug): Promise<PricingTariffRow[]> {
  const client = ensureSupabaseReady();

  let query = client
    .from(PRICING_TABLE)
    .select('*')
    .eq('is_active', true)
    .order('location_slug', { ascending: true })
    .order('resource_type', { ascending: true })
    .order('sort_order', { ascending: true });

  if (locationSlug) {
    query = query.eq('location_slug', locationSlug);
  }

  const { data, error } = await query;
  if (error) {
    throw describePricingError('fetchPricingTariffs', error);
  }

  const rows = (data ?? []) as Record<string, unknown>[];

  if (rows.length === 0) {
    console.warn(
      `[pricingService] Tabela "${PRICING_TABLE}" nie zwróciła żadnej aktywnej taryfy` +
        (locationSlug ? ` dla lokalizacji "${locationSlug}"` : '') +
        '. Uruchom create_pricing_tariffs.sql albo dodaj taryfy w panelu "Ceny i Taryfy".'
    );
  }

  return rows.map(mapRowFromDb);
}

// ---------------------------------------------------------------------------
// Zapis (UPSERT)
// ---------------------------------------------------------------------------

/**
 * Zapisuje taryfy przez INSERT ... ON CONFLICT DO UPDATE.
 *
 * Klucz konfliktu jest taki sam jak w migracji (location_slug,
 * resource_type, day_group), więc panel może wysyłać komplet wierszy dla
 * wybranego miasta bez znajomości ich `id` - baza sama dogranicza zmienione.
 */
export async function upsertPricingTariffs(
  rows: PricingTariffInput[]
): Promise<PricingTariffRow[]> {
  const client = ensureSupabaseReady();
  if (rows.length === 0) return [];

  const { data, error } = await client
    .from(PRICING_TABLE)
    .upsert(rows.map(sanitizeRow), { onConflict: 'location_slug,resource_type,day_group' })
    .select();

  if (error) {
    throw describePricingError('upsertPricingTariffs', error);
  }

  return ((data ?? []) as Record<string, unknown>[]).map(mapRowFromDb);
}

// ---------------------------------------------------------------------------
// Budowa widoku cennika z wierszy bazy
// ---------------------------------------------------------------------------

/**
 * Przekłada płaską listę wierszy na strukturę używaną przez komponenty
 * (`LocationPricing`, `PriceBreakdownSummary`, kalkulator).
 *
 * Metadane kategorii (tytuł, podtytuł, jednostka, nota) są powtarzane
 * w każdym wierszu danej usługi - bierzemy je z pierwszego wiersza.
 */
export function buildPricingMap(rows: PricingTariffRow[]): PricingMap {
  const map: PricingMap = {};

  for (const row of rows) {
    const city = (map[row.location_slug] ??= {
      locationId: row.location_slug,
      locationName: row.location_name || row.location_slug,
      pageTitle: row.page_title ?? undefined,
      categories: {} as LocationPricing['categories'],
    });

    const existing = city.categories[row.resource_type];
    if (!existing) {
      city.categories[row.resource_type] = {
        id: row.resource_type,
        title: row.title || row.resource_type,
        subtitle: row.subtitle,
        unitText: row.unit_text,
        extraNote: row.extra_note,
        shoesUnitPrice: row.shoes_price,
        pricing: [],
      };
      continue;
    }

    // Uzupełniamy brakujące metadane z kolejnych wierszy.
    if (!existing.title && row.title) existing.title = row.title;
    if (!existing.subtitle && row.subtitle) existing.subtitle = row.subtitle;
    if (!existing.unitText && row.unit_text) existing.unitText = row.unit_text;
    if (!existing.extraNote && row.extra_note) existing.extraNote = row.extra_note;
  }

  // Drugie przejście: same sloty (kolejność z bazy = kolejność na cenniku).
  for (const row of rows) {
    const category = map[row.location_slug]?.categories[row.resource_type];
    if (!category) continue;

    category.pricing.push({
      id: row.day_group,
      dayLabel: row.day_label || row.day_group,
      dayShort: row.day_short || row.day_group,
      before17: row.price_before_17,
      after17: row.price_after_17,
      isPopular: row.is_popular,
    });
  }

  return map;
}
// ---------------------------------------------------------------------------
// Cache w pamięci + subskrybenci
// ---------------------------------------------------------------------------

type PricingListener = (map: PricingMap) => void;

let cache: PricingMap = {};
let loadedLocations = new Set<LocationSlug>();
const listeners = new Set<PricingListener>();
let inflight: Promise<PricingMap> | null = null;

/** Cennik trzymany aktualnie w pamięci (pusty przed pierwszym odczytem). */
export function getCachedPricing(): PricingMap {
  return cache;
}

/** Czy dane miasto zostało już wczytane z bazy w tej sesji. */
export function isLocationPricingLoaded(locationSlug: LocationSlug): boolean {
  return loadedLocations.has(locationSlug);
}

/**
 * Subskrypcja zmian cennika. Wywoływana z `useSyncExternalStore`, dzięki
 * czemu każdy kalkulator przelicza sumę w tej samej chwili, w której
 * zmiana dotarła do bazy.
 */
export function subscribeToPricing(listener: PricingListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Podmienia cache i budzi wszystkich słuchaczy. */
export function setPricingCache(map: PricingMap): void {
  cache = map;
  listeners.forEach((listener) => listener(cache));
}

/** Czyści cache - używane po zapisie, aby wymusić świeży odczyt z bazy. */
export function invalidatePricingCache(): void {
  loadedLocations = new Set<LocationSlug>();
  inflight = null;
}

/**
 * Wczytuje cennik (wszystkich miast) i wypełnia cache.
 *
 * Równoległe wywołania dzielą jeden request - kilka komponentów na stronie
 * (cennik + modal rezerwacji) nie generuje lawiny zapytań do bazy.
 */
export async function loadPricing(): Promise<PricingMap> {
  if (inflight) return inflight;

  inflight = (async () => {
    const rows = await fetchPricingTariffs();
    const map = buildPricingMap(rows);
    loadedLocations = new Set(Object.keys(map) as LocationSlug[]);
    setPricingCache(map);
    return map;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/** Cennik jednego miasta - z cache, a przy braku - świeży odczyt z bazy. */
export async function loadLocationPricing(
  locationSlug: LocationSlug
): Promise<LocationPricing | undefined> {
  if (!loadedLocations.has(locationSlug)) {
    await loadPricing();
  }
  return cache[locationSlug];
}

/** Bezpieczny odczyt z cache - nie odpala fetchu, używany w kalkulatorze. */
export function peekLocationPricing(locationSlug: LocationSlug): LocationPricing | undefined {
  return cache[locationSlug];
}

// ---------------------------------------------------------------------------
// Realtime
// ---------------------------------------------------------------------------

let realtimeStarted = false;

/**
 * Nasłuchuje zmian w `pricing_tariffs` i odświeża cache.
 *
 * Dzięki temu zmiana ceny w panelu admina jest widoczna na publicznym
 * cenniku bez odświeżania strony. Kanał zakładany jest raz i współdzielony
 * przez wszystkie komponenty.
 */
export function startPricingRealtime(): void {
  if (realtimeStarted || !supabase) return;
  realtimeStarted = true;

  supabase
    .channel('pricing_tariffs_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: PRICING_TABLE }, () => {
      // Odczytujemy ponownie zamiast używać payloadu zdarzenia - RLS może
      // nie pozwalać anonowi odczytać pełnego wiersza ze zdarzenia.
      void loadPricing().catch((error) => {
        console.warn('[pricingService] Nie udało się odświeżyć cennika po zmianie w bazie:', error);
      });
    })
    .subscribe();
}

/** Lista miast, dla których baza faktycznie zwróciła taryfy. */
export function loadedPricingLocations(): LocationSlug[] {
  return PRICING_LOCATIONS.filter((slug) => loadedLocations.has(slug));
}

/** Lista rodzajów usług obecnych w cenniku danego miasta. */
export function loadedResourceTypes(locationSlug: LocationSlug): ResourceType[] {
  const categories = cache[locationSlug]?.categories ?? {};
  return PRICING_RESOURCE_TYPES.filter((type) => Boolean(categories[type]));
}

/** Pusty cennik - używany, gdy miasto nie ma jeszcze żadnej taryfy. */
export function emptyPricingCategory(resourceType: ResourceType): PricingCategoryData {
  return {
    id: resourceType,
    title: resourceType,
    subtitle: '',
    unitText: '',
    extraNote: '',
    shoesUnitPrice: 0,
    pricing: [],
  };
}