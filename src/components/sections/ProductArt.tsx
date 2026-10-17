"use client";

import { motion } from "motion/react";
import type { ProductSlug } from "@/content/products";
import { ease } from "@/components/motion/tokens";

/**
 * One bespoke line-art emblem per product — the "distinct visual identity" for each category.
 * Strokes draw in when scrolled into view (Motion pathLength). Decorative only (aria-hidden).
 */
const paths: Record<ProductSlug, { main: string[]; accent: string[] }> = {
  life: {
    main: [
      // two figures sheltering a small one
      "M70 96 a14 14 0 1 0 0.01 0",
      "M130 96 a14 14 0 1 0 0.01 0",
      "M44 190 v-46 a26 26 0 0 1 52 0 v46",
      "M104 190 v-46 a26 26 0 0 1 52 0 v46",
    ],
    accent: ["M100 128 a9 9 0 1 0 0.01 0", "M84 190 v-26 a16 16 0 0 1 32 0 v26"],
  },
  health: {
    main: ["M100 38 C100 38 40 74 40 120 C40 160 74 184 100 190 C126 184 160 160 160 120 C160 74 100 38 100 38 Z"],
    accent: ["M100 92 v56 M72 120 h56", "M52 120 h20 l10 -22 l16 44 l12 -30 l8 8 h30"],
  },
  motor: {
    main: [
      "M28 138 l14 -40 a14 14 0 0 1 13 -9 h90 a14 14 0 0 1 13 9 l14 40 v34 h-26 v-14 h-92 v14 h-26 z",
      "M62 98 h76",
    ],
    accent: ["M60 142 a8 8 0 1 0 0.01 0", "M140 142 a8 8 0 1 0 0.01 0", "M20 60 c40 -30 120 -30 160 0"],
  },
  property: {
    main: ["M30 108 L100 44 L170 108", "M48 94 v84 h104 v-84", "M86 178 v-48 h28 v48"],
    accent: ["M128 62 v-18 h16 v32", "M60 70 c24 -26 56 -26 80 0"],
  },
  business: {
    main: ["M44 178 v-96 h60 v96", "M104 178 v-60 h52 v60", "M30 178 h140"],
    accent: ["M62 102 h24 M62 126 h24 M62 150 h24", "M120 138 h22 M120 158 h22"],
  },
};

export function ProductArt({ slug, accent, className = "" }: { slug: ProductSlug; accent: string; className?: string }) {
  const art = paths[slug];
  return (
    <svg viewBox="0 0 200 220" fill="none" aria-hidden className={className}>
      <motion.g
        stroke="#e8f0ff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18 } } }}
      >
        {art.main.map((d, i) => (
          <motion.path
            key={`m${i}`}
            d={d}
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, ease: ease.out } } }}
          />
        ))}
      </motion.g>
      <motion.g
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } } }}
      >
        {art.accent.map((d, i) => (
          <motion.path
            key={`a${i}`}
            d={d}
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease: ease.out } } }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
