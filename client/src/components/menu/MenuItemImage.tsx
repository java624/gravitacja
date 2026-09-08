import { useRef, useState } from 'react';
import { ZoomIn, Sparkles } from 'lucide-react';
import type { MenuItem } from '../../lib/supabase/menuService';
import { MENU_IMAGES } from './menuImages';
import MenuItemArt from './MenuItemArt';

/**
 * Premium product tile:
 *  - real 3D tilt that follows the cursor (rotateX/rotateY via CSS vars)
 *  - a soft "spotlight" glow that tracks the mouse
 *  - diagonal shine sweep across the whole image
 *  - neon gradient halo + inner ring on hover
 *  - central "zoom" badge and corner sparkle glints
 * Falls back to the neon SVG illustration when no photo is mapped.
 */
export default function MenuItemImage({ item }: { item: MenuItem }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const src = MENU_IMAGES[item.id];
  const showPhoto = src && !imgFailed;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
    el.style.setProperty('--rx', `${((0.5 - py) * 9).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * 11).toFixed(2)}deg`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative aspect-[22/15] w-full overflow-hidden rounded-xl bg-[#0b1220] [perspective:900px]"
    >
      {/* Desktop-only cursor spotlight (disabled on touch) */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] hidden md:block opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(251,146,60,0.40), rgba(168,85,247,0.16) 45%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3D tilt layer */}
      <div
        className="absolute inset-0 will-change-transform transition-transform duration-150 ease-out [transform-style:preserve-3d]"
        style={{
          transform: hovered
            ? 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(1.03)'
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
        }}
      >
        {showPhoto ? (
          <img
            src={src}
            alt={item.title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.16]"
          />
        ) : (
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.08]">
            <MenuItemArt {...item} />
          </div>
        )}

        {/* Static unified styling */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950/70 to-transparent" />
      </div>

      {/* Shine sweep */}
      <div className="pointer-events-none absolute inset-0 z-[1] -translate-x-[130%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />

      {/* Neon gradient halo on hover */}
      <div className="pointer-events-none absolute inset-0 z-[2] rounded-xl opacity-0 ring-2 ring-inset ring-transparent transition-all duration-300 group-hover:opacity-100 group-hover:ring-amber-400/70 group-hover:shadow-[inset_0_0_32px_rgba(251,146,60,0.28)]" />
      <div
        className="pointer-events-none absolute -inset-[2px] z-[2] rounded-xl opacity-0 blur-[10px] transition-opacity duration-300 group-hover:opacity-70"
        style={{
          background:
            'linear-gradient(135deg, rgba(251,146,60,0.55), rgba(168,85,247,0.35) 40%, rgba(34,211,238,0.30))',
        }}
      />

      {/* Corner sparkle glints */}
      <Sparkles className="pointer-events-none absolute left-2 top-2 z-[4] h-4 w-4 text-amber-300 opacity-0 transition-all duration-500 group-hover:opacity-80 group-hover:drop-shadow-[0_0_6px_#fbbf24]" />
      <Sparkles className="pointer-events-none absolute bottom-2 right-2 z-[4] h-3.5 w-3.5 text-fuchsia-300 opacity-0 transition-all delay-75 duration-500 group-hover:opacity-80 group-hover:drop-shadow-[0_0_6px_#e879f9]" />

      {/* Central zoom badge */}
      <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md shadow-[0_0_24px_rgba(251,146,60,0.5)]">
          <ZoomIn className="h-3.5 w-3.5 text-amber-300" />
          Powiększ
        </span>
      </div>
    </div>
  );
}