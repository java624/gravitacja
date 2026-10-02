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
              // BEZ `overflow-x-auto`: pasek przewijania pod nawigacją był
              // główną przyczyną "uciętego" menu na węższych ekranach.
              // Nawigacja ma zmieścić się w jednym rzędzie - stąd twarde
              // `whitespace-nowrap` + `shrink-0` na przyciskach i małe
              // odstępy (gap-2 / xl:gap-3).
              className="flex items-center gap-2 xl:gap-3 bg-black/40 px-2 py-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-inner max-w-full"
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
                    className={`relative shrink-0 px-1.5 py-2 rounded-xl text-xs font-medium tracking-wider whitespace-nowrap transition-all duration-300 uppercase cursor-pointer ${
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

          {/* RIGHT: tylko akcentny CTA (telefon -> Phone Island w hero,
              social -> Footer, więc pasek zostaje minimalistyczny) */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0 ml-auto xl:ml-0">
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
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 px-1">
                  <span className="text-[10px] font-black tracking-[0.2em] text-orange-400 uppercase">
                    {currentCityLocation ? `Grawitacja ${currentCityLocation.name}` : 'Wybierz Grawitację'}
                  </span>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
