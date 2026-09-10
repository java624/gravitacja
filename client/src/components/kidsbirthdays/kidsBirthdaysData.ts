import {
  Sun,
  Rocket,
  PartyPopper,
  Sparkles,
  Award,
  Users,
  Candy,
  Cookie,
  Apple,
  Cake,
  Croissant,
  Wine,
  type LucideIcon,
} from 'lucide-react';

export interface BirthdayPackagePriceTier {
  label: string;
  price: string;
}

export interface BirthdayPackage {
  id: 'slonce' | 'gravitacja';
  name: string;
  pricePerPerson: string;
  /** Optional weekday/weekend pricing tiers (e.g. Jaworzno). When present they replace the single price in the package card. */
  priceTiers?: BirthdayPackagePriceTier[];
  duration: string;
  minGroup: string;
  tagline: string;
  badge?: string;
  featured: boolean;
  features: string[];
  icon: LucideIcon;
  color: string;
  glow: string;
}

export interface BirthdayExtraOption {
  label: string;
  price: string;
}

export interface BirthdayExtra {
  id: string;
  name: string;
  price: string;
  unit: string;
  desc?: string;
  /** Optional price variants (e.g. Żetony 20/30 szt). When present they replace the single price row. */
  options?: BirthdayExtraOption[];
  icon: LucideIcon;
  color: string;
}

export const BIRTHDAY_PACKAGES: BirthdayPackage[] = [
  {
    id: 'slonce',
    name: 'SŁOŃCE',
    pricePerPerson: '75 zł',
    duration: '1,5h',
    minGroup: 'min. 5 osób',
    tagline: 'Klasyczny zestaw urodzinowy',
    featured: false,
    features: [
      'Zaproszenia dla Gości',
      '1,5 godziny gry w kręgle',
      'Oprawa urodzinowa',
      'Kolorowe drinki bezalkoholowe',
      'Chipsy 45g lub paluszki 100g',
      'Zapiekanka',
      'Sok 0,2l lub napój 0,2l',
      'Obsługa kelnerska',
    ],
    icon: Sun,
    color: 'from-amber-500/25 to-orange-600/25 border-amber-500/40 text-amber-400',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
  },
  {
    id: 'gravitacja',
    name: 'GRAVITACJA',
    pricePerPerson: '85 zł',
    duration: '2h',
    minGroup: 'min. 5 osób',
    tagline: 'Rozszerzony zestaw premium',
    badge: 'Polecany',
    featured: true,
    features: [
      'Zaproszenia dla Gości',
      '2 godziny gry w kręgle',
      'Oprawa urodzinowa',
      'Kolorowe drinki bezalkoholowe',
      'Chipsy 45g lub paluszki 100g',
      'Zapiekanka',
      'Sok 0,4l lub napój 0,4l',
      'Ciastka 100g lub żelki 80g',
      'Obsługa kelnerska',
    ],
    icon: Rocket,
    color: 'from-pink-500/25 to-purple-600/25 border-pink-500/40 text-pink-400',
    glow: 'shadow-[0_0_35px_rgba(236,72,153,0.4)]',
  },
];

export const BIRTHDAY_EXTRAS: BirthdayExtra[] = [
  {
    id: 'szampan-bezalkoholowy',
    name: 'Bezalkoholowy szampan',
    price: '30 zł',
    unit: 'butelka',
    icon: PartyPopper,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    id: 'piniata',
    name: 'Magiczna piniata',
    price: '199 zł',
    unit: 'szt.',
    desc: 'Rozbijanie papierowej kuli z cukierkami',
    icon: Sparkles,
    color: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  },
  {
    id: 'dyplom-gracza',
    name: 'Dyplom gracza',
    price: '10 zł',
    unit: 'szt.',
    icon: Award,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'stolik-rodzicow',
    name: 'Stolik dla rodziców',
    price: '60 zł',
    unit: 'grupa 5 osób',
    desc: 'Kawa, herbata, przekąski',
    icon: Users,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'zelki',
    name: 'Żelki',
    price: '20 zł',
    unit: '240g',
    icon: Candy,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
  {
    id: 'ciastka',
    name: 'Ciastka',
    price: '15 zł',
    unit: '250g',
    icon: Cookie,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  },
  {
    id: 'owoce-sezonowe',
    name: 'Owoce sezonowe',
    price: '35 zł',
    unit: '0,5kg',
    icon: Apple,
    color: 'text-lime-400 border-lime-500/30 bg-lime-500/10',
  },
  {
    id: 'tort',
    name: 'Tort',
    price: 'od 95 zł',
    unit: 'szczegóły w lokalu',
    icon: Cake,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: 'croissant',
    name: 'Croissant czekoladowy',
    price: '8 zł',
    unit: 'szt.',
    icon: Croissant,
    color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  },
  {
    id: 'woda-butelka',
    name: 'Woda / butelka',
    price: '—',
    unit: 'informacja w lokalu',
    icon: Wine,
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
];