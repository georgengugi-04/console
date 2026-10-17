import type { Transition, Variants } from "motion/react";

/**
 * Motion principles (applies site-wide)
 *  1. Motion explains hierarchy or state — it never decorates for its own sake.
 *  2. One easing family: "expo-out" for arrivals, "quart in-out" for cross-screen moves.
 *  3. Durations: micro 0.18s · base 0.6s · scene 0.9s · overlay 0.55s.
 *  4. Only transform/opacity/clip-path are animated (compositor-friendly).
 *  5. <MotionConfig reducedMotion="user"> in the root layout strips transforms for reduced-motion users;
 *     JS-driven effects (pointer tracking, 3D, intro) additionally check the media query themselves.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.76, 0, 0.24, 1] as [number, number, number, number],
};

export const dur = { micro: 0.18, base: 0.6, scene: 0.9, overlay: 0.55 };

export const spring: Transition = { type: "spring", stiffness: 220, damping: 26, mass: 0.7 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.out } },
};

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
