import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ArrowUpRight,
  MapPin,
  ChevronDown,
  Briefcase,
  Cake,
  Phone,
  Utensils,
  DollarSign,
  Calendar,
  Flame,
  UserCheck,
  Mail,
} from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';
import { useLocationContext, type LocationSlug } from '../../context/LocationContext';
import Logo from '../ui/Logo';

/** Anchor id of the city picker section on the landing page. */
const CITY_PICKER_ANCHOR = 'wybierz-lokal';

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSlug, setActiveSlug, openBooking } = useLocationContext();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const isLandingPage = location.pathname === '/';

  // Determine current active city slug from URL path if available
  const urlParts = location.pathname.split('/').filter(Boolean);
  const urlCitySlug = urlParts.length > 0 && (urlParts[0] === 'katowice' || urlParts[0] === 'jaworzno' || urlParts[0] === 'poznan')
    ? (urlParts[0] as LocationSlug)
    : null;

  const currentCitySlug: LocationSlug | null = isLandingPage ? null : (urlCitySlug || activeSlug);
  const currentCityLocation = currentCitySlug
    ? (LOCATIONS_DATA.find((l) => l.id === currentCitySlug) || LOCATIONS_DATA[1])
    : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close any open overlay before navigating.
  const closeOverlays = () => {
    setMobileOpen(false);
    setCityDropdownOpen(false);
  };

  const handleSelectCity = (newSlug: LocationSlug) => {
    setActiveSlug(newSlug);
    closeOverlays();

    if (isLandingPage) {
      navigate(`/${newSlug}`);
      return;
    }

    const parts = location.pathname.split('/').filter(Boolean);
    const isLocationFirst = parts.length > 0 && (parts[0] === 'katowice' || parts[0] === 'jaworzno' || parts[0] === 'poznan');

    let subPath = '';
    if (isLocationFirst) {
      subPath = parts.slice(1).join('/');
    } else if (parts.length > 0 && parts[0] !== 'admin') {
      subPath = parts.join('/');
    }

    const targetUrl = subPath ? `/${newSlug}/${subPath}` : `/${newSlug}`;
    navigate(targetUrl);
  };

  /** Logo always returns to the landing page — the "pick a city" screen. */
  const handleGoToLanding = () => {
    setActiveSlug(null);
    closeOverlays();
    navigate('/');
  };

  const scrollToCityPicker = () => {
    document.getElementById(CITY_PICKER_ANCHOR)?.scrollIntoView({ behavior: 'smooth' });
  };

  /** Landing CTA — brings the user to the city picker section. */
  const handleGoToCityPicker = () => {
    closeOverlays();

    if (isLandingPage) {
      scrollToCityPicker();
      return;
    }

    navigate('/');
    window.setTimeout(scrollToCityPicker, 150);
  };

  /** Single primary action: booking inside a venue, city picker on the landing. */
  const handlePrimaryAction = () => {
    if (currentCitySlug) {
      openBooking(currentCitySlug);
    } else {
      handleGoToCityPicker();
    }
  };

/** Sections of a specific venue — center of the header on location pages. */
  const cityNavItems = currentCitySlug ? [
    { label: 'O Lokalu', path: `/${currentCitySlug}`, icon: MapPin },
    { label: 'Cennik', path: `/${currentCitySlug}/cennik`, icon: DollarSign },
    { label: 'Rezerwacje', path: `/${currentCitySlug}/rezerwacje`, icon: Calendar },
    { label: 'Dzieci', path: `/${currentCitySlug}/dzieci`, icon: Cake },
    { label: 'Firmy', path: `/${currentCitySlug}/firmy`, icon: Briefcase },
    { label: 'Menu', path: `/${currentCitySlug}/menu`, icon: Utensils },
    { label: 'Klub', path: `/${currentCitySlug}/klub`, icon: Flame },
    { label: 'Praca', path: `/${currentCitySlug}/praca`, icon: UserCheck },
    { label: 'Kontakt', path: `/${currentCitySlug}/kontakt`, icon: Mail },
  ] : [];

  /** City pickers — center of the header on the landing page. */
  const landingNavItems = LOCATIONS_DATA.map((loc) => ({
    label: loc.name.toUpperCase(),
    path: `/${loc.id}`,
    icon: MapPin,
  }));

  const navItems = currentCitySlug ? cityNavItems : landingNavItems;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'py-1.5 sm:py-2' : 'py-2.5 sm:py-4'}`}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6">

        {/* ===== MAIN HEADER CONTAINER (single row, no TopBar) ===== */}
        <div className={`relative rounded-[20px] sm:rounded-[26px] border transition-all duration-500 flex items-center gap-2 sm:gap-3 overflow-hidden ${
          isScrolled
            ? 'p-2 md:px-5 md:py-2.5 border-white/15 bg-slate-950/90 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(249,115,22,0.15)]'
            : 'p-2.5 md:px-6 md:py-3 border-white/10 bg-slate-950/80 backdrop-blur-xl md:backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
        }`}>

          {/* Neon top accent line */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent blur-[1px] transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-60'}`} />

          {/* LEFT: logo (links to the city picker) + mobile city pill */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleGoToLanding}
              className="cursor-pointer"
              title="Grawitacja — wybierz lokalizację"
              aria-label="Grawitacja — strona główna"
            >
              <Logo />
            </button>

            {/* Mobile-only city pill */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setCityDropdownOpen((v) => !v)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase cursor-pointer"
                aria-expanded={cityDropdownOpen}
                aria-label="Wybierz miasto"
              >
                <MapPin className="w-3 h-3 text-orange-400" />
                <span>{currentCityLocation ? currentCityLocation.name : 'Miasto'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {cityDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-950/95 border border-white/15 p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1 text-left"
                  >
                    {LOCATIONS_DATA.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectCity(loc.id as LocationSlug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-black uppercase flex items-center justify-between transition-colors cursor-pointer ${
                          currentCitySlug === loc.id
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{loc.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
{/* CENTER: city pickers (landing) or venue sections (location pages) */}
          <div className="relative z-10 flex-1 min-w-0 hidden xl:flex items-center justify-center">
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              aria-label="Nawigacja główna"
              className="flex items-center gap-0.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-inner max-w-full overflow-x-auto"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      if (item.path === '/') setActiveSlug(null);
                      closeOverlays();
                      navigate(item.path);
                    }}
                    className={`relative px-2.5 xl:px-3 py-2 rounded-xl text-[11px] font-black tracking-wide whitespace-nowrap transition-all duration-300 uppercase cursor-pointer ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 drop-shadow-md">{item.label}</span>
                  </button>
                );
              })}
            </motion.nav>
          </div>

          {/* RIGHT: location phone + socials + primary CTA */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0 ml-auto xl:ml-0">
            {currentCityLocation && (
              <a
                href={`tel:${currentCityLocation.phoneClean}`}
                className="hidden lg:flex items-center gap-1.5 text-[11px] font-black text-slate-300 hover:text-orange-400 transition-colors whitespace-nowrap"
                title={`Zadzwoń do Grawitacji ${currentCityLocation.name}`}
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{currentCityLocation.phone}</span>
              </a>
            )}

            <div className="hidden sm:flex items-center gap-1.5">
              <a
                href={currentCityLocation?.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-600/30 hover:text-blue-400 text-slate-400 transition-all"
                title={currentCityLocation ? `Facebook Grawitacja ${currentCityLocation.name}` : 'Facebook Grawitacja'}
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={currentCityLocation?.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-pink-600/30 hover:text-pink-400 text-slate-400 transition-all"
                title={currentCityLocation ? `Instagram Grawitacja ${currentCityLocation.name}` : 'Instagram Grawitacja'}
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={handlePrimaryAction}
              className="hidden sm:flex items-center gap-1.5 px-3.5 md:px-5 py-2.5 rounded-xl text-[11px] md:text-xs font-black tracking-wider uppercase whitespace-nowrap text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_25px_rgba(249,115,22,0.5)] border border-orange-400/30 cursor-pointer active:scale-95"
            >
              <span>{currentCitySlug ? 'Rezerwuj' : 'Wybierz Lokal'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-orange-500/20 hover:border-orange-500/40 transition-all active:scale-95 cursor-pointer"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
{/* ===== MOBILE / TABLET DRAWER ===== */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="xl:hidden overflow-hidden mt-2"
            >
              <div className="rounded-[22px] border border-white/15 bg-slate-950/95 backdrop-blur-2xl p-4 flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-left">
                <div className="flex justify-between items-center border-b border-white/10 pb-2.5 px-1">
                  <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase">
                    {currentCityLocation ? `Grawitacja ${currentCityLocation.name}` : 'Wybierz Grawitację'}
                  </span>
                  {currentCityLocation && (
                    <a
                      href={`tel:${currentCityLocation.phoneClean}`}
                      className="flex items-center gap-1 text-[11px] font-bold text-orange-400"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{currentCityLocation.phone}</span>
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 py-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          if (item.path === '/') setActiveSlug(null);
                          closeOverlays();
                          navigate(item.path);
                        }}
                        className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="h-px bg-white/10 my-1" />

                <button
                  onClick={handlePrimaryAction}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-98 transition-transform cursor-pointer"
                >
                  <span>{currentCitySlug ? 'Rezerwuj Tor / Stół' : 'Wybierz Lokal'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                {!currentCitySlug && (
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-blue-400 transition-colors"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-pink-400 transition-colors"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
