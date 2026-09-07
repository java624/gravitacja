import type { Resource, Reservation } from '../../types/booking';
import type { CorporateInquiry } from '../../types/corporate';
import type { BirthdayInquiry } from '../../types/birthday';

export const INITIAL_MOCK_RESOURCES: Resource[] = [
  // Katowice
  { id: 'kat-b1', name: 'Tor 1 (Glow UV)', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b2', name: 'Tor 2 (Glow UV)', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b3', name: 'Tor 3 (VIP Line)', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b4', name: 'Tor 4 (VIP Line)', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-p1', name: 'Stół Bilardowy #1', type: 'billiards', location_slug: 'katowice', is_active: true },
  { id: 'kat-p2', name: 'Stół Bilardowy #2', type: 'billiards', location_slug: 'katowice', is_active: true },

  // Jaworzno
  { id: 'jaw-b1', name: 'Tor 1 Cosmic', type: 'bowling', location_slug: 'jaworzno', is_active: true },
  { id: 'jaw-b2', name: 'Tor 2 Cosmic', type: 'bowling', location_slug: 'jaworzno', is_active: true },
  { id: 'jaw-p1', name: 'Stół Bilardowy #1', type: 'billiards', location_slug: 'jaworzno', is_active: true },

  // Poznań
  { id: 'pozn-b1', name: 'Tor 1 Arcade', type: 'bowling', location_slug: 'poznan', is_active: true },
  { id: 'pozn-b2', name: 'Tor 2 Arcade', type: 'bowling', location_slug: 'poznan', is_active: true },
  { id: 'pozn-p1', name: 'Stół Bilardowy #1', type: 'billiards', location_slug: 'poznan', is_active: true },
];

const TODAY_DATE = new Date().toISOString().split('T')[0];

export const INITIAL_MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    resource_id: 'kat-b1',
    location_slug: 'katowice',
    client_name: 'Marek Kowalski',
    client_phone: '+48 600 111 222',
    client_email: 'marek@example.com',
    reservation_date: TODAY_DATE,
    start_time: '17:00',
    end_time: '19:00',
    guests_count: 4,
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[0],
  },
  {
    id: 'res-102',
    resource_id: 'kat-b2',
    location_slug: 'katowice',
    client_name: 'Anna Nowak',
    client_phone: '+48 501 333 444',
    client_email: 'anna.nowak@example.com',
    reservation_date: TODAY_DATE,
    start_time: '18:00',
    end_time: '20:00',
    guests_count: 6,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[1],
  },
  {
    id: 'res-103',
    resource_id: 'kat-p1',
    location_slug: 'katowice',
    client_name: 'Tomasz Wiśniewski',
    client_phone: '+48 789 555 666',
    client_email: 'tomasz@example.com',
    reservation_date: TODAY_DATE,
    start_time: '20:00',
    end_time: '22:00',
    guests_count: 2,
    status: 'confirmed',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[4],
  },
];

export const getMockReservations = (): Reservation[] => {
  try {
    const data = localStorage.getItem('gravitacja_mock_reservations');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading mock reservations:', e);
  }
  localStorage.setItem('gravitacja_mock_reservations', JSON.stringify(INITIAL_MOCK_RESERVATIONS));
  return INITIAL_MOCK_RESERVATIONS;
};

export const saveMockReservations = (reservations: Reservation[]) => {
  try {
    localStorage.setItem('gravitacja_mock_reservations', JSON.stringify(reservations));
  } catch (e) {
    console.error('Error saving mock reservations:', e);
  }
};

export const getMockCorporateInquiries = (): CorporateInquiry[] => {
  try {
    const data = localStorage.getItem('gravitacja_mock_corporate_inquiries');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading mock corporate inquiries:', e);
  }
  const empty: CorporateInquiry[] = [];
  try {
    localStorage.setItem('gravitacja_mock_corporate_inquiries', JSON.stringify(empty));
  } catch (e) {
    console.error('Error initializing mock corporate inquiries:', e);
  }
  return empty;
};

export const saveMockCorporateInquiries = (inquiries: CorporateInquiry[]) => {
  try {
    localStorage.setItem('gravitacja_mock_corporate_inquiries', JSON.stringify(inquiries));
  } catch (e) {
    console.error('Error saving mock corporate inquiries:', e);
  }
};

export const getMockBirthdayInquiries = (): BirthdayInquiry[] => {
  try {
    const data = localStorage.getItem('gravitacja_mock_birthday_inquiries');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading mock birthday inquiries:', e);
  }
  const empty: BirthdayInquiry[] = [];
  try {
    localStorage.setItem('gravitacja_mock_birthday_inquiries', JSON.stringify(empty));
  } catch (e) {
    console.error('Error initializing mock birthday inquiries:', e);
  }
  return empty;
};

export const saveMockBirthdayInquiries = (inquiries: BirthdayInquiry[]) => {
  try {
    localStorage.setItem('gravitacja_mock_birthday_inquiries', JSON.stringify(inquiries));
  } catch (e) {
    console.error('Error saving mock birthday inquiries:', e);
  }
};
