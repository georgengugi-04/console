"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { currentTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { ShieldFallback } from "./ShieldFallback";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

type Capability = "pending" | "webgl" | "fallback";

const noopSubscribe = () => () => {};
const COMPACT_QUERY = "(max-width: 767px)";
const WIDE_QUERY = "(min-width: 1024px)"; // hero copy and scene sit side by side
function subscribeWide(cb: () => void) {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getWide() {
  return window.matchMedia(WIDE_QUERY).matches;
}
function subscribeCompact(cb: () => void) {
  const mq = window.matchMedia(COMPACT_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getCompact() {
  return window.matchMedia(COMPACT_QUERY).matches;
}

let cachedCapability: Capability | null = null;
function detect(): Capability {
  if (cachedCapability) return cachedCapability;
  cachedCapability = probe();
  return cachedCapability;
}

function probe(): Capability {
  try {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return "fallback";
    if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return "fallback";
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return "fallback";
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return "webgl";
  } catch {
    return "fallback";
  }
}

/**
 * Decides between the real-time 3D scene and the static SVG, lazily loads three.js only when needed,
 * pauses rendering when the hero is off-screen, and fades the canvas in over the poster once it is ready.
 */
export function HeroVisual({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion() ?? false;
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false); // WebGL context lost → fall back to the poster
  const [visible, setVisible] = useState(true);
  // Browser capability + viewport are external values: read them with useSyncExternalStore so the
  // server render (and first client render) uses the static poster, then upgrades without an effect.
  const cap = useSyncExternalStore(noopSubscribe, detect, () => "pending" as Capability);
  const compact = useSyncExternalStore(subscribeCompact, getCompact, () => false);
  const wide = useSyncExternalStore(subscribeWide, getWide, () => false);
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => "light" as Theme);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(Boolean(e?.isIntersecting)), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const use3d = cap === "webgl" && !lost;

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <ShieldFallback
        className={`absolute inset-y-0 right-0 h-full w-full object-contain transition-opacity duration-1000 lg:w-[62%] ${
          use3d && ready ? "opacity-0" : "opacity-100"
        }`}
      />
      {use3d && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroScene
            theme={theme}
            active={visible}
            reduced={reduced}
            compact={compact}
            wide={wide}
            onReady={() => setReady(true)}
            onLost={() => setLost(true)}
          />
        </div>
      )}
    </div>
  );
}
