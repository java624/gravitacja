import type { MenuItem } from '../../lib/supabase/menuService';

/**
 * Single-style neon SVG illustrations for the Katowice menu.
 * Every item maps to a real-product archetype (pizza, zapiekanka, fries,
 * pint of beer, cocktail, whisky glass, coffee, soft drink...), all drawn
 * with one visual language: dark scene + neon stroke + soft glow.
 */

const FOOD = '#f59e0b';
const FOOD_A = '#fbbf24';
const RED = '#f43f5e';
const CREAM = '#f8fafc';

/** Neon drop-shadow glow applied to strokes. */
const P = (c: string) => ({ filter: `drop-shadow(0 0 3px ${c})` } as const);

function hueFor(id: string): string {
  if (id.startsWith('pizza')) return '#f59e0b';
  if (id.startsWith('snack')) return '#fbbf24';
  if (id.startsWith('drink') || id.startsWith('coffee')) return '#06b6d4';
  if (id.startsWith('beer')) return '#fbbf24';
  if (id.startsWith('alko')) return '#a855f7';
  if (id.startsWith('cocktail') || id.startsWith('shots')) return '#ec4899';
  if (id.startsWith('zestaw')) return '#a855f7';
  return '#f59e0b';
}

function scene(color: string, inner: React.ReactNode) {
  return (
    <svg viewBox="0 0 220 150" className="w-full h-full" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="220" height="150" fill="#0b1220" rx="16" />
      <rect x="1.5" y="1.5" width="217" height="147" rx="14" fill="none" stroke={color} strokeOpacity="0.55" strokeWidth="2" style={P(color)} />
      {/* layered ambient glow (radial) */}
      <circle cx="110" cy="56" r="70" fill={color} fillOpacity="0.14" />
      <circle cx="110" cy="112" r="44" fill={color} fillOpacity="0.10" />
      {inner}
    </svg>
  );
}

const floorShadow = (
  <ellipse cx="110" cy="140" rx="52" ry="6" fill="#000" fillOpacity="0.55" />
);

export default function MenuItemArt(item: MenuItem) {
  const color = hueFor(item.id);
  const desc = (item.description || '').toLowerCase();

  // ---------- SNACKI & PRZEKĄSKI ----------
  if (item.id === 'snack-1') {
    return scene(color, (
      <g>
        <path d="M84 46 q12 -4 20 -8 q22 4 24 34 q-6 16 -10 14 q-18 2 -20 22 Z" fill="none" stroke="#22c55e" strokeWidth="3" style={P('#22c55e')} />
        <path d="M140 40 q10 -4 16 -6 q18 6 20 30 q-6 14 -8 12 q-14 2 -16 20 Z" fill="none" stroke="#22c55e" strokeWidth="3" />
        <circle cx="96" cy="72" r="2.6" fill={FOOD_A} />
        <circle cx="126" cy="90" r="2.6" fill={FOOD_A} />
        <circle cx="108" cy="104" r="2.6" fill={FOOD_A} />
        {floorShadow}
      </g>
    ));
  }
  if (item.id === 'snack-2') {
    return scene(color, (
      <g>
        <g transform="rotate(14 108 92)">
          <rect x="96" y="46" width="9" height="86" rx="4.5" fill="none" stroke={FOOD} strokeWidth="2.5" style={P(FOOD)} />
          <circle cx="100" cy="52" r="4.5" fill={FOOD_A} />
          <circle cx="101" cy="126" r="4.5" fill={FOOD_A} />
        </g>
        <g transform="rotate(-14 118 92)">
          <rect x="116" y="48" width="9" height="84" rx="4.5" fill="none" stroke={FOOD} strokeWidth="2.5" />
          <circle cx="121" cy="54" r="4.5" fill={FOOD_A} />
          <circle cx="119" cy="126" r="4.5" fill={FOOD_A} />
        </g>
        {floorShadow}
      </g>
    ));
  }
  if (item.id === 'snack-3') {
    return scene(color, (
      <g>
        <path d="M72 40 A38 34 0 0 1 34 40 Z" fill="none" stroke={FOOD} strokeWidth="3" style={P(FOOD)} />
        <ellipse cx="110" cy="74" rx="36" ry="13" fill="#d97706" fillOpacity="0.25" />
        <circle cx="96" cy="62" r="4.5" fill={FOOD_A} />
        <circle cx="114" cy="58" r="5" fill={FOOD_A} />
        <circle cx="124" cy="70" r="4.5" fill={FOOD_A} />
        <circle cx="100" cy="76" r="4" fill={FOOD_A} />
        <circle cx="112" cy="70" r="4" fill={FOOD_A} />
        <circle cx="90" cy="70" r="4" fill={FOOD_A} />
        {floorShadow}
      </g>
    ));
  }
  if (item.id === 'snack-4' || item.id === 'snack-5') {
    const salami = item.id === 'snack-5';
    return scene(color, (
      <g>
        <rect x="62" y="70" width="96" height="34" rx="10" fill="none" stroke={FOOD} strokeWidth="3" style={P(FOOD)} />
        <line x1="62" y1="70" x2="158" y2="70" stroke={FOOD_A} strokeWidth="2.5" />
        <rect x="70" y="74" width="80" height="14" rx="5" fill={CREAM} fillOpacity="0.95" />
        {salami ? <circle cx="94" cy="86" r="6" fill={RED} /> : <circle cx="100" cy="86" r="7" fill="#f97316" />}
        {salami ? <circle cx="128" cy="84" r="6" fill={RED} /> : <circle cx="130" cy="88" r="6" fill="#fb923c" />}
        {floorShadow}
      </g>
    ));
  }
  if (item.id === 'snack-6') {
    return scene(color, (
      <g>
        <g transform="rotate(16 110 84)">
          <path d="M80 96 Q112 40 140 96 Z" fill="none" stroke="#eab308" strokeWidth="3" style={P('#eab308')} />
          <path d="M80 96 Q112 48 140 96 Z" fill="none" stroke="#eab308" strokeWidth="3" />
        </g>
        {floorShadow}
      </g>
    ));
  }
  if (item.id === 'snack-7') {
    return scene(color, (
      <g>
        {[88, 100, 112, 124, 136].map((x) => (
          <path key={`f${x}`} d={`M${x} 42 q7 8 0 24 q7 10 0 32 Z`} fill={FOOD_A} stroke={FOOD} strokeWidth="1.5" />
        ))}
        <ellipse cx="76" cy="126" rx="13" ry="8" fill={RED} fillOpacity="0.9" style={P(RED)} />
        {floorShadow}
      </g>
    ));
  }
  if (item.id === 'snack-8' || item.id === 'snack-9') {
    const withFries = item.id === 'snack-9';
    return scene(color, (
      <g>
        <circle cx="92" cy="82" r="16" fill="#eab308" stroke={FOOD} strokeWidth="2.5" style={P(FOOD)} />
        <circle cx="124" cy="78" r="16" fill="#eab308" stroke={FOOD} strokeWidth="2.5" />
        <path d="M86 78 q5 8 0 16 q7 8 0 8 Z" fill={FOOD_A} fillOpacity="0.8" />
        <path d="M118 74 q5 8 0 16 q7 8 0 8 Z" fill={FOOD_A} fillOpacity="0.8" />
        {withFries ? <path d="M150 56 q6 10 0 22 Z" fill={FOOD_A} /> : null}
        {withFries ? <path d="M160 58 q6 10 0 20 Z" fill={FOOD_A} /> : null}
        {floorShadow}
      </g>
    ));
  }

  // ---------- PIZZA ----------
  if (item.category === 'pizza') {
    return pizzaArt(desc);
  }

  // ---------- NAPOJE ZIMNE ----------
  if (item.id.startsWith('drink') || item.category === 'napoje_zimne') {
    return drinkArt(desc);
  }

  // ---------- NAPOJE GORĄCE ----------
  if (item.id.startsWith('coffee') || item.category === 'napoje_gorace') {
    return coffeeArt(desc);
  }

  // ---------- PIWO ----------
  if (item.category === 'piwo') {
    return beerArt(item.id, desc);
  }

  // ---------- ALKOHOLE / COCKTAILS / SHOTS / ZESTAWY ----------
  if (item.category === 'alkohole') return spiritsArt(item.id);
  if (item.category === 'cocktails') return cocktailArt(desc);
  if (item.category === 'shots') return shotsArt();
  if (item.category === 'zestawy') return bottleSetArt(item.id);

  return fallbackArt(color);
}

const GREEN_F = '#10b981';

// ---------- PIZZA (toppings driven by description) ----------
function pizzaArt(desc: string) {
  const salami = desc.includes('salami') || desc.includes('chorizo') || desc.includes('amerykańska');
  const dark = desc.includes('kebab') || desc.includes('dracula') || desc.includes('meksykańska');
  const base = desc.includes('śmietanowy') || desc.includes('carbonara');
  const veg = desc.includes('wegetaria') || desc.includes('funghi') || desc.includes('pieczarki') || desc.includes('warzyw');
  const FR = '#6b4226';
  return scene(FOOD, (
    <g>
      <circle cx="110" cy="86" r="50" fill="#b45309" stroke={FOOD} strokeWidth="3" style={P(FOOD)} />
      <circle cx="110" cy="86" r="40" fill={base ? '#f5f0dc' : '#d9252d'} fillOpacity={base ? 0.95 : 0.88} />
      {base ? null : <circle cx="110" cy="86" r="40" fill="#f43f5e" fillOpacity="0.2" />}
      <circle cx="110" cy="86" r="32" fill={CREAM} fillOpacity="0.9" />
      {veg && <circle cx="102" cy="76" r="8" fill={GREEN_F} />}
      {veg && <circle cx="120" cy="94" r="8" fill="#f97316" />}
      {veg && <circle cx="122" cy="72" r="6" fill="#eab308" />}
      {veg && <circle cx="104" cy="100" r="6" fill={GREEN_F} />}
      {salami && <circle cx="96" cy="80" r="9" fill={RED} />}
      {salami && <circle cx="124" cy="90" r="9" fill={RED} />}
      {salami && <circle cx="112" cy="104" r="8" fill={RED} />}
      {dark && <circle cx="118" cy="72" r="8" fill="#92400e" />}
      {dark && <circle cx="100" cy="100" r="8" fill="#92400e" />}
      {base && <circle cx="112" cy="82" r="8" fill={FR} />}
      {base && <circle cx="102" cy="100" r="7" fill={FR} />}
      {floorShadow}
    </g>
  ));
}

// ---------- NAPOJE ZIMNE ----------
function drinkArt(desc: string) {
  const juice = desc.includes('sok') || desc.includes('cappy') || desc.includes('dzbanek');
  const water = desc.includes('woda') || desc.includes('kinley') || desc.includes('kropla');
  const energy = desc.includes('energ');
  const col = juice ? '#fb923c' : water ? '#38bdf8' : energy ? '#f472b6' : '#22c55e';
  return scene('#06b6d4', (
    <g>
      <rect x="96" y="52" width="50" height="54" rx="18" fill={col} fillOpacity="0.2" stroke="#67e8f9" strokeWidth="2" />
      <path d="M118 30 q6 14 18 26 q-2 10 -6 18 q-8 8 -12 18 Z" fill={RED} fillOpacity="0.9" />
      {juice && <circle cx="122" cy="80" r="4" fill="#fb923c" />}
      {water && <path d="M136 60 q8 -2 6 -4 q0 -6 -4 -8 Z" fill="#38bdf8" fillOpacity="0.8" />}
      {/* bubbles */}
      {!juice && <circle cx="108" cy="72" r="2" fill={col} fillOpacity="0.8" />}
      {!juice && <circle cx="120" cy="84" r="2" fill={col} fillOpacity="0.8" />}
      {!juice && <circle cx="126" cy="66" r="2" fill={col} fillOpacity="0.8" />}
      {!juice && <circle cx="104" cy="92" r="2" fill={col} fillOpacity="0.8" />}
      {floorShadow}
    </g>
  ));
}

// ---------- NAPOJE GORĄCE ----------
function coffeeArt(desc: string) {
  const tea = desc.includes('herbat');
  const CUP = tea ? '#a16207' : '#3b2b24';
  return scene('#06b6d4', (
    <g>
      <rect x="92" y="66" width="52" height="44" rx="14" fill={CUP} fillOpacity="0.85" stroke={CUP} strokeWidth="2.5" />
      <ellipse cx="110" cy="68" rx="24" ry="9" fill={tea ? '#d3a13f' : '#8a5a33'} />
      {!tea && <path d="M100 72 q10 6 14 10 q6 6 10 8 Z" fill="#6b4226" fillOpacity="0.8" />}
      {tea && <path d="M126 72 l3 12 3 -3 3 8 0 -10 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />}
      {!tea && <path d="M58 46 q-12 12 0 8 q10 10 8 16 q8 8 10 12 Z" fill="#8a5a33" fillOpacity="0.85" />}
      {floorShadow}
    </g>
  ));
}

// ---------- PIWO ----------
function beerArt(id: string, desc: string) {
  const wieza = id === 'beer-4' || id === 'beer-5' || desc.includes('wieża');
  const butelka = id === 'beer-6' || desc.includes('butelk');
  return scene('#fbbf24', (
    <g>
      {wieza ? (
        <g>
          <rect x="76" y="34" width="68" height="58" rx="12" fill="#fbbf24" fillOpacity="0.35" stroke="#eab308" strokeWidth="2.5" style={P('#eab308')} />
          <circle cx="90" cy="56" r="7" fill="#fff" fillOpacity="0.9" />
          <circle cx="118" cy="56" r="7" fill="#fff" fillOpacity="0.9" />
          <circle cx="104" cy="74" r="7" fill="#fff" fillOpacity="0.9" />
          <path d="M112 92 q-32 14 -2 30 q32 -12 4 -30 Z" fill="#eab308" fillOpacity="0.4" stroke="#eab308" strokeWidth="2.5" />
        </g>
      ) : butelka ? (
        <g>
          <path d="M104 30 q10 -6 8 -10 q8 0 10 8 q4 18 6 24 q4 12 8 14 q-4 10 -8 12 q-8 0 -8 6 q-14 2 -12 -4 Q104 64 102 58 q6 -8 2 -16 Z" fill="#1d3b0f" fillOpacity="0.9" stroke="#16a34a" strokeWidth="2.5" style={P('#16a34a')} />
          <rect x="106" y="60" width="30" height="30" rx="8" fill="#166534" fillOpacity="0.5" stroke="#15803d" strokeWidth="1.5" />
        </g>
      ) : (
        <g>
          <path d="M88 26 q-18 18 0 40 q16 12 0 18 q12 14 8 30 Z" fill="#fbbf24" fillOpacity="0.45" stroke="#eab308" strokeWidth="3" style={P('#eab308')} />
          <rect x="94" y="58" width="50" height="54" rx="14" fill="#f6c453" fillOpacity="0.4" stroke="#eab308" strokeWidth="2.5" />
          <ellipse cx="102" cy="64" rx="16" ry="10" fill="#fff" fillOpacity="0.95" />
          <path d="M94 54 q12 6 20 6 q10 0 18 -4 q-4 8 -10 10 q-8 4 -16 4 q-8 0 -14 -4 Z" fill="#ffffff" fillOpacity="0.95" />
        </g>
      )}
      {floorShadow}
    </g>
  ));
}

// ---------- ALKOHOLE (whisky / wódka) ----------
function spiritsArt(id: string) {
  const whisky = id === 'alko-3' || id === 'alko-4' || id === 'alko-5';
  const berry = id === 'alko-7' || id === 'alko-8';
  const col = whisky ? '#f59e0b' : berry ? '#be123c' : '#e5e7eb';
  return scene('#a855f7', (
    <g>
      <path d="M92 26 q-18 18 0 42 q14 14 0 18 q10 16 6 30 Z" fill={col} fillOpacity="0.4" stroke={col} strokeWidth="2.5" style={P(col)} />
      <rect x="100" y="62" width="42" height="44" rx="14" fill={col} fillOpacity="0.2" stroke={col} strokeWidth="2" />
      <ellipse cx="114" cy="68" rx="16" ry="9" fill="#fff" fillOpacity="0.5" />
      {whisky && <circle cx="112" cy="80" r="7" fill="#fff" fillOpacity="0.95" />}
      {whisky && <circle cx="122" cy="88" r="5" fill="#fff" fillOpacity="0.95" />}
      {berry && <circle cx="110" cy="84" r="6" fill="#e11d48" />}
      {berry && <circle cx="122" cy="78" r="4" fill="#e11d48" />}
      {!whisky && !berry && <line x1="106" y1="84" x2="148" y2="84" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" />}
      {floorShadow}
    </g>
  ));
}

// ---------- COCKTAILS ----------
function cocktailArt(desc: string) {
  const orange = desc.includes('aperol') || desc.includes('sex on the beach') || desc.includes('long island') || desc.includes('brzoskwiniowy');
  const mojito = desc.includes('mojito');
  const col = mojito ? '#10b981' : desc.includes('whisky sour') ? '#e6a23c' : desc.includes('orgazm') || desc.includes('baileys') ? '#8a5a33' : orange ? '#fb923c' : '#ec4899';
  return scene('#ec4899', (
    <g>
      <path d="M90 24 q-20 16 0 40 q16 12 0 16 q12 16 8 30 Z" fill={col} fillOpacity="0.4" stroke={col} strokeWidth="2.5" style={P(col)} />
      <rect x="100" y="60" width="44" height="48" rx="14" fill={col} fillOpacity="0.22" stroke={col} strokeWidth="2" />
      {mojito && <path d="M108 88 q-10 8 -16 12 q-6 8 -10 10 q8 -8 14 -12 q6 -2 12 -10 Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1.5" />}
      {mojito && <path d="M118 74 q-6 8 -10 10 q6 -2 12 -10 Z" fill="#15803d" />}
      <circle cx="128" cy="82" r="6" fill={mojito ? '#fff' : '#fb923c'} stroke="#f97316" strokeWidth="1.5" />
      {!mojito && <path d="M88 78 q-10 8 -14 12 q-8 8 -10 10 q8 -6 16 -14 Z" fill="#16a34a" />}
      {orange && <circle cx="116" cy="96" r="5" fill="#fff" fillOpacity="0.9" />}
      {floorShadow}
    </g>
  ));
}

// ---------- SHOTS (4 kieliszki) ----------
function shotsArt() {
  const cols = ['#ec4899', '#06b6d4', '#fbbf24', '#a855f7'];
  return scene('#ec4899', (
    <g>
      {[0, 1, 2, 3].map((i) => {
        const x = 58 + i * 34;
        const c = cols[i];
        return (
          <g key={i}>
            <path d={`M${x} 34 q-12 10 0 28 q10 10 0 14 q8 10 4 18 Z`} fill={c} fillOpacity="0.45" stroke={c} strokeWidth="2" style={P(c)} />
            <rect x={x - 7} y={70} width="26" height="26" rx="9" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.8" />
          </g>
        );
      })}
      {floorShadow}
    </g>
  ));
}

// ---------- ZESTAWY (butelka + szklanka) ----------
function bottleSetArt(id: string) {
  const col = id === 'zestaw-1' ? '#e5e7eb' : id === 'zestaw-2' ? '#3b82f6' : '#92400e';
  return scene('#a855f7', (
    <g>
      <circle cx="104" cy="70" r="46" fill={col} fillOpacity="0.1" />
      <path d="M92 30 q12 -8 10 -14 q10 2 12 10 q6 24 10 28 q-4 10 -10 14 q-10 0 -8 8 q-16 2 -12 -6 Q94 64 90 56 q6 -10 2 -26 Z" fill={col} fillOpacity="0.3" stroke={col} strokeWidth="2.5" style={P(col)} />
      <rect x="98" y="52" width="34" height="40" rx="9" fill={col} fillOpacity="0.18" stroke={col} strokeWidth="2" />
      <path d="M150 54 q-14 12 -4 26 q10 10 0 14 q10 12 6 18 q-10 2 -8 -6 q0 -8 -2 -14 Q140 80 148 68 Z" fill={col} fillOpacity="0.28" stroke={col} strokeWidth="2" />
      {floorShadow}
    </g>
  ));
}

// ---------- Fallback (neon plate / glass) ----------
function fallbackArt(color: string) {
  return scene(color, (
    <g>
      <circle cx="110" cy="82" r="34" fill="none" stroke={color} strokeWidth="3" style={P(color)} />
      <circle cx="110" cy="82" r="24" fill={color} fillOpacity="0.2" />
      <path d="M96 86 q10 8 14 8 q8 0 14 -6 q-6 10 -12 12 q-6 2 -14 0 Z" fill={color} fillOpacity="0.25" />
      {floorShadow}
    </g>
  ));
}