"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { children: ReactNode };

/** Cursor-following light on hover (pattern adapted from ReactBits "Spotlight Card"). Pure CSS variables — no re-render per move. */
export function SpotlightCard({ children, className = "", ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`spotlight ${className}`}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
