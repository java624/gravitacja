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
import BookingModal from './components/booking/BookingModal';
import BirthdayModal from './components/modals/BirthdayModal';
import CorporateModal from './components/modals/CorporateModal';
import MenuModal from './components/modals/MenuModal';
import StripePaymentReturnHandler from './components/booking/StripePaymentReturnHandler';
import { useLocationContext } from './context/LocationContext';


function AppContent() {
  const {
    isBookingOpen,
    closeBooking,
    bookingLocation,
    bookingResourceType,
    setActiveSlug,
  } = useLocationContext();

  return (
    <div className="min-h-screen bg-[#020308] text-white flex flex-col justify-between relative font-sans selection:bg-cyan-500 selection:text-black md:cursor-none">
      {/* Dynamic WebGL & Ambient Neon Backdrop */}
      <BackgroundGlow />

      {/* Main Navigation Header with Top-Bar & Location Selector */}
      <Header />

      {/* Main Content Area with top spacing for fixed header */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-8 flex-1 w-full">
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
      </main>

      {/* Global 4-Column Footer */}
      <Footer
        onSelectCity={(city) => {
          if (city) {
            setActiveSlug(city as any);
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

      {/* Stripe Return / Confirmation Handler */}
      <StripePaymentReturnHandler />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}