export type ResourceType = 'bowling' | 'billiards' | 'dart' | 'karaoke';

export type LocationSlug = 'katowice' | 'jaworzno' | 'poznan';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type PaymentMethod = 'blik' | 'card' | 'payu' | 'reception';

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
  total_price?: number;
  payment_method?: PaymentMethod | string;
  payment_status?: PaymentStatus;
  include_shoes?: boolean;
  shoes_count?: number;
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
  total_price?: number;
  payment_method?: PaymentMethod | string;
  payment_status?: PaymentStatus;
  include_shoes?: boolean;
  shoes_count?: number;
}

export interface ReservationFilter {
  location_slug?: string;
  date?: string;
  status?: string;
  searchQuery?: string;
}
