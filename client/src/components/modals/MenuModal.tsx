import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import MenuSection from '../menu/MenuSection';

export default function MenuModal() {
  const { isMenuModalOpen, setIsMenuModalOpen, activeLocation } = useLocationContext();

  if (!isMenuModalOpen) return null;

  const handleClose = () => setIsMenuModalOpen(false);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto cursor-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-slate-950/95 border border-orange-500/30 rounded-3xl p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(249,115,22,0.2)] z-10 text-white overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
        >
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-amber-500/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <MenuSection locationSlug={activeLocation?.id || 'katowice'} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
