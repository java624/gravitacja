/**
 * Wspólna nawigacja po dniach dla panelu recepcji.
 *
 * Ten sam zestaw przycisków (‹ Dzisiaj ›) oraz formatowanie daty są używane
 * w dwóch miejscach:
 * - w pełnoekranowym pasku recepcji (ReceptionFullscreenBar),
 * - w pasku narzędzi siatki TimelineGridView (tryb standardowy).
 *
 * Dzięki wydzieleniu tego kodu oba miejsca pokazują identyczną datę i
 * przeskakują o ten sam dzień - nie da się ich rozjechać.
 */

/** Aktualny dzień w formacie YYYY-MM-DD (bez pory dnia, więc bez problemu strefy czasowej). */
export const getTodayISODate = (): string => new Date().toISOString().split('T')[0];

/** Przesuwa datę YYYY-MM-DD o podaną liczbę dni. */
export const shiftDateISO = (isoDate: string, days: number): string => {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/** Pełny tytuł dnia, np. "sobota, 18 października 2026". */
export const formatDateTitlePL = (isoDate: string): string => {
  try {
    return new Date(isoDate + 'T12:00:00').toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
};

/**
 * Krótki tytuł dnia do wąskiego paska (~40px), np. "sob, 18 paź 2026".
 * Godzina 12:00 chroni przed przeskokiem o dzień przy strefach UTC±.
 */
export const formatDateCompactPL = (isoDate: string): string => {
  try {
    return new Date(isoDate + 'T12:00:00').toLocaleDateString('pl-PL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
};