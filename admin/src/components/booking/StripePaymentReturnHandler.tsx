import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { verifyStripeSession, type StripeVerificationResponse } from '../../services/booking/stripePaymentService';
import { createReservation } from '../../lib/supabase';
import type { LocationSlug } from '../../types/booking';

export default function StripePaymentReturnHandler() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isBookingSuccess = searchParams.get('booking_success') === 'true';
  const isBookingCancelled = searchParams.get('booking_cancelled') === 'true';

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<StripeVerificationResponse | null>(null);
  const [createdReservationId, setCreatedReservationId] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelledBanner, setShowCancelledBanner] = useState(false);

  useEffect(() => {
    if (isBookingCancelled) {
      setShowCancelledBanner(true);
      // Clean query params from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [isBookingCancelled]);

  useEffect(() => {
    if (sessionId && isBookingSuccess) {
      handleVerifySession(sessionId);
    }
  }, [sessionId, isBookingSuccess]);

  const handleVerifySession = async (sId: string) => {
    setIsVerifying(true);
    setShowModal(true);
    setVerificationError(null);

    try {
      const data = await verifyStripeSession(sId);
      setVerificationResult(data);

      if (data.paid && data.metadata) {
        const meta = data.metadata;
        // Save the confirmed reservation
        try {
          const res = await createReservation({
            resource_id: meta.resourceId,
            location_slug: (meta.locationSlug as LocationSlug) || 'katowice',
            client_name: meta.clientName || 'Klient Stripe',
            client_phone: meta.clientPhone || '',
            client_email: meta.clientEmail || data.customerEmail || '',
            reservation_date: meta.reservationDate,
            start_time: meta.startTime,
            end_time: meta.endTime,
            guests_count: Number(meta.guestsCount || 4),
            total_price: Number(meta.totalPrice || data.amountTotal || 0),
            payment_method: meta.paymentMethod || 'card',
            payment_status: 'paid',
            include_shoes: meta.includeShoes === 'true',
            shoes_count: meta.includeShoes === 'true' ? Number(meta.guestsCount || 4) : 0,
          });
          setCreatedReservationId(res.id);
        } catch (resErr: any) {
          console.warn('Reservation create after payment note:', resErr);
        }
      }

      // Clean query params so refresh doesn't trigger again
      window.history.replaceState({}, '', window.location.pathname);
    } catch (err: any) {
      console.error('Failed to verify session:', err);
      setVerificationError(err.message || 'Nie udało się zweryfikować płatności Stripe.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setVerificationResult(null);
    setCreatedReservationId(null);
  };

  return (
    <>
      {/* Cancelled Banner */}
      <AnimatePresence>
        {showCancelledBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] max-w-lg w-[92%] bg-slate-950/95 border border-amber-500/40 text-amber-300 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">Płatność Stripe została anulowana</span>
                <span className="text-slate-400">Żadne środki nie zostały pobrane. Możesz dokonać rezerwacji ponownie.</span>
              </div>
            </div>
            <button
              onClick={() => setShowCancelledBanner(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success / Verification Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-950/95 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.2)] z-10 text-white overflow-hidden my-auto"
            >
              <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

              <button
                onClick={handleCloseModal}
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {isVerifying ? (
                <div className="py-12 text-center space-y-4">
                  <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                  <h3 className="text-lg font-black uppercase text-white">Weryfikacja Płatności Stripe...</h3>
                  <p className="text-xs text-slate-400">Potwierdzamy transakcję z bramką płatności testowych.</p>
                </div>
              ) : verificationError ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-white">Błąd weryfikacji</h3>
                  <p className="text-xs text-red-300">{verificationError}</p>
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-all"
                  >
                    Zamknij
                  </button>
                </div>
              ) : verificationResult?.paid ? (
                <div className="text-center py-2 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Stripe Sandbox • Płatność Zrealizowana
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                      Rezerwacja Potwierdzona!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Płatność została pomyślnie przetworzona w trybie testowym Stripe.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-white/15 rounded-2xl p-4 text-xs text-left space-y-2 font-mono">
                    {createdReservationId && (
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-slate-400">ID Rezerwacji:</span>
                        <span className="font-bold text-orange-400">{createdReservationId}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">ID Sesji Stripe:</span>
                      <span className="font-bold text-slate-300 truncate max-w-[200px]" title={verificationResult.id}>
                        {verificationResult.id}
                      </span>
                    </div>
                    {verificationResult.metadata?.locationSlug && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Centrum:</span>
                        <span className="font-bold text-white uppercase">{verificationResult.metadata.locationSlug}</span>
                      </div>
                    )}
                    {verificationResult.metadata?.resourceName && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Zasób:</span>
                        <span className="font-bold text-white">{verificationResult.metadata.resourceName}</span>
                      </div>
                    )}
                    {verificationResult.metadata?.reservationDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Termin:</span>
                        <span className="font-bold text-white">
                          {verificationResult.metadata.reservationDate} ({verificationResult.metadata.startTime} - {verificationResult.metadata.endTime})
                        </span>
                      </div>
                    )}
                    {verificationResult.amountTotal !== null && (
                      <div className="flex justify-between border-t border-white/10 pt-2 text-emerald-400 font-bold">
                        <span>Kwota Opłacona:</span>
                        <span>{verificationResult.amountTotal} {verificationResult.currency}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Status Płatności:</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-sans font-bold uppercase">
                        OPŁACONO (STRIPE)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-full py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase text-black bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Gotowe • Przejdź do Gravitacji</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
