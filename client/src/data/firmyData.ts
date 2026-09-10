import {
  Warehouse,
  MapPin,
  Grid3X3,
  Table2,
  Presentation,
  Martini,
  Crown,
  Utensils,
  Music,
  type LucideIcon,
} from 'lucide-react';

/**
 * Oferta współpracy z firmami (imprezy integracyjne, szkolenia, ligi) — lokalizacja
 * JAWORZNO (strona /jaworzno/firmy).
 *
 * Dane są celowo wydzielone pod nazwą JAWORZNO_FIRMY_* i renderowane wyłącznie przez
 * ForCompaniesPage dla validSlug === 'jaworzno', więc nigdy nie wyświetlają się
 * w innych lokalizacjach (Katowice / Poznań).
 */

export interface FirmyBannerSection {
  badge: string;
  title: string;
  subtitle: string;
}

export interface FirmyIntroSection {
  badge: string;
  paragraphs: string[];
}

export interface FirmyDescriptionSection {
  eyebrow: string;
  title: string;
  highlight: string;
  text: string;
  chips: { label: string; value: string }[];
}

export interface FirmyAtut {
  id: string;
  title: string;
  text: string;
  icon: LucideIcon;
  color: string;
  glow: string;
}

export interface FirmySummarySection {
  text: string;
}

export interface FirmyVideoSection {
  /** ID filmu z serwisu YouTube (do podmiany na oficjalny spot Grawitacji Jaworzno). */
  videoId: string;
  title: string;
  description: string;
}

export interface FirmyVoucherSection {
  badge: string;
  title: string;
  text: string;
  cta: string;
}

/** Boczny baner strony — dokładnie wg treści strony z lokalu Jaworzno. */
export const JAWORZNO_FIRMY_BANNER: FirmyBannerSection = {
  badge: 'DLA FIRM',
  title: 'DLA FIRM',
  subtitle: 'IMPREZY INTEGRACYJNE, SZKOLENIA, LIGI...',
};

/** Wstęp — trzy pytania otwierające stronę. */
export const JAWORZNO_FIRMY_INTRO: FirmyIntroSection = {
  badge: 'Dla Firm • Grawitacja Jaworzno',
  paragraphs: [
    'Szukasz ciekawego miejsca na imprezę firmową?',
    'Chcesz niebanalnie i interesująco spędzić czas ze współpracownikami?',
    'Poszukujesz firmy na aktywne wykorzystanie czasu razem?',
  ],
};

/** Opis sekcji — „Mamy dla Ciebie idealne miejsce!". */
export const JAWORZNO_FIRMY_DESCRIPTION: FirmyDescriptionSection = {
  eyebrow: 'Poznaj nas bliżej',
  title: 'Mamy dla Ciebie idealne miejsce!',
  highlight: 'idealne miejsce!',
  text: 'Centrum Rozrywki Gravitacja to idealne miejsce na organizację różnego rodzaju imprez firmowych.',
  chips: [
    { label: 'Kręgle', value: '8 torów' },
    { label: 'Bilard', value: '4 stoły' },
    { label: 'Szkolenia', value: 'projektor + ekran' },
    { label: 'Strefa VIP', value: 'VIP Room' },
  ],
};

/** Atuty lokalu (Nasze atuty) — 9 punktów wg oferty Jaworzno. */
export const JAWORZNO_FIRMY_ATUTY: FirmyAtut[] = [
  {
    id: 'przestronny-klub',
    title: 'Duży, przestronny klub',
    text: 'Duży, przestronny klub — komfortowa przestrzeń dla całej ekipy firmy.',
    icon: Warehouse,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
  },
  {
    id: 'centrum-jaworzna',
    title: 'Ścisłe centrum Jaworzna',
    text: 'Lokalizacja w ścisłym centrum Jaworzna — łatwy dojazd dla wszystkich uczestników.',
    icon: MapPin,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'osiem-torow-bowlingowych',
    title: '8 torów bowlingowych',
    text: 'Osiem torów bowlingowych — sportowa rywalizacja i świetna zabawa zespołowa.',
    icon: Grid3X3,
    color: 'text-red-400 border-red-500/30 bg-red-500/10',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',
  },
  {
    id: 'cztery-stoly-bilardowe',
    title: '4 stoły bilardowe',
    text: 'Cztery stoły bilardowe — klasyczna rozrywka pomiędzy rundami spotkania.',
    icon: Table2,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
  },
  {
    id: 'sala-z-projektorem',
    title: 'Sala z projektorem i ekranem',
    text: 'Sala wyposażona w projektor oraz ekran — szkolenia, prezentacje, spotkania biznesowe i konferencje.',
    icon: Presentation,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
  },
{
    id: 'bar',
    title: 'Bar z szerokim asortymentem',
    text: 'Bar z szerokim asortymentem — coś dla każdego uczestnika spotkania.',
    icon: Martini,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.25)]',
  },
  {
    id: 'vip-room',
    title: 'VIP Room',
    text: 'Dedykowany VIP Room — kameralna strefa dla zarządu i ważnych gości.',
    icon: Crown,
    color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10',
    glow: 'shadow-[0_0_20px_rgba(217,70,239,0.25)]',
  },
  {
    id: 'catering',
    title: 'Możliwość zamówienia cateringu',
    text: 'Możliwość zamówienia cateringu — obsługa gastronomiczna bez wychodzenia z klubu.',
    icon: Utensils,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.25)]',
  },
  {
    id: 'parkiet-z-dj',
    title: 'Parkiet z oprawą muzyczną DJ',
    text: 'Część rozrywkowa z parkietem, gdzie o oprawę muzyczną spotkania zadbają najlepsi DJ-e.',
    icon: Music,
    color: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.25)]',
  },
];

/** Podsumowanie sekcji atutów. */
export const JAWORZNO_FIRMY_SUMMARY: FirmySummarySection = {
  text: 'Zapewniamy fachową obsługę, interesujące zorganizowanie czasu spotkania, dostosowanie się do Państwa indywidualnych życzeń.',
};

/** Integral video — YouTube embed (płytka, bez autoodtwarzania i listy rekomendacji). */
export const JAWORZNO_FIRMY_VIDEO: FirmyVideoSection = {
  videoId: 'lcuCLrGUYIw',
  title: 'Zobacz Grawitację w akcji',
  description:
    'Zobacz, jak wygląda nasz klub: tory bowlingowe, stoły bilardowe, salon gier oraz strefa imprez firmowych.',
};

/** Blok voucherów — wyróżniona karta z przyciskiem „Zapytaj o voucher”. */
export const JAWORZNO_FIRMY_VOUCHER: FirmyVoucherSection = {
  badge: 'Voucher Firmowy',
  title: 'Chcesz docenić pracowników? Zrobić wyjątkowy prezent?',
  text: 'W swojej ofercie posiadamy vouchery do wykorzystania na wszystkie usługi istniejące w Centrum Rozrywki Gravitacja. Dajemy Państwu możliwość określenia wysokości kwoty vouchera oraz jego przeznaczenia.',
  cta: 'Zapytaj o voucher',
};

/**
 * Zbiór wszystkich danych oferty dla firm w lokalu Jaworzno —
 * wygodny pojedynczy import dla stron / komponentów.
 */
export const JAWORZNO_FIRMY_OFFER = {
  locationSlug: 'jaworzno' as const,
  banner: JAWORZNO_FIRMY_BANNER,
  intro: JAWORZNO_FIRMY_INTRO,
  description: JAWORZNO_FIRMY_DESCRIPTION,
  atuty: JAWORZNO_FIRMY_ATUTY,
  summary: JAWORZNO_FIRMY_SUMMARY,
  video: JAWORZNO_FIRMY_VIDEO,
  voucher: JAWORZNO_FIRMY_VOUCHER,
};