"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = { children: ReactNode; strength?: number; className?: string };

/**
 * Restrained magnetic pull (pattern adapted from ReactBits "Magnet").
 * Only active for fine pointers (mouse/trackpad) and when reduced motion is off;
 * on touch devices it renders its children untouched, so nothing depends on hover.
 */
export function Magnetic({ children, strength = 0.28, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const enabled = !reduce;

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={enabled ? { x: sx, y: sy } : undefined}
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
