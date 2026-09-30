import type { Resource, Reservation } from '../../types/booking';
import type { CorporateInquiry } from '../../types/corporate';
import type { BirthdayInquiry } from '../../types/birthday';

export const INITIAL_MOCK_RESOURCES: Resource[] = [
  // Katowice - 12 torów kręglarskich + 4 stoły bilardowe
  { id: 'kat-b1', name: 'Tor 1', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b2', name: 'Tor 2', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b3', name: 'Tor 3', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b4', name: 'Tor 4', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b5', name: 'Tor 5', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b6', name: 'Tor 6', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b7', name: 'Tor 7', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b8', name: 'Tor 8', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b9', name: 'Tor 9', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b10', name: 'Tor 10', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b11', name: 'Tor 11', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-b12', name: 'Tor 12', type: 'bowling', location_slug: 'katowice', is_active: true },
  { id: 'kat-p1', name: 'Stół 1', type: 'billiards', location_slug: 'katowice', is_active: true },
  { id: 'kat-p2', name: 'Stół 2', type: 'billiards', location_slug: 'katowice', is_active: true },
  { id: 'kat-p3', name: 'Stół 3', type: 'billiards', location_slug: 'katowice', is_active: true },
  { id: 'kat-p4', name: 'Stół 4', type: 'billiards', location_slug: 'katowice', is_active: true },

  // Jaworzno
  { id: 'jaw-b1', name: 'Tor 1', type: 'bowling', location_slug: 'jaworzno', is_active: true },
  { id: 'jaw-b2', name: 'Tor 2', type: 'bowling', location_slug: 'jaworzno', is_active: true },
  { id: 'jaw-p1', name: 'Stół 1', type: 'billiards', location_slug: 'jaworzno', is_active: true },

  // Poznań
  { id: 'pozn-b1', name: 'Tor 1', type: 'bowling', location_slug: 'poznan', is_active: true },
  { id: 'pozn-b2', name: 'Tor 2', type: 'bowling', location_slug: 'poznan', is_active: true },
  { id: 'pozn-p1', name: 'Stół 1', type: 'billiards', location_slug: 'poznan', is_active: true },
];

const TODAY_DATE = new Date().toISOString().split('T')[0];

export const INITIAL_MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    resource_id: 'kat-b1',
    location_slug: 'katowice',
    client_name: 'Marek Kowalski',
    client_phone: '+48 600 111 222',
    client_email: 'marek.kowalski@example.com',
    reservation_date: TODAY_DATE,
    start_time: '14:00',
    end_time: '16:00',
    guests_count: 4,
    status: 'confirmed',
    total_price: 238,
    payment_method: 'online',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
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
    total_price: 258,
    payment_method: 'reception',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[1],
  },
  {
    id: 'res-103',
    resource_id: 'kat-b4',
    location_slug: 'katowice',
    client_name: 'Piotr Zieliński',
    client_phone: '+48 602 998 877',
    client_email: 'piotr.zielinski@corp.pl',
    reservation_date: TODAY_DATE,
    start_time: '19:00',
    end_time: '21:00',
    guests_count: 5,
    status: 'pending',
    total_price: 258,
    payment_method: 'online',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[3],
  },
  {
    id: 'res-104',
    resource_id: 'kat-b6',
    location_slug: 'katowice',
    client_name: 'Katarzyna Dąbrowska',
    client_phone: '+48 512 443 211',
    client_email: 'katarzyna.d@gmail.com',
    reservation_date: TODAY_DATE,
    start_time: '16:00',
    end_time: '18:00',
    guests_count: 4,
    status: 'confirmed',
    total_price: 198,
    payment_method: 'online',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[5],
  },
  {
    id: 'res-105',
    resource_id: 'kat-b8',
    location_slug: 'katowice',
    client_name: 'Michał Lewandowski',
    client_phone: '+48 691 887 665',
    client_email: 'michal.lewy@wp.pl',
    reservation_date: TODAY_DATE,
    start_time: '17:00',
    end_time: '19:00',
    guests_count: 8,
    status: 'confirmed',
    total_price: 318,
    payment_method: 'online',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[7],
  },
  {
    id: 'res-106',
    resource_id: 'kat-b11',
    location_slug: 'katowice',
    client_name: 'Julia Wójcik',
    client_phone: '+48 733 120 456',
    client_email: 'julia.wojcik@o2.pl',
    reservation_date: TODAY_DATE,
    start_time: '19:30',
    end_time: '21:30',
    guests_count: 4,
    status: 'pending',
    total_price: 258,
    payment_method: 'reception',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[10],
  },
  {
    id: 'res-107',
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
    total_price: 90,
    payment_method: 'online',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    resource: INITIAL_MOCK_RESOURCES[12],
  },
];

export const getMockReservations = (): Reservation[] => {
  try {
    const data = localStorage.getItem('gravitacja_mock_reservations');
    if (data) {
      const parsed: Reservation[] = JSON.parse(data);
      return parsed.map((res) => {
        const found = INITIAL_MOCK_RESOURCES.find((r) => r.id === res.resource_id);
        if (found) {
          return { ...res, resource: found };
        }
        return res;
      });
    }
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
