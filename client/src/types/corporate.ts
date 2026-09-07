export type CorporateInquiryStatus = 'new' | 'contacted' | 'closed';

export interface CorporateInquiry {
  id: string;
  location_slug: string;
  company_name: string;
  email: string;
  phone: string;
  event_date?: string | null; // YYYY-MM-DD (data orientacyjna)
  guests_count?: number | null;
  preferences?: string[] | null; // np. ['bowling', 'billiards', 'catering']
  message?: string | null;
  status: CorporateInquiryStatus;
  created_at?: string;
}

export interface CorporateInquiryInput {
  companyName: string;
  email: string;
  phone: string;
  eventDate?: string;
  guestsCount?: number;
  preferences?: string[];
  message?: string;
}