export interface OpeningHour {
  day: string;
  time: string;
  highlight?: boolean;
  color?: string;
}

export interface LocationItem {
  id: string;
  name: string;
  mall: string;
  address: string;
  desc: string;
  glow: string;
  lanes: string;
  uvLanes?: string;
  glowZone?: string;
  glowTags?: string[];
  zones: string;
  phone: string;
  phoneClean: string;
  hours: OpeningHour[];
}

export interface Promotion {
  id: string;
  title: string;
  tag: string;
  price: string;
  time: string;
  description: string;
  badgeColor: string;
  locationId?: string;
}

export interface NavigationLink {
  id: string;
  label: string;
  href?: string;
}

export interface FooterLinkItem {
  title: string;
  subtitle?: string;
  href?: string;
}

export interface FooterSection {
  title: string;
  icon: string;
  items: FooterLinkItem[];
}
