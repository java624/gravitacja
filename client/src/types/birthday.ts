export type BirthdayPackageType = 'slonce' | 'gravitacja';
export type BirthdayInquiryStatus = 'new' | 'contacted' | 'confirmed' | 'closed';

export interface BirthdayInquiry {
  id: string;
  location_slug: string;
  parent_name: string;
  email: string;
  phone: string;
  child_name?: string | null;
  child_age?: number | null;
  event_date?: string | null; // YYYY-MM-DD
  event_time?: string | null; // HH:mm
  package_type?: BirthdayPackageType | null;
  guests_count?: number | null;
  extras?: string[] | null; // np. ['piniata', 'tort', 'stolik_dla_rodzicow']
  notes?: string | null;
  status: BirthdayInquiryStatus;
  created_at?: string;
}

export interface BirthdayInquiryInput {
  parentName: string;
  email: string;
  phone: string;
  childName?: string;
  childAge?: number;
  eventDate?: string;
  eventTime?: string;
  packageType?: BirthdayPackageType;
  guestsCount?: number;
  extras?: string[];
  notes?: string;
}