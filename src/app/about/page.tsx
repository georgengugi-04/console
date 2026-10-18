import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { Photo } from "@/components/art/Photo";
import { FounderSection } from "@/components/sections/FounderSection";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "About",
  description: `${company.name} is an insurance agency in Subukia, Nakuru, founded by ${company.founder}.`,
  alternates: { canonical: "/about" },
};

const pillars = [
  {
    title: "What we do",
    body: "CONSOLE INSURANCE is an insurance agency. We help people explore life, health, motor and property insurance and take the next step with a team they can reach.",
  },
  {
    title: "How we think",
    body: "Insurance is about tomorrow. We aim to explain the options in plain language, so you can ask better questions and choose with confidence.",
  },
  {
    title: "Where we are",
    body: `${company.contact.address.value}. Call, email or send an enquiry — we'll point you in the right direction.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero scene="hills"
        eyebrow="About CONSOLE"
        title="Thoughtful protection for the life you're building."
        lead="The people and purpose behind CONSOLE INSURANCE."
      />

      <section aria-labelledby="statement" className="section">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <h2 id="statement" className="h2 text-balance">
              <span className="text-gradient">{company.tagline}</span> It&apos;s not a slogan so much as a starting
              point: protection only matters if it&apos;s there when tomorrow arrives.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4">
            <Photo id="land" width={900} className="aspect-[4/3] w-full rounded-[var(--radius-card)]" />
          </Reveal>
        </div>

        <div className="container-x mt-20 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1} className="bg-sunken p-8 sm:p-10">
              <p className="font-display text-sm tracking-[0.2em] text-brand">0{i + 1}</p>
              <h3 className="h3 mt-6">{p.title}</h3>
              <p className="mt-3 text-fg-2">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <FounderSection />
      <CtaBand title="Want to meet the team?" body="Send an enquiry or get in touch directly — we'd be glad to hear from you." />
    </>
  );
}
