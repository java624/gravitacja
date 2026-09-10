import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { RoleSelector } from './RoleSelector';
import { PasswordForm } from './PasswordForm';
import type { AdminRole, AdminLocation } from '../../../types/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAsReception, loginAsOwner } = useAdminAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<AdminLocation | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectRole = (role: AdminRole, location?: AdminLocation) => {
    setSelectedRole(role);
    setSelectedLocation(location);
    setErrorMessage(null);
    setStep(2);
  };

  const handlePasswordSubmit = (password: string) => {
    setErrorMessage(null);

    if (selectedRole === 'reception') {
      if (!selectedLocation) {
        setErrorMessage('Wybierz lokalizację.');
        return;
      }
      const result = loginAsReception(selectedLocation, password);
      if (result.success) {
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(result.error || 'Nieprawidłowe hasło.');
      }
    } else if (selectedRole === 'owner') {
      const result = loginAsOwner(password);
      if (result.success) {
        handleClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(result.error || 'Nieprawidłowe hasło.');
      }
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedRole(null);
    setSelectedLocation(undefined);
    setErrorMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto cursor-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-slate-950/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.2)] z-10 text-white overflow-hidden my-auto"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content Body */}
          {step === 1 ? (
            <RoleSelector onSelectRole={handleSelectRole} />
          ) : (
            <PasswordForm
              role={selectedRole!}
              location={selectedLocation}
              errorMessage={errorMessage}
              onBack={() => setStep(1)}
              onSubmit={handlePasswordSubmit}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
