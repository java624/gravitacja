import type { Resource } from '../../types/booking';
import { supabase, isSupabaseConfigured, supabaseConfigInfo } from './client';
import { checkTimeCollision } from './reservationsService';
import { SupabaseDbError, describeSupabaseError } from './supabaseErrors';

function ensureSupabaseReady(): NonNullable<typeof supabase> {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseDbError(
      `Supabase nie jest skonfigurowany. ${supabaseConfigInfo.reason}. ` +
        'Wypełnij poprawne VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY w .env, a następnie zrestartuj Vite.'
    );
  }

  return supabase;
}

/**
 * Aktywne zasoby (tory / stoły) wybranej lokalizacji.
 *
 * W trybie Supabase zwracamy WYŁĄCZNIE zawartość tabeli `resources`.
 * Nie podkładamy zasobów demonstracyjnych, gdy zapytanie się nie uda lub
 * zwróci pustkę - inaczej klient rezerwowałby "zmyślony" tor, którego baza nie
 * zna, a recepcja nigdy by takiej rezerwacji nie zobaczyła.
 */
export async function fetchResources(location_slug?: string): Promise<Resource[]> {
  const client = ensureSupabaseReady();

  let query = client.from('resources').select('*').eq('is_active', true);
  if (location_slug) {
    query = query.eq('location_slug', location_slug);
  }

  const { data, error } = await query;

  if (error) {
    throw new SupabaseDbError(
      describeSupabaseError('Nie udało się pobrać listy torów/stołów', error),
      error
    );
  }

  const resources = (data ?? []) as Resource[];
  if (resources.length === 0) {
    console.warn(
      `[GRAVITACJA] Tabela "resources" nie zawiera aktywnych zasobów dla lokalizacji ` +
        `"${location_slug ?? 'wszystkie'}". Dodaj tory/stoły w Supabase, inaczej klient nie będzie ` +
        'mógł zarezerwować.'
    );
  }
  return resources;
}

/**
 * Dla każdego zasobu sprawdza dostępność w podanym przedziale czasowym.
 * Kolizje liczone są przez `checkTimeCollision`, czyli z tabeli `reservations`
 * w Supabase (patrz reservationsService).
 */
export async function fetchAvailableResources(
  location_slug: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<{ resource: Resource; isAvailable: boolean }[]> {
  const allResources = await fetchResources(location_slug);

  const results = await Promise.all(
    allResources.map(async (resource) => {
      const hasCollision = await checkTimeCollision(resource.id, date, startTime, endTime);
      return {
        resource,
        isAvailable: !hasCollision,
      };
    })
  );

  return results;
}
