import type { Metadata } from "next";
import { PhoneText } from "@/components/ui/PhoneText";
import { Mail, MapPin, Phone } from "lucide-react";
import { ClaimForm } from "@/components/forms/ClaimForm";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/sections/PageHero";
import { Placeholder } from "@/components/ui/Placeholder";
import { company } from "@/content/company";

export const metadata: Metadata = {
  title: "Claims & Support",
  description: "Need to make a claim or ask about one? Contact the CONSOLE INSURANCE team.",
  alternates: { canonical: "/claims" },
};

const readyList = [
  "Your policy number, if you have it",
  "When and where it happened",
  "A short description of what happened",
  "How and when we can reach you",
];

export default function ClaimsPage() {
  const { email, address } = company.contact;
  return (
    <>
      <PageHero
        eyebrow="Claims & support"
        title="We're here to help you move forward."
        lead="Tell us what's happened and the team will explain what's needed and what to do next."
      />

      <section className="section pt-4" aria-labelledby="how">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Reveal>
              <h2 id="how" className="h3">
                Start by getting in touch
              </h2>
              <p className="mt-3 text-mist">
                Every insurer has its own claims process. The quickest way to find out what applies to your policy is to
                contact CONSOLE directly.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-electric-300" aria-hidden />
                  <PhoneText className="text-snow" />
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-electric-300" aria-hidden />
                  <a className="break-all text-snow hover:underline" href={`mailto:${email.value}`}>{email.value}</a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={18} className="shrink-0 text-electric-300" aria-hidden />
                  <span>{address.value}</span>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="surface p-7">
              <h2 className="font-display text-lg tracking-[-0.02em]">Helpful to have ready</h2>
              <p className="mt-1 text-xs text-steel">General guidance — your insurer confirms exactly what it needs.</p>
              <ul className="mt-4 space-y-2 text-mist">
                {readyList.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-300" />
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15} className="rounded-2xl border border-line p-6 text-sm text-mist">
              <h2 className="font-semibold text-snow">About claim tracking</h2>
              <p className="mt-2">
                This website doesn&apos;t include a claim-tracking portal, so it can&apos;t show the status of a claim.
                To ask about an existing claim, contact the team using the details above or the form.
              </p>
              <p className="mt-3">
                <Placeholder>CONSOLE&apos;s official claims steps and required documents to be supplied</Placeholder>
              </p>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <ClaimForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
