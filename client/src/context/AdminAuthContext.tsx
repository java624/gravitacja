import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUserSession, AdminRole, AdminLocation, LocationPasswords } from '../types/auth';
import { DEFAULT_ADMIN_PASSWORDS } from '../types/auth';
import type { LocationSlug } from '../types/booking';

interface AdminAuthContextType {
  session: AdminUserSession | null;
  isAuthenticated: boolean;
  role: AdminRole | null;
  assignedLocation: AdminLocation | 'all' | null;
  ownerCityFilter: LocationSlug | 'all';
  passwords: LocationPasswords;
  loginAsReception: (location: AdminLocation, password: string) => { success: boolean; error?: string };
  loginAsOwner: (password: string) => { success: boolean; error?: string };
  logout: () => void;
  updatePassword: (target: keyof LocationPasswords, newPassword: string) => boolean;
  setOwnerCityFilter: (city: LocationSlug | 'all') => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'gravitacja_admin_session_v2';
const PASSWORDS_STORAGE_KEY = 'gravitacja_admin_passwords_v2';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminUserSession | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse admin session:', err);
    }
    return null;
  });

  const [passwords, setPasswords] = useState<LocationPasswords>(() => {
    try {
      const stored = localStorage.getItem(PASSWORDS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_ADMIN_PASSWORDS, ...JSON.parse(stored) };
      }
    } catch (err) {
      console.error('Failed to parse admin passwords:', err);
    }
    return DEFAULT_ADMIN_PASSWORDS;
  });

  const [ownerCityFilter, setOwnerCityFilter] = useState<LocationSlug | 'all'>('all');

  useEffect(() => {
    if (session) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  const loginAsReception = (location: AdminLocation, password: string) => {
    if (!location) {
      return { success: false, error: 'Wybierz lokalizację do zalogowania.' };
    }

    const expectedPassword = passwords[location];
    // Allow configured password or fallback demo 1234
    if (password.trim() === expectedPassword || password.trim() === '1234') {
      const newSession: AdminUserSession = {
        role: 'reception',
        location,
        authenticatedAt: new Date().toISOString(),
      };
      setSession(newSession);
      return { success: true };
    }

    return {
      success: false,
      error: `Nieprawidłowe hasło recepcji dla ${location.toUpperCase()}. Spróbuj ponownie.`,
    };
  };

  const loginAsOwner = (password: string) => {
    const expectedPassword = passwords.owner;
    // Allow configured password or fallback demo 1234
    if (password.trim() === expectedPassword || password.trim() === '1234') {
      const newSession: AdminUserSession = {
        role: 'owner',
        location: 'all',
        authenticatedAt: new Date().toISOString(),
      };
      setSession(newSession);
      return { success: true };
    }

    return {
      success: false,
      error: 'Nieprawidłowe master-hasło Właściciela. Dostęp zabroniony.',
    };
  };

  const logout = () => {
    setSession(null);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const updatePassword = (target: keyof LocationPasswords, newPassword: string): boolean => {
    if (!newPassword || newPassword.trim().length < 4) {
      return false;
    }

    const updated = { ...passwords, [target]: newPassword.trim() };
    setPasswords(updated);
    try {
      localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error('Failed to save updated password:', err);
      return false;
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        role: session?.role || null,
        assignedLocation: session?.location || null,
        ownerCityFilter,
        passwords,
        loginAsReception,
        loginAsOwner,
        logout,
        updatePassword,
        setOwnerCityFilter,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
