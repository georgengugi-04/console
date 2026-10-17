"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ease } from "@/components/motion/tokens";
import { availableProducts } from "@/content/products";
import { ProductArt } from "./ProductArt";

/**
 * Scroll-driven story: a sticky stage cross-fades between the verified product categories as the
 * reader scrolls (desktop ≥ lg). On smaller screens the same content is a plain, tap-friendly list.
 */
export function ProtectionStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);
  const n = availableProducts.length;

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIndex(Math.min(n - 1, Math.max(0, Math.floor(v * n))));
  });

  const active = availableProducts[index]!;

  return (
    <section aria-labelledby="story-title" className="relative">
      {/* Mobile / tablet: plain list */}
      <div className="container-x section lg:hidden">
        <p className="eyebrow">Protection, mapped to life</p>
        <h2 id="story-title" className="h2 mt-4">
          What would you like to protect?
        </h2>
        <ul className="mt-10 grid gap-5">
          {availableProducts.map((p) => (
            <li key={p.slug} className="surface overflow-hidden p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-xs tracking-[0.2em] text-brand">{p.code}</p>
                  <h3 className="h3 mt-2">{p.name}</h3>
                  <p className="mt-3 text-fg-2">{p.short}</p>
                </div>
                <ProductArt slug={p.slug} className="h-24 w-auto shrink-0" />
              </div>
              <Link href={`/products/${p.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand">
                Learn more<span className="sr-only"> about {p.name}</span> <ArrowUpRight size={16} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: pinned scroll stage */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${n * 85}vh` }}>
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="container-x grid grid-cols-12 items-center gap-10">
            <div className="col-span-5">
              <p className="eyebrow">Protection, mapped to life</p>
              <h2 id="story-title-d" className="h2 mt-4">
                What would you like to protect?
              </h2>
              <ol className="mt-10 space-y-1" aria-label="Insurance categories">
                {availableProducts.map((p, i) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      className={`flex items-baseline gap-4 rounded-xl px-3 py-2 transition-colors ${
                        i === index ? "text-fg" : "text-fg-muted hover:text-fg-2"
                      }`}
                      aria-current={i === index ? "true" : undefined}
                    >
                      <span className="font-display text-xs tracking-[0.2em] text-brand">{p.code}</span>
                      <span className="font-display text-2xl tracking-[-0.02em]">{p.name}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              <div className="mt-8 h-px w-full bg-line">
                <motion.div className="h-px origin-left bg-brand" style={{ scaleX: scrollYProgress }} />
              </div>
            </div>

            <div className="relative col-span-7 min-h-[30rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: ease.out }}
                  className="surface relative grid grid-cols-5 items-center gap-6 overflow-hidden p-10"
                 
                >
                  <div className="relative col-span-3">
                    <p className="font-display text-sm tracking-[0.2em] text-brand">
                      {active.code} / {String(availableProducts.length).padStart(2, "0")}
                    </p>
                    <h3 className="h2 mt-4">{active.headline}</h3>
                    <p className="mt-5 text-fg-2">{active.summary}</p>
                    <Link
                      href={`/products/${active.slug}`}
                      className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold transition hover:border-line-strong"
                    >
                      Explore {active.name} <ArrowUpRight size={16} aria-hidden />
                    </Link>
                  </div>
                  <div className="relative col-span-2">
                    <ProductArt slug={active.slug} className="h-auto w-full" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
