export default function Logo({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle — earthy gradient */}
      <circle cx="24" cy="24" r="24" fill="url(#ecoBg)" />

      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 10;
        const y1 = 24 + Math.sin(rad) * 10;
        const x2 = 24 + Math.cos(rad) * 14;
        const y2 = 24 + Math.sin(rad) * 14;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        );
      })}

      {/* Sun circle */}
      <circle cx="24" cy="24" r="7" fill="rgba(255,255,255,0.2)" />
      <circle cx="24" cy="24" r="5" fill="rgba(255,255,255,0.35)" />

      {/* Earth / ground arc */}
      <path
        d="M10 34 Q24 28 38 34"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Stem */}
      <line
        x1="24" y1="34"
        x2="24" y2="26"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Left leaf */}
      <path
        d="M24 30 C20 28 17 24 19 21 C21 24 22 27 24 30Z"
        fill="white"
        fillOpacity="0.9"
      />

      {/* Right leaf */}
      <path
        d="M24 28 C28 26 31 22 29 19 C27 22 26 25 24 28Z"
        fill="white"
        fillOpacity="0.75"
      />

      {/* Sprout tip */}
      <circle cx="24" cy="25.5" r="1.2" fill="white" />

      <defs>
        <linearGradient id="ecoBg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
    </svg>
  );
}
