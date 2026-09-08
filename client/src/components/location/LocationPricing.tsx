import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gamepad2, Clock, Sparkles, ArrowUpRight, Info, Star, Target, Phone, Mic2 } from 'lucide-react';
import { PRICING_DATA, type LocationPricing as LocationPricingType, type PricingCategoryData } from '../../data/pricingData';
import { useLocationContext, type LocationSlug } from '../../context/LocationContext';

interface LocationPricingProps {
  locationSlug?: LocationSlug;
}

export default function LocationPricing({ locationSlug }: LocationPricingProps) {
  const { activeSlug, activeLocation, openBooking } = useLocationContext();
  const slug = locationSlug || activeSlug || 'katowice';
  const pricingData: LocationPricingType = PRICING_DATA[slug] || PRICING_DATA.katowice;

  const [activeTab, setActiveTab] = useState<'bowling' | 'billiards' | 'dart' | 'karaoke'>('bowling');
  const hasDart = Boolean(pricingData.categories.dart);
  const hasKaraoke = Boolean(pricingData.categories.karaoke);
  // Optional categories are only present on one location (dart → Jaworzno,
  // karaoke → Poznań), so selectors that refer to them fall back to bowling
  // safely whenever they are absent.
  const effectiveTab: 'bowling' | 'billiards' | 'dart' | 'karaoke' =
    (activeTab === 'dart' && !hasDart) || (activeTab === 'karaoke' && !hasKaraoke)
      ? 'bowling'
      : activeTab;
  const activeCategory: PricingCategoryData =
    pricingData.categories[effectiveTab] || pricingData.categories.bowling;

  const handleBooking = () => {
    if (effectiveTab === 'dart' || effectiveTab === 'karaoke') return;
    openBooking(slug, effectiveTab);
  };

  return (
    <section id="cennik" className="space-y-8 text-left relative scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-purple-500/10 border border-purple-500/30 text-purple-400 text-[10px] sm:text-xs font-black tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Cennik Usług • Grawitacja {pricingData.locationName}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            {pricingData.pageTitle ? (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-purple-500">
                {pricingData.pageTitle}
              </span>
            ) : (
              <>Aktualny <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-purple-500">Cennik Gier</span></>
            )}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md leading-relaxed">
          Wybierz dyscyplinę, sprawdź stawkę w zależności od dnia i godziny i zarezerwuj grę online!
        </p>
      </div>

      {/* Category Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl w-full sm:w-auto relative shadow-inner">
          <button
            onClick={() => setActiveTab('bowling')}
            className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'bowling' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {activeTab === 'bowling' && (
              <motion.div
                layoutId="activePricingTabGen"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 via-red-600 to-purple-600 shadow-[0_0_25px_rgba(249,115,22,0.5),0_0_15px_rgba(168,85,247,0.4)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Trophy className="w-4 h-4 relative z-10 text-amber-400" />
            <span className="relative z-10 drop-shadow">Kręgle (Bowling)</span>
          </button>

          <button
            onClick={() => setActiveTab('billiards')}
            className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
              activeTab === 'billiards' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {activeTab === 'billiards' && (
              <motion.div
                layoutId="activePricingTabGen"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 shadow-[0_0_25px_rgba(168,85,247,0.5),0_0_15px_rgba(249,115,22,0.4)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Gamepad2 className="w-4 h-4 relative z-10 text-purple-300" />
            <span className="relative z-10 drop-shadow">Bilard</span>
          </button>

          {/* Dart tab — rendered only for locations that offer it (Jaworzno) */}
          {hasDart && (
            <button
              onClick={() => setActiveTab('dart')}
              className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'dart' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeTab === 'dart' && (
                <motion.div
                  layoutId="activePricingTabGen"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-lime-500 via-emerald-600 to-cyan-500 shadow-[0_0_25px_rgba(132,204,22,0.5),0_0_15px_rgba(16,185,129,0.4)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Target className="w-4 h-4 relative z-10 text-lime-300" />
              <span className="relative z-10 drop-shadow">Dart</span>
            </button>
          )}

          {/* Karaoke tab — rendered only for locations that offer it (Poznań) */}
          {hasKaraoke && (
            <button
              onClick={() => setActiveTab('karaoke')}
              className={`relative flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'karaoke' ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activeTab === 'karaoke' && (
                <motion.div
                  layoutId="activePricingTabGen"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 shadow-[0_0_25px_rgba(217,70,239,0.55),0_0_15px_rgba(192,38,211,0.4)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Mic2 className="w-4 h-4 relative z-10 text-fuchsia-300" />
              <span className="relative z-10 drop-shadow">Karaoke</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400 shrink-0" />
          <span>Rozliczanie godzinowe • {activeCategory.unitText}</span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${slug}-${effectiveTab}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {effectiveTab === 'dart' ? (
            /* Dart: single flat price, no day/time split needed */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
              {activeCategory.pricing.map((slot, idx) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="relative rounded-3xl p-6 bg-slate-950/80 border border-lime-500/25 hover:border-lime-400/60 backdrop-blur-xl transition-all duration-500 group flex items-center justify-between gap-4 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(132,204,22,0.35)]"
                >
                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-lime-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-lime-500/20 transition-colors" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-lime-500/20 border border-lime-500/40 text-lime-300 flex items-center justify-center shadow-[0_0_18px_rgba(132,204,22,0.35)] group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-1">
                        {slot.dayShort}
                      </span>
                      <h3 className="text-base font-black uppercase text-white group-hover:text-lime-300 transition-colors">
                        {slot.dayLabel}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right shrink-0 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-lime-300 block mb-1">
                      1 godzina gry
                    </span>
                    <span className="text-4xl font-black bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent drop-shadow">
                      {slot.before17} <span className="text-base font-bold text-lime-300">zł</span>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : effectiveTab === 'karaoke' ? (
            /* Karaoke: flat hourly rate (no do/po 17:00 split needed) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
              {activeCategory.pricing.map((slot, idx) => {
                const Icon = idx === 0 ? Mic2 : Star;
                return (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="relative rounded-3xl p-6 bg-slate-950/80 border border-fuchsia-500/25 hover:border-fuchsia-400/60 backdrop-blur-xl transition-all duration-500 group flex items-center justify-between gap-4 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(217,70,239,0.35)]"
                  >
                    <div className="absolute -top-10 -right-10 w-36 h-36 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-fuchsia-500/20 transition-colors" />
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 flex items-center justify-center shadow-[0_0_18px_rgba(217,70,239,0.35)] group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-1">
                          {slot.dayShort}
                        </span>
                        <h3 className="text-base font-black uppercase text-white group-hover:text-fuchsia-300 transition-colors">
                          {slot.dayLabel}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right shrink-0 relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider text-fuchsia-300 block mb-1">
                        1 godzina
                      </span>
                      <span className="text-4xl font-black bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow">
                        {slot.before17} <span className="text-base font-bold text-fuchsia-300">zł</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activeCategory.pricing.map((slot, idx) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-3xl p-6 bg-slate-950/80 via-slate-900/70 to-slate-950/90 border border-white/10 hover:border-purple-500/50 backdrop-blur-xl transition-all duration-500 group flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(168,85,247,0.35),0_0_20px_rgba(249,115,22,0.25)] overflow-hidden"
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 via-orange-500/5 to-transparent rounded-full blur-2xl group-hover:from-purple-500/25 group-hover:via-orange-500/15 transition-all duration-500 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 group-hover:via-purple-500/15 transition-all duration-500 pointer-events-none" />

                {slot.isPopular && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20 border border-orange-400/40 text-orange-300 text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>Popularne</span>
                  </div>
                )}

                <div>
                  <div className="mb-5 pb-4 border-b border-white/10">
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-1">
                      {slot.dayShort}
                    </span>
                    <h3 className="text-lg font-black uppercase text-white group-hover:text-purple-300 transition-colors">
                      {slot.dayLabel}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          do 17:00
                        </span>
                        <span className="text-xs font-semibold text-slate-300">przedpołudnie</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent drop-shadow">
                          {slot.before17} <span className="text-sm font-bold text-amber-400">zł</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 group-hover:border-purple-500/40 transition-all flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                          po 17:00
                        </span>
                        <span className="text-xs font-semibold text-slate-400">wieczór & noc</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent drop-shadow">
                          {slot.after17} <span className="text-sm font-bold text-purple-300">zł</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={handleBooking}
                    className="w-full py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-white/5 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-red-600 group-hover:to-purple-600 border border-white/10 group-hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] active:scale-95"
                  >
                    <span>Zarezerwuj</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-purple-950/40 via-slate-950/90 to-orange-950/30 border border-purple-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(168,85,247,0.15)]">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-black uppercase text-white tracking-wider">
                  Informacje o cenniku {activeCategory.title} ({pricingData.locationName})
                </h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {activeCategory.extraNote}
                </p>
              </div>
            </div>

            {effectiveTab === 'dart' ? (
              <a
                href={`tel:${activeLocation?.phoneClean || '327626000'}`}
                className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-lime-600 via-emerald-600 to-cyan-600 hover:from-lime-500 hover:via-emerald-500 hover:to-cyan-500 shadow-[0_0_25px_rgba(132,204,22,0.45),0_0_15px_rgba(16,185,129,0.35)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Zadzwoń i zarezerwuj stół do darta</span>
              </a>
            ) : effectiveTab === 'karaoke' ? (
              <a
                href={`tel:${activeLocation?.phoneClean || '616463000'}`}
                className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 hover:from-fuchsia-500 hover:via-pink-500 hover:to-purple-500 shadow-[0_0_25px_rgba(217,70,239,0.5),0_0_15px_rgba(192,38,211,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Mic2 className="w-4 h-4" />
                <span>Zadzwoń i zarezerwuj salę karaoke</span>
              </a>
            ) : (
              <button
                onClick={handleBooking}
                className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-purple-600 hover:from-orange-400 hover:via-red-500 hover:to-purple-500 shadow-[0_0_25px_rgba(249,115,22,0.5),0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Zarezerwuj teraz ({activeCategory.title})</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
