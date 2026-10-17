import { useId } from "react";

/**
 * CONSOLE INSURANCE brand marks, implemented as clean scalable SVG.
 * Based on the supplied logo: an open shield with a rising blue swoosh. The swoosh "cuts" the
 * shield outline with a mask, so the mark works on any background without baked-in colours.
 */

export const SHIELD_PATH = "M50 5 L89 17 L89 53 C89 76 71 94 50 105 C29 94 11 76 11 53 L11 17 Z";
export const SWOOSH_PATH = "M3 74 C24 50 58 36 99 32 C72 46 44 62 28 92 C20 86 10 82 3 74 Z";

type SymbolProps = { className?: string; title?: string; decorative?: boolean };

export function LogoSymbol({ className, title = "CONSOLE INSURANCE", decorative = false }: SymbolProps) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 104 110"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      fill="none"
    >
      <defs>
        <linearGradient id={`sw-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1747d6" />
          <stop offset="0.55" stopColor="#2f86ff" />
          <stop offset="1" stopColor="#7cc0ff" />
        </linearGradient>
        <linearGradient id={`sh-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9c9ee" />
        </linearGradient>
        <mask id={`cut-${uid}`} maskUnits="userSpaceOnUse" x="-10" y="-10" width="130" height="130">
          <rect x="-10" y="-10" width="130" height="130" fill="#fff" />
          <path d={SWOOSH_PATH} fill="#000" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
        </mask>
      </defs>
      <path
        d={SHIELD_PATH}
        stroke={`url(#sh-${uid})`}
        strokeWidth="10"
        strokeLinejoin="miter"
        mask={`url(#cut-${uid})`}
      />
      <path d={SWOOSH_PATH} fill={`url(#sw-${uid})`} />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** compact = symbol only (mobile header, favicon-like contexts) */
  variant?: "full" | "compact";
  showTagline?: boolean;
};

export function Logo({ className = "", variant = "full", showTagline = false }: LogoProps) {
  if (variant === "compact") {
    return <LogoSymbol className={`h-9 w-auto ${className}`} />;
  }
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoSymbol decorative className="h-9 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-snow">CONSOLE</span>
        <span className="mt-[0.3rem] text-[0.62rem] font-semibold tracking-[0.5em] text-electric-400">INSURANCE</span>
        {showTagline && (
          <span className="mt-2 text-[0.6rem] tracking-[0.28em] text-steel">YOUR TOMORROW, OUR PRIORITY</span>
        )}
      </span>
      <span className="sr-only">CONSOLE INSURANCE</span>
    </span>
  );
}
