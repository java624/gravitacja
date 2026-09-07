import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { LOCATIONS_DATA } from '../data/locationsData';
import type { LocationItem } from '../types';

export type LocationSlug = 'katowice' | 'jaworzno' | 'poznan';

interface LocationContextType {
  activeSlug: LocationSlug | null;
  activeLocation: LocationItem | null;
  setActiveSlug: (slug: LocationSlug | null) => void;

  // Booking Modal Controls
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  bookingLocation: LocationSlug;
  bookingResourceType: 'bowling' | 'billiards';
  openBooking: (location?: string | null, resourceType?: 'bowling' | 'billiards') => void;
  closeBooking: () => void;

  // Quick Access Feature Modals
  isBirthdayModalOpen: boolean;
  setIsBirthdayModalOpen: (open: boolean) => void;
  isCorporateModalOpen: boolean;
  setIsCorporateModalOpen: (open: boolean) => void;
  isMenuModalOpen: boolean;
  setIsMenuModalOpen: (open: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'gravitacja_location_slug';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlugState] = useState<LocationSlug | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'katowice' || stored === 'jaworzno' || stored === 'poznan') {
        return stored as LocationSlug;
      }
    } catch {
      // localStorage read fallback
    }
    return null;
  });

  const setActiveSlug = (slug: LocationSlug | null) => {
    setActiveSlugState(slug);
    try {
      if (slug) {
        localStorage.setItem(STORAGE_KEY, slug);
      } else {
        // Clearing the selection must remove the persisted location — this is
        // what returns the user to the "pick a city" state on the landing page.
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage write/remove error fallback
    }
  };

  // Booking state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingLocation, setBookingLocation] = useState<LocationSlug>('katowice');
  const [bookingResourceType, setBookingResourceType] = useState<'bowling' | 'billiards'>('bowling');

  // Feature modals state
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const activeLocation = LOCATIONS_DATA.find((l) => l.id === activeSlug) || LOCATIONS_DATA[1];

  useEffect(() => {
    if (activeSlug) {
      setBookingLocation(activeSlug);
    }
  }, [activeSlug]);

  const openBooking = (location?: string | null, resourceType?: 'bowling' | 'billiards') => {
    const loc = (location as LocationSlug) || activeSlug || 'katowice';
    setBookingLocation(loc);
    if (resourceType) {
      setBookingResourceType(resourceType);
    } else {
      setBookingResourceType('bowling');
    }
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        activeSlug,
        activeLocation,
        setActiveSlug,
        isBookingOpen,
        setIsBookingOpen,
        bookingLocation,
        bookingResourceType,
        openBooking,
        closeBooking,
        isBirthdayModalOpen,
        setIsBirthdayModalOpen,
        isCorporateModalOpen,
        setIsCorporateModalOpen,
        isMenuModalOpen,
        setIsMenuModalOpen,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
