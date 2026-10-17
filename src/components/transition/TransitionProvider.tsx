"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { LogoSymbol, SHIELD_PATH } from "@/components/brand/Logo";
import { messageForPath } from "@/content/site";
import { dur, ease } from "@/components/motion/tokens";
import { getInternalNavigationTarget } from "@/lib/transitionEligibility";

/**
 * Branded page transitions for the Next.js App Router.
 *
 * How it works (no legacy router events — they don't exist in the App Router):
 *  1. A single capture-phase click listener finds genuine internal navigations (same origin, different
 *     path, left click, no modifier keys, not download/_blank/external, not in-page anchors).
 *  2. It cancels the default navigation, covers the screen with the overlay, THEN calls router.push().
 *  3. When usePathname() changes (the new route has committed) — or a 3s failsafe fires — the overlay
 *     reveals the page and focus moves to <main>.
 *  Back/Forward are handled natively by Next and never intercepted. A `busy` ref ignores repeat clicks.
 *  Reduced motion → the overlay is skipped entirely and navigation is native. Escape dismisses it.
 */

type Phase = "idle" | "cover" | "wait" | "reveal";

const COVER_MS = 520;
const MIN_DWELL_MS = 650;
const FAILSAFE_MS = 3000;

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");
  const [announce, setAnnounce] = useState("");

  const busy = useRef(false);
  const pathRef = useRef(pathname);
  const coverStartedAt = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const finish = useCallback(() => {
    clearTimers();
    setPhase("reveal");
    const t = window.setTimeout(() => {
      busy.current = false;
      setPhase("idle");
      const main = document.getElementById("main");
      main?.focus({ preventScroll: true });
    }, dur.overlay * 1000 + 40);
    timers.current.push(t);
  }, []);

  // New route committed → reveal after a minimum dwell so the message can be read.
  useEffect(() => {
    if (pathname === pathRef.current) return;
    pathRef.current = pathname;
    setAnnounce(`Navigated to ${document.title || pathname}`);
    if (!busy.current) return; // Back/Forward or programmatic navigation — nothing to reveal
    const elapsed = Date.now() - coverStartedAt.current;
    const wait = Math.max(0, MIN_DWELL_MS + COVER_MS - elapsed);
    clearTimers();
    timers.current.push(window.setTimeout(finish, wait));
  }, [pathname, finish]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.("a") ?? null;
      const url = getInternalNavigationTarget(e, anchor, window.location);
      if (!url) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // native navigation

      e.preventDefault();
      e.stopPropagation(); // keep next/link's own handler from also navigating
      if (busy.current) return; // rapid-click guard

      busy.current = true;
      coverStartedAt.current = Date.now();
      setMessage(messageForPath(url.pathname));
      setPhase("cover");

      timers.current.push(
        window.setTimeout(() => {
          setPhase("wait");
          router.push(url.pathname + url.search + url.hash);
        }, COVER_MS),
        window.setTimeout(finish, FAILSAFE_MS),
      );
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && busy.current) finish();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      clearTimers();
    };
  }, [router, finish]);

  const active = phase !== "idle";
  const words = message.split(" ");

  return (
    <>
      {children}
      <div aria-live="polite" role="status" className="sr-only">
        {announce}
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            key="transition-overlay"
            aria-hidden
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-ink-950"
            style={{ willChange: "clip-path" }}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={
              phase === "reveal"
                ? { clipPath: "inset(0% 0% 100% 0%)" }
                : { clipPath: "inset(0% 0% 0% 0%)" }
            }
            exit={{ opacity: 0, transition: { duration: 0.01 } }}
            transition={{ duration: dur.overlay, ease: ease.inOut }}
          >
            <div className="pointer-events-none absolute inset-0 atmosphere opacity-90" />
            <div className="relative flex max-w-3xl flex-col items-center gap-8 px-8 text-center">
              {/* Restrained shield motif: outline draws itself while the message resolves */}
              <svg viewBox="0 0 100 110" className="h-20 w-auto" fill="none" aria-hidden>
                <motion.path
                  d={SHIELD_PATH}
                  stroke="url(#tg)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: ease.out, delay: 0.15 }}
                />
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#7cc0ff" />
                    <stop offset="1" stopColor="#2563ff" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="font-display text-[clamp(1.4rem,1rem+2.4vw,2.6rem)] font-medium leading-tight tracking-[-0.025em] text-snow">
                {words.map((w, i) => (
                  <span key={`${message}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, ease: ease.out, delay: 0.2 + i * 0.05 }}
                    >
                      {w}
                      {i < words.length - 1 ? " " : ""}
                    </motion.span>
                  </span>
                ))}
              </p>
              <LogoSymbol decorative className="h-5 w-auto opacity-40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
