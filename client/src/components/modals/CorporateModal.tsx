import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, CheckCircle2, Phone } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';

export default function CorporateModal() {
  const { isCorporateModalOpen, setIsCorporateModalOpen, activeLocation, openBooking } = useLocationContext();

  if (!isCorporateModalOpen) return null;

  const handleClose = () => setIsCorporateModalOpen(false);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto cursor-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-slate-950/95 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(168,85,247,0.2)] z-10 text-white overflow-hidden my-auto"
        >
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Events & Teambuilding • {activeLocation?.name || 'Grawitacja'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-purple-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              Imprezy Firmowe & Integracje
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            <p>
              Szukasz idealnego miejsca na integrację firmową, spotkanie wigilijne lub turniej bowlingowy dla pracodawców? W Grawitacja {activeLocation?.name || 'Katowice'} zapewniamy wynajem wyłączny stref VIP, ligę firmową i wyśmienity catering.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Rezerwacja całego obiektu lub dedykowanej strefy VIP</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Turniej kręglarski z nagrodami i konferansjerem</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Bogate menu cateringowe (dania ciepłe, przekąski)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Open Bar na wybrane alkohole i autorskie drinki</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
              <div>
                <span className="block text-[10px] font-black uppercase text-purple-400 tracking-wider">
                  Dział Organizacji Imprez Firmowych
                </span>
                <span className="text-base font-black text-white">{activeLocation?.phone || '(32) 359 59 81'}</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${activeLocation?.phoneClean || '323595981'}`}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Zadzwoń</span>
                </a>
                <button
                  onClick={() => {
                    handleClose();
                    openBooking(activeLocation?.id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95 cursor-pointer"
                >
                  Rezerwuj
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
