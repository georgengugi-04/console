import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { Explorer } from "@/components/sections/Explorer";
import { Hero } from "@/components/sections/Hero";
import { ProtectionStory } from "@/components/sections/ProtectionStory";
import { Scene } from "@/components/art/Scene";
import { Reveal } from "@/components/motion/Reveal";
import { company, siteUrl } from "@/content/company";
import { founder } from "@/content/founder";

export const metadata: Metadata = {
  title: { absolute: `${company.name} — ${company.tagline}` },
  alternates: { canonical: "/" },
};

const quoteSteps = [
  { n: "01", title: "Tell us what matters", body: "Choose the cover you'd like to explore and share how to reach you. It takes a couple of minutes." },
  { n: "02", title: "We get in touch", body: "A member of the CONSOLE team contacts you by the method you prefer." },
  { n: "03", title: "Options explained", body: "They walk you through the options available and what the insurer needs from you." },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    name: company.name,
    url: siteUrl,
    slogan: company.tagline,
    email: company.contact.email.value,
    founder: { "@type": "Person", name: company.founder },
    address: { "@type": "PostalAddress", postalCode: "20109", addressLocality: "Subukia", addressRegion: "Nakuru", addressCountry: "KE" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <ProtectionStory />

      <section aria-labelledby="explorer-title" className="section relative">
        <div className="container-x grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Not sure where to begin?</p>
            <h2 id="explorer-title" className="h2 mt-4">
              Find your starting point.
            </h2>
            <p className="lead mt-5">
              Two quick questions to point you to the right place to start reading. No price, no pressure — just a
              starting point.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <Explorer />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="how-title" className="section hairline-t">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Getting a quote</p>
            <h2 id="how-title" className="h2 mt-4 max-w-3xl">
              Three steps, one conversation.
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
            {quoteSteps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.1} className="bg-sunken p-8 sm:p-10">
                <p className="font-display text-sm tracking-[0.2em] text-brand">{s.n}</p>
                <h3 className="h3 mt-6">{s.title}</h3>
                <p className="mt-3 text-fg-2">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="founder-teaser" className="section">
        <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">The person behind it</p>
            <h2 id="founder-teaser" className="h2 mt-4">
              Founded by {founder.name}.
            </h2>
            <p className="lead mt-5">
              A Bachelor of Commerce graduate who went on to study insurance and has worked with Old Mutual since 2025,
              he is the founder of CONSOLE INSURANCE.
            </p>
            <Link
              href="/about#founder"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-sm font-semibold transition hover:border-line-strong"
            >
              Read his story <ArrowUpRight size={16} aria-hidden />
            </Link>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="surface relative overflow-hidden">
              <Scene name="family" className="relative h-44 w-full" />
              <div className="p-8 sm:p-10">
              <ShieldCheck className="relative text-brand" size={28} aria-hidden />
              <p className="relative mt-6 font-display text-2xl leading-snug tracking-[-0.02em]">
                {company.tagline}
              </p>
              <p className="relative mt-4 text-sm text-fg-2">— the idea CONSOLE is built around.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="claims-teaser" className="section hairline-t relative overflow-hidden">
        <Scene name="road" mode="backdrop" className="pointer-events-none absolute inset-0" />
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Claims &amp; support</p>
            <h2 id="claims-teaser" className="h2 mt-4">
              When something happens, you shouldn&apos;t have to figure it out alone.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
            <p className="lead">
              Contact the team and tell us what&apos;s happened. We&apos;ll explain what is needed and help you take the next
              step.
            </p>
            <Link href="/claims" className="mt-8 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-brand">
              Go to Claims <ArrowUpRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
