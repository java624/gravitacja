import type { LocationSlug } from './booking';

export type AdminRole = 'reception' | 'owner';

export type AdminLocation = LocationSlug; // 'katowice' | 'jaworzno' | 'poznan'

export interface AdminUserSession {
  role: AdminRole;
  location: AdminLocation | 'all'; // Reception is tied to a specific city, Owner can select 'all' or a specific city
  authenticatedAt: string;
}

export interface AdminAuthState {
  session: AdminUserSession | null;
  isAuthenticated: boolean;
}

export interface LocationPasswords {
  katowice: string;
  jaworzno: string;
  poznan: string;
  owner: string;
}

export const DEFAULT_ADMIN_PASSWORDS: LocationPasswords = {
  katowice: 'kat2026',
  jaworzno: 'jaw2026',
  poznan: 'poz2026',
  owner: 'owner2026',
};
