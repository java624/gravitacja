import type {
  Reservation,
  CreateReservationInput,
  ReservationFilter,
  ReservationStatus,
  Resource,
} from '../../types/booking';
import { supabase, isSupabaseConfigured, supabaseConfigInfo } from './client';
import {
  SLOT_TAKEN_MESSAGE,
  SupabaseDbError,
  describeSupabaseError,
} from './supabaseErrors';

type SupabaseClientLike = NonNullable<typeof supabase>;

function ensureSupabaseReady(): NonNullable<typeof supabase> {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseDbError(
      `Supabase nie jest skonfigurowany. ${supabaseConfigInfo.reason}. ` +
        'Wypełnij poprawne VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY w .env, a następnie zrestartuj Vite.'
    );
  }

  return supabase;
}

function isTimeOverlapping(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}

/**
 * Czy wybrany zasób (tor/stół) jest zajęty w przedziale [startTime, endTime)?
 *
 * Gdy Supabase jest skonfigurowany, odpowiedź pochodzi WYŁĄCZNIE z tabeli
 * `reservations` (zasób + data + status != cancelled). Błąd zapytania jest rzucany
 * dalej jako SupabaseDbError - nigdy nie zgadujemy na podstawie localStorage, bo
 * to dawało fałszywe "slot wolny" (rezerwacja jest w bazie) albo fałszywe
 * "slot zajęty" (własna, lokalna kopia rezerwacji tego samego klienta).
 */
export async function checkTimeCollision(
  resourceId: string,
  date: string,
  startTime: string,
  endTime: string,
  ignoreReservationId?: string
): Promise<boolean> {
  const client = ensureSupabaseReady();

  const { data, error } = await client
    .from('reservations')
    .select('id, start_time, end_time, status')
    .eq('resource_id', resourceId)
    .eq('reservation_date', date)
    .neq('status', 'cancelled');

  if (error) {
    throw new SupabaseDbError(
      describeSupabaseError('Nie udało się sprawdzić zajętości terminu', error),
      error
    );
  }

  return (data ?? []).some((res) => {
    if (res.status === 'cancelled') return false;
    if (ignoreReservationId && res.id === ignoreReservationId) return false;
    return isTimeOverlapping(startTime, endTime, res.start_time, res.end_time);
  });
}

/**
 * Pobiera pojedynczy zasób osobnym zapytaniem.
 * Świadomie NIE używamy osadzenia `resource:resources(*)`, bo wymaga ono klucza
 * obcego - bez niego PostgREST rzuca PGRST200 i rezerwacja wyglądałaby jak
 * nieudana, mimo że wiersz został zapisany.
 */
async function loadResource(
  client: SupabaseClientLike,
  resourceId: string
): Promise<Resource | undefined> {
  const { data, error } = await client
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn('[GRAVITACJA] Nie udało się pobrać nazwy zasobu:', error.message);
    return undefined;
  }
  return data as Resource;
}

/**
 * Tworzy rezerwację.
 *
 * WAŻNE: w trybie Supabase nie ma żadnego fallbacku do localStorage.
 * Błąd bazy jest rzucany jako SupabaseDbError z opisem przyczyny (RLS, brak
 * tabeli, zły klucz, kolizja unikalności), więc klient zobaczy komunikat zamiast
 * fałszywego "rezerwacja przyjęta", której recepcja i tak by nie zobaczyła.
 */
export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const client = ensureSupabaseReady();

  const hasCollision = await checkTimeCollision(
    input.resource_id,
    input.reservation_date,
    input.start_time,
    input.end_time
  );

  if (hasCollision) {
    throw new Error(SLOT_TAKEN_MESSAGE);
  }

  const status: ReservationStatus = input.payment_status === 'paid' ? 'confirmed' : 'pending';

  const { data, error } = await client
    .from('reservations')
    .insert([
      {
        resource_id: input.resource_id,
        location_slug: input.location_slug,
        client_name: input.client_name,
        client_phone: input.client_phone,
        client_email: input.client_email,
        reservation_date: input.reservation_date,
        start_time: input.start_time,
        end_time: input.end_time,
        guests_count: input.guests_count,
        status,
        total_price: input.total_price ?? null,
        payment_method: input.payment_method ?? null,
        payment_status:
          input.payment_status ?? (input.payment_method === 'reception' ? 'pending' : 'paid'),
        include_shoes: input.include_shoes ?? false,
        shoes_count: input.shoes_count ?? 0,
      },
    ])
    .select('*')
    .single();

  if (error) {
    throw new SupabaseDbError(
      describeSupabaseError('Nie udało się zapisać rezerwacji w bazie', error),
      error
    );
  }

  if (!data) {
    throw new SupabaseDbError(
      'Nie udało się potwierdzić rezerwacji: Supabase nie zwrócił zapisanego rekordu. ' +
        'Zapis mógł się udać - sprawdź listę rezerwacji na recepcji i politykę RLS SELECT dla roli "anon".'
    );
  }

  const saved = data as Reservation;
  saved.resource = await loadResource(client, input.resource_id);
  return saved;
}

/** Dołącza nazwy zasobów do listy rezerwacji (osobne zapytanie - bez klucza obcego). */
async function attachResources(
  client: SupabaseClientLike,
  reservations: Reservation[]
): Promise<void> {
  const resourceIds = Array.from(
    new Set(reservations.map((r) => r.resource_id).filter(Boolean))
  );
  if (resourceIds.length === 0) return;

  const { data, error } = await client.from('resources').select('*').in('id', resourceIds);

  if (error || !data) {
    if (error) console.warn('[GRAVITACJA] Nie udało się pobrać nazw zasobów:', error.message);
    return;
  }

  const byId = new Map((data as Resource[]).map((r) => [r.id, r]));
  reservations.forEach((reservation) => {
    const resource = byId.get(reservation.resource_id);
    if (resource) reservation.resource = resource;
  });
}

/**
 * Lista rezerwacji dla panelu (recepcja / właściciel).
 *
 * W trybie Supabase błąd zapytania jest rzucany dalej - recepcja musi zobaczyć
 * przyczynę, a nie cicho podłożone rezerwacje demonstracyjne z localStorage.
 */
export async function fetchReservations(filters?: ReservationFilter): Promise<Reservation[]> {
  const client = ensureSupabaseReady();

  let query = client
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.location_slug && filters.location_slug !== 'all') {
    query = query.eq('location_slug', filters.location_slug);
  }
  if (filters?.date) {
    query = query.eq('reservation_date', filters.date);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new SupabaseDbError(
      describeSupabaseError('Nie udało się pobrać listy rezerwacji', error),
      error
    );
  }

  const results = (data ?? []) as Reservation[];
  await attachResources(client, results);

  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    return results.filter(
      (r) =>
        r.client_name.toLowerCase().includes(q) ||
        r.client_phone.toLowerCase().includes(q) ||
        r.client_email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.resource?.name ?? '').toLowerCase().includes(q)
    );
  }

  return results;
}

/** Zmiana statusu rezerwacji (potwierdź / anuluj / na recepcję). */
export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<Reservation> {
  const client = ensureSupabaseReady();

  const { data, error } = await client
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new SupabaseDbError(
      describeSupabaseError('Nie udało się zmienić statusu rezerwacji', error),
      error
    );
  }

  if (!data) {
    throw new SupabaseDbError(
      'Nie udało się zapisać zmiany statusu: w bazie nie ma rezerwacji o takim ID.'
    );
  }

  return data as Reservation;
}

/** Usunięcie rezerwacji z bazy (recepcja). */
export async function deleteReservation(id: string): Promise<void> {
  const client = ensureSupabaseReady();

  const { error } = await client.from('reservations').delete().eq('id', id);

  if (error) {
    throw new SupabaseDbError(
      describeSupabaseError('Nie udało się usunąć rezerwacji', error),
      error
    );
  }
  return;
}
