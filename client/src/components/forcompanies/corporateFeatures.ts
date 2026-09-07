import { Presentation, Crown, Martini, CarFront } from 'lucide-react';

export const CORPORATE_FEATURES = [
  {
    id: 'szkolenia',
    title: 'Szkolenia i Konferencje',
    subtitle: 'Sala z projektorem i ekranem',
    description:
      'Sala wyposażona w projektor oraz ekran — idealna do szkoleń, prezentacji, spotkań biznesowych i konferencji. Nasze atrakcje będą idealnym dopełnieniem spotkań, które będziecie Państwo długo wspominać.',
    icon: Presentation,
    color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30 text-cyan-400',
  },
  {
    id: 'vip-room',
    title: 'VIP ROOM',
    subtitle: 'Kameralne spotkania do 15 osób',
    description:
      'Na mniejsze spotkania proponujemy 15-osobowy VIP ROOM — prywatna przestrzeń z indywidualną obsługą, idealna na spotkania zarządu, negocjacje i kameralne integracje.',
    icon: Crown,
    color: 'from-purple-500/20 to-pink-600/20 border-purple-500/30 text-purple-300',
  },
  {
    id: 'catering',
    title: 'Catering & Bar',
    subtitle: 'Profesjonalny bar i menu cateringowe',
    description:
      'Zapewniamy pyszne menu cateringowe, bar z szerokim asortymentem oraz profesjonalną obsługę. Współpracujemy tylko ze sprawdzonymi partnerami, dlatego nasze usługi świadczymy na najwyższym poziomie.',
    icon: Martini,
    color: 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-400',
  },
  {
    id: 'parking',
    title: 'Parking i Lokalizacja',
    subtitle: 'Blisko centrum, ogromny bezpłatny parking',
    description:
      'Naszym atutem jest lokalizacja blisko centrum miasta, zapewniająca doskonały dojazd, a także ogromny, bezpłatny parking tuż przy budynku, w którym znajduje się nasz lokal.',
    icon: CarFront,
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
  },
] as const;