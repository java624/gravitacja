import React from 'react';
import { User, Phone, Mail, Loader2, Footprints } from 'lucide-react';
import type { Resource, LocationSlug, PaymentMethod } from '../../types/booking';
import type { PriceBreakdownResult } from '../../services/booking/pricingCalculator';
import { PriceBreakdownSummary } from './PriceBreakdownSummary';
import { PaymentMethodSelector } from './PaymentMethodSelector';

interface Step3ContactDetailsProps {
  selectedLocation: LocationSlug;
  selectedResourceId: string | null;
  availableResources: { resource: Resource; isAvailable: boolean }[];
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  clientName: string;
  setClientName: (val: string) => void;
  clientPhone: string;
  setClientPhone: (val: string) => void;
  clientEmail: string;
  setClientEmail: (val: string) => void;
  includeShoes: boolean;
  setIncludeShoes: (val: boolean) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (val: PaymentMethod) => void;
  breakdown: PriceBreakdownResult;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function Step3ContactDetails({
  selectedLocation,
  selectedResourceId,
  availableResources,
  date,
  startTime,
  endTime,
  guestsCount,
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
  clientEmail,
  setClientEmail,
  includeShoes,
  setIncludeShoes,
  paymentMethod,
  setPaymentMethod,
  breakdown,
  isSubmitting,
  onBack,
  onSubmit,
}: Step3ContactDetailsProps) {
  const selectedResource = availableResources.find(r => r.resource.id === selectedResourceId)?.resource;
  const resourceName = selectedResource?.name || 'Wybrany tor/stół';
  const isBowling = selectedResource?.type === 'bowling' || !selectedResource;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Selected Term Summary Card */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-xs space-y-1.5 backdrop-blur-md">
        <div className="flex justify-between">
          <span className="text-slate-400">Lokalizacja:</span>
          <span className="font-bold text-white uppercase">{selectedLocation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Zasób:</span>
          <span className="font-bold text-orange-400">{resourceName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Termin:</span>
          <span className="font-bold text-white font-mono">{date} | {startTime} - {endTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Liczba osób:</span>
          <span className="font-bold text-white">{guestsCount} graczy</span>
        </div>
      </div>

      {/* Shoe Rental Toggle (Bowling Only) */}
      {isBowling && (
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-white">
                Wypożyczenie Obuwia ({guestsCount} pary)
              </h4>
              <p className="text-[10px] text-slate-400">
                Wymagane obuwie ze specjalną podeszwą (+{breakdown.shoeUnitPrice} PLN / para)
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeShoes}
              onChange={(e) => setIncludeShoes(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 border border-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      )}

      {/* Contact Fields Grid */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-orange-400" /> Imię i Nazwisko *
          </label>
          <input
            type="text"
            required
            placeholder="Jan Kowalski"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-orange-400" /> Numer Telefonu *
            </label>
            <input
              type="tel"
              required
              placeholder="+48 600 000 000"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-orange-400" /> Adres E-mail *
            </label>
            <input
              type="email"
              required
              placeholder="jan.kowalski@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Price Breakdown Summary Widget */}
      <PriceBreakdownSummary breakdown={breakdown} />

      {/* Payment Method Gateway Selector */}
      <PaymentMethodSelector
        selectedMethod={paymentMethod}
        onSelectMethod={setPaymentMethod}
      />

      {/* Bottom Action Controls */}
      <div className="pt-2 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          ← Wstecz
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase text-black bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:from-amber-300 hover:to-orange-300 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Przetwarzanie płatności...</span>
            </>
          ) : paymentMethod === 'reception' ? (
            <span>Zarezerwuj i zapłać na miejscu ({breakdown.totalPrice} PLN) →</span>
          ) : (
            <span>Zapłać i zarezerwuj ({breakdown.totalPrice} PLN) →</span>
          )}
        </button>
      </div>
    </form>
  );
}
