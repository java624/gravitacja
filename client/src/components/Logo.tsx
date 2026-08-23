import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative flex flex-col items-start select-none cursor-pointer group z-10"
    >
      {/* М'яке фонове неонове сяйво */}
      <div className="absolute -inset-3 bg-gradient-to-r from-orange-600/30 via-red-600/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />

      {/* Верхній напис: Точка + CENTRUM ROZRYWKI */}
      <div className="flex items-center gap-2 mb-1 pl-0.5">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316] animate-pulse" />
        <span className="text-[11px] font-black tracking-[0.25em] text-orange-500 uppercase drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]">
          CENTRUM ROZRYWKI
        </span>
      </div>

      {/* Головний блок: GR + Векторна V + ITACJA */}
      <div className="flex items-center">
        {/* GR */}
        <span className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
          GR
        </span>

        {/* Векторна точна V з вивіски */}
        <div className="relative mx-0.5 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-600/60 blur-md rounded-full group-hover:bg-orange-500/80 transition-colors" />
          
          <svg
            width="26"
            height="36"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
          >
            {/* Точна геометрія зрізаного гострого клина V */}
            <path
              d="M1 2L11.5 30L23 2H15.5L11.5 20L7.5 2H1Z"
              fill="url(#v-original-grad)"
            />
            <defs>
              <linearGradient id="v-original-grad" x1="12" y1="2" x2="12" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF4500" />
                <stop offset="1" stopColor="#C70000" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ITACJA */}
        <span className="text-3xl md:text-4xl font-black tracking-tight text-white font-sans drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
          ITACJA
        </span>
      </div>
    </motion.div>
  );
}