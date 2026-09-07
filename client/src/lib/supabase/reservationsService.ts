import type { Reservation, CreateReservationInput, ReservationFilter, ReservationStatus } from '../../types/booking';
import { supabase } from './client';
import { getMockReservations, saveMockReservations, INITIAL_MOCK_RESOURCES } from './mockStore';

function isTimeOverlapping(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}

export async function checkTimeCollision(
  resourceId: string,
  date: string,
  startTime: string,
  endTime: string,
  ignoreReservationId?: string
): Promise<boolean> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('resource_id', resourceId)
        .eq('reservation_date', date)
        .neq('status', 'cancelled');

      if (error) throw error;

      if (data) {
        const collisions = data.filter(res => {
          if (ignoreReservationId && res.id === ignoreReservationId) return false;
          return isTimeOverlapping(startTime, endTime, res.start_time, res.end_time);
        });
        return collisions.length > 0;
      }
    } catch (err) {
      console.warn('Supabase checkTimeCollision failed, checking mock data:', err);
    }
  }

  const mockReservations = getMockReservations();
  const collisions = mockReservations.filter(res => {
    if (res.status === 'cancelled') return false;
    if (ignoreReservationId && res.id === ignoreReservationId) return false;
    if (res.resource_id !== resourceId) return false;
    if (res.reservation_date !== date) return false;
    return isTimeOverlapping(startTime, endTime, res.start_time, res.end_time);
  });

  return collisions.length > 0;
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const hasCollision = await checkTimeCollision(
    input.resource_id,
    input.reservation_date,
    input.start_time,
    input.end_time
  );

  if (hasCollision) {
    throw new Error('Ten tor/stół jest już zarezerwowany w wybranym przedziale czasowym!');
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
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
            status: 'pending',
          },
        ])
        .select('*, resource:resources(*)')
        .single();

      if (error) throw error;
      if (data) return data as Reservation;
    } catch (err) {
      console.warn('Supabase createReservation failed, saving to mock storage:', err);
    }
  }

  const mockReservations = getMockReservations();
  const targetResource = INITIAL_MOCK_RESOURCES.find(r => r.id === input.resource_id);

  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    resource_id: input.resource_id,
    location_slug: input.location_slug,
    client_name: input.client_name,
    client_phone: input.client_phone,
    client_email: input.client_email,
    reservation_date: input.reservation_date,
    start_time: input.start_time,
    end_time: input.end_time,
    guests_count: input.guests_count,
    status: 'pending',
    created_at: new Date().toISOString(),
    resource: targetResource,
  };

  const updatedMock = [newReservation, ...mockReservations];
  saveMockReservations(updatedMock);
  return newReservation;
}

export async function fetchReservations(filters?: ReservationFilter): Promise<Reservation[]> {
  if (supabase) {
    try {
      let query = supabase.from('reservations').select('*, resource:resources(*)').order('created_at', { ascending: false });

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
      if (error) throw error;

      if (data) {
        let results = data as Reservation[];
        if (filters?.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          results = results.filter(
            r =>
              r.client_name.toLowerCase().includes(q) ||
              r.client_phone.toLowerCase().includes(q) ||
              r.client_email.toLowerCase().includes(q) ||
              r.id.toLowerCase().includes(q)
          );
        }
        return results;
      }
    } catch (err) {
      console.warn('Supabase fetchReservations failed, using mock data:', err);
    }
  }

  let mock = getMockReservations();
  mock = mock.map(r => ({
    ...r,
    resource: r.resource || INITIAL_MOCK_RESOURCES.find(res => res.id === r.resource_id),
  }));

  if (filters?.location_slug && filters.location_slug !== 'all') {
    mock = mock.filter(r => r.location_slug === filters.location_slug);
  }
  if (filters?.date) {
    mock = mock.filter(r => r.reservation_date === filters.date);
  }
  if (filters?.status && filters.status !== 'all') {
    mock = mock.filter(r => r.status === filters.status);
  }
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    mock = mock.filter(
      r =>
        r.client_name.toLowerCase().includes(q) ||
        r.client_phone.toLowerCase().includes(q) ||
        r.client_email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }

  return mock;
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select('*, resource:resources(*)')
        .single();

      if (error) throw error;
      if (data) return data as Reservation;
    } catch (err) {
      console.warn('Supabase updateReservationStatus failed, updating mock storage:', err);
    }
  }

  const mock = getMockReservations();
  const updatedMock = mock.map(r => (r.id === id ? { ...r, status } : r));
  saveMockReservations(updatedMock);

  const updated = updatedMock.find(r => r.id === id);
  if (!updated) throw new Error('Nie znaleziono rezerwacji');
  return updated;
}

export async function deleteReservation(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteReservation failed, updating mock storage:', err);
    }
  }

  const mock = getMockReservations();
  const updatedMock = mock.filter(r => r.id !== id);
  saveMockReservations(updatedMock);
  return true;
}
