/**
 * Wspólne opisy błędów Supabase dla warstwy rezerwacji (tor/stół).
 *
 * ZASADA PROJEKTOWA: kiedy klient Supabase jest skonfigurowany
 * (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY), warstwa danych NIGDY nie robi
 * cichego fallbacku do localStorage. Taki fallback powodował, że klient widział
 * ekran "rezerwacja przyjęta", a recepcja nie widziała nic - rezerwacja
 * istniała tylko w przeglądarce klienta (inny origin/port = inny localStorage).
 */

/** Komunikat kolizji - jego fragment "zarezerwowany" rozpoznaje availabilityService. */
export const SLOT_TAKEN_MESSAGE =
  'Ten tor/stół jest już zarezerwowany w wybranym przedziale czasowym!';

/** Widoczne w konsoli ostrzeżenie, że aplikacja działa na danych demonstracyjnych. */
export const DEMO_MODE_WARNING =
  '[GRAVITACJA] Supabase nie jest skonfigurowany (brak lub placeholder w VITE_SUPABASE_URL / ' +
  'VITE_SUPABASE_ANON_KEY). Tryb demo na localStorage: rezerwacje NIE trafiają do bazy i recepcja ich nie zobaczy.';

export interface SupabaseErrorLike {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

/** Błąd bazy, który musi zobaczyć użytkownik - zamiast fałszywego sukcesu. */
export class SupabaseDbError extends Error {
  readonly code: string | undefined;
  readonly details: string | undefined;
  readonly hint: string | undefined;

  constructor(message: string, supabaseError?: SupabaseErrorLike) {
    super(message);
    this.name = 'SupabaseDbError';
    this.code = supabaseError?.code;
    this.details = supabaseError?.details;
    this.hint = supabaseError?.hint;
  }
}

/**
 * Tłumaczy surowy błąd PostgREST/Postgres na komunikat, który pracownik
 * recepcji albo klient jest w stanie zrozumieć i naprawić.
 */
export function describeSupabaseError(action: string, err?: SupabaseErrorLike): string {
  const code = (err?.code ?? '').trim();
  const raw = (err?.message ?? 'nieznany błąd Supabase').trim();

  if (code === '23505') {
    return SLOT_TAKEN_MESSAGE;
  }
  if (code === '23503') {
    return `${action}: tabela "reservations" nie znalazła zasobu "resource_id" w tabeli "resources" (brak taki tor/stół albo brak klucza obcego).`;
  }
  if (code === '23502') {
    return `${action}: baza odrzuciła zapis, bo brakuje wymaganej kolumny (NOT NULL). Sprawdź strukturę tabeli "reservations".`;
  }
  if (code === '23514') {
    return `${action}: baza odrzuciła wartość jednej z kolumn (CHECK/enum), np. status lub location_slug.`;
  }
  if (code === '42501' || /row-level security|permission denied/i.test(raw)) {
    return `${action}: polityka RLS tabeli "reservations" zabrania tej operacji roli "anon". Otwórz polityki INSERT / SELECT / UPDATE.`;
  }
  if (code === '42P01' || /does not exist|Could not find the table|relation .* not found/i.test(raw)) {
    return `${action}: tabela "reservations" (lub "resources") nie istnieje w podłączonym projekcie Supabase.`;
  }
  if (code === 'PGRST200' || code === 'PGRST201' || /no relationship found|Could not embed|embed/i.test(raw)) {
    return `${action}: PostgREST nie znajduje relacji reservations.resource_id -> resources.id. Dodaj klucz obcy lub użyj zapytania bez osadzenia tabeli.`;
  }
  if (code === 'PGRST116' || /JSON object requested, multiple \(or no\) rows/i.test(raw)) {
    return `${action}: zapis mógł się udać, ale nie udało się odczytać rekordu (najczęściej brak polityki RLS SELECT dla roli "anon"). Sprawdź listę rezerwacji na recepcji.`;
  }
  if (code === 'PGRST301' || /JWT expired|Invalid API key|apikey/i.test(raw)) {
    return `${action}: nieprawidłowy VITE_SUPABASE_ANON_KEY w pliku .env.`;
  }
  if (code === '' || /Failed to fetch|NetworkError|ERR_NAME|Failed to connect/i.test(raw)) {
    return `${action}: brak połączenia z Supabase. Sprawdź VITE_SUPABASE_URL, internet oraz po zmianie .env zrestartuj serwer deweloperski (Vite).`;
  }

  return `${action}: ${raw}${code ? ` (kod ${code})` : ''}`;
}
