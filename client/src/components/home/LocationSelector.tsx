import { motion } from 'framer-motion';
import { LOCATIONS_DATA } from '../../data/locationsData';
import TiltCard from '../TiltCard';

interface LocationSelectorProps {
  onSelectCity: (id: string) => void;
}

export default function LocationSelector({ onSelectCity }: LocationSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto"
    >
      {LOCATIONS_DATA.map((loc) => (
        <TiltCard key={loc.id} loc={loc} onSelect={onSelectCity} />
      ))}
    </motion.div>
  );
}
