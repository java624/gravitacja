import {
  Sun,
  Rocket,
  PartyPopper,
  Sparkles,
  Candy,
  Cookie,
  Cake,
  Medal,
  Clapperboard,
  Ticket,
  Coins,
  Coffee,
} from 'lucide-react';
import type { BirthdayPackage, BirthdayExtra } from '../components/kidsbirthdays/kidsBirthdaysData';

/**
 * Oferta urodzinowa dla dzieci — lokalizacja JAWORZNO (strona /jaworzno/dzieci).
 *
 * Dane są celowo wydzielone pod nazwą JAWORZNO_KIDS_* i renderowane wyłącznie przez
 * KidsBirthdaysPage dla validSlug === 'jaworzno', więc pakiety i ceny nigdy nie
 * wyświetlają się w innych lokalizacjach (Katowice / Poznań).
 */

export interface KidsIntroSection {
  badge: string;
  paragraphs: string[];
  cta: string;
  chips: { label: string; value: string }[];
}

export const JAWORZNO_KIDS_INTRO: KidsIntroSection = {
  badge: 'Urodziny dla Dzieci • Jaworzno',
  paragraphs: [
    'Nie masz pomysłu, gdzie zorganizować przyjęcie urodzinowe dla dziecka? W domu nie jesteś w stanie zapewnić im odpowiednich atrakcji, a znudziły Ci się popularne w ostatnich czasach sale zabaw?',
    'Zgłoś się do Gravitacji — zorganizujemy twojemu dziecku niezapomniane urodziny, które koleżanki i koledzy z klasy będą długo wspominać. W Gravitacji zapewnimy atrakcje, które nie pozwolą na nudę.',
  ],
  cta: 'Zapraszamy do zapoznania się z naszą ofertą zestawów urodzinowych dla dzieci.',
  chips: [
    { label: 'Zestawy od', value: '75 zł / os.' },
    { label: 'Gra w kręgle', value: 'do 2h w pakiecie' },
    { label: 'Min. grupa', value: '6 osób' },
  ],
};

export const JAWORZNO_KIDS_PACKAGES: BirthdayPackage[] = [
  {
    id: 'slonce',
    name: 'SŁOŃCE',
    pricePerPerson: '75 zł',
    priceTiers: [
      { label: 'Poniedziałek - Czwartek', price: '75 zł' },
      { label: 'Piątek - Niedziela', price: '85 zł' },
    ],
    duration: '1h',
    minGroup: 'min. 6 osób',
    tagline: 'Klasyczny zestaw urodzinowy',
    featured: false,
    features: [
      'Zaproszenia dla Gości',
      '1 godzina gry w kręgle',
      'Serpentyny i baloniki',
      'Kolorowe drinki bezalkoholowe',
      'Zapiekanka lub frytki',
      'Chipsy 45g lub paluszki 100g',
      'Sok 0,2l lub napój 0,2l',
    ],
    icon: Sun,
    color: 'from-amber-500/25 to-orange-600/25 border-amber-500/40 text-amber-400',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
  },
  {
    id: 'gravitacja',
    name: 'GRAVITACJA',
    pricePerPerson: '85 zł',
    priceTiers: [
      { label: 'Poniedziałek - Czwartek', price: '85 zł' },
      { label: 'Piątek - Niedziela', price: '95 zł' },
    ],
    duration: '2h',
    minGroup: 'min. 6 osób',
    tagline: 'Rozszerzony zestaw premium',
    badge: 'Polecany',
    featured: true,
    features: [
      'Zaproszenia dla Gości',
      '2 godziny gry w kręgle',
      'Serpentyny i baloniki',
      'Kolorowe drinki bezalkoholowe',
      'Zapiekanka lub frytki',
      'Chipsy 45g lub paluszki 100g',
      'Ciastka 100g lub żelki 80g',
      'Sok 0,4l lub napój 0,4l',
    ],
    icon: Rocket,
    color: 'from-pink-500/25 to-purple-600/25 border-pink-500/40 text-pink-400',
    glow: 'shadow-[0_0_35px_rgba(236,72,153,0.4)]',
  },
];

export const JAWORZNO_KIDS_EXTRAS: BirthdayExtra[] = [
  {
    id: 'szampan-bezalkoholowy',
    name: 'Bezalkoholowy szampan',
    price: '30 zł',
    unit: 'butelka',
    icon: PartyPopper,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    id: 'stolik-rodzicow',
    name: 'Stolik dla rodziców',
    price: '60 zł',
    unit: 'do 5 osób',
    desc: 'Kawa, herbata i przekąski dla 5 osób',
    icon: Coffee,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'zelki',
    name: 'Żelki',
    price: '25 zł',
    unit: '240g',
    icon: Candy,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
  {
    id: 'ciastka',
    name: 'Ciastka',
    price: '25 zł',
    unit: '300g',
    icon: Cookie,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  },
  {
    id: 'piniata',
    name: 'Piniata',
    price: '200 zł',
    unit: 'sztuka',
    desc: 'Rozbijanie papierowej, ozdobnej kuli z cukierkami',
    icon: Sparkles,
    color: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
  },
  {
    id: 'medale',
    name: 'Medale',
    price: '20 zł',
    unit: 'sztuka',
    icon: Medal,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'tort',
    name: 'Tort',
    price: '—',
    unit: 'wg cennika tortów',
    icon: Cake,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: 'zabawa-animatorem',
    name: 'Zabawa z animatorem',
    price: '480 zł',
    unit: '1,5h',
    icon: Clapperboard,
    color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
  },
  {
    id: 'zaproszenia',
    name: 'Zaproszenia',
    price: '2 zł',
    unit: 'sztuka',
    icon: Ticket,
    color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  },
  {
    id: 'zetony-na-gry',
    name: 'Żetony na gry',
    price: '60 zł',
    unit: '20 szt (+3 gratis)',
    desc: 'Do wykorzystania w Salonach Gier',
    options: [
      { label: '20 szt (+3 gratis)', price: '60 zł' },
      { label: '30 szt (+5 gratis)', price: '90 zł' },
    ],
    icon: Coins,
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  },
];

/**
 * Zbiór wszystkich danych oferty urodzinowej dla dzieci w lokalu Jaworzno —
 * wygodny pojedynczy import dla stron / komponentów.
 */
export const JAWORZNO_KIDS_OFFER = {
  locationSlug: 'jaworzno' as const,
  intro: JAWORZNO_KIDS_INTRO,
  packages: JAWORZNO_KIDS_PACKAGES,
  extras: JAWORZNO_KIDS_EXTRAS,
  minGroup: 6,
};