import React from 'react';
import { CreditCard, Zap, ShieldCheck, Building2 } from 'lucide-react';
import type { PaymentMethod } from '../../types/booking';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const methods: {
    id: PaymentMethod;
    name: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
    gatewayBadge?: string;
    accentColor: string;
  }[] = [
    {
      id: 'blik',
      name: 'BLIK',
      description: 'Szybka płatność kodem z aplikacji bankowej',
      icon: Zap,
      badge: 'POPULARNY',
      gatewayBadge: 'Stripe Sandbox',
      accentColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    },
    {
      id: 'card',
      name: 'Karta Płatnicza',
      description: 'Visa, Mastercard, Apple Pay, Google Pay',
      icon: CreditCard,
      gatewayBadge: 'Stripe Sandbox',
      accentColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'payu',
      name: 'Przelewy24 / PayU',
      description: 'Szybki przelew internetowy ze swojego banku',
      icon: ShieldCheck,
      gatewayBadge: 'Stripe Sandbox',
      accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'reception',
      name: 'Płatność na Recepcji',
      description: 'Zapłać kartą lub gotówką po przyjściu do klubu',
      icon: Building2,
      accentColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
          Wybierz Sposób Płatności
        </label>
        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Stripe Sandbox (PLN)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={`group flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-950/60 border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div
                className={`p-2 rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${method.accentColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-xs font-black uppercase tracking-wide ${
                      isSelected ? 'text-amber-300' : 'text-white'
                    }`}
                  >
                    {method.name}
                  </span>
                  {method.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[8px] font-black uppercase">
                      {method.badge}
                    </span>
                  )}
                  {method.gatewayBadge && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[8px] font-bold uppercase tracking-wider">
                      {method.gatewayBadge}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug truncate">
                  {method.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedMethod !== 'reception' && (
        <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Tryb testowy Stripe aktywny: symulacja płatności kartą testową lub BLIK</span>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-200">
            TEST MODE
          </span>
        </div>
      )}
    </div>
  );
};
