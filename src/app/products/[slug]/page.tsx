import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, HelpCircle } from "lucide-react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Scene } from "@/components/art/Scene";
import type { SceneName } from "@/content/imagery";
import { ProductArt } from "@/components/sections/ProductArt";
import { LinkButton } from "@/components/ui/Button";
import { availableProducts, getProduct } from "@/content/products";

type Params = { slug: string };

export function generateStaticParams() {
  return availableProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

const productScene: Record<string, SceneName> = { life: "family", health: "health", motor: "road", property: "home", business: "hills" };

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const others = availableProducts.filter((p) => p.slug !== product.slug);

  return (
    <>
      <PageHero scene={productScene[product.slug]} eyebrow={`${product.code} · ${product.name}`} title={product.headline} lead={product.short}>
        <div className="mt-10 flex flex-wrap gap-4">
          <Magnetic>
            <LinkButton href={`/quote?product=${product.slug}`}>
              Get a {product.name.replace(" Insurance", "")} quote <ArrowRight size={18} aria-hidden />
            </LinkButton>
          </Magnetic>
          <LinkButton href="/contact" variant="ghost">
            Ask a question
          </LinkButton>
        </div>
      </PageHero>

      <section className="section" aria-labelledby="overview">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 id="overview" className="h2">
              The idea, in plain language.
            </h2>
            <p className="lead mt-6 max-w-none">{product.summary}</p>
            <div className="surface mt-10 p-7">
              <p className="eyebrow">Who it&apos;s for</p>
              <p className="mt-3 text-lg">{product.whoItsFor}</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="surface relative grid aspect-[4/3] place-items-center overflow-hidden">
              <Scene name={productScene[product.slug] ?? "hills"} className="absolute inset-0" />
              <div className="relative grid h-2/3 aspect-square place-items-center rounded-full bg-surface/85 p-6 shadow-card">
                <ProductArt slug={product.slug} className="h-full w-auto" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section hairline-t" aria-labelledby="think">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Worth thinking about</p>
            <h2 id="think" className="h2 mt-4">
              Questions to ask yourself first.
            </h2>
          </Reveal>
          <ul className="grid gap-4 lg:col-span-7">
            {product.considerations.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 0.07} className="surface flex gap-5 p-6">
                <span className="font-display text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                <span>{c}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section hairline-t" aria-labelledby="ask">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Ask the team</p>
            <h2 id="ask" className="h2 mt-4">
              Good questions for an adviser.
            </h2>
            <p className="mt-5 text-fg-2">
              Bring these to your conversation — or send them to us and we&apos;ll reply.
            </p>
          </Reveal>
          <ul className="space-y-3 lg:col-span-7">
            {product.askUs.map((q) => (
              <li key={q} className="flex items-start gap-4 rounded-2xl border border-line p-5">
                <HelpCircle className="mt-0.5 shrink-0 text-brand" size={20} aria-hidden />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="container-x mt-12 max-w-3xl text-sm text-fg-muted">
          This page is general information, not advice or an offer of cover. Terms, benefits, exclusions and prices are
          set by the issuing insurer and described in the policy documents.
        </p>
      </section>

      <section aria-label="Other insurance" className="section hairline-t">
        <div className="container-x">
          <h2 className="h3">Explore other cover</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/products/${p.slug}`} className="surface flex h-full min-h-28 items-center justify-between gap-4 p-6 transition hover:border-line-strong">
                  <span>
                    <span className="block font-display text-xs tracking-[0.2em] text-brand">{p.code}</span>
                    <span className="mt-1 block font-semibold">{p.name}</span>
                  </span>
                  <ArrowUpRight size={18} aria-hidden className="text-brand" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
