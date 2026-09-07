import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Medal, ArrowDown } from 'lucide-react';

const DESCRIPTION_POINTS = [
  {
    title: '15-osobowy VIP ROOM',
    text: 'Na mniejsze spotkania proponujemy kameralny VIP ROOM z indywidualną obsługą.',
    icon: CheckCircle2,
    color: 'text-purple-400',
  },
  {
    title: 'Catering & profesjonalny bar',
    text: 'Pyszne menu cateringowe, bar z szerokim asortymentem oraz profesjonalna obsługa.',
    icon: CheckCircle2,
    color: 'text-amber-400',
  },
  {
    title: 'Lokalizacja blisko centrum',
    text: 'Doskonały dojazd oraz ogromny, bezpłatny parking tuż przy budynku naszego lokalu.',
    icon: CheckCircle2,
    color: 'text-emerald-400',
  },
  {
    title: 'Sprawdzeni partnerzy',
    text: 'Współpracujemy tylko ze sprawdzonymi partnerami — usługi na najwyższym poziomie.',
    icon: CheckCircle2,
    color: 'text-cyan-400',
  },
  {
    title: 'Pełna elastyczność',
    text: 'Dostosowujemy się do oczekiwań nawet najbardziej wymagających klientów.',
    icon: CheckCircle2,
    color: 'text-pink-400',
  },
  {
    title: 'Aktywny i niebanalny czas',
    text: 'Świetna zabawa, aktywny sposób spędzania czasu wolnego i profesjonalna obsługa.',
    icon: CheckCircle2,
    color: 'text-orange-400',
  },
  {
    title: 'Niezapomniane przeżycie',
    text: 'Dla Was staniemy na głowie — każde spotkanie w Gravitacji będzie niezapomnianym przeżyciem.',
    icon: Medal,
    color: 'text-rose-400',
  },
] as const;

interface ForCompaniesDescriptionProps {
  onScrollToVoucher: () => void;
}

export default function ForCompaniesDescription({ onScrollToVoucher }: ForCompaniesDescriptionProps) {
  return (
    <section className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">Poznaj nas bliżej</span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Oferta, która robi <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">wrażenie</span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium max-w-xs">
          Kompleksowa organizacja wydarzeń firmowych — od prezentacji po turnieje i banchety.
        </p>
      </div>

      {/* Intro paragraph */}
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl">
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Centrum Rozrywki Gravitacja to idealne miejsce na organizację różnego rodzaju imprez firmowych.
          Dysponujemy salą wyposażoną w <span className="text-cyan-300 font-bold">projektor oraz ekran</span>, które umożliwiają
          przeprowadzenie szkoleń, prezentacji, spotkań biznesowych i konferencji, a atrakcje, które zapewniamy,
          będą idealnym dopełnieniem tych spotkań, które będziecie Państwo długo wspominać.
        </p>
      </div>

      {/* Benefit tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {DESCRIPTION_POINTS.map((point) => {
          const Icon = point.icon;
          return (
            <motion.div
              key={point.title}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur-lg flex flex-col gap-2.5 transition-colors hover:border-cyan-500/30"
            >
              <Icon className={`w-5 h-5 ${point.color}`} />
              <h3 className="text-xs font-black uppercase text-white tracking-wide">{point.title}</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{point.text}</p>
            </motion.div>
          );
        })}

        {/* Vouchers teaser tile */}
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onScrollToVoucher}
          className="rounded-2xl p-4 bg-gradient-to-br from-rose-500/15 to-purple-600/15 border border-pink-500/30 backdrop-blur-lg flex flex-col gap-2.5 text-left cursor-pointer hover:border-pink-500/50 transition-colors group"
        >
          <ArrowDown className="w-5 h-5 text-pink-400 group-hover:translate-y-0.5 transition-transform" />
          <h3 className="text-xs font-black uppercase text-white tracking-wide">Vouchery dla pracowników</h3>
          <p className="text-[11px] text-pink-200/90 font-medium leading-relaxed">
            Kręgle, bilard i vouchery kwotowe na wszystkie atrakcje — idealny upominek na Mikołajki i święta.
          </p>
        </motion.button>
      </div>

      {/* Closing statement */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-600/15 via-pink-600/10 to-cyan-600/15 border border-purple-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.25)]">
        <div className="absolute -top-8 -left-8 w-40 h-40 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 hidden sm:flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/25 to-purple-600/25 border border-pink-500/40 text-pink-400 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-sm sm:text-lg font-black text-white leading-snug">
            Wybierz nas, a Twoi pracownicy i kontrahenci
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-pink-400 to-purple-400"> długo będą wspominać</span>
            spotkanie w Gravitacji.
          </p>
        </div>
      </div>
    </section>
  );
}