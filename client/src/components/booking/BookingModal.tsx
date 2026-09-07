import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import type { LocationSlug, Resource, ResourceType } from '../../types/booking';
import { fetchAvailableResources, createReservation } from '../../lib/supabase';
import BookingStepIndicator from './BookingStepIndicator';
import Step1TermSelection from './Step1TermSelection';
import Step2LaneSelection from './Step2LaneSelection';
import Step3ContactDetails from './Step3ContactDetails';
import Step4Confirmation from './Step4Confirmation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: string | null;
  initialResourceType?: ResourceType | null;
}

export default function BookingModal({ isOpen, onClose, initialLocation, initialResourceType }: BookingModalProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLocation, setSelectedLocation] = useState<LocationSlug>(
    (initialLocation as LocationSlug) || 'katowice'
  );
  const [resourceType, setResourceType] = useState<ResourceType>(initialResourceType || 'bowling');
  const [date, setDate] = useState<string>(todayStr);
  const [startTime, setStartTime] = useState<string>('17:00');
  const [endTime, setEndTime] = useState<string>('19:00');
  const [guestsCount, setGuestsCount] = useState<number>(4);

  // Availability state
  const [availableResources, setAvailableResources] = useState<{ resource: Resource; isAvailable: boolean }[]>([]);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isLoadingLanes, setIsLoadingLanes] = useState<boolean>(false);

  // Client Details state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedReservationId, setCompletedReservationId] = useState<string | null>(null);

  useEffect(() => {
    if (initialLocation && (initialLocation === 'katowice' || initialLocation === 'jaworzno' || initialLocation === 'poznan')) {
      setSelectedLocation(initialLocation as LocationSlug);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (initialResourceType) {
      setResourceType(initialResourceType);
    }
  }, [initialResourceType, isOpen]);

  useEffect(() => {
    if (isOpen && step >= 1) {
      loadAvailability();
    }
  }, [isOpen, selectedLocation, date, startTime, endTime, resourceType]);

  const loadAvailability = async () => {
    setIsLoadingLanes(true);
    setErrorMessage(null);
    try {
      const data = await fetchAvailableResources(selectedLocation, date, startTime, endTime);
      const filtered = data.filter(item => item.resource.type === resourceType);
      setAvailableResources(filtered);
      
      const availableItems = filtered.filter(item => item.isAvailable);
      if (availableItems.length > 0 && (!selectedResourceId || !availableItems.some(i => i.resource.id === selectedResourceId))) {
        setSelectedResourceId(availableItems[0].resource.id);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    } finally {
      setIsLoadingLanes(false);
    }
  };

  const handleNextToDetails = () => {
    if (!selectedResourceId) {
      setErrorMessage('Wybierz wolną tor/stół przed przejściem dalej.');
      return;
    }
    setErrorMessage(null);
    setStep(3);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()) {
      setErrorMessage('Wypełnij wszystkie pola kontaktowe.');
      return;
    }

    if (!selectedResourceId) {
      setErrorMessage('Wybierz zasób do rezerwacji.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const reservation = await createReservation({
        resource_id: selectedResourceId,
        location_slug: selectedLocation,
        client_name: clientName.trim(),
        client_phone: clientPhone.trim(),
        client_email: clientEmail.trim(),
        reservation_date: date,
        start_time: startTime,
        end_time: endTime,
        guests_count: guestsCount,
      });

      setCompletedReservationId(reservation.id);
      setStep(4);
    } catch (err: any) {
      setErrorMessage(err.message || 'Wystąpił błąd podczas tworzenia rezerwacji.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setErrorMessage(null);
    setCompletedReservationId(null);
    onClose();
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-2xl bg-slate-950/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(249,115,22,0.15)] z-10 text-white overflow-hidden my-auto"
        >
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-orange-400 mb-1">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>System Rezerwacji Gravitacja</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {step === 4 ? 'Potwierdzenie Rezerwacji' : 'Zarezerwuj Tor lub Stół'}
            </h2>
          </div>

          <BookingStepIndicator currentStep={step} />

          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <Step1TermSelection
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              resourceType={resourceType}
              setResourceType={setResourceType}
              date={date}
              setDate={setDate}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
              guestsCount={guestsCount}
              setGuestsCount={setGuestsCount}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2LaneSelection
              date={date}
              startTime={startTime}
              endTime={endTime}
              selectedLocation={selectedLocation}
              resourceType={resourceType}
              isLoadingLanes={isLoadingLanes}
              availableResources={availableResources}
              selectedResourceId={selectedResourceId}
              setSelectedResourceId={setSelectedResourceId}
              onBack={() => setStep(1)}
              onNext={handleNextToDetails}
            />
          )}

          {step === 3 && (
            <Step3ContactDetails
              selectedLocation={selectedLocation}
              selectedResourceId={selectedResourceId}
              availableResources={availableResources}
              date={date}
              startTime={startTime}
              endTime={endTime}
              guestsCount={guestsCount}
              clientName={clientName}
              setClientName={setClientName}
              clientPhone={clientPhone}
              setClientPhone={setClientPhone}
              clientEmail={clientEmail}
              setClientEmail={setClientEmail}
              isSubmitting={isSubmitting}
              onBack={() => setStep(2)}
              onSubmit={handleSubmitBooking}
            />
          )}

          {step === 4 && (
            <Step4Confirmation
              clientName={clientName}
              completedReservationId={completedReservationId}
              selectedLocation={selectedLocation}
              selectedResourceId={selectedResourceId}
              availableResources={availableResources}
              date={date}
              startTime={startTime}
              endTime={endTime}
              onClose={handleClose}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
