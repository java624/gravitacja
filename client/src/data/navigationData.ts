import type { NavigationLink, FooterSection } from '../types';

export const NAVIGATION_LINKS: NavigationLink[] = [
  { id: 'jaworzno', label: 'Jaworzno' },
  { id: 'katowice', label: 'Katowice' },
  { id: 'poznan', label: 'Poznań' },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Nasze lokale',
    icon: 'MapPin',
    items: [
      { title: 'Jaworzno', subtitle: 'Galeria Galena', href: '#' },
      { title: 'Katowice', subtitle: 'Punkt 44', href: '#' },
      { title: 'Poznań', subtitle: 'Posnania', href: '#' },
    ],
  },
  {
    title: 'Informacje',
    icon: 'ShieldCheck',
    items: [
      { title: 'O nas', href: '#' },
      { title: 'Polityka prywatności', href: '#' },
      { title: 'Regulamin lokalu', href: '#' },
      { title: 'Kontakt & Rezerwacje', href: '#' },
    ],
  },
  {
    title: 'Zasady gry',
    icon: 'Gamepad2',
    items: [
      { title: 'Poradnik gry w kręgle', href: '#' },
      { title: 'Poradnik gry w bilard', href: '#' },
      { title: 'Cennik & Promocje', href: '#' },
      { title: 'Imprezy firmowe', href: '#' },
    ],
  },
];
