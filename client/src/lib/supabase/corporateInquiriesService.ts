import type {
  CorporateInquiry,
  CorporateInquiryInput,
  CorporateInquiryStatus,
} from '../../types/corporate';
import { supabase } from './client';
import { getMockCorporateInquiries, saveMockCorporateInquiries } from './mockStore';

/** Docelowy adres e-mail, na który trafiają zapytania firmowe (fallback do klienta poczty). */
export const CORPORATE_INQUIRIES_EMAIL = 'biuro@gravitacja.pl';

export interface SubmitResult {
  id: string;
  saved: boolean;
  via: 'supabase' | 'local';
}

/** Buduje gotowy link mailto: z treścią zapytania (ręczna integracja e-mail). */
export function buildCorporateMailtoHref(input: CorporateInquiryInput, id: string): string {
  const subject = `Zapytanie firmowe (Dla Firm) - ${input.companyName}`;
  const lines = [
    `Id: ${id}`,
    `Firma / Osoba kontaktowa: ${input.companyName}`,
    `E-mail: ${input.email}`,
    `Telefon: ${input.phone}`,
  ];
  if (input.eventDate) lines.push(`Planowany termin: ${input.eventDate}`);
  if (input.guestsCount) lines.push(`Liczba osób: ${input.guestsCount}`);
  if (input.preferences && input.preferences.length > 0) {
    lines.push(`Zainteresowanie: ${input.preferences.join(', ')}`);
  }
  if (input.message?.trim()) lines.push(`\nDodatkowe informacje:\n${input.message.trim()}`);
  const body = lines.join('\n');
  return `mailto:${CORPORATE_INQUIRIES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Zapisuje zapytanie — najpierw do Supabase, w razie braku konfiguracji/błędu do localStorage (widoczne w panelu admina). */
export async function submitCorporateInquiry(input: CorporateInquiryInput): Promise<SubmitResult> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('corporate_inquiries')
        .insert([
          {
            location_slug: 'katowice',
            company_name: input.companyName,
            email: input.email,
            phone: input.phone,
            event_date: input.eventDate || null,
            guests_count: input.guestsCount || null,
            preferences: input.preferences && input.preferences.length > 0 ? input.preferences : null,
            message: input.message?.trim() || null,
            status: 'new',
          },
        ])
        .select('id')
        .single();

      if (error) throw error;
      if (data) return { id: data.id, saved: true, via: 'supabase' };
    } catch (err) {
      console.warn('Supabase submitCorporateInquiry failed, saving to mock storage:', err);
    }
  }

  const id = `inq-${Date.now()}`;
  const entry: CorporateInquiry = {
    id,
    location_slug: 'katowice',
    company_name: input.companyName,
    email: input.email,
    phone: input.phone,
    event_date: input.eventDate || null,
    guests_count: input.guestsCount || null,
    preferences: input.preferences && input.preferences.length > 0 ? input.preferences : null,
    message: input.message?.trim() || null,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const mock = getMockCorporateInquiries();
  mock.unshift(entry);
  saveMockCorporateInquiries(mock);
  return { id, saved: true, via: 'local' };
}

/** Pobiera zapytania firmowe (dla panelu admina). */
export async function fetchCorporateInquiries(): Promise<CorporateInquiry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('corporate_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) return data as CorporateInquiry[];
    } catch (err) {
      console.warn('Supabase fetchCorporateInquiries failed, using mock data:', err);
    }
  }
  return getMockCorporateInquiries();
}

/** Zmienia status zapytania (new / contacted / closed). */
export async function updateCorporateInquiryStatus(id: string, status: CorporateInquiryStatus): Promise<CorporateInquiry> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('corporate_inquiries')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      if (data) return data as CorporateInquiry;
    } catch (err) {
      console.warn('Supabase updateCorporateInquiryStatus failed, updating mock storage:', err);
    }
  }

  const mock = getMockCorporateInquiries();
  const updatedMock = mock.map((item) => (item.id === id ? { ...item, status } : item));
  saveMockCorporateInquiries(updatedMock);

  const updated = updatedMock.find((item) => item.id === id);
  if (!updated) throw new Error('Nie znaleziono zapytania firmowego');
  return updated;
}