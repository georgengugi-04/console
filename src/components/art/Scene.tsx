import Image from "next/image";
import { photos, type SceneName } from "@/content/imagery";

/**
 * Original illustrated scenery used as section imagery and backgrounds. Drawn with the theme tokens, so it recolours
 * in light/dark automatically. Decorative (aria-hidden) unless a real photo with alt text is mapped in content/imagery.ts.
 */
const Hills = () => (
  <>
    <circle cx="1210" cy="170" r="120" className="fill-accent" opacity="0.18" />
    <circle cx="1210" cy="170" r="68" className="fill-accent" opacity="0.6" />
    <path d="M0 400 C180 330 340 350 520 380 C720 415 860 300 1060 320 C1260 340 1420 400 1600 350 V640 H0Z" className="fill-swoosh-b" opacity="0.28" />
    <path d="M0 470 C200 400 380 440 580 450 C800 462 980 380 1200 410 C1380 436 1500 470 1600 440 V640 H0Z" className="fill-swoosh-a" opacity="0.34" />
    <path d="M0 540 C240 500 420 540 700 530 C980 520 1200 480 1600 520 V640 H0Z" className="fill-brand" opacity="0.5" />
  </>
);

const Tree = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} className="fill-brand">
    <rect x="-6" y="-10" width="12" height="70" rx="3" />
    <circle cx="0" cy="-48" r="46" opacity="0.92" />
    <circle cx="-38" cy="-24" r="32" opacity="0.85" />
    <circle cx="38" cy="-24" r="32" opacity="0.85" />
  </g>
);

const House = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-90" y="-90" width="180" height="110" rx="6" className="fill-surface stroke-brand" strokeWidth="5" />
    <path d="M-110 -86 L0 -170 L110 -86 Z" className="fill-brand" />
    <rect x="-18" y="-50" width="36" height="70" rx="4" className="fill-brand" />
    <rect x="-70" y="-62" width="34" height="34" rx="4" className="fill-accent" />
    <rect x="36" y="-62" width="34" height="34" rx="4" className="fill-accent" />
    <rect x="80" y="-150" width="22" height="50" className="fill-brand" />
  </g>
);

const Car = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-150 0 L-136 -52 Q-130 -66 -112 -66 H-60 L-30 -108 Q-22 -118 -6 -118 H70 Q86 -118 94 -104 L120 -66 H136 Q150 -66 150 -50 V0 Z" className="fill-brand" />
    <path d="M-44 -66 L-20 -98 H62 L84 -66 Z" className="fill-surface" opacity="0.9" />
    <circle cx="-86" cy="2" r="30" className="fill-fg" />
    <circle cx="86" cy="2" r="30" className="fill-fg" />
    <circle cx="-86" cy="2" r="12" className="fill-surface" />
    <circle cx="86" cy="2" r="12" className="fill-surface" />
  </g>
);

const Person = ({ x, y, s = 1, tone = "fill-brand" }: { x: number; y: number; s?: number; tone?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} className={tone}>
    <circle cx="0" cy="-98" r="20" />
    <path d="M-26 0 V-52 Q-26 -74 0 -74 Q26 -74 26 -52 V0 Z" />
  </g>
);

export function SceneArt({ name }: { name: SceneName }) {
  return (
    <>
      <Hills />
      {name === "land" && <Tree x={1500} y={500} s={0.7} />}
      {name === "hills" && (
        <>
          <Tree x={1180} y={470} s={1.3} />
          <Tree x={1500} y={520} s={0.8} />
          <House x={1380} y={500} />
        </>
      )}
      {name === "home" && (
        <>
          <House x={1230} y={500} />
          <Tree x={1480} y={510} s={0.9} />
          <Tree x={1010} y={520} s={0.7} />
          <path d="M1110 524 H1370" className="stroke-brand" strokeWidth="5" strokeDasharray="14 12" opacity="0.5" />
        </>
      )}
      {name === "road" && (
        <>
          <path d="M-40 640 C300 560 760 540 1100 500 C1300 478 1500 470 1660 480 V560 C1480 552 1280 560 1060 590 C760 630 300 650 160 700 Z" className="fill-fg-2" opacity="0.4" />
          <path d="M60 636 C340 584 760 566 1100 534 C1300 516 1480 512 1620 520" className="stroke-surface" strokeWidth="5" strokeDasharray="30 26" fill="none" opacity="0.85" />
          <Car x={1180} y={500} />
          <Tree x={1500} y={470} s={0.8} />
        </>
      )}
      {name === "family" && (
        <>
          <Tree x={1500} y={500} s={1.1} />
          <Person x={1150} y={540} s={1.6} />
          <Person x={1230} y={540} s={1.45} tone="fill-swoosh-a" />
          <Person x={1310} y={540} s={0.95} tone="fill-accent" />
        </>
      )}
      {name === "health" && (
        <>
          <g transform="translate(1250 510)">
            <rect x="-120" y="-190" width="240" height="190" rx="8" className="fill-surface stroke-brand" strokeWidth="5" />
            <rect x="-14" y="-160" width="28" height="84" rx="4" className="fill-brand" />
            <rect x="-42" y="-132" width="84" height="28" rx="4" className="fill-brand" />
            <rect x="-24" y="-52" width="48" height="52" rx="4" className="fill-brand" />
            <rect x="-96" y="-60" width="34" height="34" rx="4" className="fill-accent" />
            <rect x="62" y="-60" width="34" height="34" rx="4" className="fill-accent" />
          </g>
          <path d="M930 520 H1030 L1060 470 L1100 560 L1135 500 H1100" className="stroke-brand" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
          <Tree x={1510} y={510} s={0.8} />
        </>
      )}
    </>
  );
}

type Props = {
  name: SceneName;
  className?: string;
  /** "backdrop": fades toward the left so text on top stays clear. "frame": a self-contained picture. */
  mode?: "backdrop" | "frame";
};

export function Scene({ name, className = "", mode = "frame" }: Props) {
  const photo = photos[name];
  const fade = mode === "backdrop" ? "[mask-image:linear-gradient(to_right,transparent_28%,#000_72%)]" : "";
  return (
    <div
      aria-hidden={photo ? undefined : true}
      className={`overflow-hidden ${mode === "frame" ? "bg-gradient-to-b from-page to-sunken" : ""} ${className}`}
    >
      {photo ? (
        <>
          <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className={`object-cover ${fade}`} />
          <div className="absolute inset-0 bg-page/20" />
        </>
      ) : (
        <svg viewBox="0 0 1600 640" preserveAspectRatio="xMaxYMax slice" className={`absolute inset-0 h-full w-full ${fade}`}>
          <SceneArt name={name} />
        </svg>
      )}
    </div>
  );
}
