export interface LocationItem {
  id: string;
  name: string;
  mall: string;
  address: string;
  desc: string;
  glow: string;
}

export const LOCATIONS: LocationItem[] = [
  {
    id: 'jaworzno',
    name: 'Jaworzno',
    mall: 'Galeria Galena',
    address: 'ul. Bolesława Chrobrego 38',
    desc: 'Галактика розваг z 8 torami do kręgli i strefą VIP.',
    glow: 'rgba(244, 63, 94, 0.4)',
  },
  {
    id: 'katowice',
    name: 'Katowice',
    mall: 'Punkt 44',
    address: 'ul. Gliwicka 44',
    desc: 'Główne centrum kosmiczne: 14 torów, bilard i klub nocny.',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'poznan',
    name: 'Poznań',
    mall: 'Posnania',
    address: 'ul. Pleszewska 1',
    desc: 'Neonowe centrum rozrywki w sercu Poznania.',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
];