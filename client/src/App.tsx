import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackgroundGlow from './components/layout/BackgroundGlow';
import LandingPage from './pages/LandingPage';
import LocationPage from './pages/LocationPage';
import ForCompaniesPage from './pages/ForCompaniesPage';
import KidsBirthdaysPage from './pages/KidsBirthdaysPage';
import PricingPage from './pages/PricingPage';
import ReservationsPage from './pages/ReservationsPage';
import MenuPage from './pages/MenuPage';
import ClubPage from './pages/ClubPage';
import JobsPage from './pages/JobsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import BookingModal from './components/booking/BookingModal';
import BirthdayModal from './components/modals/BirthdayModal';
import CorporateModal from './components/modals/CorporateModal';
import MenuModal from './components/modals/MenuModal';
import AdminAuthModal from './components/admin/AdminAuthModal';
import { useLocationContext } from './context/LocationContext';

export default function App() {
  const {
    isBookingOpen,
    closeBooking,
    bookingLocation,
    bookingResourceType,
    setActiveSlug,
  } = useLocationContext();

  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gravitacja_admin_auth') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  const handleAdminSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('gravitacja_admin_auth', 'true');
    setIsAdminAuthModalOpen(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('gravitacja_admin_auth');
    setCurrentView('client');
  };

  const handleToggleAdminView = () => {
    if (currentView === 'admin') {
      setCurrentView('client');
    } else {
      if (isAdminAuthenticated) {
        setCurrentView('admin');
      } else {
        setIsAdminAuthModalOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020308] text-white flex flex-col justify-between relative font-sans selection:bg-cyan-500 selection:text-black md:cursor-none">
      {/* Dynamic WebGL & Ambient Neon Backdrop */}
      <BackgroundGlow />

      {/* Main Navigation Header with Top-Bar & Location Selector */}
      <Header
        currentView={currentView}
        onToggleAdminView={handleToggleAdminView}
      />

      {/* Main Content Area with top spacing for fixed header */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-8 flex-1 w-full">
        {currentView === 'admin' ? (
          !isAdminAuthenticated ? (
            <div className="py-20 text-center space-y-4">
              <h2 className="text-xl font-bold text-amber-400">Wymagana Autoryzacja Admina</h2>
              <p className="text-xs text-slate-400">Dostęp do panelu zarządczego wymaga podania PINu pracownika.</p>
              <button
                onClick={() => setIsAdminAuthModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-black text-xs uppercase"
              >
                Wprowadź PIN
              </button>
            </div>
          ) : (
            <AdminPage onLogout={handleAdminLogout} />
          )
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Location-isolated sub-routes */}
            <Route path="/:locationSlug/cennik" element={<PricingPage />} />
            <Route path="/:locationSlug/rezerwacje" element={<ReservationsPage />} />
            <Route path="/:locationSlug/dzieci" element={<KidsBirthdaysPage />} />
            <Route path="/:locationSlug/firmy" element={<ForCompaniesPage />} />
            <Route path="/:locationSlug/menu" element={<MenuPage />} />
            <Route path="/:locationSlug/klub" element={<ClubPage />} />
            <Route path="/:locationSlug/praca" element={<JobsPage />} />
            <Route path="/:locationSlug/kontakt" element={<ContactPage />} />
            <Route path="/:locationSlug" element={<LocationPage />} />

            {/* Direct sub-route fallbacks without location prefix */}
            <Route path="/cennik" element={<PricingPage />} />
            <Route path="/rezerwacje" element={<ReservationsPage />} />
            <Route path="/dzieci" element={<KidsBirthdaysPage />} />
            <Route path="/firmy" element={<ForCompaniesPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/klub" element={<ClubPage />} />
            <Route path="/praca" element={<JobsPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
          </Routes>
        )}
      </main>

      {/* Global 4-Column Footer with discreet employee login link */}
      <Footer
        onSelectCity={(city) => {
          if (city) {
            setActiveSlug(city as any);
          }
          setCurrentView('client');
        }}
        onOpenAdminAuth={() => {
          if (isAdminAuthenticated) {
            setCurrentView('admin');
          } else {
            setIsAdminAuthModalOpen(true);
          }
        }}
      />

      {/* Global Client Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        initialLocation={bookingLocation}
        initialResourceType={bookingResourceType}
      />

      {/* Interactive Feature Modals */}
      <BirthdayModal />
      <CorporateModal />
      <MenuModal />

      {/* Admin Authentication PIN Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}