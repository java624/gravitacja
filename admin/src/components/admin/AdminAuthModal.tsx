import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PIN = '1234';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }: AdminAuthModalProps) {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage(null);

      // Auto submit on 4th digit
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const verifyPin = (codeToTest: string) => {
    if (codeToTest === DEFAULT_PIN) {
      setErrorMessage(null);
      setPin('');
      onSuccess();
    } else {
      setErrorMessage('Nieprawidłowy kod PIN. Dostęp zabroniony!');
      setPin('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPin(pin);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto cursor-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-slate-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.2)] z-10 text-white overflow-hidden my-auto"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Strefa Chroniona
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              Autoryzacja Pracownika
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Wprowadź 4-cyfrowy PIN dostępowy recepcji / właściciela.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center justify-center gap-2 text-center">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* PIN Display */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-xl font-black transition-all ${
                    pin.length > idx
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'border-white/15 bg-white/5 text-slate-600'
                  }`}
                >
                  {pin.length > idx ? '●' : ''}
                </div>
              ))}
            </div>

            {/* PIN Keypad Grid */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  className="py-3 rounded-2xl bg-white/5 border border-white/10 text-lg font-black hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-amber-300 transition-all active:scale-95 cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
              >
                ⌫ Usunąć
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="py-3 rounded-2xl bg-white/5 border border-white/10 text-lg font-black hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-amber-300 transition-all active:scale-95 cursor-pointer"
              >
                0
              </button>
              <button
                type="submit"
                disabled={pin.length < 4}
                className="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 border border-amber-400/40 text-xs font-black uppercase text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-orange-500 transition-all active:scale-95 cursor-pointer disabled:opacity-40 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-500 font-mono">
                Domyślny PIN demonstracyjny: <code className="text-amber-400 font-bold">1234</code>
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
