export type ResourceType = 'bowling' | 'billiards';

export type LocationSlug = 'katowice' | 'jaworzno' | 'poznan';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  location_slug: LocationSlug;
  is_active: boolean;
}

export interface Reservation {
  id: string;
  resource_id: string;
  location_slug: LocationSlug;
  client_name: string;
  client_phone: string;
  client_email: string;
  reservation_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  guests_count: number;
  status: ReservationStatus;
  created_at?: string;
  resource?: Resource;
}

export interface CreateReservationInput {
  resource_id: string;
  location_slug: LocationSlug;
  client_name: string;
  client_phone: string;
  client_email: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  guests_count: number;
}

export interface ReservationFilter {
  location_slug?: string;
  date?: string;
  status?: string;
  searchQuery?: string;
}
