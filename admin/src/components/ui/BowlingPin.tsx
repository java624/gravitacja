interface BowlingPinProps {
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'orange' | 'yellow';
  width?: number | string;
  height?: number | string;
  showCrown?: boolean;
}

export default function BowlingPin({
  className = '',
  glowColor = 'cyan',
  width = 40,
  height = 96,
  showCrown = false,
}: BowlingPinProps) {
  // Glow filter and shadow mappings
  const glowStyles = {
    cyan: 'drop-shadow-[0_0_12px_rgba(6,182,212,0.85)] drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]',
    purple: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.85)] drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]',
    pink: 'drop-shadow-[0_0_12px_rgba(236,72,153,0.85)] drop-shadow-[0_0_25px_rgba(236,72,153,0.4)]',
    orange: 'drop-shadow-[0_0_12px_rgba(249,115,22,0.85)] drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]',
    yellow: 'drop-shadow-[0_0_12px_rgba(234,179,8,0.85)] drop-shadow-[0_0_25px_rgba(234,179,8,0.4)]',
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-all duration-300 ${glowStyles[glowColor]} ${className}`}
    >
      <defs>
        {/* Realistic 3D Body Gradient */}
        <linearGradient id="pinBodyGrad" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#f8fafc" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Specular Highlight Gradient */}
        <linearGradient id="pinSpecGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Red/Orange Neon Neck Stripe Gradient */}
        <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        {/* Gold Crown Gradient */}
        <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Pin Silhouette Clip Path for clean neck stripes */}
        <clipPath id="pinClip">
          <path d="M 50 8 C 61 8, 66 18, 63 42 C 60 62, 57 74, 57 88 C 57 102, 79 135, 79 175 C 79 210, 68 232, 50 232 C 32 232, 21 210, 21 175 C 21 135, 43 102, 43 88 C 43 74, 40 62, 37 42 C 34 18, 39 8, 50 8 Z" />
        </clipPath>
      </defs>

      {/* Main Bowling Pin Realistic Silhouette Body */}
      <path
        d="M 50 8 C 61 8, 66 18, 63 42 C 60 62, 57 74, 57 88 C 57 102, 79 135, 79 175 C 79 210, 68 232, 50 232 C 32 232, 21 210, 21 175 C 21 135, 43 102, 43 88 C 43 74, 40 62, 37 42 C 34 18, 39 8, 50 8 Z"
        fill="url(#pinBodyGrad)"
        stroke="#ffffff"
        strokeWidth="1.5"
      />

      {/* Group clipped to pin body for Neck Stripes & Highlights */}
      <g clipPath="url(#pinClip)">
        {/* Upper Red Stripe */}
        <rect x="20" y="66" width="60" height="9" fill="url(#stripeGrad)" />
        {/* Lower Red Stripe */}
        <rect x="20" y="80" width="60" height="7" fill="url(#stripeGrad)" />

        {/* Outer UV Glow Ring over stripes */}
        <line x1="20" y1="70.5" x2="80" y2="70.5" stroke="#ffedd5" strokeWidth="1" opacity="0.8" />
        <line x1="20" y1="83.5" x2="80" y2="83.5" stroke="#ffedd5" strokeWidth="1" opacity="0.8" />

        {/* Realistic Left Curved Specular Highlight Sweep */}
        <path
          d="M 46 12 C 40 24, 38 45, 42 70 C 45 90, 30 135, 30 175 C 30 195, 34 215, 42 226 C 30 215, 25 195, 25 175 C 25 135, 40 95, 36 70 C 33 45, 36 24, 46 12 Z"
          fill="url(#pinSpecGrad)"
        />

        {/* Head Top Specular Glow Spot */}
        <ellipse cx="46" cy="18" rx="7" ry="4" fill="#ffffff" opacity="0.9" />

        {/* Belly Specular Glow Spot */}
        <ellipse cx="38" cy="165" rx="9" ry="30" fill="url(#pinSpecGrad)" transform="rotate(-10 38 165)" />
      </g>

      {/* Gold Crown (Optional Headpin Feature) */}
      {showCrown && (
        <path
          d="M 40 10 L 44 17 L 50 12 L 56 17 L 60 10 L 58 20 L 42 20 Z"
          fill="url(#crownGrad)"
          stroke="#fef08a"
          strokeWidth="1"
        />
      )}

      {/* Bottom Base Edge Rim Shadow */}
      <ellipse cx="50" cy="230" rx="18" ry="3" fill="#334155" opacity="0.6" />
    </svg>
  );
}
