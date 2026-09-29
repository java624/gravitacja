export { supabase, isSupabaseConfigured, supabaseConfigInfo } from './supabase/client';
export { fetchResources, fetchAvailableResources } from './supabase/resourcesService';
export { 
  checkTimeCollision, 
  createReservation, 
  fetchReservations, 
  updateReservationStatus, 
  deleteReservation 
} from './supabase/reservationsService';
export { SupabaseDbError } from './supabase/supabaseErrors';
export {
  CORPORATE_INQUIRIES_EMAIL,
  buildCorporateMailtoHref,
  submitCorporateInquiry,
  fetchCorporateInquiries,
  updateCorporateInquiryStatus,
} from './supabase/corporateInquiriesService';
export {
  BIRTHDAY_INQUIRIES_EMAIL,
  buildBirthdayMailtoHref,
  submitBirthdayInquiry,
  fetchBirthdayInquiries,
  updateBirthdayInquiryStatus,
} from './supabase/birthdayInquiriesService';
