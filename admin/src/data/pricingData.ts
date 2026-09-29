export interface PriceSlot {
  id: string;
  dayLabel: string;
  dayShort: string;
  before17: number;
  after17: number;
  isPopular?: boolean;
}

export interface PricingCategoryData {
  id: 'bowling' | 'billiards' | 'dart' | 'karaoke';
  title: string;
  subtitle: string;
  unitText: string;
  extraNote: string;
  pricing: PriceSlot[];
}

export interface LocationPricing {
  locationId: string;
  locationName: string;
  /** Optional heading override shown on the pricing section (e.g. Jaworzno). */
  pageTitle?: string;
  categories: {
    bowling: PricingCategoryData;
    billiards: PricingCategoryData;
    /** Only locations offering darts have this category (currently Jaworzno). */
    dart?: PricingCategoryData;
    /** Only locations offering karaoke have this category (currently Poznań). */
    karaoke?: PricingCategoryData;
  };
}

export const PRICING_DATA: Record<string, LocationPricing> = {
  katowice: {
    locationId: 'katowice',
    locationName: 'Katowice',
    categories: {
      bowling: {
        id: 'bowling',
        title: 'Kręgle',
        subtitle: '14 torów UV • Glow Bowling Zone',
        unitText: 'za 1 godz. gry na 1 torze',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 torze. Wypożyczenie obuwia: 3 zł / para.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 99,
            after17: 129,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 119,
            after17: 179,
            isPopular: true,
          },
          {
            id: 'sat-holidays',
            dayLabel: 'Sobota i Święta',
            dayShort: 'Sob i Święta',
            before17: 149,
            after17: 179,
            isPopular: true,
          },
          {
            id: 'sun',
            dayLabel: 'Niedziela',
            dayShort: 'Ndz',
            before17: 149,
            after17: 169,
          },
        ],
      },
      billiards: {
        id: 'billiards',
        title: 'Bilard',
        subtitle: 'Stoły tournament grade 9ft',
        unitText: 'za 1 godz. gry na 1 stole',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 25,
            after17: 30,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 25,
            after17: 35,
          },
          {
            id: 'sat-holidays',
            dayLabel: 'Sobota i Święta',
            dayShort: 'Sob i Święta',
            before17: 30,
            after17: 35,
            isPopular: true,
          },
          {
            id: 'sun',
            dayLabel: 'Niedziela',
            dayShort: 'Ndz',
            before17: 30,
            after17: 30,
          },
        ],
      },
    },
  },
  jaworzno: {
    locationId: 'jaworzno',
    locationName: 'Jaworzno',
    pageTitle: 'Aktualne Ceny Kręgli i Bilarda',
    categories: {
      bowling: {
        id: 'bowling',
        title: 'Kręgle',
        subtitle: '8 torów UV • Galeria Galena',
        unitText: 'za 1 godz. gry na 1 torze',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 torze. Wypożyczenie obuwia do gry: 3 zł za parę.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 109,
            after17: 119,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 119,
            after17: 159,
            isPopular: true,
          },
          {
            id: 'weekend',
            dayLabel: 'Sobota, Niedziela i Święta',
            dayShort: 'Sob - Nd i Św',
            before17: 149,
            after17: 159,
            isPopular: true,
          },
        ],
      },
      billiards: {
        id: 'billiards',
        title: 'Bilard',
        subtitle: 'Strefa stołów bilardowych 9ft',
        unitText: 'za 1 godz. gry na 1 stole',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 25,
            after17: 30,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 25,
            after17: 35,
          },
          {
            id: 'weekend',
            dayLabel: 'Sobota, Niedziela i Święta',
            dayShort: 'Sob - Nd i Św',
            before17: 30,
            after17: 35,
            isPopular: true,
          },
        ],
      },
      dart: {
        id: 'dart',
        title: 'Dart',
        subtitle: 'Strefa dartowa • rzutki',
        unitText: 'za 1 godz. gry',
        extraNote: 'Podane ceny dotyczą 1 godziny gry w dart.',
        pricing: [
          {
            id: 'all-week',
            dayLabel: 'Poniedziałek – Niedziela i Święta',
            dayShort: 'Pn - Nd i Św',
            before17: 30,
            after17: 30,
          },
        ],
      },
    },
  },
  poznan: {
    locationId: 'poznan',
    locationName: 'Poznań',
    pageTitle: 'Aktualne Ceny Kręgli i Bilarda',
    categories: {
      bowling: {
        id: 'bowling',
        title: 'Kręgle',
        subtitle: 'Torów bowlingowych • CH King Cross Marcelin',
        unitText: 'za 1 godz. gry na 1 torze',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 torze. Wypożyczenie obuwia do gry: 5 zł za parę.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 129,
            after17: 159,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 129,
            after17: 199,
          },
          {
            id: 'sat-holidays',
            dayLabel: 'Sobota i Święta',
            dayShort: 'Sob i Święta',
            before17: 159,
            after17: 199,
            isPopular: true,
          },
          {
            id: 'sun',
            dayLabel: 'Niedziela',
            dayShort: 'Ndz',
            before17: 159,
            after17: 189,
          },
        ],
      },
      billiards: {
        id: 'billiards',
        title: 'Bilard',
        subtitle: 'Strefa Lounge Bilard Bar',
        unitText: 'za 1 godz. gry na 1 stole',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 stole.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 35,
            after17: 40,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 35,
            after17: 50,
          },
          {
            id: 'sat-holidays',
            dayLabel: 'Sobota i Święta',
            dayShort: 'Sob i Święta',
            before17: 45,
            after17: 50,
            isPopular: true,
          },
          {
            id: 'sun',
            dayLabel: 'Niedziela',
            dayShort: 'Ndz',
            before17: 45,
            after17: 50,
          },
        ],
      },
      karaoke: {
        id: 'karaoke',
        title: 'Karaoke',
        subtitle: 'Sala karaoke • śpiew dla każdego',
        unitText: 'za 1 godz. wynajmu sali',
        extraNote: 'Podane ceny dotyczą 1 godziny wynajmu sali karaoke.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 90,
            after17: 90,
          },
          {
            id: 'fri-sun',
            dayLabel: 'Piątek – Niedziela',
            dayShort: 'Pt - Nd',
            before17: 160,
            after17: 160,
            isPopular: true,
          },
        ],
      },
    },
  },
};

export const KATOWICE_PRICING = PRICING_DATA.katowice;
