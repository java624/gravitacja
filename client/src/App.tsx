import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

import { LOCATIONS } from './data/locations';
import Header from './components/Header';
import TiltCard from './components/TiltCard';
import Footer from './components/Footer';
import CosmicBackground from './components/CosmicBackground';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#020308] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black cursor-none">
      
      {/* WebGL Canvas background & Custom Cursor */}
      <CosmicBackground />
      <CustomCursor />

      {/* Floating 3D Graphic Props */}
      <motion.div 
        animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-5 w-24 h-24 bg-gradient-to-tr from-pink-600/20 to-purple-600/30 rounded-full blur-sm border border-pink-500/20 flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(236,72,153,0.3)] pointer-events-none"
      >
        🎳
      </motion.div>

      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-8 w-32 h-32 bg-gradient-to-tr from-cyan-600/20 to-blue-600/30 rounded-full blur-sm border border-cyan-500/20 flex items-center justify-center text-5xl shadow-[0_0_60px_rgba(6,182,212,0.3)] pointer-events-none"
      >
        🎱
      </motion.div>

      <Header selectedCity={selectedCity} onSelectCity={setSelectedCity} />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-center flex-1 flex flex-col justify-center items-center">
        
        {/* Glowing Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-xs font-black tracking-[0.2em] uppercase text-cyan-300 mb-8 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          <Flame className="w-4 h-4 text-pink-500 animate-bounce" />
          <span>NOWY WYMIAR ROZRYWKI • KRĘGLE • BILARD • NIGHT CLUB</span>
        </motion.div>

        {/* Glitch-styled Dynamic Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none select-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
        >
          POCZUJ <br />
          <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
            NEONOWĄ GRAWITACJĘ
          </span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-base md:text-xl max-w-2xl mb-12 font-light leading-relaxed drop-shadow-md"
        >
          Wybierz swoje miasto, aby zanurzyć się w kosmicznym klimacie i zarezerwować tor online.
        </motion.p>

        {/* Interactive 3D Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
        >
          {LOCATIONS.map((loc) => (
            <TiltCard key={loc.id} loc={loc} onSelect={setSelectedCity} />
          ))}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}