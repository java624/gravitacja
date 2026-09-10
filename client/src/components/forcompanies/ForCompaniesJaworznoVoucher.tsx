import { motion } from 'framer-motion';
import { Gift, ArrowUpRight, Phone, Ticket } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';
import { JAWORZNO_FIRMY_VOUCHER } from '../../data/firmyData';

interface ForCompaniesJaworznoVoucherProps {
  onScrollToForm: () => void;
}

export default function ForCompaniesJaworznoVoucher({ onScrollToForm }: ForCompaniesJaworznoVoucherProps) {
  const jaworzno = LOCATIONS_DATA.find((l) => l.id === 'jaworzno') || LOCATIONS_DATA[0];
  const voucher = JAWORZNO_FIRMY_VOUCHER;

  return (
    <section id="voucher-firmowy-jaworzno" className="scroll-mt-28 text-left">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative rounded-[28px] overflow-hidden p-7 sm:p-10 border border-rose-500/30 bg-gradient-to-br from-purple-950/70 via-rose-950/60 to-amber-950/70 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_45px_rgba(244,63,94,0.35)] group"
      >
        {/* Ambient glows */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-rose-500/25 to-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-amber-500/20 to-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <Gift className="w-3.5 h-3.5" />
              <span>{voucher.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight text-white">
              Chcesz docenić pracowników?
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-red-400 to-amber-400 drop-shadow-[0_0_25px_rgba(244,63,94,0.5)]">
                Zrobić wyjątkowy prezent?
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-2xl">{voucher.text}</p>

            <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-rose-500/20 backdrop-blur-md">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Przeznaczenie</span>
                <span className="text-base font-black text-white">Do wyboru</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-rose-500/20 backdrop-blur-md">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kwota</span>
                <span className="text-base font-black text-rose-300 flex items-center gap-1.5">Określana przez Państwa</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-rose-500/20 backdrop-blur-md">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Zakres</span>
                <span className="text-base font-black text-white flex items-center gap-1.5">Wszystkie usługi <Ticket className="w-4 h-4 text-amber-400" /></span>
              </div>
            </div>
          </div>

          <div className="lg:w-auto shrink-0 flex flex-col items-stretch lg:items-center gap-3">
            <button
              onClick={onScrollToForm}
              className="w-full px-7 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Gift className="w-4 h-4" />
              <span>{voucher.cta}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={`tel:${jaworzno.phoneClean}`}
              className="w-full px-5 py-3 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Phone className="w-4 h-4 text-rose-400" />
              <span>{jaworzno.phone}</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}