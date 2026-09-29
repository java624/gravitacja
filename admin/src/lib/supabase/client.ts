import { createClient } from '@supabase/supabase-js';

/**
 * Klient Supabase współdzielony przez warstwę danych (rezerwacje, zasoby, zapytania).
 *
 * ZASADA: brak konfiguracji nie może być cichy. Pusty / niekompletny .env
 * sprawiał kiedyś, że rezerwacje zapisywały się wyłącznie do localStorage
 * przeglądarki klienta - klient widział ekran "rezerwacja przyjęta", a recepcja
 * nie widziała nic, bo panel admina działa na innym porcie (5174) i ma własny
 * localStorage. Dlatego brak konfiguracji jest głośno logowany, a tryb demo
 * jest oznaczony w interfejsie.
 */
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const supabaseUrl = rawSupabaseUrl.trim();
const supabaseAnonKey = rawSupabaseAnonKey.trim();

const PLACEHOLDER_PATTERNS = [
  /__PASTE_/i,
  /PASTE_/i,
  /YOUR_SUPABASE/i,
  /YOUR_.*(URL|KEY)/i,
  /REPLACE_ME/i,
  /TWOJ-PROJEKT/i,
];

const containsPlaceholderValue = (value: string): boolean =>
  PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));

const hasValues = supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
const hasPlaceholders =
  hasValues && (containsPlaceholderValue(supabaseUrl) || containsPlaceholderValue(supabaseAnonKey));

export const isSupabaseConfigured = hasValues && !hasPlaceholders;

/** Diagnostyka dostępna w UI - pozwala pokazać przyczynę na ekranie. */
export const supabaseConfigInfo = {
  configured: isSupabaseConfigured,
  url: hasValues ? supabaseUrl : '(brak)',
  reason: !hasValues
    ? 'Brak VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY w pliku .env'
    : hasPlaceholders
      ? 'W pliku .env zostały placeholdery / stare wartości demo - wklej prawdziwy URL i anon key z Supabase'
      : 'OK',
};

if (!isSupabaseConfigured) {
  console.error(
    `[GRAVITACJA] Supabase NIE jest skonfigurowany: ${supabaseConfigInfo.reason}. ` +
      'Rezerwacje nie trafią do bazy danych i recepcja ich nie zobaczy. ' +
      'Uzupełnij .env w client/ oraz w admin/ (te same wartości) i zrestartuj Vite.'
  );
} else if (import.meta.env.DEV) {
  console.info(`[GRAVITACJA] Supabase podłączony: ${supabaseUrl}`);
}

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
