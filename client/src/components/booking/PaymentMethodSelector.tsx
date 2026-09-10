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
    accentColor: string;
  }[] = [
    {
      id: 'blik',
      name: 'BLIK',
      description: 'Szybka płatność kodem z aplikacji bankowej',
      icon: Zap,
      badge: 'POPULARNY',
      accentColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    },
    {
      id: 'card',
      name: 'Karta Płatnicza',
      description: 'Visa, Mastercard, Apple Pay, Google Pay',
      icon: CreditCard,
      accentColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      id: 'payu',
      name: 'PayU / Przelewy24',
      description: 'Szybki przelew internetowy ze swojego banku',
      icon: ShieldCheck,
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
        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Szyfrowanie SSL 256-bit
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
                <div className="flex items-center gap-2">
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
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug truncate">
                  {method.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
