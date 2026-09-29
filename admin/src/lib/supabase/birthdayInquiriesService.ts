import type {
  BirthdayInquiry,
  BirthdayInquiryInput,
  BirthdayInquiryStatus,
} from '../../types/birthday';
import { supabase } from './client';
import { getMockBirthdayInquiries, saveMockBirthdayInquiries } from './mockStore';

/** Docelowy adres e-mail, na który trafiają zapytania o urodziny (fallback do klienta poczty). */
export const BIRTHDAY_INQUIRIES_EMAIL = 'biuro@gravitacja.pl';

const LOCATION_NAMES: Record<string, string> = {
  katowice: 'Katowice',
  jaworzno: 'Jaworzno',
  poznan: 'Poznań',
};

/** Buduje gotowy link mailto: z treścią zapytania (ręczna integracja e-mail). */
export function buildBirthdayMailtoHref(
  input: BirthdayInquiryInput,
  id: string,
  locationSlug: string = 'katowice'
): string {
  const locationName = LOCATION_NAMES[locationSlug] || 'Grawitacja';
  const subject = `Urodziny dla dzieci (${locationName}) - ${input.childName || input.parentName}`;
  const lines = [
    `Id: ${id}`,
    `Lokalizacja: ${locationName}`,
    `Opiekun: ${input.parentName}`,
    `E-mail: ${input.email}`,
    `Telefon: ${input.phone}`,
  ];
  if (input.childName || input.childAge) {
    lines.push(`Dziecko: ${[input.childName, input.childAge ? `${input.childAge} lat` : null].filter(Boolean).join(', ')}`);
  }
  if (input.eventDate) lines.push(`Planowany termin: ${input.eventDate}${input.eventTime ? ` o godz. ${input.eventTime}` : ''}`);
  if (input.packageType) lines.push(`Wybrany pakiet: ${input.packageType === 'slonce' ? 'SŁOŃCE' : 'GRAVITACJA'}`);
  if (input.guestsCount) lines.push(`Liczba dzieci: ${input.guestsCount}`);
  if (input.extras && input.extras.length > 0) lines.push(`Atrakcje dodatkowe: ${input.extras.join(', ')}`);
  if (input.notes?.trim()) lines.push(`\nUwagi:\n${input.notes.trim()}`);
  const body = lines.join('\n');
  return `mailto:${BIRTHDAY_INQUIRIES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Zapisuje zapytanie — najpierw do Supabase, w razie braku konfiguracji/błędu do localStorage (widoczne w panelu admina). */
export async function submitBirthdayInquiry(
  input: BirthdayInquiryInput,
  locationSlug: string = 'katowice'
): Promise<{ id: string; via: 'supabase' | 'local' }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('birthday_inquiries')
        .insert([
          {
            location_slug: locationSlug,
            parent_name: input.parentName,
            email: input.email,
            phone: input.phone,
            child_name: input.childName?.trim() || null,
            child_age: input.childAge || null,
            event_date: input.eventDate || null,
            event_time: input.eventTime || null,
            package_type: input.packageType || null,
            guests_count: input.guestsCount || null,
            extras: input.extras && input.extras.length > 0 ? input.extras : null,
            notes: input.notes?.trim() || null,
            status: 'new',
          },
        ])
        .select('id')
        .single();

      if (error) throw error;
      if (data) return { id: data.id, via: 'supabase' };
    } catch (err) {
      console.warn('Supabase submitBirthdayInquiry failed, saving to mock storage:', err);
    }
  }

  const id = `bday-${Date.now()}`;
  const entry: BirthdayInquiry = {
    id,
    location_slug: locationSlug,
    parent_name: input.parentName,
    email: input.email,
    phone: input.phone,
    child_name: input.childName?.trim() || null,
    child_age: input.childAge || null,
    event_date: input.eventDate || null,
    event_time: input.eventTime || null,
    package_type: input.packageType || null,
    guests_count: input.guestsCount || null,
    extras: input.extras && input.extras.length > 0 ? input.extras : null,
    notes: input.notes?.trim() || null,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const mock = getMockBirthdayInquiries();
  mock.unshift(entry);
  saveMockBirthdayInquiries(mock);
  return { id, via: 'local' };
}

/** Pobiera zapytania o urodziny (dla panelu admina). */
export async function fetchBirthdayInquiries(): Promise<BirthdayInquiry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('birthday_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) return data as BirthdayInquiry[];
    } catch (err) {
      console.warn('Supabase fetchBirthdayInquiries failed, using mock data:', err);
    }
  }
  return getMockBirthdayInquiries();
}

/** Zmienia status zapytania (new / contacted / confirmed / closed). */
export async function updateBirthdayInquiryStatus(id: string, status: BirthdayInquiryStatus): Promise<BirthdayInquiry> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('birthday_inquiries')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      if (data) return data as BirthdayInquiry;
    } catch (err) {
      console.warn('Supabase updateBirthdayInquiryStatus failed, updating mock storage:', err);
    }
  }

  const mock = getMockBirthdayInquiries();
  const updatedMock = mock.map((item) => (item.id === id ? { ...item, status } : item));
  saveMockBirthdayInquiries(updatedMock);

  const updated = updatedMock.find((item) => item.id === id);
  if (!updated) throw new Error('Nie znaleziono zapytania o urodziny');
  return updated;
}