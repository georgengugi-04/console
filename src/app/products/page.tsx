import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Explorer } from "@/components/sections/Explorer";
import { PageHero } from "@/components/sections/PageHero";
import { ProductArt } from "@/components/sections/ProductArt";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightCard } from "@/components/motion/SpotlightCard";
import { TiltCard } from "@/components/motion/TiltCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { availableProducts } from "@/content/products";

export const metadata: Metadata = {
  title: "Insurance Products",
  description: "Explore life, health, motor and property insurance with CONSOLE INSURANCE and request a quote.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const [lead, ...rest] = availableProducts;
  return (
    <>
      <PageHero
        eyebrow="Insurance products"
        title="Protection for what matters."
        lead="Four areas of life, explained simply. Choose one to read more, or let the explorer point you somewhere to start."
      />

      <section aria-label="Insurance categories" className="section pt-8">
        <div className="container-x grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Feature card */}
          {lead && (
            <Reveal className="lg:col-span-7 lg:row-span-2">
              <TiltCard className="h-full">
                <SpotlightCard className="surface flex h-full min-h-[28rem] flex-col justify-between overflow-hidden p-8 sm:p-12">
                  <div className="relative flex items-start justify-between gap-6">
                    <div>
                      <p className="font-display text-sm tracking-[0.2em] text-brand">{lead.code}</p>
                      <h2 className="h2 mt-4">{lead.name}</h2>
                    </div>
                    <ProductArt slug={lead.slug} className="h-40 w-auto shrink-0 sm:h-52" />
                  </div>
                  <div className="relative mt-10">
                    <p className="lead">{lead.summary}</p>
                    <Link href={`/products/${lead.slug}`} className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-brand-fg transition hover:bg-brand-hover">
                      Explore {lead.name} <ArrowUpRight size={16} aria-hidden />
                    </Link>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </Reveal>
          )}

          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={0.08 * (i + 1)} className={i === 0 ? "lg:col-span-5" : i === 1 ? "lg:col-span-5" : "lg:col-span-12"}>
              <SpotlightCard className={`surface flex h-full gap-6 overflow-hidden p-7 sm:p-9 ${i === 2 ? "flex-col sm:flex-row sm:items-center" : "flex-col"}`}>
                <ProductArt slug={p.slug} className={i === 2 ? "h-36 w-auto shrink-0" : "h-32 w-auto self-start"} />
                <div className="flex-1">
                  <p className="font-display text-xs tracking-[0.2em] text-brand">{p.code}</p>
                  <h2 className="h3 mt-2">{p.name}</h2>
                  <p className="mt-3 text-fg-2">{p.short}</p>
                  <p className="mt-3 text-sm text-fg-muted">For: {p.whoItsFor}</p>
                  <Link href={`/products/${p.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand">
                    Learn more<span className="sr-only"> about {p.name}</span> <ArrowUpRight size={16} aria-hidden />
                  </Link>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <p className="container-x mt-10 max-w-3xl text-sm text-fg-muted">
          Descriptions here are general. Cover, limits, exclusions and prices depend on the policy issued by the insurer.
        </p>
      </section>

      <section aria-labelledby="explorer" className="section hairline-t">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Explorer</p>
            <h2 id="explorer" className="h2 mt-4 max-w-3xl">
              Not sure which to read first?
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 max-w-4xl">
            <Explorer />
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
