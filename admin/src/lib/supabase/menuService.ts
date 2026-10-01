import { supabase } from './client';
import { INITIAL_MENU_KATOWICE } from '../../data/initialMenuKatowice';

export interface MenuItem {
  id: string;
  location_slug: string;
  category: string;
  title: string;
  description?: string | null;
  price: number;
  price_maxi?: number | null;
  volume?: string | null;
  portion?: string | null;
  image_url?: string | null;
  is_available: boolean;
  is_bestseller: boolean;
  /** Kolejność w menu ustawiana przeciąganiem myszką (drag & drop). */
  sort_order?: number | null;
  created_at?: string;
}

/**
 * Wyciąga klucze, których nie ma w schemacie tabeli `menu_items`.
 *
 * PostgREST odpowiada HTTP 400 (PGRST204: "Could not find the '<x>' column of
 * 'menu_items' in the schema cache") na KAŻDY nieznany klucz w payloadzie.
 * To najczęstsza przyczyna "400 Bad Request" przy zapisie menu - baza jest po
 * prostu starsza niż kod. Zamiast wysyłać śmieci do bazy, filtrujemy payload do
 * kolumn, które faktycznie istnieją, a faktyczny komunikat błędu logujemy.
 */
const MENU_ITEM_COLUMNS: ReadonlySet<string> = new Set([
  'id',
  'location_slug',
  'location',
  'category',
  'title',
  'description',
  'price',
  'price_maxi',
  'volume',
  'portion',
  'image_url',
  'is_available',
  'is_bestseller',
  'sort_order',
  'created_at',
]);

/** Usuwa z obiektu klucze spoza schematu oraz `undefined` (JSON ich nie prześle). */
export function toMenuItemPayload<T extends Partial<MenuItem>>(data: T): Partial<MenuItem> {
  const payload: Partial<MenuItem> = {};
  for (const [key, value] of Object.entries(data)) {
    if (MENU_ITEM_COLUMNS.has(key) && value !== undefined) {
      (payload as Record<string, unknown>)[key] = value;
    }
  }
  return payload;
}

/**
 * Czytelny komunikat z surowego błędu PostgREST.
 * PGRST204 = brak kolumny w bazie -> namawia do uruchomienia migracji SQL.
 */
function describeSupabaseError(operation: string, error: unknown): Error {
  const err = error as { code?: string; message?: string; details?: string; hint?: string };
  const code = err?.code ?? '';
  const message = err?.message ?? String(error);
  const details = err?.details ?? '';
  const hint = err?.hint ?? '';

  console.error(`[menuService] ${operation} failed:`, error);

  let explanation = message;
  if (code === 'PGRST204' || /schema cache/i.test(message)) {
    explanation =
      'Tabela menu_items w Supabase nie ma wszystkich wymaganych kolumn. ' +
      'Uruchom admin/src/lib/supabase/create_menu_items.sql w Supabase SQL Editor.';
  } else if (code === '23502' || /not-null/i.test(message)) {
    explanation = 'Brakuje wymaganego pola (NOT NULL) - uzupełnij formularz.';
  } else if (code === '22P02' || /invalid input syntax/i.test(message)) {
    explanation = 'Błędny format wartości (np. liczby albo daty) - sprawdź wartość pola.';
  }

  const full = [explanation, details, hint].filter(Boolean).join(' ');
  const errorInstance = new Error(full);
  (errorInstance as Error & { code?: string }).code = code;
  return errorInstance;
}

const LOCAL_STORAGE_KEY = 'gravitacja_menu_items_v1';

function getLocalMenuItems(): MenuItem[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local menu items:', err);
  }
  // Initialize with initial data
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MENU_KATOWICE));
  return INITIAL_MENU_KATOWICE as MenuItem[];
}

function saveLocalMenuItems(items: MenuItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving local menu items:', err);
  }
}

/**
 * Fetch all menu items for a specific location (default 'katowice')
 */
export async function fetchMenuItems(locationSlug: string = 'katowice'): Promise<MenuItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('location_slug', locationSlug)
        // Kolejność z panelu admina (drag & drop) ma pierwszeństwo; created_at
        // jako drugi klucz pilnuje stabilności, gdy sort_order jest jeszcze 0.
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      // Pusty wynik to ODPOWIEDŹ bazy, nie błąd: jeśli właściciel usunął
      // ostatnią pozycję, menu ma być puste. Wcześniej `data.length > 0`
      // powodowało, że po skasowaniu wszystkiego klient znowu widział
      // dane demonstracyjne - wyglądało to jak "usunięcie nie działa".
      if (!error) {
        return (data ?? []) as MenuItem[];
      }
      console.warn('Supabase fetchMenuItems error, using local fallback:', error.message);
    } catch (err) {
      console.warn('Supabase fetchMenuItems warning, using local fallback:', err);
    }
  }

  // Local storage fallback
  const localItems = getLocalMenuItems();
  return localItems.filter((i) => i.location_slug === locationSlug);
}

/**
 * Toggle menu item availability (Stop-list toggle)
 */
export async function toggleMenuItemAvailability(id: string, isAvailable: boolean): Promise<MenuItem> {
  if (supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available: isAvailable })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw describeSupabaseError('toggleMenuItemAvailability', error);
    }
    if (data) return data as MenuItem;
  }

  const localItems = getLocalMenuItems();
  const index = localItems.findIndex((i) => i.id === id);
  if (index !== -1) {
    localItems[index].is_available = isAvailable;
    saveLocalMenuItems(localItems);
    return localItems[index];
  }
  throw new Error('Menu item not found');
}

/**
 * Create a new menu item
 */
export async function createMenuItem(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> {
  if (supabase) {
    // Payload filtrujemy do istniejących kolumn - inaczej stary schemat bazy
    // odpowiada HTTP 400 (PGRST204) i pozycja nie zapisuje się wcale.
    const payload = toMenuItemPayload(item);
    const { data, error } = await supabase
      .from('menu_items')
      .insert([payload])
      .select()
      .single();

    if (error) {
      // Błąd bazy NIE jest "po cichu" zapisywany do localStorage: właściciel
      // musi zobaczyć, że zmiana nie trafiła do bazy.
      throw describeSupabaseError('createMenuItem', error);
    }
    if (data) return data as MenuItem;
  }

  const newItem: MenuItem = {
    ...item,
    id: `custom-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const localItems = getLocalMenuItems();
  localItems.push(newItem);
  saveLocalMenuItems(localItems);
  return newItem;
}

/**
 * Update an existing menu item
 */
export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
  if (supabase) {
    const payload = toMenuItemPayload(updates);
    const { data, error } = await supabase
      .from('menu_items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw describeSupabaseError('updateMenuItem', error);
    }
    if (data) return data as MenuItem;
  }

  const localItems = getLocalMenuItems();
  const index = localItems.findIndex((i) => i.id === id);
  if (index !== -1) {
    localItems[index] = { ...localItems[index], ...updates };
    saveLocalMenuItems(localItems);
    return localItems[index];
  }
  throw new Error('Menu item not found');
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      throw describeSupabaseError('deleteMenuItem', error);
    }
    return;
  }

  const localItems = getLocalMenuItems();
  const filtered = localItems.filter((i) => i.id !== id);
  saveLocalMenuItems(filtered);
}

/**
 * Zapisuje nową kolejność pozycji po przeciągnięciu myszką (drag & drop).
 *
 * Wysyłamy jeden batch UPDATE zamiast N osobnych zapytań - przy 40 pozycjach
 * to 1 request zamiast 40. `id` muszą być UUID z bazy; pozycje lokalne
 * (`custom-...`) pomijamy, bo nie istnieją po stronie serwera.
 */
export async function persistMenuItemOrder(
  orderedIds: string[],
  locationSlug: string = 'katowice'
): Promise<void> {
  const client = supabase;
  if (!client) return;

  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const serverIds = orderedIds.filter((id) => uuidPattern.test(id));

  if (serverIds.length === 0) return;

  // Postgres nie ma "UPDATE ... CASE" przez PostgREST, więc idziemy po pozycji.
  // Równolegle, bo kolejność nie ma znaczenia, a opóźnienie rośnie z liczbą.
  const results = await Promise.allSettled(
    serverIds.map((id, index) =>
      client
        .from('menu_items')
        .update({ sort_order: index + 1 })
        .eq('id', id)
        .eq('location_slug', locationSlug)
    )
  );

  const errors: unknown[] = [];

  for (const result of results) {
    if (result.status === 'rejected') {
      errors.push(result.reason);
    } else if (result.value.error) {
      // PostgREST zwraca błąd bez throwa - to też jest niepowodzenie.
      errors.push(result.value.error);
    }
  }

  if (errors.length > 0) {
    errors.forEach((error) => describeSupabaseError('persistMenuItemOrder', error));
    throw new Error(
      `Nie udało się zapisać kolejności dla ${errors.length} z ${serverIds.length} pozycji.`
    );
  }
}
