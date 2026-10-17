import { SHIELD_PATH, SWOOSH_PATH } from "@/components/brand/Logo";

/**
 * Lightweight, zero-GPU stand-in for the 3D hero. Used (a) as the poster while the 3D chunk loads,
 * (b) when WebGL is unavailable, the device is low-powered, or data-saver is on.
 */
export function ShieldFallback({ className = "" }: { className?: string }) {
  const pillars = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    const h = 8 + (Math.sin(i * 1.7) + Math.sin(i * 0.63 + 1) + 2) * 7;
    return { x: 260 + Math.cos(a) * 205, y: 330 + Math.sin(a) * 52, h };
  });
  return (
    <svg viewBox="0 0 520 520" className={className} role="img" aria-label="Illustration of a protective shield" fill="none">
      <defs>
        <radialGradient id="fb-glow" cx="50%" cy="46%" r="50%">
          <stop offset="0" style={{ stopColor: "var(--color-accent)" }} stopOpacity="0.38" />
          <stop offset="0.6" style={{ stopColor: "var(--color-accent)" }} stopOpacity="0.1" />
          <stop offset="1" style={{ stopColor: "var(--color-accent)" }} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fb-sh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--color-mark-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-mark-b)" }} />
        </linearGradient>
        <linearGradient id="fb-sw" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--color-swoosh-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-swoosh-b)" }} />
        </linearGradient>
        <mask id="fb-cut" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="150">
          <rect x="-20" y="-20" width="140" height="150" fill="#fff" />
          <path d={SWOOSH_PATH} fill="#000" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
        </mask>
      </defs>
      <rect width="520" height="520" fill="url(#fb-glow)" />
      <ellipse cx="260" cy="330" rx="205" ry="52" className="stroke-swoosh-a" strokeOpacity="0.7" />
      <ellipse cx="260" cy="330" rx="262" ry="66" className="stroke-swoosh-a" strokeOpacity="0.3" />
      <g className="stroke-swoosh-a" strokeWidth="3" strokeLinecap="round">
        {pillars.map((p, i) => (
          <line key={i} x1={p.x} x2={p.x} y1={p.y} y2={p.y - p.h} strokeOpacity={0.35 + (p.h / 40) * 0.5} />
        ))}
      </g>
      {/* outer <g> positions the mark; the inner <g> carries the CSS float animation (a CSS transform would
          otherwise replace the SVG transform attribute and throw the shield into the corner) */}
      <g transform="translate(132 60) scale(2.55)">
        <g className="floaty">
          <path d={SHIELD_PATH} stroke="url(#fb-sh)" strokeWidth="10" strokeLinejoin="miter" mask="url(#fb-cut)" />
          <path d={SWOOSH_PATH} fill="url(#fb-sw)" />
        </g>
      </g>
    </svg>
  );
}
