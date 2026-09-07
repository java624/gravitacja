import { motion } from 'framer-motion';
import { PartyPopper, Sparkles, Cake, ArrowDown } from 'lucide-react';

interface KidsBirthdaysIntroProps {
  onScrollToPackages: () => void;
  onScrollToForm: () => void;
}

export default function KidsBirthdaysIntro({ onScrollToPackages, onScrollToForm }: KidsBirthdaysIntroProps) {
  return (
    <section className="space-y-8 text-left">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-pink-600/15 via-fuchsia-600/10 to-amber-600/15 border border-pink-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(236,72,153,0.25)]">
        <div className="absolute -top-8 -right-8 w-44 h-44 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 shrink-0 hidden sm:flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/25 to-purple-600/25 border border-pink-500/40 text-pink-400 shadow-inner">
            <PartyPopper className="w-7 h-7" />
          </div>
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              Urodziny, które <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-amber-300 drop-shadow-[0_0_25px_rgba(236,72,153,0.45)]">zapadną w pamięci</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-3xl">
              Zgłoś się do Gravitacji, zorganizujemy twojemu dziecku niezapomniane urodziny, które koleżanki i
              koledzy z klasy będą długo wspominać. W Gravitacji zapewnimy atrakcje, które nie pozwolą na nudę!
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={onScrollToPackages}
                className="px-5 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase text-white bg-gradient-to-r from-pink-600 to-purple-600 shadow-[0_0_25px_rgba(236,72,153,0.5)] flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <Cake className="w-4 h-4" />
                <span>Zestawy urodzinowe</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onScrollToForm}
                className="px-5 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Szybkie zapytanie</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invitation note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative z-10 mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] sm:text-xs text-slate-300 leading-relaxed font-medium"
        >
          <span className="text-pink-300 font-black uppercase tracking-wider mr-1.5">Zapraszamy:</span>
          Zapraszamy do zapoznania się z naszą ofertą zestawów urodzinowych dla dzieci. Każdy pakiet możemy
          dostosować do indywidualnych potrzeb solenizanta i rodziców.

        </motion.div>
      </div>
    </section>
  );
}