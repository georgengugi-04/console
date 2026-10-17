"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dur, ease } from "./tokens";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p";
};

/** Scroll-triggered entrance. Fires once; content is fully visible if JS/motion is unavailable after hydration. */
export function Reveal({ children, delay = 0, y = 28, className, as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: dur.base, delay, ease: ease.out }}
    >
      {children}
    </Tag>
  );
}
