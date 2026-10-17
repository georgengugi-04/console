"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SHIELD_PATH, SWOOSH_PATH } from "@/components/brand/Logo";
import { ease } from "@/components/motion/tokens";
import { hasSeenIntro, markIntroSeen, resetIntro } from "@/lib/introStore";

/**
 * Cinematic first-visit introduction (brief §6).
 * Sequence: quiet dark screen + emblem → blue light sweeps the emblem → wordmark resolves →
 * welcome message → "Enter Experience". Total ≈ 5s; skippable from the first frame (button, Escape, Enter).
 * The page underneath is already rendered and is made `inert` only while the dialog is open.
 */

export const REPLAY_EVENT = "console:replay-intro";

export function IntroGate() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false); // Enter button revealed
  const enterRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    setReady(false);
    markIntroSeen(); // recorded on display → refresh never replays
  }, []);

  // Decide on mount. The inline head script has already set data-intro="pending" for eligible visitors.
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      const pending = document.documentElement.getAttribute("data-intro") === "pending";
      if (pending && !hasSeenIntro()) show();
      // Release the cover one frame later, once the dialog (which has its own opaque background) is mounted.
      inner = requestAnimationFrame(() => document.documentElement.removeAttribute("data-intro"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [show]);

  // Footer "Replay introduction"
  useEffect(() => {
    const onReplay = () => {
      resetIntro();
      show();
    };
    window.addEventListener(REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(REPLAY_EVENT, onReplay);
  }, [show]);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => lastFocus.current?.focus?.({ preventScroll: true }), 50);
  }, []);

  // Timeline: reveal the Enter action; with reduced motion it is available immediately.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setReady(true), reduce ? 0 : 3300);
    return () => window.clearTimeout(t);
  }, [open, reduce]);

  // Inert page + scroll lock + keyboard (focus trap between Skip and Enter)
  useEffect(() => {
    if (!open) return;
    const root = document.getElementById("app-root");
    root?.setAttribute("inert", "");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skipRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const els = [skipRef.current, ready ? enterRef.current : null].filter(Boolean) as HTMLElement[];
        if (els.length === 0) return;
        const first = els[0]!;
        const last = els[els.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root?.removeAttribute("inert");
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, ready, close]);

  useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  const d = (s: number) => (reduce ? 0 : s);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-title"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-page px-6 text-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduce ? 1 : 1.04, filter: reduce ? "none" : "blur(6px)" }}
          transition={{ duration: reduce ? 0.01 : 0.85, ease: ease.inOut }}
        >
          <div className="pointer-events-none absolute inset-0 atmosphere opacity-80" />
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />

          <button
            ref={skipRef}
            onClick={close}
            className="absolute right-5 top-5 rounded-full border border-field-line px-4 py-2 text-sm font-semibold text-fg-2 transition hover:bg-brand-soft hover:text-fg sm:right-8 sm:top-8"
          >
            Skip introduction
          </button>

          {/* Emblem */}
          <div className="relative">
            <svg viewBox="0 0 104 110" className="relative h-36 w-auto sm:h-44" fill="none" aria-hidden>
              <defs>
                <linearGradient id="in-sw" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" style={{ stopColor: "var(--color-swoosh-a)" }} />
                  <stop offset="1" style={{ stopColor: "var(--color-swoosh-b)" }} />
                </linearGradient>
                <linearGradient id="in-sh" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" style={{ stopColor: "var(--color-mark-a)" }} />
                  <stop offset="1" style={{ stopColor: "var(--color-mark-b)" }} />
                </linearGradient>
                <mask id="in-cut" maskUnits="userSpaceOnUse" x="-10" y="-10" width="130" height="130">
                  <rect x="-10" y="-10" width="130" height="130" fill="#fff" />
                  <path d={SWOOSH_PATH} fill="#000" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
                </mask>
                <linearGradient id="in-sweep" gradientUnits="userSpaceOnUse" x1="-40" y1="0" x2="0" y2="0">
                  <stop offset="0" style={{ stopColor: "var(--color-accent)" }} stopOpacity="0" />
                  <stop offset="0.5" style={{ stopColor: "var(--color-page)" }} stopOpacity="0.85" />
                  <stop offset="1" style={{ stopColor: "var(--color-accent)" }} stopOpacity="0" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    values="0 0; 170 0"
                    dur="1.6s"
                    begin="1.1s"
                    fill="freeze"
                  />
                </linearGradient>
              </defs>
              {/* shield outline draws in */}
              <motion.path
                d={SHIELD_PATH}
                stroke="url(#in-sh)"
                strokeWidth="10"
                strokeLinejoin="miter"
                mask="url(#in-cut)"
                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: d(1.4), ease: ease.out }}
              />
              {/* swoosh arrives */}
              <motion.path
                d={SWOOSH_PATH}
                fill="url(#in-sw)"
                initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: d(0.9), delay: d(0.7), ease: ease.out }}
              />
              {/* travelling light across the emblem */}
              {!reduce && (
                <path
                  d={SHIELD_PATH}
                  stroke="url(#in-sweep)"
                  strokeWidth="10"
                  strokeLinejoin="miter"
                  mask="url(#in-cut)"
                  opacity="0.9"
                />
              )}
            </svg>
          </div>

          {/* Wordmark resolves */}
          <motion.div
            className="relative mt-8 flex flex-col items-center"
            initial={{ opacity: reduce ? 1 : 0, filter: reduce ? "none" : "blur(10px)", y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: d(1), delay: d(1.9), ease: ease.out }}
          >
            <span className="font-display text-[clamp(2rem,1.2rem+3vw,3.4rem)] font-semibold leading-none tracking-[-0.03em]">
              CONSOLE
            </span>
            <span className="mt-3 text-[0.8rem] font-semibold tracking-[0.7em] text-brand">INSURANCE</span>
          </motion.div>

          {/* Message */}
          <motion.div
            className="relative mt-10 max-w-xl"
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(0.9), delay: d(2.6), ease: ease.out }}
          >
            <h2 id="intro-title" className="font-display text-xl font-medium tracking-[-0.02em] sm:text-2xl">
              Welcome to CONSOLE Insurance.
            </h2>
            <p className="mt-3 text-base text-fg-2 sm:text-lg">
              Your future deserves thoughtful protection. Let&apos;s explore what matters to you.
            </p>
          </motion.div>

          {/* Enter */}
          <div className="relative mt-10 h-14">
            {ready && (
              <motion.button
                ref={enterRef}
                onClick={close}
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: d(0.6), ease: ease.out }}
                className="beam-border inline-flex min-h-12 items-center gap-2 bg-brand px-8 text-[0.95rem] font-semibold text-brand-fg transition hover:bg-brand-hover"
              >
                Enter Experience
                <span aria-hidden>→</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
