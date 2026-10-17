"use client";

import { motion, useReducedMotion } from "motion/react";
import { dur, ease } from "./tokens";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  /** "mount" animates on load (hero); "view" animates when scrolled into view */
  trigger?: "mount" | "view";
  as?: "span" | "div" | "p";
};

/**
 * Masked word-by-word reveal (pattern adapted from ReactBits "Split Text").
 * Accessibility: the complete sentence is rendered once as visually-hidden text, and the animated word
 * fragments are aria-hidden, so screen readers read a single natural sentence and headings keep a name.
 */
export function SplitText({ text, className, delay = 0, trigger = "mount", as = "span" }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Tag = motion[as];
  const animateProps =
    trigger === "mount"
      ? { animate: "show" as const }
      : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <>
      <span className="sr-only">{text}</span>
      <Tag
        aria-hidden
        className={className}
        initial="hidden"
        {...animateProps}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
                show: { y: 0, opacity: 1, transition: { duration: dur.scene, ease: ease.out } },
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </Tag>
    </>
  );
}
