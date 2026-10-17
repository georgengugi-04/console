import { ArrowRight } from "lucide-react";
import { HeroVisual } from "@/components/three/HeroVisual";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitText } from "@/components/motion/SplitText";
import { LinkButton } from "@/components/ui/Button";
import { company } from "@/content/company";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="atmosphere relative isolate overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10" />

      <div className="container-x relative grid grid-cols-1 min-h-[100svh] items-center gap-0 pb-12 pt-28 lg:grid-cols-12 lg:pb-0 lg:pt-0">
        {/* 3D scene: sits behind copy on desktop, above it on mobile. Never blocks the actions. */}
        <div className="pointer-events-none relative order-first -mx-[var(--gutter)] h-[46svh] min-h-[300px] lg:absolute lg:inset-0 lg:mx-0 lg:h-auto lg:w-full">
          <HeroVisual className="h-full w-full" />
        </div>

        <div className="relative z-10 py-10 lg:col-span-6 lg:py-32">
          <p className="eyebrow mb-6">Insurance agency · Subukia, Nakuru</p>
          <h1 id="hero-title" className="h-display">
            <SplitText as="span" text="Your Tomorrow, Our Priority." className="block" delay={0.15} />
          </h1>
          <p className="lead mt-8">
            Explore insurance protection for your life, vehicle, health and home — with a team that explains your
            options in plain language.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <LinkButton href="/products">
                Explore Insurance <ArrowRight size={18} aria-hidden />
              </LinkButton>
            </Magnetic>
            <Magnetic>
              <LinkButton href="/quote" variant="ghost">
                Get a Quote
              </LinkButton>
            </Magnetic>
          </div>
          <p className="mt-8 text-sm text-steel">
            {company.name} · {company.legalDescriptor}
          </p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
    </section>
  );
}
