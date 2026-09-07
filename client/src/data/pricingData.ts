export interface PriceSlot {
  id: string;
  dayLabel: string;
  dayShort: string;
  before17: number;
  after17: number;
  isPopular?: boolean;
}

export interface PricingCategoryData {
  id: 'bowling' | 'billiards';
  title: string;
  subtitle: string;
  unitText: string;
  extraNote: string;
  pricing: PriceSlot[];
}

export interface LocationPricing {
  locationId: string;
  locationName: string;
  categories: {
    bowling: PricingCategoryData;
    billiards: PricingCategoryData;
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
    categories: {
      bowling: {
        id: 'bowling',
        title: 'Kręgle',
        subtitle: '8 torów UV • Galeria Galena',
        unitText: 'za 1 godz. gry na 1 torze',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 torze. Obuwie w cenie gry.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 89,
            after17: 119,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 109,
            after17: 159,
            isPopular: true,
          },
          {
            id: 'sat-holidays',
            dayLabel: 'Sobota i Święta',
            dayShort: 'Sob i Święta',
            before17: 139,
            after17: 169,
            isPopular: true,
          },
          {
            id: 'sun',
            dayLabel: 'Niedziela',
            dayShort: 'Ndz',
            before17: 139,
            after17: 159,
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
            before17: 22,
            after17: 28,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 22,
            after17: 32,
          },
          {
            id: 'sat-holidays',
            dayLabel: 'Sobota i Święta',
            dayShort: 'Sob i Święta',
            before17: 28,
            after17: 32,
            isPopular: true,
          },
          {
            id: 'sun',
            dayLabel: 'Niedziela',
            dayShort: 'Ndz',
            before17: 28,
            after17: 28,
          },
        ],
      },
    },
  },
  poznan: {
    locationId: 'poznan',
    locationName: 'Poznań',
    categories: {
      bowling: {
        id: 'bowling',
        title: 'Kręgle',
        subtitle: '10 torów UV • CH Posnania',
        unitText: 'za 1 godz. gry na 1 torze',
        extraNote: 'Podane ceny dotyczą 1 godziny gry na 1 torze. Obuwie specjalistyczne: 4 zł / para.',
        pricing: [
          {
            id: 'mon-thu',
            dayLabel: 'Poniedziałek – Czwartek',
            dayShort: 'Pn - Czw',
            before17: 95,
            after17: 125,
          },
          {
            id: 'fri',
            dayLabel: 'Piątek',
            dayShort: 'Pt',
            before17: 115,
            after17: 169,
            isPopular: true,
          },
          {
            id: 'sat-holidays',
            dayLabel: 'Sobota i Święta',
            dayShort: 'Sob i Święta',
            before17: 145,
            after17: 175,
            isPopular: true,
          },
          {
            id: 'sun',
            dayLabel: 'Niedziela',
            dayShort: 'Ndz',
            before17: 145,
            after17: 165,
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
};

export const KATOWICE_PRICING = PRICING_DATA.katowice;
